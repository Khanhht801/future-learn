# FutureLearn – Định hướng phong cách sản phẩm học tập

## Mô tả sản phẩm

FutureLearn là sản phẩm học tập dành cho trẻ em, kết hợp trải nghiệm giáo dục rõ ràng với thế giới khám phá hoạt hình 2D. Giao diện cần tạo cảm giác vui, an toàn và khuyến khích trẻ tiếp tục học, đồng thời vẫn đủ tin cậy và dễ hiểu với phụ huynh.

Website marketing giới thiệu chương trình và tạo niềm tin. Khi người dùng bấm **“Vào học”**, hệ thống điều hướng đến **Góc học tập (learner dashboard)** để tiếp tục bài học, khám phá chủ đề và xem tiến độ.

> Route đích phải được nối với URL thực tế của Góc học tập. Không dùng `#learn` nếu không có phần tử hoặc route tương ứng.

## Tinh thần thị giác

**Ý tưởng chủ đạo:** Bản đồ tri thức sống.

- Thân thiện, tươi sáng và giàu cảm giác khám phá.
- Minh họa 2D mềm, gần gũi: đảo học tập, khu vườn, cây cối, động vật và vật thể quen thuộc.
- Một điểm nhấn minh họa lớn ở hero hoặc banner hành trình; các vùng còn lại gọn và yên tĩnh.
- Card bo tròn có phân cấp, bóng đổ nhẹ, tránh biến mọi nội dung thành các thẻ giống nhau.
- Hạn chế gradient và chuyển động trang trí liên tục.

## Bảng màu cốt lõi

| Vai trò | Màu | Cách dùng |
|---|---:|---|
| Primary | `#2447C6` | CTA chính, trạng thái đang chọn, thanh tiến độ |
| Brand navy | `#1F3A70` | Heading, navigation, chữ thương hiệu |
| Sky blue | `#1E63C6` | Link và hành động phụ |
| Canvas cream | `#FFF9F1` | Nền chung tạo cảm giác ấm và nhẹ |
| Surface | `#FFFFFF` | Card, panel, form |
| Soft surface | `#F4F7FC` | Nền section phụ, trạng thái disabled |
| Learning green | `#2C7A58` | Hoàn thành, khu vườn, phản hồi tích cực |
| Reward yellow | `#F4B000` | Sao, phần thưởng và điểm nhấn trang trí |
| Warning text | `#8A5A00` | Chữ cảnh báo hoặc chữ trên nền vàng nhạt |
| Coral accent | `#CF4F32` | Nhấn phụ có kiểm soát, không cạnh tranh CTA |
| Main text | `#203052` | Nội dung chính |
| Muted text | `#61708F` | Nội dung phụ và chú thích |
| Border | `#DCE4F1` | Viền nhẹ và đường phân cách |

### Quy tắc màu

- Xanh dương là màu hệ thống; xanh lá, vàng và coral chỉ hỗ trợ theo ngữ cảnh.
- Không dùng chữ trắng trên cam/vàng sáng vì độ tương phản thấp.
- Mỗi môn học chỉ có một màu phụ, không thay đổi màu của navigation và CTA chính.
- Không dùng màu làm tín hiệu duy nhất; trạng thái luôn có thêm icon hoặc nhãn.
- Gradient chỉ dành cho artwork hoặc một vùng nhấn lớn, không dùng trên mọi card/button.

## Typography

- **Quicksand 600–700:** tiêu đề, tên chủ đề, số tiến độ nổi bật.
- **Roboto 400–600:** nội dung, navigation, label, form và trạng thái.
- Dùng sentence case, không viết hoa toàn bộ menu hoặc CTA.
- Nội dung căn trái; không căn đều đoạn văn tiếng Việt.
- Cỡ chữ body tối thiểu `16px`, caption tối thiểu `14px`.
- Giới hạn dòng nội dung khoảng `65–72ch`.

## Thành phần giao diện

- Button chính: nền `#2447C6`, chữ trắng, cao tối thiểu `48px`.
- Button phụ: nền trắng, viền và chữ `#2447C6`.
- Card nội dung: nền trắng, radius `16–24px`, viền nhẹ hoặc shadow nhẹ.
- Panel lớn: radius `28px`; pill chỉ dành cho chip, điểm thưởng hoặc filter.
- Focus ring: xanh `#155EEF`, dày `3px`, offset `2px`.
- Vùng bấm chính nên đạt ít nhất `44×44px`.

## Minh họa và icon

- Minh họa dùng cùng phong cách 2D, ánh sáng, tỷ lệ nhân vật và độ chi tiết.
- Ảnh giáo viên/người thật tiếp tục dùng ảnh thật để giữ độ tin cậy.
- Icon điều hướng và chức năng phải cùng một bộ, cùng độ dày nét.
- Không dùng emoji thay icon chức năng.
- Ưu tiên WebP/AVIF; PNG chỉ dùng khi cần nền trong suốt.

## Chuyển động

- Chuyển động phải phản hồi thao tác: chọn đáp án, hoàn thành bài, mở panel.
- Không để CTA “thở”, marquee hoặc carousel tự chạy liên tục.
- Hero nên tĩnh; nếu tự chuyển slide phải có nút dừng và điều khiển rõ.
- Luôn hỗ trợ `prefers-reduced-motion`.

## Luồng “Vào học”

```text
Landing page
    ↓ bấm “Vào học”
Góc học tập / learner dashboard
    ↓
Tiếp tục bài học hoặc chọn chủ đề
    ↓
Bài học / hoạt động tập trung
    ↓
Hoàn thành và chọn bước tiếp theo
```

- Landing page và Góc học tập dùng chung màu, typography, button và icon system.
- Dashboard chỉ hiển thị tiến độ, mục tiêu, sao hoặc thành tích khi có dữ liệu thật.
- Màn hình bài học/trò chơi dùng layout tập trung, không giữ toàn bộ dashboard ba cột.
- Trên mobile, dashboard chuyển về một cột và navigation gọn; không thu nhỏ nguyên bố cục desktop.

## Nguyên tắc bám theo

1. Nội dung học tập luôn rõ hơn phần trang trí.
2. Một màn hình chỉ có một hành động chính nổi bật.
3. Một khu vực minh họa lớn là đủ; các thành phần còn lại giữ kỷ luật.
4. Không phát minh điểm thưởng, tiến độ hoặc trạng thái nếu hệ thống chưa hỗ trợ.
5. Mọi màn hình phải dùng được bằng bàn phím, đọc rõ trên mobile và có độ tương phản phù hợp.
