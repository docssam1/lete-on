import test from'node:test';import assert from'node:assert/strict';
import{narrationSelector,narrationBranch}from'./tests/deck-narration.mjs';
import{revisedTextbookUnits}from'./revised-textbook.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import{buildSlides}from'./deck.js';import{similar}from'../data/units/s31-u01.similar.js';
for(const [flag,kind]of[['forceThinking','read'],['forceThinking','think'],['climateThinking','break'],['climateThinking','recall']]){
 test(`${flag} ${kind}는 예전 음성 연결보다 현재 카드의 안내를 먼저 고른다`,async()=>{
  const ch={[flag]:true,revisedThinkingClassroom:true,slideCues:{card:'현재 자료에서 비교할 조건을 살펴보아요.'}},s={id:'card',kind},before=structuredClone(ch),V={slides:{card:'old-recording'}};
  assert.deepEqual((await narrationBranch(ch,s,V)).calls,[{text:ch.slideCues.card}]);assert.deepEqual(ch,before);assert.deepEqual(V,{slides:{card:'old-recording'}});
 });
}
test('이전 수업의 녹음 연결과 기본 안내는 현재 카드 원고가 없을 때 그대로 선택한다',async()=>{
 for(const [kind,fallback]of[['read',null],['think','dk-think'],['break','dk-break'],['recall','dk-recall'],['end','dk-end']]){
  const ch={},s={id:'card',kind};assert.deepEqual((await narrationBranch(ch,s)).calls,fallback?[fallback]:[]);
 }
 assert.deepEqual((await narrationBranch({}, {id:'card',kind:'read'},{slides:{card:'old-recording'}})).calls,['old-recording']);
});
test('실제 힘 수업의 설명·생각·실험 안내14개를 현재 카드와 대응한다',async()=>{
 const m=await revisedClassroom('s31-u01',await import('../data/book/s31-u01.book.js')),slides=buildSlides(m.chapter,m.art,m.plan,classroomQuestions(m,similar),'self'),cards=slides.filter(s=>['read','think','scene','lab','end'].includes(s.kind));assert.equal(cards.length,14);
 for(const s of cards){const text=m.chapter.slideCues?.[s.id];assert.equal(typeof text,'string',s.id);assert(text.trim().length>0,s.id);assert(!/가설|탐구보고서|공식 성적/.test(text),s.id);assert.deepEqual(narrationSelector(m.chapter,s)({slides:{[s.id]:'old-recording'}},'fallback'),{text});}
});
test('현행32단원의 카드별 안내가 있는 경우 같은 선택 규칙을 적용하고 원고를 바꾸지 않는다',async()=>{
 let units=0,cues=0;for(const unit of revisedTextbookUnits){const m=await revisedClassroom(unit,await import(`../data/book/${unit}.book.js`)),ch=m.chapter,before=JSON.stringify(ch),entries=Object.entries(ch.slideCues||{});assert(entries.length>0,unit);units++;for(const[id,text]of entries){assert.deepEqual(narrationSelector(ch,{id})({slides:{[id]:'old-recording'}},'fallback'),{text},unit+'/'+id);cues++;}assert.equal(JSON.stringify(ch),before);}assert.equal(units,32);assert(cues>500);
});
