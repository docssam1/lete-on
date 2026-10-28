// 9권 권별 테스트 원문(다시 짠 것) — 원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」.
// 문장·수·배치는 원문 그대로, 그림은 우리 색표(kit.js)로 새로 그린다. 정답은 여기에 두지 않는다(비공개 DB).
// figure(visual) 는 문항 그림과 답 그림(비공개 정답의 visual)을 같은 함수로 그린다 — 채울 값은 visual.fill 로만 받는다.
// 그림은 모두 SVG 한 장(조건 상자·표도 SVG 안)이라 쪽 칸 높이에 맞춰 통째로 줄어든다.
import { UT, esc, text, svg, box, line, cardsRow } from "./kit.js?v=20261028ze";

const INK = UT.ink;
const ANS = UT.blue; // 답 그림에 채운 수
const SHADE = UT.shade; // 색칠한 부분(넓이)
const GRID = "#d8ccb2"; // 모눈 선
const CIRCLED = ["㉠", "㉡", "㉢", "㉣", "㉤", "㉮", "㉯", "㉰", "㉱", "㉲"];
const pts = (list) => list.map(([x, y]) => `${+x.toFixed(2)},${+y.toFixed(2)}`).join(" ");
const poly = (list, { fill = "none", stroke = INK, width = 1.6, dash = "", join = "round", opacity = 1 } = {}) =>
  `<polygon points="${pts(list)}" fill="${fill}"${opacity < 1 ? ` fill-opacity="${opacity}"` : ""} stroke="${stroke}" stroke-width="${width}" stroke-linejoin="${join}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const circle = (cx, cy, r, { fill = "#fff", stroke = UT.box, width = 1.7 } = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const word = (x, y, value, opts = {}) => text(x, y, value, { size: 14, weight: 500, ...opts });

// ── 글자 폭 어림(줄 바꿈·상자 폭) ──
const charWidth = (ch, size) => (/[ᄀ-ᇿ㄰-㆏가-힣㈀-㋿]/.test(ch) ? size * 0.9 : ch === " " ? size * 0.3 : /[0-9A-Za-z]/.test(ch) ? size * 0.58 : size * 0.4);
const widthOf = (value, size) => [...String(value)].reduce((sum, ch) => sum + charWidth(ch, size), 0);
function wrap(value, maxWidth, size) {
  const words = String(value).split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (current && widthOf(next, size) > maxWidth) { lines.push(current); current = w; } else current = next;
  }
  if (current) lines.push(current);
  return lines;
}

// 조건 상자(원문의 연한 상자) — 종이색 바탕, 글자 검정. 반환: { markup, height }
function conditionBox(x, y, width, clues, { size = 13.5, bullets = true, gap = 7 } = {}) {
  const lh = size * 1.55;
  const indent = bullets ? 18 : 4;
  let cursor = y + 10;
  let body = "";
  for (const clue of clues) {
    const lines = wrap(clue, width - indent - 18, size);
    lines.forEach((value, index) => {
      if (index === 0 && bullets) body += `<circle cx="${x + 12}" cy="${(cursor + lh / 2).toFixed(1)}" r="2.2" fill="${INK}"/>`;
      body += text(x + 8 + indent - (bullets ? 4 : 0), +(cursor + lh / 2).toFixed(1), value, { size, weight: 500, anchor: "start" });
      cursor += lh;
    });
    cursor += gap - 4;
  }
  const height = cursor - y + 6;
  return { markup: `<rect x="${x}" y="${y}" width="${width}" height="${height.toFixed(1)}" rx="7" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.4"/>${body}`, height };
}

// 숫자 카드 줄
const cards = (values, width, y, size = 28) => cardsRow(values.map(String), width, y, size);

// 오른쪽 굵은 화살표(원문의 초록 블록 화살표 대신 빨강)
const blockArrow = (x, y, s = 1) => `<path d="M${x} ${y - 5 * s}H${x + 11 * s}V${y - 10 * s}L${x + 21 * s} ${y}L${x + 11 * s} ${y + 10 * s}V${y + 5 * s}H${x}Z" fill="${UT.arrow}"/>`;
// 방향 화살표(끝점 → 머리), 쌓기나무 보는 방향
function pointer(x1, y1, x2, y2) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const head = 9, wing = 6;
  const bx = x2 - Math.cos(a) * head, by = y2 - Math.sin(a) * head;
  const nx = -Math.sin(a) * wing, ny = Math.cos(a) * wing;
  return `<line x1="${x1}" y1="${y1}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${UT.arrow}" stroke-width="4.2" stroke-linecap="round"/><polygon points="${pts([[x2, y2], [bx + nx, by + ny], [bx - nx, by - ny]])}" fill="${UT.arrow}"/>`;
}

// ── 쌓기나무(빗각 그림: 앞면 정사각형, 깊이는 오른쪽 위로 1/3) ──
// 정육면체 [c 가로, d 깊이(0 = 앞), L 층] 를 뒤 → 앞, 왼쪽 → 오른쪽, 아래 → 위 순으로 그린다.
function cubeFaces(c, d, L, ox, oy, s, k) {
  const X = ox + c * s + d * k, Y = oy - L * s - d * k;
  const stroke = `stroke="${UT.cubeLine}" stroke-width="1.1" stroke-linejoin="round"`;
  return `<polygon points="${pts([[X + s, Y], [X + s, Y - s], [X + s + k, Y - s - k], [X + s + k, Y - k]])}" fill="${UT.cubeSide}" ${stroke}/>`
    + `<polygon points="${pts([[X, Y - s], [X + k, Y - s - k], [X + s + k, Y - s - k], [X + s, Y - s]])}" fill="${UT.cubeTop}" ${stroke}/>`
    + `<rect x="${X}" y="${Y - s}" width="${s}" height="${s}" fill="${UT.cubeFront}" ${stroke}/>`;
}
const cubesMarkup = (list, ox, oy, s, k) => [...list].sort((a, b) => b[1] - a[1] || a[0] - b[0] || a[2] - b[2]).map(([c, d, L]) => cubeFaces(c, d, L, ox, oy, s, k)).join("");
// 상자 테두리(앞면 네 변 + 보이는 뒤쪽 변) — 원문처럼 쌓기나무 위에 겹쳐 그린다
function boxFrame(n, ox, oy, s, k) {
  const S = n * s, K = n * k;
  const segs = [[ox, oy, ox + S, oy], [ox, oy, ox, oy - S], [ox, oy - S, ox + S, oy - S], [ox + S, oy, ox + S, oy - S],
    [ox, oy - S, ox + K, oy - S - K], [ox + K, oy - S - K, ox + S + K, oy - S - K], [ox + S, oy - S, ox + S + K, oy - S - K],
    [ox + S + K, oy - S - K, ox + S + K, oy - K], [ox + S, oy, ox + S + K, oy - K]];
  return segs.map(([a, b, c, d]) => line(a, b, c, d, { stroke: UT.line, width: 2.6 })).join("");
}
const fullCubes = (n) => Array.from({ length: n * n * n }, (_, i) => [i % n, Math.floor(i / n) % n, Math.floor(i / n / n)]);

