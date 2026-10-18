# Kế hoạch nâng cấp UI/UX FutureLearn

> Phạm vi: phân tích và đề xuất, chưa chỉnh sửa mã nguồn.\
> Ngày đánh giá: 18/10/2026.\
> Nguồn kiểm tra: `WEBSITE-DESIGN-SUMMARY.md`, `style.md`, `README-LAYOUT.md`, `index.html`, toàn bộ CSS/JS trong `public-home/`, tài sản ảnh hiện có và ảnh định hướng do người dùng cung cấp.

## 1. Executive Summary – Đánh giá tổng quan

Website hiện tại là **landing page marketing một trang**, không phải sản phẩm học tập sau đăng nhập. DOM thực tế có 9 khu vực nội dung: hero, câu chuyện thương hiệu, số liệu, lý do lựa chọn, nhóm người học, chương trình, giáo viên, đăng ký tư vấn và cảm nhận học viên; sau đó là footer. Không tìm thấy trang/dashboard, routing ứng dụng, dữ liệu bài học, tiến độ, điểm thưởng, nhiệm vụ, tài khoản học viên hoặc API học tập.

Vì vậy, khoảng cách tới ảnh định hướng không chỉ là “đổi giao diện” mà gồm hai lớp khác nhau:

1. **Khoảng cách visual**: hiện đã có nền tảng xanh–cam, Quicksand, góc bo, responsive và hình ảnh trẻ em; nhưng còn mang ngôn ngữ landing page EdTech đại chúng, chưa tạo được thế giới phiêu lưu 2D thống nhất.
2. **Khoảng cách sản phẩm**: ảnh mục tiêu là dashboard học tập có điều hướng môn học, tiến độ, mục tiêu, điểm và hoạt động. Những khối này chưa có dữ liệu hoặc business logic trong repo, nên không được xem là hạng mục “reskin”.

Đánh giá tổng thể: **khoảng cách lớn**. Khoảng một nửa nền tảng thị giác có thể giữ và tiến hóa; gần như toàn bộ kiến trúc trải nghiệm dashboard/gamification vẫn là phạm vi sản phẩm mới. Không nên viết lại landing page. Nên chuẩn hóa design system trước, nâng hero và các section có tác động cao, rồi chỉ xây app shell khi nghiệp vụ học tập được xác nhận.

### Điểm mạnh cần giữ

- Nhận diện xanh–cam đã rõ và phù hợp EdTech.
- Quicksand cho heading kết hợp Roboto cho nội dung hỗ trợ tiếng Việt tốt, không cần thêm font ngay.
- Cấu trúc BEM theo section, CSS tách file, mobile-first và container `1269px` đủ thuận lợi để tái cấu trúc dần.
- Semantic HTML, nhãn form, `aria-*`, focus state và `prefers-reduced-motion` đã được quan tâm.
- Các mẫu tương tác native/reusable đã có: accordion, scroll-snap carousel, form validation, sticky navigation, counter.
- Kho tài sản có ảnh hero, giáo viên, chương trình và testimonials; có thể tiếp tục dùng trong landing page.

### Năm vấn đề lớn nhất

1. **Sai loại trải nghiệm so với mục tiêu**: landing marketing đang được so với dashboard học tập; chưa có dữ liệu để hiển thị tiến độ, điểm, nhiệm vụ hay bài học.
2. **Minh họa thiếu một art direction chung**: ảnh chụp, PNG tách nền, Font Awesome, ảnh YouTube và nền minh họa trộn nhiều phong cách.
3. **Design tokens chưa đủ sâu**: có token nền tảng nhưng nhiều màu, radius, shadow, timing và breakpoint vẫn hard-code theo từng section.
4. **Phân cấp và chuyển động còn gây cạnh tranh**: hero đổi slide mỗi 3 giây không có điều khiển; CTA “thở” vô hạn; nhiều section lại có reveal, carousel/marquee và hover motion riêng.
5. **Một số rủi ro accessibility/độ tin cậy**: trắng trên cam `#FF8A00`/`#FF9900` không đủ tương phản cho chữ thường; nội dung dài bị căn đều; ảnh và nền bên thứ ba phụ thuộc mạng; form mới chỉ báo “sẵn sàng kết nối”, chưa gửi dữ liệu.

## 2. Current Design Audit – Phân tích hiện trạng

### 2.1. Phạm vi và độ tin cậy của tài liệu

| Nguồn | Quan sát | Kết luận sử dụng |
|---|---|---|
| `WEBSITE-DESIGN-SUMMARY.md` | Mô tả đúng palette, font, card và cấu trúc landing hiện tại | Dùng làm tóm tắt hiện trạng |
| `style.md` | Mô tả cả stack và nhiều section của website tham khảo/cũ | Chỉ dùng làm lịch sử thương hiệu; không coi tất cả section là đã tồn tại |
| `README-LAYOUT.md` | Nói các section sau Press chưa được làm, trong khi DOM hiện đã có form/testimonials; version file cũng lệch | Tài liệu đã stale, cần cập nhật sau khi chốt kế hoạch |
| `index.html` + CSS/JS | Nguồn sự thật hiện tại | Là cơ sở chính cho audit |

Không thấy các trang độc lập khác ngoài `index.html`. Không thấy build system, package manifest, framework component hoặc router. Stack thực tế là HTML/CSS/JS tĩnh, Bootstrap 5.3 và Font Awesome qua CDN.

### 2.2. Design system hiện có

`public-home/css/style.css` đã có một lớp token cơ bản:

- Brand: `#007DD3`, `#0066FF`, `#71CEFF`, `#00A6FF`, `#FF8A00`, `#FF9900`.
- Neutral: trắng, kem `#FFF9EB`, xám `#F2F2F2`, ba cấp chữ tối.
- Font: Quicksand và Roboto.
- Radius: card `20px`, input `20px`, button `999px`.
- Spacing: chỉ có `16px`, `24px`, `32px`; section spacing `52–64px`.
- Layout: header `68/76/84px`, container tối đa `1269px`.
- Motion: một easing curve và quy tắc giảm chuyển động toàn cục.

