import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyRow, MonthlyRow } from '../../engine';
import { fmtInt, fmtMoney } from '../../lib/format';
import { PRINT_WIDTH, usePrinting } from '../../lib/print';
import { axisProps, useChartColors } from './colors';
import { Legend, TooltipBox } from './theme';

function useChartWidth(size: 'full' | 'half'): number | '100%' {
  return usePrinting() ? PRINT_WIDTH[size] : '100%';
}

interface TipProps<T> {
  active?: boolean;
  payload?: readonly { payload?: T }[];
}

export function RevenueCostChart({ monthly }: { monthly: MonthlyRow[] }) {
  const c = useChartColors();
  const width = useChartWidth('half');
  const tip = ({ active, payload }: TipProps<MonthlyRow>) => {
    const m = active && payload?.[0]?.payload;
    if (!m) return null;
    return (
      <TooltipBox
        title={`Tháng ${m.month}`}
        rows={[
          { label: 'Doanh thu', value: fmtMoney(m.revenue), color: c['--series-1'] },
          { label: 'Chi phí', value: fmtMoney(m.totalSpent), color: c['--series-2'] },
          { label: 'Lợi nhuận', value: fmtMoney(m.profit, { sign: true }) },
        ]}
      />
    );
  };
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Doanh thu và chi phí theo tháng</h2>
          <p>Chi phí T1 gồm LF, MG và toàn bộ chi phí trước OB</p>
        </div>
      </div>
      <Legend
        items={[
          { label: 'Doanh thu', color: c['--series-1'] },
          { label: 'Chi phí', color: c['--series-2'] },
        ]}
      />
      <div className="chart-box">
        <ResponsiveContainer width={width} height="100%">
          <BarChart
            data={monthly}
            barGap={2}
            barCategoryGap="22%"
            margin={{ top: 10, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke={c['--grid']} />
            <XAxis
              dataKey="month"
              interval="preserveStartEnd"
              tickFormatter={(m) => `T${m}`}
              {...axisProps(c)}
            />
            <YAxis
              tickFormatter={(v) => fmtMoney(v)}
              width={64}
              axisLine={false}
              {...axisProps(c)}
            />
            <Tooltip content={tip} cursor={{ fill: c['--grid'], opacity: 0.5 }} />
            <Bar
              dataKey="revenue"
              name="Doanh thu"
              fill={c['--series-1']}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="totalSpent"
              name="Chi phí"
              fill={c['--series-2']}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CumulativeChart({
  monthly,
  breakEvenMonth,
}: {
  monthly: MonthlyRow[];
  breakEvenMonth: number | null;
}) {
  const c = useChartColors();
  const width = useChartWidth('half');
  const tip = ({ active, payload }: TipProps<MonthlyRow>) => {
    const m = active && payload?.[0]?.payload;
    if (!m) return null;
    return (
      <TooltipBox
        title={`Tháng ${m.month}`}
        rows={[
          { label: 'Lũy kế', value: fmtMoney(m.cumulative, { sign: true }) },
          { label: 'Lợi nhuận tháng', value: fmtMoney(m.profit, { sign: true }) },
        ]}
      />
    );
  };
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Lợi nhuận lũy kế và điểm hoàn vốn</h2>
          <p>
            {breakEvenMonth
              ? `Lũy kế chuyển dương ở tháng ${breakEvenMonth} kể từ lúc mở game`
              : 'Chưa hoàn vốn trong kỳ dự phóng'}
          </p>
        </div>
      </div>
      <div className="chart-box">
        <ResponsiveContainer width={width} height="100%">
          <LineChart data={monthly} margin={{ top: 18, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c['--grid']} />
            <XAxis
              dataKey="month"
              interval="preserveStartEnd"
              tickFormatter={(m) => `T${m}`}
              {...axisProps(c)}
            />
            <YAxis
              tickFormatter={(v) => fmtMoney(v)}
              width={64}
              axisLine={false}
              {...axisProps(c)}
            />
            <ReferenceLine y={0} stroke={c['--text-3']} />
            {breakEvenMonth && (
              <ReferenceLine
                x={breakEvenMonth}
                stroke={c['--good']}
                strokeDasharray="4 4"
                label={{
                  value: `hoàn vốn T${breakEvenMonth}`,
                  position: 'insideTopRight',
                  fill: c['--good'],
                  fontSize: 11,
                }}
              />
            )}
            <Tooltip content={tip} cursor={{ stroke: c['--text-3'], strokeDasharray: '3 3' }} />
            <Line
              dataKey="cumulative"
              stroke={c['--series-7']}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Người dùng theo ngày. Chọn một tháng: trục X là ngày 1 → 30 của tháng đó. */
export function DailyUsersChart({ daily, months }: { daily: DailyRow[]; months: number }) {
  const c = useChartColors();
  const width = useChartWidth('full');
  const [month, setMonth] = useState<number | 'all'>(1);
  const selected = month === 'all' ? 'all' : Math.min(month, months);
  const data = selected === 'all' ? daily : daily.filter((d) => d.month === selected);
  const xKey = selected === 'all' ? 'day' : 'dayOfMonth';

  const tip = ({ active, payload }: TipProps<DailyRow>) => {
    const d = active && payload?.[0]?.payload;
    if (!d) return null;
    return (
      <TooltipBox
        title={`Ngày ${d.dayOfMonth} · T${d.month} (ngày ${d.day} kể từ OB)`}
        rows={[
          { label: 'DAU', value: fmtInt(d.dau), color: c['--series-1'] },
          { label: 'User mới', value: fmtInt(d.nru), color: c['--series-2'] },
          { label: 'Doanh thu', value: fmtMoney(d.revenue) },
        ]}
      />
    );
  };

  const monthStarts = Array.from({ length: months }, (_, i) => i * 30 + 1);
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>Người dùng theo ngày</h2>
          <p>
            {selected === 'all' ? 'Toàn kỳ, vạch mờ chia tháng' : `Tháng ${selected}: ngày 1 → 30`}
          </p>
        </div>
        <label className="spacer no-print" style={{ fontSize: 12, color: 'var(--text-2)' }}>
          Xem{' '}
          <select
            value={String(selected)}
            onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            {Array.from({ length: months }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
            <option value="all">Tất cả</option>
          </select>
        </label>
      </div>
      <Legend
        items={[
          { label: 'DAU', color: c['--series-1'], line: true },
          { label: 'User mới mỗi ngày (NRU)', color: c['--series-2'], line: true },
        ]}
      />
      <div className="chart-box">
        <ResponsiveContainer width={width} height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c['--grid']} />
            {selected === 'all' &&
              monthStarts.slice(1).map((d) => <ReferenceLine key={d} x={d} stroke={c['--grid']} />)}
            <XAxis
              dataKey={xKey}
              type="number"
              domain={selected === 'all' ? [1, months * 30] : [1, 30]}
              ticks={
                selected === 'all'
                  ? monthStarts.filter((_, i) => i % Math.ceil(months / 12) === 0)
                  : [1, 5, 10, 15, 20, 25, 30]
              }
              tickFormatter={(v) => (selected === 'all' ? `T${Math.ceil(v / 30)}` : String(v))}
              {...axisProps(c)}
            />
            <YAxis tickFormatter={(v) => fmtInt(v)} width={56} axisLine={false} {...axisProps(c)} />
            <Tooltip content={tip} cursor={{ stroke: c['--text-3'], strokeDasharray: '3 3' }} />
            <Line
              dataKey="dau"
              stroke={c['--series-1']}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              dataKey="nru"
              stroke={c['--series-2']}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** So sánh lũy kế nhiều kịch bản: màu theo thứ tự cố định của kịch bản. */
export function CompareCumulativeChart({
  series,
}: {
  series: { name: string; monthly: MonthlyRow[] }[];
}) {
  const c = useChartColors();
  const width = useChartWidth('full');
  const colors = [c['--series-1'], c['--series-2'], c['--series-3'], c['--series-4']];
  const maxMonths = Math.max(...series.map((s) => s.monthly.length));
  const data = Array.from({ length: maxMonths }, (_, i) => {
    const row: Record<string, number> = { month: i + 1 };
    series.forEach((s, k) => {
      if (s.monthly[i]) row[`s${k}`] = s.monthly[i].cumulative;
    });
    return row;
  });
  const tip = ({ active, payload }: TipProps<Record<string, number>>) => {
    const row = active && payload?.[0]?.payload;
    if (!row) return null;
    return (
      <TooltipBox
        title={`Tháng ${row.month} · lũy kế`}
        rows={series.map((s, k) => ({
          label: s.name,
          value: row[`s${k}`] === undefined ? '—' : fmtMoney(row[`s${k}`], { sign: true }),
          color: colors[k],
        }))}
      />
    );
  };
  return (
    <>
      <Legend items={series.map((s, k) => ({ label: s.name, color: colors[k], line: true }))} />
      <div className="chart-box">
        <ResponsiveContainer width={width} height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={c['--grid']} />
            <XAxis
              dataKey="month"
              interval="preserveStartEnd"
              tickFormatter={(m) => `T${m}`}
              {...axisProps(c)}
            />
            <YAxis
              tickFormatter={(v) => fmtMoney(v)}
              width={64}
              axisLine={false}
              {...axisProps(c)}
            />
            <ReferenceLine y={0} stroke={c['--text-3']} />
            <Tooltip content={tip} cursor={{ stroke: c['--text-3'], strokeDasharray: '3 3' }} />
            {series.map((_, k) => (
              <Line
                key={k}
                dataKey={`s${k}`}
                stroke={colors[k]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
