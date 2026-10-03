"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
for (const file of ["source-inventory-4-1.js", "source-inventory-grade6.js", "curriculum.js", "generators.js", "source-6-2-height-views.js"]) require(`./${file}`);
const api = window.HSE_GENERATORS, heightApi = window.HSE_SOURCE_GRADE6_HEIGHT_VIEWS;
const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/6-2-u3-e1-readiness-review.json"), "utf8"));
const raw = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/6-2-source-items.json"), "utf8"));
assert.equal(readiness.items.length,11);
assert.equal(new Set(readiness.items.map(i=>i.sourceItemId)).size,11);
assert.equal(readiness.items.filter(i=>i.releaseStatus === "verified").length,2);
const originals = {
  "6-2-u3-e1-exploration": [[0,0,0,0,0,0],[0,0,1,0,0,0],[0,2,3,4,1,0],[1,1,2,2,0,0],[0,0,0,1,0,0],[0,0,0,0,0,0]],
  "6-2-u3-e1-example-3": [[1,3,3],[2,1,2]]
};
const axes = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function cubes(h) {
  return h.flatMap((row, y) => row.flatMap((height, x) => Array.from({ length: height }, (_, z) => [x,y,z])));
}
function countFaces(h, includeBottom = false) {
  const cells = cubes(h), occupied = new Set(cells.map(c => c.join(",")));
  return cells.reduce((s, [x,y,z]) => s + axes.filter(([dx,dy,dz]) => (includeBottom || dz !== -1 || z !== 0) && !occupied.has([x+dx,y+dy,z+dz].join(","))).length, 0);
}
function projectCubes(h) {
  const cells = cubes(h), cols = h[0].length, rows = h.length;
  const projection = (index, size) => Array.from({ length: size }, (_, i) => {
    const zs = cells.filter(c => index(c) === i).map(c => c[2] + 1);
    return zs.length ? Math.max(...zs) : 0;
  });
  return { front: projection(c => c[0], cols), back: projection(c => cols - 1 - c[0], cols), left: projection(c => c[1], rows), right: projection(c => rows - 1 - c[1], rows) };
}
// Independently read the learner figure, not the producer's answer/model fields.
function readHeightFigure(prompt) {
  const chart = prompt.match(/<svg[^>]*aria-label="(?:앞쪽이 아래에 표시된 바닥 칸별 높이표|칸마다 쌓인 쌓기나무 수를 적은 위에서 본 그림)"[^>]*>([\s\S]*?)<\/svg>/);
  assert(chart, "Missing problem height chart");
  const grid = [...chart[1].matchAll(/<line class="height-grid" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)];
  const xs = new Set(), ys = new Set();
  for (const [, x1,y1,x2,y2] of grid) { if (x1 === x2) xs.add(+x1); if (y1 === y2) ys.add(+y1); }
  const h = Array.from({ length: ys.size - 1 }, () => Array(xs.size - 1).fill(0));
  let hidden = null;
  for (const [, y,x,value] of chart[1].matchAll(/<text[^>]*data-owner-id="cell-(\d+)-(\d+)"[^>]*>([^<]+)<\/text>/g)) {
    if (value === "□") hidden = [+y,+x]; else h[+y][+x] = +value;
  }
  if (hidden) {
    const count = +prompt.match(/모두 (\d+)개입니다/)[1];
    const candidates = [];
    for (let n = 1; n <= count; n++) if (h.flat().reduce((s,v) => s+v, 0) + n === count) candidates.push(n);
    assert.equal(candidates.length, 1, "Missing height must have exactly one answer");
    h[hidden[0]][hidden[1]] = candidates[0];
  }
  return h;
}
let conditions = 0, projectionChecks = 0, faceChecks = 0, negativeChecks = 0;
for (const d of heightApi.definitions) {
  const type = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(t => t.sourceItemId === d.sourceItemId);
  const ledger = raw.items.find(t=>t.sourceItemId === d.sourceItemId);
  const review = readiness.items.find(t=>t.sourceItemId === d.sourceItemId);
  assert(ledger.sourceVerified && ledger.implementationStatus === "fixed-verified-pool");
  assert.equal(review.generatorKey,d.key);
  assert.equal(review.releaseStatus,"verified");
  assert(type && !type.reviewLocked && type.answerVisualStatus === "verified");
  assert.equal(api.generatorKey(type), d.key);
  assert.equal(api.generate({ ...type, reviewLocked: true }, 0, 0, 1, 0), null);
  for (const offset of [-1,0,1]) for (let v = 0; v < 3; v++) {
    const q = api.generate(type, 0, offset, 99, v);
    const h = readHeightFigure(q.prompt);
    assert.deepEqual(h, d.pools[v]);
    if (v === 0 && offset === 0) assert.deepEqual(h, originals[d.sourceItemId]);
    assert.equal(q.variantProvenance, v === 0 && offset === 0 ? "source-values" : "source-structure-variant");
    assert(q.answerVisual.includes('data-phase="answer"'));
    assert(!/data-model|data-answer-source|data-phase="answer"/.test(q.prompt));
    assert.equal(q.verifiedVariantCount, 3);
    assert.deepEqual(api.generate(type, 0, offset, 100, v + 3).answer, q.answer);
    assert.equal(api.generate(type, 0, offset, 100, Number.MAX_SAFE_INTEGER).answer, api.generate(type, 0, offset, 100, Number.MAX_SAFE_INTEGER % 3).answer);
    if (d.kind === "four-views") {
      const expected = projectCubes(h), labels = { front: "앞쪽", back: "뒤쪽", left: "왼쪽", right: "오른쪽" };
      assert.deepEqual(heightApi.views(h), expected);
      assert.equal(q.answer, "그림 참조");
      const figures = [...q.answerVisual.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)];
      assert.equal(figures.length, 4);
      for (const [index, [key, values]] of Object.entries(expected).entries()) {
        const body = figures[index][1];
        assert(body.includes(`>${labels[key]}</text>`));
        const counts = values.map(() => 0);
        for (const [, x] of body.matchAll(/<rect class="height-answer-cell"[^>]* x="([\d.]+)"/g)) counts[(+x - 18)/27]++;
        assert.deepEqual(counts, values, "Answer drawing does not match independently projected cubes");
      }
      for (const values of Object.values(expected)) assert(values.every(Number.isInteger));
      projectionChecks++;
    } else {
      assert.equal(q.answer, `${countFaces(h)}cm²`);
      assert.equal(heightApi.exposed(h).area, countFaces(h));
      assert.equal(heightApi.exposed(h, true).area, countFaces(h, true));
      assert(q.prompt.includes("밑면을 제외"));
      assert(q.solution.endsWith("밑면은 더하지 않습니다."));
      const cells = cubes(h), occupied = new Set(cells.map(c=>c.join(",")));
      const faceDirections = [[0,0,1],[0,1,0],[0,-1,0],[-1,0,0],[1,0,0]];
      const expectedCounts = faceDirections.map(([dx,dy,dz]) => cells.filter(([x,y,z]) => !occupied.has([x+dx,y+dy,z+dz].join(","))).length);
      const figures = [...q.answerVisual.matchAll(/<svg[^>]*>([\s\S]*?)<\/svg>/g)];
      assert.equal(figures.length,5);
      assert.deepEqual(figures.map(f=>(f[1].match(/<rect class="height-answer-cell"/g) || []).length), expectedCounts);
      faceChecks++;
    }
    conditions++;
  }
  for (const bad of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => api.generate(type,0,0,1,bad)); negativeChecks++;
  }
  for (const bad of [-2,2,"0",NaN]) { assert.throws(() => api.generate(type,0,bad,1,0)); negativeChecks++; }
}
assert.deepEqual(projectCubes(originals["6-2-u3-e1-exploration"]), { front: [1,2,3,4,1,0], back: [0,1,4,3,2,1], left: [0,1,4,2,1,0], right: [0,1,2,4,1,0] });
assert.equal(countFaces(originals["6-2-u3-e1-example-3"]), 34);
const candidates = [];
// Two exposed opposite boundaries bound each unknown by target/2.
for (let a = 0; a <= 17; a++) for (let b = 0; b <= 17; b++) if (countFaces([[1,a,2],[b,2,2]],true) === 34) candidates.push({ a,b,sum:a+b });
assert.deepEqual(candidates, [{ a:3,b:1,sum:4 }]);
const mission4 = window.HSE_SOURCE_INVENTORY_GRADE6.items.find(t => t.sourceItemId === "6-2-u3-e1-mission-4");
assert(mission4.reviewLocked);
assert.equal(api.generatorKey(mission4), "");
assert.equal(readiness.items.find(i=>i.sourceItemId === mission4.sourceItemId).requestedOperation,"sum-not-product");
// A hollow step must differ from the same outer silhouette.
for (const h of [[[3,1,3],[3,3,3]], [[0,2],[1,0]], [[1,1],[1,1]]]) {
  assert.equal(heightApi.exposed(h).area, countFaces(h));
  assert.deepEqual(heightApi.views(h), projectCubes(h));
  negativeChecks++;
}
if (process.env.HSE_HEIGHT_AUDIT_OUTPUT) {
  assert(/^[EG]:[/\\]/i.test(process.env.HSE_HEIGHT_AUDIT_OUTPUT));
  fs.writeFileSync(process.env.HSE_HEIGHT_AUDIT_OUTPUT, JSON.stringify({ conditions, projectionChecks, faceChecks, negativeChecks, mission4: { candidates, release: "locked-unimplemented" } }, null, 2));
}
console.log(`Height views: ${conditions} fixed conditions; ${projectionChecks} voxel projections; ${faceChecks} independent surface checks; ${negativeChecks} negative inputs/geometry cases. Mission 4 asks for the sum: 3+1=4; stays locked until implementation/render verification.`);
