import express from 'express';
import { store } from '../db/store.js';

const router = express.Router();

// GET /api/rankings/matrix: NxN compatibility matrix for the heatmap
router.get('/matrix', (req, res) => {
  try {
    const data = store.getMatrix();
    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/rankings/:personId: Ranked matches for a specific person
router.get('/:personId', (req, res) => {
  try {
    const person = store.getProfileById(req.params.personId);
    if (!person) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }

    const rankings = store.getRankingsForPerson(person.id);
    res.json({
      success: true,
      person: {
        id: person.id,
        name: person.name,
        avatar: person.avatar,
        headline: person.headline || person.role,
        personality_archetype: person.personality_archetype
      },
      rankingsCount: rankings.length,
      rankings,
      data: rankings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/rankings: Top matches leaderboard
router.get('/', (req, res) => {
  try {
    const profiles = store.getProfiles();
    const dates = store.getDates();

    const leaderboard = [];
    const seen = new Set();

    for (const p of profiles) {
      const topMatches = store.getRankingsForPerson(p.id).slice(0, 3);
      for (const m of topMatches) {
        const pairKey = [p.id, m.person.id].sort().join('__');
        if (!seen.has(pairKey)) {
          seen.add(pairKey);
          leaderboard.push({
            person1: { id: p.id, name: p.name, avatar: p.avatar, headline: p.headline || p.role },
            person2: { id: m.person.id, name: m.person.name, avatar: m.person.avatar, headline: m.person.headline || m.person.role },
            score: m.score,
            scores: m.scores,
            reasons: m.reasons || m.explanation,
            explanation: m.explanation,
            date_id: m.date_id,
            dateTranscriptId: m.dateTranscriptId
          });
        }
      }
    }

    leaderboard.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      totalProfiles: profiles.length,
      totalDates: dates.length,
      leaderboard: leaderboard.slice(0, 25),
      data: leaderboard.slice(0, 25)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
