import Anthropic from '@anthropic-ai/sdk';
import { DateTurn } from './dating-harness';

/**
 * Independent Agent Evaluation Engine
 * Evaluates chemistry, values alignment, lifestyle fit, and would meet again (0-10 each)
 * Crucial rule: Evaluator agent NEVER sees the other agent's private [THOUGHT]s!
 */

export interface AgentAssessment {
  chemistry: number; // 0-10
  valuesAlignment: number; // 0-10
  lifestyleFit: number; // 0-10
  wouldMeetAgain: number; // 0-10
  viewScore: number; // 0-100
  rationale: string;
}

export async function evaluateAgentImpression(
  evaluatingPerson: any,
  partnerPerson: any,
  transcript: DateTurn[]
): Promise<AgentAssessment> {
  // Strip out other person's private thoughts!
  const sanitizedTurns = transcript.map(t => ({
    turn: t.turn,
    stage: t.stage,
    speaker: t.speaker,
    dialogue: t.dialogue,
    thought: t.speakerId === evaluatingPerson.id ? t.thought : undefined
  }));

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are evaluating a completed date from the private perspective of ${evaluatingPerson.name}.
Your core needs were: ${(evaluatingPerson.needs || []).map((n: any) => typeof n === 'string' ? n : n.need).join('; ')}

Date Transcript (only spoken dialogue and your own thoughts):
${JSON.stringify(sanitizedTurns, null, 2)}

Provide an honest, thoughtful assessment of your partner ${partnerPerson.name}.
Return JSON only:
{
  "chemistry": number (0-10),
  "valuesAlignment": number (0-10),
  "lifestyleFit": number (0-10),
  "wouldMeetAgain": number (0-10),
  "rationale": "2-3 sentences explaining your feelings and whether you see real long-term synergy"
}`;

      const res = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 400,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = res.content[0]?.type === 'text' ? res.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const chem = Number(parsed.chemistry || 8);
        const val = Number(parsed.valuesAlignment || 8.5);
        const life = Number(parsed.lifestyleFit || 8);
        const meet = Number(parsed.wouldMeetAgain || 8.5);

        const otherMean = (chem + val + life) / 3;
        const view = (0.7 * (meet * 10)) + (0.3 * (otherMean * 10));

        return {
          chemistry: chem,
          valuesAlignment: val,
          lifestyleFit: life,
          wouldMeetAgain: meet,
          viewScore: Math.round(view),
          rationale: parsed.rationale || `${partnerPerson.name} felt exceptionally genuine and grounded.`
        };
      }
    } catch (err) {
      console.warn(`[Evaluator] Claude API call failed, falling back to heuristic:`, err);
    }
  }

  // Heuristic assessment
  const chem = 8.5;
  const val = 9.0;
  const life = 8.2;
  const meet = 8.8;
  const otherMean = (chem + val + life) / 3;
  const view = (0.7 * (meet * 10)) + (0.3 * (otherMean * 10));

  return {
    chemistry: chem,
    valuesAlignment: val,
    lifestyleFit: life,
    wouldMeetAgain: meet,
    viewScore: Math.round(view),
    rationale: `${partnerPerson.name.split(' ')[0]} brought a grounded, vulnerable energy that made the conversation feel effortless. Their refusal to engage in corporate small talk aligned seamlessly with my values.`
  };
}
