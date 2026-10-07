import { seededRandom, shuffle, randInt, fillLevel, weightedPick } from "./golden-bell-level-game.js?v=20261004a";

// 2권 레벨 게임 4종의 문제 규칙. 화면과 검사가 같은 함수를 쓴다.
// 모든 문제는 답이 하나뿐인지 전수 검사한 뒤에만 낸다. 교재 원문 숫자를 복제하지 않고 같은 사고 조건으로 새로 만든다.
//   matrix  도형 값 찾기   — 매트릭스와 주고받기(교사용 슬라이드 4~7의 도형 합)
//   balance 무게 줄 세우기 — 양팔저울(슬라이드 13~17)
//   pattern 무늬 기차      — 규칙찾기와 수열(반복 마디·이중 패턴, 슬라이드 18·23~24)
//   sudoku  빈칸 채우기    — 약속과 스도쿠(슬라이드 36~37)

export const SHAPES = Object.freeze([
  { id: "circle", name: "동그라미" }, { id: "triangle", name: "세모" }, { id: "square", name: "네모" },
  { id: "star", name: "별" }, { id: "heart", name: "하트" }
]);
export const COLORS = Object.freeze([
  { id: "red", name: "빨강" }, { id: "blue", name: "파랑" }, { id: "yellow", name: "노랑" }, { id: "green", name: "초록" }, { id: "purple", name: "보라" }
]);
const SHAPE_NAME = Object.fromEntries(SHAPES.map((s) => [s.id, s.name]));
const COLOR_NAME = Object.fromEntries(COLORS.map((c) => [c.id, c.name]));
export const beadName = (b) => `${COLOR_NAME[b.color]} ${SHAPE_NAME[b.shape]}`;
const endlessOf = (title, count) => (level) => {
  const extra = level - 10;
  return { title: `끝없는 도전 ${extra}`, rule: `문제가 ${Math.min(30, count + extra * 2)}개! 깰 때마다 2개씩 늘어나요.`, count: Math.min(30, count + extra * 2), extra };
};