// ── 칸 그리기 ──
// 칸 그림(위·앞·옆에서 본 모양): cells[row][col] 1 = 칠한 칸, rows 는 위에서 아래로
function viewCells(x, y, cells, size, { values = null, dashed = false } = {}) {
  let body = "";
  cells.forEach((row, r) => row.forEach((on, c) => {
    const cx = x + c * size, cy = y + r * size;
    if (on) body += `<rect x="${cx}" y="${cy}" width="${size}" height="${size}" fill="${UT.cubeTop}" stroke="${UT.cubeLine}" stroke-width="1.4"/>`;
    else if (dashed) body += `<rect x="${cx}" y="${cy}" width="${size}" height="${size}" fill="#fff" stroke="${UT.soft}" stroke-width="1.1" stroke-dasharray="4 3"/>`;
    const value = values?.[r]?.[c];
    if (value != null && value !== "") body += text(cx + size / 2, cy + size / 2 + 1, value, { size: size * 0.5, weight: 600, fill: ANS });
  }));
  return body;
}
const heightsToCells = (heights, n) => Array.from({ length: n }, (_, r) => heights.map((h) => (h >= n - r ? 1 : 0)));
const blankCells = (n) => Array.from({ length: n }, () => Array(n).fill(0));

// 수 칸(표) — 보라 테두리
function numberGrid(x, y, n, cell, values, { fill = null, size = 17 } = {}) {
  let body = `<rect x="${x}" y="${y}" width="${n * cell}" height="${n * cell}" fill="#fff" stroke="${UT.box}" stroke-width="1.8"/>`;
  for (let i = 1; i < n; i += 1) body += line(x + i * cell, y, x + i * cell, y + n * cell, { stroke: UT.box, width: 1.3 }) + line(x, y + i * cell, x + n * cell, y + i * cell, { stroke: UT.box, width: 1.3 });
  values.forEach((value, index) => {
    const cx = x + (index % n) * cell + cell / 2, cy = y + Math.floor(index / n) * cell + cell / 2;
    if (value != null && value !== "") body += text(cx, cy + 1, value, { size: CIRCLED.includes(value) ? size + 1 : size, weight: 500 });
    else if (fill?.[index] != null) body += text(cx, cy + 1, fill[index], { size, weight: 600, fill: ANS });
  });
  return body;
}

// 표(머리 줄 색칠) — 열 너비 목록, 행 높이
function table(x, y, widths, rowHeights, cellsText, { headRow = true, headCol = false, size = 14, fill = null } = {}) {
  let body = "";
  let cy = y;
  rowHeights.forEach((h, r) => {
    let cx = x;
    widths.forEach((w, c) => {
      const head = (headRow && r === 0) || (headCol && c === 0);
      body += `<rect x="${cx}" y="${cy}" width="${w}" height="${h}" fill="${head ? UT.purpleSoft : "#fff"}" stroke="${UT.box}" stroke-width="1.3"/>`;
      const value = cellsText[r]?.[c];
      if (value) body += text(cx + w / 2, cy + h / 2 + 1, value, { size: CIRCLED.includes(value) ? size + 1 : size, weight: head ? 600 : 500 });
      else if (fill?.[r]?.[c]) body += text(cx + w / 2, cy + h / 2 + 1, fill[r][c], { size, weight: 600, fill: ANS });
      cx += w;
    });
    cy += h;
  });
  return body;
}

// 답 칸(네모 + 단위)
function answerBox(cx, y, unit = "cm²", value = "") {
  return `${box(cx - 30, y, 46, 30, { radius: 5 })}${value !== "" ? text(cx - 7, y + 16, value, { size: 16, weight: 600, fill: ANS }) : ""}${text(cx + 20, y + 17, unit, { size: 15, weight: 500, anchor: "start" })}`;
}

// ── 문항별 그림 ──
// 1 규칙 퍼즐(굵은 선으로 나눈 4×4)
function sudoku(v) {
  const W = 360, cell = 46, n = v.size;
  const cond = conditionBox(8, 4, W - 16, v.clues);
  const x0 = (W - n * cell) / 2, y0 = cond.height + 22;
  let body = cond.markup + `<rect x="${x0}" y="${y0}" width="${n * cell}" height="${n * cell}" fill="#fff"/>`;
  const region = (r, c) => v.regions[r * n + c];
  for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
    if (c < n - 1 && region(r, c) === region(r, c + 1)) body += line(x0 + (c + 1) * cell, y0 + r * cell, x0 + (c + 1) * cell, y0 + (r + 1) * cell, { stroke: UT.soft, width: 1.2, dash: "4 3" });
    if (r < n - 1 && region(r, c) === region(r + 1, c)) body += line(x0 + c * cell, y0 + (r + 1) * cell, x0 + (c + 1) * cell, y0 + (r + 1) * cell, { stroke: UT.soft, width: 1.2, dash: "4 3" });
  }
  for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
    if (c < n - 1 && region(r, c) !== region(r, c + 1)) body += line(x0 + (c + 1) * cell, y0 + r * cell, x0 + (c + 1) * cell, y0 + (r + 1) * cell, { stroke: UT.purple, width: 3 });
    if (r < n - 1 && region(r, c) !== region(r + 1, c)) body += line(x0 + c * cell, y0 + (r + 1) * cell, x0 + (c + 1) * cell, y0 + (r + 1) * cell, { stroke: UT.purple, width: 3 });
    const given = v.given[r * n + c], filled = v.fill?.[r * n + c];
    if (given != null) body += text(x0 + c * cell + cell / 2, y0 + r * cell + cell / 2 + 1, given, { size: 19, weight: 500 });
    else if (filled != null) body += text(x0 + c * cell + cell / 2, y0 + r * cell + cell / 2 + 1, filled, { size: 19, weight: 600, fill: ANS });
  }
  body += `<rect x="${x0}" y="${y0}" width="${n * cell}" height="${n * cell}" fill="none" stroke="${UT.purple}" stroke-width="3"/>`;
  return svg(W, y0 + n * cell + 6, "굵은 선으로 나눈 4칸 4줄 수 퍼즐", body, 360);
}

