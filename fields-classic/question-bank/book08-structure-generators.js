// 1과정 8권 — 교재 번호마다 그 문제의 꼴에 맞춘 새 생성기(원장 2026-11-25 「1:1 매칭」, 대조 결과는 1~10권 전체 대조).
// 교재의 그림 배치·수·문장은 옮기지 않는다. 꼴(칸 수·빈칸·묻는 것·그리기/고르기)만 맞추고 수와 배치는 새로 뽑는다.
// 내보내는 것:
//   BOOK08_STRUCTURE_GENERATORS — { 생성기 이름: (options) => 문항 }
//   BOOK08_STRUCTURE_TYPE_ROWS  — [{ id, domain, middle, label, generator, catalogGroup, catalogStrategy, searchAliases }]
//   BOOK08_STRUCTURE_GUIDES     — { 유형 id: 「핵심 방법」 한 줄 }
//   BOOK08_STRUCTURE_REMAPS     — [[권 id, 단원, 묶음, 묶음 번호, 번호들, 유형 id]] (textbook-remaps.js와 같은 꼴)
//
// 만든 꼴(대조 결과의 「새 생성기」·「partial 변형」):
//   1단원 도형 식 묶음 — 1~9 · 0~5처럼 작은 수 · 수 카드 몇 장에서 서로 다른 수, 한 도형 / 두 도형의 합을 묻는다.
//        답이 하나인지·아이가 풀 수 있는지는 「식마다 될 수 있는 수만 남기기」 풀이기(아래 propagate)로 본다 —
//        이 풀이기만으로 모든 도형이 정해지지 않으면 다시 뽑는다. 풀이 글도 그 차례 그대로 쓴다.
//   1단원 사각 틀 네 식(가로 둘·세로 둘) — 한 답 / 조건 하나로 한 답 / 두 가지 답. 모든 배치를 넣어 보는 풀이기로 센다.
//   1단원 곱셈 매트릭스 — 4×4 한 줄 두 칸 곱 쓰기 · 2~9를 숨은 자리에 놓는 곱셈 매트릭스(자리까지 찾기).
//   2단원 모양 피라미드(줄 2~3, 모양 1~3) · 모두 모양인 덧셈 복면산 — 자리마다 받아올림을 따지는 풀이기로 답이 하나인지 센다.
//   4단원 거꾸로 생각하기 — 세·네 단계 과정(버스 정류장·계단·주고받기·수) · 상대가 가진 만큼 준 뒤 「둘 다 N」.

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

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

// 수 뒤 받침: 끝자리 2·4·5·9는 받침 없음(이·사·오·구), 나머지(영·일·삼·육·칠·팔·십·백)는 받침 있음.
const hasBatchim = (n) => ![2, 4, 5, 9].includes(Math.abs(n) % 10);
const josa = (n, withBatchim, without) => `${n}${hasBatchim(n) ? withBatchim : without}`;
// 「으로/로」: ㄹ 받침(1·7·8)과 받침 없음은 「로」
const ro = (n) => `${n}${[1, 7, 8, 2, 4, 5, 9].includes(Math.abs(n) % 10) ? "로" : "으로"}`;

const INK = "#2f2a24";
const FONT = "font-family:'Noto Sans KR','FC Sans',sans-serif";

const svgOpen = (w, h, label) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="width:${w}px;max-width:100%;height:auto;flex:none" role="img" aria-label="${label}">`;
const text = (x, y, value, size = 18, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" style="fill:${INK};${FONT}" ${extra}>${value}</text>`;
const figs = (...svgs) => ({ kind: "fig", html: svgs.length === 1 ? svgs[0] : `<div style="display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;justify-content:center">${svgs.join("")}</div>` });

// ── 모양 ─────────────────────────────────────────────

const SHAPES = Object.freeze([
  { key: "circle", ch: "○" },
  { key: "triangle", ch: "△" },
  { key: "square", ch: "□" },
  { key: "diamond", ch: "◇" },
  { key: "star", ch: "☆" },
  { key: "heart", ch: "♡" },
  { key: "pentagon", ch: "⬠" },
  { key: "plus", ch: "✚" }
]);

// 모양 이름 뒤 조사: 별·오각형은 받침 있음(별이·오각형이), 나머지(동그라미·세모·네모·마름모·하트·십자)는 없음
const shapeBatchim = (index) => ["star", "pentagon"].includes(SHAPES[index].key);
const shapeIga = (index) => `${SHAPES[index].ch}${shapeBatchim(index) ? "이" : "가"}`;

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

// 수 카드 줄
function cardsSvg(cards, label = "수 카드") {
  const w = cards.length * 34 + 6;
  const body = cards.map((c, i) => `<rect x="${4 + i * 34}" y="4" width="28" height="30" rx="3" fill="#eaf1f4" stroke="${INK}" stroke-width="1.3"/>${text(18 + i * 34, 25, c, 16, 'font-weight="600"')}`).join("");
  return `${svgOpen(w, 38, label)}${body}</svg>`;
}

// 식 한 줄: 토큰 = 모양 번호(숫자) 또는 글자(연산자·수)
const tokenWidth = (t) => (typeof t === "number" ? 34 : String(t).length > 1 ? 14 * String(t).length + 8 : 24);
function tokenRow(tokens, x0, y, shapes) {
  let x = x0;
  let out = "";
  for (const t of tokens) {
    const w = tokenWidth(t);
    out += typeof t === "number" ? glyph(SHAPES[shapes[t]].key, x + w / 2, y) : text(x + w / 2, y + 6, t, 18);
    x += w;
  }
  return { out, width: x - x0 };
}

function equationsSvg(rows, shapes, label = "도형 식") {
  const widths = rows.map((r) => r.reduce((s, t) => s + tokenWidth(t), 0));
  const w = Math.max(...widths) + 20;
  const h = rows.length * 38 + 10;
  const body = rows.map((r, i) => tokenRow(r, 10, 24 + i * 38, shapes).out).join("");
  return `${svgOpen(w, h, label)}${body}</svg>`;
}

// ── 식 계산 ──────────────────────────────────────────

// 식 한쪽 = [값, 연산, 값, …] — ×·÷ 먼저, 그다음 +·− (빼서 0보다 작거나 나누어떨어지지 않으면 null)
function evalSide(side, val) {
  const terms = [];
  const ops = [];
  let cur = val(side[0]);
  if (cur === null) return null;
  for (let i = 1; i < side.length; i += 2) {
    const op = side[i];
    const v = val(side[i + 1]);
    if (v === null) return null;
    if (op === "×") cur *= v;
    else if (op === "÷") { if (v === 0 || cur % v !== 0) return null; cur /= v; }
    else { terms.push(cur); ops.push(op); cur = v; }
  }
  terms.push(cur);
  let acc = terms[0];
  for (let i = 0; i < ops.length; i += 1) {
    acc = ops[i] === "+" ? acc + terms[i + 1] : acc - terms[i + 1];
    if (acc < 0) return null;
  }
  return acc;
}

const eqShapes = (eq) => [...new Set([...eq.L, ...eq.R].filter((t) => typeof t === "number"))];
function eqHolds(eq, values) {
  const val = (t) => (typeof t === "number" ? (values[t] ?? null) : Number(t));
  const l = evalSide(eq.L, val);
  const r = evalSide(eq.R, val);
  return l !== null && r !== null && l === r;
}
const eqTokens = (eq) => [...eq.L, "=", ...eq.R];
const eqText = (eq, sh) => eqTokens(eq).map((t) => (typeof t === "number" ? SHAPES[sh[t]].ch : t)).join(" ");

// 식마다 될 수 있는 수만 남기기(서로 다른 도형은 서로 다른 수). allUsed면 「이 수는 이 도형만 될 수 있다」도 쓴다.
// 돌려주는 것: { cand, steps:[{ shape, value, eq|null }] } — 모든 cand가 한 개면 아이가 풀 수 있다.
function propagate(k, pool, eqs, { allUsed = false, extra = [] } = {}) {
  const cand = Array.from({ length: k }, () => new Set(pool));
  const steps = [];
  const fixed = new Set();
  const note = (eq) => {
    for (let s = 0; s < k; s += 1) {
      if (cand[s].size === 1 && !fixed.has(s)) { fixed.add(s); steps.push({ shape: s, value: [...cand[s]][0], eq }); }
    }
  };
  const all = [...eqs, ...extra];
  let changed = true;
  let guard = 0;
  while (changed && guard < 60) {
    changed = false;
    guard += 1;
    for (const eq of all) {
      const shapes = eqShapes(eq);
      const support = shapes.map(() => new Set());
      const values = {};
      const used = new Set();
      const visit = (i) => {
        if (i === shapes.length) {
          if ((eq.test ? eq.test(values) : eqHolds(eq, values))) shapes.forEach((s, j) => support[j].add(values[s]));
          return;
        }
        for (const v of cand[shapes[i]]) {
          if (used.has(v)) continue;
          used.add(v);
          values[shapes[i]] = v;
          visit(i + 1);
          used.delete(v);
        }
        delete values[shapes[i]];
      };
      visit(0);
      shapes.forEach((s, j) => {
        for (const v of [...cand[s]]) if (!support[j].has(v)) { cand[s].delete(v); changed = true; }
      });
      note(eq);
    }
    // 정해진 수는 다른 도형에서 지우기
    for (let s = 0; s < k; s += 1) {
      if (cand[s].size !== 1) continue;
      const v = [...cand[s]][0];
      for (let t = 0; t < k; t += 1) if (t !== s && cand[t].delete(v)) changed = true;
    }
    note(null);
    if (allUsed) {
      for (const v of pool) {
        const where = range(0, k - 1).filter((s) => cand[s].has(v));
        if (where.length === 1 && cand[where[0]].size > 1) { cand[where[0]] = new Set([v]); changed = true; }
      }
      note(null);
    }
    if (cand.some((c) => c.size === 0)) return { cand, steps, broken: true };
  }
  return { cand, steps, broken: false };
}

const solvedAll = (res) => !res.broken && res.cand.every((c) => c.size === 1);

// 모든 배치를 넣어 보는 풀이기(검산용) — 서로 다른 도형은 서로 다른 수
function bruteSolutions(k, pool, eqs, limit = 50) {
  const out = [];
  const vals = new Array(k);
  const used = new Set();
  const order = [];
  eqs.forEach((eq) => eqShapes(eq).forEach((s) => { if (!order.includes(s)) order.push(s); }));
  range(0, k - 1).forEach((s) => { if (!order.includes(s)) order.push(s); });
  const ready = eqs.map((eq) => Math.max(...eqShapes(eq).map((s) => order.indexOf(s))));
  const visit = (i) => {
    if (out.length >= limit) return;
    if (i === k) { out.push([...vals]); return; }
    const s = order[i];
    for (const v of pool) {
      if (used.has(v)) continue;
      vals[s] = v;
      if (eqs.every((eq, j) => ready[j] !== i || (eq.test ? eq.test(vals) : eqHolds(eq, vals)))) {
        used.add(v);
        visit(i + 1);
        used.delete(v);
      }
    }
    vals[s] = undefined;
  };
  visit(0);
  return out;
}

// ── 1단원 도형 식 묶음 ─────────────────────────────────

// 꼴(글자 a,b,c,d는 서로 다른 도형). 식은 값이 참인 것만 남긴다.
const FORMS = {
  sq: ["a", "×", "a", "=", "b"],
  cube: ["a", "×", "a", "×", "a", "=", "b"],
  dbl: ["a", "+", "a", "=", "b"],
  tpl: ["a", "+", "a", "+", "a", "=", "b"],
  mul: ["a", "×", "b", "=", "c"],
  add: ["a", "+", "b", "=", "c"],
  sub: ["a", "−", "b", "=", "c"],
  mulmul: ["a", "×", "b", "=", "c", "×", "d"],
  addadd: ["a", "+", "b", "=", "c", "+", "d"],
  sqmul: ["a", "×", "a", "=", "b", "×", "c"],
  mulsame: ["a", "×", "b", "=", "a"],
  addsame: ["a", "+", "b", "=", "a"],
  leftAdd: ["a", "=", "a", "+", "b"],
  leftSqAdd: ["a", "=", "b", "×", "b", "+", "c"],
  leftSub: ["a", "=", "b", "−", "c"],
  leftMul: ["a", "=", "b", "×", "c"],
  mulAdd: ["a", "×", "b", "=", "c", "+", "d"]
};

function formEquation(form, map) {
  const toks = FORMS[form].map((t) => (/^[abcd]$/.test(t) ? map[t] : t));
  const eqAt = toks.indexOf("=");
  return { L: toks.slice(0, eqAt), R: toks.slice(eqAt + 1), form };
}

function candidateEquations(vals, forms) {
  const k = vals.length;
  const out = [];
  for (const form of forms) {
    const letters = [...new Set(FORMS[form].filter((t) => /^[abcd]$/.test(t)))];
    const visit = (i, map, used) => {
      if (i === letters.length) {
        const eq = formEquation(form, map);
        if (eqHolds(eq, vals)) out.push(eq);
        return;
      }
      for (let s = 0; s < k; s += 1) {
        if (used.has(s)) continue;
        used.add(s);
        visit(i + 1, { ...map, [letters[i]]: s }, used);
        used.delete(s);
      }
    };
    visit(0, {}, new Set());
  }
  return out;
}

const SHAPE_SETS = [
  ["circle", "triangle", "square", "diamond", "star", "pentagon"],
  ["circle", "square", "diamond", "plus", "star", "triangle"],
  ["diamond", "square", "pentagon", "triangle", "plus", "circle"],
  ["circle", "diamond", "square", "heart", "pentagon", "star"]
];

function makeNetwork({ k, pool, eqCount, forms, allUsed = false, needForms = [], tries = 400 }) {
  for (let attempt = 0; attempt < tries; attempt += 1) {
    const vals = shuffle(pool).slice(0, k);
    const cands = candidateEquations(vals, forms);
    if (cands.length < eqCount) continue;
    // 같은 식이 두 번 들어가지 않게, 모든 도형이 한 번은 나오게 고른다
    const chosen = [];
    const keyOf = (eq) => eqText(eq, range(0, 7));
    for (const eq of shuffle(cands)) {
      if (chosen.length >= eqCount) break;
      if (chosen.some((c) => keyOf(c) === keyOf(eq))) continue;
      // 한 식이 다른 식과 도형을 전부 같이 쓰면(같은 내용을 되풀이) 빼기
      if (chosen.some((c) => eqShapes(c).join() === eqShapes(eq).join())) continue;
      chosen.push(eq);
    }
    if (chosen.length !== eqCount) continue;
    const covered = new Set(chosen.flatMap(eqShapes));
    if (covered.size !== k) continue;
    if (needForms.length && !needForms.some((f) => chosen.some((eq) => eq.form === f))) continue;
    const res = propagate(k, pool, chosen, { allUsed });
    if (!solvedAll(res)) continue;
    // 첫 식 하나만 보고 정해지는 도형이 셋 이상이면 너무 쉽다 — 다시
    const first = propagate(k, pool, [chosen[0]], { allUsed });
    if (first.cand.filter((c) => c.size === 1).length >= 3) continue;
    const order = res.steps.filter((st) => st.eq).map((st) => st.eq);
    const ordered = [...new Set([...order, ...chosen])];
    return { vals, eqs: ordered, res };
  }
  return null;
}

function stepsText(made, sh) {
  const seen = new Set();
  const lines = [];
  for (const st of made.res.steps) {
    if (seen.has(st.shape)) continue;
    seen.add(st.shape);
    const where = st.eq ? `${eqText(st.eq, sh)}에서` : "남은 수를 따져 보면";
    lines.push(`${where} ${SHAPES[sh[st.shape]].ch}=${st.value}`);
  }
  return lines.join(" → ");
}

