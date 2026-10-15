(() => {
 "use strict";
 const api=window.HSE_GENERATORS,models=window.HSE_SOURCE_GRADE6_CUBE_ADDITION_MODELS,presentation=window.HSE_SOURCE_GRADE6_CUBE_ADDITION_PRESENTATION,assets=window.HSE_SOURCE_GRADE6_CUBE_ADDITION_ASSETS;
 if(!api||!models||!presentation||!assets||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw new Error("Cube-addition dependencies must load first");
 const id="6-2-u3-e4-example-4",key="sourceGrade6SecondSpaceE4SingleCubeAddition",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>t?.sourceItemId===id||t?.generatorKey===key,matches=t=>t!==null&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;
  if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Unsupported cube-addition variant or difficulty");
  const pool=variant%3,level=offset+1,q=presentation.render(id,pool,level),expected=models.solve(id,pool,level),meta=assets.image(pool);
  if(!q||q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||q.requiresOriginalReview!==true||
   q.originalSourceReleaseStatus!=="locked"||q.sourceExact!==false||q.studentGiven?.gluedRigid!==true||q.layerCue!==null||q.studentGiven.layerCue!==null||
   q.requiresLayerDrawing!==false||!Array.isArray(q.responseLayers)||q.responseLayers.length||!Array.isArray(q.studentGiven.responseLayers)||q.studentGiven.responseLayers.length||
   ["officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(flag=>q[flag]!==false)||
   JSON.stringify(q.studentGiven.cells)!==JSON.stringify(expected.cells)||JSON.stringify(q.model)!==JSON.stringify(expected)||
   typeof q.prompt!=="string"||typeof q.answerVisual!=="string"||!q.answerVisual.trim())return null;
  const answer=level===2?`(1) ${expected.answer[0]}가지; (2) ${expected.answer[1]}군데`:`${expected.answer}가지`,images=[...q.prompt.matchAll(/<img\b[^>]*>/gi)];
  if(q.answer!==answer||!meta||meta.kind!=="given"||meta.variant!==pool||meta.sourceItemId!==id||meta.cubeCount!==6||meta.readableCubeCount!==6||
   meta.heightColumnCompressionUsed!==false||meta.width!==1600||meta.height!==1600||!/^[a-f0-9]{64}$/.test(meta.sha256)||images.length!==1||
   !images[0][0].includes(`src="./assets/source-6-2-cube-addition/v${pool}-given.png"`)||/<(?:table|svg)\b|math-inline-expression|data-layer=|source62-cube-addition-answer/.test(q.prompt))return null;
  const context=(html,role)=>`<div data-cube-addition-context="${role}" data-source-item-id="${id}" data-variant="${pool}" data-level="${level}">${html}</div>`;
  return {...q,prompt:context(q.prompt,"problem"),answerVisual:context(q.answerVisual,"teacher"),generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
   generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,
   answerPageLayout:"full-width",variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",sourceConditionProvenance:"explicit-learner-given-conditions",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);
 window.HSE_SOURCE_GRADE6_CUBE_ADDITION_QUESTIONS=Object.freeze({keys:Object.freeze({[id]:key}),registrationOnly:true,learnerReleaseVerified:false});
})();
