import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={},c=vm.createContext({window:w});
for(const f of ['planner-counselling-updates.js','planner-nute-guide.js','planner-fields-admission.js','planner-academy-profiles.js','planner-academy-stories.js'])vm.runInContext(read(f),c,{filename:f});
const F=w.PlannerFieldsAdmission,S=w.PlannerAcademyStories;
test('2027 예비7세 대치센터 절차는 테스트가 아닌 접수·설문·상담이다',()=>{
 assert.equal(F.info.birthYear,2021);assert.equal(F.info.applicationEnd,'2026-12-11');assert.equal(F.info.classStart,'2027-01-04');
 const html=S.detail('fields-2027-entry');
 for(const x of ['별도 입학 테스트는 없습니다','문자로 받은 설문','2026.12.14부터','2027.1.4','약 한 달','반을 조정','공식 안내문 3쪽','대치센터'])assert.ok(html.includes(x),x);
 assert.doesNotMatch(html,/E1.{0,10}선발|80점|65점|25문제|모의시험/);
 assert.ok(S.data('preschool').some(x=>x.id==='fields-2027-entry'));
 assert.ok(!S.data('elementary').some(x=>x.id==='fields-2027-entry'));
 assert.ok(S.detail('academy-fields').includes('data-ast-post="fields-2027-entry"'));
 assert.ok(Object.isFrozen(F.info));
});
test('접수 종료 후에도 접수 중인 것처럼 표시하지 않는다',()=>{
 assert.equal(F.status('2026-11-01'),'접수 전');assert.equal(F.status('2026-11-02'),'접수 기간');
 assert.equal(F.status('2026-12-11'),'접수 기간');assert.match(F.status('2026-12-12'),/접수 마감/);
 assert.match(F.status('2026-12-14'),/상담 후 반 확정/);assert.match(F.status('2027-01-04'),/모집 종료/);
});
test('공식 주1·2회와 독쌤의 더 높은 준비 목표를 섞어 입학 조건으로 만들지 않는다',()=>{
 const official=F.render('entry'),coaching=F.render('readiness');
 for(const x of ['주1회 · 회당 2시간','주2회 · 회당 2시간','더클셈 1~4권','받아올림·받아내림','구구단·곱셈은 선택','서열이나 반을 정하는 주된 평가가 아닙니다'])assert.ok(official.includes(x),x);
 for(const x of ['기적의 계산법 3·4권','초등 2-1','초등 팩토 1·pre1031','1031 입문 B','1031 초급','E1 참고 기준','모든 주2회반의 공식 입학 조건으로 묶지 않고'])assert.ok(coaching.includes(x),x);
 assert.ok(!official.includes('기적의 계산법 5권'));assert.ok(!coaching.includes('8회 모의'));
 assert.ok(w.PlannerCounsellingUpdates.commonAdvice['soma-fields-choice'].answer.includes('부교재를 혼자 풀 수준과 연산부터'));
 const html=read('planner.html');assert.match(html,/data-member-src="planner-fields-admission\.js/);
 assert.ok(html.indexOf('data-member-src="planner-fields-admission.js')<html.indexOf('data-member-src="planner-academy-profiles.js'));
 assert.equal(F.render('unknown'),'');
});
