const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  commission: { type: String, enum: ['A', 'B'], default: 'A' }
});

module.exports = mongoose.model('Subject', subjectSchema);
