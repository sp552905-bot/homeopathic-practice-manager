const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

// Register physician
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, license_number, specialization } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data, error } = await supabase
      .from('physicians')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          license_number,
          specialization
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Generate token
    const token = jwt.sign(
      { id: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Physician registered successfully',
      token,
      physician: { id: data.id, email: data.email, name: data.name }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: physician, error } = await supabase
      .from('physicians')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !physician) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, physician.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: physician.id, email: physician.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      physician: { 
        id: physician.id, 
        email: physician.email, 
        name: physician.name 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
