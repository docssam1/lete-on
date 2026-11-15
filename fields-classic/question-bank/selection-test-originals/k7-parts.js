// 7세 2차·3차 선발시험(k7-2022-04 · k7-2022-06)이 같이 쓰는 그림 조각 — 두 회차는 문제 꼴이 같고 수만 다르다.
// 공용 도구(kit.js)는 건드리지 않고 여기서만 더한다. 정답은 두지 않는다.
import { UT, esc, text, svg, line, box, cardsRow, shape, ringed, cell, disc, frame, blockArrow, arrow, balance, stone, caption, f1 } from "./kit.js?v=20261114a";

const GRAY = "#f3efe6";

// 네 원 둘레 합([보기] + 오른쪽)
function ringSquare(cx, top, cards, values, sums, { gap = 140, r = 24 } = {}) {
  const x0 = cx - gap / 2, x1 = cx + gap / 2, y0 = top + 56, y1 = top + 56 + gap * 0.82;
  const c = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]];
  let out = `<rect x="${cx - 110}" y="${top}" width="220" height="32" rx="4" fill="#fff" stroke="${UT.box}" stroke-width="1.6"/>${cards.map((v, i) => text(cx + (i - (cards.length - 1) / 2) * 40, top + 17, v, { size: 17 })).join("")}`;
  out += line(x0, y0, x1, y0) + line(x1, y0, x1, y1) + line(x0, y1, x1, y1) + line(x0, y0, x0, y1);
  out += c.map(([x, y], i) => disc(x, y, r, values[i])).join("");
  out += text(cx, y0 - 12, `합 ${sums[0]}`, { size: 14 }) + text(x1 + r + 6, (y0 + y1) / 2, `합 ${sums[1]}`, { size: 14, anchor: "start" })
    + text(cx, y1 + 14, `합 ${sums[2]}`, { size: 14 }) + text(x0 - r - 6, (y0 + y1) / 2, `합 ${sums[3]}`, { size: 14, anchor: "end" });
  return out;
}
// sums = [위, 오른쪽, 아래, 왼쪽]
export const ringSquares = (cards, sums) => svg(640, 290, "보기와 오른쪽 그림",
  frame(10, 14, 300, 266) + ringSquare(160, 34, [1, 2, 3, 4], [2, 1, 4, 3], [3, 4, 7, 6], { gap: 130, r: 21 }) + ringSquare(480, 34, cards, ["", "", "", ""], sums, { gap: 150, r: 26 }), 600);

// 가르기 나무: 숫자 카드 · 맨 위 수 · 가운데 두 칸 · 아래 세 칸(가운데 ㉠)
export function splitTree(cards, total) {
  const s = 44, cx = 195;
  const mid = [140, 250], bottom = [85, 195, 305], my = 108, by = 182;
  let out = cardsRow(cards, 390, 4, 32) + text(cx, 70, total, { size: 22 });
  out += line(cx, 82, mid[0], my) + line(cx, 82, mid[1], my);
  out += line(mid[0], my + s, bottom[0], by) + line(mid[0], my + s, bottom[1], by) + line(mid[1], my + s, bottom[1], by) + line(mid[1], my + s, bottom[2], by);
  out += mid.map((x) => cell(x - s / 2, my, s, s)).join("") + bottom.map((x, i) => cell(x - s / 2, by, s, s, i === 1 ? "㉠" : "")).join("");
  return svg(390, 232, "가르기 그림", out, 340);
}

// 빈 칸 모양(칸 목록 [열, 행, 글자])
export function cellShape(cells, label = "빈 칸 모양", s = 52) {
  const w = Math.max(...cells.map(([c]) => c)) + 1, h = Math.max(...cells.map(([, r]) => r)) + 1;
  return svg(w * s + 8, h * s + 8, label, cells.map(([c, r, v]) => cell(4 + c * s, 4 + r * s, s, s, v || "", { stroke: UT.ink })).join(""), (w * s + 8) * 1.1);
}

