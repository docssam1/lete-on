"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const source = require("../learning/grade7-ns-a-unit-workbook.js");

const all = function () { return source.pack.workbookItems.concat(source.pack.recheckItems); };
function abs(value) { return value < 0n ? -value : value; }
function gcd(a, b) { a = abs(a); b = abs(b); while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
function rational(pair) { let n = BigInt(pair[0]), d = BigInt(pair[1]); if (!d) throw new Error("zero denominator"); if (d < 0n) { n = -n; d = -d; } const divisor = gcd(n, d); return [n / divisor, d / divisor]; }
function add(a, b) { return rational([BigInt(a[0]) * BigInt(b[1]) + BigInt(b[0]) * BigInt(a[1]), BigInt(a[1]) * BigInt(b[1])]); }
function subtract(a, b) { return rational([BigInt(a[0]) * BigInt(b[1]) - BigInt(b[0]) * BigInt(a[1]), BigInt(a[1]) * BigInt(b[1])]); }
function multiply(a, b) { return rational([BigInt(a[0]) * BigInt(b[0]), BigInt(a[1]) * BigInt(b[1])]); }
function divide(a, b) { assert.notEqual(BigInt(b[0]), 0n); return rational([BigInt(a[0]) * BigInt(b[1]), BigInt(a[1]) * BigInt(b[0])]); }
function distance(a, b) { const value = subtract(a, b); return [abs(value[0]), value[1]]; }
function text(value) { return value[1] === 1n ? String(value[0]) : value[0] + "/" + value[1]; }
function choiceValue(item) {
  const label = source.choiceLabel(item, source.solveItem(item), "en");
  const match = /^(-?\d+)(?:\/(\d+))?/.exec(label.replace(/^−/,"-"));
  assert.ok(match, item.id + " exact rational choice");
  return rational([BigInt(match[1]), BigInt(match[2] || 1)]);
}
function exactExpected(item) {
  const data = item.data;
  if (item.kind === "rational-add-subtract" || item.kind === "signed-multiply-divide") return ({ add:add, subtract:subtract, multiply:multiply, divide:divide })[data.operation](data.left, data.right);
  if (item.kind === "rational-multi-operation") { let result=rational(data.values[0]);data.operations.forEach(function(operation,index){result=operation==="add"?add(result,data.values[index+1]):subtract(result,data.values[index+1]);});return result; }
  if (item.kind === "rational-multiply-properties") {
    if (data.propertyModel === "commutative-associative-inverses") return data.values.reduce(function (result, value) { return multiply(result, value); }, rational([1n,1n]));
    if (data.propertyModel === "distributive-common-factor") return multiply(data.values[0], add(data.values[1], data.values[2]));
    assert.fail(item.id + " unknown property model");
  }
  if (item.kind === "number-line-reasoning") {
    if (data.mode === "opposite") return rational([-BigInt(data.a[0]), BigInt(data.a[1])]);
    if (data.mode === "distance") return distance(data.a, data.b);
    return data.mode === "add" ? add(data.a, data.b) : subtract(data.a, data.b);
  }
  if (item.kind === "rational-context") {
    let result = rational(data.values[0]);
    data.model.forEach(function (operation, index) { result = ({ add:add, subtract:subtract, multiply:multiply, divide:divide })[operation](result, data.values[index + 1]); });
    return result;
  }
  return null;
}
function denominatorClass(pair) {
  let denominator = abs(rational(pair)[1]);
  while (denominator % 2n === 0n) denominator /= 2n;
  while (denominator % 5n === 0n) denominator /= 5n;
  return denominator === 1n ? "terminating" : "repeating";
}
function longDivision(pair, digits) {
  const reduced = rational(pair), negative = reduced[0] < 0n, numerator = abs(reduced[0]), denominator = reduced[1];
  let whole = numerator / denominator, remainder = numerator % denominator, decimals = "";
  for (let index=0; index<digits && remainder; index+=1) { remainder *= 10n; decimals += String(remainder / denominator); remainder %= denominator; }
  return (negative ? "−" : "") + whole + (decimals ? "." + decimals : "");
}

test("7.NS.A declares the gated 36 plus 8 sequence and exact section balance", function () {
  assert.equal(source.validatePack(), true);
  assert.equal(source.pack.workbookItems.length, 36);
  assert.equal(source.pack.recheckItems.length, 8);
  assert.deepEqual(Object.fromEntries(["add-subtract","number-line","multiply-divide","decimal-form","context"].map(function (section) { return [section, source.pack.workbookItems.filter(function (item) { return item.section === section; }).length]; })), { "add-subtract":10, "number-line":8, "multiply-divide":10, "decimal-form":4, context:4 });
  assert.equal(new Set(all().map(function (item) { return item.id; })).size, 44);
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.structureId; })).size, 8);
  assert.equal(new Set(source.pack.recheckItems.map(function (item) { return item.standardIds[0]; })).size, 8);
  function answerDistribution(items) { return Object.fromEntries(["A","B","C","D"].map(function (id) { return [id,items.filter(function (item) { return source.solveItem(item) === id; }).length]; })); }
  assert.deepEqual(answerDistribution(source.pack.workbookItems),{A:9,B:9,C:9,D:9});
  assert.deepEqual(answerDistribution(source.pack.recheckItems),{A:2,B:2,C:2,D:2});
  assert.equal(source.pack.workbookItems.map(source.solveItem).join(""),"BDACCADBDBCAACBDBADCCDABDCBAABCDBCDA");
  assert.equal(source.pack.recheckItems.map(source.solveItem).join(""),"CADBBDAC");
  assert.notEqual(source.pack.workbookItems.slice(0,4).map(source.solveItem).join(""),source.pack.workbookItems.slice(4,8).map(source.solveItem).join(""));
});

