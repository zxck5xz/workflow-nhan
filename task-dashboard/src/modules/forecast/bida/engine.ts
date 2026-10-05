import { RET_FILE } from './retFile';

/**
 * Mô hình dự phóng kiểu "Bida 8 Pool" (IAP + IAA), port nguyên từ `forecast-bida-8-pool (5).html`.
 * Tham số giữ đúng đơn vị của file: phần trăm nhập dạng số (80 = 80%), tiền VND, MG/LF/eCPM theo USD.
 * Test `tests/forecast/bida-engine.test.ts` đối chiếu từng số với engine JS gốc.
 */

export type BidaMode = 'users' | 'budget';
export type RetentionMode = 'file' | 'moc';

export interface BidaInputs {
  name: string;
  mode: BidaMode;
  months: number;
  installM1: number;
  installM4: number;
  installLater: number;
  prelaunchDays: number;
  budgetM1: number;
  budgetMaintain: number;
  budgetDecay: number;
  cvr: number;
  organic: number;
  organicLater: number;
  cpn: number;
  cpnGiam: number;
  cpnSan: number;
  heSoThang1: number;
  ltvD0: number;
  heSoVeSau: number;
  heSoGiaiDoan2: number;
  ltvT1: number;
  ltvT2: number;
  ltvT3: number;
  ltvDuoi: number;
  ltvDuoi2: number;
  ltvNgay: number;
  viewsAd: number;
  ecpmUsd: number;
  retMode: RetentionMode;
  heSoOB: number;
  soNgayOB: number;
  taxAdsCuoi: number;
  d1: number;
  d3: number;
  d7: number;
  d14: number;
  d30: number;
  tail: number;
  minRet: number;
  storeShareM1: number;
  storeShareM2: number;
  storeShare: number;
  webShare: number;
  heSoOnG: number;
  heSoDoiSoat: number;
  storeTruDoiSoat: number;
  vatRate: number;
  vatStore: number;
  fee: number;
  taxAds: number;
  shareDev: number;
  shareDevTier2: number;
  mg: number;
  nguongShare: number;
  lf: number;
  fx: number;
  preLaunch: number;
  salaryM1: number;
  mucLuong: number;
  serverM1: number;
  serverM2: number;
  serverMth: number;
  serverLate: number;
  communityM1: number;
  communityMth: number;
  communityLate: number;
  brandingM1: number;
  brandingMth: number;
  otherOne: number;
  phiQuanLy: number;
  mucPhiQuanLy: number;
  /** Mở rộng cho game mới (file Bida không có, mặc định 0): marketing và chi phí khác trả mỗi tháng */
  marketingMth: number;
  otherMth: number;
}

export interface BidaMonth {
  m: number;
  ads: number;
  revenue: number;
  iap: number;
  iaa: number;
  nru: number;
  dauAvg: number;
  installs: number;
  cost: number;
  profit: number;
  vat: number;
  gateway: number;
  adsTax: number;
  /** Share dev thực trả trong tháng (sau khi cấn trừ MG) */
  shareDev: number;
  shareDevRaw: number;
  mg: number;
  doiSoat: number;
  fixed: number;
  cum: number;
}

export interface BidaTotals {
  days: number;
  months: number;
  fx: number;
  cpn: number;
  cpnM1: number;
  preLaunch: number;
  mgTotal: number;
  nru: number;
  installs: number;
  revenue: number;
  iap: number;
  iaa: number;
  cost: number;
  ads: number;
  vat: number;
  gateway: number;
  adsTax: number;
  mg: number;
  fixed: number;
  shareDev: number;
  profit: number;
  ratio: number;
  dauPeak: number;
  dauGameDays: number;
  dauAvg: number;
  ltv30: number;
  ltvLife: number;
  ltv365: number;
  /** Index tháng (0-based) lũy kế chuyển dương, −1 nếu chưa hoàn vốn */
  payback: number;
  cum: number[];
}

