import { describe, expect, it } from 'vitest';
import { simulate, type Inputs } from '../../src/modules/forecast/engine';
import { monthlyBudget } from '../../src/modules/forecast/engine/acquisition';
import { excelOriginal } from '../../src/modules/forecast/engine/presets';
import { dailyActiveUsers } from '../../src/modules/forecast/engine/cohort';
import { retentionCurve } from '../../src/modules/forecast/engine/retention';

const clone = (i: Inputs): Inputs => structuredClone(i);

describe('chế độ nhập', () => {
  it('theo mục tiêu user và theo ngân sách cho cùng kết quả khi ngân sách = NRU × CPN', () => {
    const target = clone(excelOriginal);
    target.months = 12;
    target.acquisition.mode = 'target';
    target.acquisition.targetNruPerDay = [1500];
    target.acquisition.cpn = [24000];
    target.acquisition.launchInstallBoost = [];
    target.acquisition.launchMktBoost = [];

    const budget = clone(target);
    budget.acquisition.mode = 'budget';
    budget.acquisition.budgetMonth1 = 1500 * 24000 * 30;
    budget.acquisition.budgetMaintain = 1500 * 24000 * 30;
    budget.acquisition.budgetDecay = 0.5;

    const a = simulate(target);
    const b = simulate(budget);
    a.monthly.forEach((m, i) => {
      expect(b.monthly[i].nru).toBeCloseTo(m.nru, 4);
      expect(b.monthly[i].mkt).toBeCloseTo(m.mkt, 2);
      expect(b.monthly[i].profit).toBeCloseTo(m.profit, 0);
    });
  });

  it('ngân sách giảm dần từ T2 về mức duy trì', () => {
    const a = {
      ...excelOriginal.acquisition,
      budgetMonth1: 1000,
      budgetMaintain: 200,
      budgetDecay: 0.5,
    };
    expect([1, 2, 3, 4].map((m) => monthlyBudget(a, m))).toEqual([1000, 600, 400, 300]);
  });

  it('NRU UA = NRU / (1 + organic), lượt cài = NRU UA / CVR', () => {
    const i = clone(excelOriginal);
    i.months = 1;
    i.acquisition.mode = 'target';
    i.acquisition.targetNruPerDay = [1300];
    i.acquisition.organicRatio = [0.3];
    i.acquisition.launchInstallBoost = [];
    const d = simulate(i).daily[10];
    expect(d.nruUa).toBeCloseTo(1000);
    expect(d.installUa).toBeCloseTo(1000 / i.acquisition.cvr);
  });
});

describe('retention', () => {
  it('không xuống dưới sàn và bằng 0 từ cutoffAge', () => {
    const r = { ...excelOriginal.retention, floor: 0.004, cutoffAge: 400 };
    const c = retentionCurve(r, 500);
    expect(Math.min(...c.slice(1, 400))).toBeCloseTo(0.004);
    expect(c[400]).toBe(0);
  });
});

describe('hệ số cohort ngày OB', () => {
  it('lặp theo chu kỳ 120 ngày: ngày 1, 121, 241 không nhân, còn lại ×1.2', () => {
    const r = {
      ...excelOriginal.retention,
      cutoffAge: 1000,
      launchCohortBoost: 1.2,
      launchCohortBoostCycleDays: 120,
    };
    const size = [1000, ...new Array(299).fill(0)];
    const dau = dailyActiveUsers(size, new Array(300).fill(1), r);
    expect([1, 2, 120, 121, 122, 240, 241, 242].map((d) => dau[d - 1])).toEqual([
      1000, 1200, 1200, 1000, 1200, 1200, 1000, 1200,
    ]);
  });
});

describe('doanh thu theo người trả tiền', () => {
  it('tổng doanh thu vòng đời của 1 cohort = NRU × payrate × giá trị 1 người trả tiền', () => {
    const i = clone(excelOriginal);
    i.months = 12;
    i.acquisition.mode = 'target';
    i.acquisition.targetNruPerDay = [1000, 0];
    i.acquisition.launchInstallBoost = [];
    i.acquisition.preRegistration = [];
    i.revenue.model = 'payerValue';
    i.revenue.payrate = 0.037;
    i.revenue.payerLifetimeValue = 210_811;
    const total = simulate(i).summary.revenue;
    // 30 cohort × 1000 user, cutoff 240 ngày nằm gọn trong 360 ngày dự phóng
    expect(total).toBeCloseTo(30 * 1000 * 0.037 * 210_811, 0);
  });
});

describe('chi phí', () => {
  it('LF và MG dồn vào T1, share dev chỉ trả phần vượt MG', () => {
    const r = simulate(excelOriginal);
    const rate = excelOriginal.usdVnd;
    expect(r.monthly[0].licenseFee).toBe(excelOriginal.costs.licenseFeeUsd * rate);
    expect(r.monthly[0].minimumGuarantee).toBe(excelOriginal.costs.minimumGuaranteeUsd * rate);
    expect(r.monthly.slice(1).every((m) => m.licenseFee === 0 && m.minimumGuarantee === 0)).toBe(
      true,
    );
    const paid = r.monthly.reduce((s, m) => s + m.shareDevAfterMg, 0);
    const share = r.monthly.reduce((s, m) => s + m.shareDev, 0);
    expect(paid).toBeCloseTo(share - excelOriginal.costs.minimumGuaranteeUsd * rate, 0);
  });

  it('tắt "trừ share dev vào chi phí" làm tăng lợi nhuận đúng bằng phần share đã trả', () => {
    const off = clone(excelOriginal);
    off.costs.includeShareDevInCost = false;
    const a = simulate(excelOriginal).summary;
    const b = simulate(off).summary;
    expect(b.profit - a.profit).toBeCloseTo(a.shareDevPaid, 0);
  });

  it('thuế ads là tham số: tăng 1% → chi phí tăng đúng 1% tiền ads', () => {
    const hi = clone(excelOriginal);
    hi.costs.adsTax = excelOriginal.costs.adsTax + 0.01;
    const a = simulate(excelOriginal).summary;
    const b = simulate(hi).summary;
    expect(b.totalSpent - a.totalSpent).toBeCloseTo(a.mkt * 0.01, 0);
  });

  it('share dev = doanh thu đối soát × tỉ lệ, không có bậc ngưỡng', () => {
    const r = simulate(excelOriginal);
    r.monthly.forEach((m) =>
      expect(m.shareDev).toBeCloseTo(m.revenueDev * excelOriginal.costs.shareRate, 4),
    );
  });

  it('chạy 36 tháng dưới 200 ms', () => {
    const i = clone(excelOriginal);
    i.months = 36;
    const t = performance.now();
    simulate(i);
    expect(performance.now() - t).toBeLessThan(200);
  });
});
