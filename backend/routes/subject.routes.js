const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('professor', 'username');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE subject
router.post('/', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE subject
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Subject.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Asignatura no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE subject
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subject.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Asignatura no encontrada' });
    res.json({ message: 'Asignatura eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
