# Đảo tiếng Anh

Trang React tại `/dashboard/english/`. Chạy `npm run dev` từ thư mục gốc; dùng `npm run build` và `npm run preview` để kiểm tra bản production.

Header, sidebar và menu mobile dùng chung qua `src/dashboard/components/DashboardLayout.tsx` và `shared/layout.css`. `src/dashboard/pages/EnglishPage.tsx` chia giao diện theo section, `English.tsx` quản lý state và danh sách chủ đề. CSS riêng vẫn ở `style.css`. Xem [hướng dẫn layout](../README.md).

## Phase 2

- Banner hành trình với minh họa 2D và nút tiếp tục học.
- Ba chủ đề Động vật, Trái cây, Màu sắc, có trạng thái và thanh tiến độ.
- Thẻ “Tiếp tục hành trình” lấy chủ đề đang học từ `resumeTopicId`, hiển thị tiến độ và mở lại đúng chủ đề.
- Panel mục tiêu hàng ngày, vòng tiến độ, số từ đã học và lời động viên.
- Cả ba chủ đề Động vật, Trái cây và Màu sắc mở bài học đầy đủ với 10 từ, phát âm, luyện tập và kiểm tra.
- Desktop hiển thị chủ đề và mục tiêu cạnh nhau; tablet đưa mục tiêu xuống dưới; mobile xếp một cột.

## Dữ liệu

`src/dashboard/data/english.ts` cung cấp dữ liệu mẫu cho 120 sao, 24 từ và mục tiêu 2/3. Tiến độ Động vật, Trái cây và Màu sắc lấy từ localStorage riêng của mỗi chủ đề; bài học lưu từ đã học và kết quả luyện tập, kiểm tra trên trình duyệt. Các số liệu tổng hợp vẫn là dữ liệu mẫu, chưa kết nối API.

Khi có API, thay nguồn fixture trong hook `src/dashboard/pages/English.tsx` và đặt `isDemo: false` chỉ khi dữ liệu thực đã được kết nối. `resumeTopicId` xác định chủ đề mà nút “Tiếp tục học” mở.

## Minh họa

Bốn ảnh WebP cục bộ nằm trong `assets/`, tổng khoảng 412 KB. Prompt tạo ảnh và công cụ sử dụng được lưu tại `assets/ILLUSTRATIONS.md`.
