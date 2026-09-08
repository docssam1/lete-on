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

function independentCheck(entry, problem, prefix) {
  const meta = problem.meta;
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
      const markup = render(bookId, problem);
      if (problem.visual?.kind === "book1" || problem.visual?.kind === "book2") {
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

assert(LEARNER_STAGE === "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정", "learner stage contract changed");
assert(BOOK01_02_UNIT_TEST_LINKS["book-01"] === BOOK01_UNIT_TEST_LINKS, "book-01 export alias mismatch");
assert(BOOK01_02_UNIT_TEST_LINKS["book-02"] === BOOK02_UNIT_TEST_LINKS, "book-02 export alias mismatch");
for (const [bookId, links] of Object.entries(BOOK01_02_UNIT_TEST_LINKS)) {
  assert(CURRICULUM.find((book) => book.id === bookId).source.unitTestQuestions.length === links.length, `${bookId}: inventory is not connected`);
}
assert(BOOK02_UNIT_TEST_LINKS.filter((entry) => [7, 9, 23].includes(entry.number)).every((entry) => !entry.verified), "Source-incompatible division and equation contracts must remain held");
assert(BOOK02_UNIT_TEST_LINKS.filter((entry) => [1, 2, 22].includes(entry.number)).every((entry) => entry.verified), "Source-shaped matrix generators must stay enabled");

auditLinks("book-01", BOOK01_UNIT_TEST_LINKS);
auditLinks("book-02", BOOK02_UNIT_TEST_LINKS);
auditGeneratedContracts("book-01", BOOK01_UNIT_TEST_LINKS);
auditGeneratedContracts("book-02", BOOK02_UNIT_TEST_LINKS);
auditBook02MatrixStress();

const counts = (links) => ({ total: links.length, verified: links.filter((entry) => entry.verified).length, held: links.filter((entry) => !entry.verified).length });
const result = {
  learnerStage: LEARNER_STAGE,
  books: {
    "book-01": counts(BOOK01_UNIT_TEST_LINKS),
    "book-02": counts(BOOK02_UNIT_TEST_LINKS)
  },
  generatedVariantsPerVerifiedLink: Math.min(variants, 3),
  matrixStressSamples: 3 * 3 * 100,
  status: failures.length ? "FAIL" : "BOOK01_BOOK02_UNIT_TEST_LINKS_OK",
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