Điểm yếu là token chưa bao phủ semantic state, layer surface, grid, z-index, focus ring, disabled/loading, duration và nhiều cấp elevation. Các section vẫn tự khai báo màu/radius/shadow. Kết quả là giao diện nhìn có cùng thương hiệu nhưng chưa phải một design system đủ dùng cho dashboard.

### 2.3. Màu sắc

**Điểm tốt**

- Xanh là màu chủ đạo, cam dành cho CTA, dễ hiểu về chức năng.
- Kem, cyan và navy tạo đủ vùng nền để chia nhịp landing page.
- Chữ chính `#323232` trên nền sáng có độ đọc tốt.

**Vấn đề xác minh được**

- `#007DD3` trên trắng đạt khoảng `4.31:1`: phù hợp chữ lớn, nhưng dưới ngưỡng `4.5:1` cho chữ thường.
- Trắng trên `#FF8A00` đạt khoảng `2.36:1`; trắng trên `#FF9900` khoảng `2.14:1`: không dùng cho body/button text cỡ thường nếu không đổi nền hoặc màu chữ.
- Trắng trên phần giữa gradient `#0588E3` khoảng `3.73:1`; cần kiểm tra theo vị trí thực tế và cỡ chữ.
- Hero và từng section dùng thêm nhiều xanh/cam hard-code (`#168CFF`, `#0068EB`, `#FF9D08`, `#006EB9`...), làm semantic role của màu mờ đi.
- Gradient đang xuất hiện ở hero, Why Choose, About và button; nếu thêm tiếp cho dashboard sẽ thành nhiễu thị giác.

### 2.4. Typography

**Hiện trạng**

- Heading: Quicksand `600–700`, thường dùng `clamp()` từ khoảng `26px` đến trên `72px` tùy hero.
- Body: Roboto `16px`, line-height thường `1.5–1.65`.
- Section title có nhiều công thức gần giống nhưng không dùng chung một token/class.
- Nav và CTA dùng uppercase; một số nội dung dài dùng `text-align: justify`.

**Đánh giá**

- Cặp font phù hợp và nên giữ để tránh thêm dependency.
- Heading bo tròn phù hợp trẻ em nhưng mức phóng đại của hero và nhiều title lớn khiến landing mang tính quảng cáo hơn là môi trường học tập.
- Căn đều tạo khoảng trắng bất thường trong tiếng Việt, đặc biệt trên mobile; nên chuyển body về căn trái.
- Uppercase toàn bộ CTA/nav làm giảm khả năng quét nhanh với trẻ nhỏ; nên dùng sentence case.
- Chưa có type tokens theo vai trò (`display`, `h1`, `h2`, `body`, `label`, `caption`) và chưa giới hạn line length nhất quán.

### 2.5. Layout, grid và responsive

**Hiện trạng**

- Mobile-first; breakpoint thực tế tập trung ở `768px`, `992px`, `1200px`, thêm `640px` cục bộ.
- `.container-xl` tối đa `1269px`; nav đầy đủ chỉ xuất hiện từ `1200px`.
- Grid: stats `2 → 4` cột; programs `1 → 2 → 3`; audiences `1 → 2`; carousel ngang cho Why Choose, Teachers và Testimonials.
- Hero dùng chiều cao theo viewport và ở desktop kéo nền `background-size: 100% 100%`.

**Đánh giá**

- Nền responsive khá tốt cho landing và không cần thay Bootstrap.
- Breakpoint nằm rải rác theo file; cần token/hướng dẫn chung để app shell không phát sinh thêm quy tắc tùy ý.
- Kéo nền hero theo `100% 100%` có thể méo hình trên tỷ lệ màn hình lạ.
- Nhiều trải nghiệm cuộn ngang/marquee cần dấu hiệu điều hướng và phương án bàn phím nhất quán.
- Dashboard tham khảo 3 cột chỉ thích hợp desktop rộng; tablet nên bỏ right panel, mobile phải chuyển thành bottom navigation hoặc tab bar, không thu nhỏ nguyên xi.

### 2.6. Card, button, icon và trạng thái

**Điểm tốt**

- Card bo `20px`, nền trắng và shadow xanh nhẹ đã tạo cảm giác thân thiện.
- Button và control chính thường đạt tối thiểu khoảng `44px` chiều cao.
- Accordion dùng `details/summary`; teacher rail có keyboard focus; form báo lỗi theo field.

**Vấn đề**

- Nhiều card khác nhau vẫn lặp công thức “viền cyan + radius 20 + shadow xanh”, chưa biểu đạt hierarchy hay chức năng.
- CTA capsule có animation breathe vô hạn và shine lặp; đây là chuyển động trang trí liên tục, cạnh tranh với hero/carousel.
- Hero có 2 slide tự đổi mỗi `3000ms`, không có prev/next, indicator hoặc pause.
- Font Awesome dùng cho cả navigation/function/decorative icon, nên độ dày và sắc thái khó đồng nhất với minh họa 2D.
- Thiếu state chuẩn cho pressed, selected, loading, success, empty, error và skeleton.

### 2.7. Minh họa và hình ảnh

Repo đang kết hợp:

- Hero PNG/JPG dung lượng lớn, một số tệp trên `1MB` và có phiên bản gần trùng.
- Ảnh stock Unsplash trong About.
- Ảnh giáo viên và chương trình WebP cục bộ.
- Thumbnail YouTube và một hình tư vấn tải từ domain bên ngoài.
- Icon Font Awesome và một số hình khối CSS trang trí.

Sự pha trộn này làm thương hiệu chưa có “thế giới” riêng. Ảnh mục tiêu dùng một hệ minh họa 2D thống nhất theo chủ đề đảo/khu vườn; repo hiện chưa có bộ asset tương ứng. Nên xây art bible trước khi sản xuất asset, thay theo từng cụm thay vì rải mascot và cây cối lên mọi section.

### 2.8. Điều hướng và UX

