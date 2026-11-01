"use strict";
// Independent bounds from the cuboid's face graph, plus 3-D folding of both drawn witnesses.
const assert = require("node:assert/strict");
const item = require("./source-5-2-cuboid-page50-example24.js");
const dimensions=[6,4,3], edges=[];
for(let a=0;a<6;a++) for(let b=a+1;b<6;b++) {
  const axisA=Math.floor(a/2),axisB=Math.floor(b/2);
  if(axisA===axisB) continue;
  const remaining=[0,1,2].find(x=>x!==axisA&&x!==axisB);
  edges.push({a,b,length:dimensions[remaining]});
}
let trees=0,min=Infinity,max=-Infinity;
for(let mask=0;mask<(1<<edges.length);mask++) {
  if(mask.toString(2).replace(/0/g,"").length!==5) continue;
  const parent=Array.from({length:6},(_,i)=>i),root=i=>{while(parent[i]!==i)i=parent[i];return i;};
  let sum=0,acyclic=true;
  edges.forEach((edge,i)=>{if(!(mask&(1<<i)))return;const a=root(edge.a),b=root(edge.b);if(a===b)acyclic=false;else parent[a]=b;sum+=edge.length;});
  if(acyclic&&parent.every((_,i)=>root(i)===root(0))){trees++;min=Math.min(min,sum);max=Math.max(max,sum);}
}
assert.equal(trees,384);
assert.deepEqual([min,max],[17,26]);
const neg=v=>v.map(x=>-x);
function fold(layout) {
  const poses=new Map([[0,[[1,0,0],[0,1,0],[0,0,1]]]]),queue=[0];
  while(queue.length) {
    const i=queue.shift(), [ax,ay,bx,by]=layout[i], [u,v,n]=poses.get(i);
    for(let j=0;j<layout.length;j++) {
      if(i===j)continue;
      const [cx,cy,dx,dy]=layout[j];
      let next=null;
      if(bx===cx && Math.max(ay,cy)<Math.min(by,dy)) {assert.equal(ay,cy);assert.equal(by,dy);next=[neg(n),v,u];}
      else if(ax===dx && Math.max(ay,cy)<Math.min(by,dy)) {assert.equal(ay,cy);assert.equal(by,dy);next=[n,v,neg(u)];}
      else if(by===cy && Math.max(ax,cx)<Math.min(bx,dx)) {assert.equal(ax,cx);assert.equal(bx,dx);next=[u,neg(n),v];}
      else if(ay===dy && Math.max(ax,cx)<Math.min(bx,dx)) {assert.equal(ax,cx);assert.equal(bx,dx);next=[u,n,neg(v)];}
      if(!next)continue;
      if(poses.has(j)) assert.deepEqual(poses.get(j),next,"folding orientations must agree");
      else {poses.set(j,next);queue.push(j);}
    }
  }
  assert.equal(poses.size,6);
  assert.equal(new Set([...poses.values()].map(p=>p[2].join(","))).size,6,"each cuboid face has a distinct normal");
  return poses;
}
for(const kind of ["minimum","maximum"]) {
  const layout=item.faces[kind],poses=fold(layout);
  // Opposite normals represent the same face dimensions; adjacent face dimensions share their seam length.
  const byNormal=new Map([...poses].map(([i,p])=>[p[2].join(","),layout[i].slice(0,4)]));
  for(const [normal,rect] of byNormal) {
    const opposite=normal.split(",").map(n=>-Number(n)).join(","),other=byNormal.get(opposite);
    assert(other,"opposite face exists");
    const size=r=>[r[2]-r[0],r[3]-r[1]].sort((a,b)=>a-b);
    assert.deepEqual(size(rect),size(other),"opposite folded faces must be congruent");
  }
}
assert.deepEqual([104-2*min,104-2*max],[70,52]);
console.log("PASS: 384 face-graph trees bound the perimeter; both displayed nets fold to six distinct matching faces");
