const test = require("node:test");
const assert = require("node:assert/strict");

delete global.HIGHSELECT_PUBLIC_PROFILES;
require("../data/public-exam-profiles.js");
const data = global.HIGHSELECT_PUBLIC_PROFILES;

test("advertising profiles cover all six isolated program codes", () => {
  assert.deepEqual(data.profiles.map(profile => profile.code), ["SH", "DP", "WM", "ED", "DG", "SM"]);
  assert.equal(new Set(data.profiles.map(profile => profile.publicName)).size, 6);
});

test("every advertising fact exposes its evidence state and source ids", () => {
  const states = new Set(["verified", "observed", "confirmed", "needs-review"]);
  data.profiles.forEach(profile => {
    assert.ok(profile.summary);
    assert.ok(profile.style);
    assert.ok(profile.caveat);
    assert.ok(profile.cutline);
    assert.ok(states.has(profile.cutline.state));
    assert.ok(profile.cutline.display);
    assert.ok(profile.cutline.context);
    assert.ok(Array.isArray(profile.cutline.sourceIds));
    profile.cutline.sourceIds.forEach(id => assert.ok(data.sources[id], `missing cutoff source ${id}`));
    if (profile.cutline.state === "verified") {
      assert.ok(profile.cutline.branch, `${profile.code} verified cutoff needs a branch`);
      assert.ok(profile.cutline.course, `${profile.code} verified cutoff needs a course`);
      assert.ok(profile.cutline.round, `${profile.code} verified cutoff needs a round`);
      assert.ok(profile.cutline.sourceIds.length, `${profile.code} verified cutoff needs a public source`);
    }
    assert.ok(profile.facts.length >= 3);
    profile.facts.forEach(fact => {
      assert.ok(fact.label);
      assert.ok(fact.value);
      assert.ok(states.has(fact.state));
      assert.ok(Array.isArray(fact.sourceIds));
      fact.sourceIds.forEach(id => assert.ok(data.sources[id], `missing source ${id}`));
      if (fact.state === "verified") assert.ok(fact.sourceIds.length, `${profile.code} verified fact needs a public source`);
      if (fact.state === "confirmed") assert.equal(fact.sourceIds.length, 0, `${profile.code} product confirmation must not cite an external source`);
    });
  });
});

test("cutoffs are scoped records and never a global academy number", () => {
  assert.equal(Object.prototype.hasOwnProperty.call(data, "cutline"), false);
  data.profiles.forEach(profile => {
    if (profile.cutline.state === "verified") {
      assert.equal(typeof profile.cutline.branch, "string");
      assert.equal(typeof profile.cutline.course, "string");
      assert.equal(typeof profile.cutline.round, "string");
    } else {
      assert.equal(profile.cutline.display, "확인 필요");
    }
  });
});

test("WM advertising uses the current middle2-1 cutoff and preserves round changes", () => {
  const wm = data.profiles.find(profile => profile.code === "WM");
  const middleFact = wm.facts.find(fact => fact.label === "중2-1 기본반 현행 구조");
  assert.equal(middleFact.value, "중1 대수 20 + 중1 기하 20 · 각 50분 · 통계 제외");
  assert.deepEqual(middleFact.sourceIds, ["WM-M21-JULY-2026"]);
  assert.equal(wm.cutline.course, "중2-1 기본반 신입");
  assert.equal(wm.cutline.display.startsWith("28 / 40문항"), true);
  assert.deepEqual(wm.roundProfiles.map(round => [round.id, round.questionCount, round.minimum]), [
    ["WM-M21-BASIC-ENTRY-2026-07", 40, 28],
    ["WM-M22-BASIC-TRANSFER-2026-05", 45, 32],
    ["WM-M22-BASIC-TRANSFER-2026-09", 50, 35],
    ["WM-M31-BASIC-TRANSFER-2026-07", 50, 35],
    ["WM-M32-BASIC-TRANSFER-2026-06", 50, 35]
  ]);
  assert.equal(wm.roundProfiles.at(-1).state, "superseded");
  assert.equal(wm.caveat.includes("중등 심화듀얼과 고등 실력공수 듀얼을 섞지 않고"), true);
});

test("public sources are dated HTTPS pages and do not expose private assets", () => {
  Object.values(data.sources).forEach(source => {
    assert.match(source.url, /^https:\/\//);
    assert.match(source.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(["A", "B", "C"].includes(source.grade));
  });
  const serialized = JSON.stringify(data);
  ["G:\\\\", "C:\\\\Users", "sourceAssetId", "sourcePath", ".pdf", "approvalCode"].forEach(term => {
    assert.equal(serialized.includes(term), false, `must not leak ${term}`);
  });
});
