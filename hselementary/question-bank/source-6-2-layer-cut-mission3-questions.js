(()=>{
 "use strict";
 const api=window.HSE_GENERATORS,contracts=window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_CONTRACTS,presentation=window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_BANK_PRESENTATION;
 if(!api||!contracts||!presentation||typeof api.generatorKey!=="function"||typeof api.generate!=="function"||!Array.isArray(api.names))throw Error("Layer-section dependencies must load first");
 const raw="6-2-u3-e4-mission-3",id=raw+"-1",alias=raw+"-2",key="sourceGrade6SecondSpaceE4LayerSectionAndCount",previousKey=api.generatorKey,previousGenerate=api.generate;
 const owned=t=>[raw,id,alias].includes(t?.sourceItemId)||t?.generatorKey===key,matches=t=>t&&typeof t==="object"&&!Array.isArray(t)&&Object.hasOwn(t,"sourceItemId")&&Object.hasOwn(t,"generatorKey")&&t.sourceItemId===id&&t.generatorKey===key;
 api.generatorKey=function(t){return matches(t)?t.reviewLocked?"":key:owned(t)?"":previousKey.apply(this,arguments);};
 api.generate=function(t,rank,offset,seed,variant){
  if(!matches(t))return owned(t)?null:previousGenerate.apply(this,arguments);if(t.reviewLocked)return null;if(offset===undefined)offset=0;if(variant===undefined)variant=0;
  if((rank!==undefined&&!Number.isFinite(rank))||![-1,0,1].includes(offset)||!Number.isSafeInteger(variant)||variant<0)throw RangeError("Invalid layer-cut variant or level");
  const pool=variant%3,level=offset+1,expected=contracts.generate(raw,pool,level);let q;
  try{q=presentation.render(raw,pool,level);if(q.prompt!==presentation.problemHtml(expected)||q.answerVisual!==presentation.answerHtml(expected))return null;}catch{return null;}
  if(!q||q.sourceItemId!==raw||q.variant!==pool||q.level!==level||q.requiresLayerDrawing!==true||q.answerDrawingRequired!==true||q.answerVisualRequired!==true||q.numericAnswerDoesNotValidateDrawing!==true||q.requestedAnswerUnique!==true||q.drawingRubric?.numericAnswerAloneSufficient!==false||q.drawingRubric?.automaticDrawingGradingImplemented!==false||q.originalSourceReleaseStatus!=="locked"||
   ["sourceExact","officialAnswerVerified","publisherAnswerVerified","humanApproved","learnerReleaseVerified","empiricallyCalibrated"].some(field=>q[field]!==false)||
   JSON.stringify(q.model)!==JSON.stringify(expected.model)||JSON.stringify(q.studentGiven)!==JSON.stringify(expected.studentGiven)||JSON.stringify(q.requestedLayers)!==JSON.stringify(expected.requestedLayers)||JSON.stringify(q.answerDrawing)!==JSON.stringify(expected.answerDrawing)||JSON.stringify(q.drawingRubric)!==JSON.stringify(expected.drawingRubric)||JSON.stringify(q.difficultyDesign)!==JSON.stringify(expected.difficultyDesign)||q.promptText!==expected.promptText||q.solution!==expected.solutionText||q.structuralFingerprint!==expected.structuralFingerprint||q.answer!==presentation.answerText(expected)||q.answerKeyVisual!==true)return null;
  return {...q,sourceItemId:id,rawSourceItemId:raw,generator:key,levelRank:rank,difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,sourceDifficultyRank:1,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${id}:v${pool}`,sourceRelationship:"same-source-compound-owner",answerPageLayout:"full-width",variantProvenance:pool===0&&level===1?"source-conditions-clarified":"source-conditions-clarified-variant",registrationOnly:true};
 };
 if(!api.names.includes(key))api.names.push(key);window.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_QUESTIONS=Object.freeze({sourceItemId:id,rawSourceItemId:raw,aliasId:alias,key,registrationOnly:true,learnerReleaseVerified:false});
})();
