// 3과정 A2 「순환소수와 수직선좌표」 권별 테스트 — 드라이브 원문(3과정-A2N 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 문항을 본책(N20 「순환소수와 수직선좌표」, N10 판도 같은 차례·같은 문제) 단원의 활동·확인·연습 문제와 견주어
// 본책 단원과 맞는 것을 확인하고 옮겼다(파일 이름이 아니라 내용으로 확인 — 3·4·5·6·7·9·10·11·15·16·17·18·25번은 본책 연습문제의 수만 바꾼 것).
// 단원: 1~6번 유한소수와 순환소수(순환소수 · 11·99의 배수 판정법 · 약수의 개수) · 7~12번·25번 최대공약수와 최소공배수
//       · 13~18번 상대속도와 따라잡기(일차방정식의 활용 · 미지수를 정하는 규칙) · 4단원 수직선좌표와 절댓값은 원문에 문항이 없다.
//       19~24번(자연수 해 · 거듭제곱의 자리 수 · 계산 순서 바꾸기 · 식의 전개 · 2⁴⁸−1의 약수)은 본책 두 판 어디에도 같은 꼴이 없다 — 원문 그대로 둔다.
// 글·수·배치는 원문 그대로. 분수는 빗금으로 적고 화면이 mathText로 위아래로 쌓는다. 순환소수의 점은 숫자 위에 둥근 점(HTML)으로, 식은 MathML 한 줄 수식으로,
// 23번의 큰 괄호는 SVG로 그린다(수식 글꼴이 없는 기기에서도 분수 높이만큼 늘어나게).
// 원문에서 고친 것: 3번 「2b34a7가」→「2b34a7이」, 11번 「175을」→「175를」, 15번 「두 사람을 속력을」→「두 사람의 속력을」, 12번 끝 마침표, 띄어쓰기.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc } from "../selection-test-originals/kit.js?v=20261114a";
import { mathText, mixed, expr, part, powPart } from "../math-markup.js?v=20261027p";

export const perPage = 4;
export const meta = { course: "3과정", book: "A2", title: "순환소수와 수직선좌표" };

// ── 글로 쓰는 그림 칸(순환소수 · 식 · (1)(2) 물음)
const SERIF = "font-family:'FC Serif',serif;color:#191511;word-break:keep-all";
const size = (min, cq, max) => `font-size:clamp(${min}px,${cq}cqw,${max}px)`;
const math = (value) => mathText(esc(value));
// 순환소수: 「0.[1]4285[7]」 — [ ] 안 숫자 위에 점
function rdec(value) {
  const parts = String(value).split(/(\[\d\])/).filter(Boolean);
  const said = String(value).replace(/\[(\d)\]/g, "$1");
  const dot = `<i aria-hidden="true" style="position:absolute;left:50%;top:-.12em;width:.17em;height:.17em;margin-left:-.085em;border-radius:50%;background:currentColor"></i>`;
  const inner = parts.map((p) => (/^\[\d\]$/.test(p) ? `<span style="position:relative;display:inline-block;line-height:1.1">${p[1]}${dot}</span>` : esc(p))).join("");
  return `<span role="img" aria-label="순환소수 ${esc(said)}" style="white-space:nowrap">${inner}</span>`;
}
// 식 한 줄: 띄어 쓴 조각 — 수는 수, 글자 하나는 문자, 「x^2」「2^16」은 거듭제곱
const alg = (value) => expr(...String(value).split(" ").filter(Boolean).map((t) => {
  const m = t.match(/^([A-Za-z]|\d+)\^(\d+)$/);
  return m ? powPart(m[1], m[2]) : t;
}));
// 종이색 상자(원문의 색 상자 자리)
const panel = (rows, { width = 420 } = {}) =>
  `<div style="width:min(100%,${width}px);margin:0 auto;padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;text-align:center;${SERIF};${size(12, 4.4, 16)};line-height:1.8">${rows.map((row) => `<div style="white-space:nowrap">${row}</div>`).join("")}</div>`;
// 위 그림 + 아래 (1)(2) 물음 줄(columns 2면 원문처럼 두 칸)
function withSubs(top, subs, { columns = 1 } = {}) {
  const cell = (sub) => `<p style="margin:0;${SERIF};${size(11, 4.3, 15.5)};line-height:1.6;white-space:nowrap">${sub}</p>`;
  const body = columns > 1
    ? `<div style="flex:1;display:grid;grid-template-columns:repeat(${columns},minmax(0,1fr));align-content:space-evenly;gap:14px 12px;padding-left:4%">${subs.map(cell).join("")}</div>`
    : `<div style="flex:1;display:flex;flex-direction:column;justify-content:space-evenly;gap:12px;padding-left:4%">${subs.map(cell).join("")}</div>`;
  return `<div style="display:flex;flex-direction:column;gap:14px;width:100%;height:100%;min-height:0;padding-top:4px">${top || ""}${body}</div>`;
}
const topOnly = (top) => `<div style="width:100%;padding-top:10px">${top}</div>`;
const sub = (label, html) => `${label} ${html}`;

