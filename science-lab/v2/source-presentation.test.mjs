import assert from 'node:assert/strict';
import test from 'node:test';
import { bankLabel, groupLabel, examHeading, sourceCaption, sourceTableHtml } from './source-presentation.js';
import { source } from '../data/units/s31-u04.source.js';
import { BANK } from './units-index.js';

test('교재 원문은 내부 묶음을 인쇄 세트로 부르지 않고 실제 쪽수·번호를 표시한다', () => {
  const q = source.find((x) => x.sourceRef.set === 2 && x.sourceRef.no === 13);
  assert.equal(sourceCaption(q.sourceRef), '교재 문항 · 39쪽 1(1)번');
  assert.equal(bankLabel(BANK['s31-u04']), '교재 문항');
  assert.equal(groupLabel(BANK['s31-u04'], 2), '곤충의 한살이');
  assert.equal(examHeading(BANK['s31-u04'], 2), '교재 문항 · 곤충의 한살이');
  assert.equal(examHeading(BANK['s31-u03'], 2), '단원평가 세트2');
  assert.equal(sourceCaption({ set: 2, no: 4 }), '단원평가 세트2 · 4번');
});

test('실제 실험 표는 열 제목과 행을 보존하여 렌더링한다', () => {
  for (const q of source) for (const value of Object.values(q.givens || {})) {
    if (!value?.머리) continue;
    const html = sourceTableHtml(value);
    assert.equal((html.match(/<th /g) || []).length, value.머리.length, q.id);
    assert.equal((html.match(/<td>/g) || []).length, value.행.length * value.머리.length, q.id);
    for (const row of value.행) for (const cell of row) assert(html.includes(String(cell)));
    assert(!html.includes('[object Object]'));
  }
});

test('표의 내용은 HTML이 아닌 글자로 표시하고 기존 다른 지문은 건드리지 않는다', () => {
  const html = sourceTableHtml({ 머리: ['<script>'], 행: [['<img onerror="1">']] });
  assert(!html.includes('<script>'));
  assert(!html.includes('<img'));
  assert(html.includes('&lt;script&gt;'));
  const captioned = sourceTableHtml({caption:'가상 자료 <img>',머리:['시료'],행:[['가']]});
  assert(captioned.includes('<caption>가상 자료 &lt;img&gt;</caption>'));
  assert(!html.includes('<caption>'));
  assert.equal(sourceTableHtml({ 구분: ['가', '나'] }), '');
  assert.equal(sourceTableHtml(['가', '나']), '');
});
