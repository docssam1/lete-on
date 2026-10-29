'use strict';
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page26-example22-synthetic.js');
for(let i=0;i<3;i++){const p=m.pools[i],x=m.derive(i);let ordered=0;for(const a of p.angles)for(const b of p.angles)if(a!==b && 180-a-b>0)ordered++;assert.equal(x.count,ordered/2);assert.equal(x.yes.length+x.no.length,15);assert.ok(x.yes.length&&x.no.length);for(let d=-1;d<=1;d++){const q=m.build(i,d);assert.equal(q.answer,`${ordered/2}가지`);assert.match(q.solution,/180° 이상/);assert.match(q.prompt,/서로 다른 각 두 개/);assert.doesNotMatch(q.prompt,/정답/);}}
console.log('PASS 3 × 3: 45 unordered pairs independently checked via ordered pairs');
