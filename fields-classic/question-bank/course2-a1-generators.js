// 2과정 A1 「마디수열과 비」 교재 유사문제 생성기. 약속은 G1~G5 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 문제를 만든 수에서 계산한다.
// 분수는 글 속에 「3/5」로 쓰면 화면·인쇄에서 수식 분수로 바뀐다(math-markup.js mathText).

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const shuffle = (items) => { const a = [...items]; for (let i = a.length - 1; i > 0; i -= 1) { const j = randomInt(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf", WOOD = "#d9b37c";
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// 받침에 따라 조사 고르기: josa("탁구공", "을", "를") → "탁구공을" (숫자는 읽는 소리로)
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
const line = (x1, y1, x2, y2, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const rect = (x, y, w, h, { fill = "none", color = INK, width = 1.6, rx = 0 } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const circle = (x, y, r, { fill = "none", color = INK, width = 1.8 } = {}) =>
  `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;

// SVG 안의 분수는 빗금 대신 위아래로 쌓아 그린다
const svgFrac = (x, y, top, bottom, size = 18) => text(x, y - size * 0.62, top, { size }) + line(x - size * 0.8, y, x + size * 0.8, y, { width: 1.8 }) + text(x, y + size * 0.62, bottom, { size });

// 반복 마디에 쓰는 모양(작은 그림 하나씩)
const SHAPES = {
  "○": (x, y) => circle(x, y, 11),
  "●": (x, y) => circle(x, y, 11, { fill: INK }),
  "△": (x, y) => `<polygon points="${x},${y - 12} ${x - 12},${y + 9} ${x + 12},${y + 9}" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`,
  "□": (x, y) => rect(x - 10, y - 10, 20, 20),
  "☆": (x, y) => text(x, y + 1, "☆", { size: 24 }),
  "♡": (x, y) => text(x, y + 1, "♡", { size: 24 })
};
const SHAPE_NAME = { "○": "흰 바둑돌", "●": "검은 바둑돌", "△": "세모", "□": "네모", "☆": "별", "♡": "하트" };
function shapeRow(items, { gap = 32, showDots = true } = {}) {
  const w = items.length * gap + (showDots ? 48 : 16);
  const body = items.map((s, i) => SHAPES[s](22 + i * gap, 24)).join("") + (showDots ? text(items.length * gap + 22, 24, "…", { size: 20 }) : "");
  return svg(w, 48, body, "늘어놓은 모양");
}

// ════ 1단원 마디수열과 규칙 찾기 ════
// 1. 반복 마디 — 몇 번째 모양 / 몇 번째까지 어떤 모양이 몇 개
function c2PeriodNth({ difficulty = 2 }) {
  const pool = difficulty <= 1 ? ["○", "●"] : sample([["○", "●"], ["△", "□", "○"], ["☆", "♡", "△", "□"]]);
  const len = difficulty <= 1 ? randomInt(3, 4) : randomInt(4, 6);
  let block;
  do { block = Array.from({ length: len }, () => sample(pool)); } while (new Set(block).size < Math.min(pool.length, 2) || block.every((s) => s === block[0]));
  const shown = [...block, ...block];
  const n = difficulty <= 1 ? randomInt(13, 30) : difficulty === 2 ? randomInt(30, 70) : randomInt(70, 150);
  const q = Math.floor(n / len), r = n % len;
  const kind = sample(["nth", "count"]);
  if (kind === "nth") {
    const item = block[(r || len) - 1];
    return problem({
      prompt: `모양을 같은 차례로 되풀이하여 늘어놓았습니다. ${n}번째에 오는 모양은 무엇인가요?`,
      subtype: "period", html: shapeRow(shown), answer: item,
      solution: `되풀이되는 마디는 ${len}개입니다. ${n} ÷ ${len} = ${q} … ${r}이므로 ${r ? `마디를 ${q}번 지나고 다음 마디의 ${r}번째` : `마디 ${q}번째의 마지막`} 모양인 ${item}입니다.`,
      family: "c2-period", meta: { block, n, len, item }
    });
  }
  const target = sample([...new Set(block)]);
  const inBlock = block.filter((s) => s === target).length;
  const inRest = block.slice(0, r).filter((s) => s === target).length;
  const count = q * inBlock + inRest;
  return problem({
    prompt: `모양을 같은 차례로 되풀이하여 ${n}개 늘어놓았습니다. ${SHAPE_NAME[target]}(${target})는 모두 몇 개인가요?`,
    subtype: "period", html: shapeRow(shown), answer: `${count}개`,
    solution: `마디 하나(${len}개)에 ${target}가 ${inBlock}개 있습니다. ${n} ÷ ${len} = ${q} … ${r}이므로 ${r ? `${q} × ${inBlock} = ${q * inBlock}개에, 남은 ${r}개 안의 ${inRest}개를 더해 ${count}개입니다.` : `마디가 꼭 ${q}번이라 ${q} × ${inBlock} = ${count}개입니다.`}`,
    family: "c2-period", meta: { block, n, len, count }
  });
}

// 2. 수가 되풀이되는 마디 — 몇 번째 수 / 몇 번째까지의 합
function c2PeriodNumberSum({ difficulty = 2 }) {
  const len = difficulty <= 1 ? 3 : randomInt(3, 5);
  const block = Array.from({ length: len }, () => randomInt(1, difficulty <= 1 ? 5 : 9));
  if (new Set(block).size === 1) block[0] = (block[0] % 9) + 1;
  const n = difficulty <= 1 ? randomInt(10, 20) : difficulty === 2 ? randomInt(20, 45) : randomInt(45, 90);
  const q = Math.floor(n / len), r = n % len;
  const blockSum = block.reduce((a, b) => a + b, 0), restSum = block.slice(0, r).reduce((a, b) => a + b, 0);
  const shown = [...block, ...block, block[0]].join(", ") + ", …";
  const kind = difficulty <= 1 ? "nth" : sample(["nth", "sum"]);
  const html = svg(360, 44, rect(4, 4, 352, 36, { fill: SOFT, color: GREEN, rx: 8 }) + text(180, 22, shown, { size: 17 }), "늘어놓은 수");
  if (kind === "nth") {
    const v = block[(r || len) - 1];
    return problem({
      prompt: `수를 같은 차례로 되풀이하여 늘어놓았습니다. ${n}번째 수는 무엇인가요?`,
      subtype: "period-number", html, answer: v,
      solution: `마디는 (${block.join(", ")})로 ${len}개입니다. ${n} ÷ ${len} = ${q} … ${r}이므로 ${r ? `마디의 ${r}번째` : "마디의 마지막"} 수 ${v}입니다.`,
      family: "c2-period-number", meta: { block, n, v }
    });
  }
  const total = q * blockSum + restSum;
  return problem({
    prompt: `수를 같은 차례로 되풀이하여 늘어놓았습니다. 첫 번째부터 ${n}번째까지 수를 모두 더하면 얼마인가요?`,
    subtype: "period-number", html, answer: total,
    solution: `마디 (${block.join(", ")})의 합은 ${blockSum}입니다. ${n} ÷ ${len} = ${q} … ${r}이므로 ${r ? `${blockSum} × ${q} = ${q * blockSum}에 남은 ${r}개의 합 ${josa(restSum, "을", "를")} 더해 ${total}입니다.` : `마디가 꼭 ${q}번이라 ${blockSum} × ${q} = ${total}입니다.`}`,
    family: "c2-period-number", meta: { block, n, total }
  });
}

// ════ 2단원 양팔저울과 비 ════
// 3. 가짜 금화 찾기 — 양팔저울을 적어도 몇 번 써야 하나
function c2FakeCoin({ difficulty = 2 }) {
  const n = difficulty <= 1 ? sample([3, 4, 5, 6, 8, 9]) : difficulty === 2 ? sample([9, 10, 12, 15, 20, 27]) : sample([27, 28, 40, 60, 81, 100]);
  let k = 0, cap = 1;
  while (cap < n) { cap *= 3; k += 1; }
  const thing = sample(["금화", "구슬", "탁구공"]);
  const shown = Math.min(n, 12);
  let body = `<path d="M 60 70 L 220 70 M 140 70 L 140 120 M 110 120 L 170 120" stroke="${INK}" stroke-width="2.4" fill="none"/>`
    + `<path d="M 40 70 Q 60 96 80 70 M 200 70 Q 220 96 240 70" stroke="${INK}" stroke-width="1.8" fill="${SOFT}"/>`;
  body += Array.from({ length: shown }, (_, i) => circle(270 + (i % 6) * 22, 50 + Math.floor(i / 6) * 22, 9, { fill: YELLOW })).join("");
  if (n > shown) body += text(270 + 5 * 22, 104, `… 모두 ${n}개`, { size: 13, anchor: "end" });
  return problem({
    prompt: `모양이 같은 ${thing} ${n}개 가운데 1개만 다른 것보다 가볍습니다. 양팔저울로 가벼운 ${josa(thing, "을", "를")} 반드시 찾으려면 저울을 적어도 몇 번 써야 하나요?`,
    subtype: "fake-coin", html: svg(420, 130, body, "양팔저울과 금화"), answer: `${k}번`,
    solution: `저울 한 번이면 셋으로 나눈 묶음 가운데 가벼운 것이 든 묶음을 알 수 있습니다(왼쪽·오른쪽·저울에 올리지 않은 것). 한 번에 3배씩 찾을 수 있는 개수가 늘어 ${Array.from({ length: k }, (_, i) => 3 ** (i + 1)).join(" → ")}이고, ${n}개는 ${3 ** k}개 안이므로 ${k}번이면 됩니다.`
      + (k > 1 ? ` ${k - 1}번으로는 ${3 ** (k - 1)}개까지만 찾을 수 있어 모자랍니다.` : ""),
    family: "c2-fake-coin", meta: { n, k }
  });
}

// 4. 몇 배가 같고 차가 주어진 두 수(값) — 4 × A = 7 × B, A − B = d
function c2RatioDifference({ difficulty = 2 }) {
  let a, b;
  do { a = randomInt(2, difficulty <= 1 ? 5 : 9); b = randomInt(2, difficulty <= 1 ? 5 : 9); } while (a === b || gcd(a, b) !== 1);
  // a × A = b × B → A : B = b : a, 한 칸 = u
  const u = difficulty <= 1 ? randomInt(2, 9) : difficulty === 2 ? randomInt(5, 30) : randomInt(20, 90) * 10;
  const A = b * u, B = a * u;
  const big = A > B ? "A" : "B";
  const d = Math.abs(A - B);
  const story = sample(["number", "price"]);
  const body = [["A", b], ["B", a]].map(([label, cells], row) => text(16, 26 + row * 34, label, { size: 15, weight: 700 })
    + Array.from({ length: cells }, (_, i) => rect(34 + i * 30, 12 + row * 34, 30, 26, { fill: row ? YELLOW : SOFT })).join("")).join("");
  const html = svg(40 + Math.max(a, b) * 30, 84, body, "칸 막대");
  if (story === "price") {
    const [x, y] = sample([["귤", "감"], ["볼펜", "색연필"], ["사탕", "초콜릿"]]);
    const px = A * 10, py = B * 10;
    const pd = Math.abs(px - py);
    return problem({
      prompt: `${x} ${a}개의 값과 ${y} ${b}개의 값이 같습니다. ${px > py ? x : y} 1개가 ${px > py ? y : x} 1개보다 ${pd}원 비쌉니다. ${josa(x, "", "")} 1개와 ${y} 1개는 각각 얼마인가요?`,
      subtype: "ratio-diff", html: svg(40 + Math.max(a, b) * 30, 84, [[x.slice(0, 1), b], [y.slice(0, 1), a]].map(([label, cells], row) => text(16, 26 + row * 34, label, { size: 15, weight: 700 })
        + Array.from({ length: cells }, (_, i) => rect(34 + i * 30, 12 + row * 34, 30, 26, { fill: row ? YELLOW : SOFT })).join("")).join(""), "칸 막대"),
      answer: `${x} ${px}원, ${y} ${py}원`,
      solution: `${x} ${a}개 = ${y} ${b}개이므로 ${x} 1개 : ${y} 1개 = ${b} : ${a}입니다. 두 값의 차는 ${Math.abs(b - a)}칸이고 그것이 ${pd}원이므로 한 칸은 ${pd / Math.abs(b - a)}원입니다. ${x}는 ${b}칸 = ${px}원, ${y}는 ${a}칸 = ${py}원입니다.`,
      family: "c2-ratio-diff", meta: { a, b, px, py }
    });
  }
  return problem({
    prompt: `두 수 A, B가 있습니다. A의 ${a}배와 B의 ${b}배가 같고, ${big}가 ${big === "A" ? "B" : "A"}보다 ${d} 큽니다. A와 B를 각각 구하세요.`,
    subtype: "ratio-diff", html, answer: `A = ${A}, B = ${B}`,
    solution: `A × ${a} = B × ${b}이면 A : B = ${b} : ${a}입니다. 칸으로 나타내면 A는 ${b}칸, B는 ${a}칸이고 차 ${Math.abs(b - a)}칸이 ${d}이므로 한 칸은 ${u}입니다. A = ${b} × ${u} = ${A}, B = ${a} × ${u} = ${B}입니다.`,
    family: "c2-ratio-diff", meta: { a, b, A, B }
  });
}

// ════ 3단원 분수와 비 ════
// 5. A가 B의 p/q — 합이나 차로 각각 구하기
function c2FractionRatioSplit({ difficulty = 2 }) {
  let p, q;
  do { q = randomInt(3, difficulty <= 1 ? 5 : 9); p = randomInt(1, q + (difficulty === 3 ? 3 : -1)); } while (p === q || gcd(p, q) !== 1);
  const u = randomInt(2, difficulty <= 1 ? 6 : difficulty === 2 ? 12 : 25);
  const A = p * u, B = q * u;
  const [x, y] = sample([["동생", "언니"], ["사과나무", "배나무"], ["빨간 구슬", "파란 구슬"], ["남학생", "여학생"]]);
  const unitWord = /나무/.test(x) ? "그루" : /학생/.test(x) ? "명" : "개";
  const kind = sample(["sum", "diff"]);
  const known = kind === "sum" ? A + B : Math.abs(B - A);
  const body = [[x, p], [y, q]].map(([label, cells], row) => text(4, 26 + row * 34, label, { size: 13, anchor: "start", weight: 700 })
    + Array.from({ length: cells }, (_, i) => rect(92 + i * 26, 12 + row * 34, 26, 26, { fill: row ? YELLOW : SOFT })).join("")).join("");
  const html = svg(100 + Math.max(p, q) * 26, 84, body, "칸 막대");
  return problem({
    prompt: `${x}의 수는 ${y}의 수의 ${p}/${q}입니다. ${kind === "sum" ? `${josa(x, "과", "와")} ${josa(y, "을", "를")} 합하면 모두 ${known}${unitWord}입니다` : `${josa(A > B ? x : y, "이", "가")} ${A > B ? y : x}보다 ${known}${unitWord} 많습니다`}. ${josa(x, "과", "와")} ${josa(y, "은", "는")} 각각 몇 ${unitWord}인가요?`,
    subtype: "fraction-ratio", html, answer: `${x} ${A}${unitWord}, ${y} ${B}${unitWord}`,
    solution: `${josa(y, "을", "를")} ${q}칸으로 나누면 ${josa(x, "은", "는")} 그중 ${p}칸입니다(${x} : ${y} = ${p} : ${q}). ${kind === "sum" ? `모두 ${p + q}칸이 ${known}${unitWord}` : `차 ${Math.abs(q - p)}칸이 ${known}${unitWord}`}이므로 한 칸은 ${u}${unitWord}입니다. ${x} = ${p} × ${u} = ${A}, ${y} = ${q} × ${u} = ${B}입니다.`,
    family: "c2-fraction-ratio", meta: { p, q, A, B }
  });
}

// 6. 조건에 맞는 가분수 — 분자·분모의 합(차)과 몫·나머지
function c2ImproperFraction({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "sumdiff" : sample(["sumdiff", "sumQuot", "diffQuot", "mixed"]);
  if (kind === "mixed") {
    const d = randomInt(4, 13), w = randomInt(2, 6), r = randomInt(1, d - 1);
    const n = w * d + r;
    return problem({
      prompt: `분모가 ${d}인 가분수를 대분수로 바꾸었더니 자연수 부분이 ${w}, 분자가 ${r}이 되었습니다. 처음 가분수의 분자는 얼마인가요?`,
      subtype: "improper", html: svg(220, 70, text(56, 35, String(w), { size: 24 }) + svgFrac(84, 35, r, d) + text(122, 35, "=", { size: 22 }) + svgFrac(160, 35, "□", d), "대분수"), answer: n,
      solution: `자연수 ${w}은 ${d}/${d}가 ${w}번이므로 분자 ${d} × ${w} = ${w * d}에 ${r}을 더해 ${n}입니다.`,
      family: "c2-improper", meta: { d, w, r, n }
    });
  }
  let d, nNum, prompt, solution;
  if (kind === "sumdiff") {
    d = randomInt(3, 12); nNum = d + randomInt(1, 2 * d);
    const s = nNum + d, g = nNum - d;
    prompt = `분자와 분모의 합이 ${s}이고 분자가 분모보다 ${g} 더 큰 가분수를 구하세요.`;
    solution = `분자 = (합 + 차) ÷ 2 = (${s} + ${g}) ÷ 2 = ${nNum}, 분모 = (${s} − ${g}) ÷ 2 = ${d}입니다.`;
  } else {
    d = randomInt(3, 11);
    const qq = randomInt(2, 6), r = randomInt(1, d - 1);
    nNum = qq * d + r;
    if (kind === "sumQuot") {
      prompt = `어떤 가분수의 분자와 분모의 합은 ${nNum + d}입니다. 분자를 분모로 나누면 몫이 ${qq}, 나머지가 ${r}입니다. 이 가분수를 구하세요.`;
      solution = `분자 = 분모 × ${qq} + ${r}이므로 합은 분모 × ${qq + 1} + ${r} = ${nNum + d}입니다. 분모 = (${nNum + d} − ${r}) ÷ ${qq + 1} = ${d}, 분자 = ${d} × ${qq} + ${r} = ${nNum}입니다.`;
    } else {
      prompt = `어떤 가분수의 분자와 분모의 차는 ${nNum - d}입니다. 분자를 분모로 나누면 몫이 ${qq}, 나머지가 ${r}입니다. 이 가분수를 구하세요.`;
      solution = `분자 = 분모 × ${qq} + ${r}이므로 차는 분모 × ${qq - 1} + ${r} = ${nNum - d}입니다. 분모 = (${nNum - d} − ${r}) ÷ ${qq - 1} = ${d}, 분자 = ${d} × ${qq} + ${r} = ${nNum}입니다.`;
    }
  }
  return problem({
    prompt, subtype: "improper",
    html: svg(140, 70, text(70, 18, "분자", { size: 14, color: GREEN }) + line(30, 35, 110, 35, { width: 2.4 }) + text(70, 54, "분모", { size: 14, color: GREEN }), "분수"),
    answer: `${nNum}/${d}`, solution, family: "c2-improper", meta: { n: nNum, d }
  });
}

// 7. 나눗셈의 몫·나머지와 두 수의 합
function c2QuotientRemainderPair({ difficulty = 2 }) {
  const y = randomInt(difficulty <= 1 ? 4 : 6, difficulty === 3 ? 40 : 20);
  const q = randomInt(2, difficulty <= 1 ? 5 : 9), r = randomInt(1, y - 1);
  const x = q * y + r;
  const kind = sample(["sum", "diff"]);
  const known = kind === "sum" ? x + y : x - y;
  return problem({
    prompt: `두 수 ㉮, ㉯가 있습니다. ㉮를 ㉯로 나누면 몫이 ${q}이고 나머지가 ${r}입니다. 두 수의 ${kind === "sum" ? "합이" : "차가"} ${known}일 때 ㉮와 ㉯를 각각 구하세요.`,
    subtype: "quotient-remainder",
    html: svg(240, 56, text(120, 28, `㉮ ÷ ㉯ = ${q} … ${r}`, { size: 20 }), "나눗셈"),
    answer: `㉮ = ${x}, ㉯ = ${y}`,
    solution: `㉮ = ㉯ × ${q} + ${r}입니다. ${kind === "sum" ? `합은 ㉯ × ${q + 1} + ${r} = ${known}이므로 ㉯ = (${known} − ${r}) ÷ ${q + 1}` : `차는 ㉯ × ${q - 1} + ${r} = ${known}이므로 ㉯ = (${known} − ${r}) ÷ ${q - 1}`} = ${y}, ㉮ = ${y} × ${q} + ${r} = ${x}입니다.`,
    family: "c2-quotient-remainder", meta: { x, y, q, r }
  });
}

// ════ 4단원 가로수와 통나무 ════
// 8. 통나무 자르기 — 자르는 횟수 = 도막 수 − 1, 쉬는 횟수 = 자르는 횟수 − 1
function c2LogCutTime({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? sample(["rest", "scale"]) : sample(["rest", "scale", "length", "chime"]);
  const logFig = (pieces) => {
    const w = 300, h = 34, piece = w / pieces;
    let body = rect(10, 14, w, h, { fill: WOOD, rx: 6 });
    for (let i = 1; i < pieces; i += 1) body += line(10 + i * piece, 8, 10 + i * piece, 54, { color: MARK, width: 2, dash: "4 3" });
    return svg(320, 62, body, "통나무");
  };
  if (kind === "rest") {
    const c = randomInt(3, 9), rest = randomInt(1, 4), pieces = randomInt(4, difficulty === 3 ? 12 : 8);
    const cuts = pieces - 1, total = cuts * c + (cuts - 1) * rest;
    const unit = sample(["초", "분"]);
    return problem({
      prompt: `통나무를 한 번 자르는 데 ${c}${unit}가 걸리고, 한 번 자른 뒤에는 ${rest}${unit}씩 쉽니다. 통나무를 ${pieces}도막으로 자르는 데 모두 몇 ${unit}가 걸리나요? (마지막으로 자른 뒤에는 쉬지 않습니다.)`,
      subtype: "log-cut", html: logFig(pieces), answer: `${total}${unit}`,
      solution: `${pieces}도막이면 자르는 횟수는 ${cuts}번, 쉬는 횟수는 그보다 1 적은 ${cuts - 1}번입니다. ${c} × ${cuts} + ${rest} × ${cuts - 1} = ${total}${unit}입니다.`,
      family: "c2-log-cut", meta: { c, rest, pieces, total }
    });
  }
  if (kind === "scale") {
    const per = randomInt(2, 9), p1 = randomInt(3, 6), p2 = p1 + randomInt(2, 6);
    const t1 = per * (p1 - 1), t2 = per * (p2 - 1);
    return problem({
      prompt: `통나무 한 개를 쉬지 않고 ${p1}도막으로 자르는 데 ${t1}분이 걸렸습니다. 같은 빠르기로 같은 통나무를 ${p2}도막으로 자르려면 몇 분이 걸리나요?`,
      subtype: "log-cut", html: logFig(p1), answer: `${t2}분`,
      solution: `${p1}도막은 ${p1 - 1}번 자른 것이므로 한 번에 ${t1} ÷ ${p1 - 1} = ${per}분입니다. ${p2}도막은 ${p2 - 1}번 잘라야 하므로 ${per} × ${p2 - 1} = ${t2}분입니다.`,
      family: "c2-log-cut", meta: { per, p1, p2, t2 }
    });
  }
  if (kind === "length") {
    const seg = sample([10, 15, 20, 25, 30, 50]), pieces = randomInt(4, 10), c = randomInt(2, 8);
    const total = seg * pieces, cuts = pieces - 1;
    return problem({
      prompt: `길이가 ${total}cm인 통나무를 ${seg}cm씩 똑같이 자르려고 합니다. 한 번 자르는 데 ${c}분이 걸리고 쉬지 않는다면, 모두 자르는 데 몇 분이 걸리나요?`,
      subtype: "log-cut", html: logFig(pieces), answer: `${cuts * c}분`,
      solution: `${total} ÷ ${seg} = ${pieces}도막이고 자르는 횟수는 ${cuts}번입니다. ${c} × ${cuts} = ${cuts * c}분입니다.`,
      family: "c2-log-cut", meta: { seg, pieces, c }
    });
  }
  const ring = 1, gap = randomInt(2, 6), times = randomInt(5, 12);
  const total = times * ring + (times - 1) * gap;
  return problem({
    prompt: `시계탑의 종이 한 번 울리는 데 ${ring}초가 걸리고, 다음 종이 울리기 전까지 ${gap}초 동안 조용합니다. 종이 ${times}번 울리는 데 처음부터 끝까지 몇 초가 걸리나요?`,
    subtype: "log-cut", html: svg(320, 50, Array.from({ length: Math.min(times, 8) }, (_, i) => circle(24 + i * 38, 25, 8, { fill: GREEN, color: GREEN }) + (i < Math.min(times, 8) - 1 ? line(34 + i * 38, 25, 52 + i * 38, 25, { color: INK, dash: "3 3", width: 1.5 }) : "")).join(""), "종 울림"),
    answer: `${total}초`,
    solution: `${times}번 울리면 사이는 ${times - 1}번입니다. ${ring} × ${times} + ${gap} × ${times - 1} = ${total}초입니다.`,
    family: "c2-log-cut", meta: { gap, times, total }
  });
}

// 9. 곧은 길의 가로수 — 처음과 끝, 한쪽·양쪽, 거꾸로 길이 찾기
function c2RoadTrees({ difficulty = 2 }) {
  const s = sample([2, 3, 4, 5, 6, 8, 10]);
  const gaps = randomInt(4, difficulty === 3 ? 30 : 15);
  const L = s * gaps;
  const sides = difficulty <= 1 ? 1 : sample([1, 2]);
  const kind = difficulty <= 1 ? "count" : sample(["count", "count", "length", "between"]);
  const shown = Math.min(gaps, 8);
  let body = line(10, 40, 330, 40, { width: 3, color: "#8a8f8c" });
  for (let i = 0; i <= shown; i += 1) body += circle(10 + i * (320 / shown), 26, 7, { fill: GREEN, color: GREEN }) + (sides === 2 ? circle(10 + i * (320 / shown), 54, 7, { fill: GREEN, color: GREEN }) : "");
  const html = svg(340, 68, body, "길과 나무");
  const where = sides === 2 ? "양쪽" : "한쪽";
  if (kind === "count") {
    const n = (gaps + 1) * sides;
    return problem({
      prompt: `길이가 ${L}m인 곧은 길의 ${where}에 ${s}m 간격으로 나무를 심으려고 합니다. 길의 처음과 끝에도 심는다면 나무는 모두 몇 그루 필요한가요?`,
      subtype: "road-trees", html, answer: `${n}그루`,
      solution: `간격 수는 ${L} ÷ ${s} = ${gaps}개이고, 처음과 끝에 모두 심으므로 한쪽에 ${gaps} + 1 = ${gaps + 1}그루입니다.${sides === 2 ? ` 양쪽이므로 ${gaps + 1} × 2 = ${n}그루입니다.` : ""}`,
      family: "c2-road-trees", meta: { L, s, sides, n }
    });
  }
  if (kind === "length") {
    const n = (gaps + 1) * sides;
    return problem({
      prompt: `곧은 길의 ${where}에 ${s}m 간격으로 나무를 모두 ${n}그루 심었습니다. 길의 처음과 끝에도 심었다면 길의 길이는 몇 m인가요?`,
      subtype: "road-trees", html, answer: `${L}m`,
      solution: `${sides === 2 ? `한쪽에 ${n} ÷ 2 = ${gaps + 1}그루입니다. ` : ""}나무가 ${gaps + 1}그루이면 간격은 ${gaps}개이므로 길이는 ${s} × ${gaps} = ${L}m입니다.`,
      family: "c2-road-trees", meta: { L, s, sides, n }
    });
  }
  const inner = randomInt(1, 3);
  const lamps = gaps + 1, flowers = gaps * inner * sides;
  return problem({
    prompt: `길이가 ${L}m인 곧은 길의 ${where}에 ${s}m 간격으로 가로등을 처음과 끝까지 세우고, 가로등과 가로등 사이마다 꽃을 ${inner}송이씩 심었습니다. 꽃은 모두 몇 송이인가요?`,
    subtype: "road-trees", html, answer: `${flowers}송이`,
    solution: `한쪽의 가로등은 ${lamps}개, 그 사이는 ${gaps}곳입니다. ${gaps} × ${inner}${sides === 2 ? " × 2" : ""} = ${flowers}송이입니다.`,
    family: "c2-road-trees", meta: { L, s, sides, flowers }
  });
}

export const COURSE2_A1_GENERATORS = { c2PeriodNth, c2PeriodNumberSum, c2FakeCoin, c2RatioDifference, c2FractionRatioSplit, c2ImproperFraction, c2QuotientRemainderPair, c2LogCutTime, c2RoadTrees };
export const COURSE2_A1_TYPE_ROWS = [
  ["c2-period-nth", "pattern", "마디수열", "되풀이되는 마디로 몇 번째 모양과 개수 찾기", "c2PeriodNth"],
  ["c2-period-number-sum", "pattern", "마디수열", "되풀이되는 수의 몇 번째 수와 합", "c2PeriodNumberSum"],
  ["c2-fake-coin", "logic", "양팔저울", "가벼운 하나를 찾는 저울 횟수", "c2FakeCoin"],
  ["c2-ratio-difference", "number", "비", "몇 배가 같은 두 수와 차", "c2RatioDifference"],
  ["c2-fraction-ratio-split", "number", "분수와 비", "한쪽이 다른 쪽의 분수만큼 — 합·차로 각각 구하기", "c2FractionRatioSplit"],
  ["c2-improper-fraction", "number", "분수와 비", "조건에 맞는 가분수 찾기", "c2ImproperFraction"],
  ["c2-quotient-remainder-pair", "number", "분수와 비", "몫·나머지와 두 수의 합·차", "c2QuotientRemainderPair"],
  ["c2-log-cut-time", "number", "간격과 횟수", "통나무 자르는 횟수와 걸린 시간", "c2LogCutTime"],
  ["c2-road-trees", "number", "간격과 횟수", "곧은 길의 가로수 수와 길이", "c2RoadTrees"]
];
export const COURSE2_A1_GUIDES = Object.freeze({
  "c2-period-nth": "되풀이되는 마디의 길이로 나누어 몫(마디 수)과 나머지(다음 마디의 몇 번째)를 봅니다.",
  "c2-period-number-sum": "마디 하나의 합 × 마디 수 + 남은 몇 개의 합으로 셉니다.",
  "c2-fake-coin": "저울 한 번에 셋으로 나눈 묶음 중 하나를 고를 수 있어, 찾을 수 있는 개수가 3배씩 늘어납니다.",
  "c2-ratio-difference": "A × a = B × b이면 A : B = b : a — 칸으로 그려 차가 몇 칸인지 봅니다.",
  "c2-fraction-ratio-split": "기준이 되는 쪽을 분모만큼 칸으로 나누면 다른 쪽은 분자만큼의 칸입니다.",
  "c2-improper-fraction": "분자 = 분모 × 몫 + 나머지를 써서 분모 하나만 모르는 식으로 바꿉니다.",
  "c2-quotient-remainder-pair": "㉮ = ㉯ × 몫 + 나머지 — 합(차)에서 나머지를 빼고 (몫 ± 1)로 나눕니다.",
  "c2-log-cut-time": "도막 수 − 1 = 자르는 횟수, 자르는 횟수 − 1 = 쉬는 횟수입니다.",
  "c2-road-trees": "처음과 끝에 모두 심으면 나무 수 = 간격 수 + 1, 양쪽이면 두 배입니다."
});
