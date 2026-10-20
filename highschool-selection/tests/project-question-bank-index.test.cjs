"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-project-question-bank-index.cjs");
const audit = require("../scripts/audit-project-question-bank-index.cjs");

function fixture() {
  const profileIds = ["DP_STANDARD", "SM_STANDARD", "WM_BASIC", "WM_DUAL", "ED_CUMULATIVE", "SH_SELECTION", "DG_ADVANCED"];
  return {
    dolpa: {
      profileCatalog: [],
      typeCatalog: [{ typeId: "DP-T1", semester: "중2-1", majorUnit: "함수", minorUnit: "일차함수", label: "두 직선의 교점 구하기", questionIds: ["DP-Q1"] }],
      questions: [{
        questionId: "DP-Q1",
        classification: { typeId: "DP-T1", status: "verified" },
        method: { solutionArchetype: null, status: "pending", tags: [], evidence: [] },
        usageProfiles: profileIds.map(profileId => ({ profileId, status: profileId === "DP_STANDARD" ? "source_verified" : "candidate" }))
      }]
    },
    sharedTypes: {
      types: [{
        type_id: "M2.FUNC.LINE.INTERSECT.001", course: "중2-1", major_unit: "함수", minor_unit: "일차함수",
        detail_type: "두 직선의 교점 구하기", solution_archetype: "", question_count: 3, evidence: []
      }]
    },
    hwangsoRound: { items: [] },
    wonmathManifests: [{ items: [{ examNumber: 1, bookId: "AG_G7_ALG_VAR", majorUnit: "함수", minorUnit: "일차함수", typeId: "M2-FUNC-LINE" }] }],
    hwangsoMiddle: { items: [] }
  };
}

function saengsuFixture() {
  return {
    sourceRole: "legacy_reference_candidates",
    officialCurrentExam: false,
    representativePolicy: {
      range: ["중2-2", "중3-1", "중3-2"],
      questionCount: 30,
      domainBalance: { algebra: 15, geometry: 15 },
      timeMinutes: 180,
      referenceCutline: { score: 20, total: 30, status: "public_reference_only" },
      cutlineStatus: "locked_non_operational",
      publicLabel: "생수형 공통수학1 입반 대비 추정 구성"
    },
    types: [
      {
        candidateTypeId: "SMTYPE-TEST-1",
        primaryDomain: "대수",
        majorUnit: "이차방정식",
        minorUnit: "이차방정식의 활용",
        detailType: "조건을 이용해 두 근의 관계 구하기",
        canonicalMergeStatus: "pending"
      },
      {
        candidateTypeId: "SMTYPE-TEST-2",
        primaryDomain: "대수",
        majorUnit: "일차함수",
        minorUnit: "일차함수의 그래프",
        detailType: "그래프에서 두 직선의 교점 구하기",
        canonicalMergeStatus: "pending"
      }
    ],
    questions: [
      {
        questionId: "SM-LEGACY-R01-Q01",
        paperId: "SM-LEGACY-R01",
        questionNumber: 1,
        sourceLocator: { sourceId: "saengsu-r01", questionNumber: 1 },
        candidateTypeId: "SMTYPE-TEST-1",
        curriculum: {
          semesters: ["중3-1"],
          primaryDomain: "대수",
          majorUnit: "이차방정식",
          minorUnit: "이차방정식의 활용",
          detailType: "조건을 이용해 두 근의 관계 구하기",
          curriculumStatus: "verified"
        },
        withinCurrentRange: true,
        legacyDifficulty: "심화",
        difficultyAction: "raise",
        targetDifficultyBand: "raised",
        responseEvidence: { independentCorrectnessVerified: false },
        academyCompatibility: [{ profileId: "SM_STANDARD", state: "candidate" }],
        usageApproved: false,
        releaseStatus: "locked"
      },
      {
        questionId: "SM-LEGACY-R01-Q02",
        paperId: "SM-LEGACY-R01",
        questionNumber: 2,
        sourceLocator: { sourceId: "saengsu-r01", questionNumber: 2 },
        candidateTypeId: "SMTYPE-TEST-2",
        curriculum: {
          semesters: ["중2-1"],
          primaryDomain: "대수",
          majorUnit: "일차함수",
          minorUnit: "일차함수의 그래프",
          detailType: "그래프에서 두 직선의 교점 구하기",
          curriculumStatus: "verified"
        },
        withinCurrentRange: false,
        legacyDifficulty: "심화",
        difficultyAction: "review",
        targetDifficultyBand: null,
        responseEvidence: { independentCorrectnessVerified: false },
        academyCompatibility: [{ profileId: "SM_STANDARD", state: "excluded" }],
        usageApproved: false,
        releaseStatus: "locked"
      }
    ]
  };
}

