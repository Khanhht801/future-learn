# Quy tắc làm việc

## Xuống dòng nội dung giao diện

- Khi màn hình và vùng nội dung còn đủ chiều rộng, giữ các câu mô tả, khích lệ và kết quả trên một dòng; không đặt giới hạn chiều rộng theo ký tự làm câu xuống dòng sớm hoặc rơi một vài từ xuống dưới. Áp dụng cho các phần giao diện bổ sung về sau.
- Trên màn hình hẹp, vẫn cho phép xuống dòng tự nhiên để tránh tràn ngang; không ép `white-space: nowrap` cho câu dài trên mọi kích thước màn hình.

## Tự động commit sau khi hoàn thành mỗi công việc

- Sau khi hoàn thành mỗi công việc có thay đổi file trong dự án (tạo hoặc sửa trang, sửa lỗi, refactor, cập nhật tài liệu, cấu hình hoặc rule), thực hiện các kiểm tra phù hợp rồi tự động tạo một Git commit riêng trước khi chuyển sang công việc tiếp theo hoặc báo hoàn tất. Không cần hỏi lại người dùng. Nếu công việc không làm thay đổi file, không tạo commit rỗng.
- Chỉ stage các thay đổi thuộc công việc vừa hoàn thành, bao gồm tài nguyên dùng chung có liên quan; không đưa các thay đổi có sẵn của người dùng hoặc công việc chưa hoàn tất vào commit.
- Commit message phải đủ ý: tiêu đề theo dạng `<type>(<scope>): <tóm tắt thay đổi>` (ví dụ: `docs(rules): tự động commit sau mỗi công việc hoàn thành`); phần nội dung nêu các thay đổi chính, mục đích và kết quả kiểm tra phù hợp. Chỉ ghi các kiểm tra thực tế đã thực hiện; nêu rõ nếu có kiểm tra chưa chạy và lý do.
- Nếu kiểm tra hoặc commit thất bại, xử lý trong phạm vi công việc; nếu vẫn bị chặn, báo rõ nguyên nhân và không báo hoàn tất. Chỉ push khi người dùng yêu cầu.
- Khi báo hoàn tất, cung cấp mã commit và tóm tắt nội dung đã commit.
