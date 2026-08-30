"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const auditor = require("../scripts/audit-dolpa-question-db.cjs");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");
const recorder = require("../scripts/record-dolpa-paper-questions.cjs");
const { buildReport } = require("../scripts/build-dolpa-analysis-report.cjs");
const { exportReviewPacket } = require("../scripts/export-dolpa-paper-review.cjs");
const {
  applyToDatabase,
  registerSources,
  validatePacket
} = require("../scripts/register-dolpa-reviewed-paper.cjs");

const PRIMARY_SOURCE_ID = "DP-SRC-7591B3A7C051";
const VARIANT_SOURCE_ID = "DP-SRC-CE3FCE3FCE3F";
const PRIMARY_PAPER_ID = "DP-PAPER-7591";
const VARIANT_PAPER_ID = "DP-PAPER-CE3F";
const OVERRIDE_NUMBERS = new Set([29]);

function ledgerQuestion(sourceId, paperId, number, typeLabel, sourceRelation = "original") {
  const semester = "중2-1";
  const unit = number > 24 ? "일차함수" : "연립일차방정식";
  return {
    questionId: ledgerCore.stableQuestionId(sourceId, number),
    sourceId,
    paperId,
    paperTitle: paperId === PRIMARY_PAPER_ID ? "대표 시험 7591" : "부분 변형 CE3F",
    number,
    sourceRelation,
    curriculum: { semester, domain: ledgerCore.domainFor(unit), unit },
    type: {
      typeId: ledgerCore.stableTypeId(semester, unit, typeLabel),
      label: typeLabel,
      methodTags: [],
      methodReviewStatus: "pending"
    },
    difficulty: { band: null, status: "pending", evidence: [] },
    classificationStatus: "verified",
    evidence: [`visual:${sourceId}:${number}`]
  };
}

function fullLedger(includeVariantRows = false) {
  const primary = Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    return ledgerQuestion(PRIMARY_SOURCE_ID, PRIMARY_PAPER_ID, number, `대표 유형 ${number}`);
  });
  const variant = includeVariantRows ? Array.from({ length: 30 }, (_, index) => {
    const number = index + 1;
    const label = OVERRIDE_NUMBERS.has(number) ? `교체 유형 ${number}` : `복제되면 안 되는 유형 ${number}`;
    return ledgerQuestion(VARIANT_SOURCE_ID, VARIANT_PAPER_ID, number, label, "replacement");
  }) : [];
  return {
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: [
      { sourceId: PRIMARY_SOURCE_ID, sourceFingerprint: "7".repeat(64) },
      { sourceId: VARIANT_SOURCE_ID, sourceFingerprint: "c".repeat(64) }
    ],
    questions: [...primary, ...variant]
  };
}

function sharedQuestionLinks(primaryDatabase) {
  const primary = primaryDatabase.papers.find(paper => paper.paperId === PRIMARY_PAPER_ID);
  return primary.questionIds
    .map((questionId, index) => ({
      number: index + 1,
      questionId: index + 1 === 20 ? primary.questionIds[5] : questionId,
      page: 3 + Math.floor(index / 4),
      slot: index % 4 + 1,
      evidence: [`visual.variant.ce3f.position.${index + 1}`]
    }))
    .filter(link => !OVERRIDE_NUMBERS.has(link.number));
}

function variantManifest(primaryDatabase) {
  return {
    paperId: VARIANT_PAPER_ID,
    sourceId: VARIANT_SOURCE_ID,
    title: "부분 변형 CE3F",
    evidenceId: "visual.variant.ce3f",
    answerEvidenceId: "answer.variant.ce3f",
    variantOfPaperId: PRIMARY_PAPER_ID,
    sharedQuestions: sharedQuestionLinks(primaryDatabase),
    questions: [29].map(number => ({
      number,
      semester: "중2-1",
      unit: number > 24 ? "일차함수" : "연립일차방정식",
      typeLabel: `교체 유형 ${number}`,
      sourceRelation: "replacement",
      page: number === 20 ? 7 : 10,
      slot: number === 20 ? 2 : 3,
      responseKind: "input",
      responseSlotCount: 1
    }))
  };
}

