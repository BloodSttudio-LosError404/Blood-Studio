"use strict";

/*
  Fuente de datos actual (JSON local dentro del repo).
  Cuando haya un back, cambiar esto por esto:
  export const DATA_SOURCE_URL = "/api/products";
*/
export const DATA_SOURCE_URL = "../src/data/products.catalog.json";

/*
  Hoy se simula en la misma página.
  Cuando exista ProductDetail real:
  export const ENABLE_EXTERNAL_PRODUCT_PAGE = true;
*/
export const ENABLE_EXTERNAL_PRODUCT_PAGE = false;
export const PRODUCT_DETAIL_URL = "../ProductDetail/index.html";

export const DEFAULT_PAGE_SIZE = 9;
