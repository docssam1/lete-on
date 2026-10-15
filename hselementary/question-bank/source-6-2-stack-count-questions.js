(() => {
  "use strict";
  const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_STACK_COUNT_PRESENTATION;
  if(!api || !presentation) throw new Error("쌓기 방법의 조건과 그림을 먼저 불러와야 합니다.");
  const definitions=Object.freeze([
    {sourceItemId:"6-2-u3-e2-exploration-1",key:"sourceGrade6SecondSpaceE2StackMethodCount"},
    {sourceItemId:"6-2-u3-e2-exploration-2",key:"sourceGrade6SecondSpaceE2StackMinMax"},
    {sourceItemId:"6-2-u3-e2-example-1",key:"sourceGrade6SecondSpaceE2StackSixCellCount"},
    {sourceItemId:"6-2-u3-e2-mission-4",key:"sourceGrade6SecondSpaceE2StackSevenCellViews"},
    {sourceItemId:"6-2-u3-e2-mission-6",key:"sourceGrade6SecondSpaceE2StackFiveCellCount"},
    {sourceItemId:"6-2-u3-e2-mission-2",key:"sourceGrade6SecondSpaceE2StackNineCellMinMax"}
  ].map(Object.freeze));
  const previousKey=api.generatorKey,previousGenerate=api.generate;
  const owned=type=>definitions.some(d=>d.sourceItemId===type?.sourceItemId || d.key===type?.generatorKey);
  const resolve=type=>definitions.find(d=>d.sourceItemId===type?.sourceItemId && (!type.generatorKey || type.generatorKey===d.key));
  api.generatorKey=type=>{const d=resolve(type);return d ? type.reviewLocked ? "" : d.key : owned(type) ? "" : previousKey(type);};
  api.generate=(type,rank,offset,seed,variant=0)=>{
    const d=resolve(type);
    if(!d) return owned(type) ? null : previousGenerate(type,rank,offset,seed,variant);
    if(type.reviewLocked) return null;
    offset ??= 0;
    if(![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant<0) throw new RangeError("쌓기 방법 문항의 난이도 또는 변형 번호가 올바르지 않습니다.");
    const pool=variant%3,level=offset+1,q=presentation.render(d.sourceItemId,pool,level);
    return {...q,answerVisual:`<div data-print-weight="compact">${q.answerVisual}</div>`,
      sourceItemId:d.sourceItemId,generator:d.key,levelRank:rank,
      generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,
      verifiedPoolIndex:pool,verifiedVariantId:`${d.sourceItemId}:v${pool}`,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
      variantProvenance:pool===0 && level===1 ? "source-values" : "source-structure-variant",
      answerPageLayout:"two-column",publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  for(const d of definitions) if(!api.names.includes(d.key)) api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_STACK_COUNT_QUESTIONS=Object.freeze({definitions,registrationOnly:true});
})();
