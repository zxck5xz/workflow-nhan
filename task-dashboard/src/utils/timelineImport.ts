// ============================================================
// Timeline import — đọc file Excel Tasklist Timeline thành Project + Task
// Nhận diện cột theo header (không phụ thuộc vị trí), chuẩn hóa ngày về ISO.
// ============================================================

import type { Project, Task, TaskStatus } from '../types';
import { classifyEisenhower } from './index';

export type TimelineField =
  | 'code'
  | 'name'
  | 'team'
  | 'startAfter'
  | 'duration'
  | 'start'
  | 'completion'
  | 'end'
  | 'progress';

export const FIELD_LABELS: Record<TimelineField, string> = {
  code: 'Task ID (TT)',
  name: 'Đầu việc',
  team: 'Team phụ trách',
  startAfter: 'Bắt đầu sau',
  duration: 'Thời lượng (ngày)',
  start: 'Ngày bắt đầu',
  completion: 'Ngày hoàn thành',
  end: 'Ngày kết thúc / Deadline',
  progress: 'Tiến độ',
};

export const TIMELINE_FIELDS = Object.keys(FIELD_LABELS) as TimelineField[];

/** Cột bắt buộc phải map được trước khi import. */
export const REQUIRED_FIELDS: TimelineField[] = ['name', 'start'];

// Header aliases, already normalized (lowercase, no diacritics).
const ALIASES: Record<TimelineField, string[]> = {
  code: ['tt', 'stt', 'id', 'task id', 'ma', 'ma task', 'no', '#'],
  name: [
    'noi dung cong viec',
    'noi dung',
    'dau viec',
    'cong viec',
    'ten cong viec',
    'hang muc',
    'task',
    'task name',
  ],
  team: [
    'dam nhiem',
    'team',
    'team phu trach',
    'phu trach',
    'nguoi phu trach',
    'bo phan',
    'owner',
    'pic',
  ],
  startAfter: ['bat dau sau', 'phu thuoc', 'dependency', 'predecessor'],
  duration: ['keo dai', 'thoi luong', 'so ngay', 'duration', 'days'],
  start: ['bat dau', 'ngay bat dau', 'thoi gian bat dau', 'start', 'start date'],
  completion: [
    'hoan thanh',
    'ngay hoan thanh',
    'thoi gian hoan thanh',
    'hoan thanh du kien',
    'completion',
    'finish',
  ],
  end: [
    'ket thuc',
    'ngay ket thuc',
    'thoi gian ket thuc',
    'deadline',
    'han chot',
    'end date',
    'due date',
  ],
  progress: ['tien do', 'progress', '% hoan thanh', 'ti le hoan thanh', '%'],
};

export type ColumnMapping = Partial<Record<TimelineField, number>>;

export type Cell = string | number | boolean | Date | null | undefined;

export interface SheetData {
  name: string;
  rows: Cell[][];
}

export function normalizeHeader(value: Cell): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[\s_:.\n\r]+/g, ' ')
    .trim();
}

/** Map each header cell to a field: exact alias first, then longest contained alias. */
export function autoMapHeaders(headerRow: Cell[]): ColumnMapping {
  const headers = headerRow.map(normalizeHeader);
  const mapping: ColumnMapping = {};
  const used = new Set<number>();

  const assign = (field: TimelineField, col: number) => {
    if (mapping[field] !== undefined || used.has(col)) return;
    mapping[field] = col;
    used.add(col);
  };

  for (const field of TIMELINE_FIELDS) {
    const col = headers.findIndex((h, i) => !used.has(i) && ALIASES[field].includes(h));
    if (col >= 0) assign(field, col);
  }

  // Fuzzy pass: pick the (field, column) pairs with the longest matching alias
  // first, so "ngày bắt đầu sau" goes to startAfter rather than start.
  const candidates: { field: TimelineField; col: number; len: number }[] = [];
  headers.forEach((h, col) => {
    if (!h || used.has(col)) return;
    for (const field of TIMELINE_FIELDS) {
      for (const alias of ALIASES[field]) {
        if (alias.length >= 3 && h.includes(alias))
          candidates.push({ field, col, len: alias.length });
      }
    }
  });
  candidates.sort((a, b) => b.len - a.len);
  for (const c of candidates) assign(c.field, c.col);

  return mapping;
}

/** Index of the row that looks most like a header (needs a task-name column). */
export function detectHeaderRow(rows: Cell[][], scanLimit = 30): number {
  let best = -1;
  let bestScore = 0;
  for (let i = 0; i < Math.min(rows.length, scanLimit); i++) {
    const mapping = autoMapHeaders(rows[i] ?? []);
    if (mapping.name === undefined) continue;
    const score = Object.keys(mapping).length;
    if (score > bestScore) {
      best = i;
      bestScore = score;
    }
  }
  return bestScore >= 2 ? best : -1;
}

