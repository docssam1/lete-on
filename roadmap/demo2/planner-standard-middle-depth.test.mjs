// 중등 심화 줄 (원장님 2026-11-11): 낮은 레벨은 쎈 또는 RPM, 중간은 쎈과 일품, 그 위는 쎈과 에이급.
// 레벨 구분은 2026-10-20 표준 세 묶음(C L10~L13 · B L4~L9 · A L0~L3)을 그대로 쓴다.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
function fixture(){const window={},c=vm.createContext({window});for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-high-study.js','planner-standard.js','planner-curriculum.js','planner-math-books-data.js'])vm.runInContext(read(f),c,{filename:f});return window;}
// 초5 예시: 교과 5-2 디딤돌 기본+응용, 심화 5-1 최상위 수학, 사고력 1031 입문.
const example=()=>({a:{grade:'5',gradeInput:'current',thinkingExperience:'yes',thinking:'1031 입문',thinkingStatus:'progress',schoolCourse:'elem',schoolBook:'디딤돌 기본+응용',school:'5-2',schoolStatus:'progress',deepCourse:'elem',deepBook:'최상위 수학',deepStage:'5-1',deepStatus:'progress',calc:'기적의 계산법 6권',calcStatus:'progress',gifted:'pending'},f:{grade:'5',year:'2026',mon:'11',band:'B',speed:'2'}});
const lane=(m,id)=>m.lanes.find(l=>l.id===id);
const rule=m=>lane(m,'deep').blocks.filter(b=>b.source==='level-depth-rule');
const MID=['중1-1','중1-2','중2-1','중2-2','중3-1','중3-2'];
// 심화가 교과를 앞서지 않고, 앞 심화와 겹치지 않는다.
function assertFollowsSchool(m){
 const school=lane(m,'school').blocks,deep=lane(m,'deep').blocks;
 for(let i=1;i<deep.length;i++)assert.ok(deep[i].start>=deep[i-1].end-1e-8,`${deep[i].title} overlaps ${deep[i-1].title}`);
 for(const b of rule(m)){const lesson=school.find(s=>s.stage===b.stage&&!s.highPhase);if(lesson)assert.ok(b.start>=lesson.start-1e-8,`${b.title} starts before the school course`);}
}

test('초5 예시: 6-2 최상위 수학 뒤의 심화 줄이 중등 구간까지 이어지고, L13은 쎈 또는 RPM이다',()=>{
 const w=fixture(),{a,f}=example(),saved=JSON.stringify(a),levels=JSON.stringify(w.PLANNER_LEVELS);
 const m=w.PlannerStandard.model(a,f),deep=lane(m,'deep').blocks,school=lane(m,'school').blocks;
 assert.equal(m.level,'L13');assert.equal(m.band,'C');assert.equal(m.independentDepth,true);
 assert.deepEqual(Array.from(deep.slice(0,4),b=>b.title),['5-1 최상위 수학','5-2 최상위 수학','6-1 최상위 수학','6-2 최상위 수학'],'reported elementary depth is kept as it was');
 const middle=rule(m);assert.ok(middle.length>=4);
 assert.deepEqual(Array.from(middle,b=>b.stage),MID.slice(0,middle.length));
 for(const b of middle){assert.equal(b.title,b.stage+' 쎈 중등 또는 RPM 중학');assert.equal(b.kind,'deep');assert.equal(b.proposed,true);assert.equal(b.depthTier,'low');assert.deepEqual([...b.books],['쎈 중등','RPM 중학']);}
 // 교과가 중1-1을 시작한 뒤에, 한 학기는 교과 한 학기와 같은 길이로.
 const first=middle[0],lesson=school.find(b=>b.stage==='중1-1');
 assert.ok(first.start>=deep[3].end&&first.start>=lesson.start);assert.equal(first.end-first.start,lesson.end-lesson.start);
 assert.ok(Math.max(...deep.map(b=>b.end))>=23.5,'the depth lane now reaches the end of the 24-month table');
 assertFollowsSchool(m);
 assert.deepEqual({...m.depthRule,books:[...m.depthRule.books]},{tier:'low',books:['쎈 중등','RPM 중학'],title:'쎈 중등 또는 RPM 중학'});
 assert.match(m.depthRuleNote,/레벨에 따라 달라집니다/);assert.match(m.depthRuleNote,/L13 기준이라 쎈 중등 또는 RPM 중학으로/);
 assert.ok(m.assumptions.includes(m.depthRuleNote));
 const table=w.PlannerStandard.render(m,{view:'table'}),map=w.PlannerStandard.render(m,{view:'map'});
 assert.match(table,/중1-1 쎈 중등 또는 RPM 중학/);assert.match(table,/<p class="standard-source-end standard-depth-rule">중등 심화 교재는 학습 레벨에 따라 달라집니다/);
 assert.doesNotMatch(map,/<p class="standard-source-end standard-depth-rule">/,'the map view keeps the sentence inside the assumptions only');assert.match(map,/레벨에 따라 달라집니다/);
 assert.equal(JSON.stringify(a),saved,'answers (the saved format) are not changed');assert.equal(JSON.stringify(w.PLANNER_LEVELS),levels,'the level table is not changed');
});

test('레벨이 다르면 교재 조합이 달라진다: L4~L9는 쎈과 일품, L0~L3은 쎈과 에이급',()=>{
 const w=fixture();
 const cases=[
  [{grade:'2',school:'6-1',schoolBook:'디딤돌 응용',deepBook:'최상위 S',deepStage:'5-1'},'2','B','middle','쎈 중등 + 일품 중등',/^L[4-9]$/],
  [{grade:'1',school:'6-2',schoolBook:'디딤돌 응용',deepBook:'최상위 S',deepStage:'6-1'},'1','A','high','쎈 중등 + 에이급수학',/^L[0-3]$/],
  [{grade:'3',deepBook:'최상위 S',deepStage:'4-2'},'3','C','low','쎈 중등 또는 RPM 중학',/^L1[0-3]$/]
 ];
 for(const [change,grade,band,tier,title,level] of cases){
  const {a,f}=example();Object.assign(a,change);f.grade=grade;
  const m=w.PlannerStandard.model(a,f),middle=rule(m);
  assert.match(m.level,level);assert.equal(m.band,band);assert.equal(m.depthRule.tier,tier);assert.equal(m.depthRule.title,title);
  assert.ok(middle.length>=3,title);for(const b of middle)assert.equal(b.title,b.stage+' '+title);
  assert.ok(m.depthRuleNote.includes(m.level+' 기준이라 '+title+'으로'));
  assertFollowsSchool(m);
 }
});

test('새 줄의 교재 이름은 교재 난이도 지도의 중등 교재 표기와 같다',()=>{
 const w=fixture(),books=w.GFIELD_MATH_BOOKS.filter(b=>b.stages.includes('middle')&&b.track==='curriculum'),band=title=>books.find(b=>b.title===title)?.band;
 const seen=new Set();
 for(const [change,grade] of [[{},'5'],[{grade:'2',school:'6-1',schoolBook:'디딤돌 응용'},'2'],[{grade:'1',school:'6-2',schoolBook:'디딤돌 응용',deepStage:'6-1'},'1']]){
  const {a,f}=example();Object.assign(a,change);f.grade=grade;
  for(const name of w.PlannerStandard.model(a,f).depthRule.books){assert.ok(books.some(b=>b.title===name),name+' is a middle-school title on the book map');seen.add(name);}
 }
 assert.deepEqual([...seen].sort(),['RPM 중학','쎈 중등','에이급수학','일품 중등'].sort());
 // 유형(쎈·RPM) < 준심화(일품) < 심화(에이급): 지도의 단계 순서와 낮음·중간·위 순서가 어긋나지 않는다.
 assert.equal(band('쎈 중등'),band('RPM 중학'));assert.ok(band('쎈 중등')<band('일품 중등'));assert.ok(band('일품 중등')<band('에이급수학'));
});

test('공부 중인 심화가 없을 때의 표준 제안(교과·심화 중심)도 레벨별 교재를 같은 학기 교과 옆에 놓는다',()=>{
 const w=fixture();
 for(const [change,grade,title] of [[{thinkingExperience:'none'},'5','쎈 중등 또는 RPM 중학'],[{grade:'2',school:'5-1',schoolBook:'디딤돌 응용'},'2','쎈 중등 + 일품 중등'],[{grade:'1',school:'6-2',schoolBook:'디딤돌 응용'},'1','쎈 중등 + 에이급수학']]){
  const {a,f}=example();Object.assign(a,change,{deepCourse:'none'});delete a.deepBook;delete a.deepStage;delete a.deepStatus;f.grade=grade;
  const m=w.PlannerStandard.model(a,f,{pattern:'deep'}),school=lane(m,'school').blocks.filter(b=>MID.includes(b.stage)),middle=rule(m);
  assert.equal(m.independentDepth,false);assert.ok(school.length>0);assert.equal(middle.length,school.length,title);
  middle.forEach((b,i)=>{assert.equal(b.title,school[i].stage+' '+title);assert.equal(b.start,school[i].start);assert.equal(b.end,school[i].end);});
  assert.match(m.assumptions.join(' '),/교과와 같은 학기를 함께/);
 }
});

test('모르는 공부는 채우지 않는다: 심화 시작 전·확인 전, 중등·고등 심화를 이미 하는 학생은 그대로 둔다',()=>{
 const w=fixture();
 const none=example();Object.assign(none.a,{deepCourse:'none'});
 for(const pattern of ['thinking']){const m=w.PlannerStandard.model(none.a,none.f,{pattern});assert.equal(lane(m,'deep').blocks.length,0);assert.equal(m.depthRule,null);assert.equal(m.depthRuleNote,'');assert.doesNotMatch(w.PlannerStandard.render(m,{view:'table'}),/standard-depth-rule/);}
 const unknown=example();Object.assign(unknown.a,{deepCourse:'unknown'});
 assert.equal(lane(w.PlannerStandard.model(unknown.a,unknown.f,{pattern:'deep'}),'deep').blocks.length,0);
 // 중등 심화서를 이미 보고한 학생: 보고한 교재가 그대로 이어진다.
 const reported=example();Object.assign(reported.a,{grade:'7',schoolCourse:'mid',schoolBook:'원리해설',school:'advanced',schoolExact:'16',deepCourse:'mid',deepBook:'A급',deepStage:'15'});reported.f.grade='7';
 const mid=w.PlannerStandard.model(reported.a,reported.f);assert.equal(rule(mid).length,0);assert.equal(mid.depthRule,null);assert.ok(lane(mid,'deep').blocks.some(b=>/에이급수학/.test(b.title)));
 // 고등 교과를 하는 학생의 고등 심화 일정은 바뀌지 않는다.
 const high=example();Object.assign(high.a,{grade:'9',schoolCourse:'high',schoolBook:'기본정석',schoolHigh:'공통수학1',deepStage:'6-2'});high.f.grade='9';
 const hm=w.PlannerStandard.model(high.a,high.f);assert.equal(rule(hm).length,0);assert.equal(lane(hm,'deep').blocks.find(b=>b.stage==='공통수학1').start,6);
});

test('초등 심화가 교과보다 많이 뒤에 있으면 중등 심화도 그만큼 뒤에서 이어지고, 6-2 심화를 끝낸 학생은 바로 이어진다',()=>{
 const w=fixture();
 const behind=example();Object.assign(behind.a,{grade:'6',schoolCourse:'mid',schoolBook:'개념원리',school:'advanced',schoolExact:'16',deepStage:'6-1'});behind.f.grade='6';
 const m=w.PlannerStandard.model(behind.a,behind.f),deep=lane(m,'deep').blocks,middle=rule(m);
 assert.equal(middle[0].stage,'중1-1');assert.equal(middle[0].start,deep.find(b=>b.stage==='6-2').end,'starts when the reported elementary depth ends');
 assert.ok(middle.every((b,i)=>i===0||b.start===middle[i-1].start+4),'one semester keeps the level table length');assertFollowsSchool(m);
 const done=example();Object.assign(done.a,{grade:'4',schoolCourse:'mid',schoolBook:'원리해설',school:'advanced',schoolExact:'14',deepStage:'6-2',deepStatus:'done'});done.f.grade='4';
 const d=w.PlannerStandard.model(done.a,done.f);assert.equal(lane(d,'deep').blocks[0].stage,'중1-1');assert.equal(lane(d,'deep').blocks[0].start,0);assertFollowsSchool(d);
});

test('24개월 끝에서 한 달 남짓만 보이는 마지막 칸은 줄 높이를 늘리지 않게 글자를 숨기고 이름은 남긴다',()=>{
 const w=fixture(),{a,f}=example();Object.assign(a,{deepStatus:'done'});
 const m=w.PlannerStandard.model(a,f),tail=rule(m).at(-1);
 assert.ok(tail.endClipped&&tail.end-tail.start<1.5&&tail.compact,'this example ends with a short clipped block');
 const html=w.PlannerStandard.render(m,{view:'table'}),button=html.match(new RegExp('<button[^>]*data-standard-block="'+tail.id+'"[^>]*>'))[0];
 assert.match(button,/is-sliver/);assert.match(button,new RegExp('aria-label="심화 · '+tail.title));
 assert.ok(rule(m).filter(b=>!b.compact).every(b=>!new RegExp('is-sliver[^>]*data-standard-block="'+b.id+'"').test(html)));
});
