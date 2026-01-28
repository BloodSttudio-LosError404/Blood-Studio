
document.documentElement.classList.add("layout-loading");

const LAYOUT = {
    headerUrl: "/Layout/Header/index.html",
    footerUrl: "/Layout/Footer/index.html",
    headerMountId: "appHeader",
    footerMountId: "appFooter",
};


async function fetchHtml(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`No se pudo cargar ${url} (HTTP ${res.status})`);
    }
    return await res.text();
}

async function mountPartial(mountId, url) {
    const mount = document.getElementById(mountId);
    if (!mount) return;
    const html = await fetchHtml(url);
    mount.innerHTML = html;
}

async function loadLayout() {
    await Promise.all([
        mountPartial(LAYOUT.headerMountId, LAYOUT.headerUrl),
        mountPartial(LAYOUT.footerMountId, LAYOUT.footerUrl),
    ]);

    if (typeof window.initHeader === "function") {
        window.initHeader();
    }
}


function initGlobalEnhancements() {

    const mobileMenu = document.querySelector(".desplegable");
    if (!mobileMenu) return;

    if (mobileMenu.dataset.boundClose === "1") return;
    mobileMenu.dataset.boundClose = "1";

    mobileMenu.addEventListener("click", (e) => {
        const link = e.target.closest("a");
        if (!link) return;
        mobileMenu.classList.remove("abrir-menu");
    });
}


function getCurrentPageKey() {
    const bodyKey = document.body?.dataset?.page?.trim();
    if (bodyKey) return bodyKey.toLowerCase();

    const main = document.querySelector("main[data-page]");
    const mainKey = main?.dataset?.page?.trim();
    if (mainKey) return mainKey.toLowerCase();

    return null;
}

async function initPageSpecific() {
    const key = getCurrentPageKey();
    if (!key) return;

}


async function bootstrap() {
    await loadLayout();
    document.documentElement.classList.remove("layout-loading");
    document.documentElement.classList.add("layout-ready");

    initGlobalEnhancements();

    await initPageSpecific();
}

document.addEventListener("DOMContentLoaded", () => {
    bootstrap().catch((err) => {
        console.error("[app.js] Error en bootstrap:", err);
    });
});
