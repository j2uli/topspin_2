const User = require('../models/User');
const bcrypt = require('bcrypt');

// Renderiza la vista del login
const renderLogin = (req, res) => {
  res.render('login');  // Asegúrate de tener el archivo login.ejs
};

// Procesa el login
const loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const user = await User.findOne({ where: { correo } });
    
    if (!user) {
      return res.status(400).send('Correo no encontrado');
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!match) {
      return res.status(400).send('Contraseña incorrecta');
    }

    req.session.usuario = user; // Guardar usuario en la sesión
    res.redirect('/catalogo'); // Redirigir al catálogo después del login exitoso
  } catch (error) {
    res.status(500).send('Error al procesar el login: ' + error.message);
  }
};

// Renderiza la vista de registro
const renderRegister = (req, res) => {
  res.render('register');  // Asegúrate de tener el archivo register.ejs
};

// Procesa el registro
const registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    await User.create({
      nombre,
      correo,
      contraseña: hashedPassword
    });

    res.redirect('/login'); // Redirigir a login después del registro exitoso
  } catch (error) {
    res.status(500).send('Error al registrar el usuario: ' + error.message);
  }
};

module.exports = {
  renderLogin,
  loginUser,
  renderRegister,
  registerUser
};
