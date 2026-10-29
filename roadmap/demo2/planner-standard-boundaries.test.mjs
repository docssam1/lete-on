import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
function fixture(){const window={},c=vm.createContext({window});for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard-data.js','planner-standard.js'])vm.runInContext(read(f),c,{filename:f});return window;}
const base=()=>({a:{grade:'5',gradeInput:'current',thinkingExperience:'none',schoolCourse:'elem',schoolBook:'디딤돌 응용',school:'5-2',schoolStatus:'progress',deepCourse:'none',calc:'기적의 계산법 6권',calcStatus:'progress'},f:{grade:'5',year:'2026',mon:'10',band:'B',speed:'2'}});
const row=(m,id)=>m.lanes.find(l=>l.id===id);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('the optional pre-middle month stays visible without assigning a one-month algebra course or moving middle entry',()=>{
 const w=fixture(),{a,f}=base();Object.assign(a,{grade:'2',thinkingExperience:'yes',thinking:'1031 초급',thinkingStatus:'progress',deepCourse:'elem',deepBook:'최상위 S',deepStage:'4-1',deepStatus:'progress'});f.grade='2';
 const before=JSON.stringify(w.PLANNER_LEVELS),m=w.PlannerStandard.model(a,f),school=row(m,'school').blocks;
 const end=school.find(b=>b.stage==='6-2'),review=school.find(b=>b.phase==='transition-review'),middle=school.find(b=>b.stage==='중1-1');
 assert.ok(end&&review&&middle);near(end.end,8.5);near(review.start,8.5);near(review.end,9.5);near(middle.start,9.5);
 assert.equal(review.instruction,false);assert.equal(review.stage,null);assert.match(review.method,/한 달에 끝내는 계획은 아닙니다/);
 assert.match(review.method,/별도로 선택/);
 for(const view of ['map','table'])assert.ok(w.PlannerStandard.render(m,{view}).includes(review.title));
 assert.equal(JSON.stringify(w.PLANNER_LEVELS),before,'source curriculum and all later source dates stay untouched');
});

test('exhausted middle-school reference data is labelled unplanned rather than silently extended to high school',()=>{
 const w=fixture(),{a,f}=base();Object.assign(a,{grade:'7',schoolCourse:'mid',schoolBook:'개념원리',schoolExact:'16',schoolStatus:'progress',thinkingExperience:'none'});f.grade='7';
 const m=w.PlannerStandard.model(a,f),school=row(m,'school');assert.equal(m.ready,true);
 assert.equal(school.blocks.at(-1).stage,'중3-2');near(school.blocks.at(-1).end,14);
 assert.ok(!school.blocks.some(b=>/^공통수학/.test(b.stage||'')));
 assert.match(school.note,/2027년 11월까지/);assert.match(school.note,/이후 교재와 기간은 맞춤 조정에서 선택/);
 for(const view of ['map','table'])assert.match(w.PlannerStandard.render(m,{view}),/이후 교재·기간 선택 전/);
});
