'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-u3-flower-ring-synthetic.js');
const n = 13, full = (1 << n) - 1, memo = new Map([[0, false]]);
function winning(mask) {
  if (memo.has(mask)) return memo.get(mask);
  for (let i = 0; i < n; i++) {
    if (!(mask & (1 << i))) continue;
    if (!winning(mask ^ (1 << i))) { memo.set(mask, true); return true; }
    const j = (i + 1) % n;
    if ((mask & (1 << j)) && !winning(mask ^ (1 << i) ^ (1 << j))) { memo.set(mask, true); return true; }
  }
  memo.set(mask, false); return false;
}
assert.equal(winning(full), false, 'the second player can force a win');
assert.equal(winning(full ^ 1 ^ (1 << 6) ^ (1 << 7)), false, 'opposite pair counters one petal');
assert.equal(winning(full ^ 1 ^ 2 ^ (1 << 7)), false, 'opposite petal counters two adjacent petals');
const q = api.makeOriginal();
assert.equal(q.answer, '나중, 처음, 반대, 처음, 다른');
// 2026-11-21 d767f5e40: 답(처음·반대)을 드러내던 명확화 문장을 중립 안내로 바꿈. 안내가 있고 빈칸 답을 드러내지 않는지 본다.
assert.match(q.prompt, /첫 응수/);
assert.doesNotMatch(q.prompt.replace(/보기:[^<]*/, ''), /반대쪽 꽃잎을 처음/);
assert.match(q.solution, /그다음부터는[\s\S]*같은 개수/);
assert.equal(q.publisherKeyVerified, false);
console.log('PASS: 13-petal minimax, both initial replies, and staged answer');
