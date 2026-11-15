// 7세 6차 선발시험(k7-2022-12) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/k7-2022-12) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 12번 사탕 그림은 개수만 같게 단순한 사탕 그림으로 바꿨다. 11번의 검은(칠한) 모양·흰 모양은 「색칠한 모양 / 빈 모양」으로 그렸다.
import { UT, text, svg, line, cardsRow, conditionsBox, shape, cell, disc, frame, blockArrow, balance, stone, caption, equation, f1 } from "./kit.js?v=20261114a";

export const perPage = 2;
const SHAPES = ["diamond", "square", "circle", "triangle", "star", "heart"];

// 1. 네 원 둘레 합 — sums 차례: 위 · 오른쪽 · 아래 · 왼쪽
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
const q1 = () => svg(640, 290, "보기와 오른쪽 그림", frame(10, 14, 300, 266) + ringSquare(160, 34, [1, 2, 3, 4], [2, 1, 4, 3], [3, 4, 7, 6], { gap: 130, r: 21 }) + ringSquare(480, 34, [5, 6, 7, 8], ["", "", "", ""], [15, 14, 11, 12], { gap: 150, r: 26 }), 600);

// 2. 조건과 칸
const q2 = () => {
  const s = 54, ox = 4, oy = 4;
  const cells = [[1, 0, ""], [0, 1, "㉠"], [1, 1, ""], [2, 1, ""], [2, 2, ""]].map(([c, r, v]) => cell(ox + c * s, oy + r * s, s, s, v, { stroke: UT.ink }));
  const box = conditionsBox(["빈 칸에는 1, 2, 3, 4, 5가 한 번만 들어갑니다.", "3의 왼쪽에 4가 있습니다.", "1은 3 바로 아래에 있습니다.", "5는 4의 위에 있습니다."]);
  return `<div style="display:grid;gap:16px;width:100%;justify-items:center">${box}${svg(170, 170, "빈 칸 그림", cells.join(""), 160)}</div>`;
};

// 3. 모으기 나무
const q3 = () => {
  const s = 46;
  const top = [[60, 10], [170, 10], [280, 10]].map(([x, y], i) => cell(x, y, s, s, i === 1 ? "㉠" : ""));
  const mid = [[115, 90], [225, 90]].map(([x, y]) => cell(x, y, s, s));
  const lines = line(83, 56, 138, 90) + line(193, 56, 138, 90) + line(193, 56, 248, 90) + line(303, 56, 248, 90) + line(138, 136, 193, 170) + line(248, 136, 193, 170);
  return svg(390, 210, "모으기 그림", lines + top.join("") + mid.join("") + text(193, 190, "11", { size: 24 }), 330);
};

// 4. 수 표
const q4 = () => {
  const s = 54, rows = [[6, 12, 18, ""], ["", 16, 22, 28], ["", "", "", 32], ["㉠", "", "", 36]];
  return svg(226, 226, "수 표", rows.map((row, r) => row.map((v, c) => cell(4 + c * s, 4 + r * s, s, s, v, { stroke: UT.ink, size: 20 })).join("")).join(""), 230);
};

// 5. 화살표 규칙
const q5 = () => {
  const b = 40;
  const sq = (cx, cy, v) => cell(cx - b / 2, cy - b / 2, b, b, v, { stroke: UT.ink, size: 16 });
  let left = frame(10, 14, 270, 272) + sq(145, 150, 15) + sq(145, 72, 16) + sq(63, 150, 5) + sq(227, 150, 25) + sq(145, 228, 14);
  left += blockArrow(145, 128, 145, 94) + blockArrow(123, 150, 85, 150) + blockArrow(167, 150, 205, 150) + blockArrow(145, 172, 145, 206);
  const X = [350, 428, 506, 584], Y = [60, 150, 240];
  const path = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [1, 2], [2, 2], [3, 2], [3, 1]];
  let right = "";
  for (let i = 0; i < path.length - 1; i += 1) {
    const [c0, r0] = path[i], [c1, r1] = path[i + 1];
    const dx = Math.sign(X[c1] - X[c0]), dy = Math.sign(Y[r1] - Y[r0]);
    right += blockArrow(X[c0] + dx * 24, Y[r0] + dy * 24, X[c1] - dx * 24, Y[r1] - dy * 24);
  }
  right += sq(X[0], Y[0], 57) + path.slice(1, -1).map(([c, r]) => disc(X[c], Y[r], 21)).join("") + sq(X[3], Y[1], "㉠");
  return svg(620, 290, "보기와 화살표 길", left + right, 600);
};

