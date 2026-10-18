import { getSql } from './db';
import type { Env } from './types';

/** Open tasks due within this many days (or already overdue) go in the deadline section. */
const DEADLINE_WINDOW_DAYS = 3;
/** Max tasks listed in the to-do section; the rest are summarised as "+N". */
const TODO_LIMIT = 10;
const TIME_ZONE = 'Asia/Ho_Chi_Minh';

type Sql = ReturnType<typeof getSql>;

export interface OpenTask {
  id: string;
  title: string;
  project: string;
  assignee: string | null;
  priority: string; // P0 | P1 | P2
  dueDate: string | null; // YYYY-MM-DD
  daysLeft: number | null; // negative when overdue
}

export interface Digest {
  deadline: OpenTask[];
  priority: OpenTask[];
  todo: OpenTask[];
  todoMore: number;
}

export interface Recipient {
  memberId: string;
  name: string;
  email: string;
  telegramEnabled: boolean;
  telegramChatId: string | null;
  emailEnabled: boolean;
}

export interface ChannelResult {
  channel: 'telegram' | 'email';
  ok: boolean;
  error?: string;
}

function rows(result: any): any[] {
  return Array.isArray(result) ? result : (result?.rows ?? []);
}

/** Today's date in Vietnam (YYYY-MM-DD); deadlines are calendar dates, not instants. */
function todayInVietnam(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date());
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// ===== Message =====

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function dueLabel(t: OpenTask): string {
  if (t.dueDate === null || t.daysLeft === null) return 'chưa có deadline';
  if (t.daysLeft < 0) return `quá hạn ${-t.daysLeft} ngày (${formatDate(t.dueDate)})`;
  if (t.daysLeft === 0) return `hôm nay (${formatDate(t.dueDate)})`;
  return `còn ${t.daysLeft} ngày (${formatDate(t.dueDate)})`;
}

interface Section {
  title: string;
  tasks: OpenTask[];
  more: number;
}

function sectionsOf(d: Digest): Section[] {
  return [
    { title: '⏰ Sắp tới deadline', tasks: d.deadline, more: 0 },
    { title: '🔥 Ưu tiên cao (P0)', tasks: d.priority, more: 0 },
    { title: '📋 Việc cần làm', tasks: d.todo, more: d.todoMore },
  ].filter((s) => s.tasks.length > 0);
}

function buildText(d: Digest): string {
  const lines: string[] = [];
  for (const s of sectionsOf(d)) {
    lines.push(`${s.title} (${s.tasks.length + s.more}):`);
    for (const t of s.tasks) {
      const who = t.assignee ? ` — ${t.assignee}` : '';
      lines.push(`• [${t.priority}] ${t.title} [${t.project}]${who} · ${dueLabel(t)}`);
    }
    if (s.more > 0) lines.push(`… và ${s.more} việc khác`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

function buildHtml(d: Digest): string {
  const sections = sectionsOf(d).map((s) => {
    const items = s.tasks
      .map((t) => {
        const who = t.assignee ? ` — ${escapeHtml(t.assignee)}` : '';
        return `<li>[${escapeHtml(t.priority)}] <strong>${escapeHtml(t.title)}</strong> [${escapeHtml(t.project)}]${who} · ${dueLabel(t)}</li>`;
      })
      .join('');
    const more = s.more > 0 ? `<li>… và ${s.more} việc khác</li>` : '';
    return `<h3>${s.title} (${s.tasks.length + s.more})</h3><ul>${items}${more}</ul>`;
  });
  return `<div style="font-family:sans-serif">${sections.join('')}</div>`;
}

/** Splits open tasks into the three sections; each task appears in only one. */
function buildDigest(tasks: OpenTask[]): Digest {
  const byDeadline = (a: OpenTask, b: OpenTask) =>
    (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31') ||
    a.title.localeCompare(b.title);
  const sorted = [...tasks].sort(byDeadline);

  const deadline = sorted.filter((t) => t.daysLeft !== null && t.daysLeft <= DEADLINE_WINDOW_DAYS);
  const taken = new Set(deadline.map((t) => t.id));
  const priority = sorted.filter((t) => t.priority === 'P0' && !taken.has(t.id));
  priority.forEach((t) => taken.add(t.id));
  const rest = sorted.filter((t) => !taken.has(t.id));
  return {
    deadline,
    priority,
    todo: rest.slice(0, TODO_LIMIT),
    todoMore: Math.max(0, rest.length - TODO_LIMIT),
  };
}

// ===== Channels =====

async function sendTelegram(env: Env, chatId: string, text: string): Promise<ChannelResult> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { channel: 'telegram', ok: false, error: 'Chưa cấu hình TELEGRAM_BOT_TOKEN' };
  }
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Telegram rejects messages over 4096 characters.
    body: JSON.stringify({
      chat_id: chatId.trim(),
      text: text.length > 4000 ? `${text.slice(0, 3990)}\n…` : text,
      disable_web_page_preview: true,
    }),
  });
  if (res.ok) return { channel: 'telegram', ok: true };
  const body: any = await res.json().catch(() => null);
  return { channel: 'telegram', ok: false, error: body?.description || `HTTP ${res.status}` };
}

