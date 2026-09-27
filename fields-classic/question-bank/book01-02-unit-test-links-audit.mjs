import { GENERATORS } from "./generators.js";
import { book01Markup } from "./book01-renderers.js";
import { book02Markup } from "./book02-renderers.js";
import { CURRICULUM, typeById } from "./source-data.js";
import {
  BOOK01_02_UNIT_TEST_LINKS,
  BOOK01_UNIT_TEST_LINKS,
  BOOK02_UNIT_TEST_LINKS,
  LEARNER_STAGE
} from "./book01-02-unit-test-links.js";

const failures = [];
const variants = Number.parseInt(process.argv[2] || "3", 10);

const fail = (message) => failures.push(message);
const assert = (condition, message) => {
  if (!condition) fail(message);
};

const curriculumTypeIds = (bookId) => {
  const book = CURRICULUM.find((entry) => entry.id === bookId);
  return new Set(book?.units.flatMap((unit) => unit.typeIds) || []);
};

const auditLinks = (bookId, links) => {
  assert(links.length === 25, `${bookId}: expected exactly 25 links, got ${links.length}`);
  assert(links.every((entry, index) => entry.number === index + 1), `${bookId}: question numbers must be 1..25`);
  assert(new Set(links.map((entry) => entry.number)).size === 25, `${bookId}: duplicate question number`);

  const typeIds = curriculumTypeIds(bookId);
  const sourcePrefix = `book${bookId.slice(-2)}`;
  for (const entry of links) {
    const prefix = `${bookId} q${String(entry.number).padStart(2, "0")}`;
    assert(typeof entry.label === "string" && entry.label.trim(), `${prefix}: label missing`);
    assert(entry.sourceLocator === `${sourcePrefix}-unit-test:q${String(entry.number).padStart(2, "0")}`, `${prefix}: unstable source locator`);
    assert(typeof entry.sourceVisualSignature === "string" && entry.sourceVisualSignature.trim(), `${prefix}: visual signature missing`);
    assert(entry.sourceContract && typeof entry.sourceContract === "object", `${prefix}: source contract missing`);
    assert(entry.sourceContract.responseKind && entry.sourceContract.answerShape && entry.sourceContract.visualShape, `${prefix}: incomplete source contract`);
    assert(entry.difficulty >= 1 && entry.difficulty <= 3, `${prefix}: difficulty outside 1..3`);
    assert(["classified", "exact-generator"].includes(entry.sourceFidelity), `${prefix}: unsupported source fidelity ${entry.sourceFidelity}`);
    assert(entry.generationCaseMode === (entry.sourceFidelity === "exact-generator" ? "source" : "variant-from-source"), `${prefix}: generationCase mode mismatch`);
    if (entry.verified) {
      assert(typeof entry.typeId === "string" && typeIds.has(entry.typeId), `${prefix}: verified link is not a current ${bookId} curriculum type`);
      assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: verified generator contract missing`);
      assert(entry.sourceContract.responseKind === entry.generatorContract.responseKind, `${prefix}: response kind mismatch`);
      assert(entry.sourceContract.answerShape === entry.generatorContract.answerShape, `${prefix}: answer shape mismatch`);
      assert(entry.sourceContract.visualShape === entry.generatorContract.visualShape, `${prefix}: visual shape mismatch`);
      assert(entry.sourceContract.conditionSignature === entry.generatorContract.conditionSignature, `${prefix}: condition contract mismatch`);
      assert(!entry.reason, `${prefix}: verified link must not have a hold reason`);
    } else {
      assert(entry.typeId === null || (typeof entry.typeId === "string" && typeIds.has(entry.typeId)), `${prefix}: held candidate typeId is not a current curriculum type`);
      if (entry.typeId) assert(entry.generatorContract && typeof entry.generatorContract === "object", `${prefix}: held candidate generator contract missing`);
      assert(typeof entry.reason === "string" && entry.reason.trim(), `${prefix}: blocked link needs an explicit reason`);
    }
  }
};

const render = (bookId, problem) => {
  if (!problem.visual) return "";
  if (bookId === "book-01" && problem.visual.kind === "book1") return book01Markup(problem.visual);
  if (bookId === "book-02") return book02Markup(problem.visual);
  return "";
};

const permutationsOf = (values) => {
  if (values.length <= 1) return [values];
  return values.flatMap((value, index) => permutationsOf(values.filter((_, itemIndex) => itemIndex !== index)).map((tail) => [value, ...tail]));
};

function sudokuCompletionCount(meta) {
  const { size, cells } = meta;
  const board = [...cells];
  const digits = Array.from({ length: size }, (_, index) => index + 1);
  const regionOf = (index) => meta.regionMap
    ? meta.regionMap[index]
    : Math.floor(Math.floor(index / size) / meta.regionRows) * (size / meta.regionColumns) + Math.floor((index % size) / meta.regionColumns);
  const valid = (index, value) => {
    const row = Math.floor(index / size);
    const column = index % size;
    for (let cursor = 0; cursor < size; cursor += 1) {
      if (board[row * size + cursor] === value || board[cursor * size + column] === value) return false;
    }
    const region = regionOf(index);
    return !board.some((item, itemIndex) => item === value && regionOf(itemIndex) === region);
  };
  const visit = () => {
    const index = board.indexOf(null);
    if (index < 0) return 1;
    let count = 0;
    for (const value of digits) {
      if (!valid(index, value)) continue;
      board[index] = value;
      count += visit();
      board[index] = null;
      if (count > 1) return count;
    }
    return count;
  };
  return visit();
}

function independentCheck(entry, problem, prefix) {
  const meta = problem.meta;
  if (meta?.sourceNumber && ![1, 2, 22].includes(meta.sourceNumber)) {
    const answerNumber = Number.parseInt(problem.answer, 10);
    if ([3, 5].includes(meta.sourceNumber)) {
      assert(meta.larger + meta.smaller === meta.total, `${prefix}: two-target total disagrees`);
      assert(meta.larger - meta.smaller === meta.gap, `${prefix}: two-target difference disagrees`);
      assert(problem.answer.includes(String(meta.larger)) && problem.answer.includes(String(meta.smaller)), `${prefix}: both target values must be in the answer`);
    } else if (meta.sourceNumber === 6) {
      const solutions = permutationsOf(meta.cards).filter(([square, circle, diamond, cross]) => square * 2 === diamond && circle * 2 === square + diamond && square + circle === cross);
      assert(solutions.length === 1, `${prefix}: q6 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.cross, `${prefix}: q6 target disagrees`);
    } else if (meta.sourceNumber === 7) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle * 2 && star === diamond + square, `${prefix}: q7 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q7 answer disagrees`);
    } else if (meta.sourceNumber === 8) {
      const solutions = permutationsOf(meta.cards).filter(([diamond, square, triangle, circle]) => diamond * 3 === square * 4 && diamond * 2 === triangle + square && triangle + circle === diamond + square);
      assert(solutions.length === 1, `${prefix}: q8 must have one shape assignment`);
      assert(solutions[0][3] === answerNumber && answerNumber === meta.values.circle, `${prefix}: q8 target disagrees`);
    } else if (meta.sourceNumber === 9) {
      const { diamond, circle, square, star } = meta.weights;
      assert(circle === diamond * 2 && square * 2 === diamond + circle && star * 2 === diamond + square, `${prefix}: q9 balance chain disagrees`);
      assert(answerNumber === star, `${prefix}: q9 answer disagrees`);
    } else if (meta.sourceNumber === 10) {
      assert(meta.patterns.length === 2 && meta.answers.length === 2, `${prefix}: q10 needs two subproblems`);
      meta.patterns.forEach((pattern, index) => {
        const shown = meta.shown[index];
        assert(shown.length >= pattern.length * 2 + 1, `${prefix}: q10 must show at least two full repeats and one extra item`);
        assert(shown.every((value, position) => value === pattern[position % pattern.length]), `${prefix}: q10 shown pattern ${index + 1} disagrees`);
        assert(meta.answers[index] === pattern[shown.length % pattern.length], `${prefix}: q10 next shape ${index + 1} disagrees`);
      });
      assert(problem.parts?.length === 2 && problem.answerVisuals?.length === 2, `${prefix}: q10 multipart drawing contract missing`);
    } else if (meta.sourceNumber === 11) {
      const targetShape = meta.shapeCycle[(meta.targetIndex - 1) % meta.shapeCycle.length];
      const filled = meta.filledPositions.includes(meta.targetIndex);
      assert(meta.answerToken === `${filled ? "filled-" : ""}${targetShape}`, `${prefix}: q11 shape/fill cycles disagree`);
      assert(problem.answerVisual, `${prefix}: q11 drawing answer visual missing`);
    } else if (meta.sourceNumber === 12) {
      assert(meta.rows.length === 2 && problem.parts?.length === 2, `${prefix}: q12 needs two independent sequences`);
      meta.rows.forEach((row, index) => {
        const values = [...row.values];
        values[row.blankIndex] = row.answer;
        if (index === 0) {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 4), `${prefix}: q12 first grouped sequence disagrees`);
        } else {
          assert(values.every((value, position) => position < 3 || value === values[position - 3] + 1), `${prefix}: q12 second grouped sequence disagrees`);
        }
      });
    } else if (meta.sourceNumber === 13) {
      assert(meta.answer === meta.first + meta.increase * (meta.target - 1), `${prefix}: q13 shared-side growth disagrees`);
      assert(answerNumber === meta.answer && meta.target === 7, `${prefix}: q13 source target changed`);
    } else if (meta.sourceNumber === 14) {
      assert(meta.white - meta.dark === meta.answer && meta.answer === meta.target, `${prefix}: q14 triangle color difference disagrees`);
      assert(answerNumber === meta.answer && meta.target === 8, `${prefix}: q14 source target changed`);
    } else if (meta.sourceNumber === 15) {
      assert(2 ** meta.folds === meta.pieces, `${prefix}: q15 reverse fold count disagrees`);
      assert(answerNumber === meta.folds, `${prefix}: q15 answer must be the fold count`);
    } else if (meta.sourceNumber === 16) {
      assert(meta.rows.every(([left, center, right]) => left + right === center), `${prefix}: q16 row sums disagree`);
      assert(answerNumber === meta.answer && meta.answer === meta.rows[3][1] % 10, `${prefix}: q16 target digit disagrees`);
    } else if (meta.sourceNumber === 17) {
      assert(meta.rows.every(([first, second, third, fourth]) => first - second + third === fourth), `${prefix}: q17 row rule disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q17 answer disagrees`);
    } else if (meta.sourceNumber === 18) {
      assert(meta.items.every(({ top, left, center, right }) => top + left + center === right), `${prefix}: q18 triangle relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q18 answer disagrees`);
    } else if ([19, 20].includes(meta.sourceNumber)) {
      const digits = Array.from({ length: meta.size }, (_, index) => index + 1).join(",");
      const rows = Array.from({ length: meta.size }, (_, row) => meta.solution.slice(row * meta.size, row * meta.size + meta.size));
      const columns = Array.from({ length: meta.size }, (_, column) => rows.map((row) => row[column]));
      assert([...rows, ...columns].every((line) => [...line].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku row or column invalid`);
      const regionOf = (index) => meta.regionMap
        ? meta.regionMap[index]
        : Math.floor(Math.floor(index / meta.size) / meta.regionRows) * (meta.size / meta.regionColumns) + Math.floor((index % meta.size) / meta.regionColumns);
      const regions = Array.from({ length: meta.size }, (_, region) => meta.solution.filter((_, index) => regionOf(index) === region));
      assert(regions.every((region) => [...region].sort((a, b) => a - b).join(",") === digits), `${prefix}: sudoku region invalid`);
      assert(meta.cells.every((value, index) => value == null || value === meta.solution[index]), `${prefix}: sudoku clue disagrees with answer`);
      assert(sudokuCompletionCount(meta) === 1, `${prefix}: sudoku must have one completion`);
      assert(problem.answerVisual?.cells?.every((value, index) => value === meta.solution[index]), `${prefix}: full sudoku answer visual missing`);
    } else if (meta.sourceNumber === 21) {
      assert(meta.items.every(({ top, left, right, bottom, center }) => top + center === left + right + bottom), `${prefix}: q21 diamond relation disagrees`);
      assert(answerNumber === meta.answer, `${prefix}: q21 answer disagrees`);
    } else if (meta.sourceNumber === 23) {
      let count = 0;
      let target = null;
      for (let square = 1; square <= 9; square += 1) for (let diamond = 1; diamond <= 9; diamond += 1) for (let triangle = 1; triangle <= 9; triangle += 1) for (let circle = 1; circle <= 9; circle += 1) {
        if (new Set([square, diamond, triangle, circle]).size !== 4) continue;
        if (diamond * 3 !== square * 4 || triangle * 3 !== square * 5 || diamond + triangle !== square + circle) continue;
        count += 1;
        target = circle;
      }
      assert(count === 1 && target === answerNumber && answerNumber === meta.values.circle, `${prefix}: q23 must have one assignment`);
    } else if (meta.sourceNumber === 25) {
      assert(meta.previous.white <= meta.previous.black, `${prefix}: q25 previous stage already qualifies`);
      assert(meta.current.white > meta.current.black && meta.current.stage === meta.previous.stage + 1, `${prefix}: q25 first qualifying stage disagrees`);
      assert(answerNumber === meta.target, `${prefix}: q25 answer disagrees`);
    }
    return;
  }
  if (entry.typeId === "fold-number-cut-sum-textbook") {
    const folded = (index, direction) => ["down", "right"].includes(direction)
      ? Math.max(index, 3 - index) - 2 : Math.min(index, 3 - index);
    const cut = meta.grid.reduce((sum, row, r) => sum + row.reduce((subtotal, value, c) =>
      subtotal + (meta.cells.some((cell) => cell.r === folded(r, meta.hDir) && cell.c === folded(c, meta.vDir)) ? value : 0), 0), 0);
    assert(meta.grid.length === 4 && meta.grid.every((row) => row.length === 4), `${prefix}: folding grid shape changed`);
    assert(Number(problem.answer) === cut, `${prefix}: independently folded sum disagrees`);
  } else if (entry.typeId === "polygon-ring-equal-sum") {
    const { shown, cards, lineSum } = problem.visual;
    const values = problem.answer.split(",").map(Number);
    assert(values.length === 10 && new Set(values).size === 10 && values.every((value) => cards.includes(value)), `${prefix}: ring cards mismatch`);
    const valid = (ring) => Array.from({ length: 5 }, (_, edge) => [edge * 2, edge * 2 + 1, (edge * 2 + 2) % 10])
      .every((indices) => indices.some((index) => ring[index] == null) || indices.reduce((sum, index) => sum + ring[index], 0) === lineSum);
    assert(shown.every((value, index) => value == null || value === values[index]) && valid(values), `${prefix}: ring solution violates given clues`);
    const countCompletions = (ring, unused) => {
      if (!valid(ring)) return 0;
      const empty = ring.indexOf(null);
      if (empty < 0) return 1;
      return unused.reduce((total, value) => {
        if (total > 1) return total;
        const next = [...ring];
        next[empty] = value;
        return total + countCompletions(next, unused.filter((item) => item !== value));
      }, 0);
    };
    assert(countCompletions([...shown], cards.filter((value) => !shown.includes(value))) === 1, `${prefix}: ring has multiple or no completions`);
  } else if (entry.typeId === "equalize-transfer") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.higher - answer === meta.lower + answer && answer >= 0, `${prefix}: transfer does not equalize both quantities`);
  } else if (entry.typeId === "reverse-transfer-total") {
    const answer = Number.parseInt(problem.answer, 10);
    assert(meta.receiverBefore * 2 === meta.afterEach && answer - meta.receiverBefore === meta.afterEach, `${prefix}: reverse transfer does not reproduce the final state`);
  } else if (entry.typeId === "shape-sum-table" && meta?.sourceLayout) {
    const { cells, rowSums, columnSums } = problem.visual;
    const valueOf = (shape) => meta.shapeValues[shape];
    const calculatedRows = cells.map((row) => row.reduce((sum, shape) => sum + valueOf(shape), 0));
    const calculatedColumns = cells[0].map((_, column) => cells.reduce((sum, row) => sum + valueOf(row[column]), 0));
    rowSums.forEach((sum, index) => assert(sum == null || sum === calculatedRows[index], `${prefix}: visible row sum ${index + 1} disagrees`));
    columnSums.forEach((sum, index) => assert(sum == null || sum === calculatedColumns[index], `${prefix}: visible column sum ${index + 1} disagrees`));
    const values = Object.values(meta.shapeValues);
    assert(values.every((value) => Number.isInteger(value) && value > 0) && new Set(values).size === values.length, `${prefix}: shape values must be distinct positive integers`);
    assert(rowSums.filter((sum) => sum == null).length + columnSums.filter((sum) => sum == null).length === 1, `${prefix}: matrix needs exactly one target sum`);
    const expected = meta.targetAxis === "row" ? calculatedRows[meta.targetIndex] : calculatedColumns[meta.targetIndex];
    assert(Number(problem.answer) === expected, `${prefix}: target sum disagrees with the matrix`);

    let solved;
    if (meta.sourceLayout === "shape-matrix-3x3-last-column") {
      const square = columnSums[1] / 3;
      const diamond = rowSums[1] - square * 2;
      const triangle = rowSums[0] - diamond - square;
      const circle = rowSums[2] - triangle - square;
      solved = { square, diamond, triangle, circle };
      assert(cells.length === 3 && cells.every((row) => row.length === 3), `${prefix}: source 3x3 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-4x4-first-row") {
      const circle = columnSums[1] / 4;
      const square = rowSums[2] - circle * 3;
      const diamond = rowSums[3] - circle * 2 - square;
      const triangle = columnSums[2] - square - circle * 2;
      solved = { circle, square, diamond, triangle };
      assert(cells.length === 4 && cells.every((row) => row.length === 4), `${prefix}: source 4x4 structure changed`);
    } else if (meta.sourceLayout === "shape-matrix-3x4-second-row") {
      const circle = (rowSums[2] * 2 - rowSums[0]) / 4;
      const square = rowSums[2] - circle * 3;
      const cross = columnSums[0] - square - circle;
      const diamond = columnSums[1] - circle * 2;
      const triangle = columnSums[2] - circle - square;
      solved = { circle, square, cross, diamond, triangle };
      assert(cells.length === 3 && cells.every((row) => row.length === 4), `${prefix}: source 3x4 structure changed`);
    }
    assert(solved && Object.entries(solved).every(([shape, value]) => value === meta.shapeValues[shape]), `${prefix}: visible sums do not recover one unique value per shape`);
  } else {
    fail(`${prefix}: independent validator is required before enabling a new link`);
  }
}

