(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION;
  if(!api||!presentation)throw new Error("Painted exploration presentation must load first");
  const id="6-2-u3-e3-exploration",key="sourceGrade6SecondSpaceE3PaintedExploration";
  const keys=Object.freeze({[id]:key}),oldKey=api.generatorKey,oldGenerate=api.generate;
  const objectType=type=>type!==null&&typeof type==="object"&&!Array.isArray(type);
  const owned=type=>type?.sourceItemId===id||type?.generatorKey===key;
  const matches=type=>objectType(type)&&type.sourceItemId===id&&(type.generatorKey===undefined||type.generatorKey===key);
  api.generatorKey=type=>matches(type)?type.reviewLocked?"":key:owned(type)?"":oldKey.call(api,type);
  api.generate=function(type,rank,offset,seed,variant){
    if(!matches(type))return owned(type)?null:oldGenerate.apply(api,arguments);
    if(type.reviewLocked)return null;
    offset??=0;if(variant===undefined)variant=0;
    if(![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Invalid painted exploration difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(id,pool,level);
    if(q.sourceGeometryVerificationPending!==false||q.requestedAnswerUnique!==true||q.sourceConditionsClarified!==true||q.originalAnswerDeterminate!==false)return null;
    return {...q,answerVisual:`<div data-print-weight="${level===2?"regular":"compact"}">${q.answerVisual}</div>`,generator:key,levelRank:rank,
      generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:"two-column",
      variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",
      sourceConditionProvenance:"explicit-learner-given-conditions",sourceExact:false,
      registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_QUESTIONS=Object.freeze({keys,registrationOnly:true,learnerReleaseVerified:false});
})();