// ── 1~6번
const hint = panel([`( ${math("1/7")} = ${rdec("0.[1]4285[7]")} ,&nbsp; ${math("1/13")} = ${rdec("0.[0]7692[3]")} )`], { width: 360 });
const q1 = () => withSubs(hint, [sub("(1)", math("25/11")), sub("(2)", math("11/37")), sub("(3)", math("23/7")), sub("(4)", math("29/13"))], { columns: 2 });
const q2 = () => withSubs(hint, [sub("(1)", math("5/36")), sub("(2)", math("15/28"))], { columns: 2 });
// 4. 숫자 카드 다섯 장(㉠, ㉡ 빈 카드)
function q4() {
  const cards = ["8", "3", "7", "㉠", "㉡"];
  const cell = (c) => `<span style="display:inline-grid;place-items:center;width:2.3em;height:2.3em;border:1.6px solid ${UT.cardLine};background:${UT.card};margin-left:-1.6px;${SERIF};font-weight:600">${esc(c)}</span>`;
  return topOnly(`<div style="text-align:center;${size(13, 4.8, 18)}">${cards.map(cell).join("")}</div>`);
}
const q5 = () => withSubs("", ["(1) 48", "(2) 240"].map(esc));

// ── 7~12번
const q8 = () => topOnly(panel([`${mixed(3, 1, 9)} ,&nbsp; ${mixed(2, 14, 15)}`], { width: 220 }));

// ── 19~24번
const q19 = () => withSubs("", [sub("(1)", alg("x y − 3 x + 2 y = 15")), sub("(2)", alg("x y − 4 x − 4 y = 0"))]);
const q20 = () => withSubs("", [sub("(1)", alg("2^19 × 5^22")), sub("(2)", alg("( 2^14 + 2^14 + 2^14 + 2^14 ) × ( 5^17 + 5^17 )"))]);
const q21 = () => withSubs("", ["(1) 44 × 5656 + 56 × 5556", "(2) 2018 × 20192019 − 2019 × 20182017"].map(esc));
const q22 = () => withSubs("", [sub("(1)", alg("( x + 1 ) ( x − 1 ) ( x^2 + 1 ) ( x^4 + 1 )")), sub("(2)", alg("( 2 − 1 ) ( 2 + 1 ) ( 2^2 + 1 ) ( 2^4 + 1 ) ( 2^8 + 1 ) ( 2^16 + 1 )"))]);
// 23. 분수 묶음을 감싸는 큰 괄호는 글꼴에 기대지 않고 SVG로 그린다(수식 글꼴이 없으면 괄호가 늘어나지 않는다)
const paren = (right) => `<svg viewBox="0 0 8 40" width="0.42em" height="2.5em" aria-hidden="true" style="display:block;flex:none"><path d="${right ? "M2 2 Q8 20 2 38" : "M6 2 Q0 20 6 38"}" fill="none" stroke="#191511" stroke-width="1.4" stroke-linecap="round"/></svg>`;
const group = (...items) => `<span style="display:inline-flex;align-items:center">${paren(false)}${expr(...items)}${paren(true)}</span>`;
const sign = (value) => `<span style="padding:0 .25em">${value}</span>`;
function q23() {
  const a = [part(22, 23), "+", part(23, 24)];
  const row = (...cells) => `<div style="display:flex;align-items:center;justify-content:center">${cells.join("")}</div>`;
  const line1 = row(group(...a, "+", part(24, 25)), sign("×"), group(...a, "+", part(2, 3)));
  const line2 = row(sign("−"), group(...a), sign("×"), group(...a, "+", part(24, 25), "+", part(2, 3)));
  return topOnly(`<div style="display:grid;gap:12px;justify-items:center;${SERIF};${size(12, 4.6, 17)};white-space:nowrap">${line1}${line2}</div>`);
}

