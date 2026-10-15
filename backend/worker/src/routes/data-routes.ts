import type { RouteHandler } from '../types';
import {
  getSql,
  loadAllData,
  saveAllData,
  saveSnapshot,
  listSnapshots,
  loadSnapshot,
  deleteTask,
  deleteProject,
  deleteStaff,
} from '../db';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';

export const getAppDataHandler: RouteHandler = wrapHandler(async (request, env) => {
  const sql = getSql(env.DATABASE_URL);
  const data = await loadAllData(sql);
  return jsonResponse(data);
});

export const saveAppDataHandler: RouteHandler = wrapHandler(async (request, env, ctx) => {
  const payload = await request.json();
  const sql = getSql(env.DATABASE_URL);
  const saved = await saveAllData(sql, payload);
  return jsonResponse({ success: true, data: saved });
});

export const createSnapshotHandler: RouteHandler = wrapHandler(async (request, env) => {
  const sql = getSql(env.DATABASE_URL);
  const data = await loadAllData(sql);
  const snapshotFile = await saveSnapshot(sql, data);
  return jsonResponse({ success: true, snapshotFile });
});

export const listSnapshotsHandler: RouteHandler = wrapHandler(async (request, env) => {
  const sql = getSql(env.DATABASE_URL);
  const snapshots = await listSnapshots(sql);
  return jsonResponse({ snapshots });
});

export const getSnapshotHandler: RouteHandler = wrapHandler(async (request, env, ctx, params) => {
  const date = params?.date;
  if (!date) {
    return errorResponse('Missing date parameter', 400);
  }

  const sql = getSql(env.DATABASE_URL);
  const snapshot = await loadSnapshot(sql, date);

  if (!snapshot) {
    return errorResponse('Snapshot not found', 404);
  }

  return jsonResponse(snapshot);
});

// /api/app-data only upserts, so deletions need their own calls
function deleteHandler(remove: typeof deleteTask): RouteHandler {
  return wrapHandler(async (request, env, ctx, params) => {
    if (!ctx.user || ctx.user.role === 'VIEWER') {
      return errorResponse('Forbidden: Insufficient permissions', 403);
    }
    const id = params?.id;
    if (!id) {
      return errorResponse('Missing id', 400);
    }
    await remove(getSql(env.DATABASE_URL), id);
    return jsonResponse({ success: true });
  });
}

export const deleteTaskHandler = deleteHandler(deleteTask);
export const deleteProjectHandler = deleteHandler(deleteProject);
export const deleteStaffHandler = deleteHandler(deleteStaff);
