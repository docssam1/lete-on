import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const plain=v=>JSON.parse(JSON.stringify(v));
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const p={id:'h1-06',title:'2026년 고1 6월 수학 기출',exam:'2026년 6월 학평',level:'1',scope:'공통수학1 · 방정식·부등식까지',files:{problem:'https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_mun_D7P5UME3.pdf',explanation:'https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_hsj_AX588329.pdf'}};
const states=Object.fromEntries(Array.from({length:30},(_,i)=>[i+1,i<5?'correct':i<10?'helped':i<15?'wrong':i<20?'unanswered':'unlearned']));
const scoreData=()=>({verified:true,sourceUrl:p.files.problem,points:Object.fromEntries(Array.from({length:30},(_,i)=>[i+1,i<10?4:3]))});
function setup(){
 const w={PlannerMockSchedule:{resolvePaper:v=>v===p.id||v?.exam===p.exam&&v?.level===p.level?p:null},PlannerMockEvidence:{CAUSES:{unknown:'확인 전',concept:'개념 연결',strategy:'풀이 선택'}},PlannerMockItemData:{[p.id]:{items:Array.from({length:30},(_,i)=>({number:i+1,unitId:i<15?'c1-poly':'c1-quadratic',requires:i<15?['c1-poly']:['c1-quadratic'],unverified:false}))}}};
 const ctx=vm.createContext({window:w,URL});vm.runInContext(read('planner-mock-items.js'),ctx);vm.runInContext(read('planner-mock-full.js'),ctx);const F=w.PlannerMockFull;
 const record=(extra={})=>({...F.prefill(p),id:'record-one',date:'2026-11-06',answers:{...states},correct:5,helped:5,unlearned:10,cause:'concept',timing:'timed',limit:100,minutes:97,...extra});
 return{w,F,record};
}

