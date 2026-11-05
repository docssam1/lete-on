'use strict';
const assert=require('node:assert/strict');
const bank=require('./source-5-2-u5-page108-practice.js');
const q=bank.build(18);
assert.equal(q.answer,'108cm');
const short=(48-24)/2;
const height=54-2*short;
assert.equal(short,12);
assert.equal(height,30);
assert.equal(2*(24+height),108);
for(const label of ['ㄱ','ㅎ','ㄴ','ㅍ','ㅌ','ㅋ','ㅊ','ㄷ','ㅂ','ㅅ','ㅇ','ㅈ','ㄹ','ㅁ'])
  assert(q.prompt.includes(`>${label}</text>`),`missing vertex ${label}`);
for(const measure of ['24cm','48cm','54cm']) assert(q.prompt.includes(measure));
const fold=q.prompt.match(/<path data-net110-folds="18"[^>]+>/)?.[0];
const outline=q.prompt.match(/<path data-net110-outline="18"[^>]+>/)?.[0];
assert(fold&&outline);assert.match(fold,/stroke-dasharray="4 2"/);assert.doesNotMatch(outline,/stroke-dasharray/);
assert.equal((fold.match(/M\d+ \d+ [HV]\d+/g)||[]).length,5);
assert(q.solution.includes('108cm'));
console.log('PASS: p110 q18 labels, five folds, dimension relationships and perimeter');
