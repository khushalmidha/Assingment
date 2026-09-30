/**
 * Unified LLM Client supporting both Claude and Google Gemini.
 * Priority:
 * 1. ANTHROPIC_API_KEY (Claude Sonnet)
 * 2. GEMINI_API_KEY or GOOGLE_API_KEY (Gemini 2.0 Flash / 1.5 Flash)
 */
export async function generateAgentCompletion({ system, prompt, temperature = 0.7, maxTokens = 500 }) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // 1. Try Claude if ANTHROPIC_API_KEY is available
  if (anthropicKey && anthropicKey.startsWith('sk-ant-')) {
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const resp = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [{ role: 'user', content: prompt }]
      });
      const text = resp.content?.[0]?.type === 'text' ? resp.content[0].text : '';
      if (text) {
        return { text, provider: 'claude', model: 'claude-3-7-sonnet' };
      }
    } catch (err) {
      console.warn('[LLM Client] Anthropic call failed, checking Gemini fallback:', err.message);
    }
  }

  // 2. Try Gemini if GEMINI_API_KEY or GOOGLE_API_KEY is available
  if (geminiKey) {
    try {
      // Try gemini-2.0-flash first, fallback to gemini-1.5-flash
      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
          const body = {
            systemInstruction: system ? { parts: [{ text: system }] } : undefined,
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens
            }
          };

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (!res.ok) {
            const errText = await res.text();
            console.warn(`[LLM Client] Gemini model ${model} HTTP ${res.status}:`, errText.slice(0, 150));
            continue;
          }

          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return { text: text.trim(), provider: 'gemini', model };
          }
        } catch (innerErr) {
          console.warn(`[LLM Client] Gemini ${model} error:`, innerErr.message);
        }
      }
    } catch (err) {
      console.warn('[LLM Client] Gemini call failed:', err.message);
    }
  }

  return null;
}

/**
 * Returns which LLM provider is currently active
 */
export function getActiveLLMProvider() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (anthropicKey && anthropicKey.startsWith('sk-ant-')) {
    return { provider: 'claude', model: 'claude-3-7-sonnet', ready: true };
  }
  if (geminiKey) {
    return { provider: 'gemini', model: 'gemini-2.0-flash', ready: true };
  }
  return { provider: 'precomputed-harness', model: 'autonomous-engine', ready: true };
}
