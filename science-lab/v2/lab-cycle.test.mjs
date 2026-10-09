// 물의 여행 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { cycleModel } from './lab-cycle.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s42-u05.judge.js';

test('햇빛(열)과 찬 뚜껑(얼음)이 각각 비를 늘리고, 둘 다 있을 때 가장 많다', () => {
  const m = (s, l) => cycleModel(s, l).stage;
  assert.equal(m('약하게', '얼음 없음'), 0);
  assert.ok(m('세게', '얼음 없음') > m('약하게', '얼음 없음'));
  assert.ok(m('약하게', '얼음 있음') > m('약하게', '얼음 없음'));
  assert.equal(m('세게', '얼음 있음'), 2);
  assert.equal(cycleModel('세게', '얼음 없음').evap, '많이');
  assert.throws(() => cycleModel('아주 세게', '얼음 없음'), RangeError);
});
test('대결 세 라운드(전등: 2팀 · 얼음: 1팀 · 재현: 같음)를 기록으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s42-u05'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...cycleModel(t.sun, t.lid) }));
    assert.deepEqual(battleVerdict('s42-u05', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    const wrong = (answers[i] + 1) % 3;
    assert.deepEqual(battleVerdict('s42-u05', round, rows, [wrong, wrong]).ok, [false, false]);
  });
  const r = { ...rounds[0].targets[0], ...cycleModel('약하게', '얼음 있음') };
  assert.equal(validBattleRow('s42-u05', r), true);
  assert.equal(validBattleRow('s42-u05', { ...r, stage: 2 }), false);
  assert.equal(validBattleRow('s42-u05', { ...r, sun: '아주 세게' }), false);
});
test('「물이 튀어서·얼음이 녹아서」는 결론으로 통과하지 않고, 증발·응결·비로 설명하면 통과한다', () => {
  assert.notEqual(judgeText('바닷물이 튀어서 뚜껑에 붙는다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('얼음이 녹아서 그 물이 떨어진다.', judge['deck:concl0']).st, 'ok');
  assert.equal(judgeText('물이 증발해서 수증기가 되고 차가운 뚜껑에서 응결해 물방울이 되어 비로 떨어진다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('물이 점점 줄어든다.', judge['deck:concl0']).st, 'ok');
});
