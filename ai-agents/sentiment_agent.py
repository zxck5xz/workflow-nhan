import argparse
import json
import re
import sys
import urllib.request
import urllib.parse
import ssl
from datetime import datetime, timezone

POSITIVE_WORDS = {
    'good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'best',
    'fantastic', 'wonderful', 'superb', 'outstanding', 'beautiful',
    'innovative', 'smooth', 'fast', 'reliable', 'useful', 'helpful',
    'intuitive', 'polished', 'impressive', 'recommend', 'must-have',
    'tuyệt vời', 'tốt', 'xuất sắc', 'hay', 'đỉnh', 'thích', 'yêu thích',
    'tuyệt', 'siêu', 'pro', 'đẹp', 'ổn định', 'nhanh', 'mượt'
}

NEGATIVE_WORDS = {
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'ugly',
    'boring', 'slow', 'buggy', 'broken', 'useless', 'trash', 'garbage',
    'frustrating', 'disappointing', 'poor', 'mediocre', 'crashes', 'lag',
    'spam', 'scam', 'overpriced', 'bloatware', 'annoying',
    'tệ', 'dở', 'chán', 'tồi', 'kém', 'xấu', 'chậm', 'lỗi', 'lag',
    'rác', 'vô dụng', 'thất vọng', 'phí tiền', 'lừa đảo', 'spam'
}

INTENSIFIERS = {'very', 'so', 'extremely', 'incredibly', 'really', 'too', 'quá', 'rất', 'cực kỳ'}

NEGATORS = {'not', 'no', "n't", 'never', 'không', 'chẳng', 'đéo', 'chả'}

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
}

REDDIT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html,application/xhtml+xml,*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.reddit.com/',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
}

REDDIT_SEARCH_URL = 'https://old.reddit.com/search.json?q={query}&limit={limit}&sort=relevance&t=year&restrict_sr=on'
REDDIT_COMMENTS_URL = 'https://old.reddit.com{permalink}.json?limit=10'

NITTER_INSTANCES = [
    'https://nitter.net',
    'https://nitter.lacontrevoie.fr',
    'https://nitter.1d4.us',
]

def fetch_json(url, timeout=15):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        return {'error': str(e)}

def fetch_text(url, timeout=15):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except Exception:
        return ''

def clean_text(text):
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^a-zA-Z0-9\sàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽềềểễệốồổỗộớờởỡợụủứừửữựỳỵỷỹ]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def analyze_sentiment(text):
    if not text:
        return 0.0, 'neutral'

    cleaned = clean_text(text)
    words = cleaned.split()

    score = 0.0
    word_count = 0
    negate = False

    for w in words:
        if w in NEGATORS:
            negate = True
            continue

        intensity = 1.0
        if w in INTENSIFIERS:
            intensity = 1.5
            continue

        if w in POSITIVE_WORDS:
            score += 0.25 * intensity * (-1 if negate else 1)
            word_count += 1
            negate = False
        elif w in NEGATIVE_WORDS:
            score -= 0.25 * intensity * (-1 if negate else 1)
            word_count += 1
            negate = False
        else:
            negate = False

    if word_count == 0:
        return 0.0, 'neutral'

    avg = score / word_count
    avg = max(-1.0, min(1.0, avg))

    if avg > 0.15:
        label = 'positive'
    elif avg < -0.15:
        label = 'negative'
    else:
        label = 'neutral'

    return round(avg, 4), label

