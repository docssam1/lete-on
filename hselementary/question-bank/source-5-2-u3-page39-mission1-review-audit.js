'use strict';
const assert=require('node:assert/strict');
const source=[[4,2],[2,6],[7,3]],O=[8,6],S=[12,5],turn=(p,c)=>p.map((v,i)=>2*c[i]-v),first=source.map(p=>turn(p,O)),second=first.map(p=>turn(p,S));
assert.deepEqual(first,[[12,10],[14,6],[9,9]]);assert.deepEqual(second,[[12,0],[10,4],[15,1]]);
for(let i=0;i<source.length;i++)for(let k=0;k<2;k++){assert.equal(source[i][k]+first[i][k],2*O[k]);assert.equal(first[i][k]+second[i][k],2*S[k]);assert.equal(second[i][k]-source[i][k],2*(S[k]-O[k]));}
const area=p=>Math.abs(p.reduce((s,[x,y],i)=>{const [a,b]=p[(i+1)%p.length];return s+x*b-a*y},0))/2;assert.equal(area(first),area(source));assert.equal(area(second),area(source));
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e8-mission-1');assert.equal(row.publicDecision,'locked');assert.match(row.independentCalculation,/오른쪽 8칸, 위 2칸/);
console.log('39쪽 Mission 1: 원문 세 꼭짓점·두 중심·중점·평행이동·넓이 보존 재검증');
