"use strict";
const assert = require('node:assert/strict');
const source = require('./source-5-2-probability-page65-original.js');
function permutations(a) { if (!a.length) return [[]]; return a.flatMap((v,i) => permutations(a.filter((_,j)=>i!==j)).map(t=>[v,...t])); }
function cycleShape(p) { const seen=new Set(), out=[]; for(let i=0;i<p.length;i++){if(seen.has(i))continue;let j=i,k=0;while(!seen.has(j)){seen.add(j);k++;j=p[j];}out.push(k);}return out.sort((a,b)=>a-b).join('+'); }
for(let i=0;i<3;i++) {
  const q=source.makeQuestion(3,i), n=q.questionModel.n, rows=permutations(Array.from({length:n},(_,j)=>j));
  const good=rows.filter(row=>row.every((seat,person)=>seat!==person));
  const shapes={}; for(const row of good){const k=cycleShape(row);shapes[k]=(shapes[k]||0)+1;}
  assert.equal(q.answerModel.total,rows.length);assert.equal(q.answerModel.good,good.length);
  const [num,den]=q.answer.split('/').map(Number);assert.equal(num*rows.length,den*good.length);
  assert.deepEqual(shapes,[{'3':2},{'5':24,'2+3':20},{'6':120,'2+4':90,'3+3':40,'2+2+2':15}][i]);
  assert.equal(q.publisherKeyVerified,false);assert.equal(q.variantProvenance,'synthetic-source-structure');
}
console.log('Mission 4: all seat permutations and cycle counts verified');
