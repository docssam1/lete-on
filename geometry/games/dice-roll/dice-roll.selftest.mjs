import { strict as assert } from "node:assert";
import { levels, orientations, startingOrientation, roll, rollMany, visibleFaces, validateLevels } from "./levels.js";
import { auditDiceRollContent } from "./dice-roll-content-audit.mjs";
import { BOARD_BASIS, DIE_BASE_CENTER, DIE_FACE_QUADS, DIE_ON_BOARD_SCALE, VIEWPOINT_ID, boardFrame, cellCenter, cellPolygon } from "./projection.js";

assert.equal(validateLevels(), true);
assert.equal(orientations.length, 24);
assert.equal(levels.length, 5);
assert.equal(levels.flatMap((level) => level.problems).length, 50);
assert.deepEqual(levels.map((level) => level.band), ["초급", "초급", "초급", "중급", "중급"]);

for (const direction of ["N","E","S","W"]) {
  const inverse = { N:"S", E:"W", S:"N", W:"E" }[direction];
  assert.deepEqual(roll(roll(startingOrientation,direction),inverse),startingOrientation);
}
assert.deepEqual(rollMany(startingOrientation,["N","E","S","W"]),rollMany(startingOrientation,["N","E","S","W"]));

levels.flatMap((level)=>level.problems).forEach((problem)=>{
  const final = rollMany(problem.startOrientation,problem.directions);
  if(problem.interaction!=="route-answer") assert.deepEqual(final,problem.finalOrientation,problem.id);
  if(problem.interaction==="face-answer") assert.equal(visibleFaces(final)[problem.faceKey],problem.answer,problem.id);
});

const contentAudit = auditDiceRollContent();
assert.equal(contentAudit.uniqueQuestions, 50);
assert.equal(contentAudit.singleAnswerProblems, 50);
assert.equal(contentAudit.learnerFit.gate, "learner-fit");
assert.equal(contentAudit.learnerFit.status, "pass");
for (const key of ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]) assert.ok(contentAudit.learnerFit[key]);

assert.equal(VIEWPOINT_ID, "southeast-diagonal");
assert.equal(BOARD_BASIS.east[0], -BOARD_BASIS.south[0]);
assert.equal(BOARD_BASIS.east[1], BOARD_BASIS.south[1]);
const dieEast = [DIE_FACE_QUADS.top[3][0] - DIE_FACE_QUADS.top[0][0], DIE_FACE_QUADS.top[3][1] - DIE_FACE_QUADS.top[0][1]];
const dieSouth = [DIE_FACE_QUADS.top[3][0] - DIE_FACE_QUADS.top[2][0], DIE_FACE_QUADS.top[3][1] - DIE_FACE_QUADS.top[2][1]];
assert.ok(Math.abs(dieEast[0] * BOARD_BASIS.east[1] - dieEast[1] * BOARD_BASIS.east[0]) < .01);
assert.ok(Math.abs(dieSouth[0] * BOARD_BASIS.south[1] - dieSouth[1] * BOARD_BASIS.south[0]) < .01);
const frame = boardFrame(3, 3);
assert.equal(cellPolygon(0, 0, frame).length, 4);
assert.deepEqual(cellCenter(1, 1, frame).map((value) => Math.round(value * 1000) / 1000), [235.846, 200]);
assert.deepEqual(DIE_BASE_CENTER, [82, 94]);
assert.ok(DIE_ON_BOARD_SCALE > 0 && DIE_ON_BOARD_SCALE < 1);

const brokenLevels = structuredClone(levels);
brokenLevels[0].problems[0].answer = brokenLevels[0].problems[0].answer === 6 ? 5 : 6;
assert.throws(() => auditDiceRollContent(brokenLevels), /Dice-roll content audit failed/);

console.log("dice-roll: 5 levels, 50 independent answers, 50 unique questions, 24 orientations validated");
