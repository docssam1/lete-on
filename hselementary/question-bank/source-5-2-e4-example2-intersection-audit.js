"use strict";

// Independently construct the figure by intersecting two rays, then measure angles.
const assert = require("node:assert/strict");
const api = require("./source-5-2-congruence-page31.js");
const rad = n => n * Math.PI / 180;
const cross = (a, b) => a.x * b.y - a.y * b.x;
const angle = (p, a, b) => {
  const u = {x: a.x - p.x, y: a.y - p.y};
  const v = {x: b.x - p.x, y: b.y - p.y};
  return Math.atan2(Math.abs(cross(u, v)), u.x * v.x + u.y * v.y) * 180 / Math.PI;
};
const near = (actual, expected, label) => assert.ok(Math.abs(actual - expected) < 0.01, `${label}: ${actual} vs ${expected}`);

function construct(alpha, beta) {
  const n = {x: 0, y: 0}, d = {x: 1, y: 0}, g = {x: 0.5, y: -Math.sqrt(3) / 2};
  const u = {x: Math.cos(rad(alpha)), y: Math.sin(rad(alpha))};
  const v = {x: -Math.cos(rad(beta)), y: Math.sin(rad(beta))};
  const t = cross(d, v) / cross(u, v);
  const r = {x: t * u.x, y: t * u.y};
  const m = {x: r.x * 0.5 + r.y * Math.sqrt(3) / 2, y: -r.x * Math.sqrt(3) / 2 + r.y * 0.5};
  assert.ok(t > 0 && cross(d, u) / cross(u, v) > 0, "intersection lies on both rays");
  near(angle(n, g, m), alpha, "given angle at ㄴ");
  near(angle(d, n, r), beta, "given angle at ㄷ");
  near(angle(n, m, r), 60, "inner equilateral triangle");
  near(angle(m, n, g), angle(r, n, d), "corresponding angles from congruent triangles");
  return angle(m, n, g);
}

near(construct(35, 20), 125, "original source answer");
for (let variant = 0; variant < 3; variant++) {
  for (const offset of [-1, 0, 1]) {
    const item = api.getQuestion("5-2-u3-e4-example-2", variant, offset);
    const measured = construct(item.answerModel.alpha, item.answerModel.beta);
    near(measured, Number.parseFloat(item.answer), `generated ${variant}/${offset}`);
    const svg = item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
    assert.ok(svg);
    const readPoint = key => { const [x,y] = svg.match(new RegExp(`data-${key}="([^"]+)"`))[1].split(",").map(Number); return {x,y}; };
    const n = readPoint("n"), d = readPoint("d"), g = readPoint("g"), m = readPoint("m"), r = readPoint("r");
    near(angle(n,g,m),item.answerModel.alpha,"rendered angle at ㄴ");
    near(angle(d,n,r),item.answerModel.beta,"rendered angle at ㄷ");
    near(angle(m,n,g),measured,"rendered target angle");
    assert.notDeepEqual([item.answerModel.alpha,item.answerModel.beta],[35,20],"practice must differ from source values");
  }
}
console.log("Example 4-2 independent ray intersection passed: original and nine generated configurations.");
