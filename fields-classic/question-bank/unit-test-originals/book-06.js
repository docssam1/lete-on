// 6권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문항 글·수·이름·그림 배치는 원문 시험지 그대로, 그림은 워밍업 그림 색표로 새로 그린다(옛 청록·하늘색 금지, 글자 검정).
// 정답은 두지 않는다 — 원문 풀기 화면은 「답안 확인」을 누를 때만 비공개 DB에서 받아 온다.
// visual.values 는 비공개 답안 그림(빈칸을 채운 모양)을 그릴 때만 들어온다. 공개 문항 데이터에는 넣지 않는다.
import { UT, esc, text } from "./kit.js?v=20261028ze";

// 모양 색(워밍업 색표): 직사각형·정사각형 ■ 파랑 · 마름모 ◆ 보라 · 정삼각형 ▲ 초록 · ● 빨강 · ★ 노랑 · 십자 분홍(새 모양)
const SHAPE = Object.freeze({
  rect: { stroke: UT.blue, fill: UT.blueSoft },
  rhombus: { stroke: UT.purple, fill: UT.purpleSoft },
  triangle: { stroke: UT.green, fill: UT.greenSoft },
  circle: { stroke: UT.red, fill: UT.redSoft },
  cross: { stroke: UT.pink, fill: "#fde0ee" }
});
const SHADED = "#ffa94d";
const PAPER = "#fdfbf5";
const TOKEN = Object.freeze({
  ball: { fill: "#e8503a", edge: "#b23b28" },
  square: { fill: "#2f6fe0", edge: "#1f4ea8" },
  diamond: { fill: "#8e5bd8", edge: "#653cae" },
  star: { fill: "#f0b23a", edge: "#b8862a" }
});

const n = (value) => Number(value.toFixed(1));
// 그림 틀: 원문처럼 문제 바로 아래(위쪽)에 붙인다
const frame = (width, height, label, body, maxWidth = width) =>
  `<svg class="b6-ut-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}" style="display:block;align-self:start;width:100%;max-width:${maxWidth}px;height:auto;margin:0 auto">${body}</svg>`;
// 흰 테두리를 두른 글자(점선 위에 얹는 길이 글자)
const halo = (x, y, value, { size = 16, anchor = "middle", weight = 600, fill = UT.ink } = {}) =>
  `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" dominant-baseline="central" style="font-size:${size}px;font-weight:${weight};fill:${fill};text-anchor:${anchor};dominant-baseline:central;letter-spacing:0;paint-order:stroke;stroke:#fff;stroke-width:6px;stroke-linejoin:round">${esc(value)}</text>`;
