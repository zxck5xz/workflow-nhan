import { useDeferredValue, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { CumulativeChart, DailyUsersChart, RevenueCostChart } from '../components/charts/Charts';
import { Advanced, NumberInput, Section, type Tone } from '../components/fields';
import { Kpi } from '../components/Summary';
import type { DailyRow, MonthlyRow } from '../engine';
import { fmtInt, fmtMoney, fmtPct, fmtVnd } from '../lib/format';
import { cumClass } from '../lib/pnl';
import { computeBida, type BidaInputs, type BidaResult } from './engine';
import { BIDA_DEFAULTS, BIDA_FILE_REFERENCE, NEW_GAME_DEFAULTS } from './presets';
import { SCHEMA, type FieldDef } from './schema';
import { syncBidaModes, type BidaSyncResult } from './sync';

export type BidaGame = 'bida' | 'new';

/** Màu nhấn xoay vòng cho các nhóm tham số. */
const TONES: Tone[] = [1, 3, 2, 4, 7];

const DEFAULTS: Record<BidaGame, BidaInputs> = { bida: BIDA_DEFAULTS, new: NEW_GAME_DEFAULTS };
const inputsKey = (g: BidaGame) => `forecast:${g}:inputs`;
const scenariosKey = (g: BidaGame) => `forecast:${g}:scenarios`;

interface BidaScenario {
  id: number;
  name: string;
  inputs: BidaInputs;
  k: { rev: number; cost: number; profit: number; pb: number; nru: number };
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Biểu đồ dùng chung với AuGo: quy kết quả Bida về dòng tháng / ngày của engine AuGo. */
function toMonthlyRows(r: BidaResult): MonthlyRow[] {
  return r.monthly.map((x) => ({
    month: x.m,
    revenue: x.revenue,
    totalSpent: x.cost,
    profit: x.profit,
    cumulative: x.cum,
    nru: x.nru,
    dauAvg: x.dauAvg,
    mkt: x.ads,
  })) as MonthlyRow[];
}
function toDailyRows(r: BidaResult): DailyRow[] {
  const rows: DailyRow[] = [];
  for (let d = r.pre; d < r.days; d++) {
    const day = d - r.pre + 1;
    rows.push({
      day,
      month: Math.ceil(day / 30),
      dayOfMonth: ((day - 1) % 30) + 1,
      nru: r.nru[d] + (d === r.pre ? r.nru.slice(0, r.pre).reduce((a, b) => a + b, 0) : 0),
      dau: r.dau[d],
      revenue: r.iap[d] + r.iaa[d],
    } as DailyRow);
  }
  return rows;
}

/** Dự phóng kiểu Bida 8 Pool (IAP + IAA) — bố cục và nội dung theo forecast-bida-8-pool (5).html. */
export function BidaForecast({ game }: { game: BidaGame }) {
  const defaults = DEFAULTS[game];
  const [inp, setInp] = useState<BidaInputs>(() => ({
    ...defaults,
    ...readJson<Partial<BidaInputs>>(inputsKey(game), {}),
  }));
  const [scenarios, setScenarios] = useState<BidaScenario[]>(() =>
    readJson<BidaScenario[]>(scenariosKey(game), []),
  );
  const [sync, setSync] = useState<BidaSyncResult | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => writeJson(inputsKey(game), inp), 300);
    return () => window.clearTimeout(t);
  }, [game, inp]);

  const deferred = useDeferredValue(inp);
  const result = useMemo(() => computeBida(deferred), [deferred]);
  const monthlyRows = useMemo(() => toMonthlyRows(result), [result]);
  const dailyRows = useMemo(() => toDailyRows(result), [result]);
  const T = result.totals;

  const set = (id: keyof BidaInputs, v: unknown) => setInp((p) => ({ ...p, [id]: v }));
  const persist = (list: BidaScenario[]) => {
    setScenarios(list);
    writeJson(scenariosKey(game), list);
  };

  const payback = T.payback < 0 ? null : T.payback + 1;
  return (
    <div className="augo-app">
      <aside className="augo-inputs" aria-label="Tham số">
        <h2 className="bida-title">Máy tính forecast</h2>
        <div className="hint" style={{ display: 'block', marginBottom: 10 }}>
          {inp.name} (IAA + IAP) · sửa ô nào ra kết quả ngay
        </div>
        <div className="segmented" role="group" aria-label="Chế độ nhập">
          {(
            [
              ['users', 'Theo mục tiêu user'],
              ['budget', 'Theo ngân sách ads'],
            ] as const
          ).map(([m, label]) => (
            <button key={m} aria-pressed={inp.mode === m} onClick={() => set('mode', m)}>
              {label}
            </button>
          ))}
        </div>
        <button
          className="btn small sync-btn"
          onClick={() => {
            const r = syncBidaModes(inp);
            setSync(r);
            if (r.kind === 'synced') setInp(r.inputs);
          }}
        >
          Đồng bộ 2 chế độ
        </button>
        {sync && <SyncReport result={sync} onClose={() => setSync(null)} />}

        {SCHEMA.map((g, gi) => {
          const tone = TONES[gi % TONES.length];
          const body = (items: FieldDef[]) =>
            items.map((f) => <BidaField key={f.id} f={f} inp={inp} game={game} set={set} />);
          if (g.adv)
            return (
              <Advanced key={g.g} title={`Nâng cao: ${g.g}`} tone={tone}>
                {body(g.items)}
              </Advanced>
            );
          return (
            <Section key={g.g} title={g.g} tone={tone}>
              {body(g.items)}
            </Section>
          );
        })}

        <div className="bida-actions">
          <button
            className="btn small"
            onClick={() => {
              setInp({ ...defaults });
              setSync(null);
            }}
          >
            Về mặc định gốc
          </button>
          <button
            className="btn small"
            onClick={() => {
              const name = `${inp.name} · KB ${scenarios.length + 1}`;
              persist([
                {
                  id: Date.now(),
                  name,
                  inputs: inp,
                  k: { rev: T.revenue, cost: T.cost, profit: T.profit, pb: T.payback, nru: T.nru },
                },
                ...scenarios,
              ]);
            }}
          >
            Lưu kịch bản
          </button>
          <button className="btn small" onClick={() => exportCsv(result)}>
            Xuất CSV
          </button>
        </div>
      </aside>

      <main className="augo-main">
        <header className="topbar">
          <h1>
            {inp.name} – Dự phóng doanh thu &amp; hoàn vốn
            <span className="subtitle">
              IAP + IAA · {T.months} tháng ·{' '}
              {inp.mode === 'users' ? 'theo mục tiêu user' : 'theo ngân sách ads'}
            </span>
          </h1>
        </header>

        <div className="kpis bida-kpis">
          <Kpi
            label="User mới (NRU)"
            accent="users"
            value={fmtInt(T.nru)}
            sub={`Tổng cả kỳ · cài đặt ${fmtInt(T.installs)}`}
          />
          <Kpi
            label="DAU cao nhất"
            accent="users"
            value={fmtInt(T.dauPeak)}
            sub={`Bình quân ${fmtInt(T.dauAvg)} người chơi/ngày`}
          />
          <Kpi
            label="Doanh thu"
            accent="revenue"
            value={fmtMoney(T.revenue)}
            tone="good"
            sub={`IAP ${fmtMoney(T.iap)} · IAA ${fmtMoney(T.iaa)}`}
          />
          <Kpi
            label="Tổng chi phí"
            accent="cost"
            value={fmtMoney(T.cost)}
            tone="bad"
            sub={fmtVnd(T.cost)}
          />
          <Kpi
            label="Lợi nhuận"
            accent="revenue"
            value={fmtMoney(T.profit, { sign: true })}
            tone={T.profit >= 0 ? 'good' : 'bad'}
            sub={`Biên ${fmtPct(T.ratio)} doanh thu`}
          />
          <Kpi
            label="Hoàn vốn"
            accent="payback"
            value={payback ? `Tháng ${payback}` : 'Chưa hoàn vốn'}
            tone={payback ? undefined : 'bad'}
            sub={
              payback
                ? 'Lũy kế chuyển dương'
                : `Trong ${T.months} tháng vẫn lỗ ${fmtMoney(Math.abs(T.cum[T.months - 1]))}`
            }
          />
        </div>
        <div className="kpis bida-kpis">
          <Kpi
            secondary
            label="Tiền ads đã chi"
            accent="cost"
            value={fmtMoney(T.ads)}
            sub={`Chiếm ${fmtPct(T.ads / Math.max(1, T.revenue), 0)} doanh thu`}
          />
          <Kpi
            secondary
            label="Giá 1 user mới"
            accent="cost"
            value={fmtVnd(T.cpnM1)}
            sub="Tháng 1 · các tháng sau giảm dần"
          />
          <Kpi
            secondary
            label="Doanh thu 1 user cả vòng đời"
            accent="ratio"
            value={fmtVnd(T.ltv365)}
            tone={T.ltv365 >= T.cpn ? 'good' : 'bad'}
            sub={`So với giá 1 user: ${(T.ltv365 / Math.max(1, T.cpn)).toFixed(2).replace('.', ',')}×`}
          />
          <Kpi
            secondary
            label="Share dev phải trả"
            accent="cost"
            value={fmtMoney(T.shareDev)}
            sub={`Đã cấn trừ tạm ứng MG ${fmtMoney(T.mg)}`}
          />
          <Kpi
            secondary
            label="Thuế và phí"
            accent="cost"
            value={fmtMoney(T.vat + T.gateway + T.adsTax)}
            sub={`VAT ${fmtMoney(T.vat)} · cổng TT ${fmtMoney(T.gateway)} · thuế ads ${fmtMoney(T.adsTax)}`}
          />
          <Kpi
            secondary
            label="Chi phí cố định"
            accent="cost"
            value={fmtMoney(T.fixed + T.preLaunch)}
            sub={`Gồm ${fmtMoney(T.preLaunch)} chi phí trước khi mở game`}
          />
        </div>

        {game === 'bida' ? <BidaNote r={result} /> : <NewGameNote />}

        <RevenueCostChart monthly={monthlyRows} />
        <CumulativeChart monthly={monthlyRows} breakEvenMonth={payback} />
        <DailyUsersChart daily={dailyRows} months={T.months} />

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Bảng theo tháng</h2>
              <p>Tháng 1 gồm {result.pre} ngày chạy trước khi mở game</p>
            </div>
          </div>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  {[
                    'Tháng',
                    'Tiền ads',
                    'NRU',
                    'DAU bình quân',
                    'Doanh thu IAP',
                    'Doanh thu IAA',
                    'Doanh thu',
                    'Chi phí',
                    'Lợi nhuận',
                    'Lũy kế',
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.monthly.map((x, i) => (
                  <tr
                    key={x.m}
                    className={
                      x.profit < 0 ? 'neg-row' : T.payback === i ? 'payback-row' : undefined
                    }
                  >
                    <td>T{x.m}</td>
                    <td>{fmtMoney(x.ads)}</td>
                    <td>{fmtInt(x.nru)}</td>
                    <td>{fmtInt(x.dauAvg)}</td>
                    <td>{fmtMoney(x.iap)}</td>
                    <td>{fmtMoney(x.iaa)}</td>
                    <td>{fmtMoney(x.revenue)}</td>
                    <td>{fmtMoney(x.cost)}</td>
                    <td className={x.profit < 0 ? 'neg' : undefined}>{fmtMoney(x.profit)}</td>
                    <td className={cumClass(x.cum)}>{fmtMoney(x.cum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2>Kịch bản đã lưu</h2>
              <p>Bấm «Lưu kịch bản» để ghim bộ số hiện tại; «Nạp» để mở lại, ✕ để xoá</p>
            </div>
          </div>
          {scenarios.length === 0 ? (
            <div className="empty">Chưa lưu kịch bản nào</div>
          ) : (
            <div className="bida-chips">
              {scenarios.map((s) => (
                <div className="bida-chip" key={s.id}>
                  <div className="n">
                    <span>{s.name}</span>
                    <button
                      className="x"
                      aria-label={`Xoá ${s.name}`}
                      onClick={() => persist(scenarios.filter((x) => x.id !== s.id))}
                    >
                      ✕
                    </button>
                  </div>
                  Doanh thu {fmtMoney(s.k.rev)}
                  <br />
                  Chi phí {fmtMoney(s.k.cost)}
                  <br />
                  Lợi nhuận <b>{fmtMoney(s.k.profit)}</b>
                  <br />
                  Hoàn vốn {s.k.pb < 0 ? 'chưa' : `T${s.k.pb + 1}`}
                  <br />
                  NRU {fmtInt(s.k.nru)}
                  <div>
                    <button
                      className="btn small"
                      onClick={() => setInp({ ...defaults, ...s.inputs })}
                    >
                      Nạp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function BidaField({
  f,
  inp,
  game,
  set,
}: {
  f: FieldDef;
  inp: BidaInputs;
  game: BidaGame;
  set: (id: keyof BidaInputs, v: unknown) => void;
}) {
  const id = useId();
  if (f.when && f.when !== inp.mode) return null;
  const off = !!f.moc && inp.retMode === 'file';
  const unit = { pct: '%', money: 'đ', usd: 'USD' }[f.type as 'pct' | 'money' | 'usd'];
  // Chú thích "Bản gốc …" nói về file Bida; ở Game mới ghi rõ là số của Bida
  const hint = game === 'new' ? f.hint?.replace(/^(Bản gốc|File gốc)/, 'Bida') : f.hint;
  let control: ReactNode;
  if (f.type === 'select') {
    control = (
      <select
        id={id}
        value={String(inp[f.id])}
        onChange={(e) => {
          const opt = f.opts!.find((o) => String(o[0]) === e.target.value);
          if (opt) set(f.id, opt[0]);
        }}
      >
        {f.opts!.map(([v, t]) => (
          <option key={String(v)} value={String(v)}>
            {t}
          </option>
        ))}
      </select>
    );
  } else if (f.type === 'text') {
    control = (
      <input
        id={id}
        type="text"
        value={String(inp[f.id])}
        onChange={(e) => set(f.id, e.target.value)}
      />
    );
  } else {
    control = (
      <div className={unit ? 'input-suffix' : undefined}>
        <NumberInput
          id={id}
          value={inp[f.id] as number}
          digits={4}
          onChange={(v) => set(f.id, v)}
        />
        {unit && <span>{unit}</span>}
      </div>
    );
  }
  return (
    <div
      className={`field${f.type === 'text' || f.type === 'select' ? ' wide' : ''}${off ? ' off' : ''}`}
    >
      <label htmlFor={id}>{f.label}</label>
      <fieldset disabled={off} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {control}
      </fieldset>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

function SyncReport({ result, onClose }: { result: BidaSyncResult; onClose: () => void }) {
  let body: ReactNode;
  if (result.kind === 'aligned')
    body = 'Hai chế độ đang khớp nhau rồi (lệch dưới 1%) — không cần đồng bộ nữa.';
  else if (result.kind === 'empty') body = result.message;
  else {
    const i = result.inputs;
    const off = result.target ? ((result.got - result.target) / result.target) * 100 : 0;
    const ok = result.exact && Math.abs(off) < 0.5;
    body = (
      <>
        {result.from === 'users' ? (
          <>
            <b>Đồng bộ theo «mục tiêu user»</b> → đã đặt ngân sách tháng 1 = {fmtMoney(i.budgetM1)},
            duy trì = {fmtMoney(i.budgetMaintain)}/tháng.
          </>
        ) : (
          <>
            <b>Đồng bộ theo «ngân sách ads»</b> → đã đặt install/ngày = {fmtInt(i.installM1)} (3
            tháng đầu), {fmtInt(i.installM4)} (tháng 4–6), {fmtInt(i.installLater)} (từ tháng 7).
          </>
        )}
        <br />
        {fmtInt(result.target)} user (chuẩn) vs {fmtInt(result.got)} user (quy đổi) —{' '}
        <span className={ok ? 'ok' : 'warn'}>
          {ok ? 'khớp' : `lệch ${off.toFixed(1).replace('.', ',')}%`}
        </span>
        {result.note && (
          <>
            <br />
            <i>{result.note}</i>
          </>
        )}
      </>
    );
  }
  return (
    <div className="sync-report" role="status">
      <button className="close" aria-label="Đóng" onClick={onClose}>
        ✕
      </button>
      {body}
    </div>
  );
}

function BidaNote({ r }: { r: BidaResult }) {
  const T = r.totals;
  const O = BIDA_FILE_REFERENCE;
  const row = (name: string, mine: number, base: number, fmt: (v: number) => string = fmtMoney) => {
    const diff = base ? (mine - base) / Math.abs(base) : 0;
    return (
      <tr key={name}>
        <td>{name}</td>
        <td>{fmt(mine)}</td>
        <td>{fmt(base)}</td>
        <td>{Math.abs(diff) < 0.0005 ? 'khớp' : fmtPct(diff, 1)}</td>
      </tr>
    );
  };
  return (
    <div className="banner">
      <strong>Bản này tính lại từ đầu, không phải bản Excel gốc.</strong> Cách tính bám sát file:
      cùng công thức theo ngày, cùng bảng giữ chân 240 ngày của file, cùng hệ số 120% cho nhóm vào
      đúng ngày OB. Khác mấy chỗ sau (có chủ ý):
      <ul>
        <li>
          <b>Bỏ hẳn 4 tháng trước khi mở game</b> (tháng −4…−1): chi phí chuẩn bị (lương, branding,
          phí khác) được dồn vào tháng 1 thành ô «Chi phí trước khi mở game». Tổng cả kỳ bằng nhau,
          chỉ lệch thời điểm.
        </li>
        <li>
          <b>MG ({fmtMoney(T.mgTotal)}) dồn hết vào tháng 1</b>; file trả ở tháng −4, −2 và tháng 1.
          Tổng bằng nhau, chỉ lệch thời điểm.
        </li>
        <li>
          <b>{r.pre} ngày chạy trước ngày OB</b> vẫn mô phỏng đủ (user đăng ký trước + tiền ads)
          nhưng gộp vào tháng 1, không tách cột riêng.
        </li>
        <li>
          <b>Doanh thu IAP</b> dùng đúng 3 mức giá của file (450 / 375 / 318,75 đ theo ngày vào
          game) và đường giảm 90/80/70/60% — nhóm vào từ ngày 2 trở đi còn 50% từ ngày 120. Doanh
          thu IAA không chịu VAT và không chia share dev.
        </li>
        <li>
          <b>Bỏ các dòng bằng 0</b> (Mua game, Bonus, Phân bổ) và bỏ dòng Share Dev tính-rồi-trừ của
          file — ở đây chỉ còn phần thực trả sau khi cấn trừ MG.
        </li>
      </ul>
      <div className="compare">
        <b>Hai con số user trong file, đừng cộng lại:</b> dòng «NRU Game» = 2.625.072 đã bao gồm
        dòng «NRU UA» = 1.993.600 (dòng dưới chỉ là install × CVR, tức đã nằm trong dòng trên). Số
        đúng để dùng là «NRU Game» — chính file cũng lấy dòng này để chia giá 1 user.
      </div>
      {T.months === 24 ? (
        <>
          <div style={{ marginTop: 8 }}>
            <b>So với số đã tính sẵn trong file gốc (cả giai đoạn trước mở game + 24 tháng):</b>
          </div>
          <table className="compare-table num">
            <thead>
              <tr>
                <th>Chỉ tiêu</th>
                <th>Tool</th>
                <th>File gốc</th>
                <th>Lệch</th>
              </tr>
            </thead>
            <tbody>
              {row('User mới (NRU)', T.nru, O.nru, fmtInt)}
              {row('Doanh thu IAP', T.iap, O.iap)}
              {row('Doanh thu IAA', T.iaa, O.iaa)}
              {row('Tổng doanh thu', T.revenue, O.revenue)}
              {row('Tiền ads', T.ads, O.ads)}
              {row('— trong đó thuế ads', T.adsTax, O.taxAds)}
              {row('VAT', T.vat, O.vat)}
              {row('Phí cổng thanh toán', T.gateway, O.gateway)}
              {row('Share dev thực trả', T.shareDev, O.shareDev - O.mg)}
              {row('Tổng chi phí', T.cost, O.cost)}
              {row('Lợi nhuận', T.profit, O.profit)}
              <tr>
                <td>Hoàn vốn</td>
                <td>{T.payback < 0 ? 'Chưa' : `T${T.payback + 1}`}</td>
                <td>T{O.payback}</td>
                <td>{T.payback + 1 === O.payback ? 'khớp' : '—'}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <div className="compare">
          Đang xem <b>{T.months} tháng</b> — bảng so với file gốc chỉ áp cho 24 tháng. Chọn{' '}
          <b>24 tháng</b> ở ô «Số tháng dự phóng» để so lại.
        </div>
      )}
    </div>
  );
}

function NewGameNote() {
  return (
    <div className="banner">
      <strong>Dự phóng game mới theo mô hình Bida 8 Pool (IAP + IAA).</strong> Nhập các thông số
      chính bên trái:
      <ul>
        <li>
          <b>Install/ngày</b> 3 tháng đầu / tháng 4–6 / từ tháng 7, <b>số tháng</b>, <b>CVR</b> và{' '}
          <b>user tự nhiên</b>.
        </li>
        <li>
          <b>CPN</b> tháng 1 → tháng 3 còn X% (tháng 2 lấy mức giữa), từ tháng 13 không dưới sàn Y%.
        </li>
        <li>
          <b>Doanh thu ngày đầu 1 user</b>; hình dạng giảm theo tuổi lấy như Bida (Nâng cao: Hình
          dạng doanh thu).
        </li>
        <li>
          <b>Retention</b> D1/D3/D7/D14/D30, <b>IAA</b> (lượt xem ads/user/ngày × eCPM),{' '}
          <b>tỉ trọng Store</b>, <b>VAT / phí cổng / thuế ads</b>, <b>share dev / MG / tỉ giá</b>,{' '}
          <b>chi phí cố định</b> (lương, server, marketing, khác) ở các mục Nâng cao.
        </li>
      </ul>
      <div className="compare">
        Game mới không có số tính sẵn để so; bộ mặc định chỉ là điểm xuất phát.
      </div>
    </div>
  );
}

function exportCsv(r: BidaResult) {
  const T = r.totals;
  let c =
    'Thang;Tien ads;NRU;DAU binh quan;Doanh thu IAP;Doanh thu IAA;Doanh thu;Chi phi;Loi nhuan;Luy ke\n';
  r.monthly.forEach((x, i) => {
    c +=
      [x.m, x.ads, x.nru, x.dauAvg, x.iap, x.iaa, x.revenue, x.cost, x.profit, T.cum[i]]
        .map((v) => Math.round(v))
        .join(';') + '\n';
  });
  c +=
    '\nTONG;' +
    [T.ads, T.nru, '', T.iap, T.iaa, T.revenue, T.cost, T.profit]
      .map((v) => (v === '' ? '' : Math.round(v as number)))
      .join(';') +
    '\n';
  const blob = new Blob(['﻿' + c], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `forecast-${r.inp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'game'}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
