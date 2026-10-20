"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const selector = require("../scripts/select-project-question-bank.cjs");

function learnerFit(overall = "pass") {
  return {
    overall,
    dimensions: Object.fromEntries(["language", "representations", "prerequisites", "reasoningLoad", "responseMode"].map(name => [name, overall]))
  };
}

function index() {
  return {
    academyProfiles: [
      { profileId: "DP_STANDARD", programId: "DP", label: "돌파형" },
      { profileId: "WM_BASIC", programId: "WM", label: "원수학 기본형" },
      { profileId: "SH_SELECTION", programId: "SH", label: "황소형" },
      { profileId: "SM_STANDARD", programId: "SM", label: "생수형" }
    ],
    sourceTypes: [
      { sourceBankId: "DOLPA", sourceTypeId: "DP-T1", detailType: "교점 구하기" },
      { sourceBankId: "WM", sourceTypeId: "WM-U1", detailType: "일차함수" },
      { sourceBankId: "SAENGSU", sourceTypeId: "SM-T1", detailType: "교점 구하기", domainGroup: "algebra" }
    ],
    sourceBanks: [
      { sourceBankId: "DOLPA", academyId: "DP", label: "돌파 원본 시험" },
      { sourceBankId: "WM", academyId: "WM", label: "원수학 중2-1 기본반" },
      { sourceBankId: "SAENGSU", academyId: "SM", label: "생수 구판 참고 후보" }
    ],
    conceptFamilies: [{
      conceptFamilyId: "CPT-1",
      curriculum: { course: "", semester: "중2-1", majorUnit: "함수", minorUnit: "일차함수" },
      canonicalLabel: "두 직선의 교점 구하기",
      solutionArchetype: null
    }],
    items: [
      {
        itemId: "DOLPA:Q1", sourceBankId: "DOLPA", sourceItemId: "Q1", sourceTypeId: "DP-T1",
        conceptFamilyId: "CPT-1", conceptStatus: "mapped", classificationStatus: "verified",
        answerStatus: "verified", learnerFit: learnerFit(),
        academyFits: [
          { profileId: "DP_STANDARD", status: "source_verified" },
          { profileId: "SH_SELECTION", status: "candidate" }
        ]
      },
      {
        itemId: "WM:Q1", sourceBankId: "WM", sourceItemId: "Q1", sourceTypeId: "WM-U1",
        conceptFamilyId: null, conceptStatus: "unit_only", classificationStatus: "verified_unit_only",
        answerStatus: "verified", learnerFit: learnerFit(),
        academyFits: [{ profileId: "WM_BASIC", status: "source_verified" }]
      },
      {
        itemId: "SAENGSU:Q1", sourceBankId: "SAENGSU", sourceItemId: "Q1", sourceTypeId: "SM-T1",
        conceptFamilyId: "CPT-1", conceptStatus: "mapped", classificationStatus: "source_checked_teacher_review_pending",
        answerStatus: "pending", taxonomyReviewStatus: "alias_internal_group",
        internalTypeGroupId: "SM-GRP-LINE-INTERSECTION", withinCurrentRange: true, domainGroup: "algebra",
        academyFits: [{ profileId: "SM_STANDARD", status: "candidate" }]
      }
    ]
  };
}

function approvedContent(value) {
  return { schemaVersion: "private-question-content/v1", visibility: "private", releaseStatus: "approved",
    itemCount: value.items.length, items: value.items.map(item => ({ canonicalItemId: item.itemId, sourceItem: {
      questionId: item.sourceItemId, promptParts: [{ kind: "text", value: "synthetic" }],
      sourceAssetSha256: "a".repeat(64),
      answer: { match: true }, solution: { summary: "synthetic", steps: ["one", "two"] },
      response: { kind: "single_choice" }, choices: [1, 2, 3, 4, 5],
      releaseStatus: "approved", mockExamEligible: true
    } })) };
}

function approvedVisualAudit(value) {
  return { schemaVersion: "private-source-visual-audit/v1", visibility: "private",
    itemCount: value.items.length, items: value.items.map(item => ({
      canonicalItemId: item.itemId, sourceQuestionId: item.sourceItemId,
      sourceSha256: "a".repeat(64), visualRequirement: "none", sourceAuditStatus: "source_checked",
      renderStatus: "approved", renderEvidence: {
        visualReview: "approved", sourceVisualMatch: true, singleAnswerVisible: true,
        layoutAuditSha256: "b".repeat(64), a4PdfSha256: "c".repeat(64),
        visualProfiles: ["desktop", "mobile", "a4"].map(surface => ({ surface, status: "pass", artifactSha256: "d".repeat(64) }))
      }
    })) };
}