const label = (x, y, value, options = {}) => text(n(x), n(y), value, { weight: 600, ...options });
const poly = (points, { stroke = UT.ink, fill = "none", width = 1.8, dash = "" } = {}) =>
  `<polygon points="${points.map(([x, y]) => `${n(x)},${n(y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const rect = (x, y, w, h, { stroke = UT.ink, fill = "none", width = 1.8, radius = 0, dash = "" } = {}) =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const seg = (x1, y1, x2, y2, { stroke = UT.ink, width = 1.6, dash = "" } = {}) =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// 답 쓰는 빈 상자(보라 테두리). value 가 있으면(비공개 답안 그림) 안에 적는다.
const answerBox = (x, y, w, h, value, { radius = 4, size = 17 } = {}) =>
  `${rect(x, y, w, h, { stroke: UT.box, fill: UT.boxFill, width: 1.8, radius })}${value == null ? "" : text(n(x + w / 2), n(y + h / 2 + 1), value, { size, weight: 800, fill: UT.red })}`;
// 동그라미 글자 ㉠·㉮ — 글꼴에 없을 때도 같은 모양이 되게 직접 그린다
const circled = (x, y, value, r = 10, size = 12) =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="#fff" stroke="${UT.ink}" stroke-width="1.2"/>${text(n(x), n(y + 0.5), value, { size, weight: 700 })}`;
// 길이 점선(두 점을 잇는 둥근 점선). bulge>0 이면 진행 방향의 왼쪽(화면 기준)으로 휜다. 꼭대기 좌표를 돌려준다.
function arc(x1, y1, x2, y2, bulge) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
  const nx = dy / len, ny = -dx / len;
  const apex = [(x1 + x2) / 2 + nx * bulge, (y1 + y2) / 2 + ny * bulge];
  const control = [(x1 + x2) / 2 + nx * bulge * 2, (y1 + y2) / 2 + ny * bulge * 2];
  return { apex, path: `<path d="M${n(x1)} ${n(y1)}Q${n(control[0])} ${n(control[1])} ${n(x2)} ${n(y2)}" fill="none" stroke="${UT.line}" stroke-width="1.3" stroke-dasharray="4 3"/>` };
}
const dimension = (x1, y1, x2, y2, bulge, value, size = 16) => {
  const { apex, path } = arc(x1, y1, x2, y2, bulge);
  return path + (value == null ? "" : halo(apex[0], apex[1], value, { size }));
};
// 점선 위에 빈 상자 + 「cm」
const dimensionBox = (x1, y1, x2, y2, bulge, value, { w = 44, h = 32, size = 18 } = {}) => {
  const { apex, path } = arc(x1, y1, x2, y2, bulge);
  return `${path}${answerBox(apex[0] - w / 2, apex[1] - h / 2, w, h, value)}${label(apex[0] + w / 2 + 4, apex[1] + 1, "cm", { size, anchor: "start" })}`;
};

// ── 그림마다 ─────────────────────────────────────────────
// 1. 수직선 두 개 — 양 끝 ㉠·㉡, 가운데 빈 상자
function midpointLines(visual) {
  const part = (index, { left, right }, top) => {
    const y = top + 78;
    const [x0, xm, x1] = [44, 210, 376];
    const tick = (x) => seg(x, y - 12, x, y, { stroke: UT.ink, width: 1.6 });
    const half = (a, b) => {
      const { apex, path } = arc(a, y - 12, b, y - 12, 13);
      return `${path}<circle cx="${n(apex[0])}" cy="${n(apex[1])}" r="4.2" fill="#fff" stroke="${UT.orange}" stroke-width="1.6"/>`;
    };
    return `${label(10, top + 10, `(${index + 1})`, { size: 20, anchor: "start" })}`
      + `${seg(x0, y, x1, y, { width: 1.8 })}${tick(x0)}${tick(xm)}${tick(x1)}${half(x0, xm)}${half(xm, x1)}`
      + `${circled(x0 + 2, y - 32, "ㄱ", 13, 15)}${circled(x1 + 4, y - 32, "ㄴ", 13, 15)}`
      + `${label(x0, y + 28, left, { size: 22 })}${label(x1, y + 28, right, { size: 22 })}`
      + answerBox(xm - 30, y + 8, 60, 38, visual.values?.[index], { radius: 7 });
  };
  return frame(420, 286, "두 점 ㉠과 ㉡ 사이를 똑같이 나눈 수직선 두 개", visual.parts.map((p, i) => part(i, p, i * 146)).join(""), 400);
}

// 2. ㉮~㉯ 8칸, ㉯~㉰ 3칸으로 나눈 수직선
function splitLine(visual) {
  const y = 74;
  const start = 22, small = 35.2, large = 53;
  const xs = [...Array.from({ length: 9 }, (_, i) => start + small * i), ...[1, 2, 3].map((i) => start + small * 8 + large * i)];
  let body = seg(xs[0], y, xs[11], y, { width: 1.8 });
  body += xs.map((x) => seg(x, y - 14, x, y + 10, { width: 1.5 })).join("");
  xs.slice(0, -1).forEach((x, i) => {
    const { apex, path } = arc(x, y - 14, xs[i + 1], y - 14, 8);
    body += path;
    body += i < 8
      ? `<circle cx="${n(apex[0])}" cy="${n(apex[1])}" r="3.4" fill="#fff" stroke="${UT.orange}" stroke-width="1.4"/>`
      : `${seg(apex[0] - 2.2, apex[1] - 5, apex[0] - 2.2, apex[1] + 5, { stroke: UT.orange, width: 1.6 })}${seg(apex[0] + 2.2, apex[1] - 5, apex[0] + 2.2, apex[1] + 5, { stroke: UT.orange, width: 1.6 })}`;
  });
  body += circled(xs[0] + 2, 20, "가", 12, 14) + circled(xs[8] + 4, 20, "나", 12, 14) + circled(xs[11] - 4, 20, "다", 12, 14);
  body += visual.below.map(({ at, value }) => label(xs[at], y + 38, value, { size: 23 })).join("");
  body += visual.points.map(({ at, name }) => circled(xs[at], y + 34, name, 12, 14)).join("");
  return frame(480, 128, "두 구간을 서로 다르게 나눈 수직선", body, 470);
}

// 3. 끈 ㉠·㉡·㉢
function ropes() {
  const x0 = 70, x1 = 410, xb = x0 + (x1 - x0) * 0.75;
  const bar = (a, b, y) => rect(a, y - 6, b - a, 12, { stroke: "#a8741a", fill: UT.yellow, width: 1.4, radius: 2 });
  const row = (name, y) => `${circled(24, y, name, 14, 17)}${label(50, y, ":", { size: 21 })}`;
  const body = seg(xb, 6, xb, 194, { stroke: UT.line, width: 1.2, dash: "4 3" }) + seg(x1, 6, x1, 194, { stroke: UT.line, width: 1.2, dash: "4 3" })
    + row("ㄱ", 30) + bar(x0, x1, 30) + row("ㄴ", 98) + bar(x0, xb, 98) + row("ㄷ", 166) + bar(xb, x1, 166);
  return frame(430, 200, "끈 ㉠, ㉡, ㉢의 길이", body, 400);
}

// 4. 두 막대 비교 + 이어 붙인 막대(합 56cm)
function twoBars(visual) {
  const A = { stroke: UT.orange, fill: UT.orangeSoft }, B = { stroke: UT.blue, fill: UT.blueSoft };
  let body = "";
  const x = 36, top = 10, h = 52;
  for (let i = 0; i < 3; i += 1) body += rect(x + i * 110, top, 110, h, { ...A }) + circled(x + i * 110 + 55, top + h / 2, "ㄱ", 12, 15);
  for (let i = 0; i < 5; i += 1) body += rect(x + i * 66, top + h, 66, h, { ...B }) + circled(x + i * 66 + 33, top + h * 1.5, "ㄴ", 12, 15);
  const bx = 96, by = 236, wa = 132, wb = 78;
  body += rect(bx, by, wa, h, { ...A }) + rect(bx + wa, by, wb, h, { ...B });
  body += circled(bx + wa / 2, by + h / 2, "ㄱ", 12, 15) + circled(bx + wa + wb / 2, by + h / 2, "ㄴ", 12, 15);
  body += dimensionBox(bx, by, bx + wa, by, 22, visual.values?.[0], { w: 46, h: 34, size: 20 });
  body += dimensionBox(bx + wa, by, bx + wa + wb, by, 22, visual.values?.[1], { w: 46, h: 34, size: 20 });
  body += dimension(bx, by + h, bx + wa + wb, by + h, -22, "56cm", 21);
  return frame(400, 336, "두 막대의 길이 비교", body, 380);
}

// 양팔 저울: 접시 두 개 + 주황 대 + 노란 받침
function balance(cx, plateY, offset, rx, left, right) {
  const leg = 16;
  const stand = `${seg(cx - offset, plateY + 4, cx - offset, plateY + leg, { stroke: UT.orange, width: 2.4 })}${seg(cx + offset, plateY + 4, cx + offset, plateY + leg, { stroke: UT.orange, width: 2.4 })}${seg(cx - offset, plateY + leg, cx + offset, plateY + leg, { stroke: UT.orange, width: 3 })}`
    + poly([[cx, plateY + leg + 2], [cx - 18, plateY + leg + 32], [cx + 18, plateY + leg + 32]], { stroke: "#d9a400", fill: UT.yellow, width: 1.6 });
  const plate = (x) => `<ellipse cx="${n(x)}" cy="${n(plateY)}" rx="${rx}" ry="8" fill="#fff6e6" stroke="${UT.orange}" stroke-width="1.8"/>`;
  return stand + plate(cx - offset) + plate(cx + offset) + left(cx - offset, plateY - 6) + right(cx + offset, plateY - 6);
}
const ball = (x, y, r = 14) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${TOKEN.ball.fill}" stroke="${TOKEN.ball.edge}" stroke-width="1.4"/><circle cx="${n(x - r * 0.35)}" cy="${n(y - r * 0.35)}" r="${n(r * 0.28)}" fill="#fff" opacity=".45"/>`;
const block = (x, y, s = 28) => rect(x - s / 2, y - s / 2, s, s, { stroke: TOKEN.square.edge, fill: TOKEN.square.fill, width: 1.4, radius: 2 });
const gem = (x, y, r = 15) => poly([[x, y - r], [x + r, y], [x, y + r], [x - r, y]], { stroke: TOKEN.diamond.edge, fill: TOKEN.diamond.fill, width: 1.4 });
function star(x, y, r = 16) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const radius = i % 2 ? r * 0.45 : r;
    return [x + Math.cos(a) * radius, y + Math.sin(a) * radius];
  });
  return poly(pts, { stroke: TOKEN.star.edge, fill: TOKEN.star.fill, width: 1.4 });
}
function weight(x, bottom, value) {
  const w = 62, h = 64;
  return rect(x - 12, bottom - h - 12, 24, 14, { stroke: UT.line, fill: "#e4dccb", width: 1.4, radius: 2 })
    + rect(x - w / 2, bottom - h, w, h, { stroke: UT.line, fill: "#ece5d6", width: 1.6, radius: 7 })
    + text(x, bottom - h / 2 + 1, value, { size: 22, weight: 700 });
}

