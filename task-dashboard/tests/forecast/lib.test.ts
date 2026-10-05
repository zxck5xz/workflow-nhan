import { describe, expect, it } from 'vitest';
import { simulate } from '../../src/modules/forecast/engine';
import { excelOriginal, presets } from '../../src/modules/forecast/engine/presets';
import { fmtInt, fmtMoney, fmtPct, parseVnNumber } from '../../src/modules/forecast/lib/format';
import { getPath, setPath } from '../../src/modules/forecast/lib/paths';
import { decodeShareHash, encodeShareHash } from '../../src/modules/forecast/lib/share';
import { syncModes } from '../../src/modules/forecast/lib/sync';
import { validate } from '../../src/modules/forecast/lib/validate';

describe('định dạng số kiểu VN', () => {
  it('tiền rút gọn', () => {
    expect(fmtMoney(52_220_924_018)).toBe('52,22 tỷ');
    expect(fmtMoney(-67_600_000)).toBe('-67,6 tr');
    expect(fmtMoney(23_040)).toBe('23.040 đ');
    expect(fmtMoney(5_160_000_000, { sign: true })).toBe('+5,16 tỷ');
  });
  it('số nguyên, phần trăm', () => {
    expect(fmtInt(1_096_500)).toBe('1.096.500');
    expect(fmtPct(0.099)).toBe('9,9%');
  });
  it('đọc số người dùng gõ', () => {
    expect(parseVnNumber('1.500.000')).toBe(1_500_000);
    expect(parseVnNumber('3,7')).toBe(3.7);
    expect(parseVnNumber('')).toBeNull();
    expect(parseVnNumber('abc')).toBeNull();
  });
  it('đọc tiền gõ tắt', () => {
    expect(parseVnNumber('5,5 tỷ')).toBe(5_500_000_000);
    expect(parseVnNumber('100tr')).toBe(100_000_000);
    expect(parseVnNumber('1tr5')).toBe(1_500_000);
    expect(parseVnNumber('26k')).toBe(26_000);
    expect(parseVnNumber('1.590 triệu')).toBe(1_590_000_000);
    expect(parseVnNumber('23.040 đ')).toBe(23_040);
    expect(parseVnNumber('tỷ')).toBeNull();
  });
});

describe('đọc/ghi tham số theo đường dẫn', () => {
  it('setPath không sửa object gốc', () => {
    const next = setPath(excelOriginal, 'costs.fixed.server', [1, 2]);
    expect(getPath(next, 'costs.fixed.server')).toEqual([1, 2]);
    expect(excelOriginal.costs.fixed.server).not.toEqual([1, 2]);
    expect(next.retention).toBe(excelOriginal.retention);
  });
});

describe('link chia sẻ', () => {
  it('mã hoá rồi giải mã ra đúng bộ tham số', async () => {
    const hash = await encodeShareHash(excelOriginal);
    expect(hash.startsWith('#s=')).toBe(true);
    expect(hash.length).toBeLessThan(8_000);
    expect(await decodeShareHash(hash)).toEqual(excelOriginal);
  });
  it('hash hỏng trả về null', async () => {
    expect(await decodeShareHash('#s=khong-hop-le')).toBeNull();
    expect(await decodeShareHash('#abc')).toBeNull();
  });
});

describe('bộ tham số mẫu', () => {
  it.each(presets.map((p) => [p.id, p]))('%s: hợp lệ và cho kết quả hữu hạn', (_, p) => {
    expect(validate(p.inputs)).toEqual({});
    const s = simulate(p.inputs).summary;
    expect(Number.isFinite(s.profit)).toBe(true);
    expect(s.nru).toBeGreaterThan(0);
    expect(s.revenue).toBeGreaterThan(0);
  });
  it('kiểm tra dữ liệu bắt được retention ngược và CVR = 0', () => {
    const bad = structuredClone(excelOriginal);
    bad.retention.d3 = 0.5;
    bad.acquisition.cvr = 0;
    const issues = validate(bad);
    expect(issues['retention.d3']).toBeDefined();
    expect(issues['acquisition.cvr']).toBeDefined();
  });
});

describe('đồng bộ chế độ nhập', () => {
  it.each(['installPlan', 'target', 'budget'] as const)(
    'chuẩn %s: 2 chế độ còn lại ra NRU gần bằng',
    (mode) => {
      const inputs = { ...excelOriginal, acquisition: { ...excelOriginal.acquisition, mode } };
      const r = syncModes(inputs)!;
      const base = r.totals.find((t) => t.mode === mode)!.nru;
      for (const t of r.totals) expect(Math.abs(t.nru / base - 1)).toBeLessThan(0.01);
      expect(r.acquisition.mode).toBe(mode);
    },
  );
  it('không có user thì trả về null', () => {
    const inputs = structuredClone(excelOriginal);
    inputs.acquisition.installsPerDay = [0];
    expect(syncModes(inputs)).toBeNull();
  });
});