function selectReady(value, profiles, options) {
  const approved = structuredClone(value);
  for (const item of approved.items) {
    item.usageApproved = true;
    for (const fit of item.academyFits || []) if (fit.status === "source_verified") fit.status = "approved";
  }
  return selector.selectItems(approved, profiles, {
    contentData: approvedContent(approved), visualAuditData: approvedVisualAudit(approved), ...(options || {})
  });
}

test("학원형 선택은 그 학원의 근거 있는 세부유형 문항만 반환한다", () => {
  const result = selectReady(index(), ["돌파형"]);
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].detailType, "두 직선의 교점 구하기");
  assert.equal(result.items[0].sourceTypeLabel, "교점 구하기");
});

test("다른 학원 후보 태그와 단원 수준 분류는 기본 선택에서 빠진다", () => {
  assert.equal(selector.selectItems(index(), ["황소형"]).itemCount, 0);
  assert.equal(selector.selectItems(index(), ["원수학 기본형"]).itemCount, 0);
});

test("후보 포함을 명시하면 학원형 후보 문항도 검수 목록에 나온다", () => {
  const result = selector.selectItems(index(), ["황소형"], {
    allowedStatuses: selector.CANDIDATE_ALLOWED_STATUSES,
    allowedConceptStatuses: ["mapped", "unit_only", "pending"]
  });
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].itemId, "DOLPA:Q1");
  assert.deepEqual(result.items[0].academyFits, [{ profileId: "SH_SELECTION", status: "candidate" }]);
});

test("학원형 후보가 많아도 선택한 학원의 직접 자료를 호환 자료보다 먼저 보여 준다", () => {
  const value = index();
  value.items[0].academyFits.push({ profileId: "SM_STANDARD", status: "candidate" });
  const result = selector.selectItems(value, ["SM_STANDARD"], {
    allowedStatuses: selector.CANDIDATE_ALLOWED_STATUSES,
    allowedConceptStatuses: ["mapped", "unit_only", "pending"],
    includeReviewCandidates: true,
    limit: 1
  });
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].itemId, "SAENGSU:Q1");
  assert.equal(result.items[0].sourceRole, "direct");
});

test("관리자 검수 목록은 단원까지만 확인된 원수학 문항도 상태를 붙여 보여 준다", () => {
  const result = selector.selectItems(index(), ["WM_BASIC"], {
    allowedConceptStatuses: ["mapped", "unit_only"], includeReviewCandidates: true
  });
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].sourceBankLabel, "원수학 중2-1 기본반");
  assert.equal(result.items[0].detailType, "일차함수");
  assert.equal(result.items[0].conceptFamilyId, null);
  assert.equal(result.items[0].conceptStatus, "unit_only");
});

test("다른 회차의 원본 문항은 관리자 검수에만 보이고 현 회차 문항으로 승인되지 않는다", () => {
  const value = index();
  value.items[0].academyFits[0].status = "source_verified_not_current_exam_claim";
  assert.equal(selector.selectItems(value, ["DP_STANDARD"]).itemCount, 0);
  const review = selector.selectItems(value, ["DP_STANDARD"], {
    allowedStatuses: selector.CANDIDATE_ALLOWED_STATUSES,
    allowedConceptStatuses: ["mapped", "unit_only", "pending"],
    includeReviewCandidates: true
  });
  assert.equal(review.itemCount, 1);
  assert.equal(review.items[0].academyFits[0].status, "source_verified_not_current_exam_claim");
  assert.equal(review.items[0].releaseEligible, false);
});

test("정확 중복만 한 문제로 세고 같은 유형의 다른 변형은 남긴다", () => {
  const value = index();
  for (const id of ["Q2", "Q3"]) {
    value.items.push({ ...value.items[0], itemId: `DOLPA:${id}`, sourceItemId: id });
  }
  const itemRelations = [
    { kind: "same_math_item", itemIds: ["DOLPA:Q1", "DOLPA:Q2"], canonicalMathItemId: "DOLPA:Q1" },
    { kind: "same_solving_family_distinct_item_and_output", itemIds: ["Q1", "Q3"] }
  ];
  assert.equal(selectReady(value, ["DP"]).itemCount, 3);
  const selected = selectReady(value, ["DP"], { itemRelations, deduplicateExact: true, limit: 2 });
  assert.deepEqual(selected.items.map(item => item.sourceItemId), ["Q1", "Q3"]);
  assert.equal(selected.items[0].canonicalMathItemId, "DOLPA:Q1");
});

