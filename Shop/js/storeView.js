import {
  DEFAULT_PAGE_SIZE,
  ENABLE_EXTERNAL_PRODUCT_PAGE,
  PRODUCT_DETAIL_URL
} from "./config.js";

export const createStore = ({ products = [] }) => {
  const state = {
    search: "",
    categories: new Set(),
    colors: new Set(),
    sizes: new Set(),
    priceMin: null,
    priceMax: null,
    sort: "relevance",
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    favorites: new Set(JSON.parse(localStorage.getItem("favorites") || "[]")),
    products
  };

  const $ = (id) => document.getElementById(id);

  const exists = (id) => !!document.getElementById(id);

  const saveFavorites = () => {
    localStorage.setItem("favorites", JSON.stringify([...state.favorites]));
  };

  const normalizeImage = (product) => {
    const img = product?.image ?? {};
    return {
      src: img.src || "https://via.placeholder.com/640x480?text=Producto",
      alt: img.alt || "Imagen referencial del producto"
    };
  };

  const toggleFavorite = (productId) => {
    state.favorites.has(productId)
      ? state.favorites.delete(productId)
      : state.favorites.add(productId);

    saveFavorites();
    renderStore();
  };

  const goToProduct = (productId) => {
    if (!ENABLE_EXTERNAL_PRODUCT_PAGE) return;

    // Link vacío por ahora (placeholder). Evitamos recargar.
    // Cuando exista ProductDetail real, cambiar esto.
    if (!PRODUCT_DETAIL_URL) return;

    window.location.href = `${PRODUCT_DETAIL_URL}?id=${encodeURIComponent(productId)}`;
  };

  const applyFilters = (list) => {
    let result = list;

    if (state.search.trim()) {
      const q = state.search.toLowerCase();
      result = result.filter((p) =>
        `${p.name ?? ""} ${p.description ?? ""}${p.category ?? ""}`.toLowerCase().includes(q)
      );
    }

    if (state.categories.size) {
      result = result.filter((p) => state.categories.has(p.category));
    }

    if (state.colors.size) {
      result = result.filter(
        (p) => Array.isArray(p.colors) && p.colors.some((c) => state.colors.has(c))
      );
    }

    if (state.sizes.size) {
      result = result.filter(
        (p) => Array.isArray(p.sizes) && p.sizes.some((s) => state.sizes.has(s))
      );
    }

    if (state.priceMin !== null) {
      result = result.filter((p) => Number(p.price) >= Number(state.priceMin));
    }

    if (state.priceMax !== null) {
      result = result.filter((p) => Number(p.price) <= Number(state.priceMax));
    }

    if (state.sort === "priceAsc") result = [...result].sort((a, b) => a.price - b.price);
    if (state.sort === "priceDesc") result = [...result].sort((a, b) => b.price - a.price);
    if (state.sort === "ratingDesc") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  };

  const renderPagination = (totalPages) => {
    const pagination = $("pagination");
    pagination.innerHTML = "";

    for (let p = 1; p <= totalPages; p++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `page-btn ${p === state.page ? "active" : ""}`;
      btn.dataset.action = "page";
      btn.dataset.page = p;
      btn.textContent = p;
      pagination.appendChild(btn);
    }
  };

  const renderStore = () => {
    const grid = $("productsGrid");
    const filtered = applyFilters(state.products);

    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    grid.innerHTML = pageItems.map((p) => {
      const fav = state.favorites.has(p.id);
      const img = normalizeImage(p);

      return `
        <div class="col-12 col-sm-6 col-lg-4" role="listitem">
          <a class="product-link" href="" data-action="open" data-id="${p.id}" aria-label="Abrir producto">
            <article class="product-card" aria-label="Producto">
              <button class="wishlist-btn" type="button" data-action="favorite" data-id="${p.id}" aria-label="Favorito">
                ${fav ? "♥" : "♡"}
              </button>

              <img class="product-img" src="${img.src}" alt="${img.alt}" />

              <div class="product-body">
                <h3 class="product-name">${p.name ?? "Producto"}</h3>
                <p class="product-desc">${p.description ?? "Descripción pendiente."}</p>
                <div class="product-meta">
                  <span class="product-price">$${Number(p.price || 0).toFixed(2)}</span>
                  <span>⭐ ${p.rating ?? 0} (${p.reviews ?? 0})</span>
                </div>
              </div>
            </article>
          </a>
        </div>
      `;
    }).join("");

    renderPagination(totalPages);
  };

  const openFilters = () => {
    if (!exists("filtersDrawer")) return;
    const drawer = $("filtersDrawer");
    const overlay = $("filtersOverlay");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    $("filtersToggle")?.setAttribute("aria-expanded", "true");
  };

  const closeFilters = () => {
    if (!exists("filtersDrawer")) return;
    const drawer = $("filtersDrawer");
    const overlay = $("filtersOverlay");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    $("filtersToggle")?.setAttribute("aria-expanded", "false");
  };

  const syncTextControls = (value) => {
    if (exists("storeSearch")) $("storeSearch").value = value;
    if (exists("storeSearchDesktop")) $("storeSearchDesktop").value = value;
  };

  const syncSortControls = (value) => {
    if (exists("sortSelect")) $("sortSelect").value = value;
    if (exists("sortSelectDesktop")) $("sortSelectDesktop").value = value;
  };

  const bindEvents = () => {
    $("filtersToggle")?.addEventListener("click", openFilters);
    $("filtersClose")?.addEventListener("click", closeFilters);
    $("filtersOverlay")?.addEventListener("click", closeFilters);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFilters();
    });

    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-action]");
      if (!el) return;

      const { action, id, page } = el.dataset;

      if (action === "favorite") {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(id);
        return;
      }

      if (action === "open") {
        e.preventDefault(); // href="" placeholder
        goToProduct(id);
        return;
      }

      if (action === "page") {
        state.page = Number(page);
        renderStore();
        return;
      }
    });

    const onSearch = (value) => {
      state.search = value;
      state.page = 1;
      syncTextControls(value);
      renderStore();
    };

    $("storeSearch")?.addEventListener("input", (e) => onSearch(e.target.value));
    $("storeSearchDesktop")?.addEventListener("input", (e) => onSearch(e.target.value));

    const onSort = (value) => {
      state.sort = value;
      state.page = 1;
      syncSortControls(value);
      renderStore();
    };

    $("sortSelect")?.addEventListener("change", (e) => onSort(e.target.value));
    $("sortSelectDesktop")?.addEventListener("change", (e) => onSort(e.target.value));

    document.querySelectorAll(".filter-category").forEach((cb) =>
      cb.addEventListener("change", (e) => {
        e.target.checked ? state.categories.add(e.target.value) : state.categories.delete(e.target.value);
        state.page = 1;
        renderStore();
      })
    );

    document.querySelectorAll(".filter-color").forEach((cb) =>
      cb.addEventListener("change", (e) => {
        e.target.checked ? state.colors.add(e.target.value) : state.colors.delete(e.target.value);
        state.page = 1;
        renderStore();
      })
    );

    document.querySelectorAll(".filter-size").forEach((cb) =>
      cb.addEventListener("change", (e) => {
        e.target.checked ? state.sizes.add(e.target.value) : state.sizes.delete(e.target.value);
        state.page = 1;
        renderStore();
      })
    );

    $("applyPrice")?.addEventListener("click", () => {
      state.priceMin = $("priceMin").value || null;
      state.priceMax = $("priceMax").value || null;
      state.page = 1;
      renderStore();
    });

    $("mApplyPrice")?.addEventListener("click", () => {
      state.priceMin = $("mPriceMin").value || null;
      state.priceMax = $("mPriceMax").value || null;
      state.page = 1;
      renderStore();
      closeFilters();
    });
  };

  const setProducts = (newProducts) => {
    state.products = Array.isArray(newProducts) ? newProducts : [];
    state.page = 1;
    renderStore();
  };

  return { bindEvents, render: renderStore, setProducts };
};
