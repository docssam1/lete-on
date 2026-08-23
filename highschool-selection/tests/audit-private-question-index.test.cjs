const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const index = require("../data/question-item-index.js");
const auditor = require("../scripts/audit-private-question-index.cjs");

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
    counts: { questionCandidates: 1, unresolvedPages: 0, excludedPageCandidates: 0 },
    sources: [{ sourceRef, sourceFingerprint: fingerprint, pageCount: 1 }],
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
