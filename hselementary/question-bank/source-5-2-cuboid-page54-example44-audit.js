"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const item = require("./source-5-2-cuboid-page54-example44.js");
const q = item.makeQuestion();
const extrema = item.verifyExtrema();
assert.equal(item.definition.sourcePrintedPage, 54);
assert.equal((q.prompt.match(/class="source52-p54e44-diagram"/g) || []).length, 2);
assert.equal((q.prompt.match(/class="die"/g) || []).length, 8);
assert.equal(extrema.states, 24, "reject equal and opposite elbow faces");
for (const type of ["line", "bent"]) {
  const shape = item.shape(type);
  const dice = [...shape.matchAll(/<g class="die"[^>]*><polygon class="top" points="([^"]+)"\/><polygon class="front" points="([^"]+)"\/><polygon class="right" points="([^"]+)"\/>/g)];
  assert.equal(dice.length, 4);
  for (const [, top, front, right] of dice) {
    const t = top.split(" "), f = front.split(" "), r = right.split(" ");
    assert.deepEqual(t.slice(0, 2), f.slice(0, 2), "top shares front edge");
    assert.deepEqual([t[1], t[2]], r.slice(0, 2), "top shares right edge");
  }
}
assert.deepEqual(extrema.line, { min: 58, max: 68 });
assert.deepEqual(extrema.bent, { min: 58, max: 68 });
// Enumerate only rotations of one die, excluding its mirror image.
const keys = ["xp", "xn", "yp", "yn", "zp", "zn"];
const encode = d => keys.map(k => d[k]).join(",");
const rotations = [{ xp: 1, xn: 6, yp: 2, yn: 5, zp: 3, zn: 4 }];
const seen = new Set(rotations.map(encode));
for (let i = 0; i < rotations.length; i += 1) {
  const d = rotations[i];
  for (const next of [
    { xp: d.xp, xn: d.xn, yp: d.zn, yn: d.zp, zp: d.yp, zn: d.yn },
    { xp: d.zp, xn: d.zn, yp: d.yp, yn: d.yn, zp: d.xn, zn: d.xp }
  ]) if (!seen.has(encode(next))) { seen.add(encode(next)); rotations.push(next); }
}
assert.equal(rotations.length, 24, "a single die has 24 proper rotations");
function sameDieExtrema(coords) {
  const index = new Map(coords.map((point, i) => [point.join(","), i]));
  const edges = [];
  coords.forEach(([x, y], i) => {
    for (const [dx, dy, face, opposite] of [[1, 0, "xp", "xn"], [0, 1, "yp", "yn"]]) {
      const j = index.get(`${x + dx},${y + dy}`);
      if (j !== undefined) edges.push([i, face, j, opposite]);
    }
  });
  let valid = 0, min = Infinity, max = -Infinity;
  function visit(chosen) {
    const i = chosen.length;
    if (i === coords.length) {
      valid += 1;
      const outer = 84 - 2 * edges.reduce((sum, [left, face]) => sum + chosen[left][face], 0);
      min = Math.min(min, outer); max = Math.max(max, outer);
      return;
    }
    for (const die of rotations) {
      if (edges.some(([a, face, b, opposite]) => b === i && a < i && chosen[a][face] !== die[opposite])) continue;
      if (edges.some(([a, face, b, opposite]) => a === i && b < i && die[face] !== chosen[b][opposite])) continue;
      visit([...chosen, die]);
    }
  }
  visit([]);
  assert(valid > 0, "at least one matching-face arrangement exists");
  return { min, max };
}
assert.deepEqual(sameDieExtrema([[0, 0], [1, 0], [2, 0], [3, 0]]), { min: 58, max: 68 });
assert.deepEqual(sameDieExtrema([[0, 1], [1, 1], [2, 1], [0, 0]]), { min: 58, max: 68 });
assert.match(q.solution, /84−2×8=68/);
assert.match(q.solution, /84−2×13=58/);
assert.match(q.solution, /최댓값: \(가\) 68, \(나\) 68/);
assert.match(q.solution, /최솟값: \(가\) 58, \(나\) 58/);
assert.equal(q.answer, "최댓값: (가) 68, (나) 68; 최솟값: (가) 58, (나) 58");
assert.equal(q.verifiedVariantCount, 1);
assert.equal(q.generationMode, "fixed-verified-pool");
assert.equal(q.publisherKeyVerified, false);
assert.equal(q.handwrittenAnswerVerified, false);
const review = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u5-readiness-review.json"), "utf8")).items.find(row => row.sourceItemId === item.sourceItemId);
assert(review.conditions.includes("각 주사위에서 마주 보는 두 면의 눈 합 7"));
assert.match(review.independentCalculation, /모든 임의 조합이 가능한 것은 아니며/);
console.log("5-2 U5 p.54 Example 4-4 source shapes, legal contact-sum bounds, constructive extrema 68/58, fixed pool, and release lock audit passed.");
