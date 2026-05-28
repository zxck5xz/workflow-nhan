import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DataStore } from './data-store.js';
import { DataStoreDB } from './data-store-db.js';
import { AuthService } from './auth.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const PYTHON_DIR = path.join(ROOT_DIR, 'ai-agents');
const EVAL_SCRIPT = path.join(PYTHON_DIR, 'game_eval_agent.py');
const PPTX_SCRIPT = path.join(PYTHON_DIR, 'pptx_generator.py');
const store = new DataStore(__dirname);


let dataStoreDB = null;


async function getDataStoreDB() {
  if (!process.env.DATABASE_URL) return null;
  if (dataStoreDB) return dataStoreDB;
  dataStoreDB = new DataStoreDB();
  return dataStoreDB;
}


async function getDataStore() {
  const dsDb = await getDataStoreDB();
  return dsDb || store;
}


async function syncJsonToDb() {
  if (!process.env.DATABASE_URL) return;
  try {
    const dsDb = await getDataStoreDB();
    if (!dsDb) return;

    // Sync latest JSON edits from local file storage into DB.
    const payload = store.loadData();
    await dsDb.saveData(payload);
    console.log(`[syncJsonToDb] synced app-data -> DB at ${new Date().toISOString()}`);
  } catch (err) {
    console.warn('[syncJsonToDb] failed:', err?.message ?? err);
  }
}


// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Define paths that do not require authentication
  const publicPaths = [
    '/api/health',
    '/api/auth/register',
    '/api/auth/login'
  ];

  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = AuthService.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Authorization middleware - check user role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Get user role from database
    // For now, we'll add role to token payload during login
    // In a production app, you'd fetch this from database on each request
    const userRole = req.user.role; // This will be set when we update the token payload
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    
    next();
  };
};


const app = express();
const PORT = process.env.PORT || 4000;


const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173';
const ALLOWED_ORIGINS = CORS_ORIGINS === '*' ? null : CORS_ORIGINS.split(',');


app.use(cors({
  origin: ALLOWED_ORIGINS
    ? (origin, cb) => cb(null, !origin || ALLOWED_ORIGINS.includes(origin))
    : true,
}));
app.use(express.json());


// Apply authentication middleware to all routes
app.use(authMiddleware);


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


app.get('/api/app-data', async (req, res) => {
  const ds = await getDataStore();
  res.json(await ds.loadData());
});


app.post('/api/app-data', async (req, res) => {
  const payload = req.body;
  try {
    const ds = await getDataStore();
    const saved = await ds.saveData(payload);
    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/snapshot', async (req, res) => {
  try {
    const ds = await getDataStore();
    const snapshotFile = await ds.saveSnapshot(await ds.loadData());
    res.json({ success: true, snapshotFile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/snapshots', async (req, res) => {
  const ds = await getDataStore();
  res.json({ snapshots: await ds.listSnapshots() });
});


app.get('/api/snapshots/:date', async (req, res) => {
  const ds = await getDataStore();
  const snapshot = await ds.loadSnapshot(req.params.date);
  if (!snapshot) {
    return res.status(404).json({ error: 'Snapshot not found' });
  }
  res.json(snapshot);
});


app.post('/api/evaluate', (req, res) => {
  const { game, genre, info, competitors, criteria } = req.body;
  const args = [];
  if (game) args.push('--game', game);
  if (genre) args.push('--genre', genre);
  if (info) args.push('--info', info);
  if (competitors) args.push('--competitors', competitors);
  if (criteria) args.push('--criteria', criteria);


  const cmd = `python "${EVAL_SCRIPT}" ${args.map(a => a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a).join(' ')}`;


  exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    const successMatch = stdout.match(/SUCCESS:(.+)/);
    if (!successMatch) {
      return res.status(500).json({ error: 'Evaluation failed or file path not found in output', stdout, stderr });
    }
    const filePath = successMatch[1].trim();
    try {
      const markdownContent = fs.readFileSync(filePath, 'utf-8');
      res.json({ success: true, filePath, markdown: markdownContent, stdout });
    } catch (readErr) {
      res.status(500).json({ error: `Failed to read report file: ${readErr.message}`, stdout });
    }
  });
});


app.post('/api/generate-pptx', (req, res) => {
  const { markdownPath } = req.body;
  const args = markdownPath ? ['--markdown', markdownPath] : [];
  const cmd = `python "${PPTX_SCRIPT}" ${args.map(a => a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a).join(' ')}`;


  exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }


    const successMatch = stdout.match(/Presentation successfully saved at:\s*(.+)/) || stdout.match(/Presentation saved at:\s*(.+)/);
    res.json({ success: true, pptxPath: successMatch ? successMatch[1].trim() : null, stdout });
  });
});


app.post('/api/open-file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }


  const resolvedPath = path.resolve(filePath);
  const cmd = `start "" "${resolvedPath}"`;


  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ success: true, stdout });
  });
});


// Authentication routes (excluded from middleware above)
app.post('/api/auth/register', async (req, res) => {
  return res.status(403).json({ error: 'Public registration is currently disabled' });
  /*
  try {
    const { user, token } = await AuthService.register(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  */
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { user, token } = await AuthService.login(req.body.email, req.body.password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    // The middleware has already verified the token and attached req.user
    const user = await AuthService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// User management routes (ADMIN only)
app.get('/api/users', authorize('ADMIN'), async (req, res) => {
  try {
    const users = await AuthService.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/users/:id/role', authorize('ADMIN'), async (req, res) => {
  try {
    const user = await AuthService.updateUserRole(req.params.id, req.body.role);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:id', authorize('ADMIN'), async (req, res) => {
  try {
    await AuthService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

