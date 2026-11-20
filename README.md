# FutureLearn

Landing page và toàn bộ dashboard chạy bằng React, TypeScript và Vite. Dashboard có 9 entry HTML để giữ các đường dẫn hiện tại; Vite build từng entry và tải riêng component của mỗi trang. Xem [cấu trúc dashboard](dashboard/README.md).

```sh
npm install
npm run dev
```

Chạy `npm run build` để kiểm tra TypeScript và tạo bản production trong `dist/`; dùng `npm run preview` để xem bản build. Chạy `npm test` để kiểm tra các tương tác bằng Vitest và jsdom.

`src/LandingPage.tsx` ghép các component trong `src/components/landing/`: header, footer và từng section. Các thẻ giáo viên, chương trình, đánh giá, nút vào học và biểu mẫu tư vấn có component riêng. `src/data/landing.ts` chứa nội dung các danh sách để cập nhật mà không phải sửa cấu trúc giao diện.

State và sự kiện giao diện nằm ở component tương ứng; `src/hooks/` chứa logic dùng chung cho carousel, hiệu ứng xuất hiện, điều hướng theo vị trí cuộn, media query và trạng thái hiển thị của trang. Các hook dọn timer và observer khi component unmount; nhóm đánh giá lặp được render bằng React. CSS và tài nguyên hiện có được giữ trong `public-home/`.

Biểu mẫu tư vấn hiện chỉ kiểm tra thông tin trên trình duyệt và chưa kết nối hệ thống tiếp nhận.

Stylesheet cục bộ dùng URL không có `?v=`: Vite dùng tham số này cho cache dependency và có thể lưu nhầm bản JavaScript của CSS khi tải lại trong dev. Vite tự đặt tên có hash cho CSS production. Kiểm tra hồi quy cache bằng `DEV_SERVER=1 BASE_URL=http://localhost:5173 node scripts/check-stylesheets.cjs` (cần Playwright; trên PowerShell đặt các biến môi trường bằng `$env:`). Script giữ HTTP cache thật, nạp trước cả bản JS và các URL phiên bản cũ rồi kiểm tra trang chủ cùng 9 trang dashboard sau reload.

Giao di?n ??ng nh?p v? ??ng k? c? th? m? t? thanh ?i?u h??ng. D? ?n ch?a c? d?ch v? x?c th?c: bi?u m?u ch? ki?m tra d? li?u tr?n tr?nh duy?t v? ch?a t?o t?i kho?n hay ??ng nh?p.
