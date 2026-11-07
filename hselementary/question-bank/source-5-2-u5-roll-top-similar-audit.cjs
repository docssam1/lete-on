'use strict';
const assert=require('node:assert/strict');
require('./source-5-2-u5-page108-practice.js');
const bank=require('./source-5-2-u5-roll-top-similar.js');
// Track the spatial position of each face, independently of the generator's tuple rotations.
const maps={R:{U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'},L:{U:'L',L:'D',D:'R',R:'U',F:'F',B:'B'},F:{U:'F',F:'D',D:'B',B:'U',L:'L',R:'R'}};
function independent(initial,moves){let faces=initial;const top=[],bottom=[];for(const move of moves){faces=Object.fromEntries(Object.entries(faces).map(([n,pos])=>[n,maps[move][pos]]));top.push(+Object.keys(faces).find(n=>faces[n]==='U'));bottom.push(+Object.keys(faces).find(n=>faces[n]==='D'));}return {top,bottom};}
const a=independent({2:'U',5:'D',3:'F',4:'B',1:'R',6:'L'},['R','R','F','R','R','F','R']);
const b=independent({6:'U',1:'D',5:'F',2:'B',3:'R',4:'L'},['R','R','R','F','F','L','L']);
assert.deepEqual(a.top,[6,5,4,1,3,2,6]);assert.deepEqual(a.bottom,[1,2,3,6,4,5,1]);assert.deepEqual(b.top,[4,1,3,2,4,1,3]);assert.deepEqual(b.bottom,[3,6,4,5,3,6,4]);
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['16','10','27','18']);
for(let i=0;i<4;i++){const c=bank.cases[i],q=bank.build(i),t=c.source===62?a.top:b.top;assert(q.prompt.includes('<svg'));assert.equal(+q.answer,t.slice(0,c.count).reduce((x,y)=>x+y,0));assert.equal(q.sourceParentItemId,`5-2-u5-practice-${c.source}-original`);}
assert.equal(bank.build(4),null);console.log('PASS: independently tracked six faces on two original paths and four top sums');
