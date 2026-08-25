const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const drafts = require("../data/exam-draft-core.js");

function ids(mode) {
  return {
    draft: core.createNeutralId("examDraft", mode, "draft:fall-selection"),
    placementA: core.createNeutralId("placement", mode, "placement:a"),
    placementB: core.createNeutralId("placement", mode, "placement:b"),
    itemA: core.createSharedBankId("question", "canonical:item-a"),
    itemB: core.createSharedBankId("question", "canonical:item-b"),
    itemC: core.createSharedBankId("question", "canonical:item-c"),
    familyA: core.createSharedBankId("question", "family:linear"),
    familyB: core.createSharedBankId("question", "family:quadratic"),
    typeA: core.createSharedBankId("type", "type:linear-equation"),
    typeB: core.createSharedBankId("type", "type:quadratic-factor")
  };
}

function path(detail) {
  return { grade: "G09", major: "ALG", minor: "EQ", detail };
}

function draft(mode) {
  const value = ids(mode);
  return drafts.createExamDraft({
    id: value.draft, mode, writer: "T", title: "Fall selection draft",
    scope: { curriculumVersion: "2022-revised", paths: [path("LIN"), path("QUAD")] }, status: "draft", scopeVersion: 1
  });
}

function candidate(mode, overrides) {
  const value = ids(mode);
  return Object.assign({
    itemId: value.itemA, mode: "BNK", familyId: value.familyA, typeId: value.typeA, curriculum: path("LIN"), responseType: "input",
    classificationVerified: true, answerVerified: true, rightsVerified: true, releaseEligible: true,
    lineageRelation: "original", difficultyBand: "standard", coreConditionVerified: true, solutionStructureVerified: true
  }, overrides || {});
}

test("drafts and placements preserve only safe canonical metadata", () => {
  const value = ids("SH"), selectedDraft = draft("SH");
  const placement = drafts.createExamPlacement({
    id: value.placementA, draftId: selectedDraft.id, mode: "SH", writer: "T", item: candidate("SH"),
    order: 1, points: 3, scopeVersion: 1, revision: 0, replacementHistory: []
  }, selectedDraft);

  assert.equal(placement.scopeState, "in_scope");
  assert.equal(placement.verificationState, "verified");
  assert.equal(Object.hasOwn(placement.item, "answer"), false);
  assert.throws(() => drafts.createCandidate(Object.assign(candidate("SH"), { answer: "A" }), selectedDraft), /protected or unknown fields/);
  assert.throws(() => drafts.createCandidate(Object.assign(candidate("SH"), { pdfUrl: "https:\/\/example.test\/paper.pdf" }), selectedDraft), /protected or unknown fields/);
  const tampered = Object.assign({}, placement, { answer: "A" });
  assert.deepEqual(drafts.validateExamDraft(selectedDraft, [tampered]).issues, ["placement.1.invalid"]);
});

test("scope changes retain placements and mark out-of-scope and unclassified items instead of deleting them", () => {
  const selectedDraft = draft("DP"), value = ids("DP");
  let placements = drafts.appendPlacement(selectedDraft, [], candidate("DP"), 2, value.placementA);
  placements = drafts.appendPlacement(selectedDraft, placements, candidate("DP", {
    itemId: value.itemB, familyId: value.familyB, typeId: value.typeB, curriculum: path("QUAD"), classificationVerified: false
  }), 2, value.placementB);

  const changed = drafts.changeDraftScope(selectedDraft, placements, { curriculumVersion: "2022-revised", paths: [path("QUAD")] });
  assert.equal(changed.draft.scopeVersion, 2);
  assert.equal(changed.draft.status, "review_required");
  assert.equal(changed.placements.length, 2);
  assert.equal(changed.placements[0].scopeState, "out_of_scope");
  assert.equal(changed.placements[1].scopeState, "classification_required");
  assert.deepEqual(changed.summary, { in_scope: 0, out_of_scope: 1, classification_required: 1, verified: 1, review_required: 1 });
});

