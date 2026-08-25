const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../data/question-bank-core.js");
const lineage = require("../data/source-lineage.js");
const printPolicy = require("../data/print-exam-policy.js");
const printSecurity = require("../shared/print-exam-security.js");
const printRenderer = require("../shared/print-exam-renderer.js");

const mode = "SM";
const sourceExamId = core.createNeutralId("exam", mode, "registry:source-round");
const targetExamId = core.createNeutralId("exam", mode, "registry:target-exam");
const questionTypeId = core.createNeutralId("type", mode, "registry:type-001");
const questionIds = {
  original: core.createNeutralId("question", mode, "registry:original-001"),
  twin: core.createNeutralId("question", mode, "registry:twin-001"),
  similar: core.createNeutralId("question", mode, "registry:similar-001")
};

function sourceRef(relation, suffix) {
  return lineage.createSourceAssetReference({
    sourceAssetId: core.createNeutralId("source", mode, `registry:asset-${suffix}`),
    sourceFingerprint: `sha256:${suffix.repeat(64).slice(0, 64)}`,
    pageNumber: 1,
    itemLocator: { code: `ITEM_${suffix.toUpperCase()}` },
    bbox: { x: 0.1, y: 0.1, width: 0.8, height: 0.7 },
    assetVariant: relation
  });
}

function lineageRecord(relation, suffix) {
  return lineage.createQuestionLineage({
    mode,
    id: core.createNeutralId("lineage", mode, `registry:lineage-${suffix}`),
    sourceExamId,
    originalQuestionId: questionIds.original,
    questionId: questionIds[relation],
    questionTypeId,
    relation,
    sourceAsset: sourceRef(relation, suffix)
  });
}

function approvalRecord(relation, suffix, status = "approved") {
  return lineage.createUserApproval({
    mode,
    id: core.createNeutralId("approval", mode, `registry:approval-${suffix}`),
    questionId: questionIds[relation],
    status,
    decisionVersion: 1
  });
}

const records = {
  original: lineageRecord("original", "a"),
  twin: lineageRecord("twin", "b"),
  similar: lineageRecord("similar", "c")
};
const approvals = {
  original: approvalRecord("original", "a"),
  twin: approvalRecord("twin", "b"),
  similar: approvalRecord("similar", "c")
};
const layoutProfile = printPolicy.createLayoutProfile({
  mode,
  id: core.createNeutralId("policy", mode, "registry:layout-profile"),
  referenceDesignFingerprint: `sha256:${"d".repeat(64)}`,
  referenceSourceFingerprint: `sha256:${"c".repeat(64)}`,
  pageSize: "A4",
  marginTopMm: 12,
  marginRightMm: 10,
  marginBottomMm: 12,
  marginLeftMm: 10,
  columns: 2,
  gutterMm: 6,
  headerHeightMm: 20,
  bodyTopMm: 40,
  footerBaselineMm: 280,
  columnRule: true,
  numberColor: "#008b23"
});
const printPlan = printPolicy.createPrintPlan({
  mode,
  writer: "T",
  id: core.createNeutralId("policy", mode, "registry:print-plan"),
  examId: targetExamId,
  layoutProfileId: layoutProfile.id,
  printPlanFingerprint: `sha256:${"e".repeat(64)}`,
  assemblyEligible: true,
  approvalStatus: "approved",
  pages: [{
    number: 1,
    assetVariant: "original",
    sourceRefs: [records.original.sourceAsset],
    lineageIds: [records.original.id]
  }]
});

test("approved service chain is fixed to original, twin, then similar", () => {
  const chain = lineage.createApprovedServiceChain({ mode, ...records, approvals });
  assert.deepEqual(chain.stages.map(stage => stage.relation), ["original", "twin", "similar"]);
  assert.equal(chain.originalQuestionId, questionIds.original);
  assert.equal(chain.stages.every(stage => stage.approval.status === "approved"), true);

  assert.throws(() => lineage.createApprovedServiceChain({
    mode,
    ...records,
    approvals: { ...approvals, similar: approvalRecord("similar", "pending", "pending") }
  }), /not approved/);
});

test("print plan stores only approved neutral references and layout measurements", () => {
  assert.equal(printPlan.rasterPolicy, "signed-page-images");
  assert.equal(printPlan.pages[0].renderMode, "server-raster");
  assert.equal(printPlan.pages[0].sourceRefs[0].sourceAssetId, records.original.sourceAsset.sourceAssetId);
  assert.equal(Object.hasOwn(printPlan, "questionText"), false);
  assert.throws(() => printPolicy.createPrintPlan({
    mode,
    writer: "T",
    id: core.createNeutralId("policy", mode, "registry:leaking-plan"),
    examId: targetExamId,
    layoutProfileId: layoutProfile.id,
    printPlanFingerprint: `sha256:${"0".repeat(64)}`,
    assemblyEligible: true,
    approvalStatus: "approved",
    questionText: "blocked",
    pages: printPlan.pages
  }), /cannot contain questionText/);
  assert.throws(() => printPolicy.createPrintPlan({
    mode,
    writer: "T",
    id: core.createNeutralId("policy", mode, "registry:blocked-plan"),
    examId: targetExamId,
    layoutProfileId: layoutProfile.id,
    printPlanFingerprint: `sha256:${"f".repeat(64)}`,
    assemblyEligible: true,
    approvalStatus: "pending",
    pages: printPlan.pages
  }), /user approval/);
});

test("signed raster packet is bound to the exact plan and reference design", () => {
  const now = Date.parse("2026-08-21T00:00:00Z");
  const exam = { id: targetExamId, pageCount: 1 };
  const session = { studentId: "student-1" };
  const runtime = { assetMode: "signed-page-images", assetHosts: ["assets.example.test"], maxPageUrlTtlSeconds: 900 };
  const manifest = {
    examId: targetExamId,
    studentId: session.studentId,
    expiresAt: "2026-08-21T00:10:00Z",
    printPlanId: printPlan.id,
    printPlanFingerprint: printPlan.printPlanFingerprint,
    layoutProfileId: layoutProfile.id,
    referenceDesignFingerprint: layoutProfile.referenceDesignFingerprint,
    pages: [{ number: 1, url: "https://assets.example.test/print/page.png?sig=opaque", mimeType: "image/png" }]
  };
  const packet = printSecurity.validatePrintPacket(manifest, printPlan, layoutProfile, exam, session, runtime, now);
  const documentModel = printRenderer.createPrintDocumentModel(packet);
  assert.equal(packet.verified, true);
  assert.equal(documentModel.pages.length, 1);
  assert.equal(documentModel.pages[0].assetVariant, "original");

  assert.throws(() => printSecurity.validatePrintPacket(
    { ...manifest, referenceDesignFingerprint: `sha256:${"0".repeat(64)}` },
    printPlan,
    layoutProfile,
    exam,
    session,
    runtime,
    now
  ), /디자인 지문/);
  assert.throws(() => printSecurity.validatePrintPacket(
    { ...manifest, answerKey: "blocked" },
    printPlan,
    layoutProfile,
    exam,
    session,
    runtime,
    now
  ), /비공개 문항 정보/);
});

test("renderer is image-only, A4 print-safe, and does not inject HTML", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "shared", "print-exam-renderer.js"), "utf8");
  assert.equal(source.includes("innerHTML"), false);
  assert.equal(printRenderer.PRINT_CSS.includes("@page { size: A4 portrait; margin: 0; }"), true);
  assert.equal(printRenderer.PRINT_CSS.includes("210mm"), true);
  assert.equal(printRenderer.PRINT_CSS.includes("297mm"), true);
});
