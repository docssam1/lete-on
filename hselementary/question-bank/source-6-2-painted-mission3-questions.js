(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_PAINTED_MISSION3_PRESENTATION;
  if(!api || !presentation)throw new Error("Mission3 presentation must be loaded first");
  const sourceItemId="6-2-u3-e3-mission-3",key="sourceGrade6SecondSpaceE3PaintedFourThree",oldKey=api.generatorKey,oldGenerate=api.generate;
  const owned=type=>type?.sourceItemId===sourceItemId || type?.generatorKey===key;
  const matches=type=>type?.sourceItemId===sourceItemId && (!type.generatorKey || type.generatorKey===key);
  api.generatorKey=type=>matches(type) ? type.reviewLocked ? "" : key : owned(type) ? "" : oldKey(type);
  api.generate=(type,rank,offset,seed,variant=0)=>{
    if(!matches(type))return owned(type) ? null : oldGenerate(type,rank,offset,seed,variant);if(type.reviewLocked)return null;offset??=0;
    if(![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant<0)throw new RangeError("Invalid Mission3 difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(pool,level);
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,generator:key,levelRank:rank,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${sourceItemId}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:"two-column",variantProvenance:pool===0&&level===1 ? "source-values" : "source-structure-variant",publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_PAINTED_MISSION3_QUESTIONS=Object.freeze({sourceItemId,key,registrationOnly:true});
})();
