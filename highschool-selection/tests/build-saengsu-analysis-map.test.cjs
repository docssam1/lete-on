"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { buildAnalysisMap, OUTPUT_SCHEMA } = require("../scripts/build-saengsu-analysis-map.cjs");

function candidateDb() {
  const questions = Array.from({ length: 60 }, (_, index) => ({
    questionId: `SM-LEGACY-R${index < 30 ? "01" : "02"}-Q${String((index % 30) + 1).padStart(2, "0")}`,
    withinCurrentRange: index < 58,
    releaseStatus: "locked",
    usageApproved: false,
    difficultyAction: index % 2 ? "raise" : "retain",
    structureUse: index % 2 ? "adapt" : "retain",
    curriculum: { semesters: [index % 3 === 0 ? "중2-2" : index % 3 === 1 ? "중3-1" : "중3-2"], primaryDomain: index % 2 ? "대수" : "기하", majorUnit: index % 2 ? "이차함수" : "도형의 닮음" },
    answerVerification: { status: index === 58 ? "disputed" : index === 59 ? "blocked" : "verified" }
  }));
  const types = questions.map((_, index) => ({ candidateTypeId: `SMTYPE-${index}`, canonicalMergeStatus: index < 2 ? "merge_existing" : index < 25 ? "alias_existing" : index < 36 ? "alias_internal_group" : index < 46 ? "keep_separate" : index < 58 ? "new_type" : "excluded" }));
  return {
    schemaVersion: "highselect-private-saengsu-candidate-db/v1",
    representativePolicy: {
      range: ["중2-2", "중3-1", "중3-2"], questionCount: 30, domainBalance: { algebra: 15, geometry: 15 }, timeMinutes: 180,
      referenceCutline: { score: 20, total: 30, status: "public_reference_only" }, cutlineStatus: "locked_non_operational", difficultyDirection: "higher_than_2022_legacy_samples", publicLabel: "생수형 공통수학1 입반 대비 추정 구성", forbiddenLabel: "생수 공식 기출"
    },
    questions,
    types
  };
}

test("생수 분석 지도는 범위·유형·잠금 상태만 집계하고 시험지를 만들지 않는다", () => {
  const output = buildAnalysisMap(candidateDb());
  assert.equal(output.schemaVersion, OUTPUT_SCHEMA);
  assert.equal(output.analysisOnly, true);
  assert.equal(output.observedReferenceMap.currentRangeQuestionCount, 58);
  assert.equal(output.observedReferenceMap.excludedQuestionCount, 2);
  assert.deepEqual(output.verification.answerStatus, { verified: 58, disputed: 1, blocked: 1 });
  assert.equal(output.observedReferenceMap.taxonomyStatus.alias_existing, 23);
  assert.equal(output.verification.usageApprovedQuestionCount, 0);
  assert.equal(output.representativeReadiness.canCompose, false);
  assert.equal(output.representativePolicy.operationalCutline, null);
  assert.equal(JSON.stringify(output).includes("SM-LEGACY-R01-Q01"), false);
});

test("잠금 또는 60문항 구조가 깨진 입력은 분석 지도를 만들지 않는다", () => {
  const unlocked = candidateDb();
  unlocked.questions[0].usageApproved = true;
  assert.throws(() => buildAnalysisMap(unlocked), /release-locked/);
  const incomplete = candidateDb();
  incomplete.types.pop();
  assert.throws(() => buildAnalysisMap(incomplete), /60 candidate/);
});
