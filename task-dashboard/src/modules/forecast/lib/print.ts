import { useSyncExternalStore } from 'react';

/**
 * Chế độ in: biểu đồ vẽ với bề rộng cố định vừa khổ A4 ngang (ResponsiveContainer không tự đo lại khi in).
 * Bật bằng nút "Xuất PDF" hoặc thêm ?print vào URL (dùng cho Chrome headless --print-to-pdf).
 */
let printing = new URLSearchParams(window.location.search).has('print');
const listeners = new Set<() => void>();

function emit(v: boolean) {
  printing = v;
  listeners.forEach((l) => l());
}

export function usePrinting(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => printing,
  );
}

/** Vẽ lại biểu đồ ở khổ in, chờ 2 frame rồi mở hộp thoại in; đóng hộp thoại thì trả lại khổ màn hình. */
export function printPage(): void {
  const keep = new URLSearchParams(window.location.search).has('print');
  emit(true);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      window.addEventListener('afterprint', () => emit(keep), { once: true });
      window.print();
    }),
  );
}

/** Bề rộng biểu đồ khi in: A4 ngang ≈ 1030px trừ lề, nửa trang cho 2 biểu đồ cạnh nhau */
export const PRINT_WIDTH = { full: 960, half: 450 };
