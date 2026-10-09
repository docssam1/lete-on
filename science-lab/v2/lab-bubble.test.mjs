// 비눗방울 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { bubbleModel, ADDS, TRIALS } from './lab-bubble.js';
import { MEANS } from '../data/book/s52-u01.book.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s52-u01.judge.js';

test('그냥 비눗물 약 10초(지도자료) < 설탕 < 글리세린, 세 번 평균', () => {
  const m = ADDS.map((a) => bubbleModel(a));
  assert.deepEqual(m.map((x) => x.mean), [10, 25, 59]);
  assert.ok(m.every((x) => x.trials.length === TRIALS));
  m.forEach((x) => assert.equal(Math.round(x.trials.reduce((a, b) => a + b, 0) / TRIALS * 10) / 10, x.mean, '평균 = 합 ÷ 3'));
  assert.deepEqual(MEANS, [10, 25, 59], '교재 그래프와 실험실 값이 같은 출처');
  assert.throws(() => bubbleModel('소금'), RangeError);
});
test('대결 세 라운드(없음 vs 글리세린: 2팀 · 설탕 vs 없음: 1팀 · 같은 조건: 같음)', () => {
  const rounds = LAB_BATTLE_ROUNDS['s52-u01'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...bubbleModel(t.add) }));
    assert.deepEqual(battleVerdict('s52-u01', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s52-u01', round, rows, [(answers[i] + 1) % 3, (answers[i] + 1) % 3]).ok, [false, false]);
  });
  const r = { add: ADDS[1], ...bubbleModel(ADDS[1]) };
  assert.equal(validBattleRow('s52-u01', r), true);
  assert.equal(validBattleRow('s52-u01', { ...r, mean: 30 }), false);
});
test('「막을 무겁게」·「결과를 고친다」·「평균은 30초」는 정답이 아니다', () => {
  assert.notEqual(judgeText('글리세린이 막을 무겁고 단단하게 만들기 때문이다.', judge['s52-u01-b07']).st, 'ok');
  assert.notEqual(judgeText('결과를 가설에 맞게 고친다.', judge['s52-u01-v019']).st, 'ok');
  assert.notEqual(judgeText('평균은 30초이다.', judge['s52-u01-v018']).st, 'ok');
  assert.equal(judgeText('증발이 느려져서 막이 천천히 얇아지기 때문이다.', judge['s52-u01-b07']).st, 'ok');
});
