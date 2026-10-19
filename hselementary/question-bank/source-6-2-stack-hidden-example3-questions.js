(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_PRESENTATION;
  if(!api || !presentation)throw new Error("Hidden-cube contracts and figures must be loaded first");
  const sourceItemId="6-2-u3-e2-example-3",key="sourceGrade6SecondSpaceE2HiddenCubes";
  const previousKey=api.generatorKey,previousGenerate=api.generate;
  const owned=type=>type?.sourceItemId===sourceItemId || type?.generatorKey===key;
  const resolves=type=>type?.sourceItemId===sourceItemId && (!type.generatorKey || type.generatorKey===key);
  api.generatorKey=type=>resolves(type) ? type.reviewLocked ? "" : key : owned(type) ? "" : previousKey(type);
  api.generate=(type,rank,offset,seed,variant=0)=>{
    if(!resolves(type))return owned(type) ? null : previousGenerate(type,rank,offset,seed,variant);
    if(type.reviewLocked)return null;offset ??=0;
    if(![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant<0)throw new RangeError("Invalid hidden-cube difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(sourceItemId,pool,level);
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,sourceItemId,generator:key,levelRank:rank,
      generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,
      verifiedVariantId:`${sourceItemId}:v${pool}`,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
      variantProvenance:pool===0 && level===1 ? "source-values" : "source-structure-variant",answerPageLayout:"two-column",
      publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_QUESTIONS=Object.freeze({sourceItemId,key,registrationOnly:true});
})();
