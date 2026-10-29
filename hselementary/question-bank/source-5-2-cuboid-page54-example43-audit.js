"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const item = require("./source-5-2-cuboid-page54-example43.js");
const q = item.makeQuestion();
assert.equal(item.definition.sourcePrintedPage, 54);
assert.deepEqual(item.front, [[1, 6, 1], [5, 2, 5]]);
assert.deepEqual(item.top, [[4, 4, 4], [4, 4, 4]]);
assert.deepEqual(item.rightSide, [[5, 1], [2, 6]]);
assert.equal((q.prompt.match(/class="front-face"/g) || []).length, 6);
assert.equal((q.prompt.match(/class="top-face"/g) || []).length, 6);
assert.equal((q.prompt.match(/class="side-face"/g) || []).length, 4);
assert.equal((q.prompt.match(/class="pip"/g) || []).length, 58);
assert.match(q.prompt, /뒤쪽 위 2, 아래 6/);
const tops=[...q.prompt.matchAll(/<polygon class="top-face" points="([^"]+)"/g)].map(m=>m[1].split(" ").map(p=>p.split(",").map(Number)));
const fronts=[...q.prompt.matchAll(/<rect class="front-face" x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"/g)].map(m=>m.slice(1).map(Number));
for(let col=0;col<3;col++){
  const [x,y,w]=fronts[col],near=tops[3+col],far=tops[col];
  assert.deepEqual(near[0],[x,y],"near top starts at front top corner");
  assert.deepEqual(near[1],[x+w,y],"near top ends at front top corner");
  assert.deepEqual(near[3],far[0],"near/back top share left edge");
  assert.deepEqual(near[2],far[1],"near/back top share right edge");
}
for(const m of q.prompt.matchAll(/<circle class="pip" cx="([^"]+)" cy="([^"]+)" r="3.8" data-pip="4-top-(\d)-(\d)-\d+"\/>/g)){
  const [cx,cy,depth,col]=m.slice(1).map(Number),y=88-depth*36,x=28+col*74+depth*36;
  const v=(y-cy)/36, u=(cx-x-v*36)/74;
  assert(u>0&&u<1&&v>0&&v<1,"top pips lie inside their face");
}
for(let touching=1;touching<=6;touching++){
  const middleOther=7-touching;
  const leftEnd=7-touching,rightEnd=7-middleOther;
  assert.equal(leftEnd+rightEnd,7,"three-die chain's outer ends sum to 7");
  const backEnd=7-(7-touching);
  assert.equal(backEnd,touching,"two-die chain has equal exterior faces");
}
assert.match(q.prompt, /주사위 12개/);
assert.match(q.solution, /4×7=28/);
assert.match(q.solution, /20×2=40/);
assert.match(q.solution, /24×2=48/);
assert.match(q.solution, /28 \+ 40 \+ 48 = <strong>116<\/strong>/);
assert.equal(q.answer, "116");
assert.equal(q.verifiedVariantCount, 1);
assert.equal(q.generationMode, "fixed-verified-pool");
assert.equal(q.publisherKeyVerified, false);
assert.equal(q.handwrittenAnswerVerified, false);
const review = JSON.parse(fs.readFileSync(path.join(__dirname, "source-inventory/5-2-u5-readiness-review.json"), "utf8")).items.find(row => row.sourceItemId === item.sourceItemId);
assert(review.conditions.includes("맞붙는 두 면의 눈이 같음"));
assert(review.conditions.includes("각 주사위에서 마주 보는 두 면의 눈 합 7"));
assert.doesNotMatch(review.originalStructure, /맞붙는 두 면의 눈 합 조건/);
console.log("5-2 U5 p.54 Example 4-3 source structure, visible front/top pips, exterior-face decomposition (116), fixed pool, and release lock audit passed.");
