const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");
const auditor = require("../scripts/audit-private-question-index.cjs");
const review = require("../scripts/apply-private-layout-review.cjs");

function fixture() {
  const fingerprint = "f".repeat(64);
  const sourceRef = core.createSharedBankId("source", `sha256:${fingerprint}`);
  const item = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(fingerprint, 1, 1)),
    sourceRef,
    locator: { page: 1, slot: 1, kind: "exercise", box: { x: 0.1, y: 0.1, width: 0.4, height: 0.2 } },
    discoveryStatus: "layout_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: ["SH"],
    releaseStatus: "locked"
  });
  return {
    schemaVersion: index.INDEX_SCHEMA_VERSION,
    status: "draft",
    policy: { releaseLocked: true },
    counts: { questionCandidates: 1, unresolvedPages: 0, excludedPageCandidates: 0 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, privateSourceMemoryId: "private-source", pageCount: 1 }],
    items: [{ ...item, privateRef: { sourceMemoryId: "private-source" } }],
    unresolvedPages: [],
    excludedPageCandidates: []
  };
}

test("private index audit validates locked candidates and predecessor identity", () => {
  const value = fixture();
  const result = auditor.audit(value, value);
  assert.equal(result.ok, true);
  assert.equal(result.counts.preservedPredecessorItems, 1);
});

test("private index audit rejects leaked answers", () => {
  const value = fixture();
  value.items[0].answer = "42";
  const result = auditor.audit(value, null);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /forbidden private index keys/);
});

test("private index audit rejects release-state changes and private locations", () => {
  const value = fixture();
  value.status = "released";
  value.policy.releaseLocked = false;
  value.items[0].privateRef.evidenceLocator = "G:\\private\\original.pdf";
  const result = auditor.audit(value, null);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /status must remain draft/);
  assert.match(result.errors.join("\n"), /policy\.releaseLocked/);
  assert.match(result.errors.join("\n"), /private path or URL strings/);
});

test("private index audit binds source refs and private source ids", () => {
  const value = fixture();
  value.sources[0].sourceRef = core.createSharedBankId("source", `sha256:${"a".repeat(64)}`);
  const result = auditor.audit(value, null);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /sourceRef fingerprint mismatch/);
  assert.match(result.errors.join("\n"), /missing source/);
});

test("private index audit validates rejected candidate quarantine", () => {
  const value = fixture();
  value.rejectedCandidates = [{
    id: value.items[0].id,
    sourceRef: value.items[0].sourceRef,
    privateSourceMemoryId: "private-source",
    page: 1,
    reason: "visual-rejected-layout-anchor",
    reviewStatus: "visual_verified"
  }];
  value.counts.rejectedCandidates = 1;
  value.counts.activeQuestionCandidates = 0;
  value.visualReviewPages = [{
    privateSourceMemoryId: "private-source",
    sourceRef: value.sources[0].sourceRef,
    page: 1,
    resolution: "verified_mission_six_cell_replacing_candidates",
    rejectedCandidateIds: [value.items[0].id]
  }];
  const accepted = auditor.audit(value, null);
  assert.equal(accepted.ok, true);

  value.rejectedCandidates[0].page = 2;
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /locator mismatch/);
});

function variableMissionFixture() {
  const value = fixture();
  value.sources[0].pageCount = 2;
  value.unresolvedPages = [{
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "private-source",
    page: 2,
    reason: "layout-anchor-not-found"
  }];
  value.counts.unresolvedPages = 1;
  return review.applyReviews(value, [{
    sourceMemoryId: "private-source",
    page: 2,
    resolution: "mission_variable",
    anchors: [
      { printedLabelHint: "1", layoutOrder: 1, box: { x: 0.04, y: 0.18, width: 0.44, height: 0.34 } },
      { printedLabelHint: "2", layoutOrder: 2, box: { x: 0.04, y: 0.54, width: 0.44, height: 0.40 } },
      { printedLabelHint: "3", layoutOrder: 3, box: { x: 0.52, y: 0.18, width: 0.44, height: 0.34 } },
      { printedLabelHint: "4", layoutOrder: 4, box: { x: 0.52, y: 0.54, width: 0.44, height: 0.40 } }
    ]
  }]);
}

test("private index audit validates exact variable Mission reviews", () => {
  const value = variableMissionFixture();
  const accepted = auditor.audit(value, null);
  assert.equal(accepted.ok, true, accepted.errors.join("\n"));

  value.visualReviewPages[0].itemCount = 3;
  value.items[1].privateRef.layoutOrder = 4;
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /itemCount mismatch/);
  assert.match(rejected.errors.join("\n"), /order or label mismatch/);
});

test("private index audit rejects unbound or overlapping variable Mission items", () => {
  const value = variableMissionFixture();
  value.visualReviewPages = [];
  let rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /visual decision missing/);

  const overlap = variableMissionFixture();
  const variableItems = overlap.items.filter(item => item.privateRef.layoutKind === "mission-variable-cell");
  variableItems[1].locator = {
    ...variableItems[1].locator,
    box: { ...variableItems[0].locator.box }
  };
  rejected = auditor.audit(overlap, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /boxes overlap/);
});

