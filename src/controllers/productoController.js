const Producto = require('../models/Producto');
const fs = require('fs');
const path = require('path');

// Mostrar Inventario
exports.mostrarInventario = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.render('panel_inventario', { productos, query: req.query });
  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
};

// Crear Producto
exports.crearProducto = async (req, res) => {
  const { nombre, precio, descripcion, stock, categoria } = req.body;
  const imagen = req.file ? '/img/productos/' + req.file.filename : null;

  try {
    await Producto.create({
      nombre: nombre.trim(),
      precio: parseFloat(precio) || 0,
      descripcion: descripcion.trim(),
      stock: Math.max(parseInt(stock) || 0, 0),
      categoria: categoria.trim(),
      imagen
    });
    res.redirect('/productos/inventario?agregado=1');
  } catch (error) {
    res.status(500).send('Error al guardar producto: ' + error.message);
  }
};

// Eliminar Producto
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (producto && producto.imagen) {
      const rutaImagen = path.join(__dirname, '..', 'public', producto.imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }

    await Producto.destroy({ where: { id: req.params.id } });
    res.redirect('/productos/inventario?eliminado=1');
  } catch (error) {
    res.status(500).send('Error al eliminar producto');
  }
};

// Editar Producto
exports.editarProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, stock, categoria } = req.body;
  let nuevaImagen = null;

  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    // Verifica si se subió una nueva imagen
    if (req.file) {
      nuevaImagen = '/img/productos/' + req.file.filename;
      // Elimina imagen anterior si existe
      const rutaAnterior = path.join(__dirname, '..', 'public', producto.imagen || '');
      if (producto.imagen && fs.existsSync(rutaAnterior)) {
        fs.unlinkSync(rutaAnterior);
      }
    }

    await producto.update({
      nombre: nombre.trim(),
      precio: parseFloat(precio) || 0,
      descripcion: descripcion.trim(),
      stock: Math.max(parseInt(stock) || 0, 0),
      categoria: categoria.trim(),
      imagen: nuevaImagen || producto.imagen
    });

    res.redirect('/productos/inventario?editado=1');
  } catch (error) {
    res.status(500).send('Error al editar producto: ' + error.message);
  }
};
// Mostrar catálogo al cliente
exports.mostrarCatalogo = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { stock: { [Op.gt]: 0 } }, // Mostrar solo con stock disponible
      order: [['nombre', 'ASC']]
    });

    const usuario = req.session.usuario || null;

    res.render("catalogo", { productos, usuario });
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    res.status(500).send("Error al cargar el catálogo.");
  }
};

