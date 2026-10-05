# Module Dự phóng AuGo

Trang **Dự phóng AuGo** (menu Phân tích): nhập tham số → tính lại toàn bộ mô hình theo ngày → KPI, biểu đồ, bảng P&L, kịch bản.
Thay file `AuGo_Master_Plan_Final.xlsx`. Chuyển từ repo `Dashboard tool` (tag `pre-integration`); công thức chi tiết: [`SPEC.md`](SPEC.md), kế hoạch & quyết định: [`PLAN.md`](PLAN.md).

## Cấu trúc

```
engine/       mô hình thuần TS (acquisition, retention, cohort, revenue, costs) + presets từ Excel
lib/          định dạng số VN, kiểm tra dữ liệu, đồng bộ chế độ, chia sẻ link, xuất Excel, in
components/   cột tham số, KPI, biểu đồ (recharts), bảng, kịch bản
ForecastPage.tsx   trang, được lazy-load từ src/App.tsx (PageId 'forecast')
forecast.css       mọi rule nằm trong .augo — không đè lên CSS của task-dashboard
```

Test: `tests/forecast/` (gồm đối chiếu từng ngày/tháng với số Excel). Vercel chạy `npm test` trước `npm run build`.

## Tích hợp với task-dashboard

- Màu riêng của AuGo (Theo máy / Sáng / Tối), đặt bằng `data-theme` trên `div.augo`, không đụng `<html>`.
- Link chia sẻ `#s=…` và `?print` mở thẳng trang này (effect trong `AppContent`, `src/App.tsx`); vẫn phải đăng nhập.
- Xuất PDF: nút "Xuất PDF" — `@media print` ẩn sidebar của host, `@page` không header/footer.
- Kịch bản và tham số đang nhập lưu localStorage trên trình duyệt (`augo-dashboard:*`).

## Cập nhật khi file Excel thay đổi

```bash
cd task-dashboard
python scripts/forecast/extract_excel.py "<đường dẫn>/AuGo_Master_Plan_Final.xlsx"   # cần openpyxl
npm test
```
