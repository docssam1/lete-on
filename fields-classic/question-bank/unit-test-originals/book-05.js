// 5권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문제 글·수·배치는 원문 그대로, 그림은 우리 색표(.claude/skills/golden-bell-figure-style)로 새로 그렸다.
// 정답은 두지 않는다 — 정답은 비공개 DB(unit-test-answers)에만 있다. 그림 함수가 values 를 받는 것은 답안지 그림용일 뿐이다.
// 원문 글 속 도형 그림(오각형·십자 모양)은 글꼴에 없어 낱말로 바꿔 적었다(13·14·15번).
import { UT, esc, text, svg, box, line, cardsRow } from "./kit.js?v=20261028ze";

// 도형 색(색표: ○ 빨강 · △ 초록 · □ 파랑 · ◇ 보라 · ⬠ 주황 · 십자 노랑)
const SHAPE = Object.freeze({
  circle: [UT.red, UT.redSoft], triangle: [UT.green, UT.greenSoft], square: [UT.blue, UT.blueSoft],
  diamond: [UT.purple, UT.purpleSoft], pentagon: [UT.orange, UT.orangeSoft], cross: ["#d9a400", "#fff3c4"]
});
const SUNDAY = UT.red;
const GRID = UT.box;
const ROUTE = "#7a6f5c";
const pts = (list) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function shape(kind, cx, cy, s = 40, value = null) {
  const [stroke, fill] = SHAPE[kind];
  const h = s / 2;
  const style = `fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"`;
  let body;
  if (kind === "circle") body = `<circle cx="${cx}" cy="${cy}" r="${h}" ${style}/>`;
  else if (kind === "square") body = `<rect x="${cx - h}" y="${cy - h}" width="${s}" height="${s}" rx="2" ${style}/>`;
  else if (kind === "diamond") body = `<polygon points="${pts([[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]])}" ${style}/>`;
  else if (kind === "triangle") body = `<polygon points="${pts([[cx, cy - h], [cx + h, cy + h * 0.86], [cx - h, cy + h * 0.86]])}" ${style}/>`;
  else if (kind === "pentagon") {
    const r = h * 1.04;
    body = `<polygon points="${pts(Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [cx + Math.cos(a) * r, cy + 2 + Math.sin(a) * r]; }))}" ${style}/>`;
  } else {
    const a = h * 0.42;
    body = `<polygon points="${pts([[cx - a, cy - h], [cx + a, cy - h], [cx + a, cy - a], [cx + h, cy - a], [cx + h, cy + a], [cx + a, cy + a], [cx + a, cy + h], [cx - a, cy + h], [cx - a, cy + a], [cx - h, cy + a], [cx - h, cy - a], [cx - a, cy - a]])}" ${style}/>`;
  }
  return body + (value == null ? "" : text(cx, cy + (kind === "triangle" ? 5 : 1), value, { size: s * 0.45 }));
}

