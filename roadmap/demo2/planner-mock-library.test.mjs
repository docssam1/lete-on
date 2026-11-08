import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function boot({library=true,rows}={}){
 const window={},context=vm.createContext({window});
 const run=name=>vm.runInContext(read(name),context,{filename:name});
 for(const name of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-mock-schedule.js'])run(name);
 if(library){
  if(rows)window.PlannerMockLibraryData=rows;
  else run('planner-mock-library-data.js');
  run('planner-mock-library.js');
 }
 for(const name of ['planner-mock-feedback.js','planner-learning-evidence.js'])run(name);
 return window;
}
const W=boot(),L=W.PlannerMockLibrary,S=W.PlannerMockSchedule,E=W.PlannerMockEvidence,F=W.PlannerMockFeedback;
const fields={year:'2026',mon:'11',grade:'7',band:'B',speed:'2'};
const answers={grade:'7',thinkingExperience:'none',schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'대수',schoolStatus:'progress',deepBook:'none',calc:'none'};
const scheduled=w=>w.PlannerMockSchedule.attach(w.PlannerCurriculum.model(answers,fields),answers,fields);
const input=extra=>({exam:'2017년 3월 학평 · 가형',level:'2',date:'2026-11-05',scope:'이차방정식',attempt:'first',timing:'untimed',minutes:'25',limit:'',total:'10',unlearned:'2',correct:'6',helped:'1',cause:'strategy',review:'none',startMonth:'2026-11',months:'1',...extra});
const record=extra=>({id:'source',exam:'2017년 3월 학평 · 가형',level:'2',date:'2026-11-05',savedOn:'2026-11-05',scope:'이차방정식',attempt:'first',timing:'untimed',minutes:25,limit:0,total:10,unlearned:0,correct:8,helped:1,cause:'concept',review:'none',startMonth:'2026-11',months:1,rangeMode:'whole',units:[{title:'이차방정식',missed:1,helped:1,cause:'concept'}],...extra});
const card=(html,id)=>html.match(new RegExp('<article[^>]*data-mock-library-paper="'+id+'"[\\s\\S]*?</article>'))?.[0]||'';

test('catalogue contains 92 distinct official papers, retaining both high-two variants from 2017 through 2019',()=>{
 assert.equal(L.PAPERS.length,92);
 assert.deepEqual(plain(L.YEARS),[2026,2025,2024,2023,2022,2021,2020,2019,2018,2017]);
 assert.equal(new Set(L.PAPERS.map(p=>p.id)).size,92);
 assert.equal(new Set(L.PAPERS.map(p=>p.exam+'|'+p.level)).size,92);
 for(const year of L.YEARS){
  const high1=L.list({year,level:'1'}),high2=L.list({year,level:'2'});
  assert.equal(high1.length,4,String(year));assert.equal(high2.length,year<=2019?8:4,String(year));
  assert.ok(high1.every(p=>!p.variant));
  for(const p of high2)assert.equal(!!p.variant,year<=2019);
  if(year<=2019)for(const month of new Set(high2.map(p=>p.month)))assert.deepEqual(plain(high2.filter(p=>p.month===month).map(p=>p.variant).sort()),['가형','나형']);
 }
 for(const p of L.PAPERS){
  assert.ok(['1','2'].includes(p.level));
  assert.ok(Number.isInteger(p.month)&&p.month>=1&&p.month<=12);
  assert.match(p.id,p.year===2026?/^h[12]-\d{2}$/:new RegExp('^y'+p.year+'-h[12]-\\d{2}(?:-[ab])?$'));
  for(const url of [p.files.problem,p.files.explanation]){
   const parsed=new URL(url);assert.equal(parsed.protocol,'https:');assert.equal(parsed.hostname,'wdown.ebsi.co.kr');assert.match(parsed.pathname,/\.pdf$/i);assert.equal(parsed.username,'');assert.equal(parsed.password,'');
  }
 }
});

test('record identity includes exact year, grade and variant and never trusts the result record ID',()=>{
 const a=L.find('y2017-h2-03-a'),b=L.find('y2017-h2-03-b');
 assert.ok(a&&b);assert.notEqual(a.exam,b.exam);assert.notEqual(a.files.problem,b.files.problem);
 assert.equal(L.find({exam:a.exam,level:'2'}).id,a.id);
 assert.equal(S.resolvePaper({id:b.id,exam:a.exam,level:'2'}).id,a.id);
 assert.equal(S.resolvePaper({exam:a.exam,level:'1'}),null);
 assert.equal(S.resolvePaper({exam:'2017년 3월 학평',level:'2'}),null,'no arbitrary default for an unspecified A/B variant');
 assert.equal(S.resolvePaper({id:'h1-03',exam:'2016년 3월 학평',level:'1'}),null);
 assert.equal(S.resolvePaper({exam:'2026년 3월 학평',level:'3'}),null);
});

test('year and grade filters show only the selected catalogue, with no fabricated missing dates',()=>{
 assert.deepEqual(plain(L.selection()),{year:2026,level:'all'});
 assert.deepEqual(plain(L.selection({year:'2018',level:'2'})),{year:2018,level:'2'});
 assert.deepEqual(plain(L.selection({year:1900,level:'3'})),{year:2026,level:'all'});
 for(const year of L.YEARS)for(const level of ['all','1','2']){
  const rows=L.list({year,level}),html=L.render({year,level});
  assert.ok(rows.every(p=>p.year===year&&(level==='all'||p.level===level)));
  assert.equal((html.match(/data-mock-library-paper=/g)||[]).length,rows.length);
  assert.match(html,/aria-live="polite"/);
  for(const p of rows)assert.ok(card(html,p.id));
 }
 const delayed=L.PAPERS.find(p=>p.examDate&&+p.examDate.slice(5,7)!==p.month);
 assert.ok(delayed,'verified delayed sitting remains distinct from the printed examination month');
 const html=card(L.render({year:delayed.year}),delayed.id);
 assert.ok(html.includes(delayed.month+'월'));
 assert.ok(html.includes(delayed.examDate.replaceAll('-','.')));
 const undated=L.PAPERS.find(p=>!p.examDate);assert.ok(undated);
 assert.doesNotMatch(card(L.render({year:undated.year}),undated.id),/class="mock-library-date"/,'an unverified sitting date is not guessed from the PDF URL');
});

test('historical results require a real selected scope while the 2026 schedule scopes remain available',()=>{
 for(const p of L.PAPERS){
  const prefill=L.prefill(p.id);assert.equal(prefill.exam,p.exam);assert.equal(prefill.level,p.level);
  if(p.year<2026){assert.equal(prefill.scope,'');assert.ok(E.save(null,input(prefill)).error);}
  else assert.deepEqual(plain(prefill),plain(S.prefill(p.id)));
 }
 assert.equal(L.prefill('not-a-paper'),null);
 const historical=L.prefill('y2017-h2-03-a');
 assert.equal(E.save(null,input({...historical,scope:'이차방정식 · 3~5번'})).error,null);
});

test('loading the archive preserves the original eight-paper schedule, dates and 2026 official links',()=>{
 const without=boot({library:false});
 assert.equal(S.PAPERS.length,8);assert.deepEqual(plain(S.PAPERS),plain(without.PlannerMockSchedule.PAPERS));
 assert.deepEqual(plain(scheduled(W)),plain(scheduled(without)));
 for(const p of S.PAPERS){
  assert.deepEqual(plain(L.find(p.id).files),plain(p.files));
  assert.equal(S.resolvePaper(p).id,p.id,'the exact paper identity is preserved');
 }
 assert.equal(without.PlannerMockSchedule.resolvePaper('y2017-h2-03-a'),null);
 assert.match(S.render(scheduled(W)),/data-learning-evidence-open="papers"/);
});

test('planning and result badges refer to the exact year, grade and variant without treating completion as a planned date',()=>{
 const row={...S.PAPERS.find(p=>p.id==='h1-03'),start:0,suggested:'2027-02'};
 const model={mockCheckPlan:{enabled:true,rows:[row,{...S.PAPERS.find(p=>p.id==='h2-03'),start:null,suggested:'2027-03',status:'done'}]}};
 const mock={records:[{id:'h1-03',exam:'2017년 3월 학평 · 가형',level:'2'}]};
 const html=L.render({year:2026},model,mock);
 assert.match(card(html,'h1-03'),/내 계획 · 2027-02/);
 assert.doesNotMatch(card(html,'h2-03'),/내 계획/);
 assert.doesNotMatch(html,/결과 기록 1개/);
 const archive=L.render({year:2017},model,mock);
 assert.doesNotMatch(archive,/내 계획/);
 assert.match(card(archive,'y2017-h2-03-a'),/결과 기록 1개/);
 assert.doesNotMatch(card(archive,'y2017-h2-03-b'),/결과 기록 1개/);
 assert.doesNotMatch(L.render({year:2026},{mockCheckPlan:{...model.mockCheckPlan,enabled:false}},mock),/내 계획 · /);
});

test('saved A/B results retain their identity, links and independent-performance counts after restoration and editing',()=>{
 const a=L.prefill('y2017-h2-03-a'),b=L.prefill('y2017-h2-03-b');
 const first=E.save(null,input({...a,scope:'이차방정식'}));assert.equal(first.error,null);
 const second=E.save(first.state,input({...b,scope:'함수',correct:'5'}));assert.equal(second.error,null);
 const restored=W.PlannerLearningEvidence.restore(JSON.parse(JSON.stringify({version:1,mock:second.state,concepts:{},work:{}}))).mock;
 assert.equal(restored.records.length,2);
 assert.equal(S.resolvePaper(restored.records[0]).id,'y2017-h2-03-a');
 assert.equal(S.resolvePaper(restored.records[1]).id,'y2017-h2-03-b');
 assert.equal(E.result(restored.records[0]).percent,75);assert.equal(E.result(restored.records[1]).percent,63);
 const html=E.render(restored,{today:'2026-11-06'});
 assert.ok(html.includes(L.find('y2017-h2-03-a').files.problem));assert.ok(html.includes(L.find('y2017-h2-03-b').files.problem));
 const changed=E.save(restored,input({...b,id:restored.records[0].id,scope:'함수',correct:'8',helped:'0'}));
 assert.equal(changed.error,null);assert.equal(S.resolvePaper(changed.state.records[0]).id,'y2017-h2-03-b');
 assert.equal(S.resolvePaper(restored.records[0]).id,'y2017-h2-03-a','editing does not mutate the original record');
});

test('unverified historical scope retains the recheck date without substituting a paper',()=>{
 const source=record(),state={version:1,records:[source]},initial=scheduled(W),before=JSON.stringify(initial);
 const next=F.attach(initial,state),p=next.mockFeedback.plans[0];
 assert.equal(p.start,'2026-11-05');assert.equal(p.end,'2026-11-19');assert.equal(p.recheck,'2026-11-26');
 assert.equal(p.paper.pending,true);assert.equal(S.resolvePaper(p.paper),null);
 assert.equal(next.lanes.find(l=>l.id==='mockRetest').blocks[0].calendarStart,'2026-11-26');
 assert.deepEqual(plain(next.lanes.filter(l=>!['mockCheck','mockRepair','mockRetest'].includes(l.id))),plain(initial.lanes.filter(l=>l.id!=='mockCheck')));
 assert.equal(JSON.stringify(initial),before);
 const prefill=F.prefill(next,'source');assert.equal(prefill,null);
 const html=F.render(next);assert.ok(!html.includes(L.find('y2017-h2-03-a').files.problem));assert.match(html,/2026년 11월 26일/);
});

test('manual or unsupported exams use an escaped grade-specific fallback and never supply a wrong direct PDF',()=>{
 for(const level of ['1','2','3']){
  const exam='<img src=x onerror=alert(1)>',html=S.paperLinks({exam,level},{caption:true});
  assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));assert.ok(!html.includes('wdown.ebsi.co.kr'));
  assert.ok(html.includes('targetCd=D'+({1:'100',2:'200',3:'300'}[level])));
 }
 assert.equal(S.paperLinks({exam:'',level:'1'}),'');
 for(const p of L.PAPERS){
  const html=S.paperLinks(p);
  assert.ok(html.includes('rel="noopener noreferrer"'));assert.ok(html.includes('(새 창)'));
  assert.match(html,/<details class="mock-paper-answers">/);assert.ok(!html.includes('<details open'));
 }
 const sample={...plain(W.PlannerMockLibraryData[0]),note:'<svg onload=alert(1)>'},other=boot({rows:[sample]});
 const html=other.PlannerMockLibrary.render();assert.ok(html.includes('&lt;svg'));assert.ok(!html.includes('<svg'));
});

test('member page loads catalogue data and module before the UI that opens the independent papers tab',()=>{
 const html=read('planner.html'),names=['planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-feedback.js','planner-ui.js'];
 const positions=names.map(name=>html.indexOf('data-member-src="'+name));assert.ok(positions.every(x=>x>=0));
 for(let i=1;i<positions.length;i++)assert.ok(positions[i]>positions[i-1],names[i]+' must load after '+names[i-1]);
});
