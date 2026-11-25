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
// 「으로/로」: 받침이 ㄹ(1·7·8)이거나 없으면 「로」
const ro = (n) => `${n}${[1, 7, 8, 2, 4, 5, 9].includes(Math.abs(n) % 10) ? "로" : "으로"}`;
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
    if ((a * b) % (b - a) || b === 2 * a) continue;
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
  const W = 240;
  const X0 = 46;
  const H = 22;
  let body = "";
  // ㉠·㉡·㉢ 한 개씩 — 같은 왼쪽에서 시작, ㉢은 ㉠에서 ㉡을 잘라 낸 나머지
  const unitPx = 240 / first; // ㉠ 한 개를 240px로
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
    solution: `${thing}의 길이를 ${ro(a)}도 ${ro(b)}도 나누어지는 가장 작은 수 ${ro(L)} 생각합니다. ${MARKS[0]}은 ${L} ÷ ${a} = ${first}, ${MARKS[1]}은 ${L} ÷ ${b} = ${second}이므로 ${MARKS[2]}은 ${first} − ${second} = ${diff}입니다. ${L} ÷ ${diff} = ${answer}이므로 ${answer}번 잽니다.`,
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
      solution: `첫째 저울에서 ${ch[0]} ${p}개와 ${ch[1]} ${q}개의 무게가 같으므로 ${ch[0]} 하나를 ${w[0]}, ${ch[1]} 하나를 ${ro(w[1])} 놓습니다. 둘째 저울에서 ${ch[2]} = ${joined(balances[1].R)}이므로 ${w[2]}, 셋째 저울에서 ${ch[3]} = ${joined(balances[2].R)}이므로 ${w[3]}입니다. ${g > 1 ? `모두 ${ro(g)} 나누면 ` : ""}${ratio.join(" : ")}이고, ${w[3]} ÷ ${w[1]} = ${many}이므로 ${ch[3]} 1개는 ${ch[1]} ${many}개와 같습니다.`,
      meta: { family: "balance-four-shape-chain-b6", p, q, balances, weights: w, ratio, many, answer: [ratio, many] }
    };
  }
  return null;
}

// ── 2단원: 정사각형으로 채운 직사각형 ─────────────────────
// 작은 정사각형(한 변 1) 몇 개를 한 줄로 놓고, 지금 직사각형의 한 변에 같은 정사각형 n개를 차례로 붙여 키운다.
// 붙일 때마다 그 변의 길이 ÷ n이 새 정사각형의 한 변이므로 아이가 차례로 따라가며 모든 길이를 알 수 있다.

const SIDE_WORD = { right: "오른쪽", left: "왼쪽", bottom: "아래", top: "위" };

function buildSquaredRectangle(difficulty) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const m = randomInt(2, 4);
    const squares = Array.from({ length: m }, (_, i) => ({ x: i, y: 0, s: 1, step: 0 }));
    let W = m;
    let H = 1;
    const steps = [];
    const count = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
    let ok = true;
    for (let k = 1; k <= count; k += 1) {
      const options = [];
      for (const side of ["right", "left", "bottom", "top"]) {
        const L = side === "right" || side === "left" ? H : W;
        for (const n of [1, 2, 3]) {
          if (L % n || (n > 1 && L / n < 2)) continue;
          if (n === 1 && steps.length && steps[steps.length - 1].side === side) continue;
          options.push({ side, n, L, s: L / n, weight: n === 1 ? 3 : 2 });
        }
      }
      if (!options.length) { ok = false; break; }
      const bag = options.flatMap((o) => Array(o.weight).fill(o));
      const o = pick(bag);
      const before = { W, H };
      if (o.side === "right") { for (let i = 0; i < o.n; i += 1) squares.push({ x: W, y: i * o.s, s: o.s, step: k }); W += o.s; }
      else if (o.side === "left") { squares.forEach((q) => { q.x += o.s; }); for (let i = 0; i < o.n; i += 1) squares.push({ x: 0, y: i * o.s, s: o.s, step: k }); W += o.s; }
      else if (o.side === "bottom") { for (let i = 0; i < o.n; i += 1) squares.push({ x: i * o.s, y: H, s: o.s, step: k }); H += o.s; }
      else { squares.forEach((q) => { q.y += o.s; }); for (let i = 0; i < o.n; i += 1) squares.push({ x: i * o.s, y: 0, s: o.s, step: k }); H += o.s; }
      steps.push({ ...o, before });
    }
    if (!ok || Math.max(W, H) > 15 || squares.length > 13 || steps[steps.length - 1].s < 2) continue;
    if (Math.max(W, H) / Math.min(W, H) > 2) continue;
    return { m, squares, W, H, steps };
  }
  return null;
}

function squaredRectangleSvg(build, { shaded, unitMark, sideLabel }) {
  const { squares, W, H } = build;
  const px = Math.min(300 / W, 260 / H, 34);
  const pad = 30;
  const X = (v) => pad + v * px;
  const Y = (v) => pad + v * px;
  let body = "";
  squares.forEach((q, i) => {
    body += rect(X(q.x), Y(q.y), q.s * px, q.s * px, i === shaded ? SHADE : "#fff", LINE);
    if (i === unitMark) body += text(X(q.x) + (q.s * px) / 2, Y(q.y) + (q.s * px) / 2, "1", Math.max(10, Math.min(15, px * 0.62)));
  });
  const c = [X(W / 2), Y(H / 2)];
  if (sideLabel?.side === "top") body += len([X(0), Y(0)], [X(W), Y(0)], c, sideLabel.text);
  if (sideLabel?.side === "left") body += len([X(0), Y(0)], [X(0), Y(H)], c, sideLabel.text, { off: 12 });
  return `${svgOpen(W * px + pad * 2, H * px + pad * 2, "정사각형으로 채운 직사각형")}${body}</svg>`;
}

function squaredRectangleSteps(build) {
  const lines = [`가장 작은 정사각형 ${build.m}개가 한 줄로 있으므로 처음 직사각형은 가로 ${build.m}, 세로 1입니다.`];
  build.steps.forEach((st) => {
    const sideName = st.side === "right" || st.side === "left" ? "세로" : "가로";
    lines.push(st.n === 1
      ? `${SIDE_WORD[st.side]}에 붙은 정사각형은 지금까지의 ${sideName} ${josa(st.L, "과", "와")} 한 변이 같으므로 ${st.s}입니다.`
      : `${SIDE_WORD[st.side]}에 붙은 같은 정사각형 ${st.n}개는 ${sideName} ${josa(st.L, "을", "를")} 나누어 가지므로 한 변은 ${st.L} ÷ ${st.n} = ${st.s}입니다.`);
  });
  return lines;
}

function squaredRectangleB6({ difficulty = 2 }) {
  const build = buildSquaredRectangle(difficulty);
  if (!build) return null;
  const { squares, W, H } = build;
  const lastStep = build.steps.length;
  const mode = difficulty === 1 ? "unit" : Math.random() < 0.5 ? "unit" : "total";
  if (mode === "unit") {
    const candidates = squares.map((q, i) => [q, i]).filter(([q]) => q.step >= lastStep - 1 && q.s > 1);
    const [target, shaded] = pick(candidates);
    const unitMark = squares.findIndex((q) => q.s === 1);
    return {
      prompt: "정사각형을 빈틈없이 붙여 만든 직사각형입니다. 가장 작은 정사각형의 한 변이 1일 때, 색칠한 정사각형의 한 변의 길이를 구하세요.",
      visual: { kind: "fig", html: squaredRectangleSvg(build, { shaded, unitMark }) },
      answer: String(target.s),
      solution: `${squaredRectangleSteps(build).join(" ")} 따라서 색칠한 정사각형의 한 변은 ${target.s}입니다.`,
      meta: { family: "squared-rectangle-b6", mode, squares, W, H, shaded, scale: 1, askPerimeter: false, answer: target.s }
    };
  }
  const scale = randomInt(2, difficulty === 3 ? 5 : 4);
  const labelSide = Math.random() < 0.5 ? "top" : "left";
  const given = (labelSide === "top" ? W : H) * scale;
  const askPerimeter = Math.random() < 0.5;
  const pool = squares.map((q, i) => [q, i]).filter(([q]) => (askPerimeter ? true : q.s > 1));
  const [target, shaded] = pick(pool);
  const side = target.s * scale;
  const answer = askPerimeter ? side * 4 : side;
  if (answer === given) return squaredRectangleB6({ difficulty });
  const sideWord = labelSide === "top" ? "가로" : "세로";
  return {
    prompt: `정사각형을 빈틈없이 붙여 직사각형을 만들었습니다. 직사각형의 ${sideWord}가 ${given}cm일 때, 색칠한 정사각형의 ${askPerimeter ? "둘레" : "한 변의 길이"}는 몇 cm인가요?`,
    visual: { kind: "fig", html: squaredRectangleSvg(build, { shaded, unitMark: -1, sideLabel: { side: labelSide, text: `${given}cm` } }) },
    answer: `${answer}cm`,
    solution: `가장 작은 정사각형의 한 변을 1칸으로 놓고 길이를 따라갑니다. ${squaredRectangleSteps(build).join(" ")} 직사각형의 ${sideWord}는 ${labelSide === "top" ? W : H}칸이므로 1칸은 ${given} ÷ ${labelSide === "top" ? W : H} = ${scale}cm입니다. 색칠한 정사각형의 한 변은 ${target.s}칸 = ${side}cm${askPerimeter ? `이고 둘레는 ${side} × 4 = ${answer}cm` : ""}입니다.`,
    meta: { family: "squared-rectangle-b6", mode, squares, W, H, shaded, scale, given, labelSide, askPerimeter, answer }
  };
}

// ── 2단원: 대각선으로 접어 정사각형 만들기 ────────────────

const PAPER = "#f9c8c4";
const PAPER_LINE = "#e8968f";

