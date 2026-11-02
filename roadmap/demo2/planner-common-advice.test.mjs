import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const w={},c=vm.createContext({window:w});
for(const f of ['planner-counselling-updates.js','planner-academy-stories.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),c);
const U=w.PlannerCounsellingUpdates,S=w.PlannerAcademyStories;
test('same shared advice reaches preschool, primary board and print-ready questions',()=>{
 const q=U.commonAdvice['soma-fields-choice'];assert.match(q.answer,/소마를 휴원하고 필즈/);assert.match(q.answer,/한 곳을 중심/);assert.equal(S.items.find(x=>x.id==='soma-fields').body,q.answer);assert.ok(U.data('preschool').items.includes(q));assert.ok(U.commonQuestions('pre').includes(q));assert.ok(U.renderCommon('pre').includes(q.answer));
});
test('summer pause is conditional on the elementary Hwangso goal and never exposed to older school stages as a live task',()=>{
 for(const grade of ['pre','1','2']){assert.ok(U.commonQuestions(grade,{hwangso:true}).some(q=>q.id==='hwangso-summer-pause'));assert.ok(!U.commonQuestions(grade,{hwangso:false}).some(q=>q.id==='hwangso-summer-pause'));}
 for(const grade of ['3','5','7','10'])assert.equal(U.commonQuestions(grade,{hwangso:true}).length,0);
 const q=U.commonAdvice['hwangso-summer-pause'];assert.match(q.answer,/초2 11월/);assert.match(q.answer,/8월/);assert.match(q.answer,/필즈와 소마 모두 휴원/);assert.match(q.answer,/필수 휴원.*아닙니다/);
});
test('March/April warning is about first-grade school entry, not every preschool March',()=>{
 const q=U.commonAdvice['school-entry-load'];assert.match(q.answer,/초등학교에 입학하는 3월부터 한두 달/);assert.match(q.answer,/부모님도 바빠지는/);assert.match(q.answer,/실제 학습량이 잠시 줄/);assert.match(q.answer,/몰아서 채우기보다/);assert.ok(U.commonQuestions('1').includes(q));assert.ok(!U.commonQuestions('2').includes(q));assert.equal(S.items.find(x=>x.id==='school-entry-load-primary').body,q.answer);
});
