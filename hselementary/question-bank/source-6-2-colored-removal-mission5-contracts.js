(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-colored-removal-mission5-models.js"));
 else root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 function generate(id,variant,level){const model=models.solve(id,variant,level),hard=level===2;
  const scope=level===0?"윗면과 오른쪽 면의 색칠된 칸에서만":"세 면의 색칠된 모든 칸에서";
  const promptText=`같은 크기의 쌓기나무를 빈틈없이 쌓아 그림과 같은 직육면체를 만들었습니다. ${scope} 각 면에 수직인 방향으로 반대쪽 끝까지 쌓기나무를 모두 빼냈습니다. `+
   (hard?"(1) 남은 쌓기나무는 모두 몇 개입니까? (2) 두 방향 이상에서 빼낸 줄이 겹치는 자리의 쌓기나무는 모두 몇 개입니까?":"남은 쌓기나무는 모두 몇 개인지 구하시오.")+" (남은 쌓기나무는 옮기지 않습니다.)";
  const solutionText=`아래층부터 남은 쌓기나무를 세면 ${model.layers.map(row=>row.remaining.length).join(", ")}개입니다. `+
   `처음 ${model.totalCount}개에서 빼낸 ${model.removedCount}개를 빼면 ${model.remainingCount}개가 남습니다. 서로 다른 방향의 줄이 만나는 자리는 한 번만 뺍니다.`+
   (hard?` 두 방향 이상이 겹치는 자리도 한 번씩 세면 ${model.overlapCount}개입니다.`:"");
  return freeze({...model,model,promptText,solutionText,studentGiven:{promptText,solidFilled:true,dimensions:model.dimensions,paintedFaces:model.faces,activeDirections:model.axes,layerCue:null,responseLayers:[]},
   layerCue:null,responseLayers:[],requiresLayerDrawing:false,answerOrder:hard?["remaining","removed-by-two-or-more-directions"]:["remaining"],answerVisualRequired:true,requestedAnswerUnique:true,
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",structuralFingerprint:`${id}:v0:${model.axes.join("+")}:${hard?"remaining-and-overlap":"remaining"}`,
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:true,sourceTaskMatches:level===1,authoredCandidate:true,adoptionStatus:"pending",empiricallyCalibrated:false,
    structuralChange:["두 방향의 줄이 겹치는 자리를 구별합니다.","세 방향의 줄이 겹치는 자리를 한 번만 빼고 남은 수를 구합니다.","남은 수와 여러 방향의 줄이 겹친 자리 수를 따로 구합니다."][level]}});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool,registrationOnly:true,learnerReleaseVerified:false});
});
