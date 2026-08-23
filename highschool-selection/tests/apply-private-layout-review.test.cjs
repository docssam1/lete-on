const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");
const review = require("../scripts/apply-private-layout-review.cjs");

function fixture() {
  const fingerprint = "1".repeat(64);
  const sourceRef = core.createSharedBankId("source", `sha256:${fingerprint}`);
  return {
    schemaVersion: index.INDEX_SCHEMA_VERSION,
    status: "draft",
    policy: { releaseLocked: true },
    counts: { questionCandidates: 0, excludedPageCandidates: 2, visuallyVerified: 0 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, privateSourceMemoryId: "source-one", pageCount: 5 }],
    items: [],
    excludedPageCandidates: [
      { sourceRef, privateSourceMemoryId: "source-one", page: 2, reason: "candidate", reviewStatus: "pending" },
      { sourceRef, privateSourceMemoryId: "source-one", page: 3, reason: "candidate", reviewStatus: "pending" }
    ],
    unresolvedPages: []
  };
}

test("visual review converts a false exclusion into six locked Mission items", () => {
  const result = review.applyReviews(fixture(), [{ sourceMemoryId: "source-one", page: 2, resolution: "mission" }]);
  assert.equal(result.items.length, 6);
  assert.deepEqual(result.items.map(item => item.privateRef.printedLabelHint), ["1", "2", "3", "4", "5", "6"]);
  assert.ok(result.items.every(item => item.discoveryStatus === "visual_verified"));
  assert.ok(result.items.every(item => item.releaseStatus === "locked" && item.answerStatus === "missing"));
  assert.equal(result.excludedPageCandidates.length, 1);
  assert.equal(result.counts.visuallyVerified, 6);
});

test("visual review confirms a non-question page without creating an item", () => {
  const result = review.applyReviews(fixture(), [{ sourceMemoryId: "source-one", page: 3, resolution: "exclude" }]);
  assert.equal(result.items.length, 0);
  assert.equal(result.excludedPageCandidates[1].reviewStatus, "visual_verified");
  assert.equal(result.counts.verifiedExcludedPages, 1);
});

test("visual review rejects duplicate page decisions", () => {
  assert.throws(() => review.applyReviews(fixture(), [
    { sourceMemoryId: "source-one", page: 2, resolution: "mission" },
    { sourceMemoryId: "source-one", page: 2, resolution: "exclude" }
  ]), /Duplicate decision/);
});

test("visual review resolves an unresolved six-cell Mission page", () => {
  const value = fixture();
  value.unresolvedPages.push({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "layout-anchor-not-found"
  });
  value.counts.unresolvedPages = 1;
  const result = review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 4, resolution: "mission6" }
  ]);
  assert.equal(result.items.length, 6);
  assert.equal(result.unresolvedPages.length, 0);
  assert.equal(result.counts.unresolvedPages, 0);
  assert.equal(result.visualReviewPages[0].resolution, "verified_mission_six_cell");
});

test("visual review converts an unresolved non-question page into a verified exclusion", () => {
  const value = fixture();
  value.unresolvedPages.push({
    sourceRef: value.sources[0].sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "layout-anchor-not-found"
  });
  value.counts.unresolvedPages = 1;
  const result = review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 4, resolution: "exclude" }
  ]);
  assert.equal(result.unresolvedPages.length, 0);
  assert.equal(result.excludedPageCandidates.length, 3);
  assert.equal(result.excludedPageCandidates.filter(entry => entry.reviewStatus === "visual_verified").length, 1);
});

test("visual review rejects a repeated semantic review", () => {
  const value = fixture();
  value.visualReviewPages = [{
    privateSourceMemoryId: "source-one",
    page: 2,
    resolution: "verified_mission_six_cell"
  }];
  assert.throws(() => review.applyReviews(value, [
    { sourceMemoryId: "source-one", page: 2, resolution: "mission6" }
  ]), /already visually reviewed/);
});

test("decision manifests are fingerprint-bound to the private source", () => {
  const value = fixture();
  const source = value.sources[0];
  const decisions = review.decisionsFromManifest({
    schemaVersion: 1,
    sources: [{
      privateSourceMemoryId: source.privateSourceMemoryId,
      sourceFingerprint: source.sourceFingerprint
    }],
    decisions: [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]
  }, value);
  assert.deepEqual(decisions, [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]);

  assert.throws(() => review.decisionsFromManifest({
    schemaVersion: 1,
    sources: [{ privateSourceMemoryId: "source-one", sourceFingerprint: "0".repeat(64) }],
    decisions: [{ sourceMemoryId: "source-one", page: 2, resolution: "mission6" }]
  }, value), /fingerprint mismatch/);
});

test("recorded decision manifests contain only bound source metadata and decisions", () => {
  const value = fixture();
  const manifest = review.createDecisionManifest(value, [
    { sourceMemoryId: "source-one", page: 3, resolution: "exclude" },
    { sourceMemoryId: "source-one", page: 2, resolution: "mission" }
  ]);
  assert.deepEqual(manifest.sources, [{
    privateSourceMemoryId: "source-one",
    sourceFingerprint: value.sources[0].sourceFingerprint
  }]);
  assert.deepEqual(manifest.decisions.map(entry => [entry.page, entry.resolution]), [
    [2, "mission6"],
    [3, "exclude"]
  ]);
  assert.equal(JSON.stringify(manifest).includes("prompt"), false);
});

test("Mission replacement preserves spurious IDs as rejected and appends six new slots", () => {
  const value = fixture();
  const source = value.sources[0];
  const old = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(source.sourceFingerprint, 4, 1)),
    sourceRef: source.sourceRef,
    locator: { page: 4, slot: 1, kind: "exercise", box: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 } },
    discoveryStatus: "layout_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: core.PROGRAM_MODES,
    releaseStatus: "locked"
  });
  value.items.push({ ...old, privateRef: { sourceMemoryId: "source-one", printedLabelHint: "9" } });
  value.counts.questionCandidates = 1;
  value.unresolvedPages.push({
    sourceRef: source.sourceRef,
    privateSourceMemoryId: "source-one",
    page: 4,
    reason: "partial-layout-coverage"
  });
  const result = review.applyReviews(value, [{
    sourceMemoryId: "source-one",
    page: 4,
    resolution: "mission6_replace_candidates"
  }]);

  assert.equal(result.items[0].id, old.id);
  assert.equal(result.rejectedCandidates[0].id, old.id);
  assert.equal(result.items.length, 7);
  assert.deepEqual(result.items.slice(1).map(item => item.locator.slot), [2, 3, 4, 5, 6, 7]);
  assert.equal(result.counts.questionCandidates, 7);
  assert.equal(result.counts.rejectedCandidates, 1);
  assert.equal(result.counts.activeQuestionCandidates, 6);
  assert.equal(result.unresolvedPages.length, 0);
});
