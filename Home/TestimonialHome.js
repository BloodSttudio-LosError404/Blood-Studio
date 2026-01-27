const cardsData = [
  {
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    date: "April 20, 2025"
  },
  {
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    date: "May 10, 2025"
  },
  {
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    date: "June 5, 2025"
  },
  {
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=60",
    name: "Avery Johnson",
    handle: "@averywrites",
    date: "May 10, 2025"
  }
];

const createCard = (card) => `
  <div class="card">
    <div class="card-header">
      <img src="${card.image}" alt="${card.name}">
      <div>
        <div class="card-name">${card.name}</div>
        <div class="card-handle">${card.handle}</div>
      </div>
    </div>

    <p class="card-text">
      Radiant made undercutting all of our competitors an absolute breeze.
    </p>

    <div class="card-footer">
      <span>Google</span>
      <p>${card.date}</p>
    </div>
  </div>
`;

function renderCards(targetId) {
  const target = document.getElementById(targetId);
  const doubled = [...cardsData, ...cardsData];
  doubled.forEach(card =>
    target.insertAdjacentHTML("beforeend", createCard(card))
  );
}

renderCards("row1");
renderCards("row2");
