const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Create consultation
router.post('/', async (req, res) => {
  try {
    const { 
      patient_id,
      chief_complaint,
      present_illness,
      past_history,
      family_history,
      physical_examination,
      mental_symptoms,
      modalities,
      selected_symptoms,
      diagnosis,
      notes
    } = req.body;
    
    const { data, error } = await supabase
      .from('consultations')
      .insert([
        {
          physician_id: req.user.id,
          patient_id,
          chief_complaint,
          present_illness,
          past_history,
          family_history,
          physical_examination,
          mental_symptoms,
          modalities,
          selected_symptoms,
          diagnosis,
          notes
        }
      ])
      .select('*, patients(name, age, gender)')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Consultation created successfully', consultation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all consultations for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, patients(name)')
      .eq('patient_id', req.params.patientId)
      .eq('physician_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ consultations: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get consultation by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*, patients(name, age, gender, contact)')
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .single();

    if (error) throw error;
    res.json({ consultation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update consultation
router.put('/:id', async (req, res) => {
  try {
    const updateData = req.body;
    
    const { data, error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', req.params.id)
      .eq('physician_id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Consultation updated successfully', consultation: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add follow-up to consultation
router.post('/:id/followup', async (req, res) => {
  try {
    const { 
      improvement,
      new_symptoms,
      remedy_response,
      notes
    } = req.body;
    
    const { data, error } = await supabase
      .from('followups')
      .insert([
        {
          consultation_id: req.params.id,
          physician_id: req.user.id,
          improvement,
          new_symptoms,
          remedy_response,
          notes
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Follow-up added successfully', followup: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get follow-ups for consultation
router.get('/:id/followups', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('followups')
      .select('*')
      .eq('consultation_id', req.params.id)
      .eq('physician_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ followups: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
