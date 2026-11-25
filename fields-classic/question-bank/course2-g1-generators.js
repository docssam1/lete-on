// 2과정 G1 「돌리기와 뒤집기」 본책 유사문제 생성기 (원장 2026-11-16 「이 과정이 1과정에 비해 너무 조잡스러워 … 흐름도 달라」 → G1 시범).
// 1과정 생성기와 같은 약속: ({ difficulty }) → { prompt, visual, answer, solution, meta }. 그림은 visual.kind "c2"(html에 SVG를 담는다, app.js visualMarkup).
// 본책 문항 번호마다 어느 생성기를 쓰는지는 source-data.js COURSE2_CURRICULUM의 typeStudyRefs. 1과정 생성기로 같은 풀이가 되는 번호는 1과정 유형을 그대로 쓴다.
// 답은 모두 그림을 만든 수에서 계산한다(세는 문제는 하나씩 세어 본다 — 공식만 믿지 않는다).
import { plainText } from "./course2-plain.js?v=20261122zi";

import { foldGeometryHelpers, foldArrowSvg, foldStepArrowSvg, foldStageSvg, foldCaptionSvg, FOLD_CAPTION_SPACE, foldWidthStyle } from "./fold-visuals.js?v=20261123a";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) { const j = randomInt(0, i); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
};
const CIRCLED = ["①", "②", "③", "④", "⑤"];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", PALE = "#f4f1e8";
const R = Math.PI / 180;
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function problem({ prompt, subtype, html, answer, solution, family, options, meta = {} }) {
  return {
    prompt,
    visual: { kind: "c2", subtype, html, ...(options ? { options } : {}) },
    answer: String(answer),
    solution,
    meta: { family, answer, ...meta }
  };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const line = (a, b, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (points, { fill = "none", color = INK, width = 2 } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
const dot = (p, r = 3.2, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
const P = (x, y) => ({ x, y });
// 각 표시: 꼭짓점 v에서 화면 각 a1 → a2(수학 방향, 도) 사이 호와 글자
function angleMark(v, a1, a2, r, label, { color = MARK } = {}) {
  let span = a2 - a1;
  while (span <= 0) span += 360;
  const p1 = P(v.x + r * Math.cos(a1 * R), v.y - r * Math.sin(a1 * R));
  const p2 = P(v.x + r * Math.cos((a1 + span) * R), v.y - r * Math.sin((a1 + span) * R));
  const mid = (a1 + span / 2) * R;
  const lr = r + 16;
  return `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    + (label ? text(v.x + lr * Math.cos(mid), v.y - lr * Math.sin(mid), label, { size: 14, color }) : "");
}
const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;

// ── 디지털 숫자(일곱 칸 막대) ── 1은 가운데에 선다(본책 약속)
const SEGMENTS = { 0: "abcdef", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
function digitSvg(d, x, y, { color = INK, w = 30, h = 54, width = 5 } = {}) {
  const s = (a, b, c, e) => line(P(x + a, y + b), P(x + c, y + e), { color, width });
  if (String(d) === "1") return s(w / 2, 3, w / 2, h / 2 - 2) + s(w / 2, h / 2 + 2, w / 2, h - 3);
  const parts = { a: [4, 0, w - 4, 0], b: [w - 2, 3, w - 2, h / 2 - 2], c: [w - 2, h / 2 + 2, w - 2, h - 3], d: [4, h, w - 4, h], e: [2, h / 2 + 2, 2, h - 3], f: [2, 3, 2, h / 2 - 2], g: [4, h / 2, w - 4, h / 2] };
  return [...(SEGMENTS[d] || "")].map((k) => s(...parts[k])).join("");
}
// 디지털 표시 한 줄(숫자와 쌍점). mirrored면 좌우로 뒤집어 그린다(거울에 비친 모습)
function digitalRow(chars, { mirrored = false, x0 = 14, y0 = 16, gap = 42, frame = true } = {}) {
  let x = x0, body = "";
  for (const c of chars) {
    if (c === ":") { body += dot(P(x + 6, y0 + 16), 3.4) + dot(P(x + 6, y0 + 38), 3.4); x += 16; continue; }
    body += digitSvg(c, x, y0); x += gap;
  }
  const w = x - gap + 30 + x0, h = 54 + y0 * 2;
  const inner = mirrored ? `<g transform="translate(${w} 0) scale(-1 1)">${body}</g>` : body;
  return { w, h, body: (frame ? `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="10" fill="${PALE}" stroke="${INK}" stroke-width="2"/>` : "") + inner };
}

// 1. 거울(좌우)·반 바퀴로 보아도 같은 수 세기 — mode "mirror" | "half"
const MIRROR_MAP = { 0: "0", 1: "1", 2: "5", 5: "2", 8: "8" };
const HALF_MAP = { 0: "0", 1: "1", 2: "2", 5: "5", 6: "9", 8: "8", 9: "6" };
function sameAfterMove(n, map) {
  const s = String(n);
  let out = "";
  for (const c of [...s].reverse()) { if (!(c in map)) return false; out += map[c]; }
  return out === s;
}
function c2DigitalSymmetricCount({ difficulty = 2, mode = "mirror" }) {
  const map = mode === "half" ? HALF_MAP : MIRROR_MAP;
  const digits = difficulty <= 1 ? 2 : difficulty === 2 ? 3 : sample([3, 4]);
  const low = 10 ** (digits - 1), high = 10 ** digits - 1;
  let count = 0;
  const found = [];
  for (let n = low; n <= high; n += 1) if (sameAfterMove(n, map)) { count += 1; if (found.length < 4) found.push(n); }
  const row = digitalRow("0123456789", { gap: 40 });
  const move = mode === "half" ? "반 바퀴 돌려도" : "거울에 비추어도";
  return problem({
    prompt: `디지털 숫자로 쓴 ${digits}자리 수 가운데 ${move} 처음과 같은 수로 보이는 수는 모두 몇 개인가요? (숫자는 그림처럼 쓰고, 막대 두 개로 된 숫자는 칸 가운데에 씁니다.)`,
    subtype: "digital-symmetric", html: svg(row.w, row.h, row.body, "디지털 숫자 0부터 9까지"),
    answer: `${count}개`,
    solution: mode === "half"
      ? `반 바퀴 돌려 숫자로 보이는 것은 0·1·2·5·8(그대로)과 6↔9입니다. 맨 앞과 맨 뒤, 둘째와 끝에서 둘째가 서로 짝이 되게 고르면 ${count}개입니다(예: ${found.join(", ")}).`
      : `거울에 비추어 숫자로 보이는 것은 0·1·8(그대로)과 2↔5입니다. 앞뒤 자리가 서로 짝이 되게 고르면 ${count}개입니다(예: ${found.join(", ")}).`,
    family: `digital-${mode}-symmetric`, meta: { digits, mode, count }
  });
}
const c2DigitalMirrorCount = (options) => c2DigitalSymmetricCount({ ...options, mode: "mirror" });
const c2DigitalHalfTurnCount = (options) => c2DigitalSymmetricCount({ ...options, mode: "half" });

// 2. 거울에 비친 디지털 시계
const pad2 = (v) => String(v).padStart(2, "0");
function c2MirrorDigitalClock({ difficulty = 2 }) {
  const okDigits = new Set(["0", "1", "2", "5", "8"]);
  const hours = Array.from({ length: 24 }, (_, h) => h).filter((h) => [...pad2(h)].every((c) => okDigits.has(c)));
  const minutes = Array.from({ length: 60 }, (_, m) => m).filter((m) => [...pad2(m)].every((c) => okDigits.has(c)));
  const hour = sample(hours.filter((h) => h > 0)), minute = sample(minutes.filter((m) => m > 0));
  const shown = `${pad2(hour)}:${pad2(minute)}`;
  const row = digitalRow(shown, { mirrored: true });
  const later = difficulty >= 3 ? sample([15, 25, 35, 45, 50]) : 0;
  const total = (hour * 60 + minute + later) % (24 * 60);
  const ansH = Math.floor(total / 60), ansM = total % 60;
  return problem({
    prompt: later
      ? `거울에 비친 디지털 시계입니다. 실제 시각에서 ${later}분이 지나면 몇 시 몇 분인가요?`
      : "거울에 비친 디지털 시계입니다. 실제 시각은 몇 시 몇 분인가요?",
    subtype: "mirror-digital-clock", html: svg(row.w, row.h, row.body, "거울에 비친 디지털 시계"),
    answer: `${ansH}시 ${ansM}분`,
    solution: `그림을 다시 좌우로 뒤집으면 ${shown}입니다(2와 5가 서로 바뀌고, 숫자의 차례가 거꾸로 됩니다). ${later ? `실제 시각 ${hour}시 ${minute}분에서 ${later}분 뒤는 ${ansH}시 ${ansM}분입니다.` : `실제 시각은 ${hour}시 ${minute}분입니다.`}`,
    family: "mirror-digital-clock", meta: { hour, minute, later }
  });
}

// 3. 대칭축의 수
const SHAPES = {
  "정삼각형": { axes: 3, pts: [P(0, 1), P(-0.87, -0.5), P(0.87, -0.5)] },
  "이등변삼각형": { axes: 1, pts: [P(0, 1), P(-0.55, -0.8), P(0.55, -0.8)] },
  "정사각형": { axes: 4, pts: [P(-0.75, 0.75), P(0.75, 0.75), P(0.75, -0.75), P(-0.75, -0.75)] },
  "직사각형": { axes: 2, pts: [P(-0.95, 0.55), P(0.95, 0.55), P(0.95, -0.55), P(-0.95, -0.55)] },
  "마름모": { axes: 2, pts: [P(0, 1), P(0.62, 0), P(0, -1), P(-0.62, 0)] },
  "평행사변형": { axes: 0, pts: [P(-0.6, 0.55), P(1, 0.55), P(0.6, -0.55), P(-1, -0.55)] },
  "정오각형": { axes: 5, pts: Array.from({ length: 5 }, (_, i) => P(Math.cos((90 + 72 * i) * R), Math.sin((90 + 72 * i) * R))) },
  "정육각형": { axes: 6, pts: Array.from({ length: 6 }, (_, i) => P(Math.cos(60 * i * R), Math.sin(60 * i * R))) }
};
function c2SymmetryAxisCount({ difficulty = 2 }) {
  const n = difficulty <= 1 ? 3 : 4;
  const names = shuffle(Object.keys(SHAPES)).slice(0, n);
  const cell = 120, r = 44;
  const body = names.map((name, i) => {
    const cx = cell * i + cell / 2, cy = 60;
    const pts = SHAPES[name].pts.map((p) => P(cx + p.x * r, cy - p.y * r));
    return poly(pts, { fill: SOFT, color: INK }) + text(cx, 128, name, { size: 14 });
  }).join("");
  const total = names.reduce((s, name) => s + SHAPES[name].axes, 0);
  return problem({
    prompt: `${n === 3 ? "세" : "네"} 도형의 대칭축은 모두 몇 개인가요?`,
    subtype: "symmetry-axis", html: svg(cell * n, 142, body, "도형들"),
    answer: `${total}개`,
    solution: `${names.map((name) => `${name} ${SHAPES[name].axes}개`).join(", ")}이므로 모두 ${total}개입니다. 접어서 완전히 겹치는 선만 대칭축입니다.`,
    family: "symmetry-axis-count", meta: { names, total }
  });
}

// 4. 원을 똑같이 나눈 조각의 각
function sectorPath(c, r, a1, a2) {
  const p1 = P(c.x + r * Math.cos(a1 * R), c.y - r * Math.sin(a1 * R));
  const p2 = P(c.x + r * Math.cos(a2 * R), c.y - r * Math.sin(a2 * R));
  return `M ${f1(c.x)} ${f1(c.y)} L ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${f1(p2.x)} ${f1(p2.y)} Z`;
}
function c2CircleSectorAngle({ difficulty = 2 }) {
  const c = P(110, 110), r = 92;
  const kind = difficulty <= 1 ? "shaded" : sample(["shaded", "shaded", "missing", "pieces"]);
  if (kind === "missing") {
    const parts = shuffle([sample([40, 50, 60, 70]), sample([80, 90, 100]), sample([45, 55, 65])]);
    const missing = 360 - parts.reduce((s, v) => s + v, 0);
    const all = [...parts, missing];
    let a = 90, body = "";
    all.forEach((v, i) => {
      body += `<path d="${sectorPath(c, r, a, a + v)}" fill="${i === 3 ? SOFT : "#fff"}" stroke="${INK}" stroke-width="2"/>`;
      const mid = (a + v / 2) * R;
      body += text(c.x + r * 0.62 * Math.cos(mid), c.y - r * 0.62 * Math.sin(mid), i === 3 ? "?" : `${v}°`, { size: 14, color: i === 3 ? MARK : INK });
      a += v;
    });
    return problem({
      prompt: "원을 네 조각으로 나누었습니다. ?에 알맞은 각은 몇 도인가요?",
      subtype: "circle-sector", html: svg(220, 220, body, "네 조각으로 나눈 원"),
      answer: `${missing}°`,
      solution: `원의 가운데를 한 바퀴 도는 각은 360°입니다. 360 − ${parts.join(" − ")} = ${missing}이므로 ${missing}°입니다.`,
      family: "circle-sector-missing", meta: { parts, missing }
    });
  }
  const n = sample([3, 4, 5, 6, 8, 9, 10, 12]);
  const piece = 360 / n;
  if (kind === "pieces") {
    let body = "";
    for (let i = 0; i < n; i += 1) body += `<path d="${sectorPath(c, r, 90 + piece * i, 90 + piece * (i + 1))}" fill="${i === 0 ? SOFT : "#fff"}" stroke="${INK}" stroke-width="2"/>`;
    body += angleMark(c, 90, 90 + piece, 26, `${piece}°`);
    return problem({
      prompt: `원을 크기가 같은 조각으로 나누었더니 한 조각의 가운데 각이 ${piece}°였습니다. 원은 모두 몇 조각으로 나누었나요?`,
      subtype: "circle-sector", html: svg(220, 220, body, "똑같이 나눈 원"),
      answer: `${n}조각`, solution: `한 바퀴는 360°이므로 360 ÷ ${piece} = ${n}조각입니다.`,
      family: "circle-sector-pieces", meta: { n }
    });
  }
  const k = randomInt(2, n - 1);
  let body = "";
  for (let i = 0; i < n; i += 1) body += `<path d="${sectorPath(c, r, 90 + piece * i, 90 + piece * (i + 1))}" fill="${i < k ? SOFT : "#fff"}" stroke="${INK}" stroke-width="2"/>`;
  return problem({
    prompt: `원을 크기가 같은 ${n}조각으로 나누었습니다. 색칠한 부분의 가운데 각을 모두 더하면 몇 도인가요?`,
    subtype: "circle-sector", html: svg(220, 220, body, `${n}조각으로 나눈 원`),
    answer: `${piece * k}°`,
    solution: `한 조각은 360 ÷ ${n} = ${piece}°입니다. 색칠한 조각이 ${k}개이므로 ${piece} × ${k} = ${piece * k}°입니다.`,
    family: "circle-sector-shaded", meta: { n, k }
  });
}

// 5. 삼각형의 각
function triangleByAngles(a, b, { width = 300, height = 165, left = 30, base = 192 } = {}) {
  const c = 180 - a - b;
  const side = Math.sin(b * R) / Math.sin(c * R);   // 밑변을 1로 둘 때 A에서 꼭대기까지
  const cx = side * Math.cos(a * R), cy = side * Math.sin(a * R);
  const minX = Math.min(0, cx), maxX = Math.max(1, cx);
  const k = Math.min(width / (maxX - minX), height / cy);
  const at = (x, y) => P(left + (x - minX) * k, base - y * k);
  return { A: at(0, 0), B: at(1, 0), C: at(cx, cy) };
}
function c2TriangleAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "third" : sample(["third", "isoApex", "isoBase", "exterior"]);
  let a, b, labels, answer, solution, prompt;
  if (kind === "third") {
    a = randomInt(4, 9) * 10 - sample([0, 5]); b = randomInt(3, 8) * 10;
    if (a + b > 160) b = 160 - a;
    labels = [`${a}°`, `${b}°`, "?"]; answer = 180 - a - b;
    prompt = "삼각형에서 ?의 각은 몇 도인가요?";
    solution = `삼각형의 세 각을 모으면 180°입니다. 180 − ${a} − ${b} = ${answer}이므로 ${answer}°입니다.`;
  } else if (kind === "isoApex") {
    const apex = sample([20, 30, 36, 40, 50, 70, 80, 100, 110]);
    a = b = (180 - apex) / 2;
    labels = ["?", "", `${apex}°`]; answer = a;
    prompt = "두 변의 길이가 같은 이등변삼각형입니다. ?의 각은 몇 도인가요?";
    solution = `이등변삼각형의 두 밑각은 같습니다. (180 − ${apex}) ÷ 2 = ${answer}이므로 ${answer}°입니다.`;
  } else if (kind === "isoBase") {
    a = b = sample([35, 40, 45, 50, 55, 65, 70, 75]);
    labels = [`${a}°`, "", "?"]; answer = 180 - 2 * a;
    prompt = "두 변의 길이가 같은 이등변삼각형입니다. ?의 각은 몇 도인가요?";
    solution = `두 밑각이 모두 ${a}°입니다. 180 − ${a} − ${a} = ${answer}이므로 ${answer}°입니다.`;
  } else {
    a = randomInt(4, 7) * 10; b = randomInt(3, 6) * 10;
    labels = [`${a}°`, "", `${180 - a - b}°`]; answer = 180 - b;
    prompt = "삼각형의 한 변을 늘였습니다. ?의 각은 몇 도인가요?";
    solution = `안쪽 각은 180 − ${a} − ${180 - a - b} = ${b}°입니다. 한 직선은 180°이므로 ? = 180 − ${b} = ${answer}°입니다.`;
  }
  const { A, B, C } = triangleByAngles(a, b);
  let body = poly([A, B, C], { fill: SOFT });
  const iso = kind === "isoApex" || kind === "isoBase";
  if (iso) {   // 같은 변 표시
    for (const [p, q] of [[A, C], [B, C]]) {
      const m = P((p.x + q.x) / 2, (p.y + q.y) / 2), d = dirOf(p, q) + 90;
      body += line(P(m.x - 7 * Math.cos(d * R), m.y + 7 * Math.sin(d * R)), P(m.x + 7 * Math.cos(d * R), m.y - 7 * Math.sin(d * R)), { color: GREEN, width: 2.4 });
    }
  }
  const cA = dirOf(A, C), cB = dirOf(B, C);
  if (labels[0]) body += angleMark(A, 0, cA, 28, labels[0], { color: labels[0] === "?" ? MARK : INK });
  if (kind === "exterior") {
    const E = P(B.x + 60, B.y);
    body += line(B, E);
    body += angleMark(B, 0, cB, 24, "?");
  } else if (labels[1]) body += angleMark(B, cB, 180, 28, labels[1], { color: labels[1] === "?" ? MARK : INK });
  if (labels[2]) body += angleMark(C, dirOf(C, A), dirOf(C, B), 24, labels[2], { color: labels[2] === "?" ? MARK : INK });
  return problem({ prompt, subtype: "triangle-angle", html: svg(kind === "exterior" ? 400 : 360, 215, body, "삼각형"), answer: `${answer}°`, solution, family: `triangle-${kind}`, meta: { a, b, answer } });
}