function networkProblem({ made, sh, pool, poolNote, ask, kind, showCards }) {
  const { vals, eqs } = made;
  const rows = eqs.map(eqTokens);
  const askText = ask.length === 1 ? `${SHAPES[sh[ask[0]]].ch}` : `${SHAPES[sh[ask[0]]].ch}+${SHAPES[sh[ask[1]]].ch}`;
  const answerValue = ask.reduce((s, a) => s + vals[a], 0);
  const prompt = `다음 식에서 각 도형은 ${poolNote} 서로 다른 수를 나타냅니다. ${ask.length === 1 ? `${shapeIga(sh[ask[0]])} 나타내는 수를 구하세요.` : `${askText}의 값을 구하세요.`}`;
  const svgs = [];
  if (showCards) svgs.push(cardsSvg(pool));
  svgs.push(equationsSvg(rows, sh, "도형 식"));
  const visual = showCards
    ? { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">${svgs.join("")}</div>` }
    : figs(...svgs);
  const tail = ask.length === 1 ? `따라서 ${askText}=${answerValue}입니다.` : `따라서 ${askText}=${vals[ask[0]]}+${vals[ask[1]]}=${answerValue}입니다.`;
  return {
    prompt,
    visual,
    answer: String(answerValue),
    solution: `식마다 될 수 있는 수만 남기며 차례로 정합니다. ${stepsText(made, sh)}. ${tail}`,
    meta: { family: "symbol-network-b8", kind, pool, values: vals, equations: eqs.map((e) => ({ L: e.L, R: e.R })), ask, shapes: sh, allUsed: kind === "cards", result: answerValue }
  };
}

function symbolNetworkBase({ difficulty = 2, kind }) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    let made = null;
    let pool;
    let poolNote;
    let ask;
    let showCards = false;
    let k;
    if (kind === "one" || kind === "sum") {
      pool = range(1, 9);
      poolNote = "1부터 9까지의 수 중에서";
      k = kind === "sum" ? (difficulty === 3 ? 7 : 6) : difficulty === 1 ? 5 : 6;
      const forms = pick([
        ["sq", "cube", "tpl", "dbl", "add", "mul", "mulmul", "sqmul"],
        ["sq", "mul", "mulmul", "sqmul", "add", "mulAdd"],
        ["sq", "add", "mul", "mulmul", "addadd", "dbl"]
      ]);
      made = makeNetwork({ k, pool, eqCount: kind === "sum" ? (k >= 7 ? 5 : 4) : 4, forms, needForms: ["sq", "cube", "sqmul"] });
      if (!made) continue;
      // 두 도형의 합을 물을 때는 마지막에 정해지는 도형과 그 앞 도형
      const order = made.res.steps.map((st) => st.shape);
      ask = kind === "sum" ? [order[order.length - 1], order[order.length - 2]].sort((a, b) => a - b) : [order[order.length - 1]];
    } else if (kind === "small") {
      const top = difficulty === 1 ? 5 : pick([5, 6]);
      pool = range(0, top);
      poolNote = `0부터 ${top}까지의 수 중에서`;
      showCards = top === 5;
      k = Math.min(pool.length, difficulty === 3 ? 7 : 6);
      made = makeNetwork({ k, pool, eqCount: 4, forms: ["sq", "mulsame", "addsame", "leftAdd", "sub", "add", "leftSqAdd", "leftSub", "mul", "leftMul"], needForms: ["mulsame", "addsame", "leftAdd"] });
      if (!made) continue;
      const order = made.res.steps.map((st) => st.shape);
      ask = [order[order.length - 1]];
    } else {
      // 수 카드 넉 장을 한 번씩(서로 다른 도형 넷)
      pool = shuffle(range(2, 9)).slice(0, 4).sort((a, b) => a - b);
      poolNote = `${pool.join(", ")} 중에서`;
      showCards = true;
      k = 4;
      made = makeNetwork({ k, pool, eqCount: 3, forms: ["sq", "add", "mul", "mulmul", "dbl", "sqmul", "addadd"], allUsed: true, tries: 200 });
      if (!made) continue;
      const order = made.res.steps.map((st) => st.shape);
      ask = [order[order.length - 1]];
    }
    const sh = k <= 6
      ? shuffle(pick(SHAPE_SETS)).slice(0, k).map((key) => SHAPES.findIndex((s) => s.key === key))
      : shuffle(range(0, SHAPES.length - 1)).slice(0, k);
    return networkProblem({ made, sh, pool, poolNote, ask, kind, showCards });
  }
  throw new Error(`book08 symbol network (${kind}) generation failed`);
}

const symbolNetworkOneB8 = (o) => symbolNetworkBase({ ...o, kind: "one" });
const symbolNetworkSumB8 = (o) => symbolNetworkBase({ ...o, kind: "sum" });
const symbolNetworkSmallPoolB8 = (o) => symbolNetworkBase({ ...o, kind: "small" });
const symbolNetworkCardsB8 = (o) => symbolNetworkBase({ ...o, kind: "cards" });

// ── 1단원 사각 틀 네 식 ───────────────────────────────
// 자리: 0 TL, 1 TM, 2 TR, 3 ML, 4 MR, 5 BL, 6 BM, 7 BR
// 위: TL op TM = TR · 왼쪽: TL op ML = BL · 오른쪽: TR op MR = BR · 아래: BL op BM = BR

const FRAME_LINES = [[0, 1, 2], [0, 3, 5], [2, 4, 7], [5, 6, 7]];
const applyOp = (op, a, b) => {
  if (op === "+") return a + b;
  if (op === "−") return a - b >= 0 ? a - b : null;
  if (op === "×") return a * b;
  return b !== 0 && a % b === 0 ? a / b : null;
};

function frameEquations(ops, pos) {
  return FRAME_LINES.map(([a, b, c], i) => ({ L: [pos[a], ops[i], pos[b]], R: [pos[c]] }));
}

// 자리 값 고르기: 위·왼쪽에서 TL·TM·ML을 정하면 TR·BL이 정해지고, MR·BM을 정하면 BR이 두 번 맞아야 한다
const frameMemo = new Map();
function frameTruths(ops, pool, { distinct }) {
  const memoKey = `${ops.join("")}|${pool.join(",")}|${distinct}`;
  if (frameMemo.has(memoKey)) return frameMemo.get(memoKey);
  const out = [];
  const inPool = new Set(pool);
  for (const tl of pool) for (const tm of pool) for (const ml of pool) {
    const tr = applyOp(ops[0], tl, tm);
    const bl = applyOp(ops[1], tl, ml);
    if (tr === null || bl === null || !inPool.has(tr) || !inPool.has(bl)) continue;
    for (const mr of pool) for (const bm of pool) {
      const br = applyOp(ops[2], tr, mr);
      if (br === null || !inPool.has(br) || applyOp(ops[3], bl, bm) !== br) continue;
      const v = [tl, tm, tr, ml, mr, bl, bm, br];
      if (distinct && new Set(v).size !== 8) continue;
      out.push(v);
    }
  }
  frameMemo.set(memoKey, out);
  return out;
}

const OPS = ["+", "−", "×", "÷"];

function frameSvg(made, sh) {
  const cell = 64;
  const P = [[0, 0], [2, 0], [4, 0], [0, 2], [4, 2], [0, 4], [2, 4], [4, 4]];
  const at = (gx, gy) => [30 + gx * cell * 0.62, 26 + gy * cell * 0.55];
  let body = "";
  P.forEach(([gx, gy], i) => { const [x, y] = at(gx, gy); body += glyph(SHAPES[sh[made.pos[i]]].key, x, y, 14); });
  const [o0, o1, o2, o3] = made.ops;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const put = (xy, s) => text(xy[0], xy[1] + 6, s, 18);
  body += put(mid(at(0, 0), at(2, 0)), o0) + put(mid(at(2, 0), at(4, 0)), "=");
  body += put(mid(at(0, 4), at(2, 4)), o3) + put(mid(at(2, 4), at(4, 4)), "=");
  body += put(mid(at(0, 0), at(0, 2)), o1) + put(mid(at(0, 2), at(0, 4)), "‖");
  body += put(mid(at(4, 0), at(4, 2)), o2) + put(mid(at(4, 2), at(4, 4)), "‖");
  const [w, h] = [at(4, 4)[0] + 30, at(4, 4)[1] + 28];
  return `${svgOpen(Math.round(w), Math.round(h), "가로 세로 네 식")}${body}</svg>`;
}

function frameBase({ difficulty = 2, mode }) {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    let pool;
    let poolNote;
    let showCards = false;
    let pattern;
    if (mode === "two" || (mode === "one" && attempt % 3 === 0)) {
      pool = range(1, 8);
      pattern = "distinct";
    } else if (mode === "one" && attempt % 3 === 1) {
      pattern = "squares";
      pool = [];
    } else {
      pattern = "zero";
      const top = pick([4, 5]);
      pool = range(0, top);
      poolNote = `0부터 ${top}까지의 수 중에서 서로 다른 수`;
    }
    if (pattern === "distinct") poolNote = "1부터 8까지의 수";
    let ops;
    let truths;
    if (pattern === "squares") {
      // 위·아래가 같은 도형 두 번 곱하기, 옆은 더하기
      ops = ["×", "+", "+", "×"];
      const all = range(1, 9);
      truths = frameTruths(ops, all, { distinct: false }).filter((v) => v[0] === v[1] && v[5] === v[6] && new Set([v[0], v[2], v[3], v[4], v[5], v[7]]).size === 6 && v[0] > 1);
      if (!truths.length) continue;
      const truth = pick(truths);
      const used = [truth[0], truth[2], truth[3], truth[4], truth[5], truth[7]];
      const extra = shuffle(range(1, 9).filter((x) => !used.includes(x))).slice(0, difficulty === 3 ? 1 : 0);
      pool = [...used, ...extra].sort((a, b) => a - b);
      poolNote = `${pool.join(", ")} 중에서 서로 다른 수`;
      showCards = true;
      truths = [truth];
    } else {
      ops = [pick(OPS), pick(OPS), pick(OPS), pick(OPS)];
      if (new Set(ops).size < 2) continue;
      truths = frameTruths(ops, pool, { distinct: pattern === "distinct" });
      if (pattern === "zero") truths = truths.filter((v) => new Set(v).size <= 5 && new Set(v).size >= 4);
      if (!truths.length) continue;
    }
    const truth = pick(truths);
    // 같은 값의 자리는 같은 도형
    const distinctVals = [...new Set(truth)];
    const pos = truth.map((v) => distinctVals.indexOf(v));
    const k = distinctVals.length;
    if (k > 8) continue;
    const eqs = frameEquations(ops, pos);
    const sols = bruteSolutions(k, pool, eqs, 60);
    if (sols.length >= 60) continue;
    const made = { ops, pos, k, vals: distinctVals, pool, eqs };
    let ask;
    let order = null;
    let answer;
    let answerValues;
    if (mode === "two") {
      const options = range(0, k - 1).filter((s) => new Set(sols.map((x) => x[s])).size === 2);
      if (!options.length) continue;
      ask = [pick(options)];
      answerValues = [...new Set(sols.map((x) => x[ask[0]]))].sort((a, b) => a - b);
      answer = answerValues.join(", ");
    } else if (pattern === "zero") {
      const pairs = [];
      for (let a = 0; a < k; a += 1) for (let b = a + 1; b < k; b += 1) if (new Set(sols.map((x) => x[a] + x[b])).size === 1) pairs.push([a, b]);
      if (!pairs.length || sols.length > 4) continue;
      ask = pick(pairs);
      answerValues = [distinctVals[ask[0]] + distinctVals[ask[1]]];
      answer = String(answerValues[0]);
    } else {
      const unique = range(0, k - 1).filter((s) => new Set(sols.map((x) => x[s])).size === 1);
      if (sols.length === 1) {
        ask = [pick(range(0, k - 1).filter((s) => pos.indexOf(s) !== 0))];
      } else if (pattern === "distinct") {
        // 조건 하나(□ > △)로 답이 하나가 되는 경우
        const choices = [];
        for (let a = 0; a < k; a += 1) for (let b = 0; b < k; b += 1) {
          if (a === b || distinctVals[a] <= distinctVals[b]) continue;
          const left = sols.filter((x) => x[a] > x[b]);
          if (left.length === sols.length) continue;
          const targets = range(0, k - 1).filter((s) => s !== a && s !== b && new Set(left.map((x) => x[s])).size === 1 && new Set(sols.map((x) => x[s])).size > 1);
          if (targets.length) choices.push({ a, b, targets });
        }
        if (!choices.length) continue;
        const c = pick(choices);
        order = { big: c.a, small: c.b };
        ask = [pick(c.targets)];
      } else {
        if (!unique.length) continue;
        ask = [pick(unique)];
      }
      answerValues = [distinctVals[ask[0]]];
      answer = String(answerValues[0]);
    }
    const sh = shuffle(SHAPES.map((_, i) => i)).slice(0, k);
    const ch = (s) => SHAPES[sh[s]].ch;
    const askText = ask.length === 2 ? `${ch(ask[0])}+${ch(ask[1])}의 값` : `${shapeIga(sh[ask[0]])} 나타내는 수`;
    const orderText = order ? ` (단, ${ch(order.big)} > ${ch(order.small)}입니다.)` : "";
    const lead = pattern === "distinct" ? "각 도형은 1부터 8까지의 수를 한 번씩 나타냅니다." : `각 도형은 ${poolNote}를 나타냅니다.`;
    const prompt = `그림은 네 개의 식을 가로와 세로로 놓은 것입니다. ${lead} 네 식이 모두 맞을 때 ${askText}${mode === "two" ? "를 모두" : "를"} 구하세요.${orderText}${mode === "two" ? " (두 가지 경우가 있습니다.)" : ""}`;
    const valueList = (x) => range(0, k - 1).map((s) => `${ch(s)}=${x[s]}`).join(", ");
    const lines = eqs.map((eq) => eqText(eq, sh));
    const chosenSols = order ? sols.filter((x) => x[order.big] > x[order.small]) : sols;
    let solution;
    if (mode === "two") {
      solution = `네 식은 ${lines.join(", ")}입니다. 모서리의 도형부터 두 식에 함께 맞는 수를 넣어 보면 맞는 경우는 ${sols.map(valueList).join(" / ")}입니다. 따라서 ${ch(ask[0])}=${answer}입니다.`;
    } else {
      const shown = chosenSols.length === 1 ? valueList(chosenSols[0]) : `${chosenSols.length}가지가 있지만 모두 ${ch(ask[0])}${ask[1] !== undefined ? `+${ch(ask[1])}` : ""}=${answer}`;
      solution = `네 식은 ${lines.join(", ")}입니다. 같은 도형이 두 식에 들어가는 모서리부터 0·1과 곱셈의 성질을 따져 넣어 보면 ${shown}입니다.${order ? ` (${ch(order.big)} > ${ch(order.small)}인 경우만 남깁니다.)` : ""} 따라서 ${askText.replace(/의 값|가 나타내는 수/, "")}=${answer}입니다.`;
    }
    const svgs = [];
    if (showCards || pattern === "distinct") svgs.push(cardsSvg(pool));
    svgs.push(frameSvg(made, sh));
    return {
      prompt,
      visual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">${svgs.join("")}</div>` },
      answer,
      solution,
      meta: { family: "square-frame-b8", mode, pattern, ops, pos, pool, values: distinctVals, ask, order, answerValues, solutionCount: sols.length, distinct: true }
    };
  }
  throw new Error(`book08 square frame (${mode}) generation failed`);
}

