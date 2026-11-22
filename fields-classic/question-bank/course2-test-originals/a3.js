// 2과정 A3 「규칙성과 수열」 권별 테스트 — 드라이브 원문(2A3 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 문항을 본책 네 단원(카프리카수와 등차수열 · 삼각수와 묶음수열 · 수와 숫자의 개수 · 최단거리와 경우의 수)의 활동·문제와 견주어
// 본책 단원과 맞는 것을 확인하고 옮겼다(파일 이름이 아니라 내용으로 확인).
// 단원: 1~6번·25번 카프리카수와 등차수열(순환소수·일의 자리·등차수열과 분수 · 섞인 두 수열) · 7~12번 삼각수와 묶음수열(홀수의 합·등차수열의 합·묶음수열)
//       · 13~18번 수와 숫자의 개수 · 19~24번 최단거리와 경우의 수(숫자 카드·크기순 배열·최단거리).
// 글·수·배치는 원문 그대로. 분수 수열·순환소수·(1)(2) 물음은 글(HTML)로, 분수는 math-markup.js(mathText)로 위아래로 쌓는다(빗금 그대로 두지 않는다).
// 길 그림·화살표 수열은 우리 색표로 다시 그렸다. 원문 22번 그림의 A·B 옆 진한 첫 칸 표시는 길과 상관없는 꾸밈이라 빼고, 점과 글자만 남겼다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, text, svg, line, arrow, mark } from "../selection-test-originals/kit.js?v=20261114a";
import { mathText } from "../math-markup.js?v=20261122i";

export const perPage = 4;
export const meta = { course: "2과정", book: "A3", title: "규칙성과 수열" };

// ── 글로 쓰는 그림 칸(분수 수열 · 상자 · (1)(2) 물음)
const SERIF = "font-family:'FC Serif',serif;color:#191511;word-break:keep-all";
const size = (min, cq, max) => `font-size:clamp(${min}px,${cq}cqw,${max}px)`;
const math = (value) => mathText(esc(value));
// 가운데 한 줄(분수 수열 등)
const seqLine = (value, { big = true } = {}) =>
  `<p style="margin:0;text-align:center;${SERIF};${big ? size(13, 5.2, 19) : size(12, 4.4, 16)};line-height:1.7;white-space:nowrap">${math(value)}</p>`;
// 종이색 상자(원문의 색 상자 자리)
const panel = (rows, { align = "center", width = 420 } = {}) =>
  `<div style="width:min(100%,${width}px);margin:0 auto;padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;text-align:${align};${SERIF};${size(12, 4.4, 16)};line-height:1.7">${rows.map((row) => `<div style="white-space:nowrap">${math(row)}</div>`).join("")}</div>`;
// 위 그림 + 아래 (1)(2) 물음 줄(답 칸은 시험지 아래에 번호별로 붙는다)
function withSubs(top, subs) {
  const rows = subs.map((sub) => `<p style="margin:0;padding-left:1.9em;text-indent:-1.9em;${SERIF};${size(11, 4.3, 15.5)};line-height:1.6">${typeof sub === "string" ? math(sub) : sub.html}</p>`).join("");
  return `<div style="display:flex;flex-direction:column;gap:14px;width:100%;height:100%;min-height:0;padding-top:4px">${top || ""}<div style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:12px">${rows}</div></div>`;
}
const topOnly = (top) => `<div style="width:100%;padding-top:10px">${top}</div>`;
// 빈 네모 칸(써넣는 자리)
const blankBox = `<span style="display:inline-block;width:3.2em;height:1.7em;margin:0 .25em;vertical-align:middle;border:1.6px solid ${UT.box};border-radius:2px;background:#fff"></span>`;