/** Prefer a "Task List(s)" sheet, then any sheet with a recognizable header. */
export function detectSheet(sheets: SheetData[]): number {
  const byName = (re: RegExp) => sheets.findIndex((s) => re.test(normalizeHeader(s.name)));
  const exact = byName(/^task ?lists?$/);
  if (exact >= 0 && detectHeaderRow(sheets[exact].rows) >= 0) return exact;
  const named = byName(/task ?list|timeline|tasklist|cong viec/);
  if (named >= 0 && detectHeaderRow(sheets[named].rows) >= 0) return named;
  const any = sheets.findIndex((s) => detectHeaderRow(s.rows) >= 0);
  return any >= 0 ? any : 0;
}

// ── Value parsing ──

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isoFromParts(y: number, m: number, d: number): string | null {
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Excel serial / Date / "dd/mm/yyyy" / "yyyy-mm-dd" → "YYYY-MM-DD"; null if not a date. */
export function parseDate(value: Cell, fallbackYear = new Date().getFullYear()): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return null;
    return isoFromParts(value.getFullYear(), value.getMonth() + 1, value.getDate());
  }
  if (typeof value === 'number') {
    // Excel serial date (days since 1899-12-30); ignore tiny numbers like durations
    if (value < 20000 || value > 80000) return null;
    const dt = new Date(Date.UTC(1899, 11, 30) + Math.floor(value) * 86_400_000);
    return isoFromParts(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
  }
  const s = String(value).trim();
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/.exec(s);
  if (m) return isoFromParts(+m[1], +m[2], +m[3]);
  m = /^(\d{1,2})[-/.](\d{1,2})(?:[-/.](\d{2,4}))?$/.exec(s);
  if (m) {
    let y = m[3] ? +m[3] : fallbackYear;
    if (y < 100) y += 2000;
    return isoFromParts(y, +m[2], +m[1]);
  }
  if (/^\d+(\.\d+)?$/.test(s)) return parseDate(Number(s), fallbackYear);
  return null;
}

export function parseNumber(value: Cell): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isFinite(value) ? value : null;
  const m = /-?\d+(?:[.,]\d+)?/.exec(String(value));
  return m ? Number(m[0].replace(',', '.')) : null;
}

/** "50%" → 50, 0.5 → 50 (Excel percent cell), 50 → 50; clamped to 0–100. */
export function parseProgress(value: Cell): number {
  if (value === null || value === undefined || value === '') return 0;
  const isPercentText = typeof value === 'string' && value.includes('%');
  const n = parseNumber(value);
  if (n === null) return 0;
  const pct = !isPercentText && n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function daysBetween(fromIso: string, toIso: string): number {
  const toUtc = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000);
}

function cellText(value: Cell): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return parseDate(value) ?? '';
  return String(value).replace(/\s+/g, ' ').trim();
}

// ── Normalization ──

export interface ParsedTask {
  rowNumber: number; // 1-based Excel row
  code: string;
  name: string;
  team: string;
  phase?: string;
  startAfter?: string;
  startDate: string | null;
  completionDate: string | null;
  endDate: string | null;
  duration: number | null;
  progress: number;
  errors: string[];
  warnings: string[];
}

export interface NormalizeResult {
  tasks: ParsedTask[];
  phases: string[];
  valid: ParsedTask[];
  invalid: ParsedTask[];
  warningCount: number;
}

export const UNASSIGNED_TEAM = 'Unassigned';

