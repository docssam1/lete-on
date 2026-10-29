"use strict";
const assert=require('node:assert/strict'),api=require('./source-5-2-rounded-count-mission6.js');
function candidates(target,unit){const r=[];for(let n=Math.max(1,target-1000);n<=target+1000;n++)if(Math.floor((n+unit/2)/unit)*unit===target)r.push(n);return r;}
assert.deepEqual(candidates(7200,1),[7200]);assert.equal(candidates(7200,10).length,10);assert.equal(candidates(7200,100).length,100);assert.equal(candidates(7200,1000).length,0);
for(let v=0;v<3;v++)for(const difficulty of [-1,0,1]){
 const q=api.getQuestion(v,difficulty),t=q.questionModel.target;
 assert.match(q.prompt,/십의 자리 이상/);assert.match(q.prompt,/\(ㄱ\).*\(ㄴ\)/);
 assert.equal(candidates(t,1).length,1);assert.equal(candidates(t,10).length,10);assert.equal(candidates(t,100).length,100);assert.equal(candidates(t,1000).length,0);
 assert.equal(q.answer,'ㄱ=10개, ㄴ=100개');
}
console.log('PASS: 원문 7200의 일의 자리 허용 시 1개, 십/백의 자리 10/100개; 명시적 제한 변형 9개 확인.');
