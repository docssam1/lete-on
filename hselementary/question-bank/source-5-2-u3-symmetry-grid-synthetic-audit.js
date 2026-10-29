'use strict';
const assert=require('node:assert/strict');
const module52=require('./source-5-2-u3-symmetry-grid-synthetic.js');
const source=require('./source-inventory/5-2-source-items.json').sourceItems.find(x=>x.sourceItemId==='5-2-u3-e5-exploration');
assert.equal(source.sourceVerified,true);assert.equal(source.implementationStatus,'review-locked');
const mirrors=[(x,y)=>[2-x,y],(x,y)=>[x,2-y],(x,y)=>[y,x],(x,y)=>[2-y,2-x]];
const symmetries=[(x,y)=>[x,y],(x,y)=>[2-y,x],(x,y)=>[2-x,2-y],(x,y)=>[y,2-x],...mirrors];
const transformed=(mask,fn)=>{let out=0;for(let y=0;y<3;y++)for(let x=0;x<3;x++)if(mask&(1<<(3*y+x))){const [a,b]=fn(x,y);out|=1<<(3*b+a)}return out};
const axes=mask=>mirrors.filter(f=>transformed(mask,f)===mask).length;
const population=mask=>mask.toString(2).replaceAll('0','').length;
for(let i=0;i<3;i++){
 const valid=Array.from({length:512},(_,m)=>m).filter(m=>population(m)===i+1&&axes(m)===1);
 const groups=new Set(valid.map(m=>Math.min(...symmetries.map(f=>transformed(m,f)))));
 assert.equal(groups.size,[2,4,8][i]);
 for(const difficulty of [-1,0,1]){const q=module52.makeQuestion(i,difficulty),reps=q.answerModel.representatives;
  assert.equal(q.answerModel.count,groups.size);assert.equal(q.answer,`${groups.size}가지`);
  assert.equal(q.questionModel.black,i+1);assert.equal(q.questionModel.white,8-i);
  assert.equal(axes(q.questionModel.sampleMask),1);assert.equal(population(q.questionModel.sampleMask),i+1);
  assert.deepEqual(new Set(reps),groups);assert.equal((q.answerVisual.match(/data-symmetry-grid-mask=/g)||[]).length,groups.size);
  assert.equal(q.answerVisualRequired,true);assert.ok(q.solution.includes(q.answer));
 }
}
console.log('3 independent symmetry enumerations × 3 difficulties passed; original remains locked');
