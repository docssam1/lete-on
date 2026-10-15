(()=>{
 "use strict";
 const api=window.HSE_GENERATORS,presentation=window.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_PRESENTATION;
 if(!api||!presentation||typeof api.generate!=="function"||typeof api.generatorKey!=="function"||!Array.isArray(api.names))throw Error("Final-mission dependencies must load first");
 const keys=Object.freeze({"6-2-u3-e4-mission-5":"sourceGrade6SecondSpaceE4RectangularColoredRemoval","6-2-u3-e4-mission-6":"sourceGrade6SecondSpaceE4TransparentRightView"}),previousKey=api.generatorKey,previousGenerate=api.generate;
 const owns=t=>Boolean(keys[t?.sourceItemId]||Object.values(keys).includes(t?.generatorKey));
 const matches=t=>t&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&Boolean(keys[t.sourceItemId])&&keys[t.sourceItemId]===t.generatorKey;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":keys[t.sourceItemId]:owns(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owns(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if(rank!==undefined&&!Number.isFinite(rank)||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw RangeError("Invalid final-mission finite request");
  const id=t.sourceItemId,contracts=presentation.profiles[id],pool=contracts.pool,chosen=pool[variant%pool.length],level=offset+1,expected=contracts.generate(id,chosen,level);let q;
  try{q=presentation.render(id,chosen,level);if(!q||q.prompt!==presentation.problemHtml(expected)||q.answerVisual!==presentation.answerHtml(expected)||q.answer!==presentation.answerText(expected))return null;}catch{return null;}
  if(q.sourceItemId!==id||q.variant!==chosen||q.level!==level||q.answerKeyVisual!==true||q.requestedAnswerUnique!==true||q.answerVisualRequired!==true||q.originalSourceReleaseStatus!=="locked"||
   ["sourceExact","officialAnswerVerified","publisherAnswerVerified","handwrittenAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(flag=>q[flag]!==false)||
   Object.keys(expected).some(field=>field!=="answer"&&JSON.stringify(q[field])!==JSON.stringify(expected[field]))||q.solution!==expected.solutionText||/<table\b|data-layer=|math-inline-expression/.test(q.prompt))return null;
  return {...q,generator:keys[id],levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,
   generationMode:"fixed-verified-pool",verifiedVariantCount:pool.length,verifiedVariantTarget:pool.length,verifiedPoolIndex:chosen,verifiedVariantId:`${id}:v${chosen}`,
   answerPageLayout:"two-column",variantProvenance:chosen===0&&level===1?"source-structure-matched":"source-structure-variant",registrationOnly:true};
 };
 Object.values(keys).forEach(key=>{if(!api.names.includes(key))api.names.push(key);});
 window.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_QUESTIONS=Object.freeze({keys,registrationOnly:true,learnerReleaseVerified:false});
})();
