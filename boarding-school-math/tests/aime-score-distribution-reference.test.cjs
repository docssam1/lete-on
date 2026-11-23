const test = require("node:test");
const assert = require("node:assert/strict");
const reference = require("../competition/aime-score-distribution-reference.js");

test("publishes same-exam MAA reference bands for verified 2023–2026 AIME forms", () => {
  assert.equal(Object.keys(reference.entries).length, 8);
  assert.equal(reference.referenceFor(2025, "I").top10, 10);
  assert.equal(reference.referenceFor(2026, "II").top1, 15);
  assert.equal(reference.referenceFor(2026, "III"), null);
  assert.equal(reference.referenceFor(2022, "I"), null);
  assert.match(reference.sourceUrl, /maa\.edvistas\.com/);
  for (const item of Object.values(reference.entries)) {
    assert.equal(item.top1 >= item.top2_5, true);
    assert.equal(item.top2_5 >= item.top5, true);
    assert.equal(item.top5 >= item.top10, true);
    assert.equal(item.students > 0, true);
    assert.equal(item.schools > 0, true);
  }
});
