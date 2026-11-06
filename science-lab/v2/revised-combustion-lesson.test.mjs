import{COMBUSTION_QUESTION_VERSION}from'./combustion-question-language.js';
import{COMBUSTION_READABILITY_VERSION}from'../data/book/c22-s62-u02.editorial.js';
import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import vm from'node:vm';
import{execFileSync}from'node:child_process';
import{fileURLToPath}from'node:url';
import{revisedClassroom,classroomQuestions,classroomTableData,withOptionalClassroomRecords}from'./revised-lesson.js';
import*as original from'../data/book/c22-s62-u02.book.js';
import{items,unit}from'../data/units/c22-s62-u02.js';
import{lesson as rawLesson}from'../data/units/c22-s62-u02.lesson.js';
import{inquiry}from'../data/activities/c22-s62-u02.inquiry.js';
import{combustionSources}from'../data/activities/c22-s62-u02.resources.js';
import{workbook}from'../data/book/c22-s62-u02.workbook.js';
import{buildSlides,deckSlideIndex}from'./deck.js';
import{combustionCase,combustionCompareRecord,combustionCompareValues,combustionComparisonProgress,validCombustionCompareRow,COMBUSTION_CASE_IDS}from'./combustion-compare-model.js';
import{mountCombustionCompare}from'./lab-combustion-compare.js';
import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper}from'./daily-paper-state.js';
import{deckPredictionKey,deckSlideRecordKey,deckQuestionSnapshot}from'./deck-answer-state.js';
import{gradeDaily}from'./daily-grade.js';
const mod=await revisedClassroom(unit.id,original),pool=classroomQuestions(mod,items);
const run=file=>JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/'+file,import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));

test('6과14의 네 목표가 관찰·비교·시범·조사·제안과 공유로 이어진다',()=>{
 for(const mode of['self','teach']){
  const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),at=id=>slides.find(s=>s.id===id),body=slides.map(s=>s.body).join('');
  assert.equal(slides.length,mode==='self'?55:56);assert.equal(slides.filter(s=>s.kind==='activity').length,15);
  assert(slides.every(s=>s.phaseObj));assert(slides.filter(s=>s.item).every(s=>s.standards?.length===1));assert.deepEqual(slides.filter(s=>s.mount).map(s=>s.id),['lab']);
  assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['6과14-01','6과14-02','6과14-03','6과14-04']);
  assert.equal(slides[deckSlideIndex(mod.chapter,slides,'s2')].id,'recall');assert.equal(at('firstclose').kind,'break');
  assert(!/보고서 쓰기|보고서를 작성|물리 변화|화학 변화|그을음|AI 실사형|undefined|\[object Object\]|[\u3040-\u30ff]/.test(body));
  assert(!slides.some(s=>s.modelLab||s.kind==='fieldwork'||s.mount==='scene'));
  for(const s of slides.filter(s=>!s.item&&!['end','plan'].includes(s.id)))assert(mod.chapter.slideCues[s.id],s.id);
  for(const id of['fuelwatch','conditionwatch','waterwatch','carbonwatch'])assert(at(id).body.includes('교사'),id);
  assert(at('mixplan').body.includes('밀폐하지'));assert(at('fuelwatch').body.includes('뜨거울 때 보충하지'));
  assert(at('carbonwatch').body.includes('입으로 불거나'));assert(at('waterwatch').body.includes('손대지'));
  assert(at('ecosystem').body.includes('피해를 증명하는 사진은 아니'));
  assert(at('seacase').body.includes('NOAA 글에 나온 실측값이 아니'));
  assert(at('makecard').body.includes('제안한 방법이 어느 부분에 도움이 되는지'));
  assert(at('share').body.includes('교실에서'));assert(at('revise').body.includes('질문'));
  assert(at('test16').body.includes('combustion-draw-space'));
  if(mode==='self'){assert(at('test4').body.includes('(1) 답 / (2) 답'));assert(at('test12').body.includes('단위도 함께'));}
 }
 assert.equal(mod.plan.minutes,225);assert.equal(mod.plan.phases.reduce((n,p)=>n+p.min,0),225);
 assert(mod.plan.note.includes('한 차시를 뜻하지'));assert.equal(mod.chapter.classroomBattle,false);
 const flow=mod.chapter.combustionFlow.map(p=>p.id);
 for(const[a,b]of[['mixplan','mixdo'],['fuelwatch','fuelcase'],['waterwatch','watercase'],['carbonwatch','carboncase'],['investigate','propose'],['makecard','share'],['share','revise']])assert(flow.indexOf(a)<flow.indexOf(b));
});