function foldToSquareSvg(H, d, { showStrip, showHeight, squarePerimeter, rectPerimeter }) {
  const W = H + d;
  const px = 104 / W;
  const top = 34;
  const gap = 46;
  const cell = (x0) => ({ X: (v) => x0 + v * px, Y: (v) => top + v * px });
  let body = "";
  // 처음
  const a = cell(showHeight ? 60 : 26);
  body += `<rect x="${f1(a.X(0))}" y="${f1(a.Y(0))}" width="${f1(W * px)}" height="${f1(H * px)}" fill="${PAPER}" stroke="${PAPER_LINE}" stroke-width="2"/>`;
  if (showHeight) body += len([a.X(0), a.Y(0)], [a.X(0), a.Y(H)], [a.X(W / 2), a.Y(H / 2)], `${H}cm`, { off: 10 });
  if (rectPerimeter) body += text(a.X(W / 2), a.Y(H) + 30, `둘레 ${rectPerimeter}cm`, 13);
  else body += foldCaptionSvg(a.X(W / 2), a.Y(H) + 26, 0);
  body += foldStepArrowSvg(a.X(W) + 8, a.Y(H / 2));
  // 1번 접음: 위 삼각형을 왼쪽 아래로 접는다
  const b = cell(a.X(W) + gap);
  body += `<rect x="${f1(b.X(H))}" y="${f1(b.Y(0))}" width="${f1(d * px)}" height="${f1(H * px)}" fill="${PAPER}" stroke="${PAPER_LINE}" stroke-width="2"/>`;
  body += `<polygon points="${f1(b.X(0))},${f1(b.Y(0))} ${f1(b.X(0))},${f1(b.Y(H))} ${f1(b.X(H))},${f1(b.Y(H))}" fill="#f2a9a2" stroke="${PAPER_LINE}" stroke-width="2"/>`;
  body += `<polygon points="${f1(b.X(0))},${f1(b.Y(0))} ${f1(b.X(H))},${f1(b.Y(0))} ${f1(b.X(H))},${f1(b.Y(H))}" fill="none" stroke="#c9a9a4" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  body += foldArrowSvg({ x: H * 0.68, y: H * 0.3 }, { x: H * 0.3, y: H * 0.68 }, b.X(0), top, px);
  body += `<line x1="${f1(b.X(H))}" y1="${f1(b.Y(0) - 6)}" x2="${f1(b.X(H))}" y2="${f1(b.Y(H) + 6)}" stroke="#b03a5b" stroke-width="1.8" stroke-dasharray="5 3"/>`;
  if (showStrip) body += len([b.X(H), b.Y(0)], [b.X(W), b.Y(0)], [b.X(H + d / 2), b.Y(H / 2)], `${d}cm`, { off: 10, size: 13 });
  body += foldCaptionSvg(b.X(W / 2), b.Y(H) + 26, 1);
  body += foldStepArrowSvg(b.X(W) + 8, b.Y(H / 2));
  // 잘라 내고 펼침
  const c = cell(b.X(W) + gap);
  body += `<rect x="${f1(c.X(0))}" y="${f1(c.Y(0))}" width="${f1(H * px)}" height="${f1(H * px)}" fill="${PAPER}" stroke="${PAPER_LINE}" stroke-width="2"/>`;
  body += foldCreaseSvg(c.X(0), c.Y(0), c.X(H), c.Y(H));
  body += `<text x="${f1(c.X(H / 2))}" y="${f1(c.Y(H) + 26)}" font-size="13" font-weight="800" text-anchor="middle" fill="#7a4a44" font-family="'Noto Sans KR',sans-serif">${squarePerimeter ? `둘레 ${squarePerimeter}cm` : "잘라 내고 펼침"}</text>`;
  const width = c.X(H) + 22;
  return `${svgOpen(width, top + H * px + FOLD_CAPTION_SPACE + 18, "직사각형을 접어 잘라 정사각형 만들기")}${body}</svg>`;
}

function foldRectangleToSquareB6({ difficulty = 2 }) {
  const H = randomInt(4, difficulty === 3 ? 15 : 12);
  const d = randomInt(1, Math.min(difficulty === 1 ? 5 : 7, H - 2));
  const W = H + d;
  const original = 2 * (W + H);
  const square = 4 * H;
  const mode = difficulty === 1 ? "strip" : difficulty === 2 ? pick(["strip", "drop"]) : pick(["drop", "reverse"]);
  const intro = "직사각형 종이의 짧은 변이 긴 변 위에 놓이도록 비스듬히 접은 뒤, 겹쳐지지 않은 부분을 잘라 내고 펼쳤더니 정사각형이 되었습니다.";
  if (mode === "strip") {
    return {
      prompt: `${intro} 잘라 낸 부분의 폭이 ${d}cm이고 정사각형의 둘레가 ${square}cm일 때, 처음 직사각형의 둘레는 몇 cm인가요?`,
      visual: { kind: "fig", html: foldToSquareSvg(H, d, { showStrip: true, squarePerimeter: square }) },
      answer: `${original}cm`,
      solution: `정사각형의 한 변은 ${square} ÷ 4 = ${H}cm이고, 이것이 처음 직사각형의 세로입니다. 가로는 ${H} + ${d} = ${W}cm이므로 둘레는 (${W} + ${H}) × 2 = ${original}cm입니다.`,
      meta: { family: "fold-rectangle-to-square-b6", mode, H, d, W, original, square, answer: original }
    };
  }
  if (mode === "drop") {
    return {
      prompt: `${intro} 만든 정사각형의 둘레는 처음 직사각형의 둘레보다 ${2 * d}cm 짧습니다. 처음 직사각형의 세로가 ${H}cm일 때, 처음 직사각형의 둘레는 몇 cm인가요?`,
      visual: { kind: "fig", html: foldToSquareSvg(H, d, { showHeight: true }) },
      answer: `${original}cm`,
      solution: `잘라 낸 부분 때문에 줄어든 것은 위와 아래의 가로 두 군데이므로 잘라 낸 폭은 ${2 * d} ÷ 2 = ${d}cm입니다. 가로는 ${H} + ${d} = ${W}cm이므로 둘레는 (${W} + ${H}) × 2 = ${original}cm입니다.`,
      meta: { family: "fold-rectangle-to-square-b6", mode, H, d, W, original, square, answer: original }
    };
  }
  return {
    prompt: `${intro} 처음 직사각형의 둘레가 ${original}cm이고 잘라 낸 부분의 폭이 ${d}cm일 때, 만든 정사각형의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html: foldToSquareSvg(H, d, { showStrip: true, rectPerimeter: original }) },
    answer: `${square}cm`,
    solution: `처음 직사각형의 가로와 세로의 합은 ${original} ÷ 2 = ${W + H}cm입니다. 가로는 세로보다 ${d}cm 길므로 세로는 (${W + H} − ${d}) ÷ 2 = ${H}cm입니다. 정사각형의 한 변은 세로와 같으므로 둘레는 ${H} × 4 = ${square}cm입니다.`,
    meta: { family: "fold-rectangle-to-square-b6", mode, H, d, W, original, square, answer: square }
  };
}

// ── 2단원: 띠에서 정사각형을 잇달아 잘라 내기 ─────────────