const squareFrameEquationsB8 = (o) => frameBase({ ...o, mode: "one" });
const squareFrameTwoCasesB8 = (o) => frameBase({ ...o, mode: "two" });

// ── 1단원 곱셈 매트릭스 ───────────────────────────────

// 4×4에서 줄마다 두 칸: 두 순열 행렬을 겹치지 않게 더한 모양
function twoPerLinePattern() {
  for (;;) {
    const p = shuffle([0, 1, 2, 3]);
    const q = shuffle([0, 1, 2, 3]);
    if (p.some((c, r) => q[r] === c)) continue;
    return [0, 1, 2, 3].map((r) => [p[r], q[r]].sort((a, b) => a - b));
  }
}

function gridSvg(cells, { rowLabels = null, colLabels = null, circles = false, shaded = null } = {}) {
  const c = 34;
  const x0 = 6;
  const y0 = 6;
  const w = x0 + 4 * c + 52;
  const h = y0 + 4 * c + 44;
  let body = "";
  for (let r = 0; r < 4; r += 1) for (let col = 0; col < 4; col += 1) {
    const on = shaded ? shaded[r][col] : false;
    body += `<rect x="${x0 + col * c}" y="${y0 + r * c}" width="${c}" height="${c}" fill="${on ? "#dcecee" : "#fff"}" stroke="${INK}" stroke-width="1.2"/>`;
    const v = cells[r][col];
    if (v !== "" && v !== null && v !== undefined) body += text(x0 + col * c + c / 2, y0 + r * c + c / 2 + 6, v, 17);
  }
  for (let r = 0; r < 4; r += 1) {
    const cx = x0 + 4 * c + 22;
    const cy = y0 + r * c + c / 2;
    if (circles) body += `<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
    if (rowLabels) body += text(cx, cy + 6, rowLabels[r], 16);
  }
  for (let col = 0; col < 4; col += 1) {
    const cx = x0 + col * c + c / 2;
    const cy = y0 + 4 * c + 22;
    if (circles) body += `<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="${INK}" stroke-width="1.2"/>`;
    if (colLabels) body += text(cx, cy + 6, colLabels[col], 16);
  }
  return `${svgOpen(w, h, "곱셈 매트릭스")}${body}</svg>`;
}

function productFillOnce() {
  const pat = twoPerLinePattern();
  const cells = Array.from({ length: 4 }, () => Array(4).fill(""));
  const shaded = Array.from({ length: 4 }, () => Array(4).fill(false));
  pat.forEach((cols, r) => cols.forEach((col) => { cells[r][col] = randomInt(2, 9); shaded[r][col] = true; }));
  const rows = cells.map((row) => row.filter((v) => v !== "").reduce((a, b) => a * b, 1));
  const cols = [0, 1, 2, 3].map((col) => cells.map((row) => row[col]).filter((v) => v !== "").reduce((a, b) => a * b, 1));
  return { cells, shaded, rows, cols };
}

function productMatrixFillB8({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 1 : 2;
  const made = Array.from({ length: parts }, productFillOnce);
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  return {
    prompt: "곱셈 매트릭스의 가로줄과 세로줄마다 색칠한 칸이 두 개씩 있습니다. 각 줄의 두 수를 곱한 값을 오른쪽과 아래의 ○에 써넣으세요.",
    visual: figs(...made.map((m) => gridSvg(m.cells, { circles: true, shaded: m.shaded }))),
    answer: made.map((m, i) => `${tag(i)}가로 ${m.rows.join(", ")} / 세로 ${m.cols.join(", ")}`).join(" · "),
    solution: made.map((m, i) => `${tag(i)}가로줄은 위에서부터 ${m.cells.map((row) => row.filter((v) => v !== "").join("×")).map((e, r) => `${e}=${m.rows[r]}`).join(", ")}이고, 세로줄은 왼쪽부터 ${m.cols.join(", ")}입니다.`).join(" "),
    meta: { family: "product-matrix-fill-b8", parts: made.map((m) => ({ cells: m.cells, rows: m.rows, cols: m.cols })) }
  };
}

// 2~9를 한 번씩, 줄마다 두 칸 — 자리는 숨김. 가로 곱·세로 곱만 보고 자리까지 찾는다.
function hiddenPlacementSolutions(rowProducts, colProducts, digits = range(2, 9), limit = 3) {
  const pairsFor = (p) => {
    const out = [];
    for (let i = 0; i < digits.length; i += 1) for (let j = i + 1; j < digits.length; j += 1) if (digits[i] * digits[j] === p) out.push([digits[i], digits[j]]);
    return out;
  };
  const rowChoices = rowProducts.map(pairsFor);
  const colChoices = colProducts.map(pairsFor);
  const sols = [];
  const rowPick = [];
  const used = new Set();
  const pickRows = (r) => {
    if (sols.length >= limit) return;
    if (r === 4) { pickCols(0, [], new Set()); return; }
    for (const pr of rowChoices[r]) {
      if (pr.some((d) => used.has(d))) continue;
      pr.forEach((d) => used.add(d));
      rowPick.push(pr);
      pickRows(r + 1);
      rowPick.pop();
      pr.forEach((d) => used.delete(d));
    }
  };
  const pickCols = (c, colPick, cused) => {
    if (sols.length >= limit) return;
    if (c === 4) {
      const grid = Array.from({ length: 4 }, () => Array(4).fill(""));
      for (const d of digits) {
        const r = rowPick.findIndex((pr) => pr.includes(d));
        const col = colPick.findIndex((pr) => pr.includes(d));
        if (grid[r][col] !== "") return;
        grid[r][col] = d;
      }
      sols.push(grid);
      return;
    }
    for (const pr of colChoices[c]) {
      if (pr.some((d) => cused.has(d))) continue;
      pr.forEach((d) => cused.add(d));
      pickCols(c + 1, [...colPick, pr], cused);
      pr.forEach((d) => cused.delete(d));
    }
  };
  pickRows(0);
  return sols;
}

function productMatrixHiddenB8({ difficulty = 2 }) {
  const parts = difficulty === 3 ? 2 : 1;
  const made = [];
  for (let attempt = 0; attempt < 2000 && made.length < parts; attempt += 1) {
    const pat = twoPerLinePattern();
    const digits = shuffle(range(2, 9));
    const grid = Array.from({ length: 4 }, () => Array(4).fill(""));
    let i = 0;
    pat.forEach((cols, r) => cols.forEach((col) => { grid[r][col] = digits[i]; i += 1; }));
    const rows = grid.map((row) => row.filter((v) => v !== "").reduce((a, b) => a * b, 1));
    const cols = [0, 1, 2, 3].map((col) => grid.map((row) => row[col]).filter((v) => v !== "").reduce((a, b) => a * b, 1));
    const sols = hiddenPlacementSolutions(rows, cols);
    if (sols.length !== 1) continue;
    made.push({ grid, rows, cols });
  }
  if (made.length !== parts) throw new Error("book08 hidden product matrix generation failed");
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  const empty = Array.from({ length: 4 }, () => Array(4).fill(""));
  return {
    prompt: "2부터 9까지의 수를 한 번씩 넣어 곱셈 매트릭스를 완성하세요. 가로줄과 세로줄에는 수가 두 개씩 들어가고, 가로줄의 두 수의 곱은 오른쪽, 세로줄의 두 수의 곱은 아래에 있는 수입니다.",
    visual: figs(...made.map((m) => gridSvg(empty, { rowLabels: m.rows, colLabels: m.cols }))),
    answer: made.map((m, i) => `${tag(i)}${m.grid.map((row) => row.map((v) => (v === "" ? "·" : v)).join(" ")).join(" / ")}`).join(" · "),
    solution: made.map((m, i) => `${tag(i)}5나 7처럼 곱으로 한 가지로만 나타나는 수부터 가로줄과 세로줄을 정하면 위에서부터 ${m.grid.map((row) => row.map((v) => (v === "" ? "·" : v)).join(" ")).join(" / ")}입니다.`).join(" "),
    answerVisual: figs(...made.map((m) => gridSvg(m.grid, { rowLabels: m.rows, colLabels: m.cols }))),
    meta: { family: "product-matrix-hidden-b8", parts: made }
  };
}

// ── 2단원 복면산 ─────────────────────────────────────
// 줄 = 토큰 배열(모양 번호 또는 숫자 글자 "0"~"9"), 오른쪽 끝이 일의 자리.
// 같은 모양은 같은 숫자, 다른 모양은 다른 숫자, 두 자리 이상 수의 맨 앞은 0이 아니다.

// opts.distinct=false: 빈칸처럼 같은 숫자가 다시 나와도 된다 · opts.allowed: 쓸 수 있는 숫자 · opts.reserve: 이미 쓴(드러난) 숫자
function cryptSolutions(addends, result, k, limit = 3, opts = {}) {
  const { distinct = true, allowed = range(0, 9), reserve = [] } = opts;
  const width = Math.max(result.length, ...addends.map((a) => a.length));
  const at = (word, col) => (col < word.length ? word[word.length - 1 - col] : null);
  const lead = new Set();
  [...addends, result].forEach((w) => { if (w.length > 1 && typeof w[0] === "number") lead.add(w[0]); });
  const vals = new Array(k).fill(null);
  const used = new Set(distinct ? reserve : []);
  const sols = [];
  const colTokens = range(0, width - 1).map((col) => [...addends.map((w) => at(w, col)), at(result, col)].filter((t) => typeof t === "number"));
  const solveCol = (col, carry) => {
    if (sols.length >= limit) return;
    if (col === width) { if (carry === 0) sols.push([...vals]); return; }
    const free = [...new Set(colTokens[col].filter((s) => vals[s] === null))];
    const assign = (i) => {
      if (sols.length >= limit) return;
      if (i === free.length) {
        let s = carry;
        for (const w of addends) { const t = at(w, col); if (t !== null) s += typeof t === "number" ? vals[t] : Number(t); }
        const r = at(result, col);
        const digit = r === null ? null : typeof r === "number" ? vals[r] : Number(r);
        if (digit === null) { if (s === 0) solveCol(col + 1, 0); return; }
        if (s % 10 !== digit) return;
        solveCol(col + 1, Math.floor(s / 10));
        return;
      }
      const sh = free[i];
      for (const d of allowed) {
        if ((distinct && used.has(d)) || (d === 0 && lead.has(sh))) continue;
        if (distinct) used.add(d);
        vals[sh] = d;
        assign(i + 1);
        vals[sh] = null;
        if (distinct) used.delete(d);
      }
    };
    assign(0);
  };
  solveCol(0, 0);
  return sols;
}

// sh: 모양 번호 → SHAPES 번호. 값이 "box"면 빈 네모, {mark:"㉠"}면 표시한 네모
function cryptSvg(addends, result, sh) {
  const width = Math.max(result.length, ...addends.map((a) => a.length));
  const c = 30;
  const x0 = 34;
  const w = x0 + width * c + 14;
  const rows = [...addends];
  const h = rows.length * 34 + 56;
  let body = "";
  const cell = (tok, col, y) => {
    const cx = x0 + (width - 1 - col) * c + c / 2;
    if (typeof tok !== "number") return text(cx, y + 7, tok, 20);
    const look = sh[tok];
    if (look === "box" || (look && look.mark)) {
      return `<rect x="${cx - 12}" y="${y - 12}" width="24" height="24" fill="#fff" stroke="${INK}" stroke-width="1.5"/>${look.mark ? text(cx, y + 6, look.mark, 15) : ""}`;
    }
    return glyph(SHAPES[look].key, cx, y, 12);
  };
  rows.forEach((word, i) => {
    const y = 22 + i * 34;
    word.forEach((tok, j) => { body += cell(tok, word.length - 1 - j, y); });
    if (i === rows.length - 1) body += text(16, y + 7, "+", 20);
  });
  const lineY = rows.length * 34 + 6;
  body += `<line x1="8" y1="${lineY}" x2="${w - 6}" y2="${lineY}" stroke="${INK}" stroke-width="1.6"/>`;
  result.forEach((tok, j) => { body += cell(tok, result.length - 1 - j, lineY + 26); });
  return `${svgOpen(w, h, "복면산")}${body}</svg>`;
}

const digitsOf = (n) => String(n).split("");

// 모양 피라미드: 줄 i = 모양 s0…si(앞줄에 모양 하나를 오른쪽에 더함). 결과는 숫자.
function pyramidOnce({ rows, distinctShapes }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const k = distinctShapes ? rows : 1;
    const word = range(0, rows - 1).map((i) => (distinctShapes ? i : 0));
    const vals = shuffle(range(0, 9)).slice(0, k);
    if (vals[0] === 0) continue;
    const valueOf = (w) => Number(w.map((s) => vals[s]).join(""));
    const addends = range(1, rows).map((len) => word.slice(0, len));
    const total = addends.reduce((s, w) => s + valueOf(w), 0);
    const result = digitsOf(total);
    if (result.length > rows) continue;
    const sols = cryptSolutions(addends, result, k);
    if (sols.length !== 1) continue;
    return { addends, result, k, vals, total };
  }
  return null;
}

function shapePyramidBase({ difficulty = 2, rows, distinctShapes }) {
  const parts = [];
  for (let i = 0; i < 2; i += 1) {
    const one = pyramidOnce({ rows, distinctShapes });
    if (!one) throw new Error("book08 shape pyramid generation failed");
    parts.push(one);
  }
  const sets = shuffle(SHAPES.map((_, i) => i));
  const shs = [sets.slice(0, 3), sets.slice(3, 6)];
  const askLine = (p, sh) => range(0, p.k - 1).map((s) => `${SHAPES[sh[s]].ch}=${p.vals[s]}`).join(", ");
  const hint = difficulty === 1 ? " 일의 자리부터 생각해 보세요." : "";
  return {
    prompt: `다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양이 나타내는 숫자를 구하세요.${hint}`,
    visual: figs(...parts.map((p, i) => cryptSvg(p.addends, p.result, shs[i]))),
    answer: parts.map((p, i) => `(${i + 1}) ${askLine(p, shs[i])}`).join(" · "),
    solution: parts.map((p, i) => {
      const sh = shs[i];
      const ch = (s) => SHAPES[sh[s]].ch;
      const unitsText = p.addends.map((w) => ch(w[w.length - 1])).join("+");
      return `(${i + 1}) 일의 자리는 ${unitsText}이고 끝자리가 ${p.result[p.result.length - 1]}입니다. 맨 윗자리 ${ch(0)}부터 넣어 보면 ${p.addends.map((w) => w.map((s) => p.vals[s]).join("")).join("+")}=${p.total}이므로 ${askLine(p, sh)}입니다.`;
    }).join(" "),
    meta: { family: "shape-pyramid-b8", rows, distinctShapes, parts: parts.map((p) => ({ addends: p.addends, result: p.result, k: p.k, vals: p.vals })) }
  };
}

const shapePyramidTwoRowsB8 = (o) => shapePyramidBase({ ...o, rows: 2, distinctShapes: true });
const shapePyramidThreeRowsB8 = (o) => shapePyramidBase({ ...o, rows: 3, distinctShapes: true });
const shapePyramidSameShapeB8 = (o) => shapePyramidBase({ ...o, rows: 3, distinctShapes: false });

// 모두 모양인 덧셈 복면산(두 수를 더해 한 자리 많은 수)
function allShapeOnce({ lens, minRepeat = 1 }) {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const nums = lens.map((len) => randomInt(10 ** (len - 1), 10 ** len - 1));
    const total = nums.reduce((a, b) => a + b, 0);
    const width = Math.max(...lens);
    if (String(total).length !== width + 1) continue;
    const words = [...nums.map(digitsOf), digitsOf(total)];
    const digits = [...new Set(words.flat())];
    if (digits.length > 8 || digits.length < 4) continue;
    const all = words.flat().length;
    if (all - digits.length < minRepeat + 2) continue;
    const toShapes = (w) => w.map((d) => digits.indexOf(d));
    const addends = words.slice(0, -1).map(toShapes);
    const result = toShapes(words[words.length - 1]);
    const k = digits.length;
    const sols = cryptSolutions(addends, result, k, 2);
    if (sols.length !== 1) continue;
    return { addends, result, k, vals: digits.map(Number), nums, total };
  }
  return null;
}

function allShapeCryptarithmB8({ difficulty = 2 }) {
  const parts = difficulty === 3 ? 1 : 2;
  const lensList = difficulty === 3 ? [[4, 3]] : [[3, 2], pick([[3, 2], [2, 2], [3, 3]])];
  // 드물게 3000번 안에 답이 하나인 식을 못 찾으면 몇 번 더, 그래도 없으면 세 자리 + 두 자리로
  const made = lensList.map((lens) => {
    for (let i = 0; i < 6; i += 1) { const m = allShapeOnce({ lens }); if (m) return m; }
    return allShapeOnce({ lens: [3, 2] }) || allShapeOnce({ lens: [3, 2] });
  });
  if (made.some((m) => !m)) throw new Error("book08 all-shape cryptarithm generation failed");
  const out = made.map((m) => {
    const sh = shuffle(SHAPES.map((_, i) => i)).slice(0, m.k);
    // 묻는 모양: 맨 앞자리(받아올림 1)가 아닌 모양
    const leadShape = m.result[0];
    const ask = pick(range(0, m.k - 1).filter((s) => s !== leadShape));
    return { ...m, sh, ask };
  });
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  return {
    prompt: `다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. ${parts > 1 ? "각 식에서 " : ""}${out.map((m, i) => `${tag(i)}${SHAPES[m.sh[m.ask]].ch}`).join(", ")}가 나타내는 숫자를 구하세요.`,
    visual: figs(...out.map((m) => cryptSvg(m.addends, m.result, m.sh))),
    answer: out.map((m, i) => `${tag(i)}${SHAPES[m.sh[m.ask]].ch}=${m.vals[m.ask]}`).join(" · "),
    solution: out.map((m, i) => {
      const ch = (s) => SHAPES[m.sh[s]].ch;
      return `${tag(i)}두 수를 더해 자리가 하나 늘었으므로 맨 앞의 ${ch(m.result[0])}는 받아올린 1입니다. 일의 자리부터 받아올림을 따져 차례로 넣으면 ${m.nums.join("+")}=${m.total}이고, ${range(0, m.k - 1).map((s) => `${ch(s)}=${m.vals[s]}`).join(", ")}입니다. 따라서 ${ch(m.ask)}=${m.vals[m.ask]}입니다.`;
    }).join(" "),
    meta: { family: "all-shape-cryptarithm-b8", parts: out.map((m) => ({ addends: m.addends, result: m.result, k: m.k, vals: m.vals, ask: m.ask })) }
  };
}

// 빈칸 두 수의 덧셈 — 빈칸에 들어가는 숫자를 모두 더한 값(빈칸끼리는 같은 숫자가 나와도 된다)
function blankSumOnce() {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const a = randomInt(10, 99);
    const b = randomInt(10, 99);
    const total = a + b;
    if (total < 100) continue;
    const addends = [[0, 1], [2, 3]];
    const result = digitsOf(total);
    const sols = cryptSolutions(addends, result, 4, 9000, { distinct: false });
    const sums = new Set(sols.map((v) => v.reduce((x, y) => x + y, 0)));
    if (sums.size !== 1) continue;
    return { addends, result, total, digitSum: [...sums][0], count: sols.length, example: [a, b] };
  }
  return null;
}

function blankDigitSumBothB8({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 1 : 2;
  const made = [];
  for (let i = 0; i < 40 && made.length < parts; i += 1) {
    const m = blankSumOnce();
    if (m && !made.some((x) => x.total === m.total)) made.push(m);
  }
  if (made.length !== parts) throw new Error("book08 blank digit sum generation failed");
  const look = ["box", "box", "box", "box"];
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  return {
    prompt: "다음 덧셈식의 □ 안에 들어갈 숫자들을 모두 더하면 얼마인지 구하세요.",
    visual: figs(...made.map((m) => cryptSvg(m.addends, m.result, look))),
    answer: made.map((m, i) => `${tag(i)}${m.digitSum}`).join(" · "),
    solution: made.map((m, i) => {
      const r = m.result.map(Number);
      const unitsCarry = (m.digitSum - r.reduce((x, y) => x + y, 0)) / 9 - 1;
      return `${tag(i)}두 자리 수 두 개를 더해 ${josa(m.total, "이", "가")} 되려면 십의 자리에서 백의 자리로 1을 받아올려야 합니다. 일의 자리 두 숫자의 합은 ${unitsCarry ? r[2] + 10 : r[2]}, 십의 자리 두 숫자의 합은 ${unitsCarry ? r[1] + 9 : r[1] + 10}이므로 빈칸 숫자의 합은 ${m.digitSum}입니다. (예: ${m.example[0]}+${m.example[1]})`;
    }).join(" "),
    meta: { family: "blank-digit-sum-both-b8", parts: made.map((m) => ({ addends: m.addends, result: m.result, digitSum: m.digitSum })) }
  };
}

// 1~8 수 카드를 한 번씩: 세 자리 수 + 두 자리 수 = 세 자리 수, 몇 자리는 보이고 ㉠ 자리의 숫자를 묻는다
let cardEquationCache = null;
function cardEquations() {
  if (cardEquationCache) return cardEquationCache;
  const out = [];
  const cards = range(1, 8);
  const visit = (rest, picked) => {
    if (picked.length === 8) {
      const [a, b, c, d, e, f, g, h] = picked;
      if (100 * a + 10 * b + c + 10 * d + e === 100 * f + 10 * g + h) out.push(picked);
      return;
    }
    rest.forEach((v, i) => visit([...rest.slice(0, i), ...rest.slice(i + 1)], [...picked, v]));
  };
  visit(cards, []);
  cardEquationCache = out;
  return out;
}

function cardsCryptarithmB8({ difficulty = 2 }) {
  const all = cardEquations();
  const shownCount = difficulty === 1 ? 4 : difficulty === 3 ? 2 : 3;
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const truth = pick(all);
    const shown = shuffle(range(0, 7)).slice(0, shownCount).sort((a, b) => a - b);
    const matches = all.filter((eq) => shown.every((i) => eq[i] === truth[i]));
    const hidden = range(0, 7).filter((i) => !shown.includes(i));
    // ㉠ 자리 = 맞는 식이 여러 개여도 값이 하나로 정해지는 빈칸 하나
    const fixed = hidden.filter((i) => new Set(matches.map((eq) => eq[i])).size === 1);
    if (matches.length !== 1 && difficulty !== 3) continue;
    if (!fixed.length) continue;
    const mark = pick(fixed);
    const slot = (i) => (shown.includes(i) ? String(truth[i]) : i);
    const addends = [[slot(0), slot(1), slot(2)], [slot(3), slot(4)]];
    const result = [slot(5), slot(6), slot(7)];
    const look = range(0, 7).map((i) => (i === mark ? { mark: "㉠" } : "box"));
    const eqText = `${truth.slice(0, 3).join("")}+${truth.slice(3, 5).join("")}=${truth.slice(5).join("")}`;
    return {
      prompt: "1부터 8까지의 숫자 카드를 한 번씩만 써서 만든 덧셈식입니다. 빈칸에 알맞은 숫자를 넣고, ㉠에 알맞은 숫자를 구하세요.",
      visual: { kind: "fig", html: `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">${cardsSvg(range(1, 8))}${cryptSvg(addends, result, look)}</div>` },
      answer: String(truth[mark]),
      solution: `보이는 숫자를 지우고 남은 카드로 일의 자리부터 받아올림을 따지면 ${matches.length === 1 ? eqText : `맞는 식이 ${matches.length}가지지만 ㉠ 자리는 모두 같고, 그중 하나는 ${eqText}`}입니다. 따라서 ㉠=${truth[mark]}입니다.`,
      meta: { family: "cards-cryptarithm-b8", truth, shown, mark, matchCount: matches.length }
    };
  }
  throw new Error("book08 cards cryptarithm generation failed");
}

