'use strict';
// 2026-11-28 hw-G4-5-2: 초등 합동 조건(SSS·SAS·ASA)으로 통일해 SSA(긴 변의 대각)로 정해지는 선택지를 답에서 뺐다.
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page25-mission6-synthetic.js');
const d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`), angle=(a,b,c)=>{const x={x:a.x-b.x,y:a.y-b.y},y={x:c.x-b.x,y:c.y-b.y};return Math.acos((x.x*y.x+x.y*y.y)/Math.hypot(x.x,x.y)/Math.hypot(y.x,y.y))*180/Math.PI};
for(let i=0;i<3;i++){const p=m.derive(i);for(const w of p.w){near(d(w.N,w.D),p.L);near(d(w.N,w.G),p.a);near(d(w.G,w.R),p.b);near(angle(w.N,w.D,w.R),80)}
 near(d(p.w[0].N,p.w[0].R),d(p.w[1].N,p.w[1].R));near(angle(p.w[0].N,p.w[0].G,p.w[0].R),angle(p.w[1].N,p.w[1].G,p.w[1].R));near(angle(p.w[2].G,p.w[2].N,p.w[2].D),55);near(angle(p.w[3].G,p.w[3].N,p.w[3].D),55);near(d(p.w[2].G,p.w[2].D),d(p.w[3].G,p.w[3].D));for(const z of [-1,0,1]){const q=m.build(i,z);assert.equal(q.answer,p.answer);assert.match(q.prompt,/볼록한 사각형/);assert.match(q.solution,/서로 다른 볼록 사각형/);assert.equal(q.answer,['①','②','③','④','⑤','⑥'][p.order.indexOf(0)]);assert.match(q.prompt,/합동 조건/);assert.doesNotMatch(q.solution,/가능한 교점은 한 개/)} }
console.log('PASS 3 × 3: convex witnesses, angles, lengths and diagonal counterexamples');
