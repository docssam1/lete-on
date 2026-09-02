"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { registerSources: registerSourcesRaw, applyToDatabase, validatePacket } = require("../scripts/register-dolpa-reviewed-paper.cjs");
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

function databaseFor(review, disputedNumber = null) {
  const questions = review.questions.map(item => ({
    questionId: stableQuestionId(review.sourceId, item.number), sourceId: review.sourceId, paperId: review.paperId, number: item.number,
    locator: { page: null, slot: null, status: "pending", evidence: [] },
    classification: { semester: item.semester, domain: "문자와 식", unit: item.unit, majorUnit: "문자와 식", minorUnit: item.unit,
      typeId: stableTypeId(item.semester, item.unit, item.typeLabel), typeLabel: item.typeLabel, status: "verified", evidence: ["paper-audit"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
    difficulty: { band: null, status: "pending", evidence: [] },
    responseFormat: { kind: null, slotCount: null, status: "pending", evidence: [] },
    answerCheck: item.number === disputedNumber
      ? { status: "disputed", evidence: ["older-private-review"], note: "기존 이견 검수 중" }
      : { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: stableQuestionId(review.sourceId, item.number), twinIds: [], similarIds: [] },
    usageProfiles: [], releaseStatus: "locked"
  }));
  return {
    schemaVersion: 1,
    papers: [{
      paperId: review.paperId,
      sourceId: review.sourceId,
      sourceFingerprint: review.sourceFingerprint,
      title: review.title
    }],
    questions
  };
}

function registerSources(typeIndex, paperLinks, reviewDecisions, review, database = databaseFor(review)) {
  return registerSourcesRaw(typeIndex, paperLinks, reviewDecisions, review, database);
}

test("구형 검수표는 문항 DB 없이 답 검수를 확정하지 않는다", () => {
  assert.throws(() => registerSourcesRaw(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    packet()
  ), /문항 DB가 필요합니다/);
});

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

test("이미 정답 이견으로 잠긴 문항은 시험지 재등록 때 검증 완료로 덮지 않는다", () => {
  const review = packet();
  const questions = review.questions.map(item => ({
    questionId: stableQuestionId(review.sourceId, item.number), sourceId: review.sourceId, paperId: review.paperId, number: item.number,
    locator: { page: null, slot: null, status: "pending", evidence: [] },
    classification: { semester: item.semester, domain: "문자와 식", unit: item.unit, majorUnit: "문자와 식", minorUnit: item.unit,
      typeId: stableTypeId(item.semester, item.unit, item.typeLabel), typeLabel: item.typeLabel, status: "verified", evidence: ["paper-audit"] },
    method: { solutionArchetype: null, tags: [], status: "pending", evidence: [] },
    difficulty: { band: "standard", status: "verified", evidence: ["difficulty-audit"] },
    responseFormat: { kind: null, slotCount: null, status: "pending", evidence: [] },
    answerCheck: item.number === 27 ? { status: "disputed", evidence: ["private-review"] } : { status: "pending", evidence: [] },
    variantSet: { status: "not_started", originalId: stableQuestionId(review.sourceId, item.number), twinIds: [], similarIds: [] },
    usageProfiles: [], releaseStatus: "locked"
  }));
  const db = { schemaVersion: 1, papers: [{ paperId: review.paperId, sourceId: review.sourceId, sourceFingerprint: review.sourceFingerprint }], questions };
  const result = applyToDatabase(db, review);
  assert.equal(result.questions[26].answerCheck.status, "disputed");
  assert.equal(result.questions[25].answerCheck.status, "verified");
});

test("문항별 답 상태를 확정·이견·대기로 나누어 DB에 보존한다", () => {
  const review = packet();
  review.questions[9].answerStatus = "disputed";
  review.questions[9].answerNote = "공식 답과 독립 검산이 일치하지 않음";
  review.questions[15].answerStatus = "pending";
  review.questions[15].answerNote = "도형 반사 모델 재검수 필요";
  review.questions[16].answerStatus = "verified";
  const result = applyToDatabase(databaseFor(review), review);
  assert.deepEqual(result.questions[9].answerCheck, {
    status: "disputed",
    evidence: [review.answerEvidenceId],
    note: review.questions[9].answerNote
  });
  assert.deepEqual(result.questions[15].answerCheck, {
    status: "pending",
    evidence: [review.answerEvidenceId],
    note: review.questions[15].answerNote
  });
  assert.equal(result.questions[16].answerCheck.status, "verified");
  assert.equal(result.questions[0].answerCheck.status, "verified");
  assert.equal(result.papers[0].answerEvidenceId, review.answerEvidenceId);
});

test("명시적 verified는 이견을 해소하고 상태 누락은 기존 이견을 보존한다", () => {
  const explicit = packet();
  explicit.questions[9].answerStatus = "verified";
  const resolved = applyToDatabase(databaseFor(explicit, 10), explicit);
  assert.equal(resolved.questions[9].answerCheck.status, "verified");
  assert.deepEqual(resolved.questions[9].answerCheck.evidence, [explicit.answerEvidenceId]);

  const legacy = packet();
  const preserved = applyToDatabase(databaseFor(legacy, 10), legacy);
  assert.deepEqual(preserved.questions[9].answerCheck, {
    status: "disputed",
    evidence: ["older-private-review"],
    note: "기존 이견 검수 중"
  });
});

test("일부 답이 미확정이면 answerReview를 확정 단계에 넣지 않는다", () => {
  const review = packet();
  review.questions[9].answerStatus = "disputed";
  review.questions[9].answerNote = "공식 답과 독립 검산이 일치하지 않음";
  review.questions[15].answerStatus = "pending";
  const result = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    review
  );
  const link = result.paperLinks.links[0];
  const tasks = result.reviewDecisions.sourceReviews[0].tasks;
  assert.deepEqual(link.verifiedStages, ["bodyReview", "questionSegmentation", "typeClassification"]);
  assert.equal(tasks.bodyReview.status, "verified");
  assert.equal(tasks.questionSegmentation.status, "verified");
  assert.equal(tasks.typeClassification.status, "verified");
  assert.equal(tasks.answerReview.status, "sampled");
  assert.match(tasks.answerReview.note, /확정 28문항/);
  assert.match(tasks.answerReview.note, /이견 1문항/);
  assert.match(tasks.answerReview.note, /확인 대기 1문항/);
  assert.deepEqual(tasks.answerReview.evidence, [review.registryEvidenceRecordId]);
});

test("모든 답이 대기이면 answerReview를 pending으로 남긴다", () => {
  const review = packet();
  review.questions.forEach(question => { question.answerStatus = "pending"; });
  const result = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    review
  );
  const task = result.reviewDecisions.sourceReviews[0].tasks.answerReview;
  assert.equal(task.status, "pending");
  assert.match(task.note, /확인 대기 30문항/);
});