// 두 자리 + 두 자리 = 세 자리(숫자), 모양 셋과 숫자 하나 — 모든 숫자가 서로 다르고, 필요하면 크기 조건 하나
function orderedShapeTwoDigitB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 2000; attempt += 1) {
    const a = randomInt(10, 99);
    const b = randomInt(10, 99);
    const total = a + b;
    if (total < 100) continue;
    const digits = [...digitsOf(a), ...digitsOf(b), ...digitsOf(total)];
    if (new Set(digits).size !== 7) continue;
    // 모양: 첫 수의 한 자리, 둘째 수의 두 자리 / 숫자: 첫 수의 나머지 자리, 결과
    const firstShape = pick([0, 1]);
    const addends = [firstShape === 0 ? [0, digitsOf(a)[1]] : [digitsOf(a)[0], 0], [1, 2]];
    const result = digitsOf(total);
    const reserve = [...digitsOf(total), firstShape === 0 ? digitsOf(a)[1] : digitsOf(a)[0]].map(Number);
    const truthVals = [Number(digitsOf(a)[firstShape]), Number(digitsOf(b)[0]), Number(digitsOf(b)[1])];
    const sols = cryptSolutions(addends, result, 3, 20, { reserve });
    if (sols.length < 2 || sols.length > 4) continue;
    // 크기 조건 하나로 답이 하나
    const conds = [];
    for (let x = 0; x < 3; x += 1) for (let y = 0; y < 3; y += 1) {
      if (x === y || truthVals[x] >= truthVals[y]) continue;
      if (sols.filter((v) => v[x] < v[y]).length === 1) conds.push([x, y]);
    }
    if (!conds.length) continue;
    const [small, big] = pick(conds);
    const sh = shuffle(range(0, SHAPES.length - 1)).slice(0, 3);
    const ch = (s) => SHAPES[sh[s]].ch;
    return {
      prompt: `다음은 서로 다른 숫자로 만든 덧셈식입니다. 각 모양이 나타내는 숫자를 구하세요. (단, ${ch(small)} < ${ch(big)}입니다.)`,
      visual: figs(cryptSvg(addends, result, sh)),
      answer: range(0, 2).map((s) => `${ch(s)}=${truthVals[s]}`).join(", "),
      solution: `식에 맞는 경우는 ${sols.map((v) => range(0, 2).map((s) => `${ch(s)}=${v[s]}`).join(", ")).join(" / ")}입니다. ${ch(small)} < ${ch(big)}인 것은 ${range(0, 2).map((s) => `${ch(s)}=${truthVals[s]}`).join(", ")}뿐입니다.`,
      meta: { family: "ordered-shape-two-digit-b8", addends, result, reserve, truth: truthVals, small, big, solutionCount: sols.length }
    };
  }
  throw new Error("book08 ordered shape two-digit generation failed");
}

// 결과까지 모양인 두 자리 + 두 자리 = 세 자리(모양 세 개, 같은 모양이 되풀이됨)
function shapeResultOnce() {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const tok = () => randomInt(0, 2);
    const addends = [[tok(), tok()], [tok(), tok()]];
    const result = [tok(), tok(), tok()];
    const all = [...addends.flat(), ...result];
    if (new Set(all).size !== 3) continue;
    if (result[0] === result[1] && result[1] === result[2] && addends.flat().includes(result[0])) continue;
    const sols = cryptSolutions(addends, result, 3, 3);
    if (sols.length !== 1) continue;
    return { addends, result, k: 3, vals: sols[0] };
  }
  return null;
}

function shapeResultCryptarithmB8({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 1 : 2;
  const made = [];
  for (let i = 0; i < 30 && made.length < parts; i += 1) {
    const m = shapeResultOnce();
    if (m && !made.some((x) => JSON.stringify(x.addends) === JSON.stringify(m.addends) && JSON.stringify(x.result) === JSON.stringify(m.result))) made.push(m);
  }
  if (made.length !== parts) throw new Error("book08 shape result cryptarithm generation failed");
  const sets = shuffle(range(0, SHAPES.length - 1));
  const shs = [sets.slice(0, 3), sets.slice(3, 6)];
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  const list = (m, sh) => range(0, 2).map((s) => `${SHAPES[sh[s]].ch}=${m.vals[s]}`).join(", ");
  return {
    prompt: "다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양이 나타내는 숫자를 구하세요.",
    visual: figs(...made.map((m, i) => cryptSvg(m.addends, m.result, shs[i]))),
    answer: made.map((m, i) => `${tag(i)}${list(m, shs[i])}`).join(" · "),
    solution: made.map((m, i) => {
      const sh = shs[i];
      const num = (w) => w.map((s) => m.vals[s]).join("");
      return `${tag(i)}두 자리 수 두 개의 합은 200보다 작으므로 결과의 맨 앞 ${SHAPES[sh[m.result[0]]].ch}=1입니다. 일의 자리부터 받아올림을 따지면 ${num(m.addends[0])}+${num(m.addends[1])}=${num(m.result)}이므로 ${list(m, sh)}입니다.`;
    }).join(" "),
    meta: { family: "shape-result-cryptarithm-b8", parts: made }
  };
}

// 같은 두 자리 모양 수를 여러 번 더한 복면산 — 답이 여러 가지, 묻는 모양의 값을 모두
function repeatedAddendAllB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 3000; attempt += 1) {
    const m = difficulty === 1 ? 3 : pick([3, 4, 5]);
    const a = randomInt(1, 9);
    const b = randomInt(0, 9);
    if (a === b) continue;
    const total = m * (10 * a + b);
    const rd = digitsOf(total);
    if (rd.length !== 3) continue;
    // 결과 자리: a·b와 같은 숫자는 그 모양, 아니면 새 모양(같은 숫자는 같은 모양), 맨 앞은 숫자로 보여 줄 수도 있다
    const shapeOf = {};
    let k = 2;
    const showLead = Math.random() < 0.5;
    const result = rd.map((d, i) => {
      if (i === 0 && showLead) return d;
      if (Number(d) === a) return 0;
      if (Number(d) === b) return 1;
      if (shapeOf[d] === undefined) { shapeOf[d] = k; k += 1; }
      return shapeOf[d];
    });
    if (!result.some((t) => typeof t === "number" && t >= 2)) continue;
    const addends = Array.from({ length: m }, () => [0, 1]);
    const sols = cryptSolutions(addends, result, k, 6);
    if (sols.length < 2 || sols.length > 3) continue;
    const askable = range(0, k - 1).filter((s) => new Set(sols.map((v) => v[s])).size === sols.length);
    if (!askable.length) continue;
    const ask = pick(askable);
    const sh = shuffle(range(0, SHAPES.length - 1)).slice(0, k);
    const ch = (s) => SHAPES[sh[s]].ch;
    const values = sols.map((v) => v[ask]).sort((x, y) => x - y);
    return {
      prompt: `다음 복면산에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. ${shapeIga(sh[ask])} 나타내는 숫자를 모두 구하세요.`,
      visual: figs(cryptSvg(addends, result, sh)),
      answer: values.join(", "),
      solution: `같은 두 자리 수를 ${m}번 더했으므로 결과는 그 수의 ${m}배입니다. ${m}배 한 수가 결과 모양에 맞는 경우를 모두 찾으면 ${sols.map((v) => `${v[0]}${v[1]}×${m}=${v[0] * 10 * m + v[1] * m}`).join(", ")}입니다. 따라서 ${ch(ask)}=${values.join(", ")}입니다.`,
      meta: { family: "repeated-addend-all-b8", m, addends, result, k, ask, values, solutions: sols }
    };
  }
  throw new Error("book08 repeated addend generation failed");
}

