"use strict";

import { loadCatalog } from "./catalogLoader.js";
import { createStore } from "./storeView.js";

const boot = async () => {
  const { products } = await loadCatalog();
  const store = createStore({ products });

  store.bindEvents();
  store.render();
};

boot();
