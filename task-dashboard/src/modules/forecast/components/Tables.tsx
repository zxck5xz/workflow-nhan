import { useState } from 'react';
import type { Result } from '../engine';
import { fmtInt, fmtMoney } from '../lib/format';
import { DAILY_LINES, PNL_LINES } from '../lib/pnl';

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
              <td className={m.cumulative < 0 ? 'neg' : undefined}>{fmtMoney(m.cumulative)}</td>
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
            <td>{fmtMoney(monthly[monthly.length - 1]?.cumulative ?? 0)}</td>
          </tr>
        </tbody>
      </table>
      <p className="print-only" style={{ fontSize: 11 }}>
        Đỏ: tháng lỗ khi chưa hoàn vốn · xanh: tháng hoàn vốn.
      </p>
    </div>
  );
}

function PnlTable({ result }: { result: Result }) {
  const { monthly } = result;
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Chỉ tiêu</th>
            <th>TOTAL</th>
            {monthly.map((m) => (
              <th key={m.month}>T{m.month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PNL_LINES.map((line) => {
            const values = monthly.map((m) => m[line.key] as number);
            const total =
              line.key === 'cumulative'
                ? values[values.length - 1]
                : line.key === 'dauAvg'
                  ? values.reduce((s, v) => s + v, 0) / values.length
                  : values.reduce((s, v) => s + v, 0);
            const fmt = line.kind === 'int' ? fmtInt : (v: number) => fmtMoney(v);
            return (
              <tr key={String(line.key)} className={line.strong ? 'strong' : undefined}>
                <td>{line.label}</td>
                <td className={total < 0 ? 'neg' : undefined}>{fmt(total)}</td>
                {values.map((v, i) => (
                  <td key={i} className={v < 0 ? 'neg' : undefined}>
                    {fmt(v)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
