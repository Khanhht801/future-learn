# FutureLearn

Landing page chạy bằng React, TypeScript và Vite. Các trang học trong `dashboard/` vẫn là trang tĩnh và được sao chép cùng tài nguyên vào bản build.

```sh
npm install
npm run dev
```

Chạy `npm run build` để kiểm tra TypeScript và tạo bản production trong `dist/`; dùng `npm run preview` để xem bản build. Nội dung trang nằm trong `src/LandingPage.tsx`; `src/landing-interactions.js` quản lý vòng đời các tương tác được chuyển từ trang gốc. CSS và tài nguyên hiện có được giữ trong `public-home/`.

Biểu mẫu tư vấn hiện chỉ kiểm tra thông tin trên trình duyệt và chưa kết nối hệ thống tiếp nhận.
