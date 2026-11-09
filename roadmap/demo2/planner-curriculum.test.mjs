import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),ctx,{filename:f});
const C=window.PlannerCurriculum,I=window.PlannerIntake;
const fields={grade:'7',year:'2026',mon:'11',band:'B',speed:'2'};
const base=()=>({grade:'7',gradeInput:'current',thinkingExperience:'none',schoolCourse:'mid',schoolBook:'원리해설',schoolExact:'16',schoolStatus:'progress',deepCourse:'mid',deepBook:'A급',deepStage:'15',deepStatus:'progress',calc:'none'});
const lane=(m,id)=>m.lanes.find(l=>l.id===id);
const measure=(a,status,done,total)=>({...a,[I.progressKey(status)]:{course:I.progressCourse(a,status),done,total,unit:'unit'}});
const plain=x=>JSON.parse(JSON.stringify(x));

test('faster and later learners use the same core with actual prerequisite completion, without an age cutoff',()=>{
 const slow=base(),fast={...base(),grade:'4',schoolCourse:'high',schoolBook:'수학의 정석',schoolHigh:'공통수학2',schoolStatus:'done',deepStage:'19',deepStatus:'done'};
 const m=C.model(slow,fields),f=C.model(fast,fields);
 assert.equal(lane(m,'school').blocks[0].stage,'중2-1');
 assert.equal(m.entry,12);assert.equal(m.introEntry,24);assert.equal(f.entry,0);
 assert.deepEqual(plain(lane(m,'kmo').blocks.map(b=>b.id)),plain(lane(f,'kmo').blocks.map(b=>b.id)));
 assert.deepEqual(plain(lane(m,'school').blocks.map(b=>[b.stage,b.start,b.end])),plain(lane(C.model({...slow,grade:'10'},fields),'school').blocks.map(b=>[b.stage,b.start,b.end])));
 assert.ok(lane(m,'school').blocks.some(b=>b.stage==='기하'),'school-age boundaries never truncate the learning path');
});
test('exact progress shortens only the current course and cascades its dependent start times',()=>{
 const a=base(),full=C.model(a,fields),part=C.model(measure(a,'schoolStatus',3,4),fields);
 assert.equal(lane(part,'school').blocks[0].end,.75);assert.equal(part.academicReady,full.academicReady-2.25);
 assert.deepEqual(plain(lane(part,'deep').blocks.filter(b=>!b.highPhase)),plain(lane(full,'deep').blocks.filter(b=>!b.highPhase)),'reported middle depth keeps its own independent calendar; proposed high depth follows its prerequisites');
 const d=C.model(measure(a,'deepStatus',3,4),fields);assert.equal(lane(d,'deep').blocks[0].end,.75);
 assert.deepEqual(plain(lane(d,'school')),plain(lane(full,'school')));
});
test('completed courses and advanced high-school learning never restart the reference curriculum',()=>{
 const a={...base(),schoolCourse:'high',schoolBook:'개념원리 고등',schoolHigh:'미적분Ⅰ',deepCourse:'high',deepBook:'수학의 정석',deepStage:'대수'};
 const m=C.model(a,fields);assert.equal(m.entry,0);assert.equal(lane(m,'school').blocks[0].stage,'미적분Ⅰ');
 assert.equal(lane(m,'deep').blocks[0].stage,'대수');assert.ok(!lane(m,'school').blocks.some(b=>b.stage==='공통수학1'));
 const done=C.model({...a,schoolStatus:'done'},fields);assert.equal(lane(done,'school').blocks[0].stage,'미적분Ⅰ');assert.equal(lane(done,'school').blocks[0].applicationOnly,true,'concept completion does not complete application');
 const bridge=C.model({...base(),school:'advanced',schoolExact:'13'},fields);assert.equal(lane(bridge,'school').blocks[0].stage,'초등 계통 대수심화');
});
test('a current KMO stage continues immediately with its remaining workload even when academics lag',()=>{
 const m=C.model(base(),fields,{version:1,stage:'first',status:'progress',done:3,total:4});
 const bs=lane(m,'kmo').blocks;assert.equal(bs[0].id,'kmo-basic');assert.equal(bs[0].start,0);assert.equal(bs[0].end,3);assert.equal(bs[1].start,3);
 assert.ok(!bs.some(b=>b.id==='kmo-intro'));assert.ok(m.warnings.some(t=>t.includes('공부 중인 KMO')));
 const done=C.model(base(),fields,{version:1,stage:'first',status:'done',done:3,total:4});assert.equal(lane(done,'kmo').blocks[0].id,'kmo-advanced');assert.equal(lane(done,'kmo').blocks[0].start,0);
 const advanced=C.model(base(),fields,{version:1,stage:'proof',goal:'first'});assert.equal(lane(advanced,'kmo').blocks[0].id,'kmo-advanced','a shorter goal never removes the reported current stage');
});
test('missing progress is explicit, unknown prerequisites stay undated, and current KMO remains independent',()=>{
 const a={...base(),schoolCourse:'unknown',deepCourse:'unknown'},m=C.model(a,fields);
 assert.equal(m.entry,null);assert.equal(lane(m,'kmo').blocks.length,0);assert.equal(lane(m,'school').blocks.length,0);
 const p=C.model(a,fields,{version:1,stage:'intro'});assert.equal(lane(p,'kmo').blocks[0].start,0);
 const unmeasured=C.model(base(),fields);assert.equal(lane(unmeasured,'school').blocks[0].fraction,0);assert.ok(unmeasured.warnings.some(t=>t.includes('전체 기간')));
});
test('foundation reviews middle depth while common math gates the later introductory stage',()=>{
 const a={...base(),schoolCourse:'elem',schoolBook:'디딤돌 응용',school:'6-2',deepCourse:'none'},m=C.model(a,fields);
 assert.equal(lane(m,'deep').blocks.filter(b=>!b.highPhase).length,0,'foundation covers the essential review rather than stacking a full duplicate depth curriculum');
 const kmo=lane(m,'kmo').blocks;assert.equal(kmo[0].start,m.middleAcademicReady);assert.equal(kmo[0].end-kmo[0].start,3);
 assert.equal(kmo[1].start,Math.max(kmo[0].end,m.academicReady));
 const rpm=C.model({...base(),deepBook:'RPM',deepStage:'19',deepStatus:'done'},fields);
 assert.ok(lane(rpm,'kmo').blocks.some(b=>b.id==='kmo-foundation'));assert.ok(rpm.warnings.some(t=>t.includes('RPM')));
});
test('duration and start-month choices recompute all views from the same boundaries and reject invalid input',()=>{
 const before=C.model(base(),fields),v={startMonth:'2027-01',stage:'none',status:'progress',goal:'second',middleReady:'reported',done:'',total:'',...before.durations,midMonths:'4',highMonths:'8'};
 const result=C.update(null,v);assert.equal(result.errors.length,0);const m=C.model(base(),fields,result.state);assert.equal(m.academicReady,32);
 const first=lane(m,'school').blocks[0];assert.equal(C.period(m,first),'2027년 1월 – 4월');
 assert.ok(C.render(m,'map').includes('2027년 1월 – 4월'));assert.ok(C.render(m,'graph').includes('2027년 1월 – 4월'));
 assert.ok(C.render(m,'table').includes('2027년 1월'));assert.ok(C.render(m,'table',24).includes(C.date(m,m.introEntry).label));
 assert.ok(C.update(null,{...v,midMonths:'-1'}).errors.length);assert.ok(C.update(null,{...v,stage:'intro',done:'10',total:'5'}).errors.length);
 assert.equal(C.model(base(),fields,{version:1,goal:'first'}).lanes.find(l=>l.id==='kmo').blocks.length,3);
});
test('saved state is immutable and unrelated calculation keeps its own duration when KMO changes',()=>{
 const a={...base(),calc:'기적의 계산법 6권',calcStatus:'progress'},v={version:1,stage:'intro',done:1,total:4,periods:{introMonths:2}},snapshot=JSON.stringify([a,v,window.PLANNER_LEVELS]);
 const m=C.model(a,fields,v),n=C.model(a,fields,{...v,periods:{introMonths:4}});
 assert.deepEqual(plain(lane(m,'calc')),plain(lane(n,'calc')));assert.equal(JSON.stringify([a,v,window.PLANNER_LEVELS]),snapshot);
 assert.deepEqual(plain(C.restore(JSON.parse(JSON.stringify(v)))),plain(C.restore(v)));
});

