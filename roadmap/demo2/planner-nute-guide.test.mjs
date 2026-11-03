import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={};
w.PlannerCourseGuide={detail:()=>({sections:[{books:'참고 교재',other:'',advice:''}]})};
const c=vm.createContext({window:w});
for(const f of ['planner-nute-guide.js','planner-academy-stories.js','planner-pathways.js'])vm.runInContext(read(f),c,{filename:f});
const N=w.PlannerNuteGuide,S=w.PlannerAcademyStories,X=w.PlannerPathways;

test('컷라인은 학원·과정에 귀속하고 불합격 사례를 합격컷으로 바꾸지 않는다',()=>{
 const [d,won,eden]=N.academies;
 assert.equal(d.courses.find(x=>x.name==='공통수학2 기본 시작반').cutoff.pass,20);
 assert.equal(d.courses.find(x=>x.name==='공통수학1 기본 시작반').cutoff,undefined);
 assert.ok(eden.courses.every(x=>!x.cutoff));
 const cut=won.courses[0].cutoff;
 assert.equal(cut.pass,35);assert.equal(cut.total,50);assert.equal(cut.review,32);
 assert.deepEqual(Array.from(cut.sections,x=>x.minimum),[17,15]);
 assert.match(cut.note,/합격컷과 같은 뜻은 아닙니다/);
 assert.match(N.render(),/해마다 바꾸어 잡지 않습니다/);
 assert.ok(Object.isFrozen(cut.sections));
});

test('초등·중등 글에서 같은 과정별 안내를 읽되 유아 목록에는 넣지 않는다',()=>{
 for(const [stage,id] of [['elementary','cumulative-primary'],['middle','cumulative-middle']]){
  assert.ok(S.data(stage).some(x=>x.id===id));
  const html=S.detail(id);
  for(const label of ['돌파수학','원수학','이든수학','중1 시작반','공통수학1 기본','누테학원 준비와 선택','황소 고등 선발'])assert.ok(html.includes(label),label);
 }
 assert.ok(S.data('preschool').every(x=>!/^cumulative-/.test(x.id)));
 assert.ok(!S.render('preschool').includes('누테학원 준비와 선택'));
});

test('고등과정 진입을 학교 학년으로 차단하지 않고 기존 경로·학습 일정은 유지한다',()=>{
 const saved=['academy','nute'],before=JSON.stringify(saved);
 assert.equal(X.detail('nute',{grade:4}).academyStory,'cumulative-primary');
 assert.equal(X.detail('nute',{grade:8}).academyStory,'cumulative-middle');
 assert.equal(X.detail('middle',{grade:8}).academyStory,null);
 assert.equal(JSON.stringify(saved),before);
 assert.match(N.render(),/고등학생만 보는 시험이나 공통수학을 끝내고 보는 시험으로 해석하지 않습니다/);
});

test('메인 회원 검증 뒤 안내가 로드되고 갈림길에 같은 글을 여는 버튼이 연결된다',()=>{
 const html=read('planner.html'),guide=html.indexOf('data-member-src="planner-nute-guide.js'),stories=html.indexOf('data-member-src="planner-academy-stories.js');
 assert.ok(guide>0&&guide<stories);
 assert.match(read('planner-ui.js'),/data-academy-story-open="\$\{esc\(c.academyStory\)\}"/);
 assert.match(read('planner-academy-stories.js'),/get\('academy'\)/);
});
