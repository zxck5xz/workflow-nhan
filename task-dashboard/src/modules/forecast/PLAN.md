# Plan: Web tool dự phóng tài chính game (AuGo Dashboard)

> Kế hoạch gốc khi tool còn là repo riêng `Dashboard tool` (thư mục `web/`). Từ 2026-10-05 tool là module của task-dashboard — xem mục 7.
> Đổi đường dẫn: `web/src/*` → `src/modules/forecast/*`, `web/tests/*` → `tests/forecast/*`, `scripts/extract_excel.py` → `scripts/forecast/extract_excel.py`.

> Nguồn: `AuGo_Master_Plan_Final.xlsx` (5 sheet) + 3 ảnh layout trong thư mục.
> Mục tiêu: thay file Excel bằng một web tool nhập tham số → tính lại toàn bộ mô hình theo ngày → hiển thị KPI, biểu đồ, bảng tháng, lưu/so sánh kịch bản.

---

## 1. Hiểu đặc tả

### 1.1 Các sheet trong Excel

| Sheet                                               | Vai trò                                                                                                                                                | Ghi chú                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `Forecast`                                          | Mô hình chính: P&L theo tháng (T-4 → T24) + bảng mô phỏng theo ngày (row 54+) + ma trận cohort DAU (cột P → ABG)                                       | Đây là sheet cần port              |
| `Doanh thu-LTV`                                     | Đường ARPU theo ngày tuổi user (D1, D2, …), 3 pha: OB-5→OB, OB+1→OB+6 (×70%), OB+7 trở đi (×70% tiếp) → doanh thu ngày = Σ NRU cohort × ARPU theo tuổi | Nguồn cột `Daily REV` của Forecast |
| `Sheet1`                                            | Các bộ "LTV biến động" (đường ARPU thay thế, ×80%)                                                                                                     | Dùng làm preset                    |
| `Forecast_LTV_Best_case`, `Doanh thu-KPI_Best_case` | Kịch bản best case (cấu trúc giống, tham số khác: payrate 6%, R1 35%, CPN 2.3$…)                                                                       | Dùng làm preset kịch bản           |

### 1.2 Luồng tính (theo Forecast)

**Đầu vào theo ngày**

- `Install UA` (theo tháng, có hệ số tăng tuần đầu: 250%, 230%, 200%…) → `NRU UA = ROUNDDOWN(Install × CVR)` (CVR 80%)
- `Organic = NRU UA × % organic tháng` → `NRU = UA + Organic`
- Đăng ký trước OB-5 → OB-1 với tỉ lệ 50–80%
- `MKT Spend = NRU × CPN tháng` (CPN = hệ số $ × tỉ giá, có ×110% tuần đầu)

**Retention / DAU**

- Mốc R1, R3, R7, R14, R30 → nội suy tuyến tính giữa các mốc, sau D30 giảm 2%/ngày (về 0 ở ~D400)
- `DAU ngày t = Σ cohort NRU(c) × R(t − c)` (ma trận tam giác; cohort pre-register × 120%)
- `PU = DAU × payrate`, `ARPPU = Daily REV / PU`

**P&L theo tháng**

- Doanh thu thực tế = Σ Daily REV trong tháng; IAP = 20% / 15% / 10%; Doanh thu (-IAP) = 80%
- Doanh thu OnG = DT / 117%; Doanh thu đối soát Dev = (OnG − IAP×70%) × 105.88% + IAP
- Chi phí: VAT, cổng thanh toán 5.5%, MKT, thuế ads 7%, branding, community, server, nhân sự, chi phí khác, phí quản lý
- Share Dev 20% có bậc theo ngưỡng doanh thu $1M; **Share Dev sau khi trừ MG** (bù trừ lũy kế với MG đã ứng)
- Chi phí một lần: LF $150k, MG $150k → dồn vào T1 (Excel rải T-4 → T1)
- Lợi nhuận = DT − Total Spent; Lũy kế; tháng hoàn vốn

### 1.3 Layout (theo 3 ảnh)

