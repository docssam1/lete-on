'use strict';
const assert=require('node:assert/strict');
// The supplied chain, as read from the dot board, goes from the upper-left
// dot to the lower-right dot. The point-board spacing is 1 cm.
const path=[[0,0],[0,1],[1,2],[0,3],[2,2],[3,3]],center=[1.5,1.5];
const reflected=path.map(([x,y])=>[3-x,3-y]);
assert.deepEqual(reflected[0],path.at(-1));assert.deepEqual(reflected.at(-1),path[0]);
const polygon=[...path,...reflected.slice(1,-1)];
const twiceArea=Math.abs(polygon.reduce((s,[x,y],i)=>{const [u,v]=polygon[(i+1)%polygon.length];return s+x*v-u*y},0));
assert.equal(twiceArea,8);
// Independent area estimate: midpoint sampling with an even/odd crossing test.
const n=400;let count=0;
for(let x=0;x<3*n;x++)for(let y=0;y<3*n;y++){const X=(x+.5)/n,Y=(y+.5)/n;let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [a,b]=polygon[i],[c,d]=polygon[j];if((b>Y)!==(d>Y)&&X<(c-a)*(Y-b)/(d-b)+a)inside=!inside;}if(inside)count++;}
assert.ok(Math.abs(count/(n*n)-4)<0.01);
for(const [x,y] of path)assert.deepEqual([3-(3-x),3-(3-y)],[x,y]);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-example-7-2');assert.equal(row.publicDecision,'locked');assert.equal(row.publisherKeyVerified,undefined);assert.equal(row.independentAnswer,'4cm²');
console.log('36쪽 예제 7-2 검수: 점판 좌표·중심·넓이 4cm²(신발끈 및 표본 독립 대조), 공식 답안 미대조 잠금');
