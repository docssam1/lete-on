import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const ids=(year,level,month,variant='')=>(year===2026?'':'y'+year+'-')+'h'+level+'-'+String(month).padStart(2,'0')+(variant?'-'+variant:'');
const group=(key,checkpoint,papers)=>({key,checkpoint,scope:'검수용 범위 '+key,ids:papers,sourceUrls:['https://example.invalid/scope/'+key]});
/* Fixtures specify equivalence deliberately. These tests do not claim that
 * identically named months from different curricula have equivalent scopes. */
const groups=()=>[
 group('middle','h1-03',[2026,2025,2024,2023].map(y=>ids(y,1,3))),
 group('single-new','h1-06',[ids(2026,1,6)]),
 group('older-compatible','h1-06',[ids(2025,1,6),ids(2024,1,6)]),
 group('old-a',null,[ids(2017,2,3,'a'),ids(2018,2,3,'a')]),
 group('old-b',null,[ids(2017,2,3,'b'),ids(2018,2,3,'b')])
];
function boot(scopeGroups=groups()){
 const window={},context=vm.createContext({window});
 for(const file of ['planner-mock-library-data.js','planner-mock-library.js'])vm.runInContext(read(file),context,{filename:file});
 window.PlannerMockSchedule={PAPERS:window.PlannerMockLibrary.PAPERS.filter(p=>p.year===2026).map(p=>({...p,scope:'旧 scope',needs:[['공통수학1',1]]}))};
 window.PlannerMockScopeGroups=scopeGroups;
 vm.runInContext(read('planner-mock-matching.js'),context,{filename:'planner-mock-matching.js'});
 return {window,M:window.PlannerMockMatching,L:window.PlannerMockLibrary};
}
const {M,L}=boot();
const record=(id,extra={})=>{const p=L.find(id);return{id:'result-'+id,exam:p.exam,level:p.level,...extra};};

test('catalog keeps the 92 exact paper identities, verified scope metadata and actual file links without mutating sources',()=>{
 const {window,M,L}=boot(),before=JSON.stringify({groups:window.PlannerMockScopeGroups,papers:L.PAPERS});
 const papers=M.catalog(),middle=papers.find(p=>p.id==='h1-03');
 assert.equal(papers.length,92);assert.equal(new Set(papers.map(p=>p.id)).size,92);
 assert.equal(middle.scopeKey,'middle');assert.equal(middle.checkpoint,'h1-03');assert.equal(middle.scope,'검수용 범위 middle');
 assert.deepEqual(Array.from(middle.scopeSources),['https://example.invalid/scope/middle']);
 assert.equal(middle.files.problem,L.find('h1-03').files.problem);
 assert.equal(papers.find(p=>p.id==='h2-09').scopeKey,null);
 assert.equal(JSON.stringify({groups:window.PlannerMockScopeGroups,papers:L.PAPERS}),before);
 assert.equal(Object.isFrozen(M),true);
});

test('source identity requires exact exam plus grade and never trusts a result ID or an unverified scope',()=>{
 assert.equal(M.identify(record('y2017-h2-03-a')).id,'y2017-h2-03-a');
 assert.equal(M.identify(record('y2017-h2-03-b')).id,'y2017-h2-03-b');
 assert.equal(M.identify({id:'h1-03',exam:'알 수 없는 모평',level:'1'}),null);
 assert.equal(M.identify({exam:'2017년 3월 모평 · 가형',level:'2'}),null);
 assert.equal(M.sourceFor(record('h2-09')),null);
 assert.equal(M.sourceFor(record('y2017-h2-03-a')).scopeKey,'old-a');
});

