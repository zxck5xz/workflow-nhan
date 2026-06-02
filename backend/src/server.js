import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'url';
import { DataStore } from './data-store.js';
import { DataStoreDB } from './data-store-db.js';
import { AuthService } from './auth.js';
import logger from './logger.js';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const PYTHON_DIR = path.join(ROOT_DIR, 'ai-agents');
const EVAL_SCRIPT = path.join(PYTHON_DIR, 'game_eval_agent.py');
const PPTX_SCRIPT = path.join(PYTHON_DIR, 'pptx_generator.py');
const store = new DataStore(__dirname);

let dataStoreDB = null;
let dataStoreDBPromise = null;

async function getDataStoreDB() {
  if (!process.env.DATABASE_URL) return null;
  if (dataStoreDB) return dataStoreDB;
  if (dataStoreDBPromise) return dataStoreDBPromise;
  dataStoreDBPromise = (async () => {
    dataStoreDB = new DataStoreDB();
    return dataStoreDB;
  })();
  return dataStoreDBPromise;
}

async function getDataStore() {
  const dsDb = await getDataStoreDB();
  return dsDb || store;
}

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Define paths that do not require authentication
  const publicPaths = ['/api/health', '/api/auth/register', '/api/auth/login'];

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

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const evaluateSchema = z.object({
  game: z.string().optional(),
  genre: z.string().optional(),
  info: z.string().optional(),
  competitors: z.string().optional(),
  criteria: z.string().optional(),
});

const app = express();
const PORT = process.env.PORT || 4000;

const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174';
const ALLOWED_ORIGINS = CORS_ORIGINS === '*' ? null : new Set(CORS_ORIGINS.split(','));