// 5. 공 5개 = 네모 4개 / 공 1개 + 네모 1개 = 36g
function weights() {
  const r = 14;
  const first = balance(200, 92, 104, 72,
    (x, y) => [[-15, -r - 24], [15, -r - 24], [-29, -r], [0, -r], [29, -r]].map(([dx, dy]) => ball(x + dx, y + dy)).join(""),
    (x, y) => [[-15, -45], [15, -45], [-15, -15], [15, -15]].map(([dx, dy]) => block(x + dx, y + dy, 30)).join(""));
  const second = balance(200, 250, 104, 72,
    (x, y) => ball(x - 15, y - r) + block(x + 15, y - 15, 30),
    (x, y) => weight(x, y + 2, "36g"));
  return frame(400, 300, "평형을 이룬 저울 두 개", first + second, 380);
}

// 도형 기호 하나(6번)
function glyph(kind, x, y, s = 17) {
  const c = SHAPE[kind === "diamond" ? "rhombus" : kind === "square" ? "rect" : kind];
  const o = { stroke: c.stroke, fill: c.fill, width: 1.7 };
  if (kind === "diamond") return poly([[x, y - s], [x + s, y], [x, y + s], [x - s, y]], o);
  if (kind === "triangle") return poly([[x, y - s], [x + s * 1.02, y + s * 0.8], [x - s * 1.02, y + s * 0.8]], o);
  if (kind === "square") return rect(x - s, y - s, s * 2, s * 2, o);
  if (kind === "circle") return `<circle cx="${n(x)}" cy="${n(y)}" r="${s}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.7"/>`;
  const a = s * 0.42;
  return poly([[x - a, y - s], [x + a, y - s], [x + a, y - a], [x + s, y - a], [x + s, y + a], [x + a, y + a], [x + a, y + s], [x - a, y + s], [x - a, y + a], [x - s, y + a], [x - s, y - a], [x - a, y - a]], o);
}

