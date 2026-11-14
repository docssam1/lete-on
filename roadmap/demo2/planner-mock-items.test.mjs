import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const scripts=['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-scopes.js','planner-mock-matching.js','planner-mock-items-data.js','planner-mock-items.js','planner-mock-feedback.js','planner-learning-evidence.js','planner-goal-curriculum.js'];
// The pupil records the first attempt on Nov 6 in Seoul, whatever day CI runs.
const fixtureTime = Date.parse('2026-11-06T12:00:00+09:00');
class PracticeDate extends Date {
 constructor(...args) { super(...(args.length ? args : [fixtureTime])); }
 static now() { return fixtureTime; }
}
const w={},cx=vm.createContext({window:w,Date:PracticeDate});for(const f of scripts)vm.runInContext(read(f),cx,{filename:f});
const {PlannerMockItems:I,PlannerMockSchedule:S,PlannerMockEvidence:E,PlannerMockFeedback:F,PlannerCurriculum:C,PlannerMockLibrary:B}=w;
const plain=v=>JSON.parse(JSON.stringify(v));
const a={grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'공통수학1',schoolStatus:'progress',deepCourse:'none',deepBook:'none',calc:'none'};
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const base=()=>C.model(a,fields);
const partial=()=>S.update(null,{enabled:'on',spacing:'1',boundary:'',knowledgeEdited:'on','learned-unit-c1-poly':'on','learned-unit-c1-remainder':'on'},a).state;
const initial=()=>S.attach(base(),a,fields,partial());
const recordInput=(selection,extra={})=>({exam:B.find(selection.paperId).exam,level:B.find(selection.paperId).level,scope:'다항식',date:'2026-11-06',attempt:'first',timing:'untimed',minutes:'30',total:'99',unlearned:'99',correct:'99',helped:'99',cause:'concept',review:'none',startMonth:'2026-11',months:'1',questionSelection:JSON.stringify(selection),...Object.fromEntries(selection.selected.map(n=>['question-'+n,'correct'])),...extra});

test('actual learned-unit checkbox changes entry date and real question numbers, without book-percent inference',()=>{
 const raw=S.attach(base(),a,fields,null),m=initial(),row=m.mockCheckPlan.rows.find(r=>r.id==='h1-06');
 assert.ok(raw.mockCheckPlan.rows.find(r=>r.id==='h1-06').ready>0);
 assert.equal(row.ready,0);assert.equal(row.practiceDate,'2026-11-06');
 assert.ok(row.questionSelection.selected.includes(2));assert.ok(!row.questionSelection.selected.includes(1),'complex numbers have not been learned');
 assert.ok(row.questionSelection.excludedUnlearned.includes(1));
 assert.deepEqual(plain(m.lanes.filter(l=>l.id!=='mockCheck')),plain(base().lanes));
});

test('official mixed-topic problem needs both units; unknown mapping is kept separate from unlearned',()=>{
 const s=I.select('y2025-h1-06',['c1-poly']);
 assert.ok(!s.selected.includes(28),'2025 June Q28 requires quadratic function as well as polynomial');
 const both=I.select('y2025-h1-06',['c1-poly','c1-parabola']);assert.ok(both.selected.includes(28));
 const unknown=I.select('not-a-paper',[]);assert.equal(unknown,null);
 const old=I.select('y2018-h2-03-a',I.UNITS.map(u=>u.id));assert.equal(old.selected.length+old.unmapped.length+old.excludedUnlearned.length,30);
});

test('future card is projected, but print/record prefill recomputes only currently learned units',()=>{
 const m=initial(),future=m.mockCheckPlan.rows.find(r=>r.start!==null&&r.ready>0&&!r.pending);
 assert.ok(future);assert.equal(future.questionSelection.projected,true);
 const d=S.prefill(future.id,m);assert.equal(d.questionSelection.projected,false);
 assert.deepEqual(plain(d.questionSelection.learnedUnitIds),['c1-poly','c1-remainder']);
 const rejected=E.save(null,recordInput(future.questionSelection));assert.match(rejected.error,/예정/);
});

test('unlearned is excluded automatically and unanswered stays in denominator; record survives knowledge changes',()=>{
 const selection=I.select('h1-06',['c1-poly','c1-remainder']);assert.ok(selection.selected.length>=4);
 const [n1,n2,n3]=selection.selected,r=E.save(null,recordInput(selection,{['question-'+n1]:'unlearned',['question-'+n2]:'unanswered',['question-'+n3]:'helped'}));assert.equal(r.error,null);
 const saved=r.state.records[0],count=selection.selected.length;
 assert.equal(saved.total,count);assert.equal(saved.unlearned,1);assert.equal(saved.correct,count-3);assert.equal(E.result(saved).learned,count-1);assert.equal(E.result(saved).pending,1);
 assert.equal(saved.units.reduce((n,u)=>n+u.missed+u.helped,0),2);
 assert.deepEqual(plain(E.restore(plain(r.state)).records),plain(r.state.records));
 assert.ok(saved.questionSelection.excludedUnlearned.length>0);
});

test('every selected item marked unlearned has no performance percent or remedial topic',()=>{
 const s=I.select('h1-06',['c1-poly','c1-remainder']),r=E.save(null,recordInput(s,Object.fromEntries(s.selected.map(n=>['question-'+n,'unlearned']))));assert.equal(r.error,null);
 assert.equal(E.result(r.state.records[0]).percent,null);assert.equal(F.topics(r.state.records[0]).length,0);
});

