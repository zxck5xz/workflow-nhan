import { useState } from 'react';
import type { MonthlyRow, Result } from '../engine';
import { fmtInt, fmtMoney } from '../lib/format';
import { cumClass, DAILY_LINES, PNL_LINES } from '../lib/pnl';

type Tab = 'month' | 'pnl' | 'day';

export function Tables({ result }: { result: Result }) {
  const [tab, setTab] = useState<Tab>('month');
  const tabs: { id: Tab; label: string }[] = [
    { id: 'month', label: 'Theo tháng' },
    { id: 'pnl', label: 'P&L chi tiết' },
    { id: 'day', label: 'Theo ngày' },
  ];
  return (
    <section className="card">
      <div className="card-head">
        <h2>Bảng số liệu</h2>
        <div className="tabs spacer no-print" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab === 'month' && <MonthTable result={result} />}
      {tab === 'pnl' && <PnlTable result={result} />}
      {tab === 'day' && <DayTable result={result} />}
    </section>
  );
}

function MonthTable({ result }: { result: Result }) {
  const { monthly, summary } = result;
  const be = summary.breakEvenMonth;
  const sumOf = (k: 'mkt' | 'nru' | 'revenue' | 'totalSpent' | 'profit') =>
    monthly.reduce((s, m) => s + m[k], 0);
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Tiền ads</th>
            <th>NRU</th>
            <th>DAU bình quân</th>
            <th>Doanh thu</th>
            <th>Chi phí</th>
            <th>Lợi nhuận</th>
            <th>Lũy kế</th>
          </tr>
        </thead>
        <tbody>
          {monthly.map((m) => (
            <tr
              key={m.month}
              className={
                m.month === be ? 'breakeven' : m.cumulative < 0 && m.profit < 0 ? 'loss' : undefined
              }
            >
              <td>T{m.month}</td>
              <td>{fmtMoney(m.mkt)}</td>
              <td>{fmtInt(m.nru)}</td>
              <td>{fmtInt(m.dauAvg)}</td>
              <td>{fmtMoney(m.revenue)}</td>
              <td>{fmtMoney(m.totalSpent)}</td>
              <td className={m.profit < 0 ? 'neg' : undefined}>{fmtMoney(m.profit)}</td>
              <td className={cumClass(m.cumulative)}>{fmtMoney(m.cumulative)}</td>
            </tr>
          ))}
          <tr className="total">
            <td>Tổng</td>
            <td>{fmtMoney(sumOf('mkt'))}</td>
            <td>{fmtInt(sumOf('nru'))}</td>
            <td>{fmtInt(monthly.reduce((s, m) => s + m.dauAvg, 0) / monthly.length)}</td>
            <td>{fmtMoney(sumOf('revenue'))}</td>
            <td>{fmtMoney(sumOf('totalSpent'))}</td>
            <td className={sumOf('profit') < 0 ? 'neg' : undefined}>{fmtMoney(sumOf('profit'))}</td>
            <td className={cumClass(monthly[monthly.length - 1]?.cumulative ?? 0)}>
              {fmtMoney(monthly[monthly.length - 1]?.cumulative ?? 0)}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="print-only" style={{ fontSize: 11 }}>
        Đỏ: tháng lỗ khi chưa hoàn vốn · nền xanh: tháng hoàn vốn · chữ xanh: lũy kế đã dương.
      </p>
    </div>
  );
}

/** Số tháng mỗi khối khi in: A4 dọc không đủ rộng cho cả bảng P&L nên chia cột tháng thành nhiều bảng */
const PNL_PRINT_MONTHS = 8;

function PnlTable({ result }: { result: Result }) {
  const { monthly } = result;
  const chunks: MonthlyRow[][] = [];
  for (let i = 0; i < monthly.length; i += PNL_PRINT_MONTHS) {
    chunks.push(monthly.slice(i, i + PNL_PRINT_MONTHS));
  }
  return (
    <>
      <div className="table-wrap no-print">
        <PnlGrid result={result} months={monthly} withTotal />
      </div>
      <div className="print-only">
        {chunks.map((months, i) => (
          <div key={months[0].month} className="table-wrap pnl-print">
            <PnlGrid result={result} months={months} withTotal={i === 0} />
          </div>
        ))}
      </div>
    </>
  );
}

/** Bảng P&L với các cột tháng `months`; cột TOTAL luôn tính trên toàn bộ các tháng. */
function PnlGrid({
  result,
  months,
  withTotal,
}: {
  result: Result;
  months: MonthlyRow[];
  withTotal: boolean;
}) {
  const { monthly, summary } = result;
  const be = summary.breakEvenMonth;
  return (
    <table className="data">
      <thead>
        <tr>
          <th>Chỉ tiêu</th>
          {withTotal && <th>TOTAL</th>}
          {months.map((m) => (
            <th key={m.month} className={m.month === be ? 'be-col' : undefined}>
              T{m.month}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PNL_LINES.map((line) => {
          const all = monthly.map((m) => m[line.key] as number);
          const total =
            line.key === 'cumulative'
              ? all[all.length - 1]
              : line.key === 'dauAvg'
                ? all.reduce((s, v) => s + v, 0) / all.length
                : all.reduce((s, v) => s + v, 0);
          const fmt = line.kind === 'int' ? fmtInt : (v: number) => fmtMoney(v);
          const tone = (v: number) =>
            line.key === 'cumulative' ? cumClass(v) : v < 0 ? 'neg' : undefined;
          return (
            <tr key={String(line.key)} className={line.strong ? 'strong' : undefined}>
              <td>{line.label}</td>
              {withTotal && <td className={tone(total)}>{fmt(total)}</td>}
              {months.map((m) => {
                const v = m[line.key] as number;
                const cls = [m.month === be && 'be-col', tone(v)].filter(Boolean);
                return (
                  <td key={m.month} className={cls.join(' ') || undefined}>
                    {fmt(v)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DayTable({ result }: { result: Result }) {
  const [month, setMonth] = useState(1);
  const rows = result.daily.filter((d) => d.month === month);
  return (
    <>
      <label
        className="no-print"
        style={{ fontSize: 12, color: 'var(--text-2)', display: 'block', marginBottom: 8 }}
      >
        Tháng{' '}
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {result.monthly.map((m) => (
            <option key={m.month} value={m.month}>
              T{m.month}
            </option>
          ))}
        </select>
      </label>
      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              {DAILY_LINES.filter((l) => l.key !== 'month' && l.key !== 'dayOfMonth').map((l) => (
                <th key={String(l.key)}>
                  {l.key === 'day' ? 'Ngày (trong tháng · từ OB)' : l.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.day}>
                <td>
                  {d.dayOfMonth} · {d.day}
                </td>
                {DAILY_LINES.filter(
                  (l) => !['day', 'month', 'dayOfMonth'].includes(String(l.key)),
                ).map((l) => (
                  <td key={String(l.key)}>
                    {l.kind === 'int' ? fmtInt(d[l.key]) : fmtMoney(d[l.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
