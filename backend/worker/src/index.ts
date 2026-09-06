import type { Env, RequestContext } from './types';
import { corsHeaders, jsonResponse, authMiddleware, wrapHandler } from './middleware';

// Auth routes
import { loginHandler, registerHandler, meHandler } from './routes/auth-routes';
// User routes
import { listUsersHandler, updateRoleHandler, deleteUserHandler } from './routes/user-routes';
// Data routes
import {
  getAppDataHandler,
  saveAppDataHandler,
  createSnapshotHandler,
  listSnapshotsHandler,
  getSnapshotHandler,
} from './routes/data-routes';
// Research routes
import {
  sentimentHandler,
  listReportsHandler,
  saveReportHandler,
  getReportHandler,
} from './routes/research-routes';
// Utility routes
import {
  searchProductHandler,
  searchAppInfoHandler,
  evaluateHandler,
  generatePptxHandler,
  openFileHandler,
  interpretApkHandler,
} from './routes/utility-routes';

// Simple route matcher
type RouteEntry = {
  method: string;
  pattern: RegExp;
  paramNames: string[];
  handler: Function;
};

function buildRoutes(): RouteEntry[] {
  const routeDefs: [string, string, Function][] = [
    ['GET', '/api/health', healthHandler],
    ['POST', '/api/auth/register', registerHandler],
    ['POST', '/api/auth/login', loginHandler],
    ['GET', '/api/auth/me', meHandler],
    ['GET', '/api/users', listUsersHandler],
    ['PATCH', '/api/users/:id/role', updateRoleHandler],
    ['DELETE', '/api/users/:id', deleteUserHandler],
    ['GET', '/api/app-data', getAppDataHandler],
    ['POST', '/api/app-data', saveAppDataHandler],
    ['POST', '/api/snapshot', createSnapshotHandler],
    ['GET', '/api/snapshots', listSnapshotsHandler],
    ['GET', '/api/snapshots/:date', getSnapshotHandler],
    ['POST', '/api/evaluate', evaluateHandler],
    ['POST', '/api/generate-pptx', generatePptxHandler],
    ['POST', '/api/open-file', openFileHandler],
    ['POST', '/api/interpret-apk', interpretApkHandler],
    ['POST', '/api/research/interpret', interpretApkHandler],
    ['POST', '/api/research/sentiment', sentimentHandler],
    ['GET', '/api/research-reports', listReportsHandler],
    ['POST', '/api/research-reports', saveReportHandler],
    ['GET', '/api/research-reports/:id', getReportHandler],
    ['POST', '/api/search-product', searchProductHandler],
    ['POST', '/api/search-app-info', searchAppInfoHandler],
  ];

  return routeDefs.map(([method, path, handler]) => {
    const paramNames: string[] = [];
    const patternStr = path.replace(/:([a-zA-Z]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    return {
      method,
      pattern: new RegExp(`^${patternStr}$`),
      paramNames,
      handler,
    };
  });
}

const routes = buildRoutes();

function healthHandler() {
  return jsonResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: 'cloudflare-workers',
  });
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(env, request.headers.get('Origin')),
    });
  }

  // Find matching route
  for (const route of routes) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (!match) continue;

    // Build params
    const params: Record<string, string> = {};
    route.paramNames.forEach((name, i) => {
      params[name] = match[i + 1];
    });

    // Auth middleware
    const ctx: RequestContext = { env };
    const authResponse = await authMiddleware(request, env, ctx);
    if (authResponse) {
      const headers = corsHeaders(env, request.headers.get('Origin'));
      return new Response(authResponse.body, {
        status: authResponse.status,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // Execute handler
    const response = await (route.handler as Function)(request, env, ctx, params);

    // Add CORS headers
    const cors = corsHeaders(env, request.headers.get('Origin'));
    const newHeaders = new Headers(response.headers);
    Object.entries(cors).forEach(([k, v]) => newHeaders.set(k, v));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }

  // 404
  return jsonResponse({ error: 'Not Found' }, 404, corsHeaders(env, request.headers.get('Origin')));
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Validate required secrets on first request
    if (!env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET is not set in Worker environment');
      return jsonResponse({ error: 'Server configuration error' }, 500);
    }
    if (!env.DATABASE_URL) {
      console.error('FATAL: DATABASE_URL is not set in Worker environment');
      return jsonResponse({ error: 'Server configuration error' }, 500);
    }

    try {
      return await handleRequest(request, env);
    } catch (err: any) {
      console.error('Unhandled error:', err);
      return jsonResponse(
        { error: err.message || 'Internal Server Error' },
        500,
        corsHeaders(env, request.headers.get('Origin')),
      );
    }
  },
};
