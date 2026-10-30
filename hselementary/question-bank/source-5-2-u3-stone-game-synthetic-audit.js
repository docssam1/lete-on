'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-stone-game-synthetic.js'),memo=new Map();
function moves(p){const out=[];for(let i=0;i<p.length;i++)for(let j=i?p[i-1]+1:0;j<p[i];j++){const q=p.slice();q[i]=j;out.push([i,p[i]-j,q])}return out}
function win(p){const k=p.join(',');if(!memo.has(k))memo.set(k,moves(p).some(([, ,q])=>!win(q)));return memo.get(k)}
const source=require('./source-inventory/5-2-source-items.json').sourceItems.find(x=>x.sourceItemId==='5-2-u3-e8-example-4');assert.equal(source.implementationStatus,'review-locked');
for(let i=0;i<3;i++)for(const d of [-1,0,1]){const q=api.makeQuestion(i,d),w=moves(q.questionModel.positions).filter(([, ,s])=>!win(s));assert.deepEqual(w.map(([piece,shift])=>[piece,shift]),[[q.answerModel.stone,q.answerModel.shift]]);assert.equal(q.automaticGrading,false);assert.equal(q.publisherKeyVerified,false);assert.equal((q.prompt.match(/<circle /g)||[]).length,3);}
console.log('3 boards × 3 difficulties: independently computed all first moves; unique correct winning opening.');
