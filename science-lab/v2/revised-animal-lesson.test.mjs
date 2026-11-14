import test from'node:test';import assert from'node:assert/strict';
import{revisedClassroom,classroomQuestions,classroomTableData}from'./revised-lesson.js?v=20261102-animal';
import*as original from'../data/book/s31-u02.book.js';
import{similar}from'../data/units/s31-u02.similar.js';
import{lesson}from'../data/units/s31-u02.lesson.js';
import{buildSlides}from'./deck.js?v=20261102-animal';
import{classifyGroups,classifyRecord,classifyRowValues,validClassifyRow,validPlacements,CLASSIFY_ANIMALS}from'./animal-classify.js';
const mod=await revisedClassroom('s31-u02',original),pool=classroomQuestions(mod,similar);
test('동물 기본 수업은 예상→두 기준 비교→환경→설계·소통으로 이어진다',()=>{
 for(const mode of['self','teach']){
  const s=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),ids=s.map(x=>x.id);
  assert.equal(s.length,mode==='self'?27:28);assert.equal(s.filter(x=>x.item).length,11);
  assert.equal(s.filter(x=>x.mount==='lab').length,1);assert(!s.some(x=>x.fieldTab||x.kind==='fieldwork'||/href="[^\"]*\/(report|records)/.test(x.body)));
  assert(ids.indexOf('predict')<ids.indexOf('lab'));assert(ids.indexOf('lab')<ids.indexOf('results'));assert(ids.indexOf('results')<ids.indexOf('habitat'));assert(ids.indexOf('habitat')<ids.indexOf('design-function'));
  assert.deepEqual([...new Set(s.flatMap(x=>x.standards||[]))].sort(),['4과02-01','4과02-02','4과02-03']);
  assert(s.find(x=>x.id==='own-criterion').body.includes('생김새 기준을 하나 정해요'));
  assert(!/undefined|\[object Object\]|\[&quot;/.test(s.map(x=>x.body).join('')));assert(s.every(x=>x.phaseObj));
  if(mode==='self'){assert(s.find(x=>x.id==='conclusion').body.includes('data-prediction-summary'));assert(!s.some(x=>x.body.includes('class="dk-ans rv"')));}else assert(!s.some(x=>x.body.includes('<textarea')));
 }
 assert.equal(mod.plan.phases.reduce((sum,p)=>sum+p.min,0),80);
});
test('동물의 기존 실제 활동·보고서·80문항과 11개 정답 계약을 보존한다',()=>{
 assert.equal(original.chapter.animalThinking,undefined);assert.equal(lesson.explore.lab.kind,'animal');assert.equal(lesson.elaborate.report,true);
 const s=buildSlides(original.chapter,original.art,original.plan,similar,'self');assert.equal(s.length,45);assert(s.some(x=>x.id==='report'));
 assert.equal(pool.length,80);const updated=new Set(mod.classroomItems.map(x=>x.id));assert.equal(updated.size,11);
 for(const q of pool){const previous=similar.find(x=>x.id===q.id);assert(previous);assert.deepEqual(q.answerContract,previous.answerContract);assert.deepEqual(q.sourceRef,previous.sourceRef);assert.deepEqual(q.taxonomy,previous.taxonomy);if(!updated.has(q.id))assert.equal(q,previous);}
 assert.equal(mod.classroomLab.kind,'animal-compare');assert.equal(mod.classroomLab.rowsKey,'animalCompareRows');assert.equal(typeof mod.classroomLab.mount,'function');
 assert.equal(mod.chapter.revisedThinkingClassroom,true);
});
test('같은 네 동물을 분류하며 자료 더 필요를 보존하고 잘못된 확인 결과를 거부한다',()=>{
 assert.deepEqual(classifyGroups('wings'),{pigeon:'yes',bat:'yes',dragonfly:'yes',tiger:'no'});assert.deepEqual(classifyGroups('feathers'),{pigeon:'yes',bat:'no',dragonfly:'no',tiger:'no'});assert.equal(CLASSIFY_ANIMALS.length,4);
 const placement={pigeon:'unknown',bat:'yes',dragonfly:'no',tiger:'no'},row=classifyRecord('wings',placement);placement.pigeon='no';assert.equal(row.placements.pigeon,'unknown');assert(validClassifyRow(row));
 assert(!validPlacements({pigeon:'yes'}));assert(!validClassifyRow({...row,groups:{...row.groups,bat:'no'}}));assert(!validClassifyRow({...row,criterion:'feathers'}));
 const table=classroomTableData('s31-u02',mod.classroomLab,[row]);assert.deepEqual(table.rowValues(row),classifyRowValues(row));assert(table.rowValues(row)[1].includes('자료 더 필요: 비둘기'));assert.equal(table.cols.length,3);
 assert.deepEqual(table.rowValues({kind:'실제 활동 기록'}),['확인이 필요한 자료','','']);
});
