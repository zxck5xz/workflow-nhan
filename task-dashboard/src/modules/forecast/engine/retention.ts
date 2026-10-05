import type { RetentionInputs } from './types';

/**
 * Tỉ lệ giữ chân theo tuổi user (index 0 = ngày cài = 1).
 * Giữa các mốc D1/D3/D7/D14/D30 nội suy theo trọng số giống Excel: R = lo − (lo − hi) × w.
 */
export function retentionCurve(r: RetentionInputs, length: number): number[] {
  const c = new Array<number>(length).fill(0);
  const set = (age: number, v: number) => {
    if (age < length) c[age] = v;
  };
  const span = (fromAge: number, lo: number, hi: number, weights: number[]) =>
    weights.forEach((w, i) => set(fromAge + 1 + i, lo - (lo - hi) * w));

  set(0, 1);
  set(1, r.d1);
  set(2, r.d1 * r.d2FromD1);
  set(3, r.d3);
  span(3, r.d3, r.d7, r.w3to7);
  set(7, r.d7);
  span(7, r.d7, r.d14, r.w7to14);
  set(14, r.d14);
  span(14, r.d14, r.d30, r.w14to30);
  set(30, r.d30);
  for (let age = 31; age < length; age++) {
    const prev = c[age - 1];
    c[age] = prev - prev * (1 - r.tailKeep);
  }
  for (let age = 1; age < length; age++) {
    c[age] = age >= r.cutoffAge ? 0 : Math.max(c[age], r.floor);
  }
  return c;
}
