"use strict";
const assert = require("node:assert/strict");
const mission = require("./source-5-2-rounded-triplet-mission4.js");

const unit = 100000;
const sourceTargets = { roundedTarget: 7900000, truncatedTarget: 7900000, ceilingTarget: 8000000 };
const matches = (n, targets) =>
  Math.floor(n / unit + 0.5) * unit === targets.roundedTarget &&
  Math.floor(n / unit) * unit === targets.truncatedTarget &&
  Math.ceil(n / unit) * unit === targets.ceilingTarget;

const sourceQuestion = mission.getQuestion(0, 0);
assert.equal(sourceQuestion.sourceItemId, mission.sourceItemId);
assert.equal(sourceQuestion.answer, "2,300,000 초과 2,350,000 미만");
assert.notEqual(sourceQuestion.questionModel.roundedTarget, sourceTargets.roundedTarget);
assert.notEqual(sourceQuestion.questionModel.truncatedTarget, sourceTargets.truncatedTarget);
assert.notEqual(sourceQuestion.questionModel.ceilingTarget, sourceTargets.ceilingTarget);

const sourceProbes = [
  [7899999.9, false], [7900000, false], [7900000.1, true],
  [7949999.9, true], [7950000, false], [7950000.1, false]
];
for (const [value, expected] of sourceProbes) assert.equal(matches(value, sourceTargets), expected, `source endpoint ${value}`);

const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
  const q = mission.getQuestion(variant, difficultyOffset);
  assert(q, `configuration ${variant}/${difficultyOffset}`);
  const { roundedTarget, truncatedTarget, ceilingTarget, intervals, intersection } = q.questionModel;
  const targets = { roundedTarget, truncatedTarget, ceilingTarget };
  const midpoint = (intersection.lower + intersection.upper) / 2;
  assert(matches(midpoint, targets), `${variant}/${difficultyOffset}: interior witness`);
  assert.equal(matches(intersection.lower, targets), intersection.lowerInclusive, "lower endpoint inclusion");
  assert.equal(matches(intersection.upper, targets), intersection.upperInclusive, "upper endpoint inclusion");
  assert.equal(intervals.length, 3);
  assert(q.solution.includes(q.answer));
  assert(!/[[(][\d,]+,\s*[\d,]+[)\]]/.test(q.solution), "Use student-facing Korean range language, not interval notation");
  assert(q.solution.includes("이상") || q.solution.includes("초과"));
  assert(q.solution.includes("이하") || q.solution.includes("미만"));
  assert.equal(q.publisherKeyVerified, false);
  assert(!q.prompt.includes("7,900,000") && !q.prompt.includes("8,000,000"), "Do not reuse source target values");
  observations.push({ variant, difficultyOffset, targets, interval: q.answer });
}
assert.equal(observations.length, 9);
assert.equal(mission.getQuestion(-1, 0), null);
assert.equal(mission.getQuestion(0, 2), null);
console.log(JSON.stringify({ status: "passed", sourceRange: "7900000 < n < 7950000", sourceEndpointProbes: sourceProbes.length, syntheticConfigurations: observations.length, observations }, null, 2));
