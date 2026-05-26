# Tính năng Website & Cách Hoạt Động

Tài liệu này giải thích các tính năng chính của website Dashboard quản lý nhiệm vụ và cách mỗi tính năng hoạt động.

## 1. Tổng quan

Website là một ứng dụng độc lập React + TypeScript + Vite nằm trong `task-dashboard/`.
Nó được thiết kế cho quản lý nhiệm vụ, đánh giá game, insight hàng tuần và báo cáo hỗ trợ AI nhẹ.

### Cấu trúc chính
- `task-dashboard/src/App.tsx` điều khiển điều hướng và hiển thị trang.
- `task-dashboard/src/components/` chứa các trang giao diện và component dùng chung.
- `task-dashboard/src/data/dataService.ts` xử lý local storage, xuất/nhập JSON và các thao tác CRUD.
- `task-dashboard/src/data/apiService.ts` đồng bộ dữ liệu với backend API.
- `task-dashboard/src/types/index.ts` định nghĩa mô hình dữ liệu.
- `task-dashboard/src/contexts/AppContext.tsx` quản lý state toàn cục qua React Context + useReducer.

## 2. Điều hướng và các trang

Các trang website gồm 6 trang chia thành 3 nhóm:

**Quản lý:**
- **Tasks** (`/tasks`): quản lý danh sách nhiệm vụ, chỉnh sửa trực tiếp, lọc và hành động hàng loạt.
- **Calendar** (`/calendar`): xem nhiệm vụ đã lên lịch trên lịch và kéo thả đổi ngày.

**Hệ thống:**
- **Setup** (`/setup`): cấu hình dự án, thành viên, trạng thái và mức độ ưu tiên.

**Phân tích:**
- **Reports** (`/reports`): dashboard báo cáo công việc, xuất Slack Markdown.
- **Staff Reports** (`/staff-reports`): phân tích hiệu suất theo nhân sự (Manager View).
- **Insights** (`/insights`): bảng điểm game scorecard, tổng kết tuần, đánh giá AI.

### Sidebar
- Thanh bên trái có thể thu gọn/mở rộng bằng click vào logo hoặc nút mũi tên.
- Các mục điều hướng được nhóm theo section (Quản lý, Hệ thống, Phân tích).
- Trang active được highlight.

## 3. Mô hình dữ liệu và lưu trữ

Ứng dụng lưu dữ liệu trong `localStorage` của trình duyệt dưới khóa `task-dashboard-data`.
Khi có backend API (cấu hình qua biến môi trường `VITE_API_URL`), dữ liệu được đồng bộ hai chiều.

### Các thao tác dữ liệu
- **Xuất JSON:** Tải toàn bộ dữ liệu ứng dụng dạng file `.json`.
- **Nhập JSON:** Khôi phục hoặc di chuyển dữ liệu từ file.
- **Reset:** Khôi phục về dữ liệu mẫu (seed data).
- **Snapshot:** Lưu trạng thái hàng ngày, xem danh sách và khôi phục snapshot cũ.

### Các thực thể dữ liệu cốt lõi
- `Project`: tên, nền tảng, thể loại, trạng thái, màu
- `Member`: tên, vai trò, màu avatar, chữ viết tắt
- `Task`: tiêu đề, mô tả, dự án, người phụ trách, trạng thái, ưu tiên, hạn chót, trọng số, thẻ, phân loại Eisenhower
- `GameScorecard`: đánh giá và tóm tắt hàng tuần cho một dự án (5 tiêu chí)
- `WeeklyInsight`: điểm nổi bật, rủi ro, hành động và trạng thái chung

### Seed Data
Ứng dụng khởi tạo với dữ liệu mẫu:
- 3 dự án: Puzzle Quest Mobile, Battle Arena PC, Idle Farm Android
- 5 thành viên: Lead Tester, Game Analyst, QA Tester (2), Report Writer
- 25 tasks với đa dạng trạng thái (active, completed, overdue)
- 1 scorecard mẫu, 1 insight mẫu

## 4. Phân tích tính năng

