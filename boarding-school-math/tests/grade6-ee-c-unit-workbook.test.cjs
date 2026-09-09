"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const source=require("../learning/grade6-ee-c-unit-workbook.js");

const expected={
  "eecu-w01":"c","eecu-w02":"b","eecu-w03":"h","eecu-w04":"d","eecu-w05":"23","eecu-w06":"12","eecu-w07":"13","eecu-w08":"32","eecu-w09":"15","eecu-w10":"12","eecu-w11":"2","eecu-w12":"7",
  "eecu-w13":"11","eecu-w14":"14","eecu-w15":"19","eecu-w16":"14","eecu-w17":"5","eecu-w18":"5","eecu-w19":"8","eecu-w20":"4","eecu-w21":"3","eecu-w22":"3/2","eecu-w23":"5","eecu-w24":"5",
  "eecu-w25":"3","eecu-w26":"3","eecu-w27":"3/2","eecu-w28":"13","eecu-w29":"8","eecu-w30":"17","eecu-w31":"5","eecu-w32":"5","eecu-w33":"3","eecu-w34":"9","eecu-w35":"10","eecu-w36":"6",
  "eecu-r01":"s","eecu-r02":"17","eecu-r03":"8","eecu-r04":"5","eecu-r05":"13","eecu-r06":"7","eecu-r07":"5","eecu-r08":"5"
};
function all(){return source.pack.workbookItems.concat(source.pack.recheckItems);}
function rat(value){return{n:BigInt(value.numerator),d:BigInt(value.denominator==null?1:value.denominator)};}
function reduce(n,d){const sign=d<0n?-1n:1n;n*=sign;d*=sign;let a=n<0n?-n:n,b=d;while(b){const next=a%b;a=b;b=next;}const divisor=a||1n;n/=divisor;d/=divisor;return d===1n?String(n):n+"/"+d;}
function linear(data,input){const rate=rat(data.rate),start=rat(data.start);return reduce(rate.n*input.n*start.d+start.n*rate.d*input.d,rate.d*input.d*start.d);}
function calc(candidate){const d=candidate.data;if(candidate.kind==="variable-role")return d.askRole==="dependent"?d.dependent:d.independent;if(candidate.kind==="evaluate-rule")return linear(d,rat(d.input));if(candidate.kind==="table-output")return linear(d,rat(d.targetInput));if(candidate.kind==="table-input"){const target=rat(d.targetOutput),rate=rat(d.rate),start=rat(d.start);return reduce((target.n*start.d-start.n*target.d)*rate.d,target.d*start.d*rate.n);}if(candidate.kind==="rate-from-points"){const x1=rat(d.first[0]),y1=rat(d.first[1]),x2=rat(d.second[0]),y2=rat(d.second[1]);return reduce((y2.n*y1.d-y1.n*y2.d)*x1.d*x2.d,(x2.n*x1.d-x1.n*x2.d)*y1.d*y2.d);}if(candidate.kind==="output-change"){const rate=rat(d.rate),delta=rat(d.deltaInput);return reduce(rate.n*delta.n,rate.d*delta.d);}if(candidate.kind==="start-from-point"){const output=rat(d.output),rate=rat(d.rate),input=rat(d.input);return reduce(output.n*rate.d*input.d-rate.n*input.n*output.d,output.d*rate.d*input.d);}throw new Error("UNKNOWN_KIND");}

test("6.EE.C contains three balanced twelve-item sections and eight recheck structures",function(){
  assert.equal(source.validatePack(),true);assert.equal(source.pack.workbookItems.length,36);assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["relationships","tables","graphs"].map(function(section){return[section,source.pack.workbookItems.filter(function(item){return item.section===section;}).length];})),{relationships:12,tables:12,graphs:12});
  assert.equal(new Set(source.pack.recheckItems.map(function(item){return item.strand;})).size,8);
});

test("all 44 answers match the fixed ledger and an independent exact rational calculation",function(){
  assert.equal(Object.keys(expected).length,44);all().forEach(function(candidate){assert.equal(source.formatResult(candidate),expected[candidate.id],candidate.id);assert.equal(calc(candidate),expected[candidate.id],candidate.id);assert.equal(source.evaluateResponse(candidate,expected[candidate.id]),true,candidate.id);assert.equal(source.evaluateResponse(candidate,"999999"),false,candidate.id);});
});

test("graph models are point-derived, bounded, and do not place an answer target on the student graph",function(){
  const graphItems=all().filter(function(item){return item.data.graph;});assert.equal(graphItems.length,13);
  graphItems.forEach(function(candidate){const graph=candidate.data.graph;const xValues=graph.points.map(function(point){return Number(point[0].numerator)/Number(point[0].denominator||1);});assert.equal(new Set(xValues).size,xValues.length,candidate.id);const student=source.renderVisual(candidate,"en","student");assert.match(student,/eec-coordinate-plane/);assert.match(student,/eec-relation-line/);assert.match(student,/eec-graph-point/);if(candidate.kind==="start-from-point")assert.doesNotMatch(student,/\(0, /,candidate.id);});
});

test("public rights, Grade 6 learner fit, locales, and teacher boundary remain explicit",function(){
  assert.equal(source.pack.rights.assetRights,"original");assert.equal(source.pack.contentOrigin,"gfield-original-authored-public-unit-workbook");assert.match(source.pack.scopeNotice.en,/teacher separately reviews/i);assert.match(source.pack.scopeNotice.en,/does not determine full mastery, placement, or promotion/i);assert.match(source.pack.teacherObservation.en,/roles in the situation/i);all().forEach(function(candidate){assert.deepEqual(candidate.standardIds,["6.EE.C.9"],candidate.id);assert.deepEqual(Object.keys(candidate.prompt).sort(),["en","ko","zh-Hans"],candidate.id);assert.equal(Object.prototype.hasOwnProperty.call(candidate,"answer"),false,candidate.id);});
});
