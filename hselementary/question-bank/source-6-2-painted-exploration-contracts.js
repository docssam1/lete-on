(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-exploration-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  const sourceItemId="6-2-u3-e3-exploration",ids=Object.freeze([sourceItemId]);
  const learner_stage="초등 6학년 2학기 · 황소 심화 · 공간과 입체";
  const learnerConditions="모든 기둥의 윗면이 그림에 보입니다. 각 기둥은 같은 바닥에서부터 빈틈없이 쌓여 있습니다.";
  function freeze(value){
    if(value&&typeof value==="object"&&!Object.isFrozen(value)){
      Object.values(value).forEach(freeze);Object.freeze(value);
    }
    return value;
  }
  function generate(id,variant,level){
    if(id!==sourceItemId||!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2)
      throw new RangeError("Invalid painted exploration source, variant or difficulty");
    const model=models.solve(variant),histogram=model.histogram.slice(0,6),solutionEquations=[];
    if(model.histogram.length!==7||model.histogram[6]!==0)throw new RangeError("Painted exploration requires the ordered 0-to-5 face bins");
    const math=value=>{solutionEquations.push(value);return `<span class="math-inline-expression">${value}</span>`;};
    let promptText=`다음 그림과 같이 쌓기나무를 쌓은 후, 바닥면을 포함한 모든 겉면에 페인트를 칠했습니다. 쌓기나무끼리 맞닿은 면에는 칠하지 않았습니다. ${learnerConditions} `;
    promptText+=level===0?"색칠한 면이 3개인 쌓기나무와 4개인 쌓기나무는 각각 몇 개인지 구하시오.":(level===2?"(1) ":"")+"색칠한 면의 수가 같은 쌓기나무는 각각 몇 개인지 표를 완성하시오.";
    const answer=level===0?[histogram[3],histogram[4]]:histogram.slice();
    const secondary=level===2?{kind:"all-painted-area",edge:2,answer:model.paintedFaces*4}:null;
    if(secondary)promptText+=" (2) 쌓기나무 한 모서리의 길이가 2 cm라면, 페인트를 칠한 면의 넓이는 모두 몇 cm²인지 구하시오.";
    let solution="층별 그림의 수는 색칠한 면 수입니다. 맞닿은 면은 빼고 바닥면은 셉니다. 같은 수를 층마다 세어 더합니다. ";
    const faceCounts=level===0?[3,4]:[0,1,2,3,4,5];
    solution+=faceCounts.map(face=>{
      const perLayer=model.layerGrids.map(matrix=>matrix.flat().filter(value=>value===face).length);
      return `${face}면: ${math(`${perLayer.join("+")}=${histogram[face]}개`)}.`;
    }).join(" ");
    if(secondary){
      const weighted=histogram.map((count,face)=>face*count).filter(Boolean).join("+");
      solution+=` 표의 면 수와 쌓기나무 수를 곱해 더하면 색칠한 작은 면은 ${math(`${weighted}=${model.paintedFaces}개`)}입니다. 한 면의 넓이는 ${math("2×2=4 cm²")}이므로 전체 넓이는 ${math(`${model.paintedFaces}×4=${secondary.answer} cm²`)}입니다.`;
    }
    return freeze({sourceItemId:id,variant,level,promptText,solution,answer,secondary,solutionEquations,histogram,model,
      resultContract:"ordered",learner_stage,learnerConditions,
      difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["3면과 4면의 두 종류만 분류합니다.","0면부터 5면까지 모두 분류하여 표를 완성합니다.","전체 분류표에서 색칠한 작은 면 수를 구한 뒤 한 면의 넓이를 곱합니다."][level],empiricallyCalibrated:false},
      conditionPolicy:model.conditionPolicy,sourceRef:model.sourceRef,requestedAnswerUnique:model.requestedAnswerUnique,
      sourceGeometryVerificationPending:model.sourceGeometryVerificationPending,sourceConditionsClarified:true,originalAnswerDeterminate:false,originalSourceReleaseStatus:"locked",
      sourceConditionProvenance:"explicit-learner-given-conditions",sourceExact:false,
      registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false});
  }
  return Object.freeze({generate,sourceItemIds:ids,learner_stage,learnerConditions,registrationOnly:true,learnerReleaseVerified:false});
});
