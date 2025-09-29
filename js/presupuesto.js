// presupuesto.js
// Validación del formulario y cálculo dinámico del presupuesto.
// REQUISITO: Formulario con id="formPresupuesto" y elementos internos con los ids indicados.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formPresupuesto');

  // Campos (se asume que existen)
  const nombre = form.querySelector('#nombre');
  const apellidos = form.querySelector('#apellidos');
  const telefono = form.querySelector('#telefono');
  const email = form.querySelector('#email');
  const producto = form.querySelector('#producto');
  const plazo = form.querySelector('#plazo');
  const extrasNodeList = form.querySelectorAll('.extra'); // NodeList
  const extras = Array.from(extrasNodeList); // Array para métodos cómodos
  const totalEl = form.querySelector('#total');

  // Validaciones
  const validarNombre = valor => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor) && valor.length <= 15;
  const validarApellidos = valor => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor) && valor.length <= 40;
  const validarTelefono = valor => /^[0-9]{9}$/.test(valor);
  const validarEmail = valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  // Calcula y muestra el total
  function calcularPresupuesto() {
    let total = 0;
    const precioProducto = parseFloat(producto.value) || 0;
    total += precioProducto;

    extras.forEach(extra => {
      if (extra.checked) total += parseFloat(extra.value) || 0;
    });

    const meses = parseInt(plazo.value, 10) || 1;
    let descuento = 0;
    if (meses >= 12) descuento = 0.20;
    else if (meses >= 6) descuento = 0.10;

    total -= total * descuento;

    totalEl.textContent = total.toFixed(2);
  }

  // Listeners para recalcular
  producto.addEventListener('change', calcularPresupuesto);
  plazo.addEventListener('input', calcularPresupuesto);
  extras.forEach(extra => extra.addEventListener('change', calcularPresupuesto));

  // Cálculo inicial
  calcularPresupuesto();

  // Validación en submit
  form.addEventListener('submit', (e) => {
    if (!validarNombre(nombre.value)) {
      alert('Los datos introducidos son incorrectos. Recuerda que tan sólo puedes utilizar letras con un máximo de 15 carácteres.');
      e.preventDefault();
      return;
    }
    if (!validarApellidos(apellidos.value)) {
      alert('Los datos introducidos son incorrectos. Recuerda que tan sólo puedes utilizar letras con un máximo de 40 carácteres.');
      e.preventDefault();
      return;
    }
    if (!validarTelefono(telefono.value)) {
      alert('Los datos introducidos son incorrectos. Recuerda que tienes que utilizar 9 dígitos.');
      e.preventDefault();
      return;
    }
    if (!validarEmail(email.value)) {
      alert('Los datos introducidos son incorrectos. Correo electrónico inválido.');
      e.preventDefault();
      return;
    }
    // Si todo OK, dejar que se envíe el formulario
  });
});
