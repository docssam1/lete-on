// 초1 3차 선발시험(g1-2019-08) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/g1-2019-08) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 원문에 답 칸 줄이 없는 회차라 답 줄도 두지 않았다(그림 속 빈 칸에 쓰는 문항은 그대로).
import { UT, esc, text, svg, line, box, conditionsBox, shape, ringed, cell, disc, blockArrow, arrow, balance, caption, f1 } from "./kit.js?v=20261114a";

export const perPage = 4;

// 조건 상자의 다른 꼴(대화·번호 목록) — conditionsBox 와 같은 종이색 상자
function noteBox(lines) {
  const rows = lines.map(([head, body]) => `<div style="display:grid;grid-template-columns:${head ? "auto minmax(0,1fr)" : "minmax(0,1fr)"};gap:6px;font-size:13px;font-weight:700;line-height:1.5;color:${UT.ink};word-break:keep-all">${head ? `<span style="white-space:nowrap">${esc(head)}</span>` : ""}<span>${esc(body)}</span></div>`).join("");
  return `<div style="display:grid;place-items:center;width:100%"><div style="display:grid;gap:5px;width:min(100%,440px);padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:6px;background:#fdfbf5">${rows}</div></div>`;
}
// 휘어진 화살표(접기 표시)
function curvedArrow(x1, y1, cx, cy, x2, y2, color = UT.arrow) {
  const dx = x2 - cx, dy = y2 - cy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux, h = 6;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<path d="M${f1(x1)} ${f1(y1)} Q${f1(cx)} ${f1(cy)} ${f1(bx)} ${f1(by)}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round"/><polygon points="${f1(x2)},${f1(y2)} ${f1(bx + px * h * 0.6)},${f1(by + py * h * 0.6)} ${f1(bx - px * h * 0.6)},${f1(by - py * h * 0.6)}" fill="${color}"/>`;
}
// 세로 덧셈 한 줄: cols = 각 자리 x(백·십·일), row = [백, 십, 일] — "box" 는 빈 칸, "" 는 비움
function digitRow(cols, y, row, { s = 28, size = 17, stroke = UT.box } = {}) {
  return row.map((v, i) => (v === "box" ? box(cols[i] - s / 2, y - s / 2, s, s, { fill: "#fff", stroke, radius: 2 }) : v === "" ? "" : text(cols[i], y + 1, v, { size, weight: 600 }))).join("");
}
const dashed = (d) => `<path d="${d}" fill="none" stroke="${UT.line}" stroke-width="1.3" stroke-dasharray="4 3"/>`;
const label = (x, y, value, size = 14) => `<rect x="${x - value.length * size * 0.32 - 4}" y="${y - size * 0.7}" width="${value.length * size * 0.64 + 8}" height="${size * 1.4}" fill="#fff"/>${text(x, y, value, { size, weight: 600 })}`;

// 3. 저울 셋
const q3 = () => {
  const o = { span: 44, plate: 31, s: 18 };
  let out = balance(80, 66, [["circle"]], [["square", "square"]], o) + caption(80, 124, "[그림 1]", 13);
  out += balance(260, 66, [["square", "square", "square"]], [["triangle", "triangle", "triangle"], ["triangle", "triangle", "triangle"]], o) + caption(260, 124, "[그림 2]", 13);
  out += balance(170, 168, [["circle"]], [], o) + caption(170, 226, "[그림 3]", 13);
  return svg(340, 236, "양팔 저울 세 개", out, 330);
};

// 6. 4×4 표
const q6 = () => {
  const s = 46, rows = [["1", "", "", "㉠"], ["", "2", "㉡", ""], ["", "", "3", ""], ["2", "", "", "4"]];
  return svg(192, 192, "4×4 표", rows.map((row, r) => row.map((v, c) => cell(4 + c * s, 4 + r * s, s, s, v, { stroke: UT.ink, size: 19 })).join("")).join(""), 200);
};

// 7. 오각형 곱
const q7 = () => {
  const C = { top: [155.5, 29.5], ul: [29.5, 121], ur: [280.8, 122.5], ll: [77.5, 268.8], lr: [232.8, 268.8] };
  const S = [[91.8, 75.5, 63], [221.5, 75.5, 56], [53.5, 195.5, 36], [257.8, 195.5, 40], [155.5, 268.8, 20]];
  const ring = [C.top, C.ul, C.ll, C.lr, C.ur, C.top];
  let out = ring.slice(0, -1).map((p, i) => line(p[0], p[1], ring[i + 1][0], ring[i + 1][1], { stroke: UT.green, width: 1.5 })).join("");
  out += Object.values(C).map(([x, y]) => disc(x, y, 23)).join("");
  out += S.map(([x, y, v]) => cell(x - 23, y - 23, 46, 46, v, { stroke: UT.green, size: 18 })).join("");
  return svg(312, 298, "오각형 모양의 원과 네모", out, 300);
};

// 8. 도형 합 표(오른쪽·아래 빈 칸)
const q8 = () => {
  const s = 40, ox = 4, oy = 4;
  const rows = [["circle", "diamond", "diamond", "circle"], ["circle", "square", "circle", "star"], ["circle", "square", "square", "star"], ["diamond", "star", "square", "square"]];
  let out = rows.map((row, r) => row.map((k, c) => cell(ox + c * s, oy + r * s, s, s, "", { stroke: UT.ink }) + shape(k, ox + c * s + s / 2, oy + r * s + s / 2, 22)).join("")).join("");
  const blank = (cx, cy) => box(cx - 17, cy - 17, 34, 34, { fill: "#fff", stroke: UT.box, radius: 2 });
  const right = ["10", null, "16", null];
  out += right.map((v, r) => (v ? text(ox + 4 * s + 22, oy + r * s + s / 2 + 1, v, { size: 17, weight: 600 }) : blank(ox + 4 * s + 22, oy + r * s + s / 2))).join("");
  const bottom = ["11", null, "13", null];
  out += bottom.map((v, c) => (v ? text(ox + c * s + s / 2, oy + 4 * s + 22, v, { size: 17, weight: 600 }) : blank(ox + c * s + s / 2, oy + 4 * s + 22))).join("");
  return svg(214, 210, "도형 표와 합", out, 220);
};

// 9. ㉠막대·㉡막대
const q9 = () => {
  const bar = (x, y, w, h, value, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${UT.line}" stroke-width="1.5"/>` + ringed(x + w / 2, y + h / 2, value);
  let out = [0, 1, 2, 3].map((i) => bar(50 + i * 65, 4, 65, 40, "ㄱ", UT.yellowSoft)).join("") + bar(50, 44, 260, 40, "ㄴ", UT.greenSoft);
  out += bar(20, 176, 65, 38, "ㄱ", UT.yellowSoft) + bar(85, 176, 260, 38, "ㄴ", UT.greenSoft);
  out += dashed("M20 176 Q52 150 85 176") + dashed("M85 176 Q215 122 345 176") + dashed("M20 214 Q182 254 345 214");
  out += box(26, 112, 32, 30, { fill: "#fff", stroke: UT.box, radius: 2 }) + text(76, 128, "cm", { size: 15, weight: 600 });
  out += box(196, 104, 32, 30, { fill: "#fff", stroke: UT.box, radius: 2 }) + text(246, 120, "cm", { size: 15, weight: 600 });
  out += label(182, 236, "35cm", 15);
  return svg(360, 252, "막대 그림", out, 340);
};

