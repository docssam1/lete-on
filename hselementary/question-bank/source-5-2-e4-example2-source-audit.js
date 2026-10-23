'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const source = read('source-inventory/5-2-source-items.json').sourceItems.find(x => x.sourceItemId === '5-2-u3-e4-example-2');
const review = read('source-inventory/5-2-u3-e1-e4-readiness-review.json').items.find(x => x.sourceItemId === '5-2-u3-e4-example-2');
assert.ok(source && review, 'Example 4-2 source and readiness records exist');
assert.equal(source.pdfPage, 26);
assert.equal(source.printedPage, 30);
assert.equal(source.sourceVerified, true);
assert.equal(review.sourcePdfPage, 26);
assert.equal(review.sourcePrintedPage, 30);
assert.equal(review.sourceVerified, true);
assert.equal(review.calculationStatus, 'checked');
assert.equal(review.independentAnswer, '125°');
assert.equal(review.visualCheckStatus, 'confirmed-source-structure');
assert.equal(review.implementationStatus, 'review-locked');
assert.equal(review.publicDecision, 'locked');
assert.match(review.sourceEvidence, /source-sha256:6c3fde0d51b7e277eee7427de4db1742a42f11ef5113b25a1050aad2fcbe0ce88/);
assert.match(review.sourceEvidence, /clean-page-crop-sha256:527fa6ff8b5e058c58dd948c9a6493152f152e231f44084375018b1a08c59be7/);

// Normalize △ㄱㄴㄷ to side 1. The 35° mark places ㄴㅁ at 25°;
// equilateral △ㄴㄹㅁ places ㄴㄹ at -35°. Intersect ㄴㄹ with the 20° ray from ㄷ.
const rad = degree => degree * Math.PI / 180;
const t = Math.tan(rad(20)) / (Math.sin(rad(35)) + Math.tan(rad(20)) * Math.cos(rad(35)));
const N = { x: 0, y: 0 };
const D = { x: 1, y: 0 };
const G = { x: 0.5, y: Math.sqrt(3) / 2 };
const M = { x: t * Math.cos(rad(25)), y: t * Math.sin(rad(25)) };
const angleAt = (vertex, first, second) => {
  const a = { x: first.x - vertex.x, y: first.y - vertex.y };
  const b = { x: second.x - vertex.x, y: second.y - vertex.y };
  const cosine = (a.x * b.x + a.y * b.y) / (Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y));
  return Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
};
assert.ok(Math.abs(angleAt(M, N, G) - 125) < 1e-9, 'source geometry independently gives 125°');
console.log('Grade 5-2 E4 Example 4-2 source audit passed: canonical PDF p.26 / clean alternate p.25 / printed p.30, source angle marks, independent 125° calculation, and implementation lock preserved.');
