import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEED_FILE = path.resolve(__dirname, '../../../data/initial_people.json');
const DB_FILE = path.resolve(__dirname, '../../../data/db.json');

console.log('🌱 Starting database seed for Agentic Dating System...');

if (fs.existsSync(SEED_FILE)) {
  const raw = fs.readFileSync(SEED_FILE, 'utf-8');
  const people = JSON.parse(raw);
  
  store.data.profiles = people;
  store.seedInitialDates();
  store.save();

  console.log(`✅ Successfully seeded ${people.length} public figures with LinkedIn/Instagram profiles and Claude analyses!`);
  console.log(`✅ Generated ${store.getDates().length} multi-turn simulated dates with MCP logs and Mem0 memories.`);
  console.log(`📁 Database saved to: ${DB_FILE}`);
} else {
  console.error(`❌ Seed file not found at: ${SEED_FILE}`);
}
