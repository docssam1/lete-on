// 수업 화면 고르기 활동 데이터(data/book/<u>.interact.js) 검사 — node --test science-lab/bank/*.test.mjs
// 고르기는 누르면 끝이라 데이터가 틀리면 아이가 틀린 것을 맞았다고 배운다. 형식과 정답 자리 치우침을 못 박는다.
import test from 'node:test';
import assert from 'node:assert/strict';

const U = ['s41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03'];
const mc = (x, where, n = 3) => {
  assert.ok(x?.q?.trim(), `${where}: q`);
  assert.equal(x.options?.length, n, `${where}: 보기 ${n}개`);
  assert.ok(x.options.every((o) => typeof o === 'string' && o.trim()), `${where}: 빈 보기`);
  assert.equal(new Set(x.options).size, n, `${where}: 같은 보기`);
  assert.ok(Number.isInteger(x.answer) && x.answer >= 0 && x.answer < n, `${where}: answer`);
};

for (const u of U) {
  test(`${u} 고르기 활동`, async () => {
    const { interact: X } = await import(`../data/book/${u}.interact.js`);
    mc(X.predict, 'predict'); assert.ok(X.predict.result?.trim(), 'predict.result');
    assert.equal(X.design?.length, 3, 'design 3칸');
    assert.deepEqual(X.design.map((d) => d.k), ['change', 'same', 'measure']);
    X.design.forEach((d) => { mc(d, `design.${d.k}`); assert.ok(d.hint?.trim(), `design.${d.k}.hint`); });
    mc(X.recall, 'recall'); assert.ok(X.recall.why?.trim(), 'recall.why');
    const L = X.learned;
    assert.ok(L?.q && L.options?.length >= 4 && L.options.length <= 6, 'learned 보기 4~6개');
    assert.ok(L.answers?.length >= 2 && L.answers.length < L.options.length, 'learned 정답 2개 이상, 전부는 아님');
    assert.ok(L.answers.every((a) => Number.isInteger(a) && a >= 0 && a < L.options.length), 'learned answers 범위');
    // 한 단원 안의 단일 정답 5개(predict·design 3·recall)가 한 자리에 몰리지 않게 — 세 자리 중 최소 두 곳
    const pos = [X.predict.answer, ...X.design.map((d) => d.answer), X.recall.answer];
    assert.ok(new Set(pos).size >= 2, `정답 자리가 모두 ${pos[0]}번`);
    // 정답 보기가 늘 가장 긴 보기면 읽지 않고도 맞힌다
    const longest = [X.predict, ...X.design, X.recall].filter((x) => { const L2 = x.options.map((o) => o.length), m = Math.max(...L2); return L2[x.answer] === m && L2.filter((l) => l === m).length === 1; }).length;
    assert.ok(longest <= 3, `정답이 유일한 최장 보기인 문항이 ${longest}/5`);
  });
}
