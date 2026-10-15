(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-color-example4-contracts.js"));
  else root.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_STACK_COLOR_EXAMPLE4_CONTRACTS);
})(typeof window!=="undefined" ? window : globalThis,function(contracts){
  "use strict";
  function grid(matrix){
    const cells=matrix.flatMap((row,z)=>row.map((dark,x)=>`<rect data-x="${x}" data-z="${z}" data-dark="${dark}" x="${4+x*28}" y="${4+z*28}" width="28" height="28" class="${dark ? "is-dark" : "is-light"}"/>`)).join("");
    return `<svg class="source62-color-grid" data-view="layer" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="이 층의 쌓기나무 색 배치">${cells}</svg>`;
  }
  function figure(matrix,label){return `<figure><figcaption>${label}</figcaption>${grid(matrix)}<figcaption class="source62-color-front">앞쪽</figcaption></figure>`;}
  function answerPair(q,mode){
    const layers=q[`${mode}Layers`],caption=mode==="maximum" ? `최대 ${q.maximum}개` : `최소 ${q.minimum}개`;
    return `<section class="source62-color-extreme" data-extreme="${mode}"><h3>${caption}</h3><div class="source62-color-pair">${figure(layers.at(-1),`맨 위 ${q.height}층`)}${figure(layers[0],`아래 ${q.height-1}개 층 각각`)}</div></section>`;
  }
  function render(sourceItemId,variant,level){
    const q=contracts.generate(sourceItemId,variant,level),primary=`최대 ${q.maximum}개, 최소 ${q.minimum}개`,answer=q.secondary ? `(1) ${primary}, (2) ${q.secondary.answer}개` : primary;
    const extra=q.secondary ? `<section class="source62-color-witness"><h3>어두운 색 ${q.secondary.targetDark}개인 배치 예</h3><div>${q.witnessLayers.map((matrix,index)=>figure(matrix,`${index+1}층`)).join("")}</div></section>` : "";
    return Object.freeze({prompt:q.promptText+`<figure class="source62-color-given" data-source="${sourceItemId}"><img src="./assets/source-6-2-color-example4/v${variant}-given.png" width="1280" height="1040" alt="두 가지 색 쌓기나무의 윗면과 앞, 오른쪽 면"></figure>`,answer,
      answerVisual:`<div class="source62-color-answer" data-source="${sourceItemId}">${answerPair(q,"maximum")}${answerPair(q,"minimum")}${extra}</div>`,answerKeyVisual:true,
      solution:q.solutionText,sourceItemId,variant,level,difficultyDesign:q.difficultyDesign,registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return Object.freeze({render,grid,definitions:contracts.definitions,registrationOnly:true,learnerReleaseVerified:false});
});
