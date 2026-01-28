window.initHeader = function initHeader() {
  const botonMenu =
    document.querySelector(".barras") ||
    document.querySelector('[data-role="hamburger"]');

  const menu =
    document.querySelector(".desplegable") ||
    document.querySelector('[data-role="mobile-menu"]');

  if (!botonMenu || !menu) return;

  if (botonMenu.dataset.bound === "1") return;
  botonMenu.dataset.bound = "1";

  botonMenu.addEventListener("click", () => {
    menu.classList.toggle("abrir-menu");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  window.initHeader?.();
});
