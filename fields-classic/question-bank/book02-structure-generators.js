// 1과정 2권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK02_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK02_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK02_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK02_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
import { foldWordStrip } from "./fold-visuals.js?v=20261123a";

// 모든 생성기는 같은 길을 밟는다: 꼴 스펙 → 수·배치를 새로 뽑기 → 아이가 하는 생각(풀이기)으로 끝까지 풀리는지 확인 →
// 완전 탐색으로 답이 하나뿐인지 확인 → 풀이는 그 풀이기가 밟은 차례를 아이 말로.

// ── 공통 ─────────────────────────────────────────────

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 수 뒤 조사(받침): 0·1·3·6·7·8은 받침 있음.
const numHasBatchim = (n) => [0, 1, 3, 6, 7, 8].includes(Math.abs(n) % 10);
const eul = (n) => `${n}${numHasBatchim(n) ? "을" : "를"}`;
const eun = (n) => `${n}${numHasBatchim(n) ? "은" : "는"}`;
const iga = (n) => `${n}${numHasBatchim(n) ? "이" : "가"}`;

const INK = "#2f2a24";
const LINE = "#7d9a86";
const SOFT = "#e9f1ea";
const FONT = "font-family:'Noto Sans KR',sans-serif";
const MARKS = ["㉠", "㉡", "㉢", "㉣", "㉤"];

function svgWrap(width, height, body, label) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="width:${width}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">${body}</svg>`;
}

function text(x, y, value, { size = 18, weight = 400, fill = INK, anchor = "middle" } = {}) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" style="fill:${fill};${FONT}">${value}</text>`;
}

// ── 도형 ─────────────────────────────────────────────
// 화면 글에서 쓰는 기호와 읽는 이름(조사는 읽는 이름의 받침으로).
const SHAPE_INFO = Object.freeze({
  circle: { sym: "○", batchim: false },
  square: { sym: "□", batchim: false },
  triangle: { sym: "△", batchim: false },
  diamond: { sym: "◇", batchim: false },
  cross: { sym: "✚", batchim: false },
  heart: { sym: "♡", batchim: false },
  star: { sym: "☆", batchim: true },
  pentagon: { sym: "⬠", batchim: true }
});
const sym = (kind) => SHAPE_INFO[kind].sym;
const shapeSubject = (kind) => `${sym(kind)}${SHAPE_INFO[kind].batchim ? "이" : "가"}`;
const shapeTopic = (kind) => `${sym(kind)}${SHAPE_INFO[kind].batchim ? "은" : "는"}`;

function shapeSvg(kind, cx, cy, r, { fill = "#fff", stroke = INK, width = 1.7 } = {}) {
  const line = `style="fill:${fill};stroke:${stroke};stroke-width:${width};stroke-linejoin:round"`;
  const poly = (pts) => `<polygon points="${pts.map(([x, y]) => `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`).join(" ")}" ${line}/>`;
  if (kind === "circle") return `<circle cx="${cx}" cy="${cy}" r="${r}" ${line}/>`;
  if (kind === "square") return `<rect x="${cx - r * 0.9}" y="${cy - r * 0.9}" width="${r * 1.8}" height="${r * 1.8}" ${line}/>`;
  if (kind === "triangle") return poly([[0, -r], [r * 1.05, r * 0.8], [-r * 1.05, r * 0.8]]);
  if (kind === "diamond") return poly([[0, -r * 1.05], [r * 1.05, 0], [0, r * 1.05], [-r * 1.05, 0]]);
  if (kind === "cross") {
    const a = r * 0.36;
    const b = r * 0.98;
    return poly([[-a, -b], [a, -b], [a, -a], [b, -a], [b, a], [a, a], [a, b], [-a, b], [-a, a], [-b, a], [-b, -a], [-a, -a]]);
  }
  if (kind === "heart") {
    const s = r / 10;
    const p = (x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`;
    return `<path d="M${p(0, 9)} C${p(-12, 0)} ${p(-10, -10)} ${p(-5, -10)} C${p(-2, -10)} ${p(0, -7)} ${p(0, -5)} C${p(0, -7)} ${p(2, -10)} ${p(5, -10)} C${p(10, -10)} ${p(12, 0)} ${p(0, 9)}Z" ${line}/>`;
  }
  if (kind === "star") {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r * 1.05;
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr + r * 0.08]);
    }
    return poly(pts);
  }
  // pentagon
  const pts = [];
  for (let i = 0; i < 5; i += 1) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    pts.push([Math.cos(a) * r * 1.02, Math.sin(a) * r * 1.02 + r * 0.06]);
  }
  return poly(pts);
}

// 숫자 카드 한 줄(교재의 「1 2 3 4」 카드)
function cardsSvg(cards) {
  const w = 30;
  const gap = 6;
  const width = cards.length * (w + gap) - gap + 4;
  const body = cards.map((n, i) => {
    const x = 2 + i * (w + gap);
    return `<rect x="${x}" y="2" width="${w}" height="34" rx="2" style="fill:${SOFT};stroke:${LINE};stroke-width:1.3"/>${text(x + w / 2, 25, n, { size: 17 })}`;
  }).join("");
  return svgWrap(width, 38, body, `숫자 카드 ${cards.join(", ")}`);
}

// ── 2단원 「도형이 나타내는 수」 — 서로 다른 수를 나타내는 도형 식 ────────────────
// 식 하나 = { left: [모양...], right: [모양...] } (모양을 여러 번 쓰면 그만큼 더함)

function eqSum(side, values) {
  return side.reduce((total, kind) => total + values.get(kind), 0);
}

function eqText(eq) {
  return `${eq.left.map(sym).join(" + ")} = ${eq.right.map(sym).join(" + ")}`;
}

// 「식이 되려면」처럼 식 뒤에 「가/이」를 붙일 때는 마지막 도형 이름의 받침을 본다.
function eqSubject(eq) {
  return `${eqText(eq)}${SHAPE_INFO[eq.right.at(-1)].batchim ? "이" : "가"}`;
}

function orList(list) {
  return list.length === 2 ? `${list[0]} 또는 ${list[1]}` : `${list.join(", ")} 중 하나`;
}

// 아이가 하는 생각: 식마다 카드를 넣어 보며 될 수 있는 수만 남긴다(같은 모양 = 같은 수, 다른 모양 = 다른 수).
// 모양이 하나로 정해지면 그 카드는 다른 모양에서 뺀다. 카드 수와 모양 수가 같으면 「한 모양에만 들어갈 수 있는 카드」도 정한다.
function solveShapeEquations(eqs, kinds, cards) {
  const domain = new Map(kinds.map((kind) => [kind, new Set(cards)]));
  const steps = [];
  const fixedOrder = [];
  const fixed = () => kinds.filter((kind) => domain.get(kind).size === 1);
  const fix = (kind) => {
    if (fixedOrder.includes(kind)) return;
    fixedOrder.push(kind);
    const value = [...domain.get(kind)][0];
    kinds.forEach((other) => { if (other !== kind) domain.get(other).delete(value); });
  };
  const tuplesOf = (eq) => {
    const used = [...new Set([...eq.left, ...eq.right])];
    const result = [];
    const assign = new Map();
    const walk = (i) => {
      if (i === used.length) {
        if (eqSum(eq.left, assign) === eqSum(eq.right, assign)) result.push(new Map(assign));
        return;
      }
      const kind = used[i];
      for (const v of domain.get(kind)) {
        if ([...assign.values()].includes(v)) continue;
        assign.set(kind, v);
        walk(i + 1);
        assign.delete(kind);
      }
    };
    walk(0);
    return { used, result };
  };
  for (let guard = 0; guard < 60; guard += 1) {
    let changed = false;
    for (let index = 0; index < eqs.length && !changed; index += 1) {
      const eq = eqs[index];
      const { used, result } = tuplesOf(eq);
      if (!result.length) return { solved: false, steps, fixedOrder, contradiction: true };
      const shrunk = used.filter((kind) => {
        const keep = new Set(result.map((t) => t.get(kind)));
        return keep.size < domain.get(kind).size;
      });
      if (!shrunk.length) continue;
      changed = true;
      const open = used.filter((kind) => !fixedOrder.includes(kind));
      if (result.length === 1) {
        const t = result[0];
        steps.push(`(${index + 1}) ${eqSubject(eq)} 되는 수는 ${open.map((kind) => `${sym(kind)} = ${t.get(kind)}`).join(", ")}뿐입니다.`);
      } else {
        const lists = open.map((kind) => {
          const keep = [...new Set(result.map((t) => t.get(kind)))].sort((a, b) => a - b);
          return keep.length === 1 ? `${sym(kind)} = ${keep[0]}` : `${shapeTopic(kind)} ${orList(keep)}`;
        });
        steps.push(`(${index + 1}) ${eqSubject(eq)} 되려면 ${lists.join(", ")}입니다.`);
      }
      used.forEach((kind) => {
        domain.set(kind, new Set(result.map((t) => t.get(kind))));
      });
      fixed().forEach(fix);
    }
    if (!changed && cards.length === kinds.length) {
      for (const card of cards) {
        const holders = kinds.filter((kind) => domain.get(kind).has(card));
        if (holders.length === 1 && domain.get(holders[0]).size > 1) {
          domain.set(holders[0], new Set([card]));
          steps.push(`카드 ${eun(card)} ${sym(holders[0])}에만 들어갈 수 있으므로 ${sym(holders[0])} = ${card}입니다.`);
          fix(holders[0]);
          changed = true;
          break;
        }
      }
    }
    if (!changed) break;
  }
  const solved = kinds.every((kind) => domain.get(kind).size === 1);
  return { solved, steps, fixedOrder, values: solved ? new Map(kinds.map((kind) => [kind, [...domain.get(kind)][0]])) : null };
}

// 완전 탐색으로 해가 몇 개인지
function countShapeSolutions(eqs, kinds, cards, limit = 2) {
  let count = 0;
  const assign = new Map();
  const walk = (i) => {
    if (count >= limit) return;
    if (i === kinds.length) {
      if (eqs.every((eq) => eqSum(eq.left, assign) === eqSum(eq.right, assign))) count += 1;
      return;
    }
    for (const v of cards) {
      if ([...assign.values()].includes(v)) continue;
      assign.set(kinds[i], v);
      walk(i + 1);
      assign.delete(kinds[i]);
    }
  };
  walk(0);
  return count;
}

// 식 한 줄을 값에 맞게 만든다. form: 꼴 이름
function makeEquation(form, kinds, values) {
  const by = (v) => kinds.find((kind) => values.get(kind) === v);
  const others = (...not) => shuffle(kinds.filter((kind) => !not.includes(kind)));
  if (form === "double" || form === "triple") {
    const k = form === "double" ? 2 : 3;
    for (const x of others()) {
      const y = by(values.get(x) * k);
      if (y) return { left: Array(k).fill(x), right: [y] };
    }
    return null;
  }
  if (form === "pair") {
    for (const x of others()) for (const y of others(x)) {
      const z = by(values.get(x) + values.get(y));
      if (z && z !== x && z !== y) return { left: [x, y], right: [z] };
    }
    return null;
  }
  if (form === "triple-sum") {
    for (const x of others()) for (const y of others(x)) for (const z of others(x, y)) {
      const w = by(values.get(x) + values.get(y) + values.get(z));
      if (w && ![x, y, z].includes(w)) return { left: [x, y, z], right: [w] };
    }
    return null;
  }
  if (form === "double-pair" || form === "triple-pair" || form === "double-plus-pair") {
    const k = form === "triple-pair" ? 3 : 2;
    for (const x of others()) {
      const target = values.get(x) * k;
      for (const y of others(x)) for (const z of others(x, y)) {
        if (values.get(y) + values.get(z) !== target) continue;
        return { left: Array(k).fill(x), right: [y, z] };
      }
    }
    return null;
  }
  if (form === "pair-pair") {
    for (const x of others()) for (const y of others(x)) for (const z of others(x, y)) for (const w of others(x, y, z)) {
      if (values.get(x) + values.get(y) === values.get(z) + values.get(w)) return { left: [x, y], right: [z, w] };
    }
    return null;
  }
  if (form === "ratio") {
    // ○ k개 = □ m개 (k와 m이 다르고 한쪽이 2개 이상)
    for (const x of others()) for (const y of others(x)) {
      const a = values.get(x);
      const b = values.get(y);
      for (let k = 2; k <= 4; k += 1) {
        if ((a * k) % b) continue;
        const m = (a * k) / b;
        if (m <= k || m > 5) continue;
        return { left: Array(k).fill(x), right: Array(m).fill(y) };
      }
    }
    return null;
  }
  if (form === "ratio-plus") {
    // ○ k개 = □ m개 + △ (오른쪽에 다른 모양 하나를 더함)
    for (const x of others()) for (const y of others(x)) for (const z of others(x, y)) {
      for (let k = 2; k <= 3; k += 1) {
        const rest = values.get(x) * k - values.get(z);
        if (rest <= 0 || rest % values.get(y)) continue;
        const m = rest / values.get(y);
        if (m < 2 || m > 4) continue;
        return { left: Array(k).fill(x), right: [...Array(m).fill(y), z] };
      }
    }
    return null;
  }
  if (form === "pair-plus") {
    // ○ + □ = △ + ◇ + ◇ 처럼 오른쪽이 세 개
    for (const x of others()) for (const y of others(x)) for (const z of others(x, y)) for (const w of others(x, y, z)) {
      if (values.get(x) + values.get(y) === values.get(z) + values.get(w) * 2) return { left: [x, y], right: [z, w, w] };
    }
    return null;
  }
  return null;
}

const eqKey = (eq) => `${[...eq.left].sort().join(",")}=${[...eq.right].sort().join(",")}`;

// spec: { cards, shapes, rows, forms(줄마다 고를 꼴 목록), first(첫 줄 꼴), minSteps, targetLast }
function buildShapePuzzle(spec) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const cards = typeof spec.cards === "function" ? spec.cards() : spec.cards;
    const pool = spec.kindsPool || ["circle", "square", "triangle", "diamond", "cross", "heart", "pentagon"];
    const kinds = shuffle(pool).slice(0, spec.shapes);
    const values = new Map(kinds.map((kind, i) => [kind, 0]));
    const picked = shuffle(cards).slice(0, spec.shapes);
    kinds.forEach((kind, i) => values.set(kind, picked[i]));
    const eqs = [];
    const seen = new Set();
    let failed = false;
    for (let row = 0; row < spec.rows; row += 1) {
      const form = row === 0 && spec.first ? pick(spec.first) : pick(spec.forms);
      let eq = null;
      for (let t = 0; t < 6 && !eq; t += 1) {
        const made = makeEquation(form, kinds, values);
        if (made && !seen.has(eqKey(made))) eq = made;
      }
      if (!eq) { failed = true; break; }
      seen.add(eqKey(eq));
      eqs.push(eq);
    }
    if (failed) continue;
    // 모든 모양이 식에 나와야 한다
    const appear = new Set(eqs.flatMap((eq) => [...eq.left, ...eq.right]));
    if (appear.size !== kinds.length) continue;
    const solved = solveShapeEquations(eqs, kinds, cards);
    if (!solved.solved) continue;
    if (countShapeSolutions(eqs, kinds, cards) !== 1) continue;
    if (solved.steps.length < (spec.minSteps || 2) || solved.steps.length > (spec.maxSteps || 7)) continue;
    // 쓰지 않는 식(덧붙인 줄)이 없게: 모든 식이 풀이에 한 번은 나온다
    if (spec.useAll && !eqs.every((_, i) => solved.steps.some((line) => line.startsWith(`(${i + 1}) `)))) continue;
    // 첫 줄만으로 정해지는 모양은 묻지 않는다. 가장 늦게 정해지는 모양을 묻는다.
    const target = solved.fixedOrder.at(-1);
    if (spec.ratioFirst) {
      const first = solveShapeEquations([eqs[0]], kinds, cards);
      const pinned = kinds.filter((kind) => eqs[0].left.includes(kind) || eqs[0].right.includes(kind));
      // 비 줄은 카드에서 짝이 하나뿐이어야 교재 꼴(그 줄에서 두 모양이 바로 정해진다)
      if (!pinned.every((kind) => first.fixedOrder.includes(kind))) continue;
    }
    if (eqs[0].left.includes(target) || eqs[0].right.includes(target)) continue;
    return { cards, kinds, values: solved.values, eqs, steps: solved.steps, target };
  }
  return null;
}

function equationsSvg(eqs) {
  const r = 12;
  const step = 32;
  const plusW = 18;
  const rowH = 38;
  const widthOf = (eq) => (eq.left.length + eq.right.length) * step + (eq.left.length + eq.right.length - 2) * plusW + 26;
  const inner = Math.max(...eqs.map(widthOf));
  const width = inner + 34;
  const height = eqs.length * rowH + 18;
  let body = `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" style="fill:#eef4ef;stroke:${LINE};stroke-width:1"/>`;
  eqs.forEach((eq, rowIndex) => {
    let x = 18;
    const y = 9 + rowIndex * rowH + rowH / 2;
    const side = (items) => items.forEach((kind, i) => {
      if (i) { body += text(x + plusW / 2, y + 6, "+", { size: 17 }); x += plusW; }
      body += shapeSvg(kind, x + step / 2, y, r);
      x += step;
    });
    side(eq.left);
    body += text(x + 13, y + 6, "=", { size: 18 });
    x += 26;
    side(eq.right);
  });
  return svgWrap(width, height, body, "도형 식");
}

function cardRangeText(cards) {
  const sorted = [...cards].sort((a, b) => a - b);
  const consecutive = sorted.every((n, i) => !i || n === sorted[i - 1] + 1);
  return consecutive ? `${sorted[0]}부터 ${sorted.at(-1)}까지` : `${sorted.join(", ")} 중에서`;
}

function shapeEquationProblem(spec, label) {
  const made = buildShapePuzzle(spec);
  if (!made) return null;
  const sorted = [...made.cards].sort((a, b) => a - b);
  const html = `${cardsSvg(sorted)}${equationsSvg(made.eqs)}`;
  const answer = made.values.get(made.target);
  const range = cardRangeText(made.cards);
  return {
    prompt: `다음 각 도형은 ${range}${range.endsWith("까지") ? "의" : ""} 서로 다른 수를 나타냅니다. ${shapeSubject(made.target)} 나타내는 수를 구하세요.`,
    visual: { kind: "fig", html },
    answer: String(answer),
    solution: `같은 도형은 같은 수, 다른 도형은 다른 수입니다. ${made.steps.join(" ")} 따라서 ${shapeTopic(made.target)} ${answer}입니다.`,
    meta: {
      kindLabel: label,
      cards: sorted,
      equations: made.eqs.map((eq) => ({ left: eq.left.map(sym), right: eq.right.map(sym) })),
      values: Object.fromEntries(made.kinds.map((kind) => [sym(kind), made.values.get(kind)])),
      target: sym(made.target),
      answer
    }
  };
}

const consecutiveCards = (starts, lengths) => () => {
  const start = pick(starts);
  const length = pick(lengths);
  return Array.from({ length }, (_, i) => start + i);
};
const scatteredCards = (size, max = 9, min = 1) => () => shuffle(Array.from({ length: max - min + 1 }, (_, i) => min + i)).slice(0, size).sort((a, b) => a - b);
const mixCards = (...makers) => () => pick(makers)();

function shapeCardProblem(makeCards, spec, label) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const cards = makeCards();
    const one = shapeEquationProblem({ ...spec, cards, shapes: spec.shapes ? spec.shapes(cards) : cards.length }, label);
    if (one) return one;
  }
  return null;
}

// 활동 2-1~2-4 · 연습 11·12: 이어진 카드(1~5, 2~5, 2~6, 4~8), 모양 = 카드 수, 첫 줄 「○ + ○ = □」
function shapeValueChainCards({ difficulty = 2 }) {
  const starts = difficulty === 3 ? [2, 3, 4] : difficulty === 1 ? [1] : [1, 2];
  return shapeCardProblem(consecutiveCards(starts, difficulty === 1 ? [4] : [4, 5]), {
    rows: difficulty === 1 ? 3 : 4,
    first: ["double"],
    forms: difficulty === 1 ? ["double", "pair"] : ["double", "pair", "double-pair", "triple-sum", "pair-pair"],
    minSteps: 2,
    maxSteps: 6,
    useAll: true
  }, "value-chain");
}

// 연습 9: 띄엄띄엄 카드 일곱 장, 모양 일곱, 「○ + ○ = □」 줄 다섯
function shapeValueManyCards({ difficulty = 2 }) {
  return shapeCardProblem(scatteredCards(difficulty === 1 ? 6 : 7, 9), {
    rows: difficulty === 1 ? 4 : 5,
    first: ["double"],
    forms: ["double", "double", "double-pair", "pair"],
    minSteps: 3,
    maxSteps: 8,
    useAll: true
  }, "value-many");
}

// 확인 2-1~2-4 · 연습 10·13~18 · 도전 3·4: 첫 줄이 비(같은 모양 k개 = 다른 모양 m개), 카드 네 장(도전은 다섯 장)
function shapeRatioEquation({ difficulty = 2 }) {
  const five = difficulty === 3;
  const makeCards = five
    ? mixCards(consecutiveCards([1, 2, 3, 4], [5]), scatteredCards(5, 9, 2))
    : mixCards(consecutiveCards([1, 2, 3, 4, 5], [4]), scatteredCards(4, 9, 2), () => pick([[2, 4, 6, 8], [1, 3, 5, 7], [3, 5, 7, 9]]));
  return shapeCardProblem(makeCards, {
    rows: 3,
    first: ["ratio"],
    ratioFirst: true,
    forms: ["double-pair", "pair", "pair-pair", "ratio-plus", "pair-plus", "double"],
    minSteps: 2,
    maxSteps: 6
  }, five ? "ratio-five" : "ratio");
}

// ── 2단원 「양팔저울」 — 수평인 저울 여러 개 ────────────────────────────
// 저울 하나 = { left: [물건...], right: [물건...] } (모두 수평). 저울마다 새 물건이 하나씩 나오게 만들어서
// 앞 저울에서 알게 된 무게로 다음 물건의 무게를 차례로 구할 수 있다(그래서 답은 하나).

const OBJECTS = Object.freeze({
  ball: { sym: "●", batchim: false, color: "#3f8f86" },
  gem: { sym: "◆", batchim: false, color: "#e08a3c" },
  box: { sym: "■", batchim: false, color: "#7aa35a" },
  star: { sym: "★", batchim: true, color: "#8a6bb5" },
  plus: { sym: "✚", batchim: false, color: "#a8547f" },
  penta: { sym: "⬟", batchim: true, color: "#c2554b" }
});
const osym = (kind) => OBJECTS[kind].sym;
const oTopic = (kind) => `${osym(kind)}${OBJECTS[kind].batchim ? "은" : "는"}`;

