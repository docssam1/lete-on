import { strict as assert } from "node:assert";
import { levels, orientations, startingOrientation, roll, rollMany, visibleFaces, validateLevels } from "./levels.js";
import { auditDiceRollContent } from "./dice-roll-content-audit.mjs";

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

const brokenLevels = structuredClone(levels);
brokenLevels[0].problems[0].answer = brokenLevels[0].problems[0].answer === 6 ? 5 : 6;
assert.throws(() => auditDiceRollContent(brokenLevels), /Dice-roll content audit failed/);

console.log("dice-roll: 5 levels, 50 independent answers, 50 unique questions, 24 orientations validated");
