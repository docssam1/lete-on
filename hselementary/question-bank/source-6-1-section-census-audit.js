'use strict';
const assert=require('node:assert/strict');
const doc=require('./source-inventory/6-1-source-items.json'),items=doc.items;
// Counts transcribed from all 24 exploration/example pages of the hash-matched source.
// Exploration counts describe the existing inventory's explicit grouping, not 24 printed headers.
const pages={1:[2,4],2:[7,9,11,13],3:[16,18,20,22],4:[25,27,29,31,33,35],5:[38,40,42,44],6:[47,49,51,53]};
for(const [unit,sourcePages] of Object.entries(pages))for(let e=1;e<=sourcePages.length;e++){
 const rows=items.filter(x=>x.unitId===`6-1-u${unit}`&&x.exploration===e&&['exploration','example'].includes(x.section));
 const exp=rows.filter(x=>x.section==='exploration'),ex=rows.filter(x=>x.section==='example');
 const expectedExp=unit==='4'&&e===4?2:unit==='5'&&e===1?3:unit==='5'&&e===4?2:1;
 assert.equal(exp.length,expectedExp,`u${unit} e${e} exploration`);assert.equal(ex.length,unit==='5'?3:4,`u${unit} e${e} examples`);
 assert(exp.every(x=>x.pdfPage===sourcePages[e-1]));assert(ex.every(x=>x.pdfPage===sourcePages[e-1]));
 assert.deepEqual(ex.map(x=>x.ordinal).sort((a,b)=>a-b),Array.from({length:unit==='5'?3:4},(_,i)=>i+1));
}
for(const [section,n] of Object.entries({exploration:28,example:92,mission:144})){assert.equal(items.filter(x=>x.section===section).length,n);assert.equal(doc.integrity.expectedBySection[section],n);assert.equal(doc.integrity.actualBySection[section],n)}
assert.equal(doc.metadata.countingRule.oneExplorationBodyIsOneSourceItem,false);
assert.deepEqual(doc.integrity.priorUnreconciledExpectedBySection,{exploration:27,example:93,mission:144});
console.log('PASS: 24 source pages, 92 numbered examples and 28 inventory exploration rows match explicit grouping');
