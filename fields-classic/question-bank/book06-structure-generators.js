// 1과정 6권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK06_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK06_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK06_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK06_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//   BOOK06_STRUCTURE_CHECKS     — { meta.family: (문항) => "" | 오류 문장 } (book06-audit.mjs가 부르는 검산)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   1단원 — 재는 횟수만 주고 두 막대의 차로 재는 횟수 · 같은 길이 두 막대의 거꾸로 비 · 수 카드 묶음 도형식(같은 모양 여러 번)
//          · 두 막대 길이의 합으로 전체 길이 · 네 모양 저울 사슬(네 항 비)
//   2단원 — 정사각형으로 채운 직사각형 · 대각선으로 접어 정사각형 만들기 · 띠에서 정사각형 잇달아 잘라 내기
//          · 마름모·평행사변형과 붙인 사각형의 공통 변 · 여러 도형을 한 줄로 붙인 둘레
//   3단원 — 한 자리 수를 곱하는 네이피어·넓이 모형 · 곱하는 수의 합이 10·100·1000이 되게 묶기 · 9·99에 가까운 수
//          · 1부터 n까지의 합 표 · 긴 덧셈의 빈칸
//   4단원 — 범위마다 수의 개수와 숫자의 개수 표 · 1부터 N까지 숫자의 개수·들어 있는 수·빼고 남는 수

import { dimOut, dimArc } from "./length-dim.js?v=20261124h";
import { foldStepArrowSvg, foldArrowSvg, foldCaptionSvg, foldCreaseSvg, FOLD_CAPTION_SPACE } from "./fold-visuals.js?v=20261123a";

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[randomInt(0, list.length - 1)];
const sum = (list) => list.reduce((total, value) => total + value, 0);

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}
const lcm = (a, b) => (a / gcd(a, b)) * b;
const gcdAll = (list) => list.reduce((g, v) => gcd(g, v), 0);

// 수 뒤 받침: 끝자리 2·4·5·9는 받침 없음(이·사·오·구), 나머지(영·일·삼·육·칠·팔·십·백·천)는 받침 있음.
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(n) % 10);
const josa = (n, withBatchim, without) => `${n}${hasBatchim(n) ? withBatchim : without}`;
const fmt = (n) => Number(n).toLocaleString("en-US");

const INK = "#2f2a24";
const LINE = "#4d7a66";
const FILL = "#e4f1ea";
const SHADE = "#bcdcca";
const FONT = "font-family:'Noto Sans KR','FC Sans',sans-serif";
const MARKS = ["㉠", "㉡", "㉢", "㉣"];
const PARTS = ["(1)", "(2)", "(3)", "(4)", "(5)"];
const NAMES = ["㉮", "㉯", "㉰", "㉱", "㉲"];

const f1 = (v) => Math.round(v * 10) / 10;
const svgOpen = (w, h, label) => `<svg width="${Math.round(w)}" height="${Math.round(h)}" viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" style="width:${Math.round(w)}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">`;
const text = (x, y, value, size = 16, extra = "") => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" dominant-baseline="central" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const poly = (points, fill = FILL, stroke = LINE, extra = "") => `<polygon points="${points.map(([x, y]) => `${f1(x)},${f1(y)}`).join(" ")}" style="fill:${fill};stroke:${stroke};stroke-width:1.6;stroke-linejoin:round" ${extra}/>`;
const rect = (x, y, w, h, fill = FILL, stroke = LINE, extra = "") => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" style="fill:${fill};stroke:${stroke};stroke-width:1.5" ${extra}/>`;
const dashedRect = (x, y, w, h) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" style="fill:none;stroke:#7d8d86;stroke-width:1.3;stroke-dasharray:4 3"/>`;
// 변 길이 = 바깥 곡선 점선 + 끊은 자리 글자(스킬 gfield-textbook-design 4-3). a·b 끝점, c는 도형 가운데.
const len = (a, b, c, label, { off = 14, size = 15 } = {}) => {
  if (label == null || label === "") return "";
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  const across = Math.abs(b[1] - a[1]) / L;
  const w = String(label).length * size * 0.56;
  return dimOut({ x: a[0], y: a[1] }, { x: b[0], y: b[1] }, { x: c[0], y: c[1] }, String(label), { off: off + across * w * 0.5, size });
};
const box = (inner, { pad = "10px 14px" } = {}) => `<div style="display:inline-flex;flex-direction:column;gap:6px;align-items:flex-start;padding:${pad};border:1.5px solid #9cc0ae;border-radius:10px;background:#f3f9f5;${FONT};color:${INK};font-size:18px;line-height:1.5">${inner}</div>`;
const exprLine = (value) => `<div style="white-space:nowrap">${value}</div>`;