test("a separate BigInt solver proves every rational answer and nonzero divisor", function () {
  all().filter(function (item) { return item.kind !== "decimal-form"; }).forEach(function (item) {
    const expected = exactExpected(item), selected = choiceValue(item);
    assert.deepEqual(selected, expected, item.id);
    assert.deepEqual(rational(item.data.expected), expected, item.id + " ledger");
    if ((item.data.operation === "divide" || (item.data.model || []).includes("divide"))) {
      const divisor = item.kind === "rational-context" ? item.data.values[item.data.model.indexOf("divide") + 1] : item.data.right;
      assert.notEqual(BigInt(divisor[0]), 0n, item.id);
    }
    assert.equal(item.choices.filter(function (choice) { return choice.correct; }).length, 1, item.id);
    assert.equal(source.evaluateResponse(item, source.solveItem(item)), true, item.id);
    assert.equal(source.evaluateResponse(item, "Z"), false, item.id);
  });
});

test("7.NS.A.2c items require two distinct operation-property strategies", function () {
  const items=source.pack.workbookItems.filter(function(item){return item.standardIds[0]==="7.NS.A.2c";});
  assert.equal(items.length,2);
  assert.deepEqual(items.map(function(item){return item.data.propertyModel;}).sort(),["commutative-associative-inverses","distributive-common-factor"]);
  assert.ok(items.every(function(item){return item.kind==="rational-multiply-properties"&&item.errorCode==="multiply-operation-properties";}));
  assert.match(items[0].prompt.ko,/교환법칙.*결합법칙/);
  assert.match(items[1].prompt.ko,/분배법칙/);
  items.forEach(function(item){
    assert.deepEqual(rational(item.data.expected),exactExpected(item),item.id);
    assert.deepEqual(choiceValue(item),exactExpected(item),item.id+" choice");
    const visual=source.renderVisual(item,"ko","student");
    assert.match(visual,/g7nsa-property-model/);
    assert.match(visual,/<span>\?<\/span>/);
    assert.doesNotMatch(visual,/(?:answer-point|solution-point|target)/);
  });
});

test("denominator factoring and independent long division verify every decimal item", function () {
  all().filter(function (item) { return item.kind === "decimal-form"; }).forEach(function (item) {
    const expectedClass = denominatorClass(item.data.value), expansion = longDivision(item.data.value, 12), declaredPrefix = item.data.decimalExpansionPrefix;
    assert.equal(item.data.classification, expectedClass, item.id);
    assert.ok(expansion.startsWith(declaredPrefix), item.id + ": " + expansion + " starts with " + declaredPrefix);
    assert.ok(source.choiceLabel(item, source.solveItem(item), "en").includes(item.data.decimalText), item.id);
    assert.doesNotMatch(item.data.decimalText, /…/, item.id + " formal decimal notation");
    if (expectedClass === "repeating") {
      assert.match(item.data.decimalText, /\u0305/, item.id + " overbar");
      assert.ok(item.data.repeatBlock, item.id + " repeat block");
    } else assert.equal(item.data.repeatBlock, "", item.id + " terminating repeat block");
    ["ko","en","zh-Hans"].forEach(function (locale) {
      item.choices.forEach(function (choice) { assert.doesNotMatch(choice.label[locale], /…/, item.id + ":" + locale); });
    });
  });
});

