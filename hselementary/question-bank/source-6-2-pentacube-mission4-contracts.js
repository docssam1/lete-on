(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-pentacube-mission4-models.js"));
 else root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 function generate(id,variant,level){
  const model=models.solve(id,variant,level);
  const condition=[
   "처음 모양을 그대로 바닥에 놓고, 더 붙이는 쌓기나무도 바닥에 닿게 합니다. ",
   "처음 모양은 그림과 같이 바닥에 둡니다. 더 붙이는 쌓기나무의 밑면 전체는 바닥이나 처음 쌓기나무의 윗면에 닿아야 합니다. ",
   "처음 모양을 손에 들고 어느 방향으로든 붙일 수 있습니다. "
  ][level];
  const promptText="같은 크기의 쌓기나무 네 개를 붙여 그림과 같은 모양을 만들었습니다. 정사각형 면끼리 꼭 맞게 쌓기나무 한 개를 더 붙입니다. "+condition+
   (level===2?"(1) 서로 다른 완성 모양은 모두 몇 가지입니까? (2) 처음 모양을 움직이지 않을 때 더 붙일 수 있는 자리는 모두 몇 군데입니까? ":"서로 다른 완성 모양은 모두 몇 가지입니까? ")+
   "(완성된 모양을 통째로 돌려서 꼭 겹치면 같은 모양으로 셉니다.)";
  const solutionText=level===2?`더 붙일 수 있는 자리는 ${model.placementCount}군데입니다. 완성된 모양을 통째로 돌려 꼭 겹쳐지는 것끼리 묶으면 ${model.shapeCount}가지가 됩니다. 그림 아래의 수는 각 모양을 만들 수 있는 자리의 수입니다.`:
   (level===1?"바닥에 놓거나 처음 쌓기나무 위에 받쳐 쌓은 모양만 찾습니다. ":"새 쌓기나무도 바닥에 닿는 모양만 찾습니다. ")+`완성된 모양을 통째로 돌려 꼭 겹쳐지는 것끼리 묶으면 ${model.shapeCount}가지가 됩니다.`;
  return freeze({...model,model,promptText,solutionText,
   studentGiven:{promptText,cells:model.cells,scope:model.scope,baseRigid:true,allowedAttachment:model.allowedAttachment,groundRestriction:model.groundRestriction,layerCue:null,responseLayers:[]},
   layerCue:null,responseLayers:[],requiresLayerDrawing:false,sourceConditionsClarified:true,requestedAnswerUnique:true,
   answerOrder:level===2?["different-shapes","fixed-base-attachment-positions"]:["different-shapes"],
   answerDrawing:model.classes.map(group=>({canonical:group.canonical,placements:group.positions,placementCount:group.placementCount})),
   answerVisualRequired:true,answerDrawingRequired:false,structuralFingerprint:`${id}:${models.canonical(model.cells)}:${model.scope}`,
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",
   handwrittenAnswerVerified:false,
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:true,sourceConditionsExact:false,authoredCandidate:true,adoptionStatus:"pending",empiricallyCalibrated:false,
    structuralChange:["더 붙이는 쌓기나무도 바닥에 닿아야 합니다.","바닥이나 처음 쌓기나무 위에 받쳐 쌓은 모양을 비교합니다.","어느 방향으로든 붙인 뒤 모양의 수와 처음 모양에서 붙일 자리의 수를 구분합니다."][level]}
  });
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool,registrationOnly:true,learnerReleaseVerified:false});
});
