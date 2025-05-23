const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // Added path import
const helmet = require('helmet'); // Added helmet import
const morgan = require('morgan'); // Added morgan import

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize qrSessions map on app.locals
app.locals.qrSessions = new Map();

// Middlewares
app.use(helmet()); // Use helmet for security headers

// Configure CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you need to allow cookies or authorization headers
};
app.use(cors(corsOptions));

app.use(morgan('combined')); // Use morgan for logging

app.use(express.json());

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Conexión a MongoDB
const MONGODB_URI_FALLBACK = 'mongodb://127.0.0.1:27017/asistencia-back';
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI_FALLBACK)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
const authMiddleware = require('./middleware/auth.middleware.js'); // Added for JWT
const asistenciaRoutes = require('./routes/asistencia.routes');
app.use('/api/asistencias', authMiddleware, asistenciaRoutes); // Protected asistencia routes

// IMPORTAR y USAR rutas de auth (signup, login)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// IMPORTAR y USAR rutas de QR
const qrRoutes = require('./routes/qr.routes.js');
app.use('/api/qr', authMiddleware, qrRoutes); // Protected by authMiddleware

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Global Error Handling Middleware
// This should be the last middleware loaded
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message || err); // Log the error stack for debugging

  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types if needed
  if (err.name === 'ValidationError') { // Example: Mongoose validation error
    statusCode = 400;
    message = Object.values(err.errors).map(item => item.message).join(', ');
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') { // Example: Mongoose invalid ObjectId
    statusCode = 400;
    message = `Invalid ID format for resource: ${err.value}`;
  } else if (err.code === 11000) { // Example: MongoDB duplicate key error
     statusCode = 409; // Conflict
     // Extract useful info from err.message or err.keyValue if needed
     message = 'Duplicate key error. A record with this value already exists.';
  }
  // Add more specific error checks as your application grows

  // Ensure status code is a valid HTTP error code
  if (statusCode < 400) {
    statusCode = 500;
  }
  
  // Send JSON response
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: message,
    // Optionally, include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