- Header sticky, scrollspy và drawer mobile là nền tảng tốt cho landing.
- Menu có 7 mục, nhưng full nav chỉ hiện từ `1200px`; ở tablet người dùng phải dùng hamburger dù còn nhiều không gian.
- CTA “Vào học” trỏ `#learn`, nhưng không có phần tử có id này trong DOM.
- Link mạng xã hội là `href="#"`; chưa phải điểm đến thật.
- Form chỉ validate phía client, luôn chặn submit và không gửi API.
- Auto-rotating hero và testimonial marquee cần control/pause rõ hơn.

### 2.9. Mức độ hoàn thiện theo khu vực

| Khu vực | Hiện trạng | Mức hoàn thiện | Ghi chú |
|---|---|---:|---|
| Header/nav | Sticky, scrollspy, drawer, CTA | Khá | Sửa link `#learn`, giảm uppercase, cân lại tablet |
| Hero | Hai slide, ảnh tách nền, CTA | Trung bình | Thiếu control; đổi quá nhanh; art direction chưa nhất quán |
| About story | Copy + milestone + 3 ảnh | Khá | Ảnh stock và gradient chưa cùng phong cách đích |
| Stats | Counter + responsive grid | Khá | Có thể giữ logic; cần token/component hóa |
| Why Choose | 6 item + horizontal scroll | Khá | Nhiều trang trí/gradient; text trắng cần audit theo nền |
| Audiences | Ảnh + native accordion | Tốt | Mẫu tương tác đáng giữ; đổi icon/artwork |
| Programs | 3 card responsive | Khá | Card đang thiếu CTA/trạng thái nhưng không được tự thêm nếu chưa có link thật |
| Teachers | Carousel drag/keyboard | Khá | Card quá cao, cùng công thức với các card khác |
| Consultation | Validation accessible cơ bản | Prototype | Chưa gửi dữ liệu; copy xác nhận đúng nhưng chưa có backend |
| Testimonials | Marquee liên tục | Trung bình | Phụ thuộc thumbnail ngoài; cần pause/control |
| Footer | Contact + social | Trung bình | Social là placeholder; layout desktop 2 cột |
| Dashboard/bài học/game | Không tồn tại | Chưa có | Cần discovery nghiệp vụ trước thiết kế/triển khai |

## 3. Target Design Direction – Định hướng thiết kế mục tiêu

### 3.1. Ý tưởng chủ đạo: “Bản đồ tri thức sống”

FutureLearn nên được định vị như một quần đảo kiến thức: mỗi môn/chủ đề là một vùng có địa hình, nhân vật và màu phụ riêng; hệ thống điều hướng, typography và surface vẫn kỷ luật như một sản phẩm học tập chuyên nghiệp. **Một banner hành trình lớn** là điểm chi tiêu thị giác chính; phần còn lại yên tĩnh, không biến mọi card thành một poster.

Ba nguyên tắc:

1. **Học trước, trang trí sau**: minh họa giải thích chủ đề hoặc trạng thái, không che nội dung và không lặp vô nghĩa.
2. **Một hệ thống, nhiều thế giới**: khung UI giữ navy/cream/trắng; màu chủ đề chỉ xuất hiện trong artwork, chip và progress.
3. **Niềm vui có chủ đích**: reward, motion và mascot chỉ phản hồi hành động hoặc đánh dấu cột mốc; không chạy liên tục để giành sự chú ý.

### 3.2. Bố cục đề xuất

Landing page hiện tại tiếp tục phục vụ phụ huynh/người tìm hiểu:

```text
┌──────────────── Header: logo · chương trình · giáo viên · đánh giá · CTA ┐
├──────────────── Hero hành trình: copy ngắn | artwork 2D chủ đạo ─────────┤
├──────── Proof strip: 4 số liệu đã xác minh ──────────────────────────────┤
├──────── Chương trình như 3 “vùng học tập” khác biệt ─────────────────────┤
├──────── Ai phù hợp? accordion + 1 minh họa ngữ cảnh ─────────────────────┤
├──────── Giáo viên ──────── Câu chuyện/đánh giá ───────────────────────────┤
├──────── Form tư vấn có trạng thái gửi thật ───────────────────────────────┤
└──────────────── Footer ────────────────────────────────────────────────────┘
```

Dashboard chỉ triển khai sau khi có dữ liệu học tập:

```text
Desktop ≥ 1200
┌──────────────────────── top bar: product switch · reward · account ──────┐
├──────────────┬───────────────────────────────────────────┬────────────────┤
│ sidebar      │ journey banner                            │ daily goal     │
│ subject nav  ├───────────────────────────────────────────┤ achievements   │
│              │ topic cards / current activity            │ encouragement  │
└──────────────┴───────────────────────────────────────────┴────────────────┘

Tablet 768–1199: sidebar thu gọn; right panel chuyển thành hàng card dưới banner.
Mobile < 768: top app bar + bottom navigation; nội dung 1 cột; goal là card compact.
```

Nội dung mặc định căn trái. Chỉ title ngắn, số liệu hoặc empty/completion state mới căn giữa.

### 3.3. Tự phê bình định hướng

Rủi ro dễ rơi vào mẫu “dashboard nhiều card + gradient + mascot”. Để tránh:

- Chỉ banner hành trình dùng minh họa toàn cảnh; card nội dung dùng crop/icon đơn giản.
- Không dùng gradient để phân biệt mọi card; dùng nền phẳng và typography trước.
- Không thêm sao, streak, level nếu chưa có dữ liệu và quy tắc nghiệp vụ.
- Không dùng cùng radius/shadow cho mọi cấp. Navigation, content card và overlay có treatment khác nhau.
- Không thay toàn bộ ảnh thật của giáo viên bằng hoạt hình; ảnh thật vẫn cần cho niềm tin của phụ huynh.

## 4. UI/UX Gap Analysis

