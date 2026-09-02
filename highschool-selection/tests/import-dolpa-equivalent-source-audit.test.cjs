"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");
const dbCore = require("../scripts/build-dolpa-question-db.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");
const importer = require("../scripts/import-dolpa-equivalent-source-audit.cjs");

const PRIMARY = "DP-SRC-111111111111";
const ALTERNATE = "DP-SRC-222222222222";
const PAPER = "DP-M21-202311-R3";

function inventorySource(sourceId, sha256, order) {
  return {
    sourceId,
    sha256,
    canonicalRelativePath: `source-${order}.hwp`,
    aliases: [{ relativePath: `source-${order}.hwp`, fileName: `source-${order}.hwp`, size: 10, modifiedAt: "2026-08-31T00:00:00.000Z", familyHint: "입반시험", courseHint: "중2-1", layer: "운영 폴더", answerNameHint: false }],
    primaryFamilyHint: "입반시험",
    primaryCourseHint: "중2-1",
    primaryLayer: "운영 폴더",
    aliasCount: 1
  };
}

function fixture() {
  const inventory = {
    schemaVersion: 2,
    summary: { sourceCount: 2, duplicatePathCount: 0 },
    sources: [inventorySource(PRIMARY, "1".repeat(64), 1), inventorySource(ALTERNATE, "2".repeat(64), 2)]
  };
  const queue = {
    schemaVersion: 1,
    jobs: [
      { order: 1, sourceId: PRIMARY, status: "변환 완료", outputRelativePath: "primary.pdf", pageCount: 11, outputSize: 100 },
      { order: 2, sourceId: ALTERNATE, status: "변환 완료", outputRelativePath: "alternate.pdf", pageCount: 11, outputSize: 101 }
    ]
  };
  const typeQuestions = Array.from({ length: 30 }, (_, index) => ({
    number: index + 1,
    semester: "중2-1",
    unit: "연립일차방정식",
    type: `문항 유형 ${index + 1}`,
    sourceRelation: "original",
    classificationStatus: "verified"
  }));
  const typeIndex = { schemaVersion: 1, papers: [{ paperId: PAPER, title: "대표 시험", sourceId: PRIMARY, questions: typeQuestions }] };
  const paperLinks = {
    schemaVersion: 1,
    links: [{ paperId: PAPER, sourceId: PRIMARY, evidenceStatus: "verified", evidenceRecordId: "primary.audit", verifiedStages: ["bodyReview", "answerReview", "questionSegmentation", "typeClassification"] }]
  };
  const reviewDecisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [] };
  const ledger = ledgerCore.buildLedger(inventory, queue, typeIndex, paperLinks, reviewDecisions, {
    inventorySha256: "a".repeat(64), queueSha256: "b".repeat(64), typeIndexSha256: "c".repeat(64),
    paperLinksSha256: "d".repeat(64), reviewDecisionsSha256: "e".repeat(64)
  });
  const database = dbCore.buildDatabase(ledger, null, "f".repeat(64));
  const paper = database.papers.find(item => item.paperId === PAPER);
  const questionsById = new Map(database.questions.map(question => [question.questionId, question]));
  const auditQuestions = paper.questionIds.map((questionId, index) => ({
    number: index + 1,
    canonicalQuestionId: questionId,
    canonicalTypeId: questionsById.get(questionId).classification.typeId,
    questionRelation: "exact_content_duplicate",
    learnerFit: { overall: "pending" },
    approvalStatus: "unapproved",
    publicationStatus: "locked"
  }));
  const audit = {
    schemaVersion: importer.AUDIT_SCHEMA,
    visibility: "public-safe-metadata-only",
    sourceId: ALTERNATE,
    sourceFingerprint: "2".repeat(64),
    paperIdProposal: PAPER,
    sourceFacts: { questionCount: 30, pageCount: 11 },
    equivalenceDecision: {
      status: "content_equivalent_existing_paper",
      canonicalSourceId: PRIMARY,
      canonicalPaperId: PAPER,
      newPaperRequired: false,
      newQuestionRowsRequired: 0,
      equivalentSourceRegistrationRequired: true,
      directVisualComparison: {
        sameQuestionCount: 30,
        sameOfficialAnswerCount: 30,
        pixelIdenticalRenderedPages: [1, 2, 3, 4, 5],
        contentIdenticalWithMinorRasterDifferencePages: [6, 7, 8, 9, 10, 11]
      }
    },
    releasePolicy: {
      approvalCount: 0,
      learnerFitOverall: "pending",
      publicationStatus: "locked",
      responseKeyPayloadIncluded: false,
      privateAbsolutePathsIncluded: false
    },
    summary: { answerVerified: 29, answerDisputed: 1, answerNeedsReview: 0, canonicalExactDuplicates: 30 },
    questions: auditQuestions
  };
  const pageManifest = {
    schemaVersion: importer.PAGE_SCHEMA,
    sourceId: ALTERNATE,
    pageCount: 11,
    pdf: { file: `${ALTERNATE}.pdf`, sha256: "9".repeat(64), bytes: 100 },
    pages: Array.from({ length: 11 }, (_, index) => ({ page: index + 1, file: `page-${String(index + 1).padStart(2, "0")}.png`, sha256: String(index + 1).padStart(64, "0"), bytes: index + 1 }))
  };
  const sourceMemory = {
    version: 1,
    name: "private memory",
    root: "G:/private",
    updated: "2026-08-30",
    sources: [],
    records: [{
      id: "dp.question-db.20260827",
      title: "돌파 문항 DB와 반복 방지 작업 장부",
      aliases: [], tags: ["dp"], summary: "기존 요약", status: "verified", sensitivity: "private", updated: "2026-08-30", pointers: []
    }]
  };
  return { database, ledger, typeIndex, paperLinks, reviewDecisions, inventory, queue, sourceMemory, audit, pageManifest };
}

