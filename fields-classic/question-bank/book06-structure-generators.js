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
//   (2차) 2단원 — 직사각형·평행사변형 둘레 네 가지 · 두 대각선과 삼각형 · 꿀벌 둘레 비교 · 조각 길이로 준 꺾인 도형 · 모눈 위 두 도형
//          · 땅에 닿은 잔디밭 · 홈 두 개 · 변·모서리에서 정사각형 잘라 내기 · 한쪽에서 정사각형 두 개 · 모눈 조각 · 정사각형+정삼각형
//   (2차) 3단원 — 숨은 「× 1」 · 긴 번갈아 식과 짝지어 빼기 · 짝수 개 연속수 · 신문지 한 장으로 마지막 쪽
//   (2차) 4단원 — 부호만 바꾼 식의 값 표 · 줄어드는 수 ±(목표 여러 개) · 정해진 묶음 ± · 같은 숫자에 + 넣기

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
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(Number(String(n).replaceAll(",", ""))) % 10);
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

// ══ (2차) 남은 번호 — 2단원 둘레 · 3단원 연속수 · 4단원 수 만들기 ══════════════

// ── 2단원 공통: 1×1 칸으로 만든 도형 → 둘레 꼭짓점 ─────────────
const cellKey = (x, y) => `${x}:${y}`;
const cellSetOf = (cells) => new Set(cells.map(([x, y]) => cellKey(x, y)));

function cellsConnected(cells) {
  if (!cells.length) return false;
  const set = cellSetOf(cells);
  const seen = new Set([cellKey(...cells[0])]);
  const stack = [cells[0]];
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const k = cellKey(x + dx, y + dy);
      if (set.has(k) && !seen.has(k)) { seen.add(k); stack.push([x + dx, y + dy]); }
    }
  }
  return seen.size === cells.length;
}

// 구멍(둘러싸인 빈 칸)과 꼭짓점만 닿은 칸(두 칸이 대각선으로만 이어짐)이 없어야 둘레가 한 줄로 이어진다
function cellsSimple(cells) {
  const set = cellSetOf(cells);
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const [x0, x1, y0, y1] = [Math.min(...xs) - 1, Math.max(...xs) + 1, Math.min(...ys) - 1, Math.max(...ys) + 1];
  const seen = new Set([cellKey(x0, y0)]);
  const stack = [[x0, y0]];
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
      const k = cellKey(nx, ny);
      if (set.has(k) || seen.has(k)) continue;
      seen.add(k);
      stack.push([nx, ny]);
    }
  }
  if (seen.size + set.size !== (x1 - x0 + 1) * (y1 - y0 + 1)) return false;
  for (let x = x0; x < x1; x += 1) for (let y = y0; y < y1; y += 1) {
    const a = set.has(cellKey(x, y));
    const b = set.has(cellKey(x + 1, y));
    const c = set.has(cellKey(x, y + 1));
    const d = set.has(cellKey(x + 1, y + 1));
    if ((a && d && !b && !c) || (b && c && !a && !d)) return false;
  }
  return true;
}

// 바깥 둘레 꼭짓점(화면 좌표에서 시계 방향, 한 줄로 이어진 변은 합침)
function cellsOutline(cells) {
  const set = cellSetOf(cells);
  const next = new Map();
  for (const [x, y] of cells) {
    if (!set.has(cellKey(x, y - 1))) next.set(cellKey(x, y), [x + 1, y]);
    if (!set.has(cellKey(x + 1, y))) next.set(cellKey(x + 1, y), [x + 1, y + 1]);
    if (!set.has(cellKey(x, y + 1))) next.set(cellKey(x + 1, y + 1), [x, y + 1]);
    if (!set.has(cellKey(x - 1, y))) next.set(cellKey(x, y + 1), [x, y]);
  }
  const start = [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
  const pts = [[start[0], start[1]]];
  let cur = next.get(cellKey(start[0], start[1]));
  let guard = 0;
  while (cur && (cur[0] !== start[0] || cur[1] !== start[1]) && guard < 4000) {
    pts.push(cur);
    cur = next.get(cellKey(cur[0], cur[1]));
    guard += 1;
  }
  return pts.filter((p, i) => {
    const a = pts[(i - 1 + pts.length) % pts.length];
    const b = pts[(i + 1) % pts.length];
    return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
  });
}

const outlineLength = (pts) => pts.reduce((t, [x, y], i) => { const [u, v] = pts[(i + 1) % pts.length]; return t + Math.abs(u - x) + Math.abs(v - y); }, 0);
// 변 목록: a·b 끝점, 길이, 바깥쪽 방향(시계 방향이면 (dy, −dx))
const outlineEdges = (pts) => pts.map((a, i) => {
  const b = pts[(i + 1) % pts.length];
  const L = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]);
  return { a, b, len: L, n: [Math.sign(b[1] - a[1]), -Math.sign(b[0] - a[0])] };
});
const cellEdgeCount = (cells) => {
  const set = cellSetOf(cells);
  let t = 0;
  for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!set.has(cellKey(x + dx, y + dy))) t += 1;
  return t;
};
const rectCells = (W, H) => { const out = []; for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) out.push([x, y]); return out; };
const bboxOf = (cells) => ({ minX: Math.min(...cells.map(([x]) => x)), maxX: Math.max(...cells.map(([x]) => x)) + 1, minY: Math.min(...cells.map(([, y]) => y)), maxY: Math.max(...cells.map(([, y]) => y)) + 1 });

function rowsColsContiguous(cells) {
  const rows = new Map();
  const cols = new Map();
  for (const [x, y] of cells) {
    if (!rows.has(y)) rows.set(y, []);
    if (!cols.has(x)) cols.set(x, []);
    rows.get(y).push(x);
    cols.get(x).push(y);
  }
  const contiguous = (list) => Math.max(...list) - Math.min(...list) + 1 === list.length;
  return [...rows.values()].every(contiguous) && [...cols.values()].every(contiguous);
}

// 직사각형 W×H의 모서리를 계단(한 칸 이상)으로 잘라 낸 도형 — 줄과 칸이 끊기지 않으면 둘레는 2 × (W + H)
function splitInto(total, parts, min) {
  if (total < parts * min) return null;
  const cuts = shuffle(Array.from({ length: total - parts * min + parts - 1 }, (_, i) => i)).slice(0, parts - 1).sort((a, b) => a - b);
  const out = [];
  let prev = -1;
  for (const c of [...cuts, total - parts * min + parts - 1]) { out.push(c - prev - 1 + min); prev = c; }
  return out;
}

function staircaseCut(W, H, corner, steps, minPart, maxShareW = 0.6, maxShareH = 0.6) {
  const A = randomInt(steps * minPart, Math.max(steps * minPart, Math.floor(W * maxShareW)));
  const B = randomInt(steps * minPart, Math.max(steps * minPart, Math.floor(H * maxShareH)));
  const wa = splitInto(A, steps, minPart);
  const hb = splitInto(B, steps, minPart);
  if (!wa || !hb) return null;
  const cut = [];
  let row = 0;
  let width = A;
  for (let k = 0; k < steps; k += 1) {
    for (let y = row; y < row + hb[k]; y += 1) for (let x = 0; x < width; x += 1) cut.push([x, y]);
    row += hb[k];
    width -= wa[k];
  }
  const flipX = corner === "tr" || corner === "br";
  const flipY = corner === "bl" || corner === "br";
  return cut.map(([x, y]) => [flipX ? W - 1 - x : x, flipY ? H - 1 - y : y]);
}

function orthoConvexCells(W, H, { corners = 2, maxSteps = 2, minPart = 1, share = 0.6 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const chosen = shuffle(["tl", "tr", "bl", "br"]).slice(0, corners);
    const cut = new Set();
    let bad = false;
    for (const c of chosen) {
      const part = staircaseCut(W, H, c, randomInt(1, maxSteps), minPart, share, share);
      if (!part) { bad = true; break; }
      part.forEach(([x, y]) => cut.add(cellKey(x, y)));
    }
    if (bad) continue;
    const cells = rectCells(W, H).filter(([x, y]) => !cut.has(cellKey(x, y)));
    const box = bboxOf(cells);
    if (box.minX !== 0 || box.minY !== 0 || box.maxX !== W || box.maxY !== H) continue;
    if (!cellsConnected(cells) || !rowsColsContiguous(cells) || !cellsSimple(cells)) continue;
    // 자른 계단의 마디가 minPart보다 짧게 남지 않게(글자가 들어갈 자리)
    if (outlineEdges(cellsOutline(cells)).some((e) => e.len < minPart)) continue;
    return cells;
  }
  return null;
}

// 칸 도형 그리기 — T: 칸 좌표 → 화면 좌표
const scaler = (pad, px, ox = 0, oy = 0) => ([x, y]) => [ox + pad + x * px, oy + pad + y * px];
const outlinePoly = (pts, T, fill = FILL, stroke = LINE, extra = "") => poly(pts.map(T), fill, stroke, extra);
// 변 하나에 길이 표시(호는 바깥쪽 n 방향으로)
function edgeLabel(edge, T, label, { off = 11, size = 13 } = {}) {
  const a = T(edge.a);
  const b = T(edge.b);
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return len(a, b, [m[0] - edge.n[0] * 10, m[1] - edge.n[1] * 10], label, { off, size });
}
const shapeName = (x, y, value, size = 15) => text(x, y, value, size, 'font-weight="700"');
function innerPoint(cells, T, px) {
  const cx = sum(cells.map(([x]) => x + 0.5)) / cells.length;
  const cy = sum(cells.map(([, y]) => y + 0.5)) / cells.length;
  const best = [...cells].sort((p, q) => Math.hypot(p[0] + 0.5 - cx, p[1] + 0.5 - cy) - Math.hypot(q[0] + 0.5 - cx, q[1] + 0.5 - cy))[0];
  const [x, y] = T(best);
  return [x + px / 2, y + px / 2];
}
const partWrap = (parts) => `<div style="display:flex;flex-wrap:wrap;gap:12px 22px;align-items:flex-end">${parts.map((p, i) => `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:2px"><b style="font-size:15px;${FONT}">${PARTS[i]}</b>${p}</div>`).join("")}</div>`;
const caption = (value) => `<div style="${FONT};font-size:15px;color:${INK};padding-left:6px">${value}</div>`;

// ── 2단원: 직사각형·평행사변형의 둘레 네 가지(둘레 · 모르는 변) ───────

function quadPart(kind, a, b, ask) {
  // a = 가로(밑변), b = 세로(비스듬한 변)
  const px = Math.min(130 / (a + (kind === "para" ? b * 0.5 : 0)), 90 / (kind === "para" ? b * 0.87 : b), 14);
  const x0 = 66;
  const y0 = 26;
  const perimeter = 2 * (a + b);
  let pts;
  if (kind === "rect") pts = [[x0, y0], [x0 + a * px, y0], [x0 + a * px, y0 + b * px], [x0, y0 + b * px]];
  else {
    const dx = b * px * 0.5;
    const dy = b * px * 0.866;
    pts = [[x0 + dx, y0], [x0 + dx + a * px, y0], [x0 + a * px, y0 + dy], [x0, y0 + dy]];
  }
  const c = [sum(pts.map((p) => p[0])) / 4, sum(pts.map((p) => p[1])) / 4];
  let body = poly(pts, FILL, LINE);
  body += len(pts[0], pts[1], c, ask === "a" ? "?" : `${a}cm`, { off: 11, size: 13 });
  body += len(pts[3], pts[0], c, ask === "b" ? "?" : `${b}cm`, { off: 11, size: 13 });
  const W = Math.max(...pts.map((p) => p[0])) + 16;
  const H = Math.max(...pts.map((p) => p[1])) + 10;
  const svg = `${svgOpen(W, H, kind === "rect" ? "직사각형" : "평행사변형")}${body}</svg>`;
  const name = kind === "rect" ? "직사각형" : "평행사변형";
  const answer = ask === "perimeter" ? perimeter : ask === "a" ? a : b;
  const known = ask === "a" ? b : a;
  const solution = ask === "perimeter"
    ? `${name}은 마주 보는 두 변의 길이가 같으므로 둘레는 (${a} + ${b}) × 2 = ${perimeter}cm입니다.`
    : `두 변의 합은 ${perimeter} ÷ 2 = ${a + b}cm이므로 모르는 변은 ${a + b} − ${known} = ${answer}cm입니다.`;
  return { html: `${svg}${caption(`둘레 : ${ask === "perimeter" ? "?" : `${perimeter}cm`}`)}`, answer, solution, kind, a, b, ask, perimeter };
}

