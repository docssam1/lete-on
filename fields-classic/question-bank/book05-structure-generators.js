// 1과정 5권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK05_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK05_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK05_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK05_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   3단원 도형식(수 카드) — 목록·십자·삼각 배치, 순서 조건, 한 모양 / 두 모양의 합 / 쓰이지 않은 카드.
//        답이 하나인지는 모든 카드 배치를 다 넣어 보는 풀이기로, 아이가 풀 수 있는지는 「식마다 가능한 경우만 남기기」
//        풀이기로 확인한다(이 풀이기만으로 모든 모양이 정해지지 않으면 다시 뽑는다). 풀이 글도 그 차례 그대로 쓴다.
//   3단원 이웃한 두 원의 곱 — 삼각형 여러 개 · 사각형 두 개 · 큰 다각형, 원을 모두 채우기(범위 안에서 답 하나).
//   1단원 정사각 층 수 배열(ㄱ자 · 층마다 방향이 바뀌는 것) · 같은 요일 두 날짜의 합 → 다른 날의 요일.
//   4단원 1…n…1 줄의 합 · 1×n 띠의 직사각형 수 · 삼각수 표.

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const pick = (list) => list[randomInt(0, list.length - 1)];

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 수 뒤 받침: 끝자리 2·4·5·9는 받침 없음(이·사·오·구), 나머지(영·일·삼·육·칠·팔·십·백)는 받침 있음.
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(n) % 10);
const josa = (n, withBatchim, without) => `${n}${hasBatchim(n) ? withBatchim : without}`;

