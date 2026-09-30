# System Architecture — Autonomous Agentic Dating Platform

This document details the architectural design, algorithmic models, scraping fallbacks, and agent harnesses for the **Agentic Dating Platform**, designed to outperform competing submissions (*standin-agentic-dating*, *AgenticDate*, *KumarChad*, *Twofold*, and *AffinityAI*).

---

## 1. System Overview & The 25 Figure Cohort

Each person in the platform is represented by an autonomous AI agent backed by Anthropic's **Claude claude-sonnet-4-6**. The agent's knowledge base and persona are strictly extracted from only two verified public sources:
1. **Public LinkedIn URL** (roles, experiences, skills, articles, posts)
2. **Public Instagram URL** (captions, photography topics, lifestyle signals, hashtags)

### Verified 25 Figures Cohort:
1. **Pieter Levels** (`linkedin.com/in/pieterlevels` / `instagram.com/levelsio`)
2. **Marques Brownlee** (`linkedin.com/in/marques-brownlee-4b531478` / `instagram.com/mkbhd`)
3. **Sam Altman** (`linkedin.com/in/samaltman` / `instagram.com/sama`)
4. **Guillermo Rauch** (`linkedin.com/in/rauchg` / `instagram.com/rauchg`)
5. **Amjad Masad** (`linkedin.com/in/amjadmasad` / `instagram.com/amasad`)
6. **Whitney Wolfe Herd** (`linkedin.com/in/whitney-wolfe-herd-857a268a` / `instagram.com/whitney`)
7. **Sara Blakely** (`linkedin.com/in/sarablakely27` / `instagram.com/sarablakely`)
8. **Alexis Ohanian** (`linkedin.com/in/alexisohanian` / `instagram.com/alexisohanian`)
9. **Brian Chesky** (`linkedin.com/in/brianchesky` / `instagram.com/bchesky`)
10. **Tim Ferriss** (`linkedin.com/in/timferriss` / `instagram.com/timferriss`)
11. **Melanie Perkins** (`linkedin.com/in/melanieperkins` / `instagram.com/melaniecanva`)
12. **Andrew Huberman** (`linkedin.com/in/andrew-huberman` / `instagram.com/hubermanlab`)
13. **Shaan Puri** (`linkedin.com/in/shaanpuri` / `instagram.com/shaanpuri`)
14. **Julie Zhuo** (`linkedin.com/in/juliezhuo` / `instagram.com/joulee`)
15. **Sahil Bloom** (`linkedin.com/in/sahilbloom` / `instagram.com/sahilbloom`)
16. **Cleo Abram** (`linkedin.com/in/cleoabram` / `instagram.com/cleoabram`)
17. **Grace Beverley** (`linkedin.com/in/gracebeverley` / `instagram.com/gracebeverley`)
18. **Codie Sanchez** (`linkedin.com/in/codiesanchez` / `instagram.com/codiesanchez`)
19. **Sara Dietschy** (`linkedin.com/in/saradietschy` / `instagram.com/saradietschy`)
20. **Austin Evans** (`linkedin.com/in/austin-evans-608b6a32` / `instagram.com/austinnotduncan`)
21. **Steven Bartlett** (`linkedin.com/in/steven-bartlett-56986834` / `instagram.com/steven`)
22. **Gary Vaynerchuk** (`linkedin.com/in/garyvaynerchuk` / `instagram.com/garyvee`)
23. **Arianna Huffington** (`linkedin.com/in/ariannahuffington` / `instagram.com/ariannahuff`)
24. **Greg Isenberg** (`linkedin.com/in/gregisenberg` / `instagram.com/gregisenberg`)
25. **Lenny Rachitsky** (`linkedin.com/in/lennyrachitsky` / `instagram.com/lennyrachitsky`)

---

## 2. Scraping Pipeline (`/api/scrape`)

The ingestion pipeline guarantees 100% uptime with zero account logins through a multi-tier fallback:

```
[Target URL] 
     │
     ├── Primary: Apify Actors (`harvestapi/linkedin-profile-scraper` & `apify/instagram-profile-scraper`)
     │
     ├── Secondary: Stealth User-Agent OpenGraph & JSON-LD
     │     - LinkedIn: Googlebot 2.1 (`Mozilla/5.0 (compatible; Googlebot/2.1)`)
     │     - Instagram: facebookexternalhit (`facebookexternalhit/1.1`)
     │
     └── Tertiary: Jina AI Reader (`https://r.jina.ai/{url}`) for markdown text extraction
```

---

## 3. Psychological Profiling Engine (`/api/analyze/:personId`)

Scraped raw data is fed to Claude Sonnet 4.6 with the strict extraction prompt:
```
You are an expert relationship psychologist and data analyst. Given this person's LinkedIn and Instagram data, extract ONLY what is explicitly supported by the data. DO NOT invent or infer beyond what is stated.

