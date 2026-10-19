(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_BORDER_MISSION3_PRESENTATION;
  if(!api||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))
    throw new Error("Border mission-3 presentation and generators must load first");
  const id="6-2-u3-e2-mission-3",key="sourceGrade6SecondSpaceE2BorderDifference";
  const previousKey=api.generatorKey,previousGenerate=api.generate;
  const owned=type=>type?.sourceItemId===id||type?.generatorKey===key;
  const matches=type=>type!==null&&typeof type==="object"&&!Array.isArray(type)&&Object.hasOwn(type,"sourceItemId")&&Object.hasOwn(type,"generatorKey")&&type.sourceItemId===id&&type.generatorKey===key;
  api.generatorKey=function(type){return matches(type)?type.reviewLocked?"":key:owned(type)?"":previousKey.apply(this,arguments);};
  api.generate=function(type,rank,offset,seed,variant){
    if(!matches(type))return owned(type)?null:previousGenerate.apply(this,arguments);
    if(type.reviewLocked)return null;
    if(offset===undefined)offset=0;
    if(variant===undefined)variant=0;
    if(![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Invalid border mission-3 difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(id,pool,level);
    if(q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||
      q.sourceExact!==false||q.originalAnswerDeterminate!==false||q.originalSourceReleaseStatus!=="locked"||
      q.registrationOnly!==true||q.learnerReleaseVerified!==false||q.officialAnswerVerified!==false||
      q.officialHumanApproval!==false||q.publisherAnswerVerified!==false||q.handwrittenAnswerVerified!==false||q.constructionConditionApproved!==false)return null;
    return {...q,answerVisual:`<div data-print-weight="regular3">${q.answerVisual}</div>`,generator:key,levelRank:rank,
      generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:level===2?"single-column":"two-column",
      variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",
      sourceConditionProvenance:"explicit-learner-given-conditions",answerUniqueScope:"explicit-learner-given-conditions-only",registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_BORDER_MISSION3_QUESTIONS=Object.freeze({keys:Object.freeze({[id]:key}),registrationOnly:true,learnerReleaseVerified:false});
})();
