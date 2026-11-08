'use strict';
const assert=require('node:assert/strict');
const bank=require('./source-5-2-u6-dice-difference-similar.js');
for (let i=0;i<bank.divisors.length;i++) {
 const d=bank.divisors[i],pairs=[];
 for(let red=1;red<=6;red++)for(let blue=1;blue<=6;blue++)if(Math.abs(red-blue)%d===0)pairs.push([red,blue]);
 const q=bank.build(i);assert.equal(q.answer,`${pairs.length}가지`);assert.match(q.prompt,/0도/);assert.equal(new Set(pairs.map(x=>x.join(','))).size,pairs.length);
}
assert.deepEqual(bank.divisors.map((_,i)=>bank.build(i).answer),['18가지','12가지','10가지','8가지']);
assert.equal(bank.build(-1),null);assert.equal(bank.build(4),null);
console.log('PASS: all 36 ordered dice outcomes independently enumerated for four difference conditions');
