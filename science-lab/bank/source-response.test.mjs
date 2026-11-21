import test from 'node:test';
import assert from 'node:assert/strict';
import {checkSourceResponse} from './source-response.mjs';
import {gradeDaily} from '../v2/daily-grade.js';
import {judgeItem} from '../v2/judge.js';
const response=(contract,value)=>checkSourceResponse({responseContract:contract},value).status;

test('원문 선택 계약은 실제 보기 위치와 중복 없는 복수 응답으로 판정한다',()=>{
 const single={kind:'single-choice',answer:3,teacherRequired:false};
 for(let i=0;i<5;i++)assert.equal(response(single,i),i===3?'correct':'wrong');
 const multiple={kind:'multi-choice',answers:[0,3],teacherRequired:false};
 for(let bits=1;bits<32;bits++){
  const picked=Array.from({length:5},(_,i)=>i).filter(i=>bits&(1<<i));
  assert.equal(response(multiple,picked),bits===9?'correct':'wrong');
 }
 assert.equal(response(multiple,[3,0]),'correct');assert.equal(response(multiple,[0,3,0]),'wrong');
 assert.equal(response(single,5),'wrong');assert.equal(response(single,1.5),'wrong');
});

test('원문 여러 빈칸과 기호 응답은 순서·기호 중복을 보존하고 Daily와 같은 결과를 쓴다',()=>{
 const contract={kind:'ordered-term-parts',teacherRequired:false,parts:[{label:'㉠',kind:'short-text',accepted:['가상 첫말']},{label:'㉡',kind:'short-text',accepted:['가상 뒷말']}]};
 const before=structuredClone(contract),q={answerContract:{type:'short-text',answer:'가상 첫말, 가상 뒷말',sourceResponseContract:contract}};
 for(const [value,expected]of [['가상 첫말, 가상 뒷말','correct'],['㉡ 가상 뒷말 ㉠ 가상 첫말','correct'],['가상 뒷말, 가상 첫말','wrong'],['㉠ 가상 첫말 ㉠ 가상 뒷말','wrong'],['','blank']]){
  assert.equal(gradeDaily(q,value).status,expected);
  assert.equal(judgeItem({text:value,ac:q.answerContract}).st,({correct:'ok',wrong:'no',blank:'empty'})[expected]);
 }
 const symbols={kind:'unordered-labels',teacherRequired:false,answers:['ㄱ','ㄹ']};
 assert.equal(response(symbols,'ㄹ, ㄱ'),'correct');assert.equal(response(symbols,'ㄱ, ㄱ, ㄹ'),'wrong');assert.equal(response(symbols,'ㄱ'),'wrong');
 assert.deepEqual(contract,before);assert.throws(()=>checkSourceResponse({},'답'),/원문 응답 계약/);
});

test('보류된 원문 선택·쓰기 계약은 답과 관계없이 교사 확인이며 빈 응답은 미응답이다',()=>{
 for(const type of ['single-choice','short-text','written-explanation']){
  const contract={kind:'written-explanation',teacherRequired:true,required:['가상 확인 항목']},q={choices:type==='single-choice'?['하나','둘']:null,answerContract:{type,answer:0,sourceResponseContract:contract}};
  for(const value of [0,'다른 생각',[1,3]]){assert.equal(response(contract,value),'review');assert.equal(gradeDaily(q,value).status,'review');assert.equal(judgeItem({text:value,ac:q.answerContract}).st,'review');}
  for(const value of ['',null,[]])assert.equal(gradeDaily(q,value).status,'blank');
 }
});
