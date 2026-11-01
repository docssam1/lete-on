"use strict";
const assert=require("node:assert/strict"), practice=require("./source-5-2-u5-page48-example14-practice.js");
const type={id:practice.id,generatorKey:practice.key,sourceVerified:true,reviewLocked:false};
const expected=[12,15,18,12];
const seenTotals=new Set();
for(let i=0;i<4;i++){
  const q=practice.generate(type,0,0,0,i),m=q.answerModel;
  assert.equal(q.verifiedVariantCount,4);
  assert(!seenTotals.has(m.total),"practice questions must not repeat");
  seenTotals.add(m.total);
  const candidates=[];
  for(let h=1;h<=100;h++)for(let w=1;w<=100;w++){
    const d=w-m.difference;
    if(d>0&&w===m.ratio*h&&2*(w+d)+2*(w+h)+2*(d+h)===m.total)candidates.push(w);
  }
  assert.deepEqual(candidates,[expected[i]]);
  assert.equal(q.answer,`${expected[i]}cm`);
  assert.notEqual(m.total,120);
  assert.match(q.prompt,/세 방향/);
  assert.match(q.solution,new RegExp(`${expected[i]}cm`));
}
assert.equal(practice.generate({...type,reviewLocked:true},0,0,0,0),null);
console.log("PASS: four synthetic rope exercises have unique independently enumerated answers");
