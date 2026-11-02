'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
function permutations(items){if(!items.length)return [[]];return items.flatMap((x,i)=>permutations([...items.slice(0,i),...items.slice(i+1)]).map(t=>[x,...t]));}
const nums25=permutations(['46','8','60','39']).map(xs=>Number(xs.join(''))),high=Math.max(...nums25),low=Math.min(...nums25);assert.equal(high,8604639);assert.equal(low,3946608);assert.equal(Math.floor((high-low+500)/1000)*1000,4658000);
const nums26=permutations(['2','5','3','1','7']).map(xs=>Number(xs.join(''))),closest=t=>nums26.slice().sort((a,b)=>Math.abs(a-t)-Math.abs(b-t))[0];assert.equal(closest(50000),51237);assert.equal(closest(70000),71235);assert.equal(Math.floor((closest(70000)-closest(50000)+500)/1000)*1000,20000);
const nums27=permutations(['3','4','5','6','7']).map(xs=>Number(xs.join(''))).filter(n=>Math.floor((n+5000)/10000)*10000===50000);assert.equal(nums27.length,30);
const nums28=[];for(let n=300061;n<=399961;n+=100){const d=String(n).split('').map(Number);if(d[4]!==6||d[5]!==1)continue;if(Math.floor((n+5000)/10000)*10000===380000&&Math.floor(n/10000)*10000===370000&&d[3]*2===d[2])nums28.push(n)}assert.deepEqual(nums28,[376361,378461]);
for(const n of [25,26,27,28]){const q=api.build(n);assert.equal(q.sourcePdfPage,67);assert.equal(q.sourcePrintedPage,71)}
console.log('PASS: all card orders, 30 rounding cases, digit relation');
