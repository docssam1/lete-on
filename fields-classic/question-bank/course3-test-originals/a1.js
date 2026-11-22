// 3과정 A1 「나머지정리와 지렛대의 원리」 권별 테스트 — 드라이브 원문(3과정-A1N 테스트, 25문항)을 우리 시험지 꼴로 다시 짠 것(원장 2026-11-15).
// 원문 문항을 본책 네 단원(나머지정리 · 번분수와 부분분수 · 수직선과 연비 · 지렛대의 원리)의 활동·문제와 견주어
// 본책 단원과 맞는 것을 확인하고 옮겼다(파일 이름이 아니라 내용으로 확인 — N20 판(210804) 본책. N10 판(200902)도 단원·활동 차례가 같다).
// 단원: 1~6번·25번 나머지정리(몫과 나머지가 같은 수 · 최소공배수와 나머지 · 둥글게 앉은 사람 · 큰 수의 나머지)
//       · 7~12번 번분수와 부분분수(단위분수의 합 · 연분수 · 번분수 · 부분분수의 합)
//       · 13~18번 수직선과 연비(연비 · 최대공약수, 최소공배수와 비) · 19~24번 지렛대의 원리(평균 · 농도).
// 글·수·배치는 원문 그대로. 분수·연분수·번분수·대분수는 math-markup.js로 위아래로 쌓는다(빗금 그대로 두지 않는다).
// 원문과 다른 곳: 6번 「n+11가」의 토씨를 「n+11이」로 바로잡았다. 15번 조건 세 줄은 종이색 상자에 담았다.
// 정답은 여기 두지 않는다(비공개 자리에만).
import { UT, esc } from "../selection-test-originals/kit.js?v=20261114a";
import { mathText, expr, part, rowPart, mixed } from "../math-markup.js?v=20261122i";

export const perPage = 4;
export const meta = { course: "3과정", book: "A1", title: "나머지정리와 지렛대의 원리" };

// ── 글로 쓰는 그림 칸((1)(2) 물음 · 상자)
const SERIF = "font-family:'FC Serif',serif;color:#191511;word-break:keep-all";
const size = (min, cq, max) => `font-size:clamp(${min}px,${cq}cqw,${max}px)`;
const math = (value) => mathText(esc(value));
// (1)(2) 물음 줄 — 글(빗금 분수는 mathText) 또는 이미 만든 수식(html)
function subs(rows, { gap = 18, big = true } = {}) {
  const body = rows.map((row) => {
    const value = typeof row === "string" ? math(row) : row.html;
    return `<p style="margin:0;padding-left:2.1em;text-indent:-2.1em;${SERIF};${big ? size(13, 4.8, 18) : size(12, 4.2, 16)};line-height:1.9">${value}</p>`;
  }).join("");
  return `<div style="display:flex;flex-direction:column;gap:${gap}px;width:100%;padding:8px 0 0 6%">${body}</div>`;
}
// 종이색 상자(원문의 색 상자 자리)
const panel = (rows, { align = "center", width = 420 } = {}) =>
  `<div style="width:100%;padding-top:10px"><div style="width:min(100%,${width}px);margin:0 auto;padding:10px 14px;border:1.5px solid ${UT.soft};border-radius:8px;background:#fdfbf5;text-align:${align};${SERIF};${size(11, 3.9, 14.5)};line-height:1.8">${rows.map((row) => `<div style="${row.startsWith("● ") ? "padding-left:1.1em;text-indent:-1.1em" : ""}">${math(row)}</div>`).join("")}</div></div>`;
const sub = (label, formula) => ({ html: `${label} ${formula}` });
// 긴 합: 두 줄로 나눠 쓰고(줄마다 끊기지 않게) 둘째 줄은 들여 쓴다
const longSum = (label, first, second) => ({ html: `${label} <span style="white-space:nowrap">${math(first)}</span><br><span style="display:inline-block;padding-left:1.4em;white-space:nowrap">${math(second)}</span>` });

