'use strict';
const assert=require('node:assert/strict');
// Source circle centered at the origin; vertical x=-1 and horizontal y=2.
const r=4,a=1,b=2;assert.ok(a*a+b*b<r*r);
// For every four reflected points, signed A-minus-B cancels outside the
// central 2a-by-2b rectangle, and is +4 within it.
const sign=(x,y)=>((x<-a&&y>b)||(x>-a&&y<b))?1:-1;
for(let x=.05;x<r;x+=.1)for(let y=.05;y<r;y+=.1){if(x*x+y*y>=r*r||Math.abs(x-a)<1e-8||Math.abs(y-b)<1e-8)continue;const sum=sign(x,y)+sign(-x,y)+sign(x,-y)+sign(-x,-y);assert.equal(sum,(x<a&&y<b)?4:0);}
// Independent sample of the full circle, with no use of the reflection formula.
let diff=0,n=1200;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const x=-r+(i+.5)*2*r/n,y=-r+(j+.5)*2*r/n;if(x*x+y*y<r*r)diff+=sign(x,y);}
const area=diff*(2*r/n)**2;assert.ok(Math.abs(area-8)<.01);assert.equal(4*a*b,8);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e8-example-8-1');assert.equal(row.publicDecision,'locked');assert.equal(row.independentAnswer,'A가 8cm² 더 큼');
console.log('38쪽 예제 8-1: 원문 A·B, 수직선과 중심 거리, 사중 대칭 및 원 내부 표본 검증');