function quadSides(difficulty, kind) {
  const top = difficulty === 1 ? 10 : difficulty === 2 ? 15 : 24;
  let a;
  let b;
  do { a = randomInt(3, top); b = randomInt(2, top); } while (a === b || (kind === "para" && b > a + 3));
  return [a, b];
}

function rectParallelogramPerimeterFourB6({ difficulty = 2 }) {
  const plan = [["rect", "perimeter"], ["rect", pick(["a", "b"])], ["para", "perimeter"], ["para", pick(["a", "b"])]];
  const parts = plan.map(([kind, ask]) => quadPart(kind, ...quadSides(difficulty, kind), ask));
  return {
    prompt: "직사각형과 평행사변형은 마주 보는 두 변의 길이가 같습니다. 각 도형의 둘레나 ?에 알맞은 길이를 구하세요.",
    visual: { kind: "fig", html: partWrap(parts.map((p) => p.html)) },
    answer: parts.map((p, i) => `${PARTS[i]} ${p.answer}cm`).join(" "),
    solution: parts.map((p, i) => `${PARTS[i]} ${p.solution}`).join(" "),
    meta: { family: "quad-perimeter-parts-b6", parts: parts.map(({ kind, a, b, ask, perimeter, answer }) => ({ kind, a, b, ask, perimeter, answer })), answer: parts.map((p) => p.answer) }
  };
}

function parallelogramPerimeterPairB6({ difficulty = 2 }) {
  const parts = [quadPart("para", ...quadSides(difficulty, "para"), "perimeter"), quadPart("para", ...quadSides(difficulty, "para"), pick(["a", "b"]))];
  return {
    prompt: "평행사변형은 마주 보는 두 변의 길이가 같습니다. 평행사변형의 둘레나 ?에 알맞은 길이를 구하세요.",
    visual: { kind: "fig", html: partWrap(parts.map((p) => p.html)) },
    answer: parts.map((p, i) => `${PARTS[i]} ${p.answer}cm`).join(" "),
    solution: parts.map((p, i) => `${PARTS[i]} ${p.solution}`).join(" "),
    meta: { family: "quad-perimeter-parts-b6", parts: parts.map(({ kind, a, b, ask, perimeter, answer }) => ({ kind, a, b, ask, perimeter, answer })), answer: parts.map((p) => p.answer) }
  };
}

// ── 2단원: 대각선 두 개를 그은 직사각형 — 색칠한 두 삼각형의 둘레 ─────

const DIAGONAL_TRIPLES = [[6, 8, 10], [12, 16, 20], [18, 24, 30], [10, 24, 26], [16, 30, 34], [24, 32, 40], [9, 12, 15].map((v) => v * 2)];

function rectangleDiagonalTrianglesB6({ difficulty = 2 }) {
  const pool = difficulty === 1 ? DIAGONAL_TRIPLES.slice(0, 3) : DIAGONAL_TRIPLES;
  const [p, q, D] = pick(pool);
  const [W, H] = Math.random() < 0.6 ? [q, p] : [p, q];
  const usePerimeter = difficulty === 3 && Math.random() < 0.6;
  const horizontal = pick(["top", "bottom"]);
  const vertical = pick(["left", "right"]);
  const s = Math.min(230 / W, 150 / H);
  const x0 = 46;
  const y0 = 34;
  const A = [x0, y0];
  const B = [x0 + W * s, y0];
  const C = [x0 + W * s, y0 + H * s];
  const Dp = [x0, y0 + H * s];
  const O = [x0 + (W * s) / 2, y0 + (H * s) / 2];
  const tri = { top: [A, B, O], right: [B, C, O], bottom: [C, Dp, O], left: [Dp, A, O] };
  const cen = (t) => [sum(t.map((v) => v[0])) / 3, sum(t.map((v) => v[1])) / 3];
  let body = rect(A[0], A[1], W * s, H * s, "#fff", LINE);
  body += poly(tri[horizontal], "#9fcfba", LINE);
  body += poly(tri[vertical], "#d4ebe0", LINE);
  body += `<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(C[0])}" y2="${f1(C[1])}" style="stroke:${LINE};stroke-width:1.5"/>`;
  body += `<line x1="${f1(B[0])}" y1="${f1(B[1])}" x2="${f1(Dp[0])}" y2="${f1(Dp[1])}" style="stroke:${LINE};stroke-width:1.5"/>`;
  const [hx, hy] = cen(tri[horizontal]);
  const [vx, vy] = cen(tri[vertical]);
  body += text(hx, hy + (horizontal === "top" ? -4 : 4), NAMES[0], 15) + text(vx + (vertical === "left" ? -4 : 4), vy, NAMES[1], 15);
  // 가로는 색칠하지 않은 쪽 변, 세로는 왼쪽(또는 오른쪽) 변에 — 바깥 곡선 점선
  const wEdge = horizontal === "top" ? [Dp, C] : [A, B];
  const hEdge = vertical === "left" ? [B, C] : [A, Dp];
  body += len(wEdge[0], wEdge[1], O, `${W}cm`, { off: 12, size: 14 });
  if (!usePerimeter) body += len(hEdge[0], hEdge[1], O, `${H}cm`, { off: 12, size: 14 });
  const html = `${svgOpen(x0 + W * s + 48, y0 + H * s + 34, "대각선 두 개를 그은 직사각형")}${body}</svg>`;
  const first = W + D;
  const second = H + D;
  const rectPerimeter = 2 * (W + H);
  return {
    prompt: `직사각형에 두 대각선을 그었습니다. 두 대각선의 길이는 ${D}cm로 같습니다.${usePerimeter ? ` 직사각형의 둘레가 ${rectPerimeter}cm일 때,` : ""} 색칠한 삼각형 ${NAMES[0]}와 ${NAMES[1]}의 둘레를 각각 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${NAMES[0]} ${first}cm, ${NAMES[1]} ${second}cm`,
    solution: `${usePerimeter ? `세로는 ${rectPerimeter} ÷ 2 − ${W} = ${H}cm입니다. ` : ""}직사각형의 두 대각선은 길이가 같고 서로를 반으로 나누므로, 삼각형의 비스듬한 두 변은 모두 ${D} ÷ 2 = ${D / 2}cm입니다. ${NAMES[0]}의 둘레는 ${W} + ${D / 2} + ${D / 2} = ${first}cm, ${NAMES[1]}의 둘레는 ${H} + ${D / 2} + ${D / 2} = ${second}cm입니다.`,
    meta: { family: "rectangle-diagonal-triangles-b6", W, H, D, usePerimeter, rectPerimeter, answer: [first, second] }
  };
}

// ── 2단원: 직각으로 꺾인 두 도형 둘레를 도는 꿀벌 — 누가 먼저 ─────

function boxedShapeSvg(cells, W, H, { name, px, labelW = `${W}cm`, labelH = `${H}cm`, pad = 50 }) {
  const T = scaler(pad, px);
  const pts = cellsOutline(cells);
  let body = dashedRect(pad, pad, W * px, H * px);
  body += outlinePoly(pts, T);
  const c = [pad + (W * px) / 2, pad + (H * px) / 2];
  body += len([pad, pad + H * px], [pad + W * px, pad + H * px], c, labelW, { off: 12, size: 13 });
  body += len([pad + W * px, pad], [pad + W * px, pad + H * px], c, labelH, { off: 12, size: 13 });
  if (name) { const [x, y] = innerPoint(cells, T, px); body += shapeName(x, y, name); }
  return `${svgOpen(W * px + pad * 2 + 10, H * px + pad * 2 + 4, `직각으로 꺾인 도형 ${name || ""}`)}${body}</svg>`;
}

function beeRoutePerimeterCompareB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const top = difficulty === 1 ? 9 : difficulty === 2 ? 13 : 17;
    const W1 = randomInt(5, top);
    const H1 = randomInt(4, top - 1);
    const W2 = randomInt(5, top);
    const H2 = randomInt(4, top - 1);
    const p1 = 2 * (W1 + H1);
    const p2 = 2 * (W2 + H2);
    if (p1 === p2 || Math.abs(p1 - p2) > (difficulty === 3 ? 6 : 10)) continue;
    // 넓이로 고르면 틀리게(둘레가 긴 쪽이 넓이는 좁게) 만들 때가 많도록
    const a = orthoConvexCells(W1, H1, { corners: randomInt(1, 2), maxSteps: 1, minPart: 2, share: 0.55 });
    const b = orthoConvexCells(W2, H2, { corners: randomInt(1, difficulty === 1 ? 1 : 2), maxSteps: 3, minPart: 1, share: 0.75 });
    if (!a || !b) continue;
    const px = Math.min(150 / Math.max(W1, W2), 130 / Math.max(H1, H2), 18);
    const html = `<div style="display:flex;flex-wrap:wrap;gap:10px 26px;align-items:flex-end">${boxedShapeSvg(a, W1, H1, { name: "가", px })}${boxedShapeSvg(b, W2, H2, { name: "나", px })}</div>`;
    const first = p1 < p2 ? "꿀벌 ①" : "꿀벌 ②";
    const firstJ = p1 < p2 ? "꿀벌 ①이" : "꿀벌 ②가";
    return {
      prompt: "꿀벌 ①은 도형 가의 둘레를, 꿀벌 ②는 도형 나의 둘레를 따라 한 바퀴 돕니다. 두 꿀벌이 같은 빠르기로 동시에 출발하면, 출발한 자리로 먼저 돌아오는 꿀벌은 어느 것인가요? (점선은 도형을 둘러싼 직사각형입니다.)",
      visual: { kind: "fig", html },
      answer: `${first} (가 ${p1}cm, 나 ${p2}cm)`,
      solution: `직각으로 꺾인 부분을 바깥으로 밀어 펼치면 둘러싼 직사각형이 됩니다. 가의 둘레는 (${W1} + ${H1}) × 2 = ${p1}cm, 나의 둘레는 (${W2} + ${H2}) × 2 = ${p2}cm이므로 둘레가 짧은 ${firstJ} 먼저 돌아옵니다.`,
      meta: { family: "bee-route-compare-b6", shapes: [{ cells: a, W: W1, H: H1 }, { cells: b, W: W2, H: H2 }], perimeters: [p1, p2], first, answer: [p1, p2] }
    };
  }
  return null;
}

// ── 2단원: 직각으로 꺾인 도형 두 개 — 조각 길이 · 둘러싼 직사각형 ─────

function piecesShapeSvg(cells, W, H, mode, px) {
  const pad = 50;
  const T = scaler(pad, px);
  const pts = cellsOutline(cells);
  const edges = outlineEdges(pts);
  let body = "";
  let given;
  if (mode === "box") {
    body += dashedRect(pad, pad, W * px, H * px) + outlinePoly(pts, T);
    const c = [pad + (W * px) / 2, pad + (H * px) / 2];
    body += len([pad, pad + H * px], [pad + W * px, pad + H * px], c, `${W}cm`, { off: 12, size: 13 });
    body += len([pad, pad], [pad, pad + H * px], c, `${H}cm`, { off: 12, size: 13 });
    given = { width: [W], height: [H] };
  } else {
    body += outlinePoly(pts, T);
    const side = (nx, ny) => edges.filter((e) => e.n[0] === nx && e.n[1] === ny);
    // 세로 조각(왼쪽 또는 오른쪽)과 가로 조각(위 또는 아래) — 두 표시가 한 꼭짓점에서 만나 글자가 겹치지 않는 짝 중 조각이 많은 것
    const keyOf = (pt) => pt.join(":");
    const combos = [];
    for (const v of [side(-1, 0), side(1, 0)]) for (const h of [side(0, 1), side(0, -1)]) {
      if (v.length > 3 || h.length > 3) continue;
      // 안으로 꺾인 꼭짓점(둘레 칸 넷 중 셋이 찬 곳)에서 만나면 두 호가 같은 빈 곳으로 휘어 글자가 겹친다
      const filled = new Set(cells.map(([x, y]) => keyOf([x, y])));
      const reflex = (pt) => [[-1, -1], [0, -1], [-1, 0], [0, 0]].filter(([dx, dy]) => filled.has(keyOf([pt[0] + dx, pt[1] + dy]))).length === 3;
      const ends = new Set(v.flatMap((e) => [e.a, e.b]).filter(reflex).map(keyOf));
      if (h.some((e) => ends.has(keyOf(e.a)) || ends.has(keyOf(e.b)))) continue;
      combos.push([v, h]);
    }
    combos.sort((p, q) => q[0].length + q[1].length - p[0].length - p[1].length);
    if (!combos.length) return { svg: "", given: null };
    const [vSide, hSide] = combos[0];
    [...vSide, ...hSide].forEach((e) => { body += edgeLabel(e, T, `${e.len}cm`); });
    given = { width: hSide.map((e) => e.len), height: vSide.map((e) => e.len) };
  }
  return { svg: `${svgOpen(W * px + pad * 2 + 8, H * px + pad * 2 + 4, "직각으로 꺾인 도형")}${body}</svg>`, given };
}

