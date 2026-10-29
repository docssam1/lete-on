"use strict";
const assert=require('node:assert/strict');
const m=require('./source-5-2-u2-page20-example42-synthetic.js');
const type={id:m.id,sourceItemId:m.id,generatorKey:m.key,sourceVerified:true,reviewLocked:false};
for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{sourceVerified:false},{reviewLocked:true}])assert.equal(m.generate({...type,...bad},0,0,0,0),null);
for(let i=0;i<3;i++)for(const d of [-1,0,1]){
 const q=m.generate(type,0,d,0,i),[ln,ld]=q.questionModel.left,[rn,rd]=q.questionModel.right,[an,ad]=q.answerModel.answer;
 assert.equal(8*(an*ld-ln*ad)*rd,5*(rn*ld-ln*rd)*ad,'independent weighted interpolation');
 assert.deepEqual(q.questionModel.markedPosition,[5,8]);assert.equal((q.prompt.match(/class="source52-p20e42-grid"/g)||[]).length,9);
 assert.match(q.prompt,/class="source52-p20e42-diagonal"/);assert.match(q.prompt,/class="source52-p20e42-drop"/);assert(q.solution.includes(`data-source-answer="${m.id}"`));assert(!q.prompt.includes('data-source-answer'));assert.equal(q.publisherKeyVerified,false);
}
console.log('page20 example42 exact interpolation, diagram and release guards passed');
