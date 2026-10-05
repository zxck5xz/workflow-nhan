export const DAYS_PER_MONTH = 30;

/** Giá trị tháng m (1-based); hết mảng thì lấy phần tử cuối, hoặc 0 nếu extendLast = false. */
export function monthValue(arr: number[], month: number, extendLast = true): number {
  if (arr.length === 0) return 0;
  if (month - 1 < arr.length) return arr[month - 1];
  return extendLast ? arr[arr.length - 1] : 0;
}

export function monthOfDay(day: number): number {
  return Math.ceil(day / DAYS_PER_MONTH);
}

/** ROUNDDOWN(x, 0) của Excel cho số dương, chịu được sai số dấu phẩy động (vd 3249.9999999). */
export function rounddown(x: number): number {
  return Math.floor(x + Math.abs(x) * 1e-12);
}

export function sum(arr: number[]): number {
  let s = 0;
  for (const v of arr) s += v;
  return s;
}
