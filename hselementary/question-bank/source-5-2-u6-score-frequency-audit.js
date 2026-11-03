'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u6-score-frequency-linked.js');
api.cases.forEach((c,i)=>{const n=c.reduce((a,b)=>a+b,0),total=c.reduce((s,v,j)=>s+(6-j)*v,0),known=c.reduce((s,v,j)=>s+((j===2||j===6)?0:(6-j)*v),0),knownCount=c.reduce((s,v,j)=>s+((j===2||j===6)?0:v),0),matches=[];for(let four=0;four<=n;four++)for(let zero=0;zero<=n;zero++)if(four+zero+knownCount===n&&known+4*four===total)matches.push([four,zero]);assert.deepEqual(matches,[[c[2],c[6]]]);assert.equal(api.build(i).answer,`4점 ${c[2]}명, 0점 ${c[6]}명`);});
console.log('PASS: both missing frequencies uniquely satisfy count and total score');