// ── 모양(도형식·저울) ─────────────────────────────────

const SHAPES = Object.freeze([
  { key: "triangle", ch: "△" },
  { key: "circle", ch: "○" },
  { key: "diamond", ch: "◇" },
  { key: "square", ch: "□" },
  { key: "plus", ch: "✚" },
  { key: "pentagon", ch: "⬠" },
  { key: "star", ch: "☆" },
  { key: "heart", ch: "♡" }
]);

function glyph(key, cx, cy, r = 12, fill = "#fff") {
  const line = `style="fill:${fill};stroke:#2f6f8f;stroke-width:1.6;stroke-linejoin:round"`;
  const pts = (list) => list.map(([x, y]) => `${f1(cx + x * r)},${f1(cy + y * r)}`).join(" ");
  switch (key) {
    case "circle": return `<circle cx="${cx}" cy="${cy}" r="${r}" ${line}/>`;
    case "triangle": return `<polygon points="${pts([[0, -1.05], [1.1, 0.85], [-1.1, 0.85]])}" ${line}/>`;
    case "square": return `<rect x="${f1(cx - r * 0.92)}" y="${f1(cy - r * 0.92)}" width="${f1(r * 1.84)}" height="${f1(r * 1.84)}" ${line}/>`;
    case "diamond": return `<polygon points="${pts([[0, -1.1], [1.1, 0], [0, 1.1], [-1.1, 0]])}" ${line}/>`;
    case "plus": return `<polygon points="${pts([[-0.38, -1], [0.38, -1], [0.38, -0.38], [1, -0.38], [1, 0.38], [0.38, 0.38], [0.38, 1], [-0.38, 1], [-0.38, 0.38], [-1, 0.38], [-1, -0.38], [-0.38, -0.38]])}" ${line}/>`;
    case "pentagon": return `<polygon points="${pts([[0, -1.05], [1.02, -0.3], [0.63, 0.92], [-0.63, 0.92], [-1.02, -0.3]])}" ${line}/>`;
    case "heart": return `<path d="M${cx} ${f1(cy + r * 0.95)}C${f1(cx - r * 1.5)} ${f1(cy - r * 0.05)} ${f1(cx - r * 0.95)} ${f1(cy - r * 1.25)} ${cx} ${f1(cy - r * 0.45)}C${f1(cx + r * 0.95)} ${f1(cy - r * 1.25)} ${f1(cx + r * 1.5)} ${f1(cy - r * 0.05)} ${cx} ${f1(cy + r * 0.95)}Z" ${line}/>`;
    default: {
      const star = [];
      for (let i = 0; i < 10; i += 1) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rr = i % 2 ? 0.45 : 1.08;
        star.push([Math.cos(a) * rr, Math.sin(a) * rr + 0.06]);
      }
      return `<polygon points="${pts(star)}" ${line}/>`;
    }
  }
}

function cardsSvg(cards) {
  const w = 30;
  const gap = 6;
  const width = cards.length * w + (cards.length - 1) * gap + 4;
  let body = "";
  cards.forEach((value, i) => {
    const x = 2 + i * (w + gap);
    body += `<rect x="${x}" y="2" width="${w}" height="34" rx="3" style="fill:#e3f0f7;stroke:#2f6f8f;stroke-width:1.4"/>`;
    body += text(x + w / 2, 20, value, 17, 'font-weight="700"');
  });
  return `${svgOpen(width, 38, `수 카드 ${cards.join(", ")}`)}${body}</svg>`;
}

