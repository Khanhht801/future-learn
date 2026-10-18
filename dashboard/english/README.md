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
- Các card và CTA mở xem trước từ vựng; chưa phải lesson player hoặc game.
- Desktop hiển thị chủ đề và mục tiêu cạnh nhau; tablet đưa mục tiêu xuống dưới; mobile xếp một cột.

## Dữ liệu

`demo-data.js` là nguồn dữ liệu mẫu duy nhất cho 120 sao, tiến độ chủ đề, 24 từ và mục tiêu 2/3. Không có API, lưu trữ điểm hoặc tự cộng tiến độ. Thao tác xem trước không thay đổi dữ liệu.

Khi có API, thay `window.englishDashboardData` theo cùng cấu trúc và đặt `isDemo: false` chỉ khi dữ liệu thực đã được kết nối. `resumeTopicId` xác định chủ đề mà nút “Tiếp tục học” mở.

## Minh họa

Bốn ảnh WebP cục bộ nằm trong `assets/`, tổng khoảng 412 KB. Prompt tạo ảnh và công cụ sử dụng được lưu tại `assets/ILLUSTRATIONS.md`.
