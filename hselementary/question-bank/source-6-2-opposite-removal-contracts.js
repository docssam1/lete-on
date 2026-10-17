(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-opposite-removal-models.js"));
 else root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const math=expression=>`<span class="math-inline-expression" style="white-space:nowrap;color:#000">${expression}</span>`;
 function generate(id,variant,level){
  const model=models.solve(id,variant,level),easy=level===0,hard=level===2;
  const scope=easy?"윗면과 오른쪽 면에 보이는 검은색 칸에서만":"그림에 보이는 모든 검은색 칸에서";
  let promptText=`같은 크기의 쌓기나무를 빈틈없이 쌓아 그림과 같은 정육면체를 만들었습니다. ${scope} 각 면에 수직인 방향으로 반대쪽 끝까지 쌓기나무를 모두 빼냅니다. `;
  promptText+=hard?"(1) 남은 쌓기나무는 모두 몇 개인지 구하시오. (2) 서로 다른 두 방향 이상에서 빼내는 줄이 겹치는 자리에 있던 쌓기나무는 모두 몇 개인지 구하시오.":"남은 쌓기나무는 모두 몇 개인지 구하시오.";
  promptText+=" (남은 쌓기나무는 옮기지 않습니다.)";
  const remainingEquation=`${model.layers.map(row=>row.remaining.length).join("+")}=${model.remainingCount}`;
  const removedEquation=`${model.totalCount}-${model.removedCount}=${model.remainingCount}`;
  const overlapEquation=`${model.layers.map(row=>row.overlapping.length).join("+")}=${model.overlapCount}`;
  const equations=[remainingEquation,removedEquation,...(hard?[overlapEquation]:[])];
  const solutionText=`<p>각 층에서 남은 쌓기나무를 세어 더하면 ${math(remainingEquation)}개입니다.</p>`+
   `<p>빼낸 쌓기나무가 겹치는 자리는 한 번만 세어야 합니다. 처음 개수에서 빼낸 개수를 빼도 ${math(removedEquation)}개입니다.</p>`+
   (hard?`<p>두 방향 이상이 겹친 자리도 한 번씩만 세면 ${math(overlapEquation)}개입니다.</p>`:"");
  return freeze({sourceItemId:id,variant,level,model,promptText,answer:model.answer,answerUnit:"개",
   answerOrder:hard?["remaining","removed-by-at-least-two-directions"]:["remaining"],solutionText,solutionEquations:equations.map(math),
   studentGiven:{promptText,solidFilled:true,paintedFaces:model.faces,activeDirections:model.axes,responseLayers:[],layerCue:null},
   responseLayers:[],requiresLayerDrawing:false,layerCue:null,sourceConditionsClarified:true,requestedAnswerUnique:true,
   conditionScope:model.conditionScope,requiresOriginalReview:true,originalSourceReleaseStatus:"locked",sourceExact:false,
   publisherAnswerVerified:false,officialAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,
   learnerReleaseVerified:false,empiricallyCalibrated:false,registrationOnly:true,
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",
   structuralFingerprint:`opposite-removal:${JSON.stringify(model.axes.map(axis=>[axis,model.faces[axis]]))}:${hard?"remaining-and-overlap":"remaining"}`,
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:variant===0,
    authoredCandidate:true,adoptionStatus:"pending",empiricallyCalibrated:false,
    problemView:"source-solid-with-painted-face-cells-only",
    structuralChange:["두 방향에서 빼내는 줄의 겹침을 구별합니다.","세 방향에서 빼낸 자리를 한 번씩 세어 남은 개수를 구합니다.","남은 개수와 두 방향 이상이 겹친 자리의 개수를 따로 구합니다."][level]}});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool});
});
