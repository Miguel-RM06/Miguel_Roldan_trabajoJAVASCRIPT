document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // 1. INICIALIZAR SWIPER (si existe)
  // ================================
  if (typeof Swiper !== 'undefined' && document.querySelector('.swiper')) {
    // Inicializa el slider si la librería Swiper está disponible y existe el contenedor
    const swiper = new Swiper('.swiper', {
      loop: true, // bucle infinito
      effect: 'fade', // efecto de transición
      fadeEffect: { crossFade: true }, // transición suave entre slides
      pagination: { el: '.swiper-pagination', clickable: true }, // paginación con clics
      autoplay: { delay: 8000 }, // autoplay cada 8s
    });

    // Función para agregar botones "VER PRODUCTOS" en cada slide
    function agregarBotones() {
      document.querySelectorAll('.swiper-slide').forEach(slide => {
        // Evita duplicados comprobando si ya existe el botón
        if (!slide.querySelector('.btn-verproductos')) {
          const boton = document.createElement('a');
          boton.href = 'productos.html';
          boton.textContent = 'VER PRODUCTOS';
          boton.className = 'btn-verproductos';
          slide.appendChild(boton);
        }
      });
    }

    agregarBotones(); // se ejecuta al inicio
    swiper.on('slideChange', agregarBotones); // se ejecuta en cada cambio de slide
  } else {
    console.info('Swiper no inicializado: falta la librería o el elemento .swiper.');
  }

  // ================================
  // 2. CARGAR NOTICIAS JSON (si existe el contenedor)
  // ================================
  const contenedorNoticias = document.getElementById('contenedor-noticias');
  if (contenedorNoticias) {
    // Se cargan las noticias desde un archivo JSON externo
    fetch('Datos/noticias.json')
      .then(res => res.json())
      .then(noticias => {
        noticias.forEach(noticia => {
          // Se crean enlaces con las noticias cargadas dinámicamente
          const a = document.createElement('a');
          a.href = "/PáginasHTML/presupuesto.html"; // destino
          a.classList.add("noticia");
          a.innerHTML = `
            <h3 class="titulo">${noticia.titulo}</h3>
            <small class="fecha">${noticia.fecha}</small>
            <p class="contenido">${noticia.contenido}</p>
          `;
          contenedorNoticias.appendChild(a);
        });
      })
      .catch(err => console.error('Error al cargar las noticias:', err));
  } else {
    console.info('contenedor-noticias no encontrado — omito carga de noticias.');
  }

  // ================================
  // 3. VALIDACIÓN Y PRESUPUESTO (solo si existe el formulario)
  // ================================
  const form = document.getElementById("formPresupuesto");
  if (form) {
    // Seleccionamos los campos dentro del formulario
    const nombre = form.querySelector("#nombre");
    const apellidos = form.querySelector("#apellidos");
    const telefono = form.querySelector("#telefono");
    const email = form.querySelector("#email");
    const producto = form.querySelector("#producto");
    const plazo = form.querySelector("#plazo");
    const extras = form.querySelectorAll(".extra"); // NodeList con checkboxes
    const totalEl = form.querySelector("#total") || document.getElementById("total");

    // Funciones de validación con expresiones regulares
    function validarNombre(valor) {
      return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor) && valor.length <= 15;
    }

    function validarApellidos(valor) {
      return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor) && valor.length <= 40;
    }

    function validarTelefono(valor) {
      return /^[0-9]{9}$/.test(valor);
    }

    function validarEmail(valor) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    // Calcula el presupuesto dinámicamente
    function calcularPresupuesto() {
      if (!totalEl) {
        console.warn('Elemento #total no encontrado: no se mostrará el total.');
        return;
      }

      let total = 0;

      // Suma precio del producto
      const precioProducto = producto ? parseFloat(producto.value) || 0 : 0;
      total += precioProducto;

      // Suma extras seleccionados
      if (extras && extras.length) {
        extras.forEach(extra => {
          if (extra.checked) total += parseFloat(extra.value) || 0;
        });
      }

      // Aplica descuento según meses de plazo
      const meses = plazo ? parseInt(plazo.value) || 1 : 1;
      let descuento = 0;
      if (meses >= 12) descuento = 0.20; // 20%
      else if (meses >= 6) descuento = 0.10; // 10%

      total -= total * descuento;

      // Muestra el total en el DOM
      totalEl.textContent = total.toFixed(2);
    }

    // Listeners para recalcular presupuesto al cambiar valores
    if (producto) producto.addEventListener("change", calcularPresupuesto);
    if (plazo) plazo.addEventListener("input", calcularPresupuesto);
    if (extras && extras.length) extras.forEach(extra => extra.addEventListener("change", calcularPresupuesto));

    // Cálculo inicial
    calcularPresupuesto();

    // Validación al enviar formulario
    form.addEventListener("submit", function (e) {
      if (nombre && !validarNombre(nombre.value)) {
        alert("Nombre inválido. Máximo 15 letras.");
        e.preventDefault();
        return;
      }
      if (apellidos && !validarApellidos(apellidos.value)) {
        alert("Apellidos inválidos. Máximo 40 letras.");
        e.preventDefault();
        return;
      }
      if (telefono && !validarTelefono(telefono.value)) {
        alert("Teléfono inválido. Debe tener 9 dígitos.");
        e.preventDefault();
        return;
      }
      if (email && !validarEmail(email.value)) {
        alert("Correo electrónico inválido.");
        e.preventDefault();
        return;
      }
      // Si algún campo no existe (porque se usa en otra página), se omite validación
    });
  } else {
    console.info('formPresupuesto no existe en esta página — omito validación y cálculo.');
  }

  // ================================
  // 4. MAPA (Leaflet) — inicializar solo si existe #map y L
  // ================================
  const mapEl = document.getElementById('map');
  if (mapEl) {
    if (typeof L === 'undefined') {
      console.warn('Leaflet (L) no está cargado. Asegúrate de incluir leaflet.js antes de este script.');
    } else {
      try {
        // Coordenadas de la empresa
        const empresaCoords = [37.3826, -5.9963];
        const map = L.map('map').setView(empresaCoords, 13);

        // Cargar mapa con OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Marcador en la ubicación de la empresa
        L.marker(empresaCoords).addTo(map)
          .bindPopup('<b>ReWood</b><br>Calle Verde 128, Sevilla');

        // Intentar localizar al usuario en el mapa
        map.locate({ setView: true, maxZoom: 16 });

        // Si Leaflet Routing está disponible, traza la ruta
        if (L.Routing) {
          map.on('locationfound', function (e) {
            L.Routing.control({
              waypoints: [
                L.latLng(e.latlng.lat, e.latlng.lng), // ubicación usuario
                L.latLng(empresaCoords[0], empresaCoords[1]) // empresa
              ],
              routeWhileDragging: true
            }).addTo(map);
          });
        } else {
          console.warn('Leaflet Routing Machine no está disponible: solo se mostrará el marcador y la geolocalización.');
        }

        // Si falla la geolocalización
        map.on('locationerror', function () {
          console.info("No se pudo obtener tu ubicación (locationerror).");
        });
      } catch (err) {
        console.error('Error al inicializar el mapa:', err);
      }
    }
  } else {
    console.info('#map no encontrado — omito inicialización del mapa.');
  }
});
