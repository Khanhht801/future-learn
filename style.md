# Style Guide — FutureLearn

> Website: Ứng dụng học tiếng Anh online FutureLearn
> Ngày phân tích: 04/10/2026
> Cập nhật: 04/10/2026 — bổ sung thứ tự section
> Nguồn: HTML gốc + `style.css?v=1.2.8` + `home.css?v=1.1.0` + `style-tablet.css?v=1.0.3` + khảo sát `https://www.futurelang.edu.vn/`

---

## Overview

| Mục | Chi tiết |
|---|---|
| **Ngành** | EdTech – Ứng dụng học ngoại ngữ (Anh – Trung – Nhật – Hàn) |
| **Đối tượng** | Học sinh mầm non, tiểu học, THCS, THPT, sinh viên, người đi làm, giáo viên, phụ huynh |
| **Layout** | Single-page landing dạng scroll dọc; nhiều section nối tiếp nhau |
| **Grid** | Bootstrap 5 (`.container-xl`, max-width `1269px` ở desktop, mở rộng `1769px` ở ≥1920px) |
| **Stack** | Bootstrap 5.3 + Slick Carousel 1.8 + DataTables 1.10 + Font Awesome 6.3 + AOS 2.3 (animate on scroll) + jQuery (validate) |
| **Font load** | Google Fonts (preload) với nhiều weight |
| **Component tiêu biểu** | Slider banner (Slick), Accordion (chương trình học), Card đội ngũ giáo viên, Card đối tác, iframe video cảm nhận, form đăng ký tư vấn, icon-list "Tại sao chọn FutureLearn", marquee CTA cam |
| **Hình thức trực quan** | Ảnh/illustration lớn, gradient xanh nhạt ở section "Về chúng tôi", nền vàng kem nhạt cho block giáo viên/phụ huynh, background cam rực ở form đăng ký |
| **CTA chính** | Nút "Vào học" / "Trải nghiệm ngay" màu cam (`#FF8A00`) và xanh (`#007DD3`), đặt top-right header + dưới banner hero |
| **Đặc điểm nhận diện** | Bo góc lớn (border-radius 16–24px), card có viền mỏng xanh cyan (`#71CEFF` / `#00A6FF`), icon tròn lớn, button dạng SVG capsule (Group-195.svg) |
| **Footer** | Gradient xanh dương đậm (`#0066FF` + overlay đen 40%), 4 cột thông tin + bộ icon mạng xã hội + nhãn "bộ công thương" |

---

## Colors

### Bảng hệ màu chính

| Token | Giá trị | Hex | Vai trò / sử dụng |
|---|---|---|---|
| `--primary-blue-1` | Xanh dương thương hiệu | `#007DD3` | Tiêu đề section, link, button chính, viền nhấn |
| `--primary-blue-2` | Xanh dương đậm (gradient footer) | `#0066FF` | Footer gradient base |
| `--secondary-cyan` | Xanh cyan nhạt | `#71CEFF` | Viền card (`border`), underline nav active |
| `--secondary-cyan-bright` | Xanh cyan sáng | `#00A6FF` | Viền card "giáo viên" |
| `--secondary-cyan-light` | Xanh cyan rất nhạt (alpha) | `rgba(95,196,255,0.12)` | Active menu gradient bg |
| `--accent-orange` | Cam đậm CTA | `#FF8A00` | Button "Trải nghiệm ngay", marquee "Đăng ký" |
| `--accent-orange-strong` | Cam rực (form đăng ký) | `#FF9900` | Background form đăng ký tư vấn |
| `--gradient-cyan-end` | Xanh cyan gradient cuối | `#73CDFF` | Gradient "Về chúng tôi" (kết thúc) |
| `--why-blue-top` | Xanh sáng đầu section | `#0398FE` | Nền "Tại sao nên chọn FutureLearn?" — lấy mẫu từ ảnh tham chiếu gốc |
| `--why-blue-mid` | Xanh sáng giữa section | `#0588E3` | Nền "Tại sao nên chọn FutureLearn?" — lấy mẫu từ ảnh tham chiếu gốc |
| `--why-blue-bottom` | Xanh cuối section | `#0578C9` | Nền "Tại sao nên chọn FutureLearn?" — lấy mẫu từ ảnh tham chiếu gốc |
| `--natural-black-1` | Đen (rich) | `#181818` | Tên học sinh, tiêu đề card |
| `--natural-black-2` | Đen mềm | `#323232` | Body text chính, nội dung card |
| `--natural-black-3` | Xám đậm | `#525252` | Link nav header |
| `--gray-muted` | Xám phụ | `#747070` | Placeholder input, breadcrumb muted |
| `--gray-icon` | Xám icon phụ | `#6c767a` | Sub text italic |
| `--gray-line` | Xám kẻ | `#C2C2C2` | Border phụ |
| `--gray-light-2` | Xám rất nhạt | `#F2F2F2` | Background section đối tác / FutureLearn |
| `--cream` | Kem vàng nhạt | `#FFF9EB` | Background block giáo viên + phụ huynh |
| `--white` | Trắng | `#FFFFFF` | Nền chính, text trên nền tối |
| `--black-overlay` | Overlay đen 40% | `rgba(0,0,0,0.4)` | Footer overlay, modal backdrop |
| `--breadcrumb-muted` | Trắng mờ 75% | `rgb(236 239 242 / 75%)` | Breadcrumb inactive |
| `--info-blue` | Xanh info | `#03a9f4` | H1 trong block content |
| `--text-on-cyan-1` | Xám cyan pastel | `#96a2a7` | H3 italic phụ |

