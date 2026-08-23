const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");
const merger = require("../scripts/merge-private-layout-index.cjs");

function baseFixture() {
  const fingerprint = "e".repeat(64);
  const sourceRef = core.createSharedBankId("source", `sha256:${fingerprint}`);
  const first = index.createItemIndexEntry({
    id: core.createSharedBankId("question", index.createLocatorKey(fingerprint, 3, 1)),
    sourceRef,
    locator: { page: 3, slot: 1, kind: "exercise", box: { x: 0.04, y: 0.2, width: 0.43, height: 0.2 } },
    discoveryStatus: "ocr_candidate",
    curriculum: null,
    classificationStatus: "pending",
    answerStatus: "missing",
    reuse: ["SH"],
    releaseStatus: "locked"
  });
  return {
    schemaVersion: 1,
    status: "draft",
    policy: { releaseLocked: true },
    counts: { sources: 1, questionCandidates: 1, unresolvedPages: 1 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, privateSourceMemoryId: "src-private", pageCount: 3 }],
    items: [{ ...first, privateRef: { sourceMemoryId: "src-private" } }],
    unresolvedPages: [{ sourceRef, privateSourceMemoryId: "src-private", page: 3, reason: "pending" }]
  };
}

test("v2 merge preserves old IDs and appends slots after the existing maximum", () => {
  const base = baseFixture();
  const oldId = base.items[0].id;
  const fingerprint = base.sources[0].sourceFingerprint;
  const result = merger.mergeIndex(base, {
    sources: [{
      sourceMemoryId: "src-private",
      sourceFingerprint: fingerprint,
      pages: [{
        page: 3,
        disposition: "layout_candidate",
        layoutKind: "two-column-numbered",
        coverageStatus: "partial",
        anchors: [
          { kind: "exercise", printedLabelHint: "11", layoutOrder: 1, box: { x: 0.04, y: 0.2, width: 0.43, height: 0.2 } },
          { kind: "exercise", printedLabelHint: "12", layoutOrder: 2, box: { x: 0.04, y: 0.45, width: 0.43, height: 0.2 } }
        ]
      }]
    }]
  });

  assert.equal(result.items[0].id, oldId);
  assert.equal(result.schemaVersion, index.INDEX_SCHEMA_VERSION);
  assert.equal(result.predecessorSchemaVersion, 1);
  assert.equal(result.counts.addedLayoutCandidates, 1);
  assert.equal(result.items[1].locator.slot, 2);
  assert.equal(result.items[1].discoveryStatus, "layout_candidate");
  assert.notEqual(result.items[1].id, oldId);
  assert.equal(result.unresolvedPages[0].reason, "partial-layout-coverage");
});

test("exclusion candidates never become question items automatically", () => {
  const base = baseFixture();
  const result = merger.mergeIndex(base, {
    sources: [{
      sourceMemoryId: "src-private",
      sourceFingerprint: base.sources[0].sourceFingerprint,
      pages: [{ page: 3, disposition: "excluded_candidate", reason: "score-sheet" }]
    }]
  });

  assert.equal(result.items.length, 1);
  assert.equal(result.excludedPageCandidates.length, 1);
  assert.equal(result.excludedPageCandidates[0].reviewStatus, "pending");
});

test("partial layout runs preserve unresolved pages that were not processed", () => {
  const base = baseFixture();
  base.sources[0].pageCount = 4;
  base.unresolvedPages = [
    { sourceRef: base.sources[0].sourceRef, privateSourceMemoryId: "src-private", page: 2, reason: "pending" },
    { sourceRef: base.sources[0].sourceRef, privateSourceMemoryId: "src-private", page: 3, reason: "pending" }
  ];
  const result = merger.mergeIndex(base, {
    sources: [{
      sourceMemoryId: "src-private",
      sourceFingerprint: base.sources[0].sourceFingerprint,
      pages: [{ page: 2, disposition: "unresolved", reason: "layout-anchor-not-found" }]
    }]
  });

  assert.deepEqual(
    result.unresolvedPages.map(entry => [entry.page, entry.reason]),
    [[2, "layout-anchor-not-found"], [3, "pending"]]
  );
  assert.equal(result.counts.unresolvedPages, 2);
});
