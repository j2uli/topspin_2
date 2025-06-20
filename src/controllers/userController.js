const bcrypt = require('bcrypt');
const User = require('../models/User');

// Mostrar formulario de registro
exports.mostrarRegister = (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.render('register', { maxDate: today, notificacion: null });
};

// Procesar registro de usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, telefono, direccion, rol, fecha_nacimiento } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      telefono,
      direccion,
      rol,
      fecha_nacimiento
    });

    res.render('register', {
      maxDate: new Date().toISOString().split("T")[0],
      notificacion: {
        tipo: 'success',
        mensaje: 'Cuenta creada exitosamente. Ahora puedes iniciar sesión.'
      }
    });
  } catch (error) {
    res.render('register', {
      maxDate: new Date().toISOString().split("T")[0],
      notificacion: {
        tipo: 'error',
        mensaje: 'Hubo un error al registrarse.'
      }
    });
  }
};

// Mostrar formulario de login
exports.mostrarLogin = (req, res) => {
  res.render('login', { notificacion: null });
};

// Procesar login de usuario
exports.loginUsuario = async (req, res) => {
  const { correo, contraseña, rol } = req.body;
  try {
    const user = await User.findOne({ where: { correo, rol } });

    if (!user) {
      return res.render('login', {
        notificacion: {
          tipo: 'error',
          mensaje: 'Correo o rol incorrecto.'
        }
      });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    if (!match) {
      return res.render('login', {
        notificacion: {
          tipo: 'error',
          mensaje: 'Contraseña incorrecta.'
        }
      });
    }

    res.render('login', {
      notificacion: {
        tipo: 'success',
        mensaje: 'Inicio de sesión exitoso.'
      }
    });

    // Para redirigir según el rol en vez de mostrar el mensaje:
    // return res.redirect('/admin/usuarios');
  } catch (error) {
    res.render('login', {
      notificacion: {
        tipo: 'error',
        mensaje: 'Error al iniciar sesión: ' + error.message
      }
    });
  }
};
