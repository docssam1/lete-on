"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-cuboid-page55-mission6.js");
const type = window.HSE_CURRICULUM.semesters.find(x => x.id === "5-2")?.units.find(x => x.id === "5-2-u5")?.subunits.find(x => x.name === "주사위에 관한 문제 ①")?.types.find(x => x.sourceItemId === source.definition.sourceItemId);
assert(type, "source type exists in the dice-arrangement subunit");
assert.equal(type.reviewLocked, false, "source is unlocked after responsive and A4 review");
assert.equal(type.generationMode, "fixed-verified-pool");
assert.equal(type.verifiedVariantCount, 1);
assert.equal(window.HSE_GENERATORS.generatorKey(type), source.definition.generatorKey);

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map(rest => [value, ...rest]));
}
const orientations = permutations([1, 2, 3, 4, 5, 6]).filter(v => v[0] + v[1] === 7 && v[2] + v[3] === 7 && v[4] + v[5] === 7)
  .map(v => ({ xp: v[0], xn: v[1], yp: v[2], yn: v[3], zp: v[4], zn: v[5] }));
assert.equal(orientations.length, 48, "all legal labeled face orientations are enumerated");
function exhaustive(shape, candidateOrientations = orientations) {
  const coords = source.shapes[shape].coords;
  const index = new Map(coords.map((point, i) => [point.join(","), i]));
  const edges = [];
  coords.forEach(([x, y], i) => {
    for (const [dx, dy, face, opposite] of [[1, 0, "xp", "xn"], [0, 1, "yp", "yn"]]) {
      const j = index.get(`${x + dx},${y + dy}`);
      if (j !== undefined) edges.push([i, face, j, opposite]);
    }
  });
  let valid = 0, min = Infinity;
  function visit(position, chosen) {
    if (position === coords.length) {
      valid += 1;
      const contactSum = edges.reduce((sum, [i, face]) => sum + chosen[i][face], 0);
      min = Math.min(min, contactSum);
      return;
    }
    for (const orientation of candidateOrientations) {
      if (edges.some(([i, face, j, opposite]) => j === position && i < position && chosen[i][face] !== orientation[opposite])) continue;
      if (edges.some(([i, face, j, opposite]) => i === position && j < position && orientation[face] !== chosen[j][opposite])) continue;
      visit(position + 1, [...chosen, orientation]);
    }
  }
  visit(0, []);
  return { valid, min, maximumOuter: 84 - 2 * min };
}
const square = exhaustive("square");
const zigzag = exhaustive("zigzag");
assert.deepEqual(square, { valid: 4608, min: 6, maximumOuter: 72 });
assert.deepEqual(zigzag, { valid: 24576, min: 4, maximumOuter: 76 });
// Rotations preserve chirality; the 48 opposite-pair assignments above also include mirror images.
const keys = ["xp", "xn", "yp", "yn", "zp", "zn"];
const encode = die => keys.map(key => die[key]).join(",");
const rotations = [source.witnesses.square[0]];
const seenRotations = new Set(rotations.map(encode));
for (let i = 0; i < rotations.length; i += 1) {
  const d = rotations[i];
  for (const next of [
    { xp: d.xp, xn: d.xn, yp: d.zn, yn: d.zp, zp: d.yp, zn: d.yn },
    { xp: d.zp, xn: d.zn, yp: d.yp, yn: d.yn, zp: d.xn, zn: d.xp }
  ]) {
    if (!seenRotations.has(encode(next))) { seenRotations.add(encode(next)); rotations.push(next); }
  }
}
assert.equal(rotations.length, 24, "one standard die has 24 proper rotations");
for (const assignment of Object.values(source.witnesses).flat()) assert(seenRotations.has(encode(assignment)), "witness uses a rotation of the same die");
for (const [shape, minimum] of [["square", 6], ["zigzag", 4]]) {
  const sameDice = exhaustive(shape, rotations);
  assert(sameDice.valid > 0);
  assert.equal(sameDice.min, minimum, `${shape} minimum is attainable with identically oriented dice rotated in space`);
}
const model = source.verifyStructure();
assert.deepEqual(model, { sourceItemId: "5-2-u5-e4-mission-6", totalPips: 84, squareContactMin: 6, squareOuterMax: 72, zigzagContactMin: 4, zigzagOuterMax: 76, witnessesVerified: true, publisherAnswerKeyVerified: false });
const generated = source.makeQuestion();
assert.equal(generated.answerVisualRequired, true);
assert.equal(generated.publisherAnswerVerified, false);
assert.match(generated.prompt, /주사위 4개/);
assert.match(generated.prompt, /눈이 같은 면끼리/);
assert.match(generated.prompt, /겉면의 눈의 합이 가장 클 때/);
assert.doesNotMatch(generated.prompt, /72|76|data-source-answer/);
assert.equal((generated.prompt.match(/class="source52-p55m6-cube"/g) || []).length, 8, "prompt depicts four dice in each exact source shape");
for (const [shape, expectedFront, expectedSide] of [["square", 2, 2], ["zigzag", 3, 2]]) {
  const svg = source.shapeSvg(shape);
  assert.equal((svg.match(/class="source52-p55m6-top"/g) || []).length, 4);
  assert.equal((svg.match(/class="source52-p55m6-front"/g) || []).length, expectedFront, `${shape} hides internal front faces`);
  assert.equal((svg.match(/class="source52-p55m6-side"/g) || []).length, expectedSide, `${shape} hides internal side faces`);
}
assert.equal((generated.answerVisual.match(/class="source52-p55m6-cube"/g) || []).length, 8, "answer visual preserves both source arrays");
assert.match(generated.answerVisual, /맞닿은 눈: 1 \+ 2 \+ 2 \+ 1 = 6/);
assert.match(generated.answerVisual, /맞닿은 눈: 1 \+ 2 \+ 1 = 4/);
assert.match(generated.solution, /84−2×6=<strong>72<\/strong>/);
assert.match(generated.solution, /84−2×4=<strong>76<\/strong>/);
const runtimeQuestion = window.HSE_GENERATORS.generate(type, 2, 0, 54, 0);
assert.equal(runtimeQuestion.answer, "72, 76");
assert.equal(runtimeQuestion.publisherAnswerVerified, false);
assert.equal(window.HSE_GENERATORS.generate(type, 2, 0, 54, 1), null, "unverified variants stay unavailable");
const review = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u5-readiness-review.json"), "utf8")).items.find(row => row.sourceItemId === source.definition.sourceItemId);
assert(review.conditions.includes("눈이 같은 면끼리 붙임"), "source readiness retains equal-contact condition");
console.log(JSON.stringify({ status: "passed", sourceItemId: source.definition.sourceItemId, square, zigzag, reviewLocked: false }));
