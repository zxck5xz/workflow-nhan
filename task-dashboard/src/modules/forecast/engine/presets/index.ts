import type { Inputs } from '../types';
import excel from './excel-original.json';
import reference from './excel-reference.json';

/** Bộ tham số trích từ AuGo_Master_Plan_Final.xlsx (chạy scripts/extract_excel.py để cập nhật). */
export const excelOriginal = excel as Inputs;

/** Số tổng Excel đã tính sẵn (cột TOTAL sheet Forecast) để so sánh trên UI. */
export const excelReference = reference as {
  nru: number;
  mkt: number;
  revenue: number;
  totalSpent: number;
  profit: number;
  breakEvenMonth: number | null;
};

/** Mô hình gọn theo ảnh layout: retention có sàn, doanh thu = payrate × giá trị người trả tiền. */
function simplePreset(name: string, mode: 'budget' | 'target'): Inputs {
  const base = structuredClone(excelOriginal);
  return {
    ...base,
    name,
    acquisition: {
      ...base.acquisition,
      mode,
      cvr: 0.8,
      organicRatio: [0],
      cpn: [24_000],
      launchInstallBoost: [],
      launchMktBoost: [],
      preRegistration: [],
      targetNruPerDay: [1_500],
      budgetMonth1: 5_530_000_000,
      budgetMaintain: 604_800_000,
      budgetDecay: 0.5,
    },
    retention: {
      ...base.retention,
      d1: 0.34,
      d3: 0.19,
      d7: 0.12,
      d14: 0.08,
      d30: 0.035,
      tailKeep: 0.98,
      floor: 0.004,
      cutoffAge: 1_080,
      launchCohortBoost: 1,
    },
    revenue: { ...base.revenue, model: 'payerValue', payrate: 0.037, payerLifetimeValue: 210_811 },
  };
}

export interface Preset {
  id: string;
  inputs: Inputs;
  /** Có so sánh được với số Excel gốc không */
  excelBased: boolean;
}

export const presets: Preset[] = [
  { id: 'excel', inputs: excelOriginal, excelBased: true },
  { id: 'budget', inputs: simplePreset('Mẫu theo ngân sách ads', 'budget'), excelBased: false },
  { id: 'target', inputs: simplePreset('Mẫu theo mục tiêu user', 'target'), excelBased: false },
];
