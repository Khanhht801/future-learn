# Chủ đề Màu sắc

Trang `dashboard/english/colors/` gồm 10 từ: Red, Yellow, Blue, Green, Orange, Purple, Pink, Brown, Black, White. Mỗi từ có nghĩa tiếng Việt, hình bút sáp WebP cục bộ và câu ví dụ “This color is …”. Các bút dùng cùng kiểu thân và vòng giấy để bé tập trung phân biệt màu; bút trắng có bóng viền nhẹ để thấy rõ trên nền sáng.

10 hình bút sáp được tạo bằng imagegen tích hợp theo ảnh mẫu của người dùng: tranh thiếu nhi vẽ tay, màu tươi, bề mặt sáp và nét cọ mềm. Mỗi ảnh có một bút, không có chữ, dùng chung cho thẻ học, thư viện từ và lựa chọn luyện tập. Xuất WebP 640px, chất lượng 88; prompt từng màu và đường dẫn PNG gốc lưu trong `assets/generation-sources.json`.

Dùng chung giao diện và logic với Động vật: phát âm en-US, học từ, chuyển từ, thư viện từ, toàn màn hình, hoàn thành và nhận thưởng, luyện nghe chọn hình, kiểm tra và màn hình kết quả. Học đủ 10 từ để mở luyện tập và kiểm tra.

Tiến độ, phần thưởng và kết quả lưu riêng trong `futurelearn.english.colors.v1`, cập nhật về thẻ Màu sắc trên Đảo tiếng Anh. Không thay đổi tiến độ Động vật hoặc Trái cây. Phát âm dùng Speech Synthesis; số sao và số từ tổng hợp trên đảo vẫn là dữ liệu mẫu.

Kiểm tra trình duyệt: `node test-results/check-english-colors.cjs` (cần Playwright và static server, mặc định cổng 4175). Có thể chỉ định `PLAYWRIGHT_MODULE` và `BASE_URL`.
