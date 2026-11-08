import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

// Use the same module order and learner/record fixture as mock-feedback.test.mjs.
const window={},ctx=vm.createContext({window});
for(const file of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-scopes.js','planner-mock-matching.js','planner-mock-feedback.js','planner-learning-evidence.js','planner-goal-curriculum.js']){
 vm.runInContext(readFileSync(new URL(file,import.meta.url),'utf8'),ctx,{filename:file});
}
const {PlannerMockEvidence:E,PlannerMockSchedule:S,PlannerMockFeedback:F,PlannerCurriculum:C}=window;
const fields={year:'2026',mon:'11',grade:'7',band:'B',speed:'2'};
const learner={grade:'7',thinkingExperience:'none',schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'대수',schoolStatus:'progress',deepBook:'none',calc:'none'};
const record=(extra={})=>({id:'source',exam:'2026년 6월 학평',level:'1',date:'2026-11-05',scope:'방정식',attempt:'first',timing:'untimed',minutes:25,limit:0,total:10,unlearned:2,correct:6,helped:1,cause:'strategy',review:'none',startMonth:'2026-11',months:1,savedOn:'2026-11-05',units:[{title:'이차방정식',missed:1,helped:1,cause:'concept'}],...extra});
const state=records=>({version:1,records});
const model=(records,calendar=fields)=>F.attach(S.attach(C.model(learner,calendar),learner,calendar),state(records));
const plain=value=>JSON.parse(JSON.stringify(value));
const hrefs=html=>[...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match=>match[1]);
const group=(html,id)=>{
 const match=html.match(new RegExp(`<div class="mock-paper-links" data-mock-paper="${id}"[\\s\\S]*?</details></div>`));
 assert.ok(match,`missing paper group ${id}`);
 return match[0];
};

// Independent source fixture: actual EBS PDF titles checked 2026-11-06.
// Matches output/mock-paper-links-20261106/verified-links.json without making
// the test suite depend on private, untracked research output or the network.
const verified=[
 ['h1-03','20260324','go1','math_mun_OCK6KM91.pdf','math_hsj_43S8DA11.pdf'],
 ['h1-06','20260604','go1','math_mun_D7P5UME3.pdf','math_hsj_AX588329.pdf'],
 ['h1-09','20260902','go1','math_mun_7L76TL61.pdf','math_hsj_F42K4C49.pdf'],
 ['h1-10','20261020','go1','math_mun_Y46IAKH1.pdf','math_hsj_9LW1PC49.pdf'],
 ['h2-03','20260324','go2','math_mun_53A7J811_1.pdf','math_hsj_Y2JA7LIE.pdf'],
 ['h2-06','20260604','go2','math_mun_3U2G34HF.pdf','math_hsj_322HZ5AE.pdf'],
 ['h2-09','20260902','go2','math_mun_895U99J8.pdf','math_hsj_GTK7Z5PQ.pdf'],
 ['h2-10','20261020','go2','math_mun_2O8F6113.pdf','math_hsj_227HZ894.pdf']
].map(([id,date,grade,problem,explanation])=>({id,problem:`https://wdown.ebsi.co.kr/W61001/01exam/${date}/${grade}/${problem}`,explanation:`https://wdown.ebsi.co.kr/W61001/01exam/${date}/${grade}/${explanation}`}));
const expected=id=>verified.find(p=>p.id===id)||window.PlannerMockLibrary.find(id)?.files;
function assertFiles(html,id){
 const urls=hrefs(html),paper=expected(id);
 assert.ok(urls.includes(paper.problem),`${id} problem URL`);
 assert.ok(urls.includes(paper.explanation),`${id} explanation URL`);
}

test('all eight paper identities have the sixteen independently verified EBS PDF links',()=>{
 assert.deepEqual(plain(S.PAPERS.map(p=>p.id)),verified.map(p=>p.id));
 for(const paper of S.PAPERS){
  const evidence=expected(paper.id);
  assert.equal(paper.files.problem,evidence.problem);
  assert.equal(paper.files.explanation,evidence.explanation);
  assert.equal(paper.year,2026);
 }
 assert.equal(new Set(verified.flatMap(p=>[p.problem,p.explanation])).size,16);
});

test('resolution uses a paper string ID or exact exam and grade, never a record ID',()=>{
 for(const paper of S.PAPERS){
  assert.equal(S.resolvePaper(paper.id)?.id,paper.id);
  assert.equal(S.resolvePaper({id:'unrelated-record',exam:paper.exam,level:paper.level})?.id,paper.id);
 }
 assert.equal(S.resolvePaper({id:'h2-10',exam:'2026년 6월 학평',level:'1'})?.id,'h1-06');
 for(const value of [null,undefined,'unknown',{id:'h1-06'},{id:'h1-06',exam:'2016년 6월 학평',level:'1'},{exam:'2026년 6월 학평',level:'3'},{exam:'2026년 6월 모의평가',level:'1'}])assert.equal(S.resolvePaper(value),null);
 assert.equal(S.paperLinks('unknown'),'');
});

