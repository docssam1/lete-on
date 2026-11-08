import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import test from 'node:test';

const context = {window: {}};
for (const file of ['planner-student-visual.js','planner-weekly-trend-view.js']) {
  runInNewContext(readFileSync(new URL(file, import.meta.url), 'utf8'), context);
}
const {markup} = context.window.PlannerWeeklyTrendView;
const student = {grade: 5, gender: 'girl'};

function render(gaps, track = 'all') {
  const points = gaps.map((gap, index) => ({
    weekNumber: index + 1, start: '2026-10-01', target: 5, completed: gap === null ? null : 4,
    gap, status: gap === null ? 'unrecorded' : 'recorded'
  }));
  const observed = points.filter(point => point.status === 'recorded');
  return markup({phase: 'active', track, points, latest: observed.at(-1), previous: observed.at(-2)}, student);
}

test('signed session differences rise and fall with a dashed zero baseline, and a missing week breaks the line', () => {
  const html = render([1, -2, null, -1, 0]);
  assert.equal((html.match(/data-wt-segment /g) || []).length, 2);
  assert.match(html, /wt-character" data-wt-week="5" data-wt-gap="0"/);
  assert.match(html, /student-girl/);
  assert.match(html, /계획선/);
  assert.match(html, /밀렸던 1회를 모두 따라잡았어요/);
  assert.doesNotMatch(html, /wt-marker" data-wt-week="3"/);
});
test('a units view distinguishes pending units and solo evidence from session counts', () => {
  const html = render([0, -2, 0], 'units');
  assert.match(html, /단원 보완 흐름/);
  assert.match(html, /보완할 단원 0개/);
  assert.match(html, /지난 기록보다 보완할 단원이 2개 줄었어요/);
  assert.match(html, /혼자 푼 항목이 있는 단원/);
  assert.doesNotMatch(html, /누적 차이|계획선|주간 점검 열기/);
});
test('new learners may open a clearly labeled sample with no observed points or progress stamps', () => {
  const html = markup({phase: 'unconfigured', track:'all', points: []}, student);
  assert.match(html, /그래프 예시 보기/);
  assert.match(html, /<strong>예시<\/strong>/);
  assert.match(html, /value="units"/);
  assert.doesNotMatch(html, /data-wt-week=|data-wt-segment|최근 점검|wt-example" open/);
});
test('readable week labels include the latest recorded point on a narrow screen', () => {
  const short = render([0, -2, 0, null]);
  assert.doesNotMatch(short, /class="wt-sparse"/);
  const long = render([0, 1, 0, 0, 1, 0, null, null]);
  assert.match(long, /<span class="" style="left:[^"]+">6주<\/span>/);
});
