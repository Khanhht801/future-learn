# Chi tiết Đảo tiếng Anh – Động vật

Trang: `dashboard/english/animals/index.html`. Từ Đảo tiếng Anh, chọn Động vật hoặc Tiếp tục học.

## Công việc đã triển khai

- Tái sử dụng layout chung, palette và font của sản phẩm; bố cục thẻ học và tiến độ theo ảnh tham khảo, có responsive và focus bàn phím.
- 10 thẻ từ, 10 ảnh WebP tạo bằng imagegen tích hợp, nghĩa tiếng Việt và câu ví dụ.
- Nút quay lại, chọn thẻ, xác nhận học và chuyển từ; đồng bộ tiến độ về thẻ Động vật trên đảo.
- Lưu tiến độ localStorage; mở luyện tập và kiểm tra sau 10 từ; thưởng 20 sao một lần trong dữ liệu bài học.
- Luyện nghe chọn hình và kiểm tra chọn nghĩa, mỗi lượt 10 câu, có phản hồi và tổng kết.

| Từ | Nghĩa | Hình trong `assets/` |
|---|---|---|
| Dog | Con chó | dog.webp |
| Cat | Con mèo | cat.webp |
| Bird | Con chim | bird.webp |
| Fish | Con cá | fish.webp |
| Rabbit | Con thỏ | rabbit.webp |
| Lion | Sư tử | lion.webp |
| Elephant | Con voi | elephant.webp |
| Monkey | Con khỉ | monkey.webp |
| Tiger | Con hổ | tiger.webp |
| Duck | Con vịt | duck.webp |

## Quy tắc trạng thái

`futurelearn.english.animals.v1` lưu `{ learned: [id], current: id, rewarded: boolean }`.

Mở/chọn thẻ và quay lại chỉ thay đổi `current`. Bấm “Tiếp theo” thêm ID hiện tại nếu chưa tồn tại, sau đó chuyển từ. Từ cuối dẫn về từ chưa học nếu còn thiếu. Đủ 10 ID thì mở các bước sau và ghi nhận thưởng; học lại không cộng trùng. Tiến độ = số ID duy nhất / 10, độc lập vị trí thẻ. Dữ liệu hỏng được khôi phục về trạng thái mới, ID không hợp lệ bị loại. Nếu trình duyệt chặn lưu, có thông báo và vẫn học được trong phiên.

Dữ liệu này chỉ ghi nhận bé đã xác nhận xem từ, không khẳng định đã thuộc. Điểm luyện tập/kiểm tra chỉ có trong lượt hiện tại. Sao bài học chưa tích hợp ví sao chung hoặc tài khoản; dashboard khác vẫn dùng fixture minh họa. Xóa dữ liệu trình duyệt sẽ xóa tiến độ. Chưa có đồng bộ giữa thiết bị/tab; cần backend khi triển khai tài khoản thật.

## Cách đơn giản để phát âm

Dùng `SpeechSynthesisUtterance(word.en)` và `speechSynthesis.speak()`, đặt `lang = 'en-US'`, tốc độ `0.8`. Thống nhất tiếng Anh Mỹ: chọn giọng `en-US` nếu có; nếu chưa có, để trình duyệt chọn theo `lang = 'en-US'`, không chủ động chọn giọng tiếng Anh vùng khác. Mỗi lần bấm hoặc chuyển từ hủy âm cũ bằng `cancel()` để tránh xếp hàng. Không cần API key, tải MP3 hay cache âm thanh. Giọng đọc và khả năng dùng offline phụ thuộc hệ điều hành/trình duyệt; có thông báo khi không hỗ trợ hoặc lỗi. Nếu cần giọng đồng nhất, có thể bổ sung 10 file MP3 được cấp quyền và phát bằng `Audio`.

## Card toàn màn hình

