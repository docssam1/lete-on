// 7세 1차 선발시험(k6-2023-02) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/k6-2023-02) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 2번 사탕 그림은 사탕 수만 같게 단순한 그림으로 바꿨다.
import { UT, text, svg, line, cardsRow, conditionsBox, shape, ringed, cell, disc, mark, frame, blockArrow, arrow, plusMark, equation, balance, stone, caption, f1 } from "./kit.js?v=20261114a";

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
const q1 = () => svg(640, 290, "보기와 오른쪽 그림", frame(10, 14, 300, 266) + ringSquare(160, 34, [2, 4, 6, 8], [2, 4, 6, 8], [6, 12, 14, 8], { gap: 130, r: 21 }) + ringSquare(480, 34, [1, 3, 5, 7], ["", "", "", ""], [4, 6, 12, 10], { gap: 150, r: 26 }), 600);

// 2. 사탕 주머니
function bag(cx, cy, count, label) {
  const neck = `<path d="M${cx - 46} ${cy - 62} q8 -18 22 -6 q12 -16 24 0 q12 -16 24 0 q14 -12 22 6 L${cx + 30} ${cy - 30} L${cx - 30} ${cy - 30}Z" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.8" stroke-linejoin="round"/>`;
  const body = `<path d="M${cx - 34} ${cy - 34} C${cx - 130} ${cy - 10} ${cx - 110} ${cy + 76} ${cx} ${cy + 76} C${cx + 110} ${cy + 76} ${cx + 130} ${cy - 10} ${cx + 34} ${cy - 34}Z" fill="#f2fbf5" stroke="${UT.green}" stroke-width="1.8"/>`;
  const rows = count === 8 ? [3, 5] : [1, 3];
  let candies = "";
  rows.forEach((n, r) => { for (let i = 0; i < n; i += 1) candies += candy(cx + (i - (n - 1) / 2) * 34, cy + 6 + r * 30); });
  return text(cx, cy - 92, label, { size: 15, weight: 800 }) + body + neck + candies;
}
function candy(cx, cy) {
  return `<polygon points="${f1(cx - 11)},${f1(cy)} ${f1(cx - 20)},${f1(cy - 7)} ${f1(cx - 20)},${f1(cy + 7)}" fill="${UT.pink}"/><polygon points="${f1(cx + 11)},${f1(cy)} ${f1(cx + 20)},${f1(cy - 7)} ${f1(cx + 20)},${f1(cy + 7)}" fill="${UT.pink}"/>`
    + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="11" fill="#ffd45c" stroke="${UT.pink}" stroke-width="1.6"/><path d="M${f1(cx - 5)} ${f1(cy - 2)} q5 -6 9 0 q2 6 -5 7" fill="none" stroke="${UT.pink}" stroke-width="1.8"/>`;
}
const q2 = () => svg(560, 210, "강준이와 다현이의 사탕 주머니", bag(150, 110, 8, "강준") + bag(410, 110, 4, "다현"), 520);

// 3. 모으기 나무
const q3 = () => {
  const s = 46;
  const top = [[60, 10], [170, 10], [280, 10]].map(([x, y], i) => cell(x, y, s, s, i === 1 ? "㉠" : ""));
  const mid = [[115, 90], [225, 90]].map(([x, y]) => cell(x, y, s, s));
  const lines = line(83, 56, 138, 90) + line(193, 56, 138, 90) + line(193, 56, 248, 90) + line(303, 56, 248, 90) + line(138, 136, 193, 170) + line(248, 136, 193, 170);
  return svg(390, 210, "모으기 그림", lines + top.join("") + mid.join("") + text(193, 190, "9", { size: 24 }), 330);
};

// 4. 계단 피라미드
const q4 = () => {
  const s = 46, cx = 150, rows = [["1"], ["2", ""], ["", "", ""], ["", "", "㉠", ""]];
  const out = rows.map((row, r) => row.map((v, i) => cell(cx - row.length * s / 2 + i * s, 6 + r * s, s, s, v, { stroke: UT.ink, size: 17 })).join("")).join("");
  return svg(300, 196, "도형 칸", out, 260);
};

// 5. 달리기 등수
const q5 = () => {
  const box = conditionsBox(["성준이는 3등입니다.", "준수는 연우보다 먼저 들어왔지만 1등은 아닙니다."]);
  const circles = svg(300, 80, "등수 자리", [0, 1, 2, 3].map((i) => disc(45 + i * 70, 30, 26) + caption(45 + i * 70, 70, `${i + 1}등`, 13)).join(""), 280);
  return `<div style="display:grid;gap:16px;width:100%;justify-items:center">${box}${circles}</div>`;
};

// 6. 원판
function wheel(cx, cy, [tl, tr, bl, br, center]) {
  const R = 66, r = 27;
  return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="${UT.box}" stroke-width="1.8"/>`
    + line(cx, cy - R, cx, cy - r, { stroke: UT.box }) + line(cx, cy + r, cx, cy + R, { stroke: UT.box }) + line(cx - R, cy, cx - r, cy, { stroke: UT.box }) + line(cx + r, cy, cx + R, cy, { stroke: UT.box })
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${UT.yellowSoft}" stroke="${UT.box}" stroke-width="1.8"/>`
    + text(cx - 36, cy - 33, tl, { size: 21 }) + text(cx + 36, cy - 33, tr, { size: 21 }) + text(cx - 36, cy + 34, bl, { size: 21 }) + text(cx + 36, cy + 34, br, { size: 21 }) + text(cx, cy + 1, center, { size: 22 });
}
const q6 = () => svg(480, 150, "원판 세 개", wheel(80, 75, [3, 5, 2, 4, 7]) + wheel(240, 75, [7, 5, 4, 2, 9]) + wheel(400, 75, ["", 8, 2, 4, 10]), 470);

