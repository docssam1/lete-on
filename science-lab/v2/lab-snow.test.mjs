// 병 속에 내리는 눈 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { snowModel, COOLS, TEMPS } from './lab-snow.js';
import { SOL, dissolvedAt, MAKE_T } from '../scenes/snow-model.js';
import { SOLUBILITY } from '../data/book/s51-u04.book.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s51-u04.judge.js';

test('원본 용해도로 계산: 60 ℃ 그대로 0 g · 실온 1.8 g · 얼음물 2.5 g, 차가울수록 많다', () => {
  assert.deepEqual(COOLS.map((c) => snowModel(c).snow), [0, 1.8, 2.5]);
  assert.equal(dissolvedAt(MAKE_T), 5.5);
  for (let i = 1; i < TEMPS.length; i++) assert.ok(SOL[TEMPS[i]] < SOL[TEMPS[i - 1]], '온도가 낮을수록 녹는 양이 적다');
  // 교재 그래프의 원본 값과 실험실 값이 같은 출처
  for (const [t, g] of [[0, 30], [20, 37], [60, 55.2], [100, 78]]) assert.equal(SOLUBILITY.nh4cl[SOLUBILITY.temps.indexOf(t)], g);
  assert.ok(SOLUBILITY.nacl.at(-1) - SOLUBILITY.nacl[0] < 5, '소금은 온도에 따라 녹는 양이 거의 그대로');
  assert.throws(() => snowModel('냉동실'), RangeError);
});
test('대결 세 라운드(그대로 vs 실온: 2팀 · 얼음물 vs 실온: 1팀 · 같은 조건: 같음)', () => {
  const rounds = LAB_BATTLE_ROUNDS['s51-u04'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...snowModel(t.cool) }));
    assert.deepEqual(battleVerdict('s51-u04', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s51-u04', round, rows, [(answers[i] + 1) % 3, (answers[i] + 1) % 3]).ok, [false, false]);
  });
  const r = { cool: COOLS[1], ...snowModel(COOLS[1]) };
  assert.equal(validBattleRow('s51-u04', r), true);
  assert.equal(validBattleRow('s51-u04', { ...r, snow: 3 }), false);
});
test('「용액이 얼었다」·「차가울수록 많이 녹는다」·「설탕이 사라졌다」는 정답이 아니다', () => {
  assert.notEqual(judgeText('염화암모늄이 얼어서 눈이 되었다.', judge['s51-u04-b07']).st, 'ok');
  assert.notEqual(judgeText('차가운 물에 더 많이 녹는다.', judge['s51-u04-v016']).st, 'ok');
  assert.notEqual(judgeText('설탕이 사라졌다.', judge['s51-u04-b08']).st, 'ok');
  assert.equal(judgeText('온도가 낮아지면 녹을 수 있는 양이 줄어 녹지 못한 것이 결정으로 나온다.', judge['s51-u04-b07']).st, 'ok');
});
