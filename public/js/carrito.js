document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".product-card").forEach(card => {
    const input = card.querySelector("input[name='cantidad']");
    const btnMenos = card.querySelector(".btn-decrementar");
    const btnMas = card.querySelector(".btn-incrementar");
    const btnAddCart = card.querySelector(".btn-add-cart");

    // Botón menos
    btnMenos.addEventListener("click", () => {
      const min = parseInt(input.min) || 1;
      const current = parseInt(input.value) || 1;
      if (current > min) {
        input.value = current - 1;
      }
    });

    // Botón más
    btnMas.addEventListener("click", () => {
      const max = parseInt(input.max) || 99;
      const current = parseInt(input.value) || 1;
      if (current < max) {
        input.value = current + 1;
      }
    });

    // Envío al backend con fetch
    btnAddCart.addEventListener("click", () => {
      const productoId = btnAddCart.dataset.id;
      const cantidad = parseInt(input.value);

      if (!productoId || isNaN(cantidad)) {
        return alert("Error: ID o cantidad inválidos");
      }

      fetch('/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productoId, cantidad })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Producto añadido al carrito");
        } else {
          alert(data.error || "Error al añadir al carrito");
        }
      })
      .catch(err => {
        console.error("Error en la solicitud:", err);
      });
    });
  });
});
