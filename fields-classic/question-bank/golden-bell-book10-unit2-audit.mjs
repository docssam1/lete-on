import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

const lesson = GOLDEN_BELL_BOOKS
  .find((book) => book.id === "book-10")
  ?.lessons.find((candidate) => candidate.id === "catch-up-acorns");

assert.ok(lesson, "book-10 unit 2 Golden Bell lesson is missing");
assert.equal(lesson.original.mode, "paged", "book-10 unit 2 must use one-question-at-a-time practice");
assert.equal(lesson.original.items.length, 18, "source Q1(1), Q1(2), and Q2-Q17 must all be present");
assert.deepEqual([...new Set(lesson.original.items.map((item) => item.printGroup))], [1, 2, 3, 4, 5, 6, 7, 8, 9], "source page groups changed");

const expected = new Map([
  ["unit2-q01-1", ["11", "7", "4"]], ["unit2-q01-2", ["5", "3", "2"]],
  ["unit2-q02", ["6", "3"]], ["unit2-q03", ["2"]], ["unit2-q04", ["30"]],
  ["unit2-q05", ["40"]], ["unit2-q06", ["15", "2", "5", "8"]],
  ["unit2-q07", ["4", "7", "9"]], ["unit2-q08", ["21"]], ["unit2-q09", ["15"]],
  ["unit2-q10", ["6", "480"]], ["unit2-q11", ["6", "12000"]],
  ["unit2-q12", ["6", "36"]], ["unit2-q13", ["6", "72"]],
  ["unit2-q14", ["6"]], ["unit2-q15", ["5"]], ["unit2-q16", ["7"]], ["unit2-q17", ["7"]]
]);

for (const item of lesson.original.items) {
  assert.ok(expected.has(item.id), `${item.id}: unapproved source item`);
  assert.ok(item.sourceNo && item.sourceLocator && item.typeLabel && item.structureKey, `${item.id}: source/type evidence missing`);
  assert.equal(item.visual?.kind, "book10", `${item.id}: source-faithful visual missing`);
  assert.ok(item.solution?.length >= 40 && /(?:=|나누|빼|더)/u.test(item.solution), `${item.id}: worked solution missing`);
  assert.deepEqual(item.parts.map((part) => String(part.answer)), expected.get(item.id), `${item.id}: official answer changed`);
}

function solveTwoEquations(equations) {
  const [[a, b], [c, d]] = equations.map((equation) => equation.terms);
  const [first, second] = equations.map((equation) => equation.total);
  const determinant = a * d - b * c;
  assert.notEqual(determinant, 0, "two-equation visual is not determinate");
  return [(first * d - b * second) / determinant, (a * second - first * c) / determinant];
}

for (const item of lesson.original.items.filter((candidate) => candidate.visual.subtype === "quantity-equations")) {
  const solved = solveTwoEquations(item.visual.equations);
  const answers = item.parts.map((part) => Number(part.answer));
  if (item.id === "unit2-q01-1" || item.id === "unit2-q01-2") {
    assert.deepEqual(answers, [solved[0] + solved[1], ...solved], `${item.id}: combine-and-divide answers do not match visual`);
  } else if (item.id === "unit2-q02") {
    assert.deepEqual(answers, solved, `${item.id}: elimination answers do not match visual`);
  } else if (item.id === "unit2-q04") {
    assert.equal(answers[0], solved[1], `${item.id}: requested bead answer does not match visual`);
  } else if (item.id === "unit2-q05") {
    assert.equal(answers[0], solved[0], `${item.id}: requested cup answer does not match visual`);
  }
}

for (const item of lesson.original.items.filter((candidate) => candidate.visual.subtype === "pair-sum-list")) {
  const [ab, bc, ca] = item.visual.pairSums;
  const total = (ab + bc + ca) / 2;
  const values = [total - bc, total - ca, total - ab];
  const answers = item.parts.map((part) => Number(part.answer));
  if (item.id === "unit2-q06") assert.deepEqual(answers, [total, ...values], `${item.id}: pair-sum answers changed`);
  else if (item.id === "unit2-q07") assert.deepEqual(answers, values, `${item.id}: shape values changed`);
  else if (item.id === "unit2-q08") assert.equal(answers[0], values[2], `${item.id}: C answer changed`);
  else if (item.id === "unit2-q09") assert.equal(answers[0], values[1], `${item.id}: middle person answer changed`);
}

const target = lesson.original.items.find((item) => item.id === "unit2-q03");
const [attemptA, attemptB] = target.visual.attempts;
const targetValues = solveTwoEquations([
  { terms: attemptA.hits, total: attemptA.total },
  { terms: attemptB.hits, total: attemptB.total }
]);
assert.equal(targetValues[1], Number(target.parts[0].answer), "target score is not uniquely determined");

const catchUpExpected = new Map([["unit2-q14", 6], ["unit2-q15", 5], ["unit2-q16", 7], ["unit2-q17", 7]]);
for (const [id, answer] of catchUpExpected) {
  const item = lesson.original.items.find((candidate) => candidate.id === id);
  const [firstStart, secondStart] = item.visual.starts;
  const [firstChange, secondChange] = item.visual.changes;
  const time = (secondStart - firstStart) / (firstChange - secondChange);
  assert.equal(time, answer, `${id}: catch-up calculation changed`);
}

assert.equal(480 / 80, 6, "closed-spacing source calculation failed");
assert.equal(2000 * 6, 1200 * (6 + 4), "price/count source calculation failed");
assert.equal(6 * 6, 4 * (6 + 3), "candy sharing source calculation failed");
assert.equal(12 * 6, 9 * (6 + 2), "card sharing source calculation failed");

console.log("GOLDEN_BELL_BOOK10_UNIT2_OK sourceQuestions=17 cards=18 printPages=9 unique=18");
