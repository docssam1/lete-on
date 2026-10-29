"use strict";
const assert = require('node:assert/strict');
global.window = {};
require('./source-inventory-4-1.js'); require('./source-inventory-grade6.js'); require('./curriculum.js'); require('./generators.js');
const modules=['exploration21','exploration22','example21'].map(n=>require(`./source-5-2-u2-page16-${n}-synthetic.js`));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const reduce=(a,b)=>{const g=gcd(a,b);return [a/g,b/g]};
const multiply=fs=>fs.reduce(([n,d],f)=>{const [a,b]=f.length===3?[f[0]*f[2]+f[1],f[2]]:f; return reduce(n*a,d*b)},[1,1]);
const format=([n,d])=>{const w=Math.floor(n/d),r=n%d;return r?`${w?`${w} `:''}${r}/${d}`:String(w)};
const unit=window.HSE_CURRICULUM.semesters.find(s=>s.id==='5-2').units.find(u=>u.id==='5-2-u2');
const ledger=require('./source-inventory/5-2-source-items.json');
for (let i=0;i<modules.length;i++) {
 const m=modules[i],type=unit.subunits.flatMap(s=>s.types).find(t=>t.id===m.sourceItemId),row=ledger.sourceItems.find(x=>x.sourceItemId===type.sourceParentItemId);
 assert(type && !type.reviewLocked && type.sourceVerified && !type.publisherKeyVerified);assert(row.sourceVerified && row.implementationStatus==='review-locked');
 assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},0,0,0,0),null);
 for(let j=0;j<3;j++)for(const level of [-1,0,1]){
  const q=window.HSE_GENERATORS.generate(type,0,level,1,j);let expected;
  if(i===0){const x=m.pools[j];expected=format(reduce(x.capacityNumerator*x.filledNumerator,x.capacityDenominator*x.filledDenominator))+' L';}
  if(i===1){const x=m.pools[j],a=multiply(x.first),b=multiply(x.second);expected=format(reduce(a[0]*b[1]+b[0]*a[1],a[1]*b[1]));}
  if(i===2){let n=1,d=1;for(let k=3;k<=m.pools[j];k++){[n,d]=reduce(n*(k+2),d*k)}expected=d===1?String(n):`${n}/${d}`;}
  assert.equal(q.answer,expected);assert.equal(q.verifiedPoolIndex,j);assert.equal(q.verifiedVariantCount,3);assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);assert(q.solution.includes(`data-source-answer="${m.sourceItemId}"`));assert(!q.prompt.includes('data-source-answer'));
 }
}
console.log('PASS: three synthetic types, independent exact arithmetic, 3 pools × 3 difficulty levels, source locks');