function blacklabelFixture() {
  return {
    sourcePairs: [{ pairId: "BLACKLABEL-2025-M11", problemSha256: "problem", solutionSha256: "solution" }],
    items: [{
      itemId: "ITM.BLACKLABEL.2025-M11-P011.Q01",
      sourceItemId: "M11-P011-Q01",
      sourceTypeId: "BL25-TYP-M11-LINE-INTERSECTION",
      unitTypeId: "M2-FUNC-LINE",
      sourceLocator: { problemSourceMemoryId: "blacklabel-2025-m11-problem", pdfPage: 11, printedQuestionNumber: 1 },
      classification: {
        semester: "중1-1",
        majorUnit: "함수",
        minorUnit: "일차함수",
        detailType: "두 직선의 교점 구하기",
        solutionArchetype: "두 직선의 식을 연립해 교점 좌표를 구한다.",
        status: "verified"
      },
      answerCheck: { canonicalAnswer: "비공개", status: "source_solution_and_independent_math_verified" },
      overlap: { status: "exact_solution_structure", matchedSourceTypeId: "DP-T1" },
      visualAudit: { status: "not_required" },
      academyFits: [{ profileId: "WM_BASIC", status: "candidate" }],
      questionBankEligible: true,
      mockExamEligible: false,
      releaseStatus: "locked"
    }]
  };
}

test("같은 교육과정 위치와 같은 세부 유형은 공통 개념 하나로 합친다", () => {
  const index = builder.buildIndex(fixture());
  const family = index.conceptFamilies.find(item => item.canonicalLabel === "두 직선의 교점 구하기");
  assert.ok(family);
  assert.equal(family.sourceTypes.length, 2);
  assert.equal(family.mergeStatus, "exact_verified");
  assert.equal(index.items[0].conceptFamilyId, family.conceptFamilyId);
});

test("단원 수준 분류는 세부 유형으로 억지 병합하지 않는다", () => {
  const index = builder.buildIndex(fixture());
  const wonmath = index.items.find(item => item.sourceBankId === "WONMATH-M21");
  assert.equal(wonmath.conceptStatus, "unit_only");
  assert.equal(wonmath.conceptFamilyId, null);
});

test("돌파 원본 색인은 본문·정답이 없는 공개용 목록이지 출제 가능 문항 DB가 아니다", () => {
  const index = builder.buildIndex(fixture());
  const bank = index.sourceBanks.find(item => item.sourceBankId === "DOLPA-ORIGINAL");
  const item = index.items.find(candidate => candidate.sourceBankId === "DOLPA-ORIGINAL");
  assert.equal(bank.status, "index_verified_content_locked");
  assert.equal(bank.materializationStatus, "metadata_index_only");
  assert.equal(item.materializationStatus, "metadata_index_only");
  assert.equal(item.releaseStatus, "locked");
  assert.equal(Object.hasOwn(item, "promptParts"), false);
  assert.equal(Object.hasOwn(item, "answer"), false);
});

