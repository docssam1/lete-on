"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const models=require("./source-6-2-painted-exploration-models.js");
const contracts=require("./source-6-2-painted-exploration-contracts.js");
const presentation=require("./source-6-2-painted-exploration-presentation.js");
const shared=require("./source-6-2-painted-stacks-presentation.js");
const id="6-2-u3-e3-exploration",key="sourceGrade6SecondSpaceE3PaintedExploration";
const learner_stage="초등 6학년 2학기 · 황소 심화 · 공간과 입체";
const conditions="모든 기둥의 윗면이 그림에 보입니다. 각 기둥은 같은 바닥에서부터 빈틈없이 쌓여 있습니다.";
const type={sourceItemId:id,generatorKey:key,reviewLocked:false};
const wrapper=fs.readFileSync(path.join(__dirname,"source-6-2-painted-exploration-questions.js"),"utf8");
const contractCode=fs.readFileSync(path.join(__dirname,"source-6-2-painted-exploration-contracts.js"),"utf8");
const presentationCode=fs.readFileSync(path.join(__dirname,"source-6-2-painted-exploration-presentation.js"),"utf8");
const notationWindow={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"math-notation.js"),"utf8"),{window:notationWindow});
const normalize=value=>JSON.parse(JSON.stringify(value));
let generated=0,contractRejections=0,routingRejections=0,retained=0,retainedLocks=0,delegationCases=0;
function fresh(candidate=presentation){
  const delegated=[],api={names:["old"],generatorKey(t){delegated.push({kind:"key",receiver:this,args:[t]});return "old-key";},generate(){delegated.push({kind:"generate",receiver:this,args:[...arguments]});return "unchanged-old";}};
  const window={HSE_GENERATORS:api,HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION:candidate};
  vm.runInNewContext(wrapper,{window},{filename:"source-6-2-painted-exploration-questions.js"});
  return {api,window,delegated};
}
function rangeError(action){assert.throws(action,{name:"RangeError"});}
function flags(q){
  assert.equal(q.learner_stage,learner_stage);
  assert.equal(q.sourceConditionsClarified,true);assert.equal(q.originalAnswerDeterminate,false);assert.equal(q.originalSourceReleaseStatus,"locked");
  assert.equal(q.requestedAnswerUnique,true);assert.equal(q.sourceGeometryVerificationPending,false);
  assert.equal(q.sourceExact,false);assert.equal(q.sourceConditionProvenance,"explicit-learner-given-conditions");
  assert.equal(q.registrationOnly,true);assert.equal(q.learnerReleaseVerified,false);
  assert.equal(q.publisherAnswerVerified,false);assert.equal(q.handwrittenAnswerVerified,false);
}
function equationCheck(q){
  const inline=[...q.solution.matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)].map(match=>match[1]);
  assert.deepEqual(inline,q.solutionEquations);
  for(const equation of inline){
    const match=/^(\d+(?:×\d+)*(?:\+\d+(?:×\d+)*)*)=(\d+)(개| cm²)$/.exec(equation);
    assert(match,`Non-atomic equation: ${equation}`);
    const computed=match[1].split("+").reduce((sum,term)=>sum+term.split("×").reduce((product,n)=>product*Number(n),1),0);
    assert.equal(computed,Number(match[2]));
  }
}
function promptCheck(q,level,variant){
  assert(q.prompt.includes(conditions));assert(q.prompt.includes("쌓은 후"));assert(q.prompt.includes("바닥면을 포함한 모든 겉면"));
  assert(q.prompt.includes("쌓기나무끼리 맞닿은 면에는 칠하지 않았습니다."));
  assert.equal((q.prompt.match(/<button\b/g)||[]).length,1);assert.equal((q.prompt.match(/<img\b/g)||[]).length,1);
  assert(q.prompt.includes('class="source62-painted-given source62-m3-given source62-exploration-given"'));
  assert(q.prompt.includes(`data-source="${id}"`));assert(q.prompt.includes(`data-m3-figure="${variant}"`));
  assert(q.prompt.includes('data-source-figure-family="exploration"'));
  assert(q.prompt.includes(`src="./assets/source-6-2-painted-exploration/v${variant}-given.png"`));
  assert(q.prompt.includes('width="1280" height="1120"'));assert(q.prompt.includes('data-glyphless="true"'));
  assert(!/<svg\b|data-value=|data-role="height"|math-inline-expression|data-source-layers=/.test(q.prompt));
  assert(!/공식 정답|정답은|층별로 더하면|44개|45개/.test(q.prompt));
  const cells=[...q.prompt.matchAll(/<td\b([^>]*)>(.*?)<\/td>/g)];
  assert.equal(cells.length,level===0?0:6);
  cells.forEach((cell,face)=>{assert.equal(cell[1],` data-face-count="${face}"`);assert.equal(cell[2],"");});
  assert.equal((q.prompt.match(/<table\b/g)||[]).length,level===0?0:1);
  assert.equal(q.prompt.includes("(2)"),level===2);assert.equal(q.prompt.includes("2 cm"),level===2);
}
assert.equal(presentation.grid,shared.grid);assert.equal(presentation.align,shared.align);
assert.deepEqual(contracts.sourceItemIds,[id]);
const initialPools=JSON.stringify(models.pools);
for(let variant=0;variant<3;variant++)for(let level=0;level<3;level++){
  const q=contracts.generate(id,variant,level),m=q.model,p= presentation.render(id,variant,level);
  flags(q);flags(p);assert(Object.isFrozen(q));
  for(const value of [q.answer,q.histogram,q.solutionEquations,q.difficultyDesign,q.model,q.model.heights,q.model.layerGrids])assert(Object.isFrozen(value));
  if(q.secondary)assert(Object.isFrozen(q.secondary));
  assert.deepEqual(q.histogram,m.histogram.slice(0,6));assert.deepEqual(q.answer,level===0?[m.histogram[3],m.histogram[4]]:m.histogram.slice(0,6));
  for(const condition of ["allColumnTopsShown","groundedColumns","bottomFacesPainted","paintAfterStacking"])assert.equal(q.conditionPolicy[condition],true);
  for(const condition of ["hiddenGaps","hiddenExtraColumns","contactsPainted","sealedCavities"])assert.equal(q.conditionPolicy[condition],false);
  assert.equal(q.sourceRef.pdfPage,34);assert.equal(q.sourceRef.printedPage,36);
  const browserContract={HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_MODELS:models};vm.runInNewContext(contractCode,browserContract);
  assert.deepEqual(normalize(browserContract.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_CONTRACTS.generate(id,variant,level)),normalize(q));
  assert.equal(m.cells.length,variant===0?44:45);assert.equal(m.histogram.length,7);assert.equal(m.histogram[6],0);
  assert.equal(q.histogram.reduce((n,count)=>n+count,0),m.cells.length);
  assert.equal(q.histogram.reduce((n,count,face)=>n+count*face,0),m.paintedFaces);
  assert.deepEqual(q.histogram,[[2,11,15,13,3,0],[2,11,16,12,3,1],[2,11,15,14,2,1]][variant]);
  assert.equal(m.paintedFaces,variant===0?92:96);
  assert.equal(m.heights.flat().reduce((sum,h)=>sum+h,0),m.cells.length);
  assert.equal(m.layerGrids.length,Math.max(...m.heights.flat()));
  assert.deepEqual(m.heights,m.sourceHeights.slice().reverse());
  const expectedHeights=[[4,3,0,0],[4,3,2,1],[4,3,2,2],[4,4,4,4]];
  if(variant===1)expectedHeights[3][0]=5;if(variant===2)expectedHeights[3][3]=5;
  assert.deepEqual(m.sourceHeights,expectedHeights);
  if(variant===0)assert.deepEqual(q.histogram,[2,11,15,13,3,0]);
  const perLayerHistogram=Array(7).fill(0);
  for(const matrix of m.layerGrids){
    assert.equal(matrix.length,4);assert(matrix.every(row=>row.length===4));
    for(const value of matrix.flat())if(value!==null){assert(Number.isSafeInteger(value)&&value>=0&&value<=5);perLayerHistogram[value]++;}
  }
  assert.deepEqual(perLayerHistogram,m.histogram);equationCheck(q);promptCheck(p,level,variant);
  const expectedPrimary=level===0?`3면 ${m.histogram[3]}개, 4면 ${m.histogram[4]}개`:q.histogram.map((n,face)=>`${face}면 ${n}개`).join(", ");
  assert.equal(p.answer,level===2?`(1) ${expectedPrimary}; (2) ${m.paintedFaces*4} cm²`:expectedPrimary);
  assert(!/<\/?\w+\b/.test(p.answer));assert.equal(p.answerKeyVisual,true);
  const unitTokens=notationWindow.HSE_MATH_NOTATION.tokenize(p.answer).filter(token=>token.type==="power");
  assert.deepEqual(normalize(unitTokens),level===2?[{type:"power",base:"cm",power:"2"}]:[]);
  const browserPresentation={HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_CONTRACTS:contracts,HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION:shared};
  vm.runInNewContext(presentationCode,browserPresentation);
  assert.deepEqual(normalize(browserPresentation.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION.render(id,variant,level)),normalize(p));
  const filled=[...p.answerVisual.matchAll(/<td data-face-count="(\d)">(\d+)개<\/td>/g)];
  assert.equal(filled.length,6);filled.forEach((cell,face)=>{assert.equal(Number(cell[1]),face);assert.equal(Number(cell[2]),q.histogram[face]);});
  assert(p.answerVisual.includes('class="source62-painted-answer source62-exploration-answer"'));
  assert.equal((p.answerVisual.match(/data-role="painted-faces"/g)||[]).length,m.layerGrids.length);
  assert.equal((p.answerVisual.match(/<figcaption>/g)||[]).length,m.layerGrids.length);
  assert.equal((p.answerVisual.match(/<g data-x=/g)||[]).length,m.cells.length);
  m.layerGrids.forEach((matrix,index)=>assert(p.answerVisual.includes(shared.grid(matrix,"painted-faces",index+1))));
  assert.equal(q.difficultyDesign.mode,["easy","source","hard"][level]);assert.equal(q.difficultyDesign.empiricallyCalibrated,false);
  assert.equal(q.resultContract,"ordered");assert.equal(Boolean(q.secondary),level===2);
  if(level===2){assert.equal(q.secondary.edge,2);assert.equal(q.secondary.kind,"all-painted-area");assert.equal(q.secondary.answer,m.paintedFaces*4);assert.equal(q.solutionEquations.length,9);}
  else assert.equal(q.solutionEquations.length,level===0?2:6);
  const {api}=fresh(),generatedQ=api.generate(type,7,level-1,123,variant);
  flags(generatedQ);assert.equal(api.generatorKey(type),key);assert.equal(generatedQ.answer,p.answer);
  assert.equal(generatedQ.answerPageLayout,"two-column");assert.equal(generatedQ.answerKeyVisual,true);
  assert.equal(generatedQ.answerVisual,`<div data-print-weight="${level===2?"regular":"compact"}">${p.answerVisual}</div>`);
  assert.equal(generatedQ.generator,key);assert.equal(generatedQ.levelRank,7);assert.equal(generatedQ.difficultyLevel,level);
  assert.equal(generatedQ.difficultyOffset,level-1);assert.equal(generatedQ.sourceDifficultyRank,1);
  assert.equal(generatedQ.generationMode,"fixed-verified-pool");assert.equal(generatedQ.verifiedVariantCount,3);
  assert.equal(generatedQ.verifiedVariantId,`${id}:v${variant}`);assert.equal(generatedQ.verifiedPoolIndex,variant);
  assert(generatedQ.variantProvenance.startsWith("source-conditions-clarified"));generated++;
}
assert.equal(JSON.stringify(models.pools),initialPools);
const contractBadCases=[
  ...["6-2-u3-e3-example-3-1","6-2-u3-e3-example-3-2",null,undefined,{},[id]].map(bad=>[bad,0,1]),
  ...[-1,3,.5,"0",NaN,Infinity,null,undefined,{},true,Number.MAX_SAFE_INTEGER+1].map(bad=>[id,bad,1]),
  ...[-1,3,.5,"1",NaN,Infinity,null,undefined,{},true].map(bad=>[id,0,bad])
];
for(const args of contractBadCases){
  let solveCalls=0;const context={HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_MODELS:{solve(){solveCalls++;throw new Error("Invalid input reached model");}}};
  vm.runInNewContext(contractCode,context);
  rangeError(()=>context.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_CONTRACTS.generate(...args));assert.equal(solveCalls,0);contractRejections++;
}
for(const bad of [-2,2,.5,"0",false,{},[],NaN,Infinity]){const {api}=fresh();rangeError(()=>api.generate(type,1,bad,17,0));routingRejections++;}
for(const bad of [-1,.5,"0",null,false,{},[],NaN,Infinity,Number.MAX_SAFE_INTEGER+1]){const {api}=fresh();rangeError(()=>api.generate(type,1,0,17,bad));routingRejections++;}
const malformed=[{...type,reviewLocked:true},{...type,generatorKey:"old"},{...type,generatorKey:""},{...type,generatorKey:null},{sourceItemId:"unowned",generatorKey:key},{generatorKey:key},Object.assign([],{sourceItemId:id,generatorKey:key}),Object.assign(()=>{},{sourceItemId:id,generatorKey:key})];
for(const bad of malformed){const {api,delegated}=fresh();assert.equal(api.generatorKey(bad),"");assert.equal(api.generate(bad,1,0,17,0),null);assert.equal(delegated.length,0);routingRejections++;}
for(const patch of [{sourceGeometryVerificationPending:true},{sourceGeometryVerificationPending:undefined},{requestedAnswerUnique:false},{sourceConditionsClarified:false},{originalAnswerDeterminate:true}]){
  const {api}=fresh({render(...args){return {...presentation.render(...args),...patch};}});assert.equal(api.generate(type,1,0,17,0),null);routingRejections++;
}
for(const offset of [null,undefined]){const {api}=fresh();assert.equal(api.generate(type,1,offset,17).difficultyLevel,1);}
assert.equal(fresh().api.generatorKey({sourceItemId:id}),key);
assert.equal(fresh().api.generate({sourceItemId:id},1,0,17).verifiedPoolIndex,0);
for(const args of [[{old:true},7,-1,123,4],[{sourceItemId:"6-2-u3-e3-example-3-3"},2,0,19],[null],[],["old",1,2,3,null]]){
  const {api,delegated}=fresh();assert.equal(api.generate(...args),"unchanged-old");assert.equal(delegated.length,1);
  assert.equal(delegated[0].receiver,api);assert.deepEqual(delegated[0].args,args);delegationCases++;
}
for(const other of [null,undefined,"old",{old:true},{sourceItemId:"6-2-u3-e3-example-3-3"}]){
  const {api,delegated}=fresh();assert.equal(api.generatorKey(other),"old-key");assert.equal(delegated[0].receiver,api);assert.deepEqual(delegated[0].args,[other]);delegationCases++;
}
const finite=fresh(),requests=Array.from({length:120},(_,variant)=>finite.api.generate(type,1,0,17,variant));
assert.equal(new Set(requests.map(q=>q.verifiedVariantId)).size,3);
assert.equal(new Set(requests.map(q=>q.prompt)).size,3);
requests.forEach((q,variant)=>assert.equal(q.verifiedPoolIndex,variant%3));
const reload=fresh();vm.runInNewContext(wrapper,{window:reload.window});assert.equal(reload.api.names.filter(name=>name===key).length,1);
assert.throws(()=>vm.runInNewContext(wrapper,{window:{HSE_GENERATORS:{}}}),{name:"Error"});
assert.throws(()=>vm.runInNewContext(wrapper,{window:{HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION:presentation}}),{name:"Error"});

