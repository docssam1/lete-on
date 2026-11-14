// 초1 1차 선발시험(g1-2022-03) 원문을 우리 시험지로 다시 짠 것 — 원장 2026-11-14 「선발시험을 우리 시험지 모양으로 다시 짜서 인쇄하게 하기」.
// 문제 글·수·배치는 원문(assets/selection-tests/g1-2022-03) 그대로, 그림은 우리 색표로 새로 그렸다. 정답은 두지 않는다.
// 원문은 한 쪽에 네 문제(왼쪽 1·2, 오른쪽 3·4) — perPage 4. 답 칸이 두 줄인 문항(9·15·19)은 그림 아래에 답 줄을 직접 그린다.
// 8번 가위는 단순한 그림으로 바꿨다. 20번 하늘색 상자는 우리 종이색 상자로 바꿨다.
import { UT, esc, text, svg, box, line, conditionsBox, shape, ringed, cell, equation, equationWidth, balance, caption, f1 } from "./kit.js?v=20261114a";

export const perPage = 4;

// ── 이 회차에서 쓰는 작은 도구
// 식 여러 줄 상자(둥근 네모)
function equationBox(rows, { s = 20, gap = 4, size = 17, fill = "#fdfbf5", stroke = UT.soft, padX = 18, rowGap = 36, label = "식" } = {}) {
  const width = Math.max(...rows.map((row) => equationWidth(row, { s, gap, size }))) + padX * 2;
  const height = rows.length * rowGap + 18;
  const body = `<rect x="2" y="2" width="${f1(width - 4)}" height="${height - 4}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`
    + rows.map((row, i) => equation(row, padX, 9 + rowGap / 2 + i * rowGap, { s, gap, size }).markup).join("");
  return svg(Math.ceil(width), height, label, body, Math.ceil(width) + 20);
}
// 색종이 접기 단계 그림에 쓰는 가위(단순한 모양)
function scissors(cx, cy, angle = 0) {
  return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${angle})"><line x1="-3" y1="-14" x2="3" y2="4" stroke="${UT.ink}" stroke-width="2.6" stroke-linecap="round"/><line x1="3" y1="-14" x2="-3" y2="4" stroke="${UT.ink}" stroke-width="2.6" stroke-linecap="round"/><circle cx="-5" cy="8" r="4" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/><circle cx="5" cy="8" r="4" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/></g>`;
}
// 휘어진 화살표(접는 방향)
function curveArrow(x1, y1, qx, qy, x2, y2, color = UT.crease) {
  const dx = x2 - qx, dy = y2 - qy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, px = -uy, py = ux, h = 7;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<path d="M${x1} ${y1} Q${qx} ${qy} ${f1(bx)} ${f1(by)}" fill="none" stroke="${color}" stroke-width="1.8"/><polygon points="${f1(x2)},${f1(y2)} ${f1(bx + px * 4)},${f1(by + py * 4)} ${f1(bx - px * 4)},${f1(by - py * 4)}" fill="${color}"/>`;
}
const paper = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${UT.paper}" stroke="${UT.paperLine}" stroke-width="1.6"/>`;
const dashed = (x1, y1, x2, y2, color = UT.crease) => line(x1, y1, x2, y2, { stroke: color, width: 1.3, dash: "4 3" });
// ▣(네모 안 검은 네모) — 원문 도형. 색표에 없는 모양이라 초록으로
function boxDot(cx, cy, s) {
  const h = s / 2;
  return `<rect x="${f1(cx - h)}" y="${f1(cy - h)}" width="${s}" height="${s}" rx="2" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.6"/><rect x="${f1(cx - h * 0.45)}" y="${f1(cy - h * 0.45)}" width="${f1(s * 0.45)}" height="${f1(s * 0.45)}" fill="${UT.green}"/>`;
}

// 7. 도형 식
const q7 = () => equationBox([["star", "+", "circle", "=", "8"], ["diamond", "−", "star", "=", "2"], ["diamond", "+", "diamond", "=", "6"], ["circle", "−", "square", "=", "3"]], { s: 22, size: 20, rowGap: 40, label: "도형 식 네 줄" });

// 8. 색종이 두 번 접어 자르기
const q8 = () => {
  let out = paper(6, 10, 80, 80) + dashed(6, 50, 86, 50) + curveArrow(52, 30, 66, 50, 52, 68);
  out += `<polygon points="98,46 108,46 108,41 116,50 108,59 108,54 98,54" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.2"/>`;
  out += paper(124, 30, 80, 40) + `<path d="M126 30 L206 28 L206 70" fill="none" stroke="${UT.paperLine}" stroke-width="1"/>` + dashed(164, 30, 164, 70) + curveArrow(182, 48, 166, 36, 148, 46);
  out += `<polygon points="216,46 226,46 226,41 234,50 226,59 226,54 216,54" fill="${UT.yellowSoft}" stroke="${UT.line}" stroke-width="1.2"/>`;
  out += paper(250, 30, 40, 40) + `<path d="M251 30 L291 28 L291 70" fill="none" stroke="${UT.paperLine}" stroke-width="1"/>` + line(250, 30, 290, 70, { stroke: UT.cut, width: 1.6 }) + line(290, 30, 250, 70, { stroke: UT.cut, width: 1.6 });
  out += scissors(242, 80, -135) + scissors(298, 80, 135);
  out += paper(124, 118, 80, 80) + dashed(164, 118, 164, 198) + dashed(124, 158, 204, 158);
  return svg(310, 204, "색종이를 두 번 접어 자르는 순서", out, 320);
};

// 9. 덧셈식(도형)
const q9 = () => {
  const s = 40;
  let out = shape("circle", 110, 30, s, null, { plain: true }) + `<rect x="${140}" y="10" width="${s}" height="${s}" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/>`;
  out += text(52, 84, "+", { size: 24 }) + shape("circle", 110, 84, s, null, { plain: true }) + `<rect x="${140}" y="64" width="${s}" height="${s}" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/>`;
  out += line(30, 116, 196, 116, { width: 1.4 }) + text(60, 144, "1", { size: 32, weight: 500 }) + text(110, 144, "1", { size: 32, weight: 500 }) + text(160, 144, "8", { size: 32, weight: 500 });
  return svg(220, 166, "도형 덧셈식", out, 220);
};

// 10. 도형 식 상자
const q10 = () => equationBox([["square", "×", "circle", "=", "square"], ["circle", "+", "circle", "+", "circle", "=", "triangle"], ["triangle", "×", "triangle", "=", "square"], ["circle", "+", "triangle", "+", "square", "=", "star"]], { s: 22, gap: 8, size: 19, rowGap: 40, stroke: UT.line, fill: "#fff", padX: 30, label: "도형 식 네 줄" });

// 11. 양팔 저울
const q11 = () => {
  const o = { span: 44, plate: 32, s: 20 };
  let out = balance(85, 46, [["square", "square"]], [["triangle"]], o) + caption(85, 100, "[그림 1]", 13);
  out += balance(255, 46, [["square", "triangle", "triangle"]], [["circle"]], o) + caption(255, 100, "[그림 2]", 13);
  out += balance(170, 150, [["triangle", "circle"]], [], o) + caption(170, 204, "[그림 3]", 13);
  return svg(340, 214, "양팔 저울 세 개", out, 340);
};

// 12. 모양 쌓기 규칙(1~10 그리고 31번째)
const q12 = () => {
  const stacks = [["circle", 1], ["square", 4], ["triangle", 3], ["circle", 2], ["square", 1], ["triangle", 4], ["circle", 3], ["square", 2], ["triangle", 1], ["circle", 4]];
  const s = 17, step = 20, base = 104;
  let out = stacks.map(([k, n], i) => Array.from({ length: n }, (_, r) => shape(k, 18 + i * 25, base - r * step, s)).join("") + caption(18 + i * 25, 128, i + 1, 13)).join("");
  out += text(270, base, "…", { size: 18 }) + `<rect x="290" y="26" width="38" height="88" rx="9" fill="#fff" stroke="${UT.ink}" stroke-width="1.6"/>` + caption(309, 128, 31, 13);
  return svg(334, 140, "모양 쌓기 규칙", out, 334);
};

// 13·삼각형 규칙 그림: n번째 = 한 변에 작은 삼각형 n개, 거꾸로 선 삼각형은 칠함
export function triFigure(n, cx, bottom, a = 30) {
  const h = a * Math.sqrt(3) / 2, top = bottom - n * h;
  let out = "";
  for (let r = 0; r < n; r += 1) {
    const yt = top + r * h, yb = yt + h;
    for (let k = 0; k <= r; k += 1) out += `<polygon points="${f1(cx - r * a / 2 + k * a)},${f1(yt)} ${f1(cx - (r + 1) * a / 2 + k * a)},${f1(yb)} ${f1(cx - (r + 1) * a / 2 + (k + 1) * a)},${f1(yb)}" fill="#fff" stroke="${UT.ink}" stroke-width="1.4" stroke-linejoin="round"/>`;
    for (let k = 0; k < r; k += 1) out += `<polygon points="${f1(cx - r * a / 2 + k * a)},${f1(yt)} ${f1(cx - r * a / 2 + (k + 1) * a)},${f1(yt)} ${f1(cx - (r + 1) * a / 2 + (k + 1) * a)},${f1(yb)}" fill="${UT.shade}" stroke="${UT.ink}" stroke-width="1.4" stroke-linejoin="round"/>`;
  }
  return out;
}
const q13 = () => {
  const labels = ["첫 번째", "두 번째", "세 번째"], xs = [34, 112, 222];
  return svg(320, 140, "삼각형 규칙", xs.map((x, i) => triFigure(i + 1, x, 104, 32) + caption(x, 126, labels[i], 13)).join("") + text(296, 70, "…", { size: 18 }), 320);
};

// 14. 도형 합 표(빈 칸)
const q14 = () => {
  const s = 44, ox = 4, oy = 4;
  const rows = [["circle", "circle", "diamond", "diamond", 20], ["square", "boxdot", "diamond", "diamond", 19], ["square", "circle", "circle", "circle", 14], ["circle", "boxdot", "square", "diamond", ""], [12, 18, 18, 22, null]];
  let out = "";
  rows.forEach((row, r) => row.forEach((v, c) => {
    if (v == null) return;
    const x = ox + c * s, y = oy + r * s;
    if (v === "boxdot") out += cell(x, y, s, s, "", { stroke: UT.ink }) + boxDot(x + s / 2, y + s / 2, 20);
    else if (typeof v === "string" && v) out += cell(x, y, s, s, "", { stroke: UT.ink }) + shape(v, x + s / 2, y + s / 2, 22);
    else out += cell(x, y, s, s, v, { stroke: UT.ink, size: 18 });
  }));
  return svg(230, 230, "도형 표", out, 240);
};

// 15. 두 막대
const q15 = () => {
  const A = UT.yellowSoft, B = UT.greenSoft;
  const ga = 280 / 3, gb = 280 / 5;
  let out = "";
  for (let i = 0; i < 3; i += 1) out += cell(20 + i * ga, 8, ga, 38, "㉠", { fill: A, stroke: UT.ink });
  for (let i = 0; i < 5; i += 1) out += cell(20 + i * gb, 46, gb, 38, "㉡", { fill: B, stroke: UT.ink });
  const x0 = 96;
  out += `<path d="M${x0} 136 Q${f1(x0 + (ga + gb) / 2)} 104 ${f1(x0 + ga + gb)} 136" fill="none" stroke="${UT.line}" stroke-width="1.2" stroke-dasharray="4 3"/>` + `<rect x="${f1(x0 + (ga + gb) / 2 - 26)}" y="110" width="52" height="16" fill="#fff"/>` + text(x0 + (ga + gb) / 2, 118, "32cm", { size: 14, weight: 600 });
  out += cell(x0, 136, ga, 38, "㉠", { fill: A, stroke: UT.ink }) + cell(x0 + ga, 136, gb, 38, "㉡", { fill: B, stroke: UT.ink });
  out += `<path d="M${x0} 174 Q${f1(x0 + ga / 2)} 196 ${f1(x0 + ga)} 174" fill="none" stroke="${UT.line}" stroke-width="1.1" stroke-dasharray="3 3"/>` + `<path d="M${f1(x0 + ga)} 174 Q${f1(x0 + ga + gb / 2)} 196 ${f1(x0 + ga + gb)} 174" fill="none" stroke="${UT.line}" stroke-width="1.1" stroke-dasharray="3 3"/>`;
  out += box(x0 + ga / 2 - 22, 190, 34, 30, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }) + text(x0 + ga / 2 + 26, 210, "cm", { size: 14, weight: 600 });
  out += box(x0 + ga + gb / 2 - 14, 190, 34, 30, { fill: "#fff", stroke: UT.ink, width: 1.4, radius: 1 }) + text(x0 + ga + gb / 2 + 34, 210, "cm", { size: 14, weight: 600 });
  return svg(320, 226, "두 막대의 길이 비교", out, 320);
};

