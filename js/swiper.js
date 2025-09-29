// swiper.js
// Inicializa Swiper y agrega botones "VER PRODUCTOS" a cada slide.
// REQUISITO: Swiper ya debe estar cargado y existir el contenedor .swiper en el DOM.

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de Swiper (configuración básica)
  const swiper = new Swiper('.swiper', {
    loop: true, // Habilita el bucle infinito
    effect: 'fade', // Efecto de desvanecimiento entre slides
    fadeEffect: { crossFade: true }, // Suaviza el fade
    pagination: { el: '.swiper-pagination', clickable: true }, // Puntos de paginación clicables
    autoplay: { delay: 8000 }, // Cambio automático cada 8 segundos
  });

  // Función para agregar botones "VER PRODUCTOS" a cada slide (evita duplicados)
  function agregarBotones() {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
      if (!slide.querySelector('.btn-verproductos')) { // Solo si no existe ya
        const boton = document.createElement('a');
        boton.href = 'views/galeria.html'; // Ruta relativa al index.html
        boton.textContent = 'VER PRODUCTOS';
        boton.className = 'btn-verproductos';
        slide.appendChild(boton);
      }
    });
  }

  // Ejecutar al iniciar y cada vez que cambia el slide
  agregarBotones();
  swiper.on('slideChange', agregarBotones);
});
