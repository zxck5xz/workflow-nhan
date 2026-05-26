# Tài liệu Chuẩn bị Workflow Chủ đạo

Tài liệu này dùng để chuẩn bị và quản lý quá trình thiết kế các workflow. Cấu trúc được thiết kế để có thể tái sử dụng cho bất kỳ quy trình công việc nào.

## 📋 Trạng thái hiện tại
- **Dự án:** Thiết kế 3 Workflow (Quản lý, Test/Phân tích, Portfolio/Trình bày)
- **Tiến độ:** Giai đoạn 3 - Xây dựng Workflow 1: Task Management Dashboard
- **Ngày khởi tạo:** 2026-05-11
- **Cập nhật cuối:** 2026-05-13

---

## 🏗️ Giai đoạn 1: Thu thập bối cảnh
*Mục tiêu: Hiểu rõ môi trường và nhu cầu thực tế để thiết kế không bị xa rời thực tế.*

- [x] **1.1. Công cụ vận hành (Stack):** Slack (giao tiếp), Jira (đề xuất quản lý task & bug).
- [x] **1.2. Đối tượng sản phẩm:** Game & Mobile Game.
- [x] **1.3. Nhân sự & vai trò:** Team 5 người.
- [x] **1.4. Điểm đau:** Cần test số lượng lớn game và đưa ra đánh giá tổng hợp nhanh, hiệu quả.
- [x] **1.5. Công cụ hỗ trợ & hạ tầng:**
    - **IDE:** VS Code (Remote SSH / Codespaces).
    - **AI Models:** Claude 3.5 (Phân tích), Gemini 1.5 Pro (Đánh giá video/game), GPT-4o (Tự động hóa).
    - **Remote Access:** Cloud-first (Jira Cloud, Slack, GitHub, Tailscale nếu cần truy cập máy local).

## ⚙️ Giai đoạn 2: Thiết kế kiến trúc hệ thống
*Mục tiêu: Xây dựng logic kết nối giữa các workflow.*

- [x] **2.1. Luồng dữ liệu:** Jira (Task list) -> Slack (Thông báo) -> Portfolio (Báo cáo cuối).
- [x] **2.2. Trạng thái:** Backlog -> In Testing -> Evaluating -> Reporting -> Done.
- [ ] **2.3. Tự động hóa:** Kết nối Jira-Slack, dùng AI tổng hợp báo cáo từ checklist.

## ✍️ Giai đoạn 3: Chi tiết hóa 3 workflow mục tiêu
*Mục tiêu: Hoàn thiện template và hướng dẫn cho từng mục.*

### Workflow 1: Quản lý (cá nhân & team)
- [x] Sử dụng Jira Kanban Board.
- [x] Định nghĩa hệ thống ưu tiên: P0 (Hot/Đối thủ), P1 (Yêu cầu dự án), P2 (Nghiên cứu).
- [x] Thiết lập trường tuỳ chỉnh: Nền tảng, Thể loại, Tester.
- [x] Tích hợp thông báo Slack Daily Check-in.

#### 🚧 Task Management Dashboard (Đang xây dựng)
**Quyết định kỹ thuật (đã xác nhận 2026-05-13):**
- **Loại ứng dụng:** Ứng dụng web độc lập (thư mục `workflow-nhan/task-dashboard/`)
- **Triển khai:** Local hoặc deploy cloud cho truy cập từ xa
- **Lưu trữ:** File JSON (localStorage + export/import), tích lũy dữ liệu lịch sử
- **Tích hợp:** Độc lập (chưa kết nối Jira/Slack, sẽ mở rộng sau)
- **Eisenhower:** Tự động phân loại dựa trên ưu tiên + hạn chót, cho phép chỉnh sửa thủ công

**5 Modules:**
- [x] **Form 1 — Setup & Config:** Cấu hình danh sách dự án, nhân sự, trạng thái, cấp độ.
- [x] **Form 2 — Task List:** Nhập công việc, hạn chót, trọng số, người phụ trách. Chỉnh sửa trực tiếp, lọc và hành động hàng loạt.
- [x] **Form 3 — Calendar View:** Hiển thị Tháng/Tuần/Ngày, kéo & thả đổi lịch.
- [x] **Form 4 — Work Report:** Dashboard tự động, Eisenhower Matrix, biểu đồ tiến độ/workload/hạn chót.
- [x] **Form 5 — Staff Report:** Phân tích hiệu suất nhân sự, so sánh nhân sự và so sánh cùng kỳ.