// 여러 줄을 더한 모양 복면산(한 자리 모양을 두세 번 쌓고 두 자리 모양 수를 더함) — 결과도 모양
function multiRowShapeOnce() {
  for (let attempt = 0; attempt < 4000; attempt += 1) {
    const lensList = pick([[1, 1, 2], [1, 2, 2], [1, 1, 1, 2]]);
    const k = randomInt(2, 4);
    const tok = () => randomInt(0, k - 1);
    const addends = lensList.map((len) => Array.from({ length: len }, tok));
    const resLen = pick([2, 3]);
    const result = Array.from({ length: resLen }, tok);
    if (new Set([...addends.flat(), ...result]).size !== k) continue;
    const sols = cryptSolutions(addends, result, k, 3);
    if (sols.length !== 1) continue;
    const v = sols[0];
    if (resLen === 3 && v[result[0]] !== 1) continue;
    return { addends, result, k, vals: v };
  }
  return null;
}

function multiRowShapeCryptarithmB8({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 1 : 2;
  const made = [];
  for (let i = 0; i < 30 && made.length < parts; i += 1) {
    const m = multiRowShapeOnce();
    if (m) made.push(m);
  }
  if (made.length !== parts) throw new Error("book08 multi-row cryptarithm generation failed");
  const sets = shuffle(range(0, SHAPES.length - 1));
  const shs = [sets.slice(0, 4), sets.slice(4, 8)];
  const tag = (i) => (parts > 1 ? `(${i + 1}) ` : "");
  const list = (m, sh) => range(0, m.k - 1).map((s) => `${SHAPES[sh[s]].ch}=${m.vals[s]}`).join(", ");
  return {
    prompt: "다음 계산식에서 같은 모양은 같은 숫자를, 다른 모양은 다른 숫자를 나타냅니다. 각 모양에 알맞은 숫자를 구하세요.",
    visual: figs(...made.map((m, i) => cryptSvg(m.addends, m.result, shs[i]))),
    answer: made.map((m, i) => `${tag(i)}${list(m, shs[i])}`).join(" · "),
    solution: made.map((m, i) => {
      const num = (w) => w.map((s) => m.vals[s]).join("");
      return `${tag(i)}일의 자리에 같은 모양이 몇 번 더해지는지 세어 끝자리가 맞는 숫자부터 찾고, 받아올림을 십의 자리로 넘기면 ${m.addends.map(num).join("+")}=${num(m.result)}입니다. 따라서 ${list(m, shs[i])}입니다.`;
    }).join(" "),
    meta: { family: "multi-row-shape-b8", parts: made }
  };
}

// ── 3단원 합차와 배수 ─────────────────────────────────

const NAMES = ["도윤", "서아", "하준", "지유", "시온", "예나", "로아", "건우", "다인", "주안", "채윤", "이든"];
const twoNames = () => shuffle(NAMES).slice(0, 2);
const wa = (w) => `${w}${hasBatchimWord(w) ? "과" : "와"}`;

// 이어진 차(가는 나보다 p개, 나는 다보다 q개 많다) → 가가 다에게 몇 개 주면 둘이 같아지나
function chainedDifferenceEqualizeB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [a, b, c] = shuffle(NAMES).slice(0, 3);
    const p = randomInt(2, difficulty === 3 ? 15 : 9);
    const q = randomInt(2, difficulty === 3 ? 15 : 9);
    if ((p + q) % 2 || p === q) continue;
    const give = (p + q) / 2;
    const thing = pick(["사탕", "구슬", "딱지"]);
    return {
      prompt: `${iga(a)} ${b}보다 ${thing} ${p}개를 더 가지고 있고, ${iga(b)} ${c}보다 ${thing} ${q}개를 더 가지고 있습니다. ${iga(a)} ${c}에게 ${thing} 몇 개를 주면 ${wa(a)} ${c}의 ${thing} 수가 같아지는지 구하세요.`,
      visual: { kind: "fig", html: barsSvg([[a, 0, p + q], [b, 0, q], [c, 0, 0]], "두 사람의 차"), layoutRole: "support" },
      answer: `${give}개`,
      solution: `${eunneun(a)} ${c}보다 ${p}+${q}=${p + q}개 많습니다. 준 만큼 한쪽은 줄고 다른 쪽은 늘어 차가 두 배로 줄어들므로 ${p + q}÷2=${give}개를 주면 됩니다.`,
      meta: { family: "chained-difference-equalize-b8", p, q, give }
    };
  }
  throw new Error("book08 chained difference generation failed");
}

// 막대: [이름, 공통 길이 표시용, 더 긴 만큼]
function barsSvg(rows, note) {
  const unit = 9;
  const base = 70;
  const maxExtra = Math.max(...rows.map((r) => r[2]));
  const w = 70 + base + maxExtra * unit + 20;
  const h = rows.length * 34 + 14;
  let body = "";
  rows.forEach(([name, , extra], i) => {
    const y = 8 + i * 34;
    body += text(30, y + 19, name, 15);
    body += `<rect x="64" y="${y}" width="${base}" height="22" fill="#e3eef2" stroke="${INK}" stroke-width="1.2"/>`;
    if (extra) body += `<rect x="${64 + base}" y="${y}" width="${extra * unit}" height="22" fill="#fbe3d6" stroke="${INK}" stroke-width="1.2"/>`;
  });
  return `${svgOpen(w, h, note)}${body}</svg>`;
}

// 지금 두 나이 → 몇 년 뒤 합이 S일 때 그때의 두 나이
function ageSumAfterYearsB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [older, younger] = pick([["형", "동생"], ["언니", "동생"], ["누나", "동생"], ["오빠", "동생"]]);
    const y = randomInt(4, difficulty === 3 ? 16 : 11);
    const o = y + randomInt(2, difficulty === 3 ? 9 : 6);
    const n = randomInt(2, difficulty === 3 ? 12 : 8);
    const sum = o + y + 2 * n;
    if (sum === o + y) continue;
    return {
      prompt: `지금 ${eunneun(older)} ${o}살, ${eunneun(younger)} ${y}살입니다. 몇 년 뒤 두 사람의 나이를 더하면 ${sum}살이 됩니다. 그때 ${wa(older)} ${younger}의 나이를 각각 구하세요.`,
      visual: { kind: "fig", html: barsSvg([[older, 0, o - y], [younger, 0, 0]], "두 사람의 나이"), layoutRole: "support" },
      answer: `${older} ${o + n}살, ${younger} ${y + n}살`,
      solution: `해마다 두 사람 나이의 합은 2살씩 늘어납니다. 지금 합은 ${o}+${y}=${o + y}살이므로 ${sum}−${o + y}=${sum - o - y}, ${sum - o - y}÷2=${n}년 뒤입니다. 그때 ${eunneun(older)} ${o + n}살, ${eunneun(younger)} ${y + n}살입니다. 나이 차 ${o - y}살은 그대로입니다.`,
      meta: { family: "age-sum-after-years-b8", o, y, n, sum }
    };
  }
  throw new Error("book08 age sum generation failed");
}

// 둘이 모두 T개, 많은 쪽이 g개를 주니 같아짐 → 적은 쪽의 처음 수
function totalGiveEqualB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [a, b] = pick([["형", "동생"], ["언니", "동생"], twoNames()]);
    const half = randomInt(6, difficulty === 3 ? 30 : 18);
    const g = randomInt(2, Math.min(half - 1, difficulty === 3 ? 12 : 7));
    const total = half * 2;
    const askA = difficulty === 3 && Math.random() < 0.5;
    const thing = pick(["사탕", "구슬", "카드"]);
    return {
      prompt: `${wa(a)} ${eunneun(b)} 모두 ${thing} ${total}개를 가지고 있습니다. ${iga(a)} ${b}에게 ${thing} ${g}개를 주었더니 두 사람의 ${thing} 수가 같아졌습니다. ${iga(askA ? a : b)} 처음에 가진 ${eunneun(thing)} 몇 개인지 구하세요.`,
      visual: { kind: "fig", html: barsSvg([[a, 0, 2 * g], [b, 0, 0]], "두 사람의 수"), layoutRole: "support" },
      answer: `${askA ? half + g : half - g}개`,
      solution: `주고받아도 모두 ${total}개이므로 같아진 뒤 한 사람은 ${total}÷2=${half}개입니다. ${eunneun(b)} ${g}개를 받아 ${half}개가 되었으니 처음 ${half}−${g}=${half - g}개${askA ? `, ${eunneun(a)} ${g}개를 주고 ${half}개가 되었으니 처음 ${half}+${g}=${half + g}개` : ""}입니다.`,
      meta: { family: "total-give-equal-b8", total, g, half, askA }
    };
  }
  throw new Error("book08 total give equal generation failed");
}

// 셋의 합, 한 사람의 수, 한 사람이 다른 사람에게 g개 주면 둘이 같아짐 → 준 사람의 수
function threeTotalGiveEqualB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const [k, x, y] = shuffle(NAMES).slice(0, 3);
    const known = randomInt(3, difficulty === 3 ? 18 : 12);
    const g = randomInt(1, difficulty === 3 ? 8 : 5);
    const after = randomInt(g + 2, difficulty === 3 ? 22 : 15);
    const xv = after + g;
    const yv = after - g;
    if (yv <= 0 || [xv, yv].includes(known)) continue;
    const total = known + xv + yv;
    const cellSvg = () => {
      const names = [k, x, y];
      const cw = 70;
      const w = 74 + cw * 3 + 6;
      let body = "";
      [["이름", ...names], ["개수", "", "", ""]].forEach((rowVals, r) => rowVals.forEach((v, c) => {
        const xx = c === 0 ? 4 : 74 + (c - 1) * cw;
        const ww = c === 0 ? 70 : cw;
        body += `<rect x="${xx}" y="${4 + r * 32}" width="${ww}" height="32" fill="${r === 0 ? "#e3eef2" : "#fff"}" stroke="${INK}" stroke-width="1.1"/>`;
        if (v) body += text(xx + ww / 2, 4 + r * 32 + 22, v, 15);
      }));
      return `${svgOpen(w, 72, "구슬 수 표")}${body}</svg>`;
    };
    return {
      prompt: `${k}, ${x}, ${y} 세 사람이 가진 구슬은 모두 ${total}개입니다. ${eunneun(k)} 구슬 ${known}개를 가지고 있고, ${iga(x)} ${y}에게 구슬 ${g}개를 주면 ${wa(x)} ${y}의 구슬 수가 같아집니다. ${iga(x)} 가진 구슬은 몇 개인지 표를 채워 구하세요.`,
      visual: figs(cellSvg()),
      answer: `${xv}개`,
      solution: `${wa(x)} ${y}의 구슬은 모두 ${total}−${known}=${xv + yv}개입니다. ${g}개를 주고 같아지면 한 사람이 ${(xv + yv)}÷2=${after}개이므로 ${eunneun(x)} ${after}+${g}=${xv}개, ${eunneun(y)} ${yv}개입니다.`,
      meta: { family: "three-total-give-equal-b8", total, known, g, xv, yv }
    };
  }
  throw new Error("book08 three total give equal generation failed");
}

// 두 사람의 수를 알 때, 한쪽이 몇 개를 주어야 다른 쪽이 그 몇 배가 되는가
function transferForMultipleB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const [a, b] = twoNames();
    const k = difficulty === 1 ? 2 : pick([2, 3, 4]);
    const aAfter = randomInt(3, difficulty === 3 ? 12 : 8);
    const moved = randomInt(2, difficulty === 3 ? 10 : 7);
    const aStart = aAfter + moved;
    const bStart = k * aAfter - moved;
    if (bStart <= 2 || bStart === aStart) continue;
    const total = aStart + bStart;
    return {
      prompt: `${iga(a)} 구슬 ${aStart}개, ${iga(b)} 구슬 ${bStart}개를 가지고 있습니다. ${iga(a)} ${b}에게 구슬 몇 개를 주어야 ${iga(b)} 가진 구슬이 ${a}의 ${k}배가 되는지 구하세요.`,
      visual: { kind: "fig", html: unitsSvg(a, b, k), layoutRole: "support" },
      answer: `${moved}개`,
      solution: `주고받아도 두 사람의 구슬은 모두 ${aStart}+${bStart}=${total}개입니다. 준 뒤 ${eulreul(a)} 한 묶음으로 보면 ${eunneun(b)} ${k}묶음이니 모두 ${k + 1}묶음이고, 한 묶음은 ${total}÷${k + 1}=${aAfter}개입니다. ${eunneun(a)} ${aStart}개에서 ${aAfter}개가 되었으므로 ${aStart}−${aAfter}=${moved}개를 주었습니다.`,
      meta: { family: "transfer-for-multiple-b8", aStart, bStart, k, moved, aAfter }
    };
  }
  throw new Error("book08 transfer for multiple generation failed");
}

function unitsSvg(a, b, k) {
  const w = 90 + (k + 1) * 34 + 80;
  let body = text(36, 28, a, 15) + `<circle cx="96" cy="23" r="13" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`;
  body += text(36, 68, b, 15);
  for (let i = 0; i < k; i += 1) body += `<circle cx="${96 + i * 32}" cy="63" r="13" fill="#fff" stroke="${INK}" stroke-width="1.3"/>`;
  const bx = 96 + k * 32 + 6;
  body += `<path d="M${bx} 12 Q${bx + 10} 12 ${bx + 10} 24 L${bx + 10} 38 L${bx + 16} 43 L${bx + 10} 48 L${bx + 10} 62 Q${bx + 10} 74 ${bx} 74" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
  body += text(bx + 44, 48, "합: □", 15);
  return `${svgOpen(w, 86, "준 뒤 묶음")}${body}</svg>`;
}

// ○ + ◇ = 합, ○ − ◇ = 차 — 여러 묶음
function shapeSumDifferenceB8({ difficulty = 2 }) {
  const parts = difficulty === 1 ? 2 : 4;
  const made = [];
  while (made.length < parts) {
    const small = randomInt(2, difficulty === 3 ? 30 : 18);
    const big = small + randomInt(1, difficulty === 3 ? 24 : 14);
    if (made.some((m) => m.big === big && m.small === small)) continue;
    made.push({ big, small, sum: big + small, diff: big - small });
  }
  const [s1, s2] = shuffle([0, 3, 1, 5]).slice(0, 2);
  const sh = [s1, s2];
  const rowsOf = (m) => [[0, "+", 1, "=", String(m.sum)], [0, "−", 1, "=", String(m.diff)]];
  const tag = (i) => `(${i + 1}) `;
  const ch = (s) => SHAPES[sh[s]].ch;
  return {
    prompt: `같은 모양은 같은 수를 나타냅니다. ${ch(0)}, ${shapeIga(sh[1])} 나타내는 수를 각각 구하세요.`,
    visual: figs(...made.map((m) => equationsSvg(rowsOf(m), sh, "합과 차"))),
    answer: made.map((m, i) => `${tag(i)}${ch(0)}=${m.big}, ${ch(1)}=${m.small}`).join(" · "),
    solution: made.map((m, i) => `${tag(i)}합에 차를 더하면 ${ch(0)} 두 개가 되므로 ${ch(0)}=(${m.sum}+${m.diff})÷2=${m.big}, ${ch(1)}=${m.sum}−${m.big}=${m.small}입니다.`).join(" "),
    meta: { family: "shape-sum-difference-b8", parts: made }
  };
}

// ── 4단원 거꾸로 생각하기 ─────────────────────────────

function flowSvg(steps, final) {
  // 처음(네모) → 빈 동그라미(단계 수 −1) → 마지막 수. 연산은 적지 않는다(글로 주어진 과정).
  const n = steps;
  const gap = 66;
  const w = 40 + n * gap + 40;
  let body = `<rect x="8" y="12" width="40" height="40" rx="6" fill="#e3eef2" stroke="${INK}" stroke-width="1.4"/>`;
  for (let i = 1; i <= n; i += 1) {
    const cx = 28 + i * gap;
    const last = i === n;
    body += `<line x1="${cx - gap + (i === 1 ? 22 : 20)}" y1="32" x2="${cx - 22}" y2="32" stroke="#c0392b" stroke-width="1.6"/><polygon points="${cx - 22},32 ${cx - 29},28 ${cx - 29},36" fill="#c0392b"/>`;
    body += `<circle cx="${cx}" cy="32" r="20" fill="${last ? "#fdebe1" : "#fff"}" stroke="${last ? "#d9784a" : INK}" stroke-width="1.4"/>`;
    if (last) body += text(cx, 39, final, 18);
  }
  return `${svgOpen(w, 64, "거꾸로 생각하기 흐름")}${body}</svg>`;
}