test("all public records are original, trilingual, granular, and single-answer", function () {
  assert.equal(source.pack.contentOrigin, "gfield-original-authored-public-unit-workbook");
  assert.equal(source.pack.rights.containsThirdPartyAssets, false);
  assert.equal(source.pack.completionKey, "gfield-unit-workbook:7.NS.A:v1");
  assert.match(source.pack.scopeNotice.en, /does not determine placement or promotion/i);
  all().forEach(function (item) {
    ["ko","en","zh-Hans"].forEach(function (locale) { const labels=item.choices.map(function(choice){return choice.label[locale].trim();});assert.ok(item.prompt[locale].trim().length > 10, item.id + ":" + locale); assert.ok(labels.every(Boolean), item.id + ":" + locale);assert.equal(new Set(labels).size,4,item.id+":"+locale+":unique visible choices");item.choices.forEach(function(choice){assert.doesNotMatch(choice.label[locale],/^-\d/,item.id+":"+locale+":formal minus");}); });
    assert.equal(item.standardIds.length, 1, item.id);
    assert.match(item.standardIds[0], /^7\.NS\.A\.(?:1[a-d]|2[a-d]|3)$/, item.id);
    assert.equal(item.choices.length, 4, item.id);
    assert.equal(item.choices.filter(function (choice) { return choice.correct; }).length, 1, item.id);
  });
});

test("every decimal item has one and only one choice carrying the independently verified notation", function () {
  all().filter(function(item){return item.kind==="decimal-form";}).forEach(function(item){
    ["ko","en","zh-Hans"].forEach(function(locale){
      const matches=item.choices.filter(function(choice){const token=/[−-]?\d+\.(?:\d\u0305?)+/u.exec(choice.label[locale]);return token && token[0]===item.data.decimalText;});
      assert.equal(matches.length,1,item.id+":"+locale+":decimal notation cardinality");
      assert.equal(matches[0].correct,true,item.id+":"+locale+":decimal notation answer");
    });
  });
});

test("teacher solutions show the declared equation and exact result", function () {
  const expected={
    "g7nsa-w01":/−3\/4 \+ 5\/8 = −1\/8/,
    "g7nsa-w12":/\|−3\/2 − \(3\/4\)\| = 9\/4/,
    "g7nsa-w13":/−7\/6 \+ 2\/3 = −1\/2/,
    "g7nsa-w19":/−3\/5 × 10\/9 = −2\/3/,
    "g7nsa-r04":/−9\/4 ÷ −3\/8 = 6 minutes/
  };
  Object.entries(expected).forEach(function(entry){const item=all().find(function(candidate){return candidate.id===entry[0];});assert.match(source.solutionFor(item,"en"),entry[1],entry[0]);});
  assert.equal(source.choiceLabel(all().find(function(item){return item.id==="g7nsa-w26";}),"C","en"),"−1");
});

