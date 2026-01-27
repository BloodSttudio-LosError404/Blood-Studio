new Swiper(".heroSwiper", {
  loop: true,
  speed: 1000,

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});


/* Text Loop Carousel */
const track = document.getElementById("textTrack");

  let position = 0;
  let speed = -0.6; // 🔁 negativo = derecha → izquierda
  let isPaused = false;

  // Duplicamos contenido para loop infinito
  track.innerHTML += track.innerHTML;

  function animate() {
    if (!isPaused) {
      position += speed;

      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
    }
    requestAnimationFrame(animate);
  }

  // ⏸️ Pausa al hover
  track.addEventListener("mouseenter", () => isPaused = true);
  track.addEventListener("mouseleave", () => isPaused = false);

  animate();