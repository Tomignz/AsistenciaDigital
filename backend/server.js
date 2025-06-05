const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize qrSessions map on app.locals
app.locals.qrSessions = new Map();

// Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

// Conexión a MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asistencia-back';
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
const authMiddleware = require('./middleware/auth.middleware.js');
const roleMiddleware = require('./middleware/role.middleware');
const asistenciaRoutes = require('./routes/asistencia.routes');
app.use('/api/asistencias', authMiddleware, asistenciaRoutes);

const subjectRoutes = require('./routes/subject.routes');
app.use('/api/subjects', authMiddleware, roleMiddleware('admin'), subjectRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', authMiddleware, roleMiddleware('admin'), userRoutes);

// IMPORTAR y USAR rutas de auth (signup, login)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// IMPORTAR y USAR rutas de QR
const qrRoutes = require('./routes/qr.routes.js');
app.use('/api/qr', authMiddleware, qrRoutes); // Protected by authMiddleware

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
