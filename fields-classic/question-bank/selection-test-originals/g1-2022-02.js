// 초1 4차 선발시험(g1-2022-02) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/g1-2022-02) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 10번은 원문 문제지에도 「주어진 수」 목록이 빠져 있다(G1-2022-02-SOURCE-PRE-AUDIT.md) — 원문 그대로 두고 지어 넣지 않았다.
import { UT, text, svg, line, box, conditionsBox, cardsRow, shape, ringed, cell, balance, stone, caption, f1 } from "./kit.js?v=20261114a";

export const perPage = 4;

// 1. 마방진
const q1 = () => {
  const s = 60, rows = [["", "13", "20"], ["", "17", ""], ["14", "", ""]];
  return svg(188, 188, "3×3 표", rows.map((row, r) => row.map((v, c) => cell(4 + c * s, 4 + r * s, s, s, v, { stroke: UT.ink, size: 28 })).join("")).join(""), 200);
};

// 2. 두 수의 곱
const q2 = () => {
  const s = 44;
  let out = line(76, 54, 32, 90) + line(76, 54, 120, 90) + line(120, 134, 164, 170) + line(208, 134, 164, 170);
  out += cell(54, 10, s, s, "32", { stroke: UT.ink, size: 20 });
  out += cell(10, 90, s, s, "㉠", { stroke: UT.ink }) + text(76, 113, "×", { size: 20 }) + cell(98, 90, s, s, "", { stroke: UT.ink }) + text(164, 113, "×", { size: 20 }) + cell(186, 90, s, s, "7", { stroke: UT.ink, size: 20 });
  out += cell(142, 170, s, s, "56", { stroke: UT.ink, size: 20 });
  return svg(240, 220, "곱 나무", out, 230);
};

// 3. 도형 매트릭스
const q3 = () => {
  const s = 38, ox = 4, oy = 4, tint = UT.yellowSoft;
  const rows = [["circle", "circle", "triangle", "diamond", "㉠"], ["diamond", "circle", "square", "square", "41"], ["circle", "circle", "circle", "square", "34"], ["diamond", "circle", "circle", "square", "39"], ["42", "32", "33", "43", null]];
  const out = rows.map((row, r) => row.map((v, c) => {
    if (v == null) return "";
    const x = ox + c * s, y = oy + r * s;
    if (r < 4 && c < 4) return cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 26);
    return cell(x, y, s, s, v, { fill: tint, stroke: UT.ink, size: 16 });
  }).join("")).join("");
  return svg(198, 198, "도형 매트릭스", out, 210);
};

// 4. 계단 오르기
const q4 = () => {
  const x0 = 40, w = 34, rise = 24, yb = 190;
  const pts = [[x0, yb]];
  for (let k = 1; k <= 7; k += 1) { const x = x0 + (k - 1) * w, y = yb - k * rise; pts.push([x, y], [x + w, y]); }
  let out = `<polyline points="${pts.map(([x, y]) => `${x},${y}`).join(" ")}" fill="none" stroke="${UT.ink}" stroke-width="1.6"/>`;
  for (let k = 1; k <= 7; k += 1) out += text(x0 + (k - 1) * w + 15, yb - k * rise + 13, k, { size: 14, weight: 600 });
  out += text(x0 + 4 * w - 5, yb - 5 * rise + 13, "시작", { size: 12, weight: 700, anchor: "end" });
  const stairs = svg(290, 196, "계단", out, 250);
  return `<div style="display:grid;gap:8px;width:100%;justify-items:center">${conditionsBox(["이기면 한 칸 올라갑니다.", "비기면 제 자리에 있습니다.", "지면 한 칸 내려갑니다."])}${stairs}</div>`;
};

// 5. 4×4 숫자 채우기(굵은 선 구역)
const q5 = () => {
  const s = 46, o = 4, rows = [["", "4", "", "1"], ["1", "3", "", "2"], ["", "", "1", ""], ["3", "", "", "4"]];
  let out = rows.map((row, r) => row.map((v, c) => cell(o + c * s, o + r * s, s, s, v, { stroke: UT.ink, size: 22, width: 1.2 })).join("")).join("");
  out += line(o, o + s, o + 4 * s, o + s, { width: 3.4 }) + line(o, o + 3 * s, o + 4 * s, o + 3 * s, { width: 3.4 }) + line(o + 2 * s, o + s, o + 2 * s, o + 3 * s, { width: 3.4 });
  out += `<rect x="${o}" y="${o}" width="${4 * s}" height="${4 * s}" fill="none" stroke="${UT.ink}" stroke-width="1.6"/>`;
  return svg(192, 192, "4×4 숫자 표", out, 200);
};

