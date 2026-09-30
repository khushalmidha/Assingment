import express from 'express';
import { store } from '../db/store.js';
import { scrapeLinkedIn } from '../../../lib/scrapers/linkedin.js';
import { scrapeInstagram } from '../../../lib/scrapers/instagram.js';
import { analyzePersonProfile } from '../../../lib/agents/analyzer.js';

const router = express.Router();

// GET all profiles
router.get('/', (req, res) => {
  try {
    const profiles = store.getProfiles();
    res.json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET profile by ID
router.get('/:id', (req, res) => {
  try {
    const profile = store.getProfileById(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const dates = store.getDatesForPerson(profile.id);
    const rankings = store.getRankingsForPerson(profile.id);

    res.json({
      success: true,
      data: {
        ...profile,
        datesCount: dates.length,
        recentDates: dates.slice(0, 5),
        topMatches: rankings.slice(0, 5)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scrape: Scrape LinkedIn and Instagram profiles
router.post('/scrape', async (req, res) => {
  const { linkedinUrl, instagramUrl } = req.body;

  if (!linkedinUrl || !instagramUrl) {
    return res.status(400).json({ success: false, error: 'Both linkedinUrl and instagramUrl are required.' });
  }

  try {
    console.log(`[API] /scrape: Scraping ${linkedinUrl} and ${instagramUrl}`);
    const [linkedinData, instagramData] = await Promise.all([
      scrapeLinkedIn(linkedinUrl),
      scrapeInstagram(instagramUrl)
    ]);

    res.json({
      success: true,
      data: {
        linkedin: linkedinData,
        instagram: instagramData
      }
    });
  } catch (err) {
    console.error('[API] /scrape error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/analyze/:personId: Analyze scraped data with Claude Sonnet 4.6
router.post('/analyze/:personId', async (req, res) => {
  const { personId } = req.params;
  const { linkedin, instagram, name } = req.body;

  try {
    const existing = store.getProfileById(personId);
    const personName = name || existing?.name || personId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const analyzed = await analyzePersonProfile(personId, personName, linkedin || {}, instagram || {});

    const updated = {
      id: personId,
      name: personName,
      avatar: existing?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      linkedinUrl: existing?.linkedinUrl || linkedin?.url,
      instagramUrl: existing?.instagramUrl || instagram?.url,
      headline: analyzed.personality_archetype,
      personality_archetype: analyzed.personality_archetype,
      voice_profile: analyzed.voice_profile,
      needs: analyzed.needs,
      hobbies: analyzed.hobbies,
      interests: analyzed.interests,
      dealbreakers: analyzed.dealbreakers,
      conversation_starters: analyzed.conversation_starters,
      status: "ready",
      updatedAt: new Date().toISOString()
    };

    store.addProfile(updated);

    res.json({
      success: true,
      message: `Profile analyzed and stored with evidence citations and Mem0 voice profile.`,
      data: updated
    });
  } catch (err) {
    console.error('[API] /analyze/:personId error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/profiles/analyze (Direct pipeline ingestion)
router.post('/analyze', async (req, res) => {
  const { linkedinUrl, instagramUrl } = req.body;

  if (!linkedinUrl || !instagramUrl) {
    return res.status(400).json({ success: false, error: 'Both linkedinUrl and instagramUrl are required.' });
  }

  try {
    console.log(`[API] Ingesting profile: ${linkedinUrl} + ${instagramUrl}`);
    const [linkedinData, instagramData] = await Promise.all([
      scrapeLinkedIn(linkedinUrl),
      scrapeInstagram(instagramUrl)
    ]);

    const slug = linkedinUrl.split('/in/')[1]?.replace(/\/$/, '') || `user-${Date.now()}`;
    const personName = linkedinData.name || instagramData.fullName || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

    const analyzed = await analyzePersonProfile(slug, personName, linkedinData, instagramData);

    const newProfile = {
      id: slug,
      name: personName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      linkedinUrl,
      instagramUrl,
      headline: analyzed.personality_archetype,
      role: analyzed.personality_archetype,
      company: linkedinData.company || "Independent",
      personality_archetype: analyzed.personality_archetype,
      voice_profile: analyzed.voice_profile,
      voicePersona: {
        tone: analyzed.voice_profile.split('.')[0] || "Articulate",
        styleSummary: analyzed.voice_profile
      },
      needs: analyzed.needs,
      hobbies: analyzed.hobbies,
      interests: analyzed.interests,
      dealbreakers: analyzed.dealbreakers,
      conversation_starters: analyzed.conversation_starters,
      status: "ready",
      createdAt: new Date().toISOString()
    };

    store.addProfile(newProfile);

    res.json({
      success: true,
      message: `Profile for ${newProfile.name} successfully analyzed and registered.`,
      data: newProfile
    });
  } catch (err) {
    console.error('[API] /profiles/analyze error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
