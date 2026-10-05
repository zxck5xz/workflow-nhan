import { useState } from 'react';
import type { AcquisitionMode } from '../engine';
import { presets } from '../engine/presets';
import { fmtInt, fmtMoney, fmtPct, formatInput, parseVnNumber } from '../lib/format';
import { MODE_LABELS, syncModes, type SyncResult } from '../lib/sync';
import { Advanced, ListField, NumberField, Section, SelectField, Toggle } from './fields';
import { useInputs } from './inputsContext';
import { MonthlyEditor, PreRegistrationEditor } from './GridEditors';

const MODES = (Object.keys(MODE_LABELS) as AcquisitionMode[]).map((value) => ({
  value,
  label: MODE_LABELS[value],
}));

export function Sidebar({ onPreset }: { onPreset: (id: string) => void }) {
  const { inputs, set } = useInputs();
  const mode = inputs.acquisition.mode;
  const [preset, setPreset] = useState(presets[0].id);
  const [sync, setSync] = useState<SyncResult | 'empty' | null>(null);

  return (
    <aside className="augo-inputs" aria-label="Tham số">
      <div className="field wide">
        <label htmlFor="preset">Bộ tham số mẫu</label>
        <select id="preset" value={preset} onChange={(e) => setPreset(e.target.value)}>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.inputs.name}
            </option>
          ))}
        </select>
        <div className="hint">
          <button className="btn small" onClick={() => onPreset(preset)}>
            Nạp bộ mẫu này
          </button>{' '}
          (ghi đè tham số đang nhập)
        </div>
      </div>

      <div className="segmented" role="group" aria-label="Chế độ nhập" style={{ marginTop: 10 }}>
        {MODES.map((m) => (
          <button
            key={m.value}
            aria-pressed={mode === m.value}
            onClick={() => set('acquisition.mode', m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <button
        className="btn small sync-btn"
        onClick={() => {
          const r = syncModes(inputs);
          setSync(r ?? 'empty');
          if (r) set('acquisition', r.acquisition);
        }}
      >
        Đồng bộ 3 chế độ theo «{MODE_LABELS[mode]}»
      </button>
      {sync && <SyncReport result={sync} onClose={() => setSync(null)} />}

      <Section title="Tiền và người dùng">
        <SelectField
          path="months"
          label="Số tháng dự phóng"
          options={[12, 18, 24, 30, 36].map((v) => ({ value: v, label: `${v} tháng` }))}
        />
        {mode === 'installPlan' && (
          <NumberField
            path="acquisition.installsPerDay"
            label="Lượt cài UA mỗi ngày"
            hint="Từ kế hoạch install; NRU UA = lượt cài × CVR"
          />
        )}
        {mode === 'target' && (
          <NumberField
            path="acquisition.targetNruPerDay"
            label="User mới mục tiêu mỗi ngày"
            hint="Tool tính ra ngân sách cần"
          />
        )}
        {mode === 'budget' && (
          <>
            <NumberField
              path="acquisition.budgetMonth1"
              label="Ngân sách ads tháng 1"
              hint="Tháng mở game"
            />
            <NumberField
              path="acquisition.budgetMaintain"
              label="Ngân sách ads các tháng sau"
              hint="Mức duy trì mỗi tháng"
            />
            <NumberField
              path="acquisition.budgetDecay"
              label="Giảm ngân sách mỗi tháng"
              percent
              hint="Từ tháng 2 giảm dần về mức duy trì"
            />
          </>
        )}
        <NumberField
          path="acquisition.cpn"
          label="Giá 1 user mới (CPN)"
          suffix="đ"
          hint="Tiền ads để có 1 user mới"
        />
        <NumberField path="acquisition.cvr" label="Cài đặt thành user thật" percent hint="CVR" />
        <NumberField
          path="acquisition.organicRatio"
          label="User organic"
          percent
          hint="% so với NRU UA"
        />
        <NumberField
          path="costs.adsTax"
          label="Thuế ads"
          percent
          hint="Thuế GG, FB & TikTok trên tiền ads"
        />
      </Section>

      <Section title="Chất lượng người chơi">
        <SelectField
          path="revenue.model"
          label="Cách tính doanh thu"
          options={[
            { value: 'arpuCurve', label: 'Đường ARPU theo ngày' },
            { value: 'payerValue', label: 'Payrate × giá trị' },
          ]}
          hint={
            inputs.revenue.model === 'arpuCurve'
              ? 'Doanh thu/user theo tuổi (sheet Doanh thu-LTV), sửa ở mục Nâng cao'
              : 'Doanh thu vòng đời = payrate × giá trị 1 người trả tiền, rải theo retention'
          }
        />
        <NumberField path="revenue.payrate" label="Tỉ lệ trả tiền" percent hint="Payrate" />
        {inputs.revenue.model === 'payerValue' && (
          <NumberField
            path="revenue.payerLifetimeValue"
            label="Giá trị 1 người trả tiền"
            suffix="đ"
            hint="Tính cả vòng đời"
          />
        )}
      </Section>

      <Section title="Retention">
        <NumberField path="retention.d1" label="Giữ chân ngày 1 (D1)" percent />
        <NumberField path="retention.d3" label="Giữ chân ngày 3 (D3)" percent />
        <NumberField path="retention.d7" label="Giữ chân ngày 7 (D7)" percent />
        <NumberField path="retention.d14" label="Giữ chân ngày 14 (D14)" percent />
        <NumberField path="retention.d30" label="Giữ chân ngày 30 (D30)" percent />
        <NumberField path="retention.tailKeep" label="Đuôi sau D30 (giữ lại mỗi ngày)" percent />
        <NumberField
          path="retention.floor"
          label="Sàn giữ chân"
          percent
          hint="Không xuống dưới mức này"
          digits={3}
        />
      </Section>

      <Advanced title="Nâng cao: Đợt mở game">
        <ListField
          path="acquisition.launchInstallBoost"
          label="Hệ số lượt cài/NRU các ngày đầu"
          percent
          hint="Ngày 1; ngày 2; … (Excel: 250 → 130 trong 14 ngày)"
        />
        <ListField
          path="acquisition.launchMktBoost"
          label="Hệ số giá ads các ngày đầu"
          percent
          hint="Excel: 110 trong 7 ngày"
        />
        <NumberField
          path="retention.launchCohortBoost"
          label="Hệ số giữ chân nhóm user ngày OB"
          percent
          hint="Gộp cả user đăng ký trước"
        />
        <NumberField
          path="retention.launchCohortBoostCycleDays"
          label="Chu kỳ hệ số (ngày)"
          hint="Ngày 1, 121, 241… không nhân; các ngày khác nhân hệ số"
        />
        <p className="field hint" style={{ display: 'block' }}>
          Đăng ký trước (cộng vào T1, áp CPN và organic của T1):
        </p>
        <PreRegistrationEditor />
      </Advanced>

      <Advanced title="Nâng cao: Lịch theo tháng">
        <MonthlyEditor
          note="Tháng vượt quá lịch lấy giá trị tháng cuối."
          columns={[
            ...(mode === 'installPlan'
              ? [{ path: 'acquisition.installsPerDay', label: 'Cài/ngày' }]
              : []),
            ...(mode === 'target'
              ? [{ path: 'acquisition.targetNruPerDay', label: 'NRU/ngày' }]
              : []),
            { path: 'acquisition.organicRatio', label: 'Organic', percent: true },
            { path: 'acquisition.cpn', label: 'CPN' },
            { path: 'costs.iapRatio', label: 'IAP', percent: true },
          ]}
        />
      </Advanced>

      <Advanced title="Nâng cao: Doanh thu & retention">
        <ListField
          path="revenue.phaseMultipliers"
          label="Hệ số ARPU theo pha cohort"
          hint="OB; pha 2; pha 3 (Excel: 1; 0,7; 0,49)"
        />
        <ListField
          path="revenue.phaseStartDays"
          label="Ngày bắt đầu mỗi pha"
          hint="Excel: 1; 2; 8"
        />
        <ArpuCurveField />
        <NumberField path="retention.d2FromD1" label="D2 = D1 × hệ số" digits={6} />
        <NumberField path="retention.cutoffAge" label="Retention về 0 từ ngày tuổi" />
      </Advanced>

      <Advanced title="Nâng cao: Chi phí và chia sẻ">
        <NumberField path="usdVnd" label="Tỉ giá USD/VND" />
        <NumberField
          path="costs.licenseFeeUsd"
          label="Mua game (LF)"
          suffix="$"
          hint="Dồn vào T1"
        />
        <NumberField
          path="costs.minimumGuaranteeUsd"
          label="MG"
          suffix="$"
          hint="Dồn vào T1, trừ dần vào share dev"
        />
        <NumberField
          path="costs.shareRate"
          label="Tỉ lệ share dev"
          percent
          hint="Trên doanh thu đối soát"
        />
        <Toggle path="costs.includeShareDevInCost" label="Trừ share dev vào tổng chi phí" />
        <NumberField path="costs.vatRate" label="Thuế VAT" percent />
        <NumberField path="costs.iapVatBase" label="Phần IAP chịu VAT" percent />
        <NumberField path="costs.paymentFee" label="Phí cổng thanh toán" percent />
        <NumberField path="costs.nonIapRatio" label="Doanh thu (−IAP) / doanh thu" percent />
        <NumberField path="costs.ongDivisor" label="Doanh thu OnG = DT ÷" digits={4} />
        <NumberField path="costs.devIapDeduct" label="Trừ IAP khi đối soát dev" percent />
        <NumberField path="costs.devGrossUp" label="Hệ số đối soát dev" digits={4} />
      </Advanced>

      <Advanced title="Nâng cao: Chi phí cố định theo tháng">
        <MonthlyEditor
          note="T1 đã gồm chi phí các tháng trước OB. Branding, bonus, chi phí khác: tháng ngoài lịch = 0; các khoản còn lại lấy giá trị tháng cuối."
          columns={[
            { path: 'costs.fixed.branding', label: 'Branding', extendLast: false },
            { path: 'costs.fixed.community', label: 'Community' },
            { path: 'costs.fixed.server', label: 'Server' },
            { path: 'costs.fixed.staff', label: 'Nhân sự' },
            { path: 'costs.fixed.managementFee', label: 'Phí QL' },
            { path: 'costs.fixed.other', label: 'Khác', extendLast: false },
            { path: 'costs.fixed.bonus', label: 'Bonus', extendLast: false },
          ]}
        />
      </Advanced>
    </aside>
  );
}

/** Kết quả đồng bộ: NRU và tiền ads của từng chế độ so với chế độ chuẩn. */
function SyncReport({ result, onClose }: { result: SyncResult | 'empty'; onClose: () => void }) {
  if (result === 'empty') {
    return (
      <div className="sync-report" role="status">
        Chưa có user mới nào để quy đổi — kiểm tra lại lượt cài / ngân sách / mục tiêu.
      </div>
    );
  }
  const base = result.totals.find((t) => t.mode === result.from)!;
  return (
    <div className="sync-report" role="status">
      <button className="close" aria-label="Đóng" onClick={onClose}>
        ✕
      </button>
      <b>Đã đồng bộ theo «{MODE_LABELS[result.from]}»</b> (ngân sách T1 ={' '}
      {fmtMoney(result.acquisition.budgetMonth1)}, duy trì ={' '}
      {fmtMoney(result.acquisition.budgetMaintain)}/tháng; lịch NRU và lượt cài theo tháng đã cập
      nhật).
      <table className="num">
        <thead>
          <tr>
            <th>Chế độ</th>
            <th>NRU</th>
            <th>Tiền ads</th>
          </tr>
        </thead>
        <tbody>
          {result.totals.map((t) => {
            const diff = base.nru > 0 ? t.nru / base.nru - 1 : 0;
            return (
              <tr key={t.mode}>
                <td>{MODE_LABELS[t.mode]}</td>
                <td>
                  {fmtInt(t.nru)}
                  {t.mode !== result.from && (
                    <span className={Math.abs(diff) < 0.005 ? 'ok' : 'warn'}>
                      {' '}
                      {Math.abs(diff) < 0.005 ? 'khớp' : `lệch ${fmtPct(diff)}`}
                    </span>
                  )}
                </td>
                <td>{fmtMoney(t.mkt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="hint">
        Không gồm đăng ký trước (giống nhau ở mọi chế độ). Ngân sách chỉ có 3 tham số nên NRU từng
        tháng có thể lệch.
      </div>
    </div>
  );
}

/** Dán đường ARPU (mỗi giá trị một dòng, hoặc cách nhau bởi dấu chấm phẩy / tab) — vd copy cột C sheet Doanh thu-LTV. */
function ArpuCurveField() {
  const { inputs, set } = useInputs();
  const curve = inputs.revenue.arpuCurve;
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const shown = curve.map((v) => formatInput(v)).join('\n');

  return (
    <div className={`field wide${error ? ' invalid' : ''}`}>
      <label htmlFor="arpu">Đường ARPU theo ngày tuổi ({curve.length} ngày)</label>
      <textarea
        id="arpu"
        rows={5}
        value={draft ?? shown}
        onFocus={() => setDraft(shown)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const parts = (draft ?? '')
            .split(/[\n;\t]+/)
            .map((p) => p.trim())
            .filter(Boolean);
          const nums = parts.map(parseVnNumber);
          if (parts.length === 0 || nums.some((n) => n === null)) {
            setError('Có giá trị không phải số — giữ nguyên đường cũ');
          } else {
            setError(null);
            set('revenue.arpuCurve', nums);
          }
          setDraft(null);
        }}
      />
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="hint">Ngày 1 trên cùng. Dán từ Excel được.</div>
      )}
    </div>
  );
}
