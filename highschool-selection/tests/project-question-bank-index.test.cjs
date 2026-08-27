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

test("공통 인덱스에는 원문·정답·경로를 넣지 않고 전체 검사를 통과한다", () => {
  const index = builder.buildIndex(fixture());
  assert.deepEqual(audit.audit(index).issues, []);
  assert.equal(JSON.stringify(index).includes("sourcePath"), false);
});
