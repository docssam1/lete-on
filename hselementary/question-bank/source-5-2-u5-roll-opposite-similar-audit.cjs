'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-roll-opposite-similar.js');
const maps={R:{U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'},F:{U:'F',F:'D',D:'B',B:'U',L:'L',R:'R'}};
function observed(initial,path){let face=Object.fromEntries(initial.map((n,i)=>[n,['U','D','F','B','R','L'][i]]));return [...path].map(m=>{face=Object.fromEntries(Object.entries(face).map(([n,p])=>[n,maps[m][p]]));return +Object.keys(face).find(n=>face[n]==='U');});}
function permutations(a){if(!a.length)return [[]];return a.flatMap((n,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[n,...rest]));}
const all=permutations([1,2,3,4,5,6]);
for(const [i,c] of bank.cases.entries()){
 const expected=observed(c.initial,c.moves),q=bank.build(i);assert.deepEqual(bank.tops(c),expected);
 const matching=all.filter(x=>x[0]===c.initial[0]&&x[2]===c.initial[2]&&x[4]===c.initial[4]).filter(x=>{const actual=observed(x,c.moves);return c.observed.every(j=>actual[j]===expected[j]);});
 assert.equal(matching.length,1);assert.equal(q.answer,String(matching[0][3]));assert.equal((q.prompt.match(/<svg/g)||[]).length,1);
}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['4','6','5','2']);assert.equal(bank.build(4),null);console.log('PASS: all 720 face assignments checked for each roll record and unique opposite face');
