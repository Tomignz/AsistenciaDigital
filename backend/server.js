const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize qrSessions map on app.locals
app.locals.qrSessions = new Map();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asistencia-back';
mongoose
  .connect(mongoUri)
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