function makeVariantDatabase() {
  const ledger = fullLedger(false);
  const primary = builder.buildDatabase(ledger, null, "1".repeat(64));
  const result = recorder.merge(primary, ledger, variantManifest(primary));
  return { ledger, database: result.database };
}

function reviewPacket(database) {
  const paper = database.papers.find(item => item.paperId === VARIANT_PAPER_ID);
  return {
    schemaVersion: "highselect-dolpa-paper-review/v1",
    sourceId: VARIANT_SOURCE_ID,
    sourceFingerprint: "c".repeat(64),
    paperId: VARIANT_PAPER_ID,
    title: "부분 변형 CE3F",
    registryEvidenceRecordId: "registry.variant.ce3f",
    evidenceRecordId: "paper.variant.ce3f",
    paperEvidenceId: "classification.variant.ce3f",
    locatorEvidenceId: "locator.variant.ce3f",
    responseEvidenceId: "response.variant.ce3f",
    answerEvidenceId: "answer.variant.ce3f",
    reviewedAt: "2026-08-30",
    coverage: {
      coverageKind: "full_range",
      declaredScopeLabel: "중2-1 전 범위",
      observedTerminal: { semester: "중2-1", unit: "일차함수" },
      note: "대표 시험 6번을 다시 배치한 20번과 새 교체 문항 29번을 직접 확인"
    },
    variant: {
      kind: "partial_question_variant",
      primaryPaperId: PRIMARY_PAPER_ID,
      sharedQuestionLinks: structuredClone(paper.variant.sharedQuestionLinks)
    },
    questions: [29].map(number => ({
      number,
      page: number === 20 ? 7 : 10,
      slot: number === 20 ? 2 : 3,
      responseFormat: "input",
      slotCount: 1,
      semester: "중2-1",
      unit: number > 24 ? "일차함수" : "연립일차방정식",
      typeLabel: `교체 유형 ${number}`
    }))
  };
}

test("29개 배치가 대표 28문항을 공유하고 교체 1문항만 직접 소유한다", () => {
  const { database } = makeVariantDatabase();
  const paper = database.papers.find(item => item.paperId === VARIANT_PAPER_ID);
  const primary = database.papers.find(item => item.paperId === PRIMARY_PAPER_ID);
  assert.equal(database.questions.length, 31);
  assert.equal(paper.questionCount, 30);
  assert.equal(paper.questionIds.length, 30);
  assert.equal(paper.variant.sharedQuestionLinks.length, 29);
  assert.equal(new Set(paper.variant.sharedQuestionLinks.map(link => link.questionId)).size, 28);
  assert.equal(paper.variant.overrideQuestionIds.length, 1);
  assert.deepEqual(paper.variant.overrideQuestionIds, [
    ledgerCore.stableQuestionId(VARIANT_SOURCE_ID, 29)
  ]);
  for (let number = 1; number <= 30; number += 1) {
    const expected = OVERRIDE_NUMBERS.has(number)
      ? ledgerCore.stableQuestionId(VARIANT_SOURCE_ID, number)
      : number === 20 ? primary.questionIds[5] : primary.questionIds[number - 1];
    assert.equal(paper.questionIds[number - 1], expected);
  }
  assert.equal(paper.questionIds[5], paper.questionIds[19]);
  assert.equal(database.questions.filter(question => question.paperId === VARIANT_PAPER_ID).length, 1);
  assert.equal(auditor.audit(database).ok, true);
});

