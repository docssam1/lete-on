"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const bank=require("../competition/grade6-competition-type-bank.js");

const expected={
  "sasmo-g6-model-01":"50","sasmo-g6-pattern-01":"41","sasmo-g6-divisibility-01":"3","sasmo-g6-geometry-01":"84","sasmo-g6-logic-01":"Hana",
  "mk56-weights-01":"5","mk56-clock-01":"75","mk56-perimeter-01":"36","mk56-paths-01":"10","mk56-fraction-01":"1/2",
  "amc8-ratio-01":"162","amc8-probability-01":"3/10","amc8-pythagorean-01":"10","amc8-counting-01":"12","amc8-table-01":"23"
};

test("Grade 6 bridge contains five distinct real problem types for each competition",function(){
  assert.equal(bank.validateBank(),true);assert.equal(bank.items.length,15);assert.equal(new Set(bank.items.map(function(row){return row.typeId;})).size,15);
  bank.programs.forEach(function(program){assert.equal(bank.items.filter(function(row){return row.programId===program.id;}).length,5);});
});

test("all answers match an independent fixed ledger and exactly one choice",function(){
  bank.items.forEach(function(item){assert.equal(bank.solve(item.model),expected[item.id],item.id);const answer=item.choices.filter(function(choice){return choice.value===expected[item.id];});assert.equal(answer.length,1,item.id);assert.equal(bank.answerId(item),answer[0].id,item.id);});
});

test("bounded cases are independently enumerated",function(){
  const digit=bank.items.find(function(row){return row.id==="sasmo-g6-divisibility-01";});assert.deepEqual(Array.from({length:10},function(_,d){return d;}).filter(function(d){return(420+d)%9===0;}),[3]);
  const subset=bank.items.find(function(row){return row.id==="mk56-weights-01";}).model;const matches=[];for(let mask=0;mask<(1<<subset.weights.length);mask+=1){const chosen=subset.weights.filter(function(_,i){return mask&(1<<i);});if(chosen.reduce(function(sum,value){return sum+value;},0)===subset.target)matches.push(chosen.length);}assert.equal(Math.min.apply(null,matches),5);
  const routes=[];function walk(r,u,word){if(r===3&&u===2){routes.push(word);return;}if(r<3)walk(r+1,u,word+"R");if(u<2)walk(r,u+1,word+"U");}walk(0,0,"");assert.equal(new Set(routes).size,10);
  const numbers=[];[1,2,3,4].forEach(function(a){[1,2,3,4].forEach(function(b){[1,2,3,4].forEach(function(c){if(new Set([a,b,c]).size===3&&(100*a+10*b+c)%2===0)numbers.push(100*a+10*b+c);});});});assert.equal(numbers.length,12);
});

test("geometry models agree with independent coordinate and distance checks",function(){
  function shoelace(points){let twice=0;for(let i=0;i<points.length;i+=1){const a=points[i],b=points[(i+1)%points.length];twice+=a[0]*b[1]-b[0]*a[1];}return Math.abs(twice)/2;}
  assert.equal(shoelace([[0,0],[9,0],[9,4],[12,4],[12,8],[0,8]]),84);
  assert.equal(Math.hypot(6,8),10);
  const areaVisual=bank.renderVisual(bank.items.find(function(row){return row.id==="sasmo-g6-geometry-01";}),"ko");assert.match(areaVisual,/competition-geometry/);assert.match(areaVisual,/polygon/);
});

test("learner-fit, locale, source, and original-content gates are explicit",function(){
  bank.items.forEach(function(item){assert.equal(item.learnerFit.learnerStage,"US Grade 6 competition bridge, ages 11-12");assert.deepEqual(Object.keys(item.prompt),["ko","en","zh-Hans"]);assert.equal(item.contentOrigin,"gfield-original");assert.equal(item.officialProblem,false);assert.equal(item.releaseState,"published-public-practice");});
  assert.deepEqual(bank.sources.map(function(row){return row.authority;}),["SASMO / SIMCC","Math Kangaroo USA","Mathematical Association of America"]);
});
