'use strict';
const assert=require('node:assert/strict');
const base=14,side=10,height=8,total=176,centerHeight=2;
const overlap=2*base*height-total,overlapHeight=2*centerHeight;
assert.equal(overlap,48);assert.equal(overlapHeight,4);
const overlapBase=overlap/overlapHeight,overlapSide=side*overlapHeight/height;
assert.equal(overlapBase,12);assert.equal(overlapSide,5);assert.equal(2*(overlapBase+overlapSide),34);
// A separate coordinate realization intersects two congruent translated
// parallelograms in the ranges u=[2,14], v=[0,1/2].
const skew=-Math.sqrt(side**2-height**2),toXY=([u,v])=>[u+skew*v,height*v];
const poly=[[2,0],[14,0],[14,.5],[2,.5]].map(toXY);
const area=Math.abs(poly.reduce((s,[x,y],i)=>{const [a,b]=poly[(i+1)%poly.length];return s+x*b-a*y},0))/2;
const perimeter=poly.reduce((s,[x,y],i)=>{const [a,b]=poly[(i+1)%poly.length];return s+Math.hypot(a-x,b-y)},0);
assert.ok(Math.abs(area-48)<1e-9);assert.ok(Math.abs(perimeter-34)<1e-9);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-mission-3');assert.equal(row.independentAnswer,'34cm');assert.equal(row.publicDecision,'locked');
console.log('37쪽 Mission 3 검수: 겹친 넓이 48cm²·높이 4cm·둘레 후보 34cm 및 독립 좌표');