// 7. 합 표
function sumTable(ox, oy, rows, s = 52) {
  const sum = UT.yellowSoft;
  let out = blockArrow(ox + 4, oy - 22, ox + 3 * s, oy - 22) + plusMark(ox + 1.5 * s, oy - 42) + blockArrow(ox - 22, oy + 4, ox - 22, oy + 3 * s) + plusMark(ox - 44, oy + 1.5 * s);
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const isSum = r === 2 || c === 2;
    const x = ox + c * s, y = oy + r * s;
    if (["diamond", "square", "circle", "triangle", "star"].includes(v)) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 30);
    else out += cell(x, y, s, s, v, { fill: isSum ? sum : "#fff", stroke: UT.ink, size: 20 });
  }));
  return out;
}
const q7 = () => svg(640, 290, "보기 표와 오른쪽 표",
  frame(10, 14, 300, 266) + sumTable(92, 84, [[5, 4, 9], [3, 7, 10], [8, 11, null]]) + sumTable(430, 84, [["diamond", "diamond", 14], ["square", "circle", "㉠"], [12, 10, null]]), 600);

// 8. 모양 규칙
const q8 = () => {
  const kinds = ["circle", "triangle", "circle", "circle", "triangle", "circle", "circle"];
  let out = kinds.map((k, i) => shape(k, 34 + i * 62, 36, 36) + caption(34 + i * 62, 82, `${i + 1}번째`)).join("");
  out += text(468, 38, "…", { size: 20 }) + text(500, 36, "(", { size: 30, weight: 400 }) + text(596, 36, ")", { size: 30, weight: 400 }) + caption(548, 82, "11번째");
  return svg(620, 100, "모양 규칙", out, 600);
};

// 9. 화살표 규칙
const q9 = () => {
  const b = 40;
  const sq = (cx, cy, v) => cell(cx - b / 2, cy - b / 2, b, b, v, { stroke: UT.ink, size: 16 });
  let left = frame(10, 14, 270, 272) + sq(145, 150, 15) + sq(145, 72, 5) + sq(63, 150, 14) + sq(227, 150, 16) + sq(145, 228, 25);
  left += blockArrow(145, 128, 145, 94) + blockArrow(123, 150, 85, 150) + blockArrow(167, 150, 205, 150) + blockArrow(145, 172, 145, 206);
  const X = [350, 420, 490, 560], Y = [256, 186, 116, 40];
  const path = [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [1, 2], [1, 3]];
  let right = "";
  for (let i = 0; i < path.length - 1; i += 1) {
    const [c0, r0] = path[i], [c1, r1] = path[i + 1];
    const dx = Math.sign(c1 - c0), dy = Math.sign(r1 - r0);
    right += blockArrow(X[c0] + dx * 22, Y[r0] - dy * 22, X[c1] - dx * 22, Y[r1] + dy * 22);
  }
  right += sq(X[0], Y[0], 82) + path.slice(1, -1).map(([c, r]) => disc(X[c], Y[r], 20)).join("") + sq(X[1], Y[3], "㉠");
  return svg(600, 290, "보기와 화살표 길", left + right, 580);
};

