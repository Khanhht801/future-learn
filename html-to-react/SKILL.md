---
name: html-to-react
description: Convert existing HTML/CSS templates or static pages into React components while preserving layout, responsive behavior, assets, and interactions. Use for HTML-to-JSX/TSX conversion with Tailwind CSS or CSS Modules, including requests in Vietnamese to chuyển HTML sang React giữ nguyên giao diện. For new designs without source HTML, use the project's normal UI workflow.
---

# HTML to React — giữ nguyên giao diện

Chuyển mã nguồn HTML/CSS thành React có thể chạy trong dự án đích. Ưu tiên độ trung thực với bản gốc: bố cục, nội dung, typography, hình ảnh, responsive và trạng thái tương tác. Việc cải tiến thiết kế là phạm vi riêng, chỉ thực hiện khi được yêu cầu.

## 1. Xác định nguồn và dự án đích

- Đọc hướng dẫn repo, `git status`, diff hiện có và cấu hình dự án trước khi sửa. Giữ nguyên công việc ngoài task.
- Tìm HTML, stylesheet theo đúng thứ tự tải, inline style, script, font, icon và ảnh được tham chiếu. Nguồn có thể là file, thư mục template hoặc URL người dùng cung cấp; dùng công cụ đọc URL khi cần.
- Kiểm tra React/framework, JS hay TS, bundler, router, cách tổ chức component và phiên bản công cụ CSS thực tế. Đọc tài liệu cài trong repo hoặc tài liệu chính thức đúng phiên bản khi cần xác nhận API; với Next.js, tuân thủ hướng dẫn phiên bản của repo.
- Nếu chưa có app đích, dựng app React tối thiểu theo yêu cầu và công cụ đang có. Chọn TypeScript khi không có quy ước khác, nêu ngắn giả định. Dùng package manager và lockfile sẵn có.
- Nếu thiếu nguồn HTML quyết định kết quả, yêu cầu đúng file/URL còn thiếu; tiếp tục kiểm kê phần đã có. Screenshot là bằng chứng giao diện bổ sung, không đủ để khẳng định đã bảo toàn DOM, breakpoint hoặc hành vi không nhìn thấy.

Kết thúc bước này khi biết nguồn nào được chuyển, nơi tích hợp, các phụ thuộc ảnh hưởng giao diện và chế độ CSS sẽ dùng.

## 2. Chốt chế độ CSS và ghi nhận bản gốc

Chọn theo thứ tự:

1. Yêu cầu rõ của người dùng: Tailwind CSS hoặc CSS Modules.
2. Quy ước của app đích nếu người dùng chưa chọn.
3. CSS Modules khi chưa có quy ước, vì có thể giữ chính xác declaration, selector và media query gốc.

Nếu người dùng muốn cả hai phiên bản, tạo hai đầu ra độc lập theo cấu trúc dự án; mỗi bản có kiểm chứng riêng. Với Tailwind, CSS cục bộ bổ trợ chỉ dành cho phần khó biểu đạt rõ bằng utility. Nếu người dùng yêu cầu tuyệt đối utility-only, nêu phần không tương thích trước khi thay đổi yêu cầu đó.

Đọc [references/styling.md](references/styling.md) để chuyển theo chế độ đã chọn.

Trước khi chỉnh sửa, khi có trình duyệt:

- Mở bản gốc bằng server phù hợp để asset, font và script tải đúng; tránh dựa riêng vào `file://`.
- Ghi lại screenshot toàn trang và vùng quan trọng ở cùng viewport dự kiến kiểm chứng. Dùng kích thước người dùng chỉ định; nếu chưa có, chọn ví dụ 390, 768 và 1440 CSS px cùng các breakpoint quan trọng tìm được trong nguồn.
- Kiểm kê thứ tự section, chiều rộng container, cột, gap, padding, font/weight/line-height, màu, border, shadow, vị trí sticky/fixed và stacking context.
- Ghi hành vi gốc có thật: menu mở/đóng, tab, accordion, modal, form, carousel, hover/focus, scroll và anchor. Tách lỗi đã tồn tại trong nguồn khỏi sai khác do chuyển đổi.

Khi không có trình duyệt hoặc nguồn không render được, ghi rõ giới hạn; dùng DOM/CSS/assets làm bằng chứng và giữ phần kiểm chứng trực quan ở trạng thái chưa xác nhận.

## 3. Chuyển HTML và hành vi sang React

