import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import vm from'node:vm';
import{execFileSync}from'node:child_process';
import{fileURLToPath}from'node:url';
import{revisedClassroom,classroomQuestions,classroomTableData,withOptionalClassroomRecords}from'./revised-lesson.js';
import*as book from'../data/book/c22-s62-u04.book.js';
import{items,unit}from'../data/units/c22-s62-u04.js';
import{lesson}from'../data/units/c22-s62-u04.lesson.js';
import{inquiry}from'../data/activities/c22-s62-u04.inquiry.js';
import{careerSources}from'../data/activities/c22-s62-u04.resources.js';
import{workbook}from'../data/book/c22-s62-u04.workbook.js';
import{buildSlides,deckSlideIndex}from'./deck.js';
import{CAREER_CASE_IDS,careerCase,careerCompareRecord,careerCompareValues,validCareerCompareRow,careerComparisonProgress}from'./career-compare-model.js';
import{mountCareerCompare}from'./lab-career-compare.js';
import{gradeDaily}from'./daily-grade.js';
import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper}from'./daily-paper-state.js';
import{deckPredictionKey,deckSlideRecordKey,deckQuestionSnapshot}from'./deck-answer-state.js';
const mod=await revisedClassroom(unit.id,book),pool=classroomQuestions(mod,items);
const run=file=>JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/'+file,import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));

test('미래 문제 조사·토의와 다양한 진로의 과학을17활동으로 배우며 진로 확정·보고서를 요구하지 않는다',()=>{
 for(const mode of['self','teach']){
  const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode),at=id=>slides.find(s=>s.id===id),html=slides.map(s=>s.body).join('');
  assert.equal(slides.length,mode==='self'?58:59);assert.equal(slides.filter(s=>s.kind==='activity').length,17);assert(slides.every(s=>s.phaseObj));
  assert.deepEqual([...new Set(slides.flatMap(s=>s.standards||[]))].sort(),['6과16-01','6과16-02']);
  assert.equal(slides[deckSlideIndex(mod.chapter,slides,'s2')].id,'recall');assert.equal(at('firstclose').kind,'break');assert.deepEqual(slides.filter(s=>s.mount).map(s=>s.id),['lab']);
  assert(!/보고서 쓰기|보고서를 작성|undefined|\[object Object\]|[\u3040-\u30ff]/.test(html));assert(!slides.some(s=>s.modelLab||s.mount==='scene'||s.kind==='fieldwork'));
  for(const s of slides.filter(s=>!s.item&&!['end','plan'].includes(s.id)))assert(mod.chapter.slideCues[s.id],s.id);
  assert(at('futurequestion').body.includes('현재 나타나는 변화'));assert(at('discuss').body.includes('자료와 까닭'));assert(at('interestsdo').body.includes('관심이 여러 가지'));
  assert(at('photodo').body.includes('자동 기능'));assert(at('photodo').body.includes('직접 촬영한 경우'));assert(at('lightplan').body.includes('개인정보'));
  assert(at('sounddo').body.includes('책상 밖으로 나온 길이만'));assert(at('sounddo').body.includes('실제 피아노를 조율한 활동과는 구별'));
  assert(at('farmdo').body.includes('모든 식물의 기준'));assert(at('myscience').body.includes('확정할 필요는 없어요'));assert(at('test16').body.includes('career-draw-space'));
  if(mode==='self')assert(at('test14').body.includes('단위도 함께'));
 }
 assert.equal(mod.plan.minutes,250);assert.equal(mod.plan.phases.reduce((n,p)=>n+p.min,0),250);assert(mod.plan.note.includes('한 차시를 뜻하지'));assert.equal(mod.chapter.classroomBattle,false);
 const ids=mod.chapter.careerFlow.map(p=>p.id);for(const[a,b]of[['findsource','futurequestion'],['comparemethods','discuss'],['lightplan','photodo'],['research','introduce'],['introduce','feedback'],['feedback','myscience']])assert(ids.indexOf(a)<ids.indexOf(b));
});

