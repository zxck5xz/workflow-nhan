import { describe, expect, it } from 'vitest';
import { simulate } from '../../src/modules/forecast/engine';
import { excelOriginal } from '../../src/modules/forecast/engine/presets';
import { rounddown } from '../../src/modules/forecast/engine/util';
import golden from './fixtures/excel-forecast.json';

const result = simulate(excelOriginal);

// Excel gõ nhầm thuế ads T24 (ô AD20 = AD17*5%, các tháng khác 7%): tool dùng 7% cho mọi tháng.
const lastMonth = golden.monthly.mkt.length - 1;
const adsTaxFix = golden.monthly.mkt[lastMonth] * (0.07 - 0.05);
golden.monthly.adsTax[lastMonth] += adsTaxFix;
golden.monthly.totalSpent[lastMonth] += adsTaxFix;
golden.monthly.profit[lastMonth] -= adsTaxFix;
golden.monthly.cumulative[lastMonth] -= adsTaxFix;
golden.totals.totalSpent += adsTaxFix;
golden.totals.profit -= adsTaxFix;
golden.totals.profitOverSpent = golden.totals.profit / golden.totals.totalSpent;

// Excel chỉ nhân 120% cho cohort ngày OB ở ngày 2–120. Đã chốt: lặp theo chu kỳ 120 ngày,
// nên ngày 122–240 cũng được nhân → cộng phần chênh vào DAU/PU kỳ vọng.
const cycle = excelOriginal.retention.launchCohortBoostCycleDays;
const boost = excelOriginal.retention.launchCohortBoost;
const launchCohort = golden.daily.dau[0];
for (let day = 2; day <= golden.daily.dau.length; day++) {
  const age = day - 1;
  if (age <= cycle - 1 || age % cycle === 0) continue;
  const r = result.retention[age];
  golden.daily.dau[day - 1] += rounddown(launchCohort * r * boost) - rounddown(launchCohort * r);
  golden.daily.pu[day - 1] = rounddown(golden.daily.dau[day - 1] * excelOriginal.revenue.payrate);
}

/** So sánh theo sai số tương đối (mặc định 1e-6) */
function expectClose(actual: number[], expected: number[], rel = 1e-6, abs = 1e-6) {
  expect(actual.length).toBe(expected.length);
  actual.forEach((a, i) => {
    const e = expected[i];
    const tol = Math.max(abs, Math.abs(e) * rel);
    if (Math.abs(a - e) > tol) throw new Error(`index ${i}: got ${a}, expected ${e}`);
  });
}

describe('khớp sheet Forecast của Excel gốc', () => {
  it('đường retention theo tuổi', () => {
    expectClose(result.retention.slice(0, golden.retention.length), golden.retention, 1e-9, 1e-12);
  });

  it.each(['installUa', 'nruUa', 'nru', 'dau', 'mkt', 'revenue', 'pu'] as const)(
    'theo ngày: %s',
    (key) => {
      expectClose(
        result.daily.map((d) => d[key]),
        golden.daily[key],
      );
    },
  );

  it.each([
    'nru',
    'nruUa',
    'revenue',
    'revenueOnG',
    'revenueDev',
    'revenueIap',
    'revenueNonIap',
    'vat',
    'paymentFee',
    'mkt',
    'adsTax',
    'shareDev',
    'shareDevAfterMg',
    'cumulative',
  ] as const)('theo tháng: %s', (key) => {
    expectClose(
      result.monthly.map((m) => m[key]),
      golden.monthly[key],
    );
  });

  it('tổng chi phí và lợi nhuận: chi phí trước OB dồn vào T1', () => {
    const pre = golden.preObTotalSpent;
    const spent = golden.monthly.totalSpent.map((v, i) => (i === 0 ? v + pre : v));
    const profit = golden.monthly.profit.map((v, i) => (i === 0 ? v - pre : v));
    expectClose(
      result.monthly.map((m) => m.totalSpent),
      spent,
    );
    expectClose(
      result.monthly.map((m) => m.profit),
      profit,
    );
  });

  it('KPI tổng', () => {
    const s = result.summary;
    expectClose(
      [s.nru, s.revenue, s.totalSpent, s.profit, s.profitOverSpent],
      [
        golden.totals.nru,
        golden.totals.revenue,
        golden.totals.totalSpent,
        golden.totals.profit,
        golden.totals.profitOverSpent,
      ],
    );
  });
});
