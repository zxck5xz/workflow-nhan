import { useId, useState, type ReactNode } from 'react';
import { formatInput, parseVnNumber } from '../lib/format';
import { getPath, type Path } from '../lib/paths';
import { useInputs } from './inputsContext';

/** Ô số gõ kiểu VN; khi chưa focus thì hiển thị đã định dạng. */
export function NumberInput({
  value,
  onChange,
  scale = 1,
  digits = 4,
  id,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  /** Hệ số hiển thị, vd 100 cho phần trăm */
  scale?: number;
  digits?: number;
  id?: string;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = formatInput(value * scale, digits);
  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      value={draft ?? shown}
      onFocus={() => setDraft(shown)}
      onBlur={() => setDraft(null)}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = parseVnNumber(e.target.value);
        if (n !== null) onChange(n / scale);
      }}
    />
  );
}

interface FieldProps {
  path: Path;
  label: string;
  hint?: ReactNode;
  /** Hiển thị dạng %, lưu dạng tỉ lệ */
  percent?: boolean;
  suffix?: string;
  digits?: number;
}

/** Ô nhập một số. Nếu tham số là mảng theo tháng, hiển thị tháng đầu và ghi đè cả mảng = [giá trị]. */
export function NumberField({ path, label, hint, percent, suffix, digits }: FieldProps) {
  const { inputs, set, issues } = useInputs();
  const id = useId();
  const raw = getPath<number | number[]>(inputs, path);
  const isArray = Array.isArray(raw);
  const value = isArray ? (raw[0] ?? 0) : raw;
  const varies = isArray && raw.some((v) => v !== raw[0]);
  const error = issues[path];
  const unit = suffix ?? (percent ? '%' : undefined);

  return (
    <div className={`field${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className={unit ? 'input-suffix' : undefined}>
        <NumberInput
          id={id}
          value={value}
          scale={percent ? 100 : 1}
          digits={digits}
          onChange={(v) => set(path, isArray ? [v] : v)}
        />
        {unit && <span>{unit}</span>}
      </div>
      {error ? (
        <div className="error">{error}</div>
      ) : varies ? (
        <div className="hint">
          Đang khác nhau theo tháng (xem Lịch theo tháng); sửa ở đây sẽ áp cho mọi tháng
        </div>
      ) : (
        hint && <div className="hint">{hint}</div>
      )}
    </div>
  );
}

/** Danh sách số cách nhau bởi dấu chấm phẩy, vd hệ số tăng theo ngày "250; 230; 200". */
export function ListField({ path, label, hint, percent }: Omit<FieldProps, 'suffix' | 'digits'>) {
  const { inputs, set, issues } = useInputs();
  const id = useId();
  const values = getPath<number[]>(inputs, path);
  const scale = percent ? 100 : 1;
  const shown = values.map((v) => formatInput(v * scale)).join('; ');
  const [draft, setDraft] = useState<string | null>(null);
  const error = issues[path];

  return (
    <div className={`field wide${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {percent && ' (%)'}
      </label>
      <input
        id={id}
        type="text"
        value={draft ?? shown}
        onFocus={() => setDraft(shown)}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          setDraft(e.target.value);
          const parts = e.target.value
            .split(';')
            .map((p) => p.trim())
            .filter(Boolean);
          const nums = parts.map(parseVnNumber);
          if (nums.every((n) => n !== null))
            set(
              path,
              (nums as number[]).map((n) => n / scale),
            );
        }}
      />
      {error ? <div className="error">{error}</div> : hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export function SelectField<T extends string | number>({
  path,
  label,
  options,
  hint,
}: {
  path: Path;
  label: string;
  options: { value: T; label: string }[];
  hint?: ReactNode;
}) {
  const { inputs, set } = useInputs();
  const id = useId();
  const value = getPath<T>(inputs, path);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={String(value)}
        onChange={(e) => {
          const opt = options.find((o) => String(o.value) === e.target.value);
          if (opt) set(path, opt.value);
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export function Toggle({ path, label }: { path: Path; label: string }) {
  const { inputs, set } = useInputs();
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={getPath<boolean>(inputs, path)}
        onChange={(e) => set(path, e.target.checked)}
      />
      {label}
    </label>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function Advanced({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="section">
      <summary>{title}</summary>
      {children}
    </details>
  );
}
