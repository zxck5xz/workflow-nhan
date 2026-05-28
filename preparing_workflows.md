# Tài liệu Chuẩn bị Workflow Chủ đạo

Tài liệu này dùng để chuẩn bị và quản lý quá trình thiết kế các workflow. Cấu trúc được thiết kế để có thể tái sử dụng cho bất kỳ quy trình công việc nào.

## 📋 Trạng thái hiện tại
- **Dự án:** Thiết kế 3 Workflow (Quản lý, Test/Phân tích, Portfolio/Trình bày)
- **Tiến độ:** Giai đoạn 3 (hoàn thiện) + Backend DB Migration + Xác thực người dùng — Full-stack deployed & verified (Vercel + Railway + Neon)
- **Ngày khởi tạo:** 2026-05-11
- **Cập nhật cuối:** 2026-05-28

---

## 🏗️ Giai đoạn 1: Thu thập bối cảnh
...
- **2026-05-28 (Nâng cấp giao diện Jira-style và Quản lý User):**
  - **Tổng quan:** Hợp nhất quản lý dự án và công việc vào một giao diện tập trung (Jira-style), thêm tính năng quản lý tài khoản người dùng cho Admin. Tiến độ đạt ~95%.
  - **Giao diện & Tính năng:**
    *   **Project Control Center:** Hợp nhất `Tasks` và `Project Dashboard` thành trang "Dự án & Task" duy nhất.
    *   **Jira-style Layout:** Thêm sidebar dự án nội bộ, hệ thống tab (List View, Kanban Board, Overview).
    *   **Quản lý Dự án:** Thêm nút "+ Thêm dự án" nhanh tại trang Công việc và Dashboard. Refactor `ProjectModal` thành component dùng chung.
    *   **Quản lý Tài khoản (User Management):** Xây dựng trang quản trị user dành riêng cho ADMIN.
    *   **Phân quyền (RBAC):** Admin có thể thay đổi Role (ADMIN, MANAGER, TESTER, VIEWER) hoặc xóa user. Menu "Tài khoản" tự động ẩn với các role khác.
  - **Backend:**
    *   Thêm các API endpoints quản lý user: `GET /api/users`, `PATCH /api/users/:id/role`, `DELETE /api/users/:id`.
    *   Bảo vệ các route nhạy cảm bằng middleware `authorize('ADMIN')`.
  - **Kết quả:** Giao diện chuyên nghiệp hơn, quản lý tập trung và hệ thống phân quyền chặt chẽ hơn.
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
- [x] Tích hợp AI Agent tự động tạo slide PowerPoint (PPTX) từ dữ liệu đánh giá game.
- [ ] Xây dựng thư viện hình ảnh/clip gameplay làm tư liệu.

## 🗄️ Backend & Database Migration
*Mục tiêu: Chuyển từ lưu trữ JSON (localStorage/file) sang cơ sở dữ liệu PostgreSQL qua Prisma.*

- [x] Thiết lập Prisma schema (Project, Member, Task, StatusConfig, PriorityConfig, GameScorecard, WeeklyInsight, Snapshot)
- [x] Tạo migration `20260526045525_init`
- [x] Viết `DataStoreDB` class (đầy đủ CRUD operations)
- [x] API endpoints cơ bản (Express server port 4000)
- [x] Script import dữ liệu từ JSON sang DB (`migrate-import.ts`)
- [x] **Xác thực người dùng và phân quyền**
  - [x] Thêm authentication service với JWT
  - [x] Cập nhật Prisma schema: thêm Role enum và trường email/password cho Member
  - [x] Tạo API endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
  - [x] Thêm authentication middleware bảo vệ các API endpoints
  - [x] Thêm role-based authorization middleware
  - [x] Tạo script seed-users.ts để tạo các user mặc định
  - [x] Frontend: AuthContext, AuthService, login/register forms
   - [x] Frontend: Cập nhật dataService để bao gồm token trong headers
- [x] **Deploy backend lên Railway + Neon Postgres**
  - Backend Railway: `https://backend-production-84f2a.up.railway.app`
  - Database: Neon Postgres (`neondb_owner@ep-odd-hill`)
  - Railpack builder (không Dockerfile) — build từ repo root, `cd backend && npm ci && npx prisma generate`
  - Pre-deploy: `cd backend && npx prisma migrate deploy` (tạo 8 tables)
  - Railway domain generated: `backend-production-84f2a.up.railway.app`
