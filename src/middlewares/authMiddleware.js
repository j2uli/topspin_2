// Middleware obligatorio: redirige si no hay sesión activa
function checkLogin(req, res, next) {
  const usuario = req.session?.usuario;

  if (usuario) {
    return next();
  }

  // Si es una petición JSON o fetch
  const isJson = req.xhr || req.headers.accept?.includes('application/json') || req.headers['content-type'] === 'application/json';

  if (isJson) {
    return res.status(401).json({ 
      error: 'Debes iniciar sesión para realizar esta acción',
      requiresLogin: true,
      redirectTo: '/login'
    });
  }

  // Si es una petición normal, redireccionar al login
  res.redirect('/login');
}

// Middleware opcional: solo agrega información, no bloquea rutas
function checkLoginOptional(req, res, next) {
  req.isLoggedIn = !!req.session?.usuario;
  req.user = req.session?.usuario || null;
  next();
}

// Middleware para pasar variables a las vistas (EJS, etc.)
function addUserToViews(req, res, next) {
  res.locals.usuario = req.session?.usuario || null;
  res.locals.isLoggedIn = !!req.session?.usuario;
  next();
}

module.exports = { 
  checkLogin, 
  checkLoginOptional, 
  addUserToViews 
};
