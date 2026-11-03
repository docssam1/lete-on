import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={PlannerCourseGuide:{detail:()=>({sections:[{books:'참고 교재',other:'',advice:''}]})}};
const c=vm.createContext({window:w});
for(const f of ['planner.js','demo-content.js','planner-case.js','planner-gifted-guide.js','planner-academy-stories.js','planner-pathways.js','planner-case-routes.js','planner-school-goals.js'])vm.runInContext(read(f),c,{filename:f});
const G=w.PlannerGiftedGuide,S=w.PlannerAcademyStories,X=w.PlannerPathways,C=w.PlannerCaseRoutes;
const plain=x=>JSON.parse(JSON.stringify(x));

test('영재원 글은 초등·중등의 별도 주제이며 유아에게 선발 준비를 노출하지 않는다',()=>{
 assert.equal(G.posts.length,7);
 assert.equal(new Set(G.posts.map(x=>x.id)).size,7);
 assert.equal(G.posts.filter(x=>x.stage==='elementary').length,5);
 assert.equal(G.posts.filter(x=>x.stage==='middle').length,2);
 for(const p of G.posts){assert.equal(S.category(p),'영재원');assert.match(S.detail(p.id),/기존 공부는 그대로/);}
 assert.ok(S.data('preschool').every(x=>!x.giftedGuide));
 assert.doesNotMatch(S.render('preschool'),/data-ast-filter="영재원"/);
 assert.match(S.render('elementary','b13','영재원'),/5개의 이야기/);
 assert.doesNotMatch(S.render('middle','b13','영재원'),/data-ast-post="cumulative-/);
});

test('교육청·대학부설과 지원 학년을 구분하고 점수·수료를 합격 보장으로 만들지 않는다',()=>{
 assert.match(G.render('education'),/현재 학년.*입학 후 과정 학년/);
 assert.match(S.detail('gifted-university'),/모든 대학부설 영재원이 교육청 수료를 필수로 요구하는 것은 아닙니다/);
 assert.match(G.render('university'),/정해진 순서는 아닙니다/);
 assert.match(G.render('books'),/모의고사 점수를 기관 합격컷으로 바꾸지 않습니다/);
 assert.match(G.render('middle'),/KMO 수상이나 영재원 수료를 합격 보장으로 설명하지 않습니다/);
 assert.equal(G.render('invalid'), '');
});

test('대비 교재와 정규 과학을 구분하며 선행 속도를 자동 변경하지 않는다',()=>{
 const input=w.PlannerCase.restore(null),before=plain(w.PlannerCase.model(input));
 let routes=C.select(null,'gifted',null,'center');routes=C.select(routes,'gifted','center','centerEdu');
 const guide=C.renderChoices(routes,before);
 assert.match(guide,/data-academy-story-open="gifted-education"/);
 for(const p of G.posts)G.render(p.giftedGuide);
 assert.deepEqual(plain(w.PlannerCase.model(input)),before);
 const books=G.render('books');
 for(const name of ['맛있는 영재','100제','모의고사','줄기과학','오투','하이탑','세페이드'])assert.ok(books.includes(name));
 assert.match(books,/지원 분야에 필요한 대비만 추가/);
 assert.match(G.render('overview'),/교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다/);
 assert.ok(G.timeline.every(x=>!Object.hasOwn(x,'start')&&!Object.hasOwn(x,'end')),'guidance does not invent calendar months');
});

test('중등 연결은 기존 영재학교·과학고 정책을 유지하고 기관 지원자격과 구분한다',()=>{
 assert.equal(X.detail('center',{grade:4}).giftedStory,'gifted-start');
 assert.equal(X.detail('centerEdu',{grade:4}).giftedStory,'gifted-education');
 assert.equal(X.detail('centerUni',{grade:4}).giftedStory,'gifted-university');
 assert.equal(X.detail('centerUni',{grade:8}).giftedStory,'gifted-middle');
 for(const goal of ['none','general','private'])assert.equal(w.PlannerSchoolGoals.institutePolicy(goal,8).allowed,false);
 for(const goal of ['giftedSchool','scienceHigh'])assert.equal(w.PlannerSchoolGoals.institutePolicy(goal,8).allowed,true);
 assert.match(S.detail('gifted-middle'),/실제 기관의 지원 자격을 제한한다는 뜻은 아닙니다/);
});

test('공개 글에 개인정보·내부 Drive 링크 없이 공식 공고와 교재 안내를 연결한다',()=>{
 for(const p of G.posts){const html=S.detail(p.id);assert.doesNotMatch(html,/drive.google|김주한|형조|여준|송윤하/);}
 assert.ok(G.sources.every(s=>new URL(s.url).protocol==='https:'));
 const html=read('planner.html');
 assert.ok(html.indexOf('data-member-src="planner-gifted-guide.js')<html.indexOf('data-member-src="planner-academy-stories.js'));
 assert.match(read('planner-ui.js'),/data-academy-story-open="\$\{esc\(c.giftedStory\)\}"/);
});