// ── 7~12번 번분수와 부분분수
const q7 = () => subs([
  { html: `(1) ${math("7/18")}<span style="display:inline-block;width:4em"></span>(2) ${math("7/9")}` },
]);
// 8. 연분수
const q8 = () => subs([
  sub("(1)", expr(part(7, 9), "=", part(1, rowPart("a", "+", part(1, rowPart("b", "+", part(1, "c"))))))),
  sub("(2)", expr(part(11, 31), "=", part(1, rowPart("a", "+", part(1, rowPart("b", "+", part(1, rowPart("c", "+", part(1, "d"))))))))),
], { gap: 26 });
// 9. 번분수
const q9 = () => subs([
  sub("(1)", expr(part(1, rowPart(3, "+", part(1, rowPart(4, "+", part(1, 5))))))),
  sub("(2)", expr(part(rowPart(1, "−", part(1, rowPart(1, "+", part(1, 3)))), rowPart(1, "+", part(1, rowPart(1, "−", part(1, 3))))))),
], { gap: 26 });
const q10 = () => subs([
  "(1) 1/2 + 1/6 + 1/12 + 1/20 + … + 1/240",
  longSum("(2)", "1/(3×5) + 1/(5×7) + 1/(7×9) + 1/(9×11)", "+ … + 1/(43×45)"),
], { gap: 22, big: false });
const q11 = () => subs([
  "(1) 1/3 − 7/12 + 9/20 − 11/30 + 13/42 − 15/56 + 17/72",
  sub("(2)", expr(mixed(4, 1, 3), "−", mixed(2, 8, 15), "+", mixed(2, 12, 35), "−", mixed(3, 16, 63), "+", part(20, 99))),
], { gap: 22, big: false });
const q12 = () => subs([
  longSum("(1)", "2/(1×2×3) + 2/(2×3×4) + 2/(3×4×5)", "+ … + 2/(13×14×15)"),
  longSum("(2)", "1/(1×3) + 1/(2×4) + 1/(3×5) + 1/(4×6)", "+ … + 1/(17×19) + 1/(18×20)"),
], { gap: 22, big: false });

// ── 15번 조건 상자
const q15 = () => panel([
  "● 사과 2개의 값은 귤 7개의 값과 같습니다.",
  "● 배 3개의 값은 사과 5개의 값과 같습니다.",
  "● 배 1개의 값은 귤 1개의 값보다 1450원 비쌉니다.",
], { align: "left", width: 440 });

// ── 25번 식 상자
const q25 = () => panel(["24×25×26×27 + 32×36 − 100"], { width: 300 });

