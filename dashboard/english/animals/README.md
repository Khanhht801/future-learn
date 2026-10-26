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

## Phiên âm IPA trên card

`phonetics.js` dùng `fetch()` gọi Free Dictionary API (`https://dictionaryapi.dev/`) khi mở từ, hiển thị IPA trước nghĩa tiếng Việt (ví dụ `/bɝd/ · Con chim`). Chỉ chọn mục `phonetics` có phiên âm và đường dẫn audio kết thúc bằng `-us.mp3` để khớp giọng Mỹ; đây là quy ước tên file đang dùng của nguồn API, không phải trường locale chính thức. Không lấy phiên âm vùng khác khi thiếu bản US. Không tải/phát audio của API; nút nghe vẫn dùng `speechSynthesis` với `en-US`.

Kết quả thành công được cache 30 ngày trong localStorage và dùng lại trong phiên nếu không lưu được. Các yêu cầu đồng thời cho cùng từ được gộp lại; timeout 8 giây. Nếu API lỗi, trả 404 hoặc thiếu IPA US thì giữ nghĩa tiếng Việt, ẩn phiên âm và thử lại khi mở từ sau đó. Kết quả đến muộn không ghi sang card từ khác. Nguồn bên ngoài có thể thiếu dữ liệu (khi kiểm tra, dog/cat/fish trả 404); không bảo đảm mọi từ đều có IPA.

Kiểm tra bổ sung: `node test-results/check-animal-phonetics.cjs` kiểm tra chọn US, cache, gộp yêu cầu, dữ liệu lỗi và lỗi mạng/lưu trữ.

### Rà soát phiên âm (26/10/2026)

`ɹ` là ký hiệu IPA hợp lệ cho âm approximant tiếng Anh, không phải lỗi chính tả. Giao diện dùng quy ước từ điển cho người học: đổi `ɹ` thành `r` cả khi nhận API và đọc cache cũ. Ví dụ rabbit hiển thị `/ˈræbɪt/`, tương ứng Cambridge `/ˈræb.ɪt/` và Oxford `/ˈræbɪt/`; dấu chấm chỉ ranh giới âm tiết. Không tự đổi các nguyên âm Mỹ `ɝ`, `ɚ`, `ɛ` hoặc thêm dấu dài vì các từ điển có quy ước phiên âm khác nhau.

Đã gọi lại API cho cả 10 từ; kết quả US và cách hiển thị sau chuẩn hóa:

| Từ | IPA hiển thị | Kết quả API |
|---|---|---|
| Dog | — | 404, không có dữ liệu để hiển thị |
| Cat | — | 404, không có dữ liệu để hiển thị |
| Bird | /bɝd/ | Có US |
| Fish | — | 404, không có dữ liệu để hiển thị |
| Rabbit | /ˈræbɪt/ | Có US; nguồn ghi /ˈɹæbɪt/ |
| Lion | /ˈlaɪən/ | Có US |
| Elephant | /ˈɛləfənt/ | Có US |
| Monkey | /ˈmʌŋki/ | Có US |
| Tiger | /ˈtaɪɡɚ/ | Có US |
| Duck | /dʌk/ | Có US |

Nguồn đối chiếu ký hiệu: [IPA chart](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html), [Cambridge rabbit](https://dictionary.cambridge.org/us/pronunciation/english/rabbit), [Oxford rabbit](https://www.oxfordlearnersdictionaries.com/us/definition/english/rabbit_1), [quy ước Cambridge](https://dictionary.cambridge.org/help/phonetics.html). Bảng ghi nhận kết quả API lúc kiểm tra, không thay thế nguồn dữ liệu runtime hoặc thêm phiên âm tĩnh.

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
