// 실제 측정값이 아닌 수평 실험의 이상화한 모형이다. 계산식은 학생의 정답 요구가 아니다.
export const FORCE_OBJECTS = Object.freeze({
  a: Object.freeze({ name: '물체 가', grams: 100 }),
  b: Object.freeze({ name: '물체 나', grams: 200 }),
  c: Object.freeze({ name: '물체 다', grams: 100 }),
});
export const FORCE_PAIRS = Object.freeze({ ab: ['a', 'b'], ac: ['a', 'c'], ba: ['b', 'a'] });
export const FORCE_PREDICTIONS = Object.freeze({ left: '왼쪽이 내려간다', right: '오른쪽이 내려간다', level: '수평을 이룬다' });
export const validForceSetup = (s) => s && Object.hasOwn(FORCE_PAIRS, s.pair) && ['left', 'right'].every((k) => Number.isInteger(s[k]) && s[k] >= 1 && s[k] <= 5);
export function forceBalance(s) {
  if (!validForceSetup(s)) throw Error('실험의 물체와 위치를 확인해 주세요.');
  const [left, right] = FORCE_PAIRS[s.pair].map((k) => FORCE_OBJECTS[k]);
  const l = left.grams * s.left, r = right.grams * s.right;
  const result = l === r ? 'level' : l > r ? 'left' : 'right';
  return { result, text: FORCE_PREDICTIONS[result], angle: Math.max(-0.28, Math.min(0.28, (l - r) / (l + r) * 0.65)), leftName: left.name, rightName: right.name };
}
export function forceRecord(setup, prediction) {
  if (!Object.hasOwn(FORCE_PREDICTIONS, prediction)) throw Error('관찰 전 예상을 먼저 골라 주세요.');
  const m = forceBalance(setup);
  return { kind: '수평 모형 실험', pair: setup.pair, left: setup.left, right: setup.right, leftName: m.leftName, rightName: m.rightName, prediction, result: m.result, observation: m.text };
}
export function validForceRow(r) {
  if (!validForceSetup(r) || !Object.hasOwn(FORCE_PREDICTIONS, r.prediction)) return false;
  const expected = forceRecord(r, r.prediction);
  return Object.keys(expected).every((k) => r[k] === expected[k]);
}
