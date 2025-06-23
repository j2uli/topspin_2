document.addEventListener("DOMContentLoaded", function () {
  
  // Función para actualizar el contador del carrito en el header
  function actualizarContadorCarrito(total) {
    const cartElement = document.querySelector('.cart');
    if (cartElement) {
      cartElement.textContent = `🛒 Total: ${total} productos`;
    }
  }

  // Función para mostrar notificaciones
  function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 15px 20px;
      border-radius: 5px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notificacion);

    // Remover después de 3 segundos
    setTimeout(() => {
      notificacion.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (notificacion.parentNode) {
          notificacion.parentNode.removeChild(notificacion);
        }
      }, 300);
    }, 3000);
  }

  // Agregar estilos CSS para las animaciones
  const styles = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Procesar cada tarjeta de producto
  document.querySelectorAll(".product-card").forEach(card => {
    const input = card.querySelector("input[name='cantidad']");
    const btnMenos = card.querySelector(".btn-decrementar");
    const btnMas = card.querySelector(".btn-incrementar");
    const form = card.querySelector("form");
    const productoId = card.dataset.id;

    if (!input || !btnMenos || !btnMas || !form) {
      console.warn('Elementos faltantes en product-card:', card);
      return;
    }

    // Botón decrementar cantidad
    btnMenos.addEventListener("click", (e) => {
      e.preventDefault();
      const min = parseInt(input.min) || 1;
      const current = parseInt(input.value) || 1;
      if (current > min) {
        input.value = current - 1;
      }
    });

    // Botón incrementar cantidad
    btnMas.addEventListener("click", (e) => {
      e.preventDefault();
      const max = parseInt(input.max) || 99;
      const current = parseInt(input.value) || 1;
      if (current < max) {
        input.value = current + 1;
      } else {
        mostrarNotificacion('Stock máximo alcanzado', 'error');
      }
    });

    // Validar input manual
    input.addEventListener("input", function() {
      const min = parseInt(this.min) || 1;
      const max = parseInt(this.max) || 99;
      let value = parseInt(this.value) || min;

      if (value < min) {
        this.value = min;
      } else if (value > max) {
        this.value = max;
        mostrarNotificacion('Stock máximo alcanzado', 'error');
      }
    });

    // Crear y agregar botón "Agregar al carrito"
    let btnAgregar = form.querySelector('.btn-agregar-carrito');
    if (!btnAgregar) {
      btnAgregar = document.createElement('button');
      btnAgregar.type = 'button';
      btnAgregar.className = 'btn-agregar-carrito';
      btnAgregar.textContent = 'Agregar al carrito';
      btnAgregar.style.cssText = `
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
        width: 100%;
        font-size: 14px;
        transition: background-color 0.3s;
      `;
      
      btnAgregar.addEventListener('mouseover', () => {
        btnAgregar.style.backgroundColor = '#0056b3';
      });
      
      btnAgregar.addEventListener('mouseout', () => {
        btnAgregar.style.backgroundColor = '#007bff';
      });

      form.appendChild(btnAgregar);
    }

    // Agregar input hidden para el ID del producto
    let hiddenInput = form.querySelector('input[name="productoId"]');
    if (!hiddenInput) {
      hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'productoId';
      hiddenInput.value = productoId;
      form.appendChild(hiddenInput);
    }

    // Evento para agregar al carrito
    btnAgregar.addEventListener("click", async (e) => {
      e.preventDefault();
      
      const cantidad = parseInt(input.value) || 1;
      const stockDisponible = parseInt(input.max) || 0;

      // Validaciones
      if (cantidad <= 0) {
        mostrarNotificacion('Cantidad debe ser mayor a 0', 'error');
        return;
      }

      if (cantidad > stockDisponible) {
        mostrarNotificacion('Cantidad excede el stock disponible', 'error');
        return;
      }

      if (stockDisponible === 0) {
        mostrarNotificacion('Producto agotado', 'error');
        return;
      }

      // Deshabilitar botón temporalmente
      btnAgregar.disabled = true;
      btnAgregar.textContent = 'Agregando...';

      try {
        const response = await fetch('/carrito/agregar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productoId: productoId,
            cantidad: cantidad
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          mostrarNotificacion(data.message || 'Producto agregado al carrito');
          actualizarContadorCarrito(data.total);
          
          // Resetear cantidad a 1
          input.value = 1;
        } else {
          mostrarNotificacion(data.error || 'Error al agregar producto', 'error');
        }

      } catch (error) {
        console.error('Error en la solicitud:', error);
        mostrarNotificacion('Error de conexión. Intenta nuevamente.', 'error');
      } finally {
        // Rehabilitar botón
        btnAgregar.disabled = false;
        btnAgregar.textContent = 'Agregar al carrito';
      }
    });
  });

  // Manejar productos agotados
  document.querySelectorAll('.product-card').forEach(card => {
    const stock = parseInt(card.querySelector('input[name="cantidad"]')?.max) || 0;
    
    if (stock === 0) {
      const btnAgregar = card.querySelector('.btn-agregar-carrito');
      const input = card.querySelector('input[name="cantidad"]');
      const btnMenos = card.querySelector('.btn-decrementar');
      const btnMas = card.querySelector('.btn-incrementar');

      if (btnAgregar) {
        btnAgregar.disabled = true;
        btnAgregar.textContent = 'Agotado';
        btnAgregar.style.backgroundColor = '#6c757d';
        btnAgregar.style.cursor = 'not-allowed';
      }

      if (input) input.disabled = true;
      if (btnMenos) btnMenos.disabled = true;
      if (btnMas) btnMas.disabled = true;
    }
  });
});