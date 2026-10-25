// 예시 보고서 — 자연관찰 연습 세트마다 「잘 쓴 보고서」 한 벌(원장 2026-10-25: 보고서 예시에 관찰그림이 그려져 있어야 한다).
// 관찰그림은 data/pencil-svg.js로 그린 연필 그림이고, 화면에서는 손에 든 연필이 선을 하나씩 그려 간다(observe-sample.js).
// 글은 대회 최우수 보고서의 「쓰는 방식」(관찰한 사실 → 손으로 확인한 것 → 추정, 본 것과 생각한 것을 나눔)을 따랐고 문장은 전부 새로 썼다.
// 아이에게 보여 주는 목적: 베끼기가 아니라 「그림엔 무엇을 표시하고, 글엔 무엇을 쓰는가」. 그래서 이름은 번호로 두고 추정에는 「~로 추정된다」를 붙였다.
import { pencilSvg, shapes as S } from './pencil-svg.js';

// ── 곤충 ──
const cricket = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '① 옆에서 본 모습', { size: 14 }),
  // 몸통(납작한 타원)·앞가슴·머리
  d.line(S.ellipse(200, 178, 72, 26)), d.hatch(`M128 178 a72 26 0 0 0 144 0 L272 190 a72 20 0 0 1 -144 0 Z`, 1),
  d.line(`M232 150 C250 146, 262 150, 266 160 L266 194 C258 202, 244 204, 236 200`), d.line(S.ellipse(281, 174, 19, 17)),
  d.line(S.ellipse(288, 168, 5, 6)), d.hatch(S.ellipse(288, 168, 5, 6), 2), d.line(`M292 186 L300 194 M286 188 L288 196`),
  // 더듬이(몸보다 길게)
  d.line(`M292 160 C320 120, 360 95, 392 70`, { w: 1.1 }), d.line(`M290 162 C312 134, 330 118, 350 96`, { w: 1 }),
  // 앞날개 두 장(포개짐)과 맥
  d.line(`M232 158 C215 150, 170 150, 150 160 L150 176 C175 170, 215 170, 234 166 Z`), d.line(`M230 162 C212 155, 172 156, 154 164 L154 172`, { w: 1 }),
  d.sketch(`M160 162 L226 158 M165 168 L228 163`),
  // 뒷다리(넓적다리 굵게 위로, 종아리 아래로 가시)
  d.line(`M185 184 C165 166, 142 140, 128 126 C120 132, 126 150, 150 172 C160 180, 172 190, 184 192 Z`), d.hatch(`M185 184 C165 166, 142 140, 128 126 C120 132, 126 150, 150 172 C160 180, 172 190, 184 192 Z`, 1),
  d.line(`M128 126 C110 150, 96 175, 88 208`, { w: 1.6 }), d.line(`M104 162 L98 160 M98 174 L92 172 M94 186 L88 184 M90 198 L84 197`, { w: 0.9 }), d.line(`M88 208 L78 214 L72 212`),
  // 가운뎃다리·앞다리
  d.line(`M228 196 C236 206, 240 216, 236 226 L228 230`), d.line(`M252 196 C262 204, 268 214, 266 226 L258 228`), d.line(`M206 200 C202 212, 196 220, 186 224`),
  // 꼬리털(미모)
  d.line(`M130 174 C110 180, 95 190, 82 202`, { w: 1 }), d.line(`M130 182 C112 192, 100 206, 92 220`, { w: 1 }),
  // 확대: 앞날개 맥(소리판)
  d.magnifier(336, 222, 36, [d.sketch(`M302 212 L372 208 M302 222 L372 220 M302 232 L372 234`, 0.9), d.line(`M318 210 L322 236 M338 208 L342 236 M356 208 L360 236`, { w: 0.9 }), d.line(S.ellipse(332, 224, 11, 7), { w: 1.1 })].join(''), [200, 162, 7]),
  d.text(336, 272, '앞날개 확대 (타원 무늬)', { size: 11, anchor: 'middle', dim: true }),
  // 이름표
  d.label(366, 92, 392, 118, '더듬이: 몸보다 길다', { anchor: 'end', size: 12 }), d.label(190, 156, 172, 66, '앞날개 2장이 포개짐', { size: 12 }),
  d.label(140, 150, 60, 120, '뒷다리 넓적다리', { anchor: 'end', size: 12 }), d.label(90, 212, 44, 246, '꼬리털 2개', { size: 12 }), d.label(288, 168, 330, 150, '겹눈', { size: 12 }), d.label(92, 186, 34, 190, '가시', { anchor: 'end', size: 12 }),
  d.ruler(24, 272, 110, 2),
], { seed: 11 });
const longhead = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '② 옆에서 본 모습', { size: 14 }),
  // 길고 가는 몸통, 뾰족한 머리
  d.line(`M110 176 C150 160, 240 158, 300 164 L354 158 C364 160, 368 166, 362 172 L300 190 C240 196, 150 194, 110 186 Z`), d.hatch(`M112 180 C150 170, 240 168, 300 176 L352 166 L300 190 C240 196, 150 194, 110 186 Z`, 1),
  d.line(S.ellipse(338, 166, 5, 4)), d.hatch(S.ellipse(338, 166, 5, 4), 2),
  // 짧은 납작 더듬이
  d.line(`M352 160 L380 148 L384 152 L356 164 Z`, { w: 1 }),
  // 날개(길게, 나란히)
  d.line(`M292 164 C260 156, 180 154, 128 166`, { w: 1 }), d.sketch(`M286 168 C250 162, 190 160, 140 170 M280 172 C250 167, 200 165, 150 175`),
  // 아주 긴 뒷다리
  d.line(`M250 186 C220 170, 170 140, 120 108 C112 112, 118 124, 150 150 C180 172, 210 190, 246 194 Z`), d.hatch(`M250 186 C220 170, 170 140, 120 108 C112 112, 118 124, 150 150 C180 172, 210 190, 246 194 Z`, 1),
  d.line(`M120 108 C96 150, 72 200, 56 250`, { w: 1.5 }), d.line(`M100 150 L94 148 M90 172 L84 170 M80 196 L74 194 M68 222 L62 220`, { w: 0.9 }), d.line(`M56 250 L44 258`),
  d.line(`M296 190 C300 206, 296 220, 286 230`), d.line(`M322 186 C332 200, 334 214, 326 226`), d.line(`M262 192 C258 208, 250 218, 238 224`),
  // 확대: 머리와 눈
  d.magnifier(80, 70, 40, [d.line(`M44 80 L104 62 C114 64, 118 72, 108 78 L50 92 Z`), d.line(S.ellipse(94, 68, 6, 5)), d.hatch(S.ellipse(94, 68, 6, 5), 2), d.line(`M106 64 L130 52 L132 58 L110 70 Z`, { w: 0.9 })].join(''), [340, 166, 10]),
  d.text(124, 44, '머리·더듬이 확대', { size: 11, dim: true }),
  d.label(372, 152, 392, 96, '납작하고 짧은 더듬이', { anchor: 'end', size: 12 }), d.label(236, 166, 300, 246, '날개 2장이 나란히', { size: 12 }),
  d.label(150, 150, 150, 230, '뒷다리: 몸길이만큼 길다', { size: 12 }), d.label(356, 164, 372, 206, '뾰족한 머리', { size: 12 }),
  d.ruler(250, 268, 140, 7),
], { seed: 12 });
const stripe = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '③ 위에서 본 모습', { size: 14 }),
  // 위에서 본 몸: 머리 오른쪽, 등줄 밝은 띠
  d.line(`M120 150 C150 128, 250 126, 300 140 L312 150 L300 160 C250 174, 150 172, 120 150 Z`), d.line(S.ellipse(324, 150, 16, 14)), d.line(`M306 140 L298 160`),
  d.line(`M126 148 L306 146 M126 152 L306 154`, { w: 0.8 }), d.text(214, 142, '밝은 줄', { size: 10, anchor: 'middle', dim: true }),
  d.hatch(`M120 150 C150 128, 250 126, 300 140 L312 150 L300 160 C250 174, 150 172, 120 150 Z`, 1),
  d.line(`M330 142 C350 126, 372 116, 390 110`, { w: 1 }), d.line(`M330 158 C350 170, 372 180, 390 188`, { w: 1 }),
  d.line(S.ellipse(330, 142, 4, 5)), d.line(S.ellipse(330, 158, 4, 5)),
  // 양쪽 뒷다리(위에서 보면 넓적다리가 몸 옆으로 굵게)
  d.line(`M230 132 C200 108, 160 96, 130 98 C128 106, 150 112, 200 126 Z`), d.hatch(`M230 132 C200 108, 160 96, 130 98 C128 106, 150 112, 200 126 Z`, 2),
  d.line(`M130 98 C100 90, 70 96, 50 110`, { w: 1.4 }),
  d.line(`M230 168 C200 192, 160 204, 130 202 C128 194, 150 188, 200 174 Z`), d.hatch(`M230 168 C200 192, 160 204, 130 202 C128 194, 150 188, 200 174 Z`, 2),
  d.line(`M130 202 C100 210, 70 204, 50 190`, { w: 1.4 }),
  d.line(`M270 132 L262 112 L250 106`), d.line(`M270 168 L262 188 L250 194`), d.line(`M300 136 L306 118 L318 112`), d.line(`M300 164 L306 182 L318 188`),
  // 확대: 넓적다리 깃 무늬
  d.magnifier(80, 240, 40, [d.line(`M44 236 C60 222, 100 220, 118 236 C100 252, 60 254, 44 236 Z`), d.line(`M56 236 L62 226 M56 236 L62 246 M70 236 L76 226 M70 236 L76 246 M84 236 L90 226 M84 236 L90 246 M98 236 L104 226 M98 236 L104 246`, { w: 0.8 })].join(''), [180, 112, 9]),
  d.text(136, 262, '넓적다리 확대: 깃 무늬', { size: 11, dim: true }),
  d.label(214, 150, 214, 70, '등에 밝은 줄(머리에서 날개 끝까지)', { size: 12 }), d.label(160, 100, 160, 60, '뒷다리 넓적다리: 굵다', { size: 12 }),
  d.label(380, 112, 392, 86, '더듬이: 몸길이의 반쯤', { anchor: 'end', size: 12 }), d.label(290, 160, 300, 230, '앞날개가 배 끝까지 덮음', { size: 12 }),
  d.ruler(240, 268, 120, 3),
], { seed: 13 });
const insectFn = () => pencilSvg(400, 220, (d) => [
  d.text(14, 22, '날개와 다리가 하는 일', { size: 14 }),
  // 왼쪽: 귀뚜라미 앞날개 두 장 비비기
  d.line(`M40 120 C60 100, 120 96, 150 110 L140 134 C110 128, 70 130, 44 140 Z`), d.line(`M56 112 C80 96, 140 92, 170 104 L160 128 C130 122, 90 124, 60 134 Z`, { w: 1 }),
  d.sketch(`M70 116 L150 108 M72 124 L148 116`), d.arrow(96, 150, 128, 150), d.arrow(128, 164, 96, 164),
  d.text(104, 196, '① 앞날개 두 장을 비빈다 → 소리', { size: 12, anchor: 'middle' }),
  // 오른쪽: 뒷다리 접힘 → 펴짐
  d.line(`M250 150 C262 130, 282 114, 300 112 C296 124, 282 140, 268 152 Z`), d.hatch(`M250 150 C262 130, 282 114, 300 112 C296 124, 282 140, 268 152 Z`, 1), d.line(`M300 112 C292 128, 282 142, 274 156`, { w: 1.3 }),
  d.sketch(`M310 150 C330 134, 352 126, 372 128 C368 138, 352 150, 336 160 Z`), d.sketch(`M372 128 C380 144, 386 160, 390 180`, 1.2),
  d.arrow(306, 140, 340, 128), d.text(320, 196, '② 접힌 뒷다리를 펴서 뛴다', { size: 12, anchor: 'middle' }),
], { seed: 14 });