function reverseStepsBase({ difficulty = 2, ctx }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    let start;
    let steps;
    let prompt;
    let unit;
    let ask;
    if (ctx === "number") {
      start = randomInt(12, difficulty === 3 ? 60 : 40);
      const ops = difficulty === 3 ? ["−", "+", "−", "+"] : pick([["−", "+", "−"], ["+", "−", "−"], ["−", "−", "+"]]);
      steps = ops.map((op) => [op, randomInt(3, difficulty === 1 ? 12 : 19)]);
      unit = "";
      const words = steps.map(([op, v], i) => {
        const last = i === steps.length - 1;
        if (op === "+") return `${josa(v, "을", "를")} ${last ? "더했더니" : "더하고"}`;
        return `${josa(v, "을", "를")} ${last ? "뺐더니" : "빼고"}`;
      });
      ask = () => `어떤 수${steps[0][0] === "+" ? "에" : "에서"} ${words.join(", ")}`;
    } else if (ctx === "bus") {
      start = randomInt(15, difficulty === 3 ? 40 : 30);
      steps = [];
      for (let i = 0; i < 2; i += 1) steps.push(["−", randomInt(2, 9)], ["+", randomInt(2, 11)]);
      unit = "명";
    } else if (ctx === "floor") {
      start = randomInt(2, 12);
      const n = difficulty === 1 ? 3 : 4;
      steps = range(1, n).map((i) => [i % 2 ? pick(["+", "−"]) : null, randomInt(2, 8)]);
      steps = steps.map(([op, v], i) => [op ?? (steps[i - 1][0] === "+" ? "−" : "+"), v]);
      unit = "층";
    } else {
      start = randomInt(10, difficulty === 3 ? 35 : 25);
      steps = pick([[["+", 0], ["−", 0], ["+", 0]], [["−", 0], ["+", 0], ["−", 0]], [["+", 0], ["−", 0], ["−", 0]]]).map(([op]) => [op, randomInt(2, 9)]);
      unit = "개";
    }
    // 중간 값이 모두 알맞은지
    let cur = start;
    const mids = [];
    let ok = true;
    for (const [op, v] of steps) {
      cur = op === "+" ? cur + v : cur - v;
      if (cur < (ctx === "floor" ? 1 : 1)) ok = false;
      if (ctx === "floor" && cur > 20) ok = false;
      mids.push(cur);
    }
    const final = cur;
    if (new Set(steps.map(([, v]) => v)).size < Math.min(steps.length, 3)) continue;
    if (!ok || final === start || mids.slice(0, -1).includes(final)) continue;
    const backLine = [...steps].reverse().reduce((acc, [op, v]) => `${acc} ${op === "+" ? "−" : "+"} ${v}`, String(final));
    if (ctx === "number") {
      prompt = `${ask()} ${josa(final, "이", "가")} 되었습니다. 어떤 수를 구하세요.`;
    } else if (ctx === "bus") {
      prompt = `승객 몇 명을 태운 버스가 두 정류장을 지났습니다. 첫째 정류장에서 ${steps[0][1]}명이 내리고 ${steps[1][1]}명이 탔고, 둘째 정류장에서 ${steps[2][1]}명이 내리고 ${steps[3][1]}명이 탔더니 버스에 ${final}명이 남았습니다. 처음 버스에 타고 있던 승객은 몇 명인지 구하세요.`;
    } else if (ctx === "floor") {
      const names = pick([["서아", "준호"], ["유나", "시우"], ["다온", "하준"], ["예린", "도하"]]);
      const moves = steps.map(([op, v]) => `${v}층 ${op === "+" ? "올라가고" : "내려가고"}`);
      const moveText = moves.join(", ").replace(/고$/, "면");
      prompt = `${names[0]}네 집에서 계단으로 ${moveText} ${final}층 ${names[1]}네 집에 닿습니다. ${names[0]}네 집은 몇 층인지 구하세요.`;
    } else {
      const names = shuffle(["로운", "은호", "태은", "가온", "지안", "새봄"]).slice(0, 3);
      const me = pick(["하람", "윤슬", "보민"]);
      const acts = steps.map(([op, v], i) => (op === "+" ? `${names[i]}에게서 구슬 ${v}개를 받${i === steps.length - 1 ? "았더니" : "고"}` : `${names[i]}에게 구슬 ${v}개를 주${i === steps.length - 1 ? "었더니" : "고"}`));
      prompt = `${me}이가 ${acts.join(", ")} 구슬이 모두 ${final}개가 되었습니다. ${me}이가 처음 가지고 있던 구슬은 몇 개인지 구하세요.`;
    }
    return {
      prompt,
      visual: { ...figs(flowSvg(steps.length, final)), layoutRole: "support" },
      answer: `${start}${unit}`,
      solution: `마지막 ${final}${unit}에서 거꾸로, 더한 것은 빼고 뺀 것은 더합니다. ${backLine} = ${start}이므로 처음은 ${start}${unit}입니다.`,
      meta: { family: "reverse-steps-b8", ctx, start, steps, final, result: start }
    };
  }
  throw new Error(`book08 reverse steps (${ctx}) generation failed`);
}

const reverseNumberStepsB8 = (o) => reverseStepsBase({ ...o, ctx: "number" });
const reverseBusStopsB8 = (o) => reverseStepsBase({ ...o, ctx: "bus" });
const reverseFloorMovesB8 = (o) => reverseStepsBase({ ...o, ctx: "floor" });
const reversePeopleMarblesB8 = (o) => reverseStepsBase({ ...o, ctx: "people" });

// 상대가 가진 만큼 준 뒤 「둘 다 N」
// 거꾸로 풀기 표는 마지막 결과(나중)를 맨 위 줄에 두고, 아래로 한 번씩 되돌려 맨 아래 「처음」에 닿는다
// (원장 2026-11-25 「표를 이용한 거꾸로 풀기는 결과를 마지막을 제일 위로」). 줄 사이 오른쪽에 그 줄에서 되돌리는 주고받기를 적는다.
const TIMES_KO = ["", "한", "두", "세", "네", "다섯"];
function transferTableSvg(names, stepLabels, lastRow) {
  const c0 = 92;
  const c = Math.max(78, ...names.map((n) => String(n).length * 15 + 18));
  const rh = 32;
  const note = 12 + Math.max(...stepLabels.map((l) => (String(l).length + 5) * 12));
  const k = stepLabels.length;
  const w = c0 + 2 * c + note + 8;
  const h = (k + 2) * rh + 8;
  const stateLabel = (after) => (after === 0 ? "처음" : after === k ? "나중" : `${TIMES_KO[after] || after} 번 뒤`);
  const rowsAll = [["", ...names], ["나중", ...lastRow]];
  for (let after = k - 1; after >= 0; after -= 1) rowsAll.push([stateLabel(after), "", ""]);
  let body = "";
  rowsAll.forEach((row, r) => row.forEach((v, col) => {
    const x = col === 0 ? 4 : c0 + (col - 1) * c;
    const ww = col === 0 ? c0 - 4 : c;
    body += `<rect x="${x}" y="${4 + r * rh}" width="${ww}" height="${rh}" fill="${r === 0 ? "#e3eef2" : "#fff"}" stroke="${INK}" stroke-width="1.1"/>`;
    if (v !== "") body += text(x + ww / 2, 4 + r * rh + rh / 2 + 6, v, 15);
  }));
  // 줄 r(나중부터)과 r+1 사이 = 되돌리는 주고받기(마지막 것부터)
  const nx = c0 + 2 * c + 10;
  for (let r = 1; r <= k; r += 1) {
    const y = 4 + (r + 1) * rh;
    const step = stepLabels[k - r];
    body += `<path d="M${nx} ${y - 9}v18" stroke="#8a9aa0" stroke-width="1.4" fill="none"/><path d="M${nx - 4} ${y + 4}l4 6 4-6" stroke="#8a9aa0" stroke-width="1.4" fill="none"/>`;
    body += `<text x="${nx + 8}" y="${y + 5}" font-size="12" style="fill:#5b6b70;${FONT}">${step} 되돌리기</text>`;
  }
  return `${svgOpen(w, h, "거꾸로 채우는 주고받기 표")}${body}</svg>`;
}

const PAIRS = [["형", "동생"], ["언니", "동생"], ["누나", "동생"], ["다온", "새롬"], ["하랑", "이솔"]];
const eulreul = (w) => `${w}${hasBatchimWord(w) ? "을" : "를"}`;

function giveAsMuchEqualB8({ difficulty = 2 }) {
  const [a, b] = pick(PAIRS);
  const half = randomInt(difficulty === 1 ? 3 : 4, difficulty === 3 ? 15 : 10);
  const n = half * 2;
  const first = n + half;
  const thing = pick(["구슬", "사탕", "카드"]);
  const askBoth = difficulty === 3;
  return {
    prompt: `${iga(a)} ${b}에게 ${iga(b)} 가진 개수만큼 ${eulreul(thing)} 주었습니다. 그랬더니 두 사람 모두 ${thing} ${n}개를 가지게 되었습니다. ${askBoth ? `두 사람이 처음에 가진 ${eunneun(thing)} 각각 몇 개인지` : `${iga(a)} 처음에 가진 ${eunneun(thing)} 몇 개인지`} 구하세요.`,
    visual: figs(transferTableSvg([a, b], [`${a} → ${b}`], [`${n}개`, `${n}개`])),
    answer: askBoth ? `${a} ${first}개, ${b} ${half}개` : `${first}개`,
    solution: `${eunneun(b)} 처음 가진 만큼 받아 두 배가 되었습니다. ${n}÷2=${half}이므로 ${eunneun(b)} 처음 ${half}개였고, ${eunneun(a)} ${half}개를 주었으니 처음에 ${n}+${half}=${first}개입니다.`,
    meta: { family: "give-as-much-equal-b8", n, first, second: half, returned: 0, askBoth }
  };
}

function hasBatchimWord(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}
const iga = (w) => `${w}${hasBatchimWord(w) ? "이" : "가"}`;
const eunneun = (w) => `${w}${hasBatchimWord(w) ? "은" : "는"}`;

function giveAsMuchReturnEqualB8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const [a, b] = pick(PAIRS);
    const n = randomInt(difficulty === 1 ? 5 : 8, difficulty === 3 ? 30 : 20);
    const back = randomInt(1, difficulty === 3 ? 7 : 4);
    if ((n + back) % 2 !== 0) continue;
    const bStart = (n + back) / 2;
    const aStart = n - back + bStart;
    if (n - back <= 0 || aStart === n) continue;
    const thing = pick(["구슬", "사탕"]);
    return {
      prompt: `먼저 ${iga(a)} ${b}에게 ${iga(b)} 가진 개수만큼 ${eulreul(thing)} 주었습니다. 그다음 ${iga(b)} ${a}에게 ${thing} ${back}개를 돌려주었더니 두 사람의 ${thing}이 ${n}개로 같아졌습니다. ${iga(a)} 처음에 가진 ${eunneun(thing)} 몇 개인지 구하세요.`,
      visual: figs(transferTableSvg([a, b], [`① ${a} → ${b}`, `② ${b} → ${a}`], [`${n}개`, `${n}개`])),
      answer: `${aStart}개`,
      solution: `거꾸로 ②를 되돌리면 ${a} ${n}−${back}=${n - back}개, ${b} ${n}+${back}=${n + back}개입니다. ①에서 ${eunneun(b)} 두 배가 되었으므로 처음 ${n + back}÷2=${bStart}개이고, ${eunneun(a)} ${bStart}개를 주었으니 처음 ${n - back}+${bStart}=${aStart}개입니다.`,
      meta: { family: "give-as-much-equal-b8", n, first: aStart, second: bStart, returned: back, askBoth: false }
    };
  }
  throw new Error("book08 give-as-much-return-equal generation failed");
}

// 서로 상대가 가진 만큼 차례로 옮긴 뒤 둘 다 N — 거꾸로(마지막에 받은 쪽을 반으로) 처음 수를 찾는다
function mutualGiveAsMuchB8({ difficulty = 2 }) {
  const rounds = difficulty === 3 ? 3 : 2;
  const unit = 2 ** rounds;
  const n = unit * randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 6 : 8);
  const [a, b] = pick([["가", "나"], ["빨간", "파란"], ["왼쪽", "오른쪽"]]);
  // 앞으로: i번째는 짝수 번째면 a → b, 홀수 번째면 b → a
  let x = n;
  let y = n;
  const back = [];
  for (let r = rounds - 1; r >= 0; r -= 1) {
    if (r % 2 === 0) { const half = y / 2; back.push(`${b} ${y}개 → ${half}개, ${a} ${x}+${half}=${x + half}개`); y = half; x += half; } else { const half = x / 2; back.push(`${a} ${x}개 → ${half}개, ${b} ${y}+${half}=${y + half}개`); x = half; y += half; }
  }
  const steps = range(0, rounds - 1).map((r) => (r % 2 === 0 ? `${a} 상자에서 ${b} 상자로 ${b} 상자에 든 개수만큼` : `${b} 상자에서 ${a} 상자로 ${a} 상자에 든 개수만큼`));
  const label = (r) => (r % 2 === 0 ? `${a} → ${b}` : `${b} → ${a}`);
  return {
    prompt: `${a} 상자와 ${b} 상자에 사탕이 들어 있습니다. 먼저 ${steps.join(" 옮기고, 그다음 ")} 사탕을 옮겼더니 두 상자의 사탕이 똑같이 ${n}개가 되었습니다. 처음 두 상자에 든 사탕은 각각 몇 개인지 구하세요.`,
    visual: figs(transferTableSvg([`${a} 상자`, `${b} 상자`], range(0, rounds - 1).map(label), [`${n}개`, `${n}개`])),
    answer: `${a} 상자 ${x}개, ${b} 상자 ${y}개`,
    solution: `상자에 든 만큼 받으면 두 배가 되므로, 마지막부터 받은 상자를 반으로 줄이고 줄인 만큼 준 상자에 되돌립니다. ${back.join(" → ")}입니다. 처음에는 ${a} 상자 ${x}개, ${b} 상자 ${y}개입니다.`,
    meta: { family: "mutual-give-as-much-b8", rounds, n, start: [x, y] }
  };
}

