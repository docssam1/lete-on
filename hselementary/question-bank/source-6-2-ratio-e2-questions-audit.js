"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict"),models=require("./source-6-2-ratio-e2-models.js"),contracts=require("./source-6-2-ratio-e2-contracts.js"),presentation=require("./source-6-2-ratio-e2-presentation.js"),script=fs.readFileSync(path.join(__dirname,"source-6-2-ratio-e2-questions.js"),"utf8"),clone=o=>JSON.parse(JSON.stringify(o));let cases=0,negative=0;
function setup(render=presentation.render){const window={HSE_GENERATORS:{generatorKey:()=>"unrelated",generate:()=>({unrelated:true}),names:[]},HSE_SOURCE_GRADE6_RATIO_E2_CONTRACTS:contracts,HSE_SOURCE_GRADE6_RATIO_E2_PRESENTATION:{...presentation,render}};vm.runInNewContext(script,{window});return window;}
const good=setup(),api=good.HSE_GENERATORS;
for(const id of contracts.sourceItemIds){const type={sourceItemId:id,generatorKey:good.HSE_SOURCE_GRADE6_RATIO_E2_QUESTIONS.keys[id],reviewLocked:false};
 assert.equal(api.generatorKey(type),type.generatorKey);assert.equal(api.generate({...type,reviewLocked:true},1,0,0,0),null);negative++;
 for(const mismatch of[{sourceItemId:id},{...type,generatorKey:"foreign"},{...type,sourceItemId:"foreign"}]){assert.equal(api.generate(mismatch,1,0,0,0),null);negative++;}
 for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
  const q=api.generate(type,1,level-1,0,variant),expected=contracts.generate(id,variant,level);assert(q);assert.equal(q.answer,expected.answerText);assert.equal(q.generationMode,"fixed-verified-pool");assert.equal(q.verifiedPoolIndex,variant);assert.equal(q.verifiedVariantCount,3);assert.equal(q.answerKeyVisual,expected.model.figures.length>0);assert(q.solution.trim());
  assert(!/<table\b|data-answer=|ratio-e2-teacher/.test(q.prompt));assert(!Object.hasOwn(q.studentGiven,"responses"));assert.equal(q.learner_stage,"초등 6학년 2학기 · 황소 심화 · 비례식과 비례배분");
  const mutations=[r=>{r.answer="wrong";},r=>{r.answerVisual="";},r=>{r.prompt+="<table></table>";},r=>{r.model.responses.pop();},r=>{r.officialAnswerVerified=true;},r=>{r.sourceExact=true;},r=>{r.solution="";},r=>{r.studentGiven.answer=r.answer;}];
  for(const mutate of mutations){const bad=setup((...args)=>{const r=clone(presentation.render(...args));mutate(r);return r;});assert.equal(bad.HSE_GENERATORS.generate(type,1,level-1,0,variant),null);negative++;}
  if(id.endsWith("mission-3")){const bad=setup((...args)=>{const r=clone(presentation.render(...args));r.model.figures[0].overlap[0]=[1,1];return r;});assert.equal(bad.HSE_GENERATORS.generate(type,1,level-1,0,variant),null);negative++;}
  cases++;
 }
}
for(const [kind,params]of Object.entries(models.pools)){assert.throws(()=>models.solveInput(kind,{...params[0],lineStart:[1,1]},1));negative++;}
assert.deepEqual(api.generate({sourceItemId:"unrelated",generatorKey:"old"}),{unrelated:true});assert.throws(()=>models.solve("unknown",0,1));assert.throws(()=>models.solve(contracts.sourceItemIds[0],3,1));
assert(contracts.generate("6-2-u4-e2-exploration",1,1).promptParts.some(p=>p.includes("1/3")));
assert(!contracts.generate("6-2-u4-e2-exploration",1,1).promptParts.some(p=>p.includes("0.33333333")));
console.log(JSON.stringify({status:"passed-finite-wrapper",cases,negative,catalogStateChecked:false}));
