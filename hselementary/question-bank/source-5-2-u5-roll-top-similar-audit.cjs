'use strict';
const assert=require('node:assert/strict');
require('./source-5-2-u5-page108-practice.js');
const bank=require('./source-5-2-u5-roll-top-similar.js');
// Independently track where each numbered face points: R maps right to down,
// F maps front to down. Map each opposite pair from the source net.
let face={2:'U',5:'D',3:'F',4:'B',1:'R',6:'L'};
const right={U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'};
const front={U:'F',F:'D',D:'B',B:'U',L:'L',R:'R'};
const tops=[],bottoms=[];
for(const move of ['R','R','F','R','R','F','R']){const map=move==='R'?right:front;face=Object.fromEntries(Object.entries(face).map(([number,position])=>[number,map[position]]));tops.push(+Object.keys(face).find(n=>face[n]==='U'));bottoms.push(+Object.keys(face).find(n=>face[n]==='D'));}
assert.deepEqual(tops,[6,5,4,1,3,2,6]);assert.deepEqual(bottoms,[1,2,3,6,4,5,1]);
assert.deepEqual(bank.steps.map((_,i)=>bank.build(i).answer),['16','19','21','27']);
for(let i=0;i<4;i++){const q=bank.build(i);assert(q.prompt.includes('<svg'));assert.equal(+q.answer,tops.slice(0,bank.steps[i]).reduce((a,b)=>a+b,0));}
assert.equal(bank.build(4),null);console.log('PASS: independently tracked all six faces through seven moves and four top sums');
