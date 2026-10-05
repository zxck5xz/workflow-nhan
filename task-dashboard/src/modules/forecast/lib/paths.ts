/** Đường dẫn tới một tham số, vd "acquisition.cpn" hoặc "costs.fixed.server". */
export type Path = string;

export function getPath<T = unknown>(obj: unknown, path: Path): T {
  return path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj) as T;
}

/** Trả về bản sao mới với giá trị tại path được thay (immutable). */
export function setPath<T>(obj: T, path: Path, value: unknown): T {
  const [head, ...rest] = path.split('.');
  const src = obj as Record<string, unknown>;
  const copy = (Array.isArray(obj) ? [...(obj as unknown[])] : { ...src }) as Record<
    string,
    unknown
  >;
  copy[head] = rest.length === 0 ? value : setPath(src[head], rest.join('.'), value);
  return copy as T;
}
