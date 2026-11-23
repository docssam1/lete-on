// 3과정 A2 「순환소수와 수직선좌표」 권별 테스트 — 드라이브 원문(3과정-A2N 테스트, 25문항)을 우리 시험지 꼴로 다시 짜고(원장 2026-11-15),
// 신판 본책(N20 「순환소수와 수직선좌표」, 220209)의 네 단원에 맞췄다(파일 이름이 아니라 내용으로 확인).
// 원문 19~24번(자연수 해 순서쌍 · 거듭제곱의 자리 수 · 계산 순서 바꾸기 · 식의 전개 · 분수식 계산 · 2⁴⁸−1의 약수)은 본책 단원·리뷰문제 어디에도 같은 꼴이 없고,
// 본책 4단원(수직선좌표와 절댓값)은 원문에 문항이 없어서, 그 여섯 문항을 빼고 4단원 문항 여섯(20~25번)을 본책 활동·확인·연습문제 꼴에서 수만 바꿔 새로 냈다.
// 원문 25번(최대공약수·최소공배수)은 단원 차례에 맞게 13번으로 옮기고, 원문 13~18번은 14~19번이 되었다.
// 단원: 1~6번 유한소수와 순환소수(순환소수 · 11·99의 배수 판정법 · 약수의 개수) · 7~13번 최대공약수와 최소공배수
//       · 14~19번 상대속도와 따라잡기(일차방정식의 활용 · 미지수를 정하는 규칙)
//       · 20~25번 수직선좌표와 절댓값(새로 냄 — 20번 수직선좌표 · 21·22번 수직선좌표와 내분점 · 23·24번 수직선좌표와 절댓값 · 25번 절댓값이 있는 방정식).
// 3·4·5·6·7·9·10·11·13·16·17·18·19번은 본책 연습문제의 수만 바꾼 원문 문항이다. 1~19번의 글·수·배치는 원문 그대로.
// 분수는 빗금으로 적고 화면이 mathText로 위아래로 쌓는다. 순환소수의 점은 숫자 위에 둥근 점(HTML)으로, 식은 MathML 한 줄 수식으로, 수직선은 SVG로 그린다.
// 원문에서 고친 것: 3번 「2b34a7가」→「2b34a7이」, 11번 「175을」→「175를」, 16번(원문 15번) 「두 사람을 속력을」→「두 사람의 속력을」, 12번 끝 마침표, 띄어쓰기.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc, svg, text, line } from "../selection-test-originals/kit.js?v=20261114a";
import { mathText, mixed, expr, powPart } from "../math-markup.js?v=20261122w";

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

// ── 20~25번(수직선좌표와 절댓값)
const it = (value) => `<tspan font-style="italic">${esc(value)}</tspan>`;
// 수직선(양쪽 화살표)
const axis = (x1, x2, y) => `${line(x1, y, x2, y, { width: 1.5 })}<path d="M${x1 + 7} ${y - 4.5} L${x1} ${y} L${x1 + 7} ${y + 4.5}M${x2 - 7} ${y - 4.5} L${x2} ${y} L${x2 - 7} ${y + 4.5}" fill="none" stroke="${UT.ink}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`;
const tick = (x, y) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${UT.ink}"/>`;
// 그림 속 글(이탤릭 조각이 섞인 것) — parts: 문자열 또는 it()
const label = (x, y, parts, size = 15) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;font-weight:600;fill:${UT.ink};text-anchor:middle;dominant-baseline:central">${parts.map((p) => (p.startsWith("<tspan") ? p : esc(p))).join("")}</text>`;
// 그림 속 분수(부호 · 분자 · 가로줄 · 분모)
const sfrac = (x, y, num, den, sign = "") => `${sign ? text(x - 13, y, sign, { size: 15, weight: 600 }) : ""}${text(x, y - 10, num, { size: 14, weight: 600 })}${line(x - 8, y, x + 8, y, { width: 1.3 })}${text(x, y + 10, den, { size: 14, weight: 600 })}`;
// 두 점을 잇는 점선 호 + 비의 수
const arc = (x1, x2, y, value) => `<path d="M${x1 + 8} ${y} Q${(x1 + x2) / 2} ${y - 40} ${x2 - 8} ${y}" fill="none" stroke="${UT.purple}" stroke-width="1.5" stroke-dasharray="4 3"/>${text((x1 + x2) / 2, y - 34, value, { size: 15, fill: UT.purple })}`;
const overline = (value) => `<span style="font-style:italic;border-top:1.2px solid currentColor;padding-top:1px">${esc(value)}</span>`;