### 4.1 Setup & Config
- Quản lý định nghĩa dự án (thêm/sửa/xóa)
- Mỗi dự án có: tên, platform (iOS/Android/PC/Console/Web/Cross-platform), genre, status (active/archived), màu sắc
- Bảng màu có sẵn 10 màu để chọn
- Quản lý thành viên và vai trò
- Tự động tạo initials từ tên thành viên
- Modal thêm/sửa có sticky header & footer

### 4.2 Task List
- Tạo, chỉnh sửa và xóa nhiệm vụ qua modal
- Gán mỗi nhiệm vụ cho một dự án và thành viên
- Theo dõi trạng thái: `backlog` → `in-testing` → `evaluating` → `reporting` → `done`
- Sử dụng giá trị ưu tiên `P0` (Hot/Competitor), `P1` (Project Request), `P2` (Research)
- Trọng số 1-5 (dạng dot indicator)
- Tags system: gắn thẻ, hiển thị 3 tag đầu, search theo tag
- Quick stats bar: Tổng cộng, Hoàn thành, Đang thực hiện, Trễ hạn
- **Filter đa chiều:** search text/tag, lọc theo dự án, người phụ trách, trạng thái, ưu tiên
- **Sắp xếp:** click tiêu đề cột để sort asc/desc theo Tên, Deadline, Ưu tiên, Trọng số, Trạng thái
- Đổi trạng thái nhanh bằng dropdown inline
- Deadline hiển thị relative (Hôm nay, Còn X ngày, Trễ X ngày), warning khi còn ≤3 ngày
- Highlight hàng task quá hạn

### 4.3 Eisenhower Matrix
- Tự động phân loại dựa trên priority + deadline
- P0: important, urgent nếu ≤3 ngày
- P1: urgent ≤3 ngày, important ≤7 ngày
- P2: urgent ≤1 ngày, không important
- Cho phép chỉnh sửa thủ công (bỏ auto-classify)
- Hiển thị indicator ⚡⭐ trong bảng task
- Hiển thị giải thích tự động trong form

### 4.4 Calendar View
- Hiển thị lịch tháng với padding tháng trước/sau
- Header: T2-T3-T4-T5-T6-T7-CN (Monday-first)
- Task hiển thị trong ô ngày, màu theo priority
- **Kéo & thả:** kéo task sang ngày khác để thay đổi deadline
- Click ô ngày → tạo task mới với deadline được set sẵn
- Click task → mở form chỉnh sửa
- Điều hướng: tháng trước/sau, nút "Hôm nay"
- Task đã hoàn thành hiển thị mờ (strikethrough style)

### 4.5 Work Report
- Dashboard tự động cho tiến độ dự án hoặc nhóm
- Chọn khoảng thời gian: Hôm nay / Tuần này
- Chọn thành viên để xem báo cáo cá nhân
- Stat cards: Hoàn thành, Đang thực hiện, Trễ hạn
- **Slack Markdown Preview:** tạo báo cáo định dạng Slack
- Nội dung gồm: người báo cáo, task hoàn thành (nhóm theo dự án), đang thực hiện, trễ hạn
- Nút **Copy to Clipboard** để gửi lên Slack ngay
- Thông tin profile thành viên (avatar + role)

### 4.6 Staff Report (Manager View)
- Phân tích hiệu suất tất cả thành viên team
- Mỗi member một card: avatar, tên, role
- Metrics: Tổng Task, Hoàn thành, Đang làm, Trễ hạn
- Progress bar tiến độ công việc (%)
- Danh sách task đang thực hiện (hiển thị 3 task đầu, badge priority, project dot)
- Nếu có task quá hạn, số trễ hạn hiển thị màu đỏ

### 4.7 Insights
- 3 tab: Game Scorecards, Tổng kết tuần, AI Đánh giá

#### Game Scorecards
- Tạo thẻ đánh giá chất lượng game theo 5 tiêu chí (dùng thanh range 1-5):
  - Core Loop
  - Monetization
  - Visual/UX
  - Retention
  - USP
- Thanh progress bar hiển thị điểm (màu sắc thay đổi theo điểm)
- Ghi nhận summary nhận xét
- Mỗi scorecard gắn với dự án và tuần

