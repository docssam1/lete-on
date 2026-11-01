'use strict';
const assert = require('node:assert/strict');
const review = require('./source-inventory/5-2-u3-e1-e4-readiness-review.json');
const common = require('./source-inventory/5-2-source-items.json');
const id = '5-2-u3-e2-mission-6';
const row = review.items.find(x => x.sourceItemId === id);
const source = common.sourceItems.find(x => x.sourceItemId === id);
assert.equal(row.publicDecision, 'locked');
assert.equal(source.publicDecision, 'locked');
assert.equal(source.publisherKeyVerified, false);
assert.equal(row.singleAnswer, false);
assert.match(row.independentAnswer, /3쌍.*9쌍/);
// All triangles use the same apex and have the same height. Equal area requires
// equal base length. Reflection pairs intervals [a,b] and [6-b,6-a].
const pairsByLength = [];
for (let length = 1; length <= 6; length++) {
  let count = 0;
  for (let a = 0; a + length <= 6; a++) {
    const b = a + length;
    const mirrorStart = 6 - b;
    if (a < mirrorStart) count++;
  }
  pairsByLength.push(count);
}
assert.deepEqual(pairsByLength, [3, 2, 2, 1, 1, 0]);
assert.equal(pairsByLength.reduce((a, b) => a + b, 0), 9);
// Independently compare all 210 triangle pairs using exact squared lengths,
// including the special case where a side equals a base.
for (const heightSquared of [1, 2, 3, 4, 5, 9, 16, 25, 36, 49, 64, 100]) {
  const triangles = [];
  for (let a = -3; a < 3; a++) for (let b = a + 1; b <= 3; b++) {
    triangles.push({a, b, sides: [heightSquared + a*a, heightSquared + b*b, (b-a)**2].sort((x,y) => x-y).join(',')});
  }
  assert.equal(triangles.length, 21);
  let total = 0, small = 0;
  for (let i = 0; i < triangles.length; i++) for (let j = i + 1; j < triangles.length; j++) {
    if (triangles[i].sides !== triangles[j].sides) continue;
    total++;
    if (triangles[i].b-triangles[i].a === 1 && triangles[j].b-triangles[j].a === 1) small++;
  }
  assert.equal(total, 9);
  assert.equal(small, 3);
}
console.log('PASS: original scope ambiguity retained; 3 small-sector pairs and 9 full-figure pairs');
