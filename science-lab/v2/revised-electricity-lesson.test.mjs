import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import vm from'node:vm';
import{execFileSync}from'node:child_process';
import{fileURLToPath}from'node:url';
import{revisedClassroom,classroomQuestions,classroomTableData,withOptionalClassroomRecords}from'./revised-lesson.js';
import*as original from'../data/book/c22-s62-u03.book.js';
import{items,unit}from'../data/units/c22-s62-u03.js';
import{lesson as rawLesson}from'../data/units/c22-s62-u03.lesson.js';
import{inquiry}from'../data/activities/c22-s62-u03.inquiry.js';
import{electricitySources}from'../data/activities/c22-s62-u03.resources.js';
import{workbook}from'../data/book/c22-s62-u03.workbook.js';
import{buildSlides,deckSlideIndex}from'./deck.js';
import{electricityCase,electricityCompareRecord,electricityCompareValues,electricityComparisonProgress,validElectricityCompareRow,ELECTRICITY_CASE_IDS}from'./electricity-compare-model.js';
import{mountElectricityCompare}from'./lab-electricity-compare.js';
import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper}from'./daily-paper-state.js';
import{deckPredictionKey,deckSlideRecordKey,deckQuestionSnapshot}from'./deck-answer-state.js';
import{gradeDaily}from'./daily-grade.js';
const mod=await revisedClassroom(unit.id,original),pool=classroomQuestions(mod,items);
const run=file=>JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/'+file,import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));

test('6과15 네 목표는 회로 구성·전자석 제작·세기/극 비교·생활 속 실천으로 이어진다',()=>{
 for(const mode of['self','teach']){
  const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),at=id=>slides.find(s=>s.id===id),body=slides.map(s=>s.body).join('');
  assert.equal(slides.length,mode==='self'?58:59);assert.equal(slides.filter(s=>s.kind==='activity').length,17);
  assert(slides.every(s=>s.phaseObj));assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['6과15-01','6과15-02','6과15-03','6과15-04']);
  assert.deepEqual(slides.filter(s=>s.mount).map(s=>s.id),['lab']);assert.equal(slides[deckSlideIndex(mod.chapter,slides,'s2')].id,'recall');assert.equal(at('firstclose').kind,'break');
  assert(!/보고서 쓰기|보고서를 작성|전류를 켠 때|undefined|\[object Object\]|[\u3040-\u30ff]/.test(body));
  assert(!slides.some(s=>s.modelLab||s.kind==='fieldwork'||s.mount==='scene'));for(const x of slides.filter(x=>!x.item&&!['end','plan'].includes(x.id)))assert(mod.chapter.slideCues[x.id],x.id);
  assert(at('coilplan').body.includes('가지런히 감아요'));assert(at('coilplan').body.includes('전지가 없는 상태'));assert(at('coilplan').body.includes('설명서'));
  assert(at('coildo').body.includes('영구 자석에는 전지를 연결하지'));assert(at('coildo').body.includes('남아 붙을 수도'));
  assert(at('strengthplan').body.includes('허용하지 않으면'));assert(at('polesdo').body.includes('전지를 분리'));assert(at('polesdo').body.includes('같은 끝'));
  assert(at('safetydo').body.includes('직접 빼려고 하지'));assert(at('useplan').body.includes('3일 이상'));assert(at('review').body.includes('그 기간')||at('review').body.includes('기간이 지나지'));
  assert(at('practice').body.includes('미리 채우지'));assert(at('share').body.includes('계획만 세운 경우'));assert(at('test16').body.includes('electricity-draw-space'));
  if(mode==='self')assert(at('test15').body.includes('단위도 함께'));
 }
 assert.equal(mod.plan.minutes,250);assert.equal(mod.plan.phases.reduce((n,p)=>n+p.min,0),250);assert(mod.plan.note.includes('한 차시를 뜻하지'));assert(mod.plan.note.includes('기간 뒤'));assert.equal(mod.chapter.classroomBattle,false);
 const ids=mod.chapter.electricityFlow.map(p=>p.id);for(const[a,b]of[['inspect','connect'],['coilplan','coildo'],['strengthplan','strengthdo'],['useplan','practice'],['practice','review'],['review','share']])assert(ids.indexOf(a)<ids.indexOf(b));
});