### Gradient đáng chú ý

```css
/* Footer */
background: linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4)), #0066FF;

/* Section "Về chúng tôi" */
background: linear-gradient(180deg, rgba(115,205,255,0) 0%, #73CDFF 100%);

/* Section "Tại sao nên chọn FutureLearn?" */
background: linear-gradient(180deg, #0398FE 0%, #0588E3 52%, #0578C9 100%);

/* Nav menu active (mobile) */
background: linear-gradient(180deg, rgba(95,196,255,0) 0%, rgba(95,196,255,0.12) 100%);
```

### Quy ước phối màu
- **Text trên nền trắng**: `#007DD3` (heading), `#323232` (body), `#525252` (nav).
- **Text trên nền tối (footer/CTA cam)**: luôn `#FFFFFF`.
- **Nút chính**: nền `#007DD3` viền `#007DD3`, hoặc nền `#FF8A00` viền `#FF8A00` cho CTA hành động.
- **Card**: nền `#FFFFFF`, viền `1px solid #71CEFF` (bo `20px`); card giáo viên viền `#00A6FF`.
- **Input**: nền `#FFFFFF`, viền `#FFFFFF` hoặc `#71CEFF`, bo `20px`.

---

## Typography

### Font stacks

| Token | Font | Fallback | Vai trò |
|---|---|---|---|
| **Heading brand / Title** | `'Quicksand'` | — | Tiêu đề section, button, tiêu đề card lớn |
| **Body / nav / form** | `'Roboto'` | — | Toàn bộ UI chính |
| **Accent / Hero italic** | `'Sriracha'` | — | Dùng cho highlight calligraphic (tải từ Google Fonts nhưng ít xuất hiện trong style chính) |
| **Open Sans** | `'Open Sans'` | — | Hỗ trợ (ít dùng, có trong preload) |
| **Merriweather (serif)** | `'Merriweather', serif` | — | Block content dài (dòng giới thiệu/đoạn văn blog) |
| **Font Awesome** | `FontAwesome` | — | Icon (fa, fas, far) |

> Preload chain: `Open Sans:bold,regular | Quicksand:bold,regular | Sriracha:bold,regular`

### Scale (desktop)

| Stanza | Font | Size | Weight | Line-height | Màu | Ghi chú |
|---|---|---|---|---|---|---|
| Hero `title-future` | Quicksand | **100px** | 600 | 117px | `#FFFFFF` | Câu slogan lớn nhất |
| Hero `title-nangtam` | Quicksand | 60px | 600 | 70px | `#FFFFFF` | Sub slogan |
| Banner heading `banner-taisao` | Quicksand | 60px | 700 | 146% | `#FFFFFF` | Tiêu đề chính |
| Section title (`title-giaovien`, `title-dangky`, `baner-ungdung`) | (Roboto) | **48px** | 600 | 56px | `#007DD3` / `#FFFFFF` | Heading cấp section |
| Sub-heading (`image-title`, `title-vi`) | (Roboto) | **36px** | 600 | 140% | `#FFFFFF` / `#F2F2F2` | |
| Stat number (`span-so`) | (Roboto) | 32px | 500 | 38px | `#007DD3` | |
| Card heading (`title-chuongtrinh`, `name-hocsinh`, `banner-title-taisao`) | (Roboto) | **20–28px** | 500–600 | 23–33px | `#323232` / `#181818` / `#FFFFFF` | |
| Button / CTA (`css-btn`, `button-tainghiem`, `butoon-dangkynhantuvan`) | Quicksand / Roboto | **24px** | 500–600 | 110–28px | `#FFFFFF` | Uppercase |
| Body chính (`addReadMore`, `content-taisao`, `title-vechungtoi`) | (Roboto) | 18px | 400 | 21–130% | `#323232` / `#000000` | `font-feature-settings: 'salt' on, 'liga' off` |
| Nav header (`margin-li-head`) | Roboto | 14–18px | 500 | normal | `#525252` | Uppercase |
| Form input / placeholder | Roboto | 16px | 400 | normal | `#747070` | |
| Sub-text / footer body | Roboto | 16px | 400 | 19px | `#FFFFFF` | |
| Small / dot slick | — | 9–10px | — | — | `#007DD3` / `#FFFFFF` | Dot carousel |