- [x] **Deploy frontend lên Vercel**
  - URL: `https://task-dashboard-chi-lemon.vercel.app`
  - `VITE_API_URL` set to Railway backend URL
  - Frontend load data từ backend API (fallback localStorage nếu API unavailable)
- [x] **Fix status enum mismatch** — Frontend dùng `in-testing` (hyphen), Prisma enum `in_testing` (underscore). Thêm `toPrismaStatus`/`fromPrismaStatus` mapping trong `data-store-db.js`. Push lên GitHub commit `021556c`.
- [x] **Seed database với demo data** — 3 projects, 5 members, 7 tasks, 5 statuses, 3 priorities — POST thành công qua `/api/app-data`
- [x] **API endpoints hoạt động** — health check OK, GET/POST `/api/app-data` hoạt động với Prisma backend
- [x] Chuyển snapshot endpoints từ JSON store sang DataStoreDB
- [ ] Kiểm tra docker-compose (backend + Postgres)
- [x] Viết hướng dẫn hosting/deploy (SOP.md)

## 🔄 Giai đoạn 4: Đóng gói & Tái sử dụng
- [x] Tạo check-list hướng dẫn nhanh (SOP).
- [x] Hướng dẫn cách "Copy-Paste" framework này cho workflow mới.

---

## 🚀 Hướng dẫn tiếp tục
*Để bắt đầu lại công việc, bạn chỉ cần ra lệnh cho AI:*
1. "Hãy đọc file `workflow-nhan/preparing_workflows.md` để nắm bắt tiến độ."
2. "Tiếp tục thực hiện [Việc cụ thể]" (Ví dụ: "Chạy migration DB", "Xây dựng thư viện hình ảnh cho Workflow 3", "Hoàn thiện Giai đoạn 4").

---

## 📝 Nhật ký cập nhật (Changelog)

- **2026-05-27 (Ca 4 - Sửa lỗi deploy và xác thực người dùng):**
  - **Tổng quan:** Sửa lỗi deploy Vercel và Railway gặp sự cố sau khi thêm xác thực người dùng. Fix TypeScript build và Prisma 7 compatibility. Cả hai môi trường đã hoạt động ổn định.
  - **Railway (Backend):**
    - Fix `server.js` bị duplicate routes và double `app.listen()` gây crash container.
    - Fix `Dockerfile` sai đường dẫn COPY data directory.
    - Tạo `railway.json` với healthcheck, restart policy.
    - Fix `auth.js`: import PrismaClient từ generated path thay vì `@prisma/client`.
    - Fix `auth.js`: thêm PrismaPg adapter cho Prisma 7 (không support empty constructor).
    - Fix `auth.js`: thêm `crypto.randomUUID()` cho user id khi register.
    - Chạy `prisma db push` để đồng bộ schema production DB (thêm email/password columns).
    - Tạo migration `20260527020000_add_auth_fields`.
  - **Vercel (Frontend):**
    - Fix TypeScript build errors: `onclick`→`onClick`, thiếu `email` field trong Member type, sai import path `authService`.
    - Tạo root `vercel.json` với build/install command chạy trong `task-dashboard/` để Vercel auto-deploy từ GitHub hoạt động.
    - Link project từ `task-dashboard/` để deploy thành công.
    - Fix `LoginForm`/`RegisterForm`: xoá `useNavigate` (app không dùng React Router).
    - Fix `apiService.ts`: xoá `window.location.href = '/'` gây redirect loop khi 401.
  - **Kết quả:**
    - Backend Railway: Online, health check OK, auth endpoints hoạt động (register/login/me).
    - Frontend Vercel: Build successful, production alias hoạt động.
    - End-to-end verified: register → login → JWT → /api/auth/me → load app-data.
- **2026-05-26 (Ca 3 - Hoàn thành xác thực người dùng và tài liệu hướng dẫn):**
  - **Tổng quan:** Thêm hệ thống xác thực người dùng với vai trò (ADMIN, MANAGER, TESTER, VIEWER), tạo SOP và hướng dẫn copy-paste framework.
  - **Xác thực người dùng:**
    - Thêm authentication service với JWT trong backend.
    - Cập nhật Prisma schema: thêm Role enum và trường email/password cho Member.
    - Tạo API endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
    - Thêm authentication middleware bảo vệ các API endpoints.
    - Thêm role-based authorization middleware.
    - Tạo script seed-users.ts để tạo các user mặc định.
    - Frontend: AuthContext, AuthService, login/register forms.
    - Frontend: Cập nh yön dataService để bao gồm token trong headers.
  - **Tài liệu hướng dẫn:**
    - Tạo file SOP.md (Standard Operating Procedure) để hướng dẫn cài đặt, triển khai và bảo trì hệ thống.
    - Tạo file COPY_PASTE_GUIDE.md để hướng dẫn sao chép framework và tạo workflow mới.
