"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const mission = require("./source-5-2-rounded-count-mission1.js");

const inventoryDirectory = path.join(__dirname, "source-inventory");
const sourceInventory = JSON.parse(fs.readFileSync(path.join(inventoryDirectory, "5-2-source-items.json"), "utf8"));
const readiness = JSON.parse(fs.readFileSync(path.join(inventoryDirectory, "5-2-u1-readiness-review.json"), "utf8"));
const sourceRow = sourceInventory.sourceItems.find(item => item.sourceItemId === "5-2-u1-e4-mission-1");
const readinessRow = readiness.items.find(item => item.sourceItemId === mission.sourceItemId);
assert.ok(sourceRow, "the source-item ledger contains the Mission 1 crosswalk");
assert.ok(readinessRow, "the readiness review contains the detailed Mission 1 record");
assert.equal(sourceRow.sourceVerified, true);
assert.equal(sourceRow.implementationStatus, "reviewed");
assert.equal(readinessRow.sourceVerified, true);
assert.equal(readinessRow.implementationStatus, "deployed-and-live-verified");
assert.equal(readinessRow.publicDecision, "published");
assert.equal(sourceInventory.integrity.readyItems, sourceInventory.sourceItems.filter(item => item.implementationStatus === "reviewed").length);
assert.equal(sourceInventory.integrity.reviewLockedItems, sourceInventory.sourceItems.filter(item => item.implementationStatus === "review-locked").length);
assert.equal(readiness.integrity.publicCandidateCount, readiness.items.filter(item => item.publicDecision !== "locked").length);
assert.equal(readiness.integrity.reviewLockedCount, readiness.items.filter(item => item.publicDecision === "locked").length);

function enumerate(hundredTarget, tenCeilingTarget, limit = 10000) {
  const candidates = [];
  for (let n = 1; n <= limit; n += 1) {
    if (Math.floor((n + 50) / 100) * 100 === hundredTarget && Math.ceil(n / 10) * 10 === tenCeilingTarget) candidates.push(n);
  }
  return candidates;
}

const sourceCandidates = enumerate(1200, 1200, 3000);
assert.deepEqual(sourceCandidates, Array.from({ length: 10 }, (_, index) => 1191 + index));
assert.equal(sourceCandidates.length, 10);
const observations = [];
for (let variant = 0; variant < mission.pools.length; variant += 1) {
  for (const difficultyOffset of [-1, 0, 1]) {
    const question = mission.getQuestion(variant, difficultyOffset);
    assert.ok(question, `configuration ${variant}/${difficultyOffset} exists`);
    const { hundredTarget, tenCeilingTarget, commonRange } = question.questionModel;
    const candidates = enumerate(hundredTarget, tenCeilingTarget);
    assert.equal(candidates.length, question.answerModel.count);
    assert.deepEqual(candidates, Array.from({ length: candidates.length }, (_, index) => commonRange[0] + index));
    assert.equal(question.answer, `${candidates.length}개`);
    assert.notEqual(question.answer, "10개", "synthetic answer must differ from source answer");
    assert.notEqual(hundredTarget, 1200);
    assert.notEqual(tenCeilingTarget, 1200);
    observations.push({ variant, difficultyOffset, hundredTarget, tenCeilingTarget, commonRange, answer: question.answer });
  }
}

console.log(JSON.stringify({ status: "passed", sourceCandidates: sourceCandidates.length, sourceRange: [sourceCandidates[0], sourceCandidates.at(-1)], syntheticConfigurations: observations.length, observations }, null, 2));
