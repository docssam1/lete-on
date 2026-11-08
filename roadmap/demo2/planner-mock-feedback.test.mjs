import {readFileSync} from 'node:fs';import vm from 'node:vm';import test from 'node:test';import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-scopes.js','planner-mock-matching.js','planner-mock-feedback.js','planner-learning-evidence.js','planner-goal-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const {PlannerMockEvidence:E,PlannerMockSchedule:S,PlannerMockFeedback:F,PlannerCurriculum:C,PlannerLearningEvidence:L}=window;
const fields={year:'2026',mon:'11',grade:'7',band:'B',speed:'2'},a={grade:'7',thinkingExperience:'none',schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'대수',schoolStatus:'progress',deepBook:'none',calc:'none'};
const root=(extra={})=>({id:'source',exam:'2026년 6월 학평',level:'1',date:'2026-11-05',scope:'방정식',attempt:'first',timing:'untimed',minutes:25,limit:0,total:10,unlearned:2,correct:6,helped:1,cause:'strategy',review:'none',startMonth:'2026-11',months:1,savedOn:'2026-11-05',units:[{title:'이차방정식',missed:1,helped:1,cause:'concept'}],...extra});
const state=(records,feedback,schedule)=>({version:1,records,feedback,schedule});const model=(records,feedback,schedule)=>F.attach(S.attach(C.model(a,fields),a,fields,schedule,records),state(records,feedback,schedule));const plain=x=>JSON.parse(JSON.stringify(x));
const input=(extra={})=>({exam:'2026년 6월 학평',level:'1',date:'2026-11-26',scope:'방정식',attempt:'retry',timing:'untimed',minutes:'20',limit:'',total:'10',unlearned:'0',correct:'10',helped:'0',cause:'none',review:'none',startMonth:'2026-11',months:'1',...extra});
test('only learned unresolved/helped counts produce named needs; unclassified leftovers and overtime are explicit',()=>{
 assert.equal(F.topics(root()).length,1);assert.equal(F.topics(root())[0].title,'이차방정식');
 const mixed=root({units:[{title:'이차방정식',missed:1,helped:0,cause:'concept'}]});assert.equal(F.topics(mixed)[1].key,'@unmapped');assert.equal(F.topics(mixed)[1].helped,1);
 assert.equal(F.topics(root({unlearned:10,correct:0,helped:0,units:[],timing:'timed',limit:10,minutes:15})).length,0);
 assert.equal(F.topics(root({unlearned:0,correct:10,helped:0,units:[]})).length,0);
 assert.equal(F.topics(root({unlearned:0,correct:10,helped:0,units:[],timing:'timed',limit:20,minutes:25}))[0].key,'@time');
});
test('weak units validate against aggregates, and retests require real coverage and a chronological acyclic parent',()=>{
 const s=state([root()]);assert.ok(E.save(s,input({'topic-0':'함수','missed-0':'1'})).error,'all-correct results cannot contain missed unit counts');
 assert.ok(E.save(s,input({followupOf:'source'})).error);assert.ok(E.save(s,input({followupOf:'source','covered-0':'on',date:'2026-11-04'})).error);
 const child=E.save(s,input({followupOf:'source','covered-0':'on',attempt:'first'}));assert.equal(child.error,null);assert.equal(child.state.records.at(-1).attempt,'retry');assert.equal(child.state.records.at(-1).coveredTopics[0],'unit:이차방정식');
 const id=child.state.records.at(-1).id;assert.ok(E.save(child.state,input({id:'source',followupOf:id,'covered-0':'on',date:'2026-12-01'})).error);
});
test('review and recheck use fixed exact dates with configurable intervals and unchanged legacy manual dates',()=>{
 const m=model([root()]),p=m.mockFeedback.plans[0];assert.equal(p.start,'2026-11-05');assert.equal(p.end,'2026-11-19');assert.equal(p.recheck,'2026-11-26');
 assert.equal(model([root()],{reviewDays:7,gapDays:3}).mockFeedback.plans[0].recheck,'2026-11-15');
 const old=model([root({review:'planned',startMonth:'2026-12',months:1.5})]).mockFeedback.plans[0];assert.equal(old.start,'2026-12-01');assert.equal(old.end,'2027-01-17');assert.equal(old.recheck,'2027-01-24');assert.match(old.repairId,/mock-review-/);
 const done=model([root({review:'done'})]).mockFeedback.plans[0];assert.equal(done.recheck,'2026-11-12');
 const restart=model([root({review:'planned',startMonth:'2026-12',months:1.5,feedbackStart:'2026-11-05'})]).mockFeedback.plans[0];assert.equal(restart.start,'2026-11-05');assert.equal(restart.end,'2026-12-21');
 const marked=E.reviewStatus(state([root({review:'planned'})]),'source','done');assert.equal(marked.records[0].reviewDoneOn,F.localToday());
});
test('rechecks use an unseen different year of the same verified scope, preserving selected-question mode for partial results',()=>{
 const partial=model([root()]).mockFeedback.plans[0];assert.equal(partial.paper.id,'y2025-h1-06');assert.equal(partial.paper.fresh,true);assert.equal(partial.paper.rangeMode,'selected');assert.equal(partial.paper.selectionRequired,true);assert.equal(partial.paper.scope,'방정식');
 const full=root({scope:'공통수학1 · 방정식·부등식까지',rangeMode:'whole',unlearned:0,correct:8,helped:1}),fresh=model([full]).mockFeedback.plans[0];assert.equal(fresh.paper.title,'2025년 고1 6월 수학 기출');assert.equal(fresh.paper.attempt,'first');assert.equal(fresh.paper.rangeMode,'whole');
 const seen=root({id:'seen',exam:'2025년 6월 학평',unlearned:0,correct:10,helped:0,units:[]});assert.equal(model([full,seen]).mockFeedback.plans[0].paper.pending,true);
 const unknown=model([root({exam:'개인 입력 시험'})]).mockFeedback.plans[0];assert.equal(unknown.paper.pending,true);assert.equal(unknown.paper.fresh,false);
});
test('a recorded successful comparable recheck closes only the covered original needs and keeps both results',()=>{
 const source=root(),good=root({id:'child',date:'2026-11-26',savedOn:'2026-11-26',correct:10,unlearned:0,helped:0,units:[],followupOf:'source',coveredTopics:['unit:이차방정식'],attempt:'retry'}),m=model([source,good]);assert.equal(m.mockFeedback.plans.length,0);assert.equal(m.mockFeedback.records.length,2);
 const partial={...good,unlearned:1,correct:9};assert.equal(model([source,partial]).mockFeedback.plans[0].id,'source');
 const timed={...source,timing:'timed',limit:20};assert.equal(model([timed,good]).mockFeedback.plans[0].id,'source');assert.equal(model([timed,{...good,timing:'timed',limit:20,minutes:19,coveredTopics:['unit:이차방정식','@time']}]).mockFeedback.plans.length,0);
});
test('partial coverage leaves the untouched topic, while a failed recheck starts a new cycle without duplicate old needs',()=>{
 const source=root({total:10,unlearned:0,correct:6,helped:2,units:[{title:'방정식',missed:1,helped:1,cause:'concept'},{title:'부등식',missed:1,helped:1,cause:'strategy'}]}),child=root({id:'child',date:'2026-11-26',savedOn:'2026-11-26',followupOf:'source',coveredTopics:['unit:방정식'],units:[{title:'방정식',missed:1,helped:1,cause:'concept'}],unlearned:0,correct:8,helped:1});
 const m=model([source,child]),parent=m.mockFeedback.plans.find(p=>p.id==='source'),next=m.mockFeedback.plans.find(p=>p.id==='child');assert.equal(parent.topics.length,1);assert.equal(parent.topics[0].title,'부등식');assert.equal(next.recheck,'2026-12-17');assert.equal(next.topics[0].title,'방정식');
});
test('all views and the main practice calendar respect exact followup dates without moving teaching courses',()=>{
 const initial=S.attach(C.model(a,fields),a,fields),before=JSON.stringify(initial.lanes.filter(l=>l.id!=='mockCheck')),m=F.attach(initial,state([root()]));assert.equal(JSON.stringify(m.lanes.filter(l=>!['mockCheck','mockRepair','mockRetest'].includes(l.id))),before);
 const b=m.lanes.find(l=>l.id==='mockRetest').blocks[0];assert.equal(C.period(m,b),'2026년 11월 26일');assert.match(C.detail(m,b.id).html,/2026년 11월 26일/);for(const view of ['map','graph','table'])assert.match(F.render(m,view),/2026년 11월 26일/);assert.match(F.notes(m)[0],/2026년 11월 26일/);
 for(const r of m.mockCheckPlan.rows.filter(r=>r.start!==null))assert.ok(r.start>=1,'next broad paper follows the November recheck');assert.equal(m.mockCheckPlan.rows.find(r=>r.id==='h1-06').start,null);
});
test('state preserves results, concepts, schedule and workload; opt-out restores manual review and deletion unlinks child results',()=>{
 const source=root({review:'planned'}),s=L.restore({version:1,concepts:{[L.TOPICS[0].id]:'review'},mock:state([source],{reviewDays:7,gapDays:3})}),restored=L.restore(JSON.parse(JSON.stringify(s)));assert.equal(restored.mock.feedback.reviewDays,7);assert.equal(restored.mock.records[0].units[0].title,'이차방정식');assert.equal(restored.concepts[L.TOPICS[0].id],'review');
 assert.equal(F.attach(C.model(a,fields),state([source],{enabled:false})).mockFeedback.plans.length,0);assert.ok(E.attach(C.model(a,fields),state([source],{enabled:false})).lanes.some(l=>l.id==='mockReview'));
 const child={...root(),id:'child',followupOf:'source',coveredTopics:['unit:이차방정식']},removed=E.remove(state([source,child]),'source');assert.equal(removed.records.length,1);assert.equal(removed.records[0].followupOf,null);
});
test('record metadata and generated followup text are bounded and escaped',()=>{
 const r=root({units:[{title:'<img onerror=bad()>',missed:1,helped:1,cause:'concept'}]}),html=F.render(model([r]));assert.ok(!html.includes('<img'));assert.match(html,/&lt;img/);assert.ok(F.dayOK(F.localToday()));
 const bad={...r,units:[{title:'over',missed:1000,helped:0,cause:'concept'}]};assert.equal(F.metadata(bad).units.length,0);
 const prefill=F.prefill(model([root()]),'source');assert.equal(prefill.followupOf,'source');assert.equal(prefill.date,F.localToday());assert.equal(prefill.attempt,'first');assert.equal(prefill.rangeMode,'selected');assert.equal(prefill.exam,'2025년 6월 학평');
});
test('a pending recheck retains its exact date and repair work, with no stale PDF or fabricated result form',()=>{
 const source=root({exam:'2026년 6월 학평',level:'2'}),m=model([source]),p=m.mockFeedback.plans[0],html=F.render(m);
 assert.equal(p.paper.pending,true);assert.equal(p.recheck,'2026-11-26');assert.equal(p.start,'2026-11-05');assert.equal(p.end,'2026-11-19');assert.equal(p.topics[0].title,'이차방정식');
 assert.equal(F.prefill(m,'source'),null);assert.ok(!html.includes('data-mock-paper'));assert.ok(!html.includes('data-mock-feedback-record'));assert.match(html,/회차 확인 대기/);assert.match(F.notes(m).join(' '),/2026년 11월 26일/);
 const b=m.lanes.find(l=>l.id==='mockRetest').blocks[0];assert.equal(b.calendarStart,'2026-11-26');assert.equal(b.paperId,null);assert.equal(b.books.length,0);
});
test('saved recheck choices survive synchronization, JSON restoration and unrelated results',()=>{
 const source=root({exam:'2024년 3월 학평'}),feedback={reviewDays:14,gapDays:7,assignments:{source:{paperId:'y2023-h1-03',sourcePaperId:'y2024-h1-03',scopeKey:'middle-2015-full'}}};
 const initial=model([source],feedback),saved=F.sync(state([source],feedback),initial),restored=E.restore(plain(saved));
 assert.equal(initial.mockFeedback.plans[0].paper.id,'y2023-h1-03');assert.equal(restored.feedback.assignments.source.paperId,'y2023-h1-03');
 const unrelated=root({id:'unrelated',exam:'2025년 9월 학평',correct:10,unlearned:0,helped:0,units:[]});
 const again=model([...restored.records,unrelated],restored.feedback),p=again.mockFeedback.plans[0];assert.equal(p.paper.id,'y2023-h1-03');assert.equal(p.recheck,'2026-11-26');
 assert.deepEqual(plain(saved.records),plain(E.restore(state([source])).records));
});
test('invalidated saved choices are replaced without moving the fixed recheck date, and exhausted choices wait',()=>{
 const source=root(),feedback={assignments:{source:{paperId:'y2025-h1-06',sourcePaperId:'h1-06',scopeKey:'common-2022-equations'}}};
 const used=root({id:'exposed',exam:'2025년 6월 학평',correct:10,unlearned:0,helped:0,units:[]}),m=model([source,used],feedback),saved=F.sync(state([source,used],feedback),m);
 assert.equal(m.mockFeedback.plans[0].paper.pending,true);assert.equal(m.mockFeedback.plans[0].recheck,'2026-11-26');assert.equal(saved.feedback.assignments.source,undefined);
 const changed=root({exam:'2025년 6월 학평'}),next=model([changed],feedback);assert.equal(next.mockFeedback.plans[0].paper.id,'h1-06');assert.equal(next.mockFeedback.plans[0].recheck,'2026-11-26');
 assert.equal(F.sync(state([changed],feedback),next).feedback.assignments.source.sourcePaperId,'y2025-h1-06');
});
test('an unassigned earlier record cannot steal a later record’s still-valid saved recheck',()=>{
 const first=root({id:'first',exam:'2021년 3월 학평'}),later=root({id:'later',exam:'2022년 3월 학평'}),feedback={assignments:{later:{paperId:'h1-03',sourcePaperId:'y2022-h1-03',scopeKey:'middle-2015-full'}}};
 const m=model([first,later],feedback),one=m.mockFeedback.plans.find(p=>p.id==='first'),two=m.mockFeedback.plans.find(p=>p.id==='later');
 assert.equal(two.paper.id,'h1-03');assert.equal(one.paper.id,'y2025-h1-03');assert.notEqual(one.paper.id,two.paper.id);
});
test('rechecks reserve their paper before regular checkpoints and both calendars show the resulting paper identity',()=>{
 const source=root({exam:'2024년 3월 학평'}),schedule={version:1,enabled:true,overrides:{'h1-03':{status:'planned',month:'2026-11'}}},m=model([source],undefined,schedule),p=m.mockFeedback.plans[0],row=m.mockCheckPlan.rows.find(r=>r.id==='h1-03');
 assert.equal(p.paper.id,'h1-03');assert.equal(row.selectedPaperId,'y2025-h1-03');assert.notEqual(row.selectedPaperId,p.paper.id);
 assert.equal(row.suggested,'2026-12');assert.match(row.practiceDate,/^2026-12-/);
 const b=m.lanes.find(l=>l.id==='mockCheck').blocks.find(b=>b.slotId==='h1-03');assert.equal(b.title,row.title);assert.equal(b.paperId,row.selectedPaperId);
 assert.match(S.render(m),/2025년 고1 3월/);assert.match(F.render(m),/2026년 고1 3월/);
});
test('saved assignments are bounded, validated and removed for deleted source records while learning evidence remains intact',()=>{
 const valid={paperId:'y2025-h1-06',sourcePaperId:'h1-06',scopeKey:'common-2022-equations'},feedback={assignments:{source:valid,deleted:valid,bad:{...valid,paperId:'<img>'}}};
 assert.equal(F.restore(feedback).assignments.bad,undefined);
 const source=root(),evidence=L.restore({version:1,concepts:{[L.TOPICS[0].id]:'review'},work:{},mock:state([source],feedback)}),m=model(evidence.mock.records,evidence.mock.feedback),saved=F.sync(evidence.mock,m);
 assert.equal(saved.feedback.assignments.source.paperId,'y2025-h1-06');assert.equal(saved.feedback.assignments.deleted,undefined);
 assert.equal(L.restore({...evidence,mock:saved}).concepts[L.TOPICS[0].id],'review');assert.deepEqual(plain(saved.records),plain(evidence.mock.records));
});
test('prefill keeps the paper ID separate from the new result ID so a recheck can actually be saved',()=>{
 const source=root(),prefill=F.prefill(model([source]),source.id);assert.equal(prefill.id,'');assert.equal(prefill.paperId,'y2025-h1-06');
 const result=E.save(state([source]),{...input(),...prefill,date:'2026-11-26','covered-0':'on'});
 assert.equal(result.error,null);assert.equal(result.state.records.length,2);
 const child=result.state.records.at(-1);assert.notEqual(child.id,prefill.paperId);assert.equal(child.exam,'2025년 6월 학평');assert.equal(child.followupOf,'source');assert.equal(child.attempt,'first');
});