// 6. ○□ + ○□ = 118
const q6 = () => {
  const X = [40, 90, 140];
  let out = shape("circle", X[1], 30, 40) + shape("square", X[2], 30, 38);
  out += text(58, 84, "+", { size: 22 }) + shape("circle", X[1], 84, 40) + shape("square", X[2], 84, 38);
  out += line(20, 112, 166, 112, { width: 1.6 }) + X.map((x, i) => text(x, 142, ["1", "1", "8"][i], { size: 34, weight: 500 })).join("");
  return svg(180, 166, "도형 덧셈", out, 190);
};

// 7. 쌓은 모양 규칙
const q7 = () => {
  const kinds = ["circle", "square", "triangle"], heights = [1, 4, 3, 2];
  let out = "";
  for (let k = 1; k <= 10; k += 1) {
    const x = 16 + (k - 1) * 29;
    for (let j = 0; j < heights[(k - 1) % 4]; j += 1) out += shape(kinds[(k - 1) % 3], x, 100 - j * 25, 18);
    out += text(x, 124, k, { size: 12, weight: 600 });
  }
  return svg(330, 132, "쌓은 모양 규칙", out + text(312, 76, "…", { size: 16 }), 330);
};

// 10. 색칠된 칸 곱
const q10 = () => {
  const s = 48, o = 4, on = [[0, 0], [0, 1], [1, 2], [1, 3], [2, 1], [2, 3], [3, 0], [3, 2]];
  let out = "";
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) out += cell(o + c * s, o + r * s, s, s, "", { fill: on.some(([a, b]) => a === r && b === c) ? UT.yellowSoft : "#fff", stroke: UT.ink });
  out += [15, 8, 63, 48].map((v, r) => text(o + 4 * s + 24, o + r * s + s / 2 + 1, v, { size: 18, weight: 600 })).join("");
  out += [30, 21, 16, 36].map((v, c) => text(o + c * s + s / 2, o + 4 * s + 22, v, { size: 18, weight: 600 })).join("");
  return svg(248, 226, "색칠된 칸 표", out, 240);
};

// 14. 저울 셋
const q14 = () => {
  const o = { span: 44, plate: 31, s: 18 };
  let out = balance(80, 50, [["circle"]], [["square", "square", "diamond"]], o) + balance(260, 50, [["star", "star"]], [["diamond", "diamond", "diamond"]], o);
  out += balance(170, 140, [["square"]], [["star", "diamond"]], o);
  return svg(340, 184, "양팔 저울 세 개", out, 330);
};

// 15. 수 카드 + 조건
const q15 = () => `<div style="display:grid;gap:10px;width:100%;justify-items:center">${svg(320, 42, "수 카드 0부터 5", cardsRow([0, 1, 2, 3, 4, 5], 320, 4, 34), 280)}${conditionsBox(["㉠은 짝수입니다.", "㉠은 ㉡보다 1 큽니다.", "㉡은 ㉢보다 2 큽니다."])}</div>`;

