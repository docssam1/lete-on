'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-triple-reflection-synthetic.js');
const vector=a=>[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)],dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
function reflect(p,angle){const u=vector(angle),d=dot(p,u);return [2*d*u[0]-p[0],2*d*u[1]-p[1]];}
function close(a,b){assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<1e-9)}
for(let i=0;i<3;i++){const m=api.model(i),n=vector(m.n),g=reflect(n,m.ga),d=reflect(n,m.na),r=reflect(d,m.g),angle=Math.acos(Math.max(-1,Math.min(1,dot(n,r))))*180/Math.PI;close(g,vector(m.g));close(d,vector(m.d));close(r,vector(m.r));assert.ok(Math.abs(angle-m.answer)<1e-8);assert.equal(m.answer,[100,120,140][i]);for(const difficulty of [-1,0,1]){const q=api.makeQuestion(i,difficulty);assert.equal(q.answer,`${m.answer}°`);assert.match(q.prompt,/직선 ㄱㅇ/);assert.match(q.prompt,/㉠/);assert.doesNotMatch(q.prompt,new RegExp(`${m.answer}°`));assert.match(q.solution,/∠ㄴㅇㄷ/);assert.match(q.answerVisual,new RegExp(`${m.answer}°`));}}
console.log('세 번 반사 연습 감사 통과: 세 변형·세 난이도, 독립 벡터 반사와 표시각');
