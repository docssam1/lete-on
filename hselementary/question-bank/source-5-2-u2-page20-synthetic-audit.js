"use strict";
const assert=require("node:assert/strict");
const exp=require("./source-5-2-u2-page20-exploration4-synthetic.js");
const rect=require("./source-5-2-u2-page20-example41-synthetic.js");
const gcd=(a,b)=>b?gcd(b,a%b):a;
for (const mod of [exp,rect]) {
 const type={id:mod.id,sourceItemId:mod.id,generatorKey:mod.key,sourceVerified:true,reviewLocked:false};
 for (const wrong of [{id:"wrong"},{sourceItemId:"wrong"},{generatorKey:"wrong"},{sourceVerified:false},{reviewLocked:true}]) assert.equal(mod.generate({...type,...wrong},null,0,null,0),null);
 for(let i=0;i<3;i++) for(const d of [-1,0,1]) {
  const q=mod.generate(type,null,d,null,i);
  assert.equal(q.verifiedVariantCount,3);assert.equal(q.publisherKeyVerified,false);assert(q.solution.includes(`data-source-answer="${mod.id}"`));
  if(mod===exp) {
   const [n,den]=q.answer.split('/').map(Number), fs=q.questionModel.fractions;
   for(const [a,b] of fs) assert.equal(n*a%(den*b),0);
   for(let y=1;y<=60;y++) for(let x=1;x*den<n*y;x++) if(gcd(x,y)===1) assert(!fs.every(([a,b])=>x*a%(y*b)===0),`smaller solution ${x}/${y}`);
  } else {
   const p=mod.pools[i], [hn,hd]=q.answerModel.height;
   assert.equal(gcd(hn,hd),1);assert.equal(+q.answer,hn*hd);
   assert.equal(p.width[0]*hn*p.portion[0]*p.patchArea[1],p.width[1]*hd*p.portion[1]*p.patchArea[0]);
  }
 }
}
console.log('page20 independent arithmetic, bounded minimality and release guards passed');