test('16확인은 두 성취기준 각8·8형식 각2이며 교재의 답과 버전을 그대로 쓴다',()=>{
 const list=mod.chapter.check.map(id=>pool.find(q=>q.id===id));assert.equal(list.length,16);assert.equal(list.filter(q=>q.responseContract.teacherRequired).length,4);
 assert.deepEqual(Object.values(list.reduce((a,q)=>(a[q.bookResponseForm]=(a[q.bookResponseForm]||0)+1,a),{})),Array(8).fill(2));
 assert.deepEqual(Object.values(list.reduce((a,q)=>{const s=workbook.questions.find(w=>w.id===q.bookQuestionId).standard;a[s]=(a[s]||0)+1;return a;},{})),[8,8]);
 const answers={1:2,19:['사실','예상'],5:['ㄴ','ㄱ','ㄷ'],7:['ㄱ','ㄴ','ㄷ'],25:[0,1,3],27:['8일','예상'],113:4,116:['수분','온도'],117:['ㄴ','ㄱ','ㄷ'],120:['ㄱ','ㄴ','ㄷ'],122:[0,1,4],123:['35℃','7℃']};
 for(const[n,a]of Object.entries(answers))assert.equal(gradeDaily(list.find(q=>q.id.endsWith('b'+n.padStart(3,'0'))),a).status,'correct',n);
 for(const q of list.filter(q=>q.responseContract.teacherRequired))assert.equal(gradeDaily(q,q.responseContract.sample).status,'review');
 for(const answer of[['35','7'],['35℃','7분'],['35℃','7W']])assert.equal(gradeDaily(list.find(q=>q.id.endsWith('b123')),answer).status,'wrong');
 assert.equal(pool.filter(q=>q.contentVersion).length,74);assert.equal(pool.filter(q=>q.previousVersions).length,74);
});

test('8자료는 현재 정보·예상·측정/작동·조건과 직업 속 과학을 실제 조사와 구별한다',()=>{
 assert.deepEqual(CAREER_CASE_IDS,['current','forecast','sensor','methods','photo','sound','shade','jobs']);
 for(const[id,n]of[['current',1],['forecast',17],['sensor',43],['methods',49],['sound',91],['shade',123],['jobs',124]]){const m=careerCase(id),t=workbook.questions[n-1].table;assert.deepEqual(m.heads,t.머리);assert.deepEqual(m.rows,t.행);}
 assert(careerCase('forecast').reason.includes('8일'));assert(careerCase('forecast').conditions.includes('가상'));assert(careerCase('sensor').reason.includes('ㄱ은 흙의 수분'));
 assert(careerCase('methods').reason.includes('예산'));assert(careerCase('photo').reason.includes('대상이나 카메라'));assert(careerCase('sound').reason.includes('1초 동안'));
 assert(careerCase('shade').reason.includes('7℃'));assert(careerCase('jobs').reason.includes('관심 있는 다른 직업'));
 const rows=CAREER_CASE_IDS.map(id=>careerCompareRecord(id,'unknown'));assert(rows.every(validCareerCompareRow));assert(careerComparisonProgress(rows).complete);
 assert.equal(careerComparisonProgress([rows[0],rows[0],{...rows[1],kind:'직접 조사'}]).done,1);assert(!validCareerCompareRow({...rows[0],material:{...rows[0].material,extra:1}}));
 for(const r of rows)assert.deepEqual(classroomTableData(unit.id,mod.classroomLab,[r]).rowValues(r),careerCompareValues(r));
 const copy=careerCase('shade');copy.rows[0][1]='999℃';assert.equal(careerCase('shade').rows[0][1],'35℃');
 const old=workbook.questions[122].table.행[0][1];workbook.questions[122].table.행[0][1]='999℃';assert.equal(careerCase('shade').rows[0][1],old);workbook.questions[122].table.행[0][1]=old;
 assert.throws(()=>careerCase('constructor'));assert.throws(()=>careerCompareRecord('current','__proto__'));
});

function host(){const events=new Map(),controls=new Map();return{innerHTML:'',events,addEventListener:(t,f)=>events.set(t,f),removeEventListener:(t,f)=>{if(events.get(t)===f)events.delete(t);},querySelector:s=>{if(!controls.has(s))controls.set(s,{focus(){},disabled:false});return controls.get(s);},change:(field,value)=>events.get('change')?.({target:{value,matches:s=>s===`[data-career-compare-${field}]`}}),act:value=>events.get('click')?.({target:{closest:()=>({dataset:{careerCompareAct:value}})}})};}
test('처음 생각·설명 공개 뒤에만 비교를 남기고 일시정지·해제·비활성 콜백을 막는다',()=>{
 const h=host();let callback,count=0;const handle=mountCareerCompare(h,{onRecord:rows=>{callback=rows;count++;}});
 h.act('record');h.change('prediction','unknown');h.act('record');assert.equal(count,0);h.act('reveal');h.act('record');assert.equal(count,1);h.act('record');assert.equal(count,1);
 callback[0].material.rows[0][0]='바꿈';assert.notEqual(handle.rows[0].material.rows[0][0],'바꿈');const copy=handle.rows;copy[0].prediction='fake';assert.equal(handle.rows[0].prediction,'unknown');
 handle.pause();h.change('case','photo');h.act('again');assert.equal(count,1);handle.resume();h.change('case','photo');h.change('prediction','unknown');h.act('reveal');h.act('record');assert.equal(count,2);handle.dispose();assert.equal(h.events.size,0);
 const a=host(),b=host(),one=mountCareerCompare(a,{rows:[careerCompareRecord('current','unknown')],personal:false}),two=mountCareerCompare(b,{isActive:()=>false});assert.equal(one.rows.length,0);assert.notEqual(a.innerHTML.match(/id="([^"]+)"/)[1],b.innerHTML.match(/id="([^"]+)"/)[1]);b.change('prediction','unknown');b.act('reveal');b.act('record');assert.equal(two.rows.length,0);one.dispose();two.dispose();
});

