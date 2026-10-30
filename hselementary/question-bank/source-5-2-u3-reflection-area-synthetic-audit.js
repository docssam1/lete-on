'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u3-reflection-area-synthetic.js');
const area=p=>Math.abs(p.reduce((s,q,i)=>{const n=p[(i+1)%p.length];return s+q[0]*n[1]-q[1]*n[0]},0))/2;
const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
function clip(subject,clipper){let out=subject;for(let i=0;i<clipper.length;i++){const a=clipper[i],b=clipper[(i+1)%clipper.length],input=out;out=[];for(let j=0;j<input.length;j++){const p=input[j],q=input[(j+1)%input.length],cp=cross(a,b,p),cq=cross(a,b,q),pin=cp>=-1e-9,qin=cq>=-1e-9;if(pin)out.push(p);if(pin!==qin){const t=cp/(cp-cq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}}return out;}
const expected=[56,252,1400];
for(let i=0;i<3;i++){const m=api.model(i),triangle=[[-m.a,0],[m.b,0],[m.b,m.h]],reflected=[[-m.b,m.h],[-m.b,0],[m.a,0]],intersection=clip(triangle,reflected),original=area(triangle),overlap=area(intersection),difference=2*(original-overlap);assert.ok(Math.abs(original-m.original)<1e-8);assert.ok(Math.abs(overlap-m.overlap)<1e-8);assert.equal(difference*m.side*m.side,expected[i]);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${expected[i]}cm²`);assert.equal(q.answerModel.answer,expected[i]);assert.match(q.prompt,/두 삼각형에서 서로 겹치지 않는 부분/);assert.doesNotMatch(q.prompt,/정답|data-reflection-area-figure="solution"/);assert.match(q.answerVisual,/data-reflection-area-figure="solution"/);assert.match(q.solution,/양쪽을 더하면/);}}
console.log('모눈 반사 연습 감사 통과: 세 도형과 세 난이도, 독립 다각형 교집합·양쪽 비겹침 넓이·정답 분리');
