const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Get all repertory sections
router.get('/sections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('repertory_sections')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ sections: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get symptoms by section
router.get('/sections/:sectionId/symptoms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('repertory_symptoms')
      .select('*')
      .eq('section_id', req.params.sectionId)
      .order('symptom', { ascending: true });

    if (error) throw error;
    res.json({ symptoms: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search symptoms
router.get('/symptoms/search/:query', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('repertory_symptoms')
      .select('*, repertory_sections(name)')
      .ilike('symptom', `%${req.params.query}%`)
      .limit(100);

    if (error) throw error;
    res.json({ symptoms: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Repertorization - analyze symptoms and suggest remedies
router.post('/analyze', async (req, res) => {
  try {
    const { symptom_ids } = req.body;

    if (!symptom_ids || symptom_ids.length === 0) {
      return res.status(400).json({ error: 'No symptoms provided' });
    }

    // Get all remedy-symptom relationships for selected symptoms
    const { data, error } = await supabase
      .from('remedy_symptoms')
      .select('remedy_id, symptom_id, grade, remedies(name, common_name)')
      .in('symptom_id', symptom_ids);

    if (error) throw error;

    // Calculate remedy scores
    const remedyScores = {};
    data.forEach(item => {
      const remedyId = item.remedy_id;
      if (!remedyScores[remedyId]) {
        remedyScores[remedyId] = {
          remedy: item.remedies,
          total_score: 0,
          symptom_count: 0,
          symptoms: []
        };
      }
      remedyScores[remedyId].total_score += item.grade;
      remedyScores[remedyId].symptom_count += 1;
      remedyScores[remedyId].symptoms.push({
        symptom_id: item.symptom_id,
        grade: item.grade
      });
    });

    // Sort by total score and symptom coverage
    const results = Object.values(remedyScores)
      .map(item => ({
        ...item,
        coverage: (item.symptom_count / symptom_ids.length) * 100
      }))
      .sort((a, b) => {
        // Prioritize remedies that cover more symptoms
        if (b.symptom_count !== a.symptom_count) {
          return b.symptom_count - a.symptom_count;
        }
        // Then by total score
        return b.total_score - a.total_score;
      })
      .slice(0, 30);

    res.json({ 
      results,
      total_symptoms: symptom_ids.length,
      total_remedies: results.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