// 6. 수 카드 3·4·6·7·8 + 도형 식 네 줄
function shapeEquations(visual) {
  const cardSize = 34, gap = 8;
  const startX = (420 - (visual.cards.length * cardSize + (visual.cards.length - 1) * gap)) / 2;
  let body = visual.cards.map((card, i) => rect(startX + i * (cardSize + gap), 6, cardSize, cardSize, { stroke: UT.cardLine, fill: UT.card, width: 1.8, radius: 3 }) + text(startX + i * (cardSize + gap) + cardSize / 2, 24, card, { size: 18, weight: 800 })).join("");
  body += rect(8, 58, 404, 268, { stroke: UT.soft, fill: PAPER, width: 1.5, radius: 14 });
  const slot = (i) => 44 + i * 55;
  visual.rows.forEach((row, r) => {
    const y = 100 + r * 62;
    let k = 0;
    row.forEach((token) => {
      if (token === "+" || token === "=") { body += text(n(slot(k) - 27.5), y + 1, token, { size: 20, weight: 700 }); return; }
      body += glyph(token, slot(k), y);
      k += 1;
    });
  });
  return frame(420, 334, "수 카드와 도형으로 된 식 네 줄", body, 400);
}

// 7. 직사각형(둘레 36cm)과 붙인 마름모
function rectRhombus(visual) {
  const g = (dx, dy, inner) => `<g transform="translate(${dx} ${dy})">${inner}</g>`;
  const inner = poly([[223, 40], [370, 130], [370, 300], [223, 210]], SHAPE.rhombus)
    + rect(88, 40, 135, 170, SHAPE.rect)
    + dimension(88, 40, 223, 40, 18, "7cm", 21)
    + dimensionBox(223, 40, 370, 130, 22, visual.values?.[0], { w: 44, h: 32, size: 21 })
    + label(155, 106, "직사각형", { size: 21 }) + label(155, 146, "둘레 : 36cm", { size: 19 })
    + label(300, 196, "마름모", { size: 21 });
  return frame(420, 318, "직사각형에 마름모를 붙인 도형", g(-30, 6, inner), 360);
}

// 8. 직사각형 + 정삼각형 + 정사각형
function rectTriangleSquare(visual) {
  const top = [245, 72], bottom = [245, 217];
  const apex = [245 + 145 * Math.sqrt(3) / 2, 144.5];
  const v = [apex[0] - bottom[0], apex[1] - bottom[1]];
  const out = [-v[1], v[0]];
  const s3 = [apex[0] + out[0], apex[1] + out[1]], s4 = [bottom[0] + out[0], bottom[1] + out[1]];
  const inner = rect(28, 72, 217, 145, SHAPE.rect)
    + poly([top, bottom, apex], SHAPE.triangle)
    + poly([bottom, apex, s3, s4], SHAPE.rect)
    + dimensionBox(28, 72, 245, 72, 22, visual.values?.[0], { w: 50, h: 38, size: 22 })
    + dimension(s4[0], s4[1], s3[0], s3[1], -16, "6cm", 22)
    + label(136, 146, "직사각형", { size: 23 }) + label((245 + 245 + apex[0]) / 3 + 6, 146, "정삼각형", { size: 18 })
    + label((bottom[0] + s3[0]) / 2, (bottom[1] + s3[1]) / 2, "정사각형", { size: 22 });
  return frame(470, 372, "직사각형, 정삼각형, 정사각형을 이어 붙인 도형", `<g transform="translate(4 -6)">${inner}</g>`, 400);
}

// 9. ㉮·㉯·㉰ 정사각형과 색칠된 직사각형
function threeSquares() {
  const sq = { stroke: UT.blue, fill: "#fff" };
  const body = rect(62, 50, 238, 238, sq) + rect(300, 50, 190, 190, sq) + rect(300, 240, 47, 48, sq)
    + rect(347, 240, 143, 48, { stroke: UT.blue, fill: SHADED })
    + dimension(62, 50, 490, 50, 26, "11cm", 24) + dimension(62, 288, 62, 50, 26, "6cm", 24)
    + circled(181, 172, "가", 14, 17) + circled(395, 147, "나", 14, 17) + circled(323.5, 264, "다", 14, 17);
  return frame(500, 296, "정사각형 ㉮, ㉯, ㉰와 색칠된 직사각형", body, 400);
}

// 10. 직각으로 꺾인 도형
function bentShape() {
  const pts = [[65, 30], [175, 30], [175, 85], [340, 85], [340, 195], [285, 195], [285, 248], [120, 248], [120, 140], [65, 140]];
  const body = poly(pts, SHAPE.rect)
    + dimension(65, 30, 175, 30, 16, "3cm", 19) + dimension(65, 140, 65, 30, 22, "3cm", 19)
    + dimension(175, 85, 340, 85, 18, "5cm", 19) + dimension(120, 248, 120, 140, 22, "3cm", 19);
  return frame(360, 262, "직각으로 꺾인 도형", `<g transform="translate(0 4)">${body}</g>`, 320);
}

