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
  assert.match(q.prompt, /겹치게 이어 고리 모양의 띠 하나/);
  assert.doesNotMatch(q.prompt, /마지막과 첫 테이프/);
  assert.equal((q.prompt.match(/class="source52-u4-p43-m5-seam"/g) || []).length, 3);
  assert.equal((q.prompt.match(/class="source52-u4-p43-m5-overlap"/g) || []).length, 3);
  assert.match(q.prompt, /이음 일부만 표시/);
  assert.doesNotMatch(q.prompt, /고리 연결 \d+곳/);
  assert.equal((q.answerVisual.match(/class="source52-u4-p43-m5-seam"/g) || []).length, edges.length);
  assert.equal((q.answerVisual.match(/class="source52-u4-p43-m5-overlap"/g) || []).length, edges.length);
  assert(q.solution.includes(`답: ${q.answer}`));
  assert.equal(q.variantProvenance, "synthetic-source-structure");
  assert.equal(q.publisherKeyVerified, false);
}
console.log("Mission 5: closed-ring joins, exact lengths, figures and synthetic provenance verified");
