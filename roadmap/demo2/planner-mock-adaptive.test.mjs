import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const read=file=>readFileSync(new URL(file,import.meta.url),'utf8');
const scripts=[
 'planner-levels.js','planner.js','demo-content.js','planner-intake.js',
 'planner-progression.js','planner-standard-data.js','planner-high-study.js',
 'planner-standard.js','planner-curriculum.js','planner-mock-evidence.js',
 'planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js',
 'planner-mock-scopes.js','planner-mock-matching.js','planner-mock-feedback.js',
 'planner-learning-evidence.js','planner-goal-curriculum.js'
];
class Today extends Date {constructor(...args){super(...(args.length?args:['2026-11-06T03:00:00Z']));}static now(){return Date.parse('2026-11-06T03:00:00Z');}}
const window={},context=vm.createContext({window,Date:Today});
for(const file of scripts)vm.runInContext(read(file),context,{filename:file});
const {PlannerCurriculum:C,PlannerMockSchedule:S,PlannerMockEvidence:E,
 PlannerMockFeedback:F,PlannerMockMatching:M,PlannerMockLibrary:B,
 PlannerLearningEvidence:L}=window;
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const answers=(stage='공통수학1')=>({grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:stage,schoolStatus:'progress',deepCourse:'none',deepBook:'none',calc:'none'});
const inputs=extra=>({enabled:'on',spacing:'1',boundary:'',...extra});
const boundary=(a,id,extra={})=>S.update(null,inputs({boundary:id,...extra}),a).state;
const record=(paperId='h1-06',extra={})=>{const p=B.find(paperId);return{id:'source',exam:p.exam,level:p.level,date:'2026-11-05',scope:'이차방정식',attempt:'first',timing:'untimed',minutes:25,limit:0,total:10,unlearned:2,correct:6,helped:1,cause:'strategy',review:'none',startMonth:'2026-11',months:1,savedOn:'2026-11-05',rangeMode:'selected',units:[{title:'이차방정식',missed:1,helped:1,cause:'concept'}],...extra};};
const plan=(a=answers(),schedule,records=[],f=fields,state)=>S.attach(C.model(a,f,state),a,f,schedule,records);
const row=(m,id)=>m.mockCheckPlan.rows.find(r=>r.id===id);
const plain=v=>JSON.parse(JSON.stringify(v));
const feedback=(a,s,records)=>F.attach(plan(a,s,records),{version:1,records,schedule:s});

