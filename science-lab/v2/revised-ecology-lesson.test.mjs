import{questionAtVersion}from'./question-revision.js';
import test from'node:test';import assert from'node:assert/strict';
import{revisedClassroom,classroomQuestions,classroomTableData}from'./revised-lesson.js';import*as original from'../data/book/c22-s42-u02.book.js';import*as records from'../data/book/c22-s42-u02.records-book.js';import{similar}from'../data/units/c22-s42-u02.similar.js';import{items}from'../data/units/c22-s42-u02.js';import{lesson}from'../data/units/c22-s42-u02.lesson.js';import{buildSlides}from'./deck.js';import{renderChapter}from'./book.js';
import{CHANGES,SPECIES,ecologyMaterial,ecologyCompareRecord,validEcologyCompareRow,ecologyComparisonProgress,ecologyCompareValues}from'./ecology-compare-model.js';
import{ECOLOGY_FOOD_EDGES,ECOLOGY_FOOD_CHAINS,ecologyFoodWeb}from'./ecology-thinking-data.js';
import{deckSlideIndex}from'./deck.js';
const mod=await revisedClassroom('c22-s42-u02',original),oldPool=[...similar,...items],pool=classroomQuestions(mod,oldPool),prediction={grass:'unknown',rabbit:'unknown',fox:'unknown'};
test('생물과 환경 수업은 실사 스타일 사진·자료 비교·제작·토의·실천과 세 성취기준을 연결한다',()=>{
 for(const mode of['self','teach']){
  const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),at=id=>slides.find(s=>s.id===id),index=id=>slides.findIndex(s=>s.id===id);
  assert.equal(slides.length,mode==='self'?37:38);assert.equal(slides.filter(s=>s.item).length,12);assert.equal(slides.filter(s=>s.mount==='lab').length,1);assert(!slides.some(s=>s.mount==='scene'||s.fieldTab||s.kind==='fieldwork'||/href="[^\"]*\/(report|records)/.test(s.body)));
  assert(at('scene').body.includes('ecology-20261028/meadow.jpg'));assert(!at('lab').body.includes('3D'));assert(at('limits').body.includes('생존 기간을 계산한 모형이 아니'));assert(at('roles').body.includes('rice.jpg'));assert(at('roles').body.includes('fungus-photo.webp'));assert(at('impact').body.includes('water-waste.jpg'));
  for(const[a,b]of[['predict','lab'],['lab','results'],['results','conclusion'],['model-design','model-make'],['model-make','model-check'],['discuss','practice'],['practice','recheck']])assert(index(a)<index(b));
  assert.equal(at('arrows').ses,2);assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['4과14-01','4과14-02','4과14-03']);assert(slides.every(s=>s.phaseObj));assert(!/undefined|\[object Object\]/.test(slides.map(s=>s.body).join('')));
  assert.equal(at('conclusion').body.includes('data-prediction-summary'),mode==='self');if(mode==='self')assert(!slides.some(s=>s.body.includes('class="dk-ans rv"')));
 }
 assert.equal(mod.plan.phases.reduce((n,p)=>n+p.min,0),120);
});
test('둘째 수업 입구는 처음으로 돌아가지 않고 먹이그물·보전 활동에서 시작한다',()=>{
 for(const mode of['self','teach']){const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode);assert.equal(deckSlideIndex(mod.chapter,slides,'s2'),mode==='self'?12:13);assert.equal(slides[deckSlideIndex(mod.chapter,slides,'s2')].id,'arrows');assert.equal(deckSlideIndex(mod.chapter,slides,1),0);assert.equal(deckSlideIndex(mod.chapter,slides,999),slides.length-1);}
 const legacy=[{id:'cover',ses:1},{id:'concept',ses:2},{id:'recall',ses:2}];assert.equal(deckSlideIndex({},legacy,'s2'),2);assert.equal(deckSlideIndex({inquirywork:true},legacy,'s2'),1);
});
test('12개 확인의 정답 계약과 기존150문항·10쪽 교재·49쪽 실제 기록을 보존한다',()=>{
 assert.equal(original.chapter.ecologyThinking,undefined);assert.equal(similar.length,70);assert.equal(items.length,80);assert.equal(records.chapter.pages.length,49);assert.equal((renderChapter(original.chapter,original.art,oldPool).match(/class="bk-page/g)||[]).length,10);assert.equal(buildSlides(original.chapter,original.art,original.plan,oldPool,'self').length,22);assert.equal(buildSlides(original.chapter,original.art,original.plan,oldPool,'teach').length,23);
 const selected=new Set(mod.classroomItems.map(q=>q.id));assert.equal(selected.size,12);assert.deepEqual(mod.chapter.check,[...selected]);assert.deepEqual(mod.chapter.formative.items,[]);
 for(const q of pool){const old=oldPool.find(x=>x.id===q.id);assert(old);const restored=questionAtVersion(q,old.contentVersion||1);assert(restored);for(const k of Object.keys(old))assert.deepEqual(restored[k],old[k]);for(const k of Object.keys(q))if(!Object.hasOwn(old,k))assert(['contentVersion','previousVersions'].includes(k));if(!selected.has(q.id))assert.equal(q,old);}
 const daily=[...classroomQuestions(mod,similar),...classroomQuestions(mod,items)];for(const q of mod.classroomItems)assert.equal(daily.find(x=>x.id===q.id),q);
 assert.equal(mod.classroomLab.rowsKey,'ecologyCompareRows');assert.equal(lesson.explore.lab.rowsKey,'meadowRows');assert.equal(lesson.explore.records.rowsKey,'ecologyInquiryRows');
});
test('수업의 모형 값과 처음 예상은 그대로 보존하고 잘못된 기록은 복구하지 않는다',()=>{
 assert.deepEqual(CHANGES.map(c=>{const m=ecologyMaterial(c);return SPECIES.map(([key])=>m[key]);}),[[60,12,3],[28,28,0],[80,0,1],[30,6,2]]);
 for(const change of CHANGES){const row=ecologyCompareRecord(change,prediction);assert(validEcologyCompareRow(row));assert.deepEqual(row.prediction,prediction);assert.deepEqual(classroomTableData('c22-s42-u02',mod.classroomLab,[row]).rowValues(row),ecologyCompareValues(row));for(const bad of[{...row,kind:'실제 조사'},{...row,material:null},{...row,prediction:{...prediction,grass:'correct'}},{...row,material:{...row.material,fox:999}}])assert.equal(validEcologyCompareRow(bad),false);}
 assert.throws(()=>ecologyMaterial('기타'));assert.throws(()=>ecologyCompareRecord(CHANGES[0],{}));const m=ecologyMaterial(CHANGES[0]);m.grass=999;assert.equal(ecologyMaterial(CHANGES[0]).grass,60);
 assert.deepEqual(classroomTableData('c22-s42-u02',mod.classroomLab,[]).rowValues({}),['확인이 필요한 자료','','']);
});
test('기준과 바꾼 조건을 모두 비교해야 자료 비교만 완료하고 중복·위조로 진도를 늘리지 않는다',()=>{
 const row=ecologyCompareRecord(CHANGES[0],prediction),optional=ecologyCompareRecord(CHANGES[2],prediction);assert.deepEqual(ecologyComparisonProgress([row,row,optional,{...row,change:CHANGES[1]}]),{done:1,total:2,complete:false});assert.deepEqual(ecologyComparisonProgress([row,ecologyCompareRecord(CHANGES[1],prediction)]),{done:2,total:2,complete:true});assert.deepEqual(ecologyComparisonProgress(null),{done:0,total:2,complete:false});
});
test('먹이그물의 여섯 화살표와 공통 카드는 제공된 두 사슬과 정확히 같다',()=>{
 const edges=ECOLOGY_FOOD_CHAINS.flatMap(c=>c.slice(1).map((b,i)=>`${c[i]}→${b}`));assert.deepEqual([...new Set(edges)].sort(),ECOLOGY_FOOD_EDGES.map(e=>e.join('→')).sort());
 for(const portrait of[false,true]){const svg=ecologyFoodWeb(portrait);assert.equal((svg.match(/data-food-node=/g)||[]).length,6);assert.deepEqual([...svg.matchAll(/data-food-edge="([^"]+)"/g)].map(m=>m[1]).sort(),[...new Set(edges)].sort());}
});
