(function(root,factory){
  "use strict";
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-stair-mission1-contracts.js"));
  else root.HSE_SOURCE_GRADE6_STAIR_MISSION1_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS);
})(typeof window!=="undefined"?window:globalThis,function(contracts){
  "use strict";
  const id="6-2-u3-e2-mission-1";
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
  function layerSvg(q,layer){
    if(q.sourceItemId!==id||!Number.isSafeInteger(layer)||layer<1||layer>q.model.n)throw new RangeError("Unsupported stair layer");
    const size=24,pad=8,side=q.model.n*size+2*pad,cells=q.model.layers[layer-1].cells;
    return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-stair1-grid" data-layer="${layer}" data-orientation="back-to-front" viewBox="0 0 ${side} ${side}" width="${side}" height="${side}" role="img" aria-label="${layer}층의 쌓기나무 배열">${cells.map(([x,z])=>`<rect data-x="${x}" data-z="${z}" x="${pad+x*size}" y="${pad+z*size}" width="${size}" height="${size}" fill="#fff" stroke="#000" stroke-width="1"/>`).join("")}</svg>`;
  }
  function render(sourceId,variant,level){
    const q=contracts.generate(sourceId,variant,level),text=q.promptText.split(/\n|(?=\([12]\))/g).filter(Boolean).map(escape).join("<br>");
    const layers=q.model.layers.map(row=>`<figure data-layer="${row.layer}" data-removed="${Boolean(q.removedTopLayers?.rows.some(r=>r.layer===row.layer))}"><figcaption>${row.layer}층 · ${row.count}개${q.removedTopLayers?.rows.some(r=>r.layer===row.layer)?" · 제거":""}</figcaption><button type="button" class="source62-m3-image-button source62-stair1-grid-button" data-m3-figure="${variant}" data-source-figure-family="stair-mission1-layer" data-source-answer-layer="${row.layer}" data-source-difficulty-level="${level}" title="${row.layer}층 그림 확대" aria-label="${row.layer}층 그림 확대">${layerSvg(q,row.layer)}</button></figure>`).join("");
    return Object.freeze({...q,prompt:`<div class="source62-stair1-given" data-source="${id}">${text}<button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="stair-mission1" title="입체 그림 확대" aria-label="입체 그림 확대"><img class="source62-stair1-prefix" src="./assets/source-6-2-stair-mission1/prefix-given.png" width="1600" height="852" alt="낮은 앞 모서리를 보존한 첫째, 둘째, 셋째 계단 모양" data-glyphless="true"></button></div>`,
      answer:q.answer.map((n,index)=>`${q.answer.length>1?`(${index+1}) `:""}${n}개`).join("; "),
      answerVisual:`<div class="source62-stair1-answer" data-source="${id}">${layers}</div>`,answerKeyVisual:true});
  }
  return Object.freeze({render,layerSvg,sourceItemIds:contracts.sourceItemIds,learnerReleaseVerified:false});
});
