// 튀는 물방울 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { splashModel, HOLES, DATA } from './lab-splash.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s51-u01.judge.js';

test('세 번 잰 값의 평균이 지도자료 측정값(3회 평균)과 0.1 이내이고, 가늘수록·높을수록 많이 튄다', () => {
  for (const h of [15, 35]) for (const d of HOLES) {
    const m = splashModel(d, h);
    assert.equal(m.trials.length, 3);
    assert.ok(Math.abs(m.mean - DATA[h][d]) <= 0.11, `${d} mm ${h} cm: ${m.mean} vs ${DATA[h][d]}`);
    assert.ok(new Set(m.trials).size > 1, '세 값은 조금씩 다르다');
    assert.deepEqual(splashModel(d, h), m, '같은 조건은 늘 같은 값');
  }
  for (const h of [15, 35]) { const ms = HOLES.map((d) => splashModel(d, h).mean); assert.deepEqual([...ms].sort((a, b) => b - a), ms, `${h} cm: 구멍이 클수록 적다`); }
  for (const d of HOLES) assert.ok(splashModel(d, 35).mean > splashModel(d, 15).mean, `${d} mm: 높을수록 많다`);
  assert.throws(() => splashModel(2, 15), RangeError);
});
test('대결 세 라운드(구멍: 1팀 · 높이: 2팀 · 재현: 같음)를 기록으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s51-u01'], answers = [0, 2, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...splashModel(t.hole, t.height) }));
    assert.deepEqual(battleVerdict('s51-u01', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    const wrong = (answers[i] + 1) % 3;
    assert.deepEqual(battleVerdict('s51-u01', round, rows, [wrong, wrong]).ok, [false, false]);
  });
  const r = { hole: 1, height: 15, ...splashModel(1, 15) };
  assert.equal(validBattleRow('s51-u01', r), true);
  assert.equal(validBattleRow('s51-u01', { ...r, mean: 300 }), false);
  assert.equal(validBattleRow('s51-u01', { ...r, trials: [1, 2, 3] }), false);
});
test('결과를 가설에 맞게 고치는 답·거꾸로 된 결론은 통과하지 않는다', () => {
  assert.notEqual(judgeText('결과를 가설에 맞게 고쳐 쓴다.', judge['s51-u01-b09']).st, 'ok');
  assert.notEqual(judgeText('구멍이 클수록 많이 튄다.', judge['deck:concl0']).st, 'ok');
  assert.equal(judgeText('구멍이 작을수록 튄 방울이 많다.', judge['deck:concl0']).st, 'ok');
});