test("private index audit rejects variable Mission queue overlap and extra page items", () => {
  const queued = variableMissionFixture();
  const variableReview = queued.visualReviewPages[0];
  queued.unresolvedPages.push({
    sourceRef: variableReview.sourceRef,
    privateSourceMemoryId: variableReview.privateSourceMemoryId,
    page: variableReview.page,
    reason: "layout-anchor-not-found"
  });
  queued.counts.unresolvedPages += 1;
  let rejected = auditor.audit(queued, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /remains in a pending page queue/);

  const extra = variableMissionFixture();
  extra.items[0].locator = { ...extra.items[0].locator, page: 2 };
  rejected = auditor.audit(extra, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /itemCount mismatch/);
});

test("private index audit rejects zero-area variable Mission boxes and count drift", () => {
  const value = variableMissionFixture();
  const variableItem = value.items.find(item => item.privateRef.layoutKind === "mission-variable-cell");
  variableItem.locator = { ...variableItem.locator, box: { ...variableItem.locator.box, width: 0 } };
  value.counts.visuallyVerified += 1;
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /positive area/);
  assert.match(rejected.errors.join("\n"), /visuallyVerified count mismatch/);
});

function manualReviewFixture() {
  const value = fixture();
  value.sources[0].pageCount = 3;
  value.unresolvedPages = [2, 3].map(page => ({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "private-source",
    page,
    reason: "layout-anchor-not-found"
  }));
  value.counts.unresolvedPages = 2;
  return review.applyReviews(value, [
    {
      sourceMemoryId: "private-source",
      page: 2,
      resolution: "manual_items",
      anchors: [{
        kind: "exercise",
        printedLabelHint: "42",
        layoutOrder: 1,
        box: { x: 0.07, y: 0.08, width: 0.84, height: 0.8 }
      }]
    },
    {
      sourceMemoryId: "private-source",
      page: 3,
      resolution: "manual_items",
      anchors: [
        {
          kind: "concept",
          printedLabelHint: "개념탐구 43",
          layoutOrder: 1,
          box: { x: 0.07, y: 0.08, width: 0.4, height: 0.7 }
        },
        {
          kind: "example",
          printedLabelHint: "예제 43-1",
          layoutOrder: 2,
          box: { x: 0.52, y: 0.08, width: 0.39, height: 0.7 }
        }
      ],
      continuations: [{
        fragmentPage: 3,
        printedLabelHint: "42 (2)-(3)",
        continuationFrom: { page: 2, printedLabelHint: "42" }
      }]
    }
  ]);
}

test("private index audit validates manual items and direct continuation linkage", () => {
  const value = manualReviewFixture();
  const accepted = auditor.audit(value, null);
  assert.equal(accepted.ok, true, accepted.errors.join("\n"));
  assert.equal(accepted.counts.items, 4);
});

test("private index audit rejects manual review registry, queue, and extra-item drift", () => {
  const registry = manualReviewFixture();
  registry.visualReviewPages.find(entry => entry.page === 3).itemIds.pop();
  let rejected = auditor.audit(registry, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /item registry invalid|itemIds mismatch/);

  const queued = manualReviewFixture();
  queued.unresolvedPages.push({
    sourceRef: queued.sources[0].sourceRef,
    privateSourceMemoryId: "private-source",
    page: 2,
    reason: "layout-anchor-not-found"
  });
  queued.counts.unresolvedPages += 1;
  rejected = auditor.audit(queued, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /remains in a pending page queue/);

  const extra = manualReviewFixture();
  extra.items[0].locator = { ...extra.items[0].locator, page: 2 };
  rejected = auditor.audit(extra, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /itemCount mismatch/);
});

test("private index audit rejects orphaned, unbound, or rejected continuation targets", () => {
  const orphan = manualReviewFixture();
  orphan.visualReviewPages.find(entry => entry.page === 3).continuationKeys = [];
  let rejected = auditor.audit(orphan, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /continuation registry mismatch|visual decision missing/);

  const missing = manualReviewFixture();
  const target = missing.items.find(item => item.privateRef.printedLabelHint === "42");
  target.privateRef.printedLabelHint = "changed";
  rejected = auditor.audit(missing, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /target must be one active item/);

  const wrongReviewPage = manualReviewFixture();
  wrongReviewPage.continuationFragments[0].reviewPage = 2;
  rejected = auditor.audit(wrongReviewPage, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /must belong to its reviewed page/);

  const rejectedTarget = manualReviewFixture();
  const rejectedItem = rejectedTarget.items.find(item => item.privateRef.printedLabelHint === "42");
  rejectedTarget.rejectedCandidates = [{ id: rejectedItem.id }];
  rejectedTarget.counts.rejectedCandidates = 1;
  rejectedTarget.counts.activeQuestionCandidates = rejectedTarget.items.length - 1;
  rejected = auditor.audit(rejectedTarget, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /target must be one active item/);
});