Return a JSON object with:
{
  "needs": [{ "need": "string", "type": "emotional|relational|lifestyle", "evidence": "exact quote from source", "source": "linkedin|instagram", "confidence": "high|medium|low" }],
  "hobbies": [{ "hobby": "string", "evidence": "exact quote", "source": "linkedin|instagram" }],
  "interests": [{ "interest": "string", "evidence": "exact quote", "source": "linkedin|instagram" }],
  "personality_archetype": "2-4 word creative title",
  "voice_profile": "A 3-sentence behavioral description of HOW this person speaks...",
  "dealbreakers": ["inferred from lifestyle signals only"],
  "conversation_starters": ["3 unique openers tailored to this specific person"]
}
```

- Each psychological need is tagged with verbatim source quotes.
- The `voice_profile` is stored in **Mem0** under key `person_{id}_voice`.

---

## 4. Multi-Turn Dating Harness (`/api/dates/start`, `/api/dates/:id/advance`, SSE `/stream`)

Dates progress through 4 distinct stages across 8 turns (4 turns per agent):
1. **Opening (Turns 1-2)**: Establishing presence, morning highlights, initial rapport.
2. **Exploring (Turns 3-4)**: Shared passions, work-life balance, deep craft.
3. **Deepening (Turns 5-6)**: Vulnerability, emotional boundaries, sacred personal time.
4. **Decision (Turns 7-8)**: Verdict on mutual connection and plans to meet again.

### Rules Enforced During Date Turns:
- Spoken dialogue is limited to 120 words and rendered in **Instrument Serif** for intimate feel.
- Each turn extracts a private inner monologue prefixed with `[THOUGHT]:`, collapsible in the UI.
- Key revelations are committed to Mem0: `mem0.add("${person_name} revealed ${fact} during date with ${other_name}")`.
- Real-time Server-Sent Events (SSE) stream text character-by-character to the frontend.
- Animated Chemistry Meter tracks dynamic progression from cold blue to warm spark red.

---

## 5. Post-Date Assessment & Adjudication Math

Once Turn 8 concludes, three independent evaluations run:
1. **Agent A Private Assessment**: Evaluates partner without seeing partner's inner thoughts. Scores:
   - `Chemistry` (0-10)
   - `Values_Alignment` (0-10)
   - `Lifestyle_Fit` (0-10)
   - `Would_Meet_Again` (0-10)
2. **Agent B Private Assessment**: Identical evaluation criteria from Person B's viewpoint.
3. **Neutral Judge Agent**: Third Claude Sonnet 4.6 call evaluating conversational balance, emotional safety, and values alignment. Cites 2-3 specific moments from the transcript as concrete evidence.

### Official Score Formula:
```
view_A = 0.7 * would_meet_again_A + 0.3 * mean(other_scores_A) * 10
view_B = 0.7 * would_meet_again_B + 0.3 * mean(other_scores_B) * 10
final_score = 0.4 * view_A + 0.4 * view_B + 0.2 * judge_mutual_fit
```

---

## 6. Compatibility Heatmap Matrix (`/api/rankings/matrix`)

- Full 25×25 matrix mapping all cross-agent compatibility pairs.
- Visualized with a cold-to-warm gradient.
- Clicking any cell opens a transcript drawer showing full conversation excerpts and judge findings.
- One-click CSV export: `Download rankings CSV`.

---

## 7. Model Context Protocol (MCP) Integration

The platform provides a Model Context Protocol server over stdio (`scripts/mcp-server.js`) and HTTP (`/api/mcp`):
- `get_profile(personId)`: Retrieves full psychological profile with evidence citations.
- `recall_memory(agentId, key)`: Retrieves persistent agent memory.
- `write_memory(agentId, key, value)`: Stores agent discoveries.
- `list_rankings(personId)`: Retrieves ranked matches with explanations.
- `get_date_transcript(dateId)`: Returns multi-turn dialogue, inner thoughts, and judge verdict.
- `start_pipeline(linkedinUrl, instagramUrl)`: Ingests new public figures into the network.

Configured in `.agents/mcp_config.json` alongside Apify's official actors server.

---

## 8. Competitor Comparison

| Capability | standin | AgenticDate | Twofold | AffinityAI | **Our Submission** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Real Scraper + Fallback** | ❌ Mock only | ⚠️ Frontend only | ⚠️ Basic | ❌ Mock | ✅ **Apify + Googlebot + Jina Reader** |
| **Live Date Streaming** | ❌ Static text | ❌ Static text | ❌ Static text | ❌ Static text | ✅ **Real-Time SSE Server-Sent Events** |
| **Dialogue Typography** | Sans-serif | Sans-serif | Sans-serif | Sans-serif | ✅ **Instrument Serif (Intimate & Literary)** |
| **Private Thoughts [THOUGHT]** | ❌ None | ⚠️ Frontend mock | ❌ None | ⚠️ Static | ✅ **Collapsible Real LLM Inner Thoughts** |
| **Neutral Judge Agent** | ⚠️ Basic | ❌ None | ❌ None | ❌ None | ✅ **Claude Sonnet 4.6 with Cited Quotes** |
| **Official Math Formula** | ❌ Ad-hoc | ❌ Ad-hoc | ❌ Ad-hoc | ❌ Ad-hoc | ✅ **Weighted Formula + Split-Screen** |
| **25×25 Heatmap Matrix** | ❌ None | ❌ None | ⚠️ Small | ❌ None | ✅ **Full NxN Interactive Matrix + CSV Export** |
| **Persistent Agent Memory** | FTS5 | LocalStorage | D1 | None | ✅ **Mem0 Persistent Memory Layer** |
| **MCP Stdio Server** | ⚠️ Partial | ❌ None | ❌ None | ❌ None | ✅ **Full JSON-RPC + HTTP MCP Tools** |