// 6. 정다각형의 각
const POLY_NAME = { 3: "정삼각형", 4: "정사각형", 5: "정오각형", 6: "정육각형", 7: "정칠각형", 8: "정팔각형", 9: "정구각형", 10: "정십각형", 12: "정십이각형" };
const regularPoints = (c, r, n, start = 90) => Array.from({ length: n }, (_, i) => P(c.x + r * Math.cos((start + (360 / n) * i) * R), c.y - r * Math.sin((start + (360 / n) * i) * R)));
function c2RegularPolygonAngle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "interior" : sample(["interior", "sum", "center", "reverse"]);
  const n = kind === "sum" ? sample([5, 6, 7, 8, 9, 10, 12]) : sample([5, 6, 8, 9, 10, 12]);
  const c = P(110, 110), r = 88;
  const pts = regularPoints(c, r, n, 90 - 180 / n);
  let body = poly(pts, { fill: SOFT });
  const interior = (180 * (n - 2)) / n;
  let prompt, answer, solution;
  if (kind === "interior") {
    body += angleMark(pts[0], dirOf(pts[0], pts[1]), dirOf(pts[0], pts[n - 1]), 22, "?");
    prompt = `${POLY_NAME[n]}의 한 내각은 몇 도인가요?`;
    answer = `${interior}°`;
    solution = `한 꼭짓점에서 대각선을 그으면 삼각형 ${n - 2}개로 나뉩니다. 내각의 합은 180 × ${n - 2} = ${180 * (n - 2)}°이고, 각이 ${n}개 모두 같으므로 ${180 * (n - 2)} ÷ ${n} = ${interior}°입니다.`;
  } else if (kind === "sum") {
    for (let i = 2; i < n - 1; i += 1) body += line(pts[0], pts[i], { color: GREEN, width: 1.4, dash: "5 4" });
    prompt = `${POLY_NAME[n]}의 내각을 모두 더하면 몇 도인가요?`;
    answer = `${180 * (n - 2)}°`;
    solution = `한 꼭짓점에서 대각선을 그으면 삼각형 ${n - 2}개가 생깁니다. 180 × ${n - 2} = ${180 * (n - 2)}°입니다.`;
  } else if (kind === "center") {
    body += line(c, pts[0], { color: GREEN, width: 1.6 }) + line(c, pts[1], { color: GREEN, width: 1.6 }) + dot(c);
    body += angleMark(c, dirOf(c, pts[0]), dirOf(c, pts[1]), 20, "?");
    prompt = `${POLY_NAME[n]}의 가운데 점과 이웃한 두 꼭짓점을 이었습니다. ?의 각은 몇 도인가요?`;
    answer = `${360 / n}°`;
    solution = `가운데 점을 한 바퀴 도는 360°가 똑같이 ${n}개로 나뉩니다. 360 ÷ ${n} = ${360 / n}°입니다.`;
  } else {
    body = poly(pts, { fill: SOFT }) + angleMark(pts[0], dirOf(pts[0], pts[1]), dirOf(pts[0], pts[n - 1]), 22, `${interior}°`);
    prompt = `한 내각이 ${interior}°인 정다각형은 꼭짓점이 몇 개인가요?`;
    answer = `${n}개`;
    solution = `한 외각은 180 − ${interior} = ${180 - interior}°입니다. 외각을 모두 더하면 360°이므로 360 ÷ ${180 - interior} = ${n}개입니다.`;
  }
  return problem({ prompt, subtype: "regular-polygon-angle", html: svg(220, 220, body, POLY_NAME[n]), answer, solution, family: `regular-polygon-${kind}`, meta: { n } });
}

