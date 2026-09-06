import type { Env, RequestContext, RouteHandler } from './types';
import { verifyToken, extractTokenFromHeader } from './auth';

const PUBLIC_PATHS = new Set(['/api/health', '/api/auth/register', '/api/auth/login']);

export function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };

  const allowedOrigins = env.CORS_ORIGINS;
  if (!origin || allowedOrigins === '*') {
    headers['Access-Control-Allow-Origin'] = origin || '*';
  } else {
    const allowed = allowedOrigins.split(',').map((o) => o.trim());
    if (allowed.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Vary'] = 'Origin';
    }
  }

  return headers;
}

export function jsonResponse(data: any, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

export function errorResponse(message: string, status = 500, extraHeaders?: Record<string, string>): Response {
  return jsonResponse({ error: message }, status, extraHeaders);
}

export async function authMiddleware(
  request: Request,
  env: Env,
  ctx: RequestContext,
): Promise<Response | null> {
  const url = new URL(request.url);

  if (PUBLIC_PATHS.has(url.pathname)) {
    return null;
  }

  const token = extractTokenFromHeader(request.headers.get('Authorization'));
  if (!token) {
    return errorResponse('No token provided', 401);
  }

  try {
    ctx.user = await verifyToken(token, env.JWT_SECRET);
    return null;
  } catch {
    return errorResponse('Invalid or expired token', 401);
  }
}

export function requireRole(...allowedRoles: string[]): (ctx: RequestContext) => Response | null {
  return (ctx: RequestContext) => {
    if (!ctx.user) {
      return errorResponse('Unauthorized', 401);
    }
    if (!allowedRoles.includes(ctx.user.role)) {
      return errorResponse('Forbidden: Insufficient permissions', 403);
    }
    return null;
  };
}

export function wrapHandler(handler: RouteHandler): RouteHandler {
  return async (request, env, ctx, params) => {
    try {
      return await handler(request, env, ctx, params);
    } catch (err: any) {
      console.error('Handler error:', err);
      return errorResponse(err.message || 'Internal Server Error', err.status || 500);
    }
  };
}
