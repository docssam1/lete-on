'use strict';
const assert=require('node:assert/strict');
global.window={};
require('./source-inventory-grade6.js');
const common=require('./source-inventory/6-1-source-items.json').items;
const detailed=require('./source-inventory/6-1-u5-source-readiness-review.json').items;
const publicItems=window.HSE_SOURCE_INVENTORY_GRADE6.items;
for(const [id,page,shape,detail,label] of [
  ['6-1-u5-e2-exploration',40,/그림그래프.*표.*띠그래프/,/그림그래프.*표.*띠그래프/,/그림그래프.*표.*띠그래프/],
  ['6-1-u5-e3-exploration',42,/그림.*수.*표.*원그래프/,/그림.*수.*표.*원그래프/,/그림.*수.*표.*원그래프/]
]){
  const c=common.filter(x=>x.sourceItemId===id),d=detailed.filter(x=>x.sourceItemId===id),p=publicItems.filter(x=>x.sourceItemId===id);
  assert.equal(c.length,1);assert.equal(d.length,1);assert.equal(p.length,1);
  assert.equal(c[0].pdfPage,page);assert.equal(d[0].sourcePdfPage,page);
  assert.match(c[0].sourceShape,shape);assert.match(d[0].originalStructure,detail);assert.match(p[0].typeLabel,label);
  assert.equal(c[0].implementationStatus,'fixed-verified-pool');assert.equal(p[0].reviewLocked,false);
}
console.log('PASS: two graph exploration records match reviewed page, detailed review and public labels');
