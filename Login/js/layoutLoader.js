

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
    loadPartial("appHeader", "../Layout/Header/index.html"),
    loadPartial("appFooter", "../Layout/Footer/index.html")
  ]);
};
