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
- Trên desktop, thử thách nằm cạnh lộ trình và nhóm bài; “Mục tiêu hôm nay”
  cùng hàng, cùng chiều cao với “Tiếp tục hành trình”. Tablet dùng thử thách
  dạng ngang; màn hình hẹp xếp các phần thành một cột.
- `demo-data.js` là dữ liệu minh họa; thao tác xem trước không thay đổi tiến độ hoặc điểm sao.

## Minh họa

`assets/math-space-hero.webp` được tạo bằng imagegen tích hợp. Prompt cuối:

> Ultra-wide 3:1 children's math-learning banner. A smiling Vietnamese child astronaut riding a red-and-white rocket above a golden moon, with friendly planets, tiny stars and lavender clouds. Soft polished 2D educational game illustration. Reserve the leftmost 32% as a calm text-safe zone. Use lavender, navy, cobalt, yellow and restrained coral accents. No words, numbers, UI, logo or watermark.

## Sao Thủy — Làm quen với con số

- Mở tại `/dashboard/math/mercury/` hoặc bấm Sao Thủy trong lộ trình.
- Sáu nhiệm vụ, mỗi nhiệm vụ có 5 câu trong phạm vi 0–10: tô sao, chọn nhóm, điền số, so sánh, sắp xếp và thử thách tổng hợp.
- Hoàn thành nhiệm vụ trước để mở nhiệm vụ tiếp theo; có thể ôn lại bài đã hoàn thành.
- Tiến độ lưu riêng bằng `futurelearn.math.mercury.v1` trong localStorage, có kiểm tra dữ liệu khi đọc. Không thay đổi sao và dữ liệu demo toàn dashboard.
- Dùng chung điều hướng và bảng màu hiện tại. Trên điện thoại, danh sách nhiệm vụ cuộn ngang, bài tập và gợi ý xếp một cột.

### Kiểm tra triển khai

- Đã kiểm tra bằng Chromium/Playwright: điều hướng từ Sao Thủy, trả lời đúng toàn bộ 30 câu, phản hồi sai, khóa/mở khóa nhiệm vụ, lưu và khôi phục tiến độ, chuẩn hóa dữ liệu lưu không hợp lệ.
- Đã chụp và xem bố cục desktop 1536px; kiểm tra màn hình 390px không tràn ngang và không có lỗi JavaScript.