function orthoConvexPiecesPerimeterB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const shapes = [];
    for (let k = 0; k < 2; k += 1) {
      const W = randomInt(8, difficulty === 3 ? 15 : 12);
      const H = randomInt(7, difficulty === 3 ? 12 : 10);
      const cells = orthoConvexCells(W, H, { corners: randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 4 : 3), maxSteps: 2, minPart: 3, share: 0.55 });
      if (!cells) break;
      shapes.push({ cells, W, H, mode: k === 1 && Math.random() < 0.5 ? "box" : "pieces" });
    }
    if (shapes.length < 2) continue;
    const px = Math.min(200 / Math.max(...shapes.map((s) => s.W)), 150 / Math.max(...shapes.map((s) => s.H)), 24);
    const drawn = shapes.map((s) => ({ ...s, ...piecesShapeSvg(s.cells, s.W, s.H, s.mode, px) }));
    // 조각으로 주는 도형은 적어도 한쪽 길이를 두 조각 이상으로(글자가 겹치지 않게 놓을 수 없으면 다시)
    if (drawn.some((s) => !s.svg)) continue;
    if (drawn.some((s) => s.mode === "pieces" && s.given.width.length + s.given.height.length < 3)) continue;
    const answers = drawn.map((s) => 2 * (s.W + s.H));
    return {
      prompt: "직각으로 꺾인 도형의 둘레를 각각 구하세요.",
      visual: { kind: "fig", html: partWrap(drawn.map((s) => s.svg)) },
      answer: answers.map((v, i) => `${PARTS[i]} ${v}cm`).join(" "),
      solution: drawn.map((s, i) => `${PARTS[i]} 꺾인 부분을 바깥으로 밀어 펼치면 가로 ${s.given.width.length > 1 ? `${s.given.width.join(" + ")} = ` : ""}${s.W}cm, 세로 ${s.given.height.length > 1 ? `${s.given.height.join(" + ")} = ` : ""}${s.H}cm인 직사각형이 되므로 둘레는 (${s.W} + ${s.H}) × 2 = ${answers[i]}cm입니다.`).join(" "),
      meta: { family: "ortho-convex-pieces-b6", shapes: drawn.map(({ cells, W, H, mode, given }) => ({ cells, W, H, mode, given })), answer: answers }
    };
  }
  return null;
}

// ── 2단원: 모눈 위 두 도형(볼록한 것 · 움푹 파인 것)의 둘레 ─────────

function concaveGridCells(W, H) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const base = Math.random() < 0.5 ? rectCells(W, H) : orthoConvexCells(W, H, { corners: 1, maxSteps: 1, minPart: 1, share: 0.4 });
    if (!base) continue;
    const fromTop = Math.random() < 0.6;
    const nw = randomInt(1, Math.max(1, W - 3));
    const a = randomInt(1, W - nw - 1);
    const d = randomInt(1, H - 2);
    const cut = new Set();
    for (let x = a; x < a + nw; x += 1) for (let k = 0; k < d; k += 1) cut.add(cellKey(x, fromTop ? k : H - 1 - k));
    const cells = base.filter(([x, y]) => !cut.has(cellKey(x, y)));
    const box = bboxOf(cells);
    if (box.maxX - box.minX !== W || box.maxY - box.minY !== H) continue;
    if (!cellsConnected(cells) || !cellsSimple(cells) || cellEdgeCount(cells) === 2 * (W + H)) continue;
    return cells;
  }
  return null;
}

function gridTwoShapesPerimeterB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const W1 = randomInt(3, difficulty === 1 ? 4 : 6);
    const H1 = randomInt(3, difficulty === 1 ? 4 : 6);
    const W2 = randomInt(4, difficulty === 1 ? 5 : 7);
    const H2 = randomInt(3, difficulty === 1 ? 4 : 6);
    const a = orthoConvexCells(W1, H1, { corners: randomInt(2, 4), maxSteps: 2, minPart: 1, share: 0.5 });
    const b = difficulty === 1 && Math.random() < 0.4 ? orthoConvexCells(W2, H2, { corners: randomInt(1, 3), maxSteps: 2, minPart: 1, share: 0.5 }) : concaveGridCells(W2, H2);
    if (!a || !b) continue;
    const GW = W1 + W2 + 3;
    const GH = Math.max(H1, H2) + 2;
    const px = Math.min(380 / GW, 24);
    const pad = 6;
    const T1 = scaler(pad, px, px, px * (GH - H1 - 1));
    const T2 = scaler(pad, px, px * (W1 + 2), px * (GH - H2 - 1));
    let body = "";
    for (let x = 0; x <= GW; x += 1) body += `<line x1="${f1(pad + x * px)}" y1="${pad}" x2="${f1(pad + x * px)}" y2="${f1(pad + GH * px)}" style="stroke:#9fb8ad;stroke-width:0.8;stroke-dasharray:2 3"/>`;
    for (let y = 0; y <= GH; y += 1) body += `<line x1="${pad}" y1="${f1(pad + y * px)}" x2="${f1(pad + GW * px)}" y2="${f1(pad + y * px)}" style="stroke:#9fb8ad;stroke-width:0.8;stroke-dasharray:2 3"/>`;
    body += outlinePoly(cellsOutline(a), T1) + outlinePoly(cellsOutline(b), T2);
    body += text(pad + px * (1 + W1 / 2), pad + px * (GH - 0.45), "(1)", 13) + text(pad + px * (W1 + 2 + W2 / 2), pad + px * (GH - 0.45), "(2)", 13);
    const html = `${svgOpen(GW * px + pad * 2, GH * px + pad * 2, "모눈 위의 두 도형")}${body}</svg>`;
    const answers = [cellEdgeCount(a), cellEdgeCount(b)];
    const sol = (cells, i) => {
      const box = bboxOf(cells);
      const w = box.maxX - box.minX;
      const h = box.maxY - box.minY;
      const extra = answers[i] - 2 * (w + h);
      return extra
        ? `${PARTS[i]} 바깥으로 펼치면 가로 ${w}칸, 세로 ${h}칸인 직사각형 둘레 ${2 * (w + h)}cm이고, 안으로 움푹 파인 곳의 양쪽 벽 ${extra}cm를 더하면 ${answers[i]}cm입니다.`
        : `${PARTS[i]} 바깥으로 펼치면 가로 ${w}칸, 세로 ${h}칸인 직사각형이므로 둘레는 (${w} + ${h}) × 2 = ${answers[i]}cm입니다.`;
    };
    return {
      prompt: "모눈 한 칸의 길이는 1cm입니다. 두 도형의 둘레를 각각 구하세요.",
      visual: { kind: "fig", html },
      answer: answers.map((v, i) => `${PARTS[i]} ${v}cm`).join(" "),
      solution: [sol(a, 0), sol(b, 1)].join(" "),
      meta: { family: "grid-two-shapes-b6", shapes: [a, b], answer: answers }
    };
  }
  return null;
}

// ── 2단원: 정사각형 땅 안의 직각으로 꺾인 잔디밭 — 둘레 끈의 길이 ─────

function fieldRegionFenceB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const square = difficulty < 3 || Math.random() < 0.5;
    const n = randomInt(5, 7);
    const m = square ? n : randomInt(4, 7);
    const cells = orthoConvexCells(n, m, { corners: randomInt(3, 4), maxSteps: 2, minPart: 1, share: 0.45 });
    if (!cells) continue;
    const S = randomInt(difficulty === 1 ? 6 : 8, difficulty === 1 ? 15 : 30);
    let Hm = S;
    if (!square) { Hm = randomInt(6, 25); if (Hm === S) continue; }
    const px = Math.min(220 / n, 190 / m, 34);
    const pad = 50;
    const T = scaler(pad, px);
    let body = dashedRect(pad, pad, n * px, m * px) + outlinePoly(cellsOutline(cells), T, "#bcdcb3", "#4f8a5b");
    const c = [pad + (n * px) / 2, pad + (m * px) / 2];
    body += len([pad, pad], [pad, pad + m * px], c, `${Hm}m`, { off: 13, size: 14 });
    if (!square) body += len([pad, pad + m * px], [pad + n * px, pad + m * px], c, `${S}m`, { off: 13, size: 14 });
    const html = `${svgOpen(n * px + pad * 2, m * px + pad * 2, "땅과 잔디밭")}${body}</svg>`;
    const answer = 2 * (S + Hm);
    return {
      prompt: square
        ? `한 변이 ${S}m인 정사각형 모양의 땅(점선)에서 색칠한 부분에 잔디를 심었습니다. 잔디밭의 둘레를 따라 끈을 두르려면 끈은 몇 m가 필요한가요?`
        : `가로 ${S}m, 세로 ${Hm}m인 직사각형 모양의 땅(점선)에서 색칠한 부분에 잔디를 심었습니다. 잔디밭의 둘레를 따라 끈을 두르려면 끈은 몇 m가 필요한가요?`,
      visual: { kind: "fig", html },
      answer: `${answer}m`,
      solution: `잔디밭은 땅의 네 변에 모두 닿아 있고 직각으로만 꺾여 있으므로, 꺾인 부분을 바깥으로 밀어 펼치면 땅의 둘레와 같아집니다. 따라서 ${square ? `${S} × 4` : `(${S} + ${Hm}) × 2`} = ${answer}m입니다.`,
      meta: { family: "field-region-fence-b6", n, m, cells, S, H: Hm, answer }
    };
  }
  return null;
}

// ── 2단원: 홈이 두 개(위 · 옆) 파인 도형의 둘레 ─────────────────