Nút góc trên bên phải card dùng Fullscreen API để phóng to chính card hiện tại. Khi vào toàn màn hình thật, ẩn nút này và chuyển focus tới nút nghe; thoát bằng Esc hoặc điều khiển trình duyệt. Giữ nguyên từ, tiến độ và chế độ bài học. Ảnh tăng tối đa 720 × 680px, chữ từ vựng tối đa 112px, nghĩa 40px và ví dụ 38px; khung nội dung mở rộng tới 1600px để tận dụng màn hình lớn. Bố cục điện thoại có kích thước riêng để giữ nội dung dễ đọc. Hộp phản hồi bài tập nằm trong card để vẫn xuất hiện trong toàn màn hình. Nếu API không hỗ trợ hoặc bị từ chối, dùng lớp phủ kín cửa sổ, khóa cuộn và vô hiệu hóa phần bên ngoài bằng `inert`; hỗ trợ Esc và giữ vòng Tab trong card. Chỉ chế độ dự phòng giữ nút chữ “Thoát”, không dùng biểu tượng thu nhỏ, để thiết bị cảm ứng có đường thoát. Khi thoát trả focus về phần tử trước đó.

Kiểm tra trình duyệt: `node test-results/check-animal-fullscreen.cjs` (cần Playwright và Microsoft Edge, có thể đặt `PLAYWRIGHT_MODULE`). Bao gồm API thật, API bị từ chối, thoát/vào lại, giữ tiến độ, hộp phản hồi, nút thoát theo chế độ và các chiều rộng 1920/1280/820/390/320px.

## Kiểm tra bài học

Chạy `node test-results/check-english-animals.cjs`: kiểm tra 10 tài nguyên, chọn thẻ không tăng tiến độ, chống trùng, khôi phục tiến độ, hoàn thành và thưởng, lượt luyện tập, lời gọi phát âm, dữ liệu hỏng và lỗi lưu. Kiểm tra cú pháp 4 file JS bằng `node --check`, và `git diff --check`.


## Điều chỉnh theo ảnh mẫu (25/10/2026)

- Đã bỏ banner và lời giới thiệu, chỉ giữ đường dẫn cùng tiêu đề trang gọn phía trên các bước học.
- Bỏ thanh “Đã học 0/10” trong thẻ học, giữ vòng tiến độ bên phải. Có 10 chấm chọn từ độc lập với số từ đã học.
- Tab Học từ mới / Luyện tập / Kiểm tra có icon sách / game / cúp. Tất cả nút hoạt động chưa đủ 10 từ đều bị khóa; icon khóa ẩn sau khi đủ điều kiện.
- Nút loa căn giữa icon bằng grid, đặt cạnh tên từ và có chú thích “Bấm để nghe”. Từ chính trong câu ví dụ dùng chữ đậm màu xanh.
- Nút chuyển từ luôn ghi “Tiếp theo”; thao tác vẫn đánh dấu từ hiện tại đã học. Ô thưởng có hình sao và “+20 sao khi hoàn thành”, đổi sang “+20 sao đã nhận” khi hoàn tất.
- 10 ảnh động vật thay SVG cũ; cùng dùng cho thẻ chính, thư viện và lựa chọn luyện tập. Ảnh ở `assets/*.webp`. Ảnh banner cũ được giữ trong tài nguyên nhưng không còn tải trên trang. Prompt cuối cùng, tên file nguồn và công cụ tạo ảnh được lưu trong `assets/generation-sources.json`. Dùng imagegen tích hợp, không dùng CLI/API fallback. PNG nguồn được giữ lại trong generated_images, bản WebP được xuất tối ưu cho web.

Kiểm tra bổ sung: `node test-results/check-english-animals-browser.cjs` với Playwright (có thể chỉ định đường dẫn module qua `PLAYWRIGHT_MODULE`). Đã chạy Chromium ở 1586, 1280, 820, 390 và 320px: không tràn ngang; 10 ảnh tải được; kiểm tra khóa/mở khóa, tô nổi từ, nhãn Tiếp theo, căn giữa icon loa, lưu tiến độ và liên kết về đảo. Có ảnh chụp desktop/tablet/mobile trong `test-results/english-animals-*.png`. Lời gọi phát âm được mock để kiểm tra từ và ngôn ngữ; chưa nghe giọng hệ thống bằng tai.
