"use strict";
const assert=require("node:assert/strict"),api=require("./source-6-2-painted-removal.js");
const all=[];for(let z=0;z<2;z++)for(let x=0;x<2;x++)for(let y=0;y<2;y++)all.push([x,y,z]);
let tests=0;
for(let mask=1;mask<256;mask++){
  const remaining=all.filter((_,i)=>mask&(1<<i)),m=api.solve(2,remaining);
  assert.equal(m.histogram[3],remaining.length);assert.equal(m.histogram.reduce((a,b)=>a+b,0),remaining.length);
  assert.equal(m.removed.length,8-remaining.length);assert.equal(m.colored.reduce((sum,c)=>sum+c.faces.length,0),remaining.length*3);
  for(const c of m.colored){assert.equal(c.faces.length,3);assert(c.newlyExposed.every(name=>!c.faces.includes(name)));}tests++;
}
const side=3,remaining=[];for(let z=0;z<side;z++)for(let x=0;x<side;x++)for(let y=0;y<side;y++)if(!(x===1&&y===1&&z===1))remaining.push([x,y,z]);
const cavity=api.solve(3,remaining);assert.deepEqual(cavity.histogram,[0,6,12,8,0,0,0]);assert.equal(Object.values(cavity.newlyExposedCounts).reduce((a,b)=>a+b,0),6);
const single=api.solve(3,[[1,1,1]]);assert.deepEqual(single.histogram,[1,0,0,0,0,0,0]);assert.equal(single.colored[0].newlyExposed.length,6);
const bad=[()=>api.solve(1,[[0,0,0]]),()=>api.solve(3,[]),()=>api.solve(3,[[3,0,0]]),()=>api.solve(3,[[0,0,0],[0,0,0]]),()=>api.solve(3,[[0,.5,0]]),()=>api.solve("3",[[0,0,0]]),()=>api.solve(3,[[0,0]])];bad.forEach(fn=>assert.throws(fn));
assert(Object.isFrozen(cavity.colored[0].faces));assert.equal(cavity.conditionPolicy.repaintAfterRemoval,false);
console.log(JSON.stringify({status:"passed",exhaustiveOriginal2CubeSurvivors:tests,interiorRemovalNoRepaint:true,interiorCubeAloneNoPaint:true,invalidCases:bad.length,sourceGeometryValidated:false}));
