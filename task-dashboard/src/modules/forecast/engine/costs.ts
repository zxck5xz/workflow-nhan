import type { CostInputs, MonthlyRow } from './types';
import { monthValue, rounddown } from './util';

export interface MonthDrivers {
  month: number;
  revenue: number;
  mkt: number;
}

type CostFields = Omit<
  MonthlyRow,
  'nru' | 'nruUa' | 'dauAvg' | 'dauPeak' | 'profit' | 'cumulative'
>;

/**
 * P&L từng tháng theo sheet Forecast. LF và MG dồn hết vào T1; chi phí cố định trước OB
 * đã được gộp vào T1 trong mảng fixed. Share dev trả = phần lũy kế vượt MG đã ứng.
 */
export function monthlyCosts(c: CostInputs, drivers: MonthDrivers[], usdVnd: number): CostFields[] {
  const licenseFee = c.licenseFeeUsd * usdVnd;
  const mgTotal = c.minimumGuaranteeUsd * usdVnd;
  let cumShare = 0;
  let cumMg = 0;
  let cumPaid = 0;

  return drivers.map(({ month, revenue, mkt }) => {
    const revenueIap = revenue * monthValue(c.iapRatio, month);
    const revenueNonIap = revenue * c.nonIapRatio;
    const revenueOnG = rounddown(revenue / c.ongDivisor);
    const revenueDev = (revenueOnG - revenueIap * c.devIapDeduct) * c.devGrossUp + revenueIap;
    const vatOf = (x: number) => x - x / (1 + c.vatRate);
    const vat = vatOf(revenueNonIap) + vatOf(revenueIap * c.iapVatBase);
    const paymentFee = revenue * c.paymentFee;
    const adsTax = mkt * c.adsTax;

    const minimumGuarantee = month === 1 ? mgTotal : 0;
    const shareDev = revenueDev * c.shareRate;
    cumShare += shareDev;
    cumMg += minimumGuarantee;
    const shareDevAfterMg = Math.max(0, cumShare - cumMg - cumPaid);
    cumPaid += shareDevAfterMg;

    const f = c.fixed;
    const fixed = {
      branding: monthValue(f.branding, month, false),
      community: monthValue(f.community, month),
      bonus: monthValue(f.bonus, month, false),
      server: monthValue(f.server, month),
      staff: monthValue(f.staff, month),
      other: monthValue(f.other, month, false),
      managementFee: monthValue(f.managementFee, month),
    };
    const licenseFeeM = month === 1 ? licenseFee : 0;

    const totalSpent =
      vat +
      paymentFee +
      mkt +
      adsTax +
      licenseFeeM +
      minimumGuarantee +
      (c.includeShareDevInCost ? shareDevAfterMg : 0) +
      fixed.branding +
      fixed.community +
      fixed.bonus +
      fixed.server +
      fixed.staff +
      fixed.other +
      fixed.managementFee;

    return {
      month,
      revenue,
      revenueIap,
      revenueNonIap,
      revenueOnG,
      revenueDev,
      vat,
      paymentFee,
      mkt,
      adsTax,
      ...fixed,
      licenseFee: licenseFeeM,
      minimumGuarantee,
      shareDev,
      shareDevAfterMg,
      totalSpent,
    };
  });
}
