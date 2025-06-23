const express = require('express');
const router = express.Router();
const Usuario = require('../models/User');

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login', { notificacion: null });
});

// Procesar login
router.post('/login', async (req, res) => {
  const { correo, contraseña, rol } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo, rol } });

    if (!usuario || usuario.contraseña !== contraseña) {
      return res.render('login', {
        notificacion: {
          tipo: 'error',
          mensaje: 'Correo, contraseña o rol incorrecto.'
        }
      });
    }

    // Guardar en sesión
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };

    if (usuario.rol === 'cliente') {
      return res.redirect('/catalogo');
    } else {
      return res.redirect('/PanelAdministradorCaja');
    }

  } catch (error) {
    console.error('Error en login:', error);
    return res.render('login', {
      notificacion: {
        tipo: 'error',
        mensaje: 'Error del servidor. Intenta más tarde.'
      }
    });
  }
});

// Mostrar formulario de registro
router.get('/register', (req, res) => {
  const hoy = new Date().toISOString().split('T')[0];
  res.render('register', { maxDate: hoy, notificacion: null });
});

// Procesar registro
router.post('/register', async (req, res) => {
  try {
    const {
      nombre, correo, contraseña, rol,
      telefono, direccion, fecha_nacimiento
    } = req.body;

    await Usuario.create({
      nombre,
      correo,
      contraseña,
      rol,
      telefono,
      direccion,
      fecha_nacimiento
    });

    return res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.render('register', {
      maxDate: new Date().toISOString().split('T')[0],
      notificacion: { tipo: 'error', mensaje: 'Error al registrar usuario. Verifica los campos.' }
    });
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.redirect('/catalogo');
    }
    res.redirect('/Login');
  });
});

module.exports = router;
