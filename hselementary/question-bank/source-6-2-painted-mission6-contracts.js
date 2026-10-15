(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-mission6-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION6_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION6_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  function freeze(v){if(v&&typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const ids=["6-2-u3-e3-mission-6-1","6-2-u3-e3-mission-6-2"];
  function generate(id,variant,level){
    if(!ids.includes(id)||!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unreviewed Mission6 source or difficulty");
    const model=models.solve(variant),faceClass=id===ids[0]?1:0,primary=model.histogram[faceClass],equations=[],math=s=>{equations.push(s);return `<span class="math-inline-expression">${s}</span>`;};
    let prompt=`다음 그림과 같이 쌓기나무 ${model.cells.length}개를 쌓았다. 밑면을 포함하여 겉면에 파란색 페인트를 칠한 후 다시 낱개의 쌓기나무로 만들었다. `;
    if(level===0)prompt+=`쌓기나무는 모두 ${model.height}층으로 쌓여 있습니다. `;
    prompt+=(level===2?"(1) ":"")+(faceClass===1?"한 면에만 파란색 페인트를 칠한":"어느 면에도 페인트가 칠해지지 않은")+" 쌓기나무는 모두 몇 개인지 구하시오.";
    const secondary=level===2?{faceClass:2,answer:model.histogram[2]}:null;
    if(secondary)prompt+=" (2) 두 면에만 파란색 페인트를 칠한 쌓기나무는 모두 몇 개인지 구하시오.";
    let solution=(level===0?`문제에서 높이는 ${model.height}층이라고 주어졌습니다. `:`윗면은 28칸이므로 ${math(`${model.cells.length}÷28=${model.height}`)}에서 모두 ${model.height}층입니다. `)+"다른 쌓기나무와 맞닿았던 면은 떼어 놓아도 색칠되지 않습니다. ";
    if(faceClass===0)solution+=`옆면이 모두 이웃한 기둥에 둘러싸인 기둥은 4개입니다. 맨 위와 맨 아래 쌓기나무는 각각 윗면과 밑면이 색칠되어 있습니다. 그 사이에는 기둥마다 ${math(`${model.height}-2=${model.height-2}개`)}씩 있으므로 ${math(`4×${model.height-2}=${primary}개`)}입니다.`;
    else solution+=`맨 위와 맨 아래층에서 옆면이 모두 가려진 쌓기나무는 각 4개씩입니다. 중간층에는 옆면 한 면만 바깥에 드러난 쌓기나무가 층마다 12개씩 있습니다. 중간층은 ${math(`${model.height}-2=${model.height-2}층`)}이므로 ${math(`4×2+12×${model.height-2}=${primary}개`)}입니다.`;
    if(secondary)solution+=` 두 면만 칠한 쌓기나무는 맨 위와 맨 아래층에 각 12개, 중간층마다 12개씩입니다. 따라서 ${math(`12×2+12×${model.height-2}=${secondary.answer}개`)}입니다.`;
    return freeze({sourceItemId:id,rawSourceItemId:model.sourceItemId,variant,level,model,prompt,solution,answer:`${primary}개`,primary,faceClass,secondary,solutionEquations:equations,resultContract:secondary?"ordered":"single-value",
      learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["공통 높이를 제공해 높이를 알아내는 단계를 줄입니다.","원본 입체와 전체 수에서 높이와 색칠 면을 분류합니다.","원래 물음에 두 면만 색칠한 조각의 분류를 추가합니다."][level],empiricallyCalibrated:false},
      requestedAnswerUnique:true,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return freeze({generate,sourceItemIds:ids,registrationOnly:true});
});
