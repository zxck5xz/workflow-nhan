import type { RetentionInputs } from './types';
import { rounddown } from './util';

/**
 * DAU ngày t = Σ cohort c ≤ t: ROUNDDOWN(NRU_c × R(t − c)).
 * cohortSize[0] là cohort ngày OB đã gộp user đăng ký trước; cohort này nhân launchCohortBoost
 * theo chu kỳ launchCohortBoostCycleDays (120): ngày 1 không nhân, 2–120 nhân, 121 không nhân, 122–240 nhân…
 */
export function dailyActiveUsers(
  cohortSize: number[],
  curve: number[],
  r: RetentionInputs,
): number[] {
  const days = cohortSize.length;
  const maxAge = Math.min(curve.length, r.cutoffAge);
  const dau = new Array<number>(days).fill(0);
  for (let c = 0; c < days; c++) {
    const size = cohortSize[c];
    if (size === 0) continue;
    for (let age = 0; age < maxAge && c + age < days; age++) {
      if (c === 0 && age === 0) {
        dau[0] += size;
        continue;
      }
      const k = c === 0 && age % r.launchCohortBoostCycleDays !== 0 ? r.launchCohortBoost : 1;
      dau[c + age] += rounddown(size * curve[age] * k);
    }
  }
  return dau;
}
