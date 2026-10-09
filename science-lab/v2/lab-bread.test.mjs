// 효모빵 반죽 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { breadModel, WATERS, TEMPS } from './lab-bread.js';
import { START, MINUTES, volAt } from '../scenes/bread-model.js';
import { DOUBLING } from '../data/book/s51-u05.book.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s51-u05.judge.js';

test('원본 결과 순서: 따뜻한 물 > 찬물 > 뜨거운 물(효모가 죽어 그대로)', () => {
  const v = WATERS.map((w) => breadModel(w).vol);
  assert.deepEqual(v, [240, 400, 200]);
  assert.ok(v[1] > v[0] && v[0] > v[2], '따뜻한 물이 가장 많이, 뜨거운 물은 그대로');
  assert.equal(breadModel(WATERS[2]).vol, START);
  assert.deepEqual(TEMPS, [10, 40, 70]);
  for (const w of WATERS) { assert.equal(volAt(w, 0), START); assert.equal(volAt(w, MINUTES), breadModel(w).vol); assert.ok(volAt(w, 20) >= START); }
  assert.throws(() => breadModel('얼음물'), RangeError);
  DOUBLING.count.forEach((c, i) => assert.equal(c, 2 ** i, '20분마다 두 배'));
});
test('대결 세 라운드(찬물 vs 따뜻한 물: 2팀 · 따뜻한 물 vs 뜨거운 물: 1팀 · 같은 조건: 같음)', () => {
  const rounds = LAB_BATTLE_ROUNDS['s51-u05'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...breadModel(t.water) }));
    assert.deepEqual(battleVerdict('s51-u05', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s51-u05', round, rows, [(answers[i] + 1) % 3, (answers[i] + 1) % 3]).ok, [false, false]);
  });
  const r = { water: WATERS[1], ...breadModel(WATERS[1]) };
  assert.equal(validBattleRow('s51-u05', r), true);
  assert.equal(validBattleRow('s51-u05', { ...r, vol: 500 }), false);
});
test('「뜨거울수록 활발」·「밀가루가 불어서」·「버섯은 식물」은 정답이 아니다', () => {
  assert.notEqual(judgeText('뜨거울수록 효모가 더 활발해서 많이 부풀었다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('따뜻한 물에서 밀가루가 더 잘 불어서이다.', judge['s51-u05-b07']).st, 'ok');
  assert.notEqual(judgeText('버섯은 씨로 번식하는 식물이다.', judge['s51-u05-b08']).st, 'ok');
  assert.equal(judgeText('따뜻할 때 효모가 활발해서 이산화탄소를 많이 만들어 반죽이 부풀었다.', judge['s51-u05-b07']).st, 'ok');
});