// ───────────────────────── 도형 값 찾기 ─────────────────────────
// 문제: 식(도형 + 도형 = 수) 여러 개 또는 표(가로·세로 합). 쓰인 도형마다 값을 하나씩 정한다.
function assignments(k, lo, hi, fn) {
  const v = Array(k).fill(lo);
  for (;;) {
    fn(v);
    let i = 0;
    while (i < k && v[i] === hi) v[i++] = lo;
    if (i === k) return;
    v[i]++;
  }
}
export function matrixSolutions(problem, limit = 2) {
  const k = problem.shapes.length, found = [];
  assignments(k, problem.lo, problem.hi, (v) => {
    if (found.length >= limit) return;
    if (matrixHolds(problem, v)) found.push([...v]);
  });
  return found;
}
export function matrixHolds(problem, values) {
  const val = (s) => values[problem.shapes.indexOf(s)];
  if (problem.kind === "grid") {
    const n = problem.grid.length;
    for (let r = 0; r < n; r++) if (problem.grid[r].reduce((a, s) => a + val(s), 0) !== problem.rowSums[r]) return false;
    for (let c = 0; c < n; c++) if (problem.grid.reduce((a, row) => a + val(row[c]), 0) !== problem.colSums[c]) return false;
    return true;
  }
  return problem.equations.every((e) => (e.op === "-" ? val(e.a) - val(e.b) : val(e.a) + val(e.b)) === e.result);
}
function makeMatrix(spec, kind, rand) {
  const shapes = shuffle(SHAPES.map((s) => s.id), rand).slice(0, spec.shapes);
  const values = shapes.map(() => randInt(spec.lo, spec.hi, rand));
  if (new Set(values).size < values.length && rand() < 0.7) return null; // 서로 다른 값을 주로 쓴다
  const val = (s) => values[shapes.indexOf(s)];
  let p;
  if (kind === "grid") {
    const n = spec.size;
    for (let t = 0; t < 20; t++) {
      const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => shapes[randInt(0, shapes.length - 1, rand)]));
      if (new Set(grid.flat()).size !== shapes.length) continue;
      p = { kind, shapes, grid, rowSums: grid.map((row) => row.reduce((a, s) => a + val(s), 0)), colSums: grid[0].map((_, c) => grid.reduce((a, row) => a + val(row[c]), 0)) };
      break;
    }
    if (!p) return null;
  } else {
    // 사슬: 첫 식은 같은 도형 둘(○+○), 다음 식들은 앞 도형과 새 도형. 빼기 레벨은 일부를 빼기로.
    const equations = [{ a: shapes[0], b: shapes[0], op: "+" }];
    for (let i = 1; i < shapes.length; i++) {
      const prev = shapes[randInt(0, i - 1, rand)], cur = shapes[i];
      const minus = spec.minus && rand() < 0.5 && val(prev) !== val(cur);
      equations.push(minus ? (val(prev) > val(cur) ? { a: prev, b: cur, op: "-" } : { a: cur, b: prev, op: "-" }) : (rand() < 0.5 ? { a: prev, b: cur, op: "+" } : { a: cur, b: prev, op: "+" }));
    }
    p = { kind: spec.minus && equations.some((e) => e.op === "-") ? "minus" : "eq", shapes, equations: equations.map((e) => ({ ...e, result: e.op === "-" ? val(e.a) - val(e.b) : val(e.a) + val(e.b) })) };
  }
  Object.assign(p, { lo: spec.lo, hi: spec.hi, answer: values });
  const sols = matrixSolutions(p);
  if (sols.length !== 1) return null;
  p.key = `${p.kind}:${JSON.stringify(p.grid || p.equations)}:${p.rowSums || ""}:${p.colSums || ""}`;
  return p;
}
export const MATRIX = {
  id: "b2-matrix", title: "도형 값 찾기",
  levels: [
    { title: "두 도형", rule: "같은 도형은 같은 수예요. 두 식으로 도형 둘의 값을 찾아요.", count: 6, mix: { eq: 1 }, shapes: 2, lo: 1, hi: 5 },
    { title: "세 도형 사슬", rule: "앞에서 찾은 값을 다음 식에 넣어요.", count: 6, mix: { eq: 1 }, shapes: 3, lo: 1, hi: 9 },
    { title: "가로 세로 합", rule: "2×2 표의 가로 합과 세로 합으로 도형 값을 찾아요.", count: 6, mix: { grid: 1 }, size: 2, shapes: 2, lo: 1, hi: 9 },
    { title: "표 속의 세 도형", rule: "2×2 표에 도형이 셋! 같은 도형이 두 번 나오는 줄부터 봐요.", count: 6, mix: { grid: 1 }, size: 2, shapes: 3, lo: 1, hi: 9 },
    { title: "빼기도 섞여요", rule: "더하기와 빼기 식이 섞여 나와요.", count: 6, mix: { eq: 1 }, shapes: 3, lo: 1, hi: 9, minus: true },
    { title: "3×3 매트릭스", rule: "3×3 표! 가로 세 줄, 세로 세 줄의 합을 써요.", count: 6, mix: { grid: 1 }, size: 3, shapes: 3, lo: 1, hi: 9 },
    { title: "골고루", rule: "식과 표가 섞여 나와요.", count: 8, mix: { eq: 1, grid: 1 }, size: 3, shapes: 3, lo: 1, hi: 9, minus: true },
    { title: "도형 넷", rule: "도형이 넷! 한 도형씩 차근차근 찾아요.", count: 8, mix: { eq: 1, grid: 1 }, size: 3, shapes: 4, lo: 1, hi: 9, minus: true },
    { title: "큰 표", rule: "3×3 표에 도형 넷. 같은 줄끼리 비교해 봐요.", count: 8, mix: { grid: 1 }, size: 3, shapes: 4, lo: 1, hi: 9 },
    { title: "매트릭스 마스터", rule: "모든 종류가 섞여요.", count: 10, mix: { eq: 1, grid: 2 }, size: 3, shapes: 4, lo: 1, hi: 9, minus: true }
  ],
  endless: (level) => ({ ...endlessOf("", 10)(level), mix: { eq: 1, grid: 2 }, size: 3, shapes: 4, lo: 1, hi: 9, minus: true }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      for (let t = 0; t < 40; t++) { const p = makeMatrix(spec, kind, rand); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, values) => p.shapes.every((s, i) => Number(values[i]) === p.answer[i])
};

// ───────────────────────── 무게 줄 세우기 ─────────────────────────
// 저울마다 [무거운 것, 가벼운 것]. 모든 저울로 무거운 순서가 하나로 정해질 때만 낸다.
export const BALANCE_ITEMS = Object.freeze(["A", "B", "C", "D", "E"]);
function closure(n, pairs) {
  const reach = Array.from({ length: n }, () => Array(n).fill(false));
  for (const [h, l] of pairs) reach[h][l] = true;
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (reach[i][k] && reach[k][j]) reach[i][j] = true;
  return reach;
}
// 정해진 순서가 있으면 무거운 것부터의 배열을, 없으면 null.
export function balanceOrder(n, pairs) {
  const reach = closure(n, pairs);
  const order = [...Array(n).keys()].sort((a, b) => reach.filter((row) => row[a]).length - reach.filter((row) => row[b]).length);
  for (let i = 0; i + 1 < n; i++) if (!reach[order[i]][order[i + 1]]) return null;
  return order;
}
function makeBalance(spec, kind, rand) {
  const n = kind === "pick" ? 2 : spec.items;
  const order = shuffle([...Array(n).keys()], rand); // 무거운 것부터
  const rank = (i) => order.indexOf(i);
  const all = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && rank(i) < rank(j)) all.push([i, j]);
  const pool = shuffle(all, rand);
  const pairs = [];
  for (const pair of pool) {
    pairs.push(pair);
    if (balanceOrder(n, pairs)) break;
  }
  // 군더더기 저울: 레벨에 따라 이미 알 수 있는 비교를 더한다(읽을거리를 늘린다).
  for (const pair of pool) if (pairs.length < (spec.scales || 0) && !pairs.includes(pair)) pairs.push(pair);
  if (spec.chain && kind === "order") {
    // 사슬 레벨: 이웃끼리만 비교해 순서대로 늘어놓는다(처음 배우는 단계).
    pairs.length = 0;
    for (let i = 0; i + 1 < n; i++) pairs.push([order[i], order[i + 1]]);
  }
  if (!balanceOrder(n, pairs)) return null;
  // 0..n-1 자리를 실제 물건(A~E 중 n개)으로 바꾼다. 같은 판이 되풀이되지 않게 물건도 고른다.
  const items = shuffle([...BALANCE_ITEMS.keys()], rand).slice(0, n).sort((x, y) => x - y);
  const id = (i) => items[i];
  const shown = shuffle(pairs, rand).map(([h, l]) => (rand() < 0.5 ? { left: id(h), right: id(l), heavy: "left" } : { left: id(l), right: id(h), heavy: "right" }));
  const named = order.map(id);
  const p = { kind, n, items, scales: shown, order: named, answer: kind === "lightest" ? named[n - 1] : kind === "pick" ? named[0] : named };
  p.key = `${kind}:${n}:${shown.map((s) => `${s.left}${s.heavy === "left" ? ">" : "<"}${s.right}`).join(",")}`;
  return p;
}
export const BALANCE = {
  id: "b2-balance", title: "무게 줄 세우기",
  levels: [
    { title: "어느 쪽이 무거울까", rule: "저울은 무거운 쪽이 아래로 내려가요. 더 무거운 것을 눌러요.", count: 6, mix: { pick: 1 }, items: 2 },
    { title: "셋 줄 세우기", rule: "무거운 것부터 차례로 단상에 올려요.", count: 6, mix: { order: 1 }, items: 3, chain: true },
    { title: "섞인 저울", rule: "저울 순서가 섞여 있어요. 가장 무거운 것부터 찾아요.", count: 6, mix: { order: 1 }, items: 3 },
    { title: "가장 가벼운 것", rule: "넷 중에서 가장 가벼운 것 하나를 찾아요.", count: 6, mix: { lightest: 1 }, items: 4 },
    { title: "넷 줄 세우기", rule: "넷을 무거운 순서로 세워요.", count: 6, mix: { order: 1 }, items: 4 },
    { title: "저울이 많아요", rule: "필요 없는 저울도 있어요. 확실한 것부터 이어 봐요.", count: 6, mix: { order: 1 }, items: 4, scales: 5 },
    { title: "섞어서", rule: "가장 가벼운 것 찾기와 줄 세우기가 섞여요.", count: 8, mix: { order: 1, lightest: 1 }, items: 4, scales: 4 },
    { title: "다섯 줄 세우기", rule: "다섯을 무거운 순서로! 저울을 하나씩 이어 봐요.", count: 8, mix: { order: 1 }, items: 5 },
    { title: "저울 숲", rule: "다섯과 많은 저울. 군더더기 저울에 속지 마요.", count: 8, mix: { order: 2, lightest: 1 }, items: 5, scales: 7 },
    { title: "저울 마스터", rule: "모든 종류가 섞여요.", count: 10, mix: { order: 2, lightest: 1 }, items: 5, scales: 6 }
  ],
  endless: (level) => ({ ...endlessOf("", 10)(level), mix: { order: 2, lightest: 1 }, items: 5, scales: 8 }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      for (let t = 0; t < 40; t++) { const p = makeBalance(spec, kind, rand); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, answer) => (Array.isArray(p.answer) ? Array.isArray(answer) && answer.length === p.n && answer.every((v, i) => v === p.answer[i]) : answer === p.answer)
};

// ───────────────────────── 무늬 기차 ─────────────────────────
// single: 한 마디(구슬 p개)가 되풀이된다. dual: 모양은 p개, 색은 q개마다 따로 되풀이된다(교재 이중 패턴).
export const beadAt = (p, n) => (p.dual ? { shape: p.shapeCycle[(n - 1) % p.shapeCycle.length], color: p.colorCycle[(n - 1) % p.colorCycle.length] } : p.unit[(n - 1) % p.unit.length]);
const sameBead = (a, b) => a.shape === b.shape && a.color === b.color;
function makePattern(spec, kind, rand) {
  const p = { kind };
  if (kind === "dual") {
    const sp = randInt(spec.dualP[0], spec.dualP[1], rand);
    let cq = randInt(2, 3, rand);
    if (cq === sp) cq = sp === 2 ? 3 : 2;
    p.dual = true;
    p.shapeCycle = shuffle(SHAPES.map((s) => s.id), rand).slice(0, sp);
    p.colorCycle = shuffle(COLORS.map((c) => c.id), rand).slice(0, cq);
    p.shown = Math.max(sp, cq) * 2 + 1;
  } else {
    const len = randInt(spec.period[0], spec.period[1], rand);
    const shapes = shuffle(SHAPES.map((s) => s.id), rand), colors = shuffle(COLORS.map((c) => c.id), rand);
    // 마디 안에 같은 구슬이 두 번 있어도 되지만, 마디가 더 짧은 마디로 쪼개지면 안 된다.
    const pool = Math.min(len, 3);
    const unit = Array.from({ length: len }, () => ({ shape: shapes[randInt(0, pool - 1, rand)], color: colors[randInt(0, pool - 1, rand)] }));
    for (let d = 1; d < len; d++) if (len % d === 0 && unit.every((b, i) => sameBead(b, unit[i % d]))) return null;
    p.unit = unit;
    p.shown = len * 2 + (kind === "next" ? 0 : 1);
  }
  if (kind === "next") p.n = p.shown + 1;
  else p.n = randInt(Math.max(p.shown + 2, spec.far[0]), spec.far[1], rand);
  if (kind === "count") {
    const target = p.unit[randInt(0, p.unit.length - 1, rand)];
    p.target = target;
    p.answer = Array.from({ length: p.n }, (_, i) => beadAt(p, i + 1)).filter((b) => sameBead(b, target)).length;
    const opts = new Set([p.answer]);
    for (const d of shuffle([-2, -1, 1, 2, 3], rand)) if (opts.size < 4 && p.answer + d > 0) opts.add(p.answer + d);
    p.choices = shuffle([...opts], rand);
  } else if (kind === "dual") {
    p.answer = beadAt(p, p.n);
  } else {
    p.answer = beadAt(p, p.n);
    // 보기: 정답 + 마디 안의 다른 구슬 + 정답과 모양 또는 색만 다른 구슬
    const opts = [p.answer];
    const add = (b) => { if (b && !opts.some((o) => sameBead(o, b))) opts.push(b); };
    for (const b of shuffle(p.unit, rand)) add(b);
    add({ shape: p.answer.shape, color: COLORS.find((c) => c.id !== p.answer.color && !p.unit.some((u) => u.color === c.id))?.id || "purple" });
    add({ shape: SHAPES.find((s) => s.id !== p.answer.shape)?.id, color: p.answer.color });
    if (opts.length < 3) return null;
    p.choices = shuffle(opts.slice(0, 4), rand);
  }
  p.key = `${kind}:${JSON.stringify(p.unit || [p.shapeCycle, p.colorCycle])}:${p.n}`;
  return p;
}
export const PATTERN = {
  id: "b2-pattern", title: "무늬 기차",
  levels: [
    { title: "다음 구슬", rule: "구슬 두 개가 되풀이돼요. 다음에 올 구슬을 골라요.", count: 6, mix: { next: 1 }, period: [2, 2] },
    { title: "세 개 마디", rule: "되풀이되는 한 마디를 찾아요. 이번엔 세 개씩!", count: 6, mix: { next: 1 }, period: [3, 3] },
    { title: "10번째 구슬", rule: "마디 수로 묶어 세면 멀리 있는 구슬도 알 수 있어요.", count: 6, mix: { nth: 1 }, period: [2, 3], far: [8, 12] },
    { title: "멀리 있는 구슬", rule: "15번째, 30번째도 마디로 묶으면 금방!", count: 6, mix: { nth: 1 }, period: [3, 4], far: [15, 30] },
    { title: "몇 개일까", rule: "정해진 자리까지 그 구슬이 몇 개 있는지 세요.", count: 6, mix: { count: 1 }, period: [2, 3], far: [10, 20] },
    { title: "모양 따로 색 따로", rule: "모양과 색이 서로 다른 길이로 되풀이돼요. 따로따로 세요.", count: 6, mix: { dual: 1 }, dualP: [2, 4], far: [8, 15] },
    { title: "골고루", rule: "다음 구슬·멀리 있는 구슬·개수 세기가 섞여요.", count: 8, mix: { nth: 1, count: 1, dual: 1 }, period: [3, 4], dualP: [2, 4], far: [12, 30] },
    { title: "먼 이중 무늬", rule: "모양과 색을 따로 셈해서 멀리 있는 구슬을 맞혀요.", count: 8, mix: { dual: 1 }, dualP: [3, 4], far: [20, 50] },
    { title: "긴 마디", rule: "마디가 길어져요. 마디 끝을 정확히 찾아요.", count: 8, mix: { nth: 1, count: 1 }, period: [4, 5], far: [20, 50] },
    { title: "무늬 마스터", rule: "모든 종류가 섞여요.", count: 10, mix: { nth: 1, count: 1, dual: 2 }, period: [3, 5], dualP: [3, 4], far: [20, 60] }
  ],
  endless: (level) => ({ ...endlessOf("", 10)(level), mix: { nth: 1, count: 1, dual: 2 }, period: [3, 5], dualP: [3, 4], far: [30, 99] }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      for (let t = 0; t < 60; t++) { const p = makePattern(spec, kind, rand); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, answer) => (p.kind === "count" ? answer === p.answer : !!answer && sameBead(answer, p.answer))
};

// ───────────────────────── 빈칸 채우기 ─────────────────────────
// 가로·세로(상자 레벨은 2×2 상자도)에 같은 수가 두 번 나오지 않는다. 답이 하나뿐일 때까지만 칸을 지운다.
export function sudokuValid(size, boxes, grid) {
  const seen = (cells) => { const vals = cells.filter((v) => v); return new Set(vals).size === vals.length; };
  for (let i = 0; i < size; i++) {
    if (!seen(grid[i]) || !seen(grid.map((row) => row[i]))) return false;
  }
  if (boxes) for (let br = 0; br < size; br += 2) for (let bc = 0; bc < size; bc += 2) if (!seen([grid[br][bc], grid[br][bc + 1], grid[br + 1][bc], grid[br + 1][bc + 1]])) return false;
  return true;
}
export function sudokuCount(size, boxes, grid, limit = 2) {
  let count = 0;
  const g = grid.map((row) => [...row]);
  const solve = () => {
    if (count >= limit) return;
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!g[r][c]) {
      for (let v = 1; v <= size; v++) { g[r][c] = v; if (sudokuValid(size, boxes, g)) solve(); g[r][c] = 0; if (count >= limit) return; }
      return;
    }
    count++;
  };
  solve();
  return count;
}
function fullGrid(size, boxes, rand) {
  const g = Array.from({ length: size }, () => Array(size).fill(0));
  const fill = (k) => {
    if (k === size * size) return true;
    const r = Math.floor(k / size), c = k % size;
    for (const v of shuffle([...Array(size).keys()].map((x) => x + 1), rand)) {
      g[r][c] = v;
      if (sudokuValid(size, boxes, g) && fill(k + 1)) return true;
    }
    g[r][c] = 0;
    return false;
  };
  fill(0);
  return g;
}
function makeSudoku(spec, kind, rand) {
  const size = kind === "latin3" ? 3 : 4, boxes = kind === "box4";
  const solution = fullGrid(size, boxes, rand);
  const puzzle = solution.map((row) => [...row]);
  const target = Math.min(spec.blanks, size * size - (boxes ? 4 : size));
  let removed = 0;
  for (const k of shuffle([...Array(size * size).keys()], rand)) {
    if (removed >= target) break;
    const r = Math.floor(k / size), c = k % size, keep = puzzle[r][c];
    puzzle[r][c] = 0;
    if (sudokuCount(size, boxes, puzzle) === 1) removed++; else puzzle[r][c] = keep;
  }
  if (removed < Math.min(target, spec.minBlanks || 1)) return null;
  return { kind, size, boxes, puzzle, solution, blanks: removed, key: `${kind}:${puzzle.flat().join("")}` };
}
export const SUDOKU = {
  id: "b2-sudoku", title: "빈칸 채우기",
  levels: [
    { title: "한 칸 두 칸", rule: "가로줄과 세로줄에 1, 2, 3이 한 번씩! 빈칸을 채워요.", count: 6, mix: { latin3: 1 }, blanks: 2 },
    { title: "세 칸", rule: "빈칸이 늘었어요. 확실한 칸부터 채워요.", count: 6, mix: { latin3: 1 }, blanks: 3 },
    { title: "3×3 가득", rule: "빈칸이 많아요. 한 줄에 빈칸이 하나인 곳부터!", count: 6, mix: { latin3: 1 }, blanks: 5, minBlanks: 4 },
    { title: "4×4 시작", rule: "이제 1부터 4까지! 가로·세로에 한 번씩.", count: 6, mix: { latin4: 1 }, blanks: 4 },
    { title: "4×4 더", rule: "빈칸이 더 많아요.", count: 6, mix: { latin4: 1 }, blanks: 7, minBlanks: 6 },
    { title: "상자 규칙", rule: "굵은 선 상자(2×2) 안에도 1~4가 한 번씩이에요.", count: 6, mix: { box4: 1 }, blanks: 6 },
    { title: "골고루", rule: "여러 판이 섞여 나와요.", count: 8, mix: { latin3: 1, latin4: 1, box4: 1 }, blanks: 7, minBlanks: 5 },
    { title: "상자 가득", rule: "상자 규칙에 빈칸 아홉!", count: 8, mix: { box4: 1 }, blanks: 9, minBlanks: 8 },
    { title: "거의 빈 판", rule: "남은 수가 적어요. 줄·상자를 번갈아 봐요.", count: 8, mix: { box4: 1 }, blanks: 11, minBlanks: 10 },
    { title: "스도쿠 마스터", rule: "모든 종류가 섞여요.", count: 10, mix: { latin4: 1, box4: 2 }, blanks: 11, minBlanks: 8 }
  ],
  endless: (level) => ({ ...endlessOf("", 10)(level), mix: { latin4: 1, box4: 3 }, blanks: 12, minBlanks: 10 }),
  build(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
    const spec = level <= this.levels.length ? this.levels[level - 1] : this.endless(level);
    const rand = seededRandom(seed);
    return fillLevel(spec.count, () => {
      const kind = weightedPick(spec.mix, weak, rand);
      for (let t = 0; t < 20; t++) { const p = makeSudoku(spec, kind, rand); if (p) return p; }
      return null;
    }, recent);
  },
  check: (p, grid) => grid.every((row, r) => row.every((v, c) => v === p.solution[r][c]))
};

export const BOOK02_GAMES = Object.freeze({ "b2-matrix": MATRIX, "b2-balance": BALANCE, "b2-pattern": PATTERN, "b2-sudoku": SUDOKU });
