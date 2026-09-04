import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { BOOK01_GOLDEN_BELL_SOURCE_PAGES } from "./golden-bell-book01-source.js";
import { book01Markup } from "./book01-renderers.js";
import { guidedConceptVisual } from "./golden-bell-guided-experiences.js";

const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-01");
assert.ok(book, "book-01 is missing");

const expectedPages = [2,3,4,5,6,7,8,10,11,12,13,14,15,16,17,20,21,22,23,24,25,26,28,29,30,31,32,33,34];
const coveredPages = BOOK01_GOLDEN_BELL_SOURCE_PAGES.flatMap((entry) => entry.pages);
assert.deepEqual([...coveredPages].sort((a,b) => a-b), expectedPages, "Book 1 source-page coverage changed");
assert.equal(new Set(coveredPages).size, coveredPages.length, "Book 1 source page is assigned twice");
for (const entry of BOOK01_GOLDEN_BELL_SOURCE_PAGES) {
  assert.ok(["implemented", "partial", "pending"].includes(entry.status), `${entry.lessonId}: invalid source status`);
  if (entry.status !== "pending") assert.ok(book.lessons.some((lesson) => lesson.id === entry.lessonId), `${entry.lessonId}: covered lesson is missing`);
}

const lessons = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));
const expectedOrder = [
  "clock-turning", "mirror-reflection", "digital-turn-flip", "fold-one-cut", "equal-line-sums",
  "equal-line-placement", "gakuro-sum-grid", "number-inference", "preference-logic", "relative-order-running", "book1-equalize-transfer"
];
assert.deepEqual([...lessons.keys()], expectedOrder, "Book 1 lesson order changed");

function canonical(answer) {
  return String(Array.isArray(answer) ? answer[0] : answer).replace(/\s+/gu, "");
}

function item(lessonId, itemId) {
  const found = lessons.get(lessonId)?.original.items.find((candidate) => candidate.id === itemId);
  assert.ok(found, `${lessonId}/${itemId}: source item missing`);
  assert.ok(found.sourceNo && found.sourceLocator, `${lessonId}/${itemId}: source locator missing`);
  assert.ok(found.solution?.trim().length >= 24, `${lessonId}/${itemId}: worked solution missing`);
  if (found.visual?.kind === "book1") assert.ok(book01Markup(found.visual).trim().length > 40, `${lessonId}/${itemId}: blank visual`);
  return found;
}

const mirrorAnswers = ["2번", "2번", "3번", "3번"];
assert.deepEqual(lessons.get("mirror-reflection").original.items.map((entry) => canonical(entry.answer)), mirrorAnswers, "mirror answer lock changed");

const segmentMap = {
  "mirror-left-right": { 0:0, 1:1, 2:5, 5:2, 8:8 },
  "rotate-half": { 0:0, 1:1, 2:2, 5:5, 6:9, 8:8, 9:6 }
};
for (const entry of lessons.get("digital-turn-flip").original.items.filter((candidate) => candidate.visual?.subtype === "digital-transform")) {
  const source = entry.visual.digits[0];
  assert.equal(Number(canonical(entry.answer)), segmentMap[entry.visual.operation][source], `${entry.id}: digital transform mismatch`);
}
assert.deepEqual(item("digital-turn-flip", "flip-two-digit").parts.map((part) => Number(part.answer)), [81,51,12,25]);
assert.deepEqual(item("digital-turn-flip", "half-two-digit").parts.map((part) => Number(part.answer)), [81,21,52,19]);
assert.deepEqual(item("digital-turn-flip", "arithmetic-8-subtract").parts.map((part) => Number(part.answer)), [30,21,32,41,28]);

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, cursor) => cursor !== index)).map((rest) => [value, ...rest]));
}

function canPairWithSameSum(values) {
  if (!values.length) return true;
  const [first, ...rest] = values;
  for (let index = 0; index < rest.length; index += 1) {
    const target = first + rest[index];
    const remaining = rest.filter((_, cursor) => cursor !== index);
    const pairRest = (pool) => {
      if (!pool.length) return true;
      const [head, ...tail] = pool;
      return tail.some((value, cursor) => head + value === target && pairRest(tail.filter((_, inner) => inner !== cursor)));
    };
    if (pairRest(remaining)) return true;
  }
  return false;
}

for (const entry of lessons.get("equal-line-placement").original.items.filter((candidate) => candidate.id.includes("center"))) {
  const calculated = entry.visual.cards.filter((center) => canPairWithSameSum(entry.visual.cards.filter((value) => value !== center)));
  const official = canonical(entry.answer).split(",").map(Number);
  assert.deepEqual(official, calculated, `${entry.id}: possible intersection values differ from independent pairing`);
  const markup = book01Markup(entry.visual);
  const expectedNodes = entry.visual.cards.length;
  assert.equal((markup.match(/<circle /gu) || []).length, expectedNodes, `${entry.id}: rendered node count differs from card count`);
}