test("동일 원본 감사 결과는 새 시험지·문항·유형 없이 DB와 장부 결정에만 연결한다", () => {
  const value = fixture();
  const result = importer.integrate(value);
  assert.equal(result.database.papers.length, value.database.papers.length);
  assert.equal(result.database.questions.length, value.database.questions.length);
  assert.equal(result.database.typeCatalog.length, value.database.typeCatalog.length);
  const equivalent = result.database.papers[0].equivalentSources[0];
  assert.equal(equivalent.sourceId, ALTERNATE);
  assert.equal(equivalent.relation, "same_question_content_revision");
  assert.equal(equivalent.status, "verified");
  const source = result.ledger.sources.find(item => item.sourceId === ALTERNATE);
  assert.equal(source.paperIds.length, 0);
  assert.equal(source.tasks.bodyReview.status, "verified");
  assert.equal(source.tasks.answerReview.status, "not_applicable");
  assert.equal(source.tasks.learnerFitReview.status, "not_applicable");
  assert.equal(result.ledger.questions.length, value.ledger.questions.length);
  const decision = result.reviewDecisions.sourceReviews.find(item => item.sourceId === ALTERNATE);
  assert.equal(decision.tasks.questionSegmentation.status, "not_applicable");
  assert.equal(result.database.summary.usageApprovedCount, 0);
  assert.equal(result.database.questions.every(question => question.releaseStatus === "locked"), true);
});

test("동일 원본 연결은 같은 입력을 다시 실행해도 하나만 남는다", () => {
  const value = fixture();
  const first = importer.integrate(value);
  const second = importer.integrate({ ...value, database: first.database, ledger: first.ledger, reviewDecisions: first.reviewDecisions });
  assert.equal(second.database.papers[0].equivalentSources.length, 1);
  assert.equal(second.reviewDecisions.sourceReviews.filter(item => item.sourceId === ALTERNATE).length, 1);
  assert.equal(second.database.questions.length, 30);
});

test("대표 문항 ID나 원본 지문이 다르면 등가 연결을 거부한다", () => {
  const mismatch = fixture();
  mismatch.audit.questions[4].canonicalQuestionId = mismatch.audit.questions[3].canonicalQuestionId;
  assert.throws(() => importer.integrate(mismatch), /대표 시험 문항 연결/);

  const fingerprintMismatch = fixture();
  fingerprintMismatch.audit.sourceFingerprint = "3".repeat(64);
  assert.throws(() => importer.integrate(fingerprintMismatch), /지문이 다릅니다/);
});

test("승인이나 공개 상태를 넓히는 감사 입력은 거부한다", () => {
  const approved = fixture();
  approved.audit.releasePolicy.approvalCount = 1;
  assert.throws(() => importer.integrate(approved), /공개 잠금/);

  const released = fixture();
  released.audit.questions[0].publicationStatus = "published";
  assert.throws(() => importer.integrate(released), /잠금 상태/);
});

test("스테이징 출력은 새 절대경로·원문·정답 값 없이 출처 메모리 포인터를 만든다", () => {
  const value = fixture();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dolpa-equivalent-"));
  const auditPath = path.join(root, "audit.json");
  const pagePath = path.join(root, "page-manifest.json");
  fs.writeFileSync(auditPath, JSON.stringify(value.audit));
  fs.writeFileSync(pagePath, JSON.stringify(value.pageManifest));
  const result = importer.stage(value, path.join(root, "out"), "dolpa-equivalent-review-dp-m21-202311-r3-alt-c9d7-v1", { audit: auditPath, pageManifest: pagePath });
  const record = result.sourceMemory.records.find(item => item.id === importer.recordKey(value.audit));
  assert.equal(record.status, "verified");
  assert.equal(record.pointers.length, 5);
  assert.equal(result.manifest.createdPaperRows, 0);
  assert.equal(result.manifest.createdQuestionRows, 0);
  assert.equal(result.manifest.createdTypeRows, 0);
  assert.equal(result.manifest.usageApprovalCount, 0);
  assert.equal(JSON.stringify(result.sourceMemory).includes(root), false);
  assert.doesNotThrow(() => importer.assertCatalogSafe(result.sourceMemory));
  const db = JSON.parse(fs.readFileSync(result.outputs.database, "utf8"));
  assert.equal(db.questions.length, 30);
});
