# Dashboard layout

## Góc học tập

`/dashboard/` là điểm đến đầu tiên của cả hai nút **Vào học** trên trang chủ.
Trang dùng chung `shared/layout.css` và `shared/layout.js` với hai môn học, có
banner, thẻ Toán/tiếng Anh, mục tiêu, chuỗi ngày học và nhiệm vụ hôm nay.

- Toán: `/dashboard/math/`; nhiệm vụ mở `?lesson=addition`.
- Tiếng Anh: `/dashboard/english/`; nhiệm vụ mở `?topic=animals`.
- `learning-links.js` mở đúng nội dung xem trước từ query đã kiểm tra và lưu môn,
  chủ đề vừa mở trong trình duyệt. **Tiếp tục học** lấy lại lựa chọn này.
- `demo-data.js` chứa hồ sơ, chuỗi ngày học và nhiệm vụ mẫu. Tiến độ môn lấy từ
  `math/demo-data.js` và `english/demo-data.js`; mở trang không cộng điểm hoặc
  đánh dấu hoàn thành. Chưa kết nối API hay đăng nhập.
- Khu vườn, Góc phụ huynh và tài khoản mở thông báo trạng thái đang chuẩn bị.
  Các liên kết `?panel=garden`, `?panel=parents`, `?panel=profile` dùng được từ
  cả ba trang. **Xem tất cả** mở danh sách nhiệm vụ và liên kết đến đúng môn.
- Ảnh banner, công cụ tạo và prompt cuối được ghi trong
  [assets/ILLUSTRATIONS.md](assets/ILLUSTRATIONS.md).

`index.html`, `style.css` và `app.js` tại thư mục dashboard chỉ phụ trách nội dung
Góc học tập. Khung điều hướng vẫn được quản lý tập trung trong `shared/`.

Góc học tập `/dashboard/`, tiếng Anh `/dashboard/english/` và Toán
`/dashboard/math/` dùng chung khung giao diện:

```text
dashboard/
  index.html        # Nội dung tổng quan Góc học tập
  style.css         # CSS riêng của trang tổng quan
  app.js            # Logic mục tiêu và nhiệm vụ của trang tổng quan
  shared/
    layout.js       # Header, sidebar, drawer, bottom nav và hành vi menu
    layout.css      # Token, reset, khung responsive, button, dialog dùng chung
    assets/         # Hình trang trí sidebar và biểu tượng Toán
  english/
    index.html      # Nội dung môn tiếng Anh
    style.css       # CSS riêng của nội dung tiếng Anh
    app.js          # Logic chủ đề, tiến độ, xem trước từ vựng
    demo-data.js
  math/
    index.html      # Nội dung môn Toán
    style.css       # CSS riêng của nội dung Toán
    app.js          # Logic lộ trình, bài học, thử thách nhanh
    demo-data.js
```

Chạy static server từ thư mục gốc dự án. Không cần framework hoặc bước build.
Trang chủ dùng layout riêng trong `index.html` và `public-home/`.

## Cách ghép layout

- Nạp `../shared/layout.css` trước CSS riêng của môn.
- Khai báo trang trên body bằng `data-dashboard="home"`, `english` hoặc `math`.
- Đặt `<div data-dashboard-header></div>` trước nội dung chính và
  `<div data-dashboard-footer></div>` ở cuối nội dung.
- Giữ một `<main id="main-content" class="dashboard-main">` trong trang.
- Nạp script theo thứ tự: dữ liệu môn → `../shared/layout.js` → logic riêng môn.
  Các script chạy tuần tự ở cuối body, không dùng `async`.

Layout được ghép đồng bộ từ template JavaScript, không cần fetch HTML. Đường dẫn
được tính từ URL của `layout.js`, nên dùng được khi host dự án trong thư mục con.
Khi tắt JavaScript, các trang vẫn có liên kết điều hướng trong `noscript`.

## Sửa hoặc thêm menu

Sửa `navigation` trong `shared/layout.js`: desktop, drawer và bottom nav cùng lấy
từ một danh sách. Mục có `path` là liên kết; mục chưa có trang giữ trạng thái
`aria-disabled`. Bottom nav hiển thị ba mục đầu và nút tài khoản.

Đối tượng `pages` quản lý đường dẫn từng môn, anchor hành trình và nguồn dữ liệu
điểm sao. Thuộc tính `data-dashboard` xác định mục đang mở. Sidebar dùng chung
khóa localStorage `futurelearn-sidebar-collapsed` giữa các môn; vẫn hoạt động khi
trình duyệt chặn storage.
