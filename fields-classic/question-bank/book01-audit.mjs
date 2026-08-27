import { CURRICULUM, typeById } from "./source-data.js";
import { GENERATORS } from "./generators.js";
import { BOOK01_GENERATORS, BOOK01_INTERNALS } from "./book01-generators.js";
import { book01Markup } from "./book01-renderers.js";

const iterations = Math.max(1, Number(process.argv[2] || 1000));
const fail = (message) => { throw new Error(`BOOK01_AUDIT_FAILED: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };

function permutations(values) {
  const result = [];
  const data = [...values];
  const visit = (index) => {
    if (index === data.length) { result.push([...data]); return; }
    for (let cursor = index; cursor < data.length; cursor += 1) {
      [data[index], data[cursor]] = [data[cursor], data[index]];
      visit(index + 1);
      [data[index], data[cursor]] = [data[cursor], data[index]];
    }
  };
  visit(0);
  return result;
}

const book = CURRICULUM.find((item) => item.id === "book-01");
assert(book, "book-01 curriculum missing");
const typeIds = book.units.flatMap((unit) => unit.typeIds);
assert(typeIds.length === 34, `expected 34 types, got ${typeIds.length}`);
assert(new Set(typeIds).size === 34, "duplicate type in book-01 curriculum");

let sourceQuestionCount = 0;
const sourceKeys = new Set();
for (const [unitIndex, unit] of book.units.entries()) {
  assert(unit.typeStudyRefs, `${unit.label}: detailed references missing`);
  for (const [typeId, stages] of Object.entries(unit.typeStudyRefs)) {
    assert(unit.typeIds.includes(typeId), `${unit.label}: stray detailed type ${typeId}`);
    for (const [stageId, references] of Object.entries(stages)) {
      for (const reference of references) {
        for (const number of reference.numbers) {
          const key = `${unitIndex + 1}:${stageId}:${reference.section}:${reference.group}:${number}`;
          assert(!sourceKeys.has(key), `source question duplicated ${key}`);
          sourceKeys.add(key);
          sourceQuestionCount += 1;
        }
      }
    }
  }
}
assert(sourceQuestionCount === 163, `expected 163 source questions, got ${sourceQuestionCount}`);

for (const typeId of typeIds) {
  const type = typeById(typeId);
  assert(type, `unknown type ${typeId}`);
  assert(type.sourceMatched, `${typeId}: sourceMatched missing`);
  assert(type.textbookSource?.includes("1과정 1권"), `${typeId}: Book 1 source label missing`);
  assert(type.generator && GENERATORS[type.generator], `${typeId}: generator missing`);
}

function validateShapeTransform(problem) {
  const { visual, meta } = problem;
  assert(new Set(meta.optionKeys).size === meta.optionKeys.length, "shape transform duplicate option");
  const correct = visual.options.find((option) => option.option === meta.correctOption);
  assert(correct?.correct, "shape transform correct option flag mismatch");
  assert(BOOK01_INTERNALS.patternKey(correct.cells) === meta.correctKey, "shape transform answer geometry mismatch");
  assert(visual.options.filter((option) => option.correct).length === 1, "shape transform answer is not unique");
}

function partitionValidity(visual, labels) {
  if (!BOOK01_INTERNALS.isCongruentPartition(visual.rows, visual.columns, labels, visual.pieceCount)) return false;
  if (!visual.symbols) return true;
  const groups = new Map();
  labels.forEach((label, index) => {
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(visual.symbols[index]);
  });
  const signatures = [...groups.values()].map((items) => [...items].sort().join(""));
  return signatures.every((signature) => signature === signatures[0]);
}

function validatePartition(problem) {
  assert(problem.visual.subtype === "partition-draw", "partition task must ask the learner to draw dividing lines");
  assert(!problem.prompt.includes("고르세요"), "partition task incorrectly became multiple choice");
  assert(!problem.visual.options, "partition drawing question must not include answer choices");
  assert(!problem.visual.labels, "partition drawing question reveals the answer lines");
  assert(problem.answerVisual?.subtype === "partition-draw", "partition drawing answer visual missing");
  assert(problem.answerVisual.labels.join() === problem.meta.labels.join(), "partition drawing answer labels mismatch");
  assert(partitionValidity(problem.answerVisual, problem.meta.labels), "partition drawing answer is invalid");
  const fullCuts = new Set();
  problem.meta.labels.forEach((label, index) => {
    const row = Math.floor(index / problem.visual.columns);
    const column = index % problem.visual.columns;
    if (column < problem.visual.columns - 1 && problem.meta.labels[index + 1] !== label) fullCuts.add(`${index}:right`);
    if (row < problem.visual.rows - 1 && problem.meta.labels[index + problem.visual.columns] !== label) fullCuts.add(`${index}:bottom`);
  });
  assert((problem.visual.guideCuts || []).every((cut) => fullCuts.has(cut)), "partition guide line is not part of the answer boundary");
}

function validateDigital(problem) {
  const { family } = problem.meta;
  if (family === "digital-one") {
    assert(BOOK01_INTERNALS.transformDigit(problem.meta.source, problem.meta.operation) === problem.meta.result, "single digital transform mismatch");
  } else if (family === "digital-two") {
    const source = String(problem.meta.source).padStart(2, "0").split("").map(Number);
    const transformed = BOOK01_INTERNALS.transformDisplay(source, problem.meta.operation);
    assert(Number(transformed.join("")) === problem.meta.result, "two-digit transform mismatch");
  } else if (family === "digital-board-sum") {
    const turns = { "rotate-right-quarter": 1, "rotate-left-quarter": 3, "rotate-half": 2 };
    const upright = problem.visual.cells
      .filter((cell) => (cell.orientation + turns[problem.meta.operation]) % 4 === 0)
      .map((cell) => cell.digit);
    assert(upright.join() === problem.meta.uprightDigits.join(), "digital board upright digits mismatch");
    assert(upright.reduce((sum, value) => sum + value, 0) === problem.meta.answer, "digital board sum mismatch");
    assert(new Set(problem.visual.cells.map((cell) => cell.digit)).size === 9, "digital board digits repeat");
  } else if (family === "digital-related-addition") {
    const source = String(problem.meta.source).padStart(2, "0").split("").map(Number);
    const transformed = BOOK01_INTERNALS.transformDisplay(source, problem.meta.operation);
    assert(Number(transformed.join("")) === problem.meta.transformed, "related digital transform mismatch");
    assert(problem.meta.source !== problem.meta.transformed, "related digital addition repeats the same number");
    assert(problem.meta.source + problem.meta.transformed === problem.meta.answer, "related digital addition mismatch");
    assert(problem.visual.layout === problem.meta.layout, "related digital addition layout mismatch");
  }
}

function validateMagic(problem) {
  const { family } = problem.meta;
  if (family === "circle-magic") {
    const { nodes, center, lineSum, hidden, answer } = problem.meta;
    assert([[0,3],[1,4],[2,5]].every(([a,b]) => nodes[a] + center + nodes[b] === lineSum), "circle line sums mismatch");
    assert(nodes[hidden] === answer, "circle hidden answer mismatch");
  } else if (family === "cross-magic") {
    const { values, center, lineSum, hidden, answer } = problem.meta;
    assert(values[0] + center + values[1] === lineSum && values[2] + center + values[3] === lineSum, "cross line sums mismatch");
    assert(values[hidden] === answer, "cross hidden answer mismatch");
  } else if (family === "ring-lines") {
    const { nodes, lineSum, hidden, answer } = problem.meta;
    assert([[0,4],[1,5],[2,6],[3,7]].every(([a,b]) => nodes[a] + nodes[b] === lineSum), "ring line sums mismatch");
    assert(nodes[hidden] === answer, "ring hidden answer mismatch");
  }
}

function validateSumGrid(problem) {
  const { visual, meta } = problem;
  const sums = BOOK01_INTERNALS.gridSums(meta.values, visual.rows, visual.columns);
  assert(sums.rowSums.join() === visual.rowSums.join(), "sum-grid row sums mismatch");
  assert(sums.columnSums.join() === visual.columnSums.join(), "sum-grid column sums mismatch");
  const candidates = permutations(visual.cards.length ? visual.cards : meta.values)
    .filter((candidate) => {
      const candidateSums = BOOK01_INTERNALS.gridSums(candidate, visual.rows, visual.columns);
      return candidateSums.rowSums.join() === visual.rowSums.join()
        && candidateSums.columnSums.join() === visual.columnSums.join()
        && visual.shown.every((value, index) => value == null || candidate[index] === value);
    });
  assert(candidates.length === 1, `sum-grid answer count ${candidates.length}`);
  assert(candidates[0].join() === meta.values.join(), "sum-grid solution mismatch");
}

function validateEnumeration(problem) {
  const { minimum, maximum, targetSum, answers } = problem.meta;
  const expected = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index)
    .filter((value) => Math.floor(value / 10) + value % 10 === targetSum);
  assert(expected.join() === answers.join(), "digit-sum enumeration mismatch");
}

function validateSequence(problem) {
  const { values, step, hidden, answerValues } = problem.meta;
  assert(values.every((value, index) => index === 0 || value - values[index - 1] === step), "sequence step mismatch");
  assert(hidden.map((index) => values[index]).join() === answerValues.join(), "sequence answer mismatch");
}

function validateNewProblem(typeId, problem) {
  assert(problem && typeof problem === "object", `${typeId}: null problem`);
  assert(problem.prompt && problem.answer !== "" && problem.solution, `${typeId}: incomplete problem`);
  const visibleText = `${problem.prompt} ${problem.solution} ${JSON.stringify(problem.visual)}`;
  assert(!/[²³⁴⁵⁶⁷⁸⁹]|\b(permutation|combination)\b/i.test(visibleText), `${typeId}: age-inappropriate notation`);
  assert(!/뒤집기한|돌리기한|(?:서윤|민준|하린|가은|도윤|하은)는|(?:지우|민서|준호)은/.test(visibleText), `${typeId}: Korean surface form mismatch`);
  if (problem.visual?.kind === "book1") assert(book01Markup(problem.visual).trim().length > 30, `${typeId}: blank visual markup`);
  if (problem.answerVisual?.kind === "book1") assert(book01Markup(problem.answerVisual).trim().length > 30, `${typeId}: blank answer visual markup`);
  const family = problem.meta?.family || "";
  if (family.startsWith("shape-")) validateShapeTransform(problem);
  if (family.startsWith("partition-") || family === "symbol-partition") validatePartition(problem);
  if (family.startsWith("digital-")) validateDigital(problem);
  if (["circle-magic", "cross-magic", "ring-lines"].includes(family)) validateMagic(problem);
  if (["gakuro-card", "gakuro-grid"].includes(family)) validateSumGrid(problem);
  if (family === "digit-sum-enumeration") validateEnumeration(problem);
  if (family === "three-digit-step") validateSequence(problem);
  if (family.startsWith("place-value-")) assert(problem.meta.uniqueCount === 1, `${typeId}: place-value answer not unique`);
  if (["person-item-logic", "relative-order"].includes(family)) assert(problem.meta.uniqueCount === 1, `${typeId}: logic answer not unique`);
}

let generated = 0;
let minimumVariants = Infinity;
const newGeneratorNames = new Set(Object.keys(BOOK01_GENERATORS));
for (const typeId of typeIds) {
  const type = typeById(typeId);
  const generator = GENERATORS[type.generator];
  for (const difficulty of [1, 2, 3]) {
    const variants = new Set();
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      let problem = null;
      for (let retry = 0; retry < 400 && !problem; retry += 1) problem = generator({ difficulty, max: 30 });
      assert(problem, `${typeId} difficulty ${difficulty}: generator returned null`);
      assert(problem.prompt && problem.answer !== "" && problem.solution, `${typeId}: incomplete generated problem`);
      if (newGeneratorNames.has(type.generator)) validateNewProblem(typeId, problem);
      variants.add(JSON.stringify([problem.answer, problem.meta, problem.visual]));
      generated += 1;
    }
    const requiredVariants = Math.min(3, iterations);
    assert(variants.size >= requiredVariants, `${typeId} difficulty ${difficulty}: only ${variants.size} variants`);
    minimumVariants = Math.min(minimumVariants, variants.size);
  }
}

console.log(`BOOK01_AUDIT_OK types=${typeIds.length} difficulties=3 iterations=${iterations} generated=${generated} sourceQuestions=${sourceQuestionCount} minVariants=${minimumVariants}`);
