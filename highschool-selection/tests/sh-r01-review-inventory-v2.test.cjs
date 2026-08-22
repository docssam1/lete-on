const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const review = require("../data/review-only/sh-r01-inventory.js");

const inventory = review.inventory;

test("SH-R01 review inventory has exactly 40 ordered page locators", () => {
  assert.equal(inventory.reviewOnly, true);
  assert.equal(inventory.mode, "SH");
  assert.equal(inventory.writer, "T");
  assert.equal(inventory.items.length, 40);
  assert.deepEqual(inventory.items.map(item => item.number), Array.from({ length: 40 }, (_, index) => index + 1));
  assert.deepEqual(inventory.items.map(item => item.sourcePage), [
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2,
    3, 3, 3, 3, 3, 3,
    4, 4, 4, 4, 4, 4,
    5, 5, 5, 5,
    6, 6, 6, 6,
    7, 7, 7, 7, 7, 7,
    8, 8, 8, 8
  ]);
});

test("only the 12 delegated classifications are agent-verified and every final item resolution stays pending", () => {
  const classificationVerified = new Set([2, 6, 9, 14, 18, 21, 23, 24, 27, 28, 29, 36]);
  inventory.items.forEach(item => {
    assert.equal(item.answerStatus, "found/pending");
    assert.equal(item.classificationStatus, classificationVerified.has(item.number) ? "verified" : "draft");
    assert.equal(item.resolutionStatus, "pending");
    assert.equal(core.INPUT_TYPES.includes(item.responseCandidate), true);
    assert.deepEqual(Object.keys(item.curriculumCandidate).sort(), ["code", "label"]);
    assert.deepEqual(Object.keys(item.majorCandidate).sort(), ["code", "label"]);
    assert.deepEqual(Object.keys(item.detailCandidate).sort(), ["code", "label"]);
  });
  assert.deepEqual(review.validateReviewInventory(inventory), []);
});

test("2022 curriculum classifications retain exact agent-verified EXT and LINK decisions", () => {
  const expected = new Map([
    [2, ["G7-S1-EXT", "NUM-PRIME-LCM-EXT", "DT-002", "input"]],
    [5, ["G7-S1", "ALG-EXPRESSION", "DT-005", "input"]],
    [6, ["G7-S1-LINK", "ALG-LINEAR-ANGLE", "DT-006", "input"]],
    [9, ["G7-S2-LINK", "GEOM-PARALLEL-CONG", "DT-009", "input"]],
    [14, ["G8-S1-LINK", "ALG-SYSTEM-CASE", "DT-014", "multi_input"]],
    [18, ["G7-S1-EXT", "NUM-PRIME-EXT", "DT-018", "input"]],
    [21, ["G7S1-G8S2-EXT", "FUNC-COORD-PYTHAG-EXT", "DT-021", "multi_input"]],
    [22, ["G8-S2", "PROB-COUNT", "DT-022", "input"]],
    [23, ["G8-S2-EXT", "PROB-COUNT-EXT", "DT-023", "ordered_list"]],
    [24, ["G8-S2-EXT", "GEOM-TRI-AREA-EXT", "DT-024", "input"]],
    [25, ["G8-S2", "GEOM-INCENTER-PYTHAG", "DT-025", "input"]],
    [26, ["G8-S2", "GEOM-SIM-PARALLEL", "DT-026", "input"]],
    [27, ["G8-S2-EXT", "GEOM-PARALLELOGRAM-EXT", "DT-027", "input"]],
    [28, ["G7-S2-EXT", "GEOM-SOLID-NET-EXT", "DT-028", "input"]],
    [29, ["G8-S2-EXT", "GEOM-TRI-AREA-EXT", "DT-029", "input"]],
    [31, ["G9-S1-EXT", "NUM-RADICAL-CALC", "DT-031", "input"]],
    [32, ["G9-S1", "ALG-QUADRATIC-APP", "DT-032", "input"]],
    [36, ["G7-S2-EXT", "GEOM-SOLID-VOLUME-EXT", "DT-036", "input"]],
    [39, ["G9-S1", "ALG-FACT-INT", "DT-039", "input"]]
  ]);
  const verified = new Set(review.CLASSIFICATION_AGENT_VERIFIED_ITEMS);
  expected.forEach((codes, number) => {
    const item = inventory.items[number - 1];
    assert.deepEqual([
      item.curriculumCandidate.code,
      item.majorCandidate.code,
      item.detailCandidate.code,
      item.responseCandidate
    ], codes);
    assert.equal(item.classificationStatus, verified.has(number) ? "verified" : "draft");
    assert.equal(item.resolutionStatus, "pending");
  });
  assert.equal(JSON.stringify(inventory).includes("조건부 확률"), false);
});