// 도형 덧셈식 묶음: eqs = [{ L:[모양 번호…], R:[…] }]
function symbolEquationSvg(eqs, shapes) {
  const step = 30;
  const plusW = 22;
  const rowH = 38;
  const tokens = eqs.map((eq) => {
    const out = [];
    eq.L.forEach((s, i) => { if (i) out.push("+"); out.push(s); });
    out.push("=");
    eq.R.forEach((s, i) => { if (i) out.push("+"); out.push(s); });
    return out;
  });
  const widthOf = (row) => row.reduce((w, t) => w + (typeof t === "number" ? step : plusW), 0);
  const width = Math.max(...tokens.map(widthOf)) + 36;
  const height = eqs.length * rowH + 20;
  let body = `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" style="fill:#e8f3f8;stroke:none"/>`;
  tokens.forEach((row, r) => {
    let x = 18;
    const cy = 10 + r * rowH + rowH / 2;
    row.forEach((t) => {
      if (typeof t === "number") { body += glyph(shapes[t].key, x + step / 2, cy, 11); x += step; }
      else { body += text(x + plusW / 2, cy, t, 17); x += plusW; }
    });
  });
  return `${svgOpen(width, height, "도형으로 쓴 식")}${body}</svg>`;
}

// ── 1단원: 재는 횟수만 주고 막대의 차로 재는 횟수 ─────────

const MEASURE_THINGS = ["연필", "책상의 가로", "칠판의 세로", "리본", "교실 문의 폭", "줄넘기 줄", "식탁의 가로", "창문의 가로"];

function rodPairs(maxB) {
  const out = [];
  for (let a = 2; a < maxB; a += 1) for (let b = a + 1; b <= maxB; b += 1) {
    if ((a * b) % (b - a)) continue;
    const c = (a * b) / (b - a);
    if (c > 48) continue;
    out.push([a, b]);
  }
  return out;
}

function barsRowsSvg(rows, { width = 300, label = "같은 길이를 잰 막대" } = {}) {
  // rows: [{ name, count, tone }] — 모두 같은 전체 길이
  const X0 = 46;
  const H = 24;
  const gap = 12;
  let body = "";
  rows.forEach((row, k) => {
    const y = 8 + k * (H + gap);
    body += text(X0 - 22, y + H / 2, row.name, 16, 'font-weight="700"');
    const cw = width / row.count;
    for (let i = 0; i < row.count; i += 1) body += rect(X0 + i * cw, y, cw, H, row.fill || FILL, LINE);
    if (row.inner) for (let i = 0; i < row.count; i += 1) body += text(X0 + i * cw + cw / 2, y + H / 2, row.inner, 13);
  });
  const W = X0 + width + 8;
  const HH = 8 + rows.length * (H + gap);
  return `${svgOpen(W, HH, label)}${body}</svg>`;
}