// 6. 줄 서기
const q6 = () => {
  const box = conditionsBox(["주희는 뒤에서 여섯 번째에 서 있습니다.", "주희와 지훈이 사이에는 3명이 서 있습니다."]);
  const circles = svg(470, 64, "줄 선 자리", text(20, 32, "앞", { size: 14 }) + Array.from({ length: 7 }, (_, i) => disc(66 + i * 56, 32, 25)).join("") + text(450, 32, "뒤", { size: 14 }), 460);
  return `<div style="display:grid;gap:22px;width:100%;justify-items:center">${box}${circles}</div>`;
};

// 7. 네모 둘레 합
function ringBoxes(ox, oy, values, label, s = 48, step = 76) {
  const pos = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  let out = line(ox + s, oy + s / 2, ox + 2 * step, oy + s / 2) + line(ox + s, oy + 2 * step + s / 2, ox + 2 * step, oy + 2 * step + s / 2)
    + line(ox + s / 2, oy + s, ox + s / 2, oy + 2 * step) + line(ox + 2 * step + s / 2, oy + s, ox + 2 * step + s / 2, oy + 2 * step);
  out += pos.map(([c, r], i) => cell(ox + c * step, oy + r * step, s, s, values[i], { stroke: UT.ink, size: 22 })).join("");
  return out + text(ox + step + s / 2, oy + step + s / 2, label, { size: 16 });
}
const q7 = () => {
  const left = frame(10, 22, 280, 266) + ringBoxes(50, 52, [3, 5, 7, 4, 2, 8, 1, 6], "합 : 15");
  const cards = `<g transform="translate(362,4)">${cardsRow([1, 2, 3, 4, 5, 6, 7, 8], 250, 0, 26)}</g>`;
  const right = ringBoxes(390, 56, ["㉠", "", 6, "", "", 3, "", 2], "합 : 12");
  return svg(630, 296, "보기와 오른쪽 그림", left + cards + right, 600);
};

// 8. 합 표(색칠된 칸 = 합)
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
  const right = sumTable(420, 40, [["diamond", "square", 30], ["diamond", "circle", "㉠"], [36, 29, null]], s);
  return svg(620, 290, "보기 표와 오른쪽 표", left + right, 600);
};

// 9. 버스
const q9 = () => conditionsBox(["첫 번째 정류장에서 6명이 탔습니다.", "두 번째 정류장에서 17명이 내렸습니다."]);

// 10. 계산식
const q10 = () => {
  const t = (x, y, v, anchor = "middle") => text(x, y, v, { size: 20, weight: 600, anchor });
  let left = frame(10, 14, 260, 120);
  left += disc(100, 52, 15, "4", { stroke: UT.ink, size: 18 }) + t(140, 52, "+ 5") + t(184, 52, "= 9");
  left += t(84, 100, "7 −") + disc(124, 100, 15, "4", { stroke: UT.ink, size: 18 }) + t(166, 100, "= 3");
  let right = `<rect x="350" y="6" width="260" height="128" rx="14" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`;
  right += cell(392, 36, 32, 32, "", { stroke: UT.ink }) + t(432, 52, "+ 47", "start") + t(482, 52, "= 64", "start");
  right += t(392, 100, "72 −", "start") + cell(438, 84, 32, 32, "", { stroke: UT.ink }) + t(486, 100, "=") + shape("heart", 512, 101, 30);
  return svg(620, 144, "보기 계산식과 오른쪽 계산식", left + right, 600);
};

