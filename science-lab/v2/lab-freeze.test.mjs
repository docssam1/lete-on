import test from 'node:test';
import assert from 'node:assert/strict';
import { TUBE, TUBE_STEPS, tubeRows, tubeReading, freezeModel } from './lab-freeze.js';
import { freezeLesson as lesson } from '../data/units/s41-u02.lesson.js';   // 시험관 수업(main에서 기본 수업이 탐구 기록형 lesson으로 바뀌어 이름을 따로 가리킨다)

const rec = (step, height, mass) => ({ step, height, mass });
const three = [rec('처음 물', TUBE.water, TUBE.mass), rec('다 언 얼음', TUBE.ice, TUBE.mass), rec('다 녹은 물', TUBE.water, TUBE.mass)];

test('시험관 모형 값은 교재 그림의 예시와 같다(얼음 = 물 × 1.1, 닦기 전만 더 무거움)', () => {
  assert.equal(TUBE.water, 4.0);
  assert.equal(Math.round(TUBE.water * 1.1 * 10) / 10, TUBE.ice);
  assert.equal(TUBE.mass, 32.5);
  assert.ok(TUBE.wet > TUBE.mass);
});

test('세 기록은 단계별로 따로 남고, 예전 병 기록은 섞이지 않는다', () => {
  const mixed = [{ state: '물', ml: 100, height: 10, mass: 120 }, three[2], three[0]];
  assert.deepEqual(tubeRows(mixed), [three[0], null, three[2]]);
  assert.deepEqual(tubeRows(three).map((r) => r.step), TUBE_STEPS);
});

test('비교 문장은 학생 기록에서만 나온다', () => {
  assert.equal(tubeReading(three.slice(0, 2)), null);
  const r = tubeReading(three);
  assert.match(r.h, /4\.0 → 4\.4 → 4\.0 cm/);
  assert.match(r.g, /세 번 모두 같아요/);
  assert.deepEqual([r.hDir, r.mDir], [1, 0]);
  const odd = tubeReading([rec('처음 물', 4, 32.5), rec('다 언 얼음', 4, 33.1), rec('다 녹은 물', 4, 32.5)]);
  assert.deepEqual([odd.hDir, odd.mDir], [0, 1]);
  assert.match(odd.g, /서로 달라요/);
});

test('개념 정리(fromData)·보고서 줄·표 칸이 시험관 기록 모양을 따른다', () => {
  assert.deepEqual(lesson.explore.lab.columns, ['단계', '높이(cm)', '무게(g)']);
  assert.deepEqual(Object.keys(three[0]), ['step', 'height', 'mass']);   // 덱의 「내 3D 실험 기록」은 키 순서대로 칸을 채운다
  assert.equal(lesson.explore.lab.rowText(three[1]), '다 언 얼음 → 높이 4.4 cm, 무게 32.5 g');
  assert.match(lesson.explain.fromData(three), /4\.0 cm에서 4\.4 cm로 늘었고, 무게는 32\.5 g으로 같았어요\. 다 녹은 물은 높이 4\.0 cm/);
  assert.match(lesson.explain.fromData([{ state: '물', ml: 100, height: 10, mass: 120 }]), /시험관 실험에서/);
  assert.equal(lesson.explain.fromData([]), '');
});

test('병 실험 모형(추가 탐구·배틀)은 그대로', () => {
  assert.deepEqual(freezeModel(100, false), { height: 10, mass: 120 });
  assert.deepEqual(freezeModel(140, true), { height: 15.4, mass: 160 });
});