test('16확인은 네 성취기준 각4·8형식 각2이며 독립 기대 답과 현재 교재의 채점이 같다',()=>{
 const checks=mod.chapter.check.map(id=>pool.find(q=>q.id===id));assert.equal(checks.length,16);
 assert.deepEqual(Object.values(checks.reduce((a,q)=>(a[q.bookResponseForm]=(a[q.bookResponseForm]||0)+1,a),{})),Array(8).fill(2));
 assert.deepEqual(Object.values(checks.reduce((a,q)=>(a[workbook.questions.find(w=>w.id===q.bookQuestionId).standard]=(a[workbook.questions.find(w=>w.id===q.bookQuestionId).standard]||0)+1,a),{})),Array(4).fill(4));
 assert.equal(checks.filter(q=>q.responseContract.teacherRequired).length,4);
 const answers={1:2,19:['서로 다른','끊어지지'],25:[0,1,4],33:4,35:['서로 다른','바깥'],58:[0,3,4],85:['ㄷ','ㄱ','ㄴ'],87:['ㄴ','ㄷ','ㄱ'],92:['N극','S극'],117:['ㄷ','ㄱ','ㄴ'],120:['ㄴ','ㄱ','ㄷ'],124:['B','12Wh']};
 for(const[n,answer]of Object.entries(answers)){const q=checks.find(q=>q.id.endsWith('b'+n.padStart(3,'0')));assert.equal(gradeDaily(q,answer).status,'correct',n);}
 for(const q of checks.filter(q=>q.responseContract.teacherRequired))assert.equal(gradeDaily(q,q.responseContract.sample).status,'review');
 const q=checks.find(q=>q.id.endsWith('b124'));assert.equal(gradeDaily(q,['B','12']).status,'wrong');assert.equal(gradeDaily(q,['B','12W']).status,'wrong');assert.equal(gradeDaily(checks.find(q=>q.id.endsWith('b092')),['S극','N극']).status,'wrong');
});

test('8자료는 교재와 같고 영구 자석의 관찰·세기·극·같은 기능·실천 결과를 구별한다',()=>{
 assert.deepEqual(ELECTRICITY_CASE_IDS,['circuit','brightness','magnet','strength','poles','safety','efficiency','practice']);
 for(const[id,n]of ELECTRICITY_CASE_IDS.map((id,i)=>[id,[17,50,76,89,92,97,124,123][i]])){const m=electricityCase(id),t=workbook.questions[n-1].table;assert.deepEqual(m.heads,t.머리);assert.deepEqual(m.rows,t.행);}
 assert.deepEqual(electricityCase('magnet').rows,[['전자석',0,7,1],['영구 자석',6,6,6]]);assert(electricityCase('magnet').conditions.includes('전지를 연결하지 않은'));
 assert(electricityCase('brightness').reason.includes('32lx와 52lx'));assert(electricityCase('strength').reason.includes('두 번째는 정확히 두 배가 아니'));
 assert(electricityCase('poles').reason.includes('처음 왼쪽은 N극'));assert(electricityCase('efficiency').reason.includes('12Wh'));assert(electricityCase('practice').reason.includes('90분'));
 const rows=ELECTRICITY_CASE_IDS.map(id=>electricityCompareRecord(id,'unknown'));assert(rows.every(validElectricityCompareRow));assert(electricityComparisonProgress(rows).complete);
 assert.equal(electricityComparisonProgress([rows[0],rows[0],{...rows[1],kind:'직접 실험'}]).done,1);assert(!validElectricityCompareRow({...rows[0],material:{...rows[0].material,extra:1}}));
 for(const row of rows)assert.deepEqual(classroomTableData(unit.id,mod.classroomLab,[row]).rowValues(row),electricityCompareValues(row));
 const copy=electricityCase('efficiency');copy.rows[0][1]=999;assert.equal(electricityCase('efficiency').rows[0][1],24);
 const old=workbook.questions[123].table.행[0][1];workbook.questions[123].table.행[0][1]=999;assert.equal(electricityCase('efficiency').rows[0][1],old);workbook.questions[123].table.행[0][1]=old;
 assert.throws(()=>electricityCase('constructor'));assert.throws(()=>electricityCompareRecord('circuit','__proto__'));
});

