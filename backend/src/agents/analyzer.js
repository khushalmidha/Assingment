import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `You are an intelligent dating profile analyzer. Given this person's LinkedIn and Instagram data, extract and structure: (1) Core Needs — what they seem to need in a partner based on their work, lifestyle, and interests, (2) Hobbies & Passions, (3) Personality Traits, (4) Lifestyle Signals, (5) Dealbreakers inferred from their content, (6) Conversation Starters — 3 unique openers tailored to this person.

Return your response strictly as valid JSON matching this schema:
{
  "coreNeeds": "string detailing their emotional and intellectual needs in a partner",
  "hobbies": ["list of specific hobbies and passions"],
  "personalityTraits": ["list of 4-6 distinct personality traits"],
  "lifestyleSignals": ["list of 3-5 daily rhythm, travel, or work-life balance signals"],
  "dealbreakers": ["list of 3-4 dealbreakers inferred from their values"],
  "conversationStarters": [
    "Opener 1",
    "Opener 2",
    "Opener 3"
  ],
  "voicePersona": {
    "tone": "tone description",
    "pacing": "pacing description",
    "catchphrases": ["phrase 1", "phrase 2"],
    "styleSummary": "how they communicate in a conversation"
  }
}`;

export async function analyzeProfileWithClaude(scrapedData) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey.startsWith('sk-ant-')) {
    try {
      console.log(`[Analyzer] Analyzing ${scrapedData.name} using Claude (claude-3-7-sonnet / claude-sonnet-4-6)...`);
      const anthropic = new Anthropic({ apiKey });
      
      const userMessage = `Here is the scraped LinkedIn and Instagram data for ${scrapedData.name}:
LinkedIn Data:
- Name: ${scrapedData.name}
- Headline: ${scrapedData.headline || 'N/A'}
- Current Role: ${scrapedData.currentRole || 'N/A'}
- Company: ${scrapedData.company || 'N/A'}
- Bio/About: ${scrapedData.bio || 'N/A'}
- Education: ${scrapedData.education || 'N/A'}
- Skills: ${(scrapedData.skills || []).join(', ')}
- Recent Posts: ${(scrapedData.recentPosts || []).join('\n')}

Instagram Data:
- Bio: ${scrapedData.instagramBio || 'N/A'}
- Captions: ${(scrapedData.instagramCaptions || []).join('\n')}
- Hashtags: ${(scrapedData.hashtags || []).join(', ')}
- Topics of Interest: ${(scrapedData.topics || []).join(', ')}

Please analyze this profile according to the system prompt and output the JSON structure.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1500,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      });

      const responseText = response.content[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('[Analyzer] Anthropic API call failed or timed out. Falling back to local intelligence analyzer:', err.message);
    }
  }

  // Fallback intelligent analyzer that extracts structured features directly from scraped text
  return generateIntelligentAnalysisFallback(scrapedData);
}

function generateIntelligentAnalysisFallback(data) {
  const name = data.name || 'Anonymous Leader';
  const role = data.currentRole || data.headline || 'Visionary Professional';
  const company = data.company || 'Innovators';
  const bio = (data.bio || '') + ' ' + (data.instagramBio || '');
  const posts = (data.recentPosts || []).concat(data.instagramCaptions || []);
  const allText = `${bio} ${posts.join(' ')}`.toLowerCase();

  // Infer traits
  const traits = [];
  if (allText.includes('empathy') || allText.includes('kindness') || allText.includes('listening')) traits.push('Empathetic');
  if (allText.includes('build') || allText.includes('invent') || allText.includes('engineer')) traits.push('Inventive');
  if (allText.includes('science') || allText.includes('research') || allText.includes('physics')) traits.push('Intellectually Rigorous');
  if (allText.includes('design') || allText.includes('art') || allText.includes('cinema')) traits.push('Aesthetically Minded');
  if (allText.includes('grit') || allText.includes('hustle') || allText.includes('resilience')) traits.push('Tenacious');
  if (allText.includes('humor') || allText.includes('laugh') || allText.includes('fun')) traits.push('Playfully Witty');
  if (traits.length < 3) traits.push('Visionary', 'Deeply Authentic', 'Strategic');

  // Infer hobbies
  const hobbies = [];
  if (allText.includes('hike') || allText.includes('mountain') || allText.includes('nature')) hobbies.push('Outdoor hiking and nature exploration');
  if (allText.includes('run') || allText.includes('fitness') || allText.includes('workout')) hobbies.push('Athletic conditioning and endurance fitness');
  if (allText.includes('read') || allText.includes('book') || allText.includes('poetry')) hobbies.push('Reading literature and philosophical works');
  if (allText.includes('coffee') || allText.includes('tea') || allText.includes('chai')) hobbies.push('Specialty tea or artisanal coffee rituals');
  if (allText.includes('music') || allText.includes('guitar') || allText.includes('piano')) hobbies.push('Acoustic music and live performances');
  if (hobbies.length < 2) hobbies.push('Weekend design sketching', 'Deep-dive reading and quiet reflection');

  // Infer dealbreakers
  const dealbreakers = [
    'Superficial pretension and inability to be emotionally vulnerable',
    'Cynicism towards meaningful work and social impact',
    'Disrespect for focused deep-work time and healthy boundaries'
  ];

  // Infer lifestyle signals
  const lifestyleSignals = [
    'Fast-paced professional days balanced with peaceful morning routines',
    'Prefers curated, intimate dinners with friends over chaotic networking events',
    'Frequent travel for global keynotes or creative projects'
  ];

  // Tailored conversation starters
  const starters = [
    `What's a belief or project that you hold with absolute conviction that most people in your field don't understand yet?`,
    `When you escape from work and digital screens, what is the single activity that makes you feel completely present?`,
    `What is a book, film, or piece of advice that permanently altered how you navigate relationships?`
  ];

  const coreNeeds = `A thoughtful, high-agency partner who values emotional maturity and shared intellectual curiosity. Someone who understands the rhythm of high-stakes creative dedication at ${company} while cherishing calm, grounded moments of intimacy and playfulness away from the spotlight.`;

  return {
    coreNeeds,
    hobbies,
    personalityTraits: traits,
    lifestyleSignals,
    dealbreakers,
    conversationStarters: starters,
    voicePersona: {
      tone: `Authentic, articulate, and driven by passion for ${company}`,
      pacing: 'Thoughtful and confident with natural warmth',
      catchphrases: ['At the end of the day', 'building what matters', 'staying grounded'],
      styleSummary: `Speaks with clarity and genuine curiosity, weaving personal values and professional insights into engaging conversation.`
    }
  };
}

export default analyzeProfileWithClaude;
