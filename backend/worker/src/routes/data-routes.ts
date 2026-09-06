import type { RouteHandler } from '../types';
import {
  getSql, loadAllData, saveAllData,
  saveSnapshot, listSnapshots, loadSnapshot,
} from '../db';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';

export const getAppDataHandler: RouteHandler = wrapHandler(async (request, env) => {
  const sql = getSql(env.DATABASE_URL);
  const data = await loadAllData(sql);
  return jsonResponse(data);
});

export const saveAppDataHandler: RouteHandler = wrapHandler(async (request, env) => {
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
