'use strict';
const assert=require('node:assert/strict');
// Intersection of the source arrow and its 180° image about O=(0,0).
const poly=[[-4,0],[-2,-2],[2,-2],[4,0],[2,2],[-2,2]];
const twice=Math.abs(poly.reduce((s,[x,y],i)=>{const [a,b]=poly[(i+1)%poly.length];return s+x*b-a*y},0));assert.equal(twice,48);
const inArrow=(x,y)=>x>=-4&&x<=0&&Math.abs(y)<=2||x>=0&&x<=4&&Math.abs(y)<=4-x;
const inPolygon=(x,y)=>{let result=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [a,b]=poly[i],[c,d]=poly[j];if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)result=!result;}return result;};
for(let i=0;i<80;i++)for(let j=0;j<50;j++){const x=-4+(i+.37)/10,y=-2.5+(j+.23)/10;assert.equal(inPolygon(x,y),inArrow(x,y)&&inArrow(-x,-y));}
assert.equal(4*4+2*(2*4/2),24);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-mission-2');assert.equal(row.independentAnswer,'24cm²');assert.equal(row.publicDecision,'locked');
console.log('37쪽 Mission 2: 화살표·회전 도형 교집합과 넓이 후보 24cm² 검증');