// 7. 두 정다각형을 한 변에 붙였을 때 남는 각
const JOIN_PAIRS = [[6, 5], [8, 5], [4, 5], [8, 6], [10, 8], [4, 6], [6, 6], [5, 5], [4, 8], [5, 10], [3, 12], [12, 4], [3, 8], [6, 9]];
function edgePolygon(V, W, n, side) {   // side +1: 왼쪽으로 돈다(화면 위쪽), -1: 오른쪽
  const pts = [V, W];
  let dir = dirOf(V, W);
  const len = Math.hypot(W.x - V.x, W.y - V.y);
  for (let i = 2; i < n; i += 1) {
    dir += side * (360 / n);
    const last = pts[pts.length - 1];
    pts.push(P(last.x + len * Math.cos(dir * R), last.y - len * Math.sin(dir * R)));
  }
  return pts;
}
function c2JoinedPolygonAngle({ difficulty = 2 }) {
  const pool = difficulty <= 1 ? JOIN_PAIRS.slice(0, 6) : JOIN_PAIRS;
  const [n1, n2] = sample(pool);
  const i1 = (180 * (n1 - 2)) / n1, i2 = (180 * (n2 - 2)) / n2;
  const gap = 360 - i1 - i2;
  // 공통 변은 꼭짓점 V에서 아래로 내려간다. 왼쪽 도형 A, 오른쪽 도형 B
  const len = Math.min(70, 300 / Math.max(n1, n2) + 34);
  const V = P(0, 0), W = P(0, len);
  const A = edgePolygon(V, W, n1, -1), B = edgePolygon(V, W, n2, 1);
  const all = [...A, ...B];
  const minX = Math.min(...all.map((p) => p.x)), maxX = Math.max(...all.map((p) => p.x));
  const minY = Math.min(...all.map((p) => p.y)), maxY = Math.max(...all.map((p) => p.y));
  const pad = 34, sh = (p) => P(p.x - minX + pad, p.y - minY + pad);
  const a = A.map(sh), b = B.map(sh), v = sh(V);
  // 남는 각: B의 다른 변(V→b[n2-1]) 에서 A의 다른 변(V→a[n1-1])까지 반시계
  const body = poly(a, { fill: SOFT }) + poly(b, { fill: "#fff" })
    + angleMark(v, dirOf(v, b[n2 - 1]), dirOf(v, a[n1 - 1]), 20, "?");
  return problem({
    prompt: `${POLY_NAME[n1]}과 ${POLY_NAME[n2]}의 한 변을 맞붙였습니다. ?의 각은 몇 도인가요?`,
    subtype: "joined-polygon-angle", html: svg(maxX - minX + pad * 2, maxY - minY + pad * 2, body, "맞붙인 두 정다각형"),
    answer: `${gap}°`,
    solution: `${POLY_NAME[n1]}의 한 내각은 ${i1}°, ${POLY_NAME[n2]}의 한 내각은 ${i2}°입니다. 한 점을 도는 각은 360°이므로 360 − ${i1} − ${i2} = ${gap}°입니다.`,
    family: "joined-polygon-angle", meta: { n1, n2, gap }
  });
}

// 8. 시계 바늘이 이루는 각
function analogClock(hour, minute, { c = P(100, 100), r = 82 } = {}) {
  let body = `<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.4"/>`;
  for (let i = 0; i < 60; i += 1) {
    const a = (90 - i * 6) * R, inner = i % 5 === 0 ? r - 10 : r - 5;
    body += line(P(c.x + inner * Math.cos(a), c.y - inner * Math.sin(a)), P(c.x + r * Math.cos(a), c.y - r * Math.sin(a)), { width: i % 5 === 0 ? 2 : 1 });
  }
  for (let h = 1; h <= 12; h += 1) { const a = (90 - h * 30) * R; body += text(c.x + (r - 22) * Math.cos(a), c.y - (r - 22) * Math.sin(a), String(h), { size: 13 }); }
  const ha = (90 - (hour % 12) * 30 - minute * 0.5) * R, ma = (90 - minute * 6) * R;
  body += line(c, P(c.x + r * 0.5 * Math.cos(ha), c.y - r * 0.5 * Math.sin(ha)), { width: 4.5 });
  body += line(c, P(c.x + r * 0.78 * Math.cos(ma), c.y - r * 0.78 * Math.sin(ma)), { width: 2.6, color: GREEN });
  return body + dot(c, 4);
}
function c2ClockHandAngle({ difficulty = 2 }) {
  const hour = randomInt(1, 12);
  const minute = difficulty <= 1 ? sample([0, 30]) : difficulty === 2 ? randomInt(0, 5) * 10 : randomInt(1, 29) * 2;
  const raw = Math.abs(30 * (hour % 12) - 5.5 * minute) % 360;
  const angle = Math.min(raw, 360 - raw);
  if (angle === 0) return null;
  return problem({
    prompt: `시계가 ${hour}시${minute ? ` ${minute}분` : ""}을 가리킵니다. 짧은바늘과 긴바늘이 이루는 작은 쪽의 각은 몇 도인가요?`,
    subtype: "clock-angle", html: svg(200, 200, analogClock(hour, minute), `${hour}시${minute ? ` ${minute}분` : ""} 시계`),
    answer: `${angle}°`,
    solution: `긴바늘은 1분에 6°, 짧은바늘은 1시간에 30°, 1분에 0.5°씩 돕니다. 12에서 긴바늘은 ${6 * minute}°, 짧은바늘은 ${30 * (hour % 12) + 0.5 * minute}° 갔으므로 차는 ${raw}°이고, 작은 쪽은 ${angle}°입니다.`,
    family: "clock-hand-angle", meta: { hour, minute, angle }
  });
}

