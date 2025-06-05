const express = require('express');
const router = express.Router();
const Asistencia = require('../models/Asistencia');
const User = require('../models/User.js');  // Asegúrate de tener el modelo User creado
const bcrypt = require('bcryptjs');

// --- RUTAS DE ASISTENCIAS ---

// POST: Registrar una nueva asistencia
router.post('/', async (req, res) => {
  try {
    const nuevaAsistencia = new Asistencia(req.body);
    await nuevaAsistencia.save();
    res.status(201).json(nuevaAsistencia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/asistencias/scan - Registrar asistencia mediante escaneo QR
router.post('/scan', async (req, res) => {
  const { sessionId } = req.body;
  const qrSessions = req.app.locals.qrSessions; // Access global qrSessions

  if (!sessionId) {
    return res.status(400).json({ message: 'sessionId es requerido.' });
  }

  if (!qrSessions.has(sessionId)) {
    return res.status(404).json({ message: 'Sesión QR no válida o no encontrada.' });
  }

  const session = qrSessions.get(sessionId);

  if (Date.now() > session.expiryTime) {
    qrSessions.delete(sessionId); // Clean up expired session
    return res.status(410).json({ message: 'Sesión QR ha expirado.' });
  }

  if (!req.user || !req.user.userId) {
      // This should ideally be caught by authMiddleware if the route is protected
      return res.status(401).json({ message: 'Usuario no autenticado.' });
  }
  const studentId = req.user.userId;

  if (session.registrations.includes(studentId)) {
    return res.status(409).json({ message: 'Ya te has registrado para esta sesión.' });
  }

  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado.' });
    }

    const nuevaAsistencia = new Asistencia({
      nombre: student.username, // Using username as 'nombre'
      apellido: student.apellido || '', // Assuming User model might have 'apellido'
      materia: session.materia,
      fecha: new Date(),
      presente: true,
      userId: studentId,
      sessionId: sessionId,
    });

    await nuevaAsistencia.save();

    // Add user to session registrations to prevent double scanning
    session.registrations.push(studentId);
    qrSessions.set(sessionId, session); // Update the session in the map

    res.status(201).json({
      message: 'Asistencia registrada correctamente.',
      asistencia: nuevaAsistencia,
    });
  } catch (error) {
    console.error('Error al registrar asistencia por QR:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar asistencia.' });
  }
});

// GET: Obtener todas las asistencias
router.get('/', async (req, res) => {
  try {
    const asistencias = await Asistencia.find();
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Actualizar una asistencia existente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Asistencia.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Eliminar una asistencia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Asistencia.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }
    res.json({ message: 'Asistencia eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
