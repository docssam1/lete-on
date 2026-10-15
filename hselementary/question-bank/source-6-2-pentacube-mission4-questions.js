(()=>{
 "use strict";
 const api=window.HSE_GENERATORS,contracts=window.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION;
 if(!api||!contracts||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw Error("Pentacube dependencies must load first");
 const id=contracts.sourceItemId,key="sourceGrade6SecondSpaceE4FourCubeAddition",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>t?.sourceItemId===id||t?.generatorKey===key,matches=t=>t&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw RangeError("Invalid finite pentacube request");
  const level=offset+1,expected=contracts.generate(id,0,level);let q;
  try{q=presentation.render(id,0,level);if(q.prompt!==presentation.problemHtml(expected)||q.answerVisual!==presentation.answerHtml(expected)||q.answer!==presentation.answerText(expected))return null;}catch{return null;}
  if(!q||q.sourceItemId!==id||q.variant!==0||q.level!==level||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||q.requiresLayerDrawing!==false||q.layerCue!==null||q.answerKeyVisual!==true||q.answerVisualRequired!==true||q.finiteVariantCount!==1||q.originalSourceReleaseStatus!=="locked"||
   ["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(flag=>q[flag]!==false)||
   Object.keys(expected).some(field=>field!=="answer"&&JSON.stringify(q[field])!==JSON.stringify(expected[field]))||
   q.promptText!==expected.promptText||q.solution!==expected.solutionText||q.scope!==expected.scope||q.groundRestriction!==expected.groundRestriction||q.structuralFingerprint!==expected.structuralFingerprint)return null;
  return {...q,generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
   generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,verifiedPoolIndex:0,verifiedVariantId:`${id}:v0`,
   answerPageLayout:"full-width",variantProvenance:"source-conditions-clarified",sourceConditionProvenance:"explicit-learner-given-conditions",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);
 window.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_QUESTIONS=Object.freeze({sourceItemId:id,key,finiteVariantCount:1,registrationOnly:true,learnerReleaseVerified:false});
})();
