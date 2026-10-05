import type { PreRegistrationDay } from '../engine';
import { monthValue } from '../engine/util';
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

/** Bảng sửa mảng "theo tháng": mỗi dòng một tháng, mỗi cột một tham số. */
export function MonthlyEditor({ columns, note }: { columns: MonthColumn[]; note?: string }) {
  const { inputs, set } = useInputs();
  const months = Array.from({ length: inputs.months }, (_, i) => i + 1);

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
      <div className="grid-editor">
        <table>
          <thead>
            <tr>
              <th>Tháng</th>
              {columns.map((c) => (
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
                {columns.map((c) => (
                  <td key={c.path}>
                    <NumberInput
                      ariaLabel={`${c.label} tháng ${m}`}
                      value={monthValue(getPath<number[]>(inputs, c.path), m, c.extendLast ?? true)}
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
