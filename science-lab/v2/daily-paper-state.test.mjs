import test from'node:test';import assert from'node:assert/strict';
import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper,dailyReviewSlide,dailyPhotoKey}from'./daily-paper-state.js';
const q=(id,prompt=id)=>({id,prompt,choices:['옛 가','옛 나'],answerContract:{type:'single-choice',answer:0},explanation:'근거'});
test('시험지 스냅샷은 문항 순서·보기·발문·정답 계약이 바뀌면 원래 원고를 읽기 전용으로 복구한다',()=>{
 const list=[q('a'),q('b')],state={paper:snapshotDailyPaper(list),answers:{a:1},graded:{a:'wrong',b:'blank'},at:42};const before=structuredClone(state);
 assert.equal(resolveDailyPaper(list,state).readOnly,false);
 for(const next of [[list[1],list[0]],[list[0]],list.map(it=>({...it,prompt:it.prompt+' 수정'})),list.map(it=>({...it,choices:['새 가','새 나']})),list.map(it=>({...it,answerContract:{type:'single-choice',answer:1}}))]){const result=resolveDailyPaper(next,state);assert.equal(result.readOnly,true);assert.deepEqual(result.questions,list);result.questions[0].choices[0]='외부 수정';assert.deepEqual(state,before);}
 // 객체 속성의 직렬화 순서만 바뀐 것은 새 시험지로 보지 않는다.
 assert.equal(resolveDailyPaper(list.map(({id,...rest})=>({...rest,id})),state).readOnly,false);
});
test('원고 없는 부분·혼합 기록은 남은 항목만 표시하고 전체 시험지나 보기 문구를 추정하지 않는다',()=>{
 const current=[q('a'),q('new')],legacy=[q('a','옛 문항'),q('old'),q('not-saved')],state={answers:{a:1,old:0,missing:'쓴 답'},graded:{old:'wrong',a:'correct'},self:{old:'sure'},first:{old:{status:'wrong'}}},before=structuredClone(state),result=resolveDailyPaper(current,state,{legacyList:legacy,pool:[]});
 assert.equal(result.reason,'unbound');assert.equal(result.readOnly,true);assert.deepEqual(result.questions.map(it=>it.id),['old','a','missing']);assert(!result.questions.some(it=>it.id==='not-saved'||it.id==='new'));assert.equal(result.questions[1].prompt,'옛 문항');assert.equal(result.questions[2].unavailableOriginal,true);assert.deepEqual(state,before);
 const partial=resolveDailyPaper(current,{answers:{a:0}},{legacyList:legacy});assert.equal(partial.questions.length,1);assert(partial.readOnly);
});
test('지원하지 않는 스냅샷은 현재 보기로 대체하지 않고 저장된 원본은 새 답안의 이전 기록에 보존한다',()=>{
 const state={paper:{version:99,questions:[{id:'a',secretOriginal:'keep'}]},answers:{a:1},graded:{a:'wrong'},at:42,sentinel:{keep:true}},before=structuredClone(state),result=resolveDailyPaper([q('a')],state);
 assert(result.readOnly);assert.equal(result.reason,'unavailable');assert.equal(result.questions[0].unavailableOriginal,true);assert.equal(result.questions[0].choices,undefined);const fresh=startDailyPaper(state,result,[q('a')],'attempt-1');assert.deepEqual(fresh.paperHistory[0].state,before);assert.deepEqual(fresh.answers,{});assert.deepEqual(state,before);assert.equal(fresh.paperHistory[0].originalCompositionKnown,false);
});
test('명시적 새 시험지는 과거 답·정오·시각·자신감·수정 이력·추가 필드를 온전히 보관하고 기록 범위를 분리한다',()=>{
 const oldList=[q('a')],newList=[q('b')],state={paper:snapshotDailyPaper(oldList),answers:{a:1},graded:{a:'wrong'},first:{a:{status:'wrong',m:['m']}},self:{a:'sure'},questionVersions:{a:1},questionTimes:{a:42},revisionHistory:{a:[{answers:0}]},at:42,cur:0,zoom:1.2,sentinel:{keep:true}},before=structuredClone(state);
 const fresh=startDailyPaper(state,resolveDailyPaper(newList,state),newList,'attempt-2');assert.deepEqual(fresh.paperHistory[0].state,before);assert.equal(fresh.paperHistory[0].originalCompositionKnown,true);for(const key of['answers','graded','first','self','questionVersions','questionTimes','revisionHistory'])assert.deepEqual(fresh[key],key==='graded'?null:{});assert.equal(fresh.at,null);assert.equal(fresh.zoom,1.2);assert.deepEqual(fresh.sentinel,{keep:true});assert.notEqual(dailyReviewSlide('a',state),dailyReviewSlide('a',fresh));assert.equal(dailyPhotoKey('unit',state),'unit');assert.equal(dailyPhotoKey('unit',fresh),'unit:paper:attempt-2');assert.notEqual(dailyPhotoKey('exam:unit',fresh),dailyPhotoKey('unit',fresh));assert.deepEqual(state,before);
 const next=startDailyPaper(fresh,resolveDailyPaper([q('c')],fresh),[q('c')],'attempt-3');assert.equal(next.paperHistory.length,2);assert.deepEqual(next.paperHistory[0],fresh.paperHistory[0]);assert.equal(next.paperHistory[1].state.paperHistory,undefined);
});
test('같은 시험지·응답 없는 새 기록은 이전 동작을 유지하고 잘못된 새 답안 키는 거부한다',()=>{
 const list=[q('a')];assert.equal(resolveDailyPaper(list,{}).readOnly,false);assert.equal(resolveDailyPaper(list,{answers:{a:1}}).readOnly,false);assert.throws(()=>startDailyPaper({},resolveDailyPaper(list,{}),list,'bad:key'));
});
test('스냅샷 밖에 남아 있는 응답도 숨기거나 현재 문항으로 합치지 않는다',()=>{
 const list=[q('a')],state={paper:snapshotDailyPaper(list),answers:{a:1,orphan:'예전 답'},graded:{a:'wrong'}},result=resolveDailyPaper(list,state);assert(result.readOnly);assert.deepEqual(result.questions.map(q=>q.id),['a','orphan']);assert.equal(result.questions[1].unavailableOriginal,true);assert.equal(result.reason,'unbound');
});