// 작은 원 속 글자(㉠·① 같은 표지 — 글꼴에 기대지 않고 직접 그린다)
const ringed = (cx, cy, value, { r = 11, size = 13, fill = "#fff" } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${UT.ink}" stroke-width="1.4"/>${text(cx, cy + 0.5, value, { size, weight: 700 })}`;

// 아래에 (1)(2) 물음이 붙는 문항: 그림은 남는 높이만큼, 물음마다 오른쪽에 답 칸
function withSubs(figure, subs) {
  const fitted = figure.replace("height:auto;", "height:auto;max-height:calc(100cqh - 92px);");
  const font = "font-family:'FC Serif',serif;font-size:clamp(12px,3.9cqw,15px);line-height:1.5;color:#191511;word-break:keep-all";
  const rows = subs.map((sub) => `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 10px"><p style="margin:0;${font}">${esc(sub)}</p><span style="margin-left:auto;${font};font-weight:600;white-space:nowrap">답 (<i style="display:inline-block;width:5.5em"></i>)</span></div>`).join("");
  return `<div style="display:flex;flex-direction:column;gap:12px;width:100%;height:100%;min-height:0">${fitted}<div style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:14px">${rows}</div></div>`;
}

// ── 1. 수 배열표(7칸씩)
function arrayTable(v) {
  const c = 44, ox = 4, oy = 4;
  let body = "";
  for (let r = 0; r < 7; r += 1) for (let k = 0; k < 7; k += 1) {
    const mark = v.marks.find((m) => m.row === r && m.col === k);
    body += `<rect x="${ox + k * c}" y="${oy + r * c}" width="${c}" height="${c}" fill="${mark ? UT.card : "#fff"}" stroke="${GRID}" stroke-width="1.4"/>`;
    const value = v.values?.[r]?.[k];
    if (value != null) body += text(ox + k * c + c / 2, oy + r * c + c / 2 + 1, value, { size: 18, weight: 600 });
    if (mark) body += ringed(ox + k * c + c / 2, oy + r * c + c / 2, mark.label);
  }
  return svg(7 * c + 8, 7 * c + 8, "7칸씩 수를 늘어놓은 수 배열표", body, 300);
}

// ── 2. 원 둘레 다섯 줄에 수 늘어놓기
function fiveRays(v) {
  const cx = 230, cy = 232, R = 58;
  let body = `<rect x="3" y="3" width="454" height="440" rx="26" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.6"/>`;
  body += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${UT.yellowSoft}" stroke="${UT.cardLine}" stroke-width="1.6"/>`;
  v.rays.forEach((ray, index) => {
    const a = (-90 + index * 72) * Math.PI / 180;
    const dx = Math.cos(a), dy = Math.sin(a);
    const [sx, sy] = [cx + dx * R, cy + dy * R];
    const length = [152, 166, 184, 184, 166][index];
    body += line(sx, sy, sx + dx * length, sy + dy * length, { stroke: UT.ink, width: 1.4 });
    const [px, py] = ray.side > 0 ? [-dy, dx] : [dy, -dx];
    ray.numbers.forEach((n, i) => {
      const d = 28 + i * 30;
      body += text(+(sx + dx * d + px * 16).toFixed(1), +(sy + dy * d + py * 16).toFixed(1), n, { size: 20, weight: 600 });
    });
    for (let i = 0; i < 3; i += 1) {
      const d = 28 + ray.numbers.length * 30 - 6 + i * 6;
      body += `<circle cx="${(sx + dx * d + px * 16).toFixed(1)}" cy="${(sy + dy * d + py * 16).toFixed(1)}" r="1.7" fill="${UT.ink}"/>`;
    }
    body += ringed(+sx.toFixed(1), +sy.toFixed(1), index + 1, { r: 14, size: 16, fill: "#fff" });
  });
  return svg(460, 446, "원 둘레의 다섯 줄에 1부터 차례로 수를 늘어놓은 그림", body, 340);
}

// ── 3·4·5·21. 달력
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
function calendar(v) {
  const cw = 52, ch = v.rowHeight || 48, ox = 4;
  let y = 4, body = "";
  const width = 7 * cw;
  if (v.title) {
    body += `<rect x="${ox}" y="${y}" width="${width}" height="${ch}" fill="#fff" stroke="${GRID}" stroke-width="1.4"/>${text(ox + width / 2, y + ch / 2 + 1, v.title, { size: 20, weight: 700 })}`;
    y += ch;
  }
  DAYS.forEach((day, k) => {
    body += `<rect x="${ox + k * cw}" y="${y}" width="${cw}" height="${ch}" fill="${UT.purpleSoft}" stroke="${GRID}" stroke-width="1.4"/>${text(ox + k * cw + cw / 2, y + ch / 2 + 1, day, { size: 19, weight: 700, fill: k === 0 ? SUNDAY : UT.ink })}`;
  });
  y += ch;
  for (let r = 0; r < v.rows; r += 1) for (let k = 0; k < 7; k += 1) {
    const shaded = v.shade?.some(([row, col]) => row === r && col === k);
    body += `<rect x="${ox + k * cw}" y="${y + r * ch}" width="${cw}" height="${ch}" fill="${shaded ? UT.card : "#fff"}" stroke="${GRID}" stroke-width="1.4"/>`;
    const value = v.dates?.find(([row, col]) => row === r && col === k)?.[2];
    if (value != null) body += text(ox + k * cw + cw / 2, y + r * ch + ch / 2 + 1, value, { size: 20, weight: 600, fill: k === 0 ? SUNDAY : UT.ink });
  }
  return svg(width + 8, y + v.rows * ch + 4, v.label, body, 330);
}

// ── 6·7·8. 최단거리 길
function routeGrid(v) {
  const c = v.cell, ox = v.pad[0], oy = v.pad[1];
  const W = v.columns * c, H = v.rows * c;
  let body = "";
  for (let k = 0; k <= v.columns; k += 1) body += line(ox + k * c, oy, ox + k * c, oy + H, { stroke: ROUTE, width: 1.6 });
  for (let r = 0; r <= v.rows; r += 1) body += line(ox, oy + r * c, ox + W, oy + r * c, { stroke: ROUTE, width: 1.6 });
  for (const [k1, r1, k2, r2] of v.diagonals || []) body += line(ox + k1 * c, oy + r1 * c, ox + k2 * c, oy + r2 * c, { stroke: ROUTE, width: 1.6 });
  if (v.dots) for (let k = 0; k <= v.columns; k += 1) for (let r = 0; r <= v.rows; r += 1) body += `<circle cx="${ox + k * c}" cy="${oy + r * c}" r="5" fill="${UT.dot}"/>`;
  for (const mark of v.marks) body += text(ox + mark.col * c + mark.dx, oy + mark.row * c + mark.dy, mark.text, { size: 20, weight: 600 });
  return svg(W + v.pad[0] + v.pad[2], H + v.pad[1] + v.pad[3], v.label, body, v.max || 330);
}

// ── 9·13·14·15·18. 숫자 카드 줄
const cards = (list, size = 40) => {
  const width = list.length * (size + 6) + 4;
  return { width, body: cardsRow(list, width, 4, size).replace(/font-size:15px/g, `font-size:${Math.round(size * 0.5)}px`) };
};
function cardLine(v) {
  const { width, body } = cards(v.cards, 40);
  return svg(width, 50, "숫자 카드", body, Math.min(width, 330));
}

// ── 11. 사각형 둘레의 곱(○ 네 개 · □ 네 개)
function productSquare(v) {
  const P = [[54, 54], [274, 54], [54, 274], [274, 274]];
  const Q = [[164, 54], [54, 164], [274, 164], [164, 274]];
  let body = [[0, 1], [0, 2], [1, 3], [2, 3]].map(([a, b]) => line(P[a][0], P[a][1], P[b][0], P[b][1], { stroke: UT.ink, width: 1.4 })).join("");
  body += Q.map(([x, y], i) => `${box(x - 32, y - 32, 64, 64, { fill: UT.blueSoft, stroke: UT.blue, width: 2, radius: 2 })}${text(x, y + 1, v.products[i], { size: 26, weight: 600 })}`).join("");
  body += P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="33" fill="#fff" stroke="${UT.red}" stroke-width="2"/>${v.values?.[i] == null ? "" : text(x, y + 1, v.values[i], { size: 26, weight: 600 })}`).join("");
  return svg(328, 328, "네모 안의 수는 양쪽 동그라미 안 두 수의 곱", body, 270);
}

// ── 12·22. 곱셈 매트릭스(4×4, 오른쪽·아래 곱)
function productMatrix(v) {
  const c = 62, ox = 6;
  let y = 6, body = "";
  if (v.pool) {
    body += box(ox + 4, y, 4 * c - 8, 40, { fill: "#fdfbf5", stroke: UT.soft, width: 1.6, radius: 4 }) + text(ox + 2 * c, y + 21, v.pool, { size: 19, weight: 800 });
    y += 58;
  }
  for (let r = 0; r < 4; r += 1) for (let k = 0; k < 4; k += 1) {
    const shaded = v.shade?.some(([row, col]) => row === r && col === k);
    body += `<rect x="${ox + k * c}" y="${y + r * c}" width="${c}" height="${c}" fill="${shaded ? UT.orangeSoft : "#fff"}" stroke="${GRID}" stroke-width="1.5"/>`;
    const value = v.values?.[r]?.[k];
    if (value != null) body += text(ox + k * c + c / 2, y + r * c + c / 2 + 1, value, { size: 24, weight: 600 });
  }
  v.right.forEach((n, r) => { body += text(ox + 4 * c + 12, y + r * c + c / 2 + 1, n, { size: 24, weight: 500, anchor: "start" }); });
  v.bottom.forEach((n, k) => { body += text(ox + k * c + c / 2, y + 4 * c + 26, n, { size: 24, weight: 500 }); });
  return svg(ox + 4 * c + 60, y + 4 * c + 46, v.label, body, 300);
}