// 16. 도형 식 상자
const q16 = () => equationBox([["square", "+", "star", "=", "circle", "+", "circle"], ["square", "+", "square", "+", "square", "+", "square", "=", "diamond", "+", "diamond", "+", "diamond", "+", "diamond", "+", "diamond"], ["square", "+", "square", "=", "circle", "+", "diamond"]], { s: 16, gap: 2, size: 14, rowGap: 34, stroke: UT.line, fill: "#fff", padX: 14, label: "도형 식 세 줄" });

// 17. 바둑돌 정육각형(한 변 19개, 가운데는 줄임)
const q17 = () => {
  const cx = 160, cy = 114, R = 104;
  const v = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i + Math.PI / 3 * 2; return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; });
  // 꼭짓점: 왼쪽 위 → 왼쪽 → 왼쪽 아래 → 오른쪽 아래 → 오른쪽 → 오른쪽 위
  let out = "";
  const at = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  for (let i = 0; i < 6; i += 1) {
    const p = v[i], q = v[(i + 1) % 6];
    for (const t of [0.42, 0.5, 0.58]) { const [x, y] = at(p, q, t); out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.8" fill="${UT.ink}"/>`; }
    for (const t of [0, 0.22, 0.78]) { const [x, y] = at(p, q, t); out += `<circle cx="${f1(x)}" cy="${f1(y)}" r="8.5" fill="#2b2b2b" stroke="#111" stroke-width="1"/><circle cx="${f1(x - 3)}" cy="${f1(y - 3)}" r="2.4" fill="#6b6b6b"/>`; }
  }
  return svg(320, 228, "바둑돌로 만든 정육각형", out, 300);
};

