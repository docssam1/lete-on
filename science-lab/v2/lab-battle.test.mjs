import test from 'node:test';
import assert from 'node:assert/strict';
import { LAB_BATTLE_ROUNDS, battleVerdict, matchesBattleTarget, validBattleRow } from './lab-battle-model.js';
import { freezeModel } from './lab-freeze.js';
import { hillModel } from './lab-hill.js';
import { pondResult } from './lab-pond3d.js';
import { seaModel } from '../scenes/sealevel-model.js';
import { glitterModel, RULES as GLITTER_RULES } from '../scenes/glitter-model.js';
import { materialRow } from '../scenes/material-model.js';
import { breadModel } from '../scenes/bread-model.js';
import { evapRow } from '../scenes/seawater-model.js';
import { rulerRow } from '../scenes/ruler-model.js';
import { moonRow } from '../scenes/moon-model.js';

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

test('해안 마을·반짝이 손: 3D 실험 기록(모형 값)으로 두 팀을 판정한다', () => {
  const sea = LAB_BATTLE_ROUNDS['c22-s42-u04'].map(round => round.targets.map(t => ({ ...seaModel(t.level, t.wall === '방파제 있음'), level: t.level })));
  assert.deepEqual(LAB_BATTLE_ROUNDS['c22-s42-u04'].map((round, i) => battleVerdict('c22-s42-u04', round, sea[i], [1, 1]).answers[0]), [2, 0, 1], '4 cm가 더 많이 · 방파제 없는 쪽이 더 많이 · 넘치면 같음');
  const gl = LAB_BATTLE_ROUNDS['c22-s32-u04'].map(round => round.targets.map(t => glitterModel(t.round, GLITTER_RULES.indexOf(t.rule))));
  assert.deepEqual(LAB_BATTLE_ROUNDS['c22-s32-u04'].map((round, i) => battleVerdict('c22-s32-u04', round, gl[i], [1, 1]).answers[0]), [0, 2, 1], '안 씻으면 더 많이 · 차례가 늘면 더 많이 · 씻으면 그대로');
  assert.equal(validBattleRow('c22-s42-u04', { ...sea[0][0], n: 3 }), false, '모형과 다른 수는 받지 않는다');
  assert.equal(validBattleRow('c22-s32-u04', { ...gl[0][0], rule: '물로만 씻기' }), false);
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

test('막대 네 개: 같은 시험에서 팀마다 맡은 막대를 비교한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['c22-s32-u01'], rows = (r) => r.targets.map((t) => materialRow(t.test));
  assert.deepEqual(rounds.map((r) => battleVerdict('c22-s32-u01', r, rows(r), [1, 1]).answers[0]), [0, 2, 2], '고무가 더 휨 · 나무가 더 들어감 · 무른 고무는 가라앉고 나무가 뜸');
  for (const r of rounds) assert.equal(r.targets[0].test, r.targets[1].test, '두 팀은 같은 시험');
  assert.equal(validBattleRow('c22-s32-u01', { ...materialRow('물에 넣기'), 고무: '떠요' }), false, '모형과 다른 기록은 받지 않는다');
  assert.equal(matchesBattleTarget('c22-s32-u01', materialRow('비춰 보기'), rounds[0].targets[0]), false, '다른 시험 기록은 고를 수 없다');
});

test('증발 접시: 팀마다 맡은 접시의 남은 양을 비교한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['c22-s32-u02'], rows = (r) => r.targets.map((t) => evapRow(t.ml));
  assert.deepEqual(rounds.map((r) => battleVerdict('c22-s32-u02', r, rows(r), [1, 1]).answers[0]), [0, 2, 1], '바닷물이 더 · 양이 많으면 더 · 같은 조건은 같음');
  assert.equal(validBattleRow('c22-s32-u02', { ...evapRow(20), 수돗물: '흰 알갱이 약 0.7 g' }), false);
  assert.equal(matchesBattleTarget('c22-s32-u02', evapRow(40), rounds[0].targets[0]), false, '다른 양의 기록은 고를 수 없다');
});

test('자 튕기기: 길이는 높낮이, 세기는 크기만 바꾼다', () => {
  const rounds = LAB_BATTLE_ROUNDS['c22-s32-u03'], rows = (r) => r.targets.map((t) => rulerRow(t.len, t.strength));
  assert.deepEqual(rounds.map((r) => battleVerdict('c22-s32-u03', r, rows(r), [1, 1]).answers[0]), [2, 0, 1], '짧은 자가 더 높음 · 세게가 더 큼 · 세게 튕겨도 높낮이는 같음');
  assert.equal(validBattleRow('c22-s32-u03', { ...rulerRow(15, '세게'), pitch: '높은 소리' }), false);
});

test('4-1 다양한 생물: 효모빵 배틀은 5-1과 같은 모형으로 판정한다', () => {
  const rounds = LAB_BATTLE_ROUNDS['s41-u04'], rows = (r) => r.targets.map((t) => ({ water: t.water, ...breadModel(t.water) }));
  assert.deepEqual(rounds.map((r) => battleVerdict('s41-u04', r, rows(r), [1, 1]).answers[0]), [2, 0, 1], '따뜻한 물이 더 · 너무 뜨거우면 덜 · 같은 조건은 같음');
});

test('같은 시각 달 관찰: 날이 지날수록 더 넓게 밝고 더 동쪽에 보인다', () => {
  const rounds = LAB_BATTLE_ROUNDS['c22-s42-u01'], rows = (r) => r.targets.map((t) => moonRow(t.day));
  assert.deepEqual(rounds.map((r) => battleVerdict('c22-s42-u01', r, rows(r), [1, 1]).answers[0]), [0, 2, 0], '7일이 더 밝음 · 15일이 더 동쪽 · 15일이 3일보다 동쪽');
  assert.equal(validBattleRow('c22-s42-u01', { ...moonRow(7), dir: '서쪽' }), false);
  assert.equal(validBattleRow('c22-s42-u01', moonRow(22)), false, '새벽 관찰은 저녁 배틀과 섞지 않는다');
});
