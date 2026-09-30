import Anthropic from '@anthropic-ai/sdk';
import { mem0 } from '../memory/mem0';

/**
 * Multi-turn Autonomous Dating Engine
 * Implements 4 stages: Opening -> Exploring -> Deepening -> Decision
 * Extracts spoken dialogue and [THOUGHT] inner monologue
 * Computes per-turn chemistry (0-100) and saves facts to Mem0
 */

export interface DateTurn {
  turn: number;
  stage: 'Opening' | 'Exploring' | 'Deepening' | 'Decision';
  speaker: string;
  speakerId: string;
  avatar: string;
  dialogue: string;
  thought: string;
  chemistryScore: number;
}

export interface DateScenario {
  id: string;
  name: string;
  location: string;
  ambience: string;
  description: string;
}

export const SCENARIOS: Record<string, DateScenario> = {
  coffee_chat: {
    id: 'coffee_chat',
    name: 'Artisanal Pour-Over Coffee Chat',
    location: 'Soma Espresso Bar, San Francisco',
    ambience: 'Warm walnut wood counters, vintage jazz vinyl on turntable, aroma of light Ethiopian roast',
    description: 'An intimate, low-pressure coffee tasting where two busy thinkers slow down and speak without screens.'
  },
  gallery_walk: {
    id: 'gallery_walk',
    name: 'Contemporary Art Gallery Walk',
    location: 'Chelsea Gallery District, New York',
    ambience: 'Dramatic soaring ceilings, diffuse natural skylight, quiet concrete corridors, provocative kinetic sculptures',
    description: 'A stroll through expansive gallery rooms where art pieces prompt spontaneous philosophical tangents.'
  },
  rooftop_dinner: {
    id: 'rooftop_dinner',
    name: 'Sunset Skyline Rooftop Dinner',
    location: 'Skyline Terrace, Austin',
    ambience: 'Golden hour shifting to electric twilight, candlelit bistro tables, acoustic melodies, warm southern breeze',
    description: 'A relaxed outdoor dinner under the open sky overlooking city lights with artisanal small plates.'
  },
  bookshop_browse: {
    id: 'bookshop_browse',
    name: 'Independent Bookshop Browse',
    location: 'City Lights Booksellers, North Beach',
    ambience: 'Creaking wooden floorboards, floor-to-ceiling poetry anthologies, quiet reading alcoves, warm shaded lamps',
    description: 'Exploring shelves together, pulling favorite dog-eared paperbacks to share formative passages.'
  },
  farmers_market: {
    id: 'farmers_market',
    name: 'Sunday Organic Farmers Market',
    location: 'Ferry Building Organic Plaza',
    ambience: 'Warm sourdough loaves, vibrant heirloom citrus, cool salty breeze from the bay, lively acoustic buskers',
    description: 'Wandering through bustling open-air market stalls, tasting artisan honey, and enjoying unhurried morning air.'
  }
};

export function getStageForTurn(turn: number): 'Opening' | 'Exploring' | 'Deepening' | 'Decision' {
  if (turn <= 2) return 'Opening';
  if (turn <= 4) return 'Exploring';
  if (turn <= 6) return 'Deepening';
  return 'Decision';
}

export function computeTurnChemistry(
  dialogue: string,
  thought: string,
  personA: any,
  personB: any,
  turnIndex: number
): number {
  let score = 70 + (turnIndex * 3);

  const sharedInterests = (personA.interests || []).filter((i: any) => 
    (personB.interests || []).some((oi: any) => 
      (typeof i === 'string' ? i : i.interest).toLowerCase() === (typeof oi === 'string' ? oi : oi.interest).toLowerCase()
    )
  );
  score += sharedInterests.length * 4;

  if (dialogue.includes('?')) score += 3;
  if (/laugh|smile|love|fascinating|completely agree|resonate|peace/i.test(dialogue)) score += 4;
  if (/genuine|aligned|10\/10|safe|warm/i.test(thought)) score += 5;
  if (/awkward|stiff|disagree|superficial/i.test(thought)) score -= 6;

  return Math.min(98, Math.max(50, score));
}