// 10. 정사각형 ㉮㉯㉰㉱
const q10 = () => {
  const sq = (x, y, w, mark) => `<rect x="${x}" y="${y}" width="${w}" height="${w}" fill="#fff" stroke="${UT.ink}" stroke-width="1.5"/>` + ringed(x + w / 2, y + w / 2, mark);
  let out = sq(76, 6, 150, "가") + sq(226, 6, 100, "나") + sq(226, 106, 50, "다") + sq(276, 106, 50, "라");
  out += dashed("M76 6 Q46 81 76 156") + label(40, 81, "12cm", 14);
  return svg(334, 162, "정사각형 네 개", out, 330);
};

// 11. 도형 덧셈
const q11 = () => {
  const X = [60, 110, 160];
  let out = `<rect x="4" y="4" width="212" height="160" rx="14" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  out += shape("circle", X[1], 38, 34) + shape("circle", X[2], 38, 34);
  out += text(30, 86, "+", { size: 22 }) + shape("circle", X[1], 86, 34) + shape("square", X[2], 86, 32);
  out += line(24, 112, 196, 112, { stroke: UT.ink, width: 1.6 });
  out += [0, 1, 2].map((i) => shape("diamond", X[i], 138, 36)).join("");
  return svg(220, 168, "도형 덧셈", out, 220);
};

// 12. 삼각형 규칙
function triFigure(n, cx, base, u = 24) {
  const h = u * 0.866, top = base - n * h;
  let out = "";
  for (let r = 0; r < n; r += 1) {
    for (let k = 0; k <= r; k += 1) {
      const ax = cx + (k - r / 2) * u, ay = top + r * h;
      out += `<polygon points="${f1(ax)},${f1(ay)} ${f1(ax + u / 2)},${f1(ay + h)} ${f1(ax - u / 2)},${f1(ay + h)}" fill="#fff" stroke="${UT.ink}" stroke-width="1.2" stroke-linejoin="round"/>`;
    }
    for (let k = 0; k < r; k += 1) {
      const lx = cx + (k - r / 2) * u, ly = top + r * h;
      out += `<polygon points="${f1(lx)},${f1(ly)} ${f1(lx + u)},${f1(ly)} ${f1(lx + u / 2)},${f1(ly + h)}" fill="${UT.shade}" stroke="${UT.ink}" stroke-width="1.2" stroke-linejoin="round"/>`;
    }
  }
  return out;
}
const q12 = () => {
  const xs = [26, 82, 160, 262], names = ["첫 번째", "두 번째", "세 번째", "네 번째"];
  return svg(340, 140, "삼각형 규칙", xs.map((x, i) => triFigure(i + 1, x, 112) + caption(x, 130, names[i], 12)).join("") + text(324, 60, "…", { size: 18 }), 340);
};

// 13. 색종이 접기
const q13 = () => {
  const paper = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.6"/>`;
  const crease = (x1, y1, x2, y2) => line(x1, y1, x2, y2, { stroke: UT.crease, width: 1.3, dash: "4 3" });
  const go = (x) => arrow(x, 45, x + 14, 45, { stroke: UT.ink, width: 3, head: 8 });
  let out = paper(4, 13, 64, 64) + crease(4, 45, 68, 45) + curvedArrow(38, 66, 46, 52, 37, 30);
  out += go(76) + paper(100, 27, 72, 36) + crease(136, 27, 136, 63) + curvedArrow(116, 48, 130, 32, 152, 42);
  out += go(180) + paper(202, 27, 36, 36) + crease(202, 27, 238, 63) + curvedArrow(210, 54, 214, 38, 230, 34);
  out += go(248) + `<polygon points="272,27 308,27 308,63" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.6" stroke-linejoin="round"/>`;
  return svg(316, 90, "색종이 접는 차례", out, 330);
};

