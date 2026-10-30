'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-page26-example23-synthetic.js');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),ang=(a,b,c)=>{const u=[a.x-b.x,a.y-b.y],v=[c.x-b.x,c.y-b.y];return Math.acos((u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v))*180/Math.PI};
for(let i=0;i<3;i++)for(const d of [-1,0,1]){const p=api.derive(i),q=api.build(i,d);for(const [a,b] of [[p.G,p.N],[p.N,p.D],[p.D,p.G]])assert(Math.abs(dist(a,b)-p.a)<1e-9);for(const [a,b] of [[p.D,p.R],[p.R,p.M],[p.M,p.D]])assert(Math.abs(dist(a,b)-p.b)<1e-9);assert(Math.abs(ang(p.G,p.D,p.R)-120)<1e-9);assert(Math.abs(ang(p.N,p.D,p.M)-120)<1e-9);assert.equal(q.answer,['①','②','③','④'][p.order.indexOf(0)]);assert.match(q.solution,/△ㄱㄷㄹ≅△ㄴㄷㅁ/);assert(!q.prompt.includes('정답'));}
assert.equal(api.generate({generatorKey:api.key,sourceVerified:false,reviewLocked:true},0,0,0,0),null);console.log('PASS: 3 × 3, equilateral sides, included angles, and unique choice verified');
