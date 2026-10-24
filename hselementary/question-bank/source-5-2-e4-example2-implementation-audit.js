"use strict";

const assert = require("node:assert/strict");
global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const api = require("./source-5-2-congruence-page31.js");

const sourceId = "5-2-u3-e4-example-2";
const definition = api.definitions.find(item => item.sourceItemId === sourceId);
const allTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
const type = allTypes.find(item => item.sourceItemId === sourceId);
assert.ok(definition && type, "Example 4-2 is represented in the generator and curriculum");
assert.equal(definition.publicReady, true);
assert.equal(type.reviewLocked, false);
assert.equal(window.HSE_GENERATORS.generatorKey(type), definition.generatorKey, "reviewed generator is publicly registered");

const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const angleAt = (vertex,a,b) => {
  const u={x:a.x-vertex.x,y:a.y-vertex.y}, v={x:b.x-vertex.x,y:b.y-vertex.y};
  return Math.acos(Math.max(-1,Math.min(1,(u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y))))) * 180 / Math.PI;
};
const point = (svg,key) => {
  const text=svg.match(new RegExp(`data-${key}="([^"]+)"`))?.[1];
  assert.ok(text,`diagram includes point ${key}`);
  const [x,y]=text.split(",").map(Number);
  return {x,y};
};

const signatures=new Set();
for(let variant=0;variant<3;variant+=1) for(const offset of [-1,0,1]) {
  const item=api.getQuestion(sourceId,variant,offset);
  assert.ok(item,`variant ${variant}, difficulty ${offset} exists`);
  assert.equal(item.reviewLocked,false,"reviewed generated items are unlocked");
  const {alpha,beta,firstAtN,secondAtN,target,rotationDegrees}=item.answerModel;
  assert.equal(firstAtN,60-alpha);
  assert.equal(secondAtN,alpha);
  assert.equal(target,180-alpha-beta);
  assert.equal(rotationDegrees,60);
  assert.equal(item.answer,`${target}°`);
  assert.equal(item.verifiedVariantCount,3);
  assert.match(item.prompt,/정삼각형 ㄱㄴㄷ과 정삼각형 ㄴㄹㅁ/);
  assert.match(item.prompt,/∠ㄱㄴㅁ=.*∠ㄴㄷㄹ=.*∠ㄴㅁㄱ/);
  assert.match(item.solution,/시계 방향 60° 회전/);
  assert.match(item.solution,/∠ㄴㅁㄱ=∠ㄴㄹㄷ/);
  assert.doesNotMatch(item.solution,/탄젠트|tan\(/i);
  assert.doesNotMatch(item.prompt,/data-source-answer|정답은|답은/);
  assert.match(item.answerVisual,/정삼각형 회전으로 구한 목표각/);
  const promptSvg=item.prompt.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
  const proofSvg=item.solution.match(/<svg\b[\s\S]*?<\/svg>/)?.[0];
  assert.ok(promptSvg&&proofSvg,"problem and solution each render their own diagram");
  assert.equal((promptSvg.match(/<line\b/g)||[]).length,8,"source segments are all drawn");
  assert.match(proofSvg,/source52-corresponding-angle-mark/,"solution diagram marks the corresponding angle");
  assert.match(promptSvg,new RegExp(`>${alpha}°<`));
  assert.match(promptSvg,new RegExp(`>${beta}°<`));

  const n=point(promptSvg,"n"), d=point(promptSvg,"d"), g=point(promptSvg,"g"), m=point(promptSvg,"m"), r=point(promptSvg,"r");
  assert.ok(Math.abs(distance(g,n)-distance(n,d))<0.03,"outer triangle is equilateral");
  assert.ok(Math.abs(distance(n,m)-distance(n,r))<0.03,"inner equal sides match");
  assert.ok(Math.abs(angleAt(n,m,r)-60)<0.15,"inner angle at N is 60 degrees");
  assert.ok(Math.abs(angleAt(n,g,m)-alpha)<0.15,"alpha is placed at N between NG and NM");
  assert.ok(Math.abs(angleAt(n,d,r)-alpha)<0.15,"triangle NDR has alpha at N");
  assert.ok(Math.abs(angleAt(d,n,r)-beta)<0.15,"beta is placed at D between DN and DR");
  assert.ok(Math.abs(angleAt(m,n,g)-target)<0.15,"target angle at M matches the computed answer");
  assert.ok(Math.abs(angleAt(r,n,d)-target)<0.15,"rotated corresponding angle at R matches target");
  assert.notDeepEqual([alpha,beta],[35,20],"generated values do not reproduce the source values");
  signatures.add(`${alpha}:${beta}`);
}
assert.equal(signatures.size,9,"all three variants across three difficulty levels are distinct");
console.log("Grade 5-2 E4 Example 4-2 implementation audit passed: 9 distinct values, equilateral geometry, given/target angles, rotation solution, and public runtime registration.");