// ── 내보내기 ────────────────────────────────────────


// ── 남은 번호(2차) — 1단원 네 식 사슬·가로합만 4×4 · 2단원 자리 바뀐 수·카드 덧셈 결과 모두 ─────────────
const shapeWa = (index) => `${SHAPES[index].ch}${shapeBatchim(index) ? "과" : "와"}`;
const shapeEun = (index) => `${SHAPES[index].ch}${shapeBatchim(index) ? "은" : "는"}`;
function symbolChainFourB8({ difficulty = 2 }) {
  const hi = difficulty === 1 ? 9 : difficulty === 2 ? 15 : 25;
  const vals = shuffle(range(2, hi)).slice(0, 4);
  const sh = shuffle(range(0, SHAPES.length - 1)).slice(0, 4);
  const eqs = [];
  for (let k = 0; k < 4; k += 1) {
    const size = k === 0 ? pick([2, 3]) : pick([3, 4]);
    const terms = [];
    if (k === 0) for (let i = 0; i < size; i += 1) terms.push(0);
    else {
      const own = randomInt(1, Math.min(2, size - 1));
      for (let i = 0; i < own; i += 1) terms.push(k);
      while (terms.length < size) terms.push(randomInt(0, k - 1));
    }
    eqs.push({ terms: shuffle(terms), total: terms.reduce((s, x) => s + vals[x], 0) });
  }
  const shown = shuffle(eqs.slice());
  const rows = shown.map((e) => [...e.terms.flatMap((x, i) => (i ? ["+", x] : [x])), "=", String(e.total)]);
  const ask = randomInt(1, 3);
  const steps = eqs.map((e, k) => {
    const own = e.terms.filter((x) => x === k).length;
    const known = e.terms.filter((x) => x !== k).reduce((s, x) => s + vals[x], 0);
    return `${SHAPES[sh[k]].ch} ${own}개 = ${known ? `${e.total} − ${known} = ` : ""}${own * vals[k]}${own > 1 ? ` → ${SHAPES[sh[k]].ch}=${vals[k]}` : ""}`;
  });
  return {
    prompt: `같은 모양은 같은 수를 나타냅니다. 네 식을 보고 ${shapeIga(sh[ask])} 나타내는 수를 구하세요.`,
    visual: figs(equationsSvg(rows, sh, "도형 식 넷")),
    answer: String(vals[ask]),
    solution: `한 가지 모양만 있는 식부터 풀고, 아는 모양을 빼며 차례로 찾습니다. ${steps.slice(0, ask + 1).join(". ")}.`,
    meta: { family: "symbol-chain-four-b8", vals, eqs, ask, sh }
  };
}
function rowSumsGridSvg(grid, sums, sh) {
  const c = 40, W = grid[0].length * c + 70, H = grid.length * c + 8;
  let body = "";
  grid.forEach((row, r) => {
    row.forEach((x, j) => { body += `<rect x="${4 + j * c}" y="${4 + r * c}" width="${c}" height="${c}" fill="#fff" stroke="${INK}" stroke-width="1"/>${glyph(SHAPES[sh[x]].key, 4 + j * c + c / 2, 4 + r * c + c / 2, 12)}`; });
    body += text(4 + row.length * c + 30, 4 + r * c + c / 2 + 6, sums[r], 17, 'font-weight="600"');
  });
  return `${svgOpen(W, H, "가로줄의 합만 있는 표")}${body}</svg>`;
}
function rowSumsOnlyMatrixB8({ difficulty = 2 }) {
  for (let tries = 0; tries < 500; tries += 1) {
    const vals = shuffle(range(1, difficulty === 3 ? 15 : 9)).slice(0, 4);
    const sh = shuffle(range(0, SHAPES.length - 1)).slice(0, 4);
    // 줄 k에는 새 모양 k가 처음 들어가고, 나머지는 앞에서 나온 모양 — 첫 줄은 한 모양만
    const grid = [];
    for (let k = 0; k < 4; k += 1) {
      const row = [];
      if (k === 0) for (let i = 0; i < 4; i += 1) row.push(0);
      else {
        const own = randomInt(1, 2);
        for (let i = 0; i < own; i += 1) row.push(k);
        while (row.length < 4) row.push(randomInt(0, k - 1));
      }
      grid.push(shuffle(row));
    }
    const order = shuffle([0, 1, 2, 3]);
    const g2 = order.map((k) => grid[k]);
    const sums = g2.map((row) => row.reduce((s, x) => s + vals[x], 0));
    const askAll = randomInt(0, 1) === 0;
    const ask = randomInt(1, 3);
    const total = vals.reduce((a, b) => a + b, 0);
    return {
      prompt: `같은 모양은 같은 수를 나타냅니다. 표의 오른쪽에는 가로줄 네 칸의 합만 있습니다. ${askAll ? "네 모양이 나타내는 수의 합을 구하세요." : `${shapeIga(sh[ask])} 나타내는 수를 구하세요.`}`,
      visual: figs(rowSumsGridSvg(g2, sums, sh)),
      answer: String(askAll ? total : vals[ask]),
      solution: `한 가지 모양만 있는 줄로 ${SHAPES[sh[0]].ch}=${vals[0]}부터 찾고, 새 모양이 하나씩 더해지는 줄에서 아는 모양을 빼 차례로 구합니다: ${SHAPES[sh[1]].ch}=${vals[1]}, ${SHAPES[sh[2]].ch}=${vals[2]}, ${SHAPES[sh[3]].ch}=${vals[3]}.${askAll ? ` 합은 ${total}.` : ""}`,
      meta: { family: "row-sums-only-matrix-b8", vals, grid: g2, sums, askAll, ask }
    };
  }
  return null;
}
function digitSwapAddB8({ difficulty = 2 }) {
  // □△ + ○ = △□ → ○ = 9, △ = □ + 1. 조건 하나로 답 하나를 고른다.
  const sh = shuffle(range(0, SHAPES.length - 1)).slice(0, 3);
  const A = randomInt(1, 8), B = A + 1;
  const conds = [
    { text: `${shapeWa(sh[0])} ${SHAPES[sh[1]].ch}의 합은 ${A + B}입니다.`, ok: (a, b) => a + b === A + B },
    { text: `${SHAPES[sh[0]].ch}${shapeEun(sh[1])} ${Math.floor((10 * A + B) / 10) * 10}보다 크고 ${Math.floor((10 * A + B) / 10) * 10 + 10}보다 작습니다.`, ok: (a, b) => 10 * a + b > Math.floor((10 * A + B) / 10) * 10 && 10 * a + b < Math.floor((10 * A + B) / 10) * 10 + 10 }
  ];
  const cond = difficulty === 1 ? conds[0] : pick(conds);
  const fits = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) {
    if (new Set([a, b, c]).size !== 3) continue;
    if (10 * a + b + c === 10 * b + a && cond.ok(a, b)) fits.push([a, b, c]);
  }
  return {
    prompt: `서로 다른 모양은 서로 다른 숫자를 나타냅니다. 두 자리 수에 한 자리 수를 더했더니 두 숫자의 자리가 바뀐 수가 되었습니다. ${cond.text} 덧셈식을 완성하세요.`,
    visual: figs(cryptSvg([[0, 1], [2]], [1, 0], sh)),
    answer: `${10 * A + B} + 9 = ${10 * B + A}`,
    solution: `자리가 바뀐 두 수의 차는 (큰 숫자 − 작은 숫자) × 9입니다. 더한 수는 한 자리라 차가 9뿐이므로 ${SHAPES[sh[2]].ch}=9, 일의 자리 숫자가 십의 자리 숫자보다 1 큽니다. 조건에 맞는 것은 ${10 * A + B} + 9 = ${10 * B + A}.`,
    meta: { family: "digit-swap-add-b8", A, B, fits }
  };
}
function cardSumAllB8({ difficulty = 2 }) {
  for (;;) {
    const withZero = difficulty === 3 && randomInt(0, 1) === 1;
    const nonzero = shuffle(range(1, 9)).slice(0, withZero ? 3 : 4);
    const cards = (withZero ? [0, ...nonzero] : nonzero).sort((a, b) => a - b);
    const sums = new Set();
    const perms = [];
    const walk = (left, chosen) => { if (!left.length) { perms.push(chosen); return; } left.forEach((x, i) => walk(left.filter((_, j) => j !== i), [...chosen, x])); };
    walk(cards, []);
    for (const [a, b, c, d] of perms) { if (a === 0 || c === 0) continue; sums.add(10 * a + b + 10 * c + d); }
    const list = [...sums].sort((x, y) => x - y);
    if (list.length < 3) continue;
    return {
      prompt: `숫자 카드 네 장을 한 번씩 모두 써서 두 자리 수 두 개를 만들어 더하려고 합니다. 나올 수 있는 합을 모두 구하세요.`,
      visual: figs(cardsSvg(cards)),
      answer: list.join(", "),
      solution: `합은 (십의 자리 두 숫자의 합) × 10 + (일의 자리 두 숫자의 합)이라, 어느 두 카드를 십의 자리에 놓을지만 정하면 됩니다${withZero ? "(0은 십의 자리 ✕)" : ""}. 고르는 방법마다 계산하면 ${list.join(", ")}.`,
      meta: { family: "card-sum-all-b8", cards, list }
    };
  }
}

export const BOOK08_STRUCTURE_GENERATORS = {
  symbolChainFourB8,
  rowSumsOnlyMatrixB8,
  digitSwapAddB8,
  cardSumAllB8,
  symbolNetworkOneB8,
  symbolNetworkSumB8,
  symbolNetworkSmallPoolB8,
  symbolNetworkCardsB8,
  squareFrameEquationsB8,
  squareFrameTwoCasesB8,
  productMatrixFillB8,
  productMatrixHiddenB8,
  shapePyramidTwoRowsB8,
  shapePyramidThreeRowsB8,
  shapePyramidSameShapeB8,
  allShapeCryptarithmB8,
  blankDigitSumBothB8,
  cardsCryptarithmB8,
  orderedShapeTwoDigitB8,
  shapeResultCryptarithmB8,
  repeatedAddendAllB8,
  multiRowShapeCryptarithmB8,
  chainedDifferenceEqualizeB8,
  ageSumAfterYearsB8,
  totalGiveEqualB8,
  threeTotalGiveEqualB8,
  transferForMultipleB8,
  shapeSumDifferenceB8,
  reverseNumberStepsB8,
  reverseBusStopsB8,
  reverseFloorMovesB8,
  reversePeopleMarblesB8,
  giveAsMuchEqualB8,
  giveAsMuchReturnEqualB8,
  mutualGiveAsMuchB8
};

// 풀이기(검사기가 쓴다)
export const BOOK08_STRUCTURE_SOLVERS = { bruteSolutions, propagate, cryptSolutions, hiddenPlacementSolutions, eqHolds, frameTruths };

const row = (id, domain, middle, label, generator, aliases) => ({ id, domain, middle, label, generator, searchAliases: aliases });

export const BOOK08_STRUCTURE_TYPE_ROWS = [
  row("symbol-chain-four-b8", "number", "묶음수와 매트릭스", "네 도형 식(항 2~4개)을 이어 이름 붙은 도형의 수 구하기", "symbolChainFourB8", ["도형 식", "덧셈 사슬"]),
  row("row-sums-only-matrix-b8", "number", "덧셈 매트릭스", "가로줄 합만 있는 4×4 모양 표 풀기", "rowSumsOnlyMatrixB8", ["덧셈 매트릭스", "가로합"]),
  row("digit-swap-add-b8", "number", "덧셈 복면산", "두 자리 수 + 한 자리 수 = 자리가 바뀐 수", "digitSwapAddB8", ["복면산", "자리 바뀐 수"]),
  row("card-sum-all-b8", "number", "덧셈 복면산", "카드 네 장으로 만든 두 자리 수 두 개의 합 모두", "cardSumAllB8", ["숫자 카드", "합 모두"]),
  row("symbol-network-one-b8", "number", "도형이 나타내는 수", "1~9 도형 식 네 개로 한 도형 찾기", "symbolNetworkOneB8", ["도형 식", "같은 모양 같은 수", "곱셈 도형식"]),
  row("symbol-network-sum-b8", "number", "도형이 나타내는 수", "1~9 도형 식으로 두 도형의 합 구하기", "symbolNetworkSumB8", ["도형 식", "두 도형의 합"]),
  row("symbol-network-small-pool-b8", "number", "도형이 나타내는 수", "0과 1의 성질로 작은 수 도형 식 풀기", "symbolNetworkSmallPoolB8", ["0의 성질", "1의 성질", "도형 식"]),
  row("symbol-network-cards-b8", "number", "도형이 나타내는 수", "수 카드 넉 장을 도형 식에 한 번씩 넣기", "symbolNetworkCardsB8", ["수 카드", "도형 식"]),
  row("square-frame-equations-b8", "number", "도형이 나타내는 수", "가로·세로 네 식이 맞는 도형 찾기", "squareFrameEquationsB8", ["사각 틀 식", "가로 세로 식"]),
  row("square-frame-two-cases-b8", "number", "도형이 나타내는 수", "가로·세로 네 식의 두 가지 경우 찾기", "squareFrameTwoCasesB8", ["사각 틀 식", "두 가지 경우"]),
  row("product-matrix-fill-b8", "number", "곱셈 매트릭스", "줄마다 두 칸의 곱 써넣기", "productMatrixFillB8", ["곱셈 매트릭스", "두 수의 곱"]),
  row("product-matrix-hidden-b8", "number", "곱셈 매트릭스", "2~9를 숨은 자리에 넣어 곱셈 매트릭스 완성하기", "productMatrixHiddenB8", ["곱셈 매트릭스", "자리 찾기", "2부터 9까지"]),
  row("shape-pyramid-two-rows-b8", "number", "복면산", "두 줄 모양 피라미드 복면산", "shapePyramidTwoRowsB8", ["피라미드 복면산", "모양 두 개"]),
  row("shape-pyramid-three-rows-b8", "number", "복면산", "세 줄 모양 피라미드 복면산", "shapePyramidThreeRowsB8", ["피라미드 복면산", "모양 세 개"]),
  row("shape-pyramid-same-shape-b8", "number", "복면산", "한 모양으로 쌓은 세 줄 피라미드 복면산", "shapePyramidSameShapeB8", ["피라미드 복면산", "같은 모양"]),
  row("all-shape-cryptarithm-b8", "number", "복면산", "모두 모양인 덧셈 복면산", "allShapeCryptarithmB8", ["복면산", "받아올림", "모두 모양"]),
  row("blank-digit-sum-both-b8", "number", "복면산", "두 자리 빈칸 두 수의 덧셈에서 빈칸 숫자의 합", "blankDigitSumBothB8", ["빈칸 숫자의 합", "받아올림"]),
  row("cards-cryptarithm-b8", "number", "복면산", "1~8 숫자 카드를 한 번씩 쓴 덧셈식의 빈칸", "cardsCryptarithmB8", ["숫자 카드", "한 번씩", "덧셈식 빈칸"]),
  row("ordered-shape-two-digit-b8", "number", "복면산", "크기 조건이 있는 두 자리 모양 덧셈", "orderedShapeTwoDigitB8", ["서로 다른 숫자", "크기 조건", "복면산"]),
  row("shape-result-cryptarithm-b8", "number", "복면산", "결과까지 모양인 두 자리 덧셈 복면산", "shapeResultCryptarithmB8", ["결과도 모양", "같은 숫자로 된 수"]),
  row("repeated-addend-all-b8", "number", "복면산", "같은 두 자리 모양 수를 여러 번 더한 복면산의 답 모두", "repeatedAddendAllB8", ["여러 번 더하기", "답 모두 찾기"]),
  row("multi-row-shape-b8", "number", "복면산", "여러 줄을 더한 모양 복면산", "multiRowShapeCryptarithmB8", ["여러 줄 덧셈", "모양 복면산"]),
  row("chained-difference-equalize-b8", "number", "주고받기", "이어진 두 차로 양 끝 두 사람을 같게 만들기", "chainedDifferenceEqualizeB8", ["이어진 차", "같아지게 주기"]),
  row("age-sum-after-years-b8", "number", "합과 차", "몇 년 뒤 나이의 합으로 그때 나이 구하기", "ageSumAfterYearsB8", ["나이의 합", "몇 년 뒤"]),
  row("total-give-equal-b8", "number", "주고받기", "전체 수와 준 수로 같아지기 전 수 구하기", "totalGiveEqualB8", ["합", "주고 같아짐", "처음 수"]),
  row("three-total-give-equal-b8", "number", "주고받기", "세 사람의 합과 주고 같아지는 조건으로 표 채우기", "threeTotalGiveEqualB8", ["세 사람의 합", "주고 같아짐", "표 채우기"]),
  row("transfer-for-multiple-b8", "number", "합과 배수", "몇 개를 주어야 몇 배가 되는지 구하기", "transferForMultipleB8", ["몇 배가 되게 주기", "합과 배수"]),
  row("shape-sum-difference-b8", "number", "합과 차", "두 모양의 합과 차로 각 수 구하기", "shapeSumDifferenceB8", ["합과 차", "모양 식"]),
  row("reverse-number-steps-b8", "number", "거꾸로 생각하기", "세 번 더하고 뺀 수를 거꾸로 풀기", "reverseNumberStepsB8", ["거꾸로 계산", "어떤 수"]),
  row("reverse-bus-stops-b8", "number", "거꾸로 생각하기", "두 정류장에서 내리고 탄 승객 거꾸로 풀기", "reverseBusStopsB8", ["버스 승객", "거꾸로 계산"]),
  row("reverse-floor-moves-b8", "number", "거꾸로 생각하기", "계단을 오르내린 뒤의 층에서 처음 층 찾기", "reverseFloorMovesB8", ["층 오르내리기", "거꾸로 계산"]),
  row("reverse-people-marbles-b8", "number", "거꾸로 생각하기", "세 사람과 주고받은 구슬 거꾸로 풀기", "reversePeopleMarblesB8", ["주고받기", "거꾸로 계산"]),
  row("give-as-much-equal-b8", "number", "거꾸로 생각하기", "가진 만큼 준 뒤 둘 다 같아진 처음 수", "giveAsMuchEqualB8", ["가진 만큼 주기", "똑같이 됨"]),
  row("mutual-give-as-much-b8", "number", "거꾸로 생각하기", "서로 가진 만큼 옮긴 뒤 둘 다 같아진 처음 수", "mutualGiveAsMuchB8", ["서로 가진 만큼", "거꾸로 표"]),
  row("give-as-much-return-equal-b8", "number", "거꾸로 생각하기", "가진 만큼 주고 일부 돌려받아 같아진 처음 수", "giveAsMuchReturnEqualB8", ["가진 만큼 주기", "돌려받기", "똑같이 됨"])
];

