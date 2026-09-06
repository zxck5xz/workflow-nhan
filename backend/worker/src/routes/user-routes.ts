import type { RouteHandler } from '../types';
import { getSql, listAllMembers, updateMemberRole, deleteMember } from '../db';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';

export const listUsersHandler: RouteHandler = wrapHandler(async (request, env, ctx) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    return errorResponse('Forbidden: Insufficient permissions', 403);
  }

  const sql = getSql(env.DATABASE_URL);
  const users = await listAllMembers(sql);

  const sanitized = users.map((u: any) => {
    const { password: _, ...rest } = u;
    return rest;
  });

  return jsonResponse({ users: sanitized });
});

export const updateRoleHandler: RouteHandler = wrapHandler(async (request, env, ctx, params) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    return errorResponse('Forbidden: Insufficient permissions', 403);
  }

  const { role } = await request.json() as any;
  const id = params?.id;

  if (!id || !role) {
    return errorResponse('Missing id or role', 400);
  }

  const sql = getSql(env.DATABASE_URL);
  const user = await updateMemberRole(sql, id, role);

  if (!user) {
    return errorResponse('User not found', 404);
  }

  const { password: _, ...userWithoutPassword } = user as any;
  return jsonResponse({ user: userWithoutPassword });
});

export const deleteUserHandler: RouteHandler = wrapHandler(async (request, env, ctx, params) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    return errorResponse('Forbidden: Insufficient permissions', 403);
  }

  const id = params?.id;
  if (!id) {
    return errorResponse('Missing user id', 400);
  }

  const sql = getSql(env.DATABASE_URL);
  await deleteMember(sql, id);

  return jsonResponse({ success: true });
});
