// 그림자 실험실 모형과 두 팀 대결 판정 — node --test science-lab/v2/*.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { shadowModel } from './lab-shadow.js';
import { LAB_BATTLE_ROUNDS, battleVerdict, validBattleRow } from './lab-battle-model.js';
import { judgeText } from './judge.js';
import { judge } from '../data/units/s42-u03.judge.js';

test('손전등은 가까울수록 크고, 햇빛은 위치와 상관없이 같고, 투명한 물체는 그림자가 거의 없다', () => {
  const near = shadowModel('손전등', '종이 인형', '빛 가까이').size, mid = shadowModel('손전등', '종이 인형', '가운데').size, far = shadowModel('손전등', '종이 인형', '스크린 가까이').size;
  assert.ok(near > mid && mid > far, `${near} > ${mid} > ${far}`);
  const sun = ['빛 가까이', '가운데', '스크린 가까이'].map((p) => shadowModel('햇빛', '종이 인형', p).size);
  assert.equal(new Set(sun).size, 1);
  assert.ok(far > sun[0], '손전등 그림자는 물체보다 크다');
  assert.equal(shadowModel('손전등', '투명 필름 인형', '빛 가까이').size, 0);
  assert.throws(() => shadowModel('촛불', '종이 인형', '가운데'), RangeError);
});
test('대결 세 라운드를 기록으로 판정한다(위치: 2팀 · 빛: 1팀 · 햇빛 위치: 같음)', () => {
  const rounds = LAB_BATTLE_ROUNDS['s42-u03'], answers = [2, 0, 1];
  rounds.forEach((round, i) => {
    const rows = round.targets.map((t) => ({ ...t, ...shadowModel(t.light, t.object, t.place) }));
    assert.deepEqual(battleVerdict('s42-u03', round, rows, [answers[i], answers[i]]).ok, [true, true], round.title);
    assert.deepEqual(battleVerdict('s42-u03', round, rows, [(answers[i] + 1) % 3, (answers[i] + 1) % 3]).ok, [false, false]);
  });
  const r = { ...rounds[0].targets[0], ...shadowModel('손전등', '종이 인형', '스크린 가까이') };
  assert.equal(validBattleRow('s42-u03', { ...r, size: 99 }), false);
  assert.equal(validBattleRow('s42-u03', { ...r, light: '촛불' }), false);
  assert.equal(battleVerdict('s42-u03', rounds[0], [r, null], [2, 2]), null);
});
test('가설은 틀린 예상도 조건과 결과를 이으면 통과, 「가까우면 작아진다」 결론은 통과하지 않는다', () => {
  assert.equal(judgeText('물체를 스크린 쪽으로 옮기면 그림자가 커질 것이다.', judge['deck:hypo']).st, 'ok');
  assert.notEqual(judgeText('물체가 손전등에 가까우면 그림자가 작아진다.', judge['deck:concl0']).st, 'ok');
  assert.notEqual(judgeText('거울 속 글자는 위아래가 뒤집힌다.', judge['s42-u03-b09']).st, 'ok');
});
