(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-four-vertex-cut-contracts.js"),require("./source-6-2-plane-cut-presentation.js"),()=>require("./source-6-2-four-vertex-cut-assets.js"));
 else root.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_CONTRACTS,root.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION,()=>root.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,plane,assets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function layers(q,mode){return q.requestedLayers.map(layer=>`<figure><figcaption>${layer}\uCE35</figcaption>${plane.grid(q,layer,mode)}<figcaption>${mode==="touch"?q.model.layers[layer-1].touchCount:q.model.layers[layer-1].cutCount}\uAC1C</figcaption></figure>`).join("");}
 function image(file,label){
  const asset=assets()?.image(file);if(!asset||asset.width!==1600||asset.glyphSize!==72)throw new Error("Verified four-vertex image not available");
  return `<button type="button" class="source62-four-vertex-cut-zoom" data-four-vertex-cut-file="${escape(asset.file)}" title="\uADF8\uB9BC \uD655\uB300" aria-label="${escape(label)} \uD655\uB300"><img src="./assets/source-6-2-four-vertex-cut/${escape(asset.file)}" width="${asset.width}" height="${asset.height}" alt="${escape(label)}" data-glyph-size="72"></button>`;
 }
 function render(id,variant,level,bank=false){
  const q=contracts.generate(id,variant,level);
  return Object.freeze({...q,prompt:`<div class="source62-four-vertex-given"><p>${escape(q.promptText)}</p><div data-four-vertex-solid="given">${bank?image(`n${q.model.n}-given.png`,"\uB124 \uAF2D\uC9D3\uC810\uC744 \uC9C0\uB098\uB294 \uC808\uB2E8 \uD3C9\uBA74"):""}</div></div>`,
   answer:Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}\uAC1C`).join("; "):`${q.answer}\uAC1C`,
   answerVisual:`<div class="source62-four-vertex-answer"><div data-four-vertex-solid="answer">${bank?image(`n${q.model.n}-${level===0?"cut-top":"cut-all"}.png`,"\uC798\uB9B0 \uC313\uAE30\uB098\uBB34"):""}</div><div class="source62-cut-layers">${layers(q,"cut")}</div>${level===2?`<p>\uB2FF\uAE30\uB9CC \uD55C \uC313\uAE30\uB098\uBB34</p><div class="source62-cut-layers">${layers(q,"touch")}</div>`:""}</div>`,
   solution:q.solutionText,answerKeyVisual:true});
 }
 return Object.freeze({render,renderBank:(id,variant,level)=>render(id,variant,level,true),sourceItemIds:contracts.sourceItemIds});
});
