

export const loadPartial = async (mountId, url) => {
  const mountPoint = document.getElementById(mountId);
  if (!mountPoint) return;

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    mountPoint.innerHTML = "";
    return;
  }

  mountPoint.innerHTML = await response.text();
};

export const loadLayout = async () => {
  await Promise.all([
    loadPartial("appHeader", "../Layoaut/Header/index.html"),
    loadPartial("appFooter", "../Layoaut/Footer/index.html")
  ]);
};