export interface BidaResult {
  inp: BidaInputs;
  days: number;
  /** Số ngày chạy trước OB (ngày index < pre là trước khi mở game) */
  pre: number;
  ret: number[];
  nru: number[];
  dau: number[];
  iap: number[];
  iaa: number[];
  ads: number[];
  installs: number[];
  monthly: BidaMonth[];
  totals: BidaTotals;
}

/* Nhịp ngày của THÁNG MỞ GAME: hôm đầu ×2, hôm sau ×1,8, 5 hôm ×1,5, 7 hôm ×1,3, còn lại ×1 */
const RAMP1 = [
  2, 1.8, 1.5, 1.5, 1.5, 1.5, 1.5, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1,
];
/* Những ngày chạy trước khi mở game: install so với mức nền, % user thật giữ lại, hệ số tiền ads */
const PRE_INS = [0.4, 0.8, 1.2, 1.6, 2.0];
const PRE_KEEP = [0.5, 0.6, 0.7, 0.7, 0.8];
const PRE_ADSF = [0.85, 0.85, 0.9, 0.95, 1.0];
const PRE_DIV = 0.7;

function retentionCurve(R: BidaInputs, maxDay: number): number[] {
  if ((R.retMode || 'file') === 'file') {
    const outF = new Array<number>(maxDay + 1);
    for (let d = 0; d <= maxDay; d++) outF[d] = d < RET_FILE.length ? RET_FILE[d] : 0;
    return outF;
  }
  const pts = [
    { d: 0, v: 1 },
    { d: 1, v: R.d1 / 100 },
    { d: 3, v: R.d3 / 100 },
    { d: 7, v: R.d7 / 100 },
    { d: 14, v: R.d14 / 100 },
    { d: 30, v: R.d30 / 100 },
  ];
  const out = new Array<number>(maxDay + 1);
  for (let d = 0; d <= maxDay; d++) {
    if (d === 0) {
      out[0] = 1;
      continue;
    }
    if (d <= 30) {
      let lo = pts[0];
      let hi = pts[pts.length - 1];
      for (const p of pts) if (p.d <= d) lo = p;
      for (const p of pts)
        if (p.d >= d) {
          hi = p;
          break;
        }
      const x = Math.log(Math.max(d, 1));
      const xl = Math.log(Math.max(lo.d, 1));
      const xh = Math.log(Math.max(hi.d, 1));
      const t = xh === xl ? 0 : (x - xl) / (xh - xl);
      const lv = Math.log(Math.max(lo.v, 1e-9));
      out[d] = Math.exp(lv + t * (Math.log(Math.max(hi.v, 1e-9)) - lv));
    } else {
      out[d] = Math.max((R.d30 / 100) * Math.pow(R.tail / 100, d - 30), (R.minRet || 0) / 100);
    }
  }
  return out;
}

const sum = (a: ArrayLike<number>) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i];
  return s;
};