function objectSvg(kind, cx, cy, r, label) {
  const color = OBJECTS[kind].color;
  const line = `style="fill:${color};stroke:#3b332a;stroke-width:1.1;stroke-linejoin:round"`;
  const poly = (pts) => `<polygon points="${pts.map(([x, y]) => `${(cx + x).toFixed(1)},${(cy + y).toFixed(1)}`).join(" ")}" ${line}/>`;
  let s;
  if (kind === "ball") s = `<circle cx="${cx}" cy="${cy}" r="${r}" ${line}/>`;
  else if (kind === "gem") s = poly([[0, -r * 1.1], [r * 1.1, 0], [0, r * 1.1], [-r * 1.1, 0]]);
  else if (kind === "box") s = `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" ${line}/>`;
  else if (kind === "star") {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.5 : r * 1.15;
      pts.push([Math.cos(a) * rr, Math.sin(a) * rr + r * 0.1]);
    }
    s = poly(pts);
  } else if (kind === "plus") {
    const a = r * 0.4;
    const b = r;
    s = poly([[-a, -b], [a, -b], [a, -a], [b, -a], [b, a], [a, a], [a, b], [-a, b], [-a, a], [-b, a], [-b, -a], [-a, -a]]);
  } else {
    const pts = [];
    for (let i = 0; i < 5; i += 1) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      pts.push([Math.cos(a) * r * 1.08, Math.sin(a) * r * 1.08 + r * 0.08]);
    }
    s = poly(pts);
  }
  if (label != null) s += text(cx, cy + 4.5, label, { size: 12, weight: 700, fill: "#fff" });
  return s;
}

// 저울 그림 하나. 물건이 많으면 두 층으로 쌓는다.
function scaleSvg(scale, index, givenKind, givenGrams) {
  const r = 10;
  const step = 23;
  const perRow = 4;
  const sideWidth = (items) => Math.min(items.length, perRow) * step;
  const pan = Math.max(70, sideWidth(scale.left) + 16, sideWidth(scale.right) + 16);
  const gap = 46;
  const width = pan * 2 + gap + 8;
  const rows = Math.max(Math.ceil(scale.left.length / perRow), Math.ceil(scale.right.length / perRow));
  const panY = 24 + rows * step;
  const height = panY + 56;
  const leftC = 4 + pan / 2;
  const rightC = width - 4 - pan / 2;
  const mid = width / 2;
  let body = "";
  const side = (items, cx) => {
    items.forEach((kind, i) => {
      const row = Math.floor(i / perRow);
      const inRow = Math.min(perRow, items.length - row * perRow);
      const col = i % perRow;
      const x = cx - ((inRow - 1) * step) / 2 + col * step;
      const y = panY - r - 3 - row * step;
      body += objectSvg(kind, x, y, r, kind === givenKind && givenGrams != null ? givenGrams : null);
    });
  };
  body += `<line x1="${leftC}" y1="${panY + 10}" x2="${rightC}" y2="${panY + 10}" style="stroke:#6b6255;stroke-width:2.2"/>`;
  body += `<line x1="${leftC}" y1="${panY + 2}" x2="${leftC}" y2="${panY + 10}" style="stroke:#6b6255;stroke-width:2"/>`;
  body += `<line x1="${rightC}" y1="${panY + 2}" x2="${rightC}" y2="${panY + 10}" style="stroke:#6b6255;stroke-width:2"/>`;
  body += `<polygon points="${mid},${panY + 10} ${mid + 13},${panY + 32} ${mid - 13},${panY + 32}" style="fill:#c9ded0;stroke:#6b8f78;stroke-width:1.2"/>`;
  body += `<ellipse cx="${leftC}" cy="${panY}" rx="${pan / 2}" ry="4.5" style="fill:#f3f1ec;stroke:#8a8172;stroke-width:1.2"/>`;
  body += `<ellipse cx="${rightC}" cy="${panY}" rx="${pan / 2}" ry="4.5" style="fill:#f3f1ec;stroke:#8a8172;stroke-width:1.2"/>`;
  side(scale.left, leftC);
  side(scale.right, rightC);
  body += text(mid, height - 6, `[그림${index + 1}]`, { size: 14 });
  return svgWrap(width, height, body, `양팔저울 그림${index + 1}`);
}

function countPhrase(items) {
  const map = new Map();
  items.forEach((kind) => map.set(kind, (map.get(kind) || 0) + 1));
  return [...map.entries()].map(([kind, n]) => `${osym(kind)} ${n}개`).join("와 ");
}

// spec: { kinds, given: "unit"|"heavy"|"none", unitGrams:[min,max], factors:[min,max], maxSide, needRatio, maxGrams }
function buildBalance(spec) {
  const pool = Object.keys(OBJECTS);
  for (let attempt = 0; attempt < 800; attempt += 1) {
    const kinds = shuffle(pool).slice(0, spec.kinds);
    const unitGrams = spec.given === "none" ? 1 : randomInt(...spec.unitGrams);
    const factors = shuffle(Array.from({ length: spec.factors[1] - spec.factors[0] + 1 }, (_, i) => spec.factors[0] + i)).slice(0, spec.kinds);
    if (factors.length < spec.kinds) return null;
    const weight = new Map(kinds.map((kind, i) => [kind, factors[i]]));
    const byWeight = [...kinds].sort((a, b) => weight.get(a) - weight.get(b));
    // 처음 아는 물건: unit·none은 가장 가벼운 것, heavy는 무거운 쪽 둘 중 하나
    const start = spec.given === "heavy" ? pick(byWeight.slice(Math.max(1, spec.kinds - 2))) : byWeight[0];
    const grams = (kind) => weight.get(kind) * unitGrams;
    const known = [start];
    const scales = [];
    const order = shuffle(kinds.filter((kind) => kind !== start));
    let ok = true;
    for (const next of order) {
      const options = [];
      const w = weight.get(next);
      for (let a = 1; a <= 3; a += 1) {
        // 아는 물건 한두 가지로 a × (새 물건 무게) 만들기
        for (const p of known) for (let cp = 1; cp <= spec.maxSide; cp += 1) {
          if (weight.get(p) * cp === a * w && !(a === 1 && cp === 1)) options.push({ a, items: Array(cp).fill(p) });
          for (const q of known) {
            if (q <= p) continue;
            for (let cq = 1; cp + cq <= spec.maxSide; cq += 1) {
              if (weight.get(p) * cp + weight.get(q) * cq === a * w) options.push({ a, items: [...Array(cp).fill(p), ...Array(cq).fill(q)] });
            }
          }
        }
      }
      if (!options.length) { ok = false; break; }
      const choice = pick(options);
      const newSide = Array(choice.a).fill(next);
      scales.push(Math.random() < 0.5 ? { left: newSide, right: choice.items, unknown: next } : { left: choice.items, right: newSide, unknown: next });
      known.push(next);
    }
    if (!ok) continue;
    if (spec.needRatio && !scales.some((s) => s.left.length >= 2 && s.right.length >= 2)) continue;
    // heavy: 처음 저울에서 아는 물건 1개가 새 물건 여러 개로 나뉜다(나눠 내려가기)
    if (spec.given === "heavy") {
      const first = scales[0];
      const newSide = first.left[0] === first.unknown ? first.left : first.right;
      if (newSide.length < 2) continue;
    }
    if (spec.maxGrams && Math.max(...kinds.map(grams)) > spec.maxGrams) continue;
    return { kinds, start, unitGrams, weight, grams, scales, order: [start, ...order] };
  }
  return null;
}

function balanceSteps(made, { relative = false } = {}) {
  const unitWord = (v) => (relative ? `${v}칸` : `${v}g`);
  const value = (kind) => (relative ? made.weight.get(kind) : made.grams(kind));
  return made.scales.map((scale, index) => {
    const X = scale.unknown;
    const newSide = scale.left[0] === X ? scale.left : scale.right;
    const other = newSide === scale.left ? scale.right : scale.left;
    const total = other.reduce((t, k) => t + value(k), 0);
    const sumText = other.length > 1 ? `${other.map(value).join(" + ")} = ${unitWord(total)}` : unitWord(total);
    const a = newSide.length;
    if (a === 1) return `[그림${index + 1}]에서 ${oTopic(X)} ${countPhrase(other)}의 무게와 같으므로 ${osym(X)} = ${sumText}입니다.`;
    return `[그림${index + 1}]에서 ${osym(X)} ${a}개의 무게가 ${countPhrase(other)}의 무게(${sumText})와 같으므로 ${osym(X)} 1개는 ${unitWord(value(X))}입니다.`;
  });
}

function balanceVisual(made, showGrams = true) {
  return { kind: "fig", html: made.scales.map((scale, i) => scaleSvg(scale, i, made.start, showGrams ? made.grams(made.start) : null)).join("") };
}

const BALANCE_LEVEL = "다음 그림의 양팔저울은 모두 수평입니다.";
const scalesMeta = (made) => made.scales.map((s) => ({ left: s.left.map(osym), right: s.right.map(osym) }));

// 활동 1-3·1-4 · 연습 3·4 · 도전 1: 저울 셋, 물건 넷, 가장 가벼운 물건의 무게 → 무거운 순서
function balanceUnitOrder({ difficulty = 2 }) {
  const made = buildBalance({ kinds: difficulty === 3 ? 5 : 4, given: "unit", unitGrams: [1, 4], factors: [1, difficulty === 1 ? 6 : 9], maxSide: difficulty === 1 ? 3 : 4, maxGrams: 40 });
  if (!made) return null;
  const order = [...made.kinds].sort((a, b) => made.grams(b) - made.grams(a));
  const answer = order.map(osym).join(" > ");
  return {
    prompt: `${BALANCE_LEVEL} ${osym(made.start)} 1개의 무게가 ${made.grams(made.start)}g일 때, 무거운 물건부터 차례대로 쓰세요.`,
    visual: balanceVisual(made),
    answer,
    solution: `${balanceSteps(made).join(" ")} 무게를 견주면 ${order.map((k) => `${osym(k)}(${made.grams(k)}g)`).join(" > ")}입니다.`,
    meta: { kindLabel: "unit-order", given: osym(made.start), weights: Object.fromEntries(made.kinds.map((k) => [osym(k), made.grams(k)])), scales: scalesMeta(made), answer }
  };
}

// 활동 1-2: 수평 저울 둘, 그램 없음(하나 = 둘의 합, 둘 = 하나) → 무거운 순서
function balanceEqualOrder({ difficulty = 2 }) {
  for (let t = 0; t < 40; t += 1) {
    const made = buildBalance({ kinds: difficulty === 3 ? 4 : 3, given: "none", factors: [1, difficulty === 1 ? 4 : 6], maxSide: 3 });
    if (!made || made.weight.get(made.start) !== 1) continue;
    const order = [...made.kinds].sort((a, b) => made.weight.get(b) - made.weight.get(a));
    const answer = order.map(osym).join(" > ");
    return {
      prompt: `${BALANCE_LEVEL} 무거운 물건부터 차례대로 기호를 쓰세요.`,
      visual: balanceVisual(made, false),
      answer,
      solution: `가장 가벼운 ${osym(made.start)} 1개의 무게를 1칸이라고 생각합니다. ${balanceSteps(made, { relative: true }).join(" ")} 그래서 무거운 차례는 ${answer}입니다.`,
      meta: { kindLabel: "equal-order", weights: Object.fromEntries(made.kinds.map((k) => [osym(k), made.weight.get(k)])), scales: scalesMeta(made), answer }
    };
  }
  return null;
}

// 확인 1-1~1-3 · 연습 5·6·8: 무거운 물건의 무게를 알려 주고 나눠 내려가며 다른 물건의 무게 구하기, 2 대 3 접시
function balanceHeavyGivenWeight({ difficulty = 2 }) {
  const made = buildBalance({ kinds: 4, given: "heavy", unitGrams: [1, difficulty === 1 ? 2 : 3], factors: [1, difficulty === 1 ? 6 : 8], maxSide: 4, needRatio: difficulty >= 2, maxGrams: 40 });
  if (!made) return null;
  const target = made.order.at(-1);
  const answer = `${made.grams(target)}g`;
  return {
    prompt: `${BALANCE_LEVEL} ${osym(made.start)} 1개의 무게가 ${made.grams(made.start)}g일 때, ${osym(target)} 1개의 무게를 구하세요.`,
    visual: balanceVisual(made),
    answer,
    solution: `${balanceSteps(made).join(" ")} 따라서 ${osym(target)} 1개의 무게는 ${answer}입니다.`,
    meta: { kindLabel: "heavy-given", given: osym(made.start), weights: Object.fromEntries(made.kinds.map((k) => [osym(k), made.grams(k)])), scales: scalesMeta(made), target: osym(target), answer }
  };
}

function balanceCountProblem(makeSpec, label) {
  for (let t = 0; t < 40; t += 1) {
    const made = buildBalance(makeSpec());
    if (!made) continue;
    const target = made.order.at(-1);
    // 마지막 저울에 그 둘만 올라가 있으면 그림에서 바로 보이므로 다른 물건을 묻는다
    const lastScale = made.scales.at(-1);
    const candidates = made.kinds.filter((k) => k !== target && made.grams(target) % made.grams(k) === 0 && made.grams(target) / made.grams(k) >= 2
      && ![...lastScale.left, ...lastScale.right].every((x) => x === target || x === k));
    if (!candidates.length) continue;
    const notStart = candidates.filter((k) => k !== made.start);
    const per = pick(notStart.length ? notStart : candidates);
    const n = made.grams(target) / made.grams(per);
    const howMany = n <= 5 ? `(${Array(n).fill(made.grams(per)).join(" + ")} = ${made.grams(target)}g)` : `(${made.grams(per)}g씩 ${n}개면 ${made.grams(target)}g)`;
    return {
      prompt: `${BALANCE_LEVEL} ${osym(made.start)} 1개의 무게가 ${made.grams(made.start)}g일 때, ${osym(target)} 1개의 무게는 ${osym(per)} 몇 개의 무게와 같은지 구하세요.`,
      visual: balanceVisual(made),
      answer: `${n}개`,
      solution: `${balanceSteps(made).join(" ")} ${osym(target)} 1개는 ${made.grams(target)}g, ${osym(per)} 1개는 ${made.grams(per)}g이므로 ${osym(per)} ${n}개${howMany}와 무게가 같습니다.`,
      meta: { kindLabel: label, given: osym(made.start), weights: Object.fromEntries(made.kinds.map((k) => [osym(k), made.grams(k)])), scales: scalesMeta(made), target: osym(target), per: osym(per), answer: n }
    };
  }
  return null;
}

// 확인 1-4 · 연습 7: 저울 셋, 「X 1개는 Y 몇 개의 무게와 같은지」
function balanceCountAnswer({ difficulty = 2 }) {
  return balanceCountProblem(() => ({ kinds: 4, given: pick(["unit", "heavy"]), unitGrams: [1, difficulty === 1 ? 2 : 5], factors: [1, 8], maxSide: 4, maxGrams: 40 }), "count");
}

// 도전 2: 저울 다섯, 물건 여섯, 개수로 답하기
function balanceCountLong({ difficulty = 2 }) {
  return balanceCountProblem(() => ({ kinds: difficulty === 1 ? 5 : 6, given: "unit", unitGrams: [1, 2], factors: [1, 12], maxSide: 4, maxGrams: 40 }), "count-long");
}

// ── 4단원 「스도쿠」 — 판 전체 채우기(교재 꼴) · 굵은 선 배치 여러 가지 ────────────────
// 굵은 선 배치는 모두 찾아 두고(한 칸짜리 줄 모양 배치·네모 배치는 따로) 그중 하나를 고른다.
// 빈칸은 아이가 하는 두 생각 — ① 그 칸에 들어갈 수 있는 수가 하나뿐 ② 그 줄(굵은 칸)에서 그 수가 갈 곳이 한 칸뿐 —
// 으로만 끝까지 채워지고, 완전 탐색으로도 답이 하나일 때만 낸다.

const sudokuLayoutCache = new Map();

// size × size 판을 size칸짜리 이어진 조각 size개로 나누는 모든 방법
function allRegionLayouts(size) {
  if (sudokuLayoutCache.has(size)) return sudokuLayoutCache.get(size);
  const n = size * size;
  const grid = Array(n).fill(-1);
  const layouts = [];
  const neighbors = (i) => {
    const r = Math.floor(i / size);
    const c = i % size;
    const out = [];
    if (r > 0) out.push(i - size);
    if (r < size - 1) out.push(i + size);
    if (c > 0) out.push(i - 1);
    if (c < size - 1) out.push(i + 1);
    return out;
  };
  const place = (region) => {
    const first = grid.indexOf(-1);
    if (first < 0) { layouts.push([...grid]); return; }
    // first를 품는 이어진 조각을 차례로 키운다(같은 조각을 두 번 세지 않게 칸 번호 집합으로 막음)
    const seen = new Set();
    const grow = (cells) => {
      const key = [...cells].sort((a, b) => a - b).join(",");
      if (seen.has(key)) return;
      seen.add(key);
      if (cells.length === size) {
        cells.forEach((i) => { grid[i] = region; });
        place(region + 1);
        cells.forEach((i) => { grid[i] = -1; });
        return;
      }
      const frontier = new Set();
      cells.forEach((i) => neighbors(i).forEach((j) => { if (grid[j] === -1 && !cells.includes(j) && j > first - 1) frontier.add(j); }));
      frontier.forEach((j) => grow([...cells, j]));
    };
    grow([first]);
  };
  place(0);
  sudokuLayoutCache.set(size, layouts);
  return layouts;
}

function regionIsLine(layout, size) {
  const groups = new Map();
  layout.forEach((g, i) => { if (!groups.has(g)) groups.set(g, []); groups.get(g).push(i); });
  return [...groups.values()].some((cells) => new Set(cells.map((i) => Math.floor(i / size))).size === 1 || new Set(cells.map((i) => i % size)).size === 1);
}

const SQUARE4 = [0, 0, 1, 1, 0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3];

function sudokuUnits(size, regions) {
  const units = [];
  for (let r = 0; r < size; r += 1) units.push({ name: `${r + 1}번째 가로줄`, cells: Array.from({ length: size }, (_, c) => r * size + c) });
  for (let c = 0; c < size; c += 1) units.push({ name: `${c + 1}번째 세로줄`, cells: Array.from({ length: size }, (_, r) => r * size + c) });
  if (regions) {
    const groups = new Map();
    regions.forEach((g, i) => { if (!groups.has(g)) groups.set(g, []); groups.get(g).push(i); });
    [...groups.values()].forEach((cells) => units.push({ name: "굵은 선 안", cells }));
  }
  return units;
}

function randomLatin(size, regions) {
  const units = sudokuUnits(size, regions);
  const peers = Array.from({ length: size * size }, (_, i) => new Set(units.filter((u) => u.cells.includes(i)).flatMap((u) => u.cells).filter((j) => j !== i)));
  const cells = Array(size * size).fill(0);
  const walk = (i) => {
    if (i === cells.length) return true;
    for (const v of shuffle(Array.from({ length: size }, (_, k) => k + 1))) {
      if ([...peers[i]].some((j) => cells[j] === v)) continue;
      cells[i] = v;
      if (walk(i + 1)) return true;
    }
    cells[i] = 0;
    return false;
  };
  return walk(0) ? cells : null;
}

function countFill(puzzle, size, regions, limit = 2) {
  const units = sudokuUnits(size, regions);
  const peers = Array.from({ length: size * size }, (_, i) => new Set(units.filter((u) => u.cells.includes(i)).flatMap((u) => u.cells).filter((j) => j !== i)));
  const cells = [...puzzle];
  let count = 0;
  const walk = () => {
    if (count >= limit) return;
    const i = cells.indexOf(0);
    if (i < 0) { count += 1; return; }
    for (let v = 1; v <= size; v += 1) {
      if ([...peers[i]].some((j) => cells[j] === v)) continue;
      cells[i] = v;
      walk();
      cells[i] = 0;
    }
  };
  walk();
  return count;
}

// 아이 생각 두 가지로 채워 보기. 채운 차례를 돌려준다.
function singlesFill(puzzle, size, regions) {
  const units = sudokuUnits(size, regions);
  const cells = [...puzzle];
  const peersOf = (i) => units.filter((u) => u.cells.includes(i)).flatMap((u) => u.cells);
  const cand = (i) => Array.from({ length: size }, (_, k) => k + 1).filter((v) => !peersOf(i).some((j) => j !== i && cells[j] === v));
  const log = [];
  for (let guard = 0; guard < 40 && cells.includes(0); guard += 1) {
    let moved = false;
    for (let i = 0; i < cells.length && !moved; i += 1) {
      if (cells[i]) continue;
      const c = cand(i);
      if (c.length === 1) { cells[i] = c[0]; log.push({ i, v: c[0], how: "cell" }); moved = true; }
    }
    for (let u = 0; u < units.length && !moved; u += 1) {
      for (let v = 1; v <= size && !moved; v += 1) {
        if (units[u].cells.some((i) => cells[i] === v)) continue;
        const spots = units[u].cells.filter((i) => !cells[i] && cand(i).includes(v));
        if (spots.length === 1) { cells[spots[0]] = v; log.push({ i: spots[0], v, how: "unit", unit: units[u].name }); moved = true; }
      }
    }
    if (!moved) break;
  }
  return { solved: !cells.includes(0), cells, log };
}

function makeFillBoard({ size, regions, clues }) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const solution = randomLatin(size, regions);
    if (!solution) continue;
    const puzzle = [...solution];
    for (const i of shuffle(Array.from({ length: size * size }, (_, k) => k))) {
      if (puzzle.filter(Boolean).length <= clues) break;
      const keep = puzzle[i];
      puzzle[i] = 0;
      if (countFill(puzzle, size, regions) !== 1 || !singlesFill(puzzle, size, regions).solved) puzzle[i] = keep;
    }
    const given = puzzle.filter(Boolean).length;
    if (given > clues + (size === 4 ? 1 : 0)) continue;
    const check = singlesFill(puzzle, size, regions);
    if (!check.solved || countFill(puzzle, size, regions) !== 1) continue;
    return { size, regions, puzzle, solution, log: check.log };
  }
  return null;
}

