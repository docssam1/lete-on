"use strict";

const assert = require("node:assert/strict");
const api = require("./source-5-2-cube-box-mission3.js");
const sourceItemId = "5-2-u1-e3-mission-3-cube-box-count";
const sourceRoomCm = [300, 1000, 400];
const sourceSideCm = 15;
const sourceCounts = sourceRoomCm.map(length => Math.floor(length / sourceSideCm));
assert.deepEqual(sourceCounts, [20, 66, 26]);
assert.equal(sourceCounts.reduce((a, b) => a * b, 1), 34320);
const configurations = [];

for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const item = api.getQuestion(variant, difficulty);
  assert(item, `missing ${variant}/${difficulty}`);
  assert.match(item.prompt, /창고의 가로·세로·높이 방향과 평행/);
  const svg = item.prompt.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
  assert(svg, "Problem must include the labeled room-and-cube diagram");
  assert.match(svg, /data-source52-cube-box="true"/);
  const room = item.questionModel.roomCm;
  const side = item.questionModel.cubeSideCm;
  const counts = room.map(length => Math.floor(length / side));
  const remainders = room.map(length => length % side);
  const answer = counts.reduce((product, count) => product * count, 1);
  const plainSolution = item.solution.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  assert.deepEqual(item.questionModel.axisCounts, counts);
  assert.deepEqual(item.answerModel.remaindersCm, remainders);
  assert.equal(item.answerModel.boxes, answer);
  assert.equal(item.answer, `${answer.toLocaleString("en-US")}개`);
  for (const [index, count] of counts.entries()) {
    assert(plainSolution.includes(`${room[index].toLocaleString("en-US")}cm`) && plainSolution.includes(`${room[index].toLocaleString("en-US")}÷${side}=${count}`));
  }
  assert(plainSolution.includes(`${counts.join("×")}=${answer.toLocaleString("en-US")}개`));
  assert.equal(item.publisherKeyVerified, false);
  assert.equal(item.handwrittenAnswerVerified, false);
  assert.equal(item.answerVisualRequired, false);
  assert.equal(item.answerVisualStatus, "not-required");
  assert.equal(item.sourceItemId, sourceItemId);
  assert(!item.prompt.includes("34,320"), "No answer leaks into the question");
  configurations.push({ variant, difficulty, room, side, counts, remainders, answer });
}

for (let variant = 0; variant < api.pools.length; variant++) for (const difficulty of [-1, 0, 1]) {
  const item = api.getQuestion(variant, difficulty);
  assert(JSON.stringify(item.questionModel.roomCm) !== JSON.stringify(sourceRoomCm) || item.questionModel.cubeSideCm !== sourceSideCm);
}
assert.equal(new Set(configurations.map(item => `${item.room.join("x")}:${item.side}`)).size, 9);
for (const invalid of [-1, 3, 1.2]) assert.equal(api.getQuestion(invalid, 0), null);
for (const invalid of [-2, 2, 1.2]) assert.equal(api.getQuestion(0, invalid), null);

console.log(JSON.stringify({ status: "passed", sourceItemId, configurations: configurations.length, sourceCounts, independentlyCalculatedSourceAnswer: 34320, sourceDimensionsExcludedFromPools: true, publisherKeyVerified: false }));
