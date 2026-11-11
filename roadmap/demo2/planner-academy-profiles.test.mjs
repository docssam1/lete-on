import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={},c=vm.createContext({window:w});
for(const f of ['planner-counselling-updates.js','planner-nute-guide.js','planner-fields-admission.js','planner-academy-profiles.js','planner-academy-stories.js'])vm.runInContext(read(f),c,{filename:f});
const P=w.PlannerAcademyProfiles,S=w.PlannerAcademyStories;

test('학원별 목록은 고민별 목록과 분리하며 여러 학년에서 같은 안내를 연다',()=>{
 assert.equal(P.profiles.length,26);
 assert.equal(P.profiles.filter(x=>x.subject==='국어학원').length,8);
 for(const stage of ['elementary','middle']){
  const named=S.data(stage,'academies');
  for(const id of ['academy-jini','academy-msc','academy-kiparang'])assert.ok(named.some(x=>x.id===id));
  assert.ok(S.data(stage).every(x=>!x.academyProfile));
 }
 assert.ok(S.data('preschool','academies').every(x=>!['academy-jini','academy-dolpa','academy-peai'].includes(x.id)));
 assert.match(S.render('elementary','b13','국어학원','academies'),/6개 학원/);
 assert.match(S.render('middle','b13','수학학원','academies'),/5개 학원/);
 assert.match(S.render('high','b13','국어학원','academies'),/확인된 고등 학원별 안내는 아직 없습니다/);
 assert.ok(Object.isFrozen(P.profiles[0].questions));
});
test('학원별 본문에는 수업·준비·부담·질문을 담고 관련 글로 이어진다',()=>{
 const ids=S.items.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);
 for(const x of P.profiles){
  assert.ok(x.body&&x.fit&&x.burden&&x.advice&&x.questions.length>=3,x.id);
  for(const id of x.related)assert.ok(ids.includes(id),x.id+' → '+id);
  const html=S.detail(x.id);
  for(const label of ['아이에게 맞는지','수업 밖 공부와 시간','현재 교재와 수업','함께 읽으면 좋은 글'])assert.ok(html.includes(label),x.id+' '+label);
 }
 assert.match(S.detail('academy-jini'),/지원하지 않는 학교/);
 assert.match(S.detail('academy-msc'),/요약·분석/);
 assert.match(S.detail('academy-kiparang'),/선택지/);
 assert.equal(P.render({}), '');
 const unsafe={...P.profiles[0],fit:'<script>alert(1)</script>',burden:'"<img>'};
 assert.match(P.render(unsafe),/&lt;script&gt;/);assert.ok(!P.render(unsafe).includes('<script>'));
});
test('확정된 과정별 컷은 유지하고 새 무기명 시험 점수는 배정하지 않는다',()=>{
 assert.match(S.detail('academy-won'),/50문항 중 35문항 이상/);
 assert.match(S.detail('academy-dolpa'),/30문항 중 20문항 합격/);
 assert.ok(!S.detail('academy-eden').includes('합격 기준'));
 const all=P.profiles.map(x=>S.detail(x.id)).join('');
 assert.doesNotMatch(all,/20문항.{0,10}14|합산.{0,5}30|대기.{0,5}천|한빛글방/);
 assert.match(S.detail('academy-peai'),/초2 5월 CARS E는 우리 로드맵의 상위권 예시/);
 assert.match(S.detail('academy-soma'),/초급 6권 → 중급 8권 → 고급 10권/);
});
test('새 학원 자료는 회원 확인 뒤 불러오며 공개 소개에는 사례 원문을 추가하지 않는다',()=>{
 const html=read('planner.html'),name='planner-academy-profiles.js';
 assert.match(html,/data-member-src="planner-academy-profiles\.js/);
 assert.doesNotMatch(html,/<script\s+src="planner-academy-profiles\.js/);
 assert.ok(html.indexOf(name)<html.indexOf('data-member-src="planner-academy-stories.js'));
 const account=read('account.html');
 assert.ok(!account.includes(name));assert.equal((account.match(/class="account-senior-example"/g)||[]).length,1);
 for(const label of ['천개의고원·기파랑·지니·MSC','planner.html?academy=schools','초등 6-1 과정','계정에 저장','학교마다 시험일과 준비 기간이 다르므로'])assert.ok(account.includes(label),label);
 for(const f of ['account.html','planner-academy-profiles.js'])assert.doesNotMatch(read(f),/KakaoTalk_|닉네임|오후 6:14|최현수|송윤하/);
});


test('천개의고원은 국어로 분류하고 공식 과정·개인 경험·미확인 접수를 구분한다',()=>{
 const x=P.profiles.find(x=>x.id==='academy-thousand');assert.equal(x.subject,'국어학원');
 for(const stage of ['elementary','middle'])assert.ok(S.data(stage,'academies').some(x=>x.id==='academy-thousand'));
 const html=S.detail(x.id);
 for(const t of ['초4·5·6 독서탐구반','공식 안내에서 확인한 내용','학부모 경험 · 제공 대화 요약','원고지','약 4~5주','모든 지점·반의 공통 규정','대기 신청일·방법','성적 향상 보장이 아닙니다'])assert.ok(html.includes(t),t);
 assert.ok(!html.includes('1월 1일'));assert.match(html,/https:\/\/nonsul4us\.com/);
 assert.ok(Object.isFrozen(x.experience.items));assert.ok(Object.isFrozen(x.verified.links));
 assert.match(S.detail('korean-academy-choice'),/정해진 학원 이동 순서가 있는 것은 아닙니다/);
 const unsafe={...x,experience:{label:'<script>',items:[{title:'<img>',text:'<script>'}],note:'<iframe>'}};assert.ok(!P.render(unsafe).includes('<script>'));
});

test('개념상상 SM관·와이즈만은 공식 출처와 확인일을 남기고 미확인 사실을 규정처럼 쓰지 않는다',()=>{
 vm.runInContext(read('planner-academy-directory.js'),c,{filename:'planner-academy-directory.js'});
 const D=w.PlannerAcademyDirectory,sm=P.profiles.find(x=>x.id==='academy-gnss-sm'),wm=P.profiles.find(x=>x.id==='academy-wiseman');
 assert.deepEqual([...sm.stages],['elementary','middle']);assert.deepEqual([...wm.stages],['elementary']);
 for(const x of [sm,wm]){
  assert.equal(x.subject,'수학학원');assert.equal(x.verified.checkedOn,'2026-11-11');assert.ok(x.questions.length>=3);
  for(const l of x.verified.links)assert.match(l.url,/^https:\/\/(gnss\.co\.kr|blog\.naver\.com\/gnsssmedu|www\.askwhy\.co\.kr)(\/|$)/,l.url);
  assert.ok(Object.isFrozen(x.verified.links));
  const html=S.detail(x.id);
  for(const t of ['공식 안내에서 확인한 내용','확인일 2026-11-11','공식 홈페이지·공식 블로그에서 확인한 안내','현재 교재와 수업'])assert.ok(html.includes(t),x.id+' '+t);
  assert.ok(!html.includes('이전 설명회·안내와 상담에서'),x.id);
  assert.doesNotMatch(html,/\d[\d,]*\s*원|만\s*원|합격자|\d+\s*명|1위|전교|최상위권|보장합니다/,x.id);
  assert.equal(D.logo(x.id,x.title),'');assert.ok(!D.get(x.id).logo);assert.equal(D.get(x.id).checkedOn,'2026-11-11');
 }
 assert.ok(S.data('elementary','academies').some(x=>x.id==='academy-gnss-sm'));assert.ok(S.data('middle','academies').some(x=>x.id==='academy-gnss-sm'));
 assert.ok(S.data('elementary','academies').some(x=>x.id==='academy-wiseman'));
 for(const stage of ['preschool','middle','high'])assert.ok(!S.data(stage,'academies').some(x=>x.id==='academy-wiseman'),stage);
 for(const stage of ['preschool','high'])assert.ok(!S.data(stage,'academies').some(x=>x.id==='academy-gnss-sm'),stage);
 const smHtml=S.detail(sm.id),wmHtml=S.detail(wm.id);
 for(const t of ['대치관을 고등·중3, SM관을 초등·중등','2024년 11월 게시물','도곡로 511','과제량은 안내에 없으므로','수강료는 확인하지 않았습니다','https://gnss.co.kr/feature/branches','https://blog.naver.com/gnsssmedu'])assert.ok(smHtml.includes(t),t);
 for(const t of ['전국 공통 안내','대치센터에서 실제로 여는 반과 학년은 센터에 확인','대치동 994-1','본사 공식 홈페이지','본사 공식 블로그','확인하지 못했습니다','한 센터나 한 아이의 결과로 읽지는 않습니다'])assert.ok(wmHtml.includes(t),t);
 assert.match(D.render('academy-gnss-sm','개념상상 SM관'),/공식 홈페이지 ↗.*공식 블로그 ↗/);
 assert.ok(!D.render('academy-soma','소마').includes('본사'));
 assert.match(S.detail('academy-soma'),/이전 설명회·안내와 상담에서/);
});
