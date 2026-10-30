'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u1-decimal-rounding-synthetic.js');
const source=require('./source-inventory/5-2-source-items.json').sourceItems.find(x=>x.sourceItemId==='5-2-u1-e2-example-4');
assert.equal(source.implementationStatus,'review-locked');global.window={};require('./curriculum.js');require('./generators.js');api.install(window);
const types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(x=>x.types)));const type=types.find(x=>x.id===api.id);assert(type);assert.equal(window.HSE_GENERATORS.generatorKey(type),api.key);assert.equal(type.reviewLocked,false);
let checked=0;for(let v=0;v<3;v++)for(const difficulty of [-1,0,1]){let q=api.makeQuestion(v,difficulty),p=q.questionModel,solutions=[];
 for(let a=1;a<=9;a++)for(let b=1;b<=9;b++)for(let c=1;c<=9;c++)if(a>b&&b>c&&a+b+c===p.sum&&Math.floor((100*a+10*b+c+50)/100)===p.target)solutions.push([a,b,c]);
 assert.equal(solutions.length,1);assert.equal(q.answer,String(solutions[0][1]));assert.match(q.prompt,/1부터 9까지/);assert.match(q.solution,/data-source-answer/);assert(!q.prompt.includes('data-source-answer'));assert(window.HSE_GENERATORS.generate(type,0,difficulty,0,v));checked++;
}assert.equal(checked,9);assert.equal(api.makeQuestion(3,0),null);assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},0,0,0,0),null);console.log('9 synthetic configurations independently enumerated; original remains locked.');
