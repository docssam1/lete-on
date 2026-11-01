'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-u3-dot-cut-synthetic.js');
assert.equal(api.paths.length, 9);
assert.deepEqual(api.pools, [1, 2, 7]);
for (let i = 0; i < 3; i++) for (const d of [-1, 0, 1]) {
  const item = api.makeQuestion(i, d);
  assert.equal(item.questionModel.excludedPathIndex, api.pools[i]);
  assert.equal(item.answer, '8가지');
  assert.equal(item.answerModel.allShapes, 9);
  assert.equal(item.publisherKeyVerified, false);
  assert.match(item.prompt, /중간에 방향을 바꾸는 곳은 안쪽 점/);
  assert.match(item.prompt, /스스로 교차하거나 중간에 테두리를 만나지/);
  assert.doesNotMatch(item.prompt, /data-source-answer|data-dot-cut-answers/);
  assert.equal((item.answerVisual.match(/<svg /g) || []).length, 8);
  assert.equal((item.answerVisual.match(/<polyline /g) || []).length, 8);
  assert.match(item.solution, /보기를 포함해 9가지/);
}
const source = require('./source-inventory/5-2-source-items.json').sourceItems.find(x => x.sourceItemId === '5-2-u3-e8-mission-3');
assert.equal(source.implementationStatus, 'review-locked');
assert.equal(source.publisherKeyVerified, false);
assert.equal(source.syntheticRuntimeTypeId, api.id);
console.log('PASS: 3 × 3 explicit dot-cut variants, 8 drawn solutions and original lock');
