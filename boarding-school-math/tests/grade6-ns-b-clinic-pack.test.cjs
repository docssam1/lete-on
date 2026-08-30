const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ns-b-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "nsb-w01": "42", "nsb-w02": "364", "nsb-w03": "125", "nsb-w04": "384",
  "nsb-w05": "25.158", "nsb-w06": "24.755", "nsb-w07": "9", "nsb-w08": "11.9",
  "nsb-w09": "12", "nsb-w10": "24", "nsb-w11": "12", "nsb-w12": "12",
  "nsb-r01": "414", "nsb-r02": "26.46", "nsb-r03": "18", "nsb-r04": "36"
};

test("16 number-system items match an independent exact-answer ledger and reverse checks", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) {
    assert.equal(source.formatResult(item), expected[item.id], item.id);
    const result = source.solveItem(item);
    if (item.kind === "whole-division") assert.equal(result.n * BigInt(item.data.divisor), BigInt(item.data.dividend) * result.d, item.id + " reverse multiplication");
    if (item.kind === "gcf") {
      const common = [];
      for (let factor = 1; factor <= Math.min(item.data.left, item.data.right); factor += 1) if (item.data.left % factor === 0 && item.data.right % factor === 0) common.push(factor);
      assert.equal(BigInt(Math.max.apply(Math, common)), result.n, item.id + " exhaustive greatest factor");
    }
    if (item.kind === "lcm") {
      const common = [];
      for (let multiple = Math.max(item.data.left, item.data.right); multiple <= item.data.left * item.data.right; multiple += 1) if (multiple % item.data.left === 0 && multiple % item.data.right === 0) common.push(multiple);
      assert.equal(BigInt(Math.min.apply(Math, common)), result.n, item.id + " exhaustive least multiple");
    }
  });
});

test("decimal answers use exact rational arithmetic without floating-point tolerance", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["nsb-w05"], "25.158"), true);
  assert.equal(source.evaluateResponse(byId["nsb-w05"], "25.157999"), false);
  assert.equal(source.evaluateResponse(byId["nsb-w07"], "9.0"), true);
  assert.equal(source.evaluateResponse(byId["nsb-w08"], "11.9"), true);
  assert.equal(source.evaluateResponse(byId["nsb-r02"], "26.46"), true);
});

test("pack is original, multilingual, Grade 6 aligned, and limits automatic evidence", function () {
  assert.equal(source.pack.clusterId, "6.NS.B");
  assert.equal(source.pack.standardRange, "6.NS.B.2-4");
  assert.equal(source.pack.learnerStage, "US Grade 6 ages 11-12");
  assert.equal(source.pack.rights.assetRights, "original");
  assert.match(source.pack.scopeNotice.en, /teacher separately observes/i);
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(Object.keys(item.prompt).sort(), ["en", "ko", "zh-Hans"]);
    assert.equal(Object.prototype.hasOwnProperty.call(item, "answer"), false);
  });
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })).size, 4);
  assert.equal(registry.forCluster("6.NS.B"), source);
});

test("automatic result checks do not claim algorithm explanation or distributive justification", function () {
  assert.match(source.pack.scopeNotice.en, /does not automatically determine full mastery or promotion/i);
  assert.match(source.pack.errorGuides["division-place-value"].prompt.en, /Observe the standard-algorithm explanation separately/);
  assert.match(source.pack.errorGuides["distribution-justification"].prompt.en, /Automatic checking verifies only d/);
});
