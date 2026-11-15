// 2과정 A2 「복제수와 님게임」 권별 테스트 — 드라이브 원문(2A2 N30 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 파일 이름으로 정하지 않고 문항 내용을 본책 네 단원(10의 거듭제곱과 복제수 · 포포즈와 약속 · 달력과 님게임 · 거꾸로 생각하기)과
// 하나씩 견주어, 본책 단원과 맞는 것을 확인했다.
// 단원: 1~5번·24번 10의 거듭제곱과 복제수 · 6~11번 포포즈와 약속(사각수·약속·혼합 계산과 괄호·연속하는 세 수)
//       · 12~18번 달력과 님게임 · 19~23번·25번 거꾸로 생각하기.
// 글·수·배치는 원문 그대로, 식과 그림은 우리 색표(워밍업 그림 색)의 SVG로 다시 그렸다. 원문 글자 실수 두 곳만 바로잡았다
// (18번 「먼지 시작해서」→「먼저 시작해서」, 23번 「B은」→「B는」). 25번은 원문에서 그림 아래에 있던 물음 문장을 문제 글 끝으로 올렸다.
// 빈칸(□)이 그림 안에 있는 문항(6·8·11번)과 식에 괄호를 그려 넣는 10번은 따로 답 칸을 두지 않는다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, svg, line, ringed, arrow } from "../selection-test-originals/kit.js?v=20261114a";

export const perPage = 4;
export const meta = { course: "2과정", book: "A2", title: "복제수와 님게임" };

const f = (n) => (Math.round(n * 10) / 10).toString();
const INK = UT.ink;

// ── 식 한 줄을 차례로 놓는다. 글자는 어림 폭(textLength, 글자 사이만 조정)으로 놓아 뒤의 칸·기호 자리가 흔들리지 않게 한다.
// 조각: "글자" · { sup } 위 첨자 · { box } 빈칸 · { star } ★ · { sq } ▣ · { frac:[분자, 분모] }
const EM = (c) => (/[0-9]/.test(c) ? 0.58 : c === " " ? 0.27 : /[+−=×÷]/.test(c) ? 0.66 : c === "…" ? 0.92 : /[()]/.test(c) ? 0.34
  : /[A-Z]/.test(c) ? 0.66 : /[.,]/.test(c) ? 0.28 : /[가-힣]/.test(c) ? 0.9 : 0.6);
