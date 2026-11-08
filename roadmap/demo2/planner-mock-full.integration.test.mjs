import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const plain=value=>JSON.parse(JSON.stringify(value));
const numbers=Array.from({length:30},(_,i)=>i+1);
const scripts=['planner-mock-evidence.js','planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-scopes.js','planner-mock-matching.js','planner-mock-items-data.js','planner-mock-items.js','planner-mock-score-data.js','planner-mock-full.js','planner-mock-feedback.js','planner-mock-books-data.js','planner-mock-books.js'];
function setup(){
 let next=0;const window={crypto:{randomUUID:()=>`result-${++next}`}};
 class FixedDate extends Date{constructor(...args){super(...(args.length?args:['2026-11-06T03:00:00Z']));}static now(){return Date.parse('2026-11-06T03:00:00Z');}}
 const context=vm.createContext({window,URL,Date:FixedDate});
 for(const file of scripts)vm.runInContext(readFileSync(new URL(file,import.meta.url),'utf8'),context,{filename:file});
 const {PlannerMockEvidence:E,PlannerMockItems:I,PlannerMockFull:F,PlannerMockFeedback:R,PlannerMockSchedule:S,PlannerMockBooks:B}=window;
 const learned=I.UNITS.map(u=>u.id);
 const calendar=(ids=learned)=>({year:2026,month:11,horizon:12,lanes:[],warnings:[],mockCheckPlan:{knowledge:{learned:ids}}});
 const model=(state,ids=learned)=>R.attach(calendar(ids),state,{current:[{choice:'school',name:'쎈 공통수학1',series:'쎈',course:'공통수학1'}]});
 const form=(prefill,answers={},extra={})=>({...prefill,date:'2026-11-06',timing:'untimed',minutes:'45',cause:'concept',review:'none',startMonth:'2026-11',months:'1',...Object.fromEntries(prefill.questionSelection.selected.map(n=>['question-'+n,answers[n]||'correct'])),questionSelection:JSON.stringify(prefill.questionSelection),...extra});
 const whole=(paper='h1-06',answers={},extra={})=>form(F.prefill(paper,learned),answers,extra);
 const partial=(paper,ids,answers={},extra={})=>{const p=S.resolvePaper(paper);return form({...p,id:'',attempt:'first',...I.forRecord(p,{learned:ids})},answers,extra);};
 return{window,E,I,F,R,S,B,learned,calendar,model,form,whole,partial};
}

test('real whole-paper save and JSON restore derive unit failures from answers instead of aggregate or hidden-topic input',()=>{
 const {E,F,R,whole}=setup(),result=E.save(null,whole('h1-06',{1:'wrong',2:'helped',3:'unanswered',7:'unlearned'},{total:'1',correct:'1',helped:'0',unlearned:'0','topic-0':'허위 단원','missed-0':'99'}));
 assert.equal(result.error,null);const record=result.state.records[0],analysis=F.analyze(record);
 assert.equal(record.total,30);assert.equal(record.correct,26);assert.equal(record.helped,1);assert.equal(record.unlearned,1);
 assert.deepEqual(plain(E.result(record)),{learned:29,percent:90,pending:2});
 assert.equal(analysis.learned,29);assert.equal(analysis.percent,90);assert.equal(analysis.counts.unanswered,1);
 assert.equal(analysis.score.available,true);assert.equal(analysis.score.earned,91);assert.equal(analysis.score.max,100,'official score and learned-range percentage are separate measurements');
 assert.deepEqual(plain(record.fullPaper),{version:1,paperId:'h1-06'});
 assert.deepEqual(plain(record.units),[
  {unitId:'c1-complex',title:'복소수',missed:1,helped:0,cause:'concept'},
  {unitId:'c1-remainder',title:'나머지정리와 인수분해',missed:0,helped:1,cause:'concept'},
  {unitId:'c1-inequality',title:'여러 가지 부등식',missed:1,helped:0,cause:'concept'}
 ]);
 assert.ok(!record.coveredUnitIds.includes('c1-quadratic'),'a unit whose only primary item is unlearned is not recorded as covered');
 const restored=E.restore(plain(result.state));assert.deepEqual(plain(restored),plain(result.state));assert.deepEqual(plain(R.topics(restored.records[0])),plain(R.topics(record)));
 assert.equal(R.topics(record).some(t=>t.unmapped),false);assert.match(E.render(restored),/전체 시험 결과 분석/);assert.match(E.render(restored),/성적 분석표·기록지 인쇄/);
});

