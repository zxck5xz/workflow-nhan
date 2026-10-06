import type { CSSProperties } from 'react';
import type { Inputs, Summary } from '../engine';
import { excelOriginal, excelReference } from '../engine/presets';
import type { Tone } from './fields';
import { fmtInt, fmtMoney, fmtPct, fmtRatio, fmtVnd } from '../lib/format';

/** Màu theo nhóm chỉ số (số series trong bảng màu). */
const KPI_ACCENT = { users: 1, revenue: 3, cost: 2, payback: 7, ratio: 4 } satisfies Record<
  string,
  Tone
>;

/** Thẻ KPI. `accent` tô màu nhóm chỉ số (user, doanh thu, chi phí…); lãi/lỗ tô nền xanh/đỏ. */
export function Kpi({
  label,
  value,
  sub,
  tone,
  accent,
  secondary,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'good' | 'bad';
  accent?: keyof typeof KPI_ACCENT;
  secondary?: boolean;
}) {
  return (
    <div
      className={`card kpi${secondary ? ' secondary' : ''}${tone ? ` is-${tone}` : ''}`}
      style={
        accent ? ({ '--tone': `var(--series-${KPI_ACCENT[accent]})` } as CSSProperties) : undefined
      }
    >
      <div className="label">{label}</div>
      <div className={`value num${tone ? ` ${tone}` : ''}`}>{value}</div>
      {sub && <div className="sub num">{sub}</div>}
    </div>
  );
}

export function KpiGrid({ s, inputs }: { s: Summary; inputs: Inputs }) {
  const profitTone = s.profit >= 0 ? 'good' : 'bad';
  return (
    <>
      <div className="kpis">
        <Kpi
          label="User mới (NRU)"
          accent="users"
          value={fmtInt(s.nru)}
          sub={`Gồm đăng ký trước · ${fmtInt(s.installs)} lượt cài`}
        />
        <Kpi
          label="DAU cao nhất"
          accent="users"
          value={fmtInt(s.peakDau)}
          sub={`Bình quân ${fmtInt(s.avgDau)} người chơi/ngày`}
        />
        <Kpi
          label="Doanh thu"
          accent="revenue"
          value={fmtMoney(s.revenue)}
          sub={fmtVnd(s.revenue)}
        />
        <Kpi
          label="Tổng chi phí"
          accent="cost"
          value={fmtMoney(s.totalSpent)}
          sub={fmtVnd(s.totalSpent)}
        />
        <Kpi
          label="Lợi nhuận"
          accent="revenue"
          value={fmtMoney(s.profit, { sign: true })}
          tone={profitTone}
          sub={`Biên ${fmtPct(s.margin)} doanh thu`}
        />
        <Kpi
          label="Hoàn vốn"
          accent="payback"
          value={s.breakEvenMonth ? `Tháng ${s.breakEvenMonth}` : 'Chưa hoàn vốn'}
          tone={s.breakEvenMonth ? undefined : 'bad'}
          sub={
            s.breakEvenMonth
              ? 'Kể từ tháng mở game'
              : `Hết ${inputs.months} tháng vẫn lỗ ${fmtMoney(Math.abs(s.profit))}`
          }
        />
      </div>
      <div className="kpis">
        <Kpi
          secondary
          label="Tiền ads đã chi"
          accent="cost"
          value={fmtMoney(s.mkt)}
          sub={s.revenue > 0 ? `Bằng ${fmtPct(s.mkt / s.revenue, 0)} doanh thu` : fmtVnd(s.mkt)}
        />
        <Kpi
          secondary
          label="Giá 1 lượt cài đặt"
          accent="cost"
          value={fmtVnd(s.costPerInstall)}
          sub={`CPN bình quân ${fmtVnd(s.avgCpn)}`}
        />
        <Kpi
          secondary
          label="LTV 1 năm / giá 1 user"
          accent="ratio"
          value={fmtRatio(s.ltvOverCpn)}
          tone={s.ltvOverCpn >= 1 ? 'good' : 'bad'}
          sub={`LTV365 = ${fmtVnd(s.ltv365)}`}
        />
        <Kpi
          secondary
          label="Share dev phải trả"
          accent="cost"
          value={fmtMoney(s.shareDevPaid)}
          sub={
            inputs.costs.includeShareDevInCost
              ? 'Sau khi trừ MG, đã trừ vào chi phí'
              : 'Sau khi trừ MG, chưa trừ vào chi phí'
          }
        />
        <Kpi
          secondary
          label="Thuế và phí"
          accent="cost"
          value={fmtMoney(s.vat + s.paymentFee + s.adsTax)}
          sub={`VAT ${fmtMoney(s.vat)} · cổng TT ${fmtMoney(s.paymentFee)} · thuế ads ${fmtMoney(s.adsTax)}`}
        />
        <Kpi
          secondary
          label="Chi phí cố định"
          accent="cost"
          value={fmtMoney(s.fixedCosts)}
          sub="Branding, server, nhân sự… (T1 gồm chi phí trước OB)"
        />
        <Kpi
          secondary
          label="Chi phí một lần"
          accent="cost"
          value={fmtMoney(s.oneTimeCosts)}
          sub="LF + MG + branding + khác"
        />
        <Kpi
          secondary
          label="Lợi nhuận / chi phí"
          accent="ratio"
          value={fmtPct(s.profitOverSpent)}
          tone={s.profitOverSpent >= 0 ? 'good' : 'bad'}
          sub="Ô B35 trong Excel"
        />
      </div>
    </>
  );
}

