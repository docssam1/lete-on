(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-mission5-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined"?window:globalThis,function(contracts,shared){
  "use strict";
  function render(id,variant,level){
    const q=contracts.generate(id,variant,level),layers=q.model.layerGrids.map((matrix,y)=>`<figure><figcaption>${y+1}층</figcaption>${shared.grid(matrix,"painted-faces",y+1)}</figure>`).join("");
    const src="./assets/source-6-2-painted-mission5/source-given.png";
    return Object.freeze({prompt:q.prompt+`<div class="source62-painted-given source62-m3-given source62-m5-given" data-source="${id}"><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="mission5" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="${src}" width="1280" height="860" alt="원본 계단 배치의 쌓기나무 입체" data-variant="${variant}" data-glyphless="true"></button></div>`,
      answer:q.secondary?`(1) ${q.answer}; (2) ${q.secondary.answer} ${q.secondary.unit}`:q.answer,
      answerVisual:`<div class="source62-painted-answer" data-source="${id}"><div class="source62-painted-layers">${layers}</div></div>`,answerKeyVisual:true,solution:q.solution,
      sourceItemId:id,variant,level,clue:q.clue,secondary:q.secondary,difficultyDesign:q.difficultyDesign,registrationOnly:true,learnerReleaseVerified:false,publisherAnswerVerified:false});
  }
  return Object.freeze({render,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
