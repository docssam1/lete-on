import assert from "node:assert/strict";
import {
  COURSE03_A1_COMPLEX_FRACTION_LESSON,
  course03ComplexFractionConceptMarkup,
  continuedFractionTerms,
  divideFractions,
  formatContinuedTerms,
  fractionFromContinuedTerms,
  reduceFraction
} from "./golden-bell-course03-complex-fraction-lesson.js";

const lesson = COURSE03_A1_COMPLEX_FRACTION_LESSON;
const items = [...lesson.original.items, lesson.extension, ...lesson.similarPractice];
const forbidden = new Set(["answer", "solution", "answers", "solutions", "officialAnswer", "workedSolution", "sourcePath", "fingerprint"]);
const keys = value => value && typeof value === "object" ? Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)]) : [];

assert.equal(lesson.experience.tracks.length, 2);
assert.equal(lesson.experience.tracks.every(track => track.beats.length === 4), true);
assert.equal(lesson.original.items.length, 4);
assert.equal(items.length, 10);
assert.equal(new Set(items.map(item => item.id)).size, 10);
assert.equal(new Set(items.map(item => item.answerRef)).size, 10);
assert.equal(items.every(item => item.answerMode === "input" && item.inputMode === "text"), true);
assert.equal(keys(lesson).filter(key => forbidden.has(key)).length, 0);

assert.deepEqual(continuedFractionTerms(7, 16), [0, 2, 3, 2]);
assert.equal(formatContinuedTerms(7, 16), "2,3,2");
assert.deepEqual(continuedFractionTerms(47, 14), [3, 2, 1, 4]);
assert.deepEqual(divideFractions({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }), { numerator: 5, denominator: 6 });

for (let denominator = 1; denominator <= 30; denominator += 1) {
  for (let numerator = 1; numerator <= 90; numerator += 1) {
    const reduced = reduceFraction(numerator, denominator);
    const restored = fractionFromContinuedTerms(continuedFractionTerms(numerator, denominator));
    assert.deepEqual(restored, reduced);
  }
}

for (const visual of [...lesson.experience.tracks.flatMap(track => track.beats.map(beat => beat.visual)), ...items.map(item => item.visual)]) {
  const markup = course03ComplexFractionConceptMarkup(visual);
  assert.match(markup, /course03-complex-visual/);
  assert.doesNotMatch(markup, /undefined|NaN|\[object Object\]/);
}

console.log("COURSE03_COMPLEX_FRACTION_AUDIT_OK tracks=2 beats=8 items=10 rationalCases=2700");