### Highlight (Quicksand Hero)

```css
.title-future {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 600;
  font-size: 100px;
  line-height: 117px;
  color: #FFFFFF;
}
```

### CTA Button (Quicksand)

```css
.css-btn {
  font-family: 'Quicksand';
  font-weight: 600;
  font-size: 20px;
  line-height: 110%;
  color: #FFFFFF;
  text-transform: uppercase;
  background-image: url('/public-home/images/icons/Group-195.svg'); /* capsule SVG */
}
```

### Quy ước typography
- **Tiêu đề lớn** (`Quicksand` 48–100px) luôn dùng gradient hoặc màu thương hiệu `#007DD3` / trắng trên nền tối.
- **Body** dùng Roboto, mặc định 18px (nội dung) / 16px (form, footer, nav).
- **Italic Merriweather** chỉ dùng cho block nội dung dài kiểu editorial.
- Open features kích hoạt: `font-feature-settings: 'salt' on, 'liga' off` cho body.
- Text-transform: **UPPERCASE** trên nav và CTA lớn (`css-btn`, `button-tainghiem`).

---

## Tóm tắt nhanh để dựng UI tương tự

```
Primary brand : #007DD3  (CTA, link, heading)
Secondary     : #0066FF  (footer base)
Cyan accent   : #71CEFF / #00A6FF (border, viền card)
Orange CTA    : #FF8A00 / #FF9900 (cam nóng, marquee, form đăng ký)
Cream BG      : #FFF9EB  (giáo viên, phụ huynh)
Gray BG       : #F2F2F2  (đối tác, FutureLearn section)
Body text     : #323232
Heading font  : Quicksand  (weight 500/600/700)
Body font     : Roboto     (weight 400/500/600)
Editorial     : Merriweather (italic)
Border-radius : 20–24px  (card), 8px (button), 12px (đối tác)
```

---

## Thứ tự Section trên Landing (`https://www.futurelang.edu.vn/`)

Trang là single-page, các section nối tiếp theo thứ tự scroll dọc. Đánh số `01` → `13` theo thứ tự xuất hiện trên DOM.