test('wrong-unit result gets dated, different-year, same-scope retest numbers and closes only tested units',()=>{
 const s=I.select('h1-06',['c1-poly','c1-remainder']),wrong=s.selected.find(n=>I.items(s.paperId).find(q=>q.number===n).unitId==='c1-remainder');
 let saved=E.save({version:1,records:[],schedule:partial()},recordInput(s,{['question-'+wrong]:'wrong'}));assert.equal(saved.error,null);
 const record=saved.state.records[0],m=F.attach(S.attach(base(),a,fields,partial(),[record]),saved.state),p=m.mockFeedback.plans[0];
 assert.equal(p.paper.id,'y2025-h1-06');assert.equal(p.paper.scopeKey,w.PlannerMockMatching.sourceFor(record).scopeKey);assert.equal(p.recheck,'2026-11-27');
 assert.ok(p.paper.questionSelection.selected.length>0);assert.ok(p.paper.questionSelection.selected.every(n=>{const q=I.items(p.paper).find(q=>q.number===n);return q.requires.includes('c1-remainder');}));
 const pref=F.prefill(m,record.id),child=E.save(saved.state,recordInput(pref.questionSelection,{followupOf:record.id,date:'2026-11-27'}));assert.equal(child.error,null);
 assert.deepEqual(plain(child.state.records[1].coveredTopics),['unit:나머지정리와 인수분해']);
 assert.equal(F.model(m,child.state).plans.length,0);
});

test('catalogue metadata validates identity, numbered partitions and HTTPS sources without question text',()=>{
 for(const [id,p]of Object.entries(w.PlannerMockItemData)){assert.ok(B.find(id));assert.match(p.sourceUrl,/^https:\/\/wdown\.ebsi\.co\.kr\//);assert.equal(p.items.length,30,id);assert.equal(new Set(p.items.map(q=>q.number)).size,30);
  for(const q of p.items){assert.ok(q.unverified||q.requires.length);assert.ok(q.requires.every(id=>I.UNIT[id]));assert.ok(!Object.hasOwn(q,'answer'));assert.ok(!Object.hasOwn(q,'question'));}}
 const s=I.select('h1-06',['c1-poly']),r=B.find('h1-06');assert.equal(I.restoreSelection({...s,selected:[1,1]},r),null);assert.equal(I.restoreSelection({...s,paperId:'h2-06'},r),null);
});

test('a new completed boundary replaces stale explicit unit defaults and calculus-all includes the later units',()=>{
 const state=S.update(partial(),{enabled:'on',spacing:'1',boundary:'c1-all'},a).state,m=S.attach(base(),a,fields,state),p=m.mockCheckPlan.rows.find(p=>p.id==='h1-09');
 assert.equal(p.ready,0);assert.ok(p.questionSelection.selected.length>20);
 const all=I.projectedUnits({needs:[['미적분Ⅰ',3]]},{learned:[]});assert.ok(all.includes('cal-derivative'));assert.ok(all.includes('cal-integral'));
});

test('a failed composite recheck retains the original target instead of switching to the primary unit',()=>{
 const learned=I.UNITS.map(u=>u.id),s=I.select('h1-06',learned),r=E.save({version:1,records:[],schedule:partial()},recordInput(s,{'question-8':'wrong'}));assert.equal(r.error,null);
 const record=r.state.records[0],m=initial();m.mockCheckPlan.knowledge.learned=learned;const planned=F.attach(m,r.state),p=planned.mockFeedback.plans[0];
 assert.ok(p.paper.questionSelection.selected.includes(28));
 const input=recordInput(p.paper.questionSelection,{date:'2026-11-27',followupOf:record.id,'question-28':'wrong'}),child=E.save(r.state,input);assert.equal(child.error,null);
 assert.equal(child.state.records[1].units[0].unitId,'c1-parabola');
 const next=F.model(m,child.state);assert.ok(next.plans.some(p=>p.topics.some(t=>t.unitId==='c1-parabola')));
});


test('primary-topic-only high2 tags never assign a partial-course item before prerequisite review',()=>{
 const ids=I.UNITS.map(u=>u.id),s=I.select('h2-06',ids);
 assert.ok(s.unmapped.includes(1));
 assert.ok(!s.selected.includes(1));
 assert.ok(s.selected.includes(15));
 const lacking=I.select('h2-06',ids.filter(id=>id!=='c1-quadratic'));
 assert.ok(lacking.excludedUnlearned.includes(15));
});

test('a pupil studying a course after the unit list has every earlier course as learned', () => {
 const earlier = I.UNITS.filter(u => u.course !== '이전 교육과정·별도 확인').map(u => u.id);
 for (const stage of ['미적분Ⅱ', '기하']) {
  const learned = I.knowledge(a, null, { stage, done: false }).learned;
  assert.equal(learned.length, earlier.length, stage);
  assert.deepEqual([...learned].sort(), [...earlier].sort(), stage);
 }
 // A course inside the list still counts only the courses before it.
 assert.equal(I.knowledge(a, null, { stage: '공통수학1', done: false }).learned.some(id => id.startsWith('c1-')), false);
 // An unknown course name stays empty instead of unlocking everything.
 assert.equal(I.knowledge(a, null, { stage: '확인 전', done: false }).learned.length, 0);
});
