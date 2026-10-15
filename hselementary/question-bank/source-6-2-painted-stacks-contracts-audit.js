"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const contracts=require("./source-6-2-painted-stacks-contracts.js"),presentation=require("./source-6-2-painted-stacks-presentation.js");
let checked=0,negative=0;
for(const d of contracts.definitions)for(let v=0;v<3;v++)for(let level=0;level<3;level++){
  const q=contracts.generate(d.sourceItemId,v,level),p=presentation.render(d.sourceItemId,v,level),m=q.model;
  assert.equal(q.model.conditionPolicy.bottomFacesPainted,true);assert.equal(q.clue!==null,m.kind==="painted-surface-area" && level===0);
  assert.equal(q.secondary!==null,level===2);assert.equal(q.officialAnswerVerified,false);assert.equal(p.learnerReleaseVerified,false);
  assert.equal(q.requestedAnswerUnique,true);assert.equal(p.answerKeyVisual,true);assert(p.prompt.includes(q.promptText));
  assert(!/[<>]/.test(p.answer),"The existing answer field accepts plain text, not HTML markup");
  assert(p.answerVisual.includes("data-role=\"painted-faces\""));
  if(m.kind==="unpainted-inner-cubes"){
    const n=m.heights.length;assert.equal(q.answer,(n-2)*(n-2)*(n-2));
    assert(p.prompt.includes(`쌓기나무 ${n*n*n}개`));assert(!p.prompt.includes("<svg") && !p.prompt.includes("<table"));
    assert.equal(p.prompt.includes(`한 모서리에는 쌓기나무가 ${n}개씩`),level===0);
    if(level===2)assert.equal(q.secondary.answer,6*(n-2)*(n-2));
    assert(!q.solution.includes("cm²") && !/[<>]/.test(p.answer));
    assert.equal((q.solution.match(/class="math-inline-expression"/g)||[]).length,level===2 ? 5 : 3);
  }else if(m.kind==="painted-face-counts"){
    assert.deepEqual(q.answer,level===0 ? [m.histogram[3],m.histogram[4]] : m.histogram.slice(0,6));
    assert.equal(p.prompt.includes("source62-painted-histogram"),level!==0);
    if(level===2)assert.equal(q.secondary.answer,m.histogram.reduce((sum,n,k)=>sum+n*k,0)*4);
  }else{
    assert.equal(q.answer,m.paintedArea);assert(p.prompt.includes("data-direction=\"front\"") && p.prompt.includes("data-direction=\"right\""));
    if(level===2)assert.equal(q.secondary.answer,m.paintedArea-m.faceCounts.bottom*m.edge*m.edge);
  }
  for(const layer of m.layerGrids)for(const row of layer)for(const value of row)assert(value===null || Number.isSafeInteger(value));
  assert.throws(()=>q.answer=99,TypeError);checked++;
}
const window={HSE_GENERATORS:{generatorKey:()=>"old",generate:()=>({old:true}),names:[]},HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION:presentation};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"source-6-2-painted-stacks-questions.js"),"utf8"),{window});
for(const d of window.HSE_SOURCE_GRADE6_PAINTED_STACKS_QUESTIONS.definitions){
  const type={sourceItemId:d.sourceItemId,generatorKey:d.key,reviewLocked:false};
  assert.equal(window.HSE_GENERATORS.generatorKey({...type,reviewLocked:true}),"");assert.equal(window.HSE_GENERATORS.generate({...type,reviewLocked:true},1,0,1),null);negative++;
  for(const mismatch of [{...type,generatorKey:"other"},{...type,sourceItemId:"other"}]){assert.equal(window.HSE_GENERATORS.generate(mismatch,1,0,1),null);negative++;}
  for(const variant of [-1,1.5,NaN,Infinity,"0",null,{},Number.MAX_SAFE_INTEGER+1]){assert.throws(()=>window.HSE_GENERATORS.generate(type,1,0,1,variant));negative++;}
  for(const offset of [-2,2,.5,NaN,Infinity,"0",{}]){assert.throws(()=>window.HSE_GENERATORS.generate(type,1,offset,1,0));negative++;}
  for(let v=0;v<9;v++)for(const offset of [-1,0,1]){const actual=window.HSE_GENERATORS.generate(type,1,offset,1,v),expected=presentation.render(d.sourceItemId,v%3,offset+1);assert.equal(actual.prompt,expected.prompt);assert.equal(actual.answer,expected.answer);assert.equal(actual.verifiedPoolIndex,v%3);}
}
assert.equal(window.HSE_GENERATORS.generate({sourceItemId:"old"},1,0,1).old,true);
console.log(JSON.stringify({status:"passed",contracts:checked,wrapperRejections:negative,otherGeneratorPreserved:true,learnerReleaseVerified:false}));