function sudokuSvg(board, { filled = false, label = "" } = {}) {
  const { size, regions } = board;
  const cell = size === 4 ? 40 : 44;
  const top = label ? 22 : 3;
  const left = 3;
  const W = left * 2 + size * cell;
  const H = top + size * cell + 3;
  let body = label ? text(left, 16, label, { size: 15, weight: 700, anchor: "start" }) : "";
  body += `<rect x="${left}" y="${top}" width="${size * cell}" height="${size * cell}" style="fill:#fff;stroke:none"/>`;
  const regionOf = (r, c) => (regions ? regions[r * size + c] : size === 4 ? SQUARE4[r * 4 + c] : -1);
  const boxed = regions || size === 4;
  // 칸 사이 선: 같은 조각이면 가는 점선, 다른 조각이면 굵은 선
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const x = left + c * cell;
      const y = top + r * cell;
      if (c < size - 1) {
        const thick = boxed && regionOf(r, c) !== regionOf(r, c + 1);
        body += `<line x1="${x + cell}" y1="${y}" x2="${x + cell}" y2="${y + cell}" style="stroke:${thick ? "#2f5a48" : "#8aa89a"};stroke-width:${thick ? 2.6 : 1}${thick || !boxed ? "" : ";stroke-dasharray:3 3"}"/>`;
      }
      if (r < size - 1) {
        const thick = boxed && regionOf(r, c) !== regionOf(r + 1, c);
        body += `<line x1="${x}" y1="${y + cell}" x2="${x + cell}" y2="${y + cell}" style="stroke:${thick ? "#2f5a48" : "#8aa89a"};stroke-width:${thick ? 2.6 : 1}${thick || !boxed ? "" : ";stroke-dasharray:3 3"}"/>`;
      }
      const i = r * size + c;
      const v = board.puzzle[i] || (filled ? board.solution[i] : 0);
      if (v) body += text(x + cell / 2, y + cell / 2 + 7, v, { size: 20, fill: board.puzzle[i] ? INK : "#2f6b4a", weight: board.puzzle[i] ? 400 : 700 });
    }
  }
  body += `<rect x="${left}" y="${top}" width="${size * cell}" height="${size * cell}" style="fill:none;stroke:#2f5a48;stroke-width:2.6"/>`;
  return svgWrap(W, H, body, `${size}칸 스도쿠 퍼즐`);
}

const gridText = (board) => Array.from({ length: board.size }, (_, r) => board.solution.slice(r * board.size, r * board.size + board.size).join(" ")).join(" / ");
const cellName = (board, i) => `${Math.floor(i / board.size) + 1}번째 줄 ${i % board.size + 1}번째 칸`;

function firstMoves(board) {
  return board.log.slice(0, 2).map((m) => (m.how === "cell"
    ? `${cellName(board, m.i)}에는 가로·세로${board.regions || board.size === 4 ? "·굵은 선 안" : ""}에 없는 수가 ${m.v}뿐입니다.`
    : `${m.unit}에서 ${eul(m.v)} 넣을 수 있는 칸은 ${cellName(board, m.i)}뿐입니다.`)).join(" ");
}

function sudokuFillProblem(boards, rule) {
  if (boards.some((b) => !b)) return null;
  const labels = boards.length > 1 ? boards.map((_, i) => `(${i + 1})`) : [""];
  const size = boards[0].size;
  return {
    prompt: `${rule} 스도쿠 퍼즐을 완성하세요.`,
    visual: { kind: "fig", html: boards.map((b, i) => sudokuSvg(b, { label: labels[i] })).join("") },
    responseKind: "visual-fill",
    answer: boards.map((b, i) => `${labels[i] ? `${labels[i]} ` : ""}${gridText(b)}`).join(", "),
    answerVisual: { kind: "fig", html: boards.map((b, i) => sudokuSvg(b, { label: labels[i], filled: true })).join("") },
    solution: boards.map((b, i) => `${labels[i] ? `${labels[i]} ` : ""}${firstMoves(b)} 이렇게 한 칸씩 채우면 ${gridText(b)}입니다.`).join(" "),
    meta: { size, boards: boards.map((b) => ({ puzzle: b.puzzle, solution: b.solution, regions: b.regions, clues: b.puzzle.filter(Boolean).length })) }
  };
}

function irregularLayout(size) {
  // 4×4: 줄 모양 조각·네모 배치는 빼고 고른다. 3×3: 세 조각이 모두 줄(가로줄·세로줄 그대로)인 배치만 뺀다
  // (3칸짜리 꺾인 조각 셋으로는 판을 채울 수 없어서 줄 조각 하나는 섞인다).
  const allLines = (layout) => {
    const groups = new Map();
    layout.forEach((g, i) => { if (!groups.has(g)) groups.set(g, []); groups.get(g).push(i); });
    return [...groups.values()].every((cells) => new Set(cells.map((i) => Math.floor(i / size))).size === 1 || new Set(cells.map((i) => i % size)).size === 1);
  };
  const layouts = allRegionLayouts(size).filter((layout) => (size === 4
    ? !regionIsLine(layout, size) && !layout.every((g, i) => g === SQUARE4[i])
    : !allLines(layout)));
  return pick(layouts);
}

const RULE3 = "가로줄과 세로줄에 1부터 3까지의 수가 한 번씩 들어가도록";
const RULE3R = "가로줄, 세로줄, 굵은 선으로 나누어진 부분에 1부터 3까지의 수가 한 번씩 들어가도록";
const RULE4 = "1, 2, 3, 4가 가로줄, 세로줄, 굵은 선으로 나누어진 부분에 각각 한 번씩만 들어가도록";

// 활동 2-1 · 연습 10: 3×3 가로·세로만, 두 판
function sudokuFillThreeRowColumn({ difficulty = 2 }) {
  return sudokuFillProblem([0, 1].map(() => makeFillBoard({ size: 3, regions: null, clues: difficulty === 3 ? 2 : 3 })), RULE3);
}

// 연습 9: 3×3 굵은 선(배치 여러 가지)
function sudokuFillThreeRegion({ difficulty = 2 }) {
  for (let t = 0; t < 20; t += 1) {
    const regions = irregularLayout(3);
    const board = makeFillBoard({ size: 3, regions, clues: difficulty === 1 ? 3 : 2 });
    if (board) return sudokuFillProblem([board], RULE3R);
  }
  return null;
}

// 활동 2-2·2-3 · 연습 11·12: 4×4 네모 굵은 칸
function sudokuFillFourSquare({ difficulty = 2 }) {
  const count = difficulty === 3 ? 2 : 1;
  return sudokuFillProblem(Array.from({ length: count }, () => makeFillBoard({ size: 4, regions: SQUARE4, clues: difficulty === 1 ? 8 : difficulty === 2 ? 6 : 5 })), RULE4);
}

// 활동 2-2·2-3(두 판)
function sudokuFillFourSquarePair({ difficulty = 2 }) {
  return sudokuFillProblem([0, 1].map(() => makeFillBoard({ size: 4, regions: SQUARE4, clues: difficulty === 1 ? 8 : difficulty === 2 ? 7 : 6 })), RULE4);
}

// 확인 2-1~2-4 · 연습 13·14 · 도전 3·4: 4×4 불규칙 굵은 칸(배치 여러 가지)
function sudokuFillFourIrregular({ difficulty = 2 }) {
  for (let t = 0; t < 20; t += 1) {
    const regions = irregularLayout(4);
    const board = makeFillBoard({ size: 4, regions, clues: difficulty === 1 ? 7 : difficulty === 2 ? 6 : 5 });
    if (board) return sudokuFillProblem([board], RULE4);
  }
  return null;
}

// ── 4단원 「약속」 — 가운데 수 없이 네 수가 놓인 그림 · 두 수로 두 결과 ────────────────
// 보기 그림 셋을 보고 규칙을 찾아 빈칸을 채운다. 후보 규칙을 모두 대 보아 보기 셋에 맞는 규칙이 하나뿐일 때만 낸다.

const NODE_POS = ["top", "right", "bottom", "left"];
const NODE_NAME = { top: "위", right: "오른쪽", bottom: "아래", left: "왼쪽" };
const NODE_WITH = { top: "위와", right: "오른쪽과", bottom: "아래와", left: "왼쪽과" };

// 네 수 규칙: test(v) — v = { top, right, bottom, left }
function fourNodeRules(withProduct) {
  const rules = [];
  NODE_POS.forEach((pos) => {
    const others = NODE_POS.filter((p) => p !== pos);
    rules.push({
      id: `sum-${pos}`,
      layouts: ["diamond", "cross"],
      test: (v) => v[pos] === others.reduce((t, p) => t + v[p], 0),
      say: `${NODE_NAME[pos]} 수는 나머지 세 수의 합입니다`,
      show: (v) => `${others.map((p) => v[p]).join(" + ")} = ${v[pos]}`
    });
  });
  [["top", "bottom", "left", "right"], ["top", "right", "bottom", "left"], ["top", "left", "right", "bottom"]].forEach(([a, b, c, d]) => {
    const cross = a === "top" && b === "bottom";
    rules.push({
      id: `pair-${a}${b}`,
      layouts: cross ? ["cross"] : ["diamond"],
      test: (v) => v[a] + v[b] === v[c] + v[d],
      say: `${NODE_WITH[a]} ${NODE_NAME[b]}의 합이 ${NODE_WITH[c]} ${NODE_NAME[d]}의 합과 같습니다`,
      show: (v) => `${v[a]} + ${v[b]} = ${v[c]} + ${v[d]}`
    });
  });
  if (withProduct) {
    rules.push({
      id: "product-cross",
      layouts: ["cross"],
      test: (v) => v.top * v.bottom === v.left * v.right,
      say: "위와 아래의 곱이 왼쪽과 오른쪽의 곱과 같습니다",
      show: (v) => `${v.top} × ${v.bottom} = ${v.left} × ${v.right}`
    });
  }
  return rules;
}

function makeFourNodeExample(rule, max) {
  for (let t = 0; t < 200; t += 1) {
    const v = Object.fromEntries(NODE_POS.map((p) => [p, randomInt(1, max)]));
    // 한 자리를 규칙으로 맞춘다
    const free = pick(NODE_POS);
    let found = null;
    for (let x = 1; x <= 60 && !found; x += 1) {
      const w = { ...v, [free]: x };
      if (rule.test(w)) found = w;
    }
    if (found && new Set(Object.values(found)).size >= 3) return found;
  }
  return null;
}

function fourNodeSvg(v, layout, blank) {
  const W = 132;
  const c = W / 2;
  const d = 44;
  const r = 17;
  const at = { top: [c, c - d], right: [c + d, c], bottom: [c, c + d], left: [c - d, c] };
  let body = "";
  if (layout === "cross") {
    body += `<line x1="${c}" y1="${c - d + r}" x2="${c}" y2="${c + d - r}" style="stroke:${LINE};stroke-width:1.6"/><line x1="${c - d + r}" y1="${c}" x2="${c + d - r}" y2="${c}" style="stroke:${LINE};stroke-width:1.6"/>`;
  } else {
    const order = ["top", "right", "bottom", "left", "top"];
    for (let i = 0; i < 4; i += 1) {
      const [x1, y1] = at[order[i]];
      const [x2, y2] = at[order[i + 1]];
      const len = Math.hypot(x2 - x1, y2 - y1);
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      body += `<line x1="${(x1 + ux * r).toFixed(1)}" y1="${(y1 + uy * r).toFixed(1)}" x2="${(x2 - ux * r).toFixed(1)}" y2="${(y2 - uy * r).toFixed(1)}" style="stroke:${LINE};stroke-width:1.6"/>`;
    }
  }
  NODE_POS.forEach((p) => {
    const [x, y] = at[p];
    const isBlank = p === blank;
    body += `<circle cx="${x}" cy="${y}" r="${r}" style="fill:${isBlank ? "#f6e4a8" : "#fff"};stroke:#4f7a66;stroke-width:1.4"/>`;
    if (!isBlank) body += text(x, y + 6, v[p], { size: String(v[p]).length > 1 ? 16 : 18 });
  });
  return svgWrap(W, W, body, isBlankLabel(blank));
}
const isBlankLabel = (blank) => (blank ? "규칙에 맞게 수를 써넣은 그림, 색칠된 칸이 빈칸" : "규칙에 맞게 수를 써넣은 그림");

// 활동 1-1 · 확인 1-4 · 연습 1·2·4: 가운데 없는 네 점, 빈칸이 점
function fourNodeRelation({ difficulty = 2 }) {
  const max = difficulty === 1 ? 9 : difficulty === 2 ? 15 : 12;
  const rules = fourNodeRules(difficulty === 3);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const rule = pick(difficulty === 3 ? rules : rules.filter((r) => r.id !== "product-cross"));
    const layout = pick(rule.layouts);
    const items = [0, 1, 2, 3].map(() => makeFourNodeExample(rule, max));
    if (items.some((v) => !v)) continue;
    if (Math.max(...items.flatMap((v) => Object.values(v))) > (difficulty === 1 ? 30 : 50)) continue;
    const shown = items.slice(0, 3);
    // 보기 셋에 맞는 규칙이 이 규칙 하나뿐
    if (rules.filter((r) => shown.every((v) => r.test(v))).length !== 1) continue;
    const last = items[3];
    const blank = pick(NODE_POS);
    // 빈칸 값은 이 규칙으로 하나만 나온다
    const fits = [];
    for (let x = 0; x <= 99; x += 1) if (rule.test({ ...last, [blank]: x })) fits.push(x);
    if (fits.length !== 1 || fits[0] !== last[blank]) continue;
    const html = [...shown.map((v) => fourNodeSvg(v, layout, null)), fourNodeSvg(last, layout, blank)].join("");
    const answer = last[blank];
    return {
      prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 색칠된 빈칸에 알맞은 수를 구하세요.",
      visual: { kind: "fig", html },
      answer: String(answer),
      solution: `세 그림에서 ${rule.say}(${shown.map(rule.show).join(", ")}). 마지막 그림도 같은 규칙이므로 ${rule.show(last)}에서 빈칸은 ${answer}입니다.`,
      meta: { kindLabel: "four-node", rule: rule.id, layout, items, blank, answer }
    };
  }
  return null;
}

// 두 수(a, b)로 만드는 결과들. 두 자리 수 「ab」는 a를 십의 자리, b를 일의 자리에 놓은 수.
const PAIR_FORMS = Object.freeze([
  { id: "ab+sum", calc: (a, b) => 10 * a + b + a + b, say: "두 수로 만든 두 자리 수에 두 수의 합을 더한 수", show: (a, b) => `${10 * a + b} + ${a + b}`, big: true },
  { id: "ab-sum", calc: (a, b) => 10 * a + b - (a + b), say: "두 수로 만든 두 자리 수에서 두 수의 합을 뺀 수", show: (a, b) => `${10 * a + b} - ${a + b}`, big: true },
  { id: "ab+ba", calc: (a, b) => 10 * a + b + 10 * b + a, say: "두 수로 만든 두 자리 수와 자리를 바꾼 수의 합", show: (a, b) => `${10 * a + b} + ${10 * b + a}`, big: true },
  { id: "ab+a", calc: (a, b) => 10 * a + b + a, say: "두 수로 만든 두 자리 수에 왼쪽 수를 더한 수", show: (a, b) => `${10 * a + b} + ${a}`, big: true },
  { id: "ab+b", calc: (a, b) => 10 * a + b + b, say: "두 수로 만든 두 자리 수에 오른쪽 수를 더한 수", show: (a, b) => `${10 * a + b} + ${b}`, big: true },
  { id: "sum", calc: (a, b) => a + b, say: "두 수의 합", show: (a, b) => `${a} + ${b}` },
  { id: "diff", calc: (a, b) => Math.abs(a - b), say: "큰 수에서 작은 수를 뺀 수", show: (a, b) => `${Math.max(a, b)} - ${Math.min(a, b)}` },
  { id: "double-sum", calc: (a, b) => 2 * (a + b), say: "두 수의 합을 두 번 더한 수", show: (a, b) => `${a + b} + ${a + b}` },
  { id: "product", calc: (a, b) => a * b, say: "두 수의 곱", show: (a, b) => `${a} × ${b}`, product: true }
]);

function pairBoxSvg(a, b, r1, r2, marks) {
  const w = 92;
  const h = 32;
  let body = "";
  const cell = (x, y, cw, value, blank) => {
    body += `<rect x="${x}" y="${y}" width="${cw}" height="${h}" style="fill:${blank ? "#f6e4a8" : "#fff"};stroke:#4f7a66;stroke-width:1.3"/>`;
    body += text(x + cw / 2, y + h / 2 + 6.5, value, { size: 17, fill: blank ? "#8a6413" : INK });
  };
  cell(2, 2, w / 2, a);
  cell(2 + w / 2, 2, w / 2, b);
  cell(2, 2 + h, w, marks ? MARKS[0] : r1, !!marks);
  cell(2, 2 + h * 2, w, marks ? MARKS[1] : r2, !!marks);
  return svgWrap(w + 4, h * 3 + 4, body, marks ? "약속으로 수를 써넣은 그림, ㉠과 ㉡이 빈칸" : "약속으로 수를 써넣은 그림");
}

// 확인 1-2 · 연습 8: 위 두 수 → 아래 두 결과(㉠ 두 자리 수로 만든 결과, ㉡ 두 수로 한 계산)
function digitPairTwoResults({ difficulty = 2 }) {
  const bigs = PAIR_FORMS.filter((f) => f.big);
  const smalls = PAIR_FORMS.filter((f) => !f.big && (difficulty >= 2 || !f.product));
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const f1 = pick(difficulty === 1 ? bigs.filter((f) => ["ab+sum", "ab+a", "ab+b"].includes(f.id)) : bigs);
    const f2 = pick(smalls);
    const pairs = [];
    while (pairs.length < 4) {
      const a = randomInt(1, 9);
      const b = randomInt(1, 9);
      if (a === b || pairs.some(([x, y]) => x === a && y === b)) continue;
      pairs.push([a, b]);
    }
    const values = pairs.map(([a, b]) => [f1.calc(a, b), f2.calc(a, b)]);
    if (values.some(([x, y]) => x <= 0 || y <= 0)) continue;
    const shown = pairs.slice(0, 3);
    const only = (row) => PAIR_FORMS.filter((f) => shown.every(([a, b], i) => f.calc(a, b) === values[i][row]));
    if (only(0).length !== 1 || only(1).length !== 1) continue;
    const [a, b] = pairs[3];
    const [r1, r2] = values[3];
    const html = [...shown.map(([x, y], i) => pairBoxSvg(x, y, values[i][0], values[i][1], false)), pairBoxSvg(a, b, 0, 0, true)].join("");
    return {
      prompt: "다음 도형은 어떤 약속에 따라 수를 써넣은 것입니다. ㉠과 ㉡에 들어갈 수를 각각 구하세요.",
      visual: { kind: "fig", html },
      answer: `㉠ ${r1}, ㉡ ${r2}`,
      solution: `가운데 칸은 ${f1.say}이고(${shown.map(([x, y], i) => `${f1.show(x, y)} = ${values[i][0]}`).join(", ")}), 아래 칸은 ${f2.say}입니다(${shown.map(([x, y], i) => `${f2.show(x, y)} = ${values[i][1]}`).join(", ")}). 그래서 ㉠ = ${f1.show(a, b)} = ${r1}, ㉡ = ${f2.show(a, b)} = ${r2}입니다.`,
      meta: { kindLabel: "digit-pair-two", forms: [f1.id, f2.id], pairs, values, answer: [r1, r2] }
    };
  }
  return null;
}

// ── 3단원 「규칙찾기와 수열」 ────────────────────────────────────────

// 수열 한 줄(빈칸은 색칠한 칸, 끝은 「…」)
function sequenceRowSvg(items, label) {
  const cw = 34;
  const gap = 5;
  const left = label ? 34 : 2;
  const width = left + items.length * (cw + gap) + 22;
  let body = label ? text(4, 23, label, { size: 15, weight: 700, anchor: "start" }) : "";
  items.forEach((v, i) => {
    const x = left + i * (cw + gap);
    const blank = v === null;
    body += `<rect x="${x}" y="4" width="${cw}" height="28" rx="3" style="fill:${blank ? "#f6e4a8" : "#fff"};stroke:${LINE};stroke-width:1.2"/>`;
    if (!blank) body += text(x + cw / 2, 24, v, { size: String(v).length > 2 ? 14 : 16 });
  });
  body += text(left + items.length * (cw + gap) + 8, 24, "…", { size: 16 });
  return svgWrap(width, 36, body, "수열");
}

function sequenceProblem(parts, intro) {
  const labels = parts.length > 1 ? parts.map((_, i) => `(${i + 1})`) : [""];
  return {
    prompt: `${intro} 규칙을 찾아 색칠된 빈칸에 알맞은 수를 구하세요.`,
    visual: { kind: "fig", html: parts.map((p, i) => sequenceRowSvg(p.items, labels[i])).join("") },
    answer: parts.map((p, i) => `${labels[i] ? `${labels[i]} ` : ""}${p.answers.join(", ")}`).join(", "),
    solution: parts.map((p, i) => `${labels[i] ? `${labels[i]} ` : ""}${p.say} 그래서 빈칸은 ${p.answers.join(", ")}입니다.`).join(" "),
    meta: { parts: parts.map((p) => ({ full: p.full, blanks: p.blanks, answers: p.answers, rule: p.rule })) }
  };
}

function withBlanks(full, positions) {
  return { items: full.map((v, i) => (positions.includes(i) ? null : v)), answers: positions.map((i) => full[i]), blanks: positions, full };
}

// 세 개씩 묶음: 묶음 안에서는 같은 수만큼 줄거나 늘고, 다음 묶음은 첫 수가 일정하게 바뀐다
function tripleGroupPart(difficulty) {
  for (let t = 0; t < 50; t += 1) {
    const inner = pick(difficulty === 1 ? [-1, 1] : [-1, -2, 1, 2, 3]);
    const shift = pick(difficulty === 1 ? [3, 4, 5] : [1, 2, 3, 4, 5, 6, -1]);
    if (shift === inner) continue;
    const start = randomInt(inner < 0 ? 6 : 1, inner < 0 ? 15 : 9);
    const full = [];
    for (let g = 0; g < 4; g += 1) for (let k = 0; k < 3; k += 1) full.push(start + g * shift + k * inner);
    if (full.some((v) => v <= 0 || v > 60)) continue;
    // 빈칸은 셋째 묶음 뒤에 하나(어려우면 둘)
    const positions = difficulty === 3 ? [randomInt(9, 11), randomInt(6, 8)].sort((a, b) => a - b) : [randomInt(9, 11)];
    const part = withBlanks(full, positions);
    part.say = `세 개씩 묶으면 묶음 안에서는 ${Math.abs(inner)}씩 ${inner < 0 ? "작아지고" : "커지고"}, 묶음의 첫 수는 ${Math.abs(shift)}씩 ${shift < 0 ? "작아집니다" : "커집니다"}(${[0, 3, 6].map((i) => full[i]).join(", ")}, …).`;
    part.rule = `triple:${inner}:${shift}`;
    return part;
  }
  return null;
}

