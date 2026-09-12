import assert from "node:assert/strict";
import { COURSE23_PILOT_BOOKS } from "./golden-bell-course23-data.js";
import { firstWhiteExceedsStage, stageForWhiteCount, stoneStageModel } from "./golden-bell-course02-stone-growth-lesson.js";
import { course02MultiPatternAnswer } from "./golden-bell-course02-multi-pattern-lesson.js";
import { course02WindmillAnswer } from "./golden-bell-course02-windmill-pattern-lesson.js";
import { course02CycleTotalAnswer } from "./golden-bell-course02-cycle-total-lesson.js";
import { countSolutions, firstSolution } from "./golden-bell-course03-lcm-remainder-lesson.js";
import { divideFractions, formatContinuedTerms, formatFraction } from "./golden-bell-course03-complex-fraction-lesson.js";
import { courseConceptMarkup } from "./golden-bell-course-concepts.js";

const forbidden = new Set(["answer", "solution", "privateAnswer", "workedSolution", "workedSteps", "evidence", "sourcePath", "fingerprint"]);
const keys = value => value && typeof value === "object" ? Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)]) : [];
const expectedPattern = position => ["세모", "네모", "동그라미", "네모"][(position - 1) % 4];
const expectedDivision = (divisor, minimum, maximum) => Array.from({ length: divisor - 1 }, (_, i) => (divisor + 1) * (i + 1)).filter(n => n >= minimum && n <= maximum).length;
const expectedAnswer = (item) => {
  const visual = item.visual;
  if (visual.kind === "course-pattern") return expectedPattern(visual.position);
  if (visual.kind === "course-division") return expectedDivision(visual.divisor, visual.minimum, visual.maximum);
  if (visual.kind === "regular-polygon-points") return visual.task === "points-per-side" ? visual.pointsPerSide : visual.sides * (visual.pointsPerSide - 1);
  if (visual.kind === "polygon-transfer") {
    const total = visual.fromSides * (visual.fromPointsPerSide - 1);
    assert.equal(total % visual.toSides, 0, `${item.id}: non-integral transfer`);
    return total / visual.toSides + 1;
  }
  if (visual.kind === "course03-remainder-sequence") return visual.start + visual.step * (visual.position - 1);
  if (visual.kind === "course03-remainder-range") {
    let count = 0;
    for (let value = visual.start; value <= visual.upper; value += visual.step) if (value >= visual.lower) count += 1;
    return count;
  }
  if (visual.kind === "course02-stone-growth") {
    const model = stoneStageModel(visual.stage);
    if (visual.task === "count-black") return model.blackCount;
    if (visual.task === "count-white") return model.whiteCount;
    if (visual.task === "difference-color") return model.difference;
    if (visual.task === "first-white-exceeds") return firstWhiteExceedsStage();
    if (visual.task === "crossover-previous") return firstWhiteExceedsStage() - 1;
    if (visual.task === "reverse-white-count") return stageForWhiteCount(visual.targetWhiteCount);
  }
  if (visual.kind === "course03-lcm-remainder") {
    return visual.taskKind === "inclusive-range-count"
      ? countSolutions(visual.conditions, visual.lower, visual.upper)
      : firstSolution(visual.conditions, visual.lower);
  }
  if (visual.kind === "course02-counterfeit-coins") {
    const answers = {
      first: 3, "level-first": 3, "pair-light-left": 7, "tilt-group": 3,
      "remaining-pair": 1, "pair-level": 9, "pair-light-right": 8,
      "tilt-right": 2, minimum: 2
    };
    assert(Object.hasOwn(answers, visual.task), `${item.id}: unknown counterfeit task`);
    return answers[visual.task];
  }
  if (visual.kind === "course02-multi-pattern") return course02MultiPatternAnswer(visual);
  if (visual.kind === "course02-windmill-pattern") return course02WindmillAnswer(visual);
  if (visual.kind === "course02-cycle-total") return course02CycleTotalAnswer(visual);
  if (visual.kind === "course03-complex-fraction") {
    return visual.task === "divide"
      ? formatFraction(divideFractions(visual.top, visual.bottom))
      : formatContinuedTerms(visual.numerator, visual.denominator);
  }
  throw new Error(`Unknown pilot visual: ${visual.kind}`);
};
const ids = new Set(); const refs = new Set();
let practiceCount = 0; let calculatedAnswerCount = 0;
assert.equal(COURSE23_PILOT_BOOKS.length, 2);
assert.deepEqual(COURSE23_PILOT_BOOKS.map(book => book.id), ["course-02-a1", "course-03-a1"]);
assert.equal(new Set(COURSE23_PILOT_BOOKS.map(book => book.id)).size, 2);
for (const book of COURSE23_PILOT_BOOKS) {
  assert.equal(book.status, "pilot"); assert.equal(book.source.origin, "textbook-derived");
  assert.equal(book.lessons.length, book.courseId === "course-02" ? 7 : 4);
  for (const [lessonIndex, lesson] of book.lessons.entries()) {
    assert.equal(lesson.experience.kind, "course-concept");
    assert.equal(lesson.experience.tracks.length, 2);
    assert.equal(lesson.experience.tracks.every(track => track.beats.length === 4), true);
    if (lessonIndex === 0) {
      assert.equal(lesson.experience.beats, lesson.experience.tracks[0].beats);
      assert.equal(lesson.experience.openingPrompt, lesson.experience.tracks[0].openingPrompt);
      assert.equal(lesson.experience.hint, lesson.experience.tracks[0].hint);
    } else {
      assert.equal(lesson.learnerStage, `필즈 더 클래식 ${book.courseId === "course-02" ? "2" : "3"}과정 A1; 연령 미확정`);
    }
    for (const item of [...lesson.original.items, lesson.extension, ...lesson.similarPractice]) {
      practiceCount++; assert(!ids.has(item.id)); ids.add(item.id); assert(!refs.has(item.answerRef)); refs.add(item.answerRef);
      const calculated = expectedAnswer(item);
      assert.notEqual(calculated, null, `${item.id}: no calculated answer`);
      assert.notEqual(calculated, undefined, `${item.id}: no calculated answer`);
      assert.equal(Array.isArray(calculated), false, `${item.id}: public pilot expects one answer`);
      calculatedAnswerCount += 1;
    }
  }
}
const publicKeys = keys(COURSE23_PILOT_BOOKS);
assert.equal(publicKeys.filter(key => forbidden.has(key)).length, 0);
assert.equal(publicKeys.filter(key => /^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(key)).length, 0);
const patternPreview = courseConceptMarkup(COURSE23_PILOT_BOOKS[0].lessons[0].experience.tracks[0].beats[1].visual);
assert.equal((patternPreview.match(/data-cycle-part="full"/g) || []).length, 2);
assert.equal((patternPreview.match(/data-cycle-part="partial"/g) || []).length, 1);
assert.match(patternPreview, /다음 마디의 앞 2개/);
assert.equal((patternPreview.match(/<span><b>/g) || []).length, 10);
assert.equal(practiceCount, 110); assert.equal(calculatedAnswerCount, practiceCount);
console.log(`COURSE23 pilot public audit passed: books=2 lessons=11 tracks=22 beats=88 practice=110 uniqueIds=${ids.size} uniqueRefs=${refs.size} calculatedAnswers=${calculatedAnswerCount} publicForbiddenKeys=0`);
