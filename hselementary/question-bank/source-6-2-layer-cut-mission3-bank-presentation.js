(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-layer-cut-mission3-contracts.js"),require("./source-6-2-layer-cut-mission3-presentation.js"),()=>require("./source-6-2-plane-cut-assets.js"));
 else root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_BANK_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_CONTRACTS,root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_PRESENTATION,()=>root.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,prototype,getAssets){
 "use strict";
 const id=contracts.sourceItemId,escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function assetFor(q){const a=getAssets()?.image(`${q.model.dimensions.join("x")}-given.png`);if(!a||a.kind!=="given"||a.width!==1600||a.height!==1600||JSON.stringify(a.dimensions)!==JSON.stringify(q.model.dimensions)||!/^[a-f0-9]{64}$/.test(a.sha256))throw Error("Invalid layer-cut given image");return a;}
 function button(q,phase,layer){const a=phase==="given"?assetFor(q):null;return `<button type="button" class="source62-m3-image-button source62-layer-cut-figure-button" data-source-figure-family="layer-cut-mission3" data-m3-figure="${q.variant}" data-source-difficulty-level="${q.level}" data-source-figure-phase="${phase}"${layer===undefined?"":` data-source-answer-layer="${layer}"`} aria-label="그림 확대" title="그림 확대">${a?`<img class="source62-layer-cut-solid" src="./assets/source-6-2-plane-cut/${a.file}" width="1600" height="1600" data-phase="given" data-glyph-size="72" alt="정육면체의 세 꼭짓점 A, B, C를 잇는 선">`:prototype.grid(q,layer,"teacher")}</button>`;}
 const context=(q,role,html)=>`<div data-layer-cut-owner="${role}" data-source-item-id="${id}" data-variant="${q.variant}" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){return context(q,"problem",`<div class="source62-layer-cut-problem"><div class="source62-layer-cut-given"><p>${escape(q.promptText)}</p>${button(q,"given")}</div><div class="source62-layer-cut-grids" data-role="blank-response-grids">${q.requestedLayers.map(layer=>`<figure><figcaption>${layer}층</figcaption>${prototype.grid(q,layer,"problem")}</figure>`).join("")}</div></div>`);}
 function answerHtml(q){return context(q,"teacher",`<div class="source62-layer-cut-answer" data-print-weight="compact"><div class="source62-layer-cut-grids" data-role="answer-section-bands">${q.requestedLayers.map(layer=>`<figure><figcaption>${layer}층</figcaption>${button(q,"section",layer)}<figcaption>${q.model.layers.find(r=>r.layer===layer).cutCount}개</figcaption></figure>`).join("")}</div></div>`);}
 const answerText=q=>"단면은 아래 그림 참조. "+(Array.isArray(q.answer)?`잘린 쌓기나무 ${q.answer[0]}개, 조각 ${q.answer[1]}개`:`잘린 쌓기나무 ${q.answer}개`);
 function render(source,variant,level){const q=contracts.generate(source,variant,level);return Object.freeze({...q,answer:answerText(q),prompt:problemHtml(q),answerVisual:answerHtml(q),solution:q.solutionText,answerKeyVisual:true});}
 function zoomFigure(variant,level,phase,role,layer){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||(role==="problem"?phase!=="given"||layer!==undefined:phase!=="section"))throw RangeError("Invalid layer-cut zoom role");
  const q=contracts.generate(id,variant,level);if(phase==="given"){const a=assetFor(q);return Object.freeze({source:`./assets/source-6-2-plane-cut/${a.file}`,width:a.width,height:a.height,label:"확대한 문제 그림",revisionKey:`${variant}:${level}:given:${a.sha256}`});}
  if(!Number.isSafeInteger(layer)||!q.requestedLayers.includes(layer))throw RangeError("Invalid layer-cut zoom layer");
  const svg=prototype.grid(q,layer,"teacher"),size=q.model.n*28+16;return Object.freeze({source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,width:size,height:size,label:`${layer}층 단면 정답 그림`,revisionKey:`${variant}:${level}:${layer}:teacher:${q.structuralFingerprint}`});
 }
 return Object.freeze({render,problemHtml,answerHtml,answerText,zoomFigure,sourceItemId:id,registrationOnly:true,learnerReleaseVerified:false});
});
