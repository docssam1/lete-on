'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const vertices=[[85,20],[143,20],[143,88],[216,88],[216,120],[285,120],[285,165],[85,165],[85,20]];let h=0,v=0;for(let i=1;i<vertices.length;i++){h+=Math.abs(vertices[i][0]-vertices[i-1][0]);v+=Math.abs(vertices[i][1]-vertices[i-1][1])}assert.equal(h,400);assert.equal(v,290);assert.equal(Math.round(2*(572+447)/10),204);assert(api.build(34).prompt.includes('447mm'));assert(api.build(34).prompt.includes('572mm'));
const money=10000*13+1000*57+500*614+100*2978+50*307;assert.equal(money,807150);assert.equal(Math.floor(money/5000),161);
const sundays=Array.from({length:365},(_,i)=>i).filter(i=>i%7===0).length;assert.equal(sundays,53);assert.equal(Math.floor((365*3+sundays)/20),57);
const choices=[];for(let a=0;a<=10;a++)for(let b=0;b<=60;b++)if(100*a+10*b>=474)choices.push([420000*a+45000*b,a,b]);choices.sort((a,b)=>a[0]-b[0]);assert.deepEqual(choices[0],[2040000,4,8]);
for(const n of [34,35,39,40]){assert.equal(api.build(n).sourcePdfPage,68);assert.equal(api.build(n).sourcePrintedPage,72)}
console.log('PASS: staircase perimeter, money, Sunday count and all ticket bundles');
