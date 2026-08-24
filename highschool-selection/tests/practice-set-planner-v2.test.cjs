const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const practiceCore = require("../data/practice-bank-core.js");
const sourceLineage = require("../data/source-lineage.js");
const planner = require("../shared/practice-set-planner.js");

const MODE = "SH";

function makePolicy(overrides = {}) {
  return practiceCore.createPracticePolicy({
    id: core.createNeutralId("policy", MODE, `practice:policy:${overrides.version || 1}`),
    mode: MODE,
    version: 1,
    setSize: 3,
    maxPerDetail: 1,
    minDistinctDetails: 3,
    exactRepeatCooldownDays: 7,
    ...overrides
  });
}

function makeQuestion(familyNumber, relation, difficultyBand, overrides = {}) {
  const suffix = String(familyNumber).padStart(2, "0");
  const familyId = core.createNeutralId("question", MODE, `practice:family:${suffix}`);
  const questionId = relation === "original"
    ? familyId
    : core.createNeutralId("question", MODE, `practice:${relation}:${difficultyBand}:${suffix}`);
  const sourceAsset = sourceLineage.createSourceAssetReference({
    sourceAssetId: core.createNeutralId("source", MODE, `practice:asset:${relation}:${difficultyBand}:${suffix}`),
    sourceFingerprint: `sha256:${String(familyNumber).padStart(64, "0")}`,
    pageNumber: familyNumber,
    itemLocator: { code: `P${suffix}` },
    assetVariant: relation
  });
  const lineage = sourceLineage.createQuestionLineage({
    mode: MODE,
    id: core.createNeutralId("lineage", MODE, `practice:lineage:${relation}:${difficultyBand}:${suffix}`),
    sourceExamId: core.createNeutralId("exam", MODE, `practice:source-exam:${suffix}`),
    originalQuestionId: familyId,
    questionId,
    questionTypeId: core.createNeutralId("type", MODE, `practice:type:${suffix}`),
    relation,
    sourceAsset
  });
  const userApproval = sourceLineage.createUserApproval({
    mode: MODE,
    id: core.createNeutralId("approval", MODE, `practice:question-approval:${relation}:${difficultyBand}:${suffix}`),
    questionId,
    status: overrides.approvalStatus || "approved",
    decisionVersion: 1
  });
  return {
    id: questionId,
    mode: MODE,
    writer: "T",
    points: 1,
    curriculum: core.createCurriculumPath({
      grade: "G10",
      major: "M01",
      minor: `S${suffix}`,
      detail: overrides.detailCode || `D${suffix}`
    }),
    provenance: core.createProvenanceRecord({
      mode: MODE,
      role: "internal-variant",
      status: "cleared",
      referenceId: core.createNeutralId("source", MODE, `practice:source:${relation}:${difficultyBand}:${suffix}`)
    }),
    answerVerification: core.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: "input",
    generationKind: "parameterized",
    difficultyBand,
    variant: core.createVariantRecord({ mode: MODE, familyId, band: difficultyBand }),
    lineage,
    userApproval,
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `PRACTICE-${suffix}` },
    figureAudit: { required: false, status: "not_required" },
    reviewStatus: "approved"
  };
}

function makeChain(familyNumber, overrides = {}) {
  return [
    makeQuestion(familyNumber, "original", "standard", overrides.original || {}),
    makeQuestion(familyNumber, "twin", "lowered", overrides.twin || {}),
    makeQuestion(familyNumber, "similar", "raised", overrides.similar || {})
  ];
}

function makeAttempt(index, input) {
  return practiceCore.createPracticeAttempt({
    id: core.createNeutralId("attempt", MODE, `practice:attempt:${index}`),
    mode: MODE,
    learnerId: input.learnerId,
    practiceSetId: core.createNeutralId("practiceSet", MODE, `practice:history-set:${index}`),
    practiceSetApprovalId: core.createNeutralId("approval", MODE, `practice:history-approval:${index}`),
    questionId: input.questionId,
    familyId: input.familyId,
    relation: input.relation,
    difficultyBand: input.difficultyBand,
    attemptedAt: input.attemptedAt,
    result: input.result,
    recordVersion: 1
  });
}

test("practice identifiers, policy, and attempt history are neutral metadata only", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:001");
  const practiceSetId = core.createNeutralId("practiceSet", MODE, "practice:set:001");
  const attemptId = core.createNeutralId("attempt", MODE, "practice:attempt:001");
  assert.equal(core.isNeutralId(learnerId, "learner", MODE), true);
  assert.equal(core.isNeutralId(practiceSetId, "practiceSet", MODE), true);
  assert.equal(core.isNeutralId(attemptId, "attempt", MODE), true);

  const policy = makePolicy();
  assert.equal(policy.writer, "T");
  assert.deepEqual(policy.relationOrder, ["original", "twin", "similar"]);
  assert.equal(policy.userApprovalRequired, true);
  assert.throws(() => makePolicy({ userApprovalRequired: false }), /cannot disable user approval/);
  assert.throws(() => practiceCore.assertPracticeMetadataOnly({ answer: "blocked" }), /cannot contain answer/);
});

