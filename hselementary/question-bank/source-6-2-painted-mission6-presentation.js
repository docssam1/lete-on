(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-mission6-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION6_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION6_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined"?window:globalThis,function(contracts,shared){
  "use strict";
  function render(id,variant,level){
    const q=contracts.generate(id,variant,level),layers=q.model.groupedLayers.map(group=>`<figure data-source-layers="${group.layers.join(",")}"><figcaption>${group.layers.join("층·")}층</figcaption>${shared.grid(group.matrix,"painted-faces",group.layers[0])}</figure>`).join(""),src=`./assets/source-6-2-painted-mission6/v${variant}-given.png`;
    return Object.freeze({prompt:q.prompt+`<div class="source62-painted-given source62-m3-given source62-m6-given" data-source="${id}"><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="mission6" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="${src}" width="1280" height="1120" alt="원본 홈의 배치와 층수에 맞춘 쌓기나무 입체" data-variant="${variant}" data-glyphless="true"></button></div>`,
      answer:q.secondary?`(1) ${q.answer}; (2) ${q.secondary.answer}개`:q.answer,
      answerVisual:`<div class="source62-painted-answer" data-source="${id}"><div class="source62-painted-layers">${layers}</div></div>`,answerKeyVisual:true,solution:q.solution,
      sourceItemId:id,variant,level,secondary:q.secondary,difficultyDesign:q.difficultyDesign,resultContract:q.resultContract,learner_stage:q.learner_stage,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({render,sourceItemIds:contracts.sourceItemIds,registrationOnly:true});
});
