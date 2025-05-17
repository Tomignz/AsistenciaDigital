const express = require('express');
const router = express.Router();
const Asistencia = require('../models/Asistencia');
const User = require('../models/User');  // Asegúrate de tener el modelo User creado
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

// GET: Obtener todas las asistencias
router.get('/', async (req, res) => {
  try {
    const asistencias = await Asistencia.find();
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- RUTAS DE AUTENTICACIÓN ---

// POST: Registrar nuevo usuario
router.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Verificar si usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST: Login de usuario
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Retornar info básica, luego se puede implementar JWT para sesiones
    res.json({ username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
