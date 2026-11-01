"use strict";
const assert = require("node:assert/strict");
for (let n = 1; n <= 6; n++) {
  const mission = require(`./source-5-2-u4-page45-mission${n}.js`);
  for (let pool = 0; pool < 3; pool++) for (const difficulty of [-1, 0, 1]) {
    const q = mission.build(pool, difficulty);
    assert.doesNotMatch(q.prompt, /도움말|힌트|풀이할 때/);
    assert.equal(q.difficultyDesign, "difficulty-difference-unverified");
    assert.equal(q.publisherAnswerVerified, false);
    assert.ok(q.answer && q.solution.includes('data-source-answer='));
  }
}
console.log("PASS: 54 page 45 variants contain no prompt hints and retain separate solutions");
