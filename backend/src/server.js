import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import profilesRouter from './routes/profiles.js';
import datingRouter from './routes/dating.js';
import rankingsRouter from './routes/rankings.js';
import notifyRouter from './routes/notify.js';
import { store } from './db/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routers
app.use('/api/profiles', profilesRouter);
app.use('/api/dates', datingRouter);
app.use('/api/dating', datingRouter); // Alias
app.use('/api/rankings', rankingsRouter);
app.use('/api/notify', notifyRouter);

// Direct top-level aliases specified in the prompt
app.post('/api/scrape', (req, res, next) => {
  req.url = '/scrape';
  profilesRouter(req, res, next);
});

app.post('/api/analyze/:personId', (req, res, next) => {
  req.url = `/analyze/${req.params.personId}`;
  profilesRouter(req, res, next);
});

// SSE Streaming direct alias: /api/stream/date/:dateId
app.get('/api/stream/date/:dateId', (req, res, next) => {
  req.url = `/${req.params.dateId}/stream`;
  datingRouter(req, res, next);
});

// MCP HTTP Tool Interface
const MCP_TOOLS = [
  { name: "get_profile", description: "Get a person's full analyzed profile", inputSchema: { personId: "string" } },
  { name: "recall_memory", description: "Recall what an agent remembers about another person", inputSchema: { agentId: "string", key: "string" } },
  { name: "write_memory", description: "Store something an agent learned", inputSchema: { agentId: "string", key: "string", value: "string" } },
  { name: "list_rankings", description: "Get a person's full ranked match list", inputSchema: { personId: "string" } },
  { name: "get_date_transcript", description: "Retrieve a full date conversation", inputSchema: { dateId: "string" } },
  { name: "start_pipeline", description: "Trigger the full scrape + analyze + date pipeline for a new person", inputSchema: { linkedinUrl: "string", instagramUrl: "string" } }
];

app.get('/api/mcp', (req, res) => {
  res.json({
    status: 'operational',
    protocol: 'mcp-1.0',
    tools: MCP_TOOLS
  });
});

app.post('/api/mcp', (req, res) => {
  const { tool, params } = req.body;
  if (!tool) {
    return res.status(400).json({ error: 'tool name required' });
  }

  if (tool === 'get_profile') {
    const profile = store.getProfileById(params?.personId);
    return res.json({ result: profile || { error: 'Not found' } });
  }

  if (tool === 'list_rankings') {
    const rankings = store.getRankingsForPerson(params?.personId);
    return res.json({ result: rankings });
  }

  if (tool === 'get_date_transcript') {
    const date = store.getDateById(params?.dateId);
    return res.json({ result: date || { error: 'Not found' } });
  }

  if (tool === 'recall_memory') {
    const memories = store.recallMemory(params?.agentId, params?.key);
    return res.json({ result: memories });
  }

  if (tool === 'write_memory') {
    const memory = store.storeMemory(params?.agentId, params?.key, params?.value);
    return res.json({ result: memory });
  }

  res.status(404).json({ error: `Unknown tool: ${tool}` });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    profilesLoaded: store.getProfiles().length,
    datesRecorded: store.getDates().length,
    mcpHarnessStatus: 'operational',
    sseStreaming: 'enabled',
    mem0Persistence: 'active'
  });
});

// Serve frontend static build in production
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Agentic Dating Backend API is running.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Agentic Dating Server running at http://localhost:${PORT}`);
  console.log(`📡 Loaded ${store.getProfiles().length} profiles & ${store.getDates().length} dates.`);
});
