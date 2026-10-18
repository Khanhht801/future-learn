# Tóm tắt thiết kế website hiện tại

## Màu sắc

| Vai trò | Màu chính |
|---|---|
| Màu thương hiệu | Xanh `#007DD3`, xanh đậm/sáng `#0066FF` |
| Màu hỗ trợ | Cyan `#71CEFF`, cyan sáng `#00A6FF` |
| Màu nhấn và CTA | Cam `#FF8A00`–`#FF9900` |
| Nền | Trắng `#FFFFFF`, kem `#FFF9EB`, xám nhạt `#F2F2F2` |
| Chữ | Đen/xám `#181818`, `#323232`, `#525252`, `#747070` |

Tổng thể dùng cặp **xanh–cam** tương phản: xanh tạo cảm giác tin cậy, giáo dục và công nghệ; cam tạo năng lượng, thân thiện và dẫn mắt tới hành động chính.

## Phong cách

- Trẻ trung, tích cực, thân thiện với học sinh và phụ huynh; kết hợp hình ảnh người học, giáo viên và yếu tố công nghệ/robot.
- Tiêu đề dùng **Quicksand** bo tròn, thân thiện; nội dung dùng **Roboto** rõ ràng, dễ đọc.
- Ngôn ngữ hình khối mềm: card bo góc khoảng `20px`, nút dạng capsule, ảnh/chân dung tròn, bóng đổ xanh nhẹ.
- Section chủ yếu sáng và thoáng; xen kẽ mảng xanh gradient, cam đậm và nền kem/xám để tạo nhịp thị giác.
- Chuyển động gồm hero carousel, card/carousel cuộn ngang, marquee đánh giá và hiệu ứng xuất hiện khi cuộn; có trạng thái focus và hỗ trợ giảm chuyển động.

## Bố cục

Website là landing page một trang, mobile-first, nội dung nằm trong container tối đa `1269px`:

1. Header sticky: logo, menu neo theo section và CTA; mobile chuyển thành menu hamburger.
2. Hero carousel toàn chiều ngang: thông điệp + CTA kết hợp nhân vật/minh họa; desktop bố cục chữ trái, hình phải.
3. Giới thiệu: nội dung thương hiệu, cột mốc và gallery ảnh bất đối xứng.
4. Dải số liệu: 2 cột trên mobile, 4 cột trên tablet/desktop.
5. Lý do lựa chọn: nền xanh gradient; card cuộn ngang trên mobile, lưới 2–3 cột trên màn hình lớn.
6. Đối tượng học: ảnh lớn kết hợp accordion; desktop chia 2 cột, mobile xếp dọc.
7. Chương trình đào tạo: lưới card 1/2/3 cột theo kích thước màn hình.
8. Giáo viên: carousel card chân dung.
9. Đăng ký tư vấn: nền cam nổi bật, form và minh họa chia 2 cột trên desktop.
10. Cảm nhận học viên: dải card chạy ngang; footer xanh navy chứa thông tin liên hệ và mạng xã hội.

Nhịp bố cục nhất quán với khoảng cách section khoảng `52–64px`, tiêu đề thường căn giữa; phần kể chuyện và nội dung dài ưu tiên căn trái hoặc căn đều.