#### Weekly Summary
- Tạo insight hàng tuần với cấu trúc 3 phần:
  - ✨ Highlights (điểm nổi bật)
  - ⚠️ Risks (rủi ro)
  - 🚀 Action Items (hành động)
- Trạng thái chung: Excellent / Good / Stable / At-Risk / Critical
- Nhập mỗi mục dưới dạng textarea (mỗi dòng 1 ý)
- Status pill hiển thị màu sắc theo mức độ

#### AI Evaluation
- Form nhập thông tin game: tên, thể loại, đối thủ cạnh tranh, ghi chú bổ sung
- **Custom criteria:** thêm/bớt tiêu chí đánh giá động (dạng tag)
- Gọi API `/api/evaluate` chạy Python agent
- Terminal console mô phỏng logging process
- Hiển thị lỗi nếu evaluation thất bại (error panel)
- **Slide Preview:** sau khi có kết quả, hiển thị từng slide với render markdown
  - Progress bar cho rating
  - Navigation controls (◀ Trước / Sau ▶)
  - Slide dots indicator
- **Raw Markdown View:** xem source markdown gốc
- **Export PPTX:** biên dịch sang PowerPoint, mở file trên máy

## 5. Component Library

Bộ component dùng chung trong `task-dashboard/src/components/common/index.tsx`:

| Component | Props | Mô tả |
|---|---|---|
| **Button** | variant (primary/secondary/ghost/danger), size (sm/md/lg), disabled | Nút bấm với nhiều style |
| **Badge** | variant (p0/p1/p2), className | Badge hiển thị priority/label |
| **Avatar** | initials, color, size (sm/md/lg/xl) | Avatar hình tròn với chữ viết tắt |
| **Modal** | isOpen, onClose, title, footer | Modal portal với sticky header/footer |
| **WeightDots** | weight (1-5), max | Chấm tròn hiển thị trọng số |
| **EmptyState** | icon, title, description, action | Trạng thái rỗng cho danh sách |
| **TaskFormModal** | task, onSave, onDelete, onClose | Full form tạo/sửa task (dùng chung Tasks + Calendar) |
| **PageHelp** | title, children | Modal hướng dẫn cho từng trang |

## 6. Tính năng đánh giá AI

Pipeline đánh giá AI là giải pháp kết hợp backend Express + Python agent.

### Cách hoạt động
1. Người dùng nhập tên game, thể loại, đối thủ và thông tin thêm.
2. Người dùng chọn hoặc thêm tiêu chí đánh giá (mặc định 5 tiêu chí).
3. Giao diện gửi yêu cầu POST tới `/api/evaluate`.
4. Backend Express server chạy `ai-agents/game_eval_agent.py` với CLI arguments.
5. Agent Python tạo báo cáo đánh giá Markdown và trả về frontend.
6. Frontend hiển thị báo cáo dạng slide preview hoặc raw markdown.
7. Người dùng có thể xuất sang PPTX qua `/api/generate-pptx`, gọi `ai-agents/pptx_generator.py`.
8. File PPTX có thể mở trực tiếp trên máy qua `/api/open-file`.

### Ghi chú
- Giao diện đánh giá AI giả lập nhật ký terminal cho tiến độ đánh giá với animation cursor.
- Tiêu chí đánh giá có thể tùy chỉnh (thêm/bớt) trước khi chạy.
- Kết quả tìm kiếm từ web được thu thập và thêm vào báo cáo khi có thể.
- Xuất PPTX tạo slide dark-themed 16:9 với progress bar, card layout, bullet slides.

## 7. Backend API

Backend Express server chạy trên port 4000 (`backend/src/server.js`).

### Endpoints

| Endpoint | Method | Mô tả |
|---|---|---|
| `/api/health` | GET | Kiểm tra server health |
| `/api/app-data` | GET | Lấy toàn bộ dữ liệu ứng dụng |
| `/api/app-data` | POST | Lưu toàn bộ dữ liệu ứng dụng |
| `/api/snapshot` | POST | Lưu snapshot (theo ngày) |
| `/api/snapshots` | GET | Danh sách snapshot |
| `/api/snapshots/:date` | GET | Lấy snapshot theo ngày |
| `/api/evaluate` | POST | Chạy AI game evaluation |
| `/api/generate-pptx` | POST | Biên dịch báo cáo sang PPTX |
| `/api/open-file` | POST | Mở file PPTX trên máy local |

