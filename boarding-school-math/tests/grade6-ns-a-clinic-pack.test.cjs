const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ns-a-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "ns-w01": "6", "ns-w02": "4", "ns-w03": "10", "ns-w04": "6",
  "ns-w05": "5/4", "ns-w06": "15/16", "ns-w07": "15/4", "ns-w08": "10/3",
  "ns-w09": "4", "ns-w10": "5", "ns-w11": "9/2", "ns-w12": "6",
  "ns-r01": "14", "ns-r02": "2/3", "ns-r03": "4", "ns-r04": "15/8"
};

test("16 fraction-division items match an independently fixed exact-answer ledger", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) {
    assert.equal(source.formatResult(item), expected[item.id], item.id);
    const quotient = source.solveItem(item);
    const divisor = item.data.divisor;
    const dividend = item.data.dividend;
    assert.equal(quotient.numerator * BigInt(divisor.numerator) * BigInt(dividend.denominator), BigInt(dividend.numerator) * quotient.denominator * BigInt(divisor.denominator), item.id + " reverse check");
  });
});

test("equivalent numeric forms work except where simplest fraction is explicitly required", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["ns-w07"], "3 3/4"), true);
  assert.equal(source.evaluateResponse(byId["ns-w11"], "4.5"), true);
  assert.equal(source.evaluateResponse(byId["ns-w05"], "10/8"), false);
  assert.equal(source.evaluateResponse(byId["ns-w05"], "1.25"), false);
  assert.equal(source.evaluateResponse(byId["ns-w05"], "5/4"), true);
  assert.equal(source.evaluateResponse(byId["ns-r02"], "4/6"), false);
  assert.equal(source.evaluateResponse(byId["ns-r02"], "2/3"), true);
  assert.equal(source.evaluateResponse(byId["ns-w01"], "5"), false);
  assert.equal(source.evaluateResponse(byId["ns-w01"], ""), false);
});

test("pack is original, multilingual, Grade 6 aligned, and has four independent recheck strands", function () {
  assert.equal(source.pack.clusterId, "6.NS.A");
  assert.equal(source.pack.standardRange, "6.NS.A.1");
  assert.equal(source.pack.learnerStage, "US Grade 6 ages 11-12");
  assert.equal(source.pack.rights.assetRights, "original");
  assert.equal(source.pack.rights.containsThirdPartyAssets, false);
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(Object.keys(item.prompt).sort(), ["en", "ko", "zh-Hans"]);
    assert.equal(Object.prototype.hasOwnProperty.call(item, "answer"), false);
  });
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })).size, 4);
  assert.equal(registry.forCluster("6.NS.A"), source);
  assert.throws(function () { registry.forCluster("6.G.A"); }, /UNSUPPORTED/);
});

test("mixed-number solutions explicitly show conversion before fraction division", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.match(source.solutionFor(byId["ns-w07"], "ko"), /2와 1\/4 = 9\/4/);
  assert.match(source.solutionFor(byId["ns-w11"], "en"), /Convert 1 4\/5 to 9\/5/);
  assert.match(source.solutionFor(byId["ns-r03"], "zh-Hans"), /2又1\/2.*5\/2/);
});
