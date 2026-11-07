import{grade3PracticeCurrentItems}from'../data/book/c22-s32-practice-language.js';
import{questionAtVersion}from'./question-revision.js';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{fileURLToPath}from'node:url';import{execFileSync}from'node:child_process';
import{revisedClassroom,classroomQuestions,classroomTableData}from'./revised-lesson.js';import*as original from'../data/book/c22-s32-u04.book.js';import*as records from'../data/book/c22-s32-u04.records-book.js';import{items}from'../data/units/c22-s32-u04.js';import{similar}from'../data/units/c22-s32-u04.similar.js';import{lesson}from'../data/units/c22-s32-u04.lesson.js';import{interact}from'../data/book/c22-s32-u04.interact.js';import{withThink}from'./think-merge.js';import{buildSlides,deckSlideIndex}from'./deck.js';import{deckPredictionKey}from'./deck-answer-state.js';import{glitterModel}from'../scenes/glitter-model.js';
import{INFECTION_ROUNDS,infectionComparison,infectionCompareRecord,validInfectionCompareRow,infectionComparisonProgress,infectionCompareValues}from'./infection-compare-model.js';
import{workbook}from'../data/book/c22-s32-u04.workbook.js';
const data=await withThink('c22-s32-u04',{items,similar}),oldPool=[...data.similar,...data.items],mod=await revisedClassroom('c22-s32-u04',original),pool=classroomQuestions(mod,oldPool);
test('감염병은 사례 토의·여러 감염 과정·공유와 실천을 세 기준과80분으로 연결한다',()=>{
 for(const mode of['self','teach']){const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode,interact),at=id=>slides.find(s=>s.id===id);assert.equal(slides.length,mode==='self'?31:32);assert.equal(slides.filter(s=>s.item).length,12);assert.equal(slides.filter(s=>s.mount==='lab').length,1);assert(slides.every(s=>s.phaseObj));assert(!slides.some(s=>s.mount==='scene'||s.fieldTab||s.kind==='fieldwork'||/href="[^\"]*\/(report|records)/.test(s.body)));assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['4과08-01','4과08-02','4과08-03']);assert.equal(slides[deckSlideIndex(mod.chapter,slides,'s2')].id,'recall');assert(at('cases').body.includes('어려움과 도움'));assert(at('design').body.includes('처음 A에만'));assert(at('limits').body.includes('실제 감염자 수가 아니에요'));assert(at('routes').body.includes('타액'));assert(at('routes').body.includes('물·음식'));assert(at('share').body.includes('실제'));assert(at('practice').body.includes('실천해요'));assert.equal(at('conclusion').body.includes('data-prediction-summary'),mode==='self');assert(!/undefined|\[object Object\]|\[&quot;|선천적 면역|후천적 면역|항원|항체|감염재생산지수/.test(slides.map(s=>s.body).join('')));
  const images=[...new Set(slides.flatMap(s=>[...s.body.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1])))];assert.equal(images.length,5);for(const image of images)assert(fs.existsSync(fileURLToPath(new URL(image,import.meta.url))));
 }
 assert.equal(mod.plan.phases.reduce((s,p)=>s+p.min,0),80);
 const countPage=workbook.pages.find(p=>p.title==='함께 달라졌다고 원인이 확인된 걸까요?'),countTable=countPage.blocks.find(b=>b.type==='table'),countSlide=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self',interact).find(s=>s.id==='counts');
 for(const row of countTable.rows)for(const value of row)assert(countSlide.body.includes(value));
});
test('12개 확인문항의 원래 원고·계약·출처와 실제 glitterRows·선택 기록을 보존한다',()=>{
 assert.equal(items.length,80);assert(records.chapter.pages.length>0);assert.equal(lesson.explore.lab.rowsKey,'glitterRows');assert.equal(mod.classroomLab.rowsKey,'infectionCompareRows');assert.equal(original.chapter.infectionThinking,undefined);assert.equal(mod.classroomItems.length,12);
 assert.deepEqual(mod.classroomItems.map(q=>q.taxonomy.standard).reduce((a,s)=>(a[s]=(a[s]||0)+1,a),{}),{'4과08-01':4,'4과08-02':4,'4과08-03':4});
 for(const q of mod.classroomItems){const old=items.find(x=>x.id===q.id);assert.deepEqual(q,grade3PracticeCurrentItems([old],'c22-s32-u04')[0]);const restored=questionAtVersion(q,old.contentVersion||1);for(const [key,value]of Object.entries(old))assert.deepEqual(restored[key],value);}
 for(const q of pool){const old=oldPool.find(x=>x.id===q.id);for(const key of['answerContract','sourceRef','taxonomy'])assert.deepEqual(q[key],old[key]);}
 const daily=[...classroomQuestions(mod,data.similar),...classroomQuestions(mod,data.items)];for(const q of mod.classroomItems)assert.equal(daily.find(x=>x.id===q.id),q);assert.notEqual(deckPredictionKey('c22-s32-u04',mod.chapter),deckPredictionKey('c22-s32-u04',original.chapter));
});
test('두 규칙의 차례별 카드 이름과 수는 기존 모형과 같고 처음 차례의 같은 결과도 보존한다',()=>{
 const expected=[[["A","B"],["A","B"]],[["A","B","C","F"],["A","F"]],[["A","B","C","D","E","F"],["A","B"]]];
 for(const round of INFECTION_ROUNDS){const m=infectionComparison(round);assert.deepEqual(m.start,['A']);for(let rule=0;rule<2;rule++){assert.deepEqual(m.rules[rule].who,glitterModel(round,rule).who);assert.deepEqual(m.rules[rule].who,expected[round-1][rule]);assert.equal(m.rules[rule].n,m.rules[rule].who.length);}}
 for(const round of [0,4,1.5,'1',null])assert.throws(()=>infectionComparison(round));
});
test('원본·조회 사본·위조 행·중복 차례로 모형 비교 내용을 바꾸거나 완료시키지 않는다',()=>{
 const rows=INFECTION_ROUNDS.map(n=>infectionCompareRecord(n,'unknown'));for(const row of rows){assert(validInfectionCompareRow(row));assert.deepEqual(classroomTableData('c22-s32-u04',mod.classroomLab,[row]).rowValues(row),infectionCompareValues(row));}
 assert.deepEqual(infectionComparisonProgress([rows[0],rows[0],{...rows[1],kind:'실제 관찰'}]),{done:1,total:3,complete:false});assert.deepEqual(infectionComparisonProgress(rows),{done:3,total:3,complete:true});assert.deepEqual(infectionComparisonProgress(null),{done:0,total:3,complete:false});const copy=infectionComparison(1);copy.rules[0].n=99;assert.equal(infectionComparison(1).rules[0].n,2);assert(!validInfectionCompareRow({...rows[0],material:copy}));assert(!validInfectionCompareRow({...rows[0],prediction:'correct'}));assert.throws(()=>infectionCompareRecord(1,'correct'));assert.deepEqual(classroomTableData('c22-s32-u04',mod.classroomLab,[]).rowValues({}),['확인이 필요한 자료','','']);
});
test('교사 모형 비교의 안쪽 클릭은 쪽을 넘기지 않고 옛 배틀 상태를 가져오지 않는다',()=>{
 const report=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/infection-deck-events.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert(report.staleLegacyBattleIgnored&&report.comparisonClickDoesNotAdvance&&report.outsideClickAdvances);assert.equal(report.teacherPersonal,false);
});
