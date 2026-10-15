(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-hidden-example3-models.js"));
  else root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  const sourceItemId="6-2-u3-e2-example-3";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function generate(id,variant,level){
    if(id!==sourceItemId || !Number.isSafeInteger(level) || level<0 || level>2)throw new RangeError("Invalid hidden-cube question");
    const model=models.solve(id,variant);
    const rows=model.layers.map(layer=>({layer:layer.y+1,total:layer.count,hidden:model.hiddenPositions.filter(cell=>cell[1]===layer.y).length}));
    const clue=level===0 ? {layer:2,hidden:rows[1].hidden} : null;
    const secondary=level===2 ? {minimumLayer:3,answer:rows.slice(2).reduce((sum,row)=>sum+row.hidden,0),
      question:"어느 한 면도 보이지 않는 쌓기나무 중 원래 입체의 3층 이상에 놓인 것은 몇 개인지 구하시오."} : null;
    const intro="정육면체 모양의 쌓기나무를 바닥부터 빈틈없이 쌓았습니다.",ground="(단, 바닥에 닿은 면은 보이는 것으로 합니다.)";
    const question="어느 한 면도 보이지 않는 쌓기나무는 모두 몇 개인지 구하시오.";
    const promptText=secondary ? `${intro} ${ground} (1) ${question} (2) ${secondary.question}` : `${intro} ${question} ${ground}`+
      (clue ? ` 2층에서 어느 한 면도 보이지 않는 쌓기나무는 ${clue.hidden}개입니다.` : "");
    const hiddenRows=rows.filter(row=>row.hidden>0);
    const expression=hiddenRows.map(row=>row.hidden).join("+");
    const solutionText="바닥에 닿은 1층 쌓기나무와 바깥쪽으로 드러난 쌓기나무는 세지 않습니다. "+
      hiddenRows.map(row=>`${row.layer}층 안쪽에는 ${row.hidden}개가 있습니다.`).join(" ")+` 따라서 ${expression}=${model.hiddenCount}개입니다.`+
      (secondary ? ` 어느 한 면도 보이지 않는 쌓기나무 중 원래 입체의 3층 이상에 놓인 것은 ${rows.slice(2).filter(row=>row.hidden>0).length>1 ? rows.slice(2).filter(row=>row.hidden>0).map(row=>row.hidden).join("+")+"=" : ""}${secondary.answer}개입니다.` : "");
    return freeze({sourceItemId:id,variant,level,condition:{heights:model.H,gapFreeGroundSupportedColumns:true,groundBottomCountedVisible:true},
      sourceRef:model.sourceRef,answer:model.hiddenCount,answerUnit:"개",clue,secondary,promptText,solutionText,rows,
      answerCells:model.hiddenPositions,variantCount:3,
      difficultyDesign:{mode:["easy","source","hard"][level],
        structuralChange:["2층 안쪽 개수를 제공하여 나머지 층만 판단합니다.","원본처럼 모든 면이 가려진 쌓기나무를 층별로 셉니다.","전체 개수를 구한 뒤 3층 이상에 놓인 개수도 구합니다."][level],empiricallyCalibrated:false},
      registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return freeze({generate,definitions:[{sourceItemId,variantCount:3,levels:[0,1,2]}],registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
});
