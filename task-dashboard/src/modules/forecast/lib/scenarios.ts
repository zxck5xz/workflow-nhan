import type { Inputs } from '../engine';

export interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  inputs: Inputs;
}

const KEY = 'augo-dashboard:scenarios';

export function loadScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedScenario[]) : [];
  } catch {
    return [];
  }
}

/** Trả về false nếu trình duyệt chặn lưu (chế độ ẩn danh, hết dung lượng…) */
export function storeScenarios(list: SavedScenario[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export function newScenario(name: string, inputs: Inputs): SavedScenario {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    savedAt: new Date().toISOString(),
    inputs: { ...structuredClone(inputs), name },
  };
}

const DRAFT_KEY = 'augo-dashboard:inputs';

/** Tham số đang nhập dở, để tải lại trang không mất */
export function loadDraft(): unknown {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeDraft(inputs: Inputs): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(inputs));
  } catch {
    /* trình duyệt chặn lưu: chỉ mất ghi nhớ khi tải lại */
  }
}
