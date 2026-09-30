import express from 'express';
import { store } from '../db/store.js';
import { simulateDateBetweenAgents } from '../agents/datingEngine.js';

const router = express.Router();

// GET all dates
router.get('/dates', (req, res) => {
  try {
    const dates = store.getDates();
    res.json({
      success: true,
      count: dates.length,
      data: dates
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET date by ID
router.get('/dates/:id', (req, res) => {
  try {
    const date = store.getDateById(req.params.id);
    if (!date) {
      return res.status(404).json({ success: false, error: 'Date session not found' });
    }
    res.json({
      success: true,
      data: date
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST simulate new date between two agents
router.post('/simulate', async (req, res) => {
  const { person1Id, person2Id } = req.body;

  if (!person1Id || !person2Id) {
    return res.status(400).json({
      success: false,
      error: 'Both person1Id and person2Id are required.'
    });
  }

  if (person1Id === person2Id) {
    return res.status(400).json({
      success: false,
      error: 'An agent cannot date itself.'
    });
  }

  try {
    console.log(`[API] Simulating date between ${person1Id} and ${person2Id}...`);
    const dateRecord = await simulateDateBetweenAgents(person1Id, person2Id);
    
    res.json({
      success: true,
      message: `Date between ${dateRecord.person1Name} and ${dateRecord.person2Name} completed.`,
      data: dateRecord
    });
  } catch (err) {
    console.error('[API] Date simulation failed:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