```
┌──────────────┬──────────────────────────────────────────────────────┐
│ SIDEBAR      │ KPI hàng 1: NRU · DAU cao nhất · Doanh thu ·          │
│ [Theo ngân   │   Tổng chi phí · Lợi nhuận (biên %) · Hoàn vốn tháng │
│  sách ads |  │ KPI hàng 2: Tiền ads · Giá 1 lượt cài · LTV365/CPN ·  │
│  Theo mục    │   Share dev phải trả · Chi phí một lần               │
│  tiêu user]  │ Banner ghi chú: khác biệt so với Excel gốc + so sánh │
│              │   số tính sẵn trong file                             │
│ Tiền & user  │ Chart 1: Doanh thu vs chi phí theo tháng (cột đôi)   │
│ Chất lượng   │ Chart 2: Lợi nhuận lũy kế + vạch hoàn vốn            │
│ Retention    │ Chart 3: Người dùng theo ngày (DAU + NRU)            │
│ ▸ Nâng cao:  │ Bảng theo tháng: Tháng · Tiền ads · NRU · DAU BQ ·   │
│   chi phí &  │   Doanh thu · Chi phí · Lợi nhuận · Lũy kế           │
│   chia sẻ    │   (đỏ = lỗ, xanh = tháng hoàn vốn)                   │
│              │ Kịch bản đã lưu: lưu / tải / xoá / so sánh           │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Hai chế độ nhập**

- _Theo ngân sách ads_: ngân sách tháng 1, ngân sách các tháng sau, CPN, % giảm ngân sách mỗi tháng (từ T2 giảm dần về mức duy trì), CVR → tool tính ra NRU
- _Theo mục tiêu user_: NRU mục tiêu/ngày, CPN, CVR → tool tính ra ngân sách cần

**Tham số chung**: số tháng dự phóng (12/24/36), payrate, giá trị 1 người trả tiền (lifetime), D1/D3/D7/D14/D30, đuôi sau D30 (giữ lại %/ngày), sàn retention.
**Tiền & user** có thêm trường **Thuế ads (%)** (mặc định 7%).
**Nâng cao**: LF, MG, tỉ lệ share dev, có trừ share dev vào chi phí hay không, VAT, phí cổng TT, thuế ads, IAP %, branding/community/server/nhân sự/khác theo tháng, tỉ giá.

---

## 2. Quyết định đã chốt (2026-10-05)

| #   | Vấn đề                             | Quyết định                                                                                     |
| --- | ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Mô hình doanh thu                  | Hỗ trợ **cả hai**: đường ARPU theo tuổi user (như Excel) và payrate × giá trị 1 người trả tiền |
| 2   | Share Dev                          | **Có trừ** vào tổng chi phí (phần share sau khi bù trừ MG – đúng như Excel đang làm)           |
| 3   | Chi phí một lần                    | **Dồn hết vào T1** (LF, MG và toàn bộ chi phí các tháng T-4 → T-1)                             |
| 4   | Lỗi file gốc                       | Doanh thu T2 dùng `SUM(K89:K118)` (bỏ cột payrate); dòng "Lũy Kế" giữ nguyên nhãn              |
| 5   | Hệ số 120%, tăng install tuần đầu… | Là **tham số chỉnh được**                                                                      |
| –   | Trục X "Người dùng theo ngày"      | Hiển thị ngày thực tế trong tháng **1 → 30** (thay cho `TNaN`)                                 |

Phát hiện thêm khi đối chiếu (cần xác nhận):

- `Forecast!AD20` (thuế ads T24) = **5%**, các tháng khác 7% → tool coi là gõ nhầm, dùng 7% mọi tháng (T24 chênh +35,6 tr chi phí).
- ~~Share dev bậc trên ngưỡng $1M~~ → **không có ngưỡng** (xác nhận 2026-10-05): share dev = đối soát × 20%.
- Thuế ads: là **trường nhập tham số** trên sidebar (mặc định 7%), không hard-code.
- Hệ số 120% cohort ngày OB: **chu kỳ 120 ngày lặp lại** (ngày 1, 121, 241… không nhân; còn lại ×1.2). Excel gốc chỉ nhân ngày 2–120 → DAU ngày 122–240 cao hơn Excel.

Công thức chi tiết: xem `SPEC.md`.

---

## 3. Kiến trúc

| Lớp          | Lựa chọn                                                          | Lý do                                          |
| ------------ | ----------------------------------------------------------------- | ---------------------------------------------- |
| Framework    | Vite + React + TypeScript                                         | Tool tính toán thuần client, không cần backend |
| UI           | CSS thuần với biến màu (sáng/tối)                                 | Ít phụ thuộc, đủ cho layout                    |
| Chart        | Recharts (hoặc ECharts nếu cần >700 điểm ngày mượt)               | Cột đôi, line + reference line                 |
| State        | React state + `useDeferredValue`                                  | Input → engine → output, tính lại tức thì      |
| Lưu kịch bản | localStorage + chia sẻ qua link (tham số nén trong URL)           | Supabase/DB nếu sau này cần lưu chung cho team |
| Export       | SheetJS (`xlsx`) xuất bảng tháng/ngày; in PDF không header/footer | Theo rule AGENTS.md                            |
| Test         | Vitest                                                            | Golden test so với số Excel                    |
| Deploy       | Vercel / static hosting                                           |                                                |

```
src/
  engine/              # thuần TS, không phụ thuộc React
    types.ts           # Inputs, DailyRow, MonthlyRow, Summary
    defaults.ts        # preset: Excel gốc, Best case, layout mẫu
    retention.ts       # nội suy R(d), đuôi, sàn
    acquisition.ts     # 2 chế độ: budget → NRU, target → budget
    cohort.ts          # DAU = convolution NRU × R
    revenue.ts         # payrate×LTV hoặc ARPU curve
    costs.ts           # VAT, gateway, ads tax, share dev bậc, LF/MG, fixed
    aggregate.ts       # ngày → tháng, lũy kế, hoàn vốn, KPI
    index.ts           # simulate(inputs): Result
  components/
    Sidebar/ (ModeTabs, MoneyUserSection, QualitySection, RetentionSection, AdvancedSection)
    KpiGrid, NoteBanner, RevenueCostChart, CumulativeProfitChart, DailyUsersChart,
    MonthlyTable, ScenarioPanel
  lib/format.ts        # "52,22 tỷ", "-67,6 tr", "23.040 đ" (vi-VN)
  store.ts
