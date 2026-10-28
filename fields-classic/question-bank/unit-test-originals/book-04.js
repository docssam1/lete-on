// 4권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문장·수·이름·배치·놓인 방향은 원문 그대로, 그림은 우리 색표(.claude/skills/golden-bell-figure-style)로 새로 그린다.
// 정답은 두지 않는다 — 원문 풀기 화면은 「답안 확인 및 진단하기」에서 비공개 DB의 정답을 받아 온다.
import { UT, esc, text, svg, box, line, conditionsBox } from "./kit.js?v=20261028ze";

// ── 공용 ────────────────────────────────────────────────────────────────
const P = (points) => points.map(([x, y]) => `${(+x).toFixed(1)},${(+y).toFixed(1)}`).join(" ");
const poly = (points, fill, stroke, width = 1.4, extra = "") => `<polygon points="${P(points)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"${extra}/>`;
const rect = (x, y, w, h, fill, stroke, width = 1.4, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"${extra}/>`;
const PAPER = { fill: UT.paper, line: UT.paperLine, grid: UT.grid };
// 모양 토큰(저울·관계식) — 같은 모양은 어디서나 같은 색
const SHAPE = {
  circle: { color: "#e8503a", edge: "#b8321f", soft: "#ffe1dc" },
  square: { color: "#2f6fe0", edge: "#1f4fb0", soft: "#dde9ff" },
  diamond: { color: "#8e5bd8", edge: "#6a3bb0", soft: "#ece0fb" },
  star: { color: "#f0b23a", edge: "#a8741a", soft: "#fff3c4" },
  triangle: { color: "#2f9e5f", edge: "#1f7a45", soft: "#dcf5e5" }
};
function starPoints(cx, cy, r) {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 ? r * 0.45 : r;
    const angle = -Math.PI / 2 + index * Math.PI / 5;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
}
// filled: 저울 위 토큰(꽉 찬 색) · 아니면 연한 바탕 + 색 선(관계식)
function token(kind, cx, cy, size, filled = true) {
  const c = SHAPE[kind];
  const fill = filled ? c.color : c.soft;
  const stroke = filled ? c.edge : c.color;
  const h = size / 2;
  if (kind === "circle") return `<circle cx="${cx}" cy="${cy}" r="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
  if (kind === "square") return rect(cx - h * 0.9, cy - h * 0.9, h * 1.8, h * 1.8, fill, stroke, 1.6);
  if (kind === "diamond") return poly([[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]], fill, stroke, 1.6);
  if (kind === "triangle") return poly([[cx, cy - h], [cx + h, cy + h * 0.8], [cx - h, cy + h * 0.8]], fill, stroke, 1.6);
  return poly(starPoints(cx, cy + 1, h * 1.08), fill, stroke, 1.3);
}
function arrowHead(x, y, angle, size = 7, color = UT.arrow) {
  const a = angle;
  const p1 = [x - Math.cos(a) * size + Math.sin(a) * size * 0.55, y - Math.sin(a) * size - Math.cos(a) * size * 0.55];
  const p2 = [x - Math.cos(a) * size - Math.sin(a) * size * 0.55, y - Math.sin(a) * size + Math.cos(a) * size * 0.55];
  return `<polygon points="${P([[x, y], p1, p2])}" fill="${color}"/>`;
}
// 굽은 화살표(접는 방향): a에서 b로, 조절점 c
function curvedArrow(a, c, b, color = UT.arrow, width = 2) {
  const angle = Math.atan2(b[1] - c[1], b[0] - c[0]);
  return `<path d="M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>${arrowHead(b[0], b[1], angle)}`;
}
const blockArrow = (x, y) => `<path d="M${x} ${y - 5}H${x + 12}V${y - 10}L${x + 22} ${y}L${x + 12} ${y + 10}V${y + 5}H${x}Z" fill="${UT.cut}"/>`;

// ── 1·2·5 칸 나누기 ───────────────────────────────────────────────────────
// rows: '#'=칸 '.'=빈 곳 · marks: [행, 열, 'star'|'tree'] · labels: 나눈 답(같은 글자 = 한 조각)
const TONE = {
  plain: { fill: "#fff", edge: UT.ink, inner: UT.soft },
  land: { fill: UT.greenSoft, edge: UT.ink, inner: "#7fbf95" },
  tetro: { fill: "#f9c74f", edge: UT.ink, inner: "#a8741a" }
};
function tree(cx, cy, s = 1) {
  const g = (dx, dy, r, fill) => `<circle cx="${(cx + dx * s).toFixed(1)}" cy="${(cy + dy * s).toFixed(1)}" r="${(r * s).toFixed(1)}" fill="${fill}" stroke="#1f7a45" stroke-width="1"/>`;
  return `<path d="M${cx - 2.6 * s} ${cy + 13 * s}L${cx - 1.6 * s} ${cy + 2 * s}H${cx + 1.6 * s}L${cx + 2.6 * s} ${cy + 13 * s}Z" fill="#8a5a1e"/>`
    + g(-6.5, -1, 6.5, "#3fae6c") + g(6.5, -1, 6.5, "#3fae6c") + g(0, -7.5, 8, "#4cbf78") + g(0, 0.5, 6.5, "#4cbf78");
}
function partitionBody(v, ox, oy, cell) {
  const tone = TONE[v.tone || "plain"];
  const grid = v.rows.map((row) => [...row]);
  const on = (r, c) => grid[r]?.[c] === "#";
  const label = (r, c) => v.labels?.[r]?.[c];
  const X = (c) => ox + c * cell;
  const Y = (r) => oy + r * cell;
  let body = "";
  const pieceTint = { A: UT.redSoft, B: UT.blueSoft, C: UT.yellowSoft, D: UT.purpleSoft };
  grid.forEach((row, r) => row.forEach((_, c) => {
    if (on(r, c)) body += `<rect x="${X(c)}" y="${Y(r)}" width="${cell}" height="${cell}" fill="${v.labels ? pieceTint[label(r, c)] || tone.fill : tone.fill}"/>`;
  }));
  const inner = [];
  const outer = [];
  const cuts = [];
  grid.forEach((row, r) => row.forEach((_, c) => {
    if (!on(r, c)) return;
    // 오른쪽 변 · 아래 변 · (밖과 닿으면) 왼쪽 변 · 위 변
    const right = [X(c + 1), Y(r), X(c + 1), Y(r + 1)];
    const bottom = [X(c), Y(r + 1), X(c + 1), Y(r + 1)];
    if (on(r, c + 1)) (v.labels && label(r, c) !== label(r, c + 1) ? cuts : inner).push(right); else outer.push(right);
    if (on(r + 1, c)) (v.labels && label(r, c) !== label(r + 1, c) ? cuts : inner).push(bottom); else outer.push(bottom);
    if (!on(r, c - 1)) outer.push([X(c), Y(r), X(c), Y(r + 1)]);
    if (!on(r - 1, c)) outer.push([X(c), Y(r), X(c + 1), Y(r)]);
  }));
  body += inner.map(([x1, y1, x2, y2]) => line(x1, y1, x2, y2, { stroke: tone.inner, width: 1.2, dash: "5 4" })).join("");
  for (const [r, c, kind] of v.marks || []) {
    const cx = X(c) + cell / 2;
    const cy = Y(r) + cell / 2;
    body += kind === "tree" ? tree(cx, cy - 1, cell / 44) : token("star", cx, cy, cell * 0.56);
  }
  body += cuts.map(([x1, y1, x2, y2]) => line(x1, y1, x2, y2, { stroke: UT.red, width: 4 })).join("");
  body += outer.map(([x1, y1, x2, y2]) => line(x1, y1, x2, y2, { stroke: tone.edge, width: 2.2 })).join("");
  return body;
}
function partitionSvg(v) {
  const cell = v.cell || 46;
  const shapes = v.shapes || [v];
  const pad = 8;
  const gap = 26;
  const widths = shapes.map((shape) => Math.max(...shape.rows.map((row) => row.length)) * cell);
  const heights = shapes.map((shape) => shape.rows.length * cell);
  const width = Math.max(...widths) + pad * 2;
  let y = pad;
  let body = "";
  shapes.forEach((shape, index) => {
    body += partitionBody({ ...shape, tone: v.tone, marks: shape.marks }, pad, y, cell);
    y += heights[index] + gap;
  });
  const height = y - gap + pad;
  return svg(width, height, v.labels || shapes.some((shape) => shape.labels) ? "나눈 답" : "나눌 도형", body, v.maxWidth || width);
}

// ── 3·19 놓인 방향이 다른 숫자판 + 움직이는 방법 ──────────────────────────
// 뒤집기 기호: 회색 점선 축 + 주황 화살(축이 세로 = 오른쪽으로 뒤집기, 가로 = 아래로 뒤집기)
function flipIcon(cx, cy, axis) {
  const flip = UT.orange;
  if (axis === "v") {
    return `${line(cx, cy - 22, cx, cy + 22, { stroke: "#8a8a94", width: 1.6, dash: "4 3" })}<ellipse cx="${cx}" cy="${cy}" rx="17" ry="8" fill="none" stroke="${flip}" stroke-width="2.2"/>${arrowHead(cx + 7, cy - 7.6, 0.18, 7, flip)}`;
  }
  return `${line(cx - 22, cy, cx + 22, cy, { stroke: "#8a8a94", width: 1.6, dash: "4 3" })}<ellipse cx="${cx}" cy="${cy}" rx="8" ry="17" fill="none" stroke="${flip}" stroke-width="2.2"/>${arrowHead(cx - 7.6, cy + 7, Math.PI / 2 + 0.18, 7, flip)}`;
}
// 시계 반대 방향으로 반의 반 바퀴: 12시에서 9시까지 색칠 + 빨간 화살(원의 접선 방향)
function quarterTurnIcon(cx, cy) {
  const r = 17;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff8d6" stroke="#e7cf7a" stroke-width="1"/>`
    + `<path d="M${cx} ${cy}V${cy - r}A${r} ${r} 0 0 0 ${cx - r} ${cy}Z" fill="#ffd84d" stroke="#d79a00" stroke-width="1.4"/>`
    + `${line(cx, cy, cx + r, cy, { stroke: "#8a8a94", width: 1.3, dash: "3 3" })}${line(cx, cy, cx, cy + r, { stroke: "#8a8a94", width: 1.3, dash: "3 3" })}`
    + `<path d="M${cx + 4} ${cy - r - 4}A${r + 4} ${r + 4} 0 0 0 ${cx - r - 4} ${cy - 2}" fill="none" stroke="${UT.arrow}" stroke-width="2.2"/>${arrowHead(cx - r - 4, cy + 4, Math.PI / 2, 8)}`;
}
function orientedBoardSvg(v) {
  const n = v.columns;
  const cell = n === 3 ? 58 : 50;
  const boardW = cell * n;
  const iconBoxH = 62;
  const width = Math.max(boardW, v.ops.length * 64 + 40) + 12;
  const iconW = v.ops.length * 64 + 36;
  const ix = (width - iconW) / 2;
  let body = `<rect x="${ix}" y="4" width="${iconW}" height="${iconBoxH}" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.6"/>`;
  v.ops.forEach((op, index) => {
    const cx = ix + 18 + 32 + index * 64;
    const cy = 4 + iconBoxH / 2;
    body += op === "flipLR" ? flipIcon(cx, cy, "v") : op === "flipUD" ? flipIcon(cx, cy, "h") : quarterTurnIcon(cx, cy);
  });
  const ox = (width - boardW) / 2;
  const oy = iconBoxH + 22;
  v.cells.forEach(([digit, turn], index) => {
    const row = Math.floor(index / n);
    const column = index % n;
    const x = ox + column * cell;
    const y = oy + row * cell;
    body += rect(x, y, cell, cell, UT.pastel[(row + column) % 4], UT.box, 1.6);
    body += `<g transform="translate(${x + cell / 2} ${y + cell / 2}) rotate(${turn})">${text(0, 0, digit, { size: cell * 0.55, weight: 500 })}</g>`;
  });
  body += rect(ox, oy, boardW, boardW, "none", UT.box, 2.6);
  return svg(width, oy + boardW + 6, "여러 방향으로 놓인 숫자판과 움직이는 방법", body, n === 3 ? 260 : 280);
}

// ── 4 숫자판 숫자(7칸 숫자)의 덧셈·뺄셈 ─────────────────────────────────
const SEG = {
  a: "M10 6L13.5 2.5H32.5L36 6L32.5 9.5H13.5Z", g: "M10 38L13.5 34.5H32.5L36 38L32.5 41.5H13.5Z", d: "M10 70L13.5 66.5H32.5L36 70L32.5 73.5H13.5Z",
  f: "M7 9L10.5 12.5V31.5L7 35L3.5 31.5V12.5Z", e: "M7 41L10.5 44.5V63.5L7 67L3.5 63.5V44.5Z",
  b: "M39 9L42.5 12.5V31.5L39 35L35.5 31.5V12.5Z", c: "M39 41L42.5 44.5V63.5L39 67L35.5 63.5V44.5Z"
};
const DIGIT_SEG = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcdfg"];
function segDigit(value, cx, cy, scale) {
  const shift = value === 1 ? -16 : 0;
  const paths = [...DIGIT_SEG[value]].map((name) => `<path d="${SEG[name]}" fill="${UT.red}" transform="translate(${shift} 0)"/>`).join("");
  return `<g transform="translate(${(cx - 23 * scale).toFixed(1)} ${(cy - 38 * scale).toFixed(1)}) scale(${scale})">${paths}</g>`;
}
function digitCells(digits, x, y, w, h) {
  const scale = Math.min((w - 12) / 46, (h - 10) / 76);
  return digits.map((digit, index) => box(x + index * w, y, w, h, { radius: 2 }) + (digit == null ? "" : segDigit(digit, x + index * w + w / 2, y + h / 2, scale))).join("");
}
function digitCalcSvg(v) {
  const w = 42;
  const h = 46;
  const x = 84;
  const block = h * 3 + 30;
  let body = "";
  v.items.forEach((item, index) => {
    const top = 6 + index * (block + 26);
    body += text(20, top + 12, item.label, { size: 14, weight: 700 });
    body += digitCells(item.digits, x, top, w, h);
    body += text(x + 2 * w + 12, top + h / 2, "← 원래 수", { size: 14, anchor: "start", weight: 600 });
    body += text(x - 22, top + h + 8 + h / 2, item.op === "+" ? "+" : "−", { size: 24, weight: 800 });
    body += digitCells([null, null], x, top + h + 8, w, h);
    body += text(x + 2 * w + 12, top + h + 8 + h / 2, "← 돌린 수", { size: 14, anchor: "start", weight: 600 });
    const lineY = top + 2 * h + 16;
    body += line(x - (item.result === 3 ? w + 2 : 34), lineY, x + 2 * w + 8, lineY, { stroke: UT.ink, width: 1.8 });
    body += digitCells(Array(item.result).fill(null), x - (item.result - 2) * w, lineY + 7, w, h);
  });
  const height = v.items.length * (block + 26) - 20;
  return svg(240, height, "원래 수와 반 바퀴 돌린 수의 계산", body, 230);
}

// ── 6 수가 쓰인 색종이 접고 자르기 ─────────────────────────────────────
function layered(x, y, w, h, dx, dy) {
  return rect(x + dx, y + dy, w, h, PAPER.fill, PAPER.line, 1.2) + rect(x, y, w, h, PAPER.fill, PAPER.line, 1.8);
}
function foldSixSvg(v) {
  const cell = 32;
  const x0 = 30;
  const y0 = 8;
  const side = cell * 4;
  let body = rect(x0, y0, side, side, "#fff", PAPER.line, 1.8);
  for (let i = 1; i < 4; i += 1) {
    body += line(x0 + i * cell, y0, x0 + i * cell, y0 + side, { stroke: PAPER.grid, width: 1.1, dash: "5 4" });
    if (i !== 2) body += line(x0, y0 + i * cell, x0 + side, y0 + i * cell, { stroke: PAPER.grid, width: 1.1, dash: "5 4" });
  }
  v.grid.forEach((row, r) => row.forEach((value, c) => { body += text(x0 + c * cell + cell / 2, y0 + r * cell + cell / 2 + 1, value, { size: 17, weight: 500 }); }));
  const mid = y0 + side / 2;
  body += line(4, mid, x0 + side + 22, mid, { stroke: UT.crease, width: 1.8 });
  body += curvedArrow([x0 + side + 6, mid - 24], [x0 + side + 24, mid], [x0 + side + 8, mid + 22]);
  const a1 = x0 + side + 30;
  body += blockArrow(a1, mid);
  // 반으로 접은 종이(아래 반) — 가운데 세로 점선, 왼쪽을 오른쪽으로
  const x2 = a1 + 30;
  body += layered(x2, mid - side / 4, side, side / 2, 2.5, 2.5);
  body += line(x2 + side / 2, mid - side / 4, x2 + side / 2, mid + side / 4, { stroke: UT.crease, width: 1.4, dash: "5 4" });
  body += curvedArrow([x2 + side / 2 - 18, mid + 4], [x2 + side / 2, mid - 14], [x2 + side / 2 + 18, mid + 2]);
  const a2 = x2 + side + 8;
  body += blockArrow(a2, mid);
  // 한 번 더 접은 종이(네 겹) — 칠한 칸이 잘라 낼 부분
  const x3 = a2 + 30;
  const q = side / 4;
  body += rect(x3 + 2.5, mid - q + 2.5, q * 2, q * 2, PAPER.fill, PAPER.line, 1.2);
  [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([c, r]) => {
    const shaded = v.shaded.some(([sr, sc]) => sr === r && sc === c);
    body += rect(x3 + c * q, mid - q + r * q, q, q, shaded ? UT.cut : PAPER.fill, "none", 0);
  });
  body += line(x3 + q, mid - q, x3 + q, mid + q, { stroke: PAPER.grid, width: 1.1, dash: "4 3" }) + line(x3, mid, x3 + 2 * q, mid, { stroke: PAPER.grid, width: 1.1, dash: "4 3" });
  body += rect(x3, mid - q, q * 2, q * 2, "none", PAPER.line, 1.8);
  const width = x3 + q * 2 + 8;
  return svg(width, side + y0 * 2, "수가 쓰인 색종이를 두 번 접어 칠한 부분을 자르는 과정", body, 470);
}

// ── 7 겹쳐진 색종이 8장 ────────────────────────────────────────────────
function sheetsSvg(v) {
  const u = 52;
  const o = 6;
  let body = "";
  for (const sheet of v.sheets) body += poly(sheet.shape.map(([x, y]) => [o + x * u, o + y * u]), PAPER.fill, PAPER.line, 1.8);
  for (const sheet of v.sheets) body += text(o + sheet.at[0] * u, o + sheet.at[1] * u, sheet.name, { size: 17, weight: 600 });
  return svg(u * 4 + o * 2, u * 4 + o * 2, "겹쳐진 색종이 8장", body, 230);
}

// ── 8·9·20 쌓기나무 ───────────────────────────────────────────────────
// 앞면 한 변 u, 뒤로 한 줄 갈 때마다 오른쪽 위로 d(= u/3)
function cube(i, j, k, u, d, ox, oy) {
  const X = ox + i * u + j * d;
  const Y = oy - k * u - j * d;
  return poly([[X, Y - u], [X + d, Y - u - d], [X + u + d, Y - u - d], [X + u, Y - u]], UT.cubeTop, UT.cubeLine, 1.2)
    + poly([[X + u, Y - u], [X + u + d, Y - u - d], [X + u + d, Y - d], [X + u, Y]], UT.cubeSide, UT.cubeLine, 1.2)
    + rect(X, Y - u, u, u, UT.cubeFront, UT.cubeLine, 1.2);
}
// 뒤 줄부터, 아래층부터, 왼쪽부터 그린다(앞에 있는 것이 뒤를 가린다)
const paintOrder = (cubes) => [...cubes].sort((a, b) => b[1] - a[1] || a[2] - b[2] || a[0] - b[0]);
function cubeStack(cubes, u, ox, oy) {
  const d = u / 3;
  return paintOrder(cubes).map(([i, j, k]) => cube(i, j, k, u, d, ox, oy)).join("");
}
// n×n×n 정육면체(바깥 면에 칸 선) — fill=false 면 빈 상자 테두리만
function bigCube(n, u, ox, oy, fill = true) {
  const d = u / 3;
  const s = n * u;
  const D = n * d;
  const front = [[ox, oy - s], [ox + s, oy - s], [ox + s, oy], [ox, oy]];
  const top = [[ox, oy - s], [ox + D, oy - s - D], [ox + s + D, oy - s - D], [ox + s, oy - s]];
  const side = [[ox + s, oy - s], [ox + s + D, oy - s - D], [ox + s + D, oy - D], [ox + s, oy]];
  if (!fill) return [top, side, front].map((face) => poly(face, "none", UT.ink, 2.4)).join("");
  let body = poly(top, UT.cubeTop, UT.cubeLine, 1.2) + poly(side, UT.cubeSide, UT.cubeLine, 1.2) + poly(front, UT.cubeFront, UT.cubeLine, 1.2);
  const grid = { stroke: UT.cubeLine, width: 1.1 };
  for (let t = 1; t < n; t += 1) {
    body += line(ox + t * u, oy - s, ox + t * u, oy, grid) + line(ox, oy - t * u, ox + s, oy - t * u, grid);
    body += line(ox + t * u, oy - s, ox + t * u + D, oy - s - D, grid) + line(ox + t * d, oy - s - t * d, ox + s + t * d, oy - s - t * d, grid);
    body += line(ox + s + t * d, oy - t * d, ox + s + t * d, oy - s - t * d, grid) + line(ox + s, oy - t * u, ox + s + D, oy - t * u - D, grid);
  }
  return body + [top, side, front].map((face) => poly(face, "none", UT.cubeLine, 2)).join("");
}
function cubesSvg(v) {
  const u = 34;
  const d = u / 3;
  const extent = (axis) => Math.max(...v.cubes.map((c) => c[axis])) + 1;
  const width = extent(0) * u + extent(1) * d + 12;
  const height = extent(2) * u + extent(1) * d + 12;
  return svg(width, height, "쌓기나무", cubeStack(v.cubes, u, 6, height - 6), 230);
}
function boxFillSvg(v) {
  const u = 26;
  const n = v.size;
  const s = n * u + n * u / 3;
  const pad = 6;
  const oy = s + pad;
  const left = cubeStack(v.cubes, u, pad, oy) + bigCube(n, u, pad, oy, false);
  const ax = pad + s + 14;
  const right = bigCube(n, u, ax + 40, oy, true);
  return svg(ax + 40 + s + pad, s + pad * 2, "상자 속 쌓기나무와 가득 채운 상자", left + blockArrow(ax, oy - s / 2) + right, 400);
}
function fullCubeSvg(v) {
  const u = 40;
  const s = v.size * u + v.size * u / 3;
  return svg(s + 12, s + 12, "쌓기나무로 만든 정육면체", bigCube(v.size, u, 6, s + 6, true), 230);
}

// ── 10 모양 사이의 관계식 ───────────────────────────────────────────────
function equationsSvg(v) {
  const rowH = 50;
  const width = 250;
  const height = v.rows.length * rowH + 24;
  let body = `<rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="14" fill="#fff4c2" stroke="${UT.orange}" stroke-width="1.8"/>`;
  v.rows.forEach(([a, b, op, n], index) => {
    const cy = 12 + rowH / 2 + index * rowH;
    body += token(a, 50, cy, 34, false) + text(92, cy, "=", { size: 22, weight: 600 }) + token(b, 134, cy, 34, false)
      + text(176, cy, op === "+" ? "+" : "−", { size: 22, weight: 600 }) + text(210, cy, n, { size: 22, weight: 600 });
  });
  return svg(width, height, "모양 사이의 관계식", body, 250);
}

// ── 13·14·22 양팔 저울 ──────────────────────────────────────────────────
// left/right: 아래 줄부터 쌓은 모양 이름 줄
function balanceBody(fig, ox, oy) {
  const t = 22;
  const rows = Math.max(fig.left.length, fig.right.length);
  const panW = (side) => Math.max(70, Math.max(...side.map((row) => row.length)) * (t + 2) + 18);
  const lw = panW(fig.left);
  const rw = panW(fig.right);
  const gap = 34;
  const width = lw + gap + rw;
  const plateY = oy + rows * (t + 2) + 4;
  const lc = ox + lw / 2;
  const rc = ox + lw + gap + rw / 2;
  let body = "";
  const stack = (side, cx) => side.map((row, level) => row.map((kind, index) => token(kind, cx + (index - (row.length - 1) / 2) * (t + 2), plateY - 2 - t / 2 - level * (t + 2), t)).join("")).join("");
  const beamY = plateY + 16;
  body += line(lc, plateY + 4, lc, beamY, { stroke: UT.orange, width: 2.4 }) + line(rc, plateY + 4, rc, beamY, { stroke: UT.orange, width: 2.4 });
  body += line(lc, beamY, rc, beamY, { stroke: UT.orange, width: 3.4 });
  const mid = (lc + rc) / 2;
  body += poly([[mid, beamY + 1], [mid + 15, beamY + 25], [mid - 15, beamY + 25]], UT.yellow, "#d9a400", 1.6);
  body += `<ellipse cx="${lc}" cy="${plateY}" rx="${lw / 2}" ry="5.5" fill="${UT.orangeSoft}" stroke="${UT.orange}" stroke-width="1.8"/><ellipse cx="${rc}" cy="${plateY}" rx="${rw / 2}" ry="5.5" fill="${UT.orangeSoft}" stroke="${UT.orange}" stroke-width="1.8"/>`;
  body += stack(fig.left, lc) + stack(fig.right, rc);
  body += text(mid, beamY + 42, fig.label, { size: 14, weight: 600 });
  return { body, width, height: beamY + 52 - oy };
}
function balancesSvg(v) {
  const figs = v.figs.map((fig) => ({ fig, ...balanceBody(fig, 0, 0) }));
  let body = "";
  let width;
  let height;
  if (v.layout === "stack") {
    width = Math.max(...figs.map((f) => f.width)) + 12;
    let y = 4;
    for (const f of figs) {
      body += balanceBody(f.fig, (width - f.width) / 2, y).body;
      y += f.height + 10;
    }
    height = y - 6;
  } else {
    const [a, b, c] = figs;
    const gap = 30;
    width = a.width + gap + b.width + 12;
    const top = Math.max(a.height, b.height);
    body += balanceBody(a.fig, 6, 4 + top - a.height).body + balanceBody(b.fig, 6 + a.width + gap, 4 + top - b.height).body;
    body += balanceBody(c.fig, (width - c.width) / 2, top + 16).body;
    height = top + 16 + c.height + 4;
  }
  return svg(width, height, "평형을 이룬 양팔 저울", body, v.layout === "stack" ? 260 : 420);
}

// ── 16 방위와 건물 ─────────────────────────────────────────────────────
function building(kind, cx, by) {
  const win = (x, y, cols, rows, w, h, color) => {
    let out = "";
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += `<rect x="${x + c * w}" y="${y + r * h}" width="${w - 2}" height="${h - 2}" fill="${color}"/>`;
    return out;
  };
  const tower = (x, w, h, fill, edge, cols, rows) => rect(x, by - h, w, h, fill, edge, 1.4) + win(x + 4, by - h + 5, cols, rows, (w - 6) / cols, Math.min(8, (h - 12) / rows), edge);
  if (kind === "a") return tower(cx - 30, 22, 30, UT.orangeSoft, "#c2721a", 3, 3) + tower(cx - 6, 18, 50, UT.blueSoft, UT.blue, 2, 5) + tower(cx + 14, 16, 36, UT.purpleSoft, UT.purple, 2, 4);
  if (kind === "b") return tower(cx - 16, 20, 52, UT.blueSoft, UT.blue, 2, 6) + tower(cx + 6, 12, 34, UT.greenSoft, UT.green, 1, 4);
  if (kind === "c") return tower(cx - 22, 22, 48, UT.purpleSoft, UT.purple, 3, 5) + tower(cx + 2, 24, 26, UT.orangeSoft, "#c2721a", 3, 3);
  return tower(cx - 18, 14, 22, UT.greenSoft, UT.green, 1, 2) + tower(cx - 4, 22, 38, UT.redSoft, UT.red, 3, 4);
}
function compassSvg(v) {
  const cell = 96;
  const band = 38;
  const total = cell * 2 + band;
  const gx = 6;
  const gy = 6;
  let body = `<rect x="${gx}" y="${gy + cell}" width="${total}" height="${band}" fill="${UT.yellowSoft}"/><rect x="${gx + cell}" y="${gy}" width="${band}" height="${total}" fill="${UT.yellowSoft}"/>`;
  const cells = [[0, 0, "a"], [1, 0, "b"], [0, 1, "c"], [1, 1, "d"]];
  for (const [c, r, kind] of cells) {
    const x = gx + c * (cell + band);
    const y = gy + r * (cell + band);
    body += rect(x, y, cell, cell, "#fff", UT.box, 1.6) + building(kind, x + cell / 2, y + (kind === "d" ? cell - 32 : cell - 20));
    if (kind === "d") body += text(x + cell / 2, y + cell - 16, v.mark, { size: 17, weight: 600 });
  }
  const cx = gx + cell + band / 2;
  const cy = gy + cell + band / 2;
  const ink = UT.line;
  // 방위 글자는 띠의 끝, 화살표는 글자 사이
  body += line(cx, cy - 72, cx, cy + 72, { stroke: ink, width: 2 }) + arrowHead(cx, cy - 76, -Math.PI / 2, 9, ink) + arrowHead(cx, cy + 76, Math.PI / 2, 9, ink);
  body += line(cx - 72, cy, cx + 72, cy, { stroke: ink, width: 2 }) + arrowHead(cx - 76, cy, Math.PI, 9, ink) + arrowHead(cx + 76, cy, 0, 9, ink);
  body += text(cx, gy + 14, "북", { size: 16, weight: 700 }) + text(cx, gy + total - 14, "남", { size: 16, weight: 700 });
  body += text(gx + 14, cy, "서", { size: 16, weight: 700 }) + text(gx + total - 14, cy, "동", { size: 16, weight: 700 });
  return withClues(v.clues, svg(total + 12, total + 12, "학교·도서관·은행·백화점 자리와 방위", body, 250));
}
// 조건 상자(글) + 그림: 그림은 칸 높이에서 조건 상자만큼 뺀 만큼만 커진다
function withClues(clues, figureSvg) {
  const reserve = clues.length * 27 + 44;
  const sized = figureSvg.replace("height:auto;", `height:auto;max-height:calc(100cqh - ${reserve}px);`);
  return `<div style="display:grid;gap:10px;justify-items:center;width:100%">${conditionsBox(clues)}${sized}</div>`;
}

// ── 17·24 둥근 식탁 ────────────────────────────────────────────────────
function tableSvg(v) {
  const R = v.seats === 5 ? 46 : 40;
  const dist = v.seats === 5 ? 84 : 76;
  const seat = 24;
  const size = (dist + seat + 6) * 2;
  const cx = size / 2;
  const cy = size / 2;
  let body = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${PAPER.fill}" stroke="${PAPER.line}" stroke-width="1.8"/>`;
  for (let index = 0; index < v.seats; index += 1) {
    const angle = -Math.PI / 2 + index * 2 * Math.PI / v.seats;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${seat}" fill="#fff" stroke="${UT.box}" stroke-width="1.6"/>`;
    if (v.names[index]) body += text(x.toFixed(1), (y + 1).toFixed(1), v.names[index], { size: 15, weight: 600 });
  }
  return withClues(v.clues, svg(size, size, "둥근 식탁에 앉은 자리", body, 220));
}

// ── 21 세 번 접어 자르기 ───────────────────────────────────────────────
function scissors(x, y) {
  return `<g transform="translate(${x} ${y}) rotate(20)" stroke="${UT.ink}" fill="none" stroke-width="1.6"><circle cx="-4" cy="-10" r="3.6"/><circle cx="4" cy="-10" r="3.6"/><path d="M-2.4 -6.8L3 8M2.4 -6.8L-3 8" stroke-width="2.4"/></g>`;
}
// 펼친 종이: 가로 4칸 · 세로 2칸 점선(접힌 자리), lines: [x1,y1,x2,y2] (한 변 = 4)
function unfoldGrid(ox, oy, size, lines = []) {
  const k = size / 4;
  let body = rect(ox, oy, size, size, PAPER.fill, PAPER.line, 1.8);
  for (const t of [1, 2, 3]) body += line(ox + t * k, oy, ox + t * k, oy + size, { stroke: UT.crease, width: 1.1, dash: "4 4" });
  body += line(ox, oy + size / 2, ox + size, oy + size / 2, { stroke: UT.crease, width: 1.1, dash: "4 4" });
  body += lines.map(([x1, y1, x2, y2]) => line(ox + x1 * k, oy + y1 * k, ox + x2 * k, oy + y2 * k, { stroke: UT.red, width: 2.6 })).join("");
  return body;
}
function foldTwentyOneSvg(v) {
  if (v.answer) return svg(200, 200, "펼친 종이에 그린 잘린 선", unfoldGrid(10, 10, 180, v.lines), 220);
  const S = 92;
  const mid = 70;
  let x = 6;
  let body = "";
  // ① 왼쪽 반을 오른쪽으로
  body += rect(x, mid - S / 2, S, S, PAPER.fill, PAPER.line, 1.8) + line(x + S / 2, mid - S / 2, x + S / 2, mid + S / 2, { stroke: UT.crease, width: 1.3, dash: "5 4" });
  body += curvedArrow([x + S / 2 - 18, mid + 14], [x + S / 2, mid + 30], [x + S / 2 + 18, mid + 12]);
  x += S + 8;
  body += blockArrow(x, mid);
  x += 30;
  // ② 아래 반을 위로
  body += layered(x, mid - S / 2, S / 2, S, 2.5, -2.5) + line(x, mid, x + S / 2, mid, { stroke: UT.crease, width: 1.3, dash: "5 4" });
  body += curvedArrow([x + S / 4 + 4, mid + 22], [x + S / 4 - 16, mid], [x + S / 4 + 2, mid - 22]);
  x += S / 2 + 8;
  body += blockArrow(x, mid);
  x += 30;
  // ③ 오른쪽 반을 왼쪽으로
  body += layered(x, mid - S / 4, S / 2, S / 2, 2.5, -2.5) + line(x + S / 4, mid - S / 4, x + S / 4, mid + S / 4, { stroke: UT.crease, width: 1.3, dash: "5 4" });
  body += curvedArrow([x + S / 4 + 14, mid + 6], [x + S / 4, mid + 18], [x + S / 4 - 14, mid + 4]);
  x += S / 2 + 8;
  body += blockArrow(x, mid);
  x += 30;
  // ④ 접은 종이에 선을 따라 자르기
  const w = S / 4;
  const h = S / 2;
  const top = mid - h / 2;
  body += layered(x, top, w, h, 2, -2);
  const [[a, b], [c, d], [e, f]] = v.cut;
  body += `<polyline points="${P([[x + a * w, top + b * h], [x + c * w, top + d * h], [x + e * w, top + f * h]])}" fill="none" stroke="${UT.ink}" stroke-width="2"/>`;
  body += scissors(x + w * 0.75, top - 14);
  const rowWidth = x + w + 8;
  const size = 150;
  body += unfoldGrid((rowWidth - size) / 2, mid + S / 2 + 26, size);
  return svg(rowWidth, mid + S / 2 + 26 + size + 6, "색종이를 세 번 접어 선을 따라 자르는 과정과 펼친 종이", body, 360);
}

// ── 그림 없는 문항(18) · 물음이 이어지는 문항(25) ─────────────────────────
const blank = () => `<div aria-hidden="true" style="min-height:4px"></div>`;
function subQuestions(v) {
  return `<ol style="list-style:none;margin:0;padding:0 0 0 22px;display:grid;gap:64px;width:100%;align-self:start">${v.items.map((item) => `<li style="font-family:'FC Serif',serif;font-size:14px;font-weight:400;line-height:1.7;color:${UT.ink};word-break:keep-all">${esc(item)}</li>`).join("")}</ol>`;
}

// ── 문항 ──────────────────────────────────────────────────────────────
const SAME_BALANCE = "다음 그림의 양팔 저울은 모두 평형을 이루고 있습니다.";
const QUESTIONS = {
  1: {
    prompt: "다음과 같은 도형을 크기와 모양이 똑같은 4개의 도형으로 나눌 수 있도록 선을 그려보시오. (단, 각 부분에 ★이 1개씩 있어야 하고, ★의 위치는 달라도 됩니다.)",
    visual: { type: "partition", tone: "plain", rows: ["####", "####", "####", "####"], marks: [[1, 1, "star"], [2, 0, "star"], [3, 1, "star"], [3, 3, "star"]], maxWidth: 210 },
    responseKind: "drawing"
  },
  2: {
    prompt: "다음과 같은 모양의 땅에 나무가 심어져 있습니다. 이곳에 똑같은 크기의 집을 지으려고 합니다. 각 부분에 한 그루의 나무를 포함하여 크기와 모양이 같게 4부분으로 땅을 나누어보시오. (단, 나무의 위치는 상관없습니다.)",
    visual: { type: "partition", tone: "land", rows: [".###", "####", "###.", ".##."], marks: [[0, 1, "tree"], [1, 2, "tree"], [2, 0, "tree"], [3, 2, "tree"]], maxWidth: 210 },
    responseKind: "drawing"
  },
  3: {
    prompt: "다음 숫자판을 오른쪽으로 뒤집은 후 다시 아래로 뒤집었을 때, 똑바로 놓이는 수들의 합을 구하시오.",
    visual: { type: "board", columns: 3, ops: ["flipLR", "flipUD"], cells: [[1, 0], [2, 90], [3, 180], [4, 270], [5, 270], [6, 0], [7, 90], [8, 180], [9, 90]] }
  },
  4: {
    prompt: "다음 식은 원래 두 자리 수와 그 수를 반 바퀴 돌려 읽은 수를 계산한 것입니다. 빈 칸에 알맞은 수를 구하시오.",
    visual: { type: "digit-calc", items: [{ label: "(1)", digits: [9, 6], op: "+", result: 3 }, { label: "(2)", digits: [5, 2], op: "-", result: 2 }] },
    responseKind: "fill"
  },
  5: {
    prompt: "다음 두 개의 도형을 모양과 크기가 같은 2개의 테트로미노 조각으로 나누시오.",
    visual: { type: "partition", tone: "tetro", cell: 38, shapes: [{ rows: ["##..", "##..", "####"] }, { rows: ["#...", "###.", "####"] }], maxWidth: 170 },
    responseKind: "drawing"
  },
  6: {
    prompt: "다음과 같이 수가 쓰인 색종이를 접어서 색칠된 부분을 자른 후 펼쳤을 때, 잘려나간 부분에 있는 수들의 합을 구하시오.",
    visual: { type: "fold-6", grid: [[2, 3, 4, 5], [6, 7, 8, 9], [2, 3, 4, 5], [6, 7, 8, 9]], shaded: [[0, 0], [1, 1]] }
  },
  7: {
    prompt: "크기가 같은 색종이 8장이 겹쳐져 있을 때, 가장 위에 있는 색종이부터 하나씩 빼면 다음과 같습니다. 가장 밑에 있는 색종이를 구하시오.",
    visual: { type: "sheets", sheets: [
      { name: "가", shape: [[0, 0], [2, 0], [2, 1], [0, 1]], at: [1.05, 0.5] },
      { name: "마", shape: [[2, 0], [4, 0], [4, 2], [2, 2]], at: [3, 1] },
      { name: "나", shape: [[0, 1], [1, 1], [1, 2], [0, 2]], at: [0.6, 1.5] },
      { name: "아", shape: [[1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [1, 3]], at: [1.65, 2.45] },
      { name: "바", shape: [[3, 2], [4, 2], [4, 3], [3, 3]], at: [3.55, 2.55] },
      { name: "다", shape: [[0, 2], [1, 2], [1, 4], [0, 4]], at: [0.55, 3] },
      { name: "라", shape: [[1, 3], [2, 3], [2, 4], [1, 4]], at: [1.55, 3.55] },
      { name: "사", shape: [[2, 3], [4, 3], [4, 4], [2, 4]], at: [3.05, 3.55] }
    ] }
  },
  8: {
    prompt: "다음 그림에서 쌓기나무는 최소 몇 개인지 구하시오.",
    // [가로 칸, 뒤로 몇 줄, 층] — 원문 그림에 보이는 쌓기나무
    visual: { type: "cubes", cubes: [
      [0, 0, 0], [0, 1, 0], [1, 1, 0], [2, 1, 0], [3, 1, 0], [0, 1, 1],
      [1, 2, 0], [2, 2, 0], [3, 2, 0], [0, 2, 1], [1, 2, 1], [2, 2, 1], [0, 2, 2],
      [2, 3, 0], [3, 3, 0], [1, 3, 1], [2, 3, 1], [3, 3, 1], [0, 3, 2], [1, 3, 2], [2, 3, 2], [0, 3, 3]
    ] }
  },
  9: {
    prompt: "다음 그림은 정육면체 모양의 상자 속에 크기가 같은 상자 모양의 쌓기나무를 여러 개 채워 놓은 것입니다. 이 상자를 오른쪽 그림과 같이 완전히 채우려면 쌓기나무가 몇 개 더 필요한지 구하시오.",
    visual: { type: "box-fill", size: 4, cubes: [
      [0, 0, 0], [0, 1, 0], [1, 1, 0], [0, 1, 1],
      [0, 2, 0], [1, 2, 0], [2, 2, 0], [0, 2, 1], [1, 2, 1], [0, 2, 2], [1, 2, 2],
      [0, 3, 0], [1, 3, 0], [2, 3, 0], [3, 3, 0], [0, 3, 1], [1, 3, 1], [2, 3, 1], [0, 3, 2], [1, 3, 2], [0, 3, 3], [1, 3, 3]
    ] }
  },
  10: {
    prompt: "다음은 ○, ◇, □, △의 크기를 비교한 식입니다. ◇와 △의 차이를 구하시오.",
    visual: { type: "equations", rows: [["circle", "diamond", "-", 6], ["diamond", "square", "+", 3], ["square", "triangle", "-", 5]] }
  },
  11: {
    prompt: "기현, 준교, 건호, 하연 4명의 나이를 비교하였더니 다음과 같았습니다. 준교와 하연이의 나이는 몇 살 차이가 나는지 구하시오.",
    visual: { type: "clues", clues: ["기현이는 준교 보다 2살이 많습니다.", "건호는 준교 보다 3살이 적습니다.", "하연이는 기현이 보다 1살이 많습니다."] }
  },
  12: {
    prompt: "다현, 윤서, 종호, 하윤이가 달리기 시합을 합니다. 다현이와 종호 사이의 거리는 몇 m인지 구하시오.",
    visual: { type: "clues", clues: ["윤서는 종호보다 4m 앞에 있습니다.", "윤서는 하윤이보다 9m 앞에 있습니다.", "하윤이는 다현이보다 8m 뒤에 있습니다."] }
  },
  13: {
    prompt: `${SAME_BALANCE} ■ 1개는 ● 몇 개의 무게와 같습니까?`,
    visual: { type: "balances", layout: "stack", figs: [
      { label: "[그림 1]", left: [["circle", "circle"], ["square"]], right: [["diamond"]] },
      { label: "[그림 2]", left: [["square", "square", "square", "square"], ["circle", "circle", "circle", "circle"]], right: [["diamond", "diamond", "diamond"]] }
    ] }
  },
  14: {
    prompt: `${SAME_BALANCE} ★ 1개는 ◆ 몇 개의 무게와 같습니까?`,
    visual: { type: "balances", layout: "two-one", figs: [
      { label: "[그림 1]", left: [["circle"]], right: [["diamond", "diamond"]] },
      { label: "[그림 2]", left: [["square"]], right: [["diamond", "circle"]] },
      { label: "[그림 3]", left: [["circle", "square"]], right: [["star"]] }
    ] }
  },
  15: {
    prompt: "지후, 종호, 강준, 예준, 승환가 달리기 시합을 하였는데 그 결과가 다음과 같습니다. 세 번째로 들어온 사람이 누구인지 구하시오.",
    visual: { type: "clues", clues: ["지후와 강준이는 예준이보다 먼저 들어왔습니다.", "승환이는 지후보다 먼저 들어왔습니다.", "강준이 앞에는 종호밖에 없습니다."] }
  },
  16: {
    prompt: "다음 그림에 학교, 도서관, 은행, 백화점의 위치를 찾아 써 넣으시오. ㉮에는 무엇이 있습니까?",
    visual: { type: "compass", mark: "㉮", clues: ["도서관 북쪽에 학교가 있습니다.", "은행 남쪽에 백화점이 있고, 동쪽에는 학교가 있습니다."] }
  },
  17: {
    prompt: "시원, 예지, 재욱, 창훈, 동호 5명의 학생이 식탁에 둥글게 앉아 있습니다. ㉠에는 누가 앉아 있습니까?",
    // 자리: 12시부터 시계 방향
    visual: { type: "table", seats: 5, names: ["", "", "시원", "", "㉠"], clues: ["시원이의 왼쪽 옆에는 예지가 앉아 있습니다.", "재욱이는 예지와 창훈이 사이에 앉아 있습니다.", "시원이와 창훈이는 서로 떨어져 있습니다."] }
  },
  18: {
    prompt: "16명이 한 줄로 서 있습니다. 서연이는 앞에서부터 11번째에 서 있고, 재영이는 뒤에서부터 10번째에 서 있습니다. 서연이와 재영이 사이에는 몇 명이 서 있는지 구하시오.",
    visual: { type: "none" }
  },
  19: {
    prompt: "다음 숫자판을 아래와 같은 방법으로 움직였을 때, 똑바로 놓이는 수를 구하시오.",
    visual: { type: "board", columns: 4, ops: ["flipUD", "turnLeft", "flipLR"], cells: [
      [3, 180], [9, 270], [5, 0], [1, 90],
      [4, 270], [5, 180], [2, 90], [2, 180],
      [8, 90], [1, 90], [7, 180], [3, 270],
      [9, 90], [1, 180], [6, 0], [4, 0]
    ] }
  },
  20: {
    prompt: "다음 그림에서 바닥면을 포함하여 겉면에 보이는 쌓기나무를 모두 걷어냈을 때, 안쪽에 남아 있는 쌓기나무의 개수를 구하시오.",
    visual: { type: "full-cube", size: 4 }
  },
  21: {
    prompt: "색종이를 세 번 접은 후 선을 따라 잘랐습니다. 잘린 선의 모양을 그리시오.",
    // 접은 종이(가로 1 · 세로 1) 위의 자른 선: 위쪽 가운데 → 왼쪽 가운데 → 오른쪽 아래 꼭짓점
    visual: { type: "fold-21", cut: [[0.5, 0], [0, 0.5], [1, 1]] },
    responseKind: "drawing"
  },
  22: {
    prompt: `${SAME_BALANCE} ● 1개는 ◆ 몇 개의 무게와 같습니까?`,
    visual: { type: "balances", layout: "two-one", figs: [
      { label: "[그림 1]", left: [["square"]], right: [["star", "diamond"]] },
      { label: "[그림 2]", left: [["circle"]], right: [["square", "square"]] },
      { label: "[그림 3]", left: [["diamond", "diamond", "diamond"]], right: [["star", "star"]] }
    ] }
  },
  23: {
    prompt: "정우, 민수, 경훈, 지섭, 진성 5명의 학생들이 달리기 시합을 하였습니다. 정우와 지섭이가 들어온 시간의 차이를 구하시오.",
    visual: { type: "clues", clues: ["정우는 민수보다 7초 먼저 들어 왔습니다.", "경훈이는 민수보다 3초 늦게 들어 왔습니다.", "경훈이는 지섭이보다 4초 늦게 들어 왔습니다.", "지섭이는 진성이보다 7초 먼저 들어 왔습니다."] }
  },
  24: {
    prompt: "가, 나, 다, 라, 마, 바가 원탁에 앉아있습니다. 다음 조건을 읽고, ㉠에 앉아 있는 사람을 구하시오.",
    visual: { type: "table", seats: 6, names: ["나", "", "", "", "", "㉠"], clues: ["마와 나는 마주 보고 있습니다.", "가의 옆에는 나가 앉아 있습니다.", "라와 바는 마주 보고 있습니다.", "다의 오른쪽 옆에 마가 있습니다.", "가와 마 사이에 바가 있습니다."] }
  },
  25: {
    prompt: "다현이와 지후가 표를 사기 위해 줄을 섰습니다. 다현이는 앞에서부터 8번째에 서 있고, 지후는 뒤에서부터 7번째에 서 있습니다. 다현이와 지후 사이에는 4명의 사람들이 서 있습니다. 다음 물음에 답하시오.",
    visual: { type: "sub-questions", items: ["(1) 다현이가 지후보다 앞에 있는 경우 줄을 선 사람들은 모두 몇 명입니까?", "(2) 지후가 다현이보다 앞에 있는 경우 줄을 선 사람들은 모두 몇 명입니까?"] }
  }
};

export const numbers = Object.freeze(Object.keys(QUESTIONS).map(Number));
export function get(number) {
  const question = QUESTIONS[Number(number)];
  return question ? { number: Number(number), ...question } : null;
}
export function figure(visual) {
  if (!visual) return "";
  switch (visual.type) {
    case "partition": return partitionSvg(visual);
    case "board": return orientedBoardSvg(visual);
    case "digit-calc": return digitCalcSvg(visual);
    case "fold-6": return foldSixSvg(visual);
    case "sheets": return sheetsSvg(visual);
    case "cubes": return cubesSvg(visual);
    case "box-fill": return boxFillSvg(visual);
    case "full-cube": return fullCubeSvg(visual);
    case "equations": return equationsSvg(visual);
    case "clues": return conditionsBox(visual.clues);
    case "balances": return balancesSvg(visual);
    case "compass": return compassSvg(visual);
    case "table": return tableSvg(visual);
    case "fold-21": return foldTwentyOneSvg(visual);
    case "sub-questions": return subQuestions(visual);
    case "none": return blank();
    default: return "";
  }
}
