"use strict";
const assert=require('node:assert/strict'),m=require('./source-5-2-u3-page24-exploration1.js');
const sets=new Set();
for(let i=0;i<3;i++)for(const d of [-1,0,1]){
 const q=m.build(i,d),cases=q.questionModel.cases;
 const expected=cases.map((c,j)=>['sss','sas','asa'].includes(c.kind)?j+1:null).filter(x=>x!==null);
 assert.deepEqual(q.answerModel.uniqueCases,expected);assert.deepEqual(q.questionModel.uniqueCases,expected);
 const marks=['①','②','③','④','⑤','⑥'];assert.equal(q.answer,expected.map(n=>marks[n-1]).join(', '));
 for(const n of expected)assert(q.solution.includes(marks[n-1]));
 const ssa=cases.find(c=>c.kind==='ssa'),theta=ssa.angle*Math.PI/180;
 const projection=ssa.adjacent*Math.cos(theta),height=ssa.adjacent*Math.sin(theta),disc=ssa.opposite**2-height**2;
 assert(disc>0);const roots=[projection-Math.sqrt(disc),projection+Math.sqrt(disc)];assert(roots.every(x=>x>0));assert(Math.abs(roots[0]-roots[1])>1e-6);
 for(const x of roots)assert(Math.abs(Math.hypot(x*Math.cos(theta)-ssa.adjacent,x*Math.sin(theta))-ssa.opposite)<1e-9);
 const one=cases.find(c=>c.kind==='one-side-two-angles'),angles=[...one.angles,180-one.angles[0]-one.angles[1]];assert.equal(new Set(angles).size,3);
 const sss=cases.find(c=>c.kind==='sss').sides.slice().sort((a,b)=>a-b);assert(sss[0]+sss[1]>sss[2]);
 assert.equal((q.prompt.match(/<li>/g)||[]).length,6);sets.add(q.answer);
}
assert.equal(sets.size,3);assert.equal(m.deriveOriginal,undefined);console.log('Exploration 1: six cases, two SSA constructions, varied positions verified');