const INK = "#2f2a24";
const FONT = "font-family:'Noto Sans KR','FC Sans',sans-serif";
const MARKS = ["㉠", "㉡", "㉢", "㉣"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const ORDINAL = ["첫", "두", "세", "네", "다섯"];

const svgOpen = (w, h, label) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="width:${w}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">`;
const text = (x, y, value, size = 18, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;

// ── 모양 ─────────────────────────────────────────────

const SHAPES = Object.freeze([
  { key: "circle", ch: "○" },
  { key: "triangle", ch: "△" },
  { key: "square", ch: "□" },
  { key: "diamond", ch: "◇" },
  { key: "plus", ch: "✚" },
  { key: "pentagon", ch: "⬠" },
  { key: "heart", ch: "♡" },
  { key: "star", ch: "☆" }
]);

function glyph(key, cx, cy, r = 13) {
  const line = `fill="#fff" stroke="${INK}" stroke-width="1.7" stroke-linejoin="round"`;
  const pts = (list) => list.map(([x, y]) => `${(cx + x * r).toFixed(1)},${(cy + y * r).toFixed(1)}`).join(" ");
  switch (key) {
    case "circle": return `<circle cx="${cx}" cy="${cy}" r="${r}" ${line}/>`;
    case "triangle": return `<polygon points="${pts([[0, -1.05], [1.08, 0.85], [-1.08, 0.85]])}" ${line}/>`;
    case "square": return `<rect x="${cx - r * 0.92}" y="${cy - r * 0.92}" width="${r * 1.84}" height="${r * 1.84}" ${line}/>`;
    case "diamond": return `<polygon points="${pts([[0, -1.1], [1.1, 0], [0, 1.1], [-1.1, 0]])}" ${line}/>`;
    case "plus": return `<polygon points="${pts([[-0.36, -1], [0.36, -1], [0.36, -0.36], [1, -0.36], [1, 0.36], [0.36, 0.36], [0.36, 1], [-0.36, 1], [-0.36, 0.36], [-1, 0.36], [-1, -0.36], [-0.36, -0.36]])}" ${line}/>`;
    case "pentagon": return `<polygon points="${pts([[0, -1.05], [1.02, -0.3], [0.63, 0.92], [-0.63, 0.92], [-1.02, -0.3]])}" ${line}/>`;
    case "heart": return `<path d="M${cx} ${cy + r * 0.95}C${cx - r * 1.5} ${cy - r * 0.05} ${cx - r * 0.95} ${cy - r * 1.25} ${cx} ${cy - r * 0.45}C${cx + r * 0.95} ${cy - r * 1.25} ${cx + r * 1.5} ${cy - r * 0.05} ${cx} ${cy + r * 0.95}Z" ${line}/>`;
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

// 수 카드 줄(작은 네모 카드)
function cardsSvg(cards, { label = "수 카드" } = {}) {
  const w = 32;
  const gap = 6;
  const width = cards.length * w + (cards.length - 1) * gap + 4;
  let body = "";
  cards.forEach((value, i) => {
    const x = 2 + i * (w + gap);
    body += `<rect x="${x}" y="2" width="${w}" height="38" rx="5" style="fill:#fff6d6;stroke:#a87c22;stroke-width:1.5"/>`;
    body += text(x + w / 2, 28, value, 19, 'font-weight="700"');
  });
  return `${svgOpen(width, 42, `${label} ${cards.join(", ")}`)}${body}</svg>`;
}

// ── 도형식 풀이기 ─────────────────────────────────────
// 식: { L: [모양 번호…], lop, R: [모양 번호…], rop } — 한쪽이 모양 하나면 op는 null.

const apply = (op, a, b) => (op === "×" ? a * b : op === "+" ? a + b : a - b);
const sideValue = (side, op, vals) => side.slice(1).reduce((acc, s) => apply(op, acc, vals[s]), vals[side[0]]);
const holds = (eq, vals) => sideValue(eq.L, eq.lop, vals) === sideValue(eq.R, eq.rop, vals);
const shapesOf = (eq) => [...new Set([...eq.L, ...eq.R])];

function eqText(eq, sh) {
  const side = (list, op) => list.map((s) => sh[s].ch).join(` ${op} `);
  return `${side(eq.L, eq.lop)} = ${side(eq.R, eq.rop)}`;
}
function eqValueText(eq, vals) {
  const side = (list, op) => list.map((s) => vals[s]).join(` ${op} `);
  return `${side(eq.L, eq.lop)} = ${side(eq.R, eq.rop)}`;
}

// 모든 카드 배치(모양마다 서로 다른 카드)를 넣어 본다. limit개까지 센다.
function bruteSolutions(k, cards, eqs, orders, limit = 3) {
  const order = [];
  eqs.forEach((eq) => shapesOf(eq).forEach((s) => { if (!order.includes(s)) order.push(s); }));
  for (let s = 0; s < k; s += 1) if (!order.includes(s)) order.push(s);
  const position = new Map(order.map((s, i) => [s, i]));
  const ready = order.map(() => []);
  eqs.forEach((eq) => { ready[Math.max(...shapesOf(eq).map((s) => position.get(s)))].push(eq); });
  const readyOrders = order.map(() => []);
  orders.forEach((o) => { readyOrders[Math.max(position.get(o.small), position.get(o.big))].push(o); });
  const vals = new Array(k);
  const used = new Set();
  const found = [];
  const visit = (i) => {
    if (found.length >= limit) return;
    if (i === order.length) { found.push([...vals]); return; }
    const s = order[i];
    for (const v of cards) {
      if (used.has(v)) continue;
      vals[s] = v;
      if (ready[i].every((eq) => holds(eq, vals)) && readyOrders[i].every((o) => vals[o.small] < vals[o.big])) {
        used.add(v);
        visit(i + 1);
        used.delete(v);
      }
    }
  };
  visit(0);
  return found;
}

// 아이가 하는 생각: 식마다 들어갈 수 있는 경우만 남기고(서로 다른 카드), 정해진 수는 다른 모양에서 지운다.
// 카드 수와 모양 수가 같으면 「한 모양에만 들어갈 수 있는 카드」도 쓴다.
function kidSolve(k, cards, eqs, orders, sh) {
  const domains = Array.from({ length: k }, () => new Set(cards));
  const steps = [];
  const fixedOrder = [];
  const isFixed = (s) => domains[s].size === 1;
  const valueOf = (s) => [...domains[s]][0];
  const noteFixed = (before) => {
    const now = [];
    for (let s = 0; s < k; s += 1) if (!before[s] && isFixed(s)) { now.push(s); fixedOrder.push(s); }
    return now;
  };
  const snapshot = () => domains.map((d, s) => isFixed(s));
  const tuplesFor = (eq) => {
    const list = shapesOf(eq);
    const relevant = orders.filter((o) => list.includes(o.small) && list.includes(o.big));
    const out = [];
    const vals = new Array(k);
    const used = new Set();
    const visit = (i) => {
      if (i === list.length) {
        if (holds(eq, vals) && relevant.every((o) => vals[o.small] < vals[o.big])) out.push(list.map((s) => vals[s]));
        return;
      }
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
  const instance = (eq, list, tuple) => {
    const vals = new Array(k);
    list.forEach((s, i) => { vals[s] = tuple[i]; });
    return eqValueText(eq, vals);
  };
  for (let guard = 0; guard < 60; guard += 1) {
    let changed = false;
    // 식 하나씩
    for (const eq of eqs) {
      const { list, out } = tuplesFor(eq);
      if (!out.length) return { solved: false, steps, domains, fixedOrder };
      const before = snapshot();
      let shrunk = false;
      list.forEach((s, i) => {
        const allowed = new Set(out.map((t) => t[i]));
        if (allowed.size < domains[s].size) { domains[s] = allowed; shrunk = true; }
      });
      if (!shrunk) continue;
      changed = true;
      const fixedNow = noteFixed(before);
      const fixedText = fixedNow.map((s) => `${sh[s].ch} = ${valueOf(s)}`).join(", ");
      if (out.length === 1) steps.push(`${eqText(eq, sh)}에서 될 수 있는 것은 ${instance(eq, list, out[0])} 하나뿐이므로 ${fixedText}입니다.`);
      else if (out.length <= 3 && fixedNow.length) steps.push(`${eqText(eq, sh)}에서 될 수 있는 것은 ${out.map((t) => instance(eq, list, t)).join(", ")}이므로 어느 경우든 ${fixedText}입니다.`);
      else if (out.length <= 3) steps.push(`${eqText(eq, sh)}에서 될 수 있는 것은 ${out.map((t) => instance(eq, list, t)).join(" 또는 ")}입니다.`);
      else if (fixedNow.length) steps.push(`${eqText(eq, sh)}에서 될 수 있는 경우는 여럿이지만 어느 경우든 ${fixedText}입니다.`);
      break; // 한 식으로 좁힌 뒤에는 처음 식부터 다시 본다(풀이 차례가 아이 손 차례와 같게)
    }
    if (changed) continue;
    // 순서 조건
    for (const o of orders) {
      const before = snapshot();
      const maxBig = Math.max(...domains[o.big]);
      const minSmall = Math.min(...domains[o.small]);
      const a = new Set([...domains[o.small]].filter((v) => v < maxBig));
      const b = new Set([...domains[o.big]].filter((v) => v > minSmall));
      if (a.size < domains[o.small].size || b.size < domains[o.big].size) {
        domains[o.small] = a;
        domains[o.big] = b;
        changed = true;
        const fixedNow = noteFixed(before);
        if (fixedNow.length) steps.push(`${sh[o.small].ch} < ${sh[o.big].ch}이므로 ${fixedNow.map((s) => `${sh[s].ch} = ${valueOf(s)}`).join(", ")}입니다.`);
        break;
      }
    }
    if (changed) continue;
    // 정해진 수는 다른 모양에 쓸 수 없다
    for (let s = 0; s < k && !changed; s += 1) {
      if (!isFixed(s)) continue;
      const v = valueOf(s);
      for (let t = 0; t < k; t += 1) {
        if (t === s || !domains[t].has(v)) continue;
        const before = snapshot();
        domains[t].delete(v);
        if (!domains[t].size) return { solved: false, steps, domains, fixedOrder };
        changed = true;
        const fixedNow = noteFixed(before);
        if (fixedNow.length) steps.push(`${josa(v, "은", "는")} 이미 ${sh[s].ch}에 썼으므로 ${fixedNow.map((u) => `${sh[u].ch} = ${valueOf(u)}`).join(", ")}입니다.`);
      }
    }
    if (changed) continue;
    // 카드를 모두 쓰는 문제: 한 모양에만 들어갈 수 있는 카드
    if (cards.length === k) {
      for (const v of cards) {
        const homes = [];
        for (let s = 0; s < k; s += 1) if (domains[s].has(v)) homes.push(s);
        if (homes.length === 1 && domains[homes[0]].size > 1) {
          const before = snapshot();
          domains[homes[0]] = new Set([v]);
          noteFixed(before);
          steps.push(`남은 카드 ${josa(v, "은", "는")} ${sh[homes[0]].ch}에만 넣을 수 있으므로 ${sh[homes[0]].ch} = ${v}입니다.`);
          changed = true;
          break;
        }
      }
    }
    if (!changed) break;
  }
  const solved = domains.every((d) => d.size === 1);
  return { solved, steps, domains, fixedOrder, values: solved ? domains.map((d) => [...d][0]) : null };
}

// 답이 하나뿐이고 아이 풀이기로 다 풀리는지. 두 모양이 맞바뀐 답이 하나 더 있으면 순서 조건을 붙여 본다.
function settle(k, cards, eqs, truth, sh, allowOrder) {
  let orders = [];
  let sols = bruteSolutions(k, cards, eqs, orders);
  if (sols.length === 2 && allowOrder) {
    const other = sols.find((sol) => sol.some((v, i) => v !== truth[i]));
    const diff = other ? other.map((v, i) => (v !== truth[i] ? i : -1)).filter((i) => i >= 0) : [];
    if (diff.length === 2 && other[diff[0]] === truth[diff[1]] && other[diff[1]] === truth[diff[0]]) {
      const [a, b] = diff;
      orders = [truth[a] < truth[b] ? { small: a, big: b } : { small: b, big: a }];
      sols = bruteSolutions(k, cards, eqs, orders);
    }
  }
  if (sols.length !== 1 || sols[0].some((v, i) => v !== truth[i])) return null;
  const kid = kidSolve(k, cards, eqs, orders, sh);
  if (!kid.solved) return null;
  return { orders, kid };
}

// ── 목록 배치: 식 3~5개 ─────────────────────────────

function candidateEquations(vals, forms) {
  const k = vals.length;
  const out = [];
  const add = (form, eq) => { if (forms.includes(form)) out.push({ form, ...eq }); };
  for (let i = 0; i < k; i += 1) {
    for (let j = 0; j < k; j += 1) {
      if (i === j) continue;
      if (vals[i] * vals[i] === vals[j]) add("sq", { L: [i, i], lop: "×", R: [j], rop: null });
      if (vals[i] ** 3 === vals[j]) add("cube", { L: [i, i, i], lop: "×", R: [j], rop: null });
      for (let l = 0; l < k; l += 1) {
        if (l === i || l === j) continue;
        if (i < j && vals[i] * vals[j] === vals[l]) add("mul", { L: [i, j], lop: "×", R: [l], rop: null });
        if (i < j && vals[i] + vals[j] === vals[l]) add("add", { L: [i, j], lop: "+", R: [l], rop: null });
        if (vals[i] - vals[j] === vals[l]) add("sub", { L: [i, j], lop: "−", R: [l], rop: null });
        if (i < j && vals[i] + vals[j] === 2 * vals[l]) add("addDouble", { L: [i, j], lop: "+", R: [l, l], rop: "+" });
        if (j < l && vals[i] * vals[i] === vals[j] * vals[l]) add("sqmul", { L: [i, i], lop: "×", R: [j, l], rop: "×" });
        for (let m = 0; m < k; m += 1) {
          if ([i, j, l].includes(m)) continue;
          if (i < j && l < m && i < l && vals[i] * vals[j] === vals[l] * vals[m]) add("mul2", { L: [i, j], lop: "×", R: [l, m], rop: "×" });
          if (i < j && j < l && vals[i] + vals[j] + vals[l] === vals[m]) add("add3", { L: [i, j, l], lop: "+", R: [m], rop: null });
        }
      }
    }
  }
  return out;
}

const MULTIPLICATIVE = ["sq", "cube", "mul", "mul2", "sqmul"];

function makeListNetwork({ shapes, extraCards = 0, eqCount, forms, pool }) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const cards = shuffle(pool).slice(0, shapes + extraCards).sort((a, b) => a - b);
    const used = shuffle(cards).slice(0, shapes);
    const vals = used;
    const cands = candidateEquations(vals, forms);
    if (cands.filter((eq) => MULTIPLICATIVE.includes(eq.form)).length < 1) continue;
    for (let tryPick = 0; tryPick < 30; tryPick += 1) {
      const chosen = [];
      const covered = new Set();
      for (const eq of shuffle(cands)) {
        if (chosen.length >= eqCount) break;
        const sameForm = chosen.filter((c) => c.form === eq.form).length;
        if (sameForm >= 2) continue;
        if (chosen.filter((c) => !MULTIPLICATIVE.includes(c.form)).length >= 2 && !MULTIPLICATIVE.includes(eq.form)) continue;
        if (chosen.some((c) => eqText(c, SHAPES) === eqText(eq, SHAPES))) continue;
        const fresh = shapesOf(eq).filter((s) => !covered.has(s)).length;
        if (!fresh && chosen.length < eqCount - 1 && Math.random() < 0.7) continue;
        chosen.push(eq);
        shapesOf(eq).forEach((s) => covered.add(s));
      }
      if (chosen.length !== eqCount || covered.size !== shapes) continue;
      if (!chosen.some((eq) => MULTIPLICATIVE.includes(eq.form))) continue;
      const sh = shuffle(SHAPES).slice(0, shapes);
      const settled = settle(shapes, cards, chosen, vals, sh, true);
      if (!settled) continue;
      if (settled.kid.steps.length < 2 || settled.kid.steps.length > 6) continue;
      return { cards, vals, eqs: chosen, sh, ...settled };
    }
  }
  return null;
}

// ── 십자·삼각 배치 ───────────────────────────────────
// 십자: 위 TL op TM = TR, 왼쪽 TL op ML = BL, 오른쪽 TR op MR = BR, 아래 BL op BM = BR (세로식은 위에서 아래로 읽는다)
// 삼각: 꼭대기 A, 왼쪽 A op L = BL, 오른쪽 A op R = BR, 아래 BL op BM = BR

function solveFor(op, left, right) {
  // left op x = right 인 x
  if (op === "+") return right - left;
  if (op === "−") return left - right;
  return left !== 0 && right % left === 0 ? right / left : null;
}

function makeFrame(kind, pool, ops) {
  const inPool = (v) => v != null && pool.includes(v);
  const slots = {};
  if (kind === "cross") {
    slots.TL = pick(pool);
    slots.TM = pick(pool);
    const o1 = pick(ops);
    slots.TR = apply(o1, slots.TL, slots.TM);
    slots.ML = pick(pool);
    const o2 = pick(ops);
    slots.BL = apply(o2, slots.TL, slots.ML);
    slots.MR = pick(pool);
    const o3 = pick(ops);
    slots.BR = apply(o3, slots.TR, slots.MR);
    const o4 = pick(ops);
    slots.BM = solveFor(o4, slots.BL, slots.BR);
    if (!Object.values(slots).every(inPool)) return null;
    const lines = [["TL", o1, "TM", "TR"], ["TL", o2, "ML", "BL"], ["TR", o3, "MR", "BR"], ["BL", o4, "BM", "BR"]];
    return { slots, lines };
  }
  slots.A = pick(pool);
  slots.L = pick(pool);
  const o1 = pick(ops);
  slots.BL = apply(o1, slots.A, slots.L);
  slots.R = pick(pool);
  const o2 = pick(ops);
  slots.BR = apply(o2, slots.A, slots.R);
  const o3 = pick(ops);
  slots.BM = solveFor(o3, slots.BL, slots.BR);
  if (!Object.values(slots).every(inPool)) return null;
  const lines = [["A", o1, "L", "BL"], ["A", o2, "R", "BR"], ["BL", o3, "BM", "BR"]];
  return { slots, lines };
}

function makeFrameNetwork({ kind, pool, ops, minShapes, maxShapes, extraCards = 0, needOps }) {
  for (let attempt = 0; attempt < 12000; attempt += 1) {
    const frame = makeFrame(kind, pool, ops);
    if (!frame) continue;
    const opsUsed = frame.lines.map((line) => line[1]);
    if (needOps && !needOps.every((op) => opsUsed.includes(op))) continue;
    // 한 줄이 「같은 모양 op 같은 모양」뿐이거나 0을 곱해 모든 수가 되는 식은 뺀다
    if (frame.lines.some(([a, op, b]) => op === "×" && (frame.slots[a] === 0 || frame.slots[b] === 0))) continue;
    const distinct = [...new Set(Object.values(frame.slots))];
    if (distinct.length < minShapes || distinct.length > maxShapes) continue;
    const vals = shuffle(distinct);
    const index = new Map(vals.map((v, i) => [v, i]));
    const slotShape = Object.fromEntries(Object.entries(frame.slots).map(([slot, v]) => [slot, index.get(v)]));
    const eqs = frame.lines.map(([a, op, b, c]) => ({ L: [slotShape[a], slotShape[b]], lop: op, R: [slotShape[c]], rop: null, slots: [a, b, c] }));
    if (eqs.some((eq) => (eq.L[0] === eq.R[0] && eq.L[1] === eq.R[0]) || (eq.lop === "−" && eq.L[0] === eq.L[1]))) continue;
    const spare = pool.filter((v) => !distinct.includes(v));
    const cards = [...distinct, ...shuffle(spare).slice(0, extraCards)].sort((a, b) => a - b);
    if (cards.length !== distinct.length + extraCards) continue;
    const sh = shuffle(SHAPES).slice(0, vals.length);
    const settled = settle(vals.length, cards, eqs, vals, sh, true);
    if (!settled) continue;
    if (settled.kid.steps.length < 2 || settled.kid.steps.length > 6) continue;
    return { kind, cards, vals, eqs, sh, slotShape, lines: frame.lines, ...settled };
  }
  return null;
}

// ── 도형식 그림 ─────────────────────────────────────

function tokenRow(tokens, x0, y, sh) {
  // tokens: 모양 번호 또는 글자. 너비를 계산해 그린다.
  let x = x0;
  let body = "";
  tokens.forEach((t) => {
    if (typeof t === "number") { body += glyph(sh[t].key, x + 16, y, 13); x += 32; }
    else { body += text(x + 12, y + 7, t, 20); x += 24; }
  });
  return { body, width: x - x0 };
}

function listBoardSvg(eqs, sh) {
  const rows = eqs.map((eq) => [...eq.L.flatMap((s, i) => (i ? [eq.lop, s] : [s])), "=", ...eq.R.flatMap((s, i) => (i ? [eq.rop, s] : [s]))]);
  const widths = rows.map((row) => row.reduce((w, t) => w + (typeof t === "number" ? 32 : 24), 0));
  const inner = Math.max(...widths);
  const width = inner + 44;
  const height = rows.length * 40 + 22;
  let body = `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" style="fill:#f7f3e8;stroke:#c9bda2;stroke-width:1.4"/>`;
  rows.forEach((row, i) => { body += tokenRow(row, 22, 31 + i * 40, sh).body; });
  return `${svgOpen(width, height, "도형식")}${body}</svg>`;
}

