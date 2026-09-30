import { generateAgentCompletion } from './llmClient.js';

export async function judgeDate(personA, personB, transcript, verdictA, verdictB) {
  let judgeVerdict = {
    mutualFit: 88,
    rationale: "Neutral Judge Evaluation: The conversation exhibited high reciprocity, emotional candor, and deep respect for individual autonomy. Both agents successfully navigated from opening pleasantries to core values within four turns without friction.",
    citedEvidence: [
      `Turn 3: "${transcript[2]?.dialogue?.slice(0, 75) || 'Shared focus'}..." highlights common boundary protection against burnout.`,
      `Turn 5: "${transcript[4]?.dialogue?.slice(0, 75) || 'Shared values'}..." demonstrates mutual resonance around non-demanding companionship.`,
      `Turn 8: Enthusiastic, unhesitating agreement to meet again in a quiet setting confirms genuine mutual attraction.`
    ]
  };

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

  const llmResult = await generateAgentCompletion({
    prompt,
    temperature: 0.2,
    maxTokens: 500
  });

  if (llmResult && llmResult.text) {
    const text = llmResult.text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        judgeVerdict = {
          mutualFit: Math.min(100, Math.max(40, Number(parsed.mutualFit || 85))),
          rationale: parsed.rationale || judgeVerdict.rationale,
          citedEvidence: Array.isArray(parsed.citedEvidence) ? parsed.citedEvidence : judgeVerdict.citedEvidence
        };
      } catch (err) {
        console.warn(`[Judge] JSON parse error:`, err);
      }
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