// 11. 정사각형 두 개 + 정삼각형 네 개
function squareTriangleStar() {
  const h = 110 * Math.sqrt(3) / 2;
  const body = poly([[170, 113], [280, 113], [225, 113 - h]], SHAPE.triangle)
    + poly([[170, 223], [280, 223], [225, 223 + h]], SHAPE.triangle)
    + poly([[115, 113], [115, 223], [115 - h, 168]], SHAPE.triangle)
    + poly([[335, 113], [335, 223], [335 + h, 168]], SHAPE.triangle)
    + rect(115, 113, 110, 110, SHAPE.rect) + rect(225, 113, 110, 110, SHAPE.rect);
  return frame(450, 336, "정사각형과 정삼각형을 붙인 도형", body, 380);
}

// 12. 정사각형으로 채운 직사각형(가로 42cm)
function squareTiling() {
  const sq = { stroke: UT.blue, fill: "#fff" };
  const body = rect(18, 10, 274, 275, sq) + rect(292, 10, 110, 110, sq) + rect(292, 120, 110, 110, sq)
    + rect(292, 230, 55, 55, sq) + rect(347, 230, 55, 55, { stroke: UT.blue, fill: SHADED })
    + dimension(18, 285, 402, 285, -22, "42cm", 23);
  return frame(420, 340, "정사각형 여러 개로 만든 직사각형", body, 380);
}

// 13·14·16·17·18 — 원문처럼 문제 아래 왼쪽에 식·물음을 적는다(물음 사이는 풀이 자리)
function lines(visual) {
  const style = `align-self:stretch;justify-self:stretch;display:grid;grid-template-rows:repeat(${visual.lines.length},minmax(0,1fr));height:100%;min-height:${visual.lines.length > 1 ? 150 : 40}px;margin:0;padding:2px 0 0 8px;color:${UT.ink};font-size:16px;font-weight:500;line-height:1.5;word-break:keep-all`;
  return `<div class="b6-ut-lines" style="${style}">${visual.lines.map((line) => `<p style="margin:0">${esc(line)}</p>`).join("")}</div>`;
}

// 13. 한 줄 식 — 원문처럼 한 줄에 다 들어가게(칸이 좁으면 그림처럼 줄어든다)
function expressionLine(visual) {
  const body = `<text x="6" y="20" textLength="${visual.length}" lengthAdjust="spacingAndGlyphs" dominant-baseline="central" style="font-size:19px;font-weight:500;fill:${UT.ink};dominant-baseline:central;letter-spacing:0">${esc(visual.expression)}</text>`;
  return frame(visual.length + 12, 40, visual.expression, body, visual.length + 12);
}

// 15. 펼친 책
function openBook() {
  const body = `<path d="M150 46C118 28 64 24 22 36V140C64 128 118 130 150 150C182 130 236 128 278 140V36C236 24 182 28 150 46Z" fill="${UT.orange}" stroke="#c46f12" stroke-width="1.8" stroke-linejoin="round"/>`
    + `<path d="M150 40C120 20 72 18 32 28V128C72 118 120 120 150 140Z" fill="#fffaf0" stroke="#a8741a" stroke-width="1.6" stroke-linejoin="round"/>`
    + `<path d="M150 40C180 20 228 18 268 28V128C228 118 180 120 150 140Z" fill="#fffaf0" stroke="#a8741a" stroke-width="1.6" stroke-linejoin="round"/>`
    + [52, 68, 84, 100].map((y) => `<path d="M48 ${y - 16}C82 ${y - 24} 116 ${y - 20} 136 ${y - 10}" fill="none" stroke="#d9cdb4" stroke-width="2"/><path d="M164 ${y - 10}C184 ${y - 20} 218 ${y - 24} 252 ${y - 16}" fill="none" stroke="#d9cdb4" stroke-width="2"/>`).join("")
    + seg(150, 40, 150, 140, { stroke: "#a8741a", width: 1.6 });
  return frame(300, 158, "펼친 책", body, 260);
}

// 19. 8 ○ 6 ○ 4 ○ 2 = ? 세 줄
function signRows(visual) {
  const body = visual.rows.map((row, r) => {
    const y = 40 + r * 108;
    const xs = [78, 178, 278, 378];
    let s = label(14, y, `(${r + 1})`, { size: 20, anchor: "start" });
    s += row.numbers.map((num, i) => label(xs[i], y, num, { size: 26, weight: 500 })).join("");
    s += [0, 1, 2].map((i) => `<circle cx="${xs[i] + 50}" cy="${y}" r="24" fill="#fff" stroke="${UT.box}" stroke-width="1.8"/>${visual.values?.[r]?.[i] ? text(xs[i] + 50, y + 1, visual.values[r][i], { size: 26, weight: 800, fill: UT.red }) : ""}`).join("");
    s += label(414, y, "=", { size: 24, weight: 500 }) + label(452, y, row.result, { size: 26, weight: 500 });
    return s;
  }).join("");
  return frame(480, 286, "+ 또는 -를 넣을 식 세 줄", body, 440);
}

