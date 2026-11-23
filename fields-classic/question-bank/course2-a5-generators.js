// 2과정 A5 「소인수분해와 비」 교재 유사문제 생성기. 약속은 G1~G5·A1~A4 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 가능한 수를 하나씩 확인하는 방법(전수 탐색)이나 문제를 만든 수에서 계산한다.
// 분수·거듭제곱은 글 속에 「3/5」「2^3」으로 쓴다 — 화면·인쇄는 app.js mathShown · drill.js shown이 수식으로 바꾼다(그림 속 식은 board가 HTML 수식으로).
import { plainText } from "./course2-plain.js?v=20261122zi";
import { mathText } from "./math-markup.js?v=20261122w";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", YELLOW = "#fff1bf", WATER = "#cfe3f3";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
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
const line = (x1, y1, x2, y2, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// 식 칠판 — SVG 글자로는 분수를 쌓을 수 없어 HTML + 공통 수식(math-markup)으로 그린다(빗금 분수 금지). 모양은 글 안 style(화면·인쇄 같음).
const board = (lines) => `<div class="c2-formula" role="img" aria-label="식" style="display:grid;gap:.55em;justify-items:center;padding:.7em 1.1em;margin:0 auto;max-width:100%;box-sizing:border-box;background:${SOFT};border:2px solid ${GREEN};border-radius:8px;color:${INK};font-weight:600;font-size:1.12em;line-height:1.5;text-align:center">${lines.map((t) => `<div>${mathText(esc(t))}</div>`).join("")}</div>`;

// 소인수분해 「2^3 × 3^2」
function factor(n) { const out = []; let x = n; for (let p = 2; p * p <= x; p += 1) { let e = 0; while (x % p === 0) { x /= p; e += 1; } if (e) out.push([p, e]); } if (x > 1) out.push([x, 1]); return out; }
const factorText = (n) => factor(n).map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join(" × ");

// ════ 1단원 소인수분해 ════
// 1. 배수판정법으로 빈칸 숫자 찾기 — 다섯 자리 수 ㉠47㉡2가 □의 배수
function c2DivisibilityDigits({ difficulty = 2 }) {
  const d = sample(difficulty <= 1 ? [3, 9, 4, 6] : [12, 15, 18, 36, 45, 24, 72]);
  const one = d < 10;   // 작은 수의 배수는 빈칸이 둘이면 답이 너무 많다 — ㉡을 정해 두고 ㉠만 찾는다
  for (let tries = 0; tries < 200; tries += 1) {
    // 실제 배수 하나에서 시작해 두 자리를 가린다 — 답이 늘 하나 이상 있다
    const base = String(d * randomInt(Math.ceil(10000 / d), Math.floor(99999 / d)));
    // 다섯 자리: ㉠ · 가운데 두 자리 · ㉡ · 끝자리
    const mid = base.slice(1, 3), fixedB = Number(base[3]), tail = Number(base[4]);
    // 꼴: ㉠ mid ㉡ tail (다섯 자리, ㉠은 1~9)
    const find = (single) => { const out = []; for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) { if (single && b !== fixedB) continue; const n = Number(`${a}${mid}${b}${tail}`); if (n % d === 0) out.push([a, b, n]); } return out; };
    let single = one, sols = find(single);
    if (sols.length > 12) { single = true; sols = find(true); }   // 답이 너무 많으면 ㉡을 정해 둔다(처음 배수가 있어 답은 늘 하나 이상)
    if (!sols.length || sols.length > 12) continue;
    const kind = sample(["count", "max", "min"]);
    const pick = kind === "max" ? sols.at(-1) : sols[0];
    const rule = { 3: "각 자리 숫자의 합이 3의 배수", 9: "각 자리 숫자의 합이 9의 배수", 4: "끝 두 자리가 4의 배수", 6: "2의 배수이면서 3의 배수", 12: "3의 배수이면서 4의 배수", 15: "3의 배수이면서 5의 배수", 18: "2의 배수이면서 9의 배수", 36: "4의 배수이면서 9의 배수", 45: "5의 배수이면서 9의 배수", 24: "3의 배수이면서 8의 배수(끝 세 자리)", 72: "8의 배수(끝 세 자리)이면서 9의 배수" }[d];
    return problem({
      prompt: `다섯 자리 수 ㉠${mid}${single ? fixedB : "㉡"}${tail}이 ${d}의 배수입니다. ${kind === "count" ? "이런 다섯 자리 수는 모두 몇 개인가요?" : `이런 수 가운데 가장 ${kind === "max" ? "큰" : "작은"} 수를 구하세요.`}`,
      subtype: "divisibility", html: board([`㉠ ${mid.split("").join(" ")} ${single ? fixedB : "㉡"} ${tail}`, `${d}의 배수 = ${rule}`]),
      answer: kind === "count" ? `${sols.length}개` : comma(pick[2]),
      solution: `${d}의 배수가 되려면 ${rule}이어야 합니다. ${single ? "㉠에 1부터 9까지" : "㉠(1~9)과 ㉡(0~9)을"} 차례로 넣어 확인하면 ${sols.length === 1 ? `${comma(pick[2])} 하나뿐입니다.` : `${sols.map((s) => comma(s[2])).join(", ")}${kind === "count" ? `로 ${sols.length}개입니다.` : `이고 가장 ${kind === "max" ? "큰" : "작은"} 것은 ${comma(pick[2])}입니다.`}`}`,
      family: "c2-divisibility", meta: { d, mid, tail, single, count: sols.length }
    });
  }
  return null;
}

