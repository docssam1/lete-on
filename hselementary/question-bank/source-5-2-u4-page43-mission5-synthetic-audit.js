"use strict";
const assert = require("node:assert/strict");
const source = require("./source-5-2-u4-page43-mission5.js");
assert.equal(source.pools.length, 3);
for (let i = 0; i < source.pools.length; i++) for (const difficulty of [-1, 0, 1]) {
  const p = source.pools[i], q = source.build(i, difficulty);
  const edges = Array.from({length: p.pieceCount}, (_, j) => [j, (j + 1) % p.pieceCount]);
  assert.equal(new Set(edges.map(pair => pair.join(':'))).size, p.pieceCount);
  let remaining = 0;
  for (const edge of edges) { assert.notEqual(edge[0], edge[1]); remaining += p.pieceLengthTenths - p.overlapTenths; }
  assert.equal(q.answerModel.answerTenths, remaining);
  assert.equal(q.answerModel.joinedCount, edges.length);
  assert.match(q.prompt, /마지막과 첫 테이프도 같은 길이로 겹쳐/);
  for (const svg of [q.prompt, q.answerVisual]) {
    assert.equal((svg.match(/class="source52-u4-p43-m5-seam"/g) || []).length, edges.length);
    assert.equal((svg.match(/class="source52-u4-p43-m5-overlap"/g) || []).length, edges.length);
  }
  assert(q.solution.includes(`답: ${q.answer}`));
  assert.equal(q.variantProvenance, "synthetic-source-structure");
  assert.equal(q.publisherKeyVerified, false);
}
console.log("Mission 5: closed-ring joins, exact lengths, figures and synthetic provenance verified");
