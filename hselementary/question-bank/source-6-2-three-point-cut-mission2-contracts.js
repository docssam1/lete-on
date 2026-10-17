(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-three-point-cut-mission2-models.js"));
 else root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 function generate(id,variant,level){
  if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported three-point cut level");
  const model=models.solve(id,variant),top=model.layers.at(-1),math=s=>`<span class="math-inline-expression">${s}</span>`;
  const base="같은 크기의 정육면체 모양 쌓기나무를 빈틈없이 쌓아 그림과 같은 직육면체를 만들었습니다. 세 점 ㄱ, ㄴ, ㄷ을 지나는 평면으로 자릅니다. ";
  const promptText=base+(level===0?"맨 위층에서 잘린 쌓기나무는 모두 몇 개인지 구하시오.":level===1?"잘린 쌓기나무는 모두 몇 개인지 구하시오.":"(1) 잘린 쌓기나무는 모두 몇 개인지 구하시오. (2) 자른 뒤 작은 조각을 하나도 버리지 않았을 때 조각은 모두 몇 개인지 구하시오.")+" (쌓기나무의 내부가 잘린 경우만 잘린 것으로 셉니다.)";
  const answer=level===0?top.cutCount:level===1?model.cutCount:[model.cutCount,model.splitPieceCount],sum=model.layers.map(r=>r.cutCount).join("+");
  const solutionText=level===0?`맨 위층의 절단면에서 쌓기나무 칸을 세면 ${top.cutCount}개입니다.`:`절단면에서 작은 부분 하나가 내부가 잘린 쌓기나무 한 개에 해당합니다. 아래층부터 ${model.layers.map(r=>`${r.cutCount}개`).join(", ")}이므로 ${math(`${sum}=${model.cutCount}`)}입니다.`+(level===2?` 원래 쌓기나무가 ${model.totalCount}개이고, 잘린 쌓기나무 한 개마다 조각이 한 개씩 늘어나므로 ${math(`${model.totalCount}+${model.cutCount}=${model.splitPieceCount}`)}개입니다.`:"");
  return freeze({...model,model,level,promptText,studentGiven:{promptText,dimensions:model.dimensions,points:model.points,sectionEdges:model.sectionEdges,solidFilled:true,layerCue:null,responseLayers:[]},
   requestedLayers:level===0?[model.height]:model.layers.map(r=>r.layer),layerCue:null,responseLayers:[],requiresLayerDrawing:false,sourceConditionsClarified:true,requiresOriginalReview:true,requestedAnswerUnique:true,
   answer,answerOrder:level===2?["cut-cubes","all-resulting-pieces"]:[level===0?"top-layer-cut-cubes":"cut-cubes"],answerUnit:"개",solutionText,
   difficultyDesign:{scope:level===0?"top-layer-only":level===1?"all-interior-cut-cubes":"all-cut-cubes-and-resulting-piece-count",empiricallyCalibrated:false},
   structuralFingerprint:`${id}:v${variant}:level${level}:solid-three-corner-plane`,sourceExact:false,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
