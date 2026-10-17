(() => {
 "use strict";
 const api=window.HSE_GENERATORS,models=window.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_MODELS,presentation=window.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_PRESENTATION,assets=window.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_ASSETS;
 if(!api||!models||!presentation||!assets||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw new Error("Opposite-removal dependencies must load first");
 const id="6-2-u3-e4-example-3",key="sourceGrade6SecondSpaceE4OppositeFaceRemoval",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>t?.sourceItemId===id||t?.generatorKey===key;
 const matches=t=>t!==null&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;
  if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Unsupported opposite-removal variant or difficulty");
  const pool=variant%3,level=offset+1,q=presentation.render(id,pool,level),expected=models.solve(id,pool,level);
  if(!q||q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.model?.n!==5||q.conditionScope!==expected.conditionScope||
   q.sourceConditionsClarified!==true||q.requestedAnswerUnique!==true||q.requiresOriginalReview!==true||
   q.originalSourceReleaseStatus!=="locked"||q.sourceExact!==false||q.officialAnswerVerified!==false||q.publisherAnswerVerified!==false||
   q.handwrittenAnswerVerified!==false||q.humanApproved!==false||q.learnerReleaseVerified!==false||q.empiricallyCalibrated!==false||
   q.studentGiven?.solidFilled!==true||q.studentGiven.layerCue!==null||q.layerCue!==null||q.requiresLayerDrawing!==false||
   !Array.isArray(q.responseLayers)||q.responseLayers.length||!Array.isArray(q.studentGiven.responseLayers)||q.studentGiven.responseLayers.length||
   typeof q.prompt!=="string"||typeof q.answerVisual!=="string"||!q.answerVisual.trim()||
   JSON.stringify(q.model.remaining)!==JSON.stringify(expected.remaining)||
   JSON.stringify(q.studentGiven.paintedFaces)!==JSON.stringify(expected.faces)||
   JSON.stringify(q.studentGiven.activeDirections)!==JSON.stringify(expected.axes))return null;
  const expectedAnswer=Array.isArray(expected.answer)?expected.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${expected.answer}개`;
  if(q.answer!==expectedAnswer)return null;
  const images=[...q.prompt.matchAll(/<img\b[^>]*>/gi)],file=`v${pool}-given.png`,metadata=assets.image(file);
  if(!metadata||metadata.variant!==pool||metadata.kind!=="given"||metadata.width!==1600||metadata.height!==1600||metadata.sourceItemId!==id||
   metadata.positionsPreserved!==true||metadata.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(metadata.sha256)||
   images.length!==1||!images[0][0].includes(`src="./assets/source-6-2-opposite-removal/${file}"`)||
   /<(?:table|svg)\b|math-inline-expression|data-layer=|source62-opposite-removal-answer/.test(q.prompt))return null;
  const context=(html,role)=>`<div data-opposite-removal-context="${role}" data-source-item-id="${id}" data-variant="${pool}" data-level="${level}">${html}</div>`;
  return {...q,prompt:context(q.prompt,"problem"),answerVisual:context(q.answerVisual,"teacher"),generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
   generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,
   answerPageLayout:"two-column",variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",
   sourceConditionProvenance:"explicit-learner-given-conditions",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);
 window.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_QUESTIONS=Object.freeze({keys:Object.freeze({[id]:key}),registrationOnly:true,learnerReleaseVerified:false});
})();
