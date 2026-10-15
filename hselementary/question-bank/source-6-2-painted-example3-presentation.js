(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-example3-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE3_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined"?window:globalThis,function(contracts,shared){
  "use strict";
  function render(id,variant,level){
    const q=contracts.generate(id,variant,level),role=q.red?"red":"painted",groups=q.model.groupedLayers[role],caption=layers=>layers.length===1?`${layers[0]}층`:`${layers[0]}~${layers.at(-1)}층`,layers=groups.map(group=>`<figure data-source-layers="${group.layers.join(",")}"><figcaption>${caption(group.layers)}</figcaption>${shared.grid(group.matrix,q.red?"red-painted-faces":"painted-faces",group.layers[0])}</figure>`).join("");
    const mixedLayers=q.secondary?q.model.groupedLayers.red.map(group=>{const matrix=group.matrix.map((row,z)=>row.map((n,x)=>n===null?null:Number(n>0&&q.model.layerGrids.blue[group.layers[0]-1][z][x]>0)));return `<figure data-source-layers="${group.layers.join(",")}"><figcaption>${caption(group.layers)}</figcaption>${shared.grid(matrix,"mixed-colors",group.layers[0])}</figure>`;}).join(""):"";
    return Object.freeze({prompt:q.prompt+`<div class="source62-painted-given source62-m3-given source62-example3-given" data-source="${id}"><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="example3" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-painted-example3/v${variant}-given.png" width="1280" height="1120" alt="원본 홈과 층수를 보존하고 보이는 다섯 면을 빨간색으로 칠한 쌓기나무" data-variant="${variant}" data-glyphless="true"></button></div>`,
      answer:q.secondary?`(1) ${q.answer}; (2) ${q.secondary.answer}개`:q.answer,answerVisual:`<div class="source62-painted-answer source62-example3-answer" data-source="${id}" data-color-role="${role}"><p class="source62-example3-legend">${q.red?"빨간색 면 수":"빨간색·파란색을 합친 면 수"}</p><div class="source62-painted-layers">${layers}</div>${q.secondary?`<p class="source62-example3-legend">두 색이 모두 있는 칸: 1</p><div class="source62-painted-layers source62-example3-mixed">${mixedLayers}</div>`:""}</div>`,answerKeyVisual:true,solution:q.solution,
      sourceItemId:id,variant,level,secondary:q.secondary,resultContract:q.resultContract,difficultyDesign:q.difficultyDesign,learner_stage:q.learner_stage,sourceGeometryVerificationPending:q.sourceGeometryVerificationPending,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({render,sourceItemIds:contracts.sourceItemIds,registrationOnly:true});
});
