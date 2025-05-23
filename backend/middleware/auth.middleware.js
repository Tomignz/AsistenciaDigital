const jwt = require('jsonwebtoken');

// REMEMBER TO USE THE SAME SECRET KEY AS IN auth.routes.js
const SECRET_KEY = 'YOUR_SECRET_KEY'; // It's crucial to use a strong, environment-specific secret in production

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado o en formato incorrecto.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user payload to request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    // For other errors, you might want to log them and return a generic error
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Error interno al verificar el token.' });
  }
};

module.exports = authMiddleware;