// ── 1~6번
const q1 = () => withSubs(panel(["1/7 = 0.142857142857142857142 …"]), [
  "(1) 소수 첫째 자리부터 110번째에 나오는 숫자를 구하시오.",
  "(2) 소수 첫째 자리부터 180번째 자리 숫자까지의 합을 구하시오.",
]);
const q3 = () => topOnly(seqLine("5/6, 8/10, 11/14, 14/18, …"));
const q4 = () => topOnly(seqLine("1/4, 2/5, 7/16, 5/11, 13/28, 8/17, 19/40, …"));
// 5. 위 수열 → 아래 수열(화살표로 짝)
function q5() {
  const xs = [36, 84, 132, 180, 236, 286];
  const top = ["1", "4", "7", "10", "…", "61"], bottom = ["1", "7", "13", "19", "…", "㉠"];
  const yTop = 22, yBottom = 112;
  let body = "";
  xs.forEach((x, i) => {
    body += text(x, yTop, top[i], { size: 17, weight: 500 });
    if (i < xs.length - 1) body += text(x + (top[i] === "…" ? 13 : 3 + top[i].length * 5), yTop + 2, ",", { size: 17, weight: 500 });
    if (bottom[i] === "㉠") body += mark(x, yBottom, "㉠", { r: 10, size: 12 });
    else body += text(x, yBottom, bottom[i], { size: 17, weight: 500 });
    if (bottom[i] === "…") body += text(x + 13, yBottom + 2, ",", { size: 17, weight: 500 });
    if (top[i] !== "…") body += arrow(x, yTop + 15, x, yBottom - 16, { stroke: UT.ink, width: 1.5, head: 8 });
  });
  return svg(320, 134, "위 수열의 각 수와 짝지어진 아래 수열", body, 320);
}
const q6 = () => topOnly(seqLine("1/41, 5/43, 9/45, 13/47, 17/49, …"));

// ── 7~12번
const q7 = () => withSubs("", [
  { html: `(1) 1 + 3 + 5 + 7 + … + 33 =${blankBox}` },
  { html: `(2) 1 + 3 + 5 + 7 + … + 59 =${blankBox}` },
  { html: `(3) 1 + 3 + 5 + 7 + … +${blankBox}= 324` },
  { html: `(4) 1 + 3 + 5 + 7 + … +${blankBox}= 900` },
]);
const q8 = () => withSubs(panel(["(1), (2, 3, 4), (5, 6, 7, 8, 9),", "(10, 11, 12, 13, 14, 15, 16), …"]), [
  "(1) 11번째 묶음의 7번째 수를 구하시오.",
  "(2) 200은 몇 번째 묶음의 몇 번째 수인지 구하시오.",
]);
const q9 = () => withSubs("", [
  "(1) 1 + 2 + 3 + 4 + … + 40",
  "(2) 4 + 8 + 12 + 16 + … + 160",
  "(3) 1 + 4 + 7 + 10 + … + 118",
  "(4) 3 + 8 + 13 + 18 + … + 98",
]);
const q10 = () => topOnly(seqLine("1/6, 2/6, 3/6, 4/6, 5/6, 6/6, 7/6, …, 57/6, 58/6, 59/6", { big: false }));
const q11 = () => withSubs(seqLine("1/1, 1/2, 2/2, 1/3, 2/3, 3/3, 1/4, 2/4, 3/4, 4/4, …", { big: false }), [
  "(1) 7/9은 몇 번째에 나오는 분수입니까?",
  "(2) 80번째에 나오는 분수를 구하시오.",
]);
const q12 = () => withSubs(seqLine("1/2, 1/3, 2/3, 1/4, 2/4, 3/4, 1/5, 2/5, 3/5, 4/5, …", { big: false }), [
  "(1) 4/13는 몇 번째에 나오는 분수입니까?",
  "(2) 95번째에 나오는 분수를 구하시오.",
]);

// ── 17번
const q17 = () => topOnly(panel(["㉮ : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, …", "㉯ : 1234567891011…"], { align: "left", width: 360 }));

