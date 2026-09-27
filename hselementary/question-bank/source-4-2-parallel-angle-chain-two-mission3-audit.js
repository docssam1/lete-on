"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-parallel-angle.js");
const source = require("./source-4-2-parallel-angle-chain-two-mission3.js");
const sourceId = "4-2-u4-e4-mission-3";

function attribute(markup, name) {
  return new RegExp(`${name}="([^"]*)"`).exec(markup)?.[1];
}

function point(value) {
  const parts = String(value).split(",").map(Number);
  assert.equal(parts.length, 2);
  assert(parts.every(Number.isFinite));
  return parts;
}

function angle(vertex, first, second) {
  const a = [first[0] - vertex[0], first[1] - vertex[1]];
  const b = [second[0] - vertex[0], second[1] - vertex[1]];
  const cosine = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b));
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
}

function targetAngles(markup) {
  const groups = [...String(markup).matchAll(/<g class="pa-angle is-target"([^>]*)>/g)];
  assert.equal(groups.length, 3, "three separate source target sectors are required");
  return groups.map(([, attributes]) => {
    const vertex = point(attribute(attributes, "data-angle-vertex"));
    const first = point(attribute(attributes, "data-angle-ray-a"));
    const second = point(attribute(attributes, "data-angle-ray-b"));
    const measured = angle(vertex, first, second);
    const declared = Number(attribute(attributes, "data-angle-value"));
    assert(Math.abs(measured - declared) < 0.02, `angle sector ${measured} disagrees with ${declared}`);
    return measured;
  });
}

assert.deepEqual(source.SOURCE_IDS, [sourceId]);
assert.equal(source.POOLS.length, 3);
assert.equal(source.POOLS[0].upper, 20);
assert.equal(source.POOLS[0].lower, 30);

for (const [index, data] of source.POOLS.entries()) {
  const expected = 180 - data.upper - data.lower;
  const candidates = new Set();
  for (let steep = data.upper + 1; steep < 90; steep += 1) {
    const first = steep - data.upper;
    const second = 90 - steep;
    const third = 90 - data.lower;
    if (first > 0 && second > 0 && third > 0) candidates.add(first + second + third);
  }
  assert.deepEqual([...candidates], [expected], "the requested sum must have one answer for every admissible bend");

  const question = source.buildGenerated(sourceId, index);
  assert.equal(question.answer, `${expected}°`);
  assert.equal(question.sourceItemId, sourceId);
  assert.equal(question.answerCandidateCount, 1);
  assert.equal(question.answerVisualStatus, "verified");
  assert.equal(question.verifiedVariantCount, 3);
  assert.equal(question.variantProvenance, index === 0 ? "source-values" : "source-structure-variant");
  assert(question.prompt.includes("㉠") && question.prompt.includes("㉡") && question.prompt.includes("㉢"));
  assert(question.answerVisual.includes(`${data.steep - data.upper}°`));
  assert(question.answerVisual.includes(`${90 - data.steep}°`));
  assert(question.answerVisual.includes(`${90 - data.lower}°`));

  for (const markup of [question.prompt, question.answerVisual]) {
    const actual = targetAngles(markup);
    assert(Math.abs(actual.reduce((sum, value) => sum + value, 0) - expected) < 0.02);
  }
}

const curriculumType = window.HSE_CURRICULUM.semesters
  .flatMap(semester => semester.units || [])
  .flatMap(unit => unit.subunits || [])
  .flatMap(subunit => subunit.types || [])
  .find(type => type.sourceItemId === sourceId);
assert(curriculumType);
assert.equal(curriculumType.reviewLocked, false);
assert.equal(window.HSE_GENERATORS.generatorKey(curriculumType), source.GENERATOR_KEY);

console.log("4-2 exploration 4 Mission 3: source values, 3 finite variants, free-angle uniqueness, coordinate sectors and answer diagrams passed");
