'use strict';
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page28-example31-synthetic.js');
for(let i=0;i<m.pools.length;i++){
 const s=m.pools[i],expected=s*s/4;
 for(let a=0;a<360;a+=2){let shape=m.model(a,s);assert.ok(Math.abs(shape.area-expected)<0.0002);assert.ok(Math.abs(shape.sideDot)<1e-8)}
 for(let d=-1;d<=1;d++){let q=m.makeQuestion(i,d);assert.equal(q.answer,`${expected}cm²`);assert.match(q.solution,/90°/);assert.match(q.solution,/넓이가 같습니다/);assert.doesNotMatch(q.prompt,/정답/);assert.equal(q.publisherKeyVerified,false);assert.notEqual(s,6)}
}
console.log('PASS 3 × 3: quarter-area proof contract and 540 sampled rotations');