test('16확인은 네 성취기준 각4·여덟 응답 형식 각2이며 현재 교재/문항집과 같은 답을 쓴다',()=>{
 const checks=mod.chapter.check.map(id=>pool.find(q=>q.id===id));
 assert.deepEqual(Object.values(checks.reduce((a,q)=>(a[q.bookResponseForm]=(a[q.bookResponseForm]||0)+1,a),{})),Array(8).fill(2));
 assert.deepEqual(Object.values(checks.reduce((a,q)=>(a[workbook.questions.find(w=>w.id===q.bookQuestionId).standard]=(a[workbook.questions.find(w=>w.id===q.bookQuestionId).standard]||0)+1,a),{})),Array(4).fill(4));
 assert.equal(checks.filter(q=>q.contentVersion===COMBUSTION_QUESTION_VERSION||q.previousVersions?.some(p=>p.version===COMBUSTION_QUESTION_VERSION)).length,7);assert.equal(mod.classroomItems.filter(q=>q.contentVersion===COMBUSTION_READABILITY_VERSION).length,115);
 assert.equal(checks.filter(q=>q.responseContract.teacherRequired).length,4);
 // Independent expected responses, including matching order and required count units.
 const answers={1:2,81:2,19:['액체','베이킹 소다'],83:['석회수','뿌옇게'],53:['ㄴ','ㄷ','ㄱ'],118:['ㄴ','ㄷ','ㄱ'],56:['ㄴ','ㄱ','ㄷ'],120:['ㄴ','ㄱ','ㄷ'],41:[0,1,3],106:[0,3,4],59:['300mL','19초'],124:['2개','2개']};
 for(const[n,answer]of Object.entries(answers)){const q=checks.find(q=>q.id.endsWith('b'+n.padStart(3,'0')));assert.equal(gradeDaily(q,answer).status,'correct',n);}
 for(const q of checks.filter(q=>q.responseContract.teacherRequired))assert.equal(gradeDaily(q,q.responseContract.sample).status,'review');
 assert.equal(gradeDaily(checks.find(q=>q.id.endsWith('b124')),['2','2']).status,'wrong');
 assert.equal(gradeDaily(checks.find(q=>q.id.endsWith('b118')),['ㄱ','ㄷ','ㄴ']).status,'wrong');
});