function rodDifferenceFromCountsB6({ difficulty = 2 }) {
  const pairs = rodPairs(difficulty === 1 ? 6 : difficulty === 2 ? 10 : 16).filter(([a, b]) => (difficulty === 3 ? gcd(a, b) > 1 || b > 8 : true));
  const [a, b] = pick(pairs);
  const tool = pick(["막대", "끈"]);
  const thing = pick(MEASURE_THINGS);
  const L = lcm(a, b);
  const first = L / a;
  const second = L / b;
  const diff = first - second;
  const answer = L / diff;
  const W = 300;
  const X0 = 46;
  const H = 22;
  let body = "";
  // ㉠·㉡·㉢ 한 개씩 — 같은 왼쪽에서 시작, ㉢은 ㉠에서 ㉡을 잘라 낸 나머지
  const unitPx = W / L;
  const rows = [[MARKS[0], first, 0], [MARKS[1], second, 0], [MARKS[2], diff, second]];
  rows.forEach(([name, length, start], k) => {
    const y = 8 + k * (H + 14);
    body += text(X0 - 22, y + H / 2, name, 16, 'font-weight="700"');
    body += rect(X0 + start * unitPx, y, length * unitPx, H, k === 2 ? SHADE : FILL, LINE);
  });
  body += `<line x1="${f1(X0 + second * unitPx)}" y1="${8 + H + 4}" x2="${f1(X0 + second * unitPx)}" y2="${8 + 2 * (H + 14) + H + 2}" style="stroke:#7d8d86;stroke-width:1.2;stroke-dasharray:3 3"/>`;
  body += `<line x1="${f1(X0 + first * unitPx)}" y1="${8 + H + 2}" x2="${f1(X0 + first * unitPx)}" y2="${8 + 2 * (H + 14) + H + 2}" style="stroke:#7d8d86;stroke-width:1.2;stroke-dasharray:3 3"/>`;
  const html = `${svgOpen(X0 + W + 10, 8 + 3 * (H + 14), "막대 세 개")}${body}</svg>`;
  return {
    prompt: `${tool} ${MARKS[0]}에서 ${tool} ${MARKS[1]}만큼 잘라 내고 남은 길이가 ${tool} ${MARKS[2]}입니다. ${thing}의 길이는 ${tool} ${MARKS[0]}으로 ${a}번, ${tool} ${MARKS[1]}으로 ${b}번 잰 길이와 같습니다. ${thing}의 길이를 ${tool} ${MARKS[2]}으로 재면 몇 번인가요?`,
    visual: { kind: "fig", html },
    answer: `${answer}번`,
    solution: `${thing}의 길이를 ${a}로도 ${b}로도 나누어지는 가장 작은 수 ${L}로 생각합니다. ${MARKS[0]}은 ${L} ÷ ${a} = ${first}, ${MARKS[1]}은 ${L} ÷ ${b} = ${second}이므로 ${MARKS[2]}은 ${first} − ${second} = ${diff}입니다. ${L} ÷ ${diff} = ${answer}이므로 ${answer}번 잽니다.`,
    meta: { family: "rod-difference-from-counts-b6", a, b, L, first, second, diff, answer }
  };
}

// ── 1단원: 같은 길이 두 막대 — 조각 수로 거꾸로 비 ─────────

