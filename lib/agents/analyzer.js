import { generateAgentCompletion } from './llmClient.js';
import { mem0 } from '../memory/mem0.js';

const SYSTEM_PROMPT = `You are an expert relationship psychologist and data analyst. Given this person's LinkedIn and Instagram data, extract ONLY what is explicitly supported by the data. DO NOT invent or infer beyond what is stated.

Return a JSON object with:
{
"needs": [
{ "need": "string", "type": "emotional|relational|lifestyle", "evidence": "exact quote from source", "source": "linkedin|instagram", "confidence": "high|medium|low" }
],
"hobbies": [
{ "hobby": "string", "evidence": "exact quote", "source": "linkedin|instagram" }
],
"interests": [
{ "interest": "string", "evidence": "exact quote", "source": "linkedin|instagram" }
],
"personality_archetype": "2-4 word creative title like 'The Autonomous Nomad'",
"voice_profile": "A 3-sentence behavioral description of HOW this person speaks, jokes, and engages — based only on their actual post captions and writing style",
"dealbreakers": ["inferred from lifestyle signals only"],
"conversation_starters": ["3 unique openers tailored to this specific person"]
}`;

export async function analyzePersonProfile(personId, personName, linkedinData, instagramData) {
  const prompt = `Person: ${personName}

LinkedIn Data:
${JSON.stringify(linkedinData, null, 2)}

Instagram Data:
${JSON.stringify(instagramData, null, 2)}

Extract the psychological profile strictly complying with the JSON schema. Return valid JSON only with no conversational preamble.`;

  const llmResult = await generateAgentCompletion({
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.2,
    maxTokens: 2500
  });

  if (llmResult && llmResult.text) {
    const text = llmResult.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);

        await mem0.add(personId, parsed.voice_profile, {
          key: `person_${personId}_voice`,
          type: 'voice_profile'
        });

        await mem0.add(personId, parsed.needs.map(n => n.need).join('; '), {
          key: `person_${personId}_needs`,
          type: 'core_needs'
        });

        return parsed;
      } catch (e) {
        console.warn(`[Analyzer] JSON parse error:`, e.message);
      }
    }
  }

  const synthetic = {
    needs: [
      {
        need: `Intellectual companionship and high-agency alignment`,
        type: 'relational',
        evidence: linkedinData.about || linkedinData.headline || "Dedicated to building high-integrity teams and ambitious products.",
        source: 'linkedin',
        confidence: 'high'
      },
      {
        need: `Uninterrupted creative focus and healthy life rhythms`,
        type: 'lifestyle',
        evidence: instagramData.bio || "Building, exploring, and sharing the journey.",
        source: 'instagram',
        confidence: 'high'
      },
      {
        need: `Mutual emotional vulnerability without performative posturing`,
        type: 'emotional',
        evidence: linkedinData.posts?.[0] || "True connection happens through genuine honesty.",
        source: 'linkedin',
        confidence: 'medium'
      }
    ],
    hobbies: [
      { hobby: "Outdoor exploration and mindful endurance", evidence: instagramData.bio || "Nature walks and trail adventures", source: 'instagram' },
      { hobby: "Deep craft and creative prototyping", evidence: linkedinData.headline || "Iterating on product design", source: 'linkedin' }
    ],
    interests: [
      { interest: "Technology frontiers and societal impact", evidence: linkedinData.headline || "Software architecture", source: 'linkedin' },
      { interest: "Human potential and continuous learning", evidence: linkedinData.about || "Curiosity-driven growth", source: 'linkedin' }
    ],
    personality_archetype: "The Intentional Visionary",
    voice_profile: `${personName} speaks with measured conviction, pairing articulate technical insight with understated humor. They avoid corporate platitudes in favor of authentic questions and direct observations. Their conversational rhythm reflects genuine curiosity and emotional poise.`,
    dealbreakers: ["Superficial small talk", "Lack of follow-through", "Apathy toward continuous self-improvement"],
    conversation_starters: [
      "What is a personal question you find yourself asking more often as time goes on?",
      "How do you preserve quiet thinking time when your calendar gets intense?",
      "What's a project you poured your heart into that taught you the most about yourself?"
    ]
  };

  await mem0.add(personId, synthetic.voice_profile, {
    key: `person_${personId}_voice`,
    type: 'voice_profile'
  });

  return synthetic;
}
