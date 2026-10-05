import { describe, expect, it } from 'vitest';
import { computeBida, cpnFactor, type BidaInputs } from '../../src/modules/forecast/bida/engine';
import { BIDA_DEFAULTS, BIDA_FILE_REFERENCE } from '../../src/modules/forecast/bida/presets';
import { syncBidaModes } from '../../src/modules/forecast/bida/sync';
import reference from './fixtures/bida-reference.json';

/**
 * fixtures/bida-reference.json được sinh bằng cách chạy chính engine JS trong
 * "forecast-bida-8-pool (5).html" (DEFAULTS + vài bộ ghi đè). Bản port phải ra đúng từng số.
 */
type Case = {
  overrides: Partial<BidaInputs>;
  totals: Record<string, number>;
  cum: number[];
  monthly: Record<string, number>[];
  daily?: Record<'nru' | 'dau' | 'iap' | 'iaa' | 'ads' | 'installs', number[]>;
};
const cases = reference.cases as unknown as Record<string, Case>;

const close = (a: number, b: number) =>
  Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

describe('bộ mặc định Bida = DEFAULTS của file HTML', () => {
  it('mọi tham số trùng khớp', () => {
    for (const [k, v] of Object.entries(reference.defaults))
      expect(BIDA_DEFAULTS[k as keyof BidaInputs], k).toEqual(v);
  });
});

describe('port engine Bida khớp engine JS gốc', () => {
  for (const [name, c] of Object.entries(cases)) {
    it(name, () => {
      const r = computeBida({ ...BIDA_DEFAULTS, ...c.overrides });
      for (const [k, v] of Object.entries(c.totals))
        expect(close(r.totals[k as keyof typeof r.totals] as number, v), `totals.${k}`).toBe(true);
      expect(r.totals.cum.length).toBe(c.cum.length);
      c.cum.forEach((v, i) => expect(close(r.totals.cum[i], v), `cum[${i}]`).toBe(true));
      c.monthly.forEach((row, i) => {
        for (const [k, v] of Object.entries(row))
          expect(close(r.monthly[i][k as keyof (typeof r.monthly)[0]], v), `T${i + 1}.${k}`).toBe(
            true,
          );
      });
      if (c.daily)
        for (const [k, arr] of Object.entries(c.daily)) {
          const mine = r[k as keyof typeof c.daily];
          expect(mine.length, k).toBe(arr.length);
          arr.forEach((v, i) => {
            if (!close(mine[i], v)) expect.fail(`${k}[${i}]: ${mine[i]} ≠ ${v}`);
          });
        }
    });
  }
});

describe('mô hình Bida', () => {
  it('NRU và hoàn vốn mặc định bằng số file Excel Bida', () => {
    const t = computeBida(BIDA_DEFAULTS).totals;
    expect(t.nru).toBe(BIDA_FILE_REFERENCE.nru);
    expect(t.payback + 1).toBe(BIDA_FILE_REFERENCE.payback);
  });

  it('CPN: T1 100%, T2 mức giữa, T3–T12 = cpnGiam, từ T13 = sàn', () => {
    const f = (m: number) => cpnFactor(m, BIDA_DEFAULTS);
    expect([f(1), f(2), f(3), f(12), f(13), f(24)]).toEqual([1, 0.75, 0.5, 0.5, 0.3, 0.3]);
  });

  it('IAA không chịu VAT / share dev: thêm IAA không đổi VAT và share dev', () => {
    const a = computeBida({ ...BIDA_DEFAULTS, viewsAd: 0 }).totals;
    const b = computeBida({ ...BIDA_DEFAULTS, viewsAd: 10 }).totals;
    expect(b.iaa).toBeGreaterThan(0);
    expect(a.iaa).toBe(0);
    expect(b.vat).toBe(a.vat);
    expect(b.shareDev).toBe(a.shareDev);
    expect(b.revenue - a.revenue).toBeCloseTo(b.iaa, 3);
  });

  it('marketing / khác mỗi tháng (mở rộng cho game mới) cộng thẳng vào chi phí', () => {
    const a = computeBida(BIDA_DEFAULTS).totals;
    const b = computeBida({ ...BIDA_DEFAULTS, marketingMth: 1e8, otherMth: 2e7 }).totals;
    expect(b.cost - a.cost).toBeCloseTo(24 * 1.2e8, 0);
  });
});

describe('đồng bộ 2 chế độ (Bida)', () => {
  it('từ mục tiêu user → ngân sách: NRU chế độ ngân sách khớp trong 1%', () => {
    const r = syncBidaModes({ ...BIDA_DEFAULTS, mode: 'users' });
    expect(r.kind).toBe('synced');
    if (r.kind !== 'synced') return;
    expect(Math.abs(r.got / r.target - 1)).toBeLessThan(0.01);
    expect(computeBida({ ...r.inputs, mode: 'budget' }).totals.nru).toBeCloseTo(r.got, 6);
  });

  it('từ ngân sách → install/ngày: NRU chế độ mục tiêu khớp trong 1%', () => {
    const r = syncBidaModes({ ...BIDA_DEFAULTS, mode: 'budget' });
    expect(r.kind).toBe('synced');
    if (r.kind !== 'synced') return;
    expect(Math.abs(r.got / r.target - 1)).toBeLessThan(0.01);
  });

  it('không có user thì báo trống', () => {
    const r = syncBidaModes({
      ...BIDA_DEFAULTS,
      installM1: 0,
      installM4: 0,
      installLater: 0,
      prelaunchDays: 0,
    });
    expect(r.kind).toBe('empty');
  });
});