// ── 13·15. 도형 식 판
const OP_GAP = 34;
function equationPanel(v) {
  const s = 40, rowH = 62;
  const top = v.cards ? 58 : 6;
  const cols = Math.max(...v.rows.map((row) => row.length));
  const contentW = Math.ceil(cols / 2) * s + Math.floor(cols / 2) * OP_GAP;
  const panelW = contentW + 56;
  const width = Math.max(panelW + 8, v.cards ? v.cards.length * 46 + 8 : 0);
  const px = (width - panelW) / 2;
  let body = v.cards ? cards(v.cards, 40).body.replace(/<rect x="([\d.]+)"/g, (m, x) => `<rect x="${(+x + (width - (v.cards.length * 46 + 4)) / 2).toFixed(1)}"`).replace(/<text x="([\d.]+)"/g, (m, x) => `<text x="${(+x + (width - (v.cards.length * 46 + 4)) / 2).toFixed(1)}"`) : "";
  const panelH = v.rows.length * rowH + 24;
  body += `<rect x="${px}" y="${top}" width="${panelW}" height="${panelH}" rx="18" fill="#fff4c2" stroke="${UT.orange}" stroke-width="1.6"/>`;
  v.rows.forEach((row, r) => {
    let x = px + 28;
    const cy = top + 12 + r * rowH + rowH / 2;
    row.forEach((item, i) => {
      if (i % 2 === 0) { body += shape(item, x + s / 2, cy, s); x += s; }
      else { body += text(x + OP_GAP / 2, cy + 1, item, { size: 22, weight: 700 }); x += OP_GAP; }
    });
  });
  return svg(width, top + panelH + 4, v.label, body, v.max || 300);
}