function equalLengthBarsReverseRatioB6({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 2 : 3;
  const top = difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8;
  const seen = new Set();
  const items = [];
  let guard = 0;
  while (items.length < parts && guard < 200) {
    guard += 1;
    const m = randomInt(1, top);
    const n = randomInt(1, top);
    if (m === n || seen.has(`${m}:${n}`)) continue;
    if (difficulty === 3 && items.length === parts - 1 && !items.some((it) => gcd(it.m, it.n) > 1) && gcd(m, n) === 1) continue;
    seen.add(`${m}:${n}`);
    const g = gcd(m, n);
    items.push({ m, n, ratio: [n / g, m / g] });
  }
  const W = 260;
  const X0 = 44;
  const H = 24;
  const html = items.map((it, i) => {
    let body = "";
    [[MARKS[0], it.m], [MARKS[1], it.n]].forEach(([name, count], k) => {
      const y = 4 + k * H;
      body += text(X0 - 22, y + H / 2, name, 15, 'font-weight="700"');
      const cw = W / count;
      for (let j = 0; j < count; j += 1) {
        body += rect(X0 + j * cw, y, cw, H, FILL, LINE);
        body += text(X0 + j * cw + cw / 2, y + H / 2, name, 13);
      }
    });
    return `<div style="display:flex;align-items:center;gap:8px"><b style="font-size:15px;${FONT}">${PARTS[i]}</b>${svgOpen(X0 + W + 6, 2 * H + 8, `${it.m}칸과 ${it.n}칸`)}${body}</svg></div>`;
  }).join("");
  const answer = items.map((it, i) => `${PARTS[i]} ${it.ratio[0]} : ${it.ratio[1]}`).join(", ");
  return {
    prompt: `두 막대의 전체 길이는 같습니다. 칸 하나가 막대 ${MARKS[0]} 하나, 막대 ${MARKS[1]} 하나일 때 ${MARKS[0]}과 ${MARKS[1]}의 길이의 비를 가장 간단하게 나타내세요.`,
    visual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:10px">${html}</div>` },
    answer,
    solution: items.map((it, i) => `${PARTS[i]} 같은 길이에 ${MARKS[0]}이 ${it.m}개, ${MARKS[1]}이 ${it.n}개 들어가므로 하나의 길이는 개수와 거꾸로입니다. ${MARKS[0]} : ${MARKS[1]} = ${it.n} : ${it.m}${gcd(it.m, it.n) > 1 ? ` = ${it.ratio[0]} : ${it.ratio[1]}` : ""}입니다.`).join(" "),
    meta: { family: "equal-length-bars-reverse-ratio-b6", items, answer: items.map((it) => it.ratio) }
  };
}

// ── 1단원: 두 막대로 잰 횟수와 두 막대 길이의 합 → 전체 길이 ──

function equalBarsWholeLengthB6({ difficulty = 2 }) {
  const top = difficulty === 1 ? 5 : difficulty === 2 ? 6 : 8;
  let a;
  let b;
  do { a = randomInt(2, top); b = randomInt(2, top); } while (a === b || (difficulty === 1 && gcd(a, b) > 1));
  const g = gcd(a, b);
  const unit = randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 9 : 6);
  const first = (b / g) * unit;
  const second = (a / g) * unit;
  const total = first + second;
  const whole = a * first;
  const thing = pick(["연필", "리코더", "필통", "자", "우산", "막대 사탕"]);
  const html = barsRowsSvg([
    { name: "", count: 1, fill: "#f6eccd", inner: thing },
    { name: MARKS[0], count: a, inner: MARKS[0] },
    { name: MARKS[1], count: b, inner: MARKS[1] }
  ], { label: `${thing}의 길이를 잰 두 막대` });
  return {
    prompt: `${thing}의 길이를 막대 ${MARKS[0]}으로 재면 ${a}번, 막대 ${MARKS[1]}으로 재면 ${b}번입니다. 막대 ${MARKS[0]}과 막대 ${MARKS[1]}의 길이의 합이 ${total}cm일 때, ${thing}의 길이는 몇 cm인가요?`,
    visual: { kind: "fig", html },
    answer: `${whole}cm`,
    solution: `같은 길이에 ${MARKS[0]}이 ${a}번, ${MARKS[1]}이 ${b}번 들어가므로 ${MARKS[0]} : ${MARKS[1]} = ${b / g} : ${a / g}입니다. ${b / g + a / g}칸이 ${total}cm이므로 한 칸은 ${unit}cm, ${MARKS[0]}은 ${first}cm입니다. ${thing}은 ${MARKS[0]}의 ${a}배이므로 ${first} × ${a} = ${whole}cm입니다.`,
    meta: { family: "equal-bars-whole-length-b6", a, b, unit, first, second, total, whole, answer: whole }
  };
}

// ── 1단원: 수 카드 묶음과 도형 덧셈식(같은 모양 여러 번) ─────
// 식: { L:[모양 번호…], R:[…] } — 같은 모양이 여러 번 나올 수 있다(△ + △ = ○ + ○ + ○).

const sideSum = (side, vals) => side.reduce((t, s) => t + vals[s], 0);
const eqHolds = (eq, vals) => sideSum(eq.L, vals) === sideSum(eq.R, vals);
const eqShapes = (eq) => [...new Set([...eq.L, ...eq.R])];
const eqChars = (eq, shapes) => `${eq.L.map((s) => shapes[s].ch).join(" + ")} = ${eq.R.map((s) => shapes[s].ch).join(" + ")}`;
const eqNumbers = (eq, vals) => `${eq.L.map((s) => vals[s]).join(" + ")} = ${eq.R.map((s) => vals[s]).join(" + ")}`;

// 모양마다 서로 다른 카드를 넣어 보는 풀이기(limit개까지 센다)
function symbolBrute(k, cards, eqs, limit = 3) {
  const vals = new Array(k);
  const used = new Set();
  const found = [];
  const visit = (i) => {
    if (found.length >= limit) return;
    if (i === k) { if (eqs.every((eq) => eqHolds(eq, vals))) found.push([...vals]); return; }
    for (const v of cards) {
      if (used.has(v)) continue;
      vals[i] = v;
      used.add(v);
      visit(i + 1);
      used.delete(v);
    }
  };
  visit(0);
  return found;
}

