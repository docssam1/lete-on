"use strict";
const assert=require("node:assert/strict"),models=require("./source-6-2-painted-mission3-models.js"),contracts=require("./source-6-2-painted-mission3-contracts.js");
let count=0;
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
  const q=contracts.generate(variant,level),m=models.solve(variant);
  assert.equal(q.answer,String(10*m.A+m.B));assert.equal(q.model.conditionPolicy.bottomFacesPainted,false);assert(q.prompt.includes("바닥 부분은 색칠하지 않습니다"));
  for(let y=0;y<3;y++)assert(q.prompt.includes(`${y+1}층에 ${m.layerCounts[y]}개`));
  assert.equal(Boolean(q.clue),level===0);assert.equal(q.prompt.includes(`㉮는 ${m.A}입니다`),level===0);
  assert.equal(Boolean(q.secondary),level===2);if(q.secondary)assert.equal(q.secondary.answer,m.histogram[5]);
  assert(q.prompt.includes("10×㉮+㉯"));assert(!/[<>]/.test(q.answer));assert(!q.prompt.includes("<svg") && !q.prompt.includes("<img"));
  assert.equal(q.officialAnswerVerified,false);assert.equal(q.learnerReleaseVerified,false);assert.equal(q.difficultyDesign.empiricallyCalibrated,false);
  assert(q.solution.includes(`10×${m.A}+${m.B}=${m.answer}`));assert.throws(()=>q.model.heights[0][2]++,TypeError);count++;
}
for(const level of [-1,3,.5,NaN,Infinity,"0",null])assert.throws(()=>contracts.generate(0,level));
console.log(JSON.stringify({status:"passed",contracts:count,invalidLevels:7,sourceAnswer:contracts.generate(0,1).answer,learnerReleaseVerified:false}));
