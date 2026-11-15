// 3과정 A4 「하노이탑과 직선의 방정식」 권별 테스트 — 드라이브 원문(3과정-A4 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 본책 단원과 맞는 것을 확인하고 옮겼다: 맞는 판은 N10(200902판, 단원 01 피보나치와 계차수열 · 02 하노이탑과 수열의 합 ·
// 03 지수법칙과 비례식 · 04 직선의 방정식 · 05 리뷰문제). 지금 판 N20(210811판)에는 계차수열·숫자 카드로 만든 수의 합 단원이 없어
// 16~18번이 맞지 않는다(16번 수열은 N10 계차수열 단원 문제와 같은 수열). 두 판의 제목은 같다.
// 단원: 피보나치와 계차수열 15~18·20번 · 하노이탑과 수열의 합 21~25번 · 리뷰문제(경우의 수와 확률) 2~5·7~14번 ·
// 지수법칙과 비례식 · 직선의 방정식은 문항 없음 · 1·6·19번(서로소 · 원탁 · 나머지가 같은 수)은 앞 권 범위.
// 글·수·배치는 원문 그대로, 그림(벤 다이어그램 · 반원 위의 점 · 수 배열표 · 숫자 카드 · 정사각형 잇기)은 우리 색표로 다시 그렸다.
// 21번은 원문에 짝 없는 「(1)」만 있어 뺐고, 8번 「오른쪽 그림」은 그림이 글 아래에 오므로 「다음 그림」으로 바꿨다. 23·24번 식은 거듭제곱이 분모에 들어가, 25번 두 식은 줄 중간에서 끊기지 않도록 그림(SVG 글자)으로 적었다.
// 분수는 글 속 빗금으로 적고 화면이 mathText로 위아래로 쌓는다(mathPrompt). 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, text, svg, line, cardsRow } from "../selection-test-originals/kit.js?v=20261114a";

export const perPage = 4;
export const meta = { course: "3과정", book: "A4", title: "하노이탑과 직선의 방정식" };

const f = (n) => (Math.round(n * 10) / 10).toString();
const small = (x, y, value, size = 12, fill = UT.ink) => text(f(x), f(y), value, { size, weight: 600, fill });

// 1. 전체 · 2의 배수 · 3의 배수 · 5의 배수 벤 다이어그램(괄호는 풀이 칸)
const q1 = () => svg(300, 236, "전체와 2의 배수, 3의 배수, 5의 배수 벤 다이어그램",
  small(40, 12, "전체 (\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0)")
  + `<rect x="8" y="26" width="284" height="202" rx="6" fill="#fdfbf5" stroke="${UT.soft}" stroke-width="1.5"/>`
  + `<circle cx="150" cy="96" r="52" fill="rgba(255,225,220,.55)" stroke="${UT.red}" stroke-width="1.6"/>`
  + `<circle cx="116" cy="152" r="52" fill="rgba(220,245,229,.55)" stroke="${UT.green}" stroke-width="1.6"/>`
  + `<circle cx="184" cy="152" r="52" fill="rgba(221,233,255,.55)" stroke="${UT.blue}" stroke-width="1.6"/>`
  + small(150, 36, "2의 배수 (\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0)") + small(70, 216, "3의 배수 (\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0)") + small(232, 216, "5의 배수 (\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0)"), 300);

// 8. 반원 위의 점 8개(지름 위 4개 — 양 끝 포함, 호 위 4개)
function q8() {
  const cx = 120, cy = 112, r = 96;
  const arc = [144, 108, 72, 36].map((d) => [cx + r * Math.cos(d * Math.PI / 180), cy - r * Math.sin(d * Math.PI / 180)]);
  const base = [-1, -1 / 3, 1 / 3, 1].map((t) => [cx + r * t, cy]);
  const dots = [...arc, ...base].map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" fill="${UT.blue}"/>`).join("");
  return svg(240, 124, "반원 위에 찍힌 점 8개",
    `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="${UT.blueSoft}" stroke="${UT.ink}" stroke-width="1.6"/>`
    + line(cx - r, cy, cx + r, cy, { stroke: UT.ink, width: 1.6 }) + dots, 240);
}

