(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-painted-exploration-contracts.js"),require("./source-6-2-painted-stacks-presentation.js"));
  else root.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PAINTED_EXPLORATION_CONTRACTS,root.HSE_SOURCE_GRADE6_PAINTED_STACKS_PRESENTATION);
})(typeof window!=="undefined"?window:globalThis,function(contracts,shared){
  "use strict";
  function histogram(q,blank){
    return `<table class="source62-painted-histogram"><thead><tr>${q.histogram.map((_,face)=>`<th scope="col">${face}면</th>`).join("")}</tr></thead><tbody><tr>${q.histogram.map((count,face)=>`<td data-face-count="${face}">${blank?"":`${count}개`}</td>`).join("")}</tr></tbody></table>`;
  }
  function render(id,variant,level){
    const q=contracts.generate(id,variant,level);
    const layers=q.model.layerGrids.map((matrix,index)=>`<figure><figcaption>${index+1}층</figcaption>${shared.grid(matrix,"painted-faces",index+1)}</figure>`).join("");
    const primary=level===0?`3면 ${q.answer[0]}개, 4면 ${q.answer[1]}개`:q.histogram.map((count,face)=>`${face}면 ${count}개`).join(", ");
    const given=`<div class="source62-painted-given source62-m3-given source62-exploration-given" data-source="${id}"><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="exploration" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-painted-exploration/v${variant}-given.png" width="1280" height="1120" alt="각 기둥의 윗면과 쌓기나무의 층수가 보이는 입체" data-variant="${variant}" data-glyphless="true"></button>${level===0?"":histogram(q,true)}</div>`;
    return Object.freeze({...q,prompt:q.promptText+given,answer:q.secondary?`(1) ${primary}; (2) ${q.secondary.answer} cm²`:primary,
      answerVisual:`<div class="source62-painted-answer source62-exploration-answer" data-source="${id}">${histogram(q,false)}<div class="source62-painted-layers">${layers}</div></div>`,answerKeyVisual:true});
  }
  return Object.freeze({render,grid:shared.grid,align:shared.align,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
