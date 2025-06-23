const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  const filtro = req.query.filtro || '';

  try {
    const productos = await Producto.findAll({
      where: {
        nombre: {
          [Op.like]: `%${filtro}%`
        },
        stock: {
          [Op.gte]: 0
        }
      }
    });

    const totalProductos = req.session.carrito?.reduce((total, item) => total + item.cantidad, 0) || 0;

    res.render('catalogo', {
      productos,
      filtro,
      totalProductos, // ✅ Se envía correctamente
      usuario: req.session?.usuario || null
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
