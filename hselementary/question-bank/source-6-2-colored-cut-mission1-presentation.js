(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-colored-cut-mission1-contracts.js"),()=>require("./source-6-2-colored-cut-mission1-assets.js"));
 else root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_COLORED_CUT_MISSION1_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function frontSvg(q){
  const m=q.model,unit=42,pad=32,w=m.width*unit+2*pad,h=m.height*unit+2*pad;
  const cells=m.frontCells.map(c=>`<rect data-x="${c.x}" data-y="${c.y}" data-dark="${c.dark}" data-cut="${c.cut}" x="${pad+c.x*unit}" y="${pad+(m.height-1-c.y)*unit}" width="${unit}" height="${unit}" fill="${c.dark?(c.cut?"#b9d4bc":"#555555"):"#ffffff"}" stroke="#111" stroke-width="1"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-colored-cut-front" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="점 나와 다가 있는 면에서 평면이 자르는 어두운 쌓기나무"><g data-role="front-cells">${cells}</g><line data-role="front-plane-trace-halo" x1="${pad}" y1="${pad}" x2="${w-pad}" y2="${h-pad}" stroke="#fff" stroke-width="4"/><line data-role="front-plane-trace" x1="${pad}" y1="${pad}" x2="${w-pad}" y2="${h-pad}" stroke="#000" stroke-width="1.5"/><g fill="#000" font-family="Malgun Gothic,Arial,sans-serif" font-size="16" font-weight="400"><text x="${pad-20}" y="${pad-10}" text-anchor="middle">나</text><text x="${w-pad+18}" y="${h-pad+20}" text-anchor="middle">다</text></g></svg>`;
 }
 function assetFor(variant,kind){
  const a=getAssets()?.image(variant,kind);if(!a||a.sourceItemId!==contracts.sourceItemId||a.variant!==variant||a.kind!==kind||a.width!==1600||a.height!==1649||a.glyphSize!==72||JSON.stringify(a.dimensions)!=="[5,4,5]"||a.sourceDarkPatternPreserved!==true||!/^[a-f0-9]{64}$/.test(a.sha256))throw new Error("Unverified colored-cut asset");return a;
 }
 function button(q,phase){
  const front=phase==="front",a=front?null:assetFor(q.variant,phase),label=front?"앞면 그림 확대":"입체 그림 확대";
  return `<button type="button" class="source62-m3-image-button${front?" source62-colored-cut-front-button":""}" data-m3-figure="${q.variant}" data-source-figure-family="colored-cut-mission1" data-source-figure-phase="${phase}" data-source-difficulty-level="${q.level}" title="${label}" aria-label="${label}">${front?frontSvg(q):`<img src="./assets/source-6-2-colored-cut-mission1/${escape(a.file)}" width="${a.width}" height="${a.height}" alt="두 가지 색 쌓기나무로 만든 직육면체와 점 가, 나, 다, 라" data-glyph-size="72">`}</button>`;
 }
 function render(id,variant,level,bank=false){
  const q=contracts.generate(id,variant,level),answer=Array.isArray(q.answer)?q.answer.map((n,i)=>`(${i+1}) ${n}개`).join("; "):`${q.answer}개`;
  return Object.freeze({...q,answer,prompt:`<div class="source62-colored-cut-given"><p>${escape(q.promptText)}</p><div class="source62-colored-cut-solid" data-colored-cut-solid="given">${bank?button(q,"given"):""}</div></div>`,
   answerVisual:`<div class="source62-colored-cut-answer"><div class="source62-colored-cut-solid" data-colored-cut-solid="answer">${bank?button(q,"answer"):""}</div><figure>${bank?button(q,"front"):frontSvg(q)}<figcaption>점 나와 다가 있는 면</figcaption></figure><p>초록색 칸은 평면이 내부를 자르는 어두운 쌓기나무입니다.</p></div>`,solution:q.solutionText,answerKeyVisual:true});
 }
 function zoomFigure(variant,level,phase,role){
  if(!Number.isSafeInteger(variant)||variant<0||variant>2||!Number.isSafeInteger(level)||level<0||level>2||!["problem","teacher"].includes(role)||(role==="problem"?phase!=="given":!["answer","front"].includes(phase)))throw new RangeError("Invalid colored-cut zoom owner");
  const q=contracts.generate(contracts.sourceItemId,variant,level);
  if(phase==="front")return Object.freeze({source:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(frontSvg(q))}`,width:274,height:232,label:"확대한 앞면 정답 그림",revisionKey:`${variant}:${level}:front:teacher:${q.structuralFingerprint}`});
  const a=assetFor(variant,phase);return Object.freeze({source:`./assets/source-6-2-colored-cut-mission1/${a.file}`,width:a.width,height:a.height,label:role==="problem"?"확대한 문제 그림":"확대한 정답 그림",revisionKey:`${variant}:${level}:${phase}:${role}:${a.sha256}`});
 }
 return Object.freeze({render,renderBank:(id,variant,level)=>render(id,variant,level,true),frontSvg,zoomFigure,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
