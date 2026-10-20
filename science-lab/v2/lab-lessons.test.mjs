// 4-1 자석·물·땅(s41-u01~u03): 기본 수업 = 3D 실험 수업(2026-10-20 ⑤). 탐구 기록 앱은 선택 기능(records)으로만 열린다.
// 지킬 것: ① 기본 수업 화면에 기록 앱 장이 없다 ② 3D 실험실 장이 있다 ③ 예전 기록(저장 키·보고서)은 기록장으로 이어진다 ④ 앱이 여는 교재가 3D 실험 교재다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildSlides } from './deck.js';

const V2 = fs.readFileSync(new URL('./v2.js', import.meta.url), 'utf8');
const LAB = { 's41-u01': 'ring-tower', 's41-u02': 'freeze', 's41-u03': 'hill' };
for (const [u, kind] of Object.entries(LAB)) {
  test(`${u} 기본 수업 = 3D 실험 수업, 기록은 선택`, async () => {
    const [{ lesson, recordsLesson }, book, ix, unit, similar] = await Promise.all([import(`../data/units/${u}.lesson.js`), import(`../data/book/${u}.book.js`),
      import(`../data/book/${u}.interact.js`).catch(() => ({})), import(`../data/units/${u}.js`), import(`../data/units/${u}.similar.js`).catch(() => ({ similar: [] }))]);
    assert.equal(lesson.explore.lab.kind, kind);
    assert.equal(lesson.explore.records.kind, 'inquiry');
    assert.equal(lesson.explore.records.config, recordsLesson.explore.lab.config, '같은 활동 설정(저장 키 sciLab.inquiry.<단원>)');
    assert.notEqual(lesson.explore.lab.rowsKey || 'labRows', lesson.explore.records.rowsKey, '3D 실험 기록이 예전 기록 행을 덮지 않는다');
    assert.equal(lesson.report, recordsLesson.report);
    assert.equal(lesson.elaborate.report, false, '수업 끝에 보고서 쓰기로 보내지 않는다');
    assert.ok(!book.chapter.inquirywork && !book.chapter.fieldwork);
    const pool = [...similar.similar, ...unit.items, ...(unit.source || [])];
    for (const mode of ['self', 'teach']) {
      const S = buildSlides(book.chapter, book.art, book.plan, pool, mode, ix.interact);
      assert.equal(S.filter((s) => /fieldwork/.test(s.kind)).length, 0, `${mode}: 기록 앱 장 없음`);
      assert.equal(S.filter((s) => s.id === 'lab').length, 1, `${mode}: 3D 실험실 장`);
    }
    assert.ok(V2.includes(`'${u}': () => import('../data/book/${u}.book.js')`), '앱이 3D 실험 교재를 연다');
    assert.ok(V2.includes(`'${u}': () => import('../data/book/${u}.inquiry.book.js')`), '기록 교재는 records-book으로');
  });
}
