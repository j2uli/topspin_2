document.addEventListener("DOMContentLoaded", () => {
  // MODAL AGREGAR PRODUCTO
  const modalProducto = document.getElementById("modalProducto");
  const btnAbrirProducto = document.getElementById("btnAgregarProducto");
  const btnCerrarProducto = document.getElementById("cerrarModal");

  if (btnAbrirProducto && modalProducto) {
    btnAbrirProducto.addEventListener("click", () => {
      modalProducto.style.display = "flex";
    });

    btnCerrarProducto.addEventListener("click", () => {
      modalProducto.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modalProducto) {
        modalProducto.style.display = "none";
      }
    });
  }

  // MODAL EDITAR PRODUCTO
  const modalEditar = document.getElementById("modalEditarProducto");
  const btnCerrarEditar = document.getElementById("cerrarModalEditar");

  document.querySelectorAll(".btn-editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const nombre = btn.getAttribute("data-nombre");
      const precio = btn.getAttribute("data-precio");
      const descripcion = btn.getAttribute("data-descripcion");
      const stock = btn.getAttribute("data-stock");
      const categoria = btn.getAttribute("data-categoria");

      document.getElementById("formEditarProducto").action = `/productos/editar/${id}`;
      document.getElementById("edit-id").value = id;
      document.getElementById("edit-nombre").value = nombre || "";
      document.getElementById("edit-precio").value = precio || "";
      document.getElementById("edit-descripcion").value = descripcion || "";
      document.getElementById("edit-stock").value = stock || 0;
      document.getElementById("edit-categoria").value = categoria || "";

      modalEditar.style.display = "flex";
    });
  });

  if (btnCerrarEditar && modalEditar) {
    btnCerrarEditar.addEventListener("click", () => {
      modalEditar.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modalEditar) {
        modalEditar.style.display = "none";
      }
    });
  }

  // MODAL CONFIRMAR ELIMINACIÓN
  const modalEliminar = document.getElementById("modalConfirmarEliminar");
  const formEliminar = document.getElementById("formEliminarConfirmado");
  const btnCancelar = document.getElementById("cancelarEliminar");

  if (modalEliminar && formEliminar) {
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        const productoId = this.dataset.id;
        formEliminar.action = `/productos/eliminar/${productoId}`;
        modalEliminar.style.display = "flex";
      });
    });

    btnCancelar.addEventListener("click", () => {
      modalEliminar.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modalEliminar) {
        modalEliminar.style.display = "none";
      }
    });
  }

  // MODAL VER DETALLE DE PRODUCTO
  const modalVer = document.getElementById("modalVerProducto");
  const cerrarModalVer = document.getElementById("cerrarModalVer");

  if (modalVer) {
    document.querySelectorAll(".btn-ver").forEach(btn => {
      btn.addEventListener("click", function () {
        document.getElementById("ver-id").textContent = this.dataset.id;
        document.getElementById("ver-nombre").textContent = this.dataset.nombre;
        document.getElementById("ver-precio").textContent = this.dataset.precio;
        document.getElementById("ver-stock").textContent = this.dataset.stock;
        document.getElementById("ver-categoria").textContent = this.dataset.categoria;
        document.getElementById("ver-descripcion").textContent = this.dataset.descripcion;
        document.getElementById("ver-imagen").src = this.dataset.imagen;
        modalVer.style.display = "flex";
      });
    });

    cerrarModalVer.addEventListener("click", () => {
      modalVer.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modalVer) {
        modalVer.style.display = "none";
      }
    });
  }

  // OCULTAR MENSAJE DE ÉXITO AUTOMÁTICAMENTE
  const alertaExito = document.querySelector(".alerta-exito");
  if (alertaExito) {
    setTimeout(() => {
      alertaExito.style.transition = "opacity 0.8s ease";
      alertaExito.style.opacity = "0";
      setTimeout(() => {
        alertaExito.remove();
      }, 800);
    }, 3000);
  }

  // FILTRO DE BÚSQUEDA EN TIEMPO REAL
  const buscador = document.getElementById("buscadorProducto");
  if (buscador) {
    buscador.addEventListener("keyup", function () {
      const texto = this.value.toLowerCase();
      const filas = document.querySelectorAll("tbody tr");

      filas.forEach(fila => {
        const nombre = fila.children[1].textContent.toLowerCase();
        const descripcion = fila.children[5].textContent.toLowerCase();

        if (nombre.includes(texto) || descripcion.includes(texto)) {
          fila.style.display = "";
        } else {
          fila.style.display = "none";
        }
      });
    });
  }
});
