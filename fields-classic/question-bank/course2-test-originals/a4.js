// 2과정 A4 「마방진, 복면산과 비」 권별 테스트 — 드라이브 원문(2A4 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 내용이 본책 네 단원(마방진 · 복면산 · 배수와 약수 · 비와 가정하여 풀기)과 맞는 것을 확인하고 옮겼다.
// 단원: 1~6번 마방진 · 7~11번 복면산(곱셈 매트릭스 포함) · 12~17번 배수와 약수 · 18~25번 비와 가정하여 풀기.
// 글·수·배치는 원문 그대로, 그림(마방진 칸·수 배열·복면산 세로셈)은 우리 색표(워밍업 그림 색)로 다시 그렸다.
// 빈 칸·복면산 글자는 원문대로 비워 둔다. 14번 분수는 그림 안에서 위아래로 쌓아 그린다. 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, text, svg, line, cell, disc, shape, blockArrow } from "../selection-test-originals/kit.js?v=20261114a";

export const perPage = 4;
export const meta = { course: "2과정", book: "A4", title: "마방진, 복면산과 비" };

const f = (n) => (Math.round(n * 10) / 10).toString();
const LINK = { stroke: UT.line, width: 1.5 };
const panel = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`;
const letter = (x, y, value, size = 18) => text(f(x), f(y), value, { size, weight: 600 });

// 수 칸 표: rows = [["", "6", ""], …]
function grid(rows, x0, y0, s, size = 17) {
  return rows.map((row, j) => row.map((value, i) => cell(x0 + i * s, y0 + j * s, s, s, value, { size })).join("")).join("");
}

// ── 1~6번 마방진
const q1 = () => svg(180, 180, "가운데 줄에 8과 14, 맨 윗줄 가운데에 6이 있는 3×3 마방진",
  grid([["", "6", ""], ["8", "", "14"], ["", "", ""]], 9, 9, 54), 170);

function q2() {
  const L = 40, M = 110, Rx = 180, T = 28, C = 96, B = 164, r = 18;
  const pts = [[L, T], [L, C], [L, B], [M, C], [Rx, T], [Rx, C], [Rx, B]];
  return svg(220, 192, "H 모양으로 이은 원 7개",
    line(L, T, L, B, LINK) + line(Rx, T, Rx, B, LINK) + line(L, C, Rx, C, LINK)
    + pts.map(([x, y]) => disc(x, y, r)).join(""), 200);
}

function q3() {
  const r = 16, F = { tl: [40, 120], tr: [150, 120], bl: [40, 230], br: [150, 230] };
  const dx = 66, dy = -74, K = Object.fromEntries(Object.entries(F).map(([k, [x, y]]) => [k, [x + dx, y + dy]]));
  const seg = (a, b, opts = LINK) => line(f(a[0]), f(a[1]), f(b[0]), f(b[1]), opts);
  const hidden = { stroke: UT.line, width: 1.2, dash: "4 4" };
  const edges = seg(F.tl, F.tr) + seg(F.tr, F.br) + seg(F.br, F.bl) + seg(F.bl, F.tl)
    + seg(K.tl, K.tr) + seg(K.tr, K.br)
    + seg(F.tl, K.tl) + seg(F.tr, K.tr) + seg(F.br, K.br)
    + seg(K.bl, K.tl, hidden) + seg(K.bl, K.br, hidden) + seg(K.bl, F.bl, hidden);
  const value = (k, side) => (side === "K" && k === "bl" ? "7" : side === "F" && k === "br" ? "8" : "");
  const dots = [["F", F], ["K", K]].flatMap(([side, set]) => Object.entries(set).map(([k, [x, y]]) => disc(x, y, r, value(k, side), { size: 16 })));
  return svg(240, 254, "꼭짓점에 원을 그린 정육면체(한 꼭짓점에 7, 다른 꼭짓점에 8)", edges + dots.join(""), 220);
}

function q4() {
  const top = [130, 28], bl = [30, 206], br = [230, 206], r = 19;
  const at = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const sides = [[top, bl], [bl, br], [br, top]];
  const mids = sides.flatMap(([a, b]) => [at(a, b, 1 / 3), at(a, b, 2 / 3)]);
  return svg(260, 232, "한 변에 원이 4개씩 놓인 삼각진(가운데에 19)",
    sides.map(([a, b]) => line(a[0], a[1], b[0], b[1], LINK)).join("")
    + [top, bl, br].map(([x, y]) => disc(x, y, r, "", { fill: UT.greenSoft, stroke: UT.green })).join("")
    + mids.map(([x, y]) => disc(f(x), f(y), r)).join("")
    + text(130, 146, "19", { size: 18, weight: 600 }), 240);
}

function q5() {
  const c = [130, 130], R = 108, r = 17, rad = Math.PI / 180;
  const pt = (rr, deg) => [c[0] + rr * Math.cos(deg * rad), c[1] - rr * Math.sin(deg * rad)];
  const up = [90, 210, 330].map((d) => pt(R, d)), down = [270, 30, 150].map((d) => pt(R, d));
  const tri = (list) => `<polygon points="${list.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="none" stroke="${UT.line}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const outer = [30, 90, 150, 210, 270, 330].map((d) => pt(R, d));
  const inner = [0, 60, 120, 180, 240, 300].map((d) => pt(R / Math.sqrt(3), d));
  return svg(260, 260, "원 12개를 놓은 정육각별", tri(up) + tri(down) + [...outer, ...inner].map(([x, y]) => disc(f(x), f(y), r)).join(""), 230);
}