// Compare real older wrapper output before and after this last registration.
const olderFamilies=["stacks","example2","example3","mission3","mission5","mission6"];
const legacyWindow={HSE_GENERATORS:{names:["old"],generatorKey:()=>"",generate:()=>null}};
for(const family of olderFamilies){
  legacyWindow[`HSE_SOURCE_GRADE6_PAINTED_${family.toUpperCase()}_PRESENTATION`]=require(`./source-6-2-painted-${family}-presentation.js`);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,`source-6-2-painted-${family}-questions.js`),"utf8"),{window:legacyWindow});
}
const olderTypes=[
  ["6-2-u3-e3-example-1","sourceGrade6SecondSpaceE3PaintedFaceClasses"],
  ["6-2-u3-e3-mission-2","sourceGrade6SecondSpaceE3NotchedPaintedFaceClasses"],
  ["6-2-u3-e3-mission-4","sourceGrade6SecondSpaceE3AllPaintedArea"],
  ["6-2-u3-e3-mission-1","sourceGrade6SecondSpaceE3UnpaintedInnerCubes"],
  ["6-2-u3-e3-example-2","sourceGrade6SecondSpaceE3PaintBeforeRemoval"],
  ["6-2-u3-e3-example-3-1","sourceGrade6SecondSpaceE3ExactlyTwoRed"],
  ["6-2-u3-e3-example-3-2","sourceGrade6SecondSpaceE3AtLeastOneColor"],
  ["6-2-u3-e3-mission-3","sourceGrade6SecondSpaceE3PaintedFourThree"],
  ["6-2-u3-e3-mission-5-1","sourceGrade6SecondSpaceE3PaintedVolumeInverse"],
  ["6-2-u3-e3-mission-5-2","sourceGrade6SecondSpaceE3PaintedSurfaceInverse"],
  ["6-2-u3-e3-mission-6-1","sourceGrade6SecondSpaceE3PaintedOneFace"],
  ["6-2-u3-e3-mission-6-2","sourceGrade6SecondSpaceE3PaintedNoFace"]
];
const baseline=[];
for(const [sourceItemId,generatorKey] of olderTypes)for(let variant=0;variant<3;variant++)for(let offset=-1;offset<=1;offset++){
  const args=[{sourceItemId,generatorKey,reviewLocked:false},1,offset,17,variant],before=legacyWindow.HSE_GENERATORS.generate(...args);
  assert(before,`Missing older generator ${sourceItemId}`);baseline.push({args,before:normalize(before),oldKey:legacyWindow.HSE_GENERATORS.generatorKey(args[0])});
}
const previousNames=[...legacyWindow.HSE_GENERATORS.names];legacyWindow.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION=presentation;
vm.runInNewContext(wrapper,{window:legacyWindow});
for(const entry of baseline){assert.deepEqual(normalize(legacyWindow.HSE_GENERATORS.generate(...entry.args)),entry.before);assert.equal(legacyWindow.HSE_GENERATORS.generatorKey(entry.args[0]),entry.oldKey);retained++;}
for(const [sourceItemId,generatorKey] of olderTypes){
  const locked={sourceItemId,generatorKey,reviewLocked:true};assert.equal(legacyWindow.HSE_GENERATORS.generatorKey(locked),"");assert.equal(legacyWindow.HSE_GENERATORS.generate(locked,1,0,17,0),null);retainedLocks++;
}
assert.deepEqual(normalize(legacyWindow.HSE_GENERATORS.names),[...previousNames,key]);
assert.equal(legacyWindow.HSE_GENERATORS.generate(type,1,0,17,0).generator,key);
console.log(JSON.stringify({status:"passed",generatedCases:generated,contractRejections,routingRejections,delegationCases,finitePoolRequests:requests.length,distinctVariants:3,
  legacyRetentionCases:retained,legacyLockedCases:retainedLocks,sharedGridAndFontAlignReused:true,sourceConditionsClarified:true,originalAnswerDeterminate:false,
  learner_stage,learnerFit:{id:"learner-fit",status:"pending",criteria:["language","representations","prerequisites","reasoning-load","response-mode"]},
  registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false,browserRun:false,catalogUnlock:false,
  pendingParentGates:["independent model and geometry review","illustration and all-column-top observability","desktop/mobile/browser","actual mixed A4/PDF print","learner-fit and difficulty","teacher/publisher approval","release authority"]}));
