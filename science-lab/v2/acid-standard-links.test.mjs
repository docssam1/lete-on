import test from 'node:test';
import assert from 'node:assert/strict';
import {workbook} from '../data/book/c22-s61-u01.workbook.js';
import {withAcidWorkbookStandards,withAcidItemStandards} from '../data/book/c22-s61-u01.standards.js';
import {items} from '../data/units/c22-s61-u01.js';
import {acidCurrentItems} from './acid-question-language.js';

const codes=question=>question.standards||question.standard&&[question.standard]||[];
test('교재128문항과 실제 수업 문항은 같은 ID의 관련 성취기준으로 연결한다',()=>{
 const current=acidCurrentItems(items),allowed=new Set(['6과09-01','6과09-02','6과09-03','6과09-04']);
 assert.equal(workbook.questions.length,128);
 for(const question of workbook.questions){
  const runtime=current.find(item=>item.workbookRef?.id===question.id);assert(runtime,question.id);
  assert.equal(runtime.workbookRef.no,question.no);
  assert(codes(question).length>0);assert(codes(question).every(code=>allowed.has(code)));
  assert.deepEqual(codes(runtime.taxonomy),codes(question),question.id);
 }
 for(const code of allowed)assert(workbook.questions.some(question=>codes(question).includes(code)));
 assert(acidCurrentItems(current).every((item,i)=>item===current[i]));
});
test('리트머스·지시약 분류 활동은 분류 기준에, 열린 복습은 여러 기준에 연결한다',()=>{
 for(const no of [3,68,81,84,85,86,100,121])assert.deepEqual(codes(workbook.questions.find(q=>q.no===no)),['6과09-01']);
 for(const no of [125,127]){
  const question=workbook.questions.find(q=>q.no===no);assert.equal(question.standard,undefined);assert.equal(question.standards.length,4);
 }
 const evidence=workbook.questions.find(q=>q.no===99);assert.deepEqual(evidence.standards,['6과09-02','6과09-04']);assert.equal(evidence.standard,undefined);
});
test('연결 보완은 문항 내용·정답·이전 버전·진단 규칙을 보존하고 입력을 수정하지 않는다',()=>{
 const input={id:'item',workbookRef:{unit:'c22-s61-u01',id:'c22-s61-u01-w084',no:84},prompt:'기존 문항',answerContract:{type:'written-explanation',sample:'기존 예시'},contentVersion:'old',previousVersions:[{version:1,prompt:'이전 원고'}],diagnosticOverride:{version:'old',cells:'M10'},taxonomy:{standard:'6과09-02',element:'E7',type:'T10'}},before=structuredClone(input);
 const linked=withAcidItemStandards(input);assert.deepEqual(input,before);assert.equal(linked.taxonomy.standard,'6과09-01');
 assert.equal(linked.prompt,input.prompt);assert.equal(linked.answerContract,input.answerContract);assert.equal(linked.previousVersions,input.previousVersions);assert.equal(linked.diagnosticOverride,input.diagnosticOverride);assert.equal(linked.contentVersion,input.contentVersion);assert.equal(linked.taxonomy.element,input.taxonomy.element);assert.equal(linked.taxonomy.type,input.taxonomy.type);
 const workbookQuestion={id:'c22-s61-u01-w125',no:125,prompt:'원래 질문',answer:'원래 예시'};const result=withAcidWorkbookStandards(workbookQuestion);assert.deepEqual(workbookQuestion,{id:'c22-s61-u01-w125',no:125,prompt:'원래 질문',answer:'원래 예시'});assert.equal(result.prompt,workbookQuestion.prompt);assert.equal(result.answer,workbookQuestion.answer);
});
test('다른 단원과 관계없는 문항은 보존하고 ID와 번호가 어긋난 연결은 거부한다',()=>{
 const unrelated={id:'legacy',taxonomy:{standard:'legacy'}};assert.equal(withAcidItemStandards(unrelated),unrelated);
 assert.throws(()=>withAcidWorkbookStandards({id:'c22-s61-u01-w002',no:1}));
 assert.throws(()=>withAcidItemStandards({workbookRef:{unit:'c22-s61-u01',id:'c22-s61-u01-w129',no:129}}));
});
