// 2과정 A3 「규칙성과 수열」 교재 유사문제 생성기. 약속은 G1~G5·A1·A2 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 문제를 만든 수에서 직접 세거나 계산한다(규칙 식을 쓰더라도 작은 경우는 하나씩 세어 맞춘다).
// 분수·거듭제곱은 글 속에 「3/5」「2^5」로 쓰면 화면·인쇄에서 수식으로 바뀐다(math-markup.js mathText).
import { plainText } from "./course2-plain.js?v=20261122zi";
import { mathText } from "./math-markup.js?v=20261122w";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", YELLOW = "#fff1bf";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
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
const circle = (x, y, r, { fill = "none", color = INK, width = 1.6 } = {}) =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
// 식 칠판 — SVG 글자로는 분수를 쌓을 수 없어 HTML + 공통 수식(math-markup)으로 그린다(빗금 분수 금지). 모양은 글 안 style(화면·인쇄 같음).
const board = (lines) => `<div class="c2-formula" role="img" aria-label="식" style="display:grid;gap:.55em;justify-items:center;padding:.7em 1.1em;margin:0 auto;max-width:100%;box-sizing:border-box;background:${SOFT};border:2px solid ${GREEN};border-radius:8px;color:${INK};font-weight:600;font-size:1.12em;line-height:1.5;text-align:center">${lines.map((t) => `<div>${mathText(esc(t))}</div>`).join("")}</div>`;

// ════ 1단원 카프리카수와 등차수열 ════
// 1. 분수를 소수로 — 되풀이되는 마디로 소수 □째 자리 숫자 찾기
function decimalDigits(n, d, count) {
  const out = []; let r = n % d;
  for (let i = 0; i < count; i += 1) { r *= 10; out.push(Math.floor(r / d)); r %= d; }
  return out;
}
function c2RepeatingDecimal({ difficulty = 2 }) {
  const d = sample(difficulty <= 1 ? [3, 9, 11] : [7, 13, 27, 37, 11, 33]);
  let n = randomInt(1, d - 1);
  while (gcd(n, d) !== 1) n = randomInt(1, d - 1);
  const digits = decimalDigits(n, d, 60);
  let period = 1;
  while (period < 30 && !digits.every((v, i) => i < period || v === digits[i - period])) period += 1;
  const block = digits.slice(0, period).join("");
  const k = randomInt(difficulty <= 1 ? 10 : 20, difficulty <= 1 ? 30 : difficulty === 2 ? 80 : 300);
  const r = k % period;
  const ans = digits[(r || period) - 1];
  return problem({
    prompt: `${n}/${d}${hasBatchim(n) ? "을" : "를"} 소수로 나타낼 때, 소수점 아래 ${k}번째 자리 숫자는 무엇인가요?`,
    subtype: "repeat-decimal", html: board([`${n} ÷ ${d} = 0.${digits.slice(0, Math.min(14, period * 2)).join("")}…`]), answer: ans,
    solution: `나누어 보면 0.${block}${block}…처럼 「${block}」 ${period}개가 되풀이됩니다. ${k} ÷ ${period} = ${Math.floor(k / period)} … ${r}이므로 ${r ? `마디의 ${r}번째` : "마디의 마지막"} 숫자 ${ans}입니다.`,
    family: "c2-repeat-decimal", meta: { n, d, k, period }
  });
}

// 2. 거듭제곱의 일의 자리 — 일의 자리도 마디로 되풀이된다
function c2PowerLastDigit({ difficulty = 2 }) {
  const a = sample(difficulty <= 1 ? [2, 3, 4] : [2, 3, 7, 8, 12, 13, 17]);
  const k = randomInt(difficulty <= 1 ? 6 : 20, difficulty <= 1 ? 20 : 100);
  const cycle = []; let v = a % 10;
  do { cycle.push(v); v = (v * (a % 10)) % 10; } while (v !== cycle[0] && cycle.length < 5);
  const r = k % cycle.length;
  const ans = cycle[(r || cycle.length) - 1];
  return problem({
    prompt: `${josa(a, "을", "를")} ${k}번 곱한 수(${a}^${k})의 일의 자리 숫자는 무엇인가요?`,
    subtype: "power-digit", html: board(cycle.map((c, i) => `${a}^${i + 1}의 일의 자리 → ${c}`).slice(0, 4)), answer: ans,
    solution: `일의 자리만 보면 ${josa(cycle.join(", "), "이", "가")} ${cycle.length}번마다 되풀이됩니다. ${k} ÷ ${cycle.length} = ${Math.floor(k / cycle.length)} … ${r}이므로 ${r ? `${r}번째` : "마지막"} 것인 ${ans}입니다.`,
    family: "c2-power-digit", meta: { a, k, cycle }
  });
}

