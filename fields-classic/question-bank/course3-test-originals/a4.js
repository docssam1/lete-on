// 3과정 A4 「하노이탑과 직선의 방정식」 권별 테스트 — 드라이브 원문(3과정-A4 테스트, 25문항)을 우리 시험지 꼴로 다시 짜고(원장 2026-11-15),
// 신판 본책(N20 「하노이탑과 직선의 방정식」, 210811)의 다섯 단원(01 하노이탑과 수열의 합 · 02 지수의 법칙 · 03 가비의 리 · 04 직선의 방정식
// · 05 리뷰문제)에 맞췄다(파일 이름이 아니라 내용으로 확인).
// 원문에서 본책에 같은 꼴이 없는 문항(서로소인 수 · 수 배열표 · 계차수열 · 나머지가 같은 수 · 연속한 두 수의 곱의 합)은 뺐고,
// 본책 02~04단원은 원문에 문항이 없어서 단원마다 다섯 문항(6~20번)을 본책 활동·확인·연습문제 꼴에서 수만 바꿔 새로 냈다. 5번 (2)도 새로 냈다(01단원 부분분수).
// 원문의 경우의 수·확률 문항은 본책 리뷰문제와 같은 꼴이지만, 단원이 고르게 들어가도록 다섯 개(21~25번)만 남겼다.
// 단원: 1~5번 하노이탑과 수열의 합(1번 피보나치 수열 · 2~4번 등비수열의 합과 끝없는 합 · 5번 팩토리얼과 부분분수)
//       · 6~10번 지수의 법칙(새로 냄 — 6번 거듭제곱의 자리 수 · 7·8번 지수가 있는 등식 · 9번 약수의 개수 · 10번 문자로 나타내기)
//       · 11~15번 가비의 리(새로 냄 — 11번 인수분해와 자연수 해 · 12번 등식의 변형 · 13번 분수식의 값 · 14·15번 비례식과 가비의 리)
//       · 16~20번 직선의 방정식(새로 냄 — 16번 내분점 · 17·18번 넓이를 이등분하는 선분·직선 · 19번 직선의 방정식 · 20번 최단 거리와 직선)
//       · 21~25번 리뷰문제(경우의 수 · 확률).
// 원문 번호 → 이 파일 번호: 20→1 · 21→2 · 22→3 · 24→4 · 25→5 · 4→21 · 8→22 · 11→23 · 13→24 · 14→25. 남긴 문항의 글·수·배치는 원문 그대로.
// 2번(원문 21번)은 원문에 짝 없는 「(1)」만 있어 뺐고, 22번(원문 8번) 「오른쪽 그림」은 그림이 글 아래에 오므로 「다음 그림」으로 바꿨다.
// 분수는 빗금으로 적고 화면이 mathText로 위아래로 쌓는다(mathPrompt). 지수에 식이 들어간 거듭제곱·분수식은 MathML 한 줄 수식(math-markup.js)으로,
// 4번 식은 그림(SVG 글자)으로, 좌표평면·반원·정사각형 그림은 우리 색표 SVG로 그렸다. 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, text, svg, line } from "../selection-test-originals/kit.js?v=20261114a";
import { mathText, expr, part, powPart, rowPart } from "../math-markup.js?v=20261122w";

export const perPage = 4;
export const meta = { course: "3과정", book: "A4", title: "하노이탑과 직선의 방정식" };

const f = (n) => (Math.round(n * 10) / 10).toString();
const small = (x, y, value, size = 12, fill = UT.ink) => text(f(x), f(y), value, { size, weight: 600, fill });

// ── 글로 쓰는 그림 칸(식 상자 · (1)(2) 물음)
const SERIF = "font-family:'FC Serif',serif;color:#191511;word-break:keep-all";
const size = (min, cq, max) => `font-size:clamp(${min}px,${cq}cqw,${max}px)`;
const math = (value) => mathText(esc(value));
// 식 조각: 수는 수, 글자 하나는 문자, 「2^9」「2^(x+3)」은 거듭제곱(괄호 안은 띄어 쓰지 않는다)
const atoms = (value) => String(value).match(/\d+(?:\.\d+)?|[A-Za-z]|[^\sA-Za-z\d]/g) || [];
function tokens(value) {
  return String(value).split(" ").filter(Boolean).flatMap((t) => {
    const grouped = t.match(/^([A-Za-z]|\d+)\^\(([^()]+)\)$/);
    if (grouped) return [powPart(grouped[1], rowPart(...atoms(grouped[2])))];
    const plain = t.match(/^([A-Za-z]|\d+)\^([A-Za-z]|\d+)$/);
    if (plain) return [powPart(plain[1], plain[2])];
    return atoms(t);
  });
}
// 한 줄 수식: 글 조각과 분수(fr)를 섞어 쓴다
const fr = (num, den) => part(rowPart(...tokens(num)), rowPart(...tokens(den)));
const eq = (...items) => expr(...items.flatMap((item) => (typeof item === "string" ? tokens(item) : [item])));
// 종이색 상자(식 한두 줄)
const panel = (rows, { width = 420 } = {}) =>
  `<div style="width:min(100%,${width}px);margin:0 auto;padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;text-align:center;${SERIF};${size(12, 4.4, 16)};line-height:1.9">${rows.map((row) => `<div style="white-space:nowrap">${row}</div>`).join("")}</div>`;