// 2 수가 적힌 판을 모양이 같은 4조각으로(점선을 따라)
function sumPartition(v) {
  const n = v.grid.length, cell = 52, pad = 6, W = n * cell + pad * 2;
  const x = (c) => pad + c * cell, y = (r) => pad + r * cell;
  const piece = (r, c) => v.fill?.pieces?.[r * n + c];
  let body = `<rect x="${pad}" y="${pad}" width="${n * cell}" height="${n * cell}" fill="#fff"/>`;
  if (v.fill?.pieces) v.grid.forEach((row, r) => row.forEach((_, c) => { body += `<rect x="${x(c)}" y="${y(r)}" width="${cell}" height="${cell}" fill="${UT.pastel[piece(r, c) % 4]}"/>`; }));
  for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
    if (c < n - 1) body += line(x(c + 1), y(r), x(c + 1), y(r + 1), { stroke: UT.soft, width: 1.2, dash: "4 3" });
    if (r < n - 1) body += line(x(c), y(r + 1), x(c + 1), y(r + 1), { stroke: UT.soft, width: 1.2, dash: "4 3" });
  }
  v.grid.forEach((row, r) => row.forEach((value, c) => { body += text(x(c) + cell / 2, y(r) + cell / 2 + 1, value, { size: 19, weight: 500 }); }));
  if (v.fill?.pieces) for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) {
    if (c < n - 1 && piece(r, c) !== piece(r, c + 1)) body += line(x(c + 1), y(r), x(c + 1), y(r + 1), { stroke: INK, width: 3.6 });
    if (r < n - 1 && piece(r, c) !== piece(r + 1, c)) body += line(x(c), y(r + 1), x(c + 1), y(r + 1), { stroke: INK, width: 3.6 });
  }
  body += `<rect x="${pad}" y="${pad}" width="${n * cell}" height="${n * cell}" fill="none" stroke="${INK}" stroke-width="${v.fill?.pieces ? 3.6 : 2.2}"/>`;
  return svg(W, W, "수가 적힌 4칸 4줄 판", body, 230);
}

// 3 모양과 크기가 같은 4조각으로 나누기: (1) 정사각형 5개 모양 (2) 정삼각형 3개로 된 사다리꼴
function dissect(v) {
  const W = 360, u = 52;
  // (1) 위 줄 2칸, 아래 줄 3칸
  const ax = 96, ay = 8;
  const shape1 = [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]].map(([a, b]) => [ax + a * u, ay + b * u]);
  let body = text(18, ay + 12, "(1)", { size: 14, weight: 500 });
  body += poly(shape1, { fill: UT.blueSoft, stroke: UT.blue, width: 1.8 });
  for (const [a, b, c, d] of [[1, 0, 1, 2], [2, 1, 2, 2], [0, 1, 2, 1]]) body += line(ax + a * u, ay + b * u, ax + c * u, ay + d * u, { stroke: UT.blue, width: 1.1 });
  // (2) 아래 변 2, 윗변 1 (작은 정삼각형 한 변 = side)
  const side = 105, h = side * Math.sqrt(3) / 2, bx = 72, by = ay + 2 * u + 46 + h;
  const P = (a, b) => [bx + a * side, by - b * h];
  body += text(18, by - h + 12, "(2)", { size: 14, weight: 500 });
  body += poly([P(0, 0), P(2, 0), P(1.5, 1), P(0.5, 1)], { fill: "#dff3ff", stroke: "#1aa3c9", width: 1.8 });
  body += line(...P(0.5, 1), ...P(1, 0), { stroke: "#1aa3c9", width: 1.2, dash: "4 3" }) + line(...P(1.5, 1), ...P(1, 0), { stroke: "#1aa3c9", width: 1.2, dash: "4 3" });
  if (v.fill) {
    const thick = { stroke: INK, width: 3.4 };
    for (const [a, b, c, d] of [[1.5, 0, 1.5, 0.5], [1, 0.5, 1.5, 0.5], [1, 0.5, 1, 1.5], [1, 1.5, 2, 1.5], [1.5, 1.5, 1.5, 2], [0, 1, 1, 1], [2, 1, 2, 1.5]]) body += line(ax + a * u, ay + b * u, ax + c * u, ay + d * u, thick);
    body += poly(shape1, { stroke: INK, width: 3.4 });
    for (const [a, b] of [[[0.5, 1], [0.75, 0.5]], [[0.75, 0.5], [0.5, 0]], [[0.75, 0.5], [1.25, 0.5]], [[1.5, 1], [1.25, 0.5]], [[1.25, 0.5], [1.5, 0]]]) body += line(...P(...a), ...P(...b), thick);
    body += poly([P(0, 0), P(2, 0), P(1.5, 1), P(0.5, 1)], { stroke: INK, width: 3.4 });
  }
  return svg(W, by + 6, "4조각으로 나눌 두 도형", body, 340);
}

// 4·5·6 모눈 위 도형의 넓이
function areaPanel(p, x0, y0, cell) {
  let body = "";
  const P = ([a, b]) => [x0 + a * cell, y0 + b * cell];
  for (const shape of p.shapes) {
    if (shape.hole) {
      const outer = shape.pts.map(P), inner = shape.hole.map(P);
      body += `<path d="M${pts(outer).split(" ").join("L")}Z M${pts(inner).split(" ").join("L")}Z" fill="${SHADE}" fill-opacity="0.55" fill-rule="evenodd" stroke="none"/>`;
    } else body += poly(shape.pts.map(P), { fill: SHADE, stroke: "none", width: 0, opacity: 0.55 });
  }
  for (let i = 0; i <= p.cols; i += 1) body += line(x0 + i * cell, y0, x0 + i * cell, y0 + p.rows * cell, { stroke: GRID, width: 1 });
  for (let j = 0; j <= p.rows; j += 1) body += line(x0, y0 + j * cell, x0 + p.cols * cell, y0 + j * cell, { stroke: GRID, width: 1 });
  for (const shape of p.shapes) {
    body += poly(shape.pts.map(P), { stroke: "#333", width: p.thick ? 2.4 : 1.6 });
    if (shape.hole) body += poly(shape.hole.map(P), { stroke: "#333", width: p.thick ? 2.4 : 1.6 });
  }
  return body;
}
function area(v) {
  const W = 360;
  const many = v.panels.length;
  const cell = v.cell;
  let body = "";
  let bottom = 0;
  const widthEach = W / many;
  v.panels.forEach((p, index) => {
    const gw = p.cols * cell;
    const x0 = index * widthEach + (widthEach - gw) / 2 + (p.label ? 6 : 0);
    const y0 = p.label ? 24 : 6;
    if (p.label) body += text(x0 - 4, 11, p.label, { size: 14, weight: 500, anchor: "start" });
    body += areaPanel(p, x0, y0, cell);
    const by = y0 + p.rows * cell + 14;
    (p.boxes || []).forEach((bx, k) => { body += answerBox(x0 + bx * cell, by, "cm²", v.fill?.[index]?.[k] ?? ""); });
    bottom = Math.max(bottom, by + 34);
  });
  return svg(W, bottom, "모눈 위에 그린 도형", body, v.maxWidth || 360);
}