const auditGeneratedContracts = (bookId, links) => {
  for (const entry of links.filter((item) => item.verified)) {
    const type = typeById(entry.typeId);
    assert(entry.generatorContract, `${bookId} q${entry.number}: generator contract missing`);
    assert(type?.generator && typeof GENERATORS[type.generator] === "function", `${bookId} q${entry.number}: generator missing for ${entry.typeId}`);
    for (const difficulty of [1, 2, 3].slice(0, variants)) {
      const sourceCase = {
        mode: entry.generationCaseMode,
        sourceKey: `unit-test:${bookId}:q${entry.number}`,
        sourceKind: "unit-test",
        sourceId: bookId,
        number: entry.number,
        sourceFidelity: entry.sourceFidelity
      };
      const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
      const prefix = `${bookId} q${String(entry.number).padStart(2, "0")} ${entry.typeId} d${difficulty}`;
      assert(problem && typeof problem === "object", `${prefix}: generator returned no problem`);
      assert(typeof problem.prompt === "string" && problem.prompt.trim(), `${prefix}: prompt missing`);
      assert(problem.answer !== undefined && String(problem.answer).trim(), `${prefix}: answer missing`);
      assert(typeof problem.solution === "string" && problem.solution.trim(), `${prefix}: solution missing`);
      assert(!/undefined|NaN|\[object Object\]/.test(`${problem.prompt}${problem.answer}${problem.solution}`), `${prefix}: invalid generated text`);
      assert((problem.responseKind || "text") === entry.generatorContract.responseKind, `${prefix}: generated response kind differs from contract`);
      independentCheck(entry, problem, prefix);
      const markup = [render(bookId, problem), ...(problem.parts || []).map((part) => render(bookId, part))].join("");
      if (problem.visual?.kind === "book1" || problem.visual?.kind === "book2" || problem.parts?.some((part) => ["book1", "book2"].includes(part.visual?.kind))) {
        assert(markup.trim().length > 30, `${prefix}: renderer produced blank markup`);
      }
    }
  }
};

