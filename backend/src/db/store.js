import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../../data/db.json');
const SEED_PATH = path.resolve(__dirname, '../../../data/initial_people.json');

class Store {
  constructor() {
    this.data = {
      profiles: [],
      dates: [],
      memories: {},
      rankings: {}
    };
    this.init();
  }

  init() {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(`[Store] Loaded ${this.data.profiles.length} profiles and ${this.data.dates.length} dates from db.json`);
      } else if (fs.existsSync(SEED_PATH)) {
        const seedRaw = fs.readFileSync(SEED_PATH, 'utf-8');
        const seedProfiles = JSON.parse(seedRaw);
        this.data.profiles = seedProfiles;
        this.seedInitialDates();
        this.save();
        console.log(`[Store] Seeded ${this.data.profiles.length} initial profiles and ${this.data.dates.length} dates`);
      } else {
        this.data = { profiles: [], dates: [], memories: {}, rankings: {} };
      }
    } catch (err) {
      console.error('[Store] Initialization error:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error saving DB:', err);
    }
  }

  getProfiles() {
    return this.data.profiles;
  }

  getProfileById(id) {
    return this.data.profiles.find(p => p.id === id || p.id === `person-${id}`);
  }

  addProfile(profile) {
    const existingIdx = this.data.profiles.findIndex(p => p.id === profile.id);
    if (existingIdx >= 0) {
      this.data.profiles[existingIdx] = profile;
    } else {
      this.data.profiles.unshift(profile);
    }
    this.save();
    return profile;
  }

  getDates() {
    return this.data.dates;
  }

  getDateById(dateId) {
    return this.data.dates.find(d => d.id === dateId);
  }

  getDatesForPerson(personId) {
    return this.data.dates.filter(d => d.person1Id === personId || d.person2Id === personId);
  }

  addDate(dateRecord) {
    this.data.dates.unshift(dateRecord);
    this.save();
    return dateRecord;
  }

  // Memory management (Mem0 pattern)
  storeMemory(agentId, key, value, context = {}) {
    if (!this.data.memories[agentId]) {
      this.data.memories[agentId] = [];
    }
    const memItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      key,
      value,
      context,
      timestamp: new Date().toISOString()
    };
    this.data.memories[agentId].push(memItem);
    this.save();
    return memItem;
  }

  recallMemory(agentId, key) {
    const agentMems = this.data.memories[agentId] || [];
    if (!key) return agentMems;
    const lowerKey = key.toLowerCase();
    return agentMems.filter(m => 
      m.key.toLowerCase().includes(lowerKey) || 
      (typeof m.value === 'string' && m.value.toLowerCase().includes(lowerKey))
    );
  }

  getAllMemories(agentId) {
    return this.data.memories[agentId] || [];
  }

  // Calculate compatibility & rankings for a person against all other profiles
  getRankingsForPerson(personId) {
    const target = this.getProfileById(personId);
    if (!target) return [];

    const otherProfiles = this.data.profiles.filter(p => p.id !== target.id);
    const results = [];

    for (const other of otherProfiles) {
      // Look for simulated date between these two
      const date = this.data.dates.find(d => 
        (d.person1Id === target.id && d.person2Id === other.id) ||
        (d.person1Id === other.id && d.person2Id === target.id)
      );

      let chemistry = 7;
      let sharedInterestsScore = 7;
      let lifestyleScore = 7;
      let conversationScore = 7;
      let overall = 75;
      let dateTranscriptId = null;

      if (date && date.scores) {
        chemistry = date.scores.chemistry || 8;
        sharedInterestsScore = date.scores.sharedInterests || 8;
        lifestyleScore = date.scores.lifestyle || 8;
        conversationScore = date.scores.conversation || 8;
        overall = Math.round(((chemistry + sharedInterestsScore + lifestyleScore + conversationScore) / 40) * 100);
        dateTranscriptId = date.id;
      } else {
        // Compute algorithmic compatibility heuristic if not dated yet
        const sharedTopics = (target.topics || []).filter(t => (other.topics || []).includes(t));
        const sharedHobbies = (target.analysis?.hobbies || []).filter(h => 
          (other.analysis?.hobbies || []).some(oh => oh.toLowerCase().includes(h.toLowerCase().slice(0, 5)))
        );

        chemistry = Math.min(10, Math.max(5, 6 + sharedTopics.length + (Math.random() > 0.5 ? 1 : 0)));
        sharedInterestsScore = Math.min(10, Math.max(5, 5 + (sharedTopics.length * 1.5) + sharedHobbies.length));
        lifestyleScore = Math.min(10, Math.max(5, 7 + (Math.random() > 0.4 ? 1 : -1)));
        conversationScore = Math.min(10, Math.max(6, 8 + (Math.random() > 0.5 ? 1 : 0)));
        overall = Math.round(((chemistry + sharedInterestsScore + lifestyleScore + conversationScore) / 40) * 100);
      }

      // Generate rich AI reason based on traits and shared signals
      const reasons = this.generateMatchReason(target, other, overall);

      results.push({
        person: {
          id: other.id,
          name: other.name,
          headline: other.headline,
          company: other.company,
          avatar: other.avatar,
          linkedinUrl: other.linkedinUrl,
          instagramUrl: other.instagramUrl
        },
        scores: {
          overall,
          chemistry,
          sharedInterests: sharedInterestsScore,
          lifestyle: lifestyleScore,
          conversation: conversationScore
        },
        reasons,
        dateTranscriptId
      });
    }

    // Sort descending by overall compatibility
    results.sort((a, b) => b.scores.overall - a.scores.overall);
    return results;
  }

  generateMatchReason(p1, p2, overall) {
    const p1Topics = p1.topics || [];
    const p2Topics = p2.topics || [];
    const sharedTopics = p1Topics.filter(t => p2Topics.includes(t));
    
    const p1Hobbies = p1.analysis?.hobbies || [];
    const p2Hobbies = p2.analysis?.hobbies || [];
    
    if (overall >= 88) {
      return `Exceptional resonance! Matched profoundly on ${sharedTopics[0] || 'shared vision'} and complementary lifestyle rhythms. Both prioritize intellectual depth, ethical grounding, and high-discipline daily routines.`;
    } else if (overall >= 78) {
      return `Strong synergy! Natural rapport around ${sharedTopics[0] || 'creative curiosity'} and ${p1Hobbies[0] || 'deep work'}. Shared conversational cadence with high mutual admiration for craft.`;
    } else if (overall >= 68) {
      return `Promising dynamic. Balanced contrast where ${p1.name.split(' ')[0]}'s focus complements ${p2.name.split(' ')[0]}'s energy, though lifestyle schedules may require intentional planning.`;
    } else {
      return `Divergent lifestyle vectors. While both admire each other's achievements, their daily tempos and core dealbreakers indicate friction in long-term alignment.`;
    }
  }

  seedInitialDates() {
    // Seed high-quality multi-turn date transcripts between key agents
    if (this.data.profiles.length < 2) return;

    const pairs = [
      ['person-satya-nadella', 'person-fei-fei-li'],
      ['person-sam-altman', 'person-mira-murati'],
      ['person-lex-fridman', 'person-brene-brown'],
      ['person-brian-chesky', 'person-melanie-perkins'],
      ['person-marques-brownlee', 'person-ijustine'],
      ['person-sundar-pichai', 'person-andrew-ng'],
      ['person-gary-vee', 'person-sara-blakely'],
      ['person-mark-cuban', 'person-alexis-ohanian'],
      ['person-ali-abdaal', 'person-payal-kadakia'],
      ['person-tony-fadell', 'person-whitney-wolfe-herd'],
      ['person-andrej-karpathy', 'person-andrew-huberman'],
      ['person-shiza-shahid', 'person-reid-hoffman'],
      ['person-reshma-saujani', 'person-sara-blakely']
    ];

    for (let i = 0; i < pairs.length; i++) {
      const [p1Id, p2Id] = pairs[i];
      const p1 = this.data.profiles.find(p => p.id === p1Id);
      const p2 = this.data.profiles.find(p => p.id === p2Id);
      if (!p1 || !p2) continue;

      const dateId = `date-seed-${i + 1}`;
      const sampleTranscript = this.generatePreloadedDateTranscript(p1, p2, dateId);
      this.data.dates.push(sampleTranscript);
    }
  }

  generatePreloadedDateTranscript(p1, p2, dateId) {
    const p1First = p1.name.split(' ')[0];
    const p2First = p2.name.split(' ')[0];

    const turns = [
      {
        turn: 1,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `Good evening, ${p2First}. It is a real pleasure to meet you. I was reflecting earlier today on how rare it is to find someone whose work is so anchored in genuine human dignity. How has your week unfolded?`,
        tone: p1.voicePersona?.tone || 'Thoughtful and warm',
        mcpAction: {
          tool: 'get_partner_profile',
          params: { person_id: p2.id },
          result: `Retrieved ${p2.name} profile: ${p2.headline}`
        }
      },
      {
        turn: 2,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `Thank you so much, ${p1First}. That means a lot coming from you. My week has been a whirlwind of research and quiet moments in the garden. I've been thinking about how easy it is for technology to lose its soul if we don't deliberately ground it in human values. What anchors you when the world feels overwhelmingly loud?`,
        tone: p2.voicePersona?.tone || 'Scholarly and compassionate',
        mcpAction: {
          tool: 'store_memory',
          params: { key: `${p1First}_anchor`, value: 'Values quiet contemplation and human dignity' },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 3,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `For me, it always comes back to early morning quietude—a hot cup of tea and timeless poetry, or the patient cadence of test cricket where strategy unfolds across days rather than milliseconds. It teaches you that the most important transformations require stamina, grace, and deep listening.`,
        tone: p1.voicePersona?.tone || 'Reflective and calm',
        mcpAction: {
          tool: 'store_memory',
          params: { key: 'morning_routine', value: 'Chai, poetry, patience of test cricket' },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 4,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `I love that metaphor of test cricket. In science, we often rush to claim instant breakthroughs, but true discovery is an immigrant's journey—quiet perseverance through years where nobody is clapping. What do you look for when you want to truly trust someone in your inner circle?`,
        tone: p2.voicePersona?.tone || 'Deeply thoughtful and grounded',
        mcpAction: {
          tool: 'recall_memory',
          params: { key: `${p1First}_anchor` },
          result: 'Recalled: Values quiet contemplation and human dignity'
        }
      },
      {
        turn: 5,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `Radical empathy and humility. I believe you learn who someone really is not in moments of effortless triumph, but in how they treat people when the stakes are uncertain and there is no audience watching. Knowing you value that same integrity makes this conversation exceptionally delightful.`,
        tone: p1.voicePersona?.tone || 'Warm and sincere',
        mcpAction: {
          tool: 'store_memory',
          params: { key: 'core_alignment', value: 'Radical empathy, perseverance without an audience' },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 6,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `I could not agree more, ${p1First}. It feels extraordinarily refreshing to speak without pretense. Next time, let's share that cup of tea in a quiet garden and dive even deeper.`,
        tone: p2.voicePersona?.tone || 'Warm and radiant',
        mcpAction: {
          tool: 'score_date',
          params: { chemistry: 9, sharedInterests: 10, lifestyle: 9, conversation: 10 },
          result: 'Date scored and finalized'
        }
      }
    ];

    const chemistry = Math.floor(Math.random() * 2) + 9;
    const sharedInterests = Math.floor(Math.random() * 2) + 9;
    const lifestyle = Math.floor(Math.random() * 2) + 8;
    const conversation = 10;

    return {
      id: dateId,
      person1Id: p1.id,
      person2Id: p2.id,
      person1Name: p1.name,
      person2Name: p2.name,
      person1Avatar: p1.avatar,
      person2Avatar: p2.avatar,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
      turnsCount: turns.length,
      turns,
      memoriesFormed: [
        { key: `${p1First}_anchor`, value: 'Values quiet contemplation, tea, and human dignity' },
        { key: `${p2First}_values`, value: 'Scientific perseverance, botanical gardens, and ethical courage' },
        { key: 'mutual_resonance', value: 'Radical empathy, rejection of superficial vanity' }
      ],
      scores: {
        chemistry,
        sharedInterests,
        lifestyle,
        conversation,
        overall: Math.round(((chemistry + sharedInterests + lifestyle + conversation) / 40) * 100)
      },
      summary: `High intellectual and emotional connection. Both agents communicated with profound mutual respect, discovering shared principles of empathy, patience, and purpose-driven work.`
    };
  }
}

export const store = new Store();
export default store;
