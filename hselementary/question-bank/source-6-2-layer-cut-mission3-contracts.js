(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-layer-cut-mission3-models.js"));
 else root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
 "use strict";
 const freeze=v=>{if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
 function generate(id,variant,level){
  if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported layer-section level");
  const model=models.solve(id,variant),requestedLayers=level===0?[model.n]:model.sourceResponseOrder;
  const selected=model.layers.filter(row=>requestedLayers.includes(row.layer)),cutCount=selected.reduce((sum,row)=>sum+row.cutCount,0);
  const promptText=`같은 크기의 쌓기나무 ${model.totalCount}개로 만든 정육면체를 세 꼭짓점 A, B, C를 지나는 평면으로 자릅니다. `+(level===0?"맨 위층의 단면을 위에서 본 모양으로 나타내고, 맨 위층에서 잘린 쌓기나무는 몇 개인지 구하시오.":"각 층의 단면을 위에서 본 모양으로 나타내고, 잘린 쌓기나무는 모두 몇 개인지 구하시오.")+(level===2?" 자른 뒤 작은 조각을 하나도 버리지 않았을 때 조각은 모두 몇 개인지 구하시오.":"")+" (쌓기나무의 내부가 잘린 경우만 잘린 것으로 셉니다.)";
  return freeze({sourceItemId:id,variant,level,model,promptText,requestedLayers,responseLayers:requestedLayers,requiresLayerDrawing:true,
   studentGiven:{promptText,dimensions:model.dimensions,points:model.points,sectionEdges:model.sectionEdges,solidFilled:true,responseLayers:requestedLayers},
   answer:level===2?[cutCount,model.splitPieceCount]:cutCount,answerUnit:"개",answerOrder:level===2?["cut-cubes","all-resulting-pieces"]:["cut-cubes"],
   answerDrawing:selected.map(row=>({layer:row.layer,polygonXZ:row.bandXZ})),answerDrawingRequired:true,answerVisualRequired:true,
   drawingRubric:{requiredLayers:requestedLayers,geometry:"actual-projected-section-band",numericAnswerAloneSufficient:false,automaticDrawingGradingImplemented:false},
   solutionText:`층별 단면의 작은 부분 하나가 내부가 잘린 쌓기나무 한 개에 해당합니다. ${selected.slice().reverse().map(row=>`${row.layer}층 ${row.cutCount}개`).join(", ")}이므로 ${cutCount}개입니다.`+(level===2?` 잘린 쌓기나무 한 개마다 조각이 한 개씩 늘어나므로 ${model.totalCount}+${cutCount}=${model.splitPieceCount}개입니다.`:""),
   structuralFingerprint:`${id}:v${variant}:level${level}:actual-section-bands`,requestedAnswerUnique:true,numericAnswerDoesNotValidateDrawing:true,
   difficultyDesign:{scope:level===0?"highest-layer-drawing-and-count":level===1?"original-all-layer-drawing-and-count":"all-layer-drawing-cut-and-fragment-count",empiricallyCalibrated:false},
   sourceExact:false,originalSourceReleaseStatus:"locked",officialAnswerVerified:false,publisherAnswerVerified:false,humanApproved:false,learnerReleaseVerified:false,empiricallyCalibrated:false});
 }
 return freeze({generate,sourceItemId:models.sourceItemId,sourceItemIds:models.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
