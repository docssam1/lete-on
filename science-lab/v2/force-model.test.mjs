import test from 'node:test';
import assert from 'node:assert/strict';
import { forceBalance, forceRecord, validForceRow } from './force-model.js';
import { lesson } from '../data/units/s31-u01.lesson.js';
import { similar } from '../data/units/s31-u01.similar.js';
import { chapter, art, plan } from '../data/book/s31-u01.book.js';
import { renderChapter } from './book.js';
import { buildSlides } from './deck.js';
test('같은 거리의 무게 비교와 위치를 옮긴 수평을 구분한다', () => {
  assert.equal(forceBalance({ pair: 'ab', left: 3, right: 3 }).result, 'right');
  assert.equal(forceBalance({ pair: 'ba', left: 3, right: 3 }).result, 'left');
  assert.equal(forceBalance({ pair: 'ac', left: 3, right: 3 }).result, 'level');
  assert.equal(forceBalance({ pair: 'ab', left: 4, right: 2 }).result, 'level');
  assert.equal(forceBalance({ pair: 'ab', left: 5, right: 1 }).result, 'left');
});
test('예상을 결과와 섞지 않고 잘못된 입력·위조된 관찰 기록을 거부한다', () => {
  const setup = { pair: 'ab', left: 3, right: 3 };
  assert.throws(() => forceRecord(setup, ''));
  for (const bad of [{ ...setup, left: 0 }, { ...setup, right: 6 }, { ...setup, left: NaN }, { ...setup, right: 1.5 }, { ...setup, pair: 'other' }]) assert.throws(() => forceBalance(bad));
  const r = forceRecord(setup, 'left'); assert.equal(r.prediction, 'left'); assert.equal(r.result, 'right'); assert(validForceRow(r));
  assert(!validForceRow({ ...r, observation: '수평을 이룬다' })); assert(!validForceRow({ ...r, result: 'left' }));
  setup.left = 4; assert.equal(r.left, 3);
});
test('5E 원고는 기존 검수 짝 문항을 쓰고 실제 수행을 모형 기록으로 대신하지 않는다', () => {
  const ids = new Set(similar.map((q) => q.id));
  for (const id of [...lesson.explain.cards, lesson.explain.table, ...lesson.explain.miniTest, ...lesson.elaborate.items, ...lesson.evaluate.items]) assert(ids.has(id), id);
  assert.equal(lesson.reusePairedItems, true); assert.equal(similar.length, 80);
  assert.match(lesson.explain.fromData([]), /실제 활동/);
  assert.match(lesson.evaluate.performanceNote, /증거를 대신하지/);
  assert.equal(lesson.explore.lab.kind, 'force');
});
test('실제 수행 다섯 활동과 조사·공유가 교재·수업에 있고 학생용 답은 숨긴다', () => {
  const student = renderChapter(chapter, art, similar), teacher = renderChapter(chapter, art, similar, { teacher: true });
  assert.equal((student.match(/class="bk-page/g) || []).length, 21); assert(!student.includes('class="bk-ans"')); assert(teacher.includes('class="bk-ans"'));
  assert.equal((student.match(/class="bk-life-watermark/g) || []).length, 21);
  for (const activity of chapter.activities) { assert(student.includes(activity.title)); assert(student.includes(activity.measure)); assert(teacher.includes(activity.teacher)); }
  assert(student.includes('공유한 날짜·대상·방법'));
  for (const mode of ['self', 'teach']) {
    const slides = buildSlides(chapter, art, plan, similar, mode);
    assert.equal(slides.length, 42); assert(slides.some((s) => s.id === 'lab' && s.kind === 'fieldwork' && s.title.startsWith('3D 실험실')));
    assert.equal(slides.filter((s) => s.kind === 'write' && !s.item).length, Object.keys(chapter.deckWrittenExamples).length);
    assert(slides.some((s) => s.id === 'share')); assert(slides.some((s) => s.id === 'report'));
    if (mode === 'self') assert(slides.some((s) => s.id === 'recall' && s.ses === 2));
    else assert(!slides.some((s) => s.body.includes('<textarea')));
  }
});
