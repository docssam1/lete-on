// 2과정 A2 「복제수와 님게임」 교재 유사문제 생성기. 약속은 G1~G5·A1 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 문제를 만든 수에서 계산한다. 큰 수는 BigInt로 셈한다.
// 거듭제곱은 글 속에 「2^5」로 쓰면 화면·인쇄에서 수식으로 바뀐다(math-markup.js mathText).
import { plainText } from "./course2-plain.js?v=20261122zi";
import { mathText } from "./math-markup.js?v=20261122w";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
const circle = (x, y, r, { fill = "none", color = INK, width = 1.8 } = {}) =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
// 글 한 줄을 판에 얹은 그림(식·수 늘어놓기)
// 식 칠판 — SVG 글자로는 분수를 쌓을 수 없어 HTML + 공통 수식(math-markup)으로 그린다(빗금 분수 금지). 모양은 글 안 style(화면·인쇄 같음).
const board = (lines) => `<div class="c2-formula" role="img" aria-label="식" style="display:grid;gap:.55em;justify-items:center;padding:.7em 1.1em;margin:0 auto;max-width:100%;box-sizing:border-box;background:${SOFT};border:2px solid ${GREEN};border-radius:8px;color:${INK};font-weight:600;font-size:1.12em;line-height:1.5;text-align:center">${lines.map((t) => `<div>${mathText(esc(t))}</div>`).join("")}</div>`;

// ════ 1단원 10의 거듭제곱과 복제수 ════
// 1. 2와 5의 거듭제곱 — 끝자리 0의 개수와 몇 자리 수
function c2PowerTenZeros({ difficulty = 2 }) {
  const a = randomInt(2, difficulty <= 1 ? 6 : 12), b = randomInt(2, difficulty <= 1 ? 6 : 12);
  if (a === b && difficulty > 1) return c2PowerTenZeros({ difficulty });
  const value = 2n ** BigInt(a) * 5n ** BigInt(b);
  const zeros = Math.min(a, b);
  const rest = a > b ? 2n ** BigInt(a - b) : 5n ** BigInt(b - a);
  const digits = String(value).length;
  const kind = difficulty <= 1 ? "zeros" : sample(["zeros", "digits"]);
  const expr = `2^${a} × 5^${b}`;
  const restText = a === b ? "1" : a > b ? `2^${a - b} = ${rest}` : `5^${b - a} = ${rest}`;
  return problem({
    prompt: kind === "zeros" ? `${josa(expr, "을", "를")} 계산하면 끝자리에 0이 몇 개 이어지나요?` : `${josa(expr, "을", "를")} 계산한 수는 몇 자리 수인가요?`,
    subtype: "power-ten", html: board([`${expr} = □`]), answer: kind === "zeros" ? `${zeros}개` : `${digits}자리`,
    solution: `2 × 5 = 10이 되도록 짝을 지으면 ${zeros}쌍이 되어 ${josa(`10^${zeros}`, "이", "가")} 나옵니다. 남는 것은 ${restText}이므로 ${expr} = ${rest} × 10^${zeros} = ${comma(value)}입니다. `
      + (kind === "zeros" ? `끝의 0은 ${zeros}개입니다.` : `${rest}의 ${String(rest).length}자리 뒤에 0이 ${zeros}개 붙어 ${digits}자리입니다.`),
    family: "c2-power-ten", meta: { a, b, zeros, digits }
  });
}

