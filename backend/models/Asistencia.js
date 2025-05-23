const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true }, // Consider if this is still needed if User model provides it
  materia: { type: String, required: true },
  fecha: { type: Date, required: true },
  presente: { type: Boolean, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sessionId: { type: String, required: false }
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