// 11. 모양 규칙(색칠한 모양 / 빈 모양)
function solidShape(kind, cx, cy, s, filled) {
  const color = { circle: UT.red, triangle: UT.green, square: UT.blue }[kind];
  return shape(kind, cx, cy, s).replace(/fill="[^"]*"/, `fill="${filled ? color : "#fff"}"`);
}
const q11 = () => {
  const seq = [["circle", 1], ["triangle", 0], ["square", 1], ["circle", 0], ["triangle", 1], ["square", 0], ["circle", 1], ["triangle", 0], ["square", 1]];
  let out = seq.map(([k, f], i) => solidShape(k, 30 + i * 56, 34, 34, f) + caption(30 + i * 56, 80, `(${i + 1})`)).join("");
  out += text(518, 36, "…", { size: 20 }) + text(548, 34, "(", { size: 30, weight: 400 }) + text(626, 34, ")", { size: 30, weight: 400 }) + caption(587, 80, "(20)");
  return svg(640, 96, "모양 규칙", out, 620);
};

// 12. 사탕 24개
function candy(cx, cy) {
  return `<polygon points="${f1(cx - 11)},${f1(cy)} ${f1(cx - 20)},${f1(cy - 7)} ${f1(cx - 20)},${f1(cy + 7)}" fill="${UT.pink}"/><polygon points="${f1(cx + 11)},${f1(cy)} ${f1(cx + 20)},${f1(cy - 7)} ${f1(cx + 20)},${f1(cy + 7)}" fill="${UT.pink}"/>`
    + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="11" fill="#ffd45c" stroke="${UT.pink}" stroke-width="1.6"/><path d="M${f1(cx - 5)} ${f1(cy - 2)} q5 -6 9 0 q2 6 -5 7" fill="none" stroke="${UT.pink}" stroke-width="1.8"/>`;
}
const q12 = () => {
  let out = "";
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 6; c += 1) out += candy(26 + c * 52, 18 + r * 36);
  return svg(312, 146, "사탕 24개", out, 340);
};

// 13. 홀수 조건
const q13 = () => conditionsBox(["20보다 크고 50보다 작은 홀수입니다.", "일의 자리 숫자가 십의 자리 숫자보다 4 큽니다."]);

// 14. 도형 합 표
const q14 = () => {
  const s = 50, ox = 6, oy = 6;
  const rows = [["triangle", "triangle", "triangle", 12], ["square", "square", "triangle", 22], ["circle", "diamond", "heart", "㉠"], [18, 20, 14, null]];
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    if (SHAPES.includes(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: UT.yellowSoft, stroke: UT.ink, size: 19 });
  }));
  return svg(212, 212, "도형 표", out, 230);
};

// 15. 정삼각형 늘어나기
const q15 = () => {
  const a = 26, h = a * Math.sqrt(3) / 2, base = 130;
  const fig = (n, cx) => {
    const top = base - n * h;
    let out = "";
    for (let r = 0; r < n; r += 1) {
      const y0 = top + r * h, y1 = y0 + h;
      for (let i = 0; i <= r; i += 1) {
        const x = cx + (i - r / 2) * a;
        out += `<polygon points="${f1(x)},${f1(y0)} ${f1(x + a / 2)},${f1(y1)} ${f1(x - a / 2)},${f1(y1)}" fill="${UT.yellowSoft}" stroke="${UT.ink}" stroke-width="1.1" stroke-linejoin="round"/>`;
        if (i < r) out += `<polygon points="${f1(x)},${f1(y0)} ${f1(x + a)},${f1(y0)} ${f1(x + a / 2)},${f1(y1)}" fill="${UT.yellowSoft}" stroke="${UT.ink}" stroke-width="1.1" stroke-linejoin="round"/>`;
      }
    }
    return out;
  };
  const xs = [40, 118, 220, 356], names = ["첫 번째", "두 번째", "세 번째", "네 번째"];
  return svg(470, 160, "정삼각형 모양", xs.map((x, i) => fig(i + 1, x) + caption(x, base + 20, names[i])).join("") + text(450, 40, "…", { size: 20 }), 460);
};

// 16. 양팔 저울
const q16 = () => {
  let out = frame(140, 14, 400, 112, "보기") + balance(340, 64, [["cylinder"]], [["cube"]], { span: 56, plate: 34, s: 30 }) + text(340, 44, "=", { size: 18 });
  out += text(340, 112, "양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.", { size: 13, weight: 600 });
  const o = { span: 54, plate: 38 };
  out += balance(105, 222, [["circle", "circle", "diamond"], ["circle", "circle"]], [["star", "star", "star"]], o) + caption(105, 280, "[그림 1]", 13);
  out += balance(340, 222, [["diamond", "diamond", "star"], ["diamond"]], [["circle", "circle"], ["circle", "circle"]], o) + caption(340, 280, "[그림 2]", 13);
  out += balance(575, 222, [["diamond", "star", "star"]], [], o) + caption(575, 280, "[그림 3]", 13);
  out += `<rect x="${575 + 54 - 30}" y="${222 - 66}" width="60" height="60" rx="3" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>` + text(575 + 54, 222 - 36, "?", { size: 26, weight: 600 });
  return svg(680, 292, "양팔 저울 세 개", out, 640);
};

// 17. 색종이 접어 자르기(대각선 왼쪽 아래 → 오른쪽 위)
const q17 = () => {
  const s = 48, ox = 16, oy = 16, n = 4;
  const G = "#2f9e5f";
  const P = (list) => list.map(([c, r]) => `${f1(ox + c * s)},${f1(oy + r * s)}`).join(" ");
  let left = `<rect x="${ox}" y="${oy}" width="${n * s}" height="${n * s}" fill="#fff"/>`;
  left += `<polygon points="${P([[0, 4], [4, 0], [4, 4]])}" fill="${UT.greenSoft}"/>`;
  left += `<polygon points="${P([[3, 1], [4, 1], [4, 2], [3, 2], [3, 4], [2, 4], [2, 2]])}" fill="#5fc89a"/>`;
  for (let k = 1; k < n; k += 1) left += line(ox + k * s, oy, ox + k * s, oy + n * s, { stroke: G, width: 1, dash: "4 3" }) + line(ox, oy + k * s, ox + n * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  left += `<rect x="${ox}" y="${oy}" width="${n * s}" height="${n * s}" fill="none" stroke="${G}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
  left += line(ox, oy + n * s, ox + n * s, oy, { stroke: G, width: 1.4 }) + line(ox + n * s, oy, ox + n * s, oy + n * s, { stroke: G, width: 1.4 }) + line(ox, oy + n * s, ox + n * s, oy + n * s, { stroke: G, width: 1.4 });
  const ax = ox + 2 * s, ay = oy + 2 * s;
  left += `<path d="M${f1(ax + 4)} ${f1(ay + 18)} Q${f1(ax + 4)} ${f1(ay - 4)} ${f1(ax - 18)} ${f1(ay - 8)}" fill="none" stroke="${UT.red}" stroke-width="1.6"/><polygon points="${f1(ax - 22)},${f1(ay - 8)} ${f1(ax - 12)},${f1(ay - 14)} ${f1(ax - 13)},${f1(ay - 3)}" fill="${UT.red}"/>`;
  const mid = blockArrow(ox + n * s + 22, oy + 2 * s, ox + n * s + 58, oy + 2 * s, { fill: "#5fc89a", stroke: G });
  const nums = [[1, 3, 4, 2], [8, 6, 7, 5], [4, 1, 2, 3], [6, 5, 7, 8]];
  const rx = ox + n * s + 80;
  let right = `<rect x="${rx}" y="${oy}" width="${n * s}" height="${n * s}" fill="#fff" stroke="${G}" stroke-width="1.4"/>`;
  for (let k = 1; k < n; k += 1) right += line(rx + k * s, oy, rx + k * s, oy + n * s, { stroke: G, width: 1, dash: "4 3" }) + line(rx, oy + k * s, rx + n * s, oy + k * s, { stroke: G, width: 1, dash: "4 3" });
  right += nums.map((row, r) => row.map((v, c) => text(rx + c * s + s / 2, oy + r * s + s / 2 + 1, v, { size: 20, weight: 600 })).join("")).join("");
  return svg(rx + n * s + 16, oy * 2 + n * s, "접어 자른 색종이와 수 표", left + mid + right, 560);
};