test("mastery moves through spaced consolidation, mastery, review, and recovery", () => {
  const policy = makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 });
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:mastery");
  const chain = makeChain(1);
  const familyId = chain[0].variant.familyId;
  const attempts = [
    makeAttempt(1, { learnerId, questionId: chain[0].id, familyId, relation: "original", difficultyBand: "standard", attemptedAt: "2026-08-01T00:00:00Z", result: "correct" }),
    makeAttempt(2, { learnerId, questionId: chain[1].id, familyId, relation: "twin", difficultyBand: "lowered", attemptedAt: "2026-08-04T00:00:00Z", result: "correct" }),
    makeAttempt(3, { learnerId, questionId: chain[2].id, familyId, relation: "similar", difficultyBand: "raised", attemptedAt: "2026-08-07T00:00:00Z", result: "correct" })
  ];
  const mastered = planner.computeFamilyMastery({ familyId, learnerId, attempts, policy, asOf: "2026-08-08T00:00:00Z" });
  assert.equal(mastered.status, "mastered");
  assert.equal(mastered.due, false);
  assert.equal(mastered.dueAt, "2026-08-21T00:00:00.000Z");

  const failed = attempts.concat(makeAttempt(4, {
    learnerId,
    questionId: chain[2].id,
    familyId,
    relation: "similar",
    difficultyBand: "raised",
    attemptedAt: "2026-08-21T00:00:00Z",
    result: "incorrect"
  }));
  const needsReview = planner.computeFamilyMastery({ familyId, learnerId, attempts: failed, policy, asOf: "2026-08-22T00:00:00Z" });
  assert.equal(needsReview.status, "needs_review");
  assert.equal(needsReview.due, true);

  const recovered = failed.concat([
    makeAttempt(5, { learnerId, questionId: chain[1].id, familyId, relation: "twin", difficultyBand: "lowered", attemptedAt: "2026-08-22T00:00:00Z", result: "correct" }),
    makeAttempt(6, { learnerId, questionId: chain[0].id, familyId, relation: "original", difficultyBand: "standard", attemptedAt: "2026-08-23T00:00:00Z", result: "correct" })
  ]);
  const recoveredMastery = planner.computeFamilyMastery({ familyId, learnerId, attempts: recovered, policy, asOf: "2026-08-23T00:00:00Z" });
  assert.equal(recoveredMastery.status, "mastered");
});

test("mastery never mixes learners and requires relation diversity inside the correct streak", () => {
  const policy = makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 });
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:strict-mastery");
  const otherLearnerId = core.createNeutralId("learner", MODE, "practice:learner:other");
  const chain = makeChain(1);
  const familyId = chain[0].variant.familyId;
  const sameRelationAttempts = [1, 2, 3].map(index => makeAttempt(60 + index, {
    learnerId,
    questionId: chain[2].id,
    familyId,
    relation: "similar",
    difficultyBand: "raised",
    attemptedAt: `2026-08-0${index}T00:00:00Z`,
    result: "correct"
  }));
  const notMastered = planner.computeFamilyMastery({
    familyId,
    learnerId,
    attempts: sameRelationAttempts,
    policy,
    asOf: "2026-08-04T00:00:00Z"
  });
  assert.equal(notMastered.status, "consolidating");
  assert.equal(notMastered.successfulRelationCount, 1);

  const mixedLearnerAttempt = makeAttempt(64, {
    learnerId: otherLearnerId,
    questionId: chain[0].id,
    familyId,
    relation: "original",
    difficultyBand: "standard",
    attemptedAt: "2026-08-04T00:00:00Z",
    result: "correct"
  });
  assert.throws(() => planner.computeFamilyMastery({
    familyId,
    learnerId,
    attempts: sameRelationAttempts.concat(mixedLearnerAttempt),
    policy,
    asOf: "2026-08-05T00:00:00Z"
  }), /learner does not match/);
});

