'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-isosceles-axis-angle-synthetic.js');
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1],cross=(a,b)=>a[0]*b[1]-a[1]*b[0],len=a=>Math.hypot(...a),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
const angle=(v,a,b)=>{const x=sub(a,v),y=sub(b,v);return Math.acos(Math.max(-1,Math.min(1,dot(x,y)/len(x)/len(y))))*180/Math.PI};
for(let i=0;i<3;i++){const m=api.model(i),{G,N,D,R,M}=m;near(len(sub(G,N)),len(sub(G,D)));near(len(sub(R,G)),len(sub(R,D)));near(cross(sub(R,N),sub(G,N)),0);near(len(sub(M,G)),len(sub(M,D)));near(dot(sub(R,M),sub(G,D)),0);near(angle(D,R,N),m.given);near(angle(R,D,M),m.answer);assert.equal(m.answer,[40,46,54][i]);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.answer}°`);assert.match(q.prompt,/ㄱㄴ=ㄱㄷ/);assert.doesNotMatch(q.prompt,new RegExp(`${m.answer}°`));assert.match(q.answerVisual,new RegExp(`${m.answer}°`));assert.match(q.solution,/수직/);}}
console.log('이등변삼각형 대칭축 감사 통과: 세 도형·세 난이도, 거리·각·중점·수직·정답 분리');