// ── 21번
const q21 = () => withSubs("", [
  "(1) 다섯 자리 수를 작은 수부터 나열할 때, 24153은 몇 번째 수인지 구하시오.",
  "(2) 작은 수부터 나열할 때, 57번째 수를 구하시오.",
]);

// ── 22~24번 길 그림(길 = 회갈색 선, 지름길 = 검은 대각선, A·B = 점)
const ROAD = { stroke: UT.line, width: 1.8 };
const pin = (x, y) => `<circle cx="${x}" cy="${y}" r="4.2" fill="${UT.ink}"/>`;
const label = (x, y, value, sz = 15) => text(x, y, value, { size: sz, weight: 600 });
// 칸 c, 왼쪽 위 (ox, oy), 열 cols · 행 rows의 바둑판 길. diagonals: [열, 아래에서 행] 칸의 왼쪽 아래 → 오른쪽 위
function grid(ox, oy, c, cols, rows, diagonals = []) {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(ox + i * c, oy, ox + i * c, oy + rows * c, ROAD);
  for (let j = 0; j <= rows; j += 1) out += line(ox, oy + j * c, ox + cols * c, oy + j * c, ROAD);
  for (const [i, j] of diagonals) out += line(ox + i * c, oy + (rows - j) * c, ox + (i + 1) * c, oy + (rows - j - 1) * c, { stroke: UT.ink, width: 2.2 });
  return out;
}
function q22() {
  // (1) 가로 6칸 · 세로 4칸, 대각선 하나(왼쪽에서 셋째 칸, 아래에서 둘째 줄) · A 왼쪽 아래, B 오른쪽 위
  const c1 = 26, x1 = 56, y1 = 24;
  const one = label(16, 12, "(1)", 14) + grid(x1, y1, c1, 6, 4, [[2, 1]])
    + pin(x1, y1 + 4 * c1) + label(x1 - 14, y1 + 4 * c1 + 2, "A") + pin(x1 + 6 * c1, y1) + label(x1 + 6 * c1 + 12, y1 - 10, "B");
  // (2) 가로 5칸 · 세로 5칸, 위에서 셋째 줄(둘째·셋째 가로 길 사이)에 강 — 왼쪽에서 셋째 세로 길에만 다리 · A 왼쪽 위, B 오른쪽 아래
  const c2 = 26, x2 = 69, y2 = 172, bridge = x2 + 2 * c2, bandTop = y2 + 2 * c2 + 5, bandH = c2 - 10;
  const band = `<rect x="${x2 - 10}" y="${bandTop}" width="${bridge - 8 - (x2 - 10)}" height="${bandH}" fill="${UT.blueSoft}"/>`
    + `<rect x="${bridge + 8}" y="${bandTop}" width="${x2 + 5 * c2 + 10 - (bridge + 8)}" height="${bandH}" fill="${UT.blueSoft}"/>`;
  const rail = (dx) => `<path d="M${bridge + dx * 10} ${bandTop - 4} Q${bridge + dx * 2} ${bandTop + bandH / 2} ${bridge + dx * 10} ${bandTop + bandH + 4}" fill="none" stroke="${UT.line}" stroke-width="1.5"/>`;
  const two = label(16, 160, "(2)", 14) + grid(x2, y2, c2, 5, 5) + band + line(bridge, bandTop, bridge, bandTop + bandH, ROAD) + rail(-1) + rail(1)
    + text(x2 + 12, bandTop + bandH / 2 + 0.5, "강", { size: 12, weight: 700, fill: UT.blue })
    + text(bridge + 30, bandTop + bandH / 2 + 0.5, "다리", { size: 12, weight: 700, fill: UT.blue })
    + pin(x2, y2) + label(x2 - 14, y2 - 6, "A") + pin(x2 + 5 * c2, y2 + 5 * c2) + label(x2 + 5 * c2 + 14, y2 + 5 * c2 + 1, "B");
  return svg(260, 312, "(1) 대각선 길이 하나 있는 바둑판 길 (2) 가운데에 강이 흐르고 다리가 하나 있는 바둑판 길", one + two, 260);
}
function q23() {
  // 가로 6칸 · 세로 4칸, 대각선 다섯(칸 [열, 아래에서 행]): 원문 그림 그대로
  const c = 38, ox = 28, oy = 26;
  return svg(290, 200, "대각선 길이 다섯 개 있는 바둑판 길",
    grid(ox, oy, c, 6, 4, [[3, 0], [2, 1], [5, 1], [1, 2], [3, 3]])
    + pin(ox, oy + 4 * c) + label(ox - 14, oy + 4 * c + 2, "A") + pin(ox + 6 * c, oy) + label(ox + 6 * c + 12, oy - 12, "B"), 290);
}
function q24() {
  // 가로 5칸 · 세로 3칸 틀 안의 길(원문 모양 그대로). 가로 길·세로 길은 칸 눈금으로 적는다(아래가 0).
  const c = 46, ox = 28, oy = 26, X = (i) => ox + i * c, Y = (j) => oy + (3 - j) * c;
  const H = [[0, 0, 5], [1, 0, 4], [2, 1, 3], [2, 4, 5], [3, 0, 5]];   // [높이, 시작, 끝]
  const V = [[0, 0, 3], [1, 0, 3], [2, 0, 1], [3, 1, 3], [4, 0, 3], [5, 0, 3]]; // [가로 자리, 시작, 끝]
  const roads = H.map(([j, a, b]) => line(X(a), Y(j), X(b), Y(j), ROAD)).join("") + V.map(([i, a, b]) => line(X(i), Y(a), X(i), Y(b), ROAD)).join("");
  return svg(290, 186, "가로 다섯 칸, 세로 세 칸 틀 안의 여러 모양 길",
    roads + pin(X(0), Y(0)) + label(X(0) - 14, Y(0) + 2, "A") + pin(X(5), Y(3)) + label(X(5) + 12, Y(3) - 12, "B"), 290);
}

