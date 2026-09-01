"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-work-ledger.cjs");
const auditor = require("../scripts/audit-dolpa-work-ledger.cjs");
const planner = require("../scripts/plan-dolpa-next-work.cjs");
const recorder = require("../scripts/record-dolpa-review.cjs");

function fixtures() {
  const inventory = {
    schemaVersion: 2,
    summary: { duplicatePathCount: 1 },
    sources: [
      {
        sourceId: "DP-SRC-AAAAAAAAAAAA",
        sha256: "a".repeat(64),
        canonicalRelativePath: "active/a.hwp",
        aliases: [{ relativePath: "active/a.hwp" }],
        primaryFamilyHint: "입반시험",
        primaryCourseHint: "중2-2",
        primaryLayer: "운영 폴더"
      },
      {
        sourceId: "DP-SRC-BBBBBBBBBBBB",
        sha256: "b".repeat(64),
        canonicalRelativePath: "active/b.hwp",
        aliases: [{ relativePath: "active/b.hwp" }],
        primaryFamilyHint: "모의고사",
        primaryCourseHint: "중3-1",
        primaryLayer: "운영 폴더"
      }
    ]
  };
  const queue = {
    jobs: [
      { order: 1, sourceId: "DP-SRC-AAAAAAAAAAAA", status: "변환 완료", outputRelativePath: "a.pdf", pageCount: 11, outputSize: 1200, error: null },
      { order: 2, sourceId: "DP-SRC-BBBBBBBBBBBB", status: "대기", outputRelativePath: "b.pdf", pageCount: null, outputSize: null, error: null }
    ]
  };
  const typeIndex = {
    papers: [{
      paperId: "DP-TEST-ONE",
      questions: [
        { number: 1, semester: "중2-1", unit: "일차함수", type: "두 직선의 교점 구하기", sourceRelation: "original" },
        { number: 2, semester: "중2-2", unit: "도형의 닮음", type: "평행선에서 길이비 구하기", sourceRelation: "original" }
      ]
    }]
  };
  const paperLinks = {
    links: [{
      paperId: "DP-TEST-ONE",
      sourceId: "DP-SRC-AAAAAAAAAAAA",
      evidenceStatus: "verified",
      evidenceRecordId: "audit.test.one",
      verifiedStages: ["bodyReview", "questionSegmentation", "typeClassification"]
    }]
  };
  const reviewDecisions = {
    rangeReviews: [{
      fromOrder: 1,
      toOrder: 1,
      tasks: { coverReview: { status: "verified", evidence: ["render.batch.one"], note: "표지 확인" } }
    }],
    sourceReviews: []
  };
  const fingerprints = {
    inventorySha256: "1".repeat(64), queueSha256: "2".repeat(64), typeIndexSha256: "3".repeat(64),
    paperLinksSha256: "4".repeat(64), reviewDecisionsSha256: "5".repeat(64)
  };
  return { inventory, queue, typeIndex, paperLinks, reviewDecisions, fingerprints };
}

test("돌파 작업 장부는 같은 원본을 한 번만 두고 완료 단계를 이어받는다", () => {
  const value = fixtures();
  const ledger = builder.buildLedger(value.inventory, value.queue, value.typeIndex, value.paperLinks, value.reviewDecisions, value.fingerprints);
  assert.equal(ledger.sources.length, 2);
  assert.equal(ledger.summary.convertedSourceCount, 1);
  assert.equal(ledger.summary.coverVerifiedSourceCount, 1);
  assert.equal(ledger.summary.classifiedSourceCount, 1);
  assert.equal(ledger.summary.classifiedQuestionCount, 2);
  assert.equal(ledger.sources[0].tasks.coverReview.status, "verified");
  assert.equal(ledger.sources[0].tasks.difficultyReview.status, "pending");
  assert.equal(ledger.questions[0].type.methodReviewStatus, "pending");
  assert.equal(ledger.questions[0].difficulty.status, "pending");
});

test("문항 ID와 유형 ID는 다시 만들어도 같고 세부 유형이 다르면 달라진다", () => {
  const questionId = builder.stableQuestionId("DP-SRC-AAAAAAAAAAAA", 7);
  assert.equal(questionId, builder.stableQuestionId("DP-SRC-AAAAAAAAAAAA", 7));
  assert.notEqual(questionId, builder.stableQuestionId("DP-SRC-AAAAAAAAAAAA", 8));
  const first = builder.stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기");
  assert.equal(first, builder.stableTypeId("중2-1", "일차함수", "두 직선의 교점 구하기"));
  assert.notEqual(first, builder.stableTypeId("중2-1", "일차함수", "삼각형의 넓이 구하기"));
});

