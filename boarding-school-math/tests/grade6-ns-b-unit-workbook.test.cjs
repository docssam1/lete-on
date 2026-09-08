"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const source=require("../learning/grade6-ns-b-unit-workbook.js");

const expected={
  "nsba-w01":"42","nsba-w02":"364","nsba-w03":"125","nsba-w04":"384","nsba-w05":"518","nsba-w06":"858","nsba-w07":"1143","nsba-w08":"1286","nsba-w09":"819","nsba-w10":"838","nsba-w11":"686","nsba-w12":"280",
  "nsba-w13":"25.158","nsba-w14":"24.755","nsba-w15":"9","nsba-w16":"11.9","nsba-w17":"354.008","nsba-w18":"63.513","nsba-w19":"2.73","nsba-w20":"5.427","nsba-w21":"30.8","nsba-w22":"2.7","nsba-w23":"59.325","nsba-w24":"3.84",
  "nsba-w25":"12","nsba-w26":"24","nsba-w27":"12","nsba-w28":"12","nsba-w29":"24","nsba-w30":"15","nsba-w31":"30","nsba-w32":"90","nsba-w33":"9","nsba-w34":"8","nsba-w35":"18","nsba-w36":"24",
  "nsba-r01":"414","nsba-r02":"56.089","nsba-r03":"63.114","nsba-r04":"26.46","nsba-r05":"23.4","nsba-r06":"18","nsba-r07":"36","nsba-r08":"24"
};
function all(){return source.pack.workbookItems.concat(source.pack.recheckItems);}
function decimal(text){const match=String(text).match(/^(\d+)(?:\.(\d+))?$/);const places=(match[2]||"").length;return{n:BigInt(match[1]+(match[2]||"")),d:10n**BigInt(places)};}
function equivalent(left,right){return left.n*right.d===right.n*left.d;}
function answerValue(candidate){return decimal(expected[candidate.id]);}

test("6.NS.B is balanced across 36 workbook items and eight recheck structures",function(){
  assert.equal(source.validatePack(),true);assert.equal(source.pack.workbookItems.length,36);assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["division","decimals","factors"].map(function(section){return[section,source.pack.workbookItems.filter(function(candidate){return candidate.section===section;}).length];})),{division:12,decimals:12,factors:12});
  assert.equal(source.pack.contentOrigin,"gfield-original-authored-public-unit-workbook");assert.equal(source.pack.rights.containsThirdPartyAssets,false);
});

test("all 44 final values match a fixed independent answer ledger",function(){
  assert.equal(Object.keys(expected).length,44);all().forEach(function(candidate){assert.equal(source.formatResult(candidate),expected[candidate.id],candidate.id);assert.equal(source.evaluateResponse(candidate,expected[candidate.id]),true,candidate.id);});
});

test("division and decimal answers pass independent inverse or integer arithmetic",function(){
  all().filter(function(candidate){return candidate.kind==="whole-division";}).forEach(function(candidate){assert.equal(BigInt(expected[candidate.id])*BigInt(candidate.data.divisor),BigInt(candidate.data.dividend),candidate.id);});
  all().filter(function(candidate){return candidate.kind.startsWith("decimal-");}).forEach(function(candidate){const left=decimal(candidate.data.left);const right=decimal(candidate.data.right);const answer=answerValue(candidate);let recomputed;if(candidate.kind==="decimal-add")recomputed={n:left.n*right.d+right.n*left.d,d:left.d*right.d};if(candidate.kind==="decimal-subtract")recomputed={n:left.n*right.d-right.n*left.d,d:left.d*right.d};if(candidate.kind==="decimal-multiply")recomputed={n:left.n*right.n,d:left.d*right.d};if(candidate.kind==="decimal-divide")recomputed={n:left.n*right.d,d:left.d*right.n};assert.equal(equivalent(answer,recomputed),true,candidate.id);});
});

test("GCF and LCM answers pass exhaustive divisor or multiple checks",function(){
  all().filter(function(candidate){return candidate.kind==="gcf";}).forEach(function(candidate){const answer=Number(expected[candidate.id]);const common=[];for(let value=1;value<=Math.min(candidate.data.left,candidate.data.right);value+=1)if(candidate.data.left%value===0&&candidate.data.right%value===0)common.push(value);assert.equal(answer,Math.max.apply(null,common),candidate.id);});
  all().filter(function(candidate){return candidate.kind==="lcm";}).forEach(function(candidate){const answer=Number(expected[candidate.id]);let first=1;while(first%candidate.data.left||first%candidate.data.right)first+=1;assert.equal(answer,first,candidate.id);});
});

test("recheck uses eight explicit reasoning strands and standards stay in scope",function(){
  assert.equal(new Set(source.pack.recheckItems.map(function(candidate){return candidate.strand;})).size,8);
  all().forEach(function(candidate){assert.match(candidate.standardIds[0],/^6\.NS\.B\.[234]$/);if(candidate.kind==="whole-division")assert.equal(candidate.standardIds[0],"6.NS.B.2");else if(["gcf","lcm"].includes(candidate.kind))assert.equal(candidate.standardIds[0],"6.NS.B.4");else assert.equal(candidate.standardIds[0],"6.NS.B.3");});
});

test("all locales are complete and visuals keep the response blank",function(){
  all().forEach(function(candidate){assert.deepEqual(Object.keys(candidate.prompt).sort(),["en","ko","zh-Hans"]);["ko","en","zh-Hans"].forEach(function(locale){assert.ok(candidate.prompt[locale].length>=8,candidate.id+" "+locale);assert.match(source.renderVisual(candidate,locale),/□/,candidate.id+" "+locale);});assert.equal(Object.prototype.hasOwnProperty.call(candidate,"answer"),false);});
  assert.match(source.renderVisual(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsba-w16";}),"ko"),/1487\.5 ÷ 125 = □/);
  assert.match(source.renderVisual(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsba-w22";}),"ko"),/94\.5 ÷ 35 = □/);
  assert.doesNotMatch(source.renderVisual(source.pack.workbookItems.find(function(candidate){return candidate.id==="nsba-w22";}),"ko"),/094\.5|035/);
});
