"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-perimeter-mission2.js");
const sourceItemId = "5-2-u1-e3-mission-2-perimeter";
const strip = html => String(html).replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const cases = [];

for (let variant = 0; variant < api.pools.length; variant++) {
  for (const difficulty of [-1, 0, 1]) {
    const question = api.getQuestion(variant, difficulty);
    assert(question, `missing ${variant}/${difficulty}`);
    const svg = question.prompt.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
    assert(svg, "Prompt must contain the source-like L-shaped diagram");
    assert.match(svg, /data-source52-l-perimeter="true"/);
    const height = Number(svg.match(/data-total-height-mm="(\d+)"/)?.[1]);
    const width = Number(svg.match(/data-total-width-mm="(\d+)"/)?.[1]);
    assert.equal(height, question.questionModel.totalHeightMm);
    assert.equal(width, question.questionModel.totalWidthMm);
    const perimeter = 2 * (height + width);
    const expected = Math.round(perimeter / 10);
    assert.equal(question.answerModel.perimeterMm, perimeter);
    assert.equal(question.answerModel.roundedCm, expected);
    assert.equal(question.answer, `${expected}cm`);
    assert.match(strip(question.solution), /위쪽과 안쪽 가로 선분을 더하면 아래쪽/);
    assert.match(strip(question.solution), /오른쪽과 안쪽 세로 선분을 더하면 왼쪽/);
    assert.match(strip(question.solution), new RegExp(`${perimeter}mm`));
    assert.match(strip(question.solution), new RegExp(`${perimeter / 10}cm`));
    assert.match(strip(question.solution), new RegExp(`${expected}cm`));
    assert.doesNotMatch(strip(question.prompt), new RegExp(`(?:=|따라서)\\s*${expected}\\s*cm`), "Answer must not leak into the question");
    assert.equal(question.publisherKeyVerified, false);
    assert.equal(question.handwrittenAnswerVerified, false);
    assert.equal(question.sourceItemId, sourceItemId);
    cases.push({ variant, difficulty, height, width, perimeter, expected });
  }
}

const sourceHeightMm = 24;
const sourceWidthMm = 48;
const sourcePerimeterMm = 2 * (sourceHeightMm + sourceWidthMm);
assert.equal(sourcePerimeterMm, 144);
assert.equal(sourcePerimeterMm / 10, 14.4);
assert.equal(Math.round(sourcePerimeterMm / 10), 14, "Printed source's natural-centimeter approximation is 14cm");
for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const question = api.getQuestion(variant, difficulty);
  assert(!(question.questionModel.totalHeightMm === sourceHeightMm && question.questionModel.totalWidthMm === sourceWidthMm), "Published pool must not reproduce the original source values");
  assert.notEqual(question.answerModel.exactCm % 1, 0.5, "Avoid unspecified half-centimetre rounding ties");
}
assert.equal(new Set(cases.map(item => `${item.height}:${item.width}`)).size, 9);
for (const invalid of [-1, 3, 1.5]) assert.equal(api.getQuestion(invalid, 0), null);
for (const invalid of [-2, 2, 1.5]) assert.equal(api.getQuestion(0, invalid), null);

console.log(JSON.stringify({ status: "passed", sourceItemId, configurations: cases.length, sourceDimensionsKeptPrivate: true, independentlyCalculatedSourcePerimeterMm: 144, exactSourcePerimeterCm: 14.4, roundedNaturalCentimeters: 14, allGeneratedPoolsSynthetic: true, publisherKeyVerified: false }));