test("좌표평면과 그래프는 평면도형이 아니라 함수 영역으로 분류한다", () => {
  assert.equal(builder.domainFor("좌표평면과 그래프"), "함수");
  assert.equal(builder.domainFor("정비례와 반비례 그래프"), "함수");
  assert.equal(builder.domainFor("평면도형의 성질"), "기하");
});

test("자료·원과 부채꼴·위치 관계·평행선을 교육과정 영역에 맞게 분류한다", () => {
  assert.equal(builder.domainFor("자료의 정리와 해석"), "확률과 통계");
  assert.equal(builder.domainFor("원과 부채꼴"), "기하");
  assert.equal(builder.domainFor("위치 관계"), "기하");
  assert.equal(builder.domainFor("평행선과 각"), "기하");
});

test("기본 입반 시험의 세부 단원도 융합·기타가 아니라 정확한 영역으로 분류한다", () => {
  assert.equal(builder.domainFor("약수의 개수"), "수와 연산");
  assert.equal(builder.domainFor("절댓값과 수직선"), "수와 연산");
  assert.equal(builder.domainFor("분수의 계산"), "수와 연산");
  assert.equal(builder.domainFor("다각형의 내각과 대각선"), "기하");
  assert.equal(builder.domainFor("다면체"), "기하");
  assert.equal(builder.domainFor("시계의 각"), "기하");
  assert.equal(builder.domainFor("정비례"), "함수");
});

test("감사기는 근거 없는 확정 분류와 난이도를 막는다", () => {
  const value = fixtures();
  const ledger = builder.buildLedger(value.inventory, value.queue, value.typeIndex, value.paperLinks, value.reviewDecisions, value.fingerprints);
  assert.equal(auditor.audit(ledger).ok, true);
  ledger.questions[0].difficulty.status = "verified";
  ledger.questions[0].difficulty.band = "상";
  assert.match(auditor.audit(ledger).issues.join("\n"), /difficulty_evidence/);
});

test("다음 작업 선택기는 이미 끝난 단계를 다시 내보내지 않는다", () => {
  const value = fixtures();
  const ledger = builder.buildLedger(value.inventory, value.queue, value.typeIndex, value.paperLinks, value.reviewDecisions, value.fingerprints);
  const rows = planner.plan(ledger, "next", 10);
  assert.equal(rows.some(row => row.sourceId === "DP-SRC-AAAAAAAAAAAA" && row.tasks.includes("coverReview")), false);
  assert.equal(rows.find(row => row.sourceId === "DP-SRC-AAAAAAAAAAAA").task, "paperReviewBundle");
  assert.deepEqual(rows.find(row => row.sourceId === "DP-SRC-AAAAAAAAAAAA").tasks, ["answerReview", "difficultyReview"]);
  assert.equal(rows.find(row => row.sourceId === "DP-SRC-BBBBBBBBBBBB").task, "conversion");
});

test("표본 확인으로 남은 답 검수도 다음 작업에 다시 잡힌다", () => {
  const value = fixtures();
  value.reviewDecisions.sourceReviews.push({
    sourceId: "DP-SRC-AAAAAAAAAAAA",
    tasks: {
      answerReview: { status: "sampled", evidence: ["answer-sample"], note: "일부 문항만 확정" }
    }
  });
  const ledger = builder.buildLedger(value.inventory, value.queue, value.typeIndex, value.paperLinks, value.reviewDecisions, value.fingerprints);
  const row = planner.plan(ledger, "next", 10).find(item => item.sourceId === "DP-SRC-AAAAAAAAAAAA");
  assert.equal(row.task, "paperReviewBundle");
  assert.equal(row.priorStatus, "sampled");
  assert.equal(row.tasks.includes("answerReview"), true);
});

test("한 번 본 시험지는 여러 검수 단계를 한 기록으로 저장하고 확정 상태를 낮추지 않는다", () => {
  const decisions = { schemaVersion: 1, rangeReviews: [], sourceReviews: [] };
  const manifest = {
    sourceId: "DP-SRC-AAAAAAAAAAAA",
    evidenceId: "review.packet.one",
    note: "한 번 열어 본문·답안·유형을 함께 확인",
    tasks: { bodyReview: "verified", answerReview: "sampled", typeClassification: "verified" }
  };
  const merged = recorder.merge(decisions, manifest);
  assert.equal(merged.sourceReviews.length, 1);
  assert.equal(merged.sourceReviews[0].tasks.bodyReview.status, "verified");
  assert.throws(() => recorder.merge(merged, {
    sourceId: "DP-SRC-AAAAAAAAAAAA",
    evidenceId: "review.packet.two",
    tasks: { bodyReview: "sampled" }
  }), /되돌릴 수 없습니다/);
});
