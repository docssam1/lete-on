// 7세 4차 선발시험(k7-2022-08) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/k7-2022-08) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 10번 큐브 사진은 개수만 같게 단순한 큐브 그림으로 바꿨다. 9번 글의 「알맞을 수」는 「알맞은 수」로 바로잡았다.
import { UT, text, svg, line, cardsRow, conditionsBox, shape, cell, disc, frame, blockArrow, balance, stone, caption, equation, f1 } from "./kit.js?v=20261114a";

export const perPage = 2;

// 1. 네 원 둘레 합
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
// sums 차례: 위 · 오른쪽 · 아래 · 왼쪽
const q1 = () => svg(640, 290, "보기와 오른쪽 그림", frame(10, 14, 300, 266) + ringSquare(160, 34, [1, 2, 3, 4], [2, 1, 4, 3], [3, 4, 7, 6], { gap: 130, r: 21 }) + ringSquare(480, 34, [5, 6, 7, 8], ["", "", "", ""], [12, 15, 14, 11], { gap: 150, r: 26 }), 600);

// 2. 조건과 칸
const q2 = () => {
  const s = 56, ox = 40, oy = 4;
  const cells = [[0, 0, "㉠"], [0, 1, ""], [1, 1, ""], [1, 2, ""]].map(([c, r, v]) => cell(ox + c * s, oy + r * s, s, s, v, { stroke: UT.ink }));
  const box = conditionsBox(["빈 칸에는 1,2,3,4가 한 번만 들어갑니다.", "3의 왼쪽에 2가 있습니다.", "1은 3 바로 아래에 있습니다."]);
  return `<div style="display:grid;gap:16px;width:100%;justify-items:center">${box}${svg(192, 180, "빈 칸 그림", cells.join(""), 170)}</div>`;
};

// 3. 모양 규칙
const q3 = () => {
  const kinds = ["circle", "triangle", "triangle", "diamond", "circle", "triangle", "triangle", "diamond", "circle"];
  let out = kinds.map((k, i) => shape(k, 30 + i * 56, 34, 34) + caption(30 + i * 56, 80, `(${i + 1})`)).join("");
  out += text(518, 36, "…", { size: 20 }) + text(548, 34, "(", { size: 30, weight: 400 }) + text(626, 34, ")", { size: 30, weight: 400 }) + caption(587, 80, "(15)");
  return svg(640, 96, "모양 규칙", out, 620);
};

// 4. 12 가르기
const q4 = () => {
  const s = 46;
  const lines = line(193, 66, 138, 100) + line(193, 66, 248, 100) + line(138, 146, 83, 180) + line(138, 146, 193, 180) + line(248, 146, 193, 180) + line(248, 146, 303, 180);
  const mid = [[115, 100], [225, 100]].map(([x, y]) => cell(x, y, s, s));
  const bottom = [[60, 180], [170, 180], [280, 180]].map(([x, y], i) => cell(x, y, s, s, i === 1 ? "㉠" : ""));
  return svg(386, 232, "숫자 카드와 가르기 그림", cardsRow([2, 3, 4, 5, 7], 386, 2, 30) + text(193, 52, "12", { size: 22 }) + lines + mid.join("") + bottom.join(""), 330);
};

// 5. 달리기 등수
const q5 = () => {
  const box = conditionsBox(["지우는 앞에서 네 번째로 달리고 있습니다.", "지우와 민호 사이에는 1명이 달리고 있습니다."]);
  const circles = svg(380, 80, "등수 자리", text(22, 30, "앞", { size: 14 }) + [0, 1, 2, 3, 4].map((i) => disc(68 + i * 61, 30, 27) + caption(68 + i * 61, 72, `${i + 1}등`, 13)).join("") + text(358, 30, "뒤", { size: 14 }), 360);
  return `<div style="display:grid;gap:16px;width:100%;justify-items:center">${box}${circles}</div>`;
};

// 6. 수 표
const q6 = () => {
  const s = 54, rows = [[4, 8, 12, 16], ["", 11, 15, ""], [10, "", 18, ""], [13, "", "", "㉠"]];
  return svg(226, 226, "수 표", rows.map((row, r) => row.map((v, c) => cell(4 + c * s, 4 + r * s, s, s, v, { stroke: UT.ink, size: 20 })).join("")).join(""), 230);
};