// 3. 등차수열 — □번째 수 · 몇 번째 수 · 사이의 수 개수
function c2ArithSequence({ difficulty = 2 }) {
  const a = randomInt(1, 20), dd = randomInt(2, difficulty <= 1 ? 5 : 9) * (difficulty === 3 && Math.random() < 0.3 ? -1 : 1);
  const start = dd < 0 ? a + 200 : a;
  const seq = (n) => start + (n - 1) * dd;
  const kind = difficulty <= 1 ? "nth" : sample(["nth", "which", "between"]);
  const shown = [1, 2, 3, 4].map(seq).join(", ") + ", …";
  if (kind === "nth") {
    const n = randomInt(10, difficulty <= 1 ? 25 : 60);
    return problem({
      prompt: `수열 ${shown}에서 ${n}번째 수는 무엇인가요?`, subtype: "arith", html: board([shown]), answer: seq(n),
      solution: `${Math.abs(dd)}씩 ${dd > 0 ? "커지는" : "작아지는"} 수열입니다. ${n}번째 수는 첫 번째 수에서 ${dd > 0 ? "" : "−"}${Math.abs(dd)}를 ${n - 1}번 ${dd > 0 ? "더한" : "뺀"} 수이므로 ${start} ${dd > 0 ? "+" : "−"} ${Math.abs(dd)} × ${n - 1} = ${seq(n)}입니다.`,
      family: "c2-arith", meta: { start, dd, n }
    });
  }
  if (kind === "which") {
    const n = randomInt(12, 70), target = seq(n);
    return problem({
      prompt: `수열 ${shown}에서 ${josa(target, "은", "는")} 몇 번째 수인가요?`, subtype: "arith", html: board([shown]), answer: `${n}번째`,
      solution: `${josa(target, "은", "는")} 첫 번째 수 ${start}에서 ${Math.abs(target - start)}만큼 ${dd > 0 ? "커진" : "작아진"} 수이고, 한 번에 ${Math.abs(dd)}씩 변하므로 ${Math.abs(target - start)} ÷ ${Math.abs(dd)} = ${n - 1}번 변했습니다. ${n - 1} + 1 = ${n}번째입니다.`,
      family: "c2-arith", meta: { start, dd, n }
    });
  }
  const lo = randomInt(50, 150), hi = lo + randomInt(60, 200);
  const step = Math.abs(dd), first = a;
  let count = 0;
  for (let v = first; v <= hi; v += step) if (v >= lo) count += 1;
  return problem({
    prompt: `${first}부터 시작하여 ${step}씩 뛰어 센 수 가운데 ${lo} 이상 ${hi} 이하인 수는 몇 개인가요?`, subtype: "arith",
    html: board([`${first}, ${first + step}, ${first + 2 * step}, …`]), answer: `${count}개`,
    solution: `뛰어 센 수는 ${first}, ${first + step}, …입니다. ${lo} 이상에서 처음 나오는 수와 ${hi} 이하에서 마지막 수를 찾아, 그 사이를 ${step}씩 세면 ${count}개입니다.`,
    family: "c2-arith", meta: { first, step, lo, hi, count }
  });
}