test('the supplied five stages retain their distinct duration and selected materials and subject scope',()=>{
 assert.deepEqual(plain(C.KMO.map(s=>s.months)),[3,6,12,12,6]);
 const m=C.model(base(),fields),b=lane(m,'kmo').blocks;
 assert.equal(b.length,5);const intro=C.detail(m,'kmo-intro').html,basic=C.detail(m,'kmo-basic').html,advanced=C.detail(m,'kmo-advanced').html;
 assert.match(intro,/CPG/);assert.match(intro,/合|합동식/);assert.match(intro,/체바/);assert.ok(!intro.includes('<summary>수열·기타'));
 assert.match(basic,/AMC/);assert.match(basic,/비둘기집/);assert.match(advanced,/오일러 φ/);assert.match(advanced,/피보나치/);
});

test('동시 현재 심화 두 과목이 표준·목표 월별 일정에서 보존된다',()=>{
 const a={...base(),schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'대수',schoolStatus:'progress',deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',deepStatus:'progress',deepExtra:'yes',deepExtraStage:'대수',deepExtraBook:'고쟁이',deepExtraStatus:'progress',calc:'unknown'};
 for(const m of [C.model(a,fields),window.PlannerStandard.model(a,fields)]){
  const current=lane(m,'deep').blocks.filter(b=>b.current);
  assert.deepEqual(plain(current.map(b=>b.stage).sort()),['공통수학2','대수']);
  assert.ok(current.every(b=>b.reported&&!b.proposed));
 }
 assert.equal(a.calc,'unknown');
});

test('동시에 시작하는 두 심화 블록은 표준 달력과 목표 그래프의 서로 다른 시각 행에 놓인다',()=>{
 const a={...base(),schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'대수',deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',deepStatus:'progress',deepExtra:'yes',deepExtraStage:'대수',deepExtraBook:'고쟁이',deepExtraStatus:'progress'};
 const c=C.model(a,fields),s=window.PlannerStandard.model(a,fields);
 for(const [m,html,track] of [[c,C.render(c,'graph'),'curriculum-track'],[s,window.PlannerStandard.render(s,{view:'table'}),'standard-lane-track']]){
  const snapshot=JSON.stringify(m);
  const rows=[...html.matchAll(new RegExp('<div class="'+track+'">([\\s\\S]*?)</div>','g'))].map(x=>x[1]);
  const primary=rows.findIndex(x=>x.includes('data-'+(track==='curriculum-track'?'curriculum':'standard')+'-block="deep-20"'));
  const extra=rows.findIndex(x=>x.includes('deep-additional-2'));
  assert.ok(primary>=0);assert.ok(extra>=0);assert.notEqual(primary,extra);
  assert.match(html,/추가 현재 심화/);
  assert.equal(JSON.stringify(m),snapshot);
 }
});

test('사고력 질문 생략한 신규 고등 입력은 사고력 과정을 만들지 않고 실제 옛 기록만 보존한다',()=>{
 const a={grade:'4',gradeInput:'current',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'대수',schoolStatus:'progress',deepCourse:'high',deepBook:'실력정석',deepStage:'공통수학2',deepStatus:'progress',deepExtra:'yes',deepExtraStage:'대수',deepExtraBook:'고쟁이',deepExtraStatus:'progress',calc:'unknown'};
 const before=JSON.stringify(a);
 assert.equal(I.buildPlan(a,fields).rows.find(r=>r.key==='comp').blocks.length,0);
 const p=I.profile(a,fields).rows.find(r=>r.key==='thinking1');assert.equal(p.blocks.length,0);assert.equal(p.remaining.length,0);
 const t=window.PlannerStandard.model(a,fields).lanes.find(l=>l.id==='thinking');assert.equal(t.blocks.length,0);assert.equal(t.status,'pending');
 assert.equal(JSON.stringify(a),before);assert.equal(a.thinkingExperience,undefined);
 const old={...a,thinkingExperience:'yes',thinking:'1031 초급',thinkingStatus:'progress'};
 const saved=window.PlannerStandard.model(old,fields).lanes.find(l=>l.id==='thinking');assert.equal(saved.status,'known');assert.ok(saved.blocks.length>0);
 assert.equal(old.thinking,'1031 초급');
});