// 2. 9, 99, 999 …와의 곱 — 10의 거듭제곱에서 빼기
function c2NinesProduct({ difficulty = 2 }) {
  const k = randomInt(2, difficulty <= 1 ? 3 : 6);
  const nines = BigInt("9".repeat(k));
  const n = BigInt(randomInt(difficulty <= 1 ? 2 : 11, difficulty <= 1 ? 9 : difficulty === 2 ? 99 : 999));
  const product = n * nines;
  const kind = difficulty <= 1 ? "value" : sample(["value", "value", "count9"]);
  if (kind === "count9") {
    const m = randomInt(3, 9);
    const big = BigInt("9".repeat(m)) * BigInt("9".repeat(m));
    const count = String(big).split("").filter((d) => d === "9").length;
    return problem({
      prompt: `${"9".repeat(m)} × ${"9".repeat(m)}를 계산하면 숫자 9가 모두 몇 번 나오나요?`,
      subtype: "nines", html: board([`99 × 99 = 9801`, `999 × 999 = 998001`, `${"9".repeat(m)} × ${"9".repeat(m)} = ?`]), answer: `${count}번`,
      solution: `9 × 9 = 81, 99 × 99 = 9801, 999 × 999 = 998001처럼 앞에 9가 (자릿수 − 1)개, 가운데 8, 0이 (자릿수 − 1)개, 끝에 1이 옵니다. ${m}자리이면 9는 ${m - 1}번 나옵니다(${comma(big)}).`,
      family: "c2-nines", meta: { m, count }
    });
  }
  return problem({
    prompt: `${n} × ${"9".repeat(k)}를 간편하게 계산하세요.`,
    subtype: "nines", html: board([`${"9".repeat(k)} = 1${"0".repeat(k)} − 1`]), answer: comma(product),
    solution: `${"9".repeat(k)} = 1${"0".repeat(k)} − 1이므로 ${n} × 1${"0".repeat(k)} − ${n} = ${comma(n * 10n ** BigInt(k))} − ${n} = ${comma(product)}입니다.`,
    family: "c2-nines", meta: { n: Number(n), k }
  });
}