// 2. 소인수분해와 제곱수 — 가장 작은 수를 곱해(나누어) 제곱수 만들기
function c2SquareMultiplier({ difficulty = 2 }) {
  for (let tries = 0; tries < 80; tries += 1) {
    const n = randomInt(difficulty <= 1 ? 12 : 40, difficulty <= 1 ? 80 : 600);
    const f = factor(n);
    const need = f.filter(([, e]) => e % 2).reduce((acc, [p]) => acc * p, 1);
    if (need === 1 || need === n) continue;
    const kind = sample(["multiply", "divide"]);
    const result = kind === "multiply" ? n * need : n / need;
    const root = Math.round(Math.sqrt(result));
    return problem({
      prompt: kind === "multiply" ? `${n}에 가장 작은 자연수를 곱하여 어떤 수의 제곱이 되게 하려고 합니다. 곱할 수를 구하세요.`
        : `${josa(n, "을", "를")} 가장 작은 자연수로 나누어 어떤 수의 제곱이 되게 하려고 합니다. 나눌 수를 구하세요.`,
      subtype: "square-factor", html: board([`${n} = ${factorText(n)}`]), answer: need,
      solution: `${n} = ${factorText(n)}입니다. 제곱수는 소인수의 거듭제곱이 모두 짝수 번이어야 하므로 홀수 번인 ${f.filter(([, e]) => e % 2).map(([p]) => p).join(", ")}${f.filter(([, e]) => e % 2).length > 1 ? "을 하나씩" : "을 하나"} 더 ${kind === "multiply" ? "곱해야" : "덜어야"} 합니다. ${need}${kind === "multiply" ? `를 곱하면 ${result} = ${root} × ${root}` : `로 나누면 ${result} = ${root} × ${root}`}입니다.`,
      family: "c2-square-factor", meta: { n, need }
    });
  }
  return null;
}

