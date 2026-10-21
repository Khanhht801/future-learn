# Hành tinh Toán

Trang học Toán độc lập tại `/dashboard/math/`, dùng chung hệ màu, typography, header và sidebar với dashboard English.

Khung giao diện và hành vi menu nằm trong `../shared/layout.css` và
`../shared/layout.js`. `style.css` và `app.js` tại đây chỉ chứa phần riêng của
môn Toán. Xem [hướng dẫn layout](../README.md).

## Nội dung

- Banner hành trình không gian trải ngang phía trên bố cục hai cột, đồng bộ
  thẻ nội dung và CTA với trang Đảo tiếng Anh; CTA mở bài Phép cộng.
- Lộ trình 5 chặng với minh họa SVG riêng cho Sao Thủy, Sao Kim, Trái Đất,
  Sao Hỏa và Sao Thổ. Tên hành tinh đi kèm tên bài; dấu tích, quầng sáng và
  biểu tượng khóa thể hiện trạng thái đã học, đang học và chưa mở khóa.
- Hai nhóm bài Cộng và trừ, Hình học.
- Thẻ “Tiếp tục hành trình” dưới các nhóm bài, hiển thị chặng đang học và số
  chặng đã hoàn thành từ dữ liệu lộ trình; nút “Học tiếp” mở bài của chặng đó.
  Thẻ ẩn khi không có chặng đang học tương ứng với một bài học hợp lệ.
- Thử thách nhanh có phản hồi đúng/sai và mục tiêu 2/3 bài.
- `demo-data.js` là dữ liệu minh họa; thao tác xem trước không thay đổi tiến độ hoặc điểm sao.

## Minh họa

`assets/math-space-hero.webp` được tạo bằng imagegen tích hợp. Prompt cuối:

> Ultra-wide 3:1 children's math-learning banner. A smiling Vietnamese child astronaut riding a red-and-white rocket above a golden moon, with friendly planets, tiny stars and lavender clouds. Soft polished 2D educational game illustration. Reserve the leftmost 32% as a calm text-safe zone. Use lavender, navy, cobalt, yellow and restrained coral accents. No words, numbers, UI, logo or watermark.
