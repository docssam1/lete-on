'use strict';
const assert=require('node:assert/strict');
// Original body: [0,6] × [0,12]; protrusion: [-4,0] × [4,8].
// Axis x=4 and point O=(4,4), with y increasing downward.
const inside=(x,y)=>(x>=0&&x<6&&y>=0&&y<12)||(x>=-4&&x<0&&y>=4&&y<8);
const line=(x,y)=>inside(8-x,y),point=(x,y)=>inside(8-x,8-y);let both=0,unexpected=0;
for(let x=-8;x<16;x++)for(let y=-8;y<16;y++){const X=x+.5,Y=y+.5;if(line(X,Y)&&point(X,Y)){both++;if(!(X>=2&&X<8&&Y>=0&&Y<8))unexpected++;}}
assert.equal(unexpected,0);assert.equal(both,48);assert.equal(6*(12-4),48);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e8-example-8-3');assert.equal(row.publicDecision,'locked');assert.match(row.independentAnswer,/48cm²/);
console.log('38쪽 예제 8-3: 원문 두 변환의 겹침 48cm² 및 돌출부 경계 접촉 확인');