| Tiêu chí | Hiện tại | Mục tiêu | Khoảng cách/nguyên nhân | Đề xuất cụ thể | Ưu tiên |
|---|---|---|---|---|---|
| Product model | Landing tĩnh, không router/API học tập | Landing + app học tập có state | Chưa có mô hình lesson/progress/reward | Giữ landing; discovery data contract trước app shell | P0 |
| Color system | 6 brand color + nhiều màu hard-code | Semantic palette có contrast rõ | Token mới dừng ở brand swatch | Gom token primitive/semantic/component; bỏ trắng trên cam sáng | P0 |
| Typography | Quicksand/Roboto tốt nhưng scale phân tán, uppercase/căn đều | Scale theo vai trò, sentence case, căn trái | Mỗi section tự định nghĩa title/body | Tạo type token dùng chung; bỏ justify; giới hạn 65–72 ký tự | P0 |
| Layout | Landing scroll dọc, container 1269px | Landing rõ conversion; app shell 3 vùng có responsive | Không thể biến landing thành dashboard bằng CSS | Tách shell marketing và shell app ở cấp template/routing khi được phép | P0 |
| Components | BEM tốt, card/heading lặp CSS | Primitive + semantic variants | Thiếu Button/Card/SectionHeader/Progress primitives | Trích token và class nền trước khi redesign section | P0 |
| Illustration | Stock photo + PNG + FA + YouTube thumbnail | Một hệ 2D có art bible | Nguồn và nét vẽ không đồng nhất | Xây art bible, inventory, export WebP/AVIF + poster fallback | P1 |
| Navigation | Anchor nav, drawer, scrollspy | Navigation theo ngữ cảnh marketing/app | Link chết `#learn`; tablet chưa tối ưu | Sửa destination; giảm mục; app nav chỉ khi có route thật | P0 |
| Motion | Hero 3s, CTA breathe, reveal, marquee | Motion phản hồi, ít tự chạy | Quá nhiều nguồn chuyển động cùng lúc | Hero tĩnh hoặc có pause; dừng breathe; giữ 1 choreography nhẹ | P0 |
| Gamification UI | Không có | Reward/goal/progress có ý nghĩa | Thiếu dữ liệu và quy tắc | Chỉ thiết kế state contract/prototype; chưa nối production | P2/data |
| Form | Validation client, không submit | Trạng thái idle/error/loading/success thật | Thiếu endpoint và consent/error server | Bổ sung API contract trước khi đổi success copy | P0/data |
| Responsive | Mobile-first, breakpoint khá nhất quán | App thích nghi theo nhiệm vụ | Dashboard 3 cột chưa có chiến lược mobile | Quy tắc 1/2/3 vùng; touch target khuyến nghị ≥44px | P1 |
| Accessibility | Có semantic/focus/reduced motion | WCAG 2.2 AA | Contrast và auto motion còn lỗi | Automated + manual audit; pause/stop; contrast token | P0 |
| Performance | WebP ở nhiều mục nhưng hero PNG lớn/remote assets | LCP ổn định, asset tự chủ | Ảnh lớn, duplicate, remote dependency | Audit kích thước; responsive source; self-host asset quan trọng | P1 |
| Documentation | Nhiều tài liệu/version lệch DOM | Single source of truth | README/style mô tả section không còn khớp | Cập nhật inventory sau khi phê duyệt | P1 |

## 5. Proposed Design System – Hệ thống thiết kế đề xuất

### 5.1. Color tokens

Các giá trị dưới đây là điểm khởi đầu có thể đưa thẳng vào CSS; cần kiểm thử trên asset thật trước khi khóa.

| Semantic token | Giá trị | Vai trò |
|---|---:|---|
| `--color-primary-700` | `#2447C6` | CTA chính, selected state; trắng trên nền đạt khoảng `7.52:1` |
| `--color-primary-600` | `#1E63C6` | Link/action; trắng trên nền đạt khoảng `5.74:1` |
| `--color-primary-100` | `#EAF0FF` | Active nav, progress track tint |
| `--color-ink-900` | `#1F3A70` | Heading/navy thương hiệu |
| `--color-ink-700` | `#203052` | Body chính trên nền sáng |
| `--color-ink-500` | `#61708F` | Nội dung phụ; trên off-white khoảng `4.90:1` |
| `--color-surface-canvas` | `#FFF9F1` | Nền kem chung |
| `--color-surface-card` | `#FFFFFF` | Card và panel |
| `--color-surface-soft` | `#F4F7FC` | Section xen kẽ, input disabled |
| `--color-success-700` | `#2C7A58` | Success text/button; trắng trên nền khoảng `5.21:1` |
| `--color-success-100` | `#E7F6ED` | Success background |
| `--color-warning-700` | `#8A5A00` | Warning text trên nền sáng |
| `--color-warning-400` | `#F4B000` | Sao/reward trang trí, không dùng với chữ trắng |
| `--color-accent-coral` | `#CF4F32` | Accent phụ; chỉ dùng có kiểm soát |
| `--color-border-subtle` | `#DCE4F1` | Divider/border mặc định |
| `--color-focus` | `#155EEF` | Focus ring 3px + offset 2px |

Giữ xanh và cam hiện tại dưới dạng primitive/migration alias trong giai đoạn đầu; component mới chỉ dùng semantic token. Không dùng màu là tín hiệu duy nhất: trạng thái phải có icon/label.

### 5.2. Typography scale

Giữ Quicksand và Roboto để tận dụng dependency hiện có.

| Token | Desktop / mobile | Weight | Line-height | Dùng cho |
|---|---|---:|---:|---|
| `--type-display` | `48px / 36px` | 700 | `1.10` | Hero/quest banner duy nhất |
| `--type-h1` | `40px / 32px` | 700 | `1.15` | Tên trang |
| `--type-h2` | `32px / 26px` | 700 | `1.20` | Section title |
| `--type-h3` | `22px / 20px` | 700 | `1.30` | Card title |
| `--type-body-lg` | `18px / 17px` | 400 | `1.60` | Lead copy |
| `--type-body` | `16px` | 400 | `1.55` | Body/UI copy |
| `--type-label` | `15px` | 600 | `1.35` | Button/tab/input label |
| `--type-caption` | `14px` | 500 | `1.45` | Metadata/progress note |

Quicksand: display, h1–h3, số tiến độ nổi bật. Roboto: body, label, form, navigation. Không dùng text nhỏ hơn `14px` cho nội dung cần đọc. Dùng sentence case; line length body tối đa `65–72ch`.

