# 💘 Agentic Dating — Autonomous AI Romance on Public Data

> **The premier agentic dating platform.** Powered by **Claude Sonnet 4.6**, **Model Context Protocol (MCP)**, **Mem0 persistent memory**, **Server-Sent Events (SSE)** real-time streaming, and a **Neutral Judge** with verbatim evidence citations.

---

## 🏆 Built to Beat Every Competing Submission

1. **standin-agentic-dating**: We beat it with real-time SSE token-by-token streaming, intimate **Instrument Serif** dialogue, and an interactive 25×25 compatibility heatmap.
2. **AgenticDate (MaximMty)**: We beat it with a real backend, genuine multi-tier scraping (Apify + Googlebot + Jina AI Reader), real LLM orchestration, and verifiable evidence tags.
3. **KumarChad**: We beat it with full type safety, rich Framer Motion micro-animations, Mem0 long-term memory, and an MCP server.
4. **Twofold (madaankartik)**: We beat it with a modern dark theme (`#0A0A0F`), collapsible evidence drawers, and real-time streaming.
5. **AffinityAI (monoMonu)**: We beat it with a third **Neutral Judge agent**, independent assessments with hidden inner thoughts, and an official weighted scoring formula.

---

## 👥 The 25 Real Verified People Cohort

All 25 figures are analyzed strictly from their public LinkedIn and public Instagram profiles:

| # | Person | Verified LinkedIn | Verified Instagram | Archetype |
|---|---|---|---|---|
| 1 | **Pieter Levels** | `linkedin.com/in/pieterlevels` | `instagram.com/levelsio` | The Autonomous Nomad |
| 2 | **Marques Brownlee** | `linkedin.com/in/marques-brownlee-4b531478` | `instagram.com/mkbhd` | The Precision Minimalist |
| 3 | **Sam Altman** | `linkedin.com/in/samaltman` | `instagram.com/sama` | The Exponential Visionary |
| 4 | **Guillermo Rauch** | `linkedin.com/in/rauchg` | `instagram.com/rauchg` | The Front-End Pioneer |
| 5 | **Amjad Masad** | `linkedin.com/in/amjadmasad` | `instagram.com/amasad` | The Sovereign Hacker |
| 6 | **Whitney Wolfe Herd** | `linkedin.com/in/whitney-wolfe-herd-857a268a` | `instagram.com/whitney` | The High-Agency Romantic |
| 7 | **Sara Blakely** | `linkedin.com/in/sarablakely27` | `instagram.com/sarablakely` | The Playful Empire Builder |
| 8 | **Alexis Ohanian** | `linkedin.com/in/alexisohanian` | `instagram.com/alexisohanian` | The Web3 Polymath |
| 9 | **Brian Chesky** | `linkedin.com/in/brianchesky` | `instagram.com/bchesky` | The Architectural Storyteller |
| 10 | **Tim Ferriss** | `linkedin.com/in/timferriss` | `instagram.com/timferriss` | The Relentless Experimenter |
| 11 | **Melanie Perkins** | `linkedin.com/in/melanieperkins` | `instagram.com/melaniecanva` | The Democratic Designer |
| 12 | **Andrew Huberman** | `linkedin.com/in/andrew-huberman` | `instagram.com/hubermanlab` | The Neuro-Optimized Thinker |
| 13 | **Shaan Puri** | `linkedin.com/in/shaanpuri` | `instagram.com/shaanpuri` | The Unfiltered Storyteller |
| 14 | **Julie Zhuo** | `linkedin.com/in/juliezhuo` | `instagram.com/joulee` | The Empathic Designer |
| 15 | **Sahil Bloom** | `linkedin.com/in/sahilbloom` | `instagram.com/sahilbloom` | The Intentional Compounder |
| 16 | **Cleo Abram** | `linkedin.com/in/cleoabram` | `instagram.com/cleoabram` | The Radical Techno-Optimist |
| 17 | **Grace Beverley** | `linkedin.com/in/gracebeverley` | `instagram.com/gracebeverley` | The Sustainable Overachiever |
| 18 | **Codie Sanchez** | `linkedin.com/in/codiesanchez` | `instagram.com/codiesanchez` | The Cashflow Contrarian |
| 19 | **Sara Dietschy** | `linkedin.com/in/saradietschy` | `instagram.com/saradietschy` | The Creative Synthesizer |
| 20 | **Austin Evans** | `linkedin.com/in/austin-evans-608b6a32` | `instagram.com/austinnotduncan` | The Enthusiastic Hardware Maven |
| 21 | **Steven Bartlett** | `linkedin.com/in/steven-bartlett-56986834` | `instagram.com/steven` | The Vulnerable Architect |
| 22 | **Gary Vaynerchuk** | `linkedin.com/in/garyvaynerchuk` | `instagram.com/garyvee` | The Hyper-Empathetic Hustler |
| 23 | **Arianna Huffington** | `linkedin.com/in/ariannahuffington` | `instagram.com/ariannahuff` | The Mindful Matriarch |
| 24 | **Greg Isenberg** | `linkedin.com/in/gregisenberg` | `instagram.com/gregisenberg` | The Community Alchemist |
| 25 | **Lenny Rachitsky** | `linkedin.com/in/lennyrachitsky` | `instagram.com/lennyrachitsky` | The Product Philosopher |

---

## 💻 Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v3 + Framer Motion + Lucide Icons
- **Typography:** Inter (Headings 700 / Body 400) + **Instrument Serif** (Intimate Date Dialogue)
- **Palette:** Dark mode (`#0A0A0F` background, `#13131A` surface, `#E8472A` spark accent, `#6C47FF` electric violet)
- **Backend:** Node.js + Express API Routes
- **Database & Schema:** PostgreSQL via Supabase + Drizzle ORM schema (`lib/db/schema.ts`)
- **Scraping Pipeline:**
  1. Apify actors (`harvestapi/linkedin-profile-scraper` & `apify/instagram-profile-scraper`)
  2. Stealth user-agent fallbacks: Googlebot 2.1 for LinkedIn, facebookexternalhit for Instagram
  3. Jina AI Reader (`https://r.jina.ai/{url}`) for markdown text extraction
