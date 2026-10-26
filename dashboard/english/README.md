# Đảo tiếng Anh

Trang học tập độc lập tại `/dashboard/english/`, chạy trên static server từ thư mục gốc dự án. Không cần cài dependency hoặc build.

Header, sidebar và menu mobile dùng chung với các môn khác qua
`../shared/layout.css` và `../shared/layout.js`. `style.css` và `app.js` tại đây
chỉ chứa phần riêng của tiếng Anh. Xem [hướng dẫn layout](../README.md).

## Phase 2

- Banner hành trình với minh họa 2D và nút tiếp tục học.
- Ba chủ đề Động vật, Trái cây, Màu sắc, có trạng thái và thanh tiến độ.
- Thẻ “Tiếp tục hành trình” lấy chủ đề đang học từ `resumeTopicId`, hiển thị tiến độ và mở lại đúng chủ đề.
- Panel mục tiêu hàng ngày, vòng tiến độ, số từ đã học và lời động viên.
- Động vật và Trái cây mở bài học đầy đủ với 10 từ, phát âm, luyện tập và kiểm tra; Màu sắc mở xem trước từ vựng.
- Desktop hiển thị chủ đề và mục tiêu cạnh nhau; tablet đưa mục tiêu xuống dưới; mobile xếp một cột.

## Dữ liệu

`demo-data.js` cung cấp dữ liệu mẫu cho 120 sao, 24 từ và mục tiêu 2/3. Tiến độ Động vật và Trái cây lấy từ localStorage riêng của mỗi chủ đề; bài học lưu từ đã học và kết quả luyện tập, kiểm tra trên trình duyệt. Các số liệu tổng hợp vẫn là dữ liệu mẫu, chưa kết nối API. Thao tác xem trước Màu sắc không thay đổi dữ liệu.

Khi có API, thay `window.englishDashboardData` theo cùng cấu trúc và đặt `isDemo: false` chỉ khi dữ liệu thực đã được kết nối. `resumeTopicId` xác định chủ đề mà nút “Tiếp tục học” mở.

## Minh họa

Bốn ảnh WebP cục bộ nằm trong `assets/`, tổng khoảng 412 KB. Prompt tạo ảnh và công cụ sử dụng được lưu tại `assets/ILLUSTRATIONS.md`.
