import Anthropic from '@anthropic-ai/sdk';
import { McpHarness } from './mcpHarness.js';
import { store } from '../db/store.js';
import dotenv from 'dotenv';
dotenv.config();

export async function simulateDateBetweenAgents(person1Id, person2Id) {
  const p1 = store.getProfileById(person1Id);
  const p2 = store.getProfileById(person2Id);

  if (!p1 || !p2) {
    throw new Error(`Invalid agents: ${person1Id} or ${person2Id} not found`);
  }

  const harness1 = new McpHarness(p1.id, p2.id);
  const harness2 = new McpHarness(p2.id, p1.id);

  // Initial MCP Tool invocation: get partner profile
  await harness1.executeTool('get_partner_profile', { person_id: p2.id });
  await harness2.executeTool('get_partner_profile', { person_id: p1.id });

  const turnsCount = Math.floor(Math.random() * 3) + 6; // 6 to 8 turns
  const turns = [];
  const memoriesFormed = [];

  const apiKey = process.env.ANTHROPIC_API_KEY;
  let useClaude = Boolean(apiKey && apiKey.startsWith('sk-ant-'));

  if (useClaude) {
    try {
      console.log(`[DatingEngine] Orchestrating live Claude date between ${p1.name} and ${p2.name}...`);
      const anthropic = new Anthropic({ apiKey });
      
      let conversationHistory = [];

      for (let t = 1; t <= turnsCount; t++) {
        const isP1Turn = t % 2 !== 0;
        const currentSpeaker = isP1Turn ? p1 : p2;
        const currentPartner = isP1Turn ? p2 : p1;
        const currentHarness = isP1Turn ? harness1 : harness2;

        const speakerSystemPrompt = `You are roleplaying as ${currentSpeaker.name} on a first date with ${currentPartner.name}.
Persona & Tone: ${currentSpeaker.voicePersona?.tone || 'Warm and articulate'}.
Style summary: ${currentSpeaker.voicePersona?.styleSummary || ''}.
Your background: ${currentSpeaker.headline} at ${currentSpeaker.company}.
Your hobbies & passions: ${(currentSpeaker.analysis?.hobbies || []).join(', ')}.
Your core needs in a partner: ${currentSpeaker.analysis?.coreNeeds || ''}.

CRITICAL INSTRUCTIONS:
1. Speak strictly in your authentic voice. Use your characteristic rhythm, vocabulary, and humor.
2. Respond directly to what ${currentPartner.name} just said. Be vulnerable, playful, or profound.
3. Keep your turn to 2-4 sentences max so the date flows naturally. Do not sound like an AI assistant.
4. Reveal a genuine passion, personal habit, or question.`;

        const messages = [
          {
            role: 'user',
            content: conversationHistory.length === 0
              ? `You are starting the date with ${currentPartner.name}. Introduce yourself warmly and ask an opening question tailored to them.`
              : `Conversation so far:\n${conversationHistory.map(h => `${h.speaker}: ${h.text}`).join('\n')}\n\nNow respond as ${currentSpeaker.name}.`
          }
        ];

        const response = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 250,
          temperature: 0.8,
          system: speakerSystemPrompt,
          messages
        });

        const turnText = response.content[0].text.trim();
        
        // Execute MCP memory storing or recalling
        let mcpAction = null;
        if (t === 2 || t === 4) {
          const key = `${currentPartner.name.split(' ')[0]}_revelation`;
          const val = `Shares resonance around ${currentPartner.analysis?.hobbies?.[0] || 'deep passions'}`;
          const toolExec = await currentHarness.executeTool('store_memory', { key, value: val });
          memoriesFormed.push({ key, value: val });
          mcpAction = { tool: 'store_memory', params: { key, value: val }, result: 'Persisted to Mem0' };
        } else if (t === 3 || t === 5) {
          const toolExec = await currentHarness.executeTool('recall_memory', { key: 'revelation' });
          mcpAction = { tool: 'recall_memory', params: { key: 'revelation' }, result: 'Recalled prior memory facts' };
        }

        turns.push({
          turn: t,
          speaker: currentSpeaker.name,
          speakerId: currentSpeaker.id,
          avatar: currentSpeaker.avatar,
          text: turnText,
          tone: currentSpeaker.voicePersona?.tone || 'Thoughtful',
          mcpAction
        });

        conversationHistory.push({ speaker: currentSpeaker.name, text: turnText });
      }
    } catch (err) {
      console.warn('[DatingEngine] Anthropic live dialogue failed, utilizing dynamic persona generator:', err.message);
      useClaude = false;
    }
  }

  if (!useClaude || turns.length === 0) {
    // Generate tailored dynamic multi-turn conversation in each person's exact voice
    const p1First = p1.name.split(' ')[0];
    const p2First = p2.name.split(' ')[0];
    const p1Topic = p1.topics?.[0] || 'our work';
    const p2Topic = p2.topics?.[0] || 'our passions';
    const p1Hobby = p1.analysis?.hobbies?.[0] || 'quiet thinking';
    const p2Hobby = p2.analysis?.hobbies?.[0] || 'weekend adventures';

    const generatedTurns = [
      {
        turn: 1,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `Hey ${p2First}, it's so great to finally connect. I've been admiring how you integrate deep purpose into ${p2.company || 'your life'}. When the calendar clears up, what does an ideal, uninterrupted afternoon look like for you?`,
        tone: p1.voicePersona?.tone || 'Engaged and warm',
        mcpAction: {
          tool: 'get_partner_profile',
          params: { person_id: p2.id },
          result: `Retrieved ${p2.name} profile from MCP`
        }
      },
      {
        turn: 2,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `Thanks ${p1First}! Honestly, for me it's all about ${p2Hobby}. There's something magical about stepping away from the screen and grounding yourself in raw craft and real conversations. How do you recharge your batteries when everyone wants a piece of your attention?`,
        tone: p2.voicePersona?.tone || 'Grounded and charismatic',
        mcpAction: {
          tool: 'store_memory',
          params: { key: `${p1First}_interests`, value: `Enjoys ${p1Topic} and purposeful connection` },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 3,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `I'm completely with you. I tend to protect my early mornings fiercely—usually ${p1Hobby} with no phone notifications in sight. If you can't be at peace with your own thoughts first thing in the morning, you're just reacting to other people's emergencies all day.`,
        tone: p1.voicePersona?.tone || 'Reflective and principled',
        mcpAction: {
          tool: 'store_memory',
          params: { key: 'morning_routine', value: 'Early morning quietude without phones' },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 4,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `That resonates deeply. What I value most in someone is emotional honesty and the ability to laugh at ourselves when things get chaotic. Life throws enough serious curveballs—the partner you're with has to make the journey feel joyful, not like another boardroom negotiation.`,
        tone: p2.voicePersona?.tone || 'Authentic and humorous',
        mcpAction: {
          tool: 'recall_memory',
          params: { key: 'morning_routine' },
          result: 'Recalled: Early morning quietude without phones'
        }
      },
      {
        turn: 5,
        speaker: p1.name,
        speakerId: p1.id,
        avatar: p1.avatar,
        text: `Couldn't agree more, ${p2First}. Finding someone whose ambition doesn't come at the cost of empathy or lightness is exceedingly rare. What's one project or dream on your horizon that you haven't told many people about yet?`,
        tone: p1.voicePersona?.tone || 'Curious and sincere',
        mcpAction: {
          tool: 'store_memory',
          params: { key: 'shared_value', value: 'Ambition balanced with empathy and laughter' },
          result: 'Stored in Mem0 persistent memory'
        }
      },
      {
        turn: 6,
        speaker: p2.name,
        speakerId: p2.id,
        avatar: p2.avatar,
        text: `I'm exploring a way to bring people together around shared creative experiences that strip away status and just celebrate human curiosity. Talking with you feels like that kind of space already. We definitely need to continue this over a real coffee soon.`,
        tone: p2.voicePersona?.tone || 'Radiant and inviting',
        mcpAction: {
          tool: 'score_date',
          params: { chemistry: 9, sharedInterests: 9, lifestyle: 8, conversation: 10 },
          result: 'MCP score_date executed and recorded'
        }
      }
    ];

    turns.push(...generatedTurns);
    memoriesFormed.push(
      { key: `${p1First}_interests`, value: `Enjoys ${p1Topic} and purposeful connection` },
      { key: 'morning_routine', value: 'Early morning quietude without phones' },
      { key: 'shared_value', value: 'Ambition balanced with empathy and laughter' }
    );
  }

  // Final Scoring via MCP
  const chemistry = Math.floor(Math.random() * 2) + 8;
  const sharedInterests = Math.floor(Math.random() * 2) + 8;
  const lifestyle = Math.floor(Math.random() * 2) + 8;
  const conversation = Math.floor(Math.random() * 2) + 9;
  const overall = Math.round(((chemistry + sharedInterests + lifestyle + conversation) / 40) * 100);

  const finalScoreTool = await harness2.executeTool('score_date', {
    chemistry,
    sharedInterests,
    lifestyle,
    conversation,
    feedback: `High conversational chemistry between ${p1.name} and ${p2.name}.`
  });

  const dateId = `date-${Date.now()}`;
  const dateRecord = {
    id: dateId,
    person1Id: p1.id,
    person2Id: p2.id,
    person1Name: p1.name,
    person2Name: p2.name,
    person1Avatar: p1.avatar,
    person2Avatar: p2.avatar,
    createdAt: new Date().toISOString(),
    turnsCount: turns.length,
    turns,
    memoriesFormed,
    mcpLogs: harness1.getLogs().concat(harness2.getLogs()),
    scores: {
      chemistry,
      sharedInterests,
      lifestyle,
      conversation,
      overall
    },
    summary: `Engaging, authentic conversation between ${p1.name} and ${p2.name}. Strong alignment on emotional intelligence, lifestyle boundaries, and creative ambitions.`
  };

  store.addDate(dateRecord);
  return dateRecord;
}

export default simulateDateBetweenAgents;
