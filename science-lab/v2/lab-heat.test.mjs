// 온도와 열 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { heatModel, MATERIALS, WATERS, CELLS } from './lab-heat.js';
import { cellColor } from '../scenes/heat-model.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s51-u02.judge.js';

test('구리 > 알루미늄 > OHP 필름(원본 결과 순서), 뜨거운 물이 미지근한 물보다 많이, OHP 필름은 물 위가 그대로', () => {
  for (const w of WATERS) { const n = MATERIALS.map((m) => heatModel(m, w).changed); assert.ok(n[0] > n[1] && n[1] >= n[2], `${w}: ${n}`); assert.equal(n[2], 0); }
  for (const m of MATERIALS.slice(0, 2)) assert.ok(heatModel(m, '뜨거운 물').changed > heatModel(m, '미지근한 물').changed);
  for (const m of MATERIALS) assert.equal(heatModel(m, '미지근한 물').yellow, 0, '미지근한 물(약 50 ℃)로는 60 ℃ 노랑이 될 수 없다');
  for (const m of MATERIALS) for (const w of WATERS) { const h = heatModel(m, w); assert.ok(h.changed <= CELLS && h.yellow <= h.changed); }
  // 색은 아래 칸부터: 위 칸이 변했으면 아래 칸도 변해 있다
  for (const p of [0.3, 0.6, 1]) { const c = [0, 1, 2, 3, 4, 5].map((i) => cellColor('구리 테이프', '뜨거운 물', i, p)); for (let i = 1; i < 6; i++) assert.ok(c[i] <= c[i - 1], `p=${p}: ${c}`); }
  assert.throws(() => heatModel('철', '뜨거운 물'), RangeError);
});
test('대결 세 라운드(재료: 1팀 · 물 온도: 2팀 · 금속끼리: 2팀)를 기록으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s51-u02'], answers = [0, 2, 2];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...heatModel(t.material, t.water) }));
    assert.deepEqual(battleVerdict('s51-u02', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s51-u02', round, rows, [1, 1]).ok, [false, false]);
  });
  const r = { material: '구리 테이프', water: '뜨거운 물', ...heatModel('구리 테이프', '뜨거운 물') };
  assert.equal(validBattleRow('s51-u02', r), true);
  assert.equal(validBattleRow('s51-u02', { ...r, changed: 6 }), false);
});
test('「금속은 차갑다」·「따뜻한 공기는 아래로」는 정답이 아니다', () => {
  assert.notEqual(judgeText('금속은 차가워서 색이 늦게 변한다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('따뜻한 공기는 아래로 내려가기 때문이다.', judge['s51-u02-b09']).st, 'ok');
  assert.equal(judgeText('구리는 열을 빨리 전달하고 OHP 필름은 느리게 전달한다.', judge['deck:concl0']).st, 'ok');
});
