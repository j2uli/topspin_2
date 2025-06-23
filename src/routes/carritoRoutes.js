const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

// Middleware para verificar sesión iniciada
function checkLogin(req, res, next) {
  if (!req.session.usuario) {
    return res.redirect('/login'); // Ajusta esto a tu ruta de login
  }
  next();
}

// Ver el carrito
router.get('/', checkLogin, (req, res) => {
  const carrito = req.session.carrito || [];
  const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

  res.render('carrito', {
    carrito,
    totalProductos,
    usuario: req.session.usuario
  });
});

// Agregar al carrito
router.post('/agregar', async (req, res) => {
  const { productoId, cantidad } = req.body;

  const id = parseInt(productoId, 10);
  const qty = parseInt(cantidad, 10);

  // Validación para evitar el error de NaN en la consulta
  if (isNaN(id) || isNaN(qty)) {
    return res.status(400).json({ error: 'Datos inválidos: productoId o cantidad no son números' });
  }

  try {
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (!req.session.carrito) {
      req.session.carrito = [];
    }

    const carrito = req.session.carrito;

    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
      productoExistente.cantidad += qty;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: qty
      });
    }

    req.session.carrito = carrito;

    res.json({ success: true, total: carrito.reduce((acc, p) => acc + p.cantidad, 0) });

  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar cantidad (más o menos)
router.post('/actualizar', checkLogin, (req, res) => {
  const { index, accion } = req.body;
  const carrito = req.session.carrito;

  if (!carrito || index === undefined || !carrito[index]) {
    return res.status(400).send('Índice inválido');
  }

  if (accion === 'mas') {
    carrito[index].cantidad += 1;
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

router.post('/agregar', async (req, res) => {
  const { productoId, cantidad } = req.body;
  const id = parseInt(productoId, 10);
  const qty = parseInt(cantidad, 10);

  try {
    const producto = await Producto.findByPk(id);

    if (!producto || producto.stock < qty) {
      return res.status(400).send('Producto no disponible o cantidad inválida');
    }

    if (!req.session.carrito) req.session.carrito = [];

    const index = req.session.carrito.findIndex(item => item.id === id);

    if (index !== -1) {
      // Si ya existe, aumentar la cantidad solo si hay stock suficiente
      const newQty = req.session.carrito[index].cantidad + qty;
      if (newQty <= producto.stock) {
        req.session.carrito[index].cantidad = newQty;
      } else {
        return res.status(400).send('Cantidad excede el stock disponible');
      }
    } else {
      // Si no existe, agregar nuevo
      req.session.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: qty
      });
    }

    res.redirect('/catalogo');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).send('Error al agregar producto');
  }
});


module.exports = router;
