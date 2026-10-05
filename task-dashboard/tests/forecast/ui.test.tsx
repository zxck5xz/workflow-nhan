import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InputsContext } from '../../src/modules/forecast/components/inputsContext';
import { Sidebar } from '../../src/modules/forecast/components/Sidebar';
import { KpiGrid, NoteBanner } from '../../src/modules/forecast/components/Summary';
import { Tables } from '../../src/modules/forecast/components/Tables';
import { simulate, type AcquisitionMode } from '../../src/modules/forecast/engine';
import { excelOriginal } from '../../src/modules/forecast/engine/presets';
import { validate } from '../../src/modules/forecast/lib/validate';

describe('render giao diện (smoke test)', () => {
  it.each(['installPlan', 'budget', 'target'] as AcquisitionMode[])(
    'cột nhập liệu ở chế độ %s',
    (mode) => {
      const inputs = { ...excelOriginal, acquisition: { ...excelOriginal.acquisition, mode } };
      const html = renderToString(
        <InputsContext.Provider value={{ inputs, set: () => {}, issues: validate(inputs) }}>
          <Sidebar onPreset={() => {}} />
        </InputsContext.Provider>,
      );
      expect(html).toContain('Thuế ads');
      expect(html).toContain('Giữ chân ngày 30 (D30)');
      // bảng lịch theo tháng có đủ số dòng tháng
      expect(html).toMatch(new RegExp(`>T(<!-- -->)?${inputs.months}<`));
      if (mode === 'budget') expect(html).toContain('Ngân sách ads tháng 1');
      if (mode === 'target') expect(html).toContain('User mới mục tiêu mỗi ngày');
    },
  );

  it('KPI, banner và bảng', () => {
    const r = simulate(excelOriginal);
    const html = renderToString(
      <>
        <KpiGrid s={r.summary} inputs={excelOriginal} />
        <NoteBanner s={r.summary} sameAsExcel />
        <Tables result={r} />
      </>,
    );
    expect(html).toContain('Tháng 12');
    expect(html).toContain('So với số tính sẵn trong file');
    expect(html).toContain('T24');
  });
});
