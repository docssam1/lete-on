'use strict';
const assert = require('node:assert/strict');
for (let n = 1; n <= 6; n++) {
  const api = require(`./source-5-2-u4-page43-mission${n}.js`);
  const build = api.build || api.getQuestion;
  for (let variant = 0; variant < 3; variant++) {
    const items = [-1, 0, 1].map(d => build(variant, d));
    for (const item of items) {
      assert.doesNotMatch(item.prompt, /도움말|힌트|풀이할 때|data-source-answer/i, `Mission ${n}: prompt contains guidance or answer`);
      assert.match(item.solution, /data-source-answer/);
      assert.equal(item.publisherKeyVerified, false);
      assert.equal(item.difficultyDesign, 'difficulty-difference-unverified');
    }
    if (n < 6) {
      assert.equal(new Set(items.map(item => item.answer)).size, 1);
      assert.equal(new Set(items.map(item => item.prompt.replace(/data-difficulty-offset="-?\d+"/g, ''))).size, 1);
    }
  }
}
console.log('PASS: 6 types × 3 variants × 3 calls, hints absent and solutions separated');
