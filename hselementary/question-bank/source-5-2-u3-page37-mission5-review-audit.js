'use strict';
const assert=require('node:assert/strict');
// The right angle and 65° at G leave 25° at the fixed vertex D.
const angle=180-90-65;assert.equal(angle,25);
const minutes=180/angle;assert.equal(minutes,7.2);assert.equal(Math.round(minutes*60),432);
// Independently rotate a non-symmetric right triangle around D.
const t=Math.PI/180,G=[-Math.cos(25*t),Math.sin(25*t)],N=[-1,0];
const rotate=([x,y],deg)=>[x*Math.cos(deg*t)+y*Math.sin(deg*t),-x*Math.sin(deg*t)+y*Math.cos(deg*t)];
const firstN=rotate(N,angle);assert.ok(Math.abs(firstN[0]-G[0])<1e-12&&Math.abs(firstN[1]-G[1])<1e-12);
for(const p of [G,N]){const turned=rotate(p,180);assert.ok(Math.abs(turned[0]+p[0])<1e-12&&Math.abs(turned[1]+p[1])<1e-12);}
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-mission-5');assert.equal(row.independentAnswer,'7분 12초');assert.equal(row.publicDecision,'locked');
console.log('37쪽 Mission 5: 1분 25° 회전·반 바퀴 7분 12초와 좌표 회전 확인');
