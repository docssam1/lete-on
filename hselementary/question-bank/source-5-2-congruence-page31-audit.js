"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-congruence-page31.js");

const distance = (first, second) => Math.hypot(first.x-second.x, first.y-second.y);
const angleAt = (first, vertex, second) => {
  const a = { x: first.x-vertex.x, y: first.y-vertex.y };
  const b = { x: second.x-vertex.x, y: second.y-vertex.y };
  const cosine = (a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y));
  return Math.acos(Math.max(-1,Math.min(1,cosine))) * 180 / Math.PI;
};

const allTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
const sourceTypes = source.definitions.map(def => {
  const type = allTypes.find(item => item.id === def.sourceItemId);
  assert.ok(type, `missing curriculum type: ${def.sourceItemId}`);
  assert.equal(type.sourceItemId, def.sourceItemId);
  assert.equal(type.generatorKey, def.generatorKey);
  assert.equal(type.reviewLocked, !def.publicReady);
  return type;
});

let combinations = 0;
for (const def of source.definitions) {
  for (let variant = 0; variant < 3; variant += 1) {
    for (const difficultyOffset of [-1, 0, 1]) {
      const item = source.getQuestion(def.sourceItemId, variant, difficultyOffset);
      assert.ok(item, `no question ${def.sourceItemId} / ${variant} / ${difficultyOffset}`);
      assert.equal(item.sourceItemId, def.sourceItemId);
      assert.equal(item.verifiedVariantCount, 3);
      assert.equal(item.verifiedPoolIndex, variant);
      assert.equal(item.difficultyOffset, difficultyOffset);
      assert.equal(item.answerVisualStatus, "verified-reconstruction");
      assert.match(item.answerVisual, /<svg[\s\S]*<\/svg>/);
      assert.match(item.prompt, /<svg[\s\S]*<\/svg>/);
      assert.doesNotMatch(item.prompt, /data-source-answer|정답은|답은/);
      assert.match(item.solution, /data-source-answer/);

      if (def.sourceItemId.endsWith("mission-1")) {
        const { alpha, beta, answer } = item.answerModel;
        assert.equal(alpha + beta, 45);
        assert.ok(beta > alpha && alpha < 22.5, "The fixed pool keeps B between R and S");
        assert.equal(answer, 2 * alpha);
        assert.notEqual(alpha, 20);
        assert.notEqual(beta, 25);
        assert.match(item.solution, /두 변 사이의 각|두 변과 그 사이의 각/);
        assert.doesNotMatch(item.solution, /tan\(|탄젠트/);
        const tangent = value => Math.tan(value * Math.PI / 180);
        const g = { x: 0, y: 1 }, n = { x: 1, y: 1 }, d = { x: 1, y: 0 }, r = { x: 0, y: 0 };
        const m = { x: 0, y: 1-tangent(alpha) };
        const b = { x: 1-tangent(beta), y: 0 };
        const s = { x: 1-tangent(alpha), y: 0 };
        const e = { x: 0, y: 1+tangent(beta) };
        assert.ok(r.x < b.x && b.x < s.x && s.x < d.x, "B lies between R and S for all public variants");
        assert.ok(Math.abs(distance(n,b)-distance(n,e)) < 1e-9, "The first SAS construction transfers NB=NE");
        assert.ok(Math.abs(angleAt(b,n,m)-45) < 1e-9);
        assert.ok(Math.abs(angleAt(m,n,e)-45) < 1e-9);
        assert.ok(Math.abs(angleAt(r,m,b)-answer) < 1e-8);
      } else if (def.sourceItemId.endsWith("mission-2")) {
        const { vertexAngle, centralArc, equalArc, answer } = item.answerModel;
        assert.ok(Math.abs(centralArc - (180 - 2 * vertexAngle)) < 1e-9);
        assert.ok(Math.abs(3 * equalArc + centralArc - 180) < 1e-9);
        assert.ok(Math.abs(answer - (360 - centralArc - equalArc) / 2) < 1e-9);
        assert.notEqual(vertexAngle, 60);
        assert.notEqual(answer, 130);
      } else {
        const { targetAngle, rotationDegrees } = item.answerModel;
        assert.equal(rotationDegrees, 60);
        assert.notEqual(targetAngle, 140);
        const d = { x: 0, y: 0 };
        const dm = 1;
        const delta = 10;
        const dn = dm * Math.sin(targetAngle * Math.PI / 180) / Math.sin((targetAngle + delta) * Math.PI / 180);
        const n = { x: dn, y: 0 };
        const m = { x: dm * Math.cos(delta * Math.PI / 180), y: dm * Math.sin(delta * Math.PI / 180) };
        const u = { x: n.x - m.x, y: n.y - m.y };
        const v = { x: d.x - m.x, y: d.y - m.y };
        const angle = Math.acos((u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y))) * 180 / Math.PI;
        assert.ok(Math.abs(angle - targetAngle) < 1e-8);
      }
      combinations += 1;
    }
  }
}

assert.equal(source.getQuestion("unknown", 0, 0), null);
assert.equal(source.getQuestion(source.definitions[0].sourceItemId, 3, 0), null);
assert.equal(source.getQuestion(source.definitions[0].sourceItemId, 0, 2), null);
for (const type of sourceTypes) {
  assert.equal(window.HSE_GENERATORS.generatorKey(type), type.generatorKey);
  for (let variant = 0; variant < 3; variant += 1) {
    for (const difficultyOffset of [-1, 0, 1]) {
      const generated = window.HSE_GENERATORS.generate(type, 1, difficultyOffset, "audit", variant);
      assert.ok(generated, `HSE_GENERATORS rejected ${type.id}`);
      assert.equal(generated.sourceItemId, type.sourceItemId);
    }
  }
}

console.log(`인쇄 31쪽 합동·대칭 Mission 감사 통과: 3문항 · ${combinations}개 조합 · SAS 풀이 검증 · 공개 후보 3`);