// 7 상자 속 쌓기나무 → 다 채운 상자
function cubeBox(v) {
  const s = 23, k = s / 3, n = v.n;
  const S = n * s + n * k;
  const left = 6, oy = S + 6;
  const right = left + S + 46;
  let body = cubesMarkup(v.cubes, left, oy, s, k) + boxFrame(n, left, oy, s, k);
  body += blockArrow(left + S + 12, oy - S / 2 + 4, 1);
  body += cubesMarkup(fullCubes(n), right, oy, s, k) + boxFrame(n, right, oy, s, k);
  return svg(right + S + 6, oy + 6, "상자 속에 넣은 쌓기나무와 가득 채운 상자", body, 330);
}

// 8 벽 모퉁이에 쌓은 쌓기나무
function cubeCorner(v) {
  const s = 27, k = s / 3;
  const { cMax, dMin, dMax, lMax } = v.walls;
  const ox = 8 - dMin * k + 4, oy = 8 + lMax * s + dMax * k;
  const P = (c, d, L) => [ox + c * s + d * k, oy - L * s - d * k];
  let body = poly([P(0, dMin, 0), P(0, dMax, 0), P(cMax, dMax, 0), P(cMax, dMin, 0)], { fill: "#f7f2e7", stroke: "none", width: 0 });
  body += poly([P(0, dMin, 0), P(0, dMax, 0), P(0, dMax, lMax), P(0, dMin, lMax)], { fill: "#ebe3d2", stroke: "none", width: 0 });
  body += poly([P(0, dMax, 0), P(cMax, dMax, 0), P(cMax, dMax, lMax), P(0, dMax, lMax)], { fill: "#f1ece1", stroke: "none", width: 0 });
  body += line(...P(0, dMax, 0), ...P(0, dMax, lMax), { stroke: UT.soft, width: 1.4 }) + line(...P(0, dMax, 0), ...P(cMax, dMax, 0), { stroke: UT.soft, width: 1.4 }) + line(...P(0, dMax, 0), ...P(0, dMin, 0), { stroke: UT.soft, width: 1.4 });
  body += cubesMarkup(v.cubes, ox, oy, s, k);
  const [ex, ey] = P(cMax, dMin, 0);
  return svg(Math.ceil(ex + (dMax - dMin) * k + 8), Math.ceil(ey + 8), "벽 모퉁이에 계단처럼 쌓은 쌓기나무", body, 300);
}

// 9 층별로 위에서 본 모양 → 앞·옆에서 본 모양 그리기
function layers(v) {
  const W = 360, cell = 30, n = v.n, g = n * cell, gap = (W - 3 * g - 2 * 30) / 2;
  let body = "";
  v.layers.forEach((layer, index) => {
    const x = gap + index * (g + 30);
    const cells = layer.map((row) => row.slice());
    cells.forEach((row, r) => row.forEach((on, c) => {
      const cx = x + c * cell, cy = 6 + r * cell;
      body += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="${on ? UT.cubeTop : "#fff"}" stroke="${on ? UT.cubeLine : UT.soft}" stroke-width="${on ? 1.4 : 1.1}"${on ? "" : ' stroke-dasharray="4 3"'}/>`;
    }));
    body += text(x + g / 2, 6 + g + 16, v.labels[index], { size: 14, weight: 500 });
    if (index < 2) body += blockArrow(x + g + 5, 6 + g / 2, 0.9);
  });
  const y2 = 6 + g + 40;
  const fills = [v.fill?.front, v.fill?.side];
  v.views.forEach((label, index) => {
    const x = W / 2 + (index ? 40 : -40 - g);
    body += viewCells(x, y2, fills[index] ? heightsToCells(fills[index], n) : blankCells(n), cell, { dashed: true });
    body += text(x + g / 2, y2 + g + 16, label, { size: 14, weight: 500 });
  });
  return svg(W, y2 + g + 28, "층마다 위에서 본 모양과 그릴 자리", body, 360);
}

// 10 쌓기나무를 보고 위·앞·오른쪽 옆 모양과 최소 개수
function cubeViews(v) {
  const W = 360, s = 30, k = 10;
  const ox = 120, oy = 172;
  let body = cubesMarkup(v.cubes, ox, oy, s, k);
  body += pointer(ox + 70, 26, ox + 70, 48) + word(ox + 70, 11, "위", { size: 15 });
  body += pointer(ox + 168, oy - 74, ox + 146, oy - 74) + word(ox + 186, oy - 74, "옆", { size: 15 });
  body += pointer(ox - 22, oy + 30, ox - 4, oy + 16) + word(ox - 34, oy + 40, "앞", { size: 15 });
  const cell = 30, n = v.n, g = n * cell, gap = (W - 3 * g) / 4;
  const y2 = oy + 62;
  const fills = [v.fill?.top, v.fill?.front ? heightsToCells(v.fill.front, n) : null, v.fill?.side ? heightsToCells(v.fill.side, n) : null];
  v.views.forEach((label, index) => {
    const x = gap + index * (g + gap);
    const cells = index === 0 && fills[0] ? fills[0].map((row) => row.map((value) => (value ? 1 : 0))) : fills[index] || blankCells(n);
    body += viewCells(x, y2, cells, cell, { dashed: true, values: index === 0 ? fills[0] : null });
    body += text(x + g / 2, y2 + g + 16, label, { size: 14, weight: 500 });
  });
  const y3 = y2 + g + 36;
  body += `<rect x="70" y="${y3}" width="220" height="46" rx="8" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.4"/>`;
  body += text(84, y3 + 23, "쌓기나무의 개수 :", { size: 15, weight: 500, anchor: "start" }) + box(212, y3 + 8, 54, 30, { radius: 5 });
  if (v.fill?.count != null) body += text(239, y3 + 24, v.fill.count, { size: 16, weight: 600, fill: ANS });
  return svg(W, y3 + 52, "쌓기나무 모양과 위·앞·오른쪽 옆 그릴 자리", body, 360);
}

