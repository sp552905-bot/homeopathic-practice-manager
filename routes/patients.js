const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create patient
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, contact, email, address, medical_history } = req.body;
    
    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          physician_id: req.user.id,
          name,
          age,
          gender,
          contact,
          email,
          address,
          medical_history
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Patient created successfully', patient: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('physician_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ patients: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ patient: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient
router.put('/:id', async (req, res) => {
  try {
    const { name, age, gender, contact, email, address, medical_history } = req.body;
    
    const { data, error } = await supabase
      .from('patients')
      .update({ name, age, gender, contact, email, address, medical_history })
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Patient updated successfully', patient: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id);

    if (error) throw error;
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search patients
router.get('/search/:query', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('physician_id', req.user.id)
      .ilike('name', `%${req.params.query}%`);

    if (error) throw error;
    res.json({ patients: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
