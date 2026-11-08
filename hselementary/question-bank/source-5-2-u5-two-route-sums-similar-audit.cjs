'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-two-route-sums-similar.js');
const maps={R:{U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'},F:{U:'F',F:'D',D:'B',B:'U',L:'L',R:'R'}};
function independent(initial,path){let face=Object.fromEntries(initial.map((n,i)=>[n,['U','D','F','B','R','L'][i]]));return [...path].reduce((sum,m)=>{face=Object.fromEntries(Object.entries(face).map(([n,p])=>[n,maps[m][p]]));return sum+(+Object.keys(face).find(n=>face[n]==='U'));},0);}
function permutations(a){if(!a.length)return [[]];return a.flatMap((n,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[n,...rest]));}
const all=permutations([1,2,3,4,5,6]);
for(const [i,c] of bank.cases.entries()){
 const sums=c.paths.map(p=>independent(c.initial,p)),matches=all.filter(x=>x[0]===c.initial[0]&&x[2]===c.initial[2]&&x[4]===c.initial[4]).filter(x=>c.paths.every((p,j)=>independent(x,p)===sums[j]));
 assert.equal(matches.length,1);assert.equal(bank.build(i).answer,String(matches[0][1]));assert.equal((bank.build(i).prompt.match(/marker-end=/g)||[]).length,2);assert(c.paths.every(p=>(p.match(/R/g)||[]).length<=3&&(p.match(/F/g)||[]).length<=3));
}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['5','4','6','3']);assert.equal(bank.build(4),null);console.log('PASS: all 720 face assignments independently tested against both path sums');
