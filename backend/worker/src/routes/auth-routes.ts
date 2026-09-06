import type { RouteHandler } from '../types';
import { getSql, findMemberByEmail, findMemberById } from '../db';
import { generateToken } from '../auth';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';
import bcrypt from 'bcryptjs';

export const loginHandler: RouteHandler = wrapHandler(async (request, env) => {
  const body = (await request.json()) as any;
  const { email, password } = body;

  if (!email || !password) {
    return errorResponse('Email and password are required', 400);
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse('Invalid email format', 400);
  }

  if (typeof password !== 'string' || password.length < 6) {
    return errorResponse('Password must be at least 6 characters', 400);
  }

  const sql = getSql(env.DATABASE_URL);
  const user = await findMemberByEmail(sql, email);

  if (!user || !(await bcrypt.compare(password, (user as any).password))) {
    return errorResponse('Invalid email or password', 401);
  }

  const token = await generateToken(
    { id: (user as any).id, email: (user as any).email, role: (user as any).role },
    env.JWT_SECRET,
  );

  const { password: _, ...userWithoutPassword } = user as any;
  return jsonResponse({ user: userWithoutPassword, token });
});

export const registerHandler: RouteHandler = wrapHandler(async () => {
  return errorResponse('Public registration is currently disabled', 403);
});

export const meHandler: RouteHandler = wrapHandler(async (request, env, ctx) => {
  const sql = getSql(env.DATABASE_URL);
  const user = await findMemberById(sql, ctx.user!.id);

  if (!user) {
    return errorResponse('User not found', 404);
  }

  const { password: _, ...userWithoutPassword } = user as any;
  return jsonResponse({ user: userWithoutPassword });
});