test('all-unlearned whole papers preserve observations without a performance percentage or automatic repair',()=>{
 const {E,F,R,whole,model}=setup(),result=E.save(null,whole('h1-06',Object.fromEntries(numbers.map(n=>[n,'unlearned']))));
 assert.equal(result.error,null);const r=result.state.records[0];assert.equal(r.unlearned,30);assert.deepEqual(plain(E.result(r)),{learned:0,percent:null,pending:0});
 assert.equal(F.analyze(r).percent,null);assert.deepEqual(plain(r.units),[]);assert.deepEqual(plain(r.coveredUnitIds),[]);assert.deepEqual(plain(R.topics(r)),[]);assert.equal(model(result.state).mockFeedback.plans.length,0);
 assert.match(F.summary(r),/배운 범위 없음/);assert.doesNotMatch(F.summary(r),/NaN|Infinity/);
});

test('unknown or unverified unit metadata remains in full results but cannot create automatic unit or book repair',()=>{
 const {window,E,F,R,whole,model}=setup(),rows=window.PlannerMockItemData['h1-06'].items;
 rows.find(q=>q.number===1).unverified=true;rows.find(q=>q.number===2).requires=['not-a-verified-unit'];
 const result=E.save(null,whole('h1-06',{1:'wrong',2:'helped',3:'unanswered'}));assert.equal(result.error,null);const r=result.state.records[0],a=F.analyze(r);
 assert.deepEqual(plain(a.unmapped.numbers),[1,2]);assert.equal(a.unmapped.missed,1);assert.equal(a.unmapped.helped,1);assert.equal(a.pending,2);assert.equal(r.helped,1);
 assert.deepEqual(plain(r.units.map(u=>u.unitId)),['c1-inequality']);assert.equal(R.topics(r).length,1);assert.equal(R.topics(r)[0].unitId,'c1-inequality');
 const planned=model(result.state).mockFeedback.plans[0];assert.equal(planned.topics.length,1);assert.equal(planned.bookPlan.topics.length,1);assert.ok(planned.topics.every(t=>!t.unmapped));
 const saved=plain(result.state);saved.records[0].units.push({unitId:'c1-complex',title:'복소수',missed:1,helped:0,cause:'concept'});
 const restored=E.restore(saved);assert.deepEqual(plain(restored.records[0].units),plain(r.units),'stored unit metadata cannot revive a rejected mapping');
});

test('a whole result containing only unclassified failures has no invented repair schedule',()=>{
 const {window,E,F,R,whole,model}=setup();window.PlannerMockItemData['h1-06'].items.find(q=>q.number===1).unverified=true;
 const result=E.save(null,whole('h1-06',{1:'wrong'}));assert.equal(result.error,null);const r=result.state.records[0];assert.equal(F.analyze(r).unmapped.missed,1);assert.equal(E.result(r).pending,1);
 assert.deepEqual(plain(R.topics(r)),[]);const m=model(result.state);assert.equal(m.mockFeedback.plans.length,0);assert.equal(m.lanes.some(l=>['mockRepair','mockRetest'].includes(l.id)),false);
 assert.match(F.summary(r),/단원 확인 대기/);
});

test('whole observations preserve prior book workload, date and identity through edits and restoration',()=>{
 const {E,R,B,whole,model}=setup(),state=E.save(null,whole('h1-06',{1:'wrong'})).state,r=state.records[0];
 r.bookRepair=B.restore({version:1,items:[{id:'book-work',topicKey:'unit:복소수',bookName:'쎈 공통수학1',course:'공통수학1',unitTitle:'복소수',location:'현재 책에서 확인한 범위',measure:'problem',planned:12,completed:7,workedOn:'2026-11-06'}]});
 const initial=model(state).mockFeedback.plans[0],before=JSON.stringify(state),edited=E.save(state,whole('h1-06',{1:'helped'},{id:r.id}));assert.equal(edited.error,null);assert.equal(JSON.stringify(state),before);
 assert.deepEqual(plain(edited.state.records[0].bookRepair),plain(r.bookRepair));assert.equal(edited.state.records[0].id,r.id);assert.equal(edited.state.records[0].fullPaper.paperId,'h1-06');
 const after=model(E.restore(plain(edited.state))).mockFeedback.plans[0];assert.equal(after.start,initial.start);assert.equal(after.end,initial.end);assert.equal(after.recheck,initial.recheck);assert.equal(after.bookPlan.progress[0].percent,58);
 const synced=R.sync(edited.state,{mockFeedback:{plans:[after]}});assert.equal(synced.feedback.assignments[r.id].sourcePaperId,'h1-06');assert.equal(synced.feedback.assignments[r.id].paperId,'y2025-h1-06');
});

