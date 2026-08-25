"use strict";

const http = require("node:http");
const path = require("node:path");
const { createApp } = require("../../server/app.js");
const { hashApprovalCode } = require("../../server/security.js");
const questionBankCore = require("../../data/question-bank-core.js");
const sourceLineage = require("../../data/source-lineage.js");

const SECRET = "exam-editor-browser-fixture-secret-2026";

function question(index, overrides) {
  const options = overrides || {};
  const mode = "SH";
  const relation = options.relation || "original";
  const questionId = questionBankCore.createNeutralId("question", mode, `browser-editor:item-${index}`);
  const originalQuestionId = relation === "original" ? questionId : options.originalQuestionId;
  const familyId = options.familyId || originalQuestionId;
  const typeId = options.typeId || questionBankCore.createNeutralId("type", mode, `browser-editor:type-${index}`);
  return {
    id: questionId,
    itemVersionId: `browser-editor-${index}-v1`,
    mode,
    writer: "T",
    curriculum: questionBankCore.createCurriculumPath({
      grade: "G10",
      major: options.major || "M01",
      minor: options.minor || `S${String(index).padStart(2, "0")}`,
      detail: options.detail || `D${String(index).padStart(2, "0")}`
    }),
    provenance: questionBankCore.createProvenanceRecord({
      mode,
      role: "internal-variant",
      status: "cleared",
      referenceId: questionBankCore.createNeutralId("source", mode, `browser-editor:source-${index}`)
    }),
    answerVerification: questionBankCore.createAnswerVerification({ status: "verified", reviewCount: 2 }),
    inputType: options.inputType || "input",
    generationKind: options.figure ? "figure_only" : "parameterized",
    difficultyBand: options.difficultyBand || "standard",
    variant: questionBankCore.createVariantRecord({ mode, familyId, band: options.difficultyBand || "standard" }),
    lineage: sourceLineage.createQuestionLineage({
      mode,
      id: questionBankCore.createNeutralId("lineage", mode, `browser-editor:lineage-${index}`),
      sourceExamId: questionBankCore.createNeutralId("exam", mode, "browser-editor:exam"),
      originalQuestionId,
      questionId,
      questionTypeId: typeId,
      relation,
      sourceAsset: sourceLineage.createSourceAssetReference({
        sourceAssetId: questionBankCore.createNeutralId("source", mode, `browser-editor:asset-${index}`),
        sourceFingerprint: `sha256:${String(index).padStart(64, "0")}`,
        pageNumber: index,
        itemLocator: { code: `B${index}` },
        assetVariant: relation
      })
    }),
    userApproval: sourceLineage.createUserApproval({
      mode,
      id: questionBankCore.createNeutralId("approval", mode, `browser-editor:approval-${index}`),
      questionId,
      status: "approved",
      decisionVersion: 1
    }),
    singleAnswerAudit: { status: "passed", validOutcomeCount: 1, evidenceCode: `BROWSER-${index}` },
    figureAudit: options.figure
      ? { required: true, status: "passed", evidenceVisible: true, hiddenStateConstrained: true, positionUnambiguous: true, contrastSufficient: true }
      : { required: false, status: "not_required", evidenceVisible: false, hiddenStateConstrained: false, positionUnambiguous: false, contrastSufficient: false },
    reviewStatus: "approved",
    typeCode: options.typeCode || `ALG_TYPE_${String(index).padStart(2, "0")}`
  };
}

const q1 = question(1, { difficultyBand: "lowered", inputType: "single_choice", typeCode: "ALG_NUMBER" });
const q2 = question(2, { difficultyBand: "standard", typeCode: "ALG_EQUATION" });
const q3 = question(3, { difficultyBand: "raised", inputType: "multi_input", typeCode: "ALG_FUNCTION" });
const q4 = question(4, { difficultyBand: "standard", inputType: "figure_select", figure: true, typeCode: "GEO_SOLID" });
const q5 = question(5, { difficultyBand: "raised", inputType: "construction", figure: true, typeCode: "GEO_CONSTRUCTION" });
const q6 = question(6, { major: "M02", difficultyBand: "standard", typeCode: "PROBABILITY" });
const q7 = question(7, { relation: "twin", originalQuestionId: q1.id, familyId: q1.id, typeId: q1.lineage.questionTypeId, difficultyBand: "lowered", inputType: "single_choice", typeCode: "ALG_NUMBER" });
const q8 = question(8, { relation: "similar", originalQuestionId: q2.id, familyId: q2.id, typeId: q2.lineage.questionTypeId, difficultyBand: "raised", typeCode: "ALG_EQUATION" });

const registry = {
  schemaVersion: "highselect-private-exam-editor-registry/v1",
  candidates: Object.fromEntries([q1, q2, q3, q4, q5, q6, q7, q8].map(item => [item.id, item])),
  relations: {
    browser_twin_q1_q7: {
      evidenceId: "browser_twin_q1_q7", status: "approved", relationship: "twin",
      sourceItemId: q1.id, sourceItemVersionId: q1.itemVersionId,
      candidateItemId: q7.id, candidateItemVersionId: q7.itemVersionId,
      familyMatched: true, detailMatched: true, solutionStructureMatched: true, difficultyCompatible: true
    },
    browser_similar_q2_q8: {
      evidenceId: "browser_similar_q2_q8", status: "approved", relationship: "similar",
      sourceItemId: q2.id, sourceItemVersionId: q2.itemVersionId,
      candidateItemId: q8.id, candidateItemVersionId: q8.itemVersionId,
      familyMatched: true, detailMatched: true, solutionStructureMatched: true, difficultyCompatible: true
    }
  }
};

const privateConfig = {
  schemaVersion: "highselect-private-config/v1",
  students: [{
    studentId: "admin_browser_fixture",
    name: "편집관리자",
    approvalCodeHash: hashApprovalCode("ADMIN-EDITOR", Buffer.alloc(16, 1).toString("base64url")),
    role: "admin",
    grants: []
  }],
  exams: {}
};

const app = createApp({
  sessionSecret: SECRET,
  assetSecret: `${SECRET}-asset`,
  privateConfig,
  privateScorer: { schemaVersion: "highselect-private-scorer/v1", exams: {} },
  privateExamEditorRegistry: registry,
  privateExamDrafts: { schemaVersion: "highselect-private-exam-drafts/v1", drafts: {} },
  cookieSecure: false,
  staticRoot: path.resolve(__dirname, "../..")
});

const port = Number(process.env.PORT == null ? 8794 : process.env.PORT);
const server = http.createServer(app);
server.listen(port, "127.0.0.1", function () {
  process.stdout.write(`exam editor fixture listening on http://127.0.0.1:${server.address().port}\n`);
});
