const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../data/question-bank-core.js");
const lineage = require("../data/source-lineage.js");
const sourceSecurity = require("../shared/source-asset-security.js");

const mode = "DG";
const sourceAssetId = core.createNeutralId("source", mode, "registry:source-asset");
const fingerprint = `sha256:${"a".repeat(64)}`;
const sourceReference = lineage.createSourceAssetReference({
  sourceAssetId,
  sourceFingerprint: fingerprint,
  pageNumber: 4,
  itemLocator: { code: "ITEM_04" },
  bbox: { x: 0.1, y: 0.2, width: 0.7, height: 0.5 },
  assetVariant: "original"
});

test("source references keep fingerprint and crop metadata but reject direct locations", () => {
  assert.deepEqual(Object.keys(sourceReference), [
    "sourceAssetId",
    "sourceFingerprint",
    "pageNumber",
    "itemLocator",
    "bbox",
    "assetVariant",
    "deliveryPolicy"
  ]);
  assert.equal(sourceReference.deliveryPolicy, "signed-page-images");
  assert.throws(() => lineage.createSourceAssetReference({
    sourceAssetId,
    sourceFingerprint: fingerprint,
    pageNumber: 4,
    itemLocator: { code: "ITEM_04" },
    assetVariant: "original",
    pdfUrl: "forbidden"
  }), /cannot contain pdfUrl/);
});

test("lineage binds source round, original question, type, and derived relation", () => {
  const originalQuestionId = core.createNeutralId("question", mode, "registry:original-question");
  const derivedQuestionId = core.createNeutralId("question", mode, "registry:twin-question");
  const record = lineage.createQuestionLineage({
    mode,
    id: core.createNeutralId("lineage", mode, "registry:twin-lineage"),
    sourceExamId: core.createNeutralId("exam", mode, "registry:source-round"),
    originalQuestionId,
    questionId: derivedQuestionId,
    questionTypeId: core.createNeutralId("type", mode, "registry:question-type"),
    relation: "twin",
    sourceAsset: { ...sourceReference, assetVariant: "twin" }
  });
  assert.equal(record.relation, "twin");
  assert.equal(record.originalQuestionId, originalQuestionId);
  assert.notEqual(record.questionId, record.originalQuestionId);
});

test("source raster delivery reuses the student-bound signed image manifest policy", () => {
  const now = Date.parse("2026-08-21T00:00:00Z");
  const exam = { id: core.createNeutralId("exam", mode, "registry:delivery-exam") };
  const session = { studentId: "student-1" };
  const runtime = { assetMode: "signed-page-images", assetHosts: ["assets.example.test"], maxPageUrlTtlSeconds: 900 };
  const manifest = {
    examId: exam.id,
    studentId: session.studentId,
    expiresAt: "2026-08-21T00:10:00Z",
    sourceAssetId,
    sourceFingerprint: fingerprint,
    sourcePageNumber: 4,
    pages: [{ number: 1, url: "https://assets.example.test/source/page.png?sig=opaque", mimeType: "image/png" }]
  };

  const verified = sourceSecurity.validateSourceRasterManifest(manifest, sourceReference, exam, session, runtime, now);
  assert.equal(verified.sourcePageNumber, 4);
  assert.equal(verified.raster.mimeType, "image/png");
  assert.throws(() => sourceSecurity.validateSourceRasterManifest(
    { ...manifest, sourceFingerprint: `sha256:${"b".repeat(64)}` },
    sourceReference,
    exam,
    session,
    runtime,
    now
  ), /지문/);
});
