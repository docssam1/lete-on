import assert from "node:assert/strict";
import { levels } from "./levels.js";
import { neutralPose, usesManipulation, setPose, posedPoints, poseDiagnosis } from "./manipulation.js";
import { activityCopy } from "./activity-copy.js";

let checked = 0;
for (const level of levels) for (const problem of level.problems) {
  const supported = [2,3].includes(problem.level);
  assert.equal(usesManipulation(problem,2),false);
  assert.equal(usesManipulation(problem,3),supported);
  if (!supported) continue;
  const snapshot = JSON.stringify(problem), op = problem.operation;
  assert.notEqual(poseDiagnosis(problem,neutralPose()),"correct");
  const correct = setPose(problem,{dx:op.dx || 0,dy:op.dy || 0,angle:op.angle || 0});
  const independent = problem.target.map(([x,y]) => {
    if (problem.level === 2) return [x+op.dx,y+op.dy];
    if (op.angle === 90) return [100-y,x];
    if (op.angle === -90) return [y,100-x];
    return [100-x,100-y];
  });
  assert.deepEqual(posedPoints(problem,correct),independent);
  assert.equal(poseDiagnosis(problem,correct),"correct");
  if (problem.level === 2) {
    for (let dx=-150;dx<=150;dx+=10) for (let dy=-150;dy<=150;dy+=10) {
      const pose = setPose(problem,{dx,dy,angle:0});
      posedPoints(problem,pose).forEach(point => point.forEach(value => assert.ok(value>=5 && value<=95)));
      assert.ok(pose.dx % 10 === 0); assert.ok(pose.dy % 10 === 0);
      assert.equal(poseDiagnosis(problem,pose)==="correct",pose.dx===op.dx && pose.dy===op.dy);
      checked++;
    }
    assert.equal(poseDiagnosis(problem,{dx:-op.dx,dy:-op.dy,angle:0}),"moveDirection");
  } else {
    for (let angle=-720;angle<=720;angle+=45) {
      const pose = setPose(problem,{angle,dx:0,dy:0});
      assert.ok([0,90,180,270].includes(pose.angle));
      assert.equal(poseDiagnosis(problem,pose)==="correct",pose.angle === ((op.angle+360)%360));
      checked++;
    }
  }
  assert.equal(JSON.stringify(problem),snapshot);
}
for (const language of ["ko","en","zh","ja"]) {
  const copy = activityCopy(language);
  for (const key of ["unmoved","moveDirection","moveAxis","moveDistance","unturned","turnDirection","turnAmount"]) assert.ok(copy[key]);
}
assert.doesNotMatch(JSON.stringify(activityCopy("ko")),/축소|1\/2/);
console.log(JSON.stringify({passed:true,domains:2,problems:20,poses:checked,languages:4}));
