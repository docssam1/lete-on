'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-dotboard-symmetric-area-synthetic.js');
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel,p=m.polygon;const area=Math.abs(p.reduce((s,[x,y],j)=>{const [a,b]=p[(j+1)%p.length];return s+x*b-a*y},0))/2;assert.equal(area,m.answer);assert.deepEqual([20,24,32][i],area);const canonical=v=>v.join(',');const set=new Set(p.map(canonical));for(const [x,y] of p)assert.ok(set.has(canonical([m.w-x,m.h-y])));assert.deepEqual(m.chain[0],[0,0]);assert.deepEqual(m.chain.at(-1),[m.w,m.h]);assert.doesNotMatch(q.prompt,/data-dotboard-result/);assert.match(q.answerVisual,/data-dotboard-result/);}
console.log('점판 감사: 세 치수·세 난이도, 대응점·다각형 넓이·정답 분리 검증');
