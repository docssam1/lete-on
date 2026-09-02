"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { selectItems } = require("../scripts/select-project-question-bank.cjs");

test("문항별로 직접 검수한 풀이 방법은 유형 전체가 부분 검수여도 해당 문항에 표시한다", () => {
  const index = {
    academyProfiles: [{ profileId: "DP_STANDARD", programId: "DP", label: "돌파형" }],
    sourceBanks: [{ sourceBankId: "DOLPA-ORIGINAL", label: "돌파 원본 시험" }],
    sourceTypes: [{ sourceBankId: "DOLPA-ORIGINAL", sourceTypeId: "T1", semester: "중2-2", majorUnit: "기하", minorUnit: "닮음", detailType: "평행선과 닮음", solutionArchetype: "" }],
    conceptFamilies: [{ conceptFamilyId: "C1", canonicalLabel: "평행선과 닮음", solutionArchetype: "", curriculum: { semester: "중2-2", majorUnit: "기하", minorUnit: "닮음" } }],
    items: [{
      itemId: "I1", sourceBankId: "DOLPA-ORIGINAL", sourceItemId: "Q1", sourceTypeId: "T1", conceptFamilyId: "C1",
      solutionArchetype: "평행선에서 생기는 닮음비를 이어 목표 길이를 구한다.",
      classificationStatus: "verified", detailPrecision: "verified", conceptStatus: "mapped",
      answerStatus: "verified",
      learnerFit: { overall: "pass", dimensions: { language: "pass", representations: "pass", prerequisites: "pass", reasoningLoad: "pass", responseMode: "pass" } },
      academyFits: [{ profileId: "DP_STANDARD", status: "source_verified" }]
    }]
  };
  const output = selectItems(index, ["DP_STANDARD"]);
  assert.equal(output.items[0].solutionArchetype, "평행선에서 생기는 닮음비를 이어 목표 길이를 구한다.");
});