function successiveSquareCutsB6({ difficulty = 2 }) {
  const H = randomInt(difficulty === 1 ? 4 : 5, difficulty === 3 ? 12 : 9);
  const k = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  const sizes = [];
  let prev = H;
  for (let i = 0; i < k; i += 1) {
    const s = randomInt(Math.max(1, Math.ceil(prev / 3)), prev - 1);
    if (s < 1) return successiveSquareCutsB6({ difficulty });
    sizes.push(s);
    prev = s;
  }
  if (new Set(sizes).size !== sizes.length || sizes[sizes.length - 1] < 1) return successiveSquareCutsB6({ difficulty });
  const W = H + sum(sizes) + randomInt(3, 12);
  const fromTop = Math.random() < 0.3;
  // 남은 종이의 꼭짓점(오른쪽 위부터 시계 반대 방향이 아니어도 둘레만 잰다)
  // 남은 종이의 꼭짓점: 계단은 아래(또는 위) 모서리에서 오른쪽으로 갈수록 낮아진다
  const raw = [[H, 0], [W, 0], [W, H]];
  let cx = H + sum(sizes);
  raw.push([cx, H]);
  for (let i = k - 1; i >= 0; i -= 1) { raw.push([cx, H - sizes[i]]); cx -= sizes[i]; raw.push([cx, H - sizes[i]]); }
  const pts = fromTop ? raw.map(([a, b]) => [a, H - b]) : raw;
  let x = H;
  const perimeter = pts.reduce((t, [a, b], i) => { const [c, e] = pts[(i + 1) % pts.length]; return t + Math.abs(c - a) + Math.abs(e - b); }, 0);
  const answer = perimeter;
  const px = Math.min(360 / W, 140 / H, 22);
  const padX = 34;
  const padY = 32;
  const X = (v) => padX + v * px;
  const Y = (v) => padY + v * px;
  let body = `<polygon points="${pts.map(([a, b]) => `${f1(X(a))},${f1(Y(b))}`).join(" ")}" style="fill:${FILL};stroke:${LINE};stroke-width:1.6"/>`;
  body += dashedRect(X(0), Y(0), H * px, H * px);
  x = H;
  sizes.forEach((s) => { body += dashedRect(X(x), fromTop ? Y(0) : Y(H - s), s * px, s * px); x += s; });
  const c = [X(W / 2), Y(H / 2)];
  body += len([X(0), Y(0)], [X(W), Y(0)], c, `${W}cm`, { off: 12 });
  body += len([X(0), Y(0)], [X(0), Y(H)], c, `${H}cm`, { off: 10 });
  x = H;
  sizes.forEach((s) => {
    if (fromTop) body += dimArc(X(x), Y(s), X(x + s), Y(s), 9, `${s}cm`, { size: 13 });
    else body += len([X(x), Y(H)], [X(x + s), Y(H)], [X(x + s / 2), Y(0)], `${s}cm`, { off: 9, size: 13 });
    x += s;
  });
  const html = `${svgOpen(W * px + padX * 2, H * px + padY * 2 + 10, "정사각형을 잇달아 잘라 낸 종이")}${body}</svg>`;
  return {
    prompt: `직사각형 모양의 종이에서 점선으로 표시한 정사각형 ${k + 1}개를 차례로 잘라 냈습니다. 색칠한 남은 종이의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `처음에 한 변이 ${H}cm인 정사각형을 잘라 내면 가로 ${W - H}cm, 세로 ${H}cm인 직사각형이 남습니다. 그다음 정사각형들은 모서리에서 계단처럼 잘라 냈으므로, 들어간 가로 선과 세로 선을 바깥으로 옮기면 그 직사각형의 둘레와 같습니다. 따라서 (${W - H} + ${H}) × 2 = ${answer}cm입니다.`,
    meta: { family: "successive-square-cuts-b6", W, H, sizes, fromTop, points: pts, answer }
  };
}

// ── 2단원: 마름모·평행사변형과 붙인 사각형의 공통 변 ────────

function rhombusRectSharedSideB6({ difficulty = 2 }) {
  const h = randomInt(difficulty === 1 ? 3 : 4, difficulty === 3 ? 13 : 9);
  let w = randomInt(3, difficulty === 3 ? 16 : 12);
  if (w === h) w += 1;
  const rhombusPerimeter = 4 * h;
  const rectPerimeter = 2 * (w + h);
  const px = Math.max(Math.min(150 / Math.max(w, h), 16), 96 / w);
  const x0 = 40;
  const y0 = 34;
  const rw = w * px;
  const rh = h * px;
  const ax = rh * 0.82;
  const ay = rh * 0.57;
  let body = rect(x0, y0, rw, rh, "#fff", LINE);
  body += poly([[x0 + rw, y0], [x0 + rw + ax, y0 + ay], [x0 + rw + ax, y0 + ay + rh], [x0 + rw, y0 + rh]], FILL, LINE);
  body += text(x0 + rw / 2, y0 + rh / 2 - 9, "직사각형", 13) + text(x0 + rw / 2, y0 + rh / 2 + 10, `둘레 ${rectPerimeter}cm`, 13);
  body += text(x0 + rw + ax / 2, y0 + ay / 2 + rh / 2 - 9, "마름모", 13) + text(x0 + rw + ax / 2, y0 + ay / 2 + rh / 2 + 10, `둘레 ${rhombusPerimeter}cm`, 13);
  const c = [x0 + rw / 2, y0 + rh / 2];
  body += len([x0, y0], [x0 + rw, y0], c, "가로", { off: 12, size: 13 });
  body += len([x0, y0], [x0, y0 + rh], c, "세로", { off: 10, size: 13 });
  const html = `${svgOpen(x0 + rw + ax + 30, y0 + ay + rh + 20, "직사각형과 마름모를 붙인 도형")}${body}</svg>`;
  return {
    prompt: `둘레가 ${rhombusPerimeter}cm인 마름모와 둘레가 ${rectPerimeter}cm인 직사각형을 한 변이 꼭 맞게 붙였습니다. 직사각형의 가로와 세로는 각각 몇 cm인가요?`,
    visual: { kind: "fig", html },
    answer: `가로 ${w}cm, 세로 ${h}cm`,
    solution: `마름모는 네 변의 길이가 같으므로 한 변은 ${rhombusPerimeter} ÷ 4 = ${h}cm이고, 붙인 변인 직사각형의 세로도 ${h}cm입니다. 직사각형의 가로와 세로의 합은 ${rectPerimeter} ÷ 2 = ${w + h}cm이므로 가로는 ${w + h} − ${h} = ${w}cm입니다.`,
    meta: { family: "rhombus-rect-shared-side-b6", w, h, rhombusPerimeter, rectPerimeter, answer: [w, h] }
  };
}

function parallelogramRhombusSharedSideB6({ difficulty = 2 }) {
  const s = randomInt(difficulty === 1 ? 3 : 4, difficulty === 3 ? 14 : 10);
  let a = randomInt(s + 2, difficulty === 3 ? 30 : 20);
  const paraPerimeter = 2 * (a + s);
  const answer = 4 * s;
  const px = Math.min(210 / (a + s * 0.5), 14);
  const x0 = 26;
  const y0 = 24;
  const sx = s * px * 0.5;
  const sy = s * px * 0.866;
  const A = [x0 + sx, y0];
  const B = [x0 + sx + a * px, y0];
  const C = [x0 + a * px, y0 + sy];
  const D = [x0, y0 + sy];
  const v = [s * px * 0.6, s * px * 0.8];
  const E = [B[0] + v[0], B[1] + v[1]];
  const F = [C[0] + v[0], C[1] + v[1]];
  let body = poly([A, B, C, D], "#fff", LINE);
  body += poly([B, E, F, C], FILL, LINE);
  body += text((A[0] + C[0]) / 2, y0 + sy / 2 - 8, "평행사변형", 13) + text((A[0] + C[0]) / 2, y0 + sy / 2 + 10, `둘레 ${paraPerimeter}cm`, 13);
  body += text((B[0] + F[0]) / 2, (B[1] + F[1]) / 2, "마름모", 13);
  body += len(D, C, [(A[0] + C[0]) / 2, y0 + sy / 2], `${a}cm`, { off: 12 });
  const html = `${svgOpen(Math.max(F[0], E[0]) + 24, F[1] + 20, "평행사변형과 마름모를 붙인 도형")}${body}</svg>`;
  return {
    prompt: `둘레가 ${paraPerimeter}cm인 평행사변형과 마름모를 한 변이 꼭 맞게 붙였습니다. 마름모의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `평행사변형은 마주 보는 두 변의 길이가 같으므로 두 변의 합은 ${paraPerimeter} ÷ 2 = ${a + s}cm이고, 비스듬한 변은 ${a + s} − ${a} = ${s}cm입니다. 이 변이 마름모의 한 변이므로 마름모의 둘레는 ${s} × 4 = ${answer}cm입니다.`,
    meta: { family: "parallelogram-rhombus-shared-side-b6", a, s, paraPerimeter, answer }
  };
}

// ── 2단원: 여러 도형을 한 줄로 붙인 둘레 ─────────────────
// 붙인 변은 모두 같은 길이 s(정사각형·마름모·정삼각형의 한 변, 직사각형·평행사변형의 짧은 변).

const SHAPE_NAMES = { rect: "직사각형", para: "평행사변형", rhombus: "마름모", square: "정사각형", tri: "정삼각형" };

function chainPlan(difficulty, needPara) {
  const middle = shuffle(difficulty === 1 ? ["rhombus", needPara ? "para" : pick(["rect", "para"])] : difficulty === 2 ? ["rhombus", "para", pick(["rect", "square"])] : ["rhombus", "para", "rect"]);
  const ends = difficulty === 3 ? ["square", "tri"] : ["square"];
  const list = [...middle];
  if (difficulty === 1) list.push("square");
  else { list.push(ends[0]); if (ends[1]) list.push(ends[1]); }
  if (needPara && !list.includes("para")) list[0] = "para";
  return list;
}

function chainGeometry(list, s, longs) {
  // 붙인 변은 모두 세로. 왼쪽 끝 변 (0,0)-(0,s)에서 시작해 오른쪽으로 이어 간다.
  const pieces = [];
  let P = [0, 0];
  list.forEach((kind, i) => {
    const Q = [P[0], P[1] + s];
    if (kind === "tri") {
      const apex = [P[0] + s * 0.866, P[1] + s / 2];
      pieces.push({ kind, pts: [P, apex, Q] });
      return;
    }
    const length = kind === "rect" || kind === "para" ? longs[i] : s;
    const angle = kind === "rect" || kind === "square" ? 0 : (i % 2 ? 1 : -1) * (Math.PI / 180) * pick([24, 30, 36]);
    const v = [length * Math.cos(angle), length * Math.sin(angle)];
    const P2 = [P[0] + v[0], P[1] + v[1]];
    const Q2 = [Q[0] + v[0], Q[1] + v[1]];
    pieces.push({ kind, pts: [P, P2, Q2, Q], long: length });
    P = P2;
  });
  return pieces;
}

function chainPerimeter(list, s, longs) {
  const own = list.map((kind, i) => (kind === "tri" ? 3 * s : kind === "rect" || kind === "para" ? 2 * (longs[i] + s) : 4 * s));
  return sum(own) - 2 * s * (list.length - 1);
}

function chainSvg(pieces, s, { labelS, labelLong, mark }) {
  const all = pieces.flatMap((p) => p.pts);
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));
  const px = Math.min(380 / (maxX - minX), 170 / (maxY - minY), 18);
  const pad = 34;
  const T = ([x, y]) => [pad + (x - minX) * px, pad + (y - minY) * px];
  let body = "";
  pieces.forEach((p, i) => {
    const pts = p.pts.map(T);
    body += poly(pts, i === mark ? SHADE : i % 2 ? FILL : "#fff", LINE);
    const cx = sum(pts.map((q) => q[0])) / pts.length;
    const cy = sum(pts.map((q) => q[1])) / pts.length;
    if (i === mark) body += text(cx, cy, "㉮", 15);
  });
  const ctr = (p) => { const pts = p.pts.map(T); return [sum(pts.map((q) => q[0])) / pts.length, sum(pts.map((q) => q[1])) / pts.length]; };
  if (labelS != null) {
    const p = pieces[labelS];
    const pts = p.pts.map(T);
    // 붙이지 않은 바깥쪽 변 하나(정삼각형은 꼭짓점 쪽 변, 사각형은 붙인 변과 이웃한 변)
    const [a, b] = p.kind === "tri" ? [pts[1], pts[2]] : [pts[0], pts[1]];
    body += len(a, b, ctr(p), `${s}cm`, { off: 10, size: 13 });
  }
  (labelLong || []).forEach((i) => {
    const p = pieces[i];
    const pts = p.pts.map(T);
    body += len(pts[0], pts[1], ctr(p), `${p.long}cm`, { off: 10, size: 13 });
  });
  return `${svgOpen((maxX - minX) * px + pad * 2, (maxY - minY) * px + pad * 2, "여러 도형을 붙인 도형")}${body}</svg>`;
}