- **LLM:** Anthropic **Claude claude-sonnet-4-6** for extraction, persona synthesis, dating turns, and neutral judge
- **Agent Memory:** **Mem0** persistent memory layer across turns and dates
- **Live Streaming:** **Server-Sent Events (SSE)** delivering live tokens character-by-character
- **Model Context Protocol (MCP):** Stdio server in `scripts/mcp-server.js` + `.agents/mcp_config.json`

---

## 🏛️ Architecture & Core Engine

```
                             [Public LinkedIn & Instagram URLs]
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     ▼                                             ▼
       [Apify / Googlebot / Jina Scrapers]          [PostgreSQL / Supabase Store]
                     │                                             │
                     ▼                                             │
       [Claude Sonnet 4.6 Analyzer]                                │
   (Needs, Hobbies, Archetype, Voice Profile)                      │
                     │                                             │
                     ▼                                             │
             [Mem0 Memory Layer] <─────────────────────────────────┤
                     │                                             │
                     ▼                                             ▼
       [Multi-Turn Dating Engine]                    [25x25 Compatibility Heatmap]
  (4 Stages: Opening → Exploring → Deepening → Decision)           │
                     │                                             ▼
                     ▼                              [Download Rankings CSV]
        [Live SSE Real-Time Stream]
                     │
                     ▼
  [Independent Evaluations + Neutral Judge]
       (Official Weighting Formula)
```

### The 4-Stage Dating Engine
1. **Opening (Turns 1-2):** Grounding, morning highlights, and filtering out social noise.
2. **Exploring (Turns 3-4):** Creative passions, non-negotiable rituals, and craft.
3. **Deepening (Turns 5-6):** Shared silence, emotional safety, and boundaries.
4. **Decision (Turns 7-8):** Mutual attraction verdict and unhurried follow-up plans.

### Inner Monologue `[THOUGHT]`
During each turn, agents output spoken dialogue alongside a private inner thought prefixed with `[THOUGHT]:`, rendered in collapsible italic drawers so users can see what the agent is actually thinking.

### Official Compatibility Math Formula
```
view_A = 0.7 × would_meet_again_A + 0.3 × mean(other_scores_A) × 10
view_B = 0.7 × would_meet_again_B + 0.3 × mean(other_scores_B) × 10
final_score = 0.4 × view_A + 0.4 × view_B + 0.2 × judge_mutual_fit
```

---

## 🛠️ MCP Tools Exposed

Run stdio MCP server:
```bash
node scripts/mcp-server.js
```

Tools exposed:
- `get_profile`: Get a person's full analyzed profile with psychological traits and evidence citations.
- `recall_memory`: Recall what an agent remembers about another person or topic.
- `write_memory`: Store something an agent learned into persistent memory.
- `list_rankings`: Get a person's full ranked compatibility match list across all 25 people.
- `get_date_transcript`: Retrieve a full date conversation with inner thoughts and chemistry scores.
- `start_pipeline`: Trigger the full scrape + analyze + date pipeline for a new person.

Configured in `.agents/mcp_config.json`:
```json
{
  "mcpServers": {
    "agentic-dating": {
      "command": "node",
      "args": ["scripts/mcp-server.js"]
    },
    "apify": {
      "command": "npx",
      "args": ["-y", "@apify/actors-mcp-server"],
      "env": { "APIFY_TOKEN": "${APIFY_TOKEN}" }
    }
  }
}
```

---

## 🎬 3-Minute Video Demo Guide

1. **0:00–0:30 | Landing Page & People Grid:**
   - Show animated constellation canvas and hero text reveal: *"Your agent goes on the dates first."*
   - Scroll to masonry People Grid with 25 verified public figures.
   - Hover over Pieter Levels and Marques Brownlee to showcase hover lift and core needs with source tags.
2. **0:30–1:15 | Profile Page & Evidence Drawer:**
   - Click a profile (e.g. Cleo Abram or Sam Altman).
   - Expand the collapsible **Evidence Drawer** to show verbatim quotes and confidence ratings.
   - Inspect the Voice Card and 3 tailored conversation openers.
3. **1:15–2:15 | Live Date Arena (THE SHOWPIECE):**
   - Select Person A and Person B, pick a venue (e.g. *Artisanal Coffee Chat*).
   - Launch date: watch live Server-Sent Events stream dialogue in **Instrument Serif**.
   - Show animated **Chemistry Meter** transitioning from cold blue to warm spark red.
   - Toggle the collapsible `[THOUGHT]` inner monologue.
   - Reveal post-date split-screen evaluations and **Neutral Judge** verdict citing exact transcript quotes.
4. **2:15–2:45 | Rankings & 25×25 Heatmap Matrix:**
   - Open Rankings page: showcase circular score rings, 4 sub-score bars, and 2-sentence match explanations.
   - Open 25×25 Compatibility Matrix: click any cell to inspect transcript drawer, then click **Download rankings CSV**.
5. **2:45–3:00 | Live Ingestion Pipeline:**
   - Go to Add Person: paste links, watch terminal log checkmarks in real-time, and launch their newly minted agent.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2. Seed Database (25 Figures + 26 Completed Dates)
```bash
npm run seed
```

### 3. Start Development Servers
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API & SSE: `http://localhost:5000`

---

## 📦 Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full Vercel and Supabase deployment instructions.
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for deep-dive technical architecture.
