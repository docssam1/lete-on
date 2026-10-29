"use strict";
const assert=require('node:assert/strict');
const a=require('./source-5-2-u2-page20-example43-synthetic.js'),b=require('./source-5-2-u2-page20-example44-synthetic.js');
const gcd=(x,y)=>y?gcd(y,x%y):x;
for(const mod of [a,b]) {
 const type={id:mod.id,sourceItemId:mod.id,generatorKey:mod.key,sourceVerified:true,reviewLocked:false};
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{sourceVerified:false},{reviewLocked:true}])assert.equal(mod.generate({...type,...bad},0,0,0,0),null);
 for(let i=0;i<3;i++)for(const d of [-1,0,1]){
  const q=mod.generate(type,0,d,0,i);assert(q.solution.includes(`data-source-answer="${mod.id}"`));assert.equal(q.publisherKeyVerified,false);
  if(mod===a){const {denominator:D,numerator:N,multiplier:[P,Q],limit:T}=q.questionModel;const A=[],B=[];
   for(let v=1;v*P<T*D*Q;v++)if(gcd(v,D)===1&&v*P%(D*Q)===0)A.push(v);
   for(let v=1;v<=N*P;v++)if(gcd(N,v)===1&&N*P%(v*Q)===0&&N*P<T*v*Q)B.push(v);
   assert.deepEqual(q.answerModel.aAnswers.map(x=>x[0]),A);assert.deepEqual(q.answerModel.bAnswers.map(x=>x[0]),B);
  }else {const nums=q.questionModel.numbers,fs=[];for(const x of nums)for(const y of nums)if(x<y&&gcd(x,y)===1)fs.push([x,y]);const pairs=[];
   for(let j=0;j<fs.length;j++)for(let k=j+1;k<fs.length;k++)if(2*fs[j][0]*fs[k][0]===fs[j][1]*fs[k][1])pairs.push([fs[j],fs[k]]);
   assert.equal(q.answerModel.count,pairs.length);assert(q.prompt.includes('다시 사용할 수'));assert(q.prompt.includes('한 쌍'));
  }
 }
}
console.log('examples 43 and 44 exhaustive independent enumerations and release guards passed');