def search_reddit(query, limit=25):
    encoded = urllib.parse.quote(query)
    urls_to_try = [
        f'https://old.reddit.com/search.json?q={encoded}&limit={limit}&sort=relevance&t=year&restrict_sr=on',
        f'https://www.reddit.com/search.json?q={encoded}&limit={limit}&sort=relevance&t=year',
    ]
    user_agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'python:sentiment-analysis:v1.0 (by /u/sentiment_bot)',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    ]

    for url in urls_to_try:
        for ua in user_agents:
            try:
                req = urllib.request.Request(url, headers={
                    'User-Agent': ua,
                    'Accept': 'application/json, text/html, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://www.reddit.com/',
                })
                with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
                    data = json.loads(resp.read().decode('utf-8'))
                    children = data.get('data', {}).get('children', [])
                    if children:
                        mentions = []
                        for post in children:
                            p = post.get('data', {})
                            title = p.get('title', '')
                            selftext = p.get('selftext', '')
                            combined = f"{title} {selftext}"
                            sentiment_score, sentiment_label = analyze_sentiment(combined)
                            mentions.append({
                                'subreddit': p.get('subreddit', ''),
                                'title': title[:200],
                                'url': f"https://www.reddit.com{p.get('permalink', '')}",
                                'score': p.get('score', 0),
                                'ups': p.get('ups', 0),
                                'downs': p.get('downs', 0),
                                'numComments': p.get('num_comments', 0),
                                'sentiment': sentiment_score,
                                'sentimentLabel': sentiment_label,
                                'date': datetime.fromtimestamp(p.get('created_utc', 0), tz=timezone.utc).isoformat() if p.get('created_utc') else None,
                            })
                        return mentions
            except Exception:
                continue

    return []

    if 'error' in data:
        return {'error': data['error']}

    mentions = []
    posts = data.get('data', {}).get('children', [])

    for post in posts:
        p = post.get('data', {})
        title = p.get('title', '')
        selftext = p.get('selftext', '')
        subreddit = p.get('subreddit', '')
        score = p.get('score', 0)
        num_comments = p.get('num_comments', 0)
        permalink = p.get('permalink', '')
        created_utc = p.get('created_utc', 0)
        url_full = f"https://www.reddit.com{permalink}"
        ups = p.get('ups', 0)
        downs = p.get('downs', 0)

        combined = f"{title} {selftext}"
        sentiment_score, sentiment_label = analyze_sentiment(combined)

        mentions.append({
            'subreddit': subreddit,
            'title': title[:200],
            'url': url_full,
            'score': score,
            'ups': ups,
            'downs': downs,
            'numComments': num_comments,
            'sentiment': sentiment_score,
            'sentimentLabel': sentiment_label,
            'date': datetime.fromtimestamp(created_utc, tz=timezone.utc).isoformat() if created_utc else None,
        })

    return mentions

def search_nitter(query, limit=10):
    search_query = urllib.parse.quote(query)
    mentions = []

    for instance in NITTER_INSTANCES:
        url = f"{instance}/search?q={search_query}&f=tweets"
        html = fetch_text(url, timeout=10)

        if not html or 'search' not in html.lower():
            continue

        tweets = re.findall(
            r'<div class="tweet-content[^"]*"[^>]*>(.*?)</div>',
            html, re.DOTALL
        )

        for tweet_html in tweets[:limit]:
            tweet_text = re.sub(r'<[^>]+>', '', tweet_html).strip()
            if not tweet_text:
                continue

            sentiment_score, sentiment_label = analyze_sentiment(tweet_text)

            mentions.append({
                'tweet': tweet_text[:280],
                'url': instance,
                'likes': 0,
                'sentiment': sentiment_score,
                'sentimentLabel': sentiment_label,
            })

        if mentions:
            break

    return mentions

def aggregate_sentiment(mentions):
    if not mentions:
        return 0.0, 0, 0, 0, 'neutral'

    scores = [m['sentiment'] for m in mentions]
    total = sum(scores)
    count = len(scores)
    positive_count = sum(1 for s in scores if s > 0.15)
    negative_count = sum(1 for s in scores if s < -0.15)
    neutral_count = count - positive_count - negative_count

    avg_score = round(total / count, 4)

    if avg_score > 0.15:
        overall = 'positive'
    elif avg_score < -0.15:
        overall = 'negative'
    else:
        overall = 'neutral'

    return avg_score, positive_count, negative_count, neutral_count, overall

def ensure_list(result, default=None):
    if isinstance(result, list):
        return result
    return default or []

def main():
    parser = argparse.ArgumentParser(description='Social sentiment analysis agent')
    parser.add_argument('--query', '-q', type=str, help='Product name to search')
    parser.add_argument('--limit', '-l', type=int, default=25, help='Max results')
    args = parser.parse_args()

    query = args.query or ''
    limit = args.limit or 25

    if not query:
        result = {'error': 'Missing query parameter', 'mentions': [], 'aggregate': {}}
        print(json.dumps(result, ensure_ascii=False))
        return

    reddit_raw = search_reddit(query, limit)
    twitter_raw = search_nitter(query, min(limit, 10))
    reddit_mentions = ensure_list(reddit_raw)
    twitter_mentions = ensure_list(twitter_raw)

    all_mentions = reddit_mentions + twitter_mentions
    avg_score, pos, neg, neu, overall = aggregate_sentiment(all_mentions)

    result = {
        'query': query,
        'sentimentScore': avg_score,
        'sentimentSummary': f"Overall sentiment: {overall} (score: {avg_score}). "
                            f"Found {pos} positive, {neg} negative, {neu} neutral mentions across "
                            f"{len(reddit_mentions)} Reddit posts and {len(twitter_mentions)} tweets.",
        'overallLabel': overall,
        'positiveCount': pos,
        'negativeCount': neg,
        'neutralCount': neu,
        'totalMentions': len(all_mentions),
        'redditMentions': reddit_mentions[:25],
        'twitterMentions': twitter_mentions[:10],
    }

    print(json.dumps(result, ensure_ascii=False))

if __name__ == '__main__':
    main()
