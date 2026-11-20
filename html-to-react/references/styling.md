# Chuyển CSS mà giữ nguyên kết quả render

Đọc phần chung và nhánh CSS đã chọn. Dựa vào phiên bản cài đặt, config và computed style của bản gốc thay vì mặc định các giá trị của framework.

## Những yếu tố cần giữ ở cả hai chế độ

- Lập quan hệ giữa selector gốc và phần tử/trạng thái đích, bao gồm selector theo ancestor, sibling, attribute và pseudo-element. Class có thể đang được script dùng làm hook; chuyển hook đó sang state/ref hoặc thuộc tính riêng.
- Giữ kết quả cascade: reset, thứ tự import, specificity, inheritance, CSS variables, `!important` có chủ đích và thứ tự media query. Gộp/tách rule chỉ sau khi hiểu declaration nào đang thắng.
- Giữ giá trị và đơn vị khi chúng ảnh hưởng kích thước: `%`, `rem`, `em`, `vh`/`dvh`, `calc()`, `clamp()`, grid tracks, min/max-width, line-height và letter-spacing. Kiểm tra `box-sizing`, root font size, margin mặc định và margin collapse.
- Giữ breakpoint thật, loại query (min/max-width hoặc container query), hướng layout và thứ tự phần tử. Chỉ đổi chiến lược responsive nếu đã chứng minh hành vi tương đương ở khoảng giữa các mốc.
- Giữ `::before`/`::after` gồm `content`, vị trí, z-index và pointer events; giữ keyframe, duration, easing, transform origin và các media query về giảm chuyển động.
- Giữ font-face, font weight thực có, fallback và cách tải font. Font sai có thể đổi toàn bộ chiều cao section dù CSS spacing đúng.
- Phần HTML dùng framework CSS cũ cần được kiểm kê các rule thực sự có tác dụng. Chuyển các rule đó sang chế độ đích; giữ stylesheet nguồn làm baseline, không xóa trước khi đối chiếu đủ.

## Nhánh A — Tailwind CSS

### Tích hợp đúng dự án

Xác định Tailwind đã cài chưa, phiên bản, plugin, theme, source scanning và entry stylesheet. Dùng cách cấu hình đúng phiên bản; ví dụ dự án v3 và v4 có cơ chế cấu hình khác nhau. Thay đổi dependency/config tối thiểu và giữ một hệ thống CSS hoạt động nhất quán.

So sánh tác động của Preflight/reset lên heading, list, button, input, image và border. Nếu app đã dùng Tailwind, bổ sung style có phạm vi cho vùng chuyển đổi thay vì đổi reset toàn app. Nếu mới tích hợp, chọn chiến lược reset phù hợp và kiểm tra ảnh hưởng các route hiện có.

### Ánh xạ theo giá trị thật

- Dùng utility/token khi giá trị sau compile khớp nguồn. Giá trị riêng lẻ dùng arbitrary value đúng cú pháp phiên bản, ví dụ `gap-[18px]` hoặc `max-w-[1180px]`; không làm tròn theo thang spacing để class trông đẹp.
- Không coi `gap-4`, `text-sm` hoặc `md:` là tương đương nguồn chỉ vì tên quen thuộc: theme, font-size kèm line-height và breakpoint có thể khác.
- Giữ media query gốc bằng breakpoint/variant tương ứng; dùng CSS có phạm vi nếu query phức tạp hoặc giới hạn biên không biểu đạt rõ trong phiên bản đang dùng. Kiểm tra đúng tại biên, không giả định chuyển `max-width` sang `min-width` là tương đương.
- Dùng variant hover/focus/disabled/group/peer khi selector và thứ tự DOM phù hợp. Với selector phức tạp, animation hoặc pseudo-element khó đọc, giữ CSS cục bộ nhỏ thay vì thay cấu trúc DOM chỉ để thuận tiện viết utility.
- Bảo đảm class có thể được bộ build phát hiện: chọn giữa các chuỗi class đầy đủ. Ví dụ ánh xạ `tone` tới `"bg-red-500"`/`"bg-blue-500"` thay vì ghép `bg-${tone}-500`.
- Với giá trị runtime liên tục, giữ utility tĩnh và truyền giá trị qua CSS custom property; dùng cú pháp tham chiếu custom property đúng phiên bản và type hợp lệ khi dùng TypeScript.
- Thứ tự class trong `className` không bảo đảm thứ tự cascade. Loại bỏ utility mâu thuẫn và kiểm tra CSS sinh ra trước khi thêm `!important`.

Trích token dùng chung khi thật sự lặp hoặc dự án đã có token khớp. Không ép template vào palette, container hoặc bộ component khác làm lệch giao diện. Chỉ xóa rule CSS gốc sau khi mọi consumer của nó đã chuyển và kiểm chứng.

## Nhánh B — CSS Modules

### Bảo toàn cascade khi tạo phạm vi

- Chuyển style riêng vào file `*.module.css` theo quy ước app. Import object `styles` và nối từng class gốc sang tên export đúng; dùng `styles["card-title"]` nếu giữ tên có dấu gạch ngang.
- Giữ declaration, media query và thứ tự rule ban đầu trong lượt chuyển đầu. Module hóa trước, tinh gọn sau khi đối chiếu nếu cần.
- Giữ reset, font-face, token dùng toàn app và quy tắc `html`/`body` ở stylesheet global mà framework hỗ trợ. Selector element trong module nên được neo vào class cục bộ, ví dụ `.page h2`, để tránh rò style hoặc lỗi pure selector.
- Kiểm tra selector vượt ranh giới component: tên class đã hash của component con không còn là class gốc trong selector module cha. Đặt selector tại module sở hữu, truyền class có chủ đích hoặc dùng hợp đồng `data-*` rõ ràng; không rải `:global` chỉ để giữ selector cũ.
- Với class do thư viện ngoài tạo, giới hạn `:global(...)` dưới wrapper cục bộ khi công cụ hỗ trợ; kiểm tra DOM thực tế và stylesheet của thư viện.
- Chuyển trạng thái từ `classList.toggle("active")` sang class module có điều kiện theo state React. Giữ nguyên selector tổ hợp như `.tab.active` bằng cách gắn đủ hai class.
- Kiểm tra cách bundler xử lý keyframe, animation name, CSS nesting và `composes`; giữ cú pháp được dự án hỗ trợ. Chạy production build để phát hiện lỗi export/selector mà dev có thể bỏ sót.

Ví dụ giữ selector con trực tiếp và khoảng cách chính xác:

```css
/* Card.module.css */
.card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 18px;
}

.card > .title {
  margin: 0;
  line-height: 1.25;
}
```

```tsx
import styles from "./Card.module.css";

export function Card() {
  return (
    <article className={styles.card}>
      <img src="/assets/avatar.png" width={96} height={96} alt="" />
      <h2 className={styles.title}>Tiêu đề gốc</h2>
    </article>
  );
}
```

Ví dụ chỉ minh họa ánh xạ class. Trong task thực tế, giữ nội dung, asset, kích thước và semantics của nguồn đang chuyển.