// 17. 정육각형 바둑돌
const q17 = () => {
  const cx = 165, cy = 116, R = 100;
  const V = [0, 60, 120, 180, 240, 300].map((a) => [cx + R * Math.cos(a * Math.PI / 180), cy - R * Math.sin(a * Math.PI / 180)]);
  let out = "";
  V.forEach((A, i) => {
    const B = V[(i + 1) % 6];
    const at = (t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
    out += [0.4, 0.5, 0.6].map((t) => { const [x, y] = at(t); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.8" fill="${UT.ink}"/>`; }).join("");
    out += [0.2, 0.8].map((t) => { const [x, y] = at(t); return stone(x, y, true, 7.5); }).join("");
  });
  out += V.map(([x, y]) => stone(x, y, true, 7.5)).join("");
  return svg(330, 232, "정육각형 모양 바둑돌", out, 300);
};

// 18. 규칙 표
const q18 = () => {
  const w = 52, h = 34, top = ["1", "4", "7", "10", "…", "79"], bottom = ["500", "493", "486", "479", "…", ""];
  let out = [top, bottom].map((row, r) => row.map((v, c) => cell(4 + c * w, 4 + r * h, w, h, v, { stroke: UT.ink, size: 16 })).join("")).join("");
  out += ringed(4 + 5 * w + w / 2, 4 + h + h / 2, "가");
  return svg(320, 78, "규칙 표", out, 330);
};

// 20. 1부터 ㉠까지
const q20 = () => {
  let out = `<rect x="4" y="4" width="232" height="52" rx="10" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
  out += text(30, 31, "1, 2, 3, 4, …,", { size: 16, weight: 600, anchor: "start" }) + cell(150, 15, 36, 32, "㉠", { stroke: UT.ink });
  return svg(240, 60, "1부터 ㉠까지의 자연수", out, 240);
};

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "가로, 세로, 대각선의 합이 모두 같아 지도록 빈 칸을 모두 채우시오.", q1, null),
  Q(2, "두 수의 곱에 맞게 ㉠에 알맞은 수를 써 넣으시오.", q2, { label: "㉠ =" }),
  Q(3, "다음 매트릭스에서 같은 모양은 같은 수를, 다른 모양은 다른 수를 나타냅니다. 같은 줄에 있는 수를 더해 ㉠에 알맞은 수를 구하시오.", q3, { label: "㉠ =" }),
  Q(4, "하준이와 도연이가 시작칸에서 가위바위보를 하여 다음 규칙대로 계단 오르기를 합니다. 하준이가 3번 이기고 2번 졌다면 도연이는 몇 번 계단에 있을지 구하시오.", q4, { label: "답", unit: "번" }),
  Q(5, "가로, 세로, 굵은 선에 1, 2, 3, 4가 한 번씩만 들어가도록 빈칸을 모두 채우시오.", q5, null),
  Q(6, "다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양에 알맞은 숫자를 구하시오.", q6, [{ label: "○ =" }, { label: "□ =" }]),
  Q(7, "다음은 모양을 일정한 규칙에 따라 나열한 것 입니다. 31번째에 올 모양을 구하시오.", q7),
  Q(8, "다음 주어진 조건에 맞는 수를 구하시오.", () => conditionsBox(["십의 자리 수가 일의 자리 수보다 큰 두 자리 홀수입니다.", "십의 자리 숫자와 일의 자리 숫자의 합은 4입니다."])),
  Q(9, "수빈이네 농장에 닭과 돼지가 45마리 있습니다. 닭이 돼지보다 7마리 더 많다면 닭은 모두 몇 마리인지 구하시오.", null, { label: "답", unit: "마리" }),
  Q(10, "다음 색칠된 빈 칸에 주어진 수를 한 번씩 넣어 같은 줄에 있는 색칠된 두 수의 곱이 오른쪽과 아래의 수가 되도록 만드시오.", q10, null),
  Q(11, "다음은 윤아, 재아, 하연, 라희의 키를 비교한 것입니다. 키가 두번째로 작은 사람은 누구인지 구하시오.", () => conditionsBox(["재아는 라희보다 큽니다.", "윤아는 하연이보다 큽니다.", "라희는 하연이보다 작습니다.", "윤아는 재아보다 작습니다."])),
  Q(12, "6명이 한 줄로 서 있습니다. 앞에서부터 다섯번째에 은재가 서 있고, 뒤에서부터 네번째에 찬형이가 서 있습니다. 은재와 찬형이 사이에는 몇 명이 서 있는지 구하시오.", null, { label: "답", unit: "명" }),
  Q(13, "서현이가 숫자 카드 3, 4, 6으로 세 자리 수 436을 만들었습니다. 지호는 1, 5, 8의 숫자 카드로 서현이가 만든 수보다 큰 세 자리 수를 만들려고 합니다. 지호가 만들 수 있는 세 자리 수는 모두 몇 개인지 구하시오.", null, { label: "답", unit: "개" }),
  Q(14, "3개의 저울은 모두 수평을 이루고 있습니다. 저울을 보고 ○1개는 ◇ 몇 개의 무게와 같은지 구하시오.", q14, { label: "답", unit: "개" }),
  Q(15, "주어진 수 카드 중 아래 조건에 맞는 세 수 ㉠, ㉡, ㉢을 찾아 ㉠+㉡+㉢을 구하시오.", q15),
  Q(16, "재현이네 반 학생들은 모두 형제가 있습니다. 남자 형제가 있는 학생은 10명, 여자 형제가 있는 학생은 9명입니다. 여자 형제와 남자 형제가 모두 있는 학생이 4명일 때 재현이네 반 학생은 모두 몇 명인지 구하시오.", null, { label: "답", unit: "명" }),
  Q(17, "다음 그림과 같이 한 변에 바둑돌을 19개씩 늘어놓아 정육각형을 만들었습니다. 이 바둑돌을 정사각형 모양으로 늘어놓는다면 정사각형의 한 변에 몇 개의 바둑돌을 놓아야 하는지 구하시오.", q17, { label: "답", unit: "개" }),
  Q(18, "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉮에 알맞은 수를 구하시오.", q18, { label: "㉮ =" }),
  Q(19, "68명의 어린이와 어른이 68개의 귤을 나누어 먹으려고 합니다. 어린이는 3명이 1개의 귤을 나누어 먹고, 어른은 1명이 3개의 귤을 먹습니다. 어린이와 어른은 각각 몇 명인지 구하시오.", null, [{ label: "어른", unit: "명" }, { label: "어린이", unit: "명" }]),
  Q(20, "1부터 ㉠까지의 자연수 중에서 짝수 전체의 합과 홀수 전체의 합의 차가 17입니다. ㉠이 될 수 있는 수를 모두 구하시오.", q20, { label: "㉠ =" }),
];
void caption;
