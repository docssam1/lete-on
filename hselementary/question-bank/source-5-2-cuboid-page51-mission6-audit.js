"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
global.window = {};
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-cuboid-page51-mission6.js");
const api = window.HSE_GENERATORS;
const types = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(group => group.types)));
const type = types.find(item => item.sourceItemId === source.definition.sourceItemId);

assert(type, "the exact p.51 Mission 6 source item is connected");
assert.equal(type.sourceVerified, true);
assert.equal(type.reviewLocked, false);
assert.equal(type.implementationStatus, "fixed-verified-pool");
assert.equal(api.generatorKey(type), source.definition.generatorKey);
assert.equal(api.generatorKey({ ...type, reviewLocked: true }), "", "lock gate rejects a locked item");
assert.equal(api.generate({ ...type, reviewLocked: true }, 0, 0, 0, 0), null, "locked source type cannot generate");

const model = source.verifyModel();
assert.equal(model.faceCount, 6);
assert.equal(model.seamCount, 5);
assert.equal(model.perimeterEdges, 14);
assert.equal(model.edgeLengthCm, 7);
assert.equal(model.edgeCount, 12);
assert.equal(model.totalEdgeLengthCm, 84);

// Enumerate fixed hexominoes independently; keep only those that fold to six
// distinct cube faces. Translation is removed, but rotations remain distinct.
const directions = [[1,0],[-1,0],[0,1],[0,-1]];
const key = cells => {
  const minX = Math.min(...cells.map(c => c[0])), minY = Math.min(...cells.map(c => c[1]));
  return cells.map(([x,y]) => [x-minX,y-minY]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(c=>c.join(",")).join(";");
};
let shapes = new Set(["0,0"]);
for (let size = 1; size < 6; size++) {
  const next = new Set();
  for (const shape of shapes) {
    const cells=shape.split(";").map(p=>p.split(",").map(Number)), occupied=new Set(cells.map(c=>c.join(",")));
    for(const [x,y] of cells)for(const [dx,dy] of directions)if(!occupied.has(`${x+dx},${y+dy}`))next.add(key([...cells,[x+dx,y+dy]]));
  }
  shapes=next;
}
const neg = v => v.map(x=>-x);
function foldsToCube(shape) {
  const cells=shape.split(";"), occupied=new Set(cells), orientations=new Map([[cells[0],[[1,0,0],[0,1,0],[0,0,1]]]]), queue=[cells[0]];
  while(queue.length){
    const pos=queue.shift(), [x,y]=pos.split(",").map(Number), [u,v,n]=orientations.get(pos);
    const transforms=[[neg(n),v,u],[n,v,neg(u)],[u,neg(n),v],[u,n,neg(v)]];
    for(let i=0;i<directions.length;i++){
      const [dx,dy]=directions[i], next=`${x+dx},${y+dy}`;
      if(!occupied.has(next))continue;
      const orientation=transforms[i], old=orientations.get(next);
      if(old && JSON.stringify(old)!==JSON.stringify(orientation))return false;
      if(!old){orientations.set(next,orientation);queue.push(next);}
    }
  }
  return orientations.size===6 && new Set([...orientations.values()].map(o=>o[2].join(","))).size===6;
}
const cubeNets=[...shapes].filter(foldsToCube);
assert.equal(shapes.size,216);
assert.equal(cubeNets.length,64);
for(const shape of cubeNets){
  const cells=shape.split(";").map(p=>p.split(",").map(Number)), occupied=new Set(shape.split(";"));
  const perimeter=cells.reduce((sum,[x,y])=>sum+directions.filter(([dx,dy])=>!occupied.has(`${x+dx},${y+dy}`)).length,0);
  assert.equal(perimeter,14);
}

const question = api.generate(type, 0, 0, 0, 0);
assert.equal(question.answer, "84cm");
assert.equal(question.sourceItemId, source.definition.sourceItemId);
assert.equal(question.verifiedVariantCount, 1);
assert.equal(question.answerVisualRequired, false, "the source is text-only and receives no invented figure");
assert.equal(question.publisherKeyVerified, false);
assert.match(question.prompt, /둘레가 98cm인 어떤 정육면체의 전개도/);
assert.match(question.prompt, /모든 모서리의 길이의 합을 구하여라/);
assert.doesNotMatch(question.prompt, /84cm|7cm/);
assert.match(question.solution, /98 ÷ 14 = 7/);
assert.match(question.solution, /7 × 12 = <strong>84\(cm\)<\/strong>/);
assert.match(question.solution, /24−10=14배/);
assert.doesNotMatch(question.solution, /출판사 정답표|원문 필기/);
assert.equal(api.generate(type, 0, 0, 0, 1), null, "unverified variants stay unavailable");

const readiness = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u5-readiness-review.json"), "utf8"));
const review = readiness.items.find(item => item.sourceItemId === source.definition.sourceItemId);
assert.equal(review.calculationStatus, "checked-unique");
assert.equal(review.visualCheckStatus, "confirmed-source-text-only-no-figure-required");
assert.equal(review.implementationStatus, "fixed-verified-pool");
assert.equal(review.publicDecision, "public");

console.log("PASS: p.51 Mission 6 text source, 14a perimeter proof, 84cm answer, exact one-item pool, locked-type gate and text-only readiness record.");