// 10. 버스
const q10 = () => conditionsBox(["처음 정류장에서 9명이 내렸습니다.", "두번째 정류장에서 13명이 탔습니다."]);

// 11. 식 완성
const q11 = () => svg(400, 70, "식", equation(["box", "+", "box", "−", "box", "=", "52"], 20, 36, { s: 32, gap: 10, size: 26 }).markup, 380);

// 12. 십자 칸
const q12 = () => {
  const s = 52, cx = 150, top = 52;
  const cells = [[cx - s / 2, top, "3"], [cx - s * 1.5, top + s, "2"], [cx - s / 2, top + s, "㉠"], [cx + s / 2, top + s, ""], [cx - s / 2, top + 2 * s, ""]];
  return svg(300, 216, "숫자 카드와 십자 칸", cardsRow([1, 2, 3, 4, 5], 300, 4, 32) + cells.map(([x, y, v]) => cell(x, y, s, s, v, { stroke: UT.ink, size: 22 })).join(""), 280);
};

// 13. 두 자리 수 조건
const q13 = () => conditionsBox(["십의 자리 숫자와 일의 자리 숫자의 합은 13입니다.", "십의 자리 숫자가 일의 자리 숫자보다 5 큽니다."]);

// 14. 구슬 다이아몬드
const q14 = () => {
  const dx = 22, dy = 17, cy = 98;
  const fig = (n, cx) => {
    let out = "";
    for (let k = 0; k < 2 * n - 1; k += 1) {
      const count = n - Math.abs(k - (n - 1));
      for (let i = 0; i < count; i += 1) out += `<circle cx="${f1(cx + (i - (count - 1) / 2) * dx)}" cy="${f1(cy + (k - (n - 1)) * dy)}" r="5" fill="${UT.purple}"/>`;
    }
    return out;
  };
  const xs = [40, 120, 230, 380];
  return svg(520, 200, "구슬 모양", xs.map((x, i) => fig(i + 1, x) + caption(x, 188, `${i + 1}번째`)).join("") + text(480, cy, "…", { size: 20 }), 500);
};

// 15. 도형 합 표
const q15 = () => {
  const s = 50, ox = 10, oy = 6;
  const rows = [["star", "square", "triangle", 23], ["square", "square", "star", 21], ["triangle", "square", "circle", 25], [23, 24, "㉠", null]];
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    if (typeof v === "string" && v !== "㉠") out += cell(x, y, s, s, "", { fill: "#f6f2e9", stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 24);
    else out += cell(x, y, s, s, v, { stroke: UT.ink, size: 19 });
  }));
  return svg(220, 212, "도형 표", out, 230);
};