export async function advanceDateTurn(
  turnNumber: number,
  personA: any,
  personB: any,
  scenarioKey: string,
  priorTurns: DateTurn[] = []
): Promise<DateTurn> {
  const activePerson = turnNumber % 2 === 1 ? personA : personB;
  const otherPerson = turnNumber % 2 === 1 ? personB : personA;
  const stage = getStageForTurn(turnNumber);
  const scenario = SCENARIOS[scenarioKey] || SCENARIOS.coffee_chat;

  // 1. Load active agent's voice profile and memories from Mem0
  const voiceMem = await mem0.recall(activePerson.id, `person_${activePerson.id}_voice`);
  const voiceProfile = voiceMem[0]?.value || activePerson.voice_profile || activePerson.voicePersona?.styleSummary || "Speaks with genuine passion and articulacy.";

  // 2. Load memories between this pair from Mem0
  const pairMemories = await mem0.getPairMemories(activePerson.id, otherPerson.id);
  const memoryContext = pairMemories.map(m => m.value).slice(-4).join('\n');

  const needsList = (activePerson.needs || []).map((n: any) => typeof n === 'string' ? n : n.need).join('; ');

  const systemPrompt = `System: You ARE ${activePerson.name}. Here is how you speak and think: ${voiceProfile}.
You are on a date with ${otherPerson.name} at ${scenario.name} in ${scenario.location} (${scenario.ambience}).
You have these core needs: ${needsList}.

Rules:
- Speak EXACTLY as this person would based on their writing style
- Reference real interests naturally in conversation (don't force it)
- Ask one genuine question per turn
- Share something real about yourself per turn
- Keep response under 120 words
- End with your PRIVATE THOUGHT (2 sentences, what you're actually thinking about this date) prefixed with [THOUGHT]:`;

  const priorTranscript = priorTurns.map(t => `${t.speaker}: ${t.dialogue}`).join('\n\n');
  const userPrompt = `Current Stage: ${stage} (Turn ${turnNumber} of 8).
Past conversation so far:
${priorTranscript || '(Date just began)'}

${memoryContext ? `What you recall from past encounters: ${memoryContext}` : ''}

It is now your turn to respond to ${otherPerson.name}. Remember to end with [THOUGHT]: your 2-sentence private thought.`;

  let spokenDialogue = '';
  let privateThought = '';

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const resp = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 350,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      const text = resp.content[0]?.type === 'text' ? resp.content[0].text : '';
      if (text.includes('[THOUGHT]:')) {
        const parts = text.split('[THOUGHT]:');
        spokenDialogue = parts[0].trim();
        privateThought = `[THOUGHT]: ${parts[1].trim()}`;
      } else {
        spokenDialogue = text.trim();
        privateThought = `[THOUGHT]: I'm enjoying the rhythm of this exchange. They have an intriguing presence.`;
      }
    } catch (err) {
      console.warn(`[DatingEngine] Claude API call failed for turn ${turnNumber}, using dynamic generation:`, err);
    }
  }

  // Dynamic persona fallback
  if (!spokenDialogue) {
    const hobby = activePerson.hobbies?.[0]?.hobby || activePerson.interests?.[0]?.interest || "deep creative work";
    const otherInterest = otherPerson.interests?.[0]?.interest || "the future";

    if (stage === 'Opening') {
      spokenDialogue = `Hey ${otherPerson.name.split(' ')[0]}, wonderful to meet you here. I love that ${scenario.name.toLowerCase()} filters out the noise. I was just reflecting on how you approach ${otherInterest.toLowerCase()}. What was the highlight of your morning today?`;
      privateThought = `[THOUGHT]: They seem remarkably poised and present. It's refreshing when someone isn't glued to their phone.`;
    } else if (stage === 'Exploring') {
      spokenDialogue = `That really lands with me. For me, taking time for ${hobby.toLowerCase()} is non-negotiable—it keeps my compass true when everything else is moving at light speed. When you think about what gives you real peace outside of work, what immediately comes to mind?`;
      privateThought = `[THOUGHT]: We're moving past superficial pleasantries fast. Their conversational reciprocity is great.`;
    } else if (stage === 'Deepening') {
      spokenDialogue = `I hear you completely. The older I get, the more I realize that genuine connection is about emotional safety—knowing you can share the unpolished version of yourself and be met with understanding. Have you had to actively guard your energy against performative people?`;
      privateThought = `[THOUGHT]: There's a rare, resonant calm between us. I feel like they actually understand how I operate.`;
    } else {
      spokenDialogue = `I've really loved this conversation, ${otherPerson.name.split(' ')[0]}. It feels like we could talk for hours and barely scratch the surface. I'd love to see you again soon—maybe for an unhurried walk in nature without any screens. Would you be up for that?`;
      privateThought = `[THOUGHT]: 10/10. Zero hesitation. High agency, warm emotional tone, and real alignment. I definitely want to meet again.`;
    }
  }

  // 5. Store key facts revealed in Mem0
  const revealedFact = `${activePerson.name} shared thoughts on ${stage.toLowerCase()} values with ${otherPerson.name}`;
  await mem0.add(activePerson.id, revealedFact, {
    partnerId: otherPerson.id,
    stage,
    turn: turnNumber
  });

  // 6. Compute turn chemistry score (0-100)
  const chemistryScore = computeTurnChemistry(spokenDialogue, privateThought, activePerson, otherPerson, turnNumber);

  return {
    turn: turnNumber,
    stage,
    speaker: activePerson.name,
    speakerId: activePerson.id,
    avatar: activePerson.avatar || activePerson.profile_photo || '',
    dialogue: spokenDialogue,
    thought: privateThought,
    chemistryScore
  };
}