const Q = (number, prompt, figure = null, answer = { label: "답" }) => ({ number, prompt, figure, answer, mathPrompt: true });
const two = [{ label: "(1)" }, { label: "(2)" }];
export const questions = [
  Q(1, "100보다 큰 자연수 중에서 25로 나눈 몫과 나머지가 같은 수는 모두 몇 개입니까?", null, { label: "답", unit: "개" }),
  Q(2, "3으로 나누면 1이 남고, 5로 나누면 3이 남고, 8로 나누면 6이 남는 자연수들 중에서 가장 작은 수를 구하시오."),
  Q(3, "어떤 자연수를 7로 나누면 5가 남고, 8로 나누면 3이 남습니다. 이러한 자연수 중에서 가장 작은 세 자리 수를 구하시오."),
  Q(4, "연속된 세 자연수 ㉠, ㉡, ㉢이 있습니다. ㉠은 9의 배수, ㉡은 7의 배수, ㉢은 5의 배수라고 할 때, 가장 작은 세 자연수 ㉠, ㉡, ㉢을 각각 구하시오. (단, ㉠ < ㉡ < ㉢)", null, [{ label: "㉠" }, { label: "㉡" }, { label: "㉢" }]),
  Q(5, "60명의 사람들이 둥글게 둘러 앉아 있다. 1 → 9 → 17 → 25 → …의 규칙으로 해당 번호의 사람들에게 계속해서 선물을 주기로 한다면, 영원히 선물을 받을 수 없는 사람들은 모두 몇 명인가?", null, { label: "답", unit: "명" }),
  Q(6, "자연수 n에 대하여 n+17이 11의 배수, n+11이 17의 배수일 때, n의 최솟값을 구하시오."),
  Q(7, "분모의 약수를 이용하여 다음 분수를 단위분수의 합으로 나타내시오.", q7, two),
  Q(8, "다음 분수식에서 a, b, c, d에 알맞은 값을 구하시오.", q8, two),
  Q(9, "다음 번분수 식을 계산하시오.", q9, two),
  Q(10, "다음 분수를 계산하시오.", q10, two),
  Q(11, "다음 분수를 계산하시오.", q11, two),
  Q(12, "다음 분수를 계산하시오.", q12, two),
  Q(13, "세 수 ㉠, ㉡, ㉢이 있는데, 수 ㉠의 4배는 수 ㉡의 3배와 같고, 수 ㉡의 4배는 수 ㉢의 5배와 같습니다. 세 수 ㉠, ㉡, ㉢의 합이 102일 때, 수 ㉡의 값을 구하시오."),
  Q(14, "가는 나의 3/8이고, 나는 다의 60%입니다. 가 : 나 : 다를 가장 작은 자연수의 비로 나타내시오.", null, { label: "가 : 나 : 다 =" }),
  Q(15, "귤, 사과, 배의 값을 비교해 보니 다음과 같습니다. 귤 1개의 값은 얼마입니까?", q15, { label: "답", unit: "원" }),
  Q(16, "두 자연수 A, B의 최소공배수가 80이고, (A)/(B) = (A−12)/(B−15)일 때, 자연수 A, B는 각각 얼마입니까?", null, [{ label: "A =" }, { label: "B =" }]),
  Q(17, "6 : 7 : 8인 세 개의 자연수가 있습니다. 세 자연수의 최대공약수와 최소공배수의 합이 845일 때, 세 자연수를 구하시오."),
  Q(18, "㉮, ㉯, ㉰ 세 종류의 컵이 있습니다. 커다란 물통에 물을 붓는데 ㉮ 컵으로 2번 부은 양과 ㉯ 컵으로 3번 부은 양이 같고, 또 ㉯ 컵으로 4번 부은 양은 ㉰ 컵으로 5번 부은 양과 같습니다. ㉮ 컵으로 4번, ㉯ 컵으로 5번, ㉰ 컵으로 6번 부었더니 1580mL가 되었다면 ㉮ 컵은 몇 mL짜리 컵이겠습니까?", null, { label: "답", unit: "mL" }),
  Q(19, "갑이 수학 시험에서 4회까지의 평균 점수는 75점이고, 5회까지의 평균 점수는 78점이라면 5회째 몇 점을 받은 것입니까?", null, { label: "답", unit: "점" }),
  Q(20, "전체 학생 수가 40명인 학급에서 수학 시험을 보았습니다. 여학생의 평균 점수는 78점이고, 남학생의 평균 점수는 83점이며, 반 전체의 평균 점수는 80점입니다. 이 반의 남학생 수를 구하시오.", null, { label: "답", unit: "명" }),
  Q(21, "남학생이 20명, 여학생이 25명인 한 반의 수학 시험에서 남학생의 평균 점수가 여학생의 평균 점수보다 9점이 더 높고, 전체 평균 점수가 76점일 때, 남학생의 평균 점수를 구하시오.", null, { label: "답", unit: "점" }),
  Q(22, "어느 시험에서 합격자 수와 불합격자 수의 비는 3 : 8입니다. 합격자의 평균이 80점이고, 응시생 전체의 평균이 64점일 때, 불합격자의 평균을 구하시오.", null, { label: "답", unit: "점" }),
  Q(23, "6%의 소금물과 11%의 소금물을 섞어서 8%의 소금물 240g을 만들었습니다. 6%의 소금물은 몇 g을 넣었는지 구하시오.", null, { label: "답", unit: "g" }),
  Q(24, "3%, 4%, 5%인 소금물의 총량이 500g입니다. 이것을 모두 섞으면 4.2%의 소금물이 되고, 4%와 5%의 소금물을 섞으면 4.6%의 소금물이 된다고 합니다. 3%, 4%, 5%인 소금물의 양을 각각 구하시오.", null, [{ label: "3%", unit: "g" }, { label: "4%", unit: "g" }, { label: "5%", unit: "g" }]),
  Q(25, "다음 수를 72로 나누었을 때, 나머지를 구하시오.", q25),
];
