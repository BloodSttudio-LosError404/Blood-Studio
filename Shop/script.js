"use strict";

/*
  Fuente de datos actual (JSON local dentro del repo).
  Cuando haya un back, cambiar esto por esto:
  const DATA_SOURCE_URL = "/api/products";
*/
const DATA_SOURCE_URL = "../src/data/products.catalog.json";

/*  Hoy se simula en la misma página.
  Cuando exista ProductDetail real:
  const ENABLE_EXTERNAL_PRODUCT_PAGE = true;
*/
const ENABLE_EXTERNAL_PRODUCT_PAGE = false;
const PRODUCT_DETAIL_URL = "../ProductDetail/index.html";


const state = {
  search: "",
  categories: new Set(),
  colors: new Set(),
  sizes: new Set(),
  priceMin: null,
  priceMax: null,
  sort: "relevance",
  page: 1,
  pageSize: 9,
  favorites: new Set(JSON.parse(localStorage.getItem("favorites") || "[]"))
};

let products = [];


const $ = (id) => document.getElementById(id);

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
  render();
};

const goToProduct = (productId) => {
  if (ENABLE_EXTERNAL_PRODUCT_PAGE) {
    window.location.href = `${PRODUCT_DETAIL_URL}?id=${encodeURIComponent(productId)}`;
    return;
  }

  history.pushState(
    { view: "detail", id: productId },
    "",
    `?product=${encodeURIComponent(productId)}`
  );
  render();
};

const backToStore = () => {
  history.pushState({ view: "store" }, "", "index.html");
  render();
};

const getViewFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const pid = params.get("product");
  return pid ? { view: "detail", id: pid } : { view: "store" };
};


const loadProducts = async () => {
  try {
    /*
      Cuando haya un back:
      fetch(`/api/products?season=${...}&category=${...}`)
    */
    const res = await fetch(DATA_SOURCE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    products = Array.isArray(data.products) ? data.products : [];
  } catch (err) {
    /*
      Cuando haya un back:
      manejar errores 4xx / 5xx y mostrar feedback visual
    */
    products = [];
    console.error("No se pudo cargar el catálogo:", err);
  }
};


const applyFilters = (list) => {
  let result = list;

  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    result = result.filter((p) =>
      `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase().includes(q)
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
    result = result.filter((p) => Number(p.price) >= state.priceMin);
  }

  if (state.priceMax !== null) {
    result = result.filter((p) => Number(p.price) <= state.priceMax);
  }

  if (state.sort === "priceAsc") {
    result = [...result].sort((a, b) => a.price - b.price);
  }

  if (state.sort === "priceDesc") {
    result = [...result].sort((a, b) => b.price - a.price);
  }

  if (state.sort === "ratingDesc") {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

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
  const filtered = applyFilters(products);

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  if (state.page > totalPages) state.page = totalPages;

  const start = (state.page - 1) * state.pageSize;
  const pageItems = filtered.slice(start, start + state.pageSize);

  grid.innerHTML = pageItems
    .map((p) => {
      const fav = state.favorites.has(p.id);
      const img = normalizeImage(p);

      return `
        <div class="col-12 col-sm-6 col-lg-4">
          <article class="product-card" data-action="open" data-id="${p.id}">
            <button class="wishlist-btn" data-action="favorite" data-id="${p.id}">
              ${fav ? "♥" : "♡"}
            </button>
            <img class="product-img" src="${img.src}" alt="${img.alt}">
            <div class="product-body">
              <h3 class="product-name">${p.name ?? "Producto"}</h3>
              <p class="product-desc">${p.description ?? "Descripción pendiente."}</p>
              <div class="product-meta">
                <span class="product-price">$${Number(p.price).toFixed(2)}</span>
                <span>⭐ ${p.rating ?? 0} (${p.reviews ?? 0})</span>
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join("");

  renderPagination(totalPages);
};

const renderDetail = (productId) => {
  const grid = $("productsGrid");
  const pagination = $("pagination");
  pagination.innerHTML = "";

  const product = products.find((p) => p.id === productId);
  if (!product) {
    grid.innerHTML = `<div class="alert alert-warning">Producto no encontrado.</div>`;
    return;
  }

  grid.innerHTML = `
    <button class="btn btn-link p-0 mb-3" data-action="back">← Volver</button>
    <div class="store-panel p-3">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <strong>$${Number(product.price).toFixed(2)}</strong>
    </div>
  `;
};

const render = () => {
  const view = getViewFromURL();
  view.view === "detail" ? renderDetail(view.id) : renderStore();
};


document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;

  const { action, id, page } = el.dataset;

  if (action === "favorite") {
    e.stopPropagation();
    toggleFavorite(id);
  }

  if (action === "open") {
    goToProduct(id);
  }

  if (action === "page") {
    state.page = Number(page);
    render();
  }

  if (action === "back") {
    backToStore();
  }
});

$("storeSearch").addEventListener("input", (e) => {
  state.search = e.target.value;
  state.page = 1;
  render();
});

document.querySelectorAll(".filter-category").forEach((cb) =>
  cb.addEventListener("change", (e) => {
    e.target.checked
      ? state.categories.add(e.target.value)
      : state.categories.delete(e.target.value);
    state.page = 1;
    render();
  })
);

document.querySelectorAll(".filter-color").forEach((cb) =>
  cb.addEventListener("change", (e) => {
    e.target.checked
      ? state.colors.add(e.target.value)
      : state.colors.delete(e.target.value);
    state.page = 1;
    render();
  })
);

document.querySelectorAll(".filter-size").forEach((cb) =>
  cb.addEventListener("change", (e) => {
    e.target.checked
      ? state.sizes.add(e.target.value)
      : state.sizes.delete(e.target.value);
    state.page = 1;
    render();
  })
);

$("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  state.page = 1;
  render();
});

$("applyPrice").addEventListener("click", () => {
  state.priceMin = $("priceMin").value || null;
  state.priceMax = $("priceMax").value || null;
  state.page = 1;
  render();
});

window.addEventListener("popstate", render);

(async () => {
  await loadProducts();
  render();
})();
