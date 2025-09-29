// noticias.js
// Carga noticias desde 'Datos/noticias.json' y las añade al contenedor #contenedor-noticias
// REQUISITO: El elemento con id="contenedor-noticias" debe existir en el DOM.

document.addEventListener('DOMContentLoaded', () => {
  fetch('Datos/noticias.json') // Ruta relativa correcta desde /views/*.html
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(noticias => {
      // Construir fragmento para minimizar reflows
      const fragment = document.createDocumentFragment();
      noticias.forEach(noticia => {
        const a = document.createElement('a');
        a.href = 'views/presupuesto.html'; // destino relativo correcto
        a.className = 'noticia';
        a.innerHTML = `
          <h3 class="titulo">${noticia.titulo}</h3>
          <small class="fecha">${noticia.fecha}</small>
          <p class="contenido">${noticia.contenido}</p>
        `;
        fragment.appendChild(a);
      });
      document.getElementById('contenedor-noticias').appendChild(fragment);
    })
    .catch(err => {
      console.error('Error al cargar las noticias:', err);
      // Opcional: mostrar mensaje en pantalla si lo deseas
    });
});