// 위 그림 + 아래 (1)(2) 물음 줄
function withSubs(top, subs) {
  const cell = (sub) => `<p style="margin:0;padding-left:2.1em;text-indent:-2.1em;${SERIF};${size(11, 4.3, 15.5)};line-height:1.7">${sub}</p>`;
  return `<div style="display:flex;flex-direction:column;gap:14px;width:100%;height:100%;min-height:0;padding-top:6px">${top || ""}<div style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:12px;padding-left:4%">${subs.map(cell).join("")}</div></div>`;
}
const topOnly = (top) => `<div style="width:100%;padding-top:10px">${top}</div>`;
const sub = (label, html) => `${label} ${html}`;

// ── 1~5번 하노이탑과 수열의 합
// 3. 한 변 2cm 정사각형에서 변의 중점을 이어 정사각형을 거듭 그린 그림
function q3() {
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

// 4. 분모에 거듭제곱이 있는 끝없는 합 — SVG 글자로 쌓은 분수
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
const q4 = () => series([["2", "3"], ["1", "3", "2"], ["2", "3", "3"], ["1", "3", "4"], ["2", "3", "5"], ["1", "3", "6"]], "S는 분자가 2와 1로 번갈아 바뀌고 분모가 3의 거듭제곱인 분수를 끝없이 더한 식");

// 5. (1) 팩토리얼의 합 (2) 부분분수의 합
const q5 = () => withSubs("", [
  sub("(1)", `<span style="white-space:nowrap">${math("1 × 1! + 2 × 2! + 3 × 3! + 4 × 4! + ⋯ + 9 × 9!")}</span>`),
  sub("(2)", `<span style="white-space:nowrap">${math("1/(1×3) + 1/(3×5) + 1/(5×7) + ⋯ + 1/(19×21)")}</span>`),
]);

// ── 6~10번 지수의 법칙
const q6 = () => topOnly(panel([eq("( 2^9 + 2^9 + 2^9 + 2^9 )"), eq("× ( 5^10 + 5^10 + 5^10 + 5^10 + 5^10 )")], { width: 300 }));
const q7 = () => withSubs("", [sub("(1)", eq("2^(x+3) + 2^x = 288")), sub("(2)", eq("3^(x−1) + 3^x + 3^(x+1) = 351"))]);
const q8 = () => withSubs("", [sub("(1)", eq("8^(a+1) = 16^(a−1)")), sub("(2)", eq("9^(a+2) ÷ 27^a = 3"))]);
const q9 = () => topOnly(panel([eq("2^n × ( 3^(n+1) − 3^n )")], { width: 280 }));
const q10 = () => topOnly(panel([`${eq("a = 2^(x−1)")} ,&nbsp;&nbsp; ${eq("b = 3^(x+1)")}`], { width: 320 })
  + `<p style="margin:16px 0 0 4%;${SERIF};${size(11, 4.3, 15.5)};line-height:1.7">${eq("6^x")}을 ${eq("a , b")}를 사용하여 나타내시오.</p>`);

// ── 11~15번 가비의 리
const q11 = () => topOnly(panel([eq("xy − 2x + 3y = 20")], { width: 240 }));
const q12 = () => topOnly(panel([`${eq("y =", fr("2x + 3", "x − 1"))}&nbsp;&nbsp; [${eq("x")}]`], { width: 240 }));
const q13 = () => topOnly(panel([eq(fr("3a + ab − 3b", "a − 2ab − b"))], { width: 200 }));
const q14 = () => topOnly(panel([eq(fr("xy + yz + zx", "x^2 + y^2 + z^2"))], { width: 200 }));
const q15 = () => withSubs(panel([eq(fr("x + y", "5"), "=", fr("y + z", "7"), "=", fr("z + x", "6"))], { width: 300 }), [
  `(1) ${eq("x : y : z")}를 가장 간단한 자연수의 비로 나타내시오.`,
  `(2) ${eq("x , y , z")}의 최소공배수가 264일 때, ${eq("x , y , z")}를 각각 구하시오.`,
]);

// ── 16~20번 직선의 방정식(좌표평면)
const it = (x, y, value, size = 14, anchor = "middle") => `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" dominant-baseline="central" style="font-size:${size}px;font-style:italic;font-weight:600;fill:${UT.ink};font-family:'Times New Roman',serif;text-anchor:${anchor};dominant-baseline:central">${esc(value)}</text>`;
const halo = (markup) => markup.replace('style="', 'style="paint-order:stroke;stroke:#fff;stroke-width:3.5px;stroke-linejoin:round;');
const tag = (x, y, value, size = 12.5, anchor = "middle") => halo(text(f(x), f(y), value, { size, weight: 600, anchor }));
const head = (x, y, dx, dy) => `<path d="M${f(x - dx * 8 - dy * 4.5)} ${f(y - dy * 8 + dx * 4.5)} L${f(x)} ${f(y)} L${f(x - dx * 8 + dy * 4.5)} ${f(y - dy * 8 - dx * 4.5)}" fill="none" stroke="${UT.ink}" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"/>`;
// 좌표평면: 수학 좌표(x0~x1, y0~y1)를 s배 — 축 · 화살표 · x, y, O
function plane(x0, x1, y0, y1, s, pad = 22) {
  const W = Math.ceil((x1 - x0) * s + pad * 2), H = Math.ceil((y1 - y0) * s + pad * 2);
  const X = (x) => pad + (x - x0) * s, Y = (y) => pad + (y1 - y) * s;
  const axes = line(f(X(x0)), f(Y(0)), f(X(x1)), f(Y(0)), { width: 1.3 }) + head(X(x1), Y(0), 1, 0)
    + line(f(X(0)), f(Y(y0)), f(X(0)), f(Y(y1)), { width: 1.3 }) + head(X(0), Y(y1), 0, -1)
    + it(X(x1) - 2, Y(0) + 13, "x") + it(X(0) - 11, Y(y1) + 4, "y") + it(X(0) - 10, Y(0) + 12, "O", 13);
  return { W, H, X, Y, axes };
}
const dot = (x, y, fill = UT.ink) => `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${fill}"/>`;
const poly = (pts, { fill = "none", stroke = UT.ink, width = 1.6 } = {}) => `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;

// 17. △ABC: A(0, 8), B(−2, 0), C(4, 0) · 원점 O와 변 AC 위의 점 D를 이은 선분
function q17() {
  const { W, H, X, Y, axes } = plane(-3.2, 5.6, -0.8, 9.9, 16);
  const A = [X(0), Y(8)], B = [X(-2), Y(0)], C = [X(4), Y(0)], D = [X(1), Y(6)];
  const body = poly([A, B, C], { fill: UT.greenSoft, stroke: UT.green }) + axes
    + line(f(X(0)), f(Y(0)), f(D[0]), f(D[1]), { stroke: UT.red, width: 1.8 }) + dot(...D)
    + tag(A[0] + 10, A[1] - 6, "A") + tag(X(0) - 10, Y(8), "8") + tag(B[0] - 2, B[1] - 11, "B") + tag(B[0], Y(0) + 13, "−2")
    + tag(C[0] + 2, C[1] - 11, "C") + tag(C[0], Y(0) + 13, "4") + tag(D[0] + 11, D[1] - 4, "D");
  return topOnly(svg(W, H, "세 점 A(0, 8), B(−2, 0), C(4, 0)을 꼭짓점으로 하는 삼각형과 원점 O에서 변 AC 위의 점 D까지 이은 선분", body, 230));
}
// 18. 사각형 OABC: O(0, 0), A(8, 0), B(4, 4), C(0, 4) · 직선 y = ax
function q18() {
  const { W, H, X, Y, axes } = plane(-1, 9.6, -0.8, 5.4, 22);
  const O = [X(0), Y(0)], A = [X(8), Y(0)], B = [X(4), Y(4)], C = [X(0), Y(4)];
  const body = poly([O, A, B, C], { fill: UT.blueSoft, stroke: UT.blue }) + axes
    + line(f(X(0)), f(Y(0)), f(X(6.4)), f(Y(3.84)), { stroke: UT.red, width: 1.8 })
    + tag(A[0] + 2, A[1] + 13, "A(8, 0)") + tag(B[0] + 4, B[1] - 12, "B(4, 4)") + tag(C[0] + 6, C[1] - 12, "C(0, 4)", 12.5, "start")
    + halo(`<text x="${f(X(6.5))}" y="${f(Y(3.84) - 13)}" text-anchor="middle" dominant-baseline="central" style="font-size:13.5px;font-style:italic;font-weight:600;fill:${UT.red};font-family:'Times New Roman',serif;text-anchor:middle;dominant-baseline:central">y = ax</text>`);
  return topOnly(svg(W, H, "네 점 O(0, 0), A(8, 0), B(4, 4), C(0, 4)로 이루어진 사각형 OABC와 원점을 지나는 직선 y = ax", body, 280));
}
// 20. A(4, 1), B(2, 5) · x축 위의 점 P, y축 위의 점 Q(자리는 대강)
function q20() {
  const { W, H, X, Y, axes } = plane(-1, 5.6, -0.8, 6, 24);
  const A = [X(4), Y(1)], B = [X(2), Y(5)], P = [X(2.5), Y(0)], Q = [X(0), Y(2.4)];
  const path = `<polyline points="${[A, P, Q, B].map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}" fill="none" stroke="${UT.purple}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const body = axes + path + dot(...A) + dot(...B) + dot(...P) + dot(...Q)
    + tag(A[0] + 8, A[1] - 11, "A(4, 1)", 12.5, "start") + tag(B[0] + 8, B[1] - 8, "B(2, 5)", 12.5, "start")
    + tag(P[0], P[1] + 13, "P") + tag(Q[0] - 10, Q[1], "Q");
  return withSubs(svg(W, H, "좌표평면 위의 두 점 A(4, 1), B(2, 5)와 x축 위의 점 P, y축 위의 점 Q를 차례로 이은 꺾은선", body, 200), ["(1) 직선 PQ의 방정식", "(2) 두 점 P, Q의 좌표"]);
}