// 21. A(a+1) — P(−2) — B(a+15), (선분 AP) : (선분 PB) = 3 : 4
function q21() {
  const y = 78, A = 70, P = 205, B = 385;
  const body = axis(24, 436, y) + arc(A, P, y - 30, "3") + arc(P, B, y - 30, "4")
    + [[A, "A"], [P, "P"], [B, "B"]].map(([x, n]) => tick(x, y) + text(x, y - 17, n, { size: 15, weight: 600 })).join("")
    + label(A, y + 22, ["(", it("a"), " + 1)"]) + label(P, y + 22, ["−2"]) + label(B, y + 22, ["(", it("a"), " + 15)"]);
  return topOnly(svg(460, 112, "수직선 위의 점 A(a+1), P(−2), B(a+15)와 선분 AP, PB의 길이의 비 3 대 4", body, 460));
}
// 22. A(−5/6), B(3/2), 중점 M, 1 : 3으로 내분하는 점 N
function q22() {
  const y = 50, A = 70, B = 390, N = A + (B - A) / 4, M = (A + B) / 2;
  const body = axis(24, 436, y)
    + [[A, "A"], [N, "N"], [M, "M"], [B, "B"]].map(([x, n]) => tick(x, y) + text(x, y - 17, n, { size: 15, weight: 600 })).join("")
    + sfrac(A, y + 34, "5", "6", "−") + sfrac(B, y + 34, "3", "2");
  return topOnly(svg(460, 108, "수직선 위의 점 A(음수 6분의 5), N, M, B(2분의 3)", body, 460));
}
const q23 = () => withSubs("", [
  sub("(1)", alg("| −2 x + 1 | = 9")),
  sub("(2)", `${alg("A ( x − 2 ) , B ( 2 x + 1 )")}&nbsp; (${overline("AB")} = 4)`),
]);
const q25 = () => withSubs("", [sub("(1)", alg("| x + 3 | + | x − 4 | = 11")), sub("(2)", alg("| x + 2 | − | x − 6 | = 4"))]);

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
  Q(13, "두 자연수 A, B의 합이 391이고, 최소공배수를 최대공약수로 나눈 몫이 60일 때, 순서쌍 (A, B)를 모두 구하시오. (단, A > B)", null, { label: "(A, B) =" }),
  Q(14, "학수는 친구들에게 사탕을 나누어 주려고 합니다. 7개씩 나누어 주려고 하였더니 3개가 모자라서 5개씩 나누어 주었더니 9개가 남았다고 합니다. 사탕은 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(15, "다인이네 반 학생들이 사탕을 나눠 가지기로 하였습니다. 2명이 결석하면 9개씩 가질 수 있고, 2명이 새로 들어오면 5개씩 가질 수 있다고 할 때, 사탕은 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(16, "둘레의 길이가 3.6km인 호수 주변에 산책로가 있습니다. 산책로의 입구에서 A, B 두 사람이 동시에 서로 반대 방향으로 걸어가면 30분 후에 만나고, 같은 방향으로 걸어가면 1시간 30분 만에 만납니다. A가 B보다 빠르다고 할 때, A, B 두 사람의 속력을 각각 구하시오.", null, [{ label: "A" }, { label: "B" }]),
  Q(17, "준경이가 필기도구를 사려고 하는데, 샤프는 연필보다 400원이 비싸다. 준경이가 가진 돈으로 샤프를 사면 10개를 살 수 있고, 연필을 사면 14개를 남는 돈 없이 살 수 있다고 합니다. 준경이가 가진 돈은 얼마입니까?", null, { label: "답", unit: "원" }),
  Q(18, "세 수 가, 나, 다가 있습니다. 가는 나의 2배보다 3 크고, 나는 다의 3/4보다 2 작다고 합니다. 세 수의 합이 127일 때, 이 세 수를 각각 구하시오.", null, [{ label: "가" }, { label: "나" }, { label: "다" }], { mathPrompt: true }),
  Q(19, "동현이는 3일 동안 책 한 권을 모두 읽었습니다. 첫째 날에는 전체의 3/5보다 9쪽 적게 읽었고, 둘째 날에는 전체의 1/4을 읽었습니다. 또, 마지막 날에는 첫째 날 읽은 양의 1/3을 읽었습니다. 이 책의 쪽수를 구하시오.", null, { label: "답", unit: "쪽" }, { mathPrompt: true }),
  Q(20, "수직선 위의 3으로부터 양의 방향으로 2a+1만큼 간 점 A와 음의 방향으로 −3a+4만큼 간 점 B 사이의 거리가 9일 때, a의 값을 모두 구하시오.", null, { label: "a =" }),
  Q(21, "수직선 위의 세 점 A, P, B에 대하여 선분 AP와 선분 PB의 길이의 비가 다음 그림과 같을 때, a의 값을 구하시오.", q21, { label: "a =" }),
  Q(22, "수직선 위의 두 점 A, B에 대하여 두 점 A, B에서 같은 거리에 있는 점을 M이라 하고, 선분 AB를 1 : 3으로 내분하는 점을 N이라 할 때, 두 점 M, N 사이의 거리를 구하시오.", q22),
  Q(23, "주어진 조건이 성립하도록 x의 값을 모두 구하시오.", q23, subs(2)),
  Q(24, "−11/2보다 −3만큼 작은 수를 A, 7보다 5/2만큼 큰 수를 B라 할 때, A ≤ x ≤ B인 정수 x는 몇 개입니까?", null, { label: "답", unit: "개" }, { mathPrompt: true }),
  Q(25, "다음 절댓값 기호가 있는 방정식을 푸시오.", q25, subs(2)),
];
