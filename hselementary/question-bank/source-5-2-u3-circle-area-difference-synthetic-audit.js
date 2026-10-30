'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-circle-area-difference-synthetic.js');
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel;assert.ok(m.a*m.a+m.b*m.b<m.r*m.r);let diff=0,n=840;for(let x=0;x<n;x++)for(let y=0;y<n;y++){const X=-m.r+(x+.5)*2*m.r/n,Y=-m.r+(y+.5)*2*m.r/n;if(X*X+Y*Y>=m.r*m.r)continue;diff+=((X< -m.a&&Y>m.b)||(X> -m.a&&Y<m.b))?1:-1;}assert.ok(Math.abs(diff*(2*m.r/n)**2-m.answer)<.03);assert.deepEqual([4,8,16][i],m.answer);assert.doesNotMatch(q.prompt,/data-circle-difference/);assert.match(q.answerVisual,/data-circle-difference/);}
console.log('원 넓이 차 감사: 세 치수·세 난이도, 직사각형 포함과 원 내부 독립 표본·정답 분리 검증');
