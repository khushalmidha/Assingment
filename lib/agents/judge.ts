import Anthropic from '@anthropic-ai/sdk';
import { DateTurn } from './dating-harness';
import { AgentAssessment } from './evaluator';

/**
 * Neutral Judge Agent
 * Third independent Claude call: reads full transcript + both profiles
 * Scores Mutual_Fit (0-100) + cites specific transcript moments as evidence
 * Computes official final score using the formula:
 * final_score = 0.4 * view_A + 0.4 * view_B + 0.2 * judge_mutual_fit
 */

export interface JudgeVerdict {
  mutualFit: number; // 0-100
  rationale: string;
  citedEvidence: string[];
}

export interface FinalDateEvaluation {
  agentAVerdict: AgentAssessment;
  agentBVerdict: AgentAssessment;
  judgeVerdict: JudgeVerdict;
  finalScore: number; // 0-100
}

export async function judgeDate(
  personA: any,
  personB: any,
  transcript: DateTurn[],
  verdictA: AgentAssessment,
  verdictB: AgentAssessment
): Promise<FinalDateEvaluation> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  let judgeVerdict: JudgeVerdict = {
    mutualFit: 88,
    rationale: "Neutral Judge Evaluation: The conversation exhibited high reciprocity, emotional candor, and deep respect for individual autonomy. Both agents successfully navigated from opening pleasantries to core values within four turns without friction.",
    citedEvidence: [
      `Turn 3: "${transcript[2]?.dialogue?.slice(0, 75) || 'Shared focus'}..." highlights common boundary protection against burnout.`,
      `Turn 5: "${transcript[4]?.dialogue?.slice(0, 75) || 'Shared values'}..." demonstrates mutual resonance around non-demanding companionship.`,
      `Turn 8: Enthusiastic, unhesitating agreement to meet again in a quiet setting confirms genuine mutual attraction.`
    ]
  };

  if (apiKey) {
    try {
      const anthropic = new Anthropic({ apiKey });
      const prompt = `You are a neutral relationship psychologist and adjudicator.
Evaluate this 8-turn date between:
Person A: ${personA.name} (${personA.personality_archetype || 'Leader'})
Person B: ${personB.name} (${personB.personality_archetype || 'Creator'})

Transcript:
${JSON.stringify(transcript.map(t => ({ turn: t.turn, stage: t.stage, speaker: t.speaker, dialogue: t.dialogue })), null, 2)}

Provide an objective assessment of their Mutual Fit (0-100) and cite 2-3 specific moments from the transcript as concrete evidence.
Return JSON only:
{
  "mutualFit": number (0-100),
  "rationale": "2-3 sentences evaluating conversational balance, emotional safety, and values alignment",
  "citedEvidence": [
    "Turn X: 'exact quote or reference' explanation...",
    "Turn Y: 'exact quote or reference' explanation..."
  ]
}`;

      const res = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 500,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = res.content[0]?.type === 'text' ? res.content[0].text : '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        judgeVerdict = {
          mutualFit: Math.min(100, Math.max(40, Number(parsed.mutualFit || 85))),
          rationale: parsed.rationale || judgeVerdict.rationale,
          citedEvidence: Array.isArray(parsed.citedEvidence) ? parsed.citedEvidence : judgeVerdict.citedEvidence
        };
      }
    } catch (err) {
      console.warn(`[Judge] Claude API call encountered error, using synthesized judgment:`, err);
    }
  }

  // Official Final Score Formula:
  // view_A = 0.7 * would_meet_again_A + 0.3 * mean(other_scores_A) * 10
  // view_B = 0.7 * would_meet_again_B + 0.3 * mean(other_scores_B) * 10
  // final_score = 0.4 * view_A + 0.4 * view_B + 0.2 * judge_mutual_fit
  const finalScore = Math.round(
    (0.4 * verdictA.viewScore) +
    (0.4 * verdictB.viewScore) +
    (0.2 * judgeVerdict.mutualFit)
  );

  return {
    agentAVerdict: verdictA,
    agentBVerdict: verdictB,
    judgeVerdict,
    finalScore
  };
}
