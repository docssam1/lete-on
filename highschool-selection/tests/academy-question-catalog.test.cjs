"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-dolpa-question-db.cjs");
const ledgerCore = require("../scripts/build-dolpa-work-ledger.cjs");
const catalogModule = require("../server/academy-question-catalog.js");

function database() {
  const semester = "중2-1";
  const unit = "일차함수";
  const typeLabel = "두 직선의 교점 구하기";
  return builder.buildDatabase({
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
}

test("학원형 문항 목록은 시험형과 교육과정 분류만 안전하게 반환한다", () => {
  const catalog = catalogModule.createCatalog(database());
  const items = catalog.search({ profileIds: ["DP_STANDARD"], query: "교점", limit: 20 });
  assert.equal(items.length, 1);
  assert.equal(items[0].majorUnit, "함수");
  assert.equal(items[0].minorUnit, "일차함수");
  assert.equal(items[0].profiles[0].label, "돌파형");
  assert.equal(Object.hasOwn(items[0], "sourceId"), false);
  assert.equal(JSON.stringify(items).includes("answer"), false);
});

test("다른 시험형의 검수 전 후보는 기본 문항 목록에 나오지 않는다", () => {
  const catalog = catalogModule.createCatalog(database());
  assert.deepEqual(catalog.search({ profileIds: ["WM_DUAL"] }), []);
  assert.equal(catalog.profiles().some(profile => profile.profileId === "WM_BASIC"), true);
  assert.equal(catalog.profiles().some(profile => profile.profileId === "WM_DUAL"), true);
});