test("대표 시험이 소유하지 않은 공유 문항 연결은 등록과 감사에서 차단한다", () => {
  const ledger = fullLedger(false);
  const primary = builder.buildDatabase(ledger, null, "1".repeat(64));
  const badManifest = variantManifest(primary);
  badManifest.sharedQuestions[0].questionId = ledgerCore.stableQuestionId(VARIANT_SOURCE_ID, 1);
  assert.throws(() => recorder.merge(primary, ledger, badManifest), /대표 시험지 소유 문항과 연결되지 않았습니다/);

  const { database } = makeVariantDatabase();
  const tampered = structuredClone(database);
  const variant = tampered.papers.find(paper => paper.paperId === VARIANT_PAPER_ID);
  variant.variant.sharedQuestionLinks[0].questionId = ledgerCore.stableQuestionId(VARIANT_SOURCE_ID, 1);
  assert.equal(auditor.audit(tampered).issues.some(issue => issue.startsWith("paper_variant_shared_link:")), true);
});

test("전체 원장에 변형 30문항이 있어도 재빌드는 교체 1문항만 소유한다", () => {
  const { database } = makeVariantDatabase();
  const rebuilt = builder.buildDatabase(fullLedger(true), database, "2".repeat(64));
  const paper = rebuilt.papers.find(item => item.paperId === VARIANT_PAPER_ID);
  assert.equal(rebuilt.questions.length, 31);
  assert.equal(rebuilt.questions.filter(question => question.paperId === VARIANT_PAPER_ID).length, 1);
  assert.equal(paper.variant.sharedQuestionLinks.length, 29);
  assert.equal(new Set(paper.variant.sharedQuestionLinks.map(link => link.questionId)).size, 28);
  assert.equal(paper.variant.overrideQuestionIds.length, 1);
  assert.equal(auditor.audit(rebuilt).ok, true);
});

test("재빌드는 기존 DB의 잘못된 공유 문항 연결을 그대로 보존하지 않는다", () => {
  const { database } = makeVariantDatabase();
  const tampered = structuredClone(database);
  const variant = tampered.papers.find(paper => paper.paperId === VARIANT_PAPER_ID);
  variant.variant.sharedQuestionLinks[0].questionId = ledgerCore.stableQuestionId(VARIANT_SOURCE_ID, 1);
  assert.throws(
    () => builder.buildDatabase(fullLedger(true), tampered, "2".repeat(64)),
    /부분 교체 시험지 연결을 확인해 주세요/
  );
});

test("부분 변형 검수표는 등록·DB 반영·내보내기에서 29개 배치 공유와 교체 1개를 유지한다", () => {
  const { database } = makeVariantDatabase();
  const packet = reviewPacket(database);
  assert.doesNotThrow(() => validatePacket(packet));

  const registered = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    packet
  );
  assert.equal(registered.typeIndex.papers[0].questionCount, 30);
  assert.equal(registered.typeIndex.papers[0].questions.length, 1);
  assert.equal(registered.typeIndex.papers[0].sharedCount, 29);
  assert.equal(registered.typeIndex.papers[0].sharedCanonicalCount, 28);
  assert.equal(registered.typeIndex.papers[0].replacementCount, 1);

  const applied = applyToDatabase(database, packet);
  const owned = applied.questions.filter(question => question.paperId === VARIANT_PAPER_ID);
  assert.equal(owned.length, 1);
  assert.equal(owned.every(question => question.answerCheck.status === "verified"), true);
  assert.equal(owned.every(question => question.locator.status === "verified"), true);
  assert.equal(auditor.audit(applied).ok, true);

  const exported = exportReviewPacket(applied, VARIANT_PAPER_ID, packet.reviewedAt, null, registered.paperLinks);
  assert.deepEqual(exported.variant, packet.variant);
  assert.deepEqual(exported.questions.map(question => question.number), [29]);
  assert.equal(exported.questions.length, 1);
});

