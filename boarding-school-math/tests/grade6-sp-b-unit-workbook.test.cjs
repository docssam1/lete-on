"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const source = require("../learning/grade6-sp-b-unit-workbook.js");

function gcd(left,right){let a=BigInt(left)<0n?-BigInt(left):BigInt(left);let b=BigInt(right)<0n?-BigInt(right):BigInt(right);while(b){const rest=a%b;a=b;b=rest;}return a||1n;}
function rat(numerator,denominator=1){let n=BigInt(numerator),d=BigInt(denominator);if(d<0n){n=-n;d=-d;}const divisor=gcd(n,d);return{n:n/divisor,d:d/divisor};}
function add(left,right){return rat(left.n*right.d+right.n*left.d,left.d*right.d);}
function sub(left,right){return rat(left.n*right.d-right.n*left.d,left.d*right.d);}
function abs(value){return rat(value.n<0n?-value.n:value.n,value.d);}
function format(value){return value.d===1n?String(value.n):`${value.n}/${value.d}`;}
function ordered(values){return values.slice().sort(function(left,right){return left-right;});}
function mean(values){return rat(values.reduce(function(sum,value){return sum+value;},0),values.length);}
function median(values){const valuesInOrder=ordered(values),middle=Math.floor(valuesInOrder.length/2);return valuesInOrder.length%2?rat(valuesInOrder[middle]):rat(valuesInOrder[middle-1]+valuesInOrder[middle],2);}
function fiveNumber(values){const valuesInOrder=ordered(values),middle=Math.floor(valuesInOrder.length/2),lower=valuesInOrder.slice(0,middle),upper=valuesInOrder.slice(valuesInOrder.length%2?middle+1:middle);return{min:rat(valuesInOrder[0]),q1:median(lower),median:median(valuesInOrder),q3:median(upper),max:rat(valuesInOrder.at(-1))};}
function statistic(values,metric){if(metric==="observations")return rat(values.length);if(metric==="mean")return mean(values);if(metric==="median")return median(values);if(metric==="mad"){const center=mean(values);return rat(values.reduce(function(total,value){return add(total,abs(sub(rat(value),center)));},rat(0)).n,values.reduce(function(total,value){return add(total,abs(sub(rat(value),center)));},rat(0)).d*BigInt(values.length));}const five=fiveNumber(values);if(five[metric])return five[metric];if(metric==="iqr")return sub(five.q3,five.q1);if(metric==="range")return sub(five.max,five.min);throw new Error("unsupported metric");}
function bins(data){const counts=Array(data.count).fill(0);data.values.forEach(function(value){const index=Math.floor((value-data.start)/data.width);assert.ok(index>=0&&index<data.count);counts[index]+=1;});return counts;}
function independentNumeric(item){const data=item.data;if(item.kind==="dot-plot"){if(data.operation==="frequency")return rat(data.values.filter(function(value){return value===data.target;}).length);if(data.operation==="observations")return rat(data.values.length);if(data.operation==="mode"){const counts=new Map();data.values.forEach(function(value){counts.set(value,(counts.get(value)||0)+1);});const highest=Math.max(...counts.values()),matches=[...counts].filter(function(entry){return entry[1]===highest;});assert.equal(matches.length,1,item.id);return rat(matches[0][0]);}return rat(data.values.filter(function(value){return value>=data.lower&&value<=data.upper;}).length);}if(item.kind==="histogram"&&data.operation!=="largest-bin"){const counts=bins(data);if(data.operation==="bin-count")return rat(counts[data.targetBin]);if(data.operation==="total")return rat(counts.reduce(function(sum,value){return sum+value;},0));return rat(counts.slice(data.firstBin,data.lastBin+1).reduce(function(sum,value){return sum+value;},0));}if(item.kind==="box-plot"||item.kind==="summary-statistic")return statistic(data.values,data.metric);return null;}
function independentChoice(item){if(item.kind==="histogram"){const counts=bins(item.data),highest=Math.max(...counts);assert.equal(counts.filter(function(value){return value===highest;}).length,1,item.id);return `B${counts.indexOf(highest)}`;}if(item.kind==="attribute-unit"){const matches=item.choices.filter(function(choice){return choice.attributeKey===item.data.attributeKey&&choice.unitKey===item.data.unitKey;});assert.equal(matches.length,1,item.id);return matches[0].id;}if(item.kind==="measure-selection")return item.data.shape==="skewed-outlier"?"MEDIAN_IQR":"MEAN_MAD";if(item.kind==="summary-statement"){const five=fiveNumber(item.data.values),q3=Number(five.q3.n)/Number(five.q3.d),iqr=statistic(item.data.values,"iqr"),fence=q3+1.5*Number(iqr.n)/Number(iqr.d),striking=item.data.values.filter(function(value){return value>fence;});assert.equal(striking.length,1,item.id);const expected={observations:item.data.values.length,unitKey:item.data.unitKey,centerMetric:item.data.centerMetric,centerValue:format(statistic(item.data.values,item.data.centerMetric)),spreadMetric:item.data.spreadMetric,spreadValue:format(statistic(item.data.values,item.data.spreadMetric)),strikingValue:striking[0]};const matches=item.choices.filter(function(choice){return Object.keys(expected).every(function(key){return String(choice.claims[key])===String(expected[key]);});});assert.equal(matches.length,1,item.id);return matches[0].id;}throw new Error(`unsupported choice ${item.id}`);}

