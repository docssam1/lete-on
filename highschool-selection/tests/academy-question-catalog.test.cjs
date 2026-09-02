"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");
const catalogModule = require("../server/academy-question-catalog.js");

const learnerFitPass = Object.freeze({ overall: "pass", dimensions: Object.freeze({ language: "pass", representations: "pass", prerequisites: "pass", reasoningLoad: "pass", responseMode: "pass" }) });

function database(options) {
  const opts = options || {};
  const semester = opts.semester || "중2-1";
  const unit = opts.unit || "일차함수";
  const typeLabel = opts.typeLabel || "두 직선의 교점 구하기";
  const result = builder.buildDatabase({
    taxonomyVersion: "dolpa-kr-math-v1",
    sources: [{ sourceId: "DP-SRC-AAAAAAAAAAAA", sourceFingerprint: "a".repeat(64) }],
    questions: [{
      questionId: "DP-Q-AAAAAAAAAAAA-001",
      sourceId: "DP-SRC-AAAAAAAAAAAA",
      paperId: "DP-PAPER-A",
      paperTitle: "대표 시험 A",
      number: 1,
      sourceRelation: "original",
      curriculum: { semester, domain: "함수", unit },
      type: { typeId: ledgerCore.stableTypeId(semester, unit, typeLabel), label: typeLabel, methodTags: [], methodReviewStatus: "pending" },
      difficulty: { band: null, status: "pending", evidence: [] },
      classificationStatus: "verified",
      evidence: ["paper.a"]
    }]
  }, null, "1".repeat(64));
  result.questions[0].answerCheck = { status: "verified", evidence: ["private.answer.audit"] };
  result.questions[0].learnerFit = learnerFitPass;
  result.summary = builder.summarize(result);
  return result;
}