test("돌파 별도 원본 문항은 기존 번호를 덮어쓰지 않고 잠금 상태로 추가한다", () => {
  const input = fixture();
  input.dolpaSourceAddenda = [{
    visibility: "private",
    sourceBankId: "DOLPA-ORIGINAL",
    mergeGate: { ready: false },
    mockExam: { candidateExamId: "test-mock", releaseStatus: "locked" },
    source: { sourceId: "DP-SRC-OTHER", sourceFingerprint: "fingerprint", sourcePdfSha256: "pdfhash" },
    sourceTypes: [{ sourceTypeId: "DP-T2", sourceQuestionId: "DP-Q2", semester: "중3-1",
      majorUnit: "문자와 식", minorUnit: "이차방정식", detailType: "매출 변화율",
      solvingModel: "quadratic", visualModel: "none", answerContract: "single-value",
      responseKind: "input", difficulty: "standard", conceptFamilyId: null,
      detailPrecision: "source_and_answer_verified_type_relation_pending", releaseStatus: "locked", evidence: [] }],
    items: [{ sourceQuestionId: "DP-Q2", sourceKey: "DP-SRC-OTHER:p9:q25", sourceTypeId: "DP-T2", mockSlot: 8,
      materializationStatus: "private_source_candidate", releaseStatus: "locked",
      academyFits: [{ profileId: "DP_STANDARD", status: "source_verified_not_current_exam_claim" }] }]
  }];
  const index = builder.buildIndex(input);
  const original = index.items.find(item => item.sourceItemId === "DP-Q1");
  const added = index.items.find(item => item.sourceItemId === "DP-Q2");
  assert.ok(original);
  assert.equal(added.conceptFamilyId, null);
  assert.equal(added.conceptStatus, "pending");
  assert.equal(added.releaseStatus, "locked");
  assert.equal(added.usageApproved, false);
  assert.equal(index.sourceBanks.find(bank => bank.sourceBankId === "DOLPA-ORIGINAL").itemCount, 2);
  const forbidden = [];
  require("../scripts/project-question-bank-core.cjs").walkForbidden(index, "", forbidden);
  assert.deepEqual(forbidden, []);
  assert.equal(JSON.stringify(index).includes("privateContentRef"), false);
  input.dolpaSourceAddenda[0].items[0].sourceQuestionId = "DP-Q1";
  assert.throws(() => builder.buildIndex(input), /출처·중복 상태/);
});

test("에이급만 사용한 원수학 대비 임시 세트는 원수학 원본으로 표시하거나 자동 출제하지 않는다", () => {
  const index = builder.buildIndex(fixture());
  const bank = index.sourceBanks.find(item => item.sourceBankId === "WONMATH-M21");
  const item = index.items.find(candidate => candidate.sourceBankId === "WONMATH-M21");
  assert.equal(bank.officialWonmathPastPaper, false);
  assert.equal(bank.status, "a_grade_only_rebuild_required");
  assert.match(bank.label, /에이급 기반/);
  assert.deepEqual(bank.sourceComposition, [{ sourceBookId: "AG_G7_ALG_VAR", itemCount: 1 }]);
  assert.equal(item.releaseStatus, "locked");
  assert.equal(item.usageApproved, false);
  assert.deepEqual(item.academyFits, [{ profileId: "WM_BASIC", status: "candidate" }]);
});

test("검수된 돌파 풀이 방법은 공용 유형에 연결하고 미검수 방법은 비워 둔다", () => {
  const input = fixture();
  input.dolpa.typeCatalog[0].solutionArchetype = "두 직선의 식을 연립해 교점 좌표를 구한다.";
  input.dolpa.typeCatalog[0].methodStatus = "verified";
  input.dolpa.questions[0].method = { solutionArchetype: "두 직선의 식을 연립해 교점 좌표를 구한다.", status: "verified", tags: ["연립"], evidence: ["review"] };
  const reviewed = builder.buildIndex(input);
  const dolpa = reviewed.sourceTypes.find(type => type.sourceBankId === "DOLPA-ORIGINAL");
  assert.equal(dolpa.solutionArchetype, "두 직선의 식을 연립해 교점 좌표를 구한다.");
  assert.equal(reviewed.items.find(item => item.sourceBankId === "DOLPA-ORIGINAL").solutionArchetype, "두 직선의 식을 연립해 교점 좌표를 구한다.");

  input.dolpa.typeCatalog[0].methodStatus = "partial";
  input.dolpa.questions[0].method = { solutionArchetype: null, status: "pending", tags: [], evidence: [] };
  const pending = builder.buildIndex(input);
  assert.equal(pending.sourceTypes.find(type => type.sourceBankId === "DOLPA-ORIGINAL").solutionArchetype, "");
});

