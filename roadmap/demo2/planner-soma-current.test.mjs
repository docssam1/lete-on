import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const w={},context=vm.createContext({window:w});
const read=file=>readFileSync(new URL(file,import.meta.url),'utf8');
for(const file of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-soma-current.js','planner-academy-data.js','planner-transition.js','planner-academy-stories.js'])vm.runInContext(read(file),context,{filename:file});
const C=w.PLANNER_SOMA_CURRENT,S=w.PlannerAcademyStories,T=w.PlannerTransition;
const plain=value=>JSON.parse(JSON.stringify(value));
test('현재 5세 운영표이며 A3-3은 교재 진도이고 레벨·반 선택을 만들지 않는다',()=>{
 assert.equal(C.observation.weeks,2);assert.equal(C.observation.book,'Ray Kids A1-2');
 assert.equal(C.currentTextbook,'Ray A3-3');assert.equal(C.levelGrouping,false);
 assert.equal(C.observation.next,undefined);assert.equal(C.confirmedEntry,undefined);
 const html=S.detail('ray-observation');
 for(const text of ['작년과 비슷','A1-2','별도 레벨 구분 없음','Ray A3-3 교재','2026년 현재 5세 소마 월별 로드맵'])assert.ok(html.includes(text),text);
 assert.doesNotMatch(html,/data-ast-ray|A[123]-3반|A1-3|A2-3|상위반|RAY B1-2/u);
 assert.equal(S.raySchedule().confirmed,true);assert.equal(S.raySchedule().cohort,'현재 5세');
 assert.equal(S.raySchedule().branch,undefined);assert.equal(S.rayPaths,undefined);
 assert.equal(S.raySchedule().tracks.length,4);
});
test('사진의 사고력·부교재·연산·도형 월 경계를 추정 없이 보존한다',()=>{
 assert.equal(C.start,10);assert.equal(C.end,32);assert.equal(S.raySchedule().months,22);
 const ranges=C.tracks.map(t=>t.blocks.map(b=>[b.label,b.start,b.end]));
 assert.deepEqual(plain(ranges[0]),[['Ray Kids A단계',10,14],['Ray B단계',14,22],['Premier 라이즈',22,32]]);
 assert.deepEqual(plain(ranges[1]),[['키즈 팩토 기본 (A·B·C)',15,20],['초등 팩토 LV.1 기본+응용 (A·B·C)',20,29],['디딤돌 2-1',29,32]]);
 assert.deepEqual(plain(ranges[2]).map(r=>r[0]),['소마셈 P1~P4','소마셈 P5~P8','소마셈 A1~A4','소마셈 A5~A8','소마셈 B5~B8','소마연산 3학년']);
 assert.deepEqual(plain(ranges[3]),[['소마도형 P단계',10,27],['소마도형 A단계',27,32]]);
 assert.match(C.tracks[0].blocks.at(-1).note,/완료한다는 뜻은 아닙니다/u);
 for(const track of C.tracks){for(let i=1;i<track.blocks.length;i++)assert.equal(track.blocks[i-1].end,track.blocks[i].start);assert.ok(Object.isFrozen(track.blocks));}
});
test('현재 5세 표는 월별 비교에 독립된 네 축으로 나오며 이전 코호트를 변경하지 않는다',()=>{
 const legacy=w.PLANNER_ACADEMY_ROADMAPS.courses.find(c=>c.id==='soma');
 const before=JSON.stringify(legacy),plans=T.academyMonthPlan(legacy,{now:10});
 const current=plans[0];assert.equal(current.id,C.source.caseId);assert.equal(current.rows.length,4);
 assert.equal(current.months[0].year,2026);assert.equal(current.months[0].month,11);assert.equal(current.months[0].grade,'5세');
 assert.equal(current.months.at(-1).year,2028);assert.equal(current.months.at(-1).month,8);
 assert.equal(current.rows[1].cells[0].kind,'empty');assert.equal(current.rows[1].cells[0].span,5);
 for(const row of current.rows)assert.equal(row.cells.reduce((sum,c)=>sum+c.span,0),22);
 assert.equal(JSON.stringify(legacy),before);assert.ok(plans.some(p=>p.id==='main'));
 const html=read('planner.html');assert.ok(html.indexOf('planner-soma-current.js')<html.indexOf('planner-academy-data.js'));
 assert.match(T.renderAcademyMonthCourse(legacy,{now:10}),/2026년 현재 5세 소마/u);
});