// 15. 수 배열표(1행은 왼쪽에서, 2행은 오른쪽에서 — 원문 그대로 6행까지)
function q15() {
  const w0 = 50, w = 52, h = 24, x0 = 6, y0 = 6;
  const rows = [[1, 2, 3, 4], [8, 7, 6, 5], [9, 10, 11, 12], [16, 15, 14, 13], [17, 18, 19, 20], [24, 23, 22, 21]];
  const X = (c) => x0 + w0 + c * w;
  let out = `<rect x="${x0}" y="${y0}" width="${w0 + 4 * w}" height="${h}" fill="${UT.purpleSoft}"/><rect x="${x0}" y="${y0}" width="${w0}" height="${h * 8}" fill="${UT.purpleSoft}"/>`;
  for (let c = 0; c < 4; c += 1) out += small(X(c) + w / 2, y0 + h / 2, `${c + 1}열`, 13);
  rows.forEach((row, r) => {
    const y = y0 + (r + 1) * h;
    out += small(x0 + w0 / 2, y + h / 2, `${r + 1}행`, 13);
    row.forEach((v, c) => { out += small(X(c) + w / 2, y + h / 2, String(v), 13); });
  });
  out += small(x0 + w0 / 2, y0 + 7 * h + h / 2 - 2, "⋮", 13);
  for (let r = 0; r <= 8; r += 1) out += line(x0, y0 + r * h, x0 + w0 + 4 * w, y0 + r * h, { stroke: UT.box, width: r === 0 || r === 8 ? 1.6 : 1 });
  out += line(x0, y0, x0, y0 + 8 * h, { stroke: UT.box, width: 1.6 });
  for (let c = 0; c <= 4; c += 1) out += line(X(c), y0, X(c), y0 + 8 * h, { stroke: UT.box, width: c === 4 ? 1.6 : 1 });
  return svg(x0 * 2 + w0 + 4 * w, y0 * 2 + 8 * h, "1열부터 4열, 1행부터 6행까지 수를 나열한 표", out, 270);
}

// 17. 숫자 카드 1 2 3 4 5
const q17 = () => svg(240, 46, "숫자 카드 1, 2, 3, 4, 5", cardsRow(["1", "2", "3", "4", "5"], 240, 6, 34), 220);

// 22. 한 변 2cm 정사각형에서 변의 중점을 이어 정사각형을 거듭 그린 그림
function q22() {
  const s = 150, x0 = 20, y0 = 30;
  let sq = [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s]];
  let out = "";
  for (let i = 0; i < 8; i += 1) {
    out += `<polygon points="${sq.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${i === 0 ? UT.greenSoft : "none"}" stroke="${UT.green}" stroke-width="${i < 5 ? 1.6 : 1.1}" stroke-linejoin="round"/>`;
    sq = sq.map((p, k) => { const q = sq[(k + 1) % 4]; return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; });
  }
  const brace = `<path d="M${x0} ${y0 - 2} Q${x0 + s / 2} ${y0 - 26} ${x0 + s} ${y0 - 2}" fill="none" stroke="${UT.line}" stroke-width="1.1" stroke-dasharray="3 3"/>`;
  return svg(190, 190, "한 변이 2cm인 정사각형 안에 중점을 이은 정사각형을 거듭 그린 그림", brace + `<rect x="${x0 + s / 2 - 20}" y="${y0 - 22}" width="40" height="16" fill="#fff"/>` + small(x0 + s / 2, y0 - 14, "2cm", 12) + out, 190);
}

