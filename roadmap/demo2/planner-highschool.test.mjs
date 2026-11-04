import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const w={},c=vm.createContext({window:w,console,URL,Intl});
for(const f of ['planner-highschool-data.js','planner-highschool-profiles.js','planner-highschool.js','planner-school-goals.js','planner-science.js','planner-college-data.js','planner-admissions-evidence.js','planner-college.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),c,{filename:f});
const A=w.PlannerHighschool,D=w.PlannerHighschoolData,Q=w.PlannerSchoolGoals,S=w.PlannerScience,plain=x=>JSON.parse(JSON.stringify(x));
test('all six school paths have complete official guide fields and valid fixed dates',()=>{
 assert.equal(new Set(D.schools.map(s=>s.goal)).size,6);
 for(const s of D.schools){assert.ok(D.sources[s.source].url.startsWith('https://'));assert.equal(s.year,2027);for(const[f]of A.FIELDS)assert.ok(s[f]?.length>15,s.id+' '+f);for(const e of s.events){assert.match(e.start,/^202[67]-\d\d-\d\d$/);assert.equal(new Date(e.start).toISOString().slice(0,10),e.start);assert.ok(e.start<=e.end);}}
});
test('foreign and international goals survive selection, middle school institute policy and college preparation scope',()=>{
 for(const id of ['foreignHigh','internationalHigh']){assert.equal(Q.normalize(id),id);assert.equal(S.choose(null,'schoolGoal',id).schoolGoal,id);assert.equal(S.restore({version:1,schoolGoal:id}).schoolGoal,id);assert.equal(Q.institutePolicy(id,8).allowed,false);assert.equal(Q.checkpoints(id,{grade:8,year:2026,mon:11}).length,3);const d=Q.GOALS[id];for(const k of ['english','korean','reading','interview'])assert.ok(d[k]);const p=w.PlannerCollege.preparationPlan(null,{schoolGoal:id});assert.equal(p.goal,id);assert.ok(p.goalNote);assert.ok(Q.questions(id,{grade:8}).some(q=>q.question.includes('원서')));}
});
test('guide dates never shift to future entry years and no invented exact date for an unspecified December result',()=>{
 const base={year:2027,schools:['sshs','dwfl']},events=A.calendar(base,{today:'2026-11-02'});assert.ok(events.some(e=>e.start==='2026-12-03'));assert.equal(A.calendar({...base,year:2028},{today:'2026-11-02'}).length,0);assert.ok(A.render({...base,year:2037,tab:'calendar'}).includes('2037학년도 일정'));assert.equal(A.calendar(base).some(e=>e.school==='sshs'&&e.start.startsWith('2026-12')),false);assert.equal(D.schools.find(s=>s.id==='sshs').undated[0].when,'2026년 12월 초');
});
test('different online and physical deadlines and school schedules are retained',()=>{
 const dw=D.schools.find(s=>s.id==='dwfl'),apply=dw.events.find(e=>e.id==='apply'),docs=dw.events.find(e=>e.id==='docs');assert.match(apply.time,/13:00/);assert.match(docs.time,/15:00/);assert.equal(D.schools.find(s=>s.id==='incheon').events.find(e=>e.id==='apply').start,'2026-12-07');assert.equal(D.schools.find(s=>s.id==='hansung').events.find(e=>e.id==='stage2-result').start,'2026-11-06');
});
test('school shortlist and checks are isolated by year, capped, validated and do not modify curriculum sources',()=>{
 const source=JSON.stringify(D),base=A.restore({year:2027,schools:['dwfl','incheon','hafs','sshs','bad'],checks:{'2027|dwfl|eligibility':true,'2027|bad|grades':true,'2027|dwfl|script':true,'2028|dwfl|grades':true}});assert.equal(base.schools.length,3);assert.equal(Object.keys(base.checks).length,2);const checked=A.choose(base,'check','dwfl|grades');assert.equal(checked.checks['2027|dwfl|grades'],true);const future=A.choose(checked,'year',2028);assert.equal(future.checks['2028|dwfl|eligibility'],undefined);assert.equal(A.choose({schools:['dwfl']},'school','dwfl').schools.length,1);assert.equal(JSON.stringify(D),source);assert.equal(base.checks['2027|dwfl|grades'],undefined);
});
test('children see study foundations and future year, not a forced application schedule',()=>{
 const c={grade:'pre',age:6,year:2026,schoolGoal:'foreignHigh'},m=A.model(null,c);assert.equal(m.early,true);assert.equal(m.state.year,2037);assert.equal(m.events.length,0);assert.match(A.render(null,c),/부모님 참고/);assert.match(Q.checkpoints('foreignHigh',c)[2].action,/고교 지원을 준비하기보다/);assert.equal(A.suggestedYear({grade:9,year:2026}),2027);
});
test('dates distinguish completed, current and future calendar days without moving them',()=>{
 assert.equal(A.phase({start:'2026-09-02',end:'2026-10-30'},'2026-11-02'),'past');assert.equal(A.phase({start:'2026-11-02',end:'2026-11-04'},'2026-11-02'),'active');assert.equal(A.phase({start:'2026-11-06',end:'2026-11-06'},'2026-11-02'),'upcoming');
});
test('expanded guides keep school-specific deadlines and freshness checks without shifting year',()=>{
 assert.equal(D.schools.length,11);for(const id of ['gs','sangsan','hana','dongtan'])assert.equal(D.schools.find(s=>s.id===id).checked,'2026-11-03');
 const gs=D.schools.find(s=>s.id==='gs'),ss=D.schools.find(s=>s.id==='sangsan');assert.equal(gs.goal,'giftedSchool');assert.equal(gs.events.find(e=>e.id==='record').start,'2026-11-16');assert.match(ss.events.find(e=>e.id==='apply').time,/13:00/);assert.match(ss.events.find(e=>e.id==='mail').time,/16:00/);
 assert.equal(A.freshness(gs,'2026-11-03').due,false);assert.equal(A.freshness(gs,'2026-11-10').due,true);assert.equal(A.freshness(gs,'2026-12-20').due,true);assert.equal(A.calendar({year:2028,schools:['gs','sangsan','hana','dongtan']}).length,0);
});
test('private school candidates include the three requested schools together and preserve saved selection',()=>{
 const chosen=['hafs','minjok','sangsan'],state=A.restore({year:2027,schools:chosen,tab:'profile'});
 assert.deepEqual(plain(state.schools),chosen);assert.equal(state.tab,'profile');
 const html=A.render(state),group=html.slice(html.indexOf('<legend>자사고</legend>'),html.indexOf('</fieldset>',html.indexOf('<legend>자사고</legend>')));
 for(const id of chosen)assert.ok(group.includes('data-ha-school="'+id+'" aria-pressed="true"'));
 assert.match(html,/민사고/);assert.match(html,/국내대학 등록 인원/);
 const next=A.choose(state,'tab','papers');assert.deepEqual(plain(next.schools),chosen);assert.equal(A.restore(next).tab,'papers');
 assert.deepEqual(plain(A.choose(next,'school','hana').schools),chosen);
});
test('Minjok postmark deadline is distinct from receipt deadlines and future dates stay unpublished',()=>{
 const s=D.schools.find(s=>s.id==='minjok');assert.match(s.events.find(e=>e.id==='apply').time,/12:00/);assert.match(s.events.find(e=>e.id==='mail').time,/소인/);assert.match(s.documents,/도착일이 아닌/);
 assert.equal(s.events.find(e=>e.id==='register').start,'2027-01-04');assert.match(s.grades,/20·20·30·30/);assert.match(s.grades,/체육/);
 assert.equal(A.calendar({year:2028,schools:['minjok']}).length,0);
});
test('school profiles retain outcome cohorts and distinguish real papers from interview guidance and authored prompts',()=>{
 const P=w.PlannerHighschoolProfiles,source=JSON.stringify(D),gs=P.profiles.gs,min=P.profiles.minjok;
 for(const s of D.schools){const p=P.profiles[s.id];assert.ok(p);assert.ok(p.character.length);assert.ok(p.action);for(const o of p.outcomes){assert.ok(o.year);assert.ok(o.kind);assert.ok(o.note);assert.ok(o.source.url.startsWith('https://'));for(const[,n]of o.metrics)assert.ok(Number.isInteger(n)&&n>=0);}}
 assert.deepEqual(plain(gs.outcomes.map(o=>o.year)),['2023 졸업반','2024 졸업반','2025 졸업반']);assert.equal(gs.outcomes[2].metrics.find(([k])=>k==='서울대')[1],69);
 assert.match(min.outcomes[0].kind,/등록/);assert.equal(min.outcomes[0].metrics.find(([k])=>k==='국내 등록 합계')[1],95);
 const papers=A.render({year:2027,schools:['sshs','gs','minjok'],tab:'papers'});
 for(const t of ['2단계','공식 기출','2026학년도','실제 기출 아님','실제 면접 문항 원문은 확보하지 못했'])assert.ok(papers.includes(t),t);
 assert.match(papers,/https:\/\/admission-sshs.info\/24/);assert.match(papers,/nttSn=541400/);assert.equal(JSON.stringify(D),source);
 const profile=A.render({schools:['gs'],tab:'profile'});assert.match(profile,/2025 졸업반/);assert.match(profile,/진학률을 계산하지/);
});