// ── 잎 ──
const leafStem = (d, x, y0, y1, nodes, r = 5) => [d.line(`M${x - r} ${y0} L${x - r * 0.8} ${y1} M${x + r} ${y0} L${x + r * 0.8} ${y1}`), ...nodes.map((y) => d.line(`M${x - r} ${y} C${x - r * 0.5} ${y - 3}, ${x + r * 0.5} ${y - 3}, ${x + r} ${y}`, { w: 0.9 }))].join('');
const leafAltEntire = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '① 어긋나기 · 타원형 잎', { size: 14 }),
  leafStem(d, 110, 40, 270, [70, 120, 170, 220]),
  ...[[70, 1], [120, -1], [170, 1], [220, -1]].map(([y, s]) => [d.line(`M${110 + s * 5} ${y} C${110 + s * 18} ${y - 4}, ${110 + s * 26} ${y - 6}, ${110 + s * 32} ${y - 10}`, { w: 1 }), d.line(S.leaf(110 + s * 32, y - 10, 22, 54).replace(/C/g, 'C')), d.hatch(S.leaf(110 + s * 32, y - 10, 22, 54), 1)].join('')),
  // 잎 하나 크게
  d.line(S.leaf(290, 250, 60, 180, 0.95), { w: 1.4 }), d.line(S.veins(290, 250, 170, 50, 6), { w: 0.9 }), d.line(`M290 250 L290 276`, { w: 1.6 }),
  d.hatch(`M290 250 C236 205, 245 130, 290 70 C300 110, 300 170, 290 250 Z`, 1),
  d.label(290, 276, 340, 282, '잎자루', { size: 12 }), d.label(290, 160, 350, 150, '주맥(가운데)', { size: 12 }), d.label(318, 190, 356, 212, '곁맥', { size: 12 }),
  d.label(250, 120, 220, 96, '가장자리가 밋밋하다', { anchor: 'end', size: 12 }), d.label(110, 120, 60, 96, '마디: 잎 1장', { anchor: 'end', size: 12 }), d.label(110, 170, 40, 200, '위아래 잎이 번갈아 남', { anchor: 'end', size: 12 }),
  d.ruler(20, 272, 90, 3),
], { seed: 21 });
const leafOppSerrate = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '② 마주나기 · 톱니 잎', { size: 14 }),
  leafStem(d, 110, 40, 270, [80, 140, 200]),
  ...[80, 140, 200].flatMap((y, i) => { const pair = i % 2 ? [[-1, 0.5], [1, 0.5]] : [[-1, 1], [1, 1]]; return pair.map(([s, k]) => { const p = S.serrateLeaf(110 + s * 36, y + 6, 16 * k + 4, 46, 9); return d.line(`M${110 + s * 5} ${y} L${110 + s * 18} ${y - 6}`, { w: 1 }) + d.line(p) + d.hatch(p, 1); }); }),
  d.text(110, 62, '(위 마디는 십자로 어긋남)', { size: 10, anchor: 'middle', dim: true }),
  d.line(S.serrateLeaf(290, 240, 50, 170, 14), { w: 1.4 }), d.line(S.veins(290, 240, 160, 44, 7), { w: 0.9 }), d.line(`M290 240 L290 262`, { w: 1.6 }),
  d.magnifier(350, 80, 34, [d.line(`M318 96 L332 84 L336 92 L350 80 L354 88 L368 76 L372 84 L386 72`, { w: 1.2 })].join(''), [334, 130, 7]),
  d.text(350, 126, '톱니 확대', { size: 11, anchor: 'middle', dim: true }),
  d.label(110, 140, 46, 118, '마디: 잎 2장 마주', { anchor: 'end', size: 12 }), d.label(240, 190, 206, 230, '가장자리 톱니(끝으로 갈수록 작아짐)', { anchor: 'end', size: 11 }), d.label(290, 262, 330, 282, '잎자루: 짧다', { size: 12 }),
  d.ruler(20, 272, 90, 3),
], { seed: 22 });
const leafWhorl = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '③ 돌려나기 · 좁은 잎', { size: 14 }),
  leafStem(d, 110, 40, 270, [80, 140, 200], 3),
  ...[80, 140, 200].flatMap((y) => [[-1, 0], [-1, 1], [1, 0], [1, 1], [-0.4, 2], [0.4, 2]].map(([s, k]) => d.line(S.leaf(110 + s * 3, y, 7, 40 + k * 6).replace(/[\d.]+ [\d.]+/g, (m) => m)))),
  ...[80, 140, 200].flatMap((y) => [[-1, 0], [1, 0]].map(([s]) => d.line(`M${110 + s * 3} ${y} C${110 + s * 30} ${y - 10}, ${110 + s * 52} ${y - 22}, ${110 + s * 60} ${y - 40} C${110 + s * 48} ${y - 30}, ${110 + s * 24} ${y - 14}, ${110 + s * 3} ${y} Z`))),
  // 위에서 본 마디(6장 방사)
  d.magnifier(300, 90, 48, [...Array.from({ length: 6 }, (_, k) => { const a = (k / 6) * Math.PI * 2; return d.line(`M300 90 C${300 + Math.cos(a - 0.25) * 22} ${90 + Math.sin(a - 0.25) * 22}, ${300 + Math.cos(a) * 40} ${90 + Math.sin(a) * 40}, ${300 + Math.cos(a + 0.25) * 22} ${90 + Math.sin(a + 0.25) * 22} Z`); }), d.line(`M300 90 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0`)].join(''), [110, 140, 9]),
  d.text(300, 150, '위에서 본 한 마디: 잎 6장', { size: 11, anchor: 'middle', dim: true }),
  d.line(S.leaf(300, 270, 16, 90), { w: 1.3 }), d.line(`M300 270 L300 182`, { w: 0.9 }), d.hatch(`M300 270 C286 240, 290 205, 300 182 C304 220, 304 250, 300 270 Z`, 1),
  d.label(300 + 8, 230, 346, 236, '잎맥 하나(주맥만)', { size: 12 }), d.label(110, 200, 44, 232, '마디마다 빙 둘러 남', { anchor: 'end', size: 12 }), d.label(113, 100, 150, 46, '줄기: 가늘고 네모짐', { size: 12 }),
  d.ruler(20, 272, 90, 3),
], { seed: 23 });
const leafRosette = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '④ 뭉쳐나기 · 깊게 갈라진 잎', { size: 14 }),
  d.line(`M20 240 L220 240`, { w: 1, dash: '6 4' }), d.text(22, 256, '[지면]', { size: 11 }),
  ...Array.from({ length: 9 }, (_, k) => { const a = Math.PI + (k / 8) * Math.PI, L = 70 + (k % 3) * 18, x2 = 120 + Math.cos(a) * L, y2 = 238 + Math.sin(a) * L * 0.9; const p = `M120 238 C${120 + Math.cos(a) * L * 0.3 + 10} ${238 + Math.sin(a) * L * 0.3}, ${x2 + 12} ${y2 + 4}, ${x2} ${y2} C${x2 - 12} ${y2 + 8}, ${120 + Math.cos(a) * L * 0.4 - 8} ${238 + Math.sin(a) * L * 0.4 + 6}, 120 238 Z`; return d.line(p) + d.hatch(p, 1); }),
  d.line(`M112 238 L128 238 L126 248 L114 248 Z`, { w: 1 }),
  // 잎 하나 크게(갈라짐)
  d.line(`M300 270 L300 90 L314 110 L306 130 L324 150 L310 170 L330 190 L312 210 L326 232 L306 250 L300 270 L294 250 L274 232 L288 210 L270 190 L290 170 L276 150 L294 130 L286 110 Z`, { w: 1.3 }),
  d.line(S.veins(300, 268, 170, 20, 6), { w: 0.9 }), d.hatch(`M300 270 L300 90 L314 110 L306 130 L324 150 L310 170 L330 190 L312 210 L326 232 L306 250 Z`, 1),
  d.label(120, 240, 70, 280, '줄기가 거의 없다(마디 1개)', { size: 12 }), d.label(60, 170, 40, 120, '잎이 땅에서 사방으로', { size: 12 }), d.label(324, 150, 360, 130, '가장자리가 깊게 갈라짐', { size: 11 }), d.label(300, 176, 350, 200, '주맥', { size: 12 }),
  d.ruler(230, 272, 90, 3),
], { seed: 24 });
const leafPalmate = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '⑤ 어긋나기 · 손바닥 모양 잎', { size: 14 }),
  leafStem(d, 100, 40, 270, [90, 170], 6),
  ...[[90, -1], [170, 1]].map(([y, s]) => { const cx = 100 + s * 58, cy = y - 24; const p = `M${cx} ${cy + 26} L${cx - 26} ${cy + 10} L${cx - 20} ${cy - 10} L${cx - 10} ${cy - 24} L${cx} ${cy - 8} L${cx + 10} ${cy - 24} L${cx + 20} ${cy - 10} L${cx + 26} ${cy + 10} Z`; return d.line(`M${100 + s * 6} ${y} C${100 + s * 20} ${y - 6}, ${100 + s * 40} ${y - 2}, ${cx} ${cy + 26}`, { w: 1.1 }) + d.line(p) + d.hatch(p, 1) + d.line(`M${cx} ${cy + 26} L${cx - 20} ${cy - 10} M${cx} ${cy + 26} L${cx - 10} ${cy - 24} M${cx} ${cy + 26} L${cx + 10} ${cy - 24} M${cx} ${cy + 26} L${cx + 20} ${cy - 10}`, { w: 0.7 }); }),
  // 크게
  d.line(`M300 230 L240 200 L246 150 L262 110 L300 70 L338 110 L354 150 L360 200 Z`, { w: 1.4 }), d.line(`M300 230 L240 200 M300 230 L246 150 M300 230 L300 70 M300 230 L354 150 M300 230 L360 200`, { w: 0.9 }), d.line(`M300 230 L300 268`, { w: 1.8 }),
  d.hatch(`M300 230 L240 200 L246 150 L262 110 L300 70 Z`, 1),
  d.label(300, 150, 250, 60, '잎맥이 잎자루 끝에서 부챗살로', { anchor: 'end', size: 11 }), d.label(300, 250, 340, 262, '잎자루: 길다', { size: 12 }), d.label(354, 150, 380, 120, '갈라진 끝 5개', { size: 11 }), d.label(100, 170, 40, 220, '마디마다 1장, 번갈아', { anchor: 'end', size: 11 }),
  d.ruler(20, 272, 90, 3),
], { seed: 25 });
const leafCompound = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '⑥ 어긋나기 · 겹잎(깃 모양)', { size: 14 }),
  leafStem(d, 90, 40, 270, [80, 180], 5),
  ...[[80, 1], [180, -1]].map(([y, s]) => { const x0 = 90 + s * 5, x1 = 90 + s * 150; return d.line(`M${x0} ${y} C${90 + s * 60} ${y - 12}, ${90 + s * 110} ${y - 16}, ${x1} ${y - 20}`, { w: 1.1 }) + Array.from({ length: 5 }, (_, k) => { const t = (k + 1) / 6, px = x0 + (x1 - x0) * t, py = y - 20 * t; return d.line(S.leaf(px, py, 7, 22).replace('M', 'M')) + d.line(S.leaf(px, py, 7, -22)); }).join('') + d.line(S.leaf(x1, y - 20, 7, 22)); }),
  // 작은 잎 하나 크게
  d.line(S.leaf(300, 220, 30, 110), { w: 1.3 }), d.line(S.veins(300, 220, 100, 24, 4), { w: 0.8 }), d.line(`M300 220 L300 232`, { w: 1.2 }),
  d.magnifier(330, 72, 38, [d.line(`M300 90 L364 60`, { w: 1.3 }), d.line(S.leaf(318, 82, 6, 18)), d.line(S.leaf(332, 76, 6, 18)), d.line(S.leaf(346, 70, 6, 18)), d.line(S.leaf(318, 82, 6, -18)), d.line(S.leaf(332, 76, 6, -18))].join(''), [200, 60, 10]),
  d.text(330, 124, '잎줄기 확대: 작은 잎이 짝으로', { size: 10, anchor: 'middle', dim: true }),
  d.label(240, 60, 210, 36, '잎 한 장 = 잎줄기 + 작은 잎 여러 장', { anchor: 'end', size: 11 }), d.label(300, 160, 346, 170, '작은 잎 하나', { size: 12 }), d.label(90, 180, 40, 236, '마디에 잎줄기 1개', { anchor: 'end', size: 11 }),
  d.ruler(20, 272, 90, 3),
], { seed: 26 });

