# Module Dự phóng game

Trang **Dự phóng game** (menu Phân tích): chọn game ở thanh trên cùng → nhập tham số → tính lại toàn bộ mô hình theo ngày → KPI, biểu đồ, bảng, kịch bản.

| Game            | Mô hình                                     | Nguồn / đối chiếu                                                                                                                   |
| --------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **AuGo**        | `engine/` (IAP)                             | `AuGo_Master_Plan_Final.xlsx` — [`SPEC.md`](SPEC.md), [`PLAN.md`](PLAN.md)                                                          |
| **Bida 8 Pool** | `bida/engine.ts` (IAP + IAA)                | port nguyên `forecast-bida-8-pool (5).html`, có bảng so với file Excel Bida                                                         |
| **Game mới**    | `bida/engine.ts` với bộ mặc định trung tính | nhập theo đặc tả game mới (install 3 mức, CPN, CVR, doanh thu ngày đầu, retention, IAA, store, thuế/phí, share/MG, chi phí cố định) |

## Cấu trúc

```
engine/       mô hình AuGo thuần TS (acquisition, retention, cohort, revenue, costs) + presets từ Excel
bida/         mô hình kiểu Bida: engine.ts (port), retFile.ts (bảng giữ chân 240 ngày của file),
              presets.ts (Bida, Game mới, số tính sẵn của file), schema.ts (ô nhập), sync.ts (đồng bộ 2 chế độ),
              BidaForecast.tsx (giao diện theo bố cục bản HTML (5))
lib/          định dạng số VN, kiểm tra dữ liệu, đồng bộ chế độ, chia sẻ link, xuất Excel, in (AuGo)
components/   cột tham số, KPI, biểu đồ (recharts, dùng chung), bảng, kịch bản
ForecastPage.tsx   trang + thanh chọn game, được lazy-load từ src/App.tsx (PageId 'forecast')
forecast.css       mọi rule nằm trong .augo (trừ thanh chọn game .forecast-games)
```

Test: `tests/forecast/`.

- AuGo: đối chiếu từng ngày/tháng với số Excel AuGo (`excel-golden.test.ts`).
- Bida: `fixtures/bida-reference.json` sinh bằng cách chạy chính engine JS trong file HTML (5) với nhiều bộ tham số; `bida-engine.test.ts` bắt bản port ra đúng từng số (tổng, từng tháng, từng ngày).

Vercel chạy `npm test` trước `npm run build`.

## Quy tắc của mô hình Bida (khác AuGo)

- **CPN**: T1 = 100%, T2 lấy mức giữa, T3–T12 = «CPN tháng 3 còn lại», từ T13 = «Sàn CPN».
- **IAA** = DAU × lượt xem ads × eCPM × tỉ giá / 1000 — không chịu VAT, không chia share dev.
- Tháng 1 gồm các ngày chạy trước OB; chi phí trước khi mở game và MG dồn vào tháng 1.
- «Marketing mỗi tháng» và «Chi phí khác mỗi tháng» là phần mở rộng cho game mới (Bida = 0).

## Tích hợp với task-dashboard

- Màu riêng (Theo máy / Sáng / Tối) của view AuGo, đặt bằng `data-theme` trên `div.augo`, không đụng `<html>`.
- Link chia sẻ `#s=…` và `?print` mở thẳng view AuGo (effect trong `AppContent`, `src/App.tsx`); vẫn phải đăng nhập.
- Xuất PDF (AuGo): nút "Xuất PDF" — `@media print` ẩn sidebar của host, `@page` không header/footer.
- Lưu trên trình duyệt (localStorage): AuGo `augo-dashboard:*`; Bida / Game mới `forecast:<game>:inputs|scenarios`; game đang chọn `forecast:game`.

## Cập nhật khi file Excel AuGo thay đổi

```bash
cd task-dashboard
python scripts/forecast/extract_excel.py "<đường dẫn>/AuGo_Master_Plan_Final.xlsx"   # cần openpyxl
npm test
```

## Cập nhật khi file HTML Bida thay đổi

Port lại thay đổi vào `bida/engine.ts`, rồi sinh lại fixture từ engine JS của file mới và chạy `npm test`:

```bash
cd task-dashboard
node scripts/forecast/gen_bida_reference.cjs "<đường dẫn>/forecast-bida-8-pool (5).html"
npm test
```