test('production scope groups keep 2026 checkpoints separate from incompatible older high-school curricula',()=>{
 const catalog=M.catalog();
 assert.ok(S.PAPERS.every(p=>catalog.find(c=>c.id===p.id)?.checkpoint===p.id));
 for(const month of ['03','06','09','10']){
  assert.equal(catalog.find(p=>p.id==='h1-'+month).scopeKey,catalog.find(p=>p.id==='y2025-h1-'+month).scopeKey);
 }
 for(const p of catalog.filter(p=>p.level==='2'&&p.year<2026&&p.scopeKey))assert.equal(p.checkpoint,null,p.id+' must not certify the 2022 curriculum');
 assert.ok(window.PlannerMockScopeGroups.every(g=>g.sourceUrls.length&&g.sourceUrls.every(u=>/^https:\/\//.test(u))));
 assert.equal(M.sourceFor(record('h2-03')).scopeKey===M.sourceFor(record('y2025-h2-03')).scopeKey,false);
});

test('actual subject completion and study pace move the real high-1 date; age alone does not',()=>{
 const a=answers(),slow=plan(a),fast=plan(a,boundary(a,'c1-equations'));
 assert.equal(row(fast,'h1-06').start,0);
 assert.equal(row(fast,'h1-06').practiceDate,'2026-11-06');
 assert.equal(row(fast,'h1-06').selectedPaperId,'h1-06');
 assert.equal(row(slow,'h1-06').ready,6);
 const three=plan(a,null,[],fields,{version:1,periods:{highMonths:3}}),nine=plan(a,null,[],fields,{version:1,periods:{highMonths:9}});
 assert.equal(row(three,'h1-06').ready,3);assert.equal(row(nine,'h1-06').ready,9);
 assert.equal(row(plan({...a,grade:'4'},null,[],{...fields,grade:'4'}),'h1-06').ready,row(slow,'h1-06').ready);
 const untouched=C.model(a,fields);assert.deepEqual(plain(slow.lanes.filter(l=>l.id!=='mockCheck')),plain(untouched.lanes));
});

test('even partial exposure excludes a paper from initial assignment without advancing course mastery',()=>{
 const a=answers(),s=boundary(a,'c1-equations'),r=record(),before=plain(r);
 s.assignments={'h1-06':'h1-06'};
 const m=plan(a,s,[r]);assert.equal(row(m,'h1-06').selectedPaperId,'y2025-h1-06');
 assert.equal(row(m,'h1-09').ready,row(plan(a,s),'h1-09').ready);
 assert.equal(S.prefill('h1-06',m).exam,'2025년 6월 학평');
 assert.deepEqual(plain(r),before);
 const exhausted=plan(a,S.markSeen(s,'y2025-h1-06'),[r]);
 assert.equal(row(exhausted,'h1-06').pending,true);
 assert.equal(S.prefill('h1-06',exhausted),null);
 assert.equal(S.paperLinks(row(exhausted,'h1-06')),'');
});

test('legacy completion and explicitly chosen older completion retain their exact identities after restoration',()=>{
 const s=S.restore({version:1,seenPaperIds:['y2024-h1-03'],overrides:{'h1-03':{status:'done'},'h1-06':{status:'done',month:'2026-10',paperId:'y2025-h1-06'}}});
 const restored=S.restore(plain(s)),used=M.seen([],restored),m=plan(answers(),restored);
 assert.ok(used.has('h1-03'));assert.ok(used.has('y2025-h1-06'));assert.ok(!used.has('h1-06'));
 assert.equal(row(m,'h1-03').start,null);assert.equal(row(m,'h1-03').selectedPaperId,'h1-03');
 assert.equal(row(m,'h1-06').selectedPaperId,'y2025-h1-06');assert.equal(row(m,'h1-06').suggested,'2026-10');
 assert.deepEqual(plain(restored),plain(s));
});

test('a ready learner uses a released older year and never receives a paper before its actual exam date',()=>{
 const a=answers(),s=boundary(a,'c1-equations'),m=plan(a,s,[],{...fields,year:'2025',mon:'1'}),r=row(m,'h1-06');
 assert.equal(r.selectedPaperId,'y2025-h1-06');
 assert.equal(r.suggested,'2025-06');
 assert.ok(r.practiceDate>=B.find(r.selectedPaperId).examDate);
 assert.equal(r.practiceDate.slice(0,7),r.suggested);
 for(const p of m.mockCheckPlan.rows.filter(r=>r.start!==null&&!r.pending))assert.ok(M.available(B.find(p.selectedPaperId),p.practiceDate));
});

test('partial June results schedule an unseen June in another year; exhaustion waits without a same-paper or broader substitute',()=>{
 const a=answers(),s=boundary(a,'c1-equations'),r=record(),m=feedback(a,s,[r]),p=m.mockFeedback.plans[0];
 assert.equal(p.paper.id,'y2025-h1-06');assert.equal(p.paper.scopeKey,M.sourceFor(r).scopeKey);
 assert.equal(p.paper.selectionRequired,true);assert.equal(p.paper.rangeMode,'selected');
 assert.equal(p.start,'2026-11-05');assert.equal(p.end,'2026-11-19');assert.equal(p.recheck,'2026-11-26');
 assert.equal(F.prefill(m,r.id).exam,'2025년 6월 학평');
 const exhausted=feedback(a,S.markSeen(s,'y2025-h1-06'),[r]),waiting=exhausted.mockFeedback.plans[0];
 assert.equal(waiting.paper.pending,true);assert.equal(waiting.recheck,p.recheck);assert.equal(F.prefill(exhausted,r.id),null);
 assert.ok(exhausted.lanes.find(l=>l.id==='mockRetest').blocks[0].calendarStart===p.recheck);
 assert.doesNotMatch(F.render(exhausted),/data-mock-feedback-record="source"/);
});

test('initial checks and rechecks never reserve the same paper and shifted monthly blocks carry the shifted calendar date',()=>{
 const a=answers(),s=boundary(a,'c1-equations',{'h1-06-status':'planned'}),m=feedback(a,s,[record()]);
 const active=m.mockCheckPlan.rows.filter(r=>r.start!==null&&!r.pending),rechecks=m.mockFeedback.plans.filter(p=>p.paper.fresh).map(p=>p.paper.id);
 const all=[...active.map(r=>r.selectedPaperId),...rechecks];assert.equal(new Set(all).size,all.length);
 assert.equal(row(m,'h1-06').pending,true,'the only unexposed June is reserved for the recheck');
 for(const b of m.lanes.find(l=>l.id==='mockCheck').blocks){const r=row(m,b.slotId);assert.equal(b.calendarStart.slice(0,7),r.suggested);assert.equal(r.practiceDate,b.calendarStart);assert.ok(b.calendarStart>='2026-11-26');}
});

test('private profile roundtrip retains assignment, exposure and results without leaking to another owner',()=>{
 const a=answers(),schedule=boundary(a,'c1-equations'),r=record(),m=feedback(a,schedule,[r]);
 const value=L.restore({version:1,concepts:{[L.TOPICS[0].id]:'review'},work:{[JSON.stringify(['기본정석','2026-11','page'])]:{planned:30,completed:12}},mock:{...F.sync({version:1,records:[r],schedule},m),schedule:S.sync(S.markSeen(schedule,'y2024-h1-03'),m)}});
 const store=()=>{const data=new Map();return{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};};
 const w={localStorage:store(),sessionStorage:store(),RoadmapMember:{user_id:'owner-a'}},cx=vm.createContext({window:w});
 vm.runInContext(read('planner-storage.js'),cx,{filename:'planner-storage.js'});
 w.PlannerStorage.setItem('gfield.demo2.v1',JSON.stringify({version:2,learningEvidence:value}));
 w.RoadmapMember={user_id:'owner-b'};assert.equal(w.PlannerStorage.getItem('gfield.demo2.v1'),null);
 w.RoadmapMember={user_id:'owner-a'};
 const restored=L.restore(JSON.parse(w.PlannerStorage.getItem('gfield.demo2.v1')).learningEvidence);
 assert.deepEqual(plain(restored),plain(value));assert.equal(restored.mock.records[0].exam,r.exam);
 assert.equal(restored.mock.feedback.assignments.source.paperId,'y2025-h1-06');
 const rebuilt=F.attach(plan(a,restored.mock.schedule,restored.mock.records),restored.mock);
 assert.equal(rebuilt.mockFeedback.plans[0].paper.id,m.mockFeedback.plans[0].paper.id);
 assert.equal(rebuilt.mockFeedback.plans[0].recheck,m.mockFeedback.plans[0].recheck);
});

test('automatic choices expose external official PDF links, not embedded source copies, and preserve closed answers',()=>{
 const m=plan(answers(),boundary(answers(),'c1-equations'));
 for(const r of m.mockCheckPlan.rows.filter(r=>r.start!==null&&!r.pending)){
  const p=B.find(r.selectedPaperId),html=S.paperLinks(r,{caption:true});
  assert.ok(p.files.problem.startsWith('https://wdown.ebsi.co.kr/'));assert.ok(p.files.explanation.startsWith('https://wdown.ebsi.co.kr/'));
  assert.ok(html.includes(p.files.problem.replaceAll('&','&amp;')));assert.match(html,/<details class="mock-paper-answers">/);
  assert.doesNotMatch(html,/<(?:iframe|embed|object)|data:application\/pdf|%PDF-|base64/i);
 }
});

test('a long manually dated repair keeps all shifted initial checks inside the rendered calendar horizon',()=>{
 const a=answers(),s=boundary(a,'c1-equations'),r=record('h1-06',{review:'planned',startMonth:'2030-11',months:6});
 const m=feedback(a,s,[r]),checks=m.lanes.find(l=>l.id==='mockCheck').blocks;
 assert.ok(checks.length);
 assert.ok(m.horizon>=Math.max(...checks.map(b=>b.end)),'the final shifted initial check must not be clipped from the graph');
 assert.equal(m.mockFeedback.plans[0].start,'2030-11-01','explicit repair dates stay fixed');
});