// ── 물에 사는 식물 ──
const waterLily = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '① 위에서 본 모습 / 옆에서 본 모습', { size: 14 }),
  // 위: 둥근 잎 + V자 홈 + 부챗살 잎맥
  d.line(`M110 150 m-60 0 a60 60 0 1 1 120 0 a60 60 0 0 1 -48 56 L110 150 L158 206 a60 60 0 0 1 -108 -56 Z`, { w: 1.4 }),
  d.line(Array.from({ length: 11 }, (_, k) => { const a = -Math.PI * 0.95 + (k / 10) * Math.PI * 1.55; return `M110 150 L${110 + Math.cos(a) * 56} ${150 + Math.sin(a) * 56}`; }).join(' '), { w: 0.8 }),
  d.hatch(`M110 150 m-60 0 a60 60 0 0 1 60 -60 L110 150 Z`, 1),
  // 옆: 수면 위에 뜬 잎, 긴 잎자루, 흙 속 뿌리줄기
  d.waterline(150, 220, 392), d.line(`M232 148 C270 142, 330 142, 370 148 C330 154, 270 154, 232 148 Z`), d.line(`M300 152 C296 180, 290 210, 284 240`, { w: 1.6 }),
  d.line(`M240 250 L392 250`, { w: 1, dash: '5 4' }), d.text(244, 264, '[바닥 흙]', { size: 11 }), d.line(`M264 246 C274 236, 300 236, 310 246 L312 256 C300 262, 276 262, 262 256 Z`), d.hatch(`M264 246 C274 236, 300 236, 310 246 L312 256 C300 262, 276 262, 262 256 Z`, 2),
  d.line(`M270 258 L266 272 M284 260 L284 276 M298 258 L302 272`, { w: 0.9 }),
  // 확대: 잎자루 단면(구멍)
  d.magnifier(340, 210, 34, [d.line(S.ellipse(340, 210, 24, 24)), d.line(`${S.ellipse(340, 210, 5, 5)} ${S.ellipse(326, 200, 4, 4)} ${S.ellipse(354, 200, 4, 4)} ${S.ellipse(326, 221, 4, 4)} ${S.ellipse(354, 221, 4, 4)} ${S.ellipse(340, 192, 3, 3)} ${S.ellipse(340, 228, 3, 3)}`, { w: 0.9 }), d.hatch(`M316 210 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 Z M335 210 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 Z`, 1)].join(''), [292, 196, 6]),
  d.text(340, 254, '잎자루 단면: 구멍 7개', { size: 11, anchor: 'middle', dim: true }),
  d.label(110, 206, 60, 236, 'V자 홈', { anchor: 'end', size: 12 }), d.label(140, 120, 180, 96, '잎맥이 가운데서 부챗살로', { size: 11 }), d.label(296, 184, 262, 176, '잎자루: 길고 휨', { anchor: 'end', size: 11 }), d.label(286, 250, 236, 284, '뿌리줄기(흙 속)', { anchor: 'end', size: 11 }),
  d.ruler(20, 272, 60, 3), d.text(84, 284, '(1칸 = 10 cm)', { size: 9, dim: true }),
], { seed: 31 });
const waterDuck = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '② 위에서 / 옆에서 (8배로 키움)', { size: 14 }),
  ...[[110, 120, 0], [150, 108, 0.8], [136, 146, 2.2], [94, 160, 3.6]].map(([x, y, a]) => { const p = S.ellipse(x, y, 22, 15); return d.line(`<g transform="rotate(${a * 30} ${x} ${y})">`.length ? p : p) + d.line(`M${x - 16} ${y} L${x + 16} ${y} M${x - 10} ${y - 8} L${x + 12} ${y - 6} M${x - 10} ${y + 8} L${x + 12} ${y + 6}`, { w: 0.6 }); }),
  d.text(120, 196, '잎 3~4장이 한 포기', { size: 11, anchor: 'middle', dim: true }),
  d.waterline(120, 220, 392), d.line(`M250 118 C266 110, 290 110, 304 118 C290 124, 266 124, 250 118 Z`), d.line(`M312 116 C326 108, 348 108, 360 116 C348 122, 326 122, 312 116 Z`),
  d.line(`M276 122 L272 200 M282 122 L280 190 M336 120 L338 196`, { w: 0.9 }), d.line(`${S.ellipse(272, 203, 3, 3)} ${S.ellipse(280, 193, 3, 3)} ${S.ellipse(338, 199, 3, 3)}`, { w: 0.8 }),
  d.magnifier(340, 230, 30, [d.line(`M340 200 L339 236`, { w: 1 }), d.line(`M334 236 C334 246, 346 246, 346 236 C346 230, 334 230, 334 236 Z`), d.hatch(`M334 236 C334 246, 346 246, 346 236 C346 230, 334 230, 334 236 Z`, 1)].join(''), [338, 196, 6]),
  d.text(340, 276, '뿌리 끝: 작은 주머니', { size: 10, anchor: 'middle', dim: true }),
  d.label(276, 160, 240, 180, '뿌리: 잎 하나에 한 가닥', { anchor: 'end', size: 11 }), d.label(272, 203, 236, 240, '흙에 닿지 않는다', { anchor: 'end', size: 11 }), d.label(150, 108, 190, 70, '잎맥 3줄이 나란히', { size: 11 }),
  d.ruler(20, 272, 100, 1),
], { seed: 32 });
const waterHya = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '③ 옆에서 본 모습', { size: 14 }),
  d.waterline(190, 8, 392),
  // 부푼 잎자루 5개 + 둥근 잎
  ...[[-2, 110, 60], [-1, 130, 80], [0, 150, 90], [1, 170, 80], [2, 190, 60]].map(([k, x, h]) => { const by = 186 - h * 0.1, top = by - h; return d.line(`M${x - 8} ${by} C${x - 22} ${by - h * 0.3}, ${x - 20} ${by - h * 0.7}, ${x - 4} ${top} L${x + 4} ${top} C${x + 20} ${by - h * 0.7}, ${x + 22} ${by - h * 0.3}, ${x + 8} ${by} Z`) + d.hatch(`M${x - 8} ${by} C${x - 22} ${by - h * 0.3}, ${x - 20} ${by - h * 0.7}, ${x - 4} ${top} L${x} ${top} C${x - 8} ${by - h * 0.6}, ${x - 10} ${by - h * 0.3}, ${x - 2} ${by} Z`, 1) + d.line(`M${x - 4} ${top} C${x - 30} ${top - 10}, ${x - 30} ${top - 44}, ${x} ${top - 46} C${x + 30} ${top - 44}, ${x + 30} ${top - 10}, ${x + 4} ${top} Z`) + d.line(`M${x} ${top} L${x} ${top - 42} M${x} ${top - 20} C${x - 10} ${top - 26}, ${x - 16} ${top - 32}, ${x - 18} ${top - 36} M${x} ${top - 20} C${x + 10} ${top - 26}, ${x + 16} ${top - 32}, ${x + 18} ${top - 36}`, { w: 0.7 }); }),
  // 뿌리(물속에 늘어짐)
  d.line(Array.from({ length: 14 }, (_, k) => `M${118 + k * 5} 192 C${114 + k * 5} ${220 + (k % 3) * 8}, ${122 + k * 5} ${250 + (k % 4) * 6}, ${116 + k * 5} ${272 + (k % 2) * 6}`).join(' '), { w: 0.7 }),
  d.magnifier(330, 90, 40, [d.line(`M300 66 C312 60, 348 60, 360 66 L360 116 C348 122, 312 122, 300 116 Z`), d.line(Array.from({ length: 30 }, (_, k) => S.ellipse(304 + (k % 6) * 10, 70 + Math.floor(k / 6) * 10, 3, 2.5)).join(' '), { w: 0.6 })].join(''), [150, 150, 8]),
  d.text(330, 142, '부푼 잎자루 속: 스펀지처럼 구멍', { size: 10, anchor: 'middle', dim: true }),
  d.label(150, 150, 220, 170, '잎자루가 공처럼 부풂', { size: 11 }), d.label(150, 44, 220, 40, '잎: 둥글고 반들반들', { size: 11 }), d.label(150, 250, 220, 250, '뿌리: 흙에 닿지 않고 물속에', { size: 11 }),
  d.ruler(20, 272, 60, 3), d.text(84, 284, '(1칸 = 10 cm)', { size: 9, dim: true }),
], { seed: 33 });
const waterHyd = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '④ 옆에서 본 모습 (4배로 키움)', { size: 14 }),
  d.waterline(60, 8, 392), d.line(`M8 250 L392 250`, { w: 1, dash: '5 4' }), d.text(12, 264, '[바닥 흙]', { size: 11 }),
  d.line(`M120 250 C122 200, 118 150, 122 90`, { w: 1.4 }),
  ...[100, 125, 150, 175, 200, 225].flatMap((y) => [[-1, 0], [1, 0], [-0.5, 1], [0.5, 1]].map(([s, k]) => d.line(`M${120 + s * 3} ${y} C${120 + s * 14} ${y - 6 - k * 2}, ${120 + s * 24} ${y - 12 - k * 3}, ${120 + s * 30} ${y - 22 - k * 4} C${120 + s * 20} ${y - 18}, ${120 + s * 10} ${y - 8}, ${120 + s * 3} ${y} Z`))),
  d.line(`M112 252 L104 266 M120 252 L122 268 M128 252 L136 264`, { w: 0.9 }),
  d.magnifier(290, 120, 46, [d.line(`M250 150 C262 132, 300 86, 332 96`, { w: 1.3 }), d.line(`M258 142 L264 136 M266 132 L272 126 M276 120 L282 114 M288 108 L294 102 M302 98 L308 94`, { w: 0.9 }), d.line(`M250 150 C270 130, 300 110, 330 102`, { w: 0.7 })].join(''), [150, 150, 8]),
  d.text(290, 176, '잎 가장자리 확대: 아주 작은 톱니', { size: 10, anchor: 'middle', dim: true }),
  d.magnifier(300, 236, 30, [d.line(S.ellipse(300, 236, 5, 5)), ...Array.from({ length: 4 }, (_, k) => { const a = (k / 4) * Math.PI * 2; return d.line(S.leaf(300 + Math.cos(a) * 5, 236 + Math.sin(a) * 5, 5, 22).replace(/M[\d.]+ [\d.]+/, `M${300 + Math.cos(a) * 5} ${236 + Math.sin(a) * 5}`)); })].join(''), [120, 175, 12]),
  d.text(300, 278, '위에서 본 한 마디: 잎 4장', { size: 10, anchor: 'middle', dim: true }),
  d.label(120, 120, 60, 100, '줄기: 가늘고 부드러움', { anchor: 'end', size: 11 }), d.label(150, 128, 200, 60, '잎: 얇고 좁다 (뒤로 젖혀짐)', { size: 11 }), d.label(120, 175, 40, 200, '마디마다 돌려남', { anchor: 'end', size: 11 }),
  d.ruler(20, 282, 60, 3), d.text(86, 290, '(1칸 = 1 cm)', { size: 9, dim: true }),
], { seed: 34 });

