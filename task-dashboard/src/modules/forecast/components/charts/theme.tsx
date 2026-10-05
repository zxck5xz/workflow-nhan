import type { ReactNode } from 'react';

export function Legend({ items }: { items: { label: string; color: string; line?: boolean }[] }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span key={it.label}>
          <i className={it.line ? 'line' : undefined} style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function TooltipBox({
  title,
  rows,
}: {
  title: ReactNode;
  rows: { label: string; value: string; color?: string }[];
}) {
  return (
    <div className="tooltip">
      <div className="t-title">{title}</div>
      {rows.map((r) => (
        <div className="t-row" key={r.label}>
          <span>
            {r.color && (
              <i
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: r.color,
                  marginRight: 5,
                }}
              />
            )}
            {r.label}
          </span>
          <span className="num">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