### 5.3. Spacing, radius, shadow

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

--radius-control: 12px;
--radius-card-sm: 16px;
--radius-card-lg: 24px;
--radius-panel: 28px;
--radius-pill: 999px;

--shadow-1: 0 2px 8px rgb(31 58 112 / 8%);
--shadow-2: 0 10px 28px rgb(31 58 112 / 12%);
--shadow-float: 0 18px 48px rgb(31 58 112 / 16%);
```

Quy tắc: border/subtle shadow cho card nội dung; shadow-2 cho panel nổi; shadow-float chỉ cho overlay. Không dùng elevation để bù hierarchy nội dung yếu.

### 5.4. Button variants

| Variant | Style | Dùng khi |
|---|---|---|
| Primary | nền `primary-700`, chữ trắng, min-height `48px` | Một hành động chính trong vùng |
| Secondary | nền trắng, border `primary-700`, chữ `primary-700` | Hành động thay thế |
| Soft | nền `primary-100`, chữ `primary-700` | Filter/tab/action nhẹ |
| Ghost | nền trong, chữ `ink-700`, hover `surface-soft` | Toolbar/navigation |
| Reward | nền vàng nhạt, chữ `warning-700`, icon sao | Chỉ hiển thị reward, không dùng làm CTA mặc định |
| Destructive | nền trắng, border/text đỏ đậm | Hành động mất dữ liệu |

Tất cả button: target khuyến nghị tối thiểu `44×44px`, label động từ rõ ràng, focus ring nhất quán. Loading giữ nguyên kích thước, có spinner + label “Đang gửi…”. Disabled không chỉ giảm opacity; đồng thời bỏ shadow và dùng `aria-disabled/disabled` đúng ngữ nghĩa.

### 5.5. Card variants

- `JourneyBanner`: artwork 2D + copy + một CTA; chỉ một banner/viewport.
- `TopicCard`: ảnh/crop chủ đề, title, mô tả ngắn; progress/status chỉ render khi dữ liệu có thật.
- `ProofCard`: số liệu hoặc chứng thực; nền phẳng, không artwork lớn.
- `PersonCard`: ảnh thật, tên, vai trò, mô tả; giữ trust signal.
- `GoalCard`: task + progress + trạng thái; chỉ thuộc app shell.
- `ActivityCard`: prompt và answer controls; dùng cho lesson/game, không dùng trên landing.
- `FeedbackCard`: success/error/empty/locked với icon, title và next action.

Mỗi variant có schema nội dung và chiều cao riêng; không ép mọi card bằng nhau nếu nội dung khác vai trò.

### 5.6. Icon và illustration guidelines

- Navigation icon: stroke 2px, viewBox thống nhất, kích thước `20/24px`, luôn kèm label ở cấp điều hướng chính.
- Functional icon: không dùng emoji; dùng cùng một bộ SVG hoặc subset Font Awesome đã chuẩn hóa.
- Decorative illustration: không nhận click/focus, `alt=""`; artwork mang nghĩa có alt ngắn và cụ thể.
- Art direction: 2D mềm, cạnh bo, ánh sáng từ trên trái, texture tối đa 5–8%, không trộn 3D glossy với flat icon.
- Palette artwork: tối đa 1 màu môn học + xanh/kem hệ thống + 1 accent ấm.
- Nhân vật: tỷ lệ, outline, mắt và biểu cảm nhất quán; không thay ảnh giáo viên thật.
- Xuất asset: ưu tiên AVIF/WebP, có `srcset/sizes`; PNG chỉ cho transparency thật sự cần thiết; poster/fallback cục bộ cho nội dung ngoài.

### 5.7. Interaction states và motion

- Hover: thay nền/border nhẹ; translation tối đa `2px`.
- Active/selected: nền tint + border/indicator + `aria-current` hoặc `aria-selected`.
- Focus: ring `3px`, offset `2px`, không bị sticky header che.
- Error: icon + message cụ thể + liên kết với field bằng `aria-describedby`.
- Success: xác nhận việc đã hoàn thành và hành động tiếp theo.
- Loading: skeleton cho card, spinner cho action; không thay layout.
- Motion duration: `120ms` micro, `200ms` control, `320ms` panel. Không animation trang trí vô hạn.
- Carousel tự chạy phải có pause/stop và không đổi quá nhanh; ưu tiên hero tĩnh.
- Luôn tôn trọng `prefers-reduced-motion`.

### 5.8. Responsive rules

| Breakpoint | Quy tắc |
|---|---|
| `< 576px` | 1 cột, gutter 16px, bottom nav nếu là app, card ảnh không vượt 40vh |
| `576–767px` | 1 cột rộng, gutter 20px, horizontal rail chỉ khi có affordance |
| `768–991px` | 2 cột chọn lọc, app sidebar thu gọn, right panel xuống dòng |
| `992–1199px` | Landing nav có thể hiện nếu đủ chỗ; app 2 vùng |
| `≥ 1200px` | Landing container 1269px; app tối đa khoảng 1440px với 3 vùng |

Không khóa nội dung theo loại thiết bị; breakpoint dựa trên độ rộng cần thiết của content. Kiểm thử thêm ở zoom 200%, màn hình 320px và keyboard-only. Chuẩn nghiệm thu accessibility tham chiếu WCAG 2.2 AA, gồm contrast, focus không bị che và target size tối thiểu.

## 6. Page-by-Page Recommendations – Đề xuất theo từng trang/khu vực

Do repo chỉ có một trang, phần này audit theo section. Các màn hình dashboard được ghi riêng là phạm vi điều kiện.

### 6.1. Header

- Giữ sticky header, logo và logic drawer/scrollspy.
- Giảm menu xuống các anchor tạo quyết định: Chương trình, Phù hợp với ai, Giáo viên, Đánh giá, Liên hệ.
- Chuyển label sang sentence case; giảm cảm giác corporate.
- Sửa “Vào học” khỏi `#learn` sang route/URL thật; nếu chưa có route, dùng CTA “Nhận tư vấn” trỏ form.
- Từ `992px` thử full nav nếu đo không wrap; không cố định ẩn đến `1200px` nếu còn chỗ.

