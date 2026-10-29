"use strict";
const assert = require("node:assert/strict");
const m = require("./source-5-2-u4-page43-mission6.js");
assert.equal(m.pools.length, 3);
for (let i = 0; i < 3; i++) for (const difficulty of [-1,0,1]) {
  const q = m.getQuestion(i,difficulty), p = q.questionModel;
  const candidates = [];
  for (let n = 1; n <= 500; n++) {
    const quotientTenthsFloor = Math.floor((20*n+p.divisor)/(2*p.divisor));
    if (quotientTenthsFloor === p.targetTenths) candidates.push(n);
  }
  assert.deepEqual(candidates, Array.from({length:p.count},(_,j)=>p.first+j));
  assert.equal(candidates.reduce((a,b)=>a+b,0),p.sum);
  assert.equal(q.answer,p.sum.toLocaleString("ko-KR"));
  assert.equal(q.variantProvenance,"synthetic-source-structure");
  assert.equal(q.publisherKeyVerified,false);
  assert(q.solution.includes(`${p.count}개`));
}
// Boundary ties: lower endpoint is included, upper endpoint is excluded.
const edge=m.calculate(20,20);
assert.equal(edge.first,39); assert.equal(edge.last,40);
assert.equal(m.getQuestion(3,0),null);
console.log('Mission 6: integer rounding enumeration, endpoints and sums verified');
