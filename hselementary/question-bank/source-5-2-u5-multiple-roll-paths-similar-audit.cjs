'use strict';
const assert=require('node:assert/strict'),bank=require('./source-5-2-u5-multiple-roll-paths-similar.js');
const moves={R:{U:'R',R:'D',D:'L',L:'U',F:'F',B:'B'},F:{U:'F',F:'D',D:'B',B:'U',L:'L',R:'R'}};
function independent(path){let face={2:'U',5:'D',3:'F',4:'B',1:'R',6:'L'};for(const m of path)face=Object.fromEntries(Object.entries(face).map(([n,p])=>[n,moves[m][p]]));return +Object.keys(face).find(n=>face[n]==='D');}
for(const [i,paths] of bank.cases.entries()){assert.equal(new Set(paths).size,3);for(const p of paths){assert.equal(p.length,4);assert.equal([...p].filter(x=>x==='R').length,2);assert.equal([...p].filter(x=>x==='F').length,2);assert.equal(bank.bottom(p),independent(p));}const q=bank.build(i);assert.equal(+q.answer,paths.reduce((a,p)=>a+independent(p),0));assert.equal((q.prompt.match(/marker-end=/g)||[]).length,3);}
assert.deepEqual(bank.cases.map((_,i)=>bank.build(i).answer),['16','8','11','13']);assert.equal(bank.build(4),null);console.log('PASS: three distinct grid routes per case and all last bottom faces independently checked');
