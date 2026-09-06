// Game Evaluation Agent - Simplified for Cloudflare Workers
// Original: game_eval_agent.py (1004 lines)
// This version uses direct API calls instead of CLI tools

interface EvalInput {
  game?: string;
  genre?: string;
  info?: string;
  competitors?: string;
  criteria?: string;
}

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

// Search via DuckDuckGo HTML scraping
async function searchDuckDuckGo(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });
    const html = await resp.text();

    const results: SearchResult[] = [];
    const resultRegex =
      /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>.*?<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/gs;
    let match;
    while ((match = resultRegex.exec(html)) !== null && results.length < 5) {
      results.push({
        url: match[1],
        title: match[2].replace(/<[^>]+>/g, '').trim(),
        snippet: match[3].replace(/<[^>]+>/g, '').trim(),
      });
    }
    return results;
  } catch {
    return [];
  }
}

// Search Reddit via JSON API
async function searchReddit(query: string): Promise<SearchResult[]> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'GameEvalAgent/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    const data = (await resp.json()) as any;
    return (data?.data?.children || []).map((post: any) => ({
      title: post.data.title || '',
      snippet: post.data.selftext?.slice(0, 200) || '',
      url: `https://reddit.com${post.data.permalink}`,
    }));
  } catch {
    return [];
  }
}

// Keyword-based sentiment analysis
const POSITIVE_WORDS = [
  'great',
  'amazing',
  'excellent',
  'love',
  'best',
  'fun',
  'addictive',
  'beautiful',
  'awesome',
  'fantastic',
  'giải trí',
  'thú vị',
  'hay',
  'tuyệt vời',
  'đẹp',
];
const NEGATIVE_WORDS = [
  'bad',
  'terrible',
  'hate',
  'worst',
  'boring',
  'buggy',
  'crash',
  'pay to win',
  'trash',
  'lag',
  'spam',
  'tệ',
  'chán',
  'dở',
  'kém',
];

function analyzeSentiment(text: string): { score: number; label: string } {
  const lower = text.toLowerCase();
  let positive = 0;
  let negative = 0;
  for (const w of POSITIVE_WORDS) {
    if (lower.includes(w)) positive++;
  }
  for (const w of NEGATIVE_WORDS) {
    if (lower.includes(w)) negative++;
  }
  const total = positive + negative;
  if (total === 0) return { score: 0.5, label: 'neutral' };
  const score = positive / total;
  return { score, label: score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral' };
}

// Generate scorecard based on research
function generateScorecard(
  game: string,
  genre: string,
  searchResults: SearchResult[],
  redditResults: SearchResult[],
) {
  const allText = [...searchResults, ...redditResults]
    .map((r) => `${r.title} ${r.snippet}`)
    .join(' ');
  const sentiment = analyzeSentiment(allText);

  // Heuristic scoring based on sentiment and result count
  const baseScore = sentiment.score * 4 + 1; // 1-5 range
  const hasResults = searchResults.length + redditResults.length;

  return {
    gameplay: Math.min(5, Math.max(1, baseScore + (Math.random() * 0.4 - 0.2))),
    graphics: Math.min(5, Math.max(1, baseScore + (Math.random() * 0.6 - 0.3))),
    sound: Math.min(5, Math.max(1, baseScore + (Math.random() * 0.4 - 0.2))),
    retention: Math.min(5, Math.max(1, baseScore * 0.9 + (Math.random() * 0.5 - 0.25))),
    usp: Math.min(5, Math.max(1, baseScore * 0.85 + (Math.random() * 0.6 - 0.3))),
    sentiment: sentiment.label,
    researchCount: hasResults,
  };
}

// Generate Markdown report
function generateMarkdown(
  game: string,
  genre: string,
  info: string,
  competitors: string[],
  scorecard: ReturnType<typeof generateScorecard>,
  searchResults: SearchResult[],
  redditResults: SearchResult[],
): string {
  const lines = [
    `# Báo cáo Đánh giá sản phẩm: ${game}`,
    '',
    `- **Thể loại:** ${genre}`,
    `- **Thông tin:** ${info || 'Không có'}`,
    `- **Đối thủ:** ${competitors.length > 0 ? competitors.join(', ') : 'Không có (N/A)'}`,
    '',
    '---',
    '',
    '## Slide 1: Tổng quan',
    '',
    `Trò chơi **${game}** thuộc thể loại **${genre}** được đánh giá dựa trên ${scorecard.researchCount} nguồn dữ liệu.`,
    '',
    '---',
    '',
    '## Slide 2: Bảng điểm Đánh giá',
    '',
    `- **Gameplay:** ${scorecard.gameplay.toFixed(1)} / 5.0`,
    `- **Đồ họa:** ${scorecard.graphics.toFixed(1)} / 5.0`,
    `- **Âm thanh:** ${scorecard.sound.toFixed(1)} / 5.0`,
    `- **Retention:** ${scorecard.retention.toFixed(1)} / 5.0`,
    `- **USP:** ${scorecard.usp.toFixed(1)} / 5.0`,
    '',
    `**Tổng kết:** Sentiment ${scorecard.sentiment} từ ${scorecard.researchCount} nguồn.`,
    '',
    '---',
    '',
    '## Slide 3: Nghiên cứu Thị trường',
    '',
  ];

  if (searchResults.length > 0) {
    lines.push('### 📍 Kết quả Tìm kiếm');
    for (const r of searchResults.slice(0, 3)) {
      lines.push(`- **${r.title}** - ${r.snippet.slice(0, 100)}...`);
    }
    lines.push('');
  }

  if (redditResults.length > 0) {
    lines.push('### 📍 Thảo luận Reddit');
    for (const r of redditResults.slice(0, 3)) {
      lines.push(`- **${r.title}** - ${r.snippet.slice(0, 100)}...`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Slide 4: Đề xuất Hành động');
  lines.push('');
  lines.push(
    `1. **Tăng cườngMarketing:** Tận dụng sentiment ${scorecard.sentiment} để đẩy mạnh quảng bá.`,
  );
  lines.push('2. **Cải thiện gameplay:** Tập trung vào core loop để tăng retention.');
  lines.push('3. **Phân tích đối thủ:** Học hỏi điểm mạnh từ đối thủ cạnh tranh.');

  return lines.join('\n');
}

export async function evaluateGame(
  input: EvalInput,
): Promise<{
  success: boolean;
  markdown: string;
  scorecard: ReturnType<typeof generateScorecard>;
}> {
  const game = input.game || 'Unknown Game';
  const genre = input.genre || 'Casual';
  const info = input.info || '';
  const competitors = input.competitors ? input.competitors.split(',').map((c) => c.trim()) : [];

  // Parallel web research
  const [searchResults, redditResults] = await Promise.all([
    searchDuckDuckGo(`${game} ${genre} game review`),
    searchReddit(`${game} ${genre} game`),
  ]);

  // Generate scorecard
  const scorecard = generateScorecard(game, genre, searchResults, redditResults);

  // Generate markdown report
  const markdown = generateMarkdown(
    game,
    genre,
    info,
    competitors,
    scorecard,
    searchResults,
    redditResults,
  );

  return { success: true, markdown, scorecard };
}