const q16 = () => withSubs("", ["(1) 선분 AB를 2 : 1로 내분하는 점 P", "(2) 선분 AB의 중점 M"]);
const q19 = () => withSubs("", [
  "(1) 직선 y = −2x + 5와 서로 수직이고, 점 (4, −1)을 지나는 직선",
  "(2) 두 점 A(−1, 3), B(5, −1)에 대하여 선분 AB의 수직이등분선",
]);

// ── 21~25번 리뷰문제
// 22. 반원 위의 점 8개(지름 위 4개 — 양 끝 포함, 호 위 4개)
function q22() {
  const cx = 120, cy = 112, r = 96;
  const arc = [144, 108, 72, 36].map((d) => [cx + r * Math.cos(d * Math.PI / 180), cy - r * Math.sin(d * Math.PI / 180)]);
  const base = [-1, -1 / 3, 1 / 3, 1].map((t) => [cx + r * t, cy]);
  const dots = [...arc, ...base].map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" fill="${UT.blue}"/>`).join("");
  return svg(240, 124, "반원 위에 찍힌 점 8개",
    `<path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="${UT.blueSoft}" stroke="${UT.ink}" stroke-width="1.6"/>`
    + line(cx - r, cy, cx + r, cy, { stroke: UT.ink, width: 1.6 }) + dots, 240);
}

