const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ee-a-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "eea-w01": "32", "eea-w02": "81", "eea-w03": "41", "eea-w04": "3",
  "eea-w05": "8", "eea-w06": "19", "eea-w07": "21", "eea-w08": "8",
  "eea-w09": "3", "eea-w10": "20", "eea-w11": "1", "eea-w12": "7",
  "eea-r01": "109", "eea-r02": "22", "eea-r03": "6", "eea-r04": "0"
};

const promptNumbers = {
  "eea-w01": [2, 5], "eea-w02": [3, 4], "eea-w03": [2, 5, 3, 2], "eea-w04": [5, 2, 7],
  "eea-w05": [8, 3], "eea-w06": [3, 2, 2, 1], "eea-w07": [7, 3, 7], "eea-w08": [4, 2, 5, 20],
  "eea-w09": [18, 12, 6, 2], "eea-w10": [5, 3, 4, 15], "eea-w11": [4, 12, 4, 3, 1, 0], "eea-w12": [4, 7, 28],
  "eea-r01": [5, 3, 2, 4], "eea-r02": [2, 2, 8, 3], "eea-r03": [2, 3, 4, 8], "eea-r04": [3, 2, 5, 6, 12, 1, 0]
};

function numericSignature(text) {
  const normalized = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, function (digit) { return " " + "⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(digit) + " "; });
  return (normalized.match(/\d+/g) || []).map(Number).sort(function (a, b) { return a - b; });
}

function exactCoefficientPairs(item, answer) {
  const d = item.data;
  if (d.rule === "constant-after-expansion") return [[d.outerFactor * d.insideVariableCoefficient, d.outerFactor * d.insideConstant], [d.targetVariableCoefficient, answer]];
  if (d.rule === "variable-after-expansion") return [[d.outerFactor * d.insideVariableCoefficient, d.outerFactor * d.insideConstant], [answer, d.targetConstant]];
  if (d.rule === "variable-inside-factor") return [[d.expandedVariableCoefficient, d.expandedConstant], [d.outerFactor * answer, d.outerFactor * d.insideConstant]];
  if (d.rule === "binary-coefficient-pair") return [[d.leftVariableCoefficient, d.leftConstant], [d.rightVariableCoefficient, d.rightConstant]];
  if (d.rule === "outer-factor-for-pair") return [[answer * d.insideVariableCoefficient, answer * d.insideConstant], [d.targetVariableCoefficient, d.targetConstant]];
  throw new Error("UNEXPECTED_EQUIVALENCE_RULE");
}

function substituteIndependently(item) {
  return item.data.terms.reduce(function (sum, term) {
    if (Object.prototype.hasOwnProperty.call(term, "constant")) return sum + term.constant;
    const variables = term.variables || [{ name: term.variable, exponent: term.exponent || 1 }];
    return sum + variables.reduce(function (product, variable) {
      return product * (item.data.values[variable.name] ** variable.exponent);
    }, term.coefficient);
  }, 0);
}

test("16 expression items match an independent fixed answer ledger", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) {
    assert.equal(source.formatResult(item), expected[item.id], item.id);
    if (item.kind === "whole-power") assert.equal(Number(source.solveItem(item)), item.data.base ** item.data.exponent, item.id + " repeated power");
    if (item.kind === "power-combination") {
      const left = item.data.left.base ** item.data.left.exponent; const right = item.data.right.base ** item.data.right.exponent;
      assert.equal(Number(source.solveItem(item)), item.data.operator === "+" ? left + right : left - right, item.id + " independent power combination");
    }
    if (item.kind === "substitution") assert.equal(Number(source.solveItem(item)), substituteIndependently(item), item.id + " independent substitution");
    if (item.kind === "equivalent-blank") {
      const answer = Number(source.solveItem(item));
      const pairs = exactCoefficientPairs(item, answer);
      assert.equal(pairs[0][0] === pairs[1][0] && pairs[0][1] === pairs[1][1], answer === 1 || item.data.rule !== "binary-coefficient-pair", item.id + " exact coefficient-pair proof");
    }
  });
  const binaryAnswers = items.filter(function (item) { return item.data.rule === "binary-coefficient-pair"; }).map(function (item) { return source.formatResult(item); }).sort();
  assert.deepEqual(binaryAnswers, ["0", "1"]);
});

test("malformed coefficient pairs fail instead of passing sampled-value checks", function () {
  const w07 = source.pack.workbookItems.find(function (item) { return item.id === "eea-w07"; });
  const w12 = source.pack.workbookItems.find(function (item) { return item.id === "eea-w12"; });
  assert.throws(function () { source.solveItem(Object.assign({}, w07, { data: Object.assign({}, w07.data, { targetVariableCoefficient: 8 }) })); }, /EEA_VARIABLE_PAIR_MISMATCH/);
  assert.throws(function () { source.solveItem(Object.assign({}, w12, { data: Object.assign({}, w12.data, { insideVariableCoefficient: 2 }) })); }, /EEA_NONINTEGER_BLANK/);
  assert.throws(function () { source.solveItem(Object.assign({}, w12, { data: Object.assign({}, w12.data, { targetConstant: 29 }) })); }, /EEA_PAIR_NOT_EQUIVALENT/);
});

test("all localized prompts preserve the fixed numeric structure of each authored item", function () {
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    ["ko", "en", "zh-Hans"].forEach(function (locale) {
      assert.deepEqual(numericSignature(item.prompt[locale]), promptNumbers[item.id].slice().sort(function (a, b) { return a - b; }), item.id + " " + locale);
    });
  });
});

test("whole-number grammar accepts one canonical numeric result and rejects near misses", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["eea-w01"], "32"), true);
  assert.equal(source.evaluateResponse(byId["eea-w01"], "31.999"), false);
  assert.equal(source.evaluateResponse(byId["eea-w09"], "3"), true);
  assert.equal(source.evaluateResponse(byId["eea-w09"], "7x+21"), false);
  assert.equal(source.evaluateResponse(byId["eea-r03"], "6"), true);
  assert.equal(source.evaluateResponse(byId["eea-r03"], "-6"), false);
  assert.equal(source.evaluateResponse(source.pack.recheckItems.find(function (item) { return item.id === "eea-r04"; }), "0"), true);
});

test("pack is original, multilingual, Grade 6 aligned, and limits automatic evidence", function () {
  assert.equal(source.pack.clusterId, "6.EE.A");
  assert.equal(source.pack.standardRange, "6.EE.A.1-4");
  assert.equal(source.pack.learnerStage, "US Grade 6 ages 11-12");
  assert.equal(source.pack.rights.assetRights, "original");
  assert.match(source.pack.scopeNotice.en, /teacher separately observes/i);
  assert.match(source.pack.scopeNotice.en, /does not automatically determine full mastery or promotion/i);
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function (item) {
    assert.deepEqual(Object.keys(item.prompt).sort(), ["en", "ko", "zh-Hans"]);
    assert.equal(Object.prototype.hasOwnProperty.call(item, "answer"), false);
  });
  assert.deepEqual(new Set(source.pack.recheckItems.map(function (item) { return item.strand; })), new Set(Object.keys(source.pack.strands)));
  assert.equal(registry.forCluster("6.EE.A"), source);
});

test("automatic checks do not claim expression writing, verbal reading, or equivalence explanation", function () {
  assert.match(source.pack.scopeNotice.en, /reading and writing exponent notation/);
  assert.match(source.pack.scopeNotice.en, /representing situations with expressions/);
  assert.match(source.pack.errorGuides["equivalence-check"].prompt.en, /teacher separately observes/i);
});