function shapeChainTotalPerimeterB6({ difficulty = 2 }) {
  const s = randomInt(3, difficulty === 3 ? 9 : 7);
  const list = chainPlan(difficulty, false);
  const longs = list.map((kind) => (kind === "rect" || kind === "para" ? randomInt(s + 1, s + (difficulty === 3 ? 8 : 6)) : 0));
  const pieces = chainGeometry(list, s, longs);
  const answer = chainPerimeter(list, s, longs);
  const longIdx = list.map((k, i) => (k === "rect" || k === "para" ? i : -1)).filter((i) => i >= 0);
  const sIdx = list.lastIndexOf(list.includes("square") ? "square" : list[list.length - 1]);
  const names = list.map((k) => SHAPE_NAMES[k]).join(", ");
  const outer = list.map((kind, i) => {
    const joins = (i > 0 ? 1 : 0) + (i < list.length - 1 ? 1 : 0);
    if (kind === "rect" || kind === "para") return `${SHAPE_NAMES[kind]} ${longs[i]} × 2${joins < 2 ? ` + ${s}` : ""}`;
    const n = (kind === "tri" ? 3 : 4) - joins;
    return `${SHAPE_NAMES[kind]} ${s} × ${n}`;
  });
  return {
    prompt: `${names}을 차례로 한 변씩 꼭 맞게 붙였습니다. 도형 전체의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html: chainSvg(pieces, s, { labelS: sIdx, labelLong: longIdx }) },
    answer: `${answer}cm`,
    solution: `붙인 변은 모두 ${SHAPE_NAMES[list[sIdx]]}의 한 변과 같은 ${s}cm입니다(정사각형·마름모·정삼각형은 네 변(세 변)이 같고, 직사각형·평행사변형은 마주 보는 변이 같습니다). 바깥에 드러난 변만 더하면 ${outer.join(", ")}이므로 모두 ${answer}cm입니다.`,
    meta: { family: "shape-chain-total-perimeter-b6", list, s, longs, answer }
  };
}

function shapeChainFindParallelogramB6({ difficulty = 2 }) {
  const s = randomInt(3, difficulty === 3 ? 9 : 7);
  const list = chainPlan(Math.max(difficulty, 1), true).filter((k) => k !== "rect" || difficulty === 3);
  const paraIdx = list.indexOf("para");
  const longs = list.map((kind) => (kind === "rect" || kind === "para" ? randomInt(s + 1, s + (difficulty === 3 ? 9 : 7)) : 0));
  const pieces = chainGeometry(list, s, longs);
  const total = chainPerimeter(list, s, longs);
  const answer = 2 * (longs[paraIdx] + s);
  const otherLong = list.map((k, i) => (k === "rect" ? i : -1)).filter((i) => i >= 0);
  const sIdx = list.includes("square") ? list.lastIndexOf("square") : list.length - 1;
  const names = list.map((k) => SHAPE_NAMES[k]).join(", ");
  const rest = total - 2 * longs[paraIdx];
  return {
    prompt: `${names}을 차례로 한 변씩 꼭 맞게 붙여 만든 도형의 둘레가 ${total}cm입니다. 평행사변형 ㉮의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html: chainSvg(pieces, s, { labelS: sIdx, labelLong: otherLong, mark: paraIdx }) },
    answer: `${answer}cm`,
    solution: `붙인 변은 모두 ${s}cm입니다. 평행사변형의 긴 두 변을 빼고 바깥에 드러난 변을 모두 더하면 ${rest}cm이므로, 긴 두 변의 합은 ${total} − ${rest} = ${2 * longs[paraIdx]}cm, 한 변은 ${longs[paraIdx]}cm입니다. ㉮의 둘레는 (${longs[paraIdx]} + ${s}) × 2 = ${answer}cm입니다.`,
    meta: { family: "shape-chain-find-parallelogram-b6", list, s, longs, total, paraIdx, answer }
  };
}

// ── 3단원: 한 자리 수를 곱하는 네이피어·넓이 모형 ───────────

function napierOneDigitB6({ difficulty = 2 }) {
  const first = difficulty === 1 ? randomInt(12, 98) : randomInt(difficulty === 2 ? 102 : 213, difficulty === 2 ? 498 : 987);
  const second = randomInt(difficulty === 1 ? 3 : 4, 9);
  if (first % 10 === 0) return napierOneDigitB6({ difficulty });
  const digits = String(first).split("").map(Number);
  const cells = digits.map((v) => v * second);
  const n = digits.length;
  const cw = 46;
  const x0 = 36;
  const y0 = 34;
  let body = "";
  digits.forEach((v, j) => {
    const x = x0 + j * cw;
    body += text(x + cw / 2, y0 - 14, v, 18, 'font-weight="700"');
    body += rect(x, y0, cw, cw, "#fff", LINE);
    body += `<line x1="${x + cw}" y1="${y0}" x2="${x}" y2="${y0 + cw}" style="stroke:#9db7aa;stroke-width:1.2"/>`;
  });
  body += text(x0 + n * cw + 16, y0 + cw / 2, second, 18, 'font-weight="700"');
  const html = `${svgOpen(x0 + n * cw + 36, y0 + cw + 18, "네이피어 곱셈 칸")}${body}</svg>`;
  const diag = [];
  for (let k = 0; k <= n; k += 1) {
    const tens = k < n ? Math.floor(cells[k] / 10) : 0;
    const ones = k > 0 ? cells[k - 1] % 10 : 0;
    diag.push(tens + ones);
  }
  const answer = first * second;
  return {
    prompt: `네이피어 곱셈법으로 ${first} × ${second}를 계산하세요.`.replace(`${second}를`, `${josa(second, "을", "를")}`),
    visual: { kind: "fig", html },
    answer: String(answer),
    solution: `칸마다 위의 숫자와 ${josa(second, "을", "를")} 곱해 ${cells.map((c) => String(c).padStart(2, "0")).join(", ")}${hasBatchim(cells[cells.length - 1]) ? "을" : "를"} 쓰고, 대각선을 따라 더하면 왼쪽부터 ${diag.join(", ")}입니다. 받아올림을 하면 ${first} × ${second} = ${answer}입니다.`,
    meta: { family: "napier-one-digit-b6", first, second, cells, answer }
  };
}

function areaModelOneDigitB6({ difficulty = 2 }) {
  const first = difficulty === 1 ? randomInt(13, 89) : randomInt(difficulty === 2 ? 21 : 112, difficulty === 2 ? 98 : 489);
  const tensMultiplier = difficulty > 1 && Math.random() < 0.4;
  const second = tensMultiplier ? randomInt(2, 9) * 10 : randomInt(3, 9);
  const digits = String(first).split("").map(Number);
  const parts = digits.map((v, i) => v * 10 ** (digits.length - 1 - i)).filter(Boolean);
  if (parts.length < 2) return areaModelOneDigitB6({ difficulty });
  const partials = parts.map((p) => p * second);
  const answer = first * second;
  const total = 300;
  const x0 = 46;
  const y0 = 34;
  const h = 70;
  const widths = parts.map((p) => Math.max(46, (Math.log10(p) + 1) * 40));
  const scale = Math.min(1, total / sum(widths));
  let x = x0;
  let body = "";
  parts.forEach((p, i) => {
    const w = widths[i] * scale;
    body += text(x + w / 2, y0 - 14, p, 15, 'font-weight="700"');
    body += rect(x, y0, w, h, i % 2 ? FILL : "#fff", LINE);
    body += text(x + w / 2, y0 + h / 2, "?", 16);
    x += w;
  });
  body += text(x0 - 20, y0 + h / 2, second, 15, 'font-weight="700"');
  const html = `${svgOpen(x + 16, y0 + h + 14, "넓이 모형")}${body}</svg>`;
  return {
    prompt: `${first}를 자리마다 나누어 그린 넓이 모형으로 ${first} × ${second}를 계산하세요.`.replace(`${first}를 자리`, `${josa(first, "을", "를")} 자리`).replace(`× ${second}를`, `× ${josa(second, "을", "를")}`),
    visual: { kind: "fig", html },
    answer: String(answer),
    solution: `${first} = ${parts.join(" + ")}이므로 칸마다 ${parts.map((p, i) => `${p} × ${second} = ${partials[i]}`).join(", ")}입니다. 모두 더하면 ${partials.join(" + ")} = ${answer}입니다.`,
    meta: { family: "area-model-one-digit-b6", first, second, parts, partials, answer }
  };
}

// ── 3단원: 곱하는 수의 합이 10·100·1000이 되게 묶기 ─────────

function commonFactorRoundSumB6({ difficulty = 2 }) {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? pick([10, 100]) : pick([100, 1000]);
  const a = base === 10 ? randomInt(12, 98) : base === 100 ? randomInt(11, 99) : randomInt(111, 999);
  const form = pick(base === 10 ? ["two", "one", "three"] : ["two", "self", "one", "three"]);
  let terms;
  if (form === "two") { const m = randomInt(base / 10, base - base / 10); terms = [m, base - m]; }
  else if (form === "self") { if (a >= base) return commonFactorRoundSumB6({ difficulty }); terms = [a, base - a]; }
  else if (form === "one") terms = [base - 1, 1];
  else { const m = randomInt(2, base - 3); terms = [m, base - 1 - m, 1]; }
  if (terms.some((t) => t <= 0)) return commonFactorRoundSumB6({ difficulty });
  const expression = terms.map((t) => (t === 1 ? `${a}` : `${a} × ${t}`)).join(" + ");
  const answer = a * base;
  const html = box(exprLine(expression));
  return {
    prompt: "같은 수가 들어 있는 곱셈을 묶어 간단하게 계산하세요.",
    visual: { kind: "fig", html },
    answer: fmt(answer),
    solution: `${terms.map((t) => `${josa(a, "을", "를")} ${t}번`).join(", ")} 더한 것을 모두 합치면 ${josa(a, "을", "를")} ${terms.join(" + ")} = ${base}번 더한 것과 같습니다. 따라서 ${a} × ${base} = ${fmt(answer)}입니다.`,
    meta: { family: "common-factor-round-sum-b6", a, terms, base, answer }
  };
}