```

**Hiệu năng**: 36 tháng ≈ 1.100 ngày → convolution O(n²) ≈ 1,2 triệu phép tính, < 10 ms. Không cần Web Worker; debounce input 150 ms là đủ.

---

## 4. Các bước triển khai

### Phase 0 – Chốt đặc tả (0.5–1 ngày) ✅

- [x] Trích toàn bộ tham số + công thức Excel ra `SPEC.md` (script Python openpyxl)
- [x] Xuất "golden numbers" từ Excel: NRU, DAU, DT, chi phí, lợi nhuận theo tháng → `web/tests/fixtures/excel-forecast.json` (script `scripts/extract_excel.py`)
- [x] Trả lời 5 câu hỏi ở mục 2 với người phụ trách

### Phase 1 – Engine tính toán (2–3 ngày) ✅ — `web/src/engine`, 32 test pass

- [x] `retention.ts` + test (nội suy đúng các mốc, đuôi, sàn)
- [x] `acquisition.ts` cả 2 chế độ + pre-register OB-5→OB-1
- [x] `cohort.ts` DAU
- [x] `revenue.ts` 2 mô hình doanh thu
- [x] `costs.ts` đủ các dòng chi phí, share dev bậc + bù MG
- [x] `aggregate.ts` tháng, lũy kế, tháng hoàn vốn, LTV365, CPN thực
- [x] **Golden test**: preset "Excel gốc" khớp `excel_forecast.json` (sai số < 0.1%, hoặc ghi rõ chênh lệch do sửa lỗi file gốc)

### Phase 2 – UI khung + sidebar (2 ngày) ✅

- [x] Layout 2 cột, sidebar sticky có scroll riêng, responsive (sidebar thành drawer trên mobile)
- [x] Tabs chế độ; các section input; "Nâng cao" thu gọn
- [x] Validate input (số âm, % > 100, D3 > D1…), định dạng số VN khi gõ

### Phase 3 – Output (2–3 ngày) ✅

- [x] KPI grid 2 hàng (màu: xanh dương NRU, xanh lá DT/lợi nhuận dương, đỏ chi phí, tím hoàn vốn, cam share dev)
- [x] Banner ghi chú khác biệt + so sánh với số tính sẵn trong Excel
- [x] Chart doanh thu vs chi phí theo tháng (tooltip đủ số)
- [x] Chart lợi nhuận lũy kế + vạch "hoàn vốn Tx"
- [x] Chart DAU/NRU theo ngày: chọn tháng, trục X = ngày 1 → 30 của tháng (bỏ lỗi `TNaN`); chế độ "tất cả" có vạch chia tháng
- [x] Bảng tháng: header sticky, đỏ tháng lỗ, highlight tháng hoàn vốn, dòng tổng; tab xem chi tiết theo ngày

### Phase 4 – Kịch bản & xuất file (1–2 ngày) ✅

- [x] Lưu/tải/xoá kịch bản (localStorage), preset Excel gốc / Best case
- [x] So sánh 2–3 kịch bản (bảng + chart chồng lũy kế)
- [x] Share qua URL (encode input vào query string)
- [x] Export Excel (tháng + ngày), Export PDF (Chrome `--print-to-pdf-no-header` / `@page` không header-footer)

### Phase 5 – Hoàn thiện & deploy (1 ngày) ✅

- [x] Dark mode (Theo máy / Sáng / Tối), a11y cơ bản, kiểm tra mobile
- [x] README cách dùng + giải thích công thức (tooltip "?" cạnh từng input)
- [x] Deploy Vercel (auto deploy từ GitHub, test chặn build): https://augo-dashboard-tool.vercel.app

**Tổng ước tính: 9–12 ngày công.**

---

## 5. Tiêu chí nghiệm thu

1. Preset "Excel gốc" ra số khớp file Excel (hoặc có giải thích từng chênh lệch).
2. Đổi bất kỳ input → toàn bộ KPI/chart/bảng cập nhật < 200 ms.
3. Hai chế độ (ngân sách / mục tiêu user) cho kết quả nhất quán: nhập ngân sách → ra NRU X; nhập NRU X → ra lại ngân sách đó.
4. Kịch bản lưu lại được sau khi reload; xuất Excel/PDF đúng số, PDF không header/footer.
5. Không còn nhãn `TNaN`, số định dạng kiểu VN (tỷ / tr / đ).

## 6. Rủi ro

| Rủi ro                                                             | Giảm thiểu                                          |
| ------------------------------------------------------------------ | --------------------------------------------------- |
| Hiểu sai công thức Excel → số lệch                                 | Golden test + Phase 0 chốt với người làm file       |
| Người dùng tin số của tool hơn số Excel (vì tool sửa lỗi file gốc) | Banner ghi rõ khác biệt, toggle "giữ hành vi Excel" |
| Tham số quá nhiều làm rối                                          | Mặc định gọn, gom vào "Nâng cao"                    |

---

## 7. Tích hợp vào task-dashboard (2026-10-05) ✅

| #   | Vấn đề     | Quyết định                                                                                                                                                     |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Repo chính | **task-dashboard** (repo `workflow-nhan`); repo `Dashboard tool` chỉ lưu trữ, mốc chuyển = tag `pre-integration`                                               |
| 2   | Đăng nhập  | **Bắt buộc** như các trang khác; link chia sẻ `#s=…` mở thẳng trang Dự phóng AuGo sau khi login                                                                |
| 3   | Giao diện  | **Giữ màu riêng AuGo** (Theo máy / Sáng / Tối), mọi CSS nằm trong `.augo`                                                                                      |
| 4   | Thứ tự     | Hoàn tất phần học từ tool Bida 8 Pool (đồng bộ 3 chế độ, gõ tiền tắt, nhớ tham số, KPI thuế & phí / chi phí cố định, bảng so sánh % lệch) **trước** khi chuyển |

Đã làm: trang lazy-load (`PageId 'forecast'`), recharts/xlsx chỉ tải khi mở trang, in PDF ẩn sidebar host, Vercel chạy `npm test` trước build, script trích Excel chuyển sang `scripts/forecast/`.

Còn lại:

- [ ] Thu hồi GitHub token trong `git remote`, push branch `feat/augo-forecast`, tạo PR (branch được tạo từ `migrate_BE_to_CloudflareWorker`)
- [ ] Thử với đăng nhập thật + backend chạy (lúc tích hợp chỉ test bằng session giả)
- [ ] Kiểm tra giao diện mobile trong khung task-dashboard
- [ ] (Tuỳ chọn) Lưu kịch bản lên API Worker theo user thay vì localStorage
- [ ] (Tuỳ chọn) Gỡ / chuyển hướng Vercel project `augo-dashboard-tool`
