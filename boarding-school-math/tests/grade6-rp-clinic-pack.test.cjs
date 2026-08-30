const test = require("node:test");
const assert = require("node:assert/strict");
const clinic = require("../learning/grade6-rp-clinic-pack.js");

const expected = Object.freeze({
  "rp-w01": "20", "rp-w02": "3:4", "rp-w03": "14", "rp-w04": "35",
  "rp-w05": "35", "rp-w06": "0.75", "rp-w07": "1920", "rp-w08": "5.25",
  "rp-w09": "17", "rp-w10": "75", "rp-w11": "210", "rp-w12": "35",
  "rp-r01": "48", "rp-r02": "4.5", "rp-r03": "24", "rp-r04": "84"
});

test("the public 6.RP.A clinic has a complete learner-fit and rights contract", function () {
  const pack = clinic.pack;
  assert.equal(clinic.validatePack(), true);
  assert.equal(pack.learnerStage, "US Grade 6 ages 11-12");
  assert.deepEqual(pack.rights, { publication: "public", assetRights: "original", containsThirdPartyAssets: false });
  assert.equal(pack.workbookItems.length, 12);
  assert.equal(pack.recheckItems.length, 4);
  assert.match(pack.scopeNotice.en, /does not automatically determine/i);
  pack.workbookItems.concat(pack.recheckItems).forEach(function (item) {
    assert.ok(item.prompt.ko && item.prompt.en && item.prompt["zh-Hans"]);
    assert.ok(clinic.hintFor(item, "ko"));
    assert.ok(clinic.solutionFor(item, "en"));
  });
});

test("all 16 answers match an independent fixed answer ledger", function () {
  clinic.pack.workbookItems.concat(clinic.pack.recheckItems).forEach(function (item) {
    assert.equal(clinic.formatResult(item), expected[item.id], item.id);
    assert.equal(clinic.evaluateResponse(item, expected[item.id]), true, item.id);
  });
});

test("equivalent number formats are accepted while adjacent wrong answers fail", function () {
  const byId = Object.fromEntries(clinic.pack.workbookItems.concat(clinic.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(clinic.evaluateResponse(byId["rp-w06"], "3/4"), true);
  assert.equal(clinic.evaluateResponse(byId["rp-w08"], "21/4"), true);
  assert.equal(clinic.evaluateResponse(byId["rp-w02"], "6:8"), true);
  assert.equal(clinic.evaluateResponse(byId["rp-r02"], "4.50"), true);
  assert.equal(clinic.evaluateResponse(byId["rp-w06"], "999999999999999999999999999999999999999.0"), false);
  assert.equal(clinic.evaluateResponse(byId["rp-w02"], "999999999999999999999999:1"), false);
  assert.equal(clinic.evaluateResponse(byId["rp-w06"], "1/0"), false);
  Object.entries(expected).forEach(function ([id, answer]) {
    const item = byId[id];
    const wrong = item.responseFormat === "ratio-pair" ? "3:5" : String(Number(answer) + 1);
    assert.equal(clinic.evaluateResponse(item, wrong), false, id + " negative control");
    assert.equal(clinic.evaluateResponse(item, ""), false, id + " blank control");
  });
});

test("recheck covers four distinct diagnostic strands", function () {
  assert.deepEqual(new Set(clinic.pack.recheckItems.map(function (item) { return item.strand; })), new Set(["equivalent-ratio", "unit-rate", "part-whole", "percent-conversion"]));
});