### 6.2. Hero

- Đây là khu vực nên nâng cấp đầu tiên vì đem lại thay đổi thị giác lớn nhất.
- Thay hai slide tự chạy bằng một journey banner rõ thông điệp: một h1, một đoạn tối đa 2 dòng, một CTA chính, một CTA phụ nếu có destination thật.
- Dùng một cảnh 2D đặc trưng FutureLearn, nhưng bảo đảm vùng chữ yên và contrast ổn định.
- Không kéo méo background; dùng `<picture>` hoặc layer artwork có `object-fit: cover/contain`.
- Nếu vẫn giữ carousel: thêm prev/next, indicator, pause; dừng khi focus/hover và khi tab ẩn.

### 6.3. About story

- Giữ nội dung thành lập và milestone vì tạo độ tin cậy.
- Đổi gallery stock thành 1 ảnh thật nổi bật + 2 ảnh phụ cùng color grade; không cần hoạt hình hóa khu vực này.
- Giảm gradient; dùng nền cream hoặc sky tint phẳng để landing không cạnh tranh với hero.

### 6.4. Stats

- Giữ dữ liệu và counter nếu số liệu đã được xác minh nghiệp vụ.
- Dùng icon cùng hệ, giảm vòng tròn/shadow thừa.
- Mobile hiển thị 2×2; desktop 4 cột; không animate số nếu reduced motion.
- Thêm nguồn/ngày cập nhật trong quy trình nội bộ; không tự thêm vào UI nếu chưa được duyệt.

### 6.5. Why Choose

- Đổi từ 6 visual card tương tự nhau thành 3 nhóm giá trị chính hoặc 6 hàng compact; giảm độ dài scroll ngang.
- Một minh họa trung tâm có thể đại diện phương pháp học; icon chức năng giữ đơn sắc.
- Kiểm tra toàn bộ chữ trắng trên gradient; tránh phần giữa `#0588E3` cho body text thường.

### 6.6. Audiences

- Giữ native accordion và bố cục ảnh + nội dung; đây là component hiện tại gần mục tiêu reusable nhất.
- Thay icon Font Awesome bằng bộ icon vai trò thống nhất.
- Mặc định chỉ mở một mục; nếu cần hành vi exclusive phải bổ sung JS nhỏ và vẫn giữ semantics.
- Trên mobile đặt accordion trước hoặc ảnh sau mục đang mở nếu nghiên cứu cho thấy người dùng cần thông tin nhanh hơn hình.

### 6.7. Training programs

- Chuyển 3 chương trình thành 3 “vùng học tập” có màu phụ/artwork khác nhau, nhưng khung typography thống nhất.
- Chỉ thêm CTA khi có trang chi tiết hoặc modal thật.
- Nếu không có progress của người dùng, tuyệt đối không mô phỏng thanh tiến độ trên landing.
- Card nên có hierarchy: title → đối tượng/kết quả → mô tả; tránh 3 card chỉ khác ảnh.

### 6.8. Teachers

- Giữ ảnh thật, tên và vai trò; giảm chiều cao card cố định `28rem` bằng clamp nội dung hoặc line clamp có mở rộng accessible.
- Desktop ưu tiên grid 4 cột nếu số lượng cố định; carousel chỉ khi cần duyệt nhiều người.
- Giữ keyboard focus và nút prev/next; thêm disabled state ở đầu/cuối nếu không loop.

### 6.9. Consultation

- Giữ validation theo field và focus về lỗi đầu tiên.
- Trước triển khai production cần endpoint, timeout, server error, retry, chống gửi lặp và thông tin đồng ý xử lý dữ liệu.
- Không hiển thị success nếu chỉ hợp lệ phía client. Copy hiện tại “sẵn sàng kết nối” là trung thực và nên giữ cho đến khi có API.
- Nền cam sáng có thể giữ làm accent lớn, nhưng dùng chữ navy đậm hoặc cam sẫm để đạt contrast.

### 6.10. Testimonials

- Ưu tiên rail điều khiển bởi người dùng hơn marquee tự chạy.
- Self-host poster được phép sử dụng; tránh phụ thuộc hoàn toàn thumbnail YouTube.
- Rút quote hiển thị, cung cấp nút xem đầy đủ/video có accessible name.
- Không để animation tiếp tục khi focus nằm trong card.

### 6.11. Footer

- Giữ navy vì tạo điểm kết thúc vững.
- Thay link social placeholder bằng URL thật hoặc ẩn cho đến khi có.
- Kiểm tra contact data, copyright và pháp nhân trước release.

### 6.12. Dashboard học tập – phạm vi có điều kiện

Chỉ thiết kế chi tiết sau khi xác nhận tối thiểu các entity: user profile, subject, topic, lesson, completion, progress, daily goal, reward balance, achievement và resume target. Cần xác định nguồn dữ liệu, trạng thái rỗng/lỗi/loading, quyền phụ huynh–trẻ em và hành vi khi bấm CTA.

Khi đã có contract, thứ tự màn hình nên là:

1. Home dashboard: tiếp tục học + chủ đề + mục tiêu.
2. Subject/topic listing: lọc và trạng thái khóa/đang học/hoàn thành.
3. Lesson/player: layout tập trung, ẩn sidebar phụ.
4. Activity/game: một nhiệm vụ mỗi màn, feedback ngay, keyboard/touch usable.
5. Completion: kết quả, nội dung đã học, next action; reward chỉ hiện từ backend.
6. Parent view: tiến độ và cài đặt tách khỏi trải nghiệm trẻ em.

## 7. Component Reuse Strategy – Chiến lược tái sử dụng

### 7.1. Giữ nguyên logic, thay presentation dần