// 11·12 위·앞·오른쪽 옆에서 본 모양
function viewSet(set, x, y, cell, n) {
  const g = n * cell, gap = 28;
  const parts = [set.top, heightsToCells(set.front, n), heightsToCells(set.side, n)];
  let body = "";
  ["위", "앞", "오른쪽 옆"].forEach((label, index) => {
    const px = x + index * (g + gap);
    body += viewCells(px, y, parts[index], cell);
    body += text(px + g / 2, y + g + 18, label, { size: 14, weight: 500 });
  });
  return body;
}
function views(v) {
  const n = v.n, cell = v.cell, g = n * cell, gap = 28;
  const labelW = v.sets[0].label ? 34 : 0;
  const W = Math.max(360, labelW + 3 * g + 2 * gap + 12);
  const x0 = labelW + (W - labelW - (3 * g + 2 * gap)) / 2;
  let body = "";
  let y = 6;
  v.sets.forEach((set) => {
    if (set.label) body += text(4, y + 10, set.label, { size: 14, weight: 500, anchor: "start" });
    body += viewSet(set, x0, y, cell, n);
    y += g + 50;
  });
  if (v.maxmin) {
    y += 6;
    ["최대", "최소"].forEach((label, index) => {
      const ly = y + index * 40;
      body += word(W / 2 - 66, ly + 10, label, { size: 15 }) + line(W / 2 - 34, ly + 22, W / 2 + 34, ly + 22, { stroke: INK, width: 1.3 }) + word(W / 2 + 50, ly + 10, "개", { size: 15 });
      const value = v.fill?.[index];
      if (value != null) body += text(W / 2, ly + 8, value, { size: 16, weight: 600, fill: ANS });
    });
    y += 82;
  }
  return svg(W, y - 18, "위·앞·오른쪽 옆에서 본 모양", body, 360);
}

// 13 3×3 마방진 두 개 + 「합 :」
function magicPair(v) {
  const W = 360, cell = 44, n = 3, g = n * cell;
  let body = "";
  v.grids.forEach((grid, index) => {
    const x = 30 + index * (g + 46);
    body += text(x - 22, 12, `(${index + 1})`, { size: 13, weight: 500 });
    body += numberGrid(x, 6, n, cell, grid, { fill: v.fill?.grids?.[index] });
    const y = 6 + g + 12;
    body += word(x + 22, y + 15, "합 :", { size: 15 }) + box(x + 44, y, 54, 30, { radius: 5 });
    if (v.fill?.sums?.[index] != null) body += text(x + 71, y + 16, v.fill.sums[index], { size: 16, weight: 600, fill: ANS });
  });
  return svg(W, 6 + g + 50, "빈칸을 채울 마방진 두 개", body, 360);
}

// 14·15 수가 적힌 표
function grid(v) {
  const g = v.n * v.cell;
  return svg(g + 12, g + 12, "수가 적힌 표", numberGrid(6, 6, v.n, v.cell, v.cells, { size: 19 }), v.maxWidth || g + 12);
}

// 16 세 수 삼각진 네 개(합 12·13·14·15)
const TRI6 = [[0, -50], [-27, -4], [27, -4], [-54, 42], [0, 42], [54, 42]];
function triangles(v) {
  const W = 360;
  let body = cards(v.cards, W, 4, 30);
  v.sums.forEach((sum, index) => {
    const cx = 95 + (index % 2) * 170, cy = 110 + Math.floor(index / 2) * 142;
    const P = TRI6.map(([a, b]) => [cx + a, cy + b]);
    body += [[0, 3], [0, 5], [3, 5]].map(([a, b]) => line(P[a][0], P[a][1], P[b][0], P[b][1], { stroke: UT.box, width: 1.5 })).join("");
    body += P.map(([x, y], i) => circle(x, y, 16, { fill: [0, 3, 5].includes(i) ? UT.tint : "#fff" }) + (v.fill?.[index]?.[i] != null ? text(x, y + 1, v.fill[index][i], { size: 16, weight: 600, fill: ANS }) : "")).join("");
    body += text(cx, cy + 15, sum, { size: 17, weight: 600 });
  });
  return svg(W, 316, "합이 12, 13, 14, 15인 삼각진", body, 340);
}

// 17 오각진(꼭짓점 다섯 + 변 가운데 다섯) — 위 꼭짓점부터 시계 방향
function pentagon(v) {
  const W = 360, cx = 180, cy = 172, R = 112;
  const vertices = Array.from({ length: 5 }, (_, i) => [cx + Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 5) * R, cy + Math.sin(-Math.PI / 2 + i * 2 * Math.PI / 5) * R]);
  const spots = vertices.flatMap((p, i) => { const q = vertices[(i + 1) % 5]; return [p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]]; });
  let body = cards(v.cards, W, 4, 28);
  body += poly(vertices, { stroke: UT.box, width: 1.5 });
  body += spots.map(([x, y], i) => circle(x.toFixed(1), y.toFixed(1), 21, { fill: i % 2 ? "#fff" : UT.tint }) + (v.shown[i] != null ? text(x.toFixed(1), (y + 1).toFixed(1), v.shown[i], { size: 18, weight: 500 }) : v.fill?.[i] != null ? text(x.toFixed(1), (y + 1).toFixed(1), v.fill[i], { size: 18, weight: 600, fill: ANS }) : "")).join("");
  body += text(cx, cy + 6, `합 : ${v.sum}`, { size: 18, weight: 500 });
  return svg(W, cy + R * Math.cos(Math.PI / 5) + 28, "한 줄의 합이 16인 오각진", body, 330);
}

// 18 원과 두 직선 위의 다섯 원
function circleCross(v) {
  const W = 360, cx = 180, cy = 168, r = 100;
  const spots = [[cx, cy - r], [cx - r, cy], [cx, cy], [cx + r, cy], [cx, cy + r]];
  let body = cards(v.cards, W, 4, 32);
  body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${UT.box}" stroke-width="1.5"/>` + line(cx, cy - r, cx, cy + r, { stroke: UT.box, width: 1.5 }) + line(cx - r, cy, cx + r, cy, { stroke: UT.box, width: 1.5 });
  body += spots.map(([x, y], i) => circle(x, y, 24) + (v.fill?.[i] != null ? text(x, y + 1, v.fill[i], { size: 17, weight: 600, fill: ANS }) : "")).join("");
  return svg(W, cy + r + 30, "원 둘레와 두 직선 위의 다섯 원", body, 320);
}