test("서로 다른 교재의 같은 원본 번호는 검수 관계 없이 합치지 않는다", () => {
  const value = index();
  const selected = selector.selectItems(value, ["DP", "WM_BASIC"], {
    allowedConceptStatuses: ["mapped", "unit_only"], includeReviewCandidates: true,
    itemRelations: [], deduplicateExact: true
  });
  assert.equal(selected.itemCount, 2);
  assert.deepEqual(selected.items.map(item => item.canonicalMathItemId).sort(), ["DOLPA:Q1", "WM:Q1"]);
  assert.throws(() => selector.selectItems(value, ["DP"], {
    itemRelations: [{ kind: "same_math_item", itemIds: ["Q1"], canonicalMathItemId: "Q1" }],
    deduplicateExact: true
  }), /모호합니다/);
});

test("중복 제거는 검수 관계가 없거나 서로 충돌하면 거부한다", () => {
  assert.throws(() => selector.selectItems(index(), ["DP"], { deduplicateExact: true }), /검수된 문항 관계/);
  const value = index();
  for (const id of ["Q2", "Q3"]) value.items.push({ ...value.items[0], itemId: `DOLPA:${id}`, sourceItemId: id });
  assert.throws(() => selector.selectItems(value, ["DP"], { itemRelations: [
    { kind: "same_math_item", itemIds: ["DOLPA:Q1", "DOLPA:Q2"], canonicalMathItemId: "DOLPA:Q1" },
    { kind: "same_math_item", itemIds: ["DOLPA:Q2", "DOLPA:Q3"], canonicalMathItemId: "DOLPA:Q3" }
  ], deduplicateExact: true }), /충돌/);
});

test("명시적으로 잠긴 문항은 다른 검사가 통과해도 관리자 검수에만 남는다", () => {
  const value = index();
  value.items[0].releaseStatus = "locked";
  value.items[0].usageApproved = false;
  assert.equal(selector.selectItems(value, ["DP"]).itemCount, 0);
  const review = selector.selectItems(value, ["DP"], { includeReviewCandidates: true });
  assert.equal(review.itemCount, 1);
  assert.equal(review.items[0].usageApproved, false);
  assert.equal(review.items[0].releaseEligible, false);
  assert.equal(review.items[0].releaseBlockReason, "item_locked_or_not_approved");
});

test("답과 학습 적합성이 맞아도 교사 분류가 대기 중이면 관리자 후보에만 남는다", () => {
  const value = index();
  value.items[0].classificationStatus = "source_checked_teacher_review_pending";
  assert.equal(selector.selectItems(value, ["DP_STANDARD"]).itemCount, 0);
  const admin = selector.selectItems(value, ["DP_STANDARD"], { includeReviewCandidates: true });
  assert.equal(admin.itemCount, 1);
  assert.equal(admin.items[0].releaseEligible, false);
  assert.equal(admin.items[0].releaseBlockReason, "classification_not_verified");
});

test("검색은 공통 유형명과 원본 유형명을 모두 찾는다", () => {
  assert.equal(selectReady(index(), ["DP"], { query: "두 직선" }).itemCount, 1);
  assert.equal(selectReady(index(), ["DP"], { query: "교점 구하기" }).itemCount, 1);
});

test("본문 DB가 없거나 잠긴 경우 색인만으로는 사용 가능하지 않다", () => {
  const value = index();
  assert.equal(selector.selectItems(value, ["DP"]).itemCount, 0);
  const admin = selector.selectItems(value, ["DP"], { includeReviewCandidates: true });
  assert.equal(admin.items[0].releaseBlockReason, "content_not_verified");
  const privatePack = approvedContent(value);
  const visualAuditData = approvedVisualAudit(value);
  privatePack.releaseStatus = "locked";
  const locked = selector.selectItems(value, ["DP"], { contentData: privatePack, visualAuditData, includeReviewCandidates: true });
  assert.equal(locked.items[0].contentVerified, true);
  assert.equal(locked.items[0].releaseBlockReason, "content_release_not_approved");
});

