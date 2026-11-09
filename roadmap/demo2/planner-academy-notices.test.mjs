import {readFileSync} from 'node:fs';import vm from 'node:vm';import test from 'node:test';import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8'),w={},c=vm.createContext({window:w,URL});
for(const f of ['planner-academy-notices.js','planner-academy-stories.js'])vm.runInContext(read(f),c,{filename:f});
const N=w.PlannerAcademyNotices,feed=JSON.parse(read('data/academy-notices.json'));N.ingest(feed);
test('24개 학원과 공식 공지·확인일을 읽고 모드·과목·학원·종류로 고른다',()=>{
 assert.equal(feed.academies.length,24);assert.ok(N.select('elementary').items.length>0);
 const won=N.select('elementary','수학학원',{academy:'won',kind:'test',when:'all'}).items;assert.ok(won.length>0);assert.ok(won.every(x=>x.academy==='won'&&x.kind==='test'));
 const pre=N.select('preschool','전체',{when:'all'}).items;assert.ok(pre.every(x=>x.kind!=='test'));
 assert.match(w.PlannerAcademyStories.render('elementary','b13','전체','notices'),/data-notice-filter="academy"/);
 const html=w.PlannerAcademyStories.detail('notice-fields-2027-admission');assert.match(html,/2027.01.04/);assert.match(html,/공식 공지 원문/);
});
test('게시일·제목의 모집 연도를 행사일로 추정하지 않는다',()=>{
 const x={...N.find('notice-fields-2027-admission'),events:[],registration:null,dateStatus:'unconfirmed'};
 assert.equal(N.status(x,'2026-11-03').code,'unknown');assert.match(N.detail(x),/게시일을 시험일이나 설명회 날짜로 바꾸어/);
 assert.equal(N.status({...x,title:'2027 신규모집 설명회',publishedAt:'2026-10-01'}).code,'unknown');
});
test('서울 시간 접수 경계와 지난 일정·원문 변경을 구분한다',()=>{
 const original=N.find('notice-reviewed-224443076138');assert.ok(original);
 // Test date boundaries independently of the live feed's later source-review status.
 const x={...original,sourceState:'unchanged'};
 assert.equal(N.status(x,'2026-11-04',Date.parse('2026-11-04T22:59:59+09:00')).label,'접수 예정');
 assert.equal(N.status(x,'2026-11-04',Date.parse('2026-11-04T23:00:00+09:00')).label,'접수 기간');
 assert.equal(N.status(x,'2026-11-07',Date.parse('2026-11-07T00:00:00+09:00')).code,'closed');
 assert.equal(N.status(x,'2026-12-05',Date.parse('2026-12-05T01:00:00+09:00')).code,'past');
 assert.equal(N.status({...x,sourceState:'changed'},'2026-11-04').code,'review');
 const history=N.select('elementary','국어학원',{when:'past'},'2026-11-03').items;
 assert.ok(history.some(x=>x.id==='kiparang-2027-220'));assert.ok(!N.select('elementary','국어학원',{when:'upcoming'},'2026-11-03').items.some(x=>x.id==='kiparang-2027-220'));
});
test('외부 피드의 실행 링크·선택자 삽입은 버리고 본문을 이스케이프한다',()=>{
 const bad=structuredClone(feed),base=bad.items[0];
 bad.items.push({...base,id:'bad-url',url:'javascript:alert(1)'},{...base,id:'bad\"]x',title:'bad'},{...base,id:'escaped',title:'<img src=x onerror=alert(1)>'});
 const clean=N.validate(bad);assert.ok(!clean.items.some(x=>x.id==='bad-url'||x.id==='bad\"]x'));
 N.ingest(bad);assert.match(N.detail(N.find('notice-escaped')),/&lt;img/);assert.ok(!N.detail(N.find('notice-escaped')).includes('<img'));
 N.ingest(feed);assert.throws(()=>N.validate({...feed,schemaVersion:9}));
});
test('회원 확인 후 게시판을 로드하며 개인 계획 저장은 건드리지 않는다',()=>{
 const source=read('planner-academy-notices.js');assert.doesNotMatch(source,/localStorage|sessionStorage|RoadmapMembership/);
 assert.match(read('planner.html'),/data-member-src="planner-academy-notices\.js/);
});
