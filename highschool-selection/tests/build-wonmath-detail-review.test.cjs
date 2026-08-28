"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const builder = require("../scripts/build-wonmath-detail-review.cjs");

function inputs() {
  return {
    methodCatalog: {
      schemaVersion: 1,
      taxonomyVersion: "wm-test-v1",
      methods: {
        "parallel-line-angle-chase": {
          status: "reviewed",
          detailType: "평행선의 각 관계를 이어서 구하기",
          solutionArchetype: "동위각·엇각과 일직선의 각을 차례로 적용",
          evidence: ["review:method-1"]
        }
      }
    },
    rounds: [{
      round: 1,
      manifest: { items: [{ examNumber: 1, majorUnit: "기본 도형", minorUnit: "점·선·면과 각", typeId: "M1-GEO-BASIC" }] },
      audit: { records: [{
        examNumber: 1, sectionId: "GEO", majorUnit: "기본 도형", minorUnit: "점·선·면과 각", typeId: "M1-GEO-BASIC",
        difficultyBand: "standard", answer: { verificationMethod: "parallel-line-angle-chase" }
      }] }
    }]
  };
}

test("원수학 감사 기록의 풀이법을 학생용 세부유형과 안정된 유형 ID로 바꾼다", () => {
  const output = builder.buildReview(inputs());
  assert.equal(output.summary.itemCount, 1);
  assert.equal(output.summary.reviewedItemCount, 1);
  assert.equal(output.reviews[0].sourceItemId, "R01-Q01");
  assert.equal(output.reviews[0].sourceUnitTypeId, "M1-GEO-BASIC");
  assert.match(output.reviews[0].sourceTypeId, /^WM-TYP-/);
  assert.equal(output.reviews[0].semester, "중1-2");
  assert.equal(output.reviews[0].detailType, "평행선의 각 관계를 이어서 구하기");
  assert.equal(JSON.stringify(output).includes("canonical"), false);
});

test("감사 기록과 구성표가 다르거나 풀이법 분류가 빠지면 중단한다", () => {
  const mismatch = inputs();
  mismatch.rounds[0].manifest.items[0].minorUnit = "작도와 합동";
  assert.throws(() => builder.buildReview(mismatch), /감사 기록과 구성표/);

  const missing = inputs();
  missing.rounds[0].audit.records[0].answer.verificationMethod = "unknown-method";
  assert.throws(() => builder.buildReview(missing), /풀이법 분류가 없습니다/);
});

test("미확정 풀이법은 단원 수준을 유지하고 자동 세부유형으로 승격하지 않는다", () => {
  const pending = inputs();
  pending.methodCatalog.methods["parallel-line-angle-chase"] = {
    status: "pending", evidence: ["review:pending"]
  };
  const output = builder.buildReview(pending);
  assert.equal(output.status, "review_in_progress");
  assert.equal(output.reviews[0].detailPrecision, "unit_only");
  assert.equal(output.reviews[0].sourceTypeId, "M1-GEO-BASIC");
});