// 9. 반지름으로 둘레 구하기(원과 삼각형)
const circle = (c, r, fill = "none") => `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(r)}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`;
function c2CircleRadiusPerimeter({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "two" : sample(["two", "three", "reverse", "four"]);
  const r = randomInt(3, 12);
  if (kind === "three") {
    const s = 64, c1 = P(76, 192), c2 = P(76 + 2 * s, 192), c3 = P(76 + s, 192 - s * Math.sqrt(3));
    const body = circle(c1, s) + circle(c2, s) + circle(c3, s) + poly([c1, c2, c3], { color: MARK, width: 2.2 }) + dot(c1) + dot(c2) + dot(c3);
    return problem({
      prompt: `반지름이 ${r}cm인 원 세 개가 서로 맞닿아 있습니다. 세 원의 가운데 점을 이은 삼각형의 둘레는 몇 cm인가요?`,
      subtype: "circle-radius", html: svg(280, 264, body, "맞닿은 원 세 개"), answer: `${6 * r}cm`,
      solution: `맞닿은 두 원의 가운데 점 사이는 반지름 두 개, ${r} + ${r} = ${2 * r}cm입니다. 세 변이 모두 ${2 * r}cm이므로 ${2 * r} × 3 = ${6 * r}cm입니다.`,
      family: "circle-radius-three", meta: { r }
    });
  }
  if (kind === "four") {
    const s = 46, cs = [P(70, 70), P(70 + 2 * s, 70), P(70 + 2 * s, 70 + 2 * s), P(70, 70 + 2 * s)];
    const body = cs.map((c) => circle(c, s)).join("") + poly(cs, { color: MARK, width: 2.2 }) + cs.map((c) => dot(c)).join("");
    return problem({
      prompt: `반지름이 ${r}cm인 원 네 개를 이웃한 원끼리 맞닿게 놓았습니다. 네 원의 가운데 점을 이은 사각형의 둘레는 몇 cm인가요?`,
      subtype: "circle-radius", html: svg(256, 256, body, "맞닿은 원 네 개"), answer: `${8 * r}cm`,
      solution: `한 변은 반지름 두 개 길이인 ${2 * r}cm입니다. 변이 4개이므로 ${2 * r} × 4 = ${8 * r}cm입니다.`,
      family: "circle-radius-four", meta: { r }
    });
  }
  const s = 78, c1 = P(110, 120), c2 = P(110 + s, 120), top = P(110 + s / 2, 120 - (s * Math.sqrt(3)) / 2);
  const body = circle(c1, s) + circle(c2, s) + poly([c1, c2, top], { color: MARK, width: 2.2 }) + dot(c1) + dot(c2) + dot(top)
    + text(c1.x - 12, c1.y + 14, "ㄱ", { size: 14 }) + text(c2.x + 12, c2.y + 14, "ㄴ", { size: 14 }) + text(top.x, top.y - 14, "ㄷ", { size: 14 });
  if (kind === "reverse") {
    return problem({
      prompt: `크기가 같은 두 원이 서로의 가운데 점을 지납니다. 두 원의 가운데 점 ㄱ, ㄴ과 두 원이 만나는 점 ㄷ을 이은 삼각형의 둘레가 ${3 * r}cm일 때, 원의 반지름은 몇 cm인가요?`,
      subtype: "circle-radius", html: svg(300, 220, body, "서로의 가운데를 지나는 두 원"), answer: `${r}cm`,
      solution: `ㄱㄴ, ㄱㄷ, ㄴㄷ은 모두 반지름이므로 삼각형의 세 변이 같습니다. ${3 * r} ÷ 3 = ${r}cm입니다.`,
      family: "circle-radius-reverse", meta: { r }
    });
  }
  return problem({
    prompt: `반지름이 ${r}cm인 두 원이 서로의 가운데 점을 지납니다. 두 원의 가운데 점 ㄱ, ㄴ과 두 원이 만나는 점 ㄷ을 이은 삼각형의 둘레는 몇 cm인가요?`,
    subtype: "circle-radius", html: svg(300, 220, body, "서로의 가운데를 지나는 두 원"), answer: `${3 * r}cm`,
    solution: `ㄱㄴ은 원 ㄱ의 반지름, ㄱㄷ은 원 ㄱ의 반지름, ㄴㄷ은 원 ㄴ의 반지름입니다. 세 변이 모두 ${r}cm이므로 ${r} × 3 = ${3 * r}cm입니다.`,
    family: "circle-radius-two", meta: { r }
  });
}

// 10. 원 안의 직사각형 — 가운데 점을 이은 도형
function c2InscribedMidpoint({ difficulty = 2 }) {
  const r = randomInt(3, 12);
  const kind = difficulty <= 1 ? "forward" : sample(["forward", "reverse", "diameter"]);
  const c = P(110, 110), rr = 90, t = sample([28, 33, 38, 52, 57]) * R;
  const A = P(c.x + rr * Math.cos(t), c.y - rr * Math.sin(t)), B = P(c.x - rr * Math.cos(t), c.y - rr * Math.sin(t));
  const C = P(c.x - rr * Math.cos(t), c.y + rr * Math.sin(t)), D = P(c.x + rr * Math.cos(t), c.y + rr * Math.sin(t));
  const mid = (p, q) => P((p.x + q.x) / 2, (p.y + q.y) / 2);
  const M = [mid(A, B), mid(B, C), mid(C, D), mid(D, A)];
  const body = circle(c, rr) + poly([A, B, C, D]) + poly(M, { fill: SOFT, color: MARK, width: 2.2 }) + line(A, C, { color: GREEN, width: 1.4, dash: "5 4" }) + dot(c) + M.map((m) => dot(m, 2.8)).join("");
  const given = kind === "diameter" ? `지름이 ${2 * r}cm인` : `반지름이 ${r}cm인`;
  if (kind === "reverse") {
    return problem({
      prompt: `원 안에 네 꼭짓점이 원 위에 있는 직사각형을 그리고, 직사각형 네 변의 가운데 점을 이었습니다. 이은 도형의 둘레가 ${4 * r}cm이면 원의 반지름은 몇 cm인가요?`,
      subtype: "inscribed-midpoint", html: svg(220, 220, body, "원 안의 직사각형"), answer: `${r}cm`,
      solution: `이은 도형의 한 변은 직사각형의 대각선의 반, 곧 원의 반지름과 같습니다. 네 변이 모두 반지름이므로 ${4 * r} ÷ 4 = ${r}cm입니다.`,
      family: "inscribed-midpoint-reverse", meta: { r }
    });
  }
  return problem({
    prompt: `${given} 원 안에 네 꼭짓점이 원 위에 있는 직사각형을 그리고, 직사각형 네 변의 가운데 점을 이었습니다. 이은 도형의 둘레는 몇 cm인가요?`,
    subtype: "inscribed-midpoint", html: svg(220, 220, body, "원 안의 직사각형"), answer: `${4 * r}cm`,
    solution: `직사각형의 대각선은 원의 지름(${2 * r}cm)입니다. 가운데 점을 이은 선은 대각선의 반이므로 한 변이 ${r}cm, 네 변은 ${r} × 4 = ${4 * r}cm입니다.`,
    family: `inscribed-midpoint-${kind}`, meta: { r }
  });
}

// ── 선분으로 이루어진 그림에서 삼각형 세기(하나씩 센다) ──
function countTriangles(points, lines, test = () => true) {
  const onLine = (i, j) => lines.some((l) => l.includes(i) && l.includes(j));
  const sameLine = (i, j, k) => lines.some((l) => l.includes(i) && l.includes(j) && l.includes(k));
  let count = 0;
  for (let i = 0; i < points.length; i += 1) for (let j = i + 1; j < points.length; j += 1) for (let k = j + 1; k < points.length; k += 1) {
    if (!onLine(i, j) || !onLine(j, k) || !onLine(i, k) || sameLine(i, j, k)) continue;
    if (test(points[i], points[j], points[k])) count += 1;
  }
  return count;
}
const isRight = (a, b, c) => {
  const d = (p, q, r) => Math.abs((q.x - p.x) * (r.x - p.x) + (q.y - p.y) * (r.y - p.y)) < 1e-9;
  return d(a, b, c) || d(b, a, c) || d(c, a, b);
};
const GRID_FIGURES = [
  { name: "정사각형과 두 대각선", pts: [[0, 0], [2, 0], [2, 2], [0, 2], [1, 1]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4, 2], [1, 4, 3]] },
  { name: "정사각형·대각선·가운데 선", pts: [[0, 0], [2, 0], [2, 2], [0, 2], [1, 0], [2, 1], [1, 2], [0, 1], [1, 1]], lines: [[0, 4, 1], [1, 5, 2], [2, 6, 3], [3, 7, 0], [0, 8, 2], [1, 8, 3], [4, 8, 6], [7, 8, 5]] },
  { name: "두 정사각형과 대각선", pts: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1], [0.5, 0.5], [1.5, 0.5]], lines: [[0, 1, 2], [2, 3], [3, 4, 5], [5, 0], [1, 4], [0, 6, 4], [1, 6, 5], [1, 7, 3], [2, 7, 4]] },
  { name: "정사각형·한 대각선·가운데 선", pts: [[0, 0], [2, 0], [2, 2], [0, 2], [1, 0], [2, 1], [1, 2], [0, 1], [1, 1]], lines: [[0, 4, 1], [1, 5, 2], [2, 6, 3], [3, 7, 0], [0, 8, 2], [4, 8, 6], [7, 8, 5]] },
  { name: "직사각형과 두 대각선", pts: [[0, 0], [2, 0], [2, 1], [0, 1], [1, 0.5]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4, 2], [1, 4, 3]] }
];
function c2GridRightTriangleCount({ difficulty = 2 }) {
  const fig = difficulty <= 1 ? sample(GRID_FIGURES.slice(0, 1).concat(GRID_FIGURES[4])) : sample(GRID_FIGURES.slice(1, 4));
  const onlyRight = fig.name !== "직사각형과 두 대각선" && Math.random() < 0.7;
  const pts = fig.pts.map(([x, y]) => P(x, y));
  const right = countTriangles(pts, fig.lines, isRight), all = countTriangles(pts, fig.lines);
  const wide = Math.max(...pts.map((p) => p.x)), tall = Math.max(...pts.map((p) => p.y));
  const s = 150 / Math.max(wide, tall), pad = 16;
  const at = (p) => P(pad + p.x * s, pad + (tall - p.y) * s);
  const body = fig.lines.map((l) => line(at(pts[l[0]]), at(pts[l[l.length - 1]]), { width: 2.2 })).join("");
  return problem({
    prompt: onlyRight ? "그림에서 찾을 수 있는 크고 작은 직각삼각형은 모두 몇 개인가요?" : "그림에서 찾을 수 있는 크고 작은 삼각형은 모두 몇 개인가요?",
    subtype: "triangle-count", html: svg(wide * s + pad * 2, tall * s + pad * 2, body, fig.name),
    answer: `${onlyRight ? right : all}개`,
    solution: onlyRight
      ? `작은 삼각형 하나짜리부터 여러 개를 합친 것까지 크기별로 나누어 셉니다. 직각인 각이 있는 삼각형은 모두 ${right}개입니다.`
      : `삼각형 하나짜리, 둘을 합친 것, 넷을 합친 것처럼 크기별로 나누어 세면 모두 ${all}개입니다.`,
    family: "grid-triangle-count", meta: { figure: fig.name, right, all }
  });
}