test('무채점 워밍업과 이전 계획 문항의 Daily 원고·답을 새 과학 문항과 섞지 않는다',()=>{
 assert(!Object.hasOwn(mod.chapter.careerInteraction.predict,'answer'));assert(deckPredictionKey(unit.id,mod.chapter).endsWith('career-thinking-v1'));
 const current=mod.chapter.check.map(id=>pool.find(q=>q.id===id)),legacy=[items.find(q=>q.id==='c22-s62-u04-b116')],state={paper:snapshotDailyPaper(legacy),answers:{[legacy[0].id]:'검토 / 미실행'},graded:{[legacy[0].id]:'correct'}},bytes=JSON.stringify(state),resolved=resolveDailyPaper(current,state,{legacyList:[],pool});
 assert(resolved.readOnly);assert.deepEqual(resolved.questions,legacy);const next=startDailyPaper(state,resolved,current,'career-new-attempt');assert.deepEqual(next.paperHistory[0].state,state);assert.equal(JSON.stringify(state),bytes);assert.equal(next.paper.questions.length,16);
 const slide=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.item==='c22-s62-u04-b116');assert(deckSlideRecordKey(mod.chapter,slide).includes('20261104-career-book'));assert.equal(deckQuestionSnapshot(slide,pool).id,slide.item);
 const source=fs.readFileSync(new URL('./deck.js',import.meta.url),'utf8'),fn=source.slice(source.indexOf('  function runPredict()'),source.indexOf('  // 실험 설계 3칸'));
 for(let picked=0;picked<3;picked++){const writes=[],buttons=[0,1,2].map(j=>({dataset:{j},classList:{toggle(){}}})),ctx=vm.createContext({u:unit.id,ch:mod.chapter,stage:{querySelector:()=>({querySelectorAll:()=>buttons})},memo:{get:()=>'',set:(key,value)=>writes.push([key,value])},deckPredictionKey,G:{say:()=>Promise.resolve()},cancelAuto(){},auto(){}});new vm.Script(fn+'\nrunPredict();').runInContext(ctx);buttons[picked].onclick();assert.deepEqual(writes,[[deckPredictionKey(unit.id,mod.chapter),picked]]);}
});

test('선택 활동 기록17개와 비교 기록을 분리하고 교재와 같은 공식·제작사 자료6개를 제시한다',()=>{
 const l=withOptionalClassroomRecords(unit.id,lesson);assert.equal(l.explore.home,lesson.explore.home);assert.equal(l.explore.records.rowsKey,'careerInquiryRows');assert.equal(mod.classroomLab.rowsKey,'careerCompareRows');assert.equal(l.elaborate.report,false);assert.equal(lesson.explore.records,undefined);assert.equal(withOptionalClassroomRecords(unit.id,l),l);
 assert.equal(inquiry.activities.length,17);assert.deepEqual(inquiry.activities.map(a=>a.id),mod.chapter.careerFlow.filter(p=>p.kind==='activity').map(p=>p.id));
 const references=buildSlides(mod.chapter,mod.art,mod.plan,pool,'self').find(s=>s.id==='references');assert.equal(careerSources.length,6);for(const r of careerSources){assert(references.body.includes(r.url));assert.equal(r.readOn,'2026-11-04');}
 assert.equal(careerSources.find(s=>s.id==='agricultural-projections').published,'2025-01-09');
});

test('실제 renderDeck의 직접 활동17개는 자동 넘김 없이 진행하고 비교 안 클릭·옛 배틀은 이동하지 않는다',()=>{const r=run('career-deck-events.mjs');assert.equal(r.manualActivities,17);assert(r.noTimerOnActivity&&r.explicitNextWorks&&r.comparisonClickDoesNotAdvance&&r.staleLegacyBattleIgnored);});
test('실제 수업·Daily16·선택 기록은 교사 개인 저장을 읽지 않고 해제 뒤 늦은 쓰기를 막는다',()=>{const r=run('career-classroom-routes.mjs');assert.equal(r.checksSharedWithDaily,16);assert.equal(r.legacyDailyQuestions,0);assert(r.priorBankOnlyDailyWasUnavailable);assert.equal(r.teacherStudentReads,0);assert.equal(r.teacherStudentWrites,0);assert(r.originalReportAndObservationStatePreserved&&r.releaseDisposesMountedActivities&&r.lateReleasedCallbackCannotWrite&&r.lateOptionalRecordCallbackCannotWrite&&r.lateOptionalRecordHandleDisposed);});
