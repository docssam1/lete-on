"use strict";
const assert=require('node:assert/strict'),api=require('./source-5-2-quotient-range-sum-mission5.js');
// Use integer quotients and their last decimal digit; no interval formula or arithmetic-series sum.
function candidates(roundTarget,floorTarget){const result=[];for(let n=1;n<=2500;n++){
 const a=Math.floor(n/9),b=Math.floor(n/6);const digits=String(a),tens=Number(digits.slice(0,-1)||'0')+(Number(digits.at(-1))>=5?1:0);
 const truncated=Number(String(b).slice(0,-1)||'0')*10;
 if(tens*10===roundTarget&&truncated===floorTarget)result.push(n);
}return result;}
const orig=candidates(30,40);assert.equal(orig[0],240);assert.equal(orig.at(-1),299);assert.equal(orig.length,60);assert.equal(orig.reduce((a,b)=>a+b,0),16170);
for(let v=0;v<3;v++)for(const d of [-1,0,1]){
 const q=api.getQuestion(v,d),m=q.questionModel,r=candidates(m.roundedQuotientTarget,m.truncatedQuotientTarget);
 assert(r.length>0);assert.equal(r[0],m.intersection[0]);assert.equal(r.at(-1),m.intersection[1]);assert.equal(r.length,m.candidateCount);assert.equal(r.reduce((a,b)=>a+b,0),q.answerModel.candidateSum);
 assert.equal(q.answer,q.answerModel.candidateSum.toLocaleString('ko-KR'));
}
console.log('PASS: 원문 240~299의 합 16170, 합성 9구성의 정수 몫·자릿수·직접 합산 검산.');
