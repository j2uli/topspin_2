const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productoController = require('../controllers/productoController');

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: 'public/img/productos',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/inventario', productoController.mostrarInventario);

// Crear nuevo producto
router.post('/crear', upload.single('imagen'), productoController.crearProducto);

// Eliminar producto
router.post('/eliminar/:id', productoController.eliminarProducto);

// Editar producto existente
router.post('/editar/:id', upload.single('imagen'), productoController.editarProducto);

module.exports = router;
