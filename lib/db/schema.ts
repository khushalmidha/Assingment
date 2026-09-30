import { pgTable, text, timestamp, jsonb, integer, real, uuid } from 'drizzle-orm/pg-core';

/**
 * PostgreSQL / Supabase Schema for Agentic Dating System (Drizzle ORM)
 */

export const people = pgTable('people', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  linkedin_url: text('linkedin_url').notNull(),
  instagram_url: text('instagram_url').notNull(),
  profile_photo: text('profile_photo'),
  role: text('role'),
  location: text('location'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  person_id: text('person_id').references(() => people.id).notNull(),
  needs: jsonb('needs').notNull(), // [{ need: string, type: string, evidence: string, source: string, confidence: string }]
  hobbies: jsonb('hobbies').notNull(), // [{ hobby: string, evidence: string, source: string }]
  interests: jsonb('interests').notNull(), // [{ interest: string, evidence: string, source: string }]
  personality_archetype: text('personality_archetype').notNull(), // e.g. "The Autonomous Nomad"
  voice_prompt: text('voice_prompt').notNull(), // 3-sentence behavioral description
  evidence: jsonb('evidence').notNull(), // jsonb array with source tags
  dealbreakers: jsonb('dealbreakers'),
  conversation_starters: jsonb('conversation_starters'),
  status: text('status').default('ready').notNull(), // 'pending' | 'ready'
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

export const dates = pgTable('dates', {
  id: text('id').primaryKey(),
  agent_a_id: text('agent_a_id').references(() => people.id).notNull(),
  agent_b_id: text('agent_b_id').references(() => people.id).notNull(),
  scenario: text('scenario').notNull(), // 'coffee_chat' | 'gallery_walk' | 'rooftop_dinner' | 'bookshop_browse' | 'farmers_market'
  transcript: jsonb('transcript').notNull(), // 8 turns with dialogue & [THOUGHT]
  chemistry_scores: jsonb('chemistry_scores').notNull(), // array of 0-100 per turn
  agent_a_verdict: jsonb('agent_a_verdict'), // chemistry, valuesAlignment, lifestyleFit, wouldMeetAgain, rationale
  agent_b_verdict: jsonb('agent_b_verdict'), // chemistry, valuesAlignment, lifestyleFit, wouldMeetAgain, rationale
  judge_verdict: jsonb('judge_verdict'), // mutualFit, citedEvidence, rationale
  final_score: integer('final_score').notNull(), // 0-100 calculated by standard formula
  status: text('status').default('completed').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  person_id: text('person_id').references(() => people.id).notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export const rankings = pgTable('rankings', {
  id: text('id').primaryKey(),
  person_id: text('person_id').references(() => people.id).notNull(),
  ranked_person_id: text('ranked_person_id').references(() => people.id).notNull(),
  score: integer('score').notNull(),
  score_breakdown: jsonb('score_breakdown').notNull(), // chemistry, values, lifestyle, wouldMeetAgain
  explanation: text('explanation').notNull(), // 2-sentence match explanation
  rank_position: integer('rank_position').notNull(),
  date_id: text('date_id').references(() => dates.id)
});
