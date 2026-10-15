(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-mission3-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION3_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION3_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  const math=value=>`<span class="math-inline-expression">${value}</span>`;
  function generate(variant,level){
    if(!Number.isSafeInteger(level) || level<0 || level>2)throw new RangeError("Unreviewed Mission3 difficulty");
    const model=models.solve(variant),[bottom,middle,top]=model.layerCounts;
    let prompt=`그림은 쌓기나무를 1층에 ${bottom}개, 2층에 ${middle}개, 3층에 ${top}개 쌓아 만든 입체도형입니다. 이 도형의 겉면을 모두 색칠할 때, 면 4개가 색칠된 쌓기나무는 ㉮개, 면 3개가 색칠된 쌓기나무는 ㉯개입니다. 바닥 부분은 색칠하지 않습니다. `;
    if(level===0)prompt+=`㉮는 ${model.A}입니다. `;
    prompt+=(level===2 ? "(1) " : "")+`${math("10×㉮+㉯")}의 값을 구하시오.`;
    const secondary=level===2 ? {kind:"exactly-five-painted-faces",answer:model.histogram[5]} : null;
    if(secondary)prompt+=" (2) 면 5개가 색칠된 쌓기나무는 모두 몇 개인지 구하시오.";
    let solution=`다른 쌓기나무와 맞닿는 면과 바닥에 닿는 면은 색칠하지 않습니다. 층별 그림의 수는 각 쌓기나무에서 색칠한 면의 수입니다. 4가 적힌 쌓기나무 ${model.A}개와 3이 적힌 쌓기나무 ${model.B}개를 세면 ${math(`㉮=${model.A}`)}, ${math(`㉯=${model.B}`)}입니다. 따라서 ${math(`10×${model.A}+${model.B}=${model.answer}`)}입니다.`;
    if(secondary)solution+=` 5가 적힌 쌓기나무를 세면 ${secondary.answer}개입니다.`;
    return freeze({sourceItemId:model.sourceItemId,variant,level,model,prompt,solution,answer:String(model.answer),secondary,
      requestedAnswerUnique:true,clue:level===0 ? {A:model.A} : null,
      difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["4면이 색칠된 개수를 주어 3면인 개수를 세는 단계에 집중합니다.","원본과 같이 4면과 3면인 개수를 세고 식의 값을 구합니다.","원질문을 보존하고 5면이 색칠된 개수를 추가로 구합니다."][level],empiricallyCalibrated:false},
      registrationOnly:true,officialAnswerVerified:false,learnerReleaseVerified:false});
  }
  return freeze({generate,registrationOnly:true,learnerReleaseVerified:false});
});
