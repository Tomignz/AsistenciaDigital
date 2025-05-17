// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');

mongoose.connect('mongodb://127.0.0.1:27017/asistencia-back')
  .then(async () => {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('⚠️ Usuario admin ya existe');
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash('admin2025', 10);
    const user = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });

    await user.save();
    console.log('✅ Usuario admin creado');
    mongoose.disconnect();
  })
  .catch(console.error);
