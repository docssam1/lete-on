"use strict";
const assert=require("node:assert/strict"),p=require("./source-5-2-u5-check113-arrow-practice.js");
const axes=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],rotate=(v,b)=>v.map((_,j)=>v.reduce((s,n,i)=>s+n*b[i][j],0)),same=(a,b)=>a.join(",")==b.join(",");
const rotations=axes.flatMap(x=>axes.filter(y=>dot(x,y)===0).map(y=>[x,y,cross(x,y)]));
assert.equal(rotations.length,24);
// Independently folded face frames: [inward normal, local right, local down].
const frames=[ [[-1,0,0],[0,0,-1],[0,-1,0]], [[0,0,1],[-1,0,0],[0,-1,0]], [[1,0,0],[0,0,1],[0,-1,0]], [[0,0,-1],[1,0,0],[0,-1,0]], [[0,-1,0],[1,0,0],[0,0,1]], [[0,1,0],[1,0,0],[0,0,-1]] ];
const expected=["ㄷ→ㄱ","ㄱ→ㄷ","ㄴ→ㄹ","ㄹ→ㄴ"],rightVectors=[[0,-1,1],[0,1,-1],[0,1,1],[0,-1,-1]];
const type={id:p.id,generatorKey:p.key,sourceVerified:true,reviewLocked:false};
for(let i=0;i<4;i++){
 const c=p.cases[i],dirs=[[c.dx,c.dy],[1,-1],[-1,1],[0,-1],[-1,-1],[-1,0]],q=p.generate(type,0,0,0,i),matches=[];
 for(const basis of rotations){const faces=new Map();frames.forEach(([normal,u,v],j)=>{const [dx,dy]=dirs[j],a=u.map((n,k)=>dx*n+dy*v[k]);faces.set(rotate(normal,basis).join(","),rotate(a,basis));});if(same(faces.get("0,0,-1"),[0,1,0])&&same(faces.get("0,1,0"),[-1,0,0]))matches.push(faces.get("-1,0,0"));}
 assert.equal(matches.length,1);assert.deepEqual(matches[0],rightVectors[i]);assert.equal(q.answer,expected[i]);assert.match(q.answerVisual,new RegExp(`${c.from} 쪽에서 ${c.to} 쪽`));
}
assert.equal(p.generate({...type,reviewLocked:true},0,0,0,0),null);
console.log("PASS: four arrow questions each have one correct direction under 24 proper rotations");