// 15. 덧셈식 빈 칸
const q15 = () => {
  const L = [50, 84, 118], R = [216, 250, 284];
  let out = text(14, 16, "(1)", { size: 14, weight: 600 }) + digitRow(L, 34, ["7", "box", "6"]) + text(14, 72, "+", { size: 18 }) + digitRow(L, 72, ["box", "5", "box"]) + line(16, 94, 136, 94, { width: 1.5 }) + digitRow(L, 114, ["box", "1", "8"]);
  out += text(180, 16, "(2)", { size: 14, weight: 600 }) + digitRow(R, 34, ["1", "box", "1"]) + text(180, 72, "+", { size: 18 }) + digitRow(R, 72, ["", "box", "box"]) + line(182, 94, 302, 94, { width: 1.5 }) + digitRow(R, 114, ["2", "9", "box"]);
  return svg(310, 134, "덧셈식 두 개", out, 320);
};

// 16. 정사각형으로 만든 직사각형
const q16 = () => {
  const s = 30, x = 50, y = 4;
  const sq = (px, py, w, fill = "#fff") => `<rect x="${px}" y="${py}" width="${w}" height="${w}" fill="${fill}" stroke="${UT.ink}" stroke-width="1.5"/>`;
  let out = sq(x, y, 5 * s) + sq(x + 5 * s, y, 2 * s) + sq(x + 5 * s, y + 2 * s, 2 * s) + sq(x + 5 * s, y + 4 * s, s) + sq(x + 6 * s, y + 4 * s, s, UT.shade);
  out += dashed(`M${x} ${y + 5 * s} Q${x + 3.5 * s} ${y + 5 * s + 44} ${x + 7 * s} ${y + 5 * s}`) + label(x + 3.5 * s, y + 5 * s + 26, "35cm", 15);
  return svg(310, 190, "정사각형으로 만든 직사각형", out, 300);
};

// 17. 규칙 표
const q17 = () => {
  const w = 36, h = 32, top = [1, 2, 3, 4, 5, 6, 7, "…", 46], bottom = [5, "", "", "", 29, "", 41, "…", "㉠"];
  return svg(332, 70, "규칙 표", [top, bottom].map((row, r) => row.map((v, c) => cell(4 + c * w, 3 + r * h, w, h, v, { stroke: UT.ink, size: 15 })).join("")).join(""), 340);
};