function concaveTwoNotchPerimeterB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const W = randomInt(difficulty === 1 ? 10 : 12, difficulty === 3 ? 22 : 18);
    const H = randomInt(difficulty === 1 ? 8 : 10, difficulty === 3 ? 18 : 14);
    const d2 = randomInt(3, Math.floor(W / 2));
    const nh = randomInt(3, 4);
    const c = randomInt(2, H - nh - 2);
    const nw = randomInt(3, 4);
    const a = randomInt(2, W - d2 - nw - 2);
    if (a < 2) continue;
    const d1 = randomInt(2, H - 3);
    const firstSide = Math.random() < 0.5 ? "top" : "bottom";
    const cut = new Set();
    for (let x = a; x < a + nw; x += 1) for (let k = 0; k < d1; k += 1) cut.add(cellKey(x, firstSide === "top" ? k : H - 1 - k));
    for (let x = W - d2; x < W; x += 1) for (let y = c; y < c + nh; y += 1) cut.add(cellKey(x, y));
    // 어려운 단계는 홈이 있는 쪽의 오른쪽 모서리도 한 번 잘라 냄(둘레는 그대로)
    if (difficulty === 3 && Math.random() < 0.6) {
      const cw = randomInt(1, Math.max(1, Math.min(3, W - a - nw - 2)));
      const room = firstSide === "top" ? c - 1 : H - c - nh - 1;
      if (room >= 1) {
        const ch = randomInt(1, Math.min(3, room));
        for (let x = W - cw; x < W; x += 1) for (let k = 0; k < ch; k += 1) cut.add(cellKey(x, firstSide === "top" ? k : H - 1 - k));
      }
    }
    const cells = rectCells(W, H).filter(([x, y]) => !cut.has(cellKey(x, y)));
    if (!cellsConnected(cells) || !cellsSimple(cells)) continue;
    const box = bboxOf(cells);
    if (box.maxX !== W || box.maxY !== H) continue;
    const pts = cellsOutline(cells);
    const edges = outlineEdges(pts);
    // 왼쪽 변 전체(세로 H)와, 홈이 없는 쪽 가로 변 전체(가로 W)가 있어야 함
    const leftFull = edges.find((e) => e.n[0] === -1 && e.len === H);
    const wFull = edges.find((e) => e.n[1] === (firstSide === "top" ? 1 : -1) && e.len === W);
    const notchWall = edges.find((e) => e.n[0] === 1 && e.a[0] === a && e.len === d1);
    const sideWall = edges.find((e) => e.n[1] === (1) && e.a[1] === c && e.len === d2) || edges.find((e) => e.n[1] === 1 && e.b[1] === c && e.len === d2);
    if (!leftFull || !wFull || !notchWall || !sideWall) continue;
    const px = Math.min(270 / W, 190 / H, 18);
    const pad = 50;
    const T = scaler(pad, px);
    let body = outlinePoly(pts, T);
    body += edgeLabel(leftFull, T, `${H}cm`, { off: 12, size: 14 });
    body += edgeLabel(wFull, T, `${W}cm`, { off: 12, size: 14 });
    body += edgeLabel(notchWall, T, `${d1}cm`, { off: 9, size: 13 });
    body += edgeLabel(sideWall, T, `${d2}cm`, { off: 9, size: 13 });
    const html = `${svgOpen(W * px + pad * 2, H * px + pad * 2, "직각으로 꺾여 움푹 파인 도형")}${body}</svg>`;
    const answer = 2 * (W + H) + 2 * (d1 + d2);
    return {
      prompt: "직각으로 꺾여 움푹 파인 도형의 둘레를 구하세요.",
      visual: { kind: "fig", html },
      answer: `${answer}cm`,
      solution: `바깥쪽 꺾인 부분을 펼치면 가로 ${W}cm, 세로 ${H}cm인 직사각형이 되어 둘레는 (${W} + ${H}) × 2 = ${2 * (W + H)}cm입니다. 안으로 파인 두 홈은 양쪽 벽이 더 늘어나므로 ${d1} × 2 + ${d2} × 2 = ${2 * (d1 + d2)}cm를 더하면 ${answer}cm입니다.`,
      meta: { family: "concave-two-notch-b6", W, H, d1, d2, cells, answer }
    };
  }
  return null;
}

// ── 2단원: 정사각형 종이에서 작은 정사각형 몇 개를 잘라 낸 둘레 ─────

function placeCutSquares(S, sizes) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const corners = shuffle(["tl", "tr", "bl", "br"]);
    const placed = [];
    let ok = true;
    for (const s of sizes) {
      const where = Math.random() < 0.5 && corners.length ? "corner" : "edge";
      let x;
      let y;
      if (where === "corner") {
        const c = corners.pop();
        x = c[1] === "l" ? 0 : S - s;
        y = c[0] === "t" ? 0 : S - s;
      } else {
        const side = pick(["top", "bottom", "left", "right"]);
        const along = randomInt(2, S - s - 2);
        if (along < 2) { ok = false; break; }
        if (side === "top") { x = along; y = 0; } else if (side === "bottom") { x = along; y = S - s; } else if (side === "left") { x = 0; y = along; } else { x = S - s; y = along; }
      }
      // 다른 자른 칸과 한 칸 이상 떨어지게
      if (placed.some((p) => x < p.x + p.s + 1 && p.x < x + s + 1 && y < p.y + p.s + 1 && p.y < y + s + 1)) { ok = false; break; }
      placed.push({ x, y, s, where });
    }
    if (!ok) continue;
    if (!placed.some((p) => p.where === "edge")) continue;
    const cut = new Set();
    placed.forEach((p) => { for (let i = p.x; i < p.x + p.s; i += 1) for (let j = p.y; j < p.y + p.s; j += 1) cut.add(cellKey(i, j)); });
    const cells = rectCells(S, S).filter(([i, j]) => !cut.has(cellKey(i, j)));
    if (!cellsSimple(cells) || !cellsConnected(cells)) continue;
    return { placed, cells };
  }
  return null;
}

function cutSquaresSvg(S, placed, cells, px) {
  const pad = 50;
  const T = scaler(pad, px);
  let body = outlinePoly(cellsOutline(cells), T);
  const ctr = [pad + (S * px) / 2, pad + (S * px) / 2];
  placed.forEach((p) => {
    body += dashedRect(pad + p.x * px, pad + p.y * px, p.s * px, p.s * px);
    // 자른 정사각형의 바깥쪽 변(처음 종이의 변 위)에 한 변의 길이
    let a;
    let b;
    if (p.y === 0) { a = [p.x, 0]; b = [p.x + p.s, 0]; } else if (p.y + p.s === S) { a = [p.x, S]; b = [p.x + p.s, S]; } else if (p.x === 0) { a = [0, p.y]; b = [0, p.y + p.s]; } else { a = [S, p.y]; b = [S, p.y + p.s]; }
    body += len(T(a), T(b), ctr, `${p.s}cm`, { off: 9, size: 13 });
  });
  return `${svgOpen(S * px + pad * 2, S * px + pad * 2, "작은 정사각형을 잘라 낸 종이")}${body}</svg>`;
}

function squareCutSquaresPerimeterB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const S = randomInt(difficulty === 1 ? 8 : 9, difficulty === 3 ? 14 : 12);
    const sizes = shuffle([1, 2, 3, 4]).slice(0, difficulty === 1 ? 2 : 3).sort((x, y) => x - y);
    const one = placeCutSquares(S, sizes);
    const two = placeCutSquares(S, sizes);
    if (!one || !two) continue;
    const answers = [one, two].map((r) => cellEdgeCount(r.cells));
    if (answers[0] === answers[1]) continue;
    const px = Math.min(170 / S, 16);
    const sol = (r, i) => {
      const edge = r.placed.filter((p) => p.where === "edge");
      return `${PARTS[i]} 모서리에서 자른 곳은 둘레가 그대로이고, 변 가운데에서 자른 정사각형은 양쪽 벽만큼 둘레가 늘어납니다. ${S} × 4 + ${edge.map((p) => `${p.s} × 2`).join(" + ")} = ${answers[i]}cm입니다.`;
    };
    return {
      prompt: `한 변이 ${S}cm인 정사각형 모양의 종이에서 한 변이 각각 ${sizes.map((s) => `${s}cm`).join(", ")}인 정사각형을 하나씩 잘라 냈습니다(점선). 남은 종이의 둘레를 각각 구하세요.`,
      visual: { kind: "fig", html: partWrap([cutSquaresSvg(S, one.placed, one.cells, px), cutSquaresSvg(S, two.placed, two.cells, px)]) },
      answer: answers.map((v, i) => `${PARTS[i]} ${v}cm`).join(" "),
      solution: [sol(one, 0), sol(two, 1)].join(" "),
      meta: { family: "square-cut-squares-b6", S, sizes, parts: [one, two].map((r) => ({ placed: r.placed, cells: r.cells })), answer: answers }
    };
  }
  return null;
}

// ── 2단원: 정사각형 종이의 한쪽에서 정사각형 두 개를 이어 잘라 낸 둘레 ──

function squareTwoStackedCutsB6({ difficulty = 2 }) {
  const S = randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 18 : 12);
  const b = randomInt(2, Math.ceil(S / 2) - 1);
  const big = S - b;
  // 기본 배치: 오른쪽 변에 위로 큰 정사각형, 아래로 작은 정사각형 — 돌리거나 뒤집어 놓는다
  const bigTop = Math.random() < 0.5;
  const base = [];
  for (let x = 0; x < S; x += 1) for (let y = 0; y < S; y += 1) {
    const inBig = x >= S - big && (bigTop ? y < big : y >= b);
    const inSmall = x >= S - b && (bigTop ? y >= big : y < b);
    if (!inBig && !inSmall) base.push([x, y]);
  }
  const turn = randomInt(0, 3);
  const rot = ([x, y]) => { let p = [x, y]; for (let k = 0; k < turn; k += 1) p = [S - 1 - p[1], p[0]]; return p; };
  const rotPt = ([x, y]) => { let p = [x, y]; for (let k = 0; k < turn; k += 1) p = [S - p[1], p[0]]; return p; };
  const cells = base.map(rot);
  const bigSq = bigTop ? [[S - big, 0], [S, big]] : [[S - big, b], [S, S]];
  const smallSq = bigTop ? [[S - b, big], [S, S]] : [[S - b, 0], [S, b]];
  const px = Math.min(190 / S, 18);
  const pad = 50;
  const T = scaler(pad, px);
  const sq = ([[x0, y0], [x1, y1]]) => { const p = rotPt([x0, y0]); const q = rotPt([x1, y1]); return [Math.min(p[0], q[0]), Math.min(p[1], q[1]), Math.abs(q[0] - p[0])]; };
  let body = outlinePoly(cellsOutline(cells), T);
  const [bx, by, bs] = sq(bigSq);
  const [sx, sy, ss] = sq(smallSq);
  body += dashedRect(pad + bx * px, pad + by * px, bs * px, bs * px) + dashedRect(pad + sx * px, pad + sy * px, ss * px, ss * px);
  const ctr = [pad + (S * px) / 2, pad + (S * px) / 2];
  // 처음 종이의 한 변(잘라 낸 쪽의 맞은편 변 전체) · 작은 정사각형의 바깥쪽 변
  const far = [rotPt([0, 0]), rotPt([0, S])];
  body += len(T(far[0]), T(far[1]), ctr, `${S}cm`, { off: 12, size: 14 });
  const smallOuter = bigTop ? [rotPt([S - b, S]), rotPt([S, S])] : [rotPt([S - b, 0]), rotPt([S, 0])];
  body += len(T(smallOuter[0]), T(smallOuter[1]), ctr, `${b}cm`, { off: 10, size: 13 });
  const html = `${svgOpen(S * px + pad * 2, S * px + pad * 2, "정사각형 두 개를 잘라 낸 종이")}${body}</svg>`;
  const answer = cellEdgeCount(cells);
  return {
    prompt: "정사각형 모양의 색종이에서 점선으로 표시한 정사각형 2개를 잘라 냈습니다. 색칠한 남은 색종이의 둘레는 몇 cm인가요?",
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `색종이의 한 변은 ${S}cm이므로 큰 정사각형의 한 변은 ${S} − ${b} = ${big}cm입니다. 남은 색종이는 직각으로만 꺾여 있으므로 펼치면 한쪽 길이가 ${S}cm, 다른 쪽 길이가 ${S} − ${b} = ${S - b}cm인 직사각형이 됩니다. 둘레는 (${S} + ${S - b}) × 2 = ${answer}cm입니다.`,
    meta: { family: "square-two-stacked-cuts-b6", S, b, big, cells, answer }
  };
}

// ── 2단원: 모눈 정사각형에서 잘라 낸 뒤 남은 조각의 둘레 ─────────

function randomPiece(n, k, { concave }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const start = [randomInt(0, n - 1), randomInt(0, n - 1)];
    const cells = [start];
    const set = new Set([cellKey(...start)]);
    let guard = 0;
    while (cells.length < k && guard < 400) {
      guard += 1;
      const [x, y] = pick(cells);
      const [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || set.has(cellKey(nx, ny))) continue;
      cells.push([nx, ny]);
      set.add(cellKey(nx, ny));
    }
    if (cells.length < k || !cellsSimple(cells)) continue;
    const box = bboxOf(cells);
    if (box.maxX - box.minX < n - 1 || box.maxY - box.minY < n - 1) continue;
    const per = cellEdgeCount(cells);
    if (concave && per === 2 * (box.maxX - box.minX + box.maxY - box.minY)) continue;
    return cells;
  }
  return null;
}

