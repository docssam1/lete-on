"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { registerSources, applyToDatabase, validatePacket } = require("../scripts/register-dolpa-reviewed-paper.cjs");
const { exportReviewPacket } = require("../scripts/export-dolpa-paper-review.cjs");
const { stableQuestionId, stableTypeId } = require("../scripts/build-dolpa-work-ledger.cjs");

function packet() {
  return {
    schemaVersion: "highselect-dolpa-paper-review/v1",
    sourceId: "DP-SRC-123456789ABC",
    sourceFingerprint: "a".repeat(64),
    paperId: "DP-M21A-R2",
    title: "돌파 2-1A 2회",
    registryEvidenceRecordId: "registry-audit",
    evidenceRecordId: "paper-audit",
    paperEvidenceId: "registry-audit",
    locatorEvidenceId: "paper-audit",
    responseEvidenceId: "paper-audit",
    answerEvidenceId: "answer-audit",
    reviewedAt: "2026-08-29",
    coverage: {
      coverageKind: "mid_unit_cutoff",
      declaredScopeLabel: "중1-1~중2-1 일차부등식까지",
      observedTerminal: { semester: "중2-1", unit: "일차부등식" },
      note: "마지막 진도 단원을 직접 확인"
    },
    questions: Array.from({ length: 30 }, (_, index) => ({
      number: index + 1,
      page: 3 + Math.floor(index / 4),
      slot: index % 4 + 1,
      responseFormat: index === 7 ? "multi_select" : "open_response",
      slotCount: index === 7 ? 2 : 1,
      semester: index < 10 ? "중1-1" : "중2-1",
      unit: index < 10 ? "일차방정식" : "일차부등식",
      typeLabel: `검수 유형 ${index + 1}`
    }))
  };
}

test("검수한 시험지를 원본 유형표와 연결표에 한 번만 등록한다", () => {
  const source = { schemaVersion: 1, totalQuestionCount: 0, papers: [] };
  const links = { schemaVersion: 1, links: [] };
  const decisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [] };
  const first = registerSources(source, links, decisions, packet());
  const second = registerSources(first.typeIndex, first.paperLinks, first.reviewDecisions, packet());
  assert.equal(second.typeIndex.papers.length, 1);
  assert.equal(second.typeIndex.totalQuestionCount, 30);
  assert.equal(second.paperLinks.links.length, 1);
  assert.equal(second.reviewDecisions.sourceReviews.length, 1);
  assert.deepEqual(second.typeIndex, first.typeIndex);
});

test("표본 확인 상태를 직접 검수 완료로 올리면서 기존 작업 기록을 보존한다", () => {
  const source = { schemaVersion: 1, totalQuestionCount: 0, papers: [] };
  const links = { schemaVersion: 1, links: [] };
  const decisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [{
    sourceId: packet().sourceId,
    tasks: {
      bodyReview: { status: "sampled", evidence: ["older-sample"], note: "일부 페이지만 확인" },
      answerReview: { status: "sampled", evidence: ["older-sample"] },
      pdfAudit: { status: "verified", evidence: ["pdf-audit"] }
    }
  }] };
  const first = registerSources(source, links, decisions, packet());
  const second = registerSources(first.typeIndex, first.paperLinks, first.reviewDecisions, packet());
  const tasks = second.reviewDecisions.sourceReviews[0].tasks;
  assert.equal(tasks.bodyReview.status, "verified");
  assert.deepEqual(tasks.bodyReview.evidence, ["older-sample", packet().registryEvidenceRecordId].sort());
  assert.equal(tasks.answerReview.status, "verified");
  assert.deepEqual(tasks.answerReview.evidence, ["older-sample", packet().registryEvidenceRecordId].sort());
  assert.deepEqual(tasks.pdfAudit, { status: "verified", evidence: ["pdf-audit"] });
  assert.deepEqual(second.reviewDecisions, first.reviewDecisions);
});

test("이미 확정된 단계에는 새 원본 근거만 더하고 기존 설명을 보존한다", () => {
  const source = { schemaVersion: 1, totalQuestionCount: 0, papers: [] };
  const links = { schemaVersion: 1, links: [] };
  const decisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [{
    sourceId: packet().sourceId,
    tasks: {
      bodyReview: { status: "verified", evidence: ["older-direct-review"], note: "기존 직접 검수" }
    }
  }] };
  const result = registerSources(source, links, decisions, packet());
  const bodyReview = result.reviewDecisions.sourceReviews[0].tasks.bodyReview;
  assert.equal(bodyReview.status, "verified");
  assert.equal(bodyReview.note, "기존 직접 검수");
  assert.deepEqual(bodyReview.evidence, ["older-direct-review", packet().registryEvidenceRecordId].sort());
});

test("기존 차단 상태는 자동으로 지우지 않는다", () => {
  const source = { schemaVersion: 1, totalQuestionCount: 0, papers: [] };
  const links = { schemaVersion: 1, links: [] };
  const decisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [{
    sourceId: packet().sourceId,
    tasks: { bodyReview: { status: "blocked", evidence: ["source-mismatch"] } }
  }] };
  assert.throws(() => registerSources(source, links, decisions, packet()), /기존 차단 사유/);
});