export const BOOK08_STRUCTURE_GUIDES = {
  "symbol-chain-four-b8": "한 가지 모양만 있는 식부터 풀고, 아는 모양을 빼며 새 모양을 하나씩 찾습니다.",
  "row-sums-only-matrix-b8": "한 가지 모양만 있는 줄로 첫 모양을 찾고, 새 모양이 하나씩 끼는 줄에서 아는 것을 뺍니다.",
  "digit-swap-add-b8": "자리가 바뀐 두 수의 차는 (두 숫자의 차) × 9입니다. 한 자리 수를 더했으니 차는 9뿐입니다.",
  "card-sum-all-b8": "합 = 십의 자리 두 숫자의 합 × 10 + 일의 자리 두 숫자의 합. 십의 자리에 놓을 두 장만 고르면 됩니다.",
  "symbol-network-one-b8": "같은 도형을 여러 번 곱하거나 더한 식부터 될 수 있는 수만 남기고, 정해진 수를 다른 식에 넣습니다.",
  "symbol-network-sum-b8": "될 수 있는 수가 가장 적은 식부터 도형의 수를 정하고, 묻는 두 도형의 수를 더합니다.",
  "symbol-network-small-pool-b8": "어떤 수에 곱해도 그대로이면 1, 더해도 그대로이면 0이라는 성질부터 씁니다.",
  "symbol-network-cards-b8": "카드는 한 번씩만 쓰므로, 식에 맞는 카드를 넣어 보고 남은 카드로 나머지 도형을 정합니다.",
  "square-frame-equations-b8": "두 식에 함께 들어가는 모서리 도형부터 0과 1의 성질, 곱셈의 크기를 따져 넣어 봅니다.",
  "square-frame-two-cases-b8": "모서리 도형에 될 수 있는 수를 하나씩 넣어 보고 네 식이 모두 맞는 경우를 빠짐없이 찾습니다.",
  "product-matrix-fill-b8": "가로줄과 세로줄마다 색칠한 두 칸의 수를 곱합니다.",
  "product-matrix-hidden-b8": "5와 7처럼 두 수의 곱으로 한 가지로만 나타나는 줄부터 정하고, 가로와 세로가 만나는 칸에 수를 놓습니다.",
  "shape-pyramid-two-rows-b8": "같은 모양이 두 번 더해지는 일의 자리부터 보고, 맨 윗자리 모양을 정한 뒤 일의 자리를 맞춥니다.",
  "shape-pyramid-three-rows-b8": "맨 앞 모양은 세 번 더해지므로 결과의 앞자리로 크기를 어림하고, 일의 자리부터 받아올림을 따집니다.",
  "shape-pyramid-same-shape-b8": "같은 모양이 자리마다 몇 번 더해지는지 세어, 그 수를 곱한 합이 결과와 같아지는 숫자를 찾습니다.",
  "all-shape-cryptarithm-b8": "자리가 하나 늘어난 맨 앞은 받아올린 1이므로 그 모양부터 정하고, 일의 자리부터 받아올림을 따집니다.",
  "blank-digit-sum-both-b8": "두 자리 수 둘을 더해 세 자리가 되면 십의 자리에서 반드시 받아올림이 있으니, 자리마다 두 숫자의 합을 정해 모두 더합니다.",
  "cards-cryptarithm-b8": "보이는 숫자 카드를 지우고, 남은 카드로 일의 자리부터 받아올림을 따져 빈칸을 채웁니다.",
  "ordered-shape-two-digit-b8": "식에 맞는 경우를 모두 찾은 뒤 크기 조건에 맞는 것 하나를 고릅니다.",
  "shape-result-cryptarithm-b8": "두 자리 수 둘의 합의 맨 앞자리는 1이므로 그 모양부터 정하고 일의 자리부터 맞춥니다.",
  "repeated-addend-all-b8": "같은 수를 여러 번 더한 것은 그 수의 몇 배이므로, 몇 배 한 결과가 모양에 맞는 경우를 빠짐없이 찾습니다.",
  "multi-row-shape-b8": "일의 자리에 같은 모양이 몇 번 더해지는지 세어 끝자리가 맞는 숫자를 찾고 받아올림을 넘깁니다.",
  "chained-difference-equalize-b8": "양 끝 두 사람의 차는 두 차를 더한 것이고, 준 만큼 차가 두 배로 줄어드니 반만 주면 됩니다.",
  "age-sum-after-years-b8": "해마다 두 사람 나이의 합은 2살씩 늘어나므로 늘어난 합을 2로 나누어 몇 년 뒤인지 찾습니다.",
  "total-give-equal-b8": "주고받아도 전체는 그대로이니 같아진 수는 전체의 반이고, 받은 쪽은 받은 만큼 빼서 처음 수를 찾습니다.",
  "three-total-give-equal-b8": "아는 사람의 수를 전체에서 빼 두 사람의 합을 구하고, 주고 같아진 수에서 거꾸로 처음 수를 찾습니다.",
  "transfer-for-multiple-b8": "주고받아도 합은 그대로이니, 준 뒤의 적은 쪽을 한 묶음으로 보고 합을 묶음 수로 나눕니다.",
  "shape-sum-difference-b8": "합과 차를 더하면 큰 수가 두 개, 합에서 차를 빼면 작은 수가 두 개입니다.",
  "reverse-number-steps-b8": "마지막 수에서 거꾸로, 더한 것은 빼고 뺀 것은 더해 처음 수로 돌아갑니다.",
  "reverse-bus-stops-b8": "마지막 승객 수에서 탄 사람은 빼고 내린 사람은 더하며 정류장을 거꾸로 지나갑니다.",
  "reverse-floor-moves-b8": "도착한 층에서 올라간 만큼 내려가고 내려간 만큼 올라가며 거꾸로 따라갑니다.",
  "reverse-people-marbles-b8": "마지막 개수에서 받은 것은 빼고 준 것은 더하며 거꾸로 셉니다.",
  "give-as-much-equal-b8": "가진 만큼 받은 쪽은 두 배가 되었으므로 반으로 나누어 처음 수를 찾고, 준 쪽은 준 만큼 더합니다.",
  "mutual-give-as-much-b8": "가진 만큼 받은 상자는 두 배가 되었으므로, 마지막에 받은 상자부터 반으로 줄이고 그만큼 준 상자에 되돌립니다.",
  "give-as-much-return-equal-b8": "마지막에 주고받은 것부터 되돌린 뒤, 두 배가 된 쪽을 반으로 나누어 처음 수를 찾습니다."
};

export const BOOK08_STRUCTURE_REMAPS = [
  // (2차) 1단원 네 식 사슬·가로합만, 2단원 자리 바뀐 수·카드 합 모두
  ["book-08", 1, "activity", 1, [2, 4], "symbol-chain-four-b8"],
  ["book-08", 1, "advanced", 1, [2], "row-sums-only-matrix-b8"],
  ["book-08", 2, "check", 2, [3], "digit-swap-add-b8"],
  ["book-08", 2, "advanced", 1, [4], "card-sum-all-b8"],
  // 1단원 — 도형 식 묶음(1~9 · 0~5·0~6 · 수 카드 넉 장 · 두 도형의 합), 사각 틀 네 식, 곱셈 매트릭스
  ["book-08", 1, "activity", 2, [1, 2], "symbol-network-one-b8"],
  ["book-08", 1, "activity", 2, [3, 4], "square-frame-equations-b8"],
  ["book-08", 1, "check", 2, [1], "product-matrix-fill-b8"],
  ["book-08", 1, "check", 2, [3], "product-matrix-hidden-b8"],
  ["book-08", 1, "practice", 1, [8, 9], "symbol-network-small-pool-b8"],
  ["book-08", 1, "practice", 1, [10, 11], "symbol-network-cards-b8"],
  ["book-08", 1, "practice", 1, [12], "symbol-network-sum-b8"],
  ["book-08", 1, "practice", 1, [13], "square-frame-two-cases-b8"],
  ["book-08", 1, "practice", 1, [14], "square-frame-equations-b8"],
  ["book-08", 1, "practice", 1, [15], "product-matrix-fill-b8"],
  ["book-08", 1, "practice", 1, [17], "product-matrix-hidden-b8"],
  ["book-08", 1, "advanced", 1, [3, 4], "symbol-network-sum-b8"],
  // 2단원 — 모양 피라미드, 모두 모양인 복면산, 빈칸·카드·크기 조건·결과 모양·여러 번 더하기·여러 줄
  ["book-08", 2, "activity", 1, [1], "shape-pyramid-two-rows-b8"],
  ["book-08", 2, "activity", 1, [2], "shape-pyramid-three-rows-b8"],
  ["book-08", 2, "practice", 1, [2], "shape-pyramid-same-shape-b8"],
  ["book-08", 2, "practice", 1, [3], "shape-pyramid-two-rows-b8"],
  ["book-08", 2, "practice", 1, [4], "shape-pyramid-three-rows-b8"],
  ["book-08", 2, "activity", 2, [1], "multi-row-shape-b8"],
  ["book-08", 2, "activity", 2, [3], "repeated-addend-all-b8"],
  ["book-08", 2, "activity", 2, [4], "shape-result-cryptarithm-b8"],
  ["book-08", 2, "activity", 2, [5, 6], "all-shape-cryptarithm-b8"],
  ["book-08", 2, "check", 1, [1], "blank-digit-sum-both-b8"],
  ["book-08", 2, "check", 1, [3], "cards-cryptarithm-b8"],
  ["book-08", 2, "check", 1, [4], "ordered-shape-two-digit-b8"],
  ["book-08", 2, "practice", 1, [7], "blank-digit-sum-both-b8"],
  ["book-08", 2, "practice", 1, [9], "cards-cryptarithm-b8"],
  ["book-08", 2, "practice", 1, [10], "ordered-shape-two-digit-b8"],
  ["book-08", 2, "practice", 1, [14], "shape-result-cryptarithm-b8"],
  ["book-08", 2, "practice", 1, [15, 16], "all-shape-cryptarithm-b8"],
  ["book-08", 2, "advanced", 1, [2], "repeated-addend-all-b8"],
  // 3단원 — 이어진 차, 몇 년 뒤 나이의 합, 합과 준 수, 세 사람 표, 몇 배가 되게 주기, 모양 합과 차
  ["book-08", 3, "activity", 1, [2], "chained-difference-equalize-b8"],
  ["book-08", 3, "practice", 1, [2], "chained-difference-equalize-b8"],
  ["book-08", 3, "activity", 1, [4], "shape-sum-difference-b8"],
  ["book-08", 3, "practice", 1, [4], "shape-sum-difference-b8"],
  ["book-08", 3, "check", 1, [2], "age-sum-after-years-b8"],
  ["book-08", 3, "practice", 1, [8], "age-sum-after-years-b8"],
  ["book-08", 3, "check", 1, [3], "total-give-equal-b8"],
  ["book-08", 3, "practice", 1, [9], "total-give-equal-b8"],
  ["book-08", 3, "check", 1, [4], "three-total-give-equal-b8"],
  ["book-08", 3, "practice", 1, [10], "three-total-give-equal-b8"],
  ["book-08", 3, "advanced", 1, [3, 4], "transfer-for-multiple-b8"],
  // 4단원 — 세·네 단계 거꾸로 풀기, 가진 만큼 준 뒤 「둘 다 N」
  ["book-08", 4, "activity", 1, [1], "reverse-bus-stops-b8"],
  ["book-08", 4, "activity", 1, [2], "reverse-floor-moves-b8"],
  ["book-08", 4, "practice", 1, [1], "reverse-number-steps-b8"],
  ["book-08", 4, "practice", 1, [2], "reverse-people-marbles-b8"],
  ["book-08", 4, "practice", 1, [3], "reverse-bus-stops-b8"],
  ["book-08", 4, "practice", 1, [4], "reverse-floor-moves-b8"],
  ["book-08", 4, "check", 1, [1, 2], "give-as-much-equal-b8"],
  ["book-08", 4, "check", 1, [3, 4], "give-as-much-return-equal-b8"],
  ["book-08", 4, "practice", 1, [7, 8], "give-as-much-equal-b8"],
  ["book-08", 4, "practice", 1, [9, 10], "give-as-much-return-equal-b8"],
  ["book-08", 4, "advanced", 1, [2], "mutual-give-as-much-b8"]
];
