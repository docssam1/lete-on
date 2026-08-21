import "../../geometry/worksheet/generators.js";
import { GENERATORS } from "./generators.js";
import { CURRICULUM, typeById } from "./source-data.js";

const iterations = Number.parseInt(process.argv[2] || "1000", 10);
const difficulties = [1, 2, 3];
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

  if (id.startsWith("equal-partition-")) {
    assert(meta.top === meta.parts * meta.part, id, difficulty, "partition total mismatch");
    assert(numeric === meta.part, id, difficulty, "partition answer mismatch");
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
assert(typeIds.length === 33, "book-02", 0, `expected 33 types, got ${typeIds.length}`);
assert(new Set(typeIds).size === typeIds.length, "book-02", 0, "duplicate type id");
assert(types.every(Boolean), "book-02", 0, "unknown type id");
assert(types.every((type) => type.textbookSource), "book-02", 0, "textbook source missing");
assert(types.every((type) => typeof GENERATORS[type.generator] === "function"), "book-02", 0, "generator missing");

let generated = 0;
for (const type of types) {
  for (const difficulty of difficulties) {
    const variants = new Set();
    for (let index = 0; index < iterations; index += 1) {
      let problem = null;
      for (let attempt = 0; attempt < 400 && !problem; attempt += 1) {
        problem = GENERATORS[type.generator]({ difficulty, max: 30 });
      }
      assert(problem, type.id, difficulty, "400 retries returned null");
      validate(type, problem, difficulty);
      variants.add(JSON.stringify([problem.prompt, problem.visual, problem.answer]));
      generated += 1;
    }
    assert(variants.size >= Math.min(3, iterations), type.id, difficulty, `only ${variants.size} visible variant(s)`);
  }
}

console.log(`BOOK02_AUDIT_OK types=${types.length} difficulties=${difficulties.length} iterations=${iterations} generated=${generated}`);
