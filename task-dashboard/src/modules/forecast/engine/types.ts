/** Tham số đầu vào của mô hình. Mảng "theo tháng" có index 0 = T1; thiếu tháng thì lấy giá trị cuối. */

export type AcquisitionMode = 'installPlan' | 'target' | 'budget';
export type RevenueModel = 'arpuCurve' | 'payerValue';

export interface PreRegistrationDay {
  label: string;
  installs: number;
  /** Tỉ lệ user đăng ký trước thực sự vào game ngày OB */
  conversion: number;
  /** Chi phí ads = NRU × CPN T1 × mktFactor */
  mktFactor: number;
}

export interface AcquisitionInputs {
  mode: AcquisitionMode;
  /** Cài đặt → user thật */
  cvr: number;
  /** installPlan: lượt cài UA mỗi ngày, theo tháng */
  installsPerDay: number[];
  /** User organic = NRU UA × tỉ lệ này, theo tháng */
  organicRatio: number[];
  /** Giá 1 user mới (VND), theo tháng. Tiền ads = NRU × CPN */
  cpn: number[];
  /** Hệ số nhân lượt cài / NRU cho các ngày đầu sau OB (index 0 = ngày 1) */
  launchInstallBoost: number[];
  /** Hệ số nhân tiền ads cho các ngày đầu sau OB */
  launchMktBoost: number[];
  preRegistration: PreRegistrationDay[];
  /** target: NRU mục tiêu mỗi ngày, theo tháng */
  targetNruPerDay: number[];
  /** budget: ngân sách ads T1, mức duy trì, % giảm mỗi tháng từ T2 về mức duy trì */
  budgetMonth1: number;
  budgetMaintain: number;
  budgetDecay: number;
}

export interface RetentionInputs {
  d1: number;
  d3: number;
  d7: number;
  d14: number;
  d30: number;
  /** R(D2) = R(D1) × hệ số này */
  d2FromD1: number;
  /** Trọng số nội suy giữa các mốc: R = lo − (lo − hi) × w */
  w3to7: number[];
  w7to14: number[];
  w14to30: number[];
  /** Sau D30: R(d) = R(d−1) × tailKeep */
  tailKeep: number;
  /** Retention không xuống dưới mức này (trước cutoffAge) */
  floor: number;
  /** Từ tuổi này trở đi retention = 0 */
  cutoffAge: number;
  /** Cohort ngày OB (gộp cả user đăng ký trước) được nhân hệ số này, trừ ngày đầu mỗi chu kỳ */
  launchCohortBoost: number;
  /** Độ dài chu kỳ (ngày): ngày 1, 1 + chu kỳ, 1 + 2×chu kỳ… không nhân hệ số, các ngày còn lại nhân */
  launchCohortBoostCycleDays: number;
}

export interface RevenueInputs {
  model: RevenueModel;
  /** Doanh thu / NRU theo tuổi user (index 0 = ngày cài) */
  arpuCurve: number[];
  /** Hệ số nhân đường ARPU theo cohort: [OB & đăng ký trước, pha 2, pha 3] */
  phaseMultipliers: number[];
  /** Ngày cohort bắt đầu mỗi pha (ngày 1 = OB) */
  phaseStartDays: number[];
  payrate: number;
  /** payerValue: doanh thu vòng đời của 1 người trả tiền (VND) */
  payerLifetimeValue: number;
}

export interface FixedCosts {
  branding: number[];
  community: number[];
  bonus: number[];
  server: number[];
  staff: number[];
  other: number[];
  managementFee: number[];
}

export interface CostInputs {
  iapRatio: number[];
  nonIapRatio: number;
  vatRate: number;
  iapVatBase: number;
  paymentFee: number;
  /** Thuế quảng cáo GG/FB/TikTok, % trên tiền ads */
  adsTax: number;
  ongDivisor: number;
  devIapDeduct: number;
  devGrossUp: number;
  /** Share dev = doanh thu đối soát × tỉ lệ này */
  shareRate: number;
  licenseFeeUsd: number;
  minimumGuaranteeUsd: number;
  /** Cộng share dev (sau khi trừ MG) vào tổng chi phí */
  includeShareDevInCost: boolean;
  fixed: FixedCosts;
}

export interface Inputs {
  name: string;
  months: number;
  usdVnd: number;
  acquisition: AcquisitionInputs;
  retention: RetentionInputs;
  revenue: RevenueInputs;
  costs: CostInputs;
}

export interface DailyRow {
  /** 1-based, ngày 1 = OB */
  day: number;
  month: number;
  /** Ngày trong tháng, 1..30 */
  dayOfMonth: number;
  installUa: number;
  nruUa: number;
  organic: number;
  nru: number;
  dau: number;
  mkt: number;
  revenue: number;
  pu: number;
}

export interface MonthlyRow {
  month: number;
  nru: number;
  nruUa: number;
  dauAvg: number;
  dauPeak: number;
  revenue: number;
  revenueIap: number;
  revenueNonIap: number;
  revenueOnG: number;
  revenueDev: number;
  vat: number;
  paymentFee: number;
  mkt: number;
  /** Thuế quảng cáo GG/FB/TikTok, % trên tiền ads */
  adsTax: number;
  branding: number;
  community: number;
  bonus: number;
  server: number;
  staff: number;
  other: number;
  managementFee: number;
  licenseFee: number;
  minimumGuarantee: number;
  /** Share dev tính trên doanh thu đối soát (chưa trừ MG) */
  shareDev: number;
  /** Share dev thực trả sau khi bù trừ MG đã ứng */
  shareDevAfterMg: number;
  totalSpent: number;
  profit: number;
  /** Lũy kế lợi nhuận */
  cumulative: number;
}

export interface Summary {
  nru: number;
  nruUa: number;
  /** Tổng lượt cài, gồm đăng ký trước */
  installs: number;
  peakDau: number;
  /** DAU bình quân cả kỳ */
  avgDau: number;
  revenue: number;
  totalSpent: number;
  profit: number;
  /** Lợi nhuận / doanh thu */
  margin: number;
  /** Lợi nhuận / tổng chi phí (ô B35 trong Excel) */
  profitOverSpent: number;
  mkt: number;
  /** Tiền ads / NRU UA */
  costPerInstall: number;
  ltv365: number;
  /** LTV 365 ngày / CPN bình quân */
  ltvOverCpn: number;
  avgCpn: number;
  shareDevPaid: number;
  oneTimeCosts: number;
  vat: number;
  paymentFee: number;
  adsTax: number;
  /** Branding, community, bonus, server, nhân sự, khác, phí quản lý */
  fixedCosts: number;
  /** Tháng đầu tiên lũy kế ≥ 0, null nếu chưa hoàn vốn */
  breakEvenMonth: number | null;
}

export interface Result {
  retention: number[];
  daily: DailyRow[];
  monthly: MonthlyRow[];
  summary: Summary;
}