function monthOf(d: number, pre: number): number {
  if (d < pre + 30) return 1;
  return 2 + Math.floor((d - pre - 30) / 30);
}
function installBase(m: number, inp: BidaInputs): number {
  return m <= 3 ? inp.installM1 : m <= 6 ? inp.installM4 : inp.installLater;
}
/** Tỉ lệ user tự nhiên tăng dần từ `organic` lên `organicLater` theo quý (tối đa sau 12 tháng). */
export function orgRate(m: number, inp: BidaInputs): number {
  const t = Math.min(1, Math.floor((m - 1) / 3) / 4);
  return (inp.organic + (inp.organicLater - inp.organic) * t) / 100;
}
/** CPN tháng m so với tháng 1: T1 100%, T2 mức giữa, T3–T12 = cpnGiam, từ T13 = cpnSan. */
export function cpnFactor(m: number, inp: BidaInputs): number {
  const g = Math.min(1, Math.max(0, inp.cpnGiam / 100));
  const san = Math.min(1, Math.max(0, inp.cpnSan / 100));
  if (m > 12) return san;
  return Math.max(g, 1 - ((1 - g) * (m - 1)) / 2);
}
export function fixedCost(m: number, inp: BidaInputs) {
  const branding =
    m === 1 ? inp.brandingM1 : m <= 3 ? inp.brandingMth : m % 3 === 0 ? inp.brandingMth : 0;
  const community = m <= 3 ? inp.communityM1 : m <= 12 ? inp.communityMth : inp.communityLate;
  const server =
    m === 2
      ? inp.serverM2
      : m === 1 || m === 3
        ? inp.serverM1
        : m <= 12
          ? inp.serverMth
          : inp.serverLate;
  const salary = m <= 12 ? inp.salaryM1 : (inp.salaryM1 * inp.mucLuong) / 100;
  const other = (m === 12 ? inp.otherOne : 0) + (inp.otherMth || 0);
  const phi = m <= 12 ? inp.phiQuanLy : (inp.phiQuanLy * inp.mucPhiQuanLy) / 100;
  const marketing = inp.marketingMth || 0;
  return {
    branding,
    community,
    server,
    salary,
    other,
    phi,
    marketing,
    total: branding + community + server + salary + other + phi + marketing,
  };
}
/** Doanh thu IAP của 1 user theo tuổi: ngày đầu ltvD0, rồi bậc thang xuống, hết sau ltvNgay. */
export function ltvAt(age: number, inp: BidaInputs, keepTail: boolean): number {
  if (age > inp.ltvNgay) return 0;
  let s: number;
  if (age === 0) s = 1;
  else if (age <= 5) s = inp.ltvT1 / 100;
  else if (age <= 12) s = inp.ltvT2 / 100;
  else if (age <= 20) s = inp.ltvT3 / 100;
  else if (age <= 119 || keepTail) s = inp.ltvDuoi / 100;
  else s = inp.ltvDuoi2 / 100;
  return inp.ltvD0 * s;
}
/** Nhóm user vào đầu chi tiêu cao hơn nhóm vào sau. */
function ltvScale(d: number, pre: number, inp: BidaInputs): number {
  if (d <= pre) return 1;
  if (d <= pre + 6) return inp.heSoGiaiDoan2 / 100;
  return inp.heSoVeSau / 100;
}

