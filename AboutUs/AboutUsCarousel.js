let index = 0;
let flippedIndex = null;
let autoTimer = null;
let flipTimeout = null;
const intervalMs = 10000;

const developers = [
  { name:"Ayadett Díaz", role:"Product Owner / Full Stack", photo:"../src/team/DEV3.jpeg",
    contact:{ email:"diazayadett@gmail.com", phone:"+52 55 21549832",
      linkedin:"https://www.linkedin.com/in/ananil-ayadett-diaz/",
      github:"https://github.com/diazayadett-byte"} },
  { name:"Angel Papaqui", role:"Full Stack Developer", photo:"../src/team/DEV4.jpeg",
    contact:{ email:"angeldavidpapaqui@gmail.com", phone:"+52 55 0000 0002",
      linkedin:"https://www.linkedin.com/in/angel-papaqui/",
      github:"https://github.com/angel-papaqui"} },
  { name:"Edgar Saltillo", role:"Scrum Master", photo:"../src/team/DEV7.jpeg",
    contact:{ email:"edsaltillo@gmail.com", phone:"+52 55 73743966",
      linkedin:"https://www.linkedin.com/in/edgar-saltillo-ramirez/",
      github:"https://github.com/Ed-Sal1"} },
  { name:"Fátima Orozco", role:"Full Stack Developer", photo:"../src/team/DEV2.jpeg",
    contact:{ email:"dev4@correo.com", phone:"+52 55 0000 0004",
      linkedin:"https://www.linkedin.com/in/f%C3%A1timaorozcodami%C3%A1n/",
      github:"https://github.com/fatiorozd-cpu"} },
  { name:"Hector Aguero", role:"Full Stack Developer", photo:"../src/team/DEV5.jpeg",
    contact:{ email:"destoreals@gmail.com", phone:"+52 55 0000 0005",
      linkedin:"https://www.linkedin.com/in/hectormagdaleno/",
      github:"https://github.com/Estorealsuwu"} },
  { name:"Nayeli Morales", role:"Full Stack Developer", photo:"../src/team/DEV6.jpeg",
    contact:{ email:"moralesmedinanayeli@gmail.com", phone:"+52 55 0000 0006",
      linkedin:"https://www.linkedin.com/in/nayeli-morales-desarrollador-full-stack/",
      github:"https://github.com/Naye2008"} },
  { name:"Sergio Acevedo", role:"Full Stack Developer", photo:"../src/team/DEV1.jpeg",
    contact:{ email:"sergioarmandoacevedo@gmail.com", phone:"+52 55 0000 0007",
      linkedin:"https://www.linkedin.com/in/saac21/",
      github:"https://github.com/sergioac-cloud"} }
];

const rail = document.getElementById("carouselRail");

function render() {
  rail.innerHTML = "";

  [-1, 0, 1].forEach(offset => {
    const i = (index + offset + developers.length) % developers.length;
    const d = developers[i];

    const card = document.createElement("button");
    card.className = `teamCard ${offset === 0 ? "center" : "side"}`;

    card.innerHTML = `
      <div class="teamCardInner ${flippedIndex === i ? "isFlipped" : ""}">
        <div class="teamFace">
          <div class="teamPhotoWrap">
            <img class="teamPhoto" src="${d.photo}">
          </div>
          <h3 class="teamName">${d.name}</h3>
          <p class="teamRole">${d.role}</p>
          <span class="teamHint">Click para ver contacto</span>
        </div>
        <div class="teamFace teamBack">
          <h3 class="teamName">${d.name}</h3>
          <div class="teamContact">
            <p>${d.contact.email}</p>
            <p>${d.contact.phone}</p>
            <a href="${d.contact.linkedin}" target="_blank">LinkedIn</a>
            <a href="${d.contact.github}" target="_blank">GitHub</a>
          </div>
          <span class="teamHint">Click para volver</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      if (offset !== 0) {
        flippedIndex = null;
        index = i;
      } else {
        flippedIndex = flippedIndex === i ? null : i;
        clearTimeout(flipTimeout);
        if (flippedIndex !== null) {
          flipTimeout = setTimeout(() => {
            flippedIndex = null;
            render();
          }, 10000);
        }
      }
      resetAuto();
      render();
    };

    rail.appendChild(card);
  });
}

function next() {
  flippedIndex = null;
  index = (index + 1) % developers.length;
  render();
}

function prev() {
  flippedIndex = null;
  index = (index - 1 + developers.length) % developers.length;
  render();
}

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(next, intervalMs);
}

document.getElementById("nextBtn").onclick = next;
document.getElementById("prevBtn").onclick = prev;

resetAuto();
render();