// 18. 도형 식 세 줄
const q18 = () => {
  const rows = [["star", "+", "star", "+", "star", "=", "circle", "+", "circle", "+", "circle", "+", "circle"], ["star", "+", "circle", "=", "triangleDown", "+", "triangleDown"], ["circle", "+", "triangleDown", "=", "blank"]];
  const out = `<rect x="4" y="4" width="352" height="142" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>` + rows.map((row, i) => equation(row, 24, 34 + i * 42, { s: 22, gap: 4, size: 18 }).markup).join("");
  return svg(360, 150, "도형 식 세 줄", out, 360);
};

// 19. 바둑돌 삼각형
const q19 = () => {
  const d = 22, base = 150;
  const fig = (n, cx) => {
    let out = "";
    for (let k = 1; k <= n; k += 1) for (let i = 0; i < k; i += 1) out += stone(cx + (i - (k - 1) / 2) * d, base - (n - k) * d * 0.9, k % 2 === 1);
    return out;
  };
  const xs = [36, 100, 184, 300, 450], names = ["첫 번째", "두 번째", "세 번째", "네 번째", "다섯 번째"];
  return svg(570, 186, "바둑돌 삼각형", xs.map((x, i) => fig(i + 1, x) + caption(x, base + 26, names[i])).join("") + text(548, 70, "…", { size: 20 }), 560);
};