const CROSS_POS = { TL: [0, 0], TM: [2, 0], TR: [4, 0], ML: [0, 2], MR: [4, 2], BL: [0, 4], BM: [2, 4], BR: [4, 4] };
const TRI_POS = { A: [2, 0], L: [1, 2], R: [3, 2], BL: [0, 4], BM: [2, 4], BR: [4, 4] };

function frameBoardSvg(made) {
  const cell = 34;
  const pad = 22;
  const pos = made.kind === "cross" ? CROSS_POS : TRI_POS;
  const at = ([c, r]) => [pad + c * cell + cell / 2, pad + r * cell + cell / 2];
  const width = pad * 2 + cell * 5;
  const height = pad * 2 + cell * 5;
  let body = `<rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" style="fill:#f7f3e8;stroke:#c9bda2;stroke-width:1.4"/>`;
  Object.entries(pos).forEach(([slot, p]) => {
    const [x, y] = at(p);
    body += glyph(made.sh[made.slotShape[slot]].key, x, y, 13);
  });
  const sign = (p, value) => { const [x, y] = at(p); body += text(x, y + 7, value, 19); };
  made.lines.forEach(([a, op, , c]) => {
    const [ca, ra] = pos[a];
    const [cc, rc] = pos[c];
    if (ra === rc) { sign([(ca + cc) / 2 - 1, ra], op); sign([(ca + cc) / 2 + 1, ra], "="); }
    else if (ca === cc) { sign([ca, ra + 1], op); sign([ca, ra + 3], "="); }
    else {
      // 삼각형 옆변: 꼭대기와 가운데 모양 사이에 연산, 가운데 모양과 밑 모양 사이에 =
      const dir = cc < ca ? -1 : 1;
      sign([ca + dir * 0.5, ra + 1], op);
      sign([ca + dir * 1.5, ra + 3], "=");
    }
  });
  return `${svgOpen(width, height, made.kind === "cross" ? "가로·세로 도형식" : "삼각형 도형식")}${body}</svg>`;
}

function networkVisual(made) {
  const board = made.kind ? frameBoardSvg(made) : listBoardSvg(made.eqs, made.sh);
  return { kind: "fig", html: `${cardsSvg(made.cards)}${board}` };
}

function orderNote(made) {
  return made.orders.length ? ` (단, ${made.orders.map((o) => `${made.sh[o.small].ch} < ${made.sh[o.big].ch}`).join(", ")})` : "";
}

function symbolProblem(made, ask, kindLabel) {
  const { sh, vals } = made;
  const k = vals.length;
  const head = made.kind === "cross"
    ? "같은 모양은 같은 수, 다른 모양은 다른 수입니다. 그림의 수 카드 중에서 골라 모양에 넣어 가로식과 세로식이 모두 맞게 하려고 합니다."
    : "같은 모양은 같은 수, 다른 모양은 다른 수입니다. 그림의 수 카드 중에서 골라 모양에 넣어 식이 모두 맞게 하려고 합니다.";
  let question;
  let answer;
  let finish;
  if (ask === "pair") {
    const order = made.kid.fixedOrder;
    const late = order.slice(-3);
    const [a, b] = shuffle(late.length >= 2 ? late : [...Array(k).keys()]).slice(0, 2);
    const total = vals[a] + vals[b];
    question = `${sh[a].ch}와 ${sh[b].ch}에 알맞은 수의 합을 구하세요.`;
    answer = String(total);
    finish = `따라서 ${sh[a].ch} + ${sh[b].ch} = ${vals[a]} + ${vals[b]} = ${total}입니다.`;
    made.asked = [a, b];
  } else if (ask === "leftover") {
    const left = made.cards.filter((v) => !vals.includes(v));
    question = "식에 쓰이지 않은 수 카드의 수를 구하세요.";
    answer = left.join(", ");
    finish = `모양에 넣은 수는 ${[...vals].sort((x, y) => x - y).join(", ")}이므로 쓰이지 않은 카드는 ${left.join(", ")}입니다.`;
    made.asked = [];
  } else {
    const order = made.kid.fixedOrder;
    const target = Math.random() < 0.7 ? order[order.length - 1] : pick(order.slice(-3));
    question = `${sh[target].ch}에 알맞은 수를 구하세요.`;
    answer = String(vals[target]);
    finish = `따라서 ${sh[target].ch} = ${vals[target]}입니다.`;
    made.asked = [target];
  }
  return {
    prompt: `${head}${orderNote(made)} ${question}`,
    visual: networkVisual(made),
    answer,
    solution: `${made.kid.steps.join(" ")} ${finish}`,
    meta: {
      family: "symbol-card-network-b5",
      kindLabel,
      layout: made.kind || "list",
      ask,
      cards: made.cards,
      shapes: sh.map((s) => s.key),
      values: vals,
      equations: made.eqs.map((eq) => ({ L: eq.L, lop: eq.lop, R: eq.R, rop: eq.rop })),
      orders: made.orders,
      asked: made.asked
    }
  };
}

const POOL_1_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const POOL_2_9 = [2, 3, 4, 5, 6, 7, 8, 9];

function symbolCardListNetworkB5({ difficulty = 2 }) {
  const shapes = difficulty === 1 ? 4 : difficulty === 2 ? pick([4, 5]) : 5;
  const eqCount = difficulty === 3 ? 4 : shapes === 4 ? 3 : pick([3, 4]);
  const forms = difficulty === 1 ? ["sq", "mul", "add", "sub"] : ["sq", "cube", "mul", "mul2", "sqmul", "add", "sub", "addDouble"];
  const made = makeListNetwork({ shapes, eqCount, forms, pool: Math.random() < 0.6 ? POOL_2_9 : POOL_1_9 });
  return made ? symbolProblem(made, "one", "list") : null;
}

function symbolCardLeftoverB5({ difficulty = 2 }) {
  const shapes = difficulty === 1 ? 4 : 5;
  const made = makeListNetwork({ shapes, extraCards: 1, eqCount: difficulty === 3 ? 4 : 3, forms: ["sq", "mul", "mul2", "add", "sub", "add3", "addDouble"], pool: difficulty === 1 ? [1, 2, 3, 4, 5, 6] : POOL_1_9 });
  return made ? symbolProblem(made, "leftover", "leftover") : null;
}

function symbolCardCrossNetworkB5({ difficulty = 2 }) {
  const made = makeFrameNetwork({
    kind: "cross",
    pool: difficulty === 3 ? POOL_1_9 : difficulty === 2 ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4, 5, 6],
    ops: ["×", "+", "−"],
    needOps: ["×"],
    minShapes: difficulty === 1 ? 5 : 6,
    maxShapes: difficulty === 3 ? 8 : difficulty === 2 ? 7 : 6,
    extraCards: difficulty === 1 ? 0 : 1
  });
  return made ? symbolProblem(made, "one", "cross") : null;
}

function symbolCardCrossPairSumB5({ difficulty = 2 }) {
  const made = makeFrameNetwork({
    kind: "cross",
    pool: difficulty === 1 ? [0, 1, 2, 3, 4] : difficulty === 2 ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ops: ["×", "+", "−"],
    needOps: ["×"],
    minShapes: 4,
    maxShapes: difficulty === 3 ? 7 : 6,
    extraCards: 0
  });
  return made ? symbolProblem(made, "pair", "cross-pair") : null;
}

function symbolCardTriangleNetworkB5({ difficulty = 2 }) {
  const made = makeFrameNetwork({
    kind: "triangle",
    pool: difficulty === 1 ? [1, 2, 3, 4, 5, 6] : POOL_1_9,
    ops: ["×", "+", "−"],
    needOps: ["×"],
    minShapes: 5,
    maxShapes: 6,
    extraCards: difficulty === 1 ? 0 : 1
  });
  return made ? symbolProblem(made, "one", "triangle") : null;
}

// ── 이웃한 두 원의 곱으로 원 모두 채우기 ──────────────

function cycleSolutions(edges, lo, hi) {
  const n = edges.length;
  const out = [];
  for (let v0 = lo; v0 <= hi; v0 += 1) {
    const vs = [v0];
    let ok = true;
    for (let i = 0; i < n - 1 && ok; i += 1) {
      const next = edges[i] / vs[i];
      if (!Number.isInteger(next) || next < lo || next > hi) ok = false;
      else vs.push(next);
    }
    if (ok && vs[n - 1] * v0 === edges[n - 1]) out.push(vs);
  }
  return out;
}

function factorPairs(value, lo, hi) {
  const pairs = [];
  for (let a = lo; a <= hi; a += 1) if (value % a === 0 && value / a >= a && value / a <= hi) pairs.push([a, value / a]);
  return pairs;
}

function makeCycle(sides, lo, hi) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const vertices = Array.from({ length: sides }, () => randomInt(lo, hi));
    if (vertices.some((v, i) => v === vertices[(i + 1) % sides] && Math.random() < 0.8)) continue;
    const edges = vertices.map((v, i) => v * vertices[(i + 1) % sides]);
    if (new Set(edges).size < Math.min(sides, 3)) continue;
    const sols = cycleSolutions(edges, lo, hi);
    if (sols.length !== 1) continue;
    // 아이가 시작할 수 있는 변: 범위 안 두 수의 곱으로 한 가지로만 나타나는 곱
    const starts = edges.map((e, i) => (factorPairs(e, lo, hi).length === 1 ? i : -1)).filter((i) => i >= 0);
    if (!starts.length) continue;
    return { vertices, edges, start: pick(starts) };
  }
  return null;
}

// 꼭짓점 자리: 사각형은 네모 모양(왼쪽 위부터), 나머지는 맨 위 꼭짓점부터 시계 방향
const cycleStart = (n) => (n === 4 ? -3 * Math.PI / 4 : -Math.PI / 2);
const cycleOrderWord = (n) => (n === 4 ? "왼쪽 위 원부터 시계 방향으로" : "맨 위 원부터 시계 방향으로");

