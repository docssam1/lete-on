(() => {
 "use strict";
 const api=window.HSE_GENERATORS,models=window.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_MODELS,contracts=window.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_BANK_PRESENTATION;
 if(!api||!models||!contracts||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw new Error("Three-point cut dependencies must load first");
 const id="6-2-u3-e4-mission-2",key="sourceGrade6SecondSpaceE4ThreePointPrismCut",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>t?.sourceItemId===id||t?.generatorKey===key,matches=t=>t!==null&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Unsupported three-point cut difficulty or variant");
  const pool=variant%3,level=offset+1,expected=contracts.generate(id,pool,level);let q;
  try{q=presentation.render(id,pool,level);if(q.prompt!==presentation.problemHtml(expected)||q.answerVisual!==presentation.answerHtml(expected))return null;}catch{return null;}
  const answer=Array.isArray(expected.answer)?expected.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${expected.answer}개`;
  if(!q||q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||q.requiresOriginalReview!==true||q.originalSourceReleaseStatus!=="locked"||q.sourceExact!==false||
   ["officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(f=>q[f]!==false)||q.difficultyDesign?.empiricallyCalibrated!==false||
   q.layerCue!==null||q.studentGiven?.layerCue!==null||q.requiresLayerDrawing!==false||!Array.isArray(q.responseLayers)||q.responseLayers.length||!Array.isArray(q.studentGiven.responseLayers)||q.studentGiven.responseLayers.length||
   JSON.stringify(q.model)!==JSON.stringify(expected.model)||JSON.stringify(q.studentGiven)!==JSON.stringify(expected.studentGiven)||JSON.stringify(q.answerOrder)!==JSON.stringify(expected.answerOrder)||q.promptText!==expected.promptText||q.solution!==expected.solutionText||q.answer!==answer||
   /<(?:table|svg)\b|math-inline-expression|data-layer=|source62-three-point-answer/.test(q.prompt))return null;
  return {...q,generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,answerPageLayout:"full-width",variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",sourceConditionProvenance:"explicit-learner-given-conditions",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);window.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_QUESTIONS=Object.freeze({keys:Object.freeze({[id]:key}),registrationOnly:true,learnerReleaseVerified:false});
})();