function projectIndex() {
  return {
    schemaVersion: 1,
    academyProfiles: [
      { profileId: "DP_STANDARD", programId: "DP", label: "돌파형" },
      { profileId: "WM_BASIC", programId: "WM", label: "원수학 기본형" },
      { profileId: "SM_STANDARD", programId: "SM", label: "생수형" }
    ],
    sourceBanks: [
      { sourceBankId: "DOLPA-ORIGINAL", label: "돌파 원본 시험" },
      { sourceBankId: "WONMATH-M21", label: "원수학 중2-1 기본반" },
      { sourceBankId: "SAENGSU-CM1-LEGACY", academyId: "SM", label: "생수 구판 참고 후보" }
    ],
    sourceTypes: [
      { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-T1", semester: "중2-1", majorUnit: "함수", minorUnit: "일차함수", detailType: "교점 구하기" },
      { sourceBankId: "WONMATH-M21", sourceTypeId: "WM-U1", semester: "중1", majorUnit: "수와 연산", minorUnit: "소인수분해", detailType: "소인수분해" },
      { sourceBankId: "SAENGSU-CM1-LEGACY", sourceTypeId: "SM-T1", semester: "중3-2", majorUnit: "이차함수", minorUnit: "이차함수의 그래프", detailType: "그래프 조건으로 계수 결정", taxonomyReviewStatus: "new_type" }
    ],
    conceptFamilies: [{
      conceptFamilyId: "CPT-1",
      curriculum: { course: "", semester: "중2-1", majorUnit: "함수", minorUnit: "일차함수" },
      canonicalLabel: "두 직선의 교점 구하기",
      sourceTypes: [{ sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-T1" }],
      mergeStatus: "single_source"
    }],
    overlapCandidates: [],
    typeRelations: [],
    items: [
      {
        itemId: "DOLPA-ORIGINAL:DP-Q-AAAAAAAAAAAA-001", sourceBankId: "DOLPA-ORIGINAL", sourceItemId: "DP-Q-AAAAAAAAAAAA-001", sourceTypeId: "DP-T1",
        conceptFamilyId: "CPT-1", canonicalConceptFamilyId: "CPT-1", conceptStatus: "mapped", classificationStatus: "verified", detailPrecision: "verified",
        answerStatus: "verified", learnerFit: learnerFitPass,
        academyFits: [{ profileId: "DP_STANDARD", status: "source_verified" }]
      },
      {
        itemId: "WONMATH-M21:R01-Q01", sourceBankId: "WONMATH-M21", sourceItemId: "R01-Q01", sourceTypeId: "WM-U1",
        conceptFamilyId: null, canonicalConceptFamilyId: null, conceptStatus: "unit_only", classificationStatus: "verified_unit_only", detailPrecision: "unit_only",
        answerStatus: "verified", learnerFit: learnerFitPass,
        academyFits: [{ profileId: "WM_BASIC", status: "source_verified" }]
      },
      {
        itemId: "DOLPA-ORIGINAL:DP-Q-AAAAAAAAAAAA-002", sourceBankId: "DOLPA-ORIGINAL", sourceItemId: "DP-Q-AAAAAAAAAAAA-002", sourceTypeId: "DP-T1",
        conceptFamilyId: "CPT-1", canonicalConceptFamilyId: "CPT-1", conceptStatus: "mapped", classificationStatus: "verified", detailPrecision: "verified",
        answerStatus: "verified", learnerFit: learnerFitPass,
        academyFits: [{ profileId: "WM_BASIC", status: "candidate" }]
      },
      {
        itemId: "SAENGSU-CM1-LEGACY:SM-LEGACY-R01-Q01", sourceBankId: "SAENGSU-CM1-LEGACY", sourceItemId: "SM-LEGACY-R01-Q01", sourceTypeId: "SM-T1",
        conceptFamilyId: null, canonicalConceptFamilyId: null, conceptStatus: "pending", classificationStatus: "reviewed_detail_locked", detailPrecision: "candidate",
        answerStatus: "verified", taxonomyReviewStatus: "new_type", withinCurrentRange: true,
        academyFits: [{ profileId: "SM_STANDARD", status: "candidate" }]
      }
    ],
    summary: {
      sourceBankCount: 3, itemCount: 4, mappedItemCount: 2, unitOnlyItemCount: 1, pendingItemCount: 1,
      sourceTypeCount: 3, conceptFamilyCount: 1, exactMergedFamilyCount: 0, overlapCandidateCount: 0
    }
  };
}

test("학원형 문항 목록은 시험형과 교육과정 분류만 안전하게 반환한다", () => {
  const catalog = catalogModule.createCatalog(database());
  const items = catalog.search({ profileIds: ["DP_STANDARD"], query: "교점", limit: 20 });
  assert.equal(items.length, 1);
  assert.equal(items[0].majorUnit, "함수");
  assert.equal(items[0].minorUnit, "일차함수");
  assert.equal(items[0].profiles[0].label, "돌파형");
  assert.equal(items[0].reviewChecks.classification, true);
  assert.equal(items[0].reviewChecks.method, false);
  assert.equal(items[0].reviewChecks.usageApproval, false);
  assert.equal(Object.hasOwn(items[0], "sourceId"), false);
  assert.equal(JSON.stringify(items).includes("answer"), false);
});

test("다른 시험형의 검수 전 후보는 기본 문항 목록에 나오지 않는다", () => {
  const catalog = catalogModule.createCatalog(database());
  assert.deepEqual(catalog.search({ profileIds: ["WM_DUAL"] }), []);
  assert.equal(catalog.profiles().some(profile => profile.profileId === "WM_BASIC"), true);
  assert.equal(catalog.profiles().some(profile => profile.profileId === "WM_DUAL"), true);
});

test("학습 적합성 검수가 없으면 기본 목록에서 빠지고 관리자 후보 목록에 상태를 표시한다", () => {
  const value = database();
  delete value.questions[0].learnerFit;
  const catalog = catalogModule.createCatalog(value);
  assert.equal(catalog.search({ profileIds: ["DP_STANDARD"] }).length, 0);
  const rows = catalog.search({ profileIds: ["DP_STANDARD"], includeCandidates: true });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].learnerFit.overall, "pending");
  assert.equal(rows[0].releaseEligible, false);
  assert.equal(rows[0].releaseBlockReason, "learner_fit_not_passed");
});

test("돌파 시험 대상이 정해지면 범위 밖 원본 문항을 구성 후보에서 뺀다", () => {
  const outside = catalogModule.createCatalog(database({
    semester: "중2-2",
    unit: "도형의 닮음",
    typeLabel: "닮음비로 길이 구하기"
  }));
  assert.equal(outside.search({ profileIds: ["DP_STANDARD"], targetId: "dp-middle2-2-transfer" }).length, 0);

  const inside = catalogModule.createCatalog(database({
    unit: "연립일차방정식의 활용",
    typeLabel: "거리와 속력 조건을 연립방정식으로 나타내기"
  }));
  assert.equal(inside.search({ profileIds: ["DP_STANDARD"], targetId: "dp-middle2-2-transfer" }).length, 1);
});

test("공통 문항 인덱스에서는 학원형별 원본과 단원 분류 대기 문항을 함께 찾는다", () => {
  const catalog = catalogModule.createCatalog(projectIndex());
  const dolpa = catalog.search({ profileIds: ["DP_STANDARD"], query: "교점" });
  assert.equal(dolpa.length, 1);
  assert.equal(dolpa[0].questionId, "DOLPA-ORIGINAL:DP-Q-AAAAAAAAAAAA-001");
  assert.equal(dolpa[0].sourceLabel, "돌파 원본 시험");
  assert.equal(dolpa[0].reviewChecks.classification, true);

  const wonmath = catalog.search({ profileIds: ["WM_BASIC"] });
  assert.equal(wonmath.length, 1);
  assert.equal(wonmath[0].conceptStatus, "unit_only");
  assert.equal(wonmath[0].typeLabel, "소인수분해");
  assert.equal(wonmath[0].reviewChecks.classification, false);

  const strict = catalog.search({ profileIds: ["WM_BASIC"], query: "교점" });
  assert.equal(strict.length, 0);
  const candidates = catalog.search({ profileIds: ["WM_BASIC"], query: "교점", includeCandidates: true });
  assert.equal(candidates.length, 1);
  assert.deepEqual(candidates[0].profiles, [{ profileId: "WM_BASIC", label: "원수학 기본형", status: "candidate" }]);
});

test("공통 문항 인덱스도 학습 적합성 미검수 문항은 관리자 후보에서만 보인다", () => {
  const value = projectIndex();
  delete value.items[0].learnerFit;
  const catalog = catalogModule.createCatalog(value);
  assert.equal(catalog.search({ profileIds: ["DP_STANDARD"] }).length, 0);
  const rows = catalog.search({ profileIds: ["DP_STANDARD"], includeCandidates: true });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].learnerFit.overall, "pending");
  assert.equal(rows[0].releaseEligible, false);
  assert.equal(rows[0].releaseBlockReason, "learner_fit_not_passed");
});

