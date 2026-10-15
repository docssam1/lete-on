(function(root,factory){
 "use strict";
 if(typeof module==="object"&&module.exports)module.exports=factory(require("./source-6-2-layer-cut-mission3-contracts.js"),()=>require("./source-6-2-plane-cut-assets.js"));
 else root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_LAYER_CUT_MISSION3_CONTRACTS,()=>root.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS);
})(typeof window!=="undefined"?window:globalThis,function(contracts,getAssets){
 "use strict";
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
 function grid(q,layer,role){
  if(!["problem","teacher"].includes(role)||!q.requestedLayers.includes(layer))throw new RangeError("Invalid layer diagram owner");
  const row=q.model.layers.find(r=>r.layer===layer),n=q.model.n,unit=28,pad=8,size=n*unit+2*pad,xy=p=>[pad+p[0]*unit,pad+(n-p[1])*unit];
  const band=role==="teacher"?`<polygon data-role="section-band" points="${row.bandXZ.map(p=>xy(p).join(",")).join(" ")}" fill="#dce8df" stroke="#000" stroke-width="1.25"/>`:"";
  const lines=[];for(let i=0;i<=n;i++){const p=pad+i*unit;lines.push(`<path d="M ${p} ${pad} V ${size-pad} M ${pad} ${p} H ${size-pad}" fill="none" stroke="#000" stroke-width="${i===0||i===n?1.1:.7}"/>`);}
  const dots=row.givenResponsePointsXZ.map(p=>{const[x,y]=xy(p);return`<circle data-role="given-endpoint" data-x="${p[0]}" data-z="${p[1]}" cx="${x}" cy="${y}" r="2.4" fill="#000"/>`;}).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" data-layer="${layer}" data-response-role="${role}" role="img" aria-label="${layer}층 ${role==="problem"?"답칸":"단면 정답"}">${band}${lines.join("")}${dots}</svg>`;
 }
 function layers(q,role){return `<div class="source62-layer-cut-grids" data-role="${role==="problem"?"blank-response-grids":"answer-section-bands"}">${q.requestedLayers.map(layer=>`<figure><figcaption>${layer}층</figcaption>${grid(q,layer,role)}${role==="teacher"?`<figcaption>${q.model.layers.find(row=>row.layer===layer).cutCount}개</figcaption>`:""}</figure>`).join("")}</div>`;}
 function given(q){
  const file=`${q.model.dimensions.join("x")}-given.png`,a=getAssets()?.image(file);
  if(!a||a.kind!=="given"||a.width!==1600||a.height!==1600||a.dimensions.some((n,i)=>n!==q.model.dimensions[i]))throw new Error("Invalid layer-section given asset");
  return `<img class="source62-layer-cut-solid" src="./assets/source-6-2-plane-cut/${escape(a.file)}" width="1600" height="1600" data-phase="given" data-glyph-size="72" alt="정육면체의 세 꼭짓점 A, B, C를 잇는 선">`;
 }
 function render(id,variant,level){
  const q=contracts.generate(id,variant,level),answer="단면은 아래 그림 참조. "+(Array.isArray(q.answer)?`잘린 쌓기나무 ${q.answer[0]}개, 조각 ${q.answer[1]}개`:`잘린 쌓기나무 ${q.answer}개`);
  return Object.freeze({...q,answer,prompt:`<div class="source62-layer-cut-problem" data-layer-cut-context="problem"><div class="source62-layer-cut-given"><p>${escape(q.promptText)}</p>${given(q)}</div>${layers(q,"problem")}</div>`,
   answerVisual:`<div class="source62-layer-cut-answer" data-layer-cut-context="teacher">${layers(q,"teacher")}</div>`,solution:q.solutionText,answerKeyVisual:true});
 }
 return Object.freeze({render,grid,sourceItemId:contracts.sourceItemId,sourceItemIds:contracts.sourceItemIds,registrationOnly:true,learnerReleaseVerified:false});
});
