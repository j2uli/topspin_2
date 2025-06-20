const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// LOGIN
router.get('/login', userController.mostrarLogin);
router.post('/login', userController.loginUsuario);

// REGISTER
router.get('/register', userController.mostrarRegister);
router.post('/register', userController.registrarUsuario);

router.get('/catalogo', (req, res) => {
  const productos = [
    { nombre: 'Raqueta TopSpin 3000', precio: 300, imagen: '/img/raqueta1.jpg' },
    { nombre: 'Guante Gearbox Elite', precio: 85, imagen: '/img/guante1.jpg' }
  ];
  const usuario = { nombre: 'Flavio', rol: 'admin' }; // o null si no quieres mostrarlo
  res.render('catalogo', { productos, usuario });
});

module.exports = router;
