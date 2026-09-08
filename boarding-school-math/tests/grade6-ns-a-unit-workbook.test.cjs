"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const source=require("../learning/grade6-ns-a-unit-workbook.js");

const expected={
  "nsa-w01":"6","nsa-w02":"4","nsa-w03":"10","nsa-w04":"10","nsa-w05":"8","nsa-w06":"2",
  "nsa-w07":"2","nsa-w08":"3/2","nsa-w09":"9","nsa-w10":"2","nsa-w11":"12","nsa-w12":"7/3",
  "nsa-w13":"6","nsa-w14":"5/4","nsa-w15":"15/16","nsa-w16":"15/4","nsa-w17":"10/3","nsa-w18":"6/5",
  "nsa-w19":"33/8","nsa-w20":"15/2","nsa-w21":"3/4","nsa-w22":"2","nsa-w23":"2","nsa-w24":"21/5",
  "nsa-w25":"4","nsa-w26":"5","nsa-w27":"9/2","nsa-w28":"6","nsa-w29":"6","nsa-w30":"10",
  "nsa-w31":"7/10","nsa-w32":"4/15","nsa-w33":"2/3","nsa-w34":"7/2","nsa-w35":"16/5","nsa-w36":"5/4",
  "nsa-r01":"11/2","nsa-r02":"3/2","nsa-r03":"5/2","nsa-r04":"10","nsa-r05":"3/8","nsa-r06":"9/4","nsa-r07":"15/8","nsa-r08":"15/2"
};

function items(){return source.pack.workbookItems.concat(source.pack.recheckItems);}

test("6.NS.A is a balanced 36-item unit workbook with an 8-item recheck",function(){
  assert.equal(source.validatePack(),true);
  assert.equal(source.pack.workbookItems.length,36);
  assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["models","compute","applications"].map(function(section){return[section,source.pack.workbookItems.filter(function(candidate){return candidate.section===section;}).length];})),{models:12,compute:12,applications:12});
  assert.equal(source.pack.contentOrigin,"gfield-original-authored-public-unit-workbook");
  assert.equal(source.pack.rights.containsThirdPartyAssets,false);
});

test("all 44 quotients match a separately written exact-answer ledger",function(){
  assert.equal(Object.keys(expected).length,44);
  items().forEach(function(candidate){assert.equal(source.formatResult(candidate),expected[candidate.id],candidate.id);});
});

test("every quotient passes an independent multiplication inverse",function(){
  items().forEach(function(candidate){
    const quotient=source.solveItem(candidate);const divisor=candidate.data.divisor;const dividend=candidate.data.dividend;
    assert.equal(quotient.numerator*BigInt(divisor.numerator)*BigInt(dividend.denominator),BigInt(dividend.numerator)*quotient.denominator*BigInt(divisor.denominator),candidate.id);
    assert.equal(source.evaluateResponse(candidate,expected[candidate.id]),true,candidate.id+" exact response");
  });
});

test("recheck uses eight new facts and covers eight reasoning structures",function(){
  const workbookFacts=new Set(source.pack.workbookItems.map(function(candidate){return candidate.data.dividend.numerator+"/"+candidate.data.dividend.denominator+"÷"+candidate.data.divisor.numerator+"/"+candidate.data.divisor.denominator;}));
  source.pack.recheckItems.forEach(function(candidate){const fact=candidate.data.dividend.numerator+"/"+candidate.data.dividend.denominator+"÷"+candidate.data.divisor.numerator+"/"+candidate.data.divisor.denominator;assert.equal(workbookFacts.has(fact),false,candidate.id);});
  assert.equal(new Set(source.pack.recheckItems.map(function(candidate){return candidate.strand;})).size,8);
});

test("all locales use complete Grade 6 prompts without embedded answer fields",function(){
  items().forEach(function(candidate){
    assert.deepEqual(Object.keys(candidate.prompt).sort(),["en","ko","zh-Hans"]);
    ["ko","en","zh-Hans"].forEach(function(locale){assert.ok(candidate.prompt[locale].length>=8,candidate.id+" "+locale);assert.ok(/[?？.。]|하세요|갑니까|나타내세요/.test(candidate.prompt[locale]),candidate.id+" "+locale+" complete sentence");assert.ok(source.renderVisual(candidate,locale).includes("□"),candidate.id+" visual response blank");});
    assert.equal(Object.prototype.hasOwnProperty.call(candidate,"answer"),false);
  });
  assert.match(source.solutionFor(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsa-w23";}),"ko"),/2 1\/2 = 5\/2.*1 1\/4 = 5\/4/);
});

test("mixed-number quantity models preserve each whole instead of clipping at one bar",function(){
  const oneAndHalf=source.renderVisual(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsa-w09";}),"ko");
  const twoAndTwoThirds=source.renderVisual(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsa-w11";}),"ko");
  assert.equal((oneAndHalf.match(/division-bar total/g)||[]).length,2);
  assert.equal((twoAndTwoThirds.match(/division-bar total/g)||[]).length,3);
  assert.match(oneAndHalf,/--fraction-width:50%/);
  assert.match(twoAndTwoThirds,/--fraction-width:66\.666/);
});