function nearTenTimesB6({ difficulty = 2 }) {
  const M = pick(difficulty === 1 ? [9, 19, 29, 39] : difficulty === 2 ? [29, 39, 49, 59, 69, 99] : [49, 79, 99, 199, 299, 999]);
  const a = randomInt(2, difficulty === 3 ? 25 : 12);
  const round = M + 1;
  const answer = a * M;
  return {
    prompt: `${a} × ${josa(M, "은", "는")} ${josa(a, "을", "를")} ${M}번 더한 것입니다. ${a} × ${round}에서 ${josa(a, "을", "를")} 한 번 빼는 방법으로 간단하게 계산하세요.`,
    visual: { kind: "fig", html: box(exprLine(`${a} × ${M}`)) },
    answer: fmt(answer),
    solution: `${josa(a, "을", "를")} ${M}번 더한 것은 ${round}번 더한 것보다 ${a}만큼 작습니다. ${a} × ${M} = ${a} × ${round} − ${a} = ${fmt(a * round)} − ${a} = ${fmt(answer)}입니다.`,
    meta: { family: "near-ten-times-b6", a, M, answer }
  };
}

function nearNinesMixedSumB6({ difficulty = 2 }) {
  const form = difficulty === 1 ? pick(["nines", "steps"]) : difficulty === 2 ? pick(["gaps", "steps"]) : pick(["gaps", "nines"]);
  let values;
  let rounds;
  if (form === "nines") {
    // 같은 숫자로 시작하는 몇천·몇백·몇십·몇보다 똑같이 1(또는 2) 작은 수들
    const count = difficulty === 1 ? 3 : 4;
    const top = randomInt(1, 9);
    const gap = difficulty === 1 ? 1 : randomInt(1, 2);
    rounds = Array.from({ length: count }, (_, i) => top * 10 ** (count - i));
    values = rounds.map((r) => r - gap);
  } else if (form === "gaps") {
    const count = 4;
    rounds = Array.from({ length: count }, (_, i) => 10 ** (count - i));
    const top = randomInt(1, 5);
    rounds[0] *= top;
    const gaps = shuffle([1, 2, 3, 4]).slice(0, count);
    values = rounds.map((r, i) => r - gaps[i]);
  } else {
    const count = randomInt(4, difficulty === 1 ? 5 : 7);
    const startTens = randomInt(0, 4);
    const gap = randomInt(1, 2);
    rounds = Array.from({ length: count }, (_, i) => (startTens + i + 1) * 10);
    values = rounds.map((r) => r - gap);
  }
  const answer = sum(values);
  const gapSum = sum(rounds) - answer;
  return {
    prompt: "몇십·몇백·몇천에 가까운 수로 고쳐서 간단하게 계산하세요.",
    visual: { kind: "fig", html: box(exprLine(values.join(" + "))) },
    answer: fmt(answer),
    solution: `각 수를 ${rounds.slice(0, -1).map(fmt).join(", ")}, ${ro(rounds[rounds.length - 1])} 생각하면 합은 ${fmt(sum(rounds))}입니다. 더 생각한 만큼 ${rounds.map((r, i) => r - values[i]).join(" + ")} = ${gapSum}을 빼면 ${fmt(sum(rounds))} − ${gapSum} = ${fmt(answer)}입니다.`.replace(`${gapSum}을 빼면`, `${josa(gapSum, "을", "를")} 빼면`),
    meta: { family: "near-nines-mixed-sum-b6", form, values, rounds, answer }
  };
}

// ── 3단원: 1부터 n까지의 합 표(짝수 개 · 홀수 개) ───────────

function gaussTable(difficulty, parity) {
  const rows = difficulty === 1 ? 3 : 4;
  const top = difficulty === 1 ? 30 : difficulty === 2 ? 50 : 100;
  const pool = [];
  for (let n = 8; n <= top; n += 1) if ((n % 2 === 0) === (parity === "even")) pool.push(n);
  const ns = shuffle(pool).slice(0, rows).sort((a, b) => a - b);
  const sums = ns.map((n) => (n * (n + 1)) / 2);
  const tag = ["①", "②", "③", "④"];
  const html = box(ns.map((n, i) => exprLine(`${tag[i]}&nbsp; 1 + 2 + 3 + … + ${n}`)).join(""));
  return { ns, sums, tag, html };
}

function gaussSumTableEvenB6({ difficulty = 2 }) {
  const { ns, sums, tag, html } = gaussTable(difficulty, "even");
  return {
    prompt: "처음 수와 끝 수를 짝지어 더하는 방법으로 각 연속수의 합을 구하세요.",
    visual: { kind: "fig", html },
    answer: ns.map((n, i) => `${tag[i]} ${fmt(sums[i])}`).join(", "),
    solution: ns.map((n, i) => `${tag[i]} 1 + ${n} = ${josa(n + 1, "이", "가")} 되는 짝이 ${n / 2}쌍이므로 ${n + 1} × ${n / 2} = ${fmt(sums[i])}`).join(", ") + "입니다.",
    meta: { family: "gauss-sum-table-even-b6", ns, answer: sums }
  };
}

function gaussSumTableOddB6({ difficulty = 2 }) {
  const { ns, sums, tag, html } = gaussTable(difficulty, "odd");
  return {
    prompt: "가운데 수를 이용하여 각 연속수의 합을 구하세요.",
    visual: { kind: "fig", html },
    answer: ns.map((n, i) => `${tag[i]} ${fmt(sums[i])}`).join(", "),
    solution: ns.map((n, i) => `${tag[i]} 가운데 수는 (1 + ${n}) ÷ 2 = ${(n + 1) / 2}이고 수가 ${n}개이므로 ${(n + 1) / 2} × ${n} = ${fmt(sums[i])}`).join(", ") + "입니다.",
    meta: { family: "gauss-sum-table-odd-b6", ns, answer: sums }
  };
}

// ── 3단원: 둥근 수가 되는 짝이 이어진 긴 덧셈과 빈칸 ─────────

function roundPairLongMissingB6({ difficulty = 2 }) {
  const base = difficulty === 1 ? 100 : difficulty === 2 ? pick([100, 1000]) : 1000;
  const pairs = randomInt(difficulty === 1 ? 3 : 4, 5);
  const list = [];
  const used = new Set();
  while (list.length < pairs) {
    const low = randomInt(Math.floor(base * 0.05), Math.floor(base * 0.95));
    if (low * 2 === base || used.has(low) || used.has(base - low)) continue;
    used.add(low);
    list.push(Math.random() < 0.5 ? [low, base - low] : [base - low, low]);
  }
  const missing = difficulty > 1 || Math.random() < 0.5;
  const total = base * pairs;
  const flat = list.flat();
  const answer = missing ? flat[flat.length - 1] : total;
  const shown = missing ? [...flat.slice(0, -1), "□"] : flat;
  const expression = missing ? `${shown.join(" + ")} = ${fmt(total)}` : `${flat.join(" + ")} = □`;
  return {
    prompt: "합이 둥근 수가 되는 수끼리 묶어 □ 안에 알맞은 수를 구하세요.",
    visual: { kind: "fig", html: box(exprLine(expression)) },
    answer: fmt(answer),
    solution: missing
      ? `앞에서부터 두 수씩 더하면 ${list.slice(0, -1).map((p) => `${p[0]} + ${p[1]} = ${base}`).join(", ")}이므로 ${pairs - 1}쌍의 합은 ${fmt(base * (pairs - 1))}입니다. 마지막 두 수의 합도 ${base}이어야 하므로 □ = ${base} − ${list[pairs - 1][0]} = ${answer}입니다.`
      : `두 수씩 묶으면 ${list.map((p) => `${p[0]} + ${p[1]}`).join(", ")}${hasBatchim(list[list.length - 1][1]) ? "이" : "가"} 모두 ${base}이므로 ${base} × ${pairs} = ${fmt(total)}입니다.`,
    meta: { family: "round-pair-long-missing-b6", base, pairs: list, missing, total, answer }
  };
}

// ── 4단원: 범위마다 수의 개수와 숫자의 개수 ─────────────────

const digitCount = (a, b) => { let t = 0; for (let v = a; v <= b; v += 1) t += String(v).length; return t; };

