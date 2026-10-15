(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_PRESENTATION;
  if(!api||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw new Error("Notched presentation and generators must load first");
  const id="6-2-u3-e2-mission-5",key="sourceGrade6SecondSpaceE2NotchedVisibility",keys=Object.freeze({[id]:key});
  const previousKey=api.generatorKey,previousGenerate=api.generate;
  const owned=t=>t?.sourceItemId===id||t?.generatorKey===key;
  const matches=t=>t!==null&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
  api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owned(t)?"":previousKey.apply(this,arguments);};
  api.generate=function(t,rank,offset,seed,variant){
    if(!matches(t))return owned(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;
    if(offset===undefined)offset=0;if(variant===undefined)variant=0;
    if(![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Unsupported notched difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(id,pool,level);
    const images=typeof q.prompt==="string"?[...q.prompt.matchAll(/<img\b[^>]*>/gi)]:[];
    if(q.layerCue!==null||images.length!==1||
      !images[0][0].includes(`src="./assets/source-6-2-notched-mission5/v${pool}-given.png"`)||
      /<(?:table|svg)\b|math-inline-expression|data-source-answer-layer|source62-notched-answer/i.test(q.prompt))return null;
    if(q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.requestedAnswerUnique!==true||q.originalSourceReleaseStatus!=="locked"||q.sourceExact!==false||q.publisherAnswerVerified!==false||q.learnerReleaseVerified!==false)return null;
    return {...q,generator:key,levelRank:rank,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,
      verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
      answerPageLayout:"two-column",variantProvenance:"source-conditions-clarified-variant",sourceConditionProvenance:"explicit-learner-given-conditions",officialAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_QUESTIONS=Object.freeze({keys,registrationOnly:true,learnerReleaseVerified:false});
})();
