const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Conexión a la base de datos
const userRoutes = require('./routes/userRoutes');

// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');  // Asegúrate de que apunte a la carpeta correcta

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));  // Archivos estáticos (CSS, imágenes, etc.)

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
app.use(userRoutes);

