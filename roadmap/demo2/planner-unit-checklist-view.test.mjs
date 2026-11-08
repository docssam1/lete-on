import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import test from 'node:test';

const context = {window: {}, URL, Intl};
for (const script of ['planner-student-visual.js', 'planner-unit-checklist-view.js']) {
  runInNewContext(readFileSync(new URL(script,import.meta.url),'utf8'), context);
}
const {markup} = context.window.PlannerUnitChecklistView;
const book = {id:'book', kind:'book', track:'curriculum', title:'기본정석', unitLabel:'나머지정리', detail:'기본 연습', studied:true, solo:false};
const mock = {id:'paper:q7', kind:'mock', title:'2026년 고1 3월 7번', detail:'학력평가', unitLabel:'나머지정리', url:'https://wdown.ebsi.co.kr/exam.pdf', solo:true};
const route = {grade:'7',gender:'girl',goalTitle:'의대 준비', nextCourse:'공통수학2',currentLabel:'현재 공부 중인 교재는 기본정석입니다.', stages:[{id:'mid',title:'중등수학'},{id:'high',title:'공통수학1',current:true},{id:'next',title:'공통수학2'}]};

test('current stage character uses child artwork and within-stage solo progress only', () => {
  const model = {weekStart:'2026-11-08',route,rows:[book,mock]};
  const html = markup(model);
  assert.match(html,/data-stage-id="high" aria-current="step"/);
  assert.equal((html.match(/aria-current="step"/g)||[]).length, 1);
  assert.match(html,/student-girl/);
  assert.match(html,/의대 준비 · 수학 교과 경로/);
  assert.match(html,/다음 과정 <strong>공통수학2/);
  assert.doesNotMatch(markup({route:{stages:[]},rows:[]}),/다음 과정/);
  assert.match(html,/data-uc-percent="50"/);
  assert.match(html,/data-uc-field="studied" data-uc-id="book"[^>]+ checked/);
  assert.doesNotMatch(html,/data-uc-field="solo" data-uc-id="book"[^>]+ checked/);
  const changed = markup({...model, rows:[{...book,solo:true},mock]});
  assert.match(changed,/data-stage-id="high" aria-current="step"/);
  assert.match(changed,/data-uc-percent="100"/);
});

test('separate remedial tasks keep the week dates and checked question numbers', () => {
  const html=markup({route,weekStart:'2026-11-08',nextWeekStart:'2026-11-15',rows:[book,{...mock,review:true}],nextReview:[{unitId:'r',unitLabel:'나머지정리',items:[book]}]});
  assert.match(html,/다시 풀 단원/);
  assert.match(html,/2026년 고1 3월 7번/);
  assert.match(html,/href="https:\/\/wdown\.ebsi\.co\.kr\/exam.pdf"/);
  const next = markup({route,rows:[{...mock,reviewOf:['paper:q1']}],nextReview:[{unitLabel:'나머지정리',items:[book],practice:[book,mock]}]});
  assert.match(next,/다시 풀 단원/);
  assert.match(next,/class="uc-practice"[\s\S]+기본 연습[\s\S]+2026년 고1 3월 7번[\s\S]+재점검 기출 원문 열기/);
  assert.match(html,/다음 주 보완 일정[\s\S]+11월 15일 ~ 11월 21일[\s\S]+나머지정리[\s\S]+기본정석/);
});

test('manual range and empty notices stay usable, and no invented question or unsafe link is shown', () => {
  const html=markup({route,rows:[],notices:['교과서 <단원>을 확인하세요.'],manualBooks:[{id:'book',title:'내 연습책'}]});
  assert.match(html,/교과서 &lt;단원&gt;을 확인하세요/);
  assert.match(html,/name="bookId"/);
  assert.doesNotMatch(html,/data-uc-kind="mock"|<단원>/);
  const locked = markup({route,readOnly:true,rows:[{...mock,url:'javascript:alert(1)',title:'<기출>'}]});
  assert.doesNotMatch(locked,/javascript:|<기출>/);
  assert.match(locked,/input type="checkbox"[^>]+disabled/);
});
