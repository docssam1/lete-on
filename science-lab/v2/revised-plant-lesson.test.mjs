import test from'node:test';import assert from'node:assert/strict';
import{revisedClassroom,classroomQuestions,classroomTableData}from'./revised-lesson.js?v=20261102-plant';
import*as original from'../data/book/s31-u03.book.js';import{similar}from'../data/units/s31-u03.similar.js';import{lesson}from'../data/units/s31-u03.lesson.js';import{workbook}from'../data/book/s31-u03.workbook.js';
import{buildSlides}from'./deck.js?v=20261102-plant';import{LEAF_MEASUREMENT_EXAMPLE}from'./deck-plant-thinking.js';
import{LEAF_CASES,leafGroups,leafCompareRecord,validLeafCompareRow,validLeafPlacements,leafRowValues}from'./plant-classify.js';
const mod=await revisedClassroom('s31-u03',original),pool=classroomQuestions(mod,similar);
test('식물 수업은 사진 비교·측정 자료·환경·설계로 이어지며 기본 보고서를 요구하지 않는다',()=>{
 for(const mode of['self','teach']){
  const s=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),ids=s.map(x=>x.id);assert.equal(s.length,mode==='self'?27:28);assert.equal(s.filter(x=>x.item).length,11);assert.equal(s.filter(x=>x.mount==='lab').length,1);
  assert(!s.some(x=>x.fieldTab||x.kind==='fieldwork'||/href="[^\"]*\/(report|records)/.test(x.body)));assert(ids.indexOf('predict')<ids.indexOf('lab'));assert(ids.indexOf('lab')<ids.indexOf('results'));assert(ids.indexOf('results')<ids.indexOf('measurements'));assert(ids.indexOf('measurements')<ids.indexOf('habitat'));
  assert.deepEqual([...new Set(s.flatMap(x=>x.standards||[]))].sort(),['4과03-01','4과03-02','4과03-03']);
  assert(!s.some(x=>x.item==='s31-u03-v012'));assert(s.some(x=>x.item==='s31-u03-v011'));assert(!/undefined|\[object Object\]|\[&quot;|잎판|모습를/.test(s.map(x=>x.body).join('')));
  assert(s.find(x=>x.id==='own-criterion').body.includes('다른 외형 기준을 하나 정해요'));assert(s.find(x=>x.id==='measurements').body.includes('실제로 잰 값이 아니에요'));assert(s.every(x=>x.phaseObj));
  if(mode==='self'){assert(s.find(x=>x.id==='conclusion').body.includes('data-prediction-summary'));assert(!s.some(x=>x.body.includes('class="dk-ans rv"')));}else assert(!s.some(x=>x.body.includes('<textarea')));
 }
 assert.equal(mod.plan.phases.reduce((sum,p)=>sum+p.min,0),80);
});
test('기존 실제 기록·보고서·80문항을 보존하고 기본 확인은 같은 정답 계약을 사용한다',()=>{
 assert.equal(original.chapter.plantThinking,undefined);assert.equal(original.chapter.pages.length,25);assert.equal(lesson.explore.lab.kind,'plant');assert.equal(lesson.elaborate.report,true);
 const old=buildSlides(original.chapter,original.art,original.plan,similar,'self');assert.equal(old.length,45);assert(old.some(x=>x.id==='report'));
 const updated=new Set(mod.classroomItems.map(x=>x.id));assert.equal(updated.size,11);assert.equal(pool.length,80);
 for(const q of pool){const previous=similar.find(x=>x.id===q.id);assert(previous);assert.deepEqual(q.answerContract,previous.answerContract);assert.deepEqual(q.sourceRef,previous.sourceRef);assert.deepEqual(q.taxonomy,previous.taxonomy);if(!updated.has(q.id))assert.equal(q,previous);}
 assert.equal(mod.classroomLab.kind,'plant-compare');assert.equal(mod.classroomLab.rowsKey,'plantCompareRows');assert.equal(typeof mod.classroomLab.mount,'function');
});
test('사진의 실제 길이를 만들어 내지 않으며 원래 큰 사진을 교재와 같이 사용한다',()=>{
 assert.deepEqual(leafGroups('serrated'),{strawberry:'yes',magnolia:'no',cherry:'yes',hyacinth:'no'});assert.deepEqual(leafGroups('length'),{strawberry:'unknown',magnolia:'unknown',cherry:'unknown',hyacinth:'unknown'});assert.throws(()=>leafGroups('pretty'));
 const photos=new Set(workbook.pages.flatMap(p=>p.blocks.filter(b=>b.type==='gallery').flatMap(b=>b.items.map(x=>x.src))));assert.equal(LEAF_CASES.length,4);assert(LEAF_CASES.every(a=>a.image.endsWith('-native.webp')&&photos.has(a.image)));
 const p={strawberry:'yes',magnolia:'yes',cherry:'no',hyacinth:'unknown'},row=leafCompareRecord('length',p);p.strawberry='no';assert.equal(row.placements.strawberry,'yes');assert(validLeafCompareRow(row));assert(!validLeafCompareRow({...row,groups:{...row.groups,strawberry:'yes'}}));
 assert(!validLeafPlacements({strawberry:'yes'}));assert(!validLeafPlacements(Object.assign(Object.create({strawberry:'yes'}),{unrelated:'yes',magnolia:'no',cherry:'yes',hyacinth:'no'})));
 const table=classroomTableData('s31-u03',mod.classroomLab,[row]);assert.equal(table.cols.length,3);assert.deepEqual(table.rowValues(row),leafRowValues(row));assert.equal(table.rowValues(row)[2],'자료 더 필요: 딸기·목련·벚나무·부레옥잠');assert.deepEqual(table.rowValues({kind:'실제 잎 관찰'}),['확인이 필요한 자료','','']);
});
test('5 cm 경계는 별도 익명 가상 자료이며 사진의 식물 측정값으로 연결하지 않는다',()=>{
 assert.deepEqual(LEAF_MEASUREMENT_EXAMPLE.filter(x=>x.cm>=5).map(x=>x.name),['잎 나','잎 다']);assert.deepEqual(LEAF_MEASUREMENT_EXAMPLE.filter(x=>x.cm<5).map(x=>x.name),['잎 가','잎 라']);assert(!LEAF_MEASUREMENT_EXAMPLE.some(x=>LEAF_CASES.some(p=>p.name===x.name)));
});
