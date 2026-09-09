"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const source=require("../learning/grade6-g-a-unit-workbook.js");

const expected={
  "gau-w01":"40","gau-w02":"27","gau-w03":"50","gau-w04":"73","gau-w05":"42","gau-w06":"72","gau-w07":"66","gau-w08":"30","gau-w09":"56",
  "gau-w10":"60","gau-w11":"10","gau-w12":"35/4","gau-w13":"21/2","gau-w14":"20","gau-w15":"22","gau-w16":"21","gau-w17":"8","gau-w18":"14",
  "gau-w19":"8","gau-w20":"9","gau-w21":"24","gau-w22":"9","gau-w23":"9","gau-w24":"35","gau-w25":"9","gau-w26":"7","gau-w27":"40",
  "gau-w28":"52","gau-w29":"62","gau-w30":"108","gau-w31":"108","gau-w32":"82","gau-w33":"180","gau-w34":"158","gau-w35":"124","gau-w36":"168",
  "gau-r01":"58","gau-r02":"52","gau-r03":"84","gau-r04":"21/2","gau-r05":"11","gau-r06":"10","gau-r07":"42","gau-r08":"216"
};
function all(){return source.pack.workbookItems.concat(source.pack.recheckItems);}
function rat(value){return{n:BigInt(value.numerator),d:BigInt(value.denominator==null?1:value.denominator)};}
function reduce(n,d){if(d<0n){n=-n;d=-d;}let a=n<0n?-n:n,b=d;while(b){const next=a%b;a=b;b=next;}a=a||1n;n/=a;d/=a;return d===1n?String(n):n+"/"+d;}
function multiply(a,b){return{n:a.n*b.n,d:a.d*b.d};}
function add(a,b){return{n:a.n*b.d+b.n*a.d,d:a.d*b.d};}
function polygon(points){let twice=0n;for(let index=0;index<points.length;index+=1){const a=points[index],b=points[(index+1)%points.length];twice+=BigInt(a[0])*BigInt(b[1])-BigInt(b[0])*BigInt(a[1]);}return reduce(twice<0n?-twice:twice,2n);}
function calc(candidate){const d=candidate.data;if(candidate.kind==="polygon-area"||candidate.kind==="coordinate-rectangle-area")return polygon(d.points);if(candidate.kind==="triangle-area")return reduce(BigInt(d.base.numerator)*BigInt(d.height.numerator),2n*BigInt(d.base.denominator)*BigInt(d.height.denominator));if(candidate.kind==="trapezoid-area")return reduce((BigInt(d.firstBase.numerator)*BigInt(d.secondBase.denominator)+BigInt(d.secondBase.numerator)*BigInt(d.firstBase.denominator))*BigInt(d.height.numerator),2n*BigInt(d.firstBase.denominator)*BigInt(d.secondBase.denominator)*BigInt(d.height.denominator));if(candidate.kind==="prism-volume")return reduce(BigInt(d.length.numerator)*BigInt(d.width.numerator)*BigInt(d.height.numerator),BigInt(d.length.denominator)*BigInt(d.width.denominator)*BigInt(d.height.denominator));if(candidate.kind==="axis-side-length"){const axis=candidate.data.axis==="horizontal"?0:1;return String(Math.abs(d.second[axis]-d.first[axis]));}if(candidate.kind==="rectangular-prism-surface-area"){const l=rat(d.length),w=rat(d.width),h=rat(d.height),sum=add(add(multiply(l,w),multiply(l,h)),multiply(w,h));return reduce(2n*sum.n,sum.d);}if(candidate.kind==="triangular-prism-surface-area"){const sides=d.triangleSides.map(rat),perimeter=sides.reduce(add),base=reduce(BigInt(d.triangleBase.numerator)*BigInt(d.triangleHeight.numerator),2n*BigInt(d.triangleBase.denominator)*BigInt(d.triangleHeight.denominator));const baseParts={n:2n*BigInt(base.split("/")[0]),d:BigInt(base.includes("/")?base.split("/")[1]:1)},l=rat(d.prismLength),lateral=multiply(perimeter,l);return reduce(baseParts.n*lateral.d+lateral.n*baseParts.d,baseParts.d*lateral.d);}throw new Error("UNKNOWN_KIND");}

test("6.G.A has four balanced nine-item strands and eight named recheck structures",function(){
  assert.equal(source.validatePack(),true);assert.equal(source.pack.workbookItems.length,36);assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(Object.fromEntries(["area","volume","coordinates","nets"].map(function(section){return[section,source.pack.workbookItems.filter(function(item){return item.section===section;}).length];})),{area:9,volume:9,coordinates:9,nets:9});
  assert.equal(new Set(source.pack.recheckItems.map(function(item){return item.recheckStructure;})).size,8);
});

test("all 44 answers match the fixed ledger and independent geometry calculation",function(){
  assert.equal(Object.keys(expected).length,44);all().forEach(function(candidate){assert.equal(source.formatResult(candidate),expected[candidate.id],candidate.id);assert.equal(calc(candidate),expected[candidate.id],candidate.id);assert.equal(source.evaluateResponse(candidate,expected[candidate.id]),true,candidate.id);assert.equal(source.evaluateResponse(candidate,"999999"),false,candidate.id);});
});

test("polygon and coordinate figures are derived from declared point models",function(){
  all().filter(function(candidate){return ["polygon-area","coordinate-rectangle-area"].includes(candidate.kind);}).forEach(function(candidate){const points=candidate.data.points;assert.equal(new Set(points.map(function(point){return point.join(",");})).size,points.length,candidate.id);assert.match(source.renderVisual(candidate,"en","student"),/clinic-geometry-svg/);assert.match(source.renderVisual(candidate,"en","student"),/<polygon /);});
});

test("public rights, learner boundary, localization, and teacher answers are explicit",function(){
  assert.equal(source.pack.rights.assetRights,"original");assert.equal(source.pack.contentOrigin,"gfield-original-authored-public-unit-workbook");assert.match(source.pack.scopeNotice.en,/does not determine full mastery, placement, or promotion/i);assert.match(source.pack.teacherObservation.en,/Do not infer/i);all().forEach(function(candidate){assert.match(candidate.standardIds[0],/^6\.G\.A\.[1-4]$/,candidate.id);assert.deepEqual(Object.keys(candidate.prompt).sort(),["en","ko","zh-Hans"],candidate.id);assert.equal(Object.prototype.hasOwnProperty.call(candidate,"answer"),false,candidate.id);});
});
