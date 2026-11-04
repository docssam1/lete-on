import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-standard.js','planner-curriculum.js','planner-mock-evidence.js','planner-learning-evidence.js','planner-goal-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const {PlannerMockEvidence:M,PlannerLearningEvidence:E,PlannerCurriculum:C,PlannerGoalCurriculum:G}=window;
const plain=v=>JSON.parse(JSON.stringify(v));
const input=(extra={})=>({exam:'2026년 3월 학평',level:'1',date:'2026-11-05',scope:'중등 함수',attempt:'first',timing:'untimed',minutes:'25',limit:'',total:'10',unlearned:'2',correct:'6',helped:'1',cause:'strategy',review:'planned',startMonth:'2026-12',months:'1',...extra});
const base={year:2026,month:11,horizon:3,lanes:[{id:'school',blocks:[{id:'existing',start:0,end:3}]}],warnings:[]};
const a={grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'mid',schoolBook:'원리해설',schoolExact:'16',schoolStatus:'progress',deepCourse:'mid',deepBook:'A급',deepStage:'15',deepStatus:'progress',calc:'none'};
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
test('unlearned and helped questions never count as independent mastery; first attempt and retry stay separate',()=>{
 const first=M.save(null,input());assert.equal(first.error,null);const r=first.state.records[0],x=M.result(r);
 assert.equal(x.learned,8);assert.equal(x.percent,75);assert.equal(x.pending,1);
 const retry=M.save(first.state,input({attempt:'retry',correct:'8',helped:'0',timing:'timed',limit:'20',minutes:'22',review:'none'}));
 assert.equal(retry.error,null);assert.equal(retry.state.records.length,2);assert.equal(M.result(retry.state.records[0]).percent,75);assert.equal(M.result(retry.state.records[1]).percent,100);
 assert.match(M.label(retry.state.records[1]),/再|재풀이/);assert.match(M.label(retry.state.records[1]),/제한 20분.*실제 22분/);
 const unseen=M.save(null,input({unlearned:'10',correct:'0',helped:'0',review:'none'}));assert.equal(unseen.error,null);assert.equal(M.result(unseen.state.records[0]).percent,null);
 assert.ok(M.save(null,input({unlearned:'10',correct:'0',helped:'0'})).error);
});
test('invalid counts, blank counts, dates, durations and timed entries are rejected without changing records',()=>{
 const s=M.save(null,input()).state,before=JSON.stringify(s);
 for(const bad of [{correct:'9'},{correct:'7',helped:'2'},{unlearned:'11'},{total:''},{correct:''},{total:'1.5'},{helped:'-1'},{date:'2026-02-30'},{startMonth:'2026-13'},{months:'0'},{months:'7'},{timing:'timed',limit:''},{minutes:'0'},{exam:' '.repeat(4)},{scope:''},{level:'4'}])assert.ok(M.save(s,input(bad)).error,JSON.stringify(bad));
 assert.equal(JSON.stringify(s),before);
});
test('restoration, edit, completion, reopening and deletion preserve other observations and workload',()=>{
 const saved=M.save(null,input()).state,r=saved.records[0],edited=M.save(saved,input({id:r.id,correct:'5'}));assert.equal(edited.error,null);assert.equal(edited.state.records.length,1);
 assert.equal(edited.state.records[0].correct,5);assert.equal(saved.records[0].correct,6);
 const e=E.saveWork(null,{course:'교과',month:'2026-11',unit:'session',planned:'20',completed:'15'},['교과']).state;
 const restored=E.restore(JSON.parse(JSON.stringify({...e,mock:edited.state})));assert.equal(restored.mock.records.length,1);assert.equal(E.workSummary(restored,'2026-11')[0].percent,75);
 const done=M.reviewStatus(edited.state,r.id,'done');assert.equal(M.attach(base,done).lanes.length,1);assert.equal(M.attach(base,M.reviewStatus(done,r.id,'planned')).lanes.length,2);
 assert.equal(M.remove(edited.state,r.id).records.length,0);assert.equal(edited.state.records.length,1);
 assert.equal(M.restore({version:1,records:[r,r,{...r,id:'bad<>',correct:999}]}).records.length,1);
 assert.ok(M.save(saved,input({id:'not-present'})).error);
});
test('absolute review dates are identical in map, table, detail, graph and report without changing existing progress',()=>{
 const s=M.save(null,input({months:'1.5'})).state,before=JSON.stringify(base),m=M.attach(base,s),lane=m.lanes.find(l=>l.id==='mockReview'),b=lane.blocks[0];
 assert.equal(b.start,1);assert.equal(b.end,2.5);assert.equal(C.period(m,b),'2026년 12월 – 2027년 1월');
 assert.equal(JSON.stringify(base),before);assert.deepEqual(plain(m.lanes[0]),plain(base.lanes[0]));
 for(const view of ['map','graph','table'])assert.match(M.renderSchedule(m,view),/2026년 12월 – 2027년 1월/);
 assert.match(C.detail(m,b.id).html,/2026년 12월 – 2027년 1월/);assert.match(M.notes(s)[0],/2026-12부터 1.5개월/);
 const shifted=M.attach({...base,year:2027,month:3},s);assert.equal(shifted.lanes.at(-1).blocks[0].start,-3);assert.match(shifted.warnings[0],/자동으로 옮기지/);
});
test('medicine, gifted-school and KMO plans receive the same review without advancing courses or requiring contest study',()=>{
 const mock=M.save(null,input()).state,evidence=E.restore({version:1,mock});
 const k=C.model(a,fields),withMock=E.attachReviews(k,evidence);
 assert.deepEqual(plain(withMock.lanes.filter(l=>l.id!=='mockReview')),plain(k.lanes));
 for(const goal of ['medicine','giftedSchool','scienceHigh']){
  const old=G.model(a,fields,null,goal),next=G.model(a,fields,null,goal,null,{evidence});
  assert.deepEqual(plain(next.lanes.filter(l=>l.id!=='mockReview')),plain(old.lanes));
  assert.equal(next.lanes.find(l=>l.id==='mockReview').blocks[0].start,1);
  assert.ok(!next.lanes.some(l=>l.id==='kmo'));
 }
});
test('manual text is escaped; form explains interpretation and separates future automated tests',()=>{
 const s=M.save(null,input({exam:'<img src=x onerror=alert(1)>',scope:'<script>x</script>'})).state,html=M.render(s,{today:'2026-11-05',month:'2026-11'});
 assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.match(html,/직접 입력한 점검 기록/);assert.match(html,/아직 배우지 않은/);assert.match(html,/초견/);assert.match(html,/연동은 준비 중/);
 const doc=readFileSync(new URL('planner.html',import.meta.url),'utf8');assert.ok(doc.indexOf('planner-mock-evidence.js')<doc.indexOf('planner-learning-evidence.js'));
});
