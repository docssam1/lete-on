(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-colored-removal-mission5-contracts.js"),require("./source-6-2-transparent-mission6-contracts.js"),require("./source-6-2-transparent-mission6-figures.js"),()=>require("./source-6-2-e4-final-missions-assets.js"),()=>require("./source-6-2-iso-cube-svg.js"));
 else root.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_COLORED_REMOVAL_MISSION5_CONTRACTS,root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_CONTRACTS,root.HSE_SOURCE_GRADE6_TRANSPARENT_MISSION6_FIGURES,()=>root.HSE_SOURCE_GRADE6_E4_FINAL_MISSIONS_ASSETS,()=>root.HSE_SOURCE_GRADE6_ISO_CUBE_SVG);
})(typeof window!=="undefined"?window:globalThis,function(removal,transparent,figures,getAssets,getIso){
 "use strict";
 const profiles=Object.freeze({[removal.sourceItemId]:removal,[transparent.sourceItemId]:transparent});
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 const missionOf=q=>q.sourceItemId===removal.sourceItemId?5:6;
 function checkPhase(q,phase,role){const mission=missionOf(q);if(!["problem","teacher"].includes(role)||role==="problem"&&phase!=="given"||mission===6&&phase!=="given"||mission===5&&phase!==(role==="problem"?"given":q.level===0?"remaining-two":"remaining-three"))throw RangeError("Invalid final-mission image owner or phase");return mission;}
 // Mission 5 pool 1·2: 원문 PNG와 같은 방향·색의 SVG. 문제 그림은 직육면체와 색칠한 칸, 정답 그림은 남은 쌓기나무를 원래 자리에 그린다.
 const svgOwned=q=>missionOf(q)===5&&q.variant!==0;
 function svgFigure(q,phase,role){
  checkPhase(q,phase,role);const iso=getIso(),m=q.model,[w,h]=m.dimensions,has=(list,a,b)=>list.some(p=>p[0]===a&&p[1]===b);if(!iso||!svgOwned(q))throw RangeError("Invalid final-mission SVG owner");
  if(phase==="given"){const cells=m.cells,svg=iso.svg(cells,{marked:(i,face)=>{const[x,y,z]=cells[i];return face==="y"?y===h-1&&has(m.faces.top,x,z):face==="z"?z===0&&has(m.faces.front,x,y):x===w-1&&has(m.faces.right,z,y);},label:"색칠한 칸이 있는 직육면체 입체 그림",figureKey:`${q.sourceItemId}:v${q.variant}:given`,role:"problem"});
   if(!svg.includes(`data-marked-face-count="${m.paintCells.length}"`)||cells.length!==m.totalCount)throw Error("Unverified colored removal SVG");return svg;}
  if(m.remaining.length!==m.remainingCount)throw Error("Unverified colored removal remaining SVG");
  return iso.svg(m.remaining,{label:"남은 쌓기나무를 원래 자리에 나타낸 그림",figureKey:`${q.sourceItemId}:v${q.variant}:${q.level}:${phase}`,role:"teacher"});
 }
 function assetFor(q,phase,role){
  const mission=checkPhase(q,phase,role);if(svgOwned(q))throw RangeError("Pool variants use SVG figures");
  const file=`m${mission}-${phase}.png`,asset=getAssets()?.image(file),count=mission===6?18:role==="problem"?120:q.model.remainingCount;
  if(!asset||asset.sourceItemId!==q.sourceItemId||asset.file!==file||asset.mission!==mission||asset.phase!==(phase==="given"?"given":"remaining")||asset.cubeCount!==count||asset.width!==1600||asset.height!==(mission===5?1597:1947)||asset.positionsPreserved!==true||asset.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(asset.sha256))throw Error("Unverified final-mission native asset");
  return asset;
 }
 function image(q,phase,role){if(svgOwned(q))return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="e4-final-missions" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" title="입체 그림 확대" aria-label="입체 그림 확대">${svgFigure(q,phase,role)}</button>`;const a=assetFor(q,phase,role);return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="e4-final-missions" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-e4-final-missions/${a.file}" width="${a.width}" height="${a.height}" alt="${phase==="given"?"주어진 입체 그림":"남은 쌓기나무를 원래 자리에 나타낸 그림"}"></button>`;}
 const context=(q,role,html)=>`<div class="source62-final-${role}" data-final-mission-owner="${role}" data-source-item-id="${q.sourceItemId}" data-variant="${q.variant}" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){const solid=`<div class="source62-final-solid">${image(q,"given","problem")}</div>`,given=missionOf(q)===6?`<div class="source62-transparent-evidence">${solid}${figures.givenViews(q)}</div>${figures.response(q,"problem")}`:solid;return context(q,"problem",`<p>${escape(q.promptText)}</p>${given}`);}
 function answerHtml(q){return context(q,"teacher",missionOf(q)===5?`<div class="source62-final-solid">${image(q,q.level===0?"remaining-two":"remaining-three","teacher")}</div>`:figures.response(q,"teacher"));}
 const answerText=q=>missionOf(q)===5?(Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`):q.level===2?`그림 참조; 최소 ${q.model.result.minBlackCount}개, 최대 ${q.model.result.maxBlackCount}개`:"그림 참조";
 function render(id,variant,level){const contracts=profiles[id];if(!contracts)throw RangeError("Unknown final-mission source");const q=contracts.generate(id,variant,level);return Object.freeze({...q,prompt:problemHtml(q),answerVisual:answerHtml(q),answer:answerText(q),solution:q.solutionText,answerKeyVisual:true});}
 function zoomFigure(id,variant,level,phase,role){const c=profiles[id];if(!c)throw RangeError("Unknown final-mission source");const q=c.generate(id,variant,level);
  if(svgOwned(q)){const markup=svgFigure(q,phase,role);return Object.freeze({source:getIso().dataUrl(markup),width:1600,height:1600,label:"확대한 입체 그림",revisionKey:`${id}:${variant}:${level}:${phase}:${role}:svg`,inlineSvg:true,figureKey:phase==="given"?`${id}:v${variant}:given`:`${id}:v${variant}:${level}:${phase}`});}
  const a=assetFor(q,phase,role);return Object.freeze({source:`./assets/source-6-2-e4-final-missions/${a.file}`,width:a.width,height:a.height,label:"확대한 입체 그림",revisionKey:`${id}:${variant}:${level}:${phase}:${role}:${a.sha256}`});}
 return Object.freeze({render,problemHtml,answerHtml,answerText,zoomFigure,svgFigure,profiles,registrationOnly:true,learnerReleaseVerified:false});
});