// 18. 규칙 표
export function seqTable(top, bottom, { w = 54, h = 36 } = {}) {
  let out = "";
  [top, bottom].forEach((row, r) => row.forEach((v, c) => {
    const x = 2 + c * w, y = 2 + r * h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${UT.ink}" stroke-width="1.8"/>`;
    out += v === "㉮" ? ringed(x + w / 2, y + h / 2, "가", { size: 12 }) : text(x + w / 2, y + h / 2 + 1, v, { size: 16, weight: 600 });
  }));
  return svg(w * top.length + 4, h * 2 + 4, "규칙 표", out, w * top.length + 4);
}
const q18 = () => seqTable([1, 4, 7, 10, "…", 79], [500, 493, 486, 479, "…", "㉮"]);

// 19. 귤 나누기(글만)
const q19 = null;

// 20. 1부터 ㉠까지
const q20 = () => {
  const out = `<rect x="2" y="2" width="276" height="56" rx="10" fill="${UT.yellowSoft}" stroke="${UT.cardLine}" stroke-width="1.4"/>` + text(110, 31, "1, 2, 3, 4, … ,", { size: 19, weight: 600 }) + cell(186, 12, 42, 36, "㉠", { stroke: UT.ink });
  return svg(280, 60, "1부터 ㉠까지", out, 280);
};

