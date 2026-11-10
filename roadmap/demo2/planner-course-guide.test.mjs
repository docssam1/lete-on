import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};
vm.runInNewContext(readFileSync(new URL('planner-course-guide.js',import.meta.url),'utf8'),ctx);
const api=ctx.window.PlannerCourseGuide;
const section=(key,audience='general')=>api.detail({kind:'course',guideKey:key,title:'과정',sub:'내용'},{audience}).sections[0];
const keys=['elem','elemDeep','middle','high','thinking','calc','science','kmoFoundation','intro','basic','kmoDeep','second','kmo'];
test('each supported learning course has an adjustable daily example and mastery checks',()=>{
 for(const key of keys){
  const g=section(key);
  assert.match(g.dailyExample,/문항/);assert.match(g.dailyExample,/분/);
  assert.match(g.dailyExample,/조정 가능한 예시/);assert.match(g.dailyExample,/병행 과정의 시간을 모두 더하지/);
  assert.match(g.selfCheck,/80%/);assert.match(g.selfCheck,/해설 없이/);assert.match(g.selfCheck,/풀이 이유를 스스로 설명/);
  assert.match(g.selfCheck,/절대 합격선이나 자동 승급 기준이 아닙니다/);
  assert.match(g.selfCheck,/진도 완료가 곧 숙달을 뜻하지/);
  assert.match(g.vacationTip,/1~2월·7~8월/);assert.match(g.vacationTip,/실제 학교 방학 일정/);assert.match(g.vacationTip,/일괄 2배속으로 늘리지/);
 }
});
test('amounts differ by course and younger children get shorter starting examples',()=>{
 assert.notEqual(section('elem').dailyExample,section('elemDeep').dailyExample);
 assert.notEqual(section('calc').dailyExample,section('high').dailyExample);
 for(const key of ['elem','calc','thinking']){
  assert.match(section(key,'preschool').dailyExample,/유아·초등 저학년/);
  assert.match(section(key,'lower').dailyExample,/유아·초등 저학년/);
  assert.notEqual(section(key,'lower').dailyExample,section(key,'upper').dailyExample);
 }
});
test('contest check does not equate representative mastery with contest scores',()=>{
 for(const key of ['kmo','kmoFoundation','intro','basic','kmoDeep','second'])assert.match(section(key).selfCheck,/수상·선발 기준에 그대로 적용하지/);
 for(const key of ['unknown','choice'])assert.equal(section(key).dailyExample,undefined);
});
test('guidance is display-only and does not alter saved profile or schedule',()=>{
 const node={kind:'course',guideKey:'middle',title:'중등',sub:'교과'};
 const plan={audience:'upper',now:4,sourceProfile:{rows:[]},rows:[]};
 const before=JSON.stringify({node,plan});api.detail(node,plan);
 assert.equal(JSON.stringify({node,plan}),before);
});
test('actual course dialog renders daily guide even without a sequence',()=>{
 const ui=readFileSync(new URL('planner-ui.js',import.meta.url),'utf8');
 const source=ui.slice(ui.indexOf('function coursePractice(s){'),ui.indexOf('function openCourse(node){'));
 const context={esc:x=>String(x??''),result:''};vm.createContext(context);vm.runInContext(source,context);
 for(const key of keys){context.s=section(key);vm.runInContext('result=coursePractice(s)',context);assert.match(context.result,/집에서 하루 공부 예시/);assert.match(context.result,/학부모 자가진단/);assert.match(context.result,/방학 활용/);assert.match(context.result,/80% 이상/);}
});
