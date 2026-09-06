import type { RouteHandler } from '../types';
import { getSql, saveResearchReport, listResearchReports, loadResearchReport } from '../db';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';

// ===== Sentiment Analysis (pure JS, works on Workers) =====

const SENTIMENT_POSITIVE = new Set([
  'good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'best', 'fantastic',
  'wonderful', 'superb', 'outstanding', 'beautiful', 'innovative', 'smooth', 'fast',
  'reliable', 'useful', 'helpful', 'intuitive', 'polished', 'impressive', 'recommend',
  'must-have', 'fun', 'addictive', 'engaging', 'brilliant', 'perfect',
  'tuyệt vời', 'tốt', 'xuất sắc', 'hay', 'đỉnh', 'thích', 'yêu thích',
  'tuyệt', 'siêu', 'pro', 'đẹp', 'ổn định', 'nhanh', 'mượt',
]);

const SENTIMENT_NEGATIVE = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'ugly', 'boring',
  'slow', 'buggy', 'broken', 'useless', 'trash', 'garbage', 'frustrating',
  'disappointing', 'poor', 'mediocre', 'crashes', 'lag', 'spam', 'scam',
  'overpriced', 'bloatware', 'annoying', 'uninstalled', 'sucks', 'hated',
  'tệ', 'dở', 'chán', 'tồi', 'kém', 'xấu', 'chậm', 'lỗi', 'rác',
  'vô dụng', 'thất vọng', 'phí tiền', 'lừa đảo', 'tệ hại', 'tồi tệ',
]);

function analyzeSentimentText(text: string) {
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
    if (SENTIMENT_POSITIVE.has(w)) { score += 0.25; count++; }
    else if (SENTIMENT_NEGATIVE.has(w)) { score -= 0.25; count++; }
  }
  const avg = count > 0 ? Math.max(-1, Math.min(1, score / count)) : 0;
  return {
    score: Math.round(avg * 10000) / 10000,
    label: avg > 0.15 ? 'positive' : avg < -0.15 ? 'negative' : 'neutral',
  };
}

async function searchRedditSentiment(query: string, limit = 25) {
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
          headers: { 'User-Agent': ua, Accept: 'application/json', 'Accept-Language': 'en-US,en;q=0.9' },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) continue;
        const data = await resp.json() as any;
        const children = data?.data?.children || [];
        if (children.length === 0) continue;
        return children.map((p: any) => {
          const d = p.data || {};
          const combined = `${d.title || ''} ${d.selftext || ''}`;
          const { score, label } = analyzeSentimentText(combined);
          return {
            subreddit: d.subreddit || '',
            title: (d.title || '').slice(0, 200),
            url: `https://www.reddit.com${d.permalink || ''}`,
            score: d.score || 0, ups: d.ups || 0, downs: d.downs || 0,
            numComments: d.num_comments || 0,
            sentiment: score, sentimentLabel: label,
            date: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : null,
          };
        });
      } catch { /* continue */ }
    }
  }
  return [];
}

async function searchNitterSentiment(query: string, limit = 10) {
  const instances = ['https://nitter.net', 'https://nitter.lacontrevoie.fr', 'https://nitter.1d4.us'];
  const encoded = encodeURIComponent(query);
  for (const instance of instances) {
    try {
      const resp = await fetch(`${instance}/search?q=${encoded}&f=tweets`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(8000),
      });
      if (!resp.ok) continue;
      const html = await resp.text();
      const tweetRegex = /<div class="tweet-content[^"]*"[^>]*>(.*?)<\/div>/gs;
      const tweets: any[] = [];
      let match;
      while ((match = tweetRegex.exec(html)) !== null && tweets.length < limit) {
        const text = match[1].replace(/<[^>]+>/g, '').trim();
        if (!text) continue;
        const { score, label } = analyzeSentimentText(text);
        tweets.push({ tweet: text.slice(0, 280), url: instance, sentiment: score, sentimentLabel: label });
      }
      if (tweets.length > 0) return tweets;
    } catch { /* continue */ }
  }
  return [];
}

// ===== Route Handlers =====

export const sentimentHandler: RouteHandler = wrapHandler(async (request, env) => {
  const { query, reportId } = await request.json() as any;
  if (!query) {
    return errorResponse('Missing query parameter', 400);
  }

  const [redditMentions, twitterMentions] = await Promise.all([
    searchRedditSentiment(query, 25),
    searchNitterSentiment(query, 10).catch(() => []),
  ]);

  const allMentions = [...redditMentions, ...twitterMentions];
  const avgScore = allMentions.length > 0
    ? Math.round((allMentions.reduce((s, m) => s + m.sentiment, 0) / allMentions.length) * 10000) / 10000
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
      const sql = getSql(env.DATABASE_URL);
      const existing = await loadResearchReport(sql, reportId);
      if (existing) {
        await saveResearchReport(sql, {
          ...(existing as any),
          sentimentScore: sentimentResult.sentimentScore,
          sentimentSummary: sentimentResult.sentimentSummary,
          redditMentions: sentimentResult.redditMentions,
          twitterMentions: sentimentResult.twitterMentions,
        });
      }
    } catch { /* best-effort */ }
  }

  return jsonResponse(sentimentResult);
});

export const listReportsHandler: RouteHandler = wrapHandler(async (request, env) => {
  const sql = getSql(env.DATABASE_URL);
  const reports = await listResearchReports(sql);
  return jsonResponse({ reports });
});

export const saveReportHandler: RouteHandler = wrapHandler(async (request, env) => {
  const report = await request.json();
  const sql = getSql(env.DATABASE_URL);
  const saved = await saveResearchReport(sql, report);
  return jsonResponse({ success: true, report: saved });
});

export const getReportHandler: RouteHandler = wrapHandler(async (request, env, ctx, params) => {
  const id = params?.id;
  if (!id) return errorResponse('Missing report id', 400);

  const sql = getSql(env.DATABASE_URL);
  const report = await loadResearchReport(sql, id);

  if (!report) return errorResponse('Research report not found', 404);
  return jsonResponse(report);
});