test("검수표의 공유 ID가 형식상 유효해도 DB의 정확한 번호 연결과 다르면 차단한다", () => {
  const { database } = makeVariantDatabase();
  const packet = reviewPacket(database);
  const first = packet.variant.sharedQuestionLinks[0];
  const second = packet.variant.sharedQuestionLinks[1];
  [first.questionId, second.questionId] = [second.questionId, first.questionId];
  assert.doesNotThrow(() => validatePacket(packet));
  assert.throws(() => applyToDatabase(database, packet), /공유 문항 연결이 문항 DB와 다릅니다/);
});

test("부분 변형 검수표는 공유 번호와 교체 번호가 겹치면 차단한다", () => {
  const { database } = makeVariantDatabase();
  const packet = reviewPacket(database);
  packet.variant.sharedQuestionLinks.push({
    number: 29,
    questionId: database.papers.find(paper => paper.paperId === PRIMARY_PAPER_ID).questionIds[28]
  });
  assert.throws(() => validatePacket(packet), /variant\.sharedQuestionLinks/);
});

test("부분 변형 공유 배치는 실제 쪽·칸·근거가 없으면 등록하지 않는다", () => {
  const ledger = fullLedger(false);
  const primary = builder.buildDatabase(ledger, null, "1".repeat(64));
  const manifest = variantManifest(primary);
  delete manifest.sharedQuestions[0].evidence;
  assert.throws(() => recorder.merge(primary, ledger, manifest), /쪽·칸·근거/);

  const { database } = makeVariantDatabase();
  const packet = reviewPacket(database);
  packet.variant.sharedQuestionLinks[0].slot = null;
  assert.throws(() => validatePacket(packet), /variant\.sharedQuestionLinks\[0\]\.locator/);
});

test("부분 변형 분석지는 같은 canonical 문항의 두 배치를 각각 집계한다", () => {
  const { database } = makeVariantDatabase();
  const packet = reviewPacket(database);
  const ready = applyToDatabase(database, packet);
  ready.questions.forEach(question => {
    question.difficulty = {
      band: question.questionId.endsWith("-006") || question.questionId.endsWith("-029") ? "raised" : "standard",
      status: "verified",
      evidence: [`difficulty:${question.questionId}`]
    };
    question.responseFormat = {
      kind: "input",
      slotCount: 1,
      status: "verified",
      evidence: [`response:${question.questionId}`]
    };
    question.answerCheck = {
      status: "verified",
      evidence: [`answer:${question.questionId}`]
    };
  });
  const canonicalQ6 = ready.questions.find(question => question.questionId === ledgerCore.stableQuestionId(PRIMARY_SOURCE_ID, 6));
  canonicalQ6.answerCheck = {
    status: "disputed",
    evidence: ["answer:canonical-q6-conflict"],
    note: "공식 답과 독립 계산이 일치하지 않음"
  };
  const report = buildReport(ready, VARIANT_SOURCE_ID, "2026-08-30");
  assert.equal(report.summary.questionCount, 30);
  assert.equal(report.summary.raisedCount, 3);
  assert.equal(report.summary.answerDisputeCount, 2);
  assert.deepEqual(report.criticalWarnings.map(item => item.number), [6, 20]);
  const sixth = report.evidence.find(item => item.paperQuestionNumber === 6);
  const twentieth = report.evidence.find(item => item.paperQuestionNumber === 20);
  assert.equal(sixth.canonicalQuestionId, twentieth.canonicalQuestionId);
  assert.equal(sixth.canonicalQuestionNumber, 6);
  assert.equal(twentieth.canonicalQuestionNumber, 6);
  assert.notDeepEqual([sixth.page, sixth.slot], [twentieth.page, twentieth.slot]);
  assert.equal(sixth.placementRelation, "shared");
  assert.equal(twentieth.placementRelation, "shared");
  assert.equal(report.evidence.find(item => item.paperQuestionNumber === 29).placementRelation, "replacement");
  assert.equal(report.evidence.some(item => Object.keys(item).some(key => /answerValue|officialAnswer|derivedAnswer/i.test(key))), false);
});
