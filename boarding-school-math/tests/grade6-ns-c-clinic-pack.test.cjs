const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const source = require(path.resolve(__dirname, "..", "learning", "grade6-ns-c-clinic-pack.js"));
const registry = require(path.resolve(__dirname, "..", "learning", "grade6-clinic-packs.js"));

const expected = {
  "nsc-w01": "7/4", "nsc-w02": "-5/3", "nsc-w03": "9/4", "nsc-w04": "7/4",
  "nsc-w05": "<", "nsc-w06": "-7/4", "nsc-w07": ">", "nsc-w08": "1",
  "nsc-w09": "2", "nsc-w10": "4", "nsc-w11": "2", "nsc-w12": "1",
  "nsc-r01": "11/6", "nsc-r02": "<", "nsc-r03": "3", "nsc-r04": "3/2"
};

function abs(value) { return value < 0n ? -value : value; }
function gcd(a, b) { let x = abs(a); let y = abs(b); while (y) { const remainder = x % y; x = y; y = remainder; } return x; }
function reduced(numerator, denominator) {
  const n = BigInt(numerator); const d = BigInt(denominator); const divisor = gcd(n, d);
  return { n: n / divisor, d: d / divisor };
}
function format(value) { return value.d === 1n ? String(value.n) : value.n + "/" + value.d; }
function signedCompare(a, b) { const delta = a.n * b.d - b.n * a.d; return delta < 0n ? "<" : ">"; }
function independent(item) {
  const d = item.data;
  if (item.kind === "quadrant-classification") return d.xNumerator > 0 ? (d.yNumerator > 0 ? "1" : "4") : (d.yNumerator > 0 ? "2" : "3");
  if (item.kind === "signed-rational-comparison") {
    let left = reduced(d.leftNumerator, d.leftDenominator); let right = reduced(d.rightNumerator, d.rightDenominator);
    if (d.basis === "absolute-magnitude") { left.n = abs(left.n); right.n = abs(right.n); }
    return signedCompare(left, right);
  }
  if (["opposite", "absolute-value"].includes(d.operation)) {
    const value = reduced(d.numerator, d.denominator);
    value.n = d.operation === "opposite" ? -value.n : abs(value.n);
    return format(value);
  }
  function pair(prefix) { return reduced(d[prefix + "Numerator"], d[prefix + "Denominator"]); }
  if (["distance", "minimum", "maximum"].includes(d.operation)) {
    const left = pair("left"); const right = pair("right"); const delta = left.n * right.d - right.n * left.d;
    if (d.operation === "distance") return format(reduced(abs(delta), left.d * right.d));
    return format(d.operation === "minimum" ? (delta < 0n ? left : right) : (delta > 0n ? left : right));
  }
  const first = pair(d.axis === "horizontal" ? "firstX" : "firstY"); const second = pair(d.axis === "horizontal" ? "secondX" : "secondY");
  return format(reduced(abs(first.n * second.d - second.n * first.d), first.d * second.d));
}

test("16 signed-number items match an independent exact-answer ledger", function () {
  assert.equal(source.validatePack(), true);
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  assert.equal(items.length, 16);
  items.forEach(function (item) {
    assert.equal(source.formatResult(item), expected[item.id], item.id + " fixed ledger");
    assert.equal(independent(item), expected[item.id], item.id + " independent BigInt calculation");
  });
});

test("signed rational response grammar keeps one canonical visible answer", function () {
  const byId = Object.fromEntries(source.pack.workbookItems.concat(source.pack.recheckItems).map(function (item) { return [item.id, item]; }));
  assert.equal(source.evaluateResponse(byId["nsc-w01"], "7/4"), true);
  assert.equal(source.evaluateResponse(byId["nsc-w01"], "14/8"), false, "unreduced response stays rejected because the prompt requires reduced form");
  assert.equal(source.evaluateResponse(byId["nsc-w02"], "−5/3"), true, "Unicode minus normalizes safely");
  assert.equal(source.evaluateResponse(byId["nsc-w05"], "<"), true);
  assert.equal(source.evaluateResponse(byId["nsc-w05"], ">"), false);
  assert.equal(source.evaluateResponse(byId["nsc-w09"], "2"), true);
  assert.equal(source.evaluateResponse(byId["nsc-w09"], "II"), false, "the prompt requests one numeric quadrant response");
  assert.equal(source.evaluateResponse(byId["nsc-r04"], "3/2"), true);
  assert.equal(source.evaluateResponse(byId["nsc-r04"], "1.5"), false, "the prompt explicitly requires a reduced fraction or integer");
  assert.equal(source.evaluateResponse(byId["nsc-r04"], "6/4"), false, "unreduced equivalent stays outside the declared response grammar");
});

test("quadrant and same-axis items preserve the automatic-evidence boundary", function () {
  const items = source.pack.workbookItems.concat(source.pack.recheckItems);
  items.filter(function (item) { return item.kind === "quadrant-classification"; }).forEach(function (item) {
    assert.notEqual(item.data.xNumerator, 0); assert.notEqual(item.data.yNumerator, 0);
  });
  assert.deepEqual(items.filter(function (item) { return item.kind === "quadrant-classification"; }).map(source.formatResult).sort(), ["1", "2", "3", "4"]);
  items.filter(function (item) { return item.data.operation === "axis-distance"; }).forEach(function (item) {
    const d = item.data;
    if (d.axis === "horizontal") assert.equal(BigInt(d.firstYNumerator) * BigInt(d.secondYDenominator), BigInt(d.secondYNumerator) * BigInt(d.firstYDenominator));
    else assert.equal(BigInt(d.firstXNumerator) * BigInt(d.secondXDenominator), BigInt(d.secondXNumerator) * BigInt(d.firstXDenominator));
  });
  assert.match(source.pack.scopeNotice.en, /teacher separately observes point plotting/i);
  assert.match(source.pack.scopeNotice.en, /does not automatically determine full mastery or promotion/i);
  ["nsc-w11", "nsc-w12", "nsc-r04"].forEach(function (id) {
    const prompt = items.find(function (item) { return item.id === id; }).prompt;
    assert.match(prompt.ko, /기약분수 또는 정수/); assert.match(prompt.en, /reduced fraction or integer/); assert.match(prompt["zh-Hans"], /最简分数或整数/);
  });
});

test("registry exposes only the reviewed 6.NS.C pack for the exact cluster", function () {
  assert.equal(registry.forCluster("6.NS.C"), source);
  assert.equal(registry.forCluster("6.NS.C").pack.id, "gfield-grade6-ns-c-clinic-v1");
  assert.throws(function () { registry.forCluster("6.NS.C&studentId=1"); }, /UNSUPPORTED/);
});
