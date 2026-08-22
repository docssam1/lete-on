const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const review = require("../data/review-only/dp-cm1-entry-202405-inventory.js");

const inventory = review.inventory;

test("DP CM1 May-2024 inventory preserves the source-revision structure without release", () => {
  assert.deepEqual(review.validateReviewInventory(inventory), []);
  assert.equal(inventory.reviewOnly, true);
  assert.equal(inventory.mode, "DP");
  assert.equal(inventory.trackCode, "CM1_ENTRY");
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
});

test("30 ordered items retain exact page groups, response formats, and neutral lineage", () => {
  assert.equal(inventory.items.length, 30);
  assert.deepEqual(inventory.items.map(item => item.number), Array.from({ length: 30 }, (_, index) => index + 1));
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
  assert.equal(inventory.items.filter(item => item.responseFormatCandidate === "single_choice").length, 19);
  assert.equal(inventory.items.filter(item => item.responseFormatCandidate === "short_answer").length, 11);
  inventory.items.forEach(item => {
    assert.equal(item.responseCandidate, "input");
    assert.equal(item.pointCandidate, 1);
    assert.equal(item.officialWeight, false);
    assert.equal(item.classificationStatus, "verified");
    assert.equal(core.isNeutralId(item.id, "question", "DP"), true);
    assert.equal(core.isNeutralId(item.lineageRef.lineageId, "lineage", "DP"), true);
    assert.equal(core.isNeutralId(item.lineageRef.questionTypeId, "type", "DP"), true);
    assert.equal(item.lineageRef.relation, item.number === 29 ? "replacement" : "original");
  });
});

test("item 29 is resolved by a same-type verified replacement without exposing its answer", () => {
  const blocked = inventory.items.filter(item => item.resolutionStatus === "review_blocked");
  assert.deepEqual(blocked, []);
  assert.equal(inventory.items[28].answerAuditStatus, "verified_private");
  assert.equal(inventory.items[28].resolutionStatus, "replacement_verified");
  assert.equal(inventory.items.filter(item => item.answerAuditStatus === "verified_private").length, 30);
});

test("serialized public inventory contains no answer values, source text, hashes, or private locations", () => {
  const serialized = JSON.stringify(inventory);
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/file:\/\//i.test(serialized), false);
  assert.equal(/\.(?:pdf|hwp)(?:["?#])/i.test(serialized), false);
  assert.equal(/sha256/i.test(serialized), false);
  ["questionText", "answerKey", "answerSpec", "correctAnswer", "solution", "sourcePath"].forEach(key => {
    assert.equal(serialized.includes(`\"${key}\"`), false);
  });
});
