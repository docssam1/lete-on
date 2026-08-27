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
    wonmathManifests: [{ items: [{ examNumber: 1, majorUnit: "함수", minorUnit: "일차함수", typeId: "M2-FUNC-LINE" }] }],
    hwangsoMiddle: { items: [] }
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

test("공통 인덱스에는 원문·정답·경로를 넣지 않고 전체 검사를 통과한다", () => {
  const index = builder.buildIndex(fixture());
  assert.deepEqual(audit.audit(index).issues, []);
  assert.equal(JSON.stringify(index).includes("sourcePath"), false);
});

test("문항이 존재하지 않는 원본 유형 ID를 가리키면 검사에서 막는다", () => {
  const index = builder.buildIndex(fixture());
  index.items[0].sourceTypeId = "MISSING-TYPE";
  assert.ok(audit.audit(index).issues.some(issue => issue.startsWith("unknown_item_source_type:")));
});
