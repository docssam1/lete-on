"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { stableTypeId } = require("../scripts/build-dolpa-work-ledger.cjs");
const core = require("../scripts/prepare-dolpa-import-crosswalks.cjs");

function review() {
  const items = [];
  for (const sourceId of ["DP-SRC-AAAAAAAAAAAA", "DP-SRC-BBBBBBBBBBBB"]) {
    for (let number = 1; number <= 30; number += 1) {
      const shared = number === (sourceId.endsWith("AAAA") ? 9 : 23);
      items.push({
        sourceId,
        questionNumber: number,
        decision: "new_type_required",
        proposedNewTypeGroup: shared ? "NEW-SHARED" : `NEW-${sourceId.slice(-4)}-${number}`,
        proposedNewType: {
          semester: "초5-1",
          minorUnit: shared ? "약수와 배수" : `단원 ${number}`,
          label: shared ? "공통 휴일 수 세기" : `유형 ${number}`,
          solutionArchetype: shared ? "공통 주기로 날짜를 센다." : `풀이 ${number}`,
          methodTags: ["검수"]
        },
        rationale: "교차검수 완료"
      });
    }
  }
  return { schemaVersion: "dolpa-type-crosswalk-review/v1", items };
}

test("첫 원본의 공동 신규 유형을 다음 원본에서는 같은 typeId로 재사용한다", () => {
  const first = core.prepare(review(), "DP-SRC-AAAAAAAAAAAA");
  const second = core.prepare(review(), "DP-SRC-BBBBBBBBBBBB", first.sharedGroups);
  const firstItem = first.crosswalk.items[8];
  const secondItem = second.crosswalk.items[22];
  assert.equal(firstItem.decision, "new");
  assert.equal(secondItem.decision, "reuse");
  assert.equal(secondItem.typeId, stableTypeId("초5-1", "약수와 배수", "공통 휴일 수 세기"));
});
