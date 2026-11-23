// 2과정 A4 「마방진, 복면산과 비」 교재 유사문제 생성기. 약속은 G1~G5·A1~A3 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 작은 수를 하나씩 찾아 보는 방법(전수 탐색)으로 계산해 식이 틀려도 답이 틀리지 않게 한다.
// 분수는 글 속에 「3/5」로 쓰면 화면·인쇄에서 수식 분수로 바뀐다(math-markup.js mathText).
import { plainText } from "./course2-plain.js?v=20261122zi";
import { mathText } from "./math-markup.js?v=20261122w";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", YELLOW = "#fff1bf";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const DIGIT_BATCHIM = [true, true, false, true, false, false, true, true, true, false];
function hasBatchim(word) {
  const last = String(word).trim().slice(-1);
  if (/\d/.test(last)) return DIGIT_BATCHIM[Number(last)];
  const code = last.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 ? code % 28 !== 0 : false;
}
const josa = (word, withB, withoutB) => `${word}${hasBatchim(word) ? withB : withoutB}`;

function problem({ prompt, subtype, html, answer, solution, family, meta = {} }) {
  return { prompt, visual: { kind: "c2", subtype, html }, answer: String(answer), solution, meta: { family, answer, ...meta } };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const rect = (x, y, w, h, { fill = "none", color = INK, width = 1.6, rx = 0 } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
// 식 칠판 — SVG 글자로는 분수를 쌓을 수 없어 HTML + 공통 수식(math-markup)으로 그린다(빗금 분수 금지). 모양은 글 안 style(화면·인쇄 같음).
const board = (lines) => `<div class="c2-formula" role="img" aria-label="식" style="display:grid;gap:.55em;justify-items:center;padding:.7em 1.1em;margin:0 auto;max-width:100%;box-sizing:border-box;background:${SOFT};border:2px solid ${GREEN};border-radius:8px;color:${INK};font-weight:600;font-size:1.12em;line-height:1.5;text-align:center">${lines.map((t) => `<div>${mathText(esc(t))}</div>`).join("")}</div>`;

// ════ 3단원 배수와 약수 ════
// 1. 최대공약수 문장제 — 똑같이 나누어 주기 · 정사각형으로 자르기 · 나머지가 있는 나눗셈
function c2GcdWord({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "share" : sample(["share", "tile", "remainder"]);
  const g = randomInt(difficulty <= 1 ? 3 : 4, difficulty <= 1 ? 8 : 18);
  let a, b, c;
  do { a = g * randomInt(2, 9); b = g * randomInt(2, 9); c = g * randomInt(2, 9); } while (a === b || gcd(gcd(a / g, b / g), c / g) !== 1 || gcd(a / g, b / g) !== 1);
  if (kind === "tile") {
    return problem({
      prompt: `가로 ${a}cm, 세로 ${b}cm인 직사각형 종이를 남김없이 똑같은 크기의 정사각형으로 자르려고 합니다. 가장 큰 정사각형으로 자르면 한 변은 몇 cm이고, 모두 몇 장이 되나요?`,
      subtype: "gcd", html: svg(300, 150, rect(20, 20, Math.min(260, a * 3), Math.min(110, b * 3), { fill: YELLOW }) + text(150, 140, `${a}cm × ${b}cm`, { size: 14 }), "직사각형 종이"),
      answer: `${g}cm, ${(a / g) * (b / g)}장`,
      solution: `정사각형의 한 변은 ${a}와 ${b}를 모두 나누어떨어지게 해야 하니 공약수, 가장 크게는 최대공약수 ${g}cm입니다. 가로에 ${a / g}장, 세로에 ${b / g}장이라 ${a / g} × ${b / g} = ${(a / g) * (b / g)}장입니다.`,
      family: "c2-gcd", meta: { a, b, g }
    });
  }
  if (kind === "remainder") {
    const r1 = randomInt(1, g - 1), r2 = randomInt(1, g - 1);
    const x = a + r1, y = b + r2;
    // 답: x−r1, y−r2의 공약수 중 r1·r2보다 큰 것 가운데 가장 큰 수 = 그 최대공약수(g보다 클 수도 있으니 다시 계산)
    const gg = gcd(x - r1, y - r2);
    if (gg <= Math.max(r1, r2)) return c2GcdWord({ difficulty });
    return problem({
      prompt: `어떤 자연수로 ${x}를 나누면 나머지가 ${r1}이고, ${y}를 나누면 나머지가 ${r2}입니다. 이런 수 가운데 가장 큰 수는 무엇인가요?`,
      subtype: "gcd", html: board([`${x} − ${r1} = ${x - r1}`, `${y} − ${r2} = ${y - r2}`]), answer: gg,
      solution: `나머지를 빼면 나누어떨어집니다. ${x - r1}과 ${y - r2}의 공약수 가운데 가장 큰 수는 최대공약수 ${gg}이고, 나머지 ${Math.max(r1, r2)}보다 크므로 답은 ${gg}입니다.`,
      family: "c2-gcd", meta: { x, y, r1, r2, gg }
    });
  }
  const [p, q, s] = sample([["사과", "배", "귤"], ["공책", "연필", "지우개"], ["사탕", "초콜릿", "과자"]]);
  return problem({
    prompt: `${p} ${a}개, ${q} ${b}개, ${s} ${c}개를 될 수 있는 대로 많은 학생에게 남김없이 똑같이 나누어 주려고 합니다. 몇 명에게 나누어 줄 수 있나요?`,
    subtype: "gcd", html: board([`${a}, ${b}, ${c}의 최대공약수`]), answer: `${g}명`,
    solution: `학생 수는 ${a}, ${b}, ${c}를 모두 나누어떨어지게 하는 수(공약수)이고, 가장 많게는 최대공약수입니다. ${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}, ${c} = ${g} × ${c / g}이므로 ${g}명입니다.`,
    family: "c2-gcd", meta: { a, b, c, g }
  });
}

// 2. 최소공배수 문장제 — 동시에 출발 · 정육면체 쌓기 · 나누면 나머지가 같은 수
function c2LcmWord({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "bus" : sample(["bus", "cube", "remainder", "shortfall"]);
  if (kind === "remainder" || kind === "shortfall") {
    const ds = difficulty === 3 ? sample([[3, 4, 5], [4, 5, 6], [2, 3, 7], [3, 5, 6]]) : sample([[3, 4], [4, 6], [5, 6], [6, 8]]);
    const L = ds.reduce(lcm, 1);
    const r = kind === "remainder" ? randomInt(1, Math.min(...ds) - 1) : null;
    const lo = randomInt(1, 3) * 50;
    // 조건을 하나씩 확인하며 가장 작은 수를 찾는다
    let ans = null;
    for (let n = lo; n < lo + 2000; n += 1) {
      if (kind === "remainder" ? ds.every((d) => n % d === r) : ds.every((d) => (n + 1) % d === 0)) { ans = n; break; }
    }
    return problem({
      prompt: kind === "remainder"
        ? `${ds.join(", ")} 중 어느 수로 나누어도 나머지가 ${r}인 수 가운데 ${lo}보다 큰 가장 작은 수는 무엇인가요?`
        : `${ds.join(", ")} 중 어느 수로 나누어도 나누는 수보다 1 작은 수가 남는 수 가운데 ${lo}보다 큰 가장 작은 수는 무엇인가요?`,
      subtype: "lcm", html: board([`${ds.join(", ")}의 최소공배수 = ${L}`]), answer: ans,
      solution: kind === "remainder"
        ? `나머지 ${josa(r, "을", "를")} 빼면 ${ds.join(", ")}의 공배수가 됩니다. 최소공배수는 ${L}이므로 수는 ${L}의 배수 + ${r}입니다. ${lo}보다 큰 가장 작은 것은 ${ans}입니다.`
        : `1을 더하면 ${ds.join(", ")}로 모두 나누어떨어집니다. 최소공배수 ${L}의 배수에서 1을 뺀 수 가운데 ${lo}보다 큰 가장 작은 것은 ${ans}입니다.`,
      family: "c2-lcm", meta: { ds, L, ans }
    });
  }
  if (kind === "cube") {
    const [a, b, c] = sample([[4, 5, 2], [3, 4, 6], [2, 3, 5], [4, 6, 3], [5, 2, 4]]);
    const L = lcm(lcm(a, b), c);
    const n = (L / a) * (L / b) * (L / c);
    return problem({
      prompt: `가로 ${a}cm, 세로 ${b}cm, 높이 ${c}cm인 벽돌을 같은 방향으로 빈틈없이 쌓아 가장 작은 정육면체를 만들려고 합니다. 벽돌은 몇 개 필요한가요?`,
      subtype: "lcm", html: board([`정육면체 한 모서리 = ${a}, ${b}, ${c}의 최소공배수`]), answer: `${n}개`,
      solution: `정육면체의 한 모서리는 ${a}, ${b}, ${c}의 공배수이고 가장 작게는 최소공배수 ${L}cm입니다. 가로 ${L / a}개, 세로 ${L / b}개, 높이 ${L / c}층이라 ${L / a} × ${L / b} × ${L / c} = ${n}개입니다.`,
      family: "c2-lcm", meta: { a, b, c, L }
    });
  }
  const [a, b] = sample([[12, 18], [15, 20], [8, 12], [10, 15], [16, 24], [9, 12]]);
  const L = lcm(a, b), start = randomInt(6, 8);
  const at = (m) => `${Math.floor(start + m / 60)}시 ${m % 60 ? `${m % 60}분` : ""}`.trim();
  return problem({
    prompt: `터미널에서 ㉮ 버스는 ${a}분마다, ㉯ 버스는 ${b}분마다 떠납니다. 오전 ${start}시에 두 버스가 함께 떠났다면, 다음에 처음으로 함께 떠나는 시각은 언제인가요?`,
    subtype: "lcm", html: board([`${a}분, ${b}분 → 함께 떠나는 것은 공배수`]), answer: `오전 ${at(L)}`,
    solution: `함께 떠나는 때는 ${a}와 ${b}의 공배수만큼 지난 때입니다. 최소공배수는 ${L}분이므로 오전 ${start}시에서 ${L}분 뒤인 오전 ${at(L)}입니다.`,
    family: "c2-lcm", meta: { a, b, L }
  });
}

// 3. 기약분수의 개수 · 단위분수의 합
function c2UnitFraction({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "reduced" : sample(["reduced", "egypt"]);
  if (kind === "egypt") {
    // 1 − 1/a − 1/b가 단위분수가 되는 짝만 쓴다(서로 다른 분모)
    const target = sample([[2, 3], [2, 6], [3, 6], [2, 4]]);
    // 1/2 + 1/3 + 1/□ = 1 꼴 — 계산으로 □를 찾는다
    const [a, b] = target;
    const restNum = a * b - a - b, restDen = a * b;
    const ans = restDen / restNum;
    return problem({
      prompt: `1 = 1/${a} + 1/${b} + 1/□가 되도록 □에 알맞은 자연수를 구하세요.`,
      subtype: "unit-fraction", html: board([`1/${a} + 1/${b} = ${a + b}/${a * b}`]), answer: ans,
      solution: `1/${a} + 1/${b} = ${b}/${a * b} + ${a}/${a * b} = ${a + b}/${a * b}입니다. 1에서 빼면 ${restNum}/${restDen}이 남고 이것은 1/${ans}입니다.`,
      family: "c2-unit-fraction", meta: { a, b, ans }
    });
  }
  const d = sample(difficulty <= 1 ? [6, 8, 10, 12] : [12, 14, 15, 18, 20, 21, 24, 30]);
  const list = []; for (let n = 1; n < d; n += 1) if (gcd(n, d) === 1) list.push(n);
  return problem({
    prompt: `분모가 ${d}인 진분수 1/${d}, 2/${d}, …, ${d - 1}/${d} 가운데 기약분수는 몇 개인가요?`,
    subtype: "unit-fraction", html: board([`분자와 분모 ${d}의 공약수가 1뿐인 것`]), answer: `${list.length}개`,
    solution: `기약분수는 분자와 분모의 공약수가 1뿐인 분수입니다. ${d}와 공약수가 1뿐인 분자는 ${list.join(", ")}로 ${list.length}개입니다.`,
    family: "c2-unit-fraction", meta: { d, count: list.length }
  });
}

// 4. 연속한 세 자연수가 차례로 a·b·c의 배수일 때 가장 작은 수
function c2ConsecutiveMultiples({ difficulty = 2 }) {
  const triples = difficulty <= 1 ? [[2, 3, 4], [3, 2, 5], [2, 5, 3]] : [[3, 4, 5], [4, 5, 6], [5, 6, 7], [2, 7, 9], [3, 5, 7], [7, 8, 9]];
  const [a, b, c] = sample(triples);
  let n = 1; while (!(n % a === 0 && (n + 1) % b === 0 && (n + 2) % c === 0)) n += 1;
  return problem({
    prompt: `연속한 세 자연수 ㉠, ㉡, ㉢이 있습니다. ㉠은 ${a}의 배수, ㉡은 ${b}의 배수, ㉢은 ${c}의 배수입니다. 이런 세 수 가운데 ㉠이 가장 작을 때 ㉠, ㉡, ㉢을 구하세요.`,
    subtype: "consecutive", html: board([`㉠ = ${a}의 배수, ㉡ = ㉠ + 1, ㉢ = ㉠ + 2`]), answer: `${n}, ${n + 1}, ${n + 2}`,
    solution: `㉠을 ${a}의 배수로 차례로 놓고(${a}, ${2 * a}, ${3 * a}, …) ㉠ + 1이 ${b}의 배수, ㉠ + 2가 ${c}의 배수인지 확인합니다. 처음으로 맞는 것은 ${n}, ${n + 1}, ${n + 2}입니다.`,
    family: "c2-consecutive", meta: { a, b, c, n }
  });
}

// 5. 비와 최대공약수·최소공배수 — A : B = p : q, 최소공배수(최대공약수)가 주어질 때
function c2RatioGcdLcm({ difficulty = 2 }) {
  let p, q; do { p = randomInt(2, 9); q = randomInt(2, 9); } while (p === q || gcd(p, q) !== 1);
  const k = randomInt(2, difficulty <= 1 ? 6 : 15);
  const A = p * k, B = q * k;
  const kind = sample(["lcm", "gcd"]);
  const known = kind === "lcm" ? lcm(A, B) : gcd(A, B);
  return problem({
    prompt: `두 자연수 A, B의 비가 ${p} : ${q}이고, 두 수의 ${kind === "lcm" ? "최소공배수" : "최대공약수"}가 ${known}입니다. A와 B를 구하세요.`,
    subtype: "ratio-gcd", html: board([`A = ${p} × □, B = ${q} × □`]), answer: `A = ${A}, B = ${B}`,
    solution: `${p}와 ${q}는 공약수가 1뿐이므로 A = ${p} × □, B = ${q} × □에서 □가 최대공약수이고, 최소공배수는 ${p} × ${q} × □ = ${p * q} × □입니다. ${kind === "lcm" ? `${p * q} × □ = ${known}이니 □ = ${k}` : `□ = ${k}`}, A = ${A}, B = ${B}입니다.`,
    family: "c2-ratio-gcd", meta: { p, q, k }
  });
}

// ════ 4단원 비와 가정하여 풀기 ════
// 6. 모두 한 가지라고 가정하기 — 닭과 토끼 · 동전 · 맞히면 더하고 틀리면 빼는 점수
function c2AssumeSolve({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "legs" : sample(["legs", "coins", "quiz"]);
  if (kind === "quiz") {
    const n = randomInt(10, 25), plus = randomInt(4, 10), minus = randomInt(1, 4);
    const right = randomInt(Math.ceil(n / 2), n - 1), score = right * plus - (n - right) * minus;
    return problem({
      prompt: `문제 ${n}개를 모두 풀었습니다. 맞히면 ${plus}점을 얻고 틀리면 ${minus}점을 잃습니다. 점수가 ${score}점이라면 맞힌 문제는 몇 개인가요?`,
      subtype: "assume", html: board([`모두 맞혔다면 ${n * plus}점`]), answer: `${right}개`,
      solution: `모두 맞혔다고 가정하면 ${n * plus}점입니다. 한 문제를 틀릴 때마다 ${plus} + ${minus} = ${plus + minus}점씩 줄어듭니다. 줄어든 점수는 ${n * plus} − ${score} = ${n * plus - score}점이라 틀린 문제는 ${(n * plus - score) / (plus + minus)}개, 맞힌 문제는 ${right}개입니다.`,
      family: "c2-assume", meta: { n, plus, minus, right }
    });
  }
  const [x, y, ax, ay, unit, thing] = kind === "legs" ? sample([["닭", "토끼", 2, 4, "다리", "마리"], ["거미", "개미", 8, 6, "다리", "마리"], ["두발자전거", "세발자전거", 2, 3, "바퀴", "대"]])
    : sample([["100원짜리", "500원짜리", 100, 500, "원", "개"], ["50원짜리", "100원짜리", 50, 100, "원", "개"]]);
  const total = randomInt(8, difficulty === 3 ? 40 : 20), nx = randomInt(1, total - 1), ny = total - nx;
  const sum = nx * ax + ny * ay;
  const allX = total * ax;
  const what = kind === "legs" ? `${unit} 수` : "금액";
  return problem({
    prompt: kind === "legs"
      ? `${x}와 ${y}가 모두 ${total}${thing} 있고, ${unit}는 모두 ${sum}개입니다. ${y}는 몇 ${thing}인가요? (${x} 한 ${thing}의 ${unit} ${ax}개, ${y} ${ay}개)`
      : `${x}와 ${y} 동전이 모두 ${total}개 있고 금액은 ${sum}원입니다. ${y} 동전은 몇 개인가요?`,
    subtype: "assume", html: board([`모두 ${x}라면 ${what} ${allX}`]), answer: `${ny}${thing}`,
    solution: `모두 ${x}라고 가정하면 ${what}는 ${total} × ${ax} = ${allX}입니다. 실제보다 ${sum - allX}만큼 적고, ${x} 하나를 ${y}로 바꿀 때마다 ${ay - ax}씩 늘어나므로 ${y}는 ${sum - allX} ÷ ${ay - ax} = ${ny}${thing}입니다.`,
    family: "c2-assume", meta: { total, nx, ny }
  });
}

export const COURSE2_A4_GENERATORS = plainText({ c2GcdWord, c2LcmWord, c2UnitFraction, c2ConsecutiveMultiples, c2RatioGcdLcm, c2AssumeSolve });
export const COURSE2_A4_TYPE_ROWS = [
  ["c2-gcd-word", "number", "배수와 약수", "최대공약수 문장제", "c2GcdWord"],
  ["c2-lcm-word", "number", "배수와 약수", "최소공배수 문장제", "c2LcmWord"],
  ["c2-unit-fraction", "number", "배수와 약수", "기약분수의 개수와 단위분수의 합", "c2UnitFraction"],
  ["c2-consecutive-multiples", "number", "배수와 약수", "연속한 세 수가 차례로 배수일 때", "c2ConsecutiveMultiples"],
  ["c2-ratio-gcd-lcm", "number", "배수와 약수", "비와 최대공약수·최소공배수로 두 수 찾기", "c2RatioGcdLcm"],
  ["c2-assume-solve", "number", "가정하여 풀기", "모두 한 가지라고 가정하여 풀기", "c2AssumeSolve"]
];
export const COURSE2_A4_GUIDES = Object.freeze({
  "c2-gcd-word": "남김없이 똑같이 나누기·가장 큰 정사각형은 공약수 — 가장 크게는 최대공약수입니다.",
  "c2-lcm-word": "동시에 다시 만나기·가장 작은 정육면체는 공배수 — 가장 작게는 최소공배수입니다.",
  "c2-unit-fraction": "기약분수는 분자와 분모의 공약수가 1뿐인 분수입니다. 단위분수의 합은 분모를 같게 맞춥니다.",
  "c2-consecutive-multiples": "첫째 수를 그 배수로 차례로 놓아 보고 다음 두 수의 조건을 확인합니다.",
  "c2-ratio-gcd-lcm": "A = p × □, B = q × □로 놓으면 □가 최대공약수, p × q × □가 최소공배수입니다.",
  "c2-assume-solve": "모두 한 가지라고 가정해 계산한 값과 실제 값의 차를, 하나 바꿀 때 변하는 양으로 나눕니다."
});
