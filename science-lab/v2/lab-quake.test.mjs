// 지진 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { quakeModel } from './lab-quake.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s42-u04.judge.js';

test('힘이 셀수록 지층이 더 변하고, 끊어질 때만 떨림·집 피해가 있고, 내진 설계 집은 덜 다친다', () => {
  const c = ['약하게', '세게', '아주 세게'].map((f) => quakeModel(f, '보통 집'));
  assert.deepEqual(c.map((m) => m.change), [1, 2, 3]);
  assert.deepEqual(c.map((m) => m.damage), [0, 0, 2]);
  assert.ok(quakeModel('아주 세게', '내진 설계 집').damage < quakeModel('아주 세게', '보통 집').damage);
  assert.equal(quakeModel('세게', '내진 설계 집').damage, 0);
  assert.throws(() => quakeModel('살짝', '보통 집'), RangeError);
});
test('대결 세 라운드(힘: 2팀 · 끝까지: 1팀 · 내진: 2팀 피해 큼)를 기록으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s42-u04'], answers = [2, 0, 2];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...quakeModel(t.force, t.house) }));
    assert.deepEqual(battleVerdict('s42-u04', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s42-u04', round, rows, [1, 1]).ok, [false, false]);
  });
  const r = { ...rounds[0].targets[0], ...quakeModel('약하게', '보통 집') };
  assert.equal(validBattleRow('s42-u04', { ...r, change: 3 }), false);
  assert.equal(validBattleRow('s42-u04', { ...r, force: '살짝' }), false);
});
test('「화산 때문에 지진」은 결론으로 통과하지 않고, 엘리베이터 대피는 정답이 아니다', () => {
  assert.notEqual(judgeText('화산이 폭발해서 지진이 난다.', judge['deck:concl0']).st, 'ok');
  assert.equal(judgeText('지층이 큰 힘을 받아 끊어지면 땅이 흔들려 지진이 난다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('엘리베이터를 타고 빨리 내려간다.', judge['s42-u04-b09']).st, 'ok');
});
