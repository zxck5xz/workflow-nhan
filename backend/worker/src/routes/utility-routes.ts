import type { RouteHandler } from '../types';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';
import { generatePptxFromMarkdown } from '../pptx-generator';
import { evaluateGame } from '../game-eval';

// ===== Play Store Scraping (works on Workers via fetch) =====

async function scrapePlayStore(packageName: string) {
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
    const extract = (regex: RegExp) => {
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
  } catch (error: any) {
    return { found: false, info: null, error: error.message };
  }
}

async function searchPlayStoreByName(query: string) {
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
  } catch (error: any) {
    return { found: false, info: null, error: error.message };
  }
}

async function fetchPageMetadata(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'follow' });
  const finalUrl = response.url;
  const html = await response.text();

  const extract = (regex: RegExp) => {
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

// ===== Route Handlers =====

export const searchProductHandler: RouteHandler = wrapHandler(async (request) => {
  const { query } = (await request.json()) as any;
  if (!query) {
    return jsonResponse({ found: false, info: null, error: 'Missing search query' });
  }

  const trimmed = query.trim();
  const isUrl = /^https?:\/\//.test(trimmed);
  let result: any = { found: false, info: null };

  if (isUrl) {
    const playMatch = trimmed.match(/play\.google\.com\/store\/apps\/details\?id=([^&]+)/);
    if (playMatch) {
      result = await scrapePlayStore(decodeURIComponent(playMatch[1]));
      result.sourceInfo = { url: trimmed, resolvedUrl: trimmed, type: 'google_play' };
    } else {
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

  return jsonResponse(result);
});

export const searchAppInfoHandler: RouteHandler = wrapHandler(async (request) => {
  const { packageName } = (await request.json()) as any;
  if (!packageName) {
    return jsonResponse({ found: false, info: null });
  }

  try {
    const result = await scrapePlayStore(packageName);
    return jsonResponse(result);
  } catch {
    return jsonResponse({ found: false, info: null });
  }
});

// ===== Python-dependent endpoints =====
// Some rewritten in JS for Cloudflare Workers

function unavailableResponse(): Response {
  return jsonResponse(
    {
      error:
        'This endpoint requires Python subprocess execution and is not available on Cloudflare Workers. Use the Railway backend for this feature.',
      available: false,
    },
    501,
  );
}

// ===== APK Interpreter (rewritten from apk_interpreter.py) =====

function interpretApkData(data: Record<string, unknown>) {
  const pkgName = (data.packageName as string) || 'Unknown';
  const permissions = (data.permissions as string[]) || [];
  const activities = (data.activities as string[]) || [];
  const endpoints = (data.apiEndpoints as string[]) || [];

  const insights: Record<string, unknown> = {
    summary: `This application (${pkgName}) appears to be a functional mobile utility with a focus on networking and data synchronization.`,
    security_audit: [] as string[],
    product_logic: [] as string[],
  };

  // Analyze permissions
  const sensitivePerms = permissions.filter((p) =>
    ['CAMERA', 'LOCATION', 'CONTACTS', 'SMS', 'RECORD_AUDIO'].some((x) => p.includes(x)),
  );

  if (sensitivePerms.length > 0) {
    insights.security_audit.push(
      `⚠️ High-risk permissions detected: ${sensitivePerms.join(', ')}. Ensure these are justified by core features.`,
    );
  } else {
    insights.security_audit.push('✅ No high-risk hardware permissions requested.');
  }

  if (endpoints.length > 0) {
    insights.security_audit.push(
      `🌐 Communication: The app interacts with ${endpoints.length} external endpoints. Data exfiltration risk is present if endpoints are not verified.`,
    );
  }

  // Analyze Product Logic
  const hasLogin = activities.some((a) => a.includes('Login') || a.includes('Auth'));
  if (hasLogin) {
    insights.product_logic.push('🔐 Membership System: User authentication is a core component.');
  }

  const hasPayment = activities.some(
    (a) => a.includes('Payment') || a.includes('Shop') || a.includes('Billing'),
  );
  const hasBillingPerm = permissions.some((p) => p.toLowerCase().includes('billing'));
  if (hasPayment || hasBillingPerm) {
    insights.product_logic.push(
      '💰 Monetization: In-app purchases or payment processing detected.',
    );
  }

  if (activities.length > 20) {
    insights.product_logic.push(
      '📱 Complex UI: The high number of activities suggests a feature-rich application (Super App or Enterprise tool).',
    );
  }

  if (insights.product_logic.length === 0) {
    insights.product_logic.push('ℹ️ Standard Utility: App follows a simple, focused feature set.');
  }

  return insights;
}

export const interpretApkHandler: RouteHandler = wrapHandler(async (request) => {
  const data = (await request.json()) as Record<string, unknown>;
  const result = interpretApkData(data);
  return jsonResponse(result);
});

export const evaluateHandler: RouteHandler = wrapHandler(async (request) => {
  const body = (await request.json()) as Record<string, unknown>;
  const { game, genre, info, competitors, criteria } = body;

  if (!game) {
    return errorResponse('Missing required field: game', 400);
  }

  const result = await evaluateGame({
    game: game as string,
    genre: genre as string,
    info: info as string,
    competitors: competitors as string,
    criteria: criteria as string,
  });

  return jsonResponse(result);
});

export const generatePptxHandler: RouteHandler = wrapHandler(async (request) => {
  const { markdown } = (await request.json()) as { markdown: string };
  if (!markdown) {
    return errorResponse('Missing markdown content', 400);
  }

  const buffer = await generatePptxFromMarkdown(markdown);

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="presentation.pptx"`,
    },
  });
});

export const openFileHandler: RouteHandler = wrapHandler(async (request) => {
  const { filePath, fileUrl } = (await request.json()) as { filePath?: string; fileUrl?: string };

  // If fileUrl is provided, return it directly
  if (fileUrl) {
    return jsonResponse({
      success: true,
      url: fileUrl,
      message: 'Open the URL in your browser to download the file.',
    });
  }

  // If only filePath is provided, return a message (can't open locally on Workers)
  if (filePath) {
    return jsonResponse({
      success: false,
      message:
        'Cannot open files locally on Cloudflare Workers. Please download the file from the frontend instead.',
      filePath,
    });
  }

  return errorResponse('Missing filePath or fileUrl', 400);
});