// 16. 피아노
const q16 = () => {
  const w = 42, h = 128, ox = 20, oy = 4, names = ["도", "레", "미", "파", "솔", "라", "시", "도"];
  let out = names.map((n, i) => `<rect x="${ox + i * w}" y="${oy}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="${UT.ink}" stroke-width="1.4"/><circle cx="${ox + i * w + w / 2}" cy="${oy + h - 18}" r="11" fill="#ece6d8"/>${text(ox + i * w + w / 2, oy + h - 17, n, { size: 11, weight: 700 })}`).join("");
  out += [1, 2, 4, 5, 6].map((k) => `<rect x="${ox + k * w - 12}" y="${oy}" width="24" height="78" rx="2" fill="#222"/>`).join("") + `<rect x="${ox + 8 * w - 10}" y="${oy}" width="10" height="78" fill="#222"/>`;
  const col = (k) => ox + k * w + w / 2;
  const y = [154, 178, 202, 226];
  out += [1, 2, 3, 4, 5, 6, 7].map((n, k) => text(col(k), y[0], n, { size: 14, weight: 600 })).join("");
  out += [14, 13, 12, 11, 10, 9, 8].map((n, i) => text(col(i + 1), y[1], n, { size: 14, weight: 600 })).join("");
  out += [15, 16, 17, 18, 19, 20, 21].map((n, k) => text(col(k), y[2], n, { size: 14, weight: 600 })).join("");
  out += [["…", 3], [25, 4], [24, 5], [23, 6], [22, 7]].map(([n, k]) => text(col(k), y[3], n, { size: 14, weight: 600 })).join("");
  out += arrow(col(6) + 12, y[0], col(7) - 4, y[1] - 9) + arrow(col(1) - 13, y[1], col(0) + 5, y[2] - 9) + arrow(col(6) + 14, y[2], col(7) - 4, y[3] - 9);
  return svg(400, 240, "피아노 건반과 순서", out, 380);
};

// 17. 양팔 저울
const q17 = () => {
  let out = frame(140, 14, 400, 112, "보기") + balance(340, 64, [["cylinder"]], [["cube"]], { span: 56, plate: 34, s: 30 }) + text(340, 44, "=", { size: 18 });
  out += text(340, 112, "양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.", { size: 13, weight: 600 });
  const o = { span: 54, plate: 38 };
  out += balance(105, 214, [["square", "square"], ["circle", "circle"]], [["star", "circle"]], o) + caption(105, 272, "[그림 1]", 13);
  out += balance(340, 214, [["circle", "circle", "circle"], ["circle", "circle", "circle"]], [["square", "square", "square"]], o) + caption(340, 272, "[그림 2]", 13);
  out += balance(575, 214, [["star", "square"]], [], o) + caption(575, 272, "[그림 3]", 13);
  return svg(680, 284, "양팔 저울 세 개", out, 640);
};

// 18. 도형 식
const q18 = () => {
  const rows = [["star", "+", "star", "+", "star", "=", "circle", "+", "circle", "+", "circle", "+", "circle"], ["star", "+", "circle", "=", "triangleDown", "+", "triangleDown"], ["star", "+", "triangleDown", "=", "blank"]];
  const out = `<rect x="4" y="4" width="352" height="142" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>` + rows.map((row, i) => equation(row, 24, 34 + i * 42, { s: 22, gap: 4, size: 18 }).markup).join("");
  return svg(360, 150, "도형 식 세 줄", out, 360);
};

// 19. 색칠 수
function shadeGrid(ox, oy, s, on) {
  let out = "";
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 4; c += 1) out += `<rect x="${ox + c * s}" y="${oy + r * s}" width="${s}" height="${s}" fill="${on.some(([a, b]) => a === r && b === c) ? UT.shade : "#fff"}" stroke="${UT.ink}" stroke-width="1.1"/>`;
  return out;
}
const q19 = () => {
  const examples = [[1, [[2, 3]]], [2, [[1, 3], [2, 3]]], [5, [[2, 2], [2, 3]]], [8, [[1, 2], [2, 2]]], [19, [[0, 3], [1, 3], [2, 3], [2, 1]]], [68, [[2, 0], [2, 2]]]];
  let out = `<rect x="4" y="4" width="632" height="112" rx="12" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`;
  out += examples.map(([n, on], i) => shadeGrid(24 + i * 102, 18, 16, on) + text(56 + i * 102, 96, n, { size: 15, weight: 600 })).join("");
  out += shadeGrid(260, 146, 30, [[0, 2], [1, 1], [1, 2], [2, 1], [2, 2], [2, 3]]);
  return svg(640, 242, "색칠한 칸과 수", out, 600);
};

