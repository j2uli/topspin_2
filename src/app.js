const express = require('express');
const session = require('express-session');
const app = express();
const sequelize = require('./config/database');

// Importamos rutas
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require('./routes/productoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');

// Configuración de sesión
app.use(session({
  secret: 'topspin_secreto_seguro',
  resave: false,
  saveUninitialized: true
}));

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/catalogo', catalogoRoutes);
app.use('/productos', productoRoutes);
app.use(userRoutes); // incluye login, registro, etc.

// Vistas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/FormularioReservas', (req, res) => {
  res.render('FormularioReservas');
});

app.get('/PanelAdministradorCaja', (req, res) => {
  res.render('PanelAdministradorCaja');
});

// Conexión
sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada');
    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  })
  .catch((err) => console.error('Error al conectar a la base de datos', err));
