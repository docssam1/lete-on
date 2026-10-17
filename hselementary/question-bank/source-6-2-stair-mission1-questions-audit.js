"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const presentation=require("./source-6-2-stair-mission1-presentation.js"),id="6-2-u3-e2-mission-1",key="sourceGrade6SecondSpaceE2StairCount";
const code=fs.readFileSync(path.join(__dirname,"source-6-2-stair-mission1-questions.js"),"utf8"),normalize=v=>JSON.parse(JSON.stringify(v));
function load(view=presentation){
  const calls=[],api={names:["legacy"],generatorKey:function(...args){calls.push({method:"key",args,self:this});return "legacy";},generate:function(...args){calls.push({method:"generate",args,self:this});return {legacy:true,args};}};
  const window={HSE_GENERATORS:api,HSE_SOURCE_GRADE6_STAIR_MISSION1_PRESENTATION:view};vm.runInNewContext(code,{window});return {api,calls};
}
const {api,calls}=load(),type={sourceItemId:id,generatorKey:key,reviewLocked:false};
let generated=0,rejected=0,delegations=0,negative=0;
for(const variant of [0,1,2,3,8,119,120,200,Number.MAX_SAFE_INTEGER])for(const offset of [-1,0,1]){
  const q=api.generate(type,1,offset,31,variant),expected=presentation.render(id,variant%3,offset+1);
  assert.equal(q.generator,key);assert.equal(q.verifiedPoolIndex,variant%3);assert.equal(q.difficultyLevel,offset+1);
  assert.equal(q.prompt,expected.prompt);assert.equal(q.answer,expected.answer);assert.equal(q.solution,expected.solution);
  assert.equal(q.officialAnswerVerified,false);assert.equal(q.sourceExact,false);assert.equal(q.originalSourceReleaseStatus,"locked");
  assert.equal(q.layerCue,null);
  assert(!/<table\b|<svg\b|data-source-answer-layer|math-inline-expression|given-layer-counts|층별 개수 표/.test(q.prompt));
  assert(!/[=+×]/.test(q.promptText));
  assert.equal((q.prompt.match(/<img\b/g)||[]).length,1);
  assert(q.prompt.includes('./assets/source-6-2-stair-mission1/prefix-given.png'));
  if(offset===-1){
    assert.equal(q.model.n,[3,2,1][variant%3]);
    assert.equal(q.answer,["22개","7개","1개"][variant%3]);
    assert.equal((q.promptText.match(/몇 개인지/g)||[]).length,1);
    assert(q.promptText.includes("그림에 보이는"));
  }
  assert(!q.solution.includes("다르게 세면"));generated++;
}
for(const bad of [{sourceItemId:id},{generatorKey:key},{sourceItemId:id,generatorKey:"wrong"},{sourceItemId:"wrong",generatorKey:key},{...type,reviewLocked:true}]){
  assert.equal(api.generatorKey(bad),"");assert.equal(api.generate(bad,1,0,31,0),null);rejected++;
}
for(const variant of [-1,1.5,NaN,Infinity,"1",null]){assert.throws(()=>api.generate(type,1,0,31,variant),{name:"RangeError"});rejected++;}
for(const offset of [-2,2,1.5,NaN,Infinity,"0",null]){assert.throws(()=>api.generate(type,1,offset,31,0),{name:"RangeError"});rejected++;}
for(const other of [null,undefined,{},[],{sourceItemId:"old",generatorKey:"legacy"},{sourceItemId:"6-2-u3-e2-example-2",generatorKey:"sourceGrade6SecondSpaceE2TPatternCount"}]){
  const args=[other,2,-1,71,2],result=api.generate(...args),call=calls.at(-1);assert.equal(result.legacy,true);assert.deepEqual(call.args,args);assert.equal(call.self,api);
  assert.equal(api.generatorKey(other),"legacy");assert.equal(calls.at(-1).args[0],other);delegations++;
}
const flags={sourceItemId:"wrong",variant:1,level:0,requestedAnswerUnique:false,sourceConditionsClarified:false,sourceExact:true,
  originalAnswerDeterminate:true,originalSourceReleaseStatus:"verified",registrationOnly:false,learnerReleaseVerified:true,
  officialAnswerVerified:true,officialHumanApproval:true,publisherAnswerVerified:true,handwrittenAnswerVerified:true,constructionConditionApproved:true};
for(const [field,value]of Object.entries(flags)){
  const bad=load({render:(...args)=>({...presentation.render(...args),[field]:value})});assert.equal(bad.api.generate(type,1,0,31,0),null,field);negative++;
}
assert.deepEqual(normalize(api.names),["legacy",key]);assert.equal(calls.filter(c=>c.method==="generate").length,delegations);
console.log(JSON.stringify({status:"passed",generated,rejected,unrelatedDelegations:delegations,mutatedPolicyRejections:negative,originalSourceLocked:true}));
