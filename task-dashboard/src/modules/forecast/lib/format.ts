const intFmt = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 });

function decimal(v: number, digits: number): string {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
}

/** 1.096.500 */
export function fmtInt(v: number): string {
  return intFmt.format(Math.round(v));
}

/** Tiền rút gọn: 52,22 tỷ · -67,6 tr · 23.040 đ */
export function fmtMoney(v: number, opts: { sign?: boolean } = {}): string {
  const sign = opts.sign && v > 0 ? '+' : '';
  const a = Math.abs(v);
  if (a >= 1e9) return `${sign}${decimal(v / 1e9, 2)} tỷ`;
  if (a >= 1e6) return `${sign}${decimal(v / 1e6, 1)} tr`;
  return `${sign}${fmtInt(v)} đ`;
}

/** 52.220.924.018 đ */
export function fmtVnd(v: number): string {
  return `${fmtInt(v)} đ`;
}

/** 9,9% */
export function fmtPct(v: number, digits = 1): string {
  return `${decimal(v * 100, digits)}%`;
}

export function fmtRatio(v: number): string {
  return `${decimal(v, 2)}×`;
}

const UNITS: [RegExp, number][] = [
  [/(tỷ|ty)$/, 1e9],
  [/(triệu|trieu|tr)$/, 1e6],
  [/(nghìn|nghin|ngàn|ngan|k)$/, 1e3],
];

/** Đọc số người dùng gõ kiểu VN: "1.500.000", "3,7", và dạng tắt "5,5 tỷ", "100tr", "1tr5", "26k" */
export function parseVnNumber(text: string): number | null {
  let t = text.trim().toLowerCase().replace(/\s/g, '').replace(/[đ%]$/, '');
  if (t === '' || t === '-') return null;
  // "1tr5" = 1,5 tr
  const short = t.match(/^(-?\d+)(tỷ|ty|tr|k)(\d)$/);
  if (short) t = `${short[1]},${short[3]}${short[2]}`;
  let mult = 1;
  for (const [re, m] of UNITS) {
    if (re.test(t)) {
      mult = m;
      t = t.replace(re, '');
      break;
    }
  }
  if (t === '' || t === '-') return null;
  const n = Number(t.replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(n)) return null;
  return mult === 1 ? n : Math.round(n * mult * 100) / 100;
}

/** Hiển thị số trong ô nhập: phần nghìn bằng dấu chấm, thập phân bằng dấu phẩy */
export function formatInput(v: number, maxDigits = 4): string {
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: maxDigits }).format(v);
}
