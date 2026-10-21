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
- **Bộ sưu tập huy hiệu** tại `/dashboard/badges/` thay thế Khu vườn của bé.
  Liên kết cũ `?panel=garden` chuyển đến trang mới. Menu desktop, drawer và bottom
  nav cùng dẫn đến bộ sưu tập; tài khoản vẫn mở từ avatar trên header.
- Góc phụ huynh và tài khoản mở thông báo đang chuẩn bị qua `?panel=parents`
  và `?panel=profile`. **Xem tất cả** mở danh sách nhiệm vụ và liên kết đến đúng môn.
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
  badges/
    index.html      # Bộ sưu tập, mục tiêu và cửa sổ nhận huy hiệu
    style.css       # Thẻ huy hiệu, responsive và animation nhận thưởng
    app.js          # Bộ lọc, chi tiết, nhận và lưu huy hiệu trên trình duyệt
    demo-data.js    # 12 huy hiệu minh họa, 6 huy hiệu nổi bật
    assets/         # 6 hình huy hiệu, banner và cúp được tạo bằng imagegen
```

Chạy static server từ thư mục gốc dự án. Không cần framework hoặc bước build.
Trang chủ dùng layout riêng trong `index.html` và `public-home/`.

## Cách ghép layout

- Nạp `../shared/layout.css` trước CSS riêng của môn.
- Khai báo trang trên body bằng `data-dashboard="home"`, `english`, `math` hoặc `badges`.
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
`aria-disabled`. Bottom nav hiển thị Góc học tập, Toán, tiếng Anh và Huy hiệu.

Đối tượng `pages` quản lý đường dẫn từng môn, anchor hành trình và nguồn dữ liệu
điểm sao. Thuộc tính `data-dashboard` xác định mục đang mở. Sidebar dùng chung
khóa localStorage `futurelearn-sidebar-collapsed` giữa các môn; vẫn hoạt động khi
trình duyệt chặn storage.

## Bộ sưu tập huy hiệu

Trang dùng màu, font, header và sidebar chung. Sáu huy hiệu nổi bật có ảnh riêng;
**Xem tất cả huy hiệu** hiển thị 12 mốc thành tích, có bộ lọc Đã đạt, Đang chinh phục
và Chưa mở khóa. **Xem huy hiệu của bé** mở các huy hiệu đã nhận. Bấm thẻ để xem
điều kiện, tiến độ hoặc tiếp tục học đúng môn. Mục **Huy hiệu gần đạt** chọn mốc
có tỷ lệ hoàn thành cao nhất trong các mốc chưa đủ điều kiện nhận.

Dữ liệu hiện là minh họa. Từ vựng, chặng Toán, chuỗi ngày học và mục tiêu lấy từ
nguồn demo hiện có; số bài tổng hợp là fixture riêng. Hai huy hiệu mẫu đã đạt và
**Khởi đầu tốt** đủ điều kiện để thử nút **Nhận huy hiệu**. Chỉ thao tác nhận mới
lưu vào khóa `futurelearn-demo-badges-v1`; tải trang hay xem trước bài học không
cộng thành tích. Dữ liệu lưu hỏng hoặc storage bị chặn không làm hỏng trang;
khi không lưu được, cửa sổ nhận thông báo rõ giới hạn của phiên hiện tại.

Animation nhận thưởng gồm huy hiệu bật lên, tia sáng và pháo giấy một lần; có
**Xem lại khoảnh khắc** cho huy hiệu đã đạt. `prefers-reduced-motion` tắt animation.
Dialog dùng được bằng bàn phím, Escape để đóng và trả focus về thẻ tương ứng.
Chưa có đồng bộ tài khoản/API. Prompt và đường dẫn ảnh ở
[badges/assets/ILLUSTRATIONS.md](badges/assets/ILLUSTRATIONS.md).

Kiểm tra trình duyệt: chạy `node test-results/check-badges.cjs` và
`node test-results/check-shared-layout.cjs` khi static server đang phục vụ thư mục
gốc. Đặt `BASE_URL` trỏ đến server; `PLAYWRIGHT_MODULE` chọn package Playwright
nếu chưa có trong môi trường Node hiện tại. `SCREENSHOT_DIR` tùy chọn đổi nơi lưu
ảnh kiểm tra. Script kiểm tra bộ lọc, nhận/lưu/xem lại thưởng, điều hướng cũ,
responsive, bàn phím, storage lỗi và giảm chuyển động. Dự án không có bước build.
