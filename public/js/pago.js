document.addEventListener('DOMContentLoaded', function () {
  const btnPagar = document.getElementById('btn-pagar');
  const modal = document.getElementById('modalPago');
  const btnQR = document.getElementById('btn-qr');
  const btnTienda = document.getElementById('btn-tienda');
  const qrSection = document.getElementById('qr-section');
  const mensajeFinal = document.getElementById('mensaje-final');
  const btnEnviar = document.getElementById('btn-enviar-comprobante');
  const metodosSection = document.getElementById('metodos');

  // Función para abrir el modal
  btnPagar?.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    // Resetear el modal al estado inicial
    resetModal();
  });

  // Función para mostrar la sección QR
  btnQR?.addEventListener('click', (e) => {
    e.preventDefault();
    metodosSection.classList.add('hidden');
    qrSection.classList.remove('hidden');
  });

  // Función para pago en tienda
  btnTienda?.addEventListener('click', (e) => {
    e.preventDefault();
    metodosSection.classList.add('hidden');
    qrSection.classList.add('hidden');
    mensajeFinal.classList.remove('hidden');
  });

  // Función para enviar comprobante
  btnEnviar?.addEventListener('click', (e) => {
    e.preventDefault();
    const comprobanteInput = document.getElementById('comprobanteInput');
    
    // Verificar si se subió un archivo
    if (comprobanteInput.files.length === 0) {
      alert('Por favor, sube el comprobante de pago antes de continuar.');
      return;
    }
    
    qrSection.classList.add('hidden');
    mensajeFinal.classList.remove('hidden');
  });

  // Función para cerrar el modal (se puede llamar desde el HTML)
  window.cerrarModal = function() {
    modal.classList.add('hidden');
    resetModal();
    // Opcional: recargar la página o limpiar el carrito
    // window.location.reload();
  };

  // Función para resetear el modal al estado inicial
  function resetModal() {
    metodosSection.classList.remove('hidden');
    qrSection.classList.add('hidden');
    mensajeFinal.classList.add('hidden');
    
    // Limpiar el input de archivo
    const comprobanteInput = document.getElementById('comprobanteInput');
    if (comprobanteInput) {
      comprobanteInput.value = '';
    }
  }

  // Cerrar modal al hacer clic fuera de él
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Cerrar modal con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      cerrarModal();
    }
  });
});