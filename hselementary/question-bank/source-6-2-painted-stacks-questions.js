(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION;
  if(!api || !presentation)throw new Error("Painted stack contracts must be loaded first");
  const definitions=Object.freeze([
    {sourceItemId:"6-2-u3-e3-example-1",key:"sourceGrade6SecondSpaceE3PaintedFaceClasses"},
    {sourceItemId:"6-2-u3-e3-mission-2",key:"sourceGrade6SecondSpaceE3NotchedPaintedFaceClasses"},
    {sourceItemId:"6-2-u3-e3-mission-4",key:"sourceGrade6SecondSpaceE3AllPaintedArea"},
    {sourceItemId:"6-2-u3-e3-mission-1",key:"sourceGrade6SecondSpaceE3UnpaintedInnerCubes"}
  ].map(Object.freeze));
  const previousKey=api.generatorKey,previousGenerate=api.generate,owned=type=>definitions.some(d=>d.sourceItemId===type?.sourceItemId || d.key===type?.generatorKey),resolve=type=>definitions.find(d=>d.sourceItemId===type?.sourceItemId && (!type.generatorKey || type.generatorKey===d.key));
  api.generatorKey=type=>{const d=resolve(type);return d ? type.reviewLocked ? "" : d.key : owned(type) ? "" : previousKey(type);};
  api.generate=(type,rank,offset,seed,variant=0)=>{
    const d=resolve(type);if(!d)return owned(type) ? null : previousGenerate(type,rank,offset,seed,variant);if(type.reviewLocked)return null;offset??=0;
    if(![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant<0)throw new RangeError("Invalid painted stack difficulty or variant");
    const pool=variant%3,level=offset+1,q=presentation.render(d.sourceItemId,pool,level);
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,sourceItemId:d.sourceItemId,generator:d.key,levelRank:rank,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${d.sourceItemId}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,answerPageLayout:"two-column",variantProvenance:pool===0 && level===1 ? "source-values" : "source-structure-variant",publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  for(const d of definitions)if(!api.names.includes(d.key))api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_PAINTED_STACKS_QUESTIONS=Object.freeze({definitions,registrationOnly:true});
})();
