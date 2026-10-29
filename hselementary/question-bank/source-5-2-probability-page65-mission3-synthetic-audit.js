"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
for (let i = 0; i < 3; i++) {
  const q = source.makeQuestion(2, i), lengths = q.questionModel.lengths;
  const triples = [];
  for (let mask=0; mask < 2 ** lengths.length; mask++) {
    const t = lengths.filter((_, bit) => mask & (1 << bit));
    if (t.length === 3) triples.push(t);
  }
  const good = triples.filter(t => 2 * Math.max(...t) < t.reduce((a,b) => a+b, 0));
  assert.equal(q.answerModel.total, triples.length);
  assert.deepEqual(q.answerModel.good.map(t => t.join(',')).sort(), good.map(t => t.join(',')).sort());
  assert.equal(q.answerModel.numerator * triples.length, good.length * q.answerModel.denominator);
  assert.equal(q.answer, ['7/10', '3/5', '4/5'][i]);
  assert(triples.some(t => 2 * Math.max(...t) === t.reduce((a,b) => a+b, 0)));
  assert.equal(q.variantProvenance, 'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified, false);
}
console.log('Mission 3: all triples, equality boundaries and exact probabilities verified');
