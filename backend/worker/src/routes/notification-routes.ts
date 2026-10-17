import type { RouteHandler } from '../types';
import { getSql } from '../db';
import { jsonResponse, errorResponse, wrapHandler } from '../middleware';
import { loadRecipient, saveSetting, sendTestNotice, type Recipient } from '../notifications';

function settingFor(r: Recipient | null) {
  return {
    email: r?.email ?? '',
    telegramEnabled: r?.telegramEnabled ?? false,
    telegramChatId: r?.telegramChatId ?? '',
    emailEnabled: r?.emailEnabled ?? false,
  };
}

export const getNotificationSettingsHandler: RouteHandler = wrapHandler(async (_req, env, ctx) => {
  if (ctx.user?.role !== 'ADMIN') return errorResponse('Forbidden: Insufficient permissions', 403);
  const recipient = await loadRecipient(getSql(env.DATABASE_URL), ctx.user.id);
  return jsonResponse(settingFor(recipient));
});

export const saveNotificationSettingsHandler: RouteHandler = wrapHandler(
  async (request, env, ctx) => {
    if (ctx.user?.role !== 'ADMIN')
      return errorResponse('Forbidden: Insufficient permissions', 403);

    const body = (await request.json()) as any;
    const chatId = typeof body.telegramChatId === 'string' ? body.telegramChatId.trim() : '';
    const telegramEnabled = !!body.telegramEnabled;
    if (telegramEnabled && !/^-?\d+$/.test(chatId)) {
      return errorResponse('Telegram Chat ID phải là một số', 400);
    }

    const sql = getSql(env.DATABASE_URL);
    await saveSetting(sql, ctx.user.id, {
      telegramEnabled,
      telegramChatId: chatId || null,
      emailEnabled: !!body.emailEnabled,
    });
    return jsonResponse(settingFor(await loadRecipient(sql, ctx.user.id)));
  },
);

export const testNotificationHandler: RouteHandler = wrapHandler(async (_req, env, ctx) => {
  if (ctx.user?.role !== 'ADMIN') return errorResponse('Forbidden: Insufficient permissions', 403);
  const recipient = await loadRecipient(getSql(env.DATABASE_URL), ctx.user.id);
  if (!recipient) return errorResponse('User not found', 404);
  if (!recipient.telegramEnabled && !recipient.emailEnabled) {
    return errorResponse('Chưa bật kênh thông báo nào', 400);
  }
  return jsonResponse({ results: await sendTestNotice(env, recipient) });
});
