import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';
import {
  autoMapHeaders,
  buildProjectFromTimeline,
  detectHeaderRow,
  detectSheet,
  normalizeRows,
  parseDate,
  parseProgress,
  readWorkbook,
  type Cell,
} from '../../src/utils/timelineImport';
import { alertLevelForDays, getReminders } from '../../src/utils/deadline';
import type { Task } from '../../src/types';

// Excel serial for an ISO date
const serial = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return (Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86_400_000;
};

const SAMPLE: Cell[][] = [
  ['KẾ HOẠCH TRIỂN KHAI DỰ ÁN VLIVE'],
  [],
  [
    'TT',
    'Nội dung công việc',
    'Đảm nhiệm',
    'Bắt đầu sau',
    'Kéo dài',
    'Bắt đầu',
    'Kết thúc',
    'Tiến độ',
  ],
  [null, 'PREPARATION', null, null, null, null, null, null],
  [
    1,
    'Gửi tài liệu tích hợp SDK',
    'VLive Tech',
    null,
    1,
    serial('2026-10-02'),
    serial('2026-10-02'),
    1,
  ],
  [2, 'Gửi toàn bộ tài liệu hệ thống', 'Dev', 1, 15, '12/10/2026', '30/10/2026', 0.25],
  [3, 'Thiết kế banner', null, 2, 3, serial('2026-10-20'), null, '50%'],
  [4, 'Ngày sai thứ tự', 'Dev', null, null, '20/10/2026', '10/10/2026', 0],
  [5, 'Thiếu lịch', 'Dev', null, null, null, null, 0],
];

describe('timeline import — nhận diện', () => {
  it('map header tiếng Việt, phân biệt "Bắt đầu" và "Bắt đầu sau"', () => {
    const m = autoMapHeaders(SAMPLE[2]);
    expect(m).toEqual({
      code: 0,
      name: 1,
      team: 2,
      startAfter: 3,
      duration: 4,
      start: 5,
      end: 6,
      progress: 7,
    });
  });

  it('map cột Hoàn thành và Deadline riêng', () => {
    const m = autoMapHeaders([
      'ID',
      'Đầu việc',
      'Team',
      'Ngày bắt đầu',
      'Thời gian hoàn thành',
      'Thời gian kết thúc',
    ]);
    expect(m).toMatchObject({ code: 0, name: 1, team: 2, start: 3, completion: 4, end: 5 });
  });

  it('tìm dòng header và sheet Task Lists', () => {
    expect(detectHeaderRow(SAMPLE)).toBe(2);
    const sheets = [
      { name: 'Nhân Sự', rows: [['Tên', 'Email']] },
      { name: 'Timeline Task Lists', rows: SAMPLE },
      { name: 'Task Lists', rows: SAMPLE },
    ];
    expect(detectSheet(sheets)).toBe(2);
  });
});

describe('timeline import — chuẩn hóa', () => {
  const res = normalizeRows(SAMPLE, 2, autoMapHeaders(SAMPLE[2]));

  it('dòng nhóm thành phase, không thành task', () => {
    expect(res.phases).toEqual(['PREPARATION']);
    expect(res.tasks.map((t) => t.code)).toEqual(['1', '2', '3', '4', '5']);
    expect(res.tasks[0].phase).toBe('PREPARATION');
  });

  it('chuẩn hóa ngày, tiến độ, thời lượng', () => {
    const [t1, t2, t3] = res.tasks;
    expect(t1).toMatchObject({
      startDate: '2026-10-02',
      endDate: '2026-10-02',
      progress: 100,
      duration: 1,
    });
    expect(t2).toMatchObject({
      startDate: '2026-10-12',
      endDate: '2026-10-30',
      progress: 25,
      startAfter: '1',
    });
    // end computed from duration; missing team → Unassigned
    expect(t3).toMatchObject({
      endDate: '2026-10-22',
      completionDate: '2026-10-22',
      progress: 50,
      team: 'Unassigned',
    });
    expect(t3.warnings.length).toBeGreaterThan(0);
  });

  it('báo lỗi end < start và thiếu lịch', () => {
    expect(res.valid.map((t) => t.code)).toEqual(['1', '2', '3']);
    expect(res.invalid.map((t) => t.code)).toEqual(['4', '5']);
    expect(res.invalid[0].errors[0]).toMatch(/trước ngày bắt đầu/);
  });

  it('parse các định dạng ngày và %', () => {
    expect(parseDate('2026-10-05')).toBe('2026-10-05');
    expect(parseDate('5/10/26')).toBe('2026-10-05');
    expect(parseDate('31/02/2026')).toBeNull();
    expect(parseDate(15)).toBeNull();
    expect(parseProgress('80%')).toBe(80);
    expect(parseProgress(0.4)).toBe(40);
    expect(parseProgress(60)).toBe(60);
  });

  it('tạo project + task', () => {
    let n = 0;
    const { project, tasks } = buildProjectFromTimeline(res.tasks, {
      projectName: 'VLive',
      color: '#000',
      sourceFile: 'vlive.xlsx',
      sheetName: 'Task Lists',
      makeId: () => String(++n),
    });
    expect(project.timeline).toMatchObject({ startDate: '2026-10-02', endDate: '2026-10-30' });
    expect(tasks).toHaveLength(3);
    expect(tasks[0]).toMatchObject({
      status: 'done',
      deadline: '2026-10-02',
      projectId: project.id,
    });
    expect(tasks[1].timeline).toMatchObject({ team: 'Dev', code: '2', duration: 15, progress: 25 });
  });

  it('đọc được file .xlsx thật', async () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(SAMPLE), 'Task Lists');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
    const sheets = await readWorkbook(buf);
    const idx = detectSheet(sheets);
    const header = detectHeaderRow(sheets[idx].rows);
    const out = normalizeRows(sheets[idx].rows, header, autoMapHeaders(sheets[idx].rows[header]));
    expect(out.valid).toHaveLength(3);
  });
});

describe('cảnh báo deadline T-7 / T-3 / T-1', () => {
  it('mức theo số ngày còn lại', () => {
    expect([10, 7, 4, 3, 2, 1, 0, -1].map(alertLevelForDays)).toEqual([
      'normal',
      't7',
      't7',
      't3',
      't3',
      't1',
      'today',
      'overdue',
    ]);
  });

  it('task hoàn thành không nhắc; quá hạn nhắc lại theo ngày', () => {
    const base = { id: 'a', status: 'backlog', deadline: '2000-01-01' } as Task;
    const done = { ...base, id: 'b', status: 'done' } as Task;
    const r1 = getReminders([base, done], '2026-10-15');
    const r2 = getReminders([base, done], '2026-10-16');
    expect(r1).toHaveLength(1);
    expect(r1[0].level).toBe('overdue');
    expect(r1[0].key).not.toBe(r2[0].key);
  });
});
