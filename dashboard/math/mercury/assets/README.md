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

`mercury-banner.webp` được tạo bằng imagegen tích hợp, tối ưu thành WebP 1920 × 640. Ảnh dùng cho banner và cắt theo khung dọc để minh họa sidebar. Chữ trên biển là HTML để rõ nét và truy cập được bằng trình đọc màn hình.

Prompt cuối:

```text
Use case: illustration-story. Asset type: panoramic hero banner artwork for a Vietnamese children's math learning game, 3:1 ultra-wide landscape. Polished premium chibi 2D storybook game illustration, soft rounded forms, luminous blue and lavender galaxy, warm amber Mercury crater surface at bottom. Composition precisely: a large warm orange cratered Mercury planet fills leftmost 23%; a large front-facing EMPTY light honey wooden two-plank sign at x25%-43%, centered vertically, straight horizontal boards with rounded edges and small golden fastenings, blank cream wood surface with NO writing; adorable smiling little child astronaut in white and blue spacesuit floats at x49%-58%; friendly small white robot with cyan glowing eyes at x62%-69%; golden smiling stars sprinkled sparingly and tiny lavender planets in the distance. Rightmost 28% stays calm blue-lavender nebula to place a white objectives card over it. Important: the website displays this as a shallow panoramic strip, so keep the sign and the astronaut faces entirely in the central 55% of the canvas height; generous sky above and ground below may be cropped. Bright magical cheerful child-friendly atmosphere, polished shading, blue #2463ff, lavender #a18bf4, navy, golden yellow. No text, no lettering, no logos, no UI, no watermark. The wood sign must stay blank for HTML text overlay.
```
