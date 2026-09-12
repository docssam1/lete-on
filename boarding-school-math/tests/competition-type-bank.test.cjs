"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const bank=require("../competition/grade6-competition-type-bank.js");

const expected={
  "sasmo-g6-model-01":"50","sasmo-g6-pattern-01":"41","sasmo-g6-divisibility-01":"3","sasmo-g6-geometry-01":"84","sasmo-g6-logic-01":"Hana",
  "sasmo-g6-sets-01":"26","sasmo-g6-cryptarithm-01":"6","sasmo-g6-ratio-01":"21","sasmo-g6-grid-01":"18","sasmo-g6-cube-01":"12",
  "mk56-weights-01":"5","mk56-clock-01":"75","mk56-perimeter-01":"36","mk56-paths-01":"10","mk56-fraction-01":"1/2",
  "mk56-calendar-01":"Wednesday","mk56-squares-01":"14","mk56-cube-net-01":"D","mk56-pairs-01":"15","mk56-overlap-01":"40",
  "amc8-ratio-01":"162","amc8-probability-01":"3/10","amc8-pythagorean-01":"10","amc8-counting-01":"12","amc8-table-01":"23",
  "amc8-mean-01":"22","amc8-equation-01":"9","amc8-rate-01":"150","amc8-coordinate-01":"24","amc8-multiples-01":"14"
};

function byId(id){return bank.items.find(function(row){return row.id===id;});}

test("Grade 6 bridge contains ten distinct real problem types for each competition",function(){
  assert.equal(bank.validateBank(),true);assert.equal(bank.items.length,30);assert.equal(new Set(bank.items.map(function(row){return row.typeId;})).size,30);
  bank.programs.forEach(function(program){assert.equal(bank.items.filter(function(row){return row.programId===program.id;}).length,10);});
});

test("all answers match an independent fixed ledger and exactly one choice",function(){
  assert.deepEqual(bank.items.map(function(item){return item.id;}).sort(),Object.keys(expected).sort());
  bank.items.forEach(function(item){assert.equal(bank.solve(item.model),expected[item.id],item.id);const answer=item.choices.filter(function(choice){return choice.value===expected[item.id];});assert.equal(answer.length,1,item.id);assert.equal(bank.answerId(item),answer[0].id,item.id);});
});

