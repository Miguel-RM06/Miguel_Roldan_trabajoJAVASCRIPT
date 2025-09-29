// mapa.js
// Inicializa Leaflet y (si está) la ruta con Leaflet Routing Machine.
// REQUISITO: Leaflet (L) y los CSS/JS correspondientes deben estar incluidos previamente.
// El elemento con id="map" debe existir en el DOM.

document.addEventListener('DOMContentLoaded', () => {
  // Coordenadas y creación del mapa
  const empresaCoords = [37.3826, -5.9963];
  const map = L.map('map').setView(empresaCoords, 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Marcador y popup
  L.marker(empresaCoords).addTo(map)
    .bindPopup('<b>ReWood</b><br>Calle Verde 128, Sevilla');

  // Intentar localizar y trazar ruta (suponiendo que L.Routing está disponible si lo has cargado)
  map.locate({ setView: true, maxZoom: 16 });

  map.on('locationfound', function (e) {
    // Si has cargado Leaflet Routing Machine, esto trazará la ruta desde la ubicación del usuario
    // Si no la has cargado, esta línea lanzará un error; carga L.Routing antes de este script.
    L.Routing.control({
      waypoints: [
        L.latLng(e.latlng.lat, e.latlng.lng),
        L.latLng(empresaCoords[0], empresaCoords[1])
      ],
      routeWhileDragging: true
    }).addTo(map);
  });

  map.on('locationerror', function () {
    console.info('No se pudo obtener la ubicación del usuario.');
  });
});