// 3. 복제수의 곱과 수 피라미드 — 11 × 11 = 121, 111 × 111 = 12321 · 11 곱하기
function c2RepunitSquare({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "eleven" : sample(["pyramid", "eleven", "repunit"]);
  if (kind === "eleven") {
    const n = randomInt(difficulty <= 1 ? 12 : 23, difficulty <= 1 ? 45 : 98);
    return problem({
      prompt: `${n} × 11을 11 = 10 + 1로 바꾸어 계산하세요.`,
      subtype: "repunit", html: board([`${n} × 11 = ${n} × 10 + ${n} × 1`]), answer: comma(n * 11),
      solution: `${n} × 10 = ${n * 10}, ${n} × 1 = ${n}이므로 ${n * 10} + ${n} = ${comma(n * 11)}입니다. 두 자리 수라면 두 숫자 사이에 두 숫자의 합을 넣은 것과 같습니다.`,
      family: "c2-repunit", meta: { n }
    });
  }
  const m = randomInt(3, difficulty === 3 ? 9 : 6);
  const r = BigInt("1".repeat(m));
  if (kind === "pyramid") {
    const value = r * r;
    return problem({
      prompt: `11 × 11 = 121, 111 × 111 = 12321처럼 1로만 된 수를 제곱하는 규칙을 찾아 ${"1".repeat(m)} × ${"1".repeat(m)}의 값을 구하세요.`,
      subtype: "repunit", html: board(["1 × 1 = 1", "11 × 11 = 121", "111 × 111 = 12321", `${"1".repeat(m)} × ${"1".repeat(m)} = ?`]), answer: comma(value),
      solution: `1부터 ${m}까지 올라갔다가 다시 1까지 내려오는 수가 됩니다(받아올림이 없을 때까지). ${"1".repeat(m)} × ${"1".repeat(m)} = ${comma(value)}입니다.`,
      family: "c2-repunit", meta: { m }
    });
  }
  // 123…m × 9 + (m + 1) = 1이 (m + 1)개인 수
  const lead = Array.from({ length: Math.min(m, 8) }, (_, i) => i + 1).join("");
  const mm = lead.length, result = "1".repeat(mm + 1);
  return problem({
    prompt: `1 × 9 + 2 = 11, 12 × 9 + 3 = 111처럼 규칙을 이어 갈 때 ${lead} × 9 + ${mm + 1}의 값을 구하세요.`,
    subtype: "repunit", html: board(["1 × 9 + 2 = 11", "12 × 9 + 3 = 111", "123 × 9 + 4 = 1111"]),
    answer: comma(result),
    solution: `곱하는 수가 1, 12, 123 …으로 한 자리씩 늘 때마다 결과의 1도 하나씩 늘어납니다. ${lead} × 9 = ${comma(Number(lead) * 9)}이고 ${josa(mm + 1, "을", "를")} 더하면 ${comma(result)}입니다.`,
    family: "c2-repunit", meta: { m: mm }
  });
}

// 4. 짝을 지어 10, 100, 1000 만들기 — 2 × 5, 4 × 25, 8 × 125
function c2SmartRegroup({ difficulty = 2 }) {
  // 교재 활동 3: 덧셈은 합이 100·1000이 되는 수끼리, 같은 수를 곱한 덧셈은 묶어서(★ × □ + ★ × △ = ★ × (□ + △)) 100·1000을 만든다
  const way = sample(["mult", "mult", "distribute", "addpair"]);
  if (way === "distribute") {
    const target = difficulty <= 1 ? 100 : sample([100, 1000]);
    const k = randomInt(12, difficulty === 3 ? 999 : 99);
    const b = difficulty <= 1 ? sample([1, randomInt(2, 9)]) : randomInt(1, target === 100 ? 19 : 199);
    const a = target - b;
    const expr = b === 1 ? `${k} × ${a} + ${k}` : `${k} × ${a} + ${k} × ${b}`;
    return problem({
      prompt: `${josa(expr, "을", "를")} 간편하게 계산하세요.`,
      subtype: "regroup", html: board([expr]), answer: comma(k * target),
      solution: `같은 수 ${josa(k, "을", "를")} 곱한 두 수를 묶으면 ${k} × (${a} + ${b}) = ${k} × ${target} = ${comma(k * target)}입니다.`,
      family: "c2-regroup", meta: { k, a, b, target }
    });
  }
  if (way === "addpair") {
    const t1 = difficulty <= 1 ? 100 : sample([100, 1000]), t2 = difficulty <= 1 ? 10 : 100;
    const a = randomInt(Math.round(t1 * 0.15), Math.round(t1 * 0.85)), c = randomInt(Math.round(t2 * 0.15), Math.round(t2 * 0.85));
    const b = t1 - a, d = t2 - c;
    const expr = `${a} + ${c} + ${b} + ${d}`;
    return problem({
      prompt: `${josa(expr, "을", "를")} 순서를 바꾸어 간편하게 계산하세요.`,
      subtype: "regroup", html: board([expr]), answer: comma(t1 + t2),
      solution: `덧셈은 순서를 바꾸어도 값이 같습니다. ${a} + ${b} = ${t1}, ${c} + ${d} = ${t2}를 먼저 더하면 ${t1} + ${t2} = ${comma(t1 + t2)}입니다.`,
      family: "c2-regroup", meta: { a, b, c, d }
    });
  }
  const pair = sample(difficulty <= 1 ? [[2, 5], [4, 25]] : [[2, 5], [4, 25], [8, 125], [16, 625]]);
  const other = randomInt(difficulty <= 1 ? 3 : 11, difficulty <= 1 ? 19 : 99);
  const scale = difficulty === 3 ? sample([2, 3, 4, 6]) : 1;
  const left = pair[0] * scale;
  const total = left * other * pair[1];
  const kind = sample(["product", "quotient"]);
  if (kind === "quotient") {
    const n = randomInt(2, 9) * (pair[0] * pair[1]);
    const q = n / pair[1];
    return problem({
      prompt: `${n} ÷ ${pair[1]}를 ${pair[1]} × ${pair[0]} = ${pair[0] * pair[1]}을 이용하여 간편하게 계산하세요.`,
      subtype: "regroup", html: board([`${n} ÷ ${pair[1]} = (${n} × ${pair[0]}) ÷ ${pair[0] * pair[1]}`]), answer: q,
      solution: `나누는 수와 나뉘는 수에 똑같이 ${pair[0]}를 곱해도 몫은 같습니다. ${n} × ${pair[0]} = ${n * pair[0]}, ${n * pair[0]} ÷ ${pair[0] * pair[1]} = ${q}입니다.`,
      family: "c2-regroup", meta: { n, pair }
    });
  }
  return problem({
    prompt: `${left} × ${other} × ${pair[1]}를 계산 순서를 바꾸어 간편하게 계산하세요.`,
    subtype: "regroup", html: board([`${left} × ${other} × ${pair[1]} = ${other} × (${left} × ${pair[1]})`]), answer: comma(total),
    solution: `곱셈은 순서를 바꾸어도 값이 같습니다. ${left} × ${pair[1]} = ${left * pair[1]}을 먼저 하면 ${other} × ${left * pair[1]} = ${comma(total)}입니다.`,
    family: "c2-regroup", meta: { left, other, pair }
  });
}

// ════ 2단원 포포즈와 약속 ════
// 5. 사각수 — 1부터 연속한 홀수의 합 · 일의 자리가 5인 수의 제곱
function c2OddSumSquare({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "oddsum" : sample(["oddsum", "inverse", "five"]);
  if (kind === "five") {
    const t = randomInt(1, 9), n = t * 10 + 5;
    return problem({
      prompt: `${josa(`${n} × ${n}`, "을", "를")} 일의 자리가 5인 수의 제곱 규칙으로 계산하세요.`,
      subtype: "square", html: board(["15 × 15 = 225 (1 × 2 → 2, 뒤에 25)", "25 × 25 = 625 (2 × 3 → 6, 뒤에 25)"]), answer: comma(n * n),
      solution: `십의 자리 ${t}에 (${t} + 1)을 곱한 ${t * (t + 1)} 뒤에 25를 붙입니다. ${n} × ${n} = ${comma(n * n)}입니다.`,
      family: "c2-square", meta: { n }
    });
  }
  const n = randomInt(difficulty <= 1 ? 4 : 8, difficulty <= 1 ? 9 : 30);
  const last = 2 * n - 1;
  const dotSq = Math.min(n, 6);
  let body = "";
  for (let r = 0; r < dotSq; r += 1) for (let c = 0; c < dotSq; c += 1) body += circle(16 + c * 18, 16 + r * 18, 6, { fill: Math.max(r, c) % 2 ? YELLOW : SOFT, color: GREEN, width: 1.4 });
  const html = svg(dotSq * 18 + 20, dotSq * 18 + 20, body, "홀수만큼 둘러 커지는 정사각형");
  if (kind === "inverse") {
    return problem({
      prompt: `1 + 3 + 5 + … 처럼 1부터 연속한 홀수를 차례로 더했더니 ${n * n}이 되었습니다. 마지막에 더한 홀수는 무엇인가요?`,
      subtype: "square", html, answer: last,
      solution: `1부터 연속한 홀수 □개의 합은 □ × □입니다. ${n * n} = ${n} × ${n}이므로 홀수 ${n}개를 더했고, ${n}번째 홀수는 ${n} × 2 − 1 = ${last}입니다.`,
      family: "c2-square", meta: { n }
    });
  }
  return problem({
    prompt: `1 + 3 + 5 + … + ${last}의 값을 구하세요.`,
    subtype: "square", html, answer: n * n,
    solution: `${last}은 ${n}번째 홀수입니다((${last} + 1) ÷ 2 = ${n}). 1부터 연속한 홀수 ${n}개의 합은 ${n} × ${n} = ${n * n}입니다 — 정사각형을 한 겹씩 홀수만큼 둘러 키우는 것과 같습니다.`,
    family: "c2-square", meta: { n }
  });
}

// 6. 괄호를 한 번 넣어 계산 결과 바꾸기
function evalExpr(tokens) {
  // tokens: [n, op, n, op, n ...] — 곱셈·나눗셈 먼저
  const nums = [tokens[0]], ops = [];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], v = tokens[i + 1];
    if (op === "×") nums.push(nums.pop() * v);
    else if (op === "÷") { const a = nums.pop(); if (a % v) return NaN; nums.push(a / v); }
    else { ops.push(op); nums.push(v); }
  }
  return ops.reduce((acc, op, i) => (op === "+" ? acc + nums[i + 1] : acc - nums[i + 1]), nums[0]);
}
function c2BracketInsert({ difficulty = 2 }) {
  const count = difficulty <= 1 ? 3 : 4;
  for (let tries = 0; tries < 60; tries += 1) {
    const nums = Array.from({ length: count }, () => randomInt(2, 9));
    const ops = Array.from({ length: count - 1 }, () => sample(["+", "−", "×", "+", "×"]));
    const tokens = nums.flatMap((n, i) => (i ? [ops[i - 1], n] : [n]));
    const plain = evalExpr(tokens);
    if (!Number.isFinite(plain) || plain < 0) continue;
    // 괄호 (i … j) 넣은 값들
    const options = [];
    for (let i = 0; i < count - 1; i += 1) for (let j = i + 1; j < count; j += 1) {
      if (i === 0 && j === count - 1) continue;
      const inner = evalExpr(tokens.slice(2 * i, 2 * j + 1));
      if (!Number.isFinite(inner) || inner < 0) continue;
      const v = evalExpr([...tokens.slice(0, 2 * i), inner, ...tokens.slice(2 * j + 1)]);
      if (Number.isFinite(v) && v >= 0 && v !== plain) options.push({ i, j, v });
    }
    const values = options.map((o) => o.v);
    const unique = options.filter((o) => values.filter((v) => v === o.v).length === 1);
    if (!unique.length) continue;
    const pick = sample(unique);
    const shown = tokens.map(String).join(" ");
    const answerExpr = tokens.map((t, k) => (k === 2 * pick.i ? `(${t}` : k === 2 * pick.j ? `${t})` : String(t))).join(" ");
    return problem({
      prompt: `식 ${shown}에 괄호를 한 쌍만 넣어 계산 결과가 ${pick.v}이 되게 하세요.`,
      subtype: "bracket", html: board([`${shown} = ${plain}`, `괄호 한 쌍 → ${pick.v}`]), answer: `${answerExpr} = ${pick.v}`,
      solution: `괄호가 없으면 곱셈·나눗셈을 먼저 하여 ${plain}입니다. 괄호 안을 먼저 계산하도록 묶어 보면 ${answerExpr} = ${pick.v}입니다.`,
      family: "c2-bracket", meta: { tokens, target: pick.v }
    });
  }
  return null;
}

