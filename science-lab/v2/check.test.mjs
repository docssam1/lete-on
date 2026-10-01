// 선생님 확인(v2/check.js): 이 기기 기록에서 「확인 필요」를 고르고, 선생님 판정이 붙으면 빠진다
import test from 'node:test';
import assert from 'node:assert/strict';

const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); } };
const { records, needs, countNeeds } = await import('./check.js');

test('확인 필요 = 기기 판정 review 이고 선생님 판정이 아직 없는 칸', () => {
  mem['sciLab.deck'] = JSON.stringify({
    's41-u01:concl0': '같은 극은 밀어요',
    's41-u01:grade:concl': { at: 2, tries: 2, boxes: [{ k: 'concl0', st: 'review', text: '같은 극은 밀어요' }] },
    's41-u01:grade:hypo': { at: 1, tries: 1, boxes: [{ k: 'hypo', st: 'ok', text: '같은 극이면 뜰 것' }] },
    's41-u01:grade:challenge': { at: 3, tries: 1, boxes: [{ k: 'creative', st: 'review', text: '자석 빗자루' }] },
    's41-u01:teacher:challenge:creative': { v: 'ok', note: '좋아요', at: 4 },
    's41-u02:grade:wonder': { at: 5, tries: 2, boxes: [{ k: 'wonder', st: 'review', text: '마개가 튀어나와요' }] },
  });
  const all = records(['s41-u01']);
  assert.equal(all.length, 3);
  assert.deepEqual(all.map((r) => r.k), ['creative', 'concl0', 'hypo']);   // 최근 것부터
  assert.deepEqual(all.filter(needs).map((r) => r.k), ['concl0']);
  assert.equal(all[0].teacher.note, '좋아요');
  assert.equal(countNeeds(['s41-u01']), 1);
  assert.equal(countNeeds(['s41-u01', 's41-u02']), 2);
  assert.equal(countNeeds(null), 2);
});
