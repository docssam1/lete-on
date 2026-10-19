import test from 'node:test';
import assert from 'node:assert/strict';
import { chapter, art, plan } from '../data/book/s31-u04.book.js';
import { similar } from '../data/units/s31-u04.similar.js';
import { items } from '../data/units/s31-u04.js';
import { renderChapter } from './book.js';
import { buildSlides } from './deck.js';
import { findLifeItem } from './book-life.js';
const pool = [...similar, ...items];
test('같은 교재의 학생 기록칸과 교사 예시를 구분하고 원문 그림 수행을 보존한다', () => {
  const student = renderChapter(chapter, art, pool), teacher = renderChapter(chapter, art, pool, { teacher: true });
  assert.equal((student.match(/class="bk-page/g) || []).length, (teacher.match(/class="bk-page/g) || []).length);
  assert(!student.includes('class="bk-ans"')); assert(teacher.includes('지도 예시(모형 기록)'));
  assert(student.includes(chapter.performance[0].prompt)); assert(student.includes(chapter.performance[1].prompt));
  assert(!student.includes('cageExample')); assert(!student.includes('통풍되는 덮개</text>'));
  assert(student.includes('생물의 한살이')); assert(student.includes('GFIELD · 지필드'));
});
test('확인 문제는 모두 존재하고 새 보충과 원문 짝의 출처를 구별한다', () => {
  for (const key of [...chapter.formative.items, ...chapter.check]) assert(findLifeItem(pool, key), key);
  assert.equal(findLifeItem(pool, 's31-u04-b07').sourceRef.type, 'authored-supplement');
  assert.equal(findLifeItem(pool, '4-2').sourceRef.type, 'similar');
});
test('학생·교사 수업에 빈 3D 장면을 넣지 않고 기록 활동을 여러 날 이어 간다', () => {
  for (const mode of ['self', 'teach']) {
    const slides = buildSlides(chapter, art, plan, pool, mode);
    assert(!slides.some((s) => s.mount === 'scene'));
    assert(slides.some((s) => s.kind === 'fieldwork' && s.fieldTab === 'draw'));
    assert(slides.some((s) => s.kind === 'fieldwork' && s.fieldTab === 'intro'));
    if (mode === 'teach') assert(!slides.filter((s) => s.kind !== 'fieldwork').some((s) => s.body.includes('<textarea')));
    else assert(slides.some((s) => s.id === 'recall' && s.ses === 2));
  }
});
test('자람의 물·햇빛 실험에 각각 설계·실행·결과 지면과 별도 기록 수업이 있다', () => {
  const paper = renderChapter(chapter, art, pool);
  assert.equal((paper.match(/class="bk-page/g) || []).length, 22);
  for (const g of chapter.growthExperiments) {
    assert(paper.includes(g.title)); assert(paper.includes(g.change)); assert(paper.includes(g.same));
    for (const mode of ['self', 'teach']) {
      const slides = buildSlides(chapter, art, plan, pool, mode);
      assert(slides.some((s) => s.id === `growth-${g.key}-design`));
      assert(slides.some((s) => s.id === `growth-${g.key}-method`));
      assert(slides.some((s) => s.id === `growth-${g.key}-record` && s.fieldTab === 'experiment' && s.kind === 'fieldwork'));
      assert.equal(slides.length, 36);
    }
  }
  assert(paper.includes('밀폐된 검은 상자')); assert(paper.includes('키만 더 크다고'));
});