// 7. 화살표 규칙
const q7 = () => {
  const b = 40;
  const sq = (cx, cy, v) => cell(cx - b / 2, cy - b / 2, b, b, v, { stroke: UT.ink, size: 16 });
  let left = frame(10, 14, 270, 272) + sq(145, 150, 15) + sq(145, 72, 5) + sq(63, 150, 14) + sq(227, 150, 16) + sq(145, 228, 25);
  left += blockArrow(145, 128, 145, 94) + blockArrow(123, 150, 85, 150) + blockArrow(167, 150, 205, 150) + blockArrow(145, 172, 145, 206);
  const X = [350, 428, 506, 584], Y = [60, 150, 240];
  const path = [[0, 0], [0, 1], [0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [3, 2]];
  let right = "";
  for (let i = 0; i < path.length - 1; i += 1) {
    const [c0, r0] = path[i], [c1, r1] = path[i + 1];
    const dx = Math.sign(X[c1] - X[c0]), dy = Math.sign(Y[r1] - Y[r0]);
    right += blockArrow(X[c0] + dx * 24, Y[r0] + dy * 24, X[c1] - dx * 24, Y[r1] - dy * 24);
  }
  right += sq(X[0], Y[0], 34) + path.slice(1, -1).map(([c, r]) => disc(X[c], Y[r], 21)).join("") + sq(X[3], Y[2], "㉠");
  return svg(620, 290, "보기와 화살표 길", left + right, 600);
};

// 8. 합 표(색칠된 칸 = 합)
const SHAPES = ["diamond", "square", "circle", "triangle", "star"];
function sumTable(ox, oy, rows, s = 52) {
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const isSum = r === 2 || c === 2;
    const x = ox + c * s, y = oy + r * s;
    if (SHAPES.includes(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: isSum ? UT.yellowSoft : "#fff", stroke: UT.ink, size: 20 });
  }));
  return out;
}
const q8 = () => {
  const s = 52, ox = 40, oy = 40;
  let left = frame(10, 14, 310, 262) + sumTable(ox, oy, [[5, 4, 9], [3, 7, 10], [8, 11, null]], s);
  left += text(ox + 3 * s + 8, oy + s / 2, "← 5+4", { size: 14, anchor: "start", weight: 600 }) + text(ox + 3 * s + 8, oy + 1.5 * s, "← 3+7", { size: 14, anchor: "start", weight: 600 });
  left += [["5+3", 0], ["4+7", 1]].map(([t, c]) => text(ox + c * s + s / 2, oy + 3 * s + 12, "↑", { size: 14, weight: 600 }) + text(ox + c * s + s / 2, oy + 3 * s + 32, t, { size: 14, weight: 600 })).join("");
  const right = sumTable(420, 40, [["diamond", "circle", 16], ["square", "circle", 17], ["㉠", 22, null]], s);
  return svg(620, 290, "보기 표와 오른쪽 표", left + right, 600);
};

// 9. 네모 둘레 합
function ringBoxes(ox, oy, values, label, s = 48, step = 76) {
  const pos = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  let out = line(ox + s, oy + s / 2, ox + 2 * step, oy + s / 2) + line(ox + s, oy + 2 * step + s / 2, ox + 2 * step, oy + 2 * step + s / 2)
    + line(ox + s / 2, oy + s, ox + s / 2, oy + 2 * step) + line(ox + 2 * step + s / 2, oy + s, ox + 2 * step + s / 2, oy + 2 * step);
  out += pos.map(([c, r], i) => cell(ox + c * step, oy + r * step, s, s, values[i], { stroke: UT.ink, size: 22 })).join("");
  return out + text(ox + step + s / 2, oy + step + s / 2, label, { size: 16 });
}
const q9 = () => {
  const left = frame(10, 22, 280, 266) + ringBoxes(50, 52, [1, 5, 6, 8, 4, 3, 7, 2], "합 : 12");
  const cards = `<g transform="translate(362,4)">${cardsRow([1, 2, 3, 4, 5, 6, 7, 8], 250, 0, 26)}</g>`;
  const right = ringBoxes(390, 56, ["㉠", "", 7, "", "", 8, "", 3], "합 : 15");
  return svg(630, 296, "보기와 오른쪽 그림", left + cards + right, 600);
};

// 10. 큐브 18개
function cube(x, y, a = 26, d = 8) {
  const p = (list) => list.map(([px, py]) => `${f1(px)},${f1(py)}`).join(" ");
  return `<polygon points="${p([[x, y + d], [x + d, y], [x + a + d, y], [x + a, y + d]])}" fill="#ffc2b0" stroke="#c4472e" stroke-width="1.2" stroke-linejoin="round"/>`
    + `<polygon points="${p([[x + a, y + d], [x + a + d, y], [x + a + d, y + a], [x + a, y + a + d]])}" fill="#e66a4e" stroke="#c4472e" stroke-width="1.2" stroke-linejoin="round"/>`
    + `<rect x="${x}" y="${y + d}" width="${a}" height="${a}" fill="#f58a6c" stroke="#c4472e" stroke-width="1.2"/>`;
}
const q10 = () => {
  let out = "";
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 6; c += 1) out += cube(6 + c * 42, 4 + r * 40);
  return svg(264, 128, "큐브 18개", out, 300);
};

