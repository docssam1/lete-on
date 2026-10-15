(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-color-example4-models.js"));
  else root.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  const id="6-2-u3-e2-example-4";
  function freeze(value){if(value && typeof value==="object" && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function generate(sourceItemId,variant,level){
    if(sourceItemId!==id || !Number.isSafeInteger(level) || level<0 || level>2)throw new RangeError("Invalid color-cuboid contract");
    const m=models.solve(id,variant),unshown=m.unshown.length,secondary=level===2 ? {targetDark:m.minimum+Math.floor(unshown/2),answer:Math.floor(unshown/2)} : null;
    let promptText="밝은 색과 어두운 색의 정육면체 모양 쌓기나무로 그림과 같은 직육면체를 만들었습니다."+
      (secondary ? " (1)" : "")+" 어두운 색 쌓기나무는 최대 몇 개, 최소 몇 개가 사용되었는지 각각 구하시오.";
    if(level===0)promptText+=` 그림에서 색을 확인할 수 없는 쌓기나무는 ${unshown}개입니다.`;
    if(secondary)promptText+=` (2) 어두운 색 쌓기나무를 모두 ${secondary.targetDark}개 사용했다면, 그림에서 색을 확인할 수 없는 쌓기나무 중 어두운 색은 몇 개인지 구하시오.`;
    const below=m.height-1,rows=Array.from({length:m.height},(_,y)=>({layer:y+1,minimum:m.minimumLayers[y].flat().reduce((a,b)=>a+b,0),maximum:m.maximumLayers[y].flat().reduce((a,b)=>a+b,0)}));
    let solutionText=`맨 위층에 보이는 어두운 쌓기나무는 10개입니다. 그 아래 ${below}개 층에서는 각 층에 어두운 쌓기나무 3개와 색을 확인할 수 없는 쌓기나무 9개가 있습니다. `+
      `색을 확인할 수 없는 것을 모두 밝은 색으로 놓으면 최소 10+3×${below}=${m.minimum}개입니다. 모두 어두운 색으로 놓으면 최대 10+12×${below}=${m.maximum}개입니다.`;
    let witnessLayers=null;
    if(secondary){
      const extra=new Set(m.unshown.slice().sort((a,b)=>a[1]-b[1] || a[2]-b[2] || a[0]-b[0]).slice(0,secondary.answer).map(cell=>cell.join(",")));
      witnessLayers=m.minimumLayers.map((layer,y)=>layer.map((row,z)=>row.map((color,x)=>color || extra.has([x,y,z].join(",")) ? 1 : 0)));
      solutionText+=` 그림에서 확인되는 어두운 쌓기나무는 ${m.minimum}개이므로, 색을 확인할 수 없는 자리의 어두운 쌓기나무는 ${secondary.targetDark}-${m.minimum}=${secondary.answer}개입니다.`;
    }
    return freeze({sourceItemId:id,variant,level,height:m.height,sourceRef:m.sourceRef,conditionPolicy:m.conditionPolicy,
      maximum:m.maximum,minimum:m.minimum,answer:{maximum:m.maximum,minimum:m.minimum},secondary,promptText,solutionText,
      clue:level===0 ? {unshownCount:unshown} : null,minimumLayers:m.minimumLayers,maximumLayers:m.maximumLayers,witnessLayers,rows,
      requestedAnswerIsUnique:true,uniqueOriginalColorArrangement:false,variantCount:3,
      difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:["색을 확인할 수 없는 쌓기나무 수를 주어 그 수를 찾는 단계를 줄입니다.",
        "원본의 세 면 색과 격자만으로 최대·최소를 각각 구합니다.","최대·최소를 구한 뒤 전체 어두운 색 수에서 보이지 않은 자리의 어두운 색 수를 구합니다."][level],empiricallyCalibrated:false},
      registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return freeze({generate,definitions:[{sourceItemId:id,variantCount:3,levels:[0,1,2]}],registrationOnly:true,learnerReleaseVerified:false});
});
