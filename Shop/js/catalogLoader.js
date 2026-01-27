import { DATA_SOURCE_URL } from "./config.js";

/*
  Cuando haya un back, se debe de cambiar esto
*/
export const loadCatalog = async () => {
  try {
    const res = await fetch(DATA_SOURCE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const products = Array.isArray(data.products) ? data.products : [];

    return { catalog: data.catalog || null, products };
  } catch (err) {
    // Cuando haya un back, cambiar esto por esto: mostrar feedback visual según error
    console.error("No se pudo cargar el catálogo:", err);
    return { catalog: null, products: [] };
  }
};
