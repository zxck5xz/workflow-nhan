import type { RevenueInputs } from './types';
import { sum } from './util';

/** Hệ số pha cho cohort vào game ngày `day` (1 = OB, user đăng ký trước tính như ngày OB). */
export function phaseMultiplier(r: RevenueInputs, day: number): number {
  let k = r.phaseMultipliers[0] ?? 1;
  r.phaseStartDays.forEach((start, i) => {
    if (day >= start) k = r.phaseMultipliers[i] ?? k;
  });
  return k;
}

/** Doanh thu / user theo tuổi cho cohort ngày `day`. */
export function perUserRevenueCurve(r: RevenueInputs, retention: number[], day: number): number[] {
  if (r.model === 'arpuCurve') {
    const k = phaseMultiplier(r, day);
    return r.arpuCurve.map((v) => v * k);
  }
  // payerValue: doanh thu vòng đời = payrate × giá trị 1 người trả tiền, phân bổ theo đường retention
  const total = sum(retention);
  const lifetime = r.payrate * r.payerLifetimeValue;
  return retention.map((v) => (total > 0 ? (lifetime * v) / total : 0));
}

/** Doanh thu ngày t = Σ cohort c ≤ t: NRU_c × doanh thu / user ở tuổi t − c. */
export function dailyRevenue(
  cohortSize: number[],
  r: RevenueInputs,
  retention: number[],
): number[] {
  const days = cohortSize.length;
  const rev = new Array<number>(days).fill(0);
  const curves = new Map<number, number[]>();
  for (let c = 0; c < days; c++) {
    const size = cohortSize[c];
    if (size === 0) continue;
    const key = r.model === 'arpuCurve' ? phaseMultiplier(r, c + 1) : 1;
    let curve = curves.get(key);
    if (!curve) {
      curve = perUserRevenueCurve(r, retention, c + 1);
      curves.set(key, curve);
    }
    for (let age = 0; age < curve.length && c + age < days; age++)
      rev[c + age] += size * curve[age];
  }
  return rev;
}

/** Doanh thu 365 ngày đầu / user, bình quân theo cơ cấu cohort. */
export function ltv365(cohortSize: number[], r: RevenueInputs, retention: number[]): number {
  let users = 0;
  let value = 0;
  cohortSize.forEach((size, c) => {
    const curve = perUserRevenueCurve(r, retention, c + 1);
    users += size;
    value += size * sum(curve.slice(0, 365));
  });
  return users > 0 ? value / users : 0;
}
