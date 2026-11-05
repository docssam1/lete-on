import test from'node:test';import assert from'node:assert/strict';
import{revisedClassroom,classroomQuestions,classroomTableData}from'./revised-lesson.js?v=20261102-life';import*as original from'../data/book/s31-u04.book.js';import{similar}from'../data/units/s31-u04.similar.js';import{items}from'../data/units/s31-u04.js';import{lesson}from'../data/units/s31-u04.lesson.js';import{buildSlides}from'./deck.js?v=20261102-life';
import{renderChapter}from'./book.js';
import{LIFE_EXPERIMENTS,LIFE_PLANS,LIFE_JUDGMENTS,lifeMaterial,lifeCompareRecord,validLifeCompareRow,lifeCompareValues,lifeComparisonProgress,germinationCount}from'./life-compare-model.js';
const mod=await revisedClassroom('s31-u04',original),originalPool=[...similar,...items],pool=classroomQuestions(mod,originalPool);
test('한살이 기본 수업은 조건·가상 자료·단계·다음 세대를 연결하며 실제 기록 앱을 반복하지 않는다',()=>{
 for(const mode of['self','teach']){
  const s=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),ids=s.map(x=>x.id);assert.equal(s.length,mode==='self'?27:28);assert.equal(s.filter(x=>x.item).length,11);assert.equal(s.filter(x=>x.mount==='lab').length,1);assert(!s.some(x=>x.fieldTab||x.kind==='fieldwork'||x.mount==='scene'||/href="[^\"]*\/(report|records)/.test(x.body)));
  assert(ids.indexOf('predict')<ids.indexOf('lab'));assert(ids.indexOf('lab')<ids.indexOf('results'));assert(ids.indexOf('results')<ids.indexOf('animal-stages'));assert.deepEqual([...new Set(s.flatMap(x=>x.standards||[]))].sort(),['4과04-01','4과04-02','4과04-03']);
  assert(!/undefined|\[object Object\]|\[&quot;/.test(s.map(x=>x.body).join('')));assert(s.every(x=>x.phaseObj));assert(s.find(x=>x.id==='observations').body.includes('미관찰'));assert(s.find(x=>x.id==='plant-cycle').body.includes('같은 개체라고 정할 수 없어요'));assert(s.find(x=>x.id==='growth-light').body.includes('가상 자료'));
  if(mode==='self'){assert(s.find(x=>x.id==='conclusion').body.includes('data-prediction-summary'));assert(!s.some(x=>x.body.includes('class="dk-ans rv"')));}else assert(!s.some(x=>x.body.includes('<textarea')));
 }
 assert.equal(mod.plan.phases.reduce((sum,p)=>sum+p.min,0),80);
});
test('기존22쪽 관찰 교재·보고서·41짝과64보충 및 11개 정답 계약을 보존한다',()=>{
 assert.equal(original.chapter.lifeThinking,undefined);assert.equal(lesson.explore.lab.kind,'life');assert.equal(lesson.elaborate.report,true);assert.equal((renderChapter(original.chapter,original.art,originalPool).match(/class="bk-page/g)||[]).length,22);
 for(const mode of['self','teach']){const s=buildSlides(original.chapter,original.art,original.plan,originalPool,mode);assert.equal(s.length,36);assert.equal(s.filter(x=>x.fieldTab).length,6);}
 assert.equal(similar.length,41);assert.equal(items.length,64);const revisedIds=new Set(mod.classroomItems.map(x=>x.id));assert.equal(revisedIds.size,11);
 for(const q of pool){const previous=originalPool.find(x=>x.id===q.id);assert(previous);assert.deepEqual(q.answerContract,previous.answerContract);assert.deepEqual(q.taxonomy,previous.taxonomy);assert.deepEqual(q.sourceRef,previous.sourceRef);if(!revisedIds.has(q.id))assert.equal(q,previous);}
 const daily=[...classroomQuestions(mod,similar),...classroomQuestions(mod,items)];for(const q of mod.classroomItems)assert.equal(daily.find(x=>x.id===q.id),pool.find(x=>x.id===q.id));assert(revisedIds.has('s31-u04-b07'));
 assert.equal(mod.classroomLab.kind,'life-compare');assert.equal(mod.classroomLab.rowsKey,'lifeCompareRows');
});
test('싹트기와 자람 네 조건에서 두 계획의 차이가 하나인지 둘인지 구별한다',()=>{
 assert.deepEqual(Object.keys(LIFE_EXPERIMENTS),['germ-water','germ-temp','grow-water','grow-light']);
 for(const id of Object.keys(LIFE_EXPERIMENTS))for(const plan of Object.keys(LIFE_PLANS)){
  const m=lifeMaterial(id,plan),different=m.conditions[0].slice(1).filter((value,i)=>value!==m.conditions[1][i+1]).length;
  assert.equal(different,plan==='fair'?1:2);assert.equal(m.comparable,plan==='fair');assert(m.summary);
 }
 assert.throws(()=>lifeMaterial('other','fair'));assert.throws(()=>lifeMaterial('germ-water','other'));assert(lifeMaterial('grow-light','fair').summary.includes('키만으로'));
});
test('0개·미관찰과 가상 수치·처음 판단을 구별하고 위조 행은 쓰지 않는다',()=>{
 assert.equal(germinationCount(0),'0개');assert.equal(germinationCount(null),'미관찰');for(const n of[undefined,'0',-1,6,1.5,NaN])assert.throws(()=>germinationCount(n));
 const row=lifeCompareRecord('germ-water','fair','unknown');assert(validLifeCompareRow(row));const other=lifeMaterial('germ-water','fair');other.results[0][1]='5개';assert.equal(row.material.results[0][1],'0개');assert.equal(lifeMaterial('germ-water','fair').results[0][1],'0개');assert(!validLifeCompareRow({...row,material:other}));assert(!validLifeCompareRow({...row,kind:'실제 관찰'}));assert(!validLifeCompareRow({...row,plan:'mixed'}));assert(!validLifeCompareRow({...row,judgment:'correct'}));
 const table=classroomTableData('s31-u04',mod.classroomLab,[row]);assert.equal(table.cols.length,3);assert.deepEqual(table.rowValues(row),lifeCompareValues(row));assert.deepEqual(table.rowValues({kind:'실제 관찰'}),['확인이 필요한 자료','','']);
});
test('같은 자료 반복이나 위조 행은 여덟 비교의 진도를 늘리지 않는다',()=>{
 const row=lifeCompareRecord('germ-water','fair','unknown');assert.deepEqual(lifeComparisonProgress([row,row,{...row,kind:'실제 관찰'}]),{done:1,total:8,complete:false});
 const rows=Object.keys(LIFE_EXPERIMENTS).flatMap(id=>Object.keys(LIFE_PLANS).map(plan=>lifeCompareRecord(id,plan,'unknown')));assert.equal(rows.length,8);assert.deepEqual(lifeComparisonProgress(rows.slice(0,7)),{done:7,total:8,complete:false});assert.deepEqual(lifeComparisonProgress(rows),{done:8,total:8,complete:true});assert.deepEqual(lifeComparisonProgress(null),{done:0,total:8,complete:false});assert.equal(Object.keys(LIFE_JUDGMENTS).length,3);
});
