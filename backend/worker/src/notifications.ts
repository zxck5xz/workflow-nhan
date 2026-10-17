import { getSql } from './db';
import type { Env } from './types';

/** Reminders go out this many days before a task's deadline. */
const REMIND_DAYS = [3, 1];
const TIME_ZONE = 'Asia/Ho_Chi_Minh';

type Sql = ReturnType<typeof getSql>;

export interface DueTask {
  id: string;
  title: string;
  project: string;
  assignee: string | null;
  dueDate: string; // YYYY-MM-DD
  daysBefore: number;
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

function buildText(tasks: DueTask[]): string {
  const lines: string[] = [];
  for (const days of REMIND_DAYS) {
    const group = tasks.filter((t) => t.daysBefore === days);
    if (group.length === 0) continue;
    lines.push(`⏰ Còn ${days} ngày tới deadline (${group.length} task):`);
    for (const t of group) {
      const who = t.assignee ? ` — ${t.assignee}` : '';
      lines.push(`• ${t.title} [${t.project}]${who} · ${formatDate(t.dueDate)}`);
    }
    lines.push('');
  }
  return lines.join('\n').trim();
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildHtml(tasks: DueTask[]): string {
  const sections = REMIND_DAYS.flatMap((days) => {
    const group = tasks.filter((t) => t.daysBefore === days);
    if (group.length === 0) return [];
    const items = group
      .map((t) => {
        const who = t.assignee ? ` — ${escapeHtml(t.assignee)}` : '';
        return `<li><strong>${escapeHtml(t.title)}</strong> [${escapeHtml(t.project)}]${who} · ${formatDate(t.dueDate)}</li>`;
      })
      .join('');
    return [`<h3>⏰ Còn ${days} ngày tới deadline (${group.length} task)</h3><ul>${items}</ul>`];
  });
  return `<div style="font-family:sans-serif">${sections.join('')}</div>`;
}

// ===== Channels =====

async function sendTelegram(env: Env, chatId: string, text: string): Promise<ChannelResult> {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return { channel: 'telegram', ok: false, error: 'Chưa cấu hình TELEGRAM_BOT_TOKEN' };
  }
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
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

async function findDueTasks(sql: Sql): Promise<DueTask[]> {
  const today = todayInVietnam();
  const found = rows(
    await sql`
      SELECT t.id, t.title, p.name AS project, s.name AS assignee,
        t.deadline::date::text AS "dueDate",
        (t.deadline::date - ${today}::date) AS "daysBefore"
      FROM "Task" t
      JOIN "Project" p ON p.id = t."projectId"
      LEFT JOIN "Staff" s ON s.id = t."assigneeId"
      WHERE t.status::text <> 'done'
        AND t.deadline IS NOT NULL
        AND (t.deadline::date - ${today}::date) = ANY(${REMIND_DAYS}::int[])
        AND NOT EXISTS (
          SELECT 1 FROM "DeadlineNotice" n
          WHERE n."taskId" = t.id
            AND n."daysBefore" = (t.deadline::date - ${today}::date)
            AND n."dueDate" = t.deadline::date)
      ORDER BY t.deadline, t.title`,
  );
  return found.map((r: any) => ({ ...r, daysBefore: Number(r.daysBefore) }));
}

/** Called by the cron trigger: remind admins about tasks due in 3 days or 1 day. */
export async function runDeadlineNotices(env: Env): Promise<{ tasks: number; delivered: number }> {
  const sql = getSql(env.DATABASE_URL);
  const due = await findDueTasks(sql);
  if (due.length === 0) return { tasks: 0, delivered: 0 };

  const text = buildText(due);
  const html = buildHtml(due);
  const subject = `[Task Dashboard] ${due.length} task sắp tới deadline`;

  let delivered = 0;
  for (const admin of await loadAdmins(sql)) {
    const results = await deliver(env, admin, subject, text, html);
    for (const r of results) {
      if (r.ok) delivered++;
      else console.error(`Deadline notice via ${r.channel} to ${admin.email} failed: ${r.error}`);
    }
  }

  // Only mark tasks as notified once someone actually received them; otherwise
  // they are retried on the next run (e.g. after an admin sets up a channel).
  if (delivered > 0) {
    await sql.transaction(
      due.map(
        (t) => sql`
          INSERT INTO "DeadlineNotice" ("taskId", "daysBefore", "dueDate")
          VALUES (${t.id}, ${t.daysBefore}, ${t.dueDate}::date)
          ON CONFLICT DO NOTHING`,
      ),
    );
  }
  return { tasks: due.length, delivered };
}

/** Sends a sample message to one admin's enabled channels. */
export async function sendTestNotice(env: Env, r: Recipient): Promise<ChannelResult[]> {
  const sample: DueTask[] = [
    {
      id: 'test',
      title: 'Task mẫu',
      project: 'Dự án mẫu',
      assignee: null,
      dueDate: todayInVietnam(),
      daysBefore: 1,
    },
  ];
  const text = `Đây là thông báo thử.\n\n${buildText(sample)}`;
  const html = `<p>Đây là thông báo thử.</p>${buildHtml(sample)}`;
  return deliver(env, r, '[Task Dashboard] Thông báo thử', text, html);
}