test("calculated number-line visuals show only givens and never a target answer marker", function () {
  all().filter(function (item) { return item.kind === "number-line-reasoning"; }).forEach(function (item) {
    const markup = source.renderVisual(item, "en", "student");
    const expectedGivenCount = item.data.mode === "distance" ? 2 : 1;
    assert.match(markup, /g7nsa-number-line/, item.id);
    assert.equal((markup.match(/class="g7nsa-given"/g) || []).length, expectedGivenCount, item.id);
    assert.doesNotMatch(markup, /class="[^"]*(?:target|answer-point|solution-point)/, item.id);
    assert.match(markup, /(?:Horizontal|Vertical) number line showing only the given points/, item.id);
    const points = Array.from(markup.matchAll(/<circle class="g7nsa-given" cx="([\d.]+)" cy="([\d.]+)"/g)).map(function (match) { return [Number(match[1]), Number(match[2])]; });
    const rawValues = [item.data.a[0] / item.data.a[1]].concat(item.data.mode === "distance" ? [item.data.b[0] / item.data.b[1]] : []), extent = Math.max(2, Math.ceil(Math.max.apply(Math, rawValues.map(Math.abs).concat([2]))) + 1), scale = (292 - 28) / (2 * extent);
    rawValues.forEach(function (value, index) { const expected = item.data.orientation === "vertical" ? [160, 282 - (value + extent) * scale] : [28 + (value + extent) * scale, 58]; assert.ok(Math.abs(points[index][0] - expected[0]) <= 0.01, item.id + " cx"); assert.ok(Math.abs(points[index][1] - expected[1]) <= 0.01, item.id + " cy"); });
    if (["add","subtract"].includes(item.data.mode)) {
      const signedChange = item.data.mode === "subtract" ? -item.data.b[0] : item.data.b[0];
      const expectedDirection = item.data.orientation === "vertical" ? (signedChange >= 0 ? "up" : "down") : (signedChange >= 0 ? "right" : "left");
      assert.match(markup, new RegExp('data-direction="' + expectedDirection + '"'), item.id);
      const arrow = /class="g7nsa-direction"[^>]*data-origin-x="([\d.]+)" data-origin-y="([\d.]+)" data-start-x="([\d.]+)" data-start-y="([\d.]+)" data-end-x="([\d.]+)" data-end-y="([\d.]+)"/.exec(markup);
      assert.ok(arrow, item.id + " calculated direction arrow");
      const expectedPoint = item.data.orientation === "vertical" ? [160,282 - (rawValues[0] + extent) * scale] : [28 + (rawValues[0] + extent) * scale,58];
      const expectedArrowStart = item.data.orientation === "vertical" ? [124,expectedPoint[1]] : [expectedPoint[0],24];
      const expectedEnd = item.data.orientation === "vertical"
        ? [124,expectedDirection === "up" ? Math.max(expectedPoint[1] - 34, 26) : Math.min(expectedPoint[1] + 34, 274)]
        : [expectedDirection === "right" ? Math.min(expectedPoint[0] + 34, 284) : Math.max(expectedPoint[0] - 34, 36),24];
      assert.ok(Math.abs(Number(arrow[1]) - expectedPoint[0]) <= 0.01 && Math.abs(Number(arrow[2]) - expectedPoint[1]) <= 0.01, item.id + " arrow origin is the declared point");
      assert.ok(Math.abs(Number(arrow[3]) - expectedArrowStart[0]) <= 0.01 && Math.abs(Number(arrow[4]) - expectedArrowStart[1]) <= 0.01, item.id + " direction cue is offset parallel to the number line");
      assert.ok(Math.abs(Number(arrow[5]) - expectedEnd[0]) <= 0.01 && Math.abs(Number(arrow[6]) - expectedEnd[1]) <= 0.01, item.id + " arrow end is calculated from direction and bounds");
    } else assert.match(markup, /data-direction="none"/, item.id);
  });
});

test("context visuals preserve the declared operation order and keep the result blank", function () {
  const symbols = { add:"+", subtract:"−", multiply:"×", divide:"÷" };
  all().filter(function (item) { return item.kind === "rational-context"; }).forEach(function (item) {
    const markup = source.renderVisual(item, "en", "student");
    item.data.model.forEach(function (operation) { assert.match(markup, new RegExp(">" + symbols[operation].replace(/[+]/g,"\\+") + "<"), item.id + ":" + operation); });
    assert.match(markup, /<b>=<\/b><span>\?<\/span>/, item.id);
    assert.equal((markup.match(/<span>/g) || []).length, item.data.values.length + 1, item.id);
  });
  const durationItem = source.pack.recheckItems.find(function (item) { return item.id === "g7nsa-r04"; });
  assert.deepEqual(rational(durationItem.data.expected),[6n,1n]);
  assert.match(durationItem.prompt.ko,/잠수정.*1분마다.*위치 변화.*몇 분/);
  assert.equal(durationItem.data.unit.en,"minutes");
});

test("visual accessibility labels are mathematical and localized", function () {
  const samples = ["g7nsa-w01","g7nsa-w09","g7nsa-w11","g7nsa-w22","g7nsa-w29","g7nsa-w33"].map(function (id) { return all().find(function (item) { return item.id === id; }); });
  samples.forEach(function (item) {
    assert.match(source.renderVisual(item,"ko"),/aria-label="[^"]*[가-힣][^"]*"/,item.id+":ko");
    assert.match(source.renderVisual(item,"en"),/aria-label="[^"]*[A-Za-z][^"]*"/,item.id+":en");
    assert.match(source.renderVisual(item,"zh-Hans"),/aria-label="[^"]*[\u4e00-\u9fff][^"]*"/,item.id+":zh-Hans");
  });
  assert.match(source.renderVisual(samples[2],"ko"),/문제에 주어진 점만 표시한 가로 수직선/);
  assert.match(source.renderVisual(samples[2],"zh-Hans"),/只标出题目给定点的横向数轴/);
});
