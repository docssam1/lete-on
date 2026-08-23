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
