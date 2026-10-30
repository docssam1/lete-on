"use strict";
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-page24-example14-synthetic.js');
const answers=new Set();
function angle(a,b,c){const u=[a.x-b.x,a.y-b.y],v=[c.x-b.x,c.y-b.y];return Math.acos((u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v));}
for(let i=0;i<3;i++)for(const d of [-1,0,1]){const p=api.derive(i),q=api.build(i,d);assert(p.c>p.a&&p.diag>p.c);assert(p.roots[0]>0&&p.roots[1]>p.roots[0]);assert.equal(new Set(p.order).size,5);assert.deepEqual([...p.order].sort(),[0,1,2,3,4]);for(const g of p.examples)assert(Math.abs(Math.hypot(g.x-p.R.x,g.y-p.R.y)-p.a)<1e-8);assert(Math.abs(angle(p.examples[0],p.N,p.D)-angle(p.examples[1],p.N,p.D))<1e-8);assert.equal(q.answer,p.answer);const mark=['①','②','③','④','⑤'][p.order.indexOf(3)];assert(q.solution.includes(`${mark}에서는 삼각형 ㄱㄹㄷ의 두 변 ㄱㄹ, ㄹㄷ과 그 사이 각 ㄱㄹㄷ이 정해집니다.`));assert.equal(q.answer.split(', ').length,4);assert(!q.prompt.includes('정답'));answers.add(q.answer);}
assert.equal(answers.size,3);assert.equal(api.generate({generatorKey:api.key,sourceVerified:false,reviewLocked:true},0,0,0,0),null);
console.log('Three synthetic quadrilateral pools: two distinct convex counterexamples and choice orders verified');
