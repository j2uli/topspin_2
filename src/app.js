const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./config/database');

const app = express();

// Configuración de sesión (debe estar antes de las rutas)
app.use(session({
  secret: 'topspin_secreto_seguro',
  resave: false,
  saveUninitialized: true
}));

// Configuración de EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Importación de rutas
const userRoutes = require('./routes/userRoutes');
const productoRoutes = require('./routes/productoRoutes');
const catalogoRoutes = require('./routes/catalogoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');

// Uso de rutas
app.use('/catalogo', catalogoRoutes);
app.use('/productos', productoRoutes);
app.use('/carrito', carritoRoutes);
app.use(userRoutes);

// Vistas principales
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/FormularioReservas', (req, res) => {
  res.render('FormularioReservas');
});

app.get('/PanelAdministradorCaja', (req, res) => {
  res.render('PanelAdministradorCaja');
});

app.get('/Login', (req, res) => {
  res.render('login');
});

app.get('/Inicio', (req, res) => {
  res.render('catalogo');
});

app.get('/sucursales', (req, res) => {
  res.render('PaginasCatalogo/NuestrasSucursales');
});

// Páginas "¿Quiénes Somos?" y otras informativas
app.get('/QuienesSomos', (req, res) => {
  res.render('PaginasQuienesSomos/QuienesSomos');
});

app.get('/ComoComprar', (req, res) => {
  res.render('PaginasQuienesSomos/ComoComprar');
});

app.get('/PlazoDeEntrega', (req, res) => {
  res.render('PaginasQuienesSomos/PlazoDeEntrega');
});

app.get('/CambiosYDevoluciones', (req, res) => {
  res.render('PaginasQuienesSomos/CambiosYDevoluciones');
});

app.get('/TerminosYCondiciones', (req, res) => {
  res.render('PaginasQuienesSomos/TerminosYCondiciones');
});

app.get('/PoliticasDePrivacidad', (req, res) => {
  res.render('PaginasQuienesSomos/PoliticasYPrivacidad');
});

// Conexión a la base de datos y arranque del servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos conectada');
    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  })
  .catch((err) => console.error('Error al conectar a la base de datos', err));
