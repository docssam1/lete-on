"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
for (let i = 0; i < 3; i++) {
  const q = source.makeQuestion(1, i), {n,d} = q.questionModel;
  const pairs = [];
  for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) pairs.push([a,b]);
  const good = pairs.filter(([a,b]) => a%d===0 || b%d===0).length;
  const neither = pairs.filter(([a,b]) => a%d!==0 && b%d!==0).length;
  assert.equal(q.answerModel.total, pairs.length);
  assert.equal(q.answerModel.good, good);
  assert.equal(q.answerModel.neither, neither);
  assert.equal(q.answerModel.numerator * pairs.length, good * q.answerModel.denominator);
  assert.equal(q.answer, ['4/7', '62/153', '13/24'][i]);
  assert.equal(q.variantProvenance, 'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified, false);
}
console.log('Mission 2: all unordered card pairs and exact probabilities verified');