// ════ 3단원 달력과 님게임 ════
// 7. 해가 바뀌면 요일이 하루(윤년 다음은 이틀) 밀린다 · 1년에 53번 있는 요일
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
function c2YearWeekdayShift({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "next" : sample(["next", "years", "fifty-three"]);
  const y = randomInt(2015, 2030), w = randomInt(0, 6);
  if (kind === "fifty-three") {
    const leap = isLeap(y);
    const list = leap ? [WEEK[w], WEEK[(w + 1) % 7]] : [WEEK[w]];
    return problem({
      prompt: `${y}년 1월 1일은 ${WEEK[w]}요일입니다. ${y}년에 53번 있는 요일을 모두 쓰세요.`,
      subtype: "year-week", html: board([`${y}년 · ${leap ? "윤년 366일" : "평년 365일"}`]), answer: list.map((d) => `${d}요일`).join(", "),
      solution: `${leap ? 366 : 365}일 = 52주 + ${leap ? 2 : 1}일입니다. 52주로 모든 요일이 52번씩 있고, 남는 ${leap ? "이틀" : "하루"}는 1월 1일${leap ? "과 그다음 날" : ""}의 요일이라 ${list.map((d) => `${d}요일`).join("·")}이 53번입니다.`,
      family: "c2-year-week", meta: { y, w }
    });
  }
  const span = kind === "next" ? 1 : randomInt(2, difficulty === 3 ? 8 : 5);
  let shift = 0;
  for (let k = 0; k < span; k += 1) shift += isLeap(y + k) ? 2 : 1;
  const target = WEEK[(w + shift) % 7];
  const leapYears = Array.from({ length: span }, (_, k) => y + k).filter(isLeap);
  return problem({
    prompt: `${y}년 1월 1일은 ${WEEK[w]}요일입니다. ${y + span}년 1월 1일은 무슨 요일인가요?`,
    subtype: "year-week", html: board([`${y}년 1월 1일 ${WEEK[w]}요일 → ${y + span}년 1월 1일 ?`]), answer: `${target}요일`,
    solution: `평년(365일 = 52주 + 1일)을 지나면 요일이 하루, 윤년(366일)을 지나면 이틀 밀립니다. ${leapYears.length ? `${leapYears.join(", ")}년이 윤년이라 ` : "그사이에 윤년이 없어 "}모두 ${shift}일 밀리므로 ${WEEK[w]}요일에서 ${shift}칸 뒤인 ${target}요일입니다.`,
    family: "c2-year-week", meta: { y, w, span, shift }
  });
}

// 8. 님게임 — 한 번에 1개부터 k개까지 가져가고 마지막 것을 가져가는 사람이 이김(또는 짐)
function c2NimStrategy({ difficulty = 2 }) {
  const k = randomInt(2, difficulty <= 1 ? 3 : 6);
  const n = randomInt(difficulty <= 1 ? 10 : 20, difficulty <= 1 ? 25 : difficulty === 2 ? 80 : 200);
  const lastLoses = difficulty === 3 ? sample([true, false]) : false;
  const goal = lastLoses ? n - 1 : n;          // 마지막을 가져가면 지는 경우: 상대에게 1개를 남긴다 = n − 1개를 내가 가져가는 것이 목표
  const r = goal % (k + 1);
  const html = svg(360, 60, Array.from({ length: Math.min(n, 16) }, (_, i) => circle(18 + i * 21, 30, 8, { fill: i < r ? YELLOW : "#fff", color: INK, width: 1.4 })).join("") + (n > 16 ? text(352, 30, "…", { size: 18, anchor: "end" }) : ""), "바둑돌");
  const rule = `바둑돌 ${n}개가 있습니다. 두 사람이 번갈아 한 번에 1개부터 ${k}개까지 가져갑니다. 마지막 바둑돌을 가져가는 사람이 ${lastLoses ? "집니다" : "이깁니다"}.`;
  if (r === 0) {
    return problem({
      prompt: `${rule} 먼저 하는 사람과 나중에 하는 사람 중 누가 반드시 이길 수 있나요?`,
      subtype: "nim", html, answer: "나중에 하는 사람",
      solution: `두 사람이 한 번씩 하면 합해서 ${k + 1}개를 가져가도록 맞출 수 있습니다(상대가 □개면 나는 ${k + 1} − □개). ${lastLoses ? `상대에게 마지막 1개를 남기려면 내가 ${goal}개째까지 가져가야 하는데, ` : ""}${josa(goal, "은", "는")} ${josa(k + 1, "으로", "로")} 나누어떨어지므로 나중에 하는 사람이 늘 ${k + 1}의 배수에 맞출 수 있습니다.`,
      family: "c2-nim", meta: { n, k, lastLoses }
    });
  }
  return problem({
    prompt: `${rule} 먼저 하는 사람이 반드시 이기려면 처음에 몇 개를 가져가야 하나요?`,
    subtype: "nim", html, answer: `${r}개`,
    solution: `한 번씩 주고받을 때 두 사람이 가져가는 개수의 합을 ${josa(k + 1, "으로", "로")} 맞추면 됩니다. ${lastLoses ? `상대에게 마지막 1개를 남기려면 내가 ${goal}개째를 가져가야 합니다. ` : ""}${goal} ÷ ${k + 1} = ${Math.floor(goal / (k + 1))} … ${r}이므로 처음에 ${r}개를 가져가 남은 수를 ${k + 1}의 배수로 만들고, 그다음부터는 상대가 가져간 수와 합해 ${josa(k + 1, "이", "가")} 되게 가져갑니다.`,
    family: "c2-nim", meta: { n, k, lastLoses, first: r }
  });
}

// ════ 4단원 거꾸로 생각하기 ════
// 9. 각 자리 숫자를 곱하는 일을 한 자리 수가 될 때까지 되풀이하기
function c2DigitProductSteps({ difficulty = 2 }) {
  const step = (x) => String(x).split("").reduce((a, d) => a * Number(d), 1);
  const chain = (x) => { const out = [x]; while (out.at(-1) >= 10) out.push(step(out.at(-1))); return out; };
  for (let tries = 0; tries < 80; tries += 1) {
    const n = difficulty <= 1 ? randomInt(25, 99) : difficulty === 2 ? randomInt(25, 99) : randomInt(100, 999);
    const c = chain(n);
    if (c.length < (difficulty <= 1 ? 3 : 4)) continue;
    const kind = sample(["steps", "end"]);
    return problem({
      prompt: kind === "steps" ? `수의 각 자리 숫자를 모두 곱하는 일을 한 자리 수가 될 때까지 되풀이합니다. ${n}은 몇 번 만에 한 자리 수가 되나요?`
        : `수의 각 자리 숫자를 모두 곱하는 일을 한 자리 수가 될 때까지 되풀이합니다. ${n}에서 시작하면 마지막 한 자리 수는 무엇인가요?`,
      subtype: "digit-product", html: board([c.slice(0, 2).join(" → ") + " → …"]), answer: kind === "steps" ? `${c.length - 1}번` : c.at(-1),
      solution: `${c.join(" → ")}이므로 ${kind === "steps" ? `${c.length - 1}번 만에 한 자리 수가 됩니다.` : `마지막 수는 ${c.at(-1)}입니다.`}`,
      family: "c2-digit-product", meta: { n, chain: c }
    });
  }
  return null;
}

// 10. 가진 것의 절반보다 □ 적게(많게) 쓰기를 되풀이 — 끝에서부터 거꾸로
function c2ReverseHalfChain({ difficulty = 2 }) {
  const steps = difficulty <= 1 ? 2 : difficulty === 2 ? 3 : 4;
  const unit = sample([[100, "원"], [1000, "원"], [1, "개"]]);
  for (let tries = 0; tries < 80; tries += 1) {
    const plan = Array.from({ length: steps }, () => ({ more: sample([true, false]), k: randomInt(1, 6) * (unit[0] === 1 ? 1 : unit[0]) }));
    let money = randomInt(1, 6) * (unit[0] === 1 ? 2 : unit[0] * 2);
    const ends = money;
    const history = [];
    // 거꾸로: 쓰기 전 = (남은 것 + k) × 2 [절반보다 k 많이 썼다면], (남은 것 − k) × 2 [k 적게]
    for (let s = steps - 1; s >= 0; s -= 1) {
      const { more, k } = plan[s];
      const before = more ? (money + k) * 2 : (money - k) * 2;
      if (before <= 0) { money = -1; break; }
      history.unshift({ before, after: money, more, k });
      money = before;
    }
    if (money <= 0 || history.some((h) => h.before / 2 - (h.more ? -h.k : h.k) <= 0)) continue;
    const place = ["첫 번째 가게", "두 번째 가게", "세 번째 가게", "네 번째 가게"];
    const lines = history.map((h, i) => `${place[i]}에서 가진 ${unit[1] === "원" ? "돈" : "사탕"}의 절반보다 ${comma(h.k)}${unit[1]} ${h.more ? "더 많이" : "적게"} 썼습니다`);
    return problem({
      prompt: `${lines.join(". ")}. 남은 것이 ${comma(ends)}${unit[1]}이라면 처음에 가진 것은 얼마인가요?`,
      subtype: "reverse-half", html: board([`처음 ? → ${steps}곳에서 쓰기 → 남은 것 ${comma(ends)}${unit[1]}`]),
      answer: `${comma(money)}${unit[1]}`,
      solution: `끝에서부터 거꾸로 갑니다. 「절반보다 □ 적게 썼다」면 남은 것은 절반보다 □ 많으니 (남은 것 − □) × 2, 「□ 더 많이 썼다」면 (남은 것 + □) × 2가 쓰기 전입니다. `
        + history.slice().reverse().map((h) => `${comma(h.after)} → ${comma(h.before)}`).join(", ") + `이므로 처음은 ${comma(money)}${unit[1]}입니다.`,
      family: "c2-reverse-half", meta: { steps, start: money, ends }
    });
  }
  return null;
}

export const COURSE2_A2_GENERATORS = plainText({ c2PowerTenZeros, c2NinesProduct, c2RepunitSquare, c2SmartRegroup, c2OddSumSquare, c2BracketInsert, c2YearWeekdayShift, c2NimStrategy, c2DigitProductSteps, c2ReverseHalfChain });
export const COURSE2_A2_TYPE_ROWS = [
  ["c2-power-ten-zeros", "number", "10의 거듭제곱", "2와 5의 거듭제곱 — 끝자리 0과 자릿수", "c2PowerTenZeros"],
  ["c2-nines-product", "number", "복제수", "9, 99, 999와의 곱", "c2NinesProduct"],
  ["c2-repunit-square", "number", "복제수", "1로만 된 수의 곱·수 피라미드·11 곱하기", "c2RepunitSquare"],
  ["c2-smart-regroup", "number", "10의 거듭제곱", "짝을 지어 10·100·1000 만들어 간편 계산", "c2SmartRegroup"],
  ["c2-odd-sum-square", "number", "사각수", "연속한 홀수의 합과 제곱수", "c2OddSumSquare"],
  ["c2-bracket-insert", "number", "포포즈와 약속", "괄호 한 쌍으로 계산 결과 바꾸기", "c2BracketInsert"],
  ["c2-year-weekday-shift", "number", "달력", "해가 바뀔 때 요일이 밀리는 수", "c2YearWeekdayShift"],
  ["c2-nim-strategy", "logic", "님게임", "번갈아 가져가기 게임의 필승 전략", "c2NimStrategy"],
  ["c2-digit-product-steps", "number", "거꾸로 생각하기", "각 자리 숫자의 곱을 되풀이하기", "c2DigitProductSteps"],
  ["c2-reverse-half-chain", "number", "거꾸로 생각하기", "절반보다 많게·적게 쓴 처음 양", "c2ReverseHalfChain"]
];
export const COURSE2_A2_GUIDES = Object.freeze({
  "c2-power-ten-zeros": "2와 5를 하나씩 짝지어 10을 만들고, 짝이 안 된 것만 따로 계산합니다.",
  "c2-nines-product": "99…9 = 10…0 − 1로 바꾸어 큰 수에서 빼기로 계산합니다.",
  "c2-repunit-square": "작은 경우(11, 111)부터 계산해 놓고 자리마다 무엇이 늘어나는지 봅니다.",
  "c2-smart-regroup": "합이나 곱이 10·100·1000이 되는 짝을 먼저 만듭니다 — 덧셈은 순서를 바꾸고, 같은 수를 곱한 덧셈은 묶습니다(★ × □ + ★ × △ = ★ × (□ + △)).",
  "c2-odd-sum-square": "1부터 연속한 홀수 □개의 합 = □ × □ — 정사각형을 홀수만큼 둘러 키운 것입니다.",
  "c2-bracket-insert": "괄호는 그 안을 먼저 계산하게 합니다. 곱셈 앞뒤를 묶어 보는 것부터 시작합니다.",
  "c2-year-weekday-shift": "평년은 52주 + 1일, 윤년은 52주 + 2일 — 해가 지날 때마다 요일이 하루(이틀)씩 밀립니다.",
  "c2-nim-strategy": "한 번씩 주고받을 때 합이 (가져갈 수 있는 가장 큰 수 + 1)이 되게 맞춥니다.",
  "c2-digit-product-steps": "한 단계씩 각 자리 숫자를 곱해 적어 가며 셉니다.",
  "c2-reverse-half-chain": "끝에서부터 — 절반보다 □ 적게 썼으면 (남은 것 − □) × 2, 많게 썼으면 (남은 것 + □) × 2."
});