const lineGroups = {
  "t-shape": [[0,1,2],[2,3,4]],
  corner: [[0,1,2],[2,3,4]],
  triangle: [[0,1,3],[0,2,5],[3,4,5]]
};
for (const entry of lessons.get("equal-line-placement").original.items.filter((candidate) => candidate.id.startsWith("place-"))) {
  const values = [...entry.visual.shown];
  const answerValues = entry.parts.slice(0, -1).map((part) => Number(part.answer));
  values.forEach((value, index) => {
    if (value == null) values[index] = answerValues.shift();
  });
  assert.deepEqual([...values.filter((_, index) => entry.visual.shown[index] == null)].sort((a,b) => a-b), [...entry.visual.cards].sort((a,b) => a-b), `${entry.id}: cards are not used exactly once`);
  const sums = lineGroups[entry.visual.layout].map((indexes) => indexes.reduce((sum, index) => sum + values[index], 0));
  assert.ok(sums.every((sum) => sum === entry.visual.lineSum), `${entry.id}: completed lines do not all equal ${entry.visual.lineSum}`);
  assert.equal(Number(entry.parts.at(-1).answer), entry.visual.lineSum, `${entry.id}: written line sum differs from visual`);
}

const digitSumItem = item("equal-line-placement", "digit-sum-table");
for (const part of digitSumItem.parts) {
  const target = Number(part.id.replace("sum", ""));
  const calculated = Array.from({ length: 90 }, (_, index) => index + 10).filter((value) => Math.floor(value / 10) + value % 10 === target);
  const official = canonical(part.answer).split(",").map(Number);
  assert.deepEqual(official, calculated, `${part.id}: digit-sum enumeration mismatch`);
}
assert.equal(canonical(digitSumItem.parts.at(-1).answer).split(",").length, 9, "sum10 must contain nine two-digit numbers");
assert.match(digitSumItem.sourceDiscrepancy, /10개.*9개/u, "sum10 source discrepancy note missing");

for (const entry of lessons.get("gakuro-sum-grid").original.items.filter((candidate) => candidate.visual?.subtype === "sum-grid")) {
  const { shown, cards, rows, columns, rowSums, columnSums } = entry.visual;
  const blanks = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const solutions = permutations(cards).filter((values) => {
    const grid = [...shown];
    blanks.forEach((index, cursor) => { grid[index] = values[cursor]; });
    return rowSums.every((sum, row) => grid.slice(row * columns, (row + 1) * columns).reduce((total, value) => total + value, 0) === sum)
      && columnSums.every((sum, column) => Array.from({ length: rows }, (_, row) => grid[row * columns + column]).reduce((total, value) => total + value, 0) === sum);
  });
  assert.equal(solutions.length, 1, `${entry.id}: expected one sum-grid solution, received ${solutions.length}`);
  assert.deepEqual(entry.parts.map((part) => Number(part.answer)), solutions[0], `${entry.id}: official grid answer and calculation differ`);
}

const numberLocks = {
  "digit-count-2": "2", "digit-count-4": "3", "two-sum-3": "12,21,30", "two-sum-6": "15,24,33,42,51,60",
  "two-sum-4-odd": "13,31", "two-sum-7-gap": "52", "two-gap-7-odd": "81", "two-over-60-odd": "79",
  "three-descend-3": "963,852,741,630", "three-descend-2": "975,864,753,642,531,420",
  "three-descend-2-eight": "864", "three-ascend-1-small-sum": "123", "three-odd-sum-11": "137", "three-363": "363"
};
for (const [id, answer] of Object.entries(numberLocks)) assert.equal(canonical(item("number-inference", id).answer), answer, `${id}: answer lock changed`);
const placeDiscrepancy = item("number-inference", "place-2365");
assert.deepEqual(placeDiscrepancy.parts.map((part) => Number(part.answer)), [2365,2], "2365 place-value calculation changed");
assert.match(placeDiscrepancy.sourceDiscrepancy, /독립 계산.*2/u, "2365 source discrepancy note missing");

assert.deepEqual(lessons.get("relative-order-running").experience.model.answer, ["B","D","C","A"], "relative-order concept order changed");
assert.equal(canonical(item("preference-logic", "logic-4").answer), "사자", "preference logic item 4 answer changed");
assert.equal(canonical(item("relative-order-running", "standing-back-third").answer), "D");
for (const entry of lessons.get("book1-equalize-transfer").original.items) {
  const numbers = entry.prompt.match(/\d+/gu).map(Number);
  assert.equal(Number(canonical(entry.answer)), (numbers[0] - numbers[1]) / 2, `${entry.id}: transfer answer mismatch`);
}

for (const lesson of book.lessons.filter((candidate) => candidate.experience?.kind === "guided-concept")) {
  const finalMarkup = guidedConceptVisual(lesson.experience, lesson.experience.beats.length - 1);
  assert.ok(finalMarkup.trim().length > 80, `${lesson.id}: guided final visual is blank`);
}

const statusCounts = BOOK01_GOLDEN_BELL_SOURCE_PAGES.reduce((counts, entry) => {
  counts[entry.status] = (counts[entry.status] || 0) + entry.pages.length;
  return counts;
}, {});
assert.deepEqual(statusCounts, { implemented: 21, partial: 4, pending: 4 }, "Book 1 source status totals changed");
console.log(`BOOK01_GOLDEN_BELL_SOURCE_OK lessons=${book.lessons.length} sourceItems=${book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0)} pages=${coveredPages.length} implemented=${statusCounts.implemented} partial=${statusCounts.partial} pending=${statusCounts.pending}`);
