'use strict';
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page26-example21-synthetic.js');
for(let i=0;i<3;i++){const p=m.pools[i],x=m.derive(i),valid=[];for(let mask=0;mask<32;mask++){const v=p.filter((_,j)=>mask&(1<<j));if(v.length!==3)continue;const q=(v[0]+v[1]+v[2])/2,areaSquared=q*(q-v[0])*(q-v[1])*(q-v[2]);if(areaSquared>0)valid.push(v.join(','));}assert.deepEqual(x.yes.map(v=>v.join(',')).sort(),valid.sort());assert.equal(x.yes.length+x.no.length,10);for(let d=-1;d<=1;d++){const q=m.build(i,d);assert.equal(q.answer,`${valid.length}가지`);assert.match(q.solution,/같거나 작으면/);assert.doesNotMatch(q.prompt,/정답/);}}
console.log('PASS 3 pools × 3 levels; triangle triples independently checked by Heron area');
