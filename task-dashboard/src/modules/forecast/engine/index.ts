import { simulateAcquisition } from './acquisition';
import { dailyActiveUsers } from './cohort';
import { monthlyCosts } from './costs';
import { retentionCurve } from './retention';
import { dailyRevenue, ltv365 } from './revenue';
import type { DailyRow, Inputs, MonthlyRow, Result, Summary } from './types';
import { DAYS_PER_MONTH, monthOfDay, rounddown, sum } from './util';

export type * from './types';
export { DAYS_PER_MONTH } from './util';

/** Chạy toàn bộ mô hình: theo ngày → theo tháng → KPI tổng. */
export function simulate(inputs: Inputs): Result {
  const days = inputs.months * DAYS_PER_MONTH;
  const curveLength = Math.max(days, inputs.revenue.arpuCurve.length);
  const retention = retentionCurve(inputs.retention, curveLength);
  const acq = simulateAcquisition(inputs.acquisition, days);

  // Cohort ngày OB gộp user đăng ký trước
  const cohortSize = acq.nru.slice();
  cohortSize[0] += acq.preReg.nru;

  const dau = dailyActiveUsers(cohortSize, retention, inputs.retention);
  const revenue = dailyRevenue(cohortSize, inputs.revenue, retention);

  const daily: DailyRow[] = acq.nru.map((nru, i) => {
    const day = i + 1;
    return {
      day,
      month: monthOfDay(day),
      dayOfMonth: ((day - 1) % DAYS_PER_MONTH) + 1,
      installUa: acq.installUa[i],
      nruUa: acq.nruUa[i],
      organic: acq.organic[i],
      nru,
      dau: dau[i],
      mkt: acq.mkt[i],
      revenue: revenue[i],
      pu: rounddown(dau[i] * inputs.revenue.payrate),
    };
  });

  const byMonth = Array.from({ length: inputs.months }, (_, i) =>
    daily.slice(i * DAYS_PER_MONTH, (i + 1) * DAYS_PER_MONTH),
  );
  const costs = monthlyCosts(
    inputs.costs,
    byMonth.map((rows, i) => ({
      month: i + 1,
      revenue: sum(rows.map((r) => r.revenue)),
      mkt: sum(rows.map((r) => r.mkt)) + (i === 0 ? acq.preReg.mkt : 0),
    })),
    inputs.usdVnd,
  );

  let cumulative = 0;
  const monthly: MonthlyRow[] = costs.map((c, i) => {
    const rows = byMonth[i];
    const profit = c.revenue - c.totalSpent;
    cumulative += profit;
    return {
      ...c,
      nru: sum(rows.map((r) => r.nru)) + (i === 0 ? acq.preReg.nru : 0),
      nruUa: sum(rows.map((r) => r.nruUa)) + (i === 0 ? acq.preReg.nruUa : 0),
      dauAvg: sum(rows.map((r) => r.dau)) / rows.length,
      dauPeak: Math.max(...rows.map((r) => r.dau)),
      profit,
      cumulative,
    };
  });

  return {
    retention,
    daily,
    monthly,
    summary: summarize(inputs, monthly, daily, acq.preReg.installs, cohortSize, retention),
  };
}

const FIXED_KEYS = [
  'branding',
  'community',
  'bonus',
  'server',
  'staff',
  'other',
  'managementFee',
] as const;

function summarize(
  inputs: Inputs,
  monthly: MonthlyRow[],
  daily: DailyRow[],
  preRegInstalls: number,
  cohortSize: number[],
  retention: number[],
): Summary {
  const total = (k: keyof MonthlyRow) => sum(monthly.map((m) => m[k] as number));
  const nru = total('nru');
  const revenue = total('revenue');
  const totalSpent = total('totalSpent');
  const profit = revenue - totalSpent;
  const mkt = total('mkt');
  const installs = sum(daily.map((d) => d.installUa)) + preRegInstalls;
  const avgCpn = nru > 0 ? mkt / nru : 0;
  const ltv = ltv365(cohortSize, inputs.revenue, retention);
  const breakEven = monthly.find((m) => m.cumulative >= 0);

  return {
    nru,
    nruUa: total('nruUa'),
    installs,
    peakDau: Math.max(...daily.map((d) => d.dau)),
    avgDau: daily.length > 0 ? sum(daily.map((d) => d.dau)) / daily.length : 0,
    revenue,
    totalSpent,
    profit,
    margin: revenue > 0 ? profit / revenue : 0,
    profitOverSpent: totalSpent > 0 ? profit / totalSpent : 0,
    mkt,
    costPerInstall: installs > 0 ? mkt / installs : 0,
    ltv365: ltv,
    ltvOverCpn: avgCpn > 0 ? ltv / avgCpn : 0,
    avgCpn,
    shareDevPaid: total('shareDevAfterMg'),
    oneTimeCosts:
      total('licenseFee') + total('minimumGuarantee') + total('branding') + total('other'),
    vat: total('vat'),
    paymentFee: total('paymentFee'),
    adsTax: total('adsTax'),
    fixedCosts: FIXED_KEYS.reduce((a, k) => a + total(k), 0),
    breakEvenMonth: breakEven ? breakEven.month : null,
  };
}
