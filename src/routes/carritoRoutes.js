const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Middleware para verificar sesión iniciada
function checkLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }
  next();
}

router.get('/', checkLogin, (req, res) => {
  const carrito = req.session.carrito || [];
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalPrecio = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  res.render('carrito', {
    carrito,
    totalProductos,
    totalPrecio,
    usuario: req.session.usuario
  });
});

router.post('/eliminar', (req, res) => {
  const { productoId } = req.body;
  req.session.carrito = (req.session.carrito || []).filter(p => p.id != productoId);
  res.redirect('/carrito');
});


// Ver el carrito
router.get('/', checkLogin, (req, res) => {
  const carrito = req.session.carrito || [];
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalPrecio = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  res.render('carrito', {
    carrito,
    totalProductos,
    totalPrecio,
    usuario: req.session.usuario
  });
});

// Agregar al carrito - ÚNICA RUTA
router.post('/agregar', async (req, res) => {
  const { productoId, cantidad } = req.body;
  
  // Convertir a números y validar
  const id = parseInt(productoId, 10);
  const qty = parseInt(cantidad, 10) || 1;

  if (isNaN(id) || qty <= 0) {
    if (req.headers['content-type'] === 'application/json') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }
    return res.status(400).send('Datos inválidos');
  }

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      return res.status(404).send('Producto no encontrado');
    }

    // Verificar stock disponible
    if (producto.stock < qty) {
      if (req.headers['content-type'] === 'application/json') {
        return res.status(400).json({ error: 'Stock insuficiente' });
      }
      return res.status(400).send('Stock insuficiente');
    }

    // Inicializar carrito si no existe
    if (!req.session.carrito) {
      req.session.carrito = [];
    }

    const carrito = req.session.carrito;
    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
      // Verificar que no exceda el stock al sumar
      const nuevaCantidad = productoExistente.cantidad + qty;
      if (nuevaCantidad > producto.stock) {
        if (req.headers['content-type'] === 'application/json') {
          return res.status(400).json({ error: 'Cantidad excede stock disponible' });
        }
        return res.status(400).send('Cantidad excede stock disponible');
      }
      productoExistente.cantidad = nuevaCantidad;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: parseFloat(producto.precio),
        imagen: producto.imagen,
        cantidad: qty,
        stock: producto.stock
      });
    }

    req.session.carrito = carrito;
    const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);

    // Responder según el tipo de petición
    if (req.headers['content-type'] === 'application/json') {
      res.json({ 
        success: true, 
        total: totalProductos,
        message: 'Producto agregado al carrito'
      });
    } else {
      res.redirect('/catalogo');
    }

  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    
    if (req.headers['content-type'] === 'application/json') {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(500).send('Error al agregar producto');
    }
  }
});

// Actualizar cantidad en el carrito
router.post('/actualizar', checkLogin, (req, res) => {
  const { index, accion } = req.body;
  const carrito = req.session.carrito;

  if (!carrito || index === undefined || !carrito[index]) {
    return res.status(400).send('Índice inválido');
  }

  if (accion === 'mas') {
    // Verificar stock antes de incrementar
    if (carrito[index].cantidad < carrito[index].stock) {
      carrito[index].cantidad += 1;
    }
  } else if (accion === 'menos') {
    carrito[index].cantidad -= 1;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
  }

  req.session.carrito = carrito;
  res.redirect('/carrito');
});

// Eliminar producto del carrito
router.post('/eliminar/:index', checkLogin, (req, res) => {
  const index = parseInt(req.params.index, 10);
  
  if (!isNaN(index) && req.session.carrito && req.session.carrito[index]) {
    req.session.carrito.splice(index, 1);
  }
  
  res.redirect('/carrito');
});

// Vaciar carrito completo
router.post('/vaciar', checkLogin, (req, res) => {
  req.session.carrito = [];
  res.redirect('/carrito');
});

module.exports = router;