// 확인 1-2 · 연습 7: 세 개씩 묶음 수열 두 줄
function groupedTripleSequence({ difficulty = 2 }) {
  const parts = [tripleGroupPart(difficulty), tripleGroupPart(difficulty)];
  if (parts.some((p) => !p) || parts[0].rule === parts[1].rule) return null;
  return sequenceProblem(parts, "다음은 어떤 규칙에 따라 수를 늘어놓은 것입니다.");
}

// 확인 1-3: (1) 세 수 묶음이 하나씩 밀려 나가는 수열 (2) 수 n을 n번(또는 같은 횟수씩) 되풀이하는 수열
function slidingAndRepeatSequence({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : pick([3, 4]);
  const start = randomInt(1, 4);
  const slide = [];
  for (let g = 0; g < 4; g += 1) for (let k = 0; k < size; k += 1) slide.push(start + g + k);
  const first = withBlanks(slide, [randomInt(size * 2, size * 3 - 1)]);
  first.say = `${size}개씩 묶으면 (${slide.slice(0, size).join(", ")}), (${slide.slice(size, size * 2).join(", ")}), …처럼 묶음마다 모든 수가 1씩 커집니다.`;
  first.rule = `slide:${size}`;
  const base = randomInt(1, difficulty === 3 ? 3 : 2);
  const sameTimes = difficulty >= 2 && Math.random() < 0.4 ? pick([2, 3]) : 0;
  const numStep = sameTimes ? pick([1, 2]) : 1;
  const repeat = [];
  for (let n = base, j = 0; repeat.length < 16; n += numStep, j += 1) {
    const times = sameTimes || j + 1;
    for (let k = 0; k < times && repeat.length < 16; k += 1) repeat.push(n);
  }
  // 빈칸 둘: 반복이 바뀌는 언저리 하나와 그 뒤 하나
  const from = 8;
  const a = randomInt(from, 11);
  const b = randomInt(a + 2, 14);
  const second = withBlanks(repeat, [a, b]);
  second.say = sameTimes
    ? `같은 수를 ${sameTimes}번씩 쓰고, 다음 수는 ${numStep}만큼 큽니다.`
    : base === 1 ? "1은 1번, 2는 2번, 3은 3번처럼 수를 그 수만큼 씁니다." : `${eun(base)} 1번, ${eun(base + 1)} 2번, ${eun(base + 2)} 3번처럼 한 번씩 더 많이 씁니다.`;
  second.rule = `repeat:${base}:${sameTimes}:${numStep}`;
  return sequenceProblem([first, second], "다음은 어떤 규칙에 따라 수를 늘어놓은 것입니다.");
}

// 확인 1-1: 두 수열이 번갈아 놓인 수열 — 한 줄은 한 가닥이 두 배씩, 다른 줄은 두 가닥이 다른 수만큼 커짐
function interleavedDoublingSequence({ difficulty = 2 }) {
  // (1) 한 가닥은 일정하게 커지고, 다른 가닥은 두 배씩
  const addStart = randomInt(1, 5);
  const addStep = pick([1, 2, 3]);
  const dblStart = pick([1, 2, 3]);
  const doubleOdd = Math.random() < 0.4; // 두 배 가닥이 홀수 번째(1·3·5번째)
  const firstSeq = [];
  for (let i = 0; i < 12; i += 1) {
    const k = Math.floor(i / 2);
    const isDouble = (i % 2 === 0) === doubleOdd;
    firstSeq.push(isDouble ? dblStart * 2 ** k : addStart + k * addStep);
  }
  if (firstSeq.some((v) => v > 200)) return null;
  const posA = [randomInt(8, 10)];
  if (difficulty === 3) posA.push(11);
  const p1 = withBlanks(firstSeq, posA);
  p1.say = `${doubleOdd ? "짝수" : "홀수"} 번째 수는 ${addStep}씩 커지고, ${doubleOdd ? "홀수" : "짝수"} 번째 수는 앞의 수를 두 번 더한 수(두 배)가 됩니다.`;
  p1.rule = `double:${addStep}`;
  // (2) 두 가닥이 다른 수만큼 커짐
  const s1 = randomInt(2, 6);
  const d1 = pick([2, 3, 4]);
  const d2 = pick([3, 4, 5].filter((d) => d !== d1));
  const s2 = s1 + randomInt(1, 3);
  const two = [];
  for (let i = 0; i < 12; i += 1) two.push(i % 2 === 0 ? s1 + (i / 2) * d1 : s2 + ((i - 1) / 2) * d2);
  const p2 = withBlanks(two, [randomInt(7, 10)]);
  p2.say = `홀수 번째 수는 ${d1}씩, 짝수 번째 수는 ${d2}씩 커집니다.`;
  p2.rule = `two:${d1}:${d2}`;
  return sequenceProblem([p1, p2], "다음은 두 수열을 번갈아 늘어놓은 것입니다.");
}

// ── 3단원 그림 수열 ──

function stageTableSvg(rowLabel, values, count) {
  const cw = 44;
  const head = 96;
  const width = head + count * cw + 4;
  let body = "";
  const cellRow = (y, label, getter, fill) => {
    body += `<rect x="2" y="${y}" width="${head}" height="30" style="fill:${fill};stroke:${LINE};stroke-width:1.1"/>${text(2 + head / 2, y + 20, label, { size: 14 })}`;
    for (let i = 0; i < count; i += 1) {
      const v = getter(i);
      body += `<rect x="${2 + head + i * cw}" y="${y}" width="${cw}" height="30" style="fill:${fill};stroke:${LINE};stroke-width:1.1"/>`;
      if (v != null) body += text(2 + head + i * cw + cw / 2, y + 20, v, { size: 15 });
    }
  };
  cellRow(2, "순서", (i) => i + 1, SOFT);
  cellRow(32, rowLabel, (i) => (i < values.length ? values[i] : null), "#fff");
  return svgWrap(width, 64, body, `${rowLabel} 표`);
}

function treeSvg(stage, branches) {
  const size = 120;
  let body = "";
  const draw = (x, y, angle, len, depth) => {
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    body += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:#3b5b4c;stroke-width:1.6;stroke-linecap:round"/>`;
    if (depth >= stage) return;
    const spread = branches === 2 ? [-0.62, 0.62] : [-0.85, 0, 0.85];
    spread.forEach((d) => draw(x2, y2, angle + d, len * 0.62, depth + 1));
  };
  draw(size / 2, size - 8, -Math.PI / 2, 34, 1);
  return size ? svgWrap(size, size, body, `${stage}번째 그림`) : "";
}

function nestedCircleSvg(stage, k) {
  const R = 52;
  let body = "";
  const draw = (cx, cy, r, depth) => {
    body += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" style="fill:none;stroke:#3b5b4c;stroke-width:${depth === 1 ? 1.4 : 1}"/>`;
    if (depth >= stage) return;
    const rr = r / k;
    for (let i = 0; i < k; i += 1) draw(cx - r + rr + i * 2 * rr, cy, rr, depth + 1);
  };
  draw(R + 3, R + 3, R, 1);
  return svgWrap(R * 2 + 6, R * 2 + 6, body, `${stage}번째 모양`);
}

function captioned(svg, caption) {
  return `<figure style="margin:0;display:flex;flex-direction:column;align-items:center;gap:4px">${svg}<figcaption style="font-size:14px">${caption}</figcaption></figure>`;
}

const ORD = ["첫", "두", "세", "네", "다섯"];

// 연습 17: 끝마다 가지를 쳐 나가는 선분(가지 수는 2 또는 3)
function branchingSegmentGrowth({ difficulty = 2 }) {
  const branches = difficulty === 3 ? pick([2, 3]) : 2;
  const target = branches === 2 ? randomInt(difficulty === 1 ? 4 : 5, difficulty === 1 ? 6 : 7) : randomInt(4, 5);
  const total = (n) => (branches ** n - 1) / (branches - 1);
  const shown = branches === 2 ? 4 : 3;
  const html = [...Array.from({ length: shown }, (_, i) => captioned(treeSvg(i + 1, branches), `${ORD[i]} 번째`)), stageTableSvg("선분의 개수", [1, total(2)], target)].join("");
  const new_ = (n) => branches ** (n - 1);
  const adds = Array.from({ length: target }, (_, i) => new_(i + 1));
  const askNew = Math.random() < 0.35;
  const answer = askNew ? new_(target) : total(target);
  return {
    prompt: askNew
      ? `다음과 같은 규칙으로 선을 그려 나갈 때, ${target}번째 그림에서 새로 그린 선분은 몇 개인지 구하세요.`
      : `다음과 같은 규칙으로 선을 그려 나갈 때, ${target}번째 그림에는 선분이 모두 몇 개 있는지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}개`,
    solution: askNew
      ? `새로 그리는 선분은 앞에서 새로 그린 선분의 끝마다 ${branches}개씩이므로 ${adds.join(", ")}개로 ${branches}배씩 늘어납니다. 그래서 ${target}번째 그림에서 새로 그린 선분은 ${answer}개입니다.`
      : `새로 그리는 선분은 앞에서 새로 그린 선분의 끝마다 ${branches}개씩이므로 ${adds.join(", ")}개씩 늘어납니다. 모두 더하면 ${adds.join(" + ")} = ${answer}개입니다.`,
    meta: { branches, target, askNew, answer }
  };
}

// 도전 2: 큰 원 안에 작은 원을 그려 넣는 모양 — 가장 작은 원마다 안에 원을 k개씩
function nestedCircleDoubling({ difficulty = 2 }) {
  const k = difficulty === 3 ? pick([2, 3]) : 2;
  const target = k === 2 ? randomInt(difficulty === 1 ? 4 : 5, 6) : randomInt(4, 5);
  const total = (n) => (k ** n - 1) / (k - 1);
  const shown = k === 2 ? 4 : 3;
  const html = [...Array.from({ length: shown }, (_, i) => captioned(nestedCircleSvg(i + 1, k), `${ORD[i]} 번째`)), stageTableSvg("원의 개수", [1, total(2)], target)].join("");
  const adds = Array.from({ length: target }, (_, i) => k ** i);
  const askSmall = Math.random() < 0.35;
  const answer = askSmall ? adds.at(-1) : total(target);
  return {
    prompt: askSmall
      ? `다음과 같은 규칙으로 큰 원 안에 작은 원을 그립니다. ${target}번째 모양에서 가장 작은 원은 몇 개인지 구하세요.`
      : `다음과 같은 규칙으로 큰 원 안에 작은 원을 그립니다. ${target}번째 모양에서 찾을 수 있는 원은 모두 몇 개인지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}개`,
    solution: askSmall
      ? `두 번째부터는 가장 작은 원마다 그 안에 원을 ${k}개씩 그리므로 가장 작은 원은 ${adds.join(", ")}개로 ${k}배씩 늘어납니다. 그래서 ${target}번째 모양의 가장 작은 원은 ${answer}개입니다.`
      : `두 번째부터는 가장 작은 원마다 그 안에 원을 ${k}개씩 그리므로 새로 생기는 원은 ${adds.join(", ")}개입니다. 그래서 ${target}번째 모양의 원은 ${adds.join(" + ")} = ${answer}개입니다.`,
    meta: { k, target, askSmall, answer }
  };
}

// 연습 14: 정사각형 판의 대각선 띠는 검은 돌, 나머지는 흰 돌. 단계마다 한 변이 1개씩 늘어난다.
function diagonalBandStoneGrowth({ difficulty = 2 }) {
  const offsets = pick(difficulty === 1 ? [[0], [0, 1]] : [[0, 1], [0, -1], [-1, 0, 1], [0, 1, 2]]);
  const startSide = randomInt(2, 3) + (offsets.length === 3 ? 1 : 0);
  const target = randomInt(4, difficulty === 3 ? 7 : 6);
  const askWhite = Math.random() < 0.6;
  const sideAt = (n) => startSide + n - 1;
  const blackAt = (n) => offsets.reduce((t, o) => t + sideAt(n) - Math.abs(o), 0);
  const whiteAt = (n) => sideAt(n) ** 2 - blackAt(n);
  const isBlack = (r, c) => offsets.includes(r - c);
  const board = (n) => {
    const s = sideAt(n);
    const step = 15;
    let body = "";
    for (let r = 0; r < s; r += 1) for (let c = 0; c < s; c += 1) {
      body += `<circle cx="${8 + c * step}" cy="${8 + r * step}" r="6.3" style="fill:${isBlack(r, c) ? "#1f1f1f" : "#fff"};stroke:#1f1f1f;stroke-width:1"/>`;
    }
    return svgWrap(s * step + 2, s * step + 2, body, `${n}단계 바둑돌`);
  };
  const html = [1, 2, 3].map((n) => captioned(board(n), `${n}단계`)).join("");
  const s = sideAt(target);
  const answer = askWhite ? whiteAt(target) : blackAt(target);
  const blackLines = offsets.map((o) => s - Math.abs(o));
  return {
    prompt: `다음과 같은 규칙으로 검은 바둑돌과 흰 바둑돌을 늘어놓았습니다. ${target}단계에서 ${askWhite ? "흰" : "검은"} 바둑돌은 몇 개인지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}개`,
    solution: `단계마다 한 줄에 놓이는 돌이 1개씩 늘어나므로 ${target}단계는 한 줄에 ${s}개씩 ${s}줄, 모두 ${s * s}개입니다. 검은 돌은 ${blackLines.length === 1 ? `비스듬한 한 줄에 ${blackLines[0]}개` : `비스듬한 줄마다 ${blackLines.join(", ")}개이므로 ${blackLines.join(" + ")} = ${blackAt(target)}개`}${askWhite ? `이고, 흰 돌은 ${s * s} - ${blackAt(target)} = ${whiteAt(target)}개` : ""}입니다.`,
    meta: { offsets, startSide, target, askWhite, black: blackAt(target), white: whiteAt(target), answer }
  };
}

// 도전 1: 검은 돌·흰 돌을 1개, 2개, 3개 … 씩 번갈아 늘어놓은 줄에서 모두 N개일 때 어느 색이 몇 개 더 많은지
function alternatingRunStoneTotal({ difficulty = 2 }) {
  for (let t = 0; t < 50; t += 1) {
    const firstBlack = Math.random() < 0.6;
    const startRun = difficulty === 1 ? pick([1, 2]) : difficulty === 2 ? pick([1, 2, 2]) : pick([2, 3]);
    const total = randomInt(difficulty === 1 ? 15 : 25, difficulty === 3 ? 60 : 45);
    let black = 0;
    let white = 0;
    const runs = [];
    let left = total;
    for (let run = startRun, i = 0; left > 0; run += 1, i += 1) {
      const n = Math.min(run, left);
      const isBlack = (i % 2 === 0) === firstBlack;
      if (isBlack) black += n; else white += n;
      runs.push({ n, isBlack, full: n === run });
      left -= n;
    }
    if (black === white) continue;
    // 마지막 묶음이 다 채워지지 않은 경우를 섞는다
    if (difficulty >= 2 && runs.at(-1).full && Math.random() < 0.6) continue;
    const stones = [];
    for (let run = startRun, i = 0; stones.length < 15; run += 1, i += 1) {
      const isBlack = (i % 2 === 0) === firstBlack;
      for (let k = 0; k < run && stones.length < 15; k += 1) stones.push(isBlack);
    }
    const step = 19;
    let body = stones.map((b, i) => `<circle cx="${10 + i * step}" cy="11" r="8" style="fill:${b ? "#1f1f1f" : "#fff"};stroke:#1f1f1f;stroke-width:1"/>`).join("");
    body += text(10 + stones.length * step + 4, 16, "…", { size: 16, anchor: "start" });
    const more = black > white ? "검은 돌" : "흰 돌";
    const diff = Math.abs(black - white);
    const runText = runs.map((r) => `${r.isBlack ? "검" : "흰"}${r.n}`).join(", ");
    return {
      prompt: `흰 바둑돌과 검은 바둑돌을 다음과 같이 규칙을 정하여 늘어놓았습니다. 늘어놓은 바둑돌이 모두 ${total}개라면 검은 돌과 흰 돌 중에서 어느 돌이 몇 개 더 많은지 구하세요.`,
      visual: { kind: "fig", html: svgWrap(stones.length * step + 28, 22, body, "바둑돌 줄") },
      answer: `${more}, ${diff}개`,
      solution: `같은 색 돌이 ${startRun}개, ${startRun + 1}개, ${startRun + 2}개, …처럼 하나씩 더 많이 놓이고 색이 번갈아 바뀝니다. ${total}개까지 묶음을 적으면 ${runText}(마지막 묶음은 ${runs.at(-1).full ? "다 채워짐" : "모자란 만큼만"})입니다. 검은 돌 ${black}개, 흰 돌 ${white}개이므로 ${more}이 ${diff}개 더 많습니다.`,
      meta: { firstBlack, startRun, total, black, white, answer: { more, diff } }
    };
  }
  return null;
}

// ── 3단원 남은 번호(2026-11-27) ─────────────────────────────────────

// 표 두 줄: 머리 줄(이름 + 1, 2, 3 …)과 값 줄(값 또는 빈칸)
function twoRowTableSvg(headLabel, count, rowLabel, values) {
  const cw = 40;
  const head = 104;
  const width = head + count * cw + 4;
  let body = "";
  const cellRow = (y, label, getter, fill) => {
    body += `<rect x="2" y="${y}" width="${head}" height="30" style="fill:${fill};stroke:${LINE};stroke-width:1.1"/>${text(2 + head / 2, y + 20, label, { size: 13 })}`;
    for (let i = 0; i < count; i += 1) {
      const v = getter(i);
      body += `<rect x="${2 + head + i * cw}" y="${y}" width="${cw}" height="30" style="fill:${fill};stroke:${LINE};stroke-width:1.1"/>`;
      if (v != null) body += text(2 + head + i * cw + cw / 2, y + 20, v, { size: 15 });
    }
  };
  cellRow(2, headLabel, (i) => i + 1, SOFT);
  cellRow(32, rowLabel, (i) => values[i] ?? null, "#fff");
  return svgWrap(width, 64, body, `${rowLabel} 표`);
}

// 활동 1-1 · 연습 2: 반복마디의 길이가 서로 다른 수열 세 줄
function repeatingPart(period) {
  for (let t = 0; t < 40; t += 1) {
    const cycle = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, period);
    const shownLength = period * randomInt(2, 3) + randomInt(0, period - 1);
    if (shownLength < period * 2 + 1 || shownLength > 15) continue;
    const full = Array.from({ length: shownLength + 1 }, (_, i) => cycle[i % period]);
    const part = withBlanks(full, [shownLength]);
    part.say = `${cycle.join(", ")}의 ${period}개가 차례로 되풀이됩니다.`;
    part.rule = `repeat:${period}`;
    return part;
  }
  return null;
}

function repeatingSequenceThreeParts({ difficulty = 2 }) {
  const periods = difficulty === 1 ? [3, pick([3, 4]), 4] : difficulty === 2 ? [3, 4, pick([5, 6])] : [4, pick([5, 6]), 6];
  const parts = periods.map(repeatingPart);
  if (parts.some((p) => !p)) return null;
  return sequenceProblem(parts, "다음은 어떤 규칙에 따라 수를 늘어놓은 것입니다.");
}

// 활동 1-2 · 연습 3: 검은 돌·흰 돌이 묶음 단위로 되풀이되는 줄에서 다음 돌
function stoneRowSvg(stones, label) {
  const step = 18;
  const left = label ? 34 : 4;
  const width = left + stones.length * step + 58;
  let body = label ? text(4, 18, label, { size: 15, weight: 700, anchor: "start" }) : "";
  stones.forEach((b, i) => {
    body += `<circle cx="${left + 8 + i * step}" cy="13" r="7.5" style="fill:${b ? "#1f1f1f" : "#fff"};stroke:#1f1f1f;stroke-width:1"/>`;
  });
  const bx = left + stones.length * step + 4;
  body += `<rect x="${bx}" y="1" width="26" height="24" rx="4" style="fill:#f6e4a8;stroke:${LINE};stroke-width:1.2"/>`;
  body += text(bx + 32, 18, "…", { size: 15, anchor: "start" });
  return svgWrap(width, 28, body, "바둑돌 줄, 끝의 색칠한 칸이 빈칸");
}

function stoneRunPart(difficulty) {
  for (let t = 0; t < 80; t += 1) {
    const runCount = difficulty === 1 ? 2 : pick([2, 3, 4]);
    const runs = Array.from({ length: runCount * 2 }, () => randomInt(1, difficulty === 1 ? 3 : 3));
    const block = [];
    runs.forEach((n, i) => { for (let k = 0; k < n; k += 1) block.push(i % 2 === 0); });
    const period = block.length;
    if (period < 4 || period > 8) continue;
    // 더 짧은 마디로 되풀이되면 다시
    if ([...Array(period).keys()].slice(1).some((p) => period % p === 0 && block.every((v, i) => v === block[i % p]))) continue;
    const offset = randomInt(0, period - 1);
    const shown = Math.min(17, Math.max(period * 2 + 1, 14));
    const seq = Array.from({ length: shown + 1 }, (_, i) => block[(i + offset) % period]);
    const groups = [];
    for (let i = 0; i < period; i += 1) {
      const v = block[(i + offset) % period];
      if (groups.length && groups.at(-1).v === v) groups.at(-1).n += 1; else groups.push({ v, n: 1 });
    }
    return {
      stones: seq.slice(0, shown),
      answer: seq[shown] ? "검은 돌" : "흰 돌",
      say: `${groups.map((g) => `${g.v ? "검은 돌" : "흰 돌"} ${g.n}개`).join(", ")}가 한 묶음으로 되풀이됩니다(${period}개씩).`,
      key: block.map(Number).join("") + offset
    };
  }
  return null;
}

