'use strict';
const assert=require('node:assert/strict');
const source=require('./source-5-2-rounding-e2.js');
const down=(n,u)=>n-n%u,up=(n,u)=>down(n,u)+(n%u?u:0),nearest=(n,u)=>down(n,u)+(2*(n%u)>=u?u:0);
const fmt=n=>n.toLocaleString('en-US');let checked=0;
for(let index=0;index<source.ids.length;index++)for(let v=0;v<3;v++)for(const diff of [-1,0,1]){
 const q=source.getQuestion(source.ids[index],v,diff),m=q.questionModel;
 assert.equal(q.publisherAnswerVerified,false);
 if(index===0){assert.equal(q.answer,[up(m.value,100),down(m.value,1000),nearest(m.value,10000)].map(fmt).join(', '));}
 if(index===1){const valid=m.candidates.flatMap((n,i)=>up(n,100)===nearest(n,100)?['㉠㉡㉢㉣'[i]]:[]);assert.equal(q.answer,valid.join(', '));}
 if(index===2){const x=m.male,y=m.female,u=10000;assert.equal(q.answer,`${fmt(up(x,u)+up(y,u)-down(x,u)-down(y,u))}명, ${fmt(Math.abs(nearest(x,u)+nearest(y,u)-nearest(x+y,u)))}명`);assert.match(q.prompt,/가상 인구 자료/);assert.doesNotMatch(q.prompt,/서울시/);}
 if(index===3){const valid=m.candidates.filter(n=>up(n,10)!==nearest(n,10)&&down(n,100)!==nearest(n,100));assert.equal(q.answer,String(valid.length));assert.deepEqual(m.valid,valid);}
 checked++;
}
assert.equal(checked,36);
const witnesses=[];for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)for(let c=0;c<=9;c++){
 const n=2000+100*a+10*b+c;
 if(a+b+c===8&&a>b&&b>c&&nearest(n,100)===2500)witnesses.push([a,b,c]);
}
assert.deepEqual(witnesses,[[5,2,1],[5,3,0]]);
console.log('36 generated rounding cases and both original decimal interpretations independently checked');
