# SOP: AI Game Evaluation & Research Agent

> Quy trình cho AI Agent tự động nghiên cứu, đánh giá game từ file Excel và tổng hợp thành slide báo cáo chất lượng.

## 🎯 Mục tiêu
Tạo ra một thực thể AI có khả năng:
1. Đọc và phân tích tự động các tài liệu ghi chú đánh giá thô định dạng Excel (`.xlsx` và `.xls` cổ điển) từ thư mục `doc/`.
2. Tự động nhận diện các Hạng mục (Core Loop, Monetization, Visual/UX, Retention, USP, v.v.), Tiêu chí và Điểm số tương ứng.
3. Tự động tìm kiếm, phân tích so sánh đối thủ cạnh tranh trên thị trường.
4. Trình bày và xuất báo cáo Markdown dạng Slide chuyên nghiệp tại thư mục `Đánh giá của AI` nhằm phục vụ việc tạo Slide thuyết trình nhanh.

---

## 🛠 Bước 1: Tiếp nhận dữ liệu (Input)
AI Agent được cung cấp dữ liệu qua folder `workflow-nhan/doc/` dưới dạng các file Excel (`.xlsx` và `.xls` legacy):
1. **Dữ liệu cấu trúc hoặc tự do**: File Excel chứa các cột/dòng mô tả nhận xét và điểm số của từng hạng mục đánh giá game.
2. **Hỗ trợ định dạng mở rộng**:
   - Sử dụng thư viện `openpyxl` cho các file định dạng XML `.xlsx` (hoặc tệp `.xlsx` bị đặt tên nhầm phần mở rộng thành `.xls`).
   - Tự động kích hoạt thư viện `xlrd` để phân tích các tệp tin dạng nhị phân cổ điển `.xls` thực thụ.
3. **Nhận diện thông tin dự án**: 
   - Agent sẽ tự động quét nội dung để tìm thông tin về tên dự án, thể loại, đối thủ từ các từ khóa tương ứng (ví dụ: `Dự án: Puzzle Quest Mobile`).
   - Nếu không tìm thấy, Agent sẽ tự động làm sạch tên file Excel để sử dụng làm tên dự án mặc định.

---

## 🔍 Bước 2: Nghiên cứu thị trường (Research)
AI Agent thực hiện mô phỏng các lệnh tìm kiếm sau:
1. `"[Tên Game] gameplay review"`: Xem đánh giá của người dùng và chuyên gia.
2. `"[Tên Game] monetization model analysis"`: Tìm hiểu cách game kiếm tiền.
3. `"Top games like [Tên Game] in [Genre]"`: Xác định các đối thủ cạnh tranh chính.

---

## 📊 Bước 3: Đánh giá theo Framework (Analysis)
AI Agent thực hiện phân tích tự động theo 2 chiến lược:
1. **Đọc điểm trực tiếp từ Excel**: Nếu trong Excel có cột điểm (ví dụ: `Điểm đánh giá`), Agent sẽ sử dụng trực tiếp các điểm số này cho Scorecard.
2. **Sentiment Analysis (Nếu thiếu điểm)**: Agent phân tích sắc thái từ ngữ trong nhận xét để tự động chấm điểm trên thang 1-5:
   - Các từ khóa tích cực (*mượt, đẹp, cuốn, xuất sắc, tốt*) -> Cộng điểm.
   - Các từ khóa tiêu cực (*tệ, lỗi, giật, chậm, lạm dụng*) -> Trừ điểm.

---

## 📝 Bước 4: Xuất báo cáo dạng Slide Markdown (Intermediate Output)
Báo cáo slide thô được lưu trữ tại thư mục `workflow-nhan/Đánh giá của AI/` dưới dạng Markdown với định dạng chia slide bằng dấu `---`:
* **Slide 1**: Tổng quan dự án (Project Overview).
* **Slide 2**: Bảng điểm chất lượng (Scorecard) trực quan với thanh tiến trình.
* **Slide 3 & 4**: Phân tích chi tiết từng hạng mục & nhận xét trích xuất từ Excel.
* **Slide 5**: Kết quả nghiên cứu đối thủ & xu hướng thị trường.
* **Slide 6**: Đề xuất hành động tiếp theo (Action Items).

---

## 💻 Bước 5: Biên dịch sang Slide PowerPoint thực tế (Final Output)
Sử dụng công cụ `pptx_generator.py` để biên dịch slide Markdown thành tệp tin PowerPoint `.pptx` hoàn chỉnh:
* **Địa điểm lưu trữ**: `workflow-nhan/PowerPoint/`
* **Đặc tả thiết kế**: 
  * Widescreen 16:9, màu nền Dark Slate tối giản cao cấp.
  * Tự động vẽ Scorecard dạng biểu đồ thanh đo tiến trình thực tế bằng các hình vẽ PowerPoint.
  * Căn chỉnh bố cục cột và thẻ tự động tối ưu cho màn hình.

---

## 🤖 Hướng dẫn kích hoạt Agent

1. **Chạy trích xuất Excel & Research đối thủ ra Markdown:**
```powershell
python workflow-nhan/ai-agents/game_eval_agent.py
```

2. **Chạy biên dịch Markdown ra Slide PowerPoint (.pptx):**
```powershell
python workflow-nhan/ai-agents/pptx_generator.py
Sau khi chạy, kiểm tra kết quả slide Markdown tại thư mục `workflow-nhan/Đánh giá của AI/` và slide PowerPoint hoàn chỉnh tại thư mục `workflow-nhan/PowerPoint/`.