// 달리기: 앞 ○○○○○ 뒤
export function runners() {
  const out = text(18, 32, "앞", { size: 15, weight: 700 }) + [0, 1, 2, 3, 4].map((i) => disc(60 + i * 62, 32, 27) + caption(60 + i * 62, 76, `${i + 1}등`, 13)).join("") + text(350, 32, "뒤", { size: 15, weight: 700 });
  return svg(370, 90, "등수 자리", out, 340);
}

// 수 배열표(4×4, 빈칸 "" · ㉠)
export function numTable(rows) {
  const s = 52;
  return svg(4 * s + 8, 4 * s + 8, "수 배열표", rows.map((row, r) => row.map((v, c) => cell(4 + c * s, 4 + r * s, s, s, v, { stroke: UT.ink, size: 19 })).join("")).join(""), 240);
}

// 합 표: [보기](덧셈 꼬리표) + 오른쪽 모양 표. 색칠한 칸 = 합
function sumGrid(ox, oy, rows, s) {
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    const isSum = r === 2 || c === 2;
    if (["diamond", "square", "circle", "triangle", "star"].includes(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: isSum ? UT.yellowSoft : "#fff", stroke: UT.ink, size: 20 });
  }));
  return out;
}
export function sumTables(right) {
  const s = 52, ox = 36, oy = 40;
  let left = frame(10, 14, 300, 266) + sumGrid(ox, oy, [[5, 4, 9], [3, 7, 10], [8, 11, null]], s);
  left += text(ox + 3 * s + 8, oy + s / 2, "← 5+4", { size: 13, anchor: "start", weight: 600 }) + text(ox + 3 * s + 8, oy + 1.5 * s, "← 3+7", { size: 13, anchor: "start", weight: 600 });
  left += text(ox + s / 2, oy + 3 * s + 14, "↑", { size: 14, weight: 600 }) + text(ox + s / 2, oy + 3 * s + 34, "5+3", { size: 13, weight: 600 })
    + text(ox + 1.5 * s, oy + 3 * s + 14, "↑", { size: 14, weight: 600 }) + text(ox + 1.5 * s, oy + 3 * s + 34, "4+7", { size: 13, weight: 600 });
  return svg(640, 290, "보기 표와 오른쪽 표", left + sumGrid(400, oy, right, s), 600);
}

// 모양 규칙: kinds 와 꼬리표, 끝에 … ( ) 와 마지막 꼬리표
export function shapeRow(kinds, labels, lastLabel, { step = 62, size = 36 } = {}) {
  const x0 = 30;
  let out = kinds.map((k, i) => shape(k, x0 + i * step, 36, size) + caption(x0 + i * step, 82, labels[i])).join("");
  const end = x0 + (kinds.length - 1) * step;
  out += text(end + 46, 38, "…", { size: 20 }) + text(end + 86, 36, "(", { size: 30, weight: 400 }) + text(end + 176, 36, ")", { size: 30, weight: 400 }) + caption(end + 131, 82, lastLabel);
  const w = end + 196;
  return svg(w, 100, "모양 규칙", out, Math.min(620, w));
}

