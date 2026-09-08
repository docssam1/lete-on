import assert from "node:assert/strict";
import { estimateProblems, rightAngleProblems, rightAngleSolutions, gradeBasic, angleAt, readNumber } from "./basic.js";
import { renderEstimate, renderRightAngle } from "./basic-render.js";

assert.equal(estimateProblems.length, 20);
assert.equal(rightAngleProblems.length, 20);
assert.equal(new Set([...estimateProblems, ...rightAngleProblems].map(p => p.id)).size, 40);
for (const p of estimateProblems) {
  const radians = p.angle * Math.PI / 180;
  const armA = [p.lengths[0], 0], armB = [p.lengths[1] * Math.cos(radians), p.lengths[1] * Math.sin(radians)];
  const independent = Math.atan2(Math.abs(armA[0] * armB[1]), armA[0] * armB[0]) * 180 / Math.PI;
  assert.ok(Math.abs(independent - p.angle) < 1e-9);
  assert.equal(gradeBasic(p, p.angle).correct, true);
  assert.equal(gradeBasic(p, p.angle - 10).correct, true);
  assert.equal(gradeBasic(p, p.angle - 11).correct, false);
  for (const value of ["", " ", null, undefined, NaN, Infinity, -1, 181, [], {}]) assert.equal(gradeBasic(p, value).valid, false);
  assert.ok(!renderEstimate(p).includes(`${p.angle}°`));
  assert.ok(renderEstimate(p, { reveal: true }).includes(`${p.angle}°`));
}
let tested = 0, validAnswers = 0;
const squaredDistance = (a, b) => a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0);
for (const p of rightAngleProblems) {
  const solutions = rightAngleSolutions(p);
  assert.ok(solutions.length > 0);
  validAnswers += solutions.length;
  for (let y = 0; y < p.size; y++) for (let x = 0; x < p.size; x++) {
    const b = [x,y];
    const nonzero = squaredDistance(p.origin, b) > 0;
    const right = nonzero && squaredDistance(p.arm, p.origin) + squaredDistance(b, p.origin) === squaredDistance(p.arm, b);
    const result = gradeBasic(p, b);
    assert.equal(result.valid, nonzero);
    if (nonzero) assert.equal(result.correct, right, `${p.id} ${b}`);
    if (right) assert.ok(Math.abs(angleAt(p, b) - 90) < 1e-9);
    tested++;
  }
  for (const b of [null, [], [-1,2], [6,0], [0.5,2], [1,2,3], [NaN,1], "2,3"]) assert.equal(gradeBasic(p, b).valid, false);
  assert.ok(!renderRightAngle(p).includes('>B</text>'));
  assert.ok(renderRightAngle(p, { reveal: true }).includes('>B</text>'));
}
for (const invalid of [false, true, [], {}, null, undefined]) assert.equal(readNumber(invalid), null);
console.log(JSON.stringify({ estimateProblems:20, constructionProblems:20, gridCandidates:tested, acceptedRightAngles:validAnswers }));
