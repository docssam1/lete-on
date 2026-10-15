(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-cube-addition-contracts.js"),()=>require("./source-6-2-cube-addition-assets.js"));
 else root.HSE_SOURCE_GRADE6_CUBE_ADDITION_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_CUBE_ADDITION_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_CUBE_ADDITION_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function assetFor(q,index){
  const given=index===null,group=given?null:q.model.classes[index],asset=getAssets()?.image(q.variant,given?null:group?.canonical);
  if(!asset||asset.sourceItemId!==contracts.sourceItemId||asset.variant!==q.variant||asset.kind!==(given?"given":"class")||asset.canonical!==(given?null:group?.canonical)||
   asset.width!==1600||asset.height!==1600||asset.cubeCount!==(given?6:7)||asset.readableCubeCount!==asset.cubeCount||asset.heightColumnCompressionUsed!==false||
   !/^[a-f0-9]{64}$/.test(asset.sha256))throw new Error("Unverified cube-addition drawing");
  return asset;
 }
 function image(q,index){
  const asset=assetFor(q,index),label=index===null?"같은 크기의 쌓기나무 여섯 개를 붙인 모양":`서로 다른 완성 모양 ${index+1}`;
  return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="cube-addition" data-source-difficulty-level="${q.level}" data-source-class-index="${index===null?"given":index}" title="입체 그림 확대" aria-label="${escape(label)} 확대"><img src="./assets/source-6-2-cube-addition/${escape(asset.file)}" width="1600" height="1600" alt="${escape(label)}"></button>`;
 }
 function render(id,variant,level){
  const q=contracts.generate(id,variant,level),answer=Array.isArray(q.answer)?`(1) ${q.answer[0]}가지; (2) ${q.answer[1]}군데`:`${q.answer}가지`;
  const figures=q.model.classes.map(group=>`<figure data-cube-class="${group.index}" data-canonical="${escape(group.canonical)}">${image(q,group.index)}<figcaption>${group.index+1}${level===2?` · 붙이는 자리 ${group.placementCount}곳`:""}</figcaption></figure>`).join("");
  const sum=q.model.classes.map(group=>group.placementCount).join("+");
  const solution=`완성된 모양을 돌리거나 뒤집어 꼭 겹쳐지는 것끼리 묶으면 ${q.model.shapeCount}가지입니다.`+(level===2?` 각 모양을 만들 수 있는 자리는 ${q.model.classes.every(g=>g.placementCount===2)?"두 군데씩입니다. ":"그림에 표시한 수와 같습니다. "}<span class="math-inline-expression">${sum}=${q.model.placementCount}</span>이므로 붙일 자리는 ${q.model.placementCount}군데입니다.`:"");
  return Object.freeze({...q,answer,prompt:`<div class="source62-cube-addition-given"><p>${escape(q.promptText)}</p><div class="source62-cube-addition-solid">${image(q,null)}</div></div>`,
   answerVisual:`<div class="source62-cube-addition-answer"><p>검은색은 새로 붙인 쌓기나무입니다. 모양을 비교할 때에는 색을 구분하지 않습니다.</p><div class="source62-cube-addition-classes">${figures}</div></div>`,solution,answerKeyVisual:true});
 }
 function zoomFigure(variant,level,index,role){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||
   (role==="problem"?index!=="given":!Number.isSafeInteger(index)))throw new RangeError("Invalid cube-addition zoom owner");
  const q=contracts.generate(contracts.sourceItemId,variant,level);
  if(role==="teacher"&&(index<0||index>=q.model.classes.length))throw new RangeError("Invalid cube-addition class");
  const asset=assetFor(q,role==="problem"?null:index);
  return Object.freeze({source:`./assets/source-6-2-cube-addition/${asset.file}`,width:1600,height:1600,label:role==="problem"?"확대한 문제 그림":"확대한 정답 그림",revisionKey:`${variant}:${level}:${index}:${role}:${asset.sha256}`});
 }
 return Object.freeze({render,zoomFigure,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
