const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Added for JWT
const User = require('../models/User.js');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    // Evitar que exista un usuario con mismo username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Sólo permitir roles válidos
    const userRole = role === 'admin' ? 'admin' : 'profesor';

    const newUser = new User({ username, password, role: userRole });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generate JWT Token
    // Use JWT_SECRET from environment variables
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Using environment variable
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token: token, role: user.role, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
