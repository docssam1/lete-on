(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_PRESENTATION;if(!api||!presentation)throw new Error("Painted L prism presentation must load first");
  const keys={"6-2-u3-e3-example-3-1":"sourceGrade6SecondSpaceE3ExactlyTwoRed","6-2-u3-e3-example-3-2":"sourceGrade6SecondSpaceE3AtLeastOneColor"},oldKey=api.generatorKey,oldGenerate=api.generate;
  const owned=t=>Object.hasOwn(keys,t?.sourceItemId)||Object.values(keys).includes(t?.generatorKey),matches=t=>Object.hasOwn(keys,t?.sourceItemId)&&(!t.generatorKey||t.generatorKey===keys[t.sourceItemId]);
  api.generatorKey=t=>matches(t)?t.reviewLocked?"":keys[t.sourceItemId]:owned(t)?"":oldKey(t);
  api.generate=(type,rank,offset,seed,variant=0)=>{
    if(!matches(type))return owned(type)?null:oldGenerate(type,rank,offset,seed,variant);if(type.reviewLocked)return null;offset??=0;
    if(![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Invalid painted L prism difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(type.sourceItemId,pool,level);if(q.sourceGeometryVerificationPending)return null;
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,generator:keys[type.sourceItemId],levelRank:rank,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${type.sourceItemId}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:"two-column",variantProvenance:pool===0&&level===1?"source-values":"source-structure-variant",publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  for(const key of Object.values(keys))if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_QUESTIONS=Object.freeze({keys:Object.freeze(keys),registrationOnly:true});
})();
