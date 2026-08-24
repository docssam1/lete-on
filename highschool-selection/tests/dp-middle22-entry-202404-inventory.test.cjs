const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const review = require("../data/review-only/dp-middle22-entry-202404-inventory.js");

const inventory = review.inventory;

test("DP middle 2-2 April-2024 inventory preserves the source-revision structure without release", () => {
  assert.deepEqual(review.validateReviewInventory(inventory), []);
  assert.equal(inventory.reviewOnly, true);
  assert.equal(inventory.trackCode, "MIDDLE22_TRANSFER");
  assert.equal(inventory.durationMinutes, 150);
  assert.deepEqual(inventory.cutlineCandidate, {
    basis: "correct_count",
    value: 20,
    scope: "source_revision_only",
    approved: false
  });
  assert.deepEqual(inventory.sourceLayout, {
    renderedPageCount: 11,
    coverPage: 1,
    blankPages: [2],
    questionPages: [3, 4, 5, 6, 7, 8, 9, 10],
    answerPage: 11
  });
  assert.deepEqual(review.evaluateReviewGate(inventory), {
    canAssemble: true,
    canRelease: false,
    issues: ["review.final_exam_confirmation_pending"]
  });
  assert.deepEqual(inventory.answerAvailability, {
    itemCount: 30,
    sourceKeyValues: 29,
    missingSourceKeys: 1,
    privateCompletions: 1,
    detailedSolutions: false,
    independentCheck: "verified_private"
  });
  assert.deepEqual(inventory.correctionSummary, {
    count: 1,
    itemNumbers: [1],
    type: "missing_source_key_completion",
    protectedArtifactRequired: true
  });
  assert.deepEqual(inventory.artifactStatus, {
    protectedScorer: "verified",
    printAudit: "passed",
    signedPageAssets: "verified"
  });
});

test("30 ordered items preserve page groups and current-curriculum classification candidates", () => {
  assert.equal(inventory.items.length, 30);
  assert.deepEqual(inventory.items.map(item => item.sourcePage), [
    3, 3, 3, 3,
    4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7,
    8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10
  ]);
  assert.equal(inventory.items.filter(item => item.difficultyCandidate === "standard").length, 11);
  assert.equal(inventory.items.filter(item => item.difficultyCandidate === "advanced").length, 19);
  assert.equal(inventory.items.filter(item => item.curriculumCandidate.code.startsWith("ENRICH-")).length, 2);
  inventory.items.forEach(item => {
    assert.equal(item.answerStatus, item.number === 1 ? "key_completed_private" : "verified_private");
    assert.equal(item.classificationStatus, "agent_verified");
    assert.equal(item.resolutionStatus, "agent_verified");
    assert.equal(core.isNeutralId(item.id, "question", "DP"), true);
    assert.equal(core.isNeutralId(item.lineageRef.questionTypeId, "type", "DP"), true);
    assert.equal(item.lineageRef.relation, "original");
  });
});

test("response candidates distinguish single, unordered, and paired values without answer content", () => {
  assert.equal(inventory.items.filter(item => item.responseCandidate === "input").length, 27);
  assert.deepEqual(inventory.items.filter(item => item.responseCandidate === "unordered_set").map(item => item.number), [16]);
  assert.deepEqual(inventory.items.filter(item => item.responseCandidate === "multi_input").map(item => item.number), [27, 30]);
  assert.equal(inventory.items[15].responseSlotCount, 2);
  assert.equal(inventory.items[26].responseSlotCount, 2);
  assert.equal(inventory.items[29].responseSlotCount, 2);
});

test("serialized public inventory excludes protected originals, answers, hashes, and local paths", () => {
  const serialized = JSON.stringify(inventory);
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/file:\/\//i.test(serialized), false);
  assert.equal(/\.(?:pdf|hwp)(?:["?#])/i.test(serialized), false);
  assert.equal(/sha256/i.test(serialized), false);
  ["questionText", "answerKey", "answerSpec", "correctAnswer", "solution", "sourcePath"].forEach(key => {
    assert.equal(serialized.includes(`\"${key}\"`), false);
  });
});