// 12. 원 위의 점으로 만드는 삼각형
function c2CirclePointTriangles({ difficulty = 2 }) {
  const n = difficulty <= 1 ? sample([6, 8]) : sample([6, 8, 9, 10, 12]);
  const kinds = n % 3 === 0 ? ["equilateral", "isosceles", ...(n % 2 === 0 ? ["right"] : [])] : ["isosceles", ...(n % 2 === 0 ? ["right"] : [])];
  const kind = sample(kinds);
  let count = 0;
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) for (let k = j + 1; k < n; k += 1) {
    const a = j - i, b = k - j, c = n - a - b;
    const ok = kind === "equilateral" ? a === b && b === c : kind === "isosceles" ? a === b || b === c || a === c : a * 2 === n || b * 2 === n || c * 2 === n;
    if (ok) count += 1;
  }
  const cc = P(110, 110), r = 88;
  const pts = regularPoints(cc, r, n);
  const body = circle(cc, r) + pts.map((p) => dot(p, 4.2)).join("");
  const name = { equilateral: "정삼각형", isosceles: "이등변삼각형(정삼각형 포함)", right: "직각삼각형" }[kind];
  const how = {
    equilateral: `세 점 사이가 원을 똑같이 셋으로 나누어야 하므로 ${n / 3}칸씩 떨어진 세 점을 고릅니다. 시작점은 ${n / 3}개입니다.`,
    isosceles: "꼭대기 점 하나를 정하고, 그 점에서 양쪽으로 같은 칸만큼 떨어진 두 점을 고릅니다. 정삼각형은 꼭대기를 세 번 세었으니 한 번만 남깁니다.",
    right: "한 변이 원의 지름(마주 보는 두 점)이면 직각삼각형입니다. 지름을 고르고 나머지 한 점을 고릅니다."
  }[kind];
  return problem({
    prompt: `원 위에 같은 간격으로 점 ${n}개가 있습니다. 세 점을 이어 만들 수 있는 ${name}은 모두 몇 개인가요?`,
    subtype: "circle-point-triangle", html: svg(220, 220, body, `원 위의 점 ${n}개`),
    answer: `${count}개`, solution: `${how} 모두 ${count}개입니다.`,
    family: `circle-point-${kind}`, meta: { n, kind, count }
  });
}

// 13. 점판에서 선분 ㄱㄴ을 한 변으로 하는 삼각형
function c2DotTriangleCount({ difficulty = 2 }) {
  const m = difficulty <= 1 ? 4 : 5;
  const kind = difficulty <= 1 ? "isosceles" : sample(["isosceles", "isosceles", "right"]);
  const choices = [[[0, 0], [1, 0]], [[1, 1], [2, 1]], [[0, 0], [2, 0]], [[1, 1], [3, 1]], [[1, 0], [1, 2]], [[0, 0], [1, 1]], [[1, 1], [2, 2]]].filter(([a, b]) => a[0] < m && a[1] < m && b[0] < m && b[1] < m);
  const [[ax, ay], [bx, by]] = sample(choices);
  const d2 = (x1, y1, x2, y2) => (x1 - x2) ** 2 + (y1 - y2) ** 2;
  const ab = d2(ax, ay, bx, by);
  let count = 0;
  for (let x = 0; x < m; x += 1) for (let y = 0; y < m; y += 1) {
    if ((bx - ax) * (y - ay) - (by - ay) * (x - ax) === 0) continue;   // 한 줄 위
    const ca = d2(x, y, ax, ay), cb = d2(x, y, bx, by);
    if (kind === "isosceles" ? ca === cb || ca === ab || cb === ab : ca + cb === ab || ca + ab === cb || cb + ab === ca) count += 1;
  }
  const s = 46, pad = 26, at = (x, y) => P(pad + x * s, pad + (m - 1 - y) * s);
  let body = "";
  for (let x = 0; x < m; x += 1) for (let y = 0; y < m; y += 1) body += dot(at(x, y), 4);
  const A = at(ax, ay), B = at(bx, by);
  body += line(A, B, { color: MARK, width: 3 }) + text(A.x - 12, A.y + 14, "ㄱ", { size: 14, color: MARK }) + text(B.x + 12, B.y + 14, "ㄴ", { size: 14, color: MARK });
  const name = kind === "isosceles" ? "이등변삼각형" : "직각삼각형";
  return problem({
    prompt: `점판 위의 선분 ㄱㄴ을 한 변으로 하고, 나머지 한 꼭짓점이 점판의 점인 ${name}은 모두 몇 개인가요?`,
    subtype: "dot-triangle", html: svg(pad * 2 + s * (m - 1), pad * 2 + s * (m - 1), body, `점판 ${m}×${m}`),
    answer: `${count}개`,
    solution: kind === "isosceles"
      ? `세 가지 경우로 나누어 셉니다: ①ㄱ과 ㄴ에서 같은 거리에 있는 점 ②ㄱ에서 ㄱㄴ만큼 떨어진 점 ③ㄴ에서 ㄱㄴ만큼 떨어진 점. 한 줄 위에 있는 점은 빼면 ${count}개입니다.`
      : `직각이 ㄱ에 있을 때, ㄴ에 있을 때, 나머지 꼭짓점에 있을 때로 나누어 점을 찾으면 ${count}개입니다.`,
    family: `dot-${kind}`, meta: { m, ax, ay, bx, by, count }
  });
}

// 14. 사각형 사이의 관계
const QUAD_TRUE = ["정사각형은 직사각형입니다.", "정사각형은 마름모입니다.", "직사각형은 평행사변형입니다.", "마름모는 평행사변형입니다.", "정사각형은 평행사변형입니다.", "평행사변형은 사다리꼴입니다.", "직사각형은 사다리꼴입니다.", "마름모는 네 변의 길이가 모두 같습니다.", "직사각형은 네 각이 모두 직각입니다."];
const QUAD_FALSE = ["직사각형은 정사각형입니다.", "마름모는 정사각형입니다.", "평행사변형은 직사각형입니다.", "사다리꼴은 평행사변형입니다.", "마름모는 직사각형입니다.", "직사각형은 마름모입니다.", "평행사변형은 마름모입니다.", "사다리꼴은 마주 보는 두 쌍의 변이 모두 평행합니다."];
function c2QuadInclusion({ difficulty = 2 }) {
  const askWrong = difficulty <= 1 ? true : Math.random() < 0.6;
  const odd = sample(askWrong ? QUAD_FALSE : QUAD_TRUE);
  const rest = shuffle(askWrong ? QUAD_TRUE : QUAD_FALSE).slice(0, 4);
  const options = shuffle([odd, ...rest]);
  const at = options.indexOf(odd);
  const html = `<ol class="c2-choices" style="list-style:none;padding-left:0;margin:0">${options.map((o, k) => `<li><b>${CIRCLED[k]}</b> ${esc(o)}</li>`).join("")}</ol>`;
  return problem({
    prompt: askWrong ? "사각형 사이의 관계를 바르게 말하지 않은 것을 고르세요." : "사각형 사이의 관계를 바르게 말한 것을 고르세요.",
    subtype: "quad-inclusion", html, options, answer: CIRCLED[at],
    solution: `정사각형 ⊂ 직사각형·마름모 ⊂ 평행사변형 ⊂ 사다리꼴 순서로 안에 들어갑니다. 안쪽 도형은 바깥 도형이라고 할 수 있지만 거꾸로는 안 됩니다. 그래서 ${CIRCLED[at]} 「${odd}」${askWrong ? "가 틀렸습니다" : "가 맞습니다"}.`,
    family: "quad-inclusion", meta: { askWrong, odd }
  });
}

