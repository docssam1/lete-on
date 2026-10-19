import test from 'node:test';
import assert from 'node:assert/strict';
import { placeLabel, placeNow, placeOf, legacyFor, LEGACY_TO_2022 } from './curriculum-place.js';
import { SEMS_2022 } from './curriculum-2022.js';

test('같은 「학기·번호」라도 2022 개정과 2015 교재 단원을 이름표로 구별한다', () => {
  assert.equal(placeLabel('c22-s42-u04'), '2022 개정 · 4학년 2학기 Ⅳ. 기후변화와 우리 생활');
  assert.equal(placeLabel('s42-u04'), '2015 교재 · 4학년 2학기 Ⅳ. 화산과 지진');
  assert.equal(placeLabel('c22-s32-u04'), '2022 개정 · 3학년 2학기 Ⅳ. 감염병과 건강한 생활');
  assert.equal(placeLabel('s32-u04'), '2015 교재 · 3학년 2학기 Ⅳ. 물질의 상태');
  assert.equal(placeNow('s42-u04'), '지금 교과서(2022)에서는 4학년 1학기 Ⅲ. 땅의 변화');
  assert.equal(placeNow('c22-s42-u04'), '');
});

test('예전 id를 2022 내용으로 쓰는 단원(3-1·4-1)과 딸린 실험은 2022로 읽는다', () => {
  for (const id of ['s31-u01', 's41-u01', 's41-u04', 's41-u03b']) assert.equal(placeOf(id).era, '2022', id);
  assert.deepEqual(legacyFor('s41-u03'), ['s32-u03', 's42-u04']);
});

test('2015 → 2022 대응은 실제 2022 자리만 가리킨다', () => {
  const positions = new Set(SEMS_2022.flatMap((s) => s.units.map((u) => u.position)));
  for (const [id, m] of Object.entries(LEGACY_TO_2022)) {
    assert.equal(placeOf(id).era, '2015', id);
    assert.ok(m.to ? positions.has(m.to) : m.note, id);
  }
});
