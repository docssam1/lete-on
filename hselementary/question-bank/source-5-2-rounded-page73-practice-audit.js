'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
for(const [n,expected] of [[10289999,false],[10290000,true],[10299999,true],[10300000,false]])assert.equal(Math.floor(n/10000)*10000===10290000,expected);
const round=(n,place)=>Math.floor((n+place/2)/place)*place;const chocolates=Array.from({length:100},(_,n)=>n).filter(n=>round(n,10)===70),candies=Array.from({length:100},(_,n)=>n).filter(n=>round(n,10)===80);const sums=new Set(chocolates.flatMap(a=>candies.map(b=>a+b)));assert.equal(Math.min(...sums),140);assert.equal(Math.max(...sums),158);assert.equal(sums.size,19);
const numbers=Array.from({length:1000},(_,n)=>n+1);assert.equal(numbers.filter(n=>round(n,100)===600).length,100);assert.equal(numbers.filter(n=>Math.floor(n/100)*100===600).length,100);assert.deepEqual(numbers.filter(n=>Math.floor(n/10)*10===50&&round(n,10)===60),[55,56,57,58,59]);
for(const n of [41,42,43,44]){assert.equal(api.build(n).sourcePdfPage,69);assert.equal(api.build(n).sourcePrintedPage,73)}
console.log('PASS: integer endpoints, sums and rounding intersections');
