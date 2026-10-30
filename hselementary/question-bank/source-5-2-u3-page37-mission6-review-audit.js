'use strict';
const assert=require('node:assert/strict');
const G=[7,2],O=[4,5],S=[6,4],N=G.map((x,i)=>2*O[i]-x),D=G.map((x,i)=>2*S[i]-x);
assert.deepEqual(N,[1,8]);assert.deepEqual(D,[5,6]);
const twice=(a,b,c)=>Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]));
assert.equal(twice(G,N,D),12);assert.equal(twice(G,O,S),3);assert.equal(twice(G,N,D),4*twice(G,O,S));
const entry=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-mission-6');assert.equal(entry.independentAnswer,'6cm²');assert.equal(entry.publicDecision,'locked');
console.log('37쪽 Mission 6: 원문 좌표와 두 중점, 넓이 6cm² 및 중점 삼각형의 네 배 검증');
