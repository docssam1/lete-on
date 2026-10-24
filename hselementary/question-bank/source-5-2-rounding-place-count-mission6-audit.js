"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const mission = require("./source-5-2-rounding-place-count-mission6.js");

const sourceDir = "/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/page11/source";
const pageText = fs.readFileSync(`${sourceDir}/source-page-009-apple-vision.txt`, "utf8");
assert.match(pageText, /백의 자리까지/);
assert.match(pageText, /천의 자리까지/);
assert.match(pageText, /십만의 자리까지/);
assert.match(pageText, /십의 자리까지/);
const mission6Text = fs.readFileSync("/Users/docssam/Documents/Codex/GFIELD-Hermes/state/mac-continuation-20261017/checks/grade52-e6-source-20261023/page11/mission6/apple-vision-printed-text.txt", "utf8");
assert.match(mission6Text, /7200/);
assert.match(mission6Text, /적어도/);
assert.match(mission6Text, /가장 많으면/);
assert.match(mission6Text, /알맞은 수를 각각 구하여라/);
assert.doesNotMatch(mission6Text, /일의 자리|십의 자리|백의 자리|천의 자리|만의 자리/);

const round = (n, unit) => Math.floor(n / unit + 0.5) * unit;
function enumerate(target, unit) {
  const values = [];
  const lower = Math.max(1, target - unit / 2 - 1);
  const upper = target + unit / 2 + 1;
  for (let n = lower; n <= upper; n += 1) if (round(n, unit) === target) values.push(n);
  return values;
}

function verifyTarget(target) {
  const places = [10, 100, 1000, 10000, 100000, 1000000].map(unit => ({ unit, values: enumerate(target, unit) }));
  const possibleCounts = places.filter(place => place.values.length > 0).map(place => place.values.length);
  assert.deepEqual(possibleCounts, [10, 100], `${target}: only tens and hundreds can yield this result`);
  assert.deepEqual(places.filter(place => place.values.length > 0).map(place => [place.unit, place.values[0], place.values.at(-1)]), [
    [10, target - 5, target + 4],
    [100, target - 50, target + 49]
  ]);
  const result = mission.solve(target);
  assert.deepEqual([result.minimumCount, result.maximumCount], [10, 100]);
  return { target, placeCounts: places.map(place => ({ unit: place.unit, count: place.values.length })) };
}

const source = verifyTarget(7200);
assert.equal(mission.solve(7200).tens.first, 7195);
assert.equal(mission.solve(7200).tens.last, 7204);
assert.equal(mission.solve(7200).hundreds.first, 7150);
assert.equal(mission.solve(7200).hundreds.last, 7249);

const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) for (const difficultyOffset of [-1, 0, 1]) {
  const question = mission.getQuestion(variant, difficultyOffset);
  assert(question, `${variant}/${difficultyOffset}`);
  const prompt = question.prompt.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const target = question.questionModel.target;
  const independent = verifyTarget(target);
  assert(prompt.includes(target.toLocaleString("ko-KR")));
  assert.match(prompt, /최소 \(ㄱ\)개, 최대 \(ㄴ\)개/);
  assert.equal(question.answer, "10개, 100개");
  assert(question.solution.includes("어림하는 자리인 십의 자리부터 살핍니다."));
  for (const place of independent.placeCounts.filter(item => item.count > 0)) {
    assert(question.solution.includes(place.unit === 10 ? "십의 자리까지" : "백의 자리까지"));
  }
  assert.equal(question.publisherKeyVerified, false);
  assert.equal(question.handwrittenAnswerVerified, false);
  assert.equal(question.sourceStructurePreserved, true);
  observations.push({ variant, difficultyOffset, ...independent, answer: question.answer });
}

console.log(JSON.stringify({
  status: "passed",
  sourceItemId: mission.sourceItemId,
  pageContextSupportsComparingStandardRoundingPlaces: true,
  sourcePlaceCounts: source.placeCounts,
  sourceAnswer: "10개, 100개",
  syntheticConfigurations: observations.length,
  observations,
  publisherAnswerKeyUsed: false,
  handwritingUsed: false
}, null, 2));