test("검수된 원수학 문항은 세부 유형으로 연결하고 원래 단원 유형 ID도 보존한다", () => {
  const input = fixture();
  input.wonmathDetailReviews = {
    reviews: [{
      sourceItemId: "R01-Q01",
      sourceUnitTypeId: "M2-FUNC-LINE",
      sourceTypeId: "WM-TYP-TEST",
      semester: "중2-1",
      majorUnit: "함수",
      minorUnit: "일차함수",
      detailType: "두 직선의 교점 구하기",
      solutionArchetype: "두 일차식을 연립하여 교점 좌표 구하기",
      detailPrecision: "verified",
      classificationStatus: "reviewed",
      evidence: ["wm-audit:R01-Q01"]
    }]
  };
  const index = builder.buildIndex(input);
  const wonmath = index.items.find(item => item.sourceBankId === "WONMATH-M21");
  assert.equal(wonmath.sourceUnitTypeId, "M2-FUNC-LINE");
  assert.equal(wonmath.sourceTypeId, "WM-TYP-TEST");
  assert.equal(wonmath.conceptStatus, "mapped");
  assert.ok(wonmath.conceptFamilyId);
  assert.equal(index.sourceTypes.some(type => type.sourceBankId === "WONMATH-M21" && type.sourceTypeId === "M2-FUNC-LINE"), false);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("황소 교재 문항은 검수된 단원까지만 연결하고 세부유형으로 가장하지 않는다", () => {
  const input = fixture();
  input.hwangsoMiddle.items = [{ id: "SH-M1", releaseStatus: "locked", discoveryStatus: "visual_verified", classificationStatus: "pending" }];
  input.hwangsoMiddle.rejectedCandidates = [];
  input.hwangsoCurriculumReviews = {
    reviews: [{
      sourceItemId: "SH-M1",
      sourceUnitTypeId: "SH-UNT-TEST",
      semester: "중1-1",
      majorUnit: "수와 연산",
      minorUnit: "소인수분해",
      classificationStatus: "reviewed_unit",
      detailPrecision: "unit_only",
      evidence: ["source:p.3 단원 머리말"]
    }]
  };
  const index = builder.buildIndex(input);
  const item = index.items.find(candidate => candidate.sourceItemId === "SH-M1");
  assert.equal(item.sourceTypeId, "SH-UNT-TEST");
  assert.equal(item.conceptStatus, "unit_only");
  assert.equal(item.conceptFamilyId, null);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("황소 문항도 시각 검수된 세부유형만 공통 개념에 연결한다", () => {
  const input = fixture();
  input.hwangsoMiddle.items = [{ id: "SH-M1", releaseStatus: "locked", discoveryStatus: "visual_verified", classificationStatus: "pending" }];
  input.hwangsoMiddle.rejectedCandidates = [];
  input.hwangsoCurriculumReviews = {
    reviews: [{
      sourceItemId: "SH-M1",
      sourceUnitTypeId: "SH-UNT-TEST",
      sourceTypeId: "SH-TYP-TEST",
      semester: "중2-1",
      majorUnit: "함수",
      minorUnit: "일차함수",
      detailType: "두 직선의 교점 구하기",
      solutionArchetype: "두 일차식을 연립하여 교점 좌표 구하기",
      classificationStatus: "reviewed_detail",
      detailPrecision: "verified",
      evidence: ["source:p.3 첫째 문항"]
    }]
  };
  const index = builder.buildIndex(input);
  const item = index.items.find(candidate => candidate.sourceItemId === "SH-M1");
  assert.equal(item.sourceUnitTypeId, "SH-UNT-TEST");
  assert.equal(item.sourceTypeId, "SH-TYP-TEST");
  assert.equal(item.conceptStatus, "mapped");
  assert.ok(item.conceptFamilyId);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("생수 구판 후보는 공통 유형에 연결하되 정답 검산 전 출제 승인을 막는다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  const index = builder.buildIndex(input);
  const bank = index.sourceBanks.find(item => item.sourceBankId === "SAENGSU-CM1-LEGACY");
  const current = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q01");
  const excluded = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q02");
  assert.equal(bank.itemCount, 2);
  assert.equal(current.conceptStatus, "pending");
  assert.equal(current.conceptFamilyId, null);
  assert.equal(current.answerStatus, "pending");
  assert.equal(current.releaseStatus, "locked");
  assert.equal(current.usageApproved, false);
  assert.equal(current.domainGroup, "algebra");
  assert.equal(index.sourceTypes.find(item => item.sourceTypeId === "SMTYPE-TEST-1").domainGroup, "algebra");
  assert.deepEqual(bank.representativePlan.domainQuotas, { algebra: 15, geometry: 15 });
  assert.equal(bank.representativePlan.officialCurrentExam, false);
  assert.equal(bank.representativePlan.operationalCutline, null);
  assert.deepEqual(current.academyFits, [{ profileId: "SM_STANDARD", status: "candidate" }]);
  assert.deepEqual(excluded.academyFits, [{ profileId: "SM_STANDARD", status: "excluded" }]);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("생수 후보 DB의 문항-유형 연결이 깨지면 인덱스 생성을 막는다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  input.saengsuLegacy.questions[0].candidateTypeId = "SMTYPE-MISSING";
  assert.throws(() => builder.buildIndex(input), /없는 유형/);
});

test("생수 대수·기하 분류와 30문항 대표 기준이 맞지 않으면 인덱스 생성을 막는다", () => {
  const missingDomain = fixture();
  missingDomain.saengsuLegacy = saengsuFixture();
  delete missingDomain.saengsuLegacy.questions[0].curriculum.primaryDomain;
  delete missingDomain.saengsuLegacy.types[0].primaryDomain;
  assert.throws(() => builder.buildIndex(missingDomain), /대수·기하 분류/);

  const wrongQuota = fixture();
  wrongQuota.saengsuLegacy = saengsuFixture();
  wrongQuota.saengsuLegacy.representativePolicy.domainBalance.geometry = 14;
  assert.throws(() => builder.buildIndex(wrongQuota), /대표 시험 구성 기준/);

  const wrongCutline = fixture();
  wrongCutline.saengsuLegacy = saengsuFixture();
  wrongCutline.saengsuLegacy.representativePolicy.referenceCutline.total = 50;
  assert.throws(() => builder.buildIndex(wrongCutline), /과거 공개 참고 점수/);
});

test("검수된 생수 병합·별칭만 기존 공통 유형에 연결하고 나머지는 대기로 둔다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  input.saengsuLegacy.types[0].canonicalMergeStatus = "alias_existing";
  input.saengsuLegacy.types[0].canonicalTarget = { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "DP-T1" };
  const index = builder.buildIndex(input);
  const reviewed = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q01");
  const pending = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q02");
  const dolpa = index.items.find(item => item.sourceItemId === "DP-Q1");
  assert.equal(reviewed.conceptStatus, "mapped");
  assert.equal(reviewed.canonicalConceptFamilyId, dolpa.conceptFamilyId);
  assert.equal(reviewed.conceptFamilyId, dolpa.conceptFamilyId);
  assert.equal(pending.conceptStatus, "pending");
  assert.equal(reviewed.releaseStatus, "locked");
  assert.equal(reviewed.usageApproved, false);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("생수 내부 유형군과 별도·신규 후보는 검색 정보로 남기되 공통 유형으로 가장하지 않는다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  input.saengsuLegacy.types[0].canonicalMergeStatus = "alias_internal_group";
  input.saengsuLegacy.types[0].canonicalInternalGroupId = "SM-GRP-QUADRATIC-COEFFICIENT";
  input.saengsuLegacy.types[1].canonicalMergeStatus = "new_type";
  const index = builder.buildIndex(input);
  const internalAlias = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q01");
  const newCandidate = index.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q02");
  const internalAliasType = index.sourceTypes.find(type => type.sourceTypeId === "SMTYPE-TEST-1");
  const bank = index.sourceBanks.find(item => item.sourceBankId === "SAENGSU-CM1-LEGACY");
  assert.equal(internalAlias.taxonomyReviewStatus, "alias_internal_group");
  assert.equal(internalAlias.internalTypeGroupId, "SM-GRP-QUADRATIC-COEFFICIENT");
  assert.equal(internalAlias.conceptStatus, "pending");
  assert.equal(internalAlias.canonicalConceptFamilyId, null);
  assert.equal(newCandidate.taxonomyReviewStatus, "new_type");
  assert.equal(newCandidate.conceptStatus, "pending");
  assert.equal(internalAliasType.internalTypeGroupId, "SM-GRP-QUADRATIC-COEFFICIENT");
  assert.equal(bank.taxonomyCounts, null);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("생수 검수 연결 대상이 사라지면 조용히 새 유형으로 만들지 않는다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  input.saengsuLegacy.types[0].canonicalMergeStatus = "merge_existing";
  input.saengsuLegacy.types[0].canonicalTarget = { sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "MISSING" };
  assert.throws(() => builder.buildIndex(input), /연결 대상이 공통 인덱스에 없습니다/);
});

test("블랙라벨 문항은 원수학 기출로 가장하지 않고 잠긴 후보로 공통 DB에 연결한다", () => {
  const input = fixture();
  input.blacklabelMiddle = blacklabelFixture();
  const index = builder.buildIndex(input);
  const bank = index.sourceBanks.find(item => item.sourceBankId === "BLACKLABEL-2025-M1");
  const item = index.items.find(candidate => candidate.sourceBankId === "BLACKLABEL-2025-M1");
  const dolpa = index.items.find(candidate => candidate.sourceItemId === "DP-Q1");
  assert.equal(bank.itemCount, 1);
  assert.equal(bank.officialWonmathPastPaper, false);
  assert.equal(bank.academyFitStatus, "candidate");
  assert.equal(item.releaseStatus, "locked");
  assert.equal(item.usageApproved, false);
  assert.equal(item.answerStatus, "verified");
  assert.equal(item.domainGroup, "algebra");
  assert.equal(item.conceptStatus, "mapped");
  assert.equal(item.canonicalConceptFamilyId, dolpa.conceptFamilyId);
  assert.deepEqual(item.academyFits, [{ profileId: "WM_BASIC", status: "candidate" }]);
  assert.equal(JSON.stringify(item).includes("canonicalAnswer"), false);
  assert.deepEqual(audit.audit(index).issues, []);
});

test("블랙라벨은 답 검산이나 잠금이 빠진 문항을 공통 DB에 넣지 않는다", () => {
  const input = fixture();
  input.blacklabelMiddle = blacklabelFixture();
  input.blacklabelMiddle.items[0].answerCheck.status = "pending";
  assert.throws(() => builder.buildIndex(input), /검수 상태/);
});

test("공통 인덱스에는 원문·정답·경로를 넣지 않고 전체 검사를 통과한다", () => {
  const index = builder.buildIndex(fixture());
  assert.deepEqual(audit.audit(index).issues, []);
  assert.equal(JSON.stringify(index).includes("sourcePath"), false);
});

test("저장된 생수 대표 기준이나 대수·기하 분류가 바뀌면 공통 인덱스 검사에서 막는다", () => {
  const input = fixture();
  input.saengsuLegacy = saengsuFixture();
  const wrongDomain = builder.buildIndex(input);
  wrongDomain.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q01").domainGroup = "mixed";
  assert.ok(audit.audit(wrongDomain).issues.some(issue => issue.startsWith("item_domain:")));

  const missingDomain = builder.buildIndex(input);
  delete missingDomain.items.find(item => item.sourceItemId === "SM-LEGACY-R01-Q01").domainGroup;
  assert.ok(audit.audit(missingDomain).issues.some(issue => issue.startsWith("representative_item_domain:")));

  const openedCutline = builder.buildIndex(input);
  openedCutline.sourceBanks.find(bank => bank.sourceBankId === "SAENGSU-CM1-LEGACY").representativePlan.operationalCutline = { score: 20, total: 30 };
  assert.ok(audit.audit(openedCutline).issues.some(issue => issue.startsWith("representative_release:")));
});

test("문항이 존재하지 않는 원본 유형 ID를 가리키면 검사에서 막는다", () => {
  const index = builder.buildIndex(fixture());
  index.items[0].sourceTypeId = "MISSING-TYPE";
  assert.ok(audit.audit(index).issues.some(issue => issue.startsWith("unknown_item_source_type:")));
});