// 화살표 규칙: [보기] + 오른쪽 길(path = [[열, 행] …], 첫 칸은 시작 수 네모, 끝 칸은 ㉠ 네모)
export function arrowRule(start, path, { X, Y, w = 600, h = 290 }) {
  const b = 40;
  const sq = (cx, cy, v, size = 16) => cell(cx - b / 2, cy - b / 2, b, b, v, { stroke: UT.ink, size });
  let left = frame(10, 14, 270, 272) + sq(145, 150, 15) + sq(145, 72, 5) + sq(63, 150, 14) + sq(227, 150, 16) + sq(145, 228, 25);
  left += blockArrow(145, 128, 145, 94) + blockArrow(123, 150, 85, 150) + blockArrow(167, 150, 205, 150) + blockArrow(145, 172, 145, 206);
  let right = "";
  for (let i = 0; i < path.length - 1; i += 1) {
    const [c0, r0] = path[i], [c1, r1] = path[i + 1];
    const dx = Math.sign(c1 - c0), dy = Math.sign(r1 - r0);
    right += blockArrow(X[c0] + dx * 22, Y[r0] - dy * 22, X[c1] - dx * 22, Y[r1] + dy * 22);
  }
  const [sc, sr] = path[0], [ec, er] = path.at(-1);
  right += sq(X[sc], Y[sr], start, 18) + path.slice(1, -1).map(([c, r]) => disc(X[c], Y[r], 20)).join("") + sq(X[ec], Y[er], "㉠");
  return svg(w, h, "보기와 화살표 길", left + right, w - 20);
}