function rangeCountTableB6({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 3 : 4;
  const ranges = [];
  const add = (a, b) => { if (b > a && !ranges.some(([x, y]) => x === a && y === b)) ranges.push([a, b]); };
  let guard = 0;
  while (ranges.length < rows && guard < 100) {
    guard += 1;
    const kind = difficulty === 1 ? pick(["one", "two", "two"]) : difficulty === 2 ? pick(["two", "two", "three", "fullTwo"]) : pick(["two", "three", "three", "fullThree", "fullTwo"]);
    if (kind === "one") { const a = randomInt(1, 5); add(a, randomInt(a + 2, 9)); }
    else if (kind === "two") { const a = randomInt(10, 70); add(a, randomInt(a + 5, 99)); }
    else if (kind === "three") { const a = randomInt(100, 700); add(a, Math.min(999, a + randomInt(8, 120))); }
    else if (kind === "fullTwo") add(10, 99);
    else add(100, 999);
  }
  ranges.sort((x, y) => x[0] - y[0]);
  const rowsOut = ranges.map(([a, b]) => ({ a, b, numbers: b - a + 1, digits: digitCount(a, b) }));
  const tag = ["①", "②", "③", "④"];
  const cell = "border:1.2px solid #9cc0ae;padding:6px 12px;text-align:center";
  const html = `<table style="border-collapse:collapse;${FONT};font-size:16px;color:${INK};background:#fff"><tr><th style="${cell};background:#e4f1ea">순</th><th style="${cell};background:#e4f1ea">수의 범위</th><th style="${cell};background:#e4f1ea">수의 개수</th><th style="${cell};background:#e4f1ea">숫자의 개수</th></tr>${rowsOut.map((r, i) => `<tr><td style="${cell}">${tag[i]}</td><td style="${cell}">${r.a} ~ ${r.b}</td><td style="${cell};min-width:64px"></td><td style="${cell};min-width:64px"></td></tr>`).join("")}</table>`;
  return {
    prompt: "주어진 수의 범위에서 수의 개수와 수를 모두 쓸 때 쓰는 숫자의 개수를 각각 구하세요.",
    visual: { kind: "fig", html },
    answer: rowsOut.map((r, i) => `${tag[i]} 수 ${r.numbers}개, 숫자 ${r.digits}개`).join(" / "),
    solution: rowsOut.map((r, i) => `${tag[i]} 수는 ${r.b} − ${r.a} + 1 = ${r.numbers}개이고, 모두 ${String(r.a).length}자리 수이므로 숫자는 ${r.numbers} × ${String(r.a).length} = ${r.digits}개`).join(", ") + "입니다.",
    meta: { family: "range-count-table-b6", rows: rowsOut, answer: rowsOut.map((r) => [r.numbers, r.digits]) }
  };
}

// ── 4단원: 1부터 N까지 — 숫자의 개수 · 들어 있는 수 · 빼고 남는 수 ──

function numberTableHtml(N) {
  if (N > 100) return box(exprLine(`1, 2, 3, …, ${N - 1}, ${N}`));
  const cell = "border:1px solid #b9d3c6;width:30px;height:24px;text-align:center;font-size:13px";
  let rows = "";
  for (let r = 0; r * 10 <= N; r += 1) {
    let tds = "";
    for (let c = 0; c < 10; c += 1) {
      const v = r * 10 + c;
      tds += `<td style="${cell}">${v >= 1 && v <= N ? v : ""}</td>`;
    }
    rows += `<tr>${tds}</tr>`;
  }
  return `<table style="border-collapse:collapse;${FONT};color:${INK};background:#fff">${rows}</table>`;
}

const hasAny = (v, digits) => digits.some((d) => String(v).includes(String(d)));

function digitChoice(difficulty, count) {
  return shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count).sort((a, b) => a - b);
}

function digitContainCountB6({ difficulty = 2 }) {
  const N = difficulty === 3 ? pick([100, 150, 200]) : difficulty === 1 ? pick([50, 60, 70, 80, 100]) : 100;
  const mode = difficulty === 1 ? pick(["occ", "contain"]) : pick(["occ", "contain", "contain"]);
  const count = mode === "occ" ? 1 : difficulty === 1 ? 1 : randomInt(2, 3);
  const digits = digitChoice(difficulty, count);
  let answer = 0;
  const hits = [];
  for (let v = 1; v <= N; v += 1) {
    if (mode === "occ") answer += [...String(v)].filter((ch) => ch === String(digits[0])).length;
    else if (hasAny(v, digits)) { answer += 1; hits.push(v); }
  }
  const dText = digits.length === 1 ? `숫자 ${josa(digits[0], "이", "가")}` : `숫자 ${digits.slice(0, -1).join(", ")}${digits.length === 2 ? (hasBatchim(digits[0]) ? "이나" : "나") : ","} ${josa(digits[digits.length - 1], "이", "가")}`;
  const prompt = mode === "occ"
    ? `1부터 ${N}까지의 수를 모두 쓸 때 숫자 ${josa(digits[0], "은", "는")} 모두 몇 번 쓰나요?`
    : `1부터 ${N}까지의 수 중에서 ${dText} 들어 있는 수는 모두 몇 개인가요?`;
  const ones = (d) => { let t = 0; for (let v = 1; v <= N; v += 1) if (v % 10 === d) t += 1; return t; };
  const tensCount = (d) => { let t = 0; for (let v = 1; v <= N; v += 1) if (Math.floor(v / 10) % 10 === d && v >= 10) t += 1; return t; };
  const solution = mode === "occ"
    ? `일의 자리에 ${digits[0]}이 오는 수는 ${ones(digits[0])}개, 십의 자리에 ${digits[0]}이 오는 수는 ${tensCount(digits[0])}개${N >= 100 && digits[0] === 1 ? `, 백의 자리에 1이 오는 수는 ${N - 99}개` : ""}이므로 모두 ${answer}번입니다.`.replaceAll(`${digits[0]}이`, josa(digits[0], "이", "가"))
    : `${digits.length === 1 ? `일의 자리에 ${josa(digits[0], "이", "가")} 있는 수와 십의 자리에 있는 수를 세고, 두 번 센 수는 한 번만 셉니다.` : "자리마다 그 숫자가 있는지 보고, 여러 숫자가 함께 들어 있는 수는 한 번만 셉니다."} 모두 ${answer}개입니다.`;
  return {
    prompt,
    visual: { kind: "fig", html: numberTableHtml(N) },
    answer: mode === "occ" ? `${answer}번` : `${answer}개`,
    solution,
    meta: { family: "digit-contain-count-b6", N, mode, digits, answer }
  };
}

function digitExcludeCountB6({ difficulty = 2 }) {
  const N = difficulty === 3 ? pick([100, 150, 200]) : difficulty === 1 ? pick([50, 60, 70, 80, 90, 100]) : 100;
  const count = difficulty === 1 ? 1 : difficulty === 2 ? randomInt(1, 2) : randomInt(2, 3);
  const digits = digitChoice(difficulty, count);
  let answer = 0;
  let removed = 0;
  for (let v = 1; v <= N; v += 1) { if (hasAny(v, digits)) removed += 1; else answer += 1; }
  const dText = digits.length === 1 ? `숫자 ${josa(digits[0], "이", "가")}` : `숫자 ${digits.slice(0, -1).join(", ")}${digits.length === 2 ? (hasBatchim(digits[0]) ? "이나" : "나") : ","} ${josa(digits[digits.length - 1], "이", "가")}`;
  return {
    prompt: `1부터 ${N}까지의 수 중에서 ${dText} 들어 있는 수를 모두 빼면, 남는 수는 모두 몇 개인가요?`,
    visual: { kind: "fig", html: numberTableHtml(N) },
    answer: `${answer}개`,
    solution: `${digits.length === 1 ? `숫자 ${josa(digits[0], "이", "가")}` : `${digits.join(", ")} 중 하나라도`} 들어 있는 수는 자리마다 살펴 세면 ${removed}개입니다. 전체 ${N}개에서 빼면 ${N} − ${removed} = ${answer}개입니다.`,
    meta: { family: "digit-exclude-count-b6", N, digits, removed, answer }
  };
}

// ── 내보내기 ─────────────────────────────────────────

export const BOOK06_STRUCTURE_GENERATORS = {
  rodDifferenceFromCountsB6,
  equalLengthBarsReverseRatioB6,
  equalBarsWholeLengthB6,
  symbolCardSetSumB6,
  balanceFourShapeChainB6,
  squaredRectangleB6,
  foldRectangleToSquareB6,
  successiveSquareCutsB6,
  rhombusRectSharedSideB6,
  parallelogramRhombusSharedSideB6,
  shapeChainTotalPerimeterB6,
  shapeChainFindParallelogramB6,
  napierOneDigitB6,
  areaModelOneDigitB6,
  commonFactorRoundSumB6,
  nearTenTimesB6,
  nearNinesMixedSumB6,
  gaussSumTableEvenB6,
  gaussSumTableOddB6,
  roundPairLongMissingB6,
  rangeCountTableB6,
  digitContainCountB6,
  digitExcludeCountB6
};

const row = (id, domain, middle, label, generator, aliases) => ({ id, domain, middle, label, generator, searchAliases: aliases });

