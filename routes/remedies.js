const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all remedies
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ remedies: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get remedy by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ remedy: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search remedies
router.get('/search/:query', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('remedies')
      .select('*')
      .or(`name.ilike.%${req.params.query}%,common_name.ilike.%${req.params.query}%`)
      .limit(50);

    if (error) throw error;
    res.json({ remedies: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get remedy by symptoms
router.post('/by-symptoms', async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    // This is a simplified version - in production, implement proper repertorization
    const { data, error } = await supabase
      .from('remedy_symptoms')
      .select('remedy_id, remedies(name, common_name), symptom, grade')
      .in('symptom', symptoms)
      .order('grade', { ascending: false });

    if (error) throw error;

    // Aggregate results by remedy
    const remedyScores = {};
    data.forEach(item => {
      const remedyId = item.remedy_id;
      if (!remedyScores[remedyId]) {
        remedyScores[remedyId] = {
          remedy: item.remedies,
          score: 0,
          symptoms: []
        };
      }
      remedyScores[remedyId].score += item.grade;
      remedyScores[remedyId].symptoms.push({
        symptom: item.symptom,
        grade: item.grade
      });
    });

    const results = Object.values(remedyScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
