(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-example2-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  const id="6-2-u3-e3-example-2";
  function generate(variant,level){
    if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Invalid removal difficulty");
    const model=models.solve(variant),primary=model.histogram[2],removedTwo=model.before.histogram[2]-primary,equations=[],math=s=>{equations.push(s);return `<span class="math-inline-expression">${s}</span>`;};
    let prompt="쌓기나무로 아래 왼쪽과 같은 큰 정육면체를 만든 후 밑면을 포함한 모든 겉면에 파란색 페인트를 칠했습니다. 아래 오른쪽 그림과 같이 몇 개의 쌓기나무를 빼냈습니다. "+model.clarifiedCondition+" 빼낸 뒤에는 다시 색칠하지 않았습니다. ";
    if(level===0)prompt+=`빼내기 전 두 면에만 페인트가 칠해진 쌓기나무는 ${model.before.histogram[2]}개입니다. `;
    prompt+=(level===2?"(1) ":"")+"남은 쌓기나무 중 두 면에만 페인트가 칠해진 쌓기나무는 모두 몇 개인지 구하시오.";
    const secondary=level===2?{faceClass:1,answer:model.histogram[1]}:null;
    if(secondary)prompt+=" (2) 한 면에만 페인트가 칠해진 쌓기나무는 모두 몇 개인지 구하시오.";
    let solution="처음 큰 정육면체에서 모서리에 있고 꼭짓점에는 있지 않은 쌓기나무만 두 면에 색칠됩니다. ";
    if(level===0)solution+=`처음에는 ${model.before.histogram[2]}개라고 주어졌습니다. `;
    else solution+=`모서리는 12개이고 각 모서리에서 꼭짓점의 2개를 빼면 ${math(`${model.side}-2=${model.side-2}개`)}씩이므로 ${math(`12×${model.side-2}=${model.before.histogram[2]}개`)}입니다. `;
    solution+=`빼낸 쌓기나무 중 처음 두 면에 색칠된 것은 ${removedTwo}개입니다. 따라서 남은 것은 ${math(`${model.before.histogram[2]}-${removedTwo}=${primary}개`)}입니다. 새로 드러난 면에는 색칠되어 있지 않습니다.`;
    if(secondary){const originallyOne=model.before.histogram[1],removedOne=originallyOne-secondary.answer;solution+=` 처음 각 면에서 모서리를 빼면 ${model.side-2}줄에 ${model.side-2}개씩 있으므로 ${math(`6×${model.side-2}×${model.side-2}=${originallyOne}개`)}가 한 면만 색칠되어 있습니다. 그중 ${removedOne}개를 빼냈으므로 ${math(`${originallyOne}-${removedOne}=${secondary.answer}개`)}입니다.`;}
    return Object.freeze({sourceItemId:id,variant,level,model,prompt,solution,primary,answer:`${primary}개`,secondary,solutionEquations:Object.freeze(equations),resultContract:secondary?"ordered":"single-value",
      learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",difficultyDesign:Object.freeze({mode:["easy","source-clarified","hard"][level],structuralChange:["처음 두 면만 칠해진 수를 제공해 처음 수를 구하는 단계를 줄입니다.","색칠 전후가 아니라 제거 전후를 비교하고 처음 칠한 면을 분류합니다.","두 면만 칠한 수와 한 면만 칠한 수를 함께 구합니다."][level],empiricallyCalibrated:false}),
      sourceOriginalAmbiguous:true,sourceConditionsClarified:true,requestedAnswerUnique:true,publisherAnswerVerified:false,registrationOnly:true,learnerReleaseVerified:false});
  }
  return Object.freeze({generate,sourceItemId:id,registrationOnly:true});
});