- **2026-05-26 (Ca 2 - Deploy full stack lên cloud):**
  - **Tổng quan:** Hoàn thành deploy full-stack (Frontend Vercel + Backend Railway + DB Neon Postgres). ~90-92%.
  - **Backend & DB Migration:**
    - Deploy backend Express/Prisma lên Railway (Railpack builder, không Dockerfile).
    - Kết nối Neon Postgres production database.
    - Chạy `prisma migrate deploy` tự động qua preDeployCommand.
    - Fix status enum mismatch — frontend dùng `in-testing` (hyphen), Prisma enum `in_testing` (underscore). Thêm mapping function trong `data-store-db.js`.
    - Seed database với demo data thành công.
  - **Frontend:**
    - Deploy frontend lên Vercel (`task-dashboard-chi-lemon.vercel.app`).
    - Set `VITE_API_URL` → Railway backend.
    - Frontend load/sync data với backend API, fallback localStorage nếu API unavailable.
  - **API hoạt động:** Health OK, GET/POST `/api/app-data` với Prisma backend.
  - **Hạ tầng:** Railway trial plan, deploy từ GitHub repo `zxck5xz/workflow-nhan`.
- **2026-05-26 (Ca 1):**
  - **Tổng quan:** Xác nhận trạng thái toàn bộ dự án ~85-90%. Cả 3 workflow đã hoạt động.
  - **Workflow 1:** Frontend hoàn thiện (6 pages, đã deploy Vercel). Backend DB migration đang tiến hành: Prisma schema + migration + DataStoreDB + API endpoints đã xong. Cần chạy migration thực tế và chuyển snapshot endpoints.
  - **Workflow 2:** AI Game Eval Agent + PPTX Generator hoàn chỉnh. Đã sinh 7 báo cáo Markdown và 7 PowerPoint cho các game mẫu.
  - **Workflow 3:** Đã có PPTX export tự động. Còn thiếu thư viện hình ảnh/clip gameplay.
  - **Hạ tầng:** `Harness-context-engineering` MCP server đang chạy (13 tools). `mcp_server/` còn là skeleton chưa gắn handler thực tế.
- **2026-05-19:**
  - **Workflow 2:** Hoàn thiện CSS cho giao diện AI Evaluation. Thêm `.eval-setup-layout`, `.terminal-console` và `.slideshow-theater` trong `InsightsPage.css`. Cập nhật middleware Vite để xử lý tạo PPTX và mở file. Kiểm tra chức năng bằng `npm run dev` và thử nghiệm giao diện thủ công.
  - **Workflow 3:** Refactor `InsightsPage.tsx` để bao gồm các component form mới và đảm bảo TypeScript build không lỗi.
- **2026-05-15:** Nâng cấp GameEvalAgent hỗ trợ đọc file thô và tự động trích xuất tiêu chí đánh giá. Cập nhật SOP và xác thực qua file mẫu.
- **2026-05-14 (Ca 2):** Hoàn thành Workflow 2. Xây dựng trang "Insights & Evaluation" trong dashboard. Triển khai GameEvalAgent (script Python + SOP) có khả năng tự động nghiên cứu online, phân tích SWOT/Scorecard và xuất báo cáo Markdown chuyên sâu.
- **2026-05-14 (Ca 1):** Hoàn thành toàn bộ Workflow 1 (Task Management Dashboard) với 5 Modules. Đã triển khai Calendar Drag & Drop, Work Report (Slack format) và Staff Report (Manager View). Sửa lỗi giao diện Sidebar overlap. Toàn bộ code đã build thành công. Cập nhật layout Modal (Sticky Header/Footer) để sửa lỗi chồng nút Save trong form nhân sự.
- **2026-05-13:** Bắt đầu xây dựng Workflow 1 — Task Management Dashboard. Xác nhận quyết định kỹ thuật: Ứng dụng độc lập, lưu JSON, tự phân loại Eisenhower, kéo & thả Calendar. Đã tạo kế hoạch triển khai chi tiết với 5 module và 5 giai đoạn. Đánh dấu hoàn thành mục 1.5 (Công cụ & Hạ tầng).
- **2026-05-11:** Khởi tạo tài liệu, xác định bối cảnh Team 5 người, Game Testing, Jira + Slack Cloud, cấu hình Remote và IDE/AI. Đã chi tiết hóa 3 workflow mục tiêu.

