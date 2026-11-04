'use strict';
const assert=require('node:assert/strict');
global.window={};
for(const file of ['source-inventory-4-1.js','source-inventory-4-2-quadrilateral.js','source-inventory-grade6.js','curriculum.js','generators.js','source-5-2-rounded-range-e42.js','source-5-2-rounded-range-e43.js'])require(`./${file}`);
const modules=[window.HSE_SOURCE_52_ROUNDED_RANGE_E42,window.HSE_SOURCE_52_ROUNDED_RANGE_E43];
const ids=['5-2-u1-e4-example-2-original','5-2-u1-e4-example-3-original'];
const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types)));
const round10=x=>Math.floor((x+5)/10)*10;
const candidates=Array.from({length:501},(_,n)=>n).filter(n=>round10(n/6)===50&&round10(n/4)===70);
assert.deepEqual([candidates[0],candidates.at(-1),candidates.length],[270,299,30]);
for(let n=600;n<700;n++){const smaller=250;assert(n+smaller>=850&&n+smaller<950&&n-smaller>=350&&n-smaller<450)}
for(const [i,id] of ids.entries()){
 const t=types.find(t=>t.id===id);assert(t&&t.sourceVerified&&!t.reviewLocked&&!t.publisherKeyVerified);
 for(const difficulty of [-1,0,1]){const q=window.HSE_GENERATORS.generate(t,1,difficulty,1,0);assert(q);assert.equal(q.answer,i===0?'270 이상 300 미만':'600 이상 700 미만');assert.equal(q.difficultyOffset,0);assert.equal(q.verifiedVariantCount,1);assert(q.prompt.includes(i===0?'50':'900'));}
 assert.equal(modules[i].getOriginal(1,0),null);
 for(let variant=0;variant<3;variant++)for(const difficulty of [-1,0,1]){const q=modules[i].getQuestion(variant,difficulty);assert(q);assert.equal(q.verifiedVariantCount,3);assert(q.answerModel.minimum<q.answerModel.upperExclusive)}
}
console.log('PASS: source boundaries, attainable values, original registration and 18 synthetic configurations');