function gridPieceCutPerimeterB6({ difficulty = 2 }) {
  const n = difficulty === 1 ? 4 : randomInt(4, 5);
  const k = randomInt(Math.ceil(n * n * 0.35), Math.floor(n * n * 0.6));
  const cells = randomPiece(n, k, { concave: difficulty > 1 });
  if (!cells) return gridPieceCutPerimeterB6({ difficulty });
  const c = randomInt(2, difficulty === 3 ? 5 : 3);
  const px = Math.min(200 / n, 40);
  const pad = 28;
  const T = scaler(pad, px);
  const set = cellSetOf(cells);
  let body = "";
  for (let x = 0; x < n; x += 1) for (let y = 0; y < n; y += 1) if (!set.has(cellKey(x, y))) body += rect(pad + x * px, pad + y * px, px, px, SHADE, "#7d9a8c");
  for (const [x, y] of cells) body += rect(pad + x * px, pad + y * px, px, px, "#fff", "#b9cfc4");
  body += outlinePoly(cellsOutline(cells), T, "none", INK, 'stroke-width="2.4"').replace("stroke-width:1.6", "stroke-width:2.6");
  body += `<rect x="${pad}" y="${pad}" width="${n * px}" height="${n * px}" style="fill:none;stroke:#6f8d80;stroke-width:1.4"/>`;
  body += dimArc(pad, pad, pad + px, pad, -10, `${c}cm`, { size: 13 });
  const html = `${svgOpen(n * px + pad * 2, n * px + pad * 2, "모눈종이에서 잘라 낸 조각")}${body}</svg>`;
  const edges = cellEdgeCount(cells);
  const answer = edges * c;
  return {
    prompt: `모눈 한 칸의 한 변이 ${c}cm인 정사각형 모눈종이에서 색칠한 부분을 잘라 냈습니다. 남은 흰 조각의 둘레는 몇 cm인가요?`,
    visual: { kind: "fig", html },
    answer: `${answer}cm`,
    solution: `흰 조각의 둘레를 따라 모눈 한 칸의 변을 세면 ${edges}개입니다. 한 변이 ${c}cm이므로 둘레는 ${edges} × ${c} = ${answer}cm입니다.`,
    meta: { family: "grid-piece-cut-b6", n, cells, c, edges, answer }
  };
}

// ── 2단원: 정사각형과 정삼각형을 붙인 도형 — 둘레와 한 변 ───────────

function squareTriangleFigure(squares, triangles) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const cells = [[0, 0]];
    const set = new Set(["0:0"]);
    while (cells.length < squares) {
      const [x, y] = pick(cells);
      const [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      if (set.has(cellKey(x + dx, y + dy))) continue;
      cells.push([x + dx, y + dy]);
      set.add(cellKey(x + dx, y + dy));
    }
    const free = [];
    for (const [x, y] of cells) for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) if (!set.has(cellKey(x + dx, y + dy))) free.push({ x, y, dx, dy });
    const used = new Set();
    const tris = [];
    for (const f of shuffle(free)) {
      if (tris.length >= triangles) break;
      const k = cellKey(f.x + f.dx, f.y + f.dy);
      if (used.has(k)) continue;
      used.add(k);
      tris.push(f);
    }
    if (tris.length < triangles) continue;
    return { cells, tris, edges: free.length + tris.length };
  }
  return null;
}

function squareTriangleSvg(fig, px, name) {
  const xs = fig.cells.map(([x]) => x);
  const ys = fig.cells.map(([, y]) => y);
  const minX = Math.min(...xs) - 1;
  const minY = Math.min(...ys) - 1;
  const W = Math.max(...xs) - minX + 2;
  const H = Math.max(...ys) - minY + 2;
  const pad = 8;
  const T = ([x, y]) => [pad + (x - minX) * px, pad + (y - minY) * px];
  let body = "";
  fig.cells.forEach(([x, y]) => { const [X, Y] = T([x, y]); body += rect(X, Y, px, px, FILL, LINE); });
  fig.tris.forEach(({ x, y, dx, dy }) => {
    const cx = x + 0.5 + dx * 0.5;
    const cy = y + 0.5 + dy * 0.5;
    const p = [cx - dy * 0.5, cy + dx * 0.5];
    const q = [cx + dy * 0.5, cy - dx * 0.5];
    const apex = [cx + dx * 0.866, cy + dy * 0.866];
    body += poly([T(p), T(apex), T(q)], "#d4ebe0", LINE);
  });
  if (name) body += text(pad + px * 0.5, pad + H * px - px * 0.4, name, 15, 'font-weight="700"');
  return `${svgOpen(W * px + pad * 2, H * px + pad * 2, "정사각형과 정삼각형을 붙인 도형")}${body}</svg>`;
}

function squareTriangleSideFromPerimeterB6({ difficulty = 2 }) {
  const fig = squareTriangleFigure(randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 4 : 3), randomInt(1, difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4));
  const side = randomInt(2, difficulty === 3 ? 12 : 9);
  const perimeter = fig.edges * side;
  return {
    prompt: `한 변의 길이가 모두 같은 정사각형과 정삼각형을 붙여 만든 도형입니다. 이 도형의 둘레가 ${perimeter}cm일 때, 정사각형의 한 변은 몇 cm인가요?`,
    visual: { kind: "fig", html: squareTriangleSvg(fig, Math.min(46, 260 / 6)) },
    answer: `${side}cm`,
    solution: `둘레를 이루는 변은 정사각형 쪽 ${fig.edges - 2 * fig.tris.length}개, 정삼각형 쪽 ${2 * fig.tris.length}개로 모두 ${fig.edges}개이고 길이가 모두 같습니다. 한 변은 ${perimeter} ÷ ${fig.edges} = ${side}cm입니다.`,
    meta: { family: "square-triangle-side-b6", cells: fig.cells, tris: fig.tris, edges: fig.edges, side, perimeter, answer: side }
  };
}

function squareTrianglePerimeterTransferB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const one = squareTriangleFigure(randomInt(1, 2), randomInt(1, 2));
    const two = squareTriangleFigure(randomInt(2, difficulty === 3 ? 4 : 3), randomInt(2, difficulty === 1 ? 2 : 4));
    if (!one || !two || one.edges === two.edges) continue;
    const side = randomInt(2, difficulty === 3 ? 9 : 6);
    const p1 = one.edges * side;
    const answer = two.edges * side;
    const px = Math.min(40, 200 / 6);
    return {
      prompt: `두 도형은 한 변의 길이가 모두 같은 정사각형과 정삼각형을 붙여 만든 것입니다. 도형 가의 둘레가 ${p1}cm일 때, 도형 나의 둘레는 몇 cm인가요?`,
      visual: { kind: "fig", html: `<div style="display:flex;flex-wrap:wrap;gap:10px 30px;align-items:flex-end">${squareTriangleSvg(one, px, "가")}${squareTriangleSvg(two, px, "나")}</div>` },
      answer: `${answer}cm`,
      solution: `가의 둘레는 같은 길이의 변 ${one.edges}개이므로 한 변은 ${p1} ÷ ${one.edges} = ${side}cm입니다. 나의 둘레를 이루는 변은 ${two.edges}개이므로 ${side} × ${two.edges} = ${answer}cm입니다.`,
      meta: { family: "square-triangle-transfer-b6", figures: [one, two].map((f) => ({ cells: f.cells, tris: f.tris, edges: f.edges })), side, p1, answer }
    };
  }
  return null;
}

// ── 3단원: 같은 수를 묶은 식의 숨은 「× 1」 세 가지 ─────────────────

function commonFactorHiddenOneB6({ difficulty = 2 }) {
  const forms = shuffle(["pq", "one", "missing"]);
  const parts = forms.map((form) => {
    const base = difficulty === 1 ? pick([10, 100]) : difficulty === 2 ? pick([100, 1000]) : 1000;
    const rep = Math.random() < 0.5;
    const a = base === 10 ? randomInt(12, 98) : rep ? pick(base === 100 ? [11, 22, 33, 44, 55, 66, 77, 88, 99] : [111, 222, 333, 444, 555, 666, 777, 888, 999]) : base === 100 ? randomInt(12, 98) : randomInt(102, 998);
    const T = a * base;
    if (form === "pq") {
      const p = randomInt(2, base - 3);
      const q = base - 1 - p;
      return { form, a, base, T, expression: `${fmt(T)} = ${a} × ${p} + ${a} × ${q} + □`, answer: a, solution: `${a} × ${base}에서 ${josa(a, "을", "를")} ${p}번, ${q}번 더했으므로 ${base} − ${p} − ${q} = 1번 더 더해야 합니다. □ = ${a} × 1 = ${a}` };
    }
    if (form === "one") return { form, a, base, T, expression: `${fmt(T)} = ${a} × ${base - 1} + □`, answer: a, solution: `${josa(a, "을", "를")} ${base - 1}번 더했으므로 한 번 더 더해야 ${base}번이 됩니다. □ = ${a}` };
    const p = randomInt(2, base - 2);
    return { form, a, base, T, expression: `${fmt(T)} = ${a} × ${p} + ${a} × □`, answer: base - p, solution: `${fmt(T)} = ${a} × ${base}이므로 ${p} + □ = ${base}, □ = ${base - p}` };
  });
  return {
    prompt: "같은 수를 몇 번 더했는지 생각하여 □ 안에 알맞은 수를 구하세요.",
    visual: { kind: "fig", html: box(parts.map((p, i) => exprLine(`${PARTS[i]}&nbsp; ${p.expression}`)).join("")) },
    answer: parts.map((p, i) => `${PARTS[i]} ${fmt(p.answer)}`).join(" "),
    solution: parts.map((p, i) => `${PARTS[i]} ${p.solution}입니다.`).join(" "),
    meta: { family: "common-factor-hidden-one-b6", parts: parts.map(({ form, a, base, T, answer, expression }) => ({ form, a, base, T, answer, expression })), answer: parts.map((p) => p.answer) }
  };
}

// ── 3단원: 긴 더하기·빼기 번갈아 식과 묶어 빼기 ─────────────────────

function alternatingLongPairB6({ difficulty = 2 }) {
  let N = difficulty === 1 ? randomInt(10, 20) * 2 : randomInt(20, 60) * 2 + (difficulty === 3 && Math.random() < 0.5 ? 1 : 0);
  if (N === 100) N = 98;
  const terms = Array.from({ length: N }, (_, i) => N - i);
  const signOf = (i) => (i === 0 || i % 2 === 0 ? "+" : "−");
  const tok = (i) => `${i === 0 ? "" : `${signOf(i)} `}${terms[i]}`;
  const longExpr = `${[0, 1, 2, 3, 4, 5, 6].map(tok).join(" ")} ${signOf(7)} … ${Array.from({ length: 6 }, (_, k) => tok(N - 6 + k)).join(" ")}`;
  const first = N % 2 === 0 ? N / 2 : (N - 1) / 2 + 1;
  const k = randomInt(3, difficulty === 1 ? 4 : 5);
  const gap = difficulty === 1 ? 1 : randomInt(1, 3);
  const lowStart = randomInt(11, 70);
  const low = Array.from({ length: k }, (_, i) => lowStart + 2 * i);
  const high = low.map((v) => v + gap);
  const groupExpr = `${high.join(" + ")} − ${low.join(" − ")}`;
  const second = k * gap;
  return {
    prompt: "식의 규칙을 찾아 간단하게 계산하세요.",
    visual: { kind: "fig", html: box(exprLine(`(1)&nbsp; ${longExpr}`) + exprLine(`(2)&nbsp; ${groupExpr}`)) },
    answer: `(1) ${first} (2) ${second}`,
    solution: `(1) 앞에서부터 두 수씩 묶으면 ${N} − ${N - 1} = 1처럼 모두 1이고, ${N % 2 === 0 ? `묶음이 ${N} ÷ 2 = ${N / 2}개이므로 ${first}입니다.` : `묶음이 ${(N - 1) / 2}개, 마지막에 1이 남으므로 ${(N - 1) / 2} + 1 = ${first}입니다.`} (2) 더하는 수와 빼는 수를 하나씩 짝지으면 ${high.map((v, i) => `${v} − ${low[i]}`).slice(0, 2).join(", ")}처럼 모두 ${gap}이고 짝이 ${k}개이므로 ${gap} × ${k} = ${second}입니다.`,
    meta: { family: "alternating-long-pair-b6", N, high, low, answer: [first, second] }
  };
}

// ── 3단원: 짝수 개 연속수의 합으로 연속수 찾기 ─────────────────────

