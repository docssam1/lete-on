"use strict";
const assert=require("node:assert/strict"),api=require("./source-5-2-u3-page24-example13-synthetic.js");
const answers=new Set();
for(let i=0;i<3;i++)for(const d of [-1,0,1]){
  const m=api.derive(i),q=api.build(i,d),theta=m.angle*Math.PI/180;
  assert.equal(new Set(m.order).size,4);
  assert.deepEqual([...m.order].sort(),[0,1,2,3]);
  assert(m.roots[0]>0&&m.roots[1]>m.roots[0]);
  for(const r of m.roots){const x=r*Math.cos(theta),y=r*Math.sin(theta);assert(Math.abs(Math.hypot(x-m.base,y)-m.opposite)<1e-9)}
  assert.equal(q.answer,m.answer);assert.equal(q.answer.split(", ").length,3);assert(q.prompt.includes(`data-pool-index="${i}"`));
  assert(!q.prompt.includes("정답"));answers.add(q.answer);
}
assert.equal(answers.size,3);
assert.equal(api.generate({generatorKey:api.key,sourceVerified:false,reviewLocked:true},0,0,0,0),null);
console.log("Three synthetic pools: answer order and two distinct SSA constructions verified at all difficulty levels");
