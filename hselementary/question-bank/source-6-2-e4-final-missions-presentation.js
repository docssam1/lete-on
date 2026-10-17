(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-colored-removal-mission5-contracts.js"),require("./source-6-2-transparent-mission6-contracts.js"),require("./source-6-2-transparent-mission6-figures.js"),()=>require("./source-6-2-e4-final-missions-assets.js"));
 else root.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_CONTRACTS,root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_CONTRACTS,root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_FIGURES,()=>root.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(removal,transparent,figures,getAssets){
 "use strict";
 const profiles=Object.freeze({[removal.sourceItemId]:removal,[transparent.sourceItemId]:transparent});
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 const missionOf=q=>q.sourceItemId===removal.sourceItemId?5:6;
 function assetFor(q,phase,role){
  const mission=missionOf(q);if(!["problem","teacher"].includes(role)||role==="problem"&&phase!=="given"||mission===6&&phase!=="given"||mission===5&&phase!==(role==="problem"?"given":q.level===0?"remaining-two":"remaining-three"))throw RangeError("Invalid final-mission image owner or phase");
  const file=`m${mission}-${phase}.png`,asset=getAssets()?.image(file),count=mission===6?18:role==="problem"?120:q.model.remainingCount;
  if(!asset||asset.sourceItemId!==q.sourceItemId||asset.file!==file||asset.mission!==mission||asset.phase!==(phase==="given"?"given":"remaining")||asset.cubeCount!==count||asset.width!==1600||asset.height!==(mission===5?1597:1947)||asset.positionsPreserved!==true||asset.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(asset.sha256))throw Error("Unverified final-mission native asset");
  return asset;
 }
 function image(q,phase,role){const a=assetFor(q,phase,role);return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="e4-final-missions" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-e4-final-missions/${a.file}" width="${a.width}" height="${a.height}" alt="${phase==="given"?"주어진 입체 그림":"남은 쌓기나무를 원래 자리에 나타낸 그림"}"></button>`;}
 const context=(q,role,html)=>`<div class="source62-final-${role}" data-final-mission-owner="${role}" data-source-item-id="${q.sourceItemId}" data-variant="${q.variant}" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){const solid=`<div class="source62-final-solid">${image(q,"given","problem")}</div>`,given=missionOf(q)===6?`<div class="source62-transparent-evidence">${solid}${figures.givenViews(q)}</div>${figures.response(q,"problem")}`:solid;return context(q,"problem",`<p>${escape(q.promptText)}</p>${given}`);}
 function answerHtml(q){return context(q,"teacher",missionOf(q)===5?`<div class="source62-final-solid">${image(q,q.level===0?"remaining-two":"remaining-three","teacher")}</div>`:figures.response(q,"teacher"));}
 const answerText=q=>missionOf(q)===5?(Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`):q.level===2?`그림 참조; 최소 ${q.model.result.minBlackCount}개, 최대 ${q.model.result.maxBlackCount}개`:"그림 참조";
 function render(id,variant,level){const contracts=profiles[id];if(!contracts)throw RangeError("Unknown final-mission source");const q=contracts.generate(id,variant,level);return Object.freeze({...q,prompt:problemHtml(q),answerVisual:answerHtml(q),answer:answerText(q),solution:q.solutionText,answerKeyVisual:true});}
 function zoomFigure(id,variant,level,phase,role){const c=profiles[id];if(!c)throw RangeError("Unknown final-mission source");const q=c.generate(id,variant,level),a=assetFor(q,phase,role);return Object.freeze({source:`./assets/source-6-2-e4-final-missions/${a.file}`,width:a.width,height:a.height,label:"확대한 입체 그림",revisionKey:`${id}:${variant}:${level}:${phase}:${role}:${a.sha256}`});}
 return Object.freeze({render,problemHtml,answerHtml,answerText,zoomFigure,profiles,registrationOnly:true,learnerReleaseVerified:false});
});
