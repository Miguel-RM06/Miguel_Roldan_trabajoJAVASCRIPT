document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    autoplay: { delay: 8000 },
  });

  // Configuración de botones según página
  let botonesConfig = [];

  if (window.location.pathname.includes('index.html')) {
    botonesConfig = [
      { href: 'views/galeria.html', text: 'VER PRODUCTOS' }
    ];
  } else if (window.location.pathname.includes('galeria.html')) {
    botonesConfig = [
      { href: 'presupuesto.html', text: 'PRODUCTO 1 COMPRAR AHORA' },
      { href: 'presupuesto.html', text: 'PRODUCTO 2 COMPRAR AHORA' },
      { href: 'presupuesto.html', text: 'PRODUCTO 3 COMPRAR AHORA' },
      { href: 'presupuesto.html', text: 'PRODUCTO 4 COMPRAR AHORA' },
    ];
  }

  function agregarBotones() {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach((slide, i) => {
      if (!slide.querySelector('.btn-verproductos')) {
        const boton = document.createElement('a');
        const config = botonesConfig[i % botonesConfig.length]; // Si hay menos configs que slides, se repite
        boton.href = config.href;
        boton.textContent = config.text;
        boton.className = 'btn-verproductos';
        slide.appendChild(boton);
      }
    });
  }

  agregarBotones();
  swiper.on('slideChange', agregarBotones);
});
