document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalDetalleProducto");
  const cerrar = document.getElementById("cerrarModalDetalle");

  document.querySelectorAll(".btn-detalle").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("modal-nombre").textContent = btn.dataset.nombre;
      document.getElementById("modal-precio").textContent = btn.dataset.precio;
      document.getElementById("modal-stock").textContent = btn.dataset.stock;
      document.getElementById("modal-descripcion").textContent = btn.dataset.descripcion;
      document.getElementById("modal-categoria").textContent = btn.dataset.categoria;
      document.getElementById("modal-imagen").src = btn.dataset.imagen;
      modal.style.display = "flex"; // Muestra el modal
    });
  });

  cerrar.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