// 11. 짝수 조건
const q11 = () => conditionsBox(["20보다 크고 50보다 작은 짝수입니다.", "십의 자리 숫자가 일의 자리 숫자보다 5 작습니다."]);

// 12. 도형 합 표
const q12 = () => {
  const s = 50, ox = 6, oy = 6;
  const rows = [["triangle", "circle", "diamond", "㉠"], ["triangle", "square", "square", 17], ["triangle", "diamond", "square", 20], [21, 17, 18, null]];
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    if (SHAPES.includes(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: UT.yellowSoft, stroke: UT.ink, size: 19 });
  }));
  return svg(212, 212, "도형 표", out, 230);
};

// 13. 버스
const q13 = () => conditionsBox(["첫번째 정류장에서 9명이 탔습니다.", "두번째 정류장에서 17명이 내렸습니다."]);

// 14. 계산식
const q14 = () => {
  const t = (x, y, v, anchor = "middle") => text(x, y, v, { size: 20, weight: 600, anchor });
  let left = frame(10, 14, 260, 120);
  left += disc(100, 52, 15, "4", { stroke: UT.ink, size: 18 }) + t(140, 52, "+ 5") + t(184, 52, "= 9");
  left += t(84, 100, "7 −") + disc(124, 100, 15, "4", { stroke: UT.ink, size: 18 }) + t(166, 100, "= 3");
  let right = `<rect x="350" y="6" width="260" height="128" rx="14" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`;
  right += cell(392, 36, 32, 32, "", { stroke: UT.ink }) + t(432, 52, "+ 38", "start") + t(482, 52, "= 63", "start");
  right += t(392, 100, "51 −", "start") + cell(438, 84, 32, 32, "", { stroke: UT.ink }) + t(486, 100, "=") + shape("heart", 512, 101, 30);
  return svg(620, 144, "보기 계산식과 오른쪽 계산식", left + right, 600);
};

