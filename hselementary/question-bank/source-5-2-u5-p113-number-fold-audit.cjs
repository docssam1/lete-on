"use strict";
const assert = require("node:assert/strict");
const bank = require("./source-5-2-u5-page108-practice.js");
for (const [number, answer, labels] of [[42,"15",["6","3","2","1","5","4"]], [46,"90",["4","2","5","6","1","3"]]]) {
  const question = bank.build(number);
  assert.equal(question.answer, answer);
  const fold = question.prompt.match(new RegExp(`<path data-number-net-folds="${number}"[^>]*>`))?.[0];
  const outline = question.prompt.match(new RegExp(`<path data-number-net-outline="${number}"[^>]*>`))?.[0];
  assert(fold && outline);
  assert.match(fold, /stroke-dasharray="4 2"/);
  assert.doesNotMatch(outline, /stroke-dasharray/);
  assert.equal((fold.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 5);
  assert.equal((outline.match(/M\d+ \d+ L\d+ \d+/g) || []).length, 14);
  const found = [...question.prompt.matchAll(/<text[^>]*>([1-6])<\/text>/g)].map(match => match[1]);
  assert.deepEqual(found, labels);
}
// Opposite faces independently obtained by folding each source net.
assert.equal(6+4+5, 15);
assert.equal(5*6*3, 90);
console.log("PASS: p113 q42 and q46 source labels, solid borders, five fold edges and answers");