const q6 = () => svg(204, 204, "몇 칸에 수가 적힌 4×4 마방진(사방진)",
  grid([["3", "", "", ""], ["", "8", "5", ""], ["", "12", "", ""], ["15", "", "4", ""]], 10, 10, 46), 190);

// ── 7~11번 복면산
function q7() {
  const X = (i) => 62 + i * 38, W = 256;
  const top = panel(8, 6, W - 16, 132)
    + ["A", "B", "B", "C"].map((v, i) => letter(X(i + 1), 32, v)).join("")
    + letter(26, 68, "+") + ["A", "B", "D"].map((v, i) => letter(X(i + 2), 68, v)).join("")
    + line(20, 90, W - 20, 90, { stroke: UT.ink, width: 1.4 })
    + ["E", "F", "D", "A", "F"].map((v, i) => letter(X(i), 114, v)).join("");
  const b = 30, y0 = 176, row = (y, from) => Array.from({ length: 5 - from }, (_, k) => cell(X(from + k) - b / 2, y - b / 2, b, b, "")).join("");
  const bottom = blockArrow(W / 2, 144, W / 2, 168, { shaft: 7, head: 16, headLen: 10 })
    + panel(8, y0, W - 16, 138)
    + row(y0 + 26, 1) + letter(26, y0 + 64, "+") + row(y0 + 64, 2)
    + line(20, y0 + 86, W - 20, y0 + 86, { stroke: UT.ink, width: 1.4 })
    + row(y0 + 110, 0);
  return svg(W, 322, "덧셈 복면산 ABBC + ABD = EFDAF와 숫자를 써넣을 빈 칸", top + bottom, 250);
}

function q8() {
  const X = (i) => 84 + i * 42, W = 270;
  const rows = [["A"], ["A", "B"], ["A", "B", "C"], ["A", "B", "C", "D"]];
  const body = rows.map((list, j) => list.map((v, k) => letter(X(4 - list.length + k), 30 + j * 36, v)).join("")).join("")
    + letter(40, 30 + 3 * 36, "+")
    + line(30, 160, W - 30, 160, { stroke: UT.ink, width: 1.4 })
    + ["5", "0", "6", "8"].map((v, i) => letter(X(i), 184, v)).join("");
  return svg(W, 210, "피라미드 복면산 A + AB + ABC + ABCD = 5068", panel(14, 6, W - 28, 198) + body, 250);
}

function q9() {
  const s = 52, x0 = 18, y0 = 8;
  return svg(260, 214, "곱이 바깥에 적힌 3×3 빈 칸(가로 42, 72, 120 · 세로 70, 32, 162)",
    grid([["", "", ""], ["", "", ""], ["", "", ""]], x0, y0, s)
    + ["42", "72", "120"].map((v, j) => text(x0 + 3 * s + 30, y0 + j * s + s / 2, v, { size: 16, weight: 600 })).join("")
    + ["70", "32", "162"].map((v, i) => text(x0 + i * s + s / 2, y0 + 3 * s + 24, v, { size: 16, weight: 600 })).join(""), 230);
}

function q10() {
  const X = (i) => 84 + i * 40, W = 262;
  const body = ["A", "B", "C", "D"].map((v, i) => letter(X(i), 32, v)).join("")
    + letter(40, 68, "×") + letter(X(3), 68, "9")
    + line(30, 90, W - 30, 90, { stroke: UT.ink, width: 1.4 })
    + ["D", "C", "B", "A"].map((v, i) => letter(X(i), 114, v)).join("");
  return svg(W, 144, "곱셈 복면산 ABCD × 9 = DCBA", panel(14, 6, W - 28, 132) + body, 250);
}

