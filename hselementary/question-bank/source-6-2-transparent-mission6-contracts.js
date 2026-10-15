(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-transparent-mission6-models.js"));
 else root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 function generate(id,variant,level){const model=models.solve(id,variant,level);
  const promptText="같은 크기의 투명한 유리상자 18개로 그림과 같은 직육면체를 만들었습니다. 그중 몇 개를 같은 크기의 검은색 상자로 바꾸었습니다. 위에서 직사각형 ABCD를 본 모양은 (가), 직사각형 BEFC의 정면에서 본 모양은 (나)와 같습니다. "+
   (level===0?"직사각형 CFGD의 정면에서 본 맨 위층의 모양을 그리시오.":"직사각형 CFGD의 정면에서 본 모양을 그리시오.")+
   (level===2?" 검은색 상자의 개수는 가장 적을 때와 가장 많을 때 각각 몇 개인지 구하시오.":"");
  const solutionText=level===0?"윗면과 앞면의 맨 위층에 보이는 검은 칸을 함께 살펴 오른쪽에서 보이는 칸을 칠합니다.":
   "위에서 본 모양의 흰 칸에는 그 아래 어느 높이에도 검은색 상자가 없습니다. 앞에서 본 흰 칸에도 그 뒤로 검은색 상자가 없습니다. 두 그림의 검은 칸을 모두 만족하는 배치에서 오른쪽으로 보이는 모양은 정답 그림과 같습니다."+
   (level===2?` 검은색 상자는 가장 적게 ${model.result.minBlackCount}개, 가장 많게 ${model.result.maxBlackCount}개를 넣을 수 있습니다.`:"");
  return freeze({...model,model,promptText,solutionText,studentGiven:{promptText,dimensions:model.dimensions,points:model.points,topRowsBackToFront:model.topRowsBackToFront,frontRowsTopToBottom:model.frontRowsTopToBottom,responseRows:level===0?1:3,layerCue:null},
   requiresDrawing:true,answerDrawingRequired:true,answerVisualRequired:true,numericAnswerDoesNotValidateDrawing:true,requestedAnswerUnique:true,
   drawingRubric:{shape:"right-face-binary-grid",rows:level===0?1:3,columns:2,orderedBySourceVertices:true,numericAnswerAloneSufficient:false,automaticDrawingGradingImplemented:false},
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",structuralFingerprint:`${id}:${JSON.stringify([model.topRowsBackToFront,model.frontRowsTopToBottom])}:${level}`,
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:true,sourceGivensMatch:variant===0,sourceTaskMatches:level===1,authoredCandidate:true,adoptionStatus:"pending",empiricallyCalibrated:false,
    structuralChange:["맨 위층의 오른쪽 모습만 그립니다.","위와 앞에서 본 두 그림으로 오른쪽 모습을 그립니다.","같은 두 그림을 만드는 모든 배치에서 오른쪽 모습과 검은 상자의 가장 적은 수·가장 많은 수를 구합니다."][level]}});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool,registrationOnly:true,learnerReleaseVerified:false});
});
