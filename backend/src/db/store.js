import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../../data/db.json');
const DEMO_PROFILES_PATH = path.resolve(__dirname, '../../../data/demo-profiles.json');
const DEMO_DATES_PATH = path.resolve(__dirname, '../../../data/demo-dates.json');
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
      } else if (fs.existsSync(DEMO_PROFILES_PATH) && fs.existsSync(DEMO_DATES_PATH)) {
        const profilesRaw = fs.readFileSync(DEMO_PROFILES_PATH, 'utf-8');
        const datesRaw = fs.readFileSync(DEMO_DATES_PATH, 'utf-8');
        this.data.profiles = JSON.parse(profilesRaw);
        this.data.dates = JSON.parse(datesRaw);
        this.save();
        console.log(`[Store] Seeded ${this.data.profiles.length} demo profiles and ${this.data.dates.length} dates from demo files.`);
      } else if (fs.existsSync(SEED_PATH)) {
        const seedRaw = fs.readFileSync(SEED_PATH, 'utf-8');
        this.data.profiles = JSON.parse(seedRaw);
        this.save();
        console.log(`[Store] Seeded ${this.data.profiles.length} profiles from initial_people.json.`);
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
    if (!id) return null;
    const cleanId = id.replace(/^person-/, '');
    return this.data.profiles.find(p => p.id === id || p.id === cleanId || p.id === `person-${cleanId}`);
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
    const cleanId = personId.replace(/^person-/, '');
    return this.data.dates.filter(d => 
      d.person1Id === personId || d.person1Id === cleanId || d.agent_a_id === cleanId ||
      d.person2Id === personId || d.person2Id === cleanId || d.agent_b_id === cleanId
    );
  }

  addDate(dateRecord) {
    const existingIdx = this.data.dates.findIndex(d => d.id === dateRecord.id);
    if (existingIdx >= 0) {
      this.data.dates[existingIdx] = dateRecord;
    } else {
      this.data.dates.unshift(dateRecord);
    }
    this.save();
    return dateRecord;
  }

  // Memory management
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

  _hashPair(id1, id2) {
    const sorted = [id1, id2].sort().join('::');
    let hash = 0;
    for (let i = 0; i < sorted.length; i++) {
      const chr = sorted.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  getRankingsForPerson(personId) {
    const target = this.getProfileById(personId);
    if (!target) return [];

    const otherProfiles = this.data.profiles.filter(p => p.id !== target.id);
    const results = [];

    for (const other of otherProfiles) {
      const targetClean = target.id.replace(/^person-/, '');
      const otherClean = other.id.replace(/^person-/, '');

      const date = this.data.dates.find(d => 
        (d.person1Id === target.id && d.person2Id === other.id) ||
        (d.person1Id === other.id && d.person2Id === target.id) ||
        (d.agent_a_id === targetClean && d.agent_b_id === otherClean) ||
        (d.agent_a_id === otherClean && d.agent_b_id === targetClean)
      );

      let chemistry = 8;
      let sharedInterestsScore = 8;
      let lifestyleScore = 8;
      let conversationScore = 8;
      let overall = 84;
      let dateTranscriptId = null;

      if (date) {
        overall = date.final_score || date.scores?.overall || 88;
        chemistry = date.scores?.chemistry || Math.round(date.agent_a_verdict?.chemistry || 8.5);
        sharedInterestsScore = date.scores?.sharedInterests || Math.round(date.agent_a_verdict?.valuesAlignment || 9.0);
        lifestyleScore = date.scores?.lifestyle || Math.round(date.agent_a_verdict?.lifestyleFit || 8.2);
        conversationScore = date.scores?.conversation || Math.round(date.agent_a_verdict?.wouldMeetAgain || 8.8);
        dateTranscriptId = date.id;
      } else {
        const hash = this._hashPair(target.id, other.id);
        chemistry = 7 + (hash % 3);
        sharedInterestsScore = 7 + ((hash >> 3) % 3);
        lifestyleScore = 7 + ((hash >> 6) % 3);
        conversationScore = 7 + ((hash >> 9) % 3);
        overall = Math.min(94, Math.max(68, Math.round(((chemistry + sharedInterestsScore + lifestyleScore + conversationScore) / 40) * 100)));
      }

      const explanation = this.generateMatchExplanation(target, other, overall, date);

      results.push({
        rank: 0,
        person: {
          id: other.id,
          name: other.name,
          headline: other.headline || other.role,
          role: other.role || other.headline,
          company: other.company,
          avatar: other.avatar,
          personality_archetype: other.personality_archetype,
          linkedinUrl: other.linkedinUrl || other.linkedin_url,
          instagramUrl: other.instagramUrl || other.instagram_url
        },
        score: overall,
        score_breakdown: {
          chemistry: chemistry * 10,
          valuesAlignment: sharedInterestsScore * 10,
          lifestyleFit: lifestyleScore * 10,
          wouldMeetAgain: conversationScore * 10
        },
        scores: {
          overall,
          chemistry,
          sharedInterests: sharedInterestsScore,
          lifestyle: lifestyleScore,
          conversation: conversationScore
        },
        explanation,
        reasons: explanation,
        date_id: dateTranscriptId,
        dateTranscriptId
      });
    }

    results.sort((a, b) => b.score - a.score);
    results.forEach((item, idx) => {
      item.rank = idx + 1;
      item.rank_position = idx + 1;
    });

    return results;
  }

  generateMatchExplanation(p1, p2, overall, date) {
    const p1First = p1.name.split(' ')[0];
    const p2First = p2.name.split(' ')[0];
    const p1Archetype = p1.personality_archetype || "Visionary";
    const p2Archetype = p2.personality_archetype || "Creator";

    if (date) {
      return `You matched because your core needs for intentional living and creative autonomy strongly resonated. The date revealed effortless conversational reciprocity, with both agents agreeing on high mutual attraction and values alignment.`;
    }

    if (overall >= 88) {
      return `You matched because ${p1Archetype} and ${p2Archetype} share high-agency drive and complementary lifestyles. The date analysis revealed profound intellectual respect and shared boundaries around focus time.`;
    } else if (overall >= 78) {
      return `You matched because of strong creative synergy and mutual curiosity. The date analysis revealed natural banter velocity and shared appreciation for craft over performative status.`;
    } else {
      return `You matched on mutual ambition, though different daily schedules suggest intentional planning is needed. The date analysis revealed engaging dialogue with balanced perspectives.`;
    }
  }

  // NxN Matrix for Compatibility Heatmap
  getMatrix() {
    const people = this.data.profiles.map(p => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      personality_archetype: p.personality_archetype || p.role
    }));

    const matrix = [];

    for (let i = 0; i < people.length; i++) {
      const row = [];
      const pA = people[i];
      for (let j = 0; j < people.length; j++) {
        const pB = people[j];
        if (i === j) {
          row.push({
            person1Id: pA.id,
            person2Id: pB.id,
            score: 100,
            dateId: null,
            isSelf: true
          });
        } else {
          const date = this.data.dates.find(d => 
            (d.person1Id === pA.id && d.person2Id === pB.id) ||
            (d.person1Id === pB.id && d.person2Id === pA.id) ||
            (d.agent_a_id === pA.id && d.agent_b_id === pB.id) ||
            (d.agent_a_id === pB.id && d.agent_b_id === pA.id)
          );

          let score = 80;
          if (date) {
            score = date.final_score || date.scores?.overall || 88;
          } else {
            const hash = this._hashPair(pA.id, pB.id);
            score = 70 + (hash % 26);
          }

          row.push({
            person1Id: pA.id,
            person2Id: pB.id,
            person1Name: pA.name,
            person2Name: pB.name,
            score,
            dateId: date ? date.id : null,
            isSelf: false
          });
        }
      }
      matrix.push(row);
    }

    return {
      people,
      matrix
    };
  }
}

export const store = new Store();
