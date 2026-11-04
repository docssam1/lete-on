"use strict";
const assert = require("node:assert/strict");
const practice = require("./source-5-2-u5-cuboid-grid-practice.js");
const type = {id:practice.id,generatorKey:practice.key,sourceVerified:true,reviewLocked:false};
const expected = [180,135,270,450];
const seen = new Set();
for (let i=0;i<4;i++) {
  const q=practice.generate(type,0,0,0,i), [w,h,d]=q.answerModel.dimensions;
  let count=0;
  for(let x0=0;x0<w;x0++) for(let x1=x0+1;x1<=w;x1++)
    for(let y0=0;y0<h;y0++) for(let y1=y0+1;y1<=h;y1++)
      for(let z0=0;z0<d;z0++) for(let z1=z0+1;z1<=d;z1++) count++;
  assert.equal(count,expected[i]);
  assert.equal(q.answer,`${count}개`);
  assert(q.solution.includes(`${count}개`));
  assert.match(q.prompt,/위치가 다르면 각각/);
  assert.match(q.prompt,/겹치는 경우와 자르지 않은 전체/);
  assert(!seen.has([...q.answerModel.dimensions].sort().join(",")));
  seen.add([...q.answerModel.dimensions].sort().join(","));
  for(const [role,n] of [["front-vertical",w-1],["top-width",w-1],["front-horizontal",h-1],["side-height",h-1],["top-depth",d-1],["side-depth",d-1]])
    assert.equal((q.prompt.match(new RegExp(`data-grid-line="${role}"`,"g"))||[]).length,n,`${role} grid lines`);
  assert.equal(q.publisherKeyVerified,false);
}
assert.equal(practice.generate({...type,reviewLocked:true},0,0,0,0),null);
assert.equal(practice.generate({...type,sourceVerified:false},0,0,0,0),null);
console.log("PASS: four distinct grid diagrams and independently enumerated subcuboids; original remains separate");
