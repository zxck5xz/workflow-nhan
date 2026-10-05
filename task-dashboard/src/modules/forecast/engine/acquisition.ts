import type { AcquisitionInputs } from './types';
import { DAYS_PER_MONTH, monthOfDay, monthValue, rounddown } from './util';

export interface AcquisitionResult {
  /** Mảng theo ngày, index 0 = ngày 1 (OB) */
  installUa: number[];
  nruUa: number[];
  organic: number[];
  nru: number[];
  mkt: number[];
  /** Tổng giai đoạn đăng ký trước (OB-5 → OB-1), cộng vào T1 */
  preReg: { installs: number; nruUa: number; nru: number; mkt: number };
}

/** Ngân sách ads tháng m ở chế độ "Theo ngân sách": từ T2 giảm dần về mức duy trì. */
export function monthlyBudget(a: AcquisitionInputs, month: number): number {
  let b = a.budgetMonth1;
  for (let m = 2; m <= month; m++)
    b = a.budgetMaintain + (b - a.budgetMaintain) * (1 - a.budgetDecay);
  return b;
}

function boost(arr: number[], day: number): number {
  return day - 1 < arr.length ? arr[day - 1] : 1;
}

export function simulateAcquisition(a: AcquisitionInputs, days: number): AcquisitionResult {
  const installUa: number[] = [];
  const nruUa: number[] = [];
  const organic: number[] = [];
  const nru: number[] = [];
  const mkt: number[] = [];

  for (let day = 1; day <= days; day++) {
    const m = monthOfDay(day);
    const org = monthValue(a.organicRatio, m);
    const cpn = monthValue(a.cpn, m);
    const mktBoost = boost(a.launchMktBoost, day);

    if (a.mode === 'installPlan') {
      // Excel: NRU UA = ROUNDDOWN(install × CVR), organic = NRU UA × %, tiền ads = NRU × CPN
      const inst = monthValue(a.installsPerDay, m) * boost(a.launchInstallBoost, day);
      const ua = rounddown(inst * a.cvr);
      const o = ua * org;
      installUa.push(inst);
      nruUa.push(ua);
      organic.push(o);
      nru.push(ua + o);
      mkt.push((ua + o) * cpn * mktBoost);
      continue;
    }

    // target / budget: đi ngược từ NRU (hoặc tiền ads) ra lượt cài, cùng công thức với installPlan
    let total: number;
    let spend: number;
    if (a.mode === 'target') {
      total = monthValue(a.targetNruPerDay, m) * boost(a.launchInstallBoost, day);
      spend = total * cpn * mktBoost;
    } else {
      spend = monthlyBudget(a, m) / DAYS_PER_MONTH;
      total = cpn > 0 ? spend / (cpn * mktBoost) : 0;
    }
    const ua = total / (1 + org);
    installUa.push(a.cvr > 0 ? ua / a.cvr : 0);
    nruUa.push(ua);
    organic.push(total - ua);
    nru.push(total);
    mkt.push(spend);
  }

  const preReg = { installs: 0, nruUa: 0, nru: 0, mkt: 0 };
  const org1 = monthValue(a.organicRatio, 1);
  const cpn1 = monthValue(a.cpn, 1);
  for (const p of a.preRegistration) {
    const ua = rounddown(p.installs * a.cvr);
    const n = (ua + ua * org1) * p.conversion;
    preReg.installs += p.installs;
    preReg.nruUa += ua;
    preReg.nru += n;
    preReg.mkt += n * cpn1 * p.mktFactor;
  }

  return { installUa, nruUa, organic, nru, mkt, preReg };
}