// 15. 점판에서 정사각형 세기
function c2DotSquareCount({ difficulty = 2 }) {
  const n = difficulty <= 1 ? sample([3, 4]) : sample([4, 5]);
  const tilted = difficulty >= 2 && Math.random() < 0.75;
  // 네 점을 하나씩 확인한다: 한 변 벡터 (p, q)로 만든 정사각형이 점판 안에 들어가면 센다(p ≥ 1, q ≥ 0 — 같은 정사각형을 한 번만)
  let count = 0;
  for (let x = 0; x < n; x += 1) for (let y = 0; y < n; y += 1) for (let p = 1; p < n; p += 1) for (let q = 0; q < n; q += 1) {
    if (!tilted && q > 0) continue;
    const corners = [[x, y], [x + p, y + q], [x + p - q, y + q + p], [x - q, y + p]];
    if (corners.every(([cx, cy]) => cx >= 0 && cy >= 0 && cx < n && cy < n)) count += 1;
  }
  const s = 46, pad = 22, at = (x, y) => P(pad + x * s, pad + y * s);
  let body = "";
  for (let x = 0; x < n; x += 1) for (let y = 0; y < n; y += 1) body += dot(at(x, y), 4.2);
  const upright = Array.from({ length: n - 1 }, (_, k) => (n - 1 - k) ** 2);
  return problem({
    prompt: tilted
      ? `가로, 세로로 점이 ${n}개씩 같은 간격으로 놓인 점판이 있습니다. 네 점을 이어 만들 수 있는 정사각형은 기울어진 것까지 모두 몇 개인가요?`
      : `가로, 세로로 점이 ${n}개씩 같은 간격으로 놓인 점판이 있습니다. 네 점을 이어 만들 수 있는 반듯한(변이 가로·세로인) 정사각형은 모두 몇 개인가요?`,
    subtype: "dot-square", html: svg(pad * 2 + s * (n - 1), pad * 2 + s * (n - 1), body, `점판 ${n}×${n}`),
    answer: `${count}개`,
    solution: tilted
      ? `반듯한 정사각형을 크기별로 세면 ${upright.join(" + ")}개입니다. 한 변이 k칸인 반듯한 정사각형 안에는 기울어진 정사각형이 k − 1개 더 들어 있으므로, 크기마다 개수에 k를 곱해 더하면 ${count}개입니다.`
      : `한 칸짜리 ${upright[0]}개${upright.slice(1).map((v, k) => `, ${k + 2}칸짜리 ${v}개`).join("")}를 더하면 ${count}개입니다.`,
    family: tilted ? "dot-square-tilted" : "dot-square-upright", meta: { n, tilted, count }
  });
}

// 16. 모눈에서 직사각형·정사각형 세기
function c2RectangleGridCount({ difficulty = 2 }) {
  const rows = difficulty <= 1 ? 2 : randomInt(2, 4), cols = difficulty <= 1 ? randomInt(3, 4) : randomInt(3, 5);
  const kind = difficulty <= 1 ? sample(["all", "square"]) : sample(["all", "square", "nonsquare", "marked"]);
  const mr = randomInt(0, rows - 1), mc = randomInt(0, cols - 1);
  let all = 0, square = 0, marked = 0;
  for (let r1 = 0; r1 < rows; r1 += 1) for (let r2 = r1; r2 < rows; r2 += 1) for (let c1 = 0; c1 < cols; c1 += 1) for (let c2 = c1; c2 < cols; c2 += 1) {
    all += 1;
    if (r2 - r1 === c2 - c1) square += 1;
    if (r1 <= mr && mr <= r2 && c1 <= mc && mc <= c2) marked += 1;
  }
  const answer = { all, square, nonsquare: all - square, marked }[kind];
  const s = 42, pad = 10;
  let body = "";
  if (kind === "marked") body += `<rect x="${pad + mc * s}" y="${pad + mr * s}" width="${s}" height="${s}" fill="${SOFT}"/>` + text(pad + mc * s + s / 2, pad + mr * s + s / 2, "★", { size: 18, color: MARK });
  body += `<rect x="${pad}" y="${pad}" width="${cols * s}" height="${rows * s}" fill="none" stroke="${INK}" stroke-width="2.4"/>`;
  for (let c = 1; c < cols; c += 1) body += line(P(pad + c * s, pad), P(pad + c * s, pad + rows * s));
  for (let r = 1; r < rows; r += 1) body += line(P(pad, pad + r * s), P(pad + cols * s, pad + r * s));
  const prompt = {
    all: "그림에서 찾을 수 있는 크고 작은 사각형(직사각형과 정사각형)은 모두 몇 개인가요?",
    square: "그림에서 찾을 수 있는 크고 작은 정사각형은 모두 몇 개인가요?",
    nonsquare: "그림에서 찾을 수 있는 크고 작은 직사각형 가운데 정사각형이 아닌 것은 모두 몇 개인가요?",
    marked: "그림에서 ★ 칸을 포함하는 크고 작은 사각형(직사각형과 정사각형)은 모두 몇 개인가요?"
  }[kind];
  const pairs = (k) => (k * (k + 1)) / 2;
  const solution = {
    all: `가로선 ${rows + 1}개 중 2개, 세로선 ${cols + 1}개 중 2개를 고르면 사각형이 하나 생깁니다. ${pairs(rows)} × ${pairs(cols)} = ${all}개입니다.`,
    square: `한 칸짜리, 두 칸짜리처럼 크기별로 셉니다. 모두 ${square}개입니다.`,
    nonsquare: `사각형 전체 ${pairs(rows)} × ${pairs(cols)} = ${all}개에서 정사각형 ${square}개를 빼면 ${all - square}개입니다.`,
    marked: `★ 칸 위쪽 선과 아래쪽 선, 왼쪽 선과 오른쪽 선을 하나씩 고르면 됩니다. (${mr + 1} × ${rows - mr}) × (${mc + 1} × ${cols - mc}) = ${marked}개입니다.`
  }[kind];
  return problem({ prompt, subtype: "rectangle-count", html: svg(cols * s + pad * 2, rows * s + pad * 2, body, `${rows}×${cols} 모눈`), answer: `${answer}개`, solution, family: `rectangle-${kind}`, meta: { rows, cols, kind, answer } });
}