export function normalizeRows(
  rows: Cell[][],
  headerRow: number,
  mapping: ColumnMapping,
): NormalizeResult {
  const get = (row: Cell[], field: TimelineField): Cell =>
    mapping[field] === undefined ? undefined : row[mapping[field]!];

  const tasks: ParsedTask[] = [];
  const phases: string[] = [];
  let phase: string | undefined;

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const name = cellText(get(row, 'name'));
    const code = cellText(get(row, 'code'));
    const team = cellText(get(row, 'team'));
    const rawStart = get(row, 'start');
    const rawEnd = get(row, 'end');
    const rawCompletion = get(row, 'completion');
    const hasSchedule = [rawStart, rawEnd, rawCompletion].some((v) => cellText(v) !== '');

    if (!name) continue;
    // Group rows: "I. PREPARATION", "V Marketing" (Roman/letter ID, no team) — they
    // often carry the group's date range and progress, so dates don't rule them out.
    // Rows with no team, dates or numeric ID are group rows too ("Phase 1").
    const isSectionCode = /^([IVXLCDM]+|[A-Z])\.?$/i.test(code);
    if (!team && (isSectionCode || (!hasSchedule && !/^\d+(\.\d+)*$/.test(code)))) {
      phase = name;
      phases.push(name);
      continue;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    let startDate = parseDate(rawStart);
    let endDate = parseDate(rawEnd);
    let completionDate = parseDate(rawCompletion);
    let duration = parseNumber(get(row, 'duration'));
    if (duration !== null && duration <= 0) duration = null;

    if (cellText(rawStart) && !startDate)
      errors.push(`Ngày bắt đầu không hợp lệ: "${cellText(rawStart)}"`);
    if (cellText(rawEnd) && !endDate)
      errors.push(`Ngày kết thúc không hợp lệ: "${cellText(rawEnd)}"`);
    if (cellText(rawCompletion) && !completionDate)
      errors.push(`Ngày hoàn thành không hợp lệ: "${cellText(rawCompletion)}"`);

    // Deadline falls back to completion date and vice versa
    if (!endDate && completionDate) endDate = completionDate;
    if (!completionDate && endDate) completionDate = endDate;
    // Fill one missing end of the range from the duration (inclusive days)
    if (startDate && !endDate && duration) {
      endDate = completionDate = addDays(startDate, Math.round(duration) - 1);
    }
    if (!startDate && endDate && duration)
      startDate = addDays(endDate, -(Math.round(duration) - 1));

    if (!errors.length) {
      if (!startDate) errors.push('Thiếu ngày bắt đầu');
      if (!endDate) errors.push('Thiếu ngày kết thúc / deadline');
    }
    if (startDate && endDate && endDate < startDate)
      errors.push('Ngày kết thúc trước ngày bắt đầu');
    if (startDate && completionDate && completionDate < startDate)
      errors.push('Ngày hoàn thành trước ngày bắt đầu');
    if (completionDate && endDate && completionDate > endDate)
      warnings.push('Ngày hoàn thành dự kiến sau deadline');
    if (!team) warnings.push(`Thiếu team — đưa vào nhóm "${UNASSIGNED_TEAM}"`);
    if (!code) warnings.push('Thiếu Task ID — dùng số dòng Excel');

    if (startDate && completionDate && !errors.length) {
      const computed = daysBetween(startDate, completionDate) + 1;
      if (duration === null) duration = computed;
    }

    tasks.push({
      rowNumber: i + 1,
      code: code || `R${i + 1}`,
      name,
      team: team || UNASSIGNED_TEAM,
      phase,
      startAfter: cellText(get(row, 'startAfter')) || undefined,
      startDate,
      completionDate,
      endDate,
      duration: duration === null ? null : Math.round(duration),
      progress: parseProgress(get(row, 'progress')),
      errors,
      warnings,
    });
  }

  const valid = tasks.filter((t) => t.errors.length === 0);
  const invalid = tasks.filter((t) => t.errors.length > 0);
  return {
    tasks,
    phases,
    valid,
    invalid,
    warningCount: valid.filter((t) => t.warnings.length > 0).length,
  };
}

// ── Workbook reading (xlsx is loaded lazily, it is a large dependency) ──

export async function readWorkbook(file: File | ArrayBuffer): Promise<SheetData[]> {
  const XLSX = await import('xlsx');
  const buffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  return wb.SheetNames.map((name) => ({
    name,
    rows: XLSX.utils.sheet_to_json<Cell[]>(wb.Sheets[name], {
      header: 1,
      raw: true,
      defval: null,
      blankrows: true,
    }),
  }));
}

// ── Build app records ──

export interface BuildOptions {
  projectName: string;
  color: string;
  sourceFile: string;
  sheetName: string;
  now?: Date;
  makeId?: () => string;
}

function statusForProgress(progress: number): TaskStatus {
  if (progress >= 100) return 'done';
  if (progress > 0) return 'in-testing';
  return 'backlog';
}

export function buildProjectFromTimeline(
  parsed: ParsedTask[],
  opts: BuildOptions,
): { project: Project; tasks: Task[] } {
  const now = (opts.now ?? new Date()).toISOString();
  const makeId = opts.makeId ?? (() => Math.random().toString(36).slice(2, 10));
  const valid = parsed.filter((t) => t.errors.length === 0 && t.startDate && t.endDate);

  const starts = valid.map((t) => t.startDate!).sort();
  const ends = valid.map((t) => t.endDate!).sort();

  const project: Project = {
    id: `proj-${makeId()}`,
    name: opts.projectName.trim() || opts.sourceFile,
    platform: 'Cross-platform',
    genre: 'Timeline',
    status: 'active',
    color: opts.color,
    createdAt: now.split('T')[0],
    timeline: {
      sourceFile: opts.sourceFile,
      sheetName: opts.sheetName,
      importedAt: now,
      startDate: starts[0] ?? now.split('T')[0],
      endDate: ends[ends.length - 1] ?? now.split('T')[0],
    },
  };

  const tasks: Task[] = valid.map((t) => {
    const status = statusForProgress(t.progress);
    const description = [
      t.phase && `Giai đoạn: ${t.phase}`,
      t.startAfter && `Bắt đầu sau: ${t.startAfter}`,
    ]
      .filter(Boolean)
      .join('\n');
    return {
      id: `task-${makeId()}`,
      title: t.name,
      description,
      projectId: project.id,
      assigneeId: '',
      status,
      priority: 'P1',
      weight: 3,
      deadline: t.endDate!,
      createdAt: now,
      completedAt: status === 'done' ? now : undefined,
      eisenhower: classifyEisenhower('P1', t.endDate!),
      tags: [t.team],
      timeline: {
        code: t.code,
        team: t.team,
        phase: t.phase,
        startAfter: t.startAfter,
        startDate: t.startDate!,
        completionDate: t.completionDate ?? t.endDate!,
        duration: t.duration ?? daysBetween(t.startDate!, t.endDate!) + 1,
        progress: t.progress,
      },
    };
  });

  return { project, tasks };
}