// 23·24. 분모에 거듭제곱이 있는 식 — SVG 글자로 쌓은 분수
function series(terms, label) {
  const size = 17, fs = `font-size:${size}px;font-weight:500;fill:${UT.ink};font-family:'Times New Roman',serif`;
  const word = (x, y, value, extra = "") => `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" style="${fs};text-anchor:middle;dominant-baseline:central${extra}">${value}</text>`;
  const mid = 38;
  let x = 4, out = word(x + 8, mid, "S", ";font-style:italic") + word(x + 26, mid, "=");
  x += 40;
  terms.forEach(([num, base, exp]) => {
    const wide = exp ? 26 : 18;
    out += word(x + wide / 2, mid - 15, num) + line(f(x), mid, f(x + wide), mid, { stroke: UT.ink, width: 1.2 });
    out += exp
      ? `<text x="${f(x + wide / 2 - 4)}" y="${mid + 16}" text-anchor="middle" dominant-baseline="central" style="${fs};text-anchor:middle;dominant-baseline:central">${base}<tspan dy="-7" style="font-size:11px">${exp}</tspan></text>`
      : word(x + wide / 2, mid + 16, base);
    x += wide + 2;
    out += word(x + 7, mid, "+");
    x += 16;
  });
  out += word(x + 6, mid, "⋯");
  const width = Math.ceil(x + 16);
  return svg(width, 76, label, out, width);
}
const q23 = () => series([["1", "3"], ["1", "3", "2"], ["1", "3", "3"], ["1", "3", "4"], ["1", "3", "5"]], "S는 3분의 1, 3의 2제곱분의 1, 3의 3제곱분의 1, …을 끝없이 더한 식");
const q24 = () => series([["2", "3"], ["1", "3", "2"], ["2", "3", "3"], ["1", "3", "4"], ["2", "3", "5"], ["1", "3", "6"]], "S는 분자가 2와 1로 번갈아 바뀌고 분모가 3의 거듭제곱인 분수를 끝없이 더한 식");

// 25. 두 식(줄이 중간에서 끊기지 않도록 그림 글자로)
const q25 = () => svg(340, 64, "(1) 1 곱하기 1 팩토리얼부터 9 곱하기 9 팩토리얼까지의 합, (2) 1 곱하기 2부터 39 곱하기 40까지의 합",
  text(4, 16, "(1)  1 × 1! + 2 × 2! + 3 × 3! + 4 × 4! + ⋯ + 9 × 9!", { size: 15, anchor: "start", weight: 500 })
  + text(4, 48, "(2)  1 × 2 + 2 × 3 + 3 × 4 + 4 × 5 + ⋯ + 39 × 40", { size: 15, anchor: "start", weight: 500 }), 340);