function cycleSvg(cycle, { label = "", fill = false } = {}) {
  const n = cycle.vertices.length;
  const radius = n <= 3 ? 50 : n === 4 ? 62 : n <= 5 ? 60 : n <= 6 ? 72 : 98;
  const raw = Array.from({ length: n }, (_, i) => {
    const a = cycleStart(n) + (i * 2 * Math.PI) / n;
    return [Math.cos(a) * radius, Math.sin(a) * radius];
  });
  const minX = Math.min(...raw.map(([x]) => x));
  const maxX = Math.max(...raw.map(([x]) => x));
  const minY = Math.min(...raw.map(([, y]) => y));
  const maxY = Math.max(...raw.map(([, y]) => y));
  const top = label ? 22 : 4;
  const width = Math.round(maxX - minX + 40);
  const height = Math.round(maxY - minY + top + 34);
  const pts = raw.map(([x, y]) => [x - minX + 20, y - minY + top + 16]);
  let body = label ? `<text x="4" y="15" font-size="15" style="fill:${INK};font-weight:700;${FONT}">${label}</text>` : "";
  pts.forEach(([x, y], i) => {
    const [x2, y2] = pts[(i + 1) % n];
    body += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" style="stroke:#7d9a86;stroke-width:1.6"/>`;
  });
  pts.forEach(([x, y], i) => {
    const [x2, y2] = pts[(i + 1) % n];
    const mx = (x + x2) / 2;
    const my = (y + y2) / 2;
    body += `<rect x="${mx - 15}" y="${my - 13}" width="30" height="26" style="fill:#e9f1ea;stroke:#7d9a86;stroke-width:1.3"/>`;
    body += text(mx, my + 6, cycle.edges[i], 15);
  });
  pts.forEach(([x, y], i) => {
    body += `<circle cx="${x}" cy="${y}" r="14" style="fill:#fff;stroke:#7d9a86;stroke-width:1.6"/>`;
    if (fill) body += text(x, y + 6, cycle.vertices[i], 16, 'font-weight="700"');
  });
  return `${svgOpen(width, height, `이웃한 두 원의 수의 곱 ${cycle.edges.join(", ")}`)}${body}</svg>`;
}

const PARTS = ["(1)", "(2)", "(3)", "(4)"];

function cycleProblem(specs, kindLabel) {
  const cycles = [];
  for (const spec of specs) {
    const one = makeCycle(spec.sides, spec.lo, spec.hi);
    if (!one) return null;
    cycles.push({ ...one, ...spec });
  }
  const many = cycles.length > 1;
  const lo = specs[0].lo;
  const hi = specs[0].hi;
  const label = (i) => (many ? PARTS[i] : "");
  const answerOf = (c) => `${cycleOrderWord(c.vertices.length)} ${c.vertices.join(", ")}`;
  const solutionOf = (c) => {
    const e = c.edges[c.start];
    const [a, b] = factorPairs(e, lo, hi)[0];
    const ro = [1, 2, 4, 5, 7, 8, 9].includes(b % 10) ? "로" : "으로";
    const then = a === b
      ? `그 변 양쪽 원은 모두 ${a}이고, 이웃한 변의 곱을 차례로 나누어 갑니다.`
      : "두 가지 순서로 넣고 이웃한 변의 곱을 차례로 나누어 보면 모두 범위 안에 들어가는 것은 한 가지뿐입니다.";
    return `${josa(e, "은", "는")} ${lo}부터 ${hi}까지의 두 수로 ${a} × ${b}${ro}만 나타낼 수 있습니다. ${then} ${answerOf(c)}입니다.`;
  };
  return {
    prompt: `○ 안의 수는 ${lo}부터 ${hi}까지의 수이고, □ 안의 수는 양쪽 ○ 안에 있는 두 수의 곱입니다. ○ 안에 알맞은 수를 모두 써넣으세요.`,
    visual: { kind: "fig", html: cycles.map((c, i) => cycleSvg(c, { label: label(i) })).join("") },
    answerVisual: { kind: "fig", html: cycles.map((c, i) => cycleSvg(c, { label: label(i), fill: true })).join("") },
    responseKind: "visual-fill",
    answer: many ? cycles.map((c, i) => `${PARTS[i]} ${answerOf(c)}`).join(" / ") : answerOf(cycles[0]),
    solution: many ? cycles.map((c, i) => `${PARTS[i]} ${solutionOf(c)}`).join(" ") : solutionOf(cycles[0]),
    meta: { family: "product-cycle-fill-b5", kindLabel, lo, hi, cycles: cycles.map((c) => ({ vertices: c.vertices, edges: c.edges })) }
  };
}

function productCycleFillTrianglesB5({ difficulty = 2 }) {
  const count = difficulty === 3 ? 4 : 2;
  return cycleProblem(Array.from({ length: count }, () => ({ sides: 3, lo: 2, hi: 9 })), "triangles");
}

function productCycleFillSquaresB5({ difficulty = 2 }) {
  return cycleProblem([{ sides: 4, lo: 2, hi: 9 }, { sides: 4, lo: 2, hi: 9 }], "squares");
}

function productCycleFillPolygonB5({ difficulty = 2 }) {
  if (difficulty === 1) return cycleProblem([{ sides: 5, lo: 2, hi: 9 }, { sides: 5, lo: 2, hi: 9 }], "pentagons");
  if (difficulty === 2) {
    const [lo, hi] = pick([[3, 7], [4, 9], [2, 9]]);
    return cycleProblem([{ sides: pick([5, 6]), lo, hi }], "polygon");
  }
  return cycleProblem([{ sides: pick([7, 8]), lo: 2, hi: 9 }], "polygon-large");
}

// ── 1단원: 정사각 층으로 채운 수 배열 ─────────────────
// 층 L(1부터)은 (L-1)²+1부터 L²까지. 기본 꼴: 오른쪽 세로줄을 위에서 아래로 → 아래 가로줄을 오른쪽에서 왼쪽으로.
// 뒤집은 꼴(transpose)은 가로·세로를 바꾼다. zigzag는 홀수 층(3, 5, …)을 거꾸로 채운다.

function layerValue(row, col, { transpose, zigzag }) {
  const [r, c] = transpose ? [col, row] : [row, col];
  const layer = Math.max(r, c) + 1;
  const start = (layer - 1) ** 2 + 1;
  const index = c === layer - 1 ? r : layer - 1 + (layer - 1 - c);
  const reversed = zigzag && layer >= 3 && layer % 2 === 1;
  return start + (reversed ? 2 * layer - 2 - index : index);
}

function squareLayerGrid({ difficulty = 2, zigzag = false }) {
  const size = difficulty === 3 ? 8 : difficulty === 2 || zigzag ? 7 : 6;
  const shown = difficulty === 1 && !zigzag ? 3 : 4;
  const transpose = Math.random() < 0.5;
  const opts = { transpose, zigzag };
  const outside = [];
  for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) if (Math.max(r, c) >= shown) outside.push([r, c]);
  // 세 칸은 서로 다른 층에서, 그중 하나는 층의 모서리가 아닌 칸
  let targets = null;
  for (let attempt = 0; attempt < 100 && !targets; attempt += 1) {
    const chosen = shuffle(outside).slice(0, 3);
    const layers = new Set(chosen.map(([r, c]) => Math.max(r, c)));
    if (layers.size === 3) targets = chosen.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  if (!targets) return null;
  const values = targets.map(([r, c]) => layerValue(r, c, opts));
  const cell = 34;
  const width = size * cell + 4;
  let body = "";
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const x = 2 + c * cell;
      const y = 2 + r * cell;
      const t = targets.findIndex(([tr, tc]) => tr === r && tc === c);
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:${t >= 0 ? "#f6e4a8" : "#fff"};stroke:#7d9a86;stroke-width:1.1"/>`;
      if (t >= 0) body += text(x + cell / 2, y + cell / 2 + 6, MARKS[t], 16);
      else if (Math.max(r, c) < shown) body += text(x + cell / 2, y + cell / 2 + 6, layerValue(r, c, opts), 15);
    }
  }
  const explain = targets.map(([r, c], i) => {
    const layer = Math.max(r, c) + 1;
    return `${MARKS[i]}은 ${layer}번째 층에 있고 그 층은 ${(layer - 1) ** 2 + 1}부터 ${layer * layer}까지이므로 ${values[i]}입니다.`;
  }).join(" ");
  return {
    prompt: "1부터 차례로 수를 늘어놓아 정사각형 모양을 한 층씩 키워 가는 수 배열표입니다. 규칙을 찾아 ㉠, ㉡, ㉢에 알맞은 수를 구하세요.",
    visual: { kind: "fig", html: `${svgOpen(width, width, "정사각형 층으로 늘어놓은 수 배열표")}${body}</svg>` },
    answer: targets.map((_, i) => `${MARKS[i]} ${values[i]}`).join(", "),
    solution: `한 층이 끝날 때마다 1, 4, 9, 16처럼 같은 수를 두 번 곱한 수가 됩니다.${zigzag ? " 층마다 채우는 방향이 번갈아 바뀝니다." : " 층마다 같은 방향으로 꺾어 채웁니다."} ${explain}`,
    meta: { family: "square-layer-grid-b5", size, shown, transpose, zigzag, targets, values }
  };
}

const squareLayerNumberGridB5 = (options) => squareLayerGrid({ ...options, zigzag: false });
const squareLayerZigzagGridB5 = (options) => squareLayerGrid({ ...options, zigzag: true });

// ── 1단원: 같은 요일 두 날짜의 합 → 다른 날의 요일 ─────

function blankCalendarSvg(month, weekday) {
  const cell = 30;
  const width = cell * 7 + 4;
  const height = 26 + 22 + cell * 6 + 4;
  let body = text(width / 2, 19, `${month}월`, 16, 'font-weight="700"');
  WEEKDAYS.forEach((d, i) => {
    const x = 2 + i * cell;
    body += `<rect x="${x}" y="26" width="${cell}" height="22" style="fill:${i === weekday ? "#f6e4a8" : "#e9f1ea"};stroke:#7d9a86;stroke-width:1"/>`;
    body += text(x + cell / 2, 42, d, 13, i === 0 ? 'style="fill:#b4512e"' : "");
  });
  for (let r = 0; r < 6; r += 1) {
    for (let c = 0; c < 7; c += 1) {
      body += `<rect x="${2 + c * cell}" y="${48 + r * cell}" width="${cell}" height="${cell}" style="fill:${c === weekday ? "#fdf6dd" : "#fff"};stroke:#c9bda2;stroke-width:1"/>`;
    }
  }
  return `${svgOpen(width, height, `${month}월 빈 달력`)}${body}</svg>`;
}

function weekdayOf(firstWeekday, date) {
  return (firstWeekday + date - 1) % 7;
}

function calendarPairSum({ difficulty = 2, mode }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const month = randomInt(1, 12);
    const days = MONTH_DAYS[month - 1];
    const firstWeekday = randomInt(0, 6);
    const weekday = randomInt(0, 6);
    const first = ((weekday - firstWeekday + 7) % 7) + 1;
    const count = Math.floor((days - first) / 7) + 1;
    const k = mode === "steps" ? randomInt(1, 2) : randomInt(1, Math.min(count - 1, difficulty === 1 ? 2 : 4));
    if (k + 1 > count) continue;
    const a = first + (k - 1) * 7;
    const b = a + 7;
    const total = a + b;
    const nextMonth = mode !== "steps" && month < 12 && (difficulty === 3 || Math.random() < 0.4);
    let target;
    let targetWeekday;
    let targetMonth = month;
    if (nextMonth) {
      target = randomInt(1, difficulty === 3 ? 28 : 12);
      targetMonth = month + 1;
      targetWeekday = (firstWeekday + days + target - 1) % 7;
    } else {
      target = randomInt(1, days);
      if (target === a || target === b || target === first) continue;
      targetWeekday = weekdayOf(firstWeekday, target);
    }
    const name = WEEKDAYS[weekday];
    const lead = `어느 해 ${month}월의 ${ORDINAL[k - 1]} 번째 ${name}요일 날짜와 ${ORDINAL[k]} 번째 ${name}요일 날짜를 더하면 ${total}입니다.`;
    const gap = targetMonth === month ? target - a : days - a + target;
    const move = `${a}일에서 ${targetMonth === month ? "" : `${month}월 마지막 날 ${days}일을 지나 `}${targetMonth}월 ${target}일까지는 ${Math.abs(gap)}일 ${gap >= 0 ? "뒤" : "앞"}이고, 7일씩 묶으면 ${Math.abs(gap) % 7}일이 남으므로 ${WEEKDAYS[targetWeekday]}요일입니다.`;
    const findA = `두 날짜는 7일 차이이므로 작은 날짜는 (${total} − 7) ÷ 2 = ${a}일입니다. ${a}일은 ${name}요일입니다.`;
    const meta = { family: "calendar-pair-sum-b5", mode, month, days, firstWeekday, weekday, k, a, b, total, targetMonth, target, targetWeekday };
    const note = targetMonth !== month ? ` (${month}월은 ${days}일까지 있습니다.)` : "";
    if (mode === "steps") {
      return {
        prompt: `${lead} (1) ${ORDINAL[k - 1]} 번째 ${name}요일은 며칠인가요? (2) 같은 달 ${target}일은 무슨 요일인가요?`,
        visual: { kind: "fig", html: blankCalendarSvg(month, weekday) },
        answer: `(1) ${a}일, (2) ${WEEKDAYS[targetWeekday]}요일`,
        solution: `${findA} ${move}`,
        meta
      };
    }
    return {
      prompt: `${lead} ${targetMonth === month ? "같은 달" : "같은 해"} ${targetMonth}월 ${target}일은 무슨 요일인지 구하세요.${note}`,
      visual: { kind: "fig", html: blankCalendarSvg(month, weekday) },
      answer: `${WEEKDAYS[targetWeekday]}요일`,
      solution: `${findA} ${move}`,
      meta
    };
  }
  return null;
}