test('whole-paper prefill selects all 30 without asserting that any new unit has been learned',()=>{
 const {F}=setup(),d=F.prefill(p,['c1-poly','not-a-unit']);assert.equal(d.id,'');assert.equal(d.paperId,p.id);assert.equal(d.rangeMode,'whole');assert.equal(d.questionSelection.mode,'whole');assert.deepEqual(plain(d.questionSelection.selected),Array.from({length:30},(_,i)=>i+1));assert.deepEqual(plain(d.questionSelection.learnedUnitIds),['c1-poly']);
 assert.deepEqual(plain(d.questionSelection.excludedUnlearned),[]);assert.deepEqual(plain(d.questionSelection.unmapped),[]);assert.equal(F.prefill('unknown'),null);assert.equal(F.analyze(d),null,'a fresh unfilled form is not a completed exam');
});
test('official verified weights yield only independent points; learned-range performance excludes unlearned but includes unanswered',()=>{
 const {F,record}=setup(),r=record(),before=JSON.stringify(r),a=F.analyze(r,scoreData());assert.equal(a.total,30);assert.deepEqual(plain(a.counts),{correct:5,helped:5,wrong:5,unanswered:5,unlearned:10});assert.equal(a.learned,20);assert.equal(a.percent,25);assert.equal(a.pending,10);
 assert.equal(a.score.available,true);assert.equal(a.score.earned,20);assert.equal(a.score.max,100);assert.deepEqual(plain(a.score.byState),{correct:20,helped:20,wrong:15,unanswered:15,unlearned:30});assert.equal(JSON.stringify(r),before);
 assert.equal(a.byUnit.reduce((sum,u)=>sum+u.total,0),30);assert.equal(a.units.reduce((sum,u)=>sum+u.missed+u.helped,0),15);assert.equal(a.grade,undefined);assert.equal(a.percentile,undefined);
});
test('scores require every official weight and exact source identity; no familiar 2/3/4 pattern is inferred',()=>{
 const {F,w,record}=setup(),r=record();assert.equal(F.analyze(r).score.available,false);w.PlannerMockScoreData={[p.id]:scoreData()};assert.equal(F.analyze(r).score.earned,20);
 const missing=scoreData();delete missing.points[30];const extra=scoreData();extra.points[31]=4;const lowTotal=scoreData();lowTotal.points[30]=2;const wrongType=scoreData();wrongType.points[1]='4';
 for(const bad of [missing,extra,lowTotal,wrongType,{...scoreData(),verified:false},{...scoreData(),sourceUrl:'https://example.com/exam.pdf'},{...scoreData(),sourceUrl:p.files.problem.replace('20260604','20250604')},{...scoreData(),sourceUrl:p.files.problem.replace('https:','http:')},{...scoreData(),sourceUrl:'javascript:alert(1)'}])assert.equal(F.analyze(r,bad).score.available,false);
 const explanation={...scoreData(),sourceUrl:p.files.explanation};assert.equal(F.analyze(r,explanation).score.available,true);
});
test('unknown, unverified, missing or ambiguous unit metadata is separate and never creates an automatic unit repair',()=>{
 const {F,w,record}=setup(),items=w.PlannerMockItemData[p.id].items;items[9].unverified=true;items[10].requires=['unknown-unit'];items.splice(11,1);items.push({...items[12]});
 const a=F.analyze(record(),scoreData());assert.ok(a.unmapped.numbers.includes(10));assert.ok(a.unmapped.numbers.includes(11));assert.ok(a.unmapped.numbers.includes(12));assert.ok(a.unmapped.numbers.includes(14));assert.equal(a.byUnit.reduce((n,u)=>n+u.total,0)+a.unmapped.total,30);
 assert.equal(a.units.reduce((n,u)=>n+u.missed+u.helped,0),a.pending+a.counts.helped-a.unmapped.missed-a.unmapped.helped);assert.ok(a.units.every(u=>u.unitId&&u.title!=='단원 확인 대기'));assert.equal(a.score.earned,20,'unit review status does not alter official weighted total');
});
test('all-unlearned papers have no learned performance or remedial unit and are not treated as a completed curriculum',()=>{
 const {F,record}=setup(),r=record({answers:Object.fromEntries(Array.from({length:30},(_,i)=>[i+1,'unlearned'])),correct:0,helped:0,unlearned:30}),a=F.analyze(r,scoreData());assert.equal(a.learned,0);assert.equal(a.percent,null);assert.equal(a.score.earned,0);assert.equal(a.units.length,0);assert.equal(a.coveredUnitIds.length,0);assert.match(F.summary(r),/배운 범위 없음/);assert.doesNotMatch(F.summary(r),/NaN|Infinity/);
});
test('restore marks only a valid exact-identity full observation and JSON round trips retain the same analysis',()=>{
 const {F,record}=setup(),r=record(),meta=F.restoreRecord(r);assert.deepEqual(plain(meta),{fullPaper:{version:1,paperId:p.id}});const restored=JSON.parse(JSON.stringify({...r,...meta}));assert.deepEqual(plain(F.analyze(restored,scoreData())),plain(F.analyze(r,scoreData())));
 const missing={...r,answers:{...r.answers}};delete missing.answers[30];
 const invalid=[{...r,level:'2'},{...r,exam:'2025년 6월 학평'},{...r,correct:6},missing,{...r,answers:{...r.answers,31:'correct'}},{...r,answers:{...r.answers,1:'unknown-state'}},{...r,questionSelection:{...r.questionSelection,mode:'current'}},{...r,questionSelection:{...r.questionSelection,projected:true}},{...r,questionSelection:{...r.questionSelection,selected:r.questionSelection.selected.slice(0,29)}},{...r,questionSelection:{...r.questionSelection,excludedOther:[1]}}];
 for(const bad of invalid){assert.deepEqual(plain(F.restoreRecord(bad)),{});assert.equal(F.analyze(bad),null);assert.equal(F.summary(bad),'');assert.deepEqual(plain(F.notes(bad)),[]);}
 assert.deepEqual(plain(F.restoreRecord({exam:p.exam,level:p.level,total:30,correct:20,helped:0,unlearned:0})),{},'aggregate-only history is not promoted to item-level analysis');
});
test('screen/print summary escapes labels, has accessible unit rows and does not copy any answer-key or problem payload',()=>{
 const {F,w,record}=setup(),r=record(),old=w.PlannerMockItems.UNIT['c1-poly'].title;w.PlannerMockItems.UNIT['c1-poly'].title='<img src=x onerror=alert(1)>';
 w.PlannerMockItemData[p.id].items[0].question='SECRET ORIGINAL';w.PlannerMockItemData[p.id].items[0].answer='SECRET ANSWER';const data={...scoreData(),answerKey:'SECRET KEY',solutions:'SECRET SOLUTION'},html=F.summary(r,data);
 assert.match(html,/data-mock-full-analysis/);assert.match(html,/<caption>/);assert.match(html,/scope="col"/);assert.match(html,/scope="row"/);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img|SECRET ORIGINAL|SECRET ANSWER|SECRET KEY|SECRET SOLUTION/);assert.match(html,/20 \/ 100점/);assert.match(html,/수행률 25%/);assert.match(html,/target="_blank" rel="noopener noreferrer"/);
 assert.ok(F.notes(r,data).some(line=>line.includes('20/100점')));w.PlannerMockItems.UNIT['c1-poly'].title=old;
});
test('real ME/MI saving supports whole 30-question observations and keeps historical A/B variants distinct',()=>{
 const w={},ctx=vm.createContext({window:w,URL});for(const f of ['planner-mock-evidence.js','planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-items-data.js','planner-mock-items.js','planner-mock-full.js'])vm.runInContext(read(f),ctx,{filename:f});
 const {PlannerMockFull:F,PlannerMockEvidence:E}=w;
 for(const id of ['h1-06','y2018-h2-03-a','y2018-h2-03-b']){const d=F.prefill(id),i={...d,questionSelection:JSON.stringify(d.questionSelection),date:'2026-11-06',timing:'untimed',minutes:'45',cause:'concept',review:'none',startMonth:'2026-11',months:'1',...Object.fromEntries(Array.from({length:30},(_,n)=>['question-'+(n+1),n===29?'unanswered':'correct']))},saved=E.save(null,i);assert.equal(saved.error,null);const r=saved.state.records[0],a=F.analyze(r);assert.equal(a.paperId,id);assert.equal(a.counts.correct,29);assert.equal(a.pending,1);assert.equal(a.score.available,false);assert.equal(F.restoreRecord(E.restore(saved.state).records[0]).fullPaper.paperId,id);}
});
