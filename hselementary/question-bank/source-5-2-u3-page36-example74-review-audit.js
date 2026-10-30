'use strict';
const assert=require('node:assert/strict');
const base=23,side=16,height=12,total=492,centerHeight=3;
const one=base*height,overlap=2*one-total,overlapHeight=2*centerHeight;
assert.equal(overlap,60);assert.equal(overlapHeight,6);
const width=overlap/overlapHeight,slanted=side*overlapHeight/height;
assert.equal(2*(width+slanted),36);
// Independent coordinate construction: use horizontal and slanted basis vectors.
// Translate the congruent second parallelogram by 13 horizontal units and
// negative half of the slanted vector. Intersect their basis-coordinate ranges.
const skew=Math.sqrt(side**2-height**2),transform=([u,v])=>[u+skew*v,height*v];
const poly=[[13,0],[23,0],[23,.5],[13,.5]].map(transform);
const area=Math.abs(poly.reduce((sum,[x,y],i)=>{const [a,b]=poly[(i+1)%poly.length];return sum+x*b-a*y},0))/2;
const perimeter=poly.reduce((sum,[x,y],i)=>{const [a,b]=poly[(i+1)%poly.length];return sum+Math.hypot(a-x,b-y)},0);
assert.ok(Math.abs(area-60)<1e-9);assert.ok(Math.abs(perimeter-36)<1e-9);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-example-7-4');assert.equal(row.independentAnswer,'36cm');assert.equal(row.publicDecision,'locked');
console.log('36쪽 예제 7-4 검수: 겹친 넓이 60cm²·높이 6cm·둘레 후보 36cm, 독립 좌표와 원문 잠금 확인');
