// 1과정 2권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK02_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK02_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK02_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK02_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
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
  digitPairTwoResultsB2: digitPairTwoResults
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
  // 4단원 약속
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
  // 4단원 약속
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
