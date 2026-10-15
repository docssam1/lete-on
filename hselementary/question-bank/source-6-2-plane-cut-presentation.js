(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-plane-cut-contracts.js"),require("./source-6-2-plane-cut-reference.js"),()=>require("./source-6-2-plane-cut-assets.js"));
 else root.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PLANE_CUT_CONTRACTS,root.HSE_SOURCE_GRADE6_PLANE_CUT_REFERENCE,()=>root.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,reference,assets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function grid(q,layer,mode){
  if(!["blank","cut","touch"].includes(mode)||!q.requestedLayers.includes(layer))throw new RangeError("Unsupported cut layer diagram");
  const unit=26,pad=8,n=q.model.depth,width=q.model.width*unit+pad*2,height=q.model.depth*unit+pad*2,row=q.model.layers[layer-1];
  const cells=new Set((mode==="touch"?row.touchCells:mode==="cut"?row.cutCells:[]).map(c=>c.join(",")));
  const rects=row.cells.map(([x,z])=>`<rect data-x="${x}" data-z="${z}" data-selected="${cells.has([x,z].join(","))}" x="${pad+x*unit}" y="${pad+(n-1-z)*unit}" width="${unit}" height="${unit}" fill="${cells.has([x,z].join(","))?"#cedfcf":"#fff"}" stroke="#111" stroke-width="1"/>`).join("");
  const traces=mode==="cut"?row.slabTraces.filter(a=>a.length===2).map(a=>`<line data-role="plane-trace" x1="${pad+a[0][0]*unit}" y1="${pad+(n-a[0][1])*unit}" x2="${pad+a[1][0]*unit}" y2="${pad+(n-a[1][1])*unit}" stroke="#000" stroke-width="1.2"/>`).join(""):"";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" data-layer="${layer}" data-phase="${mode}" role="img" aria-label="${layer}층 위에서 본 ${mode==="blank"?"답 격자":"절단 결과"}">${rects}${traces}</svg>`;
 }
 function layerFigures(q,mode){return q.requestedLayers.map(layer=>`<figure><figcaption>${layer}층</figcaption>${grid(q,layer,mode)}${mode==="blank"?"":`<figcaption>${mode==="touch"?q.model.layers[layer-1].touchCount:q.model.layers[layer-1].cutCount}개</figcaption>`}</figure>`).join("");}
 function assetImage(file,label,glyphSize){
  const a=assets()?.image(file);if(!a||a.width!==1600)throw new Error("Verified plane-cut image not available");
  return `<button type="button" class="source62-cut-zoom" data-cut-file="${escape(a.file)}" title="그림 확대" aria-label="${escape(label)} 확대"><img src="./assets/source-6-2-plane-cut/${escape(a.file)}" width="${a.width}" height="${a.height}" alt="${escape(label)}" data-glyph-size="${glyphSize}"></button>`;
 }
 function render(id,variant,level,bank=false){
  const q=contracts.generate(id,variant,level);
  const dimensions=q.model.dimensions.join("x"),refImages=bank?{solid:assetImage("reference-solid.png","쌓기나무 8개를 자르는 원문 예시",0),sections:{1:assetImage("reference-layer-1.png","1층을 자른 원문 예시",0),2:assetImage("reference-layer-2.png","2층을 자른 원문 예시",0)}}:null;
  return Object.freeze({...q,prompt:`<div class="source62-cut-given">${q.sourceReferencePanelRequired?`<p>${escape(q.sourceReferencePromptText)}</p>${reference.render(refImages)}`:""}<p>${escape(q.promptText)}</p><div data-cut-solid="given" data-cut-n="${q.model.n}">${bank?assetImage(`${dimensions}-given.png`,"세 점을 지나는 평면으로 자르는 입체",72):""}</div>${q.responseLayers.length?`<div class="source62-cut-layers source62-cut-response">${layerFigures(q,"blank")}</div>`:""}</div>`,
   answer:Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`,
   answerVisual:`<div class="source62-cut-answer"><div data-cut-solid="answer" data-cut-n="${q.model.n}">${bank?assetImage(`${dimensions}-${level===0?"cut-top":"cut-all"}.png`,"잘린 쌓기나무",72):""}</div><div class="source62-cut-layers">${layerFigures(q,"cut")}</div>${level===2?`<p>닿기만 한 쌓기나무</p><div class="source62-cut-layers">${layerFigures(q,"touch")}</div>`:""}</div>`,
   solution:q.solutionText,answerKeyVisual:true});
 }
 return Object.freeze({render,renderBank:(id,variant,level)=>render(id,variant,level,true),grid,sourceItemIds:contracts.sourceItemIds});
});
