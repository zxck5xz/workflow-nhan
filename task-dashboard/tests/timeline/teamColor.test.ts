import { describe, it, expect } from 'vitest';
import { buildTeamColors, findDepartment, teamKey } from '../../src/utils/teamColor';
import { dataService } from '../../src/data/dataService';
import type { AppData, Department, Member } from '../../src/types';

const depts: Department[] = [
  { id: 'd1', name: 'VLive Product', color: '#123456', order: 0 },
  { id: 'd2', name: 'Dev', color: '#abcdef', order: 1 },
];

describe('team colors', () => {
  it('khớp bộ phận theo tên, không phân biệt hoa thường/khoảng trắng', () => {
    expect(teamKey('  VLive   product ')).toBe('vlive product');
    expect(findDepartment(depts, 'vlive  PRODUCT')?.id).toBe('d1');
    expect(findDepartment(depts, 'VLive MKT')).toBeUndefined();
  });

  it('team đã cấu hình lấy màu bộ phận, team khác có màu riêng không trùng nhau', () => {
    const teams = ['VLive Product', 'Dev', 'VLive MKT', 'VLive Tech', 'VLive + Dev'];
    const colors = buildTeamColors(teams, depts);
    expect(colors.get('VLive Product')).toBe('#123456');
    expect(colors.get('Dev')).toBe('#abcdef');
    const auto = ['VLive MKT', 'VLive Tech', 'VLive + Dev'].map((t) => colors.get(t));
    expect(new Set(auto).size).toBe(3);
    // stable across calls and input order
    expect(buildTeamColors([...teams].reverse(), depts)).toEqual(colors);
  });
});

describe('setDepartments', () => {
  const member = (id: string, departmentId?: string): Member => ({
    id,
    name: id,
    email: `${id}@x`,
    role: 'QA',
    avatarColor: '#000000',
    initials: 'X',
    joinedAt: '2026-01-01',
    departmentId,
  });
  const data = {
    members: [member('a', 'd1'), member('b', 'd2'), member('c')],
  } as AppData;

  it('nhân sự đổi màu theo bộ phận; bộ phận bị xoá thì gỡ khỏi nhân sự', () => {
    const next = dataService.setDepartments(data, [{ ...depts[0], color: '#ff0000' }]);
    expect(next.members.map((m) => [m.departmentId, m.avatarColor])).toEqual([
      ['d1', '#ff0000'],
      [undefined, '#000000'],
      [undefined, '#000000'],
    ]);
  });
});

describe('deleteMember', () => {
  it('xoá nhân sự thì gỡ khỏi các task được giao', () => {
    const data = {
      members: [{ id: 'a' }, { id: 'b' }],
      tasks: [
        { id: 't1', assigneeId: 'a' },
        { id: 't2', assigneeId: 'b' },
      ],
    } as unknown as AppData;
    const next = dataService.deleteMember(data, 'a');
    expect(next.members.map((m) => m.id)).toEqual(['b']);
    expect(next.tasks.map((t) => t.assigneeId)).toEqual(['', 'b']);
  });
});
