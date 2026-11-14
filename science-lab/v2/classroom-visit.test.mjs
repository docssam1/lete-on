import test from 'node:test';
import fs from 'node:fs';
import { withThink } from './think-merge.js';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { classroomViewDescriptor, classroomVisitSummary, resumeClassroomIndex, recordClassroomView, classroomVisitHandlers, CLASSROOM_VISIT_KEY } from './classroom-visit.js';
import { revisedTextbookUnits } from './revised-textbook.js';
import { revisedClassroom, classroomQuestions } from './revised-lesson.js';
import { buildSlides } from './deck.js';

const slides = [{ id: 'intro', title: '처음 생각', kind: 'read', phase: 'start', body: '질문' }, { id: 'activity-1', title: '관찰', kind: 'activity', phase: 'observe', body: '관찰할 것' }, { id: 'end', title: '정리', kind: 'end', phase: 'end', body: '정리할 것' }];
const production = fs.readFileSync(new URL('./v2.js', import.meta.url), 'utf8');
const unit = 'c22-s62-u04', descriptor = classroomViewDescriptor(unit, slides);
const run = file => JSON.parse(execFileSync(process.execPath, ['--experimental-vm-modules', fileURLToPath(new URL('./tests/' + file, import.meta.url))], { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'] }));

test('열어 본 화면만 중복 없이 남기며 끝 화면을 열어도 수행·채점·완료를 만들지 않는다', () => {
  let saved = recordClassroomView(descriptor, null, 1, 10);
  saved = recordClassroomView(descriptor, saved, 1, 11);
  saved = recordClassroomView(descriptor, saved, 2, 12);
  assert.deepEqual(saved.current.visitedIds, ['activity-1', 'end']);
  assert.deepEqual(classroomVisitSummary(unit, saved), { lastNumber: 3, total: 3, viewed: 2, updatedAt: 12 });
  assert.equal(resumeClassroomIndex(descriptor, saved), 2);
  assert(!/passed|done|score|answer|completed/.test(JSON.stringify(saved)));
  const before = JSON.stringify(saved); recordClassroomView(descriptor, saved, 0, 13); assert.equal(JSON.stringify(saved), before);
});

test('원고·순서 변경은 처음부터 열고 직전 열람 이력은 그대로 보존한다', () => {
  const old = recordClassroomView(descriptor, null, 1, 10), reordered = classroomViewDescriptor(unit, [...slides].reverse());
  const changed = classroomViewDescriptor(unit, slides.map(s => ({ ...s, body: s.body + ' 새 설명' })));
  for (const next of [reordered, changed]) {
    assert.notEqual(next.revision, descriptor.revision); assert.equal(resumeClassroomIndex(next, old), 0);
    const saved = recordClassroomView(next, old, 0, 20);
    assert.deepEqual(saved.history, [old.current]); assert.equal(saved.current.visitedIds.length, 1);
    assert.equal(recordClassroomView(next, saved, 1, 21).history.length, 1);
  }
  assert.equal(resumeClassroomIndex({ ...descriptor, unit: 's31-u01' }, old), 0);
});

test('옛5단계·다른 단원·변조·알 수 없는 저장 형식과 잘못된 번호를 덮어쓰지 않는다', () => {
  const good = recordClassroomView(descriptor, null, 1, 10);
  const bad = [{ passed: true, done: [1, 2, 3, 4, 5] }, { ...good, schema: 2 }, { ...good, extra: 'future field' }, { ...good, current: { ...good.current, unit: 's31-u01' } }, { ...good, current: { ...good.current, lastNumber: 100 } }, { ...good, current: { ...good.current, visitedIds: ['made-up'] } }, { ...good, current: { ...good.current, slideIds: ['intro', 'intro'] } }];
  for (const value of bad) { const bytes = JSON.stringify(value); assert.equal(classroomVisitSummary(unit, value), null); assert.equal(resumeClassroomIndex(descriptor, value), 0); assert.equal(recordClassroomView(descriptor, value, 0, 20), null); assert.equal(JSON.stringify(value), bytes); }
  for (const index of [-1, 3, 1.2, NaN]) assert.equal(recordClassroomView(descriptor, good, index, 20), null);
  assert.equal(classroomViewDescriptor(unit, [...slides, slides[0]]), null);
});

test('해제·다른 주소·저장 실패는 늦은 진도 쓰기를 막고 기존 보고서·답·비교를 보존한다', () => {
  let active = true, reads = 0, writes = 0, state = { passed: true, done: [1, 2], report: { keep: true }, answers: { keep: '답' }, labRows: [{ keep: true }] };
  const original = structuredClone(state), store = { get() { reads++; return state; }, set(_unit, patch) { writes++; state = { ...state, ...patch }; } };
  const handlers = classroomVisitHandlers(unit, store, () => active, () => 10);
  handlers.onView(slides, 1); assert.equal(writes, 1); const { [CLASSROOM_VISIT_KEY]: saved, ...untouched } = state; assert.deepEqual(untouched, original); assert.equal(saved.current.lastNumber, 2);
  active = false; const counts = [reads, writes]; assert.equal(handlers.resolveResume(slides), 0); handlers.onView(slides, 2); assert.deepEqual([reads, writes], counts);
  active = true; const late = classroomVisitHandlers(unit, { get() { active = false; return state; }, set() { throw Error('late write'); } }, () => active, () => 20); late.onView(slides, 2); assert.equal(writes, 1);
  const failing = classroomVisitHandlers(unit, { get() { throw Error('storage blocked'); }, set() { throw Error('storage blocked'); } }, () => true); assert.equal(failing.resolveResume(slides), 0); assert.doesNotThrow(() => failing.onView(slides, 1));
  const quota = classroomVisitHandlers(unit, { get: () => state, set() { throw Error('quota exceeded'); } }, () => true); assert.doesNotThrow(() => quota.onView(slides, 2));
});

test('32실제 수업의 화면 지문은 안정적이고 어느 화면에서나 같은 위치로 재개한다', async () => {
  let count = 0;
  for (const u of revisedTextbookUnits) {
    const mod = await revisedClassroom(u, await import(`../data/book/${u}.book.js`)), raw = await import(`../data/units/${u}.js`), paired = await import(`../data/units/${u}.similar.js`);
    const data = production.includes(`withThink('${u}'`) ? await withThink(u, { ...raw, ...paired }) : { ...raw, ...paired };
    const pool = classroomQuestions(mod, [...(data.similar || []), ...data.items]);
    const first = buildSlides(mod.chapter, mod.art, mod.plan, pool, 'self');
    const before = JSON.stringify(first), d = classroomViewDescriptor(u, first);
    assert(d, u); assert.deepEqual(classroomViewDescriptor(u, buildSlides(mod.chapter, mod.art, mod.plan, pool, 'self')), d, u);
    for (const index of [0, Math.floor(first.length / 2), first.length - 1]) assert.equal(resumeClassroomIndex(d, recordClassroomView(d, null, index, 10)), index, u);
    assert.equal(JSON.stringify(first), before); count++;
  }
  assert.equal(count, 32);
});

test('실제 덱은 학생의 연결된 화면만 기록하고 교사·분리 화면은 읽거나 쓰지 않는다', () => {
  const r = run('classroom-visit-deck.mjs'); assert.equal(r.currentUnits, 32); assert.equal(r.studentResumeChecks, 32); assert.equal(r.teacherReads, 0); assert.equal(r.teacherWrites, 0); assert.equal(r.detachedWrites, 0); assert.equal(r.actualStudentStorageReads, 0);
});

test('프로덕션 resume주소·시작 입구·지연 콜백은 진도만 분리하여 처리한다', () => {
  const r = run('career-classroom-routes.mjs'); assert(r.actualResumeRoute && r.actualStartResumeLink && r.selfViewSaved && r.teacherUnchanged && r.releasedCallbackCannotWrite && r.staleLoadCannotRender && r.staleFailureCannotRender); assert.equal(r.actualStudentStorageReads, 0);
});
