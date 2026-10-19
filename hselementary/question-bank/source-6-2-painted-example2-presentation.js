(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-example2-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXAMPLE2_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined"?window:globalThis,function(contracts,shared){
  "use strict";
  function render(variant,level){
    const q=contracts.generate(variant,level),phase=(name,label)=>`<figure><figcaption>${label}</figcaption><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="example2" data-source-figure-phase="${name}" title="입체 그림 확대" aria-label="${label} 입체 그림 확대"><img src="./assets/source-6-2-painted-example2/v${variant}-${name}.png" width="1280" height="1040" alt="${label} 쌓기나무" data-variant="${variant}" data-phase="${name}" data-glyphless="true"></button></figure>`;
    const layers=q.model.layerGrids.map((matrix,y)=>`<figure><figcaption>${y+1}층</figcaption>${shared.grid(matrix,"painted-faces",y+1)}</figure>`).join("");
    return Object.freeze({prompt:q.prompt+`<div class="source62-painted-given source62-m3-given source62-example2-given" data-source="${q.sourceItemId}">${phase("before","빼내기 전")}<span class="source62-example2-arrow" aria-label="제거">→</span>${phase("after","빼낸 후")}</div>`,
      answer:q.secondary?`(1) ${q.answer}; (2) ${q.secondary.answer}개`:q.answer,
      answerVisual:`<div class="source62-painted-answer" data-source="${q.sourceItemId}"><div class="source62-painted-layers">${layers}</div></div>`,answerKeyVisual:true,solution:q.solution,sourceItemId:q.sourceItemId,variant,level,secondary:q.secondary,resultContract:q.resultContract,difficultyDesign:q.difficultyDesign,learner_stage:q.learner_stage,
      sourceOriginalAmbiguous:true,sourceConditionsClarified:true,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({render,registrationOnly:true});
});
