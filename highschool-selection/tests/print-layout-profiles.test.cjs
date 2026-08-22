const test = require("node:test");
const assert = require("node:assert/strict");

const data = require("../data/print-layout-profiles.js");

test("SH R01 layout keeps measured private-reference geometry without paths or content", () => {
  const profile = data.profiles["SH-R01"];
  assert.equal(profile.pageSize, "A4");
  assert.equal(profile.columns, 2);
  assert.deepEqual(profile.marginsMm, { top: 19, right: 15, bottom: 18, left: 15 });
  assert.equal(profile.gutterMm, 9.5);
  assert.equal(profile.headerHeightMm, 24);
  assert.equal(profile.bodyTopMm, 50);
  assert.equal(profile.footerBaselineMm, 280);
  assert.equal(profile.columnRule, true);
  assert.equal(profile.numberColor, "#008b23");
  const serialized = JSON.stringify(data);
  ["G:\\", "C:\\", ".pdf", "questionText", "answerKey"].forEach(term => assert.equal(serialized.includes(term), false));
});