// 아이가 하는 생각: 식마다 들어갈 수 있는 경우만 남기고, 정해진 수는 다른 모양에서 지운다.
// 카드 수와 모양 수가 같으면 「한 모양에만 들어갈 수 있는 카드」도 쓴다.
function symbolKidSolve(k, cards, eqs, shapes) {
  const domains = Array.from({ length: k }, () => new Set(cards));
  const steps = [];
  const order = [];
  const fixed = (s) => domains[s].size === 1;
  const valueOf = (s) => [...domains[s]][0];
  const tuples = (eq) => {
    const list = eqShapes(eq);
    const out = [];
    const vals = new Array(k);
    const used = new Set();
    const visit = (i) => {
      if (i === list.length) { if (eqHolds(eq, vals)) out.push(list.map((s) => vals[s])); return; }
      for (const v of domains[list[i]]) {
        if (used.has(v)) continue;
        vals[list[i]] = v;
        used.add(v);
        visit(i + 1);
        used.delete(v);
      }
    };
    visit(0);
    return { list, out };
  };
  const note = (s) => { if (!order.includes(s)) order.push(s); };
  for (let guard = 0; guard < 80; guard += 1) {
    let changed = false;
    for (const eq of eqs) {
      const { list, out } = tuples(eq);
      if (!out.length) return { solved: false, steps, order };
      const before = list.map(fixed);
      let shrunk = false;
      list.forEach((s, i) => {
        const allowed = new Set(out.map((t) => t[i]));
        if (allowed.size < domains[s].size) { domains[s] = allowed; shrunk = true; }
      });
      if (!shrunk) continue;
      changed = true;
      const now = list.filter((s, i) => !before[i] && fixed(s));
      if (!now.length) continue;
      now.forEach(note);
      const valsOf = (t) => { const v = new Array(k); list.forEach((s, i) => { v[s] = t[i]; }); return eqNumbers(eq, v); };
      const head = out.length === 1 ? `될 수 있는 것은 ${valsOf(out[0])} 하나뿐이므로` : out.length <= 3 ? `될 수 있는 것은 ${out.map(valsOf).join(", ")}이므로 어느 경우든` : "남은 수로 맞춰 보면";
      steps.push(`${eqChars(eq, shapes)}에서 ${head} ${now.map((s) => `${shapes[s].ch} = ${valueOf(s)}`).join(", ")}입니다.`);
    }
    // 정해진 수는 다른 모양에서 지운다
    for (let s = 0; s < k; s += 1) {
      if (!fixed(s)) continue;
      const v = valueOf(s);
      for (let t = 0; t < k; t += 1) {
        if (t === s || !domains[t].has(v)) continue;
        domains[t].delete(v);
        changed = true;
        if (!domains[t].size) return { solved: false, steps, order };
        if (fixed(t)) { note(t); steps.push(`${shapes[t].ch}에 남은 수는 ${valueOf(t)}뿐이므로 ${shapes[t].ch} = ${valueOf(t)}입니다.`); }
      }
    }
    if (cards.length === k) {
      for (const v of cards) {
        const holders = [];
        for (let s = 0; s < k; s += 1) if (domains[s].has(v)) holders.push(s);
        if (holders.length === 1 && !fixed(holders[0])) {
          domains[holders[0]] = new Set([v]);
          note(holders[0]);
          steps.push(`카드 ${josa(v, "을", "를")} 넣을 수 있는 모양은 ${shapes[holders[0]].ch}뿐이므로 ${shapes[holders[0]].ch} = ${v}입니다.`);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  const solved = domains.every((d) => d.size === 1);
  return { solved, steps, order, values: solved ? domains.map((d) => [...d][0]) : null };
}

function symbolEquationPool(k, vals) {
  const pool = [];
  const idx = Array.from({ length: k }, (_, i) => i);
  for (const x of idx) for (const y of idx) {
    if (x === y) continue;
    for (let p = 2; p <= 4; p += 1) for (let q = 1; q <= 5; q += 1) {
      if (p === q || p + q > 8) continue;
      if (q === 1 && p > 3) continue;
      const eq = { L: Array(p).fill(x), R: Array(q).fill(y) };
      if (eqHolds(eq, vals)) pool.push(eq);
    }
    for (const z of idx) {
      if (z === x || z === y || y > z) continue;
      for (const p of [2, 3]) { const eq = { L: Array(p).fill(x), R: [y, z] }; if (eqHolds(eq, vals)) pool.push(eq); }
    }
  }
  for (const x of idx) for (const y of idx) for (const z of idx) {
    if (x >= y || z === x || z === y) continue;
    for (const q of [2, 3]) { const eq = { L: [x, y], R: Array(q).fill(z) }; if (eqHolds(eq, vals)) pool.push(eq); }
    const eq = { L: [x, y], R: [z] };
    if (eqHolds(eq, vals)) pool.push(eq);
    for (const w of idx) {
      if (w <= z || w === x || w === y || x > z) continue;
      const eq4 = { L: [x, y], R: [z, w] };
      if (eqHolds(eq4, vals)) pool.push(eq4);
    }
  }
  return pool;
}

function symbolCardSetSumB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const range = difficulty > 1 && Math.random() < 0.4;
    const k = range ? (difficulty === 2 ? 4 : 5) : difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
    let cards;
    if (range) cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    else if (difficulty === 1) { const start = randomInt(1, 3); cards = [start, start + 1, start + 2, start + 3]; }
    else cards = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).sort((a, b) => a - b);
    const vals = shuffle(cards).slice(0, k);
    const pool = symbolEquationPool(k, vals);
    if (pool.length < 4) continue;
    const want = k <= 4 ? 3 : 4;
    const shapes = shuffle(SHAPES.slice(0, 7)).slice(0, k);
    for (let tries = 0; tries < 30; tries += 1) {
      const eqs = shuffle(pool).slice(0, want);
      const seen = new Set(eqs.flatMap(eqShapes));
      if (seen.size !== k) continue;
      if (eqs.filter((eq) => eq.L.length + eq.R.length >= 5).length > 2) continue;
      if (symbolBrute(k, cards, eqs, 2).length !== 1) continue;
      const kid = symbolKidSolve(k, cards, eqs, shapes);
      if (!kid.solved || kid.order.length < k - 1) continue;
      const target = kid.order[kid.order.length - 1];
      const answer = vals[target];
      // 식은 아이가 푸는 차례가 드러나지 않게 긴 식부터 둔다
      const shown = [...eqs].sort((a, b) => (b.L.length + b.R.length) - (a.L.length + a.R.length));
      const cardText = range ? "1부터 9까지의 수" : cards.join(", ");
      const html = `<div style="display:flex;flex-direction:column;align-items:center;gap:10px">${range ? "" : cardsSvg(cards)}${symbolEquationSvg(shown, shapes)}</div>`;
      return {
        prompt: `각 도형은 ${cardText} 중에서 서로 다른 수를 나타내고, 같은 도형은 같은 수입니다. 식을 보고 ${shapes[target].ch}에 알맞은 수를 구하세요.`,
        visual: { kind: "fig", html },
        answer: String(answer),
        solution: `${kid.steps.join(" ")} 따라서 ${shapes[target].ch} = ${answer}입니다.`,
        meta: { family: "symbol-card-set-sum-b6", k, cards, range, equations: shown, values: vals, shapes: shapes.map((s) => s.ch), target, answer }
      };
    }
  }
  return null;
}

// ── 1단원: 네 모양 저울 사슬 — 네 항 비와 몇 개의 무게 ─────

function balanceSvg(left, right, shapes) {
  // left·right: 모양 번호 목록
  const r = 9;
  const step = 21;
  const panW = Math.max(left.length, right.length, 2) * step + 18;
  const W = panW * 2 + 40;
  const H = 82;
  const cx = W / 2;
  const beamY = 50;
  let body = "";
  body += `<polygon points="${cx},${beamY + 2} ${cx - 13},${H - 4} ${cx + 13},${H - 4}" style="fill:#bfe0ea;stroke:#2f6f8f;stroke-width:1.2"/>`;
  body += `<line x1="6" y1="${beamY}" x2="${W - 6}" y2="${beamY}" style="stroke:#2f6f8f;stroke-width:2.4;stroke-linecap:round"/>`;
  [[left, 6 + panW / 2], [right, W - 6 - panW / 2]].forEach(([list, mid]) => {
    const start = mid - ((list.length - 1) * step) / 2;
    list.forEach((s, i) => { body += glyph(shapes[s].key, start + i * step, beamY - r - 4, r, "#fdf1d4"); });
  });
  return `${svgOpen(W, H, "평형을 이룬 양팔저울")}${body}</svg>`;
}

function balanceFourShapeChainB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    // ㉠ 모양 p개 = ㉡ 모양 q개
    const p = randomInt(2, difficulty === 1 ? 3 : 4);
    const q = randomInt(1, difficulty === 1 ? 3 : 5);
    if (p === q || gcd(p, q) !== 1) continue;
    const w = [q, p, 0, 0]; // 같은 비율로 놓은 무게
    const cA = randomInt(1, 2);
    const cB = randomInt(difficulty === 1 ? 0 : 1, 2);
    if (cA + cB < 2) continue;
    w[2] = cA * w[0] + cB * w[1];
    const dC = randomInt(1, 2);
    const dOther = pick([0, 1]);
    const dOtherCount = randomInt(dC === 2 ? 0 : 1, 2);
    w[3] = dC * w[2] + dOtherCount * w[dOther];
    if (w[3] % w[1] || w[3] / w[1] > 20) continue;
    const g = gcdAll(w);
    const ratio = w.map((v) => v / g);
    if (Math.max(...ratio) > 30) continue;
    const shapes = shuffle(SHAPES.filter((s) => ["circle", "square", "diamond", "star", "triangle", "heart"].includes(s.key))).slice(0, 4);
    const balances = [
      { L: Array(p).fill(0), R: Array(q).fill(1) },
      { L: [2], R: [...Array(cA).fill(0), ...Array(cB).fill(1)] },
      { L: [3], R: [...Array(dC).fill(2), ...Array(dOtherCount).fill(dOther)] }
    ];
    const html = balances.map((b) => balanceSvg(b.L, b.R, shapes)).join("");
    const many = w[3] / w[1];
    const ch = shapes.map((s) => s.ch);
    const joined = (list) => list.map((s) => ch[s]).join(" + ");
    return {
      prompt: `세 양팔저울이 모두 평형을 이루고 있습니다. (1) ${ch.join(" : ")}의 무게의 비를 가장 간단한 자연수의 비로 나타내세요. (2) ${ch[3]} 1개는 ${ch[1]} 몇 개의 무게와 같은가요?`,
      visual: { kind: "fig", html },
      answer: `(1) ${ratio.join(" : ")} (2) ${many}개`,
      solution: `첫째 저울에서 ${ch[0]} ${p}개와 ${ch[1]} ${q}개의 무게가 같으므로 ${ch[0]} 하나를 ${w[0]}, ${ch[1]} 하나를 ${w[1]}로 놓습니다. 둘째 저울에서 ${ch[2]} = ${joined(balances[1].R)}이므로 ${w[2]}, 셋째 저울에서 ${ch[3]} = ${joined(balances[2].R)}이므로 ${w[3]}입니다. ${g > 1 ? `모두 ${josa(g, "으로", "로")} 나누면 ` : ""}${ratio.join(" : ")}이고, ${w[3]} ÷ ${w[1]} = ${many}이므로 ${ch[3]} 1개는 ${ch[1]} ${many}개와 같습니다.`,
      meta: { family: "balance-four-shape-chain-b6", p, q, balances, weights: w, ratio, many, answer: [ratio, many] }
    };
  }
  return null;
}