// 20. 1 ○ 2 ○ 3 ○ 4 ○ 5 ○ 6 = 1
function signPanel(visual) {
  const y = 44;
  let body = rect(4, 6, 512, 76, { stroke: UT.soft, fill: PAPER, width: 1.5, radius: 12 });
  visual.numbers.forEach((num, i) => {
    const x = 30 + i * 76;
    body += label(x, y, num, { size: 26, weight: 500 });
    if (i < visual.numbers.length - 1) body += `<circle cx="${x + 38}" cy="${y}" r="19" fill="#fff" stroke="${UT.box}" stroke-width="1.8"/>${visual.values?.[i] ? text(x + 38, y + 1, visual.values[i], { size: 24, weight: 800, fill: UT.red }) : ""}`;
  });
  body += label(448, y, "=", { size: 24, weight: 500 }) + label(484, y, visual.result, { size: 26, weight: 500 });
  return frame(520, 88, "+ 또는 -를 넣을 식", body, 470);
}

// 21. 5 4 3 2 1 = 69 / = 42
function joinPanels(visual) {
  const body = visual.rows.map((row, r) => {
    const y = 46 + r * 118;
    let s = label(22, y + 2, `(${r + 1})`, { size: 17 }) + rect(56, y - 34, 330, 68, { stroke: UT.soft, fill: PAPER, width: 1.5, radius: 12 });
    const xs = [104, 144, 184, 224, 264];
    s += row.digits.map((d, i) => label(xs[i], y, d, { size: 27, weight: 500 })).join("");
    (visual.values?.[r] || []).forEach((sign, i) => { if (sign) s += text(xs[i] + 20, y, sign, { size: 22, weight: 800, fill: UT.red }); });
    s += label(300, y, "=", { size: 25, weight: 500 }) + label(342, y, row.result, { size: 27, weight: 500 });
    return s;
  }).join("");
  return frame(400, 210, "수 사이에 + 또는 -를 넣을 식 두 개", body, 380);
}

// 22. 양팔 저울 세 개
function balances3() {
  const r = 13;
  const a = balance(132, 72, 80, 48, (x, y) => ball(x - 14, y - r, r) + ball(x + 14, y - r, r), (x, y) => [-28, 0, 28].map((dx) => block(x + dx, y - 14, 28)).join(""));
  const b = balance(392, 72, 80, 48, (x, y) => gem(x, y - 16), (x, y) => ball(x - 15, y - r, r) + block(x + 15, y - 14, 28));
  const c = balance(262, 214, 80, 48, (x, y) => star(x, y - 15), (x, y) => gem(x - 16, y - 16) + gem(x + 16, y - 16) + block(x, y - 46, 28));
  return frame(524, 264, "평형을 이룬 양팔 저울 세 개", a + b + c, 480);
}

// 23. 직사각형 색종이 → 접어서 자르기 → 펼친 정사각형
function foldCut(visual) {
  const v = visual.values || {};
  const paper = { stroke: UT.paperLine, fill: UT.paper };
  const blockArrow = (x, y) => `<path d="M${x} ${y - 5}H${x + 11}V${y - 10}L${x + 21} ${y}L${x + 11} ${y + 10}V${y + 5}H${x}Z" fill="${UT.cut}"/>`;
  const scissors = (x, y) => `<g transform="translate(${x} ${y})" stroke="${UT.ink}" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M-5 -13L4 5M5 -13L-4 5"/><circle cx="-5.5" cy="9" r="4" stroke="${UT.red}"/><circle cx="5.5" cy="9" r="4" stroke="${UT.red}"/></g>`;
  // 첫 그림: 처음 직사각형
  let body = rect(70, 49, 119, 89, paper);
  {
    const top = arc(70, 49, 189, 49, 14);
    body += top.path + answerBox(top.apex[0] - 19, top.apex[1] - 16, 38, 30, v.width) + label(top.apex[0] + 22, top.apex[1] + 1, "cm", { size: 19, anchor: "start" });
    const left = arc(70, 138, 70, 49, 14);
    body += left.path + answerBox(4, 78, 38, 30, v.height) + label(44, 93, "cm", { size: 19, anchor: "start" });
  }
  body += label(88, 172, "둘레 :", { size: 18 }) + answerBox(118, 156, 44, 32, v.perimeter, { radius: 7 }) + label(165, 172, "cm", { size: 18, anchor: "start" });
  body += blockArrow(205, 93);
  // 둘째 그림: 대각선으로 접은 모양(점선 = 접기 전 자리), 오른쪽 2cm 띠를 자른다
  body += seg(241, 49, 330, 49, { stroke: UT.crease, width: 1.2, dash: "4 3" }) + seg(241, 49, 241, 138, { stroke: UT.crease, width: 1.2, dash: "4 3" });
  body += rect(330, 49, 30, 89, paper);
  body += poly([[241, 138], [330, 49], [330, 138]], { stroke: UT.paperLine, fill: UT.yellow, width: 1.8 });
  body += `<path d="M270 87C282 76 300 82 302 101" fill="none" stroke="${UT.arrow}" stroke-width="1.8"/><path d="M296 98L302 108L307 97" fill="none" stroke="${UT.arrow}" stroke-width="1.8" stroke-linejoin="round"/>`;
  body += label(348, 34, "2cm", { size: 19 }) + scissors(330, 156);
  body += blockArrow(376, 93);
  // 셋째 그림: 펼친 정사각형
  body += rect(413, 49, 89, 89, paper) + seg(413, 138, 502, 49, { stroke: UT.crease, width: 1.2, dash: "4 3" });
  {
    const top = arc(413, 49, 502, 49, 14);
    body += top.path + answerBox(top.apex[0] - 19, top.apex[1] - 16, 38, 30, v.side) + label(top.apex[0] + 22, top.apex[1] + 1, "cm", { size: 19, anchor: "start" });
  }
  body += label(457, 168, "둘레 : 36cm", { size: 18 });
  return frame(530, 196, "직사각형 색종이를 접어 자르고 펼친 과정", body, 480);
}