// 19 조건만
function conditions(v) {
  const W = 360;
  const cond = conditionBox(8, 4, W - 16, v.clues, { size: 14 });
  return svg(W, cond.height + 10, "조건", cond.markup, 360);
}

// 20 둥근 탁자와 다섯 자리
function roundTable(v) {
  const W = 360;
  const cond = conditionBox(8, 4, W - 16, v.clues, { size: 14 });
  const cx = 180, cy = cond.height + 150, R = 110;
  let body = cond.markup + `<circle cx="${cx}" cy="${cy}" r="66" fill="#f6e6c8" stroke="#bf8a42" stroke-width="1.8"/>`;
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    body += circle(x.toFixed(1), y.toFixed(1), 27) + (v.fill?.[i] ? text(x.toFixed(1), (y + 1).toFixed(1), v.fill[i], { size: 14, weight: 600, fill: ANS }) : "");
  }
  return svg(W, cy + R * Math.cos(Math.PI / 5) + 34, "둥근 탁자 둘레의 다섯 자리", body, 340);
}

// 21·23 조건 + 등수 표
function rankTable(v) {
  const W = 360;
  const cond = conditionBox(8, 4, W - 16, v.clues, { size: 14, bullets: v.bullets !== false });
  const w = v.cellWidth, total = w * v.heads.length, x = (W - total) / 2, y = cond.height + 22;
  const body = cond.markup + table(x, y, v.heads.map(() => w), [36, 42], [v.heads, v.heads.map(() => "")], { fill: v.fill ? [[], v.fill] : null });
  return svg(W, y + 84, "조건과 등수 표", body, 360);
}

// 22·24 조건 + 가로세로 표
function matrixTable(v) {
  const W = 360;
  const cond = conditionBox(8, 4, W - 16, v.clues, { size: 14, bullets: v.bullets !== false });
  const widths = v.columns.map((_, i) => (i === 0 ? v.firstWidth : v.cellWidth)).map((w, i) => (v.lastWidth && i === v.columns.length - 1 ? v.lastWidth : w));
  const total = widths.reduce((a, b) => a + b, 0), x = (W - total) / 2, y = cond.height + 20;
  const rows = [v.columns, ...v.rows.map((name) => [name, ...v.columns.slice(1).map(() => "")])];
  const body = cond.markup + table(x, y, widths, rows.map(() => v.rowHeight), rows, { headCol: true });
  return svg(W, y + rows.length * v.rowHeight + 6, "조건과 표", body, 360);
}

// 25 네 수 삼각진(원 9개)
function triangle9(v) {
  const W = 360, cx = 180, step = 54, r = 22;
  const top = 76;
  const row = (i) => top + i * 46;
  const spots = [[cx, row(0)], [cx - step / 2, row(1)], [cx - step, row(2)], [cx - step * 1.5, row(3)], [cx - step / 2, row(3)], [cx + step / 2, row(3)], [cx + step * 1.5, row(3)], [cx + step, row(2)], [cx + step / 2, row(1)]];
  let body = cards(v.cards, W, 4, 32);
  body += [[0, 3], [3, 6], [6, 0]].map(([a, b]) => line(spots[a][0], spots[a][1], spots[b][0], spots[b][1], { stroke: UT.box, width: 1.5 })).join("");
  body += spots.map(([x, y], i) => circle(x, y, r, { fill: [0, 3, 6].includes(i) ? UT.tint : "#fff" }) + (v.fill?.[i] != null ? text(x, y + 1, v.fill[i], { size: 17, weight: 600, fill: ANS }) : "")).join("");
  body += text(cx, row(2), v.sum, { size: 18, weight: 500 });
  return svg(W, row(3) + r + 8, "한 변의 합이 19인 삼각진", body, 320);
}

// 답 그림 여러 개를 나란히(답안지용)
function group(v) {
  return `<div style="display:grid;grid-template-columns:repeat(${v.columns || v.items.length},minmax(0,1fr));gap:8px 12px;width:100%">${v.items.map((item) => `<figure style="margin:0;min-width:0">${item.label ? `<figcaption style="margin:0 0 4px;color:${INK};font-size:12px;font-weight:700">${esc(item.label)}</figcaption>` : ""}${figure(item.visual)}</figure>`).join("")}</div>`;
}

const DRAW = { sudoku, sumPartition, dissect, area, cubeBox, cubeCorner, layers, cubeViews, views, magicPair, grid, triangles, pentagon, circleCross, conditions, roundTable, rankTable, matrixTable, triangle9, group };
export function figure(visual) {
  const draw = visual && DRAW[visual.type];
  return draw ? draw(visual) : "";
}

// ── 원문 문항 ──
// 쌓기나무 그림은 원문 그림에서 보이는 쌓기나무만 [가로, 깊이(0 = 앞), 층] 으로 적는다.
const BOX_CUBES = [[0, 3, 3], [1, 3, 3], [2, 3, 2], [3, 3, 0], [3, 3, 1], [3, 3, 2], [0, 2, 3], [1, 2, 2], [2, 2, 1], [3, 2, 0], [3, 2, 1], [0, 1, 2], [0, 1, 3], [1, 1, 1], [2, 1, 0], [3, 1, 0], [0, 0, 0], [0, 0, 1], [0, 0, 2], [0, 0, 3], [1, 0, 0], [2, 0, 0]];
const STAIR_CUBES = [[0, 3, 3], [1, 3, 3], [2, 3, 2], [3, 3, 0], [3, 3, 1], [0, 2, 3], [1, 2, 2], [2, 2, 1], [3, 2, 0], [0, 1, 2], [1, 1, 1], [2, 1, 0], [0, 0, 0], [0, 0, 1], [1, 0, 0]];
const VIEW_CUBES = [[0, 2, 1], [1, 2, 1], [1, 2, 2], [2, 2, 0], [0, 1, 1], [1, 1, 0], [2, 1, 0], [0, 0, 0]];

