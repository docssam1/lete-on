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
      {
        sourceBankId: "SAENGSU-CM1-LEGACY", academyId: "SM", label: "생수 구판 참고 후보",
        representativePlan: {
          profileId: "SM_STANDARD", sourceRole: "legacy_reference_candidates", officialCurrentExam: false,
          range: ["중2-2", "중3-1", "중3-2"], questionCount: 30, domainQuotas: { algebra: 15, geometry: 15 },
          timeMinutes: 180, referenceCutline: { score: 20, total: 30, status: "public_reference_only" },
          operationalCutline: null, publicLabel: "생수형 공통수학1 입반 대비 추정 구성", status: "locked"
        }
      }
    ],
    sourceTypes: [
      { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-T1", semester: "중2-1", majorUnit: "함수", minorUnit: "일차함수", detailType: "교점 구하기" },
      { sourceBankId: "WONMATH-M21", sourceTypeId: "WM-U1", semester: "중1", majorUnit: "수와 연산", minorUnit: "소인수분해", detailType: "소인수분해" },
      { sourceBankId: "SAENGSU-CM1-LEGACY", sourceTypeId: "SM-T1", semester: "중3-2", majorUnit: "이차함수", minorUnit: "이차함수의 그래프", detailType: "그래프 조건으로 계수 결정", domainGroup: "algebra", taxonomyReviewStatus: "new_type" }
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
        answerStatus: "verified", taxonomyReviewStatus: "new_type", withinCurrentRange: true, domainGroup: "algebra",
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

test("한 학원형으로 검색해도 문항에 근거가 있는 다른 학원형 태그를 함께 보존한다", () => {
  const value = projectIndex();
  value.items[0].academyFits.push({ profileId: "SM_STANDARD", status: "candidate" });
  const row = catalogModule.createCatalog(value).search({ profileIds: ["DP_STANDARD"], includeCandidates: true })[0];
  assert.deepEqual(row.profiles, [
    { profileId: "DP_STANDARD", label: "돌파형", status: "source_verified" },
    { profileId: "SM_STANDARD", label: "생수형", status: "candidate" }
  ]);
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
  assert.equal(rows[0].domainGroup, "algebra");
  assert.equal(rows[0].releaseEligible, false);
  assert.equal(rows[0].releaseBlockReason, "learner_fit_not_passed");
});

test("생수형 대표 시험 분석은 30문항·대수 15·기하 15 기준과 잠금 이유를 문항 내용 없이 돌려준다", () => {
  const value = projectIndex();
  value.items[0].academyFits.push({ profileId: "SM_STANDARD", status: "candidate" });
  const catalog = catalogModule.createCatalog(value);
  const analyses = catalog.analyses(["SM_STANDARD"]);
  assert.equal(analyses.length, 1);
  assert.equal(analyses[0].questionCount, 30);
  assert.deepEqual(analyses[0].domain, {
    algebra: { required: 15, candidates: 1, ready: 0 },
    geometry: { required: 15, candidates: 0, ready: 0 }
  });
  assert.equal(analyses[0].candidatePoolCount, 1);
  assert.equal(analyses[0].fullyReviewedCount, 0);
  assert.equal(analyses[0].canCompose, false);
  assert.equal(analyses[0].status, "locked");
  assert.equal(analyses[0].operationalCutline, null);
  assert.match(analyses[0].blockers.join(" "), /모든 검수.*30개보다 적습니다/);
  assert.equal(JSON.stringify(analyses).includes("SM-LEGACY-R01-Q01"), false);
  assert.deepEqual(catalog.analyses(["DP_STANDARD"]), []);
});

test("생수형은 대수·기하 각 15문항의 모든 확인과 사용 승인이 끝나야만 조립 가능해진다", () => {
  const value = projectIndex();
  value.items = value.items.filter(item => item.sourceBankId !== "SAENGSU-CM1-LEGACY");
  for (let index = 0; index < 30; index += 1) {
    value.items.push({
      itemId: `SAENGSU-CM1-LEGACY:READY-${index + 1}`,
      sourceBankId: "SAENGSU-CM1-LEGACY",
      sourceItemId: `READY-${index + 1}`,
      sourceTypeId: "SM-T1",
      conceptFamilyId: "CPT-1",
      canonicalConceptFamilyId: "CPT-1",
      conceptStatus: "mapped",
      classificationStatus: "verified",
      detailPrecision: "verified",
      answerStatus: "verified",
      learnerFit: learnerFitPass,
      difficultyBand: "raised",
      difficultyStatus: "verified",
      responseKind: "input",
      responseStatus: "verified",
      usageApproved: true,
      withinCurrentRange: true,
      domainGroup: index < 15 ? "algebra" : "geometry",
      academyFits: [{ profileId: "SM_STANDARD", status: "approved" }]
    });
  }
  value.summary.itemCount = 33;
  value.summary.mappedItemCount = 32;
  value.summary.pendingItemCount = 0;
  const catalog = catalogModule.createCatalog(value);
  const analysis = catalog.analyses(["SM_STANDARD"])[0];
  assert.equal(analysis.canCompose, true);
  assert.equal(analysis.status, "ready");
  assert.equal(analysis.fullyReviewedCount, 30);
  assert.deepEqual(analysis.domain, {
    algebra: { required: 15, candidates: 15, ready: 15 },
    geometry: { required: 15, candidates: 15, ready: 15 }
  });
  assert.deepEqual(analysis.blockers, []);

  value.items[29 + 3].usageApproved = false;
  value.items[29 + 3].academyFits = [{ profileId: "SM_STANDARD", status: "candidate" }];
  const locked = catalogModule.createCatalog(value).analyses(["SM_STANDARD"])[0];
  assert.equal(locked.canCompose, false);
  assert.equal(locked.domain.geometry.ready, 14);
  assert.match(locked.blockers.join(" "), /기하 문항이 15개보다 적습니다/);
});

test("공통 문항 ID로도 기존 돌파 원본 페이지 위치를 안전하게 찾는다", () => {
  const locatorDb = database();
  locatorDb.questions[0].locator = { page: 3, status: "verified", evidence: ["paper.a"] };
  locatorDb.summary = builder.summarize(locatorDb);
  const catalog = catalogModule.createProjectCatalog(projectIndex(), { locatorDatabase: locatorDb });
  assert.deepEqual(catalog.privateLocator("DOLPA-ORIGINAL:DP-Q-AAAAAAAAAAAA-001"), { sourceId: "DP-SRC-AAAAAAAAAAAA", page: 3 });
});
