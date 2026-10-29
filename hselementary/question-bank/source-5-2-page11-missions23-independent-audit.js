"use strict";
const assert=require('node:assert/strict'),m2=require('./source-5-2-rounded-range-mission2.js'),m3=require('./source-5-2-notebook-range-mission3.js');
function digitRound(n,digits,mode){const s=String(n).padStart(digits+1,'0'),prefix=Number(s.slice(0,-digits)),tail=s.slice(-digits);const up=mode==='up'?/[1-9]/.test(tail):mode==='nearest'?tail[0]>='5':false;return Number(String(prefix+(up?1:0))+'0'.repeat(digits));}
function count(h,t){const all=[];for(let n=Math.max(1,t);n<t+1100;n++)if(digitRound(n,2,'nearest')===h&&digitRound(n,3,'down')===t)all.push(n);return all;}
function leftover(target,prepared){const out=[];for(let n=1;n<=target+10;n++)if(digitRound(n,1,'up')===target&&3*n<=prepared)out.push(prepared-3*n);return out.sort((a,b)=>a-b);}
const src=count(4000,3000);assert.equal(src.length,50);assert.equal(src[0],3950);assert.equal(src.at(-1),3999);
assert.deepEqual(leftover(50,160),[10,13,16,19,22,25,28,31,34,37]);
for(let v=0;v<3;v++)for(const d of [-1,0,1]){
 const q=m2.getQuestion(v,d),r=count(q.questionModel.hundredRoundTarget,q.questionModel.thousandFloorTarget);
 assert.equal(q.answer,`${r.length}개`);assert.equal(r[0],q.answerModel.lowerInclusive);assert.equal(r.at(-1)+1,q.answerModel.upperExclusive);assert.match(q.prompt,/몇 개인가요/);
 const p=m3.getQuestion(v,d),m=p.questionModel,l=leftover(m.studentCeilingTarget,m.notebooksPrepared);
 assert.deepEqual(p.answerModel.attainableLeftovers,l);assert.deepEqual(p.answerModel.leftoverRange,[l[0],l.at(-1)]);assert.equal(l.length,10);
 assert.equal(p.answer,`${l[0].toLocaleString('ko-KR')}권 이상 ${l.at(-1).toLocaleString('ko-KR')}권 이하`);
}
console.log('PASS: 원문 Mission 2는 50개, Mission 3은 10~37권 중 3권 간격 10개; 합성 18구성 전수.');
