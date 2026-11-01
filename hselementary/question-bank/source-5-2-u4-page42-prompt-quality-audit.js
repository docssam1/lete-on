'use strict';
const assert = require('node:assert/strict');
const modules = ['exploration1', 'example11', 'example12', 'example13', 'example14'].map(name => require(`./source-5-2-u4-page42-${name}.js`));
for (const api of modules) for (let variant = 0; variant < 3; variant++) {
  const items = [-1, 0, 1].map(difficulty => api.build(variant, difficulty));
  for (const item of items) {
    assert.doesNotMatch(item.prompt, /도움말|힌트|풀이 순서|data-source-answer/i, `${api.id} problem leaks guidance or answer`);
    assert.match(item.solution, /data-source-answer/);
    assert.equal(item.publisherKeyVerified, false);
    assert.equal(item.difficultyDesign, 'difficulty-difference-unverified');
  }
  assert.equal(new Set(items.map(item => item.answer)).size, 1, `${api.id} answer changed with explanation level`);
  assert.equal(new Set(items.map(item => item.prompt.replace(/data-difficulty-offset="-?\d+"/g, ''))).size, 1, `${api.id} question content differs unexpectedly`);
}
console.log('PASS: 5 types × 3 variants × 3 calls, no problem hints, answer preserved and solution separated');
