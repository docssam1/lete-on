const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ee-b-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "eeb-w01": "1", "eeb-w02": "1", "eeb-w03": "0", "eeb-w04": "8",
  "eeb-w05": "5/4", "eeb-w06": "23", "eeb-w07": "9", "eeb-w08": "12",
  "eeb-w09": "6", "eeb-w10": "48", "eeb-w11": "2", "eeb-w12": "1",
  "eeb-r01": "1", "eeb-r02": "13/5", "eeb-r03": "12", "eeb-r04": "2"
};

function number(value) { return Number(value.numerator) / Number(value.denominator); }
function parsed(text) { const parts = String(text).split("/").map(Number); return parts.length === 1 ? parts[0] : parts[0] / parts[1]; }
function equationHolds(item, candidate) {
  if (item.kind === "add-equation") return Math.abs(candidate + number(item.data.p) - number(item.data.total)) < 1e-12;
  if (item.kind === "multiply-equation") return Math.abs(number(item.data.coefficient) * candidate - number(item.data.total)) < 1e-12;
  return false;
}

test("16 equation and inequality items match the independent fixed answer ledger", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) { assert.equal(source.formatResult(item), expected[item.id], item.id); });
});

test("every one-step equation has one exact nonnegative solution and passes reverse substitution", function () {
  const equations = source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.kind === "add-equation" || item.kind === "multiply-equation"; });
  equations.forEach(function (item) {
    const expectedValue = parsed(expected[item.id]);
    assert.equal(equationHolds(item, expectedValue), true, item.id + " reverse check");
    const enumerated = Array.from({ length: 1201 }, function (_, index) { return index / 20; }).filter(function (candidate) { return equationHolds(item, candidate); });
    assert.deepEqual(enumerated, [expectedValue], item.id + " exhaustive twentieth-grid uniqueness");
  });
});

test("substitution truth and strict inequality counts are independently recomputed", function () {
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  items.filter(function (item) { return item.kind === "substitution-truth"; }).forEach(function (item) {
    const x = number(item.data.candidate); const p = number(item.data.p); const total = number(item.data.total);
    const truth = item.data.form === "add" ? x + p === total : p * x === total;
    assert.equal(source.formatResult(item), truth ? "1" : "0", item.id);
  });
  items.filter(function (item) { return item.kind === "inequality-set-count"; }).forEach(function (item) {
    const boundary = number(item.data.boundary);
    const count = item.data.candidates.map(number).filter(function (candidate) { return item.data.relation === ">" ? candidate > boundary : candidate < boundary; }).length;
    assert.equal(source.formatResult(item), String(count), item.id);
  });
});

test("exact response grammar rejects near misses and unreduced fraction forms", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["eeb-w05"], "5/4"), true);
  assert.equal(source.evaluateResponse(byId["eeb-w05"], "10/8"), false);
  assert.equal(source.evaluateResponse(byId["eeb-w05"], "1.25"), false);
  assert.equal(source.evaluateResponse(byId["eeb-w07"], "9.0001"), false);
  assert.equal(source.evaluateResponse(byId["eeb-w03"], "0"), true);
  assert.equal(source.evaluateResponse(byId["eeb-w03"], "false"), false);
});

test("student prompts do not reveal truth answers or repeat the fully worked equation", function () {
  const first = source.pack.workbookItems.find(function (item) { return item.id === "eeb-w01"; });
  assert.doesNotMatch(first.prompt.ko, /대입하면 참입니다/);
  assert.doesNotMatch(first.prompt.en, /makes a true equation/i);
  source.pack.workbookItems.forEach(function (item) {
    if (item.kind !== "multiply-equation") return;
    assert.equal(Number(item.data.coefficient.numerator) === 6 && Number(item.data.coefficient.denominator) === 1 && Number(item.data.total.numerator) === 42 && Number(item.data.total.denominator) === 1, false, item.id + " duplicates worked example");
  });
});

test("four public practice strands stay separate from private diagnostic mastery", function () {
  assert.equal(source.pack.clusterId, "6.EE.B");
  assert.equal(source.pack.standardRange, "6.EE.B.5-8");
  assert.equal(source.pack.learnerStage, "US Grade 6 ages 11-12");
  assert.equal(source.pack.rights.assetRights, "original");
  assert.deepEqual(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })), new Set(Object.keys(source.pack.strands)));
  assert.match(source.pack.scopeNotice.en, /teacher separately observes/i);
  assert.match(source.pack.scopeNotice.en, /do not expand the private diagnostic evidence contract/i);
  assert.match(source.pack.scopeNotice.en, /do not automatically determine full mastery or promotion/i);
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(Object.keys(item.prompt).sort(), ["en", "ko", "zh-Hans"]);
    assert.equal(Object.prototype.hasOwnProperty.call(item, "answer"), false);
  });
  assert.equal(registry.forCluster("6.EE.B"), source);
});

test("Grade 7 equation and inequality forms are absent from the Grade 6 pack", function () {
  const publicText = JSON.stringify(source.pack);
  ["<=", ">=", "≤", "≥"].forEach(function (token) { assert.equal(publicText.includes(token), false); });
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    if (item.kind === "add-equation") assert.equal(Object.keys(item.data).sort().join(","), "p,total");
    if (item.kind === "multiply-equation") assert.equal(Object.keys(item.data).sort().join(","), "coefficient,total");
  });
});