// 17. 거꾸로 해결하기 — 펼친 모양을 보고 접힌 색종이 위에 자른 선을 그린다(본책 1단원 활동 1 · 연습 3~5, 원장 2026-11-16 「색종이 접기는 거꾸로 해결하기인 거 알지?」).
// 접을 때 움직이지 않는 쪽은 제자리에 있으므로, 펼치기 = 마지막 접는 선부터 차례로 거울에 비춰 붙이기(MIRROR). 답은 그렇게 만든 그림에서 거꾸로 읽는다.
const REVERSE_FOLDS = { 3: [["v", "h", "d1"], ["d1", "d2", "v"], ["v", "vq", "h"]], 2: [["v", "h"], ["d1", "d2"], ["v", "vq"]] };
const area = (poly) => Math.abs(poly.reduce((t, p, i) => { const q = poly[(i + 1) % poly.length]; return t + p.x * q.y - q.x * p.y; }, 0)) / 2;
const lerpP = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
// 다각형을 꺾은 선(edge i 위 a → 안쪽 점들 → edge j 위 b)으로 둘로 나눈다
function splitPolygon(poly, i, a, inner, j, b) {
  const n = poly.length, walk = (from, to) => { const out = []; for (let k = (from + 1) % n; ; k = (k + 1) % n) { out.push(poly[k]); if (k === to) break; } return out; };
  return [[a, ...inner, b, ...walk(j, i)], [b, ...[...inner].reverse(), a, ...walk(i, j)]];
}
function c2ReverseFoldCutGen({ difficulty = 2, folds: foldCount = null, mode = null }) {
  const { KEEP, MIRROR, clip, foldLine, foldArrow } = foldGeometryHelpers();
  const count = foldCount || (difficulty <= 1 ? 2 : 3);
  const kind = mode || (difficulty >= 3 ? "shape" : "line");
  const folds = sample(REVERSE_FOLDS[count]);
  const square = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  const stages = [square];
  for (const f of folds) stages.push(clip(stages[stages.length - 1], KEEP[f]));
  const last = stages[stages.length - 1];
  // 자르는 선: 서로 다른 두 변 위의 점(꼭짓점 피함). 모양이면 안쪽 점 하나를 더 거쳐 꺾는다.
  const n = last.length;
  const i = randomInt(0, n - 1); let j = (i + randomInt(1, n - 1)) % n;
  const a = lerpP(last[i], last[(i + 1) % n], sample([0.25, 0.5, 0.75])), b = lerpP(last[j], last[(j + 1) % n], sample([0.25, 0.5, 0.75]));
  const center = P(last.reduce((t, p) => t + p.x, 0) / n, last.reduce((t, p) => t + p.y, 0) / n);
  const inner = kind === "shape" ? [lerpP(lerpP(a, b, 0.5), center, sample([0.45, 0.6]))] : [];
  const [p1, p2] = splitPolygon(last, i, a, inner, j, b);
  const removed = area(p1) <= area(p2) ? p1 : p2;
  if (area(removed) < 0.004 || Math.abs(area(p1) - area(p2)) < 1e-6) return null;
  // 펼치기: 마지막 접는 선부터 거울에 비춰 붙인다
  let pieces = [removed], cuts = [[a, ...inner, b]];
  for (const f of [...folds].reverse()) {
    pieces = [...pieces, ...pieces.map((poly) => poly.map(MIRROR[f]))];
    cuts = [...cuts, ...cuts.map((line) => line.map(MIRROR[f]))];
  }
  // 그림
  const size = 100, top = 6, gap = 44;
  const fold = (stage, f, shift) => {
    let out = "";
    const seg = foldLine(stage, f);
    if (seg) out += `<line x1="${f1(shift + seg[0].x * size)}" y1="${f1(top + seg[0].y * size)}" x2="${f1(shift + seg[1].x * size)}" y2="${f1(top + seg[1].y * size)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
    const arrow = foldArrow(stage, f);
    if (arrow) out += foldArrowSvg(arrow.from, arrow.to, shift, top, size);
    return out;
  };
  const poly2 = (poly, shift, attrs) => `<polygon points="${poly.map((q) => `${f1(shift + q.x * size)},${f1(top + q.y * size)}`).join(" ")}" ${attrs}/>`;
  const path2 = (line, shift, attrs) => `<polyline points="${line.map((q) => `${f1(shift + q.x * size)},${f1(top + q.y * size)}`).join(" ")}" fill="none" ${attrs}/>`;
  let shift = 8, body = "";
  folds.forEach((f, index) => {
    body += foldStageSvg(stages[index], { shift, top, size, index, fold: f }) + fold(stages[index], f, shift) + foldCaptionSvg(shift + size / 2, top + size + 22, index);
    shift += size + 10; body += foldStepArrowSvg(shift, top + size / 2); shift += gap;
  });
  const drawAt = shift;
  body += foldStageSvg(last, { shift, top, size, index: count }) + foldCaptionSvg(shift + size / 2, top + size + 22, count, "여기에 그리기");
  shift += size + 10; body += foldStepArrowSvg(shift, top + size / 2); shift += gap;
  const openAt = shift;
  body += `<rect x="${openAt}" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`
    + pieces.map((poly) => poly2(poly, openAt, `fill="#fff"`)).join("")   // 접는 선을 사이에 둔 조각은 한 구멍 — 선은 자른 자리에만 긋는다
    + cuts.map((line) => path2(line, openAt, `stroke="#b03a5b" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`)).join("")
    + `<text x="${f1(openAt + size / 2)}" y="${top + size + 22}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">펼친 모양</text>`;
  shift += size + 8;
  const html = svg(shift, size + top + 8 + FOLD_CAPTION_SPACE, body, "접은 색종이와 펼친 모양").replace('<svg class="c2-fig"', `<svg class="c2-fig fold-cut-draw-svg" ${foldWidthStyle(shift, size)}`);
  // 정답 그림: ① 펼친 종이에 접는 선 ② 종이가 모인 칸(색) ③ 그 칸 안의 자른 선 ④ 접힌 종이 위의 자른 선
  const creases = [];
  stages.slice(0, -1).forEach((stage, k) => { const seg = foldLine(stage, folds[k]); if (!seg) return; let segs = [seg]; for (const f of folds.slice(0, k).reverse()) segs = [...segs, ...segs.map((s2) => s2.map(MIRROR[f]))]; creases.push(...segs); });
  const A = 8, B = A + size + 50;
  let ans = `<rect x="${A}" y="${top}" width="${size}" height="${size}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`
    + poly2(last, A, `fill="#ffe98a" opacity="0.85"`)
    + creases.map(([u, v]) => `<line x1="${f1(A + u.x * size)}" y1="${f1(top + u.y * size)}" x2="${f1(A + v.x * size)}" y2="${f1(top + v.y * size)}" stroke="#d4756c" stroke-width="1.3" stroke-dasharray="5 4"/>`).join("")
    + pieces.map((poly) => poly2(poly, A, `fill="#fff"`)).join("")
    + cuts.map((line) => path2(line, A, `stroke="#b03a5b" stroke-width="1.5" stroke-linejoin="round"`)).join("")
    + path2([a, ...inner, b], A, `stroke="#c0392b" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"`)
    + `<text x="${A + size / 2}" y="${top + size + 22}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">모인 칸(노랑) 찾기</text>`
    + foldStepArrowSvg(A + size + 10, top + size / 2)
    + foldStageSvg(last, { shift: B, top, size, index: count })
    + path2([a, ...inner, b], B, `stroke="#c0392b" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"`)
    + `<text x="${B + size / 2}" y="${top + size + 22}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">접힌 종이에 옮기기</text>`;
  const ansHtml = svg(B + size + 14, size + top + 8 + FOLD_CAPTION_SPACE, ans, "거꾸로 찾은 자른 선");
  return {
    prompt: kind === "shape"
      ? `정사각형 색종이를 ${count}번 접은 뒤, 접힌 종이 위에 모양을 그려 그 선을 따라 잘랐습니다. 펼쳤더니 오른쪽과 같았습니다. 접힌 색종이 위에 자른 모양을 그리세요.`
      : `정사각형 색종이를 ${count}번 접은 뒤, 접힌 종이 위에 선분 하나를 긋고 따라 잘랐습니다. 펼쳤더니 오른쪽과 같았습니다. 접힌 색종이 위에 그은 선분을 그리세요.`,
    visual: { kind: "c2", subtype: "reverse-fold-cut", html },
    answer: "그림 답안",
    answerVisual: { kind: "c2", subtype: "reverse-fold-cut", html: ansHtml },
    responseKind: "drawing",
    solution: `거꾸로 생각합니다. ① 펼친 종이에 접는 선을 접은 차례대로 그려 칸을 나눕니다. ② 마지막에 종이가 모인 칸(접힌 모양과 같은 칸)을 찾습니다. ③ 펼친 모양에서 그 칸 안에 있는 자른 선만 봅니다. ④ 그 선을 접힌 종이 위 같은 자리에 그립니다. 펼친 모양의 자른 선이 접는 선마다 거울처럼 되풀이되는 것은, 그 선 하나가 ${2 ** count}겹을 한꺼번에 잘랐기 때문입니다.`,
    meta: { family: `reverse-fold-${kind}`, folds, count, answer: "그림 답안" }
  };
}
const c2ReverseFoldLine = (o) => c2ReverseFoldCutGen({ ...o, folds: 3, mode: "line" });
const c2ReverseFoldShape = (o) => c2ReverseFoldCutGen({ ...o, folds: 3, mode: "shape" });
const c2ReverseFoldTwo = (o) => c2ReverseFoldCutGen({ ...o, folds: 2, mode: o.difficulty >= 3 ? "shape" : "line" });

// 18. 접힌 부분 위치 찾기 — 거꾸로 해결하기의 ② 단계만 따로(원장 2026-11-16 「접힌 부분 위치 찾기」):
// 접는 차례를 보고, 다 접은 종이가 펼친 종이의 몇 번 칸에 놓이는지 고른다. 칸 = 다 접은 모양을 마지막 접는 선부터 거울에 비춰 붙인 조각들.
// foldSeq: 거꾸로 문제의 앞 단계로 쓸 때(app.js LEAD_STEPS) 그 문제와 똑같은 접기·방향으로 그린다
function c2FoldRegionFind({ difficulty = 2, foldSeq = null }) {
  const { KEEP, MIRROR, clip, foldLine, foldArrow } = foldGeometryHelpers();
  const lead = Array.isArray(foldSeq) && foldSeq.length >= 2;
  const count = lead ? foldSeq.length : difficulty <= 1 ? 2 : 3;
  const folds = lead ? foldSeq : sample(REVERSE_FOLDS[count]);
  const square = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  const stages = [square];
  for (const f of folds) stages.push(clip(stages[stages.length - 1], KEEP[f]));
  // 늘 같은 쪽(왼쪽 위)이 남지 않게 그림 전체를 돌리거나 뒤집는다(정사각형의 여덟 가지 대칭 중 하나)
  const T = lead ? (q) => q : sample([(q) => q, (q) => P(1 - q.y, q.x), (q) => P(1 - q.x, 1 - q.y), (q) => P(q.y, 1 - q.x), (q) => P(1 - q.x, q.y), (q) => P(q.x, 1 - q.y), (q) => P(q.y, q.x), (q) => P(1 - q.y, 1 - q.x)]);
  const last = stages[stages.length - 1];
  let pieces = [{ poly: last, home: true }];
  for (const f of [...folds].reverse()) pieces = [...pieces, ...pieces.map((piece) => ({ poly: piece.poly.map(MIRROR[f]), home: false }))];
  const centroid = (poly) => P(poly.reduce((t, q) => t + q.x, 0) / poly.length, poly.reduce((t, q) => t + q.y, 0) / poly.length);
  // 칸 번호: 위에서 아래로, 왼쪽에서 오른쪽으로(가운데 점 기준)
  pieces.forEach((piece) => { piece.poly = piece.poly.map(T); piece.c = centroid(piece.poly); });
  pieces.sort((x, y) => (Math.round(x.c.y * 8) - Math.round(y.c.y * 8)) || (x.c.x - y.c.x));
  const answer = pieces.findIndex((piece) => piece.home) + 1;
  const size = 100, top = 6, gap = 44;
  let shift = 8, body = "";
  folds.forEach((f, index) => {
    const stage = stages[index], seg = foldLine(stage, f)?.map(T), arrow = foldArrow(stage, f);
    body += foldStageSvg(stage.map(T), { shift, top, size, index })
      + (seg ? `<line x1="${f1(shift + seg[0].x * size)}" y1="${f1(top + seg[0].y * size)}" x2="${f1(shift + seg[1].x * size)}" y2="${f1(top + seg[1].y * size)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>` : "")
      + (arrow ? foldArrowSvg(T(arrow.from), T(arrow.to), shift, top, size) : "") + foldCaptionSvg(shift + size / 2, top + size + 22, index);
    shift += size + 10; body += foldStepArrowSvg(shift, top + size / 2); shift += gap;
  });
  body += foldStageSvg(last.map(T), { shift, top, size, index: count }) + foldCaptionSvg(shift + size / 2, top + size + 22, count);
  shift += size + 10; body += foldStepArrowSvg(shift, top + size / 2); shift += gap;
  const at = shift, big = size;
  body += `<rect x="${at}" y="${top}" width="${big}" height="${big}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`
    + pieces.map((piece) => `<polygon points="${piece.poly.map((q) => `${f1(at + q.x * big)},${f1(top + q.y * big)}`).join(" ")}" fill="none" stroke="#d4756c" stroke-width="1.2" stroke-dasharray="5 4"/>`).join("")
    + pieces.map((piece, k) => text(at + piece.c.x * big, top + piece.c.y * big, String(k + 1), { size: count === 3 ? 12 : 15, color: INK, weight: 800 })).join("")
    + `<text x="${f1(at + big / 2)}" y="${top + big + 22}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">펼친 종이의 칸</text>`;
  shift += big + 8;
  const html = svg(shift, size + top + 8 + FOLD_CAPTION_SPACE, body, "접는 차례와 펼친 종이의 칸").replace('<svg class="c2-fig"', `<svg class="c2-fig fold-cut-draw-svg" ${foldWidthStyle(shift, size)}`);
  return {
    prompt: lead
      ? `먼저 다음 문제의 접기를 살펴봐요. 다 접은 종이(${2 ** count}겹)는 펼친 종이의 몇 번 칸에 놓여 있나요?`
      : `정사각형 색종이를 그림처럼 ${count}번 접었습니다. 다 접은 종이(${2 ** count}겹)는 펼친 종이의 몇 번 칸에 놓여 있나요?`,
    visual: { kind: "c2", subtype: "fold-region", html, items: pieces.map((_, k) => String(k + 1)) },
    answer: String(answer),
    solution: `접을 때 움직이지 않는 쪽은 제자리에 남습니다. 첫 번째 접기에서 남는 쪽, 그 안에서 두 번째 접기에서 남는 쪽${count === 3 ? ", 세 번째 접기에서 남는 쪽" : ""}을 차례로 좁혀 가면 ${answer}번 칸입니다.`,
    meta: { family: "fold-region-find", folds, count, answer: String(answer) }
  };
}

export const COURSE2_G1_GENERATORS = plainText({
  c2FoldRegionFind,
  c2ReverseFoldLine, c2ReverseFoldShape, c2ReverseFoldTwo,
  c2DigitalMirrorCount, c2DigitalHalfTurnCount, c2MirrorDigitalClock, c2SymmetryAxisCount, c2CircleSectorAngle, c2TriangleAngle,
  c2RegularPolygonAngle, c2JoinedPolygonAngle, c2ClockHandAngle, c2CircleRadiusPerimeter, c2InscribedMidpoint,
  c2GridRightTriangleCount, c2CirclePointTriangles, c2DotTriangleCount, c2QuadInclusion, c2DotSquareCount, c2RectangleGridCount
});
// 유형 표(source-data.js가 TYPES에 붙인다): [id, 영역, 중분류, 이름, 생성기]
export const COURSE2_G1_TYPE_ROWS = [
  ["c2-fold-region-find", "geometry", "색종이 접기", "다 접은 종이가 펼친 종이의 어느 칸에 있는지 찾기", "c2FoldRegionFind"],
  ["c2-reverse-fold-line", "geometry", "색종이 접기", "펼친 모양을 보고 접힌 종이에 자른 선분 그리기(거꾸로)", "c2ReverseFoldLine"],
  ["c2-reverse-fold-shape", "geometry", "색종이 접기", "펼친 모양을 보고 접힌 종이에 자른 모양 그리기(거꾸로)", "c2ReverseFoldShape"],
  ["c2-reverse-fold-two", "geometry", "색종이 접기", "두 번 접어 자른 모양을 거꾸로 찾기", "c2ReverseFoldTwo"],
  ["c2-digital-mirror-count", "number", "디지털 숫자 대칭", "거울에 비추어도 같은 디지털 수 세기", "c2DigitalMirrorCount"],
  ["c2-digital-half-turn-count", "number", "디지털 숫자 대칭", "반 바퀴 돌려도 같은 디지털 수 세기", "c2DigitalHalfTurnCount"],
  ["c2-mirror-digital-clock", "geometry", "거울 시계", "거울에 비친 디지털 시계의 실제 시각", "c2MirrorDigitalClock"],
  ["c2-symmetry-axis-count", "geometry", "선대칭", "도형의 대칭축 수", "c2SymmetryAxisCount"],
  ["c2-circle-sector-angle", "geometry", "각", "원을 나눈 조각의 각", "c2CircleSectorAngle"],
  ["c2-triangle-angle", "geometry", "각", "삼각형의 세 각과 이등변삼각형의 밑각", "c2TriangleAngle"],
  ["c2-regular-polygon-angle", "geometry", "각", "정다각형의 내각·내각의 합·가운데 각", "c2RegularPolygonAngle"],
  ["c2-joined-polygon-angle", "geometry", "각", "맞붙인 두 정다각형 사이의 각", "c2JoinedPolygonAngle"],
  ["c2-clock-hand-angle", "geometry", "각", "시계 두 바늘이 이루는 각", "c2ClockHandAngle"],
  ["c2-circle-radius-perimeter", "geometry", "원", "반지름으로 만든 도형의 둘레", "c2CircleRadiusPerimeter"],
  ["c2-inscribed-midpoint", "geometry", "원", "원 안 직사각형의 가운데 점을 이은 도형", "c2InscribedMidpoint"],
  ["c2-grid-right-triangle-count", "geometry", "도형 세기", "선을 그은 그림에서 삼각형 세기", "c2GridRightTriangleCount"],
  ["c2-circle-point-triangles", "geometry", "도형 세기", "원 위의 점으로 만드는 삼각형 세기", "c2CirclePointTriangles"],
  ["c2-dot-triangle-count", "geometry", "도형 세기", "점판에서 한 변이 정해진 삼각형 세기", "c2DotTriangleCount"],
  ["c2-quad-inclusion", "geometry", "사각형", "사각형 사이의 관계", "c2QuadInclusion"],
  ["c2-dot-square-count", "geometry", "도형 세기", "점판에서 정사각형 세기", "c2DotSquareCount"],
  ["c2-rectangle-grid-count", "geometry", "도형 세기", "모눈에서 사각형 세기", "c2RectangleGridCount"]
];

// 유형마다 「핵심 방법」 한 줄(학습지 문항 머리의 풀이 원리 칸 — source-data.js TEXTBOOK_CONCEPT_GUIDES에 합친다)
export const COURSE2_G1_GUIDES = Object.freeze({
  "c2-fold-region-find": "접을 때 움직이지 않는 쪽은 제자리 — 접을 때마다 남는 쪽으로 좁혀 가면 다 접은 종이가 놓인 칸이 나옵니다.",
  "c2-reverse-fold-line": "거꾸로 생각합니다 — 펼친 종이에 접는 선을 차례대로 그려 칸을 나누고, 종이가 모인 칸 안의 자른 선만 접힌 종이에 옮깁니다.",
  "c2-reverse-fold-shape": "거꾸로 생각합니다 — 접는 선으로 칸을 나누고, 종이가 모인 칸 안에 있는 자른 모양만 골라 접힌 종이에 옮깁니다.",
  "c2-reverse-fold-two": "두 번 접으면 4겹 — 접는 선 두 개로 네 칸을 나누고, 종이가 모인 한 칸의 자른 선만 접힌 종이에 옮깁니다.",
  "c2-digital-mirror-count": "거울에 비치면 숫자의 차례가 거꾸로 되고 2와 5가 바뀝니다. 앞뒤 자리를 짝지어 셉니다.",
  "c2-digital-half-turn-count": "반 바퀴 돌리면 차례가 거꾸로 되고 6과 9가 바뀝니다. 앞뒤 자리를 짝지어 셉니다.",
  "c2-mirror-digital-clock": "거울 속 시계를 다시 좌우로 뒤집어(거꾸로) 원래 시각을 읽습니다.",
  "c2-symmetry-axis-count": "접어서 완전히 겹치는 선만 대칭축입니다. 도형마다 세어 더합니다.",
  "c2-circle-sector-angle": "원의 가운데를 한 바퀴 도는 각은 360°입니다.",
  "c2-triangle-angle": "삼각형의 세 각을 모으면 180°, 이등변삼각형은 두 밑각이 같습니다.",
  "c2-regular-polygon-angle": "가운데 점에서 꼭짓점마다 선을 그어 같은 이등변삼각형으로 나눕니다. 꼭지각 = 360° ÷ 변의 수, 한 내각 = 밑각 두 개입니다.",
  "c2-joined-polygon-angle": "한 점을 도는 각 360°에서 두 정다각형의 한 내각을 뺍니다.",
  "c2-clock-hand-angle": "긴바늘은 1분에 6°, 짧은바늘은 1분에 0.5°씩 돕니다.",
  "c2-circle-radius-perimeter": "원의 가운데에서 원 위까지는 모두 반지름이라 길이가 같습니다.",
  "c2-inscribed-midpoint": "직사각형의 대각선은 원의 지름, 가운데 점을 이은 선은 대각선의 반 = 반지름입니다.",
  "c2-grid-right-triangle-count": "작은 삼각형 하나짜리부터 크기별로 나누어 빠짐없이 셉니다.",
  "c2-circle-point-triangles": "꼭대기 점을 정하고 양쪽으로 같은 칸만큼 떨어진 두 점을 고릅니다.",
  "c2-dot-triangle-count": "같은 길이가 어느 두 변인지 세 경우로 나누어 셉니다.",
  "c2-quad-inclusion": "정사각형 ⊂ 직사각형·마름모 ⊂ 평행사변형 ⊂ 사다리꼴 — 안쪽은 바깥이라 할 수 있지만 거꾸로는 안 됩니다.",
  "c2-dot-square-count": "반듯한 정사각형을 크기별로 세고, 그 안에 든 기울어진 정사각형을 더합니다.",
  "c2-rectangle-grid-count": "가로선 두 개와 세로선 두 개를 고르면 사각형 하나가 생깁니다."
});