### Storage
- **JSON Store (mặc định):** Lưu dữ liệu trong file `data/app-data.json`, snapshot trong `data/snapshots/`.
- **Database Store:** Tự động chuyển sang PostgreSQL + Prisma khi có biến môi trường `DATABASE_URL`.
- Cơ chế sync: JSON → DB 2 chiều (khi DB enabled, JSON edits được sync vào DB).

## 8. Animations

CSS animations được áp dụng trên nhiều component:
- `animate-fade-in`: fade in khi trang load
- `animate-scale-in`: scale từ 0 → 1 (modal, terminal console)
- `stagger-children`: các item con xuất hiện tuần tự
- `animate-pulse`: nhấp nháy cursor ở terminal

## 9. Hành vi Modal

Website sử dụng component `Modal` chung trong `task-dashboard/src/components/common/index.tsx`.
- Modal được render qua React portal vào `document.body`.
- Modal có sticky header (title + close button) và sticky footer (action buttons).
- Click ngoài modal (backdrop) để đóng.
- `Common.css` đảm bảo modal cố định, căn giữa và có kích thước phù hợp với chiều cao viewport.

## 10. Cách sử dụng

### Khởi động ứng dụng
- `npm install` trong `task-dashboard/` (nếu cần)
- `npm run dev` từ `task-dashboard/` (mặc định port 5173)
- Backend: `npm start` từ `backend/` (port 4000)

### Luồng làm việc
1. Cấu hình dự án và thành viên trong **Setup**.
2. Thêm nhiệm vụ trong **Tasks** với hạn chót, người phụ trách, ưu tiên, trọng số, thẻ.
3. Dùng **Calendar** để kiểm tra lịch và kéo thả đổi deadline.
4. Xem tiến độ trong **Reports** (Slack-ready) và **Staff Reports** (Manager View).
5. Dùng **Insights** để chấm điểm game scorecard, tổng kết tuần và chạy đánh giá AI.

## 11. Cải tiến trong tương lai

Các cải tiến có thể thực hiện trong tương lai:
- tích hợp tự động hóa Jira/Slack
- hoàn thiện backend database migration (Prisma → PostgreSQL)
- hỗ trợ phụ thuộc nhiệm vụ và tác vụ con
- bật hợp tác thời gian thực
- cải thiện AI agent với API tìm kiếm xác thực và nghiên cứu trực tuyến tốt hơn
- xây dựng thư viện hình ảnh/clip gameplay (Workflow 3)

## 12. Xác thực người dùng (Thêm mới)

Website đã tích hợp hệ thống xác thực người dùng với vai trò khác nhau:

### Quy trình xác thực
1. Người dùng đăng nhập bằng email/mật khẩu qua `/api/auth/login`
2. Backend trả về JWT token và thông tin người dùng
3. Token được lưu trong localStorage và đính kèm trong mọi request API
4. Các API endpoint được bảo vệ bởi authentication middleware
5. Role-based access control hạn chế truy cập theo vai trò

### Vai trò người dùng
- **ADMIN**: Truy cập toàn hệ thống, quản lý người dùng
- **MANAGER**: Xem báo cáoStaff Report, tạo task, xem insights
- **TESTER**: Tạo task, đánh giá game, tạo insights
- **VIEWER**: Chỉ xem dữ liệu, không thể chỉnh sửa

### Giao diện
- Form đăng nhập/đăng ký được hiển thị khi chưa xác thực
- Sau khi login thành công, chuyển hướng đến trang Tasks
- Hiển thị thông tin người dùng trong sidebar (tùy chọn nâng sau)
- Đăng xuất tự động khi token hết hạn hoặc đăng xuất thủ công

### Bảo mật
- Mật khẩu được hash bằng bcrypt trước khi lưu trong database
- JWT token có thời gian hết hạn (24h)
- Các route API public: `/api/health`, `/api/auth/register`, `/api/auth/login`
- Tất cả remaining routes yêu cầu authentication
