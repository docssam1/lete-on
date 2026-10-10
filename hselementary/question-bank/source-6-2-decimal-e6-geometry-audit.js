"use strict";
const assert = require("node:assert/strict");
const { IDS, pools, stairFacts, stairModel, pondFacts, pondModel, generate } = require("./source-6-2-decimal-e6-geometry.js");
const near = (a, b) => assert.ok(Math.abs(a - b) < 0.000001, `${a} != ${b}`);
const fmt = n => String(Math.round(n * 1000000) / 1000000);
let candidatesChecked = 0;
for (let pool = 0; pool < 3; pool++) {
  const d = pools[0][pool], f = stairFacts(d), m = stairModel(d), r = d.rate / 100;
  let reverse = f.final - d.steps[2];
  reverse = reverse / r - d.steps[1];
  near(reverse, f.bounce2);
  reverse = reverse / r - d.steps[0];
  reverse /= r;
  near(reverse, d.initial);
  const solutions = [];
  for (let hundredths = 1; hundredths <= 50000; hundredths++) {
    candidatesChecked++;
    const first = hundredths / 100 * r;
    const second = (first + d.steps[0]) * r;
    const third = (second + d.steps[1]) * r;
    if (Math.abs(third + d.steps[2] - f.final) < 1e-8) solutions.push(hundredths / 100);
  }
  assert.deepEqual(solutions, [d.initial]);
  assert.ok(r > 0); // The forward map is strictly increasing, also proving uniqueness over real heights.
  m.arcs.forEach((a, i) => {
    near(a.apex.z - a.start.z, [f.bounce1, f.bounce2, f.bounce3][i]);
    const t = (a.apex.x - a.start.x) / (a.end.x - a.start.x);
    const atY = (1 - t) * (1 - t) * a.start.y + 2 * t * (1 - t) * a.control.y + t * t * a.end.y;
    near(atY, a.apex.y);
    assert.ok(a.apex.y > 0 && a.apex.y < 331);
  });
  near(m.arcs[2].apex.z, f.final);
  const pond = pools[1][pool], p = pondFacts(pond), pm = pondModel(pond);
  assert.ok(pond.b > pond.a);
  near(p.gap / ((pond.b - pond.a) / 100), pond.length);
  near(pm.rods[0].bottom - pm.rods[0].top, pm.rods[1].bottom - pm.rods[1].top);
  near((pm.rods[0].bottom - pm.waterY) / 235, pond.a / 100);
  near((pm.rods[1].bottom - pm.waterY) / 235, pond.b / 100);
  near((pm.rods[1].top - pm.rods[0].top) / pm.scale, p.gap);
  let pondSolutions = 0;
  for (let length = 1; length <= 50000; length++) {
    candidatesChecked++;
    if (Math.abs(length / 100 * (pond.b - pond.a) / 100 - p.gap) < 1e-8) pondSolutions++;
  }
  assert.equal(pondSolutions, 1);
  for (let level = 0; level < 3; level++) {
    for (let i = 0; i < IDS.length; i++) {
      const q = generate(i, level, pool);
      assert.equal(q.verifiedPoolIndex, pool);
      assert.equal(q.sourceItemId, IDS[i]);
      assert.match(q.prompt, /data-phase="problem"/);
      assert.match(q.answerVisual, /data-phase="answer"/);
      assert.ok(!q.prompt.includes("data-answer="));
      assert.ok(!q.prompt.includes("source61-math-board"));
      const expected = i === 0 ? level === 0 ? `${fmt(f.final)}cm` : level === 2 ? `처음 ${d.initial}cm, 바닥에서 처음 공까지 ${d.initial + d.steps.reduce((sum, step) => sum + step, 0)}cm` : `${d.initial}cm`
        : `${fmt(level === 2 ? (p.depthA + p.depthB) / 2 : p.depthA)}cm`;
      assert.equal(q.answer, expected);
    }
  }
}
assert.equal(generate(0, 1, 0).answer, "180cm");
assert.equal(generate(1, 1, 0).answer, "180cm");
console.log(`E6 그림 2유형, 18문항, ${candidatesChecked}개 후보 및 좌표/높이 독립 검증 통과`);
