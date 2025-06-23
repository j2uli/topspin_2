exports.addToCart = (req, res) => {
  const { productoId, cantidad } = req.body;
  const { productos } = require('../data/fakeDB'); // ajusta al origen real

  const producto = productos.find(p => p.id == productoId);
  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const carrito = req.session.carrito || [];

  const index = carrito.findIndex(p => p.id == productoId);

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad,
      imagen: producto.imagen
    });
  }

  req.session.carrito = carrito;

  res.json({
    success: true,
    message: 'Producto agregado al carrito',
    total: carrito.reduce((acc, p) => acc + p.cantidad, 0)
  });
};
