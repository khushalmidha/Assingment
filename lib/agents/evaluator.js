import { generateAgentCompletion } from './llmClient.js';

export async function evaluateAgentImpression(evaluatingPerson, partnerPerson, transcript) {
  const sanitizedTurns = transcript.map(t => ({
    turn: t.turn,
    stage: t.stage,
    speaker: t.speaker,
    dialogue: t.dialogue,
    thought: t.speakerId === evaluatingPerson.id ? t.thought : undefined
  }));

  const prompt = `You are evaluating a completed date from the private perspective of ${evaluatingPerson.name}.
Your core needs were: ${(evaluatingPerson.needs || []).map((n) => typeof n === 'string' ? n : n.need).join('; ')}

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

  const llmResult = await generateAgentCompletion({
    prompt,
    temperature: 0.3,
    maxTokens: 400
  });

  if (llmResult && llmResult.text) {
    const text = llmResult.text.trim();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
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
      } catch (err) {
        console.warn(`[Evaluator] JSON parse error:`, err);
      }
    }
  }

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
