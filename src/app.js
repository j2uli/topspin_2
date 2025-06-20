const express = require('express');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// RUTAS (debe ir antes del listen)
app.use(userRoutes);

// Conexión a la base de datos y arranque del servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada');
    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  })
  .catch((err) => console.error('Error al conectar a la base de datos', err));

// Usar las rutas de usuario (login, register, catalogo)
app.get('/', (req, res) => {
  res.render('index');  // Renderiza la vista "index.ejs" cuando accedes a "/"
});

//ruta para la pagina de reservas
app.get('/FormularioReservas', (req, res) => {
  res.render('FormularioReservas');  // Esto renderiza la vista "FormularioReservas.ejs"
});

//Ruta de la interfaz del administrador de la caja
app.get('/PanelAdministradorCaja', (req, res) => {
  res.render('PanelAdministradorCaja');  // Renderiza la vista "PanelAdministradorCaja.ejs"
});


