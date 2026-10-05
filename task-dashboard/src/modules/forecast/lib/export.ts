import type { Inputs, Result } from '../engine';
import { DAILY_LINES, PNL_LINES } from './pnl';

/** Xuất workbook: P&L theo tháng (dạng giống sheet Forecast), theo ngày, KPI và tham số. */
export async function exportWorkbook(inputs: Inputs, result: Result): Promise<void> {
  const XLSX = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const months = result.monthly.map((m) => `T${m.month}`);
  const pnl = [
    ['Chỉ tiêu', 'TOTAL', ...months],
    ...PNL_LINES.map((line) => {
      const values = result.monthly.map((m) => Math.round(m[line.key] as number));
      const total =
        line.key === 'cumulative'
          ? values[values.length - 1]
          : line.key === 'dauAvg'
            ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
            : values.reduce((s, v) => s + v, 0);
      return [line.label, total, ...values];
    }),
  ];
  const pnlSheet = XLSX.utils.aoa_to_sheet(pnl);
  pnlSheet['!cols'] = [{ wch: 30 }, { wch: 18 }, ...months.map(() => ({ wch: 16 }))];
  XLSX.utils.book_append_sheet(wb, pnlSheet, 'Theo tháng');

  const daily = [
    DAILY_LINES.map((l) => l.label),
    ...result.daily.map((d) => DAILY_LINES.map((l) => Math.round(d[l.key] as number))),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(daily), 'Theo ngày');

  const s = result.summary;
  const kpi: [string, number | string][] = [
    ['NRU', s.nru],
    ['DAU cao nhất', s.peakDau],
    ['Doanh thu', s.revenue],
    ['Tổng chi phí', s.totalSpent],
    ['Lợi nhuận', s.profit],
    ['Biên lợi nhuận', s.margin],
    ['Lợi nhuận / tổng chi phí', s.profitOverSpent],
    ['Hoàn vốn (tháng)', s.breakEvenMonth ?? 'Chưa hoàn vốn'],
    ['Tiền ads', s.mkt],
    ['Giá 1 lượt cài', s.costPerInstall],
    ['CPN bình quân', s.avgCpn],
    ['LTV 365', s.ltv365],
    ['LTV 365 / CPN', s.ltvOverCpn],
    ['Share dev phải trả', s.shareDevPaid],
    ['Chi phí một lần', s.oneTimeCosts],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['KPI', 'Giá trị'], ...kpi]), 'KPI');

  const params = flatten(inputs).map(([k, v]) => [k, Array.isArray(v) ? v.join(', ') : v]);
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet([['Tham số', 'Giá trị'], ...params]),
    'Tham số',
  );

  const safeName = inputs.name.replace(/[\\/:*?"<>|]/g, '-');
  XLSX.writeFile(wb, `AuGo-du-phong-${safeName}.xlsx`);
}

function flatten(obj: unknown, prefix = ''): [string, unknown][] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [[prefix, obj]];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v) && v.some((x) => typeof x === 'object'))
      return [[key, JSON.stringify(v)]] as [string, unknown][];
    return flatten(v, key);
  });
}
