export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGINS: string;
  // Optional: deadline notification channels (see notifications.ts)
  TELEGRAM_BOT_TOKEN?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
}

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface RequestContext {
  user?: UserPayload;
  env: Env;
}

export type RouteHandler = (
  request: Request,
  env: Env,
  ctx: RequestContext,
  params?: Record<string, string>,
) => Promise<Response> | Response;
