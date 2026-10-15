"use strict";
const assert=require("node:assert/strict"),contracts=require("./source-6-2-painted-mission5-contracts.js");
let cases=0;
for(const id of contracts.sourceItemIds)for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
  const q=contracts.generate(id,variant,level),edge=[6,3,9][variant],volume=id.endsWith("-1"),amount=volume?35*edge*edge*edge:86*edge*edge;
  assert.equal(q.answer,`${amount} ${volume?"cm³":"cm²"}`);assert.equal(q.model.areaOfExactlyTwoPaintedFaces,16*edge*edge);
  assert(q.prompt.includes(`${16*edge*edge} cm²`));assert(q.prompt.includes("35개"));assert(q.prompt.includes("밑면을 제외"));assert(!/root|sqrt|제곱근|세제곱|\^|<svg|<table|7560|3096/.test(q.prompt));
  assert.equal(q.secondary?.answer,level===2?65*edge*edge:undefined);assert.equal(q.clue?.exactlyTwoPaintedCubes,level===0?8:undefined);
  assert.equal(q.model.surfaceArea-q.model.paintedArea,21*edge*edge);assert.equal(q.learnerReleaseVerified,false);assert(q.solution.includes(`${amount} ${volume?"cm³":"cm²"}`));cases++;
}
for(const value of [-1,3,null,1.5,NaN])assert.throws(()=>contracts.generate(contracts.sourceItemIds[0],0,value));
for(const id of ["6-2-u3-e3-mission-5","6-2-u3-e3-mission-3","",null])assert.throws(()=>contracts.generate(id,0,1));
console.log(JSON.stringify({status:"passed",contracts:cases,sourceVolume:7560,sourceSurface:3096,variants:3,normalizedTypes:2,registered:false}));