const calendarOrdinalPairSumStepsB5 = (options) => calendarPairSum({ ...options, mode: "steps" });
const calendarOrdinalPairSumWeekdayB5 = (options) => calendarPairSum({ ...options, mode: "single" });

// 서로 다른 두 요일: 첫 번째 X요일과 두 번째 Y요일의 합 → 다음 달 어느 날의 요일
function calendarMixedWeekdaySumB5({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const month = randomInt(1, 11);
    const days = MONTH_DAYS[month - 1];
    const firstWeekday = randomInt(0, 6);
    const x = randomInt(0, 6);
    const y = (x + randomInt(1, 6)) % 7;
    const firstX = ((x - firstWeekday + 7) % 7) + 1;
    const firstY = ((y - firstWeekday + 7) % 7) + 1;
    const ordX = 1;
    const ordY = difficulty === 1 ? 1 : 2;
    const dx = firstX + (ordX - 1) * 7;
    const dy = firstY + (ordY - 1) * 7;
    const total = dx + dy;
    const target = randomInt(1, difficulty === 3 ? 28 : 15);
    const targetWeekday = (firstWeekday + days + target - 1) % 7;
    // 다른 1일 요일로는 같은 합이 나오지 않아야 답이 하나
    const sums = [];
    for (let fw = 0; fw < 7; fw += 1) {
      const fx = ((x - fw + 7) % 7) + 1;
      const fy = ((y - fw + 7) % 7) + 1;
      if (fx + fy + (ordY - 1) * 7 === total) sums.push(fw);
    }
    if (sums.length !== 1) continue;
    const xn = WEEKDAYS[x];
    const yn = WEEKDAYS[y];
    const shift = (y - x + 7) % 7;
    const gapX = days - dx + target;
    return {
      prompt: `어느 해 ${month}월의 첫 번째 ${xn}요일 날짜와 ${ORDINAL[ordY - 1]} 번째 ${yn}요일 날짜를 더하면 ${total}입니다. 같은 해 ${month + 1}월 ${target}일은 무슨 요일인지 구하세요. (${month}월은 ${days}일까지 있습니다.)`,
      visual: { kind: "fig", html: blankCalendarSvg(month, x) },
      answer: `${WEEKDAYS[targetWeekday]}요일`,
      solution: `첫 번째 ${xn}요일을 □일이라 하면 ${ORDINAL[ordY - 1]} 번째 ${yn}요일은 □ + ${shift}${ordY === 2 ? " + 7" : ""}일 또는 그보다 7일 앞입니다. 1일부터 7일 사이에서 합이 ${total}이 되는 경우를 찾으면 첫 번째 ${xn}요일은 ${dx}일, ${ORDINAL[ordY - 1]} 번째 ${yn}요일은 ${dy}일입니다. ${dx}일에서 ${month + 1}월 ${target}일까지는 ${gapX}일 뒤이고 7일씩 묶으면 ${gapX % 7}일이 남으므로 ${WEEKDAYS[targetWeekday]}요일입니다.`,
      meta: { family: "calendar-mixed-weekday-sum-b5", month, days, firstWeekday, x, y, ordY, dx, dy, total, target, targetWeekday }
    };
  }
  return null;
}

// ── 4단원: 1…n…1 줄의 합 · 1×n 띠의 직사각형 · 삼각수 표 ─────

function mountainSvg(rows) {
  const cell = 24;
  const n = rows + 1;
  const width = (2 * n - 1) * cell + 4;
  const height = n * cell + 4;
  let body = "";
  for (let r = 1; r <= n; r += 1) {
    const len = 2 * r - 1;
    const x0 = 2 + (n - r) * cell;
    for (let i = 0; i < len; i += 1) {
      const x = x0 + i * cell;
      const y = 2 + (r - 1) * cell;
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:#fff;stroke:#7d9a86;stroke-width:1.1"/>`;
      if (r <= rows) body += text(x + cell / 2, y + cell / 2 + 5, i < r ? i + 1 : 2 * r - 1 - i, 14);
    }
  }
  return `${svgOpen(width, height, "1부터 커졌다가 다시 1까지 작아지는 수의 줄")}${body}</svg>`;
}

function mountainRowSumB5({ difficulty = 2 }) {
  const shownRows = 4;
  const pool = difficulty === 1 ? [3, 4, 5, 6, 7] : difficulty === 2 ? [5, 6, 7, 8, 9, 10] : [8, 9, 10, 11, 12, 13, 14, 15];
  const [p, q] = shuffle(pool).slice(0, 2).sort((a, b) => a - b);
  const r = randomInt(difficulty === 3 ? 12 : 6, difficulty === 3 ? 20 : 12);
  const total = r * r;
  return {
    prompt: `수를 그림과 같은 규칙으로 줄마다 늘어놓았습니다. (1) ${p}번째 줄에 있는 수의 합을 구하세요. (2) ${q}번째 줄에 있는 수의 합을 구하세요. (3) 줄에 있는 수의 합이 ${total}인 줄은 몇 번째 줄인가요?`,
    visual: { kind: "fig", html: mountainSvg(shownRows) },
    answer: `(1) ${p * p}, (2) ${q * q}, (3) ${r}번째 줄`,
    solution: `줄의 합은 1, 4, 9, 16처럼 줄 번호를 두 번 곱한 수입니다(1부터 n까지와 n−1부터 1까지를 짝지으면 n이 n개). (1) ${p} × ${p} = ${p * p} (2) ${q} × ${q} = ${q * q} (3) ${r} × ${r} = ${total}이므로 ${r}번째 줄입니다.`,
    meta: { family: "mountain-row-sum-b5", p, q, r, answers: [p * p, q * q, r] }
  };
}

function stripSvg(n, label) {
  const cell = 30;
  const width = n * cell + 40;
  let body = `<text x="2" y="29" font-size="15" style="fill:${INK};font-weight:700;${FONT}">${label}</text>`;
  for (let i = 0; i < n; i += 1) body += `<rect x="${36 + i * cell}" y="8" width="${cell}" height="${cell}" style="fill:#fff;stroke:#7d9a86;stroke-width:1.4"/>`;
  return `${svgOpen(width, 46, `작은 정사각형 ${n}개를 한 줄로 붙인 띠`)}${body}</svg>`;
}

function stripRectangleCountB5({ difficulty = 2 }) {
  const pool = difficulty === 1 ? [2, 3, 4, 5] : difficulty === 2 ? [4, 5, 6, 7] : [6, 7, 8, 9, 10];
  const [a, b] = shuffle(pool).slice(0, 2).sort((x, y) => x - y);
  const count = (n) => (n * (n + 1)) / 2;
  const sumText = (n) => Array.from({ length: n }, (_, i) => n - i).join(" + ");
  return {
    prompt: "작은 정사각형을 한 줄로 붙인 띠입니다. 각 그림에서 찾을 수 있는 크고 작은 사각형의 개수를 구하세요.",
    visual: { kind: "fig", html: `${stripSvg(a, "(1)")}${stripSvg(b, "(2)")}` },
    answer: `(1) ${count(a)}개, (2) ${count(b)}개`,
    solution: `칸 1개짜리, 2개짜리, …처럼 칸 수로 나누어 셉니다. (1) ${sumText(a)} = ${count(a)}개 (2) ${sumText(b)} = ${count(b)}개`,
    meta: { family: "strip-rectangle-count-b5", a, b, answers: [count(a), count(b)] }
  };
}

