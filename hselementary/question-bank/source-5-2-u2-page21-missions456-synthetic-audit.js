"use strict";
const assert=require('node:assert/strict');
const mods=[4,5,6].map(n=>require(`./source-5-2-u2-page21-mission${n}-synthetic.js`));
for(const [idx,m] of mods.entries()){
 const type={id:m.id,sourceItemId:m.id,generatorKey:m.key,sourceVerified:true,reviewLocked:false};
 for(const bad of [{id:'bad'},{sourceItemId:'bad'},{generatorKey:'bad'},{sourceVerified:false},{reviewLocked:true}])assert.equal(m.generate({...type,...bad},0,0,0,0),null);
 for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]){
  const q=m.generate(type,0,difficulty,0,i);assert(q.solution.includes(`data-source-answer="${m.id}"`));assert.equal(q.publisherKeyVerified,false);
  if(idx===0){const {denominator:d,fraction:[p,t],mixed:[w,a,b],upperExclusive:limit}=q.questionModel,found=[];for(let x=1;x<limit;x++)if(((d+x)*p*(w*b+a))%(d*t*b)===0)found.push(x);assert.deepEqual(q.answerModel.values,found);assert.equal(+q.answer,found.reduce((a,b)=>a+b,0));
  }else if(idx===1){const {start:[ln,ld],end:[rn,rd],intervalCount:k,targetIndex:t}=q.questionModel,[an,ad]=q.answer.split('/').map(Number);assert.equal((an*ld-ln*ad)*rd*k,(rn*ld-ln*rd)*ad*t);assert.equal(k,5);assert.equal(t,3);assert.equal((q.prompt.match(/class="source52-p21m5-arc"/g)||[]).length,5);assert.equal((q.prompt.match(/class="source52-p21m5-tick/g)||[]).length,6);
  }else{const {factors,target:[tn,td]}=q.questionModel,[a,b]=factors[0],valid=[];for(let n=1;n<=200;n++){let xn=b*n,xd=a;if(factors.every(([p,t])=>(xn*p)%(xd*t)===0))valid.push({n,xn,xd,dist:Math.abs(xn*td-tn*xd)});}let min=Math.min(...valid.map(x=>x.dist));const near=valid.filter(x=>x.dist===min);assert.equal(near.length,1);assert.equal(q.answerModel.unique,true);const [rn,rd]=q.answer.split('/').map(Number);assert.equal(rn*near[0].xd,rd*near[0].xn);assert(valid[valid.length-1].xn*td>tn*valid[valid.length-1].xd);}
 }
}
console.log('mission 4–6 independent exact arithmetic, figure and nearest-value checks passed');