// 20. 바둑돌
const q20 = () => {
  const d = 22, base = 186;
  const fig = (n, x) => {
    const k = n + 1;
    let out = "";
    for (let r = 0; r < k; r += 1) for (let c = 0; c < k; c += 1) out += stone(x + c * d + d / 2, base - (k - r) * d + d / 2, Math.max(r, c) % 2 === 0);
    return out + caption(x + k * d / 2, base + 18, `${n}번째`);
  };
  return svg(540, 212, "바둑돌 규칙", fig(1, 20) + fig(2, 100) + fig(3, 210) + fig(4, 344) + text(500, 130, "…", { size: 20 }), 520);
};

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "[보기]와 같은 규칙으로 오른쪽 그림의 ○에 1, 3, 5, 7을 모두 써넣으시오.", q1, null),
  Q(2, "강준이와 다현이가 사탕을 똑같이 먹으려고 합니다. 강준이가 다현이에게 사탕 몇 개를 주어야 하는지 구하시오.", q2, { label: "답", unit: "개" }),
  Q(3, "첫째 줄에 1, 2, 5를 알맞게 써넣어 2번 모으기 한 값이 9가 되도록 할 때, ㉠에 들어갈 수를 구하시오.", q3, { label: "㉠ =" }),
  Q(4, "도형 안에 1, 2, 3을 같은 숫자끼리 서로 이웃하지 않도록 써넣을 때, ㉠에 들어갈 수를 구하시오.", q4, { label: "㉠ =" }),
  Q(5, "준수, 민호, 성준, 연우 4명의 친구들이 달리기를 하고 있습니다. 다음을 보고 민호는 몇 등으로 달리고 있는지 구하시오.", q5, { label: "답", unit: "등" }),
  Q(6, "원판에 적힌 수의 규칙을 찾아 빈 칸에 알맞은 수를 써넣으시오.", q6),
  Q(7, "[보기]는 가로, 세로 각 줄의 합을 나타낸 표입니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하시오.", q7, { label: "㉠ =" }),
  Q(8, "아래 그림의 규칙을 찾아 11번째 모양을 그리시오.", q8, { label: "11번째 모양" }),
  Q(9, "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의 ㉠에 알맞은 수를 써넣으시오.", q9, { label: "㉠ =" }),
  Q(10, "25명이 탄 버스가 출발했습니다. 다음과 같이 내리고 탔다면, 지금 버스에 타고 있는 사람은 몇 명인지 구하시오.", q10, { label: "답", unit: "명" }),
  Q(11, "25, 43, 70을 한 번씩 써넣어 다음 식을 완성하시오.", q11, null),
  Q(12, "1부터 5까지 수를 넣어 가로줄과 세로줄에 놓인 세 수의 합을 같게 하려고 합니다. ㉠에 들어갈 수를 구하시오.", q12, { label: "㉠ =" }),
  Q(13, "다음 주어진 조건을 만족하는 두 자리 수를 구하시오.", q13),
  Q(14, "구슬을 놓아 다음 모양을 만들어 갈 때, 7번째 모양에는 구슬 몇 개가 놓이는지 구하시오.", q14),
  Q(15, "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. ㉠에 알맞은 수를 구하시오.", q15, { label: "㉠ =" }),
  Q(16, "윤아는 건반 아래에 쓰인 순서로 피아노를 치고 있습니다. 윤아가 건반을 80번 쳤다면 마지막에 친 음은 무엇인지 구하시오.", q16),
  Q(17, "다음 양팔 저울은 모두 수평입니다. [그림 3]이 수평이 되려면 오른쪽 접시에 ○를 몇 개 놓아야 하는지 구하시오.", q17, { label: "답", unit: "개" }),
  Q(18, "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하시오.", q18, { label: "□ =" }),
  Q(19, "다음은 도형을 색칠하여 수를 나타낸 것입니다. 아래 도형이 나타내는 수는 얼마인지 구하시오.", q19),
  Q(20, "바둑돌이 그림과 같은 규칙으로 놓여 있습니다. 17번째에 놓여 있는 흰 바둑돌과 검은 바둑돌의 수의 차는 몇 개인지 구하시오.", q20, { label: "답", unit: "개" }),
];
// 쓰지 않는 도구 이름이 남아도 괜찮다(다른 회차가 같은 꼴로 가져다 쓴다)
void ringed; void mark;
