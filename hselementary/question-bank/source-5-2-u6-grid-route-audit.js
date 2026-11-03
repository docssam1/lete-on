'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u6-grid-route-linked.js');
api.cases.forEach((p,index)=>{
  let throughB=0,throughC=0,both=0;
  function visit(x,y,b,c){b ||= x===p.b[0]&&y===p.b[1];c ||= x===p.c[0]&&y===p.c[1];if(x===p.w&&y===p.h){throughB+=+b;throughC+=+c;both+=+(b&&c);return;}if(x<p.w)visit(x+1,y,b,c);if(y<p.h)visit(x,y+1,b,c);}
  visit(0,0,false,false);assert.equal(both,0);const item=api.build(index);assert.equal(item.answer,`${throughB+throughC}가지`);assert(item.solution.includes(`${throughB}가지`));assert(item.solution.includes(`${throughC}가지`));
  const points=[...item.prompt.matchAll(/data-point="([ABCD])" data-x="(\d+)" data-y="(\d+)"/g)].map(m=>[m[1],+m[2],+m[3]]);assert.deepEqual(points,[['A',0,0],['B',...p.b],['C',...p.c],['D',p.w,p.h]]);
});
console.log('PASS: all shortest routes enumerated and diagram points checked');
