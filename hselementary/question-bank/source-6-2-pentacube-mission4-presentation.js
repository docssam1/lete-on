(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-pentacube-mission4-contracts.js"),()=>require("./source-6-2-pentacube-mission4-assets.js"));
 else root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets){
 "use strict";
 const id=contracts.sourceItemId,escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function assetFor(q,index){
  const given=index==="given",group=given?null:q.model.classes[index],asset=getAssets()?.image(q.level,given?null:group?.canonical);
  if(!asset||!given&&(!Number.isSafeInteger(index)||!group)||asset.sourceItemId!==id||asset.variant!==0||asset.kind!==(given?"given":"class")||asset.canonical!==(given?null:group.canonical)||asset.width!==1600||asset.height!==1600||asset.cubeCount!==(given?4:5)||asset.readableCubeCount!==(given?3:5)||asset.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(asset.sha256)||
   (given?asset.level!==null||asset.scope!=="source-given"||asset.addedPosition!==null:asset.level!==q.level||asset.scope!==q.scope||!group.positions.some(p=>JSON.stringify(p)===JSON.stringify(asset.addedPosition))))throw Error("Unverified pentacube scope or drawing");
  return asset;
 }
 function image(q,index){const a=assetFor(q,index);return `<button type="button" class="source62-m3-image-button" data-m3-figure="0" data-source-figure-family="cube-addition" data-source-difficulty-level="${q.level}" data-source-class-index="${index}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-pentacube-mission4/${escape(a.file)}" width="1600" height="1600" alt="${index==="given"?"같은 크기의 쌓기나무 네 개를 붙인 모양":`서로 다른 완성 모양 ${index+1}`}"></button>`;}
 const context=(q,role,html)=>`<div data-cube-addition-context="${role}" data-source-item-id="${id}" data-variant="0" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){return context(q,"problem",`<div class="source62-cube-addition-given"><p>${escape(q.promptText)}</p><div class="source62-cube-addition-solid">${image(q,"given")}</div></div>`);}
 function answerHtml(q){return context(q,"teacher",`<div class="source62-cube-addition-answer"><p>검은색은 새로 붙인 쌓기나무입니다. 모양을 비교할 때에는 색을 구분하지 않습니다.</p><div class="source62-cube-addition-classes">${q.model.classes.map(g=>`<figure data-cube-class="${g.index}" data-canonical="${escape(g.canonical)}">${image(q,g.index)}<figcaption>${g.index+1}${q.level===2?` · 붙이는 자리 ${g.placementCount}곳`:""}</figcaption></figure>`).join("")}</div></div>`);}
 const answerText=q=>Array.isArray(q.answer)?`(1) ${q.answer[0]}가지; (2) ${q.answer[1]}군데`:`${q.answer}가지`;
 function render(source,variant,level){const q=contracts.generate(source,variant,level);return Object.freeze({...q,answer:answerText(q),prompt:problemHtml(q),answerVisual:answerHtml(q),solution:q.solutionText,answerKeyVisual:true});}
 function zoomFigure(variant,level,index,role){
  if(variant!==0||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||(role==="problem"?index!=="given":!Number.isSafeInteger(index)))throw RangeError("Invalid pentacube zoom owner");
  const q=contracts.generate(id,variant,level),a=assetFor(q,index);return Object.freeze({source:`./assets/source-6-2-pentacube-mission4/${a.file}`,width:a.width,height:a.height,label:role==="problem"?"확대한 문제 그림":`완성 모양 ${index+1}`,revisionKey:`${id}:${level}:${index}:${a.sha256}`});
 }
 return Object.freeze({render,problemHtml,answerHtml,answerText,zoomFigure,sourceItemId:id,registrationOnly:true,learnerReleaseVerified:false});
});
