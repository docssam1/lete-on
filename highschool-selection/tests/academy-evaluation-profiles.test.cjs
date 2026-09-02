const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/academy-evaluation-profiles.js");

test("all six academies have distinct paper and evaluation profiles", () => {
  assert.deepEqual(Object.keys(data.profiles), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  assert.equal(new Set(Object.values(data.profiles).map(item => item.paperStyle)).size, 6);
  assert.equal(new Set(Object.values(data.profiles).map(item => item.reportTitle)).size, 6);
  Object.values(data.profiles).forEach(profile => {
    assert.ok(profile.displayName);
    assert.ok(profile.defaultDuration);
    assert.ok(profile.difficultyFlow);
    assert.ok(profile.primaryAxes.length >= 5);
    assert.ok(profile.evaluationCriteria.length >= 3);
    assert.ok(profile.decisionPolicy);
  });
});

test("academy profile resolution keeps exam-specific scope and time separate", () => {
  const sh = data.resolve("sh-selection-r01", "SH");
  assert.equal(sh.profile.displayName, "황소 고등");
  assert.equal(sh.exam.duration, "110분");
  assert.equal(sh.exam.scope, "중등 누적 40문항");
  const dp = data.resolve("dp-middle2-2-transfer", "DP");
  assert.equal(dp.exam.scope, "중1-1~중2-1 전 범위(일차함수까지)");
  assert.equal(dp.exam.duration, "현재 회차 확인 필요");
  const sm = data.resolve("sm-common1-entry", "SM");
  assert.equal(sm.exam.scope, "중2-2·중3-1·중3-2 · 대수 15 + 기하 15");
  assert.equal(sm.exam.duration, "180분");
  assert.equal(data.resolve("unknown", "WM").exam, null);
});

test("evaluation profiles describe criteria but never auto-assign a cutline", () => {
  const serialized = JSON.stringify(data);
  ["minimum", "thresholds", "approvedAt", "exam-approved"].forEach(term => assert.equal(serialized.includes(term), false));
  ["G:\\", "C:\\Users", ".pdf", "answerKey", "sourcePath"].forEach(term => assert.equal(serialized.includes(term), false));
});