// 색종이 한 번 접기: 왼쪽 접은 종이(오른쪽 아래 반이 왼쪽 위로 접힘, 칠한 곳), 오른쪽 수 표
export function foldPaper(dark, foldArrow, numbers) {
  const s = 52, ox = 10, oy = 10, G = "#3fae74", P = (x, y) => `${f1(ox + x * s)},${f1(oy + y * s)}`;
  let out = `<polygon points="${P(0, 0)} ${P(4, 0)} ${P(0, 4)}" fill="#e6f5ec"/>`;
  out += `<polygon points="${dark.map(([x, y]) => P(x, y)).join(" ")}" fill="#7fd1a4" stroke="${G}" stroke-width="1"/>`;
  for (let k = 1; k < 4; k += 1) out += line(ox + k * s, oy, ox + k * s, oy + 4 * s, { stroke: G, width: 1, dash: "4 3" }) + line(ox, oy + k * s, ox + 4 * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  out += `<rect x="${ox}" y="${oy}" width="${4 * s}" height="${4 * s}" fill="none" stroke="${G}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  out += `<polyline points="${P(0, 4)} ${P(0, 0)} ${P(4, 0)} ${P(0, 4)}" fill="none" stroke="${G}" stroke-width="1.8" stroke-linejoin="round"/>`;
  const [[ax, ay], [cx, cy], [bx, by]] = foldArrow;
  out += `<path d="M${P(ax, ay).replace(",", " ")} Q${P(cx, cy).replace(",", " ")} ${P(bx, by).replace(",", " ")}" fill="none" stroke="${UT.red}" stroke-width="1.8"/>`;
  const ex = ox + bx * s, ey = oy + by * s, dx = (bx - cx) * s, dy = (by - cy) * s, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  out += `<polygon points="${f1(ex + ux * 4)},${f1(ey + uy * 4)} ${f1(ex - ux * 5 - uy * 5)},${f1(ey - uy * 5 + ux * 5)} ${f1(ex - ux * 5 + uy * 5)},${f1(ey - uy * 5 - ux * 5)}" fill="${UT.red}"/>`;
  out += blockArrow(4 * s + 30, oy + 2 * s, 4 * s + 66, oy + 2 * s, { fill: "#7fd1a4", stroke: G });
  const rx = 4 * s + 90;
  out += `<rect x="${rx}" y="${oy}" width="${4 * s}" height="${4 * s}" fill="#fff" stroke="${G}" stroke-width="1.6"/>`;
  for (let k = 1; k < 4; k += 1) out += line(rx + k * s, oy, rx + k * s, oy + 4 * s, { stroke: G, width: 1, dash: "4 3" }) + line(rx, oy + k * s, rx + 4 * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  numbers.forEach((row, r) => row.forEach((v, c) => { out += text(rx + c * s + s / 2, oy + r * s + s / 2 + 1, v, { size: 21, weight: 600 }); }));
  return svg(rx + 4 * s + 10, 4 * s + 20, "접은 색종이와 수 표", out, 560);
}

// 여덟 칸 고리(가로·세로 세 수의 합) — vals 는 3×3, 가운데는 합 글
function ring8(ox, oy, vals, center) {
  const s = 42, g = 68;
  let out = "";
  const at = (c, r) => [ox + c * g, oy + r * g];
  out += line(...at(0, 0), ...at(2, 0)) + line(...at(0, 2), ...at(2, 2)) + line(...at(0, 0), ...at(0, 2)) + line(...at(2, 0), ...at(2, 2));
  vals.forEach((row, r) => row.forEach((v, c) => { if (r === 1 && c === 1) return; const [x, y] = at(c, r); out += cell(x - s / 2, y - s / 2, s, s, v, { stroke: UT.ink, size: 20 }); }));
  const [mx, my] = at(1, 1);
  return out + text(mx, my, center, { size: 16, weight: 700 });
}
export function ringBoxes(left, leftSum, right, rightSum) {
  let out = frame(10, 48, 280, 230) + ring8(82, 104, left, `합 : ${leftSum}`);
  out += cardsRow([1, 2, 3, 4, 5, 6, 7, 8], 932, 4, 28);   // 오른쪽 고리(가운데 x=466) 위에 가운데 맞춤
  out += ring8(398, 104, right, `합 : ${rightSum}`);
  return svg(600, 286, "보기와 여덟 칸", out, 580);
}

// 도형 합 표(3×3 도형 + 오른쪽·아래 합, ㉠ 칸 가능)
export function shapeSumTable(rows) {
  const s = 52, ox = 6, oy = 6;
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    if (typeof v === "string" && v !== "㉠" && !/^\d+$/.test(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: GRAY, stroke: UT.ink, size: 20 });
  }));
  return svg(4 * s + 12, 4 * s + 12, "도형 표", out, 240);
}

// 식 한 줄: 토큰 — "○4"(동그라미 친 수) · "□"(빈 네모) · "♡"(하트) · 그 밖은 글자
function eqLine(tokens, x, cy) {
  let out = "", cx = x;
  for (const t of tokens) {
    if (t.startsWith("○")) { out += `<circle cx="${cx + 15}" cy="${cy}" r="14" fill="#fff" stroke="${UT.ink}" stroke-width="1.5"/>` + text(cx + 15, cy + 1, t.slice(1), { size: 18, weight: 600 }); cx += 34; }
    else if (t === "□") { out += box(cx + 2, cy - 15, 30, 30, { fill: "#fff", stroke: UT.ink, width: 1.5, radius: 1 }); cx += 36; }
    else if (t === "♡") { out += shape("heart", cx + 17, cy + 1, 32); cx += 38; }
    else { const w = t.length * 11 + 10; out += text(cx + w / 2, cy + 1, t, { size: 19, weight: 600 }); cx += w; }
  }
  return { out, w: cx - x };
}
export function equationBoxes(rightRows) {
  const leftRows = [["○4", "+", "5", "=", "9"], ["7", "−", "○4", "=", "3"]];
  let out = frame(10, 14, 260, 120);
  leftRows.forEach((row, i) => { const w = eqLine(row, 0, 0).w; out += eqLine(row, 140 - w / 2, 54 + i * 50).out; });
  out += `<rect x="340" y="14" width="260" height="120" rx="14" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`;
  rightRows.forEach((row, i) => { const w = eqLine(row, 0, 0).w; out += eqLine(row, 470 - w / 2, 54 + i * 50).out; });
  return svg(610, 144, "보기 식과 오른쪽 식", out, 580);
}

// 정삼각형 색종이 이어 붙이기(n번째 = 한 변 n칸)
export function triangleGrowth() {
  const s = 30, base = 150, h = s * Math.sqrt(3) / 2;
  const xs = [40, 120, 230, 380], names = ["첫 번째", "두 번째", "세 번째", "네 번째"];
  let out = "";
  xs.forEach((cx, i) => {
    const n = i + 1;
    for (let k = 0; k < n; k += 1) for (let j = 0; j <= k; j += 1) {
      const top = base - n * h + k * h, x = cx - k * s / 2 + j * s;
      out += `<polygon points="${f1(x)},${f1(top)} ${f1(x + s / 2)},${f1(top + h)} ${f1(x - s / 2)},${f1(top + h)}" fill="${UT.yellowSoft}" stroke="${UT.ink}" stroke-width="1.3" stroke-linejoin="round"/>`;
    }
    out += caption(cx, base + 22, names[i]);
  });
  return svg(520, 182, "정삼각형 모양", out + text(490, 100, "…", { size: 20 }), 500);
}
// 정사각형 색종이 이어 붙이기(n번째 = n×n)
export function squareGrowth() {
  const s = 26, base = 128, xs = [20, 90, 190, 330], names = ["첫 번째", "두 번째", "세 번째", "네 번째"];
  let out = "";
  xs.forEach((x, i) => {
    const n = i + 1;
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) out += `<rect x="${x + c * s}" y="${base - (n - r) * s}" width="${s}" height="${s}" fill="${UT.yellowSoft}" stroke="${UT.ink}" stroke-width="1.3"/>`;
    out += caption(x + n * s / 2, base + 22, names[i]);
  });
  return svg(490, 160, "정사각형 모양", out + text(468, 50, "…", { size: 20 }), 480);
}

// 양팔 저울 문제: [보기] + 그림 1~3
export function balances(fig1, fig2, fig3) {
  let out = frame(140, 14, 400, 112, "보기") + balance(340, 64, [["cylinder"]], [["cube"]], { span: 56, plate: 34, s: 30 }) + text(340, 44, "=", { size: 18 });
  out += text(340, 112, "양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.", { size: 13, weight: 600 });
  const o = { span: 54, plate: 40 };
  out += balance(105, 214, fig1[0], fig1[1], o) + caption(105, 272, "[그림 1]", 13);
  out += balance(340, 214, fig2[0], fig2[1], o) + caption(340, 272, "[그림 2]", 13);
  out += balance(575, 214, fig3[0], fig3[1], o) + caption(575, 272, "[그림 3]", 13);
  return svg(680, 284, "양팔 저울 세 개", out, 640);
}

// 도형 식 세 줄(☆ ○ ▽ □)
export function shapeEquations(rows) {
  const tok = (t) => ({ "☆": "star", "○": "circle", "▽": "triangleDown", "□": "blank" })[t] || t;
  let out = `<rect x="4" y="4" width="352" height="142" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  rows.forEach((row, i) => {
    let cx = 24;
    const cy = 34 + i * 42;
    for (const t of row.map(tok)) {
      if (t === "blank") { out += box(cx, cy - 11, 22, 22, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }); cx += 26; }
      else if (["star", "circle", "triangleDown"].includes(t)) { out += shape(t, cx + 11, cy, 22); cx += 26; }
      else { out += text(cx + 7, cy + 1, t, { size: 18, weight: 600 }); cx += 18; }
    }
  });
  return svg(360, 150, "도형 식 세 줄", out, 360);
}