test("재생성한 DB에 문항 위치와 답안 확인 상태와 실제 종료 단원을 되살린다", () => {
  const review = packet();
  const questions = review.questions.map(item => ({
    questionId: stableQuestionId(review.sourceId, item.number), sourceId: review.sourceId, paperId: review.paperId, number: item.number,
    locator: { page: null, slot: null, status: "pending", evidence: [] },
    classification: { semester: item.semester, domain: "문자와 식", unit: item.unit, majorUnit: "문자와 식", minorUnit: item.unit,
      typeId: stableTypeId(item.semester, item.unit, item.typeLabel), typeLabel: item.typeLabel, status: "verified", evidence: ["paper-audit"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] }, difficulty: { band: null, status: "pending", evidence: [] },
    responseFormat: { kind: null, slotCount: null, status: "pending", evidence: [] }, answerCheck: { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: stableQuestionId(review.sourceId, item.number), twinIds: [], similarIds: [] },
    usageProfiles: [], releaseStatus: "locked"
  }));
  const db = { schemaVersion: 1, papers: [{ paperId: review.paperId, sourceId: review.sourceId, sourceFingerprint: review.sourceFingerprint }], questions };
  const result = applyToDatabase(db, review);
  assert.equal(result.questions[7].responseFormat.kind, "multi_select");
  assert.equal(result.questions[7].responseFormat.slotCount, 2);
  assert.equal(result.questions[29].locator.page, 10);
  assert.equal(result.questions[29].answerCheck.status, "verified");
  assert.equal(result.papers[0].coverage.observedTerminal.unit, "일차부등식");
  assert.equal(result.questions[0].responseFormat.kind, "input");
});

test("문제 원문과 정답이 든 검수표는 받지 않는다", () => {
  const review = packet();
  review.questions[0].answerValue = 5;
  assert.throws(() => validatePacket(review), /forbidden/);
});

test("검수 완료 DB에서 원문과 정답 없이 재등록 묶음을 만든다", () => {
  const review = packet();
  const questions = review.questions.map(item => ({
    number: item.number, paperId: review.paperId,
    locator: { page: item.page, slot: item.slot, status: "verified", evidence: [review.evidenceRecordId] },
    classification: { semester: item.semester, unit: item.unit, typeLabel: item.typeLabel },
    responseFormat: { kind: item.responseFormat, slotCount: item.slotCount, status: "verified", evidence: [review.responseEvidenceId] },
    answerCheck: { status: "verified", evidence: [review.answerEvidenceId] }
  }));
  const db = { papers: [{
    paperId: review.paperId, sourceId: review.sourceId, sourceFingerprint: review.sourceFingerprint, title: review.title,
    evidence: [review.registryEvidenceRecordId],
    coverage: { ...review.coverage, evidence: [review.evidenceRecordId] }
  }], questions };
  assert.deepEqual(exportReviewPacket(db, review.paperId, review.reviewedAt), review);
});

test("단계별 근거가 여러 개여도 기존 시험지 연결표의 확정 근거를 사용한다", () => {
  const review = packet();
  const questions = review.questions.map(item => ({
    number: item.number, paperId: review.paperId,
    locator: { page: item.page, slot: item.slot, status: "verified", evidence: [review.evidenceRecordId] },
    classification: { semester: item.semester, unit: item.unit, typeLabel: item.typeLabel },
    responseFormat: { kind: item.responseFormat, slotCount: item.slotCount, status: "verified", evidence: [review.responseEvidenceId] },
    answerCheck: { status: "verified", evidence: [review.answerEvidenceId] }
  }));
  const db = { papers: [{
    paperId: review.paperId, sourceId: review.sourceId, sourceFingerprint: review.sourceFingerprint, title: review.title,
    evidence: ["older-paper-evidence"], coverage: { ...review.coverage, evidence: [review.evidenceRecordId] }
  }], questions };
  const decisions = { sourceReviews: [{ sourceId: review.sourceId, tasks: {
    bodyReview: { evidence: ["body-evidence"] }, answerReview: { evidence: ["answer-evidence"] },
    questionSegmentation: { evidence: ["segment-evidence"] }, typeClassification: { evidence: ["type-evidence"] }
  } }] };
  const links = { links: [{ paperId: review.paperId, sourceId: review.sourceId, evidenceRecordId: review.registryEvidenceRecordId }] };
  const exported = exportReviewPacket(db, review.paperId, review.reviewedAt, decisions, links);
  assert.equal(exported.registryEvidenceRecordId, review.registryEvidenceRecordId);
  assert.equal(exported.paperEvidenceId, "older-paper-evidence");
  assert.equal(exported.questions.length, 30);
});

test("구형 시험지의 페이지만 확인된 위치와 혼합 범위를 추측 없이 보존한다", () => {
  const review = packet();
  review.coverage.coverageKind = "mixed_range";
  review.questions.forEach(item => { item.slot = null; });
  assert.doesNotThrow(() => validatePacket(review));
});