app.use(
  cors({
    origin: ALLOWED_ORIGINS
      ? (origin, cb) => cb(null, !origin || ALLOWED_ORIGINS.has(origin))
      : true,
  }),
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// Apply authentication middleware to all routes
app.use(authMiddleware);

app.get('/api/app-data', async (req, res) => {
  const ds = await getDataStore();
  res.json(await ds.loadData());
});

app.post('/api/app-data', async (req, res, next) => {
  const payload = req.body;
  try {
    const ds = await getDataStore();
    const saved = await ds.saveData(payload);
    res.json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
});

app.post('/api/snapshot', async (req, res, next) => {
  try {
    const ds = await getDataStore();
    const snapshotFile = await ds.saveSnapshot(await ds.loadData());
    res.json({ success: true, snapshotFile });
  } catch (error) {
    next(error);
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

app.post('/api/evaluate', async (req, res, next) => {
  const validation = evaluateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid evaluation data', details: validation.error });
  }

  const { game, genre, info, competitors, criteria } = validation.data;
  const args = [];
  if (game) args.push('--game', game);
  if (genre) args.push('--genre', genre);
  if (info) args.push('--info', info);
  if (competitors) args.push('--competitors', competitors);
  if (criteria) args.push('--criteria', criteria);

  const cmd = `python "${EVAL_SCRIPT}" ${args.map((a) => (a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' ')}`;

  try {
    const { stdout, stderr } = await execWithTimeout(cmd, 300000);
    const successMatch = stdout.match(/SUCCESS:(.+)/);
    if (!successMatch) {
      return res
        .status(500)
        .json({ error: 'Evaluation failed or file path not found in output', stdout, stderr });
    }
    const filePath = successMatch[1].trim();
    const markdownContent = fs.readFileSync(filePath, 'utf-8');
    res.json({ success: true, filePath, markdown: markdownContent, stdout });
  } catch (error) {
    logger.error({ err: error, stderr: error.stderr }, 'Evaluation script error');
    return res.status(500).json({ error: error.message, stderr: error.stderr });
  }
});

app.post('/api/generate-pptx', async (req, res, next) => {
  const { markdownPath } = req.body;
  const args = markdownPath ? ['--markdown', markdownPath] : [];
  const cmd = `python "${PPTX_SCRIPT}" ${args.map((a) => (a.includes(' ') ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' ')}`;

  try {
    const { stdout } = await execWithTimeout(cmd, 300000);
    const successMatch =
      stdout.match(/Presentation successfully saved at:\s*(.+)/) ||
      stdout.match(/Presentation saved at:\s*(.+)/);
    res.json({ success: true, pptxPath: successMatch ? successMatch[1].trim() : null, stdout });
  } catch (error) {
    logger.error({ err: error, stderr: error.stderr }, 'PPTX generation error');
    return res.status(500).json({ error: error.message, stderr: error.stderr });
  }
});

app.post('/api/open-file', async (req, res, next) => {
  const { filePath } = req.body;
  if (!filePath) {
    return res.status(400).json({ error: 'filePath is required' });
  }

  const resolvedPath = path.resolve(filePath);
  const cmd = `start "" "${resolvedPath}"`;

  try {
    const { stdout } = await execWithTimeout(cmd, 10000);
    res.json({ success: true, stdout });
  } catch (error) {
    logger.error({ err: error, stderr: error.stderr }, 'Failed to open file');
    return res.status(500).json({ error: error.message, stderr: error.stderr });
  }
});

// Authentication routes (excluded from middleware above)
app.post('/api/auth/register', async (req, res) => {
  return res.status(403).json({ error: 'Public registration is currently disabled' });
});

app.post('/api/auth/login', async (req, res, next) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid login credentials', details: validation.error });
  }

  try {
    const { email, password } = validation.data;
    const { user, token } = await AuthService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res, next) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// User management routes (ADMIN only)
app.get('/api/users', authorize('ADMIN'), async (req, res, next) => {
  try {
    const users = await AuthService.getAllUsers();
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/users/:id/role', authorize('ADMIN'), async (req, res, next) => {
  try {
    const user = await AuthService.updateUserRole(req.params.id, req.body.role);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/users/:id', authorize('ADMIN'), async (req, res, next) => {
  try {
    await AuthService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

function execWithTimeout(cmd, timeout = 120000) {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, { encoding: 'utf8', timeout }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

app.post('/api/search-app-info', async (req, res) => {
  const { packageName } = req.body;
  if (!packageName) {
    return res.json({ found: false, info: null });
  }

  try {
    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`,
      {
        signal: AbortSignal.timeout(8000),
      },
    );
    const html = await response.text();

    const extract = (regex) => {
      const m = html.match(regex);
      return m ? m[1].trim() : null;
    };

    const name = extract(/<h1[^>]*itemprop="name"[^>]*>([^<]+)</);
    const description = extract(/<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/);
    const developer = extract(/<a[^>]*href="[^"]*dev?id=[^"]*"[^>]*>([^<]+)</);
    const category = extract(/<a[^>]*itemprop="genre"[^>]*>([^<]+)</);
    const rating = extract(/<div[^>]*class="[^"]*TT9eCd[^"]*"[^>]*>([\d.]+)</);
    const installs = extract(/<div[^>]*class="[^"]*ClY7We[^"]*"[^>]*>([^<]+)</);
    const updated = extract(/<div[^>]*class="[^"]*xg1jie[^"]*"[^>]*>([^<]+)</);
    const sizeMatch = html.match(/<div[^>]*class="[^"]*AdyxMd[^"]*"[^>]*>([^<]+)</g);
    const size = sizeMatch && sizeMatch[1] ? sizeMatch[1].replace(/<[^>]+>/g, '').trim() : null;

    const cleanDesc = description
      ? description
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 1000)
      : null;

    res.json({
      found: !!name,
      info: name
        ? {
            name,
            description: cleanDesc,
            developer,
            category,
            rating,
            installs,
            updated,
            size,
          }
        : null,
    });
  } catch {
    res.json({ found: false, info: null });
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  logger.error({ err }, 'Unhandled error');
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

app.listen(PORT, () => {
  logger.info(`Backend server is running on http://localhost:${PORT}`);
});
