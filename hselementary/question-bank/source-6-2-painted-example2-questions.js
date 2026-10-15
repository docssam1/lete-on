(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_PRESENTATION;
  if(!api||!presentation)throw new Error("Paint-before-removal presentation must load first");
  const id="6-2-u3-e3-example-2",key="sourceGrade6SecondSpaceE3PaintBeforeRemoval",oldKey=api.generatorKey,oldGenerate=api.generate;
  const owned=t=>t?.sourceItemId===id||t?.generatorKey===key,matches=t=>t?.sourceItemId===id&&(!t.generatorKey||t.generatorKey===key);
  api.generatorKey=t=>matches(t)?t.reviewLocked?"":key:owned(t)?"":oldKey(t);
  api.generate=(type,rank,offset,seed,variant=0)=>{
    if(!matches(type))return owned(type)?null:oldGenerate(type,rank,offset,seed,variant);
    if(type.reviewLocked)return null;offset??=0;
    if(![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw new RangeError("Invalid paint-before-removal difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(pool,level);
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,generator:key,levelRank:rank,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:"two-column",variantProvenance:"source-structure-clarified-variant",publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  if(!api.names.includes(key))api.names.push(key);
  window.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_QUESTIONS=Object.freeze({sourceItemId:id,generatorKey:key,registrationOnly:true});
})();
