"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page64-original.js');
for (let i = 0; i < 3; i++) {
  const q = source.makeQuestion(2, i), {boys, girls} = q.questionModel;
  const people = Array.from({length: boys + girls}, (_, n) => ({id: n, girl: n >= boys}));
  const pairs = [];
  for (let a = 0; a < people.length; a++) for (let b = a + 1; b < people.length; b++) pairs.push([people[a], people[b]]);
  const good = pairs.filter(pair => pair.every(person => person.girl)).length;
  assert.equal(q.answerModel.total, pairs.length);
  assert.equal(q.answerModel.good, good);
  assert.equal(q.answerModel.numerator * pairs.length, good * q.answerModel.denominator);
  assert.equal(q.answer, ['2/5', '2/7', '5/14'][i]);
  assert.equal(q.variantProvenance, 'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified, false);
}
console.log('Example 4-2: all unordered pairs and exact probabilities verified');