function consecutiveEvenCountFromSumB6({ difficulty = 2 }) {
  const count = difficulty === 3 ? pick([4, 6]) : 4;
  const start = randomInt(difficulty === 1 ? 2 : 5, difficulty === 1 ? 20 : 60);
  const values = Array.from({ length: count }, (_, i) => start + i);
  const total = sum(values);
  const pair = total / (count / 2);
  const circles = Array.from({ length: count }, (_, i) => `${i ? '<span style="padding:0 4px">+</span>' : ""}<span style="display:inline-block;width:30px;height:30px;border:1.5px solid ${LINE};border-radius:50%;vertical-align:middle;background:#fff"></span>`).join("");
  const html = box(`<div style="white-space:nowrap">${circles}<span style="padding:0 6px">=</span><b>${total}</b></div>`);
  const mid = count / 2;
  return {
    prompt: `연속수 ${count}개의 합이 ${total}입니다. 연속수를 작은 수부터 차례로 구하세요.`,
    visual: { kind: "fig", html },
    answer: values.join(", "),
    solution: `수가 짝수 개이면 처음 수와 끝 수, 둘째 수와 끝에서 둘째 수처럼 짝을 지은 합이 모두 같고 짝은 ${mid}쌍입니다. 한 쌍의 합은 ${total} ÷ ${mid} = ${pair}이고, 가운데 두 수는 이어진 수이므로 ${(pair - 1) / 2}과 ${(pair + 1) / 2}입니다. 따라서 ${values.join(", ")}입니다.`.replace(`${(pair - 1) / 2}과`, josa((pair - 1) / 2, "과", "와")),
    meta: { family: "consecutive-even-count-b6", count, total, values, answer: values }
  };
}

// ── 3단원: 신문지 한 장의 쪽수로 마지막 쪽 구하기 ───────────────────

function newspaperSheetLastPageB6({ difficulty = 2 }) {
  const sheets = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 20 : 12);
  const total = sheets * 4;
  let left;
  let right;
  do {
    const j = randomInt(1, sheets);
    if (Math.random() < 0.5) { left = total - 2 * j + 2; right = 2 * j - 1; } else { left = 2 * j; right = total - 2 * j + 1; }
  } while (left === total);
  const W = 230;
  const H = 130;
  let body = `<polygon points="14,22 ${W / 2},14 ${W / 2},${H + 6} 14,${H + 14}" style="fill:#fffdf7;stroke:#8a8270;stroke-width:1.5"/>`;
  body += `<polygon points="${W / 2},14 ${W - 14},22 ${W - 14},${H + 14} ${W / 2},${H + 6}" style="fill:#fffdf7;stroke:#8a8270;stroke-width:1.5"/>`;
  for (let i = 0; i < 5; i += 1) {
    body += `<line x1="32" y1="${40 + i * 14}" x2="${W / 2 - 16}" y2="${38 + i * 14}" style="stroke:#e1dccd;stroke-width:3"/>`;
    body += `<line x1="${W / 2 + 16}" y1="${38 + i * 14}" x2="${W - 32}" y2="${40 + i * 14}" style="stroke:#e1dccd;stroke-width:3"/>`;
  }
  body += text(36, H - 4, left, 15, 'font-weight="700"') + text(W - 36, H - 4, right, 15, 'font-weight="700"');
  const html = `${svgOpen(W, H + 22, "펼친 신문지 한 장의 한 면")}${body}</svg>`;
  return {
    prompt: "1쪽부터 차례로 쪽수가 적힌 신문지 여러 장을 겹쳐 반으로 접은 신문이 있습니다. 이 중에서 한 장을 꺼내 펼쳤더니 한 면에 그림과 같이 쪽수가 적혀 있었습니다. 같은 종이의 한 면에 있는 두 쪽수의 합은 어느 면에서나 같고, 1쪽과 마지막 쪽도 한 면에 함께 있습니다. 이 신문의 마지막 쪽은 몇 쪽인가요?",
    visual: { kind: "fig", html },
    answer: `${total}쪽`,
    solution: `한 면의 두 쪽수의 합은 ${left} + ${right} = ${left + right}입니다. 1쪽과 마지막 쪽의 합도 ${left + right}이므로 마지막 쪽은 ${left + right} − 1 = ${total}쪽입니다.`,
    meta: { family: "newspaper-sheet-last-page-b6", sheets, left, right, answer: total }
  };
}

// ── 4단원: 같은 수에 부호만 바꾼 식들의 값 표 ──────────────────────

const signEval = (values, pattern) => values.slice(1).reduce((t, v, i) => t + (pattern[i] === "+" ? v : -v), values[0]);
const signText = (values, pattern) => values.slice(1).reduce((t, v, i) => `${t} ${pattern[i] === "+" ? "+" : "−"} ${v}`, String(values[0]));

function signPatternTableB6({ difficulty = 2 }) {
  const n = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const start = randomInt(n, difficulty === 3 ? 12 : n + 3);
  const values = Array.from({ length: n }, (_, i) => start - i);
  const rows = difficulty === 1 ? 5 : 6;
  const all = operatorPatternsB6(n, ["+", "-"]);
  const plus = all[0];
  const picked = [plus, ...shuffle(all.slice(1).filter((p) => signEval(values, p) >= 0)).slice(0, rows - 1)];
  picked.sort((p, q) => signEval(values, q) - signEval(values, p));
  const tag = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];
  const cell = "border:1.2px solid #9cc0ae;padding:5px 12px;text-align:center";
  const html = `<table style="border-collapse:collapse;${FONT};font-size:16px;color:${INK};background:#fff"><tr><th style="${cell};background:#e4f1ea">순</th><th style="${cell};background:#e4f1ea">계산식</th><th style="${cell};background:#e4f1ea">값</th></tr>${picked.map((p, i) => `<tr><td style="${cell}">${tag[i]}</td><td style="${cell};white-space:nowrap">${signText(values, p)}</td><td style="${cell};min-width:60px"></td></tr>`).join("")}</table>`;
  const vals = picked.map((p) => signEval(values, p));
  const total = vals[0];
  return {
    prompt: "식을 계산하여 표의 빈칸에 값을 쓰세요.",
    visual: { kind: "fig", html },
    answer: vals.map((v, i) => `${tag[i]} ${v}`).join(", "),
    solution: `모두 더하면 ${total}입니다. 더하기를 빼기로 바꾸면 그 수를 한 번 빼고 한 번 더 빼는 셈이라 그 수의 2배만큼 작아집니다. ${picked.slice(1).map((p, i) => { const minus = values.slice(1).filter((_, k) => p[k] === "-"); return `${tag[i + 1]} ${total} − ${minus.map((m) => `${m} × 2`).join(" − ")} = ${vals[i + 1]}`; }).join(", ")}입니다.`,
    meta: { family: "sign-pattern-table-b6", values, patterns: picked, answer: vals }
  };
}

function operatorPatternsB6(length, operators) {
  let patterns = [[]];
  for (let i = 0; i < length - 1; i += 1) patterns = patterns.flatMap((p) => operators.map((o) => [...p, o]));
  return patterns;
}

const circleRow = (values, target, label = "") => `<div style="display:flex;align-items:center;gap:6px;white-space:nowrap;${FONT};font-size:17px;color:${INK}">${label ? `<b style="font-size:15px;min-width:28px">${label}</b>` : ""}${values.map((v, i) => `${i ? `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid ${LINE};border-radius:50%;background:#fff"></span>` : ""}<span>${v}</span>`).join("")}<span style="padding:0 4px">=</span><b>${target}</b></div>`;
const signWords = (pattern) => pattern.map((o) => (o === "+" ? "+" : "−")).join(", ");

// ── 4단원: 같은 수만큼 작아지는 수 사이에 ± 넣기(목표 여러 개) ─────────

function stepSequenceSignMultiB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const n = difficulty === 1 ? 5 : 6;
    const step = difficulty === 1 ? pick([2, 3]) : pick([3, 4, 5]);
    const last = randomInt(1, step);
    const values = Array.from({ length: n }, (_, i) => last + step * (n - 1 - i));
    const all = operatorPatternsB6(n, ["+", "-"]).map((p) => ({ p, v: signEval(values, p) }));
    const count = new Map();
    all.forEach(({ v }) => count.set(v, (count.get(v) || 0) + 1));
    const good = all.filter(({ p, v }) => count.get(v) === 1 && v > 0 && p.includes("-"));
    const want = difficulty === 1 ? 2 : 3;
    if (good.length < want) continue;
    const chosen = shuffle(good).slice(0, want).sort((a, b) => b.v - a.v);
    const html = `<div style="display:flex;flex-direction:column;gap:10px">${chosen.map((c, i) => circleRow(values, c.v, PARTS[i])).join("")}</div>`;
    const S = sum(values);
    return {
      prompt: `${step}씩 작아지는 수 사이의 ○ 안에 + 또는 −를 넣어 등식이 성립하도록 만드세요.`,
      visual: { kind: "fig", html },
      answer: chosen.map((c, i) => `${PARTS[i]} ${signWords(c.p)}`).join(" "),
      solution: `모두 더하면 ${S}입니다. 어떤 수 앞을 −로 바꾸면 그 수의 2배만큼 작아지므로, 줄여야 할 만큼의 반이 되는 수들을 찾습니다. ${chosen.map((c, i) => `${PARTS[i]} (${S} − ${c.v}) ÷ 2 = ${(S - c.v) / 2}이므로 ${values.slice(1).filter((_, k) => c.p[k] === "-").join(", ")} 앞에 −: ${signText(values, c.p)} = ${c.v}`).join(", ")}입니다.`,
      meta: { family: "step-sequence-sign-multi-b6", values, patterns: chosen.map((c) => c.p), targets: chosen.map((c) => c.v), answer: chosen.map((c) => c.p) }
    };
  }
  return null;
}

// ── 4단원: 정해진 묶음 수 사이에 ±만 넣어 목표 만들기 ─────────────────

function fixedGroupSignTargetB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const digits = Math.random() < 0.6 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [9, 8, 7, 6, 5, 4, 3, 2, 1];
    const g = difficulty === 1 ? randomInt(4, 5) : difficulty === 2 ? randomInt(5, 6) : 6;
    const lens = splitInto(9, g, 1);
    if (!lens || Math.max(...lens) > 3 || !lens.some((l) => l >= 2) || lens.join() === "3,2,2,1,1") continue;
    const values = [];
    let at = 0;
    lens.forEach((l) => { values.push(Number(digits.slice(at, at + l).join(""))); at += l; });
    const all = operatorPatternsB6(values.length, ["+", "-"]).map((p) => ({ p, v: signEval(values, p) }));
    const count = new Map();
    all.forEach(({ v }) => count.set(v, (count.get(v) || 0) + 1));
    const good = all.filter(({ p, v }) => count.get(v) === 1 && v > 0 && p.includes("-") && p.includes("+"));
    if (!good.length) continue;
    const c = pick(good);
    const S = sum(values.slice(1));
    return {
      prompt: `○ 안에 + 또는 −를 넣어 계산 결과가 ${josa(c.v, "이", "가")} 되도록 만드세요.`,
      visual: { kind: "fig", html: box(circleRow(values, c.v)) },
      answer: signWords(c.p),
      solution: `${values[0]} 뒤의 수를 모두 더하면 ${values[0]} + ${S} = ${values[0] + S}입니다. −로 바꾼 수는 2배만큼 줄어들므로 (${values[0] + S} − ${c.v}) ÷ 2 = ${josa((values[0] + S - c.v) / 2, "이", "가")} 되도록 ${values.slice(1).filter((_, k) => c.p[k] === "-").join(", ")} 앞에 −를 넣습니다. ${signText(values, c.p)} = ${c.v}입니다.`,
      meta: { family: "fixed-group-sign-target-b6", values, pattern: c.p, target: c.v, answer: c.p }
    };
  }
  return null;
}

// ── 4단원: 같은 숫자를 늘어놓고 +를 넣어 목표 만들기 ─────────────────

const repNum = (d, k) => Number(String(d).repeat(k));

function partitionsOf(n, max = n) {
  if (n === 0) return [[]];
  const out = [];
  for (let k = Math.min(n, max); k >= 1; k -= 1) for (const rest of partitionsOf(n - k, k)) out.push([k, ...rest]);
  return out;
}

