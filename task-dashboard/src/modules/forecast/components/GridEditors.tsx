import { useState } from 'react';
import type { PreRegistrationDay } from '../engine';
import { monthValue } from '../engine/util';
import { fmtInt, fmtMoney, parseVnNumber } from '../lib/format';
import { getPath, type Path } from '../lib/paths';
import { NumberInput } from './fields';
import { useInputs } from './inputsContext';

export interface MonthColumn {
  path: Path;
  label: string;
  percent?: boolean;
  /** Hết mảng thì lấy giá trị cuối (chi phí định kỳ) hay 0 (chi phí theo đợt) */
  extendLast?: boolean;
}

/**
 * Bảng sửa mảng "theo tháng": mỗi dòng một tháng. Từ 3 tham số trở lên thì tách thành từng thẻ
 * (mỗi thẻ một tham số, có tổng cả kỳ) để bảng vừa sidebar, không phải cuộn ngang.
 */
export function MonthlyEditor({ columns, note }: { columns: MonthColumn[]; note?: string }) {
  const { inputs, set } = useInputs();
  const [active, setActive] = useState(0);
  const months = Array.from({ length: inputs.months }, (_, i) => i + 1);
  const split = columns.length > 2;
  const shown = split ? [columns[Math.min(active, columns.length - 1)]] : columns;

  const valueAt = (col: MonthColumn, month: number) =>
    monthValue(getPath<number[]>(inputs, col.path), month, col.extendLast ?? true);
  const update = (col: MonthColumn, month: number, v: number) => {
    const arr = getPath<number[]>(inputs, col.path);
    const extend = col.extendLast ?? true;
    const next = Array.from({ length: Math.max(arr.length, month) }, (_, i) =>
      monthValue(arr, i + 1, extend),
    );
    next[month - 1] = v;
    set(col.path, next);
  };

  return (
    <>
      {note && (
        <p className="field hint" style={{ display: 'block' }}>
          {note}
        </p>
      )}
      {split && (
        <div className="grid-tabs" role="tablist" aria-label="Chọn tham số">
          {columns.map((c, i) => (
            <button
              key={c.path}
              role="tab"
              aria-selected={c === shown[0]}
              onClick={() => setActive(i)}
            >
              {c.label}
              {!c.percent && (
                <span className="num">
                  {fmtMoney(months.reduce((t, m) => t + valueAt(c, m), 0))}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      <div className={`grid-editor${split ? ' single' : ''}`}>
        <table>
          <thead>
            <tr>
              <th>Tháng</th>
              {shown.map((c) => (
                <th key={c.path}>
                  {c.label}
                  {c.percent && ' %'}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m}>
                <td>T{m}</td>
                {shown.map((c) => (
                  <td key={c.path}>
                    <NumberInput
                      ariaLabel={`${c.label} tháng ${m}`}
                      value={valueAt(c, m)}
                      scale={c.percent ? 100 : 1}
                      onChange={(v) => update(c, m, v)}
                    />
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

/** Đánh lại nhãn OB - n → OB - 1 theo thứ tự */
function relabel(rows: PreRegistrationDay[]): PreRegistrationDay[] {
  return rows.map((r, i) => ({ ...r, label: `OB - ${rows.length - i}` }));
}

/** Bảng các ngày đăng ký trước OB-5 → OB-1. */
export function PreRegistrationEditor() {
  const { inputs, set } = useInputs();
  const rows = inputs.acquisition.preRegistration;
  const path = 'acquisition.preRegistration';
  const update = (i: number, patch: Partial<PreRegistrationDay>) =>
    set(
      path,
      rows.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    );

  return (
    <>
      <div className="grid-editor">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Lượt cài</th>
              <th>Vào game %</th>
              <th>Hệ số ads</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.label}</td>
                <td>
                  <NumberInput
                    ariaLabel={`Lượt cài ${r.label}`}
                    value={r.installs}
                    onChange={(v) => update(i, { installs: v })}
                  />
                </td>
                <td>
                  <NumberInput
                    ariaLabel={`Tỉ lệ vào game ${r.label}`}
                    value={r.conversion}
                    scale={100}
                    onChange={(v) => update(i, { conversion: v })}
                  />
                </td>
                <td>
                  <NumberInput
                    ariaLabel={`Hệ số ads ${r.label}`}
                    value={r.mktFactor}
                    onChange={(v) => update(i, { mktFactor: v })}
                  />
                </td>
                <td>
                  <button
                    className="btn small"
                    aria-label={`Xoá ${r.label}`}
                    onClick={() => set(path, relabel(rows.filter((_, j) => j !== i)))}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn small"
        style={{ marginTop: 6 }}
        onClick={() => {
          // Thêm một ngày sớm hơn ngày đầu hiện có
          set(
            path,
            relabel([{ label: '', installs: 5_000, conversion: 0.5, mktFactor: 1 }, ...rows]),
          );
        }}
      >
        + Thêm ngày đăng ký trước
      </button>
    </>
  );
}

/** Giá trị ngày thứ `i` (0-based) của mảng hệ số; ngoài mảng = 1 (không nhân). */
const at = (arr: number[], i: number) => (i < arr.length ? arr[i] : 1);

/** Bảng hệ số các ngày đầu sau OB: mỗi ngày một dòng, hai cột lượt cài/NRU và giá ads. */
export function LaunchBoostEditor() {
  const { inputs, set } = useInputs();
  const a = inputs.acquisition;
  const cols = [
    { path: 'acquisition.launchInstallBoost', label: 'Lượt cài/NRU', arr: a.launchInstallBoost },
    { path: 'acquisition.launchMktBoost', label: 'Giá ads', arr: a.launchMktBoost },
  ];
  const rows = Math.max(a.launchInstallBoost.length, a.launchMktBoost.length);

  const update = (path: Path, arr: number[], i: number, v: number) => {
    const next = Array.from({ length: Math.max(arr.length, i + 1) }, (_, j) => at(arr, j));
    next[i] = v;
    set(path, next);
  };

  return (
    <>
      <p className="field hint" style={{ display: 'block' }}>
        Hệ số các ngày đầu sau OB. 100% = không đổi; ngày nằm ngoài bảng tính 100%.
      </p>
      <div className="grid-editor">
        <table>
          <thead>
            <tr>
              <th>Ngày sau OB</th>
              {cols.map((c) => (
                <th key={c.path}>{c.label} %</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                <td>Ngày {i + 1}</td>
                {cols.map((c) => (
                  <td key={c.path}>
                    <NumberInput
                      ariaLabel={`${c.label} ngày ${i + 1}`}
                      value={at(c.arr, i)}
                      scale={100}
                      onChange={(v) => update(c.path, c.arr, i, v)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid-actions">
        <button
          className="btn small"
          onClick={() => cols.forEach((c) => update(c.path, c.arr, rows, 1))}
        >
          + Thêm ngày
        </button>
        {rows > 0 && (
          <button
            className="btn small"
            onClick={() => cols.forEach((c) => set(c.path, c.arr.slice(0, rows - 1)))}
          >
            − Bỏ ngày {rows}
          </button>
        )}
      </div>
    </>
  );
}

/** Bảng pha cohort: nhóm user vào game từ ngày X được nhân hệ số Y lên cả đường ARPU. */
export function PhaseEditor() {
  const { inputs, set } = useInputs();
  const r = inputs.revenue;
  const n = r.phaseMultipliers.length;
  // Pha 1 luôn bắt đầu từ ngày OB
  const starts = Array.from({ length: n }, (_, i) =>
    i === 0 ? 1 : (r.phaseStartDays[i] ?? i + 1),
  );
  const arpu1 = r.arpuCurve[0] ?? 0;

  const setStart = (i: number, v: number) =>
    set(
      'revenue.phaseStartDays',
      starts.map((s, j) => (j === i ? Math.max(2, Math.round(v)) : s)),
    );
  const setMult = (i: number, v: number) =>
    set(
      'revenue.phaseMultipliers',
      r.phaseMultipliers.map((k, j) => (j === i ? v : k)),
    );

  return (
    <>
      <div className="explain">
        <b>Hệ số ARPU theo pha là gì?</b> Mỗi ngày có một nhóm user mới vào game (cohort). Nhóm vào
        càng muộn thường tiêu càng ít, nên cả đường ARPU của nhóm đó được nhân với hệ số của pha mà
        nó rơi vào, áp cho suốt vòng đời. Pha 1 gồm cả user đăng ký trước.
        {r.model === 'arpuCurve' && n > 1 && (
          <>
            {' '}
            Ví dụ: ARPU ngày tuổi 1 là {fmtInt(arpu1)} đ. User vào ngày OB đóng góp{' '}
            {fmtInt(arpu1 * r.phaseMultipliers[0])} đ, user vào từ ngày {starts[n - 1]} trở đi chỉ
            còn {fmtInt(arpu1 * r.phaseMultipliers[n - 1])} đ.
          </>
        )}
        {r.model !== 'arpuCurve' && (
          <> Chỉ dùng khi «Cách tính doanh thu» = Đường ARPU theo ngày.</>
        )}
      </div>
      <div className="grid-editor compact">
        <table>
          <thead>
            <tr>
              <th>Pha</th>
              <th>Từ ngày</th>
              <th>Đến ngày</th>
              <th>Hệ số %</th>
            </tr>
          </thead>
          <tbody>
            {starts.map((s, i) => (
              <tr key={i}>
                <td>{i === 0 ? 'Pha 1 · OB' : `Pha ${i + 1}`}</td>
                <td>
                  {i === 0 ? (
                    <span className="fixed">1</span>
                  ) : (
                    <NumberInput
                      ariaLabel={`Ngày bắt đầu pha ${i + 1}`}
                      value={s}
                      onChange={(v) => setStart(i, v)}
                    />
                  )}
                </td>
                <td className="fixed">{i < n - 1 ? starts[i + 1] - 1 : 'về sau'}</td>
                <td>
                  <NumberInput
                    ariaLabel={`Hệ số pha ${i + 1}`}
                    value={r.phaseMultipliers[i]}
                    scale={100}
                    onChange={(v) => setMult(i, v)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid-actions">
        <button
          className="btn small"
          onClick={() => {
            set('revenue.phaseStartDays', [...starts, (starts[n - 1] ?? 1) + 7]);
            set('revenue.phaseMultipliers', [
              ...r.phaseMultipliers,
              r.phaseMultipliers[n - 1] ?? 1,
            ]);
          }}
        >
          + Thêm pha
        </button>
        {n > 1 && (
          <button
            className="btn small"
            onClick={() => {
              set('revenue.phaseStartDays', starts.slice(0, -1));
              set('revenue.phaseMultipliers', r.phaseMultipliers.slice(0, -1));
            }}
          >
            − Bỏ pha {n}
          </button>
        )}
      </div>
    </>
  );
}

/** Đường ARPU theo ngày tuổi: bảng sửa từng ngày, hoặc dán cả cột từ Excel. */
export function ArpuCurveEditor() {
  const { inputs, set } = useInputs();
  const curve = inputs.revenue.arpuCurve;
  const [paste, setPaste] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPaste = () => {
    const parts = (paste ?? '')
      .split(/[\n;\t]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const nums = parts.map(parseVnNumber);
    if (parts.length === 0 || nums.some((x) => x === null)) {
      setError('Có giá trị không phải số — giữ nguyên đường cũ');
      return;
    }
    setError(null);
    set('revenue.arpuCurve', nums);
    setPaste(null);
  };

  return (
    <div className={`field wide${error ? ' invalid' : ''}`}>
      <label>Đường ARPU theo ngày tuổi ({curve.length} ngày)</label>
      <div className="hint">
        Doanh thu trung bình 1 user ở mỗi ngày tuổi, trước khi nhân hệ số pha.
      </div>
      <div className="grid-editor">
        <table>
          <thead>
            <tr>
              <th>Ngày tuổi</th>
              <th>ARPU (đ)</th>
            </tr>
          </thead>
          <tbody>
            {curve.map((v, i) => (
              <tr key={i}>
                <td>Ngày {i + 1}</td>
                <td>
                  <NumberInput
                    ariaLabel={`ARPU ngày tuổi ${i + 1}`}
                    value={v}
                    onChange={(x) =>
                      set(
                        'revenue.arpuCurve',
                        curve.map((c, j) => (j === i ? x : c)),
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paste === null ? (
        <div className="grid-actions">
          <button className="btn small" onClick={() => setPaste('')}>
            Dán cả cột từ Excel
          </button>
        </div>
      ) : (
        <>
          <textarea
            rows={4}
            aria-label="Dán đường ARPU"
            placeholder="Mỗi dòng một giá trị, ngày 1 trên cùng"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
          />
          <div className="grid-actions">
            <button className="btn small primary" onClick={applyPaste}>
              Áp dụng
            </button>
            <button
              className="btn small"
              onClick={() => {
                setPaste(null);
                setError(null);
              }}
            >
              Huỷ
            </button>
          </div>
        </>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
