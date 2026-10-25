# Chi tiết Đảo tiếng Anh – Động vật

Trang: `dashboard/english/animals/index.html`. Từ Đảo tiếng Anh, chọn Động vật hoặc Tiếp tục học.

## Công việc đã triển khai

- Tái sử dụng layout chung, palette và font của sản phẩm; bố cục thẻ học và tiến độ theo ảnh tham khảo, có responsive và focus bàn phím.
- 10 thẻ từ, 10 hình SVG tự vẽ, nghĩa tiếng Việt và câu ví dụ.
- Nút quay lại, chọn thẻ, xác nhận học và chuyển từ; đồng bộ tiến độ về thẻ Động vật trên đảo.
- Lưu tiến độ localStorage; mở luyện tập và kiểm tra sau 10 từ; thưởng 20 sao một lần trong dữ liệu bài học.
- Luyện nghe chọn hình và kiểm tra chọn nghĩa, mỗi lượt 10 câu, có phản hồi và tổng kết.

| Từ | Nghĩa | Hình trong `assets/` |
|---|---|---|
| Dog | Con chó | dog.svg |
| Cat | Con mèo | cat.svg |
| Bird | Con chim | bird.svg |
| Fish | Con cá | fish.svg |
| Rabbit | Con thỏ | rabbit.svg |
| Lion | Sư tử | lion.svg |
| Elephant | Con voi | elephant.svg |
| Monkey | Con khỉ | monkey.svg |
| Tiger | Con hổ | tiger.svg |
| Duck | Con vịt | duck.svg |

## Quy tắc trạng thái

`futurelearn.english.animals.v1` lưu `{ learned: [id], current: id, rewarded: boolean }`.

Mở/chọn thẻ và quay lại chỉ thay đổi `current`. Bấm “Đã học” thêm ID hiện tại nếu chưa tồn tại, sau đó chuyển từ. Từ cuối dẫn về từ chưa học nếu còn thiếu. Đủ 10 ID thì mở các bước sau và ghi nhận thưởng; học lại không cộng trùng. Tiến độ = số ID duy nhất / 10, độc lập vị trí thẻ. Dữ liệu hỏng được khôi phục về trạng thái mới, ID không hợp lệ bị loại. Nếu trình duyệt chặn lưu, có thông báo và vẫn học được trong phiên.

Dữ liệu này chỉ ghi nhận bé đã xác nhận xem từ, không khẳng định đã thuộc. Điểm luyện tập/kiểm tra chỉ có trong lượt hiện tại. Sao bài học chưa tích hợp ví sao chung hoặc tài khoản; dashboard khác vẫn dùng fixture minh họa. Xóa dữ liệu trình duyệt sẽ xóa tiến độ. Chưa có đồng bộ giữa thiết bị/tab; cần backend khi triển khai tài khoản thật.

## Cách đơn giản để phát âm

Dùng `SpeechSynthesisUtterance(word.en)` và `speechSynthesis.speak()`, đặt `lang = 'en-US'`, tốc độ `0.8`. Ưu tiên giọng `en-US`, rồi giọng tiếng Anh có sẵn. Mỗi lần bấm hoặc chuyển từ hủy âm cũ bằng `cancel()` để tránh xếp hàng. Không cần API key, tải MP3 hay cache âm thanh. Giọng đọc và khả năng dùng offline phụ thuộc hệ điều hành/trình duyệt; có thông báo khi không hỗ trợ hoặc lỗi. Nếu cần giọng đồng nhất, có thể bổ sung 10 file MP3 được cấp quyền và phát bằng `Audio`.

## Kiểm tra

Chạy `node test-results/check-english-animals.cjs`: kiểm tra 10 tài nguyên, chọn thẻ không tăng tiến độ, chống trùng, khôi phục tiến độ, hoàn thành và thưởng, lượt luyện tập, lời gọi phát âm, dữ liệu hỏng và lỗi lưu. Kiểm tra cú pháp 4 file JS bằng `node --check`, và `git diff --check`.

Chưa kiểm tra trình duyệt thực tế, ảnh chụp responsive hoặc nghe âm thanh trên thiết bị vì môi trường không có Playwright. Test dùng DOM mô phỏng nên không xác nhận bố cục render hoặc giọng hệ thống.