const widthOf = (s, size) => [...s].reduce((sum, c) => sum + EM(c), 0) * size;
const word = (x, y, s, size, { weight = 500, fill = INK } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" textLength="${f(widthOf(s, size))}" lengthAdjust="spacing" dominant-baseline="central" style="font-size:${size}px;font-weight:${weight};fill:${fill};dominant-baseline:central;letter-spacing:0;white-space:pre">${esc(s)}</text>`;
function run(x, y, parts, size = 15) {
  let out = "";
  let cx = x;
  for (const part of parts) {
    if (typeof part === "string") { out += word(cx, y, part, size); cx += widthOf(part, size); }
    else if (part.sup) { const s = size * 0.66; out += word(cx + 1, y - size * 0.42, part.sup, s); cx += widthOf(part.sup, s) + 2; }
    else if (part.box) { const w = part.box === true ? size * 2.5 : part.box, h = size * 1.6; out += `<rect x="${f(cx + 3)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="3" fill="#fff" stroke="${UT.box}" stroke-width="1.6"/>`; cx += w + 6; }
    else if (part.star) { const s = size * 0.95; out += starMark(cx + s / 2 + 1, y, s); cx += s + 2; }
    else if (part.sq) { const s = size * 0.82, x0 = cx + 2, y0 = y - s / 2; out += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(s)}" height="${f(s)}" fill="#fff" stroke="${INK}" stroke-width="1.3"/><rect x="${f(x0 + s * 0.24)}" y="${f(y0 + s * 0.24)}" width="${f(s * 0.52)}" height="${f(s * 0.52)}" fill="${INK}"/>`; cx += s + 4; }
    else if (part.frac) {
      const [n, d] = part.frac.map(String), s = size * 0.8, w = Math.max(widthOf(n, s), widthOf(d, s)) + 4, mid = cx + w / 2 + 1;
      out += word(mid - widthOf(n, s) / 2, y - s * 0.68, n, s) + line(f(cx + 1), f(y), f(cx + 1 + w), f(y), { stroke: INK, width: 1.2 }) + word(mid - widthOf(d, s) / 2, y + s * 0.72, d, s);
      cx += w + 3;
    }
  }
  return { markup: out, end: cx };
}
const runOf = (x, y, parts, size) => run(x, y, parts, size).markup;
const panel = (x, y, w, h, fill = "#f1f6ea", stroke = "#bcd59a") => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`;

// ★(꽉 찬 별)
function starMark(cx, cy, s) {
  const pts = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.22 : s * 0.5; return `${f(cx + Math.cos(a) * r)},${f(cy + 1 + Math.sin(a) * r)}`; });
  return `<polygon points="${pts.join(" ")}" fill="${UT.orange}" stroke="${UT.orange}" stroke-width="1" stroke-linejoin="round"/>`;
}

// (1)(2)… 꼬리표 달린 식 목록
function items(label, rows, { width = 260, gap = 32, size = 14, top = 16, tagW = 32, extra = 0 } = {}) {
  let y = top;
  const body = rows.map((parts, i) => {
    const lines = Array.isArray(parts[0]) ? parts : [[].concat(parts)];
    const out = word(6, y, `(${i + 1})`, size - 1) + lines.map((l, k) => runOf(6 + tagW + (k ? size * 1.2 : 0), y + k * size * 1.6, l, size)).join("");
    y += gap + (lines.length - 1) * size * 1.6;
    return out;
  }).join("");
  return svg(width, y - gap + top + extra, label, body, width);
}

// ── 그림
const q1 = () => items("계산할 식 네 개", ["12×25", "125×56", "700÷25", "3000÷125"], { width: 200 });
const q2 = () => items("2와 5의 거듭제곱을 곱한 수 두 개", [["2", { sup: "7" }, "×5", { sup: "7" }], ["2", { sup: "11" }, "×5", { sup: "13" }]], { width: 200, gap: 38, top: 20 });
const q3 = () => items("더하고 빼는 긴 식 두 개", ["40−39+38−37+…+4−3+2−1", [["60+59−58−57+56+55−54−53"], ["+…+4+3−2−1"]]], { width: 260, gap: 40, size: 14 });
const q4 = () => items("계산할 식 두 개", ["19×999+19", "444×444+556×444"], { width: 230, gap: 38 });
const q5 = () => items("계산할 식 두 개", ["1011×1007−1005×1011", "43×102−86"], { width: 260, gap: 38 });
const q6 = () => items("1부터 연속된 홀수의 합 네 개", [
  ["1 + 3 + 5 + 7 + … + 19 =", { box: true }],
  ["1 + 3 + 5 + 7 + … + 43 =", { box: true }],
  ["1 + 3 + 5 + 7 + … +", { box: true }, "= 121"],
  ["1 + 3 + 5 + 7 + … +", { box: true }, "= 400"]
], { width: 270, gap: 40, top: 20 });
function q7() {
  const eq = (x, y, a, b, c) => runOf(x, y, [a, { star: true }, `${b} = ${c}`], 15);
  return svg(300, 96, "★ 계산 규칙 네 개",
    panel(12, 8, 276, 80, "#fffbea", UT.cardLine) + eq(36, 34, "4", "3", "11") + eq(176, 34, "1", "5", "7") + eq(36, 64, "2", "8", "12") + eq(176, 64, "6", "9", "21"), 300);
}
function q8() {
  return svg(260, 150, "연산자 ▣ 약속과 빈칸 두 개",
    panel(34, 6, 192, 40) + runOf(58, 26, ["A", { sq: true }, "B = A×A + B×B"], 15)
    + word(8, 82, "(1)", 13) + runOf(40, 82, ["8 ", { sq: true }, " ", { box: true }, " = 100"], 15)
    + word(8, 126, "(2)", 13) + runOf(40, 126, [{ box: true }, " ", { sq: true }, " 5 = 169"], 15), 260);
}
function q9() { return items("계산할 식 두 개", ["15 − 24 ÷ 3 + 2 × 4 + 5", "11 + 15 ÷ (5 − 2) × 2 − 3"], { width: 260, gap: 40 }); }
function q10() { return items("괄호를 넣을 식 두 개", ["3  ×  4  +  4  ÷  2  =  8", "8  ×  9  ÷  3  −  1  =  16"], { width: 260, gap: 48, size: 15, top: 20 }); }
function q11() {
  const r = run(24, 28, [{ box: 40 }, "  ×  ", { box: 40 }, "  ×  ", { box: 40 }, "  = 2730"], 15);
  return svg(270, 56, "연속하는 세 자연수의 곱", r.markup, 300);
}
// 16. 요일 칸을 비워 둔 달력(1일부터 첫 칸에)
function q16() {
  const w = 36, h = 30, x0 = 14, y0 = 8;
  let out = "";
  for (let c = 0; c < 7; c += 1) out += `<rect x="${x0 + c * w}" y="${y0}" width="${w}" height="${h}" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.2"/>`;
  for (let r = 0; r < 5; r += 1) for (let c = 0; c < 7; c += 1) {
    const day = r * 7 + c + 1, x = x0 + c * w, y = y0 + h + r * h;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="${UT.green}" stroke-width="1.2"/>`;
    if (day <= 31) out += `<text x="${x + w / 2}" y="${y + h / 2 + 1}" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:600;fill:${INK};text-anchor:middle;dominant-baseline:central">${day}</text>`;
  }
  return svg(280, y0 + 6 * h + 8, "요일 칸이 빈 한 달 달력", out, 270);
}
// 18. 일렬로 놓인 구슬 17개
function q18() {
  const r = 9.6, step = 19.8, x0 = 4;
  let out = "";
  for (let i = 0; i < 17; i += 1) {
    const cx = x0 + r + i * step;
    out += `<circle cx="${f(cx)}" cy="20" r="${r}" fill="${UT.greenSoft}" stroke="${UT.green}" stroke-width="1.3"/><text x="${f(cx)}" y="20.5" text-anchor="middle" dominant-baseline="central" style="font-size:${i < 9 ? 11 : 9.5}px;font-weight:700;fill:${INK};text-anchor:middle;dominant-baseline:central">${i + 1}</text>`;
  }
  return svg(345, 40, "1번부터 17번까지 번호가 붙은 구슬 17개", out, 345);
}
function q23() {
  const y = [30, 66, 100];
  return svg(310, 126, "세 사람이 구슬을 주고받은 차례",
    panel(4, 6, 302, 114)
    + runOf(20, y[0], ["A는 가지고 있던 구슬의 ", { frac: [1, 3] }, "을 B에게 주었습니다."], 14)
    + runOf(20, y[1], ["B는 가지고 있던 구슬의 ", { frac: [1, 3] }, "을 C에게 주었습니다."], 14)
    + runOf(20, y[2], ["C는 가지고 있던 구슬 중 8개를 A에게 주었습니다."], 14), 310);
}
const q24 = () => svg(240, 50, "계산할 식", panel(20, 4, 200, 42) + runOf(44, 25, ["33×5656 + 56×6667"], 15), 240);
function q25() {
  const nodes = [17, 50, 25, 74], cy = 104, r = 18, xs = nodes.map((_, i) => 26 + i * 86);
  let chain = "";
  nodes.forEach((n, i) => {
    if (i) chain += arrow(xs[i - 1] + r + 2, cy, xs[i] - r - 3, cy, { stroke: UT.line, width: 1.4 });
    chain += `<circle cx="${xs[i]}" cy="${cy}" r="${r}" fill="#fff" stroke="${UT.purple}" stroke-width="1.6"/><text x="${xs[i]}" y="${cy + 1}" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:600;fill:${INK};text-anchor:middle;dominant-baseline:central">${n}</text>`;
  });
  return svg(310, 128, "계산 규칙과 17을 세 번 계산한 차례",
    panel(36, 6, 238, 60, "#fffbea", UT.cardLine)
    + ringed(58, 24, "1", { r: 8.5, size: 10.5 }) + word(74, 24, "홀수는 3배 한 후 1을 뺍니다.", 14)
    + ringed(58, 49, "2", { r: 8.5, size: 10.5 }) + word(74, 49, "짝수는 2로 나눕니다.", 14)
    + chain, 310);
}

