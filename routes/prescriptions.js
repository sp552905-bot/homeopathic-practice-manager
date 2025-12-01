const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Create prescription
router.post('/', async (req, res) => {
  try {
    const { 
      patient_id, 
      consultation_id,
      remedy_id, 
      potency, 
      dosage, 
      frequency,
      duration,
      instructions,
      notes 
    } = req.body;
    
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([
        {
          physician_id: req.user.id,
          patient_id,
          consultation_id,
          remedy_id,
          potency,
          dosage,
          frequency,
          duration,
          instructions,
          notes
        }
      ])
      .select('*, remedies(name, common_name), patients(name)')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Prescription created successfully', prescription: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all prescriptions for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, remedies(name, common_name), patients(name)')
      .eq('patient_id', req.params.patientId)
      .eq('physician_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ prescriptions: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, remedies(name, common_name), patients(name, age, gender)')
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ prescription: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prescription
router.put('/:id', async (req, res) => {
  try {
    const { potency, dosage, frequency, duration, instructions, notes } = req.body;
    
    const { data, error } = await supabase
      .from('prescriptions')
      .update({ potency, dosage, frequency, duration, instructions, notes })
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Prescription updated successfully', prescription: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent prescriptions
router.get('/recent/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*, remedies(name, common_name), patients(name)')
      .eq('physician_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json({ prescriptions: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