export const BOOK06_STRUCTURE_TYPE_ROWS = [
  // domain/middle은 같은 단원 기존 유형 값을 따른다
  row("rod-difference-from-counts-b6", "number", "비와 측정", "잰 횟수만으로 두 막대의 차로 재는 횟수 구하기", "rodDifferenceFromCountsB6", ["막대의 차", "재는 횟수", "최소공배수"]),
  row("equal-length-bars-reverse-ratio-b6", "geometry", "분수와 비", "길이가 같은 두 막대의 조각 수로 거꾸로 비 구하기", "equalLengthBarsReverseRatioB6", ["거꾸로 비", "같은 길이 막대", "조각 수와 비"]),
  row("equal-bars-whole-length-b6", "number", "분수와 비", "두 막대로 잰 횟수와 길이의 합으로 전체 길이 구하기", "equalBarsWholeLengthB6", ["막대 길이의 합", "전체 길이", "잰 횟수"]),
  row("symbol-card-set-sum-b6", "number", "도형 수 추리", "수 카드 묶음으로 같은 도형이 여러 번 나오는 덧셈식 풀기", "symbolCardSetSumB6", ["도형 덧셈식", "수 카드", "같은 도형 같은 수"]),
  row("balance-four-shape-chain-b6", "logic", "비와 양팔저울", "네 모양 양팔저울로 무게의 비와 몇 개의 무게 구하기", "balanceFourShapeChainB6", ["양팔저울 사슬", "네 항의 비", "몇 개와 같은 무게"]),
  row("squared-rectangle-b6", "geometry", "정사각형 분할", "정사각형으로 빈틈없이 채운 직사각형의 길이", "squaredRectangleB6", ["정사각형 채우기", "정사각형 분할", "가장 작은 정사각형"]),
  row("fold-rectangle-to-square-b6", "geometry", "접기와 둘레", "비스듬히 접어 잘라 만든 정사각형과 처음 직사각형의 둘레", "foldRectangleToSquareB6", ["접어 자르기", "정사각형 만들기", "처음 둘레"]),
  row("successive-square-cuts-b6", "geometry", "잘라낸 도형의 둘레", "직사각형에서 정사각형을 잇달아 잘라 낸 뒤 남은 둘레", "successiveSquareCutsB6", ["계단 모양 둘레", "정사각형 잘라 내기", "남은 종이 둘레"]),
  row("rhombus-rect-shared-side-b6", "geometry", "붙인 도형의 둘레", "마름모 둘레로 붙인 직사각형의 가로·세로 찾기", "rhombusRectSharedSideB6", ["마름모와 직사각형", "공통 변", "둘레로 변 찾기"]),
  row("parallelogram-rhombus-shared-side-b6", "geometry", "붙인 도형의 둘레", "평행사변형 둘레로 붙인 마름모의 둘레 찾기", "parallelogramRhombusSharedSideB6", ["평행사변형과 마름모", "공통 변", "둘레로 변 찾기"]),
  row("shape-chain-total-perimeter-b6", "geometry", "붙인 도형의 둘레", "여러 사각형·삼각형을 한 줄로 붙인 도형의 둘레", "shapeChainTotalPerimeterB6", ["여러 도형 붙이기", "바깥 둘레", "같은 변"]),
  row("shape-chain-find-parallelogram-b6", "geometry", "붙인 도형의 둘레", "붙인 도형의 전체 둘레로 평행사변형의 둘레 찾기", "shapeChainFindParallelogramB6", ["여러 도형 붙이기", "전체 둘레로 거꾸로", "평행사변형 둘레"]),
  row("napier-one-digit-b6", "number", "곱셈을 간편하게", "네이피어 격자로 한 자리 수 곱하기", "napierOneDigitB6", ["네이피어 곱셈", "한 자리 수 곱하기", "대각선 더하기"]),
  row("area-model-one-digit-b6", "number", "곱셈을 간편하게", "자리마다 나눈 넓이 모형으로 한 자리 수·몇십 곱하기", "areaModelOneDigitB6", ["넓이 모형", "타일 곱셈", "자리마다 곱하기"]),
  row("common-factor-round-sum-b6", "number", "곱셈을 간편하게", "곱하는 수의 합이 10·100·1000이 되게 같은 수 묶기", "commonFactorRoundSumB6", ["같은 수 묶기", "곱하는 수의 합", "둥근 수 만들기"]),
  row("near-ten-times-b6", "number", "곱셈을 간편하게", "몇십보다 1 작은 수를 곱할 때 뺄셈으로 바꾸기", "nearTenTimesB6", ["9를 곱하기", "39번 더하기", "뺄셈으로 바꾸기"]),
  row("near-nines-mixed-sum-b6", "number", "덧셈을 간편하게", "몇십·몇백·몇천에 가까운 여러 수의 합", "nearNinesMixedSumB6", ["9가 이어진 수", "둥근 수로 고치기", "가까운 수의 합"]),
  row("gauss-sum-table-even-b6", "number", "연속수의 합", "1부터 짝수 n까지의 합 여러 개", "gaussSumTableEvenB6", ["가우스 계산", "1부터 n까지의 합", "짝지어 더하기"]),
  row("gauss-sum-table-odd-b6", "number", "연속수의 합", "1부터 홀수 n까지의 합 여러 개", "gaussSumTableOddB6", ["가운데 수", "1부터 n까지의 합", "홀수 개의 합"]),
  row("round-pair-long-missing-b6", "number", "덧셈을 간편하게", "둥근 수가 되는 짝이 이어진 긴 덧셈과 빈칸", "roundPairLongMissingB6", ["둥근 수 짝", "긴 덧셈", "빠진 수 찾기"]),
  row("range-count-table-b6", "number", "수와 숫자", "범위마다 수의 개수와 숫자의 개수 표", "rangeCountTableB6", ["수의 개수", "숫자의 개수", "범위 표"]),
  row("digit-contain-count-b6", "number", "숫자 포함", "1부터 N까지 숫자의 개수와 그 숫자가 들어 있는 수", "digitContainCountB6", ["숫자 세기", "들어 있는 수", "여러 숫자"]),
  row("digit-exclude-count-b6", "number", "숫자 포함", "1부터 N까지 여러 숫자가 들어 있는 수를 뺀 나머지", "digitExcludeCountB6", ["숫자 빼기", "남는 수", "여러 숫자 제외"])
];

export const BOOK06_STRUCTURE_GUIDES = {
  "rod-difference-from-counts-b6": "전체 길이를 두 횟수로 모두 나누어지는 가장 작은 수로 놓고 두 막대 길이와 그 차를 구합니다.",
  "equal-length-bars-reverse-ratio-b6": "같은 길이에 많이 들어가는 쪽이 짧으므로 길이의 비는 조각 수를 거꾸로 놓은 비입니다.",
  "equal-bars-whole-length-b6": "잰 횟수를 거꾸로 놓아 두 막대의 비를 구하고, 길이의 합을 나누어 한 막대의 길이를 찾은 뒤 횟수를 곱합니다.",
  "symbol-card-set-sum-b6": "될 수 있는 경우가 가장 적은 식부터 카드를 넣어 보고, 정해진 수는 다른 도형에서 지웁니다.",
  "balance-four-shape-chain-b6": "첫 저울로 두 모양의 무게를 수로 정하고, 나머지 저울을 차례로 바꾸어 모든 모양을 같은 단위로 나타냅니다.",
  "squared-rectangle-b6": "가장 작은 정사각형부터 시작해, 붙은 변의 길이로 다음 정사각형의 한 변을 차례로 구합니다.",
  "fold-rectangle-to-square-b6": "접어 만든 정사각형의 한 변은 처음 직사각형의 짧은 변이고, 잘라 낸 폭만큼 긴 변이 더 깁니다.",
  "successive-square-cuts-b6": "모서리에서 계단처럼 잘라 낸 곳은 들어간 선을 바깥으로 옮기면 직사각형 둘레와 같습니다.",
  "rhombus-rect-shared-side-b6": "마름모의 둘레를 4로 나눈 한 변이 붙인 변이므로, 직사각형 둘레의 반에서 그 변을 빼 다른 변을 찾습니다.",
  "parallelogram-rhombus-shared-side-b6": "평행사변형 둘레의 반에서 아는 변을 빼 붙인 변을 찾고, 그 변의 4배가 마름모의 둘레입니다.",
  "shape-chain-total-perimeter-b6": "붙인 변은 모두 길이가 같으므로, 도형마다 바깥에 드러난 변만 세어 더합니다.",
  "shape-chain-find-parallelogram-b6": "전체 둘레에서 길이를 아는 바깥 변을 모두 빼 평행사변형의 긴 두 변을 찾습니다.",
  "napier-one-digit-b6": "칸마다 두 숫자의 곱을 십의 자리·일의 자리로 나누어 쓰고, 대각선을 따라 더해 받아올림합니다.",
  "area-model-one-digit-b6": "곱해지는 수를 자리마다 나누어 칸마다 곱하고, 칸의 넓이를 모두 더합니다.",
  "common-factor-round-sum-b6": "같은 수를 몇 번씩 더했는지 모아 곱하는 수의 합을 10·100·1000으로 만듭니다.",
  "near-ten-times-b6": "몇십보다 1 작은 수만큼 곱하는 것은 몇십만큼 곱한 뒤 한 번 빼는 것과 같습니다.",
  "near-nines-mixed-sum-b6": "각 수를 가까운 둥근 수로 생각해 더한 뒤 더 생각한 만큼을 한꺼번에 뺍니다.",
  "gauss-sum-table-even-b6": "1과 끝 수, 2와 끝에서 둘째 수처럼 짝지으면 합이 모두 같고, 짝은 수 개수의 반입니다.",
  "gauss-sum-table-odd-b6": "수가 홀수 개이면 가운데 수에 수의 개수를 곱합니다.",
  "round-pair-long-missing-b6": "두 수씩 묶어 둥근 수를 만들고, 마지막 짝에서 빠진 수를 찾습니다.",
  "range-count-table-b6": "수의 개수는 끝 수 − 처음 수 + 1, 숫자의 개수는 수의 개수 × 자릿수입니다.",
  "digit-contain-count-b6": "일의 자리와 십의 자리를 나누어 세고, 두 번 센 수는 한 번만 셉니다.",
  "digit-exclude-count-b6": "숫자가 들어 있는 수를 빠짐없이 세어 전체 수의 개수에서 뺍니다."
};

export const BOOK06_STRUCTURE_REMAPS = [
  // 1단원
  ["book-06", 1, "check", 1, [1, 2], "rod-difference-from-counts-b6"],
  ["book-06", 1, "practice", 1, [6, 7], "rod-difference-from-counts-b6"],
  ["book-06", 1, "advanced", 1, [1], "rod-difference-from-counts-b6"],
  ["book-06", 1, "activity", 2, [3, 4], "equal-length-bars-reverse-ratio-b6"],
  ["book-06", 1, "check", 2, [3, 4, 5, 6], "symbol-card-set-sum-b6"],
  ["book-06", 1, "practice", 1, [14, 15], "symbol-card-set-sum-b6"],
  ["book-06", 1, "practice", 1, [16], "equal-bars-whole-length-b6"],
  ["book-06", 1, "advanced", 1, [3], "equal-bars-whole-length-b6"],
  ["book-06", 1, "advanced", 1, [2], "balance-four-shape-chain-b6"],
  // 2단원
  ["book-06", 2, "activity", 1, [3], "rhombus-rect-shared-side-b6"],
  ["book-06", 2, "practice", 1, [5], "rhombus-rect-shared-side-b6"],
  ["book-06", 2, "practice", 1, [6], "parallelogram-rhombus-shared-side-b6"],
  ["book-06", 2, "practice", 1, [7], "shape-chain-find-parallelogram-b6"],
  ["book-06", 2, "advanced", 1, [1], "shape-chain-total-perimeter-b6"],
  ["book-06", 2, "check", 1, [1], "squared-rectangle-b6"],
  ["book-06", 2, "practice", 1, [9], "squared-rectangle-b6"],
  ["book-06", 2, "advanced", 1, [4, 5], "squared-rectangle-b6"],
  ["book-06", 2, "check", 1, [3, 4], "fold-rectangle-to-square-b6"],
  ["book-06", 2, "practice", 1, [11, 12], "fold-rectangle-to-square-b6"],
  ["book-06", 2, "advanced", 1, [2], "successive-square-cuts-b6"],
  // 3단원
  ["book-06", 3, "activity", 1, [1], "napier-one-digit-b6"],
  ["book-06", 3, "practice", 1, [1], "napier-one-digit-b6"],
  ["book-06", 3, "activity", 1, [2], "area-model-one-digit-b6"],
  ["book-06", 3, "practice", 1, [2], "area-model-one-digit-b6"],
  ["book-06", 3, "activity", 1, [4], "round-pair-long-missing-b6"],
  ["book-06", 3, "practice", 1, [4], "round-pair-long-missing-b6"],
  ["book-06", 3, "activity", 1, [5], "common-factor-round-sum-b6"],
  ["book-06", 3, "check", 1, [1, 2], "common-factor-round-sum-b6"],
  ["book-06", 3, "practice", 1, [5, 6], "common-factor-round-sum-b6"],
  ["book-06", 3, "check", 1, [3], "near-ten-times-b6"],
  ["book-06", 3, "check", 1, [4], "near-nines-mixed-sum-b6"],
  ["book-06", 3, "activity", 2, [1], "gauss-sum-table-even-b6"],
  ["book-06", 3, "practice", 1, [10], "gauss-sum-table-even-b6"],
  ["book-06", 3, "activity", 2, [3], "gauss-sum-table-odd-b6"],
  ["book-06", 3, "practice", 1, [12], "gauss-sum-table-odd-b6"],
  // 4단원
  ["book-06", 4, "activity", 1, [1, 2], "range-count-table-b6"],
  ["book-06", 4, "practice", 1, [1, 2], "range-count-table-b6"],
  ["book-06", 4, "check", 1, [1], "digit-contain-count-b6"],
  ["book-06", 4, "practice", 1, [5], "digit-contain-count-b6"],
  ["book-06", 4, "check", 1, [2], "digit-exclude-count-b6"],
  ["book-06", 4, "practice", 1, [6], "digit-exclude-count-b6"]
];