// ── 14. 가로·세로 도형 식
function crossEquations(v) {
  const top = 58, s = 50, X = [40, 140, 240], Y = [top + 30, top + 84, top + 138, top + 192, top + 246];
  const width = 6 * 46 + 4;
  let body = cards(v.cards, 40).body;
  const ox = (width - 280) / 2;
  const at = (k) => ox + X[k];
  body += shape(v.grid[0][0], at(0), Y[0], s) + text(at(0) + 50, Y[0] + 1, "×", { size: 22 }) + shape(v.grid[0][1], at(1), Y[0], s) + text(at(1) + 50, Y[0] + 1, "=", { size: 22 }) + shape(v.grid[0][2], at(2), Y[0], s);
  body += text(at(0), Y[1], "+", { size: 22 }) + text(at(2), Y[1], "+", { size: 22 });
  body += shape(v.grid[1][0], at(0), Y[2], s) + shape(v.grid[1][2], at(2), Y[2], s);
  body += `<g transform="translate(${at(0)} ${Y[3]}) rotate(90)">${text(0, 0, "=", { size: 22 })}</g><g transform="translate(${at(2)} ${Y[3]}) rotate(90)">${text(0, 0, "=", { size: 22 })}</g>`;
  body += shape(v.grid[2][0], at(0), Y[4], s) + text(at(0) + 50, Y[4] + 1, "×", { size: 22 }) + shape(v.grid[2][1], at(1), Y[4], s) + text(at(1) + 50, Y[4] + 1, "=", { size: 22 }) + shape(v.grid[2][2], at(2), Y[4], s);
  return svg(width, Y[4] + 34, "가로와 세로로 놓인 도형 식 네 개", body, 260);
}

