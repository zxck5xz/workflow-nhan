/**
 * Sinh tests/forecast/fixtures/bida-reference.json bằng cách chạy CHÍNH engine JS trong file HTML Bida
 * (thẻ <script> đầu tiên: DEFAULTS, SCHEMA, computeModel) với vài bộ tham số.
 * Dùng: node scripts/forecast/gen_bida_reference.cjs "<đường dẫn>/forecast-bida-8-pool (5).html"
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = process.argv[2];
if (!htmlPath) throw new Error('Thiếu đường dẫn file HTML Bida');
const outPath = path.join(__dirname, '../../tests/forecast/fixtures/bida-reference.json');

const html = fs.readFileSync(htmlPath, 'utf8');
const engineSrc = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
const ctx = {};
vm.createContext(ctx);
vm.runInContext(`${engineSrc}\n;this.DEFAULTS = DEFAULTS; this.computeModel = computeModel;`, ctx);
const { DEFAULTS, computeModel } = ctx;

const cases = {
  'default-24': {},
  'months-12': { months: 12 },
  'months-36': { months: 36 },
  'budget-24': { mode: 'budget' },
  'moc-24': { retMode: 'moc' },
  'moc-36-budget': { retMode: 'moc', months: 36, mode: 'budget', viewsAd: 3, cpnGiam: 60, cpnSan: 40 },
  'no-prelaunch-18': { months: 18, prelaunchDays: 0, heSoOB: 100, taxAdsCuoi: 7, organicLater: 20 },
};
// Chỉ lưu số theo ngày cho 2 trường hợp để file gọn
const WITH_DAILY = new Set(['default-24', 'moc-36-budget']);

const out = {};
for (const [name, over] of Object.entries(cases)) {
  const M = computeModel(Object.assign({}, DEFAULTS, over));
  const T = M.totals;
  out[name] = {
    overrides: over,
    totals: Object.fromEntries(Object.entries(T).filter(([, v]) => typeof v === 'number')),
    cum: Array.from(T.cum),
    monthly: M.monthly.map((x) => ({ ...x })),
  };
  if (WITH_DAILY.has(name))
    out[name].daily = Object.fromEntries(
      ['nru', 'dau', 'iap', 'iaa', 'ads', 'installs'].map((k) => [k, Array.from(M[k])]),
    );
}
fs.writeFileSync(outPath, JSON.stringify({ source: path.basename(htmlPath), defaults: DEFAULTS, cases: out }));
console.log(`Đã ghi ${outPath}`);