// ── 예시 보고서 글 ──

// ── 비슷한 잎 재서 구분하기(중등) ──
// 잎 윤곽(연필 좌표): 잎밑 (cx, by), 잎끝 (cx, by - h), 가장 넓은 자리 m(잎끝 0 ~ 잎밑 1), 톱니 n개(한쪽)
const leafOutline = (cx, by, w, h, m, n = 0, depth = 0.08, dbl = false) => {
  const k = Math.log(0.5) / Math.log(m), r = (t) => Math.sin(Math.PI * Math.min(1, Math.max(0, t)) ** k) ** 0.8 * (w / 2), y = (t) => by - h + t * h, pts = [];
  if (!n) for (let i = 0; i <= 40; i++) pts.push([r(i / 40), y(i / 40)]);
  else { const d = 0.84 / n; pts.push([0, y(0)], [r(0.04), y(0.04)]); for (let i = 0; i < n; i++) { const t = 0.06 + i * d; pts.push([r(t), y(t)]); if (dbl) pts.push([r(t + 0.4 * d) * (1 - depth * 0.4), y(t + 0.4 * d)], [r(t + 0.52 * d) * (1 - depth * 0.1), y(t + 0.52 * d)]); pts.push([r(t + 0.85 * d) * (1 - depth), y(t + 0.85 * d)]); } pts.push([r(0.95), y(0.95)], [0, by]); }
  const R = pts.map(([x, yy]) => `${(cx + x).toFixed(1)} ${yy.toFixed(1)}`), L = pts.slice().reverse().map(([x, yy]) => `${(cx - x).toFixed(1)} ${yy.toFixed(1)}`);
  return `M${R.join(' L')} L${L.join(' L')} Z`;
};
const oval = (cx, cy, rx, ry, deg) => { const a = (deg * Math.PI) / 180, x1 = cx + rx * Math.cos(a), y1 = cy + rx * Math.sin(a), x2 = cx - rx * Math.cos(a), y2 = cy - rx * Math.sin(a); return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${rx} ${ry} ${deg} 1 0 ${x2.toFixed(1)} ${y2.toFixed(1)} A${rx} ${ry} ${deg} 1 0 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`; };
// 재기 선: 양 끝에 짧은 가로 눈금
const dim = (d, x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2, tx = Math.cos(a) * 5, ty = Math.sin(a) * 5; return d.line(`M${x1} ${y1} L${x2} ${y2} M${x1 - tx} ${y1 - ty} L${x1 + tx} ${y1 + ty} M${x2 - tx} ${y2 - ty} L${x2 + tx} ${y2 + ty}`, { w: 0.9, dark: 0.7 }); };
const pinnate = (title, rx, ry, pairs, vals, extra) => pencilSvg(400, 300, (d) => {
  const gap = Math.min(34, 196 / pairs), mid = Math.floor(pairs / 2), top = 262 - (pairs - 1) * gap - gap * 0.7, out = [d.text(14, 22, title, { size: 14 }), d.line(`M200 292 C201 230, 199 160, 200 ${top.toFixed(1)}`, { w: 1.4 })];
  let M = null;
  for (let j = 0; j < pairs; j++) { const y = 262 - j * gap, s = j === mid ? 1 : 0.8 + 0.12 * Math.sin(Math.PI * (j + 1) / (pairs + 1)); for (const side of [-1, 1]) { const cx = 200 + side * (rx * s + 3), cy = y - 5, p = oval(cx, cy, rx * s, ry * s, side * -14); out.push(d.line(p, { w: 1 }), d.sketch(`M${200 + side * 3} ${y - 2} L${(cx + side * rx * s * 0.8).toFixed(1)} ${y - 8}`, 0.6)); if (j === mid && side === 1) M = { cx, cy }; } }
  out.push(d.line(oval(200, top - rx * 0.9, rx * 0.92, ry * 0.92, 90), { w: 1 }));
  // 가운데 작은잎 재기: 그 작은잎을 오른쪽에 크게 옮겨 그리고 거기에 재기 선을 긋는다(작은잎 위에 바로 그으면 옆 작은잎과 겹쳐 어지러웠다)
  const k = rx > 34 ? 1.2 : 1.45, ix = 330, iy = 168, Rx = rx * k, Ry = ry * k;
  out.push(d.line(`M${(M.cx + rx * 0.6).toFixed(1)} ${M.cy.toFixed(1)} L${ix - Rx} ${iy}`, { w: 0.7, dark: 0.5, dash: '3 3' }), d.line(oval(ix, iy, Rx, Ry, 0), { w: 1.1 }), d.hatch(oval(ix, iy, Rx * 0.95, Ry * 0.9, 0), 1), d.sketch(`M${ix - Rx} ${iy} L${ix + Rx} ${iy}`, 0.7));
  out.push(dim(d, ix - Rx, iy + Ry + 10, ix + Rx, iy + Ry + 10), dim(d, ix, iy - Ry, ix, iy + Ry));
  out.push(d.text(ix, iy - Ry - 10, '가운데 작은잎(확대)', { size: 11, anchor: 'middle', dim: true }), d.text(ix, iy + Ry + 26, `길이 ${vals[0]} cm · 폭 ${vals[1]} cm`, { size: 11, anchor: 'middle' }));
  return out.concat(extra(d, top));
}, { seed: 11 });
const lkRobinia = () => pinnate('① 겹잎 한 장(잎2)', 30, 17, 7, ['3.6', '2.1'], (d) => [
  d.label(200, 230, 120, 272, '잎줄기 — 이 전체가 잎 한 장', { anchor: 'end', size: 12 }), d.label(165, 110, 70, 80, '작은잎 15장(끝 1장 포함)', { anchor: 'end', size: 12 }),
  d.label(234, 236, 300, 250, '가장자리 밋밋함', { size: 12 }), d.ruler(250, 276, 95, 5),
]);
const lkWisteria = () => pinnate('② 겹잎 한 장(잎2)', 38, 14, 8, ['5.4', '2.0'], (d, top) => [
  d.label(200, 240, 120, 275, '잎줄기 — 잎 한 장', { anchor: 'end', size: 12 }), d.label(165, 90, 70, 62, '작은잎 17장', { anchor: 'end', size: 12 }),
  d.label(208, top - 30, 300, 40, '작은잎 끝이 뾰족', { size: 12 }), d.ruler(250, 276, 100, 5),
]);
const simpleKey = (title, w, h, m, n, depth, dbl, veins, vals, mag) => pencilSvg(400, 300, (d) => {
  const by = 270, tipY = by - h, wy = tipY + m * h, half = (Math.sin(Math.PI * 0.5) ** 0.8) * w / 2;
  return [
    d.text(14, 22, title, { size: 14 }),
    d.line(leafOutline(190, by, w, h, m, n, depth, dbl), { w: 1.3 }), d.hatch(leafOutline(190, by, w * 0.98, h * 0.98, m), 1),
    d.line(S.veins(190, by, h * 0.94, w * 0.42, veins), { w: 0.7, dark: 0.6 }), d.line(`M190 ${by} L190 ${by + 22}`, { w: 1.3 }),
    dim(d, 190 - half - 26, by, 190 - half - 26, tipY), dim(d, 190 - half, wy, 190 + half, wy), dim(d, 190 + half + 24, by, 190 + half + 24, wy),
    d.text(190 - half - 32, tipY + h * 0.45, `길이 ${vals[0]} cm`, { size: 11, anchor: 'end' }), d.text(190, wy - 8, `최대 폭 ${vals[1]} cm`, { size: 11, anchor: 'middle' }), d.text(190 + half + 30, wy + (by - wy) * 0.55, `잎밑→최대 폭 ${vals[2]} cm`, { size: 11 }),
    d.magnifier(342, 66, 36, d.line(mag, { w: 1.1 }), [190 + half * 0.95, tipY + h * 0.5, 7]), d.text(342, 116, n > 20 ? '겹톱니 확대' : '굵은 톱니 확대', { size: 11, anchor: 'middle', dim: true }),
    d.text(14, 292, vals[3], { size: 10, dim: true }),
  ];
}, { seed: 13 });
const lkCherry = () => simpleKey('③ 잎3 — 잎끝 쪽이 넓다', 132, 230, 0.38, 30, 0.07, true, 8, ['8.8', '5.0', '5.5', '실제의 약 1.0배'], 'M310 96 L322 76 L326 84 L331 80 L336 64 L348 84 L352 78 L357 74 L362 56 L374 76');
const lkZelkova = () => simpleKey('④ 잎3 — 잎밑 쪽이 넓다', 98, 230, 0.6, 14, 0.13, false, 12, ['6.4', '2.7', '2.6', '실제의 약 1.4배'], 'M310 96 L328 62 L334 84 L352 50 L358 74 L376 42');
// 점 그래프: 가로 = 잎 길이, 세로 = 길이÷폭. 길이는 겹치지만 비율은 둘로 갈린다
const lkPlot = () => pencilSvg(400, 300, (d) => {
  const X = (cm) => 60 + (cm - 3) * 31, Y = (r) => 250 - (r - 1.5) * 200;
  const c3 = [[5.6, 1.72], [7.3, 1.8], [8.8, 1.76], [10.2, 1.68], [11.9, 1.78]], c4 = [[3.8, 2.28], [5.1, 2.2], [6.4, 2.35], [7.6, 2.25], [8.9, 2.31]];
  return [
    d.text(14, 22, '③·④ 잎 10장: 길이와 길이÷폭', { size: 14 }),
    d.hatch(`M${X(5.6)} 40 L${X(8.9)} 40 L${X(8.9)} 250 L${X(5.6)} 250 Z`, 1), d.text((X(5.6) + X(8.9)) / 2, 52, '길이는 겹친다', { size: 11, anchor: 'middle' }),
    d.line(`M60 250 L385 250 M60 250 L60 34`, { w: 1.2 }), d.line(`M60 ${Y(2)} L385 ${Y(2)}`, { w: 0.9, dash: '6 4' }), d.text(384, Y(2) - 6, '경계 2.0', { size: 11, anchor: 'end' }),
    ...[4, 6, 8, 10, 12].map((v) => d.text(X(v), 266, String(v), { size: 10, anchor: 'middle' })), ...[1.5, 2, 2.5].map((v) => d.text(52, Y(v) + 4, String(v), { size: 10, anchor: 'end' })),
    d.text(222, 288, '잎 길이(cm)', { size: 11, anchor: 'middle' }), d.text(14, 40, '길이÷폭', { size: 11 }),
    ...c3.map(([l, r]) => d.line(S.ellipse(X(l), Y(r), 5, 5), { w: 1.1 })),
    ...c4.map(([l, r]) => d.line(`M${X(l)} ${Y(r) - 6} L${X(l) + 6} ${Y(r) + 5} L${X(l) - 6} ${Y(r) + 5} Z`, { w: 1.1 })),
    d.label(X(10.2), Y(1.68), 300, 178, '○ ③ 1.68~1.80', { size: 11 }), d.label(X(8.9), Y(2.31), 300, 90, '△ ④ 2.20~2.35', { size: 11 }),
  ];
}, { seed: 14 });

// ── 강낭콩 자람(초등) ──
const vruler = (d, x, y0, cm, px) => [d.line(`M${x} ${y0} L${x} ${y0 - cm * px}` + Array.from({ length: cm + 1 }, (_, i) => ` M${x} ${y0 - i * px} L${x + (i % 5 ? 4 : 8)} ${y0 - i * px}`).join(''), { w: 0.9 }), ...Array.from({ length: Math.floor(cm / 5) + 1 }, (_, i) => d.text(x + 11, y0 - i * 5 * px + 4, String(i * 5), { size: 9 }))];
const bean = (title, H, leaves, opt) => pencilSvg(400, 300, (d) => {
  const px = 6.4, sy = 236, tx = 196 + (opt.lean || 0), ty = sy - H * px, out = [d.text(14, 22, title, { size: 14 })];
  out.push(d.line(`M130 ${sy} L262 ${sy} L250 292 L142 292 Z`, { w: 1.3 }), d.hatch(`M134 ${sy + 2} L258 ${sy + 2} L248 290 L144 290 Z`, 2), d.line(`M196 ${sy} C196 ${sy - H * px * 0.4}, ${tx - (opt.lean || 0) * 0.3} ${sy - H * px * 0.75}, ${tx} ${ty}`, { w: opt.thin ? 0.9 : 1.6 }));
  out.push(d.line(oval(186, sy - 32, 9, 4, 20), { w: 0.9 }), d.line(oval(206, sy - 32, 9, 4, -20), { w: 0.9 }));
  const n = Math.max(0, leaves - 1);
  for (let k = 0; k < n; k++) { const t = (k + 1) / (n + 0.6), yy = sy - 40 - t * (H * px - 40), xx = 196 + (opt.lean || 0) * t * t, side = k % 2 ? -1 : 1, s = (opt.small ? 0.7 : 1) * (0.75 + 0.25 * Math.min(1, (n - k) / 2)), dr = opt.droop ? 28 : -12;
    const lx = xx + side * 30 * s, ly = yy + (opt.droop ? 10 : -4); out.push(d.line(`M${xx} ${yy} L${lx} ${ly}`, { w: 0.8 }));
    for (const a of [-1, 0, 1]) { const cx = lx + side * (a === 0 ? 18 : 10) * s, cy = ly + a * 13 * s + (opt.droop ? 6 : 0); out.push(d.line(oval(cx, cy, 15 * s, 8 * s, side * (a * 30) + (side > 0 ? dr : 180 - dr)), { w: 0.9 })); if (!opt.pale) out.push(d.hatch(oval(cx, cy, 13 * s, 6 * s, side * (a * 30) + (side > 0 ? dr : 180 - dr)), 1)); } }
  out.push(...vruler(d, 92, sy, 30, px), d.line(`M92 ${ty} L${tx - 6} ${ty}`, { w: 0.7, dash: '3 3' }), d.text(86, ty + 4, `키 ${H} cm`, { size: 11, anchor: 'end' }));
  return out.concat(opt.labels(d, tx, ty, sy));
}, { seed: 21 });
const beanSun = () => bean('① 21일 · 창가 · 물 매일', 21, 5, { lean: 18, labels: (d, tx, ty) => [d.label(tx, ty + 4, 300, 40, '줄기 끝이 창문 쪽으로', { size: 12 }), d.label(206, 204, 300, 230, '떡잎: 작고 누레짐', { size: 12 }), d.label(230, 150, 320, 150, '세겹잎', { size: 12 })] });
const beanShade = () => bean('② 21일 · 그늘 · 물 매일', 27, 3, { thin: true, small: true, pale: true, labels: (d, tx, ty) => [d.label(tx, ty + 30, 300, 40, '줄기가 가늘고 길다', { size: 12 }), d.label(222, 160, 320, 170, '잎이 작고 연함(빗금 없음)', { size: 12 }), d.label(206, 204, 300, 230, '떡잎 쭈글쭈글', { size: 12 })] });
const beanDry = () => bean('③ 21일 · 창가 · 물 사흘에 한 번', 14, 3, { lean: 10, droop: true, small: true, labels: (d, tx, ty) => [d.label(tx, ty + 2, 300, 50, '키가 작다', { size: 12 }), d.label(226, 186, 320, 150, '잎이 아래로 처짐', { size: 12 }), d.label(206, 204, 300, 230, '떡잎 누레짐', { size: 12 })] });

// ── 곰팡이 관찰일기(초등) ──
const fuzz = (d, cx, cy, r, seed = 1) => { let s = seed; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; let p = ''; for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2, rr = r * (0.88 + rnd() * 0.2); p += `${i ? ' L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr * 0.9).toFixed(1)}`; } return d.line(p + ' Z', { w: 0.8, dark: 0.7 }); };
const dots = (d, cx, cy, r, n, seed = 3) => { let s = seed, p = ''; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; for (let i = 0; i < n; i++) { const a = rnd() * 6.283, rr = Math.sqrt(rnd()) * r; p += S.ellipse(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.9, 1.6, 1.6) + ' '; } return d.tone(p, 0.85); };
const moldBread = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '① 식빵 6일 · 위에서 본 모습', { size: 14 }),
  d.line('M40 60 L250 60 L250 270 L40 270 Z', { w: 1.4 }), d.line('M48 68 L242 68 L242 262 L48 262 Z', { w: 0.8, dark: 0.5 }),
  fuzz(d, 104, 117, 50, 2), fuzz(d, 186, 196, 40, 5), fuzz(d, 172, 104, 26, 7), dots(d, 104, 117, 42, 40, 3), dots(d, 186, 196, 32, 24, 9),
  d.label(150, 117, 300, 160, '흰 솜털이 동그랗게', { size: 12 }), d.label(110, 120, 300, 190, '까만 점(가운데에 많음)', { size: 12 }), d.label(250, 268, 300, 252, '빵 가장자리(10 cm)', { size: 12 }),
  d.magnifier(330, 74, 44, [d.line('M296 104 L298 70 M314 108 L313 60 M332 110 L334 72 M350 108 L349 64', { w: 0.8 }), d.tone(S.ellipse(298, 66, 6, 6) + S.ellipse(313, 56, 6, 6) + S.ellipse(334, 68, 6, 6) + S.ellipse(349, 60, 6, 6), 0.85), d.sketch('M288 110 C310 104, 340 112, 372 106', 0.8)].join(''), [104, 117, 8]),
  d.text(330, 132, '돋보기: 솜털 끝에 까만 공', { size: 11, anchor: 'middle', dim: true }), d.ruler(40, 276, 105, 5),
], { seed: 31 });
const moldOrange = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '② 귤 6일 · 옆에서 본 모습', { size: 14 }),
  d.line(S.ellipse(150, 170, 100, 88), { w: 1.4 }), d.line('M150 82 L152 74', { w: 1.2 }),
  fuzz(d, 120, 140, 52, 4), d.hatch(S.ellipse(120, 140, 36, 30), 2), fuzz(d, 205, 200, 30, 8), d.hatch(S.ellipse(205, 200, 18, 15), 2),
  d.label(120, 140, 290, 60, '가운데: 청록 가루(진한 빗금)', { size: 12 }), d.label(160, 112, 290, 100, '테두리: 흰 솜털', { size: 12 }), d.label(220, 220, 300, 264, '껍질이 물러짐', { size: 12 }),
  d.magnifier(330, 178, 44, [d.line('M330 220 L330 186 M330 186 L316 170 M330 186 L330 166 M330 186 L344 170', { w: 0.8 }), d.line(S.ellipse(316, 164, 3, 3) + S.ellipse(316, 156, 3, 3) + S.ellipse(316, 148, 3, 3) + S.ellipse(330, 160, 3, 3) + S.ellipse(330, 152, 3, 3) + S.ellipse(330, 144, 3, 3) + S.ellipse(344, 164, 3, 3) + S.ellipse(344, 156, 3, 3) + S.ellipse(344, 148, 3, 3), { w: 0.7 })].join(''), [120, 140, 8]),
  d.text(330, 238, '현미경: 붓 모양 포자 사슬', { size: 11, anchor: 'middle', dim: true }), d.ruler(40, 276, 103, 6),
], { seed: 32 });
const moldRice = () => pencilSvg(400, 300, (d) => [
  d.text(14, 22, '③ 밥 6일 · 옆에서 본 모습', { size: 14 }),
  d.line('M40 236 C40 150, 260 150, 260 236 Z', { w: 1.3 }), d.line('M28 236 L272 236 L258 252 L42 252 Z', { w: 1.2 }),
  ...[[80, 214], [110, 196], [150, 186], [190, 196], [222, 214], [96, 228], [140, 222], [184, 224], [130, 204], [170, 206]].map(([x, y]) => d.sketch(oval(x, y, 7, 3, 20), 0.7)),
  fuzz(d, 120, 196, 40, 6), d.hatch(S.ellipse(120, 196, 24, 18), 1), fuzz(d, 196, 206, 30, 9), d.hatch(S.ellipse(196, 206, 16, 12), 1),
  d.label(120, 196, 290, 158, '가운데: 노란 연두 가루', { size: 12 }), d.label(152, 178, 290, 184, '테두리: 흰 솜털', { size: 12 }), d.label(90, 228, 300, 270, '밥알이 물러짐', { size: 12 }),
  d.magnifier(330, 72, 44, [d.line('M330 116 L330 82', { w: 0.9 }), d.line(S.ellipse(330, 74, 9, 9), { w: 0.9 }), d.line(Array.from({ length: 7 }, (_, i) => { const a = Math.PI * (1.05 + i / 6 * 0.9); return `M${(330 + Math.cos(a) * 10).toFixed(1)} ${(74 + Math.sin(a) * 10).toFixed(1)} L${(330 + Math.cos(a) * 30).toFixed(1)} ${(74 + Math.sin(a) * 30).toFixed(1)}`; }).join(' '), { w: 0.7, dash: '2 3' })].join(''), [120, 196, 8]),
  d.text(330, 130, '현미경: 둥근 머리 + 포자 사슬', { size: 11, anchor: 'middle', dim: true }), d.ruler(40, 276, 100, 5),
], { seed: 33 });