// 3. 연속한 수의 곱 — 곱이 주어질 때 가운데 수
function c2ConsecutiveProduct({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "natural" : sample(["natural", "odd", "even"]);
  const step = kind === "natural" ? 1 : 2;
  let mid = randomInt(difficulty <= 1 ? 4 : 6, difficulty <= 1 ? 12 : 30);
  if (kind === "odd" && mid % 2 === 0) mid += 1;
  if (kind === "even" && mid % 2) mid += 1;
  const prod = (mid - step) * mid * (mid + step);
  const word = { natural: "자연수", odd: "홀수", even: "짝수" }[kind];
  return problem({
    prompt: `연속한 세 ${word}의 곱이 ${comma(prod)}입니다. 세 수 가운데 가장 큰 수는 무엇인가요?`,
    subtype: "consecutive-product", html: board([`□ × □ × □ = ${comma(prod)}`, `${prod} = ${factorText(prod)}`]), answer: mid + step,
    solution: `${comma(prod)}을 소인수분해하면 ${factorText(prod)}입니다. 세 수는 서로 가까우니 가운데 수는 대략 세제곱해서 ${comma(prod)}쯤 되는 수입니다. 소인수를 묶어 ${mid - step} × ${mid} × ${mid + step}을 만들 수 있으므로 가장 큰 수는 ${mid + step}입니다.`,
    family: "c2-consecutive-product", meta: { mid, step, prod }
  });
}

// 4. 팩토리얼의 끝자리 0 — 1 × 2 × … × N에 들어 있는 5의 개수
function c2FactorialZeros({ difficulty = 2 }) {
  const zerosOf = (n) => { let z = 0; for (let p = 5; p <= n; p *= 5) z += Math.floor(n / p); return z; };
  const n = randomInt(difficulty <= 1 ? 10 : 30, difficulty <= 1 ? 30 : difficulty === 2 ? 150 : 1000);
  const kind = difficulty <= 1 ? "zeros" : sample(["zeros", "zeros", "inverse"]);
  if (kind === "inverse") {
    const z = zerosOf(n);
    let lo = 1; while (zerosOf(lo) < z) lo += 1;
    return problem({
      prompt: `1부터 N까지의 자연수를 모두 곱한 수(N!)의 끝자리에 0이 처음으로 ${z}개 이어집니다. 이렇게 되는 가장 작은 N은 무엇인가요?`,
      subtype: "factorial", html: board(["끝자리 0 = 10 = 2 × 5의 개수", "→ 5의 개수"]), answer: lo,
      solution: `0의 개수는 곱 속의 5의 개수와 같습니다(2는 늘 더 많음). N을 1씩 늘려 5의 배수를 지날 때마다 0이 늘어납니다. 5의 개수가 처음으로 ${z}개가 되는 것은 N = ${lo}일 때입니다.`,
      family: "c2-factorial", meta: { z, lo }
    });
  }
  const parts = []; for (let p = 5; p <= n; p *= 5) parts.push(`${n} ÷ ${p}의 몫 ${Math.floor(n / p)}`);
  return problem({
    prompt: `1 × 2 × 3 × … × ${josa(n, "을", "를")} 계산하면 끝자리에 0이 몇 개 이어지나요?`,
    subtype: "factorial", html: board([`${n}! = 1 × 2 × … × ${n}`]), answer: `${zerosOf(n)}개`,
    solution: `끝의 0은 2 × 5 = 10이 몇 번 들어 있는지와 같고, 2보다 적은 5의 개수만 세면 됩니다. ${parts.join(", ")}을 더하면 ${zerosOf(n)}개입니다(25, 125의 배수에는 5가 두 번, 세 번 들어 있습니다).`,
    family: "c2-factorial", meta: { n }
  });
}

// ════ 2단원 크기가 같은 분수 ════
// 5. 크기가 같은 분수 — 분모와 분자의 합(차)이 주어질 때 · 분모·분자에 같은 수를 더하거나 뺀 분수
function c2EquivalentCondition({ difficulty = 2 }) {
  let p, q; do { q = randomInt(3, 11); p = randomInt(1, q - 1); } while (gcd(p, q) !== 1);
  const k = randomInt(2, difficulty <= 1 ? 6 : 15);
  const kind = difficulty <= 1 ? "sum" : sample(["sum", "diff", "shift"]);
  if (kind === "shift") {
    // (a + t)/(b + t) = p/q 가 되도록 하는 t — 처음 분수 a/b를 정해 둔다
    const t = randomInt(2, 9);
    const a = p * k - t, b = q * k - t;
    if (a <= 0) return c2EquivalentCondition({ difficulty });
    return problem({
      prompt: `분수 ${a}/${b}의 분자와 분모에 같은 수를 더했더니 ${p}/${q}와 크기가 같아졌습니다. 더한 수를 구하세요.`,
      subtype: "equivalent", html: board([`(${a} + □)/(${b} + □) = ${p}/${q}`]), answer: t,
      solution: `분자와 분모에 같은 수를 더해도 분모와 분자의 차 ${b - a}는 그대로입니다. ${p}/${q}와 크기가 같고 차가 ${b - a}인 분수는 ${p * k}/${q * k} (차 ${(q - p) * k})이므로 ${a} + □ = ${p * k}, □ = ${t}입니다.`,
      family: "c2-equivalent", meta: { a, b, t }
    });
  }
  const known = kind === "sum" ? (p + q) * k : (q - p) * k;
  return problem({
    prompt: `${p}/${q}와 크기가 같은 분수 가운데 분모와 분자의 ${kind === "sum" ? "합" : "차"}가 ${known}인 분수를 구하세요.`,
    subtype: "equivalent", html: board([`${p}/${q} = (${p} × □)/(${q} × □)`]), answer: `${p * k}/${q * k}`,
    solution: `크기가 같은 분수는 분자 ${p} × □, 분모 ${q} × □ 꼴이고 분모와 분자의 ${kind === "sum" ? `합은 ${p + q} × □` : `차는 ${q - p} × □`}입니다. ${known} ÷ ${kind === "sum" ? p + q : q - p} = ${k}이므로 ${p * k}/${q * k}입니다.`,
    family: "c2-equivalent", meta: { p, q, k }
  });
}

// 6. 부분분수 — 1/(1×2) + 1/(2×3) + … 이웃한 항이 지워지는 합
function c2PartialFractionSum({ difficulty = 2 }) {
  const gap = difficulty <= 1 ? 1 : sample([1, 2, 3]);
  const start = gap === 1 ? 1 : sample([1, 2]);
  const terms = randomInt(4, difficulty <= 1 ? 6 : 12);
  const dens = Array.from({ length: terms }, (_, i) => [start + i * gap, start + (i + 1) * gap]);
  const first = dens[0][0], last = dens.at(-1)[1];
  // 합 = (1/first − 1/last) ÷ gap = (last − first) / (gap × first × last)
  let num = last - first, den = gap * first * last; const g = gcd(num, den); num /= g; den /= g;
  const shown = `${dens.slice(0, 2).map(([a, b]) => `1/${a * b}`).join(" + ")} + … + 1/${dens.at(-1)[0] * dens.at(-1)[1]}`;
  return problem({
    prompt: `${shown}${hasBatchim(dens.at(-1)[0] * dens.at(-1)[1]) ? "을" : "를"} 계산하세요. (분모는 차례로 ${dens.slice(0, 3).map(([a, b]) => `${a} × ${b}`).join(", ")}, …, ${dens.at(-1)[0]} × ${dens.at(-1)[1]}입니다.)`,
    subtype: "partial-fraction", html: board([gap === 1 ? "1/(앞 수 × 뒤 수) = 1/(앞 수) − 1/(뒤 수)" : `1/(앞 수 × 뒤 수) = (1/(앞 수) − 1/(뒤 수)) ÷ ${gap}`, gap === 1 ? "1/(2 × 3) = 1/2 − 1/3" : `차가 ${gap}이면 ${gap}로 나눈다`]),
    answer: den === 1 ? num : `${num}/${den}`,
    solution: `이웃한 두 수의 곱 꼴 분모는 1/(앞 수) − 1/(뒤 수)로 쪼갤 수 있습니다(차가 ${gap}이면 그 값을 ${gap}로 나눕니다). 차례로 쓰면 가운데 항이 서로 지워져 (1/${first} − 1/${last})${gap > 1 ? ` ÷ ${gap}` : ""}만 남아 ${den === 1 ? num : `${num}/${den}`}입니다.`,
    family: "c2-partial-fraction", meta: { gap, first, last }
  });
}

// ════ 3단원 포함과 배제 ════
// 7. 튀어 오른 공의 높이 — 떨어진 높이의 a/b만큼 튀어 오른다
function c2BounceHeight({ difficulty = 2 }) {
  const [a, b] = sample([[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]]);
  const times = randomInt(2, difficulty <= 1 ? 2 : 3);
  const base = b ** times * randomInt(difficulty <= 1 ? 1 : 2, difficulty <= 1 ? 4 : 8);
  const heights = [base]; for (let i = 0; i < times; i += 1) heights.push((heights.at(-1) * a) / b);
  const kind = difficulty <= 1 ? "after" : sample(["after", "before", "distance"]);
  const bars = heights.map((h, i) => rect(30 + i * 60, 130 - (h / base) * 110, 24, (h / base) * 110, { fill: i ? YELLOW : SOFT, width: 1.2 })).join("");
  const html = svg(60 + heights.length * 60, 150, line(10, 130, 50 + heights.length * 60, 130, { color: "#9aa39e" }) + bars, "튀어 오른 높이");
  if (kind === "before") {
    return problem({
      prompt: `어떤 공을 떨어뜨리면 떨어진 높이의 ${a}/${b}만큼 튀어 오릅니다. 이 공이 ${times}번째로 튀어 오른 높이가 ${heights.at(-1)}cm라면 처음에 떨어뜨린 높이는 몇 cm인가요?`,
      subtype: "bounce", html, answer: `${base}cm`,
      solution: `튀어 오르기 전 높이 = 튀어 오른 높이 ÷ ${a} × ${b}입니다. ${heights.slice().reverse().join(" → ")}cm로 거꾸로 올라가 처음은 ${base}cm입니다.`,
      family: "c2-bounce", meta: { a, b, times, base }
    });
  }
  if (kind === "distance") {
    const dist = heights[0] + 2 * heights.slice(1).reduce((x, y) => x + y, 0);
    return problem({
      prompt: `${base}cm 높이에서 공을 떨어뜨렸습니다. 이 공은 떨어진 높이의 ${a}/${b}만큼 튀어 오릅니다. ${times}번째로 튀어 올랐다가 다시 땅에 닿을 때까지 공이 움직인 거리는 모두 몇 cm인가요?`,
      subtype: "bounce", html, answer: `${dist}cm`,
      solution: `튀어 오른 높이는 ${heights.slice(1).join(", ")}cm입니다. 처음 떨어진 ${base}cm에, 튀어 오를 때마다 올라갔다 내려오는 두 번을 더해 ${base} + 2 × (${heights.slice(1).join(" + ")}) = ${dist}cm입니다.`,
      family: "c2-bounce", meta: { a, b, times, base, dist }
    });
  }
  return problem({
    prompt: `${base}cm 높이에서 떨어뜨린 공이 떨어진 높이의 ${a}/${b}만큼 튀어 오릅니다. ${times}번째로 튀어 오른 높이는 몇 cm인가요?`,
    subtype: "bounce", html, answer: `${heights.at(-1)}cm`,
    solution: `한 번 튈 때마다 ${a}/${b}배가 됩니다. ${heights.join(" → ")}cm이므로 ${heights.at(-1)}cm입니다.`,
    family: "c2-bounce", meta: { a, b, times, base }
  });
}

// ════ 4단원 변하지 않는 것 찾기 ════
// 8. 변하지 않는 것 — 나이의 차 · 주고받아도 그대로인 합 · 같은 양을 써도 그대로인 차
function c2InvariantRatio({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "age" : sample(["age", "give", "spend"]);
  if (kind === "age") {
    for (let tries = 0; tries < 80; tries += 1) {
      const child = randomInt(4, 14), mom = child + randomInt(24, 36), m = sample([2, 3, 4]);
      // mom + y = m × (child + y) → y = (mom − m × child) / (m − 1)
      const y = (mom - m * child) / (m - 1);
      if (!Number.isInteger(y) || y <= 0 || y > 30) continue;
      return problem({
        prompt: `지금 엄마는 ${mom}살, 아이는 ${child}살입니다. 몇 년 뒤에 엄마의 나이가 아이 나이의 ${m}배가 되나요?`,
        subtype: "invariant", html: board([`나이 차 ${mom - child}살은 늘 그대로`]), answer: `${y}년 뒤`,
        solution: `두 사람의 나이 차 ${mom - child}살은 변하지 않습니다. 엄마가 아이의 ${m}배일 때 차는 아이 나이의 ${m - 1}배이므로 아이는 ${mom - child} ÷ ${m - 1} = ${(mom - child) / (m - 1)}살입니다. ${(mom - child) / (m - 1)} − ${child} = ${y}년 뒤입니다.`,
        family: "c2-invariant", meta: { mom, child, m, y }
      });
    }
    return null;
  }
  if (kind === "give") {
    for (let tries = 0; tries < 80; tries += 1) {
      const [p, q] = sample([[3, 2], [5, 3], [4, 3], [7, 5]]), [r, s] = sample([[1, 1], [4, 5], [2, 3], [3, 4]]);
      const total = (p + q) * (r + s) * randomInt(2, 6);
      const A = (total / (p + q)) * p, B = total - A, A2 = (total / (r + s)) * r;
      const give = A - A2;
      if (give <= 0 || !Number.isInteger(A2)) continue;
      return problem({
        prompt: `형과 동생이 가진 구슬 수의 비는 ${p} : ${q}입니다. 형이 동생에게 구슬을 몇 개 주었더니 비가 ${r} : ${s}가 되었고, 두 사람의 구슬은 모두 ${total}개입니다. 형이 준 구슬은 몇 개인가요?`,
        subtype: "invariant", html: board([`주고받아도 합 ${total}개는 그대로`]), answer: `${give}개`,
        solution: `주고받아도 전체 ${total}개는 변하지 않습니다. 처음 형은 ${total} ÷ ${p + q} × ${p} = ${A}개, 나중 형은 ${total} ÷ ${r + s} × ${r} = ${A2}개이므로 준 구슬은 ${A} − ${A2} = ${give}개입니다.`,
        family: "c2-invariant", meta: { total, A, A2, B }
      });
    }
    return null;
  }
  // 똑같이 쓴 뒤의 비 r : s와 쓴 돈을 먼저 정하고, 처음 금액에서 처음 비를 계산한다(처음 비는 하나로 정해진다)
  for (let tries = 0; tries < 80; tries += 1) {
    const [r, s2] = sample([[3, 1], [2, 1], [5, 2], [7, 3], [4, 3]]);
    const u = randomInt(2, 9), t = randomInt(2, 9);
    const A = r * u + t, B = s2 * u + t, g = gcd(A, B), p = A / g, q = B / g;
    if (p > 12 || q > 12 || (p === r && q === s2)) continue;
    return problem({
      prompt: `두 사람이 가진 돈의 비는 ${p} : ${q}입니다. 두 사람이 똑같이 ${comma(t * 100)}원씩 썼더니 비가 ${r} : ${s2}가 되었습니다. 처음에 두 사람이 가진 돈은 각각 얼마인가요?`,
      subtype: "invariant", html: board(["똑같이 쓰면 두 사람의 차는 그대로"]), answer: `${comma(A * 100)}원, ${comma(B * 100)}원`,
      solution: `똑같이 쓰면 두 사람의 차는 변하지 않습니다. 처음 차는 ${p - q}칸, 나중 차는 ${r - s2}칸이므로 같은 크기가 되도록 칸을 맞추면 처음은 ${comma(A * 100)}원과 ${comma(B * 100)}원이고, ${comma(t * 100)}원씩 쓴 뒤 ${comma((A - t) * 100)}원 : ${comma((B - t) * 100)}원 = ${r} : ${s2}가 됩니다.`,
      family: "c2-invariant", meta: { A, B, t }
    });
  }
  return null;
}

// 9. 연못의 깊이 — 길이가 다른 두 막대를 바닥까지 꽂았을 때 잠긴 부분의 비
const timesText = (num, den) => (den === 1 ? `${num}` : `${num}/${den}`);
function c2PondDepth({ difficulty = 2 }) {
  for (let tries = 0; tries < 200; tries += 1) {
    const [a, b] = sample([[1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [3, 5]]);
    const [c, e] = sample([[1, 3], [1, 4], [1, 5], [2, 5], [2, 7], [3, 7]]);
    if (a / b <= c / e) continue;
    const m = randomInt(1, difficulty <= 1 ? 3 : 6), d = a * c * m * 10 / gcd(a * c, 10) * (difficulty <= 1 ? 1 : 1);
    const L1 = (d * b) / a, L2 = (d * e) / c;
    if (!Number.isInteger(L1) || !Number.isInteger(L2) || L2 - L1 <= 0 || L2 > 400 || d < 20) continue;
    const diff = L2 - L1;
    const html = svg(300, 170, rect(20, 70, 260, 90, { fill: WATER, color: "#7fa7c9", width: 1.2 }) + rect(90, 20, 14, 140, { fill: YELLOW, width: 1.2 }) + rect(190, 0, 14, 160, { fill: YELLOW, width: 1.2 }) + text(150, 112, "깊이 ?", { size: 15 }), "연못과 두 막대");
    return problem({
      prompt: `길이의 차가 ${diff}cm인 두 막대를 연못 바닥까지 똑바로 꽂았더니, 짧은 막대는 ${a}/${b}, 긴 막대는 ${c}/${e}만큼 물에 잠겼습니다. 연못의 깊이는 몇 cm인가요?`,
      subtype: "pond", html, answer: `${d}cm`,
      solution: `물에 잠긴 길이(깊이)는 두 막대가 같습니다. 깊이를 ${a * c}칸으로 보면 짧은 막대는 ${(a * c) * b / a}칸, 긴 막대는 ${(a * c) * e / c}칸이라 차 ${diff}cm가 ${(a * c) * e / c - (a * c) * b / a}칸입니다. 한 칸은 ${diff / ((a * c) * e / c - (a * c) * b / a)}cm, 깊이는 ${a * c}칸 = ${d}cm입니다(짧은 막대 ${L1}cm, 긴 막대 ${L2}cm). 짧은 막대는 깊이의 ${timesText(b, a)}배, 긴 막대는 ${timesText(e, c)}배입니다.`,
      family: "c2-pond", meta: { d, L1, L2 }
    });
  }
  return null;
}

export const COURSE2_A5_GENERATORS = plainText({ c2DivisibilityDigits, c2SquareMultiplier, c2ConsecutiveProduct, c2FactorialZeros, c2EquivalentCondition, c2PartialFractionSum, c2BounceHeight, c2InvariantRatio, c2PondDepth });
export const COURSE2_A5_TYPE_ROWS = [
  ["c2-divisibility-digits", "number", "소인수분해", "배수판정법으로 빈칸 숫자 찾기", "c2DivisibilityDigits"],
  ["c2-square-multiplier", "number", "소인수분해", "곱하거나 나누어 제곱수 만들기", "c2SquareMultiplier"],
  ["c2-consecutive-product", "number", "소인수분해", "연속한 세 수의 곱으로 수 찾기", "c2ConsecutiveProduct"],
  ["c2-factorial-zeros", "number", "소인수분해", "1부터 N까지의 곱의 끝자리 0", "c2FactorialZeros"],
  ["c2-equivalent-condition", "number", "크기가 같은 분수", "조건에 맞는 크기가 같은 분수", "c2EquivalentCondition"],
  ["c2-partial-fraction-sum", "number", "크기가 같은 분수", "부분분수로 지워지는 합", "c2PartialFractionSum"],
  ["c2-bounce-height", "number", "포함과 배제", "튀어 오른 공의 높이", "c2BounceHeight"],
  ["c2-invariant-ratio", "number", "변하지 않는 것 찾기", "변하지 않는 양으로 비 맞추기", "c2InvariantRatio"],
  ["c2-pond-depth", "number", "변하지 않는 것 찾기", "두 막대로 잰 연못의 깊이", "c2PondDepth"]
];
export const COURSE2_A5_GUIDES = Object.freeze({
  "c2-divisibility-digits": "합성수의 배수는 서로소인 두 배수 판정을 함께 씁니다(36 = 4 × 9). 빈칸을 하나씩 넣어 확인합니다.",
  "c2-square-multiplier": "소인수분해해서 거듭제곱이 홀수 번인 소인수를 짝수 번으로 맞춥니다.",
  "c2-consecutive-product": "곱을 소인수분해한 뒤 서로 가까운 세 수로 묶습니다.",
  "c2-factorial-zeros": "끝자리 0의 개수 = 곱에 들어 있는 5의 개수(25·125의 배수는 두세 번 셉니다).",
  "c2-equivalent-condition": "크기가 같은 분수는 분자·분모에 같은 수를 곱한 것 — 합·차도 그만큼 배가 됩니다.",
  "c2-partial-fraction-sum": "1/(앞 수 × 뒤 수)를 1/(앞 수) − 1/(뒤 수)로 쪼개면 가운데 항이 지워집니다.",
  "c2-bounce-height": "튈 때마다 같은 분수배 — 거꾸로는 그 분수로 나눕니다.",
  "c2-invariant-ratio": "나이 차·주고받은 뒤의 합·똑같이 쓴 뒤의 차처럼 변하지 않는 양을 기준으로 칸을 맞춥니다.",
  "c2-pond-depth": "물에 잠긴 길이가 같다는 것을 기준으로 두 막대를 깊이의 몇 배로 나타냅니다."
});