const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer });
const parts = (n, unit) => Array.from({ length: n }, (_, i) => ({ label: `(${i + 1})`, ...(unit ? { unit } : {}) }));
export const questions = [
  Q(1, "다음을 계산하시오.", q1, parts(4)),
  Q(2, "다음 수들은 몇 자리의 수인지 구하시오.", q2, parts(2, "자리 수")),
  Q(3, "다음 수들을 간단하게 계산하시오.", q3, parts(2)),
  Q(4, "다음을 계산하시오.", q4, parts(2)),
  Q(5, "다음을 계산하시오.", q5, parts(2)),
  Q(6, "1부터 연속된 홀수들을 차례로 나열하였습니다. □ 안에 알맞은 수를 써넣으시오.", q6, null),
  Q(7, "다음의 ★은 일정한 계산 규칙을 나타냅니다. 7★7을 구하시오.", q7),
  Q(8, "연산자 ▣를 다음과 같이 약속할 때, 빈칸에 알맞은 수를 써넣으시오.", q8, null),
  Q(9, "다음 식을 계산하시오.", q9, parts(2)),
  Q(10, "다음 주어진 식에 괄호 1개를 넣어 올바른 식이 되도록 하시오.", q10, null),
  Q(11, "연속하는 세 자연수가 있습니다. 세 수는 모두 두 자리 수이고, 연속하는 세 자연수의 곱이 다음과 같이 주어졌을 때, 세 자연수를 구하시오.", q11, null),
  Q(12, "2019년 5월 1일은 수요일입니다. 2022년 5월 5일은 무슨 요일인지 구하시오. (단, 2020년은 윤년입니다.)", null, { label: "답", unit: "요일" }),
  Q(13, "어느 해의 3월 3일은 월요일입니다. 같은 해 6월 15일은 무슨 요일인지 구하시오.", null, { label: "답", unit: "요일" }),
  Q(14, "어느 해의 8월 15일은 일요일입니다. 같은 해 6월 23일은 무슨 요일인지 구하시오.", null, { label: "답", unit: "요일" }),
  Q(15, "현빈이네 학교의 겨울방학은 오늘부터 75일 후에 시작합니다. 오늘이 10월 7일 목요일이면 방학은 몇 월 며칠 무슨 요일인지 구하시오."),
  Q(16, "어느 달의 달력에서 수요일인 날짜를 모두 더하니 80이었습니다. 이 달의 27일은 무슨 요일인지 구하시오.", q16, { label: "답", unit: "요일" }),
  Q(17, "60개의 바둑알이 들어 있는 상자에서 갑, 을 두 사람이 한 번에 1개에서 6개까지 바둑알을 꺼내는 놀이를 하려고 합니다. 마지막 바둑알을 꺼내는 사람이 이기는 것으로 할 때 갑이 반드시 이기려면 먼저 시작하여야 합니다. 먼저 시작하여 □개를 꺼내고 그 다음 을이 5개를 꺼냈다면 또다시 갑이 △개를 꺼내야 이기게 됩니다. □, △에 알맞은 수를 구하시오.", null, [{ label: "□", unit: "개" }, { label: "△", unit: "개" }]),
  Q(18, "17개의 구슬이 일렬로 놓여 있습니다. 두 사람이 게임을 하는데 한 번에 한 개 또는 두 개의 구슬을 가져갈 수 있으나 연속해 있는 구슬만 가져갈 수 있다고 합니다. 마지막 구슬을 가져가게 되면 이긴다고 할 때 먼저 시작해서 반드시 이기려면 처음에 몇 번 구슬을 가져가야 하는지 구하시오.", q18, { label: "답", unit: "번 구슬" }),
  Q(19, "첫 번째 가게에서 가진 돈의 절반보다 700원 적은 돈으로 사과를 샀습니다. 두 번째 가게에서는 사과를 사고 남은 돈의 절반보다 1200원을 더 주고 연필을 샀더니 1300원이 남았습니다. 처음에 가지고 있던 돈은 얼마인지 구하시오.", null, { label: "답", unit: "원" }),
  Q(20, "알라딘이 3개의 비밀의 문을 지나 보물을 찾으러 갑니다. 각 문을 지날 때마다 문지기에게 알라딘이 가지고 있던 금화의 절반보다 2개 더 많이 주어야 문을 열어줍니다. 보물이 있는 곳에 도착하니 알라딘이 가진 금화가 2개뿐이었다면 처음에 알라딘이 가지고 있던 금화는 몇 개였는지 구하시오.", null, { label: "답", unit: "개" }),
  Q(21, "물통 A와 물통 B에 물이 들어 있습니다. A에는 B보다 많은 양의 물이 들어 있습니다. 먼저 A에서 B에 들어 있는 양만큼의 물을 퍼내어 B로 옮겼습니다. 그 다음에는 B에서 A에 남아 있는 양만큼의 물을 퍼내어 A로 옮겼습니다. 마지막으로 A에서 B에 들어 있는 양만큼의 물을 퍼내어 B로 옮겼더니 두 물통의 물이 40L로 같아졌습니다. 처음에 A에 들어 있던 물의 양은 얼마인지 구하시오.", null, { label: "답", unit: "L" }),
  Q(22, "일식, 이식, 삼식이가 구슬을 가지고 다음과 같은 놀이를 합니다. 먼저 일식이가 이식이, 삼식이에게 그들이 가지고 있는 만큼의 구슬을 주었고, 다음에 이식이가 일식이와 삼식이에게 그들이 가지고 있는 만큼의 구슬을 주었습니다. 마지막으로 삼식이가 일식이와 이식이에게 그들이 가지고 있는 만큼의 구슬을 주었더니 일식이, 이식이, 삼식이 세 사람 모두 구슬을 32개씩 똑같이 가지게 되었습니다. 처음에 일식이, 이식이, 삼식이가 가지고 있던 구슬은 각각 몇 개인지 구하시오.", null, [{ label: "일식이", unit: "개" }, { label: "이식이", unit: "개" }, { label: "삼식이", unit: "개" }]),
  Q(23, "A, B, C 세 사람이 다음과 같이 구슬을 주고받았더니 세 사람의 구슬 개수가 24개로 같아졌습니다. 처음에 A가 가지고 있던 구슬의 개수를 구하시오.", q23, { label: "답", unit: "개" }),
  Q(24, "다음을 계산하시오.", q24),
  Q(25, "다음과 같은 계산 규칙에 따라 17을 3번 계산하였더니 나온 수는 74입니다. 어떤 수를 4번 계산하였더니 4가 나왔을 때 어떤 수가 될 수 있는 수를 모두 구하시오.", q25),
];
