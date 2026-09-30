/**
 * Seed Script for Agentic Dating Database
 * 
 * Forces a fresh re-initialization of the database from initial_people.json,
 * generating all seeded dates and memories. Run with:
 *   node backend/src/db/seed.js
 * or
 *   npm run seed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../../data/db.json');
const SEED_PATH = path.resolve(__dirname, '../../../data/initial_people.json');

async function seed() {
  console.log('🌱 Starting database seed...');
  
  // Remove existing db.json to force fresh init
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
    console.log('  ✓ Removed existing db.json');
  }

  // Import store which will auto-seed from initial_people.json
  const { store } = await import('./store.js');
  
  console.log(`  ✓ Seeded ${store.getProfiles().length} profiles`);
  console.log(`  ✓ Generated ${store.getDates().length} pre-computed dates`);
  console.log(`  ✓ Database written to ${DB_PATH}`);
  console.log('✅ Seed complete!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
