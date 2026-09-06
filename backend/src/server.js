import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
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
const APK_INTERPRET_SCRIPT = path.join(PYTHON_DIR, 'apk_interpreter.py');
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

app.post('/api/interpret-apk', async (req, res, next) => {
  const apkData = req.body;
  const tempFile = path.join(__dirname, `temp_apk_${Date.now()}.json`);

  try {
    fs.writeFileSync(tempFile, JSON.stringify(apkData));
    const cmd = `python "${APK_INTERPRET_SCRIPT}" < "${tempFile}"`;

    const { stdout, stderr } = await execWithTimeout(cmd, 30000);
    fs.unlinkSync(tempFile); // Clean up

    try {
      const interpretation = JSON.parse(stdout);
      res.json(interpretation);
    } catch (parseError) {
      logger.error(
        { err: parseError, stdout, stderr },
        'Failed to parse APK interpretation output',
      );
      res.status(500).json({ error: 'Failed to parse interpretation results', stdout, stderr });
    }
  } catch (error) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    logger.error({ err: error, stderr: error.stderr }, 'APK interpretation error');
    res.status(500).json({ error: error.message, stderr: error.stderr });
  }
});

// --- Sentiment Analysis (Node.js native, no Python dependency) ---

const SENTIMENT_POSITIVE = new Set([
  'good',
  'great',
  'excellent',
  'amazing',
  'awesome',
  'love',
  'best',
  'fantastic',
  'wonderful',
  'superb',
  'outstanding',
  'beautiful',
  'innovative',
  'smooth',
  'fast',
  'reliable',
  'useful',
  'helpful',
  'intuitive',
  'polished',
  'impressive',
  'recommend',
  'must-have',
  'fun',
  'addictive',
  'engaging',
  'brilliant',
  'perfect',
  'tuyệt vời',
  'tốt',
  'xuất sắc',
  'hay',
  'đỉnh',
  'thích',
  'yêu thích',
  'tuyệt',
  'siêu',
  'pro',
  'đẹp',
  'ổn định',
  'nhanh',
  'mượt',
  'tuyệt vời',
  'xuất sắc',
]);

const SENTIMENT_NEGATIVE = new Set([
  'bad',
  'terrible',
  'awful',
  'horrible',
  'worst',
  'hate',
  'ugly',
  'boring',
  'slow',
  'buggy',
  'broken',
  'useless',
  'trash',
  'garbage',
  'frustrating',
  'disappointing',
  'poor',
  'mediocre',
  'crashes',
  'lag',
  'spam',
  'scam',
  'overpriced',
  'bloatware',
  'annoying',
  'uninstalled',
  'trash',
  'sucks',
  'hated',
  'tệ',
  'dở',
  'chán',
  'tồi',
  'kém',
  'xấu',
  'chậm',
  'lỗi',
  'lag',
  'rác',
  'vô dụng',
  'thất vọng',
  'phí tiền',
  'lừa đảo',
  'spam',
  'tệ hại',
  'tồi tệ',
]);

function analyzeSentimentText(text) {
  if (!text) return { score: 0, label: 'neutral' };
  const cleaned = text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^a-z0-9\sàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽềềểễệốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/);
  let score = 0;
  let count = 0;
  for (const w of words) {
    if (SENTIMENT_POSITIVE.has(w)) {
      score += 0.25;
      count++;
    } else if (SENTIMENT_NEGATIVE.has(w)) {
      score -= 0.25;
      count++;
    }
  }
  const avg = count > 0 ? Math.max(-1, Math.min(1, score / count)) : 0;
  return {
    score: Math.round(avg * 10000) / 10000,
    label: avg > 0.15 ? 'positive' : avg < -0.15 ? 'negative' : 'neutral',
  };
}

