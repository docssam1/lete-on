'use strict';
const assert=require('node:assert/strict');
function area(p){return Math.abs(p.reduce((s,[x,y],i)=>{const [a,b]=p[(i+1)%p.length];return s+x*b-a*y},0))/2;}
function clip(poly,a,b){const cross=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=cross(p),v=cross(q);if(u>=0)out.push(p);if((u<0&&v>0)||(u>0&&v<0)){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
// Representative family of the drawn shape, not measurements from the source.
let configurations=0;for(let w=2;w<=9;w++)for(let r=1;r<=4;r++)for(let h=1;h<=4;h++)for(let shift=1;shift<w;shift++){const lower=[[0,0],[w,0],[w,r],[0,r]],upper=[[0,r],[w,r],[w+shift,r+h],[shift,r+h]],a=[w/2,r/2],b=[(w+shift)/2,r+h/2],join=w/2+shift*r/(2*(r+h));assert.ok(join>0&&join<w);for(const p of [lower,upper])assert.ok(Math.abs(2*area(clip(p,a,b))-area(p))<1e-8);configurations++;}
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e8-mission-2');assert.equal(row.publicDecision,'locked');assert.equal(row.singleAnswer,false);
console.log(`39쪽 Mission 2: ${configurations}개 대표 붙임 도형의 접합선 통과와 각각의 넓이 이등분 검증`);