| # | Section | Mục đích | Class/ID chính (tham chiếu `style.css`) | Đặc điểm trực quan |
|---|---|---|---|---|
| 01 | **Header / Top nav** | Menu điều hướng + CTA "Vào học" / "Đấu trường" | `.header`, `.margin-li-head`, `.css-btn` | Logo trái, menu phải, nút cam "Vào học", nút xanh "Đấu trường" top-right; mobile: hamburger. |
| 02 | **Hero / Banner slogan** | Câu khẩu hiệu + CTA "Trải nghiệm ngay" | `.title-future`, `.title-nangtam`, `.button-tainghiem` | Nền ảnh/gradient xanh, slogan `Quicksand 100px`, CTA cam `.button-tainghiem`. |
| 03 | **Stat strip** | Số liệu: 500.000+ học viên, 10.000+ giáo viên, 85% cải thiện điểm số, 96% hài lòng | `.div-ungdung`, `.ul-ungdung`, `.span-so` | 4 số liệu nằm ngang, dùng `.span-so` 32px xanh. |
| 04 | **"Tại sao nên chọn FutureLearn?"** | 6 lý do chọn (chương trình, 3R-3E, giáo viên, F-SPEAK, app phụ huynh, đa ngôn ngữ) | `.why-choose`, `.why-choose__grid`, `.why-choose__item`, `.why-choose__visual` | Cuộn ngang có scroll-snap trên mobile, lưới 3×2 desktop, nền gradient xanh, minh hoạ học tập bằng icon Font Awesome. |
| 05 | **"FutureLearn dành cho ai?"** | Nhóm đối tượng: Mầm non/Tiểu học, THCS, THPT, Sinh viên, Người đi làm, Giáo viên | `.audiences`, `.audiences__layout`, `.audience-accordion` | Nền xám nhạt, ảnh minh hoạ bên trái và accordion HTML native 6 nhóm người học bên phải; xếp dọc trên mobile. |
| 06 | **"Chương trình đào tạo toàn diện"** | 3 trụ cột: SGK Bộ GD, Phát âm & Giao tiếp, Chứng chỉ (IELTS/TOEIC/Cambridge) | `.training-programs`, `.training-programs__grid`, `.training-program-card` | Nền trắng, lưới 3 card lớn, ảnh minh hoạ tỷ lệ 36:25, tiêu đề và mô tả; viền cyan `#71CEFF`, bo `20px`. |
| 07 | **"Đội ngũ cố vấn, giáo viên"** | Card giáo viên: Alexandra Gilliland, Lydia Jayne Sawyer, Emily Francis, Oliver Rance, TS. Khiêm Nguyễn, Viên Ngọc Sang, Đỗ Đức Thọ, Nguyễn Văn Khương | `.teachers`, `.teachers__track`, `.teacher-card`, `.teacher-card__portrait` | Carousel native có scroll-snap và nút điều hướng, nền kem `.cream` (`#FFF9EB`), card viền cyan, ảnh tròn; 4 card desktop và 1 card mobile. |
| 08 | **"Về chúng tôi" / Press** | Video/clip truyền thông: HTV9, VTV1, VTC6, VnExpress, Dân trí, The Woman, Người đưa tin, Giáo dục thời đại, Hội chữ thập đỏ, Tạp chí Nhân đạo | `.about-press`, `.about-press__media`, `.press-feature`, `.press-index` | Video HTV9 nổi bật, VTV1/VTC6 ở cột phụ và danh mục 8 bài báo hai cột; nền gradient cyan `--gradient-cyan-end`. |
| 09 | **"Đối tác đồng hành"** | Logo đối tác: Viện KHGD&MT, Future Global Edu Singapore, Liên minh KTĐT 4.0, HTV9, FutureKids, FutureLearn, Future Foundation, Future School, FES Group, Smile Together | `.doitac`, `.partner-grid`, `.partner-logo` | Nền xám nhạt `.gray-light-2` (`#F2F2F2`), lưới 5 cột logo, không border-radius (bo `12px` nhẹ). |
| 10 | **"Chứng nhận thẩm định – Giải thưởng"** | 7 chứng nhận/giải: Kỷ lục VN, Nhà lãnh đạo tiêu biểu, Liên minh KTĐT, ĐKDN, Bản quyền tác giả, Top 10 thương hiệu 2020, Hội đồng KHGD, Top 10 Châu Á–TBD 2021 | `.chungnhan`, `.chungnhan-card`, `.chungnhan-img`, `.chungnhan-title` | Carousel ảnh chứng nhận, nền trắng, viền cyan. |
| 11 | **"Đối tác đồng hành" (lặp)** | Lặp lại block đối tác — anchor giữa trang | `.doitac` (id 2) | Trùng nội dung section 09, dùng làm CTA giữa trang trước form đăng ký. |
| 12 | **"Đăng ký nhận tư vấn"** | Form: họ tên phụ huynh, SĐT, email, người biết qua, lời nhắn | `.dangky`, `.title-dangky`, `.butoon-dangkynhantuvan`, `.form-dangky` | Nền cam rực `#FF9900` (gradient nhẹ), input viền trắng bo `20px`, nút submit xanh `.css-btn`. |
| 13 | **"Cảm nhận của học viên – đối tác"** | Tabs 3 nhóm: Học sinh / Giáo viên / Phụ huynh, mỗi tab có testimonial card | `.camnhan`, `.camnhan-tabs`, `.camnhan-card`, `.name-hocsinh` | 3 tab pill (Slick/data-tabs), card viền cyan, có thể có iframe YouTube. |
| 14 | **Footer** | Thông tin liên hệ, Customer service, Download, Social, MST doanh nghiệp | `.footer`, `.footer-gradient`, `.footer-social`, `.footer-bocongthuong` | Gradient `#0066FF` + overlay đen 40%, 4 cột, icon social tròn trắng, logo Bộ Công Thương. |

### Quy ước đặt `id` / `class` cho section (gợi ý)

Để đồng bộ với file CSS hiện có và rule `.cursor/rules/futurelang-conventions.mdc`, mỗi section landing nên có:

```html
<section id="ten-section" class="section section--ten-section py-5">
  <div class="container-xl">
    <h2 class="section__title">…</h2>
    <!-- nội dung -->
  </div>
</section>
```

- `id` dùng kebab-case, khớp anchor menu (`#teachers`, `#partners`, `#register`).
- Class BEM `.section--ten-section` / `.section__title` cho custom style.
- Tiêu đề section luôn là `<h2>`, tiêu đề card là `<h3>`.

### Thứ tự ưu tiên khi render (visual hierarchy)

```
Hero  →  Stats  →  Lý do chọn  →  Đối tượng  →  Chương trình
     →  Giáo viên  →  Truyền thông  →  Đối tác
     →  Chứng nhận  →  Đối tác (lặp CTA)  →  Form đăng ký
     →  Cảm nhận  →  Footer
```

CTA chính xuất hiện **3 lần**: header (cam "Vào học"), sau hero (cam "Trải nghiệm ngay"), trước footer (form đăng ký + marquee cam). Không đặt CTA ở giữa các section nội dung để tránh phân tán chú ý.