function stoneRunPattern({ difficulty = 2 }) {
  const parts = [stoneRunPart(difficulty), stoneRunPart(difficulty)];
  if (parts.some((p) => !p) || parts[0].key === parts[1].key) return null;
  return {
    prompt: "바둑돌을 일정한 규칙으로 늘어놓았습니다. 규칙을 찾아 색칠된 칸에 알맞은 바둑돌을 구하세요.",
    visual: { kind: "fig", html: parts.map((p, i) => stoneRowSvg(p.stones, `(${i + 1})`)).join("") },
    answer: parts.map((p, i) => `(${i + 1}) ${p.answer}`).join(", "),
    solution: parts.map((p, i) => `(${i + 1}) ${p.say} 그래서 색칠된 칸은 ${p.answer}입니다.`).join(" "),
    meta: { parts: parts.map((p) => ({ stones: p.stones, answer: p.answer })) }
  };
}

// 활동 2-1 · 2-2: 성냥개비로 모양을 이어 만들 때 표를 채우고 N개에 필요한 개수
function matchstickSvg(shape, n) {
  const u = 26;
  const pad = 6;
  const roof = shape === "house" ? Math.round(u * 0.75) : 0;
  const sticks = [];
  if (shape === "square") {
    for (let i = 0; i < n; i += 1) sticks.push([i * u, 0, (i + 1) * u, 0], [i * u, u, (i + 1) * u, u]);
    for (let i = 0; i <= n; i += 1) sticks.push([i * u, 0, i * u, u]);
  } else if (shape === "house") {
    for (let i = 0; i < n; i += 1) sticks.push([i * u, roof, i * u + u / 2, 0], [i * u + u / 2, 0, (i + 1) * u, roof], [i * u, roof + u, (i + 1) * u, roof + u]);
    for (let i = 0; i <= n; i += 1) sticks.push([i * u, roof, i * u, roof + u]);
  } else if (shape === "hexagon") {
    const sd = u * 0.62;
    const hw = sd * 0.866;
    const pts = (i) => {
      const cx = hw + i * 2 * hw;
      return [[cx, 0], [cx + hw, sd / 2], [cx + hw, sd * 1.5], [cx, sd * 2], [cx - hw, sd * 1.5], [cx - hw, sd / 2]];
    };
    for (let i = 0; i < n; i += 1) {
      const p = pts(i);
      [[0, 1], [1, 2], [2, 3], [3, 4], [5, 0]].forEach(([a, b]) => sticks.push([p[a][0], p[a][1], p[b][0], p[b][1]]));
      if (i === 0) sticks.push([p[4][0], p[4][1], p[5][0], p[5][1]]);
    }
  } else {
    const h = Math.round(u * 0.87);
    const vx = (j) => (j % 2 === 0 ? (j / 2) * u : ((j - 1) / 2) * u + u / 2);
    const vy = (j) => (j % 2 === 0 ? h : 0);
    for (let j = 0; j <= n; j += 1) sticks.push([vx(j), vy(j), vx(j + 1), vy(j + 1)]);
    for (let j = 0; j < n; j += 1) sticks.push([vx(j), vy(j), vx(j + 2), vy(j + 2)]);
  }
  const maxX = Math.max(...sticks.flatMap((s) => [s[0], s[2]]));
  const maxY = Math.max(...sticks.flatMap((s) => [s[1], s[3]]));
  let body = "";
  sticks.forEach(([x1, y1, x2, y2]) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    const a = 2.2 / len;
    const sx = pad + x1 + dx * a;
    const sy = pad + y1 + dy * a;
    const ex = pad + x2 - dx * a;
    const ey = pad + y2 - dy * a;
    body += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" style="stroke:#d6ae7b;stroke-width:3.4;stroke-linecap:round"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.7" style="fill:#c0392b"/>`;
  });
  return svgWrap(maxX + pad * 2, maxY + pad * 2, body, `성냥개비로 만든 모양 ${n}개`);
}

const MATCH_SHAPES = Object.freeze({
  square: { name: "사각형", per: 3, first: 4 },
  house: { name: "오각형", per: 4, first: 5 },
  triangle: { name: "삼각형", per: 2, first: 3 },
  hexagon: { name: "육각형", per: 5, first: 6 }
});

function matchstickGrowthTable({ difficulty = 2 }) {
  const shape = difficulty === 1 ? pick(["square", "triangle"]) : difficulty === 2 ? pick(["square", "house", "triangle"]) : pick(["house", "hexagon", "triangle"]);
  const info = MATCH_SHAPES[shape];
  const target = randomInt(difficulty === 1 ? 5 : 6, difficulty === 3 ? 10 : 8);
  const count = (n) => info.first + info.per * (n - 1);
  const values = Array.from({ length: target }, (_, i) => count(i + 1));
  const reverse = difficulty === 3 && Math.random() < 0.4;
  const html = [...[1, 2, 3].map((n) => captioned(matchstickSvg(shape, n), `${ORD[n - 1]} 번째`)), twoRowTableSvg(`${info.name}의 개수`, Math.min(target, 7), "성냥개비의 개수", [])].join("");
  const answer = count(target);
  if (reverse) {
    return {
      prompt: `성냥개비로 다음과 같은 규칙에 따라 ${info.name}을 옆으로 이어 만듭니다. 표를 채워 규칙을 찾고, 성냥개비 ${answer}개를 모두 써서 만들면 ${info.name}은 몇 개가 되는지 구하세요.`,
      visual: { kind: "fig", html },
      answer: `${target}개`,
      solution: `처음 ${info.name} 하나에 ${info.first}개, 하나를 이을 때마다 ${info.per}개씩 늘어납니다. ${answer}개에서 처음 ${info.first}개를 빼면 ${answer - info.first}개이고, ${answer - info.first} ÷ ${info.per} = ${target - 1}이므로 처음 하나에 ${target - 1}개를 더 이어 ${target}개입니다.`,
      meta: { shape, target, values, answer: target, reverse }
    };
  }
  return {
    prompt: `성냥개비로 다음과 같은 규칙에 따라 ${info.name}을 옆으로 이어 만듭니다. 표를 완성하고, ${info.name} ${target}개를 만들 때 필요한 성냥개비는 몇 개인지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `표: ${values.join(", ")} / ${answer}개`,
    solution: `처음 ${info.name} 하나에 ${info.first}개가 들고, 옆에 하나를 이어 붙일 때마다 맞닿은 한 변을 함께 쓰므로 ${info.per}개씩 늘어납니다. 그래서 ${values.join(", ")}이고, ${target}개일 때는 ${info.first} + ${info.per} × ${target - 1} = ${answer}개입니다.`,
    meta: { shape, target, values, answer }
  };
}

// 활동 2-3 · 2-4: 바깥은 검은 돌, 안은 흰 돌 — 표 두 개를 채우고 처음으로 흰 돌이 더 많아지는 단계
function stoneFigure(shape, side) {
  const step = 12;
  const r = 5;
  let body = "";
  let w;
  let h;
  if (shape === "triangle") {
    w = side * step + 4;
    h = side * step * 0.88 + 4;
    for (let row = 0; row < side; row += 1) {
      for (let k = 0; k <= row; k += 1) {
        const border = row === side - 1 || k === 0 || k === row;
        const cx = w / 2 + (k - row / 2) * step;
        const cy = 2 + r + row * step * 0.88;
        body += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" style="fill:${border ? "#1f1f1f" : "#fff"};stroke:#1f1f1f;stroke-width:1"/>`;
      }
    }
  } else {
    const cols = shape === "rect" ? side + 1 : side;
    w = cols * step + 4;
    h = side * step + 4;
    for (let a = 0; a < side; a += 1) for (let b = 0; b < cols; b += 1) {
      const border = a === 0 || b === 0 || a === side - 1 || b === cols - 1;
      body += `<circle cx="${2 + r + b * step}" cy="${2 + r + a * step}" r="${r}" style="fill:${border ? "#1f1f1f" : "#fff"};stroke:#1f1f1f;stroke-width:1"/>`;
    }
  }
  return svgWrap(Math.ceil(w), Math.ceil(h), body, "바둑돌 모양");
}

function stoneOvertakeTable({ difficulty = 2 }) {
  const shape = difficulty === 1 ? pick(["square", "rect"]) : pick(["triangle", "square", "rect"]);
  const offset = difficulty === 1 ? pick([1, 2]) : pick([1, 2, 3]);
  const sideAt = (n) => n + offset;
  const counts = (n) => {
    const s = sideAt(n);
    if (shape === "triangle") return { black: 3 * (s - 1), white: (s * (s + 1)) / 2 - 3 * (s - 1) };
    if (shape === "rect") return { black: 2 * (s + s + 1) - 4, white: (s - 2) * (s - 1) };
    return { black: 4 * (s - 1), white: (s - 2) * (s - 2) };
  };
  let first = 1;
  while (counts(first).white <= counts(first).black) first += 1;
  const columns = first + 1;
  const blacks = Array.from({ length: columns }, (_, i) => counts(i + 1).black);
  const whites = Array.from({ length: columns }, (_, i) => counts(i + 1).white);
  const shownStages = shape === "triangle" ? 5 : 4;
  const html = [
    ...Array.from({ length: shownStages }, (_, i) => captioned(stoneFigure(shape, sideAt(i + 1)), `(${i + 1})`)),
    twoRowTableSvg("순서", columns, "검은 돌", [blacks[0]]),
    twoRowTableSvg("순서", columns, "흰 돌", whites.slice(0, whites.findIndex((v) => v > 0) + 1))
  ].join("");
  const edge = shape === "triangle" ? "세 변" : "네 변";
  const blackStep = shape === "triangle" ? 3 : 4;
  return {
    prompt: "다음과 같은 모양으로 바둑돌을 늘어놓습니다. (1) 검은 돌의 표와 (2) 흰 돌의 표를 완성하고, (3) 처음으로 흰 돌이 검은 돌보다 많아지는 것은 몇 번째인지 구하세요.",
    visual: { kind: "fig", html },
    answer: `(1) ${blacks.join(", ")} (2) ${whites.join(", ")} (3) ${first}번째`,
    solution: `검은 돌은 ${edge}에 놓이므로 한 단계마다 ${blackStep}개씩 늘어 ${blacks.join(", ")}입니다. 흰 돌은 안쪽에 놓여 ${whites.join(", ")}처럼 점점 더 많이 늘어납니다. 두 줄을 견주면 ${first}번째에 흰 돌 ${whites[first - 1]}개, 검은 돌 ${blacks[first - 1]}개로 처음 흰 돌이 더 많습니다.`,
    meta: { shape, offset, first, blacks, whites }
  };
}

// 도전 3: 계속 반으로 접고 접힌 선을 따라 자른 종이 수로 접은 횟수 거꾸로 구하기
const HALF_WORDS = ["아래로", "왼쪽으로"];
function foldPiecesToFolds({ difficulty = 2 }) {
  const folds = difficulty === 1 ? randomInt(3, 4) : difficulty === 2 ? randomInt(4, 6) : randomInt(5, 7);
  const pieces = 2 ** folds;
  const startWord = randomInt(0, 1);
  const words = [0, 1, 2].map((i) => HALF_WORDS[(i + startWord) % 2]);
  const strip = foldWordStrip(words, { label: "종이를 계속 반으로 접는 과정" });
  const columns = Math.max(folds, 6);
  const html = [strip, twoRowTableSvg("접은 횟수", columns, "자른 종이 수", [])].join("");
  const values = Array.from({ length: folds }, (_, i) => 2 ** (i + 1));
  if (difficulty >= 2 && Math.random() < 0.4) {
    const limit = randomInt(2 ** (folds - 1), pieces - 1);
    return {
      prompt: `정사각형 종이를 그림처럼 계속 반으로 접은 뒤 펼쳐서 접힌 선을 따라 모두 자릅니다. 표를 채워 보고, 자른 종이가 처음으로 ${limit}장보다 많아지려면 적어도 몇 번 접어야 하는지 구하세요.`,
      visual: { kind: "fig", html },
      answer: `${folds}번`,
      solution: `한 번 접을 때마다 자른 종이 수가 두 배가 되어 ${values.join(", ")}장입니다. ${folds - 1}번 접으면 ${2 ** (folds - 1)}장으로 ${limit}장보다 많지 않고, ${folds}번 접으면 ${pieces}장으로 처음 많아집니다.`,
      meta: { folds, pieces, limit }
    };
  }
  return {
    prompt: `정사각형 종이를 그림처럼 계속 반으로 접었습니다. 이렇게 몇 번 접은 뒤 펼쳐서 접힌 선을 따라 모두 잘랐더니 종이가 ${pieces}장이 되었습니다. 표를 채워 보고, 종이를 몇 번 접은 것인지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${folds}번`,
    solution: `한 번 접을 때마다 접힌 칸이 두 배가 되므로 자른 종이는 ${values.join(", ")}장으로 두 배씩 늘어납니다. ${pieces}장이 되는 것은 ${folds}번 접었을 때입니다.`,
    meta: { folds, pieces }
  };
}

// 연습 1: 규칙이 서로 다른 수열 여러 줄 표
const SEQ_RULES = Object.freeze([
  { id: "add", make: () => { const s = randomInt(1, 9); const d = randomInt(2, 6); return { full: Array.from({ length: 8 }, (_, i) => s + d * i), say: `${d}씩 커집니다` }; } },
  { id: "sub", make: () => { const d = randomInt(3, 7); const s = d * 7 + randomInt(2, 20); return { full: Array.from({ length: 8 }, (_, i) => s - d * i), say: `${d}씩 작아집니다` }; } },
  { id: "repeat", make: () => { const p = pick([3, 4]); const c = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, p); return { full: Array.from({ length: 10 }, (_, i) => c[i % p]), say: `${[...c.slice(0, -1), iga(c.at(-1))].join(", ")} 되풀이됩니다` }; } },
  { id: "grow-diff", make: () => { const s = randomInt(1, 5); const d0 = randomInt(1, 3); const full = [s]; for (let i = 0; i < 8; i += 1) full.push(full.at(-1) + d0 + i); return { full, say: `커지는 수가 ${d0}, ${d0 + 1}, ${d0 + 2}, …처럼 1씩 늘어납니다` }; } },
  { id: "grow-diff-step", make: () => { const s = randomInt(1, 3); const k = pick([2, 3]); const full = [s]; for (let i = 1; i < 8; i += 1) full.push(full.at(-1) + k * i); return { full, say: `커지는 수가 ${k}, ${k * 2}, ${k * 3}, …처럼 ${k}씩 늘어납니다` }; } },
  { id: "fib", make: () => { const a = randomInt(1, 3); const b = randomInt(a, 4); const full = [a, b]; while (full.length < 8) full.push(full.at(-1) + full.at(-2)); return { full, say: "앞의 두 수를 더하면 다음 수가 됩니다" }; } },
  { id: "two-strands", make: () => { const s1 = randomInt(1, 4); const s2 = s1 + randomInt(1, 3); const d1 = randomInt(1, 3); const d2 = pick([2, 3, 4].filter((d) => d !== d1)); return { full: Array.from({ length: 10 }, (_, i) => (i % 2 === 0 ? s1 + d1 * (i / 2) : s2 + d2 * ((i - 1) / 2))), say: `홀수 번째는 ${d1}씩, 짝수 번째는 ${d2}씩 커집니다` }; } },
  { id: "runs", make: () => { const full = []; for (let n = 1; full.length < 12; n += 1) for (let k = 1; k <= n && full.length < 12; k += 1) full.push(k); return { full, say: "1, 1 2, 1 2 3, …처럼 1부터 차례로 하나씩 더 길게 씁니다" }; } }
]);

function mixedRuleSequenceTable({ difficulty = 2 }) {
  const rowCount = difficulty === 1 ? 5 : difficulty === 2 ? 6 : 8;
  const base = ["add", "sub", "repeat", "grow-diff"];
  const extra = shuffle(["grow-diff-step", "fib", "two-strands", "runs"]);
  const ids = [...base, ...extra].slice(0, rowCount);
  const rows = ids.map((id) => {
    const made = SEQ_RULES.find((r) => r.id === id).make();
    const len = Math.min(made.full.length, 9);
    const full = made.full.slice(0, len);
    const blank = randomInt(3, len - 3);
    return { id, full, blank, answer: full[blank], say: made.say };
  });
  if (rows.some((r) => r.full.some((v) => v <= 0 || v > 120))) return null;
  const marks = "①②③④⑤⑥⑦⑧";
  const rowH = 32;
  const width = 430;
  let body = `<rect x="2" y="2" width="44" height="${rowH}" style="fill:${SOFT};stroke:${LINE}"/>${text(24, 23, "순", { size: 14 })}<rect x="46" y="2" width="${width - 48}" height="${rowH}" style="fill:${SOFT};stroke:${LINE}"/>${text(46 + (width - 48) / 2, 23, "수열", { size: 14 })}`;
  rows.forEach((r, i) => {
    const y = 2 + rowH * (i + 1);
    const items = r.full.map((v, k) => (k === r.blank ? "(    )" : v));
    body += `<rect x="2" y="${y}" width="44" height="${rowH}" style="fill:#fff;stroke:${LINE}"/>${text(24, y + 21, marks[i], { size: 15 })}`;
    body += `<rect x="46" y="${y}" width="${width - 48}" height="${rowH}" style="fill:#fff;stroke:${LINE}"/>${text(56, y + 21, `${items.join(", ")}, …`, { size: 14, anchor: "start" })}`;
  });
  const html = svgWrap(width, rowH * (rows.length + 1) + 4, body, "여러 수열 표, 괄호가 빈칸");
  return {
    prompt: "다음 수열의 규칙을 찾아 (  ) 안에 알맞은 수를 써넣으세요.",
    visual: { kind: "fig", html },
    answer: rows.map((r, i) => `${marks[i]} ${r.answer}`).join(", "),
    solution: rows.map((r, i) => `${marks[i]} ${r.say}. → ${r.answer}`).join(" "),
    meta: { rows: rows.map((r) => ({ id: r.id, full: r.full, blank: r.blank })) }
  };
}

// 연습 11: 가로줄 가운데에서 위로 자라는 모양(뒤집은 T 등) — 단계마다 같은 수만큼 느는 돌
const LETTER_SHAPES = Object.freeze({
  "t-up": { per: 3, say: "가로로 양쪽에 1개씩, 위로 1개 — 한 단계에 3개씩" },
  cross: { per: 4, say: "위·아래·왼쪽·오른쪽에 1개씩 — 한 단계에 4개씩" },
  ell: { per: 2, say: "오른쪽에 1개, 위로 1개 — 한 단계에 2개씩" }
});
function letterStoneSvg(kind, n) {
  const step = 14;
  const pts = [];
  if (kind === "t-up") {
    for (let i = -(n - 1); i <= n - 1; i += 1) pts.push([i, 0]);
    for (let j = 1; j <= n - 1; j += 1) pts.push([0, -j]);
  } else if (kind === "cross") {
    pts.push([0, 0]);
    for (let j = 1; j <= n - 1; j += 1) pts.push([j, 0], [-j, 0], [0, j], [0, -j]);
  } else {
    pts.push([0, 0]);
    for (let j = 1; j <= n - 1; j += 1) pts.push([j, 0], [0, -j]);
  }
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = (Math.max(...xs) - minX + 1) * step + 4;
  const h = (Math.max(...ys) - minY + 1) * step + 4;
  const body = pts.map(([x, y]) => `<circle cx="${2 + step / 2 + (x - minX) * step}" cy="${2 + step / 2 + (y - minY) * step}" r="5.6" style="fill:#fff;stroke:#3b5b4c;stroke-width:1.3"/>`).join("");
  return svgWrap(w, h, body, `${n}번째 모양`);
}

function letterShapeStoneGrowth({ difficulty = 2 }) {
  const kind = difficulty === 1 ? "ell" : difficulty === 2 ? pick(["t-up", "ell"]) : pick(["t-up", "cross"]);
  const info = LETTER_SHAPES[kind];
  const target = randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 15 : 11);
  const count = (n) => 1 + info.per * (n - 1);
  const html = [1, 2, 3, 4].map((n) => captioned(letterStoneSvg(kind, n), `${ORD[n - 1]} 번째`)).join("");
  const answer = count(target);
  if (difficulty === 3 && Math.random() < 0.4) {
    return {
      prompt: `다음과 같은 규칙으로 바둑돌을 늘어놓았습니다. 바둑돌 ${answer}개로 만든 모양은 몇 번째 모양인지 구하세요.`,
      visual: { kind: "fig", html },
      answer: `${target}번째`,
      solution: `첫 번째는 1개이고, 한 단계마다 ${info.per}개씩 늘어납니다. ${answer} - 1 = ${answer - 1}, ${answer - 1} ÷ ${info.per} = ${target - 1}이므로 첫 번째에서 ${target - 1}단계 더 간 ${target}번째입니다.`,
      meta: { kind, target, answer: target, reverse: true }
    };
  }
  return {
    prompt: `다음과 같은 규칙으로 바둑돌을 늘어놓았습니다. ${target}번째 모양을 만드는 데 필요한 바둑돌은 몇 개인지 구하세요.`,
    visual: { kind: "fig", html },
    answer: `${answer}개`,
    solution: `첫 번째는 1개이고, 다음 단계로 갈 때마다 ${info.say} 늘어납니다(${[1, 2, 3, 4].map(count).join(", ")}). 그래서 ${target}번째는 1 + ${info.per} × ${target - 1} = ${answer}개입니다.`,
    meta: { kind, target, answer }
  };
}

// ── 4단원 남은 번호(2026-11-27) ─────────────────────────────────────
// 모두 같은 틀: 보기 그림 셋(규칙에 맞게 다 채움) + 마지막 그림 하나(색칠한 빈칸).
// 후보 규칙 중 보기 셋에 맞는 규칙이 하나뿐이고, 빈칸 값도 그 규칙으로 하나만 나올 때만 낸다.

const BLANK_FILL = "#f6e4a8";

function makeRuleExamples(rules, rule, sample, { count = 4, max = 99 } = {}) {
  const items = [];
  for (let t = 0; t < 400 && items.length < count; t += 1) {
    const v = sample();
    const out = rule.calc(v);
    if (out == null || !Number.isInteger(out) || out < 0 || out > max) continue;
    const full = { ...v, out };
    if (items.some((x) => JSON.stringify(x) === JSON.stringify(full))) continue;
    items.push(full);
  }
  if (items.length < count) return null;
  const shown = items.slice(0, count - 1);
  const fits = rules.filter((r) => shown.every((x) => r.calc(x) === x.out));
  if (fits.length !== 1) return null;
  return items;
}

// 빈칸 값이 하나뿐인지: 빈칸 자리를 0~99로 바꿔 보며 규칙에 맞는 값을 센다
function uniqueBlank(rule, last, key) {
  const fits = [];
  for (let x = 0; x <= 99; x += 1) {
    const w = { ...last, [key]: x };
    if (key === "out" ? rule.calc(last) === x : rule.calc(w) === w.out) fits.push(x);
  }
  return fits.length === 1 && fits[0] === last[key];
}

