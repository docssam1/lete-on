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