| Thành phần hiện tại | Quyết định | Hướng tái sử dụng |
|---|---|---|
| `.container-xl` | Giữ | Bổ sung container app riêng, không phá landing |
| Header/drawer/scrollspy | Giữ logic | Tách style token, sửa breakpoint/link |
| Native accordion | Giữ | Đóng gói pattern + icon/state chuẩn |
| Teachers carousel | Giữ có chọn lọc | Dùng primitive `HorizontalRail` chung |
| Testimonials marquee | Thay behavior | Tái dùng card, bỏ autoplay mặc định |
| Stats counter | Giữ | Tách motion option, reduced-motion fallback |
| Consultation validation | Giữ | Bổ sung state/API adapter sau |
| `.capsule-btn` | Refactor | Chuyển thành Button variants, bỏ animation mặc định |
| Section-specific headings | Hợp nhất | `SectionHeader` + type token |
| Font Awesome | Tạm giữ | Khóa subset/style; thay dần bằng icon system |

### 7.2. Kiến trúc CSS đề xuất, không cần thêm dependency

```text
public-home/css/
  tokens.css          primitive + semantic tokens
  base.css            reset, typography, focus, utilities tối thiểu
  components.css      button, card, section-header, rail, form-control
  layouts.css         container, section, marketing shell
  sections/*.css      chỉ giữ style đặc thù từng section
```

Trong giai đoạn chuyển tiếp, `style.css` import hoặc chứa alias token cũ để tránh big-bang rewrite. Không đổi business logic, DOM id hoặc data attribute trước khi có regression test.

### 7.3. Content/data contract trước component dashboard

Ví dụ `TopicCard` chỉ nhận các field đã xác thực:

```text
title, description, artwork, href
progress? { completed, total }
status? "not-started" | "in-progress" | "completed" | "locked"
```

Dấu `?` là tùy chọn. Không render progress/status khi API không cung cấp. Cách này cho phép xây visual system mà không phát minh business logic.

## 8. Implementation Roadmap – Lộ trình thực hiện

### Giai đoạn 0 – Product & content alignment

**Thời lượng gợi ý:** 2–4 ngày discovery.

- Chốt landing cho phụ huynh hay learner app là phạm vi release kế tiếp.
- Xác minh destination “Vào học”, form endpoint, social URL và dữ liệu số liệu.
- Nếu có app: lập route map, entity/state matrix và phân quyền.
- Đóng băng art direction bằng 1 moodboard + 1 hero key visual + 1 topic card mẫu.

Đây là điều kiện đầu vào, không phải thay đổi UI.

### Giai đoạn 1 – Visual Foundation

**Thời lượng gợi ý:** 1 sprint.

- Chuẩn hóa color/type/spacing/radius/shadow/motion token.
- Tạo Button, SectionHeader, Card, IconButton, FormControl, Feedback pattern.
- Fix contrast, focus, link chết, auto-motion và text alignment.
- Lập asset inventory, budget và quy tắc export.
- Viết trang/pattern inventory hoặc Storybook chỉ khi dự án đã có build system; hiện tại không nên thêm dependency chỉ để làm docs.

UI-only: phần lớn. Data/backend: sửa destination/form cần đầu vào hệ thống.

### Giai đoạn 2 – Page Redesign

**Thời lượng gợi ý:** 2 sprints.

- Sprint 2A: Header + Hero + Programs + Consultation.
- Sprint 2B: About + Stats + Why Choose + Audiences + Teachers + Testimonials + Footer.
- Visual regression ở 320, 375, 768, 1024, 1280, 1440px; zoom 200%.
- Accessibility, performance và content QA.

UI-only: layout/style/asset. Data/backend: CTA destination, form submit, video/social URL.

### Giai đoạn 3 – Adventure Experience

**Thời lượng chỉ ước lượng sau discovery.**

- Sản xuất bộ minh họa 2D sau khi hero mẫu được duyệt.
- Nếu có app data: xây app shell, subject/topic, lesson, game và completion theo thứ tự ở mục 6.12.
- Tích hợp progress/reward/goal từ backend; không mock thành production state.
- Instrument analytics cho resume learning, lesson completion và form conversion nếu hạ tầng cho phép.

UI-only: artwork, shell, empty/loading state. Data/business: progress, points, goal, achievements, unlock rules, parent permission.

## 9. Prioritized Task Checklist

### P0 – Bắt buộc trước redesign sâu

- [ ] Chốt ranh giới landing vs learner dashboard.
- [ ] Xác minh route/URL thật cho “Vào học”; sửa `#learn` không tồn tại.
- [ ] Chốt semantic color token và loại bỏ cặp contrast không đạt.
- [ ] Chuẩn hóa type scale; bỏ uppercase/căn đều ở nội dung dài.
- [ ] Tắt CTA breathe vô hạn; đổi hero thành tĩnh hoặc thêm pause/control.
- [ ] Tạo Button/Card/SectionHeader/FormControl primitives.
- [ ] Xác minh form endpoint và các trạng thái server.
- [ ] Xử lý social link placeholder.
- [ ] Audit keyboard, focus, contrast, reduced motion và zoom.
- [ ] Viết inventory chính xác dựa trên DOM hiện tại.

### P1 – Tác động cao

- [ ] Redesign hero theo “Bản đồ tri thức sống”.
- [ ] Thiết kế lại 3 program card thành ba vùng học tập khác biệt.
- [ ] Chuẩn hóa icon system và trạng thái selected/disabled/loading.
- [ ] Thay/đồng bộ asset remote quan trọng; tối ưu PNG lớn.
- [ ] Giảm số pattern carousel/marquee; thống nhất HorizontalRail.
- [ ] Refactor CSS section về token/component mà không đổi JS contract.
- [ ] Kiểm thử responsive ở breakpoint và nội dung tiếng Việt dài.
- [ ] Cập nhật `README-LAYOUT.md`, `style.md` hoặc thay bằng một source of truth.

### P2 – Sau khi có dữ liệu/nghiệp vụ

- [ ] Thiết kế app shell desktop/tablet/mobile.
- [ ] Xây TopicCard có progress/status thật.
- [ ] Xây daily goal, reward balance và achievement từ backend contract.
- [ ] Thiết kế lesson/player và activity/game focus layout.
- [ ] Xây completion/empty/error/locked states.
- [ ] Thiết kế parent view và quyền truy cập.
- [ ] Thêm analytics/evaluation cho engagement, không tối ưu theo vanity metric.

