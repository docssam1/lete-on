'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-u2-linked-practice.js');
const q = api.rows.find(row => row.id === '5-2-u2-practice-71-count-similar');
const gcd = (a,b) => b ? gcd(b,a%b) : a;
for (const [index,[d,e]] of [[3,5],[4,5],[3,4],[5,6]].entries()) {
  const expected = [];
  for (let a=1;a<=9;a++) for (let b=1;b<=9;b++) {
    if (gcd(a,d) === 1 && gcd(b,e) === 1 && (a*b)%(d*e) === 0) expected.push(`(${a}, ${b})`);
  }
  const generated = api.build(q,index);
  assert.equal(generated.answer,`${expected.length}개`);
  const listed = [...generated.solution.matchAll(/\(\d, \d\)/g)].map(match=>match[0]);
  assert.deepEqual(listed,expected,`variant ${index} must list every and only valid pair`);
}
console.log('PASS: all four coprime cases exhaustively enumerated');
