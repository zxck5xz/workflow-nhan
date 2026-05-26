# Tính năng Website & Cách Hoạt Động

Tài liệu này giải thích các tính năng chính của website Dashboard quản lý nhiệm vụ và cách mỗi tính năng hoạt động.

## 1. Tổng quan

Website là một ứng dụng độc lập React + TypeScript + Vite nằm trong `task-dashboard/`.
Nó được thiết kế cho quản lý nhiệm vụ, đánh giá game, insight hàng tuần và báo cáo hỗ trợ AI nhẹ.

### Cấu trúc chính
- `task-dashboard/src/App.tsx` điều khiển điều hướng và hiển thị trang.
- `task-dashboard/src/components/` chứa các trang giao diện và component dùng chung.
- `task-dashboard/src/data/dataService.ts` xử lý local storage, xuất/nhập JSON và các thao tác CRUD.
- `task-dashboard/src/types/index.ts` định nghĩa mô hình dữ liệu.
- `task-dashboard/vite.config.ts` chứa middleware giống backend cục bộ để tích hợp đánh giá AI.

## 2. Điều hướng và các trang

Các trang website gồm:
- **Setup**: cấu hình dự án, thành viên, trạng thái và mức độ ưu tiên.
- **Tasks**: quản lý danh sách nhiệm vụ, chỉnh sửa trực tiếp, lọc và hành động hàng loạt.
- **Calendar**: xem nhiệm vụ đã lên lịch trên lịch và dời ngày.
- **Reports**: dashboard báo cáo công việc và các chỉ số tiến độ.
- **Staff Reports**: phân tích hiệu suất theo nhân sự.
- **Insights**: bảng điểm game, tóm tắt hàng tuần và đánh giá AI.

## 3. Mô hình dữ liệu và lưu trữ

Ứng dụng lưu dữ liệu trong `localStorage` của trình duyệt dưới khóa `task-dashboard-data`.
Nó cũng hỗ trợ:
- xuất JSON toàn bộ dữ liệu ứng dụng
- nhập JSON để khôi phục hoặc di chuyển dữ liệu
- lưu và tải snapshot theo ngày

### Các thực thể dữ liệu cốt lõi
- `Project`: tên, nền tảng, thể loại, trạng thái, màu
- `Member`: tên, vai trò, màu avatar, chữ viết tắt
- `Task`: tiêu đề, mô tả, dự án, người phụ trách, trạng thái, ưu tiên, hạn chót, trọng số, thẻ
- `GameScorecard`: đánh giá và tóm tắt hàng tuần cho một dự án
- `WeeklyInsight`: điểm nổi bật, rủi ro, hành động và trạng thái chung

## 4. Phân tích tính năng

### 4.1 Setup & Config
- Quản lý định nghĩa dự án
- Quản lý thành viên và vai trò
- Định nghĩa trạng thái workflow và độ ưu tiên
- Trang này là nền tảng của dashboard và xác định tùy chọn sẵn có khi tạo nhiệm vụ.

### 4.2 Task List
- Tạo, chỉnh sửa và xóa nhiệm vụ
- Gán mỗi nhiệm vụ cho một dự án và thành viên
- Theo dõi trạng thái: `backlog`, `in-testing`, `evaluating`, `reporting`, `done`
- Sử dụng giá trị ưu tiên `P0`, `P1`, `P2`
- Mỗi nhiệm vụ bao gồm phân loại Eisenhower và thẻ

### 4.3 Calendar View
- Hiển thị nhiệm vụ theo tháng/tuần/ngày
- Dời lịch nhiệm vụ bằng cách chỉnh sửa ngày nhiệm vụ
- Lịch là cách nhìn trực quan để thấy hạn chót và khối lượng công việc theo thời gian

### 4.4 Work Report
- Dashboard tự động cho tiến độ dự án hoặc nhóm
- Hiển thị tiến độ, phân bổ nhiệm vụ và trạng thái hạn chót
- Dùng để báo cáo nhanh và theo dõi tình trạng công việc

### 4.5 Staff Report
- Phân tích hiệu suất thành viên nhóm
- So sánh nhiệm vụ hoàn thành, tỷ lệ đúng hạn, khối lượng trung bình và ưu tiên
- Giúp xác định năng lực và cân bằng đóng góp

### 4.6 Insights
- **Game Scorecards**: tạo thẻ đánh giá chất lượng game theo tiêu chí
  - Core Loop
  - Monetization
  - Visual/UX
  - Retention
  - USP
- **Weekly Summary**: ghi nhận insight hàng tuần với điểm nổi bật, rủi ro và hành động
- **AI Evaluation**: hỗ trợ phân tích và tạo báo cáo

## 5. Tính năng đánh giá AI

Pipeline đánh giá AI là giải pháp kết hợp cục bộ sử dụng dev server Vite.

### Cách hoạt động
1. Người dùng nhập tên game, thể loại, đối thủ và thông tin thêm.
2. Người dùng chọn hoặc thêm tiêu chí đánh giá.
3. Giao diện gửi yêu cầu POST tới `/api/evaluate`.
4. `task-dashboard/vite.config.ts` chặn yêu cầu và chạy `ai-agents/game_eval_agent.py`.
5. Agent Python tạo báo cáo đánh giá Markdown và trả về frontend.
6. Frontend hiển thị báo cáo và xem trước slide.
7. Người dùng có thể xuất sang PPTX qua `/api/generate-pptx`, gọi `ai-agents/pptx_generator.py`.

### Ghi chú
- Giao diện đánh giá AI giả lập nhật ký terminal cho tiến độ đánh giá.
- Kết quả tìm kiếm từ web được thu thập và thêm vào báo cáo khi có thể.
- Xuất PPTX là tùy chọn và mở file đã tạo trên Windows.

## 6. Hành vi Modal

Website sử dụng một component `Modal` chung trong `task-dashboard/src/components/common/index.tsx`.
- Modal được render qua React portal vào `document.body`.
- Điều này đảm bảo modal xuất hiện trên nội dung trang và giữ ở giữa.
- `Common.css` đảm bảo modal cố định, căn giữa và có kích thước phù hợp với chiều cao viewport.

## 7. Cách sử dụng

### Khởi động ứng dụng
- Chạy `npm install` trong `task-dashboard/` nếu cần
- Chạy `npm run dev` từ `task-dashboard/`

### Luồng làm việc
1. Cấu hình dự án và thành viên trong **Setup**.
2. Thêm nhiệm vụ trong **Tasks** với hạn chót và người phụ trách.
3. Dùng **Calendar** để kiểm tra lịch và dời lịch.
4. Xem tiến độ trong **Reports** và **Staff Reports**.
5. Dùng **Insights** để thêm tóm tắt hàng tuần và chạy đánh giá hỗ trợ AI.

## 8. Cải tiến trong tương lai

Các cải tiến có thể thực hiện trong tương lai:
- tích hợp tự động hóa Jira/Slack
- thêm lưu trữ dữ liệu backend thực tế
- hỗ trợ phụ thuộc nhiệm vụ và tác vụ con
- bật hợp tác thời gian thực
- cải thiện AI agent với API tìm kiếm xác thực và nghiên cứu trực tuyến tốt hơn
