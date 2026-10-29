"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
for (let i = 0; i < 3; i++) {
  const q = source.makeQuestion(0, i), n = q.questionModel.n;
  const outcomes = Array.from({length: 2 ** n}, (_, mask) => Array.from({length:n}, (_, bit) => (mask >> bit) & 1));
  const good = outcomes.filter(row => row.every(side => side === row[0])).length;
  assert.equal(q.answerModel.total, outcomes.length);
  assert.equal(q.answerModel.good, good);
  assert.equal(q.answerModel.numerator * outcomes.length, good * q.answerModel.denominator);
  assert.equal(q.answer, ['1/8', '1/16', '1/32'][i]);
  assert.equal(q.variantProvenance, 'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified, false);
}
assert.equal(source.makeQuestion(0, -1), null);
console.log('Mission 1: all coin outcomes and exact probabilities verified');
