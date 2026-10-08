// 떠오르는 태양 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { sunModel, WATERS } from './lab-sun.js';
import { OIL, ETHANOL } from '../scenes/rising-sun-model.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s51-u03.judge.js';

test('물을 넣을수록 덩어리가 높이 뜬다(원본 결과 순서) · 물이 없으면 바닥 · 40 mL면 수면', () => {
  assert.ok(ETHANOL < OIL && OIL < 1, '에탄올 < 식용유 < 물');
  const h = WATERS.map((m) => sunModel(m).height);
  for (let i = 1; i < h.length; i++) assert.ok(h[i] > h[i - 1], `${h}`);
  assert.equal(sunModel(0).height, 0); assert.equal(sunModel(40).height, 10); assert.equal(sunModel(20).height, 5);
  for (const m of WATERS) { const s = sunModel(m); assert.ok(s.f >= 0 && s.f <= 1); assert.match(s.result, /^눈금 \d+칸 · /); }
  assert.throws(() => sunModel(15), RangeError);
});
test('대결 세 라운드(물 0 vs 20: 2팀 · 30 vs 10: 1팀 · 20 vs 20: 같음)를 기록으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s51-u03'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...sunModel(t.ml) }));
    assert.deepEqual(battleVerdict('s51-u03', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s51-u03', round, rows, [(answers[i] + 1) % 3, (answers[i] + 1) % 3]).ok, [false, false]);
  });
  const r = { ml: 20, ...sunModel(20) };
  assert.equal(validBattleRow('s51-u03', r), true);
  assert.equal(validBattleRow('s51-u03', { ...r, height: 9 }), false);
});
test('「식용유가 가벼워졌다」·「행성 사이 거리는 같다」는 정답이 아니다', () => {
  assert.notEqual(judgeText('식용유가 물을 먹어서 가벼워졌다.', judge['s51-u03-b07']).st, 'ok');
  assert.notEqual(judgeText('행성 사이의 거리는 모두 같다.', judge['s51-u03-v019']).st, 'ok');
  assert.equal(judgeText('물을 넣을수록 아래층 액체가 무거워져 식용유가 위로 떠오른다.', judge['deck:concl0']).st, 'ok');
});