test("본문이 승인되어도 문항과 해당 학원형의 사용 승인이 모두 필요하다", () => {
  const value = index();
  const privatePack = approvedContent(value);
  const visualAuditData = approvedVisualAudit(value);
  const withoutItemApproval = selector.selectItems(value, ["DP"], {
    contentData: privatePack, visualAuditData, includeReviewCandidates: true
  });
  assert.equal(withoutItemApproval.items[0].contentVerified, true);
  assert.equal(withoutItemApproval.items[0].releaseEligible, false);
  assert.equal(withoutItemApproval.items[0].releaseBlockReason, "academy_usage_not_approved");

  value.items[0].usageApproved = true;
  const withoutAcademyApproval = selector.selectItems(value, ["DP"], {
    contentData: privatePack, visualAuditData, includeReviewCandidates: true
  });
  assert.equal(withoutAcademyApproval.items[0].releaseEligible, false);
  assert.equal(withoutAcademyApproval.items[0].releaseBlockReason, "academy_usage_not_approved");

  value.items[0].academyFits[0].status = "approved";
  const approved = selector.selectItems(value, ["DP"], { contentData: privatePack, visualAuditData });
  assert.equal(approved.items[0].releaseEligible, true);
});

test("원본 그림 요구가 있는 문항은 본문·답·승인만으로 출제되지 않는다", () => {
  const value = index();
  value.items[0].usageApproved = true;
  value.items[0].academyFits[0].status = "approved";
  const pack = approvedContent(value);
  const visualAuditData = approvedVisualAudit(value);
  const source = pack.items[0].sourceItem;
  const audit = visualAuditData.items[0];
  audit.visualRequirement = "diagram";
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  const review = selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData, includeReviewCandidates: true });
  assert.equal(review.items[0].contentVerified, true);
  assert.equal(review.items[0].presentationVerified, false);
  assert.equal(review.items[0].releaseBlockReason, "presentation_not_verified");

  source.promptParts.push({ kind: "diagram" });
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  source.promptParts[source.promptParts.length - 1].value = "synthetic model";
  audit.renderStatus = "pending";
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  audit.renderStatus = "approved";
  audit.renderEvidence.visualProfiles = audit.renderEvidence.visualProfiles.filter(profile => profile.surface !== "mobile");
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  audit.renderEvidence.visualProfiles.push({ surface: "mobile", status: "pass", artifactSha256: "e".repeat(64) });
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 1);
});

test("시각 요구가 미기록이거나 원본 지문과 감사 지문이 다르면 출제를 막는다", () => {
  const value = index();
  value.items[0].usageApproved = true;
  value.items[0].academyFits[0].status = "approved";
  const pack = approvedContent(value);
  const visualAuditData = approvedVisualAudit(value);
  const audit = visualAuditData.items[0];
  delete audit.visualRequirement;
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  audit.visualRequirement = "none";
  audit.sourceSha256 = "f".repeat(64);
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 0);
  audit.sourceSha256 = pack.items[0].sourceItem.sourceAssetSha256;
  assert.equal(selector.selectItems(value, ["DP"], { contentData: pack, visualAuditData }).itemCount, 1);
});

test("생수형 검수 목록은 내부 유형군·현재 범위 상태를 함께 돌려주지만 출시 가능으로 바꾸지 않는다", () => {
  const result = selector.selectItems(index(), ["SM_STANDARD"], {
    allowedStatuses: selector.CANDIDATE_ALLOWED_STATUSES,
    allowedConceptStatuses: ["mapped", "unit_only", "pending"],
    includeReviewCandidates: true
  });
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].taxonomyReviewStatus, "alias_internal_group");
  assert.equal(result.items[0].internalTypeGroupId, "SM-GRP-LINE-INTERSECTION");
  assert.equal(result.items[0].withinCurrentRange, true);
  assert.equal(result.items[0].domainGroup, "algebra");
  assert.equal(result.items[0].usageApproved, false);
  assert.equal(result.items[0].releaseEligible, false);
  assert.equal(selector.selectItems(index(), ["SM_STANDARD"], { query: "alias_internal_group" }).itemCount, 0);
});

test("공통 문항도 학습 적합성 누락·대기·실패는 검수 목록에서만 보인다", () => {
  for (const state of ["missing", "pending", "fail"]) {
    const value = index();
    const target = value.items[0];
    if (state === "missing") delete target.learnerFit;
    else target.learnerFit = learnerFit(state);
    assert.equal(selector.selectItems(value, ["DP_STANDARD"]).itemCount, 0, state);
    const admin = selector.selectItems(value, ["DP_STANDARD"], {
      allowedStatuses: selector.CANDIDATE_ALLOWED_STATUSES,
      includeReviewCandidates: true
    });
    assert.equal(admin.itemCount, 1, state);
    assert.equal(admin.items[0].releaseEligible, false, state);
    assert.equal(admin.items[0].releaseBlockReason, "learner_fit_not_passed", state);
  }
});