// ── 19. 색종이 계단 모양
function stairShapes(v) {
  const u = 22, gap = 14, base = 108;
  let x = 4, body = "";
  v.stages.forEach((n, index) => {
    const widest = 2 * n - 1;
    const slot = Math.max(widest * u, 70);
    for (let r = 0; r < n; r += 1) {
      const count = 2 * (n - r) - 1;
      const start = x + (slot - count * u) / 2;
      for (let k = 0; k < count; k += 1) body += `<rect x="${start + k * u}" y="${base - (r + 1) * u}" width="${u}" height="${u}" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.3"/>`;
    }
    body += text(x + slot / 2, base + 24, v.labels[index], { size: 16, weight: 600 });
    x += slot + gap;
  });
  body += text(x - 8, base - v.stages.at(-1) * u + 10, "…", { size: 18, anchor: "start" });
  return svg(x + 14, base + 40, "작은 정사각형 색종이로 만든 계단 모양", body, 470);
}

// ── 20. 수 피라미드(줄마다 2칸씩 늘어남)
function numberPyramid(v) {
  const c = 40, rows = v.rows.length, widest = 2 * rows - 1, ox = 4, oy = 4;
  let body = "";
  v.rows.forEach((row, r) => {
    const count = 2 * r + 1;
    const start = ox + (widest - count) / 2 * c;
    for (let k = 0; k < count; k += 1) {
      body += `<rect x="${start + k * c}" y="${oy + r * c}" width="${c}" height="${c}" fill="#fff" stroke="${GRID}" stroke-width="1.4"/>`;
      if (row[k] != null) body += text(start + k * c + c / 2, oy + r * c + c / 2 + 1, row[k], { size: 20, weight: 600 });
    }
  });
  const cx = ox + widest * c / 2;
  body += [0, 1, 2].map((i) => `<circle cx="${cx}" cy="${oy + rows * c + 26 + i * 8}" r="1.8" fill="${UT.ink}"/>`).join("");
  return svg(widest * c + 8, rows * c + 54, "줄마다 두 칸씩 늘어나는 수 피라미드", body, 330);
}

// ── 23. 작은 정삼각형으로 나눈 큰 정삼각형
function triangleGrid(v) {
  const n = v.size, side = 200, h = side * Math.sqrt(3) / 2, ox = 10, oy = 10;
  const A = [ox + side / 2, oy], B = [ox, oy + h], C = [ox + side, oy + h];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  let body = `<polygon points="${pts([A, B, C])}" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.8" stroke-linejoin="round"/>`;
  for (let i = 1; i < n; i += 1) {
    const t = i / n;
    for (const [p, q] of [[lerp(A, B, t), lerp(A, C, t)], [lerp(B, A, t), lerp(B, C, t)], [lerp(C, A, t), lerp(C, B, t)]]) body += line(p[0], p[1], q[0], q[1], { stroke: UT.green, width: 1.5 });
  }
  return svg(side + 20, h + 20, "큰 정삼각형을 작은 정삼각형으로 나눈 그림", body, 210);
}

// ── 25. 바둑돌 모양(검은 테두리 · 흰 속)
function stonePattern(v) {
  const step = 20, r = 9, base = 132;
  let x = 8, body = "";
  v.stages.forEach((n, index) => {
    const size = n + 2;
    for (let row = 0; row < size; row += 1) for (let col = 0; col < size; col += 1) {
      const inner = row > 0 && col > 0 && row < size - 1 && col < size - 1;
      body += `<circle cx="${x + col * step + step / 2}" cy="${base - (size - row) * step + step / 2}" r="${r}" fill="${inner ? "#fff" : "#1d1d1d"}" stroke="${inner ? "#8a8a8a" : "#1d1d1d"}" stroke-width="1.2"/>`;
    }
    body += text(x + size * step / 2, base + 20, `<${index + 1}>`, { size: 15, weight: 600 });
    x += size * step + 16;
  });
  body += text(x - 10, base - 3 * step, "…", { size: 18, anchor: "start" });
  return svg(x + 16, base + 34, "바둑돌을 늘어놓은 모양", body, 470);
}

