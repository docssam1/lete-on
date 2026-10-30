'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-rotated-number-addition-synthetic.js');
const canonical=s=>[...s].sort().join(''),turn={a:'d',b:'e',c:'f',d:'a',e:'b',f:'c',g:'g'};
const rotate=d=>{const rotated=canonical([...api.glyph[d]].map(k=>turn[k]).join(''));const matches=Object.keys(api.glyph).filter(k=>canonical(api.glyph[k])===rotated);assert.equal(matches.length,1);return matches[0];};
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel,calculated=[...m.number].reverse().map(rotate).join('');assert.equal(calculated,m.rotated);assert.equal(Number(m.number)+Number(calculated),m.answer);assert.deepEqual([5514,7777,15191][i],m.answer);assert.doesNotMatch(q.prompt,/data-rotated-glyphs/);assert.match(q.answerVisual,/data-rotated-glyphs/);assert.match(q.answerVisual,/rotate\(180 165 80\)/);}
console.log('회전 숫자 감사: 원문 글자 획의 반 바퀴 대응, 세 덧셈·세 난이도 및 정답 분리 검증');