test("private index audit rejects continuation targets without a bound visual review", () => {
  const value = manualReviewFixture();
  value.visualReviewPages = value.visualReviewPages.filter(entry => entry.page !== 2);
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /target must be one active item/);
});

test("private index audit rejects unknown fields on manual review objects", () => {
  const value = manualReviewFixture();
  const manualItem = value.items.find(item => item.privateRef.layoutKind === "manual-reviewed-item");
  manualItem.promptText = "FULL PRIVATE QUESTION BODY";
  manualItem.locator = {
    ...manualItem.locator,
    solutionText: "PRIVATE SOLUTION BODY",
    box: { ...manualItem.locator.box, answerValue: "42" }
  };
  manualItem.privateRef.promptText = "FULL PRIVATE QUESTION BODY";
  value.visualReviewPages.find(entry => entry.resolution === "verified_manual_items")
    .answerValue = "42";
  value.continuationFragments[0].solutionText = "PRIVATE SOLUTION BODY";
  value.continuationFragments[0].continuationFrom.hiddenAnswer = "42";
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.ok(
    rejected.errors.filter(error => /unknown or missing keys/.test(error)).length >= 7,
    rejected.errors.join("\n")
  );
});

test("private index audit rejects overlapping manual item and continuation labels", () => {
  const value = manualReviewFixture();
  const fragmentLabel = value.continuationFragments[0].printedLabelHint;
  const item = value.items.find(entry =>
    entry.privateRef.layoutKind === "manual-reviewed-item" && entry.locator.page === 3
  );
  item.privateRef.printedLabelHint = fragmentLabel;
  item.privateRef.evidenceLocator = `PDF p.3, item ${fragmentLabel}`;
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /manual item and continuation labels overlap/);
});

test("private index audit enforces reviewed label grammar", () => {
  for (const label of ["42", "개념탐구 7", "예제 7-1", "42 (2)-(3)"]) {
    assert.equal(auditor.isReviewedLabel(label), true, label);
  }
  for (const label of ["정답 42", "이 문항은 반드시 시각 검수", "예제 7", "0", "42번"]) {
    assert.equal(auditor.isReviewedLabel(label), false, label);
  }
});

test("private index audit locks manual item state and canonical reuse order", () => {
  const mutations = [
    item => { item.curriculum = { schoolLevel: "middle" }; },
    item => { item.classificationStatus = "reviewed"; },
    item => { item.answerStatus = "verified"; },
    item => { item.releaseStatus = "released"; },
    item => { item.reuse = item.reuse.slice(1); },
    item => { item.reuse = [...item.reuse, item.reuse[0]]; },
    item => { item.reuse = [...item.reuse].reverse(); }
  ];
  for (const mutate of mutations) {
    const value = manualReviewFixture();
    const item = value.items.find(entry => entry.privateRef.layoutKind === "manual-reviewed-item");
    mutate(item);
    const rejected = auditor.audit(value, null);
    assert.equal(rejected.ok, false);
    assert.match(rejected.errors.join("\n"), /protected item state mismatch/);
  }
});

test("private index audit rejects an empty manual visual decision", () => {
  const value = fixture();
  value.sources[0].pageCount = 2;
  value.unresolvedPages = [{
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "private-source",
    page: 2,
    reason: "layout-anchor-not-found"
  }];
  value.counts.unresolvedPages = 1;
  const reviewed = review.applyReviews(value, [{
    sourceMemoryId: "private-source",
    page: 2,
    resolution: "manual_items",
    anchors: [{
      kind: "exercise",
      printedLabelHint: "42",
      layoutOrder: 1,
      box: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
    }]
  }]);
  reviewed.items = reviewed.items.filter(item => item.locator.page !== 2);
  const manualReview = reviewed.visualReviewPages.find(entry => entry.page === 2);
  manualReview.itemCount = 0;
  manualReview.itemIds = [];
  manualReview.evidenceLocator = "PDF p.2, visually reviewed manual items 0";
  reviewed.counts.questionCandidates = reviewed.items.length;
  reviewed.counts.activeQuestionCandidates = reviewed.items.length;
  reviewed.counts.visuallyVerified = 0;
  reviewed.counts.manualVerified = 0;
  const rejected = auditor.audit(reviewed, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /must contain an item or continuation/);
});

test("private index audit requires manual and continuation count fields", () => {
  const value = manualReviewFixture();
  delete value.counts.manualVerified;
  delete value.counts.continuationFragments;
  const rejected = auditor.audit(value, null);
  assert.equal(rejected.ok, false);
  assert.match(rejected.errors.join("\n"), /manualVerified count mismatch/);
  assert.match(rejected.errors.join("\n"), /continuationFragments count mismatch/);
});