// 수직선 위 여섯 점 사이 거리(위·아래 점선 고리, E–F 는 빈 네모)
export function numberLine(px, above, below) {
  const map = (x) => 30 + (x - 289) * 580 / 994;
  const X = px.map(map), y = 120, names = ["A", "B", "C", "D", "E", "F"];
  let out = line(X[0], y, X[5], y, { width: 2 });
  const arc = (a, b, ry, up, label) => {
    const x1 = X[a], x2 = X[b], mx = (x1 + x2) / 2, ty = up ? y - ry : y + ry;
    let s = `<path d="M${f1(x1)} ${y} A${f1((x2 - x1) / 2)} ${ry} 0 0 ${up ? 1 : 0} ${f1(x2)} ${y}" fill="none" stroke="${UT.line}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    if (label === "□") s += `<rect x="${f1(mx - 18)}" y="${f1(ty - 12)}" width="36" height="24" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>`;
    else s += `<rect x="${f1(mx - 16)}" y="${f1(ty - 10)}" width="32" height="20" fill="#fff"/>` + text(mx, ty + 1, label, { size: 16, weight: 600 });
    return s;
  };
  out += above.map(([a, b, ry, v]) => arc(a, b, ry, true, v)).join("") + below.map(([a, b, ry, v]) => arc(a, b, ry, false, v)).join("");
  out += X.map((x, i) => `<circle cx="${f1(x)}" cy="${y}" r="4.5" fill="${UT.ink}"/>` + text(x + (i === 0 ? -6 : 6), y + 16, names[i], { size: 13, weight: 600 })).join("");
  return svg(640, 250, "수직선 위 여섯 점", out, 620);
}

// 바둑돌 세모 쌓기(홀수 줄 검은 돌, 짝수 줄 흰 돌)
export function stoneTriangles() {
  const d = 20, base = 140, xs = [30, 90, 170, 290, 440], names = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"];
  let out = "";
  xs.forEach((cx, i) => {
    const n = i + 1;
    for (let k = 1; k <= n; k += 1) for (let j = 0; j < k; j += 1) out += stone(cx + (j - (k - 1) / 2) * d, base - (n - k) * d, k % 2 === 1, 9);
    out += caption(cx, base + 26, names[i]);
  });
  return svg(560, 178, "바둑돌 규칙", out + text(530, 70, "…", { size: 20 }), 540);
}

// 접시 위 구슬(줄마다 개수)
export function plates(groups) {
  let out = "";
  groups.forEach(({ name, rows }, g) => {
    const cx = 140 + g * 280, cy = 120;
    out += text(cx, 26, name, { size: 15, weight: 800 });
    out += `<ellipse cx="${cx}" cy="${cy + 8}" rx="112" ry="40" fill="#f1eee8" stroke="#c9c2b4" stroke-width="1.6"/><ellipse cx="${cx}" cy="${cy + 2}" rx="88" ry="27" fill="#faf8f4" stroke="#ddd6c8" stroke-width="1.2"/>`;
    rows.forEach((n, r) => { for (let i = 0; i < n; i += 1) out += `<circle cx="${f1(cx + (i - (n - 1) / 2) * 24)}" cy="${f1(cy - 22 + r * 18)}" r="12" fill="${UT.orange}" stroke="#d4561c" stroke-width="1.4"/><circle cx="${f1(cx + (i - (n - 1) / 2) * 24 - 4)}" cy="${f1(cy - 26 + r * 18)}" r="3.5" fill="#ffe0b0"/>`; });
  });
  return svg(560, 176, "접시 위 구슬", out, 520);
}

// 쌓기나무 큐브 그림(열 × 행)
export function cubes(cols, rows) {
  const a = 32, d = 9, gx = 48, gy = 48;
  let out = "";
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) {
    const x = 8 + c * gx, y = 8 + d + r * gy;
    out += `<polygon points="${x},${y} ${x + d},${y - d} ${x + a + d},${y - d} ${x + a},${y}" fill="#ff9a7a" stroke="#c4472a" stroke-width="1.2" stroke-linejoin="round"/>`
      + `<polygon points="${x + a},${y} ${x + a + d},${y - d} ${x + a + d},${y + a - d} ${x + a},${y + a}" fill="#e2603d" stroke="#c4472a" stroke-width="1.2" stroke-linejoin="round"/>`
      + `<rect x="${x}" y="${y}" width="${a}" height="${a}" fill="#f47a55" stroke="#c4472a" stroke-width="1.2"/>`;
  }
  return svg(cols * gx + 16, rows * gy + 16, "큐브 20개", out, 260);
}

export { esc, arrow, ringed };
