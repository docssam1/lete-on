(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-cube-addition-models.js"));
 else root.HSE_SOURCE_GRADE6_CUBE_ADDITION_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_CUBE_ADDITION_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 function generate(id,variant,level){
  const model=models.solve(id,variant,level);
  let promptText="같은 크기의 쌓기나무 6개를 접착제로 붙여 그림과 같은 모양을 만들었습니다. 여기에 쌓기나무 1개를 더 붙이되, 작은 정사각형 면끼리 꼭 맞게 붙입니다. ";
  if(level===0)promptText+="앞뒤로 겹쳐 붙이지 않고, 처음 모양과 같은 한 개 두께의 납작한 모양만 만듭니다. ";
  promptText+=level===2?"(1) 만들 수 있는 서로 다른 모양은 모두 몇 가지입니까? (2) 처음의 여섯 개 모양을 움직이지 않을 때, 더 붙일 수 있는 서로 다른 자리는 모두 몇 군데입니까? ":"만들 수 있는 서로 다른 모양은 모두 몇 가지입니까? ";
  promptText+="(완성된 모양을 손으로 돌리거나 뒤집어 꼭 겹칠 수 있으면 같은 모양으로 셉니다.)";
  return freeze({...model,model,promptText,studentGiven:{promptText,cells:model.cells,gluedRigid:true,layerCue:null,responseLayers:[]},
   layerCue:null,responseLayers:[],requiresLayerDrawing:false,sourceConditionsClarified:true,requestedAnswerUnique:true,
   conditionScope:"one-aligned-cube-added-to-six-glued-cubes-with-physical-rigid-rotation-equivalence",
   structuralFingerprint:`cube-addition:${models.canonical(model.cells)}:${level===0?"same-plane":"all-six-directions"}:${level===2?"classes-and-positions":"classes"}`,
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",answerOrder:level===2?["different-shapes","fixed-base-attachment-positions"]:["different-shapes"],
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:variant===0,authoredCandidate:true,
    adoptionStatus:"pending",empiricallyCalibrated:false,structuralChange:["처음과 같은 두께의 납작한 모양만 비교합니다.","모든 방향으로 붙인 뒤 실제로 돌려 겹칠 수 있는 모양을 묶습니다.","완성된 모양의 수와 원래 모양에서 붙일 자리 수를 구분합니다."][level]}});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool});
});
