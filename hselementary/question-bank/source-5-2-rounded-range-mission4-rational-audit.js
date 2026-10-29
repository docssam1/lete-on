"use strict";
const assert=require('node:assert/strict'),api=require('./source-5-2-rounded-range-mission4.js');
// All values are scaled by 1000; arithmetic and boundary checks are exact integers.
const scale=1000n,unit=100000n*scale;
function rounds(x,mode){const q=x/unit,r=x%unit;return (q+(mode==='up'?(r>0n?1n:0n):mode==='nearest'?(r*2n>=unit?1n:0n):0n))*unit;}
function check(target){const low=BigInt(target)*scale,high=low+unit/2n;
 const matches=x=>rounds(x,'nearest')===low&&rounds(x,'down')===low&&rounds(x,'up')===low+unit;
 for(const x of [low-1n,low,high,high+1n])assert.equal(matches(x),false);
 for(const x of [low+1n,low+unit/4n,high-1n])assert.equal(matches(x),true);
 return {low,high};
}
const original=check(7900000);assert.equal(original.low,7900000n*scale);assert.equal(original.high,7950000n*scale);
for(let v=0;v<3;v++)for(const d of [-1,0,1]){
 const q=api.getQuestion(v,d),m=q.questionModel,r=check(m.roundedTarget);
 assert.equal(BigInt(m.lowerExclusive)*scale,r.low);assert.equal(BigInt(m.upperExclusive)*scale,r.high);
 assert.match(q.answer,/초과.*미만/);assert.doesNotMatch(q.prompt,/자연수/);
}
console.log('PASS: 원문 및 합성 9개 실수 범위의 양 끝점·0.001 단위 안팎을 정확한 유리수 연산으로 검증.');