async function searchRedditSentiment(query, limit = 25) {
  const encoded = encodeURIComponent(query);
  const urls = [
    `https://old.reddit.com/search.json?q=${encoded}&limit=${limit}&sort=relevance&t=year&restrict_sr=on`,
    `https://www.reddit.com/search.json?q=${encoded}&limit=${limit}&sort=relevance&t=year`,
  ];
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'python:sentiment-analysis:v1.0 (by /u/sentiment_bot)',
  ];

  for (const url of urls) {
    for (const ua of agents) {
      try {
        const resp = await fetch(url, {
          headers: {
            'User-Agent': ua,
            Accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) {
          console.error(`[Reddit Search] Error ${resp.status} for ${url} with UA ${ua.slice(0, 20)}...`);
          continue;
        }
        const data = await resp.json();
        const children = data?.data?.children || [];
        if (children.length === 0) continue;
        return children.map((p) => {
          const d = p.data || {};
          const combined = `${d.title || ''} ${d.selftext || ''}`;
          const { score, label } = analyzeSentimentText(combined);
          return {
            subreddit: d.subreddit || '',
            title: (d.title || '').slice(0, 200),
            url: `https://www.reddit.com${d.permalink || ''}`,
            score: d.score || 0,
            ups: d.ups || 0,
            downs: d.downs || 0,
            numComments: d.num_comments || 0,
            sentiment: score,
            sentimentLabel: label,
            date: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : null,
          };
        });
      } catch (err) {
        console.error(`[Reddit Search] Fetch failed for ${url}: ${err.message}`);
      }
    }
  }
  return [];
}

async function searchNitterSentiment(query, limit = 10) {
  const instances = [
    'https://nitter.net',
    'https://nitter.lacontrevoie.fr',
    'https://nitter.1d4.us',
  ];
  const encoded = encodeURIComponent(query);
  for (const instance of instances) {
    try {
      const resp = await fetch(`${instance}/search?q=${encoded}&f=tweets`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) {
        console.error(`[Nitter Search] Error ${resp.status} for ${instance}`);
        continue;
      }
      const html = await resp.text();
      const tweetRegex = /<div class="tweet-content[^"]*"[^>]*>(.*?)<\/div>/gs;
      const tweets = [];
      let match;
      while ((match = tweetRegex.exec(html)) !== null && tweets.length < limit) {
        const text = match[1].replace(/<[^>]+>/g, '').trim();
        if (!text) continue;
        const { score, label } = analyzeSentimentText(text);
        tweets.push({
          tweet: text.slice(0, 280),
          url: instance,
          sentiment: score,
          sentimentLabel: label,
        });
      }
      if (tweets.length > 0) return tweets;
    } catch (err) {
      console.error(`[Nitter Search] Fetch failed for ${instance}: ${err.message}`);
    }
  }
  return [];
}