function q11() {
  const s = 30;
  const one = (x0, mid) => {
    const X = (i) => x0 + 26 + i * 38;
    return shape("circle", X(1), 30, s) + shape("square", X(2), 30, s)
      + letter(x0 + 2, 70, "×", 17) + shape(mid, X(2), 70, s)
      + line(x0 - 6, 96, x0 + 124, 96, { stroke: UT.ink, width: 1.4 })
      + [0, 1, 2].map((i) => shape(mid === "star" ? "circle" : "diamond", X(i), 124, s)).join("");
  };
  return svg(330, 156, "두 곱셈 복면산: ○□ × ○ = ◇◇◇, ○□ × ☆ = ○○○",
    panel(6, 4, 318, 148) + one(28, "circle") + one(184, "star"), 320);
}

// ── 12~17번 배수와 약수
function q14() {
  const fr = (x, n) => text(x, 26, n, { size: 15, weight: 600 }) + line(x - 15, 40, x + 15, 40, { stroke: UT.ink, width: 1.3 }) + text(x, 55, "21", { size: 15, weight: 600 });
  const comma = (x) => text(x, 46, ",", { size: 15, weight: 600 });
  const xs = [36, 80, 124, 0, 214, 258, 304];
  const nums = ["1", "2", "3", "", "98", "99", "100"];
  const body = xs.map((x, i) => (nums[i] ? fr(x, nums[i]) : text(169, 40, "…", { size: 16, weight: 600 }))).join("")
    + [58, 102, 146, 190, 236, 280].map(comma).join("");
  return svg(340, 80, "분모가 21인 분수 1/21부터 100/21까지", panel(4, 4, 332, 72) + body, 330);
}

// ── 18~25번 비와 가정하여 풀기
function q18() {
  const rows = ["① A의 7배는 B의 2배와 같습니다.", "② A의 3배와 B의 2배의 합은 80입니다."]
    .map((v) => `<p style="margin:0;font-size:13px;font-weight:500;line-height:1.7;color:${UT.ink};word-break:keep-all">${esc(v)}</p>`).join("");
  return `<div style="display:grid;place-items:center;width:100%"><div style="width:min(100%,360px);padding:10px 16px;border:1.5px solid ${UT.soft};border-radius:10px;background:#fdfbf5">${rows}</div></div>`;
}