// 4. 묶음으로 늘어놓은 분수 — 1/1, 1/2, 2/2, 1/3, 2/3, 3/3, …
function c2FractionSequence({ difficulty = 2 }) {
  // 교재 활동 3: 분자와 분모가 각각 같은 수씩 커지는(등차수열) 분수 — 분자·분모를 따로 본다
  if (sample(["arith", "group"]) === "arith") {
    const p0 = randomInt(1, 6), dp = randomInt(1, 4), q0 = p0 + randomInt(1, 6), dq = randomInt(dp, dp + 4);
    const k = randomInt(difficulty <= 1 ? 10 : 20, difficulty <= 1 ? 20 : difficulty === 2 ? 50 : 120);
    const at = (n) => [p0 + dp * (n - 1), q0 + dq * (n - 1)];
    const shown = [1, 2, 3, 4].map((n) => at(n).join("/")).join(", ") + ", …";
    const [p, q] = at(k);
    return problem({
      prompt: `분수를 규칙에 따라 늘어놓았습니다. ${shown} ${k}번째 분수는 무엇인가요?`, subtype: "frac-seq", html: board([shown]), answer: `${p}/${q}`,
      solution: `분자는 ${p0}부터 ${dp}씩, 분모는 ${q0}부터 ${dq}씩 커집니다. ${k}번째 분자는 ${p0} + ${dp} × ${k - 1} = ${p}, 분모는 ${q0} + ${dq} × ${k - 1} = ${q}이므로 ${p}/${q}입니다.`,
      family: "c2-frac-seq", meta: { style: "arith", k, p0, dp, q0, dq }
    });
  }
  const style = sample(["up", "updown"]);
  const term = (k) => { // k번째(1부터)
    let g = 1; while (k > g) { k -= g; g += 1; }
    return style === "up" ? [k, g] : [k, g + 1 - k];
  };
  const shownTerms = Array.from({ length: 6 }, (_, i) => term(i + 1));
  const shown = shownTerms.map(([p, q]) => (style === "up" ? `${p}/${q}` : `${p}/${q}`)).join(", ") + ", …";
  const kind = difficulty <= 1 ? "nth" : sample(["nth", "position"]);
  if (kind === "nth") {
    const k = randomInt(difficulty <= 1 ? 12 : 30, difficulty <= 1 ? 30 : 120);
    const [p, q] = term(k);
    let g = 1, used = 0; while (used + g < k) { used += g; g += 1; }
    return problem({
      prompt: `분수를 규칙에 따라 늘어놓았습니다. ${shown} ${k}번째 분수는 무엇인가요?`, subtype: "frac-seq", html: board([shown]), answer: `${p}/${q}`,
      solution: `묶음마다 분수가 1개, 2개, 3개 … 들어 있습니다. ${g - 1}번째 묶음까지 ${used}개이므로 ${k}번째는 ${g}번째 묶음의 ${k - used}번째 분수 ${p}/${q}입니다.`,
      family: "c2-frac-seq", meta: { style, k }
    });
  }
  const g = randomInt(5, 15), i = randomInt(1, g);
  const pos = (g * (g - 1)) / 2 + i;
  const [p, q] = term(pos);
  return problem({
    prompt: `분수를 규칙에 따라 늘어놓았습니다. ${shown} ${p}/${q}${hasBatchim(p) ? "은" : "는"} 처음으로 몇 번째에 나오나요?`, subtype: "frac-seq", html: board([shown]), answer: `${pos}번째`,
    solution: `${p}/${q}${hasBatchim(p) ? "은" : "는"} ${g}번째 묶음의 ${i}번째 분수입니다. 앞 묶음까지 1 + 2 + … + ${g - 1} = ${pos - i}개이므로 ${pos - i} + ${i} = ${pos}번째입니다.`,
    family: "c2-frac-seq", meta: { style, pos }
  });
}

// 5. 줄마다 하나씩(또는 홀수 개씩) 늘려 수를 써 나갈 때 □번째 줄의 □번째 수
function c2GroupRows({ difficulty = 2 }) {
  const odd = difficulty === 3 ? sample([true, false]) : false;
  const len = (r) => (odd ? 2 * r - 1 : r);
  const r = randomInt(5, difficulty <= 1 ? 8 : 20), c = randomInt(1, len(r));
  let before = 0; for (let k = 1; k < r; k += 1) before += len(k);
  const value = before + c;
  const rows = [1, 2, 3, 4].map((k) => { let b = 0; for (let j = 1; j < k; j += 1) b += len(j); return Array.from({ length: len(k) }, (_, i) => b + i + 1).join(" "); });
  return problem({
    prompt: `1부터 차례로 수를 써 나가는데 ${odd ? "첫째 줄에 1개, 둘째 줄에 3개처럼 홀수 개씩" : "첫째 줄에 1개, 둘째 줄에 2개처럼 하나씩 늘려"} 씁니다. ${r}번째 줄의 ${c}번째 수는 무엇인가요?`,
    subtype: "rows", html: board(rows.map((t, i) => `${i + 1}줄: ${t}`)), answer: value,
    solution: `${r - 1}번째 줄까지 쓴 수는 ${odd ? `1 + 3 + … + ${2 * (r - 1) - 1} = ${r - 1} × ${r - 1}` : `1 + 2 + … + ${r - 1}`} = ${before}개입니다. ${r}번째 줄의 ${c}번째 수는 ${before} + ${c} = ${value}입니다.`,
    family: "c2-rows", meta: { r, c, odd, value }
  });
}

