import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import './forecast.css';
import { BidaForecast, type BidaGame } from './bida/BidaForecast';
import { CumulativeChart, DailyUsersChart, RevenueCostChart } from './components/charts/Charts';
import { InputsContext } from './components/inputsContext';
import { Scenarios } from './components/Scenarios';
import { Sidebar } from './components/Sidebar';
import { KpiGrid, NoteBanner } from './components/Summary';
import { Tables } from './components/Tables';
import { simulate, type Inputs } from './engine';
import { excelOriginal, presets } from './engine/presets';
import { exportWorkbook } from './lib/export';
import { setPath, type Path } from './lib/paths';
import { printPage } from './lib/print';
import {
  loadDraft,
  loadScenarios,
  newScenario,
  storeDraft,
  storeScenarios,
  type SavedScenario,
} from './lib/scenarios';
import { decodeShareHash, encodeShareHash } from './lib/share';
import { validate } from './lib/validate';

type Theme = 'auto' | 'light' | 'dark';
const THEME_KEY = 'augo-dashboard:theme';

/** Bổ sung trường còn thiếu (kịch bản lưu từ phiên bản cũ) bằng giá trị mặc định. */
function withDefaults<T>(defaults: T, value: unknown): T {
  if (value === undefined || value === null) return defaults;
  if (typeof defaults !== 'object' || defaults === null || Array.isArray(defaults))
    return value as T;
  const out = { ...defaults } as Record<string, unknown>;
  for (const k of Object.keys(out))
    out[k] = withDefaults(out[k], (value as Record<string, unknown>)[k]);
  return out as T;
}

const normalize = (x: unknown): Inputs => withDefaults(excelOriginal, x);
/** So tham số, bỏ qua tên và các ô của chế độ nhập không dùng (vd sau khi "Đồng bộ 3 chế độ") */
const fingerprint = (i: Inputs) => {
  const { targetNruPerDay, installsPerDay, budgetMonth1, budgetMaintain, budgetDecay, ...a } =
    i.acquisition;
  const byMode = {
    installPlan: { installsPerDay },
    target: { targetNruPerDay },
    budget: { budgetMonth1, budgetMaintain, budgetDecay },
  }[a.mode];
  return JSON.stringify({ ...i, name: '', acquisition: { ...a, ...byMode } });
};
const EXCEL_FINGERPRINT = fingerprint(excelOriginal);

type Game = 'augo' | BidaGame;
const GAME_KEY = 'forecast:game';
const GAMES: { id: Game; label: string; sub: string }[] = [
  { id: 'augo', label: 'AuGo', sub: 'IAP · theo Excel AuGo Master Plan' },
  { id: 'bida', label: 'Bida 8 Pool', sub: 'IAP + IAA · theo file Bida' },
  { id: 'new', label: 'Game mới', sub: 'Mô hình Bida, nhập thông số riêng' },
];

/** Trang dự phóng doanh thu & hoàn vốn, nhiều game: AuGo (engine AuGo) và Bida 8 Pool / game mới (engine Bida). */
export function ForecastPage() {
  const [game, setGame] = useState<Game>(() => {
    // Link chia sẻ / chế độ in là của AuGo
    const { hash, search } = window.location;
    if (hash.startsWith('#s=') || new URLSearchParams(search).has('print')) return 'augo';
    try {
      const g = localStorage.getItem(GAME_KEY) as Game | null;
      return g && GAMES.some((x) => x.id === g) ? g : 'augo';
    } catch {
      return 'augo';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(GAME_KEY, game);
    } catch {
      /* chỉ mất ghi nhớ game đang chọn */
    }
  }, [game]);

  return (
    <div className="forecast-root">
      <nav className="forecast-games no-print" aria-label="Chọn game">
        {GAMES.map((g) => (
          <button key={g.id} aria-pressed={game === g.id} onClick={() => setGame(g.id)}>
            <b>{g.label}</b>
            <span>{g.sub}</span>
          </button>
        ))}
      </nav>
      {game === 'augo' ? (
        <AugoForecast />
      ) : (
        <div className="augo">
          <BidaForecast key={game} game={game} />
        </div>
      )}
    </div>
  );
}