const QUESTIONS = {
  1: {
    prompt: "주어진 규칙에 맞게 빈칸에 알맞은 수를 채워 퍼즐을 완성하시오.",
    visual: { type: "sudoku", size: 4, clues: ["각 가로줄과 세로줄에는 1, 2, 3, 4가 한 번씩만 들어갑니다.", "굵은 선으로 나누어진 네 부분에도 1, 2, 3, 4가 한 번씩만 들어갑니다."],
      regions: [0, 1, 1, 1, 0, 0, 1, 2, 0, 3, 2, 2, 3, 3, 3, 2], given: [null, null, 2, null, 1, null, null, null, null, null, null, null, 4, null, null, 3] },
    responseKind: "fill"
  },
  2: {
    prompt: "준영이는 다음과 같은 도형을 점선을 따라서 크기와 모양이 같은 4개의 도형으로 나누려고 합니다. 각 도형에 들어있는 수들의 합이 같도록 나누어 보시오.",
    visual: { type: "sumPartition", grid: [[1, 4, 3, 6], [5, 1, 2, 3], [8, 1, 7, 1], [2, 9, 3, 4]] },
    responseKind: "drawing"
  },
  3: {
    prompt: "다음 도형을 크기와 모양이 같은 4조각으로 나누어 보시오.",
    visual: { type: "dissect" },
    responseKind: "drawing"
  },
  4: {
    prompt: "다음은 한 변의 길이가 1cm인 모눈 위에 도형을 그린 것입니다. 색칠된 도형의 넓이를 구하시오.",
    visual: { type: "area", cell: 36, panels: [
      { label: "(1)", cols: 4, rows: 4, shapes: [{ pts: [[4, 0], [0, 2], [1, 4]] }], boxes: [2] },
      { label: "(2)", cols: 4, rows: 4, shapes: [{ pts: [[1, 0], [4, 2], [3, 4], [0, 4]] }], boxes: [2] }
    ] },
    responseKind: "fill"
  },
  5: {
    prompt: "다음은 한 변의 길이가 1cm인 모눈 위에 도형을 그린 것입니다. 색칠된 도형의 넓이를 각각 구하시오.",
    visual: { type: "area", cell: 46, panels: [
      { cols: 7, rows: 4, thick: true, boxes: [1.5, 5.5], shapes: [
        { pts: [[0, 0], [2, 0], [3, 2], [2, 2], [1, 3], [0, 2]] },
        { pts: [[4, 0], [5, 1], [6, 1], [7, 0], [7, 3], [6, 3], [7, 4], [4, 4], [5, 3], [4, 3]] }
      ] }
    ] },
    responseKind: "fill"
  },
  6: {
    prompt: "가로, 세로 한 칸의 간격이 1cm인 모눈종이에서 다음과 같이 정사각형을 그렸습니다. 색칠한 부분의 넓이를 구하시오.",
    visual: { type: "area", cell: 36, maxWidth: 300, panels: [
      { cols: 7, rows: 7, boxes: [3.5], shapes: [{ pts: [[2, 1], [6, 2], [5, 6], [1, 5]], hole: [[4, 2], [5, 4], [3, 5], [2, 3]] }] }
    ] },
    responseKind: "fill"
  },
  7: {
    prompt: "다음 그림은 정육면체 모양의 상자 속에 크기가 같은 상자 모양의 쌓기나무를 여러 개 채워 놓은 것입니다. 이 상자를 오른쪽 그림과 같이 완전히 채우려면 쌓기나무가 몇 개 더 필요한지 구하시오.",
    visual: { type: "cubeBox", n: 4, cubes: BOX_CUBES }
  },
  8: {
    prompt: "다음 그림에서 보이지 않는 쌓기나무의 개수를 구하시오.",
    visual: { type: "cubeCorner", cubes: STAIR_CUBES, walls: { cMax: 5.9, dMin: -3.1, dMax: 4, lMax: 5.9 } }
  },
  9: {
    prompt: "다음은 쌓기나무를 3층으로 쌓았을 때의 각 층의 쌓기나무를 위에서 본 모양입니다. 이렇게 쌓아 올린 쌓기나무의 앞에서 본 모양과 옆에서 본 모양을 그리시오.",
    visual: { type: "layers", n: 3, labels: ["1층", "2층", "3층"], views: ["앞", "오른쪽 옆"],
      layers: [[[1, 1, 1], [1, 1, 0], [1, 0, 0]], [[1, 1, 1], [1, 1, 0], [0, 0, 0]], [[1, 1, 0], [0, 1, 0], [0, 0, 0]]] },
    responseKind: "drawing"
  },
  10: {
    prompt: "쌓기나무로 쌓은 모양을 보고 위, 앞, 오른쪽 옆에서 본 모양을 그린 후, 위에서 본 모양의 각 칸에 쌓여 있는 쌓기나무의 개수를 써넣고, 쌓기나무의 최소 개수를 구하시오.",
    visual: { type: "cubeViews", n: 3, cubes: VIEW_CUBES, views: ["위", "앞", "오른쪽 옆"] },
    responseKind: "drawing"
  },
  11: {
    prompt: "쌓기나무를 위, 앞, 오른쪽 옆에서 본 모양이 다음과 같을 때, 쌓기나무의 개수를 구하시오.",
    visual: { type: "views", n: 3, cell: 28, sets: [
      { label: "(1)", top: [[0, 1, 1], [0, 1, 1], [1, 1, 0]], front: [2, 1, 3], side: [2, 1, 3] },
      { label: "(2)", top: [[1, 1, 0], [1, 1, 1], [0, 1, 0]], front: [1, 3, 1], side: [3, 2, 1] }
    ] }
  },
  12: {
    prompt: "다음은 쌓기나무를 쌓아서 만든 모양을 위, 앞, 오른쪽 옆에서 본 모양입니다. 모양을 만드는데 필요한 쌓기나무의 최대, 최소 개수를 구하시오.",
    visual: { type: "views", n: 4, cell: 24, maxmin: true, sets: [
      { top: [[0, 0, 1, 0], [0, 1, 1, 0], [1, 1, 1, 1], [1, 1, 1, 1]], front: [1, 4, 3, 1], side: [4, 3, 1, 1] }
    ] },
    responseKind: "fill"
  },
  13: {
    prompt: "다음 빈칸에 적당한 수를 넣어 가로, 세로, 대각선 방향으로 세 수의 합이 같게 만들고, 한 줄의 합을 구하시오.",
    visual: { type: "magicPair", grids: [[null, 3, 8, 5, null, null, null, null, null], [null, null, null, null, null, 8, 5, null, 3]] },
    responseKind: "fill"
  },
  14: {
    prompt: "다음 빈칸에 수를 넣어 가로, 세로, 대각선의 네 수의 합이 모두 같게 만들려고 합니다. ㉠, ㉡에 들어갈 두 수의 합은 얼마입니까?",
    visual: { type: "grid", n: 4, cell: 52, maxWidth: 230, cells: ["㉠", null, null, null, 4, null, 10, 7, null, null, "㉡", null, null, null, null, 2] }
  },
  15: {
    prompt: "다음 표에서 두 수의 위치를 바꾸면 각 가로줄과 세로줄에 놓이는 세 수의 합이 모두 같아집니다. 위치를 바꾼 두 수의 합은 얼마인지 구하시오.",
    visual: { type: "grid", n: 3, cell: 54, maxWidth: 180, cells: [8, 2, 7, 4, 6, 9, 5, 10, 3] }
  },
  16: {
    prompt: "2에서 7까지의 수를 한 번씩 써넣어 한 변 위에 있는 세 수의 합이 12, 13, 14, 15가 되도록 삼각진을 완성하시오.",
    visual: { type: "triangles", cards: [2, 3, 4, 5, 6, 7], sums: [12, 13, 14, 15] },
    responseKind: "fill"
  },
  17: {
    prompt: "다음 오각진에서 빈 원 안에 1부터 10까지의 수를 한 번씩 넣어 한 줄 위에 있는 세 수의 합이 모두 16이 되게 만드시오.",
    visual: { type: "pentagon", cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], shown: [null, null, 3, null, null, null, null, 10, 1, null], sum: 16 },
    responseKind: "fill"
  },
  18: {
    prompt: "다음 그림의 원 안에 2에서 10까지의 짝수를 넣어 직선 위에 있는 세 수의 합과 원의 둘레에 있는 네 수의 합이 모두 같게 만드시오.",
    visual: { type: "circleCross", cards: [2, 4, 6, 8, 10] },
    responseKind: "fill"
  },
  19: {
    prompt: "5개의 막대 ㉠, ㉡, ㉢, ㉣, ㉤의 길이를 비교하였더니 다음과 같았습니다. ㉡과 ㉣은 몇 cm 만큼 차이가 나는지 구하시오.",
    visual: { type: "conditions", clues: ["㉤은 ㉠보다 4cm 더 깁니다.", "㉣은 ㉢보다 3cm 더 짧습니다.", "㉢은 ㉠보다 6cm 더 짧습니다.", "㉠은 ㉡보다 4cm 더 깁니다."] }
  },
  20: {
    prompt: "다음과 같이 다현, 윤서, 지민, 지후, 상준이가 둥근 탁자 주위에 둥글게 앉아 있습니다. 지민는 누구와 누구 사이에 앉아 있습니까?",
    visual: { type: "roundTable", clues: ["다현이의 왼쪽에는 상준이가 앉아 있습니다.", "지후와 지민이는 이웃하여 앉아 있지 않습니다.", "지후의 오른쪽에 앉은 사람은 윤서가 아닙니다."] }
  },
  21: {
    prompt: "높이뛰기 대회를 하고 나서 친구들이 다음과 같이 말했습니다. 빈칸에 알맞은 이름을 써넣으시오.",
    visual: { type: "rankTable", cellWidth: 54, heads: ["1등", "2등", "3등", "4등", "5등", "6등"],
      clues: ["주희 : 나는 샛별이를 이겼어.", "샛별 : 나는 경헌이를 이겼어.", "민아 : 나는 경헌이에게 졌어.", "승우 : 나는 고은이에게 졌지만 주희에게 이겼어."] },
    responseKind: "fill"
  },
  22: {
    prompt: "A, B, C, D 네 사람은 축구, 야구, 농구, 배구 중에서 좋아하는 운동을 두 가지씩 말하였습니다. 다음을 읽고 A가 좋아하는 운동은 축구와 또 무엇인지 구하시오.",
    visual: { type: "matrixTable", firstWidth: 54, cellWidth: 40, lastWidth: 50, rowHeight: 32, columns: ["", "A", "B", "C", "D", "인원"], rows: ["축구", "야구", "농구", "배구"],
      clues: ["축구를 좋아한다고 말한 사람은 3명입니다.", "야구와 배구을 좋아하는 사람은 각각 2명씩입니다.", "농구는 C만 좋아합니다.", "A는 축구, B는 야구를 좋아합니다.", "D는 축구와 야구를 좋아합니다."] }
  },
  23: {
    prompt: "축구 대회 4강에 한국, 브라질, 프랑스, 독일이 진출하였습니다. A, B, C 세 친구가 결과를 예상하였는데, 각 친구의 예상이 한 개씩만 맞았다고 할 때, 우승팀은 어느 나라인지 구하시오.",
    visual: { type: "rankTable", cellWidth: 76, heads: ["1등", "2등", "3등", "4등"],
      clues: ["A : 독일 1등, 프랑스 3등", "B : 한국 2등, 브라질 3등", "C : 독일 4등, 프랑스 1등"] }
  },
  24: {
    prompt: "운동회 때 ㉮, ㉯, ㉰, ㉱, ㉲ 다섯 사람이 달리기를 하였는데 각 사람의 등수를 물으니 다음과 같이 대답하였습니다. ㉮는 몇 등인지 구하시오.",
    visual: { type: "matrixTable", bullets: false, firstWidth: 40, cellWidth: 40, rowHeight: 30, columns: ["", "㉮", "㉯", "㉰", "㉱", "㉲"], rows: ["1", "2", "3", "4", "5"],
      clues: ["㉮ : 나는 2등도 4등도 아닙니다.", "㉯ : 나는 3등도 4등도 아닙니다.", "㉰ : 나는 1등도 2등도 아닙니다.", "㉱ : 나는 ㉮, ㉯ 모두에게 졌습니다.", "㉲ : 나는 ㉯에게는 졌지만 ㉮에게는 이겼습니다."] }
  },
  25: {
    prompt: "다음 삼각진에 1에서 9까지의 수를 한 번씩 써넣어 한 변 위에 있는 네 수의 합이 모두 19가 되도록 삼각진을 완성하시오.",
    visual: { type: "triangle9", cards: [1, 2, 3, 4, 5, 6, 7, 8, 9], sum: 19 },
    responseKind: "fill"
  }
};

export const numbers = Object.freeze(Object.keys(QUESTIONS).map(Number));
export function get(number) {
  const q = QUESTIONS[Number(number)];
  return q ? { number: Number(number), ...q } : null;
}
