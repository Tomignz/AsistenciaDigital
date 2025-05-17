const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  materia: { type: String, required: true },
  fecha: { type: Date, required: true },
  presente: { type: Boolean, required: true }
});

module.exports = mongoose.model('Asistencia', asistenciaSchema);