test("an unseen plan is deterministic, family-diverse, detail-diverse, and approval-gated", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:deterministic");
  const candidates = makeChain(1).concat(makeChain(2), makeChain(3), makeChain(4));
  const input = {
    mode: MODE,
    learnerId,
    policy: makePolicy(),
    candidates,
    history: [],
    asOf: "2026-08-22T00:00:00Z"
  };
  const first = planner.buildPracticeSetPlan(input);
  const repeated = planner.buildPracticeSetPlan(input);

  assert.deepEqual(first, repeated);
  assert.equal(first.eligible, true);
  assert.equal(first.releaseStatus, "approval_required");
  assert.equal(first.items.length, 3);
  assert.equal(new Set(first.items.map(item => item.questionId)).size, 3);
  assert.equal(new Set(first.items.map(item => item.familyId)).size, 3);
  assert.equal(new Set(first.items.map(item => item.detailCode)).size, 3);
  assert.deepEqual(first.items.map(item => item.relation), ["original", "original", "original"]);
  assert.deepEqual(first.items.map(item => item.difficultyBand), ["standard", "standard", "standard"]);
  assert.equal(practiceCore.assertPracticeMetadataOnly(first), true);
  const serialized = JSON.stringify(first);
  ["questionText", "correctAnswer", "solution", "pdfUrl", "C:\\", "G:\\"].forEach(token => {
    assert.equal(serialized.includes(token), false);
  });
});

test("the first reattempt advances original to an approved twin and targets a lowered variant", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:progression");
  const candidates = makeChain(1);
  const familyId = candidates[0].variant.familyId;
  const history = [makeAttempt(20, {
    learnerId,
    questionId: candidates[0].id,
    familyId,
    relation: "original",
    difficultyBand: "standard",
    attemptedAt: "2026-08-20T00:00:00Z",
    result: "incorrect"
  })];
  const plan = planner.buildPracticeSetPlan({
    mode: MODE,
    learnerId,
    policy: makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 }),
    candidates,
    history,
    asOf: "2026-08-22T00:00:00Z"
  });
  assert.equal(plan.eligible, true);
  assert.equal(plan.items[0].relation, "twin");
  assert.equal(plan.items[0].difficultyBand, "lowered");
  assert.equal(plan.items[0].masteryBefore, "learning");
  assert.equal(plan.items[0].scheduledReason, "spaced_reattempt");
});

test("recent exact repeats are blocked after the three-stage chain has been used", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:cooldown");
  const candidates = makeChain(1);
  const familyId = candidates[0].variant.familyId;
  const history = candidates.map((question, index) => makeAttempt(30 + index, {
    learnerId,
    questionId: question.id,
    familyId,
    relation: question.lineage.relation,
    difficultyBand: question.difficultyBand,
    attemptedAt: `2026-08-${19 + index}T00:00:00Z`,
    result: "incorrect"
  }));
  const plan = planner.buildPracticeSetPlan({
    mode: MODE,
    learnerId,
    policy: makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 }),
    candidates,
    history,
    asOf: "2026-08-22T00:00:00Z"
  });
  assert.equal(plan.eligible, false);
  assert.equal(plan.items.length, 0);
  assert.equal(plan.issues.some(issue => issue.code === "practice_set.insufficient_eligible_questions"), true);
});

test("an incomplete or unapproved original-twin-similar family never enters a plan", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:approval-gate");
  const candidates = makeChain(1, { similar: { approvalStatus: "pending" } });
  const plan = planner.buildPracticeSetPlan({
    mode: MODE,
    learnerId,
    policy: makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 }),
    candidates,
    history: [],
    asOf: "2026-08-22T00:00:00Z"
  });
  assert.equal(plan.eligible, false);
  assert.equal(plan.items.length, 0);
  assert.equal(plan.summary.blockedCandidateCount, 1);
  assert.equal(plan.summary.blockedFamilyCount, 1);
});

test("a complete plan still cannot release without a matching explicit approval", () => {
  const learnerId = core.createNeutralId("learner", MODE, "practice:learner:release");
  const plan = planner.buildPracticeSetPlan({
    mode: MODE,
    learnerId,
    policy: makePolicy({ setSize: 1, maxPerDetail: 1, minDistinctDetails: 1 }),
    candidates: makeChain(1),
    history: [],
    asOf: "2026-08-22T00:00:00Z"
  });
  const approvalInput = {
    id: core.createNeutralId("approval", MODE, "practice:set-approval:release"),
    practiceSetId: plan.id,
    status: "pending",
    decisionVersion: 1
  };
  assert.throws(() => planner.releasePracticeSet(plan, approvalInput), /does not have user approval/);
  const released = planner.releasePracticeSet(plan, { ...approvalInput, status: "approved" });
  assert.equal(released.releaseStatus, "released");
  assert.equal(released.approval.reviewer, "T");
  assert.equal(practiceCore.assertPracticeMetadataOnly(released), true);
});

test("the public questions registry remains empty and does not import practice content", () => {
  const questionsPath = path.join(__dirname, "..", "data", "questions.js");
  const source = fs.readFileSync(questionsPath, "utf8");
  assert.match(source, /HIGHSELECT_QUESTIONS\s*=\s*\{\}/);
  assert.equal(source.includes("practice-bank"), false);
});
