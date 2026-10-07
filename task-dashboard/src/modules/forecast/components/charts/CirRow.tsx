import type { MonthlyRow } from '../../engine';
import { fmtInt, fmtPct } from '../../lib/format';
import { cirOf } from '../../lib/pnl';

/**
 * Hàng CIR (%) dưới trục tháng, mỗi ô thẳng cột với cặp cột của tháng đó. Trên 100% (tháng lỗ) tô đỏ.
 * `inset` là khoảng từ mép biểu đồ tới vùng vẽ (lề + trục Y) để các ô căn đúng theo tháng.
 */
export function CirRow({
  monthly,
  width = '100%',
  inset,
}: {
  monthly: MonthlyRow[];
  width?: number | '100%';
  inset: { left: number; right: number };
}) {
  return (
    <div className="cir-row" style={{ width, paddingRight: inset.right }}>
      <div
        className="cir-label"
        style={{ width: inset.left }}
        title="CIR = tổng chi phí / tổng doanh thu của tháng"
      >
        CIR %
      </div>
      <div
        className="cir-cells"
        style={{ gridTemplateColumns: `repeat(${monthly.length}, minmax(0, 1fr))` }}
      >
        {monthly.map((m) => {
          const v = cirOf(m);
          return (
            <div
              key={m.month}
              className={`cir-cell${v !== null && v > 1 ? ' bad' : ''}`}
              title={`T${m.month}: CIR ${v === null ? '—' : fmtPct(v)}`}
            >
              <span>{v === null ? '—' : v >= 9.995 ? '>999' : fmtInt(v * 100)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
