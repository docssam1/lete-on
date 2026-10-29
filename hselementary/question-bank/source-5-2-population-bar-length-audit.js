"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-population-bar-length.js");
const sourceItemId = "5-2-u1-e3-mission-5-bar-graph-length";
const sourcePopulations = [3434091, 2956513, 1486647];
const sourceRounded = [3400000, 3000000, 1500000];
const sourceLengthsCm = [17, 15, 7.5];
assert.deepEqual(sourcePopulations.map(api.roundHundredThousand), sourceRounded);
assert.deepEqual(sourceRounded.map(value => value / 100000 * 5 / 10), sourceLengthsCm);

const cases = [];
for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const item = api.getQuestion(variant, difficulty);
  assert(item, `missing ${variant}/${difficulty}`);
  assert.equal(item.sourceItemId, sourceItemId);
  assert.equal(item.publisherKeyVerified, false);
  assert.equal(item.publisherAnswerVerified, false);
  assert.equal(item.handwrittenAnswerVerified, false);
  assert.match(item.prompt, /<table class="source52-population-bar-table">/);
  assert.match(item.prompt, /가상 인구 자료/);
  assert.doesNotMatch(item.prompt, /부산광역시|인천광역시|대전광역시|작년 1월/);
  assert.match(item.prompt, /10만 명을 5mm/);
  const rows = [...item.prompt.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([\d,]+)명<\/td><\/tr>/g)];
  assert.equal(rows.length, 3);
  const displayedPopulations = rows.map(row => Number(row[2].replaceAll(",", "")));
  assert.deepEqual(displayedPopulations, api.pools[variant].map(value => value + api.difficultyDeltas[difficulty + 1]));
  const solved = item.answerModel.cities;
  assert.equal(solved.length, 3);
  for (let i = 0; i < solved.length; i++) {
    const rounded = Math.floor(displayedPopulations[i] / 100000 + 0.5) * 100000;
    const lengthMm = rounded / 100000 * 5;
    assert.equal(solved[i].roundedPopulation, rounded);
    assert.equal(solved[i].lengthMm, lengthMm);
    assert.equal(solved[i].lengthCm, lengthMm / 10);
    assert(item.solution.includes(`${rounded.toLocaleString("en-US")}÷100,000`));
    assert(item.solution.includes(`${lengthMm}mm=${lengthMm / 10}cm`));
  }
  assert.equal(item.answer, solved.map(city => `${city.city} ${Number.isInteger(city.lengthCm) ? city.lengthCm : city.lengthCm.toFixed(1)}cm`).join(", "));
  assert.equal(item.answerVisualRequired, false);
  assert.equal(item.answerVisualStatus, "not-required");
  assert.equal(item.difficultyLevel, difficulty + 1);
  cases.push({ variant, difficulty, populations: displayedPopulations, lengthsCm: solved.map(city => city.lengthCm) });
}
assert.equal(cases.length, 9);
assert.equal(new Set(cases.map(item => item.populations.join(","))).size, 9);
assert(new Set(cases.map(item => item.lengthsCm.join(","))).size >= 5, "variants must exercise at least five distinct rounded-length vectors");
for (const value of sourcePopulations) assert(!api.pools.flat().includes(value), `source population ${value} copied into public pools`);
assert(!cases.some(item => item.lengthsCm.join(",") === sourceLengthsCm.join(",")), "original answer vector must stay source-only");
for (const variant of [-1, 3, 1.5]) assert.equal(api.getQuestion(variant, 0), null);
for (const difficulty of [-2, 2, 1.5]) assert.equal(api.getQuestion(0, difficulty), null);

console.log(JSON.stringify({ status: "passed", sourceItemId, originalRounded: sourceRounded, originalLengthsCm: sourceLengthsCm, configurations: cases.length, distinctConfigurations: new Set(cases.map(item => item.populations.join(","))).size, sourceValuesExcludedFromPools: true, publisherKeyVerified: false }));