function triangularTableB5({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 7 : difficulty === 2 ? 8 : 10;
  const asked = shuffle(Array.from({ length: rows - 2 }, (_, i) => i + 3)).slice(0, 3).sort((a, b) => a - b);
  const tri = (n) => (n * (n + 1)) / 2;
  const rowH = 30;
  const col = [40, difficulty === 3 ? 300 : 250, 70];
  const width = col[0] + col[1] + col[2] + 4;
  const height = rowH * (rows + 1) + 4;
  let body = "";
  const cellAt = (x, y, w, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${rowH}" style="fill:${fill};stroke:#7d9a86;stroke-width:1"/>`;
  const heads = ["", "1부터 이어 더한 합", "삼각수"];
  let x = 2;
  heads.forEach((h, i) => { body += cellAt(x, 2, col[i], "#e9f1ea") + text(x + col[i] / 2, 22, h, 14, 'font-weight="700"'); x += col[i]; });
  for (let n = 1; n <= rows; n += 1) {
    const y = 2 + n * rowH;
    const markIndex = asked.indexOf(n);
    body += cellAt(2, y, col[0], "#fff") + text(2 + col[0] / 2, y + 20, n, 14);
    body += cellAt(2 + col[0], y, col[1], "#fff") + `<text x="${2 + col[0] + 8}" y="${y + 20}" font-size="${n >= 9 ? 12.5 : 14}" style="fill:${INK};${FONT}">${Array.from({ length: n }, (_, i) => i + 1).join(" + ")}</text>`;
    const tx = 2 + col[0] + col[1];
    body += cellAt(tx, y, col[2], markIndex >= 0 ? "#f6e4a8" : "#fff");
    if (n <= 2) body += text(tx + col[2] / 2, y + 20, tri(n), 15);
    else if (markIndex >= 0) body += text(tx + col[2] / 2, y + 20, MARKS[markIndex], 15);
  }
  return {
    prompt: "1부터 이어지는 수를 차례로 더한 합을 삼각수라고 합니다. 표의 ㉠, ㉡, ㉢에 알맞은 삼각수를 구하세요.",
    visual: { kind: "fig", html: `${svgOpen(width, height, "삼각수 표")}${body}</svg>` },
    answer: asked.map((n, i) => `${MARKS[i]} ${tri(n)}`).join(", "),
    solution: `앞의 삼각수에 다음 수를 더하면 다음 삼각수가 됩니다(1, 3, 6, 10, …). ${asked.map((n, i) => `${MARKS[i]} ${n}번째 삼각수 = ${tri(n - 1)} + ${n} = ${tri(n)}`).join(", ")}입니다.`,
    meta: { family: "triangular-table-b5", rows, asked, answers: asked.map(tri) }
  };
}

// ── 1단원: 넓은 뱀 모양 수 배열(두 칸의 차·합, 한 칸) ─────

function snakeValue(row, col, columns, fromRight) {
  const reversed = (row % 2 === 1) !== fromRight;
  return row * columns + (reversed ? columns - 1 - col : col) + 1;
}

function wideSnakeNumberGridB5({ difficulty = 2 }) {
  const columns = difficulty === 1 ? 5 : difficulty === 2 ? pick([6, 7]) : pick([7, 8]);
  const rows = difficulty === 1 ? 5 : 6;
  const fromRight = Math.random() < 0.4;
  const mode = pick(difficulty === 1 ? ["one", "diff"] : ["one", "diff", "sum"]);
  const value = (r, c) => snakeValue(r, c, columns, fromRight);
  // 보이는 수: 첫 줄 처음 세 칸 · 첫 줄 끝 칸 · 둘째 줄 끝에서 하나 · 셋째 줄 하나
  const startCol = (c) => (fromRight ? columns - 1 - c : c);
  const clues = [[0, startCol(0)], [0, startCol(1)], [0, startCol(2)], [0, startCol(columns - 1)], [1, startCol(columns - 1)], [2, randomInt(1, columns - 2)]];
  const clueKey = new Set(clues.map(([r, c]) => `${r}:${c}`));
  const pool = [];
  for (let r = 3; r < rows; r += 1) for (let c = 0; c < columns; c += 1) if (!clueKey.has(`${r}:${c}`)) pool.push([r, c]);
  const targets = shuffle(pool).slice(0, mode === "one" ? 1 : 2).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const values = targets.map(([r, c]) => value(r, c));
  const cell = 34;
  const width = columns * cell + 4;
  const height = rows * cell + 4;
  let body = "";
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      const x = 2 + c * cell;
      const y = 2 + r * cell;
      const t = targets.findIndex(([tr, tc]) => tr === r && tc === c);
      body += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" style="fill:${t >= 0 ? "#f6e4a8" : "#fff"};stroke:#7d9a86;stroke-width:1.1"/>`;
      if (t >= 0 && mode !== "one") body += text(x + cell / 2, y + cell / 2 + 6, MARKS[t], 15);
      else if (clueKey.has(`${r}:${c}`)) body += text(x + cell / 2, y + cell / 2 + 6, value(r, c), 15);
    }
  }
  const ask = mode === "one" ? "색칠한 칸에 들어갈 수를 구하세요." : mode === "diff" ? "㉠과 ㉡에 들어갈 두 수의 차를 구하세요." : "㉠과 ㉡에 들어갈 두 수의 합을 구하세요.";
  const answer = mode === "one" ? values[0] : mode === "diff" ? Math.abs(values[1] - values[0]) : values[0] + values[1];
  const where = targets.map(([r, c], i) => `${mode === "one" ? "색칠한 칸" : MARKS[i]}은 ${r + 1}째 줄이므로 ${r * columns + 1}부터 ${(r + 1) * columns}까지 중 ${value(r, c)}입니다.`).join(" ");
  return {
    prompt: `1부터 차례로 수를 한 줄씩 쓰고, 줄이 바뀔 때마다 방향을 바꾸어 쓴 수 배열표입니다. ${ask}`,
    visual: { kind: "fig", html: `${svgOpen(width, height, "줄마다 방향을 바꾸어 쓴 수 배열표")}${body}</svg>` },
    answer: String(answer),
    solution: `첫 줄의 끝 수를 보면 한 줄에 ${columns}개씩 놓이고, 줄마다 쓰는 방향이 바뀝니다. ${where}${mode === "diff" ? ` 차는 ${Math.max(...values)} − ${Math.min(...values)} = ${answer}입니다.` : mode === "sum" ? ` 합은 ${values[0]} + ${values[1]} = ${answer}입니다.` : ""}`,
    meta: { family: "wide-snake-grid-b5", rows, columns, fromRight, mode, targets, values, answer }
  };
}

// ── 1단원: 달력의 작은 문제 셋(요일 둘 · 몇 번째 요일) ─────

function calendarThreeQuestionsB5({ difficulty = 2 }) {
  const month = randomInt(1, 12);
  const days = MONTH_DAYS[month - 1];
  const firstWeekday = randomInt(0, 6);
  const shownStart = randomInt(difficulty === 1 ? 5 : 8, difficulty === 1 ? 12 : 16);
  const visibleDates = [shownStart, shownStart + 1, shownStart + 2];
  const askFirst = Math.random() < 0.5 ? 1 : randomInt(2, shownStart - 2);
  let later = randomInt(Math.max(shownStart + 6, 18), days);
  if (visibleDates.includes(later)) later = days;
  const weekday = randomInt(0, 6);
  const dates = [];
  for (let d = ((weekday - firstWeekday + 7) % 7) + 1; d <= days; d += 7) dates.push(d);
  const nth = difficulty === 3 && dates.length === 5 ? 5 : pick([3, 4]);
  const w = (d) => WEEKDAYS[weekdayOf(firstWeekday, d)];
  const nthDate = dates[nth - 1];
  return {
    prompt: `어느 해 ${month}월 달력의 일부입니다. (1) ${month}월 ${askFirst}일은 무슨 요일인가요? (2) ${month}월 ${later}일은 무슨 요일인가요? (3) ${month}월의 ${ORDINAL[nth - 1]} 번째 ${WEEKDAYS[weekday]}요일은 며칠인가요?`,
    visual: { kind: "book5", subtype: "calendar", month, days, firstWeekday, cells: Array.from({ length: Math.ceil((firstWeekday + days) / 7) * 7 }, (_, i) => (i >= firstWeekday && i < firstWeekday + days ? i - firstWeekday + 1 : null)), visibleDates },
    answer: `(1) ${w(askFirst)}요일, (2) ${w(later)}요일, (3) ${nthDate}일`,
    solution: `보이는 ${shownStart}일은 ${w(shownStart)}요일입니다. 같은 요일은 7일씩 차이 나므로 (1) ${askFirst}일은 ${w(askFirst)}요일, (2) ${later}일은 ${w(later)}요일입니다. (3) 첫 번째 ${WEEKDAYS[weekday]}요일은 ${dates[0]}일이므로 ${ORDINAL[nth - 1]} 번째는 ${dates[0]} + 7 × ${nth - 1} = ${nthDate}일입니다.`,
    meta: { family: "calendar-three-questions-b5", month, days, firstWeekday, shownStart, askFirst, later, weekday, nth, nthDate }
  };
}

// ── 2단원: 붙은 두 판을 지나는 최단거리 · 1×n 띠 길 여러 개 ─────

const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i += 1) r = (r * (n - k + i)) / i; return Math.round(r); };

function latticeSvg(boards, points) {
  // boards: [{x, y, w, h}] 칸 단위, points: [{x, y, label}] 칸 단위 좌표
  const cell = 34;
  const minX = Math.min(...boards.map((b) => b.x));
  const minY = Math.min(...boards.map((b) => b.y));
  const maxX = Math.max(...boards.map((b) => b.x + b.w));
  const maxY = Math.max(...boards.map((b) => b.y + b.h));
  const pad = 26;
  const X = (x) => pad + (x - minX) * cell;
  const Y = (y) => pad + (y - minY) * cell;
  const width = Math.round((maxX - minX) * cell + pad * 2);
  const height = Math.round((maxY - minY) * cell + pad * 2);
  let body = "";
  boards.forEach((b) => {
    for (let i = 0; i <= b.w; i += 1) body += `<line x1="${X(b.x + i)}" y1="${Y(b.y)}" x2="${X(b.x + i)}" y2="${Y(b.y + b.h)}" style="stroke:#7d9a86;stroke-width:1.5"/>`;
    for (let j = 0; j <= b.h; j += 1) body += `<line x1="${X(b.x)}" y1="${Y(b.y + j)}" x2="${X(b.x + b.w)}" y2="${Y(b.y + j)}" style="stroke:#7d9a86;stroke-width:1.5"/>`;
  });
  points.forEach((p) => {
    body += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4" style="fill:${INK}"/>`;
    body += text(X(p.x) + (p.dx || 0), Y(p.y) + (p.dy || 0), p.label, 15, 'font-weight="700"');
  });
  return `${svgOpen(width, height, "선을 따라 가는 길")}${body}</svg>`;
}

function routeJoinedBoardsB5({ difficulty = 2 }) {
  const size = () => (difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(1, 3) : randomInt(2, 3));
  const [w1, h1, w2, h2] = [size(), size(), size() + (difficulty === 3 ? 1 : 0), size()];
  if (w1 * h1 === 1 && w2 * h2 === 1) return routeJoinedBoardsB5({ difficulty });
  const up = Math.random() < 0.5; // 아래에서 위로(오른쪽 위로) 가는 꼴
  // 칸 좌표: 첫 판 (0, 0)~(w1, h1), 둘째 판은 첫 판 모서리에서 이어진다.
  const boards = up
    ? [{ x: 0, y: h2, w: w1, h: h1 }, { x: w1, y: 0, w: w2, h: h2 }]
    : [{ x: 0, y: 0, w: w1, h: h1 }, { x: w1, y: h1, w: w2, h: h2 }];
  const points = up
    ? [{ x: 0, y: h2 + h1, label: "가", dx: -14, dy: 14 }, { x: w1, y: h2, label: "나", dx: -14, dy: 18 }, { x: w1 + w2, y: 0, label: "다", dx: 14, dy: -8 }]
    : [{ x: 0, y: 0, label: "가", dx: -14, dy: -8 }, { x: w1, y: h1, label: "나", dx: -14, dy: 20 }, { x: w1 + w2, y: h1 + h2, label: "다", dx: 14, dy: 18 }];
  const first = binom(w1 + h1, w1);
  const second = binom(w2 + h2, w2);
  const answer = first * second;
  return {
    prompt: "가에서 나를 지나 다까지 선을 따라 가장 짧은 길로 가는 방법은 모두 몇 가지인가요?",
    visual: { kind: "fig", html: latticeSvg(boards, points) },
    answer: `${answer}가지`,
    solution: `가에서 나까지 가장 짧은 길은 ${first}가지, 나에서 다까지는 ${second}가지입니다. 가에서 나까지의 길마다 나에서 다까지의 길을 이어 갈 수 있으므로 ${first} × ${second} = ${answer}가지입니다.`,
    meta: { family: "route-joined-boards-b5", w1, h1, w2, h2, up, first, second, answer }
  };
}

