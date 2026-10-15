(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-example3-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_MODELS);
})(typeof window!=="undefined"?window:globalThis,function(models){
  "use strict";
  const ids=Object.freeze(["6-2-u3-e3-example-3-1","6-2-u3-e3-example-3-2"]);
  function generate(id,variant,level){
    if(!ids.includes(id)||!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Invalid painted L prism source or difficulty");
    const model=models.solve(variant),red=id===ids[0],primary=red?model.redExactlyTwo:model.atLeastOnePainted,equations=[],math=s=>{equations.push(s);return `<span class="math-inline-expression">${s}</span>`;};
    const lowerRedTwo=model.colored.filter(c=>c.cell[1]===0&&c.red===2).length,topRedTwo=model.colored.filter(c=>c.cell[1]===model.height-1&&c.red===2).length,innerPerLayer=model.layerGrids.painted[0].flat().filter(n=>n===0).length;
    let prompt=`다음 그림과 같이 ${model.cells.length}개의 쌓기나무를 쌓았습니다. 그림에서 보이지 않는 뒤쪽과 왼쪽의 두 면에는 파란색을, 보이는 5개의 면에는 빨간색을 칠하고 바닥면은 칠하지 않았습니다. `;
    if(level===0)prompt+=`쌓기나무는 모두 ${model.height}층입니다. `+(red?`맨 위층을 제외한 각 층에서 빨간색이 두 면에 칠해진 쌓기나무는 ${lowerRedTwo}개씩입니다. `:`맨 위층을 제외한 각 층에서 어느 면에도 색칠되지 않은 쌓기나무는 ${innerPerLayer}개씩입니다. `);
    prompt+=(level===2?"(1) ":"")+(red?"빨간색이 두 면에 칠해진 쌓기나무는 모두 몇 개인지 구하시오.":"한 면이라도 색이 칠해진 쌓기나무는 모두 몇 개인지 구하시오.");
    const secondary=level===2?{kind:"red-and-blue",answer:model.mixedColorCount}:null;
    if(secondary)prompt+=" (2) 빨간색과 파란색이 모두 칠해진 쌓기나무는 모두 몇 개인지 구하시오.";
    let solution=(level===0?`모두 ${model.height}층이라고 주어졌습니다. `:`윗면은 50칸이므로 ${math(`${model.cells.length}÷50=${model.height}`)}에서 모두 ${model.height}층입니다. `);
    if(red)solution+=`맨 위층에서는 ${topRedTwo}개가 빨간색 두 면을 갖습니다. 그 아래층에는 각 ${lowerRedTwo}개씩 있으므로 ${math(`${model.height}-1=${model.height-1}층`)}과 ${math(`${lowerRedTwo}×${model.height-1}+${topRedTwo}=${primary}개`)}에서 답을 구합니다. 파란색 면이 더 있어도 빨간색 면이 두 개이면 포함합니다.`;
    else solution+=`맨 위층은 윗면이 모두 칠해져 있습니다. 그 아래층에는 색칠되지 않은 쌓기나무가 각 ${innerPerLayer}개씩 있으므로 ${math(`${model.height}-1=${model.height-1}층`)}, ${math(`${innerPerLayer}×${model.height-1}=${model.histograms.painted[0]}개`)}입니다. 전체에서 이를 빼면 ${math(`${model.cells.length}-${model.histograms.painted[0]}=${primary}개`)}입니다. 빨간색과 파란색이 함께 있어도 한 번만 셉니다.`;
    if(secondary){const lowerMixed=model.colored.filter(c=>c.cell[1]===0&&c.red>0&&c.blue>0).length,topMixed=model.colored.filter(c=>c.cell[1]===model.height-1&&c.red>0&&c.blue>0).length;solution+=` 두 색이 모두 있는 쌓기나무는 맨 위층에 ${topMixed}개, 그 아래층마다 ${lowerMixed}개씩이므로 ${math(`${lowerMixed}×${model.height-1}+${topMixed}=${secondary.answer}개`)}입니다.`;}
    return Object.freeze({sourceItemId:id,variant,level,model,red,primary,answer:`${primary}개`,prompt,solution,secondary,solutionEquations:Object.freeze(equations),resultContract:secondary?"ordered":"single-value",
      learner_stage:"초등 6학년 2학기 · 황소 심화 · 공간과 입체",difficultyDesign:Object.freeze({mode:["easy","source","hard"][level],structuralChange:["높이와 아래층 한 층의 분류 수를 제공해 읽기와 분류 단계를 줄입니다.","원본의 홈과 방향별 색을 읽고 층별로 분류합니다.","두 색이 함께 있는 조각의 분류를 추가합니다."][level],empiricallyCalibrated:false}),sourceGeometryVerificationPending:model.sourceGeometryVerificationPending,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({generate,sourceItemIds:ids,registrationOnly:true});
});