test("기존 answerReview 확정은 뒤에 들어온 표본·대기 검수로 낮아지지 않는다", () => {
  const emptyIndex = { schemaVersion: 1, totalQuestionCount: 0, papers: [] };
  const emptyLinks = { schemaVersion: 1, links: [] };
  const emptyDecisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [] };
  const completed = registerSources(emptyIndex, emptyLinks, emptyDecisions, packet());
  const partial = packet();
  partial.questions[9].answerStatus = "pending";
  const repeated = registerSources(completed.typeIndex, completed.paperLinks, completed.reviewDecisions, partial);
  assert.equal(repeated.reviewDecisions.sourceReviews[0].tasks.answerReview.status, "verified");
  assert.equal(repeated.paperLinks.links[0].verifiedStages.includes("answerReview"), true);
  assert.equal(repeated.paperLinks.links.length, 1);
});

test("기존 sampled도 뒤에 들어온 pending으로 낮아지지 않는다", () => {
  const sampledPacket = packet();
  sampledPacket.questions[9].answerStatus = "disputed";
  sampledPacket.questions[9].answerNote = "공식 답과 독립 검산이 일치하지 않음";
  const sampled = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    sampledPacket
  );
  const pendingPacket = packet();
  pendingPacket.questions.forEach(question => { question.answerStatus = "pending"; });
  const repeated = registerSources(sampled.typeIndex, sampled.paperLinks, sampled.reviewDecisions, pendingPacket);
  assert.equal(repeated.reviewDecisions.sourceReviews[0].tasks.answerReview.status, "sampled");
  assert.equal(repeated.paperLinks.links[0].verifiedStages.includes("answerReview"), false);
});

