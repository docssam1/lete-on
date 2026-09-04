import assert from "node:assert/strict";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { book10Markup } from "./book10-renderers.js";

const book = GOLDEN_BELL_BOOKS.find((candidate) => candidate.id === "book-10");
const lessons = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));
const expectedOrder = [
  "napier-multiplication",
  "even-consecutive-sum",
  "consecutive-page-range",
  "catch-up-acorns",
  "digit-card-four-place",
  "number-baseball-secret",
  "number-digit-range-count"
];

assert.deepEqual(book.lessons.map((lesson) => lesson.id), expectedOrder, "Book 10 activity order changed");
assert.equal(book.source?.verified, true, "Book 10 teacher source is not marked verified");
assert.match(book.source.note, /별도 골든벨 원본 없음/u, "Book 10 reconstruction boundary is missing");

const answerOf = (item) => item.parts?.length ? item.parts.map((part) => String(part.answer)) : String(item.answer);
const expectedAnswers = new Map([
  ["napier-multiplication", ["1610", "53382", "900", "4200", "1938"]],
  ["even-consecutive-sum", ["60", "105", "90", "126"]],
  ["consecutive-page-range", ["10", "15"]],
  ["catch-up-acorns", [
    ["11", "7", "4"], ["5", "3", "2"], ["6", "3"], ["2"], ["30"], ["40"],
    ["15", "2", "5", "8"], ["4", "7", "9"], ["21"], ["15"], ["6", "480"],
    ["6", "12000"], ["6", "36"], ["6", "72"], ["6"], ["5"], ["7"], ["7"]
  ]],
  ["digit-card-four-place", ["6", "24", "10"]],
  ["number-baseball-secret", ["634"]],
  ["number-digit-range-count", [["19", "38"], "1389", "855"]]
]);

for (const [lessonId, expected] of expectedAnswers) {
  const lesson = lessons.get(lessonId);
  assert.ok(lesson, `${lessonId}: source lesson missing`);
  assert.deepEqual(lesson.original.items.map(answerOf), expected, `${lessonId}: teacher-answer lock changed`);
  assert.ok(lesson.original.items.every((item) => item.sourceLocator?.trim()), `${lessonId}: page locator missing`);
  assert.ok(lesson.original.items.every((item) => item.solution?.trim().length >= 20), `${lessonId}: worked solution missing`);
  assert.ok(lesson.experience?.beats?.length >= 3, `${lessonId}: concept animation is incomplete`);
  assert.ok(new Set(lesson.experience.beats.map((beat) => JSON.stringify(beat.visual || beat.caption))).size >= 3, `${lessonId}: concept animation repeats one scene`);
  assert.equal(new Set(lesson.experience.check.options).size, 3, `${lessonId}: concept check choices repeat`);
  assert.equal(lesson.experience.check.options.filter((choice) => choice === lesson.experience.check.answer).length, 1, `${lessonId}: concept answer is not uniquely visible`);
}

const multiply = lessons.get("napier-multiplication").original.items;
for (const item of multiply) {
  const { first, second } = item.visual;
  assert.equal(Number(item.answer), first * second, `${item.id}: multiplication answer is wrong`);
}

const evenSums = lessons.get("even-consecutive-sum").original.items;
for (const item of evenSums) {
  const { from, to } = item.visual;
  const direct = Array.from({ length: to - from + 1 }, (_, index) => from + index).reduce((sum, value) => sum + value, 0);
  assert.equal(Number(item.answer), direct, `${item.id}: consecutive-sum answer is wrong`);
  assert.equal((to - from + 1) % 2, 0, `${item.id}: even-count type contains an odd number of terms`);
}

const pageRange = lessons.get("consecutive-page-range");
const firstPage = Number(pageRange.original.items[0].answer);
const lastPage = Number(pageRange.original.items[1].answer);
assert.equal(lastPage - firstPage + 1, pageRange.original.visual.count, "page-range count is wrong");
assert.equal(Array.from({ length: pageRange.original.visual.count }, (_, index) => firstPage + index).reduce((sum, value) => sum + value, 0), pageRange.original.visual.total, "page-range sum is wrong");

const digitCards = lessons.get("digit-card-four-place").original.items;
assert.equal(Number(digitCards[0].answer), 3 * 2 * 1, "fixed-first arrangement count is wrong");
assert.equal(Number(digitCards[1].answer), 4 * 3 * 2 * 1, "four-card arrangement count is wrong");
assert.equal(Number(digitCards[2].answer), 10, "five-choose-three increasing count is wrong");

function baseballScore(secret, guess) {
  const secretDigits = String(secret).split("");
  const guessDigits = guess.map(String);
  const strikes = guessDigits.filter((digit, index) => secretDigits[index] === digit).length;
  const balls = guessDigits.filter((digit, index) => secretDigits[index] !== digit && secretDigits.includes(digit)).length;
  return { strikes, balls };
}

const baseball = lessons.get("number-baseball-secret").original;
const baseballCandidates = [];
for (let value = 123; value <= 987; value += 1) {
  const digits = String(value).split("");
  if (digits.includes("0") || new Set(digits).size !== 3) continue;
  if (baseball.visual.clues.every((clue) => {
    const score = baseballScore(value, clue.guess);
    return score.strikes === clue.strikes && score.balls === clue.balls;
  })) baseballCandidates.push(String(value));
}
assert.deepEqual(baseballCandidates, ["634"], "number-baseball source does not have one answer");

const countWrittenDigits = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => String(from + index).length).reduce((sum, length) => sum + length, 0);
const digitCountItems = lessons.get("number-digit-range-count").original.items;
assert.equal(35 - 17 + 1, Number(digitCountItems[0].parts[0].answer), "17-35 number count is wrong");
assert.equal(countWrittenDigits(17, 35), Number(digitCountItems[0].parts[1].answer), "17-35 written-digit count is wrong");
assert.equal(countWrittenDigits(1, 499), Number(digitCountItems[1].answer), "1-499 written-digit count is wrong");
assert.equal(countWrittenDigits(1, 321), Number(digitCountItems[2].answer), "1-321 written-digit count is wrong");

const visuals = book.lessons.flatMap((lesson) => [
  ...lesson.experience.beats.map((beat) => beat.visual),
  lesson.original.visual,
  ...lesson.original.items.map((item) => item.visual),
  lesson.extension.visual,
  ...(lesson.similarPractice || []).map((item) => item.visual)
]).filter((visual) => visual?.kind === "book10");
for (const visual of visuals) {
  const markup = book10Markup(visual);
  assert.ok(markup.length >= 40, `${visual.subtype}: renderer returned an empty scene`);
  assert.doesNotMatch(markup, /undefined|NaN/u, `${visual.subtype}: renderer emitted an invalid value`);
}

console.log(`GOLDEN_BELL_BOOK10_SOURCE_OK lessons=${book.lessons.length} sourceItems=${book.lessons.reduce((sum, lesson) => sum + lesson.original.items.length, 0)} visuals=${visuals.length} baseballAnswers=${baseballCandidates.length}`);
