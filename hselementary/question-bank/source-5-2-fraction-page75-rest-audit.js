'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-fraction-page76-practice.js');assert.equal((20*3/5)*(20*3/4),180);assert.equal(87*(2+20/60),203);assert.equal((21*6/7)*(29/9),58);assert.equal((72*4/9)*(9/8),36);
for(const [n,ans] of [[5,'180cm²'],[6,'203km'],[7,'58'],[8,'36kg']]){const q=api.build(n);assert.equal(q.answer,ans);assert.equal(q.sourcePdfPage,71);assert.equal(q.sourcePrintedPage,75)}console.log('PASS: rectangle, rate, mixed-number scaling and weights');
