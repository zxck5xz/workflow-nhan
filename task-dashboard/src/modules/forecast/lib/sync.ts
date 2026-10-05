import type { AcquisitionInputs, AcquisitionMode, Inputs } from '../engine';
import { simulateAcquisition } from '../engine/acquisition';
import { DAYS_PER_MONTH, monthValue, sum } from '../engine/util';

export const MODE_LABELS: Record<AcquisitionMode, string> = {
  installPlan: 'Kế hoạch cài đặt',
  budget: 'Theo ngân sách ads',
  target: 'Theo mục tiêu user',
};

export interface ModeTotals {
  mode: AcquisitionMode;
  nru: number;
  mkt: number;
}

export interface SyncResult {
  acquisition: AcquisitionInputs;
  from: AcquisitionMode;
  /** Tổng NRU / tiền ads của từng chế độ sau khi đồng bộ (không gồm đăng ký trước — giống nhau ở mọi chế độ) */
  totals: ModeTotals[];
}

function totalsOf(
  a: AcquisitionInputs,
  days: number,
): { nru: number; mkt: number; monthlyNru: number[]; monthlyMkt: number[] } {
  const r = simulateAcquisition(a, days);
  const months = days / DAYS_PER_MONTH;
  const slice = (arr: number[], m: number) =>
    sum(arr.slice(m * DAYS_PER_MONTH, (m + 1) * DAYS_PER_MONTH));
  const monthlyNru = Array.from({ length: months }, (_, m) => slice(r.nru, m));
  const monthlyMkt = Array.from({ length: months }, (_, m) => slice(r.mkt, m));
  return { nru: sum(r.nru), mkt: sum(r.mkt), monthlyNru, monthlyMkt };
}

/** Σ hệ số tăng các ngày đầu trong tháng m (ngày ngoài danh sách hệ số = 1) */
function boostSum(boost: number[], m: number): number {
  let s = 0;
  for (let day = (m - 1) * DAYS_PER_MONTH + 1; day <= m * DAYS_PER_MONTH; day++)
    s += day - 1 < boost.length ? boost[day - 1] : 1;
  return s;
}

/**
 * Lấy chế độ đang chọn làm chuẩn, tính bộ số tương đương cho 2 chế độ còn lại:
 * - Mục tiêu user / kế hoạch cài đặt: khớp NRU từng tháng.
 * - Ngân sách: T1 = tiền ads T1 của chế độ chuẩn; mức duy trì tìm nhị phân để tổng NRU cả kỳ khớp (giữ % giảm đang nhập).
 */
export function syncModes(inputs: Inputs): SyncResult | null {
  const a = inputs.acquisition;
  const days = inputs.months * DAYS_PER_MONTH;
  const base = totalsOf(a, days);
  if (base.nru <= 0) return null;

  const next: AcquisitionInputs = { ...a };
  const months = base.monthlyNru.length;

  if (a.mode !== 'target') {
    next.targetNruPerDay = base.monthlyNru.map((n, i) =>
      Math.round(n / boostSum(a.launchInstallBoost, i + 1)),
    );
  }
  if (a.mode !== 'installPlan') {
    next.installsPerDay = base.monthlyNru.map((n, i) => {
      const m = i + 1;
      const perUa = a.cvr * (1 + monthValue(a.organicRatio, m));
      return perUa > 0 ? Math.round(n / (boostSum(a.launchInstallBoost, m) * perUa)) : 0;
    });
  }
  if (a.mode !== 'budget') {
    const month1 = Math.round(base.monthlyMkt[0] / 1e6) * 1e6;
    const nruAt = (maintain: number) =>
      totalsOf({ ...next, mode: 'budget', budgetMonth1: month1, budgetMaintain: maintain }, days)
        .nru;
    let lo = 0;
    let hi = Math.max(1e9, month1);
    for (let i = 0; i < 40 && nruAt(hi) < base.nru; i++) hi *= 2;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (nruAt(mid) < base.nru) lo = mid;
      else hi = mid;
    }
    next.budgetMonth1 = month1;
    next.budgetMaintain = months > 1 ? Math.round((lo + hi) / 2 / 1e6) * 1e6 : month1;
  }

  const modes: AcquisitionMode[] = ['installPlan', 'budget', 'target'];
  const totals = modes.map((mode) => {
    const t = mode === a.mode ? base : totalsOf({ ...next, mode }, days);
    return { mode, nru: t.nru, mkt: t.mkt };
  });
  return { acquisition: next, from: a.mode, totals };
}