const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const each = (labels, unit) => labels.map((label) => (unit ? { label, unit } : { label }));
export const questions = [
  Q(1, "다음은 3×3 마방진입니다. 빈 칸에 알맞은 수를 써넣어 가로, 세로, 대각선 방향으로 세 수의 합이 같게 만드시오.", q1, null),
  Q(2, "다음 그림에 있는 ○ 안에 서로 다른 수를 넣어서 한 직선 위에 있는 세 수의 곱이 48이 되도록 만드시오.", q2, null),
  Q(3, "정육면체의 꼭짓점에 1에서 8까지의 수를 한 번씩 써넣어 정사각형 위의 네 수의 합이 모두 같게 만들려고 합니다. 정사각형 위의 네 수의 합을 구하고, ○ 안에 알맞은 수를 써넣으시오.", q3, { label: "네 수의 합" }),
  Q(4, "1에서 9까지의 수를 한 번씩 써넣어 삼각형의 한 변 위에 있는 네 수의 합이 19인 삼각진을 만들어 보시오.", q4, null),
  Q(5, "다음 정육각별 모양의 ○ 안에 2에서 24까지의 짝수를 한 번씩 넣어서 각 줄에 있는 네 수의 합이 같도록 만들려고 합니다. 각 줄의 네 수의 합은 얼마가 되어야 하는지 구하시오.", q5),
  Q(6, "가로, 세로가 각각 4칸인 마방진을 사방진이라고 합니다. 1에서 16까지의 수를 넣어 가로, 세로, 대각선의 합이 같게 빈 칸에 알맞은 수를 써넣으시오.", q6, null),
  Q(7, "다음 복면산에서 A, B, C, D, E, F는 서로 다른 숫자입니다. 아래 빈 칸을 완성하고, C가 나타내는 숫자를 구하시오.", q7, { label: "C =" }),
  Q(8, "다음은 피라미드 복면산입니다. 다음 덧셈식에서 A, B, C, D는 서로 다른 숫자를 나타냅니다. 네 자리 수 ABCD를 구하시오.", q8, { label: "ABCD =" }),
  Q(9, "다음 빈칸에 1부터 9까지의 수를 한 번씩 써넣어 가로, 세로에 있는 세 수의 곱이 각각 빈 칸 밖에 있는 수가 되도록 만드시오.", q9, null),
  Q(10, "각 자리 숫자가 다른 네 자리 자연수를 9배 하였더니 원래 숫자의 순서와 거꾸로 되었습니다. 네 자리 자연수 ABCD를 구하시오.", q10, { label: "ABCD =" }),
  Q(11, "다음 두 곱셈 복면산에서 같은 모양은 같은 숫자를 나타냅니다. ☆ 모양이 나타내는 숫자를 구하시오.", q11, { label: "☆ =" }),
  Q(12, "같은 크기의 정육면체 벽돌을 쌓아 가로 80cm, 세로 32cm, 높이 48cm인 직육면체를 만들려고 합니다. 벽돌을 가능한 적게 사용할 때, 벽돌 한 변의 길이와 필요한 벽돌 개수를 각각 구하시오.", null, [{ label: "한 변의 길이", unit: "cm" }, { label: "벽돌 개수", unit: "개" }]),
  Q(13, "어떤 자연수로 39를 나누면 3이 남고, 89를 나누면 5가 남고, 100을 나누면 4가 남습니다. 이러한 자연수를 모두 구하시오."),
  Q(14, "다음은 분모가 21인 분수들입니다. 기약분수는 모두 몇 개인지 구하시오.", q14, { label: "답", unit: "개" }),
  Q(15, "4로 나누면 1이 남고, 5로 나누면 2가 남고, 9로 나누면 6이 남는 자연수들 중에 가장 작은 수를 구하시오."),
  Q(16, "연속된 세 자연수 ㉠, ㉡, ㉢이 있습니다. ㉠은 5의 배수, ㉡은 4의 배수, ㉢은 7의 배수라고 할 때, 가장 작은 세 자연수 ㉠, ㉡, ㉢을 각각 구하시오. (단, ㉠<㉡<㉢)", null, each(["㉠ =", "㉡ =", "㉢ ="])),
  Q(17, "A : B : C = 5 : 6 : 9인 세 개의 자연수가 있습니다. 세 자연수의 최대공약수와 최소공배수의 합이 273일 때, 세 자연수 A, B, C를 각각 구하시오.", null, each(["A =", "B =", "C ="])),
  Q(18, "두 수 A, B는 다음 조건에 맞는 수입니다. 두 수 A, B를 각각 구하시오.", q18, each(["A =", "B ="])),
  Q(19, "배 3개의 값은 감 5개의 값과 같고, 감 3개의 값은 귤 2개의 값과 같습니다. 배, 귤, 감을 4개씩 사고 10000원을 냈을 때, 배, 귤, 감의 값을 각각 구하시오.", null, each(["배", "귤", "감"], "원")),
  Q(20, "염소 3마리와 오리 2마리의 무게는 33kg이고, 염소 2마리와 오리 3마리의 무게는 27kg입니다. 염소 한 마리의 무게는 몇 kg인지 구하시오. (단, 염소들의 무게는 각각 같고, 오리들의 무게도 각각 같습니다.)", null, { label: "답", unit: "kg" }),
  Q(21, "하경이는 과녁 맞히기 게임을 합니다. 기본 점수는 100점이고 과녁에 맞히면 10점 올라가고, 맞히지 못하면 5점 내려갑니다. 10번 던져서 125점을 얻었습니다. 하경이가 과녁에 맞힌 것은 모두 몇 번인지 구하시오.", null, { label: "답", unit: "번" }),
  Q(22, "유리컵에 무게가 같은 구슬이 여러 개 담겨 있습니다. 무게를 달아보니 450g이었습니다. 컵에 들어 있는 구슬의 수를 두 배로 하면 그 무게가 720g이 된다고 할 때, 유리컵만의 무게를 구하시오.", null, { label: "답", unit: "g" }),
  Q(23, "서영이는 국어, 영어, 수학 3과목의 시험을 쳤습니다. 국어와 수학의 평균 점수가 83점, 수학과 영어의 평균 점수가 88점, 영어와 국어의 평균 점수가 85점입니다. 서영이의 수학 점수를 구하시오.", null, { label: "답", unit: "점" }),
  Q(24, "현경이와 승환이가 계단에서 가위바위보 놀이를 합니다. 이기면 2계단 올라가고, 지면 3계단 내려가기로 하였습니다. 처음에 현경이는 29번째 계단에 있었고 승환이는 14번째 계단에 있었는데, 13번 가위바위보를 하니 현경이와 승환이가 같은 계단에 있게 되었습니다. 비긴 경우가 없을 때, 현경이는 몇 번 이겼는지 구하시오.", null, { label: "답", unit: "번" }),
  Q(25, "준영이는 10원짜리, 50원짜리, 100원짜리 동전을 합해 모두 20개 가지고 있고, 금액은 모두 1200원입니다. 그런데 10원짜리 동전을 같은 개수의 100원짜리 동전으로 바꾸면 금액이 1650원이 된다고 합니다. 준영이가 가지고 있는 50원짜리 동전은 몇 개인지 구하시오.", null, { label: "답", unit: "개" }),
];