// ── 검산(book06-audit.mjs가 부른다) — 오류가 없으면 "" ─────

const num = (v) => Number(String(v).replaceAll(",", "").match(/-?\d+/)?.[0]);
const ok = (cond, message) => (cond ? "" : message);

export const BOOK06_STRUCTURE_CHECKS = {
  "rod-difference-from-counts-b6": ({ meta, answer }) => ok(meta.L % meta.a === 0 && meta.L % meta.b === 0 && meta.first - meta.second === meta.diff && meta.L % meta.diff === 0 && meta.L / meta.diff === meta.answer && num(answer) === meta.answer, "막대 차 횟수 오류"),
  "equal-length-bars-reverse-ratio-b6": ({ meta }) => ok(meta.items.every((it) => it.ratio[0] * it.m === it.ratio[1] * it.n && gcd(it.ratio[0], it.ratio[1]) === 1) && new Set(meta.items.map((it) => `${it.m}:${it.n}`)).size === meta.items.length, "거꾸로 비 오류"),
  "equal-bars-whole-length-b6": ({ meta, answer }) => ok(meta.a * meta.first === meta.b * meta.second && meta.first + meta.second === meta.total && meta.whole === meta.a * meta.first && num(answer) === meta.whole, "전체 길이 오류"),
  "symbol-card-set-sum-b6": ({ meta, answer }) => ok(symbolBrute(meta.k, meta.cards, meta.equations, 2).length === 1 && meta.equations.every((eq) => eqHolds(eq, meta.values)) && meta.values[meta.target] === meta.answer && num(answer) === meta.answer, "도형식 답이 하나가 아님"),
  "balance-four-shape-chain-b6": ({ meta }) => {
    const w = meta.weights;
    const holds = meta.balances.every((b) => sideSum(b.L, w) === sideSum(b.R, w));
    return ok(holds && gcdAll(meta.ratio) === 1 && meta.ratio.every((r, i) => r * (w[0] / meta.ratio[0]) === w[i]) && w[3] === meta.many * w[1], "저울 사슬 오류");
  },
  "squared-rectangle-b6": ({ meta, answer }) => {
    const cells = new Set();
    let area = 0;
    for (const q of meta.squares) {
      area += q.s * q.s;
      for (let x = q.x; x < q.x + q.s; x += 1) for (let y = q.y; y < q.y + q.s; y += 1) {
        if (x < 0 || y < 0 || x >= meta.W || y >= meta.H || cells.has(`${x}:${y}`)) return "정사각형 겹침·넘침";
        cells.add(`${x}:${y}`);
      }
    }
    const t = meta.squares[meta.shaded];
    const want = meta.mode === "unit" ? t.s : meta.askPerimeter ? t.s * meta.scale * 4 : t.s * meta.scale;
    return ok(area === meta.W * meta.H && Math.min(...meta.squares.map((q) => q.s)) === 1 && want === meta.answer && num(answer) === meta.answer, "정사각형 채우기 오류");
  },
  "fold-rectangle-to-square-b6": ({ meta, answer }) => ok(meta.W === meta.H + meta.d && meta.original === 2 * (meta.W + meta.H) && meta.square === 4 * meta.H && num(answer) === meta.answer && meta.answer === (meta.mode === "reverse" ? meta.square : meta.original), "접어 자른 둘레 오류"),
  "successive-square-cuts-b6": ({ meta, answer }) => {
    const p = meta.points.reduce((t, [a, b], i) => { const [c, e] = meta.points[(i + 1) % meta.points.length]; return t + Math.abs(c - a) + Math.abs(e - b); }, 0);
    const decreasing = meta.sizes.every((s, i) => s < (i ? meta.sizes[i - 1] : meta.H));
    return ok(p === meta.answer && p === 2 * meta.W && decreasing && meta.W > meta.H + sum(meta.sizes) && num(answer) === meta.answer, "계단 둘레 오류");
  },
  "rhombus-rect-shared-side-b6": ({ meta }) => ok(meta.rhombusPerimeter === 4 * meta.h && meta.rectPerimeter === 2 * (meta.w + meta.h) && meta.w !== meta.h, "마름모·직사각형 오류"),
  "parallelogram-rhombus-shared-side-b6": ({ meta, answer }) => ok(meta.paraPerimeter === 2 * (meta.a + meta.s) && meta.answer === 4 * meta.s && num(answer) === meta.answer, "평행사변형·마름모 오류"),
  "shape-chain-total-perimeter-b6": ({ meta, answer }) => ok(chainPerimeter(meta.list, meta.s, meta.longs) === meta.answer && num(answer) === meta.answer, "붙인 도형 둘레 오류"),
  "shape-chain-find-parallelogram-b6": ({ meta, answer }) => ok(meta.list[meta.paraIdx] === "para" && chainPerimeter(meta.list, meta.s, meta.longs) === meta.total && meta.answer === 2 * (meta.longs[meta.paraIdx] + meta.s) && num(answer) === meta.answer, "평행사변형 둘레 오류"),
  "napier-one-digit-b6": ({ meta, answer }) => ok(meta.first * meta.second === meta.answer && num(answer) === meta.answer && meta.second < 10, "네이피어 곱 오류"),
  "area-model-one-digit-b6": ({ meta, answer }) => ok(sum(meta.parts) === meta.first && sum(meta.partials) === meta.answer && meta.first * meta.second === meta.answer && num(answer) === meta.answer, "넓이 모형 곱 오류"),
  "common-factor-round-sum-b6": ({ meta, answer }) => ok(sum(meta.terms) === meta.base && [10, 100, 1000].includes(meta.base) && sum(meta.terms.map((t) => meta.a * t)) === meta.answer && num(answer) === meta.answer, "묶어 곱하기 오류"),
  "near-ten-times-b6": ({ meta, answer }) => ok((meta.M + 1) % 10 === 0 && meta.a * meta.M === meta.answer && num(answer) === meta.answer, "몇십 빼기 곱 오류"),
  "near-nines-mixed-sum-b6": ({ meta, answer }) => ok(sum(meta.values) === meta.answer && meta.values.every((v, i) => meta.rounds[i] - v >= 1 && meta.rounds[i] - v <= 4) && num(answer) === meta.answer, "가까운 수 합 오류"),
  "gauss-sum-table-even-b6": ({ meta }) => ok(meta.ns.every((n, i) => n % 2 === 0 && (n * (n + 1)) / 2 === meta.answer[i]) && new Set(meta.ns).size === meta.ns.length, "1부터 n까지 합 오류"),
  "gauss-sum-table-odd-b6": ({ meta }) => ok(meta.ns.every((n, i) => n % 2 === 1 && (n * (n + 1)) / 2 === meta.answer[i]) && new Set(meta.ns).size === meta.ns.length, "1부터 n까지 합 오류"),
  "round-pair-long-missing-b6": ({ meta, answer }) => ok(meta.pairs.every((p) => p[0] + p[1] === meta.base) && meta.total === meta.base * meta.pairs.length && meta.answer === (meta.missing ? meta.pairs.at(-1)[1] : meta.total) && num(answer) === meta.answer, "짝 덧셈 오류"),
  "range-count-table-b6": ({ meta }) => ok(meta.rows.every((r) => r.numbers === r.b - r.a + 1 && r.digits === digitCount(r.a, r.b) && String(r.a).length === String(r.b).length), "범위 수·숫자 개수 오류"),
  "digit-contain-count-b6": ({ meta, answer }) => {
    let t = 0;
    for (let v = 1; v <= meta.N; v += 1) t += meta.mode === "occ" ? [...String(v)].filter((ch) => ch === String(meta.digits[0])).length : hasAny(v, meta.digits) ? 1 : 0;
    return ok(t === meta.answer && num(answer) === meta.answer, "숫자 세기 오류");
  },
  "digit-exclude-count-b6": ({ meta, answer }) => {
    let t = 0;
    for (let v = 1; v <= meta.N; v += 1) if (!hasAny(v, meta.digits)) t += 1;
    return ok(t === meta.answer && meta.removed + t === meta.N && num(answer) === meta.answer, "숫자 빼기 오류");
  }
};