function circleNode(x, y, value, blank, r = 15) {
  return `<circle cx="${x}" cy="${y}" r="${r}" style="fill:${blank ? BLANK_FILL : "#fff"};stroke:#4f7a66;stroke-width:1.4"/>${blank ? "" : text(x, y + 6, value, { size: String(value).length > 1 ? 15 : 17 })}`;
}

// 확인 1-1: 세 점(위·왼쪽·오른쪽) + 가운데 수
const TRI_KEYS = ["top", "left", "right"];
const TRI_NAME = { top: "위", left: "왼쪽", right: "오른쪽" };
function triangleCenterRules() {
  const rules = [{ id: "sum", calc: (v) => v.top + v.left + v.right, say: "세 수의 합이 가운데 수입니다", show: (v) => `${v.top} + ${v.left} + ${v.right} = ${v.out}` }];
  TRI_KEYS.forEach((k) => {
    const [a, b] = TRI_KEYS.filter((x) => x !== k);
    rules.push({ id: `minus-${k}`, calc: (v) => v[a] + v[b] - v[k], say: `${TRI_NAME[a]}·${TRI_NAME[b]} 두 수의 합에서 ${TRI_NAME[k]} 수를 뺀 수가 가운데 수입니다`, show: (v) => `${v[a]} + ${v[b]} - ${v[k]} = ${v.out}` });
    rules.push({ id: `rest-${k}`, calc: (v) => v[k] - v[a] - v[b], say: `${TRI_NAME[k]} 수에서 나머지 두 수를 뺀 수가 가운데 수입니다`, show: (v) => `${v[k]} - ${v[a]} - ${v[b]} = ${v.out}` });
  });
  return rules;
}

function triangleCenterSvg(v, blank) {
  const at = { top: [70, 20], left: [24, 98], right: [116, 98] };
  let body = `<polygon points="70,35 37,90 103,90" style="fill:none;stroke:${LINE};stroke-width:1.4"/>`;
  body += `<line x1="37" y1="98" x2="101" y2="98" style="stroke:${LINE};stroke-width:1.4"/>`;
  body += `<line x1="62" y1="33" x2="32" y2="85" style="stroke:${LINE};stroke-width:1.4"/><line x1="78" y1="33" x2="108" y2="85" style="stroke:${LINE};stroke-width:1.4"/>`;
  TRI_KEYS.forEach((k) => { body += circleNode(at[k][0], at[k][1], v[k], blank === k); });
  body += blank === "out" ? `<circle cx="70" cy="70" r="13" style="fill:${BLANK_FILL}"/>` : text(70, 77, v.out, { size: 18 });
  return svgWrap(140, 118, `<g>${body}</g>`, isBlankLabel(blank));
}

function triangleCenterRule({ difficulty = 2 }) {
  const rules = triangleCenterRules();
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rule = pick(difficulty === 1 ? rules.filter((r) => r.id === "sum" || r.id.startsWith("rest")) : rules);
    const max = difficulty === 1 ? 12 : 25;
    const items = makeRuleExamples(rules, rule, () => ({ top: randomInt(1, max), left: randomInt(1, max), right: randomInt(1, max) }), { max: 40 });
    if (!items || items.some((x) => x.out === 0)) continue;
    const last = items[3];
    const blank = difficulty === 3 && Math.random() < 0.4 ? pick(TRI_KEYS) : "out";
    if (!uniqueBlank(rule, last, blank)) continue;
    const html = [...items.slice(0, 3).map((v) => triangleCenterSvg(v, null)), triangleCenterSvg(last, blank)].join("");
    return {
      prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 색칠된 빈칸에 알맞은 수를 구하세요.",
      visual: { kind: "fig", html },
      answer: String(last[blank]),
      solution: `보기 세 그림에서 ${rule.say}(${items.slice(0, 3).map(rule.show).join(", ")}). 마지막 그림도 같은 규칙이므로 ${rule.show(last)}에서 빈칸은 ${last[blank]}입니다.`,
      meta: { rule: rule.id, items, blank, answer: last[blank] }
    };
  }
  return null;
}

// 확인 1-3: 위 두 수 → 아래 두 수(같은 합·같은 차·같은 곱)
const STACK_RULES = Object.freeze([
  { id: "same-sum", ok: (a, b, c, d) => a + b === c + d, solve: (a, b, c) => a + b - c, say: "위 두 수의 합과 아래 두 수의 합이 같습니다", show: (a, b, c, d) => `${a} + ${b} = ${c} + ${d}` },
  { id: "same-diff", ok: (a, b, c, d) => Math.abs(a - b) === Math.abs(c - d) && (a - b) * (c - d) >= 0, solve: (a, b, c) => c + (b - a), say: "위 두 수의 차와 아래 두 수의 차가 같고, 큰 쪽도 같습니다", show: (a, b, c, d) => `${Math.max(a, b)} - ${Math.min(a, b)} = ${Math.max(c, d)} - ${Math.min(c, d)}` },
  { id: "same-product", ok: (a, b, c, d) => a * b === c * d, solve: (a, b, c) => (c && (a * b) % c === 0 ? (a * b) / c : null), say: "위 두 수의 곱과 아래 두 수의 곱이 같습니다", show: (a, b, c, d) => `${a} × ${b} = ${c} × ${d}` }
]);

function pairStackSvg(a, b, c, d, blank) {
  const w = 34;
  let body = "";
  const cell = (x, y, v, isBlank) => {
    body += `<rect x="${x}" y="${y}" width="${w}" height="${w}" style="fill:${isBlank ? BLANK_FILL : "#fff"};stroke:#4f7a66;stroke-width:1.3"/>`;
    if (!isBlank) body += text(x + w / 2, y + w / 2 + 6.5, v, { size: 17 });
  };
  cell(2, 2, a);
  cell(2 + w, 2, b);
  body += `<line x1="${2 + w}" y1="${2 + w}" x2="${2 + w}" y2="${2 + w + 18}" style="stroke:#4f7a66;stroke-width:1.3"/>`;
  cell(2 + w / 2, 2 + w + 18, c);
  cell(2 + w / 2, 2 + w * 2 + 18, d, blank);
  return svgWrap(w * 2 + 4, w * 3 + 22, body, blank ? "약속으로 수를 써넣은 그림, 색칠된 칸이 빈칸" : "약속으로 수를 써넣은 그림");
}

function pairStackRule({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const rule = pick(difficulty === 1 ? STACK_RULES.slice(0, 1) : difficulty === 2 ? STACK_RULES.slice(0, 2) : STACK_RULES);
    const items = [];
    for (let t = 0; t < 200 && items.length < 4; t += 1) {
      const a = randomInt(1, 9);
      const b = randomInt(1, 9);
      const c = randomInt(1, 9);
      const d = rule.solve(a, b, c);
      if (d == null || d < 1 || d > 9 || a === b) continue;
      if ((a === c && b === d) || (a === d && b === c)) continue;
      if (items.some((x) => x.join() === [a, b, c, d].join())) continue;
      items.push([a, b, c, d]);
    }
    if (items.length < 4) continue;
    const shown = items.slice(0, 3);
    if (STACK_RULES.filter((r) => shown.every((x) => r.ok(...x))).length !== 1) continue;
    const [a, b, c, d] = items[3];
    const fits = [];
    for (let x = 0; x <= 99; x += 1) if (rule.ok(a, b, c, x)) fits.push(x);
    if (fits.length !== 1) continue;
    const html = [...shown.map((x) => pairStackSvg(...x, false)), pairStackSvg(a, b, c, d, true)].join("");
    return {
      prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 색칠된 칸에 알맞은 수를 구하세요.",
      visual: { kind: "fig", html },
      answer: String(d),
      solution: `보기 세 그림에서 ${rule.say}(${shown.map((x) => rule.show(...x)).join(", ")}). 그래서 마지막 그림은 ${rule.show(a, b, c, d)}이므로 빈칸은 ${d}입니다.`,
      meta: { rule: rule.id, items, answer: d }
    };
  }
  return null;
}

// 활동 1-2 · 연습 3: 원 안 삼각형 — 위 두 칸으로 두 자리 수를 만들고 아래 수와 계산해 가운데
const COMPOSE_TRI_RULES = Object.freeze([
  { id: "ab-c", calc: (v) => 10 * v.a + v.b - v.c, say: "위 두 수로 만든 두 자리 수에서 아래 수를 뺀 수가 가운데 수입니다", show: (v) => `${10 * v.a + v.b} - ${v.c} = ${v.out}` },
  { id: "ab+c", calc: (v) => 10 * v.a + v.b + v.c, say: "위 두 수로 만든 두 자리 수에 아래 수를 더한 수가 가운데 수입니다", show: (v) => `${10 * v.a + v.b} + ${v.c} = ${v.out}` },
  { id: "ba-c", calc: (v) => 10 * v.b + v.a - v.c, say: "오른쪽 수를 십의 자리, 왼쪽 수를 일의 자리로 한 두 자리 수에서 아래 수를 뺀 수가 가운데 수입니다", show: (v) => `${10 * v.b + v.a} - ${v.c} = ${v.out}` },
  { id: "abc-sum", calc: (v) => v.a + v.b + v.c, say: "세 수의 합이 가운데 수입니다", show: (v) => `${v.a} + ${v.b} + ${v.c} = ${v.out}` }
]);

function composeTriangleSvg(v, blank) {
  let body = `<circle cx="60" cy="60" r="52" style="fill:#fff;stroke:#4f7a66;stroke-width:1.4"/>`;
  body += `<polygon points="60,8 15,86 105,86" style="fill:none;stroke:#4f7a66;stroke-width:1.4"/>`;
  body += text(34, 40, v.a, { size: 17 }) + text(86, 40, v.b, { size: 17 }) + text(60, 106, v.c, { size: 17 });
  body += blank ? `<circle cx="60" cy="62" r="12" style="fill:${BLANK_FILL}"/>` : text(60, 68, v.out, { size: 17 });
  return svgWrap(120, 120, body, isBlankLabel(blank));
}

function composeTrianglePart(difficulty, onlyCompose) {
  const pool = onlyCompose ? COMPOSE_TRI_RULES.filter((r) => r.id !== "abc-sum") : COMPOSE_TRI_RULES;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rule = pick(difficulty === 1 ? pool.filter((r) => r.id === "ab-c" || r.id === "ab+c") : pool);
    const items = makeRuleExamples(COMPOSE_TRI_RULES, rule, () => ({ a: randomInt(1, difficulty === 1 ? 2 : 4), b: randomInt(1, 9), c: randomInt(1, 9) }), { max: 99 });
    if (!items) continue;
    const last = items[3];
    if (!uniqueBlank(rule, last, "out")) continue;
    return {
      html: [...items.slice(0, 3).map((v) => composeTriangleSvg(v, false)), composeTriangleSvg(last, true)].join(""),
      answer: last.out,
      say: `${rule.say}(${items.slice(0, 3).map(rule.show).join(", ")}). 마지막은 ${rule.show(last)}입니다.`,
      rule: rule.id,
      items
    };
  }
  return null;
}

function triangleCircleCompose({ difficulty = 2 }) {
  const part = composeTrianglePart(difficulty, false);
  if (!part) return null;
  return {
    prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 색칠된 빈칸에 알맞은 수를 구하세요.",
    visual: { kind: "fig", html: part.html },
    answer: String(part.answer),
    solution: `보기 세 그림에서 ${part.say} 그래서 빈칸은 ${part.answer}입니다.`,
    meta: { rule: part.rule, items: part.items, answer: part.answer }
  };
}

// 네모 네 모서리로 두 자리 수 둘을 만들어 더하기(세로로 읽기 · 가로로 읽기)
const COMPOSE_SQ_RULES = Object.freeze([
  { id: "cols", calc: (v) => 10 * v.tl + v.bl + 10 * v.tr + v.br, say: "왼쪽 위아래 두 수, 오른쪽 위아래 두 수로 두 자리 수를 만들어 더한 수입니다", show: (v) => `${10 * v.tl + v.bl} + ${10 * v.tr + v.br} = ${v.out}` },
  { id: "rows", calc: (v) => 10 * v.tl + v.tr + 10 * v.bl + v.br, say: "위의 두 수, 아래의 두 수로 두 자리 수를 만들어 더한 수입니다", show: (v) => `${10 * v.tl + v.tr} + ${10 * v.bl + v.br} = ${v.out}` },
  { id: "cols-rev", calc: (v) => 10 * v.bl + v.tl + 10 * v.br + v.tr, say: "아래 수를 십의 자리, 위 수를 일의 자리로 한 두 자리 수 둘을 더한 수입니다", show: (v) => `${10 * v.bl + v.tl} + ${10 * v.br + v.tr} = ${v.out}` }
]);

function cornerSquareSvg(v, blank, { boxes = false, center = true } = {}) {
  const at = { tl: [24, 24], tr: [100, 24], bl: [24, 100], br: [100, 100] };
  let body = `<rect x="24" y="24" width="76" height="76" style="fill:none;stroke:#4f7a66;stroke-width:1.4"/>`;
  Object.entries(at).forEach(([k, [x, y]]) => {
    const isBlank = blank === k;
    body += boxes
      ? `<rect x="${x - 14}" y="${y - 14}" width="28" height="28" style="fill:${isBlank ? BLANK_FILL : "#fff"};stroke:#4f7a66;stroke-width:1.3"/>${isBlank ? "" : text(x, y + 6, v[k], { size: 16 })}`
      : circleNode(x, y, v[k], isBlank, 14);
  });
  if (center) body += blank === "out" ? `<circle cx="62" cy="62" r="12" style="fill:${BLANK_FILL}"/>` : text(62, 69, v.out, { size: 18 });
  return svgWrap(124, 124, body, isBlankLabel(blank));
}

function composeSquarePart(difficulty) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rule = pick(difficulty === 1 ? COMPOSE_SQ_RULES.slice(0, 2) : COMPOSE_SQ_RULES);
    const items = makeRuleExamples(COMPOSE_SQ_RULES, rule, () => ({ tl: randomInt(1, 5), tr: randomInt(1, 5), bl: randomInt(1, 9), br: randomInt(1, 9) }), { max: 99 });
    if (!items) continue;
    const last = items[3];
    if (!uniqueBlank(rule, last, "out")) continue;
    return {
      html: [...items.slice(0, 3).map((v) => cornerSquareSvg(v, null)), cornerSquareSvg(last, "out")].join(""),
      answer: last.out,
      say: `${rule.say}(${items.slice(0, 3).map(rule.show).join(", ")}). 마지막은 ${rule.show(last)}입니다.`,
      rule: rule.id,
      items
    };
  }
  return null;
}

function composeTwoFigures({ difficulty = 2 }) {
  const parts = [composeTrianglePart(difficulty, true), composeSquarePart(difficulty)];
  if (parts.some((p) => !p)) return null;
  return {
    prompt: "어떤 규칙에 맞게 수를 써넣었습니다. (1)과 (2)에서 색칠된 빈칸에 알맞은 수를 각각 구하세요.",
    visual: { kind: "fig", html: parts.map((p, i) => `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;width:100%"><b style="font-size:15px">(${i + 1})</b>${p.html}</div>`).join("") },
    answer: parts.map((p, i) => `(${i + 1}) ${p.answer}`).join(", "),
    solution: parts.map((p, i) => `(${i + 1}) ${p.say}`).join(" "),
    meta: { parts: parts.map((p) => ({ rule: p.rule, items: p.items, answer: p.answer })) }
  };
}

// 활동 1-3: 세 모서리의 수로 가운데 두 자리 수 만들기
const CORNER_COMPOSE_RULES = Object.freeze([
  { id: "tl|r", calc: (v) => (v.t + v.l <= 9 ? 10 * (v.t + v.l) + v.r : null), say: "위와 왼쪽 수의 합을 십의 자리, 오른쪽 수를 일의 자리에 놓은 수입니다", show: (v) => `${v.t} + ${v.l} = ${v.t + v.l}, 일의 자리 ${v.r} → ${v.out}` },
  { id: "tr|l", calc: (v) => (v.t + v.r <= 9 ? 10 * (v.t + v.r) + v.l : null), say: "위와 오른쪽 수의 합을 십의 자리, 왼쪽 수를 일의 자리에 놓은 수입니다", show: (v) => `${v.t} + ${v.r} = ${v.t + v.r}, 일의 자리 ${v.l} → ${v.out}` },
  { id: "lr|t", calc: (v) => (v.l + v.r <= 9 ? 10 * (v.l + v.r) + v.t : null), say: "왼쪽과 오른쪽 수의 합을 십의 자리, 위 수를 일의 자리에 놓은 수입니다", show: (v) => `${v.l} + ${v.r} = ${v.l + v.r}, 일의 자리 ${v.t} → ${v.out}` },
  { id: "t|lr", calc: (v) => (v.l + v.r <= 9 ? 10 * v.t + v.l + v.r : null), say: "위 수를 십의 자리, 왼쪽과 오른쪽 수의 합을 일의 자리에 놓은 수입니다", show: (v) => `십의 자리 ${v.t}, ${v.l} + ${v.r} = ${v.l + v.r} → ${v.out}` }
]);

function cornerTriangleSvg(v, blank) {
  let body = `<polygon points="60,6 6,100 114,100" style="fill:#fff;stroke:#4f7a66;stroke-width:1.4"/>`;
  body += `<line x1="47" y1="29" x2="73" y2="29" style="stroke:#4f7a66;stroke-width:1.2"/><line x1="23" y1="71" x2="35" y2="100" style="stroke:#4f7a66;stroke-width:1.2"/><line x1="97" y1="71" x2="85" y2="100" style="stroke:#4f7a66;stroke-width:1.2"/>`;
  body += text(60, 24, v.t, { size: 15 }) + text(19, 94, v.l, { size: 15 }) + text(101, 94, v.r, { size: 15 });
  body += blank ? `<circle cx="60" cy="66" r="12" style="fill:${BLANK_FILL}"/>` : text(60, 72, v.out, { size: 18 });
  return svgWrap(120, 106, body, isBlankLabel(blank));
}

function cornerDigitCompose({ difficulty = 2 }) {
  const rules = CORNER_COMPOSE_RULES;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rule = pick(difficulty === 1 ? rules.slice(0, 2) : rules);
    const items = makeRuleExamples(rules, rule, () => ({ t: randomInt(1, 5), l: randomInt(1, 5), r: randomInt(1, 9) }), { max: 99 });
    if (!items) continue;
    const last = items[3];
    if (!uniqueBlank(rule, last, "out")) continue;
    const html = [...items.slice(0, 3).map((v) => cornerTriangleSvg(v, false)), cornerTriangleSvg(last, true)].join("");
    return {
      prompt: "어떤 규칙에 맞게 수를 써넣었습니다. 색칠된 빈칸에 알맞은 수를 구하세요.",
      visual: { kind: "fig", html },
      answer: String(last.out),
      solution: `보기 세 그림에서 가운데 수는 ${rule.say}(${items.slice(0, 3).map(rule.show).join(" / ")}). 마지막 그림은 ${rule.show(last)}이므로 빈칸은 ${last.out}입니다.`,
      meta: { rule: rule.id, items, answer: last.out }
    };
  }
  return null;
}

// 활동 1-4: 네 칸 줄 — 양 끝 두 수의 합(또는 차)이 가운데 두 수로 만든 두 자리 수
const ROW_RULES = Object.freeze([
  { id: "a+d=bc", ok: (r) => r[0] + r[3] === 10 * r[1] + r[2], say: "양 끝 두 수의 합이 가운데 두 수로 만든 두 자리 수입니다", show: (r) => `${r[0]} + ${r[3]} = ${10 * r[1] + r[2]}` },
  { id: "a+d=cb", ok: (r) => r[0] + r[3] === 10 * r[2] + r[1], say: "양 끝 두 수의 합이 가운데 두 수를 거꾸로 읽은 두 자리 수입니다", show: (r) => `${r[0]} + ${r[3]} = ${10 * r[2] + r[1]}` },
  { id: "a-d=bc", ok: (r) => r[0] - r[3] === 10 * r[1] + r[2], say: "맨 앞 수에서 맨 뒤 수를 뺀 수가 가운데 두 수로 만든 두 자리 수입니다", show: (r) => `${r[0]} - ${r[3]} = ${10 * r[1] + r[2]}` },
  { id: "d-a=bc", ok: (r) => r[3] - r[0] === 10 * r[1] + r[2], say: "맨 뒤 수에서 맨 앞 수를 뺀 수가 가운데 두 수로 만든 두 자리 수입니다", show: (r) => `${r[3]} - ${r[0]} = ${10 * r[1] + r[2]}` }
]);

function rowGridSvg(rows, blank) {
  const cw = 46;
  const ch = 32;
  let body = "";
  rows.forEach((r, i) => r.forEach((v, j) => {
    const isBlank = blank && blank[0] === i && blank[1] === j;
    body += `<rect x="${2 + j * cw}" y="${2 + i * ch}" width="${cw}" height="${ch}" style="fill:#fff;stroke:#4f7a66;stroke-width:1.2"/>`;
    body += isBlank ? `<circle cx="${2 + j * cw + cw / 2}" cy="${2 + i * ch + ch / 2}" r="11" style="fill:${BLANK_FILL}"/>` : text(2 + j * cw + cw / 2, 2 + i * ch + 22, v, { size: 16 });
  }));
  return svgWrap(cw * 4 + 4, ch * rows.length + 4, body, "네 칸씩 네 줄의 수 표, 색칠된 칸이 빈칸");
}

function rowTwoDigitRelation({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const rule = pick(difficulty === 1 ? ROW_RULES.slice(0, 1) : difficulty === 2 ? ROW_RULES.slice(0, 2) : ROW_RULES);
    const rows = [];
    for (let t = 0; t < 200 && rows.length < 4; t += 1) {
      const b = randomInt(1, 6);
      const c = randomInt(0, 9);
      const n = rule.id === "a+d=cb" ? 10 * c + b : 10 * b + c;
      if (n < 10) continue;
      let a;
      let d;
      if (rule.id.startsWith("a+d")) { a = randomInt(1, n - 1); d = n - a; } else if (rule.id === "a-d=bc") { d = randomInt(1, 30); a = n + d; } else { a = randomInt(1, 30); d = n + a; }
      if (a < 1 || d < 1 || a > 99 || d > 99) continue;
      const r = [a, b, c, d];
      if (rows.some((x) => x.join() === r.join())) continue;
      rows.push(r);
    }
    if (rows.length < 4) continue;
    if (ROW_RULES.filter((x) => rows.slice(0, 3).every(x.ok)).length !== 1) continue;
    const col = pick(difficulty === 1 ? [1, 2] : [0, 1, 2, 3]);
    const last = rows[3];
    const fits = [];
    for (let x = 0; x <= 99; x += 1) { const w = [...last]; w[col] = x; if (rule.ok(w)) fits.push(x); }
    if (fits.length !== 1) continue;
    return {
      prompt: "다음 수 사이의 관계를 찾아 색칠된 빈칸에 알맞은 수를 써넣으세요.",
      visual: { kind: "fig", html: rowGridSvg(rows, [3, col]) },
      answer: String(last[col]),
      solution: `줄마다 ${rule.say}(${rows.slice(0, 3).map(rule.show).join(", ")}). 넷째 줄도 ${rule.show(last)}이므로 빈칸은 ${last[col]}입니다.`,
      meta: { rule: rule.id, rows, blank: [3, col], answer: last[col] }
    };
  }
  return null;
}