const Q = (number, prompt, figure = null, answer = { label: "답" }, extra = {}) => ({ number, prompt, figure, answer, ...extra });
const subs = (n, unit) => Array.from({ length: n }, (_, i) => ({ label: `(${i + 1})`, ...(unit ? { unit } : {}) }));
export const questions = [
  Q(1, "다음 분수들을 순환소수로 나타내시오.", q1, subs(4)),
  Q(2, "다음 분수들을 순환소수로 나타내시오.", q2, subs(2)),
  Q(3, "여섯 자리 수 2b34a7이 11의 배수가 될 때, 이러한 여섯 자리 자연수는 모두 몇 개인지 구하시오.", null, { label: "답", unit: "개" }),
  Q(4, "서로 다른 숫자가 쓰인 숫자 카드 5장을 한 번씩 사용하여 다음과 같이 99의 배수인 다섯 자리 수를 만들었습니다. ㉠, ㉡ 2장의 카드에 알맞은 숫자를 찾아 다섯 자리 수를 구하시오.", q4),
  Q(5, "소인수분해를 이용하여 다음 수들의 약수의 개수를 구하시오.", q5, subs(2, "개")),
  Q(6, "1에서 600까지의 수 중에서 약수의 개수가 3개인 수는 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(7, "두 자리의 자연수 A, B의 곱이 1008이고, 최대공약수가 6일 때, 두 수 A, B를 각각 구하시오. (단, A > B)", null, [{ label: "A =" }, { label: "B =" }]),
  Q(8, "다음 두 분수의 어느 것에 곱하여도 자연수가 되는 분수 중에서 가장 작은 분수를 구하시오.", q8),
  Q(9, "어느 역에서 전철은 오전 5시부터 8분 간격으로, 기차는 오전 5시 20분부터 20분 간격으로 출발합니다. 오전 5시 이후 전철과 기차가 두 번째로 동시에 출발하는 시각은 언제입니까?"),
  Q(10, "갑과 을은 같은 날 서로 다른 일자리를 구하였습니다. 갑은 5일간 일하고 하루를 쉬며, 을은 6일간 일하고 2일은 쉰다면, 100일 동안에 두 사람이 동시에 쉬는 날은 며칠입니까?", null, { label: "답", unit: "일" }),
  Q(11, "어떤 자연수로 123을 나누면 3이 남고, 175를 나누면 7이 남는다. 이와 같은 자연수 중에서 가장 큰 수를 구하시오."),
  Q(12, "949/1241을 기약분수로 나타내시오.", null, { label: "답" }, { mathPrompt: true }),
  Q(13, "학수는 친구들에게 사탕을 나누어 주려고 합니다. 7개씩 나누어 주려고 하였더니 3개가 모자라서 5개씩 나누어 주었더니 9개가 남았다고 합니다. 사탕은 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(14, "다인이네 반 학생들이 사탕을 나눠 가지기로 하였습니다. 2명이 결석하면 9개씩 가질 수 있고, 2명이 새로 들어오면 5개씩 가질 수 있다고 할 때, 사탕은 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(15, "둘레의 길이가 3.6km인 호수 주변에 산책로가 있습니다. 산책로의 입구에서 A, B 두 사람이 동시에 서로 반대 방향으로 걸어가면 30분 후에 만나고, 같은 방향으로 걸어가면 1시간 30분 만에 만납니다. A가 B보다 빠르다고 할 때, A, B 두 사람의 속력을 각각 구하시오.", null, [{ label: "A" }, { label: "B" }]),
  Q(16, "준경이가 필기도구를 사려고 하는데, 샤프는 연필보다 400원이 비싸다. 준경이가 가진 돈으로 샤프를 사면 10개를 살 수 있고, 연필을 사면 14개를 남는 돈 없이 살 수 있다고 합니다. 준경이가 가진 돈은 얼마입니까?", null, { label: "답", unit: "원" }),
  Q(17, "세 수 가, 나, 다가 있습니다. 가는 나의 2배보다 3 크고, 나는 다의 3/4보다 2 작다고 합니다. 세 수의 합이 127일 때, 이 세 수를 각각 구하시오.", null, [{ label: "가" }, { label: "나" }, { label: "다" }], { mathPrompt: true }),
  Q(18, "동현이는 3일 동안 책 한 권을 모두 읽었습니다. 첫째 날에는 전체의 3/5보다 9쪽 적게 읽었고, 둘째 날에는 전체의 1/4을 읽었습니다. 또, 마지막 날에는 첫째 날 읽은 양의 1/3을 읽었습니다. 이 책의 쪽수를 구하시오.", null, { label: "답", unit: "쪽" }, { mathPrompt: true }),
  Q(19, "다음 방정식을 만족하는 자연수 x, y의 순서쌍 (x, y)를 모두 구하시오.", q19, subs(2)),
  Q(20, "다음을 계산한 값이 몇 자리 수인지 구하시오.", q20, subs(2, "자리 수")),
  Q(21, "계산 순서를 바꿔서 간편하게 계산하시오.", q21, subs(2)),
  Q(22, "다음 각 식을 전개하여 간단히 하시오.", q22, subs(2)),
  Q(23, "다음을 계산하시오.", q23),
  Q(24, "2^48−1은 60과 70 사이의 두 자연수에 의하여 나누어떨어집니다. 이 두 자연수를 구하시오.", null, { label: "답" }, { mathPrompt: true }),
  Q(25, "두 자연수 A, B의 합이 391이고, 최소공배수를 최대공약수로 나눈 몫이 60일 때, 순서쌍 (A, B)를 모두 구하시오. (단, A > B)", null, { label: "(A, B) =" }),
];
