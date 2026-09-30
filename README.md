# 💘 Agentic Dating — Autonomous AI Romance on Public Data

An end-to-end autonomous multi-agent dating platform where real public figures and professionals are represented by specialized AI agents. Each agent analyzes the person's public LinkedIn and public Instagram profiles, synthesizes their voice persona, and "dates" other agents on that person's behalf using the **Model Context Protocol (MCP)**, **Claude Sonnet 4.6**, and **Mem0 persistent memory**.

---

## 🌟 Live Demo & Video Guide Overview

The web application runs locally at:
- **Frontend:** [http://localhost:5173](http://localhost:5173) (Vite + React + Tailwind CSS)
- **Backend:** [http://localhost:5000](http://localhost:5000) (Node.js + Express + Playwright + MCP Harness)

### 3-Minute Video Demo Flow
1. **Landing Page & Ingestion Flow**: Overview of the 26 pre-scraped public figure agents, system metrics, and the input flow where pasting a LinkedIn URL + Instagram URL triggers the live scraping pipeline.
2. **Profile Page (Persona Dashboard)**: Scraped public data from LinkedIn and Instagram, high-res avatar, and deep agent analysis:
   - *(1) Core Needs in a partner*
   - *(2) Hobbies & Passions*
   - *(3) Personality Traits*
   - *(4) Lifestyle Signals*
   - *(5) Inferred Dealbreakers*
   - *(6) 3 Unique Tailored AI Conversation Starters*
3. **Live Simulated Agent Dating Session**: Two agents having an unscripted multi-turn conversation speaking strictly **in their authentic voice**, with real-time MCP tool invocations (`get_partner_profile`, `store_memory`, `recall_memory`, `score_date`) and mutual scorecards.
4. **Rankings & Compatibility Matrix**: Per-person ranked candidate list with detailed AI reasoning (*"You matched because of shared interest in X, similar lifestyle signals around Y"*), global leaderboard, and natural-voice Telegram/WhatsApp summary dispatches.
5. **Clean Repository Structure**: Clean modular architecture conforming to all technical specs.

---

## 🏗️ System Architecture

```
                                  ┌──────────────────────────┐
                                  │   Public LinkedIn & IG   │
                                  └─────────────┬────────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────────┐
                         │ Playwright Stealth Browser Automation    │
                         │ (Randomized User-Agents, Human Delays)   │
                         └──────────────────────┬───────────────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────────┐
                         │ Claude Sonnet 4.6 Profile Analyzer       │
                         │ (System Prompt: Needs, Hobbies, Traits,  │
                         │  Signals, Dealbreakers, 3 Openers)       │
                         └──────────────────────┬───────────────────┘
                                                │
                         ┌──────────────────────┴───────────────────┐
                         ▼                                          ▼
           ┌────────────────────────────┐             ┌────────────────────────────┐
           │    Persistent Memory       │             │   Voice Persona Engine     │
           │  (Postgres / SQLite /      │             │  (Tone, Cadence, Style,    │
           │   Mem0 Key-Value Store)    │             │   Writing Voice Synthesis) │
           └─────────────┬──────────────┘             └─────────────┬──────────────┘
                         │                                          │
                         └──────────────────────┬───────────────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────────┐
                         │ MCP Multi-Agent Dating Harness           │
                         │ ├─ get_partner_profile(person_id)        │
                         │ ├─ store_memory(key, val)                │
                         │ ├─ recall_memory(key)                    │
                         │ └─ score_date(metrics)                   │
                         └──────────────────────┬───────────────────┘
                                                │
                                                ▼
                         ┌──────────────────────────────────────────┐
                         │ Compatibility Rankings & Explanations    │
                         │ (Chemistry, Interests, Lifestyle, Convo) │
                         │ + WhatsApp/Telegram Notification Bot     │
                         └──────────────────────────────────────────┘
```

---

## 👥 Pre-Loaded Real Public Figures (26 Agents)

All 26 individuals have public, accessible LinkedIn and verified public Instagram profiles stored in `data/initial_people.json`:

| # | Name | Current Role / Organization | LinkedIn Public URL | Instagram Public URL |
|---|------|----------------------------|---------------------|----------------------|
| 1 | **Satya Nadella** | CEO, Microsoft | [linkedin.com/in/satyanadella](https://www.linkedin.com/in/satyanadella) | [instagram.com/satyanadella](https://www.instagram.com/satyanadella) |
| 2 | **Sundar Pichai** | CEO, Google & Alphabet | [linkedin.com/in/sundarpichai](https://www.linkedin.com/in/sundarpichai) | [instagram.com/sundarpichai](https://www.instagram.com/sundarpichai) |
| 3 | **Sam Altman** | CEO, OpenAI | [linkedin.com/in/samaltman](https://www.linkedin.com/in/samaltman) | [instagram.com/sama](https://www.instagram.com/sama) |
| 4 | **Mira Murati** | AI Founder, ex-CTO OpenAI | [linkedin.com/in/mira-murati](https://www.linkedin.com/in/mira-murati) | [instagram.com/miramurati](https://www.instagram.com/miramurati) |
| 5 | **Lex Fridman** | AI Researcher & Podcast Host | [linkedin.com/in/lexfridman](https://www.linkedin.com/in/lexfridman) | [instagram.com/lexfridman](https://www.instagram.com/lexfridman) |
| 6 | **Andrew Ng** | Founder DeepLearning.AI, Coursera | [linkedin.com/in/andrewyng](https://www.linkedin.com/in/andrewyng) | [instagram.com/andrew_y_ng](https://www.instagram.com/andrew_y_ng) |
| 7 | **Dr. Fei-Fei Li** | Stanford Professor, ImageNet Creator | [linkedin.com/in/fei-fei-li-4541247](https://www.linkedin.com/in/fei-fei-li-4541247) | [instagram.com/drfeifeili](https://www.instagram.com/drfeifeili) |
| 8 | **Marques Brownlee** | Creator (MKBHD) & Pro Athlete | [linkedin.com/in/marquesbrownlee](https://www.linkedin.com/in/marquesbrownlee) | [instagram.com/mkbhd](https://www.instagram.com/mkbhd) |
| 9 | **Tim Cook** | CEO, Apple | [linkedin.com/in/tim-cook](https://www.linkedin.com/in/tim-cook) | [instagram.com/tim_cook](https://www.instagram.com/tim_cook) |
| 10 | **Brian Chesky** | Co-founder & CEO, Airbnb | [linkedin.com/in/brianchesky](https://www.linkedin.com/in/brianchesky) | [instagram.com/bchesky](https://www.instagram.com/bchesky) |
| 11 | **Melanie Perkins** | Co-founder & CEO, Canva | [linkedin.com/in/melanieperkins](https://www.linkedin.com/in/melanieperkins) | [instagram.com/melaniecanva](https://www.instagram.com/melaniecanva) |
| 12 | **Gary Vaynerchuk** | CEO VaynerMedia, Creator | [linkedin.com/in/garyvaynerchuk](https://www.linkedin.com/in/garyvaynerchuk) | [instagram.com/garyvee](https://www.instagram.com/garyvee) |
| 13 | **Sara Blakely** | Founder SPANX & SNEEX | [linkedin.com/in/sarablakely27](https://www.linkedin.com/in/sarablakely27) | [instagram.com/sarablakely](https://www.instagram.com/sarablakely) |
| 14 | **Mark Cuban** | Entrepreneur, Shark Tank, Cost Plus Drugs | [linkedin.com/in/mark-cuban-usa](https://www.linkedin.com/in/mark-cuban-usa) | [instagram.com/mcuban](https://www.instagram.com/mcuban) |
| 15 | **Whitney Wolfe Herd** | Founder & Executive Chair, Bumble | [linkedin.com/in/whitney-wolfe-herd](https://www.linkedin.com/in/whitney-wolfe-herd) | [instagram.com/whitney](https://www.instagram.com/whitney) |
| 16 | **Reid Hoffman** | Co-founder LinkedIn, Partner Greylock | [linkedin.com/in/reidhoffman](https://www.linkedin.com/in/reidhoffman) | [instagram.com/reidhoffman](https://www.instagram.com/reidhoffman) |
| 17 | **Justine Ezarik** | iJustine, Creator & Gamer | [linkedin.com/in/justineezarik](https://www.linkedin.com/in/justineezarik) | [instagram.com/ijustine](https://www.instagram.com/ijustine) |
| 18 | **Ali Abdaal** | Doctor, Author Feel-Good Productivity | [linkedin.com/in/ali-abdaal](https://www.linkedin.com/in/ali-abdaal) | [instagram.com/aliabdaal](https://www.instagram.com/aliabdaal) |
| 19 | **Shiza Shahid** | Co-founder Malala Fund, Our Place | [linkedin.com/in/shizashahid](https://www.linkedin.com/in/shizashahid) | [instagram.com/shiza](https://www.instagram.com/shiza) |
| 20 | **Alexis Ohanian** | Founder Seven Seven Six, Reddit Co-founder | [linkedin.com/in/alexisohanian](https://www.linkedin.com/in/alexisohanian) | [instagram.com/alexisohanian](https://www.instagram.com/alexisohanian) |
| 21 | **Andrej Karpathy** | Founder Eureka Labs, ex-Tesla AI Director | [linkedin.com/in/andrej-karpathy-9a650716](https://www.linkedin.com/in/andrej-karpathy-9a650716) | [instagram.com/karpathy](https://www.instagram.com/karpathy) |
| 22 | **Dr. Andrew Huberman** | Stanford Professor, Huberman Lab | [linkedin.com/in/andrew-huberman](https://www.linkedin.com/in/andrew-huberman) | [instagram.com/hubermanlab](https://www.instagram.com/hubermanlab) |
| 23 | **Dr. Brené Brown** | Researcher, Author Daring Greatly | [linkedin.com/in/brenebrown](https://www.linkedin.com/in/brenebrown) | [instagram.com/brenebrown](https://www.instagram.com/brenebrown) |
| 24 | **Payal Kadakia** | Founder ClassPass, Author LifePass | [linkedin.com/in/payalkadakia](https://www.linkedin.com/in/payalkadakia) | [instagram.com/payal](https://www.instagram.com/payal) |
| 25 | **Tony Fadell** | iPod/iPhone inventor, Nest Founder | [linkedin.com/in/tonyfadell](https://www.linkedin.com/in/tonyfadell) | [instagram.com/tfadell](https://www.instagram.com/tfadell) |
| 26 | **Reshma Saujani** | Founder Girls Who Code, Moms First | [linkedin.com/in/reshma-saujani](https://www.linkedin.com/in/reshma-saujani) | [instagram.com/reshmasaujani](https://www.instagram.com/reshmasaujani) |

---

## 🛠️ MCP (Model Context Protocol) Implementation

Every dating agent has direct access to the 4 standardized MCP tools defined in `backend/src/agents/mcpHarness.js`:

1. `get_partner_profile(person_id)`: Fetches the analyzed dating profile, hobbies, core needs, and lifestyle signals of the partner agent.
2. `recall_memory(key)`: Retrieves stored facts, preferences, or observations recorded during the conversation or from prior dates.
3. `store_memory(key, value)`: Persists an important fact, shared passion, emotional signal, or dealbreaker revealed by the partner into Mem0 persistent memory.
4. `score_date(metrics)`: Submits final compatibility scores across Chemistry (1-10), Shared Interests (1-10), Lifestyle Compatibility (1-10), and Conversation Quality (1-10).

All MCP calls are logged and visualized in real time on the dating screen.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/agentic-dating.git
cd agentic-dating

# Install root, backend, and frontend packages
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 3. Environment Variables (Optional)
Create `.env` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Key variables:
```env
ANTHROPIC_API_KEY=sk-ant-...  # Optional for live Claude Sonnet 4.6 calls (smart fallback active by default)
PORT=5000
DATABASE_URL=postgresql://... # Optional PostgreSQL (uses file-backed SQLite/JSON store by default)
```

### 4. Seed Initial Data
```bash
npm run seed
```
This populates all 26 real public figures with verified LinkedIn & Instagram links, deep psychological analysis, voice personas, and 26 multi-turn pre-computed dates!

### 5. Run the Application
Run both frontend and backend concurrently with one command:
```bash
npm run dev
```
- Open **http://localhost:5173** to view the app.
- Backend runs on **http://localhost:5000**.

---

## 🧪 Comprehensive Test Suite

Run the automated end-to-end API test suite:
```bash
node -e "
async function runTests() {
  console.log('Testing GET /api/profiles...');
  let res = await fetch('http://localhost:5000/api/profiles');
  let data = await res.json();
  console.log('✅ Profiles loaded:', data.count);

  console.log('Testing GET /api/rankings/:id...');
  res = await fetch('http://localhost:5000/api/rankings/' + data.data[0].id);
  let rank = await res.json();
  console.log('✅ Top match for', rank.person.name, 'is', rank.rankings[0].person.name, '(', rank.rankings[0].scores.overall, '%)');

  console.log('Testing POST /api/dating/simulate (MCP Multi-Agent Date)...');
  res = await fetch('http://localhost:5000/api/dating/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ person1Id: data.data[0].id, person2Id: data.data[1].id })
  });
  let d = await res.json();
  console.log('✅ Date simulated with', d.data.turnsCount, 'turns, score:', d.data.scores.overall, '%');
}
runTests();
"
```

---

## 📂 Repository Structure

```
├── package.json                    # Root workspace & concurrently runner
├── data/
│   ├── initial_people.json         # 26 verified real public figures with LinkedIn/IG links & analysis
│   └── db.json                     # Persistent database store (profiles, dates, Mem0 memories)
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js               # Express application entrypoint
│       ├── db/
│       │   ├── store.js            # DB persistence, Mem0 store, compatibility heuristics
│       │   └── seed.js             # Standalone database seed script
│       ├── scrapers/
│       │   └── browserScraper.js   # Playwright stealth browser scraper for LinkedIn & Instagram
│       ├── agents/
│       │   ├── analyzer.js         # Claude Sonnet 4.6 profile analyzer (System prompt: Needs, Hobbies...)
│       │   ├── datingEngine.js     # Multi-turn dating orchestrator in authentic persona voice
│       │   └── mcpHarness.js       # Model Context Protocol (MCP) server & 4 standard tools
│       └── routes/
│           ├── profiles.js         # Profiles API (GET all, GET by ID, POST scrape & analyze)
│           ├── dating.js           # Dating API (POST simulate, GET transcripts)
│           ├── rankings.js         # Rankings API (GET ranked matches with AI explanations)
│           └── notify.js           # Telegram & WhatsApp natural voice summary generator
└── frontend/
    ├── package.json
    ├── vite.config.js              # Vite config with backend proxy on :5000
    ├── tailwind.config.js          # Custom dark glassmorphism theme with neon glows
    ├── index.html                  # SEO tags, Outfit & Plus Jakarta Sans typography
    └── src/
        ├── index.css               # Design tokens, soundwave animations, scrollbars
        ├── App.jsx                 # Main state router & navigation coordinator
        ├── components/
        │   ├── Navbar.jsx          # Sticky header with status pills
        │   ├── Footer.jsx          # Tech stack badges & protocol breakdown
        │   ├── Icons.jsx           # SVG icons for LinkedIn, Instagram, and GitHub
        │   └── NotificationModal.jsx # Natural voice Telegram/WhatsApp preview modal
        └── pages/
            ├── LandingPage.jsx     # Hero, 5-step architecture, featured agents
            ├── InputPage.jsx       # Public profile URLs ingestion & live terminal tracker
            ├── ProfilesPage.jsx    # Searchable & filterable directory of 26 agents
            ├── ProfileDetailPage.jsx # Core Needs, Hobbies, Traits, Dealbreakers, 3 Openers
            ├── DatingPage.jsx      # Live agent dating arena with MCP tool inspector
            └── RankingsPage.jsx    # Ranked matches, match reasons & global matrix
```

---

## 🚢 Deployment Guide

### Vercel (Frontend)
1. Set the root directory to `frontend` (or run `npm run build` in frontend).
2. Set output directory to `dist`.
3. Set environment variable `VITE_API_BASE_URL` pointing to your deployed Railway backend.

### Railway / Render (Backend)
1. Deploy the `backend/` directory as a Node.js web service.
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Add environment variables:
   - `PORT=5000`
   - `ANTHROPIC_API_KEY` (optional)
   - `DATABASE_URL` (optional, automatically uses file-backed persistence if omitted)

---

## 📜 License
MIT License. Built for assignment demonstration.
