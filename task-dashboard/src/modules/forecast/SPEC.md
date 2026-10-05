# SPEC – Công thức mô hình (engine `src/modules/forecast/engine`)

Nguồn: sheet `Forecast` + `Doanh thu-LTV` của `AuGo_Master_Plan_Final.xlsx`, đã áp dụng các quyết định trong `PLAN.md` mục 2.
Tham số mặc định: `src/modules/forecast/engine/presets/excel-original.json` (sinh bởi `scripts/forecast/extract_excel.py`).
Đường dẫn tính từ thư mục `task-dashboard`.

Quy ước: ngày 1 = OB, tháng = 30 ngày (T1 = ngày 1–30). `⌊x⌋` = ROUNDDOWN. Mảng "theo tháng" thiếu tháng thì lấy giá trị cuối.

## 1. Thu hút user (`acquisition.ts`)

**Đăng ký trước (OB-5 → OB-1)**, mỗi ngày: `UA = ⌊install × CVR⌋`, `NRU = UA × (1 + organic_T1) × conversion`, `ads = NRU × CPN_T1 × mktFactor`. Toàn bộ cộng vào T1 và gộp vào cohort ngày OB.

| Chế độ                        | Ngày d, tháng m                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `installPlan` (Excel)         | `install = installsPerDay_m × launchInstallBoost_d`; `UA = ⌊install × CVR⌋`; `organic = UA × organic_m`; `NRU = UA + organic`; `ads = NRU × CPN_m × launchMktBoost_d` |
| `target` (theo mục tiêu user) | `NRU = target_m × launchInstallBoost_d`; `ads = NRU × CPN_m × launchMktBoost_d`                                                                                       |
| `budget` (theo ngân sách)     | `budget_1 = budgetMonth1`, `budget_m = maintain + (budget_{m−1} − maintain) × (1 − decay)`; `ads = budget_m / 30`; `NRU = ads / (CPN_m × launchMktBoost_d)`           |

Ở `target`/`budget`: `UA = NRU / (1 + organic_m)`, `install = UA / CVR`.

## 2. Retention (`retention.ts`)

`R(0)=1, R(1)=D1, R(2)=D1×d2FromD1 (2/3), R(3)=D3, R(7)=D7, R(14)=D14, R(30)=D30`.
Giữa hai mốc lo → hi: `R = lo − (lo − hi) × w`, với w:

- D3→D7: 0.4, 0.6, 0.8
- D7→D14: 0.3, 0.5, 0.6, 0.7, 0.8, 0.9
- D14→D30: 0.1, 0.2, 0.3, 0.35 … 0.9 (bước 0.05)

Sau D30: `R(d) = R(d−1) × tailKeep (0.98)`; `R ≥ floor`; `R = 0` từ `cutoffAge` (240).

## 3. DAU (`cohort.ts`)

`DAU_t = Σ_{c≤t} ⌊NRU_c × R(t−c) × k⌋`, `k = launchCohortBoost (1.2)` cho cohort ngày OB (đã gộp đăng ký trước) theo chu kỳ `launchCohortBoostCycleDays` = 120 ngày: ngày 1, 121, 241… k = 1, các ngày còn lại k = 1.2 (Excel gốc chỉ nhân ngày 2–120). Cohort khác k = 1. `DAU_1 = NRU cohort OB`. `PU = ⌊DAU × payrate⌋`.

## 4. Doanh thu theo ngày (`revenue.ts`)

`Rev_t = Σ_{c≤t} NRU_c × perUser_c(t − c)`

- `arpuCurve`: `perUser_c(a) = arpuCurve[a] × phase(c)`; phase = 1 (OB + đăng ký trước), 0.7 (ngày 2–7), 0.49 (ngày ≥ 8). Đường ARPU 365 ngày lấy từ cột C sheet LTV.
- `payerValue`: `perUser(a) = payrate × payerLifetimeValue × R(a) / ΣR`.

LTV365 = doanh thu 365 ngày đầu / user, bình quân theo cơ cấu cohort.

## 5. P&L theo tháng (`costs.ts`)

| Dòng              | Công thức                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| Doanh thu thực tế | Σ Rev ngày trong tháng (sửa lỗi Excel H12: chỉ cột K)                                                  |
| IAP               | DT × iapRatio_m (20%, 15%, 10%…)                                                                       |
| DT (−IAP)         | DT × 0.8                                                                                               |
| DT OnG            | ⌊DT / 1.17⌋                                                                                            |
| DT đối soát dev   | (OnG − IAP × 0.7) × 1.0588 + IAP                                                                       |
| VAT               | (X − X/1.1) với X = DT(−IAP), cộng (Y − Y/1.1) với Y = IAP × 85%                                       |
| Cổng thanh toán   | DT × 5.5%                                                                                              |
| MKT               | Σ tiền ads (T1 gồm cả đăng ký trước)                                                                   |
| Thuế ads          | MKT × `adsTax` – tham số nhập trên UI, mặc định 7%                                                     |
| Share dev         | đối soát × 20% (không có bậc theo ngưỡng doanh thu)                                                    |
| Share dev sau MG  | max(0, Σshare đến tháng m − ΣMG đến tháng m − Σđã trả trước đó)                                        |
| LF, MG            | $150k × tỉ giá, **toàn bộ ở T1**                                                                       |
| Cố định           | branding, community, bonus, server, nhân sự, khác, phí quản lý theo tháng; chi phí T-4…T-1 cộng vào T1 |
| Tổng chi phí      | VAT + cổng TT + MKT + thuế ads + LF + MG + share sau MG (nếu bật) + cố định                            |
| Lợi nhuận         | DT − tổng chi phí                                                                                      |
| Lũy Kế            | Σ lợi nhuận đến tháng m                                                                                |

## 6. KPI

NRU, DAU cao nhất, doanh thu, tổng chi phí, lợi nhuận (biên = LN/DT), hoàn vốn = tháng đầu tiên lũy kế ≥ 0, tiền ads, giá 1 lượt cài = ads / lượt cài, LTV365 / CPN bình quân, share dev phải trả = Σ share sau MG, chi phí một lần = LF + MG + branding + khác, LN / tổng chi phí (ô B35).

## 7. Đối chiếu

`tests/forecast/excel-golden.test.ts`: retention, 7 chỉ số theo ngày × 720 ngày, 16 dòng theo tháng × 24 tháng, KPI tổng – khớp Excel với sai số tương đối < 1e-6, sau khi điều chỉnh: chi phí trước OB dồn vào T1, thuế ads T24 = 7%.