test("response-shape audit keeps Q35 as an unapproved unordered set", () => {
  const item = inventory.items[34];
  assert.equal(item.number, 35);
  assert.equal(item.responseCandidate, "unordered_set");
  assert.equal(item.answerStatus, "found/pending");
  assert.equal(item.classificationStatus, "draft");
  assert.equal(item.resolutionStatus, "pending");
});

test("classification review summary closes the owner queue with 12 agent-verified rows", () => {
  assert.deepEqual(inventory.classificationReviewSummary, {
    candidateCount: 40,
    highConfidence: 28,
    agentVerified: 12,
    agentVerifiedItems: [2, 6, 9, 14, 18, 21, 23, 24, 27, 28, 29, 36],
    ownerReview: 0,
    ownerReviewItems: [],
    finalExamConfirmation: "pending"
  });
  assert.equal(
    inventory.classificationReviewSummary.highConfidence
      + inventory.classificationReviewSummary.agentVerified
      + inventory.classificationReviewSummary.ownerReview,
    inventory.classificationReviewSummary.candidateCount
  );
});

test("nine correction decisions and protected executions are agent-verified", () => {
  assert.deepEqual(inventory.releaseBlockerSummary, {
    itemCount: 9,
    pending: 0,
    status: "corrections_agent_verified",
    items: [3, 4, 8, 10, 11, 30, 33, 34, 39],
    answerReviewItems: [3, 4, 8, 10, 11, 30],
    visualReviewItems: [33, 34, 39]
  });
  assert.equal(inventory.agentDecisionSummary.status, "agent_verified");
  assert.equal(inventory.agentDecisionSummary.finalExamConfirmation, "pending");
  assert.deepEqual(inventory.agentDecisionSummary.items.map(item => [item.number, item.disposition, item.correctionKind, item.executionStatus]), [
    [3, "replace", "same_type_same_difficulty", "replacement_verified"],
    [4, "keep", "answer_key", "agent_verified"],
    [8, "keep", "independent_answer_verification", "agent_verified"],
    [10, "keep", "independent_answer_verification", "agent_verified"],
    [11, "keep", "independent_answer_verification", "agent_verified"],
    [30, "keep", "source_faithful_typo", "agent_verified"],
    [33, "keep", "solution_typo", "agent_verified"],
    [34, "keep", "solution_typo", "agent_verified"],
    [39, "keep", "table_layout", "agent_verified"]
  ]);
  inventory.releaseBlockerSummary.items.forEach(number => {
    assert.equal(inventory.items[number - 1].resolutionStatus, "pending");
  });
});

test("neutral original lineage can connect every item to the SH-R01 source registry", () => {
  const ids = new Set();
  inventory.items.forEach(item => {
    assert.equal(core.isNeutralId(item.id, "question", "SH"), true);
    assert.equal(core.isNeutralId(item.lineageRef.lineageId, "lineage", "SH"), true);
    assert.equal(core.isNeutralId(item.lineageRef.questionTypeId, "type", "SH"), true);
    assert.equal(core.isNeutralId(item.lineageRef.sourceAssetId, "source", "SH"), true);
    assert.equal(item.lineageRef.sourceExamId, inventory.sourceExamId);
    assert.equal(item.lineageRef.originalQuestionId, item.id);
    assert.equal(item.lineageRef.relation, "original");
    ids.add(item.id);
  });
  assert.equal(ids.size, 40);
});

test("review-only inventory cannot assemble or release before agent resolutions", () => {
  const gate = review.evaluateReviewGate(inventory);
  assert.equal(gate.canAssemble, false);
  assert.equal(gate.canRelease, false);
  assert.deepEqual(gate.issues, [
    "review.agent_resolution_pending",
    "review.answer_not_verified",
    "review.classification_not_verified"
  ]);
});

test("public response schema remains empty and does not import review inventory", () => {
  const questions = fs.readFileSync(path.join(__dirname, "..", "data", "questions.js"), "utf8");
  assert.equal(questions.includes("window.HIGHSELECT_QUESTIONS = {};"), true);
  assert.equal(questions.includes("sh-r01-inventory"), false);
  assert.equal(questions.includes("responseCandidate"), false);
});

test("serialized inventory contains neither private locations nor prohibited content fields", () => {
  const serialized = JSON.stringify(inventory);
  assert.equal(/[A-Za-z]:[\\/]/.test(serialized), false);
  assert.equal(/file:\/\//i.test(serialized), false);
  assert.equal(/\.(?:pdf|hwp)(?:["?#])/i.test(serialized), false);
  review.FORBIDDEN_KEYS.forEach(key => assert.equal(Object.hasOwn(inventory, key), false));
});
