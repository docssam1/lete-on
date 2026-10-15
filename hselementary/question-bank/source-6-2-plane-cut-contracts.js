(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-models.js"));
 else root.HSE_SOURCE_GRADE6_PLANE_CUT_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 function generate(id,variant,level){
  if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported cut difficulty");
  const model=models.solve(id,variant),drawing=id==="6-2-u3-e4-mission-3";
  const requestedLayers=level===0?[model.n]:model.layers.map(l=>l.layer).reverse();
  const cutLayers=model.layers.filter(l=>requestedLayers.includes(l.layer)),cutCount=cutLayers.reduce((s,l)=>s+l.cutCount,0);
  const answer=level===2?[cutCount,model.touchCount]:cutCount;
  const stem=drawing?`쌓기나무 ${model.cubes.length}개로 만든 정육면체를 세 꼭짓점 A, B, C를 지나는 평면으로 자릅니다.`:"그림과 같은 직육면체를 세 꼭짓점 A, B, C를 지나는 평면으로 자릅니다.";
  let promptText=stem+" ";
  if(level===0)promptText+=drawing?"맨 위층에서 잘린 쌓기나무의 자리를 위에서 본 모양에 표시하고, 잘린 쌓기나무는 몇 개인지 구하시오.":"맨 위층에서 잘린 쌓기나무는 몇 개인지 구하시오.";
  else promptText+=(drawing?"각 층에서 잘린 쌓기나무의 자리를 위에서 본 모양에 표시하고, 잘린 쌓기나무는 모두 몇 개인지 구하시오.":"잘린 쌓기나무는 모두 몇 개인지 구하시오.");
  if(level===2)promptText+=" 평면이 꼭짓점이나 모서리에 닿기만 하는 쌓기나무의 개수도 구하시오.";
  promptText+=" (쌓기나무의 내부가 잘린 경우만 잘린 것으로 셉니다.)";
  const counts=cutLayers.slice().reverse().map(l=>l.cutCount),sumEquation=`${counts.join("+")}=${cutCount}`;
  const touchCounts=model.layers.slice().reverse().map(l=>l.touchCount),touchEquation=`${touchCounts.join("+")}=${model.touchCount}`;
  const equation=s=>`<span class="math-inline-expression" style="white-space:nowrap;color:#000">${s}</span>`;
  const equations=[sumEquation,...(level===2?[touchEquation]:[])].map(equation);
  return freeze({sourceItemId:id,variant,level,model,learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",
   promptText,studentGiven:{promptText,dimensions:model.dimensions,points:model.points,responseLayers:drawing?requestedLayers:[]},
   requestedLayers,responseLayers:drawing?requestedLayers:[],requiresLayerDrawing:drawing,
   answer,answerOrder:level===2?["cut","boundary-touch"]:["cut"],answerUnit:"개",
   answerDrawing:cutLayers.map(l=>({layer:l.layer,cells:l.cutCells})),solutionEquations:equations,
   solutionText:`<p>그림에서 표시한 잘린 쌓기나무를 층별로 세어 더하면 ${equations[0]}개입니다.</p>`+(level===2?`<p>닿기만 한 쌓기나무는 ${equations[1]}개입니다. 이 개수는 잘린 쌓기나무의 개수에 넣지 않습니다.</p>`:""),
   sourceConditionsClarified:true,conditionScope:"positive-volume-cut-only",
   originalSourceReleaseStatus:"locked",sourceExact:false,publisherAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,
   requestedAnswerUnique:true,requiresOriginalReview:true,
   sourceReferencePanelRequired:!drawing,sourceReferencePanelImplemented:!drawing,
   sourceReferencePromptText:drawing?null:"다음은 쌓기나무 8개로 만든 정육면체를 삼각형을 포함한 평면으로 자를 때, 잘린 쌓기나무의 개수를 나타낸 그림입니다. 같은 방법으로 아래 물음에 답하시오.",
   structuralFingerprint:`plane-cut:${model.dimensions.join("x")}:A-B-C:${level===0?"top":"all"}`,
   difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["보이는 맨 위층 한 가지만 셉니다.","각 층을 구분해 전체 개수를 셉니다.","잘린 것과 경계에 닿기만 한 것을 따로 구합니다."][level],empiricallyCalibrated:false}});
 }
 return freeze({generate,sourceItemIds:models.sourceItemIds});
});
