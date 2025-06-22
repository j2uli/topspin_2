const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto'); // Importación directa del modelo
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        stock: { [Op.gte]: 0 } // Solo productos con stock >= 0
      }
    });

    res.render('catalogo', {
      productos,
      usuario: req.session ? req.session.usuario : null
    });
  } catch (error) {
    console.error('Error al cargar el catálogo:', error);
    res.status(500).send('Error al mostrar el catálogo');
  }
});

module.exports = router;