test('여덟 자료는 교재와 같은 값이며 산소·생장·해결책의 해석 범위를 구별한다',()=>{
 assert.deepEqual(COMBUSTION_CASE_IDS,['mix','fuels','air','oxygen','water','carbon','ecosystem','solutions']);
 for(const[id,n]of COMBUSTION_CASE_IDS.map((id,i)=>[id,[17,33,49,60,68,81,98,124][i]])){
  const m=combustionCase(id),t=workbook.questions[n-1].table;assert.deepEqual(m.heads,t.머리);assert.deepEqual(m.rows,t.행);
 }
 assert.deepEqual(combustionCase('air').rows.map(r=>r.slice(1)),[[300,28],[600,47]]);
 assert(combustionCase('oxygen').reason.includes('산소가 모두 없어진 것은 아니')); assert(combustionCase('oxygen').conditions.includes('모든 연료가 이 비율에서 꺼진다는 기준이 아니'));
 assert(combustionCase('ecosystem').reason.includes('0.9mm'));assert(combustionCase('ecosystem').conditions.includes('가상 모형 값'));
 assert(combustionCase('solutions').reason.includes('피해에 대비'));assert(combustionCase('carbon').reason.includes('다른 기체'));
 const rows=COMBUSTION_CASE_IDS.map(id=>combustionCompareRecord(id,'unknown'));
 assert(rows.every(validCombustionCompareRow));assert(combustionComparisonProgress(rows).complete);
 assert.equal(combustionComparisonProgress([rows[0],rows[0],{...rows[1],kind:'직접 실험'}]).done,1);
 assert(!validCombustionCompareRow({...rows[0],material:{...rows[0].material,extra:1}}));
 for(const row of rows)assert.deepEqual(classroomTableData(unit.id,mod.classroomLab,[row]).rowValues(row),combustionCompareValues(row));
 const copy=combustionCase('air');copy.rows[0][1]=999;assert.equal(combustionCase('air').rows[0][1],300);
 const old=workbook.questions[48].table.행[0][1];workbook.questions[48].table.행[0][1]=999;assert.equal(combustionCase('air').rows[0][1],old);workbook.questions[48].table.행[0][1]=old;
 assert.throws(()=>combustionCase('constructor'));assert.throws(()=>combustionCompareRecord('mix','__proto__'));
});

