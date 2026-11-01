'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-u3-flower-ring-synthetic.js');
assert.deepEqual(api.pools, [9, 11, 15]);
for (let i = 0; i < 3; i++) for (const d of [-1, 0, 1]) {
  const item = api.makeQuestion(i, d), n = api.pools[i];
  assert.equal(item.questionModel.petals, n);
  assert.equal(item.answerModel.equalGroups, (n - 3) / 2);
  assert.equal(item.answerModel.winner, 'second');
  assert.equal(item.automaticGrading, false);
  assert.equal(item.publisherKeyVerified, false);
  assert.equal((item.prompt.match(/<ellipse /g) || []).length, n);
  assert.match(item.prompt, /처음 꽃에서 서로 이웃한/);
  assert.doesNotMatch(item.prompt, /data-source-answer/);
  assert.match(item.solution, /한 잎을 떼면/);
  assert.match(item.solution, /두 잎을 떼면/);
}
const source = require('./source-inventory/5-2-source-items.json').sourceItems.find(x => x.sourceItemId === '5-2-u3-e8-mission-6');
assert.equal(source.implementationStatus, 'review-locked');
assert.equal(source.publisherKeyVerified, false);
assert.equal(source.syntheticRuntimeTypeId, api.id);
console.log('PASS: 3 × 3 flower games, original lock, manual strategy responses and figures');