test('existing selected-current mode keeps selected denominator, preselection exclusions and partial unit repair',()=>{
 const {E,F,R,partial,I}=setup(),ids=['c1-complex','c1-remainder','c1-inequality'],input=partial('h1-06',ids,{1:'wrong',2:'helped',3:'unlearned'}),s=JSON.parse(input.questionSelection),result=E.save(null,input);
 assert.equal(result.error,null);const r=result.state.records[0];assert.equal(r.fullPaper,undefined);assert.equal(F.analyze(r),null);assert.equal(r.questionSelection.mode,'current');assert.equal(r.total,s.selected.length);assert.equal(r.unlearned,1);
 assert.equal(E.result(r).learned,s.selected.length-1);assert.ok(s.excludedUnlearned.length>0);assert.equal(r.questionSelection.excludedUnlearned.length,s.excludedUnlearned.length);
 assert.deepEqual(plain(r.units),plain(I.readInput(input,r).value.units));assert.deepEqual(plain(R.topics(r).map(t=>t.unitId)),['c1-complex','c1-remainder']);assert.deepEqual(plain(E.restore(plain(result.state)).records[0].answers),plain(r.answers));
});

test('a partial recheck remains unseen same-scope different-year selected work and closes only its actual covered topic',()=>{
 const {E,F,R,partial,model,form}=setup(),ids=['c1-complex','c1-remainder','c1-inequality'],state=E.save(null,partial('h1-06',ids,{1:'wrong'})).state,source=state.records[0],planned=model(state,ids),p=planned.mockFeedback.plans[0],prefill=R.prefill(planned,source.id);
 assert.equal(p.paper.id,'y2025-h1-06');assert.equal(p.paper.rangeMode,'selected');assert.equal(p.paper.questionSelection.mode,'remedial');assert.ok(p.paper.questionSelection.selected.length>0);assert.ok(p.paper.questionSelection.selected.length<30);assert.ok(p.paper.questionSelection.excludedOther.length>0);
 assert.deepEqual(plain(p.paper.questionSelection.targetUnitIds),['c1-complex']);assert.equal(prefill.id,'');
 const completed=E.save(state,form(prefill,{}, {date:p.recheck}));assert.equal(completed.error,null);const child=completed.state.records.at(-1);assert.equal(child.followupOf,source.id);assert.equal(child.attempt,'first');assert.equal(child.fullPaper,undefined);assert.equal(F.analyze(child),null);
 assert.deepEqual(plain(child.coveredTopics),['unit:복소수']);assert.equal(model(completed.state,ids).mockFeedback.plans.length,0);assert.equal(completed.state.records.length,2);
});

test('full-paper rechecks cannot close a prior unit using only questions whose unit mapping is now unverified',()=>{
 const {window,E,F,R,whole,model}=setup(),state=E.save(null,whole('h1-06',{1:'wrong'})).state,source=state.records[0];
 for(const q of window.PlannerMockItemData['y2025-h1-06'].items)if(q.unitId==='c1-complex'||q.requires.includes('c1-complex'))q.unverified=true;
 const result=E.save(state,whole('y2025-h1-06',{}, {followupOf:source.id,date:'2026-11-27'}));
 if(result.error){assert.match(result.error,/범위|단원/);assert.equal(result.state.records.length,1);return;}
 const child=result.state.records.at(-1);assert.ok(!F.analyze(child).coveredUnitIds.includes('c1-complex'));
 assert.ok(!child.coveredTopics.includes('unit:복소수'),'unverified question metadata must not close the original complex-number need');
 assert.ok(model(result.state).mockFeedback.plans.some(p=>p.id===source.id),'the unresolved original unit must remain scheduled');
});

test('restoring a whole recheck revalidates saved topic coverage instead of trusting stale closure flags',()=>{
 const {window,E,F,whole,model}=setup(),sourceState=E.save(null,whole('h1-06',{1:'wrong'})).state,source=sourceState.records[0],result=E.save(sourceState,whole('y2025-h1-06',{}, {followupOf:source.id,date:'2026-11-27'}));
 assert.equal(result.error,null);assert.ok(result.state.records.at(-1).coveredTopics.includes('unit:복소수'));assert.equal(model(result.state).mockFeedback.plans.length,0,'verified whole rechecks still close their observed source topic');
 const saved=plain(result.state);for(const q of window.PlannerMockItemData['y2025-h1-06'].items)if(q.unitId==='c1-complex'||q.requires.includes('c1-complex'))q.unverified=true;
 const restored=E.restore(saved),child=restored.records.at(-1);assert.ok(!child.coveredTopics.includes('unit:복소수'));assert.ok(F.analyze(child).unmapped.total>0);assert.ok(model(restored).mockFeedback.plans.some(p=>p.id===source.id));
 assert.equal(saved.records.at(-1).coveredTopics.includes('unit:복소수'),true,'restore does not mutate the saved input snapshot');
});