app.post('/api/research/sentiment', async (req, res, next) => {
  const { query, reportId } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const [redditMentions, twitterMentions] = await Promise.all([
      searchRedditSentiment(query, 25),
      searchNitterSentiment(query, 10).catch(() => []),
    ]);

    const allMentions = [...redditMentions, ...twitterMentions];
    const avgScore =
      allMentions.length > 0
        ? Math.round(
            (allMentions.reduce((s, m) => s + m.sentiment, 0) / allMentions.length) * 10000,
          ) / 10000
        : 0;
    const pos = allMentions.filter((m) => m.sentiment > 0.15).length;
    const neg = allMentions.filter((m) => m.sentiment < -0.15).length;
    const neu = allMentions.length - pos - neg;
    const overall = avgScore > 0.15 ? 'positive' : avgScore < -0.15 ? 'negative' : 'neutral';

    const sentimentResult = {
      query,
      sentimentScore: avgScore,
      sentimentSummary: `Overall sentiment: ${overall} (score: ${avgScore}). Found ${pos} positive, ${neg} negative, ${neu} neutral mentions across ${redditMentions.length} Reddit posts and ${twitterMentions.length} tweets.`,
      overallLabel: overall,
      positiveCount: pos,
      negativeCount: neg,
      neutralCount: neu,
      totalMentions: allMentions.length,
      redditMentions,
      twitterMentions,
    };

    if (reportId) {
      try {
        const ds = await getDataStore();
        const existing = await ds.loadResearchReport(reportId);
        if (existing) {
          await ds.saveResearchReport({
            ...existing,
            sentimentScore: sentimentResult.sentimentScore,
            sentimentSummary: sentimentResult.sentimentSummary,
            redditMentions: sentimentResult.redditMentions,
            twitterMentions: sentimentResult.twitterMentions,
          });
        }
      } catch {
        /* report update is best-effort */
      }
    }

    res.json(sentimentResult);
  } catch (error) {
    logger.error({ err: error }, 'Sentiment analysis error');
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/research-reports', async (req, res, next) => {
  try {
    const ds = await getDataStore();
    const reports = await ds.listResearchReports();
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

app.post('/api/research-reports', async (req, res, next) => {
  try {
    const ds = await getDataStore();
    const report = await ds.saveResearchReport(req.body);
    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
});

app.get('/api/research-reports/:id', async (req, res, next) => {
  try {
    const ds = await getDataStore();
    const report = await ds.loadResearchReport(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Research report not found' });
    }
    res.json(report);
  } catch (error) {
    next(error);
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

async function scrapePlayStore(packageName) {
  try {
    const response = await fetch(
      `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageName)}&hl=en`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      return { found: false, info: null, error: `Google Play returned status ${response.status}` };
    }

    const html = await response.text();

    const extract = (regex) => {
      const m = html.match(regex);
      return m && m[1] ? m[1].trim() : null;
    };

    const name =
      extract(/<h1[^>]*itemprop="name"[^>]*>([^<]+)</) ||
      extract(/<title[^>]*>([^<]+) - Apps on Google Play<\/title>/);

    if (!name) {
      return { found: false, info: null, error: 'Product name not found on page' };
    }

    const description =
      extract(/<meta[^>]*name="description"[^>]*content="([^"]+)"/) ||
      extract(/<div[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/div>/);
    const developer =
      extract(/<a[^>]*href="[^"]*developer\?id=[^"]*"[^>]*>([^<]+)</) ||
      extract(/<a[^>]*href="[^"]*dev\?id=[^"]*"[^>]*>([^<]+)</);
    const category =
      extract(/<a[^>]*itemprop="genre"[^>]*>([^<]+)</) ||
      extract(/<a[^>]*href="[^"]*\/store\/apps\/category\/[^"]*"[^>]*>([^<]+)<\/a>/);
    const rating =
      extract(/<div[^>]*aria-label="Rated ([\d.]+) stars out of five"/) ||
      extract(/<div[^>]*class="[^"]*TT9eCd[^"]*"[^>]*>([\d.]+)</);
    const installs =
      extract(/<div[^>]*aria-label="([^"]+ installs)"/) ||
      extract(/<div[^>]*class="[^"]*ClY7We[^"]*"[^>]*>([^<]+)</);
    const updated = extract(/<div[^>]*class="[^"]*xg1jie[^"]*"[^>]*>([^<]+)</);

    // More robust size extraction
    const sizeMatch = html.match(/<div[^>]*class="[^"]*AdyxMd[^"]*"[^>]*>([^<]+)</);
    const size = sizeMatch ? sizeMatch[1].replace(/<[^>]+>/g, '').trim() : null;

    const cleanDesc = description
      ? description
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 1000)
      : null;

    return {
      found: true,
      packageName,
      info: { name, description: cleanDesc, developer, category, rating, installs, updated, size },
    };
  } catch (error) {
    logger.error({ err: error, packageName }, 'scrapePlayStore error');
    return { found: false, info: null, error: error.message };
  }
}

async function searchPlayStoreByName(query) {
  try {
    const searchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps&hl=en`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      return { found: false, info: null, error: `Search failed with status ${response.status}` };
    }

    const html = await response.text();
    const pkgMatch = html.match(/\/store\/apps\/details\?id=([a-zA-Z0-9._-]+)/);

    if (pkgMatch) {
      const packageName = decodeURIComponent(pkgMatch[1]);
      return scrapePlayStore(packageName);
    }

    return { found: false, info: null, error: 'No matching product found on Google Play' };
  } catch (error) {
    logger.error({ err: error, query }, 'searchPlayStoreByName error');
    return { found: false, info: null, error: error.message };
  }
}

async function fetchPageMetadata(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    redirect: 'follow',
  });
  const finalUrl = response.url;
  const html = await response.text();

  const extract = (regex) => {
    const m = html.match(regex);
    return m ? m[1].trim() : null;
  };

  const ogTitle = extract(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
  const ogDescription = extract(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i);
  const ogSiteName = extract(/<meta[^>]*property="og:site_name"[^>]*content="([^"]+)"/i);
  const ogImage = extract(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i);
  const pageTitle = extract(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDesc = extract(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);

  const cleanDesc = (ogDescription || metaDesc || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000);

  return {
    url: finalUrl,
    title: ogTitle || pageTitle || null,
    description: cleanDesc || null,
    siteName: ogSiteName || null,
    image: ogImage || null,
  };
}

app.post('/api/search-product', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.json({ found: false, info: null, error: 'Missing search query' });
  }

  try {
    const trimmed = query.trim();
    const isUrl = /^https?:\/\//.test(trimmed);
    let result = { found: false, info: null };

    if (isUrl) {
      const playMatch = trimmed.match(/play\.google\.com\/store\/apps\/details\?id=([^&]+)/);
      if (playMatch) {
        result = await scrapePlayStore(decodeURIComponent(playMatch[1]));
        result.sourceInfo = { url: trimmed, resolvedUrl: trimmed, type: 'google_play' };
      } else {
        // Fetch any URL — promo link, short link, etc.
        const metadata = await fetchPageMetadata(trimmed);
        if (metadata.title) {
          const searchResult = await searchPlayStoreByName(metadata.title);
          if (searchResult.found) {
            result = searchResult;
          } else {
            result = {
              found: true,
              packageName: null,
              info: {
                name: metadata.title,
                description: metadata.description,
                developer: metadata.siteName,
                category: null,
                rating: null,
                installs: null,
                updated: null,
                size: null,
              },
            };
          }
        } else {
          result = {
            found: false,
            info: null,
            error: 'Could not extract product info from this URL.',
          };
        }
        result.sourceInfo = {
          url: trimmed,
          resolvedUrl: metadata.url,
          title: metadata.title,
          siteName: metadata.siteName,
          type: 'promo_link',
        };
      }
    } else {
      result = await searchPlayStoreByName(trimmed);
      if (result) {
        result.sourceInfo = { query: trimmed, type: 'name_search' };
      } else {
        result = { found: false, info: null, error: 'Search returned no result' };
      }
    }

    res.json(result);
  } catch (error) {
    logger.error({ err: error, query }, 'Product search route error');
    res.json({
      found: false,
      info: null,
      error: `Search error: ${error.message || 'Unknown error'}`,
    });
  }
});

app.post('/api/search-app-info', async (req, res) => {
  const { packageName } = req.body;
  if (!packageName) {
    return res.json({ found: false, info: null });
  }

  try {
    const result = await scrapePlayStore(packageName);
    res.json(result);
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