test("deleting and reordering touch placements only and preserve canonical item identity", () => {
  const selectedDraft = draft("WM"), value = ids("WM");
  const first = drafts.appendPlacement(selectedDraft, [], candidate("WM"), 2, value.placementA);
  const full = drafts.appendPlacement(selectedDraft, first, candidate("WM", { itemId: value.itemB, familyId: value.familyB, typeId: value.typeB, curriculum: path("QUAD") }), 4, value.placementB);
  const reordered = drafts.reorderPlacements(selectedDraft, full, [value.placementB, value.placementA]);
  assert.deepEqual(reordered.map(placement => [placement.id, placement.order]), [[value.placementB, 1], [value.placementA, 2]]);
  assert.equal(reordered[0].item.itemId, value.itemB);
  const removed = drafts.removePlacement(selectedDraft, reordered, value.placementB);
  assert.equal(removed.length, 1);
  assert.equal(removed[0].item.itemId, value.itemA);
  assert.equal(full[1].item.itemId, value.itemB);
  assert.throws(() => drafts.appendPlacement(selectedDraft, first, candidate("WM", { itemId: value.itemC, lineageRelation: "twin" }), 2), /family is already placed/);
});

test("replacement retains placement identity and records a reviewed, compatible lineage transition", () => {
  const selectedDraft = draft("ED"), value = ids("ED");
  const original = drafts.createExamPlacement({
    id: value.placementA, draftId: selectedDraft.id, mode: "ED", writer: "T", item: candidate("ED"),
    order: 1, points: 2, scopeVersion: 1, revision: 0, replacementHistory: []
  }, selectedDraft);
  const replacement = drafts.replacePlacement(selectedDraft, original, candidate("ED", {
    itemId: value.itemC, lineageRelation: "twin", difficultyBand: "raised"
  }), {
    reasonCode: "SOURCE_CORRECTION", sameFamily: true, sameDetailType: true, sameCoreConditions: true,
    sameSolutionStructure: true, difficultyReviewed: true, reviewer: "T"
  });

  assert.equal(replacement.id, original.id);
  assert.equal(replacement.order, original.order);
  assert.equal(replacement.item.itemId, value.itemC);
  assert.deepEqual(replacement.replacementHistory, [{
    version: 1, previousItemId: value.itemA, nextItemId: value.itemC, relation: "twin", reasonCode: "SOURCE_CORRECTION", reviewer: "T"
  }]);
  assert.throws(() => drafts.replacePlacement(selectedDraft, original, candidate("ED", { itemId: value.itemC, lineageRelation: "twin", familyId: value.familyB }), {
    reasonCode: "BAD_FAMILY", sameFamily: true, sameDetailType: true, sameCoreConditions: true, sameSolutionStructure: true, difficultyReviewed: true, reviewer: "T"
  }), /family is not verified/);
});

test("draft validation blocks stale, out-of-scope, review-required, duplicate, and overused placements", () => {
  const selectedDraft = draft("DG"), value = ids("DG");
  const verified = drafts.createExamPlacement({
    id: value.placementA, draftId: selectedDraft.id, mode: "DG", writer: "T", item: candidate("DG"),
    order: 1, points: 2, scopeVersion: 1, revision: 0, replacementHistory: []
  }, selectedDraft);
  const blocked = drafts.createExamPlacement({
    id: value.placementB, draftId: selectedDraft.id, mode: "DG", writer: "T", item: candidate("DG", {
      itemId: value.itemB, curriculum: path("OUT"), answerVerified: false
    }), order: 2, points: 2, scopeVersion: 1, revision: 0, replacementHistory: []
  }, selectedDraft);
  const valid = drafts.validateExamDraft(selectedDraft, [verified], { questionCount: 1, totalPoints: 2 });
  assert.equal(valid.eligible, true);
  const invalid = drafts.validateExamDraft(selectedDraft, [verified, blocked], { maxPerFamily: 1 });
  assert.equal(invalid.eligible, false);
  assert.deepEqual(invalid.issues, [
    `family.${value.familyA}.overused`,
    "placement.2.out_of_scope",
    "placement.2.review_required"
  ]);
});
