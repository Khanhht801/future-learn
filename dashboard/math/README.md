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
- Sáu nhiệm vụ trong phạm vi 0–10: tô hình có 10 câu, các nhiệm vụ còn lại có 5 câu: tô sao, chọn nhóm, điền số, so sánh, sắp xếp và thử thách tổng hợp.
- Hoàn thành nhiệm vụ trước để mở nhiệm vụ tiếp theo; có thể ôn lại bài đã hoàn thành.
- Tiến độ lưu riêng bằng `futurelearn.math.mercury.v2` trong localStorage, có kiểm tra dữ liệu khi đọc. Không thay đổi sao và dữ liệu demo toàn dashboard.
- Dùng chung điều hướng và bảng màu hiện tại. Trên điện thoại, danh sách nhiệm vụ cuộn ngang, bài tập và gợi ý xếp một cột.

### Kiểm tra triển khai

- Đã kiểm tra bằng Chromium/Playwright: điều hướng từ Sao Thủy, trả lời đúng toàn bộ 30 câu, phản hồi sai, khóa/mở khóa nhiệm vụ, lưu và khôi phục tiến độ, chuẩn hóa dữ liệu lưu không hợp lệ.
- Đã chụp và xem bố cục desktop 1536px; kiểm tra màn hình 390px không tràn ngang và không có lỗi JavaScript.

### Các hình trong bài tô màu

Nhiệm vụ đầu dùng lần lượt ngôi sao, hình tròn, bông hoa, trái tim và hình vuông. Tiêu đề, hướng dẫn, bộ đếm và nhãn hỗ trợ đọc màn hình cập nhật theo từng hình; mỗi hình có màu tô riêng. Tiến độ đã lưu được giữ nguyên.

Đã kiểm tra bằng Chromium/Playwright: cả năm hình, tô/bỏ màu, câu số 0, đáp án, mở khóa, lưu tiến độ và không tràn ngang ở 390px; không có lỗi JavaScript.

### Minh họa chibi

Bài tô màu dùng năm ảnh chibi nền trong suốt, tạo bằng imagegen tích hợp: sao vàng, tròn xanh, hoa hồng, tim hồng và vuông tím. Các ảnh WebP 256px nằm tại `mercury/assets/`; prompt đầy đủ ghi trong `mercury/assets/README.md`. Trạng thái chưa tô hiển thị xám, bấm vào hiện màu gốc; ô gợi ý dùng cùng bộ hình.

Đã xem ảnh desktop và mobile; kiểm tra Chromium/Playwright cho đủ năm ảnh, tải ảnh thành công, đổi màu/bỏ màu, nhãn và gợi ý, câu số 0, đáp án, mở khóa và lưu tiến độ; màn hình 390px không tràn ngang, không có lỗi JavaScript. Đã kiểm tra cú pháp JavaScript và Git diff.

### Màu sắc và banner theo mẫu

- Riêng trang Sao Thủy dùng nền xanh nhạt, chữ navy, trạng thái đang học xanh dương, nút xanh sáng và thẻ số vàng; các trang khác giữ bảng màu riêng.
- Banner chibi Sao Thủy, phi hành gia và robot có biển gỗ với tiêu đề HTML; khung mục tiêu đặt bên phải trên desktop và phía dưới trên màn hình nhỏ.
- Sidebar dùng lại minh họa banner và liên kết về lộ trình; nhiệm vụ có icon và đường nối theo thứ tự.
- Đã xem ảnh desktop/mobile, kiểm tra banner tải thành công và không tràn ngang ở 320, 390, 768, 1024, 1366, 1536px. Đã kiểm tra lại cả năm hình, tô/bỏ màu, đáp án, mở khóa và lưu tiến độ bằng Chromium/Playwright, không có lỗi JavaScript.


### Tăng bài tô hình lên 10 câu

Nhiệm vụ đầu có 10 câu với 5 loại hình chibi luân phiên; các nhiệm vụ khác giữ 5 câu. Tiến độ, bộ đếm và mở khóa dùng số câu riêng của từng nhiệm vụ. Dữ liệu v1 được chuyển khi đọc: bài tô hình đã hoàn thành giữ trạng thái hoàn thành; bài đang học giữ số câu đã làm. Dữ liệu mới lưu ở `futurelearn.math.mercury.v2`.

Đã kiểm tra Chromium/Playwright: đủ 10 câu, khóa đến câu cuối, tải lại sau câu 6, mở bài tiếp theo với 5 câu, chơi lại và chuyển tiến độ cũ cả trường hợp đã hoàn thành và đang học; không lỗi JavaScript. Đã chạy `node --check` và `git diff --check`.