test("6.SP.B is a 36-item printable workbook with a distinct 8-item recheck",function(){
  assert.equal(source.validatePack(),true);
  assert.equal(source.pack.workbookItems.length,36);
  assert.equal(source.pack.recheckItems.length,8);
  assert.deepEqual(source.pack.printPlan.paperSizes,["A4","Letter"]);
  assert.equal(source.pack.printPlan.studentPages,12);
  assert.equal(source.pack.contentOrigin,"gfield-original-authored-public-unit-workbook");
  assert.equal(source.pack.rights.containsThirdPartyAssets,false);
  assert.deepEqual(source.pack.standardsAlignment.assessed,["6.SP.B.4","6.SP.B.5"]);
  assert.match(source.pack.sourceReferences[0].url,/corestandards\.org/);
  assert.equal(source.pack.sourceReferences[0].page,45);
});

test("the 36-item sequence balances plots, summaries, and contextual decisions",function(){
  const counts=Object.fromEntries(["dot-plots","histograms","box-plots","summaries","context"].map(function(section){return[section,source.pack.workbookItems.filter(function(item){return item.section===section;}).length];}));
  assert.deepEqual(counts,{"dot-plots":8,histograms:8,"box-plots":8,summaries:8,context:4});
  assert.equal(new Set(source.pack.recheckItems.map(function(item){return item.strand;})).size,5);
  const workbookStructures=new Set(source.pack.workbookItems.map(function(item){return item.kind+":"+item.data.values.join(",");}));
  source.pack.recheckItems.forEach(function(item){assert.equal(workbookStructures.has(item.kind+":"+item.data.values.join(",")),false,item.id);});
});

test("all 44 answers agree with an independent exact calculation",function(){
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function(item){
    const numeric=independentNumeric(item);
    const expected=numeric?format(numeric):independentChoice(item);
    assert.equal(source.solveItem(item),expected,item.id);
    if(Array.isArray(item.choices))assert.equal(item.choices.filter(function(choice){return choice.id===expected;}).length,1,item.id);
    else assert.equal(source.evaluateResponse(item,expected),true,item.id);
  });
});

test("fraction and decimal responses are equivalent without accepting nearby values",function(){
  ["spb-w28","spb-r06"].forEach(function(id){const item=source.pack.workbookItems.concat(source.pack.recheckItems).find(function(candidate){return candidate.id===id;});assert.equal(source.solveItem(item),"12/5");assert.equal(source.evaluateResponse(item,"12/5"),true);assert.equal(source.evaluateResponse(item,"2.4"),true);assert.equal(source.evaluateResponse(item,"2.5"),false);});
});

test("every item has reviewed Grade 6 learner fit and complete natural-language copy",function(){
  source.pack.workbookItems.concat(source.pack.recheckItems).forEach(function(item){
    assert.equal(item.learnerFit.grade,"US Grade 6",item.id);
    assert.equal(item.learnerFit.status,"reviewed",item.id);
    assert.equal(item.evidenceBoundary,"supporting-auto-check",item.id);
    ["ko","en","zh-Hans"].forEach(function(locale){assert.ok(item.prompt[locale],`${item.id} prompt ${locale}`);assert.ok(item.question[locale],`${item.id} question ${locale}`);assert.ok(source.solutionFor(item,locale),`${item.id} solution ${locale}`);assert.ok(source.hintFor(item,locale),`${item.id} hint ${locale}`);});
  });
  const korean=JSON.stringify(source.pack);
  assert.doesNotMatch(korean,/예상되는 변이|학생이나 관측마다 달라질 양|중심 측도|변이 측도/);
  assert.match(source.pack.scopeNotice.ko,/자동 점수만으로 완전 숙달·배치·승급을 결정하지 않습니다/);
  assert.match(source.pack.scopeNotice.en,/Auto scores alone do not determine full mastery, placement, or promotion/);
  assert.match(source.pack.scopeNotice["zh-Hans"],/不能只凭自动得分判断完全掌握、分班或晋级/);
});

test("SVG plots are generated from item data and blank construction prompts do not draw answer marks",function(){
  const all=source.pack.workbookItems.concat(source.pack.recheckItems);
  all.forEach(function(item){const html=source.renderVisual(item,"en");assert.match(html,/class="spb-visual"/,item.id);assert.match(html,/spb-context/,item.id);assert.doesNotMatch(html,/teacher-key|solutionFor|expectedResponse/,item.id);});
  all.filter(function(item){return item.kind==="dot-plot"&&!item.data.showPlot;}).forEach(function(item){const html=source.renderVisual(item,"en");assert.equal((html.match(/<circle /g)||[]).length,0,item.id);assert.match(html,/spb-data-strip/,item.id);});
  all.filter(function(item){return item.kind==="dot-plot"&&item.data.showPlot;}).forEach(function(item){const html=source.renderVisual(item,"en");assert.equal((html.match(/<circle /g)||[]).length,item.data.values.length,item.id);});
  all.filter(function(item){return item.kind==="histogram";}).forEach(function(item){const html=source.renderVisual(item,"en");assert.equal((html.match(/<rect /g)||[]).length,item.data.count,item.id);});
  all.filter(function(item){return item.kind==="box-plot"&&item.data.showPlot;}).forEach(function(item){const html=source.renderVisual(item,"en");assert.equal((html.match(/<rect /g)||[]).length,1,item.id);assert.equal((html.match(/spb-median/g)||[]).length,1,item.id);assert.match(html,/role="img"/,item.id);});
});

test("teacher performance evidence is separate from automatic scores",function(){
  assert.deepEqual(source.pack.standardsAlignment.teacherObserved,["independent plot construction","contextual written summary","measure-choice justification"]);
  assert.match(source.pack.teacherObservation.ko,/점그래프.*히스토그램.*상자그림/);
  assert.match(source.pack.teacherObservation.en,/independently construct/);
  assert.match(source.pack.reflectionPrompt.ko,/점그래프로 나타내고/);
  assert.match(source.pack.reflectionPrompt.ko,/교사는 눈금과 점의 수, 계산, 맥락 설명을 확인/);
});
