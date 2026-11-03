import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={},c=vm.createContext({window:w});
for(const f of ['planner-counselling-updates.js','planner-nute-guide.js','planner-academy-profiles.js','planner-academy-stories.js'])vm.runInContext(read(f),c,{filename:f});
const P=w.PlannerAcademyProfiles,S=w.PlannerAcademyStories;

test('학원별 목록은 고민별 목록과 분리하며 여러 학년에서 같은 안내를 연다',()=>{
 assert.equal(P.profiles.length,24);
 assert.equal(P.profiles.filter(x=>x.subject==='국어학원').length,8);
 for(const stage of ['elementary','middle']){
  const named=S.data(stage,'academies');
  for(const id of ['academy-jini','academy-msc','academy-kiparang'])assert.ok(named.some(x=>x.id===id));
  assert.ok(S.data(stage).every(x=>!x.academyProfile));
 }
 assert.ok(S.data('preschool','academies').every(x=>!['academy-jini','academy-dolpa','academy-peai'].includes(x.id)));
 assert.match(S.render('elementary','b13','국어학원','academies'),/6개 학원/);
 assert.match(S.render('middle','b13','수학학원','academies'),/4개 학원/);
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
 for(const label of ['지니·MSC·기파랑','planner.html?academy=schools','초등 6-1 과정','계정에 저장','학교마다 시험일과 준비 기간이 다르므로'])assert.ok(account.includes(label),label);
 for(const f of ['account.html','planner-academy-profiles.js'])assert.doesNotMatch(read(f),/KakaoTalk_|닉네임|오후 6:14|최현수|송윤하/);
});
