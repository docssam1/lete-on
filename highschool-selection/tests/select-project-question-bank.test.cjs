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
        conceptFamilyId: "CPT-1", conceptStatus: "mapped",
        answerStatus: "verified", learnerFit: learnerFit(),
        academyFits: [
          { profileId: "DP_STANDARD", status: "source_verified" },
          { profileId: "SH_SELECTION", status: "candidate" }
        ]
      },
      {
        itemId: "WM:Q1", sourceBankId: "WM", sourceItemId: "Q1", sourceTypeId: "WM-U1",
        conceptFamilyId: null, conceptStatus: "unit_only",
        answerStatus: "verified", learnerFit: learnerFit(),
        academyFits: [{ profileId: "WM_BASIC", status: "source_verified" }]
      },
      {
        itemId: "SAENGSU:Q1", sourceBankId: "SAENGSU", sourceItemId: "Q1", sourceTypeId: "SM-T1",
        conceptFamilyId: "CPT-1", conceptStatus: "mapped",
        answerStatus: "pending", taxonomyReviewStatus: "alias_internal_group",
        internalTypeGroupId: "SM-GRP-LINE-INTERSECTION", withinCurrentRange: true, domainGroup: "algebra",
        academyFits: [{ profileId: "SM_STANDARD", status: "candidate" }]
      }
    ]
  };
}

test("학원형 선택은 그 학원의 근거 있는 세부유형 문항만 반환한다", () => {
  const result = selector.selectItems(index(), ["돌파형"]);
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
  const result = selector.selectItems(index(), ["WM_BASIC"], { allowedConceptStatuses: ["mapped", "unit_only"] });
  assert.equal(result.itemCount, 1);
  assert.equal(result.items[0].sourceBankLabel, "원수학 중2-1 기본반");
  assert.equal(result.items[0].detailType, "일차함수");
  assert.equal(result.items[0].conceptFamilyId, null);
  assert.equal(result.items[0].conceptStatus, "unit_only");
});

test("검색은 공통 유형명과 원본 유형명을 모두 찾는다", () => {
  assert.equal(selector.selectItems(index(), ["DP"], { query: "두 직선" }).itemCount, 1);
  assert.equal(selector.selectItems(index(), ["DP"], { query: "교점 구하기" }).itemCount, 1);
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
