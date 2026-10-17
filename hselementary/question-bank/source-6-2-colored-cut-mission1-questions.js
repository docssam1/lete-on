(() => {
 "use strict";
 const api=window.HSE_GENERATORS,models=window.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_MODELS,presentation=window.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_PRESENTATION,assets=window.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_ASSETS;
 if(!api||!models||!presentation||!assets||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw new Error("Colored-cut dependencies must load first");
 const id="6-2-u3-e4-mission-1",key="sourceGrade6SecondSpaceE4ColoredPlaneCut",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>t?.sourceItemId===id||t?.generatorKey===key,matches=t=>t!==null&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Unsupported colored-cut difficulty or variant");
  const pool=variant%3,level=offset+1,q=presentation.renderBank(id,pool,level),expected=models.solve(id,pool),a=assets.image(pool,"given");
  if(!q||q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||q.requiresOriginalReview!==true||q.originalSourceReleaseStatus!=="locked"||q.sourceExact!==false||
   ["officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(flag=>q[flag]!==false)||q.difficultyDesign?.empiricallyCalibrated!==false||
   q.layerCue!==null||q.studentGiven?.layerCue!==null||q.requiresLayerDrawing!==false||!Array.isArray(q.responseLayers)||q.responseLayers.length||!Array.isArray(q.studentGiven.responseLayers)||q.studentGiven.responseLayers.length||
   JSON.stringify(q.model)!==JSON.stringify(expected)||JSON.stringify(q.studentGiven.dimensions)!=="[5,4,5]"||JSON.stringify(q.studentGiven.points)!==JSON.stringify(expected.points)||
   JSON.stringify(q.studentGiven.frontRows)!==JSON.stringify(expected.frontRows)||JSON.stringify(q.studentGiven.topRows)!==JSON.stringify(expected.topRows)||q.studentGiven.darkPatternScope!==expected.darkPatternScope||
   typeof q.prompt!=="string"||typeof q.answerVisual!=="string"||!q.answerVisual.trim())return null;
  const count=level===0?expected.frontDarkCutCells.length:expected.darkCutCount,answer=level===2?`(1) ${count}개; (2) ${expected.darkUncutCount}개`:`${count}개`,images=[...q.prompt.matchAll(/<img\b[^>]*>/gi)];
  // This figure has one canonical tag; decoy or duplicate source attributes are invalid.
  const expectedImage=`<img src="./assets/source-6-2-colored-cut-mission1/v${pool}-given.png" width="1600" height="1649" alt="두 가지 색 쌓기나무로 만든 직육면체와 점 가, 나, 다, 라" data-glyph-size="72">`;
  if(q.answer!==answer||!a||a.sourceItemId!==id||a.variant!==pool||a.kind!=="given"||a.width!==1600||a.height!==1649||a.glyphSize!==72||a.sourceDarkPatternPreserved!==true||JSON.stringify(a.dimensions)!=="[5,4,5]"||!/^[a-f0-9]{64}$/.test(a.sha256)||
   images.length!==1||images[0][0]!==expectedImage||/<(?:table|svg)\b|math-inline-expression|data-layer=|source62-colored-cut-answer/.test(q.prompt))return null;
  const context=(html,role)=>`<div data-colored-cut-context="${role}" data-source-item-id="${id}" data-variant="${pool}" data-level="${level}">${html}</div>`;
  return {...q,prompt:context(q.prompt,"problem"),answerVisual:context(q.answerVisual,"teacher"),generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
   generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,answerPageLayout:"full-width",
   variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",sourceConditionProvenance:"explicit-learner-given-conditions",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);window.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_QUESTIONS=Object.freeze({keys:Object.freeze({[id]:key}),registrationOnly:true,learnerReleaseVerified:false});
})();
