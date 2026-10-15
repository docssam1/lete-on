(()=>{
 "use strict";
 const api=window.HSE_GENERATORS,contracts=window.HSE_SOURCE_GRADE6_RATIO_E2_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_RATIO_E2_PRESENTATION;
 if(!api||!contracts||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw Error("Ratio E2 dependencies must load first");
 const suffixes=["Compound","SharedSymbols","StrideSteps","EqualDrink","WeightedMean","SharedBlank","SalePrices","OverlappingAreas","SpentMoney","LeakingBath","GrowingCounts"],keys=Object.freeze(Object.fromEntries(contracts.sourceItemIds.map((id,i)=>[id,`sourceGrade6SecondRatioE2${suffixes[i]}`]))),previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>Boolean(keys[t?.sourceItemId]||Object.values(keys).includes(t?.generatorKey)),matches=t=>t&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&Boolean(keys[t.sourceItemId])&&keys[t.sourceItemId]===t.generatorKey;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":keys[t.sourceItemId]:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if(rank!==undefined&&!Number.isFinite(rank)||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw RangeError("Invalid finite E2 request");
  const id=t.sourceItemId,pool=variant%3,level=offset+1,expected=contracts.generate(id,pool,level);let q;
  try{q=presentation.render(id,pool,level);if(!q||q.prompt!==presentation.problemHtml(expected)||q.answerVisual!==presentation.answerHtml(expected)||q.answer!==expected.answerText)return null;}catch{return null;}
  if(q.sourceItemId!==id||q.variant!==pool||q.level!==level||q.answerKeyVisual!==(expected.figures.length>0)||q.requestedAnswerUnique!==true||q.answerVisualRequired!==true||q.originalSourceReleaseStatus!=="locked"||["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(flag=>q[flag]!==false)||Object.keys(expected).some(field=>JSON.stringify(q[field])!==JSON.stringify(expected[field]))||typeof q.solution!=="string"||!q.solution.trim()||/<table\b|data-answer=|math-inline-expression|ratio-e2-teacher/.test(q.prompt))return null;
  return {...q,generator:keys[id],levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,answerPageLayout:"two-column",variantProvenance:pool===0&&level===1?"source-structure-matched":"source-structure-variant",registrationOnly:true};
 };
 Object.values(keys).forEach(key=>{if(!api.names.includes(key))api.names.push(key);});window.HSE_SOURCE_GRADE6_RATIO_E2_QUESTIONS=Object.freeze({keys,registrationOnly:true,learnerReleaseVerified:false});
})();