test('unverified years and high-three records get only their grade-specific official search link',()=>{
 for(const [value,target] of [[{id:'h1-06',exam:'2016년 6월 학평',level:'1'},'D100'],[{exam:'2016년 9월 학평',level:'2'},'D200'],[{id:'h2-09',exam:'2026년 9월 학평',level:'3'},'D300']]){
  const html=S.paperLinks(value,{caption:true});
  assert.deepEqual(hrefs(html),[`https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=${target}`]);
  assert.doesNotMatch(html,/data-mock-paper="|data-mock-paper-file="problem"|wdown\.ebsi/);
  assert.match(html,/직접 링크 확인 전/);
 }
});

test('supplied URLs cannot replace official files, text is escaped, and answer details start closed',()=>{
 const evil={papers:'javascript:alert(1)',files:{problem:'https://evil.invalid/p.pdf',explanation:'https://evil.invalid/a.pdf'},problem:'https://evil.invalid/other'};
 const known=S.paperLinks({...evil,exam:'2026년 6월 학평',level:'1'},{caption:true});
 assertFiles(known,'h1-06');assert.doesNotMatch(known,/evil\.invalid|javascript:/);
 assert.match(known,/<details class="mock-paper-answers"><summary>정답·해설<\/summary>/);
 assert.doesNotMatch(known,/<details[^>]*\bopen\b/);
 assert.match(known,/2026년 고1 6월 수학 기출 · EBSi 공식 기출/);
 const unknown=S.paperLinks({...evil,exam:'2025년 <img src=x onerror="bad()"> & \'시험\'',level:'2'},{caption:true});
 assert.doesNotMatch(unknown,/<img|evil\.invalid|javascript:/);
 assert.match(unknown,/&lt;img src=x onerror=&quot;bad\(\)&quot;&gt; &amp; &#39;시험&#39;/);
 for(const anchor of known.matchAll(/<a\b[^>]*>/g))assert.match(anchor[0],/target="_blank" rel="noopener noreferrer"/);
});

test('schedule map, table and adjustment controls link each displayed paper to its own files and practice month',()=>{
 const schedule={version:1,overrides:Object.fromEntries(S.PAPERS.map(p=>[p.id,{status:'planned'}]))};
 const m=S.attach(C.model(learner,fields),learner,fields,schedule);
 const snapshots=[S.render(m,'map'),S.render(m,'table'),S.controls(m,learner,schedule)];
 assert.equal(m.mockCheckPlan.rows.filter(p=>p.start!==null).length,8);
 for(const html of snapshots)for(const paper of S.PAPERS)assertFiles(group(html,paper.id),paper.id);
 for(const row of m.mockCheckPlan.rows){
  for(const view of ['map','table'])assert.ok(S.render(m,view).includes(C.date(m,row.start).label));
  assert.ok(snapshots[2].includes(row.suggested));
 }
});

test('whole-paper June results link the same-scope June paper from another year while keeping the fixed review date',()=>{
 const source=record({scope:'공통수학1 · 방정식·부등식까지',rangeMode:'whole',unlearned:0,correct:8,helped:1});
 const before=JSON.stringify(source),m=model([source]),plan=m.mockFeedback.plans[0];
 assert.equal(plan.paper.fresh,true);assert.equal(S.resolvePaper(plan.paper)?.id,'y2025-h1-06');
 assert.equal(plan.recheck,'2026-11-26');
 for(const view of ['map','table']){
  const html=F.render(m,view);assertFiles(html,'y2025-h1-06');
  assert.ok(!hrefs(html).includes(expected('h1-06').problem));
  assert.match(html,/2026년 11월 26일/);
 }
 const block=m.lanes.find(l=>l.id==='mockRetest').blocks[0];
 assert.equal(C.period(m,block),'2026년 11월 26일');
 assert.equal(F.prefill(m,'source').exam,'2025년 6월 학평');
 assert.equal(JSON.stringify(source),before);
});

test('partial results get another-year June link for selected units and saved dates after reopening in a later calendar',()=>{
 const source=record(),before=JSON.stringify(source),restored=E.restore(state([source]));
 for(const calendar of [fields,{...fields,year:'2027',mon:'2'}]){
  const m=model(restored.records,calendar),plan=m.mockFeedback.plans[0],html=F.render(m);
  assert.equal(plan.paper.fresh,true);assert.equal(plan.paper.attempt,'first');assert.equal(plan.paper.rangeMode,'selected');
  assert.equal(plan.start,'2026-11-05');assert.equal(plan.recheck,'2026-11-26');
  assertFiles(html,'y2025-h1-06');assert.ok(!hrefs(html).includes(expected('h1-06').problem));
  assert.match(html,/선택|단원/);
 }
 assert.equal(JSON.stringify(source),before);
});

test('record prefill, edit and saved history follow the actual exam and grade without losing other records',()=>{
 const source=record({id:'h2-10'}),other=record({id:'older',exam:'2025년 6월 학평',level:'3'});
 const initial=state([source,other]),before=JSON.stringify(initial);
 const picker=html=>html.match(/<form data-mock-form[\s\S]*?<\/form>/)?.[0]||'';
 assertFiles(picker(E.render(initial,{prefill:S.prefill('h2-06')})),'h2-06');
 assertFiles(picker(E.render(initial,{edit:'h2-10'})),'h1-06');
 const saved=E.save(initial,{...source,exam:'2026년 9월 학평',level:'2','topic-0':'이차방정식','missed-0':'1','helped-0':'1','topicCause-0':'concept'});
 assert.equal(saved.error,null);assert.equal(saved.state.records.length,2);
 assert.equal(saved.state.records[0].id,'h2-10');assert.equal(saved.state.records[0].date,'2026-11-05');
 assert.equal(saved.state.records[0].savedOn,'2026-11-05');
 assert.deepEqual(plain(saved.state.records[1]),plain(E.restore(initial).records[1]));
 const html=E.render(saved.state,{edit:'h2-10'});
 assertFiles(picker(html),'h2-09');
 const history=html.slice(html.indexOf('<section aria-label="모평 점검 기록">'));
 assertFiles(group(history,'h2-09'),'h2-09');
 assert.ok(hrefs(history).includes('https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D300'));
 assert.ok(!hrefs(history).includes(expected('h1-06').problem));
 assert.equal(JSON.stringify(initial),before);
});
