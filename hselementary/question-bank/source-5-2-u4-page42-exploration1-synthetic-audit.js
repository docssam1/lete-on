"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-u4-page42-exploration1.js');
const inventory = require('./source-inventory/5-2-source-items.json').sourceItems.filter(x => x.unitId === '5-2-u4');
assert.equal(inventory.length,22);
for (const row of inventory) assert.equal(row.printedPage, row.pdfPage + 4);
assert.equal(source.pools.length,3);
for (let i=0;i<3;i++) for (const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty);
  let sum=0;for(let n=0;n<p.count;n++)sum+=p.hundredths;
  const [whole,fraction='']=q.answer.split('.');
  assert.equal(Number(whole)*100+Number(fraction.padEnd(2,'0')),sum);
  assert.equal(q.variantProvenance,'synthetic-source-structure');
  assert.equal(q.publisherKeyVerified,false);
  assert.notDeepEqual([p.decimal,p.count],['3.14',14]);
}
console.log('Exploration 1: all synthetic decimals verified by repeated addition');
