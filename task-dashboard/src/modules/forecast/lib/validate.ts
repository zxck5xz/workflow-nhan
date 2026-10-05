import type { Inputs } from '../engine';

/** Lỗi theo đường dẫn tham số → thông báo hiển thị dưới ô nhập. */
export type Issues = Record<string, string>;

export function validate(i: Inputs): Issues {
  const issues: Issues = {};
  const pct = (path: string, v: number) => {
    if (v < 0 || v > 1) issues[path] = 'Phải trong khoảng 0–100%';
  };
  const nonNeg = (path: string, v: number) => {
    if (v < 0) issues[path] = 'Không được âm';
  };

  const a = i.acquisition;
  pct('acquisition.cvr', a.cvr);
  if (a.cvr === 0) issues['acquisition.cvr'] = 'CVR phải lớn hơn 0';
  pct('acquisition.budgetDecay', a.budgetDecay);
  nonNeg('acquisition.budgetMonth1', a.budgetMonth1);
  nonNeg('acquisition.budgetMaintain', a.budgetMaintain);
  if (a.cpn.some((v) => v <= 0)) issues['acquisition.cpn'] = 'CPN phải lớn hơn 0';
  if (a.targetNruPerDay.some((v) => v < 0)) issues['acquisition.targetNruPerDay'] = 'Không được âm';
  if (a.organicRatio.some((v) => v < 0)) issues['acquisition.organicRatio'] = 'Không được âm';

  const r = i.retention;
  const keys = ['d1', 'd3', 'd7', 'd14', 'd30'] as const;
  keys.forEach((k) => pct(`retention.${k}`, r[k]));
  keys.slice(1).forEach((k, idx) => {
    const prev = keys[idx];
    if (r[k] > r[prev]) issues[`retention.${k}`] = `Không được lớn hơn ${prev.toUpperCase()}`;
  });
  pct('retention.tailKeep', r.tailKeep);
  pct('retention.floor', r.floor);
  if (r.floor > r.d30) issues['retention.floor'] = 'Sàn không được lớn hơn D30';
  if (r.cutoffAge < 31) issues['retention.cutoffAge'] = 'Tối thiểu 31 ngày';
  if (r.launchCohortBoostCycleDays < 1)
    issues['retention.launchCohortBoostCycleDays'] = 'Tối thiểu 1 ngày';

  pct('revenue.payrate', i.revenue.payrate);
  nonNeg('revenue.payerLifetimeValue', i.revenue.payerLifetimeValue);

  const c = i.costs;
  (['vatRate', 'paymentFee', 'adsTax', 'shareRate', 'nonIapRatio'] as const).forEach((k) =>
    pct(`costs.${k}`, c[k]),
  );
  if (c.iapRatio.some((v) => v < 0 || v > 1))
    issues['costs.iapRatio'] = 'Mỗi giá trị phải trong khoảng 0–100%';
  if (i.usdVnd <= 0) issues.usdVnd = 'Tỉ giá phải lớn hơn 0';
  return issues;
}