test("구형 검수표라도 DB에 기존 답 이견이 있으면 answerReview를 확정하지 않는다", () => {
  const review = packet();
  const result = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    review,
    databaseFor(review, 10)
  );
  assert.equal(result.paperLinks.links[0].verifiedStages.includes("answerReview"), false);
  const task = result.reviewDecisions.sourceReviews[0].tasks.answerReview;
  assert.equal(task.status, "sampled");
  assert.match(task.note, /확정 29문항/);
  assert.match(task.note, /이견 1문항/);
});

test("부분 답 검수 상태는 답값 없이 내보내기와 재등록을 왕복한다", () => {
  const review = packet();
  review.questions[9].answerStatus = "disputed";
  review.questions[9].answerNote = "공식 답과 독립 검산이 일치하지 않음";
  review.questions[15].answerStatus = "pending";
  review.questions[15].answerNote = "접기 대응선 재검수 필요";
  const registered = registerSources(
    { schemaVersion: 1, totalQuestionCount: 0, papers: [] },
    { schemaVersion: 1, links: [] },
    { schemaVersion: 1, rangeReviews: [], sourceReviews: [] },
    review
  );
  const applied = applyToDatabase(databaseFor(review), review);
  const exported = exportReviewPacket(applied, review.paperId, review.reviewedAt, registered.reviewDecisions, registered.paperLinks);
  assert.equal(exported.questions[9].answerStatus, "disputed");
  assert.equal(exported.questions[9].answerNote, review.questions[9].answerNote);
  assert.equal(exported.questions[15].answerStatus, "pending");
  assert.equal(exported.questions[15].answerNote, review.questions[15].answerNote);
  assert.equal(Object.hasOwn(exported.questions[0], "answerStatus"), false);
  assert.doesNotThrow(() => validatePacket(exported));
  const reapplied = applyToDatabase(databaseFor(review), exported);
  assert.equal(reapplied.questions[9].answerCheck.status, "disputed");
  assert.equal(reapplied.questions[15].answerCheck.status, "pending");
});

test("답 상태는 허용된 값만 받고 이견 메모에 답값을 쓰지 못한다", () => {
  const badStatus = packet();
  badStatus.questions[0].answerStatus = "complete";
  assert.throws(() => validatePacket(badStatus), /answerStatus/);

  const missingNote = packet();
  missingNote.questions[0].answerStatus = "disputed";
  assert.throws(() => validatePacket(missingNote), /answerNoteRequired/);

  const missingEvidence = packet();
  missingEvidence.answerEvidenceId = "";
  missingEvidence.questions[0].answerStatus = "disputed";
  missingEvidence.questions[0].answerNote = "공식 답과 독립 검산이 일치하지 않음";
  assert.throws(() => validatePacket(missingEvidence), /answerEvidenceId/);

  const leakedValue = packet();
  leakedValue.questions[0].answerStatus = "disputed";
  leakedValue.questions[0].answerNote = "공식 답 4개와 독립 검산 3개가 다름";
  assert.throws(() => validatePacket(leakedValue), /answerNoteValue/);

  const textualLeak = packet();
  textualLeak.questions[0].answerStatus = "disputed";
  textualLeak.questions[0].answerNote = "정답은 참";
  assert.throws(() => validatePacket(textualLeak), /answerNoteValue/);

  const ambiguousNote = packet();
  ambiguousNote.questions[0].answerNote = "추가 검수 필요";
  assert.throws(() => validatePacket(ambiguousNote), /answerNoteWithoutStatus/);

  const disguisedKey = packet();
  disguisedKey.questions[0].Official_Answer = "hidden";
  assert.throws(() => validatePacket(disguisedKey), /forbidden/);

  const localPath = packet();
  localPath.questions[0].answerStatus = "pending";
  localPath.questions[0].answerNote = "C:\\private\\answers.pdf 확인 필요";
  assert.throws(() => validatePacket(localPath), /sensitivePath/);

  const drivePath = packet();
  drivePath.coverage.note = "G:\\private\\review 확인";
  assert.throws(() => validatePacket(drivePath), /sensitivePath/);

  const userPath = packet();
  userPath.coverage.note = "/Users/reviewer/private/answers.pdf 확인";
  assert.throws(() => validatePacket(userPath), /sensitivePath/);
});
