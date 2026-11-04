'use strict';
const assert=require('node:assert/strict');global.window={};
for(const file of ['source-inventory-4-1.js','source-inventory-4-2-quadrilateral.js','source-inventory-grade6.js','curriculum.js','generators.js','source-5-2-rounded-count-mission1.js'])require(`./${file}`);
const api=window.HSE_SOURCE_52_ROUNDED_COUNT_MISSION1,id='5-2-u1-e4-mission-1-rounded-count-original';
const xs=Array.from({length:1501},(_,n)=>n).filter(n=>Math.floor(n/100+0.5)*100===1200&&Math.ceil(n/10)*10===1200);
assert.deepEqual(xs,[1191,1192,1193,1194,1195,1196,1197,1198,1199,1200]);
const t=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types))).find(t=>t.id===id);assert(t&&!t.reviewLocked&&!t.publisherKeyVerified);
for(const d of [-1,0,1]){const q=window.HSE_GENERATORS.generate(t,1,d,1,0);assert.equal(q.answer,'10개');assert.deepEqual(q.questionModel.commonRange,[1191,1200]);assert.equal(q.verifiedVariantCount,1)}
assert.equal(api.getOriginal(1,0),null);for(const d of [-1,0,1])for(let v=0;v<3;v++){const q=api.getQuestion(v,d);assert(q&&q.verifiedVariantCount===3)}
console.log('PASS: original enumeration and registration, nine synthetic cases');
