import { TEXTBOOK_REMAPS } from "./textbook-remaps.js";
import "../../geometry/worksheet/generators.js";
import { GENERATORS } from "./generators.js";
import { CURRICULUM, TEXTBOOK_STAGES, textbookGuideForType, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const stages = TEXTBOOK_STAGES;
const book = CURRICULUM.find((item) => item.id === "book-02");
const typeIds = book.units.flatMap((unit) => unit.typeIds);
const types = typeIds.map(typeById);

const fail = (typeId, difficulty, message) => {
  throw new Error(`${typeId} / difficulty ${difficulty}: ${message}`);
};

const assert = (condition, typeId, difficulty, message) => {
  if (!condition) fail(typeId, difficulty, message);
};

const numberFrom = (value) => {
  const match = String(value).replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : Number.NaN;
};

const triangular = (value) => value * (value + 1) / 2;

function validateKoreanSurface(problem, typeId, difficulty) {
  const text = [problem.prompt, problem.answer, problem.solution].join(" ");
  const batchimParticles = new Set(["을", "과", "은", "이"]);
  const matches = text.matchAll(/(\d+)(을|를|과|와|은|는|이|가)(?=\s|[,.!?])/g);

  for (const match of matches) {
    const lastDigit = match[1].at(-1);
    const hasBatchim = "013678".includes(lastDigit);
    const usesBatchimParticle = batchimParticles.has(match[2]);
    assert(hasBatchim === usesBatchimParticle, typeId, difficulty, `wrong number particle: ${match[0]}`);
  }

  const malformedNameForms = [
    "강준이와", "강준이가", "강준이에게",
    "유진이와", "유진이가", "유진이에게",
    "다현이가", "다현이에게",
    "민서이가", "민서이에게",
    "누나은", "언니은", "형는", "동생는"
  ];
  const malformed = malformedNameForms.find((token) => text.includes(token));
  assert(!malformed, typeId, difficulty, `wrong name particle: ${malformed}`);
}

function sudokuSolutionCount(grid, regions, limit = 2) {
  const size = grid.length;
  const work = grid.map((row) => [...row]);
  let count = 0;

  const candidates = (row, column) => {
    const used = new Set(work[row]);
    for (let scan = 0; scan < size; scan += 1) used.add(work[scan][column]);
    if (regions) {
      const region = regions[row][column];
      for (let r = 0; r < size; r += 1) {
        for (let c = 0; c < size; c += 1) {
          if (regions[r][c] === region) used.add(work[r][c]);
        }
      }
    }
    return Array.from({ length: size }, (_, index) => index + 1).filter((value) => !used.has(value));
  };

  const search = () => {
    if (count >= limit) return;
    let target = null;
    let choices = null;
    for (let row = 0; row < size; row += 1) {
      for (let column = 0; column < size; column += 1) {
        if (work[row][column]) continue;
        const next = candidates(row, column);
        if (!next.length) return;
        if (!choices || next.length < choices.length) {
          target = [row, column];
          choices = next;
        }
      }
    }
    if (!target) {
      count += 1;
      return;
    }
    const [row, column] = target;
    for (const value of choices) {
      work[row][column] = value;
      search();
      work[row][column] = 0;
      if (count >= limit) return;
    }
  };

  search();
  return count;
}

function countOrderings(symbols, relations) {
  const heavierPairs = relations.map((relation) => (
    relation.heavier === "left"
      ? [relation.left, relation.right]
      : [relation.right, relation.left]
  ));
  let count = 0;

  const visit = (prefix, remaining) => {
    if (count > 1) return;
    if (!remaining.length) {
      const position = Object.fromEntries(prefix.map((symbol, index) => [symbol, index]));
      if (heavierPairs.every(([heavy, light]) => position[heavy] < position[light])) count += 1;
      return;
    }
    for (let index = 0; index < remaining.length; index += 1) {
      visit([...prefix, remaining[index]], [...remaining.slice(0, index), ...remaining.slice(index + 1)]);
    }
  };

  visit([], symbols);
  return count;
}

// 교재 번호 꼴에 맞춘 새 유형(book02-structure-generators.js, 이름 끝 -b2) — 생성기와 따로 다시 풀어 본다.
function structureSudokuCount(puzzle, size, regions) {
  const units = [];
  for (let r = 0; r < size; r += 1) units.push(Array.from({ length: size }, (_, c) => r * size + c));
  for (let c = 0; c < size; c += 1) units.push(Array.from({ length: size }, (_, r) => r * size + c));
  if (regions) {
    const groups = new Map();
    regions.forEach((g, i) => { if (!groups.has(g)) groups.set(g, []); groups.get(g).push(i); });
    units.push(...groups.values());
  }
  const work = [...puzzle];
  let count = 0;
  const walk = () => {
    if (count > 1) return;
    const i = work.indexOf(0);
    if (i < 0) { count += 1; return; }
    for (let v = 1; v <= size; v += 1) {
      if (units.some((u) => u.includes(i) && u.some((j) => work[j] === v))) continue;
      work[i] = v;
      walk();
      work[i] = 0;
    }
  };
  walk();
  return count;
}

function validateStructureB2(id, problem, difficulty) {
  const meta = problem.meta || {};
  const html = problem.visual?.html || "";
  assert(problem.visual?.kind === "fig" && html.includes("<svg"), id, difficulty, "fig svg missing");
  assert(!/\d\/\d/.test(`${problem.prompt}${problem.solution}`), id, difficulty, "slash fraction in text");
  if (id.startsWith("shape-")) {
    // 카드에서 서로 다른 수를 모양마다 넣는 모든 경우 중 식이 모두 맞는 것은 하나뿐
    const shapes = Object.keys(meta.values);
    const sum = (side, assign) => side.reduce((t, s) => t + assign[s], 0);
    let count = 0;
    let found = null;
    const assign = {};
    const walk = (i, used) => {
      if (count > 1) return;
      if (i === shapes.length) {
        if (meta.equations.every((eq) => sum(eq.left, assign) === sum(eq.right, assign))) { count += 1; found = { ...assign }; }
        return;
      }
      for (const v of meta.cards) {
        if (used.has(v)) continue;
        assign[shapes[i]] = v;
        used.add(v);
        walk(i + 1, used);
        used.delete(v);
      }
    };
    walk(0, new Set());
    assert(count === 1, id, difficulty, "shape equations not unique");
    assert(Number(problem.answer) === found[meta.target], id, difficulty, "shape equation answer mismatch");
    return;
  }
  if (id.startsWith("balance-")) {
    const w = meta.weights;
    for (const scale of meta.scales) {
      const side = (items) => items.reduce((t, s) => t + w[s], 0);
      assert(side(scale.left) === side(scale.right), id, difficulty, "scale not level");
    }
    // 아는 무게 하나에서 시작해 저울마다 모르는 물건이 한 가지씩이면 모두 정해진다
    const known = new Set([meta.given || Object.keys(w).sort((a, b) => w[a] - w[b])[0]]);
    let moved = true;
    while (moved) {
      moved = false;
      for (const scale of meta.scales) {
        const unknown = new Set([...scale.left, ...scale.right].filter((s) => !known.has(s)));
        if (unknown.size === 1) { known.add([...unknown][0]); moved = true; }
      }
    }
    assert(known.size === Object.keys(w).length, id, difficulty, "balance chain not solvable");
    if (id.endsWith("order-b2")) {
      const order = Object.keys(w).sort((a, b) => w[b] - w[a]);
      assert(new Set(Object.values(w)).size === order.length, id, difficulty, "equal weights in order problem");
      assert(problem.answer === order.join(" > "), id, difficulty, "balance order mismatch");
    } else if (id.startsWith("balance-count")) {
      assert(numberFrom(problem.answer) === w[meta.target] / w[meta.per], id, difficulty, "balance count mismatch");
    } else {
      assert(numberFrom(problem.answer) === w[meta.target], id, difficulty, "balance weight mismatch");
    }
    return;
  }
  if (id.startsWith("sudoku-fill-")) {
    assert(problem.responseKind === "visual-fill" && problem.answerVisual?.html?.includes("<svg"), id, difficulty, "sudoku fill answer visual missing");
    for (const board of meta.boards) {
      assert(structureSudokuCount(board.puzzle, meta.size, board.regions) === 1, id, difficulty, "sudoku fill not unique");
      assert(board.puzzle.every((v, i) => !v || v === board.solution[i]), id, difficulty, "sudoku clue mismatch");
      assert(board.puzzle.some((v) => !v), id, difficulty, "sudoku has no blank");
    }
    return;
  }
  if (id.endsWith("-sequence-b2")) {
    // 빈칸 값은 그 자리의 수, 수열은 묶음·가닥 규칙을 그대로 따른다
    for (const part of meta.parts) {
      assert(part.blanks.every((i, k) => part.full[i] === part.answers[k]), id, difficulty, "sequence blank answer mismatch");
      const [kind, a, b, c] = part.rule.split(":");
      const f = part.full;
      if (kind === "triple") f.forEach((v, i) => assert(v === f[0] + Math.floor(i / 3) * Number(b) + (i % 3) * Number(a), id, difficulty, "triple rule broken"));
      if (kind === "two") f.forEach((v, i) => assert(i < 2 || v - f[i - 2] === (i % 2 ? Number(b) : Number(a)), id, difficulty, "two-strand rule broken"));
      if (kind === "double") {
        const strands = [f.filter((_, i) => i % 2 === 0), f.filter((_, i) => i % 2 === 1)];
        const ok = strands.some((x) => x.every((v, i) => !i || v === x[i - 1] * 2)) && strands.some((x) => x.every((v, i) => !i || v - x[i - 1] === Number(a)));
        assert(ok, id, difficulty, "doubling rule broken");
      }
    }
    assert(String(problem.answer).includes(String(meta.parts[0].answers[0])), id, difficulty, "sequence answer text");
    return;
  }
  if (id === "diagonal-band-stone-growth-b2") {
    const side = meta.startSide + meta.target - 1;
    const black = meta.offsets.reduce((t, o) => t + side - Math.abs(o), 0);
    assert(black === meta.black && side * side - black === meta.white, id, difficulty, "diagonal stone count mismatch");
    assert(numberFrom(problem.answer) === (meta.askWhite ? meta.white : meta.black), id, difficulty, "diagonal answer mismatch");
    return;
  }
  if (id === "alternating-run-stone-total-b2") {
    let black = 0;
    let white = 0;
    for (let run = meta.startRun, i = 0, left = meta.total; left > 0; run += 1, i += 1) {
      const n = Math.min(run, left);
      if ((i % 2 === 0) === meta.firstBlack) black += n; else white += n;
      left -= n;
    }
    assert(black === meta.black && white === meta.white && black !== white, id, difficulty, "run count mismatch");
    assert(problem.answer === `${black > white ? "검은 돌" : "흰 돌"}, ${Math.abs(black - white)}개`, id, difficulty, "run answer mismatch");
    return;
  }
  if (id === "branching-segment-growth-b2" || id === "nested-circle-doubling-b2") {
    const k = meta.branches || meta.k;
    const total = (k ** meta.target - 1) / (k - 1);
    const newest = k ** (meta.target - 1);
    assert(numberFrom(problem.answer) === (meta.askNew || meta.askSmall ? newest : total), id, difficulty, "doubling growth mismatch");
    return;
  }
  if (id === "four-node-relation-b2") {
    const v = meta.items[3];
    const test = (x) => {
      if (meta.rule.startsWith("sum-")) {
        const pos = meta.rule.slice(4);
        return x[pos] === ["top", "right", "bottom", "left"].filter((p) => p !== pos).reduce((t, p) => t + x[p], 0);
      }
      if (meta.rule === "product-cross") return x.top * x.bottom === x.left * x.right;
      const pairs = { "pair-topbottom": ["top", "bottom", "left", "right"], "pair-topright": ["top", "right", "bottom", "left"], "pair-topleft": ["top", "left", "right", "bottom"] }[meta.rule];
      return x[pairs[0]] + x[pairs[1]] === x[pairs[2]] + x[pairs[3]];
    };
    assert(meta.items.every(test), id, difficulty, "four node rule mismatch");
    assert(Number(problem.answer) === v[meta.blank], id, difficulty, "four node answer mismatch");
    return;
  }
  if (id === "digit-pair-two-results-b2") {
    const [a, b] = meta.pairs[3];
    assert(problem.answer === `㉠ ${meta.values[3][0]}, ㉡ ${meta.values[3][1]}` && meta.answer[0] === meta.values[3][0], id, difficulty, "digit pair answer mismatch");
    assert(a !== b, id, difficulty, "digit pair same digits");
    return;
  }
  // ── 2026-11-27 3·4단원 남은 번호 ──
  if (id === "repeating-sequence-three-parts-b2") {
    for (const part of meta.parts) {
      const p = Number(part.rule.split(":")[1]);
      const f = part.full;
      assert(f.every((v, i) => v === f[i % p]), id, difficulty, "repeat rule broken");
      assert(new Set(f.slice(0, p)).size === p, id, difficulty, "repeat cycle has same digits");
      assert(f.length - 1 >= 2 * p + 1, id, difficulty, "repeat shown too short");
      assert(part.answers[0] === f[part.blanks[0]], id, difficulty, "repeat answer mismatch");
    }
    return;
  }
  if (id === "stone-run-pattern-b2") {
    meta.parts.forEach((part, k) => {
      const s = part.stones;
      // 맞는 마디(2배 이상 보임)가 모두 같은 다음 돌을 가리켜야 한다
      const next = new Set();
      for (let p = 1; 2 * p + 1 <= s.length; p += 1) if (s.every((v, i) => i < p || v === s[i - p])) next.add(s[s.length - p]);
      assert(next.size === 1, id, difficulty, "stone run next not unique");
      assert(part.answer === ([...next][0] ? "검은 돌" : "흰 돌"), id, difficulty, "stone run answer mismatch");
      assert(String(problem.answer).includes(`(${k + 1}) ${part.answer}`), id, difficulty, "stone run answer text");
    });
    return;
  }
  if (id === "matchstick-growth-table-b2") {
    const rule = { square: [4, 3], house: [5, 4], triangle: [3, 2], hexagon: [6, 5] }[meta.shape];
    const f = (n) => rule[0] + rule[1] * (n - 1);
    assert(meta.values.every((v, i) => v === f(i + 1)), id, difficulty, "matchstick table mismatch");
    assert((html.match(/<line /g) || []).length === f(1) + f(2) + f(3), id, difficulty, "matchstick drawn sticks mismatch");
    assert(meta.reverse ? problem.answer === `${meta.target}개` : problem.answer.endsWith(`/ ${f(meta.target)}개`), id, difficulty, "matchstick answer mismatch");
    return;
  }
  if (id === "stone-overtake-table-b2") {
    const grid = (n) => {
      const s = n + meta.offset;
      let black = 0;
      let white = 0;
      if (meta.shape === "triangle") {
        for (let r = 0; r < s; r += 1) for (let k = 0; k <= r; k += 1) (r === s - 1 || k === 0 || k === r) ? (black += 1) : (white += 1);
      } else {
        const cols = meta.shape === "rect" ? s + 1 : s;
        for (let r = 0; r < s; r += 1) for (let c = 0; c < cols; c += 1) (r === 0 || c === 0 || r === s - 1 || c === cols - 1) ? (black += 1) : (white += 1);
      }
      return { black, white };
    };
    let first = 1;
    while (grid(first).white <= grid(first).black) first += 1;
    assert(first === meta.first, id, difficulty, "overtake stage mismatch");
    assert(meta.blacks.every((v, i) => v === grid(i + 1).black) && meta.whites.every((v, i) => v === grid(i + 1).white), id, difficulty, "overtake table mismatch");
    assert(problem.answer.endsWith(`(3) ${first}번째`), id, difficulty, "overtake answer mismatch");
    return;
  }
  if (id === "fold-pieces-to-folds-b2") {
    assert(meta.pieces === 2 ** meta.folds, id, difficulty, "fold pieces mismatch");
    if (meta.limit != null) assert(2 ** (meta.folds - 1) <= meta.limit && meta.limit < meta.pieces, id, difficulty, "fold limit mismatch");
    assert(problem.answer === `${meta.folds}번`, id, difficulty, "fold answer mismatch");
    return;
  }
  if (id === "mixed-rule-sequence-table-b2") {
    const d = (f) => f.slice(1).map((v, i) => v - f[i]);
    const check = {
      add: (f) => new Set(d(f)).size === 1 && d(f)[0] > 0,
      sub: (f) => new Set(d(f)).size === 1 && d(f)[0] < 0,
      repeat: (f) => [3, 4].some((p) => f.every((v, i) => v === f[i % p])),
      "grow-diff": (f) => d(d(f)).every((x) => x === 1),
      "grow-diff-step": (f) => new Set(d(d(f))).size === 1 && d(d(f))[0] > 1,
      fib: (f) => f.every((v, i) => i < 2 || v === f[i - 1] + f[i - 2]),
      "two-strands": (f) => [0, 1].every((k) => new Set(d(f.filter((_, i) => i % 2 === k))).size === 1),
      runs: (f) => { const want = []; for (let n = 1; want.length < f.length; n += 1) for (let k = 1; k <= n && want.length < f.length; k += 1) want.push(k); return want.join() === f.join(); }
    };
    meta.rows.forEach((r, i) => {
      assert(check[r.id](r.full), id, difficulty, `sequence row rule broken ${r.id}`);
      assert(String(problem.answer).includes(`${"①②③④⑤⑥⑦⑧"[i]} ${r.full[r.blank]}`), id, difficulty, "sequence table answer mismatch");
    });
    return;
  }
  if (id === "letter-shape-stone-growth-b2") {
    const per = { "t-up": 3, cross: 4, ell: 2 }[meta.kind];
    const f = (n) => 1 + per * (n - 1);
    assert((html.match(/<circle /g) || []).length === f(1) + f(2) + f(3) + f(4), id, difficulty, "letter stones drawn mismatch");
    assert(meta.reverse ? problem.answer === `${meta.target}번째` && problem.prompt.includes(`${f(meta.target)}개`) : problem.answer === `${f(meta.target)}개`, id, difficulty, "letter answer mismatch");
    return;
  }
  // 보기 셋 + 마지막 하나의 약속 문제: 내가 따로 적은 후보 규칙 중 보기 셋에 맞는 것이 하나뿐이고, 빈칸이 그 규칙으로 하나만 나온다
  const ruleCheck = (cands, items, outKey, answer, blankKey = outKey) => {
    const shown = items.slice(0, 3);
    const fits = Object.entries(cands).filter(([, f]) => shown.every((x) => f(x) === x[outKey]));
    assert(fits.length === 1, id, difficulty, "rule not unique among examples");
    const f = fits[0][1];
    const last = items[3];
    assert(f(last) === last[outKey], id, difficulty, "last item breaks rule");
    const values = [];
    for (let x = 0; x <= 99; x += 1) { const w = { ...last, [blankKey]: x }; if (blankKey === outKey ? f(last) === x : f(w) === w[outKey]) values.push(x); }
    assert(values.length === 1 && values[0] === answer, id, difficulty, "blank not unique or wrong");
  };
  if (id === "triangle-center-rule-b2") {
    const c = { sum: (v) => v.top + v.left + v.right };
    for (const k of ["top", "left", "right"]) {
      const [a, b] = ["top", "left", "right"].filter((x) => x !== k);
      c[`m${k}`] = (v) => v[a] + v[b] - v[k];
      c[`r${k}`] = (v) => v[k] - v[a] - v[b];
    }
    ruleCheck(c, meta.items, "out", Number(problem.answer), meta.blank);
    return;
  }
  if (id === "pair-stack-rule-b2") {
    const rules = { sum: ([a, b, c, d]) => a + b === c + d, diff: ([a, b, c, d]) => a - b === c - d, prod: ([a, b, c, d]) => a * b === c * d };
    const shown = meta.items.slice(0, 3);
    const fits = Object.values(rules).filter((f) => shown.every(f));
    assert(fits.length === 1, id, difficulty, "stack rule not unique");
    const [a, b, c] = meta.items[3];
    const values = [];
    for (let x = 0; x <= 99; x += 1) if (fits[0]([a, b, c, x])) values.push(x);
    assert(values.length === 1 && values[0] === Number(problem.answer), id, difficulty, "stack blank mismatch");
    return;
  }
  const triCands = { abc: (v) => 10 * v.a + v.b - v.c, abp: (v) => 10 * v.a + v.b + v.c, bac: (v) => 10 * v.b + v.a - v.c, sum: (v) => v.a + v.b + v.c };
  const sqCands = { cols: (v) => 10 * v.tl + v.bl + 10 * v.tr + v.br, rows: (v) => 10 * v.tl + v.tr + 10 * v.bl + v.br, rev: (v) => 10 * v.bl + v.tl + 10 * v.br + v.tr };
  const cornerCands = { sum: (v) => v.tl + v.tr + v.bl + v.br, dbl: (v) => 2 * (v.tl + v.tr + v.bl + v.br), row: (v) => (v.tl + v.tr) * (v.bl + v.br), col: (v) => (v.tl + v.bl) * (v.tr + v.br), diag: (v) => v.tl * v.br + v.tr * v.bl };
  if (id === "triangle-circle-compose-b2") { ruleCheck(triCands, meta.items, "out", Number(problem.answer)); return; }
  if (id === "compose-two-figures-b2") {
    ruleCheck(triCands, meta.parts[0].items, "out", meta.parts[0].answer);
    ruleCheck(sqCands, meta.parts[1].items, "out", meta.parts[1].answer);
    assert(problem.answer === `(1) ${meta.parts[0].answer}, (2) ${meta.parts[1].answer}`, id, difficulty, "compose answer text");
    return;
  }
  if (id === "corner-digit-compose-b2") {
    const ok = (s, x) => (s <= 9 ? x : null);
    ruleCheck({ a: (v) => ok(v.t + v.l, 10 * (v.t + v.l) + v.r), b: (v) => ok(v.t + v.r, 10 * (v.t + v.r) + v.l), c: (v) => ok(v.l + v.r, 10 * (v.l + v.r) + v.t), d: (v) => ok(v.l + v.r, 10 * v.t + v.l + v.r) }, meta.items, "out", Number(problem.answer));
    return;
  }
  if (id === "row-two-digit-relation-b2") {
    const rules = [(r) => r[0] + r[3] === 10 * r[1] + r[2], (r) => r[0] + r[3] === 10 * r[2] + r[1], (r) => r[0] - r[3] === 10 * r[1] + r[2], (r) => r[3] - r[0] === 10 * r[1] + r[2]];
    const fits = rules.filter((f) => meta.rows.slice(0, 3).every(f));
    assert(fits.length === 1 && fits[0](meta.rows[3]), id, difficulty, "row rule not unique");
    const [, col] = meta.blank;
    const values = [];
    for (let x = 0; x <= 99; x += 1) { const w = [...meta.rows[3]]; w[col] = x; if (fits[0](w)) values.push(x); }
    assert(values.length === 1 && values[0] === Number(problem.answer), id, difficulty, "row blank mismatch");
    return;
  }
  if (id === "overlap-circle-flower-b2") {
    const f = meta.op === "diff" ? (a, b) => Math.abs(a - b) : (a, b) => a + b;
    const g = meta.op === "diff" ? (a, b) => a + b : (a, b) => Math.abs(a - b);
    assert(meta.lens.every((v, i) => v === f(meta.values[i], meta.values[(i + 1) % 5])), id, difficulty, "flower lens mismatch");
    const shown = [0, 1, 2, 3, 4].filter((i) => !meta.blanks.includes(i));
    assert(!shown.every((i) => meta.lens[i] === g(meta.values[i], meta.values[(i + 1) % 5])), id, difficulty, "flower rule ambiguous");
    assert(problem.answer === meta.blanks.map((i, k) => `${"㉠㉡㉢"[k]} ${meta.lens[i]}`).join(", "), id, difficulty, "flower answer mismatch");
    return;
  }
  if (id === "sector-circle-corner-sum-b2") {
    const [sec, cor] = meta.parts;
    const f = sec.rule === "a-b" ? (a, b) => a - b : (a, b) => a + b;
    assert(sec.rows.every(([a, b, c]) => f(a, b) === c), id, difficulty, "sector rule mismatch");
    const want = [sec.rows[2][2], sec.blankKeys[1] === "a" ? sec.rows[3][0] : sec.rows[3][2]];
    assert(want.join() === sec.answers.join(), id, difficulty, "sector answer mismatch");
    ruleCheck({ sum: cornerCands.sum, dbl: cornerCands.dbl }, cor.items, "out", cor.answer);
    return;
  }
  if (id === "square-corner-product-b2") { ruleCheck(cornerCands, meta.items, "out", Number(problem.answer)); return; }
  if (id === "diamond-center-signed-b2") {
    const keys = ["top", "right", "bottom", "left"];
    const c = { half: (v) => { const t = keys.reduce((s, k) => s + v[k], 0); return t % 2 ? null : t / 2; } };
    keys.forEach((k) => { c[k] = (v) => keys.filter((x) => x !== k).reduce((s, x) => s + v[x], 0) - v[k]; });
    ruleCheck(c, meta.items, "out", Number(problem.answer));
    return;
  }
  fail(id, difficulty, "validator missing");
}

function validate(type, problem, difficulty) {
  const { id } = type;
  const meta = problem.meta || {};
  const visual = problem.visual || {};
  const numeric = numberFrom(problem.answer);

  assert(problem && typeof problem === "object", id, difficulty, "problem object missing");
  assert(typeof problem.prompt === "string" && problem.prompt.trim(), id, difficulty, "prompt missing");
  assert(problem.answer !== undefined && String(problem.answer).trim(), id, difficulty, "answer missing");
  assert(typeof problem.solution === "string" && problem.solution.trim(), id, difficulty, "solution missing");
  assert(!/undefined|NaN|\[object Object\]/.test(`${problem.prompt}${problem.answer}${problem.solution}`), id, difficulty, "invalid text token");
  validateKoreanSurface(problem, id, difficulty);
  if (id.endsWith("-b2")) return validateStructureB2(id, problem, difficulty);

  if (id.startsWith("equal-partition-")) {
    assert(meta.top === meta.parts * meta.part, id, difficulty, "partition total mismatch");
    assert(numeric === meta.part, id, difficulty, "partition answer mismatch");
    return;
  }
  if (id.startsWith("shape-matrix-")) {
    // 덧셈 매트릭스: 빈칸 값 = 그 줄 모양 값의 합, 다른 모양은 다른 수
    const parts = meta.parts || [{ blanks: meta.blanks, values: meta.values }];
    parts.forEach((part) => {
      const values = Object.values(part.values);
      assert(new Set(values).size === values.length, id, difficulty, "same value for different shapes");
      assert(values.every((value) => Number.isInteger(value) && value > 0), id, difficulty, "shape value not positive integer");
      part.blanks.forEach((blank) => assert(problem.answer.includes(String(blank.sum)), id, difficulty, "blank sum missing in answer"));
    });
    assert(problem.visual?.kind === "shape-matrix" && problem.visual.html.includes("<svg"), id, difficulty, "matrix svg missing");
    return;
  }
  if (id === "shape-sum-table") {
    assert(numeric === visual.columnOne + visual.columnTwo - visual.rowOne, id, difficulty, "matrix answer mismatch");
    return;
  }
  if (id === "equalize-transfer") {
    assert((visual.higher - visual.lower) % 2 === 0, id, difficulty, "odd transfer gap");
    assert(numeric === (visual.higher - visual.lower) / 2, id, difficulty, "transfer answer mismatch");
    return;
  }
  if (id === "total-difference") {
    assert(meta.older + meta.younger === meta.sum && meta.older - meta.younger === meta.gap, id, difficulty, "sum/difference mismatch");
    assert(numeric === (meta.sum + meta.gap) / 2, id, difficulty, "older answer mismatch");
    return;
  }
  if (id === "reverse-transfer-total") {
    assert(meta.receiverBefore * 2 === meta.afterEach, id, difficulty, "receiver reverse step mismatch");
    assert(meta.giverBefore - meta.receiverBefore === meta.afterEach, id, difficulty, "giver reverse step mismatch");
    assert(numeric === meta.giverBefore, id, difficulty, "initial count mismatch");
    return;
  }
  if (id === "balance-order-chain") {
    assert(countOrderings(meta.ordered, meta.relations) === 1, id, difficulty, "weight order is not unique");
    assert(problem.answer === meta.ordered.join(" > "), id, difficulty, "weight order answer mismatch");
    return;
  }
  if (id === "balance-given-unit-weight") {
    for (const equation of meta.equations) {
      const left = equation.left.reduce((sum, symbol) => sum + meta.weights[symbol], 0);
      const right = equation.right.reduce((sum, symbol) => sum + meta.weights[symbol], 0);
      assert(left === right, id, difficulty, "unbalanced equation");
    }
    assert(numeric === meta.weights[meta.target], id, difficulty, "target weight mismatch");
    return;
  }
  if (id === "distinct-shape-value-equation") {
    const values = Object.values(meta.values);
    assert(new Set(values).size === values.length, id, difficulty, "shape values are not distinct");
    assert(values.every((value) => value >= 1 && value <= meta.limit), id, difficulty, "shape value outside range");
    for (const row of meta.rows) {
      const left = row.left.reduce((sum, symbol) => sum + meta.values[symbol], 0);
      const right = row.right.reduce((sum, symbol) => sum + meta.values[symbol], 0);
      assert(left === right, id, difficulty, "shape equation mismatch");
    }
    assert(numeric === meta.values[meta.target], id, difficulty, "shape target mismatch");
    return;
  }
  if (id === "constant-step-number-sequence") {
    meta.rows.forEach((row) => row.items.slice(1).forEach((value, index) => assert(value - row.items[index] === row.step, id, difficulty, "constant step mismatch")));
    const expected = meta.rows.map((row, index) => `(${index + 1}) ${row.items[row.gap]}`).join(", ");
    assert(problem.answer === expected, id, difficulty, "constant sequence answer mismatch");
    return;
  }
  if (id === "interleaved-number-sequence") {
    const expected = meta.gaps.map((gap, index) => `${["ㄱ", "ㄴ", "ㄷ"][index]}=${meta.items[gap]}`).join(", ");
    assert(problem.answer === expected, id, difficulty, "interleaved answer mismatch");
    meta.rules.forEach((rule, strand) => {
      const values = meta.items.filter((_, index) => index % meta.strands === strand);
      values.slice(1).forEach((value, index) => assert(value - values[index] === rule.step, id, difficulty, "interleaved step mismatch"));
    });
    return;
  }
  if (id === "previous-two-sum-sequence") {
    meta.items.slice(2).forEach((value, index) => assert(value === meta.items[index] + meta.items[index + 1], id, difficulty, "previous-two sum mismatch"));
    assert(numeric === meta.items[meta.gap], id, difficulty, "previous-two answer mismatch");
    return;
  }
  if (id === "repeating-number-sequence") {
    meta.items.forEach((value, index) => assert(value === meta.pattern[index % meta.pattern.length], id, difficulty, "number pattern mismatch"));
    assert(numeric === meta.items[meta.gap], id, difficulty, "number pattern answer mismatch");
    return;
  }
  if (id === "repeating-symbol-sequence") {
    const names = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
    const target = meta.pattern[meta.shown.length % meta.pattern.length];
    const expected = `${target.filled ? "색칠한" : "색칠하지 않은"} ${names[target.shape]} ${target.count}개`;
    assert(problem.answer === expected, id, difficulty, "symbol pattern answer mismatch");
    return;
  }
  if (id === "progressive-number-table") {
    assert(numeric === meta.fullStages[3][meta.targetRow][meta.targetColumn], id, difficulty, "progressive table answer mismatch");
    for (let stage = 1; stage < meta.fullStages.length; stage += 1) {
      meta.fullStages[stage].forEach((row, r) => row.forEach((value, c) => assert(value - meta.fullStages[stage - 1][r][c] === meta.stageStep, id, difficulty, "stage step mismatch")));
    }
    return;
  }
  if (id === "matchstick-shared-polygon-growth") {
    assert(meta.answer === meta.first + meta.added * (meta.target - 1), id, difficulty, "matchstick formula mismatch");
    assert(numeric === meta.answer, id, difficulty, "matchstick answer mismatch");
    return;
  }
  if (id === "triangular-stone-growth") {
    assert(meta.black + meta.white === triangular(meta.side), id, difficulty, "triangle stone total mismatch");
    assert(numeric === Math.abs(meta.black - meta.white), id, difficulty, "triangle stone difference mismatch");
    return;
  }
  if (id === "square-border-stone-growth") {
    assert(meta.black === 4 * (meta.side - 1), id, difficulty, "square border count mismatch");
    assert(meta.white === (meta.side - 2) ** 2, id, difficulty, "square interior count mismatch");
    assert(meta.difference === Math.abs(meta.black - meta.white), id, difficulty, "square stone difference mismatch");
    return;
  }
  if (["staircase-tile-growth", "nested-circle-count", "growing-segment-count"].includes(id)) {
    assert(meta.answer === triangular(meta.target), id, difficulty, "triangular growth formula mismatch");
    assert(numeric === meta.answer, id, difficulty, "triangular growth answer mismatch");
    return;
  }
  if (id === "repeated-fold-cut-count" || id === "fold-punch-doubling") {
    assert(meta.answer === 2 ** meta.folds, id, difficulty, "doubling formula mismatch");
    assert(numeric === meta.answer, id, difficulty, "doubling answer mismatch");
    return;
  }
  if (id === "colored-triangle-growth") {
    assert(meta.blue === triangular(meta.target) && meta.white === triangular(meta.target - 1), id, difficulty, "colored triangle counts mismatch");
    assert(numeric === meta.blue - meta.white, id, difficulty, "colored triangle answer mismatch");
    return;
  }
  if (id === "cube-square-layer-growth") {
    const expected = Array.from({ length: meta.n }, (_, index) => (index + 1) ** 2).reduce((sum, value) => sum + value, 0);
    assert(meta.patternKind === "pyramid" && meta.mode === "nth", id, difficulty, "wrong geometry worksheet mode");
    assert(meta.count === expected && numeric === expected, id, difficulty, "cube layer total mismatch");
    return;
  }
  if (id === "four-number-center-rule") {
    const calculate = ([top, right, bottom, left]) => {
      if (meta.family === "sum") return top + right + bottom + left;
      if (meta.family === "sum-minus") return top + left + right - bottom;
      return top + bottom - left - right;
    };
    meta.items.forEach((item) => assert(item.center === calculate(item.outer), id, difficulty, "center rule mismatch"));
    assert(numeric === meta.items.at(-1).center, id, difficulty, "center answer mismatch");
    return;
  }
  if (id === "number-grid-row-rule") {
    const calculate = ([a, b, c]) => meta.family === "sum" ? a + b + c : meta.family === "minus-middle" ? a - b + c : a + b - c;
    meta.rows.forEach((row) => assert(row[3] === calculate(row), id, difficulty, "row rule mismatch"));
    if (meta.family !== "sum") {
      assert(meta.rows.slice(0, 3).some((row) => row[1] !== row[2]), id, difficulty, "subtraction rule is ambiguous");
    }
    assert(numeric === meta.rows[3][meta.blankColumn], id, difficulty, "row rule answer mismatch");
    return;
  }
  if (id === "two-digit-compose-rule") {
    meta.items.forEach((item) => assert(item.result === (meta.operation === "add" ? item.first + item.second : item.first - item.second), id, difficulty, "two-digit rule mismatch"));
    const target = meta.items[meta.hidden.item];
    const expected = meta.hidden.field === "result" ? target.result : String(target[meta.hidden.field]).padStart(2, "0")[meta.hidden.digit];
    assert(String(problem.answer) === String(expected), id, difficulty, "two-digit hidden answer mismatch");
    return;
  }
  if (id.startsWith("sudoku-")) {
    assert(meta.puzzle[meta.target[0]][meta.target[1]] === 0, id, difficulty, "target cell is visible");
    assert(sudokuSolutionCount(meta.puzzle, meta.regions) === 1, id, difficulty, "sudoku answer is not unique");
    assert(numeric === meta.solution[meta.target[0]][meta.target[1]], id, difficulty, "sudoku target answer mismatch");
    return;
  }

  fail(id, difficulty, "validator missing");
}

assert(book, "book-02", 0, "curriculum book missing");
assert(typeIds.length === 89, "book-02", 0, `expected 89 types, got ${typeIds.length}`);
assert(new Set(typeIds).size === typeIds.length, "book-02", 0, "duplicate type id");
assert(types.every(Boolean), "book-02", 0, "unknown type id");
const remappedIds = new Set(TEXTBOOK_REMAPS.filter((row) => row[0] === "book-02").map((row) => row[5]));
assert(types.every((type) => type.textbookSource || remappedIds.has(type.id)), "book-02", 0, "textbook source missing");
assert(types.every((type) => typeof GENERATORS[type.generator] === "function"), "book-02", 0, "generator missing");
assert(book.units.every((item) => item.studyRefs), "book-02", 0, "study reference missing");
for (const item of book.units) {
  assert(Object.keys(item.studyRefs).sort().join(",") === stages.map((stage) => stage.id).sort().join(","), "book-02", 0, `${item.label}: stage mismatch`);
  assert(item.studyRefs.concept.length === item.studyRefs.type.length, "book-02", 0, `${item.label}: activity/check group mismatch`);
  for (const references of Object.values(item.studyRefs)) {
    for (const reference of references) {
      assert(reference.from === 1 && Number.isInteger(reference.to) && reference.to >= 1, "book-02", 0, `${item.label}: invalid problem range`);
    }
  }
}
const fallbackGuide = "문제에 보이는 관계를 한 단계씩 표시한 뒤 같은 규칙을 적용합니다.";
assert(types.every((type) => textbookGuideForType(type.id) !== fallbackGuide), "book-02", 0, "explicit concept guide missing");

let generated = 0;
for (const type of types) {
  for (const stage of stages) {
    const difficulty = stage.difficulty;
    const variants = new Set();
    for (let index = 0; index < iterations; index += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 400 && !problem; attempt += 1) {
        problem = GENERATORS[type.generator]({ difficulty, max: 30 });
      }
      assert(problem, type.id, difficulty, "400 retries returned null");
      try { validate(type, problem, difficulty); } catch (error) {
        // 원본 대조로 다른 권 유형을 빌려 온 번호(textbook-remaps.js)는 그 유형의 감사가 검산한다.
        if (!(remappedIds.has(type.id) && /validator missing/.test(error.message))) throw error;
      }
      variants.add(JSON.stringify([problem.prompt, problem.visual, problem.answer]));
      generated += 1;
    }
    assert(variants.size >= Math.min(3, iterations), type.id, difficulty, `only ${variants.size} visible variant(s)`);
  }
}

console.log(`BOOK02_AUDIT_OK types=${types.length} stages=${stages.length} iterations=${iterations} generated=${generated}`);