export const SAMPLES = {
  'observe-insects': {
    who: { name: '김예시', grade: '4학년 2반', date: '2026-05-16' },
    target: '장소 A: 학교 뒤뜰 큰 나무 아래 — 햇빛이 거의 안 들고, 마른 갈색 풀이 많음\n장소 B: 운동장 옆 풀밭 — 햇빛이 잘 들고, 짧은 연두색 풀\n대상: 메뚜기 무리 곤충 ①②③ (이름을 몰라 번호로 씀)',
    table: [['①', '갈색, 더듬이가 몸보다 긺', '1', '0'], ['②', '연두색, 몸이 길고 머리가 뾰족', '0', '2'], ['③', '연두·갈색, 등에 밝은 줄', '0', '1']],
    obs: [
      { label: '①', draw: cricket, text: '[본 것] 몸은 갈색이고 납작하다. 더듬이가 몸보다 길다(몸 2.2 cm, 더듬이 약 3 cm). 앞날개 두 장이 등 위에 포개져 있고 배를 반쯤 덮는다. 뒷다리 넓적다리가 굵고 종아리에 가시가 있다. 꼬리 끝에 털 같은 것이 2개 있다.\n[확인한 것] 접시에서 뒤로 뛰었다. 뒤집어 보니 배 쪽은 색이 연했다.\n[추정] 갈색 몸은 장소 A의 마른 풀 색과 비슷해서 숨기 좋을 것으로 추정된다.' },
      { label: '②', draw: longhead, text: '[본 것] 몸이 길고 가늘며 연두색이다(약 7 cm). 머리가 앞으로 뾰족하다. 더듬이는 짧고 납작하다. 뒷다리가 몸길이만큼 길다. 날개 두 장은 포개지지 않고 나란히 놓여 배를 다 덮는다.\n[확인한 것] 뒷다리를 손으로 살짝 펴니 몸보다 길게 펴졌다. 비벼도 소리는 안 났다.\n[추정] 연두색 몸과 긴 다리는 장소 B의 긴 풀 사이에 숨고 멀리 뛰는 데 좋을 것으로 추정된다.' },
      { label: '③', draw: stripe, text: '[본 것] 몸은 연두색과 갈색이 섞였고, 등에 밝은 줄이 머리에서 날개 끝까지 이어진다(몸 3 cm). 더듬이는 몸길이의 반쯤이다. 뒷다리 넓적다리가 굵고 깃 무늬가 있다. 앞날개가 배 끝까지 덮는다.\n[확인한 것] 날개를 펴니 뒷날개가 부채처럼 펴졌다. 뒷다리를 날개에 비비니 작게 거친 소리가 났다.\n[추정] 밝은 줄은 풀 줄기 사이에서 몸 윤곽을 흐리게 할 것으로 추정된다.' },
    ],
    env: '[눈으로 봤을 때] A: 큰 나무가 하늘을 가려 어둡고, 풀이 갈색이며 성글다. 떨어진 잎이 많다. B: 하늘이 트여 밝고, 풀이 연두색이며 짧고 빽빽하다.\n[햇빛] 방법: 같은 흰 종이를 땅에 놓고 밝기를 봄. A는 종이가 회색빛으로 어두웠고, B는 눈이 부실 만큼 밝았다.\n[바람] 방법: 풀 끝이 흔들리는지 10초 봄. 두 곳 다 거의 흔들리지 않았다 → 바람은 거의 없음.\n[흙의 물기] 방법: 흙을 3초 쥐었다 폄. A는 손에 흙이 많이 남고 뭉쳤다 → 물기가 많다. B는 조금 남고 바슬바슬했다 → 물기가 적다. 아마 햇빛이 안 들어 물이 덜 마르기 때문인 것 같다.',
    tree: { items: ['①', '②', '③'], q: '더듬이가 몸보다 긴가?', yes: { items: ['①'] }, no: { items: ['②', '③'], q: '머리가 앞으로 뾰족한가?', yes: { items: ['②'] }, no: { items: ['③'] } } },
    classify: '기준 1은 더듬이 길이로 정했다. 눈으로 바로 비교할 수 있고, 누가 봐도 같게 나뉘기 때문이다. 기준 2는 머리 모양이다. 몸 색은 같은 곤충도 조금씩 달라서 기준으로 쓰지 않았다.',
    venn: { la: '① 귀뚜라미형', lb: '② 방아깨비형', a: '더듬이가 몸보다 길다 · 갈색 · 앞날개가 포개져 있다 · 꼬리털이 있다 · 그늘(A)에 있었다', both: '다리 6개, 몸이 머리·가슴·배로 나뉜다 · 뒷다리가 굵고 길어 뛴다 · 날개가 있다', b: '더듬이가 짧고 납작하다 · 연두색 · 날개가 나란히 놓인다 · 머리가 뾰족하다 · 양지(B)에 있었다' },
    adaptDraw: insectFn,
    adapt: '[날개] ①은 앞날개 두 장을 비벼 소리를 냈다(날개 확대 그림의 타원 무늬가 비비는 자리로 추정된다). ③은 뒷날개가 부채처럼 펴져 날 수 있을 것 같다. ②는 날개가 길어 날 때 쓰는 것으로 추정된다.\n[다리] 세 곤충 모두 뒷다리 넓적다리가 굵다. 뒷다리를 접었다 펴서 뛰는 데 쓰는 것으로 추정된다. ②는 다리가 가장 길어 가장 멀리 뛸 것 같다.\n[살아가는 데 유리한 점] ①의 갈색 몸은 그늘의 마른 풀 색과, ②③의 연두색 몸은 양지의 풀 색과 비슷하다. 사는 곳 색과 비슷하면 새에게 덜 들킬 것으로 추정된다.',
    next: '① 귀뚜라미형을 밝은 곳에 두면 그늘로 돌아갈까? (같은 통에 밝은 쪽·어두운 쪽을 만들어 10분 뒤 어디 있는지 세어 본다)\n② 뒷다리 길이와 뛰는 거리는 관계가 있을까? (세 곤충을 같은 자리에서 뛰게 해 자로 잰다)',
  },
  'observe-leaves': {
    who: { name: '이예시', grade: '5학년 1반', date: '2026-06-03' },
    target: '장소: 학교 화단과 뒤뜰 (맑음, 오전 10시)\n대상: 여섯 식물의 잎 ①~⑥ (이름은 몰라서 번호로 씀)',
    table: [['①', '1장', '어긋나기', '타원형, 밋밋함', '4.8'], ['②', '2장', '마주나기', '달걀형, 톱니', '5.2'], ['③', '6장', '돌려나기', '좁고 긺, 밋밋함', '5.0'], ['④', '11장', '뭉쳐나기', '깊게 갈라짐', '0.5'], ['⑤', '1장', '어긋나기', '손바닥 모양, 5갈래', '6.8'], ['⑥', '1장(작은 잎 11)', '어긋나기', '겹잎, 작은 잎 타원형', '6.2']],
    obs: [
      { label: '①', draw: leafAltEntire, text: '[본 것] 한 마디에 잎이 1장씩 붙고, 위 마디의 잎은 반대쪽에 난다(어긋나기). 잎은 타원형이고 가장자리가 밋밋하다. 주맥에서 곁맥이 6쌍쯤 나온다. 앞면은 진한 초록으로 반들거리고 뒷면은 연한 초록이다.\n[잰 것] 마디 사이 4.8 cm(5번 재어 평균), 잎 길이 11 cm.\n[확인한 것] 잎을 만지면 앞면이 매끈하고 뒷면 잎맥이 손에 걸린다.\n[추정] 위아래 잎이 번갈아 나서 위에서 보면 서로 가리지 않는다. 햇빛을 골고루 받으려는 것으로 추정된다.' },
      { label: '②', draw: leafOppSerrate, text: '[본 것] 한 마디에 잎 2장이 마주 나고, 바로 위 마디의 2장은 십자로 어긋나 있다. 가장자리에 톱니가 있는데 잎끝으로 갈수록 톱니가 작아진다. 잎자루가 짧다.\n[잰 것] 마디 사이 5.2 cm, 잎 길이 6 cm, 톱니는 한쪽에 14개.\n[확인한 것] 톱니를 손끝으로 쓸면 거칠게 걸린다. 톱니 하나하나에 곁맥 끝이 닿아 있다.\n[추정] 톱니 끝에 잎맥이 닿아 있어 잎에 맺힌 물이 그리로 빠지는 것으로 추정된다.' },
      { label: '③', draw: leafWhorl, text: '[본 것] 한 마디에 좁고 긴 잎 6장이 빙 둘러 난다(돌려나기). 잎맥은 가운데 주맥 하나만 보인다. 줄기는 가늘고 만지면 네모진 느낌이다.\n[잰 것] 마디 사이 5.0 cm, 잎 길이 3 cm, 잎 폭 0.4 cm.\n[추정] 잎이 좁고 여러 장이라 바람에 덜 찢어지고, 위아래 마디가 조금씩 돌아 있어 서로 덜 가릴 것으로 추정된다.' },
      { label: '④', draw: leafRosette, text: '[본 것] 줄기가 거의 없고 잎 11장이 땅에서 사방으로 펼쳐진다(뭉쳐나기). 잎 가장자리가 깊게 갈라져 톱니처럼 뾰족하다. 잎 뒷면에 털이 조금 있다.\n[잰 것] 마디는 1개로 보이고 마디 사이는 0.5 cm도 안 된다. 가장 긴 잎 12 cm.\n[추정] 땅에 붙어 펼쳐지면 밟혀도 덜 꺾이고 바람도 덜 받을 것으로 추정된다. 대신 서로 조금씩 겹친다.' },
      { label: '⑤', draw: leafPalmate, text: '[본 것] 한 마디에 큰 잎 1장씩 어긋나기. 잎은 손바닥처럼 5갈래로 갈라지고, 잎맥 5개가 잎자루 끝 한 점에서 부챗살로 나간다. 잎자루가 길다(7 cm).\n[잰 것] 마디 사이 6.8 cm, 잎 폭 14 cm.\n[확인한 것] 잎자루를 잡고 흔드니 잎이 크게 펄럭였다. 큰 잎 한 장이 햇빛은 많이 받지만 바람은 많이 받을 것으로 추정된다.' },
      { label: '⑥', draw: leafCompound, text: '[본 것] 한 마디에 잎줄기 1개가 어긋나기로 붙고, 잎줄기 양쪽에 작은 잎이 5쌍 + 끝에 1장(모두 11장) 달린다. 작은 잎은 타원형이고 밋밋하다.\n[확인한 것] 떨어진 잎을 보니 작은 잎이 아니라 잎줄기째 떨어져 있었다 → 잎 한 장은 잎줄기 전체다(겹잎).\n[잰 것] 마디 사이 6.2 cm, 잎줄기 길이 14 cm, 작은 잎 3 cm.\n[추정] 작은 잎 사이 틈으로 바람이 빠져 덜 찢어질 것으로 추정된다.' },
    ],
    tree: { items: ['①', '②', '③', '④', '⑤', '⑥'], q: '한 마디에 잎이 1장인가?', yes: { items: ['①', '⑤', '⑥'], q: '잎이 작은 잎 여러 장으로 되어 있는가?', yes: { items: ['⑥'] }, no: { items: ['①', '⑤'], q: '잎이 손바닥처럼 갈라졌는가?', yes: { items: ['⑤'] }, no: { items: ['①'] } } }, no: { items: ['②', '③', '④'], q: '한 마디에 잎이 2장인가?', yes: { items: ['②'] }, no: { items: ['③', '④'], q: '줄기가 길게 보이는가?', yes: { items: ['③'] }, no: { items: ['④'] } } } },
    classify: '기준 1은 「한 마디에 잎이 1장인가」로 정했다. 마디를 세기만 하면 누가 해도 같게 나뉘기 때문이다. 잎 색이나 크기는 같은 나무에서도 달라서 기준으로 쓰지 않았다. 끝까지 하나씩 남을 때까지 4개 기준을 썼다.',
    venn: { la: '① 전형적인 잎', lb: '⑥ 겹잎', a: '잎몸이 한 장으로 이어짐 · 잎자루가 바로 줄기에 붙음 · 곁맥이 주맥에서 나옴', both: '잎자루·잎몸·잎맥이 있다 · 어긋나기 · 초록색이고 앞뒤 색이 다르다', b: '작은 잎 11장이 잎줄기에 붙음 · 떨어질 때 잎줄기째 떨어짐 · 작은 잎마다 주맥이 따로 있음' },
    adapt: '[잎차례] 어긋나기(①⑤⑥)·마주나기(②)·돌려나기(③)는 방법은 달라도 위에서 보면 잎이 서로 거의 가리지 않았다. 햇빛을 골고루 받는 데 유리할 것으로 추정된다. 뭉쳐나기(④)는 조금 겹치지만 밟히거나 바람이 불어도 덜 상한다.\n[잎 모양] 넓은 잎(⑤)은 햇빛을 많이 받지만 바람에 펄럭였고, 좁은 잎(③)과 겹잎(⑥)은 바람이 빠져나가 덜 흔들렸다. 톱니(②)는 톱니 끝마다 곁맥이 닿아 있어 물이 빠지는 자리로 추정된다.',
    next: '잎차례가 다른 두 식물을 같은 화분에 두고 한 달 뒤 잎이 얼마나 자랐는지 비교해 보고 싶다. 바꿀 것은 잎차례(식물 종류), 잴 것은 잎 수와 길이, 같게 할 것은 물·햇빛·흙이다.',
  },
  'observe-water': {
    who: { name: '박예시', grade: '중1', date: '2026-06-20' },
    target: '장소: 학교 생태 연못 B 구역 (맑음, 오후 2시, 수온 22℃)\n대상: 물에 사는 식물 4종 — ① 둥근 잎이 뜬 것 ② 작은 잎이 떠다니는 것 ③ 잎자루가 부푼 것 ④ 물속에 잠긴 것',
    table: [['① 잎 지름', '18', '20', '17'], ['③ 잎자루 굵기(cm)', '2.1', '2.4', '2.2'], ['④ 마디 사이(cm)', '1.1', '1.3', '1.2']],
    obs: [
      { label: '①', draw: waterLily, text: '[관찰한 사실] 잎은 둥글고 한쪽이 V자로 갈라져 있으며 갈라진 곳에서 잎자루가 나온다. 잎맥은 가운데에서 부챗살처럼 뻗는다. 앞면은 반들거리고 뒷면은 자줏빛이다. 잎자루는 길고 물속으로 휘어 내려가 흙 속 뿌리줄기에 닿는다.\n[확인한 것] 물을 뿌리니 방울이 굴러 떨어졌다. 잎자루를 잘라 보니 단면에 구멍이 7개 있었다. 잎을 눌렀다 놓으면 바로 떠올랐다.\n[추정] 잎자루 속 구멍은 공기가 드나드는 통로로, 잎이 뜨고 물속 뿌리줄기로 공기를 보내는 데 쓰이는 것으로 추정된다.' },
      { label: '②', draw: waterDuck, text: '[관찰한 사실] 잎 3~4장이 한 포기로 붙어 물 위에 떠 있고, 잎마다 뿌리가 한 가닥씩 물속으로 늘어진다. 뿌리는 흙에 닿지 않는다. 잎맥 3줄이 나란하다. 아주 작아 8배로 키워 그렸다.\n[확인한 것] 물속으로 눌렀다 놓으니 1초 안에 떠올랐다. 뿌리 끝에 작은 주머니가 있었다.\n[추정] 뿌리가 흙에 안 닿으니 바람과 물살에 떠다니며 퍼질 것으로 추정된다.' },
      { label: '③', draw: waterHya, text: '[관찰한 사실] 잎자루가 공처럼 부풀어 있고(굵기 평균 2.2 cm) 그 위에 둥글고 반들거리는 잎이 달린다. 뿌리는 검보라색 실 같은 것이 여러 가닥 물속에 늘어지고 흙에 닿지 않는다.\n[확인한 것] 부푼 잎자루를 누르니 스펀지처럼 들어갔다 나왔다. 잘라 보니 속이 작은 구멍투성이였다. 포기째 눌렀다 놓으면 바로 떠올랐다.\n[추정] 구멍 속 공기 덕에 떠 있고, 늘어진 뿌리는 뒤집히지 않게 균형을 잡는 것으로 추정된다.' },
      { label: '④', draw: waterHyd, text: '[관찰한 사실] 줄기가 가늘고 물속에 잠겨 있다. 마디마다 좁고 얇은 잎 4장이 돌려나고 뒤로 젖혀진다. 잎 가장자리에 아주 작은 톱니가 있다(확대). 마디 사이 평균 1.2 cm.\n[확인한 것] 물 밖으로 꺼내니 줄기가 서지 못하고 늘어졌다. 물살을 일으키니 줄기가 꺾이지 않고 휘었다.\n[추정] 물이 몸을 받쳐 주니 줄기가 단단할 필요가 없고, 얇은 잎은 물속에서 공기와 빛을 바로 받는 데 유리할 것으로 추정된다.' },
    ],
    tree: { items: ['①', '②', '③', '④'], q: '잎이 물 위에 있는가?', yes: { items: ['①', '②', '③'], q: '뿌리가 흙에 닿는가?', yes: { items: ['①'] }, no: { items: ['②', '③'], q: '잎자루가 부풀어 있는가?', yes: { items: ['③'] }, no: { items: ['②'] } } }, no: { items: ['④'] } },
    classify: '기준 1은 「잎이 물 위에 있는가」로, 관찰만으로 확실히 나뉜다. 다른 기준으로 「뿌리가 흙에 닿는가」를 먼저 쓰면 ①만 따로 떨어지고 ②③④가 한 무리가 되어 결과가 달라진다. 이렇게 기준에 따라 무리가 달라진다는 것을 알았다.',
    venn: { la: '① 둥근 잎이 뜬 것', lb: '③ 잎자루가 부푼 것', a: '뿌리줄기가 흙 속에 있다 · 잎자루가 길고 속에 구멍 7개 · 잎 뒷면이 자줏빛 · V자 홈', both: '잎이 둥글고 반들거려 물이 굴러 떨어진다 · 잎이 물 위에 떠 있다 · 속에 공기가 드나드는 빈 곳이 있다', b: '뿌리가 흙에 안 닿고 물속에 늘어짐 · 잎자루가 공처럼 부풀어 스펀지 같다 · 포기째 떠다닌다' },
    adapt: '[①] 잎자루 속 구멍(통기 조직)이 공기를 흙 속 뿌리줄기까지 보내, 공기가 적은 진흙에서도 썩지 않고 살 수 있을 것으로 추정된다. 반들거리는 잎 표면은 비가 와도 잎이 물에 잠기지 않게 한다.\n[③] 부푼 잎자루의 스펀지 구조가 부력을 만들어 뿌리 없이도 떠 있고, 물이 불어도 함께 떠올라 잠기지 않을 것으로 추정된다. 늘어진 뿌리는 바람에 뒤집히는 것을 막는 균형추로 보인다.\n[근거] ①③ 모두 「눌렀다 놓으면 바로 떠오름」「단면에 구멍」을 직접 확인했다.',
    next: '③의 부푼 잎자루를 잘라 내면 포기가 가라앉을까? 잎자루 수를 5개·3개·1개로 바꾸고(바꿀 것) 떠 있는 높이를 잰다(잴 것). 같은 크기의 포기를 쓰고 같은 물을 쓴다(같게 할 것).',
  },
  'observe-leafkey': {
    who: { name: '최예시', grade: '중2', date: '2026-05-28' },
    target: '장소: 학교 뒤뜰과 화단에서 주운 잎 (맑음, 오전 10시)\n대상: 비슷해 보이는 잎 4종 ①~④ (이름은 몰라서 번호로 씀) — ①② 작은잎 여러 장이 달린 잎 각 3장, ③④ 톱니 있는 홑잎 각 5장',
    tableAfter: 0,
    titles: { table: '측정 기록(잎마다)', tableAsk: '잎1~잎5는 같은 종의 다른 잎. 평균 열은 저절로 계산됐다.', classify: '검색표(분류 나무)', classifyAsk: '숫자 경계가 들어간 기준으로 둘씩 나눴다.', venn: '닮은 두 종(③·④) 비교' },
    table: [['① 작은잎 수', '13', '15', '11', '', ''], ['① 작은잎 길이÷폭', '1.68', '1.75', '1.62', '', ''], ['② 작은잎 수', '15', '17', '13', '', ''], ['② 작은잎 길이÷폭', '2.60', '2.75', '2.50', '', ''], ['③ 길이(cm)', '5.6', '7.3', '8.8', '10.2', '11.9'], ['③ 길이÷폭', '1.72', '1.80', '1.76', '1.68', '1.78'], ['③ 톱니(한쪽)', '32', '38', '32', '38', '32'], ['④ 길이(cm)', '3.8', '5.1', '6.4', '7.6', '8.9'], ['④ 길이÷폭', '2.28', '2.20', '2.35', '2.25', '2.31'], ['④ 톱니(한쪽)', '12', '15', '12', '15', '12']],
    obs: [
      { label: '①', draw: lkRobinia, text: '[관찰한 사실] 잎줄기 하나에 작은잎이 마주 7쌍 + 끝 1장(15장) 달려 있다. 작은잎은 둥근 타원형이고 가장자리가 밋밋하다. 잎줄기째 떨어져 있었다.\n[잰 것] 가운데 작은잎 길이 3.6 cm, 최대 폭 2.1 cm → 길이÷폭 1.75. 잎 3장의 작은잎 수 13·15·11장.\n[추정] 작은잎 수는 잎마다 2장씩 달라 ②와 겹칠 수 있다. 구분에는 작은잎 길이÷폭이 더 믿을 만할 것으로 추정된다.' },
      { label: '②', draw: lkWisteria, text: '[관찰한 사실] ①처럼 잎줄기 하나에 작은잎이 마주 달린 겹잎이다(17장). 작은잎은 ①보다 길쭉하고 끝이 뾰족하며, 가장 넓은 곳이 가운데보다 잎밑 쪽이다.\n[잰 것] 가운데 작은잎 길이 5.4 cm, 최대 폭 2.0 cm → 길이÷폭 2.75. 작은잎 수 15·17·13장.\n[추정] 작은잎 수(13~17)는 ①(11~15)과 겹치지만 길이÷폭(2.50~2.75)은 ①(1.62~1.75)과 겹치지 않을 것으로 추정되어 이것을 기준으로 삼았다.' },
      { label: '③', draw: lkCherry, text: '[관찰한 사실] 잎몸이 한 장인 홑잎이고 가장자리에 큰 톱니마다 작은 톱니가 붙은 겹톱니가 있다. 가장 넓은 곳이 잎끝 쪽에 있다. 같은 나무의 잎인데 크기가 5.6~11.9 cm로 두 배 넘게 달랐다.\n[잰 것] 잎3: 길이 8.8 cm, 최대 폭 5.0 cm, 잎밑→최대 폭 5.5 cm → 길이÷폭 1.76, 잎밑→최대 폭÷길이 0.63. 톱니(큰 것만) 32개.\n[추정] 잎이 자라면서 길이와 폭이 같이 커지므로 길이÷폭은 크기와 상관없이 비슷할 것으로 추정된다.' },
      { label: '④', draw: lkZelkova, text: '[관찰한 사실] ③처럼 톱니 있는 홑잎이지만 톱니가 굵고 하나씩이며, ③보다 길쭉하고 가장 넓은 곳이 잎밑 쪽이다. 곁맥이 더 많고 나란하다(12~13쌍).\n[잰 것] 잎3: 길이 6.4 cm, 최대 폭 2.7 cm, 잎밑→최대 폭 2.6 cm → 길이÷폭 2.35, 잎밑→최대 폭÷길이 0.41. 톱니 12개.\n[추정] 길이로는 ③과 5.6~8.9 cm에서 겹치지만, 길이÷폭은 2.20~2.35로 ③(1.68~1.80)과 떨어져 있어 구분 기준이 될 것으로 추정된다.' },
    ],
    extra: [
      { title: '가설과 측정 계획', ask: '눈으로 본 차이 → 숫자로 나타낼 형질 → 잴 방법', text: '[가설 1] ①②는 겹잎이고 ③④는 홑잎이다 → 잎몸 수를 센다.\n[가설 2] ②의 작은잎은 ①보다 길쭉할 것이다 → 가운데 작은잎의 길이÷폭.\n[가설 3] ③은 ④보다 통통하고 가장 넓은 곳이 잎끝 쪽일 것이다 → 길이÷폭, 잎밑→최대 폭÷길이.\n[측정 방법] 종마다 3~5장을 모눈종이에 놓고 자로 0.1 cm까지 잰다. 길이는 잎자루가 붙는 곳~잎끝, 최대 폭은 가운데 맥에 수직으로 가장 넓은 곳. 겹잎은 가운데 쌍의 작은잎을 잰다.' },
      { title: '값 바꾸기와 가설 검증', ask: '길이 하나로 안 되는 까닭 → 비율로 바꾼 값 → 가설 지지 여부', draw: lkPlot, text: '[길이만 쓰면] ③(5.6~11.9 cm)과 ④(3.8~8.9 cm)의 길이는 5.6~8.9 cm에서 겹친다. 같은 종도 어린 잎과 다 자란 잎의 크기가 크게 다르기 때문이다(연속 변이).\n[비율로 바꾸면] 길이÷폭은 ③ 1.68~1.80(평균 1.7), ④ 2.20~2.35(평균 2.3)로 겹치지 않는다. 그래프에서 점이 위아래 두 무리로 갈린다. ①(1.6~1.8)과 ②(2.5~2.8)도 겹치지 않는다.\n[검증] 가설 2·3은 지지되었다. 다만 한 나무에서만 주웠으므로, 다른 나무의 잎도 같은 범위에 드는지는 더 재 봐야 한다.' },
    ],
    tree: { items: ['①', '②', '③', '④'], q: '잎몸이 작은잎 여러 장으로 나뉘는가?', yes: { items: ['①', '②'], q: '가운데 작은잎의 길이÷폭이 2.2 이상인가?', yes: { items: ['②'] }, no: { items: ['①'] } }, no: { items: ['③', '④'], q: '잎의 길이÷폭이 2.0 이상인가?', yes: { items: ['④'] }, no: { items: ['③'] } } },
    classify: '첫 기준은 누가 봐도 같게 나뉘는 「겹잎인가」로 했다. 두 번째부터는 잰 값의 범위가 겹치지 않는 비율을 쓰고, 경계는 두 종의 범위 사이(①1.75와 ②2.50 사이 → 2.2, ③1.80과 ④2.20 사이 → 2.0)로 정했다. 작은잎 수와 잎 길이는 종끼리 겹쳐서 쓰지 않았다.',
    venn: { la: '③ 잎끝 쪽이 넓은 잎', lb: '④ 잎밑 쪽이 넓은 잎', a: '길이÷폭 1.68~1.80(통통) · 가장 넓은 곳이 잎끝 쪽(0.63) · 겹톱니 30개 넘음 · 곁맥 8~9쌍', both: '홑잎 · 가장자리에 톱니 · 깃꼴 잎맥 · 같은 종도 길이가 두 배까지 다름', b: '길이÷폭 2.20~2.35(길쭉) · 가장 넓은 곳이 잎밑 쪽(0.41) · 톱니가 굵고 12~15개 · 곁맥 11~13쌍' },
    next: '길이÷폭이 같은 종 안에서 정말 크기와 상관없는지 확인하고 싶다. ③의 잎 20장을 재어 길이(가로)와 길이÷폭(세로) 그래프를 그리고, 점들이 가로로 평평하게 놓이는지 본다. 바꿀 것: 잎 크기(어린 잎~다 자란 잎), 잴 것: 길이·폭, 같게 할 것: 같은 나무·같은 날·같은 자.',
  },
  'observe-grow': {
    who: { name: '정예시', grade: '4학년 3반', date: '2026-04-29' },
    target: '장소: 4학년 3반 교실 창가(①③)와 그늘진 복도(②)\n대상: 4월 1일에 같은 흙·같은 깊이(2 cm)로 심은 강낭콩 세 화분 ①②③',
    titles: { table: '자람 기록표(키, cm)', tableAsk: '흙 표면에서 줄기 끝까지 곧게 잰 높이. 표 아래는 이 표로 그린 꺾은선 그래프.', env: '세 화분 비교', envAsk: '바꾼 것 하나 → 결과 → 아마 ~때문', venn: '두 화분(①·②)의 같은 점과 다른 점', adapt: '떡잎·본잎·뿌리가 하는 일' },
    chart: true,
    table: [['① 창가·물 매일', '1.5', '6', '10', '14', '21', '27'], ['② 그늘·물 매일', '2', '9', '15', '21', '27', '31'], ['③ 창가·물 적게', '1', '5', '8', '10', '14', '17']],
    obs: [
      { label: '①', draw: beanSun, text: '[본 것] 21일째 키 21 cm, 본잎 5장(첫 마디 홑잎 2장 + 세겹잎 3장). 줄기 끝이 창문 쪽으로 기울었다. 떡잎은 작고 누레졌다.\n[잰 것] 줄기 굵기 4 mm(줄기 아래쪽). 7일째부터 사흘마다 약 4 cm씩 자랐다.\n[추정] 빛이 오는 쪽으로 자라 잎이 햇빛을 더 받는 것 같다.' },
      { label: '②', draw: beanShade, text: '[본 것] 21일째 키 27 cm로 셋 중 가장 크지만 줄기가 가늘고(2 mm) 잎이 3장뿐이며 작고 연한 연두색이다. 줄기가 힘이 없어 보인다.\n[잰 것] 7일째에 이미 9 cm로 ①(6 cm)보다 컸다.\n[추정] 빛이 모자라서 빛을 찾아 줄기만 길게 자란 것 같다(키가 크다고 잘 자란 것은 아닌 것 같다).' },
      { label: '③', draw: beanDry, text: '[본 것] 21일째 키 14 cm, 본잎 3장. 물 주기 전날에는 잎이 아래로 처졌다가 물을 주고 반나절 뒤 다시 펴졌다.\n[잰 것] 줄기 굵기 3 mm. 10일 이후 자라는 빠르기가 ①의 절반쯤이다.\n[추정] 물이 모자라면 잎이 처지고 덜 자라는 것 같다. 흙 속 뿌리는 물을 찾아 더 깊이 내려갔을 것 같다.' },
    ],
    env: '[바꾼 것] ①과 ②는 빛만(창가/그늘), ①과 ③은 물만(매일/사흘에 한 번) 다르다. 흙·화분·심은 날·물 양(50 mL)은 같게 했다.\n[결과] 그래프에서 ②는 7일째부터 가장 위에 있지만 잎 수와 줄기 굵기는 가장 작다. ③은 10일째부터 ①과 선이 벌어져 28일째 10 cm 차이가 났다.\n[아마] ②는 빛이 약해서 줄기만 웃자란 것 같고, ③은 물이 모자라서 덜 자란 것 같다.',
    venn: { la: '① 창가', lb: '② 그늘', a: '줄기가 굵다(4 mm) · 잎이 5장, 진한 초록 · 줄기 끝이 창문 쪽', both: '같은 날 심음 · 물 매일 50 mL · 떡잎이 먼저 나오고 나중에 시든다 · 첫 마디 잎은 홑잎 2장', b: '키가 더 크다(27 cm) · 줄기가 가늘다(2 mm) · 잎이 3장, 작고 연함' },
    adapt: '[떡잎] 본잎이 커질수록 떡잎이 쭈그러들었다. 떡잎 속 양분을 쓰면서 처음 자라는 것 같다.\n[본잎] 본잎이 많고 넓은 ①이 줄기도 굵었다. 본잎이 빛을 받아 양분을 만드는 것 같다.\n[뿌리] 흙 속을 보니 ③의 원뿌리가 가장 길었다. 물이 적으면 뿌리가 물을 찾아 깊이 뻗는 것 같다.',
    next: '물 양만 바꾸면 얼마나 달라질까? 화분 네 개에 물을 하루 20·50·80·110 mL씩(바꿀 것) 주고 28일 동안 키와 잎 수를 잰다(잴 것). 빛·흙·화분·심은 날은 같게 한다(같게 할 것).',
  },
  'observe-mold': {
    who: { name: '한예시', grade: '5학년 2반', date: '2026-06-12' },
    target: '장소: 과학실 창고 선반(따뜻하고 그늘짐, 약 25℃)\n대상: 6월 4일에 물을 조금 뿌려 뚜껑 닫은 통에 넣은 ①식빵 ②귤 ③밥',
    titles: { table: '곰팡이 관찰일기(덮은 넓이, %)', tableAsk: '모눈종이를 통 아래에 깔고 위에서 센 값. 표 아래는 꺾은선 그래프.', classify: '곰팡이 나누기(분류 나무)', venn: '두 곰팡이(②·③)의 같은 점과 다른 점', adapt: '균사와 포자가 하는 일' },
    chart: true,
    table: [['① 식빵', '0', '0', '5', '35', '78'], ['② 귤', '0', '0', '3', '24', '61'], ['③ 밥', '0', '0', '17', '61', '91']],
    obs: [
      { label: '①', draw: moldBread, text: '[본 것] 4일째 흰 솜 같은 것이 동그랗게 났고, 6일째 그 위에 까만 점이 생겼다. 까만 점은 무리 가운데에 많고 테두리에는 없다.\n[확인한 것] 돋보기로 보니 솜털 끝마다 까만 공이 하나씩 달려 있었다. 선생님 현미경 표본에서도 실 끝에 둥근 주머니가 보였다.\n[추정] 가운데가 먼저 자라 까만 점(포자)을 만들고, 테두리의 흰 솜털은 새로 퍼지는 부분으로 추정된다.' },
      { label: '②', draw: moldOrange, text: '[본 것] 4일째 껍질에 흰 점이 생겼고, 6일째 가운데가 청록색 가루로 변했다. 테두리는 계속 하얗다. 무리가 있는 곳의 껍질이 물러졌다.\n[확인한 것] 현미경 표본에서 실 끝이 붓처럼 갈라지고 그 끝에 작은 알갱이가 줄줄이 달려 있었다.\n[추정] 청록 가루는 줄줄이 달린 포자이고, 껍질이 물러진 것은 곰팡이가 귤을 양분으로 쓰기 때문인 것 같다.' },
      { label: '③', draw: moldRice, text: '[본 것] 2일째 밥알 사이에 흰 실이 조금 보였고, 4일째부터 가운데가 노란 연두색 가루가 되었다. 셋 중 가장 먼저, 가장 넓게 퍼졌다(8일째 91%).\n[확인한 것] 현미경 표본에서 실 끝이 둥글게 부풀고 그 둘레에 알갱이 사슬이 사방으로 달려 있었다.\n[추정] 밥은 물기가 많고 부드러워 곰팡이가 가장 빨리 자란 것 같다.' },
    ],
    tree: { items: ['①', '②', '③'], q: '포자가 까만 점으로 보이는가?', yes: { items: ['①'] }, no: { items: ['②', '③'], q: '가루가 청록색인가?', yes: { items: ['②'] }, no: { items: ['③'] } } },
    classify: '맨눈으로도 확실히 다른 「포자의 색」을 기준으로 했다. 무리의 크기는 날마다 바뀌어서 기준으로 쓰지 않았다. 현미경 모양(둥근 주머니·붓·둥근 머리)으로 나눠도 같은 세 무리가 되었다.',
    venn: { la: '② 귤 곰팡이', lb: '③ 밥 곰팡이', a: '청록색 가루 · 포자가 붓 모양으로 달림 · 4일째 처음 보임', both: '가운데는 색 가루, 테두리는 흰 솜털 · 실(균사) 끝에 포자 사슬 · 음식이 물러짐', b: '노란 연두색 가루 · 둥근 머리 둘레에 포자 · 2일째 처음 보이고 가장 빨리 퍼짐' },
    adapt: '[균사(흰 솜털)] 음식 속과 겉으로 실처럼 뻗어 퍼진다. 균사가 지나간 곳이 물러진 것을 보면 음식에서 양분을 빨아들이는 것으로 추정된다.\n[포자(점·가루)] 아주 작고 많아서 공기를 타고 날아가 다른 음식에서 새로 자랄 것으로 추정된다. 그래서 뚜껑을 열면 안 된다.',
    next: '온도만 바꾸면 곰팡이가 피는 날이 달라질까? 같은 식빵을 냉장고(4℃)·교실(25℃)·따뜻한 곳(30℃)에 두고(바꿀 것) 처음 보인 날과 덮은 넓이를 잰다(잴 것). 빵 크기·물 양·통은 같게 한다(같게 할 것).',
  },
};
export const sampleFor = (id) => SAMPLES[id] || null;
