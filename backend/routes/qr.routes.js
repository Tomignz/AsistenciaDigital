const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// POST /api/qr/generate - Generates a new QR session
router.post('/generate', (req, res) => {
  const qrSessions = req.app.locals.qrSessions; // Access from app.locals
  const { materia, durationMinutes } = req.body;
  const professorId = req.user ? req.user.userId : null; // Assuming req.user is populated by authMiddleware

  if (!professorId) {
    return res.status(401).json({ message: 'No autorizado. ID de profesor no encontrado.' });
  }

  if (!materia || typeof materia !== 'string' || materia.trim() === '') {
    return res.status(400).json({ message: 'El campo "materia" es requerido y debe ser un texto no vacío.' });
  }

  if (durationMinutes === undefined || typeof durationMinutes !== 'number' || durationMinutes <= 0) {
    return res.status(400).json({ message: 'El campo "durationMinutes" es requerido, debe ser un número positivo.' });
  }

  const sessionId = crypto.randomBytes(16).toString('hex');
  const expiryTime = Date.now() + durationMinutes * 60 * 1000;

  qrSessions.set(sessionId, {
    materia,
    expiryTime,
    professorId,
    registrations: [], // To store users who scanned this QR
  });

  // Schedule cleanup for this specific session
  setTimeout(() => {
    if (qrSessions.has(sessionId)) { // Check if session still exists
      qrSessions.delete(sessionId);
      console.log(`Session ${sessionId} for materia ${materia} expired and cleaned up.`);
    }
  }, durationMinutes * 60 * 1000 + 1000); // Add a small buffer

  console.log(`Session created: ${sessionId}, Materia: ${materia}, Expires: ${new Date(expiryTime).toLocaleTimeString()}`);
  res.status(201).json({ sessionId, materia, expiryTime: new Date(expiryTime).toISOString() });
});

// Optional: A more general periodic cleanup task (if needed, ensure qrSessions is accessed correctly)
// setInterval(() => {
//   const qrSessions = appReference.locals.qrSessions; // Need a reference to 'app' if used here
//   const now = Date.now();
//   for (const [sessionId, sessionData] of qrSessions.entries()) {
//     if (sessionData.expiryTime < now) {
//       qrSessions.delete(sessionId);
//       console.log(`Periodic cleanup: Session ${sessionId} for materia ${sessionData.materia} expired and cleaned up.`);
//     }
//   }
// }, 5 * 60 * 1000);


module.exports = router;