// 연습 5: 다섯 원이 꽃잎처럼 겹친 그림 — 겹친 곳의 수는 두 원의 수의 차(또는 합)
function flowerSvg(values, lens, blanks) {
  const C = 104;
  const R = 34;
  const r = 40;
  const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  const ctr = (i) => [C + R * Math.cos(ang(i)), C + R * Math.sin(ang(i))];
  let defs = "";
  let body = "";
  for (let i = 0; i < 5; i += 1) {
    const [x, y] = ctr(i);
    defs += `<clipPath id="fl${i}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/></clipPath>`;
  }
  blanks.forEach((i) => {
    const [x, y] = ctr((i + 1) % 5);
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" clip-path="url(#fl${i})" style="fill:#cfe3e6"/>`;
  });
  for (let i = 0; i < 5; i += 1) {
    const [x, y] = ctr(i);
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:none;stroke:#4f7a66;stroke-width:1.3"/>`;
    const out = [C + (R + 24) * Math.cos(ang(i)), C + (R + 24) * Math.sin(ang(i))];
    body += text(out[0].toFixed(1), (out[1] + 6).toFixed(1), values[i], { size: 16 });
    const mid = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 5;
    const p = [C + 34 * Math.cos(mid), C + 34 * Math.sin(mid)];
    const bi = blanks.indexOf(i);
    body += bi >= 0 ? text(p[0].toFixed(1), (p[1] + 6).toFixed(1), MARKS[bi], { size: 15, fill: "#8a6413" }) : text(p[0].toFixed(1), (p[1] + 6).toFixed(1), lens[i], { size: 15 });
  }
  return svgWrap(208, 208, `<defs>${defs}</defs>${body}`, "다섯 원이 겹친 그림, ㉠과 ㉡이 빈칸");
}

function overlapCircleFlower({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const op = difficulty === 1 ? "diff" : pick(["diff", "sum"]);
    const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
    const lens = values.map((v, i) => (op === "diff" ? Math.abs(v - values[(i + 1) % 5]) : v + values[(i + 1) % 5]));
    const blankCount = difficulty === 3 ? 3 : 2;
    // ㉠·㉡은 읽는 차례(위에서 아래, 왼쪽에서 오른쪽)로 붙인다
    const lensAt = (i) => { const m = -Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / 5; return [Math.round(Math.sin(m) * 100), Math.cos(m)]; };
    const blanks = shuffle([0, 1, 2, 3, 4]).slice(0, blankCount).sort((a, b) => lensAt(a)[0] - lensAt(b)[0] || lensAt(a)[1] - lensAt(b)[1]);
    const shownIdx = [0, 1, 2, 3, 4].filter((i) => !blanks.includes(i));
    // 보인 겹친 수로 합인지 차인지 가려진다
    const fitsDiff = shownIdx.every((i) => lens[i] === Math.abs(values[i] - values[(i + 1) % 5]));
    const fitsSum = shownIdx.every((i) => lens[i] === values[i] + values[(i + 1) % 5]);
    if (fitsDiff && fitsSum) continue;
    if (lens.some((x) => x === 0) || new Set(lens).size < 4) continue;
    const name = (i) => `${values[i]}과 ${values[(i + 1) % 5]}`;
    const answer = blanks.map((i, k) => `${MARKS[k]} ${lens[i]}`).join(", ");
    return {
      prompt: "다섯 원이 겹쳐 있습니다. 두 원이 겹친 곳의 수는 그 두 원에 쓴 수로 정해집니다. 수 사이의 관계를 찾아 빈칸에 알맞은 수를 써넣으세요.",
      visual: { kind: "fig", html: flowerSvg(values, lens, blanks) },
      answer,
      solution: `겹친 곳의 수는 두 원에 쓴 수의 ${op === "diff" ? "차" : "합"}입니다(${shownIdx.map((i) => `${values[i]}, ${values[(i + 1) % 5]} → ${lens[i]}`).join(" / ")}). 그래서 ${blanks.map((i, k) => `${MARKS[k]}은 ${values[i]}, ${values[(i + 1) % 5]} → ${lens[i]}`).join(", ")}입니다.`,
      meta: { op, values, lens, blanks, names: blanks.map(name) }
    };
  }
  return null;
}

// 연습 6: (1) 세 칸으로 나눈 원 — 위 두 칸과 아래 칸의 관계 (2) 네 모서리 수와 가운데 수
const SECTOR_RULES = Object.freeze([
  { id: "a-b", calc: (a, b) => a - b, say: "위 왼쪽 수에서 위 오른쪽 수를 뺀 수가 아래 칸입니다" },
  { id: "a+b", calc: (a, b) => a + b, say: "위 두 칸의 합이 아래 칸입니다" }
]);

function sectorSvg(a, b, c, blankKey) {
  const R = 40;
  let body = `<circle cx="46" cy="46" r="${R}" style="fill:#fff;stroke:#4f7a66;stroke-width:1.4"/>`;
  body += `<line x1="46" y1="6" x2="46" y2="46" style="stroke:#4f7a66;stroke-width:1.3"/><line x1="46" y1="46" x2="${(46 - R * 0.866).toFixed(1)}" y2="66" style="stroke:#4f7a66;stroke-width:1.3"/><line x1="46" y1="46" x2="${(46 + R * 0.866).toFixed(1)}" y2="66" style="stroke:#4f7a66;stroke-width:1.3"/>`;
  const slot = (x, y, v, key) => (blankKey === key ? `<circle cx="${x}" cy="${y - 6}" r="11" style="fill:${BLANK_FILL}"/>${text(x, y, MARKS[0], { size: 14, fill: "#8a6413" })}` : text(x, y, v, { size: 16 }));
  body += slot(28, 40, a, "a") + slot(64, 40, b, "b") + slot(46, 74, c, "c");
  return svgWrap(92, 92, body, blankKey ? "세 칸으로 나눈 원, 색칠된 칸이 빈칸" : "세 칸으로 나눈 원");
}

const CORNER_SUM_RULES = Object.freeze([
  { id: "sum", calc: (v) => v.tl + v.tr + v.bl + v.br, say: "네 모서리 수의 합이 가운데 수입니다", show: (v) => `${v.tl} + ${v.tr} + ${v.bl} + ${v.br} = ${v.out}` },
  { id: "double-sum", calc: (v) => 2 * (v.tl + v.tr + v.bl + v.br), say: "네 모서리 수의 합을 두 번 더한 수가 가운데 수입니다", show: (v) => `(${v.tl} + ${v.tr} + ${v.bl} + ${v.br}) × 2 = ${v.out}` },
  { id: "row-product", calc: (v) => (v.tl + v.tr) * (v.bl + v.br), say: "위 두 수의 합과 아래 두 수의 합을 곱한 수가 가운데 수입니다", show: (v) => `(${v.tl} + ${v.tr}) × (${v.bl} + ${v.br}) = ${v.out}` },
  { id: "col-product", calc: (v) => (v.tl + v.bl) * (v.tr + v.br), say: "왼쪽 두 수의 합과 오른쪽 두 수의 합을 곱한 수가 가운데 수입니다", show: (v) => `(${v.tl} + ${v.bl}) × (${v.tr} + ${v.br}) = ${v.out}` },
  { id: "diag-products", calc: (v) => v.tl * v.br + v.tr * v.bl, say: "대각선끼리 곱한 두 수의 합이 가운데 수입니다", show: (v) => `${v.tl} × ${v.br} + ${v.tr} × ${v.bl} = ${v.out}` }
]);

function cornerSumPart(rulePool, difficulty, { boxes = false, max = 99, top = 9 } = {}) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const rule = pick(rulePool);
    const items = makeRuleExamples(CORNER_SUM_RULES, rule, () => ({ tl: randomInt(1, top), tr: randomInt(1, top), bl: randomInt(1, top), br: randomInt(1, top) }), { max });
    if (!items) continue;
    const last = items[3];
    if (!uniqueBlank(rule, last, "out")) continue;
    return {
      html: [...items.slice(0, 3).map((v) => cornerSquareSvg(v, null, { boxes })), cornerSquareSvg(last, "out", { boxes })].join(""),
      answer: last.out,
      say: `${rule.say}(${items.slice(0, 3).map(rule.show).join(", ")}). 마지막은 ${rule.show(last)}입니다.`,
      rule: rule.id,
      items
    };
  }
  return null;
}

function sectorPart(difficulty) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const rule = pick(difficulty === 1 ? SECTOR_RULES.slice(0, 1) : SECTOR_RULES);
    const rows = [];
    while (rows.length < 4) {
      const a = randomInt(rule.id === "a-b" ? 12 : 3, rule.id === "a-b" ? 40 : 30);
      const b = randomInt(2, rule.id === "a-b" ? a - 2 : 25);
      const c = rule.calc(a, b);
      if (c <= 0 || c > 70 || rows.some((x) => x[0] === a && x[1] === b)) continue;
      rows.push([a, b, c]);
    }
    // 앞의 두 그림만 다 보여도 규칙이 가려진다(합과 차는 늘 다르다)
    const blankKeys = ["c", difficulty === 1 ? "c" : "a"];
    const svgs = rows.map(([a, b, c], i) => sectorSvg(a, b, c, i < 2 ? null : blankKeys[i - 2]));
    const answers = [rows[2][2], blankKeys[1] === "a" ? rows[3][0] : rows[3][2]];
    return {
      html: svgs.join("").replaceAll(MARKS[0], "§").replace("§", MARKS[0]).replace("§", MARKS[1]),
      answers,
      say: `${rule.say}(${rows.slice(0, 2).map(([a, b, c]) => `${a}, ${b} → ${c}`).join(" / ")}). 그래서 ㉠ = ${answers[0]}, ㉡ = ${answers[1]}입니다.`,
      rule: rule.id,
      rows,
      blankKeys
    };
  }
  return null;
}

function sectorCircleCornerSum({ difficulty = 2 }) {
  const first = sectorPart(difficulty);
  const second = cornerSumPart(difficulty === 1 ? CORNER_SUM_RULES.slice(0, 1) : CORNER_SUM_RULES.slice(0, 2), difficulty);
  if (!first || !second) return null;
  const wrap = (label, html) => `<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;width:100%"><b style="font-size:15px">${label}</b>${html}</div>`;
  return {
    prompt: "다음 수 사이의 관계를 찾아 빈칸에 알맞은 수를 써넣으세요. (1)은 ㉠과 ㉡, (2)는 색칠된 빈칸을 구하세요.",
    visual: { kind: "fig", html: wrap("(1)", first.html) + wrap("(2)", second.html) },
    answer: `(1) ㉠ ${first.answers[0]}, ㉡ ${first.answers[1]} (2) ${second.answer}`,
    solution: `(1) ${first.say} (2) ${second.say}`,
    meta: { parts: [{ rule: first.rule, rows: first.rows, blankKeys: first.blankKeys, answers: first.answers }, { rule: second.rule, items: second.items, answer: second.answer }] }
  };
}

// 도전 1: 네 모서리 칸(네모)과 가운데 수 — 합의 두 배·두 합의 곱·대각선 곱의 합
function squareCornerProduct({ difficulty = 2 }) {
  const pool = difficulty === 1 ? CORNER_SUM_RULES.slice(0, 2) : CORNER_SUM_RULES.slice(1);
  const part = cornerSumPart(pool, difficulty, { boxes: true, max: 99, top: difficulty === 3 ? 10 : 9 });
  if (!part) return null;
  return {
    prompt: "다음 수 퍼즐의 규칙에 맞게 색칠된 빈칸에 알맞은 수를 써넣으세요.",
    visual: { kind: "fig", html: part.html },
    answer: String(part.answer),
    solution: `보기 세 그림에서 ${part.say} 그래서 빈칸은 ${part.answer}입니다.`,
    meta: { rule: part.rule, items: part.items, answer: part.answer }
  };
}

// 도전 2: 마름모 네 점 + 가운데 — 세 수를 더하고 한 수를 빼는 규칙
const DIA_KEYS = ["top", "right", "bottom", "left"];
function diamondSignedRules() {
  const rules = [{ id: "sum-half", calc: (v) => ((v.top + v.right + v.bottom + v.left) % 2 === 0 ? (v.top + v.right + v.bottom + v.left) / 2 : null), say: "네 수의 합을 반으로 나눈 수가 가운데 수입니다", show: (v) => `(${v.top} + ${v.right} + ${v.bottom} + ${v.left})의 반 = ${v.out}` }];
  DIA_KEYS.forEach((k) => {
    const rest = DIA_KEYS.filter((x) => x !== k);
    rules.push({ id: `minus-${k}`, calc: (v) => rest.reduce((t, x) => t + v[x], 0) - v[k], say: `${rest.map((x) => NODE_NAME[x]).join("·")} 세 수의 합에서 ${NODE_NAME[k]} 수를 뺀 수가 가운데 수입니다`, show: (v) => `${rest.map((x) => v[x]).join(" + ")} - ${v[k]} = ${v.out}` });
  });
  return rules;
}

function diamondCenterSvg(v, blank) {
  const at = { top: [66, 20], right: [112, 66], bottom: [66, 112], left: [20, 66] };
  let body = "";
  const order = ["top", "right", "bottom", "left", "top"];
  for (let i = 0; i < 4; i += 1) {
    const [x1, y1] = at[order[i]];
    const [x2, y2] = at[order[i + 1]];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    body += `<line x1="${(x1 + ux * 15).toFixed(1)}" y1="${(y1 + uy * 15).toFixed(1)}" x2="${(x2 - ux * 15).toFixed(1)}" y2="${(y2 - uy * 15).toFixed(1)}" style="stroke:${LINE};stroke-width:1.5"/>`;
  }
  DIA_KEYS.forEach((k) => { body += circleNode(at[k][0], at[k][1], v[k], false); });
  body += blank ? `<circle cx="66" cy="66" r="12" style="fill:${BLANK_FILL}"/>` : text(66, 72, v.out, { size: 18 });
  return svgWrap(132, 132, body, isBlankLabel(blank));
}

function diamondCenterSigned({ difficulty = 2 }) {
  const rules = diamondSignedRules();
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const rule = pick(difficulty === 1 ? rules.slice(0, 3) : rules.slice(1));
    const items = makeRuleExamples(rules, rule, () => ({ top: randomInt(1, 9), right: randomInt(1, 9), bottom: randomInt(1, 9), left: randomInt(1, 9) }), { max: 30 });
    if (!items || items.some((x) => x.out <= 0)) continue;
    const last = items[3];
    if (!uniqueBlank(rule, last, "out")) continue;
    const html = [...items.slice(0, 3).map((v) => diamondCenterSvg(v, false)), diamondCenterSvg(last, true)].join("");
    return {
      prompt: "다음 수 사이의 관계를 찾아 색칠된 빈칸에 알맞은 수를 써넣으세요.",
      visual: { kind: "fig", html },
      answer: String(last.out),
      solution: `보기 세 그림에서 ${rule.say}(${items.slice(0, 3).map(rule.show).join(", ")}). 마지막 그림은 ${rule.show(last)}이므로 빈칸은 ${last.out}입니다.`,
      meta: { rule: rule.id, items, answer: last.out }
    };
  }
  return null;
}

export const BOOK02_STRUCTURE_GENERATORS = {
  shapeValueChainCardsB2: shapeValueChainCards,
  shapeValueManyCardsB2: shapeValueManyCards,
  shapeRatioEquationB2: shapeRatioEquation,
  balanceUnitOrderB2: balanceUnitOrder,
  balanceEqualOrderB2: balanceEqualOrder,
  balanceHeavyGivenWeightB2: balanceHeavyGivenWeight,
  balanceCountAnswerB2: balanceCountAnswer,
  balanceCountLongB2: balanceCountLong,
  sudokuFillThreeRowColumnB2: sudokuFillThreeRowColumn,
  sudokuFillThreeRegionB2: sudokuFillThreeRegion,
  sudokuFillFourSquareB2: sudokuFillFourSquare,
  sudokuFillFourSquarePairB2: sudokuFillFourSquarePair,
  sudokuFillFourIrregularB2: sudokuFillFourIrregular,
  fourNodeRelationB2: fourNodeRelation,
  digitPairTwoResultsB2: digitPairTwoResults,
  groupedTripleSequenceB2: groupedTripleSequence,
  slidingAndRepeatSequenceB2: slidingAndRepeatSequence,
  interleavedDoublingSequenceB2: interleavedDoublingSequence,
  branchingSegmentGrowthB2: branchingSegmentGrowth,
  nestedCircleDoublingB2: nestedCircleDoubling,
  diagonalBandStoneGrowthB2: diagonalBandStoneGrowth,
  alternatingRunStoneTotalB2: alternatingRunStoneTotal,
  repeatingSequenceThreePartsB2: repeatingSequenceThreeParts,
  stoneRunPatternB2: stoneRunPattern,
  matchstickGrowthTableB2: matchstickGrowthTable,
  stoneOvertakeTableB2: stoneOvertakeTable,
  foldPiecesToFoldsB2: foldPiecesToFolds,
  mixedRuleSequenceTableB2: mixedRuleSequenceTable,
  letterShapeStoneGrowthB2: letterShapeStoneGrowth,
  triangleCenterRuleB2: triangleCenterRule,
  pairStackRuleB2: pairStackRule,
  triangleCircleComposeB2: triangleCircleCompose,
  composeTwoFiguresB2: composeTwoFigures,
  cornerDigitComposeB2: cornerDigitCompose,
  rowTwoDigitRelationB2: rowTwoDigitRelation,
  overlapCircleFlowerB2: overlapCircleFlower,
  sectorCircleCornerSumB2: sectorCircleCornerSum,
  squareCornerProductB2: squareCornerProduct,
  diamondCenterSignedB2: diamondCenterSigned
};
const row = (id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases) => ({ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases });

export const BOOK02_STRUCTURE_TYPE_ROWS = [
  // 2단원 양팔저울
  row("balance-equal-order-b2", "logic", "양팔저울", "그램 없이 수평 저울 둘로 무게 순서 정하기", "balanceEqualOrderB2", "양팔저울로 무게 비교", "가장 가벼운 것을 한 칸으로 놓고 견주기", ["양팔저울", "수평", "무게 순서"]),
  row("balance-unit-order-b2", "logic", "양팔저울", "가장 가벼운 물건의 무게로 수평 저울 셋의 무게 순서 정하기", "balanceUnitOrderB2", "양팔저울로 무게 비교", "아는 무게부터 차례로 구해 견주기", ["양팔저울", "수평", "무게 순서", "그램"]),
  row("balance-heavy-given-weight-b2", "logic", "양팔저울", "무거운 물건의 무게를 나누어 다른 물건의 무게 구하기", "balanceHeavyGivenWeightB2", "양팔저울로 무게 구하기", "무거운 물건 하나를 여러 개로 나누어 내려가기", ["양팔저울", "수평", "그램", "무게 구하기"]),
  row("balance-count-answer-b2", "logic", "양팔저울", "한 물건이 다른 물건 몇 개의 무게와 같은지 구하기", "balanceCountAnswerB2", "양팔저울로 무게 구하기", "무게를 구한 뒤 몇 개와 같은지 세기", ["양팔저울", "수평", "몇 개의 무게"]),
  row("balance-count-long-b2", "logic", "양팔저울", "수평 저울 다섯으로 물건 몇 개의 무게와 같은지 구하기", "balanceCountLongB2", "양팔저울로 무게 구하기", "저울을 하나씩 따라가며 무게를 이어 구하기", ["양팔저울", "수평", "몇 개의 무게", "저울 다섯"]),
  // 2단원 도형이 나타내는 수
  row("shape-value-chain-cards-b2", "number", "도형이 나타내는 수", "이어진 숫자 카드와 도형 식으로 도형의 수 구하기", "shapeValueChainCardsB2", "도형이 나타내는 수와 식", "같은 모양 둘의 합부터 카드로 맞춰 보기", ["도형 식", "숫자 카드", "서로 다른 수"]),
  row("shape-value-many-cards-b2", "number", "도형이 나타내는 수", "띄엄띄엄 숫자 카드 여러 장과 도형 식", "shapeValueManyCardsB2", "도형이 나타내는 수와 식", "같은 모양 둘의 합이 되는 카드 짝 찾기", ["도형 식", "숫자 카드", "서로 다른 수"]),
  row("shape-ratio-equation-b2", "number", "도형이 나타내는 수", "같은 모양 여러 개 = 다른 모양 여러 개 식으로 도형의 수 구하기", "shapeRatioEquationB2", "도형이 나타내는 수와 식", "같은 모양끼리 같은 줄에서 카드 짝을 먼저 찾기", ["도형 식", "숫자 카드", "서로 다른 수", "몇 개 = 몇 개"]),
  // 3단원 규칙찾기와 수열
  row("interleaved-doubling-sequence-b2", "pattern", "수열", "한 가닥이 두 배씩 커지는 번갈아 놓인 수열", "interleavedDoublingSequenceB2", "번갈아 놓인 수열", "홀수 번째와 짝수 번째를 따로 떼어 보기", ["수열", "징검다리 수열", "두 배"]),
  row("grouped-triple-sequence-b2", "pattern", "수열", "세 개씩 묶으면 규칙이 보이는 수열 두 줄", "groupedTripleSequenceB2", "묶어서 보는 수열", "세 개씩 묶어 묶음 안과 묶음 사이를 따로 보기", ["수열", "묶음", "세 개씩"]),
  row("sliding-repeat-sequence-b2", "pattern", "수열", "묶음이 밀려 나가는 수열과 같은 수를 되풀이하는 수열", "slidingAndRepeatSequenceB2", "묶어서 보는 수열", "같은 수가 몇 번씩 나오는지 세어 묶기", ["수열", "묶음", "되풀이"]),
  row("diagonal-band-stone-growth-b2", "pattern", "바둑돌 규칙", "정사각형 판의 비스듬한 줄 바둑돌 개수", "diagonalBandStoneGrowthB2", "늘어나는 바둑돌", "전체 돌에서 비스듬한 줄의 돌을 빼기", ["바둑돌", "대각선", "단계"]),
  row("alternating-run-stone-total-b2", "pattern", "바둑돌 규칙", "하나씩 더 많이 번갈아 놓은 두 색 바둑돌의 개수 차", "alternatingRunStoneTotalB2", "늘어나는 바둑돌", "같은 색 묶음을 차례로 적어 전체 개수까지 세기", ["바둑돌", "번갈아", "개수 차"]),
  row("branching-segment-growth-b2", "pattern", "선분 규칙", "끝마다 가지를 쳐 나가는 선분의 개수", "branchingSegmentGrowthB2", "가지 치는 그림", "새로 그린 선분이 몇 배씩 느는지 보고 더하기", ["선분", "가지", "두 배"]),
  row("repeating-sequence-three-parts-b2", "pattern", "수열", "되풀이 마디 길이가 다른 수열 세 줄의 다음 수", "repeatingSequenceThreePartsB2", "되풀이되는 수열", "같은 수가 다시 나오는 자리를 찾아 몇 개씩 되풀이되는지 세기", ["수열", "반복", "되풀이", "마디"]),
  row("stone-run-pattern-b2", "pattern", "바둑돌 규칙", "묶음으로 되풀이되는 두 색 바둑돌 줄의 다음 돌", "stoneRunPatternB2", "되풀이되는 수열", "같은 색이 몇 개씩 이어지는지 묶어 한 마디를 찾기", ["바둑돌", "반복", "패턴", "다음 돌"]),
  row("matchstick-growth-table-b2", "pattern", "성냥개비 규칙", "성냥개비로 모양을 이어 만들 때 표를 채우고 개수 구하기", "matchstickGrowthTableB2", "늘어나는 성냥개비", "처음 모양의 개수에 하나씩 이을 때 느는 개수를 더하기", ["성냥개비", "표", "이어 붙이기"]),
  row("stone-overtake-table-b2", "pattern", "바둑돌 규칙", "검은 돌·흰 돌 표를 채워 흰 돌이 처음 더 많아지는 단계 찾기", "stoneOvertakeTableB2", "늘어나는 바둑돌", "검은 돌과 흰 돌의 표를 나란히 채워 견주기", ["바둑돌", "표", "처음으로 많아지는"]),
  row("fold-pieces-to-folds-b2", "pattern", "종이 접기 규칙", "자른 종이 수로 반으로 접은 횟수 거꾸로 구하기", "foldPiecesToFoldsB2", "두 배로 느는 규칙", "접을 때마다 두 배가 되는 표를 채워 그 수를 찾기", ["종이 접기", "두 배", "거꾸로"]),
  row("mixed-rule-sequence-table-b2", "pattern", "수열", "규칙이 서로 다른 수열 여러 줄 표 채우기", "mixedRuleSequenceTableB2", "여러 가지 수열", "이웃한 두 수의 차를 먼저 적어 보고 규칙을 가리기", ["수열", "표", "여러 규칙"]),
  row("letter-shape-stone-growth-b2", "pattern", "바둑돌 규칙", "가로줄 가운데에서 자라는 모양의 바둑돌 개수", "letterShapeStoneGrowthB2", "늘어나는 바둑돌", "한 단계에 몇 개씩 늘어나는지 보고 첫 수에 더하기", ["바둑돌", "단계", "같은 수만큼"]),
  row("nested-circle-doubling-b2", "geometry", "도형 개수 규칙", "가장 작은 원마다 원을 그려 넣는 모양의 원 개수", "nestedCircleDoublingB2", "가지 치는 그림", "새로 생기는 원이 몇 배씩 느는지 보고 더하기", ["원", "겹친 원", "두 배"]),
  // 4단원 약속
  row("triangle-center-rule-b2", "number", "수 사이의 약속", "세 점과 가운데 수의 약속으로 빈칸 구하기", "triangleCenterRuleB2", "가운데 수의 약속", "세 수를 더하거나 빼 보며 가운데 수와 견주기", ["약속", "삼각형", "가운데 수"]),
  row("pair-stack-rule-b2", "number", "수 사이의 약속", "위 두 수와 아래 두 수의 약속으로 빈칸 구하기", "pairStackRuleB2", "두 수 사이의 약속", "위 두 수와 아래 두 수의 합·차·곱을 견주기", ["약속", "두 수", "같은 합"]),
  row("triangle-circle-compose-b2", "number", "수 사이의 약속", "원 안 삼각형의 두 자리 수 약속으로 가운데 수 구하기", "triangleCircleComposeB2", "두 자리 수를 만드는 약속", "위 두 수로 두 자리 수를 만들어 아래 수와 계산해 보기", ["약속", "두 자리 수", "삼각형"]),
  row("compose-two-figures-b2", "number", "수 사이의 약속", "삼각형과 네모에서 두 자리 수를 만드는 약속 두 가지", "composeTwoFiguresB2", "두 자리 수를 만드는 약속", "어느 두 수로 두 자리 수를 만드는지 차례를 바꿔 견주기", ["약속", "두 자리 수", "네모", "삼각형"]),
  row("corner-digit-compose-b2", "number", "수 사이의 약속", "세 모서리 수로 가운데 두 자리 수를 만드는 약속", "cornerDigitComposeB2", "두 자리 수를 만드는 약속", "가운데 수의 십의 자리와 일의 자리를 따로 보고 모서리 수와 견주기", ["약속", "두 자리 수", "모서리"]),
  row("row-two-digit-relation-b2", "number", "수 사이의 약속", "네 칸 줄에서 양 끝 수와 가운데 두 자리 수의 관계", "rowTwoDigitRelationB2", "두 자리 수를 만드는 약속", "가운데 두 수로 두 자리 수를 만들어 양 끝 수의 합·차와 견주기", ["약속", "두 자리 수", "수 표"]),
  row("overlap-circle-flower-b2", "number", "수 사이의 약속", "겹친 다섯 원에서 겹친 곳의 수 구하기", "overlapCircleFlowerB2", "네 수 사이의 약속", "겹친 곳의 수를 양쪽 두 원의 수와 견주기", ["약속", "겹친 원", "합", "차"]),
  row("sector-circle-corner-sum-b2", "number", "수 사이의 약속", "세 칸 원과 네 모서리 네모의 약속", "sectorCircleCornerSumB2", "가운데 수의 약속", "위 두 칸과 아래 칸, 네 모서리와 가운데를 따로 견주기", ["약속", "원", "네모", "모서리"]),
  row("square-corner-product-b2", "number", "수 사이의 약속", "네모 네 모서리 수의 합·곱으로 가운데 수 구하기", "squareCornerProductB2", "가운데 수의 약속", "네 수의 합부터 구해 가운데 수와 견주고, 안 맞으면 두 수씩 묶어 곱해 보기", ["약속", "수 퍼즐", "곱"]),
  row("diamond-center-signed-b2", "number", "수 사이의 약속", "마름모 네 수에서 세 수를 더하고 한 수를 빼는 약속", "diamondCenterSignedB2", "가운데 수의 약속", "네 수의 합과 가운데 수의 차이를 보고 어느 수를 뺐는지 찾기", ["약속", "마름모", "가운데 수"]),
  row("four-node-relation-b2", "number", "수 사이의 약속", "가운데 없이 놓인 네 수의 규칙으로 빈칸 구하기", "fourNodeRelationB2", "네 수 사이의 약속", "보기 그림마다 합을 견주어 규칙 찾기", ["약속", "규칙", "네 수"]),
  row("digit-pair-two-results-b2", "number", "수 사이의 약속", "두 수로 만든 두 결과의 약속으로 ㉠·㉡ 구하기", "digitPairTwoResultsB2", "두 자리 수를 만드는 약속", "두 수로 만든 두 자리 수와 두 수의 계산을 따로 찾기", ["약속", "두 자리 수", "규칙"]),
  // 4단원 스도쿠(판 전체 채우기)
  row("sudoku-fill-three-row-column-b2", "logic", "스도쿠", "1부터 3까지 가로·세로 스도쿠 판 두 개 완성하기", "sudokuFillThreeRowColumnB2", "스도쿠 판 완성하기", "빠진 수가 하나뿐인 칸부터 채우기", ["스도쿠", "3×3", "판 완성"]),
  row("sudoku-fill-three-region-b2", "logic", "스도쿠", "1부터 3까지 굵은 선 스도쿠 판 완성하기", "sudokuFillThreeRegionB2", "스도쿠 판 완성하기", "굵은 선 안도 함께 보며 칸 채우기", ["스도쿠", "3×3", "굵은 선", "판 완성"]),
  row("sudoku-fill-four-square-pair-b2", "logic", "스도쿠", "1부터 4까지 네모 굵은 칸 스도쿠 판 두 개 완성하기", "sudokuFillFourSquarePairB2", "스도쿠 판 완성하기", "굵은 네모 안에서 빠진 수 찾기", ["스도쿠", "4×4", "판 완성"]),
  row("sudoku-fill-four-square-b2", "logic", "스도쿠", "1부터 4까지 네모 굵은 칸 스도쿠 판 완성하기", "sudokuFillFourSquareB2", "스도쿠 판 완성하기", "굵은 네모 안에서 빠진 수 찾기", ["스도쿠", "4×4", "판 완성"]),
  row("sudoku-fill-four-irregular-b2", "logic", "스도쿠", "1부터 4까지 여러 모양 굵은 칸 스도쿠 판 완성하기", "sudokuFillFourIrregularB2", "스도쿠 판 완성하기", "굵은 선 모양을 따라 한 칸씩 채우기", ["스도쿠", "4×4", "불규칙", "판 완성"])
];

export const BOOK02_STRUCTURE_GUIDES = {
  "balance-equal-order-b2": "가장 가벼운 물건 하나를 한 칸으로 놓고, 수평인 저울마다 다른 물건이 몇 칸인지 구해 견줍니다.",
  "balance-unit-order-b2": "무게를 아는 물건부터 저울을 하나씩 따라가며 무게를 구한 뒤 무거운 차례로 늘어놓습니다.",
  "balance-heavy-given-weight-b2": "무거운 물건 하나가 가벼운 물건 몇 개와 같은지 보고 나누어 내려간 뒤, 구한 무게로 다음 저울을 풉니다.",
  "balance-count-answer-b2": "저울을 따라 두 물건의 무게를 구한 다음, 한 물건의 무게가 다른 물건 몇 개의 무게인지 셉니다.",
  "balance-count-long-b2": "저울마다 새로 나오는 물건이 하나씩이므로 앞 저울에서 구한 무게로 다음 저울을 차례로 풉니다.",
  "shape-value-chain-cards-b2": "같은 모양 둘을 더한 식부터 카드를 넣어 보고, 될 수 있는 수만 남겨 다음 식으로 좁힙니다.",
  "shape-value-many-cards-b2": "같은 모양 둘을 더한 식마다 카드 짝을 찾고, 여러 식에 함께 맞는 수만 남깁니다.",
  "shape-ratio-equation-b2": "같은 모양 몇 개와 다른 모양 몇 개가 같은 식에서 카드 짝을 먼저 찾고, 나머지 식에 차례로 넣습니다.",
  "interleaved-doubling-sequence-b2": "홀수 번째 수와 짝수 번째 수를 따로 떼어 적고, 한 가닥은 같은 수만큼 커지는지 두 배씩 커지는지 봅니다.",
  "grouped-triple-sequence-b2": "세 개씩 묶어 묶음 안에서 얼마씩 변하는지, 묶음의 첫 수가 얼마씩 변하는지 따로 찾습니다.",
  "sliding-repeat-sequence-b2": "몇 개씩 묶이는지 먼저 찾고, 묶음마다 수가 어떻게 바뀌는지 또는 같은 수가 몇 번씩 나오는지 셉니다.",
  "diagonal-band-stone-growth-b2": "그 단계의 한 줄 돌 수로 전체 돌 수를 구하고, 비스듬한 줄의 검은 돌을 세어 뺍니다.",
  "alternating-run-stone-total-b2": "같은 색 묶음을 1개, 2개, 3개 …로 차례로 적어 전체 개수가 될 때까지 더하고, 마지막 묶음은 남은 만큼만 셉니다.",
  "branching-segment-growth-b2": "새로 그린 선분의 끝마다 가지가 몇 개씩 생기는지 보고, 새로 생긴 선분 수를 차례로 더합니다.",
  "nested-circle-doubling-b2": "가장 작은 원마다 안에 원이 몇 개씩 생기는지 보고, 새로 생긴 원 수를 차례로 더합니다.",
  "repeating-sequence-three-parts-b2": "맨 앞 수가 다시 나오는 자리를 찾아 몇 개씩 되풀이되는지 세고, 빈칸이 마디의 몇 번째인지 봅니다.",
  "stone-run-pattern-b2": "같은 색이 몇 개씩 이어지는지 묶음으로 적어 되풀이되는 마디를 찾고, 다음 자리를 그 마디에서 읽습니다.",
  "matchstick-growth-table-b2": "처음 모양 하나의 성냥개비 수에서 시작해, 하나를 이어 붙일 때마다 함께 쓰는 변만큼 덜 드는 수를 더합니다.",
  "stone-overtake-table-b2": "검은 돌은 테두리라 늘 같은 수만큼, 흰 돌은 안쪽이라 점점 더 많이 늘어납니다. 두 표를 나란히 채워 처음 뒤집히는 곳을 찾습니다.",
  "fold-pieces-to-folds-b2": "한 번 접을 때마다 종이 수가 두 배가 되므로 2, 4, 8, …을 차례로 적어 그 수가 되는 횟수를 찾습니다.",
  "mixed-rule-sequence-table-b2": "줄마다 이웃한 두 수의 차를 적어 보고, 차가 같은지·늘어나는지·되풀이되는지·앞의 두 수의 합인지 가립니다.",
  "letter-shape-stone-growth-b2": "다음 단계로 갈 때 어느 쪽에 몇 개씩 붙는지 세어, 첫 단계의 개수에 그만큼씩 더합니다.",
  "triangle-center-rule-b2": "세 수의 합과 가운데 수를 먼저 견주고, 안 맞으면 한 수를 빼 보며 세 그림에 모두 맞는 규칙을 찾습니다.",
  "pair-stack-rule-b2": "위 두 수와 아래 두 수의 합, 차, 곱을 차례로 견주어 세 그림에 모두 맞는 것을 찾습니다.",
  "triangle-circle-compose-b2": "위 두 수로 두 자리 수를 만든 뒤 아래 수를 더하거나 빼 보며 가운데 수와 견줍니다.",
  "compose-two-figures-b2": "어느 두 수를 십의 자리·일의 자리로 묶는지 바꿔 보며 가운데 수와 맞는 차례를 찾습니다.",
  "corner-digit-compose-b2": "가운데 두 자리 수의 십의 자리와 일의 자리를 나누어, 어느 모서리 수(또는 두 수의 합)와 같은지 찾습니다.",
  "row-two-digit-relation-b2": "가운데 두 수로 두 자리 수를 만들고, 양 끝 두 수의 합이나 차와 같은지 줄마다 견줍니다.",
  "overlap-circle-flower-b2": "겹친 곳의 수를 양쪽 두 원의 수와 견주어 합인지 차인지 찾고, 빈 곳에도 같은 셈을 합니다.",
  "sector-circle-corner-sum-b2": "원은 위 두 칸으로 아래 칸을 만드는 셈을, 네모는 네 모서리로 가운데를 만드는 셈을 따로 찾습니다.",
  "square-corner-product-b2": "네 수의 합을 구해 가운데 수와 견주고, 맞지 않으면 두 수씩 묶어 합을 곱해 봅니다.",
  "diamond-center-signed-b2": "네 수의 합과 가운데 수의 차이를 보고, 어느 수를 빼야 가운데 수가 되는지 찾습니다.",
  "four-node-relation-b2": "보기 그림마다 한 수가 나머지의 합인지, 마주 보는 두 수의 합이 같은지 견주어 규칙을 찾습니다.",
  "digit-pair-two-results-b2": "두 수로 두 자리 수를 만들어 가운데 칸과 견주고, 아래 칸은 두 수의 계산으로 따로 찾습니다.",
  "sudoku-fill-three-row-column-b2": "가로줄과 세로줄에서 이미 있는 수를 빼면 하나만 남는 칸부터 채웁니다.",
  "sudoku-fill-three-region-b2": "가로줄·세로줄·굵은 선 안에 이미 있는 수를 빼면 하나만 남는 칸부터 채웁니다.",
  "sudoku-fill-four-square-pair-b2": "굵은 네모 안과 가로·세로에 없는 수가 하나뿐인 칸부터 채우고, 채운 수로 다음 칸을 찾습니다.",
  "sudoku-fill-four-square-b2": "굵은 네모 안과 가로·세로에 없는 수가 하나뿐인 칸부터 채우고, 채운 수로 다음 칸을 찾습니다.",
  "sudoku-fill-four-irregular-b2": "굵은 선 모양이 네모가 아니어도 그 안에 1부터 4까지 한 번씩 — 한 수가 갈 곳이 한 칸뿐인 곳을 찾습니다."
};

const B = "book-02";
export const BOOK02_STRUCTURE_REMAPS = [
  // 2단원 양팔저울
  [B, 2, "activity", 1, [2], "balance-equal-order-b2"],
  [B, 2, "activity", 1, [3, 4], "balance-unit-order-b2"],
  [B, 2, "practice", 1, [3, 4], "balance-unit-order-b2"],
  [B, 2, "advanced", 1, [1], "balance-unit-order-b2"],
  [B, 2, "check", 1, [1, 2, 3], "balance-heavy-given-weight-b2"],
  [B, 2, "practice", 1, [5, 6, 8], "balance-heavy-given-weight-b2"],
  [B, 2, "check", 1, [4], "balance-count-answer-b2"],
  [B, 2, "practice", 1, [7], "balance-count-answer-b2"],
  [B, 2, "advanced", 1, [2], "balance-count-long-b2"],
  // 2단원 도형이 나타내는 수
  [B, 2, "activity", 2, [1, 2, 3, 4], "shape-value-chain-cards-b2"],
  [B, 2, "practice", 1, [11, 12], "shape-value-chain-cards-b2"],
  [B, 2, "practice", 1, [9], "shape-value-many-cards-b2"],
  [B, 2, "check", 2, [1, 2, 3, 4], "shape-ratio-equation-b2"],
  [B, 2, "practice", 1, [10, 13, 14, 15, 16, 17, 18], "shape-ratio-equation-b2"],
  [B, 2, "advanced", 1, [3, 4], "shape-ratio-equation-b2"],
  // 3단원 규칙찾기와 수열
  [B, 3, "check", 1, [1], "interleaved-doubling-sequence-b2"],
  [B, 3, "check", 1, [2], "grouped-triple-sequence-b2"],
  [B, 3, "practice", 1, [7], "grouped-triple-sequence-b2"],
  [B, 3, "check", 1, [3], "sliding-repeat-sequence-b2"],
  [B, 3, "practice", 1, [14], "diagonal-band-stone-growth-b2"],
  [B, 3, "practice", 1, [17], "branching-segment-growth-b2"],
  [B, 3, "advanced", 1, [1], "alternating-run-stone-total-b2"],
  [B, 3, "advanced", 1, [2], "nested-circle-doubling-b2"],
  [B, 3, "activity", 1, [1], "repeating-sequence-three-parts-b2"],
  [B, 3, "practice", 1, [2], "repeating-sequence-three-parts-b2"],
  [B, 3, "activity", 1, [2], "stone-run-pattern-b2"],
  [B, 3, "practice", 1, [3], "stone-run-pattern-b2"],
  [B, 3, "activity", 2, [1, 2], "matchstick-growth-table-b2"],
  [B, 3, "activity", 2, [3, 4], "stone-overtake-table-b2"],
  [B, 3, "advanced", 1, [3], "fold-pieces-to-folds-b2"],
  [B, 3, "practice", 1, [1], "mixed-rule-sequence-table-b2"],
  [B, 3, "practice", 1, [11], "letter-shape-stone-growth-b2"],
  // 4단원 약속
  [B, 4, "activity", 1, [2], "compose-two-figures-b2"],
  [B, 4, "activity", 1, [3], "corner-digit-compose-b2"],
  [B, 4, "activity", 1, [4], "row-two-digit-relation-b2"],
  [B, 4, "check", 1, [1], "triangle-center-rule-b2"],
  [B, 4, "check", 1, [3], "pair-stack-rule-b2"],
  [B, 4, "practice", 1, [3], "triangle-circle-compose-b2"],
  [B, 4, "practice", 1, [5], "overlap-circle-flower-b2"],
  [B, 4, "practice", 1, [6], "sector-circle-corner-sum-b2"],
  [B, 4, "advanced", 1, [1], "square-corner-product-b2"],
  [B, 4, "advanced", 1, [2], "diamond-center-signed-b2"],
  [B, 4, "activity", 1, [1], "four-node-relation-b2"],
  [B, 4, "check", 1, [4], "four-node-relation-b2"],
  [B, 4, "practice", 1, [1, 2, 4], "four-node-relation-b2"],
  [B, 4, "check", 1, [2], "digit-pair-two-results-b2"],
  [B, 4, "practice", 1, [8], "digit-pair-two-results-b2"],
  // 4단원 스도쿠
  [B, 4, "activity", 2, [1], "sudoku-fill-three-row-column-b2"],
  [B, 4, "practice", 1, [10], "sudoku-fill-three-row-column-b2"],
  [B, 4, "practice", 1, [9], "sudoku-fill-three-region-b2"],
  [B, 4, "activity", 2, [2, 3], "sudoku-fill-four-square-pair-b2"],
  [B, 4, "practice", 1, [11, 12], "sudoku-fill-four-square-b2"],
  [B, 4, "check", 2, [1, 2, 3, 4], "sudoku-fill-four-irregular-b2"],
  [B, 4, "practice", 1, [13, 14], "sudoku-fill-four-irregular-b2"],
  [B, 4, "advanced", 1, [3, 4], "sudoku-fill-four-irregular-b2"]
];

// 내부 확인용(검사 스크립트가 쓴다)
export const BOOK02_STRUCTURE_INTERNALS = { solveShapeEquations, countShapeSolutions, allRegionLayouts, regionIsLine };
