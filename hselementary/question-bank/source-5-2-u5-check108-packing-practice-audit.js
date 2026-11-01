"use strict";
const assert=require("node:assert/strict"),practice=require("./source-5-2-u5-check108-packing-practice.js");
const type={id:practice.id,generatorKey:practice.key,sourceVerified:true,reviewLocked:false};
const totals=[41,91,116,141];
for(let i=0;i<4;i++){
 const q=practice.generate(type,0,0,0,i),m=q.answerModel,s=m.scale,items=[];
 for(let x=0;x<4;x++)for(let y=0;y<4;y++)items.push([6*s*x,5*s*y,0,6*s,5*s,4*s]);
 for(let z=0;z<m.layers;z++)for(let x=0;x<5;x++)for(let y=0;y<5;y++)items.push([5*s*x,4*s*y,(4+6*z)*s,5*s,4*s,6*s]);
 assert.equal(items.length,totals[i]);
 for(const p of items)for(let axis=0;axis<3;axis++)assert(p[axis]>=0&&p[axis]+p[axis+3]<=m.container[axis]);
 for(let a=0;a<items.length;a++)for(let b=0;b<a;b++)assert([0,1,2].some(k=>items[a][k]+items[a][k+3]<=items[b][k]||items[b][k]+items[b][k+3]<=items[a][k]));
 const box=m.container.reduce((a,b)=>a*b),unit=m.object.reduce((a,b)=>a*b);
 assert.equal(Math.floor(box/unit),items.length);
 assert.equal(q.answer,`${items.length}개`);
 assert.match(q.solution,new RegExp(`${items.length}개`));
 assert.notDeepEqual(m.container,[25,20,16]);
}
assert.equal(practice.generate({...type,reviewLocked:true},0,0,0,0),null);
console.log("PASS: four distinct synthetic packings meet the volume bound without overlaps");
