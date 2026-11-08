'use strict';
const assert=require('node:assert/strict');
const original=require('./source-5-2-cuboid-page48-example14.js');
const bank=require('./source-5-2-u5-three-rope-shortest-similar.js');
const root={HSE_SOURCE52_P48_E14:original};
for(let i=0;i<bank.cases.length;i++){const dimensions=bank.cases[i],given=[2*(dimensions[0]+dimensions[1]),2*(dimensions[1]+dimensions[2]),2*(dimensions[0]+dimensions[2])].sort((a,b)=>a-b),solutions=[];for(let a=1;a<=30;a++)for(let b=a;b<=30;b++)for(let c=b;c<=30;c++){const result=[2*(a+b),2*(b+c),2*(a+c)].sort((x,y)=>x-y);if(result.every((n,j)=>n===given[j]))solutions.push([a,b,c]);}assert.deepEqual(solutions,[dimensions]);const q=bank.build(root,i);assert.equal(Number(q.answer),solutions[0][0]);assert(q.prompt.includes(given.join('cm, ')+'cm'));assert.equal(q.publisherKeyVerified,false);}
assert.equal(bank.build(root,-1),null);assert.equal(bank.build(root,4),null);
console.log('PASS: distinct shortest edges independently enumerated from all candidate edge triples');
