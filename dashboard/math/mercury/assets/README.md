# Hình chibi cho bài tô màu

Tạo bằng công cụ imagegen tích hợp, nền trong suốt. Bản dùng trong giao diện được tối ưu thành WebP 256 × 256, giữ kênh alpha. Trạng thái chưa tô dùng bộ lọc CSS xám; trạng thái đã tô hiển thị màu gốc. Không sửa tiến độ hoặc đáp án.

## Prompt

Mỗi hình được tạo riêng với cùng prompt bên dưới; thay `{subject}` theo bảng.

| File | Subject |
| --- | --- |
| `chibi-star.webp` | a golden yellow five-point star with rounded plump points |
| `chibi-circle.webp` | a sky blue perfectly round circle character, circular silhouette |
| `chibi-flower.webp` | a pink flower with five big rounded petals and a golden yellow round center, face on center |
| `chibi-heart.webp` | a coral pink plump heart character with clear heart silhouette |
| `chibi-square.webp` | a lavender purple square character with softly rounded corners, clear square silhouette |

```text
Use case: stylized-concept. Asset type: one isolated educational game counting token for young children, transparent PNG. Subject: {subject}. Style: polished adorable chibi storybook game sticker, softly shaded 2D with gentle volume, small glossy navy oval eyes, tiny happy smile, rosy cheeks, a few soft highlights, friendly thick colored outline. Front view, centered, entire shape visible, large simple recognizable silhouette, evenly padded, no limbs, no accessories, no separate sparkles, no ground or cast shadow, no text, no border frame. Designed to read clearly at 64px on a warm cream and white kids math app with navy #1f3a70 and blue #2447c6. One character only. Actual transparent background, not a checkerboard. Cheerful, clean, charming, premium children's learning illustration.
```

## Banner Sao Thủy

`mercury-banner.webp` được tạo bằng imagegen tích hợp, tối ưu thành WebP 1920 × 640. Ảnh dùng riêng cho banner; sidebar giữ minh họa học tập chung của dashboard. Chữ trên biển là HTML để rõ nét và truy cập được bằng trình đọc màn hình.

Prompt cuối:

```text
Use case: illustration-story. Asset type: panoramic hero banner artwork for a Vietnamese children's math learning game, 3:1 ultra-wide landscape. Polished premium chibi 2D storybook game illustration, soft rounded forms, luminous blue and lavender galaxy, warm amber Mercury crater surface at bottom. Composition precisely: a large warm orange cratered Mercury planet fills leftmost 23%; a large front-facing EMPTY light honey wooden two-plank sign at x25%-43%, centered vertically, straight horizontal boards with rounded edges and small golden fastenings, blank cream wood surface with NO writing; adorable smiling little child astronaut in white and blue spacesuit floats at x49%-58%; friendly small white robot with cyan glowing eyes at x62%-69%; golden smiling stars sprinkled sparingly and tiny lavender planets in the distance. Rightmost 28% stays calm blue-lavender nebula to place a white objectives card over it. Important: the website displays this as a shallow panoramic strip, so keep the sign and the astronaut faces entirely in the central 55% of the canvas height; generous sky above and ground below may be cropped. Bright magical cheerful child-friendly atmosphere, polished shading, blue #2463ff, lavender #a18bf4, navy, golden yellow. No text, no lettering, no logos, no UI, no watermark. The wood sign must stay blank for HTML text overlay.
```

### Phiên bản màu xanh trời – cam đào

Đã tạo lại banner bằng imagegen ở chế độ chỉnh sửa ảnh gốc, giữ bố cục để chữ HTML vẫn khớp biển gỗ. Dùng nền xanh trời sáng, Sao Thủy cam đào, đá màu cát và biển gỗ vàng kem; giảm nền navy/tím đậm. File hiện tại: `mercury-banner.webp` (WebP 1920 × 640), dùng riêng cho hero. URL ảnh có phiên bản để trình duyệt tải bản mới.

Prompt chỉnh sửa cuối:

