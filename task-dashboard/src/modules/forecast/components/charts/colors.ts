import { useEffect, useState } from 'react';

const VARS = [
  '--series-1',
  '--series-2',
  '--series-3',
  '--series-4',
  '--series-7',
  '--good',
  '--good-bg',
  '--bad',
  '--grid',
  '--text-2',
  '--text-3',
  '--border',
] as const;
export type ChartColors = Record<(typeof VARS)[number], string>;

/** Biến màu khai báo trên div.augo (gốc của module), không phải :root của task-dashboard */
const root = () => document.querySelector('.augo') ?? document.documentElement;

function read(): ChartColors {
  const style = getComputedStyle(root());
  return Object.fromEntries(VARS.map((v) => [v, style.getPropertyValue(v).trim()])) as ChartColors;
}

/** Màu biểu đồ lấy từ biến CSS; đọc lại khi đổi theme (thuộc tính data-theme hoặc theme hệ điều hành). */
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(read);
  useEffect(() => {
    const update = () => setColors(read());
    // Lần render đầu div.augo có thể chưa gắn vào DOM: đọc lại sau khi mount
    update();
    const mo = new MutationObserver(update);
    mo.observe(root(), { attributes: true, attributeFilter: ['data-theme'] });
    const mq = matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', update);
    return () => {
      mo.disconnect();
      mq.removeEventListener('change', update);
    };
  }, []);
  return colors;
}

export const axisProps = (c: ChartColors) => ({
  stroke: c['--border'],
  tick: { fill: c['--text-3'], fontSize: 11 },
  tickLine: false,
});
