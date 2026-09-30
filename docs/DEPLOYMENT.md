# Deployment Guide — Autonomous Agentic Dating Platform

This guide covers deploying the application to **Vercel** (frontend and API routes), connecting **Supabase PostgreSQL** via Drizzle ORM, and configuring environment variables.

---

## 1. Environment Variables Checklist

Set these variables in your deployment dashboard (Vercel, Railway, or `.env`):

```bash
# PostgreSQL via Supabase Connection String (Session / Transaction mode)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Claude Sonnet 4.6 API Key (Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Apify Scraper Token (Optional, falls back to Googlebot & Jina AI Reader gracefully)
APIFY_TOKEN=apify_api_...

# Mem0 Persistent Agent Memory API Key (Optional, falls back to local persistent store)
MEM0_API_KEY=m0-...

# App Public URL
NEXT_PUBLIC_APP_URL=https://agentic-dating-site.vercel.app
PORT=5000
```

---

## 2. Deploying to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete agentic dating platform"
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select repository `agentic-dating`.
3. Configure project settings:
   - **Framework Preset**: Other (or Vite)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install && npm install --prefix backend && npm install --prefix frontend`
4. Add the Environment Variables from the checklist above.
5. Click **Deploy**.

---

## 3. Database Setup (Supabase PostgreSQL + Drizzle ORM)

### Supabase Setup
1. Create a free project on [supabase.com](https://supabase.com).
2. In **Project Settings** → **Database**, copy the `Connection String (URI)`.
3. Provide your database password and assign to `DATABASE_URL`.

### Schema Push
Push the Drizzle schema defined in `lib/db/schema.ts`:
```bash
npx drizzle-kit push:pg
```

Tables created:
- `people`: Core identity, public URLs, photos
- `profiles`: Psychological needs, hobbies, interests, archetype, voice prompt, evidence tags
- `dates`: Multi-turn transcripts, chemistry scores, agent verdicts, neutral judge verdict, final score
- `memories`: Agent persistent memories
- `rankings`: Pre-computed match scores, score breakdowns, explanations

---

## 4. Model Context Protocol (MCP) Server Setup

### Running Stdio MCP Server
```bash
# Run local stdio server
node scripts/mcp-server.js

# Or test via npm
npm run mcp
```

### Configuring Claude Desktop / Cursor / Antigravity IDE
Add to `.agents/mcp_config.json`:
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
      "env": {
        "APIFY_TOKEN": "${APIFY_TOKEN}"
      }
    }
  }
}
```

---

## 5. Local Verification

To run both backend and frontend locally:
```bash
# 1. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 2. Seed database with 25 figures and 26 complete dates
npm run seed

# 3. Start development servers
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API & SSE Stream: `http://localhost:5000`
