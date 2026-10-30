'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-wedge-ball-return-synthetic.js'),core=require('./source-5-2-u3-two-mirror-bounces-synthetic.js'),rad=Math.PI/180;
const unit=(a,b)=>{const x=b[0]-a[0],y=b[1]-a[1],n=Math.hypot(x,y);return [x/n,y/n]},dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
function verify(alpha,beta,p){assert.equal(p.length,7);assert.ok(Math.abs(Math.acos(Math.abs(unit(p[0],p[1])[0]))/rad-beta)<1e-8);for(let j=1;j<=3;j++){const u=unit(p[j-1],p[j]),v=unit(p[j],p[j+1]),t=j%2?[Math.cos(alpha*rad),Math.sin(alpha*rad)]:[1,0];assert.ok(Math.abs(dot(u,t)-dot(v,t))<1e-8);if(j===3)assert.ok(Math.abs(dot(u,t))<1e-8);assert.ok(Math.hypot(p[j][0]-p[6-j][0],p[j][1]-p[6-j][1])<1e-8);}assert.ok(Math.hypot(p[6][0]-1,p[6][1])<1e-8)}
verify(20,30,core.trace(20,30));
for(let i=0;i<3;i++){const m=api.model(i);assert.equal(m.answer,[36,24,18][i]);verify(m.alpha,m.answer,m.points);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.answer}°`);assert.match(q.prompt,/ㄴ, ㄷ, ㄹ/);assert.match(q.prompt,/ㄷ, ㄴ, ㄱ/);assert.doesNotMatch(q.prompt,new RegExp(`${m.answer}°`));assert.match(q.solution,/수직/);assert.match(q.answerVisual,/data-wedge-ball="solution"/);}}
console.log('두 벽 공 경로 감사 통과: 원문·세 변형의 입사각, 반사법칙, 수직 충돌과 역경로');
