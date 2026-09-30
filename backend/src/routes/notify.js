import express from 'express';
import { store } from '../db/store.js';

const router = express.Router();

router.post('/preview', (req, res) => {
  const { personId, channel = 'telegram' } = req.body;

  try {
    const person = store.getProfileById(personId);
    if (!person) {
      return res.status(404).json({ success: false, error: 'Person not found' });
    }

    const rankings = store.getRankingsForPerson(person.id);
    const topMatches = rankings.slice(0, 3);
    const firstName = person.name.split(' ')[0];

    const message = `✨ Hey ${firstName}! Your AI dating agent has completed round-robin dates with all candidate agents.

Here are your top matches:

🥇 1. ${topMatches[0].person.name} (${topMatches[0].scores.overall}% match)
💡 Why: ${topMatches[0].reasons}

🥈 2. ${topMatches[1].person.name} (${topMatches[1].scores.overall}% match)
💡 Why: ${topMatches[1].reasons}

🥉 3. ${topMatches[2].person.name} (${topMatches[2].scores.overall}% match)
💡 Why: ${topMatches[2].reasons}

Your agent noticed exceptional shared chemistry and lifestyle alignment with ${topMatches[0].person.name.split(' ')[0]}. Would you like your agent to schedule a 15-minute coffee chat? ☕`;

    res.json({
      success: true,
      channel,
      recipient: person.name,
      message,
      sentAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