**Tiến độ xây dựng:**
- [x] Phase 1: Nền tảng (Vite + React + TS, Hệ thống thiết kế, Lớp dữ liệu)
- [x] Phase 2: Các form cốt lõi (Setup + Task List)
- [x] Phase 3: Lịch (Tháng/Tuần/Ngày + Kéo & thả)
- [x] Phase 4: Báo cáo (Work Report + Hiệu suất nhân sự)
- [x] Phase 5: Hoàn thiện (Animations, Export, Responsive, Testing)

### Workflow 2: Test, Đánh giá & Phân tích
- [x] Xây dựng Game Scorecard (1-5 điểm): Core Loop, Monetization, Visual/UX, Retention, USP.
- [x] Ma trận phân tích so sánh các game cùng thể loại.
- [x] Hệ thống lưu trữ báo cáo tập trung trên Jira/Confluence.
- [x] Quy trình tổng hợp Insight nhanh hàng tuần.
- [x] Triển khai AI Game Eval Agent:
    - [x] Tự động nghiên cứu đối thủ, đánh giá framework và xuất báo cáo Doc/Markdown.
    - [x] **Mới:** Đọc nội dung đánh giá/phân tích từ file và tự động tổng hợp hạng mục, tiêu chí đánh giá.

### Workflow 3: Portfolio & Presentation
- [x] Cấu trúc Storytelling: Trend Overview -> Top Picks -> Deep Dive -> Lesson Learned.
- [x] Template thiết kế sẵn (Slide/Web) để nhập dữ liệu nhanh.
- [x] Quy trình đóng gói và xuất file (PDF/Link).
- [ ] Xây dựng thư viện hình ảnh/clip gameplay làm tư liệu.

## 🔄 Giai đoạn 4: Đóng gói & Tái sử dụng
- [ ] Tạo check-list hướng dẫn nhanh (SOP).
- [ ] Hướng dẫn cách "Copy-Paste" framework này cho workflow mới.

---

## 🚀 Hướng dẫn tiếp tục
*Để bắt đầu lại công việc, bạn chỉ cần ra lệnh cho AI:*
1. "Hãy đọc file `workflow-nhan/preparing_workflows.md` để nắm bắt tiến độ."
2. "Tiếp tục thực hiện Giai đoạn 3: Bắt đầu xây dựng [Tên Workflow] (Ví dụ: Workflow 3 - Portfolio)."

---

## 📝 Nhật ký cập nhật (Changelog)

- **2026-05-19:**
  - **Workflow 2:** Hoàn thiện CSS cho giao diện AI Evaluation. Thêm `.eval-setup-layout`, `.terminal-console` và `.slideshow-theater` trong `InsightsPage.css`. Cập nhật middleware Vite để xử lý tạo PPTX và mở file. Kiểm tra chức năng bằng `npm run dev` và thử nghiệm giao diện thủ công.
  - **Workflow 3:** Refactor `InsightsPage.tsx` để bao gồm các component form mới và đảm bảo TypeScript build không lỗi.
- **2026-05-15:** Nâng cấp GameEvalAgent hỗ trợ đọc file thô và tự động trích xuất tiêu chí đánh giá. Cập nhật SOP và xác thực qua file mẫu.
- **2026-05-14 (Ca 2):** Hoàn thành Workflow 2. Xây dựng trang "Insights & Evaluation" trong dashboard. Triển khai GameEvalAgent (script Python + SOP) có khả năng tự động nghiên cứu online, phân tích SWOT/Scorecard và xuất báo cáo Markdown chuyên sâu.
- **2026-05-14 (Ca 1):** Hoàn thành toàn bộ Workflow 1 (Task Management Dashboard) với 5 Modules. Đã triển khai Calendar Drag & Drop, Work Report (Slack format) và Staff Report (Manager View). Sửa lỗi giao diện Sidebar overlap. Toàn bộ code đã build thành công. Cập nhật layout Modal (Sticky Header/Footer) để sửa lỗi chồng nút Save trong form nhân sự.
- **2026-05-13:** Bắt đầu xây dựng Workflow 1 — Task Management Dashboard. Xác nhận quyết định kỹ thuật: Ứng dụng độc lập, lưu JSON, tự phân loại Eisenhower, kéo & thả Calendar. Đã tạo kế hoạch triển khai chi tiết với 5 module và 5 giai đoạn. Đánh dấu hoàn thành mục 1.5 (Công cụ & Hạ tầng).
- **2026-05-11:** Khởi tạo tài liệu, xác định bối cảnh Team 5 người, Game Testing, Jira + Slack Cloud, cấu hình Remote và IDE/AI. Đã chi tiết hóa 3 workflow mục tiêu.

