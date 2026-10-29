'use strict';
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page25-mission5-synthetic.js');
const eps=1e-8;
for(let i=0;i<3;i++){
 const p=m.derive(i),r=p.angle*Math.PI/180;
 assert.ok(p.short<p.base);assert.equal(new Set(p.order).size,4);
 for(const x of p.roots){assert.ok(x>0);const g={x:x*Math.cos(r),y:x*Math.sin(r)};assert.ok(Math.abs(Math.hypot(g.x-p.base,g.y)-p.short)<eps)}
 assert.ok(Math.abs(p.roots[1]-p.roots[0])>eps);
 for(let d=-1;d<=1;d++){const q=m.build(i,d);assert.equal(q.answer,p.order.map((x,n)=>x!==2?['①','②','③','④'][n]:null).filter(Boolean).join(', '));assert.match(q.prompt,/항상 한 가지/);assert.match(q.solution,/서로 다른 두 삼각형/);assert.doesNotMatch(q.prompt,/정답/)}
}
console.log('PASS 3 configurations × 3 levels: two circle intersections, side conditions, choices');
