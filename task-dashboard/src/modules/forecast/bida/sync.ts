import { computeBida, orgRate, type BidaInputs } from './engine';

export type BidaSyncResult =
  | { kind: 'aligned' }
  | { kind: 'empty'; message: string }
  | {
      kind: 'synced';
      from: 'users' | 'budget';
      inputs: BidaInputs;
      /** NRU của chế độ chuẩn và của chế độ vừa quy đổi */
      target: number;
      got: number;
      exact: boolean;
      note?: string;
    };

/**
 * "Đồng bộ 2 chế độ" (port syncModes của file HTML): lấy chế độ đang xem làm chuẩn rồi tìm bộ số
 * tương đương cho chế độ kia — ngân sách duy trì (tìm nhị phân) hoặc 3 mức install/ngày (hiệu chỉnh lặp).
 */
export function syncBidaModes(inp: BidaInputs): BidaSyncResult {
  const run = (over: Partial<BidaInputs>) => computeBida({ ...inp, ...over });
  const other = run({ mode: inp.mode !== 'budget' ? 'budget' : 'users' }).totals.nru;
  const now = run({}).totals.nru;
  if (now > 0 && other > 0 && Math.abs(other / now - 1) < 0.01) return { kind: 'aligned' };

  if (inp.mode !== 'budget') {
    const U = run({ mode: 'users' });
    const target = U.totals.nru;
    const adsM1 = Math.max(0, U.monthly[0].ads);
    if (target <= 0)
      return {
        kind: 'empty',
        message: 'Chưa có user mới nào để quy đổi — kiểm lại số install/ngày.',
      };
    const f = (x: number) => run({ mode: 'budget', budgetM1: adsM1, budgetMaintain: x }).totals.nru;
    let lo = 0;
    let hi = Math.max(1e9, adsM1 * 3);
    let guard = 0;
    while (f(hi) < target && guard++ < 40) hi *= 2;
    const ok = f(hi) >= target;
    if (ok)
      for (let i = 0; i < 70; i++) {
        const mid = (lo + hi) / 2;
        if (f(mid) < target) lo = mid;
        else hi = mid;
      }
    const maintain = Math.round((ok ? (lo + hi) / 2 : hi) / 1e6) * 1e6;
    const next = { ...inp, budgetM1: Math.round(adsM1 / 1e6) * 1e6, budgetMaintain: maintain };
    const got = computeBida({ ...next, mode: 'budget' }).totals.nru;
    return { kind: 'synced', from: 'users', inputs: next, target, got, exact: ok };
  }

  const B = run({ mode: 'budget' });
  const target = B.totals.nru;
  if (target <= 0) return { kind: 'empty', message: 'Chưa có ngân sách ads nào để quy đổi.' };
  const cvr = inp.cvr / 100;
  const buk = [0, 0, 0, 0];
  const w = [0, 0, 0, 0];
  B.monthly.forEach((x, idx) => {
    const m = idx + 1;
    const bi = m <= 3 ? 1 : m <= 6 ? 2 : 3;
    buk[bi] += x.nru;
    w[bi] += 30 * Math.max(1e-9, cvr) * (1 + orgRate(m, inp));
  });
  const ins = (bi: number) => (w[bi] > 0 ? Math.max(1, Math.round(buk[bi] / w[bi])) : 1);
  // Ước lượng lần đầu hơi thấp (tháng 1 có hệ số nhịp ngày), chỉnh dần cho khớp đúng tổng
  let tri = [ins(1), ins(2), ins(3)];
  const apply = (v: number[]) => ({
    ...inp,
    mode: 'users' as const,
    installM1: v[0],
    installM4: v[1],
    installLater: v[2],
  });
  for (let it = 0; it < 40; it++) {
    const g = computeBida(apply(tri)).totals.nru;
    if (!(g > 0)) break;
    const k = target / g;
    if (Math.abs(k - 1) < 0.0002) break;
    tri = tri.map((v) => Math.max(1, Math.round(v * k)));
  }
  const next = { ...inp, installM1: tri[0], installM4: tri[1], installLater: tri[2] };
  const got = computeBida({ ...next, mode: 'users' }).totals.nru;
  const off = target ? Math.abs((got - target) / target) * 100 : 0;
  return {
    kind: 'synced',
    from: 'budget',
    inputs: next,
    target,
    got,
    exact: true,
    note:
      off < 0.5
        ? undefined
        : 'Chế độ ngân sách có bước nhảy ở tháng 13 (CPN chạm sàn) nên bên mục tiêu user chỉ khớp được gần đúng.',
  };
}
