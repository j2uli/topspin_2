const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para mostrar el formulario de login
router.get('/login', userController.renderLogin);

// Ruta para procesar el login
router.post('/login', userController.loginUser);

// Ruta para mostrar el formulario de registro
router.get('/register', userController.renderRegister);

// Ruta para procesar el registro
router.post('/register', userController.registerUser);

// Ruta para mostrar el catálogo
router.get('/catalogo', (req, res) => {
  const productos = [
    { nombre: 'Raqueta A', precio: 320, imagen: 'https://via.placeholder.com/150' },
    { nombre: 'Raqueta B', precio: 280, imagen: 'https://via.placeholder.com/150' }
  ];

  res.render('catalogo', {
    productos,
    usuario: req.session.usuario || null // Esto es lo que hace que muestre el usuario logueado si existe
  });
});

module.exports = router;
