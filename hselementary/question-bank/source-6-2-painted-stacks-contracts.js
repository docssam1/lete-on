(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-painted-stacks-models.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_STACKS_CONTRACTS=factory(root.HSE_SOURCE_GRADE6_PAINTED_STACKS_MODELS);
})(typeof window!=="undefined" ? window : globalThis,function(models){
  "use strict";
  function freeze(v){if(v && typeof v==="object" && !Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
  function generate(id,variant,level){
    if(!Number.isSafeInteger(level)||level<0||level>2)throw new RangeError("Unsupported painted stack difficulty");
    const m=models.solve(id,variant),counts=m.kind==="painted-face-counts",hist=m.histogram.slice(0,6);
    const solutionEquations=[],inlineMath=value=>{solutionEquations.push(value);return `<span class="math-inline-expression">${value}</span>`;};
    const directions=["윗면","밑면","오른쪽을 향한 면","왼쪽을 향한 면","앞쪽을 향한 면","뒤쪽을 향한 면"];
    const faceRows=["top","bottom","right","left","front","back"].map((key,index)=>({name:directions[index],count:m.faceCounts[key]}));
    let promptText="그림은 쌓기나무를 위에서 본 모양이고, 칸 안의 수는 그곳에 쌓은 쌓기나무의 개수입니다. 바닥에 닿는 면을 포함한 모든 겉면에 페인트를 칠했습니다. ";
    let answer,secondary=null,clue=null,solution;
    if(m.kind==="unpainted-inner-cubes"){
      const side=m.heights.length,inner=side-2,total=m.cells.length;
      const math=value=>`<span class="math-inline-expression">${value}</span>`;
      promptText=`쌓기나무 ${total}개로 정육면체 모양을 만든 후 바닥면을 포함한 모든 겉면에 파란색 페인트를 칠했습니다. `;
      if(level===0)promptText+=`한 모서리에는 쌓기나무가 ${side}개씩 있습니다. `;
      promptText+="이것을 다시 모두 떼어 놓았습니다. "+(level===2 ? "(1) " : "")+"어느 면에도 파란색 페인트가 칠해지지 않은 쌓기나무는 모두 몇 개인지 구하시오.";
      answer=hist[0];
      if(level===2){secondary={kind:"exactly-one-painted-face",answer:hist[1]};promptText+=" (2) 한 면에만 파란색 페인트가 칠해진 쌓기나무는 모두 몇 개인지 구하시오.";}
      solution=`${math(`${side}×${side}×${side}=${total}`)}이므로 한 모서리에는 쌓기나무가 ${side}개씩 있습니다. 양쪽 겉면에 닿는 쌓기나무를 빼면 안쪽은 가로, 세로, 높이가 각각 ${math(`${side}-2=${inner}개`)}입니다. 따라서 어느 면에도 색칠되지 않은 쌓기나무는 ${math(`${inner}×${inner}×${inner}=${answer}개`)}입니다. 층별 그림의 수는 각 쌓기나무에서 색칠한 면의 수입니다.`;
      if(secondary)solution+=` 한 면만 색칠된 쌓기나무는 정육면체의 각 면에서 모서리에 닿지 않는 ${math(`${inner}×${inner}개`)}씩입니다. 면이 6개이므로 ${math(`${inner}×${inner}×6=${secondary.answer}개`)}입니다.`;
    }else if(counts){
      promptText+=level===0 ? "색칠한 면이 3개인 쌓기나무와 4개인 쌓기나무는 각각 몇 개인지 구하시오." : (level===2 ? "(1) " : "")+"색칠한 면의 수가 같은 쌓기나무는 각각 몇 개인지 표를 완성하시오.";
      answer=level===0 ? [hist[3],hist[4]] : hist;
      if(level===2){secondary={kind:"all-painted-area",edge:2,answer:m.paintedFaces*4};promptText+=" (2) 쌓기나무 한 모서리의 길이가 2 cm라면, 페인트를 칠한 면의 넓이는 모두 몇 cm²인지 구하시오.";}
      solution="각 쌓기나무의 위·아래·앞·뒤·왼쪽·오른쪽 면을 확인합니다. 다른 쌓기나무와 닿는 면은 색칠하지 않고, 바닥에 닿는 면은 색칠합니다. 층별 그림에 적힌 수는 그 쌓기나무에서 색칠한 면의 수입니다.";
      if(secondary)solution+=` 표에서 색칠한 면의 수와 쌓기나무 수를 곱해 더하면 작은 면은 모두 ${m.paintedFaces}개입니다. 한 면의 넓이는 ${inlineMath("2×2=4 cm²")}이므로 ${inlineMath(`${m.paintedFaces}×4=${secondary.answer} cm²`)}입니다.`;
    }else{
      promptText+=(level===2 ? "(1) " : "")+`쌓기나무 한 모서리의 길이가 ${m.edge} cm일 때 페인트를 칠한 면의 넓이는 모두 몇 cm²인지 구하시오.`;
      answer=m.paintedArea;if(level===0){clue={paintedFaces:m.paintedFaces};promptText+=` 색칠한 작은 면은 모두 ${m.paintedFaces}개입니다.`;}
      if(level===2){secondary={kind:"area-excluding-ground",answer:m.withoutBottomArea};promptText+=" (2) 바닥에 닿는 면을 제외하면 색칠한 면의 넓이는 모두 몇 cm²인지 구하시오.";}
      solution="다른 쌓기나무와 맞닿는 면은 제외하고, 바닥에 닿는 면도 셉니다. "+faceRows.map(row=>`${row.name} ${row.count}개`).join(", ")+`를 더하면 작은 면은 모두 ${m.paintedFaces}개입니다. 한 면의 넓이는 ${inlineMath(`${m.edge}×${m.edge}=${m.edge*m.edge} cm²`)}이므로 전체 넓이는 ${inlineMath(`${m.paintedFaces}×${m.edge*m.edge}=${m.paintedArea} cm²`)}입니다.`;
      if(secondary)solution+=` 바닥에 닿는 작은 면 ${m.faceCounts.bottom}개의 넓이를 빼면 ${inlineMath(`${m.paintedArea}-${m.faceCounts.bottom*m.edge*m.edge}=${secondary.answer} cm²`)}입니다.`;
    }
    return freeze({sourceItemId:id,variant,level,model:m,promptText,answer,secondary,clue,solution,solutionEquations,histogram:hist,faceRows,
      difficultyDesign:{mode:["easy","source","hard"][level],structuralChange:m.kind==="unpainted-inner-cubes" ? ["한 모서리에 있는 쌓기나무 수를 제공해 한 추론 단계를 줄입니다.","원본 전체 수에서 모서리의 쌓기나무 수와 안쪽 개수를 구합니다.","원래 질문에 한 면만 색칠된 쌓기나무 수를 추가합니다."][level] : counts ? ["두 종류의 색칠 면 수만 분류합니다.","원본과 같이 0면부터 5면까지 모두 분류합니다.","면 수별 개수를 구한 뒤 전체 색칠 넓이를 추가로 구합니다."][level] : ["작은 면 수를 주어 면을 세는 단계를 줄입니다.","원본 높이표에서 모든 겉면을 세고 넓이를 구합니다.","전체 넓이를 구한 뒤 바닥에 닿는 면의 넓이를 빼는 물음을 추가합니다."][level],empiricallyCalibrated:false},
      requestedAnswerUnique:true,registrationOnly:true,officialAnswerVerified:false,learnerReleaseVerified:false});
  }
  return freeze({generate,definitions:models.definitions.map(d=>({sourceItemId:d.sourceItemId,variantCount:3,levels:[0,1,2]})),registrationOnly:true,learnerReleaseVerified:false});
});
