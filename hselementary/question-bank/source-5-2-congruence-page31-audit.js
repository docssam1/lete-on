"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-congruence-page31.js");

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
        const t = Math.tan(alpha * Math.PI / 180);
        const actual = Math.atan((1 - Math.tan(beta * Math.PI / 180)) / (1 - t)) * 180 / Math.PI;
        assert.ok(Math.abs(actual - answer) < 1e-9);
        assert.notEqual(alpha, 20);
        assert.notEqual(beta, 25);
        assert.notEqual(answer, 40);
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
assert.equal(window.HSE_GENERATORS.generatorKey(sourceTypes[0]), "");
assert.equal(window.HSE_GENERATORS.generate(sourceTypes[0], 1, 0, "audit", 0), null, "Mission 1 remains locked until an elementary-level explanation is verified");
for (const type of sourceTypes.slice(1)) {
  assert.equal(window.HSE_GENERATORS.generatorKey(type), type.generatorKey);
  for (let variant = 0; variant < 3; variant += 1) {
    for (const difficultyOffset of [-1, 0, 1]) {
      const generated = window.HSE_GENERATORS.generate(type, 1, difficultyOffset, "audit", variant);
      assert.ok(generated, `HSE_GENERATORS rejected ${type.id}`);
      assert.equal(generated.sourceItemId, type.sourceItemId);
    }
  }
}

console.log(`인쇄 31쪽 합동·대칭 Mission 감사 통과: 3문항 · ${combinations}개 조합 · 공개 2 · 풀이 미검증 잠금 1`);
