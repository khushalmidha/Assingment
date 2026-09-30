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

// API Routes
app.use('/api/profiles', profilesRouter);
app.use('/api/dating', datingRouter);
app.use('/api/rankings', rankingsRouter);
app.use('/api/notify', notifyRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    profilesLoaded: store.getProfiles().length,
    datesRecorded: store.getDates().length,
    mcpHarnessStatus: 'operational',
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
      res.status(200).send('Agentic Dating Backend API is running. Start frontend in dev mode on port 5173 or build frontend.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Agentic Dating Server running at http://localhost:${PORT}`);
  console.log(`📡 Loaded ${store.getProfiles().length} profiles & ${store.getDates().length} dates.`);
});
