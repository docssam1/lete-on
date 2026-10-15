(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-opposite-removal-contracts.js"),()=>require("./source-6-2-opposite-removal-assets.js"));
 else root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_OPPOSITE_REMOVAL_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function layerSvg(q,row,kind){
  if(!q||q.sourceItemId!==contracts.sourceItemId||!["remaining","overlapping"].includes(kind)||
   !Number.isSafeInteger(row?.layer)||q.model.layers[row.layer-1]!==row||kind==="overlapping"&&q.level!==2)throw new RangeError("Invalid opposite-removal answer layer");
  const selected=new Set(row[kind].map(c=>c.join(","))),unit=24,pad=8,size=q.model.n*unit+2*pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" data-layer="${row.layer}" data-kind="${kind}" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${row.layer}층에서 ${kind==="remaining"?"남은 자리":"두 방향 이상이 겹친 자리"}">${row.cells.map(([x,z])=>`<rect data-x="${x}" data-z="${z}" data-selected="${selected.has([x,z].join(","))}" x="${pad+x*unit}" y="${pad+(q.model.n-1-z)*unit}" width="${unit}" height="${unit}" fill="${selected.has([x,z].join(","))?"#cedfcf":"#fff"}" stroke="#111" stroke-width="1"/>`).join("")}</svg>`;
 }
 function layers(q,kind){return q.model.layers.slice().reverse().map(row=>`<figure><figcaption>${row.layer}층</figcaption>${layerSvg(q,row,kind)}<figcaption>${row[kind].length}개</figcaption></figure>`).join("");}
 function render(id,variant,level){
  const q=contracts.generate(id,variant,level),answer=Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`;
  const image=(phase,label)=>`<button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="opposite-removal" data-source-figure-phase="${phase}" data-source-difficulty-level="${level}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-opposite-removal/v${variant}-${phase}.png" width="1600" height="1600" alt="${escape(label)}"></button>`;
  return Object.freeze({...q,answer,prompt:`<div class="source62-opposite-removal-given"><p>${escape(q.promptText)}</p><div class="source62-opposite-removal-solid">${image("given","윗면과 앞면, 오른쪽 면의 일부 칸을 검게 칠한 정육면체")}</div></div>`,
   answerVisual:`<div class="source62-opposite-removal-answer"><div class="source62-opposite-removal-solid">${image(level===0?"after-two-directions":"after-three-directions","남은 쌓기나무를 원래 자리에서 나타낸 모양")}</div><div class="source62-opposite-removal-layers">${layers(q,"remaining")}</div>${level===2?`<p>서로 다른 두 방향 이상에서 빼낸 줄이 겹친 자리</p><div class="source62-opposite-removal-layers">${layers(q,"overlapping")}</div>`:""}</div>`,
   solution:q.solutionText,answerKeyVisual:true});
 }
 function zoomFigure(variant,level,phase,role){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||
   phase!==(role==="problem"?"given":level===0?"after-two-directions":"after-three-directions"))throw new RangeError("Invalid removal zoom owner or phase");
  const file=`v${variant}-${phase}.png`,asset=getAssets()?.image(file);
  if(!asset||asset.file!==file||asset.variant!==variant||asset.kind!==phase||asset.sourceItemId!==contracts.sourceItemId||asset.width!==1600||asset.height!==1600||
   !asset.positionsPreserved||asset.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(asset.sha256))throw new Error("Invalid removal zoom asset");
  return Object.freeze({source:`./assets/source-6-2-opposite-removal/${file}`,width:asset.width,height:asset.height,label:role==="problem"?"확대한 문제 그림":"확대한 정답 그림",revisionKey:`${variant}:${level}:${phase}:${role}:${asset.sha256}`});
 }
 return Object.freeze({render,layerSvg,layers,zoomFigure,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
