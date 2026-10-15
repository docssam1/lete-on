(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-midpoint-cut-contracts.js"),require("./source-6-2-plane-cut-presentation.js"),()=>require("./source-6-2-midpoint-cut-assets.js"));
 else root.HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_MIDPOINT_CUT_CONTRACTS,root.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION,()=>root.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,plane,assets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function layers(q,mode){return q.requestedLayers.map(layer=>`<figure><figcaption>${layer}층</figcaption>${plane.grid(q,layer,mode)}<figcaption>${mode==="touch"?q.model.layers[layer-1].touchCount:q.model.layers[layer-1].cutCount}개</figcaption></figure>`).join("");}
 function image(file,label){
  const asset=assets()?.image(file);if(!asset||asset.width!==1600||asset.glyphSize!==72)throw new Error("Verified midpoint-cut image not available");
  return `<button type="button" class="source62-midpoint-cut-zoom" data-midpoint-cut-file="${escape(asset.file)}" title="그림 확대" aria-label="${escape(label)} 확대"><img src="./assets/source-6-2-midpoint-cut/${escape(asset.file)}" width="${asset.width}" height="${asset.height}" alt="${escape(label)}" data-glyph-size="72"></button>`;
 }
 function render(id,variant,level,bank=false){
  const q=contracts.generate(id,variant,level);
  return Object.freeze({...q,prompt:`<div class="source62-midpoint-given"><p>${escape(q.promptText)}</p><div data-midpoint-solid="given">${bank?image(`n${q.model.n}-given.png`,"여섯 모서리의 중점을 지나는 절단 평면"):""}</div></div>`,
   answer:Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`,
   answerVisual:`<div class="source62-midpoint-answer"><div data-midpoint-solid="answer">${bank?image(`n${q.model.n}-${level===0?"cut-top":"cut-all"}.png`,"잘린 쌓기나무"):""}</div><div class="source62-cut-layers">${layers(q,"cut")}</div>${level===2?`<p>닿기만 한 쌓기나무</p><div class="source62-cut-layers">${layers(q,"touch")}</div>`:""}</div>`,
   solution:q.solutionText,answerKeyVisual:true});
 }
 return Object.freeze({render,renderBank:(id,variant,level)=>render(id,variant,level,true),sourceItemIds:contracts.sourceItemIds});
});
