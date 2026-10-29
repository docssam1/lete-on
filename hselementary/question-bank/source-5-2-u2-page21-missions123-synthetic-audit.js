"use strict";
const assert=require('node:assert/strict'),gcd=(a,b)=>b?gcd(b,a%b):a;
const mods=[1,2,3].map(n=>require(`./source-5-2-u2-page21-mission${n}-synthetic.js`));
for(const [idx,m] of mods.entries()){
 const type={id:m.id,sourceItemId:m.id,generatorKey:m.key,sourceVerified:true,reviewLocked:false};
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{sourceVerified:false},{reviewLocked:true}])assert.equal(m.generate({...type,...bad},0,0,0,0),null);
 for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]){
  const q=m.generate(type,0,difficulty,0,i);assert(q.solution.includes(`data-source-answer="${m.id}"`));assert.equal(q.publisherKeyVerified,false);
  if(idx===0){const vals=q.questionModel.values,L=vals.reduce((a,v)=>a*v[1]/gcd(a,v[1]),1),scaled=vals.map(([n,d])=>n*L/d);let best=-Infinity;
   for(let x=0;x<4;x++)for(let y=0;y<4;y++)for(let z=0;z<4;z++)for(let w=0;w<4;w++)if(new Set([x,y,z,w]).size===4)best=Math.max(best,(scaled[x]+scaled[w])*L-scaled[y]*scaled[z]);
   const [n,d]=q.answerModel.maximum;assert.equal(best*d,n*L*L);
  }else if(idx===1){const {denominators:ds,target:[p,t]}=q.questionModel,found=[];for(let x=1;x<=9;x++)for(let y=1;y<=9;y++)for(let z=1;z<=9;z++)if(x<ds[0]&&y<ds[1]&&z<ds[2]&&gcd(x,ds[0])===1&&gcd(y,ds[1])===1&&gcd(z,ds[2])===1&&x*y*z*t===p*ds[0]*ds[1]*ds[2])found.push([x,y,z]);assert.deepEqual(q.answerModel.solutions,found);assert.equal(found.length,1);assert.equal(+q.answer,100*found[0][0]+10*found[0][1]+found[0][2]);
  }else{const {firstDenominator:d,secondNumerator:n,target:[p,t]}=q.questionModel,found=[];for(let x=1;x<d;x++)for(let y=n+1;y<=n*t+1;y++)if(gcd(x,d)===1&&gcd(n,y)===1&&x*n*t===p*d*y)found.push([x,y]);assert.deepEqual(q.answerModel.candidatePairs,found);assert.equal(found.length,1);assert.equal(+q.answer,found[0][0]+found[0][1]);}
 }
}
console.log('mission 1–3 independent exact exhaustive checks and release guards passed');