// 15. 색종이 접어 자르기
const q15 = () => {
  const s = 48, ox = 16, oy = 16, n = 4;
  const G = "#2f9e5f";
  const P = (list) => list.map(([c, r]) => `${f1(ox + c * s)},${f1(oy + r * s)}`).join(" ");
  let left = `<rect x="${ox}" y="${oy}" width="${n * s}" height="${n * s}" fill="#fff"/>`;
  left += `<polygon points="${P([[0, 0], [4, 0], [4, 4]])}" fill="${UT.greenSoft}"/>`;
  left += `<polygon points="${P([[1, 0], [2, 0], [2, 1], [4, 1], [4, 2], [2, 2], [1, 1]])}" fill="#5fc89a"/>`;
  for (let k = 1; k < n; k += 1) left += line(ox + k * s, oy, ox + k * s, oy + n * s, { stroke: G, width: 1, dash: "4 3" }) + line(ox, oy + k * s, ox + n * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  left += `<rect x="${ox}" y="${oy}" width="${n * s}" height="${n * s}" fill="none" stroke="${G}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  left += line(ox, oy, ox + n * s, oy + n * s, { stroke: G, width: 1.4 }) + line(ox + n * s, oy, ox + n * s, oy + n * s, { stroke: G, width: 1.4 }) + line(ox, oy, ox + n * s, oy, { stroke: G, width: 1.4 });
  const ax = ox + 2 * s, ay = oy + 2 * s;
  left += `<path d="M${f1(ax + 18)} ${f1(ay - 4)} Q${f1(ax - 4)} ${f1(ay - 6)} ${f1(ax - 10)} ${f1(ay + 18)}" fill="none" stroke="${UT.red}" stroke-width="1.6"/><polygon points="${f1(ax - 15)},${f1(ay + 11)} ${f1(ax - 5)},${f1(ay + 12)} ${f1(ax - 10)},${f1(ay + 22)}" fill="${UT.red}"/>`;
  const mid = blockArrow(ox + n * s + 22, oy + 2 * s, ox + n * s + 58, oy + 2 * s, { fill: "#5fc89a", stroke: G });
  const nums = [[1, 3, 4, 2], [8, 6, 7, 5], [4, 1, 2, 3], [6, 5, 7, 8]];
  const rx = ox + n * s + 80;
  let right = `<rect x="${rx}" y="${oy}" width="${n * s}" height="${n * s}" fill="#fff" stroke="${G}" stroke-width="1.4"/>`;
  for (let k = 1; k < n; k += 1) right += line(rx + k * s, oy, rx + k * s, oy + n * s, { stroke: G, width: 1, dash: "4 3" }) + line(rx, oy + k * s, rx + n * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  right += nums.map((row, r) => row.map((v, c) => text(rx + c * s + s / 2, oy + r * s + s / 2 + 1, v, { size: 20, weight: 600 })).join("")).join("");
  return svg(rx + n * s + 16, oy * 2 + n * s, "접어 자른 색종이와 수 표", left + mid + right, 560);
};

// 16. 정사각형 늘어나기
const q16 = () => {
  const s = 22, base = 120;
  const fig = (n, x) => {
    let out = "";
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) out += `<rect x="${x + c * s}" y="${base - (n - r) * s}" width="${s}" height="${s}" fill="${UT.yellowSoft}" stroke="${UT.ink}" stroke-width="1.2"/>`;
    return out;
  };
  const xs = [30, 92, 176, 290], names = ["첫 번째", "두 번째", "세 번째", "네 번째"];
  return svg(440, 148, "정사각형 모양", xs.map((x, i) => fig(i + 1, x) + caption(x + (i + 1) * s / 2, base + 20, names[i])).join("") + text(410, 60, "…", { size: 20 }), 440);
};

// 17. 양팔 저울
const q17 = () => {
  let out = frame(140, 14, 400, 112, "보기") + balance(340, 64, [["cylinder"]], [["cube"]], { span: 56, plate: 34, s: 30 }) + text(340, 44, "=", { size: 18 });
  out += text(340, 112, "양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.", { size: 13, weight: 600 });
  const o = { span: 54, plate: 38 };
  out += balance(105, 222, [["star", "star", "circle"], ["star", "star"]], [["diamond", "diamond", "diamond"]], o) + caption(105, 280, "[그림 1]", 13);
  out += balance(340, 222, [["circle", "circle", "diamond"], ["circle"]], [["star", "star"], ["star", "star"]], o) + caption(340, 280, "[그림 2]", 13);
  out += balance(575, 222, [["circle", "diamond", "diamond"]], [], o) + caption(575, 280, "[그림 3]", 13);
  out += `<rect x="${575 + 54 - 30}" y="${222 - 66}" width="60" height="60" rx="3" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>` + text(575 + 54, 222 - 36, "?", { size: 26, weight: 600 });
  return svg(680, 292, "양팔 저울 세 개", out, 640);
};

// 18. 도형 식 세 줄
const q18 = () => {
  const rows = [["star", "+", "star", "+", "star", "=", "circle", "+", "circle", "+", "circle", "+", "circle"], ["star", "+", "circle", "=", "triangleDown", "+", "triangleDown"], ["circle", "+", "triangleDown", "=", "blank"]];
  const out = `<rect x="4" y="4" width="352" height="142" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>` + rows.map((row, i) => equation(row, 24, 34 + i * 42, { s: 22, gap: 4, size: 18 }).markup).join("");
  return svg(360, 150, "도형 식 세 줄", out, 360);
};

// 19. 수직선 위 거리
const q19 = () => {
  const y = 120, P = { A: 30, B: 96, C: 184, D: 272, E: 521, F: 576 };
  const arc = (a, b, h, label, up = true) => {
    const x1 = P[a], x2 = P[b], mx = (x1 + x2) / 2, cy = up ? y - h : y + h, py = up ? y - h / 2 : y + h / 2;
    const path = `<path d="M${x1} ${y} Q${mx} ${cy} ${x2} ${y}" fill="none" stroke="${UT.line}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    if (label === "box") return path + `<rect x="${mx - 16}" y="${py - 30}" width="32" height="22" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>`;
    const w = String(label).length * 10 + 10;
    return path + `<rect x="${mx - w / 2}" y="${py - 11}" width="${w}" height="22" fill="#fff"/>` + text(mx, py, label, { size: 16, weight: 600 });
  };
  let out = arc("A", "D", 100, 43) + arc("C", "E", 100, 52) + arc("E", "F", 50, "box") + arc("A", "C", 90, 25, false) + arc("B", "D", 100, 29, false) + arc("B", "F", 200, 79, false);
  out += line(P.A, y, P.F, y, { width: 2 }) + Object.entries(P).map(([k, x]) => `<circle cx="${x}" cy="${y}" r="4" fill="${UT.ink}"/>` + text(x - 8, y + 14, k, { size: 13, weight: 600 })).join("");
  return svg(606, 230, "수직선 위 여섯 점", out, 600);
};