// ════ 2단원 삼각수와 묶음수열 ════
// 6. 가우스의 덧셈 — 첫 수와 끝 수를 짝 지어 더하기
function c2GaussSum({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "plain" : sample(["plain", "step", "fraction"]);
  if (kind === "fraction") {
    const d = sample([3, 5, 7, 9]), n = randomInt(10, 40);
    const total = (n * (n + 1)) / 2;
    return problem({
      prompt: `1/${d} + 2/${d} + 3/${d} + … + ${n}/${d}의 값을 구하세요.`, subtype: "gauss", html: board([`1 + 2 + … + ${n}`, `분모는 모두 ${d}`]),
      answer: Number.isInteger(total / d) ? total / d : `${total}/${d}`,
      solution: `분모가 같으니 분자만 더합니다. 1 + 2 + … + ${n} = (1 + ${n}) × ${n} ÷ 2 = ${total}이므로 ${total}/${d}${Number.isInteger(total / d) ? ` = ${total / d}` : ""}입니다.`,
      family: "c2-gauss", meta: { d, n, total }
    });
  }
  const a = kind === "plain" ? 1 : randomInt(2, 50), step = kind === "plain" ? 1 : randomInt(2, 9);
  const n = randomInt(difficulty <= 1 ? 10 : 15, difficulty <= 1 ? 30 : 60);
  const last = a + (n - 1) * step, sum = ((a + last) * n) / 2;
  return problem({
    prompt: kind === "plain" ? `1 + 2 + 3 + … + ${n}의 값을 구하세요.` : `${a}부터 시작하여 ${step}씩 뛰어 센 수 ${n}개를 모두 더하면 얼마인가요?`,
    subtype: "gauss", html: board([`${a} + ${a + step} + … + ${last}`, `${last} + … + ${a + step} + ${a}`]), answer: comma(sum),
    solution: `${kind === "plain" ? "" : `마지막 수는 ${a} + ${step} × ${n - 1} = ${last}입니다. `}거꾸로 한 줄을 더 써서 짝 지으면 한 짝의 합이 ${a} + ${last} = ${a + last}이고 짝이 ${n}개입니다. 두 줄의 합의 절반이므로 ${a + last} × ${n} ÷ 2 = ${comma(sum)}입니다.`,
    family: "c2-gauss", meta: { a, step, n, sum }
  });
}

// 7. 삼각수·사각수·오각수·육각수 — 점으로 만든 모양의 □번째 점 개수
function figurate(sides, k) { return ((sides - 2) * k * k - (sides - 4) * k) / 2; }
function c2FigurateNumber({ difficulty = 2 }) {
  const sides = difficulty <= 1 ? 3 : sample([3, 3, 5, 6]);
  const name = { 3: "삼각형", 5: "오각형", 6: "육각형" }[sides];
  const k = randomInt(difficulty <= 1 ? 5 : 7, difficulty <= 1 ? 10 : 20);
  const first = [1, 2, 3, 4].map((x) => figurate(sides, x));
  const ans = figurate(sides, k);
  let body = "";
  for (let r = 0; r < 4; r += 1) for (let c = 0; c <= r; c += 1) body += circle(40 + c * 18 - r * 9, 16 + r * 16, 5, { fill: YELLOW, color: GREEN, width: 1.2 });
  const html = svg(300, 90, body + text(200, 44, first.join(", ") + ", …", { size: 16 }), `${name} 모양으로 늘어놓은 점`);
  const add = sides - 2;
  return problem({
    prompt: `점을 ${name} 모양으로 늘어놓아 ${first.join(", ")}, …개가 되었습니다. ${k}번째 모양의 점은 몇 개인가요?`,
    subtype: "figurate", html, answer: `${ans}개`,
    solution: sides === 3
      ? `□번째 삼각형은 1 + 2 + … + □개입니다. 1 + 2 + … + ${k} = (1 + ${k}) × ${k} ÷ 2 = ${ans}개입니다.`
      : `늘어나는 점의 개수가 ${first[1] - first[0]}, ${first[2] - first[1]}, ${first[3] - first[2]} …처럼 ${add}씩 커집니다. 이렇게 ${k}번째까지 이어 더하면 ${ans}개입니다.`,
    family: "c2-figurate", meta: { sides, k, ans }
  });
}

// ════ 3단원 수와 숫자의 개수 ════
const digitsUpTo = (n) => { let t = 0; for (let k = 1; k <= n; k += 1) t += String(k).length; return t; };
// 8. 1부터 □까지 쓸 때 숫자의 개수 · 숫자 □이 나오는 횟수 · 쓴 숫자 수로 쪽수 찾기
function c2DigitCount({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "total" : sample(["total", "pages", "occur", "range"]);
  if (kind === "occur") {
    const n = randomInt(60, difficulty === 3 ? 999 : 300), dgt = randomInt(1, 9);
    let c = 0; for (let k = 1; k <= n; k += 1) c += String(k).split("").filter((x) => x === String(dgt)).length;
    return problem({
      prompt: `1부터 ${n}까지의 자연수를 모두 쓸 때 숫자 ${josa(dgt, "은", "는")} 모두 몇 번 쓰나요?`, subtype: "digits", html: board(["1 2 3 … 9 10 11 …"]), answer: `${c}번`,
      solution: `일의 자리, 십의 자리, 백의 자리에서 따로 셉니다. 자리마다 숫자 ${josa(dgt, "이", "가")} 나오는 횟수를 더하면 ${c}번입니다.`,
      family: "c2-digits", meta: { n, dgt, c }
    });
  }
  if (kind === "range") {
    const a = randomInt(100, 500), b = a + randomInt(50, 400);
    const total = digitsUpTo(b) - digitsUpTo(a - 1);
    const parts = []; for (let len = 1; len <= 4; len += 1) { const lo = Math.max(a, 10 ** (len - 1)), hi = Math.min(b, 10 ** len - 1); if (hi >= lo) parts.push(`${len}자리 수 ${hi - lo + 1}개 × ${len}`); }
    return problem({
      prompt: `${a}부터 ${b}까지의 자연수를 모두 쓸 때 숫자는 모두 몇 개 쓰나요?`, subtype: "digits", html: board([`${a}, ${a + 1}, …, ${b}`]), answer: `${comma(total)}개`,
      solution: `${parts.join(" + ")} = ${comma(total)}개입니다.`, family: "c2-digits", meta: { a, b, total }
    });
  }
  const n = randomInt(difficulty <= 1 ? 30 : 120, difficulty <= 1 ? 99 : difficulty === 2 ? 600 : 1500);
  const total = digitsUpTo(n);
  const parts = []; for (let len = 1; len <= 4; len += 1) { const lo = 10 ** (len - 1), hi = Math.min(n, 10 ** len - 1); if (hi >= lo) parts.push(`${len}자리 ${hi - lo + 1}개 × ${len} = ${(hi - lo + 1) * len}`); }
  if (kind === "pages") {
    return problem({
      prompt: `책의 1쪽부터 마지막 쪽까지 쪽수를 쓰는 데 숫자를 모두 ${comma(total)}개 썼습니다. 이 책은 몇 쪽까지 있나요?`, subtype: "digits", html: board(["1 … 9 → 9개", "10 … 99 → 180개"]), answer: `${n}쪽`,
      solution: `한 자리 쪽(1~9)에 9개, 두 자리 쪽(10~99)에 180개${n > 99 ? `, 세 자리 쪽은 한 쪽에 3개씩` : ""}을 씁니다. ${parts.join(", ")}를 더하면 ${comma(total)}개가 되는 마지막 쪽은 ${n}쪽입니다.`,
      family: "c2-digits", meta: { n, total }
    });
  }
  return problem({
    prompt: `1부터 ${n}까지의 자연수를 차례로 모두 쓸 때 숫자는 모두 몇 개 쓰나요?`, subtype: "digits", html: board(["1 … 9 → 한 자리", "10 … 99 → 두 자리"]), answer: `${comma(total)}개`,
    solution: `자릿수가 같은 수끼리 묶어 셉니다. ${parts.join(", ")}이므로 모두 ${comma(total)}개입니다.`, family: "c2-digits", meta: { n, total }
  });
}

// 9. 123456789101112… 처럼 이어 쓴 숫자의 □번째 숫자
function c2DigitPosition({ difficulty = 2 }) {
  const k = randomInt(difficulty <= 1 ? 15 : 40, difficulty <= 1 ? 120 : difficulty === 2 ? 400 : 1500);
  let s = ""; for (let n = 1; s.length < k + 5; n += 1) s += String(n);
  const ans = s[k - 1];
  let left = k, len = 1, cnt = 9, startNum = 1;
  while (left > len * cnt) { left -= len * cnt; len += 1; cnt *= 10; startNum *= 10; }
  const which = startNum + Math.floor((left - 1) / len), pos = (left - 1) % len;
  return problem({
    prompt: `1부터 자연수를 차례로 이어 써서 123456789101112…를 만들었습니다. 왼쪽부터 ${k}번째 숫자는 무엇인가요?`,
    subtype: "digit-pos", html: board(["1 2 3 4 5 6 7 8 9 1 0 1 1 1 2 …"]), answer: ans,
    solution: `한 자리 수 9개로 숫자 9개${k > 9 ? ", 두 자리 수 90개로 180개" : ""}${k > 189 ? ", 세 자리 수 900개로 2700개" : ""}를 씁니다. ${k}번째는 ${len}자리 수 부분에서 ${left}번째 숫자이므로 ${which}의 ${pos + 1}번째 숫자 ${ans}입니다.`,
    family: "c2-digit-pos", meta: { k, which, ans }
  });
}

export const COURSE2_A3_GENERATORS = plainText({ c2RepeatingDecimal, c2PowerLastDigit, c2ArithSequence, c2FractionSequence, c2GroupRows, c2GaussSum, c2FigurateNumber, c2DigitCount, c2DigitPosition });
export const COURSE2_A3_TYPE_ROWS = [
  ["c2-repeating-decimal", "pattern", "카프리카수", "분수를 소수로 — 되풀이되는 마디의 □번째 숫자", "c2RepeatingDecimal"],
  ["c2-power-last-digit", "pattern", "카프리카수", "거듭제곱의 일의 자리", "c2PowerLastDigit"],
  ["c2-arith-sequence", "pattern", "등차수열", "같은 수씩 변하는 수열의 □번째 수·몇 번째 수", "c2ArithSequence"],
  ["c2-fraction-sequence", "pattern", "분수 수열", "규칙대로 늘어놓은 분수 — 분자·분모 따로 · 묶음", "c2FractionSequence"],
  ["c2-group-rows", "pattern", "묶음수열", "줄마다 늘려 쓴 수의 □번째 줄 □번째 수", "c2GroupRows"],
  ["c2-gauss-sum", "pattern", "등차수열", "가우스의 덧셈 — 짝 지어 더하기", "c2GaussSum"],
  ["c2-figurate-number", "pattern", "삼각수", "삼각수·오각수·육각수의 점 개수", "c2FigurateNumber"],
  ["c2-digit-count", "number", "수와 숫자의 개수", "수를 쓸 때 숫자의 개수와 쪽수", "c2DigitCount"],
  ["c2-digit-position", "number", "수와 숫자의 개수", "이어 쓴 숫자의 □번째 숫자", "c2DigitPosition"]
];
export const COURSE2_A3_GUIDES = Object.freeze({
  "c2-repeating-decimal": "나누어 되풀이되는 마디를 찾고, 자리 번호를 마디 길이로 나눈 나머지를 봅니다.",
  "c2-power-last-digit": "일의 자리만 곱해 가면 마디가 생깁니다. 지수를 마디 길이로 나눈 나머지를 봅니다.",
  "c2-arith-sequence": "□번째 수 = 첫 번째 수 + 차 × (□ − 1) — 변한 횟수는 번째보다 하나 적습니다.",
  "c2-fraction-sequence": "분자와 분모를 따로 봅니다 — 각각 같은 수씩 커지면 □번째 분자·분모를 따로 구하고, 묶음으로 되풀이되면 앞 묶음까지의 개수(1 + 2 + …)로 자리를 찾습니다.",
  "c2-group-rows": "앞 줄까지 쓴 수의 개수를 먼저 구하면 그 줄의 수가 바로 나옵니다.",
  "c2-gauss-sum": "거꾸로 한 줄을 더 써서 짝 지으면 합이 모두 같습니다 — (첫 수 + 끝 수) × 개수 ÷ 2.",
  "c2-figurate-number": "늘어나는 점의 개수가 어떻게 변하는지 표로 적어 이어 더합니다.",
  "c2-digit-count": "한 자리·두 자리·세 자리 수로 나누어 (개수 × 자릿수)를 더합니다.",
  "c2-digit-position": "한 자리 수 9개, 두 자리 수 180개 …를 빼 가며 몇 자리 수 부분인지 먼저 찾습니다."
});