const A = (unit) => ({ label: "답", unit });
const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer, mathPrompt: true });
export const questions = [
  Q(1, "100 이하의 자연수 중에서 30과 서로소인 자연수는 모두 몇 개입니까?", q1, A("개")),
  Q(2, "100원짜리 동전 4개, 10원짜리 동전 5개, 5원짜리 동전 3개가 있습니다. 이들 돈을 적당히 섞어서 지불할 수 있는 금액의 종류는 모두 몇 가지입니까?", null, A("가지")),
  Q(3, "0, 1, 2, 3, 4, 5 중에서 서로 다른 네 숫자를 사용하여 네 자리 수를 만들 때, 다음 물음에 답하시오. (1) 네 자리 수는 모두 몇 개입니까? (2) 네 자리 수 중 짝수는 모두 몇 개입니까?", null, [{ label: "(1)", unit: "개" }, { label: "(2)", unit: "개" }]),
  Q(4, "1, 2, 3, 4, 5를 한 번씩만 사용하여 다섯 자리 수를 만듭니다. 다음 물음에 답하시오. (1) 작은 수부터 나열할 때, 32415는 몇 번째 수입니까? (2) 작은 수부터 나열할 때, 45번째 수는 얼마입니까?", null, [{ label: "(1)", unit: "번째" }, { label: "(2)" }]),
  Q(5, "축구 선수 3명, 배구 선수 3명, 농구 선수 2명이 일렬로 앉을 때, 같은 종목의 선수끼리 서로 이웃하여 앉는 방법은 모두 몇 가지입니까?", null, A("가지")),
  Q(6, "부모와 자녀 4명을 합한 6인 가족이 있습니다. 6명이 원탁에 앉을 때, 부모가 이웃하며 앉는 방법은 몇 가지입니까?", null, A("가지")),
  Q(7, "1, 1, 1, 2, 3, 3의 6장의 숫자 카드가 있습니다. 6장의 카드를 모두 사용하여 만들 수 있는 여섯 자리 수는 모두 몇 개입니까?", null, A("개")),
  Q(8, "다음 그림과 같이 반원 위에 8개의 점이 있습니다. 다음을 구하시오. (1) 두 점 이상을 지나는 직선의 개수 (2) 세 점을 꼭짓점으로 하는 삼각형의 개수", q8, [{ label: "(1)", unit: "개" }, { label: "(2)", unit: "개" }]),
  Q(9, "명중률이 각각 1/3, 2/5인 두 명의 포수가 동시에 참새 1마리를 쏘았을 때 참새가 총에 맞을 확률을 구하시오."),
  Q(10, "A는 5발 중 3발, B는 4발 중 3발, C는 3발 중 1발을 각각 명중할 수 있습니다. 세 사람 중 한 사람만이 명중할 확률을 구하시오."),
  Q(11, "타율이 1/4인 야구 선수가 있습니다. 3번 타석에서 정확히 2번 안타를 칠 확률은 얼마입니까?"),
  Q(12, "주사위 2개를 던질 때 두 개의 눈을 a, b라고 하면, 두 눈의 합 a + b의 기댓값은 얼마입니까?"),
  Q(13, "실력이 거의 같은 승주와 명빈이가 상금을 걸고 컴퓨터 게임을 하던 중이었습니다. 먼저 3승을 하는 사람이 상금 20000원을 갖기로 했습니다. 그런데 승주가 한 번 이긴 다음 정전이 되어서 게임이 중단되었습니다. 더 이상 게임을 진행시킬 수 없어서 상금을 그 자리에서 나누어 갖기로 하였습니다. 얼마씩 나누어 가져야 공평합니까?", null, [{ label: "승주", unit: "원" }, { label: "명빈", unit: "원" }]),
  Q(14, "무승부가 없는 어느 프로야구 경기에서 A 팀은 경기에 이긴 후 다음 경기에 이길 확률이 3/4이고, 경기에 패한 후 다음 경기에 이길 확률이 1/3이라고 합니다. A 팀이 첫 번째 경기에서 이긴 후 네 번째 경기에서도 이길 확률을 구하시오."),
  Q(15, "다음 표는 어떤 규칙에 따라 수들이 나열되어 있는 것입니다. 2열의 5행 수를 [2, 5] = 18, 3열 6행의 수를 [3, 6] = 22로 나타낸다고 할 때, 다음을 구하시오. (1) [3, 25] (2) [□, □] = 73", q15, [{ label: "(1)" }, { label: "(2)" }]),
  Q(16, "수열 5, 7, 11, 17, 25, 35, …이 있습니다. 31번째 수를 구하시오."),
  Q(17, "다음 숫자 카드를 한 번씩 사용하여 만들 수 있는 네 자리 수의 합은 얼마입니까?", q17),
  Q(18, "1부터 6까지의 숫자가 각각 한 개씩 적힌 숫자 카드가 6장 있습니다. 이 중에서 4장을 꺼내 그 숫자의 합을 구할 때, 나올 수 있는 모든 합의 총합을 구하시오."),
  Q(19, "세 자연수 132, 360, 540을 어떤 자연수로 나누었더니 나머지가 모두 같았습니다. 이러한 자연수 중에서 가장 큰 수를 구하시오."),
  Q(20, "사다리를 타고 올라가는데 한 번에 한 칸 또는 두 칸만을 올라갈 수 있다고 합니다. 이 사다리가 모두 8칸일 때, 이 사다리를 올라가는 서로 다른 방법의 수를 구하시오.", null, A("가지")),
  Q(21, "다음 수열의 합을 구하시오. S = 2 + 2^2 + 2^3 + ⋯ + 2^11", null, { label: "S =" }),
  Q(22, "다음 그림과 같이 한 변의 길이가 2cm인 정사각형의 각 변의 중점을 네 꼭짓점으로 하는 정사각형을 그리고, 새로 만들어진 정사각형의 각 변의 중점을 네 꼭짓점으로 하는 정사각형을 또 다시 그립니다. 이와 같은 방법으로 계속 반복하여 정사각형을 한없이 그려 나갈 때, 모든 정사각형의 넓이의 합을 구하시오.", q22, A("㎠")),
  Q(23, "다음 식을 계산하시오.", q23, { label: "S =" }),
  Q(24, "다음 식을 계산하시오.", q24, { label: "S =" }),
  Q(25, "다음 식을 계산하시오.", q25, [{ label: "(1)" }, { label: "(2)" }]),
];
