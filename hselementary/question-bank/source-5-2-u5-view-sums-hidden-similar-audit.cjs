'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-view-sums-hidden-similar.js');
const maps={B:{U:'B',B:'D',D:'F',F:'U',L:'L',R:'R'},R:{U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'}};
function viewSums(initial){let face=Object.fromEntries(initial.map((n,i)=>[n,['U','D','F','B','R','L'][i]]));const sum=()=>Object.entries(face).filter(([,p])=>['U','F','R'].includes(p)).reduce((a,[n])=>a+Number(n),0),out=[sum()];for(const m of ['B','R']){face=Object.fromEntries(Object.entries(face).map(([n,p])=>[n,maps[m][p]]));out.push(sum());}return out;}
function permutations(a){if(!a.length)return [[]];return a.flatMap((n,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[n,...rest]));}
const all=permutations([1,2,3,4,5,6]);
for(const [i,c] of bank.cases.entries()){
 const sums=viewSums(c),matches=all.filter(x=>x[4]===c[4]).filter(x=>viewSums(x).every((n,j)=>n===sums[j]));assert.deepEqual(bank.sums(c),sums);assert.equal(matches.length,1);assert.equal(bank.build(i).answer,String(matches[0][1]));assert.equal((bank.build(i).prompt.match(/<svg/g)||[]).length,1);
}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['1','5','6','1']);assert.equal(bank.build(4),null);console.log('PASS: all 720 face assignments independently checked against three view sums');