test('exposure includes partial and retry records, explicit seen IDs and exact or legacy completed overrides',()=>{
 const records=[record('y2025-h1-03',{rangeMode:'selected',unlearned:8}),record('y2024-h1-03',{attempt:'retry',helped:5})];
 const schedule={seenPaperIds:['y2023-h1-03','not-a-paper'],overrides:{'h1-03':{status:'done'},'h1-06':{status:'done',paperId:'y2024-h1-06'},'h1-09':{status:'skip'},'h1-10':{status:'planned'}}};
 const before=JSON.stringify({records,schedule}),used=M.seen(records,schedule);
 assert.deepEqual([...used].sort(),['h1-03','y2023-h1-03','y2024-h1-03','y2024-h1-06','y2025-h1-03'].sort());
 assert.equal(used.has('h1-06'),false);assert.equal(used.has('h1-09'),false);
 assert.equal(JSON.stringify({records,schedule}),before);
});

test('legacy aliases only exclude exposure, including both A/B forms when the old label is ambiguous',()=>{
 const used=M.seen([{exam:'2017년 3월 모평',level:'2'},{exam:'2018년 3월 모의고사 · 가형',level:'2'},{exam:'2024년 3월 고1 수학 학평',level:'1'}]);
 assert.deepEqual([...used].sort(),['y2017-h2-03-a','y2017-h2-03-b','y2018-h2-03-a','y2024-h1-03'].sort());
 assert.equal(M.seen([{exam:'2017년 3월 모평 관련 교재',level:'2'}]).size,0);
 assert.equal(M.seen([{exam:'2024년 3월 고2 수학 학평',level:'1'}]).size,0);
 assert.equal(M.sourceFor({exam:'2017년 3월 모평',level:'2'}),null);
});

test('publication availability uses the verified actual date, or year-end when a date is unknown',()=>{
 const delayed=L.find('y2023-h1-11');
 assert.equal(delayed.examDate,'2023-12-19');
 assert.equal(M.available(delayed,'2023-12-18'),false);assert.equal(M.available(delayed,'2023-12-19'),true);
 assert.equal(M.available({year:2025,month:3},'2025-12-30'),false);
 assert.equal(M.available({year:2025,month:3},'2025-12-31'),true);
 assert.equal(M.available({year:2025,examDate:'2025-02-30'},'2026-11-06'),false);
 assert.equal(M.available({year:2025},'2026-11'),false);
});

test('initial selection prefers a scope with another unseen year available rather than a latest-year singleton',()=>{
 assert.equal(M.selectInitial('h1-06',[],{},'2026-11-06').id,'y2025-h1-06');
 assert.equal(M.selectInitial('h1-06',[record('y2024-h1-06')],{},'2026-11-06').id,'h1-06');
 assert.equal(M.selectInitial('h1-03',[],{},'2026-11-06').id,'h1-03');
 assert.equal(M.selectInitial('h1-03',[],{},'2026-11-06',new Set(['h1-03'])).id,'y2025-h1-03');
 assert.equal(M.selectInitial('h2-09',[],{},'2026-11-06'),null);
});

test('initial selection excludes completed, manually seen and recorded papers without changing the saved schedule',()=>{
 const schedule={overrides:{'h1-03':{status:'done'}},seenPaperIds:['y2025-h1-03']},records=[record('y2024-h1-03',{rangeMode:'selected'})];
 const before=JSON.stringify(schedule);
 assert.equal(M.selectInitial('h1-03',records,schedule,'2026-11-06').id,'y2023-h1-03');
 assert.equal(M.selectInitial('h1-03',records,schedule,'2026-11-06',new Set(['y2023-h1-03'])),null);
 assert.equal(JSON.stringify(schedule),before);
});

test('recheck uses the exact same verified scope in a different year and preserves a still-eligible saved choice',()=>{
 const source=record('y2024-h1-03');
 assert.equal(M.selectRecheck(source,[source],{},'2026-11-06').id,'h1-03');
 assert.equal(M.selectRecheck(source,[source],{},'2026-11-06',new Set(),'y2025-h1-03').id,'y2025-h1-03');
 assert.equal(M.selectRecheck(source,[source],{},'2026-11-06',new Set(['y2025-h1-03']),'y2025-h1-03').id,'h1-03');
 assert.equal(M.selectRecheck(source,[source,record('h1-03')],{seenPaperIds:['y2025-h1-03']},'2026-11-06').id,'y2023-h1-03');
});