const BLANK = `<div class="b5-ut-blank" aria-hidden="true" style="min-height:8px"></div>`;
const DRAW = { arrayTable, fiveRays, calendar, routeGrid, cardLine, productSquare, productMatrix, equationPanel, crossEquations, stairShapes, numberPyramid, triangleGrid, stonePattern };

export function figure(visual) {
  if (!visual || visual.kind !== "b5") return "";
  if (visual.type === "blank") return BLANK;
  const draw = DRAW[visual.type];
  if (!draw) return "";
  const markup = draw(visual);
  if (visual.subs?.length) return withSubs(markup, visual.subs);
  // 원문처럼 문제 바로 아래에 붙는 그림(카드 줄·작은 그림)
  return visual.top ? `<div style="align-self:start;width:100%;padding-top:6px">${markup}</div>` : markup;
}

const v = (type, extra = {}) => ({ kind: "b5", type, ...extra });
const MONTH_HEAD = (n) => `${n}월`;
const ORIGINALS = {
  1: { prompt: "다음 수 배열표의 규칙을 찾아 ㉠과 ㉡에 들어갈 수의 합을 구하시오.",
    visual: v("arrayTable", { values: [[1, 2, 3], [8, 9, 10], [15, 16, 17]], marks: [{ row: 4, col: 4, label: "ㄴ" }, { row: 6, col: 0, label: "ㄱ" }] }) },
  2: { prompt: "다음 그림과 같은 규칙으로 1부터 차례로 수를 나열하였습니다. ①번 줄의 4번째 수는 16이고, 18은 ③번 줄의 4번째 수입니다. 물음에 답하시오.",
    visual: v("fiveRays", { rays: [{ numbers: [1, 6, 11, 16], side: 1 }, { numbers: [2, 7, 12, 17], side: -1 }, { numbers: [3, 8, 13, 18], side: -1 }, { numbers: [4, 9, 14, 19], side: 1 }, { numbers: [5, 10, 15, 20], side: 1 }],
      subs: ["(1) ②번 줄의 7번째 수를 구하시오.", "(2) 31은 몇 번 줄의 몇 번째 수인지 구하시오."] }),
    responseKind: "fill" },
  3: { prompt: "다음은 어느 해 7월의 달력입니다. 물음에 답하시오.",
    visual: v("calendar", { label: "7월 달력", rows: 5, dates: [[1, 0, 4], [1, 1, 5], [1, 2, 6]], subs: ["(1) 7월의 금요일 날짜를 모두 쓰시오.", "(2) 7월의 4번째 목요일은 며칠입니까?"] }),
    responseKind: "fill" },
  4: { prompt: "어느 해 식목일(4월 5일)은 화요일이라고 합니다. 같은 해 어버이날(5월 8일)은 무슨 요일입니까? (4월은 30일까지 있습니다.)",
    visual: v("calendar", { label: "4월 달력", title: MONTH_HEAD(4), rows: 5, dates: [[1, 2, 5]], shade: [[1, 2]] }) },
  5: { prompt: "어느 해 12월의 두 번째 목요일 날짜와 세 번째 목요일 날짜를 더하면 25일입니다. 그 다음 해 1월 1일은 무슨 요일인지 구하시오. (12월은 31일까지 있습니다.)",
    visual: v("calendar", { label: "12월 달력", title: MONTH_HEAD(12), rows: 5, rowHeight: 44, shade: [[1, 4], [2, 4]] }) },
  6: { prompt: "다음 그림을 보고 시작점부터 끝점까지 최단거리로 갈 수 있는 방법의 가짓수를 구하시오.",
    visual: v("routeGrid", { label: "가로세로 세 칸씩인 길", columns: 3, rows: 3, cell: 84, pad: [52, 14, 44, 14], dots: true,
      marks: [{ col: 0, row: 3, dx: -30, dy: 4, text: "시작" }, { col: 3, row: 0, dx: 22, dy: 0, text: "끝" }], max: 300 }) },
  7: { prompt: "다음 그림에서 A에서 B를 들렀다 C까지 가는 길의 최단거리의 가짓수를 구하시오.",
    visual: v("routeGrid", { label: "가로 다섯 칸 세로 네 칸인 길", columns: 5, rows: 4, cell: 62, pad: [10, 26, 26, 26],
      marks: [{ col: 0, row: 0, dx: -2, dy: -14, text: "A" }, { col: 3, row: 2, dx: 15, dy: 18, text: "B" }, { col: 5, row: 4, dx: 12, dy: 15, text: "C" }], max: 340 }) },
  8: { prompt: "다음 그림에서 A에서 B까지 가는 길의 최단거리의 가짓수를 구하시오.",
    visual: v("routeGrid", { label: "가로 네 칸 세로 세 칸인 길, 한 칸에 대각선", columns: 4, rows: 3, cell: 72, pad: [26, 14, 30, 30], diagonals: [[2, 2, 3, 1]],
      marks: [{ col: 0, row: 3, dx: -14, dy: 14, text: "A" }, { col: 4, row: 0, dx: 18, dy: 6, text: "B" }], max: 330 }) },
  9: { prompt: "다음 4장의 숫자 카드 중에서 서로 다른 세 장으로 세 자리 수를 작은 수부터 차례대로 만들 때, 5번째 작은 수를 구하시오.",
    visual: v("cardLine", { cards: [0, 2, 4, 6], top: true }) },
  10: { prompt: "십의 자리 숫자와 일의 자리 숫자의 합이 14인 두 자리 수를 작은 수부터 차례대로 만들 때, 4번째로 작은 수를 구하시오.", visual: v("blank") },
  11: { prompt: "아래 사각형 모양의 그림에서 ○안의 수는 2에서 9까지의 자연수이고, □안의 수는 양쪽의 ○안에 있는 두 수의 곱입니다. 같은 방법으로 아래 그림의 ○안에 알맞은 수를 써 넣으시오.",
    visual: v("productSquare", { products: [56, 40, 42, 30] }), responseKind: "fill" },
  12: { prompt: "다음 그림의 색칠된 빈칸에 주어진 수를 한 번씩 넣어 한 줄 위의 곱이 오른쪽과 아래의 수가 되도록 만들어 보시오.",
    visual: v("productMatrix", { label: "색칠된 칸에 수를 넣는 곱셈 표", pool: "2, 3, 4, 5, 6, 7, 8, 9", shade: [[0, 0], [0, 3], [1, 1], [1, 2], [2, 1], [2, 2], [3, 0], [3, 3]], right: [6, 45, 24, 56], bottom: [16, 54, 20, 21] }),
    responseKind: "fill" },
  13: { prompt: "다음 식에서 각 도형은 0에서 4까지 서로 다른 수를 나타냅니다. 오각형이 나타내는 수를 구하시오.",
    visual: v("equationPanel", { label: "도형 식 네 개", cards: [0, 1, 2, 3, 4], rows: [["diamond", "×", "diamond", "=", "cross"], ["diamond", "×", "square", "=", "diamond"], ["cross", "+", "circle", "=", "cross"], ["square", "+", "diamond", "=", "pentagon"]], max: 250 }) },
  14: { prompt: "다음은 4개의 식을 가로, 세로로 나타낸 것입니다. 각 도형은 1, 2, 3, 4, 5, 9 중에서 서로 다른 수를 나타냅니다. 오각형이 나타내는 수를 구하시오.",
    visual: v("crossEquations", { cards: [1, 2, 3, 4, 5, 9], grid: [["circle", "circle", "square"], ["diamond", null, "pentagon"], ["triangle", "triangle", "cross"]] }) },
  15: { prompt: "다음 각 도형은 2, 3, 4, 6, 8, 9 중에서 서로 다른 수를 나타냅니다. 각 도형이 나타내는 수를 빈 칸에 써 넣고, 십자 모양이 나타내는 수를 구하시오.",
    visual: v("equationPanel", { label: "도형 식 네 개", cards: [2, 3, 4, 6, 8, 9], rows: [["diamond", "×", "diamond", "=", "square"], ["square", "×", "square", "=", "diamond", "×", "circle"], ["pentagon", "×", "pentagon", "=", "triangle"], ["cross", "×", "cross", "=", "square", "×", "triangle"]], max: 300 }) },
  16: { prompt: "주한이는 5명의 친구 범규, 서윤, 주원, 지민, 하연이 중에서 2명과 같이 놀이터에 가려고 합니다. 5명 중에서 놀이터에 같이 갈 친구 2명을 선택하는 방법은 모두 몇 가지입니까?", visual: v("blank") },
  17: { prompt: "유준이네 모둠 학생들이 처음 만나 서로 한 번씩 악수를 하였습니다. 모든 사람들이 악수한 횟수를 세어 보았더니 36번이었습니다. 유준이네 모둠 학생들은 모두 몇 명입니까?", visual: v("blank") },
  18: { prompt: "다음 7장의 숫자 카드 중에서 서로 다른 2장을 뽑는 방법은 모두 몇 가지입니까? (단, 1, 2를 뽑는 방법과 2, 1을 뽑는 방법은 같은 방법입니다.)",
    visual: v("cardLine", { cards: [1, 2, 3, 4, 5, 6, 7], top: true }) },
  19: { prompt: "작은 정사각형 색종이를 이어 붙여 다음 모양을 만들어 나갈 때, 7번째 모양에는 작은 정사각형 색종이가 몇 장 필요합니까?",
    visual: v("stairShapes", { stages: [1, 2, 3, 4], labels: ["첫 번째", "두 번째", "세 번째", "네 번째"], top: true }) },
  20: { prompt: "다음과 같은 규칙으로 수를 늘어놓았을 때, 물음에 답하시오.",
    visual: v("numberPyramid", { rows: [[1], [2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14, 15, 16], []], subs: ["(1) 5번째 줄의 마지막에 있는 수를 구하시오.", "(2) 7번째 줄의 첫번째 수를 구하시오."] }),
    responseKind: "fill" },
  21: { prompt: "어느 해 5월의 두 번째 화요일 날짜와 네 번째 화요일 날짜를 더하면 34일입니다. 같은 해의 현충일(6월 6일)은 무슨 요일인지 구하시오. (5월은 31일까지 있습니다.)",
    visual: v("calendar", { label: "5월 달력", title: MONTH_HEAD(5), rows: 5, rowHeight: 44, shade: [[1, 2], [3, 2]] }) },
  22: { prompt: "다음은 2에서 9까지의 수를 한 번씩 넣어 만든 곱셈 매트릭스입니다. 각 줄에 수를 두 개씩 넣어 가로줄에 있는 두 수의 곱은 오른쪽, 세로줄에 있는 두 수의 곱은 아래에 있는 수가 되도록 매트릭스를 완성하시오.",
    visual: v("productMatrix", { label: "곱셈 매트릭스", right: [30, 32, 27, 14], bottom: [63, 20, 16, 18] }), responseKind: "fill" },
  23: { prompt: "다음 그림은 큰 정삼각형을 작은 정삼각형으로 나눈 것입니다. 그림에서 찾을 수 있는 크고 작은 정삼각형의 개수를 모두 구하시오.",
    visual: v("triangleGrid", { size: 4, top: true }) },
  24: { prompt: "십의 자리 숫자와 일의 자리 숫자의 차가 4인 두 자리 수를 작은 수부터 차례대로 나열할 때, 6번째로 작은 수를 구하시오.", visual: v("blank") },
  25: { prompt: "다음과 같은 모양으로 바둑돌을 늘어놓을 때, 7번째 모양에서는 어떤 색깔의 바둑돌이 몇 개 더 많은지 구하시오.",
    visual: v("stonePattern", { stages: [1, 2, 3, 4], top: true }) }
};

export const numbers = Object.freeze(Object.keys(ORIGINALS).map(Number));
export function get(number) {
  const item = ORIGINALS[Number(number)];
  return item ? { number: Number(number), ...item, visual: structuredClone(item.visual) } : null;
}
