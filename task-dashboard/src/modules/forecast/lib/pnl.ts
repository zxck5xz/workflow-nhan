import type { DailyRow, MonthlyRow } from '../engine';

export interface Line<T> {
  key: keyof T;
  label: string;
  /** Dòng tổng / nhấn mạnh */
  strong?: boolean;
  kind?: 'money' | 'int';
}

/** CIR = chi phí / doanh thu của tháng; null khi tháng không có doanh thu */
export function cirOf(m: Pick<MonthlyRow, 'revenue' | 'totalSpent'>): number | null {
  return m.revenue > 0 ? m.totalSpent / m.revenue : null;
}

/** Class màu chữ cho lũy kế: đỏ khi âm, xanh lá khi đã dương */
export function cumClass(v: number): 'neg' | 'pos' | undefined {
  return v < 0 ? 'neg' : v > 0 ? 'pos' : undefined;
}

/** Các dòng P&L chi tiết, theo thứ tự sheet Forecast. */
export const PNL_LINES: Line<MonthlyRow>[] = [
  { key: 'nru', label: 'NRU', kind: 'int' },
  { key: 'nruUa', label: 'NRU UA', kind: 'int' },
  { key: 'dauAvg', label: 'DAU bình quân', kind: 'int' },
  { key: 'revenue', label: 'Doanh thu thực tế', strong: true },
  { key: 'revenueIap', label: 'Doanh thu IAP' },
  { key: 'revenueNonIap', label: 'Doanh thu thực tế (−IAP)' },
  { key: 'revenueOnG', label: 'Doanh thu OnG' },
  { key: 'revenueDev', label: 'Doanh thu đối soát với Dev' },
  { key: 'vat', label: 'Thuế VAT' },
  { key: 'paymentFee', label: 'Chia sẻ cổng thanh toán' },
  { key: 'mkt', label: 'MKT (tiền ads)' },
  { key: 'adsTax', label: 'Thuế ads' },
  { key: 'branding', label: 'Branding' },
  { key: 'community', label: 'Community' },
  { key: 'shareDev', label: 'Share Dev (chưa trừ MG)' },
  { key: 'licenseFee', label: 'Mua game (LF)' },
  { key: 'minimumGuarantee', label: 'MG' },
  { key: 'shareDevAfterMg', label: 'Share Dev sau khi trừ MG' },
  { key: 'bonus', label: 'Bonus' },
  { key: 'server', label: 'Server' },
  { key: 'staff', label: 'Nhân sự' },
  { key: 'other', label: 'Chi phí khác' },
  { key: 'managementFee', label: 'Phí quản lý' },
  { key: 'totalSpent', label: 'Tổng chi phí', strong: true },
  { key: 'profit', label: 'Lợi nhuận', strong: true },
  { key: 'cumulative', label: 'Lũy Kế', strong: true },
];

export const DAILY_LINES: Line<DailyRow>[] = [
  { key: 'day', label: 'Ngày', kind: 'int' },
  { key: 'month', label: 'Tháng', kind: 'int' },
  { key: 'dayOfMonth', label: 'Ngày trong tháng', kind: 'int' },
  { key: 'installUa', label: 'Install UA', kind: 'int' },
  { key: 'nruUa', label: 'NRU UA', kind: 'int' },
  { key: 'organic', label: 'Organic', kind: 'int' },
  { key: 'nru', label: 'NRU', kind: 'int' },
  { key: 'dau', label: 'DAU', kind: 'int' },
  { key: 'pu', label: 'PU', kind: 'int' },
  { key: 'mkt', label: 'Tiền ads' },
  { key: 'revenue', label: 'Doanh thu' },
];