```text
Use case: lighting-weather / style-transfer. Edit target: the supplied existing Mercury banner. Keep the exact 3:1 panoramic composition, all character identities, the positions and sizes of Mercury on the left, blank two-plank wooden sign at x22%-47%, child astronaut in center, robot center-right, and open space on far right. Change ONLY the art treatment, palette and lighting to a LIGHT, airy, soft pastel children's educational game banner matching a pale sky-blue and peach-orange website. Replace the very dark navy, black, saturated violet and dense photorealistic galaxy with a cheerful luminous cornflower/sky-blue starry sky, soft light cyan and periwinkle clouds; keep a medium blue upper sky but NO dark navy or black corners. Reduce detailed noisy nebula texture, reduce contrast and saturation substantially. Mercury should be soft apricot and peach orange with gentle warm beige craters, not blazing bright gold, with smooth storybook shading instead of realistic rock texture. Ground and rocks light peach, sand, creamy orange and muted lavender shadows. Wood sign pale vanilla cream center and soft honey orange border, both planks remain completely blank, exact existing dimensions and positions. Astronaut and robot retain bright clean white and sky-blue suits, cute expressive chibi faces, soft rounded dimensional 2D illustration; subtle warm highlights, no dramatic rim lighting. Little stars butter yellow, gentle glow. Airy friendly blue-orange balance, crisp enough for a short shallow banner, a whimsical children's picture book look. No new objects, no text, no logos, no UI or watermark. Preserve the blank sign for existing HTML text overlay.
```

Kiểm tra: ảnh tải thành công, tiêu đề nằm trong banner, không tràn ngang ở 320/390/768/1024/1366/1536px và không có lỗi JavaScript trên Chromium/Playwright; đã xem bố cục desktop. Đã kiểm tra cú pháp JavaScript và Git diff.


## Bộ hình cho nhiệm vụ chọn nhóm

Tạo bằng imagegen tích hợp, nền trong suốt; tối ưu WebP 256 × 256, giữ alpha. Ngôi sao dùng lại `chibi-star.webp`. Ảnh mới: `chibi-crystal.webp`, `chibi-planet.webp`, `chibi-robot.webp`.

### crystal

```text
Use case: stylized-concept. Asset type: a single isolated transparent children's educational counting game token. Premium polished chibi 2D storybook game art, soft dimensional shading, clean rounded outline, cheerful bright pastel sky-blue and warm orange website palette, clear recognizable silhouette at 64px. Front view, centered, whole object visible, equal padding, true transparent background. No lettering, no numbers, no logos, no border frame, no separate sparkles, no ground, no cast shadow. Subject: one small cluster of purple and lavender faceted crystals, one tall central pointed gem and two short side gems, glossy soft violet highlights. No face, no limbs. A single cluster counts as one object.
```

### planet

```text
Use case: stylized-concept. Asset type: a single isolated transparent children's educational counting game token. Premium polished chibi 2D storybook game art, soft dimensional shading, clean rounded outline, cheerful bright pastel sky-blue and warm orange website palette, clear recognizable silhouette at 64px. Front view, centered, whole object visible, equal padding, true transparent background. No lettering, no numbers, no logos, no border frame, no separate sparkles, no ground, no cast shadow. Subject: one cute small turquoise blue planet with mint-green land patches and a pink-lavender orbit ring tilted diagonally. Soft glossy storybook finish, no face, no limbs. One planet only.
```

### robot

```text
Use case: stylized-concept. Asset type: a single isolated transparent children's educational counting game token. Premium polished chibi 2D storybook game art, soft dimensional shading, clean rounded outline, cheerful bright pastel sky-blue and warm orange website palette, clear recognizable silhouette at 64px. Front view, centered, whole object visible, equal padding, true transparent background. No lettering, no numbers, no logos, no border frame, no separate sparkles, no ground, no cast shadow. Subject: one adorable friendly white and sky-blue chibi helper robot with a rounded rectangular head, shiny navy face screen, happy cyan curved eyes, small antenna, compact body, one hand raised with index finger pointing up in a teaching gesture. Three-quarter front view. Full body, no other objects.
```