const auditBook02MatrixStress = () => {
  const matrixLinks = BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number));
  for (const entry of matrixLinks) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < 100; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

const BOOK02_STRESS_VARIANTS = 20;
const auditBook02SourceStress = () => {
  for (const entry of BOOK02_UNIT_TEST_LINKS) {
    const type = typeById(entry.typeId);
    const sourceCase = {
      mode: entry.generationCaseMode,
      sourceKey: `unit-test:book-02:q${entry.number}`,
      sourceKind: "unit-test",
      sourceId: "book-02",
      number: entry.number,
      sourceFidelity: entry.sourceFidelity
    };
    for (const difficulty of [1, 2, 3]) {
      for (let sample = 0; sample < BOOK02_STRESS_VARIANTS; sample += 1) {
        const problem = GENERATORS[type.generator]({ difficulty, sourceCase });
        independentCheck(entry, problem, `book-02 q${String(entry.number).padStart(2, "0")} source stress d${difficulty} sample${sample + 1}`);
      }
    }
  }
};

assert(LEARNER_STAGE === "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정", "learner stage contract changed");
assert(BOOK01_02_UNIT_TEST_LINKS["book-01"] === BOOK01_UNIT_TEST_LINKS, "book-01 export alias mismatch");
assert(BOOK01_02_UNIT_TEST_LINKS["book-02"] === BOOK02_UNIT_TEST_LINKS, "book-02 export alias mismatch");
for (const [bookId, links] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
  assert(CURRICULUM.find((book) => book.id === bookId).source.unitTestQuestions.length === links.length, `${bookId}: inventory is not connected`);
}
assert(BOOK02_UNIT_TEST_LINKS.every((entry) => entry.verified), "Every Book 2 source contract must have a verified source-shaped generator");
assert(BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number)).every((entry) => entry.verified), "Source-shaped matrix generators must stay enabled");

auditLinks("book-01", BOOK01_UNIT_TEST_LINKS);
auditLinks("book-02", BOOK02_UNIT_TEST_LINKS);
auditGeneratedContracts("book-01", BOOK01_UNIT_TEST_LINKS);
auditGeneratedContracts("book-02", BOOK02_UNIT_TEST_LINKS);
auditBook02MatrixStress();
auditBook02SourceStress();

const counts = (links) => ({ total: links.length, verified: links.filter((entry) => entry.verified).length, held: links.filter((entry) => !entry.verified).length });
const result = {
  learnerStage: LEARNER_STAGE,
  books: {
    "book-01": counts(BOOK01_UNIT_TEST_LINKS),
    "book-02": counts(BOOK02_UNIT_TEST_LINKS)
  },
  generatedVariantsPerVerifiedLink: Math.min(variants, 3),
  matrixStressSamples: 3 * 3 * 100,
  book02SourceStressSamples: 25 * 3 * BOOK02_STRESS_VARIANTS,
  status: failures.length ? "FAIL" : "BOOK01_BOOK02_UNIT_TEST_LINKS_OK",
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