// 18. 쌓인 모양
const q18 = () => {
  const kinds = ["circle", "square", "triangle", "heart", "diamond"];
  let out = "";
  for (let k = 1; k <= 16; k += 1) {
    const x = 14 + (k - 1) * 17.6, height = ((k - 1) % 4) + 1;
    for (let j = 0; j < height; j += 1) out += shape(kinds[(k - 1) % 5], x, 84 - j * 16, 13);
    out += text(x, 102, k, { size: 10, weight: 600 });
  }
  out += text(298, 76, "…", { size: 14 }) + box(312, 22, 26, 70, { fill: "#fff", stroke: UT.box, radius: 2 }) + text(325, 102, "45", { size: 10, weight: 600 });
  return svg(344, 110, "쌓은 모양 규칙", out, 344);
};

// 19. 도형 덧셈 → 빈 칸
const q19 = () => {
  let out = `<rect x="4" y="4" width="132" height="108" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  out += shape("square", 60, 30, 16) + shape("circle", 85, 30, 17) + shape("circle", 110, 30, 17);
  out += text(26, 58, "+", { size: 16 }) + shape("circle", 85, 58, 17) + shape("circle", 110, 58, 17);
  out += line(18, 74, 124, 74, { width: 1.4 }) + ["star", "diamond", "star", "diamond"].map((k, i) => shape(k, 35 + i * 25, 92, 17)).join("");
  out += blockArrow(144, 58, 176, 58, { fill: UT.greenSoft, stroke: UT.green });
  const b = (cx, cy) => box(cx - 11, cy - 11, 22, 22, { fill: "#fff", stroke: UT.box, radius: 2 });
  out += `<rect x="184" y="4" width="132" height="108" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  out += [238, 262, 286].map((x) => b(x, 30)).join("") + text(204, 58, "+", { size: 16 }) + [262, 286].map((x) => b(x, 58)).join("");
  out += line(196, 74, 302, 74, { width: 1.4 }) + [214, 238, 262, 286].map((x) => b(x, 92)).join("");
  return svg(320, 116, "도형 덧셈과 빈 칸", out, 330);
};

// 20. 연속하는 세 수의 덧셈
const q20 = () => {
  const block = (ox, rows, result) => {
    const cols = [ox + 26, ox + 56, ox + 86], stroke = UT.box;
    const ys = [20, 50, 80];
    let out = rows.map((row, i) => digitRow(cols, ys[i], ["", ...row], { s: 26, size: 16, stroke })).join("");
    out += text(ox + 8, 80, "+", { size: 16 }) + line(ox + 2, 100, ox + 102, 100, { width: 1.5 }) + digitRow(cols, 120, result, { s: 26, size: 16, stroke });
    return out;
  };
  // 예시는 숫자마다 테두리 칸
  const framed = (ox, rows, result) => {
    const cols = [ox + 26, ox + 56, ox + 86];
    let s = rows.map((row, i) => row.map((v, j) => v ? cell(cols[j + 1] - 13, [20, 50, 80][i] - 13, 26, 26, v, { stroke: UT.ink, size: 16 }) : "").join("")).join("");
    s += text(ox + 8, 80, "+", { size: 16 }) + line(ox + 2, 100, ox + 102, 100, { width: 1.5 }) + result.map((v, j) => cell(cols[j] - 13, 107, 26, 26, v, { stroke: UT.ink, size: 16 })).join("");
    return s;
  };
  let out = framed(0, [["7", "6"], ["7", "7"], ["7", "8"]], ["2", "3", "1"]);
  out += block(116, [["box", "box"], ["box", "box"], ["box", "box"]], ["box", "0", "7"]) + block(232, [["box", "box"], ["box", "box"], ["box", "box"]], ["box", "4", "0"]);
  return svg(340, 140, "연속하는 세 수의 덧셈", out, 340);
};

