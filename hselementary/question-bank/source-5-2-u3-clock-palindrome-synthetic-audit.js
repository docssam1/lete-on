'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-clock-palindrome-synthetic.js');
function isMatch(hour,minute){return hour<10?minute%10===hour:minute===10*(hour%10)+Math.floor(hour/10);}
let original=0,midnight=0,noon=0;for(let t=0;t<=720;t++){const h24=Math.floor(t/60),hour=h24%12||12,minute=t%60;if(isMatch(hour,minute)){original++;if(h24===0)midnight++;if(h24===12)noon++;}}assert.equal(original,57);assert.equal(midnight,1);assert.equal(noon,0);
for(let i=0;i<3;i++){const m=api.model(i);let n=0;for(let h=m.start;h<=m.end;h++)for(let minute=0;minute<60;minute++)if(isMatch(h,minute))n++;assert.equal(n,[30,26,9][i]);assert.equal(n,m.answer);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${n}번`);assert.match(q.prompt,/분은 항상 두 자리/);assert.match(q.prompt,/시작과 끝 시각도 포함/);assert.match(q.solution,/10시는 01분/);assert.equal(q.answerVisualRequired,false);}}
console.log('시각 대칭수 감사 통과: 원문 721분·밤/낮 경계와 창작 세 범위·세 난이도 독립 숫자 계산');
