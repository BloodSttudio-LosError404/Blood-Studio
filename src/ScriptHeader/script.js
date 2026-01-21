const botonMenu = document.querySelector('.barras');
const menu = document.querySelector('.desplegable');

botonMenu.addEventListener('click', () => {
  menu.classList.toggle('abrir-menu');
});