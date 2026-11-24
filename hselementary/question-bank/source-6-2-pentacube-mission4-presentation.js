(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-pentacube-mission4-contracts.js"),()=>require("./source-6-2-pentacube-mission4-assets.js"),require("./source-6-2-pentacube-mission4-models.js"),()=>require("./source-6-2-iso-cube-svg.js"));
 else root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_ASSETS,root.HSE_SOURCE_GRADE6_PENTACUBE_MISSION4_MODELS,()=>root.HSE_SOURCE_GRADE6_ISO_CUBE_SVG);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets,models,getIso){
 "use strict";
 const id=contracts.sourceItemId,escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function assetFor(q,index){
  const given=index==="given",group=given?null:q.model.classes[index],asset=getAssets()?.image(q.level,given?null:group?.canonical);
  if(!asset||!given&&(!Number.isSafeInteger(index)||!group)||asset.sourceItemId!==id||asset.variant!==0||asset.kind!==(given?"given":"class")||asset.canonical!==(given?null:group.canonical)||asset.width!==1600||asset.height!==1600||asset.cubeCount!==(given?4:5)||(given?asset.readableCubeCount!==3:q.level===1?!(asset.hiddenCubesAreSupports===true&&asset.visibleCubeCount>=4&&asset.readableCubeCount>=4&&asset.addedCubeVisibleSamples>=9&&asset.equivalence==="floor-rotation"):asset.readableCubeCount!==5)||asset.heightColumnCompressionUsed!==false||!/^[a-f0-9]{64}$/.test(asset.sha256)||
   (given?asset.level!==null||asset.scope!=="source-given"||asset.addedPosition!==null:asset.level!==q.level||asset.scope!==q.scope||!group.positions.some(p=>JSON.stringify(p)===JSON.stringify(asset.addedPosition))))throw Error("Unverified pentacube scope or drawing");
  return asset;
 }
 // pool 1·2: PNG 대신 같은 방향·같은 색의 SVG로 그린다. 정답 그림은 각 모양을 만드는 자리 중 하나와 바닥 위 회전(어려움은 모든 회전)을 골라
 // 쌓기나무 다섯 개의 한 면 이상이 온전히 보이고(보통 난이도는 위 쌓기나무를 받치는 쌓기나무만 가려져도 됨) 검은 쌓기나무가 두 면 이상 보이게 한다.
 const identity=models.floorRotations.find(r=>r.matrix.every((row,i)=>row.every((n,j)=>n===(i===j?1:0)))),keyOf=c=>c.join(","),better=(a,b)=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]>b[i];return false;};
 function svgPose(q,index){
  const group=q.model.classes[index],iso=getIso();if(!iso||!group)throw RangeError("Invalid pentacube SVG class");
  const floorIds=new Set(models.floorRotations.map(r=>r.index)),rotations=q.level===2?[...models.floorRotations,...models.rotations.filter(r=>!floorIds.has(r.index))]:models.floorRotations;let best=null;
  group.witnesses.forEach((witness,member)=>rotations.forEach(rotation=>{
   const cells=models.orient(witness.cells,rotation.index),added=models.orient([...q.model.cells,witness.added],rotation.index).at(-1),addedIndex=cells.findIndex(c=>keyOf(c)===keyOf(added)),vis=iso.visibility(cells),occupied=new Set(cells.map(keyOf));
   const hidden=cells.map((c,i)=>i).filter(i=>!vis.readable[i]),supportsOnly=hidden.every(i=>i!==addedIndex&&occupied.has(keyOf([cells[i][0],cells[i][1]+1,cells[i][2]])));
   const valid=q.level===1?supportsOnly:hidden.length===0,score=[valid,vis.counts[addedIndex]>=18,floorIds.has(rotation.index),hidden.length===0,rotation.index===identity.index,Math.min(...vis.counts),vis.counts.reduce((a,b)=>a+b,0)].map(Number);
   if(!best||better(score,best.score))best={score,cells,addedIndex,hiddenCount:hidden.length,turned:rotation.index!==identity.index,rotationIndex:rotation.index,witnessIndex:member,addedPosition:witness.added,visibility:vis};
  }));
  if(!best||best.score[0]!==1||best.score[1]!==1)throw Error("No readable pentacube SVG pose");
  return best;
 }
 function svgFigure(q,index){
  const iso=getIso(),given=index==="given";
  if(given){const vis=iso.visibility(q.model.cells);if(vis.readableCubeCount!==4)throw Error("Unreadable pentacube given SVG");return iso.svg(q.model.cells,{label:"같은 크기의 쌓기나무 네 개를 붙인 모양",figureKey:`${id}:v${q.variant}:given`,role:"problem"});}
  const pose=svgPose(q,index);return iso.svg(pose.cells,{marked:i=>i===pose.addedIndex,label:`서로 다른 완성 모양 ${index+1}`,figureKey:`${id}:v${q.variant}:${q.level}:${index}`,role:"teacher"});
 }
 function image(q,index){if(q.variant!==0)return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="cube-addition" data-source-difficulty-level="${q.level}" data-source-class-index="${index}" title="입체 그림 확대" aria-label="입체 그림 확대">${svgFigure(q,index)}</button>`;
  const a=assetFor(q,index);return `<button type="button" class="source62-m3-image-button" data-m3-figure="${q.variant}" data-source-figure-family="cube-addition" data-source-difficulty-level="${q.level}" data-source-class-index="${index}" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-pentacube-mission4/${escape(a.file)}" width="1600" height="1600" alt="${index==="given"?"같은 크기의 쌓기나무 네 개를 붙인 모양":`서로 다른 완성 모양 ${index+1}`}"></button>`;}
 const turned=q=>q.model.classes.map((g,i)=>(q.variant===0?assetFor(q,i).floorTurned:svgPose(q,i).turned)?i+1:0).filter(Boolean),hiddenSupports=q=>q.variant===0||q.model.classes.some((g,i)=>svgPose(q,i).hiddenCount>0);
 const context=(q,role,html)=>`<div data-cube-addition-context="${role}" data-source-item-id="${id}" data-variant="${q.variant}" data-level="${q.level}">${html}</div>`;
 function problemHtml(q){return context(q,"problem",`<div class="source62-cube-addition-given"><p>${escape(q.promptText)}</p><div class="source62-cube-addition-solid">${image(q,"given")}</div></div>`);}
 function answerHtml(q){return context(q,"teacher",`<div class="source62-cube-addition-answer"><p>${q.level===1?`검은색은 더 쌓은 쌓기나무입니다. ${turned(q).length?`처음 모양과 같은 방향에서 그렸고, ${turned(q).join("·")}번은 검은 쌓기나무가 보이도록 바닥 위에서 돌려 그렸습니다.`:"처음 모양과 같은 방향에서 그렸습니다."}${hiddenSupports(q)?" 보이지 않는 쌓기나무는 위의 쌓기나무를 받치고 있습니다.":""}`:`검은색은 새로 붙인 쌓기나무입니다. 모양을 비교할 때에는 색을 구분하지 않습니다.${q.variant!==0&&turned(q).length?` ${turned(q).join("·")}번은 검은 쌓기나무가 잘 보이도록 돌려 그렸습니다.`:""}`}</p><div class="source62-cube-addition-classes">${q.model.classes.map(g=>`<figure data-cube-class="${g.index}" data-canonical="${escape(g.canonical)}">${image(q,g.index)}<figcaption>${g.index+1}${q.level===2?` · 붙이는 자리 ${g.placementCount}곳`:""}</figcaption></figure>`).join("")}</div></div>`);}
 const answerText=q=>Array.isArray(q.answer)?`(1) ${q.answer[0]}가지; (2) ${q.answer[1]}군데`:`${q.answer}가지`;
 function render(source,variant,level){const q=contracts.generate(source,variant,level);return Object.freeze({...q,answer:answerText(q),prompt:problemHtml(q),answerVisual:answerHtml(q),solution:q.solutionText,answerKeyVisual:true});}
 function zoomFigure(variant,level,index,role){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||(role==="problem"?index!=="given":!Number.isSafeInteger(index)))throw RangeError("Invalid pentacube zoom owner");
  const q=contracts.generate(id,variant,level);
  if(variant!==0){if(role==="teacher"&&(index<0||index>=q.model.classes.length))throw RangeError("Invalid pentacube class");const markup=svgFigure(q,index);return Object.freeze({source:getIso().dataUrl(markup),width:1600,height:1600,label:role==="problem"?"확대한 문제 그림":`완성 모양 ${index+1}`,revisionKey:`${id}:v${variant}:${level}:${index}:svg`,inlineSvg:true,figureKey:index==="given"?`${id}:v${variant}:given`:`${id}:v${variant}:${level}:${index}`});}
  const a=assetFor(q,index);return Object.freeze({source:`./assets/source-6-2-pentacube-mission4/${a.file}`,width:a.width,height:a.height,label:role==="problem"?"확대한 문제 그림":`완성 모양 ${index+1}`,revisionKey:`${id}:${level}:${index}:${a.sha256}`});
 }
 return Object.freeze({render,problemHtml,answerHtml,answerText,zoomFigure,svgPose,svgFigure,sourceItemId:id,registrationOnly:true,learnerReleaseVerified:false});
});