const Q = (number, prompt, figure, answer = { label: "답" }) => ({ number, prompt, figure, answer });
export const questions = [
  Q(1, "승객 14명을 태우고 출발한 버스가 있습니다. 첫 번째 정류장에서 6명이 내리고 3명이 탔고, 두 번째 정류장에서는 4명이 내리고 8명이 탔다면, 지금 버스에 타고 있는 승객은 몇 명입니까?", null, { label: "답", unit: "명" }),
  Q(2, "다음은 윤아, 재아, 하연, 라희의 키를 비교한 것입니다. 키가 두번째로 작은 사람은 누구인지 구하시오.", () => conditionsBox(["재아는 라희보다 큽니다.", "윤아는 하연이보다 큽니다.", "라희는 하연이보다 작습니다.", "윤아는 재아보다 작습니다."])),
  Q(3, "장희는 구슬 20개를, 예린이는 구슬 8개를 가지고 있습니다. 두 사람의 구슬 수가 같아지려면 장희가 예린이에게 구슬 몇 개를 주어야 합니까?", null, { label: "답", unit: "개" }),
  Q(4, "다음 주어진 조건에 맞는 수를 구하시오.", () => conditionsBox(["두 자리 수입니다.", "각 자리 숫자의 합이 9입니다.", "십의 자리 숫자가 일의 자리 숫자보다 5 작습니다."])),
  Q(5, "수빈이네 농장에 닭과 돼지가 45마리 있습니다. 닭이 돼지보다 7마리 더 많다면, 닭은 모두 몇 마리인지 구하시오.", null, { label: "답", unit: "마리" }),
  Q(6, "6명이 한 줄로 서 있습니다. 앞에서부터 다섯번째에 은재가 서 있고, 뒤에서부터 네번째에 찬형이가 서 있습니다. 은재와 찬형이 사이에는 몇 명이 서 있는지 구하시오.", null, { label: "답", unit: "명" }),
  Q(7, "다음 식에서 각 도형은 1에서 7까지의 수 중에서 하나씩을 나타내고 있습니다. □가 나타내는 수를 구하시오.", q7),
  Q(8, "정사각형 모양의 색종이를 다음과 같이 두 번 접어서 선을 따라 잘랐을 때, 모두 몇 조각이 되는지 구하시오.", q8, { label: "답", unit: "조각" }),
  Q(9, "다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양에 알맞은 숫자를 구하시오.", q9, [{ label: "○ =" }, { label: "□ =" }]),
  Q(10, "다음 그림에서 다른 모양은 서로 다른 수를 나타냅니다. ☆이 나타내는 수를 구하시오.", q10),
  Q(11, "양팔 저울이 기울어지지 않고 평형일 때는 양쪽의 무게가 같습니다. [그림 3]이 평형이 되려면, 오른쪽 접시에 □를 몇 개 놓아야 하는지 구하시오.", q11, { label: "답", unit: "개" }),
  Q(12, "다음은 모양을 일정한 규칙에 따라 나열한 것 입니다. 31번째에 올 모양을 구하시오.", q12),
  Q(13, "다음 그림과 같이 일정한 규칙으로 삼각형을 그렸습니다. 6번째 그림에서 칠해지지 않은 삼각형은 칠해진 삼각형보다 몇 개 더 많습니까?", q13, { label: "답", unit: "개" }),
  Q(14, "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. 빈 칸에 알맞은 수를 써 넣으시오.", q14),
  Q(15, "다음 그림은 두 막대의 길이를 비교한 것입니다. 두 막대의 길이를 각각 구하시오.", q15, [{ label: "㉠막대 =" }, { label: "㉡막대 =" }]),
  Q(16, "다음 각 도형은 1에서 9까지의 서로 다른 네 수를 나타냅니다. ☆이 나타내는 수를 구하시오.", q16),
  Q(17, "다음 그림과 같이 한 변에 바둑돌을 19개씩 늘어놓아 정육각형을 만들었습니다. 이 바둑돌을 정사각형 모양으로 늘어놓는다면, 정사각형의 한 변에 몇 개의 바둑돌을 놓아야 하는지 구하시오.", q17, { label: "답", unit: "개" }),
  Q(18, "다음 표는 일정한 규칙에 따라 만들어진 것입니다. ㉮에 알맞은 수를 구하시오.", q18),
  Q(19, "68명의 어린이와 어른이 68개의 귤을 나누어 먹으려고 합니다. 어린이는 3명이 1개의 귤을 나누어 먹고, 어른은 1명이 3개의 귤을 먹습니다. 어린이와 어른은 각각 몇 명인지 구하시오.", q19, [{ label: "어린이", unit: "명" }, { label: "어른", unit: "명" }]),
  Q(20, "1부터 ㉠까지의 자연수 중에서 짝수 전체의 합과 홀수 전체의 합의 차가 17입니다. ㉠이 될 수 있는 수를 모두 구하시오.", q20),
];