/** Dự phóng AuGo theo Excel AuGo Master Plan. Toàn bộ giao diện nằm trong div.augo. */
function AugoForecast() {
  const [inputs, setInputs] = useState<Inputs>(() => normalize(loadDraft()));
  const [scenarios, setScenarios] = useState<SavedScenario[]>(loadScenarios);
  const [toast, setToast] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(THEME_KEY) as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  });

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  // Mở link chia sẻ: #s=...
  useEffect(() => {
    decodeShareHash(window.location.hash).then((shared) => {
      if (shared) {
        setInputs(normalize(shared));
        notify(`Đã mở kịch bản được chia sẻ: ${shared.name}`);
      }
    });
  }, [notify]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* trình duyệt chặn lưu: chỉ mất ghi nhớ theme */
    }
  }, [theme]);

  useEffect(() => {
    const t = window.setTimeout(() => storeDraft(inputs), 300);
    return () => window.clearTimeout(t);
  }, [inputs]);

  const set = useCallback(
    (path: Path, value: unknown) => setInputs((prev) => setPath(prev, path, value)),
    [],
  );
  const issues = useMemo(() => validate(inputs), [inputs]);

  // Tính lại với giá trị trễ để gõ phím không bị giật
  const deferred = useDeferredValue(inputs);
  const result = useMemo(() => simulate(deferred), [deferred]);

  const sameAsExcel = useMemo(() => fingerprint(inputs) === EXCEL_FINGERPRINT, [inputs]);
  const issueCount = Object.keys(issues).length;

  const persist = (list: SavedScenario[]) => {
    setScenarios(list);
    if (!storeScenarios(list))
      notify('Trình duyệt không cho lưu — kịch bản chỉ còn đến khi tải lại trang');
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}${await encodeShareHash(inputs)}`;
    window.history.replaceState(null, '', url);
    try {
      await navigator.clipboard.writeText(url);
      notify('Đã copy link chia sẻ');
    } catch {
      notify('Link chia sẻ đã nằm trên thanh địa chỉ');
    }
  };

  return (
    <InputsContext.Provider value={{ inputs, set, issues }}>
      <div className="augo" data-theme={theme === 'auto' ? undefined : theme}>
        <div className="augo-app">
          <Sidebar
            onPreset={(id) => {
              const p = presets.find((x) => x.id === id);
              if (p) {
                setInputs(structuredClone(p.inputs));
                notify(`Đã nạp: ${p.inputs.name}`);
              }
            }}
          />
          <main className="augo-main">
            <header className="topbar">
              <h1>
                AuGo – Dự phóng doanh thu &amp; hoàn vốn
                <span className="subtitle">
                  {inputs.name} · {inputs.months} tháng
                </span>
              </h1>
              <div className="topbar no-print">
                <button className="btn" onClick={share}>
                  Chia sẻ link
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    exportWorkbook(inputs, result).catch(() => notify('Xuất Excel thất bại'))
                  }
                >
                  Xuất Excel
                </button>
                <button className="btn" onClick={printPage}>
                  Xuất PDF
                </button>
                <select
                  aria-label="Giao diện"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                >
                  <option value="auto">Theo máy</option>
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                </select>
              </div>
            </header>

            {issueCount > 0 && (
              <div
                className="banner no-print"
                role="alert"
                style={{ background: 'var(--bad-bg)', borderColor: 'var(--bad)' }}
              >
                Có {issueCount} tham số chưa hợp lệ (xem chữ đỏ bên trái). Kết quả có thể không
                đúng.
              </div>
            )}

            <KpiGrid s={result.summary} inputs={inputs} />
            <NoteBanner s={result.summary} sameAsExcel={sameAsExcel} />

            <div className="charts">
              <RevenueCostChart monthly={result.monthly} />
              <CumulativeChart
                monthly={result.monthly}
                breakEvenMonth={result.summary.breakEvenMonth}
              />
            </div>
            <DailyUsersChart daily={result.daily} months={inputs.months} />
            <Tables result={result} />
            <Scenarios
              scenarios={scenarios}
              current={inputs}
              result={result}
              onSave={(name) => {
                persist([newScenario(name, inputs), ...scenarios]);
                setInputs((p) => ({ ...p, name }));
                notify(`Đã lưu: ${name}`);
              }}
              onLoad={(s) => {
                setInputs(normalize(s.inputs));
                notify(`Đã nạp: ${s.name}`);
              }}
              onDelete={(id) => persist(scenarios.filter((s) => s.id !== id))}
            />
          </main>
        </div>
        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </div>
    </InputsContext.Provider>
  );
}
