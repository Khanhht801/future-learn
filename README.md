# FutureLearn

Landing page chạy bằng React, TypeScript và Vite. Các trang học trong `dashboard/` vẫn là trang tĩnh và được sao chép cùng tài nguyên vào bản build.

```sh
npm install
npm run dev
```

Chạy `npm run build` để kiểm tra TypeScript và tạo bản production trong `dist/`; dùng `npm run preview` để xem bản build. Chạy `npm test` để kiểm tra các tương tác bằng Vitest và jsdom.

`src/LandingPage.tsx` ghép các component trong `src/components/landing/`: header, footer và từng section. Các thẻ giáo viên, chương trình, đánh giá, nút vào học và biểu mẫu tư vấn có component riêng. `src/data/landing.ts` chứa nội dung các danh sách để cập nhật mà không phải sửa cấu trúc giao diện.

State và sự kiện giao diện nằm ở component tương ứng; `src/hooks/` chứa logic dùng chung cho carousel, hiệu ứng xuất hiện, điều hướng theo vị trí cuộn, media query và trạng thái hiển thị của trang. Các hook dọn timer và observer khi component unmount; nhóm đánh giá lặp được render bằng React. CSS và tài nguyên hiện có được giữ trong `public-home/`.

Biểu mẫu tư vấn hiện chỉ kiểm tra thông tin trên trình duyệt và chưa kết nối hệ thống tiếp nhận.
