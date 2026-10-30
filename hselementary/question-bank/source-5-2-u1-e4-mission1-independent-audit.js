'use strict';
const assert = require('node:assert/strict');
const source = require('./source-5-2-rounded-count-mission1.js');
const enumerate = (hundreds, tens) => Array.from({length: 10000}, (_, i) => i + 1)
  .filter(n => Math.floor((n + 50) / 100) * 100 === hundreds && Math.ceil(n / 10) * 10 === tens);
assert.deepEqual(enumerate(1200, 1200), Array.from({length:10}, (_, i) => 1191 + i));
let checked = 0;
for (let v = 0; v < 3; v++) for (const difficulty of [-1, 0, 1]) {
 const q = source.getQuestion(v, difficulty);
 const {hundredTarget, tenCeilingTarget, commonRange} = q.questionModel;
 const candidates = enumerate(hundredTarget, tenCeilingTarget);
 assert.equal(q.answerModel.count, candidates.length);
 assert.equal(q.answer, `${candidates.length}개`);
 assert.deepEqual([candidates[0],candidates.at(-1)], commonRange);
 assert(q.solution.includes('data-source-answer'));
 checked++;
}
assert.equal(checked, 9);
console.log('Printed Mission 1: 1191–1200, 10; 9 separate practice configurations checked.');
