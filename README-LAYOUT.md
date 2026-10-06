# FutureLearn Landing — Structure

```
d:\[2.2] Vibe coding\Futurelang\
├── index.html                  # Landing chính — Nav, Hero, Stats, Why choose, Audiences, Programs, Teachers, Press
├── style.md                    # Style guide (đã có)
├── public-home/
│   ├── css/
│   │   ├── style.css?v=1.0.0   # Global token, reset, capsule button
│   │   ├── home.css?v=1.0.0    # Header + Hero riêng
│   │   ├── stats.css?v=1.0.0   # Stat strip responsive
│   │   ├── why-choose.css?v=1.0.1 # Section lý do chọn FutureLearn
│   │   ├── audiences.css?v=1.0.0 # FutureLearn dành cho ai
│   │   ├── training-programs.css?v=1.0.0 # Chương trình đào tạo
│   │   ├── teachers.css?v=1.0.0 # Đội ngũ cố vấn, giáo viên
│   │   └── about-press.css?v=1.0.0 # Về chúng tôi / Báo chí
│   ├── js/
│   │   ├── main.js?v=1.0.0     # AOS init, sticky nav, mobile drawer
│   │   ├── stats.js?v=1.0.0    # Counter khi stat strip vào viewport
│   │   └── teachers.js?v=1.0.0 # Điều khiển carousel giáo viên
│   └── images/
│       ├── icons/              # (để trống — dùng Font Awesome inline)
│       ├── audiences/          # Ảnh WebP cho nhóm người học
│       ├── programs/           # Ảnh WebP cho chương trình đào tạo
│       ├── teachers/           # Chân dung WebP của cố vấn, giáo viên
│       └── press/              # Thumbnail WebP cho video và bài báo
└── .cursor/
└── .agents/
```

## Asset version (cache bust)
| File | Version |
|---|---|
| `style.css` | `v=1.0.8` |
| `home.css` | `v=1.1.1` |
| `stats.css` | `v=1.0.0` |
| `why-choose.css` | `v=1.0.1` |
| `audiences.css` | `v=1.0.0` |
| `training-programs.css` | `v=1.0.0` |
| `teachers.css` | `v=1.0.0` |
| `about-press.css` | `v=1.0.0` |
| `main.js` | `v=1.1.2` |
| `stats.js` | `v=1.0.0` |
| `teachers.js` | `v=1.0.0` |

## Cách chạy
Mở `index.html` qua bất kỳ static server nào (ví dụ `npx serve` hoặc Live Server trong VS Code). Hiện đang dùng CDN cho Bootstrap / jQuery / Font Awesome / AOS — khi lên production nên self-host các thư viện này.

## Phạm vi task lần này
Đã code **Nav** + **Hero** + **Stat strip** + **Tại sao nên chọn FutureLearn?** + **FutureLearn dành cho ai?** + **Chương trình đào tạo toàn diện** + **Đội ngũ cố vấn, giáo viên** + **Về chúng tôi / Press** theo `style.md` và yêu cầu UI/UX tương tự `https://www.futurelang.edu.vn/`.

Các section còn lại sau "Về chúng tôi / Press" **chưa** được implement. Sẽ tiếp tục ở task sau nếu cần.