// 20. 수직선 위 거리
const q20 = () => {
  const y = 120, P = { A: 30, B: 120, C: 146, D: 261, E: 434, F: 583 };
  const arc = (a, b, h, label, up = true) => {
    const x1 = P[a], x2 = P[b], mx = (x1 + x2) / 2, cy = up ? y - h : y + h, py = up ? y - h / 2 : y + h / 2;
    const path = `<path d="M${x1} ${y} Q${mx} ${cy} ${x2} ${y}" fill="none" stroke="${UT.line}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    if (label === "box") return path + `<rect x="${mx - 18}" y="${py - 12}" width="36" height="24" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/>`;
    const w = String(label).length * 10 + 10;
    return path + `<rect x="${mx - w / 2}" y="${py - 11}" width="${w}" height="22" fill="#fff"/>` + text(mx, py, label, { size: 16, weight: 600 });
  };
  let out = arc("A", "D", 100, 36) + arc("C", "E", 110, 45) + arc("E", "F", 90, "box") + arc("A", "C", 70, 18, false) + arc("B", "D", 70, 22, false) + arc("B", "F", 200, 72, false);
  out += line(P.A, y, P.F, y, { width: 2 }) + Object.entries(P).map(([k, x]) => `<circle cx="${x}" cy="${y}" r="4" fill="${UT.ink}"/>` + text(x + (k === "B" ? -8 : 8), y + 14, k, { size: 13, weight: 600 })).join("");
  return svg(613, 230, "수직선 위 여섯 점", out, 600);
};

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "[보기]와 같은 규칙으로 오른쪽 그림의 ○에 5, 6, 7, 8을 모두 써넣으시오.", q1, null),
  Q(2, "주어진 조건을 보고 아래 그림의 빈 칸 ㉠에 알맞은 수를 써넣으시오.", q2, { label: "㉠ =" }),
  Q(3, "첫째 줄에 2, 3, 4를 한 번씩 넣어 두 번 모으기 한 값이 11이 되게 만들려고 합니다. ㉠에 알맞은 수를 구하시오.", q3, { label: "㉠ =" }),
  Q(4, "다음 표는 일정한 규칙으로 수를 나열한 것입니다. 규칙을 찾아 빈칸 ㉠에 알맞은 수를 구하시오.", q4, { label: "㉠ =" }),
  Q(5, "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의 ㉠에 알맞은 수를 써넣으시오.", q5, { label: "㉠ =" }),
  Q(6, "7명의 친구들이 줄을 서 있습니다. 다음을 보고 지훈이는 앞에서 몇 번째에 서 있는지 구하시오.", q6, { label: "답", unit: "번째" }),
  Q(7, "다음 [보기]는 1에서 8까지 수를 한 번씩 사용하여 가로, 세로 각 줄에 있는 세 수의 합이 모두 15가 되도록 만든 것입니다. 오른쪽 그림의 가로, 세로 각 줄의 합이 모두 12가 되도록 할 때, ㉠에 알맞은 수를 구하시오.", q7, { label: "㉠ =" }),
  Q(8, "[보기]의 표에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하시오.", q8, { label: "㉠ =" }),
  Q(9, "27명이 탄 버스가 출발했습니다. 다음과 같이 타고 내렸다면, 지금 버스에 타고 있는 사람은 몇 명인지 구하시오.", q9, { label: "답", unit: "명" }),
  Q(10, "[보기]의 계산식에서 같은 모양은 같은 수를 나타냅니다. 오른쪽 계산식에서 □는 같은 수를 나타낼 때, ♡에 알맞은 수를 구하시오.", q10, { label: "♡ =" }),
  Q(11, "아래 그림의 규칙을 찾아 20번째 모양을 그리시오.", q11, { label: "20번째 모양" }),
  Q(12, "24개의 사탕이 있습니다. 윤서가 다빈이보다 사탕을 6개 더 많이 가지려면 윤서는 몇 개의 사탕을 가져야 하는지 구하시오.", q12, { label: "답", unit: "개" }),
  Q(13, "일의 자리 숫자가 1, 3, 5, 7, 9인 수를 홀수라고 합니다. 다음 주어진 조건을 만족하는 두 자리 수를 구하시오.", q13),
  Q(14, "다음 그림에서 같은 모양은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하시오.", q14, { label: "㉠ =" }),
  Q(15, "작은 정삼각형 색종이를 이어 붙여 다음 모양을 만들어 나갈 때, 8번째 모양에는 작은 정삼각형 색종이가 몇 장 필요한지 구하시오.", q15, { label: "답", unit: "장" }),
  Q(16, "다음 양팔 저울은 모두 수평입니다. [그림 3]의 ? 부분에 ○를 몇 개 올려놓으면 수평이 되는지 구하시오.", q16, { label: "답", unit: "개" }),
  Q(17, "색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려나간 부분에 있는 수들의 합을 구하시오.", q17),
  Q(18, "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하시오.", q18, { label: "□ =" }),
  Q(19, "다음과 같은 규칙으로 바둑돌을 놓을 때 검은 돌이 흰 돌보다 21개 많아지는 것은 몇 번째인지 구하시오.", q19, { label: "답", unit: "번째" }),
  Q(20, "다음 그림은 수직선 위에 6개의 점 사이의 거리를 나타낸 것입니다. 두 점 E와 F 사이의 거리를 구하시오.", q20),
];