// 24. 1,2,3,…,9,10,11,12,…, □
function digitRun(visual) {
  const body = rect(4, 6, 492, 78, { stroke: UT.soft, fill: PAPER, width: 1.5, radius: 12 })
    + `<text x="18" y="46" textLength="356" lengthAdjust="spacingAndGlyphs" dominant-baseline="central" style="font-size:27px;font-weight:500;fill:${UT.ink};dominant-baseline:central;letter-spacing:0"><tspan>1,2,3,4,5,6,7,8,9,</tspan><tspan style="fill:${UT.red}">10,11,12,…,</tspan></text>`
    + answerBox(386, 22, 92, 46, visual.values?.[0], { radius: 9, size: 22 });
  return frame(500, 90, "1부터 차례대로 쓴 자연수", body, 470);
}

const RENDER = {
  "midpoint-lines": midpointLines,
  "split-line": splitLine,
  ropes,
  "two-bars": twoBars,
  weights,
  "shape-equations": shapeEquations,
  "rect-rhombus": rectRhombus,
  "rect-triangle-square": rectTriangleSquare,
  "three-squares": threeSquares,
  "bent-shape": bentShape,
  "square-triangle-star": squareTriangleStar,
  "square-tiling": squareTiling,
  lines,
  "expression-line": expressionLine,
  "open-book": openBook,
  "sign-rows": signRows,
  "sign-panel": signPanel,
  "join-panels": joinPanels,
  balances3,
  "fold-cut": foldCut,
  "digit-run": digitRun,
  // 25번처럼 원문에 그림이 없는 문항(풀이 자리만)
  blank: () => `<div class="b6-ut-blank" aria-hidden="true" style="align-self:start;height:1px"></div>`
};

export function figure(visual) {
  const draw = visual && visual.kind === "book6-ut" ? RENDER[visual.type] : null;
  return draw ? draw(visual) : "";
}

