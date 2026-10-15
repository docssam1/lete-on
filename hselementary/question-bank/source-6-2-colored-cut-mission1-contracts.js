(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-colored-cut-mission1-models.js"));
 else root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=value=>{if(value&&typeof value==="object"&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 function generate(id,variant,level){
  if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unverified colored-cut difficulty");const model=models.solve(id,variant);
  let promptText="같은 크기의 두 가지 색 쌓기나무를 빈틈없이 쌓아 그림과 같은 직육면체를 만들었습니다. 그림의 어두운 쌓기나무는 그 면에 수직으로 반대편 끝까지 이어지며, 다른 곳에는 어두운 쌓기나무가 없습니다. 점 가, 나, 다, 라를 지나는 평면으로 자릅니다. ";
  promptText+=level===0?"점 나와 다가 있는 면에 보이는 쌓기나무 중에서, 잘린 어두운 쌓기나무는 몇 개인지 구하시오.":level===1?"잘린 어두운 쌓기나무는 모두 몇 개인지 구하시오.":"(1) 잘린 어두운 쌓기나무는 모두 몇 개입니까? (2) 잘리지 않은 어두운 쌓기나무는 모두 몇 개입니까?";
  promptText+=" (쌓기나무의 내부가 잘린 경우만 잘린 것으로 셉니다.)";
  const cut=level===0?model.frontDarkCutCells.length:model.darkCutCount,answer=level===2?[cut,model.darkUncutCount]:cut;
  const math=s=>`<span class="math-inline-expression" style="white-space:nowrap;color:#000">${s}</span>`;
  let solutionText=`<p>앞면에서 평면이 내부를 자르는 어두운 쌓기나무는 ${model.frontDarkCutCells.length}개입니다.</p>`;
  if(level!==0)solutionText+=`<p>같은 색이 앞뒤로 ${model.depth}개씩 이어져 있으므로 ${math(`${model.frontDarkCutCells.length}×${model.depth}=${model.darkCutCount}`)}개입니다.</p>`;
  if(level===2)solutionText+=`<p>앞면에서 잘리지 않은 어두운 쌓기나무는 ${model.frontDarkUncutCells.length}개이므로 ${math(`${model.frontDarkUncutCells.length}×${model.depth}=${model.darkUncutCount}`)}개입니다.</p>`;
  return freeze({...model,model,level,promptText,answer,answerOrder:level===2?["dark-cut","dark-uncut"]:["dark-cut"],answerUnit:"개",solutionText,
   studentGiven:{promptText,dimensions:model.dimensions,points:model.points,frontRows:model.frontRows,topRows:model.topRows,darkPatternScope:model.darkPatternScope,layerCue:null,responseLayers:[]},
   layerCue:null,responseLayers:[],requiresLayerDrawing:false,sourceConditionsClarified:true,requestedAnswerUnique:true,
   conditionScope:"exact-shown-dark-rods-and-strict-interior-cut",structuralFingerprint:`colored-cut:${model.dimensions.join("x")}:${model.frontRows.join("/")}:${level===0?"front-only":level===1?"whole-dark-cut":"dark-cut-and-uncut"}`,
   learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",
   difficultyDesign:{mode:["easy","source","hard"][level],sourceReferenceLevel:1,sourceGeometryMatches:variant===0,authoredCandidate:true,adoptionStatus:"pending",empiricallyCalibrated:false,
    structuralChange:["앞면 한 줄만 세어 깊이 방향의 묶음을 구하는 단계를 줄입니다.","평면이 자르는 앞면의 어두운 칸을 찾고 반대편 끝까지 이어진 개수를 셉니다.","잘린 어두운 칸과 잘리지 않은 어두운 칸을 나누어 두 개수를 구합니다."][level]}});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,pool:models.pool});
});