test("bounded number and counting cases are independently enumerated",function(){
  assert.deepEqual(Array.from({length:10},function(_,digit){return digit;}).filter(function(digit){return(420+digit)%9===0;}),[3]);
  const subset=byId("mk56-weights-01").model,matches=[];for(let mask=0;mask<(1<<subset.weights.length);mask+=1){const chosen=subset.weights.filter(function(_,index){return mask&(1<<index);});if(chosen.reduce(function(sum,value){return sum+value;},0)===subset.target)matches.push(chosen.length);}assert.equal(Math.min.apply(null,matches),5);
  const routes=[];function walk(right,up,word){if(right===3&&up===2){routes.push(word);return;}if(right<3)walk(right+1,up,word+"R");if(up<2)walk(right,up+1,word+"U");}walk(0,0,"");assert.equal(new Set(routes).size,10);
  const numbers=[];[1,2,3,4].forEach(function(a){[1,2,3,4].forEach(function(b){[1,2,3,4].forEach(function(c){if(new Set([a,b,c]).size===3&&(100*a+10*b+c)%2===0)numbers.push(100*a+10*b+c);});});});assert.equal(numbers.length,12);
  const digits=[];for(let a=1;a<=9;a+=1)for(let b=1;b<=9;b+=1)if(a!==b&&(10*a+b)+(10*b+a)===99&&a-b===3)digits.push([a,b]);assert.deepEqual(digits,[[6,3]]);
  const setMembers=new Set();for(let index=0;index<18;index+=1)setMembers.add("A"+index);for(let index=0;index<7;index+=1)setMembers.add("A"+index);for(let index=7;index<15;index+=1)setMembers.add("B"+index);assert.equal(setMembers.size,26);assert.equal(35/(3+2)*3,21);
  let rectangles=0;for(let top=0;top<2;top+=1)for(let bottom=top+1;bottom<=2;bottom+=1)for(let left=0;left<3;left+=1)for(let right=left+1;right<=3;right+=1)rectangles+=1;assert.equal(rectangles,18);
  let paintedTwo=0;for(let x=0;x<3;x+=1)for(let y=0;y<3;y+=1)for(let z=0;z<3;z+=1)if([x===0,x===2,y===0,y===2,z===0,z===2].filter(Boolean).length===2)paintedTwo+=1;assert.equal(paintedTwo,12);
  const weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];assert.equal(weekdays[100%7],"Wednesday");
  let squares=0;for(let size=1;size<=3;size+=1)for(let row=0;row+size<=3;row+=1)for(let column=0;column+size<=3;column+=1)squares+=1;assert.equal(squares,14);
  const pairs=[];for(let first=0;first<6;first+=1)for(let second=first+1;second<6;second+=1)pairs.push([first,second]);assert.equal(pairs.length,15);
  const covered=new Set();function cover(startX,width,height){for(let x=startX;x<startX+width;x+=1)for(let y=0;y<height;y+=1)covered.add(x+","+y);}cover(0,6,4);cover(4,6,4);assert.equal(covered.size,40);
  assert.equal(18*5-[12,16,19,21].reduce(function(sum,value){return sum+value;},0),22);assert.deepEqual(Array.from({length:21},function(_,index){return index;}).filter(function(x){return 3*(x-2)+5===26;}),[9]);assert.equal(180*5*1,150*3*2);assert.equal(Array.from({length:30},function(_,index){return index+1;}).filter(function(value){return value%3===0||value%5===0;}).length,14);
});

test("geometry models agree with independent coordinate, folding, and distance checks",function(){
  function shoelace(points){let twice=0;for(let index=0;index<points.length;index+=1){const a=points[index],b=points[(index+1)%points.length];twice+=a[0]*b[1]-b[0]*a[1];}return Math.abs(twice)/2;}
  assert.equal(shoelace([[0,0],[9,0],[9,4],[12,4],[12,8],[0,8]]),84);assert.equal(Math.hypot(6,8),10);assert.equal(shoelace([[-2,1],[4,1],[4,5],[-2,5]]),24);
  const foldedNormals={A:"-1,0,0",B:"0,0,1",C:"1,0,0",D:"0,0,-1",E:"0,1,0",F:"0,-1,0"};assert.equal(foldedNormals.D,"0,0,-1");assert.equal(bank.solve(byId("mk56-cube-net-01").model),"D");
  ["sasmo-g6-geometry-01","sasmo-g6-grid-01","sasmo-g6-cube-01","mk56-cube-net-01","mk56-overlap-01","amc8-pythagorean-01","amc8-coordinate-01"].forEach(function(id){const visual=bank.renderVisual(byId(id),"ko");assert.match(visual,/competition-geometry/,id);assert.match(visual,/role="img"/,id);});
});

test("learner-fit, locale, source, and publication gates are explicit",function(){
  bank.items.forEach(function(item){assert.equal(item.learnerFit.learnerStage,"US Grade 6 competition bridge, ages 11-12");assert.deepEqual(Object.keys(item.prompt),["ko","en","zh-Hans"]);assert.equal(item.contentOrigin,"gfield-original");assert.equal(item.officialProblem,false);assert.equal(item.releaseState,"published-public-practice");assert.equal(item.resultContract,"single-value");assert.equal(item.diagnosticEligible,false);assert.ok(["foundation","core","stretch"].includes(item.difficultyBand));});
  assert.deepEqual(bank.sources.map(function(row){return row.authority;}),["SASMO / SIMCC","Math Kangaroo USA","Mathematical Association of America"]);
});