test("생수형의 신규·내부 유형 후보는 관리자 검수에서만 분류 상태와 함께 보인다", () => {
  const catalog = catalogModule.createCatalog(projectIndex());
  assert.deepEqual(catalog.search({ profileIds: ["SM_STANDARD"] }), []);
  const rows = catalog.search({ profileIds: ["SM_STANDARD"], includeCandidates: true });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].conceptStatus, "pending");
  assert.equal(rows[0].taxonomyReviewStatus, "new_type");
  assert.equal(rows[0].withinCurrentRange, true);
  assert.equal(rows[0].releaseEligible, false);
  assert.equal(rows[0].releaseBlockReason, "learner_fit_not_passed");
});

test("공통 문항 ID로도 기존 돌파 원본 페이지 위치를 안전하게 찾는다", () => {
  const locatorDb = database();
  locatorDb.questions[0].locator = { page: 3, status: "verified", evidence: ["paper.a"] };
  locatorDb.summary = builder.summarize(locatorDb);
  const catalog = catalogModule.createProjectCatalog(projectIndex(), { locatorDatabase: locatorDb });
  assert.deepEqual(catalog.privateLocator("DOLPA-ORIGINAL:DP-Q-AAAAAAAAAAAA-001"), { sourceId: "DP-SRC-AAAAAAAAAAAA", page: 3 });
});