export function computeBida(inp: BidaInputs): BidaResult {
  const months = Math.max(1, Math.round(inp.months));
  const pre = Math.max(0, Math.round(inp.prelaunchDays || 0));
  const days = pre + months * 30;
  const cvr = inp.cvr / 100;
  const fx = inp.fx;
  const veSau = inp.heSoVeSau / 100;
  const ecpmVnd = inp.ecpmUsd * fx;
  const thresh = inp.mg * fx;
  const thresh2 = (inp.nguongShare || 1000000) * fx;
  const ltvDays = Math.max(0, Math.round(inp.ltvNgay));
  const heSoOB = (inp.heSoOB != null ? inp.heSoOB : 120) / 100;
  const soNgayOB = Math.max(0, Math.round(inp.soNgayOB != null ? inp.soNgayOB : 119));
  const maxLife = Math.min(days - 1, 400);
  const ret = retentionCurve(inp, maxLife);

  const bounds = [0, pre + 30];
  for (let m = 2; m <= months; m++) bounds.push(pre + 30 + (m - 1) * 30);

  const adsMonthly = new Array<number>(months + 1).fill(0);
  if (inp.mode === 'budget') {
    const dec = Math.max(1, inp.budgetDecay);
    for (let m = 1; m <= months; m++) {
      const t = Math.min(1, (m - 1) / dec);
      adsMonthly[m] = inp.budgetMaintain + (inp.budgetM1 - inp.budgetMaintain) * (1 - t);
    }
  }

  const installs = new Array<number>(days).fill(0);
  const nru = new Array<number>(days).fill(0);
  const ads = new Array<number>(days).fill(0);
  for (let d = 0; d < days; d++) {
    const m = d < pre ? 1 : monthOf(d, pre);
    const org = orgRate(m, inp);
    const cpnM = Math.max(1, inp.cpn * cpnFactor(m, inp));
    if (d < pre) {
      const ins = installBase(1, inp) * (PRE_INS[d] !== undefined ? PRE_INS[d] : 1);
      installs[d] = ins;
      nru[d] = Math.round(Math.floor(ins * cvr) * (1 + org) * PRE_KEEP[d]);
      ads[d] = nru[d] * cpnM * (PRE_ADSF[d] / PRE_DIV);
    } else if (inp.mode === 'budget') {
      const a = adsMonthly[m] / 30;
      const u = a / (cpnM * (m === 1 && d - pre <= 6 ? inp.heSoThang1 / 100 : 1));
      nru[d] = u;
      installs[d] = u / ((1 + org) * cvr);
      ads[d] = a;
    } else {
      const i = d - pre;
      const ins = installBase(m, inp) * (m === 1 ? RAMP1[i % 30] : 1);
      installs[d] = ins;
      nru[d] = Math.round(Math.floor(ins * cvr) * (1 + org));
      const f = m === 1 && i <= 6 ? inp.heSoThang1 / 100 : 1;
      ads[d] = nru[d] * cpnM * f;
    }
  }

  const dau = new Array<number>(days).fill(0);
  const iap = new Array<number>(days).fill(0);
  const iaa = new Array<number>(days).fill(0);
  for (let d = 0; d < days; d++) {
    let s = 0;
    const kMax = Math.min(d, ret.length - 1);
    for (let k = 0; k <= kMax; k++) {
      const c = d - k;
      const isOB = c <= pre;
      const ageR = isOB ? Math.max(0, d - pre) : k;
      const bOB = isOB && ageR >= 1 && ageR <= soNgayOB ? heSoOB : 1;
      s += Math.floor(nru[c] * ret[ageR] * bOB);
    }
    dau[d] = d < pre ? 0 : s;
    iaa[d] = d < pre ? 0 : (s * inp.viewsAd * ecpmVnd) / 1000;
    let r = 0;
    const ageE = d - pre;
    if (ageE >= 0 && ageE <= ltvDays) {
      let sC = 0;
      const cMax = Math.min(pre, d);
      for (let c = 0; c <= cMax; c++) sC += nru[c];
      r += sC * ltvAt(ageE, inp, true);
    }
    const cFrom = Math.max(pre + 1, d - ltvDays);
    for (let c = cFrom; c <= d; c++) r += nru[c] * ltvAt(d - c, inp, false) * ltvScale(c, pre, inp);
    iap[d] = r;
  }

  const monthly: BidaMonth[] = [];
  const cumArr: number[] = [];
  let cumShareDev = 0;
  let cumMG = 0;
  let prevCounted = 0;
  let cum = 0;
  for (let m = 1; m <= months; m++) {
    const s = bounds[m - 1];
    const e = bounds[m];
    let a = 0;
    let rIap = 0;
    let rIaa = 0;
    let nn = 0;
    let dd = 0;
    let ins = 0;
    let dcnt = 0;
    for (let d = s; d < e; d++) {
      a += ads[d];
      rIap += iap[d];
      rIaa += iaa[d];
      nn += nru[d];
      ins += installs[d];
      if (d >= pre) {
        dd += dau[d];
        dcnt++;
      }
    }
    const ssM = (m === 1 ? inp.storeShareM1 : m === 2 ? inp.storeShareM2 : inp.storeShare) / 100;
    const store = rIap * ssM;
    const web = (rIap * inp.webShare) / 100;
    const vatR = inp.vatRate / 100;
    const storeVat = (store * inp.vatStore) / 100;
    const vat = web - web / (1 + vatR) + (storeVat - storeVat / (1 + vatR));
    const gateway = (rIap * inp.fee) / 100;
    const ong = rIap / (inp.heSoOnG / 100);
    const doiSoat = (ong - (store * inp.storeTruDoiSoat) / 100) * (inp.heSoDoiSoat / 100) + store;
    const shareDevRaw =
      doiSoat >= thresh2
        ? (doiSoat - thresh2) * (inp.shareDevTier2 / 100) + (thresh2 * inp.shareDev) / 100
        : (doiSoat * inp.shareDev) / 100;
    const taxM = m === months && inp.taxAdsCuoi != null ? inp.taxAdsCuoi : inp.taxAds;
    const adsTax = (a * taxM) / 100;
    const mgM = m === 1 ? thresh : 0;
    cumShareDev += shareDevRaw;
    cumMG += mgM;
    const X = Math.max(0, cumShareDev - cumMG);
    const counted = X - prevCounted;
    prevCounted = X;
    const fc = fixedCost(m, inp);
    let spent = vat + gateway + a + adsTax + fc.total + mgM + counted;
    if (m === 1) spent += inp.preLaunch + inp.lf * fx;
    const revenue = rIap + rIaa;
    const profit = revenue - spent;
    cum += profit;
    cumArr.push(cum);
    monthly.push({
      m,
      ads: a,
      revenue,
      iap: rIap,
      iaa: rIaa,
      nru: nn,
      dauAvg: dcnt ? dd / dcnt : 0,
      installs: ins,
      cost: spent,
      profit,
      vat,
      gateway,
      adsTax,
      shareDev: counted,
      shareDevRaw,
      mg: mgM,
      doiSoat,
      fixed: fc.total,
      cum,
    });
  }

  let revenue = 0;
  let iapT = 0;
  let iaaT = 0;
  let cost = 0;
  let adsT = 0;
  let vat = 0;
  let gateway = 0;
  let adsTax = 0;
  let mg = 0;
  let fixed = 0;
  for (const x of monthly) {
    revenue += x.revenue;
    iapT += x.iap;
    iaaT += x.iaa;
    cost += x.cost;
    adsT += x.ads;
    vat += x.vat;
    gateway += x.gateway;
    adsTax += x.adsTax;
    mg += x.mg;
    fixed += x.fixed;
  }
  const profit = revenue - cost;
  let dauPeak = 0;
  for (const v of dau) if (v > dauPeak) dauPeak = v;
  const dauGameDays = Math.max(1, days - pre);
  let sd = 0;
  for (let d = pre; d < days; d++) sd += dau[d];
  const ltvAll = (max: number) => {
    let s = 0;
    const n = Math.min(max, ltvDays);
    for (let a = 0; a <= n; a++) s += ltvAt(a, inp, true) * veSau;
    return s;
  };
  const ltvLife = ltvAll(ltvDays);
  let payback = -1;
  for (let i = 0; i < months; i++) if (payback < 0 && cumArr[i] >= 0) payback = i;

  return {
    inp,
    days,
    pre,
    ret,
    nru,
    dau,
    iap,
    iaa,
    ads,
    installs,
    monthly,
    totals: {
      days,
      months,
      fx,
      cpn: inp.cpn,
      cpnM1: Math.max(1, inp.cpn * cpnFactor(1, inp)),
      preLaunch: inp.preLaunch,
      mgTotal: thresh,
      nru: sum(nru),
      installs: sum(installs),
      revenue,
      iap: iapT,
      iaa: iaaT,
      cost,
      ads: adsT,
      vat,
      gateway,
      adsTax,
      mg,
      fixed,
      shareDev: prevCounted,
      profit,
      ratio: revenue ? profit / revenue : 0,
      dauPeak,
      dauGameDays,
      dauAvg: sd / dauGameDays,
      ltv30: ltvAll(30),
      ltvLife,
      ltv365: ltvLife,
      payback,
      cum: cumArr,
    },
  };
}
