# Kiểm tra trạng thái học (25/10/2026)

- Số từ đã học đếm ID duy nhất được xác nhận bằng nút Tiếp theo. Chọn thẻ, nghe phát âm và quay lại không tăng tiến độ. Đây là xác nhận xem từ, chưa phải đánh giá thuộc từ.
- Đủ 10 từ mở luyện tập/kiểm tra. Thưởng 20 sao ghi một lần trong dữ liệu bài học, chưa kết nối ví sao chung.
- Kết quả hoàn tất gần nhất của từng hoạt động lưu tại `results.practice` / `results.quiz`, gồm `score` (0–10) và `completedAt` (ISO). Kết quả hiển thị ở phần mở khóa khi quay về học từ hoặc tải lại. Lượt chưa hoàn tất không được ghi thành kết quả; tải lại sẽ bắt đầu lượt mới.
- Bấm tab hoạt động đang làm giữ nguyên câu và đáp án. Không thể chuyển câu khi chưa trả lời hoặc ghi kết quả lặp sau khi hoàn tất.
- Sự kiện storage cập nhật trang bài học khi tab khác đổi/xóa dữ liệu; đưa về học từ để tránh tiếp tục lượt dựa trên tiến độ cũ. Không có đồng bộ máy chủ hoặc bảo đảm ghi đồng thời giữa nhiều tab.
- Dữ liệu không hợp lệ bị lọc; kết quả không được giữ nếu chưa đủ 10 từ. Khi lưu thất bại có thông báo và vẫn học được trong phiên.
- Dashboard tổng và các chủ đề khác còn số liệu minh họa. Không nên hiểu các số đó là lịch sử học thực tế hoặc suy ra đã thành thạo từ vựng.

Kiểm tra: `node test-results/check-english-animals.cjs`, `node --check` cho app.js/progress.js và `git diff --check`. Bộ kiểm tra bao gồm chống bỏ câu, giữ câu khi bấm lại tab, lưu/khôi phục kết quả, đồng bộ sự kiện storage, ID trùng/sai, lỗi lưu và các luồng học có sẵn. Chưa chạy kiểm tra trình duyệt trong lần sửa này vì môi trường chưa có module Playwright.