## 10. Risks & Acceptance Criteria – Rủi ro và tiêu chí nghiệm thu

### 10.1. Rủi ro

| Rủi ro | Tác động | Giảm thiểu |
|---|---|---|
| Dùng ảnh dashboard làm yêu cầu chức năng | Scope phình, UI giả dữ liệu | Phân tách UI concept và feature contract; PO duyệt entity/state |
| Minh họa sản xuất trước design system | Asset đẹp nhưng không ghép được | Duyệt art bible + hero + 1 card mẫu trước batch |
| Thêm màu theo từng môn không kiểm soát | Mất thương hiệu và contrast | Mỗi world chỉ 1 màu phụ, semantic token không đổi |
| Refactor CSS big-bang | Regression landing hiện có | Alias token + migrate theo section + screenshot diff |
| Remote assets/CDN lỗi | Layout trống/LCP xấu | Self-host critical asset, poster/fallback cục bộ |
| Motion tạo mệt mỏi | Giảm tập trung/accessibility | Một orchestrated moment, user control, reduced motion |
| Gamification không có logic | Mất niềm tin, sai số liệu | Không render score/progress giả; backend là source of truth |
| Tài liệu lệch mã | Quyết định sai lặp lại | Tự động hóa inventory/version hoặc cập nhật cùng PR |

### 10.2. Tiêu chí nghiệm thu nền tảng

**Visual/system**

- 100% component mới dùng semantic token; không thêm màu/radius/shadow hard-code nếu không có lý do ghi chú.
- Mỗi trang/section chỉ có một primary action nổi bật.
- Heading, body, label và caption dùng đúng type scale; body không căn đều.
- Icon navigation/function cùng stroke/size; illustration tuân art bible.

**Accessibility**

- Chữ thường đạt contrast tối thiểu `4.5:1`, chữ lớn `3:1`; component/focus indicator đạt tối thiểu `3:1` theo trường hợp áp dụng.
- Tất cả control dùng được bằng keyboard, focus nhìn thấy và không bị sticky header che.
- Pointer target đạt ít nhất chuẩn WCAG 2.2 `24×24 CSS px`; mục tiêu nội bộ cho control chính là `44×44px`.
- Không có animation tự chạy không thể dừng; reduced motion loại bỏ chuyển động không thiết yếu.
- Form error được đọc bởi assistive technology; focus đi tới lỗi đầu tiên; status dùng live region phù hợp.

**Responsive/performance**

- Không overflow ngang ở 320px và zoom 200%.
- Layout đúng tại 320/375/768/1024/1280/1440px.
- Ảnh có width/height, responsive source và format phù hợp; hero không bị kéo méo.
- Critical UI không phụ thuộc asset bên thứ ba mà không có fallback.

**Functional integrity**

- Header anchor, carousel/rail, accordion, form validation và scrollspy không regression.
- Không hiển thị progress, reward, goal hoặc success state nếu không có dữ liệu thật.
- Link “Vào học”, social và CTA có destination hợp lệ.
- Form chỉ báo gửi thành công sau phản hồi thành công từ server.

## Kết luận phê duyệt

### Website hiện tại cách phong cách mục tiêu bao xa?

**Xa ở kiến trúc trải nghiệm, trung bình ở nền tảng thị giác.** Website đã có màu thương hiệu, typography thân thiện, góc bo, responsive và một số ảnh trẻ em; nhưng vẫn là landing page quảng bá. Thế giới minh họa 2D, dashboard môn học, tiến độ, nhiệm vụ và gamification chưa tồn tại. Không thể đạt ảnh mục tiêu chỉ bằng thay CSS.

### Năm vấn đề thiết kế lớn nhất cần khắc phục

1. Làm rõ landing hay learner app trước khi thiết kế.
2. Chuẩn hóa design system semantic thay cho style cục bộ theo section.
3. Thiết lập một art direction 2D thống nhất, phân biệt rõ ảnh thật và minh họa.
4. Giảm/chủ động hóa motion, đặc biệt hero 3 giây, CTA breathe và marquee.
5. Sửa contrast, link/state giả và các điểm chưa hoàn thiện về accessibility/functional truth.

### Những gì nên giữ nguyên

Giữ Quicksand + Roboto, nhận diện xanh chủ đạo/cam làm accent, container và mobile-first foundation, BEM theo section, semantic HTML, accordion native, validation pattern, reduced-motion support, ảnh thật giáo viên và cấu trúc nội dung marketing đã có. Giữ business logic, data attribute và routing hiện tại trong khi refactor presentation.

### Trang/khu vực nào nên nâng cấp trước?

Theo thứ tự: **Header + Hero → Training Programs → Consultation → Why Choose/Audiences → Teachers/Testimonials → Footer**. Nếu dashboard là sản phẩm kế tiếp, phải làm discovery/data contract trước, sau đó mới thiết kế Home dashboard → Topic listing → Lesson → Activity → Completion.

### Thay đổi nào tạo cải thiện thị giác lớn nhất với ít công sức nhất?

1. Chuẩn hóa type scale, sentence case và căn trái body.
2. Thay màu primary/CTA bằng semantic token có contrast đạt chuẩn.
3. Tắt animation CTA liên tục và dùng hero tĩnh có bố cục rõ.
4. Áp dụng ba cấp radius/shadow thay vì mọi card cùng một treatment.
5. Đồng bộ icon và giảm gradient/trang trí thừa.

Các thay đổi này không cần thêm dependency và có thể thực hiện trước khi sản xuất bộ minh họa mới.

### Làm gì để mọi trang có cùng ngôn ngữ thiết kế?

Dùng một source of truth cho token; định nghĩa component theo vai trò và state; khóa art bible/icon rules; dùng chung grid, responsive, focus và motion rules; review mọi màn hình bằng cùng checklist accessibility/content; và không cho section tự tạo màu, shadow, radius hoặc interaction mới ngoài hệ thống nếu chưa được duyệt.

## Tham chiếu chuẩn

- W3C, [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/wcag/).
- W3C, [Understanding Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
