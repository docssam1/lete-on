import test from 'node:test';
import assert from 'node:assert/strict';
import { LAB_BATTLE_ROUNDS, battleVerdict, matchesBattleTarget, validBattleRow } from './lab-battle-model.js';
import { freezeModel } from './lab-freeze.js';
import { hillModel } from './lab-hill.js';
import { pondResult } from './lab-pond3d.js';

test('물: 같은 물을 얼려도 무게는 같고, 높이는 달라진다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s41-u02'];
  const rows = round => round.targets.map(target => ({ ...target, ...freezeModel(target.ml, target.state === '얼음') }));
  assert.deepEqual(battleVerdict('s41-u02', rounds[0], rows(rounds[0]), [1, 2]), { answers: [1, 1], ok: [true, false] });
  assert.deepEqual(battleVerdict('s41-u02', rounds[1], rows(rounds[1]), [2, 2]).ok, [true, true]);
  assert.deepEqual(battleVerdict('s41-u02', rounds[2], rows(rounds[2]), [0, 1]).ok, [true, false]);
});

test('흙: 비교는 두 팀이 실제로 남긴 수치로 판정하며 동률도 인정한다', () => {
  const round = LAB_BATTLE_ROUNDS['s41-u03'][0];
  const rows = round.targets.map(target => ({ ...target, ...hillModel(target.slope, target.water) }));
  assert.deepEqual(battleVerdict('s41-u03', round, rows, [2, 0]).ok, [true, false]);
  rows.forEach(row => { row.cut = 3; row.pile = 3; });
  assert.deepEqual(battleVerdict('s41-u03', round, rows, [1, 1]).ok, [true, true]);
  for (const item of LAB_BATTLE_ROUNDS['s41-u03']) {
    assert.equal(Object.keys(item.targets[0]).filter(key => item.targets[0][key] !== item.targets[1][key]).length, 1);
  }
});

test('화산: 백반 결정 크기와 가상 연기 양을 서로 다른 과제로 비교한다', () => {
  const [crystal, smoke] = LAB_BATTLE_ROUNDS['s41-u03b'];
  const crystals = [{ ...crystal.targets[0], result: '작은 결정 150개' }, { ...crystal.targets[1], result: '큰 결정 12개' }];
  assert.deepEqual(battleVerdict('s41-u03b', crystal, crystals, [2, 0]).ok, [true, false]);
  const smokes = [{ ...smoke.targets[0], result: '연기 많이, 흘러나온 양 10칸, 식으니 굳음' }, { ...smoke.targets[1], result: '연기 조금, 흘러나온 양 10칸, 식으니 굳음' }];
  assert.deepEqual(battleVerdict('s41-u03b', smoke, smokes, [0, 0]).ok, [true, true]);
});

test('연못: 각 팀의 식물·장소 결과를 기존 서식 모형으로 판정한다', () => {
  for (const round of LAB_BATTLE_ROUNDS['s42-u01']) {
    const rows = round.targets.map(target => { const result = pondResult(target.plant, target.where === '깊은 물' ? '물' : target.where); return { ...target, ok: result.ok, result: result.text }; });
    const answers = rows.map(row => row.ok ? 0 : 1);
    assert.deepEqual(battleVerdict('s42-u01', round, rows, answers).ok, [true, true]);
    assert.deepEqual(battleVerdict('s42-u01', round, rows, answers.map(value => 1 - value)).ok, [false, false]);
  }
});

test('빈 기록·엉뚱한 조건·비정상 수치·확정하지 않은 예상은 오답으로 처리하지 않는다', () => {
  const unit = 's41-u02', round = LAB_BATTLE_ROUNDS[unit][0];
  const rows = round.targets.map(target => ({ ...target, ...freezeModel(target.ml, target.state === '얼음') }));
  assert.equal(battleVerdict(unit, round, [rows[0], null], [1, 1]), null);
  assert.equal(battleVerdict(unit, round, rows, [null, 1]), null);
  assert.equal(battleVerdict(unit, round, rows, [1, 9]), null);
  assert.equal(matchesBattleTarget(unit, { ...rows[0], ml: 60 }, round.targets[0]), false);
  for (const value of [NaN, Infinity, -1, '120', null]) assert.equal(validBattleRow(unit, { ...rows[0], mass: value }), false);
  assert.equal(battleVerdict(unit, round, [{ ...rows[0], mass: NaN }, rows[1]], [1, 1]), null);
  assert.equal(validBattleRow('unknown', rows[0]), false);
});

test('새 대결에는 모든 단원에서 서로 다른 세 과제가 나온다', () => {
  for (const rounds of Object.values(LAB_BATTLE_ROUNDS)) {
    assert.equal(rounds.length, 3);
    assert.equal(new Set(rounds.map(round => JSON.stringify([round.field, round.targets]))).size, 3);
  }
});
