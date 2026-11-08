import assert from 'node:assert/strict';
import test from 'node:test';
import './planner-book-pace.js';
import './planner-book-pace-view.js';

const book = {id:'math', title:'기본 <교재>',chapters:['도형','확률','통계']};
const goal = {unit:'page',startDate:'2026-11-01',endDate:'2026-11-29',startPosition:0,endPosition:140};
const record = (date,position,manual = true) => ({date,position,manual});
function draw(observations, day='2026-11-15', plan=goal, drafts={}) {
  const unit = plan?.unit || 'chapter';
  const pace = globalThis.PlannerBookPace.build({goal:plan,observations,day,unit});
  return globalThis.PlannerBookPaceView.markup({book, books:[book],goal:plan,pace,unit,day,observations},{},drafts);
}

test('separates the current gap from its improvement and shows the catch date on the chart', () => {
  const page = draw([record('2026-11-08',20,false),record('2026-11-15',62)]);
  assert.match(page,/오늘 목표보다 8쪽 늦어요/);
  assert.match(page,/따라잡고 있어요. 지난 기록보다 7쪽 가까워졌어요/);
  assert.match(page,/2026\.11\.23 무렵에 이 교재의 목표 진도를 따라잡아요/);
  assert.match(page,/class="bp-estimate-line"/);
  assert.match(page,/class="bp-point" data-bp-date="2026-11-15" data-bp-position="62"/);
  assert.match(page,/class="bp-actor" data-bp-date="2026-11-15"/);
  assert.equal((page.match(/data-bp-remove=/g)||[]).length,1);
  assert.match(page,/체크리스트/);
  assert.match(page,/기본 &lt;교재&gt;/);
});

test('a widening gap reports a later book finish without drawing a catch-up forecast', () => {
  const page = draw([record('2026-11-08',26),record('2026-11-15',47)]);
  assert.match(page,/더 늦어지고 있어요/);
  assert.match(page,/목표 종료일 뒤인 2026\.12\.16/);
  assert.doesNotMatch(page,/class="bp-estimate-line"/);
});

test('a stale report is dated and does not present a crossed forecast as a confirmed endpoint', () => {
  const page=draw([record('2026-11-08',20),record('2026-11-15',62)],'2026-11-24');
  assert.match(page,/2026\.11\.15에 확인한 범위 기준/);
  assert.match(page,/오늘 목표보다 53쪽 늦어요/);
  assert.match(page,/혼자 풀 수 있는 범위를 다시 기록/);
  assert.doesNotMatch(page,/data-bp-date="2026-11-24"/);
});

test('unconfirmed pages produce no solved marker and page and chapter drafts stay distinct', () => {
  const page = draw([],'2026-11-15',null);
  assert.doesNotMatch(page,/class="bp-actor"|data-bp-gap/);
  assert.match(page,/<option value="" disabled selected>단원 선택/);
  assert.match(page,/교재의 목표 기간과 범위를 정하면/);
  const chapters = draw([record('2026-11-15',2)],'2026-11-15',null);
  assert.match(chapters,/혼자 풀 수 있는 범위<\/dt><dd>2단원 · 확률/);
  const blank = draw([record('2026-11-15',2)],'2026-11-15',null,{observe:{unit:'chapter',position:null}});
  assert.match(blank,/name="position" required><option value="" disabled selected/);
  const switched = draw([record('2026-11-15',2)],'2026-11-15',null,{observe:{unit:'page',position:null}});
  assert.match(switched,/name="position" type="number"[^>]*value=""/);
});