function host(){const events=new Map(),controls=new Map();return{innerHTML:'',events,addEventListener:(t,f)=>events.set(t,f),removeEventListener:(t,f)=>{if(events.get(t)===f)events.delete(t);},querySelector:s=>{if(!controls.has(s))controls.set(s,{focus(){},disabled:false});return controls.get(s);},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-combustion-compare-${field}]`}}),act:value=>events.get('click')?.({target:{closest:()=>({dataset:{combustionCompareAct:value}})}})};}
test('비교 UI는 생각·설명 공개 뒤에만 기록하고 중복·교사 개인 저장·해제 뒤 콜백을 막는다',()=>{
 const h=host();let callback,records=0;const handle=mountCombustionCompare(h,{onRecord:rows=>{callback=rows;records++;}});
 h.act('record');assert.equal(records,0);h.change('prediction','unknown');h.act('record');assert.equal(records,0);
 h.act('reveal');h.act('record');assert.equal(records,1);h.act('record');assert.equal(records,1);
 callback[0].material.rows[0][0]='변경';assert.notEqual(handle.rows[0].material.rows[0][0],'변경');
 const copy=handle.rows;copy[0].prediction='fake';assert.equal(handle.rows[0].prediction,'unknown');
 handle.pause();h.change('case','air');h.act('again');assert.equal(records,1);
 handle.resume();h.change('case','air');h.change('prediction','unknown');h.act('reveal');h.act('record');assert.equal(records,2);
 handle.dispose();assert.equal(h.events.size,0);h.act('record');assert.equal(records,2);
 const a=host(),b=host(),one=mountCombustionCompare(a,{rows:[combustionCompareRecord('mix','unknown')],personal:false}),two=mountCombustionCompare(b,{isActive:()=>false});
 assert.equal(one.rows.length,0);assert.notEqual(a.innerHTML.match(/id="([^"]+)"/)[1],b.innerHTML.match(/id="([^"]+)"/)[1]);
 b.change('prediction','unknown');b.act('reveal');b.act('record');assert.equal(two.rows.length,0);one.dispose();two.dispose();
});

test('워밍업은 점수 없이 저장하고 이전 Daily 원고·답은 명시적 새 시도까지 보존한다',()=>{
 const current=mod.chapter.check.map(id=>pool.find(q=>q.id===id)),legacy=[items.find(q=>q.id==='c22-s62-u02-b118')];
 const state={paper:snapshotDailyPaper(legacy),answers:{[legacy[0].id]:'ㄱ / ㄴ / ㄷ'},graded:{[legacy[0].id]:'correct'}},bytes=JSON.stringify(state),resolved=resolveDailyPaper(current,state,{legacyList:[],pool});
 assert(resolved.readOnly);assert.deepEqual(resolved.questions,legacy);const next=startDailyPaper(state,resolved,current,'combustion-new-attempt');
 assert.deepEqual(next.paperHistory[0].state,state);assert.equal(JSON.stringify(state),bytes);assert.equal(next.paper.questions.length,16);
 assert(deckPredictionKey(unit.id,mod.chapter).endsWith('combustion-thinking-v1'));
 const slide=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.item==='c22-s62-u02-b118');
 assert(deckSlideRecordKey(mod.chapter,slide).includes('20261104-combustion-book'));assert.equal(deckQuestionSnapshot(slide,pool).id,slide.item);
 const src=fs.readFileSync(new URL('./deck.js',import.meta.url),'utf8'),fn=src.slice(src.indexOf('  function runPredict()'),src.indexOf('  // 실험 설계 3칸'));
 for(let picked=0;picked<3;picked++){
  const writes=[],buttons=[0,1,2].map(j=>({dataset:{j},classList:{toggle(name){assert.equal(name,'pick');}}}));
  const ctx=vm.createContext({u:unit.id,ch:mod.chapter,stage:{querySelector:()=>({querySelectorAll:()=>buttons})},memo:{get:()=>'',set:(key,value)=>writes.push([key,value])},deckPredictionKey,G:{say:()=>Promise.resolve()},cancelAuto(){},auto(){}});
  new vm.Script(fn+'\nrunPredict();').runInContext(ctx);buttons[picked].onclick();assert.deepEqual(writes,[[deckPredictionKey(unit.id,mod.chapter),picked]]);
 }
});

test('선택 기록15개와 자료 비교를 분리하고 실제 사례의 출처를 제시한다',()=>{
 const l=withOptionalClassroomRecords(unit.id,rawLesson);
 assert.equal(l.explore.home,rawLesson.explore.home);assert.equal(l.explore.records.rowsKey,'combustionInquiryRows');assert.equal(mod.classroomLab.rowsKey,'combustionCompareRows');
 assert.deepEqual(l.explore.records.config,inquiry);assert.equal(inquiry.activities.length,15);
 assert.deepEqual(inquiry.activities.map(a=>a.id),mod.chapter.combustionFlow.filter(p=>p.kind==='activity').map(p=>p.id));
 assert.equal(l.elaborate.report,false);assert.equal(rawLesson.explore.records,undefined);assert.equal(withOptionalClassroomRecords(unit.id,l),l);
 const page=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.id==='sources');
 assert(page.body.includes('같은 기관'));assert(page.body.includes('2000년대 중반'));assert.equal(combustionSources.length,2);
 for(const r of combustionSources){assert(page.body.includes(r.url));assert.equal(r.readOn,'2026-11-04');assert(new URL(r.url).hostname.endsWith('noaa.gov'));}
});
test('실제 renderDeck의 활동15개는 자동 타이머 없이 명시적 다음으로 진행한다',()=>{
 const r=run('combustion-deck-events.mjs');assert.equal(r.manualActivities,15);assert(r.noTimerOnActivity&&r.explicitNextWorks&&r.comparisonClickDoesNotAdvance&&r.staleLegacyBattleIgnored);
});
test('실제 수업·Daily16·선택 기록은 교사 저장을 읽지 않고 해제 뒤 쓰기를 막는다',()=>{
 const r=run('combustion-classroom-routes.mjs');assert.equal(r.checksSharedWithDaily,16);assert.equal(r.legacyDailyQuestions,0);assert(r.priorBankOnlyDailyWasUnavailable);
 assert.equal(r.teacherStudentReads,0);assert.equal(r.teacherStudentWrites,0);
 assert(r.originalReportAndObservationStatePreserved&&r.releaseDisposesMountedActivities&&r.lateReleasedCallbackCannotWrite&&r.lateOptionalRecordCallbackCannotWrite&&r.lateOptionalRecordHandleDisposed);
});