const A = (unit) => ({ label: "답", unit });
const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer, mathPrompt: true });
const two = [{ label: "(1)" }, { label: "(2)" }];
export const questions = [
  // 01 하노이탑과 수열의 합
  Q(1, "사다리를 타고 올라가는데 한 번에 한 칸 또는 두 칸만을 올라갈 수 있다고 합니다. 이 사다리가 모두 8칸일 때, 이 사다리를 올라가는 서로 다른 방법의 수를 구하시오.", null, A("가지")),
  Q(2, "다음 수열의 합을 구하시오. S = 2 + 2^2 + 2^3 + ⋯ + 2^11", null, { label: "S =" }),
  Q(3, "다음 그림과 같이 한 변의 길이가 2cm인 정사각형의 각 변의 중점을 네 꼭짓점으로 하는 정사각형을 그리고, 새로 만들어진 정사각형의 각 변의 중점을 네 꼭짓점으로 하는 정사각형을 또 다시 그립니다. 이와 같은 방법으로 계속 반복하여 정사각형을 한없이 그려 나갈 때, 모든 정사각형의 넓이의 합을 구하시오.", q3, A("㎠")),
  Q(4, "다음 식을 계산하시오.", q4, { label: "S =" }),
  Q(5, "다음을 계산하시오.", q5, two),
  // 02 지수의 법칙
  Q(6, "다음을 계산한 값은 몇 자리 수입니까?", q6, A("자리 수")),
  Q(7, "다음 식을 만족하는 x의 값을 구하시오.", q7, [{ label: "(1) x =" }, { label: "(2) x =" }]),
  Q(8, "다음 등식이 성립하도록 하는 정수 a의 값을 구하시오.", q8, [{ label: "(1) a =" }, { label: "(2) a =" }]),
  Q(9, "다음 수의 약수의 개수가 모두 42개일 때, 자연수 n의 값을 구하시오.", q9, { label: "n =" }),
  Q(10, "두 수 a, b가 다음과 같을 때, 물음에 답하시오.", q10),
  // 03 가비의 리
  Q(11, "다음 방정식을 만족하는 자연수 x, y의 순서쌍 (x, y)를 모두 구하시오.", q11, { label: "(x, y) =" }),
  Q(12, "다음 등식을 [ ] 안의 문자에 관하여 풀어 보시오.", q12, { label: "x =" }),
  Q(13, "1/(a) − 1/(b) = 2일 때, 다음 식의 값을 구하시오. (단, ab ≠ 0)", q13),
  Q(14, "3x = 4y = 6z일 때, 다음 식의 값을 구하시오. (단, xyz ≠ 0)", q14),
  Q(15, "자연수 x, y, z가 다음 식을 만족할 때, 물음에 답하시오.", q15, [{ label: "(1) x : y : z =" }, { label: "(2) x =" }, { label: "y =" }, { label: "z =" }]),
  // 04 직선의 방정식
  Q(16, "두 점 A(−2, 5), B(7, −1)에 대하여 다음 점의 좌표를 구하시오.", q16, [{ label: "(1) P" }, { label: "(2) M" }]),
  Q(17, "다음 그림에서 원점 O와 점 D를 이은 선분이 세 점 A(0, 8), B(−2, 0), C(4, 0)을 꼭짓점으로 하는 △ABC의 넓이를 이등분할 때, 점 D의 좌표를 구하시오.", q17, { label: "D" }),
  Q(18, "다음 그림과 같이 좌표평면 위의 네 점 O(0, 0), A(8, 0), B(4, 4), C(0, 4)로 이루어진 사각형 OABC의 넓이를 직선 y = ax가 이등분할 때, a의 값은 얼마입니까?", q18, { label: "a =" }),
  Q(19, "주어진 조건을 만족하는 직선의 방정식을 구하시오.", q19, two),
  Q(20, "다음 그림과 같이 좌표평면 위에 두 점 A(4, 1), B(2, 5)와 x축 위에 점 P, y축 위에 점 Q가 있습니다. 이때 AP + PQ + QB의 값이 최소가 되도록 할 때, 다음을 구하시오.", q20, [{ label: "(1)" }, { label: "(2) P" }, { label: "Q" }]),
  // 05 리뷰문제
  Q(21, "1, 2, 3, 4, 5를 한 번씩만 사용하여 다섯 자리 수를 만듭니다. 다음 물음에 답하시오. (1) 작은 수부터 나열할 때, 32415는 몇 번째 수입니까? (2) 작은 수부터 나열할 때, 45번째 수는 얼마입니까?", null, [{ label: "(1)", unit: "번째" }, { label: "(2)" }]),
  Q(22, "다음 그림과 같이 반원 위에 8개의 점이 있습니다. 다음을 구하시오. (1) 두 점 이상을 지나는 직선의 개수 (2) 세 점을 꼭짓점으로 하는 삼각형의 개수", q22, [{ label: "(1)", unit: "개" }, { label: "(2)", unit: "개" }]),
  Q(23, "타율이 1/4인 야구 선수가 있습니다. 3번 타석에서 정확히 2번 안타를 칠 확률은 얼마입니까?"),
  Q(24, "실력이 거의 같은 승주와 명빈이가 상금을 걸고 컴퓨터 게임을 하던 중이었습니다. 먼저 3승을 하는 사람이 상금 20000원을 갖기로 했습니다. 그런데 승주가 한 번 이긴 다음 정전이 되어서 게임이 중단되었습니다. 더 이상 게임을 진행시킬 수 없어서 상금을 그 자리에서 나누어 갖기로 하였습니다. 얼마씩 나누어 가져야 공평합니까?", null, [{ label: "승주", unit: "원" }, { label: "명빈", unit: "원" }]),
  Q(25, "무승부가 없는 어느 프로야구 경기에서 A 팀은 경기에 이긴 후 다음 경기에 이길 확률이 3/4이고, 경기에 패한 후 다음 경기에 이길 확률이 1/3이라고 합니다. A 팀이 첫 번째 경기에서 이긴 후 네 번째 경기에서도 이길 확률을 구하시오."),
];
