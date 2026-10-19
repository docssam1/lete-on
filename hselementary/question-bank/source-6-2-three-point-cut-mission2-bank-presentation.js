(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-three-point-cut-mission2-contracts.js"),require("./source-6-2-three-point-cut-mission2-presentation.js"),()=>require("./source-6-2-three-point-cut-mission2-assets.js"));
 else root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_BANK_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_CONTRACTS,root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_PRESENTATION,()=>root.HSE_SOURCE_GRADE6_THREE_POINT_CUT_MISSION2_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,prototype,getAssets){
 "use strict";
 const id=contracts.sourceItemId;
 function assetFor(q,phase){
  const kind=phase==="given"?"given":q.level===0?"answer-top":"answer-all",a=getAssets()?.image(q.variant,kind);
  if(!a||a.sourceItemId!==id||a.variant!==q.variant||a.kind!==kind||a.width!==1600||!Number.isSafeInteger(a.height)||a.height<800||a.height>2000||a.glyphSize!==72||JSON.stringify(a.dimensions)!==JSON.stringify(q.model.dimensions)||a.sourceSectionEdges!=="three-dashed-traces"||!/^[a-f0-9]{64}$/.test(a.sha256))throw new Error("Unverified three-point cut asset");
  return a;
 }
 function button(q,phase){
  const section=phase==="section",a=section?null:assetFor(q,phase),label=section?"절단면 그림 확대":"입체 그림 확대";
  return `<button type="button" class="source62-m3-image-button${section?" source62-three-point-section-button":""}" data-m3-figure="${q.variant}" data-source-figure-family="three-point-cut-mission2" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" aria-label="${label}" title="${label}">${section?prototype.sectionSvg(q):`<img src="./assets/source-6-2-three-point-cut-mission2/${a.file}" width="${a.width}" height="${a.height}" alt="직육면체와 세 점 ㄱ, ㄴ, ㄷ을 잇는 점선" data-glyph-size="72">`}</button>`;
 }
 const context=(q,role,html)=>`<div data-three-point-context="${role}" data-source-item-id="${id}" data-variant="${q.variant}" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){const p=prototype.render(id,q.variant,q.level);return context(q,"problem",p.prompt.replace('<div class="source62-three-point-solid" data-three-point-solid="given"></div>',`<div class="source62-three-point-solid" data-three-point-solid="given">${button(q,"given")}</div>`));}
 function answerHtml(q){const p=prototype.render(id,q.variant,q.level);return context(q,"teacher",p.answerVisual.replace('<div class="source62-three-point-solid" data-three-point-solid="answer"></div>',`<div class="source62-three-point-solid" data-three-point-solid="answer">${button(q,"answer")}</div>`).replace(prototype.sectionSvg(q),button(q,"section")));}
 function render(source,variant,level){const q=prototype.render(source,variant,level);return Object.freeze({...q,prompt:problemHtml(q),answerVisual:answerHtml(q)});}
 function zoomFigure(variant,level,phase,role){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||(role==="problem"?phase!=="given":!["answer","section"].includes(phase)))throw new RangeError("Invalid three-point cut zoom owner");
  const q=contracts.generate(id,variant,level);
  if(phase==="section"){const svg=prototype.sectionSvg(q),size=/viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svg);return Object.freeze({source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,width:Number(size[1]),height:Number(size[2]),label:"확대한 절단면 정답 그림",revisionKey:`${variant}:${level}:section:teacher:${q.structuralFingerprint}`});}
  const a=assetFor(q,phase);return Object.freeze({source:`./assets/source-6-2-three-point-cut-mission2/${a.file}`,width:a.width,height:a.height,label:role==="problem"?"확대한 문제 그림":"확대한 정답 그림",revisionKey:`${variant}:${level}:${phase}:${role}:${a.sha256}`});
 }
 return Object.freeze({render,problemHtml,answerHtml,zoomFigure,sourceItemId:id,registrationOnly:true,learnerReleaseVerified:false});
});
