'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-two-centers-triangle-area-synthetic.js');
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel;for(let k=0;k<2;k++){assert.equal((m.G[k]+m.N[k])/2,m.O[k]);assert.equal((m.G[k]+m.D[k])/2,m.S[k]);}const twice=Math.abs((m.N[0]-m.G[0])*(m.D[1]-m.G[1])-(m.N[1]-m.G[1])*(m.D[0]-m.G[0]));assert.equal(twice/2,m.answer);assert.equal(m.N[1],m.D[1]);assert.deepEqual([8,12,4][i],m.answer);assert.doesNotMatch(q.prompt,/data-triangle-result/);assert.match(q.answerVisual,/data-triangle-result/);for(const p of [m.G,m.O,m.S,m.N,m.D])assert.ok(p.every(v=>v>=0&&v<=10));}
console.log('두 대칭점 삼각형 감사: 세 변형·세 난이도 중점, 행렬식, 수평 밑변·높이 및 정답 분리 통과');