- Giữ thứ tự DOM và các wrapper ảnh hưởng grid/flex, selector con trực tiếp, kích thước hoặc stacking. Chỉ tách component ở ranh giới có ý nghĩa như section, phần lặp hoặc phần có state; kiểm tra việc tách không đổi layout.
- Chuyển `class` → `className`, `for` → `htmlFor`, thuộc tính JSX/SVG đúng tên, đóng void element và chuyển comment. Giữ `aria-*`, `data-*`, SVG `viewBox`, `defs`, gradient, clip path và liên kết ID.
- Bảo toàn khoảng trắng có ý nghĩa giữa inline element. Với form, chọn controlled/uncontrolled nhất quán; dùng `defaultValue`/`defaultChecked` khi cần giữ giá trị ban đầu mà chưa có state điều khiển.
- Chuyển inline event handler thành handler React. Thay script thao tác DOM thuộc cây React bằng state/ref/effect hoặc adapter thư viện phù hợp; cleanup listener, timer và instance khi unmount. Khi nguồn chỉ có giao diện tĩnh, giữ phạm vi tương tác được yêu cầu; báo backend hoặc endpoint còn thiếu.
- Dùng key ổn định cho dữ liệu lặp. Bảo đảm ID vẫn duy nhất khi component được render nhiều lần, đồng thời giữ quan hệ label, ARIA và SVG reference.
- Giữ nguyên nội dung, đường dẫn/đích link, font, icon, ảnh, `object-fit`, crop, aspect ratio và thuộc tính ảnh ảnh hưởng kích thước. Tính lại đường dẫn tương đối, kể cả `url(...)` trong CSS sau khi di chuyển file. Đổi thư viện ảnh/icon chỉ khi có yêu cầu hoặc phụ thuộc không dùng được và đã nêu sai khác.
- Chuyển metadata, stylesheet và script cấp document vào cơ chế tương ứng của framework; đặt nội dung trang trong component. Với SSR, chỉ thêm client boundary nơi cần tương tác hoặc browser API; bảo đảm render đầu tiên nhất quán để tránh hydration mismatch.
- Giữ HTML semantic và thao tác bàn phím; bổ sung tên truy cập/focus management khi cần chuyển tương tác sang React, đồng thời kiểm tra ảnh hưởng lên giao diện.

Đầu ra phải là component JSX/TSX thực sự, có import và asset hợp lệ, được nối vào entry/route của app. Chỉ dùng HTML injection cho vùng nội dung tin cậy có nhu cầu cụ thể; không dùng để thay thế việc chuyển component.

## 4. Kiểm chứng và sửa sai khác

- Chạy script lint/typecheck/build phù hợp với repo. Báo riêng lỗi có sẵn, lỗi mới và kiểm tra không thể chạy. Chỉ thêm test hành vi khi có logic đủ ý nghĩa cần bảo vệ.
- Mở bản React và bản gốc với cùng viewport, zoom, theme, dữ liệu, locale, scroll và trạng thái tương tác. Chờ font/ảnh sẵn sàng, đồng bộ thời điểm animation trước khi chụp. Dùng overlay/diff ảnh nếu công cụ sẵn có; đọc trực tiếp giao diện để phân biệt sai hình học với nhiễu rasterization.
- Sửa theo thứ tự: font/assets → container và cột → spacing/kích thước → typography và xuống dòng → màu/viền/hiệu ứng → trạng thái tương tác. Kiểm tra computed style khi chưa rõ nguyên nhân.
- Kiểm tra breakpoint gốc, ngay trước/sau điểm chuyển layout và một kích thước giữa hai mốc. Nếu app có EN/VI hoặc nội dung dài, kiểm tra các biến thể dùng chung component.
- Xác nhận tiêu đề, nút và nội dung thực sự hiển thị đủ; kiểm tra scroll ngang, tràn chữ, min-width của flex/grid, nội dung bị che bởi sticky/fixed, stacking và overflow. Giữ clipping có chủ ý của bản gốc; không dùng `overflow: hidden` để che sai lệch mới.
- Thử các hành vi đã kiểm kê và focus bàn phím. Kiểm tra console, hydration và request asset lỗi.

Hoàn thành khi app render được trong dự án đích, các kiểm tra phù hợp đạt và không còn sai khác đáng kể chưa giải thích ở layout hoặc hành vi đã kiểm chứng. Khi thiếu công cụ/asset, bàn giao phần đã làm và chỉ rõ tiêu chí còn chưa xác nhận; không khẳng định pixel-perfect từ việc build thành công.

## 5. Bàn giao

Nêu ngắn bằng ngôn ngữ người dùng:

- Component/route đã chuyển và chế độ CSS được chọn.
- Kiểm tra đã chạy, viewport/trạng thái đã đối chiếu và sai khác hoặc phụ thuộc còn lại.
- Các đường dẫn để review hoặc chạy kết quả; thêm commit và trạng thái push nếu quy trình repo yêu cầu.

Tuân thủ quy trình commit/push/deploy đang áp dụng; việc chuyển HTML không tự mở rộng phạm vi sang xuất bản hoặc thay đổi dịch vụ hosting.