// ── 25번
const q25 = () => topOnly(seqLine("1, 3, 6, 11, 11, 19, 16, 27, 21, 35, …", { big: false }));

const Q = (number, prompt, figure = null, answer = { label: "답" }, extra = {}) => ({ number, prompt, figure, answer, ...extra });
const two = [{ label: "(1)" }, { label: "(2)" }];
export const questions = [
  Q(1, "1/7을 계산기로 계산하면 다음과 같습니다. 물음에 답하시오.", q1, two, { mathPrompt: true }),
  Q(2, "3×3×3과 같이 3을 3번 곱했을 때, 곱의 일의 자리 숫자는 7입니다. 3을 77번 곱했을 때, 곱의 일의 자리 숫자는 얼마입니까?"),
  Q(3, "다음과 같이 분수를 일정한 규칙으로 늘어놓았습니다. 43번째 분수를 구하시오.", q3),
  Q(4, "일정한 규칙으로 분수를 늘어놓았습니다. 28번째 분수를 구하시오.", q4),
  Q(5, "다음 수열에서 ㉠에 들어갈 알맞은 수를 구하시오.", q5),
  Q(6, "다음 분수들은 어떤 규칙에 따라 늘어놓은 것입니다. 처음으로 1과 같게 되는 분수는 몇 번째 분수인지 구하시오.", q6, { label: "답", unit: "번째" }),
  Q(7, "1부터 연속된 홀수들을 차례로 나열하였습니다. □ 안에 알맞은 수를 써넣으시오.", q7, null),
  Q(8, "자연수를 홀수 개씩 묶어 다음과 같이 나열하였습니다. 물음에 답하시오.", q8, two),
  Q(9, "다음 등차수열의 합을 구하시오.", q9, [{ label: "(1)" }, { label: "(2)" }, { label: "(3)" }, { label: "(4)" }]),
  Q(10, "다음은 분모가 6인 59개의 분수를 나열한 것입니다. 이 중 약분해서 자연수가 되는 분수를 제외한 나머지 분수들의 합을 구하시오.", q10),
  Q(11, "다음은 일정한 규칙으로 나열된 분수들입니다. 물음에 답하시오.", q11, [{ label: "(1)", unit: "번째" }, { label: "(2)" }]),
  Q(12, "다음은 일정한 규칙으로 나열된 분수들입니다. 물음에 답하시오.", q12, [{ label: "(1)", unit: "번째" }, { label: "(2)" }]),
  Q(13, "전체 쪽수가 1000쪽인 책이 있습니다. 이 책에 쪽수를 써넣는데 인쇄기가 고장 나서 쪽수 표시에서 숫자 4가 인쇄되지 않았습니다. 이 책에 인쇄된 쪽수의 모든 숫자의 합은 얼마인지 구하시오."),
  Q(14, "1부터 550까지의 수를 차례로 써 나갈 때, 숫자 4는 모두 몇 번 쓰게 되는지 구하시오.", null, { label: "답", unit: "번" }),
  Q(15, "어떤 인쇄기로 1에서 250까지 책의 쪽수를 찍으려고 합니다. 이 인쇄기는 한 번에 한 자씩 찍는다고 합니다. 이 책의 쪽수를 다 찍기 위해서는 이 인쇄기로 모두 몇 번 찍어야 되는지 구하시오.", null, { label: "답", unit: "번" }),
  Q(16, "쪽 번호가 없는 노트를 사서 각 쪽마다 쪽 번호를 써넣었는데 모두 900개의 숫자를 써넣었습니다. 이 노트는 몇 쪽까지 있는 노트인지 구하시오.", null, { label: "답", unit: "쪽" }),
  Q(17, "자연수를 1부터 순서대로 나열한 ㉮에서 쉼표를 모두 지워 ㉯를 썼습니다. ㉯에서 처음부터 세어 700번째 숫자가 들어 있는 수는 ㉮에서는 어떤 수인지 구하시오.", q17),
  Q(18, "천무가 컴퓨터 자판을 한 번 누르는 데 0.5초가 걸리고, 한 번 누르고 나서 다음 번 누르는 데까지는 1초가 걸린다고 합니다. 천무가 1부터 200까지의 숫자를 치는 데 걸리는 시간은 몇 분 몇 초인지 구하시오."),
  Q(19, "숫자 카드 2, 3, 4, 5, 6을 한 번씩만 사용하여 만들 수 있는 세 자리 수는 모두 몇 개인지 구하시오.", null, { label: "답", unit: "개" }),
  Q(20, "숫자 카드 0, 1, 2, 3, 4, 5를 한 번씩 사용하여 만들 수 있는 네 자리 짝수는 모두 몇 개인지 구하시오.", null, { label: "답", unit: "개" }),
  Q(21, "1, 2, 3, 4, 5를 한 번씩만 사용하여 다섯 자리 수를 만듭니다. 다음 물음에 답하시오.", q21, [{ label: "(1)", unit: "번째" }, { label: "(2)" }]),
  Q(22, "다음 그림에서 A에서 B까지 가는 길의 최단거리의 가짓수를 구하시오.", q22, [{ label: "(1)", unit: "가지" }, { label: "(2)", unit: "가지" }]),
  Q(23, "다음과 같은 길이 있습니다. A에서 B로 가는 가장 가까운 길은 모두 몇 가지인지 구하시오.", q23, { label: "답", unit: "가지" }),
  Q(24, "다음 그림과 같은 모양의 길이 있습니다. A에서 B까지 가는 가장 가까운 길은 모두 몇 가지인지 구하시오.", q24, { label: "답", unit: "가지" }),
  Q(25, "다음 수열에서 211은 몇 번째 수인지 모두 구하시오.", q25),
];
