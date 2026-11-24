// 2과정 G2 「도형분할과 넓이」 교재 유사문제 생성기 (DESIGN-COURSE2.md 8절 2단계 — 기하 둘째 권).
// G1 생성기(course2-g1-generators.js)와 같은 약속: ({ difficulty }) → { prompt, visual:{kind:"c2", html}, answer, solution, meta }.
// 문제는 모두 새로 지은 것이다(교재 문장·그림을 옮기지 않는다). 답은 그림을 만든 수에서 계산하고, 세는 문제는 하나씩 세어 본다.
import { plainText } from "./course2-plain.js?v=20261122zi";
import { dimArc, isLength } from "./length-dim.js?v=20261124a";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf", BLUE = "#2f5fb3", GRID = "#c9d3cd";
const R = Math.PI / 180;
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);

function problem({ prompt, subtype, html, answer, solution, family, meta = {} }) {
  return { prompt, visual: { kind: "c2", subtype, html }, answer: String(answer), solution, meta: { family, answer, ...meta } };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const line = (a, b, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (points, { fill = "none", color = INK, width = 2 } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
const rect = (x, y, w, h, { fill = "none", color = INK, width = 2 } = {}) =>
  `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const circle = (c, r, { fill = "none", color = INK, width = 2 } = {}) => `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r)}" fill="${fill}" stroke="${color}" stroke-width="${width}"/>`;
const dot = (p, r = 3.2, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
function angleMark(v, a1, a2, r, label, { color = MARK, size = 14 } = {}) {
  let span = a2 - a1;
  while (span <= 0) span += 360;
  if (span > 180) { a1 = a2; span = 360 - span; }   // 표시는 늘 작은 쪽 각
  const p1 = at(v, r, a1), p2 = at(v, r, a1 + span), m = at(v, r + 15, a1 + span / 2);
  return `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    + (label ? text(m.x, m.y, label, { size, color }) : "");
}
const grid = (o, cols, rows, s, { color = GRID, width = 1.1 } = {}) => {
  let out = "";
  for (let i = 0; i <= cols; i += 1) out += line(P(o.x + i * s, o.y), P(o.x + i * s, o.y + rows * s), { color, width });
  for (let j = 0; j <= rows; j += 1) out += line(P(o.x, o.y + j * s), P(o.x + cols * s, o.y + j * s), { color, width });
  return out;
};
const dots = (o, n, s) => { let out = ""; for (let j = 0; j < n; j += 1) for (let i = 0; i < n; i += 1) out += dot(P(o.x + i * s, o.y + j * s), 3, "#8a948f"); return out; };
// 길이(「12cm」「?」)는 바깥 곡선 점선 + 끊은 자리에 글자(length-dim.js, 스킬 gfield-textbook-design 4-3), 그 밖의 글자는 변 옆 그대로.
// offset 쪽(변 진행 방향 왼쪽이 +)으로 휜다 — dimArc의 bend는 오른쪽이 +라 부호를 바꾼다.
// 세로에 가까운 변은 가로로 쓴 글자가 변에 닿지 않게 글자 반 폭만큼은 띄운다(clearBend)
const clearBend = (a, b, value, bend, size = 13) => {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, w = String(value).length * 0.62 * size, h = size * 1.1;
  const need = Math.abs(b.y - a.y) / len * w / 2 + Math.abs(b.x - a.x) / len * h / 2 + 3;
  return Math.sign(bend || 1) * Math.max(Math.abs(bend), need);
};
const lenLabel = (a, b, value, { offset = 14, color = INK, size = 13 } = {}) => {
  if (isLength(value)) return dimArc(a.x, a.y, b.x, b.y, clearBend(a, b, value, -offset * 0.9, size), value, { size, labelColor: color === INK ? null : color });
  const m = mid(a, b), d = dirOf(a, b) + 90, p = at(m, offset, d);
  return text(p.x, p.y, value, { size, color });
};

// ════ 1단원 도형분할과 정사각형 ════

// 1. 잘라 붙여 정사각형 만들기 — 넓이는 그대로이므로 정사각형 한 변 = 넓이가 같은 수를 두 번 곱한 수
function c2RearrangeSquareSide({ difficulty = 2 }) {
  const k = 22;
  if (difficulty <= 2) {
    const [w, h] = sample([[9, 4], [8, 2], [12, 3], [4, 1], [16, 4], [9, 1], [8, 8 / 4 * 1]].filter(([a, b]) => Number.isInteger(Math.sqrt(a * b)) && a !== b));
    const side = Math.sqrt(w * h);
    const o = P(20, 20), body = grid(o, w, h, k) + rect(o.x, o.y, w * k, h * k, { fill: YELLOW, width: 2.4 }) + grid(o, w, h, k, { color: "#b9c3bd", width: 0.8 });
    return problem({
      prompt: `모눈 한 칸은 한 변이 1cm인 정사각형입니다. 가로 ${w}cm, 세로 ${h}cm인 직사각형을 몇 조각으로 잘라 빈틈없이 붙여서 정사각형 하나를 만들었습니다. 이 정사각형의 한 변은 몇 cm인가요?`,
      subtype: "rearrange-square", html: svg(w * k + 40, h * k + 40, body, "직사각형"),
      answer: `${side}cm`,
      solution: `잘라 붙여도 넓이는 그대로입니다. 직사각형의 넓이는 ${w} × ${h} = ${w * h}㎠이고, 같은 수를 두 번 곱해 ${w * h}가 되는 수는 ${side}이므로 정사각형의 한 변은 ${side}cm입니다.`,
      family: "rearrange-square-rect", meta: { w, h }
    });
  }
  // 계단(ㄴ자) 모양: 아래 띠 + 위 띠의 넓이 = 정사각형 넓이
  for (let tries = 0; tries < 60; tries += 1) {
    const s = randomInt(4, 7), area = s * s;
    const h1 = randomInt(1, 3), w1 = randomInt(s + 1, 10);
    const rest = area - w1 * h1;
    if (rest <= 0) continue;
    const h2 = [1, 2, 3, 4, 5].find((h) => rest % h === 0 && rest / h < w1 && rest / h >= 2 && h + h1 <= 8);
    if (!h2) continue;
    const w2 = rest / h2, o = P(20, 20), top = o.y, H = (h1 + h2) * k;
    const pts = [P(o.x, top), P(o.x + w2 * k, top), P(o.x + w2 * k, top + h2 * k), P(o.x + w1 * k, top + h2 * k), P(o.x + w1 * k, top + H), P(o.x, top + H)];
    const body = grid(o, w1, h1 + h2, k) + poly(pts, { fill: YELLOW, width: 2.4 });
    return problem({
      prompt: `모눈 한 칸은 한 변이 1cm인 정사각형입니다. 그림의 도형을 잘라 빈틈없이 붙여서 정사각형 하나를 만들었습니다. 이 정사각형의 한 변은 몇 cm인가요?`,
      subtype: "rearrange-square", html: svg(w1 * k + 40, H + 40, body, "계단 모양 도형"),
      answer: `${s}cm`,
      solution: `칸을 세면 아래 ${w1} × ${h1} = ${w1 * h1}칸, 위 ${w2} × ${h2} = ${rest}칸으로 모두 ${area}칸, 넓이 ${area}㎠입니다. ${s} × ${s} = ${area}이므로 정사각형의 한 변은 ${s}cm입니다.`,
      family: "rearrange-square-step", meta: { s }
    });
  }
  return null;
}

// 2. 점판(모눈)에 그릴 수 있는 정사각형의 넓이 — 기울어진 정사각형은 (가로 칸)² + (세로 칸)²
const squareAreas = (m) => {
  const set = new Set();
  for (let a = 1; a <= m; a += 1) for (let b = 0; b + a <= m; b += 1) set.add(a * a + b * b);
  return [...set].sort((x, y) => x - y);
};
const ORD = ["첫", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
function tiltedSquareOn(o, s, a, b, start = P(0, 0)) {   // 점판 위 (a, b) 기울기 정사각형: 꼭짓점 칸 좌표
  const p = [P(start.x + b, start.y), P(start.x + a + b, start.y + b), P(start.x + a, start.y + a + b), P(start.x, start.y + a)];
  return p.map((q) => P(o.x + q.x * s, o.y + q.y * s));
}
function c2GridSquareAreas({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "count" : difficulty === 2 ? sample(["kth", "count"]) : sample(["sum", "scale"]);
  if (kind === "scale") {
    // 작은 정사각형(넓이 u) 여러 개를 이은 모양에서, 비스듬한 선분을 한 변으로 하는 정사각형의 넓이로 작은 정사각형 넓이를 구한다
    const a = randomInt(1, 3), b = randomInt(a + 1, 4), u = sample([2, 3, 4, 5]);
    const s = 60;
    const total = (a * a + b * b) * u;
    const o = P(30, 24), cols = b, rows = a;
    const A = P(o.x, o.y + rows * s), B = P(o.x + cols * s, o.y);
    const body = grid(o, cols, rows, s, { color: INK, width: 1.6 }) + line(A, B, { color: MARK, width: 3 }) + text(A.x - 12, A.y + 6, "A", { size: 15, color: MARK }) + text(B.x + 12, B.y - 6, "B", { size: 15, color: MARK });
    return problem({
      prompt: `크기가 같은 작은 정사각형 ${cols * rows}개를 겹치지 않게 이어 붙이고 선분 AB를 그었습니다. 선분 AB를 한 변으로 하는 정사각형의 넓이가 ${total}㎠일 때, 작은 정사각형 한 개의 넓이는 몇 ㎠인가요?`,
      subtype: "grid-square-area", html: svg(cols * s + 70, rows * s + 60, body, "작은 정사각형을 이은 모양"),
      answer: `${u}㎠`,
      solution: `선분 AB는 가로 ${b}칸, 세로 ${a}칸을 비스듬히 지납니다. AB를 한 변으로 하는 정사각형은 작은 정사각형 ${b} × ${b} + ${a} × ${a} = ${a * a + b * b}개의 넓이와 같습니다(바깥 정사각형에서 네 귀퉁이 직각삼각형을 뺀 것). ${total} ÷ ${a * a + b * b} = ${u}㎠입니다.`,
      family: "grid-square-scale", meta: { a, b, u }
    });
  }
  const s = 44, m = difficulty <= 1 ? 3 : sample([3, 4]);
  const areas = squareAreas(m);
  const o = P(30, 24);
  const [ea, eb] = [1, 1];
  const example = tiltedSquareOn(o, s, ea, eb, P(0, 0));
  const body = dots(o, m + 1, s) + poly(example, { fill: "rgba(255,225,150,.6)", color: MARK, width: 2.2 });
  const html = svg(m * s + 60, m * s + 48, body, `점이 가로세로 ${m + 1}개씩인 점판`);
  const note = `점과 점 사이는 1cm이고, 그림의 정사각형(넓이 2㎠)처럼 비스듬한 정사각형도 셉니다.`;
  const list = areas.join(", ");
  if (kind === "count") return problem({
    prompt: `가로·세로에 점이 ${m + 1}개씩 있는 점판에서 네 점을 이어 정사각형을 그립니다. ${note} 넓이가 서로 다른 정사각형은 모두 몇 가지인가요?`,
    subtype: "grid-square-area", html, answer: `${areas.length}가지`,
    solution: `정사각형의 한 변이 가로 ㉠칸·세로 ㉡칸을 지나면 넓이는 ㉠ × ㉠ + ㉡ × ㉡입니다(㉠ + ㉡ ≤ ${m}). 나올 수 있는 넓이는 ${list}(㎠)로 ${areas.length}가지입니다.`,
    family: "grid-square-count", meta: { m }
  });
  if (kind === "kth") {
    const k = randomInt(2, areas.length);
    return problem({
      prompt: `가로·세로에 점이 ${m + 1}개씩 있는 점판에서 그릴 수 있는 정사각형을 넓이가 작은 것부터 늘어놓았습니다. ${note} ${ORD[k - 1]} 번째 정사각형의 넓이는 몇 ㎠인가요?`,
      subtype: "grid-square-area", html, answer: `${areas[k - 1]}㎠`,
      solution: `넓이 = (가로 칸 × 가로 칸) + (세로 칸 × 세로 칸)으로 모두 구하면 작은 것부터 ${list}입니다. ${ORD[k - 1]} 번째는 ${areas[k - 1]}㎠입니다.`,
      family: "grid-square-kth", meta: { m, k }
    });
  }
  const picks = [1, 2, 3, 4, 5, 6, 7].filter((k) => k <= areas.length);
  const chosen = [sample(picks.slice(0, 3)), sample(picks.slice(3))].filter(Boolean).sort((x, y) => x - y);
  const sum = chosen.reduce((t, k) => t + areas[k - 1], 0);
  return problem({
    prompt: `가로·세로에 점이 ${m + 1}개씩 있는 점판에서 그릴 수 있는 정사각형을 넓이가 작은 것부터 늘어놓았습니다. ${note} ${chosen.map((k) => `${ORD[k - 1]} 번째`).join("와 ")} 정사각형의 넓이의 합은 몇 ㎠인가요?`,
    subtype: "grid-square-area", html, answer: `${sum}㎠`,
    solution: `넓이를 작은 것부터 쓰면 ${list}입니다. ${chosen.map((k) => areas[k - 1]).join(" + ")} = ${sum}㎠입니다.`,
    family: "grid-square-sum", meta: { m, chosen }
  });
}

// 3. 정사각형의 변을 똑같이 나눈 점을 이은 안쪽 정사각형
function c2SideSplitSquare({ difficulty = 2 }) {
  const n = difficulty <= 1 ? 2 : sample([3, 4, 5]);
  const k = n === 2 ? 1 : randomInt(1, n - 1);
  const inner = k * k + (n - k) * (n - k);
  const t = sample([1, 2, 3, 4]);
  const A = n * n * t;
  const askShaded = difficulty >= 3 && Math.random() < 0.5;
  const S = 180, o = P(30, 20);
  const c = [P(o.x, o.y), P(o.x + S, o.y), P(o.x + S, o.y + S), P(o.x, o.y + S)];
  const q = [P(o.x + (S * k) / n, o.y), P(o.x + S, o.y + (S * k) / n), P(o.x + S - (S * k) / n, o.y + S), P(o.x, o.y + S - (S * k) / n)];
  let body = poly(c, { fill: askShaded ? YELLOW : "#fff", width: 2.4 }) + poly(q, { fill: askShaded ? "#fff" : YELLOW, width: 2.2 });
  for (let i = 1; i < n; i += 1) {
    const x = o.x + (S * i) / n, y = o.y + (S * i) / n;
    body += line(P(x, o.y - 4), P(x, o.y + 4)) + line(P(o.x + S - 4, y), P(o.x + S + 4, y)) + line(P(x, o.y + S - 4), P(x, o.y + S + 4)) + line(P(o.x - 4, y), P(o.x + 4, y));
  }
  const answer = askShaded ? A - (A / (n * n)) * inner : (A / (n * n)) * inner;
  return problem({
    prompt: `넓이가 ${A}㎠인 정사각형의 네 변을 각각 ${n}등분하고, 그림처럼 점을 이어 안쪽에 정사각형을 그렸습니다. ${askShaded ? "색칠한 네 귀퉁이 삼각형의 넓이의 합" : "안쪽 정사각형(색칠한 부분)의 넓이"}은 몇 ㎠인가요?`,
    subtype: "side-split-square", html: svg(S + 60, S + 40, body, "변을 나눈 정사각형"),
    answer: `${answer}㎠`,
    solution: `큰 정사각형을 ${n} × ${n} = ${n * n}칸의 모눈으로 보면 한 칸은 ${A} ÷ ${n * n} = ${A / (n * n)}㎠입니다. 안쪽 정사각형의 한 변은 가로 ${n - k}칸·세로 ${k}칸을 비스듬히 지나므로 ${n - k} × ${n - k} + ${k} × ${k} = ${inner}칸입니다. ${askShaded ? `네 귀퉁이는 ${n * n} − ${inner} = ${n * n - inner}칸이므로 ${A / (n * n)} × ${n * n - inner} = ${answer}㎠입니다.` : `${A / (n * n)} × ${inner} = ${answer}㎠입니다.`}`,
    family: "side-split-square", meta: { n, k, A }
  });
}

// 4. 가운데 점을 이어 작아지는 정사각형·정삼각형
function c2MidpointNestArea({ difficulty = 2 }) {
  const shape = difficulty <= 1 ? "square" : sample(["square", "triangle"]);
  const steps = difficulty <= 1 ? 2 : randomInt(2, 4);
  const ratio = shape === "square" ? 2 : 4;
  const small = sample([1, 2, 3, 4, 5]);
  const big = small * ratio ** steps;
  const kind = difficulty >= 3 ? sample(["sum", "reverse"]) : sample(["smallest", "reverse"]);
  const c = P(130, 120);
  let body = "", pts = shape === "square" ? [P(30, 20), P(230, 20), P(230, 220), P(30, 220)] : [P(130, 18), P(242, 212), P(18, 212)];
  const fills = ["#fff", SOFT, YELLOW, "#fbe3df", "#dde9ff"];
  for (let i = 0; i <= steps; i += 1) {
    body += poly(pts, { fill: i === steps ? MARK + "55" : fills[i % fills.length], width: 2 });
    pts = pts.map((p, k) => mid(p, pts[(k + 1) % pts.length]));
    if (shape === "triangle") pts = [pts[2], pts[0], pts[1]].map((p) => p);
  }
  void c;
  const name = shape === "square" ? "정사각형" : "정삼각형";
  const all = Array.from({ length: steps + 1 }, (_, i) => big / ratio ** i);
  const sum = all.reduce((t, v) => t + v, 0);
  const how = shape === "square" ? "정사각형의 네 변의 가운데 점을 이으면 넓이가 반이 됩니다(네 귀퉁이 삼각형을 접어 넣으면 안쪽을 꼭 덮습니다)" : "정삼각형의 세 변의 가운데 점을 이으면 똑같은 작은 정삼각형 넷으로 나뉘므로 가운데 것은 4분의 1입니다";
  const chain = all.join(" → ");
  if (kind === "smallest") return problem({
    prompt: `가장 큰 ${name}의 넓이가 ${big}㎠입니다. 변의 가운데 점을 이어 ${name}을 그리는 일을 ${steps}번 했습니다. 가장 작은 ${name}(진하게 칠한 부분)의 넓이는 몇 ㎠인가요?`,
    subtype: "midpoint-nest", html: svg(260, 240, body, `가운데 점을 이어 그린 ${name}`), answer: `${small}㎠`,
    solution: `${how}. ${chain}이므로 가장 작은 ${name}은 ${small}㎠입니다.`, family: `midpoint-${shape}-smallest`, meta: { steps, big }
  });
  if (kind === "reverse") return problem({
    prompt: `변의 가운데 점을 이어 ${name}을 그리는 일을 ${steps}번 했더니 가장 작은 ${name}(진하게 칠한 부분)의 넓이가 ${small}㎠였습니다. 가장 큰 ${name}의 넓이는 몇 ㎠인가요?`,
    subtype: "midpoint-nest", html: svg(260, 240, body, `가운데 점을 이어 그린 ${name}`), answer: `${big}㎠`,
    solution: `${how}. 거꾸로 생각하면 한 단계 바깥은 ${ratio}배입니다. ${[...all].reverse().join(" → ")}이므로 가장 큰 ${name}은 ${big}㎠입니다.`, family: `midpoint-${shape}-reverse`, meta: { steps, small }
  });
  return problem({
    prompt: `가장 큰 ${name}의 넓이가 ${big}㎠입니다. 변의 가운데 점을 이어 ${name}을 그리는 일을 ${steps}번 해서 크기가 다른 ${name} ${steps + 1}개를 만들었습니다. ${steps + 1}개 ${name}의 넓이를 모두 더하면 몇 ㎠인가요?`,
    subtype: "midpoint-nest", html: svg(260, 240, body, `가운데 점을 이어 그린 ${name}`), answer: `${sum}㎠`,
    solution: `${how}. 넓이는 ${chain}이고, 모두 더하면 ${all.join(" + ")} = ${sum}㎠입니다.`, family: `midpoint-${shape}-sum`, meta: { steps, big }
  });
}

// 5. 정육각형(정삼각형 조각)을 나눈 넓이
function c2RegularPieceArea({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "center" : sample(["center", "small", "alternate", "midhex"]);
  const c = P(130, 120), r = 100;
  const v = Array.from({ length: 6 }, (_, i) => at(c, r, 90 + 60 * i));
  let body = "", answer, solution, prompt, A;
  if (kind === "center") {
    const k = randomInt(1, 5); A = 6 * randomInt(2, 9);
    const shaded = new Set(); while (shaded.size < k) shaded.add(randomInt(0, 5));
    for (let i = 0; i < 6; i += 1) body += poly([c, v[i], v[(i + 1) % 6]], { fill: shaded.has(i) ? YELLOW : "#fff", width: 1.8 });
    answer = (A / 6) * k;
    prompt = `넓이가 ${A}㎠인 정육각형을 가운데 점과 꼭짓점을 이어 나누었습니다. 색칠한 부분의 넓이는 몇 ㎠인가요?`;
    solution = `가운데 점과 꼭짓점을 이으면 똑같은 정삼각형 6개로 나뉩니다. 한 조각은 ${A} ÷ 6 = ${A / 6}㎠이고, 색칠한 조각은 ${k}개이므로 ${A / 6} × ${k} = ${answer}㎠입니다.`;
  } else if (kind === "small") {
    const k = randomInt(3, 15); A = 24 * randomInt(1, 4);
    let n = 0; const shadedIdx = new Set(); while (shadedIdx.size < k) shadedIdx.add(randomInt(0, 23));
    for (let i = 0; i < 6; i += 1) {
      const a = c, b = v[i], d = v[(i + 1) % 6], ab = mid(a, b), bd = mid(b, d), da = mid(d, a);
      for (const tri of [[a, ab, da], [ab, b, bd], [da, bd, d], [ab, bd, da]]) { body += poly(tri, { fill: shadedIdx.has(n) ? YELLOW : "#fff", width: 1.4 }); n += 1; }
    }
    answer = (A / 24) * k;
    prompt = `넓이가 ${A}㎠인 정육각형을 똑같은 작은 정삼각형으로 나누었습니다. 색칠한 부분의 넓이는 몇 ㎠인가요?`;
    solution = `정육각형은 정삼각형 6개, 그 하나하나는 다시 작은 정삼각형 4개로 나뉘어 작은 정삼각형은 모두 24개입니다. 한 개는 ${A} ÷ 24 = ${A / 24}㎠이고 색칠한 것은 ${k}개이므로 ${answer}㎠입니다.`;
  } else if (kind === "alternate") {
    A = 6 * randomInt(2, 10);
    body = poly(v, { fill: "#fff", width: 2.2 }) + poly([v[0], v[2], v[4]], { fill: YELLOW, width: 2 });
    for (let i = 0; i < 6; i += 1) body += line(c, v[i], { color: GREEN, width: 1, dash: "4 4" });
    answer = A / 2;
    prompt = `넓이가 ${A}㎠인 정육각형에서 꼭짓점을 하나 걸러 이어 삼각형을 그렸습니다. 색칠한 삼각형의 넓이는 몇 ㎠인가요?`;
    solution = `가운데 점과 꼭짓점을 이으면(점선) 정육각형은 똑같은 조각 6개입니다. 색칠한 삼각형은 그중 세 조각의 넓이와 같습니다 — 조각마다 반은 안에, 반은 밖에 있어 밖의 반쪽 셋이 안쪽 빈 곳과 똑같기 때문입니다. 그래서 정육각형의 반, ${A} ÷ 2 = ${answer}㎠입니다.`;
  } else {
    A = 4 * randomInt(3, 15);
    const m = v.map((p, i) => mid(p, v[(i + 1) % 6]));
    body = poly(v, { fill: "#fff", width: 2.2 }) + poly(m, { fill: YELLOW, width: 2 });
    answer = (A * 3) / 4;
    prompt = `넓이가 ${A}㎠인 정육각형의 여섯 변의 가운데 점을 이어 작은 정육각형을 그렸습니다. 색칠한 작은 정육각형의 넓이는 몇 ㎠인가요?`;
    solution = `큰 정육각형을 정삼각형 6개, 다시 작은 정삼각형 24개로 나누어 보면 바깥 귀퉁이 6개는 작은 정삼각형 반쪽 둘씩, 모두 작은 정삼각형 6개입니다. 색칠한 부분은 24 − 6 = 18개, 곧 전체의 4분의 3이므로 ${A} ÷ 4 × 3 = ${answer}㎠입니다.`;
  }
  return problem({ prompt, subtype: "hexagon-piece", html: svg(260, 240, body, "정육각형"), answer: `${answer}㎠`, solution, family: `hexagon-${kind}`, meta: { A } });
}

// ════ 2단원 피보나치 사각형 ════

const FIB = [1, 1, 2, 3, 5, 8, 13];
// 피보나치 정사각형을 돌아가며 붙인 배치(칸 좌표). 반환: [{x,y,s}], 전체 상자
function fibLayout(count) {
  const sq = [{ x: 0, y: 0, s: 1 }];
  let x0 = 0, y0 = 0, x1 = 1, y1 = 1;
  for (let i = 1; i < count; i += 1) {
    const s = FIB[i], d = (i - 1) % 4;
    let q;
    if (d === 0) { q = { x: x1, y: y0, s }; x1 += s; }
    else if (d === 1) { q = { x: x0, y: y1, s }; y1 += s; }
    else if (d === 2) { q = { x: x0 - s, y: y0, s }; x0 -= s; }
    else { q = { x: x0, y: y0 - s, s }; y0 -= s; }
    sq.push(q);
  }
  return { sq: sq.map((q) => ({ ...q, x: q.x - x0, y: q.y - y0 })), w: x1 - x0, h: y1 - y0 };
}
function fibSvg(layout, unitPx, marks = {}) {
  const o = P(20, 20);
  let body = "";
  layout.sq.forEach((q, i) => {
    body += rect(o.x + q.x * unitPx, o.y + q.y * unitPx, q.s * unitPx, q.s * unitPx, { fill: marks[i]?.fill || "#fff", width: 2 });
    if (marks[i]?.label) body += text(o.x + (q.x + q.s / 2) * unitPx, o.y + (q.y + q.s / 2) * unitPx, marks[i].label, { size: Math.max(12, Math.min(18, q.s * unitPx * 0.35)), color: marks[i].color || INK });
  });
  return svg(layout.w * unitPx + 40, layout.h * unitPx + 40, body, "정사각형을 붙여 만든 직사각형");
}
function c2FibonacciRect({ difficulty = 2 }) {
  const count = difficulty <= 1 ? sample([4, 5]) : sample([5, 6]);
  const u = sample([1, 2, 3]);
  const L = fibLayout(count);
  const unitPx = Math.floor(240 / Math.max(L.w, L.h));
  const big = count - 1, smallIdx = 0;
  const kind = difficulty <= 1 ? "perimeter" : sample(["perimeter", "shaded", "fromBig", "rectSide"]);
  const W = L.w * u, H = L.h * u;
  const sides = L.sq.map((q) => q.s * u);
  if (kind === "perimeter") {
    return problem({
      prompt: `크기가 다른 정사각형을 붙여 직사각형을 만들었습니다. 색칠한 가장 작은 정사각형의 한 변이 ${u}cm일 때, 큰 직사각형의 둘레는 몇 cm인가요?`,
      subtype: "fibonacci-rect", html: fibSvg(L, unitPx, { [smallIdx]: { fill: YELLOW, label: `${u}cm` } }), answer: `${2 * (W + H)}cm`,
      solution: `작은 것부터 한 변은 앞의 두 정사각형의 한 변을 더한 길이입니다: ${sides.join(", ")}cm. 직사각형은 가로 ${W}cm, 세로 ${H}cm이므로 둘레는 (${W} + ${H}) × 2 = ${2 * (W + H)}cm입니다.`,
      family: "fibonacci-perimeter", meta: { count, u }
    });
  }
  if (kind === "shaded") {
    const k = randomInt(1, count - 2);
    const long = Math.max(W, H);
    return problem({
      prompt: `크기가 다른 정사각형을 붙여 직사각형을 만들었습니다. 이 직사각형의 긴 변이 ${long}cm일 때, 색칠한 정사각형의 둘레는 몇 cm인가요?`,
      subtype: "fibonacci-rect", html: fibSvg(L, unitPx, { [k]: { fill: YELLOW, label: "?" } }), answer: `${sides[k] * 4}cm`,
      solution: `가장 작은 정사각형의 한 변을 1로 놓으면 한 변은 차례로 ${L.sq.map((q) => q.s).join(", ")}이고, 긴 변은 ${Math.max(L.w, L.h)}입니다. ${long} ÷ ${Math.max(L.w, L.h)} = ${u}cm가 1에 해당하므로 색칠한 정사각형의 한 변은 ${L.sq[k].s} × ${u} = ${sides[k]}cm, 둘레는 ${sides[k] * 4}cm입니다.`,
      family: "fibonacci-shaded", meta: { count, u, k }
    });
  }
  if (kind === "fromBig") {
    const per = sides[big] * 4;
    return problem({
      prompt: `크기가 다른 정사각형을 붙여 직사각형을 만들었습니다. 가장 큰 정사각형 ㉮의 둘레가 ${per}cm일 때, 색칠한 가장 작은 정사각형의 한 변은 몇 cm인가요?`,
      subtype: "fibonacci-rect", html: fibSvg(L, unitPx, { [big]: { label: "㉮" }, [smallIdx]: { fill: YELLOW, label: "?" } }), answer: `${u}cm`,
      solution: `㉮의 한 변은 ${per} ÷ 4 = ${sides[big]}cm입니다. 가장 작은 것을 1로 놓으면 ㉮는 ${L.sq[big].s}이므로 1에 해당하는 길이는 ${sides[big]} ÷ ${L.sq[big].s} = ${u}cm입니다.`,
      family: "fibonacci-from-big", meta: { count, u }
    });
  }
  const short = Math.min(W, H);
  return problem({
    prompt: `크기가 다른 정사각형을 붙여 직사각형을 만들었습니다. 직사각형의 짧은 변이 ${short}cm일 때, 긴 변은 몇 cm인가요?`,
    subtype: "fibonacci-rect", html: fibSvg(L, unitPx, {}), answer: `${Math.max(W, H)}cm`,
    solution: `가장 작은 정사각형의 한 변을 1로 놓으면 짧은 변은 ${Math.min(L.w, L.h)}, 긴 변은 ${Math.max(L.w, L.h)}입니다. 1에 해당하는 길이는 ${short} ÷ ${Math.min(L.w, L.h)} = ${u}cm이므로 긴 변은 ${Math.max(L.w, L.h)} × ${u} = ${Math.max(W, H)}cm입니다.`,
    family: "fibonacci-side", meta: { count, u }
  });
}

// 6. 똑같은 직사각형을 붙여 만든 큰 사각형의 둘레
function c2CongruentRectPerimeter({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "strip" : sample(["strip", "pinwheel", "stack"]);
  const px = 26;
  let body = "", prompt, answer, solution, W, H;
  if (kind === "strip") {
    const n = randomInt(3, 6), t = randomInt(1, 4);   // 짧은 변 t, 긴 변 n·t, 큰 정사각형 한 변 n·t
    const small = 2 * (n + 1) * t;
    const S = 200 / n;
    for (let i = 0; i < n; i += 1) body += rect(20 + i * S, 20, S, 200, { fill: i === 0 ? YELLOW : "#fff" });
    W = 240; H = 240;
    const askBig = Math.random() < 0.6;
    prompt = askBig
      ? `똑같은 직사각형 ${n}개를 나란히 붙여 정사각형을 만들었습니다. 색칠한 직사각형 하나의 둘레가 ${small}cm일 때, 큰 정사각형의 둘레는 몇 cm인가요?`
      : `둘레가 ${4 * n * t}cm인 정사각형을 똑같은 직사각형 ${n}개로 나누었습니다. 색칠한 직사각형 하나의 둘레는 몇 cm인가요?`;
    answer = askBig ? 4 * n * t : small;
    solution = `직사각형의 짧은 변을 1로 놓으면 긴 변은 짧은 변 ${n}개와 같아 ${n}입니다. 직사각형 둘레는 (1 + ${n}) × 2 = ${2 * (n + 1)}, 큰 정사각형 둘레는 ${n} × 4 = ${4 * n}입니다. ${askBig ? `${small} ÷ ${2 * (n + 1)} = ${t}cm가 1이므로 큰 정사각형 둘레는 ${4 * n} × ${t} = ${answer}cm` : `${4 * n * t} ÷ ${4 * n} = ${t}cm가 1이므로 직사각형 둘레는 ${2 * (n + 1)} × ${t} = ${answer}cm`}입니다.`;
  } else if (kind === "pinwheel") {
    const a = randomInt(2, 5), b = randomInt(a + 1, 9);   // 짧은 변 a, 긴 변 b, 가운데 정사각형 b − a
    const s = 220 / (a + b);
    const o = P(20, 20), A = a * s, B = b * s;
    body = rect(o.x, o.y, B, A, { fill: YELLOW }) + rect(o.x + B, o.y, A, B) + rect(o.x + A, o.y + B, B, A) + rect(o.x, o.y + A, A, B) + rect(o.x + A, o.y + A, B - A, B - A, { fill: SOFT });
    W = 260; H = 260;
    const big = 4 * (a + b);
    prompt = `똑같은 직사각형 4개를 돌려 가며 붙여 큰 정사각형을 만들었더니 가운데에 작은 정사각형 구멍이 생겼습니다. 큰 정사각형의 둘레가 ${big}cm일 때, 색칠한 직사각형 하나의 둘레는 몇 cm인가요?`;
    answer = 2 * (a + b);
    solution = `큰 정사각형의 한 변은 직사각형의 긴 변 + 짧은 변입니다. 그 길이는 ${big} ÷ 4 = ${a + b}cm이고, 직사각형의 둘레는 (긴 변 + 짧은 변) × 2 = ${a + b} × 2 = ${answer}cm입니다.`;
  } else {
    // 위에 세운 직사각형 k개, 아래에 눕힌 직사각형 m개: k × 짧은 변 = m × 긴 변
    const [k, m, sh, lo] = sample([[3, 2, 2, 3], [4, 3, 3, 4], [5, 2, 2, 5], [5, 3, 3, 5], [4, 1, 1, 4]]);
    const t = randomInt(1, 3), S = sh * t, Lg = lo * t;
    const scale = 220 / (k * S);
    const o = P(20, 20);
    for (let i = 0; i < k; i += 1) body += rect(o.x + i * S * scale, o.y, S * scale, Lg * scale, { fill: i === 0 ? YELLOW : "#fff" });
    for (let j = 0; j < m; j += 1) body += rect(o.x + j * Lg * scale, o.y + Lg * scale, Lg * scale, S * scale);
    W = k * S * scale + 40; H = (Lg + S) * scale + 40;
    const small = 2 * (S + Lg), big = 2 * (k * S + Lg + S);
    prompt = `똑같은 직사각형 ${k + m}개를 그림처럼 붙여 큰 직사각형을 만들었습니다. 색칠한 직사각형 하나의 둘레가 ${small}cm일 때, 큰 직사각형의 둘레는 몇 cm인가요?`;
    answer = big;
    solution = `위의 짧은 변 ${k}개와 아래 긴 변 ${m}개가 같은 길이이므로 짧은 변 : 긴 변 = ${sh} : ${lo}입니다. 직사각형 둘레 ${small}cm는 (${sh} + ${lo}) × 2 = ${2 * (sh + lo)}칸이므로 한 칸은 ${t}cm, 짧은 변 ${S}cm, 긴 변 ${Lg}cm입니다. 큰 직사각형은 가로 ${k * S}cm, 세로 ${Lg + S}cm이므로 둘레는 (${k * S} + ${Lg + S}) × 2 = ${big}cm입니다.`;
  }
  return problem({ prompt, subtype: "congruent-rect", html: svg(W, H, body, "똑같은 직사각형을 붙인 그림"), answer: `${answer}cm`, solution, family: `congruent-rect-${kind}`, meta: {} });
}

// ════ 3단원 원과 삼각형의 둘레 ════

// 7. 직사각형 꼭짓점을 가운데로 하는 사분원 — 이웃한 호가 변 위에서 만난다
function c2CornerQuarterCircles({ difficulty = 2 }) {
  for (let tries = 0; tries < 50; tries += 1) {
    const W = randomInt(9, 18), H = randomInt(6, W - 1);
    const rA = randomInt(2, W - 2), rB = W - rA, rC = H - rB;
    if (rC < 2 || rC >= W || rA > H) continue;   // ㄱ의 사분원이 직사각형 아래로 삐져나가지 않게
    const s = 240 / W, o = P(30, 30);
    const A = P(o.x, o.y), B = P(o.x + W * s, o.y), C = P(o.x + W * s, o.y + H * s), D = P(o.x, o.y + H * s);
    const arc = (c, r, a1, a2, fill) => { const p1 = at(c, r * s, a1), p2 = at(c, r * s, a2); return `<path d="M ${f1(c.x)} ${f1(c.y)} L ${f1(p1.x)} ${f1(p1.y)} A ${f1(r * s)} ${f1(r * s)} 0 0 0 ${f1(p2.x)} ${f1(p2.y)} Z" fill="${fill}" stroke="${INK}" stroke-width="1.8"/>`; };
    let body = rect(A.x, A.y, W * s, H * s, { width: 2.4 })
      + arc(A, rA, 270, 360, SOFT) + arc(B, rB, 180, 270, SOFT) + arc(C, rC, 90, 180, YELLOW);
    body += text(A.x - 10, A.y - 10, "ㄱ") + text(B.x + 10, B.y - 10, "ㄴ") + text(C.x + 10, C.y + 12, "ㄷ") + text(D.x - 10, D.y + 12, "ㄹ");
    body += lenLabel(A, B, `${W}cm`, { offset: 16 }) + lenLabel(B, C, `${H}cm`, { offset: 18 });
    const askArc = difficulty >= 3;
    const prompt = `가로 ${W}cm, 세로 ${H}cm인 직사각형 ㄱㄴㄷㄹ의 꼭짓점 ㄱ, ㄴ, ㄷ을 가운데로 하는 사분원을 그렸습니다. 이웃한 사분원은 변 ㄱㄴ, 변 ㄴㄷ 위에서 꼭 만납니다. 꼭짓점 ㄱ을 가운데로 하는 사분원의 반지름이 ${rA}cm일 때, 색칠한 사분원의 ${askArc ? "지름" : "반지름"}은 몇 cm인가요?`;
    const ans = askArc ? rC * 2 : rC;
    return problem({
      prompt, subtype: "corner-quarter", html: svg(W * s + 70, H * s + 64, body, "직사각형과 사분원"), answer: `${ans}cm`,
      solution: `두 호가 변 위에서 만나므로 변의 길이는 두 반지름의 합입니다. ㄴ의 반지름 = ${W} − ${rA} = ${rB}cm, ㄷ의 반지름 = ${H} − ${rB} = ${rC}cm입니다.${askArc ? ` 지름은 ${rC} × 2 = ${ans}cm입니다.` : ""}`,
      family: "corner-quarter", meta: { W, H, rA }
    });
  }
  return null;
}

// 8. 맞닿은 원의 가운데를 이은 삼각형(사각형)의 둘레
function c2CircleCenterTriangle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "perimeter" : sample(["perimeter", "missing", "iso"]);
  for (let tries = 0; tries < 40; tries += 1) {
    const a = randomInt(2, 7), b = randomInt(2, 7), c = kind === "iso" ? a : randomInt(2, 7);
    const AB = a + b, BC = b + c, CA = c + a;
    // 세 원의 가운데 좌표(세 변 길이로 삼각형을 만든다)
    const s = 200 / Math.max(AB, BC, CA, 8) * 0.9;
    const A = P(0, 0), B = P(AB, 0);
    const x = (CA * CA - BC * BC + AB * AB) / (2 * AB), y2 = CA * CA - x * x;
    if (y2 <= 1) continue;
    const C = P(x, -Math.sqrt(y2));
    const pts = [A, B, C], minX = Math.min(...pts.map((p) => p.x)) - Math.max(a, b, c), minY = Math.min(...pts.map((p) => p.y)) - Math.max(a, b, c);
    const T = (p) => P(30 + (p.x - minX) * s, 20 + (p.y - minY) * s);
    const [pa, pb, pc] = pts.map(T);
    let body = circle(pa, a * s, { fill: "#fff" }) + circle(pb, b * s, { fill: "#fff" }) + circle(pc, c * s, { fill: YELLOW });
    body += poly([pa, pb, pc], { color: MARK, width: 2.4 }) + dot(pa) + dot(pb) + dot(pc);
    body += text(pa.x - 12, pa.y + 4, "가", { size: 13 }) + text(pb.x + 12, pb.y + 4, "나", { size: 13 }) + text(pc.x, pc.y - 12, "다", { size: 13 });
    const per = 2 * (a + b + c);
    const W = Math.max(pa.x + a * s, pb.x + b * s, pc.x + c * s) + 30, H = Math.max(pa.y + a * s, pb.y + b * s, pc.y + c * s) + 24;
    const html = svg(W, H, body, "맞닿은 세 원");
    if (kind === "perimeter") return problem({
      prompt: `세 원 가, 나, 다가 서로 맞닿아 있습니다. 반지름이 각각 ${a}cm, ${b}cm, ${c}cm일 때, 세 원의 가운데를 이은 삼각형의 둘레는 몇 cm인가요?`,
      subtype: "circle-center-triangle", html, answer: `${per}cm`,
      solution: `맞닿은 두 원의 가운데 사이는 두 반지름의 합입니다. 세 변은 ${AB}cm, ${BC}cm, ${CA}cm이므로 둘레는 ${per}cm입니다. 반지름마다 두 번씩 들어가므로 (${a} + ${b} + ${c}) × 2로 구해도 같습니다.`,
      family: "circle-center-perimeter", meta: { a, b, c }
    });
    if (kind === "missing") return problem({
      prompt: `세 원 가, 나, 다가 서로 맞닿아 있고, 세 원의 가운데를 이은 삼각형의 둘레는 ${per}cm입니다. 원 가의 반지름이 ${a}cm, 원 나의 반지름이 ${b}cm일 때, 색칠한 원 다의 반지름은 몇 cm인가요?`,
      subtype: "circle-center-triangle", html, answer: `${c}cm`,
      solution: `삼각형의 둘레에는 반지름이 하나에 두 번씩 들어갑니다. 세 반지름의 합은 ${per} ÷ 2 = ${a + b + c}cm이고, ${a + b + c} − ${a} − ${b} = ${c}cm입니다.`,
      family: "circle-center-missing", meta: { a, b, c }
    });
    return problem({
      prompt: `서로 맞닿은 세 원의 가운데를 이었더니 이등변삼각형이 되었습니다. 원 가와 원 다의 반지름이 같고, 원 나의 반지름은 ${b}cm입니다. 삼각형의 둘레가 ${per}cm일 때, 원 가의 반지름은 몇 cm인가요?`,
      subtype: "circle-center-triangle", html, answer: `${a}cm`,
      solution: `둘레에는 반지름이 하나에 두 번씩 들어가므로 세 반지름의 합은 ${per} ÷ 2 = ${a + b + c}cm입니다. 원 가와 다의 반지름의 합은 ${a + b + c} − ${b} = ${a + c}cm, 둘이 같으므로 하나는 ${a}cm입니다.`,
      family: "circle-center-iso", meta: { a, b }
    });
  }
  return null;
}

// 9. 지름이 두 배씩인 원 — 큰 원의 지름 위에 나란히
function c2CircleDiameterChain({ difficulty = 2 }) {
  const count = difficulty <= 1 ? 2 : sample([2, 3]);
  const unit = randomInt(2, 8);   // 가장 작은 원의 지름
  const d = Array.from({ length: count }, (_, i) => unit * 2 ** (count - 1 - i));   // 큰 것부터
  const total = d.reduce((t, v) => t + v, 0);
  const s = 240 / total, o = P(20, 20), R0 = (total * s) / 2, C0 = P(o.x + R0, o.y + R0);
  let body = circle(C0, R0, { fill: "#fff", width: 2.4 }), x = o.x;
  const names = ["㉮", "㉯", "㉰"];
  d.forEach((v, i) => { const r = (v * s) / 2; body += circle(P(x + r, C0.y), r, { fill: i === count - 1 ? YELLOW : SOFT }) + text(x + r, C0.y, names[i], { size: Math.max(12, Math.min(18, r * 0.8)) }); x += v * s; });
  body += line(P(o.x, C0.y), P(o.x + total * s, C0.y), { color: GREEN, width: 1.2, dash: "5 4" });
  const rel = count === 2 ? `원 ㉮의 지름은 원 ㉯의 지름의 2배입니다` : `원 ㉮의 지름은 원 ㉯의 지름의 2배이고, 원 ㉯의 지름은 원 ㉰의 지름의 2배입니다`;
  const parts = d.map((v) => v / unit);
  return problem({
    prompt: `큰 원의 지름 위에 원 ${names.slice(0, count).join(", ")}를 나란히 맞닿게 그렸습니다. ${rel}. 큰 원의 지름이 ${total}cm일 때, 색칠한 원의 지름은 몇 cm인가요?`,
    subtype: "diameter-chain", html: svg(total * s + 40, total * s + 40, body, "큰 원 안에 나란히 그린 원"), answer: `${unit}cm`,
    solution: `가장 작은 원의 지름을 1로 놓으면 지름은 ${parts.join(", ")}이고, 큰 원의 지름은 이 합 ${parts.reduce((t, v) => t + v, 0)}입니다. ${total} ÷ ${parts.reduce((t, v) => t + v, 0)} = ${unit}cm입니다.`,
    family: `diameter-chain-${count}`, meta: { unit, count }
  });
}

// 10. 세 막대로 삼각형 만들기 — 짧은 두 변의 합이 가장 긴 변보다 길어야 한다
function c2TriangleInequality({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "third" : sample(["third", "perimeter"]);
  if (kind === "third") {
    const a = randomInt(2, 8), b = randomInt(a + 1, 12);
    const lo = b - a + 1, hi = a + b - 1;
    const body = rect(20, 30, a * 18, 14, { fill: YELLOW }) + lenLabel(P(20, 30), P(20 + a * 18, 30), `${a}cm`, { offset: 11 }) + rect(20, 80, b * 18, 14, { fill: SOFT }) + lenLabel(P(20, 80), P(20 + b * 18, 80), `${b}cm`, { offset: 11 });
    return problem({
      prompt: `길이가 ${a}cm, ${b}cm인 막대가 하나씩 있습니다. 1cm, 2cm, 3cm, …처럼 길이가 자연수인 막대를 하나 더 골라 세 막대로 삼각형을 만들려고 합니다. 고를 수 있는 막대의 길이는 모두 몇 가지인가요?`,
      subtype: "triangle-sticks", html: svg(b * 18 + 50, 110, body, "두 막대"), answer: `${hi - lo + 1}가지`,
      solution: `가장 긴 막대가 나머지 두 막대의 합보다 짧아야 삼각형이 됩니다. 새 막대는 ${b} − ${a} = ${b - a}cm보다 길고 ${a} + ${b} = ${a + b}cm보다 짧아야 하므로 ${lo}cm부터 ${hi}cm까지 ${hi - lo + 1}가지입니다.`,
      family: "triangle-third-stick", meta: { a, b }
    });
  }
  const N = randomInt(7, difficulty >= 3 ? 24 : 15);
  const list = [];
  for (let x = 1; x <= N; x += 1) for (let y = x; y <= N; y += 1) { const z = N - x - y; if (z >= y && x + y > z) list.push([x, y, z]); }
  if (!list.length) return null;
  const body = Array.from({ length: Math.min(N, 24) }, (_, i) => line(P(20 + i * 12, 20), P(20 + i * 12, 70), { color: "#c08a3e", width: 3 }) + dot(P(20 + i * 12, 18), 3.4, MARK)).join("");
  return problem({
    prompt: `성냥개비 ${N}개를 모두 써서 삼각형 하나를 만들려고 합니다(성냥개비는 꺾거나 자르지 않습니다). 모양이 서로 다른 삼각형은 모두 몇 가지인가요?`,
    subtype: "triangle-sticks", html: svg(Math.min(N, 24) * 12 + 30, 90, body, `성냥개비 ${N}개`), answer: `${list.length}가지`,
    solution: `세 변을 짧은 것부터 ㉠ ≤ ㉡ ≤ ㉢으로 놓고 ㉠ + ㉡ + ㉢ = ${N}, ㉠ + ㉡ > ㉢인 것을 모두 찾으면 ${list.map((t) => `(${t.join(", ")})`).join(", ")}로 ${list.length}가지입니다. 가장 긴 변은 둘레의 반(${N / 2})보다 짧아야 합니다.`,
    family: "triangle-matchsticks", meta: { N }
  });
}

// 11. 정삼각형의 귀퉁이를 정삼각형으로 잘라 낸 도형의 둘레
function c2CutTrianglePerimeter({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "perimeter" : sample(["perimeter", "missing", "fromPerimeter"]);
  for (let tries = 0; tries < 40; tries += 1) {
    const S = randomInt(4, 10) * 3;
    const cuts = difficulty <= 1 ? [randomInt(2, 6), randomInt(2, 6), 0] : [randomInt(2, 8), randomInt(2, 8), randomInt(2, 8)];
    const [x, y, z] = cuts;
    if (x + y >= S || y + z >= S || z + x >= S) continue;
    const sc = 230 / S;
    const A = P(20 + (S * sc) / 2, 20), B = P(20 + S * sc, 20 + S * sc * 0.866), C = P(20, 20 + S * sc * 0.866);
    const pt = (p, q, t) => P(p.x + (q.x - p.x) * (t / S), p.y + (q.y - p.y) * (t / S));
    // 꼭짓점 A에서 x, B에서 y, C에서 z만큼 잘라 낸다
    const shape = [];
    const push = (p) => shape.push(p);
    if (x) { push(pt(A, B, x)); } else push(A);
    if (y) { push(pt(B, A, y)); push(pt(B, C, y)); } else push(B);
    if (z) { push(pt(C, B, z)); push(pt(C, A, z)); } else push(C);
    if (x) push(pt(A, C, x));
    let body = poly([A, B, C], { color: "#9aa39e", width: 1.4 }) + poly(shape, { fill: YELLOW, width: 2.4 });
    const cutTri = (v, p, q) => poly([v, p, q], { fill: "#fff", color: "#9aa39e", width: 1.2 });
    if (x) body += cutTri(A, pt(A, B, x), pt(A, C, x)) + text(A.x, A.y + 12 + x * sc * 0.3, `${x}`, { size: 12, color: MARK });
    if (y) body += cutTri(B, pt(B, A, y), pt(B, C, y)) + text(B.x - 8 - y * sc * 0.25, B.y - 8, `${y}`, { size: 12, color: MARK });
    if (z) body += cutTri(C, pt(C, B, z), pt(C, A, z)) + text(C.x + 8 + z * sc * 0.25, C.y - 8, `${z}`, { size: 12, color: MARK });
    const sum = x + y + z, per = 3 * S - sum;
    const html = svg(S * sc + 40, S * sc * 0.866 + 40, body, "귀퉁이를 잘라 낸 정삼각형");
    const nCut = cuts.filter(Boolean).length, nameShape = nCut === 3 ? "육각형" : "오각형";
    if (kind === "perimeter") return problem({
      prompt: `한 변이 ${S}cm인 정삼각형에서 귀퉁이 ${nCut}곳을 한 변이 ${cuts.filter(Boolean).join("cm, ")}cm인 정삼각형으로 잘라 내어 ${nameShape}을 만들었습니다. 색칠한 ${nameShape}의 둘레는 몇 cm인가요?`,
      subtype: "cut-triangle", html, answer: `${per}cm`,
      solution: `귀퉁이 정삼각형을 하나 잘라 내면 큰 삼각형의 변 두 토막(두 변)이 없어지고 자른 선 한 토막(한 변)이 생기므로, 둘레는 잘라 낸 정삼각형의 한 변만큼 줄어듭니다. ${S} × 3 − (${cuts.filter(Boolean).join(" + ")}) = ${per}cm입니다.`,
      family: "cut-triangle-perimeter", meta: { S, cuts }
    });
    if (kind === "fromPerimeter") return problem({
      prompt: `둘레가 ${3 * S}cm인 정삼각형에서 귀퉁이 ${nCut}곳을 정삼각형으로 잘라 내어 ${nameShape}을 만들었더니 둘레가 ${per}cm가 되었습니다. 잘라 낸 정삼각형 ${nCut}개의 한 변을 모두 더하면 몇 cm인가요?`,
      subtype: "cut-triangle", html, answer: `${sum}cm`,
      solution: `귀퉁이를 정삼각형으로 잘라 낼 때마다 둘레는 잘라 낸 정삼각형의 한 변만큼 줄어듭니다. 줄어든 길이는 ${3 * S} − ${per} = ${sum}cm이므로 한 변의 합은 ${sum}cm입니다.`,
      family: "cut-triangle-sum", meta: { S, cuts }
    });
    if (nCut < 3) continue;
    const sides = [[`ㄱ`, x], [`ㄴ`, S - x - y], [`ㄷ`, y], [`ㄹ`, S - y - z], [`ㅁ`, z], [`ㅂ`, S - z - x]];
    return problem({
      prompt: `한 변이 ${S}cm인 정삼각형의 세 귀퉁이를 정삼각형으로 잘라 내어 육각형을 만들었습니다. 잘라 낸 정삼각형의 한 변이 ${x}cm, ${y}cm일 때, 큰 정삼각형의 변 위에 남은 세 토막 중 두 귀퉁이 사이(${x}cm와 ${y}cm 사이)의 길이는 몇 cm인가요?`,
      subtype: "cut-triangle", html, answer: `${S - x - y}cm`,
      solution: `큰 정삼각형의 한 변 ${S}cm는 귀퉁이 정삼각형 두 개의 한 변과 가운데 토막으로 나뉩니다. ${S} − ${x} − ${y} = ${S - x - y}cm입니다.`,
      family: "cut-triangle-missing", meta: { S, cuts, sides: sides.length }
    });
  }
  return null;
}

// ════ 4단원 360도와 나비각 ════

const POLY_NAME = { 3: "정삼각형", 4: "정사각형", 5: "정오각형", 6: "정육각형", 8: "정팔각형", 9: "정구각형", 10: "정십각형", 12: "정십이각형", 15: "정십오각형", 18: "정십팔각형", 20: "정이십각형", 24: "정이십사각형", 36: "정삼십육각형" };
// 12. 외각 — 같은 각만큼 돌며 걸으면 몇 번 만에 처음 자리로 오는가
function c2ExteriorWalk({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "walk" : sample(["walk", "exterior", "interior", "sum"]);
  const n = sample(difficulty <= 1 ? [5, 6, 8, 10, 12] : [8, 9, 10, 12, 15, 18, 20, 24, 36]);
  const ext = 360 / n, int = 180 - ext;
  const c = P(120, 115), r = 92;
  const pts = Array.from({ length: Math.min(n, 12) }, (_, i) => at(c, r, 90 + (360 / Math.min(n, 12)) * i));
  let body = "", prompt, answer, solution;
  if (kind === "walk") {
    // 걸은 길: 앞 세 토막만 그리고 도는 각 표시
    const seg = 70, path = [P(40, 170)];
    let dir = 0;
    for (let i = 0; i < 3; i += 1) { const p = at(path[i], seg, dir); path.push(p); dir += ext; }
    body = path.slice(0, -1).map((p, i) => line(p, path[i + 1], { color: INK, width: 2.6 })).join("") + dot(path[0], 4.5, GREEN);
    body += line(path[1], at(path[1], 40, 0), { color: "#9aa39e", dash: "4 4", width: 1.4 }) + angleMark(path[1], 0, ext, 26, `${ext}°`);
    prompt = `길이가 같은 선분을 긋고, 그 끝에서 왼쪽으로 ${ext}°만큼 방향을 바꾸어 다시 같은 길이를 긋습니다. 이렇게 계속하면 선분을 몇 개 그었을 때 처음 점으로 돌아오나요?`;
    answer = `${n}개`;
    solution = `처음 점으로 돌아오면 한 바퀴(360°)를 돈 것입니다. 한 번에 ${ext}°씩 도므로 360 ÷ ${ext} = ${n}번, 선분 ${n}개(${POLY_NAME[n] || `정${n}각형`})입니다.`;
    return problem({ prompt, subtype: "exterior-walk", html: svg(260, 200, body, "방향을 바꾸며 그은 선분"), answer, solution, family: "exterior-walk", meta: { n } });
  }
  body = poly(pts, { fill: SOFT, width: 2 });
  const v0 = pts[0], v1 = pts[1];
  body += line(v0, at(v0, 50, dirOf(pts[pts.length - 1], v0)), { color: "#9aa39e", dash: "4 4", width: 1.4 });
  if (kind === "exterior") {
    body += angleMark(v0, dirOf(pts[pts.length - 1], v0), dirOf(v0, v1), 24, `${ext}°`);
    prompt = `한 외각(변을 늘인 선과 이웃한 변이 이루는 각)이 ${ext}°인 정다각형은 정 몇 각형인가요?`;
    answer = `${POLY_NAME[n] || `정${n}각형`}`;
    solution = `어느 다각형이든 외각을 모두 더하면 한 바퀴 360°입니다. 정다각형은 외각이 모두 같으므로 360 ÷ ${ext} = ${n}, ${answer}입니다.`;
  } else if (kind === "interior") {
    body += angleMark(v0, dirOf(v0, v1), dirOf(v0, pts[pts.length - 1]), 22, `${int}°`);
    prompt = `한 내각이 ${int}°인 정다각형은 정 몇 각형인가요?`;
    answer = `${POLY_NAME[n] || `정${n}각형`}`;
    solution = `한 꼭짓점에서 내각과 외각을 더하면 일직선 180°이므로 한 외각은 180 − ${int} = ${ext}°입니다. 외각의 합 360°를 ${ext}°로 나누면 ${n}, ${answer}입니다.`;
  } else {
    const m = randomInt(5, 9);
    const verts = Array.from({ length: m }, (_, i) => at(c, r * (0.75 + 0.25 * ((i * 7) % 3) / 2), 90 + (360 / m) * i + ((i * 13) % 17) - 8));
    body = poly(verts, { fill: SOFT, width: 2 });
    verts.forEach((v, i) => { const prev = verts[(i - 1 + m) % m]; body += line(v, at(v, 34, dirOf(prev, v)), { color: "#9aa39e", dash: "4 4", width: 1.3 }) + angleMark(v, dirOf(prev, v), dirOf(v, verts[(i + 1) % m]), 16, ""); });
    prompt = `그림처럼 ${m}각형의 변을 한쪽으로 늘여 외각을 표시했습니다. 표시한 외각 ${m}개를 모두 더하면 몇 도인가요?`;
    answer = "360°";
    solution = `둘레를 따라 걸으며 꼭짓점마다 외각만큼 방향을 바꾸면 한 바퀴 돌아 처음 방향이 됩니다. 그래서 외각의 합은 변이 몇 개든 360°입니다.`;
    return problem({ prompt, subtype: "exterior-walk", html: svg(240, 230, body, `${m}각형`), answer, solution, family: "exterior-sum", meta: { m } });
  }
  return problem({ prompt, subtype: "exterior-walk", html: svg(240, 230, body, "정다각형"), answer, solution, family: `exterior-${kind}`, meta: { n } });
}

// 13. 나비각(맞꼭지각을 낀 두 삼각형) · 화살촉 모양의 오목한 각
function c2ButterflyAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "butterfly" : sample(["butterfly", "dart"]);
  if (kind === "butterfly") {
    for (let tries = 0; tries < 40; tries += 1) {
      const a = randomInt(35, 85), b = randomInt(35, 85), c = randomInt(35, 85), d = a + b - c;
      if (d < 30 || d > 100 || Math.abs(d - c) < 4) continue;
      const O = P(160, 110), t = 180 - a - b;   // 가운데 맞꼭지각
      // 두 직선 L1—O—R2, L2—O—R1. 사인 법칙으로 변 길이를 정해 표시한 각이 실제 각이 되게 그린다
      const kL = 120 / Math.max(Math.sin(a * R), Math.sin(b * R)), kR = 120 / Math.max(Math.sin(c * R), Math.sin(d * R));
      const pL1 = at(O, kL * Math.sin(b * R), 180 - t / 2), pL2 = at(O, kL * Math.sin(a * R), 180 + t / 2);
      const pR1 = at(O, kR * Math.sin(d * R), t / 2), pR2 = at(O, kR * Math.sin(c * R), -t / 2);
      let body = poly([O, pL1, pL2], { fill: SOFT }) + poly([O, pR1, pR2], { fill: YELLOW });
      body += angleMark(pL1, dirOf(pL1, O), dirOf(pL1, pL2), 20, `${a}°`, { color: INK }) + angleMark(pL2, dirOf(pL2, pL1), dirOf(pL2, O), 20, `${b}°`, { color: INK });
      body += angleMark(pR1, dirOf(pR1, pR2), dirOf(pR1, O), 20, `${c}°`, { color: INK }) + angleMark(pR2, dirOf(pR2, O), dirOf(pR2, pR1), 20, "?");
      const xs = [pL1, pL2, pR1, pR2].map((p) => p.x), ys = [pL1, pL2, pR1, pR2].map((p) => p.y);
      const sh = P(20 - Math.min(...xs), 30 - Math.min(...ys));
      const html = svg(Math.max(...xs) - Math.min(...xs) + 60, Math.max(...ys) - Math.min(...ys) + 70, `<g transform="translate(${f1(sh.x)} ${f1(sh.y)})">${body}</g>`, "나비 모양");
      return problem({
        prompt: `두 선분이 한 점에서 엇갈려 나비 모양의 두 삼각형이 생겼습니다. 표시한 세 각이 ${a}°, ${b}°, ${c}°일 때, ?의 각은 몇 도인가요?`,
        subtype: "butterfly", html, answer: `${d}°`,
        solution: `가운데에서 마주 보는 두 각(맞꼭지각)은 크기가 같습니다. 두 삼각형 모두 세 각의 합이 180°이므로 마주 보는 각을 뺀 나머지 두 각의 합도 같습니다: ${a} + ${b} = ${c} + ?. ? = ${a + b} − ${c} = ${d}°입니다.`,
        family: "butterfly", meta: { a, b, c }
      });
    }
    return null;
  }
  // 화살촉(오목사각형): 오목한 꼭짓점의 각 = 나머지 세 각의 합
  const x = randomInt(25, 70), y = randomInt(20, 45), z = randomInt(20, 45), O = x + y + z;
  if (O >= 175) return null;
  const A = P(40, 180), B = P(150, 25), C = P(260, 180);
  const Ox = 150, Oy = 180 - 90 * (1 - (O - x) / 180);
  const Pt = P(Ox, Math.min(160, Math.max(90, Oy)));
  let body = poly([A, B, C, Pt], { fill: SOFT, width: 2.2 });
  body += angleMark(B, dirOf(B, A), dirOf(B, C), 26, `${x}°`, { color: INK }) + angleMark(A, dirOf(A, Pt), dirOf(A, B), 30, `${y}°`, { color: INK }) + angleMark(C, dirOf(C, B), dirOf(C, Pt), 30, `${z}°`, { color: INK });
  body += angleMark(Pt, dirOf(Pt, C), dirOf(Pt, A), 18, "?") + text(Pt.x, Pt.y + 16, "O", { size: 13 });
  return problem({
    prompt: `화살촉 모양의 사각형에서 표시한 세 각이 ${x}°, ${y}°, ${z}°입니다. 안쪽으로 들어간 꼭짓점 O의 ?(위쪽으로 벌어진 각)은 몇 도인가요?`,
    subtype: "butterfly", html: svg(300, 215, body, "화살촉 모양"), answer: `${O}°`,
    solution: `꼭짓점 위의 점과 O를 지나는 선을 그어 삼각형 둘로 나누면, 삼각형의 바깥 각은 마주 보지 않는 두 안쪽 각의 합입니다. 두 바깥 각을 더하면 ? = ${x} + ${y} + ${z} = ${O}°입니다.`,
    family: "dart", meta: { x, y, z }
  });
}

// 14. 별 모양 꼭짓점 각의 합
function c2StarAngleSum({ difficulty = 2 }) {
  const opts = difficulty <= 1 ? [[5, 2]] : [[5, 2], [6, 2], [7, 2], [7, 3], [8, 3], [9, 2], [9, 4]];
  const [n, k] = sample(opts);
  const c = P(130, 125), r = 105;
  const v = Array.from({ length: n }, (_, i) => at(c, r, 90 + (360 / n) * i));
  let body = "";
  if (n % k === 0 || (n === 6 && k === 2)) {   // 정육각별 = 정삼각형 둘
    for (let s = 0; s < k; s += 1) body += poly(v.filter((_, i) => i % k === s), { fill: "rgba(230,239,232,.6)", width: 2 });
  } else {
    const order = Array.from({ length: n }, (_, i) => v[(i * k) % n]);
    body += poly(order, { fill: "rgba(230,239,232,.6)", width: 2 });
  }
  v.forEach((p, i) => { body += angleMark(p, dirOf(p, v[(i + k) % n]), dirOf(p, v[(i - k + n) % n]), 18, ""); });
  const sum = 180 * (n - 2 * k);
  const name = `${["", "", "", "", "", "오", "육", "칠", "팔", "구"][n]}각별`;
  return problem({
    prompt: `꼭짓점이 ${n}개인 별(${name}) 모양입니다. 별의 뾰족한 꼭짓점에 표시한 ${n}개의 각을 모두 더하면 몇 도인가요?`,
    subtype: "star-angle", html: svg(260, 250, body, name), answer: `${sum}°`,
    solution: `별의 꼭짓점 각은 같은 ${n}각형 둘레의 각들을 옮겨 모은 것과 같습니다. 꼭짓점 하나를 건너뛸 때마다(이번에는 ${k}칸씩) 반 바퀴씩 줄어 꼭짓점 각의 합 = 180 × (${n} − 2 × ${k}) = ${sum}°입니다. ${n === 5 ? "오각별은 나비각으로 각을 옮기면 꼭짓점 각 다섯 개가 한 삼각형에 모여 180°가 됩니다." : ""}`,
    family: `star-${n}-${k}`, meta: { n, k }
  });
}

// 15. 시침이 정각부터 움직인 각
function c2HourHandMoved({ difficulty = 2 }) {
  const hour = randomInt(1, 12);
  const minute = difficulty <= 1 ? randomInt(1, 5) * 10 : randomInt(1, 59);
  const kind = difficulty >= 3 ? sample(["moved", "reverse"]) : "moved";
  const moved = minute / 2;
  const c = P(100, 100), r = 82;
  let body = circle(c, r, { fill: "#fff", width: 2.6 });
  for (let i = 0; i < 60; i += 1) { const big = i % 5 === 0; body += line(at(c, r - (big ? 10 : 5), 90 - i * 6), at(c, r - 2, 90 - i * 6), { width: big ? 2 : 1, color: big ? INK : "#9aa39e" }); }
  for (let h = 1; h <= 12; h += 1) { const p = at(c, r - 22, 90 - h * 30); body += text(p.x, p.y, String(h), { size: 13 }); }
  const ha = 90 - (30 * (hour % 12) + moved), base = 90 - 30 * (hour % 12);
  body += line(c, at(c, r * 0.72, base), { color: "#9aa39e", width: 1.6, dash: "4 4" });
  body += line(c, at(c, r * 0.5, ha), { width: 5 }) + line(c, at(c, r * 0.78, 90 - 6 * minute), { color: BLUE, width: 3 }) + dot(c, 4.5);
  body += angleMark(c, Math.min(ha, base), Math.max(ha, base), 30, "", { color: MARK });
  if (kind === "moved") return problem({
    prompt: `시계가 ${hour}시 ${minute}분을 가리킵니다. 짧은바늘(시침)이 ${hour}시 정각 자리(점선)에서 움직인 각은 몇 도인가요?`,
    subtype: "hour-hand", html: svg(200, 200, body, `${hour}시 ${minute}분 시계`), answer: `${moved}°`,
    solution: `짧은바늘은 1시간(60분)에 숫자 한 칸, 30°를 움직이므로 1분에 30 ÷ 60 = 0.5°씩 갑니다. ${minute}분 동안 ${minute} × 0.5 = ${moved}°입니다.`,
    family: "hour-hand-moved", meta: { hour, minute }
  });
  return problem({
    prompt: `${hour}시가 지나 짧은바늘(시침)이 ${hour}시 정각 자리(점선)에서 ${moved}° 움직였습니다. 지금은 ${hour}시 몇 분인가요?`,
    subtype: "hour-hand", html: svg(200, 200, body, `${hour}시가 지난 시계`), answer: `${minute}분`,
    solution: `짧은바늘은 1분에 0.5°씩 움직이므로 ${moved}°를 가는 데 ${moved} ÷ 0.5 = ${minute}분이 걸립니다. 지금은 ${hour}시 ${minute}분입니다.`,
    family: "hour-hand-reverse", meta: { hour, minute }
  });
}

export const COURSE2_G2_GENERATORS = plainText({
  c2RearrangeSquareSide, c2GridSquareAreas, c2SideSplitSquare, c2MidpointNestArea, c2RegularPieceArea,
  c2FibonacciRect, c2CongruentRectPerimeter,
  c2CornerQuarterCircles, c2CircleCenterTriangle, c2CircleDiameterChain, c2TriangleInequality, c2CutTrianglePerimeter,
  c2ExteriorWalk, c2ButterflyAngle, c2StarAngleSum, c2HourHandMoved
});
// 유형 표(source-data.js가 TYPES에 붙인다): [id, 영역, 중분류, 이름, 생성기]
export const COURSE2_G2_TYPE_ROWS = [
  ["c2-rearrange-square-side", "geometry", "넓이", "잘라 붙여 만든 정사각형의 한 변", "c2RearrangeSquareSide"],
  ["c2-grid-square-areas", "geometry", "넓이", "점판에 그릴 수 있는 정사각형의 넓이", "c2GridSquareAreas"],
  ["c2-side-split-square", "geometry", "넓이", "변을 똑같이 나눈 점을 이은 정사각형의 넓이", "c2SideSplitSquare"],
  ["c2-midpoint-nest-area", "geometry", "넓이", "가운데 점을 이어 작아지는 도형의 넓이", "c2MidpointNestArea"],
  ["c2-regular-piece-area", "geometry", "넓이", "정육각형을 나눈 조각의 넓이", "c2RegularPieceArea"],
  ["c2-fibonacci-rect", "geometry", "둘레", "정사각형을 붙여 만든 직사각형(피보나치 사각형)", "c2FibonacciRect"],
  ["c2-congruent-rect-perimeter", "geometry", "둘레", "똑같은 직사각형을 붙인 도형의 둘레", "c2CongruentRectPerimeter"],
  ["c2-corner-quarter-circles", "geometry", "원", "직사각형 꼭짓점의 사분원 반지름", "c2CornerQuarterCircles"],
  ["c2-circle-center-triangle", "geometry", "원", "맞닿은 원의 가운데를 이은 삼각형", "c2CircleCenterTriangle"],
  ["c2-circle-diameter-chain", "geometry", "원", "지름이 두 배씩인 원", "c2CircleDiameterChain"],
  ["c2-triangle-inequality", "geometry", "삼각형", "세 막대로 삼각형 만들기", "c2TriangleInequality"],
  ["c2-cut-triangle-perimeter", "geometry", "삼각형", "귀퉁이를 잘라 낸 정삼각형의 둘레", "c2CutTrianglePerimeter"],
  ["c2-exterior-walk", "geometry", "각", "외각의 합 360°와 정다각형", "c2ExteriorWalk"],
  ["c2-butterfly-angle", "geometry", "각", "나비각과 화살촉 모양의 각", "c2ButterflyAngle"],
  ["c2-star-angle-sum", "geometry", "각", "별 모양 꼭짓점 각의 합", "c2StarAngleSum"],
  ["c2-hour-hand-moved", "geometry", "각", "짧은바늘이 움직인 각", "c2HourHandMoved"]
];
export const COURSE2_G2_GUIDES = Object.freeze({
  "c2-rearrange-square-side": "잘라 붙여도 넓이는 그대로 — 넓이를 먼저 구하고, 같은 수를 두 번 곱해 그 넓이가 되는 수를 찾습니다.",
  "c2-grid-square-areas": "정사각형의 한 변이 가로 ㉠칸·세로 ㉡칸을 지나면 넓이는 ㉠ × ㉠ + ㉡ × ㉡입니다.",
  "c2-side-split-square": "큰 정사각형을 모눈으로 나누어 보고, 안쪽 정사각형이 몇 칸인지 기울어진 정사각형 넓이로 셉니다.",
  "c2-midpoint-nest-area": "가운데 점을 이으면 정사각형은 반, 정삼각형은 4분의 1이 됩니다.",
  "c2-regular-piece-area": "정육각형은 똑같은 정삼각형 6개, 다시 작은 정삼각형 24개로 나누어 셉니다.",
  "c2-fibonacci-rect": "가장 작은 정사각형을 1로 놓으면 다음 한 변은 앞의 두 한 변의 합(1, 1, 2, 3, 5, 8 …)입니다.",
  "c2-congruent-rect-perimeter": "같은 길이로 맞닿은 변을 찾아 짧은 변 : 긴 변을 먼저 정합니다.",
  "c2-corner-quarter-circles": "두 호가 변 위에서 만나면 그 변의 길이 = 두 반지름의 합입니다.",
  "c2-circle-center-triangle": "맞닿은 두 원의 가운데 사이 = 두 반지름의 합 — 둘레에는 반지름이 하나에 두 번씩 들어갑니다.",
  "c2-circle-diameter-chain": "가장 작은 원의 지름을 1로 놓고 큰 원의 지름이 몇인지 더해 봅니다.",
  "c2-triangle-inequality": "가장 긴 변은 나머지 두 변의 합보다 짧아야 삼각형이 됩니다.",
  "c2-cut-triangle-perimeter": "귀퉁이 정삼각형을 잘라 내면 둘레는 그 정삼각형의 한 변만큼 줄어듭니다.",
  "c2-exterior-walk": "둘레를 따라 한 바퀴 돌면 외각을 모두 더한 것이 360°입니다.",
  "c2-butterfly-angle": "맞꼭지각이 같으므로 나비의 두 날개에서 나머지 두 각의 합이 같습니다.",
  "c2-star-angle-sum": "나비각으로 꼭짓점 각을 옮겨 한 삼각형(다각형)에 모읍니다.",
  "c2-hour-hand-moved": "짧은바늘은 1시간에 30°, 1분에 0.5°씩 움직입니다."
});