function host(){const events=new Map(),controls=new Map();return{innerHTML:'',events,addEventListener:(t,f)=>events.set(t,f),removeEventListener:(t,f)=>{if(events.get(t)===f)events.delete(t);},querySelector:s=>{if(!controls.has(s))controls.set(s,{focus(){},disabled:false});return controls.get(s);},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-electricity-compare-${field}]`}}),act:value=>events.get('click')?.({target:{closest:()=>({dataset:{electricityCompareAct:value}})}})};}
test('비교 UI는 생각·설명 공개 뒤에만 기록하고 중복·교사 개인 저장·해제 뒤 콜백을 막는다',()=>{
 const h=host();let callback,records=0;const handle=mountElectricityCompare(h,{onRecord:rows=>{callback=rows;records++;}});
 h.act('record');assert.equal(records,0);h.change('prediction','unknown');h.act('record');assert.equal(records,0);
 h.act('reveal');h.act('record');assert.equal(records,1);h.act('record');assert.equal(records,1);
 callback[0].material.rows[0][0]='변경';assert.notEqual(handle.rows[0].material.rows[0][0],'변경');
 const copy=handle.rows;copy[0].prediction='fake';assert.equal(handle.rows[0].prediction,'unknown');
 handle.pause();h.change('case','brightness');h.act('again');assert.equal(records,1);
 handle.resume();h.change('case','brightness');h.change('prediction','unknown');h.act('reveal');h.act('record');assert.equal(records,2);
 handle.dispose();assert.equal(h.events.size,0);h.act('record');assert.equal(records,2);
 const a=host(),b=host(),one=mountElectricityCompare(a,{rows:[electricityCompareRecord('circuit','unknown')],personal:false}),two=mountElectricityCompare(b,{isActive:()=>false});
 assert.equal(one.rows.length,0);assert.notEqual(a.innerHTML.match(/id="([^"]+)"/)[1],b.innerHTML.match(/id="([^"]+)"/)[1]);
 b.change('prediction','unknown');b.act('reveal');b.act('record');assert.equal(two.rows.length,0);one.dispose();two.dispose();
});

test('워밍업은 점수 없이 저장하고 이전 Daily 원고·답은 명시적 새 시도까지 보존한다',()=>{
 const current=mod.chapter.check.map(id=>pool.find(q=>q.id===id)),legacy=[items.find(q=>q.id==='c22-s62-u03-b117')];
 const state={paper:snapshotDailyPaper(legacy),answers:{[legacy[0].id]:'ㄱ / ㄴ / ㄷ'},graded:{[legacy[0].id]:'correct'}},bytes=JSON.stringify(state),resolved=resolveDailyPaper(current,state,{legacyList:[],pool});
 assert(resolved.readOnly);assert.deepEqual(resolved.questions,legacy);const next=startDailyPaper(state,resolved,current,'electricity-new-attempt');
 assert.deepEqual(next.paperHistory[0].state,state);assert.equal(JSON.stringify(state),bytes);assert.equal(next.paper.questions.length,16);
 assert(deckPredictionKey(unit.id,mod.chapter).endsWith('electricity-thinking-v1'));
 const slide=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.item==='c22-s62-u03-b117');
 assert(deckSlideRecordKey(mod.chapter,slide).includes('20261104-electricity-book'));assert.equal(deckQuestionSnapshot(slide,pool).id,slide.item);
 const src=fs.readFileSync(new URL('./deck.js',import.meta.url),'utf8'),fn=src.slice(src.indexOf('  function runPredict()'),src.indexOf('  // 실험 설계 3칸'));
 for(let picked=0;picked<3;picked++){
  const writes=[],buttons=[0,1,2].map(j=>({dataset:{j},classList:{toggle(name){assert.equal(name,'pick');}}}));
  const ctx=vm.createContext({u:unit.id,ch:mod.chapter,stage:{querySelector:()=>({querySelectorAll:()=>buttons})},memo:{get:()=>'',set:(key,value)=>writes.push([key,value])},deckPredictionKey,G:{say:()=>Promise.resolve()},cancelAuto(){},auto(){}});
  new vm.Script(fn+'\nrunPredict();').runInContext(ctx);buttons[picked].onclick();assert.deepEqual(writes,[[deckPredictionKey(unit.id,mod.chapter),picked]]);
 }
});

test('선택 기록17개와 자료 비교를 분리하고 실제 사례의 출처를 제시한다',()=>{
 const l=withOptionalClassroomRecords(unit.id,rawLesson);
 assert.equal(l.explore.home,rawLesson.explore.home);assert.equal(l.explore.records.rowsKey,'electricityInquiryRows');assert.equal(mod.classroomLab.rowsKey,'electricityCompareRows');
 assert.deepEqual(l.explore.records.config,inquiry);assert.equal(inquiry.activities.length,17);
 assert.deepEqual(inquiry.activities.map(a=>a.id),mod.chapter.electricityFlow.filter(p=>p.kind==='activity').map(p=>p.id));
 assert.equal(l.elaborate.report,false);assert.equal(rawLesson.explore.records,undefined);assert.equal(withOptionalClassroomRecords(unit.id,l),l);
 const page=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.id==='uses');assert.equal(electricitySources.length,3);
 for(const r of electricitySources){assert(page.body.includes(r.url));assert.equal(r.readOn,'2026-11-04');assert(['nationalmaglab.org','energizer.com','www.energystar.gov'].includes(new URL(r.url).hostname));}
 assert(page.body.includes('교육용 키트 설명서'));assert(!Object.hasOwn(mod.chapter.electricityInteraction.predict,'answer'));

});
test('실제 renderDeck의 활동17개는 자동 타이머 없이 명시적 다음으로 진행한다',()=>{
 const r=run('electricity-deck-events.mjs');assert.equal(r.manualActivities,17);assert(r.noTimerOnActivity&&r.explicitNextWorks&&r.comparisonClickDoesNotAdvance&&r.staleLegacyBattleIgnored);
});
test('실제 수업·Daily16·선택 기록은 교사 저장을 읽지 않고 해제 뒤 쓰기를 막는다',()=>{
 const r=run('electricity-classroom-routes.mjs');assert.equal(r.checksSharedWithDaily,16);assert.equal(r.legacyDailyQuestions,0);assert(r.priorBankOnlyDailyWasUnavailable);
 assert.equal(r.teacherStudentReads,0);assert.equal(r.teacherStudentWrites,0);
 assert(r.originalReportAndObservationStatePreserved&&r.releaseDisposesMountedActivities&&r.lateReleasedCallbackCannotWrite&&r.lateOptionalRecordCallbackCannotWrite&&r.lateOptionalRecordHandleDisposed);
});