const V = (type, extra = {}) => ({ kind: "book6-ut", type, ...extra });
const ORIGINALS = {
  1: { prompt: "다음 그림은 수직선에서 두 점 ㉠과 ㉡사이의 거리를 똑같은 간격으로 나눈 것입니다. ㉠과 ㉡의 중간에 있는 점(중점)을 구하시오.", visual: V("midpoint-lines", { parts: [{ left: 15, right: 23 }, { left: 32, right: 60 }] }), responseKind: "fill" },
  2: { prompt: "다음 그림은 수직선에서 두 점 ㉮와 ㉯ 사이의 거리는 똑같은 간격으로 8칸으로 나누고, 두 점 ㉯와 ㉰사이의 거리는 똑같은 간격으로 3칸으로 나눈 것입니다. 두 점 ㉠과 ㉡사이의 거리는 얼마입니까?", visual: V("split-line", { below: [{ at: 0, value: 32 }, { at: 8, value: 64 }, { at: 11, value: 82 }], points: [{ at: 4, name: "ㄱ" }, { at: 10, name: "ㄴ" }] }) },
  3: { prompt: "끈 ㉠, ㉡, ㉢이 있는데 ㉢의 길이는 ㉠에서 ㉡을 잘라낸 길이와 같습니다. 기현이의 키를 끈 ㉠으로 재면 3번이고, 끈 ㉡으로 재면 4번입니다. 기현이의 키를 끈 ㉢으로 재면 몇 번입니까?", visual: V("ropes") },
  4: { prompt: "다음 그림은 두 막대의 길이를 비교한 것입니다. 두 막대의 길이의 비를 구하고, 두 막대의 길이를 각각 구하시오.", visual: V("two-bars") },
  5: { prompt: "다음 그림은 평형을 이루고 있는 저울의 모습입니다. 각 모양의 무게를 각각 구하시오.", visual: V("weights") },
  6: { prompt: "다음 각 도형은 3, 4, 6, 7, 8 중에서 서로 다른 수를 나타냅니다. ✚이 나타내는 수는 얼마인지 구하시오.", visual: V("shape-equations", { cards: [3, 4, 6, 7, 8], rows: [
    ["diamond", "+", "diamond", "+", "diamond", "=", "square", "+", "square", "+", "square", "+", "square"],
    ["triangle", "+", "triangle", "+", "triangle", "=", "circle", "+", "circle", "+", "circle", "+", "circle"],
    ["diamond", "+", "triangle", "=", "circle", "+", "circle"],
    ["triangle", "+", "circle", "=", "cross", "+", "cross"]
  ] }) },
  7: { prompt: "둘레가 36cm인 직사각형과 마름모를 붙였더니 다음과 같은 모양이 되었습니다. 마름모의 한 변의 길이를 구하시오.", visual: V("rect-rhombus"), responseKind: "fill" },
  8: { prompt: "다음 그림은 직사각형, 정삼각형, 정사각형을 겹치지 않게 이어 붙여 만든 도형입니다. 이 도형의 둘레의 길이가 60cm일 때, 직사각형의 가로의 길이를 구하시오.", visual: V("rect-triangle-square"), responseKind: "fill" },
  9: { prompt: "다음 그림에서 ㉮, ㉯, ㉰는 모두 정사각형입니다. 색칠된 직사각형의 둘레는 몇 cm입니까?", visual: V("three-squares") },
  10: { prompt: "다음 직각으로 꺾인 도형의 둘레를 구하시오.", visual: V("bent-shape") },
  11: { prompt: "다음 도형에서 정삼각형과 정사각형의 한 변의 길이는 3cm로 모두 같습니다. 이 도형의 둘레는 몇 cm입니까?", visual: V("square-triangle-star") },
  12: { prompt: "정사각형을 여러 개 붙여 직사각형을 만들었습니다. 이 직사각형의 가로의 길이가 42cm일 때, 색칠된 정사각형의 둘레를 구하시오.", visual: V("square-tiling") },
  13: { prompt: "아래 식을 간편하게 계산하시오.", visual: V("expression-line", { expression: "445 + 555 + 667 + 333 + 221 + 779 + 886 + 114", length: 420 }) },
  14: { prompt: "1부터 차례 대로 수를 세었을 때, 다음 물음에 답하시오.", visual: V("lines", { lines: ["(1) 26은 몇 번째 짝수 입니까?", "(2) 47은 몇 번째 홀수 입니까?"] }) },
  15: { prompt: "책을 펼쳤더니 왼쪽 면과 오른쪽 면의 쪽수의 합이 89이였습니다. 펼쳐진 책의 왼쪽 면의 쪽수는 얼마입니까?", visual: V("open-book") },
  16: { prompt: "다음 주어진 수의 범위에서 수의 개수와 숫자의 개수를 각각 구하시오.", visual: V("lines", { lines: ["(1) 3~37", "(2) 22~89"] }) },
  17: { prompt: "다음 연속수의 합을 구하시오.", visual: V("lines", { lines: ["(1) 8+9+10+11+12+13+14+15", "(2) 1+2+3+…+59+60"] }) },
  18: { prompt: "다음 연속수의 합을 구하시오.", visual: V("lines", { lines: ["(1) 5+6+7+8+9+10+11", "(2) 1+2+…+18+19"] }) },
  19: { prompt: "다음 식의 ○ 안에 + 또는 -를 넣어 등식이 성립하도록 만드시오.", visual: V("sign-rows", { rows: [16, 8, 4].map((result) => ({ numbers: [8, 6, 4, 2], result })) }), responseKind: "fill" },
  20: { prompt: "다음 식의 ○ 안에 + 또는 -를 넣어 등식이 성립하도록 만드시오.", visual: V("sign-panel", { numbers: [1, 2, 3, 4, 5, 6], result: 1 }), responseKind: "fill" },
  21: { prompt: "다음 등식이 성립하도록 수 사이에 + 또는 -를 알맞게 써넣으시오. (단, 수 사이에 항상 + 또는 -가 들어갈 필요는 없습니다.)", visual: V("join-panels", { rows: [69, 42].map((result) => ({ digits: [5, 4, 3, 2, 1], result })) }), responseKind: "fill" },
  22: { prompt: "다음 그림의 양팔 저울은 모두 평형을 이루고 있습니다. ★ 1개는 ■ 몇 개의 무게와 같은지 구하시오.", visual: V("balances3") },
  23: { prompt: "직사각형 모양의 색종이를 그림과 같이 접어서 자른 후 펼쳤습니다. 펼친 도형의 네 변의 길이의 합이 36cm일 때, 빈 칸에 알맞은 수를 써 넣고, 처음 직사각형의 둘레를 구하시오.", visual: V("fold-cut"), responseKind: "fill" },
  24: { prompt: "다음과 같이 1부터 차례대로 자연수를 나열하였더니 모든 숫자의 개수가 55개였습니다. 마지막 수를 구하시오.", visual: V("digit-run"), responseKind: "fill" },
  25: { prompt: "끈 ㉠, ㉡, ㉢이 있는데 ㉢의 길이는 ㉠에서 ㉡을 잘라낸 길이와 같습니다. 책상의 가로를 끈 ㉠으로 재면 6번이고, 끈 ㉡으로 재면 9번입니다. 책상의 가로를 끈 ㉢으로 재면 몇 번입니까?", visual: V("blank") }
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const item = ORIGINALS[Number(number)];
  return item ? { number: Number(number), ...item, visual: JSON.parse(JSON.stringify(item.visual)) } : null;
}