async function sendEmail(
  env: Env,
  to: string,
  subject: string,
  text: string,
  html: string,
): Promise<ChannelResult> {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) {
    return { channel: 'email', ok: false, error: 'Chưa cấu hình RESEND_API_KEY / MAIL_FROM' };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text, html }),
  });
  if (res.ok) return { channel: 'email', ok: true };
  const body: any = await res.json().catch(() => null);
  return { channel: 'email', ok: false, error: body?.message || `HTTP ${res.status}` };
}

async function deliver(
  env: Env,
  r: Recipient,
  subject: string,
  text: string,
  html: string,
): Promise<ChannelResult[]> {
  const jobs: Promise<ChannelResult>[] = [];
  if (r.telegramEnabled) {
    jobs.push(
      r.telegramChatId
        ? sendTelegram(env, r.telegramChatId, text)
        : Promise.resolve<ChannelResult>({
            channel: 'telegram',
            ok: false,
            error: 'Chưa nhập Chat ID',
          }),
    );
  }
  if (r.emailEnabled) jobs.push(sendEmail(env, r.email, subject, text, html));
  return Promise.all(jobs);
}

// ===== Recipients =====

function toRecipient(row: any): Recipient {
  return {
    memberId: row.id,
    name: row.name,
    email: row.email,
    telegramEnabled: !!row.telegramEnabled,
    telegramChatId: row.telegramChatId ?? null,
    emailEnabled: !!row.emailEnabled,
  };
}

async function loadAdmins(sql: Sql): Promise<Recipient[]> {
  const found = rows(
    await sql`
      SELECT m.id, m.name, m.email, n."telegramEnabled", n."telegramChatId", n."emailEnabled"
      FROM "Member" m
      LEFT JOIN "NotificationSetting" n ON n."memberId" = m.id
      WHERE m.role = 'ADMIN'`,
  );
  return found.map(toRecipient);
}

export async function loadRecipient(sql: Sql, memberId: string): Promise<Recipient | null> {
  const found = rows(
    await sql`
      SELECT m.id, m.name, m.email, n."telegramEnabled", n."telegramChatId", n."emailEnabled"
      FROM "Member" m
      LEFT JOIN "NotificationSetting" n ON n."memberId" = m.id
      WHERE m.id = ${memberId} LIMIT 1`,
  );
  return found[0] ? toRecipient(found[0]) : null;
}

export async function saveSetting(
  sql: Sql,
  memberId: string,
  s: { telegramEnabled: boolean; telegramChatId: string | null; emailEnabled: boolean },
) {
  await sql`
    INSERT INTO "NotificationSetting" ("memberId", "telegramEnabled", "telegramChatId", "emailEnabled", "updatedAt")
    VALUES (${memberId}, ${s.telegramEnabled}, ${s.telegramChatId}, ${s.emailEnabled}, now())
    ON CONFLICT ("memberId") DO UPDATE SET
      "telegramEnabled" = EXCLUDED."telegramEnabled", "telegramChatId" = EXCLUDED."telegramChatId",
      "emailEnabled" = EXCLUDED."emailEnabled", "updatedAt" = now()`;
}

// ===== Daily run =====

async function findOpenTasks(sql: Sql): Promise<OpenTask[]> {
  const today = todayInVietnam();
  const found = rows(
    await sql`
      SELECT t.id, t.title, p.name AS project, s.name AS assignee,
        t.priority::text AS priority,
        t.deadline::date::text AS "dueDate",
        (t.deadline::date - ${today}::date) AS "daysLeft"
      FROM "Task" t
      JOIN "Project" p ON p.id = t."projectId"
      LEFT JOIN "Staff" s ON s.id = t."assigneeId"
      WHERE t.status::text <> 'done' AND p.status = 'active'`,
  );
  return found.map((r: any) => ({
    ...r,
    daysLeft: r.daysLeft === null ? null : Number(r.daysLeft),
  }));
}

/** Called by the cron trigger: send admins the daily digest of deadlines, priorities and to-dos. */
export async function runDeadlineNotices(env: Env): Promise<{ tasks: number; delivered: number }> {
  const sql = getSql(env.DATABASE_URL);
  const open = await findOpenTasks(sql);
  const digest = buildDigest(open);
  if (sectionsOf(digest).length === 0) return { tasks: 0, delivered: 0 };

  const text = buildText(digest);
  const html = buildHtml(digest);
  const subject = `[Task Dashboard] ${digest.deadline.length} sắp tới deadline · ${open.length} việc đang mở`;

  let delivered = 0;
  for (const admin of await loadAdmins(sql)) {
    const results = await deliver(env, admin, subject, text, html);
    for (const r of results) {
      if (r.ok) delivered++;
      else console.error(`Daily digest via ${r.channel} to ${admin.email} failed: ${r.error}`);
    }
  }
  return { tasks: open.length, delivered };
}

/** Sends a sample message to one admin's enabled channels. */
export async function sendTestNotice(env: Env, r: Recipient): Promise<ChannelResult[]> {
  const digest = buildDigest(await findOpenTasks(getSql(env.DATABASE_URL)));
  const empty = sectionsOf(digest).length === 0;
  const body = empty ? 'Hiện không có việc nào đang mở.' : buildText(digest);
  const text = `Đây là thông báo thử.\n\n${body}`;
  const html = `<p>Đây là thông báo thử.</p>${empty ? `<p>${body}</p>` : buildHtml(digest)}`;
  return deliver(env, r, '[Task Dashboard] Thông báo thử', text, html);
}
