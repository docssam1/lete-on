(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-mission5-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  function freeze(v){if(v && typeof v==="object"&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  const ids=["6-2-u3-e3-mission-5-1","6-2-u3-e3-mission-5-2"];
  function generate(id,variant,level){
    if(!ids.includes(id)||!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unreviewed Mission5 source or difficulty");
    const model=models.solve(variant),volume=id===ids[0],unit=volume?"cm³":"cm²",target=volume?"부피":"겉넓이",answer=volume?model.volume:model.surfaceArea;
    const equations=[],math=s=>{equations.push(s);return `<span class="math-inline-expression">${s}</span>`;};
    let prompt=`그림은 정육면체 모양의 쌓기나무 35개를 쌓아 만든 입체도형입니다. 밑면을 제외한 모든 겉면에 페인트를 칠한 뒤 입체를 허물었습니다. 두 면에만 색칠된 쌓기나무의 색칠한 면의 넓이의 합이 ${math(`${model.areaOfExactlyTwoPaintedFaces} cm²`)}입니다. `;
    if(level===0)prompt+=`두 면에만 색칠된 쌓기나무는 ${model.histogram[2]}개입니다. `;
    prompt+=(level===2?"(1) ":"")+`원래 입체도형의 ${target}는 몇 ${unit}인지 구하시오.`;
    const secondary=level===2?{kind:"painted-surface-area",answer:model.paintedArea,unit:"cm²"}:null;
    if(secondary)prompt+=" (2) 페인트를 칠한 면의 넓이는 모두 몇 cm²인지 구하시오.";
    const promptEquations=[...equations];equations.length=0;
    let solution=`층별 그림의 수는 각 쌓기나무에서 색칠한 면의 수입니다. 2가 적힌 쌓기나무는 ${model.histogram[2]}개입니다. 두 면씩 색칠되었으므로 작은 면은 ${math(`${model.histogram[2]}×2=${model.histogram[2]*2}개`)}입니다. 한 면의 넓이는 ${math(`${model.areaOfExactlyTwoPaintedFaces}÷${model.histogram[2]*2}=${model.faceArea} cm²`)}이므로 ${math(`${model.edge}×${model.edge}=${model.faceArea}`)}에서 한 모서리의 길이는 ${math(`${model.edge} cm`)}입니다. `;
    if(volume)solution+=`작은 쌓기나무 한 개의 부피는 ${math(`${model.edge}×${model.edge}×${model.edge}=${model.edge**3} cm³`)}이므로 원래 입체의 부피는 ${math(`${model.edge**3}×35=${model.volume} cm³`)}입니다.`;
    else solution+=`원래 입체의 겉넓이에는 칠하지 않은 바닥도 포함합니다. 윗면 ${model.faceCounts.top}개, 밑면 ${model.faceCounts.bottom}개, 왼쪽·오른쪽을 향한 면 각각 ${model.faceCounts.left}개, 앞쪽·뒤쪽을 향한 면 각각 ${model.faceCounts.front}개를 더하면 작은 면 ${model.externalFaceCount}개입니다. 따라서 겉넓이는 ${math(`${model.externalFaceCount}×${model.faceArea}=${model.surfaceArea} cm²`)}입니다.`;
    if(secondary)solution+=` 바닥을 제외하고 색칠한 작은 면은 ${model.paintedFaces}개이므로 넓이는 ${math(`${model.paintedFaces}×${model.faceArea}=${model.paintedArea} cm²`)}입니다.`;
    return freeze({sourceItemId:id,rawSourceItemId:model.sourceItemId,variant,level,model,prompt,solution,promptEquations,solutionEquations:equations,answer:`${answer} ${unit}`,secondary,
      clue:level===0?{exactlyTwoPaintedCubes:model.histogram[2]}:null,
      difficultyDesign:Object.freeze({mode:["easy","source","hard"][level],structuralChange:["두 면만 색칠한 조각 수를 제공하여 분류 단계를 줄입니다.","원본 그림에서 조각을 분류하고 한 면의 넓이를 거쳐 물음에 답합니다.","원래 물음을 유지하며 바닥을 제외한 색칠 넓이를 추가로 구합니다."][level],empiricallyCalibrated:false}),
      requestedAnswerUnique:true,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({generate,sourceItemIds:Object.freeze(ids),registrationOnly:true,learnerReleaseVerified:false});
});
