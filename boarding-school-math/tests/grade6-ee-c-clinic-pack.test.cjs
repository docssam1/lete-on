const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ee-c-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "eec-w01":"c", "eec-w02":"h", "eec-w03":"b", "eec-w04":"23",
  "eec-w05":"12", "eec-w06":"13", "eec-w07":"11", "eec-w08":"14",
  "eec-w09":"5", "eec-w10":"4", "eec-w11":"15", "eec-w12":"2",
  "eec-r01":"s", "eec-r02":"17", "eec-r03":"7", "eec-r04":"5"
};

function number(value) { return Number(value.numerator) / Number(value.denominator); }
function linear(data, input) { return number(data.rate) * input + number(data.start); }

test("16 variable-relationship items match the independent answer ledger", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) { assert.equal(source.formatResult(item), expected[item.id], item.id); });
});

test("variable roles are explicit and never inferred from letter order", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).filter(function (item) { return item.kind === "variable-role"; }).forEach(function (item) {
    const independentlyExpected = item.data.askRole === "dependent" ? item.data.dependent : item.data.independent;
    assert.equal(source.formatResult(item), independentlyExpected, item.id);
    assert.notEqual(item.data.independent.toLowerCase(), item.data.dependent.toLowerCase(), item.id);
  });
});

test("rules and table blanks reverse-check to one exact value", function () {
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  items.filter(function (item) { return item.kind === "evaluate-rule" || item.kind === "table-output"; }).forEach(function (item) {
    const input = number(item.kind === "evaluate-rule" ? item.data.input : item.data.targetInput);
    assert.equal(Number(source.formatResult(item)), linear(item.data, input), item.id);
  });
  items.filter(function (item) { return item.kind === "table-input"; }).forEach(function (item) {
    const answer = Number(source.formatResult(item));
    assert.equal(linear(item.data, answer), number(item.data.targetOutput), item.id + " reverse substitution");
    const enumerated = Array.from({ length:401 }, function (_, index) { return index / 20; }).filter(function (candidate) { return linear(item.data, candidate) === number(item.data.targetOutput); });
    assert.deepEqual(enumerated, [answer], item.id + " twentieth-grid uniqueness");
  });
});

test("rates, output changes, and starting values are independently recomputed", function () {
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  items.filter(function (item) { return item.kind === "rate-from-points"; }).forEach(function (item) {
    const x1 = number(item.data.first[0]); const y1 = number(item.data.first[1]);
    const x2 = number(item.data.second[0]); const y2 = number(item.data.second[1]);
    assert.equal(Number(source.formatResult(item)), (y2 - y1) / (x2 - x1), item.id);
  });
  const change = items.find(function (item) { return item.kind === "output-change"; });
  assert.equal(Number(source.formatResult(change)), number(change.data.rate) * number(change.data.deltaInput));
  const start = items.find(function (item) { return item.kind === "start-from-point"; });
  assert.equal(Number(source.formatResult(start)), number(start.data.output) - number(start.data.rate) * number(start.data.input));
});

test("response grammar accepts exact symbols and values but rejects near misses", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["eec-w01"], " c "), true);
  assert.equal(source.evaluateResponse(byId["eec-w01"], "m"), false);
  assert.equal(source.evaluateResponse(byId["eec-w05"], "12"), true);
  assert.equal(source.evaluateResponse(byId["eec-w05"], "11.999"), false);
  assert.equal(source.evaluateResponse(byId["eec-w06"], "13.0"), true);
});

test("public metadata, visible blanks, and teacher separation remain explicit", function () {
  assert.equal(source.pack.clusterId, "6.EE.C");
  assert.equal(source.pack.standardRange, "6.EE.C.9");
  assert.equal(source.pack.rights.assetRights, "original");
  assert.deepEqual(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })), new Set(Object.keys(source.pack.strands)));
  assert.match(source.pack.scopeNotice.en, /teacher separately observes/i);
  assert.match(source.pack.scopeNotice.en, /do not expand private diagnostic evidence/i);
  assert.match(source.renderVisual(source.pack.workbookItems[6]), /<td>\?<\/td>/);
  assert.doesNotMatch(source.renderVisual(source.pack.workbookItems[6]), />11<\/td>/);
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(Object.keys(item.prompt).sort(), ["en","ko","zh-Hans"]);
    assert.equal(Object.prototype.hasOwnProperty.call(item, "answer"), false);
  });
  assert.equal(registry.forCluster("6.EE.C"), source);
});