function routeStripSetB5({ difficulty = 2 }) {
  const heights = shuffle(difficulty === 1 ? [1, 2, 3, 4, 5] : difficulty === 2 ? [2, 3, 4, 5, 6, 7] : [3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((a, b) => a - b);
  const html = heights.map((h, i) => {
    const flip = Math.random() < 0.5;
    const boards = [{ x: 0, y: 0, w: 1, h }];
    const points = flip
      ? [{ x: 0, y: h, label: "시작", dx: 0, dy: 22 }, { x: 1, y: 0, label: "끝", dx: 0, dy: -10 }]
      : [{ x: 0, y: 0, label: "시작", dx: 0, dy: -10 }, { x: 1, y: h, label: "끝", dx: 0, dy: 22 }];
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><b style="font-size:15px">${PARTS[i]}</b>${latticeSvg(boards, points).replace(/width:(\d+)px/, (m, w) => `width:${w}px`)}</div>`;
  }).join("");
  return {
    prompt: "작은 정사각형을 한 줄로 이어 붙인 길입니다. 각 그림에서 시작점부터 끝점까지 선을 따라 가장 짧은 길로 가는 방법은 몇 가지인지 구하세요.",
    visual: { kind: "fig", html },
    answer: heights.map((h, i) => `${PARTS[i]} ${h + 1}가지`).join(", "),
    solution: `옆으로 한 칸 가는 곳을 어디에서 고르는지만 다릅니다. 칸이 ${heights.join(", ")}개이면 옆으로 갈 수 있는 곳은 ${heights.map((h) => h + 1).join(", ")}군데이므로 ${heights.map((h, i) => `${PARTS[i]} ${h + 1}가지`).join(", ")}입니다.`,
    meta: { family: "route-strip-set-b5", heights, answers: heights.map((h) => h + 1) }
  };
}

// ── 내보내기 ─────────────────────────────────────────


// ── 남은 번호(2차) — 2단원 숫자 카드: 큰 수부터·카드 수 조합, 방향 있는 차 ─────────────
const cardRowSvg = (digits) => {
  const w = 52, gap = 10, W = digits.length * (w + gap) + 10;
  return `${svgOpen(W, 80, "숫자 카드")}${digits.map((d, i) => `<rect x="${8 + i * (w + gap)}" y="8" width="${w}" height="64" rx="7" style="fill:#fff;stroke:#2f6b4f;stroke-width:2"/>${text(8 + i * (w + gap) + w / 2, 52, d, 28, 'font-weight="700"')}`).join("")}</svg>`;
};
const madeNumbers = (cards, length) => {
  const out = new Set();
  const walk = (chosen, left) => {
    if (chosen.length === length) { if (chosen[0] !== 0) out.add(Number(chosen.join(""))); return; }
    left.forEach((d, i) => walk([...chosen, d], left.filter((_, j) => j !== i)));
  };
  walk([], cards);
  return [...out].sort((a, b) => a - b);
};
const NUM_KO = { 2: "두", 3: "세", 4: "네", 5: "다섯" };
function digitCardRankedMixB5({ difficulty = 2 }) {
  for (;;) {
    const combos = difficulty === 1 ? [[3, 2], [4, 2]] : difficulty === 2 ? [[4, 2], [3, 3], [4, 3], [5, 2]] : [[4, 3], [5, 3], [5, 2]];
    const [cardCount, length] = pick(combos);
    const withZero = randomInt(0, 2) === 0;
    const nonzero = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, withZero ? cardCount - 1 : cardCount);
    const cards = (withZero ? [0, ...nonzero] : nonzero).sort((a, b) => a - b);
    const list = madeNumbers(cards, length);
    const fromLarge = difficulty === 1 ? true : randomInt(0, 2) > 0;
    const rank = randomInt(3, Math.min(difficulty === 3 ? 20 : 12, list.length - 1));
    if (rank > list.length) continue;
    const ordered = fromLarge ? list.slice().reverse() : list;
    const answer = ordered[rank - 1];
    const first = ordered[0];
    const lead = String(first)[0];
    const sameLead = ordered.filter((n) => String(n)[0] === lead).length;
    return {
      prompt: `숫자 카드 ${NUM_KO[cardCount]} 장${cardCount === length ? "을 모두 한 번씩 써서" : ` 중 ${NUM_KO[length]} 장을 골라 한 번씩만 써서`} ${NUM_KO[length]} 자리 수를 만들었습니다. 만든 수를 ${fromLarge ? "큰" : "작은"} 수부터 차례로 쓸 때 ${rank}번째 수를 구하세요.`,
      visual: { kind: "fig", html: cardRowSvg(cards) },
      answer: String(answer),
      solution: `맨 앞자리에 ${fromLarge ? "가장 큰" : "가장 작은"} 숫자 ${josa(Number(lead), "을", "를")}${withZero && !fromLarge ? "(0은 맨 앞에 올 수 없음)" : ""} 놓으면 ${sameLead}개가 만들어집니다. 맨 앞자리를 한 칸씩 바꾸며 개수를 묶어 세면 ${rank}번째는 ${answer}입니다. (${ordered.slice(0, rank).join(", ")})`,
      meta: { family: "digit-card-ranked-mix-b5", cards, length, fromLarge, rank, list }
    };
  }
}
function digitDirectedDifferenceB5({ difficulty = 2 }) {
  for (;;) {
    const d = randomInt(difficulty === 1 ? 3 : 1, difficulty === 3 ? 6 : 7);
    const tensBigger = randomInt(0, 1) === 1;
    const list = [];
    for (let n = 10; n <= 99; n += 1) { const a = Math.floor(n / 10), b = n % 10; if ((tensBigger ? a - b : b - a) === d) list.push(n); }
    const mode = difficulty === 1 ? "all" : pick(["all", "rank", "rank"]);
    const relation = tensBigger ? `십의 자리 숫자가 일의 자리 숫자보다 ${d} 큰` : `일의 자리 숫자가 십의 자리 숫자보다 ${d} 큰`;
    if (mode === "all") {
      if (list.length < 2) continue;
      return {
        prompt: `${relation} 두 자리 수를 모두 쓰세요.`,
        visual: { kind: "fig", html: `${svgOpen(320, 70, "십의 자리와 일의 자리")}<rect x="60" y="10" width="60" height="50" rx="5" style="fill:#fff;stroke:#2f6b4f;stroke-width:2"/><rect x="200" y="10" width="60" height="50" rx="5" style="fill:#fff;stroke:#2f6b4f;stroke-width:2"/>${text(90, 42, "십", 18)}${text(230, 42, "일", 18)}${text(160, 42, tensBigger ? `− ${d} →` : `← − ${d}`, 16)}</svg>` },
        answer: list.join(", "),
        solution: `${tensBigger ? `일의 자리가 0부터 ${9 - d}까지일 때 십의 자리는 ${d}부터 9까지` : `십의 자리가 1부터 ${9 - d}까지일 때 일의 자리는 ${d + 1}부터 9까지`}이므로 ${list.join(", ")} — 모두 ${list.length}개입니다. 차만 보면 두 방향이 있지만 「누가 더 큰지」가 정해져 있어 한쪽만 셉니다.`,
        meta: { family: "digit-directed-difference-b5", d, tensBigger, mode, list }
      };
    }
    const fromLarge = randomInt(0, 1) === 1;
    if (list.length < 3) continue;
    const rank = randomInt(2, list.length);
    const ordered = fromLarge ? list.slice().reverse() : list;
    return {
      prompt: `${relation} 두 자리 수를 ${fromLarge ? "큰" : "작은"} 수부터 차례로 쓸 때 ${rank}번째 수를 구하세요.`,
      visual: { kind: "fig", html: `${svgOpen(320, 70, "십의 자리와 일의 자리")}<rect x="60" y="10" width="60" height="50" rx="5" style="fill:#fff;stroke:#2f6b4f;stroke-width:2"/><rect x="200" y="10" width="60" height="50" rx="5" style="fill:#fff;stroke:#2f6b4f;stroke-width:2"/>${text(90, 42, "십", 18)}${text(230, 42, "일", 18)}${text(160, 42, tensBigger ? `− ${d} →` : `← − ${d}`, 16)}</svg>` },
      answer: String(ordered[rank - 1]),
      solution: `조건에 맞는 수를 차례로 쓰면 ${ordered.join(", ")}이므로 ${rank}번째는 ${ordered[rank - 1]}입니다.`,
      meta: { family: "digit-directed-difference-b5", d, tensBigger, mode, list, fromLarge, rank }
    };
  }
}

export const BOOK05_STRUCTURE_GENERATORS = {
  digitCardRankedMixB5,
  digitDirectedDifferenceB5,
  symbolCardListNetworkB5,
  symbolCardLeftoverB5,
  symbolCardCrossNetworkB5,
  symbolCardCrossPairSumB5,
  symbolCardTriangleNetworkB5,
  productCycleFillTrianglesB5,
  productCycleFillSquaresB5,
  productCycleFillPolygonB5,
  squareLayerNumberGridB5,
  squareLayerZigzagGridB5,
  calendarOrdinalPairSumStepsB5,
  calendarOrdinalPairSumWeekdayB5,
  calendarMixedWeekdaySumB5,
  mountainRowSumB5,
  stripRectangleCountB5,
  triangularTableB5,
  wideSnakeNumberGridB5,
  calendarThreeQuestionsB5,
  routeJoinedBoardsB5,
  routeStripSetB5
};

// 풀이기 확인용(검사기가 쓴다)
export const BOOK05_STRUCTURE_SOLVERS = { bruteSolutions, cycleSolutions, layerValue };

const row = (id, domain, middle, label, generator, aliases) => ({ id, domain, middle, label, generator, searchAliases: aliases });

export const BOOK05_STRUCTURE_TYPE_ROWS = [
  // domain/middle은 같은 단원 기존 유형 값을 따른다
  row("digit-card-ranked-mix-b5", "number", "숫자 카드", "카드 수·자리 수를 바꿔 만든 수의 큰(작은) 수부터 순서", "digitCardRankedMixB5", ["숫자 카드", "큰 수부터", "순서"]),
  row("digit-directed-difference-b5", "number", "숫자 카드", "한쪽 자리 숫자가 정해진 만큼 큰 두 자리 수 모두·순서", "digitDirectedDifferenceB5", ["자리 숫자의 차", "방향"]),
  row("symbol-card-list-network-b5", "number", "도형 곱셈식", "수 카드로 푸는 도형식 여러 개", "symbolCardListNetworkB5", ["도형식", "수 카드", "같은 모양 같은 수"]),
  row("symbol-card-leftover-b5", "number", "도형 곱셈식", "도형식에 쓰이지 않은 수 카드 찾기", "symbolCardLeftoverB5", ["도형식", "남는 카드", "쓰이지 않은 수"]),
  row("symbol-card-cross-network-b5", "number", "도형 곱셈식", "가로·세로 도형식에 수 카드 넣기", "symbolCardCrossNetworkB5", ["가로 세로 도형식", "십자 도형식", "수 카드"]),
  row("symbol-card-cross-pair-sum-b5", "number", "도형 곱셈식", "가로·세로 도형식에서 두 모양의 합", "symbolCardCrossPairSumB5", ["가로 세로 도형식", "두 모양의 합"]),
  row("symbol-card-triangle-network-b5", "number", "도형 곱셈식", "삼각형으로 이어진 도형식", "symbolCardTriangleNetworkB5", ["삼각형 도형식", "수 카드"]),
  row("product-cycle-fill-triangles-b5", "number", "곱셈 매트릭스", "삼각형 둘레 곱으로 원을 모두 채우기", "productCycleFillTrianglesB5", ["이웃한 두 수의 곱", "삼각형 꼭짓점"]),
  row("product-cycle-fill-squares-b5", "number", "곱셈 매트릭스", "사각형 둘레 곱으로 원을 모두 채우기", "productCycleFillSquaresB5", ["이웃한 두 수의 곱", "사각형 꼭짓점"]),
  row("product-cycle-fill-polygon-b5", "number", "곱셈 매트릭스", "큰 다각형 둘레 곱으로 원을 모두 채우기", "productCycleFillPolygonB5", ["이웃한 두 수의 곱", "오각형", "육각형", "팔각형"]),
  row("square-layer-number-grid-b5", "pattern", "수 배열 경로", "정사각형 층으로 늘어놓은 수 배열", "squareLayerNumberGridB5", ["ㄱ자 수 배열", "제곱수 배열"]),
  row("square-layer-zigzag-grid-b5", "pattern", "수 배열 경로", "층마다 방향이 바뀌는 정사각형 수 배열", "squareLayerZigzagGridB5", ["번갈아 채우는 수 배열", "제곱수 배열"]),
  row("calendar-ordinal-pair-sum-steps-b5", "pattern", "달력 규칙", "같은 요일 두 날짜의 합으로 날짜와 요일 찾기", "calendarOrdinalPairSumStepsB5", ["합차", "같은 요일", "달력"]),
  row("calendar-ordinal-pair-sum-weekday-b5", "pattern", "달력 규칙", "같은 요일 두 날짜의 합으로 다른 날의 요일 찾기", "calendarOrdinalPairSumWeekdayB5", ["합차", "같은 요일", "요일 찾기"]),
  row("calendar-mixed-weekday-sum-b5", "pattern", "달력 규칙", "서로 다른 요일 두 날짜의 합으로 다음 달 요일 찾기", "calendarMixedWeekdaySumB5", ["서로 다른 요일", "날짜의 합", "다음 달"]),
  row("mountain-row-sum-b5", "pattern", "수 배열 규칙", "1부터 커졌다 작아지는 줄의 합", "mountainRowSumB5", ["사각수", "줄의 합", "제곱수"]),
  row("strip-rectangle-count-b5", "geometry", "도형 세기", "한 줄 띠에서 크고 작은 사각형 세기", "stripRectangleCountB5", ["띠 사각형", "삼각수"]),
  row("wide-snake-number-grid-b5", "pattern", "수 배열 경로", "줄마다 방향을 바꾸어 쓴 넓은 수 배열", "wideSnakeNumberGridB5", ["뱀 모양 수 배열", "두 칸의 차", "두 칸의 합"]),
  row("calendar-three-questions-b5", "pattern", "달력 규칙", "달력 일부로 요일과 몇 번째 요일 날짜 찾기", "calendarThreeQuestionsB5", ["달력", "몇 번째 요일", "요일 찾기"]),
  row("route-joined-boards-b5", "logic", "최단거리", "붙은 두 길을 지나는 가장 짧은 방법 수", "routeJoinedBoardsB5", ["최단거리", "거쳐 가는 길", "곱의 법칙"]),
  row("route-strip-set-b5", "logic", "최단거리", "한 줄 띠 길의 가장 짧은 방법 수", "routeStripSetB5", ["최단거리", "한 줄 길"]),
  row("triangular-number-table-b5", "pattern", "수 배열 규칙", "1부터 이어 더한 삼각수 표 채우기", "triangularTableB5", ["삼각수", "연속한 수의 합"])
];

export const BOOK05_STRUCTURE_GUIDES = {
  "digit-card-ranked-mix-b5": "맨 앞자리 숫자마다 만들어지는 수의 개수를 묶어 세어 몇 번째인지 찾습니다.",
  "digit-directed-difference-b5": "어느 자리가 더 큰지 정해져 있으면 한 방향만 셉니다. 작은 쪽 숫자를 0(또는 1)부터 올려 가며 씁니다.",
  "symbol-card-list-network-b5": "될 수 있는 경우가 가장 적은 식부터 카드를 넣어 보고, 정해진 수는 다른 모양에서 지웁니다.",
  "symbol-card-leftover-b5": "식을 하나씩 맞춰 모양마다 수를 정한 뒤, 쓴 카드를 지우면 남는 카드가 답입니다.",
  "symbol-card-cross-network-b5": "가로식과 세로식이 만나는 모서리 모양부터 두 식에 함께 맞는 카드를 찾습니다.",
  "symbol-card-cross-pair-sum-b5": "같은 모양이 여러 식에 나오는 곳에서 0과 1의 성질을 먼저 쓰고, 찾은 두 수를 더합니다.",
  "symbol-card-triangle-network-b5": "꼭대기 모양이 두 식에 함께 들어가므로 그 수부터 두 식에 맞춰 봅니다.",
  "product-cycle-fill-triangles-b5": "두 수의 곱으로 한 가지로만 나타나는 변부터 정하고, 이웃한 변의 곱을 나누어 한 바퀴 채웁니다.",
  "product-cycle-fill-squares-b5": "한 가지로만 나누어지는 곱의 변에서 시작해 두 순서를 넣어 보고 네 변이 모두 맞는 쪽을 고릅니다.",
  "product-cycle-fill-polygon-b5": "범위 안 두 수의 곱으로 한 가지뿐인 변에서 시작해 시계 방향으로 나누어 가며 한 바퀴를 확인합니다.",
  "square-layer-number-grid-b5": "한 층이 끝나는 칸은 1, 4, 9, 16처럼 같은 수를 두 번 곱한 수이므로 그 칸에서 거꾸로 셉니다.",
  "square-layer-zigzag-grid-b5": "층이 끝나는 수는 같은 수를 두 번 곱한 수이고, 층마다 채우는 방향이 바뀌는 것을 확인합니다.",
  "calendar-ordinal-pair-sum-steps-b5": "같은 요일 두 날짜는 7일 차이이므로 (합 − 7) ÷ 2가 작은 날짜이고, 그 날에서 7일씩 옮겨 요일을 찾습니다.",
  "calendar-ordinal-pair-sum-weekday-b5": "합에서 7을 빼고 반으로 나누어 날짜를 찾고, 찾는 날까지의 날 수를 7로 묶어 남는 만큼 요일을 옮깁니다.",
  "calendar-mixed-weekday-sum-b5": "두 요일이 며칠 차이인지 먼저 정하고 1일부터 7일 사이에서 합이 맞는 날짜를 찾습니다.",
  "mountain-row-sum-b5": "줄의 합은 줄 번호를 두 번 곱한 수(1, 4, 9, 16, …)입니다.",
  "strip-rectangle-count-b5": "한 칸짜리부터 칸 수별로 세면 n + (n−1) + … + 1개입니다.",
  "triangular-number-table-b5": "앞의 삼각수에 다음 수를 더하면 다음 삼각수입니다.",
  "wide-snake-number-grid-b5": "첫 줄 끝 수로 한 줄에 몇 개인지 찾고, 줄마다 방향이 바뀌는 것을 생각해 칸의 수를 셉니다.",
  "calendar-three-questions-b5": "보이는 날짜의 요일에서 7일씩 같은 요일로 옮기고, 첫 번째 요일 날짜에 7씩 더해 몇 번째 날짜를 찾습니다.",
  "route-joined-boards-b5": "두 판의 이음점까지 가는 방법 수와 이음점부터 가는 방법 수를 곱합니다.",
  "route-strip-set-b5": "한 줄 띠에서는 옆으로 한 칸 가는 자리만 고르면 되므로 방법 수는 칸 수보다 하나 많습니다."
};

export const BOOK05_STRUCTURE_REMAPS = [
  // (2차) 2단원 숫자 카드 — 모두 쓰기·0 넣기·3장 세 자리는 10권과 같은 꼴, 큰 수부터·카드 수 조합, 방향 있는 차
  ["book-05", 2, "activity", 2, [1, 2], "digit-cards-list-all-b10"],
  ["book-05", 2, "practice", 1, [12, 13], "digit-cards-list-all-b10"],
  ["book-05", 2, "activity", 2, [4, 5, 6], "digit-card-ranked-mix-b5"],
  ["book-05", 2, "practice", 1, [9, 10, 11, 14, 15], "digit-card-ranked-mix-b5"],
  ["book-05", 2, "check", 2, [5, 6], "digit-directed-difference-b5"],
  ["book-05", 2, "practice", 1, [20, 21], "digit-directed-difference-b5"],
  // 1단원 — 정사각 층 수 배열(ㄱ자 · 번갈아), 같은 요일 두 날짜의 합
  ["book-05", 1, "activity", 1, [1], "wide-snake-number-grid-b5"],
  ["book-05", 1, "practice", 1, [2, 3], "wide-snake-number-grid-b5"],
  ["book-05", 1, "activity", 2, [1], "calendar-three-questions-b5"],
  ["book-05", 1, "practice", 1, [9, 10], "calendar-three-questions-b5"],
  ["book-05", 1, "activity", 1, [4], "square-layer-number-grid-b5"],
  ["book-05", 1, "practice", 1, [6], "square-layer-number-grid-b5"],
  ["book-05", 1, "advanced", 1, [1], "square-layer-zigzag-grid-b5"],
  ["book-05", 1, "check", 2, [1, 2], "calendar-ordinal-pair-sum-steps-b5"],
  ["book-05", 1, "check", 2, [4], "calendar-ordinal-pair-sum-weekday-b5"],
  ["book-05", 1, "practice", 1, [13, 14, 15, 16], "calendar-ordinal-pair-sum-weekday-b5"],
  ["book-05", 1, "advanced", 1, [3], "calendar-mixed-weekday-sum-b5"],
  // 2단원 — 1×n 띠 길 여러 개, 붙은 두 판을 지나는 길
  ["book-05", 2, "activity", 1, [1], "route-strip-set-b5"],
  ["book-05", 2, "practice", 1, [1], "route-strip-set-b5"],
  ["book-05", 2, "check", 1, [1, 2], "route-joined-boards-b5"],
  ["book-05", 2, "practice", 1, [4, 5], "route-joined-boards-b5"],
  // 3단원 — 이웃한 두 원의 곱으로 원 모두 채우기
  ["book-05", 3, "activity", 1, [2], "product-cycle-fill-triangles-b5"],
  ["book-05", 3, "activity", 1, [4], "product-cycle-fill-polygon-b5"],
  ["book-05", 3, "practice", 1, [1], "product-cycle-fill-triangles-b5"],
  ["book-05", 3, "practice", 1, [2], "product-cycle-fill-squares-b5"],
  ["book-05", 3, "practice", 1, [3, 4], "product-cycle-fill-polygon-b5"],
  ["book-05", 3, "advanced", 1, [1], "product-cycle-fill-polygon-b5"],
  // 3단원 — 수 카드 도형식(목록 · 가로·세로 · 삼각, 두 모양의 합 · 남는 카드)
  ["book-05", 3, "activity", 2, [4], "symbol-card-cross-pair-sum-b5"],
  ["book-05", 3, "check", 2, [1, 2, 3, 4], "symbol-card-list-network-b5"],
  ["book-05", 3, "practice", 1, [9, 15], "symbol-card-cross-network-b5"],
  ["book-05", 3, "practice", 1, [10], "symbol-card-triangle-network-b5"],
  ["book-05", 3, "practice", 1, [11, 12, 13, 14], "symbol-card-list-network-b5"],
  ["book-05", 3, "advanced", 1, [3], "symbol-card-leftover-b5"],
  ["book-05", 3, "advanced", 1, [4], "symbol-card-cross-network-b5"],
  // 4단원 — 삼각수 표, 1…n…1 줄의 합, 1×n 띠의 사각형
  ["book-05", 4, "activity", 1, [1], "triangular-number-table-b5"],
  ["book-05", 4, "activity", 2, [2], "mountain-row-sum-b5"],
  ["book-05", 4, "check", 1, [5], "strip-rectangle-count-b5"],
  ["book-05", 4, "practice", 1, [8], "strip-rectangle-count-b5"]
];
