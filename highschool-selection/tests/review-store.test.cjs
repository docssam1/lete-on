const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const reviewStore = require("../server/review-store.js");

function packet(root) {
  return {
    schemaVersion: reviewStore.SCHEMA_VERSION,
    reviews: {
      "sh-selection-r01": {
        examId: "sh-selection-r01",
        roundCode: "SH-R01",
        reviewVersion: "rv-store-test",
        examChecks: {
          responseSchemaStatus: "verified",
          scoringPolicyStatus: "verified",
          printAuditStatus: "passed",
          signedAssetStatus: "verified"
        },
        items: [{
          itemId: "SH-R01-Q01",
          number: 1,
          answerStatus: "verified",
          classificationStatus: "verified",
          visualStatus: "passed",
          sourceFingerprintMatched: true,
          correctionArtifactMatched: true,
          resolutionStatus: "pending",
          scoringExclusionAllowed: false,
          evidencePanels: []
        }],
        finalConfirmation: null
      }
    }
  };
}

test("private review schema rejects unknown metadata and relative evidence paths", () => {
  const root = os.tmpdir();
  const unknown = packet(root);
  unknown.reviews["sh-selection-r01"].items[0].correctAnswer = "hidden";
  assert.throws(() => reviewStore.normalize(unknown), /not allowed/);

  const relative = packet(root);
  relative.reviews["sh-selection-r01"].items[0].evidencePanels = [
    { role: "problem", assetPath: "problem.png", mimeType: "image/png" },
    { role: "source-key", assetPath: "key.png", mimeType: "image/png" },
    { role: "independent-audit", assetPath: "audit.png", mimeType: "image/png" }
  ];
  assert.throws(() => reviewStore.normalize(relative), /must be absolute/);
});

test("file review store uses revision checks and leaves no temporary file", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-review-store-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const filePath = path.join(root, "reviews.json");
  fs.writeFileSync(filePath, `${JSON.stringify(packet(root), null, 2)}\n`, "utf8");
  const store = reviewStore.createStore({ filePath });
  const before = store.read("sh-selection-r01");
  const saved = store.update("sh-selection-r01", before.revision, review => {
    review.items[0].resolutionStatus = "agent_verified";
    return review;
  });
  assert.equal(saved.review.items[0].resolutionStatus, "agent_verified");
  assert.throws(() => store.update("sh-selection-r01", before.revision, value => value), error => error.code === "REVIEW_CONFLICT");
  assert.equal(fs.readdirSync(root).some(name => name.endsWith(".tmp") || name.endsWith(".lock")), false);
});

test("live review lock fails closed while a stale dead lock is reclaimed", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "highselect-review-lock-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const filePath = path.join(root, "reviews.json");
  fs.writeFileSync(filePath, `${JSON.stringify(packet(root), null, 2)}\n`, "utf8");
  const lockPath = `${filePath}.lock`;
  const store = reviewStore.createStore({ filePath, staleLockMs: 60 * 1000 });
  const current = store.read("sh-selection-r01");
  fs.writeFileSync(lockPath, JSON.stringify({ pid: process.pid }), "utf8");
  assert.throws(() => store.update("sh-selection-r01", current.revision, value => value), error => error.code === "REVIEW_BUSY");
  fs.unlinkSync(lockPath);

  fs.writeFileSync(lockPath, JSON.stringify({ pid: 999999999 }), "utf8");
  const old = new Date(Date.now() - 2 * 60 * 1000);
  fs.utimesSync(lockPath, old, old);
  const saved = store.update("sh-selection-r01", current.revision, review => {
    review.items[0].resolutionStatus = "agent_verified";
    return review;
  });
  assert.equal(saved.review.items[0].resolutionStatus, "agent_verified");
  assert.equal(fs.existsSync(lockPath), false);
});