test('원문 공통 자료·두 번째 그림·보기표·교사 참고가 바뀌면 저장된 시험지를 읽기 전용으로 보존한다',()=>{
 const item={...q('source-fixture'),sourceContentVersion:'synthetic-source',sourceContextBlocks:[{type:'text',text:'공통 자료'}],sourceMaterialBlocks:[{type:'figure',src:'assets/bank/fixture/one.png',alt:'첫 그림'},{type:'figure',src:'assets/bank/fixture/two.png',alt:'둘째 그림'}],sourceChoiceTable:{heads:['특징'],rows:[['가'],['나']]},printedAnswerContract:{type:'single-choice',answer:0},printedExplanation:'인쇄 풀이',printedRubric:['확인할 내용'],reviewSummary:'조건을 확인해요.'};
 const list=[item],state={paper:snapshotDailyPaper(list),answers:{[item.id]:1},graded:{[item.id]:'review'},sentinel:'보존'},before=structuredClone(state);
 const changes={
  sourceContentVersion:'다음 자료 형식',
  sourceContextBlocks:[{type:'text',text:'바뀐 공통 자료'}],
  sourceMaterialBlocks:[item.sourceMaterialBlocks[0],{...item.sourceMaterialBlocks[1],src:'assets/bank/fixture/new.png'}],
  sourceChoiceTable:{...item.sourceChoiceTable,rows:[['나'],['가']]},
  printedAnswerContract:{type:'single-choice',answer:1},printedExplanation:'바뀐 인쇄 풀이',printedRubric:['다른 확인할 내용'],reviewSummary:'다른 조건을 확인해요.',
 };
 for(const [key,value]of Object.entries(changes)){const result=resolveDailyPaper([{...item,[key]:value}],state);assert(result.readOnly,key);assert.equal(result.reason,'changed');assert.deepEqual(result.questions,list);assert.deepEqual(state,before);}
 assert.equal(resolveDailyPaper(list,state).readOnly,false);assert.deepEqual(state,before);
});
