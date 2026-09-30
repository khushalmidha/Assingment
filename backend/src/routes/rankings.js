import express from 'express';
import { store } from '../db/store.js';

const router = express.Router();

// GET ranked matches for a person
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
        headline: person.headline,
        company: person.company
      },
      rankingsCount: rankings.length,
      rankings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET global compatibility leaderboard & matrix
router.get('/', (req, res) => {
  try {
    const profiles = store.getProfiles();
    const dates = store.getDates();

    // Top matches leaderboard
    const leaderboard = [];
    const seen = new Set();

    for (const p of profiles) {
      const topMatches = store.getRankingsForPerson(p.id).slice(0, 3);
      for (const m of topMatches) {
        const pairKey = [p.id, m.person.id].sort().join('__');
        if (!seen.has(pairKey)) {
          seen.add(pairKey);
          leaderboard.push({
            person1: { id: p.id, name: p.name, avatar: p.avatar, headline: p.headline },
            person2: { id: m.person.id, name: m.person.name, avatar: m.person.avatar, headline: m.person.headline },
            scores: m.scores,
            reasons: m.reasons,
            dateTranscriptId: m.dateTranscriptId
          });
        }
      }
    }

    leaderboard.sort((a, b) => b.scores.overall - a.scores.overall);

    res.json({
      success: true,
      totalProfiles: profiles.length,
      totalDates: dates.length,
      leaderboard: leaderboard.slice(0, 20)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
