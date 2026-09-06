import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { GOLDEN_BELL_RECOVERY } from "./golden-bell-recovery-data.js";
import { appendProtectedRecoveryItems } from "./golden-bell-recovery.js";
import { hasProtectedAnswer, hydrateProtectedAnswers } from "./golden-bell-protected.js";

assert.ok(process.env.FIELDS_PRIVATE_ANSWER_BANK, "A private answer bank is required");
const bank = JSON.parse(await readFile(process.env.FIELDS_PRIVATE_ANSWER_BANK, "utf8"));
let added = 0;
const visit = (value) => {
  if (typeof value === "string") assert.doesNotMatch(value, /(?:[A-Za-z]:[\\/]|file:\/\/)/);
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.doesNotMatch(key, /^(?:answer|solution|privateAnswer|workedSolution|workedSteps|evidence|sourcePath)$/);
    visit(child);
  }
};
visit(GOLDEN_BELL_RECOVERY);
function verifyMatrixTarget(visual, answer) {
  const symbols = [...new Set(visual.cells.flat())];
  assert.equal(symbols.length, 4);
  const equations = [];
  const add = (cells, total) => {
    if (total !== null) equations.push({ row: symbols.map(symbol => cells.filter(cell => cell === symbol).length), total });
  };
  visual.cells.forEach((row, index) => add(row, visual.rowTotals[index]));
  visual.columnTotals.forEach((total, index) => add(visual.cells.map(row => row[index]), total));
  const determinant = matrix => matrix.length === 1 ? matrix[0][0] : matrix[0].reduce((sum, coefficient, column) => sum + (column % 2 ? -1 : 1) * coefficient * determinant(matrix.slice(1).map(row => row.filter((_, index) => index !== column))), 0);
  // A nonzero determinant proves uniqueness over all real values, not just a sampled integer range.
  let independent;
  for (let a = 0; a < equations.length && !independent; a += 1) {
    for (let b = a + 1; b < equations.length && !independent; b += 1) {
      for (let c = b + 1; c < equations.length && !independent; c += 1) {
        for (let d = c + 1; d < equations.length && !independent; d += 1) {
          const selected = [a, b, c, d].map(index => equations[index]);
          if (determinant(selected.map(equation => equation.row))) independent = selected;
        }
      }
    }
  }
  assert.ok(independent, "Source matrix does not uniquely determine its symbols");
  const denominator = determinant(independent.map(equation => equation.row));
  const values = symbols.map((_, column) => determinant(independent.map(equation => equation.row.map((coefficient, index) => index === column ? equation.total : coefficient))) / denominator);
  for (const equation of equations) assert.equal(equation.row.reduce((sum, coefficient, index) => sum + coefficient * values[index], 0), equation.total, "Source matrix conditions conflict");
  const targetColumn = visual.columnTotals.indexOf(null);
  assert.ok(targetColumn >= 0);
  assert.equal(String(visual.cells.reduce((sum, row) => sum + values[symbols.indexOf(row[targetColumn])], 0)), answer);
}
function verifyShapeEquationTarget(visual, answer) {
  const equations = visual.scales
    ? visual.scales.map(scale => ({ symbols: scale.rows.flat().join(""), total: Number(scale.total.replace(/g$/, "")) }))
    : visual.equations.map(equation => {
        const match = equation.match(/^([○□ +]+)\s*=\s*(\d+)$/u);
        assert.ok(match, "Unsupported recovery equation; do not guess its meaning");
        return { symbols: match[1], total: Number(match[2]) };
      });
  assert.equal(equations.length, 2);
  const [first, second] = equations.map(({ symbols, total }) => ({ circle: [...symbols].filter(symbol => symbol === "○").length, square: [...symbols].filter(symbol => symbol === "□").length, total }));
  const determinant = first.circle * second.square - second.circle * first.square;
  assert.notEqual(determinant, 0, "Shape equations must determine one target, not just one sampled answer");
  const square = (first.circle * second.total - second.circle * first.total) / determinant;
  assert.equal(String(square), answer);
}
for (const group of GOLDEN_BELL_RECOVERY) {
  const baseline = GOLDEN_BELL_BOOKS.find((book) => book.id === group.bookId);
  const refs = group.updates.flatMap((update) => update.items.map((item) => item.answerRef));
  assert.equal(new Set(refs).size, refs.length);
  const records = bank.books[group.bookId];
  const missing = structuredClone(records);
  delete missing[refs.at(-1)];
  const incomplete = structuredClone(records);
  delete incomplete[refs[0]].solution;
  const malformed = structuredClone(records);
  malformed[refs[0]].answer = "";
  for (const variant of [{}, missing, incomplete, malformed]) {
    const book = structuredClone(baseline);
    const result = appendProtectedRecoveryItems(book, variant);
    assert.equal(result.added, 0);
    assert.deepEqual(book, baseline, "A missing answer must not partially change the book");
  }
  const book = structuredClone(baseline);
  hydrateProtectedAnswers(book, records);
  const oldItems = book.lessons.map((lesson) => structuredClone(lesson.original.items));
  const result = appendProtectedRecoveryItems(book, records);
  assert.equal(result.status, "ready");
  assert.equal(result.added, refs.length);
  book.lessons.forEach((lesson, index) => assert.deepEqual(lesson.original.items.slice(0, oldItems[index].length), oldItems[index], "Existing source questions were changed"));
  for (const update of group.updates) {
    const lesson = book.lessons.find((entry) => entry.id === update.lessonId);
    const oldCount = baseline.lessons.find((entry) => entry.id === update.lessonId).original.sourceQuestionCount;
    if (Number.isInteger(oldCount)) assert.equal(lesson.original.sourceQuestionCount, oldCount + update.items.length);
    for (const item of update.items) {
      const addedItem = lesson.original.items.find((entry) => entry.id === item.id);
      assert.ok(hasProtectedAnswer(addedItem));
      assert.ok(addedItem.solution.length >= 40);
      assert.equal(addedItem.parts, undefined, "Do not turn solution steps into questions");
      if (item.visual?.subtype === "source-sum-matrix") verifyMatrixTarget(item.visual, addedItem.answer);
      if (["symbol-equations", "source-weight-scales"].includes(item.visual?.subtype)) verifyShapeEquationTarget(item.visual, addedItem.answer);
      if (item.visual?.subtype === "source-balance-equations") {
        const values = new Set();
        const weight = (load, units) => Object.entries(load).reduce((sum, [symbol, count]) => sum + count * units[symbol], 0);
        for (let a = 1; a <= 12; a += 1) {
          for (let b = 1; b <= 60; b += 1) {
            for (let c = 1; c <= 60; c += 1) {
              const units = { "가": a, "나": b, "다": c };
              if (item.visual.equations.slice(0, 2).every(equation => weight(equation.left, units) === weight(equation.right, units))) {
                values.add(weight(item.visual.equations[2].left, units) / a);
              }
            }
          }
        }
        assert.equal(values.size, 1, "Balance target must be unique independently of marble weights");
        assert.equal(String([...values][0]), addedItem.answer);
      }
    }
  }
  assert.equal(appendProtectedRecoveryItems(book, records).added, 0, "Repeat hydration must not duplicate questions");
  added += result.added;
}
console.log(`GOLDEN_BELL_RECOVERY_OK books=${GOLDEN_BELL_RECOVERY.length} added=${added} privacy=pass partial-payload=preserved-baseline`);
