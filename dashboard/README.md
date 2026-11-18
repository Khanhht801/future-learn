# Dashboard React

Toàn bộ dashboard dùng React + TypeScript. Chạy từ thư mục gốc dự án:

```sh
npm install
npm run dev
npm run build
npm run preview -- --port 4175
```

Vite build 9 entry HTML, giữ đường dẫn và metadata từng trang. Mỗi trang tải component riêng qua React lazy; không cần cấu hình server chuyển mọi URL về trang chủ. Bản production nằm trong `dist/`. Đường dẫn asset tương đối và menu dùng được khi host dưới thư mục con.

## Component và trạng thái

```text
src/dashboard/
  main.tsx                       # Chọn trang theo URL, lazy loading
  components/
    DashboardLayout.tsx          # Header, sidebar, drawer, bottom nav
    Dialog.tsx                   # Modal, Escape, giữ/trả focus
    MercuryActivities.tsx        # Tô hình, nhóm, dãy số, so sánh, sắp xếp, gợi ý
    DraggableChoice.tsx          # Kéo thả bằng chuột/cảm ứng và lựa chọn bàn phím
  pages/
    HomePage.tsx / Home.tsx       # Banner, môn học, mục tiêu, nhiệm vụ
    MathPage.tsx / Math.tsx       # Hành trình, bài học, thử thách nhanh
    EnglishPage.tsx / English.tsx # Chủ đề, tiến độ và tiếp tục học
    BadgesPage.tsx / Badges.tsx   # Bộ lọc, nhận huy hiệu và hiệu ứng
    ParentsPage.tsx / Parents.tsx # Báo cáo, biểu đồ, số liệu, hoạt động
    VocabularyPage.tsx / Vocabulary.tsx # Một bộ component cho cả 3 chủ đề
    MercuryPage.tsx / Mercury.tsx # 6 nhiệm vụ, mỗi nhiệm vụ 10 câu
  hooks/
    useSpeech.ts                 # Phát âm en-US, hủy âm khi chuyển nội dung
    useFullscreen.ts             # API thật + overlay dự phòng, inert, focus
    useDragScroll.ts             # Cuộn thư viện từ và thanh bước học
  data/                          # Fixture và nội dung từ vựng, không dùng window globals
  lib/
    navigation.ts                # URL dưới thư mục con, nhớ bài vừa mở
    progress.ts                  # Chuẩn hóa/lưu tiến độ 3 chủ đề
    mercury-progress.ts          # Khôi phục và chuyển dữ liệu v1/v2 sang v3
```

Các file `*Page.tsx` chia giao diện theo section; file cùng tên không có hậu tố Page chứa hook điều khiển và component danh sách. Nội dung động render bằng JSX, sự kiện và state React. Listener, observer, phát âm và Fullscreen API có cleanup khi component unmount. Không tải các script DOM cũ, không chèn HTML để dựng trang.

CSS, font và hình ảnh hiện có được giữ trong `dashboard/` để bảo toàn layout, breakpoint và hiệu ứng. Header/sidebar dùng chung `shared/layout.css`. Sửa danh sách menu tại `DashboardLayout.tsx`; desktop, drawer và bottom nav cùng đọc một nguồn. Không giới hạn câu mô tả bằng số ký tự; màn hẹp xuống dòng tự nhiên.

## Đường dẫn

| Trang | URL |
|---|---|
| Góc học tập | /dashboard/ |
| Hành tinh Toán | /dashboard/math/ |
| Đảo tiếng Anh | /dashboard/english/ |
| Huy hiệu | /dashboard/badges/ |
| Góc phụ huynh | /dashboard/parents/ |
| Sao Thủy | /dashboard/math/mercury/ |
| Động vật | /dashboard/english/animals/ |
| Trái cây | /dashboard/english/fruit/ |
| Màu sắc | /dashboard/english/colors/ |

Các URL có `index.html` cũng hoạt động. Query `?lesson=addition` mở xem trước bài Toán hợp lệ; `?topic=animals` mở bài từ vựng tương ứng. Liên kết cũ `?panel=garden` / `?panel=parents` chuyển đến trang mới, `?panel=profile` mở hồ sơ minh họa.

## Dữ liệu và lưu trữ

Các chỉ số tổng quan, mục tiêu, sao và báo cáo vẫn là dữ liệu minh họa; chưa kết nối API/tài khoản. Chỉ thao tác xác nhận học, trả lời đúng hoặc nhận huy hiệu mới ghi tiến độ tương ứng. Mở trang hay mở dialog không cộng thành tích.

Giữ nguyên khóa localStorage: `futurelearn-sidebar-collapsed`, `futurelearn-resume-subject` / `futurelearn-resume-item`, `futurelearn-demo-badges-v1`, `futurelearn.english.{animals,fruit,colors}.v1` và `futurelearn.math.mercury.v3`. Sao Thủy đọc được dữ liệu v1/v2 và giữ các nhiệm vụ đã hoàn thành. Tiến độ từ vựng loại ID lạ/trùng, kiểm tra kết quả hợp lệ và cập nhật giữa các tab. Dữ liệu hỏng hoặc storage bị chặn không làm hỏng trang.

## Kiểm tra

```sh
npm run build
npm test -- src/dashboard/lib/progress.test.tsx
node scripts/check-dashboard.cjs
node test-results/check-math-sequence.cjs
node test-results/check-math-comparison.cjs
node test-results/check-badges.cjs
```

Các kiểm tra trình duyệt cần Playwright và server preview (mặc định `http://127.0.0.1:4175`). Có thể đặt `BASE_URL`, `PLAYWRIGHT_MODULE` để trỏ tới module Playwright đã cài; `BROWSER_CHANNEL=msedge` cho script React nếu dùng Edge. `SCREENSHOT_DIR` tùy chọn lưu ảnh của bộ kiểm tra React/huy hiệu.

`check-dashboard.cjs` kiểm tra 9 route ở 320/390/768/1024/1440px, menu và bàn phím, query/resume, báo cáo, 3 chủ đề từ vựng, chấm điểm thử lại, các ngưỡng kết quả quiz, Fullscreen API thật/dự phòng, đủ 60 câu Sao Thủy, lưu tiến độ và hosting dưới thư mục con. Hai script Toán kiểm tra sâu kéo thả chuột/cảm ứng, điền bằng bàn phím và gợi ý. Script huy hiệu kiểm tra nhận/lưu/xem lại, đồng bộ tab, storage hỏng/bị chặn và reduced motion. Các script cũ kiểm tra mã nguồn HTML/JS tĩnh trong `test-results/` là tài liệu của bản trước; dùng các lệnh trên cho bản React.