/** Ghi chú khác biệt so với file Excel gốc + so sánh với số Excel đã tính sẵn. */
export function NoteBanner({ s, sameAsExcel }: { s: Summary; sameAsExcel: boolean }) {
  const r = excelReference;
  return (
    <div className="banner">
      <strong>
        Tool tính lại toàn bộ từ tham số, cùng công thức với sheet Forecast, có 5 điểm khác đã chốt:
      </strong>
      <ul>
        <li>
          <b>Chi phí một lần</b> (LF, MG) và mọi chi phí các tháng T-4 → T-1 <b>dồn vào T1</b>.
        </li>
        <li>
          <b>Share dev</b> = doanh thu đối soát × tỉ lệ (không có bậc ngưỡng $1M), phần sau khi trừ
          MG <b>có trừ</b> vào tổng chi phí.
        </li>
        <li>
          <b>Doanh thu T2</b> = SUM(K89:K118), bỏ cột payrate bị cộng nhầm.
        </li>
        <li>
          <b>Thuế ads</b> là tham số chung cho mọi tháng (Excel ghi 5% riêng T24).
        </li>
        <li>
          <b>Hệ số 120%</b> của nhóm user ngày OB lặp theo chu kỳ 120 ngày (Excel chỉ áp ngày
          2–120).
        </li>
      </ul>
      {sameAsExcel ? (
        <>
          <div style={{ marginTop: 8 }}>
            <b>So với số tính sẵn trong file Excel ({excelOriginal.months} tháng):</b>
          </div>
          <table className="compare-table num">
            <thead>
              <tr>
                <th>Chỉ tiêu</th>
                <th>Tool</th>
                <th>File gốc</th>
                <th>Lệch</th>
              </tr>
            </thead>
            <tbody>
              <CompareRow label="User mới (NRU)" tool={s.nru} excel={r.nru} format={fmtInt} />
              <CompareRow label="Tiền ads" tool={s.mkt} excel={r.mkt} />
              <CompareRow label="Doanh thu" tool={s.revenue} excel={r.revenue} />
              <CompareRow label="Tổng chi phí" tool={s.totalSpent} excel={r.totalSpent} />
              <CompareRow label="Lợi nhuận" tool={s.profit} excel={r.profit} />
              <tr>
                <td>Hoàn vốn</td>
                <td>{s.breakEvenMonth ? `T${s.breakEvenMonth}` : 'Chưa'}</td>
                <td>{r.breakEvenMonth ? `T${r.breakEvenMonth}` : 'Chưa'}</td>
                <td>{s.breakEvenMonth === r.breakEvenMonth ? 'khớp' : '—'}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <div className="compare">
          Tham số đang khác bộ Excel gốc nên không so với số tính sẵn trong file.
        </div>
      )}
    </div>
  );
}

function CompareRow({
  label,
  tool,
  excel,
  format = fmtMoney,
}: {
  label: string;
  tool: number;
  excel: number;
  format?: (v: number) => string;
}) {
  const diff = excel !== 0 ? (tool - excel) / Math.abs(excel) : 0;
  return (
    <tr>
      <td>{label}</td>
      <td>{format(tool)}</td>
      <td>{format(excel)}</td>
      <td>{Math.abs(diff) < 0.0005 ? 'khớp' : fmtPct(diff, 2)}</td>
    </tr>
  );
}
