"use strict";
const assert = require("node:assert/strict");
const e44 = require("./source-5-2-rounded-range-e44.js");
const years = [2005, 2006, 2007, 2008, 2009, 2010];
function expectedRange(maleHundreds, femaleHundreds) {
  const maleValues = Array.from({ length: 100 }, (_, i) => maleHundreds * 100 - 50 + i);
  const femaleValues = Array.from({ length: 100 }, (_, i) => femaleHundreds * 100 + i);
  const differences = maleValues.flatMap(male => femaleValues.map(female => male - female));
  return [Math.min(...differences), Math.max(...differences)];
}
const sourceFemale = [56, 58, 63, 61, 66, 70];
const sourceMale = [51, 55, 62, 68, 62, 72];
const gaps = sourceMale.map((value, i) => Math.abs(value - sourceFemale[i]));
assert.deepEqual(gaps, [5, 3, 1, 7, 4, 2]);
assert.equal(years[gaps.indexOf(Math.max(...gaps))], 2008);
assert.deepEqual(expectedRange(68, 61), [551, 749]);
const sourceAnswer = "550명 초과 750명 미만";
assert.equal(Math.floor((551 - 1) / 50) * 50, 550);
assert.equal(Math.ceil((749 + 1) / 50) * 50, 750);
const observations = [];
for (let variant = 0; variant < e44.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const q = e44.getQuestion(variant, difficulty);
  assert.ok(q, `unique maximum ${variant}/${difficulty}`);
  const { female, male, gaps: actualGaps } = q.questionModel;
  assert.equal(actualGaps.length, 6);
  assert.equal(actualGaps.reduce((max, value) => Math.max(max, value), -Infinity), Math.max(...actualGaps));
  assert.equal(actualGaps.filter(value => value === Math.max(...actualGaps)).length, 1);
  const yearIndex = years.indexOf(q.answerModel.year);
  assert.deepEqual(expectedRange(male[yearIndex], female[yearIndex]), [q.answerModel.minimum, q.answerModel.maximum]);
  observations.push({ variant, difficulty, year: q.answerModel.year, maximumGapHundreds: actualGaps[yearIndex], answer: q.answer });
}
assert.match(e44.getQuestion(0, 0).prompt, /class="male-line"/);
assert.equal(e44.getQuestion(0, 0).answerVisualRequired, true);
console.log(JSON.stringify({ status: "passed", sourceYearGapsHundreds: gaps, sourceMaximumYear: 2008, sourceActualDifferenceRange: "551-749", sourceAnswer, syntheticConfigurations: observations.length, observations }, null, 2));
