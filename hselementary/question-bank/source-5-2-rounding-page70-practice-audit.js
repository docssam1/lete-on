'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const feasible=[];for(let g=1;g<=20;g++)if(3*g<=36&&36<=6*g)feasible.push(g);assert.deepEqual(feasible,[6,7,8,9,10,11,12]);
const actual=[[37498,100],[26498,1000],[470586,10000]].map(([v,place])=>[Math.ceil(v/place)*place,Math.floor(v/place)*place,Math.floor(v/place+0.5)*place]);assert.deepEqual(actual,[[37500,37400,37500],[27000,26000,26000],[480000,470000,470000]]);
for(const row of actual)for(const v of row)assert(api.build(21).answerVisual.includes(String(v)));
const values=[];function perm(prefix,remaining){if(!remaining.length){if(prefix[0]!=='0')values.push(Number(prefix));return}for(let i=0;i<remaining.length;i++)perm(prefix+remaining[i],remaining.slice(0,i)+remaining.slice(i+1))}perm('','291054');
values.sort((a,b)=>Math.abs(a-900000)-Math.abs(b-900000));assert.equal(values[0],901245);assert.equal(Math.max(...values.filter(v=>v<900000)),594210);assert.equal(Math.floor((values[0]+500)/1000)*1000,901000);assert(api.build(24).solution.includes('594210'));
for(const x of [4999,5000,5001])assert.equal(Math.ceil(x/100)*100===5000&&Math.floor(x/100)*100===5000,x===5000);
console.log('PASS: groups, all nine table results, rounding intersection, 720 card orders');
