const test = require("node:test");
const assert = require("node:assert/strict");
const { buildQueue } = require("../scripts/build-hwangso-locator-rebuild-queue.cjs");

function row(id, source, page, slot) {
  return {
    sourceItemId: id, sourceMemoryId: source, sourceRef: `ref-${source}`,
    semester: "중1-1", majorUnit: "문자와 식", minorUnit: "일차방정식",
    locator: { page, slot, kind: "concept", box: { x: 0.1, y: 0.2, width: 0.8, height: 0.2 } },
    reason: "여러 문제가 한 영역에 섞임"
  };
}

test("같은 원본의 같은 쪽 조각을 한 번의 재분할 작업으로 묶는다", () => {
  const output = buildQueue({ sourceBankId: "hwangso", locatorRebuilds: [row("q2", "s1", 10, 2), row("q1", "s1", 10, 1), row("q3", "s1", 11, 1)] });
  assert.deepEqual(output.summary, { candidateCount: 3, pageGroupCount: 2, sourceCount: 1 });
  assert.deepEqual(output.groups[0].candidates.map(item => item.sourceItemId), ["q1", "q2"]);
  assert.equal(output.groups[0].status, "decision_pending");
});

test("서로 다른 원본은 같은 쪽 번호여도 합치지 않는다", () => {
  const output = buildQueue({ locatorRebuilds: [row("q1", "s1", 10, 1), row("q2", "s2", 10, 1)] });
  assert.equal(output.groups.length, 2);
  assert.notEqual(output.groups[0].groupId, output.groups[1].groupId);
});

test("중복 ID와 불완전한 위치는 조용히 통과시키지 않는다", () => {
  assert.throws(() => buildQueue({ locatorRebuilds: [row("q1", "s1", 10, 1), row("q1", "s1", 10, 2)] }), /중복 문항 ID/);
  const bad = row("q1", "s1", 10, 1); delete bad.locator.page;
  assert.throws(() => buildQueue({ locatorRebuilds: [bad] }), /올바르지 않습니다/);
});
