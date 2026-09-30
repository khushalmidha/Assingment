import express from 'express';
import { store } from '../db/store.js';
import { scrapeLinkedInProfile, scrapeInstagramProfile } from '../scrapers/browserScraper.js';
import { analyzeProfileWithClaude } from '../agents/analyzer.js';

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

// POST scrape and analyze new profile
router.post('/analyze', async (req, res) => {
  const { linkedinUrl, instagramUrl } = req.body;

  if (!linkedinUrl || !instagramUrl) {
    return res.status(400).json({
      success: false,
      error: 'Both linkedinUrl and instagramUrl are required.'
    });
  }

  try {
    console.log(`[API] Triggering scrape & analysis pipeline for:\nLinkedIn: ${linkedinUrl}\nInstagram: ${instagramUrl}`);

    // Step 1: Scrape LinkedIn
    const linkedInData = await scrapeLinkedInProfile(linkedinUrl);

    // Step 2: Scrape Instagram
    const instagramData = await scrapeInstagramProfile(instagramUrl);

    // Merge scraped data
    const combinedData = {
      name: linkedInData.name || instagramData.name || 'New Innovator',
      headline: linkedInData.headline || 'Creator & Innovator',
      currentRole: linkedInData.currentRole || 'Leader',
      company: linkedInData.company || 'Venture & Design',
      education: linkedInData.education || 'University Alumni',
      skills: linkedInData.skills || ['Creativity', 'Leadership', 'Strategy'],
      bio: linkedInData.bio || '',
      recentPosts: linkedInData.recentPosts || [],
      instagramBio: instagramData.instagramBio || '',
      instagramCaptions: instagramData.instagramCaptions || [],
      hashtags: instagramData.hashtags || [],
      topics: instagramData.topics || ['Technology', 'Creativity', 'Lifestyle'],
      avatar: instagramData.avatar || linkedInData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
    };

    // Step 3: Claude Sonnet 4.6 Analysis
    const analysis = await analyzeProfileWithClaude(combinedData);

    const newPersonId = `person-${Date.now()}`;
    const newProfile = {
      id: newPersonId,
      name: combinedData.name,
      avatar: combinedData.avatar,
      linkedinUrl,
      instagramUrl,
      headline: combinedData.headline,
      currentRole: combinedData.currentRole,
      company: combinedData.company,
      education: combinedData.education,
      skills: combinedData.skills,
      bio: combinedData.bio,
      recentPosts: combinedData.recentPosts,
      instagramBio: combinedData.instagramBio,
      instagramCaptions: combinedData.instagramCaptions,
      hashtags: combinedData.hashtags,
      topics: combinedData.topics,
      voicePersona: analysis.voicePersona || {
        tone: 'Articulate, visionary, and engaging',
        pacing: 'Thoughtful and confident',
        catchphrases: ['Leading with intent', 'authenticity', 'staying curious'],
        styleSummary: 'Engages with warmth and clarity, focusing on values and shared passions.'
      },
      analysis: {
        coreNeeds: analysis.coreNeeds,
        hobbies: analysis.hobbies,
        personalityTraits: analysis.personalityTraits,
        lifestyleSignals: analysis.lifestyleSignals,
        dealbreakers: analysis.dealbreakers,
        conversationStarters: analysis.conversationStarters
      },
      createdAt: new Date().toISOString()
    };

    store.addProfile(newProfile);

    res.json({
      success: true,
      message: `Profile for ${newProfile.name} successfully analyzed and registered.`,
      data: newProfile
    });
  } catch (err) {
    console.error('[API] Scrape & analyze error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
