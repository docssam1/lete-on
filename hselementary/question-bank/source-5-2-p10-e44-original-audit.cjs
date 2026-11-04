'use strict';
const assert=require('node:assert/strict');
global.window={};
for(const file of ['source-inventory-4-1.js','source-inventory-4-2-quadrilateral.js','source-inventory-grade6.js','curriculum.js','generators.js','source-5-2-rounded-range-e44.js'])require(`./${file}`);
const api=window.HSE_SOURCE_52_ROUNDED_RANGE_E44, q=api.getOriginal();
const female=[56,58,63,61,66,70],male=[51,55,62,68,62,72];
assert.deepEqual(q.questionModel.female,female);assert.deepEqual(q.questionModel.male,male);
const gaps=male.map((m,i)=>{const possible=new Set();for(let a=m*100-50;a<m*100+50;a++)for(let b=female[i]*100;b<female[i]*100+100;b++)possible.add(Math.abs(a-b));return [...possible].sort((x,y)=>x-y)});
assert.deepEqual(gaps.map(x=>x[0]),[451,251,51,551,351,51]);
assert.deepEqual(gaps.map(x=>x.at(-1)),[649,449,249,749,549,249]);
const possibleMax=new Set(gaps[0]);for(let i=1;i<gaps.length;i++){const next=new Set();for(const a of possibleMax)for(const b of gaps[i])next.add(Math.max(a,b));possibleMax.clear();for(const x of next)possibleMax.add(x)}
assert.equal(Math.min(...possibleMax),551);assert.equal(Math.max(...possibleMax),749);assert.equal(possibleMax.size,199);
assert(649>551,'2005 can exceed 2008 in actual values');
assert.equal(q.answer,'550명 초과 750명 미만');assert.match(q.solution,/단정하지/);assert.equal(q.verifiedVariantCount,1);assert.equal(api.getOriginal(1,0),null);
const type=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(g=>g.types))).find(t=>t.id===q.sourceItemId);assert(type&&!type.reviewLocked&&!type.publisherKeyVerified);
for(const d of [-1,0,1]){assert.equal(window.HSE_GENERATORS.generate(type,1,d,1,0).answer,q.answer);for(let v=0;v<3;v++)assert(api.getQuestion(v,d));}
console.log('PASS: source plot, all six years of actual differences, every attainable maximum and synthetic generation');
