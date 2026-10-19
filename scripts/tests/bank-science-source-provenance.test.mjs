import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { sourceRefFor, sourceGivensFor, sourceExplanationFor } from '../bank-science-lib.mjs';
import { source as previousSource } from '../../science-lab/data/units/s31-u03.source.js';

const load = (name) => JSON.parse(readFileSync(new URL(`../../science-lab/bank/work/s31u04/${name}`, import.meta.url), 'utf8'));
const manifest = load('source-manifest.json');
const cfg = {
  course: '초등 3-1', unitLabel: 'Ⅳ. 생물의 한살이', sourceLabel: '교재 문항',
  sourceBooks: Object.fromEntries(manifest.books.map((b) => [b.id, {
    ...b, sourceId: `gfield-theory-${b.id}`, course: `초등 ${b.course}`,
    unitLabel: b.id === 'animals' ? '동물의 한살이' : '식물의 한살이',
  }])),
};
const questions = [1, 2, 3, 4].flatMap((set) => load(`set${set}.json`).map((q) => ({ ...q, set })));

test('기존 단원평가 출처는 현재 검수 모듈의 출처와 그대로 같다', () => {
  const o = previousSource[0], p = o.sourceRef;
  assert.deepEqual(sourceRefFor({ set: p.set, no: p.no, page: p.page }, {
    sourceId: p.sourceId.replace(/-set\d+$/, ''), edition: p.edition.replace(/ 세트\d+$/, ''), course: p.course, unitLabel: p.unit,
  }), p);
});

test('새 단원 원문 41개가 교재의 실제 학년·파일·쪽수·문항 번호를 보존한다', () => {
  for (const q of questions) {
    const ref = sourceRefFor(q, cfg), book = cfg.sourceBooks[q.provenance.book];
    assert.equal(ref.edition, book.file);
    assert.equal(ref.course, book.course);
    assert.equal(ref.page, q.page);
    assert.equal(ref.originalNo, q.provenance.originalNo);
    assert.equal(ref.section, q.provenance.section);
    assert.equal(ref.label, '교재 문항');
  }
  const plant = questions.find((q) => q.provenance.book === 'plants');
  assert.equal(sourceRefFor(plant, cfg).course, '초등 4-1');
  assert.equal(cfg.course, '초등 3-1');
});

test('새 교재의 출처 누락을 대상 단원의 기본 출처로 대체하지 않는다', () => {
  const q = questions[0];
  assert.throws(() => sourceRefFor({ ...q, provenance: { ...q.provenance, book: '미등록' } }, cfg), /교재 출처 없음/);
  assert.throws(() => sourceRefFor({ ...q, page: 9999 }, cfg), /쪽수 범위 밖/);
  assert.throws(() => sourceRefFor({ ...q, provenance: { book: 'animals', section: '개념 확인' } }, cfg), /문항 번호 없음/);
});

test('연속 소문항의 공통 문맥과 기존 표·지문을 함께 보존한다', () => {
  for (const q of questions.filter((x) => x.provenance.context)) {
    const result = sourceGivensFor(q, cfg);
    assert(result.지문.includes(q.provenance.context));
    if (q.givens?.지문) assert(result.지문.includes(q.givens.지문));
    if (q.givens?.표) assert.deepEqual(result.표, q.givens.표);
  }
  const q = questions[0];
  assert.deepEqual(sourceGivensFor(q, {}), q.givens);
});

test('인쇄 해설은 고치지 않고 자료 검토 문구를 구분하여 덧붙인다', () => {
  const q = questions.find((x) => x.set === 4 && x.no === 3);
  const before = JSON.stringify(q), note = '이 그래프의 관찰 기간에 나타난 변화로 한정한다.';
  assert.equal(sourceExplanationFor(q, {}, '4-3'), q.explanation);
  assert.equal(sourceExplanationFor(q, { sourceNotes: { '4-3': note } }, '4-3'), `${q.explanation}\n[자료 검토] ${note}`);
  assert.equal(JSON.stringify(q), before);
});

test('인쇄에 없던 전사 비율은 표시에서만 제외하고 원문·실제 배점은 보존한다', async () => {
  const { sourceRubricFor, sourceExplanationFor } = await import('../bank-science-lib.mjs');
  const original = { explanation:'수평을 설명한다.', rubric:[{criterion:'수평을 바르게 설명하면 정답',ratio:'100%'}] };
  const before = JSON.stringify(original), cfg = {unprintedRubricRatios:['2-3']};
  assert.equal(sourceRubricFor(original,cfg,'2-3')[0].ratio,null);
  assert.equal(sourceRubricFor(original,cfg,'1-3')[0].ratio,'100%');
  assert(!sourceExplanationFor(original,cfg,'2-3').includes('100%'));
  assert(sourceExplanationFor(original,{},'2-3').includes('100%'));
  assert.equal(JSON.stringify(original),before);
});