const Q = (number, prompt, figure, answer = null) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "세 사람의 대화를 보고 윤하가 가진 구슬의 개수를 구하시오.", () => noteBox([["석호 :", "우리 3명이 가진 구슬의 합은 25개야!"], ["하윤 :", "나는 구슬 7개를 가지고 있어."], ["윤하 :", "내가 석호에게 구슬 4개를 주면 나와 석호의 구슬 수가 같아져."]])),
  Q(2, "다음은 민아, 효원, 다현, 윤서의 키를 비교한 것입니다. 키가 두 번째로 작은 사람은 누구입니까?", () => conditionsBox(["효원이는 윤서보다 큽니다.", "민아는 다현이보다 큽니다.", "윤서는 다현이보다 작습니다.", "민아는 효원이보다 작습니다."])),
  Q(3, "다음 [그림 1]과 [그림 2]의 저울은 모두 평형을 이루고 있습니다. [그림 3]의 저울이 평형을 이루려면 오른쪽 빈 접시에 △를 몇 개 놓아야 합니까?", q3),
  Q(4, "다음 주어진 조건에 맞는 수를 구하시오.", () => conditionsBox(["두 자리 수입니다.", "각 자리 숫자의 합이 15입니다.", "일의 자리 숫자가 십의 자리 숫자보다 3 큽니다."])),
  Q(5, "일곱 개의 수 0, 1, 2, 3, 5, 7, 9 중에서 다음을 만족시키는 네 수 ㉠, ㉡, ㉢, ㉣을 찾으려고 합니다. 이때, 두 수 ㉠과 ㉣의 합은 얼마입니까?", () => noteBox([["(1)", "㉡은 ㉠보다 1 큽니다."], ["(2)", "㉢은 ㉡보다 2 큽니다."], ["(3)", "㉣은 ㉢보다 4 작습니다."]])),
  Q(6, "다음 표의 가로와 세로에 놓인 네 칸에 수 1, 2, 3, 4를 각각 한 번씩 모두 써넣으려고 합니다. ㉠과 ㉡에 알맞은 수를 구할 때, 두 자리 수 ㉠㉡은 무엇입니까?", q6),
  Q(7, "다음 오각형 모양의 그림에서 ○안의 수는 2에서 9까지의 자연수이고, □안의 수는 양쪽의 ○안에 있는 두 수의 곱입니다. ○안에 알맞은 수를 써 넣으시오.", q7),
  Q(8, "다음 그림에서 같은 도형은 같은 수를 나타내고 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. 다음 □안에 들어갈 수를 구하시오.", q8),
  Q(9, "㉠막대 4개와 ㉡막대 1개의 길이가 같습니다. ㉠막대와 ㉡막대의 길이의 합이 35cm일 때, ㉠막대와 ㉡막대의 길이를 각각 구하시오.", q9),
  Q(10, "다음 그림에서 ㉮, ㉯, ㉰, ㉱는 모두 정사각형입니다. 정사각형 ㉮의 한 변의 길이가 12cm라고 할 때, 정사각형 ㉯, ㉰의 한 변의 길이를 각각 구하시오.", q10),
  Q(11, "다음 식에서 같은 모양은 같은 숫자를 나타냅니다. □안에 들어갈 알맞은 숫자를 구하시오.", q11),
  Q(12, "다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. 10번째 그림에서 칠해지지 않은 삼각형은 칠해진 삼각형보다 몇 개 더 많습니까?", q12),
  Q(13, "다음과 같이 사각형 모양의 색종이를 접은 후 펼쳐서 접힌 선을 따라 자를 때, 잘린 조각은 모두 몇 개입니까?", q13),
  Q(14, "재석이와 광수는 모두 28장의 딱지를 나누어 가지고 있습니다. 재석이가 가진 딱지의 수가 광수의 3배일 때, 재석이는 몇 장의 딱지를 가지고 있습니까?", null),
  Q(15, "다음 덧셈식이 성립하도록 □안에 알맞은 수를 써 넣으시오.", q15),
  Q(16, "정사각형을 여러 개 붙여 직사각형을 만들었습니다. 이 직사각형의 가로의 길이가 35cm일 때, 색칠된 정사각형의 둘레를 구하시오.", q16),
  Q(17, "다음 표는 앞의 수에 같은 수를 더하는 규칙에 따라 만들어진 것입니다. ㉠에 알맞은 수를 구하시오.", q17),
  Q(18, "다음 모양을 일정한 규칙에 따라 나열하였습니다. 규칙을 찾아 45번째 모양을 그리시오.", q18),
  Q(19, "다음 식에서 같은 모양은 같은 숫자를 나타냅니다. 각 모양의 빈 칸에 알맞은 숫자를 써 넣으시오.", q19),
  Q(20, "다음은 연속하는 세 수의 덧셈을 나타낸 것입니다. 빈칸에 알맞은 숫자를 써넣으시오. (단, 백의 자리 숫자는 0이 아닙니다.)", q20),
];