function sameDigitPlusTargetB6({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const d = randomInt(1, 9);
    const n = difficulty === 1 ? randomInt(5, 6) : difficulty === 2 ? randomInt(6, 8) : randomInt(8, 9);
    const parts = partitionsOf(n, difficulty === 1 ? 3 : 4);
    const bySum = new Map();
    parts.forEach((p) => { const s = sum(p.map((k) => repNum(d, k))); bySum.set(s, (bySum.get(s) || 0) + 1); });
    const good = parts.filter((p) => bySum.get(sum(p.map((k) => repNum(d, k)))) === 1 && p.length >= 3 && p[0] >= 2 && p.some((k) => k === 1));
    if (!good.length) continue;
    const p = pick(good);
    const terms = p.map((k) => repNum(d, k));
    const target = sum(terms);
    const row = `<div style="display:flex;gap:10px;align-items:center;white-space:nowrap;${FONT};font-size:19px;color:${INK}">${Array.from({ length: n }, () => `<span>${d}</span>`).join("")}<span>=</span><b>${fmt(target)}</b></div>`;
    return {
      prompt: `숫자 ${josa(d, "을", "를")} ${n}개 늘어놓고 숫자 사이사이에 +를 넣어 계산 결과가 ${josa(fmt(target), "이", "가")} 되도록 만드세요. (숫자 사이에 꼭 +를 넣지 않아도 됩니다.)`,
      visual: { kind: "fig", html: box(row) },
      answer: `${terms.join(" + ")} = ${fmt(target)}`,
      solution: `자릿수가 많은 수부터 넣어 보며 합을 맞춥니다. ${terms.join(" + ")} = ${fmt(target)}이고, 쓴 숫자 ${josa(d, "은", "는")} ${p.join(" + ")} = ${n}개로 모두 썼습니다. 더하는 차례는 바꾸어도 됩니다.`,
      meta: { family: "same-digit-plus-target-b6", d, n, lengths: p, target, answer: p }
    };
  }
  return null;
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
  digitExcludeCountB6,
  rectParallelogramPerimeterFourB6,
  parallelogramPerimeterPairB6,
  rectangleDiagonalTrianglesB6,
  beeRoutePerimeterCompareB6,
  orthoConvexPiecesPerimeterB6,
  gridTwoShapesPerimeterB6,
  fieldRegionFenceB6,
  concaveTwoNotchPerimeterB6,
  squareCutSquaresPerimeterB6,
  squareTwoStackedCutsB6,
  gridPieceCutPerimeterB6,
  squareTriangleSideFromPerimeterB6,
  squareTrianglePerimeterTransferB6,
  commonFactorHiddenOneB6,
  alternatingLongPairB6,
  consecutiveEvenCountFromSumB6,
  newspaperSheetLastPageB6,
  signPatternTableB6,
  stepSequenceSignMultiB6,
  fixedGroupSignTargetB6,
  sameDigitPlusTargetB6
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
  row("digit-exclude-count-b6", "number", "숫자 포함", "1부터 N까지 여러 숫자가 들어 있는 수를 뺀 나머지", "digitExcludeCountB6", ["숫자 빼기", "남는 수", "여러 숫자 제외"]),
  // (2차) 2단원
  row("rect-parallelogram-perimeter-four-b6", "geometry", "사각형 둘레", "직사각형·평행사변형의 둘레와 모르는 변 네 가지", "rectParallelogramPerimeterFourB6", ["직사각형 둘레", "평행사변형 둘레", "둘레로 변 찾기"]),
  row("parallelogram-perimeter-pair-b6", "geometry", "사각형 둘레", "평행사변형의 둘레와 둘레로 모르는 변 찾기", "parallelogramPerimeterPairB6", ["평행사변형 둘레", "마주 보는 변", "둘레로 변 찾기"]),
  row("rectangle-diagonal-triangles-b6", "geometry", "사각형 둘레", "두 대각선을 그은 직사각형에서 색칠한 두 삼각형의 둘레", "rectangleDiagonalTrianglesB6", ["두 대각선", "대각선의 반", "삼각형 둘레"]),
  row("bee-route-compare-b6", "geometry", "직각으로 꺾인 도형", "직각으로 꺾인 두 도형의 둘레를 견주어 먼저 도는 쪽 찾기", "beeRoutePerimeterCompareB6", ["둘레 비교", "꺾인 도형 펼치기", "먼저 돌아오기"]),
  row("ortho-convex-pieces-b6", "geometry", "직각으로 꺾인 도형", "조각 길이로 주어진 직각으로 꺾인 도형 두 개의 둘레", "orthoConvexPiecesPerimeterB6", ["계단 도형 둘레", "조각 길이 더하기", "둘러싼 직사각형"]),
  row("grid-two-shapes-b6", "geometry", "직각으로 꺾인 도형", "모눈 위 볼록한 도형과 움푹 파인 도형의 둘레", "gridTwoShapesPerimeterB6", ["모눈 도형 둘레", "움푹 파인 도형", "칸 세기"]),
  row("field-region-fence-b6", "geometry", "직각으로 꺾인 도형", "땅의 네 변에 닿은 꺾인 잔디밭의 둘레", "fieldRegionFenceB6", ["잔디밭 둘레", "땅의 둘레와 같음", "끈의 길이"]),
  row("concave-two-notch-b6", "geometry", "직각으로 꺾인 도형", "위와 옆에 홈이 하나씩 파인 도형의 둘레", "concaveTwoNotchPerimeterB6", ["홈 두 개", "옆 홈", "움푹 파인 도형 둘레"]),
  row("square-cut-squares-b6", "geometry", "잘라낸 도형의 둘레", "정사각형 종이의 모서리·변에서 작은 정사각형을 잘라 낸 둘레", "squareCutSquaresPerimeterB6", ["모서리에서 자르기", "변에서 자르기", "늘어난 둘레"]),
  row("square-two-stacked-cuts-b6", "geometry", "잘라낸 도형의 둘레", "정사각형 종이의 한쪽에서 정사각형 두 개를 잘라 낸 둘레", "squareTwoStackedCutsB6", ["정사각형 두 개 잘라 내기", "남은 색종이 둘레", "한 변 찾기"]),
  row("grid-piece-cut-b6", "geometry", "잘라낸 도형의 둘레", "모눈종이에서 잘라 내고 남은 조각의 둘레", "gridPieceCutPerimeterB6", ["모눈 조각 둘레", "변 세기", "잘라 내고 남은 조각"]),
  row("square-triangle-side-b6", "geometry", "붙인 도형의 둘레", "정사각형과 정삼각형을 붙인 도형의 둘레로 한 변 찾기", "squareTriangleSideFromPerimeterB6", ["정삼각형과 정사각형", "둘레로 한 변", "같은 길이 변 세기"]),
  row("square-triangle-transfer-b6", "geometry", "붙인 도형의 둘레", "한 도형의 둘레로 같은 조각을 붙인 다른 도형의 둘레 구하기", "squareTrianglePerimeterTransferB6", ["정삼각형과 정사각형", "다른 도형 둘레", "한 변 먼저 찾기"]),
  // (2차) 3단원
  row("common-factor-hidden-one-b6", "number", "곱셈을 간편하게", "같은 수를 묶은 식에 숨은 한 번 더하기 찾기", "commonFactorHiddenOneB6", ["같은 수 묶기", "곱하기 1", "빈칸 찾기"]),
  row("alternating-long-pair-b6", "number", "덧셈을 간편하게", "긴 더하기·빼기 번갈아 식과 짝지어 빼기", "alternatingLongPairB6", ["두 수씩 묶기", "번갈아 더하고 빼기", "짝지어 빼기"]),
  row("consecutive-even-count-b6", "number", "연속수의 합", "짝수 개 연속수의 합으로 연속수 찾기", "consecutiveEvenCountFromSumB6", ["연속수 4개", "가운데 두 수", "합으로 연속수"]),
  row("newspaper-sheet-last-page-b6", "number", "연속수의 합", "신문지 한 장의 두 쪽수로 마지막 쪽 구하기", "newspaperSheetLastPageB6", ["신문 쪽수", "마지막 쪽", "같은 면 두 쪽의 합"]),
  // (2차) 4단원
  row("sign-pattern-table-b6", "number", "수 만들기", "같은 수에 부호만 바꾼 식들의 값 표", "signPatternTableB6", ["부호 바꾸기", "2배만큼 작아짐", "계산 표"]),
  row("step-sequence-sign-multi-b6", "number", "수 만들기", "같은 수만큼 작아지는 수 사이에 ± 넣기(목표 여러 개)", "stepSequenceSignMultiB6", ["등식 만들기", "줄어드는 수", "더하기 빼기 넣기"]),
  row("fixed-group-sign-target-b6", "number", "수 만들기", "정해진 묶음 수 사이에 ±만 넣어 목표 수 만들기", "fixedGroupSignTargetB6", ["묶음 수", "더하기 빼기 넣기", "목표 수"]),
  row("same-digit-plus-target-b6", "number", "수 만들기", "같은 숫자를 늘어놓고 +를 넣어 목표 수 만들기", "sameDigitPlusTargetB6", ["같은 숫자", "이어 붙인 수", "더하기 넣기"])
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
  "digit-exclude-count-b6": "숫자가 들어 있는 수를 빠짐없이 세어 전체 수의 개수에서 뺍니다.",
  "rect-parallelogram-perimeter-four-b6": "마주 보는 두 변이 같으므로 둘레는 (두 변의 합) × 2, 모르는 변은 둘레의 반에서 아는 변을 뺍니다.",
  "parallelogram-perimeter-pair-b6": "평행사변형도 마주 보는 두 변이 같으므로 둘레의 반이 두 변의 합입니다.",
  "rectangle-diagonal-triangles-b6": "직사각형의 두 대각선은 길이가 같고 서로를 반으로 나누므로 삼각형의 두 변은 모두 대각선의 반입니다.",
  "bee-route-compare-b6": "꺾인 부분을 바깥으로 밀어 펼쳐 둘러싼 직사각형의 둘레로 견줍니다.",
  "ortho-convex-pieces-b6": "같은 쪽을 보는 조각 길이를 더해 가로와 세로를 찾고, 둘러싼 직사각형의 둘레를 구합니다.",
  "grid-two-shapes-b6": "볼록한 도형은 둘러싼 직사각형의 둘레와 같고, 움푹 파인 곳은 양쪽 벽만큼 더합니다.",
  "field-region-fence-b6": "땅의 네 변에 모두 닿은 꺾인 도형은 꺾인 부분을 펼치면 땅의 둘레와 같습니다.",
  "concave-two-notch-b6": "둘러싼 직사각형의 둘레에 안으로 파인 홈마다 깊이의 2배를 더합니다.",
  "square-cut-squares-b6": "모서리에서 자르면 둘레가 그대로이고, 변 가운데에서 자르면 자른 정사각형 한 변의 2배만큼 늘어납니다.",
  "square-two-stacked-cuts-b6": "큰 정사각형의 한 변을 먼저 구하고, 남은 꺾인 도형을 펼친 직사각형의 둘레를 구합니다.",
  "grid-piece-cut-b6": "남은 조각의 둘레를 따라 모눈 한 칸의 변을 빠짐없이 세어 한 변의 길이를 곱합니다.",
  "square-triangle-side-b6": "둘레를 이루는 같은 길이의 변을 세어 둘레를 그 수로 나눕니다.",
  "square-triangle-transfer-b6": "먼저 둘레를 아는 도형으로 한 변을 구하고, 다른 도형의 바깥 변 수를 곱합니다.",
  "common-factor-hidden-one-b6": "같은 수를 모두 몇 번 더했는지 세어, 10·100·1000번이 되려면 몇 번 더 더해야 하는지 찾습니다.",
  "alternating-long-pair-b6": "두 수씩 짝지어 차가 같은 묶음을 만들고, 묶음의 수를 셉니다.",
  "consecutive-even-count-b6": "짝수 개 연속수는 짝지은 두 수의 합이 같으므로, 합을 짝의 수로 나누어 가운데 두 수를 찾습니다.",
  "newspaper-sheet-last-page-b6": "한 면에 있는 두 쪽수의 합은 1쪽과 마지막 쪽의 합과 같습니다.",
  "sign-pattern-table-b6": "더하기를 빼기로 바꾸면 그 수의 2배만큼 작아집니다.",
  "step-sequence-sign-multi-b6": "모두 더한 값에서 목표를 빼고 반으로 나눈 만큼이 되도록 빼기를 넣을 수를 고릅니다.",
  "fixed-group-sign-target-b6": "모두 더한 값과 목표의 차를 반으로 나누어, 그만큼이 되는 묶음 앞에 빼기를 넣습니다.",
  "same-digit-plus-target-b6": "자릿수가 많은 수부터 넣어 보고, 쓴 숫자의 개수를 맞춥니다."
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
  ["book-06", 4, "practice", 1, [6], "digit-exclude-count-b6"],
  // (2차) 2단원
  ["book-06", 2, "activity", 1, [1], "rect-parallelogram-perimeter-four-b6"],
  ["book-06", 2, "practice", 1, [3], "parallelogram-perimeter-pair-b6"],
  ["book-06", 2, "activity", 1, [6], "rectangle-diagonal-triangles-b6"],
  ["book-06", 2, "practice", 1, [8], "rectangle-diagonal-triangles-b6"],
  ["book-06", 2, "activity", 2, [1], "bee-route-compare-b6"],
  ["book-06", 2, "activity", 2, [2], "ortho-convex-pieces-b6"],
  ["book-06", 2, "practice", 1, [13], "ortho-convex-pieces-b6"],
  ["book-06", 2, "practice", 1, [1], "grid-two-shapes-b6"],
  ["book-06", 2, "practice", 1, [14], "field-region-fence-b6"],
  ["book-06", 2, "activity", 2, [5], "concave-two-notch-b6"],
  ["book-06", 2, "practice", 1, [17], "concave-two-notch-b6"],
  ["book-06", 2, "practice", 1, [16], "square-cut-squares-b6"],
  ["book-06", 2, "practice", 1, [18], "square-two-stacked-cuts-b6"],
  ["book-06", 2, "check", 2, [1], "grid-piece-cut-b6"],
  ["book-06", 2, "check", 2, [4], "square-triangle-side-b6"],
  ["book-06", 2, "practice", 1, [20], "square-triangle-transfer-b6"],
  // (2차) 3단원
  ["book-06", 3, "advanced", 1, [1], "common-factor-hidden-one-b6"],
  ["book-06", 3, "advanced", 1, [2], "alternating-long-pair-b6"],
  ["book-06", 3, "advanced", 1, [4], "consecutive-even-count-b6"],
  ["book-06", 3, "advanced", 1, [5], "newspaper-sheet-last-page-b6"],
  ["book-06", 3, "practice", 1, [18], "newspaper-sheet-last-page-b6"],
  // (2차) 4단원
  ["book-06", 4, "practice", 1, [7], "sign-pattern-table-b6"],
  ["book-06", 4, "practice", 1, [9], "step-sequence-sign-multi-b6"],
  ["book-06", 4, "practice", 1, [13], "fixed-group-sign-target-b6"],
  ["book-06", 4, "advanced", 1, [4], "same-digit-plus-target-b6"]
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
  },
  // ── (2차) 새 유형: 생성할 때와 다른 길로 다시 풀어 본다 ──
  "quad-perimeter-parts-b6": ({ meta, answer }) => {
    const nums = String(answer).match(/\) (\d+)cm/g).map((t) => Number(t.match(/\d+/)[0]));
    return ok(meta.parts.every((p, i) => p.perimeter === p.a + p.b + p.a + p.b && nums[i] === (p.ask === "perimeter" ? p.perimeter : p.ask === "a" ? p.perimeter / 2 - p.b : p.perimeter / 2 - p.a)) && nums.length === meta.parts.length, "사각형 둘레 오류");
  },
  "rectangle-diagonal-triangles-b6": ({ meta, answer }) => {
    const nums = String(answer).match(/\d+/g).map(Number);
    return ok(meta.W ** 2 + meta.H ** 2 === meta.D ** 2 && meta.D % 2 === 0 && nums[0] === meta.W + meta.D / 2 * 2 && nums[1] === meta.H + meta.D / 2 * 2, "대각선 삼각형 둘레 오류");
  },
  "bee-route-compare-b6": ({ meta, answer }) => {
    const per = meta.shapes.map((s) => outlineLength(cellsOutline(s.cells)));
    const boxes = meta.shapes.every((s) => { const b = bboxOf(s.cells); return b.maxX - b.minX === s.W && b.maxY - b.minY === s.H; });
    const first = per[0] < per[1] ? "꿀벌 ①" : "꿀벌 ②";
    return ok(boxes && per[0] !== per[1] && per.every((v, i) => v === meta.perimeters[i]) && String(answer).startsWith(first), "꿀벌 둘레 비교 오류");
  },
  "ortho-convex-pieces-b6": ({ meta, answer }) => {
    const nums = String(answer).match(/\) (\d+)cm/g).map((t) => Number(t.match(/\d+/)[0]));
    return ok(meta.shapes.every((s, i) => outlineLength(cellsOutline(s.cells)) === nums[i] && sum(s.given.width) === s.W && sum(s.given.height) === s.H && cellsConnected(s.cells)), "꺾인 도형 둘레 오류");
  },
  "grid-two-shapes-b6": ({ meta, answer }) => {
    const nums = String(answer).match(/\) (\d+)cm/g).map((t) => Number(t.match(/\d+/)[0]));
    return ok(meta.shapes.every((c, i) => cellsConnected(c) && cellsSimple(c) && outlineLength(cellsOutline(c)) === nums[i]), "모눈 도형 둘레 오류");
  },
  "field-region-fence-b6": ({ meta, answer }) => {
    const b = bboxOf(meta.cells);
    const full = b.maxX - b.minX === meta.n && b.maxY - b.minY === meta.m && outlineLength(cellsOutline(meta.cells)) === 2 * (meta.n + meta.m);
    return ok(full && num(answer) === meta.S + meta.S + meta.H + meta.H, "잔디밭 둘레 오류");
  },
  "concave-two-notch-b6": ({ meta, answer }) => ok(outlineLength(cellsOutline(meta.cells)) === num(answer) && num(answer) === 2 * (meta.W + meta.H) + 2 * (meta.d1 + meta.d2), "홈 두 개 둘레 오류"),
  "square-cut-squares-b6": ({ meta, answer }) => {
    const nums = String(answer).match(/\) (\d+)cm/g).map((t) => Number(t.match(/\d+/)[0]));
    return ok(meta.parts.every((p, i) => {
      const area = meta.S * meta.S - sum(p.placed.map((q) => q.s * q.s));
      return p.cells.length === area && outlineLength(cellsOutline(p.cells)) === nums[i] && nums[i] === 4 * meta.S + sum(p.placed.filter((q) => q.where === "edge").map((q) => 2 * q.s));
    }) && nums[0] !== nums[1], "잘라 낸 종이 둘레 오류");
  },
  "square-two-stacked-cuts-b6": ({ meta, answer }) => ok(meta.big + meta.b === meta.S && meta.b < meta.big && outlineLength(cellsOutline(meta.cells)) === num(answer) && num(answer) === 2 * (meta.S + meta.S - meta.b), "두 정사각형 잘라 낸 둘레 오류"),
  "grid-piece-cut-b6": ({ meta, answer }) => ok(cellsConnected(meta.cells) && cellsSimple(meta.cells) && outlineLength(cellsOutline(meta.cells)) * meta.c === num(answer), "모눈 조각 둘레 오류"),
  "square-triangle-side-b6": ({ meta, answer }) => {
    const set = cellSetOf(meta.cells);
    let free = 0;
    meta.cells.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!set.has(cellKey(x + dx, y + dy))) free += 1; }));
    const targets = meta.tris.map((t) => cellKey(t.x + t.dx, t.y + t.dy));
    const okTris = new Set(targets).size === targets.length && targets.every((k) => !set.has(k));
    return ok(okTris && free + meta.tris.length === meta.edges && meta.perimeter === meta.edges * num(answer), "정삼각형·정사각형 한 변 오류");
  },
  "square-triangle-transfer-b6": ({ meta, answer }) => {
    const edges = meta.figures.map((f) => { const set = cellSetOf(f.cells); let free = 0; f.cells.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!set.has(cellKey(x + dx, y + dy))) free += 1; })); return free + f.tris.length; });
    return ok(meta.p1 % edges[0] === 0 && (meta.p1 / edges[0]) * edges[1] === num(answer) && edges[0] !== edges[1], "다른 도형 둘레 오류");
  },
  "common-factor-hidden-one-b6": ({ meta }) => ok(meta.parts.every((p) => {
    const [left, right] = p.expression.replaceAll("□", String(p.answer)).replaceAll(",", "").split("=");
    const value = right.split("+").reduce((t, term) => t + term.split("×").reduce((m, f) => m * Number(f.trim()), 1), 0);
    return Number(left.trim()) === value && p.answer > 0;
  }), "숨은 곱 빈칸 오류"),
  "alternating-long-pair-b6": ({ meta }) => {
    let t = 0;
    for (let v = meta.N, i = 0; v >= 1; v -= 1, i += 1) t += i % 2 ? -v : v;
    return ok(t === meta.answer[0] && sum(meta.high) - sum(meta.low) === meta.answer[1] && meta.answer[1] > 0, "번갈아 식 오류");
  },
  "consecutive-even-count-b6": ({ meta, answer }) => {
    const vals = String(answer).split(",").map((v) => Number(v.trim()));
    return ok(vals.length === meta.count && meta.count % 2 === 0 && vals.every((v, i) => !i || v === vals[i - 1] + 1) && sum(vals) === meta.total, "연속수 합 오류");
  },
  "newspaper-sheet-last-page-b6": ({ meta, answer }) => {
    const total = num(answer);
    const faces = [];
    for (let j = 1; j <= total / 4; j += 1) faces.push([total - 2 * j + 2, 2 * j - 1], [2 * j, total - 2 * j + 1]);
    return ok(total % 4 === 0 && total === meta.sheets * 4 && faces.some(([l, r]) => l === meta.left && r === meta.right) && meta.left !== total, "신문 마지막 쪽 오류");
  },
  "sign-pattern-table-b6": ({ meta }) => ok(meta.patterns.every((p, i) => {
    let t = meta.values[0];
    p.forEach((o, k) => { t += o === "+" ? meta.values[k + 1] : -meta.values[k + 1]; });
    return t === meta.answer[i] && t >= 0;
  }) && new Set(meta.patterns.map((p) => p.join(""))).size === meta.patterns.length, "부호 표 값 오류"),
  "step-sequence-sign-multi-b6": ({ meta }) => {
    const n = meta.values.length;
    const valueOf = (mask) => meta.values.reduce((t, v, i) => t + (i && mask & (1 << (i - 1)) ? -v : v), 0);
    const stepOk = meta.values.every((v, i) => !i || meta.values[i - 1] - v === meta.values[0] - meta.values[1]);
    return ok(stepOk && meta.targets.every((target, k) => {
      const hits = [];
      for (let mask = 0; mask < 1 << (n - 1); mask += 1) if (valueOf(mask) === target) hits.push(mask);
      const mine = meta.patterns[k].reduce((m, o, i) => m | (o === "-" ? 1 << i : 0), 0);
      return hits.length === 1 && hits[0] === mine;
    }), "± 넣기(여러 목표) 답이 하나가 아님");
  },
  "fixed-group-sign-target-b6": ({ meta }) => {
    const n = meta.values.length;
    const digits = meta.values.join("");
    const valueOf = (mask) => meta.values.reduce((t, v, i) => t + (i && mask & (1 << (i - 1)) ? -v : v), 0);
    let hits = 0;
    for (let mask = 0; mask < 1 << (n - 1); mask += 1) if (valueOf(mask) === meta.target) hits += 1;
    return ok((digits === "123456789" || digits === "987654321") && hits === 1 && meta.pattern.reduce((t, o, i) => t + (o === "+" ? meta.values[i + 1] : -meta.values[i + 1]), meta.values[0]) === meta.target, "묶음 ± 답이 하나가 아님");
  },
  "same-digit-plus-target-b6": ({ meta }) => {
    // 숫자 사이마다 + 또는 이어 붙이기를 모두 해 보고, 목표가 되는 경우의 조각 길이 모음이 하나뿐인지
    const shapes = new Set();
    for (let mask = 0; mask < 1 << (meta.n - 1); mask += 1) {
      const lens = [];
      let run = 1;
      for (let i = 0; i < meta.n - 1; i += 1) { if (mask & (1 << i)) { lens.push(run); run = 1; } else run += 1; }
      lens.push(run);
      if (sum(lens.map((k) => Number(String(meta.d).repeat(k)))) === meta.target) shapes.add([...lens].sort((a, b) => b - a).join(","));
    }
    return ok(shapes.size === 1 && [...shapes][0] === meta.lengths.join(","), "같은 숫자 더하기 답이 하나가 아님");
  }
};
