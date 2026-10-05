import { useMemo, useState } from 'react';
import { simulate, type Inputs, type Result } from '../engine';
import { fmtInt, fmtMoney, fmtPct, fmtRatio } from '../lib/format';
import type { SavedScenario } from '../lib/scenarios';
import { CompareCumulativeChart } from './charts/Charts';

const MAX_COMPARE = 3;

export function Scenarios({
  scenarios,
  current,
  result,
  onSave,
  onLoad,
  onDelete,
}: {
  scenarios: SavedScenario[];
  current: Inputs;
  result: Result;
  onSave: (name: string) => void;
  onLoad: (s: SavedScenario) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const compared = scenarios.filter((s) => compareIds.includes(s.id));

  const toggleCompare = (id: string) =>
    setCompareIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id].slice(-MAX_COMPARE),
    );

  return (
    <section className="card no-print">
      <div className="card-head">
        <div>
          <h2>Kịch bản đã lưu</h2>
          <p>Lưu trên trình duyệt này. Muốn gửi người khác: dùng nút "Chia sẻ link".</p>
        </div>
      </div>
      <form
        className="topbar"
        style={{ marginBottom: 10 }}
        onSubmit={(e) => {
          e.preventDefault();
          onSave(name.trim() || `Kịch bản ${scenarios.length + 1}`);
          setName('');
        }}
      >
        <input
          aria-label="Tên kịch bản"
          placeholder={`Tên kịch bản (vd: ${current.name})`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 1,
            minWidth: 180,
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 10px',
            background: 'var(--surface)',
          }}
        />
        <button className="btn primary" type="submit">
          Lưu kịch bản
        </button>
      </form>

      {scenarios.length === 0 ? (
        <div className="empty">Chưa có kịch bản nào.</div>
      ) : (
        <div className="scenario-list">
          {scenarios.map((s) => (
            <div className="scenario" key={s.id}>
              <span className="name">{s.name}</span>
              <span className="meta">{new Date(s.savedAt).toLocaleString('vi-VN')}</span>
              <label className="meta" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={compareIds.includes(s.id)}
                  onChange={() => toggleCompare(s.id)}
                />
                So sánh
              </label>
              <button className="btn small" onClick={() => onLoad(s)}>
                Nạp
              </button>
              <button
                className="btn small"
                aria-label={`Xoá ${s.name}`}
                onClick={() => {
                  if (confirm(`Xoá kịch bản "${s.name}"?`)) {
                    setCompareIds((ids) => ids.filter((x) => x !== s.id));
                    onDelete(s.id);
                  }
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {compared.length > 0 && <Compare current={current} result={result} compared={compared} />}
    </section>
  );
}

function Compare({
  current,
  result,
  compared,
}: {
  current: Inputs;
  result: Result;
  compared: SavedScenario[];
}) {
  const columns = useMemo(
    () => [
      { name: `Hiện tại (${current.name})`, result },
      ...compared.map((s) => ({ name: s.name, result: simulate(s.inputs) })),
    ],
    [current.name, result, compared],
  );
  const rows: { label: string; get: (r: Result) => string }[] = [
    { label: 'Số tháng', get: (r) => String(r.monthly.length) },
    { label: 'NRU', get: (r) => fmtInt(r.summary.nru) },
    { label: 'DAU cao nhất', get: (r) => fmtInt(r.summary.peakDau) },
    { label: 'Tiền ads', get: (r) => fmtMoney(r.summary.mkt) },
    { label: 'Doanh thu', get: (r) => fmtMoney(r.summary.revenue) },
    { label: 'Tổng chi phí', get: (r) => fmtMoney(r.summary.totalSpent) },
    { label: 'Lợi nhuận', get: (r) => fmtMoney(r.summary.profit, { sign: true }) },
    { label: 'Biên lợi nhuận', get: (r) => fmtPct(r.summary.margin) },
    {
      label: 'Hoàn vốn',
      get: (r) => (r.summary.breakEvenMonth ? `T${r.summary.breakEvenMonth}` : 'Chưa'),
    },
    { label: 'LTV365 / CPN', get: (r) => fmtRatio(r.summary.ltvOverCpn) },
  ];
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>So sánh kịch bản</h3>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table className="data">
          <thead>
            <tr>
              <th>Chỉ tiêu</th>
              {columns.map((c) => (
                <th key={c.name}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {columns.map((c) => (
                  <td key={c.name}>{row.get(c.result)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CompareCumulativeChart
        series={columns.map((c) => ({ name: c.name, monthly: c.result.monthly }))}
      />
    </div>
  );
}
