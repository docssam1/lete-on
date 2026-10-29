"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page64-original.js');
for (let i = 0; i < 3; i++) {
  const q = source.makeQuestion(3, i);
  const balls = q.questionModel.bags.map(bag => bag.flatMap((count, color) => Array.from({length: count}, () => color)));
  const pairs = balls[0].flatMap(a => balls[1].map(b => [a, b]));
  const same = [0, 1, 2].map(color => pairs.filter(([a,b]) => a === color && b === color).length);
  const good = pairs.filter(([a,b]) => a !== b).length;
  assert.equal(q.answerModel.total, pairs.length);
  assert.deepEqual(q.answerModel.same, same);
  assert.equal(q.answerModel.good, good);
  assert.equal(q.answerModel.numerator * pairs.length, good * q.answerModel.denominator);
  assert.equal(q.answer, ['2/3', '55/81', '25/36'][i]);
  assert.equal(q.variantProvenance, 'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified, false);
}
console.log('Example 4-4: all distinct ball pairs and exact probabilities verified');