test('retest-only A/B scopes never become initial checkpoints or interchange forms',()=>{
 const source=record('y2017-h2-03-a');
 assert.equal(M.selectInitial(null,[],{},'2026-11-06'),null);
 assert.equal(M.selectInitial('h2-03',[],{},'2026-11-06'),null);
 assert.equal(M.selectRecheck(source,[source],{},'2026-11-06').id,'y2018-h2-03-a');
 assert.equal(M.selectRecheck(source,[source,record('y2018-h2-03-a')],{},'2026-11-06'),null);
 assert.equal(M.selectRecheck(source,[source],{},'2026-11-06',new Set(),'y2018-h2-03-b').id,'y2018-h2-03-a');
});

test('unavailable, unknown, exhausted or conflicting scopes return no paper instead of a same-paper retry or broader substitute',()=>{
 const source=record('y2024-h1-03'),used=[2026,2025,2023].map(y=>record(ids(y,1,3)));
 assert.equal(M.selectRecheck(source,[source,...used],{},'2026-11-06'),null);
 assert.equal(M.selectRecheck(record('h2-09'),[],{},'2026-11-06'),null);
 assert.equal(M.selectInitial('h1-03',[],{},'2016-12-31'),null);
 const conflict=boot([...groups(),group('conflict','h1-03',['h1-03'])]).M;
 assert.equal(conflict.sourceFor(record('h1-03')),null);
 assert.equal(conflict.selectInitial('h1-03',[],{},'2026-11-06').id,'y2025-h1-03');
});

test('recheck cannot keep a saved source-year, broader-scope, unknown or already-exposed choice',()=>{
 const source=record('y2024-h1-03');
 for(const savedId of ['y2024-h1-03','h1-06','missing'])assert.equal(M.selectRecheck(source,[source],{},'2026-11-06',new Set(),savedId).id,'h1-03');
 assert.equal(M.selectRecheck(source,[source,record('h1-03',{rangeMode:'selected'})],{},'2026-11-06',new Set(),'h1-03').id,'y2025-h1-03');
});

test('production scope groups reference unique known papers and current checkpoint IDs with inspectable source URLs',()=>{
 const {window,M,L}=boot();vm.runInNewContext(read('planner-mock-scopes.js'),{window});
 const known=new Set(L.PAPERS.map(p=>p.id)),slots=new Set(window.PlannerMockSchedule.PAPERS.map(p=>p.id)),assigned=new Set();
 for(const group of window.PlannerMockScopeGroups){
  assert.ok(group.key&&group.scope);assert.ok(group.ids.length);assert.ok(group.checkpoint===null||slots.has(group.checkpoint));assert.ok(group.sourceUrls.length);
  for(const url of group.sourceUrls)assert.equal(new URL(url).protocol,'https:');
  for(const id of group.ids){assert.ok(known.has(id),id);assert.equal(assigned.has(id),false,id);assigned.add(id);}
 }
 assert.equal(M.catalog().filter(p=>p.scopeKey).length,assigned.size);
});

test('production matching keeps 2015 and 2022 high-school curricula separate while allowing verified older-year rechecks',()=>{
 const {window,M}=boot();vm.runInNewContext(read('planner-mock-scopes.js'),{window});
 const old=record('y2025-h2-06'),current=record('h2-06');
 assert.notEqual(M.sourceFor(old).scopeKey,M.sourceFor(current).scopeKey);
 assert.equal(M.selectRecheck(old,[old],{},'2026-11-06').id,'y2024-h2-06');
 assert.equal(M.selectRecheck(current,[current],{},'2026-11-06'),null);
 const common=record('h1-09');assert.equal(M.selectRecheck(common,[common],{},'2026-11-06').id,'y2025-h1-09');
 assert.equal(M.selectInitial('h2-06',[],{},'2026-11-06').id,'h2-06');
});