// 20. 바둑돌 삼각형
const q20 = () => {
  const d = 22, base = 150;
  const fig = (n, cx) => {
    let out = "";
    for (let k = 1; k <= n; k += 1) for (let i = 0; i < k; i += 1) out += stone(cx + (i - (k - 1) / 2) * d, base - (n - k) * d * 0.9, k % 2 === 1);
    return out;
  };
  const xs = [36, 100, 184, 300, 450], names = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"];
  return svg(570, 186, "바둑돌 삼각형", xs.map((x, i) => fig(i + 1, x) + caption(x, base + 26, names[i])).join("") + text(548, 70, "…", { size: 20 }), 560);
};

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "[보기]와 같은 규칙으로 오른쪽 그림의 ○에 5, 6, 7, 8을 모두 써 넣으시오.", q1, null),
  Q(2, "주어진 조건을 보고 아래 그림의 빈 칸 ㉠에 알맞은 수를 써 넣으시오.", q2, { label: "㉠ =" }),
  Q(3, "아래 그림의 규칙을 찾아 15번째 모양을 그리시오.", q3, { label: "15번째 모양" }),
  Q(4, "2, 3, 4, 5, 7 다섯 개의 숫자 카드를 이용하여 12를 가르기 할 때, ㉠에 들어갈 수를 구하시오.", q4, { label: "㉠ =" }),
  Q(5, "5명의 친구들이 달리기를 하고 있습니다. 다음을 보고 민호는 몇 등으로 달리고 있는지 구하시오.", q5, { label: "답", unit: "등" }),
  Q(6, "다음 표는 일정한 규칙으로 수를 나열한 것입니다. 규칙을 찾아 빈칸 ㉠에 알맞은 수를 구하시오.", q6, { label: "㉠ =" }),
  Q(7, "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의 ㉠에 알맞은 수를 써 넣으시오.", q7, { label: "㉠ =" }),
  Q(8, "[보기]의 표에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때 ㉠에 알맞은 수를 구하시오.", q8, { label: "㉠ =" }),
  Q(9, "다음 [보기]는 1에서 8까지 수를 한 번씩 사용하여 가로, 세로 각 줄에 있는 세 수의 합이 모두 12가 되도록 만든 것입니다. 오른쪽 그림의 가로, 세로 각 줄의 합이 모두 15가 되도록 할 때, ㉠에 알맞은 수를 구하시오.", q9, { label: "㉠ =" }),
  Q(10, "18개의 큐브가 있습니다. 윤서가 다빈이보다 큐브를 6개 더 많이 가지려면 윤서는 몇 개의 큐브를 가져야 합니까?", q10, { label: "답", unit: "개" }),
  Q(11, "일의 자리 숫자가 0, 2, 4, 6, 8인 수를 짝수라고 합니다. 다음 주어진 조건을 만족하는 두 자리 수를 구하시오.", q11),
  Q(12, "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하시오.", q12, { label: "㉠ =" }),
  Q(13, "26명이 탄 버스가 출발했습니다. 다음과 같이 타고 내렸다면, 지금 버스에 타고 있는 사람은 몇 명입니까?", q13, { label: "답", unit: "명" }),
  Q(14, "[보기]의 계산식에서 같은 모양은 같은 수를 나타냅니다. 오른쪽 계산식에서 □는 같은 수를 나타낼 때, ♡에 알맞은 수를 구하시오.", q14, { label: "♡ =" }),
  Q(15, "색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려나간 부분에 있는 수들의 합을 구하시오.", q15),
  Q(16, "작은 정사각형 색종이를 이어 붙여 다음 모양을 만들어 나갈 때, 8번째 모양에는 작은 정사각형 색종이가 몇 장 필요합니까?", q16, { label: "답", unit: "개" }),
  Q(17, "다음 양팔 저울은 모두 수평입니다. [그림 3]의 ? 부분에 ☆를 몇 개 올려놓으면 수평이 되는지 구하시오.", q17, { label: "답", unit: "개" }),
  Q(18, "다음 ☆, ○, ▽은 서로 다른 한자리 수입니다. □가 나타내는 수를 구하시오.", q18, { label: "□ =" }),
  Q(19, "다음 그림은 수직선 위에 6개의 점 사이의 거리를 나타낸 것입니다. 두 점 E와 F 사이의 거리를 구하시오.", q19),
  Q(20, "다음과 같은 규칙으로 바둑돌을 놓을 때 흰 돌이 검은 돌보다 18개 많아지는 것은 몇 번째인지 구하시오.", q20, { label: "답", unit: "번째" }),
];
