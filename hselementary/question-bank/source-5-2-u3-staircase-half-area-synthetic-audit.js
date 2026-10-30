'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-staircase-half-area-synthetic.js');
function area(p){return Math.abs(p.reduce((s,[x,y],i)=>{const [a,b]=p[(i+1)%p.length];return s+x*b-a*y},0))/2;}
function clip(poly,a,b){const cross=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=cross(p),v=cross(q);if(u>=0)out.push(p);if((u<0&&v>0)||(u>0&&v<0)){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out;}
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel;assert.ok(m.junction>m.a&&m.junction<m.w);assert.ok(m.ends[0][0]>0&&m.ends[0][0]<m.w);assert.ok(m.ends[1][0]>m.a&&m.ends[1][0]<m.w);for(const rect of [m.lower,m.upper])assert.ok(Math.abs(2*area(clip(rect,...m.ends))-area(rect))<1e-9);assert.equal(q.automaticGrading,false);assert.doesNotMatch(q.prompt,/data-staircase-half-answer/);assert.match(q.answerVisual,/data-staircase-half-answer/);}
console.log('계단 도형 감사: 세 변형·세 난이도, 공통 경계 통과와 각 직사각형 넓이 이등분 검증');